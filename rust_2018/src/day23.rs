use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let mut nanobots = parse_data(data);

    nanobots.sort_by(|a, b| b.radius.cmp(&a.radius));

    let strongest = &nanobots[0];

    let star1 = nanobots
        .iter()
        .filter(|bot| bot.pos.dist(&strongest.pos) <= strongest.radius)
        .count();

    return (star1, 0);
}

fn parse_data(data: &str) -> Vec<Nanobot> {
    let mut nanobots = vec![];
    for line in data.trim().lines() {
        // e.g. pos=<89663068,44368890,80128768>, r=95149488
        let mut parts = line.split(", r=");
        let mut pos = parts
            .next()
            .unwrap()
            .strip_prefix("pos=<")
            .unwrap()
            .strip_suffix(">")
            .unwrap()
            .split_terminator(",");

        let radius = parts.next().unwrap();
        nanobots.push(Nanobot {
            id: nanobots.len(),
            pos: Pos {
                x: pos.next().unwrap().parse().unwrap(),
                y: pos.next().unwrap().parse().unwrap(),
                z: pos.next().unwrap().parse().unwrap(),
            },
            radius: radius.parse().unwrap(),
        });
    }
    return nanobots;
}

#[derive(Debug)]
struct Pos {
    x: i32,
    y: i32,
    z: i32,
}

#[derive(Debug)]
struct Nanobot {
    id: usize,
    pos: Pos,
    radius: u32,
}

impl Pos {
    fn dist(&self, other: &Pos) -> u32 {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y) + self.z.abs_diff(other.z)
    }
}
