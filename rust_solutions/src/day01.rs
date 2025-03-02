use std::collections::HashMap;

pub fn solve(data: &str) -> (i64, i64) {
    let star1;
    let star2;

    let change_list = parse_data(data);

    let mut seen_frequencies: HashMap<i64, bool> = HashMap::new();

    let mut frequency = 0;
    for change in &change_list[0..] {
        frequency += change;
        seen_frequencies.insert(frequency, true);
    }

    star1 = frequency;

    'outer: loop {
        for change in &change_list[0..] {
            frequency += change;
            if seen_frequencies.contains_key(&frequency) {
                star2 = frequency;
                break 'outer;
            }
        }
    }

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<i64> {
    let mut numbers = Vec::new();
    for line in data.split_terminator("\n") {
        let number: i64 = line.trim().parse().expect("Parse failed");
        numbers.push(number);
    }
    return numbers;
}
