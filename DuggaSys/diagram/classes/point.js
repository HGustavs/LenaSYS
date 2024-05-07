/**
 * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector.
 */
class Point {
    /**
     * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector.
     * @param {number} startX
     * @param {number} startY
     */
    constructor(startX = 0, startY = 0) {
        this.x = startX;
        this.y = startY;
    }

    /**
     * @description Adds x and y of another point to this point.
     * @param {Point} other Point that should be appended to this.
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
}
