var electron = require('electron')
const { draw, clearScreen } = require('./draw.js')

electron.ipcRenderer.on('msg', (event, message) => {
  var data = JSON.parse(message)
  clearScreen()
  draw(data, 'white')
})
