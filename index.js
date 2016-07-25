var H = 4, K = 3
var PI = Math.PI
var EPSILON = 1e-8

module.exports = function (size) {
  return function (shapes) {
    if (!shapes) return regions(H,K)
    var parts = []
    var s = shapes[0]
    var exw = s[0][0], exs = s[0][1], exe = s[0][0], exn = s[0][1]
    var sx, sy

    if (shapes.length === 4) { // tops
      splitTop(parts, shapes, size)
    } else if (shapes.length === 2) { // 2-tri
      splitTri(parts, shapes, size)
    } else if (shapes.length === 1) {
      getex()
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var w = exw + sx*x
          var s = exs + sy*y
          var e = exw + sx*(x+1)
          var n = exs + sy*(y+1)
          parts.push([ [ [w,s], [e,s], [e,n], [w,n], [w,s] ] ])
        }
      }
    } else {
      console.error('unhandled')
    }
    return parts

    function getex () {
      for (var i = 1; i < s.length - 1; i++) {
        exw = Math.min(exw,s[i][0])
        exs = Math.min(exs,s[i][1])
        exe = Math.max(exe,s[i][0])
        exn = Math.max(exn,s[i][1])
      }
      sx = (exe-exw)/size
      sy = (exn-exs)/size //* yscale
    }
  }
}

function splitTop (parts, shapes, size) {
  var s = shapes[0]
  var sx = (s[0][0]-s[1][0])/size
  var sy = (s[0][1]-s[1][1])/size
  var z = size/2, fz = Math.floor(z), q = (s[2][0]-s[1][0])/z
  var tops = null
  if (size % 2 === 1) parts.push(tops = [])
  for (var j = 0; j < shapes.length; j++) {
    for (var y = 0; y < z; y++) {
      if (y === fz && tops) {
        var y0 = s[0][1] - y*sy*2
        var y1 = y0 - sy
        var x0 = shapes[j][1][0] - (s[2][0]-s[1][0])*(1-y/z)
        var x1 = x0 + q/2
        var x2 = x0 + q
        tops.push([ [x0,y0], [x1,y1], [x2,y0], [x0,y0] ])
        continue
      }
      var y0 = s[0][1] - y*sy*2
      var y1 = s[0][1] - (y+1)*sy*2
      var x0 = shapes[j][1][0] + (s[2][0]-s[1][0])*(1-y/z) - q
      var x1 = x0 + q
      var x2 = shapes[(j+1)%shapes.length][2][0]
        - (s[2][0]-s[1][0])*(1-y/z) - q*(size-2)/2
      var x3 = x2 - q
      parts.push([
        [ [x0,y1], [x0,y0], [x1,y0], [x0,y1] ],
        [ [w(x2),y1], [w(x2),y0], [w(x3),y0], [w(x2),y1] ]
      ])
      for (var k = 0; k < (z-y-1)*2; k++) {
        var sq = [
          [x0-k*q,y0],
          [x0-(k+1)*q,y0],
          [x0-(k+1)*q,y1],
          [x0-k*q,y1],
          [x0-k*q,y0]
        ]
        parts.push([ sq ])
      }
    }
  }
  function w (x) {
    return x+EPSILON >= PI ? x-2*PI : x
  }
}

function splitTri (parts, shapes, size) {
  var ax0 = shapes[0][0][0]
  var ax1 = shapes[0][2][0]
  var ay0 = shapes[0][2][1]
  var ay1 = shapes[0][0][1]
  var bx0 = shapes[1][0][0]
  var bx1 = shapes[1][2][0]
  var by0 = shapes[1][1][1]
  var by1 = shapes[1][0][1]
  var w = (ax1-ax0)/size, h = (ay1-ay0)/size

  for (var i = 0; i < size; i++) {
    parts.push([
      [
        [ax1-w*(i+1),ay0+h*(i+1)],
        [ax1-w*(i+1),ay0+h*i],
        [ax1-w*i,ay0+h*i],
        [ax1-w*(i+1),ay0+h*(i+1)]
      ],
      [
        [bx1+w*(i+1),by0+h*(i+1)],
        [bx1+w*(i+1),by0+h*i],
        [bx1+w*i,by0+h*i],
        [bx1+w*(i+1),by0+h*(i+1)]
      ],
    ])
    for (var j = 0; j < i; j++) { // squares
      parts.push([
        [
          [ax1-w*i,ay0+h*j],
          [ax1-w*(i+1),ay0+h*j],
          [ax1-w*(i+1),ay0+h*(j+1)],
          [ax1-w*i,ay0+h*(j+1)],
          [ax1-w*i,ay0+h*j]
        ]
      ])
      parts.push([
        [
          [bx1+w*i,by0+h*j],
          [bx1+w*(i+1),by0+h*j],
          [bx1+w*(i+1),by0+h*(j+1)],
          [bx1+w*i,by0+h*(j+1)],
          [bx1+w*i,by0+h*j]
        ]
      ])
    }
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
        if (i === 0) shapes.push([])
        shapes[shapes.length-1].push([
          [w,xs],
          [(e+w)/2,xn],
          [e,xs],
          [w,xs]
        ])
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
