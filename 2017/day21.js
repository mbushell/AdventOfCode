const file = require("path").basename(__filename);

function solve(data)
{
  let patterns = {};
  data.split("\n").forEach(line => {
    let [from, to] = line.split(" => ");
    let grid = str_to_grid(from);
    let dirg = flip(grid);
    for (let i = 0; i < 4; i++) {
      grid = rotate(grid);
      dirg = rotate(dirg);
      patterns[grid_to_str(grid)] = str_to_grid(to);
      patterns[grid_to_str(dirg)] = str_to_grid(to);
    }
  });

  let grid = [
    [ '.', '#', '.' ],
    [ '.', '.', '#' ],
    [ '#', '#', '#' ]
  ];

  function on(grid) {
    let total = 0;
    for (let j = 0; j < grid.length; j++) {
      for (let i = 0; i < grid[j].length; i++) {
        if (grid[j][i] == '#') total++;
      }
    }
    return total;
  }  

  for (let i = 0; i < 5; i++) {
    grid = update(grid, patterns);
  }
  console.log("Star 1:", on(grid));

  for (let i = 0; i < 13; i++) {
    grid = update(grid, patterns);
  }
  console.log("Star 2:", on(grid));
}

function update(grid, patterns)
{
  function get_subgrid(grid, x, y, size) {
    let subgrid = [];
    for (let j = 0; j < size; j++) {
      subgrid.push(grid[y + j].slice(x, x+size));
    }
    return subgrid;
  }

  let size = grid.length;
  let w1 = size % 2 == 0 ? 2 : 3;
  let w2 = size % 2 == 0 ? 3 : 4;
  
  let hrid = Array((size/w1)*w2);
  for (let y = 0; y < size; y += w1) {
    for (let x = 0; x < size; x += w1) {
      let subgrid = get_subgrid(grid, x, y, w1);
      let subdrig = patterns[grid_to_str(subgrid)];
      let nx = (x/w1)*w2;
      let ny = (y/w1)*w2;
      for (let j = 0; j < w2; j++) {
        hrid[ny+j] ??= Array((size/w1)*w2);
        for (let i = 0; i < w2; i++) {
          hrid[ny+j][nx+i] = subdrig[j][i];
        }
      }
    }
  }
  return hrid;
}

function grid_to_str(grid) {
  return grid.map(r => r.join("")).join("/");
}

function str_to_grid(grid) {
  return grid.split("/").map(r => r.split(""));
}

function rotate(grid) {
  let rot = [];
  let s = grid.length;
  for (let i = 0; i < s; i++) {
    for (let j = s - 1; j >= 0; j--) {
      rot[j] ??= Array(s);
      rot[j][s-i-1] = grid[i][j];
    }
  }
  return rot;
}

function flip(grid) {
  let dirg = [];
  let s = grid.length;
  for (let j = 0; j < s; j++) {
    dirg[j] = Array(s);
    for (let i = 0; i < s; i++) {
      dirg[j][s-i-1] = grid[j][i];
    }
  }
  return dirg;
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);