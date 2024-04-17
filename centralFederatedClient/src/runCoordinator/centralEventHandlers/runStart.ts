import startRun from '../../startRun/startRun.js'

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
  error: (err: any) => console.error('Run Start Central - Subscription error:', err),
  complete: () => console.log('Run Start Central - Subscription completed'),
  next: ({ data }: { data: any }) => {
    const {
      consortiumId,
      runId,
      userIds,
      computationParameters,
      imageName,
    } = data.runStartCentral

    startRun({
      imageName,
      userIds,
      consortiumId,
      runId,
      computationParameters,
    })
  },
}
