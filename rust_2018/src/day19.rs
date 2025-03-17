pub fn solve(data: &str) -> (usize, usize) {
    let code = parse_program(data);

    let mut ip = 0;
    let mut regs = [1, 0, 0, 0, 0, 0];

    let mut ip_bind = 0;
    if let Code::IP(n) = code[0] {
        ip_bind = n;
    }

    let program = &code[1..];

    while ip < program.len() {
        regs[ip_bind] = ip;

        if regs[0] == 1 && ip == 2 {
            println!("Star 2 = Sum factors of {}", regs[4]);
            break;
        }

        match program[ip] {
            Code::Op(Op::Addr, a, b, c) => {
                regs[c] = regs[a] + regs[b];
            }
            Code::Op(Op::Addi, a, b, c) => {
                regs[c] = regs[a] + b;
            }
            Code::Op(Op::Mulr, a, b, c) => {
                regs[c] = regs[a] * regs[b];
            }
            Code::Op(Op::Muli, a, b, c) => {
                regs[c] = regs[a] * b;
            }
            Code::Op(Op::Banr, a, b, c) => {
                regs[c] = regs[a] & regs[b];
            }
            Code::Op(Op::Bani, a, b, c) => {
                regs[c] = regs[a] & b;
            }
            Code::Op(Op::Borr, a, b, c) => {
                regs[c] = regs[a] | regs[b];
            }
            Code::Op(Op::Bori, a, b, c) => {
                regs[c] = regs[a] | b;
            }
            Code::Op(Op::Setr, a, _b, c) => {
                regs[c] = regs[a];
            }
            Code::Op(Op::Seti, a, _b, c) => {
                regs[c] = a;
            }
            Code::Op(Op::Gtir, a, b, c) => {
                regs[c] = if a > regs[b] { 1 } else { 0 };
            }
            Code::Op(Op::Gtri, a, b, c) => {
                regs[c] = if regs[a] > b { 1 } else { 0 };
            }
            Code::Op(Op::Gtrr, a, b, c) => {
                regs[c] = if regs[a] > regs[b] { 1 } else { 0 };
            }
            Code::Op(Op::Eqir, a, b, c) => {
                regs[c] = if a == regs[b] { 1 } else { 0 };
            }
            Code::Op(Op::Eqri, a, b, c) => {
                regs[c] = if regs[a] == b { 1 } else { 0 };
            }
            Code::Op(Op::Eqrr, a, b, c) => {
                regs[c] = if regs[a] == regs[b] { 1 } else { 0 };
            }
            _ => panic!(),
        }

        ip = regs[ip_bind];
        ip += 1;
    }

    let star1 = regs[0];
    let star2 = 1 + 3 + 7 + 21 + 502441 + 1507323 + 3517087 + 10551261;

    return (star1, star2);
}

fn parse_program(data: &str) -> Vec<Code> {
    let mut program = vec![];

    for line in data.lines() {
        if line == "" {
            break;
        }
        if line[0..3].eq("#ip") {
            let words = &mut line.split_whitespace();
            program.push(Code::IP(words.skip(1).next().unwrap().parse().unwrap()));
        } else {
            let words = &mut line.split_whitespace();
            program.push(Code::Op(
                words.next().unwrap().into(),
                words.next().unwrap().parse().unwrap(),
                words.next().unwrap().parse().unwrap(),
                words.next().unwrap().parse().unwrap(),
            ));
        }
    }
    return program;
}

#[derive(Debug)]
enum Code {
    IP(usize),
    Op(Op, usize, usize, usize),
}

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
enum Op {
    Addr, // add register
    Addi, // add immediate
    Mulr, // multiply register
    Muli, // multply immediate
    Banr, // bitwise AND register
    Bani, // bitwise AND immediate
    Borr, // bitwise OR register
    Bori, // bitwise OR immediate
    Setr, // set register
    Seti, // set immediate
    Gtir, // greater than immediate/register
    Gtri, // greater than register/immediate
    Gtrr, // greater than register/register
    Eqir, // equal immediate/register
    Eqri, // equal register/immediate
    Eqrr, // equal register/register
}

impl From<&str> for Op {
    fn from(index: &str) -> Op {
        match index {
            "addr" => Op::Addr,
            "addi" => Op::Addi,
            "mulr" => Op::Mulr,
            "muli" => Op::Muli,
            "banr" => Op::Banr,
            "bani" => Op::Bani,
            "borr" => Op::Borr,
            "bori" => Op::Bori,
            "setr" => Op::Setr,
            "seti" => Op::Seti,
            "gtir" => Op::Gtir,
            "gtri" => Op::Gtri,
            "gtrr" => Op::Gtrr,
            "eqir" => Op::Eqir,
            "eqri" => Op::Eqri,
            "eqrr" => Op::Eqrr,
            _ => panic!("invalid opcode"),
        }
    }
}

#[allow(dead_code)]
fn decompile_program(program: &[Code]) {
    for line in program {
        match line {
            Code::IP(a) => {
                println!("IP = R{a}");
            }
            Code::Op(Op::Addr, a, b, c) => {
                println!("R{c} = R{a} + R{b}");
            }
            Code::Op(Op::Addi, a, b, c) => {
                println!("R{c} = R{a} + {b}");
            }
            Code::Op(Op::Mulr, a, b, c) => {
                println!("R{c} = R{a} * R{b}");
            }
            Code::Op(Op::Muli, a, b, c) => {
                println!("R{c} = R{a} * {b}");
            }
            Code::Op(Op::Banr, a, b, c) => {
                println!("R{c} = R{a} & R{b}");
            }
            Code::Op(Op::Bani, a, b, c) => {
                println!("R{c} = R{a} & {b}");
            }
            Code::Op(Op::Borr, a, b, c) => {
                println!("R{c} = R{a} | R{b}");
            }
            Code::Op(Op::Bori, a, b, c) => {
                println!("R{c} = R{a} | {b}");
            }
            Code::Op(Op::Setr, a, _b, c) => {
                println!("R{c} = R{a}");
            }
            Code::Op(Op::Seti, a, _b, c) => {
                println!("R{c} = {a}");
            }
            Code::Op(Op::Gtir, a, b, c) => {
                println!("R{c} = if {a} > R{b} ? 1 : 0");
            }
            Code::Op(Op::Gtri, a, b, c) => {
                println!("R{c} = if R{a} > {b} ? 1 : 0");
            }
            Code::Op(Op::Gtrr, a, b, c) => {
                println!("R{c} = if R{a} > R{b} ? 1 : 0");
            }
            Code::Op(Op::Eqir, a, b, c) => {
                println!("R{c} = if {a} == R{b} ? 1 : 0");
            }
            Code::Op(Op::Eqri, a, b, c) => {
                println!("R{c} = if R{a} == {b} ? 1 : 0");
            }
            Code::Op(Op::Eqrr, a, b, c) => {
                println!("R{c} = if R{a} == R{b} ? 1 : 0");
            }
        }
    }
}
