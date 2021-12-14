import ResolveSpring from './resolve-spring.js';

function hooke(from, to, stiffness = 0.05) {
    const x = from - to;

    const hooke = -stiffness * x;
    return hooke;
}

const defaultOptions = {
    mass: 1,
    stiffness: 0.08,
    dampening: 0.7,
    precision: 0.01,
    onUpdate: () => {},
    onComplete: () => {},
};

class Spring {
    constructor(values, options) {
        this.options = { ...defaultOptions, ...options };
        this.values = [];
        this.loop = false;

        this.setValues(values, this.options.onUpdate, this.options.onComplete);
    }

    setValues(values, onUpdate, onComplete) {
        const entries = Object.entries(values);

        this.values = entries.map((tuple) => {
            return {
                acceleration: 0,
                velocity: 0,
                target: tuple[1],
                location: tuple[1],
                alias: tuple[0],
                resolved: false,
            };
        });

        return this.refresh(onUpdate, onComplete);
    }

    updateValues(newEntries, key) {
        this.values = this.values.map((val, i) => {
            if (val.alias in newEntries) {
                return { ...val, [key]: newEntries[val.alias] };
            } else {
                return val;
            }
        });
    }

    getLocations() {
        const reduced = this.values.reduce((acc, curr) => {
            acc[curr.alias] = curr.location;

            return acc;
        }, {});

        return reduced;
    }

    allSettled() {
        return this.values.every((val) => val.resolved);
    }

    render(resolve) {
        this.loop = true;

        this.values.forEach((value) => {
            const h =
                (-this.options.stiffness * (value.location - value.target)) /
                this.options.mass;

            const d = -this.options.dampening * value.velocity;

            value.acceleration += h;
            value.acceleration += d;

            value.velocity += value.acceleration;
            value.location += value.velocity;

            this.options.onUpdate(this.getLocations());

            value.acceleration = 0;

            value.resolved =
                Math.abs(value.location - value.target) < this.options.precision
                    ? true
                    : false;
        });

        console.log(this.allSettled());

        if (this.allSettled()) {
            this.loop = false;
            this.options.onComplete(this.getLocations());
            resolve();
        } else {
            requestAnimationFrame(() => this.render(resolve));
        }
    }

    setCallbacks(onUpdate, onComplete) {
        this.options.onUpdate = onUpdate || this.options.onUpdate;
        this.options.onComplete = onComplete || this.options.onComplete;
    }

    refresh(onUpdate, onComplete) {
        this.setCallbacks(onUpdate, onComplete);

        return new Promise((res) => {
            this.loop || this.render(res);
        });
    }

    set(target, { onUpdate = false, onComplete = false } = {}) {
        this.updateValues(target, 'location');
        this.updateValues(target, 'target');

        return this.refresh(onUpdate, onComplete);
    }

    goTo(target, { onUpdate = false, onComplete = false } = {}) {
        this.updateValues(target, 'target');

        return this.refresh(onUpdate, onComplete);
    }

    goFrom(location, { onUpdate = false, onComplete = false } = {}) {
        this.updateValues(location, 'location');

        return this.refresh(onUpdate, onComplete);
    }

    goFromTo(from, to, { onUpdate = false, onComplete = false } = {}) {
        this.updateValues(from, 'location');
        this.updateValues(to, 'target');

        return this.refresh(onUpdate, onComplete);
    }

    updateConfig(newEntries) {
        Object.keys(newEntries).forEach((key) => {
            this.options[key] =
                this.options.hasOwnProperty(key) && newEntries[key];
        });
    }
}

function spring(v, options) {
    return new Spring(v, options);
}

export default spring;
