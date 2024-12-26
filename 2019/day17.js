const file = require("path").basename(__filename);

const IC = require("./intcode.js");

function solve(data)
{
  let ic = new IC();
  ic.load(data);
  ic.start();
  
  let photo = ic.outputs.map(c => String.fromCharCode(c)).join("");
  //console.log(photo);

  let grid = photo.trim().split("\n").map(r => r.split(""));
  
  let sx = 0, sy = 0;
  let interactions = [];
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      if (grid[j-1] && grid[j+1] && grid[j][i] == '#' &&
          grid[j-1][i] == '#' && grid[j+1][i] == '#' &&
          grid[j][i-1] == '#' && grid[j][i+1] == '#')
      {
        interactions.push([i, j]);
      }
      if (grid[j][i] == '^' || grid[j][i] == 'v' ||
          grid[j][i] == '<' || grid[j][i] == '>')
      {
        sx = i;
        sy = j;
      }
    }
  }

  function move(x, y, dx, dy, path, turns) {
    path.push([x,y]);    
    let nx = x + dx;
    let ny = y + dy;
    if (grid[ny] && grid[ny][nx] == '#') {
      move(nx, ny, dx, dy, path, turns);
    } else if (dx == 0) {
      if (grid[y][x-1] == '#') {
        turns.push([path.length, dy == -1 ? 'L' : 'R']);
        move(x-1, y, -1, 0, path, turns);
      } else if (grid[y][x+1] == '#') {
        turns.push([path.length, dy == -1 ? 'R' : 'L']);
        move(x+1, y, 1, 0, path, turns);
      }
    } else {
      if (grid[y-1] && grid[y-1][x] == '#') {
        turns.push([path.length, dx == 1 ? 'L' : 'R']);
        move(x, y-1, 0, -1, path, turns);
      } else if (grid[y+1] && grid[y+1][x] == '#') {
        turns.push([path.length, dx == 1 ? 'R' : 'L']);
        move(x, y+1, 0, 1, path, turns);
      }
    }
  }

  grid[sy][sx] = '#';

  let path = [];
  let turns = [[0, 'R']];
  move(sx, sy, 1, 0, path, turns);
  turns.push([path.length-1, 'X']);

  console.log(turns);

  const dist = (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

  let lengths = [];
  for (let i = 1; i < turns.length; i++) {
    lengths.push([dist(path[turns[i][0]], path[turns[i-1][0]]), turns[i-1][1]]);
  }
  lengths[0][0]--;
  lengths[lengths.length-1][0]++;

  ic.load(data);
  ic.pc = 0;
  ic.code[0] = 2;
  ic.start();

  function load_seq(seq) {
    let inputs = seq.split(",");
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < inputs[i].length; j++) {
        ic.input(inputs[i].charCodeAt(j));
      }
      if (i != inputs.length - 1) {
        ic.input(44);
      }
    }
    ic.input(10);
  }

  load_seq("A,B,B,A,C,A,C,A,C,B");
  load_seq("R,6,R,6,R,8,L,10,L,4");
  load_seq("R,6,L,10,R,8");
  load_seq("L,4,L,12,R,6,L,10");
  load_seq("n");

  console.log(ic.status);
  console.log(ic.outputs.slice(ic.outputs.length-4));

  //console.log(grid.map(r => r.join("")).join("\n"));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);
