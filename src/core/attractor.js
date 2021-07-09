import {Vector} from "../math/vector.js";

export function Attractor(force) {
    this.active = false;
    this.force = force;
    this.p = new Vector();
}