const file = require("path").basename(__filename);

// Star 1: 102460
// Star 2: 527


solve(`###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`);

solve(`#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let x, y, ex, ey;
  const maze = data.split("\n").map((r, j) => r.split("").map((c, i) => {
    if (c == 'S') { x=i; y=j; } else if (c == 'E') { ex=i; ey=j; }
    return c;
  }));

  let best = {};
  best[[x,x]] = 0;

  let complete = [];
  
  let paths = [{ p: [x, y], d: [1, 0], list: [[x,y], null], strike: false, cost: 0 }];
  
  while (paths.length > 0)
  {
    let path = paths.pop();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(d =>
    {
      if (d[0] == -path.d[0] && d[1] == -path.d[1]) return;

      let p = [path.p[0] + d[0], path.p[1] + d[1]];


      if (maze[p[1]][p[0]] == '#') return;

      let turn = (d[0] == path.d[0] && d[1] == path.d[1]);
      let cost = path.cost + (turn ? 1 : 1001);
      let strike = path.strike;

      if (best[p] !== undefined && cost > best[p]) {
        if (strike) return;
        strike = true;
      }

      best[p] = cost;

      if (p[0] == ex && p[1] == ey) {
        complete.push([path.list, cost]);
        return;
      }

      paths.push({ p: p, d: d, list: [p, path.list], strike: strike, cost: cost });
    });
  }
  
  console.log(best[[ex,ey]]);

  // Part 2
  let seat = {};
  complete.forEach(path => {
    let [list, cost] = path;
    if (cost != best[[ex,ey]]) return;
    for (let q = list; q[1] != null; q = q[1]) {
      seat[q[0]] = true;
    }
  });
  
  console.log(Object.keys(seat).length + 2);
}