// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var electron = require('electron')
// const { drawGraph, initGraph, clearGraph } = require('./graph.js')

electron.ipcRenderer.on('msg', (event, message) => {
  console.log(message)
})
