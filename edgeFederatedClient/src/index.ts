import * as runCoordinator from './runCoordinator/runCoordinator.js'
import getConfig from './config/getConfig.js'
import inMemoryStore from './inMemoryStore.js'

export async function connect(): Promise<void> {
  const { wsUrl } = await getConfig()
  const accessToken = inMemoryStore.get('accessToken')

  await runCoordinator.subscribeToCentralApi({
    wsUrl,
    accessToken,
  })
}

;(async () => {
  try {
    inMemoryStore.set(
      'accessToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNpdGUxIiwiaWF0IjoxNzEyNzYzOTg5fQ.YsDZBYpMgStfSSLkSq6UgYC7vGjOcZ86SDobdGqPtwI',
    )
    await connect()
  } catch (err) {
    console.error('Failed:', err)
  }
})()
