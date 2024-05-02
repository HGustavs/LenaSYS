class Rect {

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    static fromPoints(topLeft, botRight) {
        return new Rect(
            topLeft.x, topLeft.y,
            botRight.x - topLeft.x,
            botRight.y - topLeft.y
        );
    }

    static fromElement(element) {
        return new Rect(
            element.x, element.y,
            document.getElementById(element.id).offsetWidth,
            document.getElementById(element.id).offsetHeight
        );
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
    set width(width) {
        this._width = width;
    }
    set height(height) {
        this._height = height;
    }

    get topLeft() {
        return new Point(this.x, this.y);
    }
    get topRight() {
        return new Point(this.x + this.width , this.y);
    }
    get botLeft() {
        return new Point(this.x, this.y + this.height);
    }
    get botRight() {
        return new Point(this.x + this.width, this.y + this.height);
    }

    overlap(other) {
        return (
            this.x + this.width > other.x + other.width * 0.75 &&
            this.y + this.height > other.y + other.height * 0.75 &&
            this.x < other.x + 0.25 * other.width &&
            this.y < other.y + 0.25 * other.height
        );
    }

}