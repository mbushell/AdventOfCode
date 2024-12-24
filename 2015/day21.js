const file = require("path").basename(__filename);


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);

const weapons = [
  [ 8, 4, 0],
  [10, 5, 0],
  [25, 6, 0],
  [40, 7, 0],
  [74, 8, 0],
];
const armors = [
  [  0, 0, 0],
  [ 13, 0, 1],
  [ 31, 0, 2],
  [ 53, 0, 3],
  [ 75, 0, 4],
  [102, 0, 5],
];
const rings = [
  [  0, 0, 0],
  [ 25, 1, 0],
  [ 50, 2, 0],
  [100, 3, 0],
  [ 20, 0, 1],
  [ 40, 0, 2],
  [ 80, 0, 3],
];

function solve(data)
{
  let match = data.match(/(\d+)/g);

  let boss = {
    hp:     parseInt(match[0]),
    damage: parseInt(match[1]),
    armor:  parseInt(match[2]),
  };
  let boss_copy = JSON.parse(JSON.stringify(boss));

  let player = {
    hp:     100,
    damage: 0,
    armor:  0,
  };

  
  function simulate(player, boss)
  {
    player.dps = Math.max(player.damage - boss.armor, 1);
    boss.dps   = Math.max(boss.damage - player.armor, 1);
    while (true) {
      boss.hp -= player.dps;
      if (boss.hp <= 0) return true;
      player.hp -= boss.dps;
      if (player.hp <= 0) return false;
    }
  }

  function *ring_pairs() {
    for (let r1 of rings) {
      for (let r2 of rings) {
        if (r1 == r2) continue;
        yield [r1, r2];
      }
    }
  }


  let best = Number.MIN_SAFE_INTEGER;
  for (let weapon of weapons) {
    for (let armor of armors) {
      for (let [ring1, ring2] of ring_pairs()) {
        let cost = weapon[0] + armor[0] + ring1[0] + ring2[0];
        player.hp     = 100;
        player.damage = weapon[1] + armor[1] + ring1[1] + ring2[1];
        player.armor  = weapon[2] + armor[2] + ring1[2] + ring2[2];

        boss.hp = boss_copy.hp;
        
        if (!simulate(player, boss)) {
          //console.log("Boss wins!", player, cost);
          best = Math.max(best, cost);
        }
      }
    }
  }

  console.log(best);


}