const fs = require('node:fs');


//Time:        35     69     68     87
//Distance:   213   1168   1086   1248

function solveRace(time, record)
{
  let ways = 0;
  const a = 1; // mm/ms^2
  for (let holdTime = 1; holdTime < time; holdTime++) {
    let timeLeft = time - holdTime;
    let distance = holdTime * (timeLeft);
    if (distance > record) ways++;
  }
  return ways;
}

function parseData(data)
{
  const [times, dists] = data.trim().split("\n").map(
    line => line.split(":")[1].trim().split(/\s+/).map(v => parseInt(v)));
  let result = 1;
  for (let i = 0; i < times.length; i++) {
    result *= solveRace(times[i], dists[i]);
  }
  return result;
}

// Part 2
// ======

console.log(parseData(`Time:        41968894
Distance:   214178911271055`));
return;


/*
console.log(parseData(`Time: 71530
Distance:  940200`));
return;
*/

// Part 1
// ======
fs.readFile('./day6-input.txt', 'utf8', (err, data) => {
  console.log(parseData(data));
});