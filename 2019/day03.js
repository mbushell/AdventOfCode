const file = require("path").basename(__filename);

// Star 1: 293
// Star 2: 27306

parseData(`R8,U5,L5,D3
U7,R6,D4,L4`);

parseData(`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`);

parseData(`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`);

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data.trim())
);

function parseData(data) {
  let [u, v] = data
    .split("\n")
    .map((wire) => wire.split(",").map(
      op => [op[0], parseInt(op.slice(1))])
    );

  function trace(wire, visit) {
    let x = 0, y = 0;
    wire.forEach(([dir, dist]) => {
      for (; dist > 0; dist--) {
        switch (dir) {
          case "U": y++; break;
          case "D": y--; break;
          case "L": x--; break;
          case "R": x++; break;
        }
        visit(x, y);
      }
    });
  }

  let seen = {};
  let intersections = [];

  let upath = [];
  trace(u, (x, y) => {
    seen[[x,y]] = true;
    upath.push([x,y]);
  });

  let vpath = [];
  trace(v, (x, y) => {
    if (seen[[x,y]]) {
      intersections.push([x,y]);
    }
    vpath.push([x,y]);
  });

  let costs = [];
  intersections.forEach(([x,y]) => {
    if (x == 0 && y == 0) return;
    let ucost = upath.findIndex(p => p[0] == x && p[1] == y)+1;
    let vcost = vpath.findIndex(p => p[0] == x && p[1] == y)+1;
    costs.push(ucost+vcost);
  });

  console.log(Math.min(...costs));
}
