const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  const instructions = data.split("\n").map(line => {
    return [
      line.match(/^[\D]+(?=\d)/)[0].trim(),
      line.match(/[\d]+/g).map(n => parseInt(n))
    ]
  });

  /*
  let size = 1000;
  let on = 0;
  instructions.forEach(([op, [x1,y1,x2,y2]]) => {
    switch (op) {
      case "turn on":  break;
      case "turn off": break;
      case "toggle":   break;
    }
  }
  */
  
  let size = 1000;
  let grid = {};
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      grid[[x,y]] = 0;
    }
  }


  instructions.forEach(([op, [x1,y1,x2,y2]]) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        switch (op) {
          case "turn off": grid[[x,y]] = Math.max(grid[[x,y]] - 1, 0); break;
          case "turn on":  grid[[x,y]] += 1; break;
          case "toggle":   grid[[x,y]] += 2; break;
        }
      }
    }
  });


  let total = 0;
  Object.values(grid).forEach(x => total += x);
  console.log(total);
}