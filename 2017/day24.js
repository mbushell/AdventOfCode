const file = require("path").basename(__filename);

function solve(data)
{
  let parts = data.split("\n").map(r => r.split("/").map(Number));

  function score(bridge) {
    let total = 0;
    for (let p of bridge) {
      total += p[0]+p[1];
    }
    return total;
  }

  let best_score = -1;
  let longest = null;

  function extend_bridge(bridge, parts) {
    let end = bridge[bridge.length-1];
    let extended = false;
    for (let p of parts) {
      if (p[0] == end[1] || p[1] == end[1]) {
        let new_bridge = [...bridge, [end[1], p[0]==end[1]?p[1]:p[0]]];
        let rest = [...parts];
        rest.splice(rest.indexOf(p), 1);
        extend_bridge(new_bridge, rest);
        extended = true;
      }
    }
    if (!extended) {
      let t = score(bridge);
      if (t > best_score) {
        best_score = t;
      }
      if (longest == null || bridge.length > longest.length) {
        longest = bridge;
      } else if (bridge.length == longest.length) {
        if (score(bridge) > score(longest)) {
          longest = bridge;
        }
      }
    }
  }

  let starts = parts.filter(p => p[0] == 0 || p[1] == 0);
  for (let s of starts) {
    let bridge = [[0, s[0]==0?s[1]:s[0] ]];
    let rest = [...parts];
    rest.splice(rest.indexOf(s), 1);
    extend_bridge(bridge, rest);
  }

  console.log("Star 1:", best_score);
  console.log("Star 2:", score(longest));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);