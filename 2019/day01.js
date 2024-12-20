const file = require("path").basename(__filename);

// Star 1: 3426455
// Star 2: 5136807

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data.trim())
);

function parseData(data) {
  let modules = data.split("\n").map((n) => parseInt(n));

  let total = 0;
  modules.forEach((nass) => {
    let fuel = m2f(nass);
    let extra = m2f(fuel);
    while (extra > 0) {
      fuel += extra;
      extra = m2f(extra);
    }
    total += fuel;
  });

  console.log(total);
}

function part1(data) {
  console.log(
    data
      .split("\n")
      .map((n) => parseInt(n))
      .reduce((total, curr) => total + m2f(curr), 0)
  );
}

function m2f(m) {
  return Math.trunc(m / 3) - 2;
}
