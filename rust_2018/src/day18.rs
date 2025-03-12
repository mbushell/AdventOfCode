use std::collections::HashMap;
use std::fmt::Display;
use std::fmt::Formatter;
use std::fmt::Write;

pub fn solve(data: &str) -> (usize, usize) {
    let mut grid = parse_data(data);

    let mut star1 = 0;
    let mut star2 = 0;

    const TARGET: i32 = 1000000000;

    let mut counts = HashMap::new();

    let mut repeat = None;
    let mut shortcut = None;

    for i in 1..=TARGET {
        let (grid_tmp, trees, lumbaryards) = evolve(grid);

        grid = grid_tmp;
        if i == 10 {
            star1 = trees * lumbaryards;
        } else if let Some(i_0) = shortcut {
            if i == i_0 {
                star2 = trees * lumbaryards;
                break;
            }
        }

        let reps = counts.entry((trees, lumbaryards)).or_insert(0);
        *reps += 1;

        if repeat.is_none() && *reps == 4 {
            repeat = Some((i, (trees, lumbaryards)));
        } else if shortcut.is_none() {
            if let Some((i_0, (trees_0, lumberyards_0))) = repeat {
                if trees == trees_0 && lumbaryards == lumberyards_0 {
                    let period = i - i_0;
                    let mut k = i_0 + ((TARGET - i_0) % period);
                    while k < i {
                        k += period;
                    }
                    shortcut = Some(k);
                }
            }
        }
    }

    return (star1, star2);
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

fn evolve(grid: Grid) -> (Grid, usize, usize) {
    let mut new_grid = Grid {
        acres: HashMap::new(),
        size: grid.size,
    };

    let mut trees = 0;
    let mut lumberyards = 0;

    for y in 0..=grid.size {
        for x in 0..=grid.size {
            new_grid.acres.insert(
                (x, y),
                match grid.acres[&(x, y)] {
                    Acre::OpenGround => {
                        if grid.adj_count((x, y), Acre::Trees) >= 3 {
                            trees += 1;
                            Acre::Trees
                        } else {
                            Acre::OpenGround
                        }
                    }
                    Acre::Trees => {
                        if grid.adj_count((x, y), Acre::Lumberyard) >= 3 {
                            lumberyards += 1;
                            Acre::Lumberyard
                        } else {
                            trees += 1;
                            Acre::Trees
                        }
                    }
                    Acre::Lumberyard => {
                        if grid.adj_count((x, y), Acre::Lumberyard) >= 1
                            && grid.adj_count((x, y), Acre::Trees) >= 1
                        {
                            lumberyards += 1;
                            Acre::Lumberyard
                        } else {
                            Acre::OpenGround
                        }
                    }
                },
            );
        }
    }
    return (new_grid, trees, lumberyards);
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
