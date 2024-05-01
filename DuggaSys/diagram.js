// =============================================================================================
//#region ================================ CLASSES =============================================

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
                    let lastLog = this.historyLog[this.historyLog.length - 1];

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
                        for (let j = 0; j < changeTypes.length; j++) {
                            const currentChangedType = changeTypes[j];
                            let movedAndResized = false;
                            switch (currentChangedType) {
                                case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                                case StateChange.ChangeTypes.ELEMENT_MOVED:
                                    lastLog = appendValuesFrom(lastLog, stateChange);
                                    this.historyLog.push({...lastLog});
                                    this.currentHistoryIndex = this.historyLog.length - 1;
                                    break;
                                case StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED:
                                    movedAndResized = true;
                                case StateChange.ChangeTypes.ELEMENT_RESIZED:
                                    lastLog = appendValuesFrom(lastLog, stateChange);
                                    // loop to add the correct sizes to the changeState
                                    // it only stores the changes originally and after this it stores the whole size
                                    for (let change of stateChangeArray) {
                                        change.id.forEach(id => {
                                            let currentElement = document.getElementById(id);
                                            if (lastLog.id == id) {
                                                //add this but for (x, y) aswell
                                                lastLog.width += currentElement.offsetWidth;
                                                lastLog.height += currentElement.offsetHeight;
                                                if (movedAndResized) {
                                                    currentElement = data[findIndex(data, id)];
                                                    lastLog.x = currentElement.x;
                                                    lastLog.y = currentElement.y;
                                                }
                                            }
                                        });
                                    }
                                    // not sure why but if you resize -> undo -> resize it starts
                                    // to store the id as an array so this is just a check to counter that
                                    // entirely possible this breaks something else
                                    if (Array.isArray(lastLog.id)) {
                                        // yes, the double [0][0] is neccesarry to access the ID
                                        lastLog.id = lastLog.id[0][0];
                                    }

                                    // spreaading the values so that it doesn't keep the reference
                                    this.historyLog.push({...lastLog});
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

        
        this.scrubHistory(this.currentHistoryIndex);
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
            let object;
            if (data[findIndex(data, state.id[i])] != undefined) object = data[findIndex(data, state.id[i])];
            else if (lines[findIndex(lines, state.id[i])] != undefined) object = lines[findIndex(lines, state.id[i])];
            
            // If an object was found
            if (object) {
                // For every key, apply the changes
                keys.forEach(key => {
                    if (key != "id" || key != "time") object[key] = state[key]; // Ignore this keys.
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

    if (altPressed == true) {
        mouseMode_onMouseUp();
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
    if (isKeybindValid(e, keybinds.HISTORY_STEPBACK)) stateMachine.stepBack();
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

window.addEventListener("resize", updateRulers);

window.onfocus = function () {
    altPressed = false;
    ctrlPressed = false;
}

document.addEventListener("mouseleave", function (event) {
    if (event.toElement == null && event.relatedTarget == null) {
        pointerState = pointerStates.DEFAULT;
    }

    if ((event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) || event.clientY <= 0 || event.clientX <= 0) {  
        mouseMode_onMouseUp();
    }
});

document.addEventListener("mouseout", function (event) {
    if ((event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) || event.clientY <= 0 || event.clientX <= 0) {  
        mouseMode_onMouseUp();
    }
});

// --------------------------------------- Mouse Events    --------------------------------

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
    if (hasResized) {
        stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, 0, widthChange, 0), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
        hasResized = false;
    }
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
    lastMousePos = new Point(event.clientX, event.clientY);
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
            let isX, isR, isUP;
            var index = findIndex(data, context[0].id);
            var elementData = data[index];

            var minWidth = elementData.minWidth; // Declare the minimal with of an object
            var minHeight = elementData.minHeight; // Declare the minimal height of an object

            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;

            // Functionality for the four different nodes
            if (startNodeLeft && (startWidth + (deltaX / zoomfact)) > minWidth) {
                isR = false;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);
                isX = true;
                let xChange = movementPosChange(elementData,startX,deltaX,isX);
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, 0, widthChange, 0), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            } else if (startNodeRight && (startWidth - (deltaX / zoomfact)) > minWidth) {
                isR = true;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], widthChange, 0), StateChange.ChangeTypes.ELEMENT_RESIZED);
            } else if (startNodeDown && (startHeight - (deltaY / zoomfact)) > minHeight) {
                isUP = false;
                const heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);
                stateMachine.save(StateChangeFactory.ElementResized([elementData.id], 0, heightChange), StateChange.ChangeTypes.ELEMENT_RESIZED);
            } else if (startNodeUp && (startHeight + (deltaY / zoomfact)) > minHeight) {
                // Fetch original height// Deduct the new height, giving us the total change
                isUP = true;
                const heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);
                isX = false;
                let yChange = movementPosChange(elementData,startY,deltaY,isX);
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], 0, yChange, 0, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            } else if (startNodeUpLeft && (startHeight + (deltaY / zoomfact)) > minHeight && (startWidth + (deltaX / zoomfact)) > minWidth){
                //set movable height
                isUP = true;
                let heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);
                isX = false;
                let yChange = movementPosChange(elementData,startY,deltaY,isX);
                isR = false;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);
                isX = true;
                let xChange = movementPosChange(elementData,startX,deltaX,isX);
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, yChange, widthChange, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            } else if (startNodeUpRight && (startHeight + (deltaY / zoomfact)) > minHeight && (startWidth - (deltaX / zoomfact)) > minWidth){
                //set movable height
                isUP = true;
                let heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);
                isX = false;
                let yChange = movementPosChange(elementData,startY,deltaY,isX);
                isR = true;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], 0, yChange, widthChange, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            } else if (startNodeDownLeft && (startHeight - (deltaY / zoomfact)) > minHeight && (startWidth + (deltaX / zoomfact)) > minWidth){
                isR = false;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);
                isX = true;
                let xChange = movementPosChange(elementData,startX,deltaX,isX);
                isUP = false;
                let heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);
                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], xChange, 0, widthChange, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
            } else if (startNodeDownRight && (startHeight - (deltaY / zoomfact)) > minHeight && (startWidth - (deltaX / zoomfact)) > minWidth){
                isR = true;
                let widthChange = movementXChange(elementData,startWidth,deltaX,isR);

                isUP = false;
                const heightChange = movementYChange(elementData,startHeight,deltaY,isUP,preResizeHeight);

                stateMachine.save(StateChangeFactory.ElementMovedAndResized([elementData.id], 0, 0, widthChange, heightChange), StateChange.ChangeTypes.ELEMENT_MOVED_AND_RESIZED);
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
function movementPosChange(element,start,delta, isX){
    let tmp = (isX) ? element.x : element.y;
    let elem;
    if (isX) {
        element.x = screenToDiagramCoordinates( (start - delta ),0).x;
        elem = element.x;
    } else {
        element.y = screenToDiagramCoordinates(0, (start - delta )).y;
        elem = element.y;
    }
    // Deduct the new position, giving us the total change
    return -(tmp - elem);
}

function movementXChange(element,start,delta,isR){
    let tmp = element.width;
    if (isR) {
        element.width = (start - (delta / zoomfact));
    } else {
        element.width = (start + (delta / zoomfact));
    }
    // Remove the new width, giving us the total change
    return -(tmp - element.width);
}

function movementYChange(element,start,delta,isUp,preResizeHeight){
    // Adds a deep clone of the element to preResizeHeight if it isn't in it
    let tmp = element.height;
    if (isUp) {
        element.height = (start + (delta / zoomfact));
    } else {
        element.height = (start - (delta / zoomfact));
    }
    let foundID = false;
    if (preResizeHeight == undefined) {
        let resizedElement = structuredClone(element);
        preResizeHeight.push(resizedElement);
    } else {
        for (let i = 0; i < preResizeHeight.length; i++) {
            if (element.id == preResizeHeight[i].id) {
                foundID = true;
            }
        }
        if (!foundID) {
            let resizedElement = structuredClone(element);
            preResizeHeight.push(resizedElement);
        }
    }
    return -(tmp - element.height);

}
/**
 * @description When diagram page is loaded, check if preferred theme is stored in local storage.
 */
document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.getElementById("themeBlack");
    if (localStorage.getItem("diagramTheme")) stylesheet.href = localStorage.getItem("diagramTheme");
})

