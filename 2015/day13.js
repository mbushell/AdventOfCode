const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  let people = { ME: {} };
  
  data.split("\n").map(line => {
    let match = line.match(/^(\w+) would (lose|gain) (\d+) happiness units by sitting next to (\w+).$/);
    let person = people[match[1]] ??= {};
    person[match[4]] = parseInt(match[3]) * (match[2] == "lose" ? -1 : 1);
    people['ME'][match[1]] = 0;
    person['ME'] = 0;
  });

  let names = Object.keys(people);
  let perms = permutations(names, []);
  let N = names.length;

  // could optimise by using only cyclic permutations

  let max = Number.MIN_SAFE_INTEGER;
  perms.forEach(perm => {
    let total = 0;
    for (let i = 0; i < perm.length; i++) {
      let person = people[perm[i]];
      total += person[perm[(i+N-1) % N]];
      total += person[perm[(i+1)   % N]];
    }
    max = Math.max(max, total);
  });
  console.log(max);
}

function permutations(arr, perm) {
  if (arr.length == 0) return [perm];
  let all = [];
  for (let i = 0; i < arr.length; i++) {
    let rest = [...arr];
    rest.splice(i, 1);
    all.push(...permutations(rest, [...perm, arr[i]]));
  }
  return all;
}
