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
                                isSoft = changeType[index].isSoft;
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
        if (this.currentHistoryIndex == -1) {return;}
        else {
            this.currentHistoryIndex--;
            console.log(this.currentHistoryIndex);
        }

        // Remove ghost only if stepBack while creating edge
        if (mouseMode === mouseModes.EDGE_CREATION) clearGhosts()

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
        var startDelay = settings.replay.delay;
        this.replayTimer = setInterval(function replayInterval() {

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

                if (settings.replay.delay != startDelay){
                    clearInterval(self.replayTimer);
                    this.replay();
                }
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
        PLACE_IEENTITY: {key: "8", ctrl: false},       //<-- IE functionality
        IE_INHERITANCE: { key: "9", ctrl: false },  //<-- IE inheritance functionality
        PLACE_SDENTITY: { key: "1", ctrl: true },   //<-- SD functionality
        ZOOM_IN: {key: "+", ctrl: true, meta: true},
        ZOOM_OUT: {key: "-", ctrl: true, meta: true},
        ZOOM_RESET: {key: "0", ctrl: true, meta: true},
        TOGGLE_A4: {key: "p", ctrl: false, meta: false},
        TOGGLE_GRID: {key: "g", ctrl: false},
        TOGGLE_RULER: {key: "t", ctrl: false},
        TOGGLE_SNAPGRID: {key: "s", ctrl: false},
        TOGGLE_DARKMODE: {key: "d", ctrl: false},
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
        TOGGLE_REPLAY_MODE: {key: "r", ctrl: false},
        TOGGLE_ER_TABLE: {key: "e", ctrl: false},
        TOGGLE_ERROR_CHECK:  {key: "h", ctrl: false},
        STATE_INITIAL: { key: "<" , ctrl: false },
        STATE_FINAL: { key: "f" , ctrl: false },
        STATE_SUPER: { key: ">", ctrl: false },
        Save_diagram: { key: "s", ctrl: true }, //<-- SD functionality
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
    UMLRelation: 5, //<-- UML functionality
    IEEntity: 6,       //<-- IE functionality
    IERelation: 7, // IE inheritance functionality

    SDEntity: 8,////SD(State diagram) functionality
    UMLInitialState: 9,
    UMLFinalState: 10,
    UMLSuperState: 11,

    sequenceActorAndObject:12, //sequence functionality
    sequenceActivation: 13,
    sequenceLoopOrAlt: 14
    
};

/**
 * @description Same as const elementTypes, but uses their names instead of numbers.
 * @see generateErTableString() For comparing elements with this enum.
 */
const elementTypesNames = {
    EREntity: "EREntity",
    ERRelation: "ERRelation",
    ERAttr: "ERAttr",
    Ghost: "Ghost",
    UMLEntity: "UMLEntity",
    IEEntity: "IEEntity",
    IERelation: "IERelation",

    SDEntity: "SDEntity",

    UMLInitialState: "UMLInitialState",
    UMLFinalState: "UMLFinalState",

    UMLSuperState: "UMLSuperState",

    sequenceActorAndObject: "sequenceActorAndObject",
    sequenceActivation: "sequenceActivation",
    sequenceLoopOrAlt: "sequenceLoopOrAlt",

}

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
    CANDIDATE: "candidate",
    PRIMARY: "primary",
    COMPUTED: "computed",
};

/**
 * @description Available types of entity, ie ER, IE, UML, SD & SE This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const entityType = {
    UML: "UML",
    ER: "ER",
    IE: "IE",
    SD: "SD",
    SE: "SE",
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
 * @description State of inheritance between UML entities. <-- UML functionality
 */
 const inheritanceState = {
    DISJOINT: "disjoint",
    OVERLAPPING: "overlapping",
};

/**
 * @description State of inheritance between IE entities. <-- IE functionality
 */
 const inheritanceStateIE = {
    DISJOINT: "disjoint",
    OVERLAPPING: "overlapping",
};


/**
 * @description Available types of lines to draw between different elements.
 */
const lineKind = {
    NORMAL: "Normal",
    DOUBLE: "Double",
    DASHED: "Dashed",
    RECURSIVE: "Recursive"
};

/**
 * @description Available options of strings to display next to lines connecting two elements.
 */
const lineCardinalitys = {
    MANY: "N",
    ONE: "1"
};
/**
 * @description Available options of icons to display at the end of lines connecting two UML elements.
 */
 const UMLLineIcons = {//TODO: Replace with actual icons for the dropdown
    ARROW: "Arrow",
    TRIANGLE: "Triangle",
    BLACK_TRIANGLE: "Black_Triangle",
    WHITEDIAMOND: "White_Diamond",
    BLACKDIAMOND: "Black_Diamond",
};
/**
 * @description Available options of icons to display at the end of lines connecting two UML elements.
 */
 const IELineIcons = {//TODO: Replace with actual icons for the dropdown
    ZERO_MANY: "0-M",
    ZERO_ONE: "0-1",
    ONE: "1",
    FORCEDONE: "1!",
    ONE_MANY: "1-M",
    MANY: "M",
    WEAK: "Weak"
};
/**
 * @description Available options of icons to display at the end of lines connecting two SD elements.
 */
 const SDLineIcons = {//TODO: Replace with actual icons for the dropdown
    ARROW: "ARROW"
};
/**
 * @description Available options of Line types between two SD elements
 */
const SDLineType = {
    STRAIGHT: "Straight",
    SEGMENT: "Segment"
}
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
var startHeight;
var startNodeLeft = false;
var startNodeRight = false;
var startNodeDown = false;
var startNodeUp = false;
var containerStyle;
var lastMousePos = getPoint(0,0);
var dblPreviousTime = new Date().getTime(); ; // Used when determining if an element was doubleclicked.
var dblClickInterval = 350; // 350 ms = if less than 350 ms between clicks -> Doubleclick was performed.
var wasDblClicked = false;
var targetDelta;
var mousePressed;
var erTableToggle = false; //Used only in toggleErTable() and generateContextProperties().
var testCaseToggle = false;
var selectionBoxLowX;
var selectionBoxHighX;
var selectionBoxLowY;
var selectionBoxHighY;
var lastClickedElement = null;

var hasPressedDelete = false;
var mouseOverElement = false;
var mouseOverLine = false;

// Zoom variables
var desiredZoomfact = 1.0;
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
const colors = ["#ffffff", "#c4e4fc", "#ffd4d4", "#fff4c2", "#c4f8bd", "#648fff", "#DC267F", "#FFB000", "#FE6100", "#000000", "#0000ff"];
const strokeColors = ["#383737"];
const selectedColor = "#A000DC";
const multioffs = 3;
// Zoom values for offsetting the mouse cursor positioning

const zoom1_25 = 0.36;
const zoom1_5 = 0.555;
const zoom2 = 0.75;
const zoom4 = 0.9375;
const zoom0_75 = -0.775;
const zoom0_5 = -3;
const zoom0_25 = -15.01;

var errorActive = false;

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

//setting the base values for the allowed diagramtypes
var diagramType = {ER:false,UML:false,IE:false,SD:false};

