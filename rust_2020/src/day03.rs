use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let grid = Grid::new(data);

    let mut star1 = 0;
    let mut star2 = 1;

    [
        Point { x: 3, y: 1 },
        Point { x: 1, y: 1 },
        Point { x: 5, y: 1 },
        Point { x: 7, y: 1 },
        Point { x: 1, y: 2 },
    ]
    .iter()
    .for_each(|d| {
        let mut tree_count = 0;
        let mut pt = Point { x: 0, y: 0 };
        while pt.y <= grid.height {
            if let Some(c) = grid.get(&pt) {
                if *c == '#' {
                    tree_count += 1;
                }
            }
            pt.move_by(&d);
        }
        if star1 == 0 {
            star1 = tree_count;
        }
        star2 *= tree_count;
    });

    return (star1, star2);
}

#[derive(Debug, PartialEq, Eq, Hash)]
struct Point {
    x: usize,
    y: usize,
}

impl Point {
    fn move_by(&mut self, d: &Point) {
        self.x += d.x;
        self.y += d.y;
    }
}

struct Grid {
    cells: HashMap<Point, char>,
    width: usize,
    height: usize,
}

impl Grid {
    fn new(data: &str) -> Grid {
        let mut grid = Grid {
            cells: HashMap::new(),
            width: 0,
            height: 0,
        };
        data.trim().lines().enumerate().for_each(|(y, line)| {
            line.chars().enumerate().for_each(|(x, c)| {
                grid.cells.insert(Point { x, y }, c);
                grid.width = x;
            });
            grid.height = y;
        });
        return grid;
    }
    fn get(&self, pt: &Point) -> Option<&char> {
        self.cells.get(&Point {
            x: pt.x % (self.width + 1),
            y: pt.y,
        })
    }
}
