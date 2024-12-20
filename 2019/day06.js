const file = require("path").basename(__filename);

// Star 1: 142915
// Star 2: 283

parseData(`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`);


require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data) {
  
  let planets = {};

  function init(name) {
    planets[name] ??= { name: name, parent: null, children: [] };
  }

  data.split("\n").forEach(orbit => {
    let [parent, name] = orbit.split(")");
    init(name);
    init(parent);    
    planets[name].parent = parent;
    planets[parent].children.push(planets[name]);
  });

  totalOrbits(planets);

  let you = planets["YOU"];
  let san = planets["SAN"];
  let anc = closestAncestor(planets, you, san);

  let d = (you.orbits - anc.orbits) + (san.orbits - anc.orbits) - 2;
  console.log(d);
}

// Part 2
function closestAncestor(planets, x, y)
{
  let xpath = [];
  while (x != null) {
    xpath.push(x);
    x = planets[x.parent];
  }
  let ancestor = y;
  while (xpath.indexOf(ancestor) == -1) {
    ancestor = planets[ancestor.parent];
  }
  return ancestor;
}

// Part 1
function totalOrbits(planets)
{
  let total = 0;
  function trace(planet, orbits) {
    total += orbits;
    planet.orbits = orbits;
    planet.children.forEach(child => trace(child, orbits + 1));
  }
  trace(planets['COM'], 0);
  return total;
}
