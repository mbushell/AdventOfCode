const file = require("path").basename(__filename);

function solve(data)
{
  let secret_number = Number(data);

  function is_open(x, y) {
    let z = x*x + 3*x + 2*x*y + y + y*y;
    z += secret_number;
    let ones = 0;
    for (let c of z.toString(2)) {
      if (c == '1') ones++;
    }
    return ones % 2 == 0;
  }

  let target = [31, 39];

  let grid = [];
  for (let j = 0; j < 100; j++) {
    grid[j] = [];
    for (let i = 0; i < 100; i++) {
      grid[j].push(is_open(i, j) ? '.' : '#');
    }
  }

  console.log("Star 1:", find_path(grid, [1,1], [31, 39]));
  console.log("Star 2:", find_path(grid, [1,1], undefined, 50))
}

function find_path(grid, from, to, upper_limit)
{
  let queue = new Queue();
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i] == '.') {
        queue.push([i, j], Infinity);
      }
    }
  }
  queue.change(from, 0);

  function * neighbours(x, y) {
    if (grid[y-1] && grid[y-1][x] == '.') yield [x, y-1];
    if (grid[y+1] && grid[y+1][x] == '.') yield [x, y+1];
    if (grid[y][x-1] == '.') yield [x-1, y];
    if (grid[y][x+1] == '.') yield [x+1, y];
  }

  upper_limit ??= Infinity;

  let visited = {};
  while (true) {
    let [pt, cost] = queue.pop();
    visited[pt] = true;
    if (!(cost <= upper_limit)) break;
    if (to !== undefined) {
      if (pt[0] == to[0] && pt[1] == to[1]) {
        return cost;
      }
    }
    cost++;
    for (let nbr of neighbours(...pt)) {
      if (!visited[nbr] && cost < queue.weight(nbr)) {
        queue.change(nbr, cost);
      }
    }
  }
  
  return Object.keys(visited).length - 1;
}

class Queue {
  constructor() {
    this.queue  = [];
    this.index  = {};
  }
  push(value, weight) {
    this.index[value] = this.queue.length;
    this.queue.push([weight, value]);
  }
  pop() {
    let min_index  = -1;
    let min_weight = Infinity;
    let min_value  = null;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i][0] < min_weight) {
        min_index  = i;
        min_weight = this.queue[i][0];
        min_value  = this.queue[i][1];
      }
    }
    if (min_index >= 0) {
      this.queue[min_index][0] = Infinity;
    }
    return [min_value, min_weight];
  }
  change(value, weight) {
    this.queue[this.index[value]][0] = weight;
  }
  weight(value) {
    return this.queue[this.index[value]][0];
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);