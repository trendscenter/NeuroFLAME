import reportRunError from './reportRunError.js'
import reportRunReady from './reportRunReady.js'
import startRun from './startRun.js'

export const RUN_START_SUBSCRIPTION = `
subscription runStartSubscription {
    runStartCentral {
        consortiumId
        runId
        userIds
        computationParameters
        imageName
    }
}`

export const runStartHandler = {
  error: (err: any) =>
    console.error('Run Start Central - Subscription error:', err),
  complete: () => console.log('Run Start Central - Subscription completed'),
  next: async ({ data }: { data: any }) => {
    const {
      consortiumId,
      runId,
      userIds,
      computationParameters,
      imageName,
    } = data.runStartCentral

    try {
      await startRun({
        imageName,
        userIds,
        consortiumId,
        runId,
        computationParameters,
      })
      // report to the central api that the run is ready
      return await reportRunReady({ runId })
    } catch (e: any) {
      console.error('Run Start Central - Error:', e)
      return await reportRunError({ runId, errorMessage: e.toString() })
    }
  },
}
