import { app, BrowserWindow } from 'electron'
import path from 'path'
import url, { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Enabling nodeIntegration allows Node.js modules to be used in the renderer process
      nodeIntegration: true,
      // Context isolation is a security feature that helps prevent attacks
      contextIsolation: false,
    },
  })

  // Load the index.html of the app.
  const startUrl = app.isPackaged
    ? url.format({
        // pathname: path.join(__dirname, '../../reactApp/build/index.html'),
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000'

  console.log({ startUrl })
  mainWindow.loadURL(startUrl)

  // Open the DevTools. - Uncomment the next line if you want to open the DevTools automatically
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
