const file = require("path").basename(__filename);

class Queue {
  constructor() {
    this.queue  = [];
    this.index  = {};
    this._length = 0;
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

function solve(data)
{
  let maze = data.split("\n").map(r => r.split(""));

  let portals = {};
  let inner_portals = {};
  let outer_portals = {};

  const ASCII_A = 65;
  const ASCII_Z = 90;
  const ASCII_SPACE = 32;
  const ASCII_HASH  = 35;
  const ASCII_DOT   = 46;
  
  function * neighbours(x, y, allow) {
    for (let [dx,dy] of [[1,0],[0,-1],[-1,0],[0,1]]) {
      let nx = x + dx;
      let ny = y + dy;
      if (maze[ny] && maze[ny][nx] && (!allow || maze[ny][nx] == allow)) {
        yield [nx, ny];
      }
    }
  }

  //let base_queue = [];
  let all_points = [];
  let maze_tx = Number.MAX_SAFE_INTEGER;
  let maze_bx = Number.MIN_SAFE_INTEGER;
  let maze_lx = Number.MAX_SAFE_INTEGER;
  let maze_rx = Number.MIN_SAFE_INTEGER;

  for (let j = 0; j < maze.length; j++) {
    for (let i = 0; i < maze[j].length; i++) {
      let c = maze[j][i].charCodeAt(0);
      if(c == ASCII_HASH) {        
        maze_tx = Math.min(j, maze_tx);
        maze_bx = Math.max(j, maze_bx);
        maze_lx = Math.min(i, maze_lx);
        maze_rx = Math.max(i, maze_rx);
      } else if (c == ASCII_DOT) {
        all_points.push([i,j]);
      } else if (c >= ASCII_A && c <= ASCII_Z) {
        let name, entrance;
        for (let [x, y] of neighbours(i, j)) {
          let d = maze[y][x].charCodeAt(0);
          if (d == ASCII_DOT) {
            entrance = [x,y];
          } else if (d >= ASCII_A && d <= ASCII_Z) {
            if (x == i) {
              name = j < y ? [c, d] : [d, c];
            } else {
              name = i < x ? [c, d] : [d, c];
            }
            name = name.map(c => String.fromCharCode(c)).join("");
          }
        }
        if (entrance) {
          portals[name] ??= [];
          portals[name].push(entrance);
        }
      }
    }
  }

  for (let p of Object.values(portals)) {
    if (p[0] && p[1]) {
      portals[p[0]] = p[1];
      portals[p[1]] = p[0];
      if ((p[0][1] > maze_tx && p[0][1] < maze_bx) &&
          (p[0][0] > maze_lx && p[0][0] < maze_rx))
      {
        inner_portals[p[0]] = p[1];
        outer_portals[p[1]] = p[0];
      } else {
        outer_portals[p[0]] = p[1];
        inner_portals[p[1]] = p[0];
      }
    }
  }

  const MAX_DEPTH = 25;

  function find_path(start_pt, end_pt, is_recursive) 
  {
    let highest_level = 0;

    let queue = new Queue();
    for (let pt of all_points) {
      queue.push([pt, 0], Number.MAX_SAFE_INTEGER);
    }
    queue.change([start_pt, 0], 0);

    let previous = {};
    let visited = {};
    
    while (true)
    {
      let [item, cost] = queue.pop();

      if (!item) return Number.MAX_SAFE_INTEGER;
  
      let [pt, level] = item;
      visited[item] = true;
  
      if (level == 0 && pt[0] == end_pt[0] && pt[1] == end_pt[1]) {
        return cost;
      }
      
      if (cost == Number.MAX_SAFE_INTEGER) {
        return cost;
      }
  
      cost++;

      let nbr;
      for (nbr of neighbours(...pt, ".")) {
        if (!visited[[nbr,level]] && cost < queue.weight([nbr,level])) {
          queue.change([nbr,level], cost);
          previous[[nbr, level]] = item;
        }
      }
      
      if (nbr = portals[pt]) {
        if (is_recursive) {
          if (inner_portals[pt]) {
            if (level == MAX_DEPTH) continue;
            if (level == highest_level) {
              highest_level++;
              for (let pt2 of all_points) {
                let q = [pt2, highest_level];
                queue.push(q, Number.MAX_SAFE_INTEGER);
              }
            }
            if (!visited[[nbr,level+1]] && cost < queue.weight([nbr,level+1])) {
              queue.change([nbr, level+1], cost);
              previous[[nbr, level+1]] = item;
            }
          } else if (level > 0) {
            if (!visited[[nbr,level-1]] && cost < queue.weight([nbr,level-1])) {
              queue.change([nbr, level-1], cost);
              previous[[nbr, level-1]] = item;
            }
          }
        } else {
          if (!visited[[nbr,level]] && cost < queue.weight([nbr,level])) {
            queue.change([nbr, level], cost);
            previous[[nbr, level]] = item;
          }
        }
      }
    }
  
  }

  console.log("Star 1:",
    find_path(portals["AA"][0], portals["ZZ"][0], false));

  console.log("Star 2:",
    find_path(portals["AA"][0], portals["ZZ"][0], true));
}

solve(`         A           
         A           
  #######.#########  
  #######.........#  
  #######.#######.#  
  #######.#######.#  
  #######.#######.#  
  #####  B    ###.#  
BC...##  C    ###.#  
  ##.##       ###.#  
  ##...DE  F  ###.#  
  #####    G  ###.#  
  #########.#####.#  
DE..#######...###.#  
  #.#########.###.#  
FG..#########.....#  
  ###########.#####  
             Z       
             Z       `);

solve(`                   A               
                   A               
  #################.#############  
  #.#...#...................#.#.#  
  #.#.#.###.###.###.#########.#.#  
  #.#.#.......#...#.....#.#.#...#  
  #.#########.###.#####.#.#.###.#  
  #.............#.#.....#.......#  
  ###.###########.###.#####.#.#.#  
  #.....#        A   C    #.#.#.#  
  #######        S   P    #####.#  
  #.#...#                 #......VT
  #.#.#.#                 #.#####  
  #...#.#               YN....#.#  
  #.###.#                 #####.#  
DI....#.#                 #.....#  
  #####.#                 #.###.#  
ZZ......#               QG....#..AS
  ###.###                 #######  
JO..#.#.#                 #.....#  
  #.#.#.#                 ###.#.#  
  #...#..DI             BU....#..LF
  #####.#                 #.#####  
YN......#               VT..#....QG
  #.###.#                 #.###.#  
  #.#...#                 #.....#  
  ###.###    J L     J    #.#.###  
  #.....#    O F     P    #.#...#  
  #.###.#####.#.#####.#####.###.#  
  #...#.#.#...#.....#.....#.#...#  
  #.#####.###.###.#.#.#########.#  
  #...#.#.....#...#.#.#.#.....#.#  
  #.###.#####.###.###.#.#.#######  
  #.#.........#...#.............#  
  #########.###.###.#############  
           B   J   C               
           U   P   P               `);


solve(`             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     `);


require("node:fs").readFile(file.replace(".js", ".txt"),
"utf8", (err, data) => solve(data)
);
