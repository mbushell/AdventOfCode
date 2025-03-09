use std::cmp::Ordering;
use std::{collections::HashMap, fmt::Write};

pub fn solve(data: &str) -> (i32, u32) {
    let mut game = Game::new();

    game.load_map(data);

    let mut rounds = 0;
    while game.take_turn() {
        rounds += 1;
    }

    let star1 = rounds * game.remaining_health();

    return (star1, 0);
}

#[derive(Debug)]
struct Unit {
    pos: Point,
    kind: Kind,
    health: i32,
    attack: i32,
}

impl Unit {
    fn is_alive(&self) -> bool {
        self.health >= 0
    }

    fn take_damage(&mut self, amount: i32) {
        self.health -= amount
    }
}

#[derive(PartialEq, Eq, Debug, Clone, Copy)]
enum Kind {
    Elf,
    Goblin,
}

#[derive(Debug)]
enum MapItem {
    Wall,
    Unit(Unit),
}

struct Game {
    grid: Grid<MapItem>,
}

impl Game {
    fn new() -> Game {
        Game {
            grid: Grid::<MapItem>::new(),
        }
    }

    fn load_map(&mut self, data: &str) {
        for (y, line) in data.trim().lines().enumerate() {
            for (x, chr) in line.chars().enumerate() {
                let pt = Point::new(x, y);
                match chr {
                    '.' => self.grid.set(&pt, None),
                    '#' => self.grid.set(&pt, Some(MapItem::Wall)),
                    'E' => {
                        self.add_unit(
                            &pt,
                            Unit {
                                pos: Point::new(0, 0),
                                kind: Kind::Elf,
                                health: 200,
                                attack: 3, // increase for star2
                            },
                        );
                        None
                    }
                    'G' => {
                        self.add_unit(
                            &pt,
                            Unit {
                                pos: Point::new(0, 0),
                                kind: Kind::Goblin,
                                health: 200,
                                attack: 3,
                            },
                        );
                        None
                    }
                    _ => panic!("unknown map character '{chr}'"),
                };
            }
        }
    }

    fn take_turn(&mut self) -> bool {
        for active_unit_pt in &mut self.get_unit_positions(None) {
            let Some(unit) = self.get_unit(&active_unit_pt) else {
                continue; // unit was killed
            };

            let mut targets = self.get_unit_positions(Some(unit.kind));

            if targets.len() == 0 {
                return false;
            }

            let has_unit_in_range = targets
                .iter()
                .find(|target_pt| target_pt.is_adjacent(&active_unit_pt));

            if has_unit_in_range.is_none() {
                if let Some(new_pos) = self.move_unit(&active_unit_pt, &targets) {
                    active_unit_pt.x = new_pos.x;
                    active_unit_pt.y = new_pos.y;
                }
            }

            targets.sort_by(|a, b| {
                let a_hp = self.get_unit(a).unwrap().health;
                let b_hp = self.get_unit(b).unwrap().health;
                if a_hp == b_hp {
                    a.cmp(&b)
                } else {
                    a_hp.cmp(&b_hp)
                }
            });

            if let Some(target_pt) = targets.iter().find(|x| x.is_adjacent(&active_unit_pt)) {
                let damage = self.get_unit(active_unit_pt).unwrap().attack;
                let target = self.get_unit_mut(target_pt).unwrap();
                target.take_damage(damage);

                if !target.is_alive() {
                    self.remove_item(target_pt);
                }
            }
        }

        return true;
    }

    fn move_unit(&mut self, current_pt: &Point, targets: &Vec<Point>) -> Option<Point> {
        let Some(where_to) = self.find_closest(current_pt, targets) else {
            return None;
        };
        let Some(next_pt) = self.find_closest(&where_to, &vec![current_pt.clone()]) else {
            panic!("shouldn't happen...");
        };
        self.move_item(&current_pt, &next_pt);
        return Some(next_pt);
    }

