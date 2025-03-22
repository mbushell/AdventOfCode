use std::collections::HashMap;

type BagMap<'a> = HashMap<&'a str, HashMap<&'a str, usize>>;

pub fn solve(data: &str) -> (usize, usize) {
    let map = parse_data(data.trim());

    let star1 = map
        .keys()
        .filter(|bag| can_contain(&map, bag, "shiny gold"))
        .count();

    let star2 = bags_inside(&map, "shiny gold");

    return (star1, star2);
}

fn parse_data(data: &str) -> BagMap {
    let mut rules = HashMap::new();

    data.lines().for_each(|rule| {
        let mut parts = rule.split_terminator(" bags contain ");
        let bag = parts.next().unwrap();

        let mut bags_inside = HashMap::new();

        parts
            .next()
            .unwrap()
            .strip_suffix('.')
            .unwrap()
            .split_terminator(", ")
            .for_each(|inner_bag| {
                if inner_bag == "no other bags" {
                    return;
                }
                let b = inner_bag.split_once(" ").unwrap();
                let how_many = b.0.parse::<usize>().unwrap();
                let bag_name = if how_many == 1 {
                    b.1.strip_suffix(" bag").unwrap()
                } else {
                    b.1.strip_suffix(" bags").unwrap()
                };
                bags_inside.insert(bag_name, how_many);
            });

        rules.insert(bag, bags_inside);
    });

    return rules;
}

fn can_contain(map: &BagMap, bag: &str, other: &str) -> bool {
    if map[bag].contains_key(other) {
        return true;
    }
    for inner_bag in map[bag].keys() {
        if can_contain(map, inner_bag, other) {
            return true;
        }
    }
    return false;
}

fn bags_inside(map: &BagMap, bag: &str) -> usize {
    let mut total = 0;
    for (inner_bag, quantity) in map[bag].iter() {
        total += quantity * bags_inside(map, inner_bag) + quantity;
    }
    return total;
}
