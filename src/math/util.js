export function rand(min=-1, max=1) {
    return min + (max - min) * Math.random();
}

export function clamp(s, min, max) {
    return (max < s ? max : (s < min ? min : s));
}

export function iRand(max, min = 0) {
    return min + Math.round((max - min) * Math.random());
}