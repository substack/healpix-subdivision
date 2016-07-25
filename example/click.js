var html = require('yo-yo')
var grid = require('../')(6)
var data = grid()
var PI = Math.PI

var root = document.createElement('div')
document.body.appendChild(root)

function update () {
  html.update(root, html`<div>
    <svg width="100%" height="${window.innerHeight}">
      ${data.map(function (shapes) {
        return shapes.map(function (pts) {
          return html`<polyline points="${pts.map(scale).join(' ')}"
            stroke="black" stroke-width="1" fill="transparent"
            onclick=${click} />`
          })
        function click (ev) {
          ev.preventDefault()
          data = data.concat(grid(shapes))
          update()
        }
      })}
    </svg>
  </div>`)
}
update()
window.addEventListener('resize', update)

function scale (pt) {
  var size = Math.min(window.innerWidth, window.innerHeight) * 3/2
  var x = (pt[0]+PI)/(2*PI) * size
  var y = (pt[1]+PI/2)/PI * 1/2 * size + 25
  return [x,y]
}
