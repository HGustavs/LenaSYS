class Element {
    constructor({
            name = '', id = makeRandomID(),
            x = 0, y = 0,
            width = 0, height = 0,
            minWidth = 0, minHeight = 0,
            type = null, kind = null, state = null,
            fill = color.WHITE, stroke = color.BLACK,
            attributes = null, functions = null
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
        this.attributes = attributes;
        this.functions = functions;
    }

    static FromKind(kind) {
        let element;
        switch (kind) {
            case elementTypes.EREntity:
                element = Element.DefaultEREntity();
                break;
            case elementTypes.ERRelation:
                element = Element.DefaultERRelation();
                break;
            case elementTypes.ERAttr:
                element = Element.DefaultERAttr();
                break;
            case elementTypes.UMLEntity:
                element = Element.DefaultUMLEntity();
                break;
            case elementTypes.UMLRelation:
                element = Element.DefaultUMLRelation();
                break;
            case elementTypes.IEEntity:
                element = Element.DefaultIEEntity();
                break;
            case elementTypes.IERelation:
                element = Element.DefaultIERelation();
                break;
            case elementTypes.SDEntity:
                element = Element.DefaultSDEntity();
                break;
        }
        return element;
    }

    static DefaultEREntity() {
        return new Element({
            name: "Entity",
            width: 200,
            height: 50,
            minWidth: 150,
            minHeight: 50,
            type: entityType.ER,
            kind: elementTypesNames.EREntity,
            state: entityState.NORMAL,
        });
    }

    static DefaultERRelation() {
        return new Element({
            name: "Relation",
            width: 90,
            height: 90,
            minWidth: 60,
            minHeight: 60,
            type: entityType.ER,
            kind: elementTypesNames.EREntity,
            state: attrState.NORMAL,
        });
    }

    static DefaultERAttr() {
        return new Element({
            name: "Attribute",
            width: 90,
            height: 45,
            minWidth: 90,
            minHeight: 45,
            type: entityType.ER,
            kind: elementTypesNames.ERAttr,
            state: relationState.NORMAL,
        });
    }

    static DefaultUMLEntity() {
        return new Element({
            name: "Class",
            width: 200,
            minWidth: 150,
            type: entityType.UML,
            kind: elementTypesNames.UMLEntity,
            state: entityState.NORMAL,
            attributes: ['-Attribute'],
            functions: ['+Function'],
        });
    }

    static DefaultUMLRelation() {
        return new Element({
            name: "Inheritance",
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
            type: "UML",
            kind: "UMLRelation",
        });
    }

    static DefaultIEEntity() {
        return new Element({
            name: "IEEntity",
            width: 200,
            minWidth: 150,
            type: "IE",
            kind: "IEEntity",
            primaryKey: ['*Primary Key'],
            attributes: ['-Attribute'],
            functions: ['+function'],
        })
    }

    static DefaultIERelation() {
        return new Element({
            name: "Inheritance",
            width: 50,
            height: 50,
            minWidth: 50,
            minHeight: 50,
            type: "IE",
            kind: "IERelation",
        });
    }

    static DefaultSDEntity() {
        return new Element({
            name: "State",
            width: 200,
            minWidth: 150,
            type: "SD",
            kind: "SDEntity",
            attributes: ['do: func'],
            functions: ['+function'],
        })
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