type ExpressionParser = dyn Fn(&mut CharStream) -> Option<u64>;

pub fn solve(data: &str) -> (u64, u64) {
    let star1 = solve_with(data, &parse_expression_v1);
    let star2 = solve_with(data, &parse_expression_v2);
    return (star1, star2);
}

fn solve_with(data: &str, parser: &ExpressionParser) -> u64 {
    let mut total = 0;
    for line in data.trim().lines() {
        let mut stream = CharStream::from_str(line);
        let Some(result) = parser(&mut stream) else {
            panic!();
        };
        total += result;
    }
    return total;
}

fn parse_expression_v1(stream: &mut CharStream) -> Option<u64> {
    let mut lval = parse_operand(stream, &parse_expression_v1)?;
    while stream.is_next(' ') {
        let op = parse_operator(stream)?;
        let rval = parse_operand(stream, &parse_expression_v1)?;
        lval = match op {
            Op::Add => lval + rval,
            Op::Mul => lval * rval,
        };
    }
    return Some(lval);
}

fn parse_expression_v2(stream: &mut CharStream) -> Option<u64> {
    let mut stack = vec![parse_operand(stream, &parse_expression_v2)?];
    while stream.is_next(' ') {
        let op = parse_operator(stream)?;
        stack.push(parse_operand(stream, &parse_expression_v2)?);
        if matches!(op, Op::Add) {
            let addition = stack.pop()? + stack.pop()?;
            stack.push(addition);
        }
    }
    return Some(stack.iter().fold(1, |t, x| t * x));
}

fn parse_digit(stream: &mut CharStream) -> Option<u64> {
    return Some(stream.next()?.to_digit(10)?.into());
}

fn parse_operand(stream: &mut CharStream, parser: &ExpressionParser) -> Option<u64> {
    if stream.is_next('(') {
        stream.consume('(');
        let result = parser(stream)?;
        stream.consume(')');
        Some(result)
    } else {
        parse_digit(stream)
    }
}

fn parse_operator(stream: &mut CharStream) -> Option<Op> {
    stream.consume(' ');
    let result = match stream.next() {
        Some('+') => Some(Op::Add),
        Some('*') => Some(Op::Mul),
        _ => None,
    };
    stream.consume(' ');
    return result;
}

#[derive(Debug)]
enum Op {
    Add,
    Mul,
}

struct CharStream {
    data: Vec<char>,
    index: usize,
}

impl CharStream {
    fn from_str(data: &str) -> Self {
        Self {
            data: data.chars().collect(),
            index: 0,
        }
    }
    fn peek(&self) -> Option<char> {
        self.data.get(self.index).copied()
    }
    fn next(&mut self) -> Option<char> {
        let next = self.peek();
        self.index += 1;
        return next;
    }
    fn consume(&mut self, c: char) {
        if let Some(d) = self.next() {
            if d != c {
                panic!("expecting char '{c}' but got '{d}'");
            }
            return;
        }
        panic!("expecting char '{c}' but got nothing");
    }
    fn is_next(&self, c: char) -> bool {
        if let Some(d) = self.peek() {
            return c == d;
        }
        return false;
    }
}
