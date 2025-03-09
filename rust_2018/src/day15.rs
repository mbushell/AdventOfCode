use std::cmp::Ordering;
use std::{collections::HashMap, fmt::Write};

pub fn solve(data: &str) -> (i32, u32) {
    let mut game = Game::new();

    game.load_map(data);

    let mut rounds = 0;
    while game.take_turn() {
        rounds += 1;
    }

    println!("{} {}", rounds, game.remaining_health());

    let star1 = rounds * game.remaining_health();

    // < 185666 (74*2509)
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
                                attack: 3, // 12
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
                    _ => panic!("Unknown map character '{chr}'"),
                };
            }
        }
    }

    fn take_turn(&mut self) -> bool {
        let mut unit_positions = self.get_unit_positions(None);

        for active_unit_pt in &mut unit_positions {
            let Some(unit) = self.get_unit(&active_unit_pt) else {
                continue; // unit was killed
            };

            let mut targets = self.get_unit_positions(Some(unit.kind));

            if targets.len() == 0 {
                println!(
                    "{} win!",
                    if unit.kind == Kind::Elf {
                        "Elves"
                    } else {
                        "Goblins"
                    }
                );
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
                    println!(
                        "{} died!",
                        if target.kind == Kind::Elf {
                            "Elf"
                        } else {
                            "Goblin"
                        }
                    );
                    self.remove_item(target_pt);
                }
            }
        }

        return true;
    }

    fn move_unit(&mut self, unit_pos: &Point, targets: &Vec<Point>) -> Option<Point> {
        let mut possible_moves = vec![];
        let mut shortest_move = usize::max_value();

        for target_pt in targets {
            for nbr in target_pt.neighbours() {
                if !self.is_open(&nbr) {
                    continue;
                }
                if nbr.is_adjacent(unit_pos) {
                    // skip path finder if tile is adjacent
                    shortest_move = 2;
                    possible_moves.push((nbr, vec![unit_pos.clone(), nbr.clone()]));
                    continue;
                }

                if let Some(path) = self.grid.shortest_path(&unit_pos, &nbr) {
                    shortest_move = std::cmp::min(shortest_move, path.len());
                    possible_moves.push((nbr, path));
                }
            }
        }

        if possible_moves.len() == 0 {
            return None;
        }

        let mut possible_moves = possible_moves
            .iter()
            .filter(|x| x.1.len() == shortest_move)
            .collect::<Vec<_>>();

        possible_moves.sort_by(|a, b| a.0.cmp(&b.0));

        let chosen_dest = possible_moves[0];

        let mut possible_routes = vec![];
        for nbr in unit_pos.neighbours() {
            if !self.is_open(&nbr) {
                continue;
            }

            if nbr == chosen_dest.0 {
                possible_routes.push((nbr, vec![nbr]));
                continue;
            }

            if let Some(path) = self.grid.shortest_path(&nbr, &chosen_dest.0) {
                possible_routes.push((nbr, path));
            }
        }
        possible_routes.sort_by(|a, b| {
            if a.1.len() == b.1.len() {
                a.0.cmp(&b.0)
            } else {
                a.1.len().cmp(&b.1.len())
            }
        });

        let chosen_move = possible_routes[0].0;

        self.move_item(&unit_pos, &chosen_move);
        return Some(chosen_move);
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

    fn has_unit(&self, pt: &Point) -> bool {
        if let Some(cell) = self.grid.get(pt) {
            return matches!(cell, MapItem::Unit(..));
        }
        return false;
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

// Generic types

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

    fn shortest_path(&self, from: &Point, to: &Point) -> Option<Vec<Point>> {
        let mut unvisited = vec![];

        for y in 1..=self.height {
            for x in 1..=self.width {
                let pt = Point::new(x, y);
                if pt != *from && pt != *to && self.get(&pt).is_none() {
                    unvisited.push((pt, -1, None));
                }
            }
        }

        unvisited.push((from.clone(), 0, None));
        unvisited.push((to.clone(), -1, None));

        let mut visited = HashMap::new();

        while unvisited.len() > 0 {
            unvisited.sort_by(|a, b| {
                if a.1 == -1 {
                    Ordering::Less
                } else if b.1 == -1 {
                    Ordering::Greater
                } else {
                    b.1.cmp(&a.1)
                }
            });

            let (pt, dist, prev) = unvisited.pop().unwrap();

            if dist == -1 {
                break;
            }

            for nbr in pt.neighbours() {
                if let Some(qt) = unvisited.iter_mut().find(|x| x.0 == nbr) {
                    if qt.1 == -1 || qt.1 > dist + 1 {
                        qt.1 = dist + 1;
                        qt.2 = Some(pt);
                    }
                }
            }

            visited.insert(pt, (pt.clone(), dist, prev));
        }

        if visited.contains_key(to) {
            let mut path = vec![];
            let mut step = visited.remove(to).unwrap();
            path.push(step.0);
            while step.2.is_some() {
                let pt = step.2.unwrap();
                if let Some(x) = visited.remove(&pt) {
                    step = x;
                } else {
                    // TODO: how we get here??
                    path.push(pt);
                    break;
                }
                path.push(pt);
            }
            return Some(path);
        }

        return None;
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
