const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

const inc = c => String.fromCharCode(((c.charCodeAt(0) - 96) % 26) + 97);

function inc_pw(pw) {
  let chrs = pw.split("");
  for (let i = pw.length - 1; i >= 0; i--) {
    if ((chrs[i] = inc(chrs[i])) != "a") break;
  }
  return chrs.join("");
}

function is_good(pw) {
  let pairs = {};
  let pair_pos = {};
  let three_count = 0;
  for (let i = 0; i < pw.length; i++) {
    if (pw[i] == 'i' || pw[i] == 'o' || pw[i] == 'l') return false;
    
    if (i < pw.length - 1) {
      if (pw[i] == pw[i+1] && !pair_pos[i] && !pair_pos[i+1]) {
        pair_pos[i]   = true;
        pair_pos[i+1] = true;
        pairs[pw[i]]  = true;
      }
    }

    if (i < pw.length - 2) {
      if (pw[i+1] == inc(pw[i+0]) && pw[i+0] != "z" &&
          pw[i+2] == inc(pw[i+1]) && pw[i+2] != "a")
      {
        three_count++;
      }
    }
  }
  let pair_count = Object.keys(pairs).length;
  return pair_count >= 2 && three_count > 0;
}

function next_pw(pw) {
  pw = inc_pw(pw);
  while (!is_good(pw)) {
    pw = inc_pw(pw);
  }
  return pw;
}

function solve(data)
{
  //console.log("Example 1:", next_pw("abcdefgh")=="abcdffaa");
  //console.log("Example 2:", next_pw("ghijklmn")=="ghjaabcc");
  console.log(data = next_pw(data));
  console.log(data = next_pw(data));
}

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);