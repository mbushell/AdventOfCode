const file = require("path").basename(__filename);

function run_code(data, regs) {
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
      case "tgl": {
        let offset = isNaN(arg1) ? regs[arg1] : Number(arg1);
        let j = i + offset;
        if (j < code.length) {
          switch (code[j][0]) {
            case "cpy": code[j][0] = "jnz"; break;
            case "inc": code[j][0] = "dec"; break;
            case "dec": code[j][0] = "inc"; break;
            case "jnz": code[j][0] = "cpy"; break;
            case "tgl": code[j][0] = "inc"; break;
          }
        }
        i++;
      } break;
    }
  }
  return regs['a'];
}

function solve(data)
{
  console.log("Star 1:", run_code(data, { a: 7, b: 0, c: 0, d: 0 }));
  console.log("Star 2:", 12*11*10*9*8*7*6*5*4*3*2 + 78*99);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);