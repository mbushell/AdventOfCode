const file = require("path").basename(__filename);

let input = require("readline-sync").question;

function solve(data)
{
  let grid = data.split("\n").map(r => r.split(""));
  
  const ASCII_HASH = 35;
  const ASCII_AT = 64;
  const ASCII_A = 65;
  const ASCII_Z = 90;
  const ASCII_a = 97;
  const ASCII_z = 122; 

  let all_keys  = {};
  let all_key_coords = [];
  let all_doors = {};
  let all_items = {};
  let full_queue = new Queue(); 

  let sx = 0, sy = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      let n = grid[j][i].codePointAt(0);
      if (n == ASCII_AT) {
        sx = i; sy = j;
      } else if (n >= ASCII_A && n <= ASCII_Z) {
        all_items[[i,j]] = grid[j][i];
        all_doors[[i,j]] = grid[j][i];
        all_doors[[grid[j][i]]] = [i,j];
      } else if (n >= ASCII_a && n <= ASCII_z) {
        all_items[[i,j]] = grid[j][i];
        all_keys[[i,j]]  = grid[j][i];
        all_key_coords[grid[j][i]] = [i,j];
      }
      if (n != ASCII_HASH) {
        full_queue.push([i,j], Infinity);
      }
    }
  }

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  function * neighbours(pt) {
    let [x,y] = pt;
    for (let [dx,dy] of dirs) {
      if (grid[y+dy][x+dx] != '#') yield [x+dx, y+dy];
    }
  }

  function get_path(pt, previous) {
    let path = [];
    for (; pt !== undefined; pt = previous[pt]) {
      path.push(pt);
    }
    return path;
  }

  function find_items(sx, sy, keys, doors) {
    let queue = full_queue.clone();
    queue.change([sx,sy], 0);
    let visited = {};
    let previous = {};
    while (true) {
      let [pt, cost] = queue.pop();
      if (cost == Infinity) break;
      visited[pt] = true;
      if (keys && all_keys[pt]) {
        keys.push(get_path(pt, previous));
      } else if (doors && all_doors[pt]) {
        doors.push(get_path(pt, previous));
      }
      cost += 1;
      for (let nbr of neighbours(pt)) {
        if (!visited[nbr] && cost < queue.weight(nbr)) {
          queue.change(nbr, cost);
          previous[nbr] = pt;
        }
      }
    }
  }


  let key_distances = { '@': {} };

  // find all keys from player
  let keys = [];
  let doors = [];
  find_items(sx, sy, keys, doors);
  keys.forEach(path => {
    key_distances['@'][all_keys[path[0]]] = path.length - 1;
  })

  // all distances between keys
  let g2 = structuredClone(grid);
  for (let j = 0; j < g2.length; j++) {
    for (let i = 0; i < g2[j].length; i++) {
      if (g2[j][i] == '#' || g2[j][i] == '.') {
        g2[j][i] = ' ';
      }
    }
  }

  for (let key_name of Object.values(all_keys)) {
    key_distances[key_name] = {};
    let [sx, sy] = all_key_coords[key_name];
    let keys = [];
    find_items(sx, sy, keys, null);
    keys.forEach(path => {
      path.forEach(p => {
        if (g2[p[1]][p[0]] == ' ') g2[p[1]][p[0]] = '.';
      })
      key_distances[key_name][[all_keys[path[0]]]] = path.length - 1
    });
  }

  keys.sort((a, b) => b.length - a.length);
    
  let key_dependencies = {};
  
  for (let key_path of keys) {
    let key_name = all_keys[key_path[0]];
    key_dependencies[key_name] = {};
    for (let pt of key_path)  {
      if (all_doors[pt]) {
        let door_name = all_doors[pt];
        key_dependencies[key_name][door_name.toLowerCase()] = 0;
      }
    }
  }
  
  function compare_items(a, b) {
    if (b[1][a[0]] == 0) return -1;
    if (a[1][b[0]] == 0) return 1;
    return Object.keys(a[1]).length - Object.keys(b[1]).length;
  }

  let key_order = Object.entries(key_dependencies);
  key_order.sort(compare_items);

  g2[sy][sx] = '@';
  console.log(g2.map(r => r.join("")).join("\n"));
  console.log("Key dependencies:");
  for (let [key, requires] of key_order) {
      if (Object.keys(requires).length == 0) {
        console.log(key, `is open (${key_distances['@'][key]} steps)`)
      } else {
        console.log(key, "requires", Object.keys(requires).map(
          other => `${other} (${key_distances[key][other]})`
        ).join(","))
      }
  }
  console.log();


  function cost_of_path(str) {
    let path = str.split("");
    let cost = 0;
    for (let i = 0; i < path.length-1;i++) {
      cost += key_distances[path[i]][path[i+1]];
    }
    return cost;
  }
  
  // Part 1: 2684
  // @vzcnahtrelgsdqbuwpkjfmyxoi

  console.log("Star 1:");
  let path_str = input("Enter key sequence: @");
  console.log(cost_of_path("@"+path_str));
  console.log();

  // Part 2: 1886
  //@le
  //@vzbuwpkjfmyxoi 
  //@gsdq
  //@cnahtrgit

  console.log("Star 2:");
  let cost = 0;
  for (let i = 1; i <= 4; i++) {
    let path_str = input(`[Robot ${i}] Enter key sequence: @`);
    cost += cost_of_path("@"+path_str) - 2;
  }
  console.log(cost);
  console.log();
}


class Queue {
  constructor() {
    this.queue  = [];
    this.index  = {};
  }
  clone() {
    let copy = new Queue();
    copy.queue = structuredClone(this.queue);
    copy.index = structuredClone(this.index);
    return copy;
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
