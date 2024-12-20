const file = require("path").basename(__filename);

// Star 1: 229839456
// Star 2:

parseData(`ULL
RRDDD
LURDL
UUUUD`);


require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data)
);

function parseData(data, w, h) {
  let ops = data.split("\n");

  let keys = [
    [ 'E', 'E',  1,  'E', 'E' ],
    [ 'E',  2,   3,   4,  'E' ],
    [  5,   6,   7,   8,   9 ],
    [ 'E', 'A', 'B', 'C', 'E' ],
    [ 'E', 'E', 'D', 'E', 'E' ]
  ];

  let code = [ 0, 0, 0, 0 ];

  let x = 0, y = 2;
  data.split("\n").map((ops, i) => {
    ops.split("").map(op => {
      switch (op) {
        case "U":
          if (keys[y-1] && keys[y-1][x] != 'E') y--;
          break; 
        case "D":
          if (keys[y+1] && keys[y+1][x] != 'E') y++;
          break; 
        case "L":
          if (keys[y][x-1] && keys[y][x-1] != 'E') x--;
          break; 
        case "R":
          if (keys[y][x+1] && keys[y][x+1] != 'E') x++;
          break; 
      }
    });
    code[i] = keys[y][x];
  });

  console.log(code.join(""));
}
