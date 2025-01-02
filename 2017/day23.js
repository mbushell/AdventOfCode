const file = require("path").basename(__filename);

function solve(data)
{
  let code = data.split("\n").map(line => {
    let [op, ...args] = line.split(" ");
    return [op, ...args.map(arg => isNaN(arg) ? arg : Number(arg))]
  });

  let new_program = () => {
    regs = {
      a:0, b:0, c:0, d:0, e:0, f:0, g:0, h:0
    };
    return {
      i: 0,
      regs: regs,
      value: arg  => isNaN(arg) ? regs[arg] : arg,
    };
  }

  let program = new_program();
  run(program, code);
  
  console.log("Star 2:", star2());
}

function run(p, code) {
  let muls = 0;
  while (code[p.i] !== undefined) 
  {
    let [op, arg1, arg2] = code[p.i];
    switch (op) {
      case "set":
        p.regs[arg1] = p.value(arg2);
        p.i++;
        break;
      case "sub":
        p.regs[arg1] -= p.value(arg2);
        p.i++;
        break;
      case "mul":
        p.regs[arg1] *= p.value(arg2);
        p.i++;
        muls++;
        break;
      case "jnz":
        p.i += p.value(arg1) != 0 ? p.value(arg2) : 1;
        break;
    }
  }
  console.log("Star 1:", muls);
}

function star2()
{
  // initial
  let a = 1;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  let f = 0;
  let g = 0;
  let h = 0;
  
  /*
  b = 81;
  c = b;
  if (a != 0) {
    b *= 100;
    b += 100000;
    c = b;
    c += 17000;
  }
  */

  b = 108100;
  c = 125100;

  while (true)
  {
    f = 1;
    d = 2;
    do {
      e = 2;
      if (b % d == 0) {
        f = 0;
        break;
      }
      /*do {
        g = d * e - b;
        if (g == 0) {
          console.log("->", d, e, b);
          f = 0
        }
        e++;
        g = e - b;
      }
      while (g != 0);*/
      d++;
      //g = d - b;
    }
    while (d != b);
    //while (g != 0);
  
    if (f == 0) {
      h++;
    }
  
    //g = b - c;
    if (b == c) { //g == 0) {
      return h;
    }
    b += 17;
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);