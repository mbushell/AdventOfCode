use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let locations = parse_data(data);

    let mut tiles: HashMap<HexCoords, bool> = HashMap::new();

    let mut radius = 0;
    for directions in locations {
        let mut coords = HexCoords::origin();
        for nbr in directions {
            coords = coords.nbr(&nbr);
        }
        if tiles.contains_key(&coords) {
            tiles.insert(coords, !tiles[&coords]);
        } else {
            tiles.insert(coords, true);
        }
        radius = std::cmp::max(radius, coords.max_dimension());
    }

    let star1 = tiles.values().filter(|x| **x).count();

    for radius in (radius + 1)..(radius + 101) {
        let mut new_tiles = tiles.clone();

        for q in -radius..=radius {
            for r in -radius..=radius {
                let coords = HexCoords::new(q, r);
                if !tiles.contains_key(&coords) {
                    tiles.insert(coords.clone(), false);
                }

                let count = [
                    coords.nbr(&Nbr::W),
                    coords.nbr(&Nbr::E),
                    coords.nbr(&Nbr::NW),
                    coords.nbr(&Nbr::NE),
                    coords.nbr(&Nbr::SW),
                    coords.nbr(&Nbr::SE),
                ]
                .map(|nbr| {
                    if !tiles.contains_key(&nbr) {
                        0
                    } else {
                        if tiles[&nbr] { 1 } else { 0 }
                    }
                })
                .iter()
                .sum::<usize>();

                match count {
                    0 | 3 | 4 | 5 | 6 if tiles[&coords] => {
                        new_tiles.insert(coords, false);
                    }
                    2 if !tiles[&coords] => {
                        new_tiles.insert(coords, true);
                    }
                    _ => (),
                }
            }
        }

        tiles = new_tiles;
    }

    let star2 = tiles.values().filter(|x| **x).count();

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Vec<Nbr>> {
    let mut tiles = vec![];

    for line in data.lines() {
        let mut i = 0;
        let mut directions = vec![];
        while i < line.len() {
            directions.push(match &line[i..=i] {
                "w" => Nbr::W,
                "e" => Nbr::E,
                "n" => {
                    i += 1;
                    match &line[i..=i] {
                        "w" => Nbr::NW,
                        "e" => Nbr::NE,
                        _ => panic!(),
                    }
                }
                "s" => {
                    i += 1;
                    match &line[i..=i] {
                        "w" => Nbr::SW,
                        "e" => Nbr::SE,
                        _ => panic!(),
                    }
                }
                _ => panic!(),
            });
            i += 1;
        }
        tiles.push(directions);
    }

    return tiles;
}

#[derive(Debug)]
enum Nbr {
    W,
    E,
    NW,
    NE,
    SW,
    SE,
}

#[derive(Hash, PartialEq, Eq, Clone, Copy)]
struct HexCoords {
    q: i32,
    r: i32,
    s: i32,
}

impl HexCoords {
    fn new(q: i32, r: i32) -> Self {
        Self { q, r, s: -q - r }
    }
    fn origin() -> Self {
        Self { q: 0, r: 0, s: 0 }
    }
    fn max_dimension(&self) -> i32 {
        std::cmp::max(std::cmp::max(self.q.abs(), self.r.abs()), self.s.abs())
    }
    fn nbr(&self, nbr: &Nbr) -> Self {
        match nbr {
            Nbr::W => Self {
                q: self.q - 1,
                r: self.r,
                s: self.s + 1,
            },
            Nbr::E => Self {
                q: self.q + 1,
                r: self.r,
                s: self.s - 1,
            },
            Nbr::NW => Self {
                q: self.q,
                r: self.r - 1,
                s: self.s + 1,
            },
            Nbr::NE => Self {
                q: self.q + 1,
                r: self.r - 1,
                s: self.s,
            },
            Nbr::SW => Self {
                q: self.q - 1,
                r: self.r + 1,
                s: self.s,
            },
            Nbr::SE => Self {
                q: self.q,
                r: self.r + 1,
                s: self.s - 1,
            },
        }
    }
}
