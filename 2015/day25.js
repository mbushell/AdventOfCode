const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

// To continue, please consult the code grid in the manual.
// Enter the code at row 2947, column 3029.

function solve(data)
{
  let [row, col] = data.match(/(\d+)/g).map(n => parseInt(n));

  function *next_code() {
    let x = 1;
    let y = 1;
    let next_y = 2;
    let code = 20151125;
    while (true) {
      yield [x, y, code];
      x++;
      y--;
      if (y == 0) {
        x = 1;
        y = next_y++;
      }
      code = Number(BigInt(code * 252533) % 33554393n);
    }
  }

  for (let [x, y, code] of next_code()) {
    if (x == col && y == row) {
      console.log(code);
      return;
    }
  }
}