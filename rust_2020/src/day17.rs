use std::{collections::HashMap, fmt::Write};

pub fn solve(data: &str) -> (usize, usize) {
    let mut grid = Grid::from_data(data);
    for _ in 1..=6 {
        grid.cycle(false);
    }
    let star1 = grid.count(Cube::Active);

    let mut grid = Grid::from_data(data);
    for _ in 1..=6 {
        grid.cycle(true);
    }
    let star2 = grid.count(Cube::Active);

    return (star1, star2);
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum Cube {
    Active,
    Inactive,
}

#[derive(Debug, Hash, PartialEq, Eq, Clone)]
struct Point {
    x: i32,
    y: i32,
    z: i32,
    w: i32,
}

#[derive(Debug)]
struct Grid {
    cells: HashMap<Point, Cube>,
    nbrs: HashMap<Point, Vec<Point>>,
    min_x: i32,
    max_x: i32,
    min_y: i32,
    max_y: i32,
    min_z: i32,
    max_z: i32,
    min_w: i32,
    max_w: i32,
}

impl Grid {
    fn from_data(data: &str) -> Self {
        let mut grid = Grid {
            cells: HashMap::new(),
            nbrs: HashMap::new(),
            min_x: 0,
            max_x: 0,
            min_y: 0,
            max_y: 0,
            min_z: 0,
            max_z: 0,
            min_w: 0,
            max_w: 0,
        };

        for (y, line) in data.lines().enumerate() {
            grid.min_y = std::cmp::min(grid.min_y, y as i32);
            grid.max_y = std::cmp::max(grid.max_y, y as i32);
            for (x, c) in line.chars().enumerate() {
                let pt = Point::new(x as i32, y as i32, 0, 0);
                grid.min_x = std::cmp::min(grid.min_x, pt.x);
                grid.max_x = std::cmp::max(grid.max_x, pt.x);
                grid.cells.insert(pt, c.into());
            }
        }

        return grid;
    }

    fn cycle(&mut self, use_4th_dimension: bool) {
        // expand dimensions
        self.min_x -= 1;
        self.max_x += 1;
        self.min_y -= 1;
        self.max_y += 1;
        self.min_z -= 1;
        self.max_z += 1;

        if use_4th_dimension {
            self.min_w -= 1;
            self.max_w += 1;
        }

        let mut copy = self.cells.clone();

        for w in self.min_w..=self.max_w {
            for z in self.min_z..=self.max_z {
                for y in self.min_y..=self.max_y {
                    for x in self.min_x..=self.max_x {
                        let pt = Point::new(x, y, z, w);

                        if !self.cells.contains_key(&pt) {
                            self.cells.insert(pt.clone(), Cube::Inactive);
                        }

                        let nbrs = self.nbrs.entry(pt.clone()).or_insert(pt.neighbours());

                        let active = nbrs
                            .iter()
                            .map(|nbr| {
                                if !self.cells.contains_key(&nbr) {
                                    return 0;
                                }
                                return match self.cells[&nbr] {
                                    Cube::Active => 1,
                                    Cube::Inactive => 0,
                                };
                            })
                            .sum::<usize>();

                        if matches!(self.cells[&pt], Cube::Active) {
                            if active < 2 || active > 3 {
                                copy.insert(pt, Cube::Inactive);
                            }
                        } else {
                            if active == 3 {
                                copy.insert(pt, Cube::Active);
                            }
                        }
                    }
                }
            }
        }

        self.cells = copy;
    }

    fn count(&self, cube: Cube) -> usize {
        self.cells.values().filter(|cell| **cell == cube).count()
    }
}

impl std::fmt::Display for Grid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        let w = 0;
        for z in self.min_z..=self.max_z {
            f.write_str(&format!("z={z}\n"))?;
            for y in self.min_y..=self.max_y {
                for x in self.min_x..=self.max_x {
                    f.write_char(
                        self.cells
                            .get(&Point::new(x, y, z, w))
                            .or_else(|| Some(&Cube::Inactive))
                            .unwrap()
                            .into(),
                    )?;
                }
                f.write_char('\n')?;
            }
        }

        return Ok(());
    }
}

impl From<char> for Cube {
    fn from(c: char) -> Self {
        match c {
            '#' => Cube::Active,
            '.' => Cube::Inactive,
            _ => panic!(),
        }
    }
}

impl From<&Cube> for char {
    fn from(cube: &Cube) -> Self {
        match cube {
            Cube::Active => '#',
            Cube::Inactive => '.',
        }
    }
}

impl Point {
    fn new(x: i32, y: i32, z: i32, w: i32) -> Self {
        Point { x, y, w, z }
    }

    fn neighbours(&self) -> Vec<Point> {
        let mut nbrs = vec![];
        for dw in [-1, 0, 1] {
            for dz in [-1, 0, 1] {
                for dy in [-1, 0, 1] {
                    for dx in [-1, 0, 1] {
                        if dx == 0 && dy == 0 && dz == 0 && dw == 0 {
                            continue;
                        }
                        nbrs.push(Point::new(
                            self.x + dx,
                            self.y + dy,
                            self.z + dz,
                            self.w + dw,
                        ))
                    }
                }
            }
        }
        return nbrs;
    }
}
