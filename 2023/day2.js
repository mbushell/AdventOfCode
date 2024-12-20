const fs = require('node:fs');

function parseGame(line)
{
  let [game, hands] = line.split(":");
  game = {
    id: parseInt(game.split(" ")[1]),
    red: 0, green: 0, blue: 0,
  };
  hands.split(";").forEach(hand => {
    hand.split(",").forEach(pick => {
      let [count, colour] = pick.trim().split(" ");
      game[colour] = Math.max(game[colour], parseInt(count));
    })
  });
  return game;
}

function isGameValid(game) {
  return game.red <= 12 && game.green <= 13 && game.blue <= 14;
}

/*
parseGame("Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green");
parseGame("Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue");
parseGame("Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red");
parseGame("Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red");
parseGame("Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green");
return;
*/

fs.readFile('./day2-input.txt', 'utf8', (err, data) => {
  /*
  // DAY 1:
  let result = 
    data.split("\n")
      .map(parseGame)
      .reduce((total, game) => isGameValid(game) ? total + game.id : total, 0);
  */
 
  // DAY 2:
  let result =
    data.split("\n")
        .map(parseGame)
        .reduce((total, game) =>
          total + (game.red * game.green * game.blue)
        , 0);

  console.log(result);
});