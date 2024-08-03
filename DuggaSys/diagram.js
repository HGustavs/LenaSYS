//#region ================================ CLASSES =============================================

/**
 * @description Handles storage and retrieval of usage history allowing undoing and redoing changes. Internal data should ONLY be modified through class methods to prevent weird behaviour.
 */
class StateMachine {
    /**
     * @description Instanciate a new StateMachine. Constructor arguments will determine the "initial state", only changes AFTER this will be logged.
     * @param {Array<Element>} initialElements All elements that should be stored in the initial state.
     * @param {Array<Object>} initialLines All lines that should be stored in the initial state.
     */
    constructor(initialElements, initialLines) {
        /**
         * @type Array<object>
         */
        this.historyLog = [];

        this.initialState = {
            elements: [],
            lines: []
        };
        this.initialElements = initialElements.map(e => Object.assign({}, e));
        this.initialLines = initialLines.map(l => Object.assign({}, l));

        /**
         * @type StateChange.ChangeTypes
         */
        this.lastFlag = {};

        /** Interger of the currentIndex position of historyLog */
        this.currentHistoryIndex = -1;

        /** Date variable that holds the time */
        this.currentTime = new Date().getTime();
        /** Keeps track of the type of change being made */
        this.changeType = undefined;
    }

    /**
     * @description Stores the passed state change into the state machine. If the change is hard it will be pushed onto the history log. A soft change will modify the previously stored state IF that state allows it. The soft state will otherwise be pushed into the history log instead. StateChanges REQUIRE flags to be identified by the stepBack and stepForward methods!
     * @param {string | string[]} id (List of) ID to be stored
     * @param {StateChange.ChangeTypes} newChangeType Type of change made
     * @see StateChange For available flags.
     */
    save(id, newChangeType) {
        this.changeType = newChangeType;
        this.currentTime = new Date().getTime();
        this.removeFutureStates();
        
        let lastLog = {...this.historyLog[this.historyLog.length - 1]};
        // the id is sometimes stored as an array so this is needed to get the actual value;            
        if(Array.isArray(lastLog.id)) lastLog.id = getItemsFromNestedArrays(lastLog.id);
        switch (newChangeType) {
            case StateChange.ChangeTypes.LINE_ATTRIBUTE_CHANGED:
                this.pushToHistoryLog({
                    id: id,
                    ...StateChange.GetLineProperties()
                });
                break;
            case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                for (const element of StateChange.ElementsAreLocked()) {
                    if (Array.isArray(id)) id = getItemsFromNestedArrays(id)[0];
                    this.pushToHistoryLog({
                        ...element,
                        ...Element.GetFillColor(id),
                        ...Element.GetStrokeColor(id),
                        ...StateChange.GetSequenceAlternatives(),
                        ...Element.GetProperties(id),
                        state: StateChange.ChangeElementState()
                    });
                }
                break;                
            case StateChange.ChangeTypes.ELEMENT_RESIZED:                    
                // if the save() call comes from the same change-motion, remove the last entry
                if (lastLog.changeType == newChangeType && lastLog.counter == historyHandler.inputCounter) {
                    this.historyLog.splice(this.historyLog.length - 1, 1);
                }

                // only store if the resized object isn't overlapping
                const coords = Element.GetELementPosition(id)
                if (!entityIsOverlapping(id, coords.x, coords.y)) {
                    this.pushToHistoryLog({
                        id: id,
                        ...Element.GetElementSize(id),
                        ...Element.GetELementPosition(id)                            
                    });
                }
                break;
            case StateChange.ChangeTypes.ELEMENT_DELETED:
                this.pushToHistoryLog({
                    id: id,
                    deleted: true
                });
                break;
            case StateChange.ChangeTypes.LINE_DELETED:
            case StateChange.ChangeTypes.ELEMENT_AND_LINE_DELETED:
                for (const entry of id) {
                    this.pushToHistoryLog({
                        id: entry,
                        deleted: true
                    });
                }
                break;
            case StateChange.ChangeTypes.ELEMENT_CREATED:
                if (!Array.isArray(id)) id = [id];
                for (const entry of id) {
                    this.pushToHistoryLog({
                        id: entry,
                        ...StateChange.ElementCreated(entry)
                    });
                }
                break;
            case StateChange.ChangeTypes.LINE_CREATED:
                this.pushToHistoryLog({
                    id: id,
                    ...StateChange.LineAdded(id)
                });
                break;
            case StateChange.ChangeTypes.ELEMENT_AND_LINE_CREATED:
                for (const entry of StateChange.ElementsAndLinesCreated(id[0], id[1])) {
                    this.pushToHistoryLog({
                        ...entry,
                    });
                }
                break;
            case StateChange.ChangeTypes.ELEMENT_MOVED:
                for (const entry of id) {
                    this.pushToHistoryLog({
                        id: entry,
                        ...Element.GetELementPosition(entry),
                    });
                }
                break;
            default:
                console.error(`Missing implementation for soft state change: ${stateChange}!`);
                break;
        }
    
    }

