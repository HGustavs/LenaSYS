// =============================================================================================
//#region ================================ CLASSES             ==================================
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
     * @description Creates a new StateChange instance.
     * @param {ChangeTypes} changeType What kind of change this is, see {StateChange.ChangeTypes} for available values.
     * @param {Array<String>} id_list Array of all elements affected by this state change. This is used for merging changes on the same elements.
     * @param {Object} passed_values Map of all values that this change contains. Each property represents a change.
     */
    constructor(id, values, timestamp)
    {
        if (id != null) this.id = id;

        if(values != undefined){
            var keys = Object.keys(values);

            // If "values" is an array of objects, store all objects in the "state.created" array.
            if(keys[0] == '0') {
                this.created = values;
            }else{
                keys.forEach(key => {
                    this[key] = values[key];
                });
            }
        }

        if (timestamp != undefined) this.time = timestamp;
        else this.time = new Date().getTime();
    }

    /**
     * @description Appends all property values onto the valuesPassed object. Logic for each specific property is different, some overwrite and some replaces.
     * @param {StateChange} changes Another state change that will have its values copied over to this state change. Flags will also be merged.
     */
    appendValuesFrom(changes)
    {
        var propertys = Object.getOwnPropertyNames(changes);

        // For every value in change
        propertys.forEach(key => {

            /**
             * If the key is not blacklisted, set to the new value
             */
            if (key == "id") return; // Ignore this keys.
                this[key] = changes[key];
        });

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
        var values = { kind: element.kind };

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(element).filter(key => {
            return (Object.keys(defaults[element.kind]).filter(value => {
                return defaults[element.kind][value] == element[key];
            }).length == 0);
        });

        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = element[key];
        });
        return new StateChange(element.id, values);
    }

    /**
     * @param {Array<Object>} elements The elements that has been/are going to be deleted.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsDeleted(elements)
    {
        var ids = [];

        // For every object in the array, get id and add it to the array ids
        elements.forEach(element => {
            ids.push(element.id);
        });

        return new StateChange(ids);
    }

    /**
     * @param {List<String>} elementIDs List of IDs for all elements that were moved.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @returns {Array<StateChange>} A new instance of the StateChange class.
     */
    static ElementsMoved(elementIDs, moveX, moveY)
    {
        var changesArr = [];
        var timeStamp = new Date().getTime();

        if (moveX == 0 && moveY == 0) return;

        elementIDs.forEach(id => {
            var values = {};
           var obj = data[findIndex(data, id)];
           if (obj === undefined) return;

            if (moveX != 0) values.x = obj.x;
            if (moveY != 0) values.y = obj.y;
            changesArr.push(new StateChange(obj.id, values, timeStamp))
        });

        return changesArr;
    }

    /**
     * @param {Array<String>} elementIDs List of IDs for all elements that were resized.
     * @param {Number} changeX Amount of coordinates along the x-axis the elements have resized.
     * @param {Number} changeY Amount of coordinates along the y-axis the elements have resized.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementResized(elementIDs, changeX, changeY)
    {
        var values = {
            width: changeX
        };

        return new StateChange(elementIDs, values);
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
            x: moveX,
            width: changeX
        };
        return new StateChange(elementIDs, values);
    }

    /**
     * @param {Array<String>} elementID ID for element that has been changed.
     * @param {Object} changeList Object containing changed attributes for the element. Each property represents each attribute changed.
     * @returns {StateChange} A new instance of the StateChange class.
     */ 
    static ElementAttributesChanged(elementID, changeList)
    {
        var values = {};
        // For every attribut in changeList, add it to values
        Object.keys(changeList).forEach(key => {
            values[key] = changeList[key];
        });
        return new StateChange(elementID, values);
    }

    /**
     * @param {Object} line New line that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LineAdded(line)
    {
        var values = {};

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(line).filter(key => {
            return (Object.keys(defaultLine).filter(value => {
                return defaultLine[value] == line[key];
            }).length == 0);
        });

        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = line[key];
        });

        return new StateChange(line.id, values);
    }

    /**
     * @param {Array<object>} lines List of all lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LinesRemoved(lines)
    {
        console.log("TEST");
        var lineIDs = [];

        // For every object in the lines array, add them to lineIDs
        for (var index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }

        return new StateChange(lineIDs);
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
        elements.forEach(element => {
            allIDs.push(element.id)
        });

        // Add all line IDs to the id-list
        lines.forEach(line => {
            allIDs.push(line.id)
        });
        
        return new StateChange(allIDs);
    }

    /**
     * @param {Array<object>} elements All elements that have been created.
     * @param {Array<object>} lines All lines that have been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesCreated(elements, lines)
    {
        var changesArr = [];
        var timeStamp = new Date().getTime();

        // Filter out defaults from each element and add them to allObj
        elements.forEach(elem => {
            var values = { kind: elem.kind };

            var uniqueKeysArr = Object.keys(elem).filter(key => {
                return (Object.keys(defaults[elem.kind]).filter(value => {
                    return defaults[elem.kind][value] == elem[key];
                }).length == 0);
            });

            uniqueKeysArr.forEach(key => values[key] = elem[key]);
            changesArr.push(new StateChange(elem.id, values, timeStamp));
        });

        // Filter out defaults from each line and add them to allObj
        lines.forEach(line => {
            var values = {};

            var uniqueKeysArr = Object.keys(line).filter(key => {
                return (Object.keys(defaultLine).filter(value => {
                    return defaultLine[value] == line[key];
                }).length == 0);
            });

            uniqueKeysArr.forEach(key => values[key] = line[key]);
            changesArr.push(new StateChange(line.id, values, timeStamp));
        });

        return changesArr;
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
         * Our initial data values
         */
        this.initialState = {
            elements: [],
            lines: []
        }
        initialElements.forEach(element => {
            var obj = {};
            Object.assign(obj, element);
            this.initialState.elements.push(obj)
        });
        initialLines.forEach(line => {
            var obj = {};
            Object.assign(obj, line);
            this.initialState.lines.push(obj)
        });

        /**
         * @type StateChange.ChangeTypes
         */
        this.lastFlag = { };

        /**
         * Interger of the currentIndex position of historyLog
        */
        this.currentHistoryIndex = -1;
    }
    /**
     * @description Stores the passed state change into the state machine. If the change is hard it will be pushed onto the history log. A soft change will modify the previously stored state IF that state allows it. The soft state will otherwise be pushed into the history log instead. StateChanges REQUIRE flags to be identified by the stepBack and stepForward methods!
     * @param {StateChange} stateChange All changes to be logged.
     * @see StateChangeFactory For constructing new state changes more easily.
     * @see StateChange For available flags.
     */
    save (stateChangeArray, changeType)
    {
        
        if (!Array.isArray(stateChangeArray)) stateChangeArray = [stateChangeArray];

        for (var i = 0; i < stateChangeArray.length; i++) {

            var stateChange = stateChangeArray[i];

            if (stateChange instanceof StateChange) {

                // Remove the history entries that are after current index
                this.removeFutureStates();

                // If history is present, perform soft/hard-check
                if (this.historyLog.length > 0) {

                    // Get the last state in historyLog
                    var lastLog = this.historyLog[this.historyLog.length - 1];

                    // Check if the element is the same
                    var sameElements = true;
                    var isSoft = true;

                    // Change is creation of elements, no need for history comparisions
                    if(stateChange.created != undefined) {
                        sameElements = false;
                    } else { // Perform history comparisions
                        if (Array.isArray(lastLog.id)){
                            if (stateChange.id.length != lastLog.id.length) sameElements = false;
                            for (var index = 0; index < lastLog.id.length && sameElements; index++) {
                                var id_found = lastLog.id[index];

                                if (!stateChange.id.includes(id_found)) sameElements = false;

                            }
                        }else {
                            if (lastLog.id != stateChange.id) sameElements = false;
                        }

                        if (Array.isArray(changeType)){
                            for (var index = 0; index < changeType.length && isSoft; index++) {
                                isSoft = cha<ngeType[index].isSoft;
                            }
                            var changeTypes = changeType;
                        }else {
                            isSoft = changeType.isSoft;
                            var changeTypes = [changeType];
                        }

                    // Find last change with the same ids
                    var timeLimit = 10; // Timelimit on history append in seconds
                    for (var index = this.historyLog.length - 1; index >= 0; index--){

                        // Check so if the changeState is not an created-object
                        if (this.historyLog[index].created != undefined) continue;

                        var sameIds = true;
                        if(stateChange.id.length != this.historyLog[index].id.length) sameIds = false;

                        for (var idIndex = 0; idIndex < stateChange.id.length && sameIds; idIndex++){
                            if (!this.historyLog[index].id.includes(stateChange.id[idIndex])) sameIds = false;
                        }

                        // If the found element has the same ids.
                        if (sameIds){
                            var temp = false;
                            // If this historyLog is within the timeLimit
                            if(((new Date().getTime() / 1000) - (this.historyLog[index].time / 1000)) < timeLimit){
                                lastLog = this.historyLog[index];
                                temp = true;
                            }
                            sameElements = temp;
                            break;
                        }
                    }
                }

                // If NOT soft change, push new change onto history log
                if (!isSoft || !sameElements) {

                    this.historyLog.push(stateChange);
                    this.lastFlag = changeType;
                    this.currentHistoryIndex = this.historyLog.length -1;

                } else { // Otherwise, simply modify the last entry.

                    for (var index = 0; index < changeTypes.length; index++) {

                        var changeType = changeTypes[index];

                        switch (changeType) {
                            case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                            case StateChange.ChangeTypes.ELEMENT_MOVED:
                            case StateChange.ChangeTypes.ELEMENT_RESIZED:
                            case StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED:
                                lastLog.appendValuesFrom(stateChange);
                                this.historyLog.push(this.historyLog.splice(this.historyLog.indexOf(lastLog), 1)[0]);
                                this.currentHistoryIndex = this.historyLog.length -1;
                                break;

                            default:
                                console.error(`Missing implementation for soft state change: ${stateChange}!`);
                                break;
                        };
                    }
                }
            } else {
                this.historyLog.push(stateChange);
                this.lastFlag = changeType;
                this.currentHistoryIndex = this.historyLog.length -1;
            }
        } else {
            console.error("Passed invalid argument to StateMachine.save() method. Must be a StateChange object!");
        }
    }

    }
    removeFutureStates(){
        // Remove the history entries that are after current index
        if (this.currentHistoryIndex != this.historyLog.length - 1) {
            this.historyLog.splice(this.currentHistoryIndex + 1, (this.historyLog.length - this.currentHistoryIndex - 1));
        }
    }
    /**
     * @description Undoes the last stored history log changes. Determines what should be looked for by reading the state change flags.
     * @see StateChange For available flags.
     */
    stepBack () 
    {
        // If there is no history => return
        if (this.currentHistoryIndex == -1) return;

        do {
            // Lower the historyIndex by one
            this.currentHistoryIndex--;
            console.log(this.currentHistoryIndex);

        }while(this.currentHistoryIndex === 0 ||
            this.currentHistoryIndex > 0
            && this.historyLog[this.currentHistoryIndex] 
            && this.historyLog[this.currentHistoryIndex - 1].time == this.historyLog[this.currentHistoryIndex].time);

        clearContext();
        clearContextLine();
        showdata();
        this.scrubHistory(this.currentHistoryIndex);
        updatepos(0, 0);
        displayMessage(messageTypes.SUCCESS, "Changes reverted!")
    }
    stepForward()
    {
        // If there is not anything to restore => return
        if (this.historyLog.length == 0 || this.currentHistoryIndex == (this.historyLog.length -1)) return;

        // Go one step forward, if the next state in the history has the same time, do that too
        do {

            // Increase the currentHistoryIndex by one
            this.currentHistoryIndex++;

            // Restore the state
            this.restoreState(this.historyLog[this.currentHistoryIndex]);

            var doNextState = false;
            if (this.historyLog[this.currentHistoryIndex + 1]){
                doNextState = (this.historyLog[this.currentHistoryIndex].time == this.historyLog[this.currentHistoryIndex + 1].time)
            }
        }while(doNextState);

        // Update diagram
        clearContext();
        showdata();
        updatepos(0, 0);
        displayMessage(messageTypes.SUCCESS, "Changes reverse reverted!")
    }
    scrubHistory(endIndex)
    {
        this.gotoInitialState();

        for (var i = 0; i <= endIndex; i++) {
            this.restoreState(this.historyLog[i]);
        }

        // Update diagram
        clearContext();
        clearContextLine();
        showdata();
        updatepos(0, 0);
    }
    /**
     * @description Restore an given state
     * @param {StateChange} state The state that should be restored
     */
    restoreState(state)
    {
        // Get all keys from the state.
        var keys = Object.keys(state);

        // If there is only an key that is ID in the state, delete those objects
        // TODO: Change the delete key to "del" OR "delete"
        if (keys.length == 2 && keys[0] == "id") {
            var elementsToRemove = [];
            var linesToRemove = [];

            // If the id is not an array, make it into an array
            if (!Array.isArray(state.id)) state.id = [state.id];

            // For every id, find the object and add to the corresponding array
            state.id.forEach(objID => {
                if (data[findIndex(data, objID)] != undefined){
                    elementsToRemove.push(data[findIndex(data, objID)]);
                }else {
                    linesToRemove.push(lines[findIndex(lines, objID)]);
                }
            });
            // If the array is not empty remove the objects
            if (linesToRemove.length != 0) removeLines(linesToRemove, false);
            if (elementsToRemove.length != 0) removeElements(elementsToRemove, false);
            return;
        }

        if (!Array.isArray(state.id)) state.id = [state.id];

        for (var i = 0; i < state.id.length; i++){

            // Find object
            var object;
            if (data[findIndex(data, state.id[i])] != undefined) object = data[findIndex(data, state.id[i])];
            else if (lines[findIndex(lines, state.id[i])] != undefined) object = lines[findIndex(lines, state.id[i])];

            // If an object was found
            if (object){
                // For every key, apply the changes
                keys.forEach(key => {
                    if (key == "id" || key == "time") return; // Ignore this keys.
                        object[key] = state[key];
                });
            }else { // If no object was found - create one

                var temp = {};
                Object.keys(state).forEach(key => {
                    if (key == "id") temp.id = state.id[i];
                    else temp[key] = state[key];
                });

                // If the object got x, y and a kind, apply the default for the kind and create a element
                if (temp.x && temp.y && temp.kind){
                    Object.keys(defaults[temp.kind]).forEach(key => {
                        if (!temp[key]) temp[key] = defaults[temp.kind][key];
                    });
                    data.push(temp);

                }else { // Else it most be an line - apply defaults and create the line
                    Object.keys(defaultLine).forEach(key => {
                        if (!temp[key]) temp[key] = defaultLine[key];
                    });
                    lines.push(temp);
                }
            }
        }
    }
    /**
     * @description Go back to the inital state in the diagram
     */
    gotoInitialState()
    {
        // Set initial values to data and lines.
        data = [];
        lines = [];

        this.initialState.elements.forEach(element => {
            var obj = {};
            Object.assign(obj, element);
            data.push(obj)
        });
        this.initialState.lines.forEach(line => {
            var obj = {};
            Object.assign(obj, line);
            lines.push(obj)
        });
        clearContext();
        showdata();
        updatepos(0, 0);
    }
    /**
     * @description Create a timers and go-through all states grouped by time.
     * @param {Number} cri The starting index of timestamp-map to start on.
     */
    replay(cri = parseInt(document.getElementById("replay-range").value))
    {
        // If no history exists => return
        if (this.historyLog.length == 0) return;

        var tsIndexArr = Object.keys(settings.replay.timestamps);

        clearInterval(this.replayTimer);

        // If cri (CurrentReplayIndex) is the last set to beginning
        if(cri == tsIndexArr.length -1) cri = -1;

        setReplayRunning(true);
        document.getElementById("replay-range").value = cri.toString();

        // Go back to the beginning.
        this.scrubHistory(tsIndexArr[cri]);

        var self = this;
        this.replayTimer = setInterval(function() {

            cri++;
            var startStateIndex = tsIndexArr[cri];
            var stopStateIndex;

            if(tsIndexArr.length - 1 == cri){
                stopStateIndex = self.historyLog.length -1;
            }else if(tsIndexArr[cri+1] - 1 == tsIndexArr[cri]){
                stopStateIndex = startStateIndex;
            }else{
                stopStateIndex = tsIndexArr[cri+1] -1;
            } 
            if(stopStateIndex == -1){
                stopStateIndex = 0; 
            } 

            for (var i = startStateIndex; i <= stopStateIndex; i++){
                self.restoreState(self.historyLog[i]);
 
            }

            // Update diagram
            clearContext();
            showdata();
            updatepos(0, 0);

            
            document.getElementById("replay-range").value = cri;

            if (tsIndexArr.length -1 == cri){
                clearInterval(self.replayTimer);
                setReplayRunning(false);
            }
        }, settings.replay.delay * 1000)

    }
}
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
        HISTORY_STEPFORWARD: {key: "y", ctrl: true},
        DELETE: {key: "delete", ctrl: false},
        ESCAPE: {key: "escape", ctrl: false},
        POINTER: {key: "1", ctrl: false},
        BOX_SELECTION: {key: "2", ctrl: false},
        PLACE_ENTITY: {key: "3", ctrl: false},
        PLACE_RELATION: {key: "4", ctrl: false},
        PLACE_ATTRIBUTE: {key: "5", ctrl: false},
        PLACE_UMLENTITY: {key: "6", ctrl: false},       //<-- UML functionality
        EDGE_CREATION: {key: "7", ctrl: false},
        ZOOM_IN: {key: "+", ctrl: true, meta: true},
        ZOOM_OUT: {key: "-", ctrl: true, meta: true},
        ZOOM_RESET: {key: "0", ctrl: true, meta: true},
        TOGGLE_A4: {key: "a", ctrl: false, meta: false},
        TOGGLE_GRID: {key: "g", ctrl: false},
        TOGGLE_RULER: {key: "t", ctrl: false},
        TOGGLE_SNAPGRID: {key: "s", ctrl: false},
        CENTER_CAMERA: {key:"home", ctrl: false},
        OPTIONS: {key: "o", ctrl: false},
        ENTER: {key: "enter", ctrl: false},
        COPY: {key: "c", ctrl: true, meta: true},
        PASTE: {key: "v", ctrl: true, meta: true},
        SELECT_ALL: {key: "a", ctrl: true},
        DELETE_B: {key: "backspace", ctrl: false},
        MOVING_OBJECT_UP: {key: "ArrowUp", ctrl: false},
        MOVING_OBJECT_DOWN: {key: "ArrowDown", ctrl: false},
        MOVING_OBJECT_LEFT: {key: "ArrowLeft", ctrl: false},
        MOVING_OBJECT_RIGHT: {key: "ArrowRight", ctrl: false},
        TOGGLE_KEYBINDLIST: {key: "F1", ctrl: false},
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
    EREntity: 0,
    ERRelation: 1,
    ERAttr: 2,
    Ghost: 3,
    UMLEntity: 4,       //<-- UML functionality
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
    CLICKED_LABEL: 5,
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
 * @description Available types of entity, ie ER, IE, UML This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const entityType = {
    UML: "UML",
    ER: "ER",
};
/**
 * @description
 */
