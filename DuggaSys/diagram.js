// =============================================================================================
//#region ================================ CLASSES              ================================
/** 
 * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector. */
class Point {
    x = 0;
    y = 0;

    /**
     * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector. 
     * @param {number} startX
     * @param {number} startY 
     */
    constructor(startX = 0, startY = 0)
    {
        this.x = startX;
        this.y = startY;
    }

    /** 
     * @description Adds x and y of another point to this point.
     * @param {Point} other Point that should be appended to this. */
    add(other)
    {
        this.x += other.x;
        this.y += other.y;
    }
};

/** 
 * @description Represents a change stored in the StateMachine. StateChange contains a list of StateChange.ChangeTypes in the local property stateChanges, that in turn contains a flag to describe each change. The getFlags() can be used to get the sum of all these stateChanges. 
 */
class StateChange {
    /**
     * @description ChangeType containing all information about a certain change. Several instances of ChangeType can exist inside a StateChange.
     * @member flag A number represented in 2nd base. This allows several flags to be merged through bit operators.
     * @member isSoft Boolean deciding if this change is considered a hard/soft change. Hard changes will not try to merge with previous change.
     * @member canAppendTo Boolean deciding if a soft change is allowd to merge into this change.
     */
    static ChangeTypes = {
        ELEMENT_CREATED:            { flag: 1, isSoft: false, canAppendTo: true },
        ELEMENT_DELETED:            { flag: 2, isSoft: false, canAppendTo: false },
        ELEMENT_MOVED:              { flag: 4, isSoft: true, canAppendTo: true },
        ELEMENT_RESIZED:            { flag: 8, isSoft: true, canAppendTo: true },
        ELEMENT_ATTRIBUTE_CHANGED:  { flag: 16, isSoft: true, canAppendTo: true },
        LINE_CREATED:               { flag: 32, isSoft: false, canAppendTo: true },
        LINE_DELETED:               { flag: 64, isSoft: false, canAppendTo: false },

        // Combined flags
        ELEMENT_MOVED_AND_RESIZED:  { flag: 4|8, isSoft: true, canAppendTo: true },
        ELEMENT_AND_LINE_DELETED:   { flag: 2|64, isSoft: false, canAppendTo: false },
        ELEMENT_AND_LINE_CREATED:   { flag: 1|32, isSoft: false, canAppendTo: false },
    };

    /**
     * @description Object containing values this StateChange contains. StateChangeFactory will map passed arguments as properties in this object to the values.
     */
    valuesPassed;

    /**
     * @description Creates a new StateChange instance.
     * @param {ChangeTypes} changeType What kind of change this is, see {StateChange.ChangeTypes} for available values.
     * @param {Array<String>} id_list Array of all elements affected by this state change. This is used for merging changes on the same elements.
     * @param {Object} passed_values Map of all values that this change contains. Each property represents a change.
     */
    constructor(changeType, id_list, passed_values = {})
    {
        this.changeTypes = [changeType];
        this.timestamp = new Date().getTime();
        this.valuesPassed = passed_values;
        this.id_list = id_list;
    }

    /** 
     * @description Calculates and returns the bit-or of all flags in this state change.
     * @returns {Number}
     */
    getFlags()
    {
        var flags = 0;

        for (var index = 0; index <  this.changeTypes.length; index++) {
            var change = this.changeTypes[index];

            // Perform bit-or operation
            flags = flags | change.flag;
        }

        return flags;
    }

    /**
     * @description Tests if this state change contains a certain flag.
     * @param {Number} flag Flag that is tested.
     * @returns {Boolean} Boolean value depending on this state change containing the tested flag.
     */
    hasFlag(flag)
    {
        var allFlags = this.getFlags();
        var AND = flag & allFlags;

        return (AND === flag);
    }

    /**
     * @description Writes all properties of parameter to valuesPassed. This does NOT append values, but REPLACES them!
     * @param {Object} value_object Object containting properties that should be written onto valuesPassed.
     */
    setValues(value_object)
    {
        if (value_object) {
            var props = Object.getOwnPropertyNames(value_object);

            for (var index = 0; index < props.length; index++) {
                var propertyName = props[index];
                this.valuesPassed[propertyName] = value_object[propertyName];
            }
        }
    }

    /**
     * @description Appends all property values onto the valuesPassed object. Logic for each specific property is different, some overwrite and some replaces.
     * @param {StateChange} changes Another state change that will have its values copied over to this state change. Flags will also be merged.
     */
    appendValuesFrom(changes)
    {
        if (changes.timestamp < this.timestamp) {
            this.timestamp = changes.timestamp;
        }
        
        // Go through all changes in the StateChange.
        for(var index = 0; index < changes.changeTypes.length; index++) {
            var change = changes.changeTypes[index]

            if (!this.changeTypes.includes(change)) {
                this.changeTypes.push(change);
            }

            var props = Object.getOwnPropertyNames(changes.valuesPassed);
            var values = changes.valuesPassed;
         
            // Go through each property in this change.
            for (var index = 0; index < props.length; index++) {
                var propertyName = props[index];
            
                // Perform logic depending on which property it is.
                switch(propertyName){
                    case "elementName": 
                        this.valuesPassed[propertyName] = values[propertyName]
                        break;
                    // Uses point-class, and can be appended.
                    case "movedElements":
                    case "resizedElements":
                        if(propertyName in this.valuesPassed) {
                            this.valuesPassed[propertyName].add(values[propertyName]);
                        } else {
                            this.valuesPassed[propertyName] = values[propertyName];
                        }
                        break;
                    default:
                        console.error("Unknown passedValue in stateChange.appendValuesFrom", propertyName, changes);
                        break;
                }
            }
        }
    }
}

/**
 * @description Constructs state changes with appropriate values set for each situation. This factory will also map passed argument into correct properties in the valuesPassed object.
 */
class StateChangeFactory
{
    /**
     * @param {Object} element The new element that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementCreated(element)
    {
        var values = {
            elementName: element.name,
            movedElements: new Point(element.x, element.y),
            resizedElements: new Point(element.width, element.height)
        }
        return new StateChange(StateChange.ChangeTypes.ELEMENT_CREATED, [element.id], values);
    }

    /**
     * @param {Object} elements The elements that has been/are going to be deleted.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsDeleted(elements)
    {
        var ids = [];
        elements.forEach(element => {
            ids.push(element.id);
        });

        var values = {
            deletedElements: elements
        };

        return new StateChange(StateChange.ChangeTypes.ELEMENT_DELETED, ids, values);
    }

    /**
     * @param {List<String>} elementIDs List of IDs for all elements that were moved.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsMoved(elementIDs, moveX, moveY)
    {
        var values = {
            movedElements: new Point(moveX, moveY)
        };
        return new StateChange(StateChange.ChangeTypes.ELEMENT_MOVED, elementIDs, values);
    }

    /**
     * @param {List<String>} elementIDs List of IDs for all elements that were resized.
     * @param {Number} changeX Amount of coordinates along the x-axis the elements have resized.
     * @param {Number} changeY Amount of coordinates along the y-axis the elements have resized.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementResized(elementIDs, changeX, changeY)
    {
        var values = {
            resizedElements: new Point(changeX, changeY)
        };
        return new StateChange(StateChange.ChangeTypes.ELEMENT_RESIZED, elementIDs, values);
    }

    /**
     * @param {List<String>} elementIDs List of IDs for all elements that were moved and resized.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @param {Number} changeX Amount of coordinates along the x-axis the elements have resized.
     * @param {Number} changeY Amount of coordinates along the y-axis the elements have resized.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementMovedAndResized(elementIDs, moveX, moveY, changeX, changeY)
    {
        var values = {
            resizedElements: new Point(changeX, changeY),
            movedElements: new Point(moveX, moveY)
        };
        return new StateChange(StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED, elementIDs, values);
    }

    /**
     * @param {List<String>} elementID ID for element that has been changed.
     * @param {Object} changeList Object containing changed attributes for the element. Each property represents each attribute changed.
     * @returns {StateChange} A new instance of the StateChange class.
     */ 
    static ElementAttributesChanged(elementID, changeList)
    {       
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED, [elementID]);

        // TODO : Could this be deleted? "changeList.name" should be handled in StateChange instead.
        // Handle special values that should not be passed, but rather used instantly.
        if (changeList.name) {
            state.name = changeList.name;
            delete changeList.name;
        }

        state.setValues(changeList);
        return state;
    }

    /**
     * @param {Object} line New line that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LineAdded(line)
    {
        var passed_values = {
            fromElementID: line.fromID,
            toElementID: line.toID
        };

        return new StateChange(StateChange.ChangeTypes.LINE_CREATED, [line.id], passed_values);
    }

    /**
     * @param {Array<object>} lines List of all lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LinesRemoved(lines)
    {
        var lineIDs = [];

        for (var index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }

        var passed_values = {
            deletedLines: lines
        };

        return new StateChange(StateChange.ChangeTypes.LINE_DELETED, lineIDs, passed_values);
    }

    /**
     * @param {Array<object>} elements All elements that have been / are going to be removed.
     * @param {Array<object>} lines All lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesDeleted(elements, lines)
    {
        var allIDs = [];

        // Add all element IDs to the id-list
        for (var index = 0; index < elements.lenght; index++) {
            allIDs.push(elements[index].id);
        }

        // Add all line IDs to the id-list
        for (var index = 0; index < lines.lenght; index++) {
            allIDs.push(lines[index].id);
        }

        var passed_values = {
            deletedElements: elements,
            deletedLines: lines
        };
        
        return new StateChange(StateChange.ChangeTypes.ELEMENT_AND_LINE_DELETED, allIDs, passed_values);
    }

    /**
     * @param {Array<object>} elements All elements that have been created.
     * @param {Array<object>} lines All lines that have been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesCreated(elements, lines)
    {
        var allIDs = [];

        // Add all element IDs to the id-list
        for (var index = 0; index < elements.lenght; index++) {
            allIDs.push(elements[index].id);
        }

        // Add all line IDs to the id-list
        for (var index = 0; index < lines.lenght; index++) {
            allIDs.push(lines[index].id);
        }

        var passed_values = {
            createdElements: elements,
            createdLines: lines
        };

        return new StateChange(StateChange.ChangeTypes.ELEMENT_AND_LINE_CREATED, allIDs, passed_values);
    }
}

/**
 * @description Handles storage and retrieval of usage history allowing undoing and redoing changes. Internal data should ONLY be modified through class methods to prevent weird behaviour.
 */
class StateMachine
{
    /**
     * @description Instanciate a new StateMachine. Constructor arguments will determine the "initial state", only changes AFTER this will be logged.
     * @param {Array<Object>} initialElements All elements that should be stored in the initial state.
     * @param {*} initialLines All lines that should be stored in the initial state.
     */
    constructor (initialElements, initialLines)
    {
        /**
         * @type Array<StateChange>
         */
        this.historyLog = [];

        /**
         * @type Array<StateChange>
         */
        this.futureLog = [];

        /**
         * Our initial data values
         */
        this.initialState = {
            elements: Array.from(initialElements),
            lines: Array.from(initialLines)
        }
    }

    /**
     * @description Stores the passed state change into the state machine. If the change is hard it will be pushed onto the history log. A soft change will modify the previously stored state IF that state allows it. The soft state will otherwise be pushed into the history log instead. StateChanges REQUIRE flags to be identified by the stepBack and stepForward methods!
     * @param {StateChange} stateChange All changes to be logged.
     * @see StateChangeFactory For constructing new state changes more easily.
     * @see StateChange For available flags.
     */
    save (stateChange)
    {
        if (stateChange instanceof StateChange) {
          
            // If history is present, perform soft/hard-check
            if (this.historyLog.length > 0) {
                /** @type StateChange */
                var lastLog = this.historyLog[this.historyLog.length - 1];
                
                var sameElements = true;
                for (var index = 0; index < lastLog.id_list.length && sameElements; index++) {
                    var id_found = lastLog.id_list[index];

                    if (!stateChange.id_list.includes(id_found)) {
                        sameElements = false;
                    }
                }

                var isSoft = true;
                for (var index = 0; index < stateChange.changeTypes.length && isSoft; index++) {
                    isSoft = stateChange.changeTypes[index].isSoft;
                }

                var canAppendToLast = true;
                for (var index = 0; index < lastLog.changeTypes.length && isSoft; index++) {
                    canAppendToLast = lastLog.changeTypes[index].canAppendTo;
                }

                // If NOT soft change, push new change onto history log
                if (!isSoft || !canAppendToLast || !sameElements) {

                    this.historyLog.push(stateChange);

                } else { // Otherwise, simply modify the last entry.

                    for (var index = 0; index < stateChange.changeTypes.length; index++) {

                        var changeType = stateChange.changeTypes[index];
                        
                        switch (changeType) {
                            case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                            case StateChange.ChangeTypes.ELEMENT_MOVED:
                            case StateChange.ChangeTypes.ELEMENT_RESIZED:
                            case StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED:
                                lastLog.appendValuesFrom(stateChange);
                                break;

                            default:
                                console.error(`Missing implementation for soft state change: ${stateChange}!`);
                                break;
                        };
                    }
                }
            } else {
                this.historyLog.push(stateChange);
            }
        } else {
            console.error("Passed invalid argument to StateMachine.save() method. Must be a StateChange object!");
        }
    }

    /**
     * @description Undoes the last stored history log changes. Determines what should be looked for by reading the state change flags.
     * @see StateChange For available flags.
     */
    stepBack () 
    {
        if (this.historyLog.length > 0) {

            var lastChange = this.historyLog.pop();

            // ------ Test each flag and step back per flag options ------

            // Attribute Changed
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED.flag)) {
                if (lastChange.elementName) {

                    var element = data[findIndex(data, lastChange.id_list[0])];
 
                    if (element) {
                        element.name = "MISSING_VARIABLE"; // TODO : State machine does NOT store old name value.
                        console.warn("State machine doesn't store old names right now. Cannot restore previous name.");
                    }
                }
            }

            // Element moved
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_MOVED.flag)) {

                for (var index = 0; index < lastChange.id_list.length; index++) {

                    var element = data[findIndex(data, lastChange.id_list[index])];

                    if (element) {
                        element.x -= lastChange.valuesPassed.movedElements.x;
                        element.y -= lastChange.valuesPassed.movedElements.y;
                    }
                }
            }

            // Element resized
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_RESIZED.flag)) {

                var element = data[findIndex(data, lastChange.id_list[0])];

                if (element) {
                    element.width -= lastChange.valuesPassed.resizedElements.x;
                    element.height -= lastChange.valuesPassed.resizedElements.y;
                }
            }

            // Element created
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_CREATED.flag)) {
                if (lastChange.valuesPassed.createdElements){
                    removeElements(lastChange.valuesPassed.createdElements, false);
                }else {
                    var element = data[findIndex(data, lastChange.id_list[0])];

                    if (element) {
                        removeElements([element], false);
                    }
                }
            }

            // Element destroyed
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_DELETED.flag)) {

                data = Array.prototype.concat(data, lastChange.valuesPassed.deletedElements);
            }

            // Line created
            if (lastChange.hasFlag(StateChange.ChangeTypes.LINE_CREATED.flag)) {
                if (!lastChange.valuesPassed.createdLines){

                    var line = lines[findIndex(lines, lastChange.id_list[0])];

                    if (line) {
                        removeLines([line], false);
                    }
                }
            }

            // Line destroyed
            if (lastChange.hasFlag(StateChange.ChangeTypes.LINE_DELETED.flag)) {
                lines = Array.prototype.concat(lines, lastChange.valuesPassed.deletedLines);
            }
        } else  { // No more history, restoring intial state
            data = Array.from(this.initialState.elements);
            lines = Array.from(this.initialState.lines);
        }

        showdata();
        updatepos(0, 0);
    }
};
//#endregion ===================================================================================
//#region ================================ ENUMS                ================================
/**
 * @description Keybinds that are used in the system. This is used to generate tooltips and for determining keyboard input logic.
 */
