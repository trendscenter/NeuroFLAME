import pubsub from './pubSubService.js';
import { withFilter } from 'graphql-subscriptions';
export default {
    Mutation: {
        startRun: async (_, { input }, context) => {
            // is this user authorized?
            // is this a valid user
            // is this user an admin of the consortium they are trying to run?
            // generate a runId
            // create a run in the database
            const runId = '1234';
            // const launchConfiguration = await provisionRun({
            //   imageName: input.imageName,
            //   userIds: input.userIds,
            //   consortiumId: input.consortiumId,
            //   runId,
            //   computationParameters: input.computationParameters,
            // })
            // await call to provision run
            // emit a start run event
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
            resolve: (payload, args, context) => {
                return payload;
            },
            subscribe: withFilter((_, __, context) => {
                return pubsub.asyncIterator(['RUN_START']);
            }, (payload, variables, context) => {
                console.log('context', context);
                return true;
                // return context.userId === 'central'
            }),
        },
    },
};
