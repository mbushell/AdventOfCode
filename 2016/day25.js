const file = require("path").basename(__filename);

function run_code(data, regs, out) {
  let code = data.split("\n").map(r => r.split(" "));
  for (let i = 0; i < code.length;) {
    let [op, arg1, arg2] = code[i];
    switch (op) {
      case "cpy":
        if (isNaN(arg2)) {
          regs[arg2] = isNaN(arg1) ? regs[arg1] : Number(arg1);
        }
        i++;
        break;
      case "inc": regs[arg1]++; i++; break;
      case "dec": regs[arg1]--; i++; break;
      case "jnz": {
        let value  = isNaN(arg1) ? regs[arg1] : Number(arg1);
        let offset = isNaN(arg2) ? regs[arg2] : Number(arg2);
        i += value != 0 ? offset : 1;
      } break;
      case "out":
        let result = out(isNaN(arg1) ? regs[arg1] : Number(arg1));
        if (result == -1) {
          i++;
        } else {
          return result;
        }
        break;
    }
  }
  return regs['a'];
}

function solve(data)
{
  let pattern = "01".repeat(10);
  let outputs = [];
  function out(value) {
    outputs.push(value);
    if (outputs.length < pattern.length) return -1;
    return outputs.join("") == pattern;
  }

  let i = 0;
  while (!run_code(data, { a: i, b: 0, c: 0, d: 0 }, out)) {
    outputs = [];
    i++;
  }
  console.log(i);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);