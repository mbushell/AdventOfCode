const fs = require('node:fs');

parseData(`0 3 6 9 12 15`);
parseData(`1 3 6 10 15 21`);
parseData(`10 13 16 21 30 45`);

fs.readFile('./day9-input.txt', 'utf8',
  (err, data) => parseData(data)
);


function parseData(data)
{
  const lines = data.split("\n");
  const seqs = lines.map(line => line.split(" ").map(n => parseInt(n)));

  const total = seqs.reduce((total, seq) =>
  {
    const rows = [seq];

    let quit = false;
    while (!quit)
    {
      let row = rows[rows.length-1];
      quit = true;
      const nextRow = [];
      for (let i = 0; i < row.length - 1; i++) {
        let value = row[i + 1] - row[i];
        nextRow.push(value);
        if (value != 0) quit = false;
      }
      rows.push(nextRow);
      row = nextRow;
    }

    // Day 1:
    //let value = rows.reduceRight((total, row) => total + row[row.length - 1], 0);
    
    // Day 2:
    let value = rows.reduceRight((total, row) =>  row[0] - total, 0);

    return total + value;
  }, 0);
  
  console.log(total);
}