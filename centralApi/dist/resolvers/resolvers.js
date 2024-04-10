import pubsub from './pubSubService.js';
import { withFilter } from 'graphql-subscriptions';
export default {
    Mutation: {
        startRun: async (_, { input }, context) => {
            const runId = Date.now().toString();
            pubsub.publish('RUN_START', {
                runId,
                imageName: input.imageName,
                userIds: input.userIds,
                consortiumId: input.consortiumId,
                computationParameters: input.computationParameters,
            });
            return { runId };
        },
    },
    Subscription: {
        runStart: {
            resolve: (payload) => {
                return payload;
            },
            subscribe: withFilter(() => pubsub.asyncIterator(['RUN_START']), 
            // Placeholder for future filtering logic. Currently returns true for all payloads.
            (payload, variables, context) => {
                return true; // Example condition, adjust according to business logic.
                // return context.userId === 'central';
            }),
        },
    },
};
