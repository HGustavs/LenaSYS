//------------------------------------=======############==========----------------------------------------
//                                          Class Definitions
//------------------------------------=======############==========----------------------------------------

class Point {
    x = 0;
    y = 0;

    /**
     * 
     * @param {number} startX 
     * @param {number} startY 
     */
    constructor(startX = 0, startY = 0)
    {
        this.x = startX;
        this.y = startY;
    }

    /**
     * 
     * @param {Point} other 
     */
    add(other)
    {
        this.x += other.x;
        this.y += other.y;
    }
};

class StateChange {
    /**
     * flag: number of 2nd base used to set multiple flags at once.
     * isSoft: If the change type is something that wishes to overwrite the previous change.
     * canAppendTo: If the change can be overwritten by another change.
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
     * @type String
     */
    name;
    
    /**
     * @type Point
     */
    moved;
    
    /**
     * @type Point
     */
    resized;

    /**
     * @type number
     */
    timestamp;

    /**
     * Used by certain state changes to pass their own specific data
     * that can be used when decoding the history log using the hange flags.
     * 
     * This should stay as an object where properties are set as arguments/values,
     * which lets us use it as an map when reading the values later!
     * 
     * @type {Object}
     */
    valuesPassed;

    /**
     * 
     * @param {Object} changeType What flags this change has.
     * @param {Array<String>} id_list Array of all ID's that are affected by the change. This helps with concatting changes more compactly.
     * @param {Object} passed_values Argument map containing all specific values that the state change require. Pass it as an object with properties as the variables!
     * @see {StateChange.ChangeTypes} for available flags.
     */
    constructor(changeType, id_list, passed_values = {})
    {
        this.changeTypes = [changeType];
        this.timestamp = new Date().getTime();
        this.valuesPassed = passed_values;

        /**
         * @type Array<String>
         */
        this.id_list = id_list;
    }

    getFlags()
    {
        var flags = 0;

        for (var index = 0; index <  this.changeTypes.length; index++) {
            var change = this.changeTypes[index];
            flags = flags | change.flag;
        }

        return flags;
    }

    /**
     * Returns true if this change contains the requested flag.
     * @param {number} flag 
     * @returns {boolean}
     */
    hasFlag(flag)
    {
        var allFlags = this.getFlags();
        var AND = flag & allFlags;

        return (AND === flag);
    }

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
     * 
     * @param {StateChange} changes 
     */
    appendValuesFrom(changes)
    {
        if (changes.name) {
            this.name = changes.name;
        }

        if (changes.moved) {
            if (this.moved) {
                this.moved.add(changes.moved);
            } else { 
                this.moved = changes;
            }
        }

        if (changes.resized) {
            if (this.resized) {
                this.resized.add(changes.resized);
            } else {
                this.resized = changes.resized;
            }
        }

        if (changes.timestamp < this.timestamp) {
            this.timestamp = changes.timestamp;
        }
        
        /** @type number */
        this.changeTypes.flag = this.changeTypes.flag | changes.changeTypes.flag;
    }
}

class StateChangeFactory
{
    static ElementCreated(element)
    {
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_CREATED, [element.id]);
        state.name = element.name;
        state.moved = new Point(element.x, element.y);
        state.resized = new Point(element.width, element.height);

