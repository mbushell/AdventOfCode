const file = require("path").basename(__filename);

// Star 1: 574
// Star 2: 1238

/*
solve(`0123
1234
8765
9876`);
*/

solve(`89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);


function solve(data)
{
  const map = data.split("\n").map(r => r.split("").map(n => parseInt(n)));
  const rows = map.length;
  const cols = map[0].length;

  function scan(x, y, summits)
  {
    const height = map[y][x];

    if (height === 9) {
      let key = `${x}-${y}`;
      summits[key] ??= 0;
      summits[key]++;
    }

    if (map[y][x + 1] === height + 1) {
      scan(x + 1, y, summits);
    }
    if (map[y][x - 1] === height + 1) {
      scan(x - 1, y, summits);
    }
    if (map[y + 1] && map[y + 1][x] === height + 1) {
      scan(x, y + 1, summits);
    }
    if (map[y - 1] && map[y - 1][x] === height + 1) {
      scan(x, y - 1, summits);
    }
  }

  let total = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (map[j][i] === 0) {
        let summits = {};
        scan(i, j, summits);
        // Part 1
        //total += Object.keys(summits).length;
        // Part 2
        total += Object.values(summits).reduce((t, c) => t + c, 0)
      }
    }
  }
  console.log(total);

}