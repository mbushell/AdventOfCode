const file = require("path").basename(__filename);

// Star 1: 5,1,3,4,3,7,2,1,7
// Star 2: 216584205979245

solve(`Register A: 41644071
Register B: 0
Register C: 0

Program: 2,4,1,2,7,5,1,7,4,4,0,3,5,5,3,0`);
return;

solve(`Register A: 12345678
Register B: 0
Register C: 0

Program: 2,4,1,0,7,5,1,5,0,3,4,5,5,5,3,0`);
return


solve(`Register A: 33024962
Register B: 0
Register C: 0

Program: 2,4,1,3,7,5,1,5,0,3,4,2,5,5,3,0`);
return

/*
require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);*/

function solve(data) {
  let comp = {
    i: 0,
    a: 0,
    b: 0,
    c: 0,
    p: [],
    o: [],
  };

  let program;

  data.trim().split("\n\n").forEach((l, i) => {
      let d = l.split("\n").map((r) => r.split(": ")[1]);
      if (i == 0) {
        [comp.a, comp.b, comp.c] = d.map((x) => parseInt(x));
      } else {
        program = d[0];
        comp.p = program.split(",").map((o) => parseInt(o));
      }
    });

  const backup = JSON.parse(JSON.stringify(comp));

  function reset(comp, a) {
    comp.i = 0;
    comp.a = a;
    comp.b = 0;
    comp.c = 0;
    comp.o = [];
  }

  run(comp);
  console.log(comp.o.join(","));
  return;

  /*
  6n 0
  49n 3,0
  393n 5,3,0
  3145n 5,5,3,0
  25165n 2,5,5,3,0
  201709n 4,2,5,5,3,0
  1613672n 3,4,2,5,5,3,0
  12909424n 0,3,4,2,5,5,3,0
  103275394n 5,0,3,4,2,5,5,3,0
  826203174n 1,5,0,3,4,2,5,5,3,0
  6609625394n 5,1,5,0,3,4,2,5,5,3,0
  52877003412n 7,5,1,5,0,3,4,2,5,5,3,0
  423016027300n 3,7,5,1,5,0,3,4,2,5,5,3,0
  3384128218406n 1,3,7,5,1,5,0,3,4,2,5,5,3,0
  27073025747397n 4,1,3,7,5,1,5,0,3,4,2,5,5,3,0
  216584205979245n 2,4,1,3,7,5,1,5,0,3,4,2,5,5,3,0
  */

  /* UNOPTIMIZED:
  let target = comp.p;

  let n = 1;
  let len = 1;

  while (len <= target.length)
  {
    let i = target.length - len;
    let goal = target.slice(i);

    
    while (true) {
      reset(comp, n);
      run(comp);
      let passed = true;
      for (let j = 0; j < goal.length; j++) {
        if (comp.o[j] != goal[j]) {
          passed = false;
          break;
        }
      }
      if (passed) break;
      n++;
    }
  
    console.log(n, goal.join(","));
    n *= 8;
    len++;
  }
  
  return*/

  /*
  COMBO: 4=A, 5=B, 6=C

  Register A: 33024962
  Register B: 0
  Register C: 0

  Program: 2,4,1,3,7,5,1,5,0,3,4,2,5,5,3,0

  1) 2,4,   bst    B = A % 8
  2) 1,3,   bxl    B = B ^ 3
  3) 7,5,   cdv    C = A / 2**B (truncated)
  4) 1,5,   bxl    B = B ^ 5
  5) 0,3,   adv    A = A / 8    (truncated)
  6) 4,2,   bxc    B = B ^ C    (operand ignored)
  7) 5,5,   out    B % 8
  8) 3,0   jnz REPEAT ALL
  */

  //Program: 2,4, 1,3, 7,5, 1,5, 0,3, 4,2, 5,5, 3,0
  //Program: 2,4, 1,0, 7,5, 1,5, 0,3, 4,5, 5,5, 3,0
  //         2,4, 1,3, 7,5, 0,3, 1,4, 4,4, 5,5, 3,0

  // OPTIMIZED
  function run2(n, goal, len)
  {
    let a = n, b = 0n, c = 0n;
    let matches = 0;
    let out = [];
    for (let i = 0; a != 0 && i <= len; i++)
    {
      b = (a % 8n)^3n;
      c = BigInt(a / (2n**b));
      b = ((b^4n)^c);
      b = b % 8n;
      a = BigInt(a / 8n);

      /*
      b = (a % 8n)^3n;
      c = BigInt(a / (2n**b));
      b = ((b^5n)^c);
      b = b % 8n;
      a = BigInt(a / 8n);
      */

      out.push(b);
      
      if (b !== goal[i]) return;
      matches++;
    }
    

    return matches == len;
  }

  //let target = [2n,4n,1n,3n,7n,5n,1n,5n,0n,3n,4n,2n,5n,5n,3n,0n];
  //let target = [2n,4n,1n,0n,7n,5n,1n,5n,0n,3n,4n,5n,5n,5n,3n,0n];
  let target = [2n,4n,1n,3n,7n,5n,0n,3n,1n,4n,4n,4n,5n,5n,3n,0n];

  let n = 1n;
  let len = 1;

  while (len <= target.length)
  {
    let i = target.length - len;
    let goal = target.slice(i);
    
    while (!run2(n, goal, len)) {
      n++;
    }
  
    console.log(n, goal.join(","));
    n *= 8n;
    len++;
  }

}

/*
 1 35184372088836 2
 3 35184372089535 2,4,1
 4 35184372091583 2,4,1,3
 5 35184373031615 2,4,1,3,7
 6 35184373227117 2,4,1,3,7,5
 7 35184374795885 2,4,1,3,7,5,1
 8 35184391573101 2,4,1,3,7,5,1,5
 9 35184478084717 2,4,1,3,7,5,1,5,0
10 35188350996077 2,4,1,3,7,5,1,5,0,3

  6 0
  49 3,0
  393 5,3,0
  3145 5,5,3,0
  25165 2,5,5,3,0
  201709 4,2,5,5,3,0
  1613672 3,4,2,5,5,3,0
  12909424 0,3,4,2,5,5,3,0
  103275394 5,0,3,4,2,5,5,3,0
  826203174 1,5,0,3,4,2,5,5,3,0
*/

function run(comp) {
  function combo(comp, operand) {
    switch (operand) {
      case 4:
        return comp.a;
      case 5:
        return comp.b;
      case 6:
        return comp.c;
      default:
        return operand;
    }
  }

  let a = comp.a;

  while (comp.i < comp.p.length) {
    let operator = comp.p[comp.i];
    let operand = comp.p[comp.i + 1];

    switch (operator) {
      case 0: // adv
        comp.a = Math.trunc(comp.a / 2 ** combo(comp, operand));
        break;
      case 1: // bxl
        comp.b ^= operand;
        break;
      case 2: // bst
        comp.b = combo(comp, operand) % 8;
        break;
      case 3: // jnz
        if (comp.a != 0) {
          comp.i = operand;
          continue;
        }
        break;
      case 4: // bxc
        comp.b ^= comp.c;
        break;
      case 5: // out
        let out = combo(comp, operand) % 8;
        if (out < 0) out += 8;
        //if (out < 0) return;
        //if (comp.p[comp.o.length] !== out) return;
        comp.o.push(out);
        break;
      case 6: // bdv
        comp.b = Math.trunc(comp.a / 2 ** combo(comp, operand));
        break;
      case 7: // cdv
        comp.c = Math.trunc(comp.a / 2 ** combo(comp, operand));
        break;
    }
    comp.i += 2;
  }

  //return comp.o.join(",");
}
