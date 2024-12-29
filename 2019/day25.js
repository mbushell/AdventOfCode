const file = require("path").basename(__filename);

const IC = require("./intcode.js");
const rl = require("readline-sync");

function solve(data)
{
  let ic = new IC();
  ic.load(data);
  ic.start();

  ic.command = s => { 
    ic.clear_outputs();
    ic.input_str(s + "\n");
    let result = ic.output_str();
    ic.clear_outputs();
    return result;
  }

  const script = [
    "north",
    "take festive hat",
    "west",
    "take sand",
    "east",
    "east",
    "take prime number",
    "west",
    "south",   
    "east",
    "north",
    "take weather machine",
    "north",
    "take mug",
    "south",
    "south",
    "east",
    "north",
    "east",
    "east",
    "take astronaut ice cream",
    "west",
    "west",
    "south",
    "west",
    "west",
    "south",
    "south",
    "take mutex",
    "south",
    "take boulder",
    "east",
    "south",
  ];

  let result;
  for (let command of script) {
    result = ic.command(command);
  }
  
  pass_checkpoint(ic, "east");
  return

  /*
  while (ic.status == IC.AWAITING_INPUT) {
    let input = rl.question("Input:");

    if (input.slice(0, 2) == "cp") {
      pass_checkpoint(ic, input.slice(3));
      console.log();
    } else {
      switch (input) {
        case "n": input = "north";  break;
        case "s": input = "south";  break;
        case "e": input = "east";   break;
        case "w": input = "west";   break;
      }
      result = ic.command(input);
      console.log(result);
    }
  }
  */
}

function pass_checkpoint(ic, dir)
{
  let inv = ic.command("inv");
  let items = inv.match(/- (.+)\n/g).map(s => s.slice(2,-1));

  for (let item of items) {
    ic.command(`drop ${item}`);
  }

  for (let p of perms(items)) {
    for (let item of p) {
      ic.command(`take ${item}`);
    }
    let result = ic.command(dir);
    if (result.indexOf("ejected") == -1) {
      console.log("Success!", p.join(","));
      console.log(result);
      return;
    }
    for (let item of p) {
      ic.command(`drop ${item}`);
    }
  }

  for (let item of items) {
    ic.command(`take ${item}`);
  }
  console.log("CHECKPOINT FAILED!");
  console.log(ic.command("inv"));
}

function * perms(set) {
  for (let i = 0; i < (1 << set.length); i++) {
    let perm = [];
    for (let j in set) {
      if (i & (1 << j)) {
        perm.push(set[j]);
      }
    }
    yield perm;
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);