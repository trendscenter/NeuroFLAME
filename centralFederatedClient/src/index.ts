import * as runCoordinator from './runCoordinator/runCoordinator.js'
import getConfig from './config/getConfig.js'
import logger from './logger.js'

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


;(async () => {
  try {
    const config = await getConfig()
    await start(config)
  } catch (err) {
    logger.error('Failed:', err)
  }
})()
