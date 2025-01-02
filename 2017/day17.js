const file = require("path").basename(__filename);

function solve(data)
{
  let step_size = Number(data);

  function star1(times) {
    let i = 0;
    let buffer = [0];
    for (let t = 1; t <= times; t++) {
      i = ((i + step_size) % buffer.length) + 1;
      buffer.splice(i, 0, t);
    }
    return buffer[i+1];
  }
  
  console.log("Star 1:", star1(2017));


  function star2(times) {
    let i = 0;
    let value = 0;
    let buffer_length = 1;
    for (let t = 1; t <= times; t++) {
      i = ((i + step_size) % buffer_length) + 1;
      if (i == 1) value = t;
      buffer_length++;
    }
    return value;
  }

  console.log("Star 2:", star2(50000000));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);