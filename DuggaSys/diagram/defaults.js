/**
 * @description All default values for element types. These will be applied to new elements created via the construction function ONLY.
 * @see constructElementOfType() For creating new elements with default values.
 */
const defaults = {
    EREntity: {
        name: "ER Entity",
        type: entityType.ER,
        kind: elementTypesNames.EREntity,
        state: entityState.NORMAL,
        width: 200,
        height: 50,
        minWidth: 150,
        minHeight: 50,
        attributes: ['-attribute'],
        functions: ['+function'],
    },
    ERRelation: {
        name: "Relation",
        type: entityType.ER,
        kind: elementTypesNames.ERRelation,
        state: attrState.NORMAL,
        width: 80,
        height: 80,
        minWidth: 60,
        minHeight: 60,
    },
    ERAttr: {
        name: "Attribute",
        type: entityType.ER,
        kind: elementTypesNames.ERAttr,
        state: relationState.NORMAL,
        width: 84,
        height: 49,
        minWidth: 90,
        minHeight: 45,
    },
    UMLEntity: {
        name: "Class",
        type: entityType.UML,
        kind: elementTypesNames.UMLEntity,
        state: entityState.NORMAL,
        width: 200,
        minWidth: 150,
        attributes: ['-Attribute'],
        functions: ['+Function'],
    },
    UMLRelation: {
        name: "Class Relation",
        type: entityType.UML,
        kind: elementTypesNames.UMLRelation,
        width: 56,
        height: 56,
        minWidth: 60,
        minHeight: 60,
    },
    SelfCall: {
        name: "Self Call",
        type: entityType.UML,
        kind: elementTypesNames.SelfCall,
        width: 30,
        height: 30,
        minWidth: 50,
        maxHeight: 50,
    },
    IEEntity: {
        name: "IE Entity",
        type: entityType.IE,
        kind: elementTypesNames.IEEntity,
        width: 200,
        minWidth: 150,
        primaryKey: ['*Primary Key'],
        attributes: ['-Attribute'],
        functions: ['+function'],
    },
    IERelation: {
        name: "IE Relation",
        type: entityType.IE,
        kind: elementTypesNames.IERelation,
        width: 62,
        height: 31,
        minWidth: 50,
        minHeight: 25,
    },
    SDEntity: {
        name: "SD Entity",
        type: entityType.SD,
        kind: elementTypesNames.SDEntity,
        width: 200,
        minWidth: 150,
        attributes: ['do: func'],
        functions: ['+function'],
    },
    UMLInitialState: {
        name: "Initial State",
        type: entityType.SD,
        kind: elementTypesNames.UMLInitialState,
        width: 60,
        height: 60,
        minWidth: 60,
        minHeight: 60,
        fill: color.BLACK,
    },
    UMLFinalState: {
        name: "Final State",
        type: entityType.SD,
        kind: elementTypesNames.UMLFinalState,
        width: 60,
        height: 60,
        minWidth: 60,
        minHeight: 60,
        fill: color.BLACK,
    },
    UMLSuperState: {
        name: "Super State",
        type: entityType.SD,
        kind: elementTypesNames.UMLSuperState,
        width: 500,
        height: 500,
        minWidth: 200,
        minHeight: 150,
    },
    sequenceActor: {
        name: "Actor",
        type: entityType.SE,
        kind: elementTypesNames.sequenceActor,
        width: 100,
        height: 500,
        minWidth: 100,
        minHeight: 100,
    },
    sequenceObject: {
        name: "Object",
        type: entityType.SE,
        kind: elementTypesNames.sequenceObject,
        width: 100,
        height: 500,
        minWidth: 100,
        minHeight: 50,
    },
    sequenceActivation: {
        name: "Activation",
        type: entityType.SE,
        kind: elementTypesNames.sequenceActivation,
        width: 30,
        height: 100,
        minWidth: 30,
        minHeight: 50,
    },
    sequenceLoopOrAlt: {
        name: "Loop or Alt",
        type: entityType.SE,
        kind: elementTypesNames.sequenceLoopOrAlt,
        width: 750,
        height: 300,
        minWidth: 150,
        minHeight: 50,
        alternatives: ["alternative1"],
    },
    note: {
        name: "Note",
        type: entityType.note,
        kind: elementTypesNames.note,
        width: 200,
        height: 50,
        minWidth: 150,
        minHeight: 50,
        attributes: ['Note'],
    },
    Ghost: {
        name: "Ghost",
        type: entityType.ER,
        kind: elementTypesNames.ERAttr,
        width: 5,
        height: 5,
    },
};

const defaultLine = {kind: "Normal"};
