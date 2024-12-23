const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let wires = {};
  let queue = [];

  function get_wire(name) {
    return wires[name] ??= {
      name: name,
      source: null,
      dests: [],
      value: null,
    };
  }

  function add_source(name, source) {
    let wire = get_wire(name);
    if (source.length > 1) {
      wire.source = source;
      for (let i = 1; i < source.length; i++) {
        let src_name = source[i];
        if (!isNaN(src_name)) {
          source[i] = parseInt(src_name);
        } else {
          let src_wire = get_wire(source[i]);
          src_wire.dests.push(wire);
          source[i] = src_wire;
        }
      }
    } else {
      wire.source = [];
      wire.value = source[0];
      queue.push(wire);
    }
  }

  data.split("\n").forEach(line => {
    let match;
    if (match = line.match(/^(\d+) -> (\w+)$/)) {
      add_source(match[2], [parseInt(match[1])]);
    } else if (match = line.match(/^(\w+) -> (\w+)$/)) {
      add_source(match[2], ["CPY", match[1]]);
    } else if (match = line.match(/^NOT (\w+) -> (\w+)$/)) {
      add_source(match[2], ["NOT", match[1]]);
    } else if (match = line.match(/^(\w+) (\w+) (\w+) -> (\w+)$/)) {
      add_source(match[4], [match[2], match[1], match[3]]);
    }
  });
  
  function propogate_value(wire) {
    wire.dests.forEach(dest => {
      let i = dest.source.indexOf(wire);
      dest.source[i] = wire.value;
      if (dest.source.map(s => isNaN(s)).filter(x => x).length == 1) {
        queue.push(dest);
      }
    });
  }

  while (queue.length > 0) {
    let wire = queue.pop();
    switch (wire.source.length) {
      case 0:
        propogate_value(wire);
        break;
      case 2:
        switch (wire.source[0]) {
          case "CPY": wire.value = wire.source[1];  break;
          case "NOT": wire.value = ~wire.source[1]; break;
        }
        propogate_value(wire);
        break;
      case 3:
        switch (wire.source[0]) {
          case "AND":    wire.value = wire.source[1] & wire.source[2]; break;
          case "OR":     wire.value = wire.source[1] | wire.source[2]; break;
          case "LSHIFT": wire.value = wire.source[1] << wire.source[2]; break;
          case "RSHIFT": wire.value = wire.source[1] >> wire.source[2]; break;
        }
        propogate_value(wire);
        break;
    }
  }

  Object.values(wires).forEach(wire => {
    if (wire.value == null) console.log(wire.name);
  })

  console.log(get_wire('a').value);  
}