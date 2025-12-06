const testInput = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;

export function star1(input) {
    return problems1(input).reduce(
        (total, problem) => total + solve(problem),
        0
    );
}

export function star2(input) {
    return problems2(input).reduce(
        (total, problem) => total + solve(problem),
        0
    );
}

function problems1(input) {
    const lines = input
        .trim()
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

    let i = lines[0].length - 1;

    return operators.map((operator) => {
        let problem = [];
        for (let j = 0; j < operator.length; j++) {
            problem.push(lines.map((l) => l[i]).join(""));
            i--;
        }
        i--;
        problem.push(operator.trim());
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
