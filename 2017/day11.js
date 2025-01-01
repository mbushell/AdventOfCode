const file = require("path").basename(__filename);

function solve(data)
{
  let p = 0, q = 0, r = 0;

  let dist = (p, q, r) =>
    (Math.abs(p) + Math.abs(q)+ Math.abs(r)) / 2;

  let distance = 0;
  let furthest = Number.MIN_SAFE_INTEGER;

  data.split(",").forEach(dir => {
    switch (dir) {
      case "n":  q++; r--; break;
      case "ne": p++; r--; break;
      case "se": p++; q--; break;
      case "s":  q--; r++; break;
      case "sw": p--; r++; break;
      case "nw": p--; q++; break; 
    }
    distance = dist(p, q, r);
    furthest = Math.max(distance, furthest);
  });

  console.log("Star 1:", distance);
  console.log("Star 2:", furthest);
}


require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);