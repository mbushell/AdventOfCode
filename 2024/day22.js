const file = require("path").basename(__filename);

// Star 1: 18782561665
// Star 2: 2100

solve(`1
2
3
2024`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let secrets = data.split("\n").map(n => BigInt(n));


  let all_sequences = {};

  secrets.forEach(n => {
    let prices = [];
    let diffs = [null];
    let sequences = {};

    for (let i = 0; i <= 2000; i++)
    {
      prices[i] = price(n);
      
      if (i >= 1) {
        diffs[i] = prices[i] - prices[i-1];
      }

      if (i >= 4)
      {
        let seq = [diffs[i-3], diffs[i-2], diffs[i-1], diffs[i-0]];

        if (!sequences[seq]) {
          sequences[seq] = prices[i];
          all_sequences[seq] ??= 0n;
          all_sequences[seq] += prices[i];
        }
      }
      
      n = evolve(n);
    }
  });

  let best = Object.entries(all_sequences).sort((a, b) => Number(b[1] - a[1]))


  console.log(best[0])
  
}

function price(secret) {
  return secret % 10n;
}

function evolve(secret)
{
  let result = BigInt(secret);
  result ^= BigInt(secret) * 64n;
  result %= 16777216n;
  result ^= BigInt(result / 32n);
  result %= 16777216n;
  result ^= result * 2048n;
  result %= 16777216n;
  return result;
}