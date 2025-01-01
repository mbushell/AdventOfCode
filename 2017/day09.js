const file = require("path").basename(__filename);

let GARBAGE = 0;

function solve(data) {
  console.log("Star 1:", parse_data(new CharStream(data), 0));
  console.log("Star 2:", GARBAGE);
}

function parse_data(chars, score) {
  let total = 0;
  while (!chars.is_empty()) {
    switch (chars.peek()) {
      case '{': total += parse_group(chars, score + 1); break;
      case '<': parse_garbage(chars); break;
      case '}': return total;
      case '>': return total;
      default: chars.skip(); break;
    }
  }
  return total;
}

function parse_group(chars, score) {
  chars.consume('{');
  let total = parse_data(chars, score);
  chars.consume('}');
  return total + score;
}

function parse_garbage(chars) {
  chars.consume('<');
  while (!chars.is_next('>')) {
    if (chars.is_next('!')) {
      chars.consume('!');
      chars.skip();
    } else {
      chars.skip();
      GARBAGE++;
    }
  }
  chars.consume('>');
}

class CharStream {
  constructor (data) {
    this.data = data;
    this.i = 0;
  }
  is_empty() {
    return this.i >= this.data.length;
  }
  is_next(c) {
    return this.data[this.i] == c;
  }
  peek() {
    return this.data[this.i];
  }
  consume(c) {
    console.assert(this.is_next(c));
    this.skip();
  }
  skip() {
    this.i++;
  }
}

require("node:fs").readFile(file.replace(".js", ".txt"),
  "utf8", (err, data) => solve(data.trim())
);