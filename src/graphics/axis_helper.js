import {ArrowHelper} from "./arrow_helper.js";
import {Vector} from "../math/vector.js";

export function AxisHelper(position, size, iColor, jColor, lineWidth = 1) {
    this.position = position;
    this.size = size;

    this.iColor = iColor;
    this.jColor = jColor;

    this.i = new Vector(1, 0).iMul(this.size);
    this.j = new Vector(0, 1).iMul(this.size);

    this.iArrow = new ArrowHelper(
        new Vector(),
        this.i,
        this.iColor,
        lineWidth
    );
    this.jArrow = new ArrowHelper(
        new Vector(),
        this.j,
        this.jColor,
        lineWidth
    );
}

AxisHelper.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.position);

    this.iArrow.draw(ctx);
    this.jArrow.draw(ctx);

    ctx.restore();
}