const umlState = {
    NORMAL: "normal",
}

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
var deleteBtnX = 0, deleteBtnY = 0;
var deleteBtnSize = 0;
var hasRecursion = false;
var startWidth;
var startNodeRight = false;
var cursorStyle;
var lastMousePos = getPoint(0,0);
var dblPreviousTime = new Date().getTime(); ; // Used when determining if an element was doubleclicked.
var dblClickInterval = 350; // 350 ms = if less than 350 ms between clicks -> Doubleclick was performed.
var wasDblClicked = false;
var targetDelta;
var mousePressed;

// Zoom variables
var lastZoomfact = 1.0;
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;
var zoomOrigo = new Point(0, 0); // Zoom center coordinates relative to origo
var camera = new Point(0, 0); // Relative to coordinate system origo
var lastZoomPos = new Point(0, 0); //placeholder for the previous zoom position relative to the screen (Screen position for previous zoom)
var lastMousePosCoords = new Point(0, 0); //placeholder for the previous mouse coordinates relative to the diagram (Coordinates for the previous zoom)

var zoomAllowed = true; // Boolean value to slow down zoom on touchpad.

var lastZoomPos = new Point(0, 0); //placeholder for the previous zoom position relative to the screen (Screen position for previous zoom)
var lastMousePosCoords = new Point(0, 0); //placeholder for the previous mouse coordinates relative to the diagram (Coordinates for the previous zoom) 


// Constants
const elementwidth = 200;
const elementheight = 50;
const textheight = 18;
const strokewidth = 2.0;
const baseline = 10;
const avgcharwidth = 6; // <-- This variable is never used anywhere in this file. 
const colors = ["white", "gold", "#ffccdc", "yellow", "cornflowerBlue", "#CDF5F6"];
const strokeColors = ["black", "white", "grey", "#614875"];
const multioffs = 3;
// Zoom values for offsetting the mouse cursor positioning
const zoom1_25 = 0.36;
const zoom1_5 = 0.555;
const zoom2 = 0.75;
const zoom4 = 0.9375;
const zoom0_75 = -0.775;
const zoom0_5 = -3;
const zoom0_25 = -15.01;

// Arrow drawing stuff - diagram elements, diagram lines and labels 
var lines = [];
var elements = [];
var lineLabelList = [];

// Currently clicked object list
var context = [];
var previousContext = [];
var contextLine = []; // Contains the currently selected line(s).
var previousContextLine = [];
var determinedLines = null; //Last calculated line(s) clicked.
var deltaExceeded = false;
var targetElement = null;
var targetElementDiv;
var targetLabel = null;

const maxDeltaBeforeExceeded = 2;

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

var elementTypeSelected = elementTypes.EREntity;
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;

//Grid Settings
var settings = {
    ruler: {
        ZF: 100 * zoomfact,
        zoomX: Math.round(((0 - zoomOrigo.x) * zoomfact) +  (1.0 / zoomfact)),
        zoomY: Math.round(((0 - zoomOrigo.y) * zoomfact) + (1.0 / zoomfact)),
        isRulerActive: true,
    },
    grid: {
        gridSize: 50,
        origoWidth: 2,
        snapToGrid: false,
        a4SizeFactor: 1,
    },
    misc: {
        randomidArray: [], // array for checking randomID
        errorMsgMap: {},
    },
    zoomPower: 1 / 3,
    replay: {
        active: false,
        delay: 1,
        timestamps: {}
    }
};


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
    EREntity: { name: "Entity", kind: "EREntity", fill: "#ffccdc", stroke: "Black", width: 200, height: 50 },
    ERRelation: { name: "Relation", kind: "ERRelation", fill: "#ffccdc", stroke: "Black", width: 60, height: 60 },
    ERAttr: { name: "Attribute", kind: "ERAttr", fill: "#ffccdc", stroke: "Black", width: 90, height: 45 },
    Ghost: { name: "Ghost", kind: "ERAttr", fill: "#ffccdc", stroke: "Black", width: 5, height: 5 },
    UMLEntity: {name: "Class", kind: "UMLEntity", fill: "#ffccdc", stroke: "Black", width: 200, height: 50}     //<-- UML functionality
}
var defaultLine = { kind: "Normal" };
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
        { name: "EMPLOYEE", x: 100, y: 200, width: 200, height: 50, kind: "EREntity", fill: "#ffccdc", stroke: "black", id: EMPLOYEE_ID , isLocked: false },
        { name: "Bdale", x: 30, y: 30, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Bdale_ID, isLocked: false, state: "Normal" },
        { name: "Bdale", x: 360, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: BdaleDependent_ID, isLocked: false, state: "Normal" },
        { name: "Ssn", x: 20, y: 100, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Ssn_ID, isLocked: false, state: "key"},
        { name: "Name", x: 200, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Name_ID, isLocked: false },
        { name: "Name", x: 180, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: NameDependent_ID, isLocked: false, state: "weakKey"},
        { name: "Name", x: 920, y: 600, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: NameProject_ID, isLocked: false, state: "key"},
        { name: "Name", x: 980, y: 70, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: NameDEPARTMENT_ID, isLocked: false, state: "key"},
        { name: "Address", x: 300, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Address_ID, isLocked: false },
        { name: "Address", x: 270, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: AddressDependent_ID, isLocked: false },
        { name: "Relationship", x: 450, y: 700, width: 120, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Relationship_ID, isLocked: false },
        { name: "Salary", x: 400, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Salary_ID, isLocked: false },
        { name: "F Name", x: 100, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: FNID, isLocked: false },
        { name: "Initial", x: 200, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Initial_ID, isLocked: false },
        { name: "L Name", x: 300, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: LNID, isLocked: false },
        { name: "SUPERVISIONS", x: 140, y: 350, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: SUPERVISION_ID, isLocked: false },
        { name: "DEPENDENTS_OF", x: 330, y: 450, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: DEPENDENTS_OF_ID, isLocked: false, state: "weak"},
        { name: "DEPENDENT", x: 265, y: 600, width: 200, height: 50, kind: "EREntity", fill: "#ffccdc", stroke: "black", id: DEPENDENT_ID, isLocked: false, state: "weak"},
        { name: "Number_of_depends", x: 0, y: 600, width: 180, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Number_of_depends_ID, isLocked: false, state: "computed"},
        { name: "WORKS_ON", x: 650, y: 490, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: WORKS_ON_ID, isLocked: false },
        { name: "Hours", x: 720, y: 400, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Hours_ID, isLocked: false },
        { name: "PROJECT", x: 1000, y: 500, width: 200, height: 50, kind: "EREntity", fill: "#ffccdc", stroke: "black", id: PROJECT_ID, isLocked: false },
        { name: "Number", x: 950, y: 650, width: 120, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: NumberProject_ID, isLocked: false, state: "key"},
        { name: "Location", x: 1060, y: 610, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Location_ID, isLocked: false},
        { name: "MANAGES", x: 600, y: 300, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: MANAGES_ID, isLocked: false },
        { name: "Start date", x: 510, y: 220, width: 100, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Start_date_ID, isLocked: false },
        { name: "CONTROLS", x: 1070, y: 345, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: CONTROLS_ID, isLocked: false },
        { name: "DEPARTMENT", x: 1000, y: 200, width: 200, height: 50, kind: "EREntity", fill: "#ffccdc", stroke: "black", id: DEPARTMENT_ID, isLocked: false },
        { name: "Locations", x: 1040, y: 20, width: 120, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Locations_ID, isLocked: false, state: "multiple" },
        { name: "WORKS_FOR", x: 650, y: 60, width: 60, height: 60, kind: "ERRelation", fill: "#ffccdc", stroke: "black", id: WORKS_FOR_ID, isLocked: false },
        { name: "Number", x: 1130, y: 70, width: 90, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: NumberDEPARTMENT_ID, isLocked: false, state: "key"},
        { name: "Number_of_employees", x: 750, y: 200, width: 200, height: 45, kind: "ERAttr", fill: "#ffccdc", stroke: "black", id: Number_of_employees_ID, isLocked: false, state: "computed"},
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
        { id: makeRandomID(), fromID: EMPLOYEE_ID, toID: WORKS_FOR_ID, kind: "Double", cardinality: "MANY"},

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

        { id: makeRandomID(), fromID: PROJECT_ID, toID: WORKS_ON_ID, kind: "Double", cardinality: "MANY"},
        { id: makeRandomID(), fromID: PROJECT_ID, toID: CONTROLS_ID, kind: "Normal", cardinality: "MANY"},
        { id: makeRandomID(), fromID: NameProject_ID, toID: PROJECT_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: NumberProject_ID, toID: PROJECT_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: Location_ID, toID: PROJECT_ID, kind: "Normal"},
        
        { id: makeRandomID(), fromID: MANAGES_ID, toID: Start_date_ID, kind: "Normal"},
        { id: makeRandomID(), fromID: MANAGES_ID, toID: EMPLOYEE_ID, kind: "Normal", cardinality: "ONE"},
        { id: makeRandomID(), fromID: MANAGES_ID, toID: DEPARTMENT_ID, kind: "Double", cardinality: "ONE"},

        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: Locations_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: CONTROLS_ID, kind: "Normal", cardinality: "ONE" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: NameDEPARTMENT_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: NumberDEPARTMENT_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: Number_of_employees_ID, kind: "Normal" },
        { id: makeRandomID(), fromID: DEPARTMENT_ID, toID: WORKS_FOR_ID, kind: "Double", cardinality: "ONE" },
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
    generateKeybindList();
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
    if (isKeybindValid(e, keybinds.LEFT_CONTROL) && ctrlPressed !== true) ctrlPressed = true;
    if (isKeybindValid(e, keybinds.ALT) && altPressed !== true) altPressed = true;
    if (isKeybindValid(e, keybinds.META) && ctrlPressed !== true) ctrlPressed = true;

    if (isKeybindValid(e, keybinds.ESCAPE) && escPressed != true && settings.replay.active){
        toggleReplay();
        setReplayRunning(false);
        clearInterval(stateMachine.replayTimer);
    }

    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
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

        if (isKeybindValid(e, keybinds.ZOOM_RESET)){
            e.preventDefault();
            zoomreset();
        }

        if (isKeybindValid(e, keybinds.SELECT_ALL)){
            if(mouseMode == mouseModes.EDGE_CREATION){
                e.preventDefault();
                return false;
            } else {
                e.preventDefault();
                selectAll();
            }
        }
        if (isKeybindValid(e, keybinds.CENTER_CAMERA)){
            e.preventDefault();
        }

        // Moving object with arrows
        if (isKeybindValid(e, keybinds.MOVING_OBJECT_UP) && !settings.grid.snapToGrid){
            setPos(context, 0, 1);
        }
        if (isKeybindValid(e, keybinds.MOVING_OBJECT_DOWN) && !settings.grid.snapToGrid){
            setPos(context, 0, -1);
        }
        if (isKeybindValid(e, keybinds.MOVING_OBJECT_LEFT) && !settings.grid.snapToGrid){
            setPos(context, 1, 0);
        }
        if (isKeybindValid(e, keybinds.MOVING_OBJECT_RIGHT) && !settings.grid.snapToGrid){
            setPos(context, -1, 0);
        }

    } else { 
        if (isKeybindValid(e, keybinds.ENTER)) { 
            var propField = document.getElementById("elementProperty_name");
            if(!!document.getElementById("lineLabel")){
                changeLineProperties();
            }else{
                changeState();
                saveProperties(); 
                propField.blur();
            }
            displayMessage(messageTypes.SUCCESS, "Sucessfully saved");
        }
    }
});

