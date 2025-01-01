const file = require("path").basename(__filename);

function solve(data)
{
  data = Number(data);

  let dist = pt => Math.abs(pt[0]) + Math.abs(pt[1]);

  console.log("Star 1:", dist(spiral_coords(data)));
  
  function calculate(grid, x, y) {
    if (x == ox && y == oy) return 1;
    let total = 0;
    if (grid[y-1]) {
      total += grid[y-1][x-1] ?? 0;
      total += grid[y-1][x]   ?? 0;
      total += grid[y-1][x+1] ?? 0;
    }
    if (grid[y]) {
      total += grid[y][x-1] ?? 0;
      total += grid[y][x]   ?? 0;
      total += grid[y][x+1] ?? 0;
    }
    if (grid[y+1]) {
      total += grid[y+1][x-1] ?? 0;
      total += grid[y+1][x]   ?? 0;
      total += grid[y+1][x+1] ?? 0;
    }
    return total;
  }

  let grid = [];
  let size = 5;
  let ox = Math.ceil(size/2);
  let oy = Math.ceil(size/2);

  for (let i = 1; true; i++) {
    let [x, y] = spiral_coords(i);
    let value = calculate(grid, ox+x, oy+y);
    if (value > data) {
      console.log("Star 2:", value);
      break;
    }
    grid[ox+y] ??= [];
    grid[oy+y][ox+x] = value;
  }
}

function spiral_coords(n) {
  let i = Math.trunc((Math.sqrt(n-1)+3)/2);
  let a = 2*i - 3;
  let b = 2*i - 1;

  let d = b**2 - a**2;
  let w = d / 4;
  let j = i - 1;

  let b2 = b**2;
  if (n > b2 - w) {
    return [j - (b2 - n), j];
  } else if (n > b2 - 2*w) {
    return [j - w, j - w - (b2 - 2*w - n)];
  } else if (n > b2 - 3*w) {
    return [-(j - w - (b2 - 3*w - n)), j - w];
  } else {
    return [j, -(j - w - (b2 - 4*w - n))];
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);