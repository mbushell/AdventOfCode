const file = require("path").basename(__filename);

// Star 1: 37128
// Star 2: 74914228471331

solve(`Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data)
);


/*
x = ma_x + nb_x
y = ma_y + nb_y

[ x ]   [ a_x b_x ] [ m ]
[ y ] = [ a_y b_y ] [ n ]

[ m ]           1         [  b_y -b_x ] [ x ]
[ n ] = a_x b_y - a_y b_x [ -a_y  a_x ] [ y ]

[ 8400 ]   [ 94 22 ] [ m ]
[ 5400 ] = [ 34 67 ] [ n ]
*/


function solve(data)
{
  const extra = 10000000000000; // Part 1: 0, Part 2: 10000000000000

  let prizes = data.split("\n\n").map(set => 
                set.split("\n").map((line, i) => 
                  line.split(":")[1].split(", ")
                      .map(n => parseInt(n.split("++="[i])[1]) + (i == 2 ? extra : 0))));

  let total = prizes.reduce((t, prize) => {
    [[a_x, a_y], [b_x, b_y], [x, y]] = prize;
    let det = a_x*b_y - a_y*b_x;
    let m = (b_y*x - b_x*y) / det;
    let n = (a_x*y - a_y*x) / det;
    return t + (Number.isInteger(m) && Number.isInteger(n) ? (3*m + n) : 0);
  }, 0);
  
  console.log(total);
}