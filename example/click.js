var html = require('yo-yo')
var hgrid = require('../')
var PI = Math.PI

var grid, data
window.addEventListener('hashchange', setup)
window.addEventListener('resize', update)

var root = document.createElement('div')
document.body.appendChild(root)

setup()

function setup () {
  var size = location.hash.slice(1) || 4
  location.hash = size
  grid = hgrid(size)
  data = grid()
  update()
}

function update () {
  html.update(root, html`<div>
    <div>click the shapes below</div>
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

function scale (pt) {
  var size = Math.min(window.innerWidth, window.innerHeight) * 3/2
  var x = (pt[0]+PI)/(2*PI) * size
  var y = (pt[1]+PI/2)/PI * 1/2 * size + 25
  return [x,y]
}
