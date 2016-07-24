var healpix = require('healpix')
var almost = require('almost-equal')
var H = 4, K = 3
var hp = healpix(H,K)
var PI = Math.PI
var thetax = Math.asin(2/3)
var EPSILON = 1e-12

module.exports = function (size) {
  return function (shapes) {
    if (!shapes) return regions(H,K)
    var parts = []
    shapes.forEach(function (s, ix) {
      var exw = s[0][0], exs = s[0][1], exe = s[0][0], exn = s[0][1]
      for (var i = 1; i < s.length - 1; i++) {
        exw = Math.min(exw,s[i][0])
        exs = Math.min(exs,s[i][1])
        exe = Math.max(exe,s[i][0])
        exn = Math.max(exn,s[i][1])
      }
      var sx = (exe-exw)/size
      var yscale = 1
      if (Math.abs(exn)-EPSILON > thetax) yscale = 2
      else if (Math.abs(exs)-EPSILON > thetax) yscale = 2
      var sy = (exn-exs)/size * yscale

      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var w = exw + sx*x
          var s = exs + sy*y - sy*size/2 * (yscale-1)
          var e = exw + sx*(x+1)
          var n = exs + sy*(y+1) - sy*size/2 * (yscale-1)
          parts.push([ [ [w,s], [e,s], [e,n], [w,n], [w,s] ] ])
        }
      }
    })
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
