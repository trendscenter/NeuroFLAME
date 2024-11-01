import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import url from 'url'
import { start as startEdgeFederatedClient } from 'edge-federated-client'
import { logger, logToPath } from './logger.js'
import { createMainWindow } from './window.js'
import {
  getConfigPath,
  getConfig,
  applyDefaultConfig,
  openConfig,
  saveConfig,
} from './config.js'
import { useDirectoryDialog } from './dialogs.js'

const configPath: string = getConfigPath()

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let mainWindow: BrowserWindow | null = null

// Get the configuration file path based on command-line arguments or default location

// Function to create the main application window
async function createWindow(): Promise<void> {
  mainWindow = await createMainWindow(__dirname)
  const appPath = app.getAppPath()
  const productionUrl = url.format({
    pathname: path.join(appPath, '../app/build/index.html'),
    protocol: 'file:',
    slashes: true,
  })
  const developmentUrl = 'http://localhost:3000'
  // Load the correct URL (packaged or development)
  const startUrl = app.isPackaged ? productionUrl : developmentUrl

  await mainWindow.loadURL(startUrl)

  // Load configuration and start the edge client if configured
  const config = await getConfig()
  const logPath = config.logPath || path.join(app.getPath('userData'), './logs')
  logToPath(logPath)

  if (config.startEdgeClientOnLaunch) {
    config.edgeClientConfig.logPath = path.join(logPath, './edgeClient')
    startEdgeFederatedClient(config.edgeClientConfig)
  }

  // Handle window close event
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Event listeners for application lifecycle
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow().catch(logger.error)
  }
})

// IPC handlers for various operations
ipcMain.handle('getConfigPath', () => configPath)
ipcMain.handle('getConfig', getConfig)
ipcMain.handle('openConfig', openConfig)
ipcMain.handle('saveConfig', async (event, configString) => {
  return await saveConfig(configString)
})
ipcMain.handle('applyDefaultConfig', applyDefaultConfig)
ipcMain.handle('useDirectoryDialog', (event, pathString) => {
  logger.info('useDirectoryDialog', { pathString })
  if (mainWindow) {
    return useDirectoryDialog({ mainWindow, pathString })
  }
  return {
    directoryPath: undefined,
    canceled: true,
    error: 'Main window is not available',
  }
})
ipcMain.handle('restartApp', () => {
  app.relaunch() // Relaunch the application with the same arguments and working directory
  app.exit(0) // Exit the current instance
})
