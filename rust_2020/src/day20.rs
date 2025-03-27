use std::{
    collections::HashMap,
    fmt::{Display, Formatter, Write},
};

pub fn solve(data: &str) -> (usize, usize) {
    let mut tiles: TileMap = parse_data(data);

    find_neighbours(&mut tiles);

    let corners = tiles
        .values()
        .filter(|tile| tile.right_neighbours.len() == 4 && tile.below_neighbours.len() == 4);

    let star1 = corners.map(|tile| tile.id).fold(1, |t, v| t * v);

    return (star1, 0);
}

fn parse_data(data: &str) -> HashMap<usize, Tile> {
    let mut tiles = HashMap::new();

    let mut lines = data.trim().lines();
    while let Some(line) = lines.next() {
        debug_assert!(line.starts_with("Tile "));

        let mut tile = Tile::new(
            line.strip_prefix("Tile ")
                .and_then(|x| x.strip_suffix(":"))
                .and_then(|x| x.parse::<usize>().ok())
                .unwrap(),
        );

        for y in 0..10 {
            let row = lines.next().unwrap();
            for (x, c) in row.chars().enumerate() {
                tile.cells[y][x] = c;
            }
        }

        tiles.insert(tile.id, tile);

        let _ = lines.next();
    }

    return tiles;
}

fn find_neighbours(tiles: &mut TileMap) {
    let keys = tiles.keys().copied().collect::<Vec<_>>();
    'outer: for key in &keys {
        let tile = tiles.get(&key).unwrap().clone();
        for tile in tile.orientations() {
            let mut right_neighbours = 0;
            let mut below_neighbours = 0;
            for key_other in &keys {
                if key == key_other {
                    continue;
                }
                let other = tiles[&key_other].clone();
                for other in other.orientations() {
                    if right_neighbours < 8 {
                        if tile.right_match_with(&other) {
                            right_neighbours += 1;
                            tiles
                                .entry(*key)
                                .and_modify(|t| t.right_neighbours.push(other.clone()));
                        }
                    }
                    if below_neighbours < 8 {
                        if tile.below_match_with(&other) {
                            below_neighbours += 1;
                            tiles
                                .entry(*key)
                                .and_modify(|t| t.below_neighbours.push(other.clone()));
                        }
                    }
                    if right_neighbours == 8 && below_neighbours == 8 {
                        continue 'outer;
                    }
                }
            }
        }
    }
}

type TileMap = HashMap<usize, Tile>;

#[derive(Debug, Clone)]
struct Tile {
    id: usize,
    cells: [[char; 10]; 10],
    reflected: bool,
    rotation: usize,
    right_neighbours: Vec<Tile>,
    below_neighbours: Vec<Tile>,
}

struct TileOrientatonIterator {
    next: Option<Tile>,
}

impl Iterator for TileOrientatonIterator {
    type Item = Tile;
    fn next(&mut self) -> Option<<Self as Iterator>::Item> {
        let next = self.next.take();
        if let Some(tile) = &next {
            if tile.reflected {
                if tile.rotation < 3 {
                    self.next = Some(tile.rotate_clockwise());
                } else {
                    self.next = None;
                }
            } else {
                if tile.rotation < 3 {
                    self.next = Some(tile.rotate_clockwise());
                } else {
                    self.next = Some(tile.rotate_clockwise().reflect_across());
                }
            }
        }
        return next;
    }
}

impl Tile {
    fn new(id: usize) -> Tile {
        Tile {
            id,
            cells: [['.'; 10]; 10],
            reflected: false,
            rotation: 0,
            right_neighbours: vec![],
            below_neighbours: vec![],
        }
    }

    fn orientations(&self) -> impl Iterator<Item = Tile> {
        return TileOrientatonIterator {
            next: Some(self.clone()),
        };
    }

    fn rotate_clockwise(&self) -> Tile {
        let mut rotated = Tile::new(self.id);
        for y in 0..10 {
            for x in 0..10 {
                rotated.cells[y][x] = self.cells[9 - x][y];
            }
        }
        rotated.rotation = (self.rotation + 1) % 4;
        rotated.reflected = self.reflected;
        return rotated;
    }

    fn reflect_across(&self) -> Tile {
        let mut reflected = Tile::new(self.id);
        for y in 0..10 {
            for x in 0..10 {
                reflected.cells[y][x] = self.cells[y][9 - x];
            }
        }
        reflected.reflected = !self.reflected;
        reflected.rotation = self.rotation;
        return reflected;
    }

    fn right_match_with(&self, other: &Tile) -> bool {
        for y in 0..10 {
            if self.cells[y][9] != other.cells[y][0] {
                return false;
            }
        }
        return true;
    }

    fn below_match_with(&self, other: &Tile) -> bool {
        for x in 0..10 {
            if self.cells[9][x] != other.cells[0][x] {
                return false;
            }
        }
        return true;
    }
}

impl Tile {
    #[allow(dead_code)]
    fn desc(&self) -> String {
        format!(
            "T{:04}({}, {})",
            self.id,
            self.rotation,
            if self.reflected { 'T' } else { 'F' }
        )
    }
}

impl Display for Tile {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("Tile {}:\n", self.id))?;
        for y in 0..10 {
            for x in 0..10 {
                f.write_char(self.cells[y][x])?;
                f.write_char(' ')?;
            }
            f.write_char('\n')?;
        }
        f.write_char('\n')?;
        return Ok(());
    }
}
