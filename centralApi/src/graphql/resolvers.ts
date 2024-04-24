import { generateTokens } from '../authentication/authentication.js'
import getConfig from '../config/getConfig.js'
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

      return { runId }
    },
    reportReady: async (
      _: unknown,
      { runId }: { runId: string },
      context: Context,
    ): Promise<boolean> => {
      // authenticate the user
      // authorize the user
      // get the run's details from the database
      // publish the `RUN_START_EDGE` event

      // pubsub.publish('RUN_START_EDGE', {
      //   runId,
      //   imageName: input.imageName,
      //   consortiumId: input.consortiumId,
      // })

      return true
    },
    reportError: async (
      _: unknown,
      { runId, errorMessage }: { runId: string; errorMessage: string },
    ): Promise<boolean> => {
      return true
    },
    reportComplete: async (_: unknown, { runId }): Promise<boolean> => {
      return true
    },
    reportStatus: async (
      _: unknown,
      { runId, statusMessage }: { runId: string; statusMessage: string },
    ): Promise<boolean> => {
      return true
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

        const { accessToken } = tokens as { accessToken: string }

        const { fileServerUrl } = getConfig()

        const output = {
          userId,
          runId,
          imageName,
          consortiumId,
          downloadUrl: `${fileServerUrl}/download/${consortiumId}/${runId}/${userId}`,
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
