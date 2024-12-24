const file = require("path").basename(__filename);


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let match = data.match(/(\d+)/g);

  let boss = {
    hp:     parseInt(match[0]),
    damage: parseInt(match[1]),
  };

  let player = {
    hp:       50,
    mana:     500,
    armor:    0,
    shield:   0,
    poison:   0,
    recharge: 0,
  };
  
  // EASY least mana = 1824
  let HARD_MODE = true; 
  let best = Number.MAX_SAFE_INTEGER;

  function check_player_win(boss, total_mana) {
    if (boss.hp <= 0) {
      console.log("Player wins!", total_mana);
      best = Math.min(best, total_mana);
      return true;
    }
    return false;
  }
  
  function update_effects(player, boss)
  {
    if (player.shield > 0) {
      player.shield--;
      if (player.shield == 0) {
        player.armor -= 7;
      }
    }
    if (player.poison > 0) {
      player.poison--;
      boss.hp -= 3;
    }
    if (player.recharge > 0) {
      player.recharge--;
      player.mana += 101;
    }
  }


  function player_turn(player, boss, turn_no, total_mana)
  {
    if (player.hp <= 0) {
      //console.log("Boss wins!", total_mana);
      return;
    }

    turn_no++;
    //console.log("Player turn", turn_no, player.hp, boss.hp);

    if (HARD_MODE) {
      player.hp -= 1;
      if (player.hp <= 0) return;//hrow "Player died of shock!";
    }

    update_effects(player, boss);

    if (check_player_win(boss, total_mana)) return;

    if (player.mana >= 53) {
      //console.log("-> Magic Missle");
      let p = {...player};
      let b = {...boss};
      p.mana -= 53;
      b.hp   -= 4;
      boss_turn(p, b, turn_no, total_mana + 53);
    }
    if (player.mana >= 73) {
      //console.log("-> Drain");
      let p = {...player};
      let b = {...boss};
      p.mana -= 73;
      p.hp   += 2;
      b.hp   -= 2;
      boss_turn(p, b, turn_no, total_mana + 73);
    }
    if (player.shield == 0 && player.mana >= 113) {
      //console.log("-> Shield");
      let p = {...player};
      let b = {...boss};
      p.mana   -= 113;
      p.armor  += 7;
      p.shield  = 6;
      boss_turn(p, b, turn_no, total_mana + 113);
    }
    if (player.poison == 0 && player.mana >= 173) {
      //console.log("-> Poison");
      let p = {...player};
      let b = {...boss};
      p.mana   -= 173;
      p.poison  = 6;
      boss_turn(p, b, turn_no, total_mana + 173);
    }
    if (player.recharge == 0 && player.mana >= 229) {
      //console.log("Recharge");
      let p = {...player};
      let b = {...boss};
      p.mana    -= 229;
      p.recharge = 5;
      boss_turn(p, b, turn_no, total_mana + 229);
    }
  }

  function boss_turn(player, boss, turn_no, total_mana)
  {
    if (total_mana >= best) return;

    if (check_player_win(boss, total_mana)) return;

    turn_no++;
    //console.log("Boss turn", turn_no, player.hp, boss.hp);

    update_effects(player, boss, "boss");
    
    if (check_player_win(boss, total_mana)) return;

    if (boss.hp <= 0) {
      console.log("Player wins!", total_mana);
      best = Math.min(best, total_mana);
      return;
    }

    player.hp -= Math.max(boss.damage - player.armor, 1);

    player_turn(player, boss, turn_no, total_mana);
  }

  player_turn(player, boss, 0, 0);
  console.log(best);
}