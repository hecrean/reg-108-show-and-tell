const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const roundTo1Dp = (n: number) => Math.round(n * 10) / 10;

export { clamp, roundTo1Dp };
