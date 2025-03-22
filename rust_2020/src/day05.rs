pub fn solve(data: &str) -> (usize, usize) {
    let mut seats = vec![];

    data.trim().lines().for_each(|line| {
        let row = bsp(&line[0..7], 0, 127, 'F', 'B');
        let col = bsp(&line[7..10], 0, 7, 'L', 'R');
        seats.push((row, col, row * 8 + col));
    });

    seats.sort_by(|a, b| {
        if a.0 == b.0 {
            a.1.cmp(&b.1)
        } else {
            a.0.cmp(&b.0)
        }
    });

    let star1 = seats[seats.len() - 1].2;

    let mut star2 = 0;
    for i in 0..(seats.len() - 1) {
        let seat1 = seats[i];
        let seat2 = seats[i + 1];
        if seat2.2 != seat1.2 + 1 {
            star2 = seat1.2 + 1;
            break;
        }
    }

    return (star1, star2);
}

fn bsp(data: &str, mut min: usize, mut max: usize, lower: char, upper: char) -> usize {
    for c in data.chars() {
        match c {
            _ if c == lower => max = min + (max - min) / 2,
            _ if c == upper => min = min + (max - min + 1) / 2,
            _ => panic!("char '{c}' is neither upper '{upper}' nor lower '{lower}'"),
        };
    }
    debug_assert_eq!(min, max);
    return min;
}
