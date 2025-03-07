use std::collections::HashMap;

pub fn solve(data: &str) -> (i32, i64) {
    let (initial_r, rules) = parse_data(&data);

    let padding: usize = 2000;

    let mut state = String::new();
    state.push_str(&".".repeat(padding));
    state.push_str(initial_r);
    state.push_str(&".".repeat(padding));

    let mut scores = vec![0];
    let mut diffs = vec![0];

    for i in 1..=300 {
        state = generation(state, &rules);
        scores.push(gen_score(&state, padding));

        diffs.push(scores[i] - scores[i - 1]);

        if diffs[i] == diffs[i - 1] && diffs[i] == diffs[i - 2] {
            break;
        }
    }

    let star1 = scores[20];

    let current_score = scores.pop().unwrap() as i64;
    let current_gen = (diffs.len() - 1) as i64;
    let stable_change = diffs.pop().unwrap() as i64;

    let star2 = current_score + (50000000000 - current_gen) * stable_change;

    return (star1, star2);
}

type RuleMap<'a> = HashMap<&'a str, &'a str>;

fn parse_data(data: &str) -> (&str, RuleMap<'_>) {
    let lines: Vec<&str> = data.lines().collect();
    let initial_state = lines[0].split(": ").collect::<Vec<&str>>()[1];

    let mut rules = RuleMap::new();
    for line in lines[2..].iter() {
        // e.g. ..#.. => .
        if line.len() != 10 {
            break;
        }
        rules.insert(&line[0..=4], &line[9..=9]);
    }

    return (initial_state, rules);
}

fn generation(state: String, rules: &RuleMap<'_>) -> String {
    let mut new_state = String::from(".".repeat(state.len()));
    for i in 2..=(state.len() - 3) {
        let key = &state[(i - 2)..=(i + 2)];
        if rules.contains_key(key) {
            new_state.replace_range(i..=i, rules[key]);
        }
    }
    return new_state;
}

fn gen_score(state: &str, zero_offset: usize) -> i32 {
    let mut total: i32 = 0;
    for i in 0..state.len() {
        if state[i..=i].contains("#") {
            total += (i as i32) - (zero_offset as i32);
        }
    }
    return total;
}