const keybinds = {
        LEFT_CONTROL: {key: "control", ctrl: true},
        ALT: {key: "alt", ctrl: false},
        META: {key: "meta", ctrl: false},
        HISTORY_STEPBACK: {key: "z", ctrl: true},
        DELETE: {key: "delete", ctrl: false},
        ESCAPE: {key: "escape", ctrl: false},
        BOX_SELECTION: {key: "2", ctrl: false},
        POINTER: {key: "1", ctrl: false},
        EDGE_CREATION: {key: "6", ctrl: false},
        PLACE_ENTITY: {key: "3", ctrl: false},
        PLACE_RELATION: {key: "4", ctrl: false},
        PLACE_ATTRIBUTE: {key: "5", ctrl: false},
        ZOOM_IN: {key: "+", ctrl: true},
        ZOOM_OUT: {key: "-", ctrl: true},
        TOGGLE_GRID: {key: "g", ctrl: false},
        TOGGLE_RULER: {key: "t", ctrl: false},
        TOGGLE_SNAPGRID: {key: "s", ctrl: false},
        OPTIONS: {key: "o", ctrl: false},
        ENTER: {key: "enter", ctrl: false},
        COPY: {key: "c", ctrl: true},
        PASTE: {key: "v", ctrl: true},
        SELECT_ALL: {key: "a", ctrl: true},
        DELETE_B: {key: "backspace", ctrl: false}
};

/** 
 * @description Represents the current input mode the end user is currently in. */
const mouseModes = {
    POINTER: 0,
    BOX_SELECTION: 1,
    PLACING_ELEMENT: 2,
    EDGE_CREATION: 3,
};

/** 
 * @description All different types of elements that can be constructed.
 * @see constructElementOfType() For creating elements out dof this enum.
 */
const elementTypes = {
    ENTITY: 0,
    RELATION: 1,
    ATTRIBUTE: 2,
    GHOSTENTITY: 3
};

/**
 * @description Used by the mup and mmoving functions to determine what was clicked in ddown/mdown.
 * @see ddown For mouse down on top of elements.
 */
const pointerStates = {
    DEFAULT: 0,
    CLICKED_CONTAINER: 1,
    CLICKED_ELEMENT: 2,
    CLICKED_NODE: 3,
    CLICKED_LINE: 4,
};

/**
 * @description Used by the user feedback popup messages to indicate different messages.
 * @see displayMessage() For showing popup messages.
 */
const messageTypes = {
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
};

/**
 * @description Available types of the attribute element. This will alter how the attribute is drawn onto the screen.
 */
const attrState = {
    NORMAL: "normal",
    WEAK: "weakKey",
    MULTIPLE: "multiple",
    KEY: "key",
    COMPUTED: "computed",
};

/**
 * @description Available types of the entity element. This will alter how the entity is drawn onto the screen.
 */
const entityState = {
    NORMAL: "normal",
    WEAK: "weak",

};

/**
 * @description Available types of the relation element. This will alter how the relation is drawn onto the screen.
 */
const relationState = {
    NORMAL: "normal",
    WEAK: "weak",
};

/**
 * @description Available types of lines to draw between different elements.
 */
const lineKind = {
    NORMAL: "Normal",
    DOUBLE: "Double"
};

/**
 * @description Available options of strings to display next to lines connecting two elements.
 */
const lineCardinalitys = {
    MANY: "N",
    ONE: "1"
};
//#endregion ===================================================================================
//#region ================================ GLOBAL VARIABLES     ================================
// Data and html building variables
var service = [];
var str = "";
var defs = "";
var container;

// Interaction variables - unknown if all are needed
var deltaX = 0, deltaY = 0, startX, startY;
var startTop, startLeft;
var sscrollx, sscrolly;
var cwidth, cheight;
var hasRecursion = false;
var startWidth;
var startNodeRight = false;
var cursorStyle;
var lastMousePos = getPoint(0,0);
var dblPreviousTime = new Date().getTime(); ; // Used when determining if an element was doubleclicked.
var dblClickInterval = 500; // 500 ms = if less than 500 ms between clicks -> Doubleclick was performed.
var wasDblClicked = false;
var targetDelta;

// Zoom variables
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;
var zoomOrigo = new Point(0, 0); // Zoom center coordinates relative to origo
var camera = new Point(0, 0); // Relative to coordinate system origo

// Constants
const elementwidth = 200;
const elementheight = 50;
const textheight = 18;
const strokewidth = 1.5;
const baseline = 10;
const avgcharwidth = 6;
const colors = ["white", "Gold", "#ffccdc", "yellow", "CornflowerBlue"];
const multioffs = 3;
// Zoom values for offsetting the mouse cursor positioning
const zoom1_25 = 0.36;
const zoom1_5 = 0.555;
const zoom2 = 0.75;
const zoom4 = 0.9375;
const zoom0_75 = -0.775;
const zoom0_5 = -3;
const zoom0_25 = -15.01;
const zoom0_125 = -64;
const zoomPower = 1 / 3;

// Arrow drawing stuff - diagram elements and diagram lines
var lines = [];
var elements = [];

// Currently clicked object list
var context = [];
var previousContext = [];
var contextLine = []; // Contains the currently selected line(s).
var determinedLines = null; //Last calculated line(s) clicked.
var deltaExceeded = false;
var targetElement = null;
var targetElementDiv;

const maxDeltaBeforeExceeded = 2;

// Clipboard
var clipboard = [];

// Currently hold down buttons
var ctrlPressed = false;
var altPressed = false;
var escPressed = false;

// Box selection variables
var boxSelectionInUse = false;
var propFieldState = false;

// What kind of input mode that user is uing the cursor for.

var mouseMode = mouseModes.POINTER;
var previousMouseMode;

// All different element types that can be placed by the user.

var elementTypeSelected = elementTypes.ENTITY;
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;
var isRulerActive = true;

//Grid Settings
const gridSize = 50;
const origoWidth = 2;
var snapToGrid = false;
var randomidArray = []; // array for checking randomID
var errorMsgMap = {};

// Demo data - read / write from service later on
var data = [];
var lines = [];

// Ghost element is used for placing new elements. DO NOT PLACE GHOST ELEMENTS IN DATA ARRAY UNTILL IT IS PRESSED!
var ghostElement = null;
var ghostLine = null;
//#endregion ===================================================================================
//#region ================================ DEFAULTS             ================================
/**
 * @description All default values for element types. These will be applied to new elements created via the construction function ONLY.
 * @see constructElementOfType() For creating new elements with default values.
 */
var defaults = {
    defaultERtentity: { kind: "EREntity", fill: "White", Stroke: "Black", width: 200, height: 50 },
    defaultERrelation: { kind: "ERRelation", fill: "White", Stroke: "Black", width: 60, height: 60 },
    defaultERattr: { kind: "ERAttr", fill: "White", Stroke: "Black", width: 90, height: 45 },
    defaultGhost: { kind: "ERAttr", fill: "White", Stroke: "Black", width: 5, height: 5 }
}
//#endregion ===================================================================================
//#region ================================ INIT AND SETUP       ================================
/**
 * @description Called from getData() when the window is loaded. This will initialize all neccessary data and create elements, setup the state machine and vise versa.
 * @see getData() For the VERY FIRST function called in the file.
 */
function onSetup()
{
    const EMPLOYEE_ID = makeRandomID();
    const Bdale_ID = makeRandomID();
    const BdaleDependent_ID = makeRandomID();
    const Name_ID = makeRandomID();
    const NameDependent_ID = makeRandomID();
    const NameProject_ID = makeRandomID();
    const FNID = makeRandomID();
    const Initial_ID = makeRandomID();
    const LNID = makeRandomID();
    const Ssn_ID = makeRandomID();
    const Address_ID = makeRandomID();
    const Salary_ID = makeRandomID();
    const SUPERVISION_ID = makeRandomID();
    const DEPENDENTS_OF_ID = makeRandomID();
    const DEPENDENT_ID = makeRandomID();
    const Number_of_depends_ID = makeRandomID();
    const AddressDependent_ID = makeRandomID();
    const Relationship_ID = makeRandomID();
    const WORKS_ON_ID = makeRandomID();
    const Hours_ID = makeRandomID();
    const PROJECT_ID = makeRandomID();
    const NumberProject_ID = makeRandomID();
    const Location_ID = makeRandomID();
    const MANAGES_ID = makeRandomID();
    const Start_date_ID = makeRandomID();
    const CONTROLS_ID = makeRandomID();
    const WORKS_FOR_ID = makeRandomID();
    const Locations_ID = makeRandomID();
    const DEPARTMENT_ID = makeRandomID();
    const NameDEPARTMENT_ID = makeRandomID();
    const NumberDEPARTMENT_ID = makeRandomID();
    const Number_of_employees_ID = makeRandomID();

    const demoData = [
        { name: "EMPLOYEE", x: 100, y: 200, width: 200, height: 50, kind: "EREntity", id: EMPLOYEE_ID, isLocked: false },
        { name: "Bdale", x: 30, y: 30, width: 90, height: 45, kind: "ERAttr", id: Bdale_ID, isLocked: false, state: "Normal" },
        { name: "Bdale", x: 360, y: 700, width: 90, height: 45, kind: "ERAttr", id: BdaleDependent_ID, isLocked: false, state: "Normal" },
        { name: "Ssn", x: 20, y: 100, width: 90, height: 45, kind: "ERAttr", id: Ssn_ID, isLocked: false, state: "key"},
        { name: "Name", x: 200, y: 50, width: 90, height: 45, kind: "ERAttr", id: Name_ID, isLocked: false },
        { name: "Name", x: 180, y: 700, width: 90, height: 45, kind: "ERAttr", id: NameDependent_ID, isLocked: false, state: "key"},
        { name: "Name", x: 920, y: 600, width: 90, height: 45, kind: "ERAttr", id: NameProject_ID, isLocked: false, state: "key"},
        { name: "Name", x: 980, y: 70, width: 90, height: 45, kind: "ERAttr", id: NameDEPARTMENT_ID, isLocked: false, state: "key"},
        { name: "Address", x: 300, y: 50, width: 90, height: 45, kind: "ERAttr", id: Address_ID, isLocked: false },
        { name: "Address", x: 270, y: 700, width: 90, height: 45, kind: "ERAttr", id: AddressDependent_ID, isLocked: false },
        { name: "Relationship", x: 450, y: 700, width: 120, height: 45, kind: "ERAttr", id: Relationship_ID, isLocked: false },
        { name: "Salary", x: 400, y: 50, width: 90, height: 45, kind: "ERAttr", id: Salary_ID, isLocked: false },
        { name: "F Name", x: 100, y: -20, width: 90, height: 45, kind: "ERAttr", id: FNID, isLocked: false },
        { name: "Initial", x: 200, y: -20, width: 90, height: 45, kind: "ERAttr", id: Initial_ID, isLocked: false },
        { name: "L Name", x: 300, y: -20, width: 90, height: 45, kind: "ERAttr", id: LNID, isLocked: false },
        { name: "SUPERVISIONS", x: 100, y: 400, width: 180, height: 120, kind: "ERRelation", id: SUPERVISION_ID, isLocked: false },
        { name: "DEPENDENTS_OF", x: 270, y: 450, width: 180, height: 120, kind: "ERRelation", id: DEPENDENTS_OF_ID, isLocked: false, state: "weak"},
        { name: "DEPENDENT", x: 265, y: 600, width: 200, height: 50, kind: "EREntity", id: DEPENDENT_ID, isLocked: false, state: "weak"},
        { name: "Number_of_depends", x: 0, y: 600, width: 180, height: 45, kind: "ERAttr", id: Number_of_depends_ID, isLocked: false, state: "computed"},
        { name: "WORKS_ON", x: 600, y: 470, width: 180, height: 120, kind: "ERRelation", id: WORKS_ON_ID, isLocked: false },
        { name: "Hours", x: 750, y: 420, width: 90, height: 45, kind: "ERAttr", id: Hours_ID, isLocked: false },
        { name: "PROJECT", x: 1000, y: 500, width: 200, height: 50, kind: "EREntity", id: PROJECT_ID, isLocked: false },
        { name: "Number", x: 950, y: 650, width: 120, height: 45, kind: "ERAttr", id: NumberProject_ID, isLocked: false, state: "key"},
        { name: "Location", x: 1060, y: 610, width: 90, height: 45, kind: "ERAttr", id: Location_ID, isLocked: false},
        { name: "MANAGES", x: 600, y: 300, width: 180, height: 120, kind: "ERRelation", id: MANAGES_ID, isLocked: false },
        { name: "Start date", x: 510, y: 220, width: 100, height: 45, kind: "ERAttr", id: Start_date_ID, isLocked: false },
        { name: "CONTROLS", x: 1010, y: 300, width: 180, height: 120, kind: "ERRelation", id: CONTROLS_ID, isLocked: false },
        { name: "DEPARTMENT", x: 1000, y: 200, width: 200, height: 50, kind: "EREntity", id: DEPARTMENT_ID, isLocked: false },
        { name: "Locations", x: 1040, y: 20, width: 120, height: 45, kind: "ERAttr", id: Locations_ID, isLocked: false, state: "multiple" },
        { name: "WORKS_FOR", x: 550, y: 60, width: 180, height: 120, kind: "ERRelation", id: WORKS_FOR_ID, isLocked: false },
        { name: "Number", x: 1130, y: 70, width: 90, height: 45, kind: "ERAttr", id: NumberDEPARTMENT_ID, isLocked: false, state: "key"},
        { name: "Number_of_employees", x: 750, y: 200, width: 200, height: 45, kind: "ERAttr", id: Number_of_employees_ID, isLocked: false, state: "computed"},
    ];
    
    const demoLines = [
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: Bdale_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: Ssn_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: Name_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: Address_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: Salary_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: SUPERVISION_ID, kind: "Normal", cardinality: "MANY" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: SUPERVISION_ID, kind: "Normal", cardinality: "ONE"},
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: DEPENDENTS_OF_ID, kind: "Normal", cardinality: "ONE" },
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: MANAGES_ID, kind: "Normal", cardinality: "ONE"},
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: WORKS_FOR_ID, kind: "Double", cardinality: "MANY" },

        { id: makeRandomID(), fromID: Name_ID, toID: FNID, kind: "Normal" },
        { id: makeRandomID(), fromID: Name_ID, toID: Initial_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: Name_ID, toID: LNID, kind: "Normal" },
     
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: DEPENDENTS_OF_ID, kind: "Double", cardinality: "MANY" },
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: Number_of_depends_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: NameDependent_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: AddressDependent_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: BdaleDependent_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: DEPENDENT_ID, toID: Relationship_ID, kind: "Normal"},

        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: WORKS_ON_ID, kind: "Double", cardinality: "MANY" },
        { id: makeRandomID(), fromID: Hours_ID, toID: WORKS_ON_ID, kind: "Normal"},

        { id: makeRandomID(), fromID: WORKS_ON_ID, toID: PROJECT_ID, kind: "Double", cardinality: "MANY"},
        { id: makeRandomID(), fromID: NameProject_ID, toID: PROJECT_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: NumberProject_ID, toID: PROJECT_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: Location_ID, toID: PROJECT_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: CONTROLS_ID, toID: PROJECT_ID, kind: "Normal",cardinality: "MANY"},
        
        { id: makeRandomID(), fromID: MANAGES_ID, toID: Start_date_ID, kind: "Normal"},

        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: Locations_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: CONTROLS_ID, kind: "Normal", cardinality: "ONE" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: NameDEPARTMENT_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: NumberDEPARTMENT_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: MANAGES_ID, kind: "Double", cardinality: "ONE" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: Number_of_employees_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: WORKS_FOR_ID, toID: DEPARTMENT_ID, kind: "Double", cardinality: "ONE" },
    ];

    for(var i = 0; i < demoData.length; i++){
        addObjectToData(demoData[i], false);
    }
    for(var i = 0; i < demoLines.length; i++){
        addObjectToLines(demoLines[i], false);
    }

    // Global statemachine init
    stateMachine = new StateMachine(data, lines);
}

