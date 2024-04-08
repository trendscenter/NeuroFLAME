import startRun from '../../startRun/startRun.js'

export const RUN_START_SUBSCRIPTION = `
subscription runStartSubscription {
    runStart {
        consortiumId
        runId
        userIds
        computationParameters
        imageName
    }
}`

export const runStartHandler = {
  error: (err: any) => console.error('Run Start - Subscription error:', err),
  complete: () => console.log('Run Start - Subscription completed'),
  next: ({ data }: { data: any }) => {
    const {
      consortiumId,
      runId,
      userIds,
      computationParameters,
      imageName,
    } = data.runStart

    startRun({
      imageName,
      userIds,
      consortiumId,
      runId,
      computationParameters,
    })
  },
}