//#endregion ===================================================================================
//#region ================================ ELEMENT MANIPULATION ================================

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
 * @param {object} element
 * @returns {array} result
 */
function getElementLines(element) {
    return element.bottom.concat(element.right, element.top, element.left);
}

/**
 * @description Checks if the given element have lines connected to it or not.
 * @param {object} element
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
    let label = document.getElementById("lineLabel");
    let startLabel = document.getElementById("lineStartLabel");
    let endLabel = document.getElementById("lineEndLabel");
    let startIcon = document.getElementById("lineStartIcon");
    let endIcon = document.getElementById("lineEndIcon");
    let lineType = document.getElementById("lineType");
    let cardinality = document.getElementById('propertyCardinality');
    let line = contextLine[0];

    let radio = [
        document.getElementById("lineRadio1"),
        document.getElementById("lineRadio2"),
        document.getElementById("lineRadio3"),
        document.getElementById("lineRadio4"),
    ];
    radio.forEach(r => {
        if (r && r.checked && line.kind != r.value) {
            line.kind = r.value;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(line.id, {kind: r.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
            displayMessage(messageTypes.SUCCESS, 'Successfully saved');
        }
    });

    if (cardinality) {
        if (cardinality.value == "") {
            delete line.cardinality;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {cardinality: undefined}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        } else {
            changeAttribute(line, 'cardinality', cardinality, {cardinality: cardinality.value});
        }
    }
    changeAttribute(line, 'label', label, {label: label.value});

    if ((line.type == entityType.UML) || (line.type == entityType.IE)) {
        changeAttribute(line, 'startLabel', startLabel, {startLabel: startLabel.value});
        changeAttribute(line, 'endLabel', endLabel, {endLabel: endLabel.value});
        changeAttribute(line, 'startIcon', startIcon, {startIcon: startIcon.value});
        changeAttribute(line, 'endIcon', endIcon, {endIcon: endIcon.value});
    }
    if (line.type == entityType.SD) {
        changeAttribute(line, 'innerType', lineType, {innerType: lineType.value});
        changeAttribute(line, 'startIcon', startIcon, {startIcon: startIcon.value});
        changeAttribute(line, 'endIcon', endIcon, {endIcon: endIcon.value});
    }
    showdata();
}

const changeAttribute = (line, attribute, updated, list) => {
    if (line[attribute] != updated.value) {
        line[attribute] = updated.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(line.id, list), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    }
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
    if (context) {
        context = [];
        generateContextProperties();
    }
}

/**
 * @description Empties the context array of all selected lines.
 */
