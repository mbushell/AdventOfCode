const file = require("path").basename(__filename);

function solve(data)
{
  const w = 50;
  const h = 6;

  let grid = Array(h);
  for (let j = 0; j < h; j++) {
    grid[j] = Array(w).fill(' ');
  }

  let rect = /rect (\d+)x(\d+)/;
  let rotate_row = /row y=(\d+) by (\d+)/;
  let rotate_col = /column x=(\d+) by (\d+)/;

  data.split("\n").forEach(line => {
    let match;
    if (match = line.match(rect)) {
      let w = Number(match[1]);
      let h = Number(match[2]);
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          grid[j][i] = '#';
        }
      }
    } else if (match = line.match(rotate_row)) {
      let y = Number(match[1]);
      let n = Number(match[2]);
      grid[y] = [...grid[y].slice(w-n), ...grid[y].slice(0, w-n)];
    } else if (match = line.match(rotate_col)) {
      let x = Number(match[1]);
      let n = Number(match[2]);
      let temp = [];
      for (let j = 0; j < h; j++) {
        temp.push(grid[(j+h-n)%h][x]);
      }
      for (let j = 0; j < h; j++) {
        grid[j][x] = temp[j];
      }
    }
  });

  let total = 0;
  grid.forEach(r => r.forEach(c => {
    if (c == '#') total++;
  }));
  console.log("Star 1:", total);
  console.log("Star 2:");
  console.log(grid.map(r => r.join("")).join("\n"));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);