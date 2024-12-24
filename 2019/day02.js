const file = require("path").basename(__filename);

// Star 1: 3166704
// Star 2: 8018

/*
parseData(`1,9,10,3,2,3,11,0,99,30,40,50`);
parseData(`1,1,1,4,99,5,6,0,99`);
return;
*/

const IC = require("./intcode.js");

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data.trim())
);

function parseData(data)
{
  let comp = new IC();

  // Star 1:
  comp.load(data);
  comp.code[1] = 12;
  comp.code[2] = 2;
  comp.start();
  console.log("Star 1");
  console.log("Expected:\t", 3166704);
  console.log("Outcome: \t", comp.code[0]);
  console.log("Passed:  \t", comp.code[0] === 3166704);

  // Star 2:
  let n = 99;
  let v = 0;

  let goal = 19690720;
  let curr = 99999999;

  while (curr > goal) {
    comp.reset();
    comp.load(data);
    comp.code[1] = n;
    comp.code[2] = v;
    comp.start();
    curr = comp.code[0];
    n--;
  }
  n++;

  while (curr != goal) {
    comp.reset();
    comp.load(data);
    comp.code[1] = n;
    comp.code[2] = v;
    comp.start();
    curr = comp.code[0];
    v++;
  }

  const result = 100 * n + v;

  console.log("\nStar 2");
  console.log("Expected:\t", 80, "\t", 19, "\t", 8019);
  console.log("Outcome: \t", n,  "\t", v, "\t", result);
  console.log("Passed:  \t", n===80, "\t",  v===19,  "\t", result===8019);
  return;


}
