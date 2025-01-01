const file = require("path").basename(__filename);

function solve(data)
{
  let list = Array(255);
  
  for (let i = 0; i <= 255; i++) list[i] = i;
  let lengths = data.split(",").map(Number);
  round(list, lengths, 0, 0);
  console.log("Star 1:", list[0]*list[1]);
  
  for (let i = 0; i <= 255; i++) list[i] = i;
  lengths = data.split("").map(c => c.charCodeAt(0)); 
  lengths.push(17, 31, 73, 47, 23); 

  let pos = 0;
  let skip = 0;
  for (let i = 0; i < 64; i++) {
    [pos, skip] = round(list, lengths, pos, skip);
  }

  let digits = [];  
  for (let i = 0; i < list.length; i += 16) {
    let digit = list[i];
    for (let j = 1; j < 16; j++) {
      digit ^= list[i + j];
    }
    digits.push(digit);
  }
  
  console.log("Star 2:", digits.map(n => {
    let hex = n.toString(16);
    if (hex.length == 1) return `0${hex}`;
    return hex;
  }).join(""));
}

function round(list, lengths,  pos, skip)
{
  for (let len of lengths) {
    console.assert(len <= list.length);

    let sublista = list.slice(pos, Math.min(pos+len, list.length));
    let sublistb = list.slice(0, len - sublista.length);

    let sublist = [...sublista, ...sublistb];
    sublist.reverse();

    list.splice(pos, sublista.length, ...sublist.slice(0, sublista.length));
    list.splice(0, sublistb.length, ...sublist.slice(sublista.length));
    
    pos = (pos + len + skip) % list.length;
    skip++;
  }
  return [pos, skip];
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);