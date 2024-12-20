const file = require("path").basename(__filename);

// Star 1: 6415184586041
// Star 2: 6436819084274

//solve2(`12345`);
solve2(`2333133121414131402`);

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve2(data)
);

function solve(data)
{
  let [map, free] = expandDiskMap(data);
  
  let swaps = 0;
  for (let i = map.length - 1, j = 0;
      map.length-i <= free;
      i--)
  {
    if (map[i] == '.') continue;
    for (; j < map.length - 1; j++) {
      if (map[j] == '.') {
        map[j] = map[i];
        map[i] = '.';
        swaps++;
        break;
      }
    }
  }

  //console.log(map.join(""));

  function checksum(map)
  {
    let total = 0;
    for (let i = 0; i < map.length; i++) {
      if (map[i] == '.') break;
      total += i * map[i];
    }
    return total;
  }

  console.log(checksum(map));
}

function expandDiskMap(data) 
{
  let map = [];
  let fileID = 0;
  let free = 0;
  let isFree = false;
  for (let i = 0; i < data.length; i++) 
  {
    let blocks = parseInt(data[i]);
    if (isFree) {
      map.push(...Array(blocks).fill('.'));
      free += blocks;
    } else {
      map.push(...Array(blocks).fill(fileID++));
    }
    isFree = !isFree;
  }
  return [map, free];
}

function solve2(data)
{
  let map = expandDiskMap2(data);


  function mapToString(map)
  {
    let str = "";
    for (let i = 0; i < map.length; i++) {
      if (map[i].type == 'file') {
        str += Array(map[i].blocks).fill(map[i].id).join("");
      } else {
        str += Array(map[i].blocks).fill('.').join("");
      }
    }
    return str;
  }

  for (let i = map.length - 1; i >= 0; i--) {
    if (map[i].type == 'free' || map[i].seen) continue;

    let file = map[i];
    file.seen = true;
    
    for (let j = 0; j < i; j++) {
      let free = map[j];
      if (free.type == 'free' && free.blocks >= file.blocks) {
        map.splice(i, 1, { type: 'free', blocks: file.blocks });
        map.splice(j, 0, file);
        free.blocks -= file.blocks;
        if (free.blocks == 0) {
          map.splice(j + 1, 1);
        }
        break;
      }
    }
  }

  function checksum(map)
  {
    let total = 0;
    let s = 0;
    for (let i = 0; i < map.length; i++) {
      if (map[i].type == 'file') {
        for (let j = 0; j < map[i].blocks; j++) {
          total += (s + j) * map[i].id;
        }
      }
      s += map[i].blocks;
    }
    return total;
  }

  console.log(checksum(map));
}

function expandDiskMap2(data)
{
  let map = [];
  let fileID = 0;
  let isFree = false;
  for (let i = 0; i < data.length; i++, isFree = !isFree) {
    let blocks = parseInt(data[i]);
    if (isFree) {
      map.push({ type: 'free', blocks: blocks });
    } else {
      map.push({ type: 'file', id: fileID++, blocks: blocks });
    }
  }
  return map;
}
