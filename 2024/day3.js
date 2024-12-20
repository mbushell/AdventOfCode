const inputFilePath = "day3.txt";

// Solutions
// Part 1: 159892596
// Part 2: 92626942

solve(`xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`);
solve(`xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`);


const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  solve(data);
});


function solve(d)
{

  function parseNumber(d, j)
  {
    let k = j;
    let c = d.charCodeAt(k);
    while (c >= 48 && c <= 57 && k - j <= 3) {
      c = d.charCodeAt(++k);
    }
    return k;
  }

  let sum = 0;
  let enabled = true;

  for (let i = 0; i < d.length; i++)
  {
    if (d.slice(i, i+7) == "don't()") {
      enabled = false; i += 7;
    } else if (d.slice(i, i+4) == "do()") {
      enabled = true;  i += 4;
    }

    if (enabled && d.slice(i, i+4) == "mul(")
    {
      let j = i + 4;
      let k1 = parseNumber(d, j);
      if (k1 == j || d[k1] != ",") {
        i = k1; continue;
      }
      let k2 = parseNumber(d, k1+1);
      if (k2 == (k1+1) || d[k2] != ")") {
        i = k2; continue;
      }
      let a = parseInt(d.slice(j, k1));
      let b = parseInt(d.slice(k1 + 1, k2));
      sum += a * b;
      i = k2;
    }
  }
  
  console.log(sum);
}
