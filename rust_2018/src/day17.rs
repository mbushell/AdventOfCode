use regex::Regex;
use std::collections::HashMap;

pub fn solve(data: &str) -> (u32, u32) {
    let mut grid = create_grid(&parse_data(data));

    trace_water(&mut grid);

    let (star1, star2): (u32, u32) = count_water(&grid);

    return (star1, star2);
}

fn parse_data(data: &str) -> VeinData {
    let mut result = VeinData {
        veins: vec![],
        min_x: usize::max_value(),
        min_y: usize::max_value(),
        max_x: 0,
        max_y: 0,
    };

    let regex1 = Regex::new(r"x=(\d+), y=(\d+)..(\d+)").unwrap();
    let regex2 = Regex::new(r"y=(\d+), x=(\d+)..(\d+)").unwrap();

    for line in data.trim().lines() {
        if let Some(matches) = regex1.captures(line) {
            let x = matches[1].parse::<usize>().unwrap();
            let y1 = matches[2].parse::<usize>().unwrap();
            let y2 = matches[3].parse::<usize>().unwrap();
            let vein = Vein {
                t: VeinDirection::Vertical,
                x: Value::Single(x),
                y: Value::Range((y1, y2)),
            };
            result.veins.push(vein);
            result.min_x = std::cmp::min(result.min_x, x);
            result.max_x = std::cmp::max(result.max_x, x);
            result.min_y = std::cmp::min(result.min_y, y1);
            result.min_y = std::cmp::min(result.min_y, y2);
            result.max_y = std::cmp::max(result.max_y, y1);
            result.max_y = std::cmp::max(result.max_y, y2);
            continue;
        }
        if let Some(matches) = regex2.captures(line) {
            let y = matches[1].parse::<usize>().unwrap();
            let x1 = matches[2].parse::<usize>().unwrap();
            let x2 = matches[3].parse::<usize>().unwrap();
            let vein = Vein {
                t: VeinDirection::Horizontal,
                x: Value::Range((x1, x2)),
                y: Value::Single(y),
            };
            result.veins.push(vein);
            result.min_x = std::cmp::min(result.min_x, x1);
            result.min_x = std::cmp::min(result.min_x, x2);
            result.max_x = std::cmp::max(result.max_x, x1);
            result.max_x = std::cmp::max(result.max_x, x2);
            result.min_y = std::cmp::min(result.min_y, y);
            result.max_y = std::cmp::max(result.max_y, y);
            continue;
        }
        break;
    }

    if result.min_x > 0 {
        result.min_x -= 1;
    }
    result.max_x += 1;

    return result;
}

fn create_grid(data: &VeinData) -> Grid {
    let mut grid = Grid {
        cells: HashMap::new(),
        min_x: data.min_x,
        min_y: data.min_y,
        max_x: data.max_x,
        max_y: data.max_y,
    };

    for y in 0..=data.max_y {
        for x in data.min_x..=data.max_x {
            grid.cells.insert((x, y), '.');
        }
    }

    grid.cells.insert((500, 0), '+');

    for vein in &data.veins {
        match vein.t {
            VeinDirection::Vertical => {
                let Value::Single(x) = vein.x else { panic!() };
                let Value::Range((y1, y2)) = vein.y else {
                    panic!();
                };
                for y in y1..=y2 {
                    grid.cells.insert((x, y), '#');
                }
            }
            VeinDirection::Horizontal => {
                let Value::Range((x1, x2)) = vein.x else {
                    panic!();
                };
                let Value::Single(y) = vein.y else { panic!() };
                for x in x1..=x2 {
                    grid.cells.insert((x, y), '#');
                }
            }
        }
    }

    return grid;
}

fn trace_water(grid: &mut Grid) {
    let mut queue = vec![(500, 1)];

    while queue.len() > 0 {
        let (x, y) = queue.pop().unwrap();

        let curr = if (y < grid.max_y && matches!(grid.cells[&(x, y + 1)], '|' | '.'))
            || y == grid.max_y
        {
            '|'
        } else {
            '~'
        };
        grid.cells.insert((x, y), curr);

        if y == grid.max_y {
            continue;
        }

        match grid.cells[&(x, y + 1)] {
            '.' => {
                queue.push((x, y + 1));
            }
            '|' => {
                // another branch has already been here
            }
            '~' | '#' => {
                let mut overflows = false;

                let mut l = x - 1;
                while l >= grid.min_x && matches!(grid.cells[&(l, y)], '.' | '|') {
                    if !matches!(grid.cells[&(l, y + 1)], '~' | '#') {
                        overflows = true;
                        break;
                    }
                    l -= 1;
                }
                l += 1;

                let mut r = x + 1;
                while r <= grid.max_x && matches!(grid.cells[&(r, y)], '.' | '|') {
                    if !matches!(grid.cells[&(r, y + 1)], '~' | '#') {
                        overflows = true;
                        break;
                    }
                    r += 1;
                }
                r -= 1;

                for x in l..=r {
                    grid.cells.insert((x, y), if overflows { '|' } else { '~' });
                }

                if overflows {
                    if l > grid.min_x && grid.cells[&(l - 1, y)] == '.' {
                        queue.push((l - 1, y));
                    }
                    if r < grid.max_x && grid.cells[&(r + 1, y)] == '.' {
                        queue.push((r + 1, y));
                    }
                } else {
                    if y > 0 {
                        queue.push((x, y - 1));
                    }
                }
            }
            _ => panic!(),
        }
    }
}

fn count_water(grid: &Grid) -> (u32, u32) {
    let mut total = 0;
    let mut drain_total = 0;
    for y in grid.min_y..=grid.max_y {
        for x in grid.min_x..=grid.max_x {
            if matches!(grid.cells[&(x, y)], '~' | '|') {
                total += 1;
                if grid.cells[&(x, y)] == '~' {
                    drain_total += 1;
                }
            }
        }
    }
    return (total, drain_total);
}

#[allow(dead_code)]
fn print_grid(grid: &Grid) {
    for y in 0..=grid.max_y {
        for x in grid.min_x..=grid.max_x {
            print!("{}", grid.cells[&(x, y)]);
        }
        println!();
    }
    println!();
}

struct Grid {
    cells: HashMap<(usize, usize), char>,
    min_x: usize,
    min_y: usize,
    max_x: usize,
    max_y: usize,
}

#[derive(Debug)]
enum Value {
    Single(usize),
    Range((usize, usize)),
}

#[derive(Debug)]
enum VeinDirection {
    Horizontal,
    Vertical,
}

#[derive(Debug)]
struct Vein {
    t: VeinDirection,
    x: Value,
    y: Value,
}

#[derive(Debug)]
struct VeinData {
    veins: Vec<Vein>,
    min_x: usize,
    max_x: usize,
    min_y: usize,
    max_y: usize,
}
