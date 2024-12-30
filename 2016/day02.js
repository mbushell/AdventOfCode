const file = require("path").basename(__filename);

function parseData(data, w, h) {
  let ops = data.split("\n");

  let keys1 = [
    [ 1, 2, 3 ],
    [ 4, 5, 6 ],
    [ 7, 8, 9 ]
  ];

  let keys2 = [
    [ 'E', 'E',  1,  'E', 'E' ],
    [ 'E',  2,   3,   4,  'E' ],
    [  5,   6,   7,   8,   9 ],
    [ 'E', 'A', 'B', 'C', 'E' ],
    [ 'E', 'E', 'D', 'E', 'E' ]
  ];
  
  function answer(keys) {
    let x = 0, y = 2;
    let code = [ 0, 0, 0, 0 ];
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
    return code.join("");
  }

  console.log("Star 1:", answer(keys1));
  console.log("Star 2:", answer(keys2));
}

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data)
);
