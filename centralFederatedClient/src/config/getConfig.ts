import fs from 'fs/promises'
import defaultConfig from './defaultConfig.js'

interface CentralFederateClientConfig {
  httpUrl: string
  wsUrl: string
  accessToken: string
  userId: string
  fileServerUrl: string
  baseDir: string
  FQDN: string
}

export default async function getConfig(): Promise<
  CentralFederateClientConfig
> {
  const configPath = getConfigPath()

  if (configPath) {
    // console.log(`Attempting to load config from: ${configPath}`)
    try {
      const config = await loadConfigFromFile(configPath)
      // console.log(`Loaded configuration from: ${configPath}`)
      return config
    } catch (error) {
      console.error(`Failed to load config from ${configPath}:`, error)
    }
  }

  console.log('Loading default configuration.')
  return defaultConfig
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
  return envPath ? `${envPath}/centralApiConfig.json` : undefined
}

async function loadConfigFromFile(path: string): Promise<CentralFederateClientConfig> {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}
