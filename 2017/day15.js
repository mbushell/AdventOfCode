const file = require("path").basename(__filename);

function solve(data)
{
  let [sa, sb] = data.split("\n").map(line => 
    Number(line.split(" ").slice(-1)[0])
  );

  function * generator(start, factor, multiple) {
    let prev = start;
    while (true) {
      let next = (prev*factor) % 2147483647;
      if (next % multiple == 0) {
        yield next & 65535;
      }
      prev = next;
    }
  }

  function judge(a, b, times) {
    let matches = 0;
    for (let j = 0; j < times; j++) {
      if (a.next().value == b.next().value) matches++;
    }
    return matches;
  }

  let a1 = generator(sa, 16807, 1);
  let b1 = generator(sb, 48271, 1);
  console.log("Star 1:", judge(a1, b1, 40000000));

  let a2 = generator(sa, 16807, 4);
  let b2 = generator(sb, 48271, 8);
  console.log("Star 2:", judge(a2, b2, 5000000));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);