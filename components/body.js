import Vector from '../lib/vector';

class Body {
    constructor(container, mass = 1) {
        this.container = container;
        this.mass = mass;
        this.location = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.forces = [];
        this.linearForces = [];
    }

    setLocation() {
        const { left, top } = this.container.getBoundingClientRect();

        return new Vector(left, top);
    }

    setTransform() {
        this.container.style.transform = `translate3d(${this.location.x.toFixed(
            3
        )}px, ${this.location.y}px, 0)`;
    }

    addForce(force, isLinear = false) {
        const f = force.clone();
        this.forces = [...this.forces, f];

        if (isLinear) this.linearForces = [...this.linearForces, f];
    }

    applyForces() {
        this.forces.forEach((force) =>
            this.acceleration.add(force.divide(this.mass))
        );
    }

    move() {
        this.applyForces();

        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);

        // this.velocity.scale(0);

        this.setTransform();

        this.forces = this.forces.filter(
            (force) => !this.linearForces.includes(force)
        );
        this.acceleration.set(0, 0);
    }
}

export default Body;
