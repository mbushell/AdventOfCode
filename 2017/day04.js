const file = require("path").basename(__filename);

function solve(data)
{
  function count(phrases, allow_anagrams) {
    return phrases.reduce((total, phrase) => {
      let words = {};
      for (let word of phrase) {
        if (!allow_anagrams) {
          word = word.split("").sort().join("");
        }
        if (words[word]) return total;
        words[word] = true;
      }
      return total + 1;
    }, 0);
  }

  let phrases = data.split("\n").map(p => p.split(" "));
  console.log("Star 1:", count(phrases, true));
  console.log("Star 2:", count(phrases, false));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);