const fs = require('node:fs');

// Day 1: 6907
/*
parseData(`.....
.S-7.
.|.|.
.L-J.
.....`);

parseData(`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`);
*/

// Day 2

/*
parseData(`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`);

parseData(`..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`);

*/

parseData(`.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`);

return;


parseData(`FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`)
return


fs.readFile('./day10-input.txt', 'utf8',
  (err, data) => parseData(data)
);

function parseData(data)
{
  let start = undefined;

  const map = data.split("\n").map(
    (line, y) => {
      let cells = line.split("");
      cells.forEach((cell, x) => {
        if (cell == "S") {
          start = [x, y];
        }
      });
      return cells;
    }
  );

  function lookup(map, coords) {
    if (coords[1] < 0 || coords[1] >= map.length) {
      return null;
    }
    const row = map[coords[1]];
    if (coords[0] < 0 || coords[0] >= row.length) {
      return null;
    }
    return row[coords[0]];
  }

  function isEqual(a, b) {
    if (a == null || b == null) {
      return false;
    }
    return a[0] == b[0] && a[1] == b[1];
  }

  function allNeighbours(map, coords) {
    let nbrs = [];
    for (let y = 1; y >= -1; y--) {
      for (let x = -1; x <= 1; x++) {
        let nbr = [coords[0] + x, coords[1] + y];
        if (!isEqual(coords, nbr) && lookup(map, nbr)) {
          nbrs.push(nbr);
        }
      }
    }
    return nbrs;
  }
  
  function pipeNeighbours(map, coords) {
    switch (lookup(map, coords))
    {
      case "|": return [
        [coords[0] + 0, coords[1] - 1],
        [coords[0] + 0, coords[1] + 1]
      ];
      case "-": return [
        [coords[0] - 1, coords[1] + 0],
        [coords[0] + 1, coords[1] + 0]
      ];
      case "L": return [
        [coords[0] + 0, coords[1] - 1],
        [coords[0] + 1, coords[1] + 0]
      ];
      case "J": return [
        [coords[0] + 0, coords[1] - 1],
        [coords[0] - 1, coords[1] + 0]
      ];
      case "7": return [
        [coords[0] - 1, coords[1] + 0],
        [coords[0] + 0, coords[1] + 1]
      ];
      case "F": return [
        [coords[0] + 1, coords[1] + 0],
        [coords[0] + 0, coords[1] + 1]
      ];
      default: return [];
    }
  }

  function next(map, prev, curr)
  {
    return lookup(map, curr) != "S"
      ? pipeNeighbours(map, curr).find(a => !isEqual(a, prev))
      : allNeighbours(map, curr).find(nxt =>
          pipeNeighbours(map, nxt).findIndex(a => isEqual(a, curr)) != -1)
      ;
  }

  let prv = null;
  let cur = start;
  
  let loop = [];

  while (!prv || lookup(map, cur) != "S") {
    loop.push(cur);
    let nxt = next(map, prv, cur);
    prv = cur;
    cur = nxt;
  }
  
  // Day 1
  /*
  console.log(loop.length / 2);
  return;
  */

  // Day 2
  
  function mapToString(map) {
    return map.map(row => row.join("")).join("\n");
  }

  function printMap(map) {
    console.log(mapToString(map));
  }
  
  const colouring = JSON.parse(JSON.stringify(map));
  
  map.forEach((row, y) => row.forEach(
    (cell, x) => {
      if (!loop.find(a => isEqual(a, [x, y]))) {
        colouring[y][x] = "?";
      }
    }
  ));
  const fill = JSON.parse(JSON.stringify(colouring));
  const fill2 = JSON.parse(JSON.stringify(colouring));


  function floodFill(map, coords, colour)
  {
    map[coords[1]][coords[0]] = colour;

    let nbrs = allNeighbours(map, coords);

    for (let i = 0; i < nbrs.length; i++) {
      let nbr = nbrs[i];      
      if (map[nbr[1]][nbr[0]] == "?") {
        floodFill(map, nbr, colour);
      }      
    }
    
  }

  let colour = 1;
  let complete = false;
  while (!complete)
  {
    complete = true;

    colouring.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell == "?") {
          floodFill(colouring, [x, y], colour);
          colour++;
          if (colour == 7) colour++;
        }
      });
    });
  }

  let winding = 0;

  function diff(a, b) {
    return `${(b[0] - a[0])},${(b[1] - a[1])}`;
  }


  const directions = [];

  for (let i = 0; i < loop.length; i++) {
    let cur = loop[i];
    let prv = loop[(i + loop.length - 1) % loop.length];
    let nxt = loop[(i + 1) % loop.length];
    let nbr = null;

    switch (map[cur[1]][cur[0]]) {
      case "|":
        switch ((winding+64)%4) {
          case 0: // down
            nbr = lookup(fill, [cur[0]-1, cur[1]]);
            if (nbr == "?") {
              floodFill(fill, [cur[0]-1, cur[1]], ">");
            }
            nbr = lookup(fill, [cur[0]+1, cur[1]]);
            if (nbr == "?") {
              floodFill(fill, [cur[0]+1, cur[1]], "<");
            }
            break;
          case 2: // up
            nbr = lookup(fill, [cur[0]-1, cur[1]]);
            if (nbr == "?") {
              floodFill(fill, [cur[0]-1, cur[1]], "<");
            }
            nbr = lookup(fill, [cur[0]+1, cur[1]]);
            if (nbr == "?") {
              floodFill(fill, [cur[0]+1, cur[1]], ">");
            }
            break;
        }
        break;
      case "-":
        switch ((winding+64)%4) {
          case 1: // right
            nbr = lookup(fill, [cur[0], cur[1]-1]);
            if (nbr == "?") {
              floodFill(fill, [cur[0], cur[1]-1], "<");
            }
            nbr = lookup(fill, [cur[0], cur[1]+1]);
            if (nbr == "?") {
              floodFill(fill, [cur[0], cur[1]+1], ">");
            }
            break;
          case 3: // left
            nbr = lookup(fill, [cur[0], cur[1]-1]);
            if (nbr == "?") {
              floodFill(fill, [cur[0], cur[1]-1], ">");
            }
            nbr = lookup(fill, [cur[0], cur[1]+1]);
            if (nbr == "?") {
              floodFill(fill, [cur[0], cur[1]+1], "<");
            }
            break;
        }
        break;
      case "F":
        switch (diff(prv, nxt)) {
          case "1,-1":  winding += -1; break;
          case "-1,1":  winding += 1;  break;
        }

        switch ((winding+64)%4) {
          case 0: // down
            nbr = [cur[0] - 1, cur[1]];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, ">");
            }
            nbr = [cur[0] + 1, cur[1]];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, "<");
            }
            break;
          case 1: // right
            nbr = [cur[0], cur[1] - 1];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, "<");
            }
            nbr = [cur[0], cur[1] + 1];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, ">");
            }
            break;
        }
        break;
      case "L":
        switch (diff(prv, nxt)) {
          case "1,1":   winding += 1;  break;
          case "-1,-1": winding += -1; break;
        }
        switch ((winding+64)%4) {
          case 1: // up
            nbr = [cur[0] - 1, cur[1]];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, "<");
            }
            nbr = [cur[0] + 1, cur[1]];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, ">");
            }
            break;
          case 2: // right
            nbr = [cur[0], cur[1] - 1];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, "<");
            }
            nbr = [cur[0], cur[1] + 1];
            if (lookup(fill, nbr) == "?") {
              floodFill(fill, nbr, ">");
            }
            break;
        }
        break;
      case "7":
        switch (diff(prv, nxt)) {
          case "1,1":   winding += -1; break;
          case "-1,-1": winding += 1 ; break;
        }
        switch ((winding+64)%4) {
          case 0: // down
            break;
          case 3: // left
            break;
        }
        break;
      case "J":
        switch (diff(prv, nxt)) {
          case "1,-1":  winding += 1;  break;
          case "-1,1":  winding += -1; break;
        }
        break;
    }

    /*
    switch ((winding+64)%4) {
      case 0: directions.push("D"); break;
      case 1: directions.push("R"); break;
      case 2: directions.push("U"); break;
      case 3: directions.push("L"); break;
    }*/
  }
  
  printMap(fill2);
  console.log("");
  printMap(fill);

  mapStr = mapToString(fill);
  let countQM = mapStr.split("?").length-1;
  let countGT = mapStr.split(">").length-1;
  let countLT = mapStr.split("<").length-1;
  console.log(countQM);
  console.log(countGT);
  console.log(countLT);
}
