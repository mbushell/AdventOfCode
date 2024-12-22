const file = require("path").basename(__filename);

// Star 1: 202274
// Star 2: 245881705840972

let num_pad = {
  keys: [
    ['7','8','9'],
    ['4','5','6'],
    ['1','2','3'],
    ['#','0','A'],
  ],
  coords: {
    '7': [0, 0], '8': [1, 0], '9': [2, 0],
    '4': [0, 1], '5': [1, 1], '6': [2, 1],
    '1': [0, 2], '2': [1, 2], '3': [2, 2],
    '#': [0, 3], '0': [1, 3], 'A': [2, 3],
  },
  steps: {},
}

let dir_pad = {
  keys: [
    ['#','^','A'],
    ['<','v','>'],
  ],
  coords: {
    '#': [0, 0], '^': [1, 0], 'A': [2, 0],
    '<': [0, 1], 'v': [1, 1], '>': [2, 1],
  },
  steps: {},
}

/*  
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/

function permutations(arr, filter) {
  if (arr.length == 1) return [ [arr[0]] ];

  let perms = {};
  arr.forEach((value, i) => {
    let brr = [...arr];
    brr.splice(i, 1);
    permutations(brr).forEach(perm => {
      perm.push(value);
      if (!filter || filter(perm)) {
        perms[perm] ??= perm;
      }
    })
  });

  return Object.values(perms);
}

function required_steps(pad, from_key, to_key) {
  let [sx, sy] = pad.coords[from_key];
  let [ex, ey] = pad.coords[to_key];
  let dx = ex - sx;
  let dy = ey - sy;
  let v = dy < 0 ? "^" : "v";
  let h = dx < 0 ? "<" : ">";
  return [
    ...Array(Math.abs(dy)).fill(v),
    ...Array(Math.abs(dx)).fill(h),
  ];
}

function is_sequence_legal(pad, start_key, sequence) {
  let [x, y] = pad.coords[start_key];
  if (pad.keys[y][x] == '#') return false;
  for (let i = 0; i < sequence.length; i++) {
    switch (sequence[i]) {
      case "^": y--; break;
      case "v": y++; break;
      case "<": x--; break;
      case ">": x++; break;
    }
    if (pad.keys[y][x] == '#') return false;
  }
  return true;
}

function init_pad_steps(pad) {
  pad.steps = {};
  Object.keys(pad.coords).forEach(from_key => {
    if (from_key == '#') return;
    Object.keys(pad.coords).forEach(to_key => {
      if (to_key == '#') return;
      else if (from_key == to_key) {
        pad.steps[[from_key, to_key]] = [''];
        return;
      }
      
      // all legal sequences
      let sequences = permutations(
        required_steps(pad, from_key, to_key),
        p => is_sequence_legal(pad, from_key, p)
      ).map(p => p.join(""));
  
      pad.steps[[from_key, to_key]] = sequences;
    })
  });
}

init_pad_steps(num_pad);
init_pad_steps(dir_pad);

function get_all_encodings(pad, string) {
  let results = [];

  function encode_from(i, path) {
    if (i == string.length) {
      results.push(path);
      return;
    }
    let prev = path == "" ? "A" : string[i-1];
    let curr = string[i];
    let options = pad.steps[[prev,curr]];
    for (let j = 0; j < options.length; j++) {
      encode_from(i+1, path + options[j] + "A");
    }
  }
  encode_from(0, "");
  return results;
}

const MAX_DEPTH = 1 + 25;
const cache = {};

function best_encoding(string, level) {
  if (level == MAX_DEPTH) return string.length;

  cache[level] ??= {};
  if (cache[level][string]) {
    return cache[level][string];
  }

  let pad = level == 0 ? num_pad : dir_pad;
  
  let parts = string.split("A");
  parts.pop();

  let total = 0;
  parts.forEach(part => {
    part += "A";
    possible_encodings = get_all_encodings(pad, part);    
    let best = Math.min(
      ...possible_encodings.map(substr => best_encoding(substr, level + 1))
    );
    total += best;
  });

  return cache[level][string] = total;
}

function solve(data) {
  let codes = data.split("\n");
  let total = 0;
  codes.forEach(code => {
    total += best_encoding(code, 0)*parseInt(code.slice(0, -1));
  });  
  console.log(total);
}

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);