const file = require("path").basename(__filename);
const input = require(`readline-sync.js`);

// Star 1: 6745903
// Star 2: 9168267

const IC = require("./intcode.js");

/*
parseData(`3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`);
return
*/

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8",
  (err, data) => parseData(data.trim())
);

function parseData(data) {
  let comp = new IC();
  comp.output = (value) => { outputs.push(value); };
  
  let expected;

  outputs = [];
  comp.reset();
  comp.load(data);
  comp.start();
  comp.input(1);
  
  expected = [0,0,0,0,0,0,0,0,0,6745903];
  console.log("Star 1");
  console.log("Outcome:", outputs.toString());
  console.log("Expected:", expected.toString());
  console.log("Passed", outputs.toString() === expected.toString());

  outputs = [];
  comp.reset();
  comp.load(data);
  comp.start();
  comp.input(5);
  
  expected = [9168267];
  console.log("\nStar 2");
  console.log("Outcome:", outputs.toString());
  console.log("Expected:", expected.toString());
  console.log("Passed", outputs.toString() === expected.toString());
}
