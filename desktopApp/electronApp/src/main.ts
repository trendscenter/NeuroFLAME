import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import url, { fileURLToPath } from 'url'
import fs from 'fs'
import {defaultConfig} from './defaultConfig.js'
import {start as startEdgeFederatedClient} from 'edge-federated-client'



const __dirname = path.dirname(fileURLToPath(import.meta.url)) //

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: ['this is a test', 'this is another test'],
    },
  })

  // Load the index.html of the app.
  const packagedUrl = url.format({
    pathname: path.join(__dirname, '../../app/build/index.html'),
    protocol: 'file:',
    slashes: true,
  })

  const devUrl = 'http://localhost:3000'
  const startUrl = app.isPackaged ? packagedUrl : devUrl
  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  startEdgeFederatedClient({
    httpUrl: 'http://localhost:4000/graphql',
    wsUrl: 'ws://localhost:4000/graphql',
    path_base_directory:
      'C:\\development\\effective-palm-tree\\_devTestDirectories\\edgeSite1',
    authenticationEndpoint: 'http://localhost:4000/authenticateToken',
    hostingPort: 9000
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.handle('getConfig', async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json')
  console.log('Reading configuration from:', configPath)

  try {
    const config = await fs.promises.readFile(configPath, 'utf8')
    return JSON.parse(config) // Parse and return the configuration
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File does not exist, create it with default configuration
      console.log(
        'Configuration file not found, creating default configuration.',
      )
      await fs.promises.writeFile(
        configPath,
        JSON.stringify(defaultConfig, null, 2),
      )
      return defaultConfig
    } else {
      // Handle other errors more specifically
      console.error('Failed to read or parse the configuration file:', error)
      throw new Error('Failed to access the configuration file.')
    }
  }
})
