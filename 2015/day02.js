const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let boxes = data.split("\n").map(box => box.split("x").map(n => parseInt(n)));
  
  let total = 0;
  boxes.forEach(([l,w,h]) => {
    let a = l*w;
    let b = w*h;
    let c = h*l;
    total += Math.min(a,b,c) + 2*(a+b+c);
  });
  console.log("wrapping paper:", total);

  total = 0;
  boxes.forEach(box => {
    let v = box[0]*box[1]*box[2];
    let a = Math.min(...box);
    box.splice(box.indexOf(a), 1);
    let b = Math.min(...box);
    total += 2*(a+b) + v;
  });
  console.log("ribbon:", total);
}