    fn find_closest(&self, from: &Point, targets: &Vec<Point>) -> Option<Point> {
        let mut possible_moves = vec![];
        let mut shortest_move = usize::max_value() - 1;

        for target_pt in targets {
            if target_pt.dist(from) > shortest_move + 1 {
                continue;
            }
            for nbr in target_pt.neighbours() {
                if !self.is_open(&nbr) {
                    continue;
                }

                if nbr.dist(from) > shortest_move {
                    continue;
                }

                if nbr == *from {
                    return Some(from.clone());
                }

                if nbr.is_adjacent(from) {
                    shortest_move = 2;
                    possible_moves.push((nbr, 2));
                    continue;
                }

                let length = self.grid.shortest_distance(&from, &nbr);
                if length > 0 {
                    if length <= shortest_move {
                        shortest_move = std::cmp::min(shortest_move, length);
                        possible_moves.push((nbr, length));
                    }
                }
            }
        }

        if possible_moves.len() == 0 {
            return None;
        }

        possible_moves.sort_by(|a, b| {
            if a.1 == b.1 {
                a.0.cmp(&b.0)
            } else {
                a.1.cmp(&b.1)
            }
        });

        return Some(possible_moves[0].0);
    }

    fn get_unit_positions(&self, avoid: Option<Kind>) -> Vec<Point> {
        let mut unit_positions = Vec::new();
        for y in 1..=self.grid.height {
            for x in 1..=self.grid.width {
                let pt = Point::new(x, y);
                if let Some(unit) = self.get_unit(&pt) {
                    if avoid != Some(unit.kind) {
                        unit_positions.push(pt);
                    }
                }
            }
        }
        return unit_positions;
    }

    fn remaining_health(&self) -> i32 {
        let mut total_health = 0;
        for unit_pos in self.get_unit_positions(None) {
            total_health += self.get_unit(&unit_pos).unwrap().health;
        }
        return total_health;
    }

    fn is_open(&self, pt: &Point) -> bool {
        self.grid.get(pt).is_none()
    }

    fn remove_item(&mut self, pt: &Point) {
        self.grid.set(pt, None);
    }

    fn move_item(&mut self, from: &Point, to: &Point) {
        let mut cell = self.grid.set(from, None);
        if let Some(MapItem::Unit(unit)) = &mut cell {
            unit.pos.x = to.x;
            unit.pos.y = to.y;
        }
        self.grid.set(to, cell);
    }

    fn add_unit(&mut self, pt: &Point, mut unit: Unit) {
        unit.pos.x = pt.x;
        unit.pos.y = pt.y;
        self.grid.set(&pt, Some(MapItem::Unit(unit)));
    }

    fn get_unit(&self, pt: &Point) -> Option<&Unit> {
        if let Some(MapItem::Unit(unit)) = self.grid.get(&pt) {
            return Some(unit);
        }
        return None;
    }

    fn get_unit_mut(&mut self, pt: &Point) -> Option<&mut Unit> {
        if let Some(MapItem::Unit(unit)) = self.grid.get_mut(&pt) {
            return Some(unit);
        }
        return None;
    }
}

impl std::fmt::Display for MapItem {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            MapItem::Wall => f.write_char('#')?,
            MapItem::Unit(Unit {
                kind: Kind::Elf, ..
            }) => f.write_char('E')?,
            MapItem::Unit(Unit {
                kind: Kind::Goblin, ..
            }) => f.write_char('G')?,
        };
        Ok(())
    }
}

#[derive(Copy, Clone, Debug, Eq, Hash, PartialEq, PartialOrd)]
struct Point {
    x: usize,
    y: usize,
}

