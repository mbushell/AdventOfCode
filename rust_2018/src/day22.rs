use std::cmp::Ordering;
use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let (depth, target) = parse_data(data);

    let mut grid = HashMap::new();

    for y in 0..=target.y {
        for x in 0..=target.x {
            if (x == 0 && y == 0) || (x == target.x && y == target.y) {
                grid.insert(Point { x, y }, depth % 20183);
            } else if y == 0 {
                grid.insert(Point { x, y }, (x * 16807 + depth) % 20183);
            } else if x == 0 {
                grid.insert(Point { x, y }, (y * 48271 + depth) % 20183);
            } else {
                grid.insert(
                    Point { x, y },
                    (grid[&Point { x: x - 1, y }] * grid[&Point { x, y: y - 1 }] + depth) % 20183,
                );
            }
        }
    }

    let mut risk_level = 0;

    for y in 0..=target.y {
        for x in 0..=target.x {
            risk_level += grid[&Point { x, y }] % 3;
        }
    }

    let shorest_path = find_friend(&grid, target);

    let star1 = risk_level;
    let star2 = shorest_path;

    return (star1, star2);
}

fn parse_data(data: &str) -> (usize, Point) {
    let mut lines = data.lines();
    let depth = lines
        .next()
        .unwrap()
        .split_terminator(": ")
        .skip(1)
        .next()
        .unwrap()
        .parse()
        .unwrap();

    let mut target = Point { x: 0, y: 0 };

    let mut coords = lines
        .next()
        .unwrap()
        .split_terminator(": ")
        .skip(1)
        .next()
        .unwrap()
        .split_terminator(",");

    target.x = coords.next().unwrap().parse().unwrap();
    target.y = coords.next().unwrap().parse().unwrap();

    return (depth, target);
}

fn find_friend(_grid: &Grid, target: Point) -> usize {
    type Node = (Point, Equipment);

    let mut unvisited: HashMap<Node, Distance> = HashMap::new();
    let mut visited: HashMap<Node, Distance> = HashMap::new();

    for y in 0..=target.y {
        for x in 0..=target.x {
            if x == 0 && y == 0 {
                continue;
            }
            unvisited.insert((Point { x, y }, Equipment::None), Distance::Infinte);
            unvisited.insert((Point { x, y }, Equipment::Both), Distance::Infinte);
        }
    }

    let mut queue = vec![(Point { x: 0, y: 0 }, Equipment::Torch, Distance::Finite(0))];

    while queue.len() > 0 {
        queue.sort_by(|a, b| a.2.cmp(&b.2));

        let (pt, equip, dist) = queue.pop().unwrap();

        if matches!(dist, Distance::Infinte) {
            break;
        }

        for nbr in [pt.up(), pt.down(), pt.left(), pt.right()] {
            let Some(_nbr) = nbr else {
                continue;
            };
        }

        visited.insert((pt, equip), dist);
    }

    return 0;
}

type Grid = HashMap<Point, usize>;

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Point {
    x: usize,
    y: usize,
}

impl Point {
    fn up(&self) -> Option<Point> {
        if self.y > 0 {
            Some(Point {
                x: self.x,
                y: self.y - 1,
            })
        } else {
            None
        }
    }
    fn down(&self) -> Option<Point> {
        Some(Point {
            x: self.x,
            y: self.y + 1,
        })
    }
    fn left(&self) -> Option<Point> {
        if self.x > 0 {
            Some(Point {
                x: self.x - 1,
                y: self.y,
            })
        } else {
            None
        }
    }
    fn right(&self) -> Option<Point> {
        Some(Point {
            x: self.x + 1,
            y: self.y,
        })
    }
}

#[derive(Debug, PartialEq, Eq, Hash)]
enum Equipment {
    None,
    Both,
    Torch,
    ClimbingGear,
}

#[derive(PartialEq, Eq, PartialOrd)]
enum Distance {
    Finite(usize),
    Infinte,
}

impl Ord for Distance {
    fn cmp(&self, other: &Self) -> Ordering {
        match (self, other) {
            (Distance::Finite(x), Distance::Finite(y)) => x.cmp(y),
            (Distance::Finite(_), Distance::Infinte) => Ordering::Less,
            (Distance::Infinte, Distance::Finite(_)) => Ordering::Greater,
            (Distance::Infinte, Distance::Infinte) => Ordering::Equal,
        }
    }
}
