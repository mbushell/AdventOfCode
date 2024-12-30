const file = require("path").basename(__filename);

function solve(data)
{
  let d = 0;
  let x = 0, y = 0;
  let ex, ey;
  
  let locations = { '0,0': 1 };
  function move(dst_x, dst_y) {
    let ax = Math.abs(dst_x);
    let ay = Math.abs(dst_y);
    let dx = ax == 0 ? 0 : dst_x / ax;
    let dy = ay == 0 ? 0 : dst_y / ay;
    while (ax > 0 || ay > 0) {
      x += dx;
      y += dy;
      locations[[x,y]] ??= 0;
      locations[[x,y]]++;
      if (locations[[x,y]] == 2 && !ex) {
        ex = x;
        ey = y;
      }
      ax--;
      ay--;
    }
  }

  data.split(", ").forEach(s => {
    let m = s.match(/(\D)(\d+)/);
    let dir = m[1];
    let dst = Number(m[2]);
    d = (d + (dir == "L" ? -1 : 1) + 4) % 4;
    switch (d) {
      case 0: move(0, dst);  break;
      case 1: move(dst, 0);  break;
      case 2: move(0, -dst); break;
      case 3: move(-dst, 0); break;
    }
  });
  
  console.log("Star 1:", Math.abs(x) + Math.abs(y));
  console.log("Star 2:", Math.abs(ex) + Math.abs(ey));
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);