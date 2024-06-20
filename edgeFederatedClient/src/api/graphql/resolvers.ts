import * as runCoordinator from '../../runCoordinator/runCoordinator.js'
import { getConfig } from '../../config/config.js'

export const resolvers = {
  Query: {
    hello: (): string => 'Hello from the edge federated client!',
  },
  Mutation: {
    connectAsUser: async (_: any, args: any, context: any): Promise<string> => {
      // make the runCoordinator connect to the centralApi
      const { wsUrl } = getConfig()
      runCoordinator.subscribeToCentralApi({
        wsUrl,
        accessToken: context.accessToken,
      })
      return JSON.stringify(context)
    },
  },
}
