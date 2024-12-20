const file = require("path").basename(__filename);

// Star 1: 856482136
// Star 2: >= 10157321

/*
parseData(`broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`);


parseData(`broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`);
*/

let lows    = 0;
let highs   = 0;
let presses = 0;

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);

function parseData(data)
{
  const modules = {};
  const queue   = [];

  function send(module, pulse) {
    module.dest.forEach(name => {
      queue.push([module.name, name, pulse]);
    });
  }

  data.split("\n").map(mod => {
    let [name, dest] = mod.split(" -> ");
    if (name == "broadcaster") {
      return {
        type: "b",
        name: "broadcaster",
        dest: dest.split(", "),
        receive: function (source, pulse) {
          send(this, pulse);
        }
      }
    } else if (name[0] == "%") {
      return {
        type: "%",
        name: name.slice(1),
        dest: dest.split(", "),
        state: "off",
        receive: function (source, pulse) {
          if (pulse == "high") return;
          if (this.state == "off") {
            this.state = "on";
            send(this, "high");
          } else {
            this.state = "off";
            send(this, "low");
          }
        }
      }
    } else {
      return {
        type: "&",
        name: name.slice(1),
        dest: dest.split(", "),
        inputs: [],
        values: {},
        receive: function (source, pulse) {
          this.values[source] = pulse;
          for (let i = 0; i < this.inputs.length; i++) {
            if (this.values[this.inputs[i]] == "low") {
              send(this, "high");
              return;
            }
          }
          send(this, "low");
        }
      }
    }
  }).map(module => {
    modules[module.name] = module;
    return module;
  }).forEach(module => {
    module.dest.forEach(name => {
      let dst = modules[name];
      if (!dst) {
        modules[name] = {
          type: "dummy",
          name: name,
          dest: [],
          state: false,
          receive: function (source, pulse) {
            if (pulse == "low")  {
              console.log("GOT low", presses);
              this.state = true;
            }
          },
        };
      }
      else if (dst.type == "&") {
        dst.inputs.push(module.name);
        dst.values[module.name] = "low";
      }
    })
  });

  function pushButton()
  {
    queue.push(["button", "broadcaster", "low"]);
  
    while (queue.length > 0) {
      let act = queue.shift();

      if (act[2] == "low") {
        lows++;
      } else {
        highs++;
      }

      //console.log(`${act[0]} -${act[2]}-> ${act[1]}`);
      modules[act[1]].receive(act[0], act[2]);
    }
  }

  // Part 1
  /*
  for (; presses < 1000; presses++) {
    pushButton();
  }
  console.log(lows * highs);
  */


  // Part 2
  while (true) {
    pushButton();
    presses++;
    if (modules["rx"].state) {
      console.log(presses);
      break;
    }
    //console.log(presses);
  }
}