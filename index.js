var healpix = require('healpix')
var H = 4, K = 3
var hp = healpix(H,K)
var PI = Math.PI

module.exports = function (nx,ny) {
  return function (shapes) {
    if (!shapes) return regions(H,K)
    var extents = [
      shapes[0][0][0],
      shapes[0][0][1],
      shapes[0][0][0],
      shapes[0][0][1]
    ]
    shapes.forEach(function (s) {
      for (var i = 1; i < s.length - 1; i++) {
        extents[0] = Math.min(extents[0],s[i][0])
        extents[1] = Math.min(extents[1],s[i][1])
        extents[2] = Math.max(extents[2],s[i][0])
        extents[3] = Math.max(extents[3],s[i][1])
      }
    })
    var parts = []
    var sx = (extents[2]-extents[0])/nx
    var sy = (extents[3]-extents[1])/ny
    for (var y = 0; y < ny; y++) {
      for (var x = 0; x < nx; x++) {
        var w = extents[0] + sx*x
        var s = extents[1] + sy*y
        var e = extents[0] + sx*(x+1)
        var n = extents[1] + sy*(y+1)
        parts.push([ [ [w,s], [e,s], [e,n], [w,n], [w,s] ] ])
      }
    }
    return parts
  }
}

function regions (H,K) {
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
