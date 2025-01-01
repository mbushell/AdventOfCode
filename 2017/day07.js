const file = require("path").basename(__filename);

class Program {
  constructor(name) {
    this.name = name;
    this.weight = 0;
    this.parent = null;
    this.children = [];
    this._load = undefined;
  }
  load() {
    if (this._load == undefined) {
      this._load = this.weight;
      for (let child of this.children) {
        this._load += child.load();
      }
    }
    return this._load;
  }
  is_balanced() {
    if (this.children.length == 0) return true;
    let loads = {};
    for (let child of this.children) {
      loads[child.load()] = true;
    }
    return Object.keys(loads).length == 1;
  }
}

function solve(data)
{
  let programs = {};
  function get_program(name) {
    return programs[name] ??= new Program(name);
  }

  data.split("\n").forEach(line => {
    let [self, other] = line.split(" -> ");
    let [name, weight] = self.split(" ");
    let program = get_program(name);
    program.weight = Number(weight.slice(1,-1));
    if (other) {
      other.split(", ").forEach(subname => {
        let subprogram = get_program(subname);
        subprogram.parent = program;
        program.children.push(subprogram);
      })
    }
  });

  let base = Object.values(programs).find(p => p.parent == null);
  console.log("Star 1:", base.name);

  let queue = Object.values(programs)
    .filter(p => p.children.length == 0)
    .map(leaf => leaf.parent);

  while (queue.length > 0) {
    let program = queue.shift();
    if (program.seen) continue;

    if (!program.is_balanced()) {
      let children = program.children.sort((a, b) =>  a.load() - b.load());
      if (children[0].load() == children[1].load()) {
        children.reverse();
      }
      let diff = children[1].load() - children[0].load();
      console.log("Star 2:", children[0].weight + diff);
      break;
    }

    queue.push(program.parent);
    program.seen = true;
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);