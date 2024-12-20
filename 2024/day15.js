const file = require("path").basename(__filename);

// Star 1: 1413675
// Star 2: 

/*
solve(`########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`);
*/

solve(`##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`);/**/


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);


function solve(data)
{
  let [map, ops] = data.trim().split("\n\n");
  map = map.split("\n").map(r => r.split(""));
  ops = ops.split("");

  let x, y;
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[j].length; i++) {
      if (map[j][i] == '@') { x = i; y = j; break; }
    }
  }

  /*
  ########
  #..O.O.#
  ##@.O..#
  #...O..#
  #.#.O..#
  #...O..#
  #......#
  ########

  <^^>>>vv<v>>v<<
  */
  function expand(grid)
  {
    let x = 0, y = 0, exp = [];
    for (let j = 0; j < grid.length; j++) {
      exp.push([]);
      for (let i = 0; i < grid[j].length; i++) {
        switch (grid[j][i]) {
          case '#':
          case '.':
            exp[j].push(grid[j][i], grid[j][i]);
            break;
          case 'O': exp[j].push('[', ']'); break;
          case '@':
            x = exp[j].length;
            y = j;
            exp[j].push('@', '.');
            break;
        }
      }
    }
    return [exp, x, y];
  }

  [map, x, y] = expand(map);


  function moveable(grid, x, y, dx, dy)
  {
    switch (grid[y][x]) {
      case '#': return false;
      case '.': return true;
      case '@': return moveable(grid, x+dx, y+dy, dx, dy);
      case '[':
        if (dx > 0) {
          return moveable(grid, x+2, y, dx, dy);
        } else if (dx < 0) {
          return moveable(grid, x-1, y, dx, dy);
        } else {
          return moveable(grid, x+0, y+dy, dx, dy) &&
                 moveable(grid, x+1, y+dy, dx, dy);
        }
      case ']':
        if (dx < 0) {
          return moveable(grid, x-2, y, dx, dy);
        } else if (dx > 0) {
          return moveable(grid, x+1, y, dx, dy);
        } else {
          return moveable(grid, x-0, y+dy, dx, dy) &&
                 moveable(grid, x-1, y+dy, dx, dy);
        }
    }
  }

  function push(grid, x, y, dx, dy) {
    switch (grid[y][x]) {
      case '[':
        if (dx != 0) {
          push(grid, x+2, y, dx, dy);
          grid[y][x+0] = '.';
          grid[y][x+1] = '[';
          grid[y][x+2] = ']';
        } else {
          push(grid, x+0, y+dy, dx, dy);
          push(grid, x+1, y+dy, dx, dy);
          grid[y][x+0]    = '.';
          grid[y][x+1]    = '.';
          grid[y+dy][x+0] = '[';
          grid[y+dy][x+1] = ']';
        }
        break;
      case ']':
        if (dx != 0) {
          push(grid, x-2, y, dx, dy);
          grid[y][x-2] = '[';
          grid[y][x-1] = ']';
          grid[y][x-0] = '.';
        } else {
          push(grid, x-0, y+dy, dx, dy);
          push(grid, x-1, y+dy, dx, dy);
          grid[y][x+0]    = '.';
          grid[y][x-1]    = '.';
          grid[y+dy][x-1] = '[';
          grid[y+dy][x+0] = ']';
        }
        break;
      case '@':
        push(grid, x+dx, y+dy, dx, dy);
        grid[y+dy][x+dx] = '@';
        grid[y][x]       = '.';
        break;
    }
  }
 
  function move(grid, x, y, dx, dy)
  {
    if (moveable(grid, x, y, dx, dy)) {
      push(grid, x, y, dx, dy);
      return [x + dx, y + dy];
    }
    return [x, y];
  }
  
  //console.log(map.map(r => r.join("")).join("\n"), "\n");

  ops.forEach(op => {
    //console.log(x, y, op);
    switch (op) {
      case "^": [x, y] = move(map, x, y, 0, -1); break;
      case "v": [x, y] = move(map, x, y, 0,  1); break;
      case "<": [x, y] = move(map, x, y, -1, 0); break;
      case ">": [x, y] = move(map, x, y,  1, 0); break;
    }
    //console.log(map.map(r => r.join("")).join("\n"), "\n");
  });
  

  let total = 0;
  for (let j = 0; j < map.length; j++) {
    for (let i = 0; i < map[j].length; i++) {
      if (map[j][i] == '[') {
        total += j*100 + i;
      }
    }
  }
  console.log(total);
}

// Part 1
/*
function move(grid, x, y, dx, dy)
{
  let nx = x + dx;
  let ny = y + dy;
  while (grid[ny][nx] == 'O') {
    nx += dx;
    ny += dy;
  }
  if (grid[ny][nx] == '#') {
    return [x, y];
  }
  while (nx != x || ny != y) {
    grid[ny][nx] = grid[ny - dy][nx - dx];
    nx -= dx;
    ny -= dy;
  }
  grid[ny][nx] = '.';
  return [nx + dx, ny + dy];
}
*/