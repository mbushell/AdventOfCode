const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let grid = data.split("\n").map(r => r.split(""));

  let nbrs = [
    [-1, -1], [0, -1], [1, -1],
    [-1,  0],          [1,  0],
    [-1,  1], [0,  1], [1,  1]
  ];

  grid[0][0] = '#';
  grid[0][99] = '#';
  grid[99][0] = '#';
  grid[99][99] = '#';

  let on_count;
  for (let i = 0; i < 100; i++) {
    let copy = JSON.parse(JSON.stringify(grid));
    on_count = 0;
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 100; x++) {
        
        if ((x == 0  && y == 0)  ||
            (x == 0  && y == 99) ||
            (x == 99 && y == 0)  ||
            (x == 99 && y == 99))
        {
          // do nothing
        }
        else {
          let count = 0;
          nbrs.forEach(nbr => {
            let nx = x + nbr[0];
            let ny = y + nbr[1];
            if (nx >= 0 && nx < 100 && ny >= 0 && ny < 100) {
              if (grid[ny][nx] == '#') count++;
            }
          });
          copy[y][x] = grid[y][x] == '#'
            ? (count == 2 || count == 3 ? '#' : '.')
            : (count == 3               ? '#' : '.');
        }

        
        if (copy[y][x] == '#') on_count++;
      }
    }
    grid = copy;
  }

  console.log(on_count);
}