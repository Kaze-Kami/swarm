import {clamp} from "./util.js";

export {Vector, FromPolar, Random, RandomUnit};

function Vector(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

function FromPolar(angle, magnitude) {
    return new Vector(Math.sin(angle), Math.cos(angle)).iMul(magnitude);
}

function Random() {
    return new Vector(-1 + 2 * Math.random(), -1 + 2 * Math.random());
}

function RandomUnit(magnitude = 1) {
    return FromPolar(2 * Math.PI * Math.random(), magnitude);
}

Vector.prototype.toString = function () {
    return `Vector [${this.x}, ${this.y}]`;
}

Vector.prototype.set = function (other) {
    this.x = other.x;
    this.y = other.y;
}

/* basic operations */

Vector.prototype.copy = function () {
    return new Vector(this.x, this.y);
}

Vector.prototype.mul = function (scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
}

Vector.prototype.div = function (scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
}

Vector.prototype.add = function (other) {
    return new Vector(this.x + other.x, this.y + other.y);
}

Vector.prototype.sub = function (other) {
    return new Vector(this.x - other.x, this.y - other.y);
}

Vector.prototype.pow = function (scalar) {
    return new Vector(Math.pow(this.x, scalar), Math.pow(this.y, scalar));
}

/* basic operations in place */

Vector.prototype.iMul = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
}

Vector.prototype.iDiv = function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
}

Vector.prototype.iAdd = function (other) {
    this.x += other.x;
    this.y += other.y;
    return this;
}

Vector.prototype.iSub = function (other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
}

Vector.prototype.iPow = function (scalar) {
    const sx = Math.sign(this.x);
    const sy = Math.sign(this.y);
    this.x = sx * Math.pow(Math.abs(this.x), scalar);
    this.y = sy * Math.pow(Math.abs(this.y), scalar);
    return this;
}


/* vector math */

Vector.prototype.dot = function (other) {
    return this.x * other.x + this.y * other.y;
}

Vector.prototype.norm = function() {
    if (this.x === 0 && this.y === 0) return 0;

    return Math.sqrt(this.dot(this));
}

Vector.prototype.normalize = function () {
    const norm = this.norm();
    return new Vector(this.x / norm, this.y / norm);
}

Vector.prototype.angle = function() {
    return Math.atan2(this.y, this.x);
}

/* vector math in place */

Vector.prototype.iNormalize = function () {
    const norm = this.norm();
    this.x /= norm;
    this.y /= norm;
    return this;
}

/* util */

Vector.prototype.clamp = function(min, max) {
    return new Vector(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
}

Vector.prototype.limit = function (maxLength) {
    const length = this.norm();
    if (maxLength < length) {
        return this.mul(maxLength / length);
    }

    return this.copy();
}

/* util in place */

Vector.prototype.iClamp = function (min, max) {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    return this;
}

Vector.prototype.iLimit = function (maxLength) {
    const length = this.norm();
    if (maxLength < length) {
        return this.iNormalize().iMul(maxLength);
    }

    return this;
}