document.addEventListener('keyup', function (e)
{
    var pressedKey = e.key.toLowerCase();
  
    if (pressedKey == keybinds.LEFT_CONTROL.key) ctrlPressed = false;
    if (pressedKey == keybinds.ALT.key) altPressed = false;
    if (pressedKey == keybinds.META.key) {
          setTimeout(() => {
              ctrlPressed = false;
          }, 1000);
      }

    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if( !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        if (isKeybindValid(e, keybinds.HISTORY_STEPBACK)) stateMachine.stepBack();
        if (isKeybindValid(e, keybinds.HISTORY_STEPFORWARD)) stateMachine.stepForward();
        if (isKeybindValid(e, keybinds.ESCAPE)) escPressed = false;
        if (isKeybindValid(e, keybinds.DELETE) || isKeybindValid(e, keybinds.DELETE_B)) {
            
            if (mouseMode == mouseModes.EDGE_CREATION) return;
            if (context.length > 0) {
                removeElements(context);
            } else if (contextLine.length > 0) {
                 removeLines(contextLine);
            }            
    
            updateSelection();
            
        }
        
        if(isKeybindValid(e, keybinds.POINTER)) setMouseMode(mouseModes.POINTER);
        if(isKeybindValid(e, keybinds.BOX_SELECTION)) setMouseMode(mouseModes.BOX_SELECTION);
        
        if(isKeybindValid(e, keybinds.EDGE_CREATION)){
            setMouseMode(mouseModes.EDGE_CREATION);
            clearContext();
        }

        if(isKeybindValid(e, keybinds.PLACE_ENTITY)){
            setElementPlacementType(elementTypes.EREntity);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if(isKeybindValid(e, keybinds.PLACE_RELATION)){
            setElementPlacementType(elementTypes.ERRelation);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if(isKeybindValid(e, keybinds.PLACE_ATTRIBUTE)){
            setElementPlacementType(elementTypes.ERAttr);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        //=================================================== //<-- UML functionality
        //Temp for UML functionality
        if(isKeybindValid(e, keybinds.PLACE_UMLENTITY)) {
            setElementPlacementType(elementTypes.UMLEntity)
            setMouseMode(mouseMode.PLACING_ELEMENT);
        }
        //======================================================

        if(isKeybindValid(e, keybinds.TOGGLE_A4)) toggleA4Template();
        if(isKeybindValid(e, keybinds.TOGGLE_GRID)) toggleGrid();
        if(isKeybindValid(e, keybinds.TOGGLE_RULER)) toggleRuler();
        if(isKeybindValid(e, keybinds.TOGGLE_SNAPGRID)) toggleSnapToGrid();
        if(isKeybindValid(e, keybinds.OPTIONS)) toggleOptionsPane();
        if(isKeybindValid(e, keybinds.PASTE)) pasteClipboard(JSON.parse(localStorage.getItem('copiedElements') || "[]"), JSON.parse(localStorage.getItem('copiedLines') || "[]"));
        if(isKeybindValid(e, keybinds.CENTER_CAMERA)) centerCamera();

        if (isKeybindValid(e, keybinds.COPY)){
            // Remove the preivous copy-paste data from localstorage.
            if(localStorage.key('copiedElements')) localStorage.removeItem('copiedElements');
            if(localStorage.key('copiedLines')) localStorage.removeItem('copiedLines');

            if (context.length !== 0){
                
                // Filter - keeps only the lines that are connectet to and from selected elements.
                var contextConnectedLines = getLines().filter(line => {
                    return (context.filter(element => {
                        return line.toID == element.id || line.fromID == element.id
                    })).length > 1
                });

                // Store new copy-paste data in local storage
                localStorage.setItem('copiedElements', JSON.stringify(context));
                localStorage.setItem('copiedLines', JSON.stringify(contextConnectedLines));
                
                displayMessage(messageTypes.SUCCESS, `You have copied ${context.length} elements and its inner connected lines.`);
            }else {
                displayMessage(messageTypes.SUCCESS, `Clipboard cleared.`);
            }
        }

        if (isKeybindValid(e, keybinds.TOGGLE_KEYBINDLIST)) {
            e.preventDefault();
            toggleKeybindList();
        }

    } else {
        if(document.activeElement.id == 'elementProperty_name' && isKeybindValid(e, keybinds.ESCAPE)){
            if(context.length == 1){
                document.activeElement.value = context[0].name;
                document.activeElement.blur();
                toggleOptionsPane();
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

document.addEventListener("mouseleave", function(event){
    if (event.toElement == null && event.relatedTarget == null) {
        pointerState = pointerStates.DEFAULT;
    }
});
// --------------------------------------- Mouse Events    --------------------------------
/**
 * @description Event function triggered when the mousewheel reader has a value of grater or less than 0.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mwheel(event) {
    event.preventDefault();
    if(zoomAllowed){
        if(event.deltaY < 0) {
            zoomin(event);
        } else {
            zoomout(event);
        }
        zoomAllowed = false;
        setTimeout(function(){zoomAllowed = true}, 75); // This number decides the time between each zoom tick, in ms.
    }
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mdown(event)
{
        // Mouse pressed over delete button for multiple elements
        if (event.button == 0 && context.length > 1) {
            checkDeleteBtn();
        }

    // Prevent middle mouse panning when moving an object
    if(event.button == 1) {
        if (movingObject) {
            event.preventDefault();
            return;
        } 
    }

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active, set scroll start values
    if(event.button == 1  || settings.replay.active) {
        pointerState = pointerStates.CLICKED_CONTAINER;
        sscrollx = scrollx;
        sscrolly = scrolly;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
        return;
    }

    // If the right mouse button is pressed => return
    if(event.button == 2) return;

    // React to mouse down on container
    if (event.target.id == "container") {
        switch (mouseMode) {
            case mouseModes.POINTER:
                pointerState = pointerStates.CLICKED_CONTAINER;
                sscrollx = scrollx;
                sscrolly = scrolly;
                startX = event.clientX;
                startY = event.clientY;

                if((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                    wasDblClicked = true;
                    document.getElementById("options-pane").className = "hide-options-pane";
                }
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
    if(pointerState !== pointerStates.CLICKED_NODE && pointerState !== pointerStates.CLICKED_ELEMENT && !settings.replay.active){
        // Used when clicking on a line between two elements.
        determinedLines = determineLineSelect(event.clientX, event.clientY);
        if(determinedLines){
            if (determinedLines.id.length == 6) {
               pointerState=pointerStates.CLICKED_LINE;
    
                if((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                    wasDblClicked = true;
                    document.getElementById("options-pane").className = "show-options-pane";
                }
            }
            else if(determinedLines.id.length > 6){
                targetLabel = lineLabelList[findIndex(lineLabelList, determinedLines.id)];
                startX = event.clientX;
                startY = event.clientY;

                pointerState = pointerStates.CLICKED_LABEL;
            }
        }
    }

    dblPreviousTime = new Date().getTime();
    wasDblClicked = false;
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of any element.
 * @param {MouseEvent} event Triggered mouse event.
 */
function ddown(event)
{
    // Mouse pressed over delete button for a single element
    if (event.button == 0) {
        checkDeleteBtn();
    }
    
    // Used when determining time between clicks.
    if((new Date().getTime() - dblPreviousTime) < dblClickInterval && event.button == 0){

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

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active => return
    if(event.button == 1 || settings.replay.active) return;

    // If the right mouse button is pressed => return
    if(event.button == 2) return;

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
            if (element != null){
                pointerState = pointerStates.CLICKED_ELEMENT;
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
            if(event.target.id == "container") {

            
            if (ghostElement && event.button == 0) {
                addObjectToData(ghostElement);
                makeGhost();
                showdata();
            }
            break;
        }
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
                    elementTypeSelected = elementTypes.Ghost;
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
 * @description Event function triggered when any mouse button is released on top of the toolbar.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */

 function tup(event) 
 {
     pointerState = pointerStates.DEFAULT;
     deltaExceeded = false;
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
        
        case pointerStates.CLICKED_LABEL:
            break;

        case pointerStates.CLICKED_ELEMENT:
            
            movingObject = false;
            // Special cases:
            if (mouseMode == mouseModes.EDGE_CREATION) {
                mouseMode_onMouseUp(event);

            // Normal mode
            } else if (deltaExceeded) {
                if (context.length > 0) setPos(context, deltaX, deltaY);
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

 * @description Calculates if any line or label is present on x/y position in pixels.

 * @description Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.
 */
function checkDeleteBtn(){
    if (deleteBtnX != 0) {
        if (lastMousePos.x > deleteBtnX && lastMousePos.x < (deleteBtnX + deleteBtnSize) && lastMousePos.y > deleteBtnY && lastMousePos.y < (deleteBtnY + deleteBtnSize)) {
            if (mouseMode == mouseModes.EDGE_CREATION) return;
            if (context.length > 0) {
                removeElements(context);
            } else if (contextLine.length > 0) {
                 removeLines(contextLine);
            }            
    
            updateSelection();
        }
    }
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
    var labelWasHit = false;

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
        if (document.getElementById(bLayerLineIDs[i]+"Label")) {
            var centerPoint = {
                x: lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].centerX + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].labelMovedX,
                y: lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].centerY + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].labelMovedY
            
            }
            var labelWidth = lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].width;
            var labelHeight = lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].height;
            labelWasHit = didClickLabel(centerPoint, labelWidth, labelHeight, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius);
        }
        

        // Determines if a line was clicked
        lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);
        // --- Used when debugging ---
        // Creates a circle with the same position and radius as the hitbox of the circle being sampled with.
        //document.getElementById("svgoverlay").innerHTML += '<circle cx="'+ circleHitBox.pos_x + '" cy="'+ circleHitBox.pos_y+ '" r="' + circleHitBox.radius + '" stroke="black" stroke-width="3" fill="red" /> '
        // ---------------------------

        if(lineWasHit == true && labelWasHit == false) {
            // Return the current line that registered as a "hit".
            return lines.filter(function(line) {
                return line.id == bLayerLineIDs[i];
            })[0];
        }
        else if(labelWasHit == true)
        {

            return lineLabelList.filter(function(label) {
                return label.id == bLayerLineIDs[i]+"Label";
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
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if a label was clicked.
 */
 function didClickLabel(c, lw, lh, circle_x, circle_y, circle_radius)
 {
     // Adding and subtracting with the circle radius to allow for bigger margin of error when clicking.
     // Check if we are clicking withing the span.
     if( (circle_x < (c.x + lw / 2 + circle_radius)) &&
      (circle_x > (c.x - lw / 2 - circle_radius)) && 
      (circle_y < (c.y + lh / 2 + circle_radius)) && 
      (circle_y > (c.y - lh / 2 - circle_radius))
     ) {
        return true;
     }
     else{
         return false
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
                if (settings.grid.snapToGrid && mouseMode != mouseModes.EDGE_CREATION){
                    ghostElement.x = Math.round(cords.x / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.width / 2);
                    ghostElement.y = Math.round(cords.y / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.height / 2);
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

        case pointerStates.CLICKED_LABEL:
            updateLabelPos(event.clientX, event.clientY);

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
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], widthChange, 0), StateChange.ChangeTypes.ELEMENT_RESIZED);

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
                
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, 0, widthChange, 0), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
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
        
        if (settings.misc.randomidArray === undefined || settings.misc.randomidArray.length == 0) { //always add first id
            settings.misc.randomidArray.push(str);
            return str;

        } else {
            var check = settings.misc.randomidArray.includes(str); //if check is true the id already exists
            if(check == true){
                str = "";
            } else {
                settings.misc.randomidArray.push(str);
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
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementCreated(object), StateChange.ChangeTypes.ELEMENT_CREATED);
}

/**
 * @description Adds a line to the data array of lines.
 * @param {Object} object Line to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToLines(object, stateMachineShouldSave = true)
{
    lines.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.LineAdded(object), StateChange.ChangeTypes.LINE_CREATED);
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
            if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementsAndLinesDeleted(elementsToRemove, linesToRemove), StateChange.ChangeTypes.ELEMENT_AND_LINE_DELETED);
        } else { // Only removed elements without any lines
            if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementsDeleted(elementsToRemove), StateChange.ChangeTypes.ELEMENT_DELETED);
        }

        data = data.filter(function(element) { // Delete elements
            return !elementsToRemove.includes(element);
        });
    } else { // All passed items were INVALID
        console.error("Invalid element array passed to removeElements()!");
    }

    clearContext();
    showdata();
    redrawArrows();
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
        stateMachine.save(StateChangeFactory.LinesRemoved(linesArray), StateChange.ChangeTypes.LINE_DELETED);
    }

    contextLine = [];
    showdata();
    redrawArrows();
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
    ghostElement = constructElementOfType(elementTypeSelected);
    var lastMouseCoords = screenToDiagramCoordinates(lastMousePos.x, lastMousePos.y);
    ghostElement.x = lastMouseCoords.x - ghostElement.width * 0.5;
    ghostElement.y = lastMouseCoords.y - ghostElement.height * 0.5;
    ghostElement.id = makeRandomID();

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
    var typeName = undefined;
    for (const name in elementTypes) {
        if (elementTypes[name] == type) {
            typeName = name;
            break;
        }
    }
    if (typeName) {
        var defaultElement = defaults[typeName];
        var newElement = {};
        for (const property in defaultElement) {
            newElement[property] = defaultElement[property];
        }
        return newElement;
    }

    return undefined;
}

/**
 * @description Triggered on ENTER-key pressed when a property is being edited via the options panel. This will apply the new property onto the element selected in context.
 * @see context For currently selected element.
 */
function changeState() 
{

    var property = document.getElementById("propertySelect").value;
    var element = context[0];
    element.state = property;
    stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { state: property }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
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
                    propsChanged.name = value;
                }
                break;
        
            default:
                break;
        }
    }

    stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, propsChanged), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
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
    var label = document.getElementById("lineLabel");
    var line = contextLine[0];

    if(radio1.checked && line.kind != radio1.value) {
        line.kind = radio1.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { kind: radio1.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else if(radio2.checked && line.kind != radio2.value){
        line.kind = radio2.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { kind: radio2.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    }
    
    // Check if this element exists
    if (!!document.getElementById('propertyCardinality')){

        // Change line - cardinality
        var cardinalityInputValue = document.getElementById('propertyCardinality').value;

        if (line.cardinality != undefined && cardinalityInputValue == ""){
            delete line.cardinality;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { cardinality: undefined }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        } else if (line.cardinality != cardinalityInputValue && cardinalityInputValue != ""){
            line.cardinality = cardinalityInputValue;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { cardinality: cardinalityInputValue }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }

    if(line.label != label.value){
        label.value = label.value.trim();
        line.label = label.value
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { label: label.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
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
    if(selectedLine != null && ctrlPressed) {
        if(!contextLine.includes(selectedLine)){
            contextLine.push(selectedLine);
        } else {    //If element is already selcted
            contextLine = contextLine.filter(function (line) { return line !== selectedLine;});
        }

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
            showdata();
        // The element is already selected    
        } else {
            context = context.filter(function (element)
            {
                return element !== ctxelement;
            });
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
            showdata();
        } else {
            if (mouseMode != mouseModes.EDGE_CREATION) {
                clearContext();
            }
            context.push(ctxelement);
            showdata();
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
    generateContextProperties();
    showdata();
}

/**
 * Places a copy of all elements into the data array centered around the current mouse position.
 * @param {Array<Object>} elements List of all elements to paste into the data array.
 */
function pasteClipboard(elements, elementsLines)
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
    
    var connectedLines = [];
    /*
    * For every line that shall be copied, create a temp object,
    * for kind and connection tracking
    * */
    elementsLines.forEach(line => {
        var temp = {
            id: line.id,
            fromID: line.fromID,
            toID: line.toID,
            kind: line.kind,
            cardinality: line.cardinality
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
            state: element.state,
            fill: element.fill,
            stroke: element.stroke
        };

        newElements.push(elementObj)
        addObjectToData(elementObj, false);
    });

    // Create the new lines but do not saved in stateMachine
    connectedLines.forEach(line => {
        newLines.push(
            addLine(data[findIndex(data, line.fromID)], data[findIndex(data, line.toID)], line.kind, false, false, line.cardinality)
        );
    });

    // Save the copyed elements to stateMachine
    stateMachine.save(StateChangeFactory.ElementsAndLinesCreated(newElements, newLines), StateChange.ChangeTypes.ELEMENT_AND_LINE_CREATED);
    displayMessage(messageTypes.SUCCESS, `You have successfully pasted ${elements.length} elements and ${connectedLines.length} lines!`);
    clearContext(); // Deselect old selected elements
    clearContextLine();
    context = newElements; // Set context to the pasted elements
    contextLine = newLines; // Set contextline to the pasted lines
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
 * @description Checks if the second rectangle is within the first rectangle.
 * @param {*} left First rectangle
 * @param {*} right Second rectangle
 * @returns {Boolean} true if the right rectangle is within the left rectangle.
 */
function rectsIntersect (left, right)
{
    return (
        (left.x + left.width >= right.x + right.width) && 
        (left.x <= right.x) &&
        (left.y + left.height + (right.height/2) >= right.y + right.height) &&
        (left.y + (right.height/2) <= right.y )
    );
}

/**
 * @description Change the coordinates of data-objects
 * @param {Array<Object>} objects Array of objects that will be moved
 * @param {Number} x Coordinates along the x-axis to move
 * @param {Number} y Coordinates along the y-axis to move
 */
 function setPos(objects, x, y)
 {
     var idList = [];
     objects.forEach(obj => {

         if (obj.isLocked) return;
         if(entityIsOverlapping(obj.id, deltaX, deltaY)) return;

         if (settings.grid.snapToGrid) {

             if (!ctrlPressed) {
                 //Different snap points for entity and others
                 if (obj.kind == "EREntity") {
                     // Calculate nearest snap point
                     obj.x = Math.round((obj.x - (x * (1.0 / zoomfact))+100) / settings.grid.gridSize) * settings.grid.gridSize;
                     obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;
                 } else{
                     obj.x = Math.round((obj.x - (x * (1.0 / zoomfact))+50) / settings.grid.gridSize) * settings.grid.gridSize;
                     obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / (settings.grid.gridSize*0.5)) * (settings.grid.gridSize*0.5);
                 }
                 // Set the new snap point to center of element
                 obj.x -= obj.width / 2
                 obj.y -= obj.height / 2;

             } else {
                 obj.x += (targetDelta.x / zoomfact);
                 obj.y += ((targetDelta.y / zoomfact)+25);
             }
         }else {
             obj.x -= (x / zoomfact);
             obj.y -= (y / zoomfact);
         }
         // Add the object-id to the idList
         idList.push(obj.id);

         // Make the coordinates without decimals
         obj.x = Math.round(obj.x);
         obj.y = Math.round(obj.y);
     });
     updatepos(0, 0);
     if (idList.length != 0) stateMachine.save(StateChangeFactory.ElementsMoved(idList, -x, -y), StateChange.ChangeTypes.ELEMENT_MOVED);
 }

function isKeybindValid(e, keybind)
{
    return e.key.toLowerCase() == keybind.key.toLowerCase() && (e.ctrlKey == keybind.ctrl || keybind.ctrl == ctrlPressed);
}

function findEntityFromLine(lineObj)
{
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.EREntity).kind){
        return -1;
    }else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.EREntity).kind) {
        return 1;
    }
    return null;
}

function findAttributeFromLine(lineObj)
{
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.ERAttr).kind){
        return -1;
    }else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.ERAttr).kind) {
        return 1;
    }
    return null;
}
    
/**
 * @description Gets the extension of an filename
 * @param {String} filename The name of the file
 * @return The extension
 */
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function entityIsOverlapping(id, x, y)
{   
    let isOverlapping = false;
    const foundIndex = findIndex(data, id);
    if(foundIndex > -1){
        var element = data[foundIndex];
        let targetX;
        let targetY;

        targetX = element.x - (x / zoomfact);
        targetY = element.y - (y / zoomfact);

        for(var i = 0; i < data.length; i++){
            if(context.includes(data[i])) continue;
            
            //COMPARED ELEMENT
            const compX2 = data[i].x + data[i].width;
            const compY2 = data[i].y + data[i].height;

            if( (targetX < compX2) && (targetX + element.width) > data[i].x &&
                (targetY < compY2) && (targetY + element.height) > data[i].y){
                
                displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
                isOverlapping = true;
                break;
            }
        }
        return isOverlapping;
    }
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
            clearContext();
            clearContextLine();
            updatepos(0,0);
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
// Returns all elements within the coordinate box
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

/**
 * @description Checks whether the lines in the diagram is within the coordinate box
 * @param {Rect} selectionRect returned from the getRectFromPoints() function
 * @returns {Array<Object>} containing all of the lines that are currently within the coordinate box
 */
function getLinesInsideCoordinateBox(selectionRect)
{
    var allLines = document.getElementById("svgbacklayer").children;
    var tempLines = [];
    var bLayerLineIDs = [];
    for (var i = 0; i < allLines.length; i++) {
        if (/*intersectsBox(selectionRect, allLines[i]) ||*/ lineIsInsideRect(selectionRect, allLines[i])) {
            bLayerLineIDs[i] = allLines[i].id;
            bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-1/gi, '');
            bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-2/gi, '');
            tempLines.push(lines.find(line => line.id == bLayerLineIDs[i]));
        }
    }
    return tempLines;
}

/**
 * @description Checks if a entire line is inside of the coordinate box
 * @param {Rect} selectionRect returned from the getRectFromPoints() function
 * @param {Object} line following the format of the lines contained within the children of svgbacklayer
 * @returns {Boolean} Returns true if the line is within the coordinate box, else false
 */
function lineIsInsideRect(selectionRect, line)
{
    var lineCoord1 = screenToDiagramCoordinates(
        line.getAttribute("x1"),
        line.getAttribute("y1")
    );
    var lineCoord2 = screenToDiagramCoordinates(
        line.getAttribute("x2"),
        line.getAttribute("y2")
    );
    var lineLeftX = Math.min(lineCoord1.x,lineCoord2.x);
    var lineTopY = Math.min(lineCoord1.y,lineCoord2.y);
    var lineRightX = Math.max(lineCoord1.x,lineCoord2.x);
    var lineBottomY =  Math.max(lineCoord1.y,lineCoord2.y);
    var leftX = selectionRect.x;
    var topY = selectionRect.y;
    var rightX = selectionRect.x + selectionRect.width;
    var bottomY = selectionRect.y + selectionRect.height;
    if(leftX <= lineLeftX && topY <= lineTopY && rightX >= lineRightX && bottomY >= lineBottomY)
    {
        return true;
    }
    else{
        return false;
    }
     /* Code used to check for a point
    // Return true if any of the end points of the line are inside of the rect
    if (lineCoord1.x > leftX && lineCoord1.x < rightX && lineCoord1.y > topY && lineCoord1.y < bottomY) {
        return true;
    } else if (lineCoord2.x > leftX && lineCoord2.x < rightX && lineCoord2.y > topY && lineCoord2.y < bottomY) {
        return true;
    }*/

}

/**
 * @description Checks if a line intersects with any of the lines on the coordinate box
 * @param {Rect} selectionRect returned from the getRectFromPoints() function
 * @param {Object} line following the format of the lines contained within the children of svgbacklayer
 * @returns {Boolean} Returns true if the line intersects with any of the sides of the coordinate box, else false
 */
function intersectsBox(selectionRect, line)
{
    var tempCoords1 = screenToDiagramCoordinates(
        line.getAttribute("x1"),
        line.getAttribute("y1")
    );
    var tempCoords2 = screenToDiagramCoordinates(
        line.getAttribute("x2"),
        line.getAttribute("y2")
    );

    var x1 = tempCoords1.x;
    var y1 = tempCoords1.y;
    var x2 = tempCoords2.x;
    var y2 = tempCoords2.y;

    var leftX = selectionRect.x;
    var topY = selectionRect.y;
    var rightX = selectionRect.x + selectionRect.width;
    var bottomY = selectionRect.y + selectionRect.height;

    var left = false;
    var right = false;
    var top = false;
    var bottom = false;

    // Check intersection with the individual sides of the rect
    left = intersectsLine(x1, y1, x2, y2, leftX, topY, leftX, bottomY);
    right = intersectsLine(x1, y1, x2, y2, rightX, topY, rightX, bottomY);
    top = intersectsLine(x1, y1, x2, y2, leftX, topY, rightX, topY);
    bottom = intersectsLine(x1, y1, x2, y2, leftX, bottomY, rightX, bottomY);

    // return true if the line intersects with any of the sides
    if (left || right || top || bottom) return true;

    return false;
}

/**
 * @description Checks if a line intersects with another line
 * @param {Number} xy x1 - y2 are for the first line and the rest are for the second line
 * @returns {Boolean} Returns true if lines intersect, else false
 */
function intersectsLine(x1, y1, x2, y2, x3, y3, x4, y4)
{
    // calc line direction
    var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
        ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
        ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are within the interval 0-1, the lines are intersecting
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true;

    return false;
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
    previousContextLine = contextLine;
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


            // Remove entity from markedEntities if it was already marked.
            markedEntities = markedEntities.filter(entity => !previousContext.includes(entity));

            var markedLines = getLinesInsideCoordinateBox(rect);
            markedLines = markedLines.filter(line => !previousContextLine.includes(line));

            clearContext();
            context = context.concat(markedEntities);
            context = context.concat(previousContext);

            clearContextLine();
            contextLine = contextLine.concat(markedLines);
            contextLine = contextLine.concat(previousContextLine);

        }else if (altPressed) {
            var markedEntities = getElementsInsideCoordinateBox(rect);
            // Remove entity from previous context if the element is marked
            previousContext = previousContext.filter(entity => !markedEntities.includes(entity));

            var markedLines = getLinesInsideCoordinateBox(rect);
            previousContextLine = previousContextLine.filter(line => !markedLines.includes(line));

            context = [];
            context = previousContext;
            clearContextLine();
            contextLine = previousContextLine;

        }else {
            context = getElementsInsideCoordinateBox(rect);
            contextLine = getLinesInsideCoordinateBox(rect);
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
 * @description Change the state in replay-mode with the slider
 * @param {Number} sliderValue The value of the slider
 */
function changeReplayState(sliderValue)
{
    var timestampKeys = Object.keys(settings.replay.timestamps);

    // If the last timestamp is selected, goto the last state in the diagram.
    if (timestampKeys.length - 1 == sliderValue){
        stateMachine.scrubHistory(stateMachine.historyLog.length - 1);
    } else stateMachine.scrubHistory(timestampKeys[sliderValue+1] -1);

}
/**
 * @description Toggles stepforward in history.
 */
function toggleStepForward()
{
    stateMachine.stepForward();
}

/**
 * @description Toggles stepbackwards in history.
 */
function toggleStepBack() 
{
    stateMachine.stepBack();
}

/**
 * @description Toggles the movement of elements ON/OFF.
 */
function toggleEntityLocked()
{
    var ids = []
    var lockbtn = document.getElementById("lockbtn");
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
            lockbtn.value = "Unlock";
        } else {
            context[i].isLocked = false;
            lockbtn.value = "Lock";
        }
        ids.push(context[i].id);
    }
    stateMachine.save(StateChangeFactory.ElementAttributesChanged(ids, { isLocked: !locked }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    showdata();
    updatepos(0, 0);
}

/**
 * @description Toggles the visual background grid ON/OFF.
 */
function toggleGrid()
{
    var grid = document.getElementById("svggrid");
    var gridButton = document.getElementById("gridToggle");

    // Toggle active class on button
    document.getElementById("gridToggle").classList.toggle("active");

    // Toggle active grid + color change of button to clarify if button is pressed or not
    if (grid.style.display == "block") {
        grid.style.display = "none";
        gridButton.style.backgroundColor ="#614875";
     } else {
        grid.style.display = "block";
        gridButton.style.backgroundColor ="#362049";
   }
}

/**
 * @description Toggles the replay-mode, shows replay-panel, hides unused elements
 */
function toggleReplay()
{
    // If there is no history => display error and return
    if (stateMachine.historyLog.length == 0){
        displayMessage(messageTypes.ERROR, "Sorry, you need to make changes before enter the replay-mode");
        return;
    }

    // Get DOM-elements for styling
    var replayBox = document.getElementById("diagram-replay-box");
    var optionsPane = document.getElementById("options-pane");
    var toolbar = document.getElementById("diagram-toolbar");
    var ruler = document.getElementById("rulerOverlay");
    var zoomIndicator = document.getElementById("zoom-message-box");
    var replyMessage = document.getElementById("diagram-replay-message");

    if (settings.replay.active) {
        // Restore the diagram to state before replay-mode
        stateMachine.scrubHistory(stateMachine.currentHistoryIndex);

        settings.ruler.zoomX -= 50;
        // Change HTML DOM styling
        replayBox.style.visibility = "hidden";
        optionsPane.style.visibility = "visible";
        toolbar.style.visibility = "visible";
        ruler.style.left = "50px";
        zoomIndicator.style.bottom = "5px";
        zoomIndicator.style.left = "100px";
        replyMessage.style.visibility = "hidden";
    } else {
        settings.replay.timestamps = { 0: 0 }; // Clear the array with all timestamp.
        stateMachine.historyLog.forEach(historyEntry => {

            var lastKeyIndex = Object.keys(settings.replay.timestamps).length-1;
            var lastKey = Object.keys(settings.replay.timestamps)[lastKeyIndex];
            if (settings.replay.timestamps[lastKey] != historyEntry.time) {
                settings.replay.timestamps[stateMachine.historyLog.indexOf(historyEntry)] = historyEntry.time
            }
        });
        // Change the sliders max to historyLogs length
        document.getElementById("replay-range").setAttribute("max", (Object.keys(settings.replay.timestamps).length -1).toString());

        settings.ruler.zoomX += 50;
        // Clear selected elements and lines
        clearContext();
        clearContextLine();

        // Set mousemode to Pointer
        setMouseMode(0);

        stateMachine.scrubHistory(parseInt(document.getElementById("replay-range").value));

        // Change HTML DOM styling
        replayBox.style.visibility = "visible";
        optionsPane.style.visibility = "hidden";
        toolbar.style.visibility = "hidden";
        ruler.style.left = "0";
        zoomIndicator.style.bottom = "55px";
        zoomIndicator.style.left = "45px";
        replyMessage.style.visibility = "visible";
    }
    drawRulerBars(scrollx, scrolly);

    // Change the settings boolean for replay active
    settings.replay.active = !settings.replay.active;
}

/**
 * @description Toggles the list of keybinds.
 */
function toggleKeybindList()
{
    var element = document.getElementById("markdownKeybinds");
    if (element.style.display == "block") {
        element.style.display = "none";
    }
    else {
        element.style.display = "block";
    }
}


/** @description Gives the exit button its intended functionality to exit out of replay-mode */
function exitReplayMode()
{
    toggleReplay();
    setReplayRunning(false);
    clearInterval(stateMachine.replayTimer);
}

/**
 * @description Sets the replay-delay value
 */
function setReplayDelay(value)
{
    var replayDelayMap = {
        1: 0.1,
        2: 0.25,
        3: 0.50,
        4: 0.75,
        5: 1,
        6: 1.25,
        7: 1.5,
        8: 1.75,
        9: 2
    }
    settings.replay.delay = replayDelayMap[value];
    document.getElementById("replay-time-label").innerHTML = `Delay (${settings.replay.delay}s)`;
}
/**
 * @description Changes the play/pause button and locks/unlocks the sliders in replay-mode
 * @param {boolean} state The state if the replay-mode is running
 */
function setReplayRunning(state)
{
    var button = document.getElementById("diagram-replay-switch");
    var delaySlider = document.getElementById("replay-time");
    var stateSlider = document.getElementById("replay-range");

    if (state){
        button.innerHTML = '<div class="diagramIcons" onclick="clearInterval(stateMachine.replayTimer);setReplayRunning(false)"><img src="../Shared/icons/pause.svg"></div>';
        delaySlider.disabled = true;
        stateSlider.disabled = true;
    }else{
        button.innerHTML = '<div class="diagramIcons" onclick="stateMachine.replay()"><img src="../Shared/icons/Play.svg"></div>';
        delaySlider.disabled = false;
        stateSlider.disabled = false;
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
        document.getElementById("a4VerticalButton").style.display = "none";
        document.getElementById("a4HorizontalButton").style.display = "none";
        document.getElementById("a4TemplateToggle").style.backgroundColor = "#614875";
     } else {
        template.style.display = "block";
        document.getElementById("a4VerticalButton").style.display = "inline-block";
        document.getElementById("a4HorizontalButton").style.display = "inline-block";
        document.getElementById("a4TemplateToggle").style.backgroundColor = "#362049";
   }
   generateContextProperties();
}

function setA4SizeFactor(e){
    //store 1 + increased procent amount
    settings.grid.a4SizeFactor = parseInt(e.target.value)/100;


    updateA4Size();
}

function toggleA4Horizontal()
{
    document.getElementById("vRect").style.display = "block";
    if(document.getElementById("a4Rect").style.display = "block"){
        document.getElementById("a4Rect").style.display = "none";
    }
}

function toggleA4Vertical()
{
    document.getElementById("a4Rect").style.display = "block";
    if(document.getElementById("vRect").style.display = "block"){
        document.getElementById("vRect").style.display = "none";
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
    settings.grid.snapToGrid = !settings.grid.snapToGrid;

    // Color change of button to clarify if button is pressed or not
    if(settings.grid.snapToGrid)
    {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = "#362049";
    }
    else
    {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = "#614875";
    }
}

/**
 * @description Toggles weither the ruler is visible or not for the end user.
 */
function toggleRuler()
{
    var ruler = document.getElementById("rulerOverlay");
    var rulerToggleButton = document.getElementById("rulerToggle");
  
    // Toggle active class on button
    document.getElementById("rulerToggle").classList.toggle("active");

    // Toggle active ruler + color change of button to clarify if button is pressed or not
    if(settings.ruler.isRulerActive){
        ruler.style.display = "none";
        rulerToggleButton.style.backgroundColor = "#614875";
    } else {
        ruler.style.display = "block";
        rulerToggleButton.style.backgroundColor = "#362049";

    }
  
    settings.ruler.isRulerActive = !settings.ruler.isRulerActive;
    drawRulerBars(scrollx,scrolly);
}

/**
 * @description Changes what element will be constructed on next constructElementOfType call.
 * @param {Number} type What kind of element to place.
 * @see constructElementOfType
 */
function setElementPlacementType(type = elementTypes.EREntity)
{
    elementTypeSelected = type;
}

function holdPlacementButtonDown(num){
    mousePressed=true;
    if(document.getElementById("togglePlacementTypeBox"+num).classList.contains("activeTogglePlacementTypeBox")){
        mousePressed=false;
        togglePlacementTypeBox(num);
    }
    setTimeout(() => {
        if(!!mousePressed){
            togglePlacementTypeBox(num);
        }
    }, 500);
}
/**
 * @description resets the mousepress.
 */
function holdPlacementButtonUp(){
    mousePressed=false;
}
/**
 * @description toggles the box containing different types of placement entitys.
 * @param {Number} num the number connected to the element selected.
 */
function togglePlacementTypeBox(num){
    if(!document.getElementById("togglePlacementTypeButton"+num).classList.contains("activeTogglePlacementTypeButton")){ 
        for (let index = 0; index < document.getElementsByClassName("togglePlacementTypeButton").length; index++) {
            if(document.getElementsByClassName("togglePlacementTypeButton")[index].classList.contains("activeTogglePlacementTypeButton")) {
                document.getElementsByClassName("togglePlacementTypeButton")[index].classList.remove("activeTogglePlacementTypeButton");
            }
            if(document.getElementsByClassName("togglePlacementTypeBox")[index].classList.contains("activeTogglePlacementTypeBox")) {
                document.getElementsByClassName("togglePlacementTypeBox")[index].classList.remove("activeTogglePlacementTypeBox");
            }
        }       
        document.getElementById("togglePlacementTypeButton"+num).classList.add("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox"+num).classList.add("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement"+num).children.item(1).classList.remove("toolTipText");
        document.getElementById("elementPlacement"+num).children.item(1).classList.add("hiddenToolTiptext");
    }
    else{
        document.getElementById("elementPlacement"+num).children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement"+num).children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton"+num).classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox"+num).classList.remove("activeTogglePlacementTypeBox");
    }
}
/**
 * @description toggles which entity placement type is selected for the different types of diagrams.
 * @param {Number} num the number connected to the element selected.
 * @param {Number} type the type of element selected.
 */
function togglePlacementType(num,type){
    if(type==0){
        document.getElementById("elementPlacement0").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement4").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement0").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement0").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton0").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox0").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement4").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement4").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton4").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox4").classList.remove("activeTogglePlacementTypeBox");
    }
    else if(type==1){
        document.getElementById("elementPlacement1").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement5").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement1").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement1").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton1").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox1").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement5").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement5").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton5").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox5").classList.remove("activeTogglePlacementTypeBox");
    }
    document.getElementById("elementPlacement"+num).classList.remove("hiddenPlacementType");
}
/**
 * @description Increases the current zoom level if not already at maximum. This will magnify all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom towards the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event.
 */

