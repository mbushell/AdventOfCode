const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  let props = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
  };

  let best_match = 0;
  let best_match_id = null;

  data.split("\n").forEach(line => {
    let sue = line.match(/^Sue (\d+): (.*)/);

    let matches = 0;
    sue[2].split(", ").forEach(prop => {
      let [k,v] = prop.split(": ");
      switch (k) {
        case "cats":
        case "trees":
          if (v > props[k]) matches++;
          break;
        case "pomeranians":
        case "goldfish":
          if (v < props[k]) matches++;
          break;
        default:
          if (props[k] == v) matches++;
      }
    })

    if (matches > best_match) {
      best_match = matches;
      best_match_id = sue[1];
    }
  });

  console.log(best_match_id);
}