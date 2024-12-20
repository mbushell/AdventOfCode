const fs = require('node:fs');


function parseData(data)
{
  /*
  // SCORE CARDS
  // ===========
  return data.split("\n").reduce((total, card) => {
    if (card == "") return total;

    [winners, numbers] = card.split(":")[1].split("|");
    winners = winners.trim().split(/\s+/);
    numbers = numbers.trim().split(/\s+/);
    
    let matches = 0;
    for (let number of numbers) {
      if (winners.indexOf(number) >= 0) {
        matches++;
      }
    }

    if (matches > 0) {
      total += Math.pow(2, matches-1);
    }

    return total;
  }, 0);
  */

  /*
  // COPY CARDS
  // ==========
  */
  let cards = [];
  data.split("\n").forEach(card => {
    if (card == "") return;

    [id, values] = card.split(":")
    id = id.split(" ")[1].trim();
    
    [winners, numbers] = values.split("|");
    winners = winners.trim().split(/\s+/);
    numbers = numbers.trim().split(/\s+/);
    
    let matches = 0;
    for (let number of numbers) {
      if (winners.indexOf(number) >= 0) {
        matches++;
      }
    }

    cards.push({
      id: id,
      copies: 1,
      matches: matches,
    });

  });

  cards.forEach((card, index) => {
    for (let i = 1; i <= card.matches; i++) {
      cards[index + i].copies += card.copies;
    }
  })
  
  return cards.reduce((total, card) => total + card.copies, 0);
}

/*
console.log(parseData(`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`));
return;
*/


fs.readFile('./day4-input.txt', 'utf8', (err, data) => {
  console.log(parseData(data));
});