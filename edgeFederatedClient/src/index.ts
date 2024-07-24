import { logToPath, logger } from './logger.js'

import { setConfig, edgeClientLaunchConfiguration } from './config/config.js'
import { start as startApiServer } from './api/index.js'

export function start(config: edgeClientLaunchConfiguration): void {
  logger.info('Starting edge federated client')
  setConfig(config)
  if (config.logPath) {
    logToPath(config.logPath)
  }
  // launch the api server
  startApiServer({ port: config.hostingPort })
}
