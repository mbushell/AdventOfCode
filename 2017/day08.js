const file = require("path").basename(__filename);

function solve(data)
{
  let regs = { };
  let highest = Number.MIN_SAFE_INTEGER;
  
  data.split("\n").forEach(line => {
    let [instruction, condition] = line.split(" if ");

    let [reg1, op1, val1] = instruction.split(" ");
    let [reg2, op2, val2] = condition.split(" ");

    regs[reg1] ??= 0;
    regs[reg2] ??= 0;

    val2 = Number(val2);
    switch (op2) {
      case ">":  if (!(regs[reg2] > val2))  return; break;
      case "<":  if (!(regs[reg2] < val2))  return; break;
      case ">=": if (!(regs[reg2] >= val2)) return; break;
      case "<=": if (!(regs[reg2] <= val2)) return; break;
      case "==": if (!(regs[reg2] == val2)) return; break;
      case "!=": if (!(regs[reg2] != val2)) return; break;
      default: throw "unknown op";
    }
    
    val1 = Number(val1);
    switch (op1) {
      case "inc": regs[reg1] += val1; break;
      case "dec": regs[reg1] -= val1; break;
      default: throw "unknown op";
    }
    
    highest = Math.max(highest, ...Object.values(regs));
  });

  console.log("Star 1:", Math.max(...Object.values(regs)));
  console.log("Star 2:", highest);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);