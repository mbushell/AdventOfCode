const file = require("path").basename(__filename);

function solve(data)
{
  let scanners = {};
  let maxDepth = -1;
  data.split("\n").forEach(line => {
    let [depth, range] = line.split(": ").map(Number);
    scanners[depth] = {
      depth: depth,
      range: range,
      position: 0,
      direction: 1,
    };
    maxDepth = Math.max(maxDepth, depth);
  });

  console.log("Star 1:", run(scanners, maxDepth, 0, false)[1]);

  let s_list = Object.values(scanners);
  let start_from = 3000000;
  for (let t = start_from; true; t++) {
    let count = 0;
    for (let s of s_list) {
      let p = ((t + s.depth) % ((s.range-1)*2));
      if (p != 0) count++;
    }
    if (count == s_list.length) {
      console.log("Star 2:", t)
      break;
    }
  }  
  
  /*
  let delay = 1;
  while (run(layers, maxDepth, delay, true)[0]) {
    delay++;
  }
  console.log("Star 2:", delay);
  */
}

function reset_scanners(scanners) {
  for (let s of Object.values(scanners)) {
    s.position = 0;
    s.direction = 1;
  }    
}

function move_scanners(scanners) {
  Object.values(scanners).forEach(s => {
    s.position += s.direction;
    if (s.direction > 0) {
      if (s.position == s.range - 1) {
        s.direction = -1;
      }
    } else {
      if (s.position == 0) {
        s.direction = 1;
      }
    }
  });
}

function run(scanners, maxDepth, delay, giveUpOnCaught)
{
  reset_scanners(scanners);
  
  let position = -1;
  let severity = 0;
  let caught = false;

  while (delay > 0) {
    move_scanners(scanners);
    delay--;
  }

  while (position < maxDepth)
  {
    position++;
    
    if (scanners[position] && scanners[position].position == 0) {
      severity += scanners[position].depth * scanners[position].range;
       caught = true;
       if (giveUpOnCaught) return [true, Infinity];
    }
    
    move_scanners(scanners);
  }

  return [caught, severity];
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);