pub fn solve(data: &str) -> (usize, usize) {
    let mut rating = 0;

    let mut jolts = data
        .trim()
        .lines()
        .map(|line| {
            let jolts = line.parse::<usize>().unwrap();
            rating = std::cmp::max(rating, jolts);
            jolts
        })
        .collect::<Vec<usize>>();

    jolts.push(0);
    jolts.push(rating + 3);
    jolts.sort();

    let mut ones = 0;
    let mut threes = 0;
    let mut choices = 1;

    let mut i = 1;
    while i < jolts.len() {
        let mut j = i;
        if jolts[i] - jolts[i - 1] == 1 {
            while jolts[j + 1] - jolts[j] == 1 {
                j += 1;
            }
            let ones_streak = j - i + 1;

            ones += ones_streak;

            match ones_streak {
                2 => choices *= 2,
                3 => choices *= 4,
                4 => choices *= 7,
                _ => (),
            }
        } else {
            threes += 1;
        }
        i = j + 1;
    }

    let star1 = ones * threes;
    let star2 = choices;

    return (star1, star2);
}
