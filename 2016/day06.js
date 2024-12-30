const file = require("path").basename(__filename);

function solve(data)
{
  let positions = {};
  data.split("\n").map(line => {
    for (let i = 0; i < line.length; i++) {
      positions[i] ??= {};
      positions[i][line[i]] ??= 0;
      positions[i][line[i]]++;
    }
  });
  let star1 = Object.values(positions).map(counts => {
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }).join("");
  console.log("Star 1:", star1);

  let star2 = Object.values(positions).map(counts => {
    return Object.entries(counts).sort((a, b) => a[1] - b[1])[0][0]
  }).join("");
  console.log("Star 2:", star2);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);