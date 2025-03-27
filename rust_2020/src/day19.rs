use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let (mut rules, messages) = parse_data(data);

    let rule0 = &rules.get(&0).unwrap();
    let star1 = messages
        .iter()
        .filter(|message| matches(&rule0, message, &rules))
        .count();

    let (id, rule) = parse_rule("8: 42 | 42 8");
    rules.insert(id, rule);
    let (id, rule) = parse_rule("11: 42 31 | 42 11 31");
    rules.insert(id, rule);

    let rule0 = &rules.get(&0).unwrap();
    let star2 = messages
        .iter()
        .filter(|message| matches(&rule0, message, &rules))
        .count();

    return (star1, star2);
}

fn parse_data(data: &str) -> (RuleSet, Vec<&str>) {
    let mut lines = data.trim().lines();

    let mut rules = HashMap::new();
    while let Some(line) = lines.next() {
        if line == "" {
            break;
        }
        let (id, rule) = parse_rule(line);
        rules.insert(id, rule);
    }

    let messages = lines.collect::<Vec<_>>();

    return (rules, messages);
}

fn parse_rule(line: &str) -> (RuleID, Rule) {
    let Some((id, rest)) = line.split_once(": ") else {
        panic!();
    };
    let id = id.parse::<RuleID>().unwrap();
    if rest.starts_with("\"") {
        let c = rest.chars().nth(1).unwrap();
        return (id, Rule::Letter(c));
    } else {
        let mut rest = rest.split_terminator(" ");
        let mut list1: RuleList = vec![];
        let mut list2: RuleList = vec![];

        let mut active_list = &mut list1;
        while let Some(x) = rest.next() {
            if x != "|" {
                active_list.push(x.parse().unwrap());
            } else {
                active_list = &mut list2;
            }
        }

        if list2.len() > 0 {
            return (
                id,
                Rule::Alternate(
                    Box::new(Rule::Sequence(list1)),
                    Box::new(Rule::Sequence(list2)),
                ),
            );
        } else {
            return (id, Rule::Sequence(list1));
        }
    }
}

fn matches(rule: &Rule, message: &str, rules: &RuleSet) -> bool {
    let chars = message.chars().collect::<Vec<_>>();
    let (_, up_to) = try_to_match(rule, &chars, 0, rules);

    return up_to == chars.len();
}

fn try_to_match(rule: &Rule, chars: &Vec<char>, from: usize, rules: &RuleSet) -> (bool, usize) {
    match rule {
        Rule::Letter(c) => {
            if from >= chars.len() {
                return (false, from);
            }
            if chars[from] == *c {
                return (chars[from] == *c, from + 1);
            } else {
                return (false, from);
            }
        }
        Rule::Sequence(list) => {
            let mut from = from;
            for id in list {
                let rule = rules.get(id).unwrap();
                let (matched, upto) = try_to_match(rule, chars, from, rules);
                if !matched {
                    return (false, from);
                }
                from = upto;
            }
            return (true, from);
        }
        Rule::Alternate(rule1, rule2) => {
            let (matched, upto) = try_to_match(rule1, chars, from, rules);
            if matched {
                return (matched, upto);
            }
            return try_to_match(rule2, chars, from, rules);
        }
    }
}

type RuleID = usize;
type RuleSet = HashMap<RuleID, Rule>;
type RuleList = Vec<RuleID>;

#[derive(Debug)]
enum Rule {
    Letter(char),
    Sequence(RuleList),
    Alternate(Box<Rule>, Box<Rule>),
}
