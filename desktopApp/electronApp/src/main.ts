import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import url, { fileURLToPath } from 'url'
import fs from 'fs'
import defaultConfig from './defaultConfig.json' with {type: 'json'}
// import {start as starteEdgeFederatedClient} from 'edgeFederatedClient'

// Import required Node modules
import { readdir } from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url)) //

let mainWindow: BrowserWindow

function filterFiles(f: string[], blacklist: string[]): string[] {
  return f.filter(u => {
    return blacklist.every(s => !u.includes(s));
  });
}

async function handleFileOpen(): Promise<{ status: string } | { filepath: string; filelist: string[] }> {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {properties: ['openFile', 'openDirectory']});

      if (!canceled && filePaths && filePaths.length > 0) {
        const files = await readdir(filePaths[0], { recursive: true });
        const blacklist = ['.DS_Store'];
        const cleanFiles = filterFiles(files, blacklist);
        
        return files.length === 0
          ? { status: 'empty' }
          : { filepath: filePaths[0], filelist: cleanFiles };
          
      } else {
        return { status: 'canceled' }; // Handle cancellation
      }
    } catch (error) {
      console.error('Error while handling file open:', error);
      return { status: 'error' };
    }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 25, y: 25 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the index.html of the app.
  const packagedUrl = url.format({
    pathname: path.join(__dirname, '../../app/build/index.html'),
    protocol: 'file:',
    slashes: true,
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow?.maximize()
  });

  const devUrl = 'http://localhost:3000'
  const startUrl = app.isPackaged ? packagedUrl : devUrl
  mainWindow.loadURL(startUrl)

  mainWindow.on('closed', () => {
    let mainWindow = null
  })

  // starteEdgeFederatedClient({
  //   httpUrl: 'http://localhost:4000/graphql',
  //   wsUrl: 'ws://localhost:4000/graphql',
  //   path_base_directory:
  //     'C:\\development\\effective-palm-tree\\_devTestDirectories\\edgeSite1',
  //   authenticationEndpoint: 'http://localhost:4000/authenticateToken',
  //   hostingPort: 9000
  // })
}

app.on('ready', createWindow)

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
})

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
