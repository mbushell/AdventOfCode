const file = require("path").basename(__filename);

// Star 1: 256 at [29, 28]
// Star 2: 1707 at [17, 7]

/* Star 1
parseData(`.#..#
.....
#####
....#
...##`); // 8 at [3, 4]

parseData(`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`); // 33 at [5, 8]

parseData(`#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`); // 35 at [1, 2]

parseData(`.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`); //41 at [6, 3]

parseData(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`); // 210 at [11, 13]
*/

// Star 2
/*
parseData(`
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##
`.trim()); // 30 at [8, 3], last zap [14, 3]
*/

parseData(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`); // 210 at [11, 13], 200th zap [14, 3]


require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  let locations = {};
  let asteroids = [];
  let grid = data.split("\n").map((r, j) => r.split("").map((c, i) => {
    if (c == '#') {
      asteroids.push([i,j]);
      locations[[i,j]] = true;
    }
    return c;
  }));

  let [[x0, y0], best] = bestLocation(grid, asteroids, locations);
  console.log("Station at", [x0,y0], "can see", best, "asteroids.");
  
  asteroids.splice(asteroids.findIndex(([x,y]) => x == x0 && y == y0), 1);

  let dists = {};
  let angles = {};
  asteroids.forEach(([x, y]) => {
    let dx = x - x0;
    let dy = y - y0;
    dists[[x,y]] = Math.sqrt(dx**2 + dy**2);
    angles[[x,y]] = Math.atan2(dy, dx)*180/Math.PI + 90;

    if (y < y0 && angles[[x,y]] < 0) {
      angles[[x,y]] += 360;
    }
  });

  asteroids.sort((a, b) => {
    let angleDiff = angles[a] - angles[b];
    if (angleDiff != 0) return angleDiff;
    return dists[a] - dists[b];
  });

  let i = 0;
  let j = 0;
  let k = 0;
  let next = null;
  let prev = -1;
  let killed = {};
  for (; k < 200; i++)
  {
    if (i >= asteroids.length) {
      i = 0; prev = -1;
    }

    next = asteroids[i];
    if (killed[next]) continue;

    let angle = angles[next];
    if (angle == prev) continue;

    //console.log("zap!", next);
    killed[next] = true;
    grid[next[1]][next[0]] = ++j;
    k++;

    if (j == 9) { j = 0; };

    prev = angle;
  }

  console.log(next);
  console.log(next[0]*100 + next[1]);

}

function bestLocation(grid, asteroids, locations)
{
  const h = grid.length;
  
  let best = 0;
  let cx = 0;
  let cy = 0;

  asteroids.forEach(([x1,y1], i) => {
    let blocked = {};
    asteroids.forEach(([x2,y2], j) => {
      if (i == j) return;
      let dy = y2 - y1;
      let dx = x2 - x1;
      if (dx == 0) {
        let x = x1;
        for (let y = Math.min(y1, y2)+1; y < Math.max(y1, y2); y++) {
          if (!locations[[x,y]]) continue;
          //console.log(x, y, "blocks", x1, y1, "from seeing", x2, y2);
          blocked[[x2,y2]] = true;
        }
      } else {
        let m = dy/dx;
        for (let x = Math.min(x1, x2)+1; x < Math.max(x1, x2); x++)
        {
          y = m*(x - x1) + y1;
          if (!locations[[x,y]]) continue;
          if (Number.isInteger(y) && y >= 0 && y <= h) {
            //console.log(x, y, "blocks", x1, y1, "from seeing", x2, y2);
            blocked[[x2,y2]] = true;
          }
        }
      }
    });

    let seen = asteroids.length - Object.keys(blocked).length - 1;

    if (seen > best) {
      best = seen;
      cx = x1;
      cy = y1;
    }
  });

  return [[cx,cy], best];
}
