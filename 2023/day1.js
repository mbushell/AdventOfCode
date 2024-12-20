function isDigit(chr) {
  return "0123456789".indexOf(chr) >= 0;
}

const numberWords = [
  "zero", "one", "two", "three", "four", 
  "five", "six", "seven", "eight", "nine"
];

function parseWord(i, line)
{
  let str = "";
  let words = [...numberWords];
  while (i < line.length && words.length > 0)
  {
    if (isDigit(line[i])) {
      return [i-1, -1];
    }
    str += line[i++];
    newWords = [];
    for (let word of words) {
      if (word == str) {
        return [i - (str.length - 1), numberWords.indexOf(str)];
      }
      else if (word.indexOf(str) == 0) {
        newWords.push(word);
      }
    }

    if (newWords.length == 0) {
      words = [...numberWords];
      i -= str.length - 1;
      str = "";
    } else {
      words = newWords;
    }
  }

  return [i, -1];
}

function firstLast(line)
{ 
  let firstDigit = null;
  let lastDigit = null;  
  for (let i = 0; i < line.length; i++)
  {
    if (isDigit(line[i])) {
      firstDigit ??= line[i]
      lastDigit = line[i];
    }
    else
    // DAY 2:
    { 
      let digit;
      [i, digit] = parseWord(i, line);
      if (digit > -1) {
        firstDigit ??= digit;
        lastDigit = digit;
      }
    }
  }
  return `${firstDigit}${lastDigit}`
}

const fs = require('node:fs');

fs.readFile('./day1-input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(
    data.split("\n")
        .reduce((total, value) => total + parseInt(firstLast(value)), 0));
});