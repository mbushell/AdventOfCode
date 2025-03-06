use regex::Regex;
use std::collections::HashMap;

pub fn solve(data: &str) -> (String, i32) {
    let mut lights = parse_input(data.trim());

    let mut star2 = 0;
    for i in 0..=1000000 {
        let (tl, br) = update(&mut lights);
        if br.y - tl.y + 1 <= 10 {
            draw_lights(&lights, &tl, &br);
            star2 = i + 1;
            break;
        }
    }

    return ("".to_string(), star2);
}

fn parse_input(data: &str) -> Vec<Light> {
    let mut lights = vec![];

    // position=< 6, 10> velocity=<-2, -1>
    let regex =
        Regex::new(r"position=<([ -]?\d+),\s+([ -]?\d+)> velocity=<([ -]?\d+),\s+([ -]?\d+)>")
            .unwrap();

    for line in data.lines() {
        let nums = regex.captures(line).unwrap();
        let light = Light {
            pos: Vec2 {
                x: nums[1].trim().parse().unwrap(),
                y: nums[2].trim().parse().unwrap(),
            },
            vel: Vec2 {
                x: nums[3].trim().parse().unwrap(),
                y: nums[4].trim().parse().unwrap(),
            },
        };
        lights.push(light)
    }

    return lights;
}

fn update(lights: &mut [Light]) -> (Vec2, Vec2) {
    let mut tl = Vec2 {
        x: i32::max_value(),
        y: i32::max_value(),
    };
    let mut br = Vec2 {
        x: i32::min_value(),
        y: i32::min_value(),
    };
    lights.iter_mut().for_each(|light| {
        light.pos.x += light.vel.x;
        light.pos.y += light.vel.y;
        tl.x = i32::min(tl.x, light.pos.x);
        tl.y = i32::min(tl.y, light.pos.y);
        br.x = i32::max(br.x, light.pos.x);
        br.y = i32::max(br.y, light.pos.y);
    });
    return (tl, br);
}

fn draw_lights(lights: &[Light], tl: &Vec2, br: &Vec2) {
    let mut map = HashMap::new();
    for light in lights {
        map.insert((light.pos.x, light.pos.y), light);
    }

    print!("{}[2J", 27 as char);
    for y in tl.y..=br.y {
        for x in tl.x..=br.x {
            print!("{}", if map.contains_key(&(x, y)) { '#' } else { '.' });
        }
        println!();
    }
}

#[derive(Debug)]
struct Vec2 {
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Light {
    pos: Vec2,
    vel: Vec2,
}
