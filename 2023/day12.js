const file = require("path").basename(__filename);

// Star 1: 7843
// Star 2: 


parseData(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`);

require('node:fs').readFile(file.replace(".js", ".txt"), 'utf8',
  (err, data) => parseData(data)
);

function parseData(data)
{
  console.log(
    data.split("\n")
      .map(row => {
          let [springs, counts] = row.split(" ");
          return count(springs, 
                       counts.split(",").map(n => parseInt(n)));
        })
      .reduce(accumulate, 0)
  );
}

function count(springs, counts)
{
  let unknowns = [];
  let knownDamaged = 0;
  let totalDamaged = counts.reduce(accumulate, 0);
  for (let i = 0; i < springs.length; i++) {
    if (springs[i] == '?') {
      unknowns.push(i);
    } else if (springs[i] == '#') {
      knownDamaged++;
    }
  }

  // .??..??...?##. 1,1,3 (5)
  let missing = totalDamaged - knownDamaged;

  let sets = [[]];
  for (var i = 0; i < missing; i++) {
    let newSets = [];
    for (var j = 0; j < sets.length; j++) {
      let set = sets[j];
      for (var k = 0; k < unknowns.length; k++) {
        if (set.length == 0 || unknowns[k] > set[set.length-1]) {
          newSets.push([...set, unknowns[k]])
        }
      }
    }
    sets = newSets;
  }

  let count = 0;

  for (var j = 0; j < sets.length; j++) {
    let set = sets[j];
    let test = springs.split("");
    set.forEach(i => test[i] = '#');
    let check = test.join("").match(/\#+/g).map(s => s.length);
    if (equal(check, counts)) {
      count++;
    }
  }

  
  return count;
}

function accumulate(total, current) {
  return total + current;
}

function equal(a, b) {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}
