import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import { createServer } from 'http'
import { makeExecutableSchema } from '@graphql-tools/schema'
import WebSocket from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import bodyParser from 'body-parser'
import cors from 'cors'

import typeDefs from './resolvers/typeDefs.js'
import resolvers from './resolvers/resolvers.js'

import { httpServerContext, wsServerContext } from './serverContexts.js'
import { validateAccessToken } from './authentication.js'

export async function start({ port }) {
  const PORT = port

  // Create schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // Create an Express app and HTTP server; we will attach the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express()
  const httpServer = createServer(app)

  // Set up WebSocket server.
  const wsServer = new WebSocket.Server({
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

  app.post('/authenticateToken', (req, res) => {
    const token = req.body.token // assuming the token is sent in the request body
    if (!token) {
      res.status(400).send('Token is required')
      return
    }

    try {
      const decodedAccessToken = validateAccessToken(token)
      if (decodedAccessToken) {
        res.status(200).json({ decodedAccessToken })
      } else {
        res.status(401).send('Token is invalid')
      }
    } catch (e) {
      res.status(401).send('Failed to decode token') // More specific error message
    }
  })

  app.post('/host/download', (req, res) => {
    // validate the token
    const decodedAccessToken = validateAccessToken(req.body.token)
    const { consortiumId, runId, userId } = decodedAccessToken
    if (!consortiumId || !runId || !userId) {
      return res.status(400).send('Missing required user payload data')
    }
    // authorize the user

    // construct the file path from the payload
    // send the file
  })

  // Now that our HTTP server is fully set up, actually listen.
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`)
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`,
    )
  })
}

start({ port: 4000 }).catch(console.error) // Proper error handling
