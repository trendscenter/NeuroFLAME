import { generateTokens } from '../authentication/authentication.js'
import getConfig from '../config/getConfig.js'
import Consortium from '../database/models/Consortium.js'
import Run from '../database/models/Run.js'
import pubsub from './pubSubService.js'
import { withFilter } from 'graphql-subscriptions'
import {
  StartRunInput,
  StartRunOutput,
  runStartCentralPayload,
  runStartEdgePayload,
} from './typeDefs.js'
interface Context {
  userId: string
  roles: string[]
}

export default {
  Mutation: {
    startRun: async (
      _: unknown,
      { input }: { input: StartRunInput },
      context: Context,
    ): Promise<StartRunOutput> => {
      // authenticate the user
      if (!context.userId) {
        throw new Error('User not authenticated')
      }

      // get the consortium details from the database
      const consortium = await Consortium.findById(input.consortiumId)
      if (!consortium) {
        throw new Error('Consortium not found')
      }

      // authorize the user
      if (consortium.leader.toString() !== context.userId) {
        throw new Error(
          'User is not authorized to start a run for this consortium',
        )
      }

      // create a new run in the database
      const run = await Run.create({
        consortium: consortium._id,
        consortiumLeader: consortium.leader,
        studyConfiguration: consortium.studyConfiguration,
        members: consortium.activeMembers,
        status: 'Provisioning',
        runErrors: [],
      })

      pubsub.publish('RUN_START_CENTRAL', {
        runId: run._id.toString(),
        imageName: consortium.studyConfiguration.computation.imageName,
        userIds: consortium.activeMembers.map((member) => member.toString()),
        consortiumId: consortium._id.toString(),
        computationParameters:
          consortium.studyConfiguration.computationParameters,
      })

      return { runId: run._id.toString() }
    },
    reportReady: async (
      _: unknown,
      { runId }: { runId: string },
      context: Context,
    ): Promise<boolean> => {
      // authenticate the user
      // is the token valid?

      // authorize the user
      // is the user id in the token `central`?

      // get the run's details from the database
      const run = await Run.findById(runId)
      const imageName = run.studyConfiguration.computation.imageName
      const consortiumId = run.consortium._id

      pubsub.publish('RUN_START_EDGE', {
        runId,
        imageName: imageName,
        consortiumId: consortiumId,
      })

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
          console.log(context)
          return context.roles.includes('central')
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
