const testInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32
`;

export function star1(input) {
    const [ranges, ids] = parseInput(input);
    return ids.reduce(
        (t, id) => t + (ranges.findIndex((r) => inRange(r, id)) >= 0 ? 1 : 0),
        0
    );
}

export function star2(input) {
    const [ranges, _] = parseInput(input);

    let merge = true;

    loop: while (merge) {
        merge = false;
        for (let i = 0; i < ranges.length; i++) {
            for (let j = i + 1; j < ranges.length; j++) {
                if (
                    inRange(ranges[i], ranges[j][0]) ||
                    inRange(ranges[j], ranges[i][0])
                ) {
                    ranges[i] = [
                        Math.min(ranges[i][0], ranges[j][0]),
                        Math.max(ranges[i][1], ranges[j][1]),
                    ];
                    ranges.splice(j, 1);
                    merge = true;
                    continue loop;
                }
            }
        }
    }

    return ranges.reduce(
        (total, range) => total + (range[1] - range[0] + 1),
        0
    );
}

function parseInput(input) {
    let [ranges, ids] = input.trim().split("\n\n");
    ranges = ranges.split("\n").map((r) => r.split("-").map((n) => Number(n)));
    ids = ids.split("\n").map(Number);
    return [ranges, ids];
}

function inRange(range, value) {
    return value >= range[0] && value <= range[1];
}
