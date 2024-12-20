const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

parseData(`R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`);


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  const ops = data.split("\n").map(r => {
    let parts = r.split(" ");
    parts[1] = parseInt(parts[1]);
    parts[2] = parts[2].slice(2, -1);
    return parts;
  });

  let minX = 999;
  let minY = 999;
  let maxX = -1;
  let maxY = -1;

  let x = 0;
  let y = 0;
  ops.forEach(op => {
    switch (op[0]) {
      case 'U': y -= op[1]; break;
      case 'D': y += op[1]; break;
      case 'L': x -= op[1]; break;
      case 'R': x += op[1]; break;
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  let offX = Math.abs(minX);
  let offY = Math.abs(minY);

  let colSize = offX + maxX + 1;
  let rowSize = offY + maxY + 1;

  let row = ".".repeat(colSize);
  let grid = [];
  for (let j = 0; j < rowSize; j++) {
    grid.push(row.split(""));
  }

  x = offX;
  y = offY;
  ops.forEach(op => {
    switch (op[0]) {
      case 'U': dx = 0;  dy = 1;  break;
      case 'D': dx = 0;  dy = -1; break;
      case 'L': dx = -1; dy = 0;  break;
      case 'R': dx = 1;  dy = 0;  break;
    }
    while (op[1]--) {
      x += dx;
      y -= dy;
      grid[y][x] = '#';
    }
  });

  function floodFill(i, j, replace, symbol) 
  {
    if (grid[j][i] != replace) return false;
    if (i < 0 || i >= colSize || j < 0 || j >= rowSize) {
      return false;
    }

    grid[j][i] = symbol;

    let outer = false;
    if (i == 0 || i == colSize - 1 || j == 0 || j == rowSize -1) {
      outer = true;
    }

    outer ||= floodFill(i+1, j, replace, symbol);
    outer ||= floodFill(i-1, j, replace, symbol);
    outer ||= floodFill(i, j+1, replace, symbol);
    outer ||= floodFill(i, j-1, replace, symbol);
    return outer;
  }

  //console.log(grid.map(r => r.join("")).join("\n"), "\n");

  for (let i = 0; i < colSize; i++) {
    for (let j = 0; j < rowSize; j++) {
      if (floodFill(i, j, '.', '@')) {
        floodFill(i, j, '@', '.');
      } else {
        floodFill(i, j, '@', '#');
      }
    }
  }

  let total = 0;
  for (let i = 0; i < colSize; i++) {
    for (let j = 0; j < rowSize; j++) {
      if (grid[j][i] == '#') total++;
    }
  }
  console.log(total);
}