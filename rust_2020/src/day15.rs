use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let mut said = HashMap::new();

    struct Stats {
        count: usize,
        last_said1: usize,
        last_said2: usize,
    }

    let mut numbers = data
        .trim()
        .split_terminator(",")
        .enumerate()
        .map(|(i, n)| {
            let number = n.parse::<usize>().unwrap();
            said.insert(
                number,
                Stats {
                    count: 1,
                    last_said1: 0,
                    last_said2: i,
                },
            );
            return number;
        })
        .collect::<Vec<_>>();

    numbers.reserve(30000000);

    for turn in numbers.len()..30000000 {
        let most_recent = &said[&numbers[turn - 1]];
        let say = if most_recent.count == 1 {
            0
        } else {
            most_recent.last_said2 - most_recent.last_said1
        };
        if !said.contains_key(&say) {
            said.insert(
                say,
                Stats {
                    count: 0,
                    last_said1: 0,
                    last_said2: 0,
                },
            );
        }
        said.entry(say).and_modify(|stats| {
            stats.count += 1;
            stats.last_said1 = stats.last_said2;
            stats.last_said2 = turn;
        });
        numbers.push(say);
    }

    let star1 = numbers[2020 - 1];
    let star2 = numbers[30000000 - 1];

    return (star1, star2);
}
