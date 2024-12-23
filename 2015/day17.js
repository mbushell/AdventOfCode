const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let sizes = data.split("\n").map(n => parseInt(n));
  
  let target = 150;

  let counts = {};
  let total_count = 0;

  function all(i, total, used) {
    if (total >= target) {
      if (total == target) {
        total_count++;
        counts[used] ??= 0;
        counts[used]++;
      }
      return;
    }
    for (let j = i + 1; j < sizes.length; j++) {
      all(j, total + sizes[j], used + 1);
    }
  }

  all(-1, 0, 0);
  console.log(total_count);
  console.log(counts);
}