function zoomin(scrollEvent = undefined)
{
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent){
        if (zoomfact < 4) {
            var midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));
                
            var delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
                x: midScreen.x - zoomOrigo.x,
                y: midScreen.y - zoomOrigo.y
            }

            //Update scroll x/y to center screen on new zoomOrigo
            scrollx = scrollx / zoomfact;
            scrolly = scrolly / zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx = scrollx * zoomfact;
            scrolly = scrolly * zoomfact;

            zoomOrigo.x = midScreen.x;
            zoomOrigo.y = midScreen.y;
        }

    }else if (zoomfact < 4.0){ // ELSE zoom towards mouseCoordinates
       var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

       if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
          
        var delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
               x: mouseCoordinates.x - zoomOrigo.x,
               y: mouseCoordinates.y - zoomOrigo.y
           }

           //Update scroll variables with delta in order to move the screen to the new zoom position
           scrollx = scrollx / zoomfact;
           scrolly = scrolly / zoomfact;
           scrollx += delta.x * zoomfact;
           scrolly += delta.y * zoomfact;
           scrollx = scrollx * zoomfact;
           scrolly = scrolly * zoomfact;

           //Set new zoomOrigo to the current mouse coordinates
           zoomOrigo.x = mouseCoordinates.x;
           zoomOrigo.y = mouseCoordinates.y;
           lastMousePosCoords = mouseCoordinates;

           //Save current mouse position (Position on the SCREEN, not coordinates in the diagram)
           lastZoomPos.x = scrollEvent.clientX;
           lastZoomPos.y = scrollEvent.clientY;
       }
       else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.

            zoomOrigo.x = lastMousePosCoords.x;
            zoomOrigo.y = lastMousePosCoords.y;
       }
    }


    //Update scroll variables to match the new zoomfact
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    if (zoomfact == 0.25) zoomfact = 0.5;
    else if (zoomfact == 0.5) zoomfact = 0.75;
    else if (zoomfact == 0.75) zoomfact = 1.0;
    else if (zoomfact == 1.0) zoomfact = 1.25;
    else if (zoomfact == 1.25) zoomfact = 1.5;
    else if (zoomfact == 1.5) zoomfact = 2.0;
    else if (zoomfact == 2.0) zoomfact = 4.0;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    
    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    updateGridSize();
    updateA4Size();
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
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent){
        if (zoomfact > 0.25) {
            var midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));
                
            var delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
                x: midScreen.x - zoomOrigo.x,
                y: midScreen.y - zoomOrigo.y
            }
  
            //Update scroll x/y to center screen on new zoomOrigo
            scrollx = scrollx / zoomfact;
            scrolly = scrolly / zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx = scrollx * zoomfact;
            scrolly = scrolly * zoomfact;

            zoomOrigo.x = midScreen.x;
            zoomOrigo.y = midScreen.y;
        }
    }else if (zoomfact > 0.25) { // ELSE zoom towards mouseCoordinates
        var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

        if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
           
         var delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
                x: mouseCoordinates.x - zoomOrigo.x,
                y: mouseCoordinates.y - zoomOrigo.y
            }
 
            //Update scroll variables with delta in order to move the screen to the new zoom position
            scrollx = scrollx / zoomfact;
            scrolly = scrolly / zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx = scrollx * zoomfact;
            scrolly = scrolly * zoomfact;
            
            //Set new zoomOrigo to the current mouse coordinatest
            zoomOrigo.x = mouseCoordinates.x;
            zoomOrigo.y = mouseCoordinates.y;
            lastMousePosCoords = mouseCoordinates;

            //Save current mouse position (Position on the SCREEN, not coordinates in the diagram)
            lastZoomPos.x = scrollEvent.clientX;
            lastZoomPos.y = scrollEvent.clientY;
        }
        else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.
 
             zoomOrigo.x = lastMousePosCoords.x;
             zoomOrigo.y = lastMousePosCoords.y;
        }
    }

    //Update scroll variables to match the new zoomfact
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    if (zoomfact == 0.5)zoomfact = 0.25;
    else if (zoomfact == 0.75)zoomfact = 0.5;
    else if (zoomfact == 1.0)zoomfact = 0.75;
    else if (zoomfact == 1.25)zoomfact = 1.0;
    else if (zoomfact == 1.5)zoomfact = 1.25;
    else if (zoomfact == 2.0)zoomfact = 1.5;
    else if (zoomfact == 4.0) zoomfact = 2.0;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    updateGridSize();
    updateA4Size();
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx,scrolly);
}
/**
 * @description Decreases or increases the zoomfactor to its original value zoomfactor = 1.0.
 */
