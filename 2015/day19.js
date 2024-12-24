const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  let [replacements, molecule] = data.split("\n\n");
  replacements = replacements.split("\n").map(r => r.split(" => "));

  let goal = "e";
  let seen = {};
  let queue = [[molecule, 0, 0]];

  while (queue.length > 0) {
    let [str, scr, steps] = queue.pop();

    for (let repl of replacements) {
      let i = -1;
      while ((i = str.indexOf(repl[1], i + 1)) != -1) {
        let new_str = str.slice(0, i) + repl[0]
                    + str.slice(i + repl[1].length);
    
        if (new_str == goal) {
          console.log("FOUND!", steps + 1);
          queue = [];
          break;
        } else if (!seen[new_str]) {
          seen[new_str] = true;
          queue.push([new_str, new_str.length, steps+1]);
        }
      }
    }

    queue.sort((a, b) => b[1] - a[1])
  }
}

function solve1(data)
{
  let [replacements, molecule] = data.split("\n\n");
  replacements = replacements.split("\n").map(r => r.split(" => "));
 
  let creations = {};
  replacements.forEach(repl => {
    let i = -1;
    while ((i = molecule.indexOf(repl[0], i + 1)) != -1) {
      let new_molecule = molecule.slice(0, i)
                + repl[1]
                + molecule.slice(i + repl[0].length);
      
      creations[new_molecule] ??= 0;
      creations[new_molecule]++;
    }
  });  
  console.log(Object.keys(creations).length);
}