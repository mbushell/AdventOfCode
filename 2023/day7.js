const fs = require('node:fs');

// Day 1: 246409899
// Day 2: 

const testData = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const cardValue = {
  'J': 1, // Day 2
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  //'J': 11, // Day 1
  'Q': 12,
  'K': 13,
  'A': 14,
};

parseData(testData);

fs.readFile('./day7-input.txt', 'utf8',
  (err, data) => parseData(data)
);


function parseHand(handString)
{
  const hand = {
    cards: handString.split(""),
  };

  const counts = {};
  hand.cards.forEach(card => 
    counts[card] = counts[card] ? counts[card] + 1 : 1
  );

  const values = Object.values(counts);
  
  switch (values.length)
  {
    case 1:
      hand.strength = 6; // Five of a Kind
      break;
    case 2:
      if (values[0] == 4 || values[1] == 4) {
        // split 1 and 4
        if (counts["J"] > 0) {
          hand.strength = 6; // Five of a Kind
        } else {
          hand.strength = 5; // Four of a Kind
        }
      }
      else {
        // split 2 and 3
        if (counts["J"] > 0) {
          hand.strength = 6; // Five of a Kind
        } else {
          hand.strength = 4; // Full House
        }
      }
      break;
    case 3:
      if (values[0] == 3 || values[1] == 3 || values[2] == 3) {
        if (counts["J"] > 0) {
          hand.strength = 5; // Four of a Kind
        } else {
          hand.strength = 3; // Three of a Kind
        }
      } else {
        if (counts["J"] >= 2) {
          hand.strength = 5; // Four of a Kind
        } else if (counts["J"] == 1) {
          hand.strength = 4; // Full House
        } else {
          hand.strength = 2; // Two Pair
        }
      }
      break;
    case 4:
      if (counts["J"] >= 1) {
        hand.strength = 3; // Three of a Kind
      } else {
        hand.strength = 1; // One Pair
      }
      break;
    case 5:
      if (counts["J"]) {
        hand.strength = 1; // One Pair
      } else {
        hand.strength = 0; // High Card
      }
    break;
  }

  return hand;
}


// Part 1
// ======
function parseData(data)
{
  const hands = data.split("\n").map(line => {
    const parts = line.split(" ");
    const hand = parseHand(parts[0]);
    hand.bid = parseInt(parts[1]);
    return hand;
  });
  
  hands.sort((a, b) => {
    if (a.strength == b.strength) {
      for (let i = 0; i < 5; i++) {
        let diff = cardValue[a.cards[i]] - cardValue[b.cards[i]];
        if (diff != 0) {
          return diff;
        }
      }
      return 0;
    } else {
      return (a.strength - b.strength);
    }
  });


  const winnings = hands.reduce((total, hand, index) => {
    return total + hand.bid * (index + 1);
  }, 0);

  console.log(winnings);
}
