import * as fs from 'fs';

const size = 100;
const X = Array(size).fill(0).map((_, i) => i);

type Plot = {
    x: number[],
    y: number[],
    mode: string,
    type: string,
    name: string
};

const data: Plot = {
    x: X,
    y: [0],
    mode: 'markers',
    type: 'lines+markers',
    name: 'default - 6'
};

const start = Date.now();
const interval = 1000;

console.log(new Date());
const id1 = setInterval(() => {
    console.log(new Date());
    if (data.y.length < size)
        data.y.push(Date.now() - (start + interval * data.y.length));
}, interval - 6);

setTimeout(() => {
    clearInterval(id1);
    // id2.stop();
    // clearTimer(id3);
    // clearDriftless(id4);

    fs.writeFileSync('./data_default.json', JSON.stringify(data));
}, interval * size + 1000);