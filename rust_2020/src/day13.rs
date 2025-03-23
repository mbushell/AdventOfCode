pub fn solve(data: &str) -> (usize, i128) {
    let (earliest_departure, buses) = parse_data(data);

    let star1 = earliest_bus(earliest_departure, &buses);
    let star2 = earliest_sequence(&buses);

    return (star1, star2);
}

fn parse_data(data: &str) -> (usize, Vec<usize>) {
    let mut lines = data.lines();
    let timestamp = lines.next().unwrap().parse().unwrap();
    let buses = lines
        .next()
        .unwrap()
        .split_terminator(",")
        .map(|time| time.parse().unwrap_or(0))
        .collect();
    return (timestamp, buses);
}

fn earliest_bus(earliest_departure: usize, buses: &Vec<usize>) -> usize {
    let earliest_bus;
    let mut departure: usize = earliest_departure;
    'outer: loop {
        for bus in buses {
            if *bus != 0 && departure % *bus == 0 {
                earliest_bus = *bus;
                break 'outer;
            }
        }
        departure += 1;
    }
    let wait_time = departure - earliest_departure;
    return earliest_bus * wait_time;
}

fn earliest_sequence(buses: &Vec<usize>) -> i128 {
    let mut pairs = buses
        .iter()
        .enumerate()
        .filter(|(_, p)| **p > 0)
        .map(|(a, p)| (-(a as i128), *p as i128))
        .collect::<Vec<_>>();

    pairs.sort_by(|(_, p1), (_, p2)| p1.cmp(p2).reverse());

    let (mut a1, mut n1) = pairs[0];

    for i in 1..pairs.len() {
        let (a2, n2) = pairs[i];
        let (m1, m2) = bezout_identity(n1, n2);
        let n3 = n1 * n2;
        let a3 = a1 * m2 * n2 + a2 * m1 * n1;
        a1 = a3 % n3;
        n1 = n3;
    }

    while a1 < 0 {
        a1 += n1;
    }

    return a1;
}

fn bezout_identity(n1: i128, n2: i128) -> (i128, i128) {
    let mut r0 = n1;
    let mut r1 = n2;
    let mut s0 = 1;
    let mut s1 = 0;
    let mut t0 = 0;
    let mut t1 = 1;

    while r1 > 0 {
        let q3 = r0 / r1;
        let r3 = r0 % r1;
        let s3 = s0 - q3 * s1;
        let t3 = t0 - q3 * t1;
        r0 = r1;
        r1 = r3;
        s0 = s1;
        t0 = t1;
        s1 = s3;
        t1 = t3;
    }

    return (s0, t0);
}