    /**
     * @description Pushes a new entry to the historyLog array and sets to index to the last position
     * @param {object} entry data to store in the history
     */
    pushToHistoryLog(entry) {
        this.historyLog.push({
            ...entry,
            changeType: this.changeType,
            counter: historyHandler.inputCounter,
            time: this.currentTime
        });
        this.currentHistoryIndex = this.historyLog.length-1;

        // it's possible to store multple of the same entries, by using the properties save button for example, this is used to remove those
        this.removeDuplicateEntries();
    }
    
    removeDuplicateEntries() {
        if (this.historyLog.length < 2) return;
        
        for (let i = 1; i < this.historyLog.length; i++) {
            if (sameObjects(this.historyLog[i-1], this.historyLog[i], ['counter', 'time'])) {
                this.historyLog.splice(i, 1);
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
        // Clearing context prevents selection box drawing on removed objects.
        clearContext();
        clearContextLine();
        // Remove ghost only if stepBack while creating edge
        if (mouseMode === mouseModes.EDGE_CREATION) clearGhosts();

        // keep going back while the time attribute is the same
        do {
            // If there is no history => return
            if (this.currentHistoryIndex == -1) {
                return;
            } else {
                this.currentHistoryIndex--;
            }

            this.scrubHistory(this.currentHistoryIndex);

            var doNextState = false;
            if (this.historyLog[this.currentHistoryIndex + 1] && this.historyLog[this.currentHistoryIndex]) {
                doNextState = (this.historyLog[this.currentHistoryIndex].time == this.historyLog[this.currentHistoryIndex + 1].time);
            }

        } while (doNextState);

        displayMessage(messageTypes.SUCCESS, "Changes reverted!");
        disableIfDataEmpty();
    }

    stepForward() {
        // If there is not anything to restore => return
        if (this.historyLog.length == 0 || this.currentHistoryIndex == (this.historyLog.length - 1)) return;

        // Go one step forward, if the next state in the history has the same time, do that too
        do {
            this.currentHistoryIndex++;
            if (this.historyLog[this.currentHistoryIndex]) {
                this.restoreState(this.historyLog[this.currentHistoryIndex]);
            }

            var doNextState = false;
            if (this.historyLog[this.currentHistoryIndex + 1] && this.historyLog[this.currentHistoryIndex]) {
                doNextState = (this.historyLog[this.currentHistoryIndex].time == this.historyLog[this.currentHistoryIndex + 1].time)
            }
        } while (doNextState);
        // Update diagram
        clearContext();
        showdata();
        updatepos();
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
        updatepos();
    }

    /**
     * @description Restore a given state
     * @param {StateChange} state The state that should be restored
     */
    restoreState(state) {
        // Get all keys from the state.
        var keys = Object.keys(state);
        // If there is only an key that is ID in the state, delete those objects
        if (keys.length == 2 && keys[0] == "id" || keys.includes('deleted')) {
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
            if (linesToRemove.length) removeLines(linesToRemove, false);
            if (elementsToRemove.length) removeElements(elementsToRemove, false);
            return;
        }

        if (!Array.isArray(state.id)) state.id = [state.id];

        for (let i = 0; i < state.id.length; i++) {
            // Find object
            let object = data.find(e => e.id == state.id[i]) ?? lines.find(e => e.id == state.id[i]);
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
        updatepos();
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
            updatepos();


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

// Global statemachine init, moved from onSetup
stateMachine = new StateMachine(data, lines);

/**
 * @description Very first function that is called when the window is loaded. This will perform initial setup and then call the drawing functions to generate the first frame on the screen.
 */
function getData() {
    try {
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
        generateToolTips();
        toggleGrid();
        updateGridPos();
        updateA4Pos();
        updateGridSize();
        showdata();
        drawRulerBars(scrollx, scrolly);
        setContainerStyles(mouseMode);
        generateKeybindList();
        saveDiagramBeforeUnload();

        // Setup and show only the first element of each PlacementType, hide the others in dropdown
        togglePlacementType(0, 0);
        togglePlacementType(1, 1);
        togglePlacementType(9, 9);
        togglePlacementType(12, 12);
    } catch (error) {
        console.error("Error during getData execution:", error);
        displayMessage(messageTypes.ERROR, "An error occurred during data initialization.");
    }
}

/**
 * @description Used to determine the tools shown depending on diagram type.
 */
function showDiagramTypes() {
    let firstShown = false; // used to not hide the first button in either category

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

// Event listeners for when one of the elementPlacement buttons are clicked, this will call the rightClickOpenSubtoolbar function with the right parameters
// Get the elementPlacement button with the highest number and use that for a range in the for loop
const elements = document.querySelectorAll('[id^="elementPlacement"]');
let maxNum = 0;
elements.forEach(element => {
    const num = parseInt(element.id.replace('elementPlacement', ''), 10);
    if (num > maxNum) {
        maxNum = num;
    }
});

for (let i = 0; i <= maxNum; i++) {
    let element = document.getElementById("elementPlacement" + i);
    if (element) {
        // Add event listener for click
        element.addEventListener("mousedown", function(event) {
            if (event.button === 2) { 
                rightClickOpenSubtoolbar(i);
            }
        });
    }
}

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

document.addEventListener('keydown', function (e) {
    if (isKeybindValid(e, keybinds.LEFT_CONTROL) && !ctrlPressed) ctrlPressed = true;
    if (isKeybindValid(e, keybinds.ALT) && !altPressed) altPressed = true;
    if (isKeybindValid(e, keybinds.META) && !ctrlPressed) ctrlPressed = true;

    if (isKeybindValid(e, keybinds.ESCAPE) && !escPressed && settings.replay.active) {
        toggleReplay();
        setReplayRunning(false);
        clearInterval(stateMachine.replayTimer);
    }

    if (isKeybindValid(e, keybinds.ENTER) && /INPUT|SELECT/.test(document.activeElement.nodeName.toUpperCase())) {
        if (document.getElementById("lineLabel")) {
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

    if (isKeybindValid(e, keybinds.ESCAPE) && !escPressed) {
        escPressed = true;
        if (context.length > 0 || contextLine.length > 0) {
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
    if (isKeybindValid(e, keybinds.ZOOM_IN)) {
        e.preventDefault();
        zoomin();
    }
    if (isKeybindValid(e, keybinds.ZOOM_OUT)) {
        e.preventDefault();
        zoomout();
    }

    if (isKeybindValid(e, keybinds.ZOOM_RESET)) {
        e.preventDefault();
        zoomreset();
    }

    if (isKeybindValid(e, keybinds.SELECT_ALL)) {
        e.preventDefault();
        document.getElementById("mouseMode0").click();
        selectAll();
    }

    if (isKeybindValid(e, keybinds.CENTER_CAMERA)) {
        e.preventDefault();
    }

    // Moving object with arrows
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_UP)) {
        e.preventDefault();
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x, obj.y - 1)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            if (settings.grid.snapToGrid) {
                setPos(context, 0, settings.grid.gridSize / 2);
            } else {
                setPos(context, 0, 1);
            }
        } else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_DOWN)) {
        e.preventDefault();
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x, obj.y + 1)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            if (settings.grid.snapToGrid) {
                setPos(context, 0, -settings.grid.gridSize / 2);
            } else {
                setPos(context, 0, -1);
            }
        } else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_LEFT)) {
        e.preventDefault();
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x - 1, obj.y)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            if (settings.grid.snapToGrid) {
                setPos(context, settings.grid.gridSize / 2, 0);
            } else {
                setPos(context, 1, 0);
            }
        } else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_RIGHT)) {
        e.preventDefault();
        let overlapDetected = false;
        context.forEach(obj => {
            if (entityIsOverlapping(obj.id, obj.x + 1, obj.y)) {
                overlapDetected = true;
                return;
            }
        });
        if (!overlapDetected) {
            if (settings.grid.snapToGrid) {
                setPos(context, -settings.grid.gridSize / 2, 0);
            } else {
                setPos(context, -1, 0);
            }
        } else {
            displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
        }
    }

    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM)) {
        e.preventDefault();
        showSavePopout();
    }

    if (isKeybindValid(e, keybinds.LOAD_DIAGRAM)) {
        e.preventDefault();
        showModal();
    }

    if (altPressed) {
        mouseMode_onMouseUp();
    }
    historyHandler.inputCounter = (historyHandler.inputCounter+1)%1024;
});

