const testInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

export function star1(input) {
    const boxes = parse(input);

    for (let i = 0; i < 1000; i++) {
        connect(boxes);
    }

    let circuits = new Set(boxes.map((b) => b.circuit));

    return [...circuits.values()]
        .map((c) => c.size)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((t, c) => t * c, 1);
}

export function star2(input) {
    const boxes = parse(input);
    let last;
    while (boxes[0].circuit.size != boxes.length) {
        last = connect(boxes);
    }
    return last[0].coords[0] * last[1].coords[0];
}

function parse(input) {
    return input
        .trim()
        .split("\n")
        .map((line) => {
            const pt = line.split(",").map(Number);
            return {
                coords: pt,
                connections: new Set(),
                circuit: new Set([pt]),
            };
        });
}

function distsq(a, b) {
    let result =
        Math.pow(a[0] - b[0], 2) +
        Math.pow(a[1] - b[1], 2) +
        Math.pow(a[2] - b[2], 2);
    return result;
}

function closest(pts) {
    let closest = [];
    let min_dst = +Infinity;
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i];
            const b = pts[j];

            if (a.connections.has(b.coords)) continue;

            const dist = distsq(a.coords, b.coords);
            if (dist < min_dst) {
                closest = [a, b];
                min_dst = dist;
            }
        }
    }
    return closest;
}

function connect(qts) {
    const [a, b] = closest(qts);

    // add direct connection
    a.connections.add(b.coords);
    b.connections.add(a.coords);

    if (a.circuit === b.circuit) return;

    let c = a.circuit.union(b.circuit);
    let ac = a.circuit;
    let bc = b.circuit;
    qts.forEach((p) => {
        if (p.circuit === ac || p.circuit === bc) {
            p.circuit = c;
        }
    });

    return [a, b];
}
