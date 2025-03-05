use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::rc::Weak;

pub fn solve(data: &str) -> (String, u32) {
    return solve2(data, 5, 60);
}

pub fn solve2(data: &str, worker_count: usize, step_constant: u32) -> (String, u32) {
    let (order, _) = resolve_order(parse_steps(&data), 1, 0);

    let star1 = order
        .iter()
        .map(|x| x.name.clone())
        .collect::<Vec<String>>()
        .join("");

    let (_, star2) = resolve_order(parse_steps(&data), worker_count, step_constant);

    return (star1, star2);
}

fn parse_steps(data: &str) -> StepList {
    let mut steps: HashMap<&str, Rc<Step>> = HashMap::new();

    data.lines().for_each(|line| {
        // e.g. Step C must be finished before step A can begin.
        let words: Vec<&str> = line.split_terminator(" ").collect();

        if words.len() != 10 {
            panic!("Invalid input.");
        }

        if !steps.contains_key(words[1]) {
            steps.insert(words[1], Step::new(words[1]));
        }
        if !steps.contains_key(words[7]) {
            steps.insert(words[7], Step::new(words[7]));
        }

        steps[words[7]].add_dep(&steps[words[1]]);
    });

    let mut step_list = StepList::new();
    for step in steps.values() {
        step_list.push(Rc::clone(step));
    }
    step_list.sort_by(|a, b| a.name.cmp(&b.name));

    return step_list;
}

fn resolve_order(mut steps: StepList, worker_count: usize, step_constant: u32) -> (StepList, u32) {
    let mut completed_steps = Vec::new();

    let mut time: u32 = 0;
    let mut active_tasks: Vec<(Rc<Step>, u32)> = Vec::new();
    let tasks_to_complete = steps.len();

    while completed_steps.len() < tasks_to_complete {
        time = time + 1;

        active_tasks.retain_mut(|task| {
            if task.1 > 0 {
                task.1 -= 1;
            }
            if task.1 == 0 {
                steps.iter().for_each(|n| n.rem_dep(&task.0));
                completed_steps.push(Rc::clone(&task.0));
            }
            task.1 > 0
        });

        while active_tasks.len() < worker_count {
            let Some(task) = find_next_ready(&mut steps) else {
                break;
            };
            active_tasks.push((
                Rc::clone(&task),
                step_constant + u32::from(task.name.as_bytes()[0]) - 64,
            ));
        }
    }
    time = time - 1;

    return (completed_steps, time);
}

fn find_next_ready(nodes: &mut StepList) -> Option<Rc<Step>> {
    for i in 0..nodes.len() {
        if nodes[i].dep_len() == 0 {
            return Some(nodes.remove(i));
        }
    }
    return None;
}

type StepList = Vec<Rc<Step>>;

#[derive(Debug)]
struct Step {
    name: String,
    deps: RefCell<Vec<Weak<Step>>>,
}

impl Step {
    fn new(name: &str) -> Rc<Step> {
        Rc::new(Step {
            name: name.to_string(),
            deps: RefCell::new(vec![]),
        })
    }
    fn dep_len(&self) -> usize {
        self.deps.borrow().len()
    }
    fn add_dep(&self, dep: &Rc<Step>) {
        self.deps.borrow_mut().push(Rc::downgrade(dep));
    }
    fn rem_dep(&self, other: &Rc<Step>) {
        self.deps
            .borrow_mut()
            .retain(|x| x.upgrade().is_some_and(|x| x.name != other.name));
    }
}
