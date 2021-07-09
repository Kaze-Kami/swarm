import {Vector} from "../math/vector.js";

export function Impulse(p0 = new Vector(), v0 = new Vector(), a0 = new Vector(), vDamp = 1, aDamp = 1) {
    this.p = p0;
    this.v = v0;
    this.a = a0;

    this.vDamp = vDamp;
    this.aDamp = aDamp;
    this.angle = 0;
}

Impulse.prototype.update = function (dt, da = new Vector(0, 0)) {
    this.a.iAdd(da);

    const dv = this.a.mul(dt);
    const dp = this.v.mul(dt).iAdd(this.a.mul(Math.pow(dt, 2) / 2));

    this.p.iAdd(dp);
    this.v.iAdd(dv).iDiv(1 + this.vDamp * dt);
    this.a.iDiv(1 + this.aDamp * dt);

    if (this.v.norm() !== 0) {
        this.angle = this.v.angle();
    }
}

Impulse.prototype.limit = function (bounds, radius, vMax = undefined) {
    if (vMax !== undefined) {
        this.v.iLimit(vMax);
    }

    if (this.p.x - radius <= -bounds.x) {
        this.p.x = -bounds.x + radius;
        this.v.x = 0;
        this.a.x = 0;
    } else if (bounds.x <= this.p.x + radius) {
        this.p.x = bounds.x - radius;
        this.v.x = 0;
        this.a.x = 0;
    }

    if (this.p.y - radius <= -bounds.y) {
        this.p.y = -bounds.y + radius;
        this.v.y = 0;
        this.a.y = 0;
    } else if (bounds.y <= this.p.y + radius) {
        this.p.y = bounds.y - radius;
        this.v.y = 0;
        this.a.y = 0;
    }
}