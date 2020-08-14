var { spawnRenderProcess } = require('../gui/spawn.js')

function playEpisode(){
  spawnRenderProcess().then((guiSocket)=>{
    guiSocket.send('hello')
  })
}

[playEpisode].forEach(f=>f())
