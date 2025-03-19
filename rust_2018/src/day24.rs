use regex::Regex;
use std::cmp::Ordering;
use std::{collections::HashMap, str::Lines};

pub fn solve(data: &str) -> (usize, usize) {
    let (immune_system, infection) = parse_data(data);

    let star1;
    let star2;

    {
        let mut immune_system = immune_system.clone();
        let mut infection = infection.clone();

        fight(&mut immune_system, &mut infection);

        debug_assert!(immune_system.len() == 0 || infection.len() == 0);

        star1 = score_army(if infection.len() == 0 {
            &immune_system
        } else {
            &infection
        });
    }

    let mut boost = 0;
    loop {
        let mut immune_system = immune_system.clone();
        let mut infection = infection.clone();

        fight_with_boost(&mut immune_system, &mut infection, boost);

        if infection.len() == 0 {
            star2 = score_army(&immune_system);
            break;
        }

        boost += 1;
    }

    return (star1, star2);

    fn score_army(army: &Army) -> usize {
        army.iter().map(|group| group.unit_count).sum()
    }
}

fn parse_data(data: &str) -> (Army, Army) {
    let mut lines = data.lines();
    assert_eq!(lines.next().unwrap(), "Immune System:");
    let immune_system = parse_army(1, &mut lines);
    assert_eq!(lines.next().unwrap(), "Infection:");
    let infection = parse_army(2, &mut lines);
    return (immune_system, infection);
}

fn parse_army(army_id: usize, lines: &mut Lines) -> Vec<Group> {
    let mut army = vec![];

    let regex = Regex::new(r"(\d+) units each with (\d+) hit points (?:\(([^;]*)(?:; (.*))?\) )?with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)").unwrap();

    let mut group_id = 1;

    while let Some(group_info) = lines.next() {
        if group_info == "" {
            break;
        }

        let captures = regex.captures(group_info).unwrap();

        let mut group = Group::new(
            army_id,
            group_id,
            captures[1].parse().unwrap(),
            captures[2].parse().unwrap(),
            captures[5].parse().unwrap(),
            captures[6].to_string(),
            captures[7].parse().unwrap(),
        );

        for i in 3..=4 {
            let Some(spec) = captures.get(i) else {
                continue;
            };

            let mut spec = spec.as_str().split(" to ");
            let spec_type = spec.next().unwrap();
            let spec_list = spec.next().unwrap().split_terminator(", ");

            match spec_type {
                "weak" => {
                    for spec_item in spec_list {
                        group.weaknesses.insert(spec_item.to_string(), true);
                    }
                }
                "immune" => {
                    for spec_item in spec_list {
                        group.immunities.insert(spec_item.to_string(), true);
                    }
                }
                _ => panic!(),
            }
        }

        army.push(group);

        group_id += 1;
    }
    return army;
}

fn fight(army1: &mut Army, army2: &mut Army) {
    let mut stalemate = false;
    while army1.len() > 0 && army2.len() > 0 && !stalemate {
        // Phase 1: target selection
        sort_by_target_selection_order(army1);
        sort_by_target_selection_order(army2);

        select_targets(army1, army2);
        select_targets(army2, army1);

        // Phase 2: attacking
        let mut units_killed = false;
        for (army_id, attacker_id) in get_attack_order(army1, army2) {
            if army_id == 1 {
                units_killed |= perform_attack(army1, army2, attacker_id);
            } else {
                units_killed |= perform_attack(army2, army1, attacker_id);
            }
        }
        stalemate = !units_killed;

        // Reset for next round
        army1.iter_mut().for_each(|g| g.reset_targetting());
        army2.iter_mut().for_each(|g| g.reset_targetting());
    }

    fn select_targets(attackers: &mut Army, defenders: &mut Army) {
        attackers.iter_mut().for_each(|group| {
            if let Some(target) = group.select_target(defenders) {
                group.target_id = Some(target.group_id);
                target.is_targetted = true;
            }
        });
    }
}

fn fight_with_boost(immune_system: &mut Army, infection: &mut Army, boost: usize) {
    for group in immune_system.iter_mut() {
        group.attack_damage += boost;
    }
    return fight(immune_system, infection);
}

