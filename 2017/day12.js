const file = require("path").basename(__filename);

function solve(data)
{
  let programs = {};
  data.split("\n").forEach(pipe => {
    let [i, ...nums] = pipe.match(/(\d+)/g).map(Number);
    programs[i] = nums;
  });

  function collect_group(id, group) {
    let program = programs[id];
    for (let p of program) {
      if (!group[p]) {
        group[p] = true;
        collect_group(p, group);
      }
    }
    programs[id] = null;
  }

  let group0 = { 0: true };
  collect_group(0, group0);

  console.log("Star 1:", Object.keys(group0).length);

  let groups = 1;
  let all = Object.keys(programs);
  for (let id of all) {
    if (programs[id] == null) continue;
    collect_group(id, { id: true });
    groups++;
  }

  console.log("Star 2:", groups);

}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);