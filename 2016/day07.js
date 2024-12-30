const file = require("path").basename(__filename);

const words_regex = /(?<!\[\w*)(\w+)(?!\w*\])/g;
const hyper_regex = /\[(\w+)\]/g;

function tls(ip) {
  const abba_regex = /(\w)(?!\1)(\w)\2\1/;
  let hypes = ip.match(hyper_regex);
  for (let hype of hypes) {
    if (hype.match(abba_regex)) return false;
  }
  let words = ip.match(words_regex);
  for (let word of words) {
    if (word.match(abba_regex)) return true;
  }
}

function ssl(ip) {
  const aba_regex = /(?=(\w)(?!\1)(\w)\1)/g;
  let words = ip.match(words_regex);
  let hypes = ip.match(hyper_regex);
  for (let word of words) {
    let matches = word.matchAll(aba_regex);
    for (let match of [...matches]) {
      let bab = match[2] + match[1] + match[2];
      for (let hype of hypes) {
        if (hype.indexOf(bab) != -1) {
          return true;
        }
      }
    }
  }
  return false;
}

function solve(data)
{
  let tls_count = 0;
  let ssl_count = 0;
  data.split("\n").forEach(ip => {
    if (tls(ip)) tls_count++;
    if (ssl(ip)) ssl_count++;
  });
  console.log("Star 1:", tls_count);
  console.log("Star 2:", ssl_count);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);