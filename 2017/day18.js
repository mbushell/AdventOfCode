const file = require("path").basename(__filename);

function solve(data)
{
  let code = data.split("\n").map(line => {
    let [op, ...args] = line.split(" ");
    return [op, ...args.map(arg => isNaN(arg) ? arg : Number(arg))]
  });

  function program(id) {
    let regs = { p: id };
    let input = [];
    return {
      i: 0,
      regs: regs,
      value: arg  => isNaN(arg) ? regs[arg] : arg,
      send: arg   => input.push(arg),
      receive: () => input.length > 0 ? input.shift() : null,
      input: input,
      sent: 0,
      awaitingInput: false,
    };
  }

  let prog0 = program(0);
  prog0.receive = () => {
    let value = prog0.input.pop();
    if (value != 0) {
      console.log("Star 1:", value);
      prog0.i = -1;
    }
  }
  run([prog0, prog0], code);
  
  console.log("Star 2:", run([program(0), program(1)], code));  
}

function run(programs, code) {
  let j = 0;
  while (true) {
    let p = programs[j++ % 2];
    let q = programs[j % 2];

    if (p.awaitingInput && q.awaitingInput) {
      return programs[1].sent;
    } else if (!code[p.i]) {
      return -1;
    }

    let [op, arg1, arg2] = code[p.i];
    switch (op) {
      case "snd":
        q.send(p.value(arg1));
        p.sent++;
        p.i++;
        break;
      case "set":
        p.regs[arg1] = p.value(arg2);
        p.i++;
        break;
      case "add":
        p.regs[arg1] += p.value(arg2);
        p.i++;
        break;
      case "mul":
        p.regs[arg1] *= p.value(arg2);
        p.i++;
        break;
      case "mod":
        p.regs[arg1] %= p.value(arg2);
        p.i++;
        break;
      case "rcv":
        let value = p.receive();
        if (value !== null) {
          p.regs[arg1] = value;
          p.awaitingInput = false;
          p.i++;
        } else {
          p.awaitingInput = true;
        }
        break;
      case "jgz":
        p.i += p.value(arg1) > 0 ? p.value(arg2) : 1;
        break;
    }
  }  
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);