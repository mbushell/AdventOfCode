const inputFilePath = "day7.txt";

// Solutions
// Part 1: 
// Part 2: 


solve(`190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`);


const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  solve(data);
});


function solve(data)
{
  let total = 0;
  data.split("\n").forEach(eq => {
    let [value, args] = eq.split(": ");
    value = parseInt(value);
    args = args.split(" ").map(a => parseInt(a));
    if (isPossible(value, args)) {
      total += value;
    }
  });
  console.log(total);
}

function isPossible(value, args)
{

  let opSets = [[]];
  for (let i = 0; i < args.length-1; i++) {
    let newOps = [];
    opSets.forEach(ops => {
      newOps.push([...ops, '+']);
      newOps.push([...ops, '*']);
      newOps.push([...ops, '|']);
    });
    opSets = newOps;
  }

  for (let i = 0; i < opSets.length; i++) {
    let ops = opSets[i];
    let total = args[0];
    for (let j = 0; j < ops.length && total <= value; j++) {
      switch (ops[j]) {
        case '+': total += args[j+1]; break;
        case '*': total *= args[j+1]; break;
        default:
          total = parseInt(`${total}${args[j+1]}`);
      }
    }
    if (total == value) {
      return true;
    }
  }
  return false;
}