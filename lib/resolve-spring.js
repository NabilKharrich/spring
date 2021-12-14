/**
 * FORMULA: F = -k * x
 */

function hooke(from, to, stiffness = 0.05) {
    const x = from - to;
    const hooke = -stiffness * x;

    return hooke;
}

function dampening(value = 0.9) {
    return value;
}

function vel(v, x, t, d = 0.9) {
    v += hooke(x, t);
    v *= d;

    return v;
}

class ResolveSpring {
    constructor(location, target) {
        this.obj = document.querySelector('.object');
        this.velocity = 0;
        this.location = location;
        this.target = target;
        this.acceleration = 0;
        this.dampening = 0.85;

        this.render();
    }

    render() {
        this.acceleration = hooke(this.location, this.target);

        this.velocity += this.acceleration;
        this.velocity *= this.dampening;

        this.location += this.velocity;

        this.obj.style.transform = `translateX(${this.location}px)`;

        this.acceleration = 0;

        requestAnimationFrame(() => this.render());
    }

    getLocation() {
        return this.location;
    }
}

export default ResolveSpring;
