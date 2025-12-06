const testInput = `987654321111111
811111111111119
234234234234278
818181911112111`;

export function star1(input) {
    return banks(input).reduce((total, bank) => total + subsets(bank, 2), 0);
}

export function star2(input) {
    return banks(input).reduce((total, bank) => total + subsets(bank, 12), 0);
}

function banks(input) {
    return input
        .trim()
        .split("\n")
        .map((b) => b.split("").map((d) => Number(d)));
}

function subsets(set, len) {
    let max = [];

    impl(0, [], 0);

    function impl(index, subset) {
        if (subset.length === len) {
            max = subset;
        } else {
            const digits = subset.length;
            const prev = subset[digits - 1];
            for (let i = index; i < set.length; i++) {
                const next = (prev ?? 0) * 10 + set[i];
                if (!(next < max[digits])) {
                    impl(i + 1, [...subset, next]);
                }
            }
        }
    }

    return max[max.length - 1];
}
