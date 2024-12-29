const file = require("path").basename(__filename);

function solve(data)
{
  /*
  function deal_into_new_stack(deck) {
    return deck.toReversed();
  }

  function cut_cards(deck, n) {
    return [...deck.slice(n), ...deck.slice(0, n)];
  }

  function deal_with_increment(deck, n) {
    let size = deck.length;
    let deal = Array(size);
    for (let i = 0; i < size; i++) {
      deal[(i * n) % size] = deck[i];
    }
    return deal;
  }
  */

  function rev_index(size, i) {
    return size - i - 1;
  }

  function cut_index(size, i, n) {
    if (n >= 0) {
      return i < n ? (size - n + i) : i - n;
    } else {
      return cut_index(size, i, size + n);
    }
  }

  function inc_index(size, i, n) {
    return i*n % size;
  }

  function dec_index(size, i, n) {
    // Fermat's little theorem: 
    //   n^p       = n (mod p)
    //   n^(p-1)   = 1 (mod p)
    //   n*n^(p-2) = 1 (mod p)
    
    let p = BigInt(size);
    let x = BigInt(n);
    let y = BigInt(p - 2n);

    let z = 1n;
    while (y > 0) {
      if (y % 2n == 1) {
        z = z * x % p;
      }
      y = y >> 1n;
      x = x * x % p;
    }
    return Number(BigInt(i) * z % p);
  }

  let regex_a = /new stack/;
  let regex_b = /cut (-?\d+)/;
  let regex_c = /increment (\d+)/;

  function shuffle_sequence(size) {
    return data.split("\n").map(shuffle => {
      if (match = shuffle.match(regex_a)) {
        return i => rev_index(size, i);
      } else if (match = shuffle.match(regex_b)) {
        let n = parseInt(match[1]);
        return i => cut_index(size, i, n);
      } else if (match = shuffle.match(regex_c)) {
        let n = parseInt(match[1]); 
        return i => inc_index(size, i, n);
      }
    });
  }

  function reversed_shuffle_sequence(size) {
    return data.split("\n").map(shuffle => {
      if (match = shuffle.match(regex_a)) {
        return i => rev_index(size, i);
      } else if (match = shuffle.match(regex_b)) {
        let n = -1 * parseInt(match[1]);
        return i => cut_index(size, i, n);
      } else if (match = shuffle.match(regex_c)) {
        let n = parseInt(match[1]);
        if (n >= 0) {
          return i => dec_index(size, i, n);
        } else {
          return i => inc_index(size, i, -n);
        }
      }
    }).toReversed();
  }
 
  function apply_shuffles(shuffles, x) {
    for (let shuffle of shuffles) {
      x = shuffle(x);
    }
    return x;
  }

  // Part 1:
  let p = 10007;
  let frwd = shuffle_sequence(p);
  let bkwd = reversed_shuffle_sequence(p);
  let star1 = apply_shuffles(frwd, 2019);
  console.log("Star 1:", star1);


  // Part 2:
  function combine(shuffles, p) {
    let b = apply_shuffles(shuffles, 0);
    let a = apply_shuffles(shuffles, 1) - b;
    return linear(a, b, p);
  }

  // f(x) = ax + b
  function linear(a, b, p) {
    return x => Number((((BigInt(a)*BigInt(x) + BigInt(b)) % BigInt(p)) + BigInt(p)) % BigInt(p));
    //return x => (((a*x + b) % p) + p) % p;
  }

  p = 119315717514047;
  let t = 101741582076661;
 
  let shuffle = combine(reversed_shuffle_sequence(p), p);
  
  function repeat(t, f, x) {
    for (let i = 1; i <= t; i++) x = f(x);
    return x;
  }

  let f = shuffle;
  let fs = [0, f];
  for (let i = 1; i <= 15; i++) {
    let b = repeat(10, f, 0);
    let a = repeat(10, f, 1) - b;
    f = linear(a, b, p);
    fs.push(f);
  }

  //101,741,582,076,661
  x = 2020;
  x = repeat(1, fs[15], x);
  x = repeat(1, fs[13], x);
  x = repeat(7, fs[12], x);
  x = repeat(4, fs[11], x);
  x = repeat(1, fs[10],  x);
  x = repeat(5, fs[9],  x);
  x = repeat(8, fs[8],  x);
  x = repeat(2, fs[7],  x);
  x = repeat(7, fs[5],  x);
  x = repeat(6, fs[4], x);
  x = repeat(6, fs[3], x);
  x = repeat(6, fs[2], x);
  x = repeat(1, fs[1], x);
  
  console.log("Star 2:", x);
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);