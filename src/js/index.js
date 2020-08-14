var engine = require('genesis-tubs-engine')
var GtStander = require('./gt-stander/build.js')
var { spawnRenderProcess } = require('./gui/spawn.js')

const ENVS = {
  'gt-stander': () => new GtStander.Env(),
}

var gui = {
  guiSocket: undefined,
  guiSocketConnected: false,
  guiSocketPending: false,
  cache: [],
  setup: ()=>{
    if (gui.fullyDisconnected()) {
      gui.guiSocketPending = true
      spawnRenderProcess().then((guiSocket)=>{
        gui.guiSocketConnected = true
        gui.guiSocketPending = false
        gui.guiSocket = guiSocket
      })
    }
  },
  connected: () => gui.guiSocketConnected,
  fullyDisconnected: () => {
    return !gui.guiSocketConnected &&
           !gui.guiSocketPending
  },
  pending: () => gui.guiSocketPending,
  send: (data) => {
    if (gui.connected()) {
      gui.cache.push(data)
      for (var i=0; i++; i<gui.cache.length) {
        let stepImg = gui.cache.shift()
        gui.guiSocket.send(stepImg)
      }
    } else if (gui.pending()) {
      gui.cache.push(data)
    }
  }
}

var state = {
  env: undefined,
  gui: gui,
  make: (envName) => {
    state.env = ENVS[envName]()
    return {
      action_space: state.env.action_space,
      observation_space: state.env.observation_space
    }
  },
  reset: (_) => {
    return state.env.reset()
  },
  step: (actions) => {
    return state.env.step(actions)
  },
  render: (_) => {
    var data = state.env._getImage()
    state.gui.setup()
    state.gui.send(data)
    return {'outcome': 'success'}
  }
}

process.stdin.setEncoding('utf-8')
process.stdout.setEncoding('utf-8')
process.stdin.on('readable', () => {
  const content = process.stdin.read()
  if(!!content) {
    let data = parseContent(content)
    let response = state[data.cmd](data.args)
    process.stdout.write(prepareResp(response))
  }
})

function prepareResp(data){
  dataJSON = JSON.stringify(data)
  return `${dataJSON}\n`
}

function parseContent(content){
  let data = JSON.parse(content)
  return data
}
