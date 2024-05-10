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
            case elementTypes.UMLInitialState:
                element = Element.DefaultUMLInititalState();
                break;
            case elementTypes.UMLFinalState:
                element = Element.DefaultUMLFinalState();
                break;
            case elementTypes.UMLSuperState:
                element = Element.DefaultUMLSuperState();
                break;
            case elementTypes.sequenceActor:
                element = Element.DefaultSequenceActor();
                break;
            case elementTypes.sequenceObject:
                element = Element.DefaultSequenceObject();
                break;
            case elementTypes.sequenceActivation:
                element = Element.DefaultSequenceActivation();
                break;
            case elementTypes.sequenceLoopOrAlt:
                element = Element.DefaultSequenceLoopOrAlt();
                break;
            case elementTypes.note:
                element = Element.DefaultNote();
                break;
            case elementTypes.Ghost:
                element = Element.DefaultGhost();
                break;
        }
        return element;
    }

    static DefaultEREntity() {
        return new Element({
            name: "Entity",
            type: entityType.ER,
            kind: elementTypesNames.EREntity,
            state: entityState.NORMAL,
            width: 200,
            height: 50,
            minWidth: 150,
            minHeight: 50,
        });
    }

    static DefaultERRelation() {
        return new Element({
            name: "Relation",
            type: entityType.ER,
            kind: elementTypesNames.EREntity,
            state: attrState.NORMAL,
            width: 90,
            height: 90,
            minWidth: 60,
            minHeight: 60,
        });
    }

    static DefaultERAttr() {
        return new Element({
            name: "Attribute",
            type: entityType.ER,
            kind: elementTypesNames.ERAttr,
            state: relationState.NORMAL,
            width: 90,
            height: 45,
            minWidth: 90,
            minHeight: 45,
        });
    }

    static DefaultUMLEntity() {
        return new Element({
            name: "Class",
            type: entityType.UML,
            kind: elementTypesNames.UMLEntity,
            state: entityState.NORMAL,
            width: 200,
            minWidth: 150,
            attributes: ['-Attribute'],
            functions: ['+Function'],
        });
    }

    static DefaultUMLRelation() {
        return new Element({
            type: "UML",
            kind: "UMLRelation",
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
        });
    }

    static DefaultIEEntity() {
        return new Element({
            name: "IEEntity",
            type: "IE",
            kind: "IEEntity",
            width: 200,
            minWidth: 150,
            primaryKey: ['*Primary Key'],
            attributes: ['-Attribute'],
            functions: ['+function'],
        })
    }

    static DefaultIERelation() {
        return new Element({
            type: "IE",
            kind: "IERelation",
            width: 50,
            height: 50,
            minWidth: 50,
            minHeight: 50,
        });
    }

    static DefaultSDEntity() {
        return new Element({
            name: "State",
            type: "SD",
            kind: "SDEntity",
            width: 200,
            minWidth: 150,
            attributes: ['do: func'],
            functions: ['+function'],
        })
    }

    static DefaultUMLInititalState() {
        return new Element({
            type: "SD",
            kind: "UMLInitialState",
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
            fill: color.BLACK,
        })
    }

    static DefaultUMLFinalState() {
        return new Element({
            type: "SD",
            kind: "UMLFinalState",
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
            fill: color.BLACK,
        });
    }

    static DefaultUMLSuperState() {
        return new Element({
            name: "UML Super State",
            type: "SD",
            kind: "UMLSuperState",
            width: 500,
            height: 500,
            minWidth: 200,
            minHeight: 150,
        });
    }

    static DefaultSequenceActor() {
        return new Element({
            name: "name",
            type: "SE",
            kind: "sequenceActor",
            width: 100,
            height: 500,
            minWidth: 100,
            minHeight: 100,
        });
    }

    static DefaultSequenceObject() {
        return new Element({
            name: "name",
            type: "SE",
            kind: "sequenceObject",
            width: 100,
            height: 500,
            minWidth: 100,
            minHeight: 50,
        });
    }

    static DefaultSequenceActivation() {
        return new Element({
            name: "Activation",
            type: "SE",
            kind: "sequenceActivation",
            width: 30,
            height: 100,
            minWidth: 30,
            minHeight: 50,
        });
    }

    static DefaultSequenceLoopOrAlt() {
        return new Element({
            type: "SE",
            kind: "sequenceLoopOrAlt",
            width: 750,
            height: 300,
            minWidth: 150,
            minHeight: 50,
            alternatives: ["alternative1"],
            altOrLoop: "Alt",
        });
    }

    static DefaultNote() {
        return new Element({
            name: "Note",
            type: "NOTE",
            kind: "note",
            width: 200,
            height: 50,
            minWidth: 150,
            minHeight: 50,
            attributes: ['Note'],
        });
    }

    static DefaultGhost() {
        return new Element({
            type: "ER",
            kind: "ERAttr",
            width: 5,
            height: 5,
        });
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