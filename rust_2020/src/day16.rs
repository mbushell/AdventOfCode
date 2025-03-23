use regex::Regex;

pub fn solve(data: &str) -> (usize, usize) {
    let (mut fields, ticket, nearby) = parse_data(data);

    let mut star1 = 0;

    let mut valid = nearby
        .iter()
        .filter(|t| {
            let invalid = invalid_values(t, &fields).iter().sum::<usize>();
            star1 += invalid;
            invalid == 0
        })
        .collect::<Vec<_>>();

    valid.push(&ticket);

    let mut possible_indexes = vec![];
    for field in fields.iter_mut() {
        let mut choices = vec![];

        for index in 0..ticket.values.len() {
            let mut all_valid = true;
            for ticket in &valid {
                if !is_value_in_range(&field, ticket.values[index]) {
                    all_valid = false;
                    break;
                }
            }
            if all_valid {
                choices.push(index);
            }
        }
        possible_indexes.push((field, choices));
    }

    possible_indexes.sort_by(|a, b| a.1.len().cmp(&b.1.len()));

    for i in 0..possible_indexes.len() {
        let (first, remaining) = possible_indexes.split_at_mut(i + 1);

        let (field, choices) = &mut first[i];

        if choices.len() != 1 {
            continue;
        }

        field.index = choices[0];

        remaining.iter_mut().for_each(|other| {
            other.1 = other
                .1
                .iter()
                .copied()
                .filter(|x| *x != field.index)
                .collect();
        });
    }

    let mut star2 = 1;
    for field in fields {
        if field.name.starts_with("departure") {
            star2 *= ticket.values[field.index];
        }
    }

    return (star1, star2);
}

fn parse_data(data: &str) -> (Vec<Field>, Ticket, Vec<Ticket>) {
    let mut lines = data.lines();

    let mut fields = vec![];

    let field_regex = Regex::new(r"^(.*): (\d+)-(\d+) or (\d+)-(\d+)$").unwrap();
    while let Some(line) = lines.next() {
        if line == "" {
            break;
        }
        let caps = field_regex.captures(line).unwrap();
        fields.push(Field {
            index: 0,
            name: caps[1].to_string(),
            range1: (caps[2].parse().unwrap(), caps[3].parse().unwrap()),
            range2: (caps[4].parse().unwrap(), caps[5].parse().unwrap()),
        });
    }

    assert_eq!(lines.next().unwrap(), "your ticket:");
    let ticket = parse_ticket(lines.next().unwrap());
    lines.next();

    let mut nearby = vec![];

    assert_eq!(lines.next().unwrap(), "nearby tickets:");
    while let Some(line) = lines.next() {
        nearby.push(parse_ticket(line));
    }

    return (fields, ticket, nearby);

    fn parse_ticket(data: &str) -> Ticket {
        Ticket {
            values: data
                .split(",")
                .map(|x| x.parse::<usize>().unwrap())
                .collect(),
        }
    }
}

fn is_value_in_range(field: &Field, value: usize) -> bool {
    (value >= field.range1.0 && value <= field.range1.1)
        || (value >= field.range2.0 && value <= field.range2.1)
}

fn invalid_values(ticket: &Ticket, fields: &Vec<Field>) -> Vec<usize> {
    let mut invalid_values = vec![];
    for value in &ticket.values {
        let mut in_range = false;
        for field in fields {
            if is_value_in_range(&field, *value) {
                in_range = true;
                break;
            }
        }
        if !in_range {
            invalid_values.push(*value);
        }
    }
    return invalid_values;
}

#[derive(Debug)]
struct Field {
    index: usize,
    name: String,
    range1: (usize, usize),
    range2: (usize, usize),
}

#[derive(Debug)]
struct Ticket {
    values: Vec<usize>,
}