/**
 * @description Very first function that is called when the window is loaded. This will perform initial setup and then call the drawing functions to generate the first frame on the screen.
 */
function getData()
{
    container = document.getElementById("container");
    onSetup();
    showdata();
    drawRulerBars(scrollx,scrolly);
    generateToolTips();
    toggleGrid();
    updateGridPos();
    updateA4Pos();
    updateGridSize();
    setCursorStyles(mouseMode);
}

/**
 * @description Used to determine if returned data is correct.
 * @param {*} ret Returned data to determine.
 * @deprecated This function is no longer in use since the new drawing system of April 2021.
 */
// TODO : No references of this function throughout the entire codebase. Should be deleted?
function data_returned(ret)
{
    if (typeof ret.data !== "undefined") {
        service = ret;
        showdata();
    } else {
        alert("Error receiveing data!");
    }
}
//#endregion ===================================================================================
//#region ================================ EVENTS               ================================
// --------------------------------------- Window Events    --------------------------------
document.addEventListener('keydown', function (e)
{
    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        
        if (isKeybindValid(e, keybinds.LEFT_CONTROL) && ctrlPressed !== true) ctrlPressed = true;
        if (isKeybindValid(e, keybinds.ALT) && altPressed !== true) altPressed = true;
        if (isKeybindValid(e, keybinds.META) && ctrlPressed !== true) ctrlPressed = true;
        if (isKeybindValid(e, keybinds.ESCAPE) && escPressed != true) {
            escPressed = true;
            if(context.length > 0 || contextLine.length > 0) {
                clearContext();
                clearContextLine();
            } else {
                ghostElement = null;
                setMouseMode(mouseModes.POINTER);
            }
            if (movingContainer) {
                scrollx = sscrollx;
                scrolly = sscrolly;
            }
            ghostLine = null;
            pointerState = pointerStates.DEFAULT;
            showdata();
        }

        if (isKeybindValid(e, keybinds.ZOOM_IN)){
            e.preventDefault();
            zoomin();
        } 
        if (isKeybindValid(e, keybinds.ZOOM_OUT)){
            e.preventDefault();
            zoomout();
        } 

        if (isKeybindValid(e, keybinds.SELECT_ALL)){
            e.preventDefault();
            selectAll();
        }      

    } else { 
        if (isKeybindValid(e, keybinds.ENTER)) { 
            var propField = document.getElementById("elementProperty_name");
            changeState(); 
            saveProperties(); 
            propField.blur();
            displayMessage(messageTypes.SUCCESS, "Sucessfully saved");
        }
    }
});

document.addEventListener('keyup', function (e)
{
    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        
        var pressedKey = e.key.toLowerCase();

        //  TODO : Switch cases?
        if (pressedKey == keybinds.LEFT_CONTROL.key) ctrlPressed = false;
        if (pressedKey == keybinds.ALT.key) altPressed = false;
        if (pressedKey == keybinds.META.key) ctrlPressed = false;

        if (isKeybindValid(e, keybinds.HISTORY_STEPBACK)) stateMachine.stepBack();
        if (isKeybindValid(e, keybinds.ESCAPE)) escPressed = false;
        if (isKeybindValid(e, keybinds.DELETE) || isKeybindValid(e, keybinds.DELETE_B)) {
            if (contextLine.length > 0) removeLines(contextLine);
            if (context.length > 0) removeElements(context);

            updateSelection();
        }
        
        if(isKeybindValid(e, keybinds.POINTER)) setMouseMode(mouseModes.POINTER);
        if(isKeybindValid(e, keybinds.BOX_SELECTION)) setMouseMode(mouseModes.BOX_SELECTION);
        
        if(isKeybindValid(e, keybinds.EDGE_CREATION)){
            setMouseMode(mouseModes.EDGE_CREATION);
            clearContext();
        }

        if(isKeybindValid(e, keybinds.PLACE_ENTITY)){
            setElementPlacementType(elementTypes.ENTITY);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if(isKeybindValid(e, keybinds.PLACE_RELATION)){
            setElementPlacementType(elementTypes.RELATION);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if(isKeybindValid(e, keybinds.PLACE_ATTRIBUTE)){
            setElementPlacementType(elementTypes.ATTRIBUTE);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if(isKeybindValid(e, keybinds.TOGGLE_GRID)) toggleGrid();
        if(isKeybindValid(e, keybinds.TOGGLE_RULER)) toggleRuler();
        if(isKeybindValid(e, keybinds.TOGGLE_SNAPGRID)) toggleSnapToGrid();
        if(isKeybindValid(e, keybinds.OPTIONS)) fab_action();
        if(isKeybindValid(e, keybinds.PASTE)) pasteClipboard(clipboard)
        
        if (isKeybindValid(e, keybinds.COPY)){
            clipboard = context;
            if (clipboard.length !== 0){
                displayMessage(messageTypes.SUCCESS, `You have copied ${clipboard.length} elements and its inner connected lines.`)
            }else {
                displayMessage(messageTypes.SUCCESS, `Clipboard cleared.`)
            }
        }
    }
});

window.addEventListener("resize", () => {
    updateContainerBounds();
    drawRulerBars(scrollx,scrolly);
});

window.onfocus = function()
{
    altPressed=false;
    ctrlPressed=false;
}

// --------------------------------------- Mouse Events    --------------------------------
/**
 * @description Event function triggered when the mousewheel reader has a value of grater or less than 0.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mwheel(event)
{
    event.preventDefault();
    if(event.deltaY < 0) {
        zoomin(event);
    } else {
        zoomout(event);
    }
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mdown(event)
{
    // If the middle mouse button (mouse3) is pressed set scroll start values
    if(event.button == 1) {
        pointerState = pointerStates.CLICKED_CONTAINER;
        sscrollx = scrollx;
        sscrolly = scrolly;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
        return;
    }

    // React to mouse down on container
    if (event.target.id == "container") {
        switch (mouseMode) {
            case mouseModes.POINTER:
                pointerState = pointerStates.CLICKED_CONTAINER;
                sscrollx = scrollx;
                sscrolly = scrolly;
                startX = event.clientX;
                startY = event.clientY;
                break;
            
            case mouseModes.BOX_SELECTION:
                boxSelect_Start(event.clientX, event.clientY);  
                break;

            default:
                break;
        }
       
    } else if (event.target.classList.contains("node")) {
        pointerState = pointerStates.CLICKED_NODE;
        startWidth = data[findIndex(data, context[0].id)].width;

        startNodeRight = !event.target.classList.contains("mr");

        startX = event.clientX;
        startY = event.clientY;
    }

    // Check if not an element OR node has been clicked at the event
    if(pointerState !== pointerStates.CLICKED_NODE && pointerState !== pointerStates.CLICKED_ELEMENT){
        // Used when clicking on a line between two elements.
        determinedLines = determineLineSelect(event.clientX, event.clientY);
        if (determinedLines){
           pointerState=pointerStates.CLICKED_LINE;
        }
    }
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of any element.
 * @param {MouseEvent} event Triggered mouse event.
 */
function ddown(event)
{
    // Used when determining time between clicks.
    if((new Date().getTime() - dblPreviousTime) < dblClickInterval){

        wasDblClicked = true; // General purpose bool. True when doubleclick was performed.
        
        var element = data[findIndex(data, event.currentTarget.id)];
        if (element != null && context.length == 1 && context.includes(element) && contextLine.length == 0){
            event.preventDefault(); // Needed in order for focus() to work properly 
            var input = document.getElementById("elementProperty_name");
            input.focus();
            input.setSelectionRange(0,input.value.length); // Select the whole text.
            document.getElementById('optmarker').innerHTML = "&#x1f4a9;Options";
            document.getElementById("options-pane").className = "show-options-pane"; // Toggle optionspanel.
        }
    }   

    // If the middle mouse button (mouse3) is pressed => return
    if(event.button == 1) return;

    switch (mouseMode) {
        case mouseModes.POINTER:
        case mouseModes.BOX_SELECTION:
        case mouseModes.PLACING_ELEMENT:
            startX = event.clientX;
            startY = event.clientY;

            if (!altPressed) {
                pointerState = pointerStates.CLICKED_ELEMENT;
                targetElement = event.currentTarget;
                targetElementDiv = document.getElementById(targetElement.id);
            }

        case mouseModes.EDGE_CREATION:
            if(event.button == 2) return;
            var element = data[findIndex(data, event.currentTarget.id)];
            if (element != null && !context.includes(element) || !ctrlPressed){
                updateSelection(element);
            }
            break;
            
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in ddown()!`);
            break;
    }

    dblPreviousTime = new Date().getTime(); // Update dblClick-timer.
    wasDblClicked = false; // Reset the bool.
}

/**
 * @description Called on mouse up if no pointer state has blocked the input in the mup()-function.
 * @param {MouseEvent} event Triggered mouse event.
 * @see mup() For event triggering mouse down.
 */
function mouseMode_onMouseUp(event)
{
    switch (mouseMode) {
        case mouseModes.PLACING_ELEMENT:
            if (ghostElement) {
                addObjectToData(ghostElement);
                makeGhost();
                showdata();
            }
            break;

        case mouseModes.EDGE_CREATION:
            if (context.length > 1) {
                // TODO: Change the static variable to make it possible to create different lines.
                addLine(context[0], context[1], "Normal");
                clearContext();
                
                // Bust the ghosts
                ghostElement = null;
                ghostLine = null;

                showdata();
                updatepos(0,0);
            }else if (context.length === 1){
                if (event.target.id != "container"){   
                    elementTypeSelected = elementTypes.GHOSTENTITY;
                    makeGhost();
                    // Create ghost line
                    ghostLine = { id: makeRandomID(), fromID: context[0].id, toID: ghostElement.id, kind: "Normal" };
                }else{   
                    clearContext();
                    ghostElement = null;
                    ghostLine = null;
                    showdata();
                }
            }
            break;

        case mouseModes.BOX_SELECTION:
            boxSelect_End();
            generateContextProperties();
            break;

        case mouseModes.POINTER: // do nothing
            break;
    
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mouseMode_onMouseUp()!`);
            break;
    }
}

/**
 * @description Event function triggered when any mouse button is released on top of the container. Logic is handled depending on the current pointer state.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */
function mup(event)
{
    targetElement = null;
    deltaX = startX - event.clientX;
    deltaY = startY - event.clientY;

    switch (pointerState) {
        case pointerStates.DEFAULT: 
            mouseMode_onMouseUp(event);
        break;

        case pointerStates.CLICKED_CONTAINER:
            if (event.target.id == "container") {
                movingContainer = false;

                if (!deltaExceeded) {
                    if (mouseMode == mouseModes.EDGE_CREATION) {
                        clearContext();
                    } else if (mouseMode == mouseModes.POINTER) {
                        updateSelection(null);
                    }
                    if (!ctrlPressed) clearContextLine();
                }
            }
            break;

        case pointerStates.CLICKED_LINE:
            if(!deltaExceeded){
                updateSelectedLine(determinedLines);
            }
            if (mouseMode == mouseModes.BOX_SELECTION) {
                mouseMode_onMouseUp(event);
            }
            break;

        case pointerStates.CLICKED_ELEMENT:
            
            movingObject = false;
            // Special cases:
            if (mouseMode == mouseModes.EDGE_CREATION) {
                mouseMode_onMouseUp(event);

            // Normal mode
            } else if (deltaExceeded) {
                var id_list = [];

                if (context.length > 0) {
                    context.forEach(item => // Move all selected items
                    {
                        if(!item.isLocked){
                            eventElementId = event.target.parentElement.parentElement.id;
                            setPos(item.id, deltaX, deltaY);

                            if (deltaX > 0 || deltaX < 0 || deltaY > 0 || deltaY < 0)
                                id_list.push(item.id);
                        }
                    });
                }

                stateMachine.save(StateChangeFactory.ElementsMoved(id_list, -(deltaX / zoomfact), -(deltaY / zoomfact)));
            }
            break;
        case pointerStates.CLICKED_NODE:
            break;
    
        default: 
            console.error(`State ${mouseMode} missing implementation at switch-case in mup()!`);
            break;
    }

    // Update all element positions on the screen
    deltaX = 0;
    deltaY = 0;
    updatepos(0, 0);
    drawRulerBars(scrollx,scrolly);

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
}

/**
 * @description Calculates if any line is present on x/y position in pixels.
 * @param {Number} mouseX
 * @param {Number} mouseY
 */
function determineLineSelect(mouseX, mouseY)
{
    // This func is used when determining which line is clicked on.

    // TODO: Add functionality to make sure we are only getting LINES from svgbacklayer in the future !!!!!.
    
    var allLines = document.getElementById("svgbacklayer").children;
    var bLayerLineIDs = []; // Used to only store the IDs. Needed since we later need a value copy of the ID and not the ref.

    var cMouse_XY = {
        x: mouseX, 
        y: mouseY
    }; // Current mouse XY
    var currentline = {};
    var lineData = {};
    var lineCoeffs = {};
    var highestX, lowestX, highestY , lowestY;
    var lineWasHit = false; 

    // Position and radius of the circle hitbox that is used when 
    var circleHitBox = {
        pos_x: cMouse_XY.x, // Mouse pos X.
        pos_y: cMouse_XY.y, // Mouse pos Y.
        radius: 10 // This will determine the error margin, "how far away from the line we can click and still select it". Higer val = higher margin.
    }
    
    for(var i = 0; i < allLines.length; i++) {
        
        // Copy the IDs.
        bLayerLineIDs[i] = allLines[i].id;

        // Make sure that "double lines" have the same id.
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-1/gi, '');
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-2/gi, '');
  
        // Get all X and Y -coords for current line in iteration.
        currentline = {
            x1: allLines[i].getAttribute("x1"),
            x2: allLines[i].getAttribute("x2"),
            y1: allLines[i].getAttribute("y1"),
            y2: allLines[i].getAttribute("y2")
        };

        // Used later to make sure the current mouse-position is in the span of a line.
        highestX = Math.max(currentline.x1, currentline.x2);
        lowestX = Math.min(currentline.x1, currentline.x2);
        highestY = Math.max(currentline.y1, currentline.y2);
        lowestY = Math.min(currentline.y1, currentline.y2);
        lineData = {
            hX: highestX,
            lX: lowestX,
            hY: highestY,
            lY: lowestY
        }
        
        // Coefficients of the general equation of the current line.
        lineCoeffs = {
            a: (currentline.y1 - currentline.y2),
            b: (currentline.x2 - currentline.x1),
            c: ((currentline.x1 - currentline.x2)*currentline.y1 + (currentline.y2-currentline.y1)*currentline.x1)
        }
        
        // Determines if a line was clicked
        lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);
        
        // --- Used when debugging ---
        // Creates a circle with the same position and radius as the hitbox of the circle being sampled with.
        //document.getElementById("svgoverlay").innerHTML += '<circle cx="'+ circleHitBox.pos_x + '" cy="'+ circleHitBox.pos_y+ '" r="' + circleHitBox.radius + '" stroke="black" stroke-width="3" fill="red" /> '
        // ---------------------------

        if(lineWasHit == true) {
            // Return the current line that registered as a "hit".
            return lines.filter(function(line) {
                return line.id == bLayerLineIDs[i];
            })[0];
        }
    }
    return null;
}

