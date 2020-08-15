const electron = require('electron')
const WebSocket = require('ws');

function createWindow () {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('index.html')
  // win.webContents.openDevTools()
  win.webContents.on('did-finish-load', () => connectSocket(win))
}

function connectSocket(win){
  // try {
  //  TODO: try until connect then return ...
  // }
  var socket = new WebSocket('ws://localhost:4444')
  socket.on('message', (msg)=>{
    win.webContents.send('msg', msg)
  })
}

electron.app.whenReady().then(createWindow)

electron.app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electron.app.quit()
  }
})

electron.app.on('activate', () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
