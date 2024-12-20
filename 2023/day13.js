const file = require("path").basename(__filename);

// Star 1: 29846
// Star 2: 

parseData(`#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`);

return;

require('node:fs').readFile(file.replace(".js", ".txt"), 'utf8',
  (err, data) => parseData(data)
);


function parseData(data)
{
  console.log(
    data.split("\n\n")
        .map(row => score(row.split("\n")))
        .reduce((total, score) => total + score, 0)
  );
}

function score(rows)
{
  let symmetry = horizontal(rows);
  if (symmetry) {
    return 100*symmetry;
  }  
  return horizontal(transpose(rows));
}

function horizontal(rows)
{
  for (var i = 0; i < rows.length-1; i++) {
    if (rows[i] == rows[i+1]) {
      let size = Math.min(i+1, rows.length-(i+1));
      let valid = true;
      for (let j = 1; j < size; j++) {
        if (rows[i - j] != rows[(i+1) + j]) {
          valid = false;
        }
      }
      if (valid) {
        return i + 1;
      }
    }
  }
  return 0;
}

function transpose(rows) {
  let transpose = [];
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      if (j > 0) {
        transpose[i] += row[i];
      } else {
        transpose[i] = row[i];
      }
    }
  });
  return transpose;
}