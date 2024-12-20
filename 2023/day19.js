const file = require("path").basename(__filename);

// Star 1: 333263
// Star 2: 

parseData(`px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`);

require('node:fs').readFile(file.replace(".js", ".txt"),
  'utf8', (err, data) => parseData(data)
);


function parseData(data)
{
  // Star 1:
  // parseData1(data);
  
  // Star 2:
  let [workflows, parts] = data.split("\n\n");

  let flows = {};

  workflows = workflows.split("\n").map(wf => {
    let [name, rules] = wf.split("{");
    rules = rules.slice(0,-1).split(",").map(rule => {
      if (rule.indexOf(":") != -1) {
        let [condition, out] = rule.split(":");
        let op = condition.indexOf("<") != -1 ? "<" : ">";    
        let [letter, value] = condition.split(op);
        return {
          op: op,
          letter: letter,
          value: parseInt(value),
          out: out,
        }
      } else {
        return { out: rule }
      }
    })
    flows[name] = rules;
    return name;
  });

  
}

function parseData1(data)
{
  let [workflows, parts] = data.split("\n\n");

  let flows = {};

  workflows = workflows.split("\n").map(wf => {
    let [name, rules] = wf.split("{");
    rules = rules.slice(0,-1).split(",").map(rule => {
      if (rule.indexOf(":") != -1) {
        let [condition, out] = rule.split(":");
        let op = condition.indexOf("<") != -1 ? "<" : ">";    
        let [letter, value] = condition.split(op);
        return {
          op: op,
          letter: letter,
          value: parseInt(value),
          out: out,
        }
      } else {
        return { out: rule }
      }
    })
    flows[name] = rules;
    return name;
  })

  parts = parts.split("\n").map(part => {
    let [x,m,a,s] = part.slice(1,-1).split(",");
    return {
      x: parseInt(x.split("=")[1]),
      m: parseInt(m.split("=")[1]),
      a: parseInt(a.split("=")[1]),
      s: parseInt(s.split("=")[1])
    };
  })

  function check(part)
  {
    let flow = flows["in"];
    
    for (let i = 0; flow && i < flow.length; i++) {
      let rule = flow[i];
      let test = false;
      switch (rule.op) {
        case "<": test = part[rule.letter] < rule.value; break;
        case ">": test = part[rule.letter] > rule.value; break;
        default:  test = true; break;
      }
      if (test) {
        if (rule.out == "A") return true;
        if (rule.out == "R") return false;
        flow = flows[rule.out];
        i = -1;
      }
    }

    return false;
  }


  let total = 0;
  parts.forEach(part => {
    if (check(part)) {
      total += part.x + part.m + part.a + part.s;
    }
  })

  console.log(total);
}