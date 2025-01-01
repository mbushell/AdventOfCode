const file = require("path").basename(__filename);

function solve(data)
{
  let steps = data.split("\n");
  console.log("Star 1:", scramble("abcdefgh", steps));

  function * words(letters, word) {
    if (letters.length == 0) yield word.join("");
    for (let i = 0; i < letters.length; i++) {
      let next_letters = [...letters];
      let next_word = [...word, letters[i]];
      next_letters.splice(i, 1);
      yield * words(next_letters, next_word);
    }
  }

  let letters = "abcdefgh".split("");
  let all_words = words(letters, []);
  for (let word of all_words) {
    if (scramble(word, steps) == "fbgdceah") {
      console.log("Star 2:", word);
      break;
    }
  }
}

function parse_step(step) {
  let nums = step.match(/(\d+)/g);
  let chrs = step.match(/letter (\w)/g);
  if (nums) nums = nums.map(Number);
  if (chrs) chrs = chrs.map(c => c.slice(-1));
  return [nums, chrs];
}

function scramble(word, steps)
{
  word = word.split("");
  for (let step of steps) {
    let [nums, chrs] = parse_step(step);
    if (step.indexOf("swap position") == 0) {
      word = swap(word, nums[0], nums[1]);
    }
    else if (step.indexOf("swap letter") == 0) {
      word = swap(word, word.indexOf(chrs[0]), word.indexOf(chrs[1]));
    }
    else if (step.indexOf("rotate left") == 0) {
      word = rotate(word, -nums[0]);
    }
    else if (step.indexOf("rotate right") == 0) {
      word = rotate(word, nums[0]);
    }
    else if (step.indexOf("rotate based") == 0) {
      let i = word.indexOf(chrs[0]);
      word = rotate(word, i + (i >= 4 ? 2 : 1));
    }
    else if (step.indexOf("reverse") == 0) {
      reverse(word, nums[0], nums[1]);
    }
    else if (step.indexOf("move") == 0) {
      word = move(word, nums[0], nums[1]);
    }
  }
  return word.join("");
}

function swap(word, i, j) {
  let tmp = word[i];
  word[i] = word[j];
  word[j] = tmp;
  return word;
}

function rotate(word, n) {
  if (n < 0) n += word.length;
  let i = (word.length - n) % word.length;
  word = [...word.slice(i), ...word.slice(0, i)];
  return word;
}

function reverse(word, i, j) {
  let subword = word.slice(i, j+1);
  word.splice(i, subword.length, ...subword.toReversed());
  return word;
}

function move(word, i, j) {
  let letter = word[i];
  if (j < i) {
    word.splice(j, 0, letter);
    word.splice(i+1, 1);
  } else {
    word.splice(j+1, 0, letter);
    word.splice(i, 1);
  }
  return word;
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);