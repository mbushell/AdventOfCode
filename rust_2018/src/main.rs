mod day01;

use std::{fs, io::Read};

fn main() {
    let mut data = String::new();
    {
        let file = fs::File::open("./src/day01.txt");
        if let Err(err) = file {
            println!("{err}");
            return;
        }
        let _ = file.unwrap().read_to_string(&mut data);
    }

    let (star1, star2) = day01::solve(&data);
    println!("Day #1");
    println!("Star 1:\t{star1}");
    println!("Star 2:\t{star2}");
}
