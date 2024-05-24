
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
        } = {}
    ) {
        this.name = name;
        this.id = id;
        this.x = x;
        this.y = y;
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
    }
    static Default(type) {
        return new Element(defaults[Object.keys(elementTypes).find(key => elementTypes[key] === type)]);
    }

    static GetElementSize(id) {
        const element = data.find(item => item.id == id);
        return {width: element.width, height: element.height};
    }

    static GetELementPosition(id) {
        const element = data.find(item => item.id == id);
        return {x: element.x, y: element.y};
    }
}
