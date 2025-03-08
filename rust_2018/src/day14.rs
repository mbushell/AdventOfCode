pub fn solve(data: &str) -> (String, usize) {
    let star1 = star1(data.trim().parse::<usize>().unwrap());
    let star2 = star2(data.trim());
    return (star1, star2);
}

pub fn star1(after: usize) -> String {
    let scoreboard = gen_scores(|scores| scores.len() < after + 10);

    return scoreboard[after..(after + 10)]
        .iter()
        .map(|n| n.to_string())
        .collect::<Vec<String>>()
        .join("");
}

pub fn star2(recipes: &str) -> usize {
    let recipes = recipes
        .chars()
        .map(|c| c.to_digit(10).unwrap())
        .collect::<Vec<u32>>();

    let mut index = 0;
    let _ = gen_scores(|scores| {
        if scores.len() < recipes.len() {
            return true;
        }

        let from = scores.len() - recipes.len();
        if scores[from..].eq(&recipes) {
            index = from;
            return false;
        } else if scores.len() >= recipes.len() + 1
            && scores[(from - 1)..(scores.len() - 1)].eq(&recipes)
        {
            index = from;
            return false;
        }

        return true;
    });
    return index;
}

fn gen_scores(mut gen_while: impl FnMut(&Vec<u32>) -> bool) -> Vec<u32> {
    let mut scoreboard = vec![3, 7];

    let mut elf1: usize = 0;
    let mut elf2: usize = 1;

    while gen_while(&scoreboard) {
        let elf1_curr = scoreboard[elf1];
        let elf2_curr = scoreboard[elf2];
        let sum = elf1_curr + elf2_curr;

        sum.to_string()
            .chars()
            .for_each(|d| scoreboard.push(d.to_digit(10).unwrap()));

        elf1 = (elf1 + 1 + elf1_curr as usize) % scoreboard.len();
        elf2 = (elf2 + 1 + elf2_curr as usize) % scoreboard.len();
    }

    return scoreboard;
}
