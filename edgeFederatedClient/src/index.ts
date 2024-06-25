import * as runCoordinator from './runCoordinator/runCoordinator.js'
import {
  setConfig,
  getConfig,
  edgeClientLaunchConfiguration,
} from './config/config.js'
import inMemoryStore from './inMemoryStore.js'
import {start as startApiServer} from './api/index.js'
import defaultConfig from './config/defaultConfig.js'


export function start(config: edgeClientLaunchConfiguration): void {
  setConfig(config)
  // launch the api server
  startApiServer({ port: config.hostingPort })
}

export async function connect(accessToken: string): Promise<void> {
  const { wsUrl } = await getConfig()
  inMemoryStore.set('accessToken', accessToken)

  await runCoordinator.subscribeToCentralApi({
    wsUrl,
    accessToken: inMemoryStore.get('accessToken'),
  })
}

// ;(async () => {
//   start(defaultConfig)
// })()
