import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import url from 'url'
import { start as startEdgeFederatedClient } from 'edge-federated-client'
import { createMainWindow } from './window.js'
import {
  getConfigPath,
  getConfig,
  applyDefaultConfig,
  openConfig,
} from './config.js'
import { useDirectoryDialog } from './dialogs.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
let mainWindow: BrowserWindow | null = null

// Get the configuration file path based on command-line arguments or default location
const configPath: string = getConfigPath()

// Function to create the main application window
async function createWindow(): Promise<void> {
  mainWindow = await createMainWindow(__dirname)

  // Load the correct URL (packaged or development)
  const startUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, '../../app/build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000'

  await mainWindow.loadURL(startUrl)

  // Load configuration and start the edge client if configured
  const config = await getConfig()
  if (config.startEdgeClientOnLaunch) {
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
    createWindow().catch(console.error)
  }
})

// IPC handlers for various operations
ipcMain.handle('getConfigPath', () => configPath)
ipcMain.handle('getConfig', getConfig)
ipcMain.handle('openConfig', openConfig)
ipcMain.handle('applyDefaultConfig', applyDefaultConfig)
ipcMain.handle('useDirectoryDialog', (event, pathString) => {
  if (mainWindow) {
    return useDirectoryDialog({ mainWindow, pathString })
  }
  return {
    directoryPath: undefined,
    canceled: true,
    error: 'Main window is not available',
  }
})