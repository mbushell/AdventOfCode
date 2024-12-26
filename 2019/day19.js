const file = require("path").basename(__filename);

const IC = require("./intcode.js");

function solve(data)
{
  const grid_size = 10000;
  let grid = Array(grid_size);
  for (let k = 0; k < grid_size; k++) {
    grid[k] = [];
  }

  let prevx_min = -1;
  let prevx_max = -1;
  
  let ic = new IC();
  for (let y = 100; y < grid_size; y++) {
    let x_min = prevx_min >= 2 ? prevx_min-2 : 100;
    let x_max = prevx_max >= 2 ? prevx_max+2 : 110;
    prevx_min = -1;
    prevx_max = -1;
    for (let x = x_min; x < x_max; x++) {
      ic.load(data);
      ic.reset();
      ic.start();
      ic.input(x);
      ic.input(y);
      if (ic.outputs[0] == 1) {
        grid[y][x] = '#';
        prevx_min = prevx_min == -1? x : Math.min(prevx_min, x);
        prevx_max = prevx_max == -1? x : Math.max(prevx_max, x);
        if (x > 99 && y > 99 &&
            grid[y-99][x]    == '#' &&
            grid[y][x-99]    == '#' &&
            grid[y-99][x-99] == '#'
        ) {
          console.log(10000*(x-99)+(y-99));
          return;
        }
      }
    }
  }
}


require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);