        return state;
    }

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

    static ElementsMoved(elementIDs, moveX, moveY)
    {
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_MOVED, elementIDs);
        state.moved = new Point(moveX, moveY);

        return state;
    }

    static ElementResized(elementIDs, changeX, changeY)
    {
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_RESIZED, elementIDs);
        state.resized = new Point(changeX, changeY);

        return state;
    }

    static ElementMovedAndResized(elementIDs, moveX, moveY, changeX, changeY)
    {
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED, elementIDs);
        state.moved = new Point(moveX, moveY);
        state.resized = new Point(changeX, changeY);

        return state;
    }

    static ElementAttributesChanged(elementID, changeList)
    {       
        var state = new StateChange(StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED, [elementID]);

        // Handle special values that should not be passed, but rather used instantly.
        if (changeList.name) {
            state.name = changeList.name;
            delete changeList.name;
        }

        // Pass forward values
        state.setValues(changeList);
        return state;
    }

    /**
     * @param {*} line 
     * @returns 
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
     * 
     * @param {Array<object>} lines 
     * @returns 
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

class StateMachine
{
    constructor (initialData, initialLines)
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
            data: Array.from(initialData),
            lines: Array.from(initialLines)
        }
    }

    /**
     * Stores the passed state change into the state machine.
     * If the change is hard it will be pushed onto the history log,
     * while a soft§ change will simply modify the last history entry.
     * 
     * @param {StateChange} stateChange State change generated by the StateChangedFactory.
     * @see StateChangeFactory
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

    stepBack () 
    {
        if (this.historyLog.length > 0) {

            var lastChange = this.historyLog.pop();

            // ------ Test each flag and step back per flag options ------

            // Attribute Changed
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED.flag)) {
                if (lastChange.name) {

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
                        element.x -= lastChange.moved.x;
                        element.y -= lastChange.moved.y;
                    }
                }
            }

            // Element resized
            if (lastChange.hasFlag(StateChange.ChangeTypes.ELEMENT_RESIZED.flag)) {

                var element = data[findIndex(data, lastChange.id_list[0])];

                if (element) {
                    element.width -= lastChange.resized.x;
                    element.height -= lastChange.resized.y;
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
            data = Array.from(this.initialState.data);
            lines = Array.from(this.initialState.lines);
        }

        showdata();
        updatepos(0, 0);
    }
};

//------------------------------------=======############==========----------------------------------------
//                           Defaults, mouse variables and zoom variables
//------------------------------------=======############==========----------------------------------------

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
const keybinds = {
        LEFT_CONTROL: {key: "Control", ctrl: false},
        ALT: {key: "Alt", ctrl: false},
        META: {key: "Meta", ctrl: false},
        HISTORY_STEPBACK: {key: "z", ctrl: true},
        DELETE: {key: "Delete", ctrl: false},
        ESCAPE: {key: "Escape", ctrl: false},
        BOX_SELECTION: {key: "b", ctrl: false},
        POINTER: {key: "h", ctrl: false},
        EDGE_CREATION: {key: "d", ctrl: false},
        PLACE_ENTITY: {key: "e", ctrl: false},
        PLACE_RELATION: {key: "r", ctrl: false},
        PLACE_ATTRIBUTE: {key: "a", ctrl: false},
        ZOOM_IN: {key: "+", ctrl: true},
        ZOOM_OUT: {key: "-", ctrl: true},
        TOGGLE_GRID: {key: "g", ctrl: false},
        TOGGLE_RULER: {key: "t", ctrl: false},
        OPTIONS: {key: "o", ctrl: false},
        ENTER: {key: "Enter", ctrl: false},
        COPY: {key: "c", ctrl: true},
        PASTE: {key: "v", ctrl: true},
        SELECT_ALL: {key: "a", ctrl: true}
};

// Zoom variables
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;

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

// Arrow drawing stuff - diagram elements and diagram lines
var lines = [];
var elements = [];

// Currently clicked object list
var context = [];
var previousContext = [];
var contextLine = []; // Contains the currently selected line(s).
var deltaExceeded = false;
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
const mouseModes = {
    POINTER: 0,
    BOX_SELECTION: 1,
    PLACING_ELEMENT: 2,
    EDGE_CREATION: 3,
};
var mouseMode = mouseModes.POINTER;
var previousMouseMode;

// All different element types that can be placed by the user.
const elementTypes = {
    ENTITY: 0,
    RELATION: 1,
    ATTRIBUTE: 2,
    GHOSTENTITY: 3
};
var elementTypeSelected = elementTypes.ENTITY;

const pointerStates = {
    DEFAULT: 0,
    CLICKED_CONTAINER: 1,
    CLICKED_ELEMENT: 2,
    CLICKED_NODE: 3,
};
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;
var isRulerActive = true;

var randomidArray = []; // array for checking randomID
var errorMsgMap = {};

const messageTypes = {
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
};
//-------------------------------------------------------------------------------------------------
// makeRandomID - Random hex number
//-------------------------------------------------------------------------------------------------

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

// Example entities and attributes
var PersonID = makeRandomID();
var IDID = makeRandomID();
var NameID = makeRandomID();
var SizeID = makeRandomID();
var HasID = makeRandomID();
var CarID = makeRandomID();
var FNID = makeRandomID();
var LNID = makeRandomID();
var LoanID = makeRandomID();
var RefID = makeRandomID();

// Save default to model - updating defaults sets property to all of model
var defaults = {
    defaultERtentity: { kind: "EREntity", fill: "White", Stroke: "Black", width: 200, height: 50 },
    defaultERrelation: { kind: "ERRelation", fill: "White", Stroke: "Black", width: 60, height: 60 },
    defaultERattr: { kind: "ERAttr", fill: "White", Stroke: "Black", width: 90, height: 45 },
    defaultGhost: { kind: "ERAttr", fill: "White", Stroke: "Black", width: 5, height: 5 }
}

// States used for ER-elements 
const attrState = {
    NORMAL: "normal",
    MULTIPLE: "multiple",
    KEY: "key",
    COMPUTED: "computed",
};
const entityState = {
    NORMAL: "normal",
    WEAK: "weak",

};
const relationState = {
    NORMAL: "normal",
    WEAK: "weak",
};

const lineKind = {
    NORMAL: "Normal",
    DOUBLE: "Double"
};

// Demo data - read / write from service later on
var data = [
    { name: "Person", x: 100, y: 100, width: 200, height: 50, kind: "EREntity", id: PersonID },
    { name: "Loan", x: 140, y: 250, width: 200, height: 50, kind: "EREntity", id: LoanID, state: "weak" },
    { name: "Car", x: 500, y: 140, width: 200, height: 50, kind: "EREntity", id: CarID },
    { name: "Owns", x: 420, y: 60, width: 60, height: 60, kind: "ERRelation", id: HasID },
    { name: "Refer", x: 460, y: 260, width: 60, height: 60, kind: "ERRelation", id: RefID, state: "weak" },
    { name: "ID", x: 30, y: 30, width: 90, height: 40, kind: "ERAttr", id: IDID, state: "computed" },
    { name: "Name", x: 170, y: 50, width: 90, height: 45, kind: "ERAttr", id: NameID },
    { name: "Size", x: 560, y: 40, width: 90, height: 45, kind: "ERAttr", id: SizeID, state: "multiple" },
    { name: "F Name", x: 120, y: -20, width: 90, height: 45, kind: "ERAttr", id: FNID },
    { name: "L Name", x: 230, y: -20, width: 90, height: 45, kind: "ERAttr", id: LNID },
];

// Ghost element is used for placing new elements. DO NOT PLACE GHOST ELEMENTS IN DATA ARRAY UNTILL IT IS PRESSED!
var ghostElement = null;
var ghostLine = null;

var lines = [
    { id: makeRandomID(), fromID: PersonID, toID: IDID, kind: "Normal" },
    { id: makeRandomID(), fromID: PersonID, toID: NameID, kind: "Normal" },
    { id: makeRandomID(), fromID: CarID, toID: SizeID, kind: "Normal" },

    { id: makeRandomID(), fromID: PersonID, toID: HasID, kind: "Normal" },
    { id: makeRandomID(), fromID: HasID, toID: CarID, kind: "Double" },
    { id: makeRandomID(), fromID: NameID, toID: FNID, kind: "Normal" },
    { id: makeRandomID(), fromID: NameID, toID: LNID, kind: "Normal" },

    { id: makeRandomID(), fromID: LoanID, toID: RefID, kind: "Normal" },
    { id: makeRandomID(), fromID: CarID, toID: RefID, kind: "Normal" },
];

const stateMachine = new StateMachine(data, lines);

//------------------------------------=======############==========----------------------------------------
//                                        Getters and Setters
//------------------------------------=======############==========----------------------------------------
// Adds object to the dataArray
function addObjectToData(object, stateMachineShouldSave = true)
{
    data.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementCreated(object));
}

// Return all lines
function getLines()
{
    return lines;
}
//------------------------------------=======############==========----------------------------------------
//                                        Key event listeners
//------------------------------------=======############==========----------------------------------------
document.addEventListener('keydown', function (e)
{
    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
       
        if (e.key == keybinds.LEFT_CONTROL.key && ctrlPressed !== true) ctrlPressed = true;
        if (e.key == keybinds.ALT.key && altPressed !== true) altPressed = true;
        if (e.key == keybinds.DELETE.key && e.ctrlKey == keybinds.DELETE.ctrl) {
            if (contextLine.length > 0) removeLines(contextLine);
            if (context.length > 0) removeElements(context);

            updateSelection();
        }
        if (e.key == keybinds.META.key && ctrlPressed !== true) ctrlPressed = true;
        if (e.key == keybinds.ZOOM_IN.key && e.ctrlKey == keybinds.ZOOM_IN.ctrl) zoomin(); // Works but interferes with browser zoom
        if (e.key == keybinds.ZOOM_OUT.key && e.ctrlKey == keybinds.ZOOM_OUT.ctrl) zoomout(); // Works but interferes with browser zoom
        if (e.key == keybinds.ESCAPE.key && escPressed != true) {
            escPressed = true;
            clearContext();
            setMouseMode(mouseModes.POINTER);
            clearContextLine();
            movingObject = false;

            if (movingContainer) {
                scrollx = sscrollx;
                scrolly = sscrolly;
            }
            ghostLine = null;
            ghostElement = null;
            pointerState = pointerStates.DEFAULT;
            showdata();
        }

        if (e.key == "Backspace" && (context.length > 0 || contextLine.length > 0) && !propFieldState) {
            removeElements(context); 
            removeLines(contextLine);
            updateSelection();
        }

        if (e.key == keybinds.SELECT_ALL.key && e.ctrlKey == keybinds.SELECT_ALL.ctrl){
            e.preventDefault();
            selectAll();
        }
       
    }
    // If the active element in DOM is an "INPUT" "SELECT" "TEXTAREA"
    if ( /INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        if (e.key == keybinds.ENTER.key && e.ctrlKey == keybinds.ENTER.ctrl) {
            changeState();
            saveProperties();
        }
    }
});

document.addEventListener('keyup', function (e)
{
    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        
        var pressedKey = e.key.toLowerCase();

        //  TODO : Switch cases?
        if (e.key == keybinds.LEFT_CONTROL.key) ctrlPressed = false;
        if (e.key == keybinds.ALT.key) altPressed = false;
        if (e.key == keybinds.META.key) ctrlPressed = false;

        if (e.key == keybinds.ESCAPE.key && e.ctrlKey == keybinds.ESCAPE.ctrl) {
            escPressed = false;
        }
        if (pressedKey == keybinds.HISTORY_STEPBACK.key && e.ctrlKey == keybinds.HISTORY_STEPBACK.ctrl) {
            stateMachine.stepBack();
        }

        if (pressedKey == keybinds.BOX_SELECTION.key && e.ctrlKey == keybinds.BOX_SELECTION.ctrl) {
            setMouseMode(mouseModes.BOX_SELECTION);
        }
        if (pressedKey == keybinds.POINTER.key && e.ctrlKey == keybinds.POINTER.ctrl) {
            setMouseMode(mouseModes.POINTER);
        }
        if (pressedKey == keybinds.EDGE_CREATION.key && e.ctrlKey == keybinds.EDGE_CREATION.ctrl) {
            setMouseMode(mouseModes.EDGE_CREATION);
            clearContext();
        }
        if (pressedKey == keybinds.PLACE_ENTITY.key && e.ctrlKey == keybinds.PLACE_ENTITY.ctrl) {
            setElementPlacementType(elementTypes.ENTITY);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        if (pressedKey== keybinds.PLACE_RELATION.key && e.ctrlKey == keybinds.PLACE_RELATION.ctrl) {
            setElementPlacementType(elementTypes.RELATION);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        if (pressedKey== keybinds.PLACE_ATTRIBUTE.key && e.ctrlKey == keybinds.PLACE_ATTRIBUTE.ctrl) {
            setElementPlacementType(elementTypes.ATTRIBUTE);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        if (pressedKey == keybinds.TOGGLE_GRID.key && e.ctrlKey == keybinds.TOGGLE_GRID.ctrl) {
            toggleGrid();
        }
        if (pressedKey == keybinds.TOGGLE_RULER.key && e.ctrlKey == keybinds.TOGGLE_RULER.ctrl) {
            toggleRuler();
        }
        if (pressedKey == keybinds.OPTIONS.key && e.ctrlKey == keybinds.OPTIONS.ctrl) {
            fab_action();
        }
        if (pressedKey == keybinds.COPY.key && e.ctrlKey == keybinds.COPY.ctrl){
            clipboard = context;
            if (clipboard.length !== 0){
                displayMessage(messageTypes.SUCCESS, `You have copied ${clipboard.length} elements and it's inner connected lines.`)
            }else {
                displayMessage(messageTypes.SUCCESS, `Clipboard cleared.`)
            }
        }
        if (pressedKey == keybinds.PASTE.key && e.ctrlKey == keybinds.PASTE.ctrl){
            pasteClipboard(clipboard)
        }
    }
});

window.addEventListener("resize", () => {
    updateContainerBounds();
    drawRulerBars();
});

window.onfocus = function()
{
    altPressed=false;
}

//------------------------------------=======############==========----------------------------------------
//                              Coordinate-Screen Position Conversion
//------------------------------------=======############==========----------------------------------------

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

    return {
        x: Math.round(
            ((mouseX - 0) / zoomfact - scrollx) + zoomX * scrollx + 2 // the 2 makes mouse hover over container
        ),
        y: Math.round(
            ((mouseY - 0) / zoomfact - scrolly) + zoomX * scrolly
        ),
    };
}

// TODO : This is still the old version, needs update
function diagramToScreenPosition(coordX, coordY)
{
    return {
        x: Math.round((coordX + scrollx) / zoomfact + 0),
        y: Math.round((coordY + scrolly) / zoomfact + 0),
    };
}

//------------------------------------=======############==========----------------------------------------
//                                           Mouse events
//------------------------------------=======############==========----------------------------------------

function mwheel(event)
{
    if(event.deltaY < 0) {
        zoomin();
    } else {
        zoomout();
    }
}

function mdown(event)
{
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
    // Used when clicking on a line between two elements.
    updateSelectedLine(determineLineSelect(event.clientX, event.clientY));
}

function ddown(event)
{
    switch (mouseMode) {
        case mouseModes.POINTER:
        case mouseModes.BOX_SELECTION:
        case mouseModes.PLACING_ELEMENT:
            startX = event.clientX;
            startY = event.clientY;

            if (!altPressed) {
                pointerState = pointerStates.CLICKED_ELEMENT;
            }

        case mouseModes.EDGE_CREATION:
            var element = data[findIndex(data, event.currentTarget.id)];
            if (element != null && !context.includes(element) || !ctrlPressed){
                updateSelection(element);
            }
            break;
            
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in ddown()!`);
            break;
    }
}

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

function mup(event)
{
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
                }
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
                        eventElementId = event.target.parentElement.parentElement.id;
                        setPos(item.id, deltaX, deltaY);

                        if (deltaX > 0 || deltaX < 0 || deltaY > 0 || deltaY < 0)
                            id_list.push(item.id);
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
    drawRulerBars();

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
}

function determineLineSelect(mouseX, mouseY)
{
    // This func is used when determining which line is clicked on.

    // TODO: Add functionality to make sure we are only getting LINES from svgbacklayer in the future !!!!!.

    var allLines = document.getElementById("svgbacklayer").children;
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
        // Make sure that "double lines" have the same id.
        allLines[i].id = allLines[i].id.replace(/-1/gi, '');
        allLines[i].id = allLines[i].id.replace(/-2/gi, '');
  
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
                return line.id == allLines[i].id;
            })[0];
            //return allLines[i];
        }
    }
    return null;
}

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

function mouseMode_onMouseMove(event)
{
     switch (mouseMode) {
        case mouseModes.EDGE_CREATION:
        case mouseModes.PLACING_ELEMENT:
            if (ghostElement) {
                var cords = screenToDiagramCoordinates(event.clientX, event.clientY);
                ghostElement.x = cords.x - (ghostElement.width / 2);
                ghostElement.y = cords.y - (ghostElement.height / 2);
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
            // Update scroll position
            updatepos(null, null);

            // Update the ruler
            drawRulerBars();

            // Remember that mouse has moved out of starting bounds
            if ((deltaX >= maxDeltaBeforeExceeded || deltaX <= -maxDeltaBeforeExceeded) || (deltaY >= maxDeltaBeforeExceeded || 
                deltaY <= -maxDeltaBeforeExceeded)) {
                deltaExceeded = true;
            }
            break;

        case pointerStates.CLICKED_ELEMENT:
            // Moving object
            movingObject = true;
            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;

            // We update position of connected objects
            updatepos(deltaX, deltaY);

            // Remember that mouse has moved out of starting bounds
            if ((deltaX >= maxDeltaBeforeExceeded || deltaX <= -maxDeltaBeforeExceeded) || (deltaY >= maxDeltaBeforeExceeded ||
                deltaY <= -maxDeltaBeforeExceeded)) {
                deltaExceeded = true;
            }
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

//------------------------------------=======############==========----------------------------------------
//                                         Helper functions
//------------------------------------=======############==========----------------------------------------

// Returns TRUE if an enum contains the tested value
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

function getPoint (x,y)
{
    return {
        x: x,
        y: y
    };
}

function getRectFromPoints(p1, p2)
{
    return {
        x: p1.x,
        y: p1.y,
        width: p2.x - p1.x,
        height: p2.y - p1.y,
    };
}

function getRectFromElement (element)
{
    return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
    };
}

function rectsIntersect (left, right)
{
    // If the two rects touch each other, returns true otherwise false.
    //return ((left.X + left.Width >= right.X) &&
    //        (left.X <= right.X + right.Width) &&
    //        (left.Y + left.Height >= right.Y) &&
    //        (left.Y <= right.Y + right.Height));

    return (
        (left.x + left.width >= right.x) && 
        (left.x <= right.x + right.width) &&
        (left.y + left.height >= right.y) &&
        (left.y <= right.y + right.height)
    );
}

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

//------------------------------------=======############==========----------------------------------------
//                                           Mouse Modes
//------------------------------------=======############==========----------------------------------------

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

function setCursorStyles(cursorMode = 0)
{
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

//Function to enable or disable backgroundgrid.
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
    drawRulerBars();
}

function setElementPlacementType(type = 0)
{
    elementTypeSelected = type;
}

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
}

//------------------------------------=======############==========----------------------------------------
//                                       Box Select functions
//------------------------------------=======############==========----------------------------------------

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
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && pointerState == pointerStates.DEFAULT) {
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

//------------------------------------=======############==========----------------------------------------
//                                           Zoom handling
//------------------------------------=======############==========----------------------------------------

//-------------------------------------------------------------------------------------------------
// zoomin/out - functions for updating the zoom factor and scroll positions
//-------------------------------------------------------------------------------------------------

function zoomin()
{
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

    updateGridSize();

    // Update scroll position - missing code for determining that center of screen should remain at nevw zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars();
}

function zoomout()
{
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
    // Update scroll position - missing code for determining that center of screen should remain at new zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars();
}

//-------------------------------------------------------------------------------------------------
// findIndex - Returns index of object with certain ID
//-------------------------------------------------------------------------------------------------

function findIndex(arr, id)
{
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

//-------------------------------------------------------------------------------------------------
// Finds and sets an element's position
//-------------------------------------------------------------------------------------------------
function setPos(id, x, y)
{
    foundId = findIndex(data, id);
    if (foundId != -1) {
        data[foundId].x -= (x / zoomfact);
        data[foundId].y -= (y / zoomfact);
    }
}

//-------------------------------------------------------------------------------------------------
// Showdata iterates over all diagram elements
//-------------------------------------------------------------------------------------------------

// Generate all courses at appropriate zoom level
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
//-------------------------------------------------------------------------------------------------
// addLine - Adds an new line if the requirements and rules are achieved
//-------------------------------------------------------------------------------------------------
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true){
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

            // Adds the line
            lines.push(newLine);

            // Save changes into state machine
            if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.LineAdded(newLine));
            return newLine;
            
        } else {
            displayMessage(messageTypes.ERROR,"Maximum amount of lines between: " + context[0].name + " and " + context[1].name);
        }
    } else {
        displayMessage(messageTypes.ERROR, "Not possible to draw a line between two: " + context[0].kind);
    }
}

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
            <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text> 
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


//-------------------------------------------------------------------------------------------------
// updateselection - Update context according to selection parameters or clicked element
//-------------------------------------------------------------------------------------------------
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
        // Element not already in context
        if (!contextLine.includes(selectedLine) && contextLine.length < 1) {
            contextLine.push(selectedLine);
        } else {
            contextLine = [];
            contextLine.push(selectedLine);
        }
    } else if (!altPressed && !ctrlPressed) {
        contextLine = [];
    }
    generateContextProperties();
}

function updateSelection(ctxelement)
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

function selectAll()
{   
    context = data;
    contextLine = lines;
    showdata();
}

//-------------------------------------------------------------------------------------------------
// updatepos - Update positions of all elements based on the zoom level and view space coordinate
//-------------------------------------------------------------------------------------------------

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

    document.getElementById("svgoverlay").innerHTML=str;

    // Updates nodes for resizing
    removeNodes();
    if (context.length === 1 && mouseMode == mouseModes.POINTER) addNodes(context[0]);

    str = drawSelectionBox(str);
    document.getElementById("svgoverlay").innerHTML = str;

}

function updateContainerBounds()
{
    var containerbox = container.getBoundingClientRect();
    cwidth = containerbox.width;
    cheight = containerbox.height;
}

function drawSelectionBox(str)
{
    if (context.length != 0) {
        var lowX = context[0].x1;
        var highX = context[0].x2;
        var x1;
        var x2;
        var lowY = context[0].y1;
        var highY = context[0].y2;
        var y1;
        var y2;
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

        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}'; style="fill:transparent;stroke-width:2;stroke:rgb(75,75,75);stroke-dasharray:10 5;" />`;
    }

    return str;
}

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
                    propsChanged[propName] = value;
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

function changeState() 
{
    var property = document.getElementById("propertySelect").value;
    var element = context[0];
    element.state = property;
}

function changeLineKind()
{
    var property = document.getElementById("propertySelect").value;
    var line = contextLine[0];
    line.kind = property;
    showdata();
}

function propFieldSelected(isSelected)
{
    propFieldState = isSelected;
}

function generateContextProperties()
{
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
        str+=`<br><br><input type="submit" value="Save" class='saveButton' onclick="changeState();saveProperties();displayMessage(messageTypes.SUCCESS, 'Successfully saved')">`;

    } 

    // Creates drop down for changing the kind attribute on the selected line.
    if (contextLine.length == 1 && context.length == 0) {
        str = "<legend>Properties</legend>";
        
        var value;
        var selected = contextLine[0].kind;
        if(selected == undefined) selected = normal;
        
        value = Object.values(lineKind);
        
        str += '<select id="propertySelect">';
        for(var i = 0; i < value.length; i++){
            if(selected == value[i]){
                str += `<option selected="selected" value='${value[i]}'>${value[i]}</option>`;
            }else {
                str += `<option value='${value[i]}'> ${value[i]}</option>`;   
            }
        }
        str += '</select>';
        str+=`<br><br><input type="submit" value="Save" onclick="changeLineKind();">`;
    }

    if ((context.length > 1 || contextLine.length > 1) || (context.length == 1 && contextLine.length == 1)) {
        str += "<p>Pick only ONE element!</p>";
    }

    propSet.innerHTML = str;
}

function updateCSSForAllElements()
{
    function updateElementDivCSS(elementData, divObject, useDelta = false)
    {
        var left = Math.round((elementData.x * zoomfact) + (scrollx * (1.0 / zoomfact))),
            top = Math.round((elementData.y * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta) {
            left -= deltaX;
            top -= deltaY;
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

function linetest(x1, y1, x2, y2, x3, y3, x4, y4)
{
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

//-------------------------------------------------------------------------------------------------
// sortvectors - Uses steering vectors as a sorting criteria for lines
//-------------------------------------------------------------------------------------------------

function sortvectors(a, b, ends, elementid, axis)
{
    // Get dx dy centered on association end e.g. invert vector if necessary
    var lineA = (ghostLine && a === ghostLine.id) ? ghostLine : lines[findIndex(lines, a)];
    var lineB = (ghostLine && b === ghostLine.id) ? ghostLine : lines[findIndex(lines, b)];
    var parent = data[findIndex(data, elementid)];

    // Retrieve opposite element - assume element center (for now)
     if (lineA.fromID == elementid){
        toElementA = (lineA == ghostLine) ? ghostElement : data[findIndex(data, lineA.toID)];
    } else {
        toElementA = data[findIndex(data, lineA.fromID)];
    }

    if (lineB.fromID == elementid){
        toElementB = (lineB == ghostLine) ? ghostElement : data[findIndex(data, lineB.toID)];
    } else {
        toElementB = data[findIndex(data, lineB.fromID)];
    }

    // If lines cross swap otherwise keep as is
    if (axis == 0 || axis == 1) {
        // Left side
        ay = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        by = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 0) parentx = parent.x1
        else parentx = parent.x2;

        if (linetest(toElementA.cx, toElementA.cy, parentx, ay, toElementB.cx, toElementB.cy, parentx, by) === false) return -1

    } else if (axis == 2 || axis == 3) {
        // Top / Bottom side
        ax = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        bx = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 2) parenty = parent.y1
        else parenty = parent.y2;

        if (linetest(toElementA.cx, toElementA.cy, ax, parenty, toElementB.cx, toElementB.cy, bx, parenty) === false) return -1
    }

    return 1;
}

//-------------------------------------------------------------------------------------------------
// redrawArrows - Redraws arrows based on rprogram and rcourse variables
//-------------------------------------------------------------------------------------------------

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

function sortElementAssociations(element)
{
    // Only sort if size of list is >= 2
    if (element.top.length > 1) element.top.sort(function (a, b) { return sortvectors(a, b, element.top, element.id, 2) });
    if (element.bottom.length > 1) element.bottom.sort(function (a, b) { return sortvectors(a, b, element.bottom, element.id, 3) });
    if (element.left.length > 1) element.left.sort(function (a, b) { return sortvectors(a, b, element.left, element.id, 0) });
    if (element.right.length > 1) element.right.sort(function (a, b) { return sortvectors(a, b, element.right, element.id, 1) });
}

function drawLine(line, targetGhost = false)
{
    var felem, telem, dx, dy;
    var str = "";
    var lineColor = '#f44';
    if(contextLine.includes(line)){
        lineColor = '#00ff00';
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
        str += `<line id='${line.id}' x1='${fx}' y1='${fy}' x2='${tx}' y2='${ty}' stroke='${lineColor}' stroke-width='${strokewidth}' />`;
    }else if (line.kind == "Double"){
        // We mirror the line vector
        dy = -(tx - fx);
        dx = ty - fy;
        var len = Math.sqrt((dx * dx) + (dy * dy));
        dy = dy / len;
        dx = dx / len;
        var cstmOffSet = 1.4;

        str += `<line id='${line.id}-1' x1='${fx + (dx * strokewidth * 1.2) - cstmOffSet}' y1='${fy + (dy * strokewidth * 1.2) - cstmOffSet}' x2='${tx + (dx * strokewidth * 1.8) + cstmOffSet}' y2='${ty + (dy * strokewidth * 1.8) + cstmOffSet}' stroke='${lineColor}' stroke-width='${strokewidth}' />`;

        str += `<line id='${line.id}-2' x1='${fx - (dx * strokewidth * 1.8) - cstmOffSet}' y1='${fy - (dy * strokewidth * 1.8) - cstmOffSet}' x2='${tx - (dx * strokewidth * 1.2) + cstmOffSet}' y2='${ty - (dy * strokewidth * 1.2) + cstmOffSet}' stroke='${lineColor}' stroke-width='${strokewidth}' />`;
    }

    return str;
}

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

function addNodes(element) 
{
    var elementDiv = document.getElementById(element.id)
    var nodes = "";

    nodes += "<span class='node mr'></span>";
    nodes += "<span class='node ml'></span>";

    elementDiv.innerHTML += nodes;
}

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
//-------------------------------------------------------------------------------------------------
// Change the position of rulerPointers
//-------------------------------------------------------------------------------------------------
function setRulerPosition(x, y) 
{
    document.getElementById("ruler-x").style.left = x - 51 + "px";
    document.getElementById("ruler-y").style.top = y + "px";
}

//-------------------------------------------------------------------------------------------------
// Draws the rulers
//-------------------------------------------------------------------------------------------------
function drawRulerBars()
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

 
    //Draw the Y-axis ruler.
    var lineNumber = (fullLineRatio - 1);
    for (i = 40;i <= cheight; i += lineRatio) {
        lineNumber++;

        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            var cordY = screenToDiagramCoordinates(0, i).y;
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(i)+"' x2='40px' y2='"+i+"' stroke='"+color+"' />";
            barY += "<text x='2' y='"+(i+10)+"' style='font-size: 10px'>"+cordY+"</text>";
        }
        else barY += "<line x1='25px' y1='"+i+"' x2='40px' y2='"+i+"' stroke='"+color+"' />";
    }
    svgY.style.backgroundColor = "#e6e6e6";
    svgY.style.boxShadow ="3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis

    //Draw the X-axis ruler.
    lineNumber = (fullLineRatio - 1);
    for (i = 40;i <= cwidth; i += lineRatio) {
        lineNumber++;

        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            var cordX = screenToDiagramCoordinates(50 + i, 0).x;
            lineNumber = 0;
            barX += "<line x1='" +i+"' y1='0' x2='" + i + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(i+5)+"' y='15' style='font-size: 10px'>"+cordX+"</text>";
        }
        else barX += "<line x1='" +i+"' y1='25' x2='" +i+"' y2='40px' stroke='" + color + "' />";
    }
    svgX.style.boxShadow ="3px 3px 6px #5c5a5a";
    svgX.style.backgroundColor = "#e6e6e6";
    svgX.innerHTML = barX;//Print the generated ruler, for X-axis
}

//Function to remove elemets and lines
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
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementsDeleted(elementArray));

    clearContext();
    redrawArrows();
    showdata();
}

//Function to remove selected lines
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
//-------------------------------------------------------------------------------------------------
// Create and display an message in the diagram
//-------------------------------------------------------------------------------------------------
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
            addLine(data[findIndex(data, line.fromID)], data[findIndex(data, line.toID)], line.kind, false)
        );
    });

    // Save the copyed elements to stateMachine
    stateMachine.save(StateChangeFactory.ElementsAndLinesCreated(newElements, newLines));

    displayMessage(messageTypes.SUCCESS, `You have successfully pasted ${elements.length} elements and ${connectedLines.length} lines!`);
    showdata();
}

//-------------------------------------------------------------------------------------------------
// Set a time for the element to exist, will be removed after time has exceeded
//-------------------------------------------------------------------------------------------------

function setTimerToMessage(element, time = 5000)
{
    if (!element) return;

    element.innerHTML += `<div class="timeIndicatorBar"></div>`;
    var timer = setInterval( function(){
        var element = document.getElementById(errorMsgMap[timer].id);
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

//------------------------------------=======############==========----------------------------------------
//                                    Default data display stuff
//------------------------------------=======############==========----------------------------------------

function getData()
{
    container = document.getElementById("container");
    showdata();
    drawRulerBars();
    generateToolTips();
    toggleGrid();
}

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

function data_returned(ret)
{
    if (typeof ret.data !== "undefined") {
        service = ret;
        showdata();
    } else {
        alert("Error receiveing data!");
    }
}

function updateGridSize()
{
    var bLayer = document.getElementById("grid");
    bLayer.setAttribute("width", 100 * zoomfact);
    bLayer.setAttribute("height", 100 * zoomfact);

    bLayer.children[1].setAttribute('d', `M ${100 * zoomfact} 0 L 0 0 0 ${100 * zoomfact}`);
}

function updateGridPos()
{
    var bLayer = document.getElementById("grid");
    bLayer.setAttribute('x', (scrollx * (1.0 / zoomfact)));
    bLayer.setAttribute('y', (scrolly * (1.0 / zoomfact)));
}
function clearContext()
{
    if(context != null){
        context = [];
        generateContextProperties();
    }
}
function clearContextLine()
{
    if(contextLine != null){
        contextLine = [];
        generateContextProperties();
    }
}