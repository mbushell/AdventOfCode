const file = require("path").basename(__filename);

const IC = require("./intcode.js");

// Star 1: 2720
// Star 2: JZPJRAGJ

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  let panels;
  
  panels = {'0,0': 0};
  paint(data, panels);
  let result = Object.keys(panels).length;
  console.log("Star 1");
  console.log("Expected:", 2720);
  console.log("Outcome: ", result);
  console.log("Passed:  ", result===2720);
  console.log();
  
  panels = {'0,0': 1};
  let [minX, maxX, minY, maxY] = paint(data, panels);
  

  let grid = [];
  for (let j = minY; j <= maxY; j++) {
    let row = [];
    grid.unshift(row);
    for (let i = minX; i <= maxX; i++) {
      let colour = panels[[i,j]];
      if (colour === undefined) row.push(' ');
      else if (colour === 0)    row.push('.');
      else                      row.push('#');
    }
  }

  console.log("Star 2");
  console.log("Expected: JZPJRAGJ")
  console.log(grid.map(r => r.join("")).join("\n"));
}

function paint(data, panels)
{  
  let comp = new IC();
  comp.load(data);
  comp.start();
  
  let  x = 0,  y = 0;
  let dx = 0, dy = 1;

  let minX = 9999;
  let maxX = -999;
  let minY = 9999;
  let maxY = -999;

  while (comp.status == IC.AWAITING_INPUT)
  {
    minX = Math.min(x, minX);
    maxX = Math.max(x, maxX);
    minY = Math.min(y, minY);
    maxY = Math.max(y, maxY);
    
    panels[[x,y]] ??= 0;
    comp.input(panels[[x,y]]);

    let [colour, move] = comp.outputs;
    comp.outputs = [];

    panels[[x,y]] = colour;

    let t = dx;
    switch (move) {
      case 0: dx = -dy; dy =  t; break; // L90
      case 1: dx =  dy; dy = -t; break; // R90
    }

    x += dx;
    y += dy;
  }

  return [minX, maxX, minY, maxY];
}