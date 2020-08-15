var canvas = document.getElementById("canvas");
var drawCtx = canvas.getContext("2d");
var WIDTH = document.documentElement.clientWidth;
var HEIGHT = document.documentElement.clientHeight-60;
canvas.width = WIDTH;
canvas.height = HEIGHT;

function clearScreen() {
  drawCtx.fillStyle="black";
  drawCtx.fillRect(0,0,WIDTH,HEIGHT);
}

function draw(lines, color){
  drawCtx.strokeStyle = color;
  lines.forEach(function(line){
    drawCtx.beginPath();
    drawCtx.moveTo(line[0][0]*0.6, line[0][1]*0.7);
    drawCtx.lineTo(line[1][0]*0.6, line[1][1]*0.7);
    drawCtx.stroke();
  });
};

module.exports = { draw, clearScreen}
