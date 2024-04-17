import { generateTokens } from '../authentication.js';
import pubsub from './pubSubService.js';
import { withFilter } from 'graphql-subscriptions';
export default {
    Mutation: {
        startRun: async (_, { input }, context) => {
            const runId = Date.now().toString();
            pubsub.publish('RUN_START_CENTRAL', {
                runId,
                imageName: input.imageName,
                userIds: input.userIds,
                consortiumId: input.consortiumId,
                computationParameters: input.computationParameters,
            });
            // mock the delay for the central federated client to report completing their provisioning and start steps
            await new Promise((resolve) => setTimeout(resolve, 10000));
            pubsub.publish('RUN_START_EDGE', {
                runId,
                imageName: input.imageName,
                consortiumId: input.consortiumId,
            });
            return { runId };
        },
    },
    Subscription: {
        runStartCentral: {
            resolve: (payload) => {
                return payload;
            },
            subscribe: withFilter(() => pubsub.asyncIterator(['RUN_START_CENTRAL']), 
            // Placeholder for future filtering logic. Currently returns true for all payloads.
            (payload, variables, context) => {
                return context.userId === 'central';
            }),
        },
        runStartEdge: {
            resolve: (payload, args, context) => {
                const { runId, imageName, consortiumId } = payload;
                // get the user's id from the context
                const userId = context.userId;
                // create a token
                const tokens = generateTokens({ userId, runId, consortiumId }, { shouldExpire: true });
                const { accessToken } = tokens;
                const output = {
                    userId,
                    runId,
                    imageName,
                    consortiumId,
                    downloadUrl: `http://localhost:4002/download/${consortiumId}/${runId}/${userId}`,
                    downloadToken: accessToken,
                };
                return output;
            },
            subscribe: withFilter(() => pubsub.asyncIterator(['RUN_START_EDGE']), 
            // Placeholder for future filtering logic. Currently returns true for all payloads.
            (payload, variables, context) => {
                // if the user is not a part of this run, they should not receive the payload
                return true;
            }),
        },
    },
};
