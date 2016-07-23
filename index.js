var healpix = require('healpix')
var PI = Math.PI

module.exports = function (H,K) {
  var hp = healpix(H,K)
  return function (bbox) {
    if (!bbox) return regions(hp,H,K)
    console.log('todo')
  }
}

function regions (hp,H,K) {
  var rs = []
  var theta = 1
  var shapes
  for (var j = 0; j < K; j++) {
    var tstep = thetaStep(j)
    for (var i = 0; i < H; i++) {
      if (j > 0 && j < K-1) rs.push(shapes = [])
      else if (i === 0) rs.push(shapes = [])
      var w = (i/H*2-1)*PI
      var e = ((i+1)/H*2-1)*PI
      var s = Math.asin(theta-tstep)
      var n = Math.asin(theta)
      if (j === 0) {
        shapes.push([ [w,s], [e,s], [(e+w)/2,n], [w,s] ])
      } else if (j === K-1) {
        shapes.push([ [w,n], [e,n], [(e+w)/2,s], [w,n] ])
      } else {
        shapes.push([ [w,s], [e,s], [e,n], [w,n], [w,s] ])
      }
    }
    theta -= tstep
  }
  return rs

  function thetaStep (i) {
    var k=(K-1)/2
    return Math.pow(k-Math.abs(k-i)+1,2)/3
  }
}
