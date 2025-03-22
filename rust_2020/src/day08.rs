use std::collections::HashMap;

pub fn solve(data: &str) -> (i32, i32) {
    let mut ops = parse_data(&data);

    let star1 = run_program(&ops).err().unwrap();

    let mut star2 = 0;

    for i in 0..ops.len() {
        let op = ops[i].clone();
        match op {
            Op::Acc(_) => continue,
            Op::Jmp(value) => ops[i] = Op::Nop(value),
            Op::Nop(value) => ops[i] = Op::Jmp(value),
        }
        if let Ok(result) = run_program(&ops) {
            star2 = result;
            break;
        }
        ops[i] = op;
    }

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Op> {
    data.trim()
        .lines()
        .map(|line| {
            let num = line[4..line.len()].parse::<i32>().unwrap();
            match &line[0..3] {
                "acc" => Op::Acc(num),
                "jmp" => Op::Jmp(num),
                "nop" => Op::Nop(num),
                _ => panic!("unknown op: {}", &line[0..3]),
            }
        })
        .collect()
}

fn run_program(ops: &Vec<Op>) -> Result<i32, i32> {
    let mut i = 0;
    let mut g = 0;

    let mut seen = HashMap::new();

    while (i as usize) < ops.len() {
        if seen.contains_key(&i) {
            return Err(g);
        }
        seen.insert(i, true);
        match ops[i as usize] {
            Op::Acc(value) => g += value,
            Op::Jmp(value) => {
                i += value;
                continue;
            }
            Op::Nop(_) => (),
        }
        i += 1;
    }

    return Ok(g);
}

#[derive(Debug, Clone)]
enum Op {
    Acc(i32),
    Jmp(i32),
    Nop(i32),
}
