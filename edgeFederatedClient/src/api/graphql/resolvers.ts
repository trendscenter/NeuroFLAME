import * as runCoordinator from '../../runCoordinator/runCoordinator.js'
import { getConfig } from '../../config/config.js'
import path from 'path'
import fs from 'fs/promises'

export const resolvers = {
  Query: {
    hello: (): string => 'Hello from the edge federated client!',
    getMountDir: async (
      _: any,
      { consortiumId }: { consortiumId: string },
      context: any,
    ): Promise<string> => {
      // Check if the caller is authorized
      const { tokenPayload } = context
      const { userId } = tokenPayload
      if (!tokenPayload || !userId) {
        throw new Error('Not authorized')
      }

      const { path_base_directory } = getConfig()
      const consortiumDir = path.join(path_base_directory, consortiumId)

      try {
        // Read the mount_config.json file
        const configPath = path.join(consortiumDir, 'mount_config.json')
        const configFile = await fs.readFile(configPath, 'utf-8')
        const config = JSON.parse(configFile)

        return config.dataPath
      } catch (error) {
        console.error('Error reading mount directory:', error)
        throw new Error('Failed to read mount directory')
      }
    },
  },

  Mutation: {
    connectAsUser: async (_: any, args: any, context: any): Promise<string> => {
      try {
        // Make the runCoordinator connect to the centralApi
        const { wsUrl } = getConfig()
        runCoordinator.subscribeToCentralApi({
          wsUrl,
          accessToken: context.accessToken,
        })
        return JSON.stringify(context)
      } catch (error) {
        console.error('Error in connectAsUser:', error)
        throw new Error('Failed to connect as user')
      }
    },
    setMountDir: async (
      _: any,
      { consortiumId, mountDir }: { consortiumId: string; mountDir: string },
      context: any,
    ): Promise<boolean> => {
      try {
        const { path_base_directory } = getConfig()
        const consortiumDir = path.join(path_base_directory, consortiumId)

        // Ensure the consortium directory exists
        await fs.mkdir(consortiumDir, { recursive: true })

        // Define the path to the mount_config.json file
        const configPath = path.join(consortiumDir, 'mount_config.json')

        // Write the mountDir to the mount_config.json file
        const configContent = { dataPath: mountDir }
        await fs.writeFile(configPath, JSON.stringify(configContent, null, 2))

        return true
      } catch (error) {
        console.error('Error in setMountDir:', error)
        throw new Error('Failed to set mount directory')
      }
    },
  },
}
