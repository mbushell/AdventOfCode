const file = require("path").basename(__filename);

// 22122816

function solve(data)
{
  function * pattern(repeat) {
    let base = [0, 1, 0, -1];
    let i = 0;
    let reps = 1;
    while (true) {
      if (reps >= repeat) {
        reps = 0;
        i = (i+1)%4;
      }
      yield base[i];
      reps++;
    }
  }

  function phase_part1(input) {
    let output = Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let p = pattern(i+1, 0);
      let v = input.reduce((sum, n) => sum + n*p.next().value, 0);
      output[i] = Math.abs(v) % 10;
    }
    return output;
  }

  function phase_part2(input) {
    let v = 0;
    let output = Array(input.length);
    for (let j = 0; j < input.length; j++) {
      v += input[j];
    }
    output[0] = v % 10;

    for (let i = 1; i < input.length; i++) {
      output[i] = (((output[i-1] - input[i-1]) % 10) + 10) % 10;
    }
    return output;
  }
  
  function * repeat(array, times, offset) {
    let length = (array.length * times) - offset;
    for (let i = 0; i < length; i++) {
      yield [i, array[(i+offset) % array.length]];
    }
  }

  let numbers = data.split("").map(n => parseInt(n));
  let offset  = Number(numbers.slice(0, 7).join(""));
  let reps    = 10000;
  let length  = numbers.length * reps - offset;

  let head = numbers;
  let tail = Array(length);
  for (let [i,n] of repeat(numbers, reps, offset)) {
    tail[i] = n;
  }


  for (let i = 0; i < 100; i++) {
    head = phase_part1(head, 0);
    tail = phase_part2(tail);
  }

  console.log("Star 1:", head.slice(0, 8).join(""));
  console.log("Star 2:", tail.slice(0, 8).join(""));
  
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);