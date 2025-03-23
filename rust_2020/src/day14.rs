use std::collections::HashMap;

pub fn solve(data: &str) -> (u64, u64) {
    let ops = parse_data(data);

    let star1 = run(&ops, Version::MaskValue);
    let star2 = run(&ops, Version::MaskAddr);

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Op> {
    let mut ops = vec![];
    for line in data.trim().lines() {
        if line.starts_with("mask = ") {
            ops.push(Op::Mask(&line["mask = ".len()..]));
            continue;
        }
        let mut parts = line.split(" = ");
        ops.push(Op::Mem(
            parts
                .next()
                .and_then(|x| x.strip_prefix("mem["))
                .and_then(|x| x.strip_suffix("]"))
                .and_then(|x| x.parse::<u64>().ok())
                .unwrap(),
            parts.next().unwrap().parse().unwrap(),
        ));
    }
    return ops;
}

enum Version {
    MaskValue,
    MaskAddr,
}

fn run(ops: &Vec<Op>, version: Version) -> u64 {
    let mut mem = HashMap::new();
    let mut active_mask = "";

    for op in ops {
        match op {
            Op::Mask(mask) => active_mask = mask,
            Op::Mem(addr, value) => match version {
                Version::MaskValue => {
                    mem.insert(*addr, mask_value(active_mask, *value));
                }
                Version::MaskAddr => {
                    for addr in mask_address(active_mask, *addr) {
                        mem.insert(addr, *value);
                    }
                }
            },
        }
    }
    return mem.values().sum();
}

fn mask_value(mask: &str, mut value: u64) -> u64 {
    let mask_len: u32 = 36;
    for (i, c) in mask.chars().enumerate() {
        let nth = 1 << (mask_len - 1 - i as u32);
        match c {
            '0' => {
                let all = 2_u64.pow(mask_len) - 1;
                value &= all ^ nth;
            }
            '1' => {
                value |= nth;
            }
            _ => continue,
        }
    }
    return value;
}

fn mask_address(mask: &str, mut value: u64) -> Vec<u64> {
    let mask_len: u32 = 36;

    let mut floating_bits = vec![];
    for (i, c) in mask.chars().enumerate() {
        let nth = 1 << (mask_len - 1 - i as u32);
        match c {
            '0' => (),
            '1' => {
                value |= nth;
            }
            'X' => {
                let all = 2_u64.pow(mask_len) - 1;
                value &= all ^ nth;
                floating_bits.push(nth);
            }
            _ => continue,
        }
    }

    let mut all = vec![value];
    if floating_bits.len() <= 16 {
        for mask in &floating_bits {
            let mut new_all = vec![];
            for a in all {
                new_all.push(a);
                new_all.push(a | mask);
            }
            all = new_all;
        }
    }

    return all;
}

#[derive(Debug)]
enum Op<'a> {
    Mask(&'a str),
    Mem(u64, u64),
}
