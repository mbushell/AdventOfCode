const file = require("path").basename(__filename);

function decompress(data, recursive) {
  if (data.indexOf("(") == -1) return data.length;
  
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] == '(') {
      let j = i + 1;
      while (data[i] != 'x') i++;
      let k = i + 1;
      while (data[i] != ')') i++;
      let len = Number(data.slice(j, k-1));
      let rep = Number(data.slice(k, i));
      if (recursive) {
        let sub = data.slice(i+1, i+len+1);
        total += decompress(sub, true)*rep;
      } else {
        total += len*rep;
      }
      i = i+len;
    } else {
      total++;
    }
  }
  return total;
}


function solve(data) {
  console.log("Star 1:", decompress(data, false));
  console.log("Star 2:", decompress(data, true));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);