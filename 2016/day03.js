const file = require("path").basename(__filename);

function is_possible(t) {
  return t[0] + t[1] > t[2] && t[0] + t[2] > t[1] &&  t[1] + t[2] > t[0];
}

function parse_triple(line) {
  let m = line.match(/(\d+)\s+(\d+)\s+(\d+)/);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function solve(data)
{
  let triangles = 0;
  let lines = data.split("\n");
  for (let line of lines) 
  {
    let t = parse_triple(line);
    if (is_possible(t)) triangles++;
  }
  console.log("Star 1:", triangles);

  triangles = 0;
  for (let i = 0; i < lines.length; i += 3) {
    let r1 = parse_triple(lines[i+0]);
    let r2 = parse_triple(lines[i+1]);
    let r3 = parse_triple(lines[i+2]);
    if (is_possible([r1[0], r2[0], r3[0]])) triangles++;
    if (is_possible([r1[1], r2[1], r3[1]])) triangles++;
    if (is_possible([r1[2], r2[2], r3[2]])) triangles++;
  }
  console.log("Star 2:", triangles);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);