const file = require("path").basename(__filename);

// Star 1: 7884
// Star 2: 8185

parseData(`.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  let grid = data.split("\n").map(r => r.split(""));
  let copy = data.split("\n").map(r => r.split(""));

  const rows = grid.length;
  const cols = grid[0].length;

  let visited;
  let energized;
  let energy;

  function inBounds(x, y) {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  function rayTrace(x, y, dx, dy)
  {
    if (!inBounds(x, y)) return;

    const key = `${x}-${y}-${dx}-${dy}`;
    
    if (visited[key]) return;
    visited[key] = true;
    
    if (!energized[`${x}-${y}`]) {
      energized[`${x}-${y}`] = true;
      energy++;
    }

    switch (grid[y][x])
    {
      case '.':
        rayTrace(x+dx, y-dy, dx, dy);
        break;
      case '/':
        if (dx == 1 && dy == 0) {
          rayTrace(x, y-1, 0, 1);
        }
        else if (dx == -1 && dy == 0) {
          rayTrace(x, y+1, 0, -1);
        }
        else if (dx == 0 && dy == 1) {
          rayTrace(x+1, y, 1, 0);
        }
        else if (dx == 0 && dy == -1) {
          rayTrace(x-1, y, -1, 0);
        }
        break;
      case '\\':
        if (dx == 1 && dy == 0) {
          rayTrace(x, y+1, 0, -1);
        } else if (dx == -1 && dy == 0) {
          rayTrace(x, y-1, 0, 1);
        } else if (dx == 0 && dy == 1) {
          rayTrace(x-1, y, -1, 0);
        } else if (dx == 0 && dy == -1) {
          rayTrace(x+1, y, 1, 0);
        }
        break;
      case '|':
        if (dx == 0) {
          rayTrace(x, y-dy, 0, dy);
        } else {
          rayTrace(x, y-1, 0, 1);
          rayTrace(x, y+1, 0, -1);
        }
        break;
      case '-':
        if (dy == 0) {
          rayTrace(x+dx, y, dx, 0);
        } else {
          rayTrace(x+1, y, 1, 0);
          rayTrace(x-1, y, -1, 0);
        }
        break;
    }
  }

  function attempt(x, y, dx, dy)
  {
    visited = {};
    energized = {};
    energy = 0;
    rayTrace(x, y, dx, dy);
    return energy;
  }
  

  let max = 0;
  for (let i = 0; i < cols; i++) {
    max = Math.max(max, attempt(i, 0, 0, -1));
    max = Math.max(max, attempt(i, cols-1, 0, 1));
  }
  for (let j = 0; j < rows; j++) {
    max = Math.max(max, attempt(0, j, 1, 0));
    max = Math.max(max, attempt(rows-1, j, -1, 0));
  }

  console.log(max);
}