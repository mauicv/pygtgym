var { spawnRenderProcess } = require('../gui/spawn.js')

function playEpisode(){
  spawnRenderProcess().then((guiSocket)=>{
    guiSocket.send('from guitests')
  })
}


[playEpisode].forEach(f=>f())
