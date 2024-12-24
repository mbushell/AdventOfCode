const file = require("path").basename(__filename);

// Star 1: 57344080719736
// Star 2: 

class Wire {
  constructor(name) {
    this.name  = name;
    this.input  = null;
    this.outputs = [];
    this.value = 0;
  }
  signal(value) {
    this.value = value;
    for (let gate of this.outputs) {
      gate.update();
    }
  }
}

class Gate {
  constructor(type, a, b, c) {
    this.type  = type;
    this.a = a;
    this.b = b;
    this.c = c;
    a.outputs.push(this);
    b.outputs.push(this);
    c.input = this;

    this.x_in = {};
    this.y_in = {};
    this.z_out = {};
    this.levels = [];
  }
  update() {
    let u = this.a.value;
    let v = this.b.value;
    switch (this.type) {
      case "AND": this.c.signal(u & v); break;
      case "XOR": this.c.signal(u ^ v); break;
      case "OR":  this.c.signal(u | v); break;
    }
  }
}

function solve(data)
{
  let wires = {};
  function get_wire(name) {
    return wires[name] ??= new Wire(name);
  }

  let [inputs, gate_data] = data.split("\n\n");

  let gates = [];
  
  gate_data.split("\n").forEach(r => {
    let m = r.match(/^(\w+) (\w+) (\w+) -> (\w+)$/);
    let a = get_wire(m[1]);
    let b = get_wire(m[3]);
    let c = get_wire(m[4]);
    gates.push(new Gate(m[2], a, b, c));
  });

  let all_wires = Object.values(wires);
  let x_wires = all_wires.filter(w => w.name.match(/x\d\d/));
  let y_wires = all_wires.filter(w => w.name.match(/y\d\d/));
  let z_wires = all_wires.filter(w => w.name.match(/z\d\d/));
  x_wires.sort((a, b) => a.name.localeCompare(b.name));
  y_wires.sort((a, b) => a.name.localeCompare(b.name));
  z_wires.sort((a, b) => a.name.localeCompare(b.name));

  
  // Part 1: set input from data
  inputs.split("\n").forEach(r => {
    let [name, value] = r.split(": ");
    let wire = get_wire(name);
    wire.signal(parseInt(value));
  });
  

  function get_output(wires) {
    let value = 0n;
    for (let i in wires) {
      value |= BigInt(wires[i].value) << BigInt(i);
    }
    return value;
  }

  function get_output_str(wires) {
    let str = "";
    for (let i in wires) {
      str = wires[i].value + str;
    }
    return str;
  }

  function set_input(wires, decimal) {
    let binary = Number(decimal).toString(2);
    for (let i in wires) {
      wires[i].signal( i < binary.length
        ? parseInt(binary[binary.length - i - 1])
        : 0
      )
    }
  }
 
  function swap_output_wires(n1, n2) {
    let w1 = wires[n1];
    let w2 = wires[n2];
    let g1 = w1.input;
    let g2 = w2.input;
    w1.input = g2;
    w2.input = g1;
    g1.c = w2;
    g2.c = w1;
  }

  function test(a_in, b_in) {
    set_input(x_wires, a_in);
    set_input(y_wires, b_in);
    let a = get_output(x_wires);
    let b = get_output(y_wires);
    let c = get_output(z_wires);
    return [c, c == BigInt(a_in) + BigInt(b_in)];
  }
  
  function check(a, b) {
    let [c, is_correct] = test(a, b);
    if (!is_correct) {
      console.log(`FAILED!\n${a} + ${b} != ${c}`);
    } else {
      console.log(`PASSED!\n${a} + ${b} == ${c}`);
    }
  }

  let x_initial = get_output(x_wires);
  let y_initial = get_output(y_wires);
  console.log(get_output(z_wires));

  swap_output_wires('nbc', 'svm');
  swap_output_wires('fnr', 'z39');
  swap_output_wires('cgq', 'z23');
  swap_output_wires('kqk', 'z15');


  check(x_initial, y_initial);


  /*
  function trace_circuit()
  {
    // find z-descendants for each gate
    for (let z of z_wires) {
      let queue = [[z, 0]];
      while (queue.length > 0) {
        let [wire, level] = queue.pop();        
        let gate = wire.input;
        if (gate) {
          gate.levels.push(level);
          gate.z_out[z.name] = true;
          queue.push([gate.a, level +1]);
          queue.push([gate.b, level +1]);
        }
      }
    }
    // find x-ancestors for each gate
    for (let x of x_wires) {
      let queue = [x];
      while (queue.length > 0) {
        let wire = queue.pop();
        for (let gate of wire.outputs) {
          gate.x_in[x.name] = true;
          queue.push(gate.c);
        }
      }
    }
    // find y-ancestors for each gate
    for (let y of y_wires) {
      let queue = [y];
      while (queue.length > 0) {
        let wire = queue.pop();
        for (let gate of wire.outputs) {
          gate.y_in[y.name] = true;
          queue.push(gate.c);
        }
      }
    }
    for (let g of gates) {
      g.x_in  = Object.keys(g.x_in).map(s => parseInt(s.slice(1)));
      g.y_in  = Object.keys(g.y_in).map(s => parseInt(s.slice(1)));
      g.z_out = Object.keys(g.z_out).map(s => parseInt(s.slice(1)));
    }
  }


  trace_circuit();

  gates.sort((a, b) =>
    a.levels[a.levels.length-1] - b.levels[b.levels.length-1]);

  
  let gates_by_level = Object.groupBy(gates, g=> g.levels[g.levels.length-1]);
  

  for (let i = 0; i < Object.keys(gates_by_level).length; i++) {
    console.log("LEVEL", i, "====================================");
    gates_by_level[i].sort((a, b) => a.x_in.length - b.x_in.length);
    for (let g of gates_by_level[i]) {
      console.log(
        g.a.name, g.type, g.b.name, "->", g.c.name,
        g.levels[g.levels.length-1], g.x_in.length, g.x_in[g.x_in.length-1]);
    }
  }
  return;
  */
}

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);