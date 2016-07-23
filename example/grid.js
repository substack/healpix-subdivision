var grid = require('../')(3,3)
var data = grid()
data = data.concat([grid(data[1])])
console.log(JSON.stringify(data,null,2))
