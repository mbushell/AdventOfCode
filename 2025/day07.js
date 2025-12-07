const testInput = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

export function star1(input) {
    return solve(input)[0];
}

export function star2(input) {
    return solve(input)[1];
}

function grid(input) {
    return input
        .trim()
        .split("\n")
        .map((line) => line.split(""));
}

function solve(input) {
    let splits = 0;

    const g = grid(input);
    g.forEach((row, y) => {
        row.forEach((cell, x) => {
            switch (cell) {
                case "S":
                    g[y + 1][x] = 1;
                    break;
                case ".":
                    if (y > 0 && typeof g[y - 1][x] === "number") {
                        g[y][x] = g[y - 1][x];
                    }
                    break;
                case "^":
                    if (typeof g[y - 1][x] === "number") {
                        g[y][x - 1] =
                            (g[y][x - 1] === "." ? 0 : g[y][x - 1]) +
                            g[y - 1][x];
                        g[y][x + 1] =
                            (g[y][x + 1] === "." ? 0 : g[y][x + 1]) +
                            g[y - 1][x];
                        splits++;
                    }
                    break;
                default:
                    if (
                        typeof cell === "number" &&
                        typeof g[y - 1][x] === "number"
                    ) {
                        g[y][x] += g[y - 1][x];
                    }
                    break;
            }
        });
    });

    const timelines = g[g.length - 1].reduce(
        (t, c) => t + (typeof c === "number" ? c : 0),
        0
    );

    return [splits, timelines];
}
