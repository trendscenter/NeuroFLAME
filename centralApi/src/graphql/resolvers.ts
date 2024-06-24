import { generateTokens, compare } from '../authentication/authentication.js'
import getConfig from '../config/getConfig.js'
import Consortium from '../database/models/Consortium.js'
import Run from '../database/models/Run.js'
import User from '../database/models/User.js'
import Computation from '../database/models/Computation.js'
import pubsub from './pubSubService.js'
import { withFilter } from 'graphql-subscriptions'
import {
  ConsortiumListItem,
  ComputationListItem,
  StartRunInput,
  StartRunOutput,
  RunStartCentralPayload,
  RunStartEdgePayload,
  PublicUser,
  ConsortiumDetails,
} from './typeDefs.js'
interface Context {
  userId: string
  roles: string[]
}

export default {
  Query: {
    getConsortiumList: async (): Promise<ConsortiumListItem[]> => {
      const consortiums = await Consortium.find()
        .populate('leader')
        .populate('members')
        .lean() // Use lean() for better performance and to get plain JavaScript objects

      return consortiums.map((consortium) => ({
        id: consortium._id.toString(),
        title: consortium.title,
        description: consortium.description,
        leader: {
          id: (consortium.leader as any)._id.toString(),
          username: (consortium.leader as any).username,
        },
        members: (consortium.members as any[]).map((member) => ({
          id: member._id.toString(),
          username: member.username,
        })),
      }))
    },
    getComputationList: async (): Promise<ComputationListItem[]> => {
      const computations = await Computation.find().lean()
      return computations.map((computation) => ({
        id: computation._id.toString(),
        title: computation.title,
        imageName: computation.imageName,
      }))
    },
    getConsortiumDetails: async (
      _: unknown,
      { consortiumId }: {consortiumId: String}
    ): Promise<ConsortiumDetails | null> => {
      try {
        const consortium = await Consortium.findById(consortiumId)
          .populate('leader', 'id username')
          .populate('members', 'id username')
          .populate('activeMembers', 'id username')
          .populate('studyConfiguration.computation', 'title imageName imageDownloadUrl notes owner')
          .exec();
    
        if (!consortium) {
          throw new Error('Consortium not found');
        }
    
        const transformUser = (user: any): PublicUser => ({
          id: user.id,
          username: user.username,
        });
    
        return {
          title: consortium.title,
          description: consortium.description,
          leader: transformUser(consortium.leader),
          members: consortium.members.map(transformUser),
          activeMembers: consortium.activeMembers.map(transformUser),
          studyConfiguration: {
            consortiumLeaderNotes: consortium.studyConfiguration.consortiumLeaderNotes,
            computationParameters: consortium.studyConfiguration.computationParameters,
            computation: {
              title: consortium.studyConfiguration.computation.title,
              imageName: consortium.studyConfiguration.computation.imageName,
              imageDownloadUrl: consortium.studyConfiguration.computation.imageDownloadUrl,
              notes: consortium.studyConfiguration.computation.notes,
              owner: consortium.studyConfiguration.computation.owner,
            },
          },
        };
      } catch (error) {
        console.error('Error in getConsortiumDetails:', error);
        throw new Error(`Failed to fetch consortium details: ${error.message}`);
      }
    }
  },
  Mutation: {
    login: async (
      _,
      {
        username,
        password,
      }: {
        username: string
        password: string
      },
      context,
    ): Promise<string> => {
      // get the user from the database
      const user = await User.findOne({ username })
      if (!user) {
        throw new Error('User not found')
      }
      // compare the password
      if (!(await compare(password, user.hash))) {
        throw new Error('Invalid username or password')
      }

      // create a token
      const tokens = generateTokens({ userId: user._id })
      const { accessToken } = tokens as { accessToken: string }
      return accessToken
    },
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
    reportRunReady: async (
      _: unknown,
      { runId }: { runId: string },
      context: Context,
    ): Promise<boolean> => {
      console.log('reportRunReady', runId)
      // authenticate the user
      // is the token valid?
      if (!context.userId) {
        throw new Error('User not authenticated')
      }

      // authorize the user
      if (!context.roles.includes('central')) {
        throw new Error('User not authorized')
      }

      // get the run's details from the database
      const run = await Run.findById(runId)
      const result = await Run.updateOne({ _id: runId }, { status: 'Ready' })
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
    studySetComputation: async (
      _: unknown,
      {
        consortiumId,
        computationId,
      }: { consortiumId: String; computationId: String },
      context: Context,
    ): Promise<boolean> => {
      try {
        // Check to see if the consortium exists
        const consortium = await Consortium.findById(consortiumId)
        if (!consortium) {
          throw new Error('Consortium not found')
        }

        // Check if the caller is authorized
        if (consortium.leader.toString() !== context.userId) {
          throw new Error('Not authorized')
        }

        // Check to see if the computation exists
        const computation = await Computation.findById(computationId)
        if (!computation) {
          throw new Error('Computation not found')
        }

        // Set the computation in the study configuration
        consortium.set('studyConfiguration.computation', computation)
        await consortium.save()

        return true
      } catch (error) {
        console.error('Error in studySetComputation:', error)
        throw new Error(`Failed to set computation: ${error.message}`)
      }
    },
    studySetParameters: async (
      _: unknown,
      {
        consortiumId,
        parameters,
      }: { consortiumId: String; parameters: String },
      context: Context,
    ): Promise<boolean> => {
      try {
        // Check to see if the consortium exists
        const consortium = await Consortium.findById(consortiumId)
        if (!consortium) {
          throw new Error('Consortium not found')
        }

        // Check if the caller is authorized
        if (consortium.leader.toString() !== context.userId) {
          throw new Error('Not authorized')
        }

        // Set the computation in the study configuration
        consortium.set('studyConfiguration.computationParameters', parameters)
        await consortium.save()

        return true
      } catch (error) {
        console.error('Error in setStudyParameters:', error)
        throw new Error(`Failed to set computation: ${error.message}`)
      }
    },
    studySetNotes: async (
      _: unknown,
      {
        consortiumId,
        notes,
      }: { consortiumId: String; notes: String },
      context: Context,
    ): Promise<boolean> => {
      try {
        // Check to see if the consortium exists
        const consortium = await Consortium.findById(consortiumId)
        if (!consortium) {
          throw new Error('Consortium not found')
        }

        // Check if the caller is authorized
        if (consortium.leader.toString() !== context.userId) {
          throw new Error('Not authorized')
        }

        // Set the computation in the study configuration
        consortium.set('studyConfiguration.consortiumLeaderNotes', notes)
        await consortium.save()

        return true
      } catch (error) {
        console.error('Error in setStudyNotes:', error)
        throw new Error(`Failed to set computation: ${error.message}`)
      }
    },
  },
  Subscription: {
    runStartCentral: {
      resolve: (payload: RunStartCentralPayload): RunStartCentralPayload => {
        return payload
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(['RUN_START_CENTRAL']),
        // Placeholder for future filtering logic. Currently returns true for all payloads.
        (
          payload: RunStartCentralPayload,
          variables: unknown,
          context: Context,
        ) => {
          console.log(context)
          return context.roles.includes('central')
        },
      ),
    },
    runStartEdge: {
      resolve: async (
        payload: RunStartEdgePayload,
        args: unknown,
        context: Context,
      ): Promise<RunStartEdgePayload> => {
        const { runId, imageName, consortiumId } = payload
        // get the user's id from the context
        const userId = context.userId
        // create a token
        const tokens = generateTokens(
          { userId, runId, consortiumId },
          { shouldExpire: true },
        )

        const { accessToken } = tokens as { accessToken: string }

        const { fileServerUrl } = await getConfig()

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
        (payload: RunStartEdgePayload, variables: unknown, context: Context) => {
          // if the user is not a part of this run, they should not receive the payload
          return true
        },
      ),
    },
  },
}
