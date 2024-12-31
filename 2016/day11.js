const file = require("path").basename(__filename);

function solve(data)
{
  let floors = [];

  let names = "ABCDEFGHIJKLMNOPQRSTUVQXYZ";
  let name_id = 0;
  let mapping = {};

  data.split("\n").forEach((floor_str, i) => {
    let items = [];
    let items_str = floor_str.split("contains")[1];
    if (items_str.indexOf("nothing") == -1) {
      for (let item_str of items_str.split(" a ")) {
        if (item_str.trim().length == 0) continue;
        item_str = item_str.replace(" and", "");
        item_str = item_str.replace(/-compatible microchip([,.]?)/, " M");
        item_str = item_str.replace(/generator([,.]?)/, "G");
        let [name, type] = item_str.split(" ");

        let id = mapping[name];
        if (id === undefined) {
          id = mapping[name] = names[name_id++];
        }

        items.push({
          id: id,
          name: `${id}${type}`,
          type: type,
          floor: i,
        });
      }
    }
    floors.push(items);
  });
  
  print_floors(floors, 0);

  let turns = x => 4*x - 3;  
  console.log("Star 1:", 3 + 10 + turns(5)*2);
  console.log("Star 2:", 7 + 14 + turns(7)*2);
}

function print_floors(floors, position) {
  let str = "";
  for (let i = floors.length-1; i >= 0; i--) {
    str += `${position == i ? '>' : 'F'}${i} `;
    str += floors[i].map(item => `${item.name}`).join(" ");
    str += "\n";
  }
  console.log(str);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);