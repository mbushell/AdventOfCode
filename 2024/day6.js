const inputFilePath = "day6.txt";

// Solutions
// Part 1: 5409
// Part 2: 2022

solve(`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`);

/*
Cycles:
3 6
6 7
3 8
1 8
7 7
7 9
*/

const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  solve(data);
});

function solve(data)
{
  let maze = data.split("\n").map(r => r.split(""));
  let size = maze.length;

  let x = 0, y = 0;
  for (let j = 0; j < maze.length; j++) {
    let i = maze[j].indexOf("^");
    if (i >= 0) { x = i; y = j; break; };
  }

  let path = walk(maze, x, y);

  let cycles = {};
  for (let k = 0; k < path.length; k++) {
    let [i,j] = path[k];
    
    if (maze[j][i] == '^' || maze[j][i] == '#') continue;

    maze[j][i] = '#';
    if (!walk(maze, x, y)) {
      cycles[[i,j]] = true;
    }
    maze[j][i] = '.';
  }

  console.log(Object.keys(cycles).length);

  //console.log(maze.map(r => r.join("")).join("\n"));
}

  
function walk(maze, x, y)
{
  const rows = maze.length;
  const cols = maze[0].length;
  const seen = {}, path = [];
  let dx = 0, dy = 1;
  while (true)
  {
    if (seen[[x,y,dx,dy]]) return null;
    seen[[x,y,dx,dy]] = true;  
    while (true) {
      let nx = x + dx, ny = y - dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return path;
      else if (maze[ny][nx] == '#') {
        let t = dx; dx = dy; dy = -t;
      } else break;
    }
    path.push([x += dx, y -= dy]);
  }
}

/*

function solve(data)
{
  const maze = data.split("\n").map(r => r.split(""))
  const rows = maze.length;
  const cols = maze[0].length;

  let [sx, sy] = (() => {
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++)
      if (maze[y][x] == "^") return [x, y];
  })();

  let px = sx;
  let py = sy;
  let qx = 0;
  let qy = 0;
  let dx = 0;
  let dy = 1;

  const path = [];

  while (px >= 0 && px < cols && py >= 0 && py < rows)
  {
    if (maze[py][px] != "X") {
      path.push([px, py]);
      maze[py][px] = "X";
    }
    
    qx = px + dx;
    qy = py - dy;
    if (qx >= 0 && qx < cols && qy >= 0 && qy < rows &&
        maze[qy][qx] == "#")
    {
      let t = dx; dx = dy; dy = -t; // turn clockwise 90 degrees
    }
    
    px += dx; py -= dy; // move guard
  }

  console.log(`path length: ${path.length}`);

  let cycles = 0;
  let cyclePts = {};
  for (let k = 1; k < path.length; k++) {
    let [qx, qy] = path[k];
    
    let key = `C(${qx},${qy})`;
    if ((qx == sx && qy == sy) || cyclePts[key]) {
      continue;
    }

    maze[qy][qx] = "#";
    if (isCyclic(maze, sx, sy, 0, 1)) {
      cyclePts[key] = true;
      cycles++;
    }
    maze[qy][qx] = ".";
  };

  console.log(`cycles: ${cycles}`);
}

function isCyclic(maze, px, py, dx, dy)
{
  let qx = 0;
  let qy = 0;
  const visited = {};
  while (maze[py] && maze[py][px])
  {
    let key = `${px}-${py}-${dx}-${dy}`;
    if (visited[key]) {
      return true;
    } else {
      visited[key] = true;
    }
    
    qx = px + dx;
    qy = py - dy;
    if (maze[qy] && maze[qy][qx] == "#") {
      let t = dx; dx = dy; dy = -t; // turn clockwise 90 degrees
    }

    px += dx; py -= dy; // move guard
  }
  return false;
}
*/