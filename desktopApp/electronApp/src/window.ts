import { BrowserWindow } from 'electron'
import path from 'path'

export async function createMainWindow(
  __dirname: string,
): Promise<BrowserWindow> {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    frame: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 25, y: 25 },
    //fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  return mainWindow
}
