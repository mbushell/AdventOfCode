pub fn solve(data: &str) -> (usize, u32) {
    let mut nanobots = parse_data(data);

    nanobots.sort_by(|a, b| b.radius.cmp(&a.radius));

    let star1 = in_range_of(&nanobots, &nanobots[0]);

    let mut min_x = nanobots.iter().map(|bot| bot.pt.x).min().unwrap();
    let mut max_x = nanobots.iter().map(|bot| bot.pt.x).max().unwrap();
    let mut min_y = nanobots.iter().map(|bot| bot.pt.y).min().unwrap();
    let mut max_y = nanobots.iter().map(|bot| bot.pt.y).max().unwrap();
    let mut min_z = nanobots.iter().map(|bot| bot.pt.z).min().unwrap();
    let mut max_z = nanobots.iter().map(|bot| bot.pt.z).max().unwrap();

    let mut step_x = (max_x - min_x) / 2;
    let mut step_y = (max_y - min_y) / 2;
    let mut step_z = (max_z - min_z) / 2;

    let origin = Point { x: 0, y: 0, z: 0 };
    let mut most_point: Option<Point> = None;
    let mut most_count = 0;

    while step_x > 0 && step_y > 0 && step_z > 0 {
        for x in (min_x..=max_x).step_by(step_x as usize) {
            for y in (min_y..=max_y).step_by(step_y as usize) {
                for z in (min_z..=max_z).step_by(step_z as usize) {
                    let pt = Point { x, y, z };
                    let count = in_range(&nanobots, &pt);
                    if count == most_count {
                        if let Some(qt) = &most_point {
                            if pt.dist(&origin) < qt.dist(&origin) {
                                most_point = Some(pt);
                                most_count = count;
                            }
                        }
                    } else if count > most_count {
                        most_point = Some(pt);
                        most_count = count;
                    }
                }
            }
        }
        if let Some(pt) = &most_point {
            min_x = pt.x - step_x;
            max_x = pt.x + step_x;
            min_y = pt.y - step_y;
            max_y = pt.y + step_y;
            min_z = pt.z - step_z;
            max_z = pt.z + step_z;
            step_x /= 2;
            step_y /= 2;
            step_z /= 2;
        }
    }

    let star2 = origin.dist(most_point.as_ref().unwrap());

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Nanobot> {
    let mut nanobots = vec![];
    for line in data.trim().lines() {
        // e.g. pos=<89663068,44368890,80128768>, r=95149488
        let mut parts = line.split(", r=");

        let Some(mut pos) = parts
            .next()
            .and_then(|x| x.strip_prefix("pos=<"))
            .and_then(|x| x.strip_suffix(">"))
            .and_then(|x| Some(x.split_terminator(",")))
        else {
            panic!("failed to parse coordinates");
        };

        let radius = parts.next().unwrap();
        nanobots.push(Nanobot {
            pt: Point {
                x: pos.next().unwrap().parse().unwrap(),
                y: pos.next().unwrap().parse().unwrap(),
                z: pos.next().unwrap().parse().unwrap(),
            },
            radius: radius.parse().unwrap(),
        });
    }
    return nanobots;
}

fn in_range_of(nanobots: &Vec<Nanobot>, other: &Nanobot) -> usize {
    nanobots
        .iter()
        .filter(|bot| bot.pt.dist(&other.pt) <= other.radius)
        .count()
}

fn in_range(nanobots: &Vec<Nanobot>, pt: &Point) -> usize {
    nanobots
        .iter()
        .filter(|bot| bot.pt.dist(pt) <= bot.radius)
        .count()
}

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
    z: i32,
}

#[derive(Debug)]
struct Nanobot {
    pt: Point,
    radius: u32,
}

impl Point {
    fn dist(&self, other: &Point) -> u32 {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y) + self.z.abs_diff(other.z)
    }
}
