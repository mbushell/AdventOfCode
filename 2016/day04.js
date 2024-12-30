const file = require("path").basename(__filename);

function calc_checksum(name) {
  let count = {};
  name.split("-").forEach(part => {
    for (let letter of part.split("")) {
      count[letter] ??= 0;
      count[letter]++;
    }
  });
  let most_common = Object.entries(count).sort((a, b) => {
    if (a[1] == b[1]) {
      return a[0].localeCompare(b[0])
    } else {
      return b[1] - a[1];
    }
  });
  return most_common.slice(0, 5).map(x => x[0]).join("");
}

let ASCII_a = "a".codePointAt(0);
function decrypt(name, id) {
  return name.split("-").map(part => part.split("").map(c =>
    String.fromCharCode((((c.charCodeAt(0) - ASCII_a) + id) % 26) + ASCII_a)
  ).join("")).join(" ");
}

function solve(data)
{
  let total = 0;
  let north_pole = 0;
  data.split("\n").forEach(line => {
    let m = line.match(/^([\D-?]+)-(\d+)\[(\w+)\]$/);
    let name = m[1];
    let id = Number(m[2]);
    let checksum = m[3];
    if (calc_checksum(name) == checksum) {
      total += id;
      let actual_name = decrypt(name, id);
      if (actual_name.indexOf("north") != -1) {
        north_pole = id;
      }
    }
  });
  console.log("Star 1:", total);
  console.log("Star 2:", north_pole);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);