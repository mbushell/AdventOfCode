const file = require("path").basename(__filename);

// Star 1: 2375
// Star 2: RKHRY

//parseData(`0222112222120000`);

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  const w = 25, h = 6;
  const layers = [];

  let layer = [];
  let x = 0, y = 0;
  for (let i = 0; i < data.length; i++)
  {
    layer[y] ??= [];
    layer[y].push(data[i]);

    x++;
    if (x == w) {
      x = 0;
      y++;
    }
    if (y == h) {
      x = 0;
      y = 0;
      layers.push(layer);
      layer = [];
    }
  }

  let image = [];
  layers.forEach(layer =>
  {
    for (let y = 0; y < h; y++) {
      image[y] ??= Array(w).fill('2');
      for (let x = 0; x < w; x++) {
        if (image[y][x] == '2') {
          image[y][x] = layer[y][x];
          if (image[y][x] == '0') {
            image[y][x] = ' ';
          }
        }
      }
    }
  });


  console.log(image.map(r => r.join("")).join("\n"));
}

function part1(data)
{
  const w = 25, h = 6;
  const pixelsPerImage = w*h;

  const layers = [];
  let counts = {};
  for (let i = 0, j = 0; i < data.length; i++) {
    if (j == pixelsPerImage) {
      layers.push(counts);
      counts = {};
      j = 0;
    }
    counts[data[i]] ??= 0;
    counts[data[i]]++;
    j++;
  }
  layers.push(counts);

  let best;
  layers.forEach(counts => {
    counts[0] ??= 999999999;
    best = (best === undefined || (counts[0] < best[0])) ? counts : best;
  });

  best[1] ??= 0;
  best[2] ??= 0;
  console.log(best[1] * best[2]);  
}
