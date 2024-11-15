import * as fs from 'fs';

function setIntervalFixed<F extends (...args: any[]) => void>(
    func: F,
    timeout: number,
    ...args: Parameters<F>
): { stop: () => void } {
    let expected = Date.now() + timeout;
    let timeoutId;
    let stopped = false;

    const step = () => {
        if (stopped) return;

        const drift = Date.now() - expected;
        expected += timeout;

        func(...args);

        timeoutId = setTimeout(step, Math.max(0, timeout - drift));
    };

    timeoutId = setTimeout(step, timeout);

    return {
        stop: () => {
            stopped = true;
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        },
    };
}

const methodB = setIntervalFixed;

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
    name: 'recursive'
};

const start = Date.now();
const interval = 1000;

console.log(new Date());
const id2 = methodB(() => {
    console.log(new Date());
    if (data.y.length < size)
        data.y.push(Date.now() - (start + interval * data.y.length));
}, interval);

setTimeout(() => {
    // clearInterval(id1);
    id2.stop();
    // clearTimer(id3);
    // clearDriftless(id4);

    fs.writeFileSync('./data_recursive.json', JSON.stringify(data));
}, interval * size + 1000);