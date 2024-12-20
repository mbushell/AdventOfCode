const inputFilePath = "day2.txt";

// Solutions
// Part 1: 224
// Part 2: 293

solve(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`);

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
  console.log(
    data.split("\n").reduce((count, report) => count + score(report), 0)
  );
}

function score(report)
{
  const levels = report.split(" ").map(n => parseInt(n));

  // Part 1: 224
  //return evalReport(levels);

  // Part 2: 293
  let score = evalReport(levels);
  if (!score) {
    for (var i = 0; i < levels.length; i++) {
      if (evalReport(levels.toSpliced(i, 1))) return 1;
    }
  }
  return score;
}

function evalReport(levels)
{
  const reportDir = (levels[1] - levels[0]) 
                      / Math.abs(levels[1] - levels[0]);
                      
  for (let i = 1; i < levels.length; i++)
  {
    let diff = levels[i] - levels[i-1];
    let absDiff = Math.abs(diff);
    if (absDiff < 1 || absDiff > 3 || diff / absDiff != reportDir)
      return 0;
  }
  
  return 1;
}