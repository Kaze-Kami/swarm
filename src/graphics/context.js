

export function Context(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
}

Context.prototype.beginFrame = function () {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.save();

    // clear screen
    this.ctx.clearRect(0, 0, width, height);

    // draw background
    this.ctx.fillStyle = 'hsla(247, 100%, 5%, 100%)';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.translate(width / 2, height / 2);
    this.ctx.scale(1, -1);
}

Context.prototype.endFrame = function () {
    this.ctx.restore();
}

/* basic operations */

Context.prototype.save = function () {
    this.ctx.save();
}

Context.prototype.restore = function () {
    this.ctx.restore();
}

Context.prototype.setComposition = function (composition) {
    this.ctx.globalCompositeOperation = composition;
}


/* Transformations */

Context.prototype.translate = function (delta) {
    this.ctx.translate(delta.x, delta.y);
}

Context.prototype.rotate = function (radians) {
    this.ctx.rotate(radians);
}

Context.prototype.scale = function (sx, sy) {
    this.ctx.scale(sx, sy);
}


/* Stroke, fill and line style */

Context.prototype.setFillStyle = function (fill) {
    this.ctx.fillStyle = fill;
}

Context.prototype.setStrokeStyle = function (stroke) {
    this.ctx.strokeStyle = stroke;
}

Context.prototype.setLineWidth = function (lineWidth) {
    this.ctx.lineWidth = lineWidth;
}

/* Basic drawing operations */

Context.prototype.fillRect = function (pos, size) {
    this.ctx.fillRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
}

/* Drawing Paths */

Context.prototype.beginPath = function () {
    this.ctx.beginPath();
}

Context.prototype.moveTo = function (position) {
    this.ctx.moveTo(position.x, position.y);
}

Context.prototype.lineTo = function (position) {
    this.ctx.lineTo(position.x, position.y);
}

Context.prototype.stroke = function () {
    this.ctx.stroke();
}

Context.prototype.fill = function () {
    this.ctx.fill();
}