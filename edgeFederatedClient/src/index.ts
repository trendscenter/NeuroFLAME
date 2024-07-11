import * as runCoordinator from './runCoordinator/runCoordinator.js'
import {
  setConfig,
  edgeClientLaunchConfiguration,
} from './config/config.js'
import { start as startApiServer } from './api/index.js'
// import defaultConfig from './config/defaultConfig.js'

export function start(config: edgeClientLaunchConfiguration): void {
  console.log('Starting edge federated client')
  setConfig(config)
  // launch the api server
  startApiServer({ port: config.hostingPort })
}