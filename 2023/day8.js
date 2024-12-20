const fs = require('node:fs');
/*
parseData(`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`);

parseData(`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`);
*/

/*
parseData2(`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`);
*/

fs.readFile('./day8-input.txt', 'utf8',
  (err, data) => parseData2(data)
);

// Day 2:
function parseData2(data)
{
  const lines = data.split("\n");
  const directions = lines[0];

  const nodes = {};
  const startNodes = [];

  for (let i = 2; i < lines.length; i++) {
    if (lines[i] == "") continue;
    let parts = lines[i].split(" = ");
    nodes[parts[0]] = parts[1].slice(1, -1).split(", ");
  
    if (parts[0].slice(-1) == "A") {
      startNodes.push(parts[0]);
    }
  }

  const steps = startNodes.map(node => {
    let steps = countSteps(nodes, directions, node, 
      node => node.slice(-1) == "Z"
    );
    return steps;
  });

  console.log(leastCommonMultiple(steps));
}

function leastCommonMultiple(numbers)
{
  function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);   
  }

  var multiple = Math.min(...numbers);
  numbers.forEach(function(n) {
    multiple = lcm(multiple, n);
  });

  return multiple;
}

// Day 1: 16897
function parseData1(data)
{
  const lines = data.split("\n");
  const directions = lines[0];
  const nodes = {};
  for (let i = 2; i < lines.length; i++) {
    if (lines[i] == "") continue;
    let parts = lines[i].split(" = ");
    nodes[parts[0]] = parts[1].slice(1, -1).split(", ");
  }
  console.log(countSteps(nodes, directions,
    "AAA", node => node == "ZZZ"
  ));
}


function countSteps(nodes, directions, startNode, endTest)
{
  let steps = 0;
  let i = 0;
  for (let node = startNode; !endTest(node); i = (i + 1) % directions.length) {
    node = directions[i] == "L" ? nodes[node][0] : nodes[node][1];
    steps++;
  }
  return steps;
}