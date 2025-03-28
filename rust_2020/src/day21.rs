use std::collections::{HashMap, HashSet};

pub fn solve(data: &str) -> (usize, String) {
    let (foods, mut allergens) = parse_data(data);

    for allergen in &mut allergens.values_mut() {
        for source in &allergen.possible_sources {
            let food = &foods[*source];
            if allergen.sources.is_none() {
                allergen.sources = Some(food.clone());
            } else {
                allergen.sources = Some(
                    allergen
                        .sources
                        .clone()
                        .unwrap()
                        .intersection(&food)
                        .map(|s| *s)
                        .collect(),
                );
            }
        }
    }

    let mut ingredients = HashMap::new();

    for food in foods {
        for ingredient_name in food {
            let ingredient = ingredients.entry(ingredient_name).or_insert(Ingredient {
                name: ingredient_name,
                food_count: 0,
                possible_allergens: HashMap::new(),
            });
            ingredient.food_count += 1;
        }
    }

    for ingredient in ingredients.values_mut() {
        for allergen in allergens.values() {
            if allergen.sources.as_ref().unwrap().contains(ingredient.name) {
                *ingredient
                    .possible_allergens
                    .entry(allergen.name)
                    .or_insert(0) += 1;
            }
        }
    }

    let mut star1 = 0;
    for ingredient in ingredients.values() {
        if ingredient.possible_allergens.len() == 0 {
            star1 += ingredient.food_count;
        }
    }

    let mut matches: HashMap<&str, &str> = HashMap::new();

    while matches.len() < allergens.len() {
        for allergen in allergens.values() {
            if allergen
                .sources
                .as_ref()
                .unwrap()
                .iter()
                .filter(|source| !matches.contains_key(**source))
                .count()
                == 1
            {
                let x = allergen
                    .sources
                    .as_ref()
                    .unwrap()
                    .iter()
                    .filter(|source| !matches.contains_key(**source))
                    .next()
                    .unwrap();

                matches.insert(x, allergen.name);
            }
        }
    }

    let mut matches = matches.iter().collect::<Vec<_>>();
    matches.sort_by(|a, b| a.1.cmp(&b.1));
    let star2 = matches.iter().map(|m| *m.0).collect::<Vec<_>>().join(",");

    return (star1, star2);
}

fn parse_data(data: &str) -> (Vec<Food>, HashMap<&str, Allergen>) {
    let mut foods = vec![];
    let mut allergens = HashMap::new();

    for food in data.trim().lines() {
        let (ingredient_list, allergen_list) = food.split_once(" (").unwrap();
        let food = ingredient_list.split_terminator(" ").collect::<Food>();

        let food_id = foods.len();

        allergen_list.strip_prefix("contains ").and_then(|s| {
            s.strip_suffix(")").and_then(|s| {
                Some(s.split_terminator(", ").for_each(|allergen_name| {
                    let allergen: &mut Allergen<'_> =
                        allergens.entry(allergen_name).or_insert(Allergen {
                            name: allergen_name,
                            sources: None,
                            possible_sources: Vec::new(),
                        });
                    allergen.possible_sources.push(food_id);
                }))
            })
        });

        foods.push(food);
    }

    return (foods, allergens);
}

type Food<'a> = HashSet<&'a str>;

#[derive(Debug)]
struct Allergen<'a> {
    name: &'a str,
    possible_sources: Vec<usize>,
    sources: Option<HashSet<&'a str>>,
}

#[derive(Debug)]
struct Ingredient<'a> {
    name: &'a str,
    food_count: usize,
    possible_allergens: HashMap<&'a str, usize>,
}
