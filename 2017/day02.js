const file = require("path").basename(__filename);

function solve(data)
{
  let rows = data.split("\n").map(row => 
    row.match(/(\d+)/g).map(Number)
  );

  console.log("Star 1:", rows.reduce((total, row) =>
    total + Math.max(...row) - Math.min(...row), 0));

  console.log("Star 2:", rows.reduce((total, row) => {
    for (let i = 0; i < row.length - 1; i++) {
      for (let j = i + 1; j < row.length; j++) {
        if (row[i] % row[j] == 0) return total + (row[i] / row[j]);
        if (row[j] % row[i] == 0) return total + (row[j] / row[i]);
      }
    }
  }, 0));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);