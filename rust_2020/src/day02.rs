use regex::Regex;

pub fn solve(data: &str) -> (usize, usize) {
    let records = parse_data(&data);

    let star1 = records
        .iter()
        .filter(|(policy, password)| policy.is_valid1(password))
        .count();

    let star2 = records
        .iter()
        .filter(|(policy, password)| policy.is_valid2(password))
        .count();

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<(Policy, Password)> {
    let regex = Regex::new(r"^(\d+)-(\d+) (.): (.+)$").unwrap();
    return data
        .trim()
        .lines()
        .map(|line| {
            let parts = regex.captures(line).unwrap();
            return (
                Policy {
                    number1: parts[1].parse().unwrap(),
                    number2: parts[2].parse().unwrap(),
                    letter: parts[3].chars().nth(0).unwrap(),
                },
                parts[4].to_string(),
            );
        })
        .collect();
}

struct Policy {
    number1: usize,
    number2: usize,
    letter: char,
}

type Password = String;

impl Policy {
    fn is_valid1(&self, password: &str) -> bool {
        let count = password.chars().filter(|c| *c == self.letter).count();
        return count >= self.number1 && count <= self.number2;
    }
    fn is_valid2(&self, password: &str) -> bool {
        let a = password.chars().nth(self.number1 - 1).unwrap() == self.letter;
        let b = password.chars().nth(self.number2 - 1).unwrap() == self.letter;
        return a ^ b;
    }
}
