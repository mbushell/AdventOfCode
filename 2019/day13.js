const file = require("path").basename(__filename);
const rl = require(`readline-sync`);

// Star 1: 213
// Star 2: 

const IC = require("./intcode.js");

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  let comp = new IC();
  comp.load(data);
  comp.code[0] = 2; // 2 quarters
  comp.start();

  let grid = [];
  let score = 0;

  let paddle;
  let ball;
  
  while (comp.status == IC.AWAITING_INPUT)
  {
    let out = comp.outputs;
    for (let i = 0; i < out.length; i += 3) {
      let [x,y] = [out[i], out[i+1]];
      if (x == -1 && y == 0) {
        score = out[i+2];
      } else {
        grid[y] ??= [];

        switch (out[i+2]) {
          case 0: grid[y][x] = ' '; break;
          case 1: grid[y][x] = '#'; break;
          case 2: grid[y][x] = '@'; break;
          case 3: grid[y][x] = '-'; paddle = x; break;
          case 4: grid[y][x] = 'O'; ball = x;   break;
        }
      }
    }
    comp.outputs = [];

    console.clear();
    console.log(grid.map(r => r.join("")).join("\n"));
    console.log(score);
    
    comp.input(paddle == ball ? 0 : paddle < ball ? 1 : -1);
  }

  console.clear();
  console.log(grid.map(r => r.join("")).join("\n"));
  console.log(comp.outputs[comp.outputs.length-1]);
}
