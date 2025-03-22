pub fn solve(data: &str) -> (usize, usize) {
    let mut constellations = parse_data(data);

    let mut has_merged = true;
    while has_merged {
        let mut merged: Vec<Constellation> = vec![];
        has_merged = false;

        while constellations.len() > 0 {
            let mut const_a = constellations.pop().unwrap();

            let mut merge_list = vec![];
            for (i, const_b) in constellations.iter().enumerate() {
                if can_merge(&const_a, &const_b) {
                    merge_list.push(i);
                }
            }

            merge_list.iter().rev().for_each(|i| {
                let mut const_b = constellations.remove(*i);
                const_a.append(&mut const_b);
                has_merged = true;
            });

            merged.push(const_a);
        }

        constellations = merged;
    }

    let star1 = constellations.len();

    return (star1, 0);
}

type Constellation = Vec<Point>;

fn parse_data(data: &str) -> Vec<Constellation> {
    let mut coords = vec![];
    for line in data.lines() {
        if line == "" {
            break;
        }
        coords.push(vec![
            line.split_terminator(",")
                .map(|x| x.parse().unwrap())
                .collect(),
        ]);
    }
    return coords;
}

fn can_merge(const_a: &Constellation, const_b: &Constellation) -> bool {
    const_a
        .iter()
        .find(|p| const_b.iter().find(|q| q.dist(p) <= 3).is_some())
        .is_some()
}

#[derive(Debug)]
struct Point {
    w: i32,
    x: i32,
    y: i32,
    z: i32,
}

impl FromIterator<i32> for Point {
    fn from_iter<I: IntoIterator<Item = i32>>(iter: I) -> Point {
        let mut iter = iter.into_iter();
        let w = iter.next().unwrap();
        let x = iter.next().unwrap();
        let y = iter.next().unwrap();
        let z = iter.next().unwrap();
        Point { w, x, y, z }
    }
}

impl Point {
    fn dist(&self, other: &Point) -> u32 {
        self.w.abs_diff(other.w)
            + self.x.abs_diff(other.x)
            + self.y.abs_diff(other.y)
            + self.z.abs_diff(other.z)
    }
}
