const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let total = 0;
  data.split("\n").forEach(string => {
    total += string.length - eval(string).length
  });
  console.log(total);

  total = 0;
  data.split("\n").forEach(string => {
    for (let i = 0; i < string.length; i++) {
      if ("\\\"".indexOf(string[i]) >= 0) {
        total++;
      }
    }
    total += 2;
  });
  console.log(total);
}