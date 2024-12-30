const file = require("path").basename(__filename);

function solve(data)
{
  let bots = {};
  let swaps = {};
  let output = {};

  data.split("\n").forEach(line => {
    if (line.slice(0, 5) == "value") {
      let nums = [...line.matchAll(/\d+/g)].map(Number);
      bots[nums[1]] ??= [];
      bots[nums[1]].push(nums[0]);
    } else {
      let m = line.match(/(\d+) .* ((output|bot) (\d+)) .* ((output|bot) (\d+))/);
      swaps[m[1]] = [[m[3], Number(m[4])], [m[6], Number(m[7])]];
    }
  });
  
  function give(value, to) {
    let target = to[0] == 'bot' ? bots : output;
    target[to[1]] ??= [];
    target[to[1]].push(value);
  }

  let done = false;
  while (!done) {
    done = true;
    Object.entries(bots).forEach(([id, nums]) => {
      if (nums.length != 2) return;
      let [low, high] = nums.sort((a,b) => a - b);
      if (low == 17 && high == 61) {
        console.log("Star 1:", id);
      }
      give(low, swaps[id][0]);
      give(high, swaps[id][1]);
      bots[id] = [];
      done = false;
    });
  }

  console.log("Star 2:", output[0]*output[1]*output[2]);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);