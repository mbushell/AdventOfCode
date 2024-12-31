const file = require("path").basename(__filename);

function solve(data)
{
  function fill(str) {
    return `${str}0${str.split("").toReversed().join("")
      .replaceAll("0", "X")
      .replaceAll("1", "0")
      .replaceAll("X", "1")}`;
  }

  function checksum(str) {
    let sum = "";
    for (let i = 0; i < str.length - 1; i += 2) {
      sum += str[i] == str[i+1] ? "1" : "0";
    }
    return sum.length % 2 == 0 ? checksum(sum) : sum;
  }

  function run(data, disk_size, report) {
    while (data.length < disk_size) {
      data = fill(data);
      if (report) {
        let pc = data.length/disk_size*100;
        if (pc > 1) {
          console.log(`Generating data: ${pc.toFixed(0)}% complete...`);
        }
      }
    }
    data = data.slice(0, disk_size);
    console.log("Calculating checksum...");
    return checksum(data);
  }

  console.log("Star 1:", run(data, 272, false));
  console.log("Star 2:", run(data, 35651584, true));

}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);