const file = require("path").basename(__filename);

function solve(data)
{
  function next_row(row) {
    let next = "";
    for (let i = 0; i < row.length; i++) {
      let L = i > 0 ? row[i-1] : '.';
      let C = row[i];
      let R = i < row.length-1 ? row[i+1] : '.';
      if ((L == '^' && C == '^' && R != '^') ||
          (L != '^' && C == '^' && R == '^') ||
          (L == '^' && C != '^' && R != '^') ||
          (L != '^' && C != '^' && R == '^'))
      {
        next += '^';
      } else {
        next += '.';
      }
    }
    return next;
  }

  function calc(num_rows) {
    let rows = [data];
    let prev = data;
    while (rows.length < num_rows) {
      prev = next_row(prev);
      rows.push(prev);
    }  
    let total = 0;
    rows.forEach(row => {
      for (let c of row) {
        if (c == '.') total++;
      }
    });
    return total;
  }
  
  console.log("Star 1:", calc(40));
  console.log("Star 2:", calc(400000));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);