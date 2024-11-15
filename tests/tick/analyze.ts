import * as fs from 'fs';
import { plot, Plot as PlotType } from "nodeplotlib";

const A = JSON.parse(fs.readFileSync('./data_default.json', 'utf8'));
const B = JSON.parse(fs.readFileSync('./data_recursive.json', 'utf8'));
const C = JSON.parse(fs.readFileSync('./data_substep.json', 'utf8'));
const D = JSON.parse(fs.readFileSync('./data_library.json', 'utf8'));
const E = JSON.parse(fs.readFileSync('./data_timertask.json', 'utf8'));

function calc(data: number[]): { mean: number, stdDev: number } {
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev };
}

const stdDevA = calc(A.y);
const stdDevB = calc(B.y);
const stdDevC = calc(C.y);
const stdDevD = calc(D.y);
const stdDevE = calc(E.y);

console.log(`default:   mean=${stdDevA.mean},\tstdDev=${stdDevA.stdDev}`);
console.log(`recursive: mean=${stdDevB.mean},\tstdDev=${stdDevB.stdDev}`);
console.log(`substep:   mean=${stdDevC.mean},\tstdDev=${stdDevC.stdDev}`);
console.log(`library:   mean=${stdDevD.mean},\tstdDev=${stdDevD.stdDev}`);
console.log(`timertask: mean=${stdDevE.mean},\tstdDev=${stdDevE.stdDev}`);

plot([A as PlotType, B as PlotType, C as PlotType, D as PlotType, E as PlotType]);