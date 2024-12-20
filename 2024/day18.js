const file = require("path").basename(__filename);

// Star 1: 334
// Star 2: 

/*
solve(`5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`);
return;
*/

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  const bytes = data.split("\n").map(r => r.split(",").map(n => parseInt(n)));

  const size = 71;//71;
  //const fall = 12;//1024;
  
  for (let i = 1; i <= bytes.length; i++) {
    let result = run(bytes, size, i);
    console.log(i, result, bytes[i-1]);
    if (result === 9999) {
      break;
    }
  }
  //console.log(grid.map(r => r.join("")).join("\n"));
}

function run(bytes, size, fall)
{
  const grid = makeGrid(size);

  for (let i = 0; i < fall; i++) {
    let [x, y] = bytes[i];
    grid[y][x] = '#';
  }
  
  let queue   = [];
  let visited = { '0,0': true };
  
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      queue.push([i, j, (i == 0 && j == 0) ? 0 : 9999]);
    }
  }
  

  function update(x, y, cost)
  {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    else if (grid[y][x] == '#') return;
    else if (visited[[x,y]]) return;

    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i][0] == x && queue[i][1] == y) {
        queue[i][2] = cost;
      }
    }
  }

  let best = 9999;

  while (queue.length > 0)
  {
    queue.sort((a, b) => b[2] - a[2]);

    let [x, y, cost] = queue.pop();
    visited[[x,y]] = true;

    if (x == size-1 && y == size-1) {
      best = cost;
      break;
    }

    update(x + 1, y, cost + 1);
    update(x - 1, y, cost + 1);
    update(x, y + 1, cost + 1);
    update(x, y - 1, cost + 1);
  }

  return best;
}

function makeGrid(size)
{
  const grid = [];
  for (let j = 0; j < size; j++) {
    grid.push(Array(size).fill('.'));
  }
  return grid;
}