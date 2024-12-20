const file = require("path").basename(__filename);

// Star 1: 218956
// Star 2: 259593838049805

const cache = {};

//solve(`0 1 10 99 999`);

solve(`125 17`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);

function solve(data)
{
  const MAX_LEVEL = 75;
  let stones = data.split(" ").map(s => [s, 1]);
  for (let i = 0; i < MAX_LEVEL; i++) {
    let next = {};
    stones.forEach(s => {
      blink(s[0]).forEach(c => { next[c] ??= 0; next[c] += s[1]; })
    });
    stones = Object.entries(next);
  }
  console.log(stones.reduce((t, s) => t + s[1], 0));
}

function solve1(data)
{
  // Part 1
  let stones = data.split(" ");
  for (let i = 1; i <= 25; i++) {
    stones = stones.flatMap(blink);
  }
  console.log(stones.length);
}

function blink(stone)
{
  if (stone == "0") return ["1"];
  else if (stone.length % 2 == 0)
    return [
      String(parseInt(stone.slice(0, stone.length/2))),
      String(parseInt(stone.slice(stone.length/2)))
    ];
  else return [String(parseInt(stone) * 2024)];
}