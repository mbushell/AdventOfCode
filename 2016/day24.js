const file = require("path").basename(__filename);

function solve(data)
{
  let locations = {};
  let grid = data.split("\n").map((row, j) =>
    row.split("").map((c, i) => {
      if (c == '.' || c == '#') return c;
      locations[c] = [i, j];
      return '.';
    })
  );
  
  let location_list = Object.entries(locations);
  let distances = {};
  for (let i = 0; i < location_list.length; i++) {
    for (let j = i + 1; j < location_list.length; j++) {
      let a = location_list[i][1];
      let b = location_list[j][1];
      let u = location_list[i][0];
      let v = location_list[j][0];
      let dist = find_path(grid, a, b);
      distances[u] ??= {};
      distances[v] ??= {};
      distances[u][v] = dist;
      distances[v][u] = dist;
    }
  }
  
  function * orders(nums, order) {
    if (order.length == nums.length) yield order;
    for (let n of nums) {
      if (order.indexOf(n) >= 0) continue;
      yield * orders(nums, [...order, n]);
    }
  }

  let all_orders = [];
  for (let order of orders([0,1,2,3,4,5,6,7], [0])) {
    let cost = 0;
    for (let i = 0; i < order.length-1; i++) {
      cost += distances[order[i]][order[i+1]];
    }
    all_orders.push([order, cost]);
  }
  
  all_orders.sort((a, b) => a[1] - b[1]);
  console.log("Star 1:", all_orders[0][1]);

  all_orders.forEach(order => {
    order[1] += distances[order[0].slice(-1)][0];
  });

  all_orders.sort((a, b) => a[1] - b[1]);
  console.log("Star 2:", all_orders[0][1]);
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