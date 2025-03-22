use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        println!("USAGE: day[0X]");
        return;
    }
    rust_2020::run(&args[1]);
}
