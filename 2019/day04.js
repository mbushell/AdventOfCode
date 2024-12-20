const file = require("path").basename(__filename);

// Star 1: 475
// Star 2: 297

parseData(`372304-847060`);
return;

require("node:fs").readFile(file.replace(".js", ".txt"), "utf8", (err, data) =>
  parseData(data.trim())
);

function parseData(data) {
  let [low, high] = data.split("-").map(n => parseInt(n));


  let valid = 0;

  function digit(pw) {
    let i = pw.length;
    if (i == 6) {
      let accept = false;
      for (let j = 0; j < 6-1; j++) {
        if (pw[j] == pw[j+1]) {
          if (pw[j-1] === pw[j]) continue;
          if (pw[j+2] === pw[j]) continue;
          accept = true;
          break;
        }
      }
      if (!accept) return;      
      let value = parseInt(pw.join(""));
      if (value >= low && value <= high) {
        console.log(pw);
        valid++;
      }
      return;
    }
    let d = i == 0 ? 0 : pw[i-1];
    for (; d <= 9; d++) {
      digit([...pw, d]);
    }
  }

  digit([]);

  console.log(valid);

}
