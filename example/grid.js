var grid = require('../')(4)
var data = grid()
//data = data.concat(grid(data[5]))
console.log(JSON.stringify(data,null,2))