fn sort_by_target_selection_order(army: &mut Army) {
    /* highest effect power first
     * tie breaker: highest initiative
     */
    army.sort_by(|g, h| {
        let g_effective_power = g.effective_power();
        let h_effective_power = h.effective_power();
        if g_effective_power == h_effective_power {
            return g.initiative.cmp(&h.initiative).reverse();
        } else {
            return g_effective_power.cmp(&h_effective_power).reverse();
        }
    });
}

fn get_attack_order(army1: &Army, army2: &Army) -> Vec<(usize, usize)> {
    let mut order = army1
        .iter()
        .chain(army2.iter())
        .filter(|group| group.unit_count > 0)
        .collect::<Vec<_>>();

    order.sort_by(|a, b| a.initiative.cmp(&b.initiative).reverse());

    return order
        .iter()
        .map(|group| (group.army_id, group.group_id))
        .collect();
}

fn perform_attack(
    attacking_army: &mut Army,
    defending_army: &mut Army,
    attacker_id: usize,
) -> bool {
    let Some(attacker) = attacking_army
        .iter_mut()
        .find(|g| g.group_id == attacker_id)
    else {
        return false;
    };
    let Some(target_id) = attacker.target_id else {
        return false;
    };
    let Some((i, target)) = defending_army
        .iter_mut()
        .enumerate()
        .find(|(_, g)| g.group_id == target_id)
    else {
        return false;
    };
    let damage_dealt = attacker.calculate_damage(&target);
    let units_killed = std::cmp::min(damage_dealt / target.hit_points, target.unit_count);

    target.unit_count -= units_killed;
    if target.unit_count == 0 {
        defending_army.remove(i);
    }

    return units_killed > 0;
}

type Army = Vec<Group>;

#[derive(Debug, Clone)]
struct Group {
    army_id: usize,
    group_id: usize,

    unit_count: usize,
    hit_points: usize,

    weaknesses: HashMap<String, bool>,
    immunities: HashMap<String, bool>,

    attack_damage: usize,
    attack_type: String,
    initiative: usize,

    target_id: Option<usize>,
    is_targetted: bool,
}

impl Group {
    fn new(
        army_id: usize,
        group_id: usize,
        unit_count: usize,
        hit_points: usize,
        attack_damage: usize,
        attack_type: String,
        initiative: usize,
    ) -> Self {
        Group {
            army_id,
            group_id,
            unit_count,
            hit_points,
            weaknesses: HashMap::new(),
            immunities: HashMap::new(),
            attack_damage,
            attack_type,
            initiative,
            target_id: None,
            is_targetted: false,
        }
    }

    fn effective_power(&self) -> usize {
        self.unit_count * self.attack_damage
    }

    fn calculate_damage(&self, other: &Group) -> usize {
        if other.immunities.contains_key(&self.attack_type) {
            return 0;
        } else if other.weaknesses.contains_key(&self.attack_type) {
            return 2 * self.effective_power();
        } else {
            return self.effective_power();
        }
    }

    fn select_target<'a>(&self, enemy: &'a mut Army) -> Option<&'a mut Group> {
        let mut target = None;
        let mut target_damage_dealt = 0;

        for other in enemy.iter_mut().filter(|x| !x.is_targetted) {
            let damage_dealt = self.calculate_damage(other);

            /* target highest damage dealt
             * tie breakers:
             *  1st: highest effective power
             *  2nd: highest initiative
             */
            if damage_dealt > target_damage_dealt {
                target = Some(other);
                target_damage_dealt = damage_dealt;
            } else if damage_dealt == target_damage_dealt {
                let Some(target_group) = &target else {
                    continue;
                };
                match other.effective_power().cmp(&target_group.effective_power()) {
                    Ordering::Equal => {
                        if other.initiative > target_group.initiative {
                            target = Some(other);
                            target_damage_dealt = damage_dealt;
                        }
                    }
                    Ordering::Greater => {
                        target = Some(other);
                        target_damage_dealt = damage_dealt;
                    }
                    _ => continue,
                }
            }
        }

        return target;
    }

    fn reset_targetting(&mut self) {
        self.is_targetted = false;
        self.target_id = None;
    }
}

impl std::fmt::Display for Group {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        return f.write_str(&format!(
            "Group {}, units {}, effective power: {}, initiative: {}",
            self.group_id,
            self.unit_count,
            self.effective_power(),
            self.initiative,
        ));
    }
}
