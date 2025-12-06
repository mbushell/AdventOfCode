const testInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

export function star1(input) {
    return remove(grid(input));
}

export function star2(input) {
    const g = grid(input);
    let total = 0;
    let count = 0;
    while ((count = remove(g))) {
        total += count;
    }
    return total;
}

function grid(input) {
    return input
        .trim()
        .split("\n")
        .map((row) => row.trim().split(""));
}

function neighbours(x, y) {
    return [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1],
    ];
}

function remove(grid) {
    let removable = [];
    grid.forEach((row, y) =>
        row.forEach((cell, x) => {
            if (cell === "@") {
                let count = 0;
                neighbours(x, y).forEach(([nx, ny]) => {
                    if (grid[ny] && grid[ny][nx] === "@") {
                        count++;
                    }
                });
                if (count < 4) {
                    removable.push([x, y]);
                }
            }
        })
    );
    removable.forEach(([x, y]) => (grid[y][x] = "."));
    return removable.length;
}
