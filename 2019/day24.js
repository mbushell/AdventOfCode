const file = require("path").basename(__filename);

class Grid {
  constructor() {
    this.grid = [
      [ ...".....".split("") ],
      [ ...".....".split("") ],
      [ ..."..?..".split("") ],
      [ ...".....".split("") ],
      [ ...".....".split("") ]
    ]
    this.last_update = -1;
    this._inner  = null;
    this._outer  = null;
  }

  update(update_id, depth) {
    if (depth < 0) return 0;
    if (this.last_update == update_id) return 0;

    let copy = structuredClone(this.grid);

    let total_bugs = 0;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (x == 2 && y == 2) continue;
        let adj_bugs = this.bug_count(x, y);
        if (this.bug_at(x, y)) {
          copy[y][x] = adj_bugs == 1 ? '#' : '.';
        } else {
          copy[y][x] = adj_bugs == 1 || adj_bugs == 2 ? '#' : '.';
        }
        if (copy[y][x] == '#') {
          total_bugs++;
        }
      }
    }

    this.last_update = update_id;
    if (this._inner) 
      total_bugs += this.inner.update(update_id, depth-1);
    if (this.outer)
      total_bugs += this.outer.update(update_id, depth-1);

    this.grid = copy;

    return total_bugs;
  }

  get inner() {
    if (this._inner == null) {
      this._inner = new Grid();
      this._inner._outer = this;
    }
    return this._inner;
  }
  get outer() {
    if (this._outer == null) {
      this._outer = new Grid();
      this._outer._inner = this;
    }
    return this._outer;
  }

  bug_at(x, y) {
    return this.grid[y][x] == '#' ? 1 : 0;
  }

  bug_count_u(x, y) {
    if (y == 0) {
      return this.outer.bug_at(2, 1);
    } else if (x == 2 && y == 3) {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += this.inner.bug_at(i, 4);
      }
      return total;
    } else {
      return this.bug_at(x, y-1);
    }
  }

  bug_count_d(x, y) {
    if (y == 4) {
      return this.outer.bug_at(2, 3);
    } else if (x == 2 && y == 1) {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += this.inner.bug_at(i, 0);
      }
      return total;
    } else {
      return this.bug_at(x, y+1);
    }
  }

  bug_count_l(x, y) {
    if (x == 0) {
      return this.outer.bug_at(1, 2);
    } else if (x == 3 && y == 2) {
      let total = 0;
      for (let j = 0; j < 5; j++) {
        total += this.inner.bug_at(4, j);
      }
      return total;
    } else {
      return this.bug_at(x-1, y);
    }
  }

  bug_count_r(x, y) {
    if (x == 4) {
      return this.outer.bug_at(3, 2);
    } else if (x == 1 && y == 2) {
      let total = 0;
      for (let j = 0; j < 5; j++) {
        total += this.inner.bug_at(0, j);
      }
      return total;
    } else {
      return this.bug_at(x+1, y);
    }
  }

  bug_count(x, y) {
    return this.bug_count_u(x,y) 
         + this.bug_count_d(x,y)
         + this.bug_count_l(x,y)
         + this.bug_count_r(x,y);
  }
  
  toString() {
    return this.grid.map(r => r.join("")).join("\n");
  }
}

function solve2(data)
{
  let grid = new Grid();
  data.split("\n").forEach((r, y) => {
    r.split("").forEach((c, x) => {
      if (!(y == 2 && x == 2)) {
        grid.grid[y][x] = c;
      }
    })
  });

  let total_bugs = 0;
  for (let i = 0; i < 200; i++) {
    total_bugs = grid.update(i, i+1);
  }

  console.log(total_bugs);
}


function solve1(data)
{
  function is_empty(grid, x, y) {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
      return true;
    }
    return grid[y][x] == '.';
  }
  
  let dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  function adjacent_bugs(grid, x, y) {
    let bugs = 0;
    for (let d of dirs) {
      if (!is_empty(grid, x+d[0], y+d[1])) bugs++;
    }
    return bugs;
  }

  function advance(grid) {
    let copy = structuredClone(grid);  
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        let adj_bugs = adjacent_bugs(grid, x, y);
        if (grid[y][x] == '#') {
          copy[y][x] = adj_bugs == 1 ? '#' : '.';
        } else {
          copy[y][x] = adj_bugs == 1 || adj_bugs == 2 ? '#' : '.';
        }
      }
    }
    return copy;
  }


  let grid = data.split("\n").map(r => r.split(""));
  let seen = {};
  for (let i = 0; true; i++) {
    if (seen[grid]) {
      console.log(`repeats after ${i+1} steps`)
      break;
    }
    seen[grid] = true;
    grid = advance(grid);
  }

  let score = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      if (grid[j][i] == '#') {
        score += 2**(j*grid.length + i);
      }
    }
  }
  console.log("Star 1", score);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve2(data.trim())
);