document.addEventListener('keyup', function (e) {
    const pressedKey = e.key.toLowerCase();

    hidePlacementType();
    // Toggle modifiers when released
    if (pressedKey == keybinds.LEFT_CONTROL.key) ctrlPressed = false;
    if (pressedKey == keybinds.ALT.key) altPressed = false;
    if (pressedKey == keybinds.META.key) {
        setTimeout(() => {
            ctrlPressed = false;
        }, 1000);
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
    if (isKeybindValid(e, keybinds.PLACE_ENTITY)) {
        if (subMenuCycling(subMenuEntity, 0)) return;
        togglePlacementType(elementTypes.EREntity, 0);
        setElementPlacementType(elementTypes.EREntity);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // Relation / Inheritance
    if (isKeybindValid(e, keybinds.PLACE_RELATION)) {
        if (subMenuCycling(subMenuRelation, 1)) return;
        togglePlacementType(elementTypes.ERRelation, 1);
        setElementPlacementType(elementTypes.ERRelation);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // UML states
    if (isKeybindValid(e, keybinds.STATE_INITIAL)) {
        if (subMenuCycling(subMenuUMLstate, 9)) return;
        togglePlacementType(elementTypes.UMLInitialState, 9);
        setElementPlacementType(elementTypes.UMLInitialState);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // Sequence
    if (isKeybindValid(e, keybinds.SQ_LIFELINE)) {
        if (subMenuCycling(subMenuSequence, 12)) return;
        togglePlacementType(elementTypes.sequenceActor, 12);
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
    if (isKeybindValid(e, keybinds.RESET_DIAGRAM)) resetDiagramAlert();
    if (isKeybindValid(e, keybinds.TOGGLE_TEST_CASE)) toggleTestCase();

    //if(isKeybindValid(e, keybinds.TOGGLE_ERROR_CHECK)) toggleErrorCheck(); Note that this functionality has been moved to hideErrorCheck(); because special conditions apply.

    if (isKeybindValid(e, keybinds.COPY)) {
        // Remove the preivous copy-paste data from localstorage.
        if (localStorage.key('copiedElements')) localStorage.removeItem('copiedElements');
        if (localStorage.key('copiedLines')) localStorage.removeItem('copiedLines');

        if (context.length) {
            // Filter - keeps only the lines that are connectet to and from selected elements.
            const contextConnectedLines = lines.filter(line => {
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
});

window.addEventListener("resize", updateRulers);

window.onfocus = function () {
    altPressed = false;
    ctrlPressed = false;
};

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
                        console.error("Failed to create an element as it overlaps other element(s)");
                        // Remove added element from data as it should remain
                        data.splice(data.length - 1, 1);
                        makeGhost();
                        showdata();
                        return;
                    }
                    //If not overlapping
                    stateMachine.save(ghostElement.id, StateChange.ChangeTypes.ELEMENT_CREATED);
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
                    updatepos();
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
                        updatepos();
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
            updatepos();
            // Update the ruler
            drawRulerBars(scrollx, scrolly);
            calculateDeltaExceeded();
            break;
        case pointerStates.CLICKED_LINE:
            if (mouseMode == mouseModes.BOX_SELECTION) {
                calculateDeltaExceeded();
                mouseMode_onMouseMove(mouseMode);
            }
            break;
        case pointerStates.CLICKED_LABEL:
            updateLabelPos(event.clientX, event.clientY);
            updatepos();
            break;
        case pointerStates.CLICKED_ELEMENT:
            if (mouseMode != mouseModes.EDGE_CREATION) {
                const prevTargetPos = {
                    x: data[findIndex(data, targetElement.id)].x,
                    y: data[findIndex(data, targetElement.id)].y
                };
                let targetElementDiv = document.getElementById(targetElement.id);
                let targetPos = {
                    x: 1 * targetElementDiv.style.left.substring(0, targetElementDiv.style.left.length - 2),
                    y: 1 * targetElementDiv.style.top.substring(0, targetElementDiv.style.top.length - 2)
                };
                targetPos = screenToDiagramCoordinates(targetPos.x, targetPos.y);
                targetDelta = {
                    x: (targetPos.x * zoomfact) - (prevTargetPos.x * zoomfact),
                    y: (targetPos.y * zoomfact) - (prevTargetPos.y * zoomfact),
                };
                // Moving object
                movingObject = true;
                // Moving object
                deltaX = startX - event.clientX;
                deltaY = startY - event.clientY;
                // We update position of connected objects
                updatepos();
                calculateDeltaExceeded();
            }
            break;
        case pointerStates.CLICKED_NODE:
            const index = findIndex(data, context[0].id);
            const elementData = data[index];

            const minWidth = elementData.minWidth; // Declare the minimal with of an object
            const minHeight = elementData.minHeight; // Declare the minimal height of an object

            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;

            // Resize equally in both directions by modifying delta
            if (elementData.kind == elementTypesNames.UMLInitialState || elementData.kind == elementTypesNames.UMLFinalState) {
                let delta;
                if (startNode.upLeft) {
                    delta = Math.max(deltaX, deltaY);
                } else if (startNode.downRight) {
                    delta = Math.min(deltaX, deltaY);
                } else if (startNode.downLeft) {
                    delta = Math.max(deltaX, -deltaY);
                } else if (startNode.upRight) {
                    delta = Math.max(-deltaX, deltaY);
                }
                deltaX = (startNode.upRight) ? -delta : delta;
                deltaY = (startNode.downLeft) ? -delta : delta;
            }
        
            let xChange, yChange, widthChange, heightChange;
            if(elementData.kind == elementTypesNames.sequenceActor || elementData.kind == elementTypesNames.sequenceObject) { // Special resize for sequenceActor and sequenceObject
                const maxRatio = 0.8;
                if ((startNode.left || startNode.upLeft || startNode.downLeft) && (startWidth + (deltaX / zoomfact)) > minWidth) {
                    let tmpW = elementData.width;
                    let tmpX = elementData.x;
                    let movementY = elementData.width <= maxRatio*startHeight ? 0 : -(deltaX/zoomfact+startWidth-maxRatio*startHeight)/maxRatio;
                    let xChange = movementPosChange(elementData, startX, deltaX, true);
                    let widthChange = movementWidthChange(elementData, tmpW, tmpX, false);
                    let heightChange = movementHeightChange(elementData, startHeight, movementY,false);
                } else if (startNode.right && (startWidth - (deltaX / zoomfact)) > minWidth) {
                    var movementY = elementData.width <= maxRatio*startHeight ? 0 : -(-deltaX/zoomfact+startWidth-maxRatio*startHeight)/maxRatio;
                    let widthChange = movementWidthChange(elementData, startWidth, deltaX, true);
                    let heightChange = movementHeightChange(elementData,startHeight,movementY,false);
                } else if ((startNode.up || startNode.upLeft || startNode.upRight)
                    && (startHeight + (deltaY / zoomfact)) > startWidth / maxRatio) {
                    // Fetch original height// Deduct the new height, giving us the total change
                    let tmpH = elementData.height;
                    let tmpY = elementData.y;
                    let yChange = movementPosChange(elementData, startY, deltaY, false);
                    const heightChange = movementHeightChange(elementData, tmpH, tmpY, true);
                } else if ((startNode.down || startNode.downLeft || startNode.downRight)
                    && (startHeight - (deltaY / zoomfact)) > startWidth / maxRatio) {
                    const heightChange = movementHeightChange(elementData, startHeight, deltaY, false);
                }
            } else { // Normal resize for the other elements
                // Functionality Left/Right resize
                if ((startNode.left || startNode.upLeft || startNode.downLeft) && (startWidth + (deltaX / zoomfact)) > minWidth) {
                    let tmpW = elementData.width;
                    let tmpX = elementData.x;
                    xChange = movementPosChange(elementData, startX, deltaX, true);
                    widthChange = movementWidthChange(elementData, tmpW, tmpX, false);
                } else if ((startNode.right || startNode.upRight || startNode.downRight) && (startWidth - (deltaX / zoomfact)) > minWidth) {
                    widthChange = movementWidthChange(elementData, startWidth, deltaX, true);
                }

                // Functionality Up/Down resize
                if ((startNode.down || startNode.downLeft || startNode.downRight) && (startHeight - (deltaY / zoomfact)) > minHeight) {
                    heightChange = movementHeightChange(elementData, startHeight, deltaY, false);
                } else if ((startNode.up || startNode.upLeft || startNode.upRight) && (startHeight + (deltaY / zoomfact)) > minHeight) {
                    // Fetch original height// Deduct the new height, giving us the total change
                    let tmpH = elementData.height;
                    let tmpY = elementData.y;
                    yChange = movementPosChange(elementData, startY, deltaY, false);
                    heightChange = movementHeightChange(elementData, tmpH, tmpY, true);
                }
            }

            // store the changes in the history
            stateMachine.save(elementData.id, StateChange.ChangeTypes.ELEMENT_RESIZED);

            document.getElementById(context[0].id).remove();
            document.getElementById("container").innerHTML += drawElement(data[index]);
            // Check if entity is overlapping
            resizeOverlapping = entityIsOverlapping(context[0].id, elementData.x, elementData.y);

            // Update element in DOM
            const elementDOM = document.getElementById(context[0].id);
            elementDOM.style.width = elementData.width + 'px';
            elementDOM.style.height = elementData.height + 'px';
            elementDOM.style.left = elementData.x + 'px';
            elementDOM.style.top = elementData.y + 'px';
            showdata();
            updatepos();
            break;
        default:
            mouseMode_onMouseMove(event);
            break;
    }
    //Sets the rules to current position on screen.
    setRulerPosition(event.clientX, event.clientY);
}

function movementPosChange(element, start, delta, isX) {
    // mouse position is used causing the line to "jump" to the mous pos.
    // The magic numebers are used to center the node middle with the mouse pointer
    let property = (isX) ? 'x' : 'y';
    let x = (isX) ? start - delta - 6 * zoomfact : 0;
    let y = (isX) ? 0 : start - delta + 17 * zoomfact;
    let tmp = element[property];
    element[property] = screenToDiagramCoordinates(x, y)[property];
    // Deduct the new position, giving us the total change
    return -(tmp - element[property]);
}

function movementWidthChange(element, start, delta, isR) {
    element.width = (isR) ? start - delta / zoomfact : start + delta - element.x;
    return element.width;
}

function movementHeightChange(element, start, delta, isUp) {
    element.height = (isUp) ? start + delta - element.y : start - delta / zoomfact;
    return element.height;

}

/**
 * @description When diagram page is loaded, check if preferred theme is stored in local storage.
 */
document.addEventListener("DOMContentLoaded", () => {
    const stylesheet = document.getElementById("themeBlack");
    if (localStorage.getItem("diagramTheme")) stylesheet.href = localStorage.getItem("diagramTheme");
});

//#endregion ===================================================================================
//#region ================================ ELEMENT MANIPULATION ================================

/**
 * @description Adds an object to the data array of elements.
 * @param {Object} object Element to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToData(object, stateMachineShouldSave = true) {
    data.push(object);
    if (stateMachineShouldSave) stateMachine.save(object.id, StateChange.ChangeTypes.ELEMENT_CREATED);
}

/**
 * @description Adds a line to the data array of lines.
 * @param {Object} object Line to be added.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function addObjectToLines(object, stateMachineShouldSave = true) {
    lines.push(object);
    if (stateMachineShouldSave) stateMachine.save(object.id, StateChange.ChangeTypes.LINE_CREATED);
}

/**
 * @description Attempts removing all elements passed through the elementArray argument. Passed argument will be sanitized to ensure it ONLY contains real elements that are present in the data array. This is to make sure the state machine does not store deletion of non-existent objects.
 * @param {Array<Object>} elementArray List of all elements that should be deleted.
 * @param {Boolean} stateMachineShouldSave If the state machine should log this change to allow undoing.
 */
function removeElements(elementArray, stateMachineShouldSave = true) {
    // Find all lines that should be deleted first
    let linesToRemove = [];
    let elementsToRemove = [];

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
            if (stateMachineShouldSave) {
                // only the ids should be sent to save()
                stateMachine.save([...elementsToRemove.map(e => e.id), ...linesToRemove.map(e => e.id)], StateChange.ChangeTypes.ELEMENT_AND_LINE_DELETED)
            };
        } else { // Only removed elements without any lines
            if (stateMachineShouldSave) stateMachine.save([...elementsToRemove.map(e => e.id)], StateChange.ChangeTypes.ELEMENT_DELETED);
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
    let anyRemoved = false;

    // Removes from the two arrays that keep track of the attributes connections. 
    for (let i = 0; i < linesArray.length; i++) {
        lines = lines.filter(function (line) {
            const shouldRemove = (line != linesArray[i]);
            if (shouldRemove) {
                anyRemoved = true;
            }
            return shouldRemove;
        });
    }

    if (stateMachineShouldSave && anyRemoved) {
        stateMachine.save(linesArray.map(() => linesArray.id), StateChange.ChangeTypes.LINE_DELETED);
    }

    contextLine = [];
    showdata();
    redrawArrows();
}

/**
 * @description When properties are saved this updates the element to the selected state.
 * @see context For currently selected element.
 */
function changeState() {    
    const element = context[0];
    const oldRelation = element.state;
    const newRelation = document.getElementById("propertySelect")?.value || undefined;
    if (newRelation && oldRelation != newRelation) {
        if (element.type == entityType.ER || element.type == entityType.UML || element.type == entityType.IE) {
            if (element.kind != elementTypesNames.UMLEntity && element.kind != elementTypesNames.IERelation) {
                stateMachine.save(context[0].id, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);                
                displayMessage(messageTypes.SUCCESS, "Sucessfully saved");
            }
        }
    }
}

/**
 * @description Triggered on pressing the SAVE-button inside the options panel. This will apply all changes to the select element and will store the changes into the state machine.
 */
function saveProperties() {
    try {
        const propSet = document.getElementById("propertyFieldset");
        const element = context[0];
        const children = propSet.children;
        const propsChanged = {};

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const inputTag = child.id;
            if (inputTag == "elementProperty_name") {
                let value = child.value;
                element.name = value;
                propsChanged.name = value;
                continue;
            }
            const addToLine = (name, symbol) => {
                if (inputTag == `elementProperty_${name}`) {
                    let lines = child.value.trim().split("\n");
                    for (let j = 0; j < lines.length; j++) {
                        if (lines[j] && lines[j].trim()) {
                            if (Array.from(lines[j])[0] != symbol) {
                                lines[j] = symbol + lines[j];
                            }
                        }
                    }
                    element[name] = lines;
                    propsChanged[name] = lines;
                }
            };
            if (element.kind == elementTypesNames.SDEntity || element.kind == 'note') {
                addToLine("attributes", "");
                continue;
            }
            addToLine("primaryKey", "*");
            addToLine("attributes", "-");
            addToLine("functions", "+");
        }
        stateMachine.save(element.id, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        showdata();
        updatepos();
    } catch (error) {
        console.error("Error during saveProperties execution:", error);
        displayMessage(messageTypes.ERROR, "An error occurred while saving properties.");
    }
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
    let x1, x2, y1, y2;
    elements.forEach(element => {
        if (element.x < x1 || x1 === undefined) x1 = element.x;
        if (element.y < y1 || y1 === undefined) y1 = element.y;
        if ((element.x + element.width) > x2 || x2 === undefined) x2 = (element.x + element.width);
        if ((element.y + element.height) > y2 || y2 === undefined) y2 = (element.y + element.height);
    });

    const cx = (x2 - x1) / 2;
    const cy = (y2 - y1) / 2;
    const mousePosInPixels = screenToDiagramCoordinates(lastMousePos.x - (cx * zoomfact), lastMousePos.y - (cy * zoomfact));

    const clone = (obj) => Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

    const connectedLines = [];
    // For every line that shall be copied, create a temp object, for kind and connection tracking
    elementsLines.forEach(line => connectedLines.push(clone(line)));
    // An mapping between oldElement ID and the new element ID
    const idMap = {};
    const newElements = [];
    const newLines = [];

    // For every copied element create a new one and add to data
    elements.forEach(element => {
        // Make a new id and save it in an object
        idMap[element.id] = makeRandomID();

        connectedLines.forEach(line => {
            if (line.fromID == element.id) line.fromID = idMap[element.id];
            if (line.toID == element.id) line.toID = idMap[element.id];
        });
        // Copy element
        const elementObj = clone(element);
        elementObj.id = idMap[element.id];
        elementObj.x = mousePosInPixels.x + (element.x - x1);
        elementObj.y = mousePosInPixels.y + (element.y - y1);

        newElements.push(elementObj);
        addObjectToData(elementObj, false);
    });

    // Create the new lines but do not saved in stateMachine
    // TODO: Using addLine removes labels and arrows. Find way to save lines with all attributes.
    connectedLines.forEach(line => {
        newLines.push(
            addLine(data[findIndex(data, line.fromID)], data[findIndex(data, line.toID)], line.kind, false, false, line.cardinality)
        );
    });

    // Save the copyed elements to stateMachine
    stateMachine.save([newElements.map(e => e.id), newLines.map(e => e.id)], StateChange.ChangeTypes.ELEMENT_AND_LINE_CREATED);
    displayMessage(messageTypes.SUCCESS, `You have successfully pasted ${elements.length} elements and ${connectedLines.length} lines!`);
    clearContext(); // Deselect old selected elements
    clearContextLine();
    context = newElements; // Set context to the pasted elements
    contextLine = newLines; // Set contextline to the pasted lines
    showdata();
}

//#endregion ===================================================================================
//#region ================================ REPLAY ================================================

/**
 * @description Change the state in replay-mode with the slider
 * @param {Number} sliderValue The value of the slider
 */
function changeReplayState(sliderValue) {
    const timestampKeys = Object.keys(settings.replay.timestamps);

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
    const replayBox = document.getElementById("diagram-replay-box");
    const optionsPane = document.getElementById("options-pane");
    const toolbar = document.getElementById("diagram-toolbar");
    const ruler = document.getElementById("rulerOverlay");
    const zoomIndicator = document.getElementById("zoom-message-box");
    const replyMessage = document.getElementById("diagram-replay-message");
    const zoomContainer = document.getElementById("zoom-container");

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
            const lastKeyIndex = Object.keys(settings.replay.timestamps).length - 1;
            const lastKey = Object.keys(settings.replay.timestamps)[lastKeyIndex];
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
    const replayDelayMap = {
        1: 0.1,
        2: 0.25,
        3: 0.50,
        4: 0.75,
        5: 1,
        6: 1.25,
        7: 1.5,
        8: 1.75,
        9: 2
    };
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
    const button = document.getElementById("diagram-replay-switch");
    const stateSlider = document.getElementById("replay-range");

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
    const ids = [];
    const lockbtn = document.getElementById("lockbtn");
    let locked = true;
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
    stateMachine.save(ids, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    showdata();
    updatepos();
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
 * @description Function to open a subtoolbar when rightclicking a button
 */
function rightClickOpenSubtoolbar(num) {
    togglePlacementTypeBox(num);
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
    const toolButtons = document.getElementsByClassName("key_tooltip");

    for (let index = 0; index < toolButtons.length; index++) {
        const element = toolButtons[index];
        const id = element.id.split("-")[1];
        if (Object.getOwnPropertyNames(keybinds).includes(id)) {
            let str = "Keybinding: ";

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
    const objToSave = {
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
        return;
    } else {
        // Remove all future states to the history
        stateMachine.removeFutureStates();
        // The content of the save file
        const objToSave = {
            historyLog: stateMachine.historyLog,
            initialState: stateMachine.initialState
        };

        // Sets the autosave diagram first, if it is not already set.
        if (!localStorage.getItem("diagrams")) {
            let s = `{"AutoSave": ${JSON.stringify(objToSave)}}`;
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
    const objToSave = {
        data: [],
        lines: [],
    };
    let keysToIgnore = ["top", "left", "right", "bottom", "x1", "x2", "y1", "y2", "cx", "cy"];
    data.forEach(obj => {
        const filteredObj = {
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

    keysToIgnore = ["dx", "dy", "ctype"];
    lines.forEach(obj => {
        const filteredObj = {};
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
        const reader = new FileReader();
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
    let temp;
    if (!file) {
        const fileInput = document.getElementById("importDiagramFile");

        // If not an json-file is inputted => return
        if (getExtension(fileInput.value) != "json") {
            if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Sorry, you cant load that type of file. Only json-files is allowed");
            return;
        }

        try {
            // Get filepath
            const file1 = fileInput.files[0];
            temp = await getFileContent(file1);
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
            const elDefault = defaults[element.kind];
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
    const modal = document.querySelector('.loadModal');
    const overlay = document.querySelector('.loadModalOverlay');
    const container = document.querySelector('#loadContainer');
    let diagramKeys;
    let localDiagrams;

    let local = localStorage.getItem("diagrams");
    if (local) {
        local = (local[0] == "{") ? local : `{${local}}`;
        localDiagrams = JSON.parse(local);
        diagramKeys = Object.keys(localDiagrams);
    }
    // Remove all elements
    while (container.firstElementChild) {
        container.firstElementChild.remove();
    }

    // If no items were found for loading in 
    if (!diagramKeys || diagramKeys.length === 0) {
        const p = document.createElement('p');
        const pText = document.createTextNode('No saves could be found');

        p.appendChild(pText);
        container.appendChild(p);
    } else {
        for (let i = 0; i < diagramKeys.length; i++) {
            let wrapper = document.createElement('div');
            const btn = document.createElement('button');
            const btnText = document.createTextNode(diagramKeys[i]);

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
    const modal = document.querySelector('.loadModal');
    const overlay = document.querySelector('.loadModalOverlay');

    modal.classList.add('hiddenLoad');
    overlay.classList.add('hiddenLoad');
}

/**
 * @description Check whether there is a diagram saved in localstorage and load it.
 * @param {string} key The name/key of the diagram to load.
 */
function loadDiagramFromLocalStorage(key) {
    if (localStorage.getItem("diagrams")) {
        let diagramFromLocalStorage = localStorage.getItem("diagrams");
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
    if(data.length) {
        window.addEventListener("beforeunload", (e) => {
            storeDiagramInLocalStorage("AutoSave");
        })
    }
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
    const month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1; // Note: January is month 0
    const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const hours = currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours();
    const minutes = currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
    const seconds = currentDate.getSeconds() < 10 ? `0${currentDate.getSeconds()}` : currentDate.getSeconds();
    const formattedDate = year + "-" + month + "-" + day + ' ';
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
            showOverridePopout();
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
            const elDefault = defaults[element.kind];
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
