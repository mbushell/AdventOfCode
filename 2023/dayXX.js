const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

parseData(``);
return;

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  console.log(data);
}