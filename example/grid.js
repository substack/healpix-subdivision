var grid = require('../')(4,3)
var data = grid()
//data = data.concat(grid(data[0]))
console.log(JSON.stringify(data,null,2))
