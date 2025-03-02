//use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let units: Vec<char> = data.trim().chars().collect();

    let star1 = reduce_units(units.clone());

    let mut min: Option<usize> = None;
    for c in "abcdefghijklmnopqrstuvwxyz".chars() {
        let mut copy = Vec::new();
        for unit in &units {
            if unit.to_ascii_lowercase() != c {
                copy.push(*unit);
            }
        }
        let size = reduce_units(copy);
        min = if min.is_none() {
            Some(size)
        } else {
            Some(std::cmp::min(min.unwrap(), size))
        }
    }
    let star2 = min.unwrap();

    return (star1, star2);
}

fn reduce_units(mut units: Vec<char>) -> usize {
    let mut from: usize = 1;
    loop {
        let Some(i) = find_pair(&units, from) else {
            break;
        };
        units.remove(i + 1);
        units.remove(i);
        from = if i > 1 { i } else { 1 };
    }
    return units.len();
}

fn find_pair(units: &Vec<char>, from: usize) -> Option<usize> {
    for i in from..units.len() {
        let a = units[i - 1];
        let b = units[i];
        if a != b && a.to_ascii_lowercase() == b.to_ascii_lowercase() {
            return Some(i - 1);
        }
    }
    return None;
}
