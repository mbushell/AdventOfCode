const fs = require('node:fs');

function parseSeed(almanac, seed) {
  let val = seed;
  let src = "seed";
  while (src != "location") {
    let map = almanac[src];
    for (let i = 0; i < map.ranges.length; i++) {
      let range = map.ranges[i];
      if (val >= range.srcStart && val <= range.srcEnd) {
        val = range.dstStart + (val - range.srcStart);
        break;
      }
    }
    src = map.dst;
  }
  return val;
}


// Part 1
// ======
function parseData1(data)
{
  let seeds = [];
  let almanac = {};
  let activeMap = {};

  data.split("\n").forEach((line, i) => {
    if (i == 0) {
      seeds = line.split(":")[1].trim().split(" ");
      return;
    }
    if (line == "")  {
      return;
    }
    if (line.slice(-4) === "map:") {
      let [src, dst] = line.slice(0, -5).split("-to-");
      almanac[src] = activeMap = {
        dst: dst,
        ranges: [],
      };
      return;
    }
    
    let [dstStart, srcStart, len] = line.split(/\s+/).map(val => parseInt(val));
    
    activeMap.ranges.push({
      dstStart: dstStart,
      srcStart: srcStart,
      srcEnd: srcStart + len - 1,
    });
  });

  let result = undefined;
  seeds.forEach(seed => {
    let val = parseSeed(almanac, seed);
    if (result === undefined) {
      result = val;
    } else {
      result = Math.min(result, val);
    }
  });
  return result;
}

// Part 2
// ======
function parseData(data)
{
  let seedRanges = [];
  let almanac = {};
  let activeMap = {};

  data.split("\n").forEach((line, i) => {
    if (i == 0) {
      let ranges = line.split(":")[1].trim().split(" ");
      for (let i = 0; i < ranges.length; i += 2) {
        let start = parseInt(ranges[i]);
        seedRanges.push([start, start + parseInt(ranges[i + 1]) - 1])
      }
      return;
    }
    if (line == "")  {
      return;
    }
    if (line.slice(-4) === "map:") {
      let [src, dst] = line.slice(0, -5).split("-to-");
      almanac[src] = activeMap = {
        dst: dst,
        ranges: [],
      };
      return;
    }
    
    let [dstStart, srcStart, len] = line.split(/\s+/).map(val => parseInt(val));
    
    activeMap.ranges.push({
      domain: [srcStart, srcStart + len - 1],
      diff: dstStart - srcStart,
    });
  });

  let partition = seedRanges;

  let src = "seed";
  while (src != "location")
  {
    let map = almanac[src];
    
    let handledPartings = [];

    map.ranges.forEach(range => {
      let domain = range.domain;
      let unhandledPartings = [];

      partition.forEach(parting => {
        
        if (parting[1] < domain[0] || parting[0] > domain[1]) {
          unhandledPartings.push(parting);
        }
        else if (parting[0] >= domain[0] && parting[1] <= domain[1]) {
          // domain fully contains parting
          handledPartings.push([
            parting[0] + range.diff, parting[1] + range.diff
          ])
        }
        else if (parting[0] < domain[0] && parting[1] > domain[1]) {
          // parting full contains domain
          unhandledPartings.push([parting[0], domain[0] - 1]);
          handledPartings.push([
            domain[0] + range.diff, domain[1] + range.diff
          ])
          unhandledPartings.push([domain[1] + 1, parting[1]]);
        }
        else if (parting[0] < domain[0]) {
          unhandledPartings.push([parting[0], domain[0] - 1]);
          handledPartings.push([
            domain[0] + range.diff, parting[1] + range.diff
          ])
        }
        else if (parting[1] > domain[1]) {
          handledPartings.push([
            parting[0] + range.diff, domain[1] + range.diff
          ])
          unhandledPartings.push([domain[1] + 1, parting[1]]);
        }
        else {
          console.log("ERROR");
        }
      });
      
      partition = unhandledPartings;
    })
    
    partition = [...handledPartings, ...partition];
    
    src = map.dst;
  }

  let min = undefined;
  partition.forEach(range => {
    if (min === undefined || range[0] < min) {
      min = range[0];
    }
  })
  return min;
}

/*
dstStart srcStart length
*/
/*
console.log(parseData(`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`));
return;
/*
*/

fs.readFile('./day5-input.txt', 'utf8', (err, data) => {
  console.log(parseData(data));
});