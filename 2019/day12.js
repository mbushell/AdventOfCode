const file = require("path").basename(__filename);

// Star 1: 8454
// Star 2: 362336016722948

parseData(`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`);

parseData(`<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`);

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

async function parseData(data)
{
  let moons = data.split("\n").map(line => { return {
    p: line.match(/-?\d+/g).map(n => parseInt(n)),
    v: [0, 0, 0]
  }});

  const pairs = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 3], 
    [2, 3]
  ];

  function step()
  {
    // apply gravity
    pairs.forEach(([i, j]) => {
      let m = moons[i];
      let n = moons[j];
      for (let axis = 0; axis < 3; axis++) {
        if (m.p[axis] == n.p[axis]) continue;
        if (m.p[axis] > n.p[axis]) {
          m.v[axis]--; n.v[axis]++;
        } else {
          m.v[axis]++; n.v[axis]--;
        }
      }
    });
    // apply velocities
    moons.forEach(moon => {
      for (let axis = 0; axis < 3; axis++)
        moon.p[axis] += moon.v[axis];
    });  
  }

  function energy(m)
  {
    return (Math.abs(m.p[0]) + Math.abs(m.p[1]) + Math.abs(m.p[2]))
         * (Math.abs(m.v[0]) + Math.abs(m.v[1]) + Math.abs(m.v[2]));
  }

  function totalEnergy()
  {
    return moons.reduce((total, m) => {
      return total + energy(m);
    }, 0);
  }

  function orbits(p0s, axis) {
    let steps = 0;
    let orbits = 0;
    while (orbits < 4) {
      step();
      steps++;
      orbits = 0;
      for (let k = 0; k < 4; k++) {
        if (moons[k].p[axis] === p0s[k][0] &&
            moons[k].v[axis] === p0s[k][1])
        {
          orbits++;
        }
      }
    }
    return steps;
  }

  let p0s = moons.map(m => [m.p[0], m.v[0]]);
  let p1s = moons.map(m => [m.p[1], m.v[0]]);
  let p2s = moons.map(m => [m.p[2], m.v[0]]);
  
  let copy = JSON.stringify(moons);
  let xorbit = orbits(p0s, 0);
  moons = JSON.parse(copy);
  let yorbit = orbits(p1s, 1);
  moons = JSON.parse(copy);
  let zorbit = orbits(p2s, 2);

  console.log(leastCommonMultiple([xorbit, yorbit, zorbit]))
}

function leastCommonMultiple(numbers) {
  function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);   
  }

  var multiple = 1;
  numbers.forEach(function(n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
}