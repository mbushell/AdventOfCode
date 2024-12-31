const file = require("path").basename(__filename);

const md5 = require("md5");

function solve(data)
{
  function hash(str) {
    for (let i = 0; i <= 2016; i++) {
      str = md5(str);
    }
    return str;
  }

  //data = "abc";

  let hashes = [];
  let found = 0;
  for (let i = 0; true; i++) {
    hashes.push(hash(`${data}${i}`));

    if (i > 1000) {
      let j = i - 1000;
      let key = hashes[j];
      let match = key.match(/(\w)\1\1/);
      if (match) {
        let five = match[1].repeat(5);
        for (let k = j+1; k < j+1001; k++) {
          if (hashes[k].indexOf(five) != -1) {
            found++;
            console.log(`Found ${found}: ${j} ${hashes[j]}`);
            break;
          }
        }
        if (found == 64) return;
      }
    }
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);