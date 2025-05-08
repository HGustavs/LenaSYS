/**
 * @description Rectangle
 * @class
 * @public
 */
class Rect {

    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [width=0]
     * @param {number} [height=0]
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * @param {Point} topLeft
     * @param {Point} botRight
     * @returns {Rect}
     * @constructor
     */
    static FromPoints(topLeft, botRight) {
        return new Rect(
            topLeft.x, topLeft.y,
            botRight.x - topLeft.x,
            botRight.y - topLeft.y
        );
    }

    /**
     * @description Creates a rect from the properties of an element. Gets width and height from html document.
     * @param {Element} element
     * @returns {Rect}
     * @constructor
     */
    static FromElement(element) {
        return new Rect(
            element.x, element.y,
            document.getElementById(element.id).offsetWidth,
            document.getElementById(element.id).offsetHeight
        );
    }

    /**
     * @description Used to create a Rect copy of a read-only DOMRect HTML object.
     * @param {DOMRect} rect
     * @returns {Rect}
     * @constructor
     * @example
     * let rect = Rect.FromDOMRect(
     *     document.getElementById(id).getBoundingClientRect()
     * );
     */
    static FromDOMRect(rect) {
        return new Rect(
            rect.left, rect.top, rect.width, rect.height
        )
    }

    /**
     * @returns {number}
     */
    get top() {
        return (this.height > 0) ? this.y : this.y + this.height;
    }

    /**
     * @returns {number}
     */
    get bottom() {
        return (this.height > 0) ? this.y + this.height : this.y;
    }

    /**
     * @returns {number}
     */
    get left() {
        return (this.width > 0) ? this.x : this.x + this.width;
    }

    /**
     * @returns {number}
     */
    get right() {
        return (this.width > 0) ? this.x + this.width : this.x;
    }

    /**
     * @description Returns the top left point of the rectangle
     * @returns {Point}
     */
    get topLeft() {
        return new Point(this.x, this.y);
    }

    /**
     * @description Returns the top right point of the rectangle
     * @returns {Point}
     */
    get topRight() {
        return new Point(this.x + this.width, this.y);
    }

    /**
     * @description Returns the bottom left point of the rectangle
     * @returns {Point}
     */
    get botLeft() {
        return new Point(this.x, this.y + this.height);
    }

    /**
     * @description Returns the bottom right point of the rectangle
     * @returns {Point}
     */
    get botRight() {
        return new Point(this.x + this.width, this.y + this.height);
    }

    /**
     * @description Checks if the provided rect overlaps with this rect at any point.
     * @param {Rect} other
     * @returns {boolean}
     */
    overlap(other) {
        return !(this.top > other.bottom ||
            this.right < other.left ||
            this.bottom < other.top ||
            this.left > other.right)
    }
}