//Grid Settings
var settings = {
    ruler: {
        ZF: 100 * zoomfact,
        zoomX: Math.round(((0 - zoomOrigo.x) * zoomfact) +  (1.0 / zoomfact)),
        zoomY: Math.round(((0 - zoomOrigo.y) * zoomfact) + (1.0 / zoomfact)),
        isRulerActive: true,
    },
    grid: {
        gridSize: 80,
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

var diagramToLoad = "";
var cid = "";
var cvers = "";
var diagramToLoadContent = "";

var data = []; // List of all elements in diagram
var lines = []; // List of all lines in diagram
var errorData = []; // List of all elements with an error in diagram
var UMLHeight = []; // List with UML Entities' real height
var IEHeight = []; // List with IE Entities' real height
var SDHeight = []; // List with SD Entities' real height


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

    EREntity: { name: "Entity", kind: "EREntity", fill: "#ffffff", stroke: "#000000", width: 200, height: 50, type: "ER", state: 'normal', attributes: ['-attribute'], functions: ['+function'] },
    ERRelation: { name: "Relation", kind: "ERRelation", fill: "#ffffff", stroke: "#000000", width: 60, height: 60, type: "ER", state: 'normal' },
    ERAttr: { name: "Attribute", kind: "ERAttr", fill: "#ffffff", stroke: "#000000", width: 90, height: 45, type: "ER", state: 'normal' },
    Ghost: { name: "Ghost", kind: "ERAttr", fill: "#ffffff", stroke: "#000000", width: 5, height: 5, type: "ER" },

    UMLEntity: {name: "Class", kind: "UMLEntity", fill: "#ffffff", stroke: "#000000", width: 200, height: 50, type: "UML", attributes: ['-Attribute'], functions: ['+Function'] },     //<-- UML functionality
    UMLRelation: {name: "Inheritance", kind: "UMLRelation", fill: "#ffffff", stroke: "#000000", width: 60, height: 60, type: "UML" }, //<-- UML functionality
    IEEntity: {name: "IEEntity", kind: "IEEntity", fill: "#ffffff", width: 200, height: 50, type: "IE", attributes: ['-Attribute'], functions: ['+function'] },     //<-- IE functionality
    IERelation: {name: "Inheritance", kind: "IERelation", fill: "#ffffff", stroke: "#000000", width: 50, height: 50, type: "IE" }, //<-- IE inheritence functionality
    SDEntity: { name: "State", kind: "SDEntity", fill: "#ffffff", stroke: "#000000", width: 200, height: 50, type: "SD", attributes: ['do: func'], functions: ['+function'] }, //<-- SD functionality

    UMLInitialState: {name: "UML Initial State", kind: "UMLInitialState", fill: "#000000", stroke: "#000000", width: 60, height: 60, type: "SD" }, // UML Initial state.
    UMLFinalState: {name: "UML Final State", kind: "UMLFinalState", fill: "#000000", stroke: "#000000", width: 60, height: 60, type: "SD" }, // UML Final state.
    UMLSuperState: {name: "UML Super State", kind: "UMLSuperState", fill: "#FFFFFF", stroke: "#000000", width: 500, height: 500, type: "SD" },  // UML Super State.

    sequenceActorAndObject: {name: "name", kind: "sequenceActorAndObject", fill: "#FFFFFF", stroke: "#000000", width: 100, height: 150, type: "SE", actorOrObject: "actor" }, // sequence actor and object
    sequenceActivation: {name: "Activation", kind: "sequenceActivation", fill: "#FFFFFF", stroke: "#000000", width: 30, height: 300, type: "SE" }, // Sequence Activation.
    sequenceLoopOrAlt: {kind: "sequenceLoopOrAlt", fill: "#FFFFFF", stroke: "#000000", width: 750, height: 300, type: "SE", alternatives: ["alternative1","alternative2","alternative3"], altOrLoop: "Alt"} // Sequence Loop or Alternative.

}
var defaultLine = { kind: "Normal" };
//#endregion ===================================================================================
//#region ================================ INIT AND SETUP       ================================
/**
 * @description Called from getData() when the window is loaded. This will initialize all neccessary data and create elements, setup the state machine and vise versa.
 * @see getData() For the VERY FIRST function called in the file.
 */

 var allLinesFromEntiAndRela = [];
 var allLinesFromAttributes = [];
 var allLinesBetweenAttributesToEntiAndRel = [];
// Variables also used in addLine function, allAttrToEntityRelations saves all attributes connected to a entity or relation
var countUsedAttributes = 0;
var allAttrToEntityRelations = [];
// Array for attributes connected with eachother
var attrViaAttrToEnt = [];
var attrViaAttrCounter = 0;
/* draws the State diagram on LOAD.
function debugDrawSDEntity() {
    const EMPLOYEE_ID = makeRandomID();
    const demoState = { name: "STATE", x: 100, y: 200, width: 200, height: 50, kind: "SDEntity", fill: "#ffffff", stroke: "#000000", id: EMPLOYEE_ID, isLocked: false, state: "normal", type: "SD", attributes: ['do: func']};
    addObjectToData(demoState, false);
    console.log(demoState.name);
}
*/
//Function to draw the predrawn diagram for diagram.php
/*function onSetup()
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
 
        { name: "EMPLOYEE", x: 100, y: 200, width: 200, height: 50, kind: "EREntity", fill: "#ffffff", stroke: "#000000", id: EMPLOYEE_ID , isLocked: false, state: "normal", type: "ER", attributes: ['-attribute'], functions: ['+function'] },
        { name: "Bdale", x: 30, y: 30, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Bdale_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Bdale", x: 360, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: BdaleDependent_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Ssn", x: 20, y: 100, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Ssn_ID, isLocked: false, state: "candidate",  type: "ER"},
        { name: "Name", x: 200, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Name_ID, isLocked: false,  type: "ER" },
        { name: "Name", x: 180, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: NameDependent_ID, isLocked: false, state: "weakKey",  type: "ER"},
        { name: "Name", x: 920, y: 600, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: NameProject_ID, isLocked: false, state: "normal", type: "ER"},
        { name: "Name", x: 980, y: 70, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: NameDEPARTMENT_ID, isLocked: false, state: "normal",  type: "ER"},
        { name: "Address", x: 300, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Address_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Address", x: 270, y: 700, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: AddressDependent_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Relationship", x: 450, y: 700, width: 120, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Relationship_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Salary", x: 400, y: 50, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Salary_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "F Name", x: 100, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: FNID, isLocked: false, state: "normal",  type: "ER" },
        { name: "Initial", x: 200, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Initial_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "L Name", x: 300, y: -20, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: LNID, isLocked: false, state: "normal",  type: "ER" },
        { name: "SUPERVISIONS", x: 140, y: 350, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: SUPERVISION_ID, isLocked: false,  type: "ER" },
        { name: "DEPENDENTS_OF", x: 330, y: 450, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: DEPENDENTS_OF_ID, isLocked: false, state: "weak",  type: "ER"},
        { name: "DEPENDENT", x: 265, y: 600, width: 200, height: 50, kind: "EREntity", fill: "#ffffff", stroke: "#000000", id: DEPENDENT_ID, isLocked: false, state: "weak",  type: "ER", attributes: ['-attribute'], functions: ['+function'] },
        { name: "Number_of_depends", x: 0, y: 600, width: 180, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Number_of_depends_ID, isLocked: false, state: "computed",  type: "ER"},
        { name: "WORKS_ON", x: 650, y: 490, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: WORKS_ON_ID, isLocked: false,  type: "ER" },
        { name: "Hours", x: 720, y: 400, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Hours_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "PROJECT", x: 1000, y: 500, width: 200, height: 50, kind: "EREntity", fill: "#ffffff", stroke: "#000000", id: PROJECT_ID, isLocked: false, state: "normal",  type: "ER", attributes: ['-attribute'], functions: ['+function']  },
        { name: "Number", x: 950, y: 650, width: 120, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: NumberProject_ID, isLocked: false, state: "candidate",  type: "ER"},
        { name: "Location", x: 1060, y: 610, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Location_ID, isLocked: false, state: "normal",  type: "ER"},
        { name: "MANAGES", x: 600, y: 300, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: MANAGES_ID, isLocked: false,  type: "ER" },
        { name: "Start date", x: 510, y: 220, width: 100, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Start_date_ID, isLocked: false, state: "normal",  type: "ER" },
        { name: "CONTROLS", x: 1070, y: 345, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: CONTROLS_ID, isLocked: false,  type: "ER" },
        { name: "DEPARTMENT", x: 1000, y: 200, width: 200, height: 50, kind: "EREntity", fill: "#ffffff", stroke: "#000000", id: DEPARTMENT_ID, isLocked: false, state: "normal",  type: "ER", attributes: ['-attribute'], functions: ['+function']  },
        { name: "Locations", x: 1040, y: 20, width: 120, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Locations_ID, isLocked: false, state: "multiple",  type: "ER" },
        { name: "WORKS_FOR", x: 650, y: 60, width: 60, height: 60, kind: "ERRelation", fill: "#ffffff", stroke: "#000000", id: WORKS_FOR_ID, isLocked: false,  type: "ER" },
        { name: "Number", x: 1130, y: 70, width: 90, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: NumberDEPARTMENT_ID, isLocked: false, state: "candidate",  type: "ER"},
        { name: "Number_of_employees", x: 750, y: 200, width: 200, height: 45, kind: "ERAttr", fill: "#ffffff", stroke: "#000000", id: Number_of_employees_ID, isLocked: false, state: "computed",  type: "ER"},
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
    // Sorts out all attributes connected to a entity or relation
    var k = 0;
    var h = 0;
    for(var i = 0; i < demoLines.length; i++){
        for(var j = 0; j < demoData.length; j++){
             // Lines to and from Attributes
            if (demoLines[i].toID == demoData[j].id && demoData[j].kind == "ERAttr") {
                allLinesFromAttributes[k] = demoLines[i].id;
                k++;
                // To catch attr to attr
                for (var l = 0; l < demoData.length; l++) {
                    if (demoData[l].kind == "ERAttr" && demoData[l].id == demoLines[i].fromID) {
                        attrViaAttrToEnt[attrViaAttrCounter] = demoData[l].id;
                        attrViaAttrCounter++;
                    }
                }
            }
            if (demoLines[i].fromID == demoData[j].id && demoData[j].kind == "ERAttr") {
                allLinesFromAttributes[k] = demoLines[i].id;
                k++;
                // To catch attr to attr
                for (var m = 0; m < demoData.length; m++) {
                    if (demoData[m].kind == "ERAttr" && demoData[m].id == demoLines[i].toID) {
                        attrViaAttrToEnt[attrViaAttrCounter] = demoData[m].id;
                        attrViaAttrCounter++;
                    }
                }
            }
            // Lines to and from Entitys and Relations
            if (demoLines[i].fromID == demoData[j].id && demoData[j].kind == "ERRelation") {
                allLinesFromEntiAndRela[h] = demoLines[i].id;
                h++;
            }
            if (demoLines[i].toID == demoData[j].id && demoData[j].kind == "ERRelation") {
                allLinesFromEntiAndRela[h] = demoLines[i].id;
                h++;
            }
            if (demoLines[i].fromID == demoData[j].id && demoData[j].kind == "EREntity") {
                allLinesFromEntiAndRela[h] = demoLines[i].id;
                h++;
            }
            if (demoLines[i].toID == demoData[j].id && demoData[j].kind == "EREntity") {
                allLinesFromEntiAndRela[h] = demoLines[i].id;
                h++;
            }
        }
    }

    var countSeekedLines = 0;
    for (var i = 0; i < allLinesFromEntiAndRela.length; i++) {
        for (var j = 0; j < allLinesFromAttributes.length; j++) {
            if (allLinesFromEntiAndRela[i] == allLinesFromAttributes[j]) {
                allLinesBetweenAttributesToEntiAndRel[countSeekedLines] = allLinesFromAttributes[j];
                countSeekedLines++;
            }
        }
    }
    for (var i = 0; i < demoLines.length; i++) {
        for (var j = 0; j < allLinesBetweenAttributesToEntiAndRel.length; j++) {
            if (demoLines[i].id == allLinesBetweenAttributesToEntiAndRel[j]) {
                for (var k = 0; k < demoData.length; k++) {
                    if (demoData[k].kind == "ERAttr" && demoLines[i].fromID == demoData[k].id || demoData[k].kind == "ERAttr" && demoLines[i].toID == demoData[k].id) {
                        allAttrToEntityRelations[countUsedAttributes] = demoData[k].id;
                        countUsedAttributes++;
                    }
                }
            }
        }
    }   // End of sorting code for attributes connected to entity or relation

    // Delete duplicates
    attrViaAttrToEnt = [... new Set(attrViaAttrToEnt)];
    
    for (i = 0; i < allAttrToEntityRelations.length; i++) { 
        for (j = 0; j < attrViaAttrToEnt.length; j++) {
            if (allAttrToEntityRelations[i] == attrViaAttrToEnt[j]) {
                // Sort out attributes connected to entitis or relations from the attrViaAttrToEnt array
                attrViaAttrToEnt.splice(j, 1);
                // Sort out attributes connected to other attributes from the allAttrToEntityRelations
                //allAttrToEntityRelations.splice(i, 1);
            }
        }
    }

    for(var i = 0; i < demoLines.length; i++){
        addObjectToLines(demoLines[i], false);
    }

   
    

    fetchDiagramFileContentOnLoad();
}*/

//was in onSetup function moved it out 
 // Global statemachine init
stateMachine = new StateMachine(data, lines);
/**
 * @description Very first function that is called when the window is loaded. This will perform initial setup and then call the drawing functions to generate the first frame on the screen.
 */
function getData()
{ 
    container = document.getElementById("container");
    DiagramResponse = fetchDiagram();
    // onSetup();
    //debugDrawSDEntity(); // <-- debugfunc to show an sd entity
    generateToolTips();
    toggleGrid();
    updateGridPos();
    updateA4Pos();
    updateGridSize();
    showdata();
    drawRulerBars(scrollx,scrolly);
    setContainerStyles(mouseMode);
    generateKeybindList();
    setPreviewValues();
    saveDiagramBeforeUnload();

    // Setup and show only the first element of each PlacementType, hide the others in dropdown
    // SHOULD BE CHANGED LATER
    togglePlacementType(0,0)
    togglePlacementType(1,1)
    togglePlacementType(9,9)
    togglePlacementType(12,12)
}
//<-- UML functionality start
/**
 * @description Used to determine the tools shown depending on diagram type.
 */
function showDiagramTypes(){
    var firstShown = false; // used to not hide the first button in either category

    // ER buttons
    if (diagramType.ER) { // if this type should be here, add functions to it
        document.getElementById("elementPlacement0").onmousedown = function () {
            holdPlacementButtonDown(0);
        };
        document.getElementById("elementPlacement1").onmousedown = function () {
            holdPlacementButtonDown(1);
        };

        if (firstShown) { // if the first type is already shown hide this one since it will then be a submenu
            document.getElementById("elementPlacement0").classList.add("hiddenPlacementType");
            document.getElementById("elementPlacement1").classList.add("hiddenPlacementType");
        }
        firstShown = true; // could be placed inside an else after the above if-statement
    }
    else { // if this type shouldn't be here, hide it entirely
        Array.from(document.getElementsByClassName("ERButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }

    // UML buttons
    if (diagramType.UML) {
        document.getElementById("elementPlacement4").onmousedown = function () {
            holdPlacementButtonDown(0);
        };
        document.getElementById("elementPlacement5").onmousedown = function () {
            holdPlacementButtonDown(1);
        };

        if (firstShown) {
            document.getElementById("elementPlacement4").classList.add("hiddenPlacementType");
            document.getElementById("elementPlacement5").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    }
    else {
        Array.from(document.getElementsByClassName("UMLButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }

    // IE buttons
    if (diagramType.IE) {
        document.getElementById("elementPlacement6").onmousedown = function () {
            holdPlacementButtonDown(0);
        };
        document.getElementById("elementPlacement7").onmousedown = function () {
            holdPlacementButtonDown(1);
        };

        if (firstShown) {
            document.getElementById("elementPlacement6").classList.add("hiddenPlacementType");
            document.getElementById("elementPlacement7").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    }
    else {
        Array.from(document.getElementsByClassName("IEButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }

    // SD buttons
    if (diagramType.UML) {
        document.getElementById("elementPlacement8").onmousedown = function () {
            holdPlacementButtonDown(0);
        };

        if (firstShown) {
            document.getElementById("elementPlacement8").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    }
    else {
        Array.from(document.getElementsByClassName("SDButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }

    // SE buttons
    if (diagramType.UML) {
        document.getElementById("elementPlacement12").onmousedown = function () {
            holdPlacementButtonDown(0);
        };

        if (firstShown) {
            document.getElementById("elementPlacement12").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    }
    else {
        Array.from(document.getElementsByClassName("SEButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }
}
//<-- UML functionality end
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
            if (!/TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())){
                var propField = document.getElementById("elementProperty_name");
                if(!!document.getElementById("lineLabel")){
                    changeLineProperties();
                }else{
                    changeState();
                    saveProperties(); 
                    propField.blur();
                }
            }
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
        if (isKeybindValid(e, keybinds.HISTORY_STEPBACK)) {toggleStepBack();};
        if (isKeybindValid(e, keybinds.HISTORY_STEPFORWARD)) stateMachine.stepForward();
        if (isKeybindValid(e, keybinds.ESCAPE)) escPressed = false;
        if (isKeybindValid(e, keybinds.DELETE) || isKeybindValid(e, keybinds.DELETE_B)) {
            
            if (mouseMode == mouseModes.EDGE_CREATION && context.length != 0) return;
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

        // IE inheritance keybind
        if(isKeybindValid(e, keybinds.IE_INHERITANCE)){
            setElementPlacementType(elementTypes.IERelation);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        //=================================================== //<-- UML functionality
        //Temp for UML class
        if(isKeybindValid(e, keybinds.PLACE_UMLENTITY)) {
            setElementPlacementType(elementTypes.UMLEntity);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        //======================================================

        //=================================================== //<-- IE functionality
        //Temp for IE entity
        if(isKeybindValid(e, keybinds.PLACE_IEENTITY)) {
            setElementPlacementType(elementTypes.IEEntity)
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        //======================================================


        //=================================================== //<-- SD functionality
        //Temp for SD entity
        if (isKeybindValid(e, keybinds.PLACE_SDENTITY)) {
            setElementPlacementType(elementTypes.SDEntity)
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        //======================================================

        if (isKeybindValid(e, keybinds.STATE_INITIAL)) {
            setElementPlacementType(elementTypes.UMLInitialState);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }

        if (isKeybindValid(e, keybinds.STATE_FINAL)) {
            setElementPlacementType(elementTypes.UMLFinalState);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }
        if (isKeybindValid(e, keybinds.STATE_SUPER)) {
            setElementPlacementType(elementTypes.UMLSuperState);
            setMouseMode(mouseModes.PLACING_ELEMENT);
        }


        if(isKeybindValid(e, keybinds.TOGGLE_A4)) toggleA4Template();
        if(isKeybindValid(e, keybinds.TOGGLE_GRID)) toggleGrid();
        if(isKeybindValid(e, keybinds.TOGGLE_RULER)) toggleRuler();
        if(isKeybindValid(e, keybinds.TOGGLE_SNAPGRID)) toggleSnapToGrid();
        if(isKeybindValid(e, keybinds.TOGGLE_DARKMODE)) toggleDarkmode();
        if(isKeybindValid(e, keybinds.OPTIONS)) toggleOptionsPane();
        if(isKeybindValid(e, keybinds.PASTE)) pasteClipboard(JSON.parse(localStorage.getItem('copiedElements') || "[]"), JSON.parse(localStorage.getItem('copiedLines') || "[]"));
        if(isKeybindValid(e, keybinds.CENTER_CAMERA)) centerCamera();
        if(isKeybindValid(e, keybinds.TOGGLE_REPLAY_MODE)) toggleReplay();
        if(isKeybindValid(e, keybinds.TOGGLE_ER_TABLE)) toggleErTable();
        //if(isKeybindValid(e, keybinds.TOGGLE_ERROR_CHECK)) toggleErrorCheck(); Note that this functionality has been moved to hideErrorCheck(); because special conditions apply.

        if (isKeybindValid(e, keybinds.COPY)){
            // Remove the preivous copy-paste data from localstorage.
            if(localStorage.key('copiedElements')) localStorage.removeItem('copiedElements');
            if(localStorage.key('copiedLines')) localStorage.removeItem('copiedLines');

            if (context.length !== 0){
                
                // Filter - keeps only the lines that are connectet to and from selected elements.
                var contextConnectedLines = lines.filter(line => {
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

 var mouseButtonDown = false;

function mdown(event)
{
    mouseButtonDown = true;

    // Mouse pressed over delete button for multiple elements
    if (event.button == 0) {
        if (context.length > 0 || contextLine.length > 0) {
            hasPressedDelete = checkDeleteBtn();
        }
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

    // Check if no element has been clicked or delete button has been pressed.
    if(pointerState != pointerStates.CLICKED_ELEMENT && !hasPressedDelete && !settings.replay.active) {

        // Used when clicking on a line between two elements.
        determinedLines = determineLineSelect(event.clientX, event.clientY);

        // If a line was clicked, determine if the label or line was clicked.
        if(determinedLines){
            
            if (determinedLines.id.length == 6) { // LINE
                pointerState = pointerStates.CLICKED_LINE;
    
                // If double click, open option pane
                if((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                    wasDblClicked = true;
                    document.getElementById('optmarker').innerHTML = "&#9650;Options";
                    document.getElementById("options-pane").className = "show-options-pane";
                }
            }
            else if(determinedLines.id.length > 6) { // LABEL
                targetLabel = lineLabelList[findIndex(lineLabelList, determinedLines.id)];
                startX = event.clientX;
                startY = event.clientY;

                pointerState = pointerStates.CLICKED_LABEL;
            }
        }
    }

    // If no line, label or delete button was clicked, react to mouse down on container
    if (pointerState != pointerStates.CLICKED_LINE && pointerState != pointerStates.CLICKED_LABEL && !hasPressedDelete) {
        if (event.target.id == "container") {
            switch (mouseMode) {
                case mouseModes.POINTER:
                    sscrollx = scrollx;
                    sscrolly = scrolly;
                    startX = event.clientX;
                    startY = event.clientY;

                    // If pressed down in selection box
                    if (context.length > 0) {
                        if (startX > selectionBoxLowX && startX < selectionBoxHighX && startY > selectionBoxLowY && startY < selectionBoxHighY) {
                            pointerState = pointerStates.CLICKED_ELEMENT;
                            targetElement = context[0];
                            targetElementDiv = document.getElementById(targetElement.id);
                        } else {
                            pointerState = pointerStates.CLICKED_CONTAINER;
                            containerStyle.cursor = "grabbing";
                            if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                                wasDblClicked = true;
                                document.getElementById("options-pane").className = "hide-options-pane";
                            }
                        }
                        break;
                    }
                    else {
                        pointerState = pointerStates.CLICKED_CONTAINER;
                        containerStyle.cursor = "grabbing";

                        if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                            wasDblClicked = true;
                            toggleOptionsPane();
                        }
                        break;
                    }

                case mouseModes.BOX_SELECTION:
                    // If pressed down in selection box
                    if(context.length > 0){
                        startX = event.clientX;
                        startY = event.clientY;
                        if (startX > selectionBoxLowX && startX < selectionBoxHighX && startY > selectionBoxLowY && startY < selectionBoxHighY) {
                            pointerState = pointerStates.CLICKED_ELEMENT;
                            targetElement = context[0];
                            targetElementDiv = document.getElementById(targetElement.id);
                        } else {
                            boxSelect_Start(event.clientX, event.clientY);
                        }
                    } else {
                        boxSelect_Start(event.clientX, event.clientY);
                    }
                    break;

                default:
                    break;
            }
        // If node is clicked, determine start point for resize
        } else if (event.target.classList.contains("node")) {
            pointerState = pointerStates.CLICKED_NODE;
            startWidth = data[findIndex(data, context[0].id)].width;
            startHeight = data[findIndex(data, context[0].id)].height;

            //startNodeRight = !event.target.classList.contains("mr");
            startNodeLeft = event.target.classList.contains("ml")
            startNodeRight = event.target.classList.contains("mr"); //since it used to be "anything but mr", i changed it to "be ml" since theres not only two nodes anymore. This variable still does not make sense to me but I left it functionally intact.
            startNodeDown = event.target.classList.contains("md");
            startNodeUp = event.target.classList.contains("mu");

            startX = event.clientX;
            startY = event.clientY;
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
    // Mouse pressed over delete button for a single line over a element
    if (event.button == 0 && (contextLine.length > 0 || context.length > 0)) {
        hasPressedDelete = checkDeleteBtn();
    }
    
    // Used when determining time between clicks.
    if((new Date().getTime() - dblPreviousTime) < dblClickInterval && event.button == 0){

        wasDblClicked = true; // General purpose bool. True when doubleclick was performed.
        
        const element = data[findIndex(data, event.currentTarget.id)];
        if (element != null && context.length == 1 && context.includes(element) && contextLine.length == 0){
            event.preventDefault(); // Needed in order for focus() to work properly 
            var input = document.getElementById("elementProperty_name");
            if (input !== null) {
                input.focus();
                input.setSelectionRange(0, input.value.length); // Select the whole text.
            }
            document.getElementById('optmarker').innerHTML = "&#9650;Options";
            document.getElementById("options-pane").className = "show-options-pane"; // Toggle optionspanel.
        }
    }   

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active => return
    if(event.button == 1 || settings.replay.active) return;

    // If the right mouse button is pressed => return
    if(event.button == 2) return;
if(!hasPressedDelete){
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
            const element = data[findIndex(data, event.currentTarget.id)];
            // If element not in context, update selection on down click
            if (element != null && !context.includes(element)){
                pointerState = pointerStates.CLICKED_ELEMENT;
                updateSelection(element);
                lastClickedElement = null;
            } else if(element != null){
                lastClickedElement = element;
            }
            break;
            
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in ddown()!`);
            break;
    }
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
    if(!hasPressedDelete){
    switch (mouseMode) {
        case mouseModes.PLACING_ELEMENT:
            if(event.target.id == "container") {

            if (ghostElement && event.button == 0) {
                addObjectToData(ghostElement, false);
                
                // Check if the element to create would overlap others, returns if true
                if (entityIsOverlapping(ghostElement.id, ghostElement.x, ghostElement.y)) {
                    displayMessage(messageTypes.ERROR, "Error: You can't create elements that overlap eachother.");
                    console.error("Failed to create an element as it overlaps other element(s)")

                    // Remove added element from data as it should remain
                    data.splice(data.length-1, 1)
                    
                    makeGhost();
                    showdata();
                    return 
                }

                //If not overlapping
                stateMachine.save(StateChangeFactory.ElementCreated(ghostElement), StateChange.ChangeTypes.ELEMENT_CREATED); 
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
                } else if (ghostElement !== null) { 

                    // create a line from the element to itself
                    addLine(context[0], context[0], "Recursive");                  
                    clearContext();             

                    // Bust the ghosts
                    ghostElement = null;
                    ghostLine = null;

                    showdata();
                    updatepos(0, 0);
                    
                } else{   
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
    hasPressedDelete = false;
}
/**
 * @description Event function triggered when any mouse button is released on top of the toolbar.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */

 function tup(event) 
 {
     mouseButtonDown = false;
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
    if(!mouseOverLine && !mouseOverElement){
        setContainerStyles(mouseMode);
    }
    mouseButtonDown = false;
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
            updateSelectedLine(lines[findIndex(lines, determinedLines.labelLineID)]);
            break;

        case pointerStates.CLICKED_ELEMENT:
            // If clicked element already was in context, update selection on mouse up
            if(lastClickedElement != null && context.includes(lastClickedElement) && !movingObject){
                updateSelection(lastClickedElement);
            }
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
 * @description change cursor style when mouse hovering over an element.
 */
function mouseEnter(){
    if(!mouseButtonDown){
        mouseOverElement = true;
        containerStyle.cursor = "pointer";
    }
}

/**
 * @description change cursor style when mouse is hovering over the container.
 */
function mouseLeave(){
    mouseOverElement = false;
    setContainerStyles(mouseMode);
}
/**

 * @description Calculates if any line or label is present on x/y position in pixels.

 * @description Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.
 */
function checkDeleteBtn(){
    if (deleteBtnX != 0) {
        if (lastMousePos.x > deleteBtnX && lastMousePos.x < (deleteBtnX + deleteBtnSize) && lastMousePos.y > deleteBtnY && lastMousePos.y < (deleteBtnY + deleteBtnSize)) {
            if (context.length > 0) {
                removeElements(context);
            }
            if (contextLine.length > 0) {
                 removeLines(contextLine);
            }            
            
            updateSelection();
            return true
        }
        return false
    }
    return false
}
/**
 *  @description change cursor style if mouse position is over a selection box or the deletebutton.
 */
function mouseOverSelection(mouseX, mouseY){
    if(context.length > 0 || contextLine.length > 0){
        // If there is a selection box and mouse position is inside it.
        if (mouseX > selectionBoxLowX && mouseX < selectionBoxHighX && mouseY > selectionBoxLowY && mouseY < selectionBoxHighY){
            containerStyle.cursor = "pointer";
        }
        // If mouse position is over the delete button.
        else if (mouseX > deleteBtnX && mouseX < (deleteBtnX + deleteBtnSize) && mouseY > deleteBtnY && mouseY < (deleteBtnY + deleteBtnSize)){
            containerStyle.cursor = "pointer";
        }
        // Not inside selection box, nor over an element or line.
        else if(!mouseOverElement && !mouseOverLine){
            setContainerStyles(mouseMode);
        }
    }
    // There is no selection box, and mouse position is not over any element or line.
    else if(!mouseOverElement && !mouseOverLine){
        setContainerStyles(mouseMode);
    }
}

/**
 * @description Retrieves lines from svgbacklayer. If none is found return empty array
 */
function getLinesFromBackLayer() {
    return Array.from(document.getElementById("svgbacklayer").children);
}
/**
 * @description Calculates if any line is present on x/y position in pixels.
 * 
 * @param {Number} mouseX
 * @param {Number} mouseY
 */
function determineLineSelect(mouseX, mouseY)
{
    // This func is used when determining which line is clicked on.
    
    var allLines = getLinesFromBackLayer();
    var bLayerLineIDs = []

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
  
        var hasPoints = allLines[i].getAttribute('points'); // If line has attribute point (polyline)

        if (hasPoints != null) {

            var points = hasPoints.split(' '); // Split points attribute in pairs
            // Get the points in polyline
            for (var j = 0; j < points.length-1; j++) {
                currentLineSegment = {
                    x1: points[j].split(',')[0],
                    x2: points[j+1].split(',')[0],
                    y1: points[j].split(',')[1],
                    y2: points[j+1].split(',')[1]
                }
                // Used later to make sure the current mouse-position is in the span of a line.
                highestX = Math.max(currentLineSegment.x1, currentLineSegment.x2);
                lowestX = Math.min(currentLineSegment.x1, currentLineSegment.x2);
                highestY = Math.max(currentLineSegment.y1, currentLineSegment.y2);
                lowestY = Math.min(currentLineSegment.y1, currentLineSegment.y2);
                lineData = {
                    hX: highestX,
                    lX: lowestX,
                    hY: highestY,
                    lY: lowestY
                }
                lineCoeffs = {
                    a: (currentLineSegment.y1 - currentLineSegment.y2),
                    b: (currentLineSegment.x2 - currentLineSegment.x1),
                    c: ((currentLineSegment.x1 - currentLineSegment.x2)*currentLineSegment.y1 + (currentLineSegment.y2-currentLineSegment.y1)*currentLineSegment.x1)
                }
                lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);

                if(lineWasHit == true && labelWasHit == false) {
                    // Return the current line that registered as a "hit".;
                    return lines.filter(function(line) {
                        return line.id == bLayerLineIDs[i];
                    })[0];
                }
            }
        }
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
                x: lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].centerX + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].labelMovedX + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].displacementX,
                y: lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].centerY + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].labelMovedY + lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].displacementY
            
            }
            var labelWidth = lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].width;
            var labelHeight = lineLabelList[findIndex(lineLabelList,bLayerLineIDs[i]+"Label")].height;
            labelWasHit = didClickLabel(centerPoint, labelWidth, labelHeight, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius);
        }
        
        // Determines if a line was clicked
        lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);
        // --- Used when debugging ---
        // Creates a circle with the same position and radius as the hitbox of the circle being sampled with.
        //document.getElementById("svgoverlay").innerHTML += '<circle cx="'+ circleHitBox.pos_x + '" cy="'+ circleHitBox.pos_y+ '" r="' + circleHitBox.radius + '" stroke="#000000" stroke-width="3" fill="red" /> '
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
    mouseOverLine = determineLineSelect(event.clientX, event.clientY);

    // Change cursor style if mouse pointer is over a line.
    if(mouseOverLine && !mouseButtonDown){
        containerStyle.cursor = "pointer";
    } else if(!mouseOverElement){
        setContainerStyles(mouseMode);
    }
     switch (mouseMode) {
        case mouseModes.EDGE_CREATION:
            mouseOverSelection(event.clientX, event.clientY); // This case defaults to mouseModes.PLACING_ELEMENT, however the effect this method provides is currently only for EDGE_CREATION
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

        case mouseModes.POINTER:
            mouseOverSelection(event.clientX, event.clientY);
            break;
            
        case mouseModes.BOX_SELECTION:
            boxSelect_Update(event.clientX, event.clientY);
            updatepos(0, 0);
            mouseOverSelection(event.clientX, event.clientY);
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
            updatepos(null, null);
            break;

        case pointerStates.CLICKED_ELEMENT:
            if(mouseMode != mouseModes.EDGE_CREATION){

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
            }
            break;

        case pointerStates.CLICKED_NODE:
            var index = findIndex(data, context[0].id);
            var elementData = data[index];
            
            const minWidth = 20; // Declare the minimal with of an object
            deltaX = startX - event.clientX;

            const minHeight = 150; // Declare the minimal height of an object
            deltaY = startY - event.clientY;
            
            // Functionality for the four different nodes
            if (startNodeLeft && (startWidth + (deltaX / zoomfact)) > minWidth) {
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

            } else if (startNodeRight && (startWidth - (deltaX / zoomfact)) > minWidth) {
                // Fetch original width
                var tmp = elementData.width;
                elementData.width = (startWidth - (deltaX / zoomfact));

                // Remove the new width, giving us the total change
                const widthChange = -(tmp - elementData.width);
                
                // Right node will never change the position of the element. We pass 0 as x and y movement.
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], widthChange, 0), StateChange.ChangeTypes.ELEMENT_RESIZED);

            } else if (startNodeDown && (startHeight - (deltaY / zoomfact)) > minHeight) {
                // Fetch original height
                var tmp = elementData.height;
                elementData.height = (startHeight - (deltaY / zoomfact));

                // Deduct the new height, giving us the total change
                const heightChange = -(tmp - elementData.height);
                
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], heightChange, 0), StateChange.ChangeTypes.ELEMENT_RESIZED);

            } else if (startNodeUp && (startHeight + (deltaY / zoomfact)) > minHeight) {

                // Fetch original height
                var tmp = elementData.height;
                elementData.height = (startHeight + (deltaY / zoomfact));

                // Deduct the new height, giving us the total change
                const heightChange = -(tmp - elementData.height);

                // Fetch original y-position
                // "+ 15" hardcoded, for some reason the superstate jumps up 15 pixels when using this node.
                tmp = elementData.y;
                elementData.y = screenToDiagramCoordinates(0, (startY - deltaY + 15)).y;

                // Deduct the new position, giving us the total change
                const yChange = -(tmp - elementData.y);

                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], 0, yChange, 0, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
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

    // Removes from the two arrays that keep track of the attributes connections. 
    for (var i = 0; i < linesArray.length; i++) {
        for (j = 0; j < allAttrToEntityRelations.length; j++) {
            if (linesArray[i].toID == allAttrToEntityRelations[j] || linesArray[i].fromID == allAttrToEntityRelations[j]) {
                allAttrToEntityRelations.splice(j, 1);
                countUsedAttributes--;
            }
        }
        for (k = 0; k < attrViaAttrToEnt.length; k++) {
            if (linesArray[i].toID == attrViaAttrToEnt[k] || linesArray[i].fromID == attrViaAttrToEnt[k]) {
                attrViaAttrToEnt.splice(k, 1);
                attrViaAttrCounter--;
            }
        }

        lines = lines.filter(function(line) {
            var shouldRemove = (line != linesArray[i]);
            if (shouldRemove) {
                anyRemoved = true;
            }
            return shouldRemove;
        });
    }

    if (stateMachineShouldSave && anyRemoved) {
        console.log("Removed lines!");
        stateMachine.save(StateChangeFactory.LinesRemoved(linesArray), StateChange.ChangeTypes.LINE_DELETED);
    }

    contextLine = [];
    showdata();
    redrawArrows();
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
 * @description Returns all the lines (all sides) from given element.
 * @param {Element} element
 * @returns {array} result
 */
function getElementLines(element) {
    return element.top.concat(element.right, element.bottom, element.left);
}

/**
 * @description Checks if the given element have lines connected to it or not.
 * @param {Element} element
 * @returns {boolean} result
 */
function elementHasLines(element) {
    return (getElementLines(element).length > 0);
}
/** TODO: elementHasLines() seems to not work for UML, SD, IE elements, this needs to be fixed/investigated!!
 * @description Triggered on ENTER-key pressed when a property is being edited via the options panel. This will apply the new property onto the element selected in context.
 * @see context For currently selected element.
 */
function changeState() 
{
    const element =  context[0],
          oldType = element.type,
          newType = document.getElementById("typeSelect")?.value || undefined;
          var oldRelation = element.state;
          var newRelation = document.getElementById("propertySelect")?.value || undefined
    // If we are changing types and the element has lines, we should not change
    if ((elementHasLines(element))){
        displayMessage("error", `
        Can't change type from \"${oldType}\" to \"${newType}\" as
        different diagrams should not be able to connect to each other.`
        )
        return;
    // If we are changing to the same type, (simply pressed save without changes), do nothing.
    } else if (oldType == newType && oldRelation == newRelation){
        return;
    }

    else if (element.type == 'ER') {
        
        //If not attribute, also save the current type and check if kind also should be updated
        if (element.kind != 'ERAttr') {

            //Check if type has been changed
            if (oldType != newType) {
                var newKind = element.kind;
                newKind = newKind.replace(oldType, newType);
                //Update element kind
                element.kind = newKind;
                stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { kind: newKind }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
            }

            //Update element type
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { type: newType }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }

        var property = document.getElementById("propertySelect").value;
        element.state = property;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { state: property }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    }
    else if(element.type=='UML') {
        //Save the current property if not an UML or IE entity since niether entities does have variants.
        if (element.kind != 'UMLEntity') {
            var property = document.getElementById("propertySelect").value;
            element.state = property;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { state: property }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }

        //Check if type has been changed
        if (oldType != newType) {
            var newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            //Update element kind
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { kind: newKind }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        //Update element type
        element.type = newType;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { type: newType }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    }
    else if(element.type=='IE') {
        //Save the current property if not an UML or IE entity since niether entities does have variants.
        if (element.kind != 'IEEntity') {
            var property = document.getElementById("propertySelect").value;
            element.state = property;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { state: property }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }

        //Check if type has been changed
        if (oldType != newType) {
            var newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            //Update element kind
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { kind: newKind }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        //Update element type
        element.type = newType;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { type: newType }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    }

    else if(element.type=='SD') {

        //Check if type has been changed
        if (oldType != newType) {
            var newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            //Update element kind
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { kind: newKind }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        //Update element type
        element.type = newType;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { type: newType }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    }
    
    else if(element.type=='SE') {

        //Check if type has been changed
        if (oldType != newType) {
            var newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            //Update element kind
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { kind: newKind }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        //Update element type
        element.type = newType;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, { type: newType }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    }
    
    generateContextProperties();
    displayMessage(messageTypes.SUCCESS, "Sucessfully saved");

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
            case 'attributes':
                //Get string from textarea
                var elementAttr = child.value;
                //Create an array from string where newline seperates elements
                var arrElementAttr = elementAttr.split('\n');
                var formatArr = [];
                for (var i = 0; i < arrElementAttr.length; i++) {
                    if (!(arrElementAttr[i] == '\n' || arrElementAttr[i] == '' || arrElementAttr[i] == ' ')) {
                        formatArr.push(arrElementAttr[i]);
                    } 
                }
                //Update the attribute array
                arrElementAttr = formatArr;
                element[propName] = arrElementAttr;
                propsChanged.attributes = arrElementAttr;
                break;
        
            case 'functions':
                //Get string from textarea
                var elementFunc = child.value;
                //Create an array from string where newline seperates elements
                var arrElementFunc = elementFunc.split('\n');
                var formatArr = [];
                for (var i = 0; i < arrElementFunc.length; i++) {
                    if (!(arrElementFunc[i] == '\n' || arrElementFunc[i] == '' || arrElementFunc[i] == ' ')) {
                        formatArr.push(arrElementFunc[i]);
                    } 
                }
                //Update the attribute array
                arrElementFunc = formatArr;
                element[propName] = arrElementFunc;
                propsChanged.functions = arrElementFunc;
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
    // Set lineKind
    var radio1  = document.getElementById("lineRadio1");
    var radio2 = document.getElementById("lineRadio2");
    var label = document.getElementById("lineLabel");
    var radio3 = document.getElementById("lineRadio3");
    var startLabel = document.getElementById("lineStartLabel");
    var endLabel = document.getElementById("lineEndLabel");
    var startIcon= document.getElementById("lineStartIcon");
    var endIcon= document.getElementById("lineEndIcon");
    var lineType = document.getElementById("lineType");
    var line = contextLine[0];

    if (radio1) {
        if (radio1.checked && line.kind != radio1.value) {
            line.kind = radio1.value;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { kind: radio1.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    } 
    else if(radio2){
        if(radio2.checked && line.kind != radio2.value){
            line.kind = radio2.value;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { kind: radio2.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    else if(radio3){
        if(radio3.checked && line.kind != radio3.value){
            line.kind = radio3.value;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { kind: radio3.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
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
    // UML line
    if (line.type == 'UML') {
        // Start label, near side
        if(line.startLabel != startLabel.value){
            startLabel.value = startLabel.value.trim();
            line.startLabel = startLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { startLabel: startLabel.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        // End label, opposite side
        if(line.endLabel != endLabel.value){
            endLabel.value = endLabel.value.trim();
            line.endLabel = endLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { endLabel: endLabel.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if(line.startIcon != startIcon.value){
            line.startIcon = startIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { startIcon: startIcon.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if(line.endIcon != endIcon.value){
            line.endIcon = endIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { endIcon: endIcon.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    // SD line
    if (line.type == 'SD') {
        if (line.innerType != lineType.value) {
            lineType.value = lineType.value.trim();
            line.innerType = lineType.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { innerType: lineType.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        // Start label, near side
        if (line.startLabel != startLabel.value) {
            startLabel.value = startLabel.value.trim();
            line.startLabel = startLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { startLabel: startLabel.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        // End label, opposite side
        if (line.endLabel != endLabel.value) {
            endLabel.value = endLabel.value.trim();
            line.endLabel = endLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { endLabel: endLabel.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.startIcon != startIcon.value) {
            line.startIcon = startIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { startIcon: startIcon.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.endIcon != endIcon.value) {
            line.endIcon = endIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, { endIcon: endIcon.value }), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
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
function updateSelection(ctxelement)
{
    // If CTRL is pressed and an element is selected
    if (ctrlPressed && ctxelement != null) {
        // The element is not already selected
        if (!context.includes(ctxelement)) {
            context.push(ctxelement);
            showdata();
            clearContext
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
            stroke: element.stroke,
            type: element.type,
            attributes: element.attributes,
            functions: element.functions
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
 * @description Sets ghostElement and ghostLine to null.
 */
function clearGhosts()
{
    ghostElement = null;
    ghostLine = null;
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
 */
function screenToDiagramCoordinates(mouseX,mouseY)
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
     var overlapping = false;
     
     objects.forEach(obj => {
        if(entityIsOverlapping(obj.id, obj.x - deltaX / zoomfact, obj.y - deltaY / zoomfact)){
            overlapping = true;
        }
     });

     if (overlapping) {
       displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
     } else {
       objects.forEach(obj => {

         if (obj.isLocked) return;

         if (settings.grid.snapToGrid) {

           if (!ctrlPressed) {
             //Different snap points for entity and others
             if (obj.kind == "EREntity") {
               // Calculate nearest snap point
               obj.x = Math.round((obj.x - (x * (1.0 / zoomfact)) + (settings.grid.gridSize * 2)) / settings.grid.gridSize) * settings.grid.gridSize;
               obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;
             } else {
               obj.x = Math.round((obj.x - (x * (1.0 / zoomfact)) + (settings.grid.gridSize)) / settings.grid.gridSize) * settings.grid.gridSize;
               obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / (settings.grid.gridSize * 0.5)) * (settings.grid.gridSize * 0.5);
             }
             // Set the new snap point to center of element
             obj.x -= obj.width / 2
             obj.y -= obj.height / 2;

           } else {
             obj.x += (targetDelta.x / zoomfact);
             obj.y += ((targetDelta.y / zoomfact) + 25);
           }
         } else {
           obj.x -= (x / zoomfact);
           obj.y -= (y / zoomfact);
         }
         // Add the object-id to the idList
         idList.push(obj.id);

         // Make the coordinates without decimals
         obj.x = Math.round(obj.x);
         obj.y = Math.round(obj.y);
       });
       if (idList.length != 0) stateMachine.save(StateChangeFactory.ElementsMoved(idList, -x, -y), StateChange.ChangeTypes.ELEMENT_MOVED);
     }
     updatepos(0, 0);
 }

function isKeybindValid(e, keybind)
{
    return e.key.toLowerCase() == keybind.key.toLowerCase() && (e.ctrlKey == keybind.ctrl || keybind.ctrl == ctrlPressed);
}

function findUMLEntityFromLine(lineObj)
{
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.UMLEntity).kind){
        return -1;
    }else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.UMLEntity).kind) {
        return 1;
    }
    return null;
}

function findUMLInheritanceFromLine(lineObj)
{
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.UMLRelation).kind){
        return -1;
    }else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.UMLRelation).kind) {
        return 1;
    }
    return null;
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
        const element = data[foundIndex];
        let targetX;
        let targetY;
        var elementHeight = element.height;

        // Change height if element is an UML Entity
        for (var i = 0; i < UMLHeight.length; i++) {
            if (element.id == UMLHeight[i].id) {
                elementHeight = UMLHeight[i].height;
            }
        }
        // Change height if element is an IE Entity
        for (var i = 0; i < IEHeight.length; i++) {
            if (element.id == IEHeight[i].id) {
                elementHeight = IEHeight[i].height;
            }
        }
        // Change height if element is an SD Entity
        for (var i = 0; i < SDHeight.length; i++) {
            if (element.id == SDHeight[i].id) {
                elementHeight = SDHeight[i].height;
            }
        }

        targetX = x //(x / zoomfact);
        targetY =  y//(y / zoomfact);

        for(var i = 0; i < data.length; i++){
            if(data[i].id === id) continue

            // Doesn't compare if the other element is moving
            var compare = true;
            if(context.length > 1){
              for (var j = 0; j < context.length; j++) {
                if (data[i].id == context[j].id && !data[i].isLocked) {
                  compare = false;
                  break;
                }
              }
            }
            if(compare){
              //COMPARED ELEMENT
              const compX2 = data[i].x + data[i].width;
              var compY2 = data[i].y + data[i].height;

              // Change height if element is an UML Entity
              for (var j = 0; j < UMLHeight.length; j++) {
                if (data[i].id == UMLHeight[j].id) {
                  compY2 = data[i].y + UMLHeight[j].height;
                }
              }
              // Change height if element is an IE Entity
              for (var j = 0; j < IEHeight.length; j++) {
                if (data[i].id == IEHeight[j].id) {
                  compY2 = data[i].y + IEHeight[j].height;
                }
              }
              // Change height if element is an SD Entity
              for (var j = 0; j < SDHeight.length; j++) {
                if (data[i].id == SDHeight[j].id) {
                  compY2 = data[i].y + SDHeight[j].height;
                }
              }
              //if its overlapping with a super state, just break since that is allowed.
              if (data[i].kind == "UMLSuperState") {
                break;
              }
              //if its overlapping with a sequence actor, just break since that is allowed.
              if (data[i].kind == "sequenceActor") {
                break;
              }
              else if ((targetX < compX2) && (targetX + element.width) > data[i].x &&
                (targetY < compY2) && (targetY + elementHeight) > data[i].y) {
                isOverlapping = true;
                break;
              }
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
        setContainerStyles(mode);
        onMouseModeEnabled();
    } else {
        // Not implemented exception
        console.error("Invalid mode passed to setMouseMode method. Missing implementation?");
    }
}

/**
 * @description Changes the current visual cursor style for the user.
 * @param {Number} cursorMode containerStyle value. This will be translated into appropriate container style.
 */
function setContainerStyles(cursorMode = mouseModes.POINTER)
{
    containerStyle = document.getElementById("container").style;

    switch(cursorMode) {
        case mouseModes.POINTER:
            containerStyle.cursor = "grab";
            break;
        case mouseModes.BOX_SELECTION:
            containerStyle.cursor = "crosshair";
            break;
        case mouseModes.PLACING_ELEMENT:
            containerStyle.cursor = "default";
            break;
        case mouseModes.EDGE_CREATION:
            containerStyle.cursor = "default";
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
            clearContext();
            clearContextLine();
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
        var strokeWidth = 2;

        // Draw lines between all neighbours
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${strokeWidth}' />`;
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${strokeWidth}' />`;

        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${strokeWidth}' />`;
        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${strokeWidth}' />`;
    }
    
    return str;
}
//#endregion =====================================================================================
//#region ================================ GUI                  ==================================
/**
 * @description Generates the string that contains the current State Diagram info.
 * @returns Connected State Diagram in the form of a string.
 */
function generateStateDiagramInfo()
{
    const ENTITY = 0, SEEN = 1;
    const stateInitial = [];
    const stateFinal = [];
    const stateSuper = [];
    const stateElements = [];
    const stateLines = [];
    const queue = [];
    let output = "";
const stateLinesLabels=[];
    // Picks out the lines of type "State Diagram" and place it in its local array.
    for (let i=0; i<lines.length; i++)
    {
        if (lines[i].type == entityType.SD) { 
            stateLines.push(lines[i]);
        }
    }

    // Picks out the entities related to State Diagrams and place them in their local arrays.
    for (let i=0; i<data.length; i++)
    {
        if (data[i].kind == elementTypesNames.SDEntity) {
            stateElements.push([data[i], false]);
        }
        else if (data[i].kind == elementTypesNames.UMLInitialState) {
            stateInitial.push([data[i], false]); 
        }
        else if (data[i].kind == elementTypesNames.UMLFinalState) {
            stateFinal.push([data[i], true]);
        }
        else if (data[i].kind == elementTypesNames.UMLSuperState) {
            stateSuper.push([data[i], false]);
        }
    }

    // Initialises the BFS by adding the Initial states to the queue.
    for (let i = 0; i < stateInitial.length; i++) {
        stateInitial[i][SEEN] = true;
        queue.push(stateInitial[i]);
    }

    // Loop through all entities that are connected.
    while (queue.length > 0) {
        let head = queue.shift();
        const connections = [];
        // Finds all entities connected to the current "head" and adds line labels to a list.
        for (let i = 0; i < stateLines.length; i++) {
            if (stateLines[i].fromID == head[ENTITY].id) {
                stateLinesLabels.push(stateLines[i].label);
                for (let j = 0; j < stateElements.length; j++) {
                    if (stateLines[i].toID == stateElements[j][ENTITY].id) {
                        connections.push(stateElements[j]);
                    }
                }
                for (let j = 0; j < stateFinal.length; j++) {
                    if (stateLines[i].toID == stateFinal[j][ENTITY].id) {
                        connections.push(stateFinal[j]);
                    }
                }
                for (let j = 0; j < stateSuper.length; j++) {
                    if (stateLines[i].toID == stateSuper[j][ENTITY].id) {
                        connections.push(stateSuper[j]);
                    }
                }
            }
        }

        // Add any connected entity to the output string, and if it has not been "seen" it is added to the queue.
        for (let i = 0; i < connections.length; i++) {
        output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" </p>`;
            if (connections[i][SEEN] === false) {
                connections[i][SEEN] = true;
                queue.push(connections[i]);
            }
        }
    }

    // Adds additional information in the view.
    output+=`<p>Line labels:</p>`;
    for(var i=0; i<stateLinesLabels.length; i++)
    {
        if(stateLinesLabels[i]==undefined)
        output+=`<p>Unlabeled</p>`;
        else
        output+=`<p>${stateLinesLabels[i]}</p>`;
    }
    output += `<p>Initial States: ${stateInitial.length}</p>`;
    output += `<p>Final States: ${stateFinal.length}</p>`;
    output += `<p>Super States: ${stateSuper.length}</p>`;
    output += `<p>SD States: ${stateElements.length}</p>`;
    output += `<p>Lines: ${stateLines.length}</p>`;
    
    //if no state diagram exists, return a message to the user instead.
    if ((stateLines.length == 0) && (stateElements.length == 0) && (stateInitial.length == 0) && (stateFinal.length == 0) && (stateSuper.length == 0)) {
        output = "The feature you are trying to use is linked to state diagrams and it appears you do not have any state elements placed. Please place a state element and try again."
    }
    return output;
}
/**
 * @description hides or shows the diagram type dropdown 
 */

function toggleDiagramDropdown()
{
    const dropdown=document.getElementById("diagramTypeDropdown");
    const load=document.getElementById("diagramLoad");
    if(window.getComputedStyle(dropdown).display==="none"){
        load.style.display="block";
        dropdown.style.display="block";
    }
    else{
        load.style.display="none";
        dropdown.style.display="none";
    }
}

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
 * @description Toggles the darkmode for svgbacklayer ON/OFF.
 */
function toggleDarkmode()
{
    const stylesheet = document.getElementById("themeBlack");
    const storedTheme = localStorage.getItem('diagramTheme');

	if(storedTheme) stylesheet.href = storedTheme;

    if(stylesheet.href.includes('blackTheme')){
        // if it's dark -> go light
        stylesheet.href = "../Shared/css/style.css";
        localStorage.setItem('diagramTheme',stylesheet.href)
    } else if(stylesheet.href.includes('style')) {
        // if it's light -> go dark
        stylesheet.href = "../Shared/css/blackTheme.css";
        localStorage.setItem('diagramTheme',stylesheet.href)
    }

    showdata();

    toggleBorderOfElements();

}


/**
 * @description When diagram page is loaded, check if preferred theme is stored in local storage.
 */
document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.getElementById("themeBlack");
    if (!localStorage.getItem("diagramTheme")) return;

    stylesheet.href = localStorage.getItem("diagramTheme");
})

/**
 * @description Toggles the replay-mode, shows replay-panel, hides unused elements
 */
function toggleReplay()
{
    // If there is no history => display error and return
    if (stateMachine.historyLog.length == 0){
        displayMessage(messageTypes.ERROR, "Sorry, you need to make changes before entering the replay-mode");
        return;
    }

    // Get DOM-elements for styling
    var replayBox = document.getElementById("diagram-replay-box");
    var optionsPane = document.getElementById("options-pane");
    var toolbar = document.getElementById("diagram-toolbar");
    var ruler = document.getElementById("rulerOverlay");
    var zoomIndicator = document.getElementById("zoom-message-box");
    var replyMessage = document.getElementById("diagram-replay-message");
    var zoomContainer = document.getElementById("zoom-container");

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
        zoomContainer.style.bottom = "5px";
        zoomContainer.style.left = "100px";
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
        zoomContainer.style.bottom = "54px";
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
    const element = document.getElementById("markdownKeybinds");
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
    clearInterval(stateMachine.replayTimer);
    stateMachine.replay();
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
        button.innerHTML = '<div class="diagramIcons" onclick="clearInterval(stateMachine.replayTimer);setReplayRunning(false)"><img src="../Shared/icons/pause.svg" alt="Pause"><span class="toolTipText" style="top: -80px;"><b>Pause</b><br><p>Pause history of changes made to the diagram</p><br></span></div>';
        stateSlider.disabled = true;
    }else{
        button.innerHTML = '<div class="diagramIcons" onclick="stateMachine.replay()"><img src="../Shared/icons/Play.svg" alt="Play"><span class="toolTipText" style="top: -80px;"><b>Play</b><br><p>Play history of changes made to the diagram</p><br></span></div>';
        stateSlider.disabled = false;
    }
}
/**
 * @description Toggles the ER-table for the diagram in the "Options side-bar" on/off.
 */
function toggleErTable()
{
    if(erTableToggle == false){
        erTableToggle = true;
        testCaseToggle = false;
    }
    else if (erTableToggle == true){
        erTableToggle = false;
    }
    //if the options pane is hidden, show it.
    if (document.getElementById("options-pane").className == "hide-options-pane") {
        toggleOptionsPane();
        erTableToggle = true;
        testCaseToggle = false;
    }
    generateContextProperties();
}


/**
 * @description Toggles the testcases for the diagram in the "Options side-bar" on/off.
 */
function toggleTestCase()
{
    if (testCaseToggle == false) {
        testCaseToggle = true;
        erTableToggle = false;
    }
    else if (testCaseToggle == true) {
        testCaseToggle = false;
    }
    if (document.getElementById("options-pane").className == "hide-options-pane") {
        toggleOptionsPane();
        testCaseToggle = true;
        erTableToggle = false;
    }
    generateContextProperties();
}

/**
 * @description Generates the string which holds the ER table for the current ER-model/ER-diagram.
 * @returns Current ER table in the form of a string.
 */
function generateErTableString()
{   
    //TODO: When functionality is complete, try to minimize the overall space complexity, aka try to extract
    //only useful information from entities, attributes and relations. 
    
    var entityList = [];    //All EREntities currently in the diagram
    var attrList = [];      //All ERAttributes currently in the diagram
    var relationList = [];  //All ERRelations currently in the diagram
    var stringList = [];    //List of strings where each string holds the relevant data for each entity

    /**
     * @description Multidimensional array containing data of each entity and their attribute. Index[0] is always the element
     * @structure ERAttributeData[i] = [entityObject, attributeObject1, ..., attributeObjectN]
     */ 
    var ERAttributeData = [];
    /**
     * @description Multidimensional array containing foreign keys for every entity. The owning entity is the entity where the foreign keys are added
     * @structure   ERForeignData[i] = [owningEntityObject, [otherEntityObject, foreignAttributeObject1, ..., foreignAttributeObjectN]] 
     */ 
    var ERForeignData = [];
    /**
     * @description Multidimensional array containing relation and the connected entities. Also stores the cardinality and kind for connected entity
     * @structure   ERRelationData[i] = [relationObject, [entityObject, lineCardinality, lineKind], [otherEREntityObject, otherLineCardinality, otherLineKind]]
     */ 
    var ERRelationData = [];

    //sort the data[] elements into entity-, attr- and relationList
    for (var i = 0; i < data.length; i++) {
        
        if (data[i].kind == elementTypesNames.EREntity) {
            entityList.push(data[i]);
        }
        else if (data[i].kind == elementTypesNames.ERAttr) {
            attrList.push(data[i]);
        }
        else if (data[i].kind == elementTypesNames.ERRelation) {
            relationList.push(data[i]);
        }
    }
    //For each relation in relationList
    for (var i = 0; i < relationList.length; i++) {
        //List containing relation-element and connected entities
        var currentRelationList = [];
        currentRelationList.push(relationList[i]);
        //Sort all lines that are connected to the current relation into lineList[]
        var lineList = [];
        for (var j = 0; j < lines.length; j++) {
            //Get connected line from element
            if (relationList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            }
            //Get connected line to element
            else if (relationList[i].id == lines[j].toID) {
                lineList.push(lines[j]);
            }
        }

        //Identify every connected entity to relations
        for (var j = 0; j < lineList.length; j++) {
            for (var k = 0; k < entityList.length; k++) {
                if (entityList[k].id == lineList[j].fromID || entityList[k].id == lineList[j].toID) {
                    //Push in entity, line cardinality and kind
                    currentRelationList.push([entityList[k], lineList[j].cardinality, lineList[j].kind]);
                }
            }
        }
        //Push in relation for entity, line cardinality and kind.
        ERRelationData.push(currentRelationList);
    }

    //For each entity in entityList
    for (var i = 0; i < entityList.length; i++) {

        var currentRow = [entityList[i]];
        //Sort all lines that are connected to the current entity into lineList[]
        var lineList = []; 
        for (var j = 0; j < lines.length; j++) {
            if (entityList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            }
            else if (entityList[i].id == lines[j].toID) {
                lineList.push(lines[j]);
            }
        }
        // Identify all attributes that are connected to the current entity by using lineList[] and store them in currentEntityAttrList. Save their ID's in idList.
        var currentEntityAttrList = [];
        var idList = [];
        for (var j = 0; j < lineList.length; j++) {
            for (var h = 0; h < attrList.length; h++) {
                if (attrList[h].id == lineList[j].fromID || attrList[h].id == lineList[j].toID) {
                    currentEntityAttrList.push(attrList[h]);
                    currentRow.push(attrList[h]);
                    idList.push(attrList[h].id);
                }
            }
        }
        
        var parentAttribeList=[]; //list of parent attributes

        for (var j = 0; j < currentEntityAttrList.length; j++) {

            //For each attribute connected to the current entity, identify if other attributes are connected to themselves.
            var attrLineList = [];
            for (var h = 0; h < lines.length; h++) {
                //If there is a line to/from the attribute that ISN'T connected to the current entity, save it in attrLineList[].
                if((currentEntityAttrList[j].id == lines[h].toID || currentEntityAttrList[j].id == lines[h].fromID) && (lines[h].toID != entityList[i].id && lines[h].fromID != entityList[i].id)) {
                    attrLineList.push(lines[h]);
                }
            }
            
            //Compare each line in attrLineList to each attribute.
            for (var h = 0; h < attrLineList.length; h++) {
                
                for (var k = 0; k < attrList.length; k++) {
                    //If ID matches the current attribute AND another attribute, try pushing the other attribute to currentEntityAttrList[]
                    if (((attrLineList[h].fromID == attrList[k].id) && (attrLineList[h].toID == currentEntityAttrList[j].id)) || ((attrLineList[h].toID == attrList[k].id) && (attrLineList[h].fromID == currentEntityAttrList[j].id))) {
                        //Iterate over saved IDs
                        var hits = 0;
                        for(var p = 0; p < idList.length; p++) {
                            //If the ID of the attribute already exists, then increase hits and break the loop.
                            if (idList[p] == attrList[k].id) {
                                hits++;
                                break;
                            }
                        }
                        //If no hits, then push the attribute to currentEntityAttrList[] (so it will also be checked for additional attributes in future iterations) and save the ID.
                        if (hits == 0) {
                            // looking if the parent attribute is in the parentAttributeList 
                            if(findIndex(parentAttribeList,currentEntityAttrList[j].id) == -1){
                                parentAttribeList.push(currentEntityAttrList[j]);
                                currentEntityAttrList[j].newKeyName = "";
                            }
                            if(currentEntityAttrList[j].newKeyName == ""){
                                currentEntityAttrList[j].newKeyName += attrList[k].name;
                            }
                            else{
                                currentEntityAttrList[j].newKeyName += " "+attrList[k].name;
                            }
                            if(currentEntityAttrList[j].state != 'primary' && currentEntityAttrList[j].state != 'candidate'){
                                currentRow.push(attrList[k]);
                            }
                            currentEntityAttrList.push(attrList[k]);
                            idList.push(attrList[k].id);
                        }
                    }   
                }
            }
        }
        //Push list with entity at index 0 followed by its attributes
        ERAttributeData.push(currentRow);
    }

    var strongEntityList = formatERStrongEntities(ERAttributeData);
    var weakEntityList = formatERWeakEntities(ERAttributeData);

    // Iterate over every strong entity
    for (var i = 0; i < strongEntityList.length; i++) {
        var visitedList = []; // A list which contains entities that has been vistited in this codeblock
        var queue = []; // Queue for each entity's relation
        queue.push(strongEntityList[i][0]); // Push in the current entity
        // Loop while queue isn't empty
        while (queue.length > 0) {
            var current = queue.shift(); // Get current entity by removing first entity in queue
            // For current entity, iterate through every relation
            for (var j = 0; j < ERRelationData.length; j++) {
                // Check if relation is valid, (relation, entity1, entity2)
                if (ERRelationData[j].length >= 3) { 
                    if (ERRelationData[j][0].state == 'weak') {
                        var visited = false;    // Boolean representing if the current entity has already been visited
                        for (var v = 0; v < visitedList.length; v++) {
                            if (current.id == visitedList[v].id ) {
                                visited = true;
                                break;
                            }
                        }
                        // If current entity is not visited
                        if (!visited) {
                            // Check if current is strong / normal
                            if (current.state == 'normal') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (var k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (var l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    // Iterate through key list
                                                    for (var m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                }   
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (var k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (var l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    for (var m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][1][0]); // Push in entity to queue
                                }
                            } 
                            //Check if current is weak
                            else if (current.state == 'weak') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    var exists = false; // Boolean representing if the other entity has already been visited
                                    for (var v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][2][0].id == visitedList[v].id ) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (var k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (var l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (var m = 0; m < weakEntityList[l][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]) // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                    }
                                }
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id  && ERRelationData[j][2][1] == 'ONE') {
                                    var exists = false; // Boolean representing if the other entity has already been visited
                                    for (var v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][1][0].id == visitedList[v].id ) {//|| ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (var k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                                 // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (var l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (var m = 0; m < weakEntityList[i][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]); // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][1][0]); // Push in entity queue
                                    }
                                }
                            }
                        }
                    }
                }
            }
            visitedList.push(current);
        }
    }

    var tempWeakList = [];
    // Update the weak entity list to accomodate the new list of weak keys
    for (var i = 0; i < weakEntityList.length; i++) {
        var row = []; // New formatted weak entity row
        row.push(weakEntityList[i][0]); // Push in weak entity, as usual, [0] is entity
        row.push([]); // Push in empty list to contain the keys
        // In the weak entity's key list, iterate and check if current is an array
        for (var j = 0; j < weakEntityList[i][1].length; j++) {
            if (Array.isArray(weakEntityList[i][1][j])) {
                var strongWeakKEy = []; // List that will have the the entities and strong/weak keys required
                var current = weakEntityList[i][1][j]; // Select the first list for the current entity
                var queue = []; // Queue for search
                queue.push(current); // Insert current to queue
                // Loop until the queue is empty and at the same time, keep going deeper until the last list has been checked
                while (queue.length > 0) {
                    var temp = queue.shift(); // Remove from queue and store in temp
                    // Check if algorithm should go deeper, if the last element is an array, go deeper 
                    if ((temp[temp.length - 1].length > 0)) {
                        //Iterate through the list, push every attribute
                        for (var k = 0; k < temp.length - 1; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                        queue.push(temp[temp.length - 1]); // Push in list into queue
                    }
                    else {
                        //Iterate through the list, push every attribute
                        for (var k = 0; k < temp.length; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                    }
                }
                row[1].push(strongWeakKEy); // Push in the created strong key
            }
            // If current element is not a list, push
            else {
                row[1].push(weakEntityList[i][1][j]); // Push in key
            }
        }
        //Iterate through the entity's list and push in normal and multivalued attributes
        for (var j = 0; j < weakEntityList[i].length; j++) {
            // If not array, check if normal or multivalued
            if (!Array.isArray(weakEntityList[i][j])) {
                if (weakEntityList[i][j].state == 'normal') {
                    row.push(weakEntityList[i][j]);
                }
                else if (weakEntityList[i][j].state == 'multiple') {
                    row.push(weakEntityList[i][j]);
                }
            }
        }
        tempWeakList.push(row);
    }
    weakEntityList = tempWeakList; // Update the values in the weakEntity list

    var allEntityList = strongEntityList.concat(weakEntityList); // Add the two list together

    //Iterate through all relations
    for (var i = 0; i < ERRelationData.length; i++) {        
        if (ERRelationData[i].length >= 3) {
            var foreign = []; // Array with entities foreign keys
            // Case 1, two strong entities in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }     
                //MANY to ONE relation, key from the ONE is foreign for MANY, case 1
                else if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push(ERRelationData[i][1][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }
                //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                else if(ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }
                //MANY to MANY relation, key from both is stored together with relation
                else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                               
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (var k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 2, two weak entities in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }
                // ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                else if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                }
                // MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                else if(ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }    
                }
                //MANY to MANY relation, key from both is stored together with relation
                else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (var k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 3, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }     
                //ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                else if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                }
                //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                else if(ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                }
                //MANY to MANY relation, key from both is stored together with relation
                else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                               
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (var k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 4, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    }
                    else {
                        var exist = false; // If entity already exist in ERForeignData
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                }     
                //ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                else if(ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                }
                //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                else if(ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        }
                        else {
                            var exist = false; // If entity already exist in ERForeignData
                            for (var j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (var j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (var j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                }
                //MANY to MANY relation, key from both is stored together with relation
                else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (var k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (var j = 0; j < allEntityList.length; j++) {
                        if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if(allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (var k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                                
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (var j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (var k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Iterate and add each entity's foreign attribute to the correct place
    for(var i = 0; i < ERForeignData.length; i++) {
        // Iterate throught all entities
        for (var j = 0; j < allEntityList.length; j++ ) {
            // Check if correct entity were found
            if (ERForeignData[i][0].id == allEntityList[j][0].id) {
                var row = [];
                // Push in every foreign attribute
                for (var k = 1; k < ERForeignData[i].length; k++) {
                    row.push(ERForeignData[i][k]); // Push in entity
                }
                allEntityList[j].push(row); // Push in list
            }
        }
    }
    // Actual creating the string. Step one, strong / normal entities
    for (var i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'normal') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            var existPrimary = false; // Determine if a primary key exist
            // ITerate and determine if primary keys are present
            for (var j = 0; j < allEntityList[i][1].length; j++) {
                if (allEntityList[i][1][j].state == 'primary') {
                    existPrimary = true;
                    break;
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (var j = 0; j < allEntityList[i][1].length; j++) {
                // Print only primary keys if at least one is present
                if (existPrimary) {
                    if (allEntityList[i][1][j].state == 'primary') {
                        if(allEntityList[i][1][j].newKeyName != undefined){
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        }
                        else{
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
                //Print only candidate keys if no primary keys are present
                if (!existPrimary) {
                    if (allEntityList[i][1][j].state == 'candidate') {
                        if(allEntityList[i][1][j].newKeyName != undefined){
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        }
                        else{
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (var j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            if(allEntityList[i][j].newKeyName == undefined){
                                currentString += `${allEntityList[i][j].name}, `;
                            }
                        }
                    }
                }
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (var k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (var l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (var m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            }
                            else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            }
            else {
                // Again iterate through the list and push in only normal attributes
                for (var j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if(currentString.charAt(currentString.length-2) == ","){                
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    for (var i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'weak') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            // Once again iterate through through the entity's key attributes and add them to string
            for (var j = 0; j < allEntityList[i][1].length; j++) {
                if (!Array.isArray(allEntityList[i][1][j])) {
                    // Print only weakKeys
                    if (allEntityList[i][1][j].state == 'weakKey') {
                        currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                    }
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (var j = 0; j < allEntityList[i][1].length; j++) {
                if (Array.isArray(allEntityList[i][1][j])) {
                    currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
                    for (var k = 0; k < allEntityList[i][1][j].length; k++) {
                        currentString += `${allEntityList[i][1][j][k].name}`;
                    }
                    currentString += `</span>, `;
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (var j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (var k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (var l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (var m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            }
                            else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            }
            else {
                // Again iterate through the list and push in only normal attributes
                for (var j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if(currentString.charAt(currentString.length-2) == ","){                
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    // Iterate through ERForeignData to find many to many relation
    for (var i = 0; i < ERForeignData.length; i++) {
        // If relation is exist in ERForeignData
        if (ERForeignData[i][0].kind == 'ERRelation') {
            var currentString = '';
            currentString += `<p>${ERForeignData[i][0].name} (`; // Push in relation's name
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add left side of relation
            for (var j = 0; j < ERForeignData[i][1].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][1][j])) {
                    for (var l = 0; l < ERForeignData[i][1][j].length; l++) {
                        currentString += `${ERForeignData[i][1][j][l].name}`;
                    }
                }
                else {
                    currentString += `${ERForeignData[i][1][j].name}`;
                }
            }
            currentString += `</span>, `;
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add right side of relation
            for (var j = 0; j < ERForeignData[i][2].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][2][j])) {
                    for (var l = 0; l < ERForeignData[i][2][j].length; l++) {
                        currentString += `${ERForeignData[i][2][j][l].name}`;
                    }
                }
                else {
                    currentString += `${ERForeignData[i][2][j].name}`;
                }
            }
            currentString += `</span>`;
            currentString += `)</p>`;
            stringList.push(currentString)
        }
    }
    // Adding multi-valued attributes to the string
    for (var i = 0; i < allEntityList.length; i++) {
        for (var j = 2; j < allEntityList[i].length; j++) {
            // Write out multi attributes
            if(allEntityList[i][j].state == 'multiple') {
                // add the multiple attribute as relation
                var multipleString = `<p>${allEntityList[i][j].name}( <span style='text-decoration:underline black solid 2px'>`;
                // add keys from the entity the multiple attribute belongs to
                for (let k = 0; k < allEntityList[i][1].length; k++) {
                    // add the entity the key comes from in the begining of the string
                    multipleString += `${allEntityList[i][0].name}`;
                    // If element is array, aka strong key for weak entity
                    if (Array.isArray(allEntityList[i][1][k])) {
                        for (var l = 0; l < allEntityList[i][1][k].length; l++) {
                            multipleString += `${allEntityList[i][1][k][l].name}`;
                        }
                    }
                    else {
                        multipleString += `${allEntityList[i][1][k].name}`;
                    }
                    multipleString += `, `;
                }
                // add the multiple attribute in the relation
                multipleString += `${allEntityList[i][j].name}`;
                multipleString += `</span>)</p>`;
                stringList.push(multipleString);
            }
        }
    }
    //Add each string element in stringList[] into a single string.
    var stri = "";
    for (var i = 0; i < stringList.length; i++) {
        stri += new String(stringList[i] + "\n\n");
    }
    //if its empty, show a message instead.
    if (stri == "") {
        stri = "The feature you are trying to use is linked to ER tables and it appears you do not have any ER elements placed. Please place an ER element and try again."
    }
    return stri;
}
/**
 * @description Formats a list of strong/normal entities and their attributes.
 * @param ERDATA A list of all entities and it's attributes 
 * @returns A formated list of all strong/normal entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERStrongEntities(ERData){
    var temp = []; // The formated list of strong/normal entities 
    // Iterating through all entities
    for (var i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'normal') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (primary, candidate and weakKey)
            // Pushing in weak keys last to ensure that the first key in a strong/normal entity isn't weak
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }  
            }
            // Pushing in remaining multivalued attributes
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'multiple') {
                    row.push(ERData[i][j]);
                }  
            }
            temp.push(row); // Pushing the formated row to the temp list
        }
    }
    return temp;
}

/**
 * @description Formats a list of weak entities and their attributes.
 * @param ERDATA A list of all entities and it's attributes 
 * @returns A formated list of all weak entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERWeakEntities(ERData){
    var temp = []; // The formated list of weak entities 
    // Iterating through all entities
    for (var i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'weak') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (weakKey, primary and candidate)
            // Pushing in weak keys first to ensure that the first key in a weak entity is weak
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }  
            }
            // Pushing in remaining multivalued attributes
            for (var j = 1; j < ERData[i].length; j++ ) {
                if (ERData[i][j].state == 'multiple') {
                    row.push(ERData[i][j]);
                }  
            }
            temp.push(row); // Pushing the formated row to the temp list
        }
    }
    return temp;
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
/**
 * @description turns the error checking functionality on/off
 */
function toggleErrorCheck(){
    // Inverts the errorActive variable to true or false
    errorActive = !errorActive;
    if (errorActive) {
        document.getElementById("errorCheckToggle").classList.add("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is on.');
    }  
    else{
        document.getElementById("errorCheckToggle").classList.remove("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is off.');
    }
    showdata();
}
/**
 * @description hides the error check button when not allowed
 */
function hideErrorCheck(show){
    if(show == true){
        document.getElementById("errorCheckField").style.display = "flex";
        // Enables error check by pressing 'h', only when error check button is visible
        document.addEventListener("keyup", event => {
            if (event.key === 'h') {
                toggleErrorCheck();                   
            }
        });
    }
    else{
        document.getElementById("errorCheckField").style.display = "none";
    }
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
        ruler.style.left = "-100px";
        ruler.style.top = "-100px";
        rulerToggleButton.style.backgroundColor = "#614875";
    } else {
        ruler.style.left = "50px";
        ruler.style.top = "0px";
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
//<-- UML functionality start
/**
 * @description Function to open a subtoolbar when pressing down on a button for a certan period of time
 */
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
 * @param {Number} type the type of element selected. (which pop-out we are referring to)
 */
function togglePlacementType(num,type){
    if(type==0){
        document.getElementById("elementPlacement0").classList.add("hiddenPlacementType");// ER entity start
        document.getElementById("elementPlacement0").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement0").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton0").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox0").classList.remove("activeTogglePlacementTypeBox");// ER entity end
        document.getElementById("elementPlacement4").classList.add("hiddenPlacementType");// UML entity start
        document.getElementById("elementPlacement4").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement4").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton4").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox4").classList.remove("activeTogglePlacementTypeBox");// UML entity end
        document.getElementById("elementPlacement6").classList.add("hiddenPlacementType");// IE entity start
        document.getElementById("elementPlacement6").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement6").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton6").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox6").classList.remove("activeTogglePlacementTypeBox");// IE entity end
        document.getElementById("elementPlacement8").classList.add("hiddenPlacementType");// SD state start
        document.getElementById("elementPlacement8").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement8").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton8").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox8").classList.remove("activeTogglePlacementTypeBox");// SD state end
    }
    else if(type==1){
        document.getElementById("elementPlacement1").classList.add("hiddenPlacementType");// ER relation start
        document.getElementById("elementPlacement1").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement1").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton1").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox1").classList.remove("activeTogglePlacementTypeBox");// ER relation end
        document.getElementById("elementPlacement5").classList.add("hiddenPlacementType"); // UML inheritance start
        document.getElementById("elementPlacement5").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement5").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton5").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox5").classList.remove("activeTogglePlacementTypeBox");// UML inheritance end
        document.getElementById("elementPlacement7").classList.add("hiddenPlacementType"); //IE inheritance start
        document.getElementById("elementPlacement7").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement7").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton7").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox7").classList.remove("activeTogglePlacementTypeBox"); // IE inheritance end
    }
    else if (type == 9) {
        document.getElementById("elementPlacement9").classList.add("hiddenPlacementType");// ER relation start
        document.getElementById("elementPlacement9").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement9").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton9").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox9").classList.remove("activeTogglePlacementTypeBox");// ER relation end
        document.getElementById("elementPlacement10").classList.add("hiddenPlacementType"); // UML inheritance start
        document.getElementById("elementPlacement10").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement10").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton10").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox10").classList.remove("activeTogglePlacementTypeBox");// UML inheritance end
        document.getElementById("elementPlacement11").classList.add("hiddenPlacementType"); //IE inheritance start
        document.getElementById("elementPlacement11").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement11").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton11").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox11").classList.remove("activeTogglePlacementTypeBox"); // IE inheritance end
    }

    else if (type == 12) {
        // Sequence lifetime
        document.getElementById("elementPlacement12").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement12").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement12").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton12").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox12").classList.remove("activeTogglePlacementTypeBox"); 
        // Sequence activation
        document.getElementById("elementPlacement13").classList.add("hiddenPlacementType"); 
        document.getElementById("elementPlacement13").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement13").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton13").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox13").classList.remove("activeTogglePlacementTypeBox");
        // Sequence object
        document.getElementById("elementPlacement14").classList.add("hiddenPlacementType"); 
        document.getElementById("elementPlacement14").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement14").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton14").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox14").classList.remove("activeTogglePlacementTypeBox"); 
        // Sequence condition/loop object
        document.getElementById("elementPlacement15").classList.add("hiddenPlacementType"); 
        document.getElementById("elementPlacement15").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement15").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton15").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox15").classList.remove("activeTogglePlacementTypeBox");
    }
    
    // Unhide the currently selected placement type
    document.getElementById("elementPlacement"+num).classList.remove("hiddenPlacementType");
}//<-- UML functionality end



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
 * @description Zooms to desiredZoomfactor from center of diagram.
 */
function zoomCenter(centerDiagram)
{
    zoomOrigo.x = centerDiagram.x;
    zoomOrigo.y = centerDiagram.y;

    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;
   
    zoomfact = desiredZoomfact;
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

function determineZoomfact(maxX, maxY, minX, minY)
{
    // Resolution of the screen
    var screenResolution = {
        x: window.innerWidth,
        y: window.innerHeight
    };

    // Checks if elements are within the window for the smalest zoomfact
    desiredZoomfact = 0.25;
    if (maxX-minX < ((screenResolution.x*1.25*1.5)-150) && maxY-minY < ((screenResolution.y*1.25*1.5)-100))desiredZoomfact = 0.5;
    if (maxX-minX < ((screenResolution.x*1.25)-150) && maxY-minY < ((screenResolution.y*1.25)-100))desiredZoomfact = 0.75;
    if (maxX-minX < (screenResolution.x-150) && maxY-minY < screenResolution.y-100)desiredZoomfact = 1.0;
    if (maxX-minX < ((screenResolution.x*0.75)-150) && maxY-minY < ((screenResolution.y*0.75)-100))desiredZoomfact = 1.25;
    if (maxX-minX < ((screenResolution.x*0.64)-150) && maxY-minY < ((screenResolution.y*0.64)-100))desiredZoomfact = 1.5;
    if (maxX-minX < ((screenResolution.x*0.5)-150) && maxY-minY < ((screenResolution.y*0.5)-100)) desiredZoomfact = 2.0;
    if (maxX-minX < ((screenResolution.x*0.25)-150) && maxY-minY < ((screenResolution.y*0.25)-100)) desiredZoomfact = 4.0;
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
 * @description Function used to format the attribute and function textareas in UML- and IE-entities. Every entry is written on new row.
 * @param {*} arr Input array with all elements that should be seperated by newlines
 * @returns Formated string containing all the elements in arr
 */
function textboxFormatString(arr)
{
    var content = '';
    for (var i = 0; i < arr.length; i++) {
        content += arr[i] + '\n';   
    }
    return content;
}

/**
 * @description Generates fields for all properties of the currently selected element/line in the context. These fields can be used to modify the selected element/line.
 */ 
function generateContextProperties()
{
    var propSet = document.getElementById("propertyFieldset");
    var menuSet = document.getElementsByClassName('options-section');
    
    var str = "<legend>Properties</legend>";
/*     
    //a4 propteries
    if (document.getElementById("a4Template").style.display === "block") {
        str += `<text>Change the size of the A4</text>`;
        str += `<input type="range" onchange="setA4SizeFactor(event)" min="100" max="200" value ="${settings.grid.a4SizeFactor*100}" id="slider">`;
        str += `<br><button onclick="toggleA4Vertical()">Vertical</button>`;
        str += `<button onclick="toggleA4Horizontal()">Horizontal</button>`;
    } */

    //No element or line selected
    if (context.length == 0 && contextLine.length == 0 && !erTableToggle && !testCaseToggle) {
        //Hide properties and show the other options
        propSet.classList.add('options-fieldset-hidden');
        propSet.classList.remove('options-fieldset-show');
        for (var i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add('options-fieldset-show');
            menuSet[i].classList.remove('options-fieldset-hidden');
        }
    }
    // No element or line selected, but either erTableToggle or testCaseToggle is active.
    else if (context.length == 0 && contextLine.length == 0 && (erTableToggle || testCaseToggle)) {
        //Show properties and hide the other options
        propSet.classList.add('options-fieldset-show');
        propSet.classList.remove('options-fieldset-hidden');
        for (var i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add('options-fieldset-hidden');
            menuSet[i].classList.remove('options-fieldset-show');
        }
    }

    //If erTableToggle is true, then display the current ER-table instead of anything else that would be visible in the "Properties" area.
    if (erTableToggle == true) {
        str +=`<div id="ERTable">`
        var ertable = generateErTableString();
        str += ertable;
        str += `</div>`
    }
    //If testCaseToggle is true, then display the current ER-table instead of anything else that would be visible in the "Properties" area.
    else if (testCaseToggle) {
        str += '<div id="ERTable">'; //using same styling for now, maybe change later
        str += generateStateDiagramInfo();
        str += '</div>';
    }
    else {
      //One element selected, no lines
      if (context.length == 1 && contextLine.length == 0) {
          //Show properties and hide the other options
          propSet.classList.add('options-fieldset-show');
          propSet.classList.remove('options-fieldset-hidden');
          for (var i = 0; i < menuSet.length; i++) {
              menuSet[i].classList.add('options-fieldset-hidden');
              menuSet[i].classList.remove('options-fieldset-show');  
          }

          //Get selected element
          const element = context[0];

          //Skip diagram type-dropdown if element does not have an UML equivalent, in this case only applies to ER attributes
          //TODO: Find a way to do this dynamically as new diagram types are added
          if (element.kind != 'ERAttr') {
              str += `<div style='color:white'>Type</div>`;

              //Create a dropdown menu for diagram type
              var value = Object.values(entityType);
              var selected = context[0].type;

              str += '<select id="typeSelect">';
              for (i = 0; i < value.length; i++) {
                  if (selected != value[i]) {
                      str += '<option value='+value[i]+'>'+ value[i] +'</option>';   
                  } else if(selected == value[i]) {
                      str += '<option selected ="selected" value='+value[i]+'>'+ value[i] +'</option>';
                  }
              }
              str += '</select>'; 
          }

          //Selected ER type
          if (element.type == 'ER') {
              //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111 
              for (const property in element) {
                  switch (property.toLowerCase()) {
                      case 'name':
                          str += `<div style='color:white'>Name</div>`;
                          str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                          break;
                      default:
                          break;
                  }
              }
              str += `<div style='color:white'>Variant</div>`;

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
          }

          //Selected UML type
          else if (element.type == 'UML') {
              //If UML entity
              if (element.kind == 'UMLEntity') {
                  //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111 
                  for (const property in element) {
                      switch (property.toLowerCase()) {
                          case 'name':
                              str += `<div style='color:white'>Name</div>`;
                              str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                              break;
                          case 'attributes':
                              str += `<div style='color:white'>Attributes</div>`;
                              str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                              break;
                          case 'functions':
                              str += `<div style='color:white'>Functions</div>`;
                              str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                              break;
                          default:
                              break;
                      }
                  }
              }

              //If UML inheritance
              else if (element.kind = 'UMLRelation') {
                //ID MUST START WITH "elementProperty_"!!!!!
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='display:none;'>Name</div>`;
                            str += `<input id='elementProperty_${property}' style='display:none;' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        default:
                            break;
                    }
                }
                  str += `<div style='color:white'>Inheritance</div>`;
                  //Creates drop down for changing state of ER elements
                  var value;
                  var selected = context[0].state;
                  if(selected == undefined) {
                      selected = "disjoint"
                  }

                  if(element.kind=="UMLRelation") {
                      value = Object.values(inheritanceState);
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
              }     
          }
          //Selected IE type
          else if (element.type == 'IE') {
            //If IE entity
            if (element.kind == 'IEEntity') {
                //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111 
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        case 'attributes':
                            str += `<div style='color:white'>Attributes</div>`;
                            str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                            break;
                        default:
                            break;
                    }
                }
            }
            else if(element.kind = 'IERelation') {
              //ID MUST START WITH "elementProperty_"!!!!!
              for (const property in element) {
                  switch (property.toLowerCase()) {
                      case 'name':
                          str += `<div style='display:none;'>Name</div>`;
                          str += `<input id='elementProperty_${property}' style='display:none;' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                          break;
                      default:
                          break;
                  }
              }
                str += `<div style='color:white'>Inheritance</div>`;
                //Creates drop down for changing state of IE elements
                var value;
                var selected = context[0].state;
                if(selected == undefined) {
                    selected = "disjoint"
                }

                if(element.kind =="IERelation") {
                    value = Object.values(inheritanceStateIE);
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
            }
        }
        //Selected SD type
        else if (element.type == 'SD') {
            //if SDEntity kind
            if (element.kind == 'SDEntity') {
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        case 'attributes':
                            str += `<div style='color:white'>Attributes</div>`;
                           /* find me str += `<div>`;
                            str += `<select id="SDOption">`;
                                str +=  `<option value ="Do: " selected>Do</option>`;
                                str += `<option value="Exit: ">Exit</option>`;
                            str += `</select>`;
                            str += `</div>`; */
                            str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                            break;
                        default:
                            break;
                    }
                }
            }
            else if (element.kind == 'UMLSuperState') {
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        //Selected sequence type
        else if (element.type == 'SE') {
            //if sequenceActorAndObject kind
            if (element.kind == 'sequenceActorAndObject') {
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        case 'actororobject':
                            //buttons for choosing object or actor via toggleActorOrbject
                            str += `<div>`
                            str += `<button onclick='toggleActorOrbject("actor");'>Actor</button>`
                            str += `<button onclick='toggleActorOrbject("object");'>Object</button>`
                            str += `</div>`
                            break;
                        default:
                            break;
                    }
                }
                
            }
            else if(element.kind == 'sequenceLoopOrAlt'){
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'alternatives':
                            str += `<div>Each line is an alternative. Just one is a loop.`;
                            //TODO in the future, this can be implemented as part of saveProperties and combine attribute and func and alternatives cases.
                            str += `<textarea id='inputAlternatives' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                            str += `</div>`;
                            break;
                        default:
                            break;
                    }
                }
            } 
        }
    


        /// Creates button for selecting element background color if not a UML relation since they should not be able change color
        if (element.kind != 'UMLRelation' && element.kind != 'IERelation') {
              // Creates button for selecting element background color
            str += `<div style="white">Color</div>`;
            str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
               `<span id="BGColorMenu" class="colorMenu"></span></button>`;
        }
        str += `<br><br><input type="submit" value="Save" class='saveButton' onclick="setSequenceAlternatives();changeState();saveProperties();generateContextProperties();">`;
      }

      // Creates radio buttons and drop-down menu for changing the kind attribute on the selected line.
      if (contextLine.length == 1 && context.length == 0) {
        //Show properties and hide the other options
        propSet.classList.add('options-fieldset-show');
        propSet.classList.remove('options-fieldset-hidden');
        for (var i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add('options-fieldset-hidden');
            menuSet[i].classList.remove('options-fieldset-show');  
        }

        str = "<legend>Properties</legend>";

        var value;
        var selected = contextLine[0].kind;
        if(selected == undefined) selected = normal;

        value = Object.values(lineKind);
        //this creates line kinds for UML IE AND ER
        if(contextLine[0].type == 'UML' || contextLine[0].type == 'IE' || contextLine[0].type == 'ER') {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
            for(var i = 0; i < value.length; i++){
                if(i!=1 && findUMLEntityFromLine(contextLine[0]) != null || i!=2 && findUMLEntityFromLine(contextLine[0]) == null){
                    if(selected == value[i]){
                        str += `<input type="radio" id="lineRadio${i+1}" name="lineKind" value='${value[i]}' checked>`
                        str += `<label for='${value[i]}'>${value[i]}</label><br>`
                    }else {
                        str += `<input type="radio" id="lineRadio${i+1}" name="lineKind" value='${value[i]}'>`
                        str += `<label for='${value[i]}'>${value[i]}</label><br>` 
                    }
                }
            }
        }
            
        if (contextLine[0].type == 'ER') {
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
                    str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
                    str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
                    if(contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
                    str += `/>`;
                }
            }
        }
        if ((contextLine[0].type == 'UML') || (contextLine[0].type == 'SD')) {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
            str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
            str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
            if(contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
            str += `/>`;
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`;
            str += `<input id="lineStartLabel" maxlength="50" type="text" placeholder="Start cardinality"`;
            if(contextLine[0].startLabel && contextLine[0].startLabel != "") str += `value="${contextLine[0].startLabel}"`;
            str += `/>`;
            str += `<input id="lineEndLabel" maxlength="50" type="text" placeholder="End cardinality"`;
            if(contextLine[0].endLabel && contextLine[0].endLabel != "") str += `value="${contextLine[0].endLabel}"`;
            str += `/>`;
        }
        if (contextLine[0].type == 'UML' || contextLine[0].type == 'IE' ) {
            str += `<label style="display: block">Icons:</label> <select id='lineStartIcon' onchange="changeLineProperties()">`;
            str  += `<option value=''>None</option>`;
            //iterate through all the icons assicoated with UML, like Arrow or Black Diamond and add them to the drop down as options
            Object.keys(UMLLineIcons).forEach(icon => {
                if (contextLine[0].startIcon != undefined) {
                    //this covers Triangle and Arrow.
                    //If the lines in context happen to be matching something in the drop down, it is set as selected.
                    if (contextLine[0].startIcon.toUpperCase() == icon){
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        console.log("icon is " + icon);
                        console.log("startIcon is " + contextLine[0].startIcon.toUpperCase());
                    }
                    //white and diamond needs their own if statement since contextLine[0].startIcon can be White_Diamond,
                    //while icon is WHITEDIAMOND. So I decided the most suitable way is to manually check it.
                    else if ((contextLine[0].startIcon == "White_Diamond") && (icon == "WHITEDIAMOND")) {
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                    }
                    else if ((contextLine[0].startIcon == "Black_Diamond") && (icon == "BLACKDIAMOND")) {
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                    }
                    //else, its not matching and the option is just added to the dropdown normally.
                    else {
                        str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                    }
                }
                else {
                    str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                }
            });
            //iterate trough all icons associated with IE. add these icons to the drop down
            //if the line in context has one of these lines in the starting position, just like for UML, it is automatically selected
            Object.keys(IELineIcons).forEach(icon => {
                if (contextLine[0].startIcon != undefined) {
                    //this only really covers WEAK, since the rest have a inconsistent naming scheme, like ONE_MANY; its also reffered to as 1-M
                    //This means we have to manually check these and others like them
                    if (contextLine[0].startIcon.toUpperCase() == icon){
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //icon can be ZERO_MANY while start icon can be 0-M.
                    else if ((contextLine[0].startIcon.toUpperCase() == "0-M") && (icon == "ZERO_MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ZERO_ONE not being equal to 0-1
                    else if ((contextLine[0].startIcon.toUpperCase() == "0-1") && (icon == "ZERO_ONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ONE not being equal to 1
                    else if ((contextLine[0].startIcon.toUpperCase() == "1") && (icon == "ONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers FORCEDONE not being equal to 1!
                    else if ((contextLine[0].startIcon.toUpperCase() == "1!") && (icon == "FORCEDONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ONE_MANY not being equal to 1-M
                    else if ((contextLine[0].startIcon.toUpperCase() == "1-M") && (icon == "ONE_MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers MANY not being equal to M
                    else if ((contextLine[0].startIcon.toUpperCase() == "M") && (icon == "MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    else {
                        str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                    }
                }
                else {
                    str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                }
            });
            str += `</select><select id='lineEndIcon' onchange="changeLineProperties()">`;
            str  += `<option value=''>None</option>`;
            Object.keys(UMLLineIcons).forEach(icon => {
                if (contextLine[0].endIcon != undefined) {
                    //this covers Triangle and Arrow.
                    //If the lines in context happen to be matching something in the drop down, it is set as selected.
                    if (contextLine[0].endIcon.toUpperCase() == icon){
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                    }
                    //white and diamond needs their own if statement since contextLine[0].startIcon can be White_Diamond,
                    //while icon is WHITEDIAMOND. So I decided the most suitable way is to manually check it.
                    else if ((contextLine[0].endIcon == "White_Diamond") && (icon == "WHITEDIAMOND")) {
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                    }
                    else if ((contextLine[0].endIcon == "Black_Diamond") && (icon == "BLACKDIAMOND")) {
                        str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                    }
                    else {
                        str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                    }
                }
                //else, its not matching and the option is just added to the dropdown normally.
                else {
                    str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                }
            });
            Object.keys(IELineIcons).forEach(icon => {
                if (contextLine[0].endIcon != undefined) {
                    //this only really covers WEAK, since the rest have a inconsistent naming scheme, like ONE_MANY; its also reffered to as 1-M
                    //This means we have to manually check these and others like them
                    if (contextLine[0].endIcon.toUpperCase() == icon){
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //icon can be ZERO_MANY while start icon can be 0-M.
                    else if ((contextLine[0].endIcon.toUpperCase() == "0-M") && (icon == "ZERO_MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ZERO_ONE not being equal to 0-1
                    else if ((contextLine[0].endIcon.toUpperCase() == "0-1") && (icon == "ZERO_ONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ONE not being equal to 1
                    else if ((contextLine[0].endIcon.toUpperCase() == "1") && (icon == "ONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers FORCEDONE not being equal to 1!
                    else if ((contextLine[0].endIcon.toUpperCase() == "1!") && (icon == "FORCEDONE")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers ONE_MANY not being equal to 1-M
                    else if ((contextLine[0].endIcon.toUpperCase() == "1-M") && (icon == "ONE_MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    //this covers MANY not being equal to M
                    else if ((contextLine[0].endIcon.toUpperCase() == "M") && (icon == "MANY")) {
                        str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                    }
                    else {
                        str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                    }
                }
                else {
                    str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                }
            });
            str += `</select>`;
        }
        //generate the dropdown for SD line icons.
        if (contextLine[0].type == 'SD') {
            str += `<label style="display: block">Icons:</label> <select id='lineStartIcon' onchange="changeLineProperties()">`;
            str  += `<option value=''>None</option>`;
            //iterate through all the icons assicoated with SD, and add them to the drop down as options
            Object.keys(SDLineIcons).forEach(icon => {
                if (contextLine[0].startIcon != undefined) {
                    //If the lines in context happen to be matching something in the drop down, it is set as selected.
                    if (contextLine[0].startIcon == icon){
                        str += `<option value='${SDLineIcons[icon]}' selected>${SDLineIcons[icon]}</option>`;
                    }
                    //else, its not matching and the option is just added to the dropdown normally.
                    else {
                        str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                    }
                }
                else {
                    str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                }
            });
            str += `</select><select id='lineEndIcon' onchange="changeLineProperties()">`;
            str  += `<option value=''>None</option>`;
            Object.keys(SDLineIcons).forEach(icon => {
                if (contextLine[0].endIcon != undefined) {
                    //If the lines in context happen to be matching something in the drop down, it is set as selected.
                    if (contextLine[0].endIcon == icon){
                        str += `<option value='${SDLineIcons[icon]}' selected>${SDLineIcons[icon]}</option>`;
                    }
                    //else, its not matching and the option is just added to the dropdown normally.
                    else {
                        str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                    }
                }
                else {
                    str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                }
            });
            str += `</select>`;
            str += `<label style="display: block">Line Type:</label><select id='lineType' onchange='changeLineProperties()'>`;
            Object.keys(SDLineType).forEach(type => {
                if (contextLine[0].innerType.localeCompare(type, undefined, { sensitivity: 'base' }) === 0) {
                    str += `<option value='${SDLineType[type]}' selected>${SDLineType[type]}</option>`;
                }
                else {
                    str += `<option value='${SDLineType[type]}' >${SDLineType[type]}</option>`;
                }
            });
            str += `</select>`; 
        }
        str+=`<br><br><input type="submit" class='saveButton' value="Save" onclick="changeLineProperties();displayMessage(messageTypes.SUCCESS, 'Successfully saved')">`;
      }

      //If more than one element is selected
      if (context.length > 1) {
          //Show properties and hide the other options
          propSet.classList.add('options-fieldset-show');
          propSet.classList.remove('options-fieldset-hidden');
          for (var i = 0; i < menuSet.length; i++) {
              menuSet[i].classList.add('options-fieldset-hidden');
              menuSet[i].classList.remove('options-fieldset-show');  
          }

          str += `<div style="color: white">Color</div>`;
          str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
              `<span id="BGColorMenu" class="colorMenu"></span></button>`;
      }

      if (context.length > 0) {
          //Show properties and hide the other options
          propSet.classList.add('options-fieldset-show');
          propSet.classList.remove('options-fieldset-hidden');
          for (var i = 0; i < menuSet.length; i++) {
              menuSet[i].classList.add('options-fieldset-hidden');
              menuSet[i].classList.remove('options-fieldset-show');  
          }

          var locked = true;
          for (var i = 0; i < context.length; i++) {
              if (!context[i].isLocked) {
                  locked = false;
                  break;
              }
          }
          str += `<br></br><input type="submit" id="lockbtn" value="${locked ? "Unlock" : "Lock"}" class="saveButton" onclick="toggleEntityLocked();">`;
      }
      }
      propSet.innerHTML = str;

      multipleColorsTest();
    }

/**
 * 
 * @description function for include button to the options panel,writes out << Include >>
 */
function setLineLabel()
{
    document.getElementById("lineLabel").value = "&#60&#60include&#62&#62";
}

/**
 * @description Toggles the option menu being open or closed.
 */
function toggleOptionsPane()
{
    if (document.getElementById("options-pane").className == "show-options-pane") {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        if(document.getElementById("BGColorMenu") != null){
            document.getElementById("BGColorMenu").style.visibility = "hidden";
        }
        document.getElementById("options-pane").className = "hide-options-pane";
    } else {
        document.getElementById('optmarker').innerHTML = "&#9650;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}

/**
 * @description Generates keybind tooltips for all keybinds that are available for the diagram.
 * @see keybinds All available keybinds currently configured
 */
function generateToolTips()
{
    var toolButtons = document.getElementsByClassName("key_tooltip");

    for (var index = 0; index < toolButtons.length; index++) {
        const element = toolButtons[index];
        var id = element.id.split("-")[1];
        if (Object.getOwnPropertyNames(keybinds).includes(id)) {

            var str = "Keybinding: ";

            if (keybinds[id].ctrl) str += "CTRL + ";
            str += '"' + keybinds[id].key.toUpperCase() + '"';

           element.innerHTML = str;
        }
    }
}

/**
 * @description Generates a markdown file with a list of keybinds from file diagramkeybinds.md for all keybinds that are available in the diagram.
 */
async function generateKeybindList()
{
try
{
    const response=await fetch("diagramkeybinds.md");
    const file=await response.text();
    document.getElementById("markdownKeybinds").innerHTML = parseMarkdown(file);
}
catch(error)
{
console.error(error);
}
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

    //Do not remore, for later us to make gridsize in 1cm.
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
        const element = document.getElementById(settings.misc.errorMsgMap[timer].id); 
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
            <circle id="BGColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${colors[i]}" onclick="setElementColors('BGColorCircle${i}')" stroke="#000000" stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        } else {
            // Create svg circles for each element in the "strokeColors" array
            for (var i = 0; i < strokeColors.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="strokeColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${strokeColors[i]}" onclick="setElementColors('strokeColorCircle${i}')" stroke="#000000" stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        }

        // Menu position relative to button
        menu.style.width = width + "px";
        var buttonWidth = button.offsetWidth;
        var offsetWidth = window.innerWidth - button.getBoundingClientRect().x - (buttonWidth);
        var offsetHeight = button.getBoundingClientRect().y;
        menu.style.top = (offsetHeight-50) + "px";
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
            
            elementIDs.push(context[i].id)

            /*
            // Change font color to white for contrast, doesn't work for whatever reason but will maybe provide a hint for someone who might want to try to solve it.
            if (clickedCircleID == "BGColorCircle9" || clickedCircleID == "BGColorCircle6") {
                console.log("du har klickat på svart eller rosa färg");
               document.getElementsByClassName("text").style.color = "#ffffff";
            }
            else{
                //element.id.style.color = "#000000";
            }*/
        }

        stateMachine.save(
            StateChangeFactory.ElementAttributesChanged(elementIDs, { fill: color }),
            StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED
        );
    } else if (menu.id == "StrokeColorMenu") {  // If stroke button was pressed
        var index = id.replace("strokeColorCircle", "") * 1;
        var color = strokeColors[index];
        for (var i = 0; i < context.length; i++) {
            context[i].stroke = color;
            elementIDs[i] = context[i].id;
        }
        stateMachine.save(
            StateChangeFactory.ElementAttributesChanged(elementIDs, { stroke: color }),
            StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED
        );
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
 * @param {String} currentElementID Hexadecimal id for the element at current test index for sorting.
 * @param {String} compareElementID Hexadecimal id for the element were comparing to.
 * @param {Array<Object>} ends Array of all lines connected on this side.
 * @param {String} elementid Hexadecimal id for element to perform sorting on.
 * @param {Number} axis 
 * @returns {Number} 1 or -1 depending in the resulting calculation.
 */
function sortvectors(currentElementID, compareElementID, ends, elementid, axis)
{
    // Get dx dy centered on association end e.g. invert vector if necessary
    var currentElementLine = (ghostLine && currentElementID === ghostLine.id) ? ghostLine : lines[findIndex(lines, currentElementID)];
    var compareElementLine = (ghostLine && compareElementID === ghostLine.id) ? ghostLine : lines[findIndex(lines, compareElementID)];
    var parent = data[findIndex(data, elementid)];

    // Retrieve opposite element - assume element center (for now)
     if (currentElementLine.fromID == elementid) {
        toElementA = (currentElementLine == ghostLine) ? ghostElement : data[findIndex(data, currentElementLine.toID)];
    } else {
        toElementA = data[findIndex(data, currentElementLine.fromID)];
    }

    if (compareElementLine.fromID == elementid) {
        toElementB = (compareElementLine == ghostLine) ? ghostElement : data[findIndex(data, compareElementLine.toID)];
    } else {
        toElementB = data[findIndex(data, compareElementLine.fromID)];
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
        ay = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(currentElementID) + 1));
        by = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(compareElementID) + 1));
        if (axis == 0) parentx = parent.x1
        else parentx = parent.x2;

        if (linetest(toElementA.cx, toElementA.cy, parentx, ay, toElementB.cx, toElementB.cy, parentx, by) === false) return sortval

    } else if (axis == 2 || axis == 3) {
        // Top / Bottom side
        ax = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(currentElementID) + 1));
        bx = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(compareElementID) + 1));
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
    var felem, telem, dx, dy

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
        if (line.dx > 0) line.ctype = "LR";
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
    if (element.top.length > 1) element.top.sort(function (currentElementID, compareElementID) { return sortvectors(currentElementID, compareElementID, element.top, element.id, 2) });
    if (element.bottom.length > 1) element.bottom.sort(function (currentElementID, compareElementID) { return sortvectors(currentElementID, compareElementID, element.bottom, element.id, 3) });
    if (element.left.length > 1) element.left.sort(function (currentElementID, compareElementID) { return sortvectors(currentElementID, compareElementID, element.left, element.id, 0) });
    if (element.right.length > 1) element.right.sort(function (currentElementID, compareElementID) { return sortvectors(currentElementID, compareElementID, element.right, element.id, 1) });
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

    
    if (fromElement.id === toElement.id && !(fromElement.kind === 'SDEntity' || toElement.kind === 'SDEntity')) {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between: ${fromElement.name} and ${toElement.name}, they are the same element`);
        return;
    }
    
    // Prevent a line to be drawn between elements of different types.
    if (fromElement.type != toElement.type) {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines between: ${fromElement.type}- and ${toElement.type}-elements`);
        return;
    }
    //checks if a line is drawn to UMLInitialState.
    if (toElement.kind == "UMLInitialState") {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines to: ${toElement.kind}`);
        return;
    }else if(fromElement.kind == "UMLFinalState") {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines from: ${fromElement.kind}`);
        return; 
    }

    // Helps to decide later on, after passing the tests after this loop and the next two loops if the value should be added
    var exists = false;
    for (i = 0; i < allAttrToEntityRelations.length; i++) {
        if (toElement.id == allAttrToEntityRelations[i]) {
            exists = true;
            break;
        }
        if (fromElement.id == allAttrToEntityRelations[i]) {
            exists = true;
            break;
        }
    }

    // Adding elements to the array that carries attributes connected to attributes without being directly connected to an entity or relation
    for (i = 0; i < allAttrToEntityRelations.length; i++) {
        if (fromElement.kind === "ERAttr" && toElement.kind === "ERAttr" && fromElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = toElement.id;
            attrViaAttrCounter++;
            break;
        }
        else if (fromElement.kind === "ERAttr" && toElement.kind === "ERAttr" && toElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = fromElement.id;
            attrViaAttrCounter++;
            break;
        }
    }
    
    // Adding attributes to the array that only carries attributes directly connected to entities or relations
    if (!exists) {
        if (toElement.kind == "ERRelation") {
            allAttrToEntityRelations[countUsedAttributes] = fromElement.id;
            countUsedAttributes++;
        }
        else {
            allAttrToEntityRelations[countUsedAttributes] = toElement.id;
            countUsedAttributes++;
        }
    }

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
    if(fromElement.kind === "ERRelation" && fromElement.kind == "Normal" || toElement.kind === "ERRelation" && toElement.kind == "Normal") {
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
        for (i = 0; i < allAttrToEntityRelations.length; i++) {
            if (allAttrToEntityRelations[i] == fromElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            }
            else if (allAttrToEntityRelations[i] == toElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            }
        }
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
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if(successMessage) displayMessage(messageTypes.SUCCESS,`Created new line between: ${fromElement.name} and ${toElement.name}`);
        return newLine;
        
    } else {
        displayMessage(messageTypes.ERROR,`Maximum amount of lines between: ${fromElement.name} and ${toElement.name}`);
    }
}

/**
 * @description Returns true or false if element is considered close to each other.
 * @param {Object} elementFrom
 * @param {Object} elementTo
 * @param {int} concideredNearValue
 * @return {boolean} result
 */
function isClose(fromX, toX, fromY, toY, zoom = 1) {
    const concideredNearValue = 600 * zoom,
          deltaX = Math.abs(toX - fromX),
          deltaY = Math.abs(toY - fromY);

    // Returns true if deltaX and deltaY is within considered near value, otherwise false
    return deltaX < concideredNearValue && deltaY < concideredNearValue
}

/**
 * @description Allows the line to be processed and edited just before it is created
 * @param {object} line Line to process
 */
function preProcessLine(line) {
    var felem, telem;

    felem = data[findIndex(data, line.fromID)];
    telem = data[findIndex(data, line.toID)];

    //Sets the endIcon of the to-be-created line, if it an State entity
    if ((felem.type === 'SD') && (telem.type === 'SD')) {
        if (line.kind === 'Recursive') {
            line.endIcon = '';
        } else {
            line.endIcon = 'ARROW';
        }

        if (isClose(felem.cx, telem.cx, felem.cy, telem.cy, zoomfact)) {
            line.innerType = SDLineType.STRAIGHT;
        }
        else {
            line.innerType = SDLineType.SEGMENT;
        }
        
        
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

    var lengthConstant = 1; // Determines how "far inwards" on the element the line should have its origin and its end points.
    var lengthConstantSD_Y = 20;
    var x1Offset = 0;
    var x2Offset = 0;
    var y1Offset = 0;
    var y2Offset = 0;


    if (line.kind=="Dashed") {
        var strokeDash="10";
    }
    else{
        var strokeDash="0";
    }

    if (isDarkTheme()) {
        var lineColor = '#FFFFFF';
    } else {
        var lineColor = '#000000';
    }

    //ineColor = '#000000';

    if(contextLine.includes(line)){
        lineColor = selectedColor;
    }
    felem = data[findIndex(data, line.fromID)];

    // Telem should be our ghost if argument targetGhost is true. Otherwise look through data array.
    telem = targetGhost ? ghostElement : data[findIndex(data, line.toID)];

    // Draw each line - compute end coordinate from position in list compared to list count
    fx = felem.cx;
    fy = felem.cy;
    tx = telem.cx;
    ty = telem.cy;

    const elemsAreClose = isClose (
        (fx + x1Offset),
        (tx + x2Offset),
        (fy + y1Offset),
        (ty + y2Offset),
        zoomfact
    );

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

    // Set line end-point in center of UMLRelations.
    if(felem.kind == "UMLRelation"){
        fx = felem.cx;
        fy = felem.cy;
    } else if (telem.kind == "UMLRelation"){
        tx = telem.cx;
        ty = telem.cy;
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
        if (felem.type == 'SD' || telem.type == 'SD' || felem.type == 'IE' || telem.type == 'IE'){
            y1Offset = lengthConstantSD_Y;
            y2Offset = -lengthConstantSD_Y; 
        }else{
            y1Offset = lengthConstant;
            y2Offset = -lengthConstant; 
        }
    } else if ((fy < ty) && (line.ctype == "BT") ){
        if (felem.type == 'SD' || telem.type == 'SD' || felem.type == 'IE' || telem.type == 'IE'){
            y1Offset = -lengthConstantSD_Y;
            y2Offset = lengthConstantSD_Y; 
        }else{
            y1Offset = -lengthConstant;
            y2Offset = lengthConstant; 
        }
    }

    // Do not draw the lines longer for UMLRelations.
    if (felem.kind == "UMLRelation"){
        x1Offset = 0;
        y1Offset = 0;
    } else if(telem.kind == "UMLRelation"){
        x2Offset = 0;
        y2Offset = 0;
    }
    /* if (felem.type != 'ER' || telem.type != 'ER') {
        line.type = 'UML';
    } else {
        line.type = 'ER';
    } */
    //gives the lines the correct type based on the from and to element.
    if ((felem.type == 'SD') || (telem.type == 'SD')) {
        line.type = 'SD';
        if (targetGhost) {
            line.endIcon = "ARROW";
        }
    }
    else if ((felem.type == "IE") || (telem.type == 'IE')) {
        line.type = "IE"
    }
    else if ((felem.type == 'ER') || (telem.type == 'ER')) {
        line.type = 'ER';
    }
    else {
        line.type = 'UML';
    }

    // If element is UML, IE or SD (use straight line segments instead)
    if (felem.type != 'ER' || telem.type != 'ER') {

        var dx = ((fx + x1Offset)-(tx + x2Offset))/2;
        var dy = ((fy + y1Offset)-(ty + y2Offset))/2;

        if ((felem.type == 'SD' && elemsAreClose && line.innerType == null) || (felem.type == 'SD' && line.innerType === SDLineType.STRAIGHT)) {
            if (line.kind == "Recursive") {
                const length = 80 * zoomfact;
                const startX = fx - 10 * zoomfact;
                const startY = fy - 10 * zoomfact;
                const endX = fx - 25 * zoomfact;
                const endY = fy - 15 * zoomfact;
                const cornerX = fx + length;
                const cornerY = fy - length;

                
                str += `<line id='${line.id}' class='lineColor' x1='${startX + x1Offset - 17 * zoomfact}' y1='${startY + y1Offset}' x2='${cornerX + x1Offset}' y2='${cornerY + y1Offset}'/>`;
                str += `<line id='${line.id}' class='lineColor' x1='${startX + x1Offset}' y1='${startY + y1Offset}' x2='${cornerX + x1Offset}' y2='${startY + y1Offset}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
                str += `<line id='${line.id}' class='lineColor' x1='${cornerX + x1Offset}' y1='${startY + y1Offset}' x2='${cornerX + x1Offset}' y2='${cornerY + y1Offset}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
                str += `<line id='${line.id}' class='lineColor' x1='${cornerX + x1Offset}' y1='${cornerY + y1Offset}' x2='${endX + x1Offset}' y2='${cornerY + y1Offset}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
                str += `<line id='${line.id}' class='lineColor' x1='${endX + x1Offset}' y1='${cornerY + y1Offset}' x2='${endX + x1Offset}' y2='${endY + y1Offset - 40 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
                str += `<polygon id='${line.id}' class='diagram-umlicon-darkmode' points='${endX + x1Offset - 5 * zoomfact},${endY + y1Offset - 44 * zoomfact},${endX + x1Offset},${endY + y1Offset - 34 * zoomfact},${endX + x1Offset + 5 * zoomfact},${endY + y1Offset - 44 * zoomfact}' fill='${lineColor}'/>`;

            } else { 
                if ((fy > ty) && (line.ctype == "TB")) {
                    y1Offset = 1;
                    y2Offset = -7 + 3 / zoomfact;
                }
                else if ((fy < ty) && (line.ctype == "BT")) {
                    y1Offset = -7 + 3 / zoomfact;
                    y2Offset = 1;
                }
                str += `<line id='${line.id}' class='lineColor' x1='${fx + x1Offset * zoomfact}' y1='${fy + y1Offset * zoomfact}' x2='${tx + x2Offset * zoomfact}' y2='${ty + y2Offset * zoomfact}' fill='none' stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}'/>`;
            }
        }
        else if (line.ctype == 'TB' || line.ctype == 'BT') {
            str += `<polyline id='${line.id}' class='lineColor' points='${fx + x1Offset},${fy + y1Offset} ${fx + x1Offset},${fy + y1Offset - dy} ${tx + x2Offset},${ty + y2Offset + dy} ${tx + x2Offset},${ty + y2Offset}' `;
            str += `x1='${fx + x1Offset}' x2='${tx + x2Offset}' y1='${fy + y1Offset}' y2='${ty + y2Offset}' `
            str += `fill=none stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}'/>`;

        }
        else if (line.ctype == 'LR' || line.ctype == 'RL') {
            str += `<polyline id='${line.id}' class='lineColor' points='${fx + x1Offset},${fy + y1Offset} ${fx + x1Offset - dx},${fy + y1Offset} ${tx + x2Offset + dx},${ty + y2Offset} ${tx + x2Offset},${ty + y2Offset}' `;
            str += `x1='${fx + x1Offset}' x2='${tx + x2Offset}' y1='${fy + y1Offset}' y2='${ty + y2Offset}' `
            str += `fill = none stroke = '${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}' />`;
        }
        //Line creation when adding icons
        var iconSizeStart;
        var iconSizeEnd;

        switch (line.startIcon) {
            case IELineIcons.ZERO_ONE:
                if (line.ctype == 'TB') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx}' cy='${fy - 20 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy - 5 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx}' cy='${fy + 20 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy + 5 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy + 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx - 20 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 5 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx - 5 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx + 20 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx + 5 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx + 5 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=30;
                break;
            case IELineIcons.ONE:
                if (line.ctype == 'TB') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy - 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy + 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${fx - 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx - 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${fx + 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx + 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                break;
            case IELineIcons.FORCEDONE:
                if (line.ctype == 'TB') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy - 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy - 30 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy - 30 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy + 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy + 30 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy + 30 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx - 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 30 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx - 30 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx + 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx + 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx + 30 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx + 30 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=30;
                break;
            case IELineIcons.WEAK:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy - 25 * zoomfact},${fx + 10 * zoomfact} ${fy - 5 * zoomfact},${fx - 10 * zoomfact} ${fy - 5 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle cx='${fx}' cy='${fy - 30 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 5 * zoomfact},${fx} ${fy + 25 * zoomfact},${fx + 10 * zoomfact} ${fy + 5 * zoomfact},${fx - 10 * zoomfact} ${fy + 5 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle cx='${fx}' cy='${fy + 30 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 5 * zoomfact} ${fy - 10 * zoomfact},${fx - 25 * zoomfact} ${fy},${fx - 5 * zoomfact} ${fy + 10 * zoomfact},${fx - 5 * zoomfact} ${fy - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle cx='${fx - 30 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 5 * zoomfact} ${fy - 10 * zoomfact},${fx + 25 * zoomfact} ${fy},${fx + 5 * zoomfact} ${fy + 10 * zoomfact},${fx + 5 * zoomfact} ${fy - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle cx='${fx + 30 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=40;
                break;
            case IELineIcons.MANY:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 5 * zoomfact},${fx} ${fy - 15 * zoomfact},${fx + 10 * zoomfact} ${fy + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy + 15 * zoomfact},${fx + 10 * zoomfact} ${fy - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 5 * zoomfact} ${fy - 10 * zoomfact},${fx - 15 * zoomfact} ${fy},${fx + 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 5 * zoomfact} ${fy - 10 * zoomfact},${fx + 15 * zoomfact} ${fy},${fx - 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                    break;
            case IELineIcons.ZERO_MANY:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 5 * zoomfact},${fx} ${fy - 15 * zoomfact},${fx + 10 * zoomfact} ${fy + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx}' cy='${fy - 25 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy + 15 * zoomfact},${fx + 10 * zoomfact} ${fy - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx}' cy='${fy + 25 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 5 * zoomfact} ${fy - 10 * zoomfact},${fx - 15 * zoomfact} ${fy},${fx + 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx - 25 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 5 * zoomfact} ${fy - 10 * zoomfact},${fx + 15 * zoomfact} ${fy},${fx - 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${fx + 25 * zoomfact}' cy='${fy}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=30;
                break;
            case IELineIcons.ONE_MANY:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 5 * zoomfact},${fx} ${fy - 15 * zoomfact},${fx + 10 * zoomfact} ${fy + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy - 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy + 15 * zoomfact},${fx + 10 * zoomfact} ${fy - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 10 * zoomfact}' y1='${fy + 20 * zoomfact}' x2='${fx + 10 * zoomfact}' y2='${fy + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 5 * zoomfact} ${fy - 10 * zoomfact},${fx - 15 * zoomfact} ${fy},${fx + 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx - 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx - 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 5 * zoomfact} ${fy - 10 * zoomfact},${fx + 15 * zoomfact} ${fy},${fx - 5 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${fx + 20 * zoomfact}' y1='${fy - 10 * zoomfact}' x2='${fx + 20 * zoomfact}' y2='${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                break;
            case UMLLineIcons.ARROW:
                if (elemsAreClose) {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy - 20 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy - 20 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy + 20 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx - 20 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx + 20 * zoomfact} ${fy + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                break;
            case UMLLineIcons.TRIANGLE:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy + 1 * zoomfact},${fx + 10 * zoomfact} ${fy - 20 * zoomfact},${fx - 10 * zoomfact} ${fy - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${fx - 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy - 0.5 * zoomfact},${fx + 10 * zoomfact} ${fy + 20 * zoomfact},${fx - 10 * zoomfact} ${fy + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${fx - 20 * zoomfact} ${fy - 10 * zoomfact},${fx + 1 * zoomfact} ${fy},${fx - 20 * zoomfact} ${fy + 10 * zoomfact},${fx - 20 * zoomfact} ${fy - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${fx + 20 * zoomfact} ${fy - 10 * zoomfact},${fx - 0.5 * zoomfact} ${fy},${fx + 20 * zoomfact} ${fy + 10 * zoomfact},${fx + 20 * zoomfact} ${fy - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                break;
            case UMLLineIcons.BLACK_TRIANGLE:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-black-triangle' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy - 20 * zoomfact},${fx - 10 * zoomfact} ${fy - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-black-triangle' points='${fx - 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy + 20 * zoomfact},${fx - 10 * zoomfact} ${fy + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-black-triangle' points='${fx - 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx - 20 * zoomfact} ${fy + 10 * zoomfact},${fx - 20 * zoomfact} ${fy - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-black-triangle' points='${fx + 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx + 20 * zoomfact} ${fy + 10 * zoomfact},${fx + 20 * zoomfact} ${fy - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=20;
                break;
            case UMLLineIcons.WHITEDIAMOND:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy - 40 * zoomfact},${fx - 10 * zoomfact} ${fy - 20 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy + 40 * zoomfact},${fx - 10 * zoomfact} ${fy + 20 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx - 20 * zoomfact} ${fy + 10 * zoomfact},${fx - 40 * zoomfact} ${fy},${fx - 20 * zoomfact} ${fy - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx + 20 * zoomfact} ${fy + 10 * zoomfact},${fx + 40 * zoomfact} ${fy},${fx + 20 * zoomfact} ${fy - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=40;
                break;
            case UMLLineIcons.BLACKDIAMOND:
                if (line.ctype == 'TB') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy - 20 * zoomfact},${fx} ${fy - 40 * zoomfact},${fx - 10 * zoomfact} ${fy - 20 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'BT'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy + 20 * zoomfact},${fx} ${fy + 40 * zoomfact},${fx - 10 * zoomfact} ${fy + 20 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx - 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx - 20 * zoomfact} ${fy + 10 * zoomfact},${fx - 40 * zoomfact} ${fy},${fx - 20 * zoomfact} ${fy - 10 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${fx + 20 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy},${fx + 20 * zoomfact} ${fy + 10 * zoomfact},${fx + 40 * zoomfact} ${fy},${fx + 20 * zoomfact} ${fy - 10 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeStart=40;
                break;
            case SDLineIcons.ARROW:
                var iconSizeStart = 20;

                // If the line is straight calculate the points required to draw the arrow at an angle.
                if ((felem.type == 'SD' && elemsAreClose && line.innerType == null) || (felem.type == 'SD' && line.innerType === SDLineType.STRAIGHT)) {
                    let to = new Point(tx + x2Offset * zoomfact, ty + y2Offset * zoomfact);
                    let from = new Point(fx + x1Offset * zoomfact, fy + y1Offset * zoomfact);  

                    let base = calculateArrowBase(to, from, iconSizeStart / 2 * zoomfact);
                    let right = rotateArrowPoint(base, from, true);
                    let left = rotateArrowPoint(base, from, false);

                    str += `<polygon id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${right.x} ${right.y},${from.x} ${from.y},${left.x} ${left.y}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else {
                    if (line.ctype == 'TB') {
                        str += `<polyline id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${fx - 5 * zoomfact} ${fy - 10 * zoomfact},${fx} ${fy + zoomfact},${fx + 5 * zoomfact} ${fy - 10 * zoomfact},${fx - 5 * zoomfact} ${fy - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if (line.ctype == 'BT') {
                        str += `<polyline id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${fx - 5 * zoomfact} ${fy + 10 * zoomfact},${fx} ${fy - 5 * zoomfact},${fx + 5 * zoomfact} ${fy + 10 * zoomfact},${fx - 5 * zoomfact} ${fy + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if (line.ctype == 'LR') {
                        str += `<polyline id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${fx - 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy},${fx - 10 * zoomfact} ${fy + 5 * zoomfact},${fx - 10 * zoomfact} ${fy - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if (line.ctype == 'RL') {
                        str += `<polyline id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${fx + 10 * zoomfact} ${fy - 5 * zoomfact},${fx} ${fy},${fx + 10 * zoomfact} ${fy + 5 * zoomfact},${fx + 10 * zoomfact} ${fy - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                }
                iconSizeStart=40;
                break;
            default:
                iconSizeStart=0;
                break;
        }
        switch (line.endIcon) {
            case IELineIcons.ZERO_ONE:
                if (line.ctype == 'BT') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty - 20 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty - 5 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty + 20 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty + 5 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty + 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx - 20 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 5 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx - 5 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx + 20 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx + 5 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx + 5 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=30;
                break;
            case IELineIcons.ONE:
                if (line.ctype == 'BT') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty - 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty + 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${tx - 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx - 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<line id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' x1='${tx + 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx + 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case IELineIcons.FORCEDONE:
                if (line.ctype == 'BT') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty - 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty - 30 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty - 30 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty + 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty + 30 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty + 30 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx - 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 30 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx - 30 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx + 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx + 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx + 30 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx + 30 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=30;
                break;
            case IELineIcons.WEAK:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty - 25 * zoomfact},${tx + 10 * zoomfact} ${ty - 5 * zoomfact},${tx - 10 * zoomfact} ${ty - 5 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty - 30 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 5 * zoomfact},${tx} ${ty + 25 * zoomfact},${tx + 10 * zoomfact} ${ty + 5 * zoomfact},${tx - 10 * zoomfact} ${ty + 5 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty + 30 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 5 * zoomfact} ${ty - 10 * zoomfact},${tx - 25 * zoomfact} ${ty},${tx - 5 * zoomfact} ${ty + 10 * zoomfact},${tx - 5 * zoomfact} ${ty - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx - 30 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 5 * zoomfact} ${ty - 10 * zoomfact},${tx + 25 * zoomfact} ${ty},${tx + 5 * zoomfact} ${ty + 10 * zoomfact},${tx + 5 * zoomfact} ${ty - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx + 30 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=40;
                break;
            case IELineIcons.MANY:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 5 * zoomfact},${tx} ${ty - 15 * zoomfact},${tx + 10 * zoomfact} ${ty + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty + 15 * zoomfact},${tx + 10 * zoomfact} ${ty - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 5 * zoomfact} ${ty - 10 * zoomfact},${tx - 15 * zoomfact} ${ty},${tx + 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 5 * zoomfact} ${ty - 10 * zoomfact},${tx + 15 * zoomfact} ${ty},${tx - 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case IELineIcons.ZERO_MANY:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 5 * zoomfact},${tx} ${ty - 15 * zoomfact},${tx + 10 * zoomfact} ${ty + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty - 25 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty + 15 * zoomfact},${tx + 10 * zoomfact} ${ty - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx}' cy='${ty + 25 * zoomfact}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 5 * zoomfact} ${ty - 10 * zoomfact},${tx - 15 * zoomfact} ${ty},${tx + 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx - 25 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 5 * zoomfact} ${ty - 10 * zoomfact},${tx + 15 * zoomfact} ${ty},${tx - 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<circle class='diagram-umlicon-darkmode' cx='${tx + 25 * zoomfact}' cy='${ty}' r='10' fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=30;
                break;
            case IELineIcons.ONE_MANY:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 5 * zoomfact},${tx} ${ty - 15 * zoomfact},${tx + 10 * zoomfact} ${ty + 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty - 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty + 15 * zoomfact},${tx + 10 * zoomfact} ${ty - 5 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 10 * zoomfact}' y1='${ty + 20 * zoomfact}' x2='${tx + 10 * zoomfact}' y2='${ty + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 5 * zoomfact} ${ty - 10 * zoomfact},${tx - 15 * zoomfact} ${ty},${tx + 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx - 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx - 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 5 * zoomfact} ${ty - 10 * zoomfact},${tx + 15 * zoomfact} ${ty},${tx - 5 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    str += `<line class='diagram-umlicon-darkmode' x1='${tx + 20 * zoomfact}' y1='${ty - 10 * zoomfact}' x2='${tx + 20 * zoomfact}' y2='${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case UMLLineIcons.ARROW:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty - 20 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty + 20 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx - 20 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx + 20 * zoomfact} ${ty + 10 * zoomfact}' fill=none stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case UMLLineIcons.TRIANGLE:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${tx - 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty + 1 * zoomfact},${tx + 10 * zoomfact} ${ty - 20 * zoomfact},${tx - 10 * zoomfact} ${ty - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${tx - 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty - 0.5 * zoomfact},${tx + 10 * zoomfact} ${ty + 20 * zoomfact},${tx - 10 * zoomfact} ${ty + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${tx - 20 * zoomfact} ${ty - 10 * zoomfact},${tx + 1 * zoomfact} ${ty},${tx - 20 * zoomfact} ${ty + 10 * zoomfact},${tx - 20 * zoomfact} ${ty - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-triangle' points='${tx + 20 * zoomfact} ${ty - 10 * zoomfact},${tx - 0.5 * zoomfact} ${ty},${tx + 20 * zoomfact} ${ty + 10 * zoomfact},${tx + 20 * zoomfact} ${ty - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case UMLLineIcons.BLACK_TRIANGLE:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty - 20 * zoomfact},${tx - 10 * zoomfact} ${ty - 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty + 20 * zoomfact},${tx - 10 * zoomfact} ${ty + 20 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx - 20 * zoomfact} ${ty + 10 * zoomfact},${tx - 20 * zoomfact} ${ty - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx + 20 * zoomfact} ${ty + 10 * zoomfact},${tx + 20 * zoomfact} ${ty - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=20;
                break;
            case UMLLineIcons.WHITEDIAMOND:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty - 40 * zoomfact},${tx - 10 * zoomfact} ${ty - 20 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty + 40 * zoomfact},${tx - 10 * zoomfact} ${ty + 20 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx - 20 * zoomfact} ${ty + 10 * zoomfact},${tx - 40 * zoomfact} ${ty},${tx - 20 * zoomfact} ${ty - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx + 20 * zoomfact} ${ty + 10 * zoomfact},${tx + 40 * zoomfact} ${ty},${tx + 20 * zoomfact} ${ty - 10 * zoomfact}' fill='#ffffff' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=40;
                break;
            case UMLLineIcons.BLACKDIAMOND:
                if (line.ctype == 'BT') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty - 20 * zoomfact},${tx} ${ty - 40 * zoomfact},${tx - 10 * zoomfact} ${ty - 20 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if(line.ctype == 'TB'){
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty + 20 * zoomfact},${tx} ${ty + 40 * zoomfact},${tx - 10 * zoomfact} ${ty + 20 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'RL') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx - 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx - 20 * zoomfact} ${ty + 10 * zoomfact},${tx - 40 * zoomfact} ${ty},${tx - 20 * zoomfact} ${ty - 10 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                else if (line.ctype == 'LR') {
                    str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode' points='${tx + 20 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx + 20 * zoomfact} ${ty + 10 * zoomfact},${tx + 40 * zoomfact} ${ty},${tx + 20 * zoomfact} ${ty - 10 * zoomfact}' fill='#000000' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                iconSizeEnd=40;
                break;
            case SDLineIcons.ARROW:
                var iconSizeEnd = 20;

                // If the line is straight calculate the points required to draw the arrow at an angle.
                if ((felem.type == 'SD' && elemsAreClose && line.innerType == null) || (felem.type == 'SD' && line.innerType === SDLineType.STRAIGHT)) {
                    let to = new Point(tx + x2Offset * zoomfact, ty + y2Offset * zoomfact);
                    let from = new Point(fx + x1Offset * zoomfact, fy + y1Offset * zoomfact);  

                    let base = calculateArrowBase(from, to, iconSizeEnd / 2 * zoomfact);
                    let right = rotateArrowPoint(base, to, true);
                    let left = rotateArrowPoint(base, to, false);

                    str += `<polygon id='${line.id + "IconOne"}' class='diagram-umlicon-darkmode-sd' points='${right.x} ${right.y},${to.x} ${to.y},${left.x} ${left.y}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                }
                // If the line is segmented draw the arrow on a 90 degree angle matching the line.
                else {
                    if (line.ctype == 'BT') {
                        str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode-sd' points='${tx - 5 * zoomfact} ${ty - 10 * zoomfact},${tx} ${ty},${tx + 5 * zoomfact} ${ty - 10 * zoomfact},${tx - 5 * zoomfact} ${ty - 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if(line.ctype == 'TB'){
                        str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode-sd' points='${tx - 5 * zoomfact} ${ty + 10 * zoomfact},${tx} ${ty - 5 * zoomfact},${tx + 5 * zoomfact} ${ty + 10 * zoomfact},${tx - 5 * zoomfact} ${ty + 10 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if (line.ctype == 'RL') {
                        str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode-sd' points='${tx - 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty},${tx - 10 * zoomfact} ${ty + 5 * zoomfact},${tx - 10 * zoomfact} ${ty - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                    else if (line.ctype == 'LR') {
                        str += `<polyline id='${line.id+"IconOne"}' class='diagram-umlicon-darkmode-sd' points='${tx + 10 * zoomfact} ${ty - 5 * zoomfact},${tx} ${ty},${tx + 10 * zoomfact} ${ty + 5 * zoomfact},${tx + 10 * zoomfact} ${ty - 5 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
                    }
                }
                iconSizeEnd=20;
                break;
            default:
                iconSizeEnd=0;
                break;
        }
        if (line.startLabel && line.startLabel != '') {
            const offsetOnLine = 20 * zoomfact;
            var offset = Math.round(zoomfact * textheight / 2);
            var posX, posY, distance;

            var canvas = document.getElementById('canvasOverlay');
            var canvasContext = canvas.getContext('2d');
            var textWidth = canvasContext.measureText(line.startLabel).width;

            // Used to tweak the cardinality position when the line gets very short.
            var tweakOffset = 0.30;
            // Set the correct distance depending on the place where the line is connected
            if (line.ctype == 'TB' || line.ctype == 'BT') {
                distance = Math.abs(dy);
                //Set position on line for the given offset
                if (offsetOnLine > distance *0.5) {
                    posX = fx;
                    posY = fy - (offsetOnLine * (dy) / distance) * tweakOffset;
                } else {
                    posX = fx;
                    posY = fy - (offsetOnLine * (dy) / distance);
                }
            } else if (line.ctype == 'LR' || line.ctype == 'RL') {
                distance = Math.abs(dx);
                //Set position on line for the given offset
                if (offsetOnLine > distance *0.5) {
                    posX = fx - (offsetOnLine * (dx) / distance) * tweakOffset;
                    posY = fy;
                } else {
                    posX = fx - (offsetOnLine * (dx) / distance);
                    posY = fy;
                }
            }
            /*
            * Depending on the side of the element that the line is connected to
            * and the number of lines from that side, set the offset.
            */
            if (line.ctype == "TB") {
                if (felem.top.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
                posY -= iconSizeStart;
            }else if(line.ctype == "BT"){
                if (felem.bottom.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
                posY += iconSizeStart;
            }else if(line.ctype == "RL"){
                if (felem.right.indexOf(line.id) == 0) posY -= offset;
                else if (felem.right.indexOf(line.id) == felem.right.length - 1) posY += offset;
                posX += iconSizeStart;
            }else if (line.ctype == "LR") {
                if (felem.left.indexOf(line.id) == 0) posY -= offset;
                else if (felem.left.indexOf(line.id) == felem.left.length - 1) posY += offset;
                posX -= iconSizeStart;
            }
            str += `<rect class="text cardinalityLabel" id=${line.id + "startLabel"} x="${posX - (textWidth)/2}" y="${posY - (textheight * zoomfact + zoomfact * 3)/2}" width="${textWidth+2}" height="${(textheight-4) * zoomfact + zoomfact * 3}"/>`;
            str += `<text class="text cardinalityLabelText" dominant-baseline="middle" text-anchor="middle" style="fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;" x="${posX}" y="${posY}">${line.startLabel}</text>`;
        }
        if (line.endLabel && line.endLabel != '') {
            const offsetOnLine = 20 * zoomfact;
            var offset = Math.round(zoomfact * textheight / 2);
            var posX, posY, distance;

            var canvas = document.getElementById('canvasOverlay');
            var canvasContext = canvas.getContext('2d');
            var textWidth = canvasContext.measureText(line.endLabel).width;

            // Used to tweak the cardinality position when the line gets very short.
            var tweakOffset = 0.30;
            // Set the correct distance depending on the place where the line is connected
            if (line.ctype == 'TB' || line.ctype == 'BT') {
                distance = Math.abs(dy);
                //Set position on line for the given offset
                if (offsetOnLine > distance *0.5) {
                    posX = tx;
                    posY = ty + (offsetOnLine * (dy) / distance) * tweakOffset;
                } else {
                    posX = tx;
                    posY = ty + (offsetOnLine * (dy) / distance);
                }
            } else if (line.ctype == 'LR' || line.ctype == 'RL') {
                distance = Math.abs(dx);
                //Set position on line for the given offset
                if (offsetOnLine > distance *0.5) {
                    posX = tx + (offsetOnLine * (dx) / distance) * tweakOffset;
                    posY = ty;
                } else {
                    posX = tx + (offsetOnLine * (dx) / distance);
                    posY = ty;
                }
            }
            /*
            * Depending on the side of the element that the line is connected to
            * and the number of lines from that side, set the offset.
            */
            if (line.ctype == "TB") {
                if (telem.top.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
                posY += iconSizeEnd;
            }else if(line.ctype == "BT"){
                if (telem.bottom.indexOf(line.id) == 0) posX -= offset;
                else posX += offset;
                posY -= iconSizeEnd;
            }else if(line.ctype == "RL"){
                if (telem.right.indexOf(line.id) == 0) posY -= offset;
                else if (telem.right.indexOf(line.id) == telem.right.length - 1) posY += offset;
                posX -= iconSizeEnd;
            }else if (line.ctype == "LR") {
                if (telem.left.indexOf(line.id) == 0) posY -= offset;
                else if (telem.left.indexOf(line.id) == telem.left.length - 1) posY += offset;
                posX += iconSizeEnd;
            }
            str += `<rect class="text cardinalityLabel" id=${line.id + "endLabel"} x="${posX - (textWidth)/2}" y="${posY - (textheight * zoomfact + zoomfact * 3)/2}" width="${textWidth+2}" height="${(textheight-4) * zoomfact + zoomfact * 3}"/>`;
            str += `<text class="text cardinalityLabelText" dominant-baseline="middle" text-anchor="middle" style="fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;" x="${posX}" y="${posY}">${line.endLabel}</text>`;
        }
    }
    else {
        if (line.kind == "Normal"){
            str += `<line id='${line.id}' class='lineColor' x1='${fx + x1Offset}' y1='${fy + y1Offset}' x2='${tx + x2Offset}' y2='${ty + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
        } else if (line.kind == "Double") {
            // We mirror the line vector
            dy = -(tx - fx);
            dx = ty - fy;
            var len = Math.sqrt((dx * dx) + (dy * dy));
            dy = dy / len;
            dx = dx / len;
            var cstmOffSet = 1.4;
    
            str += `<line id='${line.id}-1' class='lineColor' x1='${fx + (dx * strokewidth * 1.5) - cstmOffSet + x1Offset}' y1='${fy + (dy * strokewidth * 1.5) - cstmOffSet + y1Offset}' x2='${tx + (dx * strokewidth * 1.5) + cstmOffSet + x2Offset}' y2='${ty + (dy * strokewidth * 1.5) + cstmOffSet + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
            str += `<line id='${line.id}-2' class='lineColor' x1='${fx - (dx * strokewidth * 1.5) - cstmOffSet + x1Offset}' y1='${fy - (dy * strokewidth * 1.5) - cstmOffSet + y1Offset}' x2='${tx - (dx * strokewidth * 1.5) + cstmOffSet + x2Offset}' y2='${ty - (dy * strokewidth * 1.5) + cstmOffSet + y2Offset}' stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
        }

        // If the line got cardinality
        if (line.cardinality) {
            const offsetOnLine = 20 * zoomfact;
            var offset = Math.round(zoomfact * textheight / 2);
            var posX, posY;
            var distance = Math.sqrt(Math.pow((tx - fx), 2) + Math.pow((ty - fy), 2));

            var canvas = document.getElementById('canvasOverlay');
            var canvasContext = canvas.getContext('2d');
            var textWidth = canvasContext.measureText(line.cardinality).width;

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
            // Add the line to the str 12.84 10.11
            str += `<rect class="text cardinalityLabel" id=${line.id + "Cardinality"} class='lineColor' x="${posX - (textWidth/4)/2}" y="${posY - (textheight * zoomfact + zoomfact * 3)/2}" width="${textWidth/4+2}" height="${(textheight-4) * zoomfact + zoomfact * 3}"/>`;
            str += `<text class="text cardinalityLabelText" dominant-baseline="middle" text-anchor="middle" style="font-size:${Math.round(zoomfact * textheight)}px;" x="${posX}" y="${posY}">${lineCardinalitys[line.cardinality]}</text>`;
        }
    }

    if (contextLine.includes(line)) {
        var x = (fx + tx) /2;
        var y = (fy + ty) /2;
        str += `<rect x="${x-(2 * zoomfact)}" y="${y-(2 * zoomfact)}" width='${4 * zoomfact}' height='${4 * zoomfact}' style="fill:${lineColor}" stroke="${lineColor}" stroke-width="3"/>`;
    }

    if (line.label && line.label != "" && line.type !== "IE"){
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
        var lineLabel={id: line.id+"Label",labelLineID: line.id, centerX: centerX, centerY: centerY, width: textWidth + zoomfact * 4, height: textheight * zoomfact + zoomfact * 3, labelMovedX: 0 * zoomfact, labelMovedY: 0 * zoomfact, lowY: lowY, highY: highY, lowX: lowX, highX: highX, percentOfLine: 0,displacementX:0,displacementY:0,fromX:fx,toX:tx,fromY:fy,toY:ty,lineGroup:0,labelMoved:false};
        if(!!targetLabel){
            var rememberTargetLabelID = targetLabel.id;
        }
        if(!!lineLabelList[findIndex(lineLabelList,lineLabel.id)]){
            lineLabel.labelMovedX = lineLabelList[findIndex(lineLabelList,lineLabel.id)].labelMovedX;
            lineLabel.labelMovedY = lineLabelList[findIndex(lineLabelList,lineLabel.id)].labelMovedY;
            lineLabel.labelGroup = lineLabelList[findIndex(lineLabelList,lineLabel.id)].labelGroup;
            lineLabel.labelMoved = lineLabelList[findIndex(lineLabelList,lineLabel.id)].labelMoved;
            calculateProcentualDistance(lineLabel);
            if (lineLabel.labelGroup == 0) {
                    lineLabel.displacementX = 0;
                    lineLabel.displacementY = 0;
            }
            else if (lineLabel.labelGroup == 1) {
                lineLabel.displacementX = calculateLabelDisplacement(lineLabel).storeX*zoomfact;
                lineLabel.displacementY = calculateLabelDisplacement(lineLabel).storeY*zoomfact;
            }
            else if (lineLabel.labelGroup == 2) {
                lineLabel.displacementX = -calculateLabelDisplacement(lineLabel).storeX*zoomfact;
                lineLabel.displacementY = -calculateLabelDisplacement(lineLabel).storeY*zoomfact;
            }
            lineLabelList[findIndex(lineLabelList,lineLabel.id)] = lineLabel;
        }
        else{
            lineLabelList.push(lineLabel);
        }
        if(!!rememberTargetLabelID){
            targetLabel=lineLabelList[findIndex(lineLabelList,rememberTargetLabelID)];
        }
        //Add background, position and size is determined by text and zoom factor <-- Consider replacing magic numbers
        str += `<rect class="text cardinalityLabel" id=${line.id + "Label"} x="${labelPosX+lineLabel.labelMovedX+lineLabel.displacementX}" y="${labelPosY+lineLabel.labelMovedY+lineLabel.displacementY}" width="${(textWidth + zoomfact * 4)}" height="${textheight * zoomfact + zoomfact * 3}"/>`;
        //Add label with styling based on selection.
        if (contextLine.includes(line)) {
            str += `<text class="cardinalityLabelText" dominant-baseline="middle" text-anchor="middle" style="fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;" x="${centerX - (2 * zoomfact) + lineLabel.labelMovedX + lineLabel.displacementX}" y="${centerY - (2 * zoomfact) + lineLabel.labelMovedY + lineLabel.displacementY}">${line.label}</text>`;
        }
        else {
            str += `<text class="cardinalityLabelText" dominant-baseline="middle" text-anchor="middle"; style="font-size:${Math.round(zoomfact * textheight)}px;" x="${centerX - (2 * zoomfact) + lineLabel.labelMovedX + lineLabel.displacementX}" y="${centerY - (2 * zoomfact) + lineLabel.labelMovedY + lineLabel.displacementY}">${line.label}</text>`;
        }
    }

    return str;
}
/**
 * @description Calculates the coordinates of the point representing the base of the arrow, the point is @param size distance away and on the line between @param from and @param to .
 * @param {Point} from The coordinates/Point where the line between two elements start.
 * @param {Point} to The coordinates/Point where the line between two elements end.
 * @param {number} size The size(height) of the arrow that is to be drawn.
 * @returns The coordinates/Point where the arrow base is placed on the line.
 */
function calculateArrowBase(from, to, size)
{
    /*
        Since we know that the arrow is to be created on the line, we need a Point that is a set distance away from the element that is still on the line.
        The set distance is the size, as it will be the height of the arrow.
        Given two points we can find the distance of the line between them by calculating the hypotenuse.
        Since we know the hypotenuse of the "small" triangle and all the lengths of the "large" triangle, we can calculate the cordinates of the "small" triangle since the triangles are "similar".
        We start by calculating a ratio on the hypotenuse by taking the "small" hypotenuse divided by the "large" hypotenuse.
        Then we apply this ratio on the other sides of the large triangle to get the distance in x and in y for the small triangle
        Then we add these values to the end point to get the actual coordinates for the arrow base.
    */

    let ratio = size / Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
    let x = to.x + (from.x - to.x) * ratio;
    let y = to.y + (from.y - to.y) * ratio;
    return new Point(x, y);
}
/**
 * @description Calculates the coordiates of the point representing one of the arrows corners
 * @param {Point} base The coordinates/Point where the arrow base is placed on the line, this Point is the pivot that the corners are "rotated" around.
 * @param {Point} to The coordinates/Point where the line between @param base and the element end
 * @param {boolean} clockwise Should the rotation be clockwise (true) or counter-clockwise (false).
 */
function rotateArrowPoint(base, to, clockwise)
{
    /*
        To create the actual arrow we need the corners.
        We need to rotate the point "to" around "base" by 90 or -90 degrees and divide the distance by 2 (as this decides how wide the triangle will be).
        The rotation is done by applying the vector rotation math that states: 
        Point(x,y) rotated 90 degrees clockwise = Point(y, -1 * x) or,
        Point(x,y) rotated 90 degrees counter-clockwise = Point(-1 * y, x).
        The "rotated" value can then be added to the base to get a corner.
    */
    if (clockwise) {
        let point = new Point((to.y - base.y) / 2, -1 * (to.x - base.x) / 2);
        point.add(base);
        return point;
    }
    else {
        let point = new Point(-1 * (to.y - base.y) / 2, (to.x - base.x) / 2);
        point.add(base);
        return point;
    }
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
    //some sequence objects get a new node, for vertical resizing. This could probably be set for all elements if desired, but I have not tried that.
    if ((element.kind == "sequenceActorAndObject") || (element.kind == "sequenceLoopOrAlt")) {
        nodes += "<span id='md' class='node md'></span>";
    }

    if (element.kind == "UMLSuperState") {
        nodes += "<span id='md' class='node md'></span>";
        nodes += "<span id='mu' class='node mu'></span>";
    }
    elementDiv.innerHTML += nodes;
    // This is the standard node size
    const defaultNodeSize = 8;
    var nodeSize = defaultNodeSize*zoomfact;
    if ((element.kind == "sequenceActorAndObject") || (element.kind == "sequenceLoopOrAlt")) {
        var mdNode = document.getElementById("md");
        mdNode.style.width = nodeSize+"px";
        mdNode.style.width = nodeSize+"px";
        mdNode.style.height = nodeSize+"px";
        mdNode.style.height = nodeSize+"px";
        mdNode.style.left = "calc(50% - "+(nodeSize/4)+"px)";
        mdNode.style.top = "100%";
    }

    if (element.kind == "UMLSuperState"){
        var mdNode = document.getElementById("md");
        var muNode = document.getElementById("mu");
        mdNode.style.width = nodeSize+"px";
        muNode.style.width = nodeSize+"px";
        mdNode.style.height = nodeSize+"px";
        muNode.style.height = nodeSize+"px";
        mdNode.style.right = "calc(50% - "+(nodeSize/2)+"px)";
        muNode.style.right = "calc(50% - "+(nodeSize/2)+"px)";
    }
    
    if (element.kind == "")
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
            barY += "<line class='ruler-line' x1='0px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"'/>";
            barY += "<text class='ruler-text' x='10' y='"+(pannedY+i+10)+"'style='font-size: 10px''>"+cordY+"</text>";
            cordY = cordY +10;
        }else if(zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
            //centi
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barY += "<text class='ruler-text' x='20' y='"+(pannedY+i+10)+"'style='font-size: 8px''>"+(cordY-10+lineNumber/10)+"</text>";
                barY += "<line class='ruler-line' x1='20px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"'/>";
            }else{
                barY += "<line class='ruler-line' x1='25px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"'/>";
            }
        }else if (zoomfact > 0.75){
            //milli
            if ((lineNumber) % 5 == 0 ){
                barY += "<line class='ruler-line' x1='32px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"'/>";
            }else{
                barY += "<line class='ruler-line' x1='35px' y1='"+(pannedY+i)+"' x2='40px' y2='"+(pannedY+i)+"' />";
            }
        } 
    }

    //Draw the Y-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordY = -10;
    for (i = -100 - settings.ruler.zoomY; i <= pannedY; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
         
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barY += "<line class='ruler-line' x1='0px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' />";
            barY += "<text class='ruler-text' x='10' y='"+(pannedY-i+10)+"' style='font-size: 10px''>"+cordY+"</text>";
            cordY = cordY -10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            if ((zoomfact > 0.5 || (lineNumber/10) % 5 == 0)  && (cordY+10-lineNumber/10) != 0){
                barY += "<text class='ruler-text' x='20' y='"+(pannedY-i+10)+"' style='font-size: 8px''>"+(cordY+10-lineNumber/10)+"</text>";
                barY += "<line class='ruler-line' x1='20px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' />";
            }else{
                barY += "<line class='ruler-line' x1='25px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"' />";
            }
        }else if (zoomfact > 0.75){
            //milli
            if ((lineNumber) % 5 == 0 ){
                barY += "<line class='ruler-line' x1='32px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"'/>";
            }else{
                barY += "<line class='ruler-line' x1='35px' y1='"+(pannedY-i)+"' x2='40px' y2='"+(pannedY-i)+"'/>";
            }

        }
    }
    svgY.style.boxShadow ="3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis
    
    //Draw the X-axis ruler positive side.
    lineNumber = (lineRatio3 - 1);
    for (i = 51 + settings.ruler.zoomX; i <= pannedX - (pannedX *2) + cwidth; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barX += "<line class='ruler-line' x1='" +(i+pannedX)+"' y1='0' x2='" + (i+pannedX) + "' y2='40px'/>";
            barX += "<text class='ruler-text' x='"+(i+5+pannedX)+"'"+verticalText+"' y='15' style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX +10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            if (zoomfact > 0.5 || (lineNumber/10) % 5 == 0){
                barX += "<text class='ruler-text' x='"+(i+5+pannedX)+"'"+verticalText+"' y='25' style='font-size: 8px'>"+(cordX-10+lineNumber/10)+"</text>";
                barX += "<line class='ruler-line' x1='" +(i+pannedX)+"' y1='20' x2='" +(i+pannedX)+"' y2='40px'/>";
            }else{
                barX += "<line class='ruler-line' x1='" +(i+pannedX)+"' y1='25' x2='" +(i+pannedX)+"' y2='40px'/>";
            }
        }else if (zoomfact > 0.75){
            //milli
            if ((lineNumber) % 5 == 0 ){
                barX += "<line class='ruler-line' x1='" +(i+pannedX)+"' y1='32' x2='" +(i+pannedX)+"' y2='40px'/>";
            }else{
                barX += "<line class='ruler-line' x1='" +(i+pannedX)+"' y1='35' x2='" +(i+pannedX)+"' y2='40px'/>";
            }

        }
    }

    //Draw the X-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordX = -10;
    for (i = -51 - settings.ruler.zoomX; i <= pannedX; i += (lineRatio1*zoomfact*pxlength)) {
        lineNumber++;
        
        //Check if a full line should be drawn
        if (lineNumber === lineRatio3) {
            lineNumber = 0;
            barX += "<line class='ruler-line' x1='" +(pannedX-i)+"' y1='0' x2='" + (pannedX-i) + "' y2='40px'/>";
            barX += "<text class='ruler-text' x='"+(pannedX-i+5)+"'"+verticalText+"' y='15'style='font-size: 10px'>"+cordX+"</text>";
            cordX = cordX -10;
        }else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0){
            //centi
            if ((zoomfact > 0.5 || (lineNumber/10) % 5 == 0) &&(cordX+10-lineNumber/10) != 0){
                barX += "<text class='ruler-text' x='"+(pannedX-i+5)+"'"+verticalText+"' y='25'style='font-size: 8px'>"+(cordX+10-lineNumber/10)+"</text>";
                barX += "<line class='ruler-line' x1='" +(pannedX-i)+"' y1='20' x2='" +(pannedX-i)+"' y2='40px'/>";
            }else{
                barX += "<line class='ruler-line' x1='" +(pannedX-i)+"' y1='25' x2='" +(pannedX-i)+"' y2='40px'/>";
            }
        }else if (zoomfact > 0.75){
            //milli
            if ((lineNumber) % 5 == 0 ){
                barX += "<line class='ruler-line' x1='" +(pannedX-i)+"' y1='32' x2='" +(pannedX-i)+"' y2='40px'/>";
            }else{
                barX += "<line class='ruler-line' x1='" +(pannedX-i)+"' y1='35' x2='" +(pannedX-i)+"' y2='40px'/>";
            }
        }
    }
    svgX.style.boxShadow ="3px 3px 6px #5c5a5a";
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
    let ghostPreview = ghostLine ? 0 : 0.4;
    var str = "";

    // Compute size variables
    var linew = Math.round(strokewidth * zoomfact);
    var boxw = Math.round(element.width * zoomfact);
    var boxh = Math.round(element.height * zoomfact);
    var texth = Math.round(zoomfact * textheight);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var hboxh = Math.round(element.height * zoomfact * 0.5);
    var cornerRadius = Math.round((element.height/2) * zoomfact); //determines the corner radius for the SD states.
    var sequenceCornerRadius = Math.round((element.width/15) * zoomfact); //determines the corner radius for sequence objects.
    var elemAttri = 3;//element.attributes.length;          //<-- UML functionality This is hardcoded will be calcualted in issue regarding options panel
                                //This value represents the amount of attributes, hopefully this will be calculated through
                                //an array in the UML document that contains the element's attributes.
    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext('2d');
    
    //since toggleBorderOfElements checks the fill color to make sure we dont end up with white stroke on white fill, which is bad for IE and UML etc,
    //we have to have another variable for those strokes that are irrlevant of the elements fill, like sequence actor or state superstate.
    var nonFilledElementPartStrokeColor;
    if (isDarkTheme()) nonFilledElementPartStrokeColor = '#FFFFFF';
    else nonFilledElementPartStrokeColor = '#383737';

    //this is a silly way of changing the color for the text for actor, I couldnt think of a better one though. Currently it is also used for sequenceLoopOrAlt
    //replace this with nonFilledElementPartStroke when it gets merged.
    var actorFontColor;
    if (isDarkTheme()) actorFontColor = '#FFFFFF';
    else actorFontColor = '#383737';

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

    if (errorActive) {
        // Checking for errors regarding ER Entities
        checkElementError(element);

        // Checks if element is involved with an error and outlines them in red
        for (var i = 0; i < errorData.length; i++) {
            if (element.id == errorData[i].id) element.stroke = 'red';
        }
    }

    //=============================================== <-- UML functionality
    //Check if the element is a UML entity
    if (element.kind == "UMLEntity") { 
        const maxCharactersPerLine = Math.floor((boxw / texth)*1.75);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        const funcText = element.functions.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;
        elemFunc = funcText.length;

        // Removes the previouse value in UMLHeight for the element
        for (var i = 0; i < UMLHeight.length; i++) {
            if (element.id == UMLHeight[i].id) {
                UMLHeight.splice(i, 1);
            }
        }

        // Calculate and store the UMLEntity's real height
        var UMLEntityHeight = {
            id : element.id,
            height : ((boxh + (boxh/2 + (boxh * elemAttri/2)) + (boxh/2 + (boxh * elemFunc/2))) / zoomfact)
        }
        UMLHeight.push(UMLEntityHeight);
        
        //div to encapuslate UML element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.5))}px; width:${boxw}px;font-size:${texth}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //div to encapuslate UML header
        str += `<div class='uml-header' style='width: ${boxw}; height: ${boxh};'>`; 
        //svg for UML header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
        <text class='text' x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for UML header
        str += `</svg>`;
        //end of div for UML header
        str += `</div>`;
        
        //div to encapuslate UML content
        str += `<div class='uml-content' style='margin-top: -0.5em;'>`;
        //Draw UML-content if there exist at least one attribute
        if (elemAttri != 0) {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemAttri/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemAttri/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text class='text' x='0.5em' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw UML-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for UML content
        str += `</div>`;

        //Draw UML-footer if there exist at least one function
        if (elemFunc != 0) {
            //div for UML footer
            str += `<div class='uml-footer' style='margin-top: -0.5em; height: ${boxh/2 + (boxh * elemFunc/2)}px;'>`;
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemFunc/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemFunc/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemFunc; i++) {
                str += `<text class='text' x='0.5em' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${funcText[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw UML-footer if there are no functions
        } else {
            //div for UML footer
            str += `<div class='uml-footer' style='margin-top: -0.5em; height: ${boxh / 2 + (boxh / 2)}px;'>`;
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for UML footer
        str += `</div>`;

    }
    else if (element.kind == 'UMLInitialState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        const theme = document.getElementById("themeBlack");
        str += `<div id="${element.id}" 
                     class="element uml-state"
                     style="margin-top:${((boxh / 2.5))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}" 
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                        <svg width="100%" height="100%" 
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg" 
                             xml:space="preserve"
                             style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                            <g  transform="matrix(1.14286,0,0,1.14286,-6.85714,-2.28571)">
                                <circle cx="16.5" cy="12.5" r="10.5"/>
                            </g>
                        </svg>
                </div>`;
                if(element.fill == `${"#000000"}` && theme.href.includes('blackTheme')){
                    element.fill = `${"#FFFFFF"}`;
                }else if(element.fill == `${"#FFFFFF"}` && theme.href.includes('style')) {
                    element.fill = `${"#000000"}`;
                }

    }
    else if (element.kind == 'UMLFinalState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        const theme = document.getElementById("themeBlack");
        str += `<div id="${element.id}" 
                     class="element uml-state"
                     style="margin-top:${((boxh / 2.5))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}"
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                        <svg width="100%" height="100%"
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg"
                             xml:space="preserve"
                             style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                            <g>
                                <path d="M12,-0C18.623,-0 24,5.377 24,12C24,18.623 18.623,24 12,24C5.377,24 -0,18.623 -0,12C-0,5.377 5.377,-0 12,-0ZM12,2C17.519,2 22,6.481 22,12C22,17.519 17.519,22 12,22C6.481,22 2,17.519 2,12C2,6.481 6.481,2 12,2Z"/>
                                <circle transform="matrix(1.06667,0,0,1.06667,-3.46667,-3.46667)" cx="14.5" cy="14.5" r="5.5"/>
                            </g>
                        </svg>
                </div>`;
                if(element.fill == `${"#000000"}` && theme.href.includes('blackTheme')){
                    element.fill = `${"#FFFFFF"}`;
                }else if(element.fill == `${"#FFFFFF"}` && theme.href.includes('style')) {
                    element.fill = `${"#000000"}`;
                }

    }
    else if (element.kind == 'UMLSuperState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        str += `<div id="${element.id}" 
                    class="element uml-Super"
                    style="margin-top:${((boxh * 0.025))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}"
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                    <svg width="100%" height="100%">
                    <rect width="${boxw}px" height="${boxh}px" fill="none" fill-opacity="0" stroke='${nonFilledElementPartStrokeColor}' stroke-width='${linew}' rx="20"/>
                    <rect width="${boxw/2}px" height="${80 * zoomfact}px" fill='${element.fill}' fill-opacity="1" stroke='${element.stroke}' stroke-width='${linew}' />
                        <text x='${80 * zoomfact}px' y='${40 * zoomfact}px' dominant-baseline='middle' text-anchor='${vAlignment}' font-size="${20 * zoomfact}px">${element.name}</text>
                    </svg>
                </div>`;

    }

    // Check if element is SDEntity
    else if (element.kind == "SDEntity") {

        const maxCharactersPerLine = Math.floor(boxw / texth);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;

        // Removes the previouse value in SDHeight for the element
        for (var i = 0; i < SDHeight.length; i++) {
            if (element.id == SDHeight[i].id) {
                SDHeight.splice(i, 1);
            }
        }

        // Calculate and store the SDEntity's real height
        var SDEntityHeight = {
            id: element.id,
            height: ((boxh + (boxh / 2 + (boxh * elemAttri / 2))) / zoomfact)
        }
        SDHeight.push(SDEntityHeight);

        //div to encapuslate SD element
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.15))}px; width:${boxw}px;font-size:${texth}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //div to encapuslate SD header
        str += `<div style='width: ${boxw}; height: ${boxh};'>`;
        //svg for SD header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<path class="text" 
            d="M${linew+cornerRadius},${(linew)}
                h${(boxw - (linew * 2))-(cornerRadius*2)}
                a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius}
                v${((boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius)}
                h${(boxw - (linew * 2))*-1}
                v${((boxh / 2 + (boxh / 2) - (linew * 2))-(cornerRadius))*-1}
                a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${(cornerRadius)*-1}
                z
            "
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill}'
        />
        
        <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for SD header
        str += `</svg>`;
        //end of div for SD header
        str += `</div>`;

        //div to encapuslate SD content
        str += `<div style='margin-top: ${-8 * zoomfact}px;'>`;
        //Draw SD-content if there exist at least one attribute
        if (elemAttri != 0) {
           /* find me let sdOption = document.getElementById("SDOption");
            console.log(sdOption); */
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh * elemAttri / 2)}'>`;
            str += `<path class="text"
                d="M${linew},${(linew)}
                    h${(boxw - (linew * 2))}
                    v${(boxh / 2 + (boxh * elemAttri / 2) - (linew * 2))-cornerRadius}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius*-1)},${cornerRadius}
                    h${(boxw - (linew * 2)-(cornerRadius*2))*-1}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius)*-1},${(cornerRadius)*-1}
                    v${((boxh / 2 + (boxh * elemAttri / 2) - (linew * 2))-cornerRadius)*-1}
                    z
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text x='${xAnchor}' y='${hboxh + boxh * i / 2}' dominant-baseline='middle' text-anchor='${vAlignment}'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
            // Draw SD-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<path class="text"
                d="M${linew},${(linew)}
                    h${(boxw - (linew * 2))}
                    v${(boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius*-1)},${cornerRadius}
                    h${(boxw - (linew * 2)-(cornerRadius*2))*-1}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius)*-1},${(cornerRadius)*-1}
                    v${((boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius)*-1}
                    z
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;
            str += `<text x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'>Do: </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for SD content
        str += `</div>`;
    }

    //Check if element is UMLRelation
    else if (element.kind == 'UMLRelation') {
        //div to encapuslate UML element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave();'
        style='left:0px; top:0px; width:${boxw}px;height:${boxh}px; margin-top:${((boxh /3))}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //svg for inheritance symbol
        str += `<svg width='${boxw}' height='${boxh}'>`;

        //Overlapping UML-inheritance
        if (element.state == 'overlapping') {
            str += `<polygon points='${linew},${boxh-linew} ${boxw/2},${linew} ${boxw-linew},${boxh-linew}' 
            style='fill:black;stroke:black;stroke-width:${linew};'/>`;
        }
        //Disjoint UML-inheritance
        else {
            str += `<polygon points='${linew},${boxh-linew} ${boxw/2},${linew} ${boxw-linew},${boxh-linew}' 
            style='fill:white;stroke:black;stroke-width:${linew};'/>`;
        }
        //end of svg
        str += `</svg>`;
    }

    //=============================================== <-- IE functionality
    //Check if the element is a IE entity
    else if (element.kind == "IEEntity") { 
        const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;

        // Removes the previouse value in IEHeight for the element
        for (var i = 0; i < IEHeight.length; i++) {
            if (element.id == IEHeight[i].id) {
                IEHeight.splice(i, 1);
            }
        }

        // Calculate and store the IEEntity's real height
        var IEEntityHeight = {
            id: element.id,
            height: ((boxh + (boxh / 2 + (boxh * elemAttri / 2))) / zoomfact)
        }
        IEHeight.push(IEEntityHeight);

        //div to encapuslate IE element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.15))}px; width:${boxw}px;font-size:${texth}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

         //div to encapuslate IE header
        str += `<div class='uml-header' style='width: ${boxw}; height: ${boxh};'>`; 
        //svg for IE header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
        <text class='text' x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for IE header
        str += `</svg>`;
        //end of div for IE header
        str += `</div>`;
        
        //div to encapuslate IE content
        str += `<div class='uml-content' style='margin-top: ${-8 * zoomfact}px;'>`;
        //Draw IE-content if there exist at least one attribute
        if (elemAttri != 0) {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemAttri/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemAttri/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text class='text' x='5' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw IE-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for IE content
        str += `</div>`;
    }
    
    //IE inheritance
    else if (element.kind == 'IERelation') {
        //div to encapuslate IE element
        str += `<div id='${element.id}'	class='element ie-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave();'
        style='left:0px; top:0px; margin-top:${((boxh/1.5))}px; width:${boxw}px;height:${boxh/2}px;`;
       
        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
      
        //svg for inheritance symbol
        str += `<svg width='${boxw}' height='${boxh/2}' style='transform:rotate(180deg);   stroke-width:${linew};'>`;

        // Overlapping IE-inheritance
        
        if (element.state == 'overlapping') {
                str+= `<circle cx="${(boxw/2)}" cy="0" r="${(boxw/2.08)}" fill="white"; stroke="black";'/> 
                <line x1="0" y1="${boxw/50}" x2="${boxw}" y2="${boxw/50}" stroke="black"; />`
        }
        // Disjoint IE-inheritance
        else {
            str+= `<circle cx="${(boxw/2)}" cy="0" r="${(boxw/2.08)}" fill="white"; stroke="black";'/>
                <line x1="0" y1="${boxw/50}" x2="${boxw}" y2="${boxw/50}" stroke="black"; />
                <line x1="${boxw/1.6}" y1="${boxw/2.9}" x2="${boxw/2.6}" y2="${boxw/12.7}" stroke="black" />
                <line x1="${boxw/2.6}" y1="${boxw/2.87}" x2="${boxw/1.6}" y2="${boxw/12.7}" stroke="black" />`
        }
        //end of svg
        str += `</svg>`;
        
    }
    
    //=============================================== <-- End of IE functionality
    //=============================================== <-- Start Sequnece functionality
    //sequence actor and its life line and also the object since they can be switched via options pane.
    else if (element.kind == 'sequenceActorAndObject') {
        //div to encapsulate sequence lifeline.
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;width:${boxw}px;height:${boxh}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}'>`;
        //svg for the life line
        str += `<path class="text" 
        d="M${(boxw/2)+linew},${(boxw/4)+linew}
        V${boxh}
        "
        stroke-width='${linew}'
        stroke='${element.stroke}'
        stroke-dasharray='${linew*3},${linew*3}'
        fill='transparent'
        />`;
        //actor or object is determined via the buttons in the context menu. the default is actor.
        if (element.actorOrObject == "actor") {
            //svg for actor.
            str += `<g>`
            str += `<circle cx="${(boxw/2)+linew}" cy="${(boxw/8)+linew}" r="${boxw/8}px" fill='${element.fill}' stroke='${element.stroke}' stroke-width='${linew}'/>`;
            str += `<path class="text"
                d="M${(boxw/2)+linew},${(boxw/4)+linew}
                    v${boxw/6}
                    m-${(boxw/4)},0
                    h${boxw/2}
                    m-${(boxw/4)},0
                    v${boxw/3}
                    l${boxw/4},${boxw/4}
                    m${(boxw/4)*-1},${(boxw/4)*-1}
                    l${(boxw/4)*-1},${boxw/4}
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='transparent'
            />`;
            str += `<text class='text' x='${xAnchor}' y='${boxw}' dominant-baseline='middle' text-anchor='${vAlignment}' fill='${nonFilledElementPartStrokeColor}'>${element.name}</text>`;
            str += `</g>`;
        }
        else if (element.actorOrObject == "object") {
            //svg for object.
            str += `<g>`;
            str += `<rect class='text'
                x='${linew}'
                y='${linew}'
                width='${boxw - (linew * 2)}'
                height='${(boxw/2) - linew}'
                rx='${sequenceCornerRadius}'
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}' 
            />`;
            str += `<text class='text' x='${xAnchor}' y='${((boxw/2) - linew)/2}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
            str += `</g>`;   
        }
        str += `</svg>`;  
    }
    // Sequence activation 
    else if (element.kind == 'sequenceActivation') {
        //div to encapsulate sequence lifeline.
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;width:${boxw}px;height:${boxh}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}'>`;
        //svg for the activation rect
        str += `<rect rx="12" style="height: 100%; width: 100%; fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />`;
        str += `</svg>`;  
    }
    // Sequence loop or alt
    else if (element.kind == 'sequenceLoopOrAlt') {
        //first, set a suggested height for the element based on the amount of alternatives
        if (element.alternatives != null) {
            //increase length of element to avoid squished alternatives
            for (let i = 0; i < element.alternatives.length; i++) {
                boxh += 125*zoomfact;
            }
            //also set alt or loop to whatever is correct
            //if it has more than one alternative its an alt, else its loop.
            element.alternatives.length > 1 ? element.altOrLoop = "Alt" : element.altOrLoop = "Loop";
        }

        //div to encapsulate sequence loop 
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;width:${boxw}px;height:${boxh}px;font-size:${texth}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}'>`;
        //svg for the loop/alt rectangle
        str += `<rect class='text'
            x='${linew}'
            y='${linew}'
            width='${boxw-(linew*2)}'
            height='${boxh-(linew*2)}'
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='none'
            rx='${7*zoomfact}'
            fill-opacity="0"
        />`;
        //if it has alternatives, iterate and draw them out one by one, evenly spaced out.
        if ((element.alternatives != null) && (element.alternatives.length > 0)) {
            for (let i = 1; i < element.alternatives.length; i++) {
                str += `<path class="text"
                d="M${boxw-linew},${(boxh/element.alternatives.length)*i}
                    H${linew}
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                stroke-dasharray='${linew*3},${linew*3}'
                fill='transparent'
                />`;
                //text for each alternative
                str += `<text x='${linew*2}' y='${((boxh/element.alternatives.length)*i)+(texth/1.5)+linew*2}' fill='${actorFontColor}'>${element.alternatives[i]}</text>`;
            }
        }
        //svg for the small label in top left corner
        str += `<path 
            d="M${(7*zoomfact)+linew},${linew}
                h${100*zoomfact}
                v${25*zoomfact}
                l${-12.5*zoomfact},${12.5*zoomfact}
                H${linew}
                V${linew+(7*zoomfact)}
                a${7*zoomfact},${7*zoomfact} 0 0 1 ${7*zoomfact},${(7*zoomfact)*-1}
                z
            "
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill}'
        />`;
        //text in the label
        str += `<text x='${50*zoomfact+linew}' y='${18.75*zoomfact+linew}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.altOrLoop}</text>`;
        //text below the label
        //TODO when actorFontColor is replaced with nonFilledElementPartStroke, change this to that.
        str += `<text x='${linew*2}' y='${37.5*zoomfact+(linew*3)+(texth/1.5)}' fill='${actorFontColor}'>${element.alternatives[0]}</text>`;
        str += `</svg>`;
    }
    //=============================================== <-- End of Sequnece functionality
    //=============================================== <-- Start ER functionality
    //ER element
    else {
        // Create div & svg element
        if (element.kind == "EREntity") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        else if (element.kind == "ERAttr") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        else if (element.kind == "ERRelation") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2.75))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `
                pointer-events: none;
                opacity: ${ghostPreview};
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
            
            str += `<rect  class="text" x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
                    ${weak}
                    <text  class="text" x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text> 
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
                        stroke='${element.stroke}' fill='${element.fill}' ${dash} stroke-width='${linew}' class="text" />
                        
                        ${multi}
                        <text x='${xAnchor}' y='${hboxh}' `;
            
            if(element.state == "candidate" || element.state == 'primary') {
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
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' class="text"/>
                    `;
                xAnchor += linew * multioffs;
            }
            str += `<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' class="text"/>
                    ${weak}`;
            str += `<text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name.slice(0, numOfLetters)}</text>`;

        }
        str += "</svg>";
    }
    //=============================================== <-- End ER functionality
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
    //str = selectionAllIndividualElements(str);
    if (mouseButtonDown == false) str = drawSelectionBox(str);
    
    document.getElementById("svgoverlay").innerHTML=str;

    // Updates nodes for resizing
    removeNodes();
    if (context.length === 1 && mouseMode == mouseModes.POINTER && (context[0].kind != "ERRelation" && context[0].kind != "UMLRelation"  && context[0].kind != "IERelation")) addNodes(context[0]);
    

}

/**
 * @description Error checking for lines
 * @param {Object} element Element to be checked for errors.
 */
function checkLineErrors(lines) {
    var line;

    // Error checking for lines
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        var fElement = data[findIndex(data, line.fromID)];
        var tElement = data[findIndex(data, line.toID)];

        //Checking for cardinality
        if ((fElement.kind == "EREntity" && tElement.kind == "ERRelation") || (tElement.kind == "EREntity" && fElement.kind == "ERRelation")) {
            if (line.cardinality != "ONE" && line.cardinality != "MANY") {
                errorData.push(fElement);
                errorData.push(tElement);
            }
        }
    }
}

/**
 * @description Error checking for ER entity
 * @param {Object} element Element to be checked for errors.
 */
function checkEREntityErrors(element) {
    var keyQuantity;
    var primaryCount;
    var strongEntity;
    var weakrelation;

    // Checks for entities with the same name
    for (var i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id) {
            errorData.push(element);
        }
    }

    // Checks for entity connected to another entity
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "EREntity") {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == "EREntity") {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            } 
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == "ERAttr" && tElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && fElement0.kind == "ERAttr" && fElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == "ERAttr" && tElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && fElement0.kind == "ERAttr" && fElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
    }

    if (element.state == "weak") {
        keyQuantity = 0;
        primaryCount = 0;
        strongEntity = 0;
        weakrelation = 0;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                if (tElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                if (fElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == "ERAttr" && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == "ERAttr" && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == "ERAttr" && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == "ERAttr" && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if weak entity is related to a strong entity or a weak entity with a relation
            if (fElement.id == element.id && tElement.kind == "ERRelation" && tElement.state == "weak" && line.kind == "Double") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == "EREntity" && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == "EREntity" && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERRelation" && fElement.state == "weak" && line.kind == "Double") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == "EREntity" && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == "EREntity" && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }

            // Counting weak relations
            if (fElement.id == element.id && tElement.kind == "ERRelation" && tElement.state == "weak") {
                weakrelation += 1;
            }
            if (tElement.id == element.id && fElement.kind == "ERRelation" && fElement.state == "weak") {
                weakrelation += 1;
            }
        }
        // Checks if element has one relation to a strong entity
        if (strongEntity != 1) {
            errorData.push(element);
        } 

        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checks if entity has any lines
            if (fElement.id == element.id || tElement.id == element.id) {
                //Checking for wrong quantity of keys
                if (keyQuantity < 1 || keyQuantity > 1) {
                    errorData.push(element);
                }
            }

            // Checks if entity has a weak relation
            if (weakrelation < 1) {
                errorData.push(element);
            }
        }
    }
    else {
        keyQuantity = 0;
        primaryCount = 0;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                if (tElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                if (fElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (tElement.state == "primary") {
                    primaryCount += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (fElement.state == "primary") {
                    primaryCount += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == "ERAttr") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == "ERAttr" && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == "ERAttr" && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == "ERAttr") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == "ERAttr" && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == "ERAttr" && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

        }

        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checks if entity has any lines
            if (fElement.id == element.id || tElement.id == element.id) {
                //Checking for wrong quantity of keys
                if (keyQuantity < 1) {
                    errorData.push(element);
                }
                if (primaryCount > 1) {
                    errorData.push(element);
                }
            }
        }
    }
}

/**
 * @description Error checking for ER relation
 * @param {Object} element Element to be checked for errors.
 */
function checkERRelationErrors(element) {
    var lineQuantity;

     // Checks for relation connected to another relation
     for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERRelation") {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == "ERRelation") {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            } 
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == "ERAttr" && tElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && fElement0.kind == "ERAttr" && fElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == "ERAttr" && tElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && fElement0.kind == "ERAttr" && fElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
    }

    // Checking for reletions with same name but different properties
    for (var i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id && data[i].kind == "ERRelation") {

            // Checking if relations have same line types
            var linesChecked = [];
            for (var k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line0;
                var fElement0;
                var tElement0;

                if (fElement.id == element.id && tElement.kind == "EREntity") {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (noLineFound) {
                        errorData.push(element);
                    }
                }
                if (tElement.id == element.id && fElement.kind == "EREntity") {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (var j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (var l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == "EREntity" && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    }
                                    else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (noLineFound) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if reletions have the same attributes
            for (var k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line1;
                var fElement1;
                var tElement1;
                var line2;
                var fElement2;
                var tElement2;

                if (fElement.id == element.id && tElement.kind == "ERAttr") {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (var j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == "ERAttr" && tElement0.state == tElement.state && tElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (var l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == "ERAttr" && fElement0.state == tElement.state && fElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (var l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == fElement0.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            noLineFound = true;
                        }
                        if (!noLineFound) break;
                    }
                    if (noLineFound && !attrFound) {
                        errorData.push(element);
                    }
                    if (!attrLineFound) {
                        errorData.push(element);
                    }
                }
                if (tElement.id == element.id && fElement.kind == "ERAttr") {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (var j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == "ERAttr" && tElement0.state == fElement.state && tElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (var l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == "ERAttr" && fElement0.state == fElement.state && fElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (var l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == fElement0.id && tElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == "ERAttr" && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == "ERAttr" && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == "ERAttr") {
                                    attrLineFound = false;

                                    for (var m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == "ERAttr" && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == "ERAttr" && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            noLineFound = true;
                        }
                        if (!noLineFound) break;
                    }
                    if (noLineFound && !attrFound) {
                        errorData.push(element);
                    }
                    if (!attrLineFound) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if relations have the same amount of attributes
            var elementAttrCount = 0;
            var dataAttrCount = 0;
            for (var j = 0; j < lines.length; j++) {
                line = lines[j];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                if (fElement.id == element.id && tElement.kind == "ERAttr") {
                    elementAttrCount += 1;
                }
                if (tElement.id == element.id && fElement.kind == "ERAttr") {
                    elementAttrCount += 1;
                }

                if (fElement.id == data[i].id && tElement.kind == "ERAttr") {
                    dataAttrCount += 1;
                }
                if (tElement.id == data[i].id && fElement.kind == "ERAttr") {
                    dataAttrCount += 1;
                }
            }
            if (elementAttrCount != dataAttrCount) {
                errorData.push(element);
            }
        }
    }

    // Checking for attribute with same name on relation
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == "ERAttr" && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == "ERAttr" && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == "ERAttr" && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == "ERAttr" && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    if (element.state == "weak") {
        lineQuantity = 0;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong line type to a relation
            if (fElement.id == element.id && tElement.kind == "EREntity" && tElement.state == "weak" && line.kind == "Normal") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == "EREntity" && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == "EREntity" && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == "EREntity" && fElement.state == "weak" && line.kind == "Normal") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == "EREntity" && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == "EREntity" && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            var line0;
            var fElement0;
            var tElement0;

            // Checking for more than one Normal line to a weak relation
            if (fElement.id == element.id && tElement.kind == "EREntity" && tElement.state != "weak") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == "EREntity" && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == "EREntity" && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == "EREntity" && fElement.state != "weak") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == "EREntity" && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == "EREntity" && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                }
            }

            // Checking for more than one double line to a weak relation
            if (fElement.id == element.id && line.kind == "Double") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && line0.kind == "Double" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && line0.kind == "Double" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && line.kind == "Double") {
                for (var j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && line0.kind == "Double" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && line0.kind == "Double" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Counting connected lines
            if ((tElement.id == element.id && fElement.kind == "EREntity") || (fElement.id == element.id && tElement.kind == "EREntity")) {
                lineQuantity += 1;
            }
        }
    }
    else {
        lineQuantity = 0;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Counting connected lines
            if ((tElement.id == element.id && fElement.kind == "EREntity") || (fElement.id == element.id && tElement.kind == "EREntity")) {
                lineQuantity += 1;
            }
        }
    }
    //Checking for wrong quantity of lines
    if (lineQuantity == 1 || lineQuantity > 2) {
        errorData.push(element);
    }
}

/**
 * @description Error checking for ER attribute
 * @param {Object} element Element to be checked for errors.
 */
function checkERAttributeErrors(element) {
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        var line0;
        var fElement0;
        var tElement0;

        // Checking for non-normal attributes on a attribute
        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation")) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation")) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation")) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation")) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }

        // Checking for 2nd line attribute connected with a 3rd attribute
        if (fElement.id == element.id && fElement.kind == "ERAttr" && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == "ERAttr" && tElement0.kind == "ERAttr" && tElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == "ERAttr" && fElement0.kind == "ERAttr" && fElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == "ERAttr" && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == "ERAttr" && tElement0.kind == "ERAttr" && tElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == "ERAttr" && fElement0.kind == "ERAttr" && fElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Checking for 3rd line attribute connected with a 2nd attribute
        if (fElement.id == element.id && fElement.kind == "ERAttr" && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == "ERAttr" && tElement0.kind == "ERAttr" && tElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == "ERAttr" && fElement0.kind == "ERAttr" && fElement0.id != fElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == "ERAttr" && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == "ERAttr" && tElement0.kind == "ERAttr" && tElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == "ERAttr" && fElement0.kind == "ERAttr" && fElement0.id != tElement.id) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == "ERAttr" && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == "ERAttr" && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Attribute connected to more than one relation or entity
        if (fElement.id == element.id && (tElement.kind == "EREntity" || tElement.kind == "ERRelation")) {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == "EREntity" || fElement.kind == "ERRelation")) {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation") && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation") && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }

        // 2nd line attribute connected to another relation or entity
        if (fElement.id == element.id && tElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation")) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation")) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == "EREntity" || tElement0.kind == "ERRelation")) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == "EREntity" || fElement0.kind == "ERRelation")) {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == "EREntity" || tElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == "EREntity" || fElement1.kind == "ERRelation")) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Check for 1st line attribute connected in a 3 line attribute chain
        if (fElement.id == element.id && (tElement.kind == "EREntity" || tElement.kind == "ERRelation")) {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == "ERAttr") {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == "ERAttr" && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == "ERAttr" && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == "ERAttr") {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == "ERAttr" && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == "ERAttr" && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == "EREntity" || fElement.kind == "ERRelation")) {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == "ERAttr") {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == "ERAttr" && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == "ERAttr" && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == "ERAttr") {
                    for (var k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == "ERAttr" && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == "ERAttr" && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Checking for wrong key type
        if ((tElement.kind == "EREntity" || fElement.kind == "EREntity") && (tElement.state == "weak" || fElement.state == "weak")) {
            if (fElement.id == element.id && tElement.kind == "EREntity") {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == "EREntity") {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(tElement);
                }
            }
        }
        else {
            if (fElement.id == element.id && tElement.kind == "EREntity") {
                if (fElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == "EREntity") {
                if (tElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }
        }

        var line0;
        var fElement0;
        var tElement0;

        // Checking for attributes on the same relation with the same name
        if (fElement.id == element.id && tElement.kind == "ERRelation") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == "ERAttr" && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && fElement0.kind == "ERAttr" && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "ERRelation") {
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == "ERAttr" && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && fElement0.kind == "ERAttr" && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }

        // Checking for key attributes on relation
        if (fElement.id == element.id && tElement.kind == "ERRelation" && (fElement.state == "primary" || fElement.state == "candidate" || fElement.state == "weakKey")) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == "ERRelation" && (tElement.state == "primary" || tElement.state == "candidate" || tElement.state == "weakKey")) {
            errorData.push(element);
        }

        // Checking for attributes connected with the same name
        if (fElement.id == element.id && fElement.kind == "ERAttr" && tElement.kind == "ERAttr" && fElement.name == tElement.name) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == "ERAttr" && tElement.kind == "ERAttr" && fElement.name == tElement.name) {
            errorData.push(element);
        }

        // Checking for attributes on the same entity
        if (fElement.id == element.id && tElement.kind == "EREntity") {
            var currentAttr = fElement;
            var currentEntity = tElement;
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                // Checking for attributes on the same entity with same name
                if (fElement0.id == currentEntity.id && tElement0.name == currentAttr.name && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && fElement0.name == currentAttr.name && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }

                // Checking for more than one key attributes on the same entity
                if (fElement0.id == currentEntity.id && ((currentAttr.state == "primary" && tElement0.state == "primary") || (currentAttr.state == "weakKey" && tElement0.state == "weakKey")) && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && ((currentAttr.state == "primary" && fElement0.state == "primary") || (currentAttr.state == "weakKey" && fElement0.state == "weakKey")) && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == "EREntity") {
            var currentAttr = tElement;
            var currentEntity = fElement;
            for (var j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                // Checking for attributes on the same entity with same name
                if (fElement0.id == currentEntity.id && tElement0.name == currentAttr.name && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && fElement0.name == currentAttr.name && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }

                // Checking for more than one key attributes on the same entity (except candidate key)
                if (fElement0.id == currentEntity.id && ((currentAttr.state == "primary" && tElement0.state == "primary") || (currentAttr.state == "weakKey" && tElement0.state == "weakKey")) && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && ((currentAttr.state == "primary" && fElement0.state == "primary") || (currentAttr.state == "weakKey" && fElement0.state == "weakKey")) && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }
            }
        }
    }
}

/**
 * @description Checks for errors and adds the element affected by the errors to a error list.
 * @param {Object} element Element to be checked for errors.
 */
function checkElementError(element) 
{
    if (element.kind == "EREntity") checkEREntityErrors(element)
    if (element.kind == "ERRelation") checkERRelationErrors(element)
    if (element.kind == "ERAttr") checkERAttributeErrors(element)

    // Check lines
    checkLineErrors(lines);
}
/**
 * @description Sets every elements stroke to black.
 * @param {Object} elements List of all elements.
 */
function errorReset(elements)
{
    for (var i = 0; i < elements.length; i++) {
        elements[i].stroke = strokeColors;
    }
}
/**
 * @description Updates the Label position on the line.
 * @param {Interger} newPosX The position the mouse is at in the X-axis.
 * @param {Interger} newPosY The position the mouse is at in the Y-axis.
 */
function updateLabelPos(newPosX, newPosY)
{   
    targetLabel.labelMoved = true;
    if(newPosX + targetLabel.width < targetLabel.highX && newPosX - targetLabel.width>targetLabel.lowX){ 
        targetLabel.labelMovedX = (newPosX - targetLabel.centerX);
    }
    else if(newPosX - targetLabel.width < targetLabel.lowX){
        targetLabel.labelMovedX = (targetLabel.lowX  + targetLabel.width - (targetLabel.centerX));
    }
    else if(newPosX  + targetLabel.width > targetLabel.highX){
        targetLabel.labelMovedX = (targetLabel.highX  - targetLabel.width - (targetLabel.centerX));
    }
    if(newPosY + targetLabel.height < targetLabel.highY && newPosY - targetLabel.height > targetLabel.lowY){ 
        targetLabel.labelMovedY = (newPosY - (targetLabel.centerY));
    }
    else if(newPosY - targetLabel.height < targetLabel.lowY){
        targetLabel.labelMovedY = (targetLabel.lowY + targetLabel.height - (targetLabel.centerY));
    }
    else if(newPosY + targetLabel.height > targetLabel.highY){
        targetLabel.labelMovedY = (targetLabel.highY - targetLabel.height - (targetLabel.centerY));
    }
    calculateProcentualDistance(targetLabel);
    calculateLabelDisplacement(targetLabel);
    displaceFromLine(newPosX,newPosY);
}

function calculateProcentualDistance(objectLabel,x,y){
    // Math to calculate procentuall distance from/to centerpoint
    var diffrenceX = objectLabel.highX - objectLabel.lowX;
    var diffrenceY = objectLabel.highY - objectLabel.lowY;    
    if(objectLabel.labelMovedX > objectLabel.highX - objectLabel.lowX){
        objectLabel.labelMovedX = objectLabel.highX - objectLabel.lowX;
    }
    else if(objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX){
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    if(objectLabel.labelMovedY > objectLabel.highY - objectLabel.lowY){
        objectLabel.labelMovedY = objectLabel.highY - objectLabel.lowY;
    }
    else if(objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX){
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    var distanceToX1 = objectLabel.centerX + objectLabel.labelMovedX - objectLabel.fromX;
    var distanceToY1 = objectLabel.centerY + objectLabel.labelMovedY - objectLabel.fromY;
    var lenghtToNewPos = Math.abs(Math.sqrt(distanceToX1*distanceToX1 + distanceToY1*distanceToY1));
    var entireLinelenght = Math.abs(Math.sqrt(diffrenceX*diffrenceX+diffrenceY*diffrenceY));
    objectLabel.percentOfLine = lenghtToNewPos/entireLinelenght;
    // Making sure the procent is less than 0.5 to be able to use them from the centerpoint of the line as well as ensuring the direction is correct 
    if(objectLabel.percentOfLine < 0.5){
        objectLabel.percentOfLine = 1 - objectLabel.percentOfLine;
        objectLabel.percentOfLine = objectLabel.percentOfLine - 0.5 ;
    } 
    else if (objectLabel.percentOfLine > 0.5){
        objectLabel.percentOfLine = -(objectLabel.percentOfLine - 0.5) ;
    }
    if(!objectLabel.labelMoved){
        objectLabel.percentOfLine = 0;
    }
    //changing the direction depending on how the line is drawn
    if(objectLabel.fromX<objectLabel.centerX){ //left to right
        objectLabel.labelMovedX = -objectLabel.percentOfLine * diffrenceX;
    }
    else if(objectLabel.fromX>objectLabel.centerX){//right to left
        objectLabel.labelMovedX = objectLabel.percentOfLine * diffrenceX;
    }

    if(objectLabel.fromY<objectLabel.centerY){ //down to up
        objectLabel.labelMovedY = -objectLabel.percentOfLine * diffrenceY;
    }
    else if(objectLabel.fromY>objectLabel.centerY){ //up to down
        objectLabel.labelMovedY = objectLabel.percentOfLine * diffrenceY;
    }
}
/**
 * @description calculates how the label should be displacesed
 * @param {Interger} labelObject the label that should be displaced
 */
function calculateLabelDisplacement(labelObject)
{
    var diffrenceX = labelObject.highX-labelObject.lowX;
    var diffrenceY = labelObject.highY-labelObject.lowY;
    var entireLinelenght = Math.abs(Math.sqrt(diffrenceX*diffrenceX+diffrenceY*diffrenceY));
    var baseLine, angle, displacementConstant=labelObject.height, storeX, storeY;
    var distanceToOuterlines={storeX, storeY}
    // define the baseline used to calculate the angle
    if((labelObject.fromX - labelObject.toX) > 0){
        if((labelObject.fromY - labelObject.toY) > 0){ // up left
            baseLine = labelObject.fromY - labelObject.toY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght))*90);
            distanceToOuterlines.storeX = (((90-angle) / 5) - displacementConstant)*2.2;
            distanceToOuterlines.storeY = (displacementConstant - (angle / 5))*1.2;
        }
        else if((labelObject.fromY - labelObject.toY) < 0){ // down left
            baseLine = labelObject.toY - labelObject.fromY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght))*90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle+90) / 5))*2.2;
            distanceToOuterlines.storeY = (displacementConstant + (angle / 5))*1.2;
        }
    }
    else if((labelObject.fromX - labelObject.toX) < 0){
        if((labelObject.fromY - labelObject.toY) > 0){ // up right
            baseLine = labelObject.toY - labelObject.fromY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght))*90);
            distanceToOuterlines.storeX = (((90-angle) / 5) - displacementConstant)*2.2;
            distanceToOuterlines.storeY = ((angle / 5) - displacementConstant)*1.2;
        }
        else if((labelObject.fromY - labelObject.toY) < 0){ // down right
            baseLine = labelObject.fromY - labelObject.toY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght))*90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle+90) / 5))*2.2;
            distanceToOuterlines.storeY = (-displacementConstant - (angle / 5))*1.2;
        }
    }
    return distanceToOuterlines;
}
/**
 * @description checks if the label should be detached.
 * @param {Interger} newX The position the mouse is at in the X-axis.
 * @param {Interger} newY The position the mouse is at in the Y-axis.
 */
function displaceFromLine(newX,newY)
{
    //calculates which side of the line the point is.
    var y1=targetLabel.fromY,y2=targetLabel.toY,x1=targetLabel.fromX,x2=targetLabel.toX;
    var distance = ((newX - x1) * (y2 - y1)) - ((newY - y1) * (x2 - x1));
    //deciding which side of the line the label should be
    if (distance > 6000) {
        targetLabel.labelGroup = 1;
    }
    else if (distance < -6000) {
        targetLabel.labelGroup = 2;
    }
    else {        
        targetLabel.labelGroup = 0;
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

    if (((context.length != 0 || contextLine.length != 0) && mouseMode != mouseModes.EDGE_CREATION) || mouseMode == mouseModes.EDGE_CREATION && context.length == 0 && contextLine.length != 0){
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
                if (contextLine[i] && contextLine[i].kind !== undefined) {
                    if (contextLine[i].kind === lineKind.DOUBLE) {
                        tempLines.push(document.getElementById(contextLine[i].id + "-1"));
                        tempLines.push(document.getElementById(contextLine[i].id + "-2"));
                    } else {
                        tempLines.push(document.getElementById(contextLine[i].id));
                    }
                }
            }
            var tempX1, tempX2, tempY1, tempY2;
            var hasPoints = tempLines[0].getAttribute('points'); // Polyline
            if (hasPoints != null) {
                var points = hasPoints.split(' ');
                // Find highest and lowest x and y coordinates of the first element in lines
                tempX1 = points[0].split(',')[0];
                tempX2 = points[3].split(',')[0];
                tempY1 = points[0].split(',')[1];
                tempY2 = points[3].split(',')[1];
            }
            else {
                // Find highest and lowest x and y coordinates of the first element in lines
                tempX1 = tempLines[0].getAttribute("x1");
                tempX2 = tempLines[0].getAttribute("x2");
                tempY1 = tempLines[0].getAttribute("y1");
                tempY2 = tempLines[0].getAttribute("y2");
            }
            lineLowX = Math.min(tempX1, tempX2);
            lineHighX = Math.max(tempX1, tempX2);
            lineLowY = Math.min(tempY1, tempY2);
            lineHighY = Math.max(tempY1, tempY2);

            // Loop through all selected lines and find highest and lowest x and y coordinates
            for (var i = 0; i < tempLines.length; i++) {
                var hasPoints = tempLines[i].getAttribute('points'); // Polyline
                if (hasPoints != null) {
                    var points = hasPoints.split(' ');
                    // Find highest and lowest x and y coordinates of the first element in lines
                    tempX1 = points[0].split(',')[0];
                    tempX2 = points[3].split(',')[0];
                    tempY1 = points[0].split(',')[1];
                    tempY2 = points[3].split(',')[1];
                }
                else {
                    // Find highest and lowest x and y coordinates of the first element in lines
                    tempX1 = tempLines[i].getAttribute("x1");
                    tempX2 = tempLines[i].getAttribute("x2");
                    tempY1 = tempLines[i].getAttribute("y1");
                    tempY2 = tempLines[i].getAttribute("y2");
                }
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
        
        // Global variables used to determine if mouse was clicked within selection box
        selectionBoxLowX = lowX - 5;
        selectionBoxHighX = highX + 5;
        selectionBoxLowY = lowY - 5;
        selectionBoxHighY = highY + 5;
        
        // Selection container of selected elements
        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}' style="fill:transparent; stroke-width:1.5; stroke:${selectedColor};" />`;

        //Determine size and position of delete button
        if (highX - lowX + 10 > highY - lowY + 10) {
            deleteBtnSize = (highY - lowY + 10) / 3;
        }
        else {
            deleteBtnSize = (highX - lowX + 10) / 3;
        }
        
        if (deleteBtnSize > 20) {
            deleteBtnSize = 20;
        }
        else if (deleteBtnSize < 15) {
            deleteBtnSize = 15;
        }

        deleteBtnX = lowX - 5 + highX - lowX + 10 - (deleteBtnSize/2);
        deleteBtnY = lowY - 5 - (deleteBtnSize/2);

        //Delete button visual representation
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + deleteBtnSize - 2}' class= "BlackthemeColor"/>`;
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + deleteBtnSize - 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + 2}' class= "BlackthemeColor"/>`;
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
            top = Math.round((((elementData.y - zoomOrigo.y)-(settings.grid.gridSize/2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta){
            left -= deltaX;
            top -= deltaY;
        }

        if (settings.grid.snapToGrid && useDelta) {
            if (element.kind == "EREntity"){
                // The element coordinates with snap point
                var objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact))-(settings.grid.gridSize*3)) / settings.grid.gridSize) * settings.grid.gridSize;
                var objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;
                
                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x)+(settings.grid.gridSize*5))* zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y)-(settings.grid.gridSize/2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
                
            } 
            else if (element.kind != "EREntity"){
                // The element coordinates with snap point
                var objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact))-(settings.grid.gridSize*3)) / settings.grid.gridSize) * settings.grid.gridSize;
                var objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize * 0.5)) * (settings.grid.gridSize * 0.5);
                
                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x)+(settings.grid.gridSize*4)) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y)-(settings.grid.gridSize/2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));
            
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
            var fillColor;
            var fontColor;
            var weakKeyUnderline;
            var disjointLine1Color;
            var disjointLine2Color;
            if (data[i].isLocked) useDelta = false;
            updateElementDivCSS(element, elementDiv, useDelta);

            // Edge creation does not highlight selected elements
            if(mouseMode != mouseModes.EDGE_CREATION){
                // Update UMLEntity
                if(element.kind == "UMLEntity"){
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if(markedOverOne()){
                            fillColor.style.fill = `${"#927b9e"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        } else{
                            fillColor.style.fill = `${element.fill}`;

                            fontContrast();

                        }
                    }
                }
                // Update IEEntity
                else if(element.kind == "IEEntity"){
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if(markedOverOne()){
                            fillColor.style.fill = `${"#927b9e"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        } else{
                            fillColor.style.fill = `${element.fill}`;
                            fontContrast();
                        }
                    }
                }
                // Update SDEntity
                else if (element.kind == "SDEntity") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne()) {
                            fillColor.style.fill = `${"#927b9e"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        } else {
                            fillColor.style.fill = `${element.fill}`;
                            fontContrast();
                        }
                    }
                }
                // Update Elements with double borders.
                else if(element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];

                        if(markedOverOne()){

                            fillColor.style.fill = `${"#927b9e"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        } else {
                            fillColor.style.fill = `${element.fill}`;

                            fontContrast();

                        }
                    }
                }
                else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if(markedOverOne()){
                        fillColor.style.fill = `${"#927b9e"}`;
                        fontColor.style.fill = `${"#ffffff"}`;
                        if(element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = `${"#ffffff"}`;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if(element.kind == "IERelation" && element.state != "overlapping") {
                                disjointLine1Color.style.stroke = `${"#ffffff"}`;
                                disjointLine2Color.style.stroke = `${"#ffffff"}`;
                        }
                        // If UMLRelation is not marked.
                    } else if(element.kind == "UMLRelation"){
                        if(element.state == "overlapping"){
                            fillColor.style.fill = `${"#000000"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        }else{
                            fillColor.style.fill = `${"#ffffff"}`;
                        }
                    } else{
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if(element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = `${"#000000"}`;
                            if (element.fill == "#000000") {
                                weakKeyUnderline.style.stroke = `${"#ffffff"}`;
                            }
                        }
                    }
                }
            } else {
                // Update UMLEntity
                if(element.kind == "UMLEntity"){
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update IEEntity
                else if(element.kind == "IEEntity"){
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update SDEntity
                else if (element.kind == "SDEntity") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update Elements with double borders.
                else if(element.state == "weak" || element.state == "multiple"){
                    for (let index = 0; index < 2; index++){
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }else{ // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if(markedOverOne()){
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if(element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = `${"#ffffff"}`;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if(element.kind == "IERelation" && element.state != "overlapping") {
                                disjointLine1Color.style.stroke = `${"#ffffff"}`;
                                disjointLine2Color.style.stroke = `${"#ffffff"}`;
                        }
                        // If UMLRelation is not marked.
                    } else if(element.kind == "UMLRelation"){
                        if(element.state == "overlapping"){
                            fillColor.style.fill = `${"#000000"}`;
                            fontColor.style.fill = `${"#ffffff"}`;
                        }else{
                            fillColor.style.fill = `${"#ffffff"}`;
                        }
                    } else{
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if(element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = `${"#000000"}`;
                            if (element.fill == "#000000") {
                                weakKeyUnderline.style.stroke = `${"#ffffff"}`;
                            }
                        }
                    }
                }
            }
        }
    }

    // Also update ghost if there is one
    if (ghostElement) {
        var ghostDiv = document.getElementById(ghostElement.id);
        
        if (ghostDiv){
            updateElementDivCSS(ghostElement, ghostDiv)
        }
    }

    function fontContrast() {
        //check if the fill color is black or pink, if so the font color is set to white
        fontColor.style.fill = element.fill == "#000000" ||element.fill == "#DC267F" ? `${"#ffffff"}` : `${"#000000"}`;
    }

    function markedOverOne() {
        //If more than one element is marked.
        return inContext && context.length > 1 || inContext && context.length > 0 && contextLine.length > 0;
    }
    toggleBorderOfElements();
}
/**
 * @description toggles the border of all elements to white or gray; depending on current theme and fill.
 */
function toggleBorderOfElements() {
    //get all elements with the class text. This inludes the text in the elements but also the non text svg that surrounds the text and just has a stroke.
    //For the future, these svg elements should probably be given a class of their own and then this function should be updated.
   let allTexts = document.getElementsByClassName('text');
    if (localStorage.getItem('diagramTheme') != null) {
        //in localStorage, diagramTheme holds a URL to the CSS file currently used. Like, style.css or blackTheme.css
      let cssUrl = localStorage.getItem('diagramTheme');
        //this turns, for example, '.../Shared/css/style.css' into just 'style.css'
        cssUrl = cssUrl.split("/").pop();
    
        if(cssUrl == 'blackTheme.css'){
            //iterate through all the elements that have the class 'text'.
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                //assign their current stroke color to a variable.
              let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                //if the element has a stroke which has the color #383737 and its fill isn't white: set it to white.
                //this is because we dont want to affect the strokes that are null or other colors and have a contrasting border.
                if (strokeColor == '#383737' && fillColor != '#ffffff') {
                    strokeColor = '#ffffff';
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
        //if the theme isnt darkmode and the fill isn't gray, make the stroke gray.
        else{
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                if (strokeColor == '#ffffff' && fillColor != '#383737') {
                    strokeColor = '#383737';
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
    }
}
/**
 * @description toggles the sequence actor/object selected to the type specified in the parameter: actor or object.
 * @param type the type that youd like to switch to, actor or object.
 */
function toggleActorOrbject(type){
    for (let i = 0; i < context.length; i++) {
        if (context[i].actorOrObject != null) {
            if (type=="object") {
                context[i].actorOrObject = "object";
            }
            else if (type=="actor") {
                context[i].actorOrObject = "actor";
            }
            else {
                console.error(type + " is an unexpected parameter for toggleActorOrbject. This can only support actor or object.");
            }
        }
    }
    showdata();
}
/**
 * @description sets the alternatives attribute for sequenceLoopOrAlt to whatever is in the input box inputAlternatives. one index in the array per line.
 */
//TODO This should be implemeted into saveProperties but as of this moment I could not becuase of a bug that was outside the scope of my issue.
function setSequenceAlternatives(){
    //for each element in context, check if it has the property alternatives
    for (let i = 0; i < context.length; i++) {
        if (context[i].alternatives != null) {
            //Create an array from string where newline seperates elements
            let alternatives = document.getElementById("inputAlternatives").value.split('\n');
            let formatArr = [];
            for (let i = 0; i < alternatives.length; i++) {
                if (!(alternatives[i] == '\n' || alternatives[i] == '' || alternatives[i] == ' ')) {
                    formatArr.push(alternatives[i]);
                } 
            }
            //Update the alternatives array
            alternatives = formatArr;
            context[0].alternatives = alternatives;

            stateMachine.save(
                StateChangeFactory.ElementAttributesChanged(context[0].id, { 'alternatives': alternatives }),
                StateChangeFactory.ElementAttributesChanged(context[0].id, { 'altOrLoop': context[0].altOrLoop }),
                StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED
            );
        }
    }
    showdata();
}
/**
 * @description checks the current CSS file the item diagramTheme currently holds in localStorage to determine if the current theme is darkmode or not.
 * @return a boolean value depending on if it is darktheme or not.
 */
function isDarkTheme(){
    if (localStorage.getItem('diagramTheme') != null) {
        //in localStorage, diagramTheme holds a URL to the CSS file currently used. Like, style.css or blackTheme.css
	    let cssUrl = localStorage.getItem('diagramTheme');
        //this turns, for example, '.../Shared/css/style.css' into just 'style.css'
        cssUrl = cssUrl.split("/").pop();

        return cssUrl === 'blackTheme.css'
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
    errorData = [];

    errorReset(data);

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
    // Stops execution if there are no elements to center the camera around.
    if (data.length == 0) {
        return;
    }

    //desiredZoomfact = zoomfact;
    zoomfact = 1;

    // Calculate min and max x and y values for all elements combined, and then find their averages
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

    determineZoomfact(maxX, maxY, minX, minY);

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
    const element = document.createElement('a');
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
function exportWithHistory()
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
 * @description Stores the current diagram as JSON in localstorage
 */
 function storeDiagramInLocalStorage(){
    // Remove all future states to the history
    stateMachine.removeFutureStates();

    // The content of the save file
    var objToSave = {
        historyLog: stateMachine.historyLog,
        initialState: stateMachine.initialState
    };
    localStorage.setItem("CurrentlyActiveDiagram",JSON.stringify(objToSave));
}
/**
 * @description Prepares data for file creation, retrieves data and lines, also filter unnecessary values
 */
function exportWithoutHistory()
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
 * @description Load one of the stored JSON files
 * @param path the path to the JSON file on the server that you want to load from, for example, JSON/IEDiagramMockup.json
 */
function loadMockupDiagram(path){

    // "resetDiagram()" calls this method with "EMPTYDiagram" as parameter

    // The path is not set yet if we do it from the dropdown as the function
    // is called without a parameter.
    if(!path){
        let fileType = document.getElementById("diagramTypeDropdown").value;
        path = fileType;
    }
    //make sure its not null first
    if (path != null) {
        //via fetch API, request the json file 
        fetch(path)
            .then((response) => {
                //throw an error if the request is not ok
                if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
                }
                //fetch the response as json
                return response.json();
            })
            //after response.json() has succeded, load the diagram from this json
            .then((json) => loadDiagram(json, false)) 
            //catch any error
            .catch((err) => console.error(`Fetch problem: ${err.message}`));
    }
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
//code has no functionallity execpt for when the hard coded diagram was used. looks like it reloaeded the diagram and got the file. Diagram in onSetup()
/* function fetchDiagramFileContentOnLoad()
{
    let temp = getVariantParam();
    var fullParam = temp[0];
    cid = temp[1];
    cvers = temp[2];
    diagramToLoad = temp[3];
    diagramToLoadContent = temp[4];

    // Check whether there is a diagram saved in localstorage and load it.
    // Otherwise, load from VariantParam  
    if (localStorage.getItem("CurrentlyActiveDiagram")) {
        var diagramFromLocalStorage = localStorage.getItem("CurrentlyActiveDiagram");
        loadDiagramFromString(JSON.parse(diagramFromLocalStorage));
    } else if (diagramToLoadContent != "NO_FILE_FETCHED" && diagramToLoadContent != "") {
        loadDiagramFromString(JSON.parse(diagramToLoadContent));
        storeDiagramInLocalStorage();
    } else {
        // Failed to load content
        console.error("No content to load")
    }
} */

// Save current diagram when user leaves the page
function saveDiagramBeforeUnload() {
    window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        e.returnValue = "";
        storeDiagramInLocalStorage();
    })
}

function loadDiagramFromString(temp, shouldDisplayMessage = true)
{
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

//Alert function to give user a warning/choice before reseting diagram data.
function resetDiagramAlert(){
    let refreshConfirm = confirm("Are you sure you want to reset to default state? All changes made to diagram will be lost");
    if(refreshConfirm){
        resetDiagram();
    }

}
/**
 * @description Cleares the diagram.
 */
function resetDiagram(){
    
    // Goto the beginning of the diagram
        // NOTE: stateMachine should be StateMachine, but this had no effect
        // on functionality.
    /*
    stateMachine.gotoInitialState();

    // Remove the previous history
    stateMachine.currentHistoryIndex = -1;
    stateMachine.lastFlag = {};
    stateMachine.removeFutureStates();
    //localStorage.setItem("CurrentlyActiveDiagram","");// Emptying the currently active diagram
    //fetchDiagramFileContentOnLoad();
    */
    loadMockupDiagram("JSON/EMPTYDiagramMockup.json");
}
/**
 *
 *  @description Function to set the values of the current variant in the preivew
 *  @throws error If "window.parent.parameterArray" is not set or null.
 */
function setPreviewValues(){
    try {
        if (!window.parent.parameterArray) throw new Error("\"window.parent.parameterArray\" is not set or empty!");
        diagramType=window.parent.parameterArray[0];
        showDiagramTypes();
        hideErrorCheck(window.parent.parameterArray[1]);
        getInstructions(window.parent.parameterArray[2]);
        getInstructions(window.parent.parameterArray[3]);
    } catch (e) {
        console.error(e);
    }
}
//#endregion =====================================================================================
