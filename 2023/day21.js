const file = require("path").basename(__filename);

// Star 1: 3562
// Star 2: 

parseData(`...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`);

return;


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  let grid = data.split("\n").map(r => r.split(""));

  const size = grid.length;

  for (let j = 0; j < size; j++) {
   for (let i = 0; i < size; i++) {
     if (grid[j][i] == 'S') {
       grid[j][i] = 1;
      }
    }
  }

  let x = 0;
  let y = 0;

  function move(grid, i, j)
  {
    let x = (i+size) % size;
    let y = (j+size) % size;
    if (grid[y][x] == '#') return;

    if (grid[y][x] == '.') {
      grid[y][x] = 1;
    } else {
      grid[y][x]++;
    }
  }

  for (let steps = 0; steps < 3; steps++) {
    let copy = JSON.parse(JSON.stringify(grid));

    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        if (grid[j][i] != "." && grid[j][i] != "#") {

          copy[j][i]--;
          if (copy[j][i] == 0) {
            copy[j][i] = ".";
          }
          move(copy, i, j-1);
          move(copy, i, j+1);
          move(copy, i-1, j);
          move(copy, i+1, j);
        }
      }
    }
  
    grid = copy;
    console.log(grid.map(r => r.join("")).join("\n"));
  }

  return;

  let count = grid.reduce(
    (t, r) => r.reduce((t, c) => t + (c == 'S' ? 1 : 0), t), 0)
  
  console.log(count);
}