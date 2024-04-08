import { promises as fs } from 'fs'
import * as runCoordinator from './runCoordinator/runCoordinator.js'
import defaultConfig from './defaultConfig.js'

interface FederatedClientLaunchConfiguration {
  httpUrl: string
  wsUrl: string
  accessToken: string
  userId: string
}

export async function start(
  config: FederatedClientLaunchConfiguration,
): Promise<void> {
  // Subscribe to events and attach handlers
  const { wsUrl, accessToken } = config

  await runCoordinator.subscribeToCentralApi({
    wsUrl,
    accessToken,
  })
}

async function loadConfig(
  filePath: string,
): Promise<FederatedClientLaunchConfiguration> {
  const configFile = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(configFile)
}

;(async () => {
  try {
    await start(defaultConfig)
  } catch (err) {
    console.error('Failed:', err)
  }
})()
