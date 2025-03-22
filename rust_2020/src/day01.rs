pub fn solve(data: &str) -> (usize, usize) {
    const TARGET: usize = 2020;

    let mut star1 = None;
    let mut star2 = None;

    let numbers = parse_data(data);
    'outer: for (i, a) in numbers.iter().enumerate() {
        for (j, b) in numbers.iter().enumerate() {
            if i == j {
                continue;
            }

            let sum = a + b;
            if sum == TARGET {
                star1 = Some(a * b);
                if star2.is_some() {
                    break 'outer;
                }
            } else if sum > TARGET {
                continue;
            }

            for (k, c) in numbers.iter().enumerate() {
                if i == k || j == k {
                    continue;
                }
                if a + b + c == TARGET {
                    star2 = Some(a * b * c);
                    if star1.is_some() {
                        break 'outer;
                    }
                }
            }
        }
    }

    return (star1.unwrap(), star2.unwrap());
}

fn parse_data(data: &str) -> Vec<usize> {
    data.trim()
        .lines()
        .map(|line| line.parse::<usize>().unwrap())
        .collect()
}
