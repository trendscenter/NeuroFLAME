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

  const config = await getConfig()

  // Define default paths directly
  const defaultAppLogPath = path.join(app.getPath('userData'), 'logs')
  const defaultEdgeClientBasePath = path.join(app.getPath('userData'), 'base')

  // Set log path and initialize logging
  const appLogPath = config.logPath || defaultAppLogPath
  logToPath(appLogPath)

  if (config.startEdgeClientOnLaunch) {
    const defaultEdgeClientLogPath = path.join(appLogPath, 'edgeClient')

    const edgeClientLogPath =
      config.edgeClientConfig.logPath || defaultEdgeClientLogPath
    const edgeClientBasePath =
      config.edgeClientConfig.path_base_directory || defaultEdgeClientBasePath

    const edgeClientConfig = {
      ...config.edgeClientConfig,
      logPath: edgeClientLogPath,
      path_base_directory: edgeClientBasePath,
    }

    startEdgeFederatedClient(edgeClientConfig)
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    createNewWindow(url, mainWindow);
    return { action: 'deny' };  // Prevent the default behavior (opening in the browser)
  });

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

function createNewWindow(url:string, mainWindow:any) {
  // Get the current position of the main window
  const { x, y } = mainWindow.getBounds();

  // Define an offset (e.g., 100px right and 100px down from the main window)
  const offsetX = 100;
  const offsetY = 100;

  // Create a new BrowserWindow with the offset position
  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: x + offsetX,
    y: y + offsetY,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the URL into the new window
  newWindow.loadURL(url);
}