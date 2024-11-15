const timerMap = {};
let nextId = 0;

function driftless(id: number, fn: Function, timeout: number, expected: number, threshold = 3, biggestStep = 1.2, smallestStep = 3) {
    const remain = expected - Date.now();
    // console.log(remain);
    
    let handle;

    if (remain > threshold) {
        // remain과 timeout(=1000)이 비슷할수록 biggestStep에 가깝게, remain이 threshold(=1)에 가까울수록 smallestStep에 가깝게
        const factor = biggestStep + (smallestStep - biggestStep) * (timeout - remain) / timeout;
        
        handle = setTimeout(() => {
            driftless(id, fn, timeout, expected);
        }, remain / factor);
    }
    else {    // -inf < remain <= threshold
        handle = setTimeout(fn, 0);
    }

    timerMap[id] = handle;
}

function driftlessId(fn: Function, timeout: number, expected: number): number {
    const id = nextId++;
    driftless(id, fn, timeout, expected);
    return id;
}

export function clearTimer(id: number) {
    clearTimeout(timerMap[id]);
    delete timerMap[id];
}

export function setTimeoutFixed<F extends (...args: any[]) => any>(
    func: F,
    timeout: number,
    ...args: Parameters<F>
): number {
    let expected = Date.now() + timeout;

    return driftlessId(() => {
        func(...args);
    }, timeout, expected);
}

export function setIntervalFixed<F extends (...args: any[]) => any>(
    func: F,
    timeout: number,
    ...args: Parameters<F>
): number {
    let expected = Date.now() + timeout;
    let id;

    const fn = () => {
        func(...args);
        expected += timeout;
        driftless(id, fn, timeout, expected);
    };

    id = driftlessId(fn, timeout, expected);
    
    return id;
}