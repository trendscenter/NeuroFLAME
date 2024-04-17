import defaultConfig from './defaultConfig.js'
import fs from 'fs/promises'

interface FederatedClientLaunchConfiguration {
  httpUrl: string
  wsUrl: string
  path_base_directory: string
  accessToken: string
}

// Holds the configuration instance, initially set to defaultConfig
let config: FederatedClientLaunchConfiguration = defaultConfig

export async function loadConfigFile(path?: string): Promise<void> {
  if (path) {
    try {
      const data = await fs.readFile(path, 'utf8')
      config = JSON.parse(data) // Overwrite the default with the loaded config
    } catch (error) {
      console.error(`Failed to load config from ${path}:`, error)
      // Keep using the default config if there's an error
    }
  }
}

export function getConfig(): FederatedClientLaunchConfiguration {
  return config
}