function clearContextLine() {
    if (contextLine) {
        contextLine = [];
        generateContextProperties();
    }
}

//#endregion ===================================================================================
//#region ================================ ETC =================================================
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

//#endregion ============================================== ======================================
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
    if (mouseMode == mouseModes.POINTER) {
        elementTypeSelected = null;
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
        n1: new Point(startX, startY),
        n2: new Point(startX + deltaX, startY),
        n3: new Point(startX, startY + deltaY),
        n4: new Point(startX + deltaX, startY + deltaY),
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


function boxSelect_Update(mouseX, mouseY) {
    if (boxSelectionInUse) {
        // Update relative position form the starting position
        deltaX = mouseX - startX;
        deltaY = mouseY - startY;

        calculateDeltaExceeded();

        // Select all objects inside the box
        var coords = getBoxSelectionCoordinates();

        // Calculate top-left and bottom-right coordinates
        var topLeft = new Point(0, 0), bottomRight = new Point(0, 0);

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

//#endregion =====================================================================================
//#region ================================ REPLAY ================================================

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
 * USED IN PHP
 */
function toggleStepForward() {
    stateMachine.stepForward();
}

/**
 * @description Toggles stepbackwards in history.
 * USED IN PHP
 */
function toggleStepBack() {
    stateMachine.stepBack();
}

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

//#endregion =====================================================================================
//#region ================================ GUI ===================================================

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
 * @description Changes what element will be constructed on next constructElementOfType call.
 * @param {Number} type What kind of element to place.
 * @see constructElementOfType
 * USED IN PHP
 */
function setElementPlacementType(type = elementTypes.EREntity) {
    elementTypeSelected = type;
}

/**
 * @description Function to open a subtoolbar when pressing down on a button for a certan period of time
 * USED IN PHP
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
 * USED IN PHP
 */
function holdPlacementButtonUp() {
    mousePressed = false;
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

//#endregion =====================================================================================
//#region ================================ ZOOM ==================================================

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


//#endregion =====================================================================================
//#region ================================ ADD LINE ==================================

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
    // Prevent a line to be drawn between two ER entity.
    if (fromElement.kind == elementTypesNames.EREntity && toElement.kind == elementTypesNames.EREntity) {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between: ${fromElement.name}- and ${toElement.name}-element`);
        return;
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
        if (isLineConnectedTo(newLine, elementTypesNames.EREntity) != null) {
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

/**
 * @description Alert function to give user a warning/choice before reseting diagram data.
 * USED IN PHP
 */
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
    loadMockupDiagram("JSON/EMPTYDiagramMockup.json");
}
//#endregion =====================================================================================