/**
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if any line was clicked.
 */
function didClickLine(a, b, c, circle_x, circle_y, circle_radius, line_data)
{
    // Adding and subtracting with the circle radius to allow for bigger margin of error when clicking.
    // Check if we are clicking withing the span.
    if( (circle_x < (line_data.hX + circle_radius)) &&
     (circle_x > (line_data.lX - circle_radius)) && 
     (circle_y < (line_data.hY + circle_radius)) && 
     (circle_y > (line_data.lY - circle_radius))
    ) {
        // Distance between line and circle center.
        var distance = (Math.abs(a*circle_x + b*circle_y + c)) / Math.sqrt(a*a + b*b);
    
        // Check if circle radius >= distance. (If so is the case, the line is intersecting the circle)
        if(circle_radius >= distance) {
            return true;
        }
    } else {
        return false;
    }
}

/**
 * @description Called on mouse moving if no pointer state has blocked the event in mmoving()-function.
 */
function mouseMode_onMouseMove(event)
{
     switch (mouseMode) {
        case mouseModes.EDGE_CREATION:
        case mouseModes.PLACING_ELEMENT:
            if (ghostElement) {
                var cords = screenToDiagramCoordinates(event.clientX, event.clientY);

                // If not in EDGE_CREATION AND in snap to grid, calculate the closest snap-point
                if (snapToGrid && mouseMode != mouseModes.EDGE_CREATION){
                    ghostElement.x = Math.round(cords.x / gridSize) * gridSize - (ghostElement.width / 2);
                    ghostElement.y = Math.round(cords.y / gridSize) * gridSize - (ghostElement.height / 2);
                }else {
                    ghostElement.x = cords.x - (ghostElement.width / 2);
                    ghostElement.y = cords.y - (ghostElement.height / 2);
                }
                showdata();
                updatepos(0, 0);
            }
            break;

        case mouseModes.POINTER: // do nothing
            break;
            
        case mouseModes.BOX_SELECTION:
            boxSelect_Update(event.clientX, event.clientY);
            updatepos(0, 0);
            break;
            
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mouseMode_onMouseMove()!`);
            break;
    }
}

/**
 * @description Event function triggered when the mouse has moved on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mmoving(event)
{
    lastMousePos = getPoint(event.clientX, event.clientY);
    switch (pointerState) {
        case pointerStates.CLICKED_CONTAINER:
            // Compute new scroll position
            movingContainer = true;
            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;
            scrollx = sscrollx - Math.round(deltaX * zoomfact);
            scrolly = sscrolly - Math.round(deltaY * zoomfact);
            updateGridPos();
            updateA4Pos();
            // Update scroll position
            updatepos(null, null);

            // Update the ruler
            drawRulerBars(scrollx,scrolly);

            calculateDeltaExceeded();
            break;

        case pointerState.CLICKED_LINE:

            if(mouseMode == mouseModes.BOX_SELECTION){
                calculateDeltaExceeded();
                mouseMode_onMouseMove(mouseMode);
            }
            break;

        case pointerStates.CLICKED_ELEMENT:
            var prevTargetPos = {
                x: data[findIndex(data, targetElement.id)].x,
                y: data[findIndex(data, targetElement.id)].y
            }
            var targetPos = {
                x: 1 * targetElementDiv.style.left.substr(0, targetElementDiv.style.left.length - 2),
                y: 1 * targetElementDiv.style.top.substr(0, targetElementDiv.style.top.length - 2)
            };
            targetPos = screenToDiagramCoordinates(targetPos.x, targetPos.y);
            targetDelta = {
                x: (targetPos.x * zoomfact) - (prevTargetPos.x * zoomfact),
                y: (targetPos.y * zoomfact) - (prevTargetPos.y * zoomfact),
            }

            // Moving object
            movingObject = true;
            // Moving object
            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;

            // We update position of connected objects
            updatepos(deltaX, deltaY);

            calculateDeltaExceeded();
            break;

        case pointerStates.CLICKED_NODE:
            var index = findIndex(data, context[0].id);
            var elementData = data[index];
            
            const minWidth = 20; // Declare the minimal with of an object
            deltaX = startX - event.clientX;

            if (startNodeRight && (startWidth - (deltaX / zoomfact)) > minWidth) {
                // Fetch original width
                var tmp = elementData.width;
                elementData.width = (startWidth - (deltaX / zoomfact));

                // Remove the new width, giving us the total change
                const widthChange = -(tmp - elementData.width);
                
                // Right node will never change the position of the element. We pass 0 as x and y movement.
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], widthChange, 0));

            } else if (!startNodeRight && (startWidth + (deltaX / zoomfact)) > minWidth) {
                // Fetch original width
                var tmp = elementData.width;
                elementData.width = (startWidth + (deltaX / zoomfact));

                // Deduct the new width, giving us the total change
                const widthChange = -(tmp - elementData.width);

                // Fetch original x-position
                tmp = elementData.x;
                elementData.x = screenToDiagramCoordinates((startX - deltaX), 0).x;

                // Deduct the new position, giving us the total change
                const xChange = -(tmp - elementData.x);
                
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, 0, widthChange, 0));
            }

            document.getElementById(context[0].id).remove();
            document.getElementById("container").innerHTML += drawElement(data[index]);
            updatepos(null, null);
            break;

        default:
            mouseMode_onMouseMove(event);
            break;
    }

    //Sets the rules to current position on screen.
    setRulerPosition(event.clientX, event.clientY);
}

//#endregion ===================================================================================
//#region ================================ ELEMENT MANIPULATION ================================
/**
 * Generates a new hexadecimal ID that is not already stored to identify things in the program.
 * @returns {String} Hexadecimal number represented as a string.
 * @see randomidArray For an array of all generated IDs by this function.
 */
function makeRandomID()
{
    var str = "";
    var characters = 'ABCDEF0123456789';
    var charactersLength = characters.length;
    while(true) {
        for (var i = 0; i < 6; i++) {
            str += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        if (randomidArray === undefined || randomidArray.length == 0) { //always add first id
            randomidArray.push(str);
            return str;

        } else {
            var check = randomidArray.includes(str); //if check is true the id already exists
            if(check == true){
                str = "";
            } else {
                randomidArray.push(str);
                return str;
            }
        }
    }
}

/**
 * Searches an array for the specified item and returns its stored index in the array if found.
 * @param {Array} arr Array to search.
 * @param {*} id Item to determine index for.
 * @returns {Number} Index for the searched item OR -1 for a miss.
 */
function findIndex(arr, id)
{
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

/**
 * @description Adds an object to the data array of elements.
 * @param {Object} object Element to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToData(object, stateMachineShouldSave = true)
{
    data.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementCreated(object));
}

/**
 * @description Adds a line to the data array of lines.
 * @param {Object} object Line to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToLines(object, stateMachineShouldSave = true)
{
    lines.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.LineAdded(object));
}

/**
 * @description Attempts removing all elements passed through the elementArray argument. Passed argument will be sanitized to ensure it ONLY contains real elements that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.
 * @param {Array<Object>} elementArray List of all elements that should be deleted.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function removeElements(elementArray, stateMachineShouldSave = true)
{
    // Find all lines that should be deleted first
    var linesToRemove = [];
    var elementsToRemove = [];

    for (var i = 0; i < elementArray.length; i++) { // Find VALID items to remove
        linesToRemove = linesToRemove.concat(lines.filter(function(line) {
            return line.fromID == elementArray[i].id || line.toID == elementArray[i].id;
        }));
        elementsToRemove = elementsToRemove.concat(data.filter(function(element) {
            return element == elementArray[i];
        }));
    }

    if (elementsToRemove.length > 0) { // If there are elements to remove
        if (linesToRemove.length > 0) { // If there are also lines to remove
            removeLines(linesToRemove, false);
            if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementsAndLinesDeleted(elementsToRemove, linesToRemove));
        } else { // Only removed elements without any lines
            if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementsDeleted(elementsToRemove));
        }

        data = data.filter(function(element) { // Delete elements
            return !elementsToRemove.includes(element);
        });
    } else { // All passed items were INVALID
        console.error("Invalid element array passed to removeElements()!");
    }

    clearContext();
    redrawArrows();
    showdata();
}

/**
 * @description Attempts removing all lines passed through the linesArray argument. Passed argument will be sanitized to ensure it ONLY contains real lines that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.
 * @param {Array<Object>} linesArray List of all elements that should be deleted.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function removeLines(linesArray, stateMachineShouldSave = true)
{
    var anyRemoved = false;
    for (var i = 0; i < linesArray.length; i++) {
        lines = lines.filter(function(line) {
            var shouldRemove = (line != linesArray[i]);
            if (shouldRemove) {
                anyRemoved = true;
            }
            return shouldRemove;
        });
    }

    if (stateMachineShouldSave && anyRemoved) { 
        stateMachine.save(StateChangeFactory.LinesRemoved(linesArray));
    }
    
    contextLine = [];
    redrawArrows();
    showdata();
}

/**
 * @description Will return all lines in the data array. This is mainly used for debugging purposes since we can log whenever the lines are read from.
 * @returns Returns all lines in the data array.
 */
function getLines() // TODO : Replace all lines[i] with getLines()[i], or event introduce a new getLineAt(i)?
{
    return lines;
}

/**
 * @description Generatesa a new ghost element that is used for visual feedback to the end user when creating new elements and/or lines. Setting ghostElement to null will remove the ghost element.
 * @see ghostElement
 */
function makeGhost()
{
    var entityType = constructElementOfType(elementTypeSelected);
    var typeNames = Object.getOwnPropertyNames(elementTypes);
    var lastMouseCoords = screenToDiagramCoordinates(lastMousePos.x, lastMousePos.y);
    ghostElement = {
        name: typeNames[elementTypeSelected],
        x: lastMouseCoords.x - entityType.data.width * 0.5,
        y: lastMouseCoords.y - entityType.data.height * 0.5,
        width: entityType.data.width,
        height: entityType.data.height,
        kind: entityType.data.kind,
        id: makeRandomID()
    };

    showdata();
}

/**
 * Creates a new element using the appropriate default values. These values are determined using the elementTypes enum.
 * @param {Number} type What type of element to construct.
 * @see elementTypes For all available values to pass as argument.
 * @returns {Object}
 */
function constructElementOfType(type)
{
    var elementTemplates = [
        {data: defaults.defaultERtentity, name: "Entity"},
        {data: defaults.defaultERrelation, name: "Relation"},
        {data: defaults.defaultERattr, name: "Attribute"},
        {data: defaults.defaultGhost, name: "Ghost"}
    ]

    if (enumContainsPropertyValue(type, elementTypes)){
        return elementTemplates[type];
    }
    // TODO : No return value if INVALID type.
}

/**
 * @description Triggered on ENTER-key pressed when a property is being edited via the options panel. This will apply the new property onto the element selected in context.
 * @see context For currently selected element.
 */
function changeState() 
{
    // TODO : THIS DOES NOT USE THE STATE MACHINE, VERY BAD!
    var property = document.getElementById("propertySelect").value;
    var element = context[0];
    element.state = property;
}

/**
 * @description Triggered on pressing the SAVE-button inside the options panel. This will apply all changes to the select element and will store the changes into the state machine.
 */
function saveProperties() 
{
    const propSet = document.getElementById("propertyFieldset");
    const element = context[0];
    const children = propSet.children;

    var propsChanged = {};

    for (var index = 0; index < children.length; index++) {
        const child = children[index];
        const propName = child.id.split(`_`)[1];

        switch (propName) {
            case "name":
                const value = child.value.trim();
                if (value && value.length > 0) {
                    element[propName] = value;
                    propsChanged.elementName = value;
                }
                break;
        
            default:
                break;
        }
    }

    stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, propsChanged));
    showdata();
    updatepos(0,0);
}

/**
 * Applies new changes to line attributes in the data array of lines.
 */
function changeLineProperties()
{
    // TODO : DOES NOT STORE ANYTHING TO THE STATE MACHINE, VERY BAD!
    // Set lineKind
    var radio1  = document.getElementById("lineRadio1");
    var radio2 = document.getElementById("lineRadio2");
    var line = contextLine[0];

    if(radio1.checked) {
        line.kind = radio1.value;
    } else {
        line.kind = radio2.value;
    }

    // Change line - cardinality
    var cardinalityInputValue = document.getElementById('propertyCardinality').value
    if (cardinalityInputValue == ""){
        delete line.cardinality;
    } else {
        line.cardinality = cardinalityInputValue
    }

    showdata();
}

/**
 * @description Updates what line(s) are selected.
 * @param {Object} selectedLine Line that has been selected.
 */
function updateSelectedLine(selectedLine)
{
    // This function works almost exaclty as updateSelection but for lines instead.

    // If CTRL is pressed and an element is selected
    if(selectedLine != null && ctrlPressed && !contextLine.includes(selectedLine)) {
        contextLine.push(selectedLine);

    // If ALT is pressed while selecting a line -> deselects that line
    } else if(selectedLine != null && altPressed) {

        if (contextLine.includes(selectedLine)) {    
            contextLine = contextLine.filter(function (line) 
            {
                return line !== selectedLine;
            });
        }
    }   
    // If CTRL is not pressed and a element has been selected.
    else if (selectedLine != null && !ctrlPressed) {
        clearContext();
        // Element not already in context
        if (!contextLine.includes(selectedLine) && contextLine.length < 1) {
            contextLine.push(selectedLine);
        } else {
            contextLine = [];
            contextLine.push(selectedLine);
        }
    } else if (!altPressed && !ctrlPressed ) {
      
        contextLine = [];
    }
    
    generateContextProperties();
}

/**
 * @description Updates the current selection of elements depending on what buttons are down. Context array may have the new element added or removed from the context array, have the context array replaced with only the new element or simply have the array emptied.
 * @param {Object} ctxelement Element that has was clicked or null. A null value will DESELECT all elements, emptying the entire context array.
 */
function updateSelection(ctxelement) // TODO : Default null value since we use it for deselection?
{
    // If CTRL is pressed and an element is selected
    if (ctrlPressed && ctxelement != null) {
        // The element is not already selected
        if (!context.includes(ctxelement)) {
            context.push(ctxelement);
        }
        // The element is already selected
    } else if (altPressed && ctxelement != null) {
        if (context.includes(ctxelement)) {
            context = context.filter(function (element)
            {
                return element !== ctxelement;
            });
        }
    }
    // If CTRL is not pressed and a element has been selected.
    else if (ctxelement != null) {
        clearContextLine();
        // Element not already in context
        if (!context.includes(ctxelement) && context.length < 1) {
            context.push(ctxelement);
        } else {
            if (mouseMode != mouseModes.EDGE_CREATION) {
                clearContext();
            }
            context.push(ctxelement);
        }
    } else if (!altPressed && !ctrlPressed) {
        clearContext();
    }

    // Generate the properties field in options-pane
    generateContextProperties();
}

/**
 * @description Puts all available elements of the data array into the context array.
 */
function selectAll()
{   
    context = data;
    contextLine = lines;
    showdata();
}

/**
 * Places a copy of all elements into the data array centered around the current mouse position.
 * @param {Array<Object>} elements List of all elements to paste into the data array.
 */
function pasteClipboard(elements)
{

    // If elements does is empty, display error and return null
    if(elements.length == 0){
        displayMessage("error", "You do not have any copied elements");
        return;
    }

    /*
    * Calculate the coordinate for the top-left pos (x1, y1)
    * and the coordinate for the bottom-right (x2, y2)
    * */
    var x1, x2, y1, y2;
    elements.forEach(element => {
        if (element.x < x1 || x1 === undefined) x1 = element.x;
        if (element.y < y1 || y1 === undefined) y1 = element.y;
        if ((element.x + element.width) > x2 || x2 === undefined) x2 = (element.x + element.width);
        if ((element.y + element.height) > y2 || y2 === undefined) y2 = (element.y + element.height);
    });

    var cx = (x2 - x1) / 2;
    var cy = (y2 - y1) / 2;
    var mousePosInPixels = screenToDiagramCoordinates(lastMousePos.x - (cx * zoomfact), lastMousePos.y - (cy * zoomfact));

    // Get all lines
    var allLines = getLines();
    var connectedLines = [];

    // Filter - keeps only the lines that are connectet to and from selected elements.
    allLines = allLines.filter(line => {
        return (elements.filter(element => {
            return line.toID == element.id || line.fromID == element.id
        })).length > 1
    });

    /*
    * For every line that shall be copied, create a temp object,
    * for kind and connection tracking
    * */
    allLines.forEach(line => {
        var temp = {
            id: line.id,
            fromID: line.fromID,
            toID: line.toID,
            kind: line.kind
        }
        connectedLines.push(temp);
    });

    // An mapping between oldElement ID and the new element ID
    var idMap = {};

    var newElements = [];
    var newLines = [];

    // For every copied element create a new one and add to data
    elements.forEach(element => {
        // Make a new id and save it in an object
        idMap[element.id] = makeRandomID();

        connectedLines.forEach(line => {
            if (line.fromID == element.id) line.fromID = idMap[element.id];
            else if (line.toID == element.id) line.toID = idMap[element.id];
        });

        // Create the new object
        var elementObj = {
            name: element.name,
            x: mousePosInPixels.x + (element.x - x1),
            y: mousePosInPixels.y + (element.y - y1),
            width: element.width,
            height: element.height,
            kind: element.kind,
            id: idMap[element.id],
            state: element.state
        };
        newElements.push(elementObj)
        addObjectToData(elementObj, false);
    });

    // Create the new lines but do not saved in stateMachine
    connectedLines.forEach(line => {
        newLines.push(
            addLine(data[findIndex(data, line.fromID)], data[findIndex(data, line.toID)], line.kind, false, false)
        );
    });

    // Save the copyed elements to stateMachine
    stateMachine.save(StateChangeFactory.ElementsAndLinesCreated(newElements, newLines));
    displayMessage(messageTypes.SUCCESS, `You have successfully pasted ${elements.length} elements and ${connectedLines.length} lines!`);
    clearContext(); // Deselect old selected elements
    context = newElements; // Set context to the pasted elements
    showdata();
}

/**
 * @description Empties the context array of all selected elements.
 */
function clearContext()
{
    if(context != null){
        context = [];
        generateContextProperties();
    }
}

/**
 * @description Empties the context array of all selected lines.
 */
function clearContextLine()
{
    if(contextLine != null){
        contextLine = [];
        generateContextProperties();
    }
}
//#endregion ===================================================================================
//#region ================================ HELPER FUNCTIONS     ================================
/**
 * @description Converst a position in screen pixels into coordinates of the array.
 * @param {Number} mouseX Pixel position in the x-axis.
 * @param {Number} mouseY Pixel position in the y-axis.
 * @returns {Point} Point containing the calculated coordinates.
 * @see diagramToScreenPosition() For converting the other way.
 */
function screenToDiagramCoordinates(mouseX, mouseY)
{
    // I guess this should be something that could be calculated with an expression but after 2 days we still cannot figure it out.
    // These are the constant values that the expression should spit out anyway. If you add more zoom levels please do not come to us.
    // We're tired.

    // We found out that the relation between 0.125 -> 4 and 0.36->-64 looks like an X^2 equation.
    var zoomX = 0;

    // ZOOM IN
    if (zoomfact == 1.25) zoomX = zoom1_25;
    if (zoomfact == 1.5) zoomX = zoom1_5;
    if (zoomfact == 2) zoomX = zoom2;
    if (zoomfact == 4) zoomX = zoom4;

    // ZOOM OUT
    if (zoomfact == 0.75) zoomX = zoom0_75;
    if (zoomfact == 0.5) zoomX = zoom0_5;
    if (zoomfact == 0.25) zoomX = zoom0_25;
    if (zoomfact == 0.125) zoomX = zoom0_125;

    return new Point(Math.round( ((mouseX - 0) / zoomfact - scrollx) + zoomX * scrollx + 2 + zoomOrigo.x), // the 2 makes mouse hover over container
                    Math.round(((mouseY - 0) / zoomfact - scrolly) + zoomX * scrolly + zoomOrigo.y)
    );
}

/**
 * @description Converts a coordinate on the canvas into a pixel position on the screen.
 * @param {Number} coordX Coordinate position in the x-axis.
 * @param {Number} coordY Coordinate position in the y-axis.
 * @returns {Point} Point containing the calculated screen position.
 * @depricated TODO : Needs to be updated
 * @see screenToDiagramCoordinates() For converting the other way.
 */
function diagramToScreenPosition(coordX, coordY)
{
    console.warn("diagramToScreenPosition() is depricated. It should be updated to use new screenToDiagramCoordinates() algorithm reversed.");
    return new Point(
        Math.round((coordX + scrollx) / zoomfact + 0),
        Math.round((coordY + scrolly) / zoomfact + 0)
    );
}

/**
 * @description Test weither an enum object contains a certain property value.
 * @param {*} value The value that the enumObject is tested for.
 * @param {Object} enumObject The enum object containing all possible values.
 * @returns {Boolean} Returns TRUE if an enum contains the tested value
 */
function enumContainsPropertyValue(value, enumObject) 
{
    for (const property in enumObject) {
        // If any cursor mode matches the passed argument
        const cm = enumObject[property];
        if (cm == value) {
            return true;
        }
    }
    return false;
}

/**
 * @description Creates an object with the selected x and y values.
 * @param {*} x 
 * @param {*} y 
 * @returns {Object} Returns object with x and y properties set.
 * @depricated Use new Point object instead!
 */
function getPoint (x,y)
{
    return {
        x: x,
        y: y
    };
}

/**
 * @description Creates a new rectangle from upper left point and lower right point.
 * @param {Point} topLeft 
 * @param {Point} bottomRight 
 * @returns {Object} Returns an object representing a rectangle with position and size.
 */
function getRectFromPoints(topLeft, bottomRight)
{
    return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
    };
}

/**
 * @description Creates a new rectangle from an element.
 * @param {Object} element Element with a x,y,width and height propery.
 * @returns 
 */
function getRectFromElement (element)
{
    return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
    };
}

/**
 * @description Performs a box-collision between two rectangles.
 * @param {*} left First rectangle
 * @param {*} right Second rectangle
 * @returns {Boolean} true if the rectangles collide with each other.
 */
function rectsIntersect (left, right)
{
    return (
        (left.x + left.width >= right.x) && 
        (left.x <= right.x + right.width) &&
        (left.y + left.height >= right.y) &&
        (left.y <= right.y + right.height)
    );
}

/**
 * @description Moves the first element with matching ID a certain coordinates along the x/y-axis.
 * @param {String} id Hexadecimal ID represented as a string.
 * @param {Number} x Coordinates along the x-axis to move
 * @param {Number} y Coordinates along the y-axis to move
 */
function setPos(id, x, y)
{
    foundId = findIndex(data, id);
    if (foundId != -1) {
        var obj = data[foundId];
        if (snapToGrid) {
            if (!ctrlPressed) {
                // Calculate nearest snap point
                obj.x = Math.round((obj.x - (x * (1.0 / zoomfact))) / gridSize) * gridSize;
                obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / gridSize) * gridSize;

                // Set the new snap point to center of element
                obj.x -= obj.width / 2
                obj.y -= obj.height / 2;
            } else {
                obj.x += (targetDelta.x / zoomfact);
                obj.y += (targetDelta.y / zoomfact);
            }
        }else {
            obj.x -= (x / zoomfact);
            obj.y -= (y / zoomfact);
        }
    }
}

function isKeybindValid(e, keybind)
{
    return e.key.toLowerCase() == keybind.key && e.ctrlKey == keybind.ctrl;
}

function findEntityFromLine(lineObj)
{
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.ENTITY).data.kind){
        return -1;
    }else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.ENTITY).data.kind) {
        return 1;
    }
    return null;
}
//#endregion =====================================================================================
//#region ================================ MOUSE MODE FUNCS     ================================
/**
 * @description Changes the current mouse mode using argument enum value.
 * @param {mouseModes} mode What mouse mode to change into.
 * @see mouseModes For all available enum values.
 */
function setMouseMode(mode)
{   
    if (enumContainsPropertyValue(mode, mouseModes)) {
        // Mode-specific activation/deactivation
        onMouseModeDisabled();
        mouseMode = mode;
        setCursorStyles(mode);
        onMouseModeEnabled();
    } else {
        // Not implemented exception
        console.error("Invalid mode passed to setMouseMode method. Missing implementation?");
    }
}

/**
 * @description Changes the current visual cursor style for the user.
 * @param {Number} cursorMode CursorStyle value. This will be translated into appropriate cursor style.
 */
function setCursorStyles(cursorMode = mouseModes.POINTER)
{
    // TODO : Create new string enum for all cursor styles? This would result in us not needing to use any form of branching and still get correct result.
    // TODO : Should have better name. This is the CONTAINER and not a CURSORSTYLE!
    cursorStyle = document.getElementById("container").style;

    switch(cursorMode) {
        case mouseModes.POINTER:
            cursorStyle.cursor = "pointer";
            break;
        case mouseModes.BOX_SELECTION:
            cursorStyle.cursor = "crosshair";
            break;
        case mouseModes.PLACING_ELEMENT:
            cursorStyle.cursor = "default";
            break;
        case mouseModes.EDGE_CREATION:
            cursorStyle.cursor = "grab";
            break;
        default:
            break;
    }
}

/**
 * @description Function triggered just AFTER the current mouse mode is changed.
 */
function onMouseModeEnabled()
{
    // Add the diagramActive to current diagramIcon
    if (mouseMode === mouseModes.PLACING_ELEMENT) {
        document.getElementById("elementPlacement" + elementTypeSelected).classList.add("active");
    } else {
        document.getElementById("mouseMode" + mouseMode).classList.add("active");
    }

    switch (mouseMode) {
        case mouseModes.POINTER:
            break;

        case mouseModes.PLACING_ELEMENT:
            makeGhost();
            break;

        case mouseModes.EDGE_CREATION:  
            break;

        case mouseModes.BOX_SELECTION:
            break;

        default: console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeEnabled()!`);
            break;
    }
}

