import {FromPolar, Vector} from "./math/vector.js";
import {AnimationTimer} from './util/animation_timer.js';
import {Context} from "./graphics/context.js";
import {Entity} from "./core/entity.js";
import {iRand} from "./math/util.js";
import {Attractor} from "./core/attractor.js";

// external libraries
import Stats from "./lib/stats/stats.module.js";

const numEntities = 20;
const numSegments = 7;

const spreadSpacing = 5;
const spreadRadius = 25;

const sizeMin = 8;
const sizeMax = 15;

const vMin = 10;
const vMax = 200;
const vDamp = 2;
const aDamp = 1.3;
const cSpring = 8;
const fAttractor = 4;

const randomness = .03;
const acceleration = 650;

const debug = false;

/* Global variables */
const canvas = document.getElementById('app');
const ctx = new Context(canvas);
const timer = new AnimationTimer();
const attractor = new Attractor(fAttractor);
const stats = new Stats();
let viewBounds;
let entities;

function init() {
    if (debug) {
        stats.showPanel(1);
        document.body.appendChild(stats.dom);
    }

    entities = [];

    let alpha = 0;
    let radius = spreadRadius;
    let dAlpha = 2 * Math.PI / spreadSpacing;

    for (let i = 0; i < numEntities; i++) {
        const size = iRand(sizeMax, sizeMin);
        const position = FromPolar(alpha, radius);

        alpha += dAlpha;
        if ((i + 1) % spreadSpacing === 0) {
            alpha -= Math.PI;
            radius += spreadRadius;
        }

        const e = new Entity(
            numSegments,
            size,
            randomness,
            position,
            acceleration,
            vMin,
            vMax,
            vDamp,
            aDamp,
            cSpring,
            attractor
        );
        entities.push(e);
    }
}

function animate(timestamp) {
    // next callback
    requestAnimationFrame(animate);

    // skip first run
    if (timestamp === undefined) return;

    if (debug) stats.begin();
    ctx.beginFrame();

    ctx.setComposition('source-over');
    const dt = timer.update(timestamp);

    entities.forEach(function (entity, _) {
        entity.update(dt, viewBounds);
        entity.draw(ctx);
        if (debug) entity.visualizeImpulses(ctx);
    });

    ctx.endFrame();
    if (debug) stats.end();
}

/* helper functions */
function resize() {
    // fetch window size
    const width = window.innerWidth;
    const height = window.innerHeight;

    // resize canvas
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // update context
    ctx.scale(devicePixelRatio, devicePixelRatio);

    viewBounds = new Vector(width / 2, height / 2);
}

/* event listeners */
window.addEventListener('resize', resize);

window.addEventListener('mousedown', function () {
    attractor.active = true;
});

window.addEventListener('mouseup', function () {
    attractor.active = false;
});

window.addEventListener('mousemove', function (e) {
    attractor.p = new Vector(e.clientX - viewBounds.x, -e.clientY + viewBounds.y);
});

resize();
init();
animate();