const inputFilePath = "day4.txt";

// Solutions
// Part 1: 2575
// Part 2: 2041

/*
solve(`..X...
.SAMX.
.A..A.
XMAS.S
.X....`)
*/

solve(`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`);

const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  solve(data);
});


function solve(data)
{
  const grid = data.split("\n");


  // Day 2
  let count = 0;
  for (let j = 0; j < grid.length; j++) {
    for (var i = 0; i < grid[j].length; i++) {
      if (grid[j][i] == "A" && grid[j-1] && grid[j+1]) {
        let m = grid[j-1][i-1] + grid[j+1][i+1];
        let n = grid[j-1][i+1] + grid[j+1][i-1];
        if ((m == "MS" || m == "SM") && (n == "MS" || n == "SM")) {
          count++;
        }
      }
    }
  }
  console.log(count);
  return;

  /*
  let table = grid.map(line => line.split(""));

  // transpose
  const rows = table.length;
  const cols = table[0].length;

  let transpose = [];
  for (let i = 0; i < cols; i++) {
    let row = [];
    transpose.push(row);
    for (let j = 0; j < rows; j++) {
      row.push(table[j][i]);
    }
    transpose[i] = transpose[i].join("");
  }

  function getDiagonal(table, i, j, iDir, jDir) {
    let diagonal = [];
    while (table[j] && table[j][i]) {
      diagonal.push(table[j][i]);
      i += iDir;
      j += jDir;
    }
    return diagonal.join("");
  }

  let mainDiagonals = [];
  let backDiagonals = [];


  for (let i = 0; i < cols; i++) {
    mainDiagonals.push(getDiagonal(table, i, 0, 1, 1));
    backDiagonals.push(getDiagonal(table, cols-i, 0, -1, 1));
  }
  for (let j = 1; j < rows; j++) {
    mainDiagonals.push(getDiagonal(table, 0, j, 1, 1));
    backDiagonals.push(getDiagonal(table, cols-1, j, -1, 1));
  }

  let count = 0;

  // Day 1
  count += horizontalSearch(grid);
  count += horizontalSearch(transpose);
  count += horizontalSearch(mainDiagonals);
  count += horizontalSearch(backDiagonals);

  console.log(count);
  */
}

function horizontalSearch(grid)
{
  let count = 0;  
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i <= grid[j].length - 4; i++) {
      let slice = grid[j].slice(i, i + 4);
      if (slice == "XMAS" || slice == "SAMX") {
        count++;
      }
    }
  }
  return count;
}
