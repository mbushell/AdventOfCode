const file = require("path").basename(__filename);

const IC = require("./intcode.js");

class NIC {
  constructor() {
    this.inbox  = [];
    this.outbox = [];
    this.NAT    = null;
  }
  tick() {
    this.outbox = this.inbox;
    this.inbox  = [];
  }
  send(from, to, value) {
    let packet = { from: from, to: to, value: value };
    if (to == 255) {
      this.NAT = packet;
    } else {
      this.inbox.push(packet);
    }
  }
  *read(id) {
    let packets_read = 0;
    for (let packet of this.outbox) {
      if (packet.to == id) {
        yield packet.value;
        packets_read++;
      }
    }
    if (packets_read == 0) {
      yield null;
    }
  }
}

function solve(data)
{
  let nic = new NIC();

  const num_pcs = 50;
  let pcs = Array(num_pcs);

  for (let id = 0; id < num_pcs; id++) {
    let p = pcs[id] = new IC();
    p.load(data);
    p.output = value => {
      p.outputs.push(value);
      if (p.outputs.length == 3) {
        nic.send(id, p.outputs[0], {x: p.outputs[1], y: p.outputs[2]});
        p.outputs = [];
      }
    };
    p.start();
    p.input(id);
  }

  let nats = {};

  for (let t = 0; t < 1000; t++) {    
    if (t > 0 && nic.outbox.length == 0) {
      let value = nic.NAT.value;
      nats[value.y] ??= 0;
      nats[value.y]++;
      if (Object.keys(nats).length == 1) {
        console.log("Star 1", value.y, `t=${t}`);
      }
      if (nats[value.y] == 2) {
        console.log("Star 2", value.y, `t=${t}`);
        break;
      }
      nic.send(255, 0, value);
    } else {
      for (let id = 0; id < pcs.length; id++) {
        for (let packet of nic.read(id)) {
          if (packet == null) {
            pcs[id].input(-1);
            break;
          }
          idle = false;
          pcs[id].input(packet.x);
          pcs[id].input(packet.y);
        }
      }
    }

    nic.tick();
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);