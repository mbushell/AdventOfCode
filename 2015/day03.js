const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  // Part 1
  let x = 0, y = 0;
  let presents = {};
  presents[[0,0]] = 1;
  for (let i = 0; i < data.length; i++) {
    switch (data[i]) {
      case "^": y++; break;
      case "v": y--; break;
      case "<": x--; break;
      case ">": x++; break;
    }
    presents[[x,y]] ??= 0;
    presents[[x,y]]++;
  }
  console.log(Object.values(presents).length);

  // Part2
  let sx = 0, sy = 0;
  let rx = 0, ry = 0;
  presents = {};
  presents[[0,0]] = 2;
  for (let i = 0; i < data.length; i++) {
    switch (data[i]) {
      case "^": i%2 ? sy++ : ry++; break;
      case "v": i%2 ? sy-- : ry--; break;
      case "<": i%2 ? sx-- : rx--; break;
      case ">": i%2 ? sx++ : rx++; break;
    }
    if (i%2) {
      presents[[sx,sy]] ??= 0;
      presents[[sx,sy]]++;
    } else {      
      presents[[rx,ry]] ??= 0;
      presents[[rx,ry]]++;
    }
  }
  console.log(Object.values(presents).length);
}