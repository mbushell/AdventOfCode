const file = require("path").basename(__filename);

function solve(data)
{
  let banks = data.match(/(\d+)/g).map(Number);
  
  let seen = {};
  let cycles = 0;
  let first_cycle = 0;
  
  while (true) {
    seen[banks] ??= 0;
    seen[banks]++;
    
    if (seen[banks] == 2 && !first_cycle) {
      console.log("Star 1:", cycles);
      first_cycle = cycles;
    } else if (seen[banks] == 3) {
      console.log("Star 2:", cycles - first_cycle);
      return;
    }

    let j = -1;
    for (let i = 0; i < banks.length; i++) {
      if (j == -1 || banks[i] > banks[j]) j = i;
    }

    let blocks = banks[j];
    banks[j] = 0;
    while (blocks-- > 0) {
      banks[(++j) % banks.length]++;
    }

    cycles++;
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);