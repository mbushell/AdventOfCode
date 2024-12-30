const file = require("path").basename(__filename);

// Star 1: 485720
// Star 2: 3848998

class Item {
  constructor(name) {
    this.name   = name;
    this.recipe = new Recipe();
  }
  cost_of(amount, stash)
  {
    stash[this.name] ??= 0;
    if (stash[this.name] >= amount) {
      stash[this.name] -= amount;
      //console.log(">", amount, this.name, `[${stash[this.name]}]`);
      return 0;
    }
    if (stash[this.name] > 0) {
      let temp = amount;
      amount -= stash[this.name];
      stash[this.name] = 0;
      //console.log(">", stash[this.name], this.name, `[${stash[this.name]}]`);
    }

    
    if (this.name == "ORE") {
      //console.log(`£${amount}`, this.name);
      return amount;
    }

    let times = Math.ceil(amount / this.recipe.makes);
    let making = this.recipe.makes * times;
    let spare = making - amount;

    //console.log("+", making, this.name);

    if (spare > 0) {
      stash[this.name] += spare;
      //console.log("<", spare, this.name, `[${stash[this.name]}]`);
    }

    return this.recipe.cost_of(times, stash);
  }
}

class Recipe {
  constructor() {
    this.makes = 0;
    this.ingredients = [];
  }
  cost_of(times, stash) {
    let total = 0;
    for (let ing of this.ingredients) {
      total += ing.item.cost_of(ing.amount * times, stash);
    }
    return total;
  }
}


function solve(data)
{
  let items = {};

  function get_item(name) {
    return items[name] ??= new Item(name);
  }

  data.split("\n").forEach(recipe => {
    let [from, to] = recipe.split(" => ");
    
    let [to_amount, to_name] = to.split(" ");
    let to_item = get_item(to_name);
    to_item.recipe.makes = parseInt(to_amount);

    from.split(", ").forEach(item => {
      let [from_amount, from_name] = item.split(" ");
      let from_item = get_item(from_name);
      to_item.recipe.ingredients.push({
        item: from_item,
        amount: parseInt(from_amount),
      });
    });
  });

  
  let item = get_item("FUEL");
  console.log("Star 1:", item.cost_of(1, {}));
  
  let i = 3840000;
  let cost = 0;
  let stash = {};
  while ((cost = item.cost_of(i, stash)) < 1000000000000) {
    //console.log(i, cost);
    stash = {};
    i++;
  }
  console.log("Star 2:", i);
}


require("node:fs").readFile(file.replace(".js", ".txt"),
"utf8", (err, data) => solve(data.trim())
);


