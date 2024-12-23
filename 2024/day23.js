const file = require("path").basename(__filename);

// Star 1: 
// Star 2: 

solve(`kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`);


require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => solve(data.trim())
);


function solve(data)
{
  let lan = {};
  let tpc = [];
  data.split("\n").forEach(connection => {
    let [a, b] = connection.split("-");
    lan[a] ??= {list: [], dict: {}},
    lan[b] ??= {list: [], dict: {}}
    lan[a].list.push(b);
    lan[b].list.push(a);
    lan[a].dict[b] = true;
    lan[b].dict[a] = true;
    if (a[0] == "t") tpc.push(a);
    if (b[0] == "t") tpc.push(b);
  });

  let all_pcs = Object.keys(lan);

  let max = [];

  function sequences(seq, result) {

    let extended = false;

    seq.sort();
    if (result[seq]) return;

    result[seq] = true;
    if (seq.length > max.length) {
      max = seq;
    }

    all_pcs.forEach(p => {
      let connections = lan[p].dict;
      for (let i = 0; i < seq.length; i++) {
        if (p == seq[i] || !connections[seq[i]]) return;
      }
      sequences([...seq, p], result);
      extended = true;
    })

  }

  let result = {};
  sequences([], result);
  console.log(max.join(","));

  /*
  function triples(pc, nbrs, result) {
    if (nbrs.length == 3) {
      if (lan[nbrs[2]].dict[nbrs[0]]) {
        let [a, b, c] = nbrs;
        if (result[[a,b,c]]) return;
        if (result[[a,c,b]]) return;
        if (result[[b,a,c]]) return;
        if (result[[b,c,a]]) return;
        if (result[[c,a,b]]) return;
        if (result[[c,b,a]]) return;
        result[nbrs] = nbrs;
      }
      return;
    }
    lan[pc].list.forEach(npc => {
      if (nbrs.indexOf(npc) >= 0) return;
      triples(npc, [...nbrs, pc], result);
    });
  }

  let result = {};
  tpc.forEach(pc => triples(pc, [], result));
  console.log(Object.keys(result).length);
  */
}
