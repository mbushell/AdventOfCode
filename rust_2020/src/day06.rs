use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let mut star1 = 0;
    let mut star2 = 0;
    data.trim().split_terminator("\n\n").for_each(|group| {
        let mut votes = HashMap::new();
        let group = group.split_terminator("\n").collect::<Vec<_>>();
        group.iter().for_each(|person| {
            person.chars().for_each(|question| {
                *votes.entry(question).or_insert(0) += 1;
            });
        });
        star1 += votes.len();
        star2 += votes
            .values()
            .fold(0, |t, &v| t + if v == group.len() { 1 } else { 0 })
    });
    return (star1, star2);
}
