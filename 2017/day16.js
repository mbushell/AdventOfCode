const file = require("path").basename(__filename);

function solve(data)
{
  function swap(line, i, j) {
    let t = line[i];
    line[i] = line[j];
    line[j] = t;
  }

  function dance(line) {
    data.split(",").forEach(move => {
      let nums = move.match(/\d+/g);
      if (nums) nums = nums.map(Number);
      switch (move[0]) {
        case "s":
          line = [...line.slice(-nums[0]), ...line.slice(0, -nums[0])];
          break;
        case "x":
          swap(line, nums[0], nums[1]);
          break;
        case "p":
          swap(line, line.indexOf(move[1]), line.indexOf(move[3]));
          break;
      }
    });
    return line;
  }

  let line = "abcdefghijklmnop".split("");
  console.log("Star 1:", dance(line).join(""));
  
  line = "abcdefghijklmnop".split("");
  let seen = {};
  let repeat = 0;
  for (; true; repeat++) {
    if (seen[line]) break;
    seen[line] = true;
    line = dance(line);
  }

  let leftover = 1000000000 % repeat;

  line = "abcdefghijklmnop".split("");
  for (let i = 0; i < leftover; i++) {
    line = dance(line);
  }
  console.log("Star 2:", line.join(""));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);