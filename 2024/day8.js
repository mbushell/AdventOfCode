const file = require("path").basename(__filename);

// Star 1: 361
// Star 2: >= 1248

solve(`............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);


function solve(data)
{
  let grid = data.split("\n").map(r => r.split(""));

  const rows = grid.length;
  const cols = grid[0].length;

  let nodes = {};
  let nodeList = [];
  grid.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell != '.') {
        let node = [i,j];
        if (nodes[cell]) {
          nodes[cell].push(node)
        } else {
          nodes[cell] = [node];
          nodeList.push(cell);
        }
      }
    })
  });

  const antinodes = {};
  let antinodeCount = 0;

  function markAntinode(x, y) {
    if (!Number.isInteger(y)) {
      console.log(x, y);
      return;
    }
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      const key = `${x}-${y}`;
      if (antinodes[key]) return;
      antinodes[key] = true;
      antinodeCount++;
    }
  }

  nodeList.forEach(name => {
    for (let i = 0; i < nodes[name].length; i++) {
      for (let j = i + 1; j < nodes[name].length; j++) {
        let p = nodes[name][i];
        let q = nodes[name][j];

        let dx = q[0] - p[0];
        let dy = q[1] - p[1];

        if (dx == 0) {
          console.log("vertical line...");
        } else {
          let m = dy / dx;
          // Star 1
          /*
          let min = Math.min(p[0], q[0]);
          let max = Math.max(p[0], q[0]);
          let lx = min - Math.abs(dx);
          let rx = max + Math.abs(dx);
          let ly = Math.round(m*(lx - p[0]) + p[1], 5);
          let ry = Math.round(m*(rx - p[0]) + p[1], 5);

          markAntinode(lx, ly);
          markAntinode(rx, ry);
          */


          // Star 2
          for (let x = 0; x < cols; x++) {
            let y = m*(x - p[0]) + p[1];
            let d = Math.abs(y - Math.floor(y));
            if (d < 0.00001) {
              markAntinode(x, Math.floor(y));
            }
          }
        }

      }
    }
  });

  console.log(antinodeCount);
}