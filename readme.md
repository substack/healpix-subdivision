# healpix-subdivision

iteratively divide sections of a [healpix][1] H=4,K=3 grid

[1]: http://web.ipac.caltech.edu/staff/fmasci/home/astro_refs/HEALPix_Calabretta.pdf

# example

``` js
var grid = require('healpix-subdivision')(4)
var data = grid()
data = data.concat(grid(data[5]))
data = data.concat(grid(data[6]))
data = data.concat(grid(data[26]))
console.log(JSON.stringify(data,null,2))
```

[click here for an interactive demo][2]

[2]: https://substack.neocities.org/healpix.html

# api

``` js
var hgrid = require('healpix-subdivision')
```

## var grid = hgrid(size)

Create a `grid()` function that will subdivide areas into `size*size` divisions.

## var divisions = grid(shapes)

If `shapes` is not given, return the 6 initial areas.

Otherwise, return `size*size` divisions for the provided area given as an array
of shapes which describe an equal-area tile for some zoom level.

`divisions` is an array of shapes arrays.

# install

```
npm install healpix-subdivision
```

# license

BSD
