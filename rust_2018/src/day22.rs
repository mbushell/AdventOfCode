use std::cmp::Ordering;
use std::collections::HashMap;
use std::fmt::{Display, Formatter};
use std::ops::Add;

const PADDING: usize = 3;

pub fn solve(data: &str) -> (usize, usize) {
    let (depth, target) = parse_data(data);

    let mut grid = HashMap::new();

    for y in 0..=(target.y * PADDING) {
        for x in 0..=(target.x * PADDING) {
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

    for y in 0..=(target.y * PADDING) {
        for x in 0..=(target.x * PADDING) {
            let pt = Point { x, y };
            let value = grid[&pt] % 3;
            grid.insert(pt, value);

            if x <= target.x && y <= target.y {
                risk_level += value;
            }
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

fn find_friend(grid: &Grid, target: Point) -> usize {
    struct Node {
        dist: Distance,
        prev: Option<(Point, Equipment)>,
    }

    impl Node {
        fn new(dist: Distance) -> Node {
            Node { dist, prev: None }
        }
    }

    type Unvisited = HashMap<(Point, Equipment), Node>;

    let mut unvisited: Unvisited = HashMap::new();

    for y in 0..=(target.y * PADDING) {
        for x in 0..=(target.x * PADDING) {
            if x == 0 && y == 0 {
                continue;
            }
            let pt = Point { x, y };
            let (a, b) = Terrain::from(grid[&pt]).allowed_equipment();
            unvisited.insert((pt.clone(), a), Node::new(Distance::Infinte));
            unvisited.insert((pt.clone(), b), Node::new(Distance::Infinte));
        }
    }
    unvisited.insert(
        (Point { x: 0, y: 0 }, Equipment::None),
        Node::new(Distance::Finite(0)),
    );

    let mut visited: HashMap<(Point, Equipment), Node> = HashMap::new();

    while unvisited.len() > 0 {
        let (curr_pt, curr_equip, curr_node) = unvisited
            .iter()
            .min_by(|a, b| a.1.dist.cmp(&b.1.dist))
            .map(|((pt, equip), dist)| (pt.clone(), equip.clone(), dist))
            .unwrap();

        if curr_pt == target {
            if let Distance::Finite(distance) = curr_node.dist {
                return distance;
            }
            panic!("unable to reach target");
        }

        let Distance::Finite(curr_dist) = curr_node.dist else {
            break;
        };

        let curr_terrain = Terrain::from(grid[&curr_pt]);

        for nbr in [
            curr_pt.up(),
            curr_pt.down(),
            curr_pt.left(),
            curr_pt.right(),
        ] {
            let Some(nbr) = nbr else {
                continue;
            };
            if !grid.contains_key(&nbr) {
                continue;
            }

            fn check_nbr(
                curr_pt: &Point,
                curr_equip: Equipment,
                curr_dist: usize,
                src_equipment: Equipment,
                dst_equipment: Equipment,
                nbr: &Point,
                unvisited: &mut Unvisited,
            ) {
                if src_equipment != dst_equipment {
                    return;
                }

                let key = (nbr.clone(), dst_equipment);
                let cost = Distance::Finite(
                    curr_dist
                        + if curr_equip == src_equipment {
                            1
                        } else {
                            1 + 7
                        },
                );

                unvisited.entry(key).and_modify(|node| {
                    if cost < node.dist {
                        node.dist = cost;
                        node.prev = Some((curr_pt.clone(), curr_equip));
                    }
                });
            }

            let (src_allowed_equipment_1, src_allowed_equipment_2) =
                curr_terrain.allowed_equipment();

            let (dst_allowed_equipment_1, dst_allowed_equipment_2) =
                Terrain::from(grid[&nbr]).allowed_equipment();

            check_nbr(
                &curr_pt,
                curr_equip,
                curr_dist,
                src_allowed_equipment_1,
                dst_allowed_equipment_1,
                &nbr,
                &mut unvisited,
            );
            check_nbr(
                &curr_pt,
                curr_equip,
                curr_dist,
                src_allowed_equipment_1,
                dst_allowed_equipment_2,
                &nbr,
                &mut unvisited,
            );
            check_nbr(
                &curr_pt,
                curr_equip,
                curr_dist,
                src_allowed_equipment_2,
                dst_allowed_equipment_1,
                &nbr,
                &mut unvisited,
            );
            check_nbr(
                &curr_pt,
                curr_equip,
                curr_dist,
                src_allowed_equipment_2,
                dst_allowed_equipment_2,
                &nbr,
                &mut unvisited,
            );
        }

        let curr_node = unvisited
            .remove(&(curr_pt.clone(), curr_equip.clone()))
            .unwrap();

        visited.insert((curr_pt, curr_equip), curr_node);
    }

    panic!("target not found");
}

#[allow(dead_code)]
fn print_grid(grid: &Grid, target: &Point, path: Option<&Vec<Point>>) {
    for y in 0..(target.y + PADDING) {
        for x in 0..(target.x + PADDING) {
            let pt = Point { x, y };
            if x == 0 && y == 0 {
                print!("M");
            } else if x == target.x && y == target.y {
                print!("T");
            } else if path.is_some_and(|p| p.contains(&pt)) {
                print!("@");
            } else {
                print!("{}", char::from(Terrain::from(grid[&pt])));
            }
        }
        println!();
    }
}

type Grid = HashMap<Point, usize>;

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Point {
    x: usize,
    y: usize,
}

impl Display for Point {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("({},{})", self.x, self.y))
    }
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

#[derive(Debug, Copy, Clone)]
enum Terrain {
    Rocky,
    Wet,
    Narrow,
}

impl Terrain {
    fn allowed_equipment(&self) -> (Equipment, Equipment) {
        match self {
            Terrain::Rocky => (Equipment::ClimbingGear, Equipment::Torch),
            Terrain::Wet => (Equipment::ClimbingGear, Equipment::None),
            Terrain::Narrow => (Equipment::Torch, Equipment::None),
        }
    }
}

impl From<Terrain> for char {
    fn from(terrain: Terrain) -> Self {
        match terrain {
            Terrain::Rocky => '.',
            Terrain::Wet => '=',
            Terrain::Narrow => '|',
        }
    }
}

impl From<Terrain> for usize {
    fn from(terrain: Terrain) -> Self {
        match terrain {
            Terrain::Rocky => 0,
            Terrain::Wet => 1,
            Terrain::Narrow => 2,
        }
    }
}

impl From<usize> for Terrain {
    fn from(value: usize) -> Self {
        match value {
            0 => Terrain::Rocky,
            1 => Terrain::Wet,
            2 => Terrain::Narrow,
            _ => panic!(),
        }
    }
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
enum Equipment {
    None,
    Torch,
    ClimbingGear,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Hash)]
enum Distance {
    Finite(usize),
    Infinte,
}

impl Add<usize> for Distance {
    type Output = Distance;
    fn add(self, value: usize) -> Self {
        let Distance::Finite(dist) = self else {
            return Distance::Infinte;
        };
        return Distance::Finite(dist + value);
    }
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
