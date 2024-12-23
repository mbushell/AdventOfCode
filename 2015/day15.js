const file = require("path").basename(__filename);

// Star 1: >= 18232896
// Star 2: 

/*
solve(`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`);
return
*/

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

/*
Frosting: cap 4, dur -2, fla 0, tex 0, cal 5
Candy: cap 0, dur 5, fla -1, tex 0, cal 8
Butterscotch: cap -1, dur 0, fla 5, tex 0, cal 6
Sugar: cap 0, dur 0, fla -2, tex 2, cal 1
*/

function solve(data)
{
  let ingredients = [];
  data.split("\n").forEach(line => {
    let match = line.match(/(\w+): capacity (-?\d)+, durability (-?\d)+, flavor (-?\d)+, texture (-?\d)+, calories (-?\d)+/);
    ingredients.push({
      name: match[1],
      cap: parseInt(match[2]),
      dur: parseInt(match[3]),
      fla: parseInt(match[4]),
      tex: parseInt(match[5]),
      cal: parseInt(match[6]),
    });
  });

  /*
  ingredients.sort((a, b) => b.cap - a.cap);
  let cap = ingredients[0];
  ingredients.sort((a, b) => b.dur - a.dur);
  let dur = ingredients[0];
  ingredients.sort((a, b) => b.fla - a.fla);
  let fla = ingredients[0];
  ingredients.sort((a, b) => b.tex - a.tex);
  let tex = ingredients[0];
  */

  let props = ['cap', 'dur', 'fla', 'tex'];

  function score(amounts) {
    let total = 1;
    props.forEach(prop => {
      let subtotal = 0;
      ingredients.forEach((ingredient, i) => {
        subtotal += ingredient[prop] * amounts[i];
      });
      total *= Math.max(subtotal, 0);
    });
    let calories = 0;
    amounts.forEach((amount, i) => {
      calories += ingredients[i].cal * amount;
    });
    return [total, calories];
  }

  let best = 0;
  let best_amounts = null;

  let imax = 100;
  for (let i = 0; i < imax; i++) {
    let jmax = 100-i;
    for (let j = 0; j < jmax; j++) {
      let kmax = 100-i-j;
      for (let k = 0; k < kmax; k++) {
        let m = 100 - i - j - k;
        let [scr, cal] = score([i, j, k, m]);
        if (cal == 500 && scr > best) {
          best = scr;
          best_amounts = [i,j,k,m];
        }
      }
    }
  }

  console.log(best, best_amounts);
  console.log(score(best_amounts));
}

/*
18232896 [ 16, 30, 24, 29 ]

16   16* 4, 16*-2,       0,    0
30   0,     30* 5,   30*-1,    0
24   24*-1,     0,   24* 5,    0
29   0,         0,   29*-2, 29*2
     40      118       32    58



*/