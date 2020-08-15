var electron = require('electron')
const { draw, clearScreen } = require('./draw.js')

var tape = {
  playing: false,
  reel: [],
  i: 0,
  playRate: 3,
  rendering: false,
  ready: () => !tape.playing
    && !tape.rendering
    && (tape.i < tape.reel.length),
  play: () => {
    if (tape.ready()) {
      tape.render()
      window.setTimeout(()=>{
        tape.rendering = false
        window.requestAnimationFrame(tape.play)
      }, tape.playRate)
    } else {
      tape.playing = false
    }
  },
  render: ()=> {
    tape.rendering = true
    img = tape.reel[tape.i]
    tape.i += 1
    clearScreen()
    draw(img, 'white')
  },
  addFrame: (frame) => {
    tape.reel.push(frame)
    if (!tape.playing) {
      tape.play()
    }
  }
}

electron.ipcRenderer.on('msg', (event, message) => {
  var frame = JSON.parse(message)
  tape.addFrame(frame)
})
