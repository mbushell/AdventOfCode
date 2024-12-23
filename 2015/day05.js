const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function is_nice1(string) {
  const vowels = "aeiou";
  const bad_pairs = "ab|cd|pq|xy";
  let vowel_count = 0;
  let double_count = 0;
  for (let i = 0; i < string.length; i++) {
    if (vowels.indexOf(string[i]) >= 0) vowel_count++;
    if (i > 0) {
      if (string[i] == string[i-1]) double_count++;
      if (bad_pairs.indexOf(string[i-1]+string[i]) >= 0) return false;
    }
  }
  return vowel_count >= 3 && double_count >= 1;
} 

function is_nice2(string) {
  let pairs = 0;
  let repeats = 0;
  for (let i = 0; i < string.length - 2; i++) {
    let pair = string[i] + string[i+1];
    if (string.indexOf(pair, i+2) >= 0) pairs++;
    if (string[i] == string[i+2]) repeats++;
  }
  return pairs > 0 && repeats > 0;
}


function solve(data) {
  let total = 0;
  data.split("\n").forEach(string => {
    if (is_nice1(string)) total++;
  });
  console.log(total);
 
  total = 0;
  data.split("\n").forEach(string => {
    if (is_nice2(string)) total++;
  });
  console.log(total);
}