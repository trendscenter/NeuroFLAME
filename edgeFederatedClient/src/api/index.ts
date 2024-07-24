import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import { createServer } from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import WebSocket, { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import bodyParser from 'body-parser'
import cors from 'cors'
import logger from '../logger.js'

import { typeDefs } from './graphql/typeDefs.js'
import { resolvers } from './graphql/resolvers.js'

import { httpServerContext, wsServerContext } from './serverContexts.js'

export async function start({ port }: { port: number }) {
  const PORT = port
  // Create schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // Create an Express app and HTTP server; we will attach the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express()
  const httpServer = createServer(app)

  // Set up WebSocket server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer(
    {
      schema,
      context: wsServerContext,
    },
    wsServer,
  )

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: httpServerContext,
    }),
  )

  // Now that our HTTP server is fully set up, actually listen.
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`)
    logger.info(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`,
    )
  })
}
