const file = require("path").basename(__filename);

const IC = require("./intcode.js");

function solve(data)
{
  const VISUALISE = false;

  let ic = new IC();
  ic.load(data);

  let response;
  ic.output = s => response = s;
  ic.start();

  let v_dirs = [[0, -1], [0, 1]];
  let h_dirs = [[-1, 0], [1, 0]];

  let dirs = v_dirs;
  
  let curr_x = 0;
  let curr_y = 0;
  let curr_d = 0;
  let map_x = 0;
  let map_y = 0;
  let station_x = 0;
  let station_y = 0;

  let points = {};
  let mapped = {};
  let queue = [];
  let grid = null;

  points[[curr_x, curr_y]] = '.';
  mapped[[curr_x, curr_y]] = 0;
  
  let min_x = Number.MAX_SAFE_INTEGER;
  let min_y = Number.MAX_SAFE_INTEGER;
  let max_x = Number.MIN_SAFE_INTEGER;
  let max_y = Number.MIN_SAFE_INTEGER;
  let ox = 0;
  let oy = 0;

  let mappingComplete = false;
  while (ic.status == IC.AWAITING_INPUT && !mappingComplete)
  {
    let next_x = curr_x + dirs[curr_d][0];
    let next_y = curr_y + dirs[curr_d][1];

    if (dirs == v_dirs) {
      if (curr_d == 0) { ic.input(1) } else ic.input(2);
    } else {
      if (curr_d == 0) { ic.input(3) } else ic.input(4);
    }
    min_x = Math.min(min_x, next_x);
    min_y = Math.min(min_y, next_y);
    max_x = Math.max(max_x, next_x);
    max_y = Math.max(max_y, next_y);
  
    switch (response) {
      case 0: // wall
        points[[next_x, next_y]] = '#';
        curr_d = (curr_d + 1) % dirs.length;
        break;
      case 1: // empty
      case 2: // station
        points[[next_x, next_y]] = '.';
        curr_x = next_x;
        curr_y = next_y;

        if (response == 2) {
          station_x = curr_x;
          station_y = curr_y;
        }

        if (mapped[[curr_x, curr_y]] === undefined) {
          mapped[[curr_x, curr_y]] = 0;
          queue.push([curr_x, curr_y]);
        }  
        break;
    }

    ox = Math.abs(min_x);
    oy = Math.abs(min_y);
    grid = [];
    for (let j = min_y; j <= max_y; j++) {
      grid[oy+j] = Array(max_x - min_x + 1);
      for (let i = min_x; i <= max_x; i++) {
        grid[oy+j][ox+i] = (i == curr_x && j == curr_y)
          ? '@' : (points[[i,j]] ?? ' ');
      }
    }

    
    if (curr_x == map_x && curr_y == map_y) {
      mapped[[map_x, map_y]]++;
      if (mapped[[map_x, map_y]] == 2) {
        if (dirs == v_dirs) {
          dirs = h_dirs;
          curr_d = 0;
        }
      } else if (mapped[[map_x, map_y]] == 4) {
        if (queue.length == 0) {
          grid[oy+curr_y][ox+curr_x] = '.';
          mappingComplete = true;
        } else {
          let to   = queue.shift();
          let path = find_path(grid,
            [ox+map_x, oy+map_y], [ox+to[0], oy+to[1]]
          );
          for (let i = 0; i < path.length -1; i++) {
            let dx = path[i+1][0] - path[i][0];
            let dy = path[i+1][1] - path[i][1];
            if (dx == 0) {
              ic.input(dy == -1 ? 1 : 2);
            } else {
              ic.input(dx == -1 ? 3 : 4);
            }
          }
          [curr_x, curr_y] = to;
          [map_x, map_y] =  to;
          dirs = v_dirs;
          curr_d = 0;
        }
      }
    }
    
    if (VISUALISE) {
      console.clear();
      console.log(grid.map(r => r.join("")).join("\n"));
    }
  }

  let path = find_path(grid, [ox, oy], [ox + station_x, oy + station_y]);
  queue = [ [ox + station_x, oy + station_y] ];

  let t = 0;
  for (; queue.length > 0; t++) {
    let next_queue = [];
    while (queue.length > 0) {
      let [x,y] = queue.pop();
      grid[y][x] = 'O';
      if (grid[y-1] && grid[y-1][x] == '.') {
        next_queue.push([x,y-1]);
      }
      if (grid[y+1] && grid[y+1][x] == '.') {
        next_queue.push([x,y+1]);
      }
      if (grid[y][x-1] == '.') {
        next_queue.push([x-1,y]);
      }
      if (grid[y][x+1] == '.') {
        next_queue.push([x+1,y]);
      }
    }
    queue = next_queue;

    if (VISUALISE) {
      console.clear();
      console.log(grid.map(r => r.join("")).join("\n"));
    }
  }

  console.log("Star 1:", path.length-1);
  console.log("Star 2:", t-1);

}

function find_path(grid, from, to)
{
  let queue = new Queue();
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      if (grid[j][i] == '.' || grid[j][i] == '@') {
        queue.push([i, j], Number.MAX_SAFE_INTEGER);
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

  let visited = {};
  let previous = {};  
  while (true) {
    let [pt, cost] = queue.pop();
    visited[pt] = true;
    if (cost == Number.MAX_SAFE_INTEGER) return null;
    if (pt[0] == to[0] && pt[1] == to[1]) {
      let path = [];
      while (pt) {
        path.push(pt);
        pt = previous[pt];
      }
      path.reverse();
      return path;
    }
    cost++;
    for (let nbr of neighbours(...pt)) {
      if (!visited[nbr] && cost < queue.weight(nbr)) {
        queue.change(nbr, cost);
        previous[nbr] = pt;
      }
    }
  }  
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
    let min_weight = Number.MAX_SAFE_INTEGER;
    let min_value  = null;
    for (let i = 0; i < this.queue.length; i++) {
      if (this.queue[i][0] < min_weight) {
        min_index  = i;
        min_weight = this.queue[i][0];
        min_value  = this.queue[i][1];
      }
    }
    if (min_index >= 0) {
      this.queue[min_index][0] = Number.MAX_SAFE_INTEGER;
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

