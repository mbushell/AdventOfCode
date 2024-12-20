const file = require("path").basename(__filename);

// Star 1: 10289334
// Star 2: 649862989626

parseData(`...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`);


require('node:fs').readFile(file.replace(".js", ".txt"), 'utf8',
  (err, data) => parseData(data)
);

function parseData(data)
{
  
  const rows = data.split("\n").map(row => row.split(""));

  // expand vertical
  const cols = {};
  for (var j = rows.length - 1; j >= 0; j--) {
    let count = 0;
    for (var i = 0; i < rows[j].length; i++) {
      if (rows[j][i] == '#') {
        cols[i] = true;
        count++;
      }
    }
    if (count == 0) {
      for (var i = 0; i < rows[j].length; i++) {
        rows[j][i] = '@';
      }
    }
  }

  // expand horizontal
  for (var i = rows[0].length - 1; i >= 0; i--) {
    if (!cols[i]) {
      for (var j = 0; j < rows.length; j++) {
        rows[j][i] = '@';
      }
    }
  }

  // find galaxies
  const galaxies = [];
  rows.forEach((row, j) => row.forEach((cell, i) => {
    if (cell == '#') galaxies.push([i, j]);
  }));
  
  const expansion = 1000000;

  let total = 0;
  for (let j = 0; j < galaxies.length; j++) {
    for (let i = j+1; i < galaxies.length; i++) {
      let [px, py] = galaxies[i];
      let [qx, qy] = galaxies[j];

      if (qx != px) {
        let dx = (qx - px) / Math.abs(qx - px);
        for (let x = px + dx; x != qx; x += dx) {
          total += rows[py][x] == "@" ? expansion : 1;
        }
        total += 1;
      }

      if (qy != py) {
        let dy = (qy - py) / Math.abs(qy - py);
        for (let y = py + dy; y != qy; y += dy) {
          total += rows[y][px] == "@" ? expansion : 1;
        }
        total += 1;
      }

    }
  }

  console.log(total);
}