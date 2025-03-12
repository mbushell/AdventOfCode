use std::collections::HashMap;
use std::fmt::Display;
use std::fmt::Formatter;
use std::fmt::Write;

pub fn solve(data: &str) -> (usize, usize) {
    let mut grid = parse_data(data);
    for _ in 1..=10 {
        grid = evolve(grid);
    }
    let star1 = grid.count(Acre::Trees) * grid.count(Acre::Lumberyard);
    return (star1, 0);
}

fn parse_data(data: &str) -> Grid {
    let mut grid = Grid {
        acres: HashMap::new(),
        size: 0,
    };
    for (y, line) in data.lines().enumerate() {
        for (x, c) in line.chars().enumerate() {
            grid.size = x;
            grid.acres.insert((x, y), c.into());
        }
    }
    return grid;
}

fn evolve(grid: Grid) -> Grid {
    let mut new_grid = Grid {
        acres: HashMap::new(),
        size: grid.size,
    };
    for y in 0..=grid.size {
        for x in 0..=grid.size {
            new_grid.acres.insert(
                (x, y),
                match grid.acres[&(x, y)] {
                    Acre::OpenGround => {
                        if grid.adj_count((x, y), Acre::Trees) >= 3 {
                            Acre::Trees
                        } else {
                            Acre::OpenGround
                        }
                    }
                    Acre::Trees => {
                        if grid.adj_count((x, y), Acre::Lumberyard) >= 3 {
                            Acre::Lumberyard
                        } else {
                            Acre::Trees
                        }
                    }
                    Acre::Lumberyard => {
                        if grid.adj_count((x, y), Acre::Lumberyard) >= 1
                            && grid.adj_count((x, y), Acre::Trees) >= 1
                        {
                            Acre::Lumberyard
                        } else {
                            Acre::OpenGround
                        }
                    }
                },
            );
        }
    }
    return new_grid;
}

#[derive(Copy, Clone, PartialEq, Eq)]
enum Acre {
    OpenGround,
    Trees,
    Lumberyard,
}

struct Grid {
    acres: HashMap<(usize, usize), Acre>,
    size: usize,
}

impl Grid {
    fn count(&self, acre: Acre) -> usize {
        let mut total = 0;
        for y in 0..=self.size {
            for x in 0..=self.size {
                if let Some(&a) = self.acres.get(&(x, y)) {
                    if a == acre {
                        total += 1;
                    }
                }
            }
        }
        return total;
    }

    fn adj_count(&self, (x, y): (usize, usize), acre: Acre) -> usize {
        let mut total = 0;
        let (x, y) = (x as i32, y as i32);
        let neighbours = [
            (x - 1, y - 1),
            (x, y - 1),
            (x + 1, y - 1),
            (x - 1, y),
            (x + 1, y),
            (x - 1, y + 1),
            (x, y + 1),
            (x + 1, y + 1),
        ];
        for pt in neighbours {
            if pt.0 < 0 || pt.1 < 0 {
                continue;
            }
            match self.acres.get(&(pt.0 as usize, pt.1 as usize)) {
                Some(&a) if a == acre => total += 1,
                _ => (),
            }
        }
        return total;
    }
}

impl From<char> for Acre {
    fn from(c: char) -> Self {
        match c {
            '.' => Acre::OpenGround,
            '|' => Acre::Trees,
            '#' => Acre::Lumberyard,
            _ => panic!("uknown character '{c}'"),
        }
    }
}

impl From<&Acre> for char {
    fn from(a: &Acre) -> Self {
        match a {
            Acre::OpenGround => '.',
            Acre::Trees => '|',
            Acre::Lumberyard => '#',
        }
    }
}

impl Display for Grid {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), std::fmt::Error> {
        for y in 0..=self.size {
            for x in 0..=self.size {
                f.write_char(self.acres.get(&(x, y)).unwrap().into())?;
            }
            f.write_char('\n')?;
        }
        return Ok(());
    }
}
