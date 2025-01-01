const file = require("path").basename(__filename);

function solve(data)
{
  function count(offset) {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] == data[(i + offset) % data.length]) {
        total += Number(data[i]);
      }
    }
    return total;
  }

  console.log("Star 1:", count(1));
  console.log("Star 2:", count(data.length/2));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);