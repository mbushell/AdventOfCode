use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let layout = Layout::from(data);

    let mut layout1 = layout.clone();
    let mut layout2 = layout.clone();

    while !layout1.evolve(1, 4) {}
    while !layout2.evolve(100, 5) {}

    let star1 = layout1.count('#');
    let star2 = layout2.count('#');

    return (star1, star2);
}

#[derive(Debug)]
struct Layout {
    seats: HashMap<Point, char>,
    width: i32,
    height: i32,
}

impl Layout {
    fn from(data: &str) -> Self {
        let mut layout = Self {
            seats: HashMap::new(),
            width: 0,
            height: 0,
        };
        for (y, line) in data.lines().enumerate() {
            layout.height = y as i32;
            for (x, c) in line.chars().enumerate() {
                layout.seats.insert(
                    Point {
                        x: x as i32,
                        y: y as i32,
                    },
                    c,
                );
                layout.width = x as i32;
            }
        }
        return layout;
    }

    fn in_range(&self, pt: &Point) -> bool {
        pt.x >= 0 && pt.y >= 0 && pt.x <= self.width && pt.y <= self.height
    }

    fn evolve(&mut self, max_dist: i32, tolerance: usize) -> bool {
        let mut seats = self.seats.clone();
        let mut stabalised = true;
        for y in 0..=self.height {
            for x in 0..=self.width {
                let mut occupied = 0;
                [
                    (-1, -1),
                    (0, -1),
                    (1, -1),
                    (-1, 0),
                    (1, 0),
                    (-1, 1),
                    (0, 1),
                    (1, 1),
                ]
                .iter()
                .for_each(|delta| {
                    let mut nbr = Point { x, y };
                    for _ in 1..=max_dist {
                        nbr.x += delta.0;
                        nbr.y += delta.1;
                        if self.in_range(&nbr) {
                            match self.seats[&nbr] {
                                '#' => {
                                    occupied += 1;
                                    return;
                                }
                                'L' => return,
                                _ => (),
                            };
                        }
                    }
                });

                let pt = Point { x, y };
                if self.seats[&pt] == 'L' && occupied == 0 {
                    seats.insert(pt, '#');
                    stabalised = false;
                } else if self.seats[&pt] == '#' && occupied >= tolerance {
                    seats.insert(pt, 'L');
                    stabalised = false;
                }
            }
        }
        self.seats = seats;
        return stabalised;
    }

    fn count(&self, c: char) -> usize {
        self.seats.values().filter(|x| **x == c).count()
    }
}

impl Clone for Layout {
    fn clone(&self) -> Self {
        Self {
            seats: self.seats.clone(),
            width: self.width,
            height: self.height,
        }
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct Point {
    x: i32,
    y: i32,
}
