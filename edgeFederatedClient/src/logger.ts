import { createLogger, format, transports, Logger } from 'winston'
import path from 'path'
import fs from 'fs'

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [new transports.Console()],
})

const logToPath = (logDir: string): void => {
  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const logFilePath = path.join(logDir, 'application.log')
    const errorLogFilePath = path.join(logDir, 'error.log')

    logger.add(new transports.File({ filename: logFilePath, level: 'info' }))
    logger.add(
      new transports.File({ filename: errorLogFilePath, level: 'error' }),
    )
    logger.exceptions.handle(
      new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
    )
    logger.rejections.handle(
      new transports.File({ filename: path.join(logDir, 'rejections.log') }),
    )

    logger.info(`Logging initialized with directory: ${logDir}`)
  } catch (error) {
    console.error('Failed to set up file transports for logging:', error)
  }
}

export { logToPath, logger }
