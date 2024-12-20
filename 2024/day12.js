const file = require("path").basename(__filename);

// Star 1: 1344578
// Star 2: 814302
solve(`AAAA
BBCD
BBCC
EEEC`);

solve(`EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`);


solve(`RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE)`);

solve(`AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);

function solve(data)
{
  const garden = data.split("\n").map(r => r.split(""));
  const size = garden.length;

  function findRegion(letter, i, j, region)
  {
    if (!seen[[i,j]] && garden[j] && garden[j][i] == letter) {
      seen[[i,j]] = true;
      region.plots.push([i,j]);
      region.parts[[i,j]] = true;
      region.xMin = Math.min(region.xMin, i);
      region.xMax = Math.max(region.xMax, i);
      region.yMin = Math.min(region.yMin, j);
      region.yMax = Math.max(region.yMax, j);
      findRegion(letter, i+1, j, region);
      findRegion(letter, i-1, j, region);
      findRegion(letter, i, j+1, region);
      findRegion(letter, i, j-1, region);
    }
  }

  let total = 0;
  const seen = {};
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      if (seen[[i,j]]) continue;

      let region = {
        letter: garden[j][i],
        plots: [],
        parts: {},
        xMin: 999, xMax: 0,
        yMin: 999, yMax: 0,
      };

      findRegion(garden[j][i], i, j, region);
      
      let area = region.plots.length;
      let price = area * sides(region, garden);
      total += price;
    }
  }

  console.log(total);
}

function sides(region, g)
{
  let total = 0;
  // vertical sides
  for (let i = region.xMin; i <= region.xMax; i++) {
    let l = 0, r = 0;
    for (let j = region.yMin; j <= region.yMax; j++) {
      if (region.parts[[i,j]]) {
        if (g[j][i-1] != region.letter) l++; 
        else if (l > 0) { total++; l = 0; }
        if (g[j][i+1] != region.letter) r++; 
        else if (r > 0) { total++; r = 0; }
      } else {
        if (l > 0) { total++; l = 0; }
        if (r > 0) { total++; r = 0; }
      }
    }
    if (l > 0) total++;
    if (r > 0) total++;
  }

  // horizontal sides
  for (let j = region.yMin; j <= region.yMax; j++) {
    let t = 0, b = 0;
    for (let i = region.xMin; i <= region.xMax; i++) {
      if (region.parts[[i,j]]) {
        if (!g[j-1] || g[j-1][i] != region.letter) t++; 
        else if (t > 0) { total++; t = 0; }
        if (!g[j+1] || g[j+1][i] != region.letter) b++; 
        else if (b > 0) { total++; b = 0; }
      } else {
        if (t > 0) { total++; t = 0; }
        if (b > 0) { total++; b = 0; }
      }
    }
    if (t > 0) total++;
    if (b > 0) total++;
  }

  return total;
}

function perimeter(region)
{
  let perimeter = 0;
  for (let k = 0; k < region.plots.length; k++) {
    let [x,y] = region.plots[k];
    if (!region.parts[[x+1, y]]) perimeter++;
    if (!region.parts[[x-1, y]]) perimeter++;
    if (!region.parts[[x, y+1]]) perimeter++;
    if (!region.parts[[x, y-1]]) perimeter++;
  }
  return perimeter;
}