import express from 'express'
import downloadRoute from './routes/downloadRoute.js'
import uploadRoute from './routes/uploadRoute.js'
import getConfig from './config/getConfig.js'
import { logger, logToPath } from './logger.js'

const init = async () => {
  const app = express()
  const config = await getConfig()
  if (config.logPath) {
    logToPath(config.logPath)
  }
  const { port: PORT } = config

  app.use(express.json())

  app.use('/', downloadRoute)
  app.use('/', uploadRoute)

  app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`))
}

init().catch((error: any) => {
  logger.error('Failed to initialize server:', error)
  process.exitCode = 1
})
