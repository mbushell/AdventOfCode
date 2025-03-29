use std::{
    collections::{HashMap, VecDeque},
    hash::{DefaultHasher, Hash, Hasher},
};

pub fn solve(data: &str) -> (usize, usize) {
    let (p1, p2) = parse_data(data);
    let (_, star1) = play_game(p1.clone(), p2.clone(), false);
    let (_, star2) = play_game(p1.clone(), p2.clone(), true);
    return (star1, star2);
}

type Deck = VecDeque<usize>;

fn parse_data(data: &str) -> (Deck, Deck) {
    let mut lines = data.lines();
    let p1 = parse_player(&mut lines);
    let p2 = parse_player(&mut lines);
    return (p1, p2);

    fn parse_player(lines: &mut std::str::Lines<'_>) -> Deck {
        let mut player = Deck::new();
        assert!(lines.next().unwrap().starts_with("Player"));
        while let Some(line) = lines.next() {
            if line == "" {
                break;
            }
            player.push_back(line.parse().unwrap());
        }
        return player;
    }
}

fn play_game(mut p1: Deck, mut p2: Deck, recursive: bool) -> (u8, usize) {
    let mut history = HashMap::new();

    while p1.len() > 0 && p2.len() > 0 {
        if recursive {
            let mut hasher1 = DefaultHasher::new();
            p1.hash(&mut hasher1);
            p2.hash(&mut hasher1);
            let state = (hasher1.finish(), 0);
            if history.contains_key(&state) {
                return (1, calculate_score(&p1));
            }
            history.insert(state, true);
        }

        let c1 = p1.pop_front().unwrap();
        let c2 = p2.pop_front().unwrap();

        let winner = if recursive && p1.len() >= c1 && p2.len() >= c2 {
            play_game(
                p1.range(0..c1).copied().collect(),
                p2.range(0..c2).copied().collect(),
                true,
            )
            .0
        } else if c1 > c2 {
            1
        } else {
            2
        };

        if winner == 1 {
            p1.push_back(c1);
            p1.push_back(c2);
        } else {
            p2.push_back(c2);
            p2.push_back(c1);
        }
    }

    return if p1.len() > 0 {
        (1, calculate_score(&p1))
    } else {
        (2, calculate_score(&p2))
    };

    fn calculate_score(deck: &Deck) -> usize {
        deck.iter().enumerate().fold(0, |total, (index, value)| {
            total + (deck.len() - index) * value
        })
    }
}
