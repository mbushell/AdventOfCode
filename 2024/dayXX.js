const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

solve(``);
return;

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  console.log(data);
}