import * as runCoordinator from './runCoordinator/runCoordinator.js'
import { loadConfigFile, getConfig } from './config/getConfig.js'
import inMemoryStore from './inMemoryStore.js'

export async function connect(): Promise<void> {
  const { wsUrl, accessToken } = await getConfig()
  inMemoryStore.set('accessToken', accessToken)

  await runCoordinator.subscribeToCentralApi({
    wsUrl,
    accessToken: inMemoryStore.get('accessToken'),
  })
}

;(async () => {
  const configFilePath = process.argv[2]

  try {
    // Conditionally load the configuration file if a path is provided

    console.log(configFilePath)
    if (configFilePath) {
      await loadConfigFile(configFilePath)
    }

    // Execute the main connection logic
    await connect()
    console.log('Connected successfully.')
  } catch (err) {
    console.error('Failed:', err)
  }
})()
