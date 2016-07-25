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
      var polar = Math.abs(exn)-EPSILON > thetax
        || Math.abs(exs)-EPSILON > thetax
      var sy = (exn-exs)/size //* yscale

      if (s.length === 10 && polar) {
        firstPolar(parts, s, size, sx, sy)
      } else if (polar) {
        // ...
      } else {
        for (var y = 0; y < size; y++) {
          for (var x = 0; x < size; x++) {
            var w = exw + sx*x
            var s = exs + sy*y
            var e = exw + sx*(x+1)
            var n = exs + sy*(y+1)
            parts.push([ [ [w,s], [e,s], [e,n], [w,n], [w,s] ] ])
          }
        }
      }
    })
    return parts
  }
}

function firstPolar (parts, s, size, sx, sy) {
  var yn = s[0][1] > 0 ? -1 : 1
  var z = size/2
  for (var j = 1; j < 9; j += 2) {
    for (var y = 0; y < z; y++) {
      var y0 = s[0][1] - y*sy*2 * yn
      var y1 = s[0][1] - (y+1)*sy*2 * yn
      var x0 = s[j][0] + (s[2][0]-s[1][0])*(1/2-y/size*2)
      var x1 = x0 + (s[2][0]-s[1][0])/2
      var x2 = s[j+2][0] - (s[2][0]-s[1][0])*(1/2-y/size*2)
      var x3 = x2 - (s[2][0]-s[1][0])/2
      parts.push([
        [ [x0,y1], [x0,y0], [x1,y0], [x0,y1] ],
        [ [w(x2),y1], [w(x2),y0], [w(x3),y0], [w(x2),y1] ]
      ])
    }
  }
  function w (x) {
    return x <= -PI ? PI/4+x : x
  }
}

function regions (H,K) {
  var shapes = []
  var theta = 1
  for (var j = 0; j < K; j++) {
    var tstep = thetaStep(j)
    for (var i = 0; i < H; i++) {
      var w = (i/H*2-1)*PI
      var e = ((i+1)/H*2-1)*PI
      var s = Math.asin(theta-tstep)
      var n = Math.asin(theta)
      if (j === 0 || j === K-1) {
        var xn = j === 0 ? n : s
        var xs = j === 0 ? s : n
        if (i === 0) {
          shapes.push([[
            [w,xs],
            [(e+w)/2,xn],
            [e,xs]
          ]])
        } else if (i === H-1) {
          shapes[shapes.length-1][0].push(
            [(e+w)/2,xn],
            [e,xs],
            shapes[shapes.length-1][0][0]
          )
        } else {
          shapes[shapes.length-1][0].push(
            [(e+w)/2,xn],
            [e,xs]
          )
        }
      } else {
        shapes.push([ [ [w,s], [e,s], [e,n], [w,n], [w,s] ] ])
      }
    }
    theta -= tstep
  }
  return shapes

  function thetaStep (i) {
    var k=(K-1)/2
    return Math.pow(k-Math.abs(k-i)+1,2)/3
  }
}

function lengths (n) {
  var lens = []
  for (var y = 0; y < n/2; y++) {
    var row = []
    lens.push(row)
    for (var x = 0; x < 4; x++) {
      if (y > 0) row.push(y, n-y*2, y)
      else row.push(n-y*2)
    }
  }
  return lens
}
