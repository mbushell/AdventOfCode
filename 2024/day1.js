const inputFilePath = "day1.txt";

// Solutions
// Part 1: 2164381
// Part 2: 20719933

const fs = require('node:fs');
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(getSimilarity(data));
});

function getDistance(data)
{
  const leftList = [];
  const rightList = [];
  data.split("\n").forEach(line => {
    var numbers = line.split("   ");
    if (numbers.length != 2) return;
    leftList.push(parseInt(numbers[0]));
    rightList.push(parseInt(numbers[1]));
  }); 

  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  let distance = 0;
  for (let i = 0; i < leftList.length; i++) {
    distance += Math.abs(rightList[i] - leftList[i]);
  }

  return distance;
}

function getSimilarity(data)
{
  const leftList = [];
  const rightCount = {};
  data.split("\n").forEach(line =>{
    var numbers = line.split("   ");
    if (numbers.length != 2) return;

    leftList.push(parseInt(numbers[0]));
    
    const number = parseInt(numbers[1]);
    if (rightCount[number]) {
      rightCount[number] += number;
    } else {
      rightCount[number] = number;
    }
  });
  
  
  let count = 0;
  leftList.forEach(number => 
    count += rightCount[number] ? rightCount[number] : 0);

  return count;
}