/**
 * @description Function triggered just BEFORE the current mouse mode is changed.
 */
function onMouseModeDisabled()
{
    // Remove all "active" classes in nav bar
    var navButtons = document.getElementsByClassName("toolbarMode");
    for (var i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }

    switch (mouseMode) {
        case mouseModes.POINTER:
            break;

        case mouseModes.EDGE_CREATION:
            ghostLine = null; // continues into mouseMode.PLACING_ELEMENT
        // NO BREAK

        case mouseModes.PLACING_ELEMENT:
            ghostElement = null;
            showdata();
            break;

        case mouseModes.BOX_SELECTION:
            break;
    
        default: console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeDisabled()!`);
            break;
    }
}
function calculateDeltaExceeded(){
    // Remember that mouse has moved out of starting bounds
    if ((deltaX >= maxDeltaBeforeExceeded || deltaX <= -maxDeltaBeforeExceeded) || (deltaY >= maxDeltaBeforeExceeded ||
        deltaY <= -maxDeltaBeforeExceeded)) {
        deltaExceeded = true;
    }
}
// --------------------------------------- Box Selection    --------------------------------
// Returns all elements touching the coordinate box
function getElementsInsideCoordinateBox(selectionRect)
{
    var elements = [];
    data.forEach(element => {

        // Box collision test
        if (rectsIntersect(selectionRect, getRectFromElement(element))) {
            elements.push(element);
        }
    });
    return elements;
}

function getBoxSelectionPoints()
{
    return {
        n1: getPoint(startX, startY),
        n2: getPoint(startX + deltaX, startY),
        n3: getPoint(startX, startY + deltaY),
        n4: getPoint(startX + deltaX, startY + deltaY),
    };
}

function getBoxSelectionCoordinates()
{
    return {
        n1: screenToDiagramCoordinates(startX, startY),
        n2: screenToDiagramCoordinates(startX + deltaX, startY),
        n3: screenToDiagramCoordinates(startX, startY + deltaY),
        n4: screenToDiagramCoordinates(startX + deltaX, startY + deltaY),
    };
}

// User has initiated a box selection
function boxSelect_Start(mouseX, mouseY)
{
    // Store previous context
    previousContext = context;

    // Set starting position
    startX = mouseX;
    startY = mouseY;
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = true;
}

function boxSelect_Update(mouseX, mouseY)
{
    if (boxSelectionInUse) {
        // Update relative position form the starting position
        deltaX = mouseX - startX;
        deltaY = mouseY - startY;

        calculateDeltaExceeded();

        // Select all objects inside the box
        var coords = getBoxSelectionCoordinates();
            
        // Calculate top-left and bottom-right coordinates
        var topLeft = getPoint(0, 0), bottomRight = getPoint(0, 0);

        // left/right
        if (coords.n1.x < coords.n4.x) {
            topLeft.x = coords.n1.x;
            bottomRight.x = coords.n4.x;
        } else {
            topLeft.x = coords.n4.x;
            bottomRight.x = coords.n1.x;
        }
        // top/bottom
        if (coords.n1.y < coords.n4.y) {
            topLeft.y = coords.n1.y;
            bottomRight.y = coords.n4.y;
        } else {
            topLeft.y = coords.n4.y;
            bottomRight.y = coords.n1.y;
        }

        var rect = getRectFromPoints(topLeft, bottomRight);

        if (ctrlPressed) {
            var markedEntities = getElementsInsideCoordinateBox(rect);
            // Remove entity from previous context is the element is marked
            previousContext = previousContext.filter(entity => !markedEntities.includes(entity));

            clearContext();
            context = context.concat(markedEntities);
            context = context.concat(previousContext);
        }else if (altPressed) {
            var markedEntities = getElementsInsideCoordinateBox(rect);
            // Remove entity from previous context is the element is marked
            previousContext = previousContext.filter(entity => !markedEntities.includes(entity));

            context = [];
            context = previousContext;

        }else {
            context = getElementsInsideCoordinateBox(rect);
        }
    }
}

function boxSelect_End()
{
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = false;
}

function boxSelect_Draw(str)
{
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && (pointerState == pointerStates.DEFAULT || pointerState == pointerStates.CLICKED_LINE)) {
        // Positions to draw lines in-between
        /*
            Each [nx] depicts one node in the selection triangle.
            We draw a line between each corner and its neighbours.

            [n1]----------[n2]
            |              |
            |              |
            |              |
            |              |
            [n3]----------[n4]
        */

        // Calculate each node position
        var boxCoords = getBoxSelectionPoints();
        var nodeStart = boxCoords.n1;
        var nodeX = boxCoords.n2
        var nodeY = boxCoords.n3;
        var nodeXY = boxCoords.n4;

        // Draw lines between all neighbours
        // TODO : NO MAGIC NUMBERS!
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${2}' />`;
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${2}' />`;

        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${2}' />`;
        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${2}' />`;
    }
    
    return str;
}
//#endregion =====================================================================================
//#region ================================ GUI                  ==================================
/**
 * @description Toggles the movement of elements ON/OFF.
 */
