let p = 50000
let r = 8
let t = 5

let SI = (p * r * t) / 100;
let CI = p * (Math.pow((1 + r / 100), t)) - p;

console.log("Simple Interest = " + SI);
console.log("Compound Interest = " + CI);