impl Point {
    fn new(x: usize, y: usize) -> Point {
        Point { x, y }
    }
    fn dist(&self, other: &Point) -> usize {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y)
    }
    fn is_adjacent(&self, other: &Point) -> bool {
        self.dist(other) == 1
    }
    fn up(&self) -> Point {
        Point::new(self.x, self.y - 1)
    }
    fn left(&self) -> Point {
        Point::new(self.x - 1, self.y)
    }
    fn right(&self) -> Point {
        Point::new(self.x + 1, self.y)
    }
    fn down(&self) -> Point {
        Point::new(self.x, self.y + 1)
    }
    fn neighbours(&self) -> Vec<Point> {
        vec![self.up(), self.left(), self.right(), self.down()]
    }
}

impl Ord for Point {
    fn cmp(&self, other: &Point) -> std::cmp::Ordering {
        if self.y == other.y {
            self.x.cmp(&other.x)
        } else {
            self.y.cmp(&other.y)
        }
    }
}

struct Grid<T>
where
    T: std::fmt::Display,
{
    cells: HashMap<Point, Option<T>>,
    width: usize,
    height: usize,
}

impl<T> Grid<T>
where
    T: std::fmt::Display,
{
    fn new() -> Grid<T> {
        Grid::<T> {
            cells: HashMap::new(),
            width: 0,
            height: 0,
        }
    }

    fn has(&self, pt: &Point) -> bool {
        self.cells.contains_key(pt)
    }

    fn get(&self, pt: &Point) -> Option<&T> {
        if let Some(Some(x)) = self.cells.get(pt) {
            return Some(x);
        }
        return None;
    }

    fn get_mut(&mut self, pt: &Point) -> Option<&mut T> {
        if let Some(Some(x)) = self.cells.get_mut(pt) {
            return Some(x);
        }
        return None;
    }

    fn set(&mut self, pt: &Point, data: Option<T>) -> Option<T> {
        self.width = std::cmp::max(self.width, pt.x);
        self.height = std::cmp::max(self.width, pt.y);

        let old = self.cells.insert(pt.clone(), data);
        return if let Some(data) = old { data } else { None };
    }

    fn shortest_distance(&self, from: &Point, to: &Point) -> usize {
        struct Node {
            pt: Point,
            distance: i32,
        }

        let mut unvisited: Vec<Node> = vec![];

        for y in 1..=self.height {
            for x in 1..=self.width {
                let pt = Point::new(x, y);
                if pt != *from && pt != *to && self.get(&pt).is_none() {
                    unvisited.push(Node { pt, distance: -1 });
                }
            }
        }

        unvisited.push(Node {
            pt: from.clone(),
            distance: 0,
        });
        unvisited.push(Node {
            pt: to.clone(),
            distance: -1,
        });

        let mut visited = HashMap::new();

        while unvisited.len() > 0 {
            unvisited.sort_by(|a, b| {
                if a.distance == -1 {
                    Ordering::Less
                } else if b.distance == -1 {
                    Ordering::Greater
                } else {
                    b.distance.cmp(&a.distance)
                }
            });

            let node = unvisited.pop().unwrap();

            if node.distance == -1 {
                break;
            }

            for nbr in node.pt.neighbours() {
                if let Some(qt) = unvisited.iter_mut().find(|x| x.pt == nbr) {
                    if qt.distance == -1 || qt.distance > node.distance + 1 {
                        qt.distance = node.distance + 1;
                    }
                }
            }

            visited.insert(node.pt, node);
        }

        return if let Some(node) = visited.remove(to) {
            (node.distance + 1) as usize
        } else {
            0
        };
    }
}

impl<T> std::fmt::Display for Grid<T>
where
    T: std::fmt::Display,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        for y in 0..=self.height {
            for x in 0..=self.width {
                let pt = Point::new(x, y);
                if self.has(&pt) {
                    if let Some(x) = self.get(&pt) {
                        f.write_str(&x.to_string())?
                    } else {
                        f.write_char('.')?
                    }
                }
            }
            f.write_str("\n")?
        }
        Ok(())
    }
}

impl std::fmt::Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("{},{}", self.x, self.y).to_string())
    }
}