function toggleEntityLocked()
{
    var locked = true;
    for(var i = 0; i < context.length; i++){
        if(!context[i].isLocked) {
            locked = false;
            break;
        }
    }
    for (var i = 0; i < context.length; i++){
        if(!locked) {
            context[i].isLocked = true;
        } else {
            context[i].isLocked = false;
        }
    }
}

/**
 * @description Toggles the visual background grid ON/OFF.
 */
function toggleGrid()
{
    var grid = document.getElementById("svggrid");

    // Toggle active class on button
    document.getElementById("gridToggle").classList.toggle("active");

    if (grid.style.display == "block") {
        grid.style.display = "none";
     } else {
        grid.style.display = "block";
   }
}

/**
 * @description Toggles the A4 template ON/OFF.
 */
function toggleA4Template()
{
    var template = document.getElementById("a4Template");

    // Toggle active class on button
    document.getElementById("a4TemplateToggle").classList.toggle("active");

    if (template.style.display == "block") {
        template.style.display = "none";
     } else {
        template.style.display = "block";
   }
}

/**
 * @description Toggles weither the snap-to-grid logic should be active or not. The GUI button will also be flipped.
 */
function toggleSnapToGrid()
{
    // Toggle active class on button
    document.getElementById("rulerSnapToGrid").classList.toggle("active");

    // Toggle the boolean
    snapToGrid = !snapToGrid;
}

/**
 * @description Toggles weither the ruler is visible or not for the end user.
 */
function toggleRuler()
{
    var ruler = document.getElementById("rulerOverlay");
  
    // Toggle active class on button
    document.getElementById("rulerToggle").classList.toggle("active");

    if(isRulerActive){
        ruler.style.display = "none";
    } else {
        ruler.style.display = "block";
    }
  
    isRulerActive = !isRulerActive;
    drawRulerBars(scrollx,scrolly);
}

/**
 * @description Changes what element will be constructed on next constructElementOfType call.
 * @param {Number} type What kind of element to place.
 * @see constructElementOfType
 */
function setElementPlacementType(type = elementTypes.ENTITY)
{
    elementTypeSelected = type;
}

/**
 * @description Increases the current zoom level if not already at maximum. This will magnify all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom towards the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event.
 */
function zoomin(scrollEvent = undefined)
{
    // If zoomed with mouse wheel, change zoom target into new mouse position on screen.
    if (scrollEvent && zoomfact <= 4.0) {
        var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);
        var delta = {
            x: mouseCoordinates.x - zoomOrigo.x,
            y: mouseCoordinates.y - zoomOrigo.y
        };
        if(zoomfact < 4.0) { // Only change zoomOrigo when not fully zoomed in.
            zoomOrigo.x += delta.x * zoomPower;
            zoomOrigo.y += delta.y * zoomPower;
        }
        
    }else { // Otherwise, set zoom target to origo.
        zoomOrigo.x = 0;
        zoomOrigo.y = 0;
    }

    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;
    
    if (zoomfact == 0.125) zoomfact = 0.25;
    else if (zoomfact == 0.25) zoomfact = 0.5;
    else if (zoomfact == 0.5) zoomfact = 0.75;
    else if (zoomfact == 0.75) zoomfact = 1.0;
    else if (zoomfact == 1.0) zoomfact = 1.25;
    else if (zoomfact == 1.25) zoomfact = 1.5;
    else if (zoomfact == 1.5) zoomfact = 2.0;
    else if (zoomfact == 2.0) zoomfact = 4.0;
    
    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    camera = {
        x: (window.innerWidth * 0.5 - (scrollx / zoomfact) + 1) / zoomfact,
        y: (window.innerHeight * 0.5 - (scrolly / zoomfact) + 1) / zoomfact
    };

    updateGridSize();
    updateA4Size();

    // Update scroll position - missing code for determining that center of screen should remain at nevw zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx,scrolly);
}

/**
 * @description Decreases the current zoom level if not already at minimum. This will shrink all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom away from the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event.
 */
function zoomout(scrollEvent = undefined)
{
    // If zoomed with mouse wheel, change zoom target into new mouse position on screen.
    if (scrollEvent && zoomfact != 0.125) {
        var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);
        var delta = {
            x: mouseCoordinates.x - zoomOrigo.x,
            y: mouseCoordinates.y - zoomOrigo.y
        };

        zoomOrigo.x -= delta.x * zoomPower;
        zoomOrigo.y -= delta.y * zoomPower;
    } else { // Otherwise, set zoom target to origo.
        zoomOrigo.x = 0;
        zoomOrigo.y = 0;
    }

    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    if (zoomfact == 0.25) zoomfact = 0.125;
    else if (zoomfact == 0.5) zoomfact = 0.25;
    else if (zoomfact == 0.75) zoomfact = 0.5;
    else if (zoomfact == 1.0) zoomfact = 0.75;
    else if (zoomfact == 1.25) zoomfact = 1.0;
    else if (zoomfact == 1.5) zoomfact = 1.25;
    else if (zoomfact == 2.0) zoomfact = 1.5;
    else if (zoomfact == 4.0) zoomfact = 2.0;

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    updateGridSize();
    updateA4Size();
    
    // Update scroll position - missing code for determining that center of screen should remain at new zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx,scrolly);
}

/**
 * @description Event function triggered whenever a property field is pressed in the options panel. This will appropriatly update the current propFieldState variable.
 * @param {Boolean} isSelected Boolean value representing if the selection was ACTIVATED or DEACTIVATED.
 * @see propFieldState For seeing if any fieldset is currently selected.
 */
function propFieldSelected(isSelected)
{
    propFieldState = isSelected;
}

/**
 * @description Generates fields for all properties of the currently selected element/line in the context. These fields can be used to modify the selected element/line.
 */
function generateContextProperties()
{
    // Return if double clicking the same element.
    if(wasDblClicked)return;

    var propSet = document.getElementById("propertyFieldset");
    var str = "<legend>Properties</legend>";

    //more than one element selected

    if (context.length == 1 && contextLine.length == 0) {
        var element = context[0];
        //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111 
        for (const property in element) {
            switch (property.toLowerCase()) {
                case "name":
                    str += `<input id="elementProperty_${property}" type="text" value="${element[property]}" onfocus="propFieldSelected(true)" onblur="propFieldSelected(false)"> `;
                    break;
            
                default:
                    break;
            }
        }

        //Creates drop down for changing state of ER elements
        var value;
        var selected = context[0].state;
        if(selected == undefined) {
            selected = "normal"
        }
        if(element.kind=="ERAttr") {
            value = Object.values(attrState);
        } else if(element.kind=="EREntity") {
            value = Object.values(entityState);
        } else if(element.kind=="ERRelation") {
            value = Object.values(relationState);
        }
        str += '<select id="propertySelect">';
            for (i = 0; i < value.length; i++) {
                if (selected != value[i]) {
                    str += '<option value='+value[i]+'>'+ value[i] +'</option>';   
                } else if(selected == value[i]) {
                    str += '<option selected ="selected" value='+value[i]+'>'+ value[i] +'</option>';
                }
            }
        str += '</select>'; 
        str +=`<br><br><input type="submit" value="Save" class='saveButton' onclick="changeState();saveProperties();displayMessage(messageTypes.SUCCESS, 'Successfully saved')">`;
    } 

    // Creates radio buttons and drop-down menu for changing the kind attribute on the selected line.
    if (contextLine.length == 1 && context.length == 0) {
        str = "<legend>Properties</legend>";
        
        var value;
        var selected = contextLine[0].kind;
        if(selected == undefined) selected = normal;
        
        value = Object.values(lineKind);
        str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
        for(var i = 0; i < value.length; i++){
            if(selected == value[i]){
                str += `<input type="radio" id="lineRadio1" name="lineKind" value='${value[i]}' checked>`
                str += `<label for='${value[i]}'>${value[i]}</label><br>`
            }else {
                str += `<input type="radio" id="lineRadio2" name="lineKind" value='${value[i]}'>`
                str += `<label for='${value[i]}'>${value[i]}</label><br>` 
            }
        }

        // Cardinality
        // If FROM or TO has an entity, print option for change
        if (findEntityFromLine(contextLine[0]) != null){
            str += `<label style="display: block">Cardinality: <select id='propertyCardinality'>`;
            str  += `<option value=''>None</option>`
            Object.keys(lineCardinalitys).forEach(cardinality => {
                if (contextLine[0].cardinality != undefined && contextLine[0].cardinality == cardinality){
                    str += `<option value='${cardinality}' selected>${lineCardinalitys[cardinality]}</option>`;
                }else {
                    str += `<option value='${cardinality}'>${lineCardinalitys[cardinality]}</option>`;
                }
            });
            str += `</select></label>`;
        }

        str+=`<br><br><input type="submit" class='saveButton' value="Save" onclick="changeLineProperties();">`;
    }

    if(context.length > 0) {
        str += `<br></br><input type="submit" value="Lock" class="saveButton" onclick="toggleEntityLocked();">`;
    }

    propSet.innerHTML = str;
}

/**
 * @description Toggles the option menu being open or closed.
 */
function fab_action()
{
    if (document.getElementById("options-pane").className == "show-options-pane") {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        document.getElementById("options-pane").className = "hide-options-pane";
    } else {
        document.getElementById('optmarker').innerHTML = "&#x1f4a9;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}

/**
 * @description Generates keybind tooltips for all keybinds that are available for the diagram.
 * @see keybinds All available keybinds currently configured.
 */
function generateToolTips()
{
    var toolButtons = document.getElementsByClassName("key_tooltip");

    for (var index = 0; index < toolButtons.length; index++) {
        const element = toolButtons[index];
        var id = element.id.split("-")[1];
        if (Object.getOwnPropertyNames(keybinds).includes(id)) {

            var str = "Keybind: ";

            if (keybinds[id].ctrl) str += "CTRL + ";
            str += '"' + keybinds[id].key.toUpperCase() + '"';

           element.innerHTML = str;
        }
    }
}

/**
 * @description Modified the current ruler position to respective x and y coordinate. This DOM-element has an absolute position and does not change depending on other elements.
 * @param {Number} x Absolute x-position in pixels from the left of the inner window.
 * @param {Number} y Absolute y-position in pixels from the top of the inner window.
 */
function setRulerPosition(x, y) 
{
    document.getElementById("ruler-x").style.left = x - 51 + "px";
    document.getElementById("ruler-y").style.top = y + "px";
}

/**
 * @description Performs an update to the current grid size depending on the current zoom level.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
function updateGridSize()
{
    var bLayer = document.getElementById("grid");
    bLayer.setAttribute("width", gridSize * zoomfact + "px");
    bLayer.setAttribute("height", gridSize * zoomfact + "px");

    bLayer.children[0].setAttribute('d', `M ${gridSize * zoomfact} 0 L 0 0 0 ${gridSize * zoomfact}`);

    // Set width of origo line on the x axis
    bLayer = document.getElementById("origoX");
    bLayer.style.strokeWidth = origoWidth * zoomfact;

    // Set width of origo line on the y axis
    bLayer = document.getElementById("origoY");
    bLayer.style.strokeWidth = origoWidth * zoomfact;

    updateGridPos();
}

/**
 * @description Performs an update to the current A4 template size depending on the current zoom level.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
 function updateA4Size()
 {
    var rect = document.getElementById("a4Rect");
    rect.setAttribute("width", 794 * zoomfact + "px");
    rect.setAttribute("height", 1122 * zoomfact + "px");
    updateA4Pos();
 }

/**
 * @description Calculates new positioning for the background grid.
 */
function updateGridPos()
{
    var gridOffsetX = Math.round(((0 - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
    var gridOffsetY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));
    var bLayer = document.getElementById("grid");
    bLayer.setAttribute('x', gridOffsetX);
    bLayer.setAttribute('y', gridOffsetY);

    // origo x axis line position
    bLayer = document.getElementById("origoX");
    bLayer.setAttribute('y1', gridOffsetY);
    bLayer.setAttribute('y2', gridOffsetY);

    // origo y axis line position
    bLayer = document.getElementById("origoY");
    bLayer.setAttribute('x1', gridOffsetX);
    bLayer.setAttribute('x2', gridOffsetX);
}

/**
 * @description Calculates new positioning for the A4 template.
 */
 function updateA4Pos()
 {
    var OffsetX = Math.round(((0 - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
    var OffsetY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));
    var rect = document.getElementById("a4Rect");
    var text = document.getElementById("a4Text");
    rect.setAttribute('x', OffsetX);
    rect.setAttribute('y', OffsetY);
    text.setAttribute('x',(OffsetX + (780 *zoomfact)));
    text.setAttribute('y',(OffsetY - 5));
 }

/**
 * @description Displays a popup message as feedback for the current user. This message will then be destroyed after a specified time.
 * @param {messageTypes} type What kind of message type this is.
 * @param {String} message Contents of the message displayed.
 * @param {Number} time Milliseconds until the message will be destroyed.
 * @see messageTypes All kind of messages there exist to display.
 */
function displayMessage(type, message, time = 5000)
{
    // Message settings
    const maxMessagesAtDisplay = 5; // The number of messages that can be displayed on the screen

    var messageElement = document.getElementById("diagram-message"); // Get div for error-messages
    var id = makeRandomID();

    // If the already is the maximum number of messages, remove the oldest one
    if (messageElement.childElementCount >= maxMessagesAtDisplay) {
        removeMessage(messageElement.firstElementChild);
    }

    // Add a new message to the div.
    messageElement.innerHTML += `<div id='${id}' onclick='removeMessage(this)' class='${type}'><p>${message}</p></div>`;

    if (time > 0) {
        setTimerToMessage(messageElement.lastElementChild, time);
    }

}

/**
 * @description Function for setting the message destruction timer of a popup message. This is used by the displayMessage() function. 
 * @param {HTMLElement} element The message DOM element that should be edited.
 * @param {Number} time Milliseconds until the message will be destroyed.
 */
function setTimerToMessage(element, time = 5000)
{
    if (!element) return;

    element.innerHTML += `<div class="timeIndicatorBar"></div>`;
    var timer = setInterval( function(){
        var element = document.getElementById(errorMsgMap[timer].id); // TODO : SAME VARIABLE NAME AS OUTER SCOPE?????
        errorMsgMap[timer].percent -= 1;
        element.lastElementChild.style.width = `calc(${errorMsgMap[timer].percent - 1}% - 10px)`;

        // If the time is out, remove the message
        if(errorMsgMap[timer].percent === 0) removeMessage(element, timer);

    }, time / 100);

    // Adds to map: TimerID: ElementID, Percent
    errorMsgMap[timer] = {
        id: element.id,
        percent: 100
    };
}
//-------------------------------------------------------------------------------------------------
// Removes the message from DOM and removes all the variables that are used
//-------------------------------------------------------------------------------------------------
/**
 * @description Destroys a popup message.
 * @param {HTMLElement} element The message DOM element that should be destroyed.
 * @param {Number} timer Kills the timer associated with the popup message. Can be null and will not remove any timer then.
 */
function removeMessage(element, timer)
{
    // If there is no timer in the parameter try find it by elementID in
    if (!timer) {
        timer = Object.keys(errorMsgMap).find(key => {
            return errorMsgMap[key].id === element.id
        });
    }

    if (timer) {
        clearInterval(timer); // Remove the timer
        delete errorMsgMap[timer]; // Remove timer from the map
    }

    element.remove(); // Remove the element from DOM
    // Remove ID from randomidArray
    randomidArray = randomidArray.filter(id => {
        return element.id !== id;
    });
}
//#endregion =====================================================================================
//#region ================================ ELEMENT CALCULATIONS ==================================
/**
 * @description Sorts all lines connected to an element on each side.
 * @param {String} a Hexadecimal id for the element at current test index for sorting.
 * @param {String} b Hexadecimal id for the element were comparing to.
 * @param {Array<Object>} ends Array of all lines connected on this side.
 * @param {String} elementid Hexadecimal id for element to perform sorting on.
 * @param {Number} axis 
 * @returns {Number} 1 or -1 depending in the resulting calculation.
 */
function sortvectors(a, b, ends, elementid, axis) // TODO : Replace variable names a and b
{
    // Get dx dy centered on association end e.g. invert vector if necessary
    var lineA = (ghostLine && a === ghostLine.id) ? ghostLine : lines[findIndex(lines, a)];
    var lineB = (ghostLine && b === ghostLine.id) ? ghostLine : lines[findIndex(lines, b)];
    var parent = data[findIndex(data, elementid)];

    // Retrieve opposite element - assume element center (for now)
     if (lineA.fromID == elementid) {
        toElementA = (lineA == ghostLine) ? ghostElement : data[findIndex(data, lineA.toID)];
    } else {
        toElementA = data[findIndex(data, lineA.fromID)];
    }

    if (lineB.fromID == elementid) {
        toElementB = (lineB == ghostLine) ? ghostElement : data[findIndex(data, lineB.toID)];
    } else {
        toElementB = data[findIndex(data, lineB.fromID)];
    }

    if (navigator.userAgent.indexOf("Chrome") !== -1) {
        sortval = 1;
    } else {
        sortval = -1;
    }

    // If lines cross swap otherwise keep as is
    if (axis == 0 || axis == 1) {
        // Left side
        ay = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        by = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 0) parentx = parent.x1
        else parentx = parent.x2;

        if (linetest(toElementA.cx, toElementA.cy, parentx, ay, toElementB.cx, toElementB.cy, parentx, by) === false) return sortval

    } else if (axis == 2 || axis == 3) {
        // Top / Bottom side
        ax = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        bx = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 2) parenty = parent.y1
        else parenty = parent.y2;

        if (linetest(toElementA.cx, toElementA.cy, ax, parenty, toElementB.cx, toElementB.cy, bx, parenty) === false) return sortval
    }

    return -sortval;
}

/**
 * @description
 * @param {Number} x1 Position 1 
 * @param {Number} y1 Position 1 
 * @param {Number} x2 Position 2 
 * @param {Number} y2 Position 2 
 * @param {Number} x3 Position 3 
 * @param {Number} y3 Position 3 
 * @param {Number} x4 Position 4 
 * @param {Number} y4 Position 4 
 * @returns False or An object with x/y coordinates.
 */
 // TODO : WHY does it return EITHER a boolean OR an object??????? Either this is a TRUE/FALSE function and return booleans OR it returns objects/null/undefined!
 // TODO : Use new POINT objects to reduce amount of arguments?
function linetest(x1, y1, x2, y2, x3, y3, x4, y4)
{
    // TODO : Can be deleted?
    // Display line test locations using svg lines
    // str+=`<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#44f' stroke-width='2' />`;
    // str+=`<line x1='${x3}' y1='${y3}' x2='${x4}' y2='${y4}' stroke='#44f' stroke-width='2' />`

    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {

        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) return false;
        } else {
            if (!(x1 <= x && x <= x2)) return false;
        } 
        
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) return false;
        } else {
            if (!(y1 <= y && y <= y2)) return false;
        }

        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) return false;
        } else {
            if (!(x3 <= x && x <= x4)) return false;
        }

        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) return false;
        } else {
            if (!(y3 <= y && y <= y4)) return false;
        }
    }
    return { 
        x: x,
        y: y 
    };
}

/**
 * @description Clears the line list on all sides of an element.
 * @param {Object} element Element to empty all sides of.
 */
function clearLinesForElement(element)
{
    element.left = [];
    element.right = [];
    element.top = [];
    element.bottom = [];

    // Get data from dom elements
    var domelement = document.getElementById(element.id);
    var domelementpos = domelement.getBoundingClientRect();
    element.x1 = domelementpos.left;
    element.y1 = domelementpos.top;
    element.x2 = domelementpos.left + domelementpos.width - 2;
    element.y2 = domelementpos.top + domelementpos.height - 2;
    element.cx = element.x1 + (domelementpos.width * 0.5);
    element.cy = element.y1 + (domelementpos.height * 0.5);
}
/**
 * @description Checks overlapping and what side of the elements that the line is connected to.
 * @param {Object} line Line that should be checked.
 * @param {boolean} targetGhost Is the line an ghostLine
 */
function determineLine(line, targetGhost = false)
{
    var felem, telem, dx, dy;

    felem = data[findIndex(data, line.fromID)];

    // Telem should be our ghost if argument targetGhost is true. Otherwise look through data array.
    telem = targetGhost ? ghostElement : data[findIndex(data, line.toID)];
    line.dx = felem.cx - telem.cx;
    line.dy = felem.cy - telem.cy;

    // Figure out overlap - if Y overlap we use sides else use top/bottom
    var overlapY = true;
    if (felem.y1 > telem.y2 || felem.y2 < telem.y1) overlapY = false;
    var overlapX = true;
    if (felem.x1 > telem.x2 || felem.x2 < telem.x1) overlapX = false;
    var majorX = true;
    if (Math.abs(line.dy) > Math.abs(line.dx)) majorX = false;

    // Determine connection type (top to bottom / left to right or reverse - (no top to side possible)
    var ctype = 0;
    if (overlapY || ((majorX) && (!overlapX))){
        if (line.dx > 0) line.ctype = "LR"
        else line.ctype = "RL";
    }else{
        if (line.dy > 0) line.ctype = "TB";
        else line.ctype = "BT";
    }

    // Add accordingly to association end
    if (line.ctype == "LR"){
        if (felem.kind == "EREntity") felem.left.push(line.id);
        if (telem.kind == "EREntity") telem.right.push(line.id);
    }else if (line.ctype == "RL"){
        if (felem.kind == "EREntity") felem.right.push(line.id);
        if (telem.kind == "EREntity") telem.left.push(line.id);
    }else if (line.ctype == "TB"){
        if (felem.kind == "EREntity") felem.top.push(line.id);
        if (telem.kind == "EREntity") telem.bottom.push(line.id);
    }else if (line.ctype == "BT"){
        if (felem.kind == "EREntity") felem.bottom.push(line.id);
        if (telem.kind == "EREntity") telem.top.push(line.id);
    }
}
/**
 * @description Sort the associations for each side of an element.
 * @param {Object} element Element to sort.
 */
function sortElementAssociations(element)
{
    // Only sort if size of list is >= 2
    // TODO : Replace variable names a and b
    if (element.top.length > 1) element.top.sort(function (a, b) { return sortvectors(a, b, element.top, element.id, 2) });
    if (element.bottom.length > 1) element.bottom.sort(function (a, b) { return sortvectors(a, b, element.bottom, element.id, 3) });
    if (element.left.length > 1) element.left.sort(function (a, b) { return sortvectors(a, b, element.left, element.id, 0) });
    if (element.right.length > 1) element.right.sort(function (a, b) { return sortvectors(a, b, element.right, element.id, 1) });
}

/**
 * @description Add an line between two elements. Also checks if the line is connected between right elements and is not exceed the allowed amount.
 * @param {Object} fromElement Element that the line is from.
 * @param {Object} toElement Element that the line is to.
 * @param {String} kind The kind of line that should be added.
 * @param {boolean} stateMachineShouldSave Should this line be added to the stateMachine.
 */
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true, successMessage = true){
    // Check so the elements does not have the same kind, exception for the "ERAttr" kind.
    if (fromElement.kind !== toElement.kind || fromElement.kind === "ERAttr" ) {

        // Filter the existing lines and gets the number of existing lines
        var numOfExistingLines = lines.filter(function (line) {
            return (fromElement.id === line.fromID &&
                    toElement.id === line.toID ||
                    fromElement.id === line.toID &&
                    toElement.id === line.fromID)
                    }).length;

        // Define a boolean for special case that relation and entity can have 2 lines
        var specialCase = (fromElement.kind === "ERRelation" &&
                            toElement.kind === "EREntity" ||
                            fromElement.kind === "EREntity" &&
                            toElement.kind === "ERRelation");

        // If there is no existing lines or is a special case
        if (numOfExistingLines === 0 || (specialCase && numOfExistingLines <= 1)) {

            var newLine = {
                id: makeRandomID(),
                fromID: fromElement.id,
                toID: toElement.id,
                kind: kind
            };

            // If the new line has an entity FROM or TO, add default cardinality
            if (findEntityFromLine(newLine) != null) {
                newLine.cardinality = "MANY";
            }
            
            addObjectToLines(newLine, stateMachineShouldSave);
            
            if(successMessage) displayMessage(messageTypes.SUCCESS,`Created new line between: ${fromElement.name} and ${toElement.name}`);
            return newLine;
            
        } else {
            displayMessage(messageTypes.ERROR,`Maximum amount of lines between: ${fromElement.name} and ${toElement.name}`);
        }
    } else {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between two: ${fromElement.kind} elements`);
    }
}
//#endregion =====================================================================================
//#region ================================ DRAWING FUNCTIONS    ==================================
/**
 * @description Constructs an string containing the svg line-elements of the inputted line object in parameter.
 * @param {Object} line The line object that is drawn.
 * @param {boolean} targetGhost Is the targeted line an ghost line
 */
function drawLine(line, targetGhost = false)
{   
    var felem, telem, dx, dy;
    var str = "";
    
    var lineColor = '#A000DC';
    if(contextLine.includes(line)){
        lineColor = '#F0D11C';
    }

    felem = data[findIndex(data, line.fromID)];

    // Telem should be our ghost if argument targetGhost is true. Otherwise look through data array.
    telem = targetGhost ? ghostElement : data[findIndex(data, line.toID)];

    // Draw each line - compute end coordinate from position in list compared to list count
    fx = felem.cx;
    fy = felem.cy;
    tx = telem.cx;
    ty = telem.cy;

    // Collect coordinates
    if (line.ctype == "BT"){
        fy = felem.y2;
        if (felem.kind == "EREntity") fx = felem.x1 + (((felem.x2 - felem.x1) / (felem.bottom.length + 1)) * (felem.bottom.indexOf(line.id) + 1));
        ty = telem.y1;
    }else if (line.ctype == "TB"){
        fy = felem.y1;
        if (felem.kind == "EREntity") fx = felem.x1 + (((felem.x2 - felem.x1) / (felem.top.length + 1)) * (felem.top.indexOf(line.id) + 1));
        ty = telem.y2;
    }else if (line.ctype == "RL"){
        fx = felem.x2;
        if (felem.kind == "EREntity") fy = felem.y1 + (((felem.y2 - felem.y1) / (felem.right.length + 1)) * (felem.right.indexOf(line.id) + 1));
        tx = telem.x1;
    }else if (line.ctype == "LR"){
        fx = felem.x1;
        if (felem.kind == "EREntity") fy = felem.y1 + (((felem.y2 - felem.y1) / (felem.left.length + 1)) * (felem.left.indexOf(line.id) + 1));
        tx = telem.x2;
    }

    if (line.kind == "Normal"){

        str += `<line id='${line.id}' x1='${fx}' y1='${fy}' x2='${tx}' y2='${ty}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
    
    }else if (line.kind == "Double"){
        // We mirror the line vector
        dy = -(tx - fx);
        dx = ty - fy;
        var len = Math.sqrt((dx * dx) + (dy * dy));
        dy = dy / len;
        dx = dx / len;
        var cstmOffSet = 1.4;

        str += `<line id='${line.id}-1' x1='${fx + (dx * strokewidth * 1.2) - cstmOffSet}' y1='${fy + (dy * strokewidth * 1.2) - cstmOffSet}' x2='${tx + (dx * strokewidth * 1.8) + cstmOffSet}' y2='${ty + (dy * strokewidth * 1.8) + cstmOffSet}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;

        str += `<line id='${line.id}-2' x1='${fx - (dx * strokewidth * 1.8) - cstmOffSet}' y1='${fy - (dy * strokewidth * 1.8) - cstmOffSet}' x2='${tx - (dx * strokewidth * 1.2) + cstmOffSet}' y2='${ty - (dy * strokewidth * 1.2) + cstmOffSet}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
    }

    if(contextLine.includes(line)){

        var x = (fx + tx) /2;
        var y = (fy + ty) /2;
        str += `<rect x="${x-(2 * zoomfact)}" y="${y-(2 * zoomfact)}" width='${4 * zoomfact}' height='${4 * zoomfact}' stroke="black" stroke-width="3"/>`;
    }

    // If the line got cardinality
    if(line.cardinality) {
        var toCardinalityX = tx;
        var toCardinalityY = ty;
        var fromCardinalityX = fx;
        var fromCardinalityY = fy;

        if (line.ctype == "BT"){
            toCardinalityX = tx + 10 * zoomfact;
            toCardinalityY = ty - 18 * zoomfact;
            fromCardinalityX = fx + 10 * zoomfact;
            fromCardinalityY = fy + 25 * zoomfact;
        }else if (line.ctype == "TB"){
            toCardinalityX = tx + 10 * zoomfact;
            toCardinalityY = ty + 18 * zoomfact;
            fromCardinalityX = fx + 10 * zoomfact;
            fromCardinalityY = fy - 18 * zoomfact;
        }else if (line.ctype == "RL"){
            toCardinalityX = tx - 18 * zoomfact;
            toCardinalityY = ty - 10 * zoomfact;
            fromCardinalityX = fx + 18 * zoomfact;
            fromCardinalityY = fy - 10 * zoomfact;
        }else if (line.ctype == "LR"){
            toCardinalityX = tx + 18 * zoomfact;
            toCardinalityY = ty - 10 * zoomfact;
            fromCardinalityX = fx - 25 * zoomfact;
            fromCardinalityY = fy - 10 * zoomfact;
        }
        // If the entity is on the from side
        if (findEntityFromLine(line) == -1){
            str += `<text style="font-size:${Math.round(zoomfact * textheight)}px;" x="${fromCardinalityX}" y="${fromCardinalityY}">${lineCardinalitys[line.cardinality]}</text>`
        }else {
            str += `<text style="font-size:${Math.round(zoomfact * textheight)}px;" x="${toCardinalityX}" y="${toCardinalityY}">${lineCardinalitys[line.cardinality]}</text> `
        }
    }
    return str;
}
/**
 * @description Removes all existing lines and draw them again
 * @param {String} str The string to add the created line elements to
 * @return String containing all the new lines-elements
 */
function redrawArrows(str)
{
    // Clear all lines and update with dom object dimensions
    for (var i = 0; i < data.length; i++){
        clearLinesForElement(data[i]);
    }

    // Make list of all connectors?
    connectors = [];

    for (var i = 0; i < lines.length; i++){
        determineLine(lines[i]);
    }

    // Determine lines before sorting associations
    if (ghostLine && ghostElement){
        clearLinesForElement(ghostElement);
        determineLine(ghostLine, true);
    }

    // Sort all association ends that number above 0 according to direction of line
    for (var i = 0; i < data.length; i++){
        sortElementAssociations(data[i]);
    }

    // Draw each line using sorted line ends when applicable
    for (var i = 0; i < lines.length; i++){
        str += drawLine(lines[i]);
    }

    if (ghostLine && ghostElement){
        str += drawLine(ghostLine, true);
    }
    return str;
}
/**
 * @description Adds nodes for resizing to an elements
 * @param {Object} element The target element to add nodes to.
 */
function addNodes(element) 
{
    var elementDiv = document.getElementById(element.id)
    var nodes = "";

    nodes += "<span class='node mr'></span>";
    nodes += "<span class='node ml'></span>";

    elementDiv.innerHTML += nodes;
}
/**
 * @description Remove all elements with the class "node"
 */
function removeNodes() 
{
    // Get all elements with the class: "node"
    var nodes = document.getElementsByClassName("node");

    // For every node remove it
    while(nodes.length > 0) {
        nodes[0].remove();
    }
    return str;
}

/**
 * @description Draw and updates the rulers, depending on the window size and current position in the diagram.
 */
function drawRulerBars(X,Y)
{
    //Get elements
    if(!isRulerActive) return;
    
    svgX = document.getElementById("ruler-x-svg");
    svgY = document.getElementById("ruler-y-svg");
    //Settings - Ruler
    const lineRatio = 10;
    const fullLineRatio = 10;
    var barY, barX = "";
    const color = "black";
    var cordY = 0;
    var cordX = 0;
    var ZF = 100 * zoomfact;
    var pannedY = (Y - ZF) / zoomfact;
    var pannedX = (X - ZF) / zoomfact;
    var zoomX = Math.round(((0 - zoomOrigo.x) * zoomfact) +  (1.0 / zoomfact));
    var zoomY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (1.0 / zoomfact));

    if(zoomfact < 0.5){
        var verticalText = "writing-mode= 'vertical-lr'";
    }else {
        var verticalText = " ";
    }
    
    //Draw the Y-axis ruler positive side.
    var lineNumber = (fullLineRatio - 1);
    for (i = 100 + zoomY; i <= pannedY -(pannedY *2) + cheight ; i += (lineRatio*zoomfact)) {
        lineNumber++;
         
        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' stroke='"+color+"' />";
            barY += "<text x='2' y='"+(pannedY+i+10)+"'style='font-size: 10px'>"+cordY+"</text>";
            cordY = cordY +100;
        }else if (zoomfact > 0.5){
            barY += "<line x1='25px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' stroke='"+color+"' />";
        } 
    }

    //Draw the Y-axis ruler negative side.
    lineNumber = (fullLineRatio - 11);
    cordY = -100;
    for (i = -100 - zoomY; i <= pannedY; i += (lineRatio*zoomfact)) {
        lineNumber++;
         
        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' stroke='"+color+"' />";
            barY += "<text x='2' y='"+(pannedY-i+10)+"' style='font-size: 10px'>"+cordY+"</text>";
            cordY = cordY -100;
        }else if (zoomfact > 0.5){
            barY += "<line x1='25px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' stroke='"+color+"' />";
        }
    }
    svgY.style.backgroundColor = "#e6e6e6";
    svgY.style.boxShadow ="3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis
    
    //Draw the X-axis ruler positive side.
    lineNumber = (fullLineRatio - 1);
    for (i = 51 + zoomX; i <= pannedX - (pannedX *2) + cwidth; i += (lineRatio*zoomfact)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            lineNumber = 0;
            barX += "<line x1='" +(i+pannedX)+"' y1='0' x2='" + (i+pannedX) + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(i+5+pannedX)+"'"+verticalText+"' y='15' style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX +100;
        }else if (zoomfact > 0.5){
            barX += "<line x1='" +(i+pannedX)+"' y1='25' x2='" +(i+pannedX)+"' y2='40px' stroke='" + color + "' />";
        }
    }

    //Draw the X-axis ruler negative side.
    lineNumber = (fullLineRatio - 11);
    cordX = -100;
    for (i = -51 - zoomX; i <= pannedX; i += (lineRatio*zoomfact)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            lineNumber = 0;
            barX += "<line x1='" +(pannedX-i)+"' y1='0' x2='" + (pannedX-i) + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(pannedX-i+5)+"'"+verticalText+"' y='15'style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX -100;
        }else if (zoomfact > 0.5){
            barX += "<line x1='" +(pannedX-i)+"' y1='25' x2='" +(pannedX-i)+"' y2='40px' stroke='" + color + "' />";
        }
    }
    svgX.style.boxShadow ="3px 3px 6px #5c5a5a";
    svgX.style.backgroundColor = "#e6e6e6";
    svgX.innerHTML = barX;//Print the generated ruler, for X-axis
}
/**
 * @description Construct an string containing all the elements for an data-object.
 * @param {Object} element The object that should be drawn.
 * @param {boolean} ghosted Is the element an ghost element.
 * @return Returns an string containing the elements that should be drawn.
 */
function drawElement(element, ghosted = false)
{
    var str = "";

    // Compute size variables
    var linew = Math.round(strokewidth * zoomfact);
    var boxw  = Math.round(element.width * zoomfact);
    var boxh  = Math.round(element.height * zoomfact);
    var texth = Math.round(zoomfact * textheight);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var hboxh = Math.round(element.height * zoomfact * 0.5);

    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext('2d');

    // Caclulate font width using some canvas magic
    var font = canvasContext.font;
    font = `${texth}px ${font.split('px')[1]}`;
    canvasContext.font = font;
    var textWidth = canvasContext.measureText(element.name).width;
    
    // If calculated size is larger than element width
    const margin = 10;
    var tooBig = (textWidth >= (boxw - (margin * 2)))
    var xAnchor = tooBig ? margin : hboxw;
    var vAlignment = tooBig ? "left" : "middle";

    // Create div & svg element
    str += `
				<div id='${element.id}'	class='element' onmousedown='ddown(event);' style='
						left:0px;
						top:0px;
						width:${boxw}px;
						height:${boxh}px;
						font-size:${texth}px;`;
    if (ghosted) {
        str += `
            pointer-events: none;
            opacity: ${ghostLine ? 0 : 0.5};
        `;
    }
    str += `'>`;
    str += `<svg width='${boxw}' height='${boxh}' >`;

    // Create svg 
    if (element.kind == "EREntity") {
        var weak = "";

        if(element.state == "weak") {
            weak = `<rect x='${linew * multioffs }' y='${linew * multioffs }' width='${boxw- (linew * multioffs * 2)}' height='${boxh - (linew * multioffs * 2)}'
            stroke-width='${linew}' stroke='black' fill='#ffccdc' /> 
            `;         
        }
        
        str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
                   stroke-width='${linew}' stroke='black' fill='#ffccdc' />
                   ${weak}
                   <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text> 
                   `;
    }
    else if (element.kind == "ERAttr") {
        var dash = "";
        var multi = "";

        if (element.state == "computed") {
            dash = "stroke-dasharray='4 4'";
        }
       
        if (element.state == "multiple") {
            multi = `
                    <path d="M${linew * multioffs},${hboxh} 
                    Q${linew * multioffs},${linew * multioffs} ${hboxw},${linew * multioffs} 
                    Q${boxw - (linew * multioffs)},${linew * multioffs} ${boxw - (linew * multioffs)},${hboxh} 
                    Q${boxw - (linew * multioffs)},${boxh - (linew * multioffs)} ${hboxw},${boxh - (linew * multioffs)} 
                    Q${linew * multioffs},${boxh - (linew * multioffs)} ${linew * multioffs},${hboxh}" 
                    stroke='black' fill='#ffccdc' stroke-width='${linew}' />`;
        }    

        str += `<path d="M${linew},${hboxh} 
                           Q${linew},${linew} ${hboxw},${linew} 
                           Q${boxw - linew},${linew} ${boxw - linew},${hboxh} 
                           Q${boxw - linew},${boxh - linew} ${hboxw},${boxh - linew} 
                           Q${linew},${boxh - linew} ${linew},${hboxh}" 
                    stroke='black' fill='#ffccdc' ${dash} stroke-width='${linew}' />
                    
                    ${multi}

                    <text x='${xAnchor}' y='${hboxh}' `;
        
        if(element.state == "key") {
            str += `class='underline'`;
        }             
        str += `dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>
        `;
            
        if(element.state == "weakKey") {
            // Calculates how far to the left X starts
            var diff = xAnchor - textWidth / 2;
            diff = diff < 0 ? 0 - diff + 10 : 0;
            str += `<line x1="${xAnchor - textWidth / 2 + diff}" y1="${hboxh + texth * 0.5 + 1}" x2="${xAnchor + textWidth / 2 + diff}" y2="${hboxh + texth * 0.5 + 1}" stroke="black" stroke-dasharray="5" stroke-width='2'/>`;
        }
        
    }
    else if (element.kind == "ERRelation") {
        var weak = "";
        if (element.state == "weak") {

            weak = `<polygon points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                stroke-width='${linew}' stroke='black' fill='#ffccdc'/>
                `;
        }
        str += `<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                   stroke-width='${linew}' stroke='black' fill='#ffccdc'/>
                   ${weak}
                   <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>
                   `;

    }
    str += "</svg>"
    str += "</div>";
    return str;
}
/**
 * @description Updates the elements translations and redraw lines.
 * @param {Interger} deltaX The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the X-axis.
 * @param {Interger} deltaY The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the Y-axis.
 */
function updatepos(deltaX, deltaY)
{
    updateCSSForAllElements();

    // Update svg backlayer -- place everyhing to draw OVER elements here
    var str = "";
    str = redrawArrows(str);
    document.getElementById("svgbacklayer").innerHTML=str;

    // Update svg overlay -- place everyhing to draw OVER elements here
    str = "";
    str = boxSelect_Draw(str);
    str = drawSelectionBox(str);
    document.getElementById("svgoverlay").innerHTML=str;

    // Updates nodes for resizing
    removeNodes();
    if (context.length === 1 && mouseMode == mouseModes.POINTER) addNodes(context[0]);


}
/**
 * @description Updates the variables for the size of the container-element.
 */
function updateContainerBounds()
{
    var containerbox = container.getBoundingClientRect();
    cwidth = containerbox.width;
    cheight = containerbox.height;
}
/**
 * @description Draw the box around the selected elements.
 * @param {String} str The string that the SVG-element is added to.
 * @return The populated string with the selection box rect.
 */
function drawSelectionBox(str)
{
    if (context.length != 0 || contextLine.length != 0) {
        var lowX;
        var highX;
        var lineLowX;
        var lineHighX;
        var x1;
        var x2;
        var lowY;
        var highY;
        var lineLowY;
        var lineHighY;
        var y1;
        var y2;
        if (context.length != 0) {
            lowX = context[0].x1;
            highX = context[0].x2;
            lowY = context[0].y1;
            highY = context[0].y2;
            for (var i = 0; i < context.length; i++) {
                x1 = context[i].x1;
                x2 = context[i].x2;
                y1 = context[i].y1;
                y2 = context[i].y2;
                if (x1 < lowX) lowX = x1;
                if (x2 > highX) highX = x2;
                if (y1 < lowY) lowY = y1;
                if (y2 > highY) highY = y2;
            }
        }
        var tempLines = [];
        if (contextLine.length > 0) {
            for (var i = 0; i < contextLine.length; i++) {
                if (contextLine[i].kind === lineKind.DOUBLE) {
                    tempLines.push(document.getElementById(contextLine[i].id + "-1"));
                    tempLines.push(document.getElementById(contextLine[i].id + "-2"));
                } else {
                    tempLines.push(document.getElementById(contextLine[i].id));
                }
            }

            // Find highest and lowest x and y coordinates of the first element in lines
            var tempX1 = tempLines[0].getAttribute("x1");
            var tempX2 = tempLines[0].getAttribute("x2");
            var tempY1 = tempLines[0].getAttribute("y1");
            var tempY2 = tempLines[0].getAttribute("y2");
            lineLowX = Math.min(tempX1, tempX2);
            lineHighX = Math.max(tempX1, tempX2);
            lineLowY = Math.min(tempY1, tempY2);
            lineHighY = Math.max(tempY1, tempY2);

            // Loop through all selected lines and find highest and lowest x and y coordinates
            for (var i = 0; i < tempLines.length; i++) {
                tempX1 = tempLines[i].getAttribute("x1");
                tempX2 = tempLines[i].getAttribute("x2");
                tempY1 = tempLines[i].getAttribute("y1");
                tempY2 = tempLines[i].getAttribute("y2");
                x1 = Math.min(tempX1, tempX2);
                x2 = Math.max(tempX1, tempX2);
                y1 = Math.min(tempY1, tempY2);
                y2 = Math.max(tempY1, tempY2);
                if (x1 < lineLowX) lineLowX = x1;
                if (x2 > lineHighX) lineHighX = x2;
                if (y1 < lineLowY) lineLowY = y1;
                if (y2 > lineHighY) lineHighY = y2;
            }

            // Compare between elements and lines to find lowest and highest x and y coordinates
            lowX = (lowX < lineLowX) ? lowX : lineLowX;
            highX = (highX > lineHighX) ? highX : lineHighX;
            lowY = (lowY < lineLowY) ? lowY : lineLowY;
            highY = (highY > lineHighY) ? highY : lineHighY;
        }

        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}'; style="fill:transparent;stroke-width:2;stroke:rgb(75,75,75);stroke-dasharray:10 5;" />`;
    }

    return str;
}
/**
 * @description Translate all elements to the correct coordinate
 */
function updateCSSForAllElements()
{
    function updateElementDivCSS(elementData, divObject, useDelta = false)
    {
        var left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact))),
            top = Math.round(((elementData.y - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta){
            left -= deltaX;
            top -= deltaY;
        }

        if (snapToGrid && useDelta) {
            if (elementData.id === targetElement.id) {
                // The element coordinates with snap point
                var objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact))) / gridSize) * gridSize;
                var objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / gridSize) * gridSize;

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round(((objY - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            } else if (ctrlPressed) {
                left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact))) + targetDelta.x;
                top = Math.round(((elementData.y - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact))) + targetDelta.y; 
            }
        }

        divObject.style.left = left + "px";
        divObject.style.top = top + "px";
    }

    // Update positions of all data elements based on the zoom level and view space coordinate
    for (var i = 0; i < data.length; i++) {
        // Element data from the array
        var element = data[i];

        // Element DIV (dom-object)
        var elementDiv = document.getElementById(element.id);

        // Only perform update on valid elements
        if (elementDiv != null) {
            // If the element was clicked and our mouse movement is not null
            var inContext = deltaX != null && findIndex(context, element.id) != -1;
            var useDelta = (inContext && movingObject);
            if (data[i].isLocked) useDelta = false;
            updateElementDivCSS(element, elementDiv, useDelta);

            // Handle colouring
            elementDiv.children[0].children[0].style.fill = inContext ? "#ff66b3" : "#ffccdc";
        }
    }

    // Also update ghost if there is one
    if (ghostElement) {
        var ghostDiv = document.getElementById(ghostElement.id);
        
        if (ghostDiv){
            updateElementDivCSS(ghostElement, ghostDiv)
        }
    }
}
/**
 * @description Redraw all elements and lines
 */
function showdata()
{
    updateContainerBounds();

    var str = "";
    var courses = [];

    // Iterate over programs
    for (var i = 0; i < data.length; i++) {
        str += drawElement(data[i]);
    }

    if (ghostElement) {
        str += drawElement(ghostElement, true);
    }

    container.innerHTML = str;
    updatepos(null, null);

}
//#endregion =====================================================================================
