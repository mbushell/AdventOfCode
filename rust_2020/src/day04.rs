use std::collections::HashMap;

pub fn solve(data: &str) -> (usize, usize) {
    let passports = parse_data(&data);
    let star1 = passports.iter().filter(|p| p.is_valid1()).count();
    let star2 = passports.iter().filter(|p| p.is_valid2()).count();
    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Passport> {
    let mut passports: Vec<Passport> = vec![];

    let mut lines = data.lines();

    while let Some(mut line) = lines.next() {
        let mut pass = Passport::new();
        while line != "" {
            for field in line.split_terminator(" ") {
                let mut kv = field.split_terminator(":");
                let k = kv.next().unwrap();
                let v = kv.next().unwrap();
                pass.add_field(k, v);
            }
            line = lines.next().unwrap_or("");
        }
        passports.push(pass);
    }

    return passports;
}

struct Passport {
    map: HashMap<String, String>,
    is_valid: bool,
}

impl Passport {
    fn new() -> Self {
        Self {
            map: HashMap::new(),
            is_valid: true,
        }
    }

    fn add_field(&mut self, key: &str, value: &str) {
        self.is_valid &= self.is_field_valid(key, value);
        self.map.insert(key.to_string(), value.to_string());
    }

    fn is_valid1(&self) -> bool {
        self.map.len() == 8 || (self.map.len() == 7 && !self.map.contains_key("cid"))
    }

    fn is_valid2(&self) -> bool {
        self.is_valid1() && self.is_valid
    }

    const EYE_COLOURS: [&str; 7] = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

    fn is_field_valid(&self, key: &str, value: &str) -> bool {
        return match key {
            "byr" => is_number_in_range(value, 1920, 2002),
            "iyr" => is_number_in_range(value, 2010, 2020),
            "eyr" => is_number_in_range(value, 2020, 2030),
            "hgt" => {
                is_unit_in_range(value, "cm", 150, 193) || is_unit_in_range(value, "in", 59, 76)
            }
            "hcl" => is_hex_colour(value),
            "ecl" => Self::EYE_COLOURS.contains(&value),
            "pid" => value.len() == 9 && is_number(value),
            "cid" => true,
            _ => false,
        };

        fn is_number(data: &str) -> bool {
            data.parse::<usize>().is_ok()
        }

        fn is_number_in_range(data: &str, min: usize, max: usize) -> bool {
            data.parse::<usize>()
                .and_then(|x| Ok(x >= min && x <= max))
                .is_ok_and(|x| x)
        }

        fn is_unit_in_range(data: &str, unit: &str, min: usize, max: usize) -> bool {
            data.strip_suffix(unit)
                .and_then(|x| Some(is_number_in_range(x, min, max)))
                .is_some_and(|x| x)
        }

        fn is_hex_colour(data: &str) -> bool {
            data.len() == 7
                && data
                    .strip_prefix('#')
                    .and_then(|x| Some(i32::from_str_radix(x, 16).is_ok()))
                    .is_some_and(|x| x)
        }
    }
}
