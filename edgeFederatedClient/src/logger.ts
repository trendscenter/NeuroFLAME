import { createLogger, format, transports, Logger } from 'winston'
import path from 'path'
import fs from 'fs'

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture full error stack traces
    format.printf(
      ({ timestamp, level, message, stack }) => {
        let logMessage = `${timestamp} ${level}: ${message}`
        if (stack) {
          logMessage += `\n${stack}`
        }
        return logMessage
      },
    ),
  ),
  transports: [new transports.Console({ 
    level: 'info',
    format: format.combine(
      format.colorize({ all: true }),
      format.simple()
    )
  })],
})

const logToPath = (logDir: string): void => {
  try {
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const logFilePath = path.join(logDir, 'application.log')
    const errorLogFilePath = path.join(logDir, 'error.log')

    // Add file transports with rotation
    logger.add(
      new transports.File({ 
        filename: logFilePath, 
        level: 'info',
        maxsize: 5 * 1024 * 1024, // 5MB max file size
        maxFiles: 5, // Keep 5 backup files
        tailable: true // Allows the last log file to be the one being written to
      })
    )
    logger.add(
      new transports.File({ 
        filename: errorLogFilePath, 
        level: 'error',
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
        tailable: true
      })
    )

    // Handle uncaught exceptions and unhandled rejections
    logger.exceptions.handle(
      new transports.File({ 
        filename: path.join(logDir, 'exceptions.log'),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5
      })
    )
    logger.rejections.handle(
      new transports.File({ 
        filename: path.join(logDir, 'rejections.log'),
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5
      })
    )

    logger.info(`Logging initialized with directory: ${logDir}`)
  } catch (error) {
    console.error('Failed to set up file transports for logging:', error)
  }
}

export { logToPath, logger }