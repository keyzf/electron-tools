// background.js
// https://www.electronjs.org/docs/latest/tutorial/quick-start#recap
// Modules to control application life and create native browser window
const { app, protocol, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  if (process.env.VITE_URL) {
    mainWindow.loadURL(process.env.VITE_URL).then(response => console.error('Vite URL 加载失败', response))
  } else if (process.env.VITE_PREVIEW_FILE) {
    const scheme = 'electron-tools'
    protocol.registerFileProtocol(scheme, function (request, callback) {
      const url = path.join(process.cwd(), request.url.substring(scheme.length + 2))
      // eslint-disable-next-line n/no-callback-literal
      callback({ path: url.toString() })
    })

    mainWindow.loadURL('electron-tools://dist/index.html').then(response => console.error('Vite 预览文件加载失败', response))
  } else {
    console.error('loadURL or loadFile is null/undefined')
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
