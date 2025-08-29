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
    let da = new Vector();
    const head = this.segments[0];
    const attracted = this.attractor.active

    if (attracted) {
        // move towards attractor
        da.iAdd(this.attractor.p.sub(head.p).iMul(this.attractor.force))
    }

    if (Math.random() < this.randomness || head.v.norm() < this.vMin) {
        // random movement
        let a = this.a0
        if (attracted) {
            a *= (1 + this.attractor.force) // additional randomness when attracted?
        }
        da.iAdd(RandomUnit(a * Math.random()));
    }
    head.update(dt, da);

    if (!attracted) {
        // dampen velocity
        head.v.iDiv(1 + head.vDamp * 2 * dt);
    }

    head.limit(viewBounds, this.size / 2, this.vMax);


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

        const sizeMod = (1 - i / this.length);
        const size = (this.size - 5) * sizeMod;
        const borderSize = (this.size) * sizeMod;
        const lightness = .5 - .5 * (i / self.segments.length);

        ctx.setFillStyle(hsla(this.hue, 1, lightness, 1));
        ctx.setStrokeStyle(hsla(this.hue, 1, lightness, 1));

        ctx.save();
        ctx.translate(imp.p);
        ctx.rotate(imp.angle);
        ctx.fillRect(new Vector(), new Vector(size, size));
        ctx.strokeRect(new Vector(), new Vector(borderSize, borderSize));

        if (i === 0) {
            // 'fancy head' :^)
            ctx.line(new Vector(borderSize / 2, size / 2), new Vector(borderSize * 1.2, borderSize * .5));
            ctx.line(new Vector(borderSize / 2, -size / 2), new Vector(borderSize * 1.2, -borderSize * .5));
        }

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