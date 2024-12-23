const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

// Part 1
function solve1(data) {
  console.log(data.match(/(-?\d+)/g).reduce((t, n) => t + parseInt(n), 0));
}

// Part 2
function solve(data) {
  console.log(sum(JSON.parse(data)));
}

function sum(obj) {
  switch (obj.constructor.name) {
    case "Number": return obj;
    case "Object":
      let values = Object.values(obj);
      if (values.indexOf("red") >= 0) return 0;
      obj = values;
    case "Array":
      return obj.map(sum).reduce((t, c) => t + c, 0);
    default: return 0;
  }
}