function zoomreset()
{
    zoomOrigo.x = 0;
    zoomOrigo.y = 0;

    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;
   
    zoomfact = 1.0;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;
   
    //update the grid when reseting zoom
    updateGridSize();
    
    // Update scroll position
    showdata()
    
    //update the rulerbars when reseting zoomfact
    drawRulerBars(scrollx,scrolly);

}

/**
 * 
 * @description Zooms to lastZoomfactor from center of diagram.
 */
function zoomCenter(centerDiagram)
{
    zoomOrigo.x = centerDiagram.x;
    zoomOrigo.y = centerDiagram.y;

    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;
   
    zoomfact = lastZoomfact;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

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

    var propSet = document.getElementById("propertyFieldset");
    var str = "<legend>Properties</legend>";
/*     
    //a4 propteries
    if (document.getElementById("a4Template").style.display === "block") {
        str += `<text>Change the size of the A4</text>`;
        str += `<input type="range" onchange="setA4SizeFactor(event)" min="100" max="200" value ="${settings.grid.a4SizeFactor*100}" id="slider">`;
        str += `<br><button onclick="toggleA4Vertical()">Vertical</button>`;
        str += `<button onclick="toggleA4Horizontal()">Horizontal</button>`;
    } */

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
        } else if (element.kind == "UMLEntity") {      //<-- UML functionality , continue here 
            value = Object.values(umlState);
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

        // Creates button for selecting element background color
        str += `<div style="color: white">BG Color</div>`;
        str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
            `<span id="BGColorMenu" class="colorMenu"></span></button>`;
        str += `<div style="color: white">Stroke Color</div>`;
        str += `<button id="colorMenuButton2" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton2')" style="background-color: ${context[0].stroke}">` +
            `<span id="StrokeColorMenu" class="colorMenu"></span></button>`;

        str += `<br><br><input type="submit" value="Save" class='saveButton' onclick="changeState();saveProperties();displayMessage(messageTypes.SUCCESS, 'Successfully saved')">`;

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
        // If FROM or TO has an entity, print option for change if its not connected to an attribute
        if (findAttributeFromLine(contextLine[0]) == null){
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
        str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
        if(contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
        str += `/>`;
    }   

        str+=`<br><br><input type="submit" class='saveButton' value="Save" onclick="changeLineProperties();displayMessage(messageTypes.SUCCESS, 'Successfully saved')">`;
    }

    if (context.length > 1) {
        str += `<div style="color: white">BG Color</div>`;
        str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
            `<span id="BGColorMenu" class="colorMenu"></span></button>`;
        str += `<div style="color: white">Stroke Color</div>`;
        str += `<button id="colorMenuButton2" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton2')" style="background-color: ${context[0].stroke}">` +
            `<span id="StrokeColorMenu" class="colorMenu"></span></button>`;
    }

    if (context.length > 0) {
        var locked = true;
        for (var i = 0; i < context.length; i++) {
            if (!context[i].isLocked) {
                locked = false;
                break;
            }
        }
        str += `<br></br><input type="submit" id="lockbtn" value="${locked ? "Unlock" : "Lock"}" class="saveButton" onclick="toggleEntityLocked();">`;
    }

    propSet.innerHTML = str;

    multipleColorsTest();
}

