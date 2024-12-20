const file = require("path").basename(__filename);

// Star 1: 1065
// Star 2:  

let fs = require('node:fs');

parseData(`
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`);

parseData(`111111111111
999999999991
999999999991
999999999991
999999999991`)


fs.readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  const grid = data.trim().split("\n").map(
    r => r.split("").map(n => parseInt(n))
  );

  let size = grid.length -1;

  let paths = [ ["0,0,0,0", 0, 0, 0, 0, 0, size+size] ];

  let mins = {};
  let best = 9999; //1278

  //const outFile = file.replace(".js", "-mins.txt");
  //mins = JSON.parse(fs.readFileSync(outFile));
  //Object.keys(mins).forEach(key => {
  //  if (mins[key] > best) mins[key] = best;
  //});

  function queue(q, p, dx, dy)
  {
    let [key, x, y, sx, sy, cost, dist] = p;
  
    let nx = x + dx, ny = y + dy;

    if (nx < 0 || ny < 0 || nx > size || ny > size) return;

    let ncost = cost + grid[ny][nx];
    let ndist = dist - dx - dy;

    if (ncost + ndist > best) return;

    let nsx = dx != 0 ? (sx+dx) : 0;
    let nsy = dy != 0 ? (sy+dy) : 0;
    
    let nkey = `${nx},${ny},${nsx},${nsy}`;

    mins[nkey] ??= best;
    if (ncost >= mins[nkey]) return;
    mins[nkey] = ncost;

    let i;
    for (i = q.length - 1; i >= 0; i--) {
      if (ndist < q[i][6]) break;
    }
    q.splice(i, 0, [nkey, nx, ny, nsx, nsy, ncost, ndist]);
  }

  while (paths.length > 0) {
    let p = paths.pop();
    let [key, x, y, sx, sy, cost, dist] = p;
    
    if (cost > best) continue;

    mins[key] = Math.min(cost, mins[key]);
    if (cost > mins[key]) continue;
    mins[key] = cost;


    if (x == size && y == size) {
      best = cost;
      console.log("best", best, sx, sy, paths.length);
      continue;
    }
    
    if ((sx==0&&sy==0) || sx != 0 || Math.abs(sy) >= 4) {
      if (sx >= 0 && sx < 10)  queue(paths, p, 1, 0);
      if (sx <= 0 && sx > -10) queue(paths, p, -1, 0);
    }
    if ((sx==0&&sy==0) || sy != 0 || Math.abs(sx) >= 4) {
      if (sy >= 0 && sy < 10)  queue(paths, p, 0, 1);
      if (sy <= 0 && sy > -10) queue(paths, p, 0, -1);
    }
  }

  console.log(best);
  
  //fs.truncateSync(outFile, 0); 
  //fs.writeFileSync(outFile, JSON.stringify(mins));

}



// Part 1
/*

function parseData(data)
{
  const grid = data.trim().split("\n").map(
    r => r.split("").map(n => parseInt(n))
  );

  let size = grid.length -1;

  let paths = [ ["0,0,0,0", 0, 0, 0, 0, 0, size+size] ];

  let mins = {};
  let best = 9999; //1278

  //const outFile = file.replace(".js", "-mins.txt");
  //mins = JSON.parse(fs.readFileSync(outFile));
  //Object.keys(mins).forEach(key => {
  //  if (mins[key] > best) mins[key] = best;
  //});

  function queue(q, p, dx, dy)
  {
    let [key, x, y, sx, sy, cost, dist] = p;
  
    let nx = x + dx, ny = y + dy;

    if (nx < 0 || ny < 0 || nx > size || ny > size) return;

    let ncost = cost + grid[ny][nx];
    let ndist = dist - dx - dy;

    if (ncost + ndist > best) return;

    let nsx = dx != 0 ? (sx+dx) : 0;
    let nsy = dy != 0 ? (sy+dy) : 0;
    
    let nkey = `${nx},${ny},${nsx},${nsy}`;

    mins[nkey] ??= best;
    if (ncost >= mins[nkey]) return;
    mins[nkey] = ncost;

    let i;
    for (i = q.length - 1; i >= 0; i--) {
      if (ndist < q[i][6]) break;
    }
    q.splice(i, 0, [nkey, nx, ny, nsx, nsy, ncost, ndist]);
  }

  while (paths.length > 0) {
    let p = paths.pop();
    let [key, x, y, sx, sy, cost, dist] = p;
    
    if (cost > best) continue;

    mins[key] = Math.min(cost, mins[key]);
    if (cost > mins[key]) continue;
    mins[key] = cost;


    if (x == size && y == size) {
      console.log("best", best, paths.length);
      best = cost;
      continue;
    }
    
    if (sx >= 0 && sx < 3)  queue(paths, p, 1, 0);
    if (sx <= 0 && sx > -3) queue(paths, p, -1, 0);
    if (sy >= 0 && sy < 3)  queue(paths, p, 0, 1);
    if (sy <= 0 && sy > -3) queue(paths, p, 0, -1);
  }

  console.log(best);
  
  //fs.truncateSync(outFile, 0); 
  //fs.writeFileSync(outFile, JSON.stringify(mins));

}
*/