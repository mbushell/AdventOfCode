const file = require("path").basename(__filename);

function solve(data)
{
  let jumps = data.split("\n").map(Number);
  let steps = 0;
  for (let i = 0; i >= 0 && i < jumps.length;) {
    i += jumps[i]++;
    steps++;
  }
  console.log("Star 1:", steps);

  jumps = data.split("\n").map(Number);
  steps = 0;
  for (let i = 0; i >= 0 && i < jumps.length;) {
    i += jumps[i] >= 3 ? jumps[i]-- : jumps[i]++;
    steps++;
  }
  console.log("Star 2:", steps);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);