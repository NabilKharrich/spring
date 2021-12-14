class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    }

    scale(val) {
        this.x *= val;
        this.y *= val;

        return this;
    }

    divide(val) {
        this.x /= val;
        this.y /= val;

        return this;
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2), Math.pow(this.y, 2));
    }

    normalize() {
        const m = this.magnitude();
        m !== 0 && this.divide(m);

        return this;
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    clamp(val) {
        this.x = Math.min(Math.max(this.x, -val), val);
        this.y = Math.min(Math.max(this.y, -val), val);
    }
}

export default Vector;
