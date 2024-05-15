class Rect {

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static FromPoints(topLeft, botRight) {
        return new Rect(
            topLeft.x, topLeft.y,
            botRight.x - topLeft.x,
            botRight.y - topLeft.y
        );
    }

    static FromElement(element) {
        return new Rect(
            element.x, element.y,
            document.getElementById(element.id).offsetWidth,
            document.getElementById(element.id).offsetHeight
        );
    }

    static FromDOMRect(rect) {
        return new Rect(
            rect.left, rect.top, rect.width, rect.height
        )
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.height;
    }

    get left() {
        return this.x;
    }

    get right() {
        return this.x + this.width;
    }

    get x2() {
        return this.x + this.width;
    }

    get y2() {
        return this.y + this.height;
    }

    get topLeft() {
        return new Point(this.x, this.y);
    }

    get topRight() {
        return new Point(this.x + this.width, this.y);
    }

    get botLeft() {
        return new Point(this.x, this.y + this.height);
    }

    get botRight() {
        return new Point(this.x + this.width, this.y + this.height);
    }

    partialOverlap(other) {
        const lower = 0.25;
        const upper = 0.75;
        let x1 = this.x < other.x + lower * other.width;
        let x2 = this.x + this.width > other.x + other.width * upper;
        let y1 = this.y < other.y + lower * other.height;
        let y2 = this.y + this.height > other.y + other.height * upper;
        return x1 && x2 && y1 && y2;
    }

    overlap(b) {
        return !(this.top > b.bottom ||
            this.right < b.left ||
            this.bottom < b.top ||
            this.left > b.right)
    }
}