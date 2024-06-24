import * as runCoordinator from '../../runCoordinator/runCoordinator.js';
import { getConfig } from '../../config/config.js';
import path from 'path';
import fs from 'fs/promises';

export const resolvers = {
  Query: {
    hello: (): string => 'Hello from the edge federated client!',
  },
  Mutation: {
    connectAsUser: async (_: any, args: any, context: any): Promise<string> => {
      try {
        // Make the runCoordinator connect to the centralApi
        const { wsUrl } = getConfig();
        runCoordinator.subscribeToCentralApi({
          wsUrl,
          accessToken: context.accessToken,
        });
        return JSON.stringify(context);
      } catch (error) {
        console.error('Error in connectAsUser:', error);
        throw new Error('Failed to connect as user');
      }
    },
    setMountDir: async (
      _: any,
      { consortiumId, mountDir }: { consortiumId: string; mountDir: string },
      context: any,
    ): Promise<boolean> => {
      try {
        const { path_base_directory } = getConfig();
        const consortiumDir = path.join(path_base_directory, consortiumId);

        // Ensure the consortium directory exists
        await fs.mkdir(consortiumDir, { recursive: true });

        // Define the path to the mount_config.json file
        const configPath = path.join(consortiumDir, 'mount_config.json');

        // Write the mountDir to the mount_config.json file
        const configContent = { mountDir };
        await fs.writeFile(configPath, JSON.stringify(configContent, null, 2));

        return true;
      } catch (error) {
        console.error('Error in setMountDir:', error);
        throw new Error('Failed to set mount directory');
      }
    },
  },
};
