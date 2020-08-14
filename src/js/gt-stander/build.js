
var engine = require('genesis-tubs-engine')
const fs = require('fs')
const gm = engine.GeneralMethods
const { makeGravityLaw, makeAirResistanceLaw, jointController } = require('./effects.js')

class Env {
  constructor() {
    this.observation_space = 7
    this.action_space = 6
    this.iter = 0
    this.done = false
  }

  reset(){
    this.environment = this._buildEnv()
    this.joints = []
    this.torso = []
    this.torsoCenterY = 0
    this.controls = {}
    this.initalPos=[]
    this.iter = 0
    this._buildEmbeddedActor()
    return this._getState()
  }

  step(action){
    action.forEach((value, index) =>
      this.controls[index].state = value)
    this.environment.timeStep()
    this.iter = this.iter + 1
    return this._computeOutcomes()
  }

  _buildEmbeddedActor(){
    this.joints = this.environment.constraints.filter(c=>c.type == 'joint')
    this.torso = this.environment.convexSets[1].getPoints()
    this.torsoCenterY = this._computeTorsoCenter()
    this.controls = {}

    this.joints.forEach((joint, i)=>{
      joint.rigidityConstant = 0.0001
      this.controls[i] = { state: 0 }
      this.environment.laws[i] = jointController({
        joint: joint,
        util: this.controls[i],
        forceBounds: [-10, 10]
      })
      this.initalPos[i] = joint.getAngle()
    })
  }

  _buildEnv(){
    var Data_string = fs.readFileSync(`${__dirname}/env.txt`,  'utf8');
    var environment = engine.SL.parseGTBFormat(Data_string)
    environment.laws.gravity = makeGravityLaw()
    environment.laws.airResistance = makeAirResistanceLaw()
    environment.structures.forEach(structure => {
      environment.builder.addBoundingRect(structure);
      structure.features.push(engine.featureInstances["mass"])
      environment.laws.gravity.structures.push(structure)
      environment.laws.airResistance.structures.push(structure)
    })

    environment.structures[1].fix()
    return environment
  }

  _computeOutcomes(){
    if (this.done) return [this._getState(), 0, this.done, undefined]

    let done = this._checkFinished()
    if (done){
      this.done = done
      return [this._getState(), 100, done, undefined]
    } else if (this.iter > 1000) {
      this.done = true
      return [this._getState(), -100, true, undefined]
    }
    return [this._getState(), this._getReward(), false, undefined]
  }

  _checkFinished(){
    var finished = false
    this.torso.forEach(point=>{
      if(engine.CollisionChecker.xInB(
        point.x, this.environment.structures[1].elements[0].links) < 0) {
          finished = true
        }
      })
    return finished
  }

  _getState() {
      let jointAngles = this.joints
        .map((joint, i)=>(joint.getAngle() - this.initalPos[i]))
      let torsoCenter = (this._computeTorsoCenter()[1]-200)/400
      return [...jointAngles, torsoCenter]
    }

  _getReward(){
    let distFromCenter = Math.sqrt(Math.pow(this._computeTorsoCenter()[0] - this.torsoCenterY[0], 2) +
      Math.pow(this._computeTorsoCenter()[1] - this.torsoCenterY[1], 2))
    return distFromCenter
  }

  _computeTorsoCenter(){
    var avgX = 0
    var avgY = 0
    this.torso.forEach(point=>{
      avgX = avgX + point.x[0]
      avgY = avgY + point.x[1]
    })
    return [avgX/4, avgY/4]
  }

  getImage(){
    return this.environment.constraints
      .filter(c=>c.visable)
      .map(c=>{
        return [
          [
            c.from.x[0],
            c.from.x[1]
          ],
          [
            c.to.x[0],
            c.to.x[1]
          ]
        ]
      })
  }

}

module.exports = { Env }
