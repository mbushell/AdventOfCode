const file = require("path").basename(__filename);

// Star 1: 287
// Star 2: 571894474468161

solve(`r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`);


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  console.log(([towels, designs] = 
    data.split("\n\n").map(x => x.match(/\w+/g)))[1]
    .reduce((total, design) =>
      total + (match = (design, i, counts) => {
        return i == design.length
        ? 1
        : counts[i] !== undefined
          ? counts[i]
          : counts[i] = towels.reduce((total, towel) => 
              total + (design.slice(i, i+towel.length) == towel
                ? match(design, i+towel.length, counts)
                : 0), 0);
      })(design, 0, {})
    ,0));
}

/*
function solve(data)
{
  let [towels,designs] = data.split("\n\n");
  towels = towels.split(", ");
  console.log(designs.split("\n").reduce((total, design) =>
    total + match(design, towels, 0, {})
  ,0));
}

function match(design, towels, i, counts)
{
  if (i == design.length) return 1;
  else if (counts[i] !== undefined) return counts[i];

  let matches = 0;
  for (let j = 0; j < towels.length; j++) {
    let towel = towels[j];
    if (design.slice(i, i+towel.length) == towel) {
      matches += match(design, towels, i+towel.length, counts);
    }
  }
  
  return counts[i] = matches;
}
*/


/* Part 1
function match(design, towels, i)
{
  if (i >= design.length) return true;
  for (let j = 0; j < towels.length; j++) {
    let towel = towels[j];
    if (design.slice(i, i+towel.length) == towel) {
      if (match(design, towels, i+towel.length)) {
        return true;
      }
    }
  }
  return false;
}
*/