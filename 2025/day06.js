const testInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;

export function star1(input) {
    return total(problems1(input));
}

export function star2(input) {
    return total(problems2(input));
}

function problems1(input) {
    const lines = input
        .replace(/\n$/, "")
        .split("\n")
        .map((s) => s.trim().replace(/\s+/g, " ").split(" "));
    return lines[0].map((_, i) => lines.map((l) => l[i]));
}

function problems2(input) {
    const lines = input.replace(/\n$/, "").split("\n");
    const operators = lines
        .pop()
        .replace(/\s(?=[\*\+])/g, "|")
        .split("|")
        .toReversed();

    let from = lines[0].length - 1;

    return operators.map((operator) => {
        let problem = [];
        for (let j in operator) {
            problem.push(lines.map((l) => l[from - j]).join(""));
        }
        problem.push(operator.trim());
        from -= operator.length + 1;
        return problem;
    });
}

function solve(problem) {
    const operator = problem[problem.length - 1];
    const identity = operator == "*" ? 1 : 0;
    return problem
        .slice(0, problem.length - 1)
        .reduce(
            (result, operand) =>
                identity ? result * Number(operand) : result + Number(operand),
            identity
        );
}

function total(problems) {
    return problems.reduce((total, problem) => total + solve(problem), 0);
}
