import * as fs from 'fs';
import { setDriftlessInterval as methodD, clearDriftless } from 'driftless';

const size = 100;
const X = Array(size).fill(0).map((_, i) => i);

const data = {
    x: X,
    y: [0],
    mode: 'markers',
    type: 'lines+markers',
    name: 'library'
};

const start = Date.now();
const interval = 1000;

console.log(new Date());
const id4 = methodD(() => {
    console.log(new Date());
    if (data.y.length < size)
        data.y.push(Date.now() - (start + interval * data.y.length));
}, interval);

setTimeout(() => {
    // clearInterval(id1);
    // id2.stop();
    // clearTimer(id3);
    clearDriftless(id4);

    fs.writeFileSync('./data_library.json', JSON.stringify(data));
}, interval * size + 1000);