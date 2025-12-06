const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

export function star1(input) {
    return instructions(input).reduce(
        ([dial, count], [direction, steps]) => {
            dial = direction === "L" ? dial - steps : dial + steps;
            dial = ((dial % 100) + 100) % 100;
            if (dial === 0) count++;
            return [dial, count];
        },
        [50, 0]
    )[1];
}

export function star2(input) {
    return instructions(input).reduce(
        ([dial, count], [direction, steps]) => {
            const initital = dial;
            count += Math.floor(steps / 100); // full rotations always pass 0
            steps = steps % 100;
            dial = direction === "L" ? dial - steps : dial + steps;
            if (dial >= 100 || (initital !== 0 && dial <= 0)) count++;
            dial = ((dial % 100) + 100) % 100;
            return [dial, count];
        },
        [50, 0]
    )[1];
}

function instructions(input) {
    return input
        .trim()
        .split("\n")
        .map((s) => [s[0], Number(s.slice(1))]);
}
