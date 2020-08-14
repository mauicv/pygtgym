const { fork } = require('child_process')
const WebSocket = require('ws');
const http = require('http');

function _buildSocketConnect(ws) {
  var guiSocket = {
    ws: ws,
    send: (msg) => {
      ws.send(JSON.stringify(msg))
    }
  }
  return guiSocket
}

function spawnRenderProcess(){
  return new Promise(function(resolve, reject) {
    const port = 4444;
    const server = http.createServer();
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      var guiSocket = _buildSocketConnect(ws)
      resolve(guiSocket);
    });

    server.listen(port);

    fork(
      `${__dirname}/../node_modules/.bin/electron`,
      [`${__dirname}/main.js`]
    );
  })
}


module.exports = { spawnRenderProcess }
