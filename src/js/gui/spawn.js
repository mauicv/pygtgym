const { fork } = require('child_process')
const WebSocket = require('ws');
const http = require('http');

function _buildSocketConnect(ws) {
  var guiSocket = {
    ws: ws,
    send: (msg) => ws.send(msg)
  }
  return guiSocket
}

function spawnRenderProcess(){
  return new Promise(function(resolve, reject) {
    const port = 4445;
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      var guiSocket = _buildSocketConnect(ws)
      resolve(guiSocket);
    });

    server.listen(port);
    const guips = fork(
      `${__dirname}/../node_modules/.bin/electron`,
      [`${__dirname}/main.js`]);
  })
}


// spawnRenderProcess().then((guiSocket)=>{
//   guiSocket.send('hello')
// })

module.exports = { spawnRenderProcess }
