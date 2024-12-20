const file = require("path").basename(__filename);

// Star 1: 1422
// Star 2: 

solve(`
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`.trim());

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  // 9433

  let sx = 0, sy = 0;
  let ex = 0, ey = 0;
  let maze = data.split("\n").map((r, j) => r.split("").map((c, i) => {
    if (c == 'S') {
      sx = i; sy = j; c = '.';
    } else if (c == 'E') {
      ex = i; ey = j; c = '.';
    }
    return c;
  }));

  // Lengths 85 // 9433

  /* 012345678901234
  0  ###############
  1  #...#...#.....#
  2  #.#.#.#.#.###.#
  3  #S#...#.#.#...#
  4  #######.#.#.###
  5  #######.#.#...#
  6  #######.#.###.#
  7  ###..E#...#...#
  8  ###.#######.###
  9  #...###...#...#
  10 #.#####.#.###.#
  11 #.#...#.#.#...#
  12 #.#.#.#.#.#.###
  13 #...#...#...###
  14 ###############
     012345678901234
  */

  const path = search(maze, '.', '#', sx, sy, ex, ey, 9999);
  //path.reverse();

  console.log(path.length);

  const MAX_CHEATS = 20;
  const MIN_SAVING = 50;

  let total = 0; 
  let cheats = {};
  for (let i = 0; i < path.length; i++) {
    for (let j = i+2; j < path.length; j++) {
      let [ax, ay] = path[i];
      let [bx, by] = path[j];
      let dist = Math.abs(ax - bx) + Math.abs(ay - by);

      if (dist > MAX_CHEATS) continue;

      let saving = (j-i) - dist;

      if (saving < MIN_SAVING) continue;

      cheats[[saving]] ??= 0;
      cheats[[saving]]++;
      total++;
    }
  }

  console.log(total);
}

function search(maze, good_tile, bad_tile, sx, sy, ex, ey, threshold)
{
  const size = maze.length;

  let prev = {};

  let queue = [];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      if (maze[j][i] != good_tile) continue;
      queue.push([i, j, i == sx && j == sy ? 0 : 999999]);
    }
  }

  let visited = {};
  visited[[sx,sy]] = true;

  function move(x, y, cost, prevx, prevy)
  {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    else if (visited[[x,y]] === true) return;
    else if (maze[y][x] == bad_tile) return;
    else if (cost > threshold) return;

    prev[[x,y]] = [prevx, prevy];

    for (let i = queue.length - 1; i >= 0; i--) {
      if (queue[i][0] == x && queue[i][1] == y) {
        queue[i][2] = cost;
      }
    }
  }

  let complete = false;

  while (queue.length > 0) {
    queue.sort((a, b) => b[2] - a[2]);

    let [x, y, cost] = queue.pop();
    visited[[x,y]] = true;

    if (x == ex && y == ey) {
      complete = true;
      break;
    }

    move(x + 1, y, cost + 1, x, y);
    move(x - 1, y, cost + 1, x, y);
    move(x, y + 1, cost + 1, x, y);
    move(x, y - 1, cost + 1, x, y);
  }

  if (!complete) return null;

  let path = [];
  let curr = [ex, ey];
  while (curr !== undefined) {
    path.push(curr);
    curr = prev[curr];
  }

  if (!(path[path.length-1][0] == sx && path[path.length-1][1] == sy)) {
    return null;
  }

  return path;

}
