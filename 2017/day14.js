const file = require("path").basename(__filename);

const knot_hash = require("./day10.js").knot_hash;

function solve(data)
{
  let hex = "0123456789abcdef";
  let bin = {}
  hex.split("").forEach(c =>
    bin[c] = `000${parseInt(c, 16).toString(2)}`.slice(-4)
  );
  let hex_to_bin = c => bin[c];

  let ones = 0;
  let grid = [];
  for (let j = 0; j < 128; j++) {
    let hash = knot_hash(`${data}-${j}`);
    let row = hash.split("").map(c => hex_to_bin(c)).join("");
    grid[j] = row.split("");
    ones += row.replaceAll("0", "").length;
  }
  
  console.log("Star 1:", ones);

  let regions = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i] == '1') {
        find_region(grid, i, j);
        regions++;
      }
    }
  }
  console.log("Star 2:", regions);
}

function find_region(grid, i, j) {
  if (!grid[j] || grid[j][i] != '1') return;
  grid[j][i] = 3;
  find_region(grid, i-1, j);
  find_region(grid, i+1, j);
  find_region(grid, i, j-1);
  find_region(grid, i, j+1);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);