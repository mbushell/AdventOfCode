const file = require("path").basename(__filename);
const readlineSync = require(`readline-sync.js`);

// Star 1: 
// Star 2: 

let IC = require("./intcode.js");


require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => parseData(data.trim())
);

function parseData(data)
{
  let comp = new IC();
  let result;

  comp.load(data);
  comp.start();
  comp.input(1);
  result = comp.outputs[0];
  console.log("Star 1:",
    "\nExpected:\t", 3063082071,
    "\nResult:  \t", result,
    "\nPassed:  \t", result === 3063082071);

  console.log("");

  comp.reset();
  comp.load(data);
  comp.start();
  comp.input(2);
  result = comp.outputs[0];
  console.log("Star 2:",
    "\nExpected:\t", 81348,
    "\nResult:  \t", result,
    "\nPassed:  \t", result === 81348);
}