/**
 * @description Toggles the option menu being open or closed.
 */
function toggleOptionsPane()
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
 * @description Generates a markdown file with a list of keybinds from file diagramkeybinds.md for all keybinds that are available in the diagram.
 */
function generateKeybindList()
{
    $.ajax({
        method: "GET",
        url: "diagramkeybinds.md",
    }).done(function(file) {
        document.getElementById("markdownKeybinds").innerHTML=parseMarkdown(file);
    });
}
/**
 * @description Modified the current ruler position to respective x and y coordinate. This DOM-element has an absolute position and does not change depending on other elements.
 * @param {Number} x Absolute x-position in pixels from the left of the inner window.
 * @param {Number} y Absolute y-position in pixels from the top of the inner window.
 */
function setRulerPosition(x, y) 
{
    //40 is the size of the actual ruler and 51 is the toolbar on the left side
    if(x >= 40 + 51) document.getElementById("ruler-x").style.left = x - 51 + "px";
    if(y >= 40) document.getElementById("ruler-y").style.top = y + "px";
}

/**
 * @description Performs an update to the current grid size depending on the current zoom level.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
function updateGridSize()
{
    var pxlength = (pixellength.offsetWidth/1000)*window.devicePixelRatio;
    settings.grid.gridSize = 10*pxlength;

    var bLayer = document.getElementById("grid");
    bLayer.setAttribute("width", settings.grid.gridSize * zoomfact + "px");
    bLayer.setAttribute("height", settings.grid.gridSize * zoomfact + "px");

    bLayer.children[0].setAttribute('d', `M ${settings.grid.gridSize * zoomfact} 0 L 0 0 0 ${settings.grid.gridSize * zoomfact}`);

    // Set width of origo line on the x axis
    bLayer = document.getElementById("origoX");
    bLayer.style.strokeWidth = settings.grid.origoWidth * zoomfact;

    // Set width of origo line on the y axis
    bLayer = document.getElementById("origoY");
    bLayer.style.strokeWidth = settings.grid.origoWidth * zoomfact;

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
    var vRect = document.getElementById("vRect");

    
    var pxlength = (pixellength.offsetWidth/1000)*window.devicePixelRatio;
    //const a4Width = 794, a4Height = 1122;
    const a4Width = 210*pxlength, a4Height = 297*pxlength;

    vRect.setAttribute("width", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");
    vRect.setAttribute("height", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");
    rect.setAttribute("width", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");
    rect.setAttribute("height", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");
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
    var vRect = document.getElementById("vRect");
    var text = document.getElementById("a4Text");

    vRect.setAttribute('x', OffsetX);
    vRect.setAttribute('y', OffsetY);

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
        var element = document.getElementById(settings.misc.errorMsgMap[timer].id); // TODO : SAME VARIABLE NAME AS OUTER SCOPE?????
        settings.misc.errorMsgMap[timer].percent -= 1;
        element.lastElementChild.style.width = `calc(${settings.misc.errorMsgMap[timer].percent - 1}% - 10px)`;

        // If the time is out, remove the message
        if(settings.misc.errorMsgMap[timer].percent === 0) removeMessage(element, timer);

    }, time / 100);

    // Adds to map: TimerID: ElementID, Percent
    settings.misc.errorMsgMap[timer] = {
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
        timer = Object.keys(settings.misc.errorMsgMap).find(key => {
            return settings.misc.errorMsgMap[key].id === element.id
        });
    }

    if (timer) {
        clearInterval(timer); // Remove the timer
        delete settings.misc.errorMsgMap[timer]; // Remove timer from the map
    }

    element.remove(); // Remove the element from DOM
    // Remove ID from randomidArray
    settings.misc.randomidArray = settings.misc.randomidArray.filter(id => {
        return element.id !== id;
    });
}

/**
 * @description Opens the color menu for selecting element color
 * @param {String} buttonID containing the ID of the button that was pressed
 */
