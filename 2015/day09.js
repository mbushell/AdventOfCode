const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let places = {};
  data.split("\n").forEach(line => {
    let match = line.match(/^(\w+) to (\w+) = (\d+)$/);
    places[match[1]] ??= {};
    places[match[2]] ??= {};
    places[match[1]][match[2]] = parseInt(match[3]);
    places[match[2]][match[1]] = parseInt(match[3]);
  });

  function routes(from, route) {
    let all = [];
    let extended = [...route, from];
    Object.keys(places[from]).forEach(place => {
      if (extended.indexOf(place) >= 0) return;
      
      let extensions = routes(place, extended);
      all.push(...extensions);
    });
    return all.length == 0 ? [extended] : all;
  }

  function route_cost(route) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      cost += places[route[i]][route[i + 1]];
    }
    return cost;
  }

  let place_names = Object.keys(places);
  let place_count = place_names.length;
  
  let shortest = Number.MAX_SAFE_INTEGER;
  let longest = Number.MIN_SAFE_INTEGER;

  place_names.forEach(name => {
    routes(name, []).forEach(route => {
      if (route.length == place_count) {
        let cost = route_cost(route);
        shortest = Math.min(shortest, cost);
        longest = Math.max(longest, cost);
      }
    })
  });

  console.log("Shortest:", shortest);
  console.log("Longest:", longest);
}