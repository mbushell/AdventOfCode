const file = require("path").basename(__filename);

function solve(data)
{
  let discs = data.split("\n").map(line => {
    let nums = line.match(/(\d+)/g).map(Number);
    return {
      positions: nums[1],
      initial: nums[3]
    };
  });

  console.log("Star 1:", run(discs));

  discs.push({ positions: 11, initial: 0 });
  console.log("Star 2:", run(discs));
}

function run(discs) {
  discs.forEach(disc => disc.current = disc.initial);
  for (let t = 0; true; t++) {
    let passed = true;
    for (let i = 0; i < discs.length; i++) {
      discs[i].current = (discs[i].initial + t + i + 1) % discs[i].positions;
      passed &&= discs[i].current == 0;
    }
    if (passed) {
      return t;
    }
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);