function toggleColorMenu(buttonID)
{
    var button = document.getElementById(buttonID);
    var menu = undefined;
    var width = 0;

    // If the color menu's inner html is empty
    if (button.children[0].innerHTML == "") {
        menu = button.children[0];
        menu.style.visibility = "visible";
        if (menu.id === "BGColorMenu") {
            // Create svg circles for each element in the "colors" array
            for (var i = 0; i < colors.length; i++) { 
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="BGColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${colors[i]}" onclick="setElementColors('BGColorCircle${i}')" stroke="black" stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        } else {
            // Create svg circles for each element in the "strokeColors" array
            for (var i = 0; i < strokeColors.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="strokeColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${strokeColors[i]}" onclick="setElementColors('strokeColorCircle${i}')" stroke="black" stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        }

        // Menu position relative to button
        menu.style.width = width + "px";
        var buttonWidth = button.offsetWidth;
        var offsetWidth = window.innerWidth - button.getBoundingClientRect().x - (buttonWidth);
        var offsetHeight = button.getBoundingClientRect().y;
        menu.style.top = offsetHeight + "px";
        var menuOffset = window.innerWidth - menu.getBoundingClientRect().x - (width);
        menu.style.left = (menu.style.left + menuOffset) - (offsetWidth + buttonWidth) + "px";

    } else {    // if the color menu's inner html is not empty, remove the content
        var menu = button.children[0];
        menu.innerHTML = "";
        menu.style.visibility = "hidden";
        showdata();
    }
}

/**
 * @description Sets the fill and/or stroke color of all elements in context
 * @param {String} clickedCircleID containing the ID of the svg circle that was pressed
 */
function setElementColors(clickedCircleID)
{
    var id = clickedCircleID;
    var menu = document.getElementById(clickedCircleID).parentElement.parentElement;
    var elementIDs = [];

    // If fill button was pressed
    if (menu.id == "BGColorMenu") {
        var index = id.replace("BGColorCircle", "") * 1;
        var color = colors[index];
        for (var i = 0; i < context.length; i++) {
            context[i].fill = color;
            elementIDs[i] = context[i].id;
        }
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(elementIDs, { fill: color }),
        StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else if (menu.id == "StrokeColorMenu") {  // If stroke button was pressed
        var index = id.replace("strokeColorCircle", "") * 1;
        var color = strokeColors[index];
        for (var i = 0; i < context.length; i++) {
            context[i].stroke = color;
            elementIDs[i] = context[i].id;
        }
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(elementIDs, { stroke: color }),
        StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else {
        console.error(`${menu.id} is not a valid ID`);
    }
    
    generateContextProperties();
    showdata();
    toggleColorMenu(menu.parentElement.id); // toggle color menu off when a color is selected
}

/**
 * @description Tests if there are varying fill and/or stroke colors in the selected elements
 */
function multipleColorsTest()
{
    if (context.length > 1) {
        var fill = context[0].fill;
        var stroke = context[0].stroke;
        var varyingFills = false;
        var varyingStrokes = false;
        for (var i = 0; i < context.length; i++) {

            // Checks if there are varying fill colors, but not if varying colors have already been detected
            if (fill != context[i].fill && !varyingFills) {
                var button = document.getElementById("colorMenuButton1");
                button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                var textNode = document.createTextNode("Multiple Color Values");
                button.insertBefore(textNode, button.firstChild);
                varyingFills = true;
            }
            // Checks if there are varying stroke colors, but not if varying colors have already been detected
            if (stroke != context[i].stroke && !varyingStrokes) {
                var button = document.getElementById("colorMenuButton2");
                button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                var textNode = document.createTextNode("Multiple Color Values");
                button.insertBefore(textNode, button.firstChild);
                varyingStrokes = true;
            }
            // If varying colors have been detected in both of the above, there is no reason to continue the test
            if (varyingFills && varyingStrokes) break;
        }
    }
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

    if (toElementA.id === toElementB.id) {
        return 0;
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
    element.neighbours = {};

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

    if (felem.neighbours[telem.id] == undefined) {
        felem.neighbours[telem.id] = [line];
    } else {
        felem.neighbours[telem.id].push(line);
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
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true, successMessage = true, cardinal){

     // All lines should go from EREntity, instead of to, to simplify offset between multiple lines.
     if (toElement.kind == "EREntity"){
        var tempElement = toElement;
        toElement = fromElement;
        fromElement = tempElement;
    } 

    if (fromElement.kind == toElement.kind && fromElement.name == toElement.name) {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between: ${fromElement.name} and ${toElement.name}, they are the same element`);
        return;
    }

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

        // Check rules for Recursive relations
        if(fromElement.kind === "ERRelation" || toElement.kind === "ERRelation") {
            var relationID;
            if (fromElement.kind === "ERRelation") relationID = fromElement.id;
            else relationID = toElement.id;

            var linesFromRelation = lines.filter(line => {
                return line.fromID == relationID || line.toID == relationID
            });

            var connElemsIds = [];
            linesFromRelation.forEach(line => {
                if (line.fromID == relationID) connElemsIds.push(line.toID);
                else connElemsIds.push(line.fromID);
            });
            var hasRecursive = (connElemsIds.length == 2 && connElemsIds[0] == connElemsIds[1]);
            var hasOtherLines = (numOfExistingLines == 1 && connElemsIds.length >= 2);
            if (hasRecursive || hasOtherLines){
                displayMessage(messageTypes.ERROR, "Sorry, that is not possible");
                return;
            }
        }

        // If there is no existing lines or is a special case
        if (numOfExistingLines === 0 || (specialCase && numOfExistingLines <= 1)) {

            var newLine = {
                id: makeRandomID(),
                fromID: fromElement.id,
                toID: toElement.id,
                kind: kind
            };

            // If the new line has an entity FROM or TO, add a cardinality ONLY if it's passed as a parameter.
            if (findEntityFromLine(newLine) != null) {
                if(cardinal != undefined){
                    newLine.cardinality = cardinal;
                }
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

    var lengthConstant = 7; // Determines how "far inwards" on the element the line should have its origin and its end points.
    var x1Offset = 0;
    var x2Offset = 0;
    var y1Offset = 0;
    var y2Offset = 0;
    
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

    // Overwrite line positioning on recursive relations (2 lines pointing to same EREntity)
    var connections = felem.neighbours[telem.id].length;
    if (connections === 2) {
        var isFirst = felem.neighbours[telem.id][0].id === line.id;
        var fromRelation = felem.kind === "ERRelation";
        lengthConstant = 0;

        if (fromRelation) {            
            if (line.ctype == "BT") {
                fy = felem.cy;
                fx = (isFirst) ? felem.x1: felem.x2;
                
            } else if (line.ctype == "TB") {
                fy = felem.cy;
                fx = (isFirst) ? felem.x1: felem.x2;
            } else if (line.ctype == "RL") {
                fx = felem.cx;
                fy = (isFirst) ? felem.y1: felem.y2;
            } else if (line.ctype == "LR") {
                fx = felem.cx;
                fy = (isFirst) ? felem.y1: felem.y2;
            }

            if (isFirst) {
                telem.recursivePos = getPoint(tx, ty);
            } else {
                tx = telem.recursivePos.x;
                ty = telem.recursivePos.y;
                delete telem.recursivePos;
            }

        } else {
            if (line.ctype == "BT") {
                ty = telem.cy;
                tx = (isFirst) ? telem.x1: telem.x2;
            } else if (line.ctype == "TB") {
                ty = telem.cy;
                tx = (isFirst) ? telem.x1: telem.x2;
            } else if (line.ctype == "RL") {
                tx = telem.cx;
                ty = (isFirst) ? telem.y1: telem.y2;
            } else if (line.ctype == "LR") {
                tx = telem.cx;
                ty = (isFirst) ? telem.y1: telem.y2;
            }

            if (isFirst) {
                felem.recursivePos = getPoint(fx, fy);
            } else {
                fx = felem.recursivePos.x;
                fy = felem.recursivePos.y;
                delete felem.recursivePos;
            }
        }
    }

     // Used to draw the lines a bit longer to get rid of white-spaces.
    if ((fx > tx) && (line.ctype == "LR")){
        x1Offset = lengthConstant;
        x2Offset = -lengthConstant;
    } else if ((fx < tx) && (line.ctype == "RL")){
        x1Offset = -lengthConstant;
        x2Offset = lengthConstant;
    } else if ((fy > ty) && (line.ctype == "TB") ){
        y1Offset = lengthConstant;
        y2Offset = -lengthConstant;   
    } else if ((fy < ty) && (line.ctype == "BT") ){
        y1Offset = -lengthConstant;
        y2Offset = lengthConstant;   
    }
    
    if (line.kind == "Normal"){
        str += `<line id='${line.id}' x1='${fx + x1Offset}' y1='${fy + y1Offset}' x2='${tx + x2Offset}' y2='${ty + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`; 
    } else if (line.kind == "Double") {
        // We mirror the line vector
        dy = -(tx - fx);
        dx = ty - fy;
        var len = Math.sqrt((dx * dx) + (dy * dy));
        dy = dy / len;
        dx = dx / len;
        var cstmOffSet = 1.4;

       	str += `<line id='${line.id}-1' x1='${fx + (dx * strokewidth * 1.5) - cstmOffSet + x1Offset}' y1='${fy + (dy * strokewidth * 1.5) - cstmOffSet + y1Offset}' x2='${tx + (dx * strokewidth * 1.5) + cstmOffSet + x2Offset}' y2='${ty + (dy * strokewidth * 1.5) + cstmOffSet + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
        str += `<line id='${line.id}-2' x1='${fx - (dx * strokewidth * 1.5) - cstmOffSet + x1Offset}' y1='${fy - (dy * strokewidth * 1.5) - cstmOffSet + y1Offset}' x2='${tx - (dx * strokewidth * 1.5) + cstmOffSet + x2Offset}' y2='${ty - (dy * strokewidth * 1.5) + cstmOffSet + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
    }

    if (contextLine.includes(line)) {

        var x = (fx + tx) /2;
        var y = (fy + ty) /2;
        str += `<rect x="${x-(2 * zoomfact)}" y="${y-(2 * zoomfact)}" width='${4 * zoomfact}' height='${4 * zoomfact}' stroke="black" stroke-width="3"/>`;
    }

    // If the line got cardinality
    if (line.cardinality) {

        const offsetOnLine = 20 * zoomfact;
        var offset = Math.round(zoomfact * textheight / 2);
        var posX, posY;
        var distance = Math.sqrt(Math.pow((tx - fx), 2) + Math.pow((ty - fy), 2));

        // Used to tweak the cardinality position when the line gets very short.
        var tweakOffset = 0.30; 

        if(findEntityFromLine(line) == -1){
            if(offsetOnLine > distance *0.5){
                posX = fx + (offsetOnLine * (tx - fx) / distance) * tweakOffset;
                posY = fy + (offsetOnLine * (ty - fy) / distance) * tweakOffset;
            }else{
                // Set position on line for the given offset
                posX = fx + (offsetOnLine * (tx - fx) / distance);
                posY = fy + (offsetOnLine * (ty - fy) / distance);
            }


            /*
            * Depending on the side of the element that the line is connected to
            * and the number of lines from that side, set the offset.
            * */
            if (line.ctype == "TB") {
                if (felem.top.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
            }else if(line.ctype == "BT"){
                if (felem.bottom.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
            }else if(line.ctype == "RL"){
                if (felem.right.indexOf(line.id) == 0) posY -= offset;
                else if (felem.right.indexOf(line.id) == felem.right.length - 1) posY += offset;
            }else if (line.ctype == "LR") {
                if (felem.left.indexOf(line.id) == 0) posY -= offset;
                else if (felem.left.indexOf(line.id) == felem.left.length - 1) posY += offset;
            }
        } else {
            if(offsetOnLine > distance *0.5){
                posX = fx + (offsetOnLine * (tx - fx) / distance) * tweakOffset;
                posY = fy + (offsetOnLine * (ty - fy) / distance) * tweakOffset;
            }else{
                // Set position on line for the given offset
                posX = fx + (offsetOnLine * (tx - fx) / distance);
                posY = fy + (offsetOnLine * (ty - fy) / distance);
            }

            /*
            * Depending on the side of the element that the line is connected to
            * and the number of lines from that side, set the offset.
            * */
            if (line.ctype == "TB") {
                if (telem.bottom.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
            }else if(line.ctype == "BT"){
                if (telem.top.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
            }else if(line.ctype == "RL"){
                if (telem.left.indexOf(line.id) == 0) posY -= offset;
                else if (telem.left.indexOf(line.id) == felem.left.length - 1) posY += offset;
            }else if (line.ctype == "LR") {
                if (telem.right.indexOf(line.id) == 0) posY -= offset;
                else if (telem.right.indexOf(line.id) == felem.right.length - 1) posY += offset;
            }
        }

        // Add the line to the str
        str += `<text dominant-baseline="middle" text-anchor="middle" style="font-size:${Math.round(zoomfact * textheight)}px;" x="${posX}" y="${posY}">${lineCardinalitys[line.cardinality]}</text>`
    }

    if (line.label && line.label != ""){
        //Get width of label's text through canvas 
        var height = Math.round(zoomfact * textheight);
        var canvas = document.getElementById('canvasOverlay');
        var canvasContext = canvas.getContext('2d');

        var font = canvasContext.font;
        font = `${height}px ${font.split('px')[1]}`;
        canvasContext.font = font;
        var textWidth = canvasContext.measureText(line.label).width;
        
        var centerX = (tx + fx) / 2;
        var centerY = (ty + fy) / 2;
        var lowY= Math.min(ty,fy);
        var highY= Math.max(ty,fy);
        var lowX= Math.min(tx,fx);
        var highX= Math.max(tx,fx);
        var labelPosX = (tx+fx)/2 - ((textWidth) + zoomfact * 8)/2;
        var labelPosY = (ty+fy)/2 - ((textheight / 2) * zoomfact + 4 * zoomfact);
        lineLabel={id: line.id+"Label",labelLineID: line.id, centerX: centerX, x: labelPosX, centerY: centerY, y: labelPosY, width: textWidth + zoomfact * 4, height: textheight * zoomfact + zoomfact * 3, labelMovedX: 0 * zoomfact, labelMovedY: 0 * zoomfact, lowY: lowY, highY: highY, lowX: lowX, highX: highX, procentOfLine: 0};
        for(var i=0;i<lineLabelList.length;i++){
            if(lineLabelList[i].labelLineID==line.id){
                lineLabel.procentOfLine = lineLabelList[i].procentOfLine;
                if(fx<lineLabel.centerX){
                    lineLabel.labelMovedX = -lineLabel.procentOfLine * (lineLabel.highX-lineLabel.lowX);
                }
                else if(fx>lineLabel.centerX){
                    lineLabel.labelMovedX = lineLabel.procentOfLine * (lineLabel.highX-lineLabel.lowX);
                }
                if(fy<lineLabel.centerY){
                    lineLabel.labelMovedY = -lineLabel.procentOfLine * (lineLabel.highY-lineLabel.lowY);
                }
                else if(fy>lineLabel.centerY){
                    lineLabel.labelMovedY = lineLabel.procentOfLine * (lineLabel.highY-lineLabel.lowY);
                }
                lineLabelList.splice(i,1);
            }
        }
        lineLabelList.push(lineLabel);
        //Add background, position and size is determined by text and zoom factor <-- Consider replacing magic numbers
        str += `<rect id=${line.id + "Label"} x="${labelPosX+lineLabel.labelMovedX}" y="${labelPosY+lineLabel.labelMovedY}" width="${(textWidth + zoomfact * 4)}" height="${textheight * zoomfact + zoomfact * 3}" style="fill:rgb(255,255,255);" />`
        //Add label
        str += `<text dominant-baseline="middle" text-anchor="middle" style="font-size:${Math.round(zoomfact * textheight)}px;" x="${centerX-(2 * zoomfact)+lineLabel.labelMovedX}" y="${centerY-(2 * zoomfact)+lineLabel.labelMovedY}">${line.label}</text>`;
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

    // Remove all neighbour maps from elements
    for (var i = 0; i < data.length; i++){
        delete data[i].neighbours;
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
    nodes += "<span id='mr' class='node mr'></span>";
    nodes += "<span id='ml' class='node ml'></span>";
    elementDiv.innerHTML += nodes;

    // This is the standard node size
    const defaultNodeSize = 8;

    var nodeSize = defaultNodeSize*zoomfact;
    var mrNode = document.getElementById("mr");
    var mlNode = document.getElementById("ml");
    mrNode.style.width = nodeSize+"px";
    mlNode.style.width = nodeSize+"px";
    mrNode.style.height = nodeSize+"px";
    mlNode.style.height = nodeSize+"px";
    mrNode.style.top = "calc(50% - "+(nodeSize/2)+"px)";
    mlNode.style.top = "calc(50% - "+(nodeSize/2)+"px)";
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
    if(!settings.ruler.isRulerActive) return;
    
    svgX = document.getElementById("ruler-x-svg");
    svgY = document.getElementById("ruler-y-svg");
    //Settings - Ruler

    var pxlength = (pixellength.offsetWidth/1000)*window.devicePixelRatio;
    const lineRatio1 = 1;
    const lineRatio2 = 10;
    const lineRatio3 = 100;
    
    var barY, barX = "";
    const color = "black";
    var cordY = 0;
    var cordX = 0;
    settings.ruler.ZF = 100 * zoomfact;
    var pannedY = (Y - settings.ruler.ZF) / zoomfact;
    var pannedX = (X - settings.ruler.ZF) / zoomfact;
    settings.ruler.zoomX = Math.round(((0 - zoomOrigo.x) * zoomfact) +  (1.0 / zoomfact));
    settings.ruler.zoomY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (1.0 / zoomfact));


    if(zoomfact < 0.5){
        var verticalText = "writing-mode= 'vertical-lr'";
    }else {
        var verticalText = " ";
    }
    
    //Draw the Y-axis ruler positive side.
    var lineNumber = (lineRatio3 - 1);
    for (i = 100 + settings.ruler.zoomY; i <= pannedY -(pannedY *2) + cheight ; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
         
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' stroke='"+color+"' />";
            barY += "<text x='10' y='"+(pannedY+i+10)+"'style='font-size: 10px'>"+cordY+"</text>";
            cordY = cordY +10;
        }else if(zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
            //centi
            barY += "<line x1='25px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' stroke='"+color+"' />";
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barY += "<text x='20' y='"+(pannedY+i+10)+"'style='font-size: 8px'>"+(cordY-10+lineNumber/10)+"</text>";
            }
        }else if (zoomfact > 0.75){
            //milli
            barY += "<line x1='35px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' stroke='"+color+"' />";
        } 
    }

    //Draw the Y-axis ruler negative side.
    lineNumber = (lineRatio3 - 100);
    cordY = -10;
    for (i = -100 - settings.ruler.zoomY; i <= pannedY; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
         
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' stroke='"+color+"' />";
            barY += "<text x='10' y='"+(pannedY-i+10)+"' style='font-size: 10px'>"+cordY+"</text>";
            cordY = cordY -10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            barY += "<line x1='25px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' stroke='"+color+"' />";
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barY += "<text x='20' y='"+(pannedY-i+10)+"' style='font-size: 8px'>"+(cordY+10-lineNumber/10)+"</text>";
            }
        }else if (zoomfact > 0.75){
            //milli
            barY += "<line x1='35px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' stroke='"+color+"' />";
        }
    }
    svgY.style.backgroundColor = "#e6e6e6";
    svgY.style.boxShadow ="3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis
    
    //Draw the X-axis ruler positive side.
    lineNumber = (lineRatio3 - 1);
    for (i = 51 + settings.ruler.zoomX; i <= pannedX - (pannedX *2) + cwidth; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barX += "<line x1='" +(i+pannedX)+"' y1='0' x2='" + (i+pannedX) + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(i+5+pannedX)+"'"+verticalText+"' y='15' style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX +10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            barX += "<line x1='" +(i+pannedX)+"' y1='25' x2='" +(i+pannedX)+"' y2='40px' stroke='" + color + "' />";
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barX += "<text x='"+(i+5+pannedX)+"'"+verticalText+"' y='25' style='font-size: 8px'>"+(cordX-10+lineNumber/10)+"</text>";
            }
        }else if (zoomfact > 0.75){
            //milli
            barX += "<line x1='" +(i+pannedX)+"' y1='35' x2='" +(i+pannedX)+"' y2='40px' stroke='" + color + "' />";
        }
    }

    //Draw the X-axis ruler negative side.
    lineNumber = (lineRatio3 - 100);
    cordX = -10;
    for (i = -51 - settings.ruler.zoomX; i <= pannedX; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barX += "<line x1='" +(pannedX-i)+"' y1='0' x2='" + (pannedX-i) + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(pannedX-i+5)+"'"+verticalText+"' y='15'style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX -10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            barX += "<line x1='" +(pannedX-i)+"' y1='25' x2='" +(pannedX-i)+"' y2='40px' stroke='" + color + "' />";
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barX += "<text x='"+(pannedX-i+5)+"'"+verticalText+"' y='25'style='font-size: 8px'>"+(cordX+10-lineNumber/10)+"</text>";
            }
        }else if (zoomfact > 0.75){
            //milli
            barX += "<line x1='" +(pannedX-i)+"' y1='35' x2='" +(pannedX-i)+"' y2='40px' stroke='" + color + "' />";
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
    var elemAttri = 2;          //<-- UML functionality This is hardcoded will be calcualted in issue regarding options panel
                                //This value represents the amount of attributes, hopefully this will be calculated through
                                //an array in the UML document that contains the element's attributes.

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
    const margin = 10 * zoomfact;
    var tooBig = (textWidth >= (boxw - (margin * 2)));
    var xAnchor = tooBig ? margin : hboxw;
    var vAlignment = tooBig ? "left" : "middle";

    //=============================================== <-- UML functionality
    //Check if the element is a UML entity
    if (element.kind == "UMLEntity") {  
        //div to encapuslate UML element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' 
        style='left:0px; top:0px; width:${boxw}px;font-size:${texth}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostLine ? 0 : 0.5};`;
        }
        str += `'>`;

        //div to encapuslate UML header
        str += `<div class='uml-header' style='width: ${boxw}; height: ${boxh};'>`; 
        //svg for UML header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
        <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        str += `</svg>`;
        //end of svg for UML header
        str += `</div>`;
        //end of div for UML header

        //div to encapuslate UML content
        str += `<div class='uml-content' style='margin-top: ${-8 * zoomfact}px;'>`;
        //svg for background
        str += `<svg width='${boxw}' height='${boxh * elemAttri}'>`;
        str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh * elemAttri - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
        for (var i = 0; i < elemAttri; i++) {
            str += `<text x='${xAnchor}' y='${hboxh + boxh * i}' dominant-baseline='middle' text-anchor='${vAlignment}'>- Attri ${i}</text>`;
        }
        //end of svg for background
        str += `</svg>`;
        
        /*
        //div for UML attribute <-- Will be implemented in upcoming issues
        str += `<div>`;
        //end of div for UML attribute
        str += `</div>`;*/

        //div for UML footer
        str += `<div class='uml-footer' style='margin-top: ${-8 * zoomfact}px;'>`;
        //svg for background
        str += `<svg width='${boxw}' height='${boxh / 2}'>`;
        str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
        //end of svg for background
        str += `</svg>`;
        //end of div for UML footer
        str += `</div>`;
        //end of div for UML content
        str += `</div>`;
    }
    //====================================================================

    //ER elementss
    else {
        // Create div & svg element
        str += `
                    <div id='${element.id}'	class='element' onmousedown='ddown(event);' style='
                            left:0px;
                            top:0px;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        if(context.includes(element)){
            str += `z-index: 1;`;
        }
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
                stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' /> 
                `;         
            }
            
            str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
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
                        stroke='${element.stroke}' fill='${element.fill}' stroke-width='${linew}' />`;
            }    

            str += `<path d="M${linew},${hboxh} 
                            Q${linew},${linew} ${hboxw},${linew} 
                            Q${boxw - linew},${linew} ${boxw - linew},${hboxh} 
                            Q${boxw - linew},${boxh - linew} ${hboxw},${boxh - linew} 
                            Q${linew},${boxh - linew} ${linew},${hboxh}" 
                        stroke='${element.stroke}' fill='${element.fill}' ${dash} stroke-width='${linew}'/>
                        
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
                str += `<line x1="${xAnchor - textWidth / 2 + diff}" y1="${hboxh + texth * 0.5 + 1}" x2="${xAnchor + textWidth / 2 + diff}" y2="${hboxh + texth * 0.5 + 1}" stroke="${element.stroke}" stroke-dasharray="${5*zoomfact}" stroke-width="${linew}"/>`;
            }
            
        }
        else if (element.kind == "ERRelation") {

            var numOfLetters = element.name.length;
            if (tooBig) {
                var tempName = "";
                var maxTextWidth = boxw - margin;

                if (element.state == "weak") maxTextWidth -= (linew * multioffs) * 2;

                for (var i = 0; i < element.name.length; i++){
                    tempName += element.name[i];
                    if (canvasContext.measureText(tempName).width > maxTextWidth){
                        numOfLetters = tempName.length - 1;
                        break;
                    }
                }
            }

            var weak = "";
            if (element.state == "weak") {
                weak = `<polygon points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}'/>
                    `;
                xAnchor += linew * multioffs;
            }
            str += `<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}'/>
                    ${weak}`;
            str += `<text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name.slice(0, numOfLetters)}</text>`;

        }
        str += "</svg>";
    }
    if (element.isLocked) {
        str += `<img id="pad_lock" width='${zoomfact *20}' height='${zoomfact *25}' src="../Shared/icons/pad_lock.svg"/>`;     
    }
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
    if (context.length === 1 && mouseMode == mouseModes.POINTER && context[0].kind != "ERRelation") addNodes(context[0]);
    

}
/**
 * @description Updates the Label position on the line.
 * @param {Interger} newPosX The position the mouse is at in the X-axis.
 * @param {Interger} newPosY The position the mouse is at in the Y-axis.
 */
function updateLabelPos(newPosX, newPosY)
{   
    // Getting the lines start and end points.
    if(document.getElementById(targetLabel.labelLineID)){
        currentline = {
            x1: document.getElementById(targetLabel.labelLineID).getAttribute("x1"),
            x2: document.getElementById(targetLabel.labelLineID).getAttribute("x2"),
            y1: document.getElementById(targetLabel.labelLineID).getAttribute("y1"),
            y2: document.getElementById(targetLabel.labelLineID).getAttribute("y2")
        };
    }
    // If its a double line getting the lines start and end points.
    else if(document.getElementById(targetLabel.labelLineID+"-1")){
        currentline = {
            x1: document.getElementById(targetLabel.labelLineID+"-1").getAttribute("x1"),
            x2: document.getElementById(targetLabel.labelLineID+"-1").getAttribute("x2"),
            y1: document.getElementById(targetLabel.labelLineID+"-1").getAttribute("y1"),
            y2: document.getElementById(targetLabel.labelLineID+"-1").getAttribute("y2")
        };
    }
    // Coefficients of the general equation of the current line the labels on.
    lineCoeffs = {
        a: (currentline.y1 - currentline.y2),
        b: (currentline.x2 - currentline.x1),
        c: ((currentline.x1 - currentline.x2)*currentline.y1 + (currentline.y2-currentline.y1)*currentline.x1)
    }
    var distance = (Math.abs(lineCoeffs.a*newPosX + lineCoeffs.b*newPosY + lineCoeffs.c)) / Math.sqrt(lineCoeffs.a*lineCoeffs.a + lineCoeffs.b*lineCoeffs.b);
    // Constraints the label to within the box, within 30pixels from the line and half a width from the end.
    if(newPosX < targetLabel.highX && newPosX > targetLabel.lowX ){
        if (distance < 30) {
            if(newPosX<targetLabel.lowX+targetLabel.width/2){
                targetLabel.labelMovedX = (newPosX - targetLabel.centerX+targetLabel.width/2);
            }
            else if(newPosX>targetLabel.highX-targetLabel.width/2){
                targetLabel.labelMovedX = (newPosX - targetLabel.centerX-targetLabel.width/2);
            }
            else{
                targetLabel.labelMovedX = (newPosX - targetLabel.centerX);
            }
        }
    }
    // Constraints the label to within the box, within 30pixels from the line and half a height from the end.
    if(newPosY < targetLabel.highY && newPosY > targetLabel.lowY){        
        if (distance < 30) {
            if(newPosY<targetLabel.lowY+targetLabel.height/2){
                targetLabel.labelMovedY = (newPosY - targetLabel.centerY + targetLabel.height/2);
            }
            else if(newPosY>targetLabel.highY-targetLabel.height/2){
                targetLabel.labelMovedY = (newPosY - targetLabel.centerY - targetLabel.height/2);
            }
            else{
                targetLabel.labelMovedY = (newPosY - targetLabel.centerY);
            }
        }
    }
    // Math to calculate procentuall distance from/to centerpoint
    var diffrenceX = targetLabel.highX-targetLabel.lowX;
    var diffrenceY = targetLabel.highY-targetLabel.lowY;
    var distanceToX1 = targetLabel.centerX + targetLabel.labelMovedX - currentline.x1;
    var distanceToY1 = targetLabel.centerY + targetLabel.labelMovedY - currentline.y1;
    var lenghtToNewPos = Math.abs(Math.sqrt(distanceToX1*distanceToX1 + distanceToY1*distanceToY1));
    var entireLinelenght = Math.abs(Math.sqrt(diffrenceX*diffrenceX+diffrenceY*diffrenceY));
    targetLabel.procentOfLine = lenghtToNewPos/entireLinelenght;
    // Making sure the procent is less than 0.5 to be able to use them from the centerpoint of the line as well as ensuring the direction is correct 
    if(targetLabel.procentOfLine < 0.5){
        targetLabel.procentOfLine = 1 - targetLabel.procentOfLine;
        targetLabel.procentOfLine = targetLabel.procentOfLine - 0.5 ;
    } else if (targetLabel.procentOfLine > 0.5){
        targetLabel.procentOfLine = -(targetLabel.procentOfLine - 0.5) ;
    }

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
    deleteBtnX = 0;
    deleteBtnY = 0;
    deleteBtnSize = 0;

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

        // Selection container of selected elements
        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}'; style="fill:transparent;stroke-width:2;stroke:rgb(75,75,75);stroke-dasharray:10 5;" />`;

        //Determine size and position of delete button
        if (highX - lowX + 10 > highY - lowY + 10) {
            deleteBtnSize = (highY - lowY + 10) / 4;
        }
        else {
            deleteBtnSize = (highX - lowX + 10) / 4;
        }
        
        if (deleteBtnSize > 15) {
            deleteBtnSize = 15;
        }
        else if (deleteBtnSize < 10) {
            deleteBtnSize = 10;
        }

        deleteBtnX = lowX - 5 + highX - lowX + 10 - deleteBtnSize;
        deleteBtnY = lowY - 5;

        //Delete button visual representation
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + deleteBtnSize - 2}' style='stroke:rgb(0,0,0);stroke-width:2'/>`;
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + deleteBtnSize - 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + 2}' style='stroke:rgb(0,0,0);stroke-width:2'/>`;
    }

    if(context.length > 1 || contextLine.length > 0 && context.length > 0){
        var tempX1 = 0;
        var tempX2 = 0;
        var tempY1 = 0;
        var tempY2 = 0;

        for(var i = 0; i < context.length; i++){
            tempX1 = context[i].x1;
            tempX2 = context[i].x2;
            tempY1 = context[i].y1;
            tempY2 = context[i].y2;
            str += `<rect width='${tempX2 - tempX1 + 4}' height='${tempY2 - tempY1 + 4}' x= '${tempX1 - 2}' y='${tempY1 - 2}'; style="fill:transparent;stroke-width:2; stroke:rgb(75,75,75); stroke-dasharray:5 5;" />`;
        }
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
            top = Math.round((((elementData.y - zoomOrigo.y)-25) * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta){
            left -= deltaX;
            top -= deltaY;
        }

        if (settings.grid.snapToGrid && useDelta) {
            if (element.kind == "EREntity"){
                // The element coordinates with snap point
                var objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact))-150) / settings.grid.gridSize) * settings.grid.gridSize;
                var objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;
                
                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x)+250)* zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y)-25) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
                
            } 
            else if (element.kind != "EREntity"){
                // The element coordinates with snap point
                var objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact))-150) / settings.grid.gridSize) * settings.grid.gridSize;
                var objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize * 0.5)) * (settings.grid.gridSize * 0.5);
                
                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x)+200) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y)-25) * zoomfact) + (scrolly * (1.0 / zoomfact)));
            
                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
                
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

//#region ================================ Camera Functions     ================================
/**
 * @description Centers the camera between the highest and lowest x and y values of all elements
 */
 function centerCamera()
 {
     // Calculate min and max x and y values for all elements combined, and then find their averages
     lastZoomfact = zoomfact;
     zoomfact = 1;
     var maxX = undefined;
     var maxY = undefined;
     var minX = undefined;
     var minY = undefined;
     for (var i = 0; i < data.length; i++) {
         if (maxX == undefined || data[i].x + data[i].width > maxX) maxX = data[i].x + data[i].width;
         if (minX == undefined || data[i].x < minX) minX = data[i].x;
         if (maxY == undefined || data[i].y + data[i].height > maxY) maxY = data[i].y + data[i].height;
         if (minY == undefined || data[i].y < minY) minY = data[i].y;
     }
 
     // Center of screen in pixels
     var centerScreen = {
         x: window.innerWidth / 2,
         y: window.innerHeight / 2
     };
 
     // Center of diagram in coordinates
     var centerDiagram = {
         x: minX + (maxX - minX) / 2,
         y: minY + (maxY - minY) / 2
     };
 
     // Move camera to center of diagram
     scrollx = centerDiagram.x * zoomfact;
     scrolly = centerDiagram.y * zoomfact;
 
     var middleCoordinate = screenToDiagramCoordinates(centerScreen.x, centerScreen.y);
     document.getElementById("zoom-message").innerHTML = zoomfact + "x";

 
     scrollx = middleCoordinate.x;
     scrolly = middleCoordinate.y;
 
     // Update screen
     showdata();
     updatepos();
     updateGridPos();
     updateGridSize();
     drawRulerBars(scrollx, scrolly);
     updateA4Pos();
     updateA4Size();
     zoomCenter(centerDiagram);
 }
//#endregion =====================================================================================
//#region ================================   LOAD AND EXPORTS    ==================================
/**
 * @description Create and download a file
 * @param {String} filename The name of the file that get generated
 * @param {*} dataObj The text content of the file
 */
function downloadFile(filename, dataObj)
{
    // Create a "a"-element
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataObj)));
    element.setAttribute('download', filename + ".json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
/**
 * @description Prepares data for file creation, retrieves history and initialState
 */
function saveDiagram()
{

    displayMessage(messageTypes.SUCCESS, "Generating the save file..");

    // Remove all future states to the history
    stateMachine.removeFutureStates();

    // The content of the save file
    var objToSave = {
        historyLog: stateMachine.historyLog,
        initialState: stateMachine.initialState
    };

    // Download the file
    downloadFile("diagram", objToSave);
}
/**
 * @description Prepares data for file creation, retrieves data and lines, also filter unnecessary values
 */
function exportDiagram()
{
    displayMessage(messageTypes.SUCCESS, "Generating the export file..");
    var objToSave = {
        data: [],
        lines: [],
    };
    var keysToIgnore = ["top", "left", "right", "bottom", "x1", "x2", "y1", "y2", "cx", "cy"];
    data.forEach(obj => {
        var filteredObj = {
            kind: obj.kind
        };

        Object.keys(obj).forEach(objKey => {
            // If they key is ignore => return
            if (keysToIgnore.includes(objKey)) return;

            // Ignore defaults
            if (defaults[obj.kind][objKey] != obj[objKey]){
                // Add to filterdObj
                filteredObj[objKey] = obj[objKey];
            }
        });
        objToSave.data.push(filteredObj);
    });

    keysToIgnore = ["dx", "dy", "ctype"]
    lines.forEach(obj => {
        var filteredObj = {};
        Object.keys(obj).forEach(objKey => {
            // If they key is ignore => return
            if (keysToIgnore.includes(objKey)) return;

            if (defaultLine[objKey] != obj[objKey]){
                filteredObj[objKey] = obj[objKey];
            }
        });
        objToSave.lines.push(filteredObj);
    });
    

    // Download the file
    downloadFile("diagram", objToSave);
}
/**
 * @description Gets the content of the file in parameter.
 * @param {File} files The file to get the content of
 * @return The content of the file
 */
function getFileContent(files)
{
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
    
        reader.onload = () => {
          resolve(reader.result);
        };
    
        reader.onerror = reject;
    
        reader.readAsText(files);
      })
}
/**
 * @description Load the content of a file to the diagram-data. This will remove previous data
 */
async function loadDiagram(file = null, shouldDisplayMessage = true)
{
    if (file === null){
        var fileInput = document.getElementById("importDiagramFile");

        // If not an json-file is inputted => return
        if (getExtension(fileInput.value) != "json"){
            if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Sorry, you cant load that type of file. Only json-files is allowed");
            return;
        }

        try{
            // Get filepath
            var file1 = fileInput.files[0];
            var temp = await getFileContent(file1);
            temp = JSON.parse(temp);
        } catch(error){
            console.error(error);
        }
    }else {
        temp = file;
    }


    if(temp.historyLog && temp.initialState){
        // Set the history and initalState to the values of the file
        stateMachine.historyLog = temp.historyLog;
        stateMachine.initialState = temp.initialState;

        // Update the stateMachine to the latest current index
        stateMachine.currentHistoryIndex = stateMachine.historyLog.length -1;

        // Scrub to the latest point in the diagram
        stateMachine.scrubHistory(stateMachine.currentHistoryIndex);

        // Display success message for load
        if (shouldDisplayMessage) displayMessage(messageTypes.SUCCESS, "Save-file loaded");

    } else if(temp.data && temp.lines){
        // Set data and lines to the values of the export file
        temp.data.forEach(element => {
            var elDefault = defaults[element.kind];
            Object.keys(elDefault).forEach(defaultKey => {
                if (!element[defaultKey]){
                    element[defaultKey] = elDefault[defaultKey];
                }
            });
        });
        temp.lines.forEach(line => {
            Object.keys(defaultLine).forEach(defaultKey => {
                if (!line[defaultKey]){
                    line[defaultKey] = defaultLine[defaultKey];
                }
            });
        });

        // Set the vaules of the intialState to the JSON-file
        stateMachine.initialState.elements = temp.data;
        stateMachine.initialState.lines = temp.lines;

        // Goto the beginning of the diagram
        stateMachine.gotoInitialState();

        // Remove the previous history
        stateMachine.currentHistoryIndex = -1;
        stateMachine.lastFlag = {};
        stateMachine.removeFutureStates();

        // Display success message for load
        if (shouldDisplayMessage) displayMessage(messageTypes.SUCCESS, "Export-file loaded");
    }else{
        if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Error, cant load the given file");
    }
}
//#endregion =====================================================================================
