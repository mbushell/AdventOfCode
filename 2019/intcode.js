// Intcode Computer

/* Tests
 - day02.js
 - day05.js
 - day07.js
 - day09.js
*/


module.exports = class IC
{
  static IDLE = 0;
  static RUNNING = 1;
  static HALTED = 2;
  static AWAITING_INPUT = 3;

  constructor()
  {
    this.code = [];
    this.reset();
    /*this.input = (msg) => {
      return parseInt(readlineSync.question(msg));
    }*/
    this.output = (str) => {
      this.outputs.push(str);
    }
  }

  reset() {
    this.pc = 0; // program counter
    this.rb = 0; // relative base
    this.status = IC.IDLE;
    this.outputs = [];
  }

  load(program) {
    this.code = program.split(",").map(n => parseInt(n));
  }

  decode(code) {
    let instruction = [code % 100, 0, 0, 0];
    code = Math.trunc(code / 100);
    for (let i = 1; code > 0; i++) {
      instruction[i] = code % 10;
      code = Math.trunc(code / 10);
    }
    return instruction;
  }

  start()
  {
    this.status = IC.RUNNING;
    while ((this.pc >= 0 && this.pc < this.code.length)
        && (this.status == IC.RUNNING))
    {
      this.advance();
    }
  }

  input(value)
  {
    this.code[this.inputAddr] = value;
    this.start();
  }

  advance()
  {   
    const self = this;
    const c = this.code;
    let op, params;

    function addr(n) {
      const value = c[self.pc + n] ?? 0;
      switch (params[n-1]) {
        case 0: return value;           // position mode
        case 2: return value + self.rb; // relative mode
        default: throw new Error(`Parameter is not an address ${n}`);
      }
    }

    function param(n) {
      const value = c[self.pc + n] ?? 0;
      switch (params[n-1]) {
        case 0: return c[value] ?? 0;           // position mode
        case 1: return value;                   // immediate mode
        case 2: return c[value + self.rb] ?? 0; // relative mode
        default: throw new Error(`Unknown parameter mode ${n}`);
      }
    }
    
    [op, ...params] = this.decode(c[this.pc]);

    switch (op) {
      case 1: // add
        c[addr(3)] = param(1) + param(2);
        this.pc += 4;
        break;
      case 2: // mul
        c[addr(3)] = param(1) * param(2);
        this.pc += 4;
        break;
      case 3: // input
        this.status = IC.AWAITING_INPUT;
        this.inputAddr = addr(1);
        this.pc += 2;
        break;
      case 4: // output
        this.output(param(1));
        this.pc += 2;
        break;
      case 5: // jump-if-true
        if (param(1) != 0) this.pc = param(2); else this.pc += 3;
        break;
      case 6: // jump-if-false
        if (param(1) == 0) this.pc = param(2); else this.pc += 3;
        break;
      case 7: // less than
        c[addr(3)] = param(1) < param(2) ? 1 : 0;
        this.pc += 4;
        break;
      case 8: // equals
        c[addr(3)] = param(1) == param(2) ? 1 : 0;
        this.pc += 4;
        break;
      case 9: // relative base offset
        this.rb += param(1);
        this.pc += 2;
        break;
      case 99: // halt
        this.status = IC.HALTED;
        break;
      default:
        throw new Error(`Unknown ${c[this.pc]} at ${this.pc}`);
    }
  }

  disassemble(from, to)
  {
    const self = this;
    const c = this.code;
    let op, params;

    function param(n) {
      const value = c[self.pc + n] ?? 0;
      switch (params[n-1]) {
        case 0: return `[${value}]`; // position mode
        case 1: return value;        // immediate mode
        case 2: return `(${value})`; // relative mode
        default: throw new Error(`Unknown parameter mode ${n}`);
      }
    }
    

    for (this.pc = from; this.pc < to; )
    {
      [op, ...params] = this.decode(c[this.pc]);
      switch (op) {
        case 1: // add
          console.log(this.pc, "\t", "add", param(1), param(2), param(3));
          this.pc += 4;
          break;
        case 2: // mul
          console.log(this.pc, "\t", "mul", param(1), param(2), param(3));
          this.pc += 4;
          break;
        case 3: // input
          console.log(this.pc, "\t", "in", param(1), param(2));
          this.pc += 2;
          break;
        case 4: // output
          console.log(this.pc, "\t", "out", param(1));
          this.pc += 2;
          break;
        case 5: // jump-if-true
          console.log(this.pc, "\t", "jit", param(1), param(2));
          this.pc += 3;
          break;
        case 6: // jump-if-false
          console.log(this.pc, "\t", "jif", param(1), param(2));
          this.pc += 3;
          break;
        case 7: // less than
          console.log(this.pc, "\t", "lt", param(1), param(2), param(3));
          this.pc += 4;
          break;
        case 8: // equals
          console.log(this.pc, "\t", "eq", param(1), param(2), param(3));
          this.pc += 4;
          break;
        case 9: // relative base offset
          console.log(this.pc, "\t", "rbo", param(1));
          this.pc += 2;
          break;
        case 99: // halt
          console.log(this.pc, "\t", "halt");
          this.pc += 1;
          break;
        default:
          console.log(this.pc, "\t", "unknown", c[this.pc]);
          this.pc += 1;
          break;
      }
    }
  }

}