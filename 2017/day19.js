const file = require("path").basename(__filename);

function solve(data)
{
  let grid = data.split("\n").map(r => r.split(""));

  let letters = [];
  let x = grid[0].indexOf("|");
  let y = 0;
  let dx = 0;
  let dy = 1;
  let steps = 0;

  while (true) {
    x += dx;
    y += dy;
    steps++;
    switch (grid[y][x]) {
      case ' ':
        console.log("Star 1:", letters.join(""));
        console.log("Star 2:", steps);
        return;
      case '|':
      case '-':
        continue;
      case '+':
        if (dx != 0) {
          dx = 0;
          dy = 1;
          if (grid[y-1] && grid[y-1][x] != ' ' && grid[y-1][x] != '-') {
            dy = -1;
          }
        } else {
          dy = 0;
          dx = 1;
          if (grid[y][x-1] != ' ' && grid[y][x-1] != '|') {
            dx = -1;
          }
        }
        break;
      default:
        letters.push(grid[y][x]);
        break;
    }
  }

}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data)
);