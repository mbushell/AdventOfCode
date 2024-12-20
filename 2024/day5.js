const inputFilePath = "day5.txt";

// Solutions
// Part 1: 6034
// Part 2: 6305

solve(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`);


const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  solve(data);
});


function solve(data)
{
  const lines = data.split("\n");
  const index = lines.indexOf("");
  const ruleString = lines.slice(0, index);
  const updates = lines.slice(index + 1).map(
    update => update.split(",").map(n => parseInt(n))
  );
  
  let valid = 0;
  let invalid = 0;
  updates.forEach(update => {
    if (sortUpdate(update, ruleString)) {
      valid += update[(update.length+1)/2 - 1];
    } else {
      invalid += update[(update.length+1)/2 - 1];
    }
  });

  console.log(valid);   // Star 1
  console.log(invalid); // Star 2

}


function sortUpdate(update, ruleString)
{
  let valid = true;
  let swap = true;
  while (swap)
  {
    swap = false;
    for (let i = 0; i < update.length; i++) {
      for (let j = i+1; j < update.length; j++) {
        if (j == i) continue;
        let p1 = update[i];
        let p2 = update[j];
        if (ruleString.indexOf(`${p2}|${p1}`) > 0) {
          update[i] = p2;
          update[j] = p1;
          swap = true;
          valid = false;
        }
      }
    }
  }
  return valid;
}