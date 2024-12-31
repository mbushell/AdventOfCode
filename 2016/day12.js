const file = require("path").basename(__filename);

function run_code(data, regs) {
  let code = data.split("\n").map(r => r.split(" "));
  for (let i = 0; i < code.length;) {
    let [op, arg1, arg2] = code[i];
    switch (op) {
      case "cpy":
        regs[arg2] = isNaN(arg1) ? regs[arg1] : Number(arg1);
        i++;
        break;
      case "inc": regs[arg1]++; i++; break;
      case "dec": regs[arg1]--; i++; break;
      case "jnz":
        let value  = isNaN(arg1) ? regs[arg1] : Number(arg1);
        let offset = isNaN(arg2) ? regs[arg2] : Number(arg2);
        i += value != 0 ? offset : 1;
        break;
    }
  }
  return regs['a'];
}

function solve(data) {
  console.log("Star 1:", run_code(data, { a: 0, b: 0, c: 0, d: 0 }));
  console.log("Star 2:", run_code(data, { a: 0, b: 0, c: 1, d: 0 }));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);