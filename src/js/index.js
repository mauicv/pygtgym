var engine = require('genesis-tubs-engine')
var GtStander = require('./gt-stander/build.js')

const ENVS = {
  'gt-stander': () => new GtStander.Env(),

}

var state = {
  env: undefined,
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
