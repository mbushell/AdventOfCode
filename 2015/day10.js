const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{

  function parse_sequences(string) {
    let seqs = [];
    let curr = "";
    for (let i = 0; i < string.length; i++) {
      if (curr && curr[0] != string[i]) {
        seqs.push(curr);
        curr = "";
      }
      curr += string[i];
    }
    seqs.push(curr);
    return seqs;
  }

  let string = data;

  for (let i = 0; i < 50; i++) {
    let seqs = parse_sequences(string);
    string = seqs.map(s => s.length + s[0]).join("");
  }

  console.log(string.length);
}