pub fn solve(data: &str) -> (usize, usize) {
    return solve2(data, 25);
}

pub fn solve2(data: &str, preamble_len: usize) -> (usize, usize) {
    let numbers = data
        .trim()
        .lines()
        .map(|line| line.parse::<usize>().unwrap())
        .collect::<Vec<_>>();

    let mut star1 = 0;

    'outer: for i in preamble_len..numbers.len() {
        for j in (i - preamble_len)..=(i - 1) {
            for k in (i - preamble_len)..=(i - 1) {
                if j == k {
                    continue;
                }
                if numbers[i] == numbers[j] + numbers[k] {
                    continue 'outer;
                }
            }
        }
        star1 = numbers[i];
        break;
    }

    let mut star2 = 0;

    'outer: for i in 0..(numbers.len() - 1) {
        let mut total = 0;
        for j in (i + 1)..numbers.len() {
            if numbers[j] == star1 {
                continue 'outer;
            }

            total += numbers[j];

            if total == star1 {
                star2 = numbers[(i + 1)..=j].iter().min().unwrap()
                    + numbers[(i + 1)..=j].iter().max().unwrap();
                break 'outer;
            } else if total > star1 {
                break;
            }
        }
    }

    return (star1, star2);
}
