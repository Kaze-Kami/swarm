import {RandomUnit, Vector} from "../math/vector.js";
import {ArrowHelper} from "../graphics/arrow_helper.js";
import {Impulse} from "./impulse.js";
import {hsla} from "../graphics/color.js";
import {rand} from "../math/util.js";

export function Entity(length, size, randomness, p0, a0, vMin, vMax, vDamp, aDamp, cSpring, attractor) {
    this.length = length;
    this.size = size;

    this.hue = rand(0, 360);

    this.randomness = randomness;

    this.p0 = p0;
    this.a0 = a0;

    this.vMin = vMin;
    this.vMax = vMax;
    this.vDamp = vDamp;
    this.aDamp = aDamp;
    this.cSpring = cSpring;

    this.attractor = attractor;
    this.wasAttracted = false;

    this.segments = [];

    // head
    const head = new Impulse(
        new Vector(),
        new Vector(),
        RandomUnit(Math.random() * a0),
        vDamp,
        aDamp,
    );
    this.segments.push(head);

    // tail
    for (let i = 0; i < length - 1; i++) {
        this.segments.push(new Impulse());
    }
}

Entity.prototype.update = function (dt, viewBounds) {
    const head = this.segments[0];
    if (this.attractor.active) {
        // move towards attractor
        head.v = this.attractor.p.add(this.p0).iSub(head.p).iMul(this.attractor.force);
        head.update(dt);
        head.limit(viewBounds, this.size / 2);
        this.wasAttracted = true;
    }
    else if (Math.random() < this.randomness || head.v.norm() < this.vMin) {
        // random movement
        const da = RandomUnit(this.a0 * Math.random());
        head.update(dt, da);
    } else {
        // update
        head.update(dt);
    }

    let vMax = undefined;
    this.wasAttracted = this.attractor.active || this.vMax < head.v.norm();
    if (!this.wasAttracted) {
        vMax = this.vMax;
    } else {
        // dampen velocity
        head.v.iDiv(1 + head.vDamp * 2 * dt);
    }

    head.limit(viewBounds, this.size / 2, vMax);


    // update tail
    for (let i = 1; i < this.length; i++) {
        const prev = this.segments[i - 1];
        const curr = this.segments[i];

        const dp = prev.p.sub(curr.p);
        const ldp = dp.norm();
        if (ldp !== 0) {
            const ldp2 = Math.max(0, ldp - this.size);
            dp.iMul(ldp2 / ldp);
        }
        curr.v = dp.iMul(this.cSpring * (.7 + .3 * i / this.length));
        curr.update(dt);
    }
}

Entity.prototype.draw = function (ctx) {
    // draw spine
    ctx.save();
    ctx.setComposition('lighter');

    for (let i = 1; i < this.length; i++) {
        const prev = this.segments[i - 1];
        const curr = this.segments[i];

        const l0 = .5 - .5 * ((i - 1) / this.length);
        const l1 = .5 - .5 * (i / this.length);

        const grad = ctx.ctx.createLinearGradient(prev.p.x, prev.p.y, curr.p.x, curr.p.y);
        grad.addColorStop(0, hsla(this.hue, 1, l0, 1))
        grad.addColorStop(1, hsla(this.hue, 1, l1, 1))

        ctx.setStrokeStyle(grad);

        ctx.beginPath();
        ctx.moveTo(prev.p);
        ctx.lineTo(curr.p);
        ctx.stroke();
    }

    ctx.restore();

    const self = this;

    // draw segments
    for (let i = this.length - 1; i >= 0; i--) {
        const imp = this.segments[i];

        const size = this.size * (1 - i / this.length);
        const lightness = .5 - .5 * (i / self.segments.length);

        ctx.setFillStyle(hsla(this.hue, 1, lightness, 1));

        ctx.save();
        ctx.translate(imp.p);
        ctx.rotate(imp.angle);
        ctx.fillRect(new Vector(), new Vector(size, size));
        ctx.restore();
    }

}

Entity.prototype.visualizeImpulses = function (ctx, scale = 1) {
    const imp = this.segments[0];
    // visualize impulses
    const vArrow = new ArrowHelper(
        imp.p,
        imp.v.mul(scale),
        hsla(0, 1, .5, 1)
    );
    vArrow.draw(ctx);

    const aArrow = new ArrowHelper(
        imp.p,
        imp.a.mul(scale),
        hsla(35, 1, .5, 1)
    )
    aArrow.draw(ctx);
}