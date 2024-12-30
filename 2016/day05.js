const file = require("path").basename(__filename);

let md5 = require("md5");


function solve(data)
{
  let password1 = "";
  let password2 = ["", "", "", "", "", "", "", ""];
  let count = 0;
  for (let i = 0; count < 8; i++) {
    let hash = md5(`${data}${i}`);
    if (hash.slice(0, 5) != "00000") continue;
    if (password1.length < 8) {
      password1 += hash[5];
    }
    let sixth = hash.charCodeAt(5);
    if (sixth >= 48 && sixth <= 55) {
      if (password2[sixth-48] == "") {
        password2[sixth - 48] = hash[6];
        count++;
        console.log(`Hacking ${count}/8 complete...`);
      }
    }
  }
  console.log("Star 1:", password1);
  console.log("Star 2:", password2.join(""));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);