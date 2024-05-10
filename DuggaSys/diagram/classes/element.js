class Element {
    constructor(name, id, x, y, width, height, minWidth, minHeight, type, kind, state, fill, stroke, attributes, functions) {
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
        this.attributes = attributes;
        this.functions = functions;
    }

    static DefaultEREntity() {
        return new Element(
            "Entity",
            "XXX",
            0,
            0,
            200,
            50,
            150,
            50,
            entityType.ER,
            elementTypesNames.EREntity,
            entityState.NORMAL,
            color.WHITE,
            color.BLACK,
            null,
            null,
        );
    }

    get heightFromDocument() {
        return this.height;
    }
}

/**
 * TODO: Change all to element
 * pasteClipboard
 * makeGhost
 * construction of element type
 */