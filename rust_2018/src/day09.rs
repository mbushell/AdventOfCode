pub fn solve(data: &str) -> (u32, u32) {
    let (player_count, marble_count) = parse_data(data);

    let star1 = play_game(player_count, marble_count);
    let star2 = 0;

    return (star1, star2);
}

pub fn parse_data(data: &str) -> (usize, u32) {
    // e.g. X players; last marble is worth Y points
    let words: Vec<&str> = data.split_whitespace().collect();
    return (words[0].parse().unwrap(), words[6].parse().unwrap());
}

fn play_game(player_count: usize, marble_count: u32) -> u32 {
    let mut circle: Vec<u32> = vec![0];
    let mut scores: Vec<u32> = vec![0];

    let mut index: usize = 1;
    let mut player: usize = 0;

    for _ in 0..player_count {
        scores.push(0);
    }

    for marble in 1..=marble_count {
        if circle.len() < 2 {
            circle.push(marble);
        } else if marble % 23 == 0 {
            index = (index + circle.len() - 7 - 2) % circle.len();

            let score = marble + circle[index];
            scores[player] += score;

            circle.remove(index);
            index = (index + 2) % circle.len();
        } else {
            circle.insert(index, marble);
            index = (index + 2) % circle.len();
        }
        player = (player + 1) % player_count;
    }

    return *scores.iter().max().unwrap();
}
