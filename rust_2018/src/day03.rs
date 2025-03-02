use std::cmp::max;
use std::cmp::min;
use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, u32) {
    let star1;
    let mut star2 = 0;

    let mut claims = parse_input(&data);

    let mut squares: HashMap<(u32, u32), bool> = HashMap::new();

    for i in 0..claims.len() {
        for j in (i + 1)..claims.len() {
            if i == j {
                continue;
            }
            let a = &claims[i];
            let b = &claims[j];
            if let Some(overlap) = a.rect.overlap(&b.rect) {
                claims.get_mut(i).unwrap().overlaps += 1;
                claims.get_mut(j).unwrap().overlaps += 1;
                for x in overlap.left()..overlap.right() {
                    for y in overlap.top()..overlap.bottom() {
                        squares.insert((x, y), true);
                    }
                }
            }
        }
    }

    star1 = squares.len();

    for claim in &claims {
        if claim.overlaps == 0 {
            star2 = claim.id;
            break;
        }
    }

    return (star1, star2);
}

fn parse_input(data: &str) -> Vec<Claim> {
    let mut claims = Vec::new();
    for line in data.split_terminator("\n") {
        // e.g. #14 @ 964,69: 28x20
        let data: Vec<&str> = line.split_whitespace().collect();
        if data.len() != 4 {
            continue;
        }

        let id = &data[0][1..];
        let pos: Vec<&str> = data[2].split_terminator(",").collect();
        let size: Vec<&str> = data[3].split_terminator("x").collect();

        let claim = Claim {
            id: id.parse().unwrap(),
            rect: Rect {
                left: pos[0].parse().unwrap(),
                top: pos[1][..pos[1].len() - 1].parse().unwrap(),
                width: size[0].parse().unwrap(),
                height: size[1].parse().unwrap(),
            },
            overlaps: 0,
        };

        claims.push(claim);
    }

    return claims;
}

struct Rect {
    left: u32,
    top: u32,
    width: u32,
    height: u32,
}

struct Claim {
    id: u32,
    rect: Rect,
    overlaps: u32,
}

impl Rect {
    fn left(&self) -> u32 {
        self.left
    }
    fn top(&self) -> u32 {
        self.top
    }
    fn right(&self) -> u32 {
        self.left + self.width
    }
    fn bottom(&self) -> u32 {
        self.top + self.height
    }
    fn overlap(&self, other: &Rect) -> Option<Rect> {
        if self.right() <= other.left() || self.left() >= other.right() {
            return None;
        }
        if self.top() >= other.bottom() || self.bottom() <= other.top() {
            return None;
        }

        let left = max(self.left(), other.left());
        let top = max(self.top(), other.top());
        let right = min(self.right(), other.right());
        let bottom = min(self.bottom(), other.bottom());

        return Some(Rect {
            left,
            top,
            width: right - left,
            height: bottom - top,
        });
    }
}
