export function AnimationTimer() {
    this.t0 = 0;
    this.dt = 0;
}

AnimationTimer.prototype.update = function (timestamp) {
    if (this.t0 === 0) {
        this.t0 = timestamp;
    }

    this.dt = (timestamp - this.t0) / 1e3;
    this.t0 = timestamp;

    return this.dt;
}