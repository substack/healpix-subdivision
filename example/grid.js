var grid = require('../')(4)
var data = grid()
data = data.concat(grid(data[5]))
data = data.concat(grid(data[6]))
data = data.concat(grid(data[6+16+4]))
data = data.concat(grid(data[3]))
console.log(JSON.stringify(data,null,2))
