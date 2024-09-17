import { BrowserWindow, session } from 'electron'
import path from 'path'

export async function createMainWindow(
  __dirname: string,
): Promise<BrowserWindow> {
  // TODO: handle sessions
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,
    // titleBarStyle: 'hidden',
    // trafficLightPosition: { x: 25, y: 25 },
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      session: session.fromPartition(Date.now().toString()),
    },
  })

  mainWindow.webContents.openDevTools()

  return mainWindow
}
