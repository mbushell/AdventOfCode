const testInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

export function star1(input) {
    return ranges(input).reduce((total, [lower, upper]) => {
        for (let i = lower; i <= upper; i++) {
            if (!isValidId(i.toString(), 2)) {
                total += i;
            }
        }
        return total;
    }, 0);
}

export function star2(input) {
    return ranges(input).reduce((total, [lower, upper]) => {
        for (let i = lower; i <= upper; i++) {
            const str = i.toString();
            for (let j = 2; j <= str.length; j++) {
                if (!isValidId(str, j)) {
                    total += i;
                    break;
                }
            }
        }
        return total;
    }, 0);
}

function ranges(input) {
    return input
        .trim()
        .split(",")
        .map((range) => range.split("-").map((n) => Number(n)));
}

function isValidId(id, segments) {
    if (id.length % segments !== 0) return true;
    const sublen = id.length / segments;
    const part = id.slice(0, sublen);
    for (let i = sublen; i < id.length; i += sublen) {
        if (id.slice(i, i + sublen) !== part) return true;
    }
    return false;
}
