const file = require("path").basename(__filename);

function solve(data) 
{
  let blocked = [];
  data.split("\n").forEach(line =>
    blocked.push(line.split("-").map(Number))
  );

  blocked.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < blocked.length - 1;) {
    let [low, high] = blocked[i];
    i++;
    while (i < blocked.length && high >= blocked[i][0]-1) {
      low  = blocked[i][0] = Math.min(low, blocked[i][0]);
      high = blocked[i][1] = Math.max(high, blocked[i][1]);
      blocked[i-1] = null;
      i++;
    }
  }

  blocked = blocked.filter(a => a !== null);
  
  console.log("Star 1:", blocked[0][1] + 1);
  
  let total = 0;
  for (let i = 0; i < blocked.length - 1; i++) {
    total += blocked[i+1][0] - blocked[i][1] - 1;
  }
  console.log("Star 2:", total);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);