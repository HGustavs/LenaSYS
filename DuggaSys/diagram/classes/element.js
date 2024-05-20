
/**
 * @description Element class for all elements in the diagram.
 * @class
 * @public
 */
class Element {
    /**
     * @description Element class for all elements in the diagram.
     * @param {Object} options - The options for creating the element.
     * @param {string} [options.name=''] - The name of the element. 
     * @param {string} [options.id=makeRandomID()] - The unique identifier of the element. Default is a random ID.
     * @param {string} [options.type=null] - The type of the element. Can be ER, UML, IE, SD, or SE.
     * @param {string} [options.kind=null] - The kind of the element. Can be any of the elementTypesNames.
     * @param {number} [options.x=0] - The x-coordinate of the element. Default is 0.
     * @param {number} [options.y=0] - The y-coordinate of the element. Default is 0.
     * @param {number} [options.width=0] - The width of the element. Default is 0.
     * @param {number} [options.height=0] - The height of the element. Default is 0.
     * @param {number} [options.minWidth=0] - The minimum width of the element. Default is 0.
     * @param {number} [options.minHeight=0] - The minimum height of the element. Default is 0.
     * @param {string} [options.fill=color.WHITE] - The fill color of the element. Default is WHITE.
     * @param {string} [options.stroke=color.BLACK] - The stroke color of the element. Default is BLACK.
     * @param {string} [options.state=null] - The state of the element.
     * @param {string} [options.primaryKey=null] - The primary key of the element. 
     * @param {Array} [options.attributes=null] - The attributes of the element.
     * @param {Array} [options.functions=null] - The functions of the element.
     * @param {string} [options.altOrLoop=null] - The alternative or loop type of the element.
     * @param {Array} [options.alternatives=null] - The alternatives of the element.
     */
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

    /**
     * @description Creates an element depending on the kind.
     * @param {string} kind - The kind of element.
     */
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

    /**
     * @description Creates a default ER Entity element.
     * @returns {Element} The default ER Entity element.
     */
    static DefaultEREntity() {
        return new Element({
            name: "ER Entity",
            type: entityType.ER,
            kind: elementTypesNames.EREntity,
            state: entityState.NORMAL,
            width: 200,
            height: 50,
            minWidth: 150,
            minHeight: 50,
        });
    }

    /**
     * @description Creates a default ER Relation element.
     * @returns {Element} The default ER Relation element.
     */
    static DefaultERRelation() {
        return new Element({
            name: "Relation",
            type: entityType.ER,
            kind: elementTypesNames.ERRelation,
            state: attrState.NORMAL,
            width: 80,
            height: 80,
            minWidth: 60,
            minHeight: 60,
        });
    }

    /**
     * @description Creates a new Element with default attributes for ER attributes.
     * @returns {Element} The newly created Element object.
     */
    static DefaultERAttr() {
        return new Element({
            name: "Attribute",
            type: entityType.ER,
            kind: elementTypesNames.ERAttr,
            state: relationState.NORMAL,
            width: 84,
            height: 49,
            minWidth: 90,
            minHeight: 45,
        });
    }

    /**
     * @description Creates a default UML entity element.
     * @returns {Element} The default UML entity element.
     */
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

    
    /**
     * @description Creates a new instance of the Element class representing a default UML relation.
     * @returns {Element} The newly created Element instance.
     */
    static DefaultUMLRelation() {
        return new Element({
            name: "Class Relation",
            type: entityType.UML,
            kind: elementTypesNames.UMLRelation,
            width: 56,
            height: 56,
            minWidth: 60,
            minHeight: 60,
        });
    }

    /**
     * @description Creates a default IE Entity element.
     * @returns {Element} The default IE Entity element.
     */
    static DefaultIEEntity() {
        return new Element({
            name: "IE Entity",
            type: entityType.IE,
            kind: elementTypesNames.IEEntity,
            width: 200,
            minWidth: 150,
            primaryKey: ['*Primary Key'],
            attributes: ['-Attribute'],
            functions: ['+function'],
        })
    }

    /**
     * @description Creates a default IE Relation element.
     * @returns {Element} The default IE Relation element.
     */
    static DefaultIERelation() {
        return new Element({
            name: "IE Relation",
            type: entityType.IE,
            kind: elementTypesNames.IERelation,
            width: 62,
            height: 62,
            minWidth: 50,
            minHeight: 50,
        });
    }

    /**
     * @description Creates a default SD Entity element.
     * @returns {Element} The default SD Entity element.
     */
    static DefaultSDEntity() {
        return new Element({
            name: "SD Entity",
            type: entityType.SD,
            kind: elementTypesNames.SDEntity,
            width: 200,
            minWidth: 150,
            attributes: ['do: func'],
            functions: ['+function'],
        })
    }

    /**
     * @description Creates a new instance of the Element class representing an Initial State in a UML diagram.
     * @returns {Element} The newly created Element object.
     */
    static DefaultUMLInititalState() {
        return new Element({
            name: "Initial State",
            type: entityType.SD,
            kind: elementTypesNames.UMLInitialState,
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
            fill: color.BLACK,
        })
    }

    /**
     * @description Creates a default UML final state element.
     * @returns {Element} The default UML final state element.
     */
    static DefaultUMLFinalState() {
        return new Element({
            name: "Final State",
            type: entityType.SD,
            kind: elementTypesNames.UMLFinalState,
            width: 60,
            height: 60,
            minWidth: 60,
            minHeight: 60,
            fill: color.BLACK,
        });
    }

    /**
     * @description Creates a new instance of the Element class with default values for a UML Super State.
     * @returns {Element} The newly created Element instance.
     */
    static DefaultUMLSuperState() {
        return new Element({
            name: "Super State",
            type: entityType.SD,
            kind: elementTypesNames.UMLSuperState,
            width: 500,
            height: 500,
            minWidth: 200,
            minHeight: 150,
        });
    }

    /**
     * @description Creates a default sequence actor element.
     * @returns {Element} The default sequence actor element.
     */
    static DefaultSequenceActor() {
        return new Element({
            name: "Actor",
            type: entityType.SE,
            kind: elementTypesNames.sequenceActor,
            width: 100,
            height: 500,
            minWidth: 100,
            minHeight: 100,
        });
    }

    /**
     * @description Creates a default sequence object element.
     * @returns {Element} The default sequence object element.
     */
    static DefaultSequenceObject() {
        return new Element({
            name: "Object",
            type: entityType.SE,
            kind: elementTypesNames.sequenceObject,
            width: 100,
            height: 500,
            minWidth: 100,
            minHeight: 50,
        });
    }

    /**
     * @description Creates a default sequence activation element.
     * @returns {Element} The default sequence activation element.
     */
    static DefaultSequenceActivation() {
        return new Element({
            name: "Activation",
            type: entityType.SE,
            kind: elementTypesNames.sequenceActivation,
            width: 30,
            height: 100,
            minWidth: 30,
            minHeight: 50,
        });
    }

    /**
     * @description Creates a new Element instance representing a default sequence loop or alternative.
     * @returns {Element} The newly created Element instance.
     */
    static DefaultSequenceLoopOrAlt() {
        return new Element({
            name: "Loop or Alt",
            type: entityType.SE,
            kind: elementTypesNames.sequenceLoopOrAlt,
            width: 750,
            height: 300,
            minWidth: 150,
            minHeight: 50,
            alternatives: ["alternative1"],
            altOrLoop: "Alt",
        });
    }

    /**
     * @description Creates a default note element.
     * @returns {Element} The default note element.
     */
    static DefaultNote() {
        return new Element({
            name: "Note",
            type: entityType.note,
            kind: "note",
            width: 200,
            height: 50,
            minWidth: 150,
            minHeight: 50,
            attributes: ['Note'],
        });
    }

    /**
     * @description Creates a default ghost element.
     * @returns {Element} The default ghost element.
     */
    static DefaultGhost() {
        return new Element({
            name: "Ghost",
            type: entityType.ER,
            kind: elementTypesNames.ERAttr,
            width: 5,
            height: 5,
        });
    }
}
