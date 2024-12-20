const fs = require('node:fs');

const test = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

function parseSchematic(data)
{
  let numbers = [];
  let symbols = {};

  data.split("\n").forEach((line, i) => {
    let value = "";
    for (let j = 0; j < line.length; j++)
    {
      if ("0123456789".indexOf(line[j]) >= 0) {
        value += line[j];
      } else {
        if (value) {
          numbers.push([i, j - value.length, j, parseInt(value)]);
          value = "";
        }
        if (line[j] != ".") {
          symbols[`${i},${j}`] = line[j];
        }
      }
    }
    if (value) {
      j = line.length;
      numbers.push([i, j - value.length, j, parseInt(value)]);
    }
  });

  /*
  // PARTS TOTAL
  // ===========
  let result = numbers.reduce((total, number) => {
    for (let i = number[0] - 1; i <= number[0] + 1; i++) {
      for (let j = number[1] - 1; j <= number[2]; j++) {
        if (symbols[`${i},${j}`]) return total + number[3];
      }
    }
    return total;
  }, 0);

  console.log(result);
  return;
  */

  /*
  // GEAR RATIOS
  // ===========
  */
  gears = {};
  numbers.forEach(number => {
    for (let i = number[0] - 1; i <= number[0] + 1; i++) {
      for (let j = number[1] - 1; j <= number[2]; j++) {
        const coords = `${i},${j}`;
        if (symbols[coords] == "*") {
          if (gears[coords]) {
            gears[coords].push(number[3]);
          } else {
            gears[coords] = [number[3]];
          }
        }
      }
    }
  })

  let total = Object.values(gears).reduce((total, gear) => {
    if (gear.length == 2) {
      return total + (gear[0] * gear[1]);
    } else {
      return total;
    }
  }, 0);
  console.log(total);  
}

/*
parseSchematic(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`);
return;
*/

fs.readFile('./day3-input.txt', 'utf8', (err, data) => {
  parseSchematic(data);
});