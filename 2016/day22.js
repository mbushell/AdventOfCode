const file = require("path").basename(__filename);

function solve(data)
{
  let xMax = -1;
  let yMax = -1;

  let disks = {};

  let disk_list = data.split("\n").slice(2).map(line => {
    let [x, y, size, used, avail, usep] = line.match(/(\d+)/g).map(Number);
    xMax = Math.max(x, xMax);
    yMax = Math.max(y, yMax);
    return disks[[x,y]] = {
      x: x,
      y: y, 
      size:  size,
      used:  used,
      avail: avail,
    };
  });

  console.log("Star 1:", count_viable_pairs(disk_list));

  const bounds = { w: xMax + 1, h: yMax + 1 };
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function * viable_neighbours(pt) {
    let a = disks[pt];
    for (let [dx, dy] of dirs) {
      let nx = a.x + dx;
      let ny = a.y + dy;
      if (nx >= 0 && ny >= 0 && nx < bounds.w && ny < bounds.h) {
        let b = disks[[nx, ny]];
        if (b.used <= a.size) {
          yield [b.x, b.y];
        }
      }
    }
  }

  function shortest_path(to, from) {
    let queue = new Queue();
    for (let j = 0; j <= yMax; j++) {
      for (let i = 0; i <= xMax; i++) {
        queue.push([i,j], Infinity);
      }
    }
    queue.change(from, 0);

    let previous = {};
    let visited  = {};
  
    while (true) {
      let [pt, cost] = queue.pop();
      if (cost == Infinity) return null;
      visited[pt] = true;
      if (pt[0] == to[0] && pt[1] == to[1]) {
        let path = [];
        while (pt) {
          path.push(pt);
          pt = previous[pt];
        }
        return path;
      }
      let ncost = cost + 1;
      for (let nbr of viable_neighbours(pt)) {
        if (!visited[nbr] && ncost < queue.weight(nbr)) {
          queue.change(nbr, ncost);
          previous[nbr] = pt;
        }
      }
    }
  }

  let freest = null;
  for (let disk of disk_list) {
    if (!freest || disk.avail > freest.avail) {
      freest = disk;
    }
  }
  
  let a = shortest_path([freest.x, freest.y], [xMax, 0]);
  let b = shortest_path(a[a.length-2], [0, 0]);

  /*
  It takes 5 swaps to move data:
  ####XO   ####X#   ####X#   ####X#   ###OX#   ###XO#
  ######   #####O   ####O#   ###O##   ######   ######
  */
  console.log("Star 2:", a.length-1 + 5*(b.length-1));
}

  
function count_viable_pairs(list) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    let a = list[i];
    for (let j = i + 1; j < list.length; j++) {
      let b = list[j];
      if (a.used > 0 && a.used <= b.avail) {
        count++;
      }
      if (b.used > 0 && b.used <= a.avail) {
        count++;
      }
    }
  }
  return count;
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