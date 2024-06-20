import fs from 'fs/promises'
import path from 'path'
import defaultConfig from './defaultConfig.js'

interface FederatedClientLaunchConfiguration {
  httpUrl: string
  wsUrl: string
  path_base_directory: string
  accessToken: string
}

// Holds the configuration instance, initially set to null
let config: FederatedClientLaunchConfiguration | null = null

export async function initializeConfig(): Promise<void> {
  const configPath = getConfigPath()

  if (configPath) {
    console.log(`Attempting to load config from: ${configPath}`)
    try {
      config = await loadConfigFromFile(configPath)
      console.log(`Configuration loaded from: ${configPath}`)
    } catch (error) {
      console.error(
        `Failed to load or create config from ${configPath}:`,
        error,
      )
      config = defaultConfig
      console.log('Using default configuration.')
    }
  } else {
    console.log(
      'No config path provided via arguments or environment variable. Using default configuration.',
    )
    config = defaultConfig
  }
}

function getConfigPath(): string | undefined {
  return getConfigPathFromArgs() || getConfigPathFromEnv()
}

function getConfigPathFromArgs(): string | undefined {
  const arg = process.argv.find((arg) => arg.startsWith('--config='))
  return arg ? arg.split('=')[1] : undefined
}

function getConfigPathFromEnv(): string | undefined {
  const envPath = process.env.COINSTAC_CONFIGURATIONS_FOLDER
  return envPath ? path.join(envPath, 'federatedClientConfig.json') : undefined
}

async function loadConfigFromFile(
  filePath: string,
): Promise<FederatedClientLaunchConfiguration> {
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

export async function getConfig(): Promise<FederatedClientLaunchConfiguration> {
  if (!config) {
    await initializeConfig()
  }
  return config || defaultConfig
}
