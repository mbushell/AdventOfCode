const file = require("path").basename(__filename);

// Star 1: 2130
// Star 2: 

parseData(`#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  const grid = data.split("\n").map(r => r.split(""));


  let active = [ { prev: [0, 1], length: 1, dict: { "0,1": true } } ];
  
  let max = 0;
  while (active.length > 0)
  {
    console.log(active.length);

    let path = active.shift();
    let prev = path.prev;

    /*
    if (prev[0] == grid.length-2 && prev[1] == grid.length-1) {
      max = Math.max(max, path.length);
    }*/

    let nbrs = get_nbrs(grid, prev);

    if (nbrs.length == 0) {
      continue;
    }

    nbrs.forEach(nbr => {
      if (nbr[0] == grid.length-2 && nbr[1] == grid.length-1) {
        max = Math.max(max, path.length);
        return;
      } 
      else if (path.dict[nbr]) return;
      /*const terrain = grid[nbr[1]][nbr[0]];
      if (terrain != '.') { // Part 1
        let diff = [nbr[0] - prev[0], nbr[1] - prev[1]];
        if (terrain == "v" && diff[0] == 0  && diff[1] == -1) return;
        if (terrain == ">" && diff[0] == -1 && diff[1] == 0)  return;
      }*/
      let dict = JSON.parse(JSON.stringify(path.dict));
      dict[nbr] =  true;
      active.push({ prev: nbr, length: path.length+1, dict: dict });
    });
  }

  console.log(max);
}

function get_nbrs(grid, pt)
{
  let [x, y] = pt;
  let nbrs = [];
  if (grid[y+1] && grid[y+1][x] && grid[y+1][x] != '#') nbrs.push([x, y+1]);
  if (grid[y-1] && grid[y-1][x] && grid[y-1][x] != '#') nbrs.push([x, y-1]);
  if (grid[y][x+1] && grid[y][x+1] != '#') nbrs.push([x+1, y]);
  if (grid[y][x-1] && grid[y][x-1] != '#') nbrs.push([x-1, y]);
  return nbrs;
}