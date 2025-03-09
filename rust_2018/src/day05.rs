use std::sync::Arc;
use std::thread;

pub fn solve(data: &str) -> (usize, usize) {
    let shared_units: Arc<Vec<char>> = Arc::new(data.trim().chars().collect());

    let star1 = reduce_units((*shared_units).clone());

    let mut thread_pool = Vec::new();
    "abcdefghijklmnopqrstuvwxyz".chars().for_each(|c| {
        let thread_units = Arc::clone(&shared_units);
        thread_pool.push(thread::spawn(move || reduce_without(&thread_units, c)));
    });

    let mut min_length = usize::max_value();
    for join_handler in thread_pool {
        min_length = std::cmp::min(min_length, join_handler.join().unwrap());
    }
    let star2 = min_length;

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

fn reduce_without(units: &Vec<char>, without: char) -> usize {
    let mut copy = Vec::new();
    for unit in units {
        if unit.to_ascii_lowercase() != without {
            copy.push(*unit);
        }
    }
    return reduce_units(copy);
}
