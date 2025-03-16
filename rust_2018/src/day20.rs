use std::collections::HashMap;

pub fn solve(data: &str) -> (u32, usize) {
    let path = parse_data(data);
    let mut grid = Grid::new();
    follow_path(&path, Point::new(0, 0), &mut grid);    
    return scan_grid(&mut grid);
}

fn parse_data(data: &str) -> Path {
    let mut tokens = Tokeniser::new(data);
    tokens.consume('^');
    let path = parse_path(&mut tokens);
    tokens.consume('$');
    return path;
}

fn parse_path(tokens: &mut Tokeniser) -> Path {
    let mut path = Path::new();
    while !tokens.is_empty() {
        match tokens.peek() {
            Some('N') => {
                tokens.consume('N');
                path.push(PathPoint::Turn(Direction::North));
            },
            Some('S') => {
                tokens.consume('S');
                path.push(PathPoint::Turn(Direction::South));
            },
            Some('E') => {
                tokens.consume('E');
                path.push(PathPoint::Turn(Direction::East));
            },
            Some('W') => {
                tokens.consume('W');
                path.push(PathPoint::Turn(Direction::West));
            },
            Some ('(') => {
                tokens.consume('(');
                let mut branch = vec![];
                let mut optional = false;
                while !tokens.is_next(')') {
                    if tokens.is_next('|') {
                        tokens.consume('|');
                        if tokens.is_next(')') {
                            optional = true;
                        }
                    } else {
                        branch.push(Box::new(parse_path(tokens)));
                    }
                }
                tokens.consume(')');
                path.push(PathPoint::Branch((branch, optional)));
            },
            _ => break,
        }
    }
    return path;
}

fn follow_path(path: &Path, start_pt: Point, grid: &mut Grid) -> Point {
    let mut i;
    let mut pt = start_pt.clone();

    grid.set(&start_pt, '.');

    let mut queue = vec![(0, start_pt)];

    while queue.len() > 0 {
        (i, pt) = queue.pop().unwrap();

        if i >= path.len() {
            break;
        }

        match &path[i] {
            PathPoint::Turn(Direction::North) => {
                pt.y -= 1;
                grid.set(&pt, '-');
                pt.y -= 1;
                grid.set(&pt, '.');
                queue.push((i+1, pt.clone()));
            },
            PathPoint::Turn(Direction::South) => {
                pt.y += 1;
                grid.set(&pt, '-');
                pt.y += 1;
                grid.set(&pt, '.');
                queue.push((i+1, pt.clone()));
            },
            PathPoint::Turn(Direction::East) => {
                pt.x += 1;
                grid.set(&pt, '|');
                pt.x += 1;
                grid.set(&pt, '.');
                queue.push((i+1, pt.clone()));
            },
            PathPoint::Turn(Direction::West) => {
                pt.x -= 1;
                grid.set(&pt, '|');
                pt.x -= 1;
                grid.set(&pt, '.');
                queue.push((i+1, pt.clone()));
            },
            PathPoint::Branch((options, optional)) => {
                if *optional {
                    queue.push((i+1, pt.clone()));
                }
                for sub_path in options {
                    let qt = follow_path(sub_path,  pt.clone(), grid);
                    grid.set(&qt, '.');
                    queue.push((i+1, qt.clone()));
                }
            },
        }
    }
    return pt;
}

fn scan_grid(grid: &mut Grid) -> (u32, usize) {
    let mut longest_path = 0;
    let mut shortest_path = HashMap::new();
    
    let mut queue = vec![(Point::new(0,0), 0)];
    while queue.len() > 0 {
        let (pt, dist) = queue.pop().unwrap();

        if shortest_path.contains_key(&pt) && dist > shortest_path[&pt] {
            continue;
        }

        shortest_path.insert(pt.clone(), dist);
        longest_path = std::cmp::max(dist, longest_path);

        if grid.is(&pt.up(), '-') {
            queue.push((pt.up().up(), dist + 1));
        }
        if grid.is(&pt.down(), '-') {
            queue.push((pt.down().down(), dist + 1));
        }
        if grid.is(&pt.left(), '|') {
            queue.push((pt.left().left(), dist + 1));
        }
        if grid.is(&pt.right(), '|') {
            queue.push((pt.right().right(), dist + 1));
        }
    }

    return (longest_path, shortest_path.values().filter(|dist| **dist >= 1000).count());
}

struct Tokeniser {
    data: Vec<char>,
    index: usize,
}

impl Tokeniser {
    fn new(data: &str) -> Self {
        Self {
            data: data.chars().collect(),
            index: 0,
        }
    }
    fn is_empty(&self) -> bool {
        self.index >= self.data.len()
    }
    fn peek(&self) -> Option<char> {
        if !self.is_empty() {
            Some(self.data[self.index])
        } else {
            None
        }
    }
    fn is_next(&self, c: char) -> bool {
        if let Some(d) = self.peek() {
            return c == d;
        }
        return false;
    }
    fn next(&mut self) -> Option<char> {
        let result = self.peek();
        self.index += 1;
        return result;
    }
    fn consume(&mut self, c: char)  {
        if let Some(d) = self.next() {
            if d != c {
                panic!("expected character '{c}' but got '{d}'");
            }
            return;
        }
        panic!("expected character '{c}' but got nothing");
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
    fn up(&self) -> Point {
        Point::new(self.x, self.y-1)
    }
    fn down(&self) -> Point {
        Point::new(self.x, self.y+1)
    }
    fn left(&self) -> Point {
        Point::new(self.x-1, self.y)
    }
    fn right(&self) -> Point {
        Point::new(self.x+1, self.y)
    }
}

#[derive(Debug)]
struct Grid {
    cells: HashMap<Point, char>,
    x_min: i32,
    x_max: i32,
    y_min: i32,
    y_max: i32,
}

impl Grid {
    fn new() -> Self {
        Grid {
            cells: HashMap::new(),
            x_min: i32::max_value(),
            x_max: i32::min_value(),
            y_min: i32::max_value(),
            y_max: i32::min_value(),
        }
    }

    fn is(&self, pt: &Point, c: char) -> bool {
        if let Some(&d) = self.get(pt) {
            return d == c;
        }
        return false;
    }

    fn has(&self, pt: &Point) -> bool {
        self.cells.contains_key(&pt)
    }

    fn get(&self, pt: &Point) -> Option<&char> {
        self.cells.get(pt)
    }

    fn set(&mut self, pt: &Point, c: char) {
        self.cells.insert(pt.clone(), c);
        self.x_min = std::cmp::min(pt.x, self.x_min);
        self.x_max = std::cmp::max(pt.x, self.x_max);
        self.y_min = std::cmp::min(pt.y, self.y_min);
        self.y_max = std::cmp::max(pt.y, self.y_max);
    }
    
    #[allow(dead_code)]
    fn print(&self) {
        for y in self.y_min..=self.y_max {
            for x in self.x_min..=self.x_max {
                let pt = Point::new(x, y);
                if self.has(&pt) {
                    print!("{}", self.get(&pt).unwrap());
                } else {
                    print!("#");
                }
            }
            println!();
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

#[derive(Debug)]
enum PathPoint {
    Turn(Direction),
    Branch((Vec<Box<Path>>, bool)),
}

type Path = Vec<PathPoint>;
