use regex::Regex;
use std::cmp::Ordering;
use std::collections::HashMap;

struct Guard {
    id: u16,
    sleep_times: HashMap<u16, u16>,
    sleep_total: u16,
}

#[derive(PartialEq, Eq)]
enum GuardAction {
    BeginsShift(u16),
    FallsAsleep,
    WakesUp,
}

#[derive(PartialEq, Eq, Ord)]
struct Date {
    year: u16,
    month: u16,
    day: u16,
    hour: u16,
    minute: u16,
}

#[derive(PartialEq, Eq)]
struct Record {
    date: Date,
    action: GuardAction,
}

pub fn solve(data: &str) -> (u16, u16) {
    let mut records = parse_data(&data);
    records.sort();

    let guards = process_records(&records);

    let mut guards: Vec<&Guard> = guards.values().collect();
    guards.sort_by_key(|guard| guard.sleep_total);

    let laziest_guard = guards.last().unwrap();

    let max_key = laziest_guard
        .sleep_times
        .iter()
        .max_by(|a, b| a.1.cmp(b.1))
        .unwrap()
        .0;

    let star1 = max_key * laziest_guard.id;

    let mut most_slept: HashMap<u16, (u16, u16, u16)> = HashMap::new();

    for minute in 0u16..60 {
        for guard in &guards {
            if !guard.sleep_times.contains_key(&minute) {
                continue;
            }
            if let Some((_, record, _)) = most_slept.get(&minute) {
                if guard.sleep_times[&minute] > *record {
                    most_slept.insert(minute, (minute, guard.sleep_times[&minute], guard.id));
                }
            } else {
                most_slept.insert(minute, (minute, guard.sleep_times[&minute], guard.id));
            }
        }
    }

    let mut minute_records: Vec<&(u16, u16, u16)> = most_slept.values().collect();
    minute_records.sort_by(|a, b| b.1.cmp(&a.1));

    let star2 = minute_records[0].0 * minute_records[0].2;

    return (star1, star2);
}

fn parse_data(data: &str) -> Vec<Record> {
    let mut records = Vec::new();

    let regex = Regex::new(
        r"^\[(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2}) (?<hour>[0-9]{2}):(?<minute>[0-9]{2})\] (?<action>.*)$",
    )
    .unwrap();

    for line in data.split_terminator("\n") {
        let Some(caps) = regex.captures(line) else {
            continue;
        };
        let action_str = caps.name("action").unwrap().as_str();

        records.push(Record {
            date: Date {
                year: caps.name("year").unwrap().as_str().parse().unwrap(),
                month: caps.name("month").unwrap().as_str().parse().unwrap(),
                day: caps.name("day").unwrap().as_str().parse().unwrap(),
                hour: caps.name("hour").unwrap().as_str().parse().unwrap(),
                minute: caps.name("minute").unwrap().as_str().parse().unwrap(),
            },
            action: match action_str {
                "falls asleep" => GuardAction::FallsAsleep,
                "wakes up" => GuardAction::WakesUp,
                _ => {
                    let words: Vec<&str> = action_str.split_whitespace().collect();
                    GuardAction::BeginsShift(words[1][1..].parse().unwrap())
                }
            },
        })
    }

    return records;
}

fn process_records(records: &Vec<Record>) -> HashMap<u16, Guard> {
    let mut guards: HashMap<u16, Guard> = HashMap::new();

    let mut active_guard_id: Option<u16> = None;
    let mut sleep_start: Option<&Date> = None;

    for record in records {
        match record.action {
            GuardAction::BeginsShift(id) => {
                guards.entry(id).or_insert(Guard {
                    id,
                    sleep_times: HashMap::new(),
                    sleep_total: 0,
                });
                active_guard_id = Some(id);
            }
            GuardAction::FallsAsleep => {
                sleep_start = Some(&record.date);
            }
            GuardAction::WakesUp => {
                debug_assert!(active_guard_id.is_some());
                debug_assert!(sleep_start.is_some());

                let sleep_start = sleep_start.unwrap().minute;
                let sleep_end = record.date.minute;

                let guard = guards.get_mut(&active_guard_id.unwrap()).unwrap();

                guard.sleep_total += sleep_end - sleep_start;

                for minute in sleep_start..sleep_end {
                    let count = guard.sleep_times.entry(minute).or_insert(0);
                    *count += 1;
                }
            }
        }
    }

    return guards;
}

impl PartialOrd for Date {
    fn partial_cmp(&self, other: &Date) -> Option<Ordering> {
        if self.year == other.year {
            if self.month == other.month {
                if self.day == other.day {
                    if self.hour == other.hour {
                        return Some(self.minute.cmp(&other.minute));
                    }
                    return Some(self.hour.cmp(&other.hour));
                }
                return Some(self.day.cmp(&other.day));
            }
            return Some(self.month.cmp(&other.month));
        }
        return Some(self.year.cmp(&other.year));
    }
}

impl PartialOrd for Record {
    fn partial_cmp(&self, other: &Record) -> Option<Ordering> {
        Some(self.date.cmp(&other.date))
    }
}

impl Ord for Record {
    fn cmp(&self, other: &Record) -> Ordering {
        self.partial_cmp(other).unwrap()
    }
}
