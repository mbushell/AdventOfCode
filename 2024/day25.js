const file = require("path").basename(__filename);

function solve(data)
{
  let keys  = [];
  let locks = [];
  let h, w;

  data.split("\n\n").forEach(item => {
    let rows = item.split("\n");
    h ??= rows.length;
    w ??= rows[0].length;
    let lengths = Array(w).fill(0);
    for (let col = 0; col < rows[0].length; col++) {
      for (let row = 0; row < rows.length; row++) {
        if (rows[row][col] == '#') {
          lengths[col]++;
        }
      }
    }
    if (rows[0][0] == '#') {
      locks.push(lengths);
    } else {
      keys.push(lengths);
    }
  });
  
  let total = 0;
  for (let lock of locks) {
    for (let key of keys) {
      let fits = true;
      for (let i = 0; i < w; i++) {
        if (lock[i] + key[i] > h) {
          fits = false;
          break;
        }
      }
      if (fits) total++;
    }
  }

  console.log(total);
}


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);