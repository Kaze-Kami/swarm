import {Vector} from "../math/vector.js";

export function ArrowHelper(p, v, color, lineWidth = 1, tipWidth= 3, tipLength= 7) {
    this.color = color;
    this.lineWidth = lineWidth;

    this.position = p;
    this.head = new Vector(v.norm(), 0);
    this.angle = v.angle();

    this.t0 = this.head.add(new Vector(-tipLength, tipWidth));
    this.t1 = this.head.add(new Vector(-tipLength, -tipWidth));
}

ArrowHelper.prototype.draw = function (ctx) {
    ctx.save();

    ctx.setComposition('source-over');

    ctx.setFillStyle(this.color);
    ctx.setStrokeStyle(this.color);
    ctx.setLineWidth(this.lineWidth);

    ctx.translate(this.position);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(new Vector());
    ctx.lineTo(this.head);
    ctx.lineTo(this.t0);
    ctx.lineTo(this.t1);
    ctx.lineTo(this.head);
    ctx.stroke();

    ctx.restore();
}