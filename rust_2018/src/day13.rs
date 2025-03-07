use std::cell::RefCell;
use std::cell::RefMut;
use std::collections::HashMap;
use std::rc::Rc;
use std::rc::Weak;

pub fn solve(data: &str) -> (String, String) {
    let (mut track, mut carts) = parse_data(data);

    let mut star1 = String::from("");
    let mut star2 = String::from("");

    loop {
        if let Some(crash_site) = tick(&mut track, &mut carts) {
            if star1 == "" {
                star1 = crash_site;
            }
        }
        let mut carts_left = carts.iter().filter(|cart| cart.borrow().alive);
        let cart = carts_left.next();
        if carts_left.next().is_none() {
            if let Some(cart) = cart {
                let pos = cart.borrow().pos;
                star2 = format!("{},{}", pos.0, pos.1);
            }
            break;
        }
    }

    return (star1, star2);
}

fn parse_data(data: &str) -> (Track, Carts) {
    let mut track = Track {
        tiles: HashMap::new(),
        width: 0,
        height: 0,
    };
    let mut carts = Carts::new();

    for (y, line) in data.lines().enumerate() {
        track.height = y as u32;
        for (x, c) in line.chars().enumerate() {
            track.width = x as u32;
            let pos = (x as u32, y as u32);
            match c {
                '^' => {
                    carts.push(Rc::new(RefCell::new(Cart {
                        pos,
                        dir: Direction::North,
                        int: Intersection::Left,
                        alive: true,
                    })));
                    track.tiles.insert(pos, ('|', None));
                }
                'v' => {
                    carts.push(Rc::new(RefCell::new(Cart {
                        pos,
                        dir: Direction::South,
                        int: Intersection::Left,
                        alive: true,
                    })));
                    track.tiles.insert(pos, ('|', None));
                }
                '<' => {
                    carts.push(Rc::new(RefCell::new(Cart {
                        pos,
                        dir: Direction::West,
                        int: Intersection::Left,
                        alive: true,
                    })));
                    track.tiles.insert(pos, ('-', None));
                }
                '>' => {
                    carts.push(Rc::new(RefCell::new(Cart {
                        pos,
                        dir: Direction::East,
                        int: Intersection::Left,
                        alive: true,
                    })));
                    track.tiles.insert(pos, ('-', None));
                }
                _ => {
                    track.tiles.insert(pos, (c, None));
                }
            }
        }
    }

    for cart in &carts {
        let x = cart.borrow();
        track
            .tiles
            .entry(x.pos)
            .and_modify(|x| x.1 = Some(Rc::downgrade(&cart)));
    }

    return (track, carts);
}

fn tick(track: &mut Track, carts: &mut Carts) -> Option<String> {
    carts.sort_by(|a, b| {
        let a = a.borrow();
        let b = b.borrow();
        if a.pos.1 == b.pos.1 {
            a.pos.0.cmp(&b.pos.0)
        } else {
            a.pos.1.cmp(&b.pos.1)
        }
    });

    let mut first_crash_site = None;

    carts.iter_mut().for_each(|cart| {
        if !cart.borrow().alive {
            return;
        }

        track.tiles.entry(cart.borrow().pos).and_modify(|tile| {
            tile.1 = None;
        });

        {
            let mut cart: RefMut<'_, Cart> = cart.borrow_mut();
            match cart.dir {
                Direction::North => cart.pos.1 -= 1,
                Direction::South => cart.pos.1 += 1,
                Direction::West => cart.pos.0 -= 1,
                Direction::East => cart.pos.0 += 1,
            }

            let tile = track.tiles[&cart.pos].0;

            cart.dir = cart.next(tile);
            if tile == '+' {
                cart.int = cart.int.next();
            }
        }

        let pos = cart.borrow().pos;

        track.tiles.entry(pos).and_modify(|tile| {
            if tile.1.is_some() {
                if first_crash_site.is_none() {
                    let crash_site = cart.borrow().pos;
                    first_crash_site = Some(format!("{},{}", crash_site.0, crash_site.1));
                }
                cart.borrow_mut().alive = false;
                let other = tile.1.take().unwrap().upgrade().unwrap();
                other.borrow_mut().alive = false;
            } else {
                tile.1 = Some(Rc::downgrade(cart));
            }
        });
    });

    return first_crash_site;
}

#[allow(dead_code)]
fn draw_track(track: &Track) {
    for y in 0..=track.height {
        for x in 0..=track.width {
            let tile = &track.tiles[&(x, y)];
            if let Some(cart) = &tile.1 {
                print!("{} ", cart.upgrade().unwrap().borrow().dir);
            } else {
                print!("{} ", track.tiles[&(x, y)].0);
            }
        }
        println!();
    }
    println!();
}

struct Track {
    tiles: HashMap<(u32, u32), (char, Option<Weak<RefCell<Cart>>>)>,
    width: u32,
    height: u32,
}
type Carts = Vec<Rc<RefCell<Cart>>>;

#[derive(Debug)]
struct Cart {
    pos: (u32, u32),
    dir: Direction,
    int: Intersection,
    alive: bool,
}

impl Cart {
    fn next(&self, tile: char) -> Direction {
        if tile == '+' {
            match self.int {
                Intersection::Left => match self.dir {
                    Direction::North => Direction::West,
                    Direction::South => Direction::East,
                    Direction::West => Direction::South,
                    Direction::East => Direction::North,
                },
                Intersection::Straight => match self.dir {
                    Direction::North => Direction::North,
                    Direction::South => Direction::South,
                    Direction::West => Direction::West,
                    Direction::East => Direction::East,
                },
                Intersection::Right => match self.dir {
                    Direction::North => Direction::East,
                    Direction::South => Direction::West,
                    Direction::West => Direction::North,
                    Direction::East => Direction::South,
                },
            }
        } else {
            self.dir.next(tile)
        }
    }
}

#[derive(Debug)]
enum Direction {
    North,
    South,
    East,
    West,
}

impl Direction {
    fn next(&self, tile: char) -> Self {
        match (self, tile) {
            (Direction::North, '/') => Direction::East,
            (Direction::South, '/') => Direction::West,
            (Direction::West, '/') => Direction::South,
            (Direction::East, '/') => Direction::North,

            (Direction::North, '\\') => Direction::West,
            (Direction::South, '\\') => Direction::East,
            (Direction::West, '\\') => Direction::North,
            (Direction::East, '\\') => Direction::South,

            (Direction::North, '|') => Direction::North,
            (Direction::South, '|') => Direction::South,

            (Direction::West, '-') => Direction::West,
            (Direction::East, '-') => Direction::East,

            _ => panic!("Uh oh..."),
        }
    }
}

#[derive(Debug)]
enum Intersection {
    Left,
    Straight,
    Right,
}

impl Intersection {
    fn next(&self) -> Self {
        match self {
            Self::Left => Self::Straight,
            Self::Straight => Self::Right,
            Self::Right => Self::Left,
        }
    }
}

impl std::fmt::Display for Direction {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        let _ = f.write_str(match self {
            Direction::North => "^",
            Direction::South => "v",
            Direction::West => "<",
            Direction::East => ">",
        });
        Ok(())
    }
}
