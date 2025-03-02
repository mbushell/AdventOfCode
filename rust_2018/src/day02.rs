use std::collections::HashMap;

pub fn solve(data: &str) -> (i64, String) {
    let star1;
    let mut star2 = String::from("");

    let mut twos: i64 = 0;
    let mut threes: i64 = 0;

    let id_list = parse_data(data);
    for word in &id_list[0..] {
        let (contains_two, contains_three) = check_id(&word);
        if contains_two {
            twos += 1;
        }
        if contains_three {
            threes += 1;
        }
    }
    star1 = twos * threes;

    'outer: for i in 0..id_list.len() {
        for j in i..id_list.len() {
            if let Some(diff_index) = id_difference(&id_list[i], &id_list[j]) {
                let id = id_list[i];
                star2.push_str(&id[0..diff_index]);
                star2.push_str(&id[diff_index + 1..id.len()]);
                break 'outer;
            }
        }
    }

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<&str> {
    let mut id_list = Vec::new();
    for line in data.split_terminator("\n") {
        id_list.push(line.trim());
    }
    return id_list;
}

fn check_id(id: &str) -> (bool, bool) {
    let mut chars = HashMap::new();
    for char in id.chars() {
        let count = chars.entry(char).or_insert(0);
        *count += 1;
    }
    let mut contains_two = false;
    let mut contains_three = false;
    for counts in chars.values() {
        match counts {
            2 => contains_two = true,
            3 => contains_three = true,
            _ => (),
        }
    }
    return (contains_two, contains_three);
}

fn id_difference(a: &str, b: &str) -> Option<usize> {
    let mut first_diff: Option<usize> = None;
    let mut diff_count = 0;
    for i in 0..a.len() {
        if a[i..=i] != b[i..=i] {
            diff_count += 1;
            if first_diff.is_none() {
                first_diff = Some(i);
            }
        }
    }
    return if diff_count == 1 { first_diff } else { None };
}
