const file = require("path").basename(__filename);

function solve(data)
{
  let number_of_elves = Number(data);

  let star1_formula = x => 2*(x - 2**Math.floor(Math.log2(x))) + 1;

  console.log("Star 1:", star1_formula(number_of_elves));

  // TODO: this isn't correct for all inputs?
  let star2_formula = x => x - 3**Math.floor(Math.log2(x)/Math.log2(3)) + 1;

  console.log("Star 2:", star2_formula(number_of_elves-1));
}

function star1(length) {
  let first = { id: 1, next : null };
  let prev  = first;
  for (let i = 2; i <= length; i++) {
    let elf = { id: i, next: null }
    if (prev) prev.next = elf;
    prev = elf;
  }
  prev.next = first;

  let elf = first;
  let remaining = length;
  while (remaining > 1) {
    elf = elf.next = elf.next.next;
    remaining--;
  }
  return elf.id;
}

function star2(length) {
  let first = { id: 1, next : null };
  let prev  = first;
  for (let i = 2; i <= length; i++) {
    let elf = { id: i, next: null }
    if (prev) prev.next = elf;
    prev = elf;
  }
  prev.next = first;

  let elf = first;
  let remaining = length;
  while (remaining > 1) {
    let offset = Math.floor(remaining / 2);
    let start = elf;
    while (offset > 1) {
      elf = elf.next;
      offset--;
    }
    //console.log(elf.next.id, "eliminated");
    elf.next = elf.next.next;
    elf = start.next;
    remaining--;
  }
  return elf.id;
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);