use std::collections::HashMap;

type Grid = HashMap<(i32, i32, i32), i32>;

pub fn solve(data: &str) -> (String, String) {
    let serial_number: i32 = data.trim().parse().unwrap();

    let grid_size = 300;

    // TODO: speed this up lol

    let mut grid: Grid = HashMap::new();
    for y in 1..=grid_size {
        for x in 1..=grid_size {
            grid.insert((x, y, 1), power_level(x, y, serial_number));
        }
    }

    let mut diffs: String = String::new();
    let mut maximums: Vec<(i32, i32, i32, i32)> = vec![];
    let mut prev_max = 0;

    for n in 1..=300 {
        let (x, y, max) = find_max(&mut grid, n);

        if n > 1 {
            diffs.push_str(if max > prev_max { "+" } else { "-" });
        }

        maximums.push((x, y, n, max));

        if n > 3 && diffs[diffs.len() - 3..].contains("---") {
            break;
        }
        prev_max = max;
    }

    maximums.sort_by(|a, b| b.3.cmp(&a.3));

    let star2 = format!("{},{},{}", maximums[0].0, maximums[0].1, maximums[0].2);

    let (x, y, _) = find_max(&mut grid, 3);
    let star1 = format!("{x},{y}");

    return (star1, star2);
}

fn power_level(x: i32, y: i32, serial_number: i32) -> i32 {
    let rack_id = x + 10;
    let mut p_level = rack_id * y;
    p_level += serial_number;
    p_level *= rack_id;
    p_level /= 100;
    p_level %= 10;
    p_level -= 5;
    return p_level;
}

fn find_max(grid: &mut Grid, size: i32) -> (i32, i32, i32) {
    let mut max = i32::min_value();
    let mut max_x = 0;
    let mut max_y = 0;
    for y in 1..=(300 - (size - 1)) {
        for x in 1..=(300 - (size - 1)) {
            let value = score(grid, x, y, size);
            if value > max {
                max = value;
                max_x = x;
                max_y = y;
            }
        }
    }
    return (max_x, max_y, max);
}

fn score(grid: &mut Grid, x: i32, y: i32, size: i32) -> i32 {
    let key = (x, y, size);
    if size == 1 {
        return grid[&key];
    }

    let mut total = grid[&(x + 1, y + 1, size - 1)];
    for x0 in x..=(x + size - 1) {
        total += grid[&(x0, y, 1)];
    }
    for y0 in (y + 1)..=(y + size - 1) {
        total += grid[&(x, y0, 1)];
    }
    grid.insert(key, total);

    return total;
}
