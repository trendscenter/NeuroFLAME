import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = path.resolve('log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log file paths
const logFilePath = path.join(logDir, 'application.log');
const errorLogFilePath = path.join(logDir, 'error.log');


// Create logger
const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath, level: 'info' }),
    new transports.File({ filename: errorLogFilePath, level: 'error' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') })
  ]
});

export default logger;
