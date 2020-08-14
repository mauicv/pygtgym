var engine = require('genesis-tubs-engine')
var GtStander = require('./gt-stander/build.js')
var { spawnRenderProcess } = require('./gui/spawn.js')

const ENVS = {
  'gt-stander': () => new GtStander.Env(),

}

var state = {
  env: undefined,
  guiSocket: undefined,
  make: (envName) => {
    this.env = ENVS[envName]()
    return {
      action_space: this.env.action_space,
      observation_space: this.env.observation_space
    }
  },
  reset: (_) => {
    return this.env.reset()
  },
  step: (actions) => {
    return this.env.step(actions)
  },
  render: (_) => {
    var data = this.env._getImage()
    if (!this.guiSocket) {
      spawnRenderProcess().then((guiSocket)=>{
        this.guiSocket = guiSocket
        this.guiSocket.send(data)
      })
    } else {
      this.guiSocket.send(data)
    }

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
