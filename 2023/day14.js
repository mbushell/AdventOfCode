const file = require("path").basename(__filename);

// Star 1: 109755
// Star 2: 90928

parseData(`O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  let rows = data.split("\n").map(r => r.split(""));

  let patterns = [];
  let cycleStart = -1;
  let cycleEnd = -1;

  for (let i = 0; i < 1000; i++)
  {
    tiltN(rows);
    tiltW(rows);
    tiltS(rows);
    tiltE(rows);

    let pattern = rows.map(r => r.join("")).join("\n");
    let j = patterns.indexOf(pattern);
    patterns.push(pattern);

    if (j >= 0) {
      cycleStart = j;
      cycleEnd = i;
      break;
    }
  }

  let length = cycleEnd - cycleStart;

  let a = cycleStart + 1;
  let b = 1000000000 - a;

  let c = b % length;
  let d = (b - c) / length;

  rows = patterns[cycleStart + c]
          .split("\n").map(r => r.split(""));

  let load = 0;
  for (let j = 0; j < rows.length; j++) {
    let weight = rows.length - j;
    for (let i = 0; i < rows[j].length; i++) {
      if (rows[j][i] != 'O') continue;
      load += weight;
    }
  }

  console.log(load);
}

function tiltN(rows)
{
  for (let j = 1; j < rows.length; j++) {
    for (let i = 0; i < rows[j].length; i++) {
      if (rows[j][i] != 'O') continue;

      let k = j;
      while (k - 1 >= 0 && rows[k - 1][i] == '.')
        k--;

      if (k == j) continue;

      rows[j][i] = '.';
      rows[k][i] = 'O';
    }
  }
}

function tiltS(rows)
{
  for (let j = rows.length - 2; j >= 0; j--) {
    for (let i = 0; i < rows[j].length; i++) {
      if (rows[j][i] != 'O') continue;

      let k = j;
      while (k + 1 < rows.length && rows[k + 1][i] == '.')
        k++;

      if (k == j) continue;

      rows[j][i] = '.';
      rows[k][i] = 'O';
    }
  }
}

function tiltE(rows)
{
  for (let j = 0; j < rows.length; j++) {
    for (let i = rows[j].length - 1; i >= 0; i--) {
      if (rows[j][i] != 'O') continue;

      let k = i;
      while (k + 1 < rows[j].length && rows[j][k + 1] == '.')
        k++;

      if (k == i) continue;

      rows[j][i] = '.';
      rows[j][k] = 'O';
    }
  }
}

function tiltW(rows)
{
  for (let j = 0; j < rows.length; j++) {
    for (let i = 1; i < rows[j].length; i++) {
      if (rows[j][i] != 'O') continue;

      let k = i;
      while (k - 1 >= 0 && rows[j][k - 1] == '.')
        k--;

      if (k == i) continue;

      rows[j][i] = '.';
      rows[j][k] = 'O';
    }
  }
}