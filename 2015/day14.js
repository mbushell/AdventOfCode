const file = require("path").basename(__filename);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

function solve(data)
{
  let points = {};
  let reindeer = [];
  data.split("\n").forEach(line => {
    let match = line.match(/^(\D+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds.$/);
    reindeer.push({
         name: match[1],
        speed: parseInt(match[2]),
      stamina: parseInt(match[3]),
         rest: parseInt(match[4]),
    });
    points[match[1]] = 0;
  });

  const race_length = 2503;
  for (let t = 1; t <= race_length; t++) {
    reindeer.forEach(deer => {
      let period   = deer.stamina + deer.rest;
      let periods  = Math.trunc(t / period);
      let leftover = Math.min(deer.stamina, t % period);
      deer.distance = (deer.stamina*periods + leftover) * deer.speed;
    });
    reindeer.sort((a, b) => b.distance - a.distance);
    points[reindeer[0].name]++;
  }

  console.log(points);
}