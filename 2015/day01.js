const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

//solve(``);
//return;

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let floor = 0;
  for (let i = 0; i < data.length; i++) {
    floor += data[i] == '(' ? 1 : -1;
    if (floor === -1) console.log("Basement:", i+1)
  }
  console.log(floor);
}