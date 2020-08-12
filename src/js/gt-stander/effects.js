var engine = require('genesis-tubs-engine')
const gm = engine.GeneralMethods

////////////////////////////////////////////////////
// NOTE: The gravity lawInstance ends up duplicating
// across all instances of the engine environment.
// This causes a memory leak.
////////////////////////////////////////////////////

function makeGravityLaw(){
  var gravity = new engine.Law("Gravity");
	gravity.effects= function(){
    this.applyToAllPoints(function(point){
      point.update_x_xd([0,0.001]);
    })
  }
  return gravity;
}

function makeAirResistanceLaw(){
    var airResistance = new engine.Law("AirResistance");
    //airResistance.frictionalConstant=0.001;
    airResistance.effects=function(){
      this.applyToAllPoints(function(point){
				point.update_x_xd(gm.mult(gm.minus(point.x_old,point.x),0.002));
      })
    }
  return airResistance;
}

////////////////////////////////////////////////////

const jointController = function({joint, util, forceBounds}) {
  var engine = require('genesis-tubs-engine')
  var controller = new engine.Law("controller");

  controller.util = util;
  controller.joint = joint;

  controller.effects = function() {
    var force = 0.0005 * controller.util.state
    // console.log(force)
    controller.joint.bend(force*1.5)
  };
  return controller;
}

module.exports = { makeGravityLaw, makeAirResistanceLaw, jointController }
