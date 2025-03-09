struct Coords {
    x: u32,
    y: u32,
}

struct Area {
    coords: Coords,
    neighbourhood: Vec<Coords>,
    is_infinite: bool,
}

pub static mut SAFE_REGION_THRESHOLD: u32 = 10000;

pub fn solve(data: &str) -> (usize, u32) {
    let mut places = parse_coords(&data);

    let mut min = Coords {
        x: u32::max_value(),
        y: u32::max_value(),
    };
    let mut max = Coords {
        x: u32::min_value(),
        y: u32::min_value(),
    };

    for area in &places {
        min.x = std::cmp::min(area.coords.x, min.x);
        min.y = std::cmp::min(area.coords.y, min.y);
        max.x = std::cmp::max(area.coords.x, max.x);
        max.y = std::cmp::max(area.coords.y, max.y);
    }

    let mut safe_region_size = 0;

    let safe_region_threshold = unsafe { SAFE_REGION_THRESHOLD };

    for x in min.x..=max.x {
        for y in min.y..=max.y {
            let nbr: Coords = Coords { x, y };
            if let Some(area) = find_closest(&mut places, &nbr) {
                area.neighbourhood.push(Coords { x, y });
                if x == min.x || x == max.x || y == min.y || y == max.y {
                    area.is_infinite = true;
                }
            }

            let mut total_distance = 0;
            for area in &places {
                total_distance += area.coords.distance(&nbr);
            }
            if total_distance < safe_region_threshold {
                safe_region_size += 1;
            }
        }
    }

    let mut max_finite_area = usize::min_value();
    for area in places.iter().filter(|a| !a.is_infinite) {
        max_finite_area = std::cmp::max(max_finite_area, area.neighbourhood.len());
    }

    let star1 = max_finite_area;
    let star2 = safe_region_size;

    return (star1, star2);
}

fn parse_coords(data: &str) -> Vec<Area> {
    let mut coords = Vec::new();
    for line in data.trim().split_terminator("\n") {
        let pair: Vec<&str> = line.split_terminator(", ").collect();
        coords.push(Area {
            coords: Coords {
                x: pair[0].parse().unwrap(),
                y: pair[1].parse().unwrap(),
            },
            neighbourhood: Vec::new(),
            is_infinite: false,
        });
    }
    return coords;
}

fn find_closest<'a>(places: &'a mut [Area], coords: &Coords) -> Option<&'a mut Area> {
    let mut min_index = Some(0);
    let mut min_distance = places[0].coords.distance(coords);
    let mut tied = false;

    let upper_bound = places.len();
    for i in 1..upper_bound {
        let distance = places[i].coords.distance(coords);
        if min_index.is_none() || distance < min_distance {
            min_index = Some(i);
            min_distance = distance;
            tied = false;
        } else if distance == min_distance {
            tied = true;
        }
    }

    return if tied {
        None
    } else {
        places.get_mut(min_index.unwrap())
    };
}

impl Coords {
    fn distance(&self, other: &Coords) -> u32 {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y)
    }
}
