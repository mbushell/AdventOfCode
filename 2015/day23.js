const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  let comp = {
    i: 0,
    a: 1,
    b: 0,
  };

  let code = data.split("\n").map(instruction =>
    instruction.replace(",", "").split(" ")
  );

  while (code[comp.i]) {
    let [op, ...args] = code[comp.i];
    //console.log(comp.i, op, args, comp.a, comp.b);
    switch (op) {
      case "hlf":
        comp[args[0]] /= 2;
        comp.i++;
        break;
      case "tpl":
        comp[args[0]] *= 3;
        comp.i++;
        break;
      case "inc":
        comp[args[0]] += 1;
        comp.i++;
        break;
      case "jmp":
        comp.i += parseInt(args[0]);
        break;
      case "jie":
        if (comp[args[0]] % 2 == 0) {
          comp.i += parseInt(args[1]);
        } else {
          comp.i++;
        }
        break;
      case "jio":
        if (comp[args[0]] == 1) {
          comp.i += parseInt(args[1]);
        } else {
          comp.i++;
        }
        break;
    }
  }

  console.log(comp);
  
}