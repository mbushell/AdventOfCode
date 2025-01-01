const file = require("path").basename(__filename);

const md5 = require("md5");

function solve(data)
{
  function is_valid(x, y) {
    return x >= 0 && y >= 0 && x < 4 && y < 4;
  }
  function is_open(chr) {
    return "bcdef".indexOf(chr) >= 0;
  }
  
  function find_best_path(is_better, try_all) {

    let best_path   = "";
    let best_length = -1;
  
    let queue = [[0, 3,""]];

    while (queue.length > 0) {
      queue.sort((a, b) => is_better(a[2].length, b[2].length) ? 1 : -1);

      let [x, y, path] = queue.pop();
  
      if (!try_all && best_length > 0 && !is_better(path.length, best_length)) {
        continue;
      }
  
      if (x == 3 && y == 0) {
        if (best_length < 0 || is_better(path.length, best_length)) {
          best_path = path;
          best_length = path.length;
        }
        continue;
      }
  
      let hash = md5(data + path).slice(0, 4);
      
      if (is_open(hash[0]) && is_valid(x, y + 1)) {
        queue.push([x, y+1, path + "U"]);
      }
      if (is_open(hash[1]) && is_valid(x, y - 1)) {
        queue.push([x, y-1, path + "D"]);
      }
      if (is_open(hash[2]) && is_valid(x - 1, y)) {
        queue.push([x-1, y, path + "L"]);
      }
      if (is_open(hash[3]) && is_valid(x + 1, y)) {
        queue.push([x+1, y, path + "R"]);
      }
    }

    return best_path;
  }
  
  console.log("Star 1:", find_best_path((a, b) => a < b));
  console.log("Star 2:", find_best_path((a, b) => a > b, true).length);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);