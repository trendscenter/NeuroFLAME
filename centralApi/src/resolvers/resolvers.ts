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

interface RunStartPayload {
  runId: string
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

export default {
  Mutation: {
    startRun: async (
      _: unknown,
      { input }: { input: StartRunInput },
      context: Context,
    ): Promise<StartRunOutput> => {
      const runId = '1234' // Simulated run ID generation logic

      pubsub.publish('RUN_START', {
        runId,
        imageName: input.imageName,
        userIds: input.userIds,
        consortiumId: input.consortiumId,
        computationParameters: input.computationParameters,
      })

      return { runId }
    },
  },
  Subscription: {
    runStart: {
      resolve: (payload: RunStartPayload): RunStartPayload => {
        return payload
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(['RUN_START']),
        // Placeholder for future filtering logic. Currently returns true for all payloads.
        (payload: RunStartPayload, variables: unknown, context: Context) => {
          return true // Example condition, adjust according to business logic.
          // return context.userId === 'central';
        },
      ),
    },
  },
}
