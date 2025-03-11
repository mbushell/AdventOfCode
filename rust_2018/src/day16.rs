use std::collections::HashMap;

type OpCodeMatches = HashMap<OpCode, HashMap<usize, i32>>;
type OpCodeMapping = HashMap<usize, OpCode>;

pub fn solve(data: &str) -> (u32, u32) {
    let Some((examples, program)) = parse_data(data) else {
        panic!("couldn't parse test cases");
    };

    let mut opcode_matches: OpCodeMatches = HashMap::new();

    let mut total_match_count = 0;
    for (test_index, test) in examples.iter().enumerate() {
        let mut match_count = 0;

        for op_index in 0..16 {
            let inst = Instruction {
                opcode: OpCode::from(op_index),
                a: test.inst[1],
                b: test.inst[2],
                c: test.inst[3],
            };
            let result = run(&inst, &test.before);
            if result == test.after {
                match_count += 1;

                let v = opcode_matches.entry(inst.opcode).or_insert(HashMap::new());

                *v.entry(test.inst[0]).or_insert(0) += 1;
            }
        }
        if match_count == 0 {
            panic!("no instruction matches for test {test_index}");
        } else if match_count >= 3 {
            total_match_count += 1;
        }
    }

    let star1 = total_match_count;

    let opcode_mapping = resolve_ops(opcode_matches);

    assert_eq!(opcode_mapping.len(), 16);

    let mut regs = vec![0, 0, 0, 0];
    for input in program {
        regs = run(
            &Instruction {
                opcode: opcode_mapping[&input[0]],
                a: input[1],
                b: input[2],
                c: input[3],
            },
            &regs,
        );
    }

    let star2 = regs[0];

    return (star1, star2 as u32);
}

fn parse_data(data: &str) -> Option<(Vec<TestCase>, Vec<Vec<usize>>)> {
    let mut tests = vec![];

    let mut lines = data.lines();

    loop {
        let Some(line) = lines.next() else {
            break;
        };
        if line == "" {
            break;
        }

        let before = line
            .split_terminator("Before: ")
            .skip(1)
            .next()?
            .strip_prefix('[')?
            .strip_suffix(']')?
            .split(" ")
            .map(|s| s[0..1].parse::<usize>().unwrap())
            .collect::<Vec<_>>();

        let inst = lines
            .next()?
            .split(" ")
            .map(|s| s.parse::<usize>().unwrap())
            .collect::<Vec<_>>();

        let after = lines
            .next()?
            .split_terminator("After:  ")
            .skip(1)
            .next()?
            .strip_prefix('[')?
            .strip_suffix(']')?
            .split(" ")
            .map(|s| s[0..1].parse::<usize>().unwrap())
            .collect::<Vec<_>>();

        assert_eq!(lines.next()?, "");

        tests.push(TestCase {
            inst,
            before,
            after,
        })
    }

    assert_eq!(lines.next(), Some(""));

    let mut code = Vec::new();
    for line in lines {
        code.push(
            line.split_whitespace()
                .map(|n| n.parse().unwrap())
                .collect::<Vec<usize>>(),
        );
    }

    return Some((tests, code));
}

fn resolve_ops(mut opcode_matches: OpCodeMatches) -> OpCodeMapping {
    let mut opcode_mapping: HashMap<usize, OpCode> = HashMap::new();
    for _ in 1..10 {
        if opcode_matches.len() == 0 {
            break;
        }

        let mut list = opcode_matches
            .iter()
            .map(|(opcode, matches)| (*opcode, matches.len()))
            .collect::<Vec<_>>();

        list.sort_by(|(_, n), (_, m)| m.cmp(n));

        while list.len() > 0 {
            let (opcode, _) = list.pop().unwrap();
            let matches = opcode_matches.get(&opcode).unwrap();

            if matches.len() > 1 {
                continue;
            }

            let index = *matches.iter().next().unwrap().0;

            opcode_mapping.insert(index, opcode);
            opcode_matches.remove(&opcode);

            opcode_matches.iter_mut().for_each(|(_, matches)| {
                matches.remove(&index);
            });
        }
    }
    return opcode_mapping;
}

fn run(inst: &Instruction, regs: &Registers) -> Registers {
    let mut out = regs.clone();
    match inst.opcode {
        OpCode::Addr => out[inst.c] = regs[inst.a] + regs[inst.b],
        OpCode::Addi => out[inst.c] = regs[inst.a] + inst.b,
        OpCode::Mulr => out[inst.c] = regs[inst.a] * regs[inst.b],
        OpCode::Muli => out[inst.c] = regs[inst.a] * inst.b,
        OpCode::Banr => out[inst.c] = regs[inst.a] & regs[inst.b],
        OpCode::Bani => out[inst.c] = regs[inst.a] & inst.b,
        OpCode::Borr => out[inst.c] = regs[inst.a] | regs[inst.b],
        OpCode::Bori => out[inst.c] = regs[inst.a] | inst.b,
        OpCode::Setr => out[inst.c] = regs[inst.a],
        OpCode::Seti => out[inst.c] = inst.a,
        OpCode::Gtir => out[inst.c] = if inst.a > regs[inst.b] { 1 } else { 0 },
        OpCode::Gtri => out[inst.c] = if regs[inst.a] > inst.b { 1 } else { 0 },
        OpCode::Gtrr => out[inst.c] = if regs[inst.a] > regs[inst.b] { 1 } else { 0 },
        OpCode::Eqir => out[inst.c] = if inst.a == regs[inst.b] { 1 } else { 0 },
        OpCode::Eqri => out[inst.c] = if regs[inst.a] == inst.b { 1 } else { 0 },
        OpCode::Eqrr => out[inst.c] = if regs[inst.a] == regs[inst.b] { 1 } else { 0 },
    }
    return out;
}

#[derive(Debug)]
struct TestCase {
    inst: Vec<usize>,
    before: Vec<usize>,
    after: Vec<usize>,
}

type Registers = Vec<usize>;

struct Instruction {
    opcode: OpCode,
    a: usize,
    b: usize,
    c: usize,
}

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
enum OpCode {
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

impl OpCode {
    fn from(index: usize) -> OpCode {
        match index {
            0 => OpCode::Addr,
            1 => OpCode::Addi,
            2 => OpCode::Mulr,
            3 => OpCode::Muli,
            4 => OpCode::Banr,
            5 => OpCode::Bani,
            6 => OpCode::Borr,
            7 => OpCode::Bori,
            8 => OpCode::Setr,
            9 => OpCode::Seti,
            10 => OpCode::Gtir,
            11 => OpCode::Gtri,
            12 => OpCode::Gtrr,
            13 => OpCode::Eqir,
            14 => OpCode::Eqri,
            15 => OpCode::Eqrr,
            _ => panic!("out of range"),
        }
    }
}
