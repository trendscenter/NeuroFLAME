import { generateTokens } from '../authentication.js'
import pubsub from './pubSubService.js'
import { withFilter } from 'graphql-subscriptions'

interface Context {
  userId: string
}

interface StartRunInput {
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

interface StartRunOutput {
  runId: string
}

interface runStartCentralPayload {
  runId: string
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

interface runStartEdgePayload {
  runId: string
  imageName: string
  consortiumId: string
  downloadUrl: string
  downloadToken: string
}

export default {
  Mutation: {
    startRun: async (
      _: unknown,
      { input }: { input: StartRunInput },
      context: Context,
    ): Promise<StartRunOutput> => {
      const runId = Date.now().toString()

      pubsub.publish('RUN_START_CENTRAL', {
        runId,
        imageName: input.imageName,
        userIds: input.userIds,
        consortiumId: input.consortiumId,
        computationParameters: input.computationParameters,
      })

      // mock the delay for the central federated client to report completing their provisioning and start steps
      await new Promise((resolve) => setTimeout(resolve, 10000))

      pubsub.publish('RUN_START_EDGE', {
        runId,
        imageName: input.imageName,
        consortiumId: input.consortiumId,
      })

      return { runId }
    },
  },
  Subscription: {
    runStartCentral: {
      resolve: (payload: runStartCentralPayload): runStartCentralPayload => {
        return payload
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(['RUN_START_CENTRAL']),
        // Placeholder for future filtering logic. Currently returns true for all payloads.
        (
          payload: runStartCentralPayload,
          variables: unknown,
          context: Context,
        ) => {
          return context.userId === 'central'
        },
      ),
    },
    runStartEdge: {
      resolve: (
        payload: runStartEdgePayload,
        args: unknown,
        context: Context,
      ): runStartEdgePayload => {
        const { runId, imageName, consortiumId } = payload
        // get the user's id from the context
        const userId = context.userId
        // create a token
        const tokens = generateTokens(
          { userId, runId, consortiumId },
          { shouldExpire: true },
        )

        const { accessToken } = tokens

        const output = {
          userId,
          runId,
          imageName,
          consortiumId,
          downloadUrl: `http://localhost:4002/download/${consortiumId}/${runId}/${userId}`,
          downloadToken: accessToken,
        }

        return output
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(['RUN_START_EDGE']),
        // Placeholder for future filtering logic. Currently returns true for all payloads.
        (
          payload: runStartEdgePayload,
          variables: unknown,
          context: Context,
        ) => {
          // if the user is not a part of this run, they should not receive the payload
          return true
        },
      ),
    },
  },
}
