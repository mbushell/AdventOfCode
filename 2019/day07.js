const file = require("path").basename(__filename);
const readlineSync = require(`readline-sync.js`);

// Star 1: 422858
// Star 2: 14897241

const IC = require("./intcode.js");

/* Part 1 Examples:
parseData(`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`);

parseData(`3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`);
parseData(`3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`);
*/

/* Part 2 Examples: 
parseData(`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`);

parseData(`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`);
*/

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  console.log("\tResult\t\tPassed")

  const expected1 = 422858;
  const outcome1 = maximize(data, acsSequence);
  console.log("Star 1:\t",outcome1, "\t", expected1 == expected1);

  const expected2 = 14897241;
  const outcome2 = maximize(data, acsFeedback);
  console.log("Star 2:\t",outcome2, "\t", expected2 == expected2);
}


// Part 1
function maximize(data, func)
{
  let setups = [];
  function gen(setup) {
    if (setup.length == 5) {
      setups.push(setup);
    } else {
      for (let i = 0; i <= 4; i++) {
        if (setup.indexOf(i) == -1) {
          gen([...setup, i]);
        }
      }
    }
  }
  gen([]);
  let best = 0;
  setups.forEach(phases => {
    best = Math.max(best, func(data, phases));
  });
  return best;
}

// Part 1
function acsSequence(data, phases)
{
  let signal = 0;
  for (let i = 0; i < 5; i++)
  {
    let thruster = new IC();
    thruster.load(data);
    thruster.output = (value) => {
      signal = value;
    }
    thruster.start();
    thruster.input(phases[i]);
    thruster.input(signal);
  }
  return signal;
}

// Part 2
function acsFeedback(data, phases)
{
  let signal = 0;

  let thrusters = [];
  for (let i = 0; i < 5; i++) {
    let thruster = new IC();
    thruster.load(data);
    thruster.output = (value) => {
      //console.log(`Thruster ${i} output signal ${value}`);
      signal = value;
    }
    thruster.start();
    thruster.input(phases[i] + 5);
    thrusters.push(thruster);
  }

  let i = 0;
  while (thrusters[i].status == IC.AWAITING_INPUT) {
    //console.log(`Signal ${signal} into thruster ${i}.`);
    thrusters[i++].input(signal);
    i = i % thrusters.length;
  }

  return signal;
}

