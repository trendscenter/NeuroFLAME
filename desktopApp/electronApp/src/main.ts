import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import url, { fileURLToPath } from 'url'
import fs from 'fs'
import { defaultConfig } from './defaultConfig.js'
import { start as startEdgeFederatedClient } from 'edge-federated-client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null

// Get the configuration file path based on command-line arguments or default location
const configPath: string = getConfigPath()

async function createWindow(): Promise<void> {
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
  const packagedUrl: string = url.format({
    pathname: path.join(__dirname, '../../app/build/index.html'),
    protocol: 'file:',
    slashes: true,
  })

  const devUrl: string = 'http://localhost:3000'
  const startUrl: string = app.isPackaged ? packagedUrl : devUrl
  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Load configuration
  const config = await getConfig()

  if (config.startEdgeClientOnLaunch) {
    startEdgeFederatedClient(config.edgeClientConfig)
  }
}

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

function getConfigPath(): string {
  const args: string[] = process.argv.slice(1) // Skip the first argument which is the path to node
  const configArgIndex: number = args.findIndex((arg) =>
    arg.startsWith('--config='),
  )
  return configArgIndex !== -1
    ? path.resolve(args[configArgIndex].split('=')[1])
    : path.join(app.getPath('userData'), 'config.json')
}

async function getConfig(): Promise<typeof defaultConfig> {
  console.log('Reading configuration from:', configPath)

  try {
    const config = await fs.promises.readFile(configPath, 'utf8')
    return JSON.parse(config)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(
        'Configuration file not found, creating default configuration.',
      )
      await fs.promises.writeFile(
        configPath,
        JSON.stringify(defaultConfig, null, 2),
      )
      return defaultConfig
    } else {
      console.error('Failed to read or parse the configuration file:', error)
      throw new Error('Failed to access the configuration file.')
    }
  }
}

ipcMain.handle('getConfig', getConfig)

ipcMain.handle('applyDefaultConfig', async () => {
  await fs.promises.writeFile(
    configPath,
    JSON.stringify(defaultConfig, null, 2),
  )
})

ipcMain.handle('getConfigPath', () => {
  return configPath
})

ipcMain.handle('openConfig', async () => {
  try {
    await shell.openPath(configPath)
  } catch (e) {
    console.error('Failed to open path:', e)
    throw new Error('Failed to open path')
  }
})
