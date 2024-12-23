const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

let md5 = require("md5");

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  for (let i = 0; i < 3000000; i++) {
    let hash = md5(data + i.toString());
    if (hash.slice(0, 6) == "000000") {
      console.log(i);
      break;
    }
  }
}