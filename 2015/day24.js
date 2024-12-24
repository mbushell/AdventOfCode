const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  const weights = data.split("\n").map(n => parseInt(n));
  const target = weights.reduce((t, c) => t + c, 0) / 4;

  weights.sort((a, b) => b - a);

  let halves = find_groups(weights, target*2, -1);

  let best_quarters = [];
  for (let half1 of halves) {
    let half2 = [];
    for (w of weights) {
      if (half1.indexOf(w) == -1) half2.push(w);
    }

    let quart1 = find_groups(half1, target, -1);
    let quart2 = find_groups(half2, target, 1);

    if (quart1.length > 0 && quart2.length > 0) {
      for (let grp of quart1) {
        best_quarters.push([grp, grp.reduce((t, c) => t*c, 1)]);
      }
    }
  }
  
  best_quarters.sort((a, b) => a[1] - b[1]);
  console.log(best_quarters[0]);
}

function find_groups(all, target, cap) {

  function find(all, from, grp, weight, target, result, cap) {
    if (cap > 0 && result.length >= cap) return;
    if (weight > target) return;
    if (result.length > 0) {
      if (grp.length > result[0].length) return;
    }
    if (weight == target) {
      if (result.length == 0 || grp.length < result[0].length) {
        result.splice(0, result.length);
      }
      result.push(grp);
    } else {
      for (let i = from; i < all.length; i++) {
        find(all, i+1, [...grp, all[i]], weight + all[i], target, result, cap)
      }
    }
  }

  let result = [];
  find(all, 0, [], 0, target, result, cap);
  return result;
}