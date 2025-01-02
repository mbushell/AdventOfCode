const file = require("path").basename(__filename);

function dist(x, y, z) {
  return Math.abs(x) + Math.abs(y) + Math.abs(z);
}

function solve(data)
{
  let particles = data.split("\n").map((line, i) => {
    let nums = line.match(/-?\d+/g).map(Number);
    return {
      i: i,
      p: {x: nums[0], y: nums[1], z: nums[2] },
      v: {x: nums[3], y: nums[4], z: nums[5] },
      a: {x: nums[6], y: nums[7], z: nums[8] },
      d: dist(nums[0], nums[1], nums[2]),
    }
  });

  let closest = {};
  let copy = structuredClone(particles);
  for (let i = 0; i < 1000; i++) {
    copy.sort((a, b) => a.d - b.d);
    closest[copy[0].i] ??= 0;
    closest[copy[0].i]++;
    tick(copy);
  }

  console.log("Star 1:", Object.entries(closest).sort(
    (a, b) => b[1] - a[1])[0][0]);
  

  let seen = {};
  while (true) {
    for (let i = 0; i < particles.length;) {
      let collided = [];
      let q = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        let r = particles[j];
        if (q.p.x == r.p.x && q.p.y == r.p.y && q.p.z == r.p.z) {
          collided.push(j);
        }
      }
      if (collided.length > 0) {
        for (let j = collided.length - 1; j >= 0; j--) {
          particles.splice(collided[j], 1);
        }
        particles.splice(i, 1);
        if (particles[i].i == q.i) i++;
      } else {
        i++;
      }
    }
    seen[particles.length] ??= 0;
    seen[particles.length]++;
    if (seen[particles.length] > 99) break;
    
    tick(particles);
  }
  console.log("Star 2:", particles.length);
}

function tick(particles) {
  for (let q of particles) {
    q.v.x += q.a.x;
    q.v.y += q.a.y;
    q.v.z += q.a.z;
    q.p.x += q.v.x;
    q.p.y += q.v.y;
    q.p.z += q.v.z;
    q.d = dist(q.p.x, q.p.y, q.p.z);
  };
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);