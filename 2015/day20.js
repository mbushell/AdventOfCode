const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

/*
1 2 3 ...  49,  50
2 4 6 ...  98  100
3 6 9 ... 147, 150
*/

function solve(data)
{
  // <= 705600
  let target = 29000000; //parseInt(data);

  let house = 650000;
  while (house <= 680000) {
    let p = presents(house);
    if (p > target) break;
    console.log(house, p);
    house++;
  }
  console.log(house);
}

function presents(house) {
  let elves = factors(house).filter(n => 50*n >= house);
  return elves.reduce((t, c) => t + c*11, 0);
}

function factors(n) {
  let primes = prime_factors(n);
  let seen = {};
  let factors = [1];
  primes.forEach(p => {
    factors.forEach(f => {
      let m = p*f;
      if (!seen[m]) {
        factors.push(m);
      }
      seen[m] = true;
    })
  })
  return factors;
}

function prime_factors(n) {
  function factorise(n, factors) {
    for (let i = 2; i < n; i++) {
      if (n % i == 0) {
        return factorise(n/i, [...factors, i]);
      }
    }
    return [...factors, n];
  }
  return factorise(n, []);
}

