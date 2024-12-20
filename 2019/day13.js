const file = require("path").basename(__filename);
const rl = require(`readline-sync.js`);

// Star 1: 213
// Star 2: 

const IC = require("./intcode.js");

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  /*
     0,   31,  121,  167,  198,  227,  245,
   319,  396,  460,  470,  549,  621,  677,
   685,  782,  871,  954, 1047, 1137, 1222,
  1263, 1359, 1431, 1439, 1512, 1548, 1637,
  1718, 1811, 1894, 1952, 2036, 2132, 2228,
  2307, 2351, 2355, 2390, 2479, 2495, 2542,
  2595, 2690, 2746, 2796, 2893, 2906, 2987,
  3083, 3120, 3164, 3230
  ] [
    [ 22, 17 ], [ 23, 16 ], [ 24, 15 ], [ 24, 14 ],
    [ 26, 16 ], [ 25, 17 ], [ 21, 11 ], [ 20, 14 ],
    [ 19, 12 ], [ 21, 15 ], [ 24, 11 ], [ 20, 15 ],
    [ 26, 9 ],  [ 19, 16 ], [ 27, 8 ],  [ 18, 16 ],
    [ 19, 17 ], [ 28, 7 ],  [ 18, 17 ], [ 30, 4 ],
    [ 33, 9 ],  [ 33, 6 ],  [ 32, 10 ], [ 30, 8 ],
    [ 33, 5 ],  [ 31, 10 ], [ 32, 5 ],  [ 30, 11 ],
    [ 32, 4 ],  [ 30, 7 ],  [ 33, 4 ],  [ 29, 8 ],
    [ 33, 3 ],  [ 30, 9 ],  [ 29, 3 ],  [ 27, 2 ],
    [ 31, 4 ],  [ 25, 4 ],  [ 30, 12 ], [ 28, 10 ],
    [ 28, 3 ],  [ 26, 12 ], [ 28, 13 ], [ 23, 9 ],
    [ 25, 7 ],  [ 32, 16 ], [ 33, 14 ], [ 30, 16 ],
    [ 32, 17 ], [ 29, 15 ], [ 32, 13 ], [ 28, 16 ]
  ]
  */


  let comp = new IC();
  comp.load(data);

  /*
  let ptr = 0;
  for (let i = 0; i < comp.code.length; i++) {
    if (comp.code[i] == 16 && comp.code[i+1] == 19) {
      ptr = i;
    }
  }
  function move(x,y) {
    comp.code[ptr]   = x;
    comp.code[ptr+1] = y;
  }
  move(1,1);
  */

  comp.code[0] = 2; // 2 quarters
  comp.start();

  let grid = [];
  let score = 0;
  let scores = [];
  let hits = [];

  /*let j = 1;
  let k = 1;
  let blocks = [];
  */
  //11292
  //11345
  //11402

  while (comp.status == IC.AWAITING_INPUT)
  {
    let out = comp.outputs;
    for (let i = 0; i < out.length; i += 3) {
      let [x,y] = [out[i], out[i+1]];
      if (x == -1 && y == 0) {
        score = out[i+2];
        scores.push(score);
      } else {
        grid[y] ??= [];

        if (grid[y][x] == '@') {
          hits.push([x, y]);
        }

        switch (out[i+2]) {
          case 0: grid[y][x] = ' '; break;
          case 1: grid[y][x] = '#'; break;
          case 2: grid[y][x] = '@'; break;
          case 3: grid[y][x] = '-'; break;
          case 4: grid[y][x] = 'O'; break;
        }
      }
    }
    comp.outputs = [];

    /*
    if (comp.code[ptr+1] > 17) {
      let x, y;
      while (true) {
        x = Math.trunc(Math.random()*34)+1;
        y = Math.trunc(Math.random()*17)+1;
        if (!blocks[[x,y]]) break;
      }
      move(x, y);
    }*/

    console.clear();
    console.log(grid.map(r => r.join("")).join("\n"));
    console.log(score);
    console.log(comp.code.slice(379,390));

    comp.input(parseInt(rl.question("Input:")));
  }

  // [386] = total score
  // [388] = ball x
  // [389] = ball y
  //
  // 79 80 81  82  83 84 85  86   87  88  89
  //  0, 1, 0, 36, 24, 0, 0,  0, 213, 16, 19
  //  0, 1, 1, 36, 24, 0, 0, 31, 212, 20, 19
  //  0, 1, 1, 36, 24, 0, 0,121, 211, 21, 18
  // 
}
