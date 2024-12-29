const file = require("path").basename(__filename);

const IC = require("./intcode.js");

function solve(data)
{
  function num_to_ops(regs, n) {
    let ops = [];
    for (let i = 0; i < regs.length; i++) {
      ops.push(n & 1);
      n >>= 1;
    }
    ops = ops
      .map((value, j) => [regs[j], value])
      .sort((a, b) => a[1] - b[1]);

    
    let seq = [];
    let off = ops.filter(op => op[1] == 0);
    
    if (off.length > 0) {
      seq.push(`NOT ${off[0][0]} J`);
      for (let i = 1; i < off.length; i++) {
        seq.push(`NOT ${off[i][0]} T`);
        seq.push(`OR T J`);
      }
    } 
    ops.filter(op => op[1] == 1).forEach(op => {
      seq.push(`AND ${op[0]} J`);
    });
    return seq;
  }
 
  let regs = "ABCD";
  for (let i = 0; i < 2**regs.length; i++) {
    let seq = num_to_ops(regs, i);

    let ic = new IC();
    ic.load(data);
    ic.start();
    for (let op of seq) {
      ic.input_str(op + "\n");
    }
    ic.input_str("WALK\n");

    if (ic.outputs[ic.outputs.length-1] > 128) {
      console.log("Star 1:", ic.outputs[ic.outputs.length-1]);
      break;
    }
  }

  /*
  let ic = new IC();
  ic.load(data);
  ic.start();
  ic.input_str("NOT A J\n");
  ic.input_str("NOT B T\n");
  ic.input_str("OR T J\n");
  ic.input_str("NOT C T\n");
  ic.input_str("OR T J\n");
  ic.input_str("AND D J\n");
  ic.input_str("WALK\n");
  console.log("Star 1:", ic.outputs[ic.outputs.length-1]);
  */
 

  let ic = new IC();
  ic.load(data);
  ic.start();
  ic.input_str("NOT B J\n");
  ic.input_str("NOT C T\n");
  ic.input_str("OR T J\n");
  ic.input_str("AND D J\n");
  ic.input_str("AND H J\n");
  ic.input_str("NOT A T\n");
  ic.input_str("OR T J\n");
  ic.input_str("RUN\n");
  console.log("Star 2:", ic.outputs[ic.outputs.length-1]);
 
  return;
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);