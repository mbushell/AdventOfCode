const file = require("path").basename(__filename);

// Star 1: <= 653?
// Star 2: 

parseData(`1,0,1~1,2,1
0,2,3~2,2,3
0,0,2~2,0,2
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let maxX = 0, maxY = 0, maxZ = 0;

  const bricks = data.split("\n").map((line, i) => [i+1,
    ...line.split("~").map(
        part => {
          let coords = part.split(",").map(n => parseInt(n));
          maxX = Math.max(coords[0], maxX);
          maxY = Math.max(coords[1], maxY);
          maxZ = Math.max(coords[2], maxZ);
          return coords;
        })
  ]);

  bricks.sort((a, b) => a[1][2] - b[1][2]);

  function dup(a) {
    return [a[0], a[1], a[2]];
  }
  function zero(a) {
    return a[0] == 0 && a[1] == 0 && a[2] == 0;
  }
  function unit(a) {
    return [a[0]?1:0, a[1]?1:0, a[2]?1:0];
  }
  function lteq(a, b) {
    return a[0] <= b[0] && a[1] <= b[1] && a[2] <= b[2];
  }
  function add(a, b) {
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
  }
  function sub(a, b) {
    return [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  }

  function free(grid, l, h) {
    if (l[2] < 1) return false;

    let u = unit(sub(h, l));

    if (zero(u)) return grid[l] === undefined;

    for (let s = l; lteq(s, h); s = add(s, u)) {
      if (grid[s] !== undefined) return false;
    }
    return true;
  }

  //console.log(bricks);

  let grid = {};  
  let g = [0, 0, -1];

  bricks.forEach((brick, i) => {
    let [letter, l, h] = brick;

    let u = unit(sub(h, l));

    while (free(grid, add(l, g), add(h, g))) {
      l[2]--;
      if (!zero(u)) h[2]--;
    }

    if (zero(u)) {
      grid[l] = letter;
    } else {
      for (let s = l; lteq(s, h); s = add(s, u)) {
        grid[s] = letter;
      }
    }

  });
  

  let supporting = {};
  let supportedBy = {};
  
  bricks.forEach(brick => {
    let [letter, l, h] = brick;
    supportedBy[letter] ??= [];
    supporting[letter] ??= [];
    
    let u = unit(sub(h, l));
    let a = add(l, g);
    let b = add(h, g);
    
    for (let s = a; lteq(s, b); s = add(s, u)) {
      if (grid[s] && grid[s] != letter) {
        supportedBy[letter].push(grid[s]);
      }
      if (zero(u)) break;
    }

    a = add(l, [0, 0, 1]);
    b = add(h, [0, 0, 1]);
    for (let s = a; lteq(s, b); s = add(s, u)) {
      if (grid[s] && grid[s] != letter) {
        supporting[letter].push(grid[s]);
      }
      if (zero(u)) break;
    }

  })

  let count = 0;
  bricks.forEach(brick => {
    let vital = false;
    supporting[brick[0]].forEach(name =>
      vital ||= supportedBy[name].length == 1
    );
    if (!vital) count++;
  })

  console.log(count);

  //console.log(viewX(bricks, [maxX, maxY, maxZ]), "\n");
}

