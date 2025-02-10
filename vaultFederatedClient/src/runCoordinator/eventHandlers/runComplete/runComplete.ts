import getConfig from '../../../config/getConfig.js'
import path from 'path'
import { logger } from '../../../logger.js'

export const RUN_COMPLETE_SUBSCRIPTION = `
subscription runCompleteSubscription {
    runComplete {
        consortiumId
        runId
    }
}`

export const runCompleteHandler = {
  error: (err: any) =>
    logger.error(`Run Complete - Subscription error`, { error: err }),
  complete: () => logger.info('Run Complete - Subscription completed'),
  next: async ({ data }: { data: any }) => {
    logger.info('Run Complete - Received data')
    try {
      const { consortiumId, runId } = data.runComplete

      const { baseDir } = await getConfig()

      const consortiumPath = path.join(baseDir, consortiumId)
      const runPath = path.join(consortiumPath, runId)


      // get results directory

      // zip directory contents

      // upload to results server
        // report initiated
        // report completed
        // report error

    } catch (e) {
      logger.error('Run Complete - Error processing data', { error: e })
    }
  },
}