const file = require("path").basename(__filename);

function solve(data)
{  
  function new_grid() {
    let grid = data.split("\n").map(r => r.split(""));
    let size = grid.length;
    let padding = 999;
  
    let sides = Array(padding).fill('.');
    for (let j = 0; j < grid.length; j++) {
      grid[j] = [...sides, ...grid[j], ...sides];
    }
    for (let i = 0; i < padding; i++) {
      grid.unshift(Array(size+2*padding).fill('.'));
      grid.push(Array(size+2*padding).fill('.'));
    }
    return grid;
  }

  let new_virus = (grid) => { return {
    x:  Math.trunc(grid.length/2),
    y:  Math.trunc(grid.length/2),
    dx: 0,
    dy: -1,
  }};

  let total = 0;
  let grid  = new_grid();
  let virus = new_virus(grid);
  for (let t = 0; t < 10000; t++) {
    if (burst(grid, virus, false)) {
      total++;
    }
  }
  console.log("Star 1:", total);

  
  total = 0;
  grid  = new_grid();
  virus = new_virus(grid);
  for (let t = 0; t < 10000000; t++) {
    if (burst(grid, virus, true)) {
      total++;
    }
  }
  console.log("Star 2:", total);
}

function burst(grid, virus, evolved)
{
  let infected = false;
  let cell = grid[virus.y][virus.x];

  if (cell == '.') {
    if (evolved) {
      grid[virus.y][virus.x] = 'W';
    } else {
      grid[virus.y][virus.x] = '#';
      infected = true;
    }
    let t = virus.dx;
    virus.dx = virus.dy;
    virus.dy = -t;
  }
  else if (cell == 'W') {
    grid[virus.y][virus.x] = '#';
    infected = true;
  }
  else if (cell == '#') {
    if (evolved) {
      grid[virus.y][virus.x] = 'F';
    } else {
      grid[virus.y][virus.x] = '.';
    }
    let t = virus.dx;
    virus.dx = -virus.dy;
    virus.dy = t;
  }
  else if (cell == 'F') {
    grid[virus.y][virus.x] = '.';
    virus.dx = -virus.dx;
    virus.dy = -virus.dy;
  }
  virus.x += virus.dx;
  virus.y += virus.dy;
  return infected;
}

function print_grid(grid) {
  console.log(grid.map((r, j) => r.map(
    (c, i) => {
      if (i == virus.x && j == virus.y) return `[${c}]`;
      return ` ${c} `;
    }
  ).join("")).join("\n"), "\n");
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);