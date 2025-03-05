pub fn solve(data: &str) -> (u32, u32) {
    let mut tokens: Vec<&str> = data.trim().split_whitespace().collect();
    tokens.reverse();

    let node = parse_nodes(&mut tokens).unwrap();

    let star1 = node.metadata_sum();
    let star2 = node.value();

    return (star1, star2);
}

fn parse_nodes(tokens: &mut Vec<&str>) -> Option<Node> {
    let child_count: i32 = tokens.pop()?.parse().unwrap();
    let meta_count: i32 = tokens.pop()?.parse().unwrap();

    let mut node = Node::new();
    for _ in 0..child_count {
        node.children.push(parse_nodes(tokens)?);
    }
    for _ in 0..meta_count {
        node.metadata.push(tokens.pop()?.parse().unwrap());
    }

    return Some(node);
}

#[derive(Debug)]
struct Node {
    metadata: Vec<u32>,
    children: Vec<Node>,
}

impl Node {
    fn new() -> Node {
        Node {
            metadata: vec![],
            children: vec![],
        }
    }
    fn metadata_sum(&self) -> u32 {
        let mut sum = self.metadata.iter().sum();
        self.children.iter().for_each(|child| {
            sum += child.metadata_sum();
        });
        return sum;
    }
    fn value(&self) -> u32 {
        match self.children.len() {
            0 => self.metadata_sum(),
            _ => self
                .metadata
                .iter()
                .map(|index| {
                    if *index == 0 {
                        0
                    } else {
                        match self.children.get((*index - 1) as usize) {
                            Some(child) => child.value(),
                            None => 0,
                        }
                    }
                })
                .sum(),
        }
    }
}
