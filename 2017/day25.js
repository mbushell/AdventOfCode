const file = require("path").basename(__filename);

function solve(data)
{
  
  let [intro, ...state_info] = data.split("\n\n");
  let [start, steps] = intro.split("\n");
  start = start[start.length-2];
  steps = Number(steps.split(" ")[5]);

  let states = {};
  state_info.forEach(lines => {
    lines = lines.split("\n");
    let name = lines[0][lines[0].length-2];
    let dir0 = lines[3].split(" ");
    let dir1 = lines[7].split(" ");
    states[name] = {
      '0': {
        write: lines[2][lines[2].length-2],
        move:  dir0[dir0.length-1][0] == "l" ? -1 : 1,
        next:  lines[4][lines[4].length-2],
      },
      '1': {
        write: lines[6][lines[6].length-2],
        move:  dir1[dir1.length-1][0] == "l" ? -1 : 1,
        next:  lines[8][lines[8].length-2],
      },
    }
  });
  
  let tm = {
    tape:   Array(100000).fill('0'),
    state:  start,
    cursor: 50000,
  }

  for (let i = 0; i < steps; i++) {
    let s = states[tm.state][tm.tape[tm.cursor]];
    tm.tape[tm.cursor] = s.write;
    tm.cursor += s.move;
    tm.state = s.next;
  }

  let checksum = tm.tape.filter(c => c== 1);
  console.log("Star 1:", checksum.length);
  console.log("Star 2: free!");
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);