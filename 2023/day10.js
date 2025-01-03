const fs = require('node:fs');

function solve(data)
{
  let sx, sy;
  let grid = data.split("\n").map((r, j) => r.split("").map((c, i) => {
    if (c == 'S') { sx = i; sy = j; }; return c;
  }));
  
  function mark(x, y, v) {
    if (grid[y] && grid[y][x] == '.') {
      grid[y][x] = v;
    }
  }

  function trace_path(x, y, dx, dy, path) {
    while (true)
    {
      x += dx;
      y += dy;

      if (x == sx && y == sy) return path;
  
      path.push([x, y, dx, dy]);

      switch (grid[y][x]) {
        case '|': break;
        case '-': break;
        case 'L':
          if (dy == 0) {
            dx = 0; dy = -1;
          } else {
            dx = 1; dy = 0;
          }
          break;
        case 'J': 
          if (dy == 0) {
            dx = 0; dy = -1;
          } else {
            dx = -1; dy = 0;
          }
          break;
        case 'F': 
          if (dy == 0) {
            dx = 0; dy = 1;
          } else {
            dx = 1; dy = 0;
          }
          break;
        case '7': 
          if (dy == 0) {
            dx = 0; dy = 1;
          } else {
            dx = -1; dy = 0;
          }
          break;
      }
    }
  }

  let dx, dy;
  if (grid[sy+1][sx] != '.')      { dx = 0;  dy = 1;  }
  else if (grid[sy][sx-1] != '.') { dx = -1; dy = 0;  }
  else if (grid[sy-1][sx] != '.') { dx = 0;  dy = -1; }
  else if (grid[sy][sx+1] != '.') { dx = 1;  dy = 0;  }


  let path = trace_path(sx, sy, dx, dy, [[sx, sy]]);

  console.log("Star 1:", path.length/2);


  function mark_path(path) {
    for (let [x, y, dx, dy] of path) {
      switch (grid[y][x]) {
        case '|':
          if (dy < 0) {
            mark(x-1,y, 'I');
            mark(x+1,y, 'O');
          } else {
            mark(x-1,y, 'O');
            mark(x+1,y, 'I');
          }
          break;
        case '-':
          if (dx > 0) {
            mark(x,y-1, 'I');
            mark(x,y+1, 'O');
          } else {
            mark(x,y-1, 'O');
            mark(x,y+1, 'I');
          }
          break;
        case 'L':
          if (dy == 0) {
            mark(x+1, y-1, 'I');
            mark(x-1, y,   'I');
            mark(x-1, y+1, 'I');
            mark(x,   y+1, 'I');
          } else {
            mark(x+1, y-1, 'I');
            mark(x-1, y,   'O');
            mark(x-1, y+1, 'O');
            mark(x,   y+1, 'O');
          }
          break;
        case 'J': 
          if (dy == 0) {
            mark(x-1, y-1, 'I');
            mark(x,   y+1, 'O');
            mark(x+1, y+1, 'O');
            mark(x+1, y,   'O');
          } else {
            mark(x-1, y-1, 'O');
            mark(x,   y+1, 'I');
            mark(x+1, y,   'I');
            mark(x+1, y+1, 'I');
          }
          break;
        case 'F': 
          if (dy == 0) {
            mark(x+1, y+1, 'I');
            mark(x-1, y,   'O');
            mark(x-1, y-1, 'O');
            mark(x,   y-1, 'O');
          } else {
            mark(x+1, y+1, 'O');
            mark(x-1, y-1, 'I');
            mark(x, y-1,   'I');
            mark(x-1, y,   'I');
          }
          break;
        case '7': 
          if (dy == 0) {       
            mark(x,   y-1,  'I');
            mark(x+1, y-1,  'I');
            mark(x+1, y,    'I');
            mark(x-1, y+1,  'O');
          } else {
            mark(x-1, y+1,  'I');
            mark(x+1, y,    'O');
            mark(x+1, y-1,  'O');
            mark(x, y-1,    'O');
          }
          break;
      }
    }
  }

  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      if (path.findIndex(p => p[0] == i && p[1] == j) == -1) {
        grid[j][i] = '.';
      }
    }
  }

  mark_path(path);

  function flood_fill(x, y, t) {
    grid[y][x] = t;
    if (grid[y-1] && grid[y-1][x] == '.') flood_fill(x, y-1, t);
    if (grid[y+1] && grid[y+1][x] == '.') flood_fill(x, y+1, t);
    if (grid[y][x-1] == '.') flood_fill(x-1, y, t);
    if (grid[y][x+1] == '.') flood_fill(x+1, y, t);
  }

  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      if (grid[j][i] == 'I' || grid[j][i] == 'O') {
        flood_fill(i, j, grid[j][i]);
      }
    }
  }

  let I = 0;
  let O = 0;
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      if (grid[j][i] == 'I') I++;
      if (grid[j][i] == 'O') O++;
    }
  }

  console.log("Star 2:", Math.min(I, O));
}

/*
solve(`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`);


solve(`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`);


solve(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`);

return;
*/

fs.readFile('./day10-input.txt', 'utf8',
  (err, data) => solve(data.trim())
);
