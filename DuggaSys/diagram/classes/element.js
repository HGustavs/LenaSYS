
/**
 * @description Element class for all elements in the diagram.
 * @class
 * @public
 */
class Element {
    constructor({
            name = '',
            id = makeRandomID(),
            type = null,
            kind = null,
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            minWidth = 0,
            minHeight = 0,
            fill = color.WHITE,
            stroke = color.BLACK,
            state = null,
            primaryKey = null,
            attributes = null,
            functions = null,
            altOrLoop = null,
            alternatives = null,
            stereotype = null,
        } = {}
    ) {
        this.name = name;
        this.id = id;
        this.x = x;
        this.y = y;
        this.anchorX;
        this.anchorY;
        this.width = width;
        this.height = height;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.type = type;
        this.kind = kind;
        this.state = state;
        this.fill = fill;
        this.stroke = stroke;
        this.attributes = attributes;
        this.functions = functions;
        this.primaryKey = primaryKey;
        this.altOrLoop = altOrLoop;
        this.alternatives = alternatives;
        this.stereotype = stereotype;
    }
    static Default(type) {
        return new Element(defaults[Object.keys(elementTypes).find(key => elementTypes[key] === type)]);
    }

    /**
     * @description Finds an element from the data array using it's ID.
     * @param {string} id ID of the element to be found.
     * @returns The found element.
     */
    static FindElementById(id) {
        return data.find(e => e.id == id);
    }

    /**
     * @description Get the demensions of a specific element.
     * @param {string} id ID of the element.
     * @returns {object} Object containg the width and height.
     */
    static GetElementSize(id) {
        const element = this.FindElementById(id);
        return {width: element.width, height: element.height};
    }

    /**
     * @description Get the position of a specific element.
     * @param {string} id ID of the element.
     * @returns {object} Object containing the X and Y coordinates.
     */
    static GetELementPosition(id) {
        const element = this.FindElementById(id);
        return {x: element.x, y: element.y};
    }

    /**
     * @description Get the color of the fill.
     * @param {string} id ID of the element.
     * @returns {object} Object containing the fill color.
     */
    static GetFillColor(id) {
        const element = this.FindElementById(id);
        return element? {fill: element.fill} : context[0].fill;
    }

    /**
     * @description Get the color of the stroke.
     * @param {string} id ID of the element.
     * @returns {object} Object containing the stroke color.
     */
    static GetStrokeColor(id) {
        const element = this.FindElementById(id);
        return element? {stroke: element.stroke} : context[0].stroke;
    }

    /**
     * @description Get attributes and functions for UML, IE, and State entities.
     * @param {string} id ID of the element.
     * @returns {object} Object containing the attributes for entities with multiple boxes.
     */
    static GetProperties(id) {
        const element = this.FindElementById(id);
        return {
            attributes: element.attributes,
            functions: element.functions,
            name: element.name,
            stereotype: element.stereotype,
        }
    }
}
