const file = require("path").basename(__filename);

// Star 1: 495972
// Star 2: 

parseData(`rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{

  function parseStep(step) {
    let split;
    if (step.indexOf("=") >= 0) {
      split = step.split("=");
      split[1] = parseInt(split[1]);
      return {
        id:     hash(split[0]),
        action: "=",
        label:  split[0],
        value:  split[1]
      }
    } else {
      split = step.split("-");
      return {
        id:    hash(split[0]),
        action: "-",
        label: split[0],
      }
    }
  }

  let steps = data.split(",").map(parseStep);
  
  const boxes = {};
  boxes.ids = [];
  boxes.get = function (id) {
    if (this[id]) return this[id];
    this.ids.push(id);
    let box = this[id] = [];
    box.remove = function (label) {
      let i = this.findIndex(b => b[0] == label);
      if (i >= 0) this.splice(i, 1);
    };
    box.insert = function (label, value) {
      let i = this.findIndex(b => b[0] == label);
      if (i >= 0) {
        this[i][1] = value;
      } else {
        this.push([label, value]);
      }
    };
    box.power = function (id) {
      let power = 0;
      for (let i = 0; i < this.length; i++) {
        power += (id+1)*(i+1)*this[i][1];
      }
      return power;
    };
    return box;
  };
  boxes.toString = function () {
    return this.ids.map(
      id => `Box ${id}: [${this[id]}]`
    ).join("\n");
  };
  boxes.power = function () {
    return this.ids.reduce(
      (total, id) => total + this[id].power(id)
    , 0);
  };

  steps.forEach(step => {
    switch (step.action){
      case '-':
        boxes.get(step.id).remove(step.label);
        break;
      case '=':
        boxes.get(step.id).insert(step.label, step.value);
        break;
    }
  });

  console.log(boxes.power());
}

function hash(str)
{
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }
  return hash;
}