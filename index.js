var healpix = require('healpix')
var PI = Math.PI

module.exports = function (H,K) {
  var hp = healpix(H,K)
  return function (bbox) {
    if (!bbox) return regions(hp,H,K)
    else {
      console.log('todo')
    }
  }
}

function regions (hp,H,K) {
  var thetax = Math.asin((K-1)/K)
  var rs = []
  for (var i = 0; i < H; i++) {
    for (var j = 0; j < K; j++) {
      var w = (i/H*2-1)*PI
      var e = ((i+1)/H*2-1)*PI
      var s = Math.asin((K-(j+1)*(j+2)/2)/K)
      var n = Math.asin((K-j*(j+1)/2)/K)
      var pt0 = hp.ang2xy([],w,s)
      rs.push([
        pt0,
        hp.ang2xy([],e,s),
        hp.ang2xy([],e,n),
        hp.ang2xy([],w,n),
        [pt0[0],pt0[1]]
      ])
    }
  }
  return rs
}
