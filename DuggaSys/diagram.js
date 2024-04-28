// =============================================================================================
//#region ================================ CLASSES =============================================

/**
 * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector.
 */
class Point {
    x = 0;
    y = 0;

    /**
     * @description Point contianing X & Y coordinates. Can also be used as a 2D-vector.
     * @param {number} startX
     * @param {number} startY
     */
    constructor(startX = 0, startY = 0) {
        this.x = startX;
        this.y = startY;
    }

    /**
     * @description Adds x and y of another point to this point.
     * @param {Point} other Point that should be appended to this.
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
}

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
        ELEMENT_CREATED: {flag: 1, isSoft: false, canAppendTo: true},
        ELEMENT_DELETED: {flag: 2, isSoft: false, canAppendTo: false},
        ELEMENT_MOVED: {flag: 4, isSoft: true, canAppendTo: true},
        ELEMENT_RESIZED: {flag: 8, isSoft: true, canAppendTo: true},
        ELEMENT_ATTRIBUTE_CHANGED: {flag: 16, isSoft: true, canAppendTo: true},
        LINE_CREATED: {flag: 32, isSoft: false, canAppendTo: true},
        LINE_DELETED: {flag: 64, isSoft: false, canAppendTo: false},

        // Combined flags
        ELEMENT_MOVED_AND_RESIZED: {flag: 4 | 8, isSoft: true, canAppendTo: true},
        ELEMENT_AND_LINE_DELETED: {flag: 2 | 64, isSoft: false, canAppendTo: false},
        ELEMENT_AND_LINE_CREATED: {flag: 1 | 32, isSoft: false, canAppendTo: false},
    };

    /**
     * @description Creates a new StateChange instance.
     * @param {ChangeTypes} changeType What kind of change this is, see {StateChange.ChangeTypes} for available values.
     * @param {Array<String>} id_list Array of all elements affected by this state change. This is used for merging changes on the same elements.
     * @param {Object} passed_values Map of all values that this change contains. Each property represents a change.
     */
    constructor(id, values, timestamp) {
        if (id != null) this.id = id;

        if (values != undefined) {
            var keys = Object.keys(values);

            // If "values" is an array of objects, store all objects in the "state.created" array.
            if (keys[0] == '0') {
                this.created = values;
            } else {
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
    appendValuesFrom(changes) {
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
 * @description Constructs state changes with appropriate values set for each situation.
 * This factory will also map passed argument into correct properties in the valuesPassed object.
 */
class StateChangeFactory {
    /**
     * @param {Object} element The new element that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementCreated(element) {
        var values = {kind: element.kind};

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(element).filter(key => {
            if (key === 'x' || key === 'y') return true;
            return (Object.keys(defaults[element.kind]).filter(value => {
                return defaults[element.kind][value] === element[key];
            }).length === 0);
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
    static ElementsDeleted(elements) {
        var ids = [];

        // For every object in the array, get id and add it to the array ids
        elements.forEach(element => {
            ids.push(element.id);
        });

        return new StateChange(ids);
    }

    /**
     * @param {Array<String>} elementIDs List of IDs for all elements that were moved.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @returns {Array<StateChange>} A new instance of the StateChange class.
     */
    static ElementsMoved(elementIDs, moveX, moveY) {
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
    static ElementResized(elementIDs, changeX, changeY) {
        var values = {
            width: changeX,
            height: changeY
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
    static ElementMovedAndResized(elementIDs, moveX, moveY, changeX, changeY) {
        var values = {
            x: moveX,
            y: moveY,
            width: changeX,
            height: changeY
        };
        return new StateChange(elementIDs, values);
    }

    /**
     * @param {Array<String>} elementID ID for element that has been changed.
     * @param {Object} changeList Object containing changed attributes for the element. Each property represents each attribute changed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementAttributesChanged(elementID, changeList) {
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
    static LineAdded(line) {
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
    static LinesRemoved(lines) {
        var lineIDs = [];

        // For every object in the lines array, add them to lineIDs
        for (let index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }

        return new StateChange(lineIDs);
    }

    /**
     * @param {Array<object>} elements All elements that have been / are going to be removed.
     * @param {Array<object>} lines All lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesDeleted(elements, lines) {
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
    static ElementsAndLinesCreated(elements, lines) {
        var changesArr = [];
        var timeStamp = new Date().getTime();

        // Filter out defaults from each element and add them to allObj
        elements.forEach(elem => {
            var values = {kind: elem.kind};

            var uniqueKeysArr = Object.keys(elem).filter(key => {
                if (key === 'x' || key === 'y') return true;
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
class StateMachine {
    /**
     * @description Instanciate a new StateMachine. Constructor arguments will determine the "initial state", only changes AFTER this will be logged.
     * @param {Array<Object>} initialElements All elements that should be stored in the initial state.
     * @param {*} initialLines All lines that should be stored in the initial state.
     */
    constructor(initialElements, initialLines) {
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
        this.lastFlag = {};

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
    save(stateChangeArray, newChangeType) {
        let currentChangedType;
        let changeTypes;
        if (!Array.isArray(stateChangeArray)) stateChangeArray = [stateChangeArray];

        for (let i = 0; i < stateChangeArray.length; i++) {

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
                    if (stateChange.created != undefined) {
                        sameElements = false;
                    } else { // Perform history comparisions
                        if (Array.isArray(lastLog.id)) {
                            if (stateChange.id.length != lastLog.id.length) sameElements = false;
                            for (let index = 0; index < lastLog.id.length && sameElements; index++) {
                                var id_found = lastLog.id[index];

                                if (!stateChange.id.includes(id_found)) sameElements = false;
                            }
                        } else {
                            if (lastLog.id != stateChange.id) sameElements = false;
                        }

                        if (Array.isArray(newChangeType)) {
                            for (let index = 0; index < newChangeType.length && isSoft; index++) {
                                isSoft = newChangeType[index].isSoft;
                            }
                            changeTypes = newChangeType;
                        } else {
                            isSoft = newChangeType.isSoft;
                            changeTypes = [newChangeType];
                        }

                        // Find last change with the same ids
                        var timeLimit = 10; // Timelimit on history append in seconds
                        for (let index = this.historyLog.length - 1; index >= 0; index--) {
                            // Check so if the changeState is not an created-object
                            if (this.historyLog[index].created != undefined) continue;

                            var sameIds = true;
                            if (stateChange.id.length != this.historyLog[index].id.length) sameIds = false;

                            for (let idIndex = 0; idIndex < stateChange.id.length && sameIds; idIndex++) {
                                if (!this.historyLog[index].id.includes(stateChange.id[idIndex])) sameIds = false;
                            }

                            // If the found element has the same ids.
                            if (sameIds) {
                                var temp = false;
                                // If this historyLog is within the timeLimit
                                if (((new Date().getTime() / 1000) - (this.historyLog[index].time / 1000)) < timeLimit) {
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
                        this.lastFlag = newChangeType;
                        this.currentHistoryIndex = this.historyLog.length - 1;
                    } else { // Otherwise, simply modify the last entry.
                        for (let i = 0; i < changeTypes.length; i++) {
                            const currentChangedType = changeTypes[i];

                            switch (currentChangedType) {
                                case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                                case StateChange.ChangeTypes.ELEMENT_MOVED:
                                case StateChange.ChangeTypes.ELEMENT_RESIZED:
                                case StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED:
                                    lastLog.appendValuesFrom(stateChange);
                                    this.historyLog.push(this.historyLog.splice(this.historyLog.indexOf(lastLog), 1)[0]);
                                    this.currentHistoryIndex = this.historyLog.length - 1;
                                    break;
                                default:
                                    console.error(`Missing implementation for soft state change: ${stateChange}!`);
                                    break;
                            }
                        }
                    }
                } else {
                    this.historyLog.push(stateChange);
                    this.lastFlag = currentChangedType;
                    this.currentHistoryIndex = this.historyLog.length - 1;
                }
            } else {
                console.error("Passed invalid argument to StateMachine.save() method. Must be a StateChange object!");
            }
        }
    }

    removeFutureStates() {
        // Remove the history entries that are after current index
        if (this.currentHistoryIndex != this.historyLog.length - 1) {
            this.historyLog.splice(this.currentHistoryIndex + 1, (this.historyLog.length - this.currentHistoryIndex - 1));
        }
    }

    /**
     * @description Undoes the last stored history log changes. Determines what should be looked for by reading the state change flags.
     * @see StateChange For available flags.
     */
    stepBack() {
        // If there is no history => return
        if (this.currentHistoryIndex == -1) {
            return;
        } else {
            this.currentHistoryIndex--;
        }

        // Remove ghost only if stepBack while creating edge
        if (mouseMode === mouseModes.EDGE_CREATION) clearGhosts()

        clearContext();
        clearContextLine();
        showdata();
        this.scrubHistory(this.currentHistoryIndex);
        updatepos(0, 0);
        displayMessage(messageTypes.SUCCESS, "Changes reverted!");
        disableIfDataEmpty();
    }

    stepForward() {
        // If there is not anything to restore => return
        if (this.historyLog.length == 0 || this.currentHistoryIndex == (this.historyLog.length - 1)) return;

        // Go one step forward, if the next state in the history has the same time, do that too
        do {
            this.currentHistoryIndex++;
            this.restoreState(this.historyLog[this.currentHistoryIndex]);

            var doNextState = false;
            if (this.historyLog[this.currentHistoryIndex + 1]) {
                doNextState = (this.historyLog[this.currentHistoryIndex].time == this.historyLog[this.currentHistoryIndex + 1].time)
            }
        } while (doNextState);

        // Update diagram
        clearContext();
        showdata();
        updatepos(0, 0);
        displayMessage(messageTypes.SUCCESS, "Changes reverse reverted!")
    }

    scrubHistory(endIndex) {
        this.gotoInitialState();

        for (let i = 0; i <= endIndex; i++) {
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
    restoreState(state) {
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
                if (data[findIndex(data, objID)] != undefined) {
                    elementsToRemove.push(data[findIndex(data, objID)]);
                } else {
                    linesToRemove.push(lines[findIndex(lines, objID)]);
                }
            });
            // If the array is not empty remove the objects
            if (linesToRemove.length != 0) removeLines(linesToRemove, false);
            if (elementsToRemove.length != 0) removeElements(elementsToRemove, false);
            return;
        }

        if (!Array.isArray(state.id)) state.id = [state.id];

        for (let i = 0; i < state.id.length; i++) {
            // Find object
            var object;
            if (data[findIndex(data, state.id[i])] != undefined) object = data[findIndex(data, state.id[i])];
            else if (lines[findIndex(lines, state.id[i])] != undefined) object = lines[findIndex(lines, state.id[i])];

            // If an object was found
            if (object) {
                // For every key, apply the changes
                keys.forEach(key => {
                    if (key == "id" || key == "time") return; // Ignore this keys.
                    object[key] = state[key];
                });
            } else { // If no object was found - create one
                var temp = {};

                Object.keys(state).forEach(key => {
                    if (key == "id") temp.id = state.id[i];
                    else temp[key] = state[key];
                });

                // If the object got x, y and a kind, apply the default for the kind and create a element
                if (temp.x && temp.y && temp.kind) {
                    Object.keys(defaults[temp.kind]).forEach(key => {
                        if (!temp[key]) temp[key] = defaults[temp.kind][key];
                    });
                    data.push(temp);

                } else { // Else it most be an line - apply defaults and create the line
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
    gotoInitialState() {
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
    replay(cri = parseInt(document.getElementById("replay-range").value)) {
        // If no history exists => return
        if (this.historyLog.length == 0) return;

        var tsIndexArr = Object.keys(settings.replay.timestamps);

        clearInterval(this.replayTimer);

        // If cri (CurrentReplayIndex) is the last set to beginning
        if (cri == tsIndexArr.length - 1) cri = -1;

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

            if (tsIndexArr.length - 1 == cri) {
                stopStateIndex = self.historyLog.length - 1;
            } else if (tsIndexArr[cri + 1] - 1 == tsIndexArr[cri]) {
                stopStateIndex = startStateIndex;
            } else {
                stopStateIndex = tsIndexArr[cri + 1] - 1;
            }
            if (stopStateIndex == -1) {
                stopStateIndex = 0;
            }

            for (let i = startStateIndex; i <= stopStateIndex; i++) {
                self.restoreState(self.historyLog[i]);

                if (settings.replay.delay != startDelay) {
                    clearInterval(self.replayTimer);
                    this.replay();
                }
            }

            // Update diagram
            clearContext();
            showdata();
            updatepos(0, 0);


            document.getElementById("replay-range").value = cri;

            if (tsIndexArr.length - 1 == cri) {
                clearInterval(self.replayTimer);
                setReplayRunning(false);
            }
        }, settings.replay.delay * 1000)
    }
}

//#endregion ===================================================================================
//#region ================================ ENUMS ===============================================

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
    EDGE_CREATION: {key: "5", ctrl: false},
    STATE_INITIAL: { key: "6" , ctrl: false },
    SEQ_LIFELINE: { key: "7", ctrl: false },
    NOTE_ENTITY: { key: "8", ctrl: false },
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
    SAVE_DIAGRAM: { key: "s", ctrl: true },
    LOAD_DIAGRAM: { key: "l", ctrl: true }, 
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
    UMLEntity: 4,
    UMLRelation: 5,
    IEEntity: 6,
    IERelation: 7,
    SDEntity: 8,
    UMLInitialState: 9,
    UMLFinalState: 10,
    UMLSuperState: 11,
    sequenceActor: 12,
    sequenceActivation: 13,
    sequenceLoopOrAlt: 14,
    note: 15,
    sequenceObject: 16,
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
    sequenceActor: "sequenceActor",
    sequenceObject: "sequenceObject",
    sequenceActivation: "sequenceActivation",
    sequenceLoopOrAlt: "sequenceLoopOrAlt",
    note: "Note",
    UMLRelation: "UMLRelation",
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
    PRIMARY: "primary",
    WEAK: "weakKey",
    COMPUTED: "computed",
    MULTIPLE: "multiple",
    CANDIDATE: "candidate",
};

/**
 * @description Available types of entity, ie ER, IE, UML & SD This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const entityType = {
    UML: "UML",
    ER: "ER",
    IE: "IE",
    SD: "SD",
    SE: "SE",
    note: "NOTE",
};

/**
 * @description Available types of the entity element. This will alter how the entity is drawn onto the screen.
 */
const entityState = {
    NORMAL: "normal",
    WEAK: "weak",
};

/**
 * @description Available types of relations, ie ER, IE & UML This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const relationType = {
    UML: "UML",
    ER: "ER",
    IE: "IE"
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

const lineDirection = {
    UP: 'TB',
    DOWN: 'BT',
    RIGHT: 'RL',
    LEFT: 'LR',
}

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
    FORCED_ONE: "1!",
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

/**
 * @description Polyline [x, y] coordinates of a line icon. For all element pair orientations
 * @type {{BT: number[][], LR: number[][], RL: number[][], TB: number[][]}}
 */
const TRIANGLE = {
    'TB': [[-10, -20], [0, 0], [10, -20], [-10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20], [-10, 20]],
    'LR': [[-20, -10], [0, 0], [-20, 10], [-20, -10]],
    'RL': [[20, -10], [0, 0], [20, 10], [20, -10]]
}
const WEAK_TRIANGLE = {
    'TB': [[-10, -5], [0, -25], [10, -5], [-10, -5]],
    'BT': [[-10, 5], [0, 25], [10, 5], [-10, 5]],
    'LR': [[-5, -10], [-25, 0], [-5, 10], [-5, -10]],
    'RL': [[5, -10], [25, 0], [5, 10], [5, -10]],
}
const DIAMOND = {
    'TB': [[-10, -20], [0, 0], [10, -20], [0, -40], [-10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20], [0, 40], [-10, 20]],
    'RL': [[20, -10], [0, 0], [20, 10], [40, 0], [20, -10]],
    'LR': [[-20, -10], [0, 0], [-20, 10], [-40, 0], [-20, -10]],
}
const MANY = {
    'TB': [[-10, 5], [0, -15], [10, 5]],
    'BT': [[-10, -5], [0, 15], [10, -5]],
    'LR': [[5, -10], [-15, 0], [5, 10]],
    'RL': [[-5, -10], [15, 0], [-5, 10]],
}
const ARROW = {
    'TB': [[-10, -20], [0, 0], [10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20]],
    'LR': [[-20, -10], [0, 0], [-20, 10]],
    'RL': [[20, -10], [0, 0], [20, 10]]
}
const SD_ARROW = {
    'TB': [[-5, -10], [0, 0], [5, -10], [-5, -10]],
    'BT': [[-5, 10], [0, 0], [5, 10], [-5, 10]],
    'LR': [[-10, -5], [0, 0], [-10, 5], [-10, -5]],
    'RL': [[10, -5], [0, 0], [10, 5], [10, -5]],
}

/**
 *@description Gives x1, y1, x2, y2 position of a line for a line icon. For all element pair orientations
 */
const iconLineDirections = (a, b) => ({
    'TB': [-a, -b, a, -b],
    'BT': [-a, b, a, b],
    'LR': [-b, -a, -b, a],
    'RL': [b, -a, b, a],
});
/**
 *@description Gives x, y coordinates and radius of a cricle for a line icon. For all element pair orientations
 */
const iconCircleDirections = (a) => ({
    'TB': [0, -a, 8],
    'BT': [0, a, 8],
    'LR': [-a, 0, 8],
    'RL': [a, 0, 8],
});

/**
 * @description Coordinates for line icons
 * @type {{BT: (number|*)[], LR: (number|*)[], RL: (*|number)[], TB: (number|*)[]}}
 */
const ONE_LINE = iconLineDirections(10, 10);
const TWO_LINE = iconLineDirections(10, 20);
const CIRCLE = iconCircleDirections(25);

//#endregion ===================================================================================
//#region ================================ GLOBAL VARIABLES ====================================

// Data and html building variables
var service = [];
var str = "";
var container;

// Interaction variables - unknown if all are needed
var deltaX = 0, deltaY = 0, startX, startY;
var sscrollx, sscrolly;
var cwidth, cheight;
var deleteBtnX = 0, deleteBtnY = 0;
var deleteBtnSize = 0;
var startWidth;
var startHeight;
var startNodeLeft = false;
var startNodeRight = false;
var startNodeDown = false;
var startNodeUp = false;
var containerStyle;
var lastMousePos = getPoint(0, 0);
var dblPreviousTime = new Date().getTime(); // Used when determining if an element was doubleclicked.
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

// Variables for resizing
var originalWidth = 0;
var originalHeight = 0;
var originalX = 0;
var originalY = 0;
var resizeOverlapping = false;

// Zoom variables
var desiredZoomfact = 1.0;
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;
var zoomOrigo = new Point(0, 0); // Zoom center coordinates relative to origo
var zoomAllowed = true; // To slow down zoom on touchpad.
var lastZoomPos = new Point(0, 0); // placeholder for the previous zoom position relative to the screen (Screen position for previous zoom)
var lastMousePosCoords = new Point(0, 0); // placeholder for the previous mouse coordinates relative to the diagram (Coordinates for the previous zoom)
// We found out that the relation between 0.125 -> 4 and 0.36->-64 looks like an X^2 equation.
// Zoom values for offsetting the mouse cursor positioning
const cursorOffset = new Map([
    [0.25, -15.01],
    [0.5, -3],
    [0.75, -0.775],
    [1.25, 0.36],
    [1.5, 0.555],
    [2, 0.75],
    [4, 0.9375],
]);

// Constants
const textheight = 18;
const strokewidth = 2.0;
const color = {
    WHITE: "#ffffff",
    BLACK: "#000000",
    GREY: "#383737",
    BLUE: "#0000ff",
    YELLOW: "#FFB000",
    ORANGE: "#FE6100",
    PURPLE: "#614875",
    PINK: "#DC267F",
    DENIM: "#648fff",
    SELECTED: "#A000DC",
    LIGHT_BLUE: "#C4E4FC",
    LIGHT_RED: "#FFD4D4",
    LIGHT_YELLOW: "#FFF4C2",
    LIGHT_GREEN: "#C4F8BD",
    LIGHT_PURPLE: "#927B9E",
};
const MENU_COLORS = [
    color.WHITE,
    color.LIGHT_BLUE,
    color.LIGHT_RED,
    color.LIGHT_YELLOW,
    color.LIGHT_GREEN,
    color.DENIM,
    color.PINK,
    color.YELLOW,
    color.ORANGE,
    color.BLUE,
    color.BLACK,
]
const strokeColors = [color.GREY];

var errorActive = false;

// Arrow drawing stuff - diagram elements, diagram lines and labels 
var lineLabelList = [];

// Currently clicked object list
var context = [];
var previousContext = [];
var contextLine = []; // Contains the currently selected line(s).
var previousContextLine = [];
var determinedLines = null; // Last calculated line(s) clicked.
var deltaExceeded = false;
const maxDeltaBeforeExceeded = 2;
var targetElement = null;
var targetElementDiv;
var targetLabel = null;

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

// Sub menu items used in item cycling
const subMenuEntity = [
    elementTypes.EREntity,
    elementTypes.UMLEntity,
    elementTypes.IEEntity,
    elementTypes.SDEntity,
]
const subMenuRelation = [
    elementTypes.ERRelation,
    elementTypes.UMLRelation,
    elementTypes.IERelation,
    elementTypes.ERAttr,
]
const subMenuUMLstate = [
    elementTypes.UMLInitialState,
    elementTypes.UMLFinalState,
    elementTypes.UMLSuperState,
]
const subMenuSequence = [
    elementTypes.sequenceActor,
    elementTypes.sequenceObject,
    elementTypes.sequenceActivation,
    elementTypes.sequenceLoopOrAlt,
]

// All different element types that can be placed by the user.
var elementTypeSelected = elementTypes.EREntity;
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;

//setting the base values for the allowed diagramtypes
var diagramType = {ER: false, UML: false, IE: false, SD: false, SE: false, NOTE: false};

//Grid Settings
var settings = {
    ruler: {
        ZF: 100 * zoomfact,
        zoomX: Math.round(((0 - zoomOrigo.x) * zoomfact) + (1.0 / zoomfact)),
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
var cid = "";
var cvers = "";

var data = []; // List of all elements in diagram
var lines = []; // List of all lines in diagram
var errorData = []; // List of all elements with an error in diagram
var UMLHeight = []; // List with UML Entities' real height
var IEHeight = []; // List with IE Entities' real height
var SDHeight = []; // List with SD Entities' real height

var preResizeHeight = []; // List with elements' and their starting height for box selection due to problems with resizing height
var NOTEHeight = [];// List with NOTE Entities' real height

// Ghost element is used for placing new elements. DO NOT PLACE GHOST ELEMENTS IN DATA ARRAY UNTILL IT IS PRESSED!
var ghostElement = null;
var ghostLine = null;

//#endregion ===================================================================================
//#region ================================ DEFAULTS ============================================

/**
 * @description All default values for element types. These will be applied to new elements created via the construction function ONLY.
 * @see constructElementOfType() For creating new elements with default values.
 */
var defaults = {
    EREntity: {
        name: "Entity",
        kind: "EREntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 50,
        type: "ER",
        state: 'normal',
        attributes: ['-attribute'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 50,
    },
    ERRelation: {
        name: "Relation",
        kind: "ERRelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 90,
        height: 90,
        type: "ER",
        state: 'normal',
        canChangeTo: Object.values(relationType),
        minWidth: 60,
        minHeight: 60,
    },
    ERAttr: {
        name: "Attribute",
        kind: "ERAttr",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 90,
        height: 45,
        type: "ER",
        state: 'normal',
        minWidth: 90,
        minHeight: 45,
    },
    Ghost: {
        name: "Ghost",
        kind: "ERAttr",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 5,
        height: 5,
        type: "ER"
    },
    UMLEntity: {
        name: "Class",
        kind: "UMLEntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "UML",
        attributes: ['-Attribute'],
        functions: ['+Function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    UMLRelation: {
        name: "Inheritance",
        kind: "UMLRelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "UML",
        canChangeTo: Object.values(relationType),
        minWidth: 60,
        minHeight: 60,
    },
    IEEntity: {
        name: "IEEntity",
        kind: "IEEntity",
        stroke: color.BLACK,
        fill: color.WHITE,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "IE",
        attributes: ['-Attribute'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    IERelation: {
        name: "Inheritance",
        kind: "IERelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 50,
        height: 50,
        type: "IE",
        canChangeTo: Object.values(relationType),
        minWidth: 50,
        minHeight: 50,
    }, 
    SDEntity: {
        name: "State",
        kind: "SDEntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "SD",
        attributes: ['do: func'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    UMLInitialState: {
        name: "UML Initial State",
        kind: "UMLInitialState",
        fill: color.BLACK,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "SD",
        canChangeTo: null,
        minWidth: 60,
        minHeight: 60,
    },
    UMLFinalState: {
        name: "UML Final State",
        kind: "UMLFinalState",
        fill: color.BLACK,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "SD",
        canChangeTo: null,
        minWidth: 60,
        minHeight: 60,
    },
    UMLSuperState: {
        name: "UML Super State",
        kind: "UMLSuperState",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 500,
        height: 500,
        type: "SD",
        canChangeTo: null,
        minWidth: 200,
        minHeight: 150,
    }, 
    sequenceActor: {
        name: "name",
        kind: "sequenceActor",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 100,
        height: 150,
        type: "SE",
        canChangeTo: null,
        minWidth: 100,
        minHeight: 100,
    },
    sequenceObject: {
        name: "name",
        kind: "sequenceObject",
        fill: "#FFFFFF",
        stroke: "#000000",
        width: 100,
        height: 150,
        type: "SE",
        canChangeTo: null,
        minWidth: 100,
        minHeight: 50,
    },
    sequenceActivation: {
        name: "Activation",
        kind: "sequenceActivation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 30,
        height: 300,
        type: "SE",
        canChangeTo: null,
        minWidth: 30,
        minHeight: 50,
    },
    sequenceLoopOrAlt: {
        kind: "sequenceLoopOrAlt",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 750,
        height: 300,
        type: "SE",
        alternatives: ["alternative1"],
        altOrLoop: "Alt",
        canChangeTo: null,
        minWidth: 150,
        minHeight: 50,
    }, 
    note: {
        name: "Note",
        kind: "note",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 50,
        type: "NOTE",
        attributes: ['Note'],
        minWidth: 150,
        minHeight: 50,
    },
}

var defaultLine = {kind: "Normal"};

//#endregion ===================================================================================
//#region ================================ INIT AND SETUP ======================================

//an event listener for when the window is loaded, this hides the loading spinner and calls start up functions
window.addEventListener("DOMContentLoaded", () => {
    getData();
    addAlertOnUnload();
    document.getElementById("loadingSpinner").style.display = "none";
});

/**
 * @description Called from getData() when the window is loaded. This will initialize all neccessary data and create elements, setup the state machine and vise versa.
 * @see getData() For the VERY FIRST function called in the file.
 */

// Variables also used in addLine function, allAttrToEntityRelations saves all attributes connected to a entity or relation
var countUsedAttributes = 0;
var allAttrToEntityRelations = [];

// Array for attributes connected with eachother
var attrViaAttrToEnt = [];
var attrViaAttrCounter = 0;

// Global statemachine init, moved from onSetup
stateMachine = new StateMachine(data, lines);

/**
 * @description Very first function that is called when the window is loaded. This will perform initial setup and then call the drawing functions to generate the first frame on the screen.
 */
function getData() {
    container = document.getElementById("container");
    DiagramResponse = fetchDiagram();

    //add event listeners 
    document.getElementById("diagram-toolbar").addEventListener("mousedown", mdown);
    document.getElementById("diagram-toolbar").addEventListener("mouseup", tup);
    document.getElementById("container").addEventListener("mousedown", mdown);
    document.getElementById("container").addEventListener("mouseup", mup);
    document.getElementById("container").addEventListener("mousemove", mmoving);
    document.getElementById("container").addEventListener("wheel", mwheel);
    document.getElementById("options-pane").addEventListener("mousedown", mdown);
    // debugDrawSDEntity(); // <-- debugfunc to show an sd entity
    generateToolTips();
    toggleGrid();
    updateGridPos();
    updateA4Pos();
    updateGridSize();
    showdata();
    drawRulerBars(scrollx, scrolly);
    setContainerStyles(mouseMode);
    generateKeybindList();
    //setPreviewValues();
    saveDiagramBeforeUnload();

    // Setup and show only the first element of each PlacementType, hide the others in dropdown
    // SHOULD BE CHANGED LATER
    togglePlacementType(0, 0)
    togglePlacementType(1, 1)
    togglePlacementType(9, 9)
    togglePlacementType(12, 12)
}

/**
 * @description Used to determine the tools shown depending on diagram type.
 */
function showDiagramTypes() {
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
    } else { // if this type shouldn't be here, hide it entirely
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
    } else {
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
    } else {
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
    } else {
        Array.from(document.getElementsByClassName("SDButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }

    // SE buttons
    if (diagramType.SE) {
        document.getElementById("elementPlacement12").onmousedown = function () {
            holdPlacementButtonDown(0);
        };

        if (firstShown) {
            document.getElementById("elementPlacement12").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    } else {
        Array.from(document.getElementsByClassName("SEButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");

        });
    }
    // NOTE button
    if (diagramType.NOTE) {
        document.getElementById("elementPlacement15").onmousedown = function () {
            holdPlacementButtonDown(0);
        };

        if (firstShown) {
            document.getElementById("elementPlacement15").classList.add("hiddenPlacementType");
        }
        firstShown = true;
    } else {
        Array.from(document.getElementsByClassName("NOTEButton")).forEach(button => {
            button.classList.add("hiddenPlacementType");
        });
    }
}

//#endregion ===================================================================================
//#region ================================ EVENTS ==============================================

// --------------------------------------- Window Events    --------------------------------

document.addEventListener('contextmenu', event => { event.preventDefault(); });

document.addEventListener('keydown', function (e) {
    if (isKeybindValid(e, keybinds.LEFT_CONTROL) && ctrlPressed !== true) ctrlPressed = true;
    if (isKeybindValid(e, keybinds.ALT) && altPressed !== true) altPressed = true;
    if (isKeybindValid(e, keybinds.META) && ctrlPressed !== true) ctrlPressed = true;

    if (isKeybindValid(e, keybinds.ESCAPE) && escPressed != true && settings.replay.active) {
        toggleReplay();
        setReplayRunning(false);
        clearInterval(stateMachine.replayTimer);
    }

    if (isKeybindValid(e, keybinds.ENTER) && /INPUT|SELECT/.test(document.activeElement.nodeName.toUpperCase())) {
        if (!!document.getElementById("lineLabel")) {
            changeLineProperties();
        } else if (document.activeElement.id == "saveDiagramAs") {
            saveDiagramAs();
            hideSavePopout();
        } else {
            let propField = document.getElementById("elementProperty_name");
            changeState();
            saveProperties();
            propField.blur();
        }
    }
    // If the active element in DOM is not an "INPUT" "SELECT" "TEXTAREA"
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) return;

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
        e.preventDefault();
        document.getElementById("mouseMode0").click();
        selectAll();
    }

    if (isKeybindValid(e, keybinds.CENTER_CAMERA)){
        e.preventDefault();
    }

    // Moving object with arrows
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_UP) && !settings.grid.snapToGrid) {
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x, obj.y - 1)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            setPos(context, 0, 1);
        }
        else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_DOWN) && !settings.grid.snapToGrid) {
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x, obj.y + 1)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            setPos(context, 0, -1);
        }
        else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_LEFT) && !settings.grid.snapToGrid) {
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x - 1, obj.y)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            setPos(context, 1, 0);
        }
        else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_RIGHT) && !settings.grid.snapToGrid) {
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x + 1, obj.y)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            setPos(context, -1, 0);
        }
        else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }
});

document.addEventListener('keyup', function (e) {
    var pressedKey = e.key.toLowerCase();

    hidePlacementType();
    // Toggle modifiers when released
    if (pressedKey == keybinds.LEFT_CONTROL.key) ctrlPressed = false;
    if (pressedKey == keybinds.ALT.key) altPressed = false;
    if (pressedKey == keybinds.META.key) {
        setTimeout(() => { ctrlPressed = false; }, 1000);
    }

    // If the active element in DOM is an "INPUT" "SELECT" "TEXTAREA"
    if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.nodeName.toUpperCase())) {
        if (document.activeElement.id == 'elementProperty_name' && isKeybindValid(e, keybinds.ESCAPE)) {
            if (context.length == 1) {
                document.activeElement.value = context[0].name;
                document.activeElement.blur();
                toggleOptionsPane();
            }
        }
        return;
    }
    if (isKeybindValid(e, keybinds.HISTORY_STEPBACK)) toggleStepBack();
    if (isKeybindValid(e, keybinds.HISTORY_STEPFORWARD)) stateMachine.stepForward();
    if (isKeybindValid(e, keybinds.ESCAPE)) {
        escPressed = false; 
        closeModal();
    }
    if (isKeybindValid(e, keybinds.DELETE) || isKeybindValid(e, keybinds.DELETE_B)) {
        if (mouseMode == mouseModes.EDGE_CREATION && context.length != 0) return;
        if (context.length > 0) {
            removeElements(context);
        } else if (contextLine.length > 0) {
            removeLines(contextLine);
        }
        updateSelection(null);
    }
    if (isKeybindValid(e, keybinds.POINTER)) setMouseMode(mouseModes.POINTER);
    if (isKeybindValid(e, keybinds.BOX_SELECTION)) setMouseMode(mouseModes.BOX_SELECTION);
    if (isKeybindValid(e, keybinds.EDGE_CREATION)) {
        setMouseMode(mouseModes.EDGE_CREATION);
        clearContext();
    }

    // Entity / Class / State
    if (isKeybindValid(e, keybinds.PLACE_ENTITY)){
        if (subMenuCycling(subMenuEntity)) return;
        setElementPlacementType(elementTypes.EREntity);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // Relation / Inheritance
    if (isKeybindValid(e, keybinds.PLACE_RELATION)){
        if (subMenuCycling(subMenuRelation)) return;
        setElementPlacementType(elementTypes.ERRelation);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // UML states
    if (isKeybindValid(e, keybinds.STATE_INITIAL)) {
        if (subMenuCycling(subMenuUMLstate)) return;
        setElementPlacementType(elementTypes.UMLInitialState);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // Sequence
    if (isKeybindValid(e, keybinds.SEQ_LIFELINE)) {
        if (subMenuCycling(subMenuSequence)) return;
        setElementPlacementType(elementTypes.sequenceActor);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    if (isKeybindValid(e, keybinds.NOTE_ENTITY)) {
        setElementPlacementType(elementTypes.note);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    if (isKeybindValid(e, keybinds.TOGGLE_A4)) toggleA4Template();
    if (isKeybindValid(e, keybinds.TOGGLE_GRID)) toggleGrid();
    if (isKeybindValid(e, keybinds.TOGGLE_RULER)) toggleRuler();
    if (isKeybindValid(e, keybinds.TOGGLE_SNAPGRID)) toggleSnapToGrid();
    if (isKeybindValid(e, keybinds.TOGGLE_DARKMODE)) toggleDarkmode();
    if (isKeybindValid(e, keybinds.OPTIONS)) toggleOptionsPane();
    if (isKeybindValid(e, keybinds.PASTE)) pasteClipboard(JSON.parse(localStorage.getItem('copiedElements') || "[]"), JSON.parse(localStorage.getItem('copiedLines') || "[]"));
    if (isKeybindValid(e, keybinds.CENTER_CAMERA)) centerCamera();
    if (isKeybindValid(e, keybinds.TOGGLE_REPLAY_MODE)) toggleReplay();
    if (isKeybindValid(e, keybinds.TOGGLE_ER_TABLE)) toggleErTable();
    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM)) showSavePopout();
    //if(isKeybindValid(e, keybinds.TOGGLE_ERROR_CHECK)) toggleErrorCheck(); Note that this functionality has been moved to hideErrorCheck(); because special conditions apply.

    if (isKeybindValid(e, keybinds.COPY)) {
        // Remove the preivous copy-paste data from localstorage.
        if (localStorage.key('copiedElements')) localStorage.removeItem('copiedElements');
        if (localStorage.key('copiedLines')) localStorage.removeItem('copiedLines');

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
        } else {
            displayMessage(messageTypes.SUCCESS, `Clipboard cleared.`);
        }
    }
    if (isKeybindValid(e, keybinds.TOGGLE_KEYBINDLIST)) {
        e.preventDefault();
        toggleKeybindList();
    }
})

window.addEventListener("resize", handleResize);
function handleResize() {
    updateRulers();
}

/**
 * @description Used to update ruler bars on window resize.
 */
function updateRulers() {
    updateContainerBounds();
    drawRulerBars(scrollx, scrolly);
}

window.onfocus = function () {
    altPressed = false;
    ctrlPressed = false;
}

document.addEventListener("mouseleave", function (event) {
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
    if (zoomAllowed) {
        if (event.deltaY < 0) {
            zoomin(event);
        } else {
            zoomout(event);
        }
        zoomAllowed = false;
        setTimeout(function () {
            zoomAllowed = true
        }, 75); // This number decides the time between each zoom tick, in ms.
    }
}

var mouseButtonDown = false;

/**
 * @description Event function triggered when any mouse button is pressed down on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mdown(event) {
    mouseButtonDown = true;

    // Mouse pressed over delete button for multiple elements
    if (event.button == 0) {
        if (context.length > 0 || contextLine.length > 0) {
            hasPressedDelete = checkDeleteBtn();
        }
    }

    // Prevent middle mouse panning when moving an object
    if (event.button == 1) {
        if (movingObject) {
            event.preventDefault();
            return;
        }
    }

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active, set scroll start values
    if (event.button == 1 || settings.replay.active) {
        pointerState = pointerStates.CLICKED_CONTAINER;
        sscrollx = scrollx;
        sscrolly = scrolly;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
        return;
    }

    // If the right mouse button is pressed => return
    if (event.button == 2) return;

    // Check if no element has been clicked or delete button has been pressed.
    if (pointerState != pointerStates.CLICKED_ELEMENT && !hasPressedDelete && !settings.replay.active) {

        // Used when clicking on a line between two elements.
        determinedLines = determineLineSelect(event.clientX, event.clientY);

        // If a line was clicked, determine if the label or line was clicked.
        if (determinedLines) {
            if (determinedLines.id.length == 6) { // LINE
                pointerState = pointerStates.CLICKED_LINE;

                // If double click, open option pane
                if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                    wasDblClicked = true;
                    document.getElementById('optmarker').innerHTML = "&#9650;Options";
                    document.getElementById("options-pane").className = "show-options-pane";
                }
            } else if (determinedLines.id.length > 6) { // LABEL
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
                    } else {
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
                    if (context.length > 0) {
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
            var element = data[findIndex(data, context[0].id)];

            // Save the original properties
            originalWidth = element.width;
            originalHeight = element.height;
            originalX = element.x;
            originalY = element.y;
            
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

    if (!event.target.parentElement.classList.contains("placementTypeBoxIcons")) {
        hidePlacementType();
    }

    dblPreviousTime = new Date().getTime();
    wasDblClicked = false;
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of any element.
 * @param {MouseEvent} event Triggered mouse event.
 */
function ddown(event) {
    // Mouse pressed over delete button for a single line over a element
    if (event.button == 0 && (contextLine.length > 0 || context.length > 0)) {
        hasPressedDelete = checkDeleteBtn();
    }

    // Used when determining time between clicks.
    if ((new Date().getTime() - dblPreviousTime) < dblClickInterval && event.button == 0) {

        wasDblClicked = true; // General purpose bool. True when doubleclick was performed.

        const element = data[findIndex(data, event.currentTarget.id)];
        if (element != null && context.length == 1 && context.includes(element) && contextLine.length == 0) {
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
    if (event.button == 1 || settings.replay.active) return;

    // If the right mouse button is pressed => return
    if (event.button == 2) return;
    if (!hasPressedDelete) {
        switch (mouseMode) {
            case mouseModes.POINTER:
            case mouseModes.BOX_SELECTION:
                startX = event.clientX;
                startY = event.clientY;

                if (!altPressed) {
                    pointerState = pointerStates.CLICKED_ELEMENT;
                    targetElement = event.currentTarget;
                    targetElementDiv = document.getElementById(targetElement.id);
                }
            case mouseModes.EDGE_CREATION:
                if (event.button == 2) return;
                const element = data[findIndex(data, event.currentTarget.id)];
                // If element not in context, update selection on down click
                if (element != null && !context.includes(element)) {
                    pointerState = pointerStates.CLICKED_ELEMENT;
                    updateSelection(element);
                    lastClickedElement = null;
                } else if (element != null) {

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
function mouseMode_onMouseUp(event) {
    if (!hasPressedDelete) {
        switch (mouseMode) {
            case mouseModes.PLACING_ELEMENT:       
                clearContext();
                clearContextLine();
                if (ghostElement && event.button == 0) {
                    addObjectToData(ghostElement, false);

                    // Check if the element to create would overlap others, returns if true
                    if (entityIsOverlapping(ghostElement.id, ghostElement.x, ghostElement.y)) {
                        displayMessage(messageTypes.ERROR, "Error: You can't create elements that overlap eachother.");
                        console.error("Failed to create an element as it overlaps other element(s)")

                        // Remove added element from data as it should remain
                        data.splice(data.length - 1, 1)

                        makeGhost();
                        showdata();
                        return;
                    }

                    //If not overlapping
                    stateMachine.save(StateChangeFactory.ElementCreated(ghostElement), StateChange.ChangeTypes.ELEMENT_CREATED);
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
                    updatepos(0, 0);
                } else if (context.length === 1) {
                    if (event.target.id != "container") {
                        elementTypeSelected = elementTypes.Ghost;
                        makeGhost();
                        // Create ghost line
                        ghostLine = {id: makeRandomID(), fromID: context[0].id, toID: ghostElement.id, kind: "Normal"};
                    } else if (ghostElement !== null) {

                        // create a line from the element to itself
                        addLine(context[0], context[0], "Recursive");
                        clearContext();

                        // Bust the ghosts
                        ghostElement = null;
                        ghostLine = null;

                        showdata();
                        updatepos(0, 0);
                    } else {
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
function tup() {
    mouseButtonDown = false;
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
}

/**
 * @description Event function triggered when any mouse button is released on top of the container. Logic is handled depending on the current pointer state.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */

function mup(event) {
    if (!mouseOverLine && !mouseOverElement) {
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
            if (!deltaExceeded) {
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
            if (lastClickedElement != null && context.includes(lastClickedElement) && !movingObject) {
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
            if (resizeOverlapping) {
                // Reset to original state if overlapping is detected
                var element = data[findIndex(data, context[0].id)];
                element.width = originalWidth;
                element.height = originalHeight;
                element.x = originalX;
                element.y = originalY;
        
                // Update DOM with the original properties
                const elementDOM = document.getElementById(element.id);
                elementDOM.style.width = originalWidth + 'px';
                elementDOM.style.height = originalHeight + 'px';
                elementDOM.style.left = originalX + 'px';
                elementDOM.style.top = originalY + 'px';
                showdata()
                displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
                resizeOverlapping = false;
            }
            break;
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mup()!`);
            break;
    }

    // Update all element positions on the screen
    deltaX = 0;
    deltaY = 0;
    updatepos(0, 0);
    drawRulerBars(scrollx, scrolly);

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;

    disableIfDataEmpty();
}

/**
 * @description change cursor style when mouse hovering over an element.
 */
function mouseEnter() {
    if (!mouseButtonDown && mouseMode != mouseModes.PLACING_ELEMENT) {
        mouseOverElement = true;
        containerStyle.cursor = "pointer";
    }
}

/**
 * @description change cursor style when mouse is hovering over the container.
 */
function mouseLeave() {
    mouseOverElement = false;
    setContainerStyles(mouseMode);
}

/**

 * @description Calculates if any line or label is present on x/y position in pixels.

 * @description Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.
 */
function checkDeleteBtn() {
    if (lastMousePos.x > deleteBtnX && lastMousePos.x < (deleteBtnX + deleteBtnSize) && lastMousePos.y > deleteBtnY && lastMousePos.y < (deleteBtnY + deleteBtnSize)) {
        if (deleteBtnX != 0 && !mouseOverElement) {
            if (context.length > 0) removeElements(context);
            if (contextLine.length > 0) removeLines(contextLine);
        updateSelection();
        return true;
        }
    }
    return false;
}
/**
 *  @description change cursor style if mouse position is over a selection box or the deletebutton.
 */
function mouseOverSelection(mouseX, mouseY) {
    if (context.length > 0 || contextLine.length > 0) {
        // If there is a selection box and mouse position is inside it.
        if (mouseX > selectionBoxLowX && mouseX < selectionBoxHighX && mouseY > selectionBoxLowY && mouseY < selectionBoxHighY) {
            containerStyle.cursor = "pointer";
        }
        // If mouse position is over the delete button.
        else if (mouseX > deleteBtnX && mouseX < (deleteBtnX + deleteBtnSize) && mouseY > deleteBtnY && mouseY < (deleteBtnY + deleteBtnSize)) {
            containerStyle.cursor = "pointer";
        }
        // Not inside selection box, nor over an element or line.
        else if (!mouseOverElement && !mouseOverLine) {
            setContainerStyles(mouseMode);
        }
    }
    // There is no selection box, and mouse position is not over any element or line.
    else if (!mouseOverElement && !mouseOverLine) {
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
 * @description Calculates if any line is present on x/y position in pixels on mouse click.
 * @param {Number} mouseX
 * @param {Number} mouseY
 */
function determineLineSelect(mouseX, mouseY) {
    let currentLineSegment;
    var allLines = getLinesFromBackLayer();
    var bLayerLineIDs = []

    // Current mouse XY
    var cMouse_XY = {
        x: mouseX,
        y: mouseY
    };
    var currentline = {};
    var lineData = {};
    var lineCoeffs = {};
    var highestX, lowestX, highestY, lowestY;
    var lineWasHit = false;
    var labelWasHit = false;

    // Position and radius of the circle hitbox that is used when 
    var circleHitBox = {
        pos_x: cMouse_XY.x, // Mouse pos X.
        pos_y: cMouse_XY.y, // Mouse pos Y.
        radius: 10 // This will determine the error margin, "how far away from the line we can click and still select it". Higer val = higher margin.
    }

    for (let i = 0; i < allLines.length; i++) {
        // Copy the IDs.
        bLayerLineIDs[i] = allLines[i].id;

        // Make sure that "double lines" have the same id.
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-1/gi, '');
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-2/gi, '');

        var hasPoints = allLines[i].getAttribute('points'); // If line has attribute point (polyline)

        if (hasPoints != null) {

            var points = hasPoints.split(' '); // Split points attribute in pairs
            // Get the points in polyline
            for (let j = 0; j < points.length - 1; j++) {
                currentLineSegment = {
                    x1: Number(points[j].split(',')[0]),
                    x2: Number(points[j + 1].split(',')[0]),
                    y1: Number(points[j].split(',')[1]),
                    y2: Number(points[j + 1].split(',')[1])
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
                    c: ((currentLineSegment.x1 - currentLineSegment.x2) * currentLineSegment.y1 + (currentLineSegment.y2 - currentLineSegment.y1) * currentLineSegment.x1)
                }
                lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);

                if (lineWasHit == true && labelWasHit == false) {
                    // Return the current line that registered as a "hit".;
                    return lines.filter(function (line) {
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
            c: ((currentline.x1 - currentline.x2) * currentline.y1 + (currentline.y2 - currentline.y1) * currentline.x1)
        }
        if (document.getElementById(bLayerLineIDs[i] + "Label")) {
            var centerPoint = {
                x: lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].centerX + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].labelMovedX + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].displacementX,
                y: lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].centerY + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].labelMovedY + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].displacementY
            }
            var labelWidth = lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].width;
            var labelHeight = lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].height;
            labelWasHit = didClickLabel(centerPoint, labelWidth, labelHeight, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius);
        }

        // Determines if a line was clicked
        lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);
        // --- Used when debugging ---
        // Creates a circle with the same position and radius as the hitbox of the circle being sampled with.
        // document.getElementById("svgoverlay").innerHTML += '<circle cx="'+ circleHitBox.pos_x + '" cy="'+ circleHitBox.pos_y+ '" r="' + circleHitBox.radius + '" stroke='${color.BLACK}' stroke-width="3" fill="red" /> '
        // ---------------------------
        if (lineWasHit == true && labelWasHit == false) {
            // Return the current line that registered as a "hit".
            return lines.filter(function (line) {
                return line.id == bLayerLineIDs[i];
            })[0];
        } else if (labelWasHit == true) {
            return lineLabelList.filter(function (label) {
                return label.id == bLayerLineIDs[i] + "Label";
            })[0];
        }
    }
    return null;
}

/**
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if any line was clicked.
 */
function didClickLine(a, b, c, circle_x, circle_y, circle_radius, line_data) {
    // Distance between line and circle center.
    var distance = (Math.abs(a * circle_x + b * circle_y + c)) / Math.sqrt(a * a + b * b);

    // Adding and subtracting with the circle radius to allow for bigger margin of error when clicking.
    // Check if we are clicking withing the span.
    return ((circle_x < (line_data.hX + circle_radius)) &&
        (circle_x > (line_data.lX - circle_radius)) &&
        (circle_y < (line_data.hY + circle_radius)) &&
        (circle_y > (line_data.lY - circle_radius)) &&
        (circle_radius >= distance)); // Check if circle radius >= distance. (If so is the case, the line is intersecting the circle)
}

/**
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if a label was clicked.
 */
function didClickLabel(c, lw, lh, circle_x, circle_y, circle_radius) {
    // Adding and subtracting with the circle radius to allow for bigger margin of error when clicking.
    // Check if we are clicking withing the span.
    return (circle_x < (c.x + lw / 2 + circle_radius)) &&
        (circle_x > (c.x - lw / 2 - circle_radius)) &&
        (circle_y < (c.y + lh / 2 + circle_radius)) &&
        (circle_y > (c.y - lh / 2 - circle_radius));
}

/**
 * @description Called on mouse moving if no pointer state has blocked the event in mmoving()-function.
 */
function mouseMode_onMouseMove(event) {
    mouseOverLine = determineLineSelect(event.clientX, event.clientY);

    // Change cursor style if mouse pointer is over a line.
    if (mouseOverLine && !mouseButtonDown) {
        containerStyle.cursor = "pointer";
    } else if (!mouseOverElement) {
        setContainerStyles(mouseMode);
    }
    switch (mouseMode) {
        case mouseModes.EDGE_CREATION:
            mouseOverSelection(event.clientX, event.clientY); // This case defaults to mouseModes.PLACING_ELEMENT, however the effect this method provides is currently only for EDGE_CREATION
        case mouseModes.PLACING_ELEMENT:
            if (ghostElement) {
                var cords = screenToDiagramCoordinates(event.clientX, event.clientY);

                // If not in EDGE_CREATION AND in snap to grid, calculate the closest snap-point
                if (settings.grid.snapToGrid && mouseMode != mouseModes.EDGE_CREATION) {
                    ghostElement.x = Math.round(cords.x / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.width / 2);
                    ghostElement.y = Math.round(cords.y / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.height / 2);
                } else {
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
            break;
    }
}

/**
 * @description Event function triggered when the mouse has moved on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mmoving(event) {
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
            drawRulerBars(scrollx, scrolly);

            calculateDeltaExceeded();
            break;
        case pointerState.CLICKED_LINE:

            if (mouseMode == mouseModes.BOX_SELECTION) {
                calculateDeltaExceeded();
                mouseMode_onMouseMove(mouseMode);
            }
            break;
        case pointerStates.CLICKED_LABEL:
            updateLabelPos(event.clientX, event.clientY);
            updatepos(null, null);
            break;
        case pointerStates.CLICKED_ELEMENT:
            if (mouseMode != mouseModes.EDGE_CREATION) {

                var prevTargetPos = {
                    x: data[findIndex(data, targetElement.id)].x,
                    y: data[findIndex(data, targetElement.id)].y
                }
                var targetPos = {
                    x: 1 * targetElementDiv.style.left.substring(0, targetElementDiv.style.left.length - 2),
                    y: 1 * targetElementDiv.style.top.substring(0, targetElementDiv.style.top.length - 2)
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

            var minWidth = elementData.minWidth; // Declare the minimal with of an object
            var minHeight = elementData.minHeight; // Declare the minimal height of an object

            // Sets different min-values for ERRelation
            if (elementData.kind === "ERRelation") {
                minHeight = 60;
                minWidth = 60; 
            }

            deltaX = startX - event.clientX;

            if (elementData.kind == elementTypesNames.UMLEntity ||
                elementData.kind == elementTypesNames.IEEntity ||
                elementData.kind == elementTypesNames.SDEntity) { // Declare the minimal height of an object
                minHeight = 0;
            }

            deltaY = startY - event.clientY;

            // Functionality for the four different nodes
            if (startNodeLeft && (startWidth + (deltaX / zoomfact)) > minWidth) {
                // Fetch original width
                let tmp = elementData.width;
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
                let tmp = elementData.width;
                elementData.width = (startWidth - (deltaX / zoomfact));

                // Remove the new width, giving us the total change
                const widthChange = -(tmp - elementData.width);

                // Right node will never change the position of the element. We pass 0 as x and y movement.
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], widthChange, 0), StateChange.ChangeTypes.ELEMENT_RESIZED);
            } else if (startNodeDown && (startHeight - (deltaY / zoomfact)) > minHeight) {
                // Fetch original height
                let tmp = elementData.height;
                elementData.height = (startHeight - (deltaY / zoomfact));

                // Deduct the new height, giving us the total change
                const heightChange = -(tmp - elementData.height);

                // Adds a deep clone of the element to preResizeHeight if it isn't in it
                let foundID = false;
                if (preResizeHeight == undefined) {
                    let resizedElement = structuredClone(elementData);
                    preResizeHeight.push(resizedElement);
                } else {
                    for (let i = 0; i < preResizeHeight.length; i++) {
                        if (elementData.id == preResizeHeight[i].id) {
                            foundID = true;
                        }
                    }
                    if (!foundID) {
                        let resizedElement = structuredClone(elementData);
                        preResizeHeight.push(resizedElement);
                    }
                }
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], 0, heightChange), StateChange.ChangeTypes.ELEMENT_RESIZED);
            } else if (startNodeUp && (startHeight + (deltaY / zoomfact)) > minHeight) {
                // Fetch original height
                let tmp = elementData.height;
                elementData.height = (startHeight + (deltaY / zoomfact));

                // Deduct the new height, giving us the total change
                const heightChange = -(tmp - elementData.height);

                // Fetch original y-position
                // "+ 14" hardcoded, for some reason the superstate jumps up 14 pixels when using this node.
                tmp = elementData.y;
                elementData.y = screenToDiagramCoordinates(0, (startY - deltaY + 14)).y;

                // Deduct the new position, giving us the total change
                const yChange = -(tmp - elementData.y);

                // Adds a deep clone of the element to preResizeHeight if it isn't in it
                let foundID = false;
                if (preResizeHeight == undefined) {
                    let resizedElement = structuredClone(elementData);
                    preResizeHeight.push(resizedElement);
                } else {
                    for (let i = 0; i < preResizeHeight.length; i++) {
                        if (elementData.id == preResizeHeight[i].id) {
                            foundID = true;
                        }
                    }
                    if (!foundID) {
                        let resizedElement = structuredClone(elementData);
                        preResizeHeight.push(resizedElement);
                    }
                }
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], 0, yChange, 0, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            }
            document.getElementById(context[0].id).remove();
            document.getElementById("container").innerHTML += drawElement(data[index]);

            // Check if entity is overlapping
            resizeOverlapping = entityIsOverlapping(context[0].id, elementData.x, elementData.y)

            // Update element in DOM
            const elementDOM = document.getElementById(context[0].id);
            elementDOM.style.width = elementData.width + 'px';
            elementDOM.style.height = elementData.height + 'px';
            elementDOM.style.left = elementData.x + 'px';
            elementDOM.style.top = elementData.y + 'px';
            showdata()
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
function makeRandomID() {
    var str = "";
    var characters = 'ABCDEF0123456789';
    var charactersLength = characters.length;
    while (true) {
        for (let i = 0; i < 6; i++) {
            str += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        if (!settings.misc.randomidArray) { //always add first id
            settings.misc.randomidArray.push(str);
            return str;
        } else {
            //if check is true the id already exists
            if (settings.misc.randomidArray.includes(str)) {
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
function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

/**
 * @description Adds an object to the data array of elements.
 * @param {Object} object Element to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToData(object, stateMachineShouldSave = true) {
    data.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.ElementCreated(object), StateChange.ChangeTypes.ELEMENT_CREATED);
}

/**
 * @description Adds a line to the data array of lines.
 * @param {Object} object Line to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToLines(object, stateMachineShouldSave = true) {
    lines.push(object);
    if (stateMachineShouldSave) stateMachine.save(StateChangeFactory.LineAdded(object), StateChange.ChangeTypes.LINE_CREATED);
}

/**
 * @description Attempts removing all elements passed through the elementArray argument. Passed argument will be sanitized to ensure it ONLY contains real elements that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.
 * @param {Array<Object>} elementArray List of all elements that should be deleted.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function removeElements(elementArray, stateMachineShouldSave = true) {
    // Find all lines that should be deleted first
    var linesToRemove = [];
    var elementsToRemove = [];

    for (let i = 0; i < elementArray.length; i++) { // Find VALID items to remove
        linesToRemove = linesToRemove.concat(lines.filter(function (line) {
            return line.fromID == elementArray[i].id || line.toID == elementArray[i].id;
        }));
        elementsToRemove = elementsToRemove.concat(data.filter(function (element) {
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

        data = data.filter(function (element) { // Delete elements
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
function removeLines(linesArray, stateMachineShouldSave = true) {
    var anyRemoved = false;

    // Removes from the two arrays that keep track of the attributes connections. 
    for (let i = 0; i < linesArray.length; i++) {
        for (let j = 0; j < allAttrToEntityRelations.length; j++) {
            if (linesArray[i].toID == allAttrToEntityRelations[j] || linesArray[i].fromID == allAttrToEntityRelations[j]) {
                allAttrToEntityRelations.splice(j, 1);
                countUsedAttributes--;
            }
        }
        for (let k = 0; k < attrViaAttrToEnt.length; k++) {
            if (linesArray[i].toID == attrViaAttrToEnt[k] || linesArray[i].fromID == attrViaAttrToEnt[k]) {
                attrViaAttrToEnt.splice(k, 1);
                attrViaAttrCounter--;
            }
        }

        lines = lines.filter(function (line) {
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
 * @description Generatesa a new ghost element that is used for visual feedback to the end user when creating new elements and/or lines. Setting ghostElement to null will remove the ghost element.
 * @see ghostElement
 */
function makeGhost() {
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
function constructElementOfType(type) {
    let typeName = undefined;
    let newElement = undefined;
    for (const name in elementTypes) {
        if (elementTypes[name] == type) {
            typeName = name;
            break;
        }
    }
    if (typeName) {
        let defaultElement = defaults[typeName];
        newElement = {};
        for (const property in defaultElement) {
            newElement[property] = defaultElement[property];
        }
    }
    return newElement;
}

/**
 * @description Returns all the lines (all sides) from given element.
 * @param {Element} element
 * @returns {array} result
 */
function getElementLines(element) {
    return element.bottom.concat(element.right, element.top, element.left);
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
function changeState() {
    const element = context[0],
        oldType = element.type,
        newType = document.getElementById("typeSelect")?.value || undefined;
    var oldRelation = element.state;
    var newRelation = document.getElementById("propertySelect")?.value || undefined;

    // If we are changing types and the element has lines, we should not change
    if (oldType !== newType && newType !== undefined && oldType !== undefined && elementHasLines(element)) {
        displayMessage("error", `
            Can't change type from \"${oldType}\" to \"${newType}\" as
            different diagrams should not be able to connect to each other.`
        )
        return;
        // If we are changing to the same type, (simply pressed save without changes), do nothing.
    } else if (oldType == newType && oldRelation == newRelation) {
        return;
    } else if (element.type == entityType.ER) {
        //If not attribute, also save the current type and check if kind also should be updated
        if (element.kind != elementTypesNames.ERAttr) {
            if (oldType != newType) {
                let newKind = element.kind;
                newKind = newKind.replace(oldType, newType);
                element.kind = newKind;
                stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
            }
            if (newType != undefined) {
                element.type = newType;
                stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
            }
        }
        let property = document.getElementById("propertySelect").value;
        element.state = property;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {state: property}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else if (element.type == entityType.UML) {
        //Save the current property if not an UML or IE entity since niether entities does have variants.
        if (element.kind != elementTypesNames.UMLEntity) {
            let property = document.getElementById("propertySelect").value;
            element.state = property;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {state: property}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (oldType != newType) {
            let newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (newType != undefined) {
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }

    } else if (element.type == entityType.IE) {
        //Save the current property if not an UML or IE entity since niether entities does have variants.
        if (element.kind != elementTypesNames.IEEntity) {
            let property = document.getElementById("propertySelect").value;
            element.state = property;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {state: property}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (oldType != newType) {
            let newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (newType != undefined) {
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    } else if (element.type == entityType.SD) {
        if (oldType != newType) {
            let newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (newType != undefined) {
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    } else if (element.type == entityType.SE) {
        if (oldType != newType) {
            let newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (newType != undefined) {
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    } else if (element.type == 'NOTE') {
        if (oldType != newType) {
            let newKind = element.kind;
            newKind = newKind.replace(oldType, newType);
            element.kind = newKind;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {kind: newKind}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (newType != undefined) {
            element.type = newType;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(element.id, {type: newType}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    displayMessage(messageTypes.SUCCESS, "Sucessfully saved");
}

/**
 * @description Triggered on pressing the SAVE-button inside the options panel. This will apply all changes to the select element and will store the changes into the state machine.
 */
function saveProperties() {
    const propSet = document.getElementById("propertyFieldset");
    const element = context[0];
    const children = propSet.children;

    var propsChanged = {};
    let formatArr;

    for (let index = 0; index < children.length; index++) {
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
                formatArr = [];
                for (let i = 0; i < arrElementAttr.length; i++) {
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
                formatArr = [];
                for (let i = 0; i < arrElementFunc.length; i++) {
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
    updatepos(0, 0);
}

/**
 * Applies new changes to line attributes in the data array of lines.
 */
function changeLineProperties() {
    // Set lineKind
    var radio1 = document.getElementById("lineRadio1");
    var radio2 = document.getElementById("lineRadio2");
    var radio3 = document.getElementById("lineRadio3");
    var radio4 = document.getElementById("lineRadio4");
    var label = document.getElementById("lineLabel");
    var startLabel = document.getElementById("lineStartLabel");
    var endLabel = document.getElementById("lineEndLabel");
    var startIcon = document.getElementById("lineStartIcon");
    var endIcon = document.getElementById("lineEndIcon");
    var lineType = document.getElementById("lineType");
    var line = contextLine[0];

    if (radio1 != null && radio1.checked && line.kind != radio1.value) {
        line.kind = radio1.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {kind: radio1.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        displayMessage(messageTypes.SUCCESS, 'Successfully saved');
    } else if (radio2 != null && radio2.checked && line.kind != radio2.value) {
        line.kind = radio2.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {kind: radio2.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        displayMessage(messageTypes.SUCCESS, 'Successfully saved');
    } else if (radio3 != null && radio3.checked && line.kind != radio3.value) {
        line.kind = radio3.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {kind: radio3.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        displayMessage(messageTypes.SUCCESS, 'Successfully saved');
    } else if (radio4 != null && radio4.checked && line.kind != radio4.value) {
        line.kind = radio4.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {kind: radio4.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        displayMessage(messageTypes.SUCCESS, 'Successfully saved');
    }
    // Check if this element exists
    if (!!document.getElementById('propertyCardinality')) {
        // Change line - cardinality
        var cardinalityInputValue = document.getElementById('propertyCardinality').value;

        if (line.cardinality != undefined && cardinalityInputValue == "") {
            delete line.cardinality;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {cardinality: undefined}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        } else if (line.cardinality != cardinalityInputValue && cardinalityInputValue != "") {
            line.cardinality = cardinalityInputValue;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {cardinality: cardinalityInputValue}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }

    if (line.label != label.value) {
        label.value = label.value.trim();
        line.label = label.value
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {label: label.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    }
    // UML or IE line
    if ((line.type == entityType.UML) || (line.type == entityType.IE)) {
        // Start label, near side
        if (line.startLabel != startLabel.value) {
            startLabel.value = startLabel.value.trim();
            line.startLabel = startLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {startLabel: startLabel.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        // End label, opposite side
        if (line.endLabel != endLabel.value) {
            endLabel.value = endLabel.value.trim();
            line.endLabel = endLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {endLabel: endLabel.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.startIcon != startIcon.value) {
            line.startIcon = startIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {startIcon: startIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.endIcon != endIcon.value) {
            line.endIcon = endIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {endIcon: endIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    //NOTE line
    if (line.type == 'NOTE') {
        // Start label, near side
        if (line.startLabel != startLabel.value) {
            startLabel.value = startLabel.value.trim();
            line.startLabel = startLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {startLabel: startLabel.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        // End label, opposite side
        if (line.endLabel != endLabel.value) {
            endLabel.value = endLabel.value.trim();
            line.endLabel = endLabel.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {endLabel: endLabel.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.startIcon != startIcon.value) {
            line.startIcon = startIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {startIcon: startIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.endIcon != endIcon.value) {
            line.endIcon = endIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {endIcon: endIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    // SD line
    if (line.type == entityType.SD) {
        if (line.innerType != lineType.value) {
            lineType.value = lineType.value.trim();
            line.innerType = lineType.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {innerType: lineType.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.startIcon != startIcon.value) {
            line.startIcon = startIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {startIcon: startIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
        if (line.endIcon != endIcon.value) {
            line.endIcon = endIcon.value
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {endIcon: endIcon.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        }
    }
    showdata();
}

/**
 * @description Updates what line(s) are selected.
 * @param {Object} selectedLine Line that has been selected.
 */
function updateSelectedLine(selectedLine) {
    // This function works almost exaclty as updateSelection but for lines instead.

    // If CTRL is pressed and an element is selected
    if (selectedLine != null && ctrlPressed) {
        if (!contextLine.includes(selectedLine)) {
            contextLine.push(selectedLine);
        } else {    //If element is already selcted
            contextLine = contextLine.filter(function (line) {
                return line !== selectedLine;
            });
        }
        // If ALT is pressed while selecting a line -> deselects that line
    } else if (selectedLine != null && altPressed) {
        if (contextLine.includes(selectedLine)) {
            contextLine = contextLine.filter(function (line) {
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
    } else if (!altPressed && !ctrlPressed) {
        contextLine = [];
    }
    generateContextProperties();
}

/**
 * @description Updates the current selection of elements depending on what buttons are down. Context array may have the new element added or removed from the context array, have the context array replaced with only the new element or simply have the array emptied.
 * @param {Object} ctxelement Element that has was clicked or null. A null value will DESELECT all elements, emptying the entire context array.
 */
function updateSelection(ctxelement) {
    // If CTRL is pressed and an element is selected
    if (ctrlPressed && ctxelement != null) {
        // The element is not already selected
        if (!context.includes(ctxelement)) {
            context.push(ctxelement);
            showdata();
            clearContext();
        } else {
            context = context.filter(function (element) {
                return element !== ctxelement;
            });
        }
        // The element is already selected
    } else if (altPressed && ctxelement != null) {
        if (context.includes(ctxelement)) {
            context = context.filter(function (element) {
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
function selectAll() {
    context = data;
    contextLine = lines;
    generateContextProperties();
    showdata();
}

/**
 * Places a copy of all elements into the data array centered around the current mouse position.
 * @param {Array<Object>} elements List of all elements to paste into the data array.
 */
function pasteClipboard(elements, elementsLines) {

    // If elements does is empty, display error and return null
    if (elements.length == 0) {
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
    // For every line that shall be copied, create a temp object, for kind and connection tracking
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
function clearGhosts() {
    ghostElement = null;
    ghostLine = null;
}

/**
 * @description Empties the context array of all selected elements.
 */
function clearContext() {
    if (context != null) {
        context = [];
        generateContextProperties();
    }
}

/**
 * @description Empties the context array of all selected lines.
 */
function clearContextLine() {
    if (contextLine != null) {
        contextLine = [];
        generateContextProperties();
    }
}

//#endregion ===================================================================================
//#region ================================ HELPER FUNCTIONS ====================================

/**
 * @description Converst a position in screen pixels into coordinates of the array.
 * @param {Number} mouseX Pixel position in the x-axis.
 * @param {Number} mouseY Pixel position in the y-axis.
 * @returns {Point} Point containing the calculated coordinates.
 */
function screenToDiagramCoordinates(mouseX, mouseY) {
    // I guess this should be something that could be calculated with an expression but after 2 days we still cannot figure it out.
    let zoom = cursorOffset.get(zoomfact) ?? 0;

    return new Point(
        Math.round(mouseX / zoomfact - scrollx + zoom * scrollx + 2 + zoomOrigo.x), // the 2 makes mouse hover over container
        Math.round(mouseY / zoomfact - scrolly + zoom * scrolly + zoomOrigo.y)
    );
}

/**
 * @description Test weither an enum object contains a certain property value.
 * @param {*} value The value that the enumObject is tested for.
 * @param {Object} enumObject The enum object containing all possible values.
 * @returns {Boolean} Returns TRUE if an enum contains the tested value
 */
function enumContainsPropertyValue(value, enumObject) {
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
 * @description Creates a new rectangle from an element.
 * @param {Object} element Element with a x,y,width and height propery.
 * @returns
 */
function getRectFromElement(element) {
    // Corrects returned y position due to problems with resizing vertically
    for (let i = 0; i < preResizeHeight.length; i++) {
        if (element.id == preResizeHeight[i].id) {
            let resizedY = element.y;
            if (preResizeHeight[i].height < element.height) {
                resizedY += (element.height - preResizeHeight[i].height) / 2
            }
            // Corrects returned y position due to problems with SE types
            
            let elementY = resizedY;
            if (element.type == entityType.SE) {
                elementY += preResizeHeight[i].height / 3;
            }

            return {
                x: element.x,
                y: elementY,
                width: element.width,
                height: element.height
            };
        }
    }

    // Corrects returned y position due to problems with resizing vertically
    let elementY = element.y;
    if (element.type == entityType.SE) {
        elementY += element.height / 3;
    }
    return {
        x: element.x,
        y: elementY,
        width: element.width,
        height: element.height,
    };
}

/**
 * @description Change the coordinates of data-objects
 * @param {Array<Object>} objects Array of objects that will be moved
 * @param {Number} x Coordinates along the x-axis to move
 * @param {Number} y Coordinates along the y-axis to move
 */
function setPos(objects, x, y) {
    var idList = [];
    var overlappingObject = null;

    // Check for overlaps
    objects.forEach(obj => {
        if (entityIsOverlapping(obj.id, obj.x - deltaX / zoomfact, obj.y - deltaY / zoomfact)) {
            overlappingObject = obj;
        }
    });

    if (overlappingObject) {
        // If overlap is detected, move the overlapping object back by one step
        var previousX = overlappingObject.x;
        var previousY = overlappingObject.y;

        // Move the object back one step 
        overlappingObject.x -= (x / zoomfact);
        overlappingObject.y -= (y / zoomfact);

        // Check again if the adjusted position still overlaps
        if (entityIsOverlapping(overlappingObject.id, overlappingObject.x, overlappingObject.y)) {
            // If it still overlaps, revert to the previous position
            overlappingObject.x = previousX;
            overlappingObject.y = previousY;

            // Display error message
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        } else {
            // If no longer overlaps after adjustment, proceed with saving the new position
            idList.push(overlappingObject.id);
        }
    } else {
        objects.forEach(obj => {
            if (obj.isLocked) return;
            if (settings.grid.snapToGrid) {
                if (!ctrlPressed) {
                    //Different snap points for entity and others
                    if (obj.kind == elementTypesNames.EREntity) {
                        // Calculate nearest snap point
                        obj.x = Math.round((obj.x - (x * (1.0 / zoomfact)) + (settings.grid.gridSize * 2)) / settings.grid.gridSize) * settings.grid.gridSize;
                        obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;
                    } else {
                        obj.x = Math.round((obj.x - (x * (1.0 / zoomfact)) + (settings.grid.gridSize)) / settings.grid.gridSize) * settings.grid.gridSize;
                        obj.y = Math.round((obj.y - (y * (1.0 / zoomfact))) / (settings.grid.gridSize * 0.5)) * (settings.grid.gridSize * 0.5);
                    }
                    // Set the new snap point to center of element
                    obj.x -= obj.width / 2;
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

    // Update positions
    updatepos(0, 0);
}

function findUMLEntityFromLine(lineObj) {
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.UMLEntity).kind) {
        return -1;
    } else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.UMLEntity).kind) {
        return 1;
    }
    return null;
}

function findUMLInheritanceFromLine(lineObj) {
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.UMLRelation).kind) {
        return -1;
    } else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.UMLRelation).kind) {
        return 1;
    }
    return null;
}

function findEntityFromLine(lineObj) {
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.EREntity).kind) {
        return -1;
    } else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.EREntity).kind) {
        return 1;
    }
    return null;
}

function findAttributeFromLine(lineObj) {
    if (data[findIndex(data, lineObj.fromID)].kind == constructElementOfType(elementTypes.ERAttr).kind) {
        return -1;
    } else if (data[findIndex(data, lineObj.toID)].kind == constructElementOfType(elementTypes.ERAttr).kind) {
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

function entityIsOverlapping(id, x, y) {
    let isOverlapping = false;
    const foundIndex = findIndex(data, id);
    if (foundIndex > -1) {
        const element = data[foundIndex];
        let targetX;
        let targetY;
        var elementHeight = element.height;

        // Change height if element is an UML Entity
        for (let i = 0; i < UMLHeight.length; i++) {
            if (element.id == UMLHeight[i].id) {
                elementHeight = UMLHeight[i].height;
            }
        }
        // Change height if element is an IE Entity
        for (let i = 0; i < IEHeight.length; i++) {
            if (element.id == IEHeight[i].id) {
                elementHeight = IEHeight[i].height;
            }
        }
        // Change height if element is an SD Entity
        for (let i = 0; i < SDHeight.length; i++) {
            if (element.id == SDHeight[i].id) {
                elementHeight = SDHeight[i].height;
            }
        }

        for (let i = 0; i < NOTEHeight.length; i++) {
            if (element.id == NOTEHeight[i].id) {
                elementHeight = NOTEHeight[i].height;
            }
        }
        targetX = x //(x / zoomfact);
        targetY = y//(y / zoomfact);

        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id) continue

            // Doesn't compare if the other element is moving
            var compare = true;
            if (context.length > 1) {
                for (let j = 0; j < context.length; j++) {
                    if (data[i].id == context[j].id && !data[i].isLocked) {
                        compare = false;
                        break;
                    }
                }
            }
            if (compare) {
                //COMPARED ELEMENT
                const compX2 = data[i].x + data[i].width;
                var compY2 = data[i].y + data[i].height;

                // Change height if element is an UML Entity
                for (let j = 0; j < UMLHeight.length; j++) {
                    if (data[i].id == UMLHeight[j].id) {
                        compY2 = data[i].y + UMLHeight[j].height;
                    }
                }
                // Change height if element is an IE Entity
                for (let j = 0; j < IEHeight.length; j++) {
                    if (data[i].id == IEHeight[j].id) {
                        compY2 = data[i].y + IEHeight[j].height;
                    }
                }
                // Change height if element is an SD Entity
                for (let j = 0; j < SDHeight.length; j++) {
                    if (data[i].id == SDHeight[j].id) {
                        compY2 = data[i].y + SDHeight[j].height;
                    }
                }
                //if its overlapping with a super state, just break since that is allowed.
                if (data[i].kind == elementTypesNames.UMLSuperState || element.kind == elementTypesNames.UMLSuperState) {
                    isOverlapping = false;
                }
                //if its overlapping with a sequence actor, just break since that is allowed.
                else if ((data[i].kind == elementTypesNames.sequenceActor || element.kind == elementTypesNames.sequenceActor) || 
                    (data[i].kind == elementTypesNames.sequenceObject || element.kind == elementTypesNames.sequenceObject) ||
                    (data[i].kind == elementTypesNames.sequenceLoopOrAlt || element.kind == elementTypesNames.sequenceLoopOrAlt)) 
                {
                    isOverlapping = false;
                } else if ((targetX < compX2) && (targetX + element.width) > data[i].x &&
                    (targetY < compY2) && (targetY + elementHeight) > data[i].y) {
                    isOverlapping = true;
                    break;
                }
            }
        }
        return isOverlapping;
    }
}

/**
 * @description Cycles to the next item in a submenu when the same keybind is pressed again.
 * @param {Array} subMenu What sub menu array to get elementType from
 */
function subMenuCycling(subMenu) {
    // Cycle through sub menu items
    if (mouseMode == mouseModes.PLACING_ELEMENT && subMenu.includes(elementTypeSelected)) {
        for (let i = 0; i < subMenu.length; i++) {
            if (elementTypeSelected == subMenu[i]) {
                setElementPlacementType(subMenu[(i+1) % subMenu.length]);
                setMouseMode(mouseModes.PLACING_ELEMENT);
                break;
            }
        }
        return true;
    }
}

//#endregion =====================================================================================
//#region ================================ MOUSE MODE FUNCS ======================================

/**
 * @description Changes the current mouse mode using argument enum value.
 * @param {mouseModes} mode What mouse mode to change into.
 * @see mouseModes For all available enum values.
 */
function setMouseMode(mode) {
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
function setContainerStyles(cursorMode = mouseModes.POINTER) {
    containerStyle = document.getElementById("container").style;

    switch (cursorMode) {
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
function onMouseModeEnabled() {
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
            updatepos(0, 0);
            break;
        case mouseModes.BOX_SELECTION:
            break;
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeEnabled()!`);
            break;
    }
}

/**
 * @description Function triggered just BEFORE the current mouse mode is changed.
 */
function onMouseModeDisabled() {
    // Remove all "active" classes in nav bar
    var navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
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
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeDisabled()!`);
            break;
    }
}

function calculateDeltaExceeded() {
    // Remember that mouse has moved out of starting bounds
    if ((deltaX >= maxDeltaBeforeExceeded ||
            deltaX <= -maxDeltaBeforeExceeded) ||
        (deltaY >= maxDeltaBeforeExceeded ||
            deltaY <= -maxDeltaBeforeExceeded)
    ) {
        deltaExceeded = true;
    }
}

// --------------------------------------- Box Selection    --------------------------------
// Returns all elements within the coordinate box
function getElementsInsideCoordinateBox(selectionRect) {
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
function getLinesInsideCoordinateBox(selectionRect) {
    var allLines = document.getElementById("svgbacklayer").children;
    var tempLines = [];
    var bLayerLineIDs = [];
    for (let i = 0; i < allLines.length; i++) {
        if (lineIsInsideRect(selectionRect, allLines[i])) {
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
function lineIsInsideRect(selectionRect, line) {
    let lineCoord1 = screenToDiagramCoordinates(
        line.getAttribute("x1"),
        line.getAttribute("y1")
    );
    let lineCoord2 = screenToDiagramCoordinates(
        line.getAttribute("x2"),
        line.getAttribute("y2")
    );
    let lineLeftX = Math.min(lineCoord1.x, lineCoord2.x);
    let lineTopY = Math.min(lineCoord1.y, lineCoord2.y);
    let lineRightX = Math.max(lineCoord1.x, lineCoord2.x);
    let lineBottomY = Math.max(lineCoord1.y, lineCoord2.y);
    let leftX = selectionRect.x;
    let topY = selectionRect.y;
    let rightX = selectionRect.x + selectionRect.width;
    let bottomY = selectionRect.y + selectionRect.height;
    return leftX <= lineLeftX && topY <= lineTopY && rightX >= lineRightX && bottomY >= lineBottomY;
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
function intersectsBox(selectionRect, line) {
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

    // Check intersection with the individual sides of the rect
    let left = intersectsLine(x1, y1, x2, y2, leftX, topY, leftX, bottomY);
    let right = intersectsLine(x1, y1, x2, y2, rightX, topY, rightX, bottomY);
    let top = intersectsLine(x1, y1, x2, y2, leftX, topY, rightX, topY);
    let bottom = intersectsLine(x1, y1, x2, y2, leftX, bottomY, rightX, bottomY);

    // return true if the line intersects with any of the sides
    return left || right || top || bottom;
}

/**
 * @description Checks if a line intersects with another line
 * @param {Number} xy x1 - y2 are for the first line and the rest are for the second line
 * @returns {Boolean} Returns true if lines intersect, else false
 */
function intersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calc line direction
    var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
        ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
        ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are within the interval 0-1, the lines are intersecting
    return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

function getBoxSelectionPoints() {
    return {
        n1: getPoint(startX, startY),
        n2: getPoint(startX + deltaX, startY),
        n3: getPoint(startX, startY + deltaY),
        n4: getPoint(startX + deltaX, startY + deltaY),
    };
}

function getBoxSelectionCoordinates() {
    return {
        n1: screenToDiagramCoordinates(startX, startY),
        n2: screenToDiagramCoordinates(startX + deltaX, startY),
        n3: screenToDiagramCoordinates(startX, startY + deltaY),
        n4: screenToDiagramCoordinates(startX + deltaX, startY + deltaY),
    };
}

// User has initiated a box selection
function boxSelect_Start(mouseX, mouseY) {
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

function boxSelect_Update(mouseX, mouseY) {
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

        let rect = getRectFromPoints(topLeft, bottomRight);

        if (ctrlPressed) {
            let markedEntities = getElementsInsideCoordinateBox(rect);

            // Remove entity from markedEntities if it was already marked.
            markedEntities = markedEntities.filter(entity => !previousContext.includes(entity));

            let markedLines = getLinesInsideCoordinateBox(rect);
            markedLines = markedLines.filter(line => !previousContextLine.includes(line));

            clearContext();
            context = context.concat(markedEntities);
            context = context.concat(previousContext);

            clearContextLine();
            contextLine = contextLine.concat(markedLines);
            contextLine = contextLine.concat(previousContextLine);
        } else if (altPressed) {
            let markedEntities = getElementsInsideCoordinateBox(rect);
            // Remove entity from previous context if the element is marked
            previousContext = previousContext.filter(entity => !markedEntities.includes(entity));

            let markedLines = getLinesInsideCoordinateBox(rect);
            previousContextLine = previousContextLine.filter(line => !markedLines.includes(line));

            context = [];
            context = previousContext;
            clearContextLine();
            contextLine = previousContextLine;
        } else {
            context = getElementsInsideCoordinateBox(rect);
            contextLine = getLinesInsideCoordinateBox(rect);
        }
    }
}

function boxSelect_End() {
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = false;
}

function boxSelect_Draw(str) {
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
        str += `<line class='boxSelectionLines' x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke-width='${strokeWidth}' />`;
        str += `<line class='boxSelectionLines' x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke-width='${strokeWidth}' />`;

        str += `<line class='boxSelectionLines' x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke-width='${strokeWidth}' />`;
        str += `<line class='boxSelectionLines' x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke-width='${strokeWidth}' />`;
    }
    return str;
}

//#endregion =====================================================================================
//#region ================================ GUI ===================================================

/**
 * @description Generates the string that contains the current State Diagram info.
 * @returns Connected State Diagram in the form of a string.
 */
function generateStateDiagramInfo() {
    const ENTITY = 0, SEEN = 1, LABEL = 2;
    const stateInitial = [];
    const stateFinal = [];
    const stateSuper = [];
    const stateElements = [];
    const stateLines = [];
    const queue = [];
    let output = "";
    let re = new RegExp("\\[.+\\]");
    // Picks out the lines of type "State Diagram" and place it in its local array.
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].type == entityType.SD) {
            stateLines.push(lines[i]);
        }
    }

    // Picks out the entities related to State Diagrams and place them in their local arrays.
    for (let i = 0; i < data.length; i++) {
        if (data[i].kind == elementTypesNames.SDEntity) {
            stateElements.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLInitialState) {
            stateInitial.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLFinalState) {
            stateFinal.push([data[i], true]);
        } else if (data[i].kind == elementTypesNames.UMLSuperState) {
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
                for (let j = 0; j < stateElements.length; j++) {
                    if (stateLines[i].toID == stateElements[j][ENTITY].id) {
                        stateElements[j][LABEL] = stateLines[i].label;
                        connections.push(stateElements[j]);
                    }
                }
                for (let j = 0; j < stateFinal.length; j++) {
                    if (stateLines[i].toID == stateFinal[j][ENTITY].id) {
                        stateFinal[j][LABEL] = stateLines[i].label;
                        connections.push(stateFinal[j]);
                    }
                }
                for (let j = 0; j < stateSuper.length; j++) {
                    if (stateLines[i].toID == stateSuper[j][ENTITY].id) {
                        stateSuper[j][LABEL] = stateLines[i].label;
                        connections.push(stateSuper[j]);
                    }
                }
            }
        }
        // Add any connected entity to the output string, and if it has not been "seen" it is added to the queue.
        for (let i = 0; i < connections.length; i++) {
            if (connections[i][LABEL] == undefined) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}"</p>`;
            } else if (re.test(connections[i][LABEL])) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with guard "${connections[i][LABEL]}"</p>`;
            } else {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with label "${connections[i][LABEL]}"</p>`;
            }
            if (connections[i][SEEN] === false) {
                connections[i][SEEN] = true;
                queue.push(connections[i]);
            }
        }
    }
    // Adds additional information in the view.
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
function toggleDiagramDropdown() {
    const dropdown = document.getElementById("diagramTypeDropdown");
    const load = document.getElementById("diagramLoad");
    const btn = document.getElementById("diagramDropDownToggle");

    if (window.getComputedStyle(dropdown).display === "none") {
        load.style.display = "block";
        dropdown.style.display = "block";
    } else {
        load.style.display = "none";
        dropdown.style.display = "none";
    }

    document.getElementById("diagramDropDownToggle").classList.toggle("active");

    if (window.getComputedStyle(dropdown).display === "none") {
        btn.style.backgroundColor = "transparent";
        btn.style.border = `3px solid ${color.PURPLE}`;
        btn.style.color = color.PURPLE;
        btn.style.fontWeight = "bold";
    } else {
        btn.style.backgroundColor = color.PURPLE;
        btn.style.color = color.WHITE;
        btn.style.fontWeight = "normal";
        btn.style.border = `3px solid ${color.PURPLE}`;
    }
}

/**
 * @description Change the state in replay-mode with the slider
 * @param {Number} sliderValue The value of the slider
 */
function changeReplayState(sliderValue) {
    var timestampKeys = Object.keys(settings.replay.timestamps);

    // If the last timestamp is selected, goto the last state in the diagram.
    if (timestampKeys.length - 1 == sliderValue) {
        stateMachine.scrubHistory(stateMachine.historyLog.length - 1);
    } else stateMachine.scrubHistory(timestampKeys[sliderValue + 1] - 1);
}

/**
 * @description Toggles stepforward in history.
 */
function toggleStepForward() {
    stateMachine.stepForward();
}

/**
 * @description Toggles stepbackwards in history.
 */
function toggleStepBack() {
    stateMachine.stepBack();
}

/**
 * @description Toggles the movement of elements ON/OFF.
 */
function toggleEntityLocked() {
    var ids = []
    var lockbtn = document.getElementById("lockbtn");
    var locked = true;
    for (let i = 0; i < context.length; i++) {
        if (!context[i].isLocked) {
            locked = false;
            break;
        }
    }
    for (let i = 0; i < context.length; i++) {
        if (!locked) {
            context[i].isLocked = true;
            lockbtn.value = "Unlock";
        } else {
            context[i].isLocked = false;
            lockbtn.value = "Lock";
        }
        ids.push(context[i].id);
    }
    stateMachine.save(StateChangeFactory.ElementAttributesChanged(ids, {isLocked: !locked}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    showdata();
    updatepos(0, 0);
}

/**
 * @description Toggles the visual background grid ON/OFF.
 */
function toggleGrid() {
    var grid = document.getElementById("svggrid");
    var gridButton = document.getElementById("gridToggle");

    // Toggle active class on button
    document.getElementById("gridToggle").classList.toggle("active");

    // Toggle active grid + color change of button to clarify if button is pressed or not
    if (grid.style.display == "block") {
        grid.style.display = "none";
        gridButton.style.backgroundColor = "transparent";
        gridButton.style.border = `3px solid ${color.PURPLE}`;
        gridButton.style.color = color.PURPLE;
        gridButton.style.fontWeight = "bold";
    } else {
        grid.style.display = "block";
        gridButton.style.backgroundColor = color.PURPLE;
        gridButton.style.color = color.WHITE;
        gridButton.style.fontWeight = "normal";
        gridButton.style.border = `3px solid ${color.PURPLE}`;
    }
}

/**
 * @description Toggles the darkmode for svgbacklayer ON/OFF.
 */
function toggleDarkmode() {
    const stylesheet = document.getElementById("themeBlack");
    const storedTheme = localStorage.getItem('diagramTheme');
    const btn = document.getElementById("darkmodeToggle");

    if (storedTheme) stylesheet.href = storedTheme;

    if (stylesheet.href.includes('blackTheme')) {
        // if it's dark -> go light
        stylesheet.href = "../Shared/css/style.css";
        localStorage.setItem('diagramTheme', stylesheet.href)
    } else if (stylesheet.href.includes('style')) {
        // if it's light -> go dark
        stylesheet.href = "../Shared/css/blackTheme.css";
        localStorage.setItem('diagramTheme', stylesheet.href)
    }
    if (stylesheet.href.includes('blackTheme')) {
        btn.style.backgroundColor = color.PURPLE;
        btn.style.color = color.WHITE;
        btn.style.fontWeight = "normal";
        btn.style.border = `3px solid ${color.PURPLE}`;
    } else {
        btn.style.backgroundColor = "transparent";
        btn.style.border = `3px solid ${color.PURPLE}`;
        btn.style.color = color.PURPLE;
        btn.style.fontWeight = "bold";
    }
    showdata();
    toggleBorderOfElements();
}


/**
 * @description When diagram page is loaded, check if preferred theme is stored in local storage.
 */
document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.getElementById("themeBlack");
    if (localStorage.getItem("diagramTheme")) stylesheet.href = localStorage.getItem("diagramTheme");
})

/**
 * @description Toggles the replay-mode, shows replay-panel, hides unused elements
 */
function toggleReplay() {
    // If there is no history => display error and return
    if (stateMachine.historyLog.length == 0) {
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
        settings.replay.timestamps = {0: 0}; // Clear the array with all timestamp.

        stateMachine.historyLog.forEach(historyEntry => {
            var lastKeyIndex = Object.keys(settings.replay.timestamps).length - 1;
            var lastKey = Object.keys(settings.replay.timestamps)[lastKeyIndex];
            if (settings.replay.timestamps[lastKey] != historyEntry.time) {
                settings.replay.timestamps[stateMachine.historyLog.indexOf(historyEntry)] = historyEntry.time
            }
        });
        // Change the sliders max to historyLogs length
        document.getElementById("replay-range").setAttribute("max", (Object.keys(settings.replay.timestamps).length - 1).toString());

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
function toggleKeybindList() {
    const element = document.getElementById("markdownKeybinds");
    if (element.style.display == "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}


/** @description Gives the exit button its intended functionality to exit out of replay-mode */
function exitReplayMode() {
    toggleReplay();
    setReplayRunning(false);
    clearInterval(stateMachine.replayTimer);
}

/**
 * @description Sets the replay-delay value
 */
function setReplayDelay(value) {
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
function setReplayRunning(state) {
    var button = document.getElementById("diagram-replay-switch");
    var stateSlider = document.getElementById("replay-range");

    if (state) {
        button.innerHTML = '<div class="diagramIcons" onclick="clearInterval(stateMachine.replayTimer);setReplayRunning(false)"><img src="../Shared/icons/pause.svg" alt="Pause"><span class="toolTipText" style="top: -80px;"><b>Pause</b><br><p>Pause history of changes made to the diagram</p><br></span></div>';
        stateSlider.disabled = true;
    } else {
        button.innerHTML = '<div class="diagramIcons" onclick="stateMachine.replay()"><img src="../Shared/icons/Play.svg" alt="Play"><span class="toolTipText" style="top: -80px;"><b>Play</b><br><p>Play history of changes made to the diagram</p><br></span></div>';
        stateSlider.disabled = false;
    }
}

/**
 * @description Toggles the ER-table for the diagram in the "Options side-bar" on/off.
 */
function toggleErTable() {
    // Remove all "active" classes in nav bar
    var navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }
    // Add the diagramActive to current diagramIcon
    document.getElementById("erTableToggle").classList.add("active");

    if (erTableToggle == false) {
        erTableToggle = true;
        testCaseToggle = false;
    } else if (erTableToggle == true) {
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
function toggleTestCase() {
    // Remove all "active" classes in nav bar
    var navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }
    // Add the diagramActive to current diagramIcon
    document.getElementById("testCaseToggle").classList.add("active");

    if (testCaseToggle == false) {
        testCaseToggle = true;
        erTableToggle = false;
    } else if (testCaseToggle == true) {
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
function generateErTableString() {
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

    // Sort the data[] elements into entity-, attr- and relationList
    for (let i = 0; i < data.length; i++) {

        if (data[i].kind == elementTypesNames.EREntity) {
            entityList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERAttr) {
            attrList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERRelation) {
            relationList.push(data[i]);
        }
    }
    //For each relation in relationList
    for (let i = 0; i < relationList.length; i++) {
        //List containing relation-element and connected entities
        var currentRelationList = [];
        currentRelationList.push(relationList[i]);
        //Sort all lines that are connected to the current relation into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            //Get connected line from element
            if (relationList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (relationList[i].id == lines[j].toID) { //Get connected line to element
                lineList.push(lines[j]);
            }
        }

        //Identify every connected entity to relations
        for (let j = 0; j < lineList.length; j++) {
            for (let k = 0; k < entityList.length; k++) {
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
    for (let i = 0; i < entityList.length; i++) {
        var currentRow = [entityList[i]];
        //Sort all lines that are connected to the current entity into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            if (entityList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (entityList[i].id == lines[j].toID) {
                lineList.push(lines[j]);
            }
        }
        // Identify all attributes that are connected to the current entity by using lineList[] and store them in currentEntityAttrList. Save their ID's in idList.
        var currentEntityAttrList = [];
        var idList = [];
        for (let j = 0; j < lineList.length; j++) {
            for (let h = 0; h < attrList.length; h++) {
                if (attrList[h].id == lineList[j].fromID || attrList[h].id == lineList[j].toID) {
                    currentEntityAttrList.push(attrList[h]);
                    currentRow.push(attrList[h]);
                    idList.push(attrList[h].id);
                }
            }
        }
        var parentAttribeList = []; //list of parent attributes

        for (let j = 0; j < currentEntityAttrList.length; j++) {
            //For each attribute connected to the current entity, identify if other attributes are connected to themselves.
            var attrLineList = [];
            for (let h = 0; h < lines.length; h++) {
                //If there is a line to/from the attribute that ISN'T connected to the current entity, save it in attrLineList[].
                if ((currentEntityAttrList[j].id == lines[h].toID ||
                        currentEntityAttrList[j].id == lines[h].fromID) &&
                    (lines[h].toID != entityList[i].id && lines[h].fromID != entityList[i].id)
                ) {
                    attrLineList.push(lines[h]);
                }
            }

            //Compare each line in attrLineList to each attribute.
            for (let h = 0; h < attrLineList.length; h++) {
                for (let k = 0; k < attrList.length; k++) {
                    //If ID matches the current attribute AND another attribute, try pushing the other attribute to currentEntityAttrList[]
                    if (((attrLineList[h].fromID == attrList[k].id) && (attrLineList[h].toID == currentEntityAttrList[j].id)) || ((attrLineList[h].toID == attrList[k].id) && (attrLineList[h].fromID == currentEntityAttrList[j].id))) {
                        //Iterate over saved IDs
                        var hits = 0;
                        for (let p = 0; p < idList.length; p++) {
                            //If the ID of the attribute already exists, then increase hits and break the loop.
                            if (idList[p] == attrList[k].id) {
                                hits++;
                                break;
                            }
                        }
                        //If no hits, then push the attribute to currentEntityAttrList[] (so it will also be checked for additional attributes in future iterations) and save the ID.
                        if (hits == 0) {
                            // looking if the parent attribute is in the parentAttributeList 
                            if (findIndex(parentAttribeList, currentEntityAttrList[j].id) == -1) {
                                parentAttribeList.push(currentEntityAttrList[j]);
                                currentEntityAttrList[j].newKeyName = "";
                            }
                            if (currentEntityAttrList[j].newKeyName == "") {
                                currentEntityAttrList[j].newKeyName += attrList[k].name;
                            } else {
                                currentEntityAttrList[j].newKeyName += " " + attrList[k].name;
                            }
                            if (currentEntityAttrList[j].state != 'primary' &&
                                currentEntityAttrList[j].state != 'candidate'
                            ) {
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
    for (let i = 0; i < strongEntityList.length; i++) {
        var visitedList = []; // A list which contains entities that has been vistited in this codeblock
        var queue = []; // Queue for each entity's relation
        queue.push(strongEntityList[i][0]); // Push in the current entity
        // Loop while queue isn't empty
        while (queue.length > 0) {
            var current = queue.shift(); // Get current entity by removing first entity in queue
            // For current entity, iterate through every relation
            for (let j = 0; j < ERRelationData.length; j++) {
                // Check if relation is valid, (relation, entity1, entity2)
                if (ERRelationData[j].length >= 3) {
                    if (ERRelationData[j][0].state == 'weak') {
                        var visited = false;    // Boolean representing if the current entity has already been visited
                        for (let v = 0; v < visitedList.length; v++) {
                            if (current.id == visitedList[v].id) {
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
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    // Iterate through key list
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
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
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
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
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[l][1].length; m++) {
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
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][1][0].id == visitedList[v].id) {//|| ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[i][1].length; m++) {
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
    for (let i = 0; i < weakEntityList.length; i++) {
        var row = []; // New formatted weak entity row
        row.push(weakEntityList[i][0]); // Push in weak entity, as usual, [0] is entity
        row.push([]); // Push in empty list to contain the keys
        // In the weak entity's key list, iterate and check if current is an array
        for (let j = 0; j < weakEntityList[i][1].length; j++) {
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
                        for (let k = 0; k < temp.length - 1; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                        queue.push(temp[temp.length - 1]); // Push in list into queue
                    } else {
                        //Iterate through the list, push every attribute
                        for (let k = 0; k < temp.length; k++) {
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
        for (let j = 0; j < weakEntityList[i].length; j++) {
            // If not array, check if normal or multivalued
            if (!Array.isArray(weakEntityList[i][j])) {
                if (weakEntityList[i][j].state == 'normal') {
                    row.push(weakEntityList[i][j]);
                } else if (weakEntityList[i][j].state == 'multiple') {
                    row.push(weakEntityList[i][j]);
                }
            }
        }
        tempWeakList.push(row);
    }
    weakEntityList = tempWeakList; // Update the values in the weakEntity list

    var allEntityList = strongEntityList.concat(weakEntityList); // Add the two list together

    //Iterate through all relations
    for (let i = 0; i < ERRelationData.length; i++) {
        if (ERRelationData[i].length >= 3) {
            var foreign = []; // Array with entities foreign keys
            // Case 1, two strong entities in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { //MANY to ONE relation, key from the ONE is foreign for MANY, case 1
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push(ERRelationData[i][1][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 2, two weak entities in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { // ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { // MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') { // MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 3, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 4, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
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
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
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
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
        }
    }
    // Iterate and add each entity's foreign attribute to the correct place
    for (let i = 0; i < ERForeignData.length; i++) {
        // Iterate throught all entities
        for (let j = 0; j < allEntityList.length; j++) {
            // Check if correct entity were found
            if (ERForeignData[i][0].id == allEntityList[j][0].id) {
                var row = [];
                // Push in every foreign attribute
                for (let k = 1; k < ERForeignData[i].length; k++) {
                    row.push(ERForeignData[i][k]); // Push in entity
                }
                allEntityList[j].push(row); // Push in list
            }
        }
    }
    // Actual creating the string. Step one, strong / normal entities
    for (let i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'normal') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            var existPrimary = false; // Determine if a primary key exist
            // ITerate and determine if primary keys are present
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (allEntityList[i][1][j].state == 'primary') {
                    existPrimary = true;
                    break;
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                // Print only primary keys if at least one is present
                if (existPrimary) {
                    if (allEntityList[i][1][j].state == 'primary') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
                //Print only candidate keys if no primary keys are present
                if (!existPrimary) {
                    if (allEntityList[i][1][j].state == 'candidate') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            if (allEntityList[i][j].newKeyName == undefined) {
                                currentString += `${allEntityList[i][j].name}, `;
                            }
                        }
                    }
                }
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            } else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    for (let i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'weak') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (!Array.isArray(allEntityList[i][1][j])) {
                    // Print only weakKeys
                    if (allEntityList[i][1][j].state == 'weakKey') {
                        currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                    }
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (Array.isArray(allEntityList[i][1][j])) {
                    currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
                    for (let k = 0; k < allEntityList[i][1][j].length; k++) {
                        currentString += `${allEntityList[i][1][j][k].name}`;
                    }
                    currentString += `</span>, `;
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
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
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            } else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    // Iterate through ERForeignData to find many to many relation
    for (let i = 0; i < ERForeignData.length; i++) {
        // If relation is exist in ERForeignData
        if (ERForeignData[i][0].kind == elementTypesNames.ERRelation) {
            var currentString = '';
            currentString += `<p>${ERForeignData[i][0].name} (`; // Push in relation's name
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add left side of relation
            for (let j = 0; j < ERForeignData[i][1].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][1][j])) {
                    for (let l = 0; l < ERForeignData[i][1][j].length; l++) {
                        currentString += `${ERForeignData[i][1][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][1][j].name}`;
                }
            }
            currentString += `</span>, `;
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add right side of relation
            for (let j = 0; j < ERForeignData[i][2].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][2][j])) {
                    for (let l = 0; l < ERForeignData[i][2][j].length; l++) {
                        currentString += `${ERForeignData[i][2][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][2][j].name}`;
                }
            }
            currentString += `</span>`;
            currentString += `)</p>`;
            stringList.push(currentString)
        }
    }
    // Adding multi-valued attributes to the string
    for (let i = 0; i < allEntityList.length; i++) {
        for (let j = 2; j < allEntityList[i].length; j++) {
            // Write out multi attributes
            if (allEntityList[i][j].state == 'multiple') {
                // add the multiple attribute as relation
                var multipleString = `<p>${allEntityList[i][j].name}( <span style='text-decoration:underline black solid 2px'>`;
                // add keys from the entity the multiple attribute belongs to
                for (let k = 0; k < allEntityList[i][1].length; k++) {
                    // add the entity the key comes from in the begining of the string
                    multipleString += `${allEntityList[i][0].name}`;
                    // If element is array, aka strong key for weak entity
                    if (Array.isArray(allEntityList[i][1][k])) {
                        for (let l = 0; l < allEntityList[i][1][k].length; l++) {
                            multipleString += `${allEntityList[i][1][k][l].name}`;
                        }
                    } else {
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
    for (let i = 0; i < stringList.length; i++) {
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
function formatERStrongEntities(ERData) {
    var temp = []; // The formated list of strong/normal entities 
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'normal') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (primary, candidate and weakKey)
            // Pushing in weak keys last to ensure that the first key in a strong/normal entity isn't weak
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }
            }
            // Pushing in remaining multivalued attributes
            for (let j = 1; j < ERData[i].length; j++) {
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
function formatERWeakEntities(ERData) {
    var temp = []; // The formated list of weak entities 
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'weak') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (weakKey, primary and candidate)
            // Pushing in weak keys first to ensure that the first key in a weak entity is weak
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }
            }
            // Pushing in remaining multivalued attributes
            for (let j = 1; j < ERData[i].length; j++) {
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
function toggleA4Template() {
    var template = document.getElementById("a4Template");

    // Toggle active class on button
    document.getElementById("a4TemplateToggle").classList.toggle("active");

    if (template.style.display == "block") {
        template.style.display = "none";
        document.getElementById("a4VerticalButton").style.display = "none";
        document.getElementById("a4HorizontalButton").style.display = "none";
        document.getElementById("a4TemplateToggle").style.backgroundColor = "transparent";
        document.getElementById("a4TemplateToggle").style.border = `3px solid ${color.PURPLE}`;
        document.getElementById("a4TemplateToggle").style.color = color.PURPLE;
        document.getElementById("a4TemplateToggle").style.fontWeight = "bold";
    } else {
        template.style.display = "block";
        document.getElementById("a4VerticalButton").style.display = "inline-block";
        document.getElementById("a4HorizontalButton").style.display = "inline-block";
        document.getElementById("a4TemplateToggle").style.backgroundColor = color.PURPLE;
        document.getElementById("a4TemplateToggle").style.color = color.WHITE;
        document.getElementById("a4TemplateToggle").style.fontWeight = "normal";
        document.getElementById("a4TemplateToggle").style.border = `3px solid ${color.PURPLE}`;
    }
    generateContextProperties();
}

/**
 * @description turns the error checking functionality on/off
 */
function toggleErrorCheck() {
    // Inverts the errorActive variable to true or false
    errorActive = !errorActive;
    if (errorActive) {
        document.getElementById("errorCheckToggle").classList.add("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is on.');
    } else {
        document.getElementById("errorCheckToggle").classList.remove("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is off.');
    }
    showdata();
}

/**
 * @description hides the error check button when not allowed
 */
function hideErrorCheck(show) {
    if (show) {
        document.getElementById("errorCheckField").style.display = "flex";
        // Enables error check by pressing 'h', only when error check button is visible
        document.addEventListener("keyup", event => {
            if (event.key === 'h') {
                toggleErrorCheck();
            }
        });
    } else {
        document.getElementById("errorCheckField").style.display = "none";
    }
}

function setA4SizeFactor(e) {
    //store 1 + increased procent amount
    settings.grid.a4SizeFactor = parseInt(e.target.value) / 100;
    updateA4Size();
}

function toggleA4Horizontal() {
    document.getElementById("vRect").style.display = "block";
    if (document.getElementById("a4Rect").style.display == "block") {
        document.getElementById("a4Rect").style.display = "none";
    }
}

function toggleA4Vertical() {
    document.getElementById("a4Rect").style.display = "block";
    if (document.getElementById("vRect").style.display == "block") {
        document.getElementById("vRect").style.display = "none";
    }
}

/**
 * @description Toggles weither the snap-to-grid logic should be active or not. The GUI button will also be flipped.
 */
function toggleSnapToGrid() {
    // Toggle active class on button
    document.getElementById("rulerSnapToGrid").classList.toggle("active");

    // Toggle the boolean
    settings.grid.snapToGrid = !settings.grid.snapToGrid;

    // Color change of button to clarify if button is pressed or not
    if (settings.grid.snapToGrid) {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = color.PURPLE;
        document.getElementById("rulerSnapToGrid").style.color = color.WHITE;
        document.getElementById("rulerSnapToGrid").style.fontWeight = "normal";
        document.getElementById("rulerSnapToGrid").style.border = `3px solid ${color.PURPLE}`;
    } else {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = "transparent";
        document.getElementById("rulerSnapToGrid").style.border = `3px solid ${color.PURPLE}`;
        document.getElementById("rulerSnapToGrid").style.color = color.PURPLE;
        document.getElementById("rulerSnapToGrid").style.fontWeight = "bold";
    }
}

/**
 * @description Toggles weither the ruler is visible or not for the end user.
 */
function toggleRuler() {
    var ruler = document.getElementById("rulerOverlay");
    var rulerToggleButton = document.getElementById("rulerToggle");

    // Toggle active class on button
    document.getElementById("rulerToggle").classList.toggle("active");

    // Toggle active ruler + color change of button to clarify if button is pressed or not
    if (settings.ruler.isRulerActive) {
        ruler.style.left = "-100px";
        ruler.style.top = "-100px";
        rulerToggleButton.style.backgroundColor = "transparent";
        rulerToggleButton.style.border = `3px solid ${color.PURPLE}`;
        rulerToggleButton.style.color = color.PURPLE;
        rulerToggleButton.style.fontWeight = "bold";
    } else {
        ruler.style.left = "50px";
        ruler.style.top = "0px";
        rulerToggleButton.style.backgroundColor = color.PURPLE;
        rulerToggleButton.style.color = color.WHITE;
        rulerToggleButton.style.fontWeight = "normal";
        rulerToggleButton.style.border = `3px solid ${color.PURPLE}`;
    }
    settings.ruler.isRulerActive = !settings.ruler.isRulerActive;
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Changes what element will be constructed on next constructElementOfType call.
 * @param {Number} type What kind of element to place.
 * @see constructElementOfType
 */
function setElementPlacementType(type = elementTypes.EREntity) {
    elementTypeSelected = type;
}

//<-- UML functionality start

/**
 * @description Function to open a subtoolbar when pressing down on a button for a certan period of time
 */
function holdPlacementButtonDown(num) {
    mousePressed = true;
    if (document.getElementById("togglePlacementTypeBox" + num).classList.contains("activeTogglePlacementTypeBox")) {
        mousePressed = false;
        togglePlacementTypeBox(num);
    }
    setTimeout(() => {
        if (!!mousePressed) {
            togglePlacementTypeBox(num);
        }
    }, 500);
}

/**
 * @description resets the mousepress.
 */
function holdPlacementButtonUp() {
    mousePressed = false;
}

/**
 * @description toggles the box containing different types of placement entitys.
 * @param {Number} num the number connected to the element selected.
 */
function togglePlacementTypeBox(num) {
    if (!document.getElementById("togglePlacementTypeButton" + num).classList.contains("activeTogglePlacementTypeButton")) {
        for (let index = 0; index < document.getElementsByClassName("togglePlacementTypeButton").length; index++) {
            if (document.getElementsByClassName("togglePlacementTypeButton")[index].classList.contains("activeTogglePlacementTypeButton")) {
                document.getElementsByClassName("togglePlacementTypeButton")[index].classList.remove("activeTogglePlacementTypeButton");
            }
            if (document.getElementsByClassName("togglePlacementTypeBox")[index].classList.contains("activeTogglePlacementTypeBox")) {
                document.getElementsByClassName("togglePlacementTypeBox")[index].classList.remove("activeTogglePlacementTypeBox");
            }
        }
        document.getElementById("togglePlacementTypeButton" + num).classList.add("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox" + num).classList.add("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement" + num).children.item(1).classList.remove("toolTipText");
        document.getElementById("elementPlacement" + num).children.item(1).classList.add("hiddenToolTiptext");
    } else {
        document.getElementById("elementPlacement" + num).children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement" + num).children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton" + num).classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox" + num).classList.remove("activeTogglePlacementTypeBox");
    }
}

/**
 * @description toggles which entity placement type is selected for the different types of diagrams.
 * @param {Number} num the number connected to the element selected.
 * @param {Number} type the type of element selected. (which pop-out we are referring to)
 */
function togglePlacementType(num, type) {
    if (type == 0) {
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
    } else if (type == 1) {
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
        document.getElementById("elementPlacement2").classList.add("hiddenPlacementType"); // ER ATTR START
        document.getElementById("elementPlacement2").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement2").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton2").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox2").classList.remove("activeTogglePlacementTypeBox"); // ER ATTR END
    } else if (type == 9) {
        document.getElementById("elementPlacement9").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement9").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement9").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton9").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox9").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement10").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement10").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement10").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton10").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox10").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement11").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement11").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement11").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton11").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox11").classList.remove("activeTogglePlacementTypeBox");
    } else if (type == 12) {
        // Sequence lifeline (actor)
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
        // Sequence condition/loop object
        document.getElementById("elementPlacement14").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement14").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement14").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton14").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox14").classList.remove("activeTogglePlacementTypeBox");
        // Sequence lifeline (object)
        document.getElementById("elementPlacement16").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement16").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement16").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton16").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox16").classList.remove("activeTogglePlacementTypeBox");

    }
    // Unhide the currently selected placement type
    document.getElementById("elementPlacement" + num).classList.remove("hiddenPlacementType");
}//<-- UML functionality end

function hidePlacementType(){
    let i = 0;

    while (true) {
        if (document.getElementById("togglePlacementTypeBox" + i)) {
            document.getElementById("togglePlacementTypeBox" + i).classList.remove("activeTogglePlacementTypeBox");
        } else if (document.getElementById("togglePlacementTypeBox" + i) == null && document.getElementById("togglePlacementTypeButton" + (i + 1)) == null) {
            break;
        }
        i++;
    }
}

/**
 * @description Increases the current zoom level if not already at maximum. This will magnify all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom towards the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event.
 */
function zoomin(scrollEvent = undefined) {
    let delta;
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent) {
        if (zoomfact < 4) {
            var midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

            delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
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
    } else if (zoomfact < 4.0) { // ELSE zoom towards mouseCoordinates
        var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

        if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
            delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
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
        } else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.
            zoomOrigo.x = lastMousePosCoords.x;
            zoomOrigo.y = lastMousePosCoords.y;
        }
    }
    //Update scroll variables to match the new zoomfact
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    switch (zoomfact) {
        case 0.25:
            zoomfact = 0.5;
            break;
        case 0.5:
            zoomfact = 0.75;
            break;
        case 0.75:
            zoomfact = 1.0;
            break;
        case 1.0:
            zoomfact = 1.25;
            break;
        case 1.25:
            zoomfact = 1.5;
            break;
        case 1.5:
            zoomfact = 2.0;
            break;
        case 2.0:
            zoomfact = 4.0;
    }
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    updateGridSize();
    updateA4Size();
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Decreases the current zoom level if not already at minimum. This will shrink all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom away from the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event.
 */
function zoomout(scrollEvent = undefined) {
    let delta;
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent) {
        if (zoomfact > 0.25) {
            var midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

            delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
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
    } else if (zoomfact > 0.25) { // ELSE zoom towards mouseCoordinates
        var mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

        if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
            delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
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
        } else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.
            zoomOrigo.x = lastMousePosCoords.x;
            zoomOrigo.y = lastMousePosCoords.y;
        }
    }
    //Update scroll variables to match the new zoomfact
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    switch (zoomfact) {
        case 0.5:
            zoomfact = 0.25;
            break;
        case 0.75:
            zoomfact = 0.5;
            break;
        case 1.0:
            zoomfact = 0.75;
            break;
        case 1.25:
            zoomfact = 1.0;
            break;
        case 1.5:
            zoomfact = 1.25;
            break;
        case 2.0:
            zoomfact = 1.5;
            break;
        case 4.0:
            zoomfact = 2.0;
    }
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    updateGridSize();
    updateA4Size();
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Decreases or increases the zoomfactor to its original value zoomfactor = 1.0.
 */
function zoomreset() {
    var midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

    let delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
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
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Zooms to desiredZoomfactor from center of diagram.
 */
function zoomCenter(centerDiagram) {
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
    drawRulerBars(scrollx, scrolly);
}

function determineZoomfact(maxX, maxY, minX, minY) {
    // Resolution of the screen
    var screenResolution = {
        x: window.innerWidth,
        y: window.innerHeight
    };
    // Checks if elements are within the window for the smalest zoomfact
    desiredZoomfact = 0.25;
    if (maxX - minX < ((screenResolution.x * 1.25 * 1.5) - 150) && maxY - minY < ((screenResolution.y * 1.25 * 1.5) - 100)) desiredZoomfact = 0.5;
    if (maxX - minX < ((screenResolution.x * 1.25) - 150) && maxY - minY < ((screenResolution.y * 1.25) - 100)) desiredZoomfact = 0.75;
    if (maxX - minX < (screenResolution.x - 150) && maxY - minY < screenResolution.y - 100) desiredZoomfact = 1.0;
    if (maxX - minX < ((screenResolution.x * 0.75) - 150) && maxY - minY < ((screenResolution.y * 0.75) - 100)) desiredZoomfact = 1.25;
    if (maxX - minX < ((screenResolution.x * 0.64) - 150) && maxY - minY < ((screenResolution.y * 0.64) - 100)) desiredZoomfact = 1.5;
    if (maxX - minX < ((screenResolution.x * 0.5) - 150) && maxY - minY < ((screenResolution.y * 0.5) - 100)) desiredZoomfact = 2.0;
    if (maxX - minX < ((screenResolution.x * 0.25) - 150) && maxY - minY < ((screenResolution.y * 0.25) - 100)) desiredZoomfact = 4.0;
}

/**
 * @description Event function triggered whenever a property field is pressed in the options panel. This will appropriatly update the current propFieldState variable.
 * @param {Boolean} isSelected Boolean value representing if the selection was ACTIVATED or DEACTIVATED.
 * @see propFieldState For seeing if any fieldset is currently selected.
 */
function propFieldSelected(isSelected) {
    propFieldState = isSelected;
}

/**
 * @description Function used to format the attribute and function textareas in UML- and IE-entities. Every entry is written on new row.
 * @param {*} arr Input array with all elements that should be seperated by newlines
 * @returns Formated string containing all the elements in arr
 */
function textboxFormatString(arr) {
    var content = '';
    for (let i = 0; i < arr.length; i++) {
        content += arr[i] + '\n';
    }
    return content;
}

/**
 * @description Generates fields for all properties of the currently selected element/line in the context.
 * These fields can be used to modify the selected element/line.
 */
function generateContextProperties() {
    let propSet = document.getElementById("propertyFieldset");
    let menuSet = document.getElementsByClassName('options-section');

    let str = "<legend>Properties</legend>";

    const showHide = (show, hide) => {
        propSet.classList.add(show);
        propSet.classList.remove(hide);
        for (let i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add(hide);
            menuSet[i].classList.remove(show);
        }
    }
    const textarea = (name, property, element) => {
        return `<div style='color:white'>${name}</div>
                <textarea 
                    id='elementProperty_${property}' 
                    rows='4' style='width:98%;resize:none;'
                >${textboxFormatString(element[property])}</textarea>`;
    }
    const input = (e) => {
        return `<div style='color:white'>Name</div>
                <input 
                    id='elementProperty_name' 
                    type='text' 
                    value='${e.name}' 
                    onfocus='propFieldSelected(true)' 
                    onblur='propFieldSelected(false)'
                >`;
    }

    if (context.length == 0 && contextLine.length == 0 && !erTableToggle && !testCaseToggle) {
        //Show options
        showHide('options-fieldset-hidden', 'options-fieldset-show');
    } else if (context.length == 0 && contextLine.length == 0 && (erTableToggle || testCaseToggle)) {// No element or line selected, but either erTableToggle or testCaseToggle is active.
        //Show properties
        showHide('options-fieldset-show', 'options-fieldset-hidden');
    }

    // display the current ER-table instead of anything else that would be visible in the "Properties" area.
    if (erTableToggle) {
        str += `<div id="ERTable">${generateErTableString()}</div>`;
        propSet.innerHTML = str;
        multipleColorsTest();
        return;
    } else if (testCaseToggle) {
        str += `<div id="ERTable">${generateStateDiagramInfo()}</div>`;
        propSet.innerHTML = str;
        multipleColorsTest();
        return;
    }
    //One element selected, no lines
    if (context.length == 1 && contextLine.length == 0) {
        const element = context[0];

        // Show properties
        showHide('options-fieldset-show', 'options-fieldset-hidden');

        //Skip diagram type-dropdown if element does not have an UML equivalent, in this case only applies to ER attributes
        /**
         * Options > Properties > Type
         */
        if (element.canChangeTo && element.kind != elementTypesNames.ERAttr) {
            let options = '';
            if (!elementHasLines(element)) {
                element.canChangeTo.forEach(type => {
                    if (type != element.type) options += `<option value="${type}"> ${type} </option>`;
                });
            }
            str += `<div style='color:white'>Type</div>
                    <select id="typeSelect">
                        <option selected ="selected" value='${element.type}'>${element.type}</option>
                        ${options}
                    </select>`;
        }
        switch (element.kind) {
            case elementTypesNames.EREntity:
                break;
            case elementTypesNames.UML:
                str += input(element);
                str += textarea('Attributes', 'attributes', element);
                str += textarea('Functions', 'functions', element);
                break;
            case elementTypesNames.IEEntity:
                str += input(element);
                str += textarea('Attributes', 'attributes', element);
                break;
            case elementTypesNames.SDEntity:
                str += input(element);
                str += textarea('Attributes', 'attributes', element);
                break;
            case elementTypesNames.sequenceActor:
                str += input(element);
                break;
            case elementTypesNames.sequenceObject:
                str += input(element);
                break;
        }
        //Selected ER type
        if (element.type == entityType.ER) {
            str += input(element);
            //Creates drop down for changing state of ER elements
            var value;
            let selected = context[0].state;
            if (!element.state) selected = "normal"
            if (element.kind == elementTypesNames.ERAttr) {
                value = Object.values(attrState);
            } else if (element.kind == elementTypesNames.EREntity) {
                value = Object.values(entityState);
            } else if (element.kind == elementTypesNames.ERRelation) {
                value = Object.values(relationState);
            }

            str += `<div style='color:white'>Variant</div>
                    <select id="propertySelect">`;
            value.forEach(type => {
                let s = (selected == type) ? `selected ="selected"` : '';
                str += `<option value="${type}" ${s}> ${type} </option>`;
            });
            str += '</select>';
        } else if (element.type == 'NOTE') {
            str += textarea('Attributes', 'attributes', element);
        } else if (element.type == entityType.UML) {
            if (element.kind == elementTypesNames.UMLEntity) {
            } else if (element.kind == elementTypesNames.UMLRelation) {
                str += input(element);
                str += `<div style='color:white'>Inheritance</div>`;
                //Creates drop down for changing state of ER elements
                let value;
                let selected = context[0].state;
                if (selected == undefined) {
                    selected = "disjoint"
                }

                if (element.kind == "UMLRelation") {
                    value = Object.values(inheritanceState);
                }

                str += '<select id="propertySelect">';
                for (let i = 0; i < value.length; i++) {
                    if (selected != value[i]) {
                        str += '<option value=' + value[i] + '>' + value[i] + '</option>';
                    } else if (selected == value[i]) {
                        str += '<option selected ="selected" value=' + value[i] + '>' + value[i] + '</option>';
                    }
                }
                str += '</select>';
            }
        } else if (element.type == entityType.IE) {//Selected IE type
            if (element.kind == elementTypesNames.IEEntity) {
            } else if (element.kind == elementTypesNames.IERelation) {
                str += input(element);
                str += `<div style='color:white'>Inheritance</div>`;
                let selected = context[0].state;
                if (selected == undefined) {
                    selected = "disjoint"
                }

                let value = Object.values(inheritanceStateIE);
                str += '<select id="propertySelect">';
                for (let i = 0; i < value.length; i++) {
                    if (selected != value[i]) {
                        str += '<option value=' + value[i] + '>' + value[i] + '</option>';
                    } else if (selected == value[i]) {
                        str += '<option selected ="selected" value=' + value[i] + '>' + value[i] + '</option>';
                    }
                }
                str += '</select>';
            }
        } else if (element.type == entityType.SD) {
            if (element.kind == elementTypesNames.SDEntity) {
            } else if (element.kind == elementTypesNames.UMLSuperState) {
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' 
                                        type='text' 
                                        value='${element[property]}' 
                                        maxlength='${20 * zoomfact}'
                                        onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        default:
                            break;
                    }
                }
            }
        } else if (element.type == entityType.SE) {//Selected sequence type
            if (element.kind == 'sequenceLoopOrAlt') {
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
        if (element.kind != 'UMLRelation' && element.kind != elementTypesNames.IERelation) {
            // Creates button for selecting element background color
            str += `<div style="white">Color</div>`;
            str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
                `<span id="BGColorMenu" class="colorMenu"></span></button>`;
        }
        str += `<br><br><input type="submit" value="Save" class='saveButton' onclick="setSequenceAlternatives();changeState();saveProperties();generateContextProperties();">`;
    }
    // Creates radio buttons and drop-down menu for changing the kind attribute on the selected line.
    if (contextLine.length == 1 && context.length == 0) {
        //Show properties
        showHide('options-fieldset-show', 'options-fieldset-hidden')
        str = "<legend>Properties</legend>";

        var value;
        let selected = contextLine[0].kind;
        if (selected == undefined) selected = normal;

        value = Object.values(lineKind);
        //this creates line kinds for UML IE AND ER
        if (contextLine[0].type == entityType.UML || contextLine[0].type == entityType.IE || contextLine[0].type == 'NOTE') {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
            for (let i = 0; i < value.length; i++) {
                if (i != 1 && findUMLEntityFromLine(contextLine[0]) != null || i != 2 && findUMLEntityFromLine(contextLine[0]) == null) {
                    if (selected == value[i]) {
                        str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}' checked>`
                        str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                    } else {
                        str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}'>`
                        str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                    }
                }
            }
        } else if (contextLine[0].type == entityType.ER) {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
            for (var i = 0; i < value.length - 1; i++) {
                if (i != 1 && findUMLEntityFromLine(contextLine[0]) != null || i != 2 && findUMLEntityFromLine(contextLine[0]) == null) {
                    if (selected == value[i]) {
                        str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}' checked>`
                        str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                    } else {
                        str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}'>`
                        str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                    }
                }
            }
        }
        if (contextLine[0].type == entityType.ER) {
            if (findAttributeFromLine(contextLine[0]) == null) {
                if (findEntityFromLine(contextLine[0]) != null) {
                    str += `<label style="display: block">Cardinality: <select id='propertyCardinality'>`;
                    str += `<option value=''>None</option>`
                    Object.keys(lineCardinalitys).forEach(cardinality => {
                        if (contextLine[0].cardinality != undefined && contextLine[0].cardinality == cardinality) {
                            str += `<option value='${cardinality}' selected>${lineCardinalitys[cardinality]}</option>`;
                        } else {
                            str += `<option value='${cardinality}'>${lineCardinalitys[cardinality]}</option>`;
                        }
                    });
                    str += `</select></label>`;
                    str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
                    str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
                    if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
                    str += `/>`;
                }
            }
        }
        if ((contextLine[0].type == entityType.UML) || (contextLine[0].type == 'NOTE')) {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
            str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
            str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
            if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
            str += `/>`;
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`;
            str += `<input id="lineStartLabel" maxlength="50" type="text" placeholder="Start cardinality"`;
            if (contextLine[0].startLabel && contextLine[0].startLabel != "") str += `value="${contextLine[0].startLabel}"`;
            str += `/>`;
            str += `<input id="lineEndLabel" maxlength="50" type="text" placeholder="End cardinality"`;
            if (contextLine[0].endLabel && contextLine[0].endLabel != "") str += `value="${contextLine[0].endLabel}"`;
            str += `/>`;
        } else if ((contextLine[0].type == entityType.IE)) {
            str += `<span id="lineLabel"`;
            if (contextLine[0].label && contextLine[0].label != "") str += `${contextLine[0].label}`;
            str += `/span>`;
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`;
            str += `<input id="lineStartLabel" maxlength="50" type="text" placeholder="Start cardinality"`;
            if (contextLine[0].startLabel && contextLine[0].startLabel != "") str += `value="${contextLine[0].startLabel}"`;
            str += `/>`;
            str += `<input id="lineEndLabel" maxlength="50" type="text" placeholder="End cardinality"`;
            if (contextLine[0].endLabel && contextLine[0].endLabel != "") str += `value="${contextLine[0].endLabel}"`;
            str += `/>`;
        } else if (contextLine[0].type == entityType.SD) {
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
            str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
            str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
            if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
            str += `/>`;
        }
        if (contextLine[0].type == entityType.UML || contextLine[0].type == entityType.IE || contextLine[0].type == 'NOTE') {
            str += `<label style="display: block">Icons:</label>`;
            let sOptions = '';
            let eOptions = '';
            sOptions += option(UMLLineIcons, contextLine[0].startIcon);
            sOptions += option(IELineIcons, contextLine[0].startIcon);
            str += select('lineStartIcon', sOptions);
            eOptions += option(UMLLineIcons, contextLine[0].endIcon);
            eOptions += option(IELineIcons, contextLine[0].endIcon);
            str += select('lineEndIcon', eOptions);
        }
        //generate the dropdown for SD line icons.
        if (contextLine[0].type == entityType.SD) {
            str += `<label style="display: block">Icons:</label>`;
            let sOptions = option(SDLineIcons, contextLine[0].startIcon);
            str += select('lineStartIcon', sOptions);
            let eOptions = option(SDLineIcons, contextLine[0].endIcon);
            str += select('lineEndIcon', eOptions);

            str += `<label style="display: block">Line Type:</label>`;
            let options = option(SDLineType, contextLine[0].innerType);
            str += select('lineType', options, false);
        }
        str += `<br><br><input type="submit" class='saveButton' value="Save" onclick="changeLineProperties();">`;
    }
    //If more than one element is selected
    if (context.length > 1) {
        //Show properties
        showHide('options-fieldset-show', 'options-fieldset-hidden')
        str += `<div style="color: white">Color</div>`;
        str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
            `<span id="BGColorMenu" class="colorMenu"></span></button>`;
    }

    if (context.length > 0) {
        //Show properties
        showHide('options-fieldset-show', 'options-fieldset-hidden')
        var locked = true;
        for (let i = 0; i < context.length; i++) {
            if (!context[i].isLocked) {
                locked = false;
                break;
            }
        }
        str += `<br><input type="submit" id="lockbtn" value="${locked ? "Unlock" : "Lock"}" class="saveButton" onclick="toggleEntityLocked();">`;
    }
    propSet.innerHTML = str;
    multipleColorsTest();
}

const option = (object, icon) => {
    let result = '';
    Object.values(object).forEach(i => {
        let selected = (i == icon) ? 'selected' : '';
        result += `<option value='${i}' ${selected}>${i}</option>`;
    });
    return result;
}
const select = (id, options, inclNone=true) => {
    let none = (inclNone) ? `<option value=''>None</option>` : '';
    return `<select id='${id}' onChange="changeLineProperties()">
                ${none}
                ${options}
            </select>`;
}

/**
 *
 * @description function for include button to the options panel,writes out << Include >>
 */
function setLineLabel() {
    document.getElementById("lineLabel").value = "<<include>>";
}

/**
 * @description Toggles the option menu being open or closed.
 */
function toggleOptionsPane() {
    if (document.getElementById("options-pane").className == "show-options-pane") {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        if (document.getElementById("BGColorMenu") != null) {
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
function generateToolTips() {
    var toolButtons = document.getElementsByClassName("key_tooltip");

    for (let index = 0; index < toolButtons.length; index++) {
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
async function generateKeybindList() {
    try {
        const response = await fetch("diagramkeybinds.md");
        const file = await response.text();
        document.getElementById("markdownKeybinds").innerHTML = parseMarkdown(file);
    } catch (error) {
        console.error(error);
    }
}

/**
 * @description Modified the current ruler position to respective x and y coordinate. This DOM-element has an absolute position and does not change depending on other elements.
 * @param {Number} x Absolute x-position in pixels from the left of the inner window.
 * @param {Number} y Absolute y-position in pixels from the top of the inner window.
 */
function setRulerPosition(x, y) {
    //40 is the size of the actual ruler and 51 is the toolbar on the left side
    if (x >= 40 + 51) document.getElementById("ruler-x").style.left = x - 51 + "px";
    if (y >= 40) document.getElementById("ruler-y").style.top = y + "px";
}

/**
 * @description Performs an update to the current grid size depending on the current zoom level.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
function updateGridSize() {
    //Do not remore, for later us to make gridsize in 1cm.
    var pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    settings.grid.gridSize = 10 * pxlength;

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
function updateA4Size() {
    var rect = document.getElementById("a4Rect");
    var vRect = document.getElementById("vRect");


    var pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    //const a4Width = 794, a4Height = 1122;
    const a4Width = 210 * pxlength
    const a4Height = 297 * pxlength;

    vRect.setAttribute("width", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");
    vRect.setAttribute("height", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");
    rect.setAttribute("width", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");
    rect.setAttribute("height", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");
    updateA4Pos();
}

/**
 * @description Calculates new positioning for the background grid.
 */
function updateGridPos() {
    var gridOffsetX = Math.round(((0 - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
    var gridOffsetY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));
    var bLayer = document.getElementById("grid");
    bLayer.setAttribute('x', gridOffsetX.toString());
    bLayer.setAttribute('y', gridOffsetY.toString());

    // origo x axis line position
    bLayer = document.getElementById("origoX");
    bLayer.setAttribute('y1', gridOffsetY.toString());
    bLayer.setAttribute('y2', gridOffsetY.toString());

    // origo y axis line position
    bLayer = document.getElementById("origoY");
    bLayer.setAttribute('x1', gridOffsetX.toString());
    bLayer.setAttribute('x2', gridOffsetX.toString());
}

/**
 * @description Calculates new positioning for the A4 template.
 */
function updateA4Pos() {
    var OffsetX = Math.round(-zoomOrigo.x * zoomfact + (scrollx * (1.0 / zoomfact)));
    var OffsetY = Math.round(-zoomOrigo.y * zoomfact + (scrolly * (1.0 / zoomfact)));
    var rect = document.getElementById("a4Rect");
    var vRect = document.getElementById("vRect");
    var text = document.getElementById("a4Text");

    vRect.setAttribute('x', OffsetX.toString());
    vRect.setAttribute('y', OffsetY.toString());

    rect.setAttribute('x', OffsetX.toString());
    rect.setAttribute('y', OffsetY.toString());

    text.setAttribute('x', (OffsetX + (780 * zoomfact)).toString());
    text.setAttribute('y', (OffsetY - 5).toString());
}

/**
 * @description Displays a popup message as feedback for the current user. This message will then be destroyed after a specified time.
 * @param {messageTypes} type What kind of message type this is.
 * @param {String} message Contents of the message displayed.
 * @param {Number} time Milliseconds until the message will be destroyed.
 * @see messageTypes All kind of messages there exist to display.
 */
function displayMessage(type, message, time = 5000) {
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
function setTimerToMessage(element, time = 5000) {
    if (!element) return;

    element.innerHTML += `<div class="timeIndicatorBar"></div>`;
    var timer = setInterval(function () {
        const element = document.getElementById(settings.misc.errorMsgMap[timer].id);
        settings.misc.errorMsgMap[timer].percent -= 1;
        element.lastElementChild.style.width = `calc(${settings.misc.errorMsgMap[timer].percent - 1}% - 10px)`;

        // If the time is out, remove the message
        if (settings.misc.errorMsgMap[timer].percent === 0) removeMessage(element, timer);

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
function removeMessage(element, timer) {
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
function toggleColorMenu(buttonID) {
    var button = document.getElementById(buttonID);
    let menu;
    var width = 0;

    // If the color menu's inner html is empty
    if (button.children[0].innerHTML == "") {
        menu = button.children[0];
        menu.style.visibility = "visible";
        if (menu.id === "BGColorMenu") {
            // Create svg circles for each element in the "colors" array
            for (let i = 0; i < MENU_COLORS.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="BGColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${MENU_COLORS[i]}" onclick="setElementColors('BGColorCircle${i}')" stroke='${color.BLACK}' stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        } else {
            // Create svg circles for each element in the "strokeColors" array
            for (let i = 0; i < strokeColors.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="strokeColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${strokeColors[i]}" onclick="setElementColors('strokeColorCircle${i}')" stroke='${color.BLACK}' stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        }
        // Menu position relative to button
        menu.style.width = width + "px";
        var buttonWidth = button.offsetWidth;
        var offsetWidth = window.innerWidth - button.getBoundingClientRect().x - (buttonWidth);
        var offsetHeight = button.getBoundingClientRect().y;
        menu.style.top = (offsetHeight - 50) + "px";
        var menuOffset = window.innerWidth - menu.getBoundingClientRect().x - (width);
        menu.style.left = (menu.style.left + menuOffset) - (offsetWidth + buttonWidth) + "px";
    } else {    // if the color menu's inner html is not empty, remove the content
        menu = button.children[0];
        menu.innerHTML = "";
        menu.style.visibility = "hidden";
        showdata();
    }
}

/**
 * @description Sets the fill and/or stroke color of all elements in context
 * @param {String} clickedCircleID containing the ID of the svg circle that was pressed
 */
function setElementColors(clickedCircleID) {
    var id = clickedCircleID;
    var menu = document.getElementById(clickedCircleID).parentElement.parentElement;
    var elementIDs = [];

    // If fill button was pressed
    if (menu.id == "BGColorMenu") {
        var index = id.replace("BGColorCircle", "") * 1;
        var color = MENU_COLORS[index];
        for (let i = 0; i < context.length; i++) {
            context[i].fill = color;
            elementIDs.push(context[i].id)
            /*
            // Change font color to white for contrast, doesn't work for whatever reason but will maybe provide a hint for someone who might want to try to solve it.
            if (clickedCircleID == "BGColorCircle9" || clickedCircleID == "BGColorCircle6") {
                console.log("du har klickat på svart eller rosa färg");
               document.getElementsByClassName("text").style.color = color.WHITE;
            }
            else{
                //element.id.style.color = color.BLACK;
            }*/
        }
        stateMachine.save(
            StateChangeFactory.ElementAttributesChanged(elementIDs, {fill: color}),
            StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED
        );
    } else if (menu.id == "StrokeColorMenu") {  // If stroke button was pressed
        var index = id.replace("strokeColorCircle", "") * 1;
        var color = strokeColors[index];
        for (let i = 0; i < context.length; i++) {
            context[i].stroke = color;
            elementIDs[i] = context[i].id;
        }
        stateMachine.save(
            StateChangeFactory.ElementAttributesChanged(elementIDs, {stroke: color}),
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
function multipleColorsTest() {
    if (context.length > 1) {
        var fill = context[0].fill;
        var varyingFills = false;
        for (let i = 0; i < context.length; i++) {
            // Checks if there are varying fill colors, but not if varying colors have already been detected
            if (fill != context[i].fill && !varyingFills) {
                var button = document.getElementById("colorMenuButton1");
                button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                var textNode = document.createTextNode("Multiple Color Values");
                button.insertBefore(textNode, button.firstChild);
                varyingFills = true;
            }
            /*
        var stroke = context[0].stroke;
        var varyingStrokes = false;
            // Checks if there are varying stroke colors, but not if varying colors have already been detected
             if (stroke != context[i].stroke && !varyingStrokes) {
                 var button = document.getElementById("colorMenuButton2");
                 button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                 var textNode = document.createTextNode("Multiple Color Values");
                 button.insertBefore(textNode, button.firstChild);
                 varyingStrokes = true;
             }
             // If varying colors have been detected in both of the above, there is no reason to continue the test
             if (varyingFills && varyingStrokes) {
                 break;
             }
             */
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
function sortvectors(currentElementID, compareElementID, ends, elementid, axis) {
    let ax, ay, bx, by, toElementA, toElementB, sortval, parentx, parenty;
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
 * @description Checks if the lines intersect and if the possible intersection point is within edges
 * @param {Number} x1 Position 1
 * @param {Number} y1 Position 1
 * @param {Number} x2 Position 2
 * @param {Number} y2 Position 2
 * @param {Number} x3 Position 3
 * @param {Number} y3 Position 3
 * @param {Number} x4 Position 4
 * @param {Number} y4 Position 4
 * @returns False if the lines don't intersect or if the intersection points are within edges, otherwise True.
 */

function linetest(x1, y1, x2, y2, x3, y3, x4, y4) {
    var determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    // Values are NaN if the lines don't intersect and prepares values for checking if the possible intersection point is within edges
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / determinant;
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / determinant;
    if (isNaN(x) || isNaN(y)) {//Check if lines don't intersect
        return false;
    } else {//Check if intersection point is within edges
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
    return true;
}

/**
 * @description Clears the line list on all sides of an element.
 * @param {Object} element Element to empty all sides of.
 */
function clearLinesForElement(element) {

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
function determineLine(line, targetGhost = false) {
    var felem, telem;

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
    if (overlapY || ((majorX) && (!overlapX))) {
        if (line.dx > 0) line.ctype = lineDirection.LEFT;
        else line.ctype = lineDirection.RIGHT;
    } else {
        if (line.dy > 0) line.ctype = lineDirection.UP;
        else line.ctype = lineDirection.DOWN;
    }

    // Add accordingly to association end
    if (line.ctype == lineDirection.LEFT) {
        felem.left.push(line.id);
        telem.right.push(line.id);
    } else if (line.ctype == lineDirection.RIGHT) {
        felem.right.push(line.id);
        telem.left.push(line.id);
    } else if (line.ctype == lineDirection.UP) {
        felem.top.push(line.id);
        telem.bottom.push(line.id);
    } else if (line.ctype == lineDirection.DOWN) {
        felem.bottom.push(line.id);
        telem.top.push(line.id);
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
function sortElementAssociations(element) {
    // Only sort if size of list is >= 2
    if (element.top.length > 1) element.top.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.top, element.id, 2)
    });
    if (element.bottom.length > 1) element.bottom.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.bottom, element.id, 3)
    });
    if (element.left.length > 1) element.left.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.left, element.id, 0)
    });
    if (element.right.length > 1) element.right.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.right, element.id, 1)
    });
}

/**
 * @description Add an line between two elements. Also checks if the line is connected between right elements and is not exceed the allowed amount.
 * @param {Object} fromElement Element that the line is from.
 * @param {Object} toElement Element that the line is to.
 * @param {String} kind The kind of line that should be added.
 * @param {boolean} stateMachineShouldSave Should this line be added to the stateMachine.
 */
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true, successMessage = true, cardinal) {
    // All lines should go from EREntity, instead of to, to simplify offset between multiple lines.
    if (toElement.kind == "EREntity"){
        var tempElement = toElement;
        toElement = fromElement;
        fromElement = tempElement;
    }
    //If line is comming to ERRelation from weak entity it adds double line, else it will be single
    if (toElement.kind == "ERRelation") {
        if (fromElement.state == "weak") {
            var tempElement = toElement;
            toElement = fromElement;
            fromElement = tempElement;
            kind = "Double";
        } else {
            var tempElement = toElement;
            toElement = fromElement;
            fromElement = tempElement;
        }
    }
    if (fromElement.id === toElement.id && !(fromElement.kind === elementTypesNames.SDEntity || toElement.kind === elementTypesNames.SDEntity)) {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between: ${fromElement.name} and ${toElement.name}, they are the same element`);
        return;
    }
    // Prevent a line to be drawn between elements of different types except the note type
    if (fromElement.type != toElement.type && fromElement.type !== 'NOTE' && toElement.type !== 'NOTE') {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines between: ${fromElement.type}- and ${toElement.type}-elements`);
        return;
    }
    //checks if a line is drawn to UMLInitialState.
    if (toElement.kind == elementTypesNames.UMLInitialState) {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines to: ${toElement.kind}`);
        return;
    } else if (fromElement.kind == elementTypesNames.UMLFinalState) {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines from: ${fromElement.kind}`);
        return;
    }

    // Helps to decide later on, after passing the tests after this loop and the next two loops if the value should be added
    var exists = false;
    for (let i = 0; i < allAttrToEntityRelations.length; i++) {
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
    for (let i = 0; i < allAttrToEntityRelations.length; i++) {
        if (fromElement.kind === elementTypesNames.ERAttr && toElement.kind === elementTypesNames.ERAttr && fromElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = toElement.id;
            attrViaAttrCounter++;
            break;
        } else if (fromElement.kind === elementTypesNames.ERAttr && toElement.kind === elementTypesNames.ERAttr && toElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = fromElement.id;
            attrViaAttrCounter++;
            break;
        }
    }

    // Adding attributes to the array that only carries attributes directly connected to entities or relations
    if (!exists) {
        if (toElement.kind == elementTypesNames.ERRelation) {
            allAttrToEntityRelations[countUsedAttributes] = fromElement.id;
            countUsedAttributes++;
        } else {
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
    var specialCase = (fromElement.kind === elementTypesNames.ERRelation &&
        toElement.kind === elementTypesNames.EREntity ||
        fromElement.kind === elementTypesNames.EREntity &&
        toElement.kind === elementTypesNames.ERRelation
    );

    // Check rules for Recursive relations
    if (fromElement.kind === elementTypesNames.ERRelation && fromElement.kind == "Normal" || toElement.kind === elementTypesNames.ERRelation && toElement.kind == "Normal") {
        var relationID;
        if (fromElement.kind === elementTypesNames.ERRelation) relationID = fromElement.id;
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
        for (let i = 0; i < allAttrToEntityRelations.length; i++) {
            if (allAttrToEntityRelations[i] == fromElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            } else if (allAttrToEntityRelations[i] == toElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            }
        }
        if (hasRecursive || hasOtherLines) {
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
            if (cardinal != undefined) {
                newLine.cardinality = cardinal;
            }
        }
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if (successMessage) displayMessage(messageTypes.SUCCESS, `Created new line between: ${fromElement.name} and ${toElement.name}`);
        return newLine;
    } else {
        displayMessage(messageTypes.ERROR, `Maximum amount of lines between: ${fromElement.name} and ${toElement.name}`);
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
    if ((felem.type === entityType.SD) && (telem.type === entityType.SD)) {
        if (line.kind === 'Recursive') {
            line.endIcon = '';
        } else {
            line.endIcon = 'ARROW';
        }

        line.innerType = SDLineType.STRAIGHT;
    }
}

//#endregion =====================================================================================
//#region ================================ DRAWING FUNCTIONS    ==================================

/**
 * @description Constructs an string containing the svg line-elements of the inputted line object in parameter.
 * @param {Object} line The line object that is drawn.
 * @param {boolean} targetGhost Is the targeted line an ghost line
 */
function drawLine(line, targetGhost = false) {
    // Element line is drawn from/to
    let felem = data[findIndex(data, line.fromID)];
    let telem = targetGhost ? ghostElement : data[findIndex(data, line.toID)];

    let str = "";
    let strokeDash = (line.kind == lineKind.DASHED) ? "10" : "0";
    let lineColor = isDarkTheme() ? color.WHITE : color.BLACK;
    let isSelected = contextLine.includes(line);

    if (isSelected) lineColor = color.SELECTED;

    let fx, fy, tx, ty, offset;
    [fx, fy, tx, ty, offset] = getLineAttrubutes(felem, telem, line.ctype);

    line.type = (telem.type == entityType.note) ? telem.type : felem.type;
    if (line.type == entityType.note) strokeDash = "10";
    if (targetGhost && line.type == entityType.SD) line.endIcon = SDLineIcons.ARROW;

    if (line.type == entityType.ER) {
        if (line.kind == lineKind.NORMAL) {
            str += `<line 
                        id='${line.id}' 
                        x1='${fx + offset.x1}' y1='${fy + offset.y1}' 
                        x2='${tx + offset.x2}' y2='${ty + offset.y2}' 
                        stroke='${lineColor}' stroke-width='${strokewidth}'
                    />`;
        } else if (line.kind == lineKind.DOUBLE) {
            let dy = -(tx - fx);
            let dx = ty - fy;
            let len = Math.sqrt((dx * dx) + (dy * dy));
            dy = dy / len;
            dx = dx / len;

            const double = (a, b) => {
                return `<line 
                            id='${line.id}-${b}' 
                            x1='${fx + a * dx * strokewidth * 1.5 + offset.x1}' 
                            y1='${fy + a * dy * strokewidth * 1.5 + offset.y1}' 
                            x2='${tx + a * dx * strokewidth * 1.5 + offset.x2}' 
                            y2='${ty + a * dy * strokewidth * 1.5 + offset.y2}' 
                            stroke='${lineColor}' stroke-width='${strokewidth}'
                        />`;
            }
            str += double(1, 1);
            str += double(-1, 2);
        }
    } else if ((line.type == entityType.SD && line.innerType == null) || (line.type == entityType.SD && line.innerType === SDLineType.STRAIGHT)) {
        if (line.kind == lineKind.RECURSIVE) {
            const length = 80 * zoomfact;
            const startX = fx - 10 * zoomfact;
            const startY = fy - 10 * zoomfact;
            const endX = fx - 25 * zoomfact;
            const endY = fy - 15 * zoomfact;
            const cornerX = fx + length;
            const cornerY = fy - length;

            str += `<line id='${line.id}' x1='${startX + offset.x1 - 17 * zoomfact}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${cornerY + offset.y1}'/>`;
            str += `<line id='${line.id}' x1='${startX + offset.x1}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${startY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
            str += `<line id='${line.id}' x1='${cornerX + offset.x1}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${cornerY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
            str += `<line id='${line.id}' x1='${cornerX + offset.x1}' y1='${cornerY + offset.y1}' x2='${endX + offset.x1}' y2='${cornerY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
            str += `<line id='${line.id}' x1='${endX + offset.x1}' y1='${cornerY + offset.y1}' x2='${endX + offset.x1}' y2='${endY + offset.y1 - 40 * zoomfact}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
            str += `<polygon id='${line.id}' class='diagram-umlicon-darkmode' points='${endX + offset.x1 - 5 * zoomfact},${endY + offset.y1 - 44 * zoomfact},${endX + offset.x1},${endY + offset.y1 - 34 * zoomfact},${endX + offset.x1 + 5 * zoomfact},${endY + offset.y1 - 44 * zoomfact}' fill='${lineColor}'/>`;
        } else if ((fy > ty) && (line.ctype == lineDirection.UP)) {
            offset.y1 = 1;
            offset.y2 = -7 + 3 / zoomfact;
        } else if ((fy < ty) && (line.ctype == lineDirection.DOWN)) {
            offset.y1 = -7 + 3 / zoomfact;
            offset.y2 = 1;
        }
        str += `<line 
                    id='${line.id}' 
                    x1='${fx + offset.x1 * zoomfact}' 
                    y1='${fy + offset.y1 * zoomfact}' 
                    x2='${tx + offset.x2 * zoomfact}' 
                    y2='${ty + offset.y2 * zoomfact}' 
                    fill='none' stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}'
                />`;
    } else { // UML, IE or SD
        str += drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash);
    }

    str += drawLineIcon(line.startIcon, line.ctype, fx, fy, lineColor, line);
    str += drawLineIcon(line.endIcon, line.ctype.split('').reverse().join(''), tx, ty, lineColor, line);

    if  (line.type == entityType.SD && line.innerType != SDLineType.SEGMENT) {
        let to = new Point(tx + offset.x2 * zoomfact, ty + offset.y2 * zoomfact);
        let from = new Point(fx + offset.x1 * zoomfact, fy + offset.y1 * zoomfact);
        if (line.startIcon == SDLineIcons.ARROW) {
            str += drawArrowPoint(calculateArrowBase(to, from, 10 * zoomfact), from, fx, fy, lineColor, line, line.ctype);
        }
        if (line.endIcon == SDLineIcons.ARROW) {
            str += drawArrowPoint(calculateArrowBase(from, to, 10 * zoomfact), to, tx, ty, lineColor, line, line.ctype.split('').reverse().join(''));
        }
    }

    if (felem.type != entityType.ER || telem.type != entityType.ER) {
        if (line.startLabel && line.startLabel != '') {
            str += drawLineLabel(line, line.startLabel, lineColor, 'startLabel', fx, fy, true);
        }
        if (line.endLabel && line.endLabel != '') {
            str += drawLineLabel(line, line.endLabel, lineColor, 'endLabel', tx, ty, false);
        }
    } else {
        if (line.cardinality) {
            str += drawLineCardinality(line, lineColor, fx, fy, tx, ty, felem, telem);
        }
    }

    if (isSelected) {
        str += `<rect 
                    x='${((fx + tx) / 2) - (2 * zoomfact)}' 
                    y='${((fy + ty) / 2) - (2 * zoomfact)}' 
                    width='${4 * zoomfact}' 
                    height='${4 * zoomfact}' 
                    style='fill:${lineColor}' stroke='${lineColor}' stroke-width="3"
                />`;
    }

    if (line.label  && line.type !== entityType.IE) {
        //Get width of label's text through canvas
        var height = Math.round(zoomfact * textheight);
        var canvas = document.getElementById('canvasOverlay');
        var canvasContext = canvas.getContext('2d');
        canvasContext.font = `${height}px ${canvasContext.font.split('px')[1]}`;
        var labelValue = line.label.replaceAll('<', "&#60").replaceAll('>', "&#62");
        var textWidth = canvasContext.measureText(line.label).width;

        var label = {
            id: line.id + "Label",
            labelLineID: line.id,
            centerX: (tx + fx) / 2,
            centerY: (ty + fy) / 2,
            width: textWidth + zoomfact * 4,
            height: textheight * zoomfact + zoomfact * 3,
            labelMovedX: 0,
            labelMovedY: 0,
            lowY: Math.min(ty, fy),
            highY: Math.max(ty, fy),
            lowX: Math.min(tx, fx),
            highX: Math.max(ty, fy),
            percentOfLine: 0,
            displacementX: 0,
            displacementY: 0,
            fromX: fx,
            toX: tx,
            fromY: fy,
            toY: ty,
            lineGroup: 0,
            labelMoved: false
        };

        if (!!targetLabel) var rememberTargetLabelID = targetLabel.id;

        if (!!lineLabelList[findIndex(lineLabelList, label.id)]) {
            label.labelMovedX = lineLabelList[findIndex(lineLabelList, label.id)].labelMovedX;
            label.labelMovedY = lineLabelList[findIndex(lineLabelList, label.id)].labelMovedY;
            label.labelGroup = lineLabelList[findIndex(lineLabelList, label.id)].labelGroup;
            label.labelMoved = lineLabelList[findIndex(lineLabelList, label.id)].labelMoved;
            calculateProcentualDistance(label);
            if (label.labelGroup == 0) {
                label.displacementX = 0;
                label.displacementY = 0;
            } else if (label.labelGroup == 1) {
                label.displacementX = calculateLabelDisplacement(label).storeX * zoomfact;
                label.displacementY = calculateLabelDisplacement(label).storeY * zoomfact;
            } else if (label.labelGroup == 2) {
                label.displacementX = -calculateLabelDisplacement(label).storeX * zoomfact;
                label.displacementY = -calculateLabelDisplacement(label).storeY * zoomfact;
            }
            lineLabelList[findIndex(lineLabelList, label.id)] = label;
        } else {
            lineLabelList.push(label);
        }

        if (!!rememberTargetLabelID) {
            targetLabel = lineLabelList[findIndex(lineLabelList, rememberTargetLabelID)];
        }
        // Label position for recursive edges
        var labelPosX = (tx + fx) / 2 - ((textWidth) + zoomfact * 8) / 2;
        var labelPosY = (ty + fy) / 2 - ((textheight / 2) * zoomfact + 4 * zoomfact);
        const labelPositionX = labelPosX + zoomfact
        const labelPositionY = labelPosY - zoomfact

        //Add label with styling based on selection.
        if (line.kind === lineKind.RECURSIVE) {
            str += `<rect
                        class='text cardinalityLabel'
                        id='${line.id + 'Label'}'
                        x='${((fx + length + (30 * zoomfact))) - textWidth / 2}'
                        y='${(labelPositionY - 70 * zoomfact) - ((textheight / 4) * zoomfact)}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact}'
                    />`;
            str += `<text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        x='${(fx + length + (30 * zoomfact))}'
                        y='${(labelPositionY - 70 * zoomfact) + ((textheight / 4) * zoomfact)}'
                        style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;'>
                        ${labelValue}
                    </text>`;
        } else {
            str += `<rect
                        class='text cardinalityLabel'
                        id=${line.id + 'Label'}
                        x='${labelPositionX}'
                        y='${labelPositionY}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact + zoomfact * 3}'
                    />`;
            str += ` <text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        style='font-size:${Math.round(zoomfact * textheight)}px;'
                        x='${label.centerX - (2 * zoomfact)}'
                        y='${label.centerY - (2 * zoomfact)}'>
                        ${labelValue}
                    </text>`;
        }
    }
    return str;
}

function getLineAttrubutes(f, t, ctype) {
    let result;
    let px = 3;
    let offset = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
    }
    switch (ctype) {
        case lineDirection.UP:
            offset.y1 = px;
            offset.y2 = -px * 2;
            result = [f.cx, f.y1, t.cx, t.y2, offset];
            break;
        case lineDirection.DOWN:
            offset.y1 = -px * 2;
            offset.y2 = px;
            result = [f.cx, f.y2, t.cx, t.y1, offset];
            break;
        case lineDirection.LEFT:
            offset.x1 = px;
            offset.x2 = 0;
            result = [f.x1, f.cy, t.x2, t.cy, offset];
            break;
        case lineDirection.RIGHT:
            offset.x1 = 0;
            offset.x2 = px;
            result = [f.x2, f.cy, t.x1, t.cy, offset];
    }
    return result;
}

function drawLineLabel(line, label, lineColor, labelStr, x, y, isStart) {
    const offsetOnLine = 20 * zoomfact;
    let canvas = document.getElementById('canvasOverlay');
    let canvasContext = canvas.getContext('2d');
    let textWidth = canvasContext.measureText(label).width;

    if (line.ctype == lineDirection.UP) {
        x -= offsetOnLine / 2;
        y += (isStart) ? -offsetOnLine : offsetOnLine;
    } else if (line.ctype == lineDirection.DOWN) {
        x -= offsetOnLine / 2;
        y += (isStart) ? offsetOnLine : -offsetOnLine;
    } else if (line.ctype == lineDirection.LEFT) {
        x += (isStart) ? -offsetOnLine : offsetOnLine;
        y -= offsetOnLine / 2;
    } else if (line.ctype == lineDirection.RIGHT) {
        x += (isStart) ? offsetOnLine : -offsetOnLine;
        y -= offsetOnLine / 2;
    }

    return `<rect 
                class='text cardinalityLabel' 
                id='${line.id + labelStr}' 
                x='${x - textWidth / 2}' 
                y='${y - (textheight * zoomfact + zoomfact * 3) / 2}' 
                width='${textWidth + 2}' 
                height='${(textheight - 4) * zoomfact + zoomfact * 3}'/> 
            <text 
                class='text cardinalityLabelText' 
                dominant-baseline='middle' 
                text-anchor='middle' 
                style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;' 
                x='${x}' 
                y='${y}'
            > ${label} </text>`;
}

function drawLineCardinality(line, lineColor, fx, fy, tx, ty, f, t) {
    let posX, posY;

    // Used to tweak the cardinality position when the line gets very short.
    const tweakOffset = 0.30;
    const offsetOnLine = 20 * zoomfact;

    let distance = Math.sqrt(Math.pow((tx - fx), 2) + Math.pow((ty - fy), 2));
    let offset = Math.round(zoomfact * textheight / 2);
    let canvas = document.getElementById('canvasOverlay');
    let canvasContext = canvas.getContext('2d');
    let textWidth = canvasContext.measureText(line.cardinality).width / 4;
    if (offsetOnLine > distance * 0.5) {
        posX = tx + (offsetOnLine * (fx - tx) / distance) * tweakOffset;
        posY = ty + (offsetOnLine * (fy - ty) / distance) * tweakOffset;
    } else {
        // Set position on line for the given offset
        posX = tx + (offsetOnLine * (fx - tx) / distance);
        posY = ty + (offsetOnLine * (fy - ty) / distance);
    }

    if (findEntityFromLine(line) == -1) {
        if (line.ctype == lineDirection.UP) {
            if (f.top.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.DOWN) {
            if (f.bottom.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.RIGHT) {
            if (f.right.indexOf(line.id) == 0) posY -= offset;
            else if (f.right.indexOf(line.id) == f.right.length - 1) posY += offset;
        } else if (line.ctype == lineDirection.LEFT) {
            if (f.left.indexOf(line.id) == 0) posY -= offset;
            else if (f.left.indexOf(line.id) == f.left.length - 1) posY += offset;
        }
    } else {
        if (line.ctype == lineDirection.UP) {
            if (t.bottom.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.DOWN) {
            if (t.top.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.RIGHT) {
            if (t.left.indexOf(line.id) == 0) posY -= offset;
            else if (t.left.indexOf(line.id) == f.left.length - 1) posY += offset;
        } else if (line.ctype == lineDirection.LEFT) {
            if (t.right.indexOf(line.id) == 0) posY -= offset;
            else if (t.right.indexOf(line.id) == f.right.length - 1) posY += offset;
        }
    }
    return `<rect 
                class='text cardinalityLabel' 
                id='${line.id + "Cardinality"}' 
                x='${posX - (textWidth) / 2}' 
                y='${posY - (textheight * zoomfact + zoomfact * 3) / 2}' 
                width='${textWidth + 2}' 
                height='${(textheight - 4) * zoomfact + zoomfact * 3}'
            /> 
            <text 
                class='text cardinalityLabelText' 
                dominant-baseline='middle' 
                text-anchor='middle' 
                style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;' 
                x='${posX}' 
                y='${posY}'
            > ${lineCardinalitys[line.cardinality]} </text>`;
}

function drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash) {
    let dy = (line.ctype == lineDirection.UP || line.ctype == lineDirection.DOWN) ? (((fy + offset.y1) - (ty + offset.y2)) / 2) : 0;
    let dx = (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) ? (((fx + offset.x1) - (tx + offset.x2)) / 2) : 0;
    return `<polyline 
                id='${line.id}' 
                points='${fx + offset.x1},${fy + offset.y1} ${fx + offset.x1 - dx},${fy + offset.y1 - dy} ${tx + offset.x2 + dx},${ty + offset.y2 + dy} ${tx + offset.x2},${ty + offset.y2}' 
                fill='none' stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}' 
            />`;

}

function drawLineIcon(icon, ctype, x, y, lineColor, line) {
    let str = "";
    switch (icon) {
        case IELineIcons.ZERO_ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            break;
        case IELineIcons.FORCED_ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            str += iconLine(TWO_LINE[ctype], x, y, lineColor);
            break;
        case IELineIcons.WEAK:
            str += iconPoly(WEAK_TRIANGLE[ctype], x, y, lineColor, color.WHITE);
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            break;
        case IELineIcons.ZERO_MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.ONE_MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            str += iconLine(TWO_LINE[ctype], x, y, lineColor);
            break;
        case UMLLineIcons.ARROW:
           str += iconPoly(ARROW[ctype], x, y, lineColor, 'none');
            break;
        case UMLLineIcons.TRIANGLE:
            str += iconPoly(TRIANGLE[ctype], x, y, lineColor, color.WHITE);
            break;
        case UMLLineIcons.BLACK_TRIANGLE:
            str += iconPoly(TRIANGLE[ctype], x, y, lineColor, color.BLACK);
            break;
        case UMLLineIcons.WHITEDIAMOND:
            str += iconPoly(DIAMOND[ctype], x, y, lineColor, color.WHITE);
            break;
        case UMLLineIcons.BLACKDIAMOND:
            str += iconPoly(DIAMOND[ctype], x, y, lineColor, color.BLACK);
            break;
        case SDLineIcons.ARROW:
            if (line.innerType == SDLineType.SEGMENT) {
                // class should be diagram-umlicon-darkmode-sd and not diagram-umlicon-darkmode?
                str += iconPoly(SD_ARROW[ctype], x, y, lineColor, color.BLACK);
            }
    }
    return str;
}

function iconLine([a, b, c, d], x, y, lineColor) {
    return `<line 
                x1='${x + a * zoomfact}' 
                y1='${y + b * zoomfact}' 
                x2='${x + c * zoomfact}' 
                y2='${y + d * zoomfact}' 
                stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

function iconCircle([a, b, c], x, y, lineColor,) {
    return `<circle 
                cx='${x + a * zoomfact}' 
                cy='${y + b * zoomfact}' 
                r='${c * zoomfact}' 
                fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

function iconPoly(arr, x, y, lineColor, fill) {
    let s = "";
    for (let i = 0; i < arr.length; i++) {
        const [a, b] = arr[i];
        s += `${x + a * zoomfact} ${y + b * zoomfact}, `;
    }
    return `<polyline 
                points='${s}' 
                fill='${fill}' stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

/**
 * @description Calculates the coordinates of the point representing the base of the arrow, the point is @param size distance away and on the line between @param from and @param to .
 * @param {Point} from The coordinates/Point where the line between two elements start.
 * @param {Point} to The coordinates/Point where the line between two elements end.
 * @param {number} size The size(height) of the arrow that is to be drawn.
 * @returns The coordinates/Point where the arrow base is placed on the line.
 */
function calculateArrowBase(from, to, size) {
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
function rotateArrowPoint(base, to, clockwise) {
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
    } else {
        let point = new Point(-1 * (to.y - base.y) / 2, (to.x - base.x) / 2);
        point.add(base);
        return point;
    }
}

function drawArrowPoint(base, point, x, y, lineColor) {
    let right = rotateArrowPoint(base, point, true);
    let left = rotateArrowPoint(base, point, false);
    return `<polygon points=' 
        ${right.x} ${right.y},
        ${point.x} ${point.y}, 
        ${left.x} ${left.y}' 
        stroke='${lineColor}' stroke-width='${strokewidth}'/>`;
}


/**
 * @description Removes all existing lines and draw them again
 * @param {String} str The string to add the created line elements to
 * @return String containing all the new lines-elements
 */
function redrawArrows(str) {
    // Clear all lines and update with dom object dimensions
    for (let i = 0; i < data.length; i++) {
        clearLinesForElement(data[i]);
    }

    for (let i = 0; i < lines.length; i++) {
        determineLine(lines[i]);
    }

    // Determine lines before sorting associations
    if (ghostLine && ghostElement) {
        clearLinesForElement(ghostElement);
        determineLine(ghostLine, true);
    }

    // Sort all association ends that number above 0 according to direction of line
    for (let i = 0; i < data.length; i++) {
        sortElementAssociations(data[i]);
    }

    // Draw each line using sorted line ends when applicable
    for (let i = 0; i < lines.length; i++) {
        str += drawLine(lines[i]);
    }

    if (ghostLine && ghostElement) {
        str += drawLine(ghostLine, true);
    }

    // Remove all neighbour maps from elements
    for (let i = 0; i < data.length; i++) {
        delete data[i].neighbours;
    }

    return str;
}

/**
 * @description Adds nodes for resizing to an elements
 * @param {Object} element The target element to add nodes to.
 */
function addNodes(element) {
    var elementDiv = document.getElementById(element.id)
    var nodes = "";
    nodes += "<span id='mr' class='node mr'></span>";
    nodes += "<span id='ml' class='node ml'></span>";
    nodes += "<span id='md' class='node md'></span>";
    nodes += "<span id='mu' class='node mu'></span>";

    elementDiv.innerHTML += nodes;
    const defaultNodeSize = 8;

    var nodeSize = defaultNodeSize * zoomfact;
    if ((element.kind == "sequenceActor") || (element.kind == "sequenceObject") || (element.kind == "sequenceLoopOrAlt") || (element.kind == "sequenceActivation")) {
        var mdNode = document.getElementById("md");
        mdNode.style.width = nodeSize + "px";
        mdNode.style.height = nodeSize + "px";
        mdNode.style.left = "calc(50% - " + (nodeSize / 4) + "px)";
        mdNode.style.bottom = "0%";
    }

    if (element.kind == "UMLSuperState") {
        var mdNode = document.getElementById("md");
        var muNode = document.getElementById("mu");
        mdNode.style.width = nodeSize + "px";
        muNode.style.width = nodeSize + "px";
        mdNode.style.height = nodeSize + "px";
        muNode.style.height = nodeSize + "px";
        mdNode.style.right = "calc(50% - " + (nodeSize / 2) + "px)";
        muNode.style.right = "calc(50% - " + (nodeSize / 2) + "px)";
    }

    var nodeSize = defaultNodeSize * zoomfact;
    var mrNode = document.getElementById("mr");
    var mlNode = document.getElementById("ml");
    var muNode = document.getElementById("mu");
    var mdNode = document.getElementById("md");
    mrNode.style.width = nodeSize + "px";
    mlNode.style.width = nodeSize + "px";
    mrNode.style.height = nodeSize + "px";
    mlNode.style.height = nodeSize + "px";
    mrNode.style.top = "calc(50% - " + (nodeSize / 2) + "px)";
    mlNode.style.top = "calc(50% - " + (nodeSize / 2) + "px)";
    muNode.style.width = nodeSize + "px";
    muNode.style.height = nodeSize + "px";
    muNode.style.top = "0%";
    muNode.style.left = "calc(50% - " + (nodeSize / 2) + "px)";
    mdNode.style.width = nodeSize + "px";
    mdNode.style.height = nodeSize + "px";
    mdNode.style.left = "calc(50% - " + (nodeSize / 2) + "px)";
    mdNode.style.bottom = "0%";

}

/**
 * @description Remove all elements with the class "node"
 */
function removeNodes() {
    // Get all elements with the class: "node"
    var nodes = document.getElementsByClassName("node");

    // For every node remove it
    while (nodes.length > 0) {
        nodes[0].remove();
    }
    return str;
}

/**
 * @description Draw and updates the rulers, depending on the window size and current position in the diagram.
 */
function drawRulerBars(X, Y) {
    //Get elements
    if (!settings.ruler.isRulerActive) return;

    let svgX = document.getElementById("ruler-x-svg");
    let svgY = document.getElementById("ruler-y-svg");
    //Settings - Ruler

    let pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    const lineRatio1 = 1;
    const lineRatio2 = 10;
    const lineRatio3 = 100;

    let barY = "";
    let barX = "";
    let cordY = 0;
    let cordX = 0;
    settings.ruler.ZF = 100 * zoomfact;
    let pannedY = (Y - settings.ruler.ZF) / zoomfact;
    let pannedX = (X - settings.ruler.ZF) / zoomfact;
    settings.ruler.zoomX = Math.round(((0 - zoomOrigo.x) * zoomfact));
    settings.ruler.zoomY = Math.round(((0 - zoomOrigo.y) * zoomfact));

    let verticalText
    if (zoomfact < 0.5) {
        verticalText = "writing-mode= 'vertical-lr'";
    } else {
        verticalText = " ";
    }

    //Calculate the visible range based on viewports dimenstions, current position and zoomfactor
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;

    let visibleRangeY = [
        (pannedY*-1),
        (pannedY*-1 + viewportHeight)
    ];
    let visibleRangeX = [
        (pannedX*-1) ,
        (pannedX*-1 + viewportWidth)
    ];


    //Draw the Y-axis ruler positive side.
    let lineNumber = (lineRatio3 - 1);
    for (let i = 100 + settings.ruler.zoomY; i <= pannedY - (pannedY * 2) + cheight; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (i > visibleRangeY[0] && i < visibleRangeY[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barY += "<line class='ruler-line' x1='0px' y1='" + (pannedY + i) + "' x2='40px' y2='" + (pannedY + i) + "'/>";
                barY += "<text class='ruler-text' x='10' y='" + (pannedY + i + 10) + "'style='font-size: 10px''>" + cordY + "</text>";
                cordY = cordY + 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if (zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) {
                    barY += "<text class='ruler-text' x='20' y='" + (pannedY + i + 10) + "'style='font-size: 8px''>" + (cordY - 10 + lineNumber / 10) + "</text>";
                    barY += "<line class='ruler-line' x1='20px' y1='" + (pannedY + i) + "' x2='40px' y2='" + (pannedY + i) + "'/>";
                } else {
                    barY += "<line class='ruler-line' x1='25px' y1='" + (pannedY + i) + "' x2='40px' y2='" + (pannedY + i) + "'/>";
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barY += "<line class='ruler-line' x1='32px' y1='" + (pannedY + i) + "' x2='40px' y2='" + (pannedY + i) + "'/>";
                } else {
                    barY += "<line class='ruler-line' x1='35px' y1='" + (pannedY + i) + "' x2='40px' y2='" + (pannedY + i) + "' />";
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordY = cordY + 10
            }
        }
    }
    //Draw the Y-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordY = -10;
    for (let i = -100 - settings.ruler.zoomY; i <= pannedY; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (-i > visibleRangeY[0] && -i < visibleRangeY[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barY += "<line class='ruler-line' x1='0px' y1='" + (pannedY - i) + "' x2='40px' y2='" + (pannedY - i) + "' />";
                barY += "<text class='ruler-text' x='10' y='" + (pannedY - i + 10) + "' style='font-size: 10px''>" + cordY + "</text>";
                cordY = cordY - 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if ((zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) && (cordY + 10 - lineNumber / 10) != 0) {
                    barY += "<text class='ruler-text' x='20' y='" + (pannedY - i + 10) + "' style='font-size: 8px''>" + (cordY + 10 - lineNumber / 10) + "</text>";
                    barY += "<line class='ruler-line' x1='20px' y1='" + (pannedY - i) + "' x2='40px' y2='" + (pannedY - i) + "' />";
                } else {
                    barY += "<line class='ruler-line' x1='25px' y1='" + (pannedY - i) + "' x2='40px' y2='" + (pannedY - i) + "' />";
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barY += "<line class='ruler-line' x1='32px' y1='" + (pannedY - i) + "' x2='40px' y2='" + (pannedY - i) + "'/>";
                } else {
                    barY += "<line class='ruler-line' x1='35px' y1='" + (pannedY - i) + "' x2='40px' y2='" + (pannedY - i) + "'/>";
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordY = cordY - 10;
            }
        }
    }
    svgY.style.boxShadow = "3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis

    //Draw the X-axis ruler positive side.
    lineNumber = (lineRatio3 - 1);
    for (let i = 50 + settings.ruler.zoomX; i <= pannedX - (pannedX * 2) + cwidth; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (i > visibleRangeX[0] && i < visibleRangeX[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barX += "<line class='ruler-line' x1='" + (i + pannedX) + "' y1='0' x2='" + (i + pannedX) + "' y2='40px'/>";
                barX += "<text class='ruler-text' x='" + (i + 5 + pannedX) + "'" + verticalText + "' y='15' style='font-size: 10px'>" + cordX + "</text>";
                cordX = cordX + 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if (zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) {
                    barX += "<text class='ruler-text' x='" + (i + 5 + pannedX) + "'" + verticalText + "' y='25' style='font-size: 8px'>" + (cordX - 10 + lineNumber / 10) + "</text>";
                    barX += "<line class='ruler-line' x1='" + (i + pannedX) + "' y1='20' x2='" + (i + pannedX) + "' y2='40px'/>";
                } else {
                    barX += "<line class='ruler-line' x1='" + (i + pannedX) + "' y1='25' x2='" + (i + pannedX) + "' y2='40px'/>";
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barX += "<line class='ruler-line' x1='" + (i + pannedX) + "' y1='32' x2='" + (i + pannedX) + "' y2='40px'/>";
                } else {
                    barX += "<line class='ruler-line' x1='" + (i + pannedX) + "' y1='35' x2='" + (i + pannedX) + "' y2='40px'/>";
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordX = cordX+10
            }
        }
    }
    //Draw the X-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordX = -10;
    for (let i = -50 - settings.ruler.zoomX; i <= pannedX; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (-i > visibleRangeX[0] && -i < visibleRangeX[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barX += "<line class='ruler-line' x1='" + (pannedX - i) + "' y1='0' x2='" + (pannedX - i) + "' y2='40px'/>";
                barX += "<text class='ruler-text' x='" + (pannedX - i + 5) + "'" + verticalText + "' y='15'style='font-size: 10px'>" + cordX + "</text>";
                cordX = cordX - 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if ((zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) && (cordX + 10 - lineNumber / 10) != 0) {
                    barX += "<text class='ruler-text' x='" + (pannedX - i + 5) + "'" + verticalText + "' y='25'style='font-size: 8px'>" + (cordX + 10 - lineNumber / 10) + "</text>";
                    barX += "<line class='ruler-line' x1='" + (pannedX - i) + "' y1='20' x2='" + (pannedX - i) + "' y2='40px'/>";
                } else {
                    barX += "<line class='ruler-line' x1='" + (pannedX - i) + "' y1='25' x2='" + (pannedX - i) + "' y2='40px'/>";
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barX += "<line class='ruler-line' x1='" + (pannedX - i) + "' y1='32' x2='" + (pannedX - i) + "' y2='40px'/>";
                } else {
                    barX += "<line class='ruler-line' x1='" + (pannedX - i) + "' y1='35' x2='" + (pannedX - i) + "' y2='40px'/>";
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordX = cordX - 10;
            }
        }
    }
    svgX.style.boxShadow = "3px 3px 6px #5c5a5a";
    svgX.innerHTML = barX;//Print the generated ruler, for X-axis
}

/**
 * @description Construct an string containing all the elements for an data-object.
 * @param {Object} element The object that should be drawn.
 * @param {boolean} ghosted Is the element an ghost element.
 * @return Returns an string containing the elements that should be drawn.
 */
function drawElement(element, ghosted = false) {
    let str = "";
    let texth = Math.round(zoomfact * textheight);
  
    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let canvasContext = canvas.getContext('2d');
    // Caclulate font width using some canvas magic
    canvasContext.font = `${texth}px ${canvasContext.font.split('px')[1]}`;
    let textWidth = canvasContext.measureText(element.name).width;

    //since toggleBorderOfElements checks the fill color to make sure we dont end up with white stroke on white fill, which is bad for IE and UML etc,
    //we have to have another variable for those strokes that are irrlevant of the elements fill, like sequence actor or state superstate.
    let actorFontColor = (isDarkTheme()) ? color.WHITE : color.GREY;

    if (errorActive) {
        // Checking for errors regarding ER Entities
        checkElementError(element);
        // Checks if element is involved with an error and outlines them in red
        for (let i = 0; i < errorData.length; i++) {
            if (element.id == errorData[i].id) element.stroke = 'red';
        }
    }

    // drawElement functions get their closing div at end of switch
    switch (element.kind) {
        case elementTypesNames.UMLEntity:
            str += drawElementUMLEntity(element, ghosted);
            break;
        case elementTypesNames.SDEntity:
            str += drawElementSDEntity(element, ghosted);
            break;
        case elementTypesNames.UMLInitialState:
            let initVec = `
                <g transform="matrix(1.14286,0,0,1.14286,-6.85714,-2.28571)" >
                    <circle cx="16.5" cy="12.5" r="10.5" />
                </g>`
            str += drawElementState(element, ghosted, initVec);
            break;
        case elementTypesNames.UMLFinalState:
            let finalVec = `
                <g> 
                    <path 
                        d=" M 12,-0
                            C 18.623,-0 24,5.377 24,12
                            C 24,18.623 18.623,24 12,24
                            C 5.377,24 -0,18.623 -0,12
                            C -0,5.377 5.377,-0 12,-0 Z
                            M 12,2C17.519,2 22,6.481 22,12
                            C 22,17.519 17.519,22 12,22
                            C 6.481,22 2,17.519 2,12
                            C 2,6.481 6.481,2 12,2 Z"
                    />
                    <circle 
                        transform="matrix(1.06667,0,0,1.06667,-3.46667,-3.46667)" 
                        cx="14.5" cy="14.5" r="5.5"
                    /> 
                </g>`
            str += drawElementState(element, ghosted, finalVec);
            break;
        case elementTypesNames.UMLSuperState:
            str += drawElementSuperState(element, ghosted, textWidth);
            break;
        case elementTypesNames.IEEntity:
            str += drawElementIEEntity(element, ghosted);
            break;
        case elementTypesNames.UMLRelation:
            str += drawElementUMLRelation(element, ghosted);
            break;
        case elementTypesNames.IERelation:
            str += drawElementIERelation(element, ghosted);
            break;
        case elementTypesNames.sequenceActor:
            str += drawElementSequenceActor(element, ghosted, textWidth);
            break;
        case elementTypesNames.sequenceObject:
            str += drawElementSequenceObject(element, ghosted);
            break;
        case elementTypesNames.sequenceActivation:
            str += drawElementSequenceActivation(element, ghosted);
            break;
        case elementTypesNames.sequenceLoopOrAlt:
            str += drawElementSequenceLoopOrAlt(element, ghosted, actorFontColor);
            break;
        case 'note': // TODO: Find why this doesnt follow elementTypesNames naming convention
            str += drawElementNote(element, ghosted);
            break;
        case elementTypesNames.EREntity:
            str += drawElementEREntity(element, ghosted);
            break;
        case elementTypesNames.ERRelation:
            str += drawElementERRelation(element, ghosted, textWidth);
            break;
        case elementTypesNames.ERAttr:
            str += drawElementERAttr(element, ghosted, textWidth);
            break;
    }
    if (element.isLocked) {
        str += `<img 
                    id='pad_lock' 
                    width='${zoomfact * 20}' 
                    height='${zoomfact * 25}' 
                    src='../Shared/icons/pad_lock.svg'
                    alt='Padlock'
                />`;
    }
    str += "</div>";
    return str;
}

const splitLengthyLine = (s, max) => {
    if (s.length <= max) return s;
    return [s.substring(0, max)].concat(splitLengthyLine(s.substring(max), max));
}

function splitFull(e, max) {
    return e.map(line => splitLengthyLine(line, max)).flat()
}

function updateElementHeight(arr, element, height) {
    // Removes the previouse value in IEHeight for the element
    for (let i = 0; i < arr.length; i++) {
        if (element.id == arr[i].id) arr.splice(i, 1);
    }
    // Calculate and store the IEEntity's real height
    arr.push( {
        id: element.id,
        height: height
    });
}

const drawDiv = (c, style, s) => `<div class='${c}' style='${style}'> ${s} </div>`;
const drawSvg = (w, h, s, extra='') =>`<svg width='${w}' height='${h}' ${extra}> ${s} </svg>`;
const drawRect = (w, h, l, e, extra=`fill='${e.fill}'`) => {
    return `<rect 
                class='text' x='${l}' y='${l}' 
                width='${w - l * 2}' height='${h - l * 2}' 
                stroke-width='${l}' stroke='${e.stroke}' 
                ${extra} 
            />`;
}
const drawText = (x, y, a, t, extra='') => {
    return `<text
                class='text' x='${x}' y='${y}' 
                dominant-baseline='auto' text-anchor='${a}' ${extra}
            > ${t} </text>`;
}

function drawElementUMLEntity(element, ghosted) {
    let str = "";
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact); // Only used for extra whitespace from resize
    let texth = Math.round(zoomfact * textheight);
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;

    const aText = splitFull(element.attributes, maxCharactersPerLine);
    const fText = splitFull(element.functions, maxCharactersPerLine);

    let aHeight = texth * (aText.length + 1) * lineHeight;
    let fHeight = texth * (fText.length + 1) * lineHeight;
    let totalHeight = aHeight + fHeight - linew * 2 + texth * 2;
    updateElementHeight(UMLHeight, element, totalHeight + boxh)

    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}' 
                class='element uml-element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();' 
                style='left:0; top:0; width:${boxw}px; font-size:${texth}px; z-index:1;${ghostStr}'
            >`;

    // Header
    let height = texth * 2;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headRect + headText);
    str += drawDiv( 'uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);

    // Content, Attributes
    const textBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh / 2;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let rect = drawRect(boxw, height, linew, element);
        let contentSvg = drawSvg(boxw, height, rect + text);
        let style = (css == 'uml-footer') ? `height:${height}px` : `height:${height - linew * 2}px`;
        return drawDiv(css, style, contentSvg);
    }

    str += textBox(aText, 'uml-content');
    str += textBox(fText, 'uml-footer');
    return str;
}

function drawElementSDEntity(element, ghosted){
    let str = "";
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let texth = Math.round(zoomfact * textheight);
    let cornerRadius = Math.round(20 * zoomfact); //determines the corner radius for the SD states.
    const maxCharactersPerLine = Math.floor(boxw / texth * 1.75);
    const lineHeight = 1.5;

    const text = splitFull(element.attributes, maxCharactersPerLine);

    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight =  tHeight - linew * 2 + texth * 2;
    updateElementHeight(SDHeight, element, totalHeight + boxh)

    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}' 
                class='element uml-element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();' 
                style='left:0; top:0; width:${boxw}px; font-size:${texth}px; z-index:1};${ghostStr}'
            >`

    let height = texth * 2;
    let headPath = `
        <path 
            d="M ${linew + cornerRadius},${linew}
                h ${boxw - linew * 2 - cornerRadius * 2}
                a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius}
                v ${height - linew * 2 - cornerRadius}
                h ${(boxw - linew * 2) * -1}
                v ${(height - linew * 2 - cornerRadius) * -1}
                a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius * -1}
                z"
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill}'
        />`
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headPath + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px;`, headSvg);

    const drawBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let path = `
            <path 
                class="text"
                d="M ${linew},${(linew)}
                    h ${boxw - linew * 2}
                    v ${height - linew * 2 - cornerRadius }
                    a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius * -1},${cornerRadius}
                    h ${(boxw - linew * 2 - cornerRadius * 2) * -1}
                    a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius * -1},${cornerRadius * -1}
                    v ${(height - linew * 2 - cornerRadius) * -1}
                    z"
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;
        let contentSvg = drawSvg(boxw, height, path + text);
        let style = `height:${height}px`;
        return drawDiv(css, style, contentSvg);
    }

    str += drawBox(text, 'uml-content');
    return str;
}

function drawElementIEEntity(element, ghosted) {
    let str = "";
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact); // Only used for extra whitespace from resize
    let texth = Math.round(zoomfact * textheight);
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;

    const text = splitFull(element.attributes, maxCharactersPerLine);

    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight =  tHeight - linew * 2 + texth * 2;
    updateElementHeight(IEHeight, element, totalHeight + boxh)

    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}' 
                class='element uml-element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();' 
                style='left:0; top:0; width:${boxw}px; font-size:${texth}px; z-index:1;${ghostStr}'
            >`;

    let height = texth * 2;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headRect + headText);
    str += drawDiv( 'uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);

    // Content, Attributes
    const textBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let rect = drawRect(boxw, height, linew, element);
        let contentSvg = drawSvg(boxw, height, rect + text);
        let style = `height:${height}px`;
        return drawDiv(css, style, contentSvg);
    }

    str += textBox(text, 'uml-content');
    return str;
}

function drawElementState(element, ghosted, vectorGraphic) {
    let ghostPreview = ghostLine ? 0 : 0.4;
    const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
    var boxw = Math.round(element.width * zoomfact);
    var boxh = Math.round(element.height * zoomfact);
    const theme = document.getElementById("themeBlack");
    if (element.fill == color.BLACK && theme.href.includes('blackTheme')) {
        element.fill = color.WHITE;
    } else if (element.fill == color.WHITE && theme.href.includes('style')) {
        element.fill = color.BLACK;
    }
    return `<div id="${element.id}" 
                class="element uml-state"
                style="margin-top:${((boxh / 2.5))}px;width:${boxw}px;height:${boxh}px;z-index:1;${ghostAttr}" 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'>
                <svg width="100%" height="100%" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg" 
                    xml:space="preserve"
                    style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                    ${vectorGraphic}
                </svg>`;
}

function drawElementSuperState(element, ghosted, textWidth) {
    let str = "";
    let ghostPreview = ghostLine ? 0 : 0.4;
    const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let linew = Math.round(strokewidth * zoomfact);
    element.stroke = (isDarkTheme()) ? color.WHITE : color.BLACK;

    str += `<div id="${element.id}" 
                class="element uml-Super"
                style="margin-top:${boxh * 0.025}px;width:${boxw}px;height:${boxh}px;${ghostAttr}"
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
            >`;

    let rectOne = drawRect(boxw, boxh, linew, element, `fill='none' fill-opacity='0' rx='20'`);
    let rectTwo = drawRect(textWidth + 40 * zoomfact, 50 * zoomfact, linew, element, `fill='${element.fill}' fill-opacity="1"`);
    let text = drawText(20 * zoomfact, 30 * zoomfact, 'start', element.name, `font-size='${20 * zoomfact}px'`);
    str += drawSvg(boxw, boxh, rectOne + rectTwo + text);
    return str;
}

function drawElementSequenceActor(element, ghosted, textWidth) {
    let str = "";
    let content;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let texth = Math.round(zoomfact * textheight);
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}'
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1; ${ghostStr}'
            >`;
    content = `<path 
                    class="text" 
                    d="M${boxw / 2 + linew},${boxw / 4 + linew} V${boxh}"
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    stroke-dasharray='${linew * 3},${linew * 3}'
                    fill='transparent'
                />
                <g>
                    <circle 
                        cx="${(boxw / 2) + linew}" 
                        cy="${(boxw / 8) + linew}" 
                        r="${boxw / 8}px" 
                        fill='${element.fill}' stroke='${element.stroke}' stroke-width='${linew}'
                    />
                    <path 
                        class="text"
                        d="M${(boxw / 2) + linew},${(boxw / 4) + linew}
                            v${boxw / 6}
                            m-${(boxw / 4)},0
                            h${boxw / 2}
                            m-${(boxw / 4)},0
                            v${boxw / 3}
                            l${boxw / 4},${boxw / 4}
                            m${(boxw / 4) * -1},${(boxw / 4) * -1}
                            l${(boxw / 4) * -1},${boxw / 4} "
                        stroke-width='${linew}'
                        stroke='${element.stroke}'
                        fill='transparent'
                    />
                    <rect 
                        class='text'
                        x='${(boxw - textWidth) / 2}'
                        y='${boxw + (linew * 2)}'
                        width='${textWidth}'
                        height='${texth - linew}'
                        stroke='none'
                        fill='${element.fill}'
                    />
                    <text 
                        class='text' 
                        x='${boxw / 2}' 
                        y='${boxw + texth / 2 + linew * 2}' 
                        dominant-baseline='middle' 
                        text-anchor='middle'
                    > ${element.name} </text>
                </g>`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

function drawElementSequenceObject(element, ghosted) {
    let str = "";
    let content;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let texth = Math.round(zoomfact * textheight);
    var sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}'
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1; ${ghostStr}'
            >`;
    content = `<path 
                    class="text" 
                    d="M ${boxw / 2 + linew},${boxw / 4 + linew}
                        V ${boxh}"
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    stroke-dasharray='${linew * 3},${linew * 3}'
                    fill='transparent'
                /> 
                <g>
                    <rect 
                        class='text'
                        x='${linew}'
                        y='${linew}'
                        width='${boxw - linew * 2}'
                        height='${(boxw / 2) - linew}'
                        rx='${sequenceCornerRadius}'
                        stroke-width='${linew}'
                        stroke='${element.stroke}'
                        fill='${element.fill}' 
                    />
                    <text 
                        class='text' 
                        x='${boxw / 2}' 
                        y='${(boxw / 2 - linew) / 2}' 
                        dominant-baseline='middle' 
                        text-anchor='middle'
                    > ${element.name} </text>
                </g>`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

function drawElementSequenceActivation(element, ghosted) {
    let str = "";
    let content;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    var sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.
    let ghostStr = (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}'
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; z-index:1; ${ghostStr}'
            >`;
    content = `<rect 
                    x='${linew}' y='${linew}' 
                    width='${boxw - linew * 2}' height='${boxh - linew * 2}' 
                    rx='${sequenceCornerRadius * 3}' 
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}'
                />`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

function drawElementSequenceLoopOrAlt(element, ghosted, actorFontColor) {
    let str = "";
    let content;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let texth = Math.round(zoomfact * textheight);

    let altLen = element.alternatives.length;
    if (element.alternatives) boxh += 125 * zoomfact * altLen;
    element.altOrLoop = (altLen > 1) ? "Alt" : "Loop";

    let ghostStr = (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}'
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1; ${ghostStr}'
            >`;

    content = `<rect 
                    class='text'
                    x='${linew}'
                    y='${linew}'
                    width='${boxw - linew * 2}'
                    height='${boxh - linew * 2}'
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    fill='none'
                    rx='${7 * zoomfact}'
                    fill-opacity="0"
                />`;
    //if it has alternatives, iterate and draw them out one by one, evenly spaced out.
    if (element.alternatives.length > 0) {
        for (let i = 1; i < element.alternatives.length; i++) {
            content += `<path class="text"
                            d="M ${boxw - linew},${(boxh / element.alternatives.length) * i}
                                H ${linew} "
                            stroke-width='${linew}'
                            stroke='${element.stroke}'
                            stroke-dasharray='${linew * 3},${linew * 3}'
                            fill='transparent'
                        />`;
            content += drawText(linew * 2,
                (boxh / element.alternatives.length) * i + texth / 1.5 + linew * 2,
                'auto', element.alternatives[i], `fill='${actorFontColor}'`
            );
        }
    }
    //svg for the small label in top left corner
    content += `<path 
                    d="M ${(7 * zoomfact) + linew},${linew}
                        h ${100 * zoomfact}
                        v ${25 * zoomfact}
                        l ${-12.5 * zoomfact},${12.5 * zoomfact}
                        H ${linew}
                        V ${linew + (7 * zoomfact)}
                        a ${7 * zoomfact},${7 * zoomfact} 0 0 1 ${7 * zoomfact},${(7 * zoomfact) * -1}
                        z" 
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    fill='${element.fill}'
                />`;
    let textOne = drawText(50 * zoomfact + linew, 18.75 * zoomfact + linew, 'middle', element.altOrLoop);
    let textTwo = drawText( linew * 2, 37.5 * zoomfact + linew * 3 + texth / 1.5, 'auto', element.alternatives[0], `fill=${actorFontColor}` );
    str += drawSvg(boxw, boxh, content + textOne + textTwo);
    return str;
}

function drawElementNote(element, ghosted) {
    let str = "";
    let content;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let texth = Math.round(zoomfact * textheight);

    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;

    const text = splitFull(element.attributes, maxCharactersPerLine);
    let length = (text.length > 4) ? text.length : 4;
    let totalHeight = boxh * (1 + length) / 2;
    updateElementHeight(NOTEHeight, element, totalHeight);
    element.stroke = (element.fill == color.BLACK) ? color.WHITE : color.BLACK;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                    id='${element.id}' 
                    class='element uml-element' 
                    onmousedown='ddown(event);' 
                    onmouseenter='mouseEnter();' 
                    onmouseleave='mouseLeave();' 
                    style='left:0; top:0; width:${boxw}px; font-size:${texth}px; z-index:1;${ghostStr}'
                >`;

    content += `<path class="text"
                        d=" M ${linew},${linew}
                            v ${boxh * (1 + length) / 2 - linew * 2}
                            h ${boxw - linew * 2}
                            v -${boxh * (1 + length) / 2 - linew * 2 - (boxh - linew * 2) * 0.5}  
                            l -${(boxw - linew * 2) * 0.12},-${(boxh - linew * 2) * 0.5} 
                            h 1
                            h -1
                            v ${(boxh - linew * 2) * 0.5} 
                            h ${(boxw - linew * 2) * 0.12}
                            v 1
                            v -1
                            l -${(boxw - linew * 2) * 0.12},-${(boxh - linew * 2) * 0.5}
                            h -${(boxw - linew * 2) * 0.885} "
                        stroke-width='${linew}'
                        stroke='${element.stroke}'
                        fill='${element.fill}'
                    />`;
    for (let i = 0; i < text.length; i++) {
        content += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', text[i]);
    }
    str += drawSvg(boxw, boxh * (1 + length) / 2, content);
    return str;
}

function drawElementUMLRelation(element, ghosted) {
    let str = "";
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    str += `<div 
                id='${element.id}' 
                class='element uml-element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; z-index:1;${ghostStr}'
            >`;

    let fill = (element.state == 'overlapping') ? 'black' : 'white';
    let poly = `
        <polygon 
            points='${linew},${boxh - linew} ${boxw / 2},${linew} ${boxw - linew},${boxh - linew}' 
            style='fill:${fill}; stroke:black; stroke-width:${linew};'
        />`;
    str += drawSvg(boxw, boxh, poly);
    return str;
}

function drawElementIERelation(element, ghosted) {
    let str = "";
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';

    str += `<div 
                id='${element.id}' 
                class='element ie-element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh / 2}px; z-index:1;${ghostStr}'
            >`;

    let content = "";
    content += `<circle cx="${boxw / 2}" cy="0" r="${boxw / 2.08}" fill='white' stroke='black' /> 
                <line x1="0" y1="${boxw / 50}" x2="${boxw}" y2="${boxw / 50}" stroke='black' />`

    if (element.state != inheritanceStateIE.OVERLAPPING) {
        content += `<line x1="${boxw / 1.6}" y1="${boxw / 2.9}" x2="${boxw / 2.6}" y2="${boxw / 12.7}" stroke='black' />
                    <line x1="${boxw / 2.6}" y1="${boxw / 2.87}" x2="${boxw / 1.6}" y2="${boxw / 12.7}" stroke='black' />`
    }
    str += drawSvg(boxw, boxh / 2, content, `style='transform:rotate(180deg); stroke-width:${linew};'`);
    return str;
}

function drawElementEREntity(element, ghosted) {
    let str = "";
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    var hboxh = Math.round(element.height * zoomfact * 0.5);
    let texth = Math.round(zoomfact * textheight);
    const multioffs = 3;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';

    str += `<div 
                id='${element.id}' 
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1;${ghostStr}'
            >`;

    let weak = '';
    if (element.state == "weak") {
        weak = `<rect
                    x='${linew * multioffs}' 
                    y='${linew * multioffs}' 
                    width='${boxw - (linew * multioffs * 2)}' 
                    height='${boxh - (linew * multioffs * 2)}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                />`;
    }
    let rect = drawRect(boxw, boxh, linew, element);
    let text = drawText(boxw / 2, boxh / 2 + texth / 3, 'middle', element.name);
    str += drawSvg(boxw, boxh, rect + weak + text);
    return str;
}

function drawElementERRelation(element, ghosted) {
    let str = "";
    let content;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    var hboxh = Math.round(element.height * zoomfact * 0.5);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var texth = Math.round(zoomfact * textheight);
    const multioffs = 3;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';

    str += `<div 
                id='${element.id}' 
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1;${ghostStr}'
            >`;

    let weak = "";
    if (element.state == "weak") {
        weak = `<polygon 
                    points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                    class="text"
                /> `;
    }
    content += `<polygon 
                    points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                    class="text"
                />
                ${weak}
                <text 
                    x='50%' y='50%' 
                    dominant-baseline='middle' 
                    text-anchor='middle'
                > ${element.name.slice(0, element.name.length)} </text>`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

function drawElementERAttr(element, ghosted, textWidth) {
    let str = "";
    let content;
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var hboxh = Math.round(element.height * zoomfact * 0.5);
    var texth = Math.round(zoomfact * textheight);
    const multioffs = 3;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr =  (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';

    str += `<div 
                id='${element.id}' 
                class='element' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();' 
                onmouseleave='mouseLeave();'
                style='left:0; top:0; width:${boxw}px; height:${boxh}px; font-size:${texth}px; z-index:1;${ghostStr}'
            >`;

    if (element.state) {
        let dash = (element.state == "computed") ? "stroke-dasharray='4 4'" : '';
        content += `<path 
                        d="M${linew},${hboxh} 
                            Q${linew},${linew} ${hboxw},${linew} 
                            Q${boxw - linew},${linew} ${boxw - linew},${hboxh} 
                            Q${boxw - linew},${boxh - linew} ${hboxw},${boxh - linew} 
                            Q${linew},${boxh - linew} ${linew},${hboxh}" 
                        stroke='${element.stroke}' fill='${element.fill}' ${dash} stroke-width='${linew}' 
                        class="text" 
                    />`
    }
    let extra = '';
    switch (element.state) {
        case "multiple":
            content += `<path 
                            d="M${linew * multioffs},${hboxh} 
                                Q${linew * multioffs},${linew * multioffs} ${hboxw},${linew * multioffs} 
                                Q${boxw - (linew * multioffs)},${linew * multioffs} ${boxw - (linew * multioffs)},${hboxh} 
                                Q${boxw - (linew * multioffs)},${boxh - (linew * multioffs)} ${hboxw},${boxh - (linew * multioffs)} 
                                Q${linew * multioffs},${boxh - (linew * multioffs)} ${linew * multioffs},${hboxh}" 
                            stroke='${element.stroke}' fill='${element.fill}' stroke-width='${linew}' 
                        />`;
            break;
        case "weakKey":
            content += `<line 
                            x1="${(boxw - textWidth) / 2}" 
                            y1="${hboxh + texth * 0.5 + 1}" 
                            x2="${(boxw + textWidth) / 2}" 
                            y2="${hboxh + texth * 0.5 + 1}" 
                            stroke="${element.stroke}" stroke-dasharray="${5 * zoomfact}" stroke-width="${linew}"
                        />`;
            break;
        case "primary":
        case "candidate":
            extra = `class='underline'`;
            break;
    }
    content += `<text 
                    x='${boxw / 2}' y='${hboxh}' ${extra} 
                    dominant-baseline='middle' text-anchor='middle'
                > ${element.name} </text>`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

/**
 * @description Updates the elements translations and redraw lines.
 * @param {number || null} deltaX The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the X-axis.
 * @param {number || null} deltaY The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the Y-axis.
 */
function updatepos() {
    updateCSSForAllElements();
    // Update svg backlayer -- place everyhing to draw OVER elements here
    var str = "";
    str = redrawArrows(str);
    document.getElementById("svgbacklayer").innerHTML = str;

    // Update svg overlay -- place everyhing to draw OVER elements here
    str = "";
    str = boxSelect_Draw(str);
    //str = selectionAllIndividualElements(str);
    if (mouseButtonDown == false) str = drawSelectionBox(str);

    document.getElementById("svgoverlay").innerHTML = str;

    // Updates nodes for resizing
    removeNodes();
    if (context.length === 1 && mouseMode == mouseModes.POINTER && (context[0].kind != "UMLRelation" && context[0].kind != elementTypesNames.IERelation)) addNodes(context[0]);
}

/**
 * @description Error checking for lines
 * @param {Object} element Element to be checked for errors.
 */
function checkLineErrors(lines) {
    var line;

    // Error checking for lines
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        var fElement = data[findIndex(data, line.fromID)];
        var tElement = data[findIndex(data, line.toID)];

        //Checking for cardinality
        if ((fElement.kind == elementTypesNames.EREntity && tElement.kind == elementTypesNames.ERRelation) || (tElement.kind == elementTypesNames.EREntity && fElement.kind == elementTypesNames.ERRelation)) {
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
    let keyQuantity, primaryCount, strongEntity, weakrelation;
    let fElement, fElement0, fElement1, tElement, tElement0, tElement1, line, line0, line1;

    // Checks for entities with the same name
    for (let i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id) {
            errorData.push(element);
        }
    }

    // Checks for entity connected to another entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
        strongEntity = 0;
        weakrelation = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if weak entity is related to a strong entity or a weak entity with a relation
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && tElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.EREntity && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.EREntity && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && fElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.EREntity && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.EREntity && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }

            // Counting weak relations
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && tElement.state == "weak") {
                weakrelation += 1;
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && fElement.state == "weak") {
                weakrelation += 1;
            }
        }
        // Checks if element has one relation to a strong entity
        if (strongEntity != 1) {
            errorData.push(element);
        }

        for (let i = 0; i < lines.length; i++) {
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
    } else {
        keyQuantity = 0;
        primaryCount = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (tElement.state == "primary") {
                    primaryCount += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (fElement.state == "primary") {
                    primaryCount += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

        }

        for (let i = 0; i < lines.length; i++) {
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
    let lineQuantity, line, fElement, tElement;

    // Checks for relation connected to another relation
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
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
    for (let i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id && data[i].kind == elementTypesNames.ERRelation) {

            // Checking if relations have same line types
            var linesChecked = [];
            for (let k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line0;
                var fElement0;
                var tElement0;

                if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
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
                if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.EREntity && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
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
            for (let k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line1;
                var fElement1;
                var tElement1;
                var line2;
                var fElement2;
                var tElement2;

                if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (let j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.ERAttr && tElement0.state == tElement.state && tElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.ERAttr && fElement0.state == tElement.state && fElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
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
                if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (let j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == elementTypesNames.ERAttr && tElement0.state == fElement.state && tElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == elementTypesNames.ERAttr && fElement0.state == fElement.state && fElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == elementTypesNames.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == elementTypesNames.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
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
            for (let j = 0; j < lines.length; j++) {
                line = lines[j];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                    elementAttrCount += 1;
                }
                if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                    elementAttrCount += 1;
                }

                if (fElement.id == data[i].id && tElement.kind == elementTypesNames.ERAttr) {
                    dataAttrCount += 1;
                }
                if (tElement.id == data[i].id && fElement.kind == elementTypesNames.ERAttr) {
                    dataAttrCount += 1;
                }
            }
            if (elementAttrCount != dataAttrCount) {
                errorData.push(element);
            }
        }
    }

    // Checking for attribute with same name on relation
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    if (element.state == "weak") {
        lineQuantity = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong line type to a relation
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity && tElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity && fElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            var line0;
            var fElement0;
            var tElement0;

            // Checking for more than one Normal line to a weak relation
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity && tElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity && fElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                }
            }

            // Checking for more than one double line to a weak relation
            if (fElement.id == element.id && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
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
                for (let j = 0; j < lines.length; j++) {
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
            if ((tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) || (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity)) {
                lineQuantity += 1;
            }
        }
    } else {
        lineQuantity = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Counting connected lines
            if ((tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) || (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity)) {
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
    let line, line0, line1;
    let fElement, fElement0, fElement1;
    let tElement, tElement0, tElement1;
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        // Checking for non-normal attributes on a attribute
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }

        // Checking for 2nd line attribute connected with a 3rd attribute
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == elementTypesNames.ERAttr && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Checking for 3rd line attribute connected with a 2nd attribute
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == elementTypesNames.ERAttr && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Attribute connected to more than one relation or entity
        if (fElement.id == element.id && (tElement.kind == elementTypesNames.EREntity || tElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }

        // 2nd line attribute connected to another relation or entity
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Check for 1st line attribute connected in a 3 line attribute chain
        if (fElement.id == element.id && (tElement.kind == elementTypesNames.EREntity || tElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Checking for wrong key type
        if ((tElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.EREntity) && (tElement.state == "weak" || fElement.state == "weak")) {
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(tElement);
                }
            }
        } else {
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
                if (fElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
                if (tElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }
        }

        // Checking for attributes on the same relation with the same name
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }

        // Checking for key attributes on relation
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && (fElement.state == "primary" || fElement.state == "candidate" || fElement.state == "weakKey")) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && (tElement.state == "primary" || tElement.state == "candidate" || tElement.state == "weakKey")) {
            errorData.push(element);
        }

        // Checking for attributes connected with the same name
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }

        // Checking for attributes on the same entity
        if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
            var currentAttr = fElement;
            var currentEntity = tElement;
            for (let j = 0; j < lines.length; j++) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
            var currentAttr = tElement;
            var currentEntity = fElement;
            for (let j = 0; j < lines.length; j++) {
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
function checkElementError(element) {
    if (element.kind == elementTypesNames.EREntity) checkEREntityErrors(element)
    if (element.kind == elementTypesNames.ERRelation) checkERRelationErrors(element)
    if (element.kind == elementTypesNames.ERAttr) checkERAttributeErrors(element)

    // Check lines
    checkLineErrors(lines);
}

/**
 * @description Sets every elements stroke to black.
 * @param {Object} elements List of all elements.
 */
function errorReset(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].stroke = strokeColors;
    }
}

/**
 * @description Updates the Label position on the line.
 * @param {number} newPosX The position the mouse is at in the X-axis.
 * @param {number} newPosY The position the mouse is at in the Y-axis.
 */
function updateLabelPos(newPosX, newPosY) {
    targetLabel.labelMoved = true;
    if (newPosX + targetLabel.width < targetLabel.highX && newPosX - targetLabel.width > targetLabel.lowX) {
        targetLabel.labelMovedX = (newPosX - targetLabel.centerX);
    } else if (newPosX - targetLabel.width < targetLabel.lowX) {
        targetLabel.labelMovedX = (targetLabel.lowX + targetLabel.width - (targetLabel.centerX));
    } else if (newPosX + targetLabel.width > targetLabel.highX) {
        targetLabel.labelMovedX = (targetLabel.highX - targetLabel.width - (targetLabel.centerX));
    }
    if (newPosY + targetLabel.height < targetLabel.highY && newPosY - targetLabel.height > targetLabel.lowY) {
        targetLabel.labelMovedY = (newPosY - (targetLabel.centerY));
    } else if (newPosY - targetLabel.height < targetLabel.lowY) {
        targetLabel.labelMovedY = (targetLabel.lowY + targetLabel.height - (targetLabel.centerY));
    } else if (newPosY + targetLabel.height > targetLabel.highY) {
        targetLabel.labelMovedY = (targetLabel.highY - targetLabel.height - (targetLabel.centerY));
    }
    calculateProcentualDistance(targetLabel);
    calculateLabelDisplacement(targetLabel);
    displaceFromLine(newPosX, newPosY);
}

function calculateProcentualDistance(objectLabel) {
    // Math to calculate procentuall distance from/to centerpoint
    var diffrenceX = objectLabel.highX - objectLabel.lowX;
    var diffrenceY = objectLabel.highY - objectLabel.lowY;
    if (objectLabel.labelMovedX > objectLabel.highX - objectLabel.lowX) {
        objectLabel.labelMovedX = objectLabel.highX - objectLabel.lowX;
    } else if (objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX) {
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    if (objectLabel.labelMovedY > objectLabel.highY - objectLabel.lowY) {
        objectLabel.labelMovedY = objectLabel.highY - objectLabel.lowY;
    } else if (objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX) {
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    var distanceToX1 = objectLabel.centerX + objectLabel.labelMovedX - objectLabel.fromX;
    var distanceToY1 = objectLabel.centerY + objectLabel.labelMovedY - objectLabel.fromY;
    var lenghtToNewPos = Math.abs(Math.sqrt(distanceToX1 * distanceToX1 + distanceToY1 * distanceToY1));
    var entireLinelenght = Math.abs(Math.sqrt(diffrenceX * diffrenceX + diffrenceY * diffrenceY));
    objectLabel.percentOfLine = lenghtToNewPos / entireLinelenght;
    // Making sure the procent is less than 0.5 to be able to use them from the centerpoint of the line as well as ensuring the direction is correct 
    if (objectLabel.percentOfLine < 0.5) {
        objectLabel.percentOfLine = 1 - objectLabel.percentOfLine;
        objectLabel.percentOfLine = objectLabel.percentOfLine - 0.5;
    } else if (objectLabel.percentOfLine > 0.5) {
        objectLabel.percentOfLine = -(objectLabel.percentOfLine - 0.5);
    }
    if (!objectLabel.labelMoved) {
        objectLabel.percentOfLine = 0;
    }
    //changing the direction depending on how the line is drawn
    if (objectLabel.fromX < objectLabel.centerX) { //left to right
        objectLabel.labelMovedX = -objectLabel.percentOfLine * diffrenceX;
    } else if (objectLabel.fromX > objectLabel.centerX) {//right to left
        objectLabel.labelMovedX = objectLabel.percentOfLine * diffrenceX;
    }

    if (objectLabel.fromY < objectLabel.centerY) { //down to up
        objectLabel.labelMovedY = -objectLabel.percentOfLine * diffrenceY;
    } else if (objectLabel.fromY > objectLabel.centerY) { //up to down
        objectLabel.labelMovedY = objectLabel.percentOfLine * diffrenceY;
    }
}

/**
 * @description calculates how the label should be displacesed
 */
function calculateLabelDisplacement(labelObject) {
    var diffrenceX = labelObject.highX - labelObject.lowX;
    var diffrenceY = labelObject.highY - labelObject.lowY;
    var entireLinelenght = Math.abs(Math.sqrt(diffrenceX * diffrenceX + diffrenceY * diffrenceY));
    var baseLine, angle, displacementConstant = labelObject.height, storeX, storeY;
    var distanceToOuterlines = {storeX, storeY}
    // define the baseline used to calculate the angle
    if ((labelObject.fromX - labelObject.toX) > 0) {
        if ((labelObject.fromY - labelObject.toY) > 0) { // up left
            baseLine = labelObject.fromY - labelObject.toY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (((90 - angle) / 5) - displacementConstant) * 2.2;
            distanceToOuterlines.storeY = (displacementConstant - (angle / 5)) * 1.2;
        } else if ((labelObject.fromY - labelObject.toY) < 0) { // down left
            baseLine = labelObject.toY - labelObject.fromY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle + 90) / 5)) * 2.2;
            distanceToOuterlines.storeY = (displacementConstant + (angle / 5)) * 1.2;
        }
    } else if ((labelObject.fromX - labelObject.toX) < 0) {
        if ((labelObject.fromY - labelObject.toY) > 0) { // up right
            baseLine = labelObject.toY - labelObject.fromY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (((90 - angle) / 5) - displacementConstant) * 2.2;
            distanceToOuterlines.storeY = ((angle / 5) - displacementConstant) * 1.2;
        } else if ((labelObject.fromY - labelObject.toY) < 0) { // down right
            baseLine = labelObject.fromY - labelObject.toY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle + 90) / 5)) * 2.2;
            distanceToOuterlines.storeY = (-displacementConstant - (angle / 5)) * 1.2;
        }
    }
    return distanceToOuterlines;
}

/**
 * @description checks if the label should be detached.
 * @param {Interger} newX The position the mouse is at in the X-axis.
 * @param {Interger} newY The position the mouse is at in the Y-axis.
 */
function displaceFromLine(newX, newY) {
    //calculates which side of the line the point is.
    var y1 = targetLabel.fromY, y2 = targetLabel.toY, x1 = targetLabel.fromX, x2 = targetLabel.toX;
    var distance = ((newX - x1) * (y2 - y1)) - ((newY - y1) * (x2 - x1));
    //deciding which side of the line the label should be
    if (distance > 6000) {
        targetLabel.labelGroup = 1;
    } else if (distance < -6000) {
        targetLabel.labelGroup = 2;
    } else {
        targetLabel.labelGroup = 0;
    }
}

/**
 * @description Updates the variables for the size of the container-element.
 */
function updateContainerBounds() {
    var containerbox = container.getBoundingClientRect();
    cwidth = containerbox.width;
    cheight = containerbox.height;
}

/**
 * @description Draw the box around the selected elements.
 * @param {String} str The string that the SVG-element is added to.
 * @return The populated string with the selection box rect.
 */
function drawSelectionBox(str) {
    deleteBtnX = 0;
    deleteBtnY = 0;
    deleteBtnSize = 0;

    if (((context.length != 0 || contextLine.length != 0) && mouseMode != mouseModes.EDGE_CREATION) || mouseMode == mouseModes.EDGE_CREATION && context.length == 0 && contextLine.length != 0) {
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
            for (let i = 0; i < context.length; i++) {
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
            for (let i = 0; i < contextLine.length; i++) {
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
            } else {
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
            for (let i = 0; i < tempLines.length; i++) {
                var hasPoints = tempLines[i].getAttribute('points'); // Polyline
                if (hasPoints != null) {
                    var points = hasPoints.split(' ');
                    // Find highest and lowest x and y coordinates of the first element in lines
                    tempX1 = points[0].split(',')[0];
                    tempX2 = points[3].split(',')[0];
                    tempY1 = points[0].split(',')[1];
                    tempY2 = points[3].split(',')[1];
                } else {
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
        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}' style="fill:transparent; stroke-width:1.5; stroke:${color.SELECTED};" />`;

        //Determine size and position of delete button
        if (highX - lowX + 10 > highY - lowY + 10) {
            deleteBtnSize = (highY - lowY + 10) / 3;
        } else {
            deleteBtnSize = (highX - lowX + 10) / 3;
        }

        if (deleteBtnSize > 20) {
            deleteBtnSize = 20;
        } else if (deleteBtnSize < 15) {
            deleteBtnSize = 15;
        }
        
        // Button possition
        deleteBtnX = lowX - 5 + highX - lowX + 10 - (deleteBtnSize / 2);
        deleteBtnY = lowY - 5 - (deleteBtnSize / 2);

        //Delete button visual representation
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + deleteBtnSize - 2}' class= "BlackthemeColor"/>`;
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + deleteBtnSize - 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + 2}' class= "BlackthemeColor"/>`;
    }
    return str;
}

/**
 * @description Translate all elements to the correct coordinate
 */
function updateCSSForAllElements() {
    function updateElementDivCSS(elementData, divObject, useDelta = false) {
        let left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
        let top = Math.round((((elementData.y - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta) {
            left -= deltaX;
            top -= deltaY;
        }

        if (settings.grid.snapToGrid && useDelta) {
            if (element.kind == elementTypesNames.EREntity) {
                // The element coordinates with snap point
                let objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact)) - (settings.grid.gridSize * 3)) / settings.grid.gridSize) * settings.grid.gridSize;
                let objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / settings.grid.gridSize) * settings.grid.gridSize;

                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x) + (settings.grid.gridSize * 5)) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            } else if (element.kind != elementTypesNames.EREntity) {
                // The element coordinates with snap point
                let objX = Math.round((elementData.x - (deltaX * (1.0 / zoomfact)) - (settings.grid.gridSize * 3)) / settings.grid.gridSize) * settings.grid.gridSize;
                let objY = Math.round((elementData.y - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize * 0.5)) * (settings.grid.gridSize * 0.5);

                // Add the scroll values
                left = Math.round((((objX - zoomOrigo.x) + (settings.grid.gridSize * 4)) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            }
        }
        divObject.style.left = left + "px";
        divObject.style.top = top + "px";
    }

    // Update positions of all data elements based on the zoom level and view space coordinate
    for (let i = 0; i < data.length; i++) {
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
            if (mouseMode != mouseModes.EDGE_CREATION) {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];

                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if (markedOverOne()) {
                        fillColor.style.fill = color.LIGHT_PURPLE;
                        fontColor.style.fill = color.WHITE;
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if (element.kind == elementTypesNames.IERelation && element.state != "overlapping") {
                            disjointLine1Color.style.stroke = color.WHITE;
                            disjointLine2Color.style.stroke = color.WHITE;
                        }
                        // If UMLRelation is not marked.
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                        }
                    } else {
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.BLACK;
                            if (element.fill == color.BLACK) {
                                weakKeyUnderline.style.stroke = color.WHITE;
                            }
                        }
                    }
                }
            } else {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if (markedOverOne()) {
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if (element.kind == elementTypesNames.IERelation && element.state != "overlapping") {
                            disjointLine1Color.style.stroke = color.WHITE;
                            disjointLine2Color.style.stroke = color.WHITE;
                        }
                        // If UMLRelation is not marked.
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                        }
                    } else {
                        fillColor.style.fill = element.fill;
                        fontContrast();
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.BLACK;
                            if (element.fill == color.BLACK) {
                                weakKeyUnderline.style.stroke = color.WHITE;
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

        if (ghostDiv) {
            updateElementDivCSS(ghostElement, ghostDiv)
        }
    }

    function fontContrast() {
        //check if the fill color is black or pink, if so the font color is set to white
        fontColor.style.fill = element.fill == color.BLACK || element.fill == color.PINK ? color.WHITE : color.BLACK;
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

        if (cssUrl == 'blackTheme.css') {
            //iterate through all the elements that have the class 'text'.
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                //assign their current stroke color to a variable.
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                //if the element has a stroke which has the color #383737 and its fill isn't white: set it to white.
                //this is because we dont want to affect the strokes that are null or other colors and have a contrasting border.
                if (strokeColor == color.GREY && fillColor != color.WHITE) {
                    strokeColor = color.WHITE;
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
        //if the theme isnt darkmode and the fill isn't gray, make the stroke gray.
        else {
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                if (strokeColor == color.WHITE && fillColor != color.GREY) {
                    strokeColor = color.GREY;
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
function toggleActorOrbject(type) {
    for (let i = 0; i < context.length; i++) {
        if (context[i].actorOrObject != null) {
            if (type == "object") {
                context[i].actorOrObject = "object";
            } else if (type == "actor") {
                context[i].actorOrObject = "actor";
            } else {
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
function setSequenceAlternatives() {
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
                StateChangeFactory.ElementAttributesChanged(context[0].id, {'alternatives': alternatives}),
                StateChangeFactory.ElementAttributesChanged(context[0].id, {'altOrLoop': context[0].altOrLoop}),
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
function isDarkTheme() {
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
function showdata() {
    updateContainerBounds();
    var str = "";
    errorData = [];
    errorReset(data);

    // Iterate over programs
    for (let i = 0; i < data.length; i++) {
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
function centerCamera() {
    // Stops execution if there are no elements to center the camera around.
    if (data.length == 0) {
        displayMessage(messageTypes.ERROR, "Error: There are no elements to center to!");
        return;
    }
    // Centering needs to happen twice for it to work, temp solution
    for (let i = 0; i < 2; i++) {
        zoomfact = 1;

        var minX = Math.min.apply(null, data.map(i => i.x))
        var maxX = Math.max.apply(null, data.map(i => i.x + i.width))
        var minY = Math.min.apply(null, data.map(i => i.y))
        var maxY = Math.max.apply(null, data.map(i => i.y + i.height))
        determineZoomfact(maxX, maxY, minX, minY);

        // Center of screen in pixels
        var centerScreen = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        // Center of diagram in coordinates
        var centerDiagram = {
            x: minX + ((maxX - minX) / 2),
            y: minY + ((maxY - minY) / 2)
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
    displayMessage(messageTypes.SUCCESS, `Centered the camera.`);
}

//#endregion =====================================================================================
//#region ================================   LOAD AND EXPORTS    ==================================

/**
 * @description Create and download a file
 * @param {String} filename The name of the file that get generated
 * @param {*} dataObj The text content of the file
 */
function downloadFile(filename, dataObj) {
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
function exportWithHistory() {

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
 * @param {string} key The name/key of the diagram
 */
function storeDiagramInLocalStorage(key) {

    if (stateMachine.currentHistoryIndex == -1) {
        displayMessage(messageTypes.ERROR, "You don't have anything to save!");
    } else {
        // Remove all future states to the history
        stateMachine.removeFutureStates();
        // The content of the save file
        var objToSave = {
            historyLog: stateMachine.historyLog,
            initialState: stateMachine.initialState
        };

        // Sets the autosave diagram first, if it is not already set.
        if (!localStorage.getItem("diagrams")) {
            let s = `{"AutoSave": ${JSON.stringify(objToSave)}}`
            localStorage.setItem("diagrams", s);
        }
        // Gets the string thats contains all the local diagram saves and updates an existing entry or creates a new entry based on the value of 'key'.
        let local = localStorage.getItem("diagrams");
        local = (local[0] == "{") ? local : `{${local}}`;

        let localDiagrams = JSON.parse(local);
        localDiagrams[key] = objToSave;
        localStorage.setItem("diagrams", JSON.stringify(localDiagrams));

        displayMessage(messageTypes.SUCCESS, "You have saved the current diagram");
    }
}

/**
 * @description Prepares data for file creation, retrieves data and lines, also filter unnecessary values
 */
function exportWithoutHistory() {
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
            if (defaults[obj.kind][objKey] != obj[objKey]) {
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

            if (defaultLine[objKey] != obj[objKey]) {
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
function loadMockupDiagram(path) {

    // "resetDiagram()" calls this method with "EMPTYDiagram" as parameter

    // The path is not set yet if we do it from the dropdown as the function
    // is called without a parameter.
    if (!path) path = document.getElementById("diagramTypeDropdown").value;
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
function getFileContent(files) {
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
async function loadDiagram(file = null, shouldDisplayMessage = true) {
    if (file === null) {
        var fileInput = document.getElementById("importDiagramFile");

        // If not an json-file is inputted => return
        if (getExtension(fileInput.value) != "json") {
            if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Sorry, you cant load that type of file. Only json-files is allowed");
            return;
        }

        try {
            // Get filepath
            var file1 = fileInput.files[0];
            var temp = await getFileContent(file1);
            temp = JSON.parse(temp);
        } catch (error) {
            console.error(error);
        }
    } else {
        temp = file;
    }

    if (temp.historyLog && temp.initialState) {
        // Set the history and initalState to the values of the file
        stateMachine.historyLog = temp.historyLog;
        stateMachine.initialState = temp.initialState;

        // Update the stateMachine to the latest current index
        stateMachine.currentHistoryIndex = stateMachine.historyLog.length - 1;

        // Scrub to the latest point in the diagram
        stateMachine.scrubHistory(stateMachine.currentHistoryIndex);

        // Display success message for load
        if (shouldDisplayMessage) displayMessage(messageTypes.SUCCESS, "Save-file loaded");

    } else if (temp.data && temp.lines) {
        // Set data and lines to the values of the export file
        temp.data.forEach(element => {
            var elDefault = defaults[element.kind];
            Object.keys(elDefault).forEach(defaultKey => {
                if (!element[defaultKey]) {
                    element[defaultKey] = elDefault[defaultKey];
                }
            });
        });
        temp.lines.forEach(line => {
            Object.keys(defaultLine).forEach(defaultKey => {
                if (!line[defaultKey]) {
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
    } else {
        if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Error, cant load the given file");
    }
}

function showModal() {
    var modal = document.querySelector('.loadModal');
    var overlay = document.querySelector('.loadModalOverlay');
    var container = document.querySelector('#loadContainer');
    let diagramKeys;
    let localDiagrams;

    let local = localStorage.getItem("diagrams");
    if (local != null) {
        local = (local[0] == "{") ? local : `{${local}}`;
        localDiagrams = JSON.parse(local);
        diagramKeys = Object.keys(localDiagrams);
    }
    // Remove all elements
    while (container.firstElementChild) {
        container.firstElementChild.remove();
    }

    // If no items were found for loading in 
    if (diagramKeys === undefined || diagramKeys.length === 0) {
        var p = document.createElement('p');
        var pText = document.createTextNode('No saves could be found');

        p.appendChild(pText);
        container.appendChild(p);
    } else {
        for (let i = 0; i < diagramKeys.length; i++) {
            let wrapper = document.createElement('div');
            var btn = document.createElement('button');
            var btnText = document.createTextNode(diagramKeys[i]);

            btn.setAttribute("onclick", `loadDiagramFromLocalStorage('${diagramKeys[i]}');closeModal();`);
            btn.appendChild(btnText);
            wrapper.appendChild(btn);
            wrapper.style.display = "flex";
            btn.style.width = '100%';

            if (btnText.textContent !== 'AutoSave') {
                let delBtn = document.createElement('button');
                delBtn.classList.add('deleteLocalDiagram');
                delBtn.setAttribute("onclick", `removeLocalDiagram('${diagramKeys[i]}');showModal();`);
                delBtn.appendChild(document.createTextNode('Delete'));
                wrapper.appendChild(delBtn);
            }
            container.appendChild(wrapper);
            document.getElementById('loadCounter').innerHTML = diagramKeys.length;
        }
    }
    modal.classList.remove('hiddenLoad');
    overlay.classList.remove('hiddenLoad');
}

function closeModal() {
    var modal = document.querySelector('.loadModal');
    var overlay = document.querySelector('.loadModalOverlay');

    modal.classList.add('hiddenLoad');
    overlay.classList.add('hiddenLoad');
}

/**
 * @description Check whether there is a diagram saved in localstorage and load it.
 * @param {string} key The name/key of the diagram to load.
 */
function loadDiagramFromLocalStorage(key) {
    if (localStorage.getItem("diagrams")) {
        var diagramFromLocalStorage = localStorage.getItem("diagrams");
        diagramFromLocalStorage = (diagramFromLocalStorage[0] == "{") ? diagramFromLocalStorage : `{${diagramFromLocalStorage}}`;
        let obj = JSON.parse(diagramFromLocalStorage);
        if (obj[key] === undefined) {
            console.error("Undefined key")
        } else {
            loadDiagramFromString(obj[key]);
        }
    } else {
        // Failed to load content
        console.error("No content to load")
    }
    disableIfDataEmpty();
}

// Save current diagram when user leaves the page
function saveDiagramBeforeUnload() {
    window.addEventListener("beforeunload", (e) => {
        e.preventDefault();
        e.returnValue = "";
        storeDiagramInLocalStorage("AutoSave");
    })
}

function disableIfDataEmpty() {
    if (stateMachine.currentHistoryIndex === -1 || data.length === 0) {
        document.getElementById('localSaveField').classList.add('disabledIcon');
    } else {
        document.getElementById('localSaveField').classList.remove('disabledIcon');
    }
}

function showSavePopout() {
    if (stateMachine.currentHistoryIndex === -1 || data.length === 0) {
        displayMessage(messageTypes.ERROR, "You don't have anything to save!");
    } else {
        $("#savePopoutContainer").css("display", "flex");
        document.getElementById("saveDiagramAs").focus();
    }
}

function hideSavePopout() {
    $("#savePopoutContainer").css("display", "none");
}

function showOverridePopout() {
    $("#overrideContainer").css("display", "flex");
}

function closeOverridePopout() {
    $("#overrideContainer").css("display", "none");
}

//get the current file name that the user wants to use for saving to local storage.
function getCurrentFileName() {
    let fileName = document.getElementById("saveDiagramAs");
    return fileName.value;
}

function saveDiagramAs() {
    let elem = document.getElementById("saveDiagramAs");
    let fileName = elem.value;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth()+1}` :  currentDate.getMonth()+1; // Note: January is month 0
    const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` :  currentDate.getDate();
    const hours = currentDate.getHours()< 10 ? `0${currentDate.getHours()}` :  currentDate.getHours();
    const minutes = currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
    const seconds = currentDate.getSeconds()< 10 ? `0${currentDate.getSeconds()}` :  currentDate.getSeconds();
    const formattedDate = year + "-" + month + "-" + day+' ';
    const formattedTime = hours + ":" + minutes + ":" + seconds;
    if (fileName.trim() == "") {
        fileName = "diagram " + formattedDate + formattedTime;
    }
    let names;
    let localDiagrams;

    let local = localStorage.getItem("diagrams");
    if (local != null) {
        local = (local[0] == "{") ? local : `{${local}}`;
        localDiagrams = JSON.parse(local);
        names = Object.keys(localDiagrams);
    }

    for (let i = 0; i < names.length; i++) {
        if (names[i] == fileName) {
            hideSavePopout();
            showOverridePopout()
            return;
        }
    }
    storeDiagramInLocalStorage(fileName);
}

function loadDiagramFromString(temp, shouldDisplayMessage = true) {
    if (temp.historyLog && temp.initialState) {
        // Set the history and initalState to the values of the file
        stateMachine.historyLog = temp.historyLog;
        stateMachine.initialState = temp.initialState;

        // Update the stateMachine to the latest current index
        stateMachine.currentHistoryIndex = stateMachine.historyLog.length - 1;

        // Scrub to the latest point in the diagram
        stateMachine.scrubHistory(stateMachine.currentHistoryIndex);

        // Display success message for load
        if (shouldDisplayMessage) displayMessage(messageTypes.SUCCESS, "Save-file loaded");

    } else if (temp.data && temp.lines) {
        // Set data and lines to the values of the export file
        temp.data.forEach(element => {
            var elDefault = defaults[element.kind];
            Object.keys(elDefault).forEach(defaultKey => {
                if (!element[defaultKey]) {
                    element[defaultKey] = elDefault[defaultKey];
                }
            });
        });
        temp.lines.forEach(line => {
            Object.keys(defaultLine).forEach(defaultKey => {
                if (!line[defaultKey]) {
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
    } else {
        if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Error, cant load the given file");
    }
}

function removeLocalDiagram(item) {
    let local = localStorage.getItem("diagrams");
    local = (local[0] == "{") ? local : `{${local}}`;
    let localDiagrams = JSON.parse(local);

    if (item !== 'AutoSave') {
        delete localDiagrams[item];
    } else {
        displayMessage(messageTypes.ERROR, "Error, unable to delete 'AutoSave'");
    }

    localStorage.setItem("diagrams", JSON.stringify(localDiagrams));
}

//Alert function to give user a warning/choice before reseting diagram data.
function resetDiagramAlert() {
    let refreshConfirm = confirm("Are you sure you want to reset to default state? All changes made to diagram will be lost");
    if (refreshConfirm) {
        resetDiagram();
    }
}

/**
 * @description Cleares the diagram.
 */
function resetDiagram() {
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
 * this function is commented out because it is unknown at this time what value is expected and it throws an error. It also appears that this does not really surve any purpose.
 *
 *  @description Function to set the values of the current variant in the preivew
 *  @throws error If "window.parent.parameterArray" is not set or null.
 
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
*/

//#endregion =====================================================================================
