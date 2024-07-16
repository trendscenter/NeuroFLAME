import { BrowserWindow, session } from 'electron'
import path from 'path'

export async function createMainWindow(
  __dirname: string,
): Promise<BrowserWindow> {

  // TODO: handle sessions
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    // frame: false,
    // titleBarStyle: 'hidden',
    // trafficLightPosition: { x: 25, y: 25 },
    // fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      session: session.fromPartition(Date.now().toString())
    },
  })

  return mainWindow
}
