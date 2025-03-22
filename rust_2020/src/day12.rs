type Instructions<'a> = Vec<(&'a str, i32)>;

pub fn solve(data: &str) -> (u32, u32) {
    let instructions = data
        .trim()
        .lines()
        .map(|line| (&line[0..=0], line[1..].parse::<i32>().unwrap()))
        .collect::<Vec<_>>();

    let star1 = sail_ship(&instructions, Point { x: 1, y: 0 }, false);
    let star2 = sail_ship(&instructions, Point { x: 10, y: 1 }, true);

    return (star1, star2);
}

fn sail_ship(instructions: &Instructions, mut direction: Point, use_waypoint: bool) -> u32 {
    let mut position = Point { x: 0, y: 0 };
    for (action, distance) in instructions {
        match *action {
            "N" => {
                if use_waypoint {
                    direction.y += distance
                } else {
                    position.y += distance
                }
            }
            "S" => {
                if use_waypoint {
                    direction.y -= distance
                } else {
                    position.y -= distance
                }
            }
            "E" => {
                if use_waypoint {
                    direction.x += distance
                } else {
                    position.x += distance
                }
            }
            "W" => {
                if use_waypoint {
                    direction.x -= distance
                } else {
                    position.x -= distance
                }
            }
            "L" => direction.rotate(*distance),
            "R" => direction.rotate(360 - *distance),
            "F" => {
                position.x += direction.x * distance;
                position.y += direction.y * distance;
            }
            _ => panic!(),
        }
    }
    return position.dist(&Point { x: 0, y: 0 });
}

struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn dist(&self, other: &Point) -> u32 {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y)
    }
    fn rotate(&mut self, angle: i32) {
        let temp = self.y;
        match angle {
            90 => {
                self.y = self.x;
                self.x = -temp;
            }
            180 => {
                self.y = -self.y;
                self.x = -self.x;
            }
            270 => {
                self.y = -self.x;
                self.x = temp;
            }
            _ => panic!(),
        }
    }
}
