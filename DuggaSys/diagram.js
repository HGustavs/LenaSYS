// #region CLASSES
// ============================================================================================
// ========================================= CLASSES ==========================================
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

        this.numberOfChanges = 0;
    }

    /**
     * @description Stores the passed state change into the state machine. If the change is hard it will be pushed onto the history log. A soft change will modify the previously stored state IF that state allows it. The soft state will otherwise be pushed into the history log instead. StateChanges REQUIRE flags to be identified by the stepBack and stepForward methods!
     * @param {string | string[]} id (List of) ID to be stored.
     * @param {StateChange.ChangeTypes} newChangeType Type of change made.
     * @see StateChange For available flags.
     */
    save(id, newChangeType) {
        this.changeType = newChangeType;
        this.currentTime = new Date().getTime();
        this.removeFutureStates();

        let lastLog = { ...this.historyLog[this.historyLog.length - 1] };
        // The ID is sometimes stored as an array so this is needed to get the actual value            
        if (Array.isArray(lastLog.id)) lastLog.id = getItemsFromNestedArrays(lastLog.id);

        // Checks what type of change occurred and handles/stores it accordingly
        switch (newChangeType) {
            case StateChange.ChangeTypes.LINE_ATTRIBUTE_CHANGED:
                this.pushToHistoryLog({
                    id: id,
                    ...StateChange.GetLineProperties()
                });
                break;
            case StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED:
                // Normalize ID if it is in an Array
                const elementId = Array.isArray(id) ? getItemsFromNestedArrays(id)[0] : id;
                const element = Element.FindElementById(elementId);

                const currentText = element.name || "";

                if (!this.lastTypedTextMap) this.lastTypedTextMap = {};

                const currentFields = {
                    name: element.name || "",
                    attributes: element.attributes || "",
                    functions: element.functions || ""
                };

                const lastFields = this.lastTypedTextMap[elementId] || {
                    name: "",
                    attributes: "",
                    functions: ""
                };

                let hasChanged = false;

                for (const key of ["name", "attributes", "functions"]) {
                    const currentText = (currentFields[key] ?? "").toString();
                    const lastText = (lastFields[key] ?? "").toString();

                    // Check if a new full word has been added (more reliable than using 4 chars or punctuation)
                    const newWords = currentText.trim().split(/\s+/);
                    const oldWords = lastText.trim().split(/\s+/);

                    // Detect if a full word has been added or removed
                    const isNewText = currentText !== lastText;
                    const isNewWord = newWords.length !== oldWords.length || !newWords.every((word, i) => word === oldWords[i]);

                    if (isNewText && isNewWord) {
                        hasChanged = true;
                        break;
                    }

                }

                if (hasChanged) {
                    // Save a full snapshot of the element to the history log
                    // Ensures undo/redo works correctly without corrupting or losing the element
                    this.pushToHistoryLog({
                        id: elementId,
                        changeType: StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED,
                        isLocked: element.isLocked,
                        attributes: element.attributes,
                        functions: element.functions,
                        name: element.name, 
                        stereotype: element.stereotype, 
    
                        // Correctly reconstructs element
                        kind: element.kind,
                        x: element.x,
                        y: element.y,
                        width: element.width,
                        height: element.height, 
    
                        ...Element.GetFillColor(elementId),
                        ...Element.GetStrokeColor(elementId),
                        ...StateChange.GetSequenceAlternatives(),
                        state: StateChange.ChangeElementState()
                    });
                    this.lastTypedTextMap[elementId] = {
                        name: currentFields.name,
                        attributes: currentFields.attributes,
                        functions: currentFields.functions
                    };
    
                    this.numberOfChanges++;
                    updateLatestChange();
                }
                break;
            case StateChange.ChangeTypes.ELEMENT_RESIZED:
                // If the save() call comes from the same change-motion, remove the last entry
                if (lastLog.changeType == newChangeType && lastLog.counter == historyHandler.inputCounter) {
                    this.historyLog.splice(this.historyLog.length - 1, 1);
                }

                // Only store if the resized object isn't overlapping
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
        stateMachine.numberOfChanges++;
        updateLatestChange();
    }

    /**
     * @description Pushes a new entry to the historyLog array and sets index to the last position.
     * @param {object} entry Data to store in the history.
     */
    pushToHistoryLog(entry) {
        this.historyLog.push({
            ...entry,
            changeType: this.changeType,
            counter: historyHandler.inputCounter,
            time: this.currentTime
        });
        // Updating index to latest state push
        this.currentHistoryIndex = this.historyLog.length - 1;

        // It's possible to store multple of the same entries, by using the properties save button for example, this is used to remove those
        this.removeDuplicateEntries();
    }

    // Function to remove duplicate entries if there are any. Returns/exits if there are fewer than two entries in the log
    removeDuplicateEntries() {
        if (this.historyLog.length < 2) return;

        for (let i = 1; i < this.historyLog.length; i++) {
            if (sameObjects(this.historyLog[i - 1], this.historyLog[i], ['counter', 'time'])) {
                this.historyLog.splice(i, 1);
            }
        }
    }

    // Function to remove any history entries that come after the current index, determined by currentHistoryIndex 
    removeFutureStates() {
        if (this.currentHistoryIndex != this.historyLog.length - 1) {
            this.historyLog.splice(this.currentHistoryIndex + 1, (this.historyLog.length - this.currentHistoryIndex - 1));
        }
    }

    /**
     * @description Undoes the last stored history log changes. Determines what should be looked for by reading the state change flags.
     * @see StateChange For available flags.
     */
    stepBack() {
        // Clearing context prevents selection box drawing on removed objects
        clearContext();
        clearContextLine();

        // Remove ghost only if stepBack while creating edge
        if (mouseMode === mouseModes.EDGE_CREATION) clearGhosts();

        // Keep going back while the time attribute is the same
        do {
            // Return if there is no history, otherwise go back a step
            if (this.currentHistoryIndex == -1) {
                return;
            } else {
                this.currentHistoryIndex--;
            }

            this.scrubHistory(this.currentHistoryIndex);

            var doNextState = false;
            // Checks if the current and previous entries in the log have the same timestamp, i.e. made at the same time. If they are they are treated as one single state to undo
            if (this.historyLog[this.currentHistoryIndex + 1] && this.historyLog[this.currentHistoryIndex]) {
                doNextState = (this.historyLog[this.currentHistoryIndex].time == this.historyLog[this.currentHistoryIndex + 1].time);
            }

        } while (doNextState);

        displayMessage(messageTypes.SUCCESS, "Changes reverted!");
        disableIfDataEmpty();
    }

    /**
     * @description Restores undone changes in the history log. Determines what should be looked for by reading the state change flags.
     * @see StateChange For available flags.
     */
    stepForward() {
        // Return if there isn't anything to restore
        if (this.historyLog.length == 0 || this.currentHistoryIndex == (this.historyLog.length - 1)) return;

        // Go one step forward, if the next state in the history has the same time, redo that state as well
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

    /**
     * @description "Rebuilds" the history log up to a specified index.
     * @param {HistoryIndex} endIndex End point, specifying up to what index the log should be rebuilt.
     */
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
     * @description Restore a given state.
     * @param {StateChange} state The state that should be restored.
     */
    restoreState(state) {
        // Get all keys from the state.
        var keys = Object.keys(state);
        // If there is only an key that is ID in the state, delete those objects
        if (keys.length == 2 && keys[0] == "id" || keys.includes('deleted')) {
            var elementsToRemove = [];
            var linesToRemove = [];

            // If the ID is not an array, make it into an array
            if (!Array.isArray(state.id)) state.id = [state.id];

            // For every ID, find the object and add to the corresponding array
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

                } else { // Else it must be a line - apply defaults and create the line
                    Object.keys(defaultLine).forEach(key => {
                        if (!temp[key]) temp[key] = defaultLine[key];
                    });
                    lines.push(temp);
                }
            }
        }
    }

    /**
     * @description Go back to the inital state in the diagram.
     */
    gotoInitialState() {
        // Set initial values for data and lines
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
     * @param {Number} cri (CurrentReplayIndex) The starting index of timestamp-map to start on.
     */
    replay(cri = parseInt(document.getElementById("replay-range").value)) {
        // Return if no history exists
        if (this.historyLog.length == 0) return;

        var tsIndexArr = Object.keys(settings.replay.timestamps);

        clearInterval(this.replayTimer);

        // If cri (CurrentReplayIndex) is the last set to beginning
        if (cri == tsIndexArr.length - 1) cri = -1;

        setReplayRunning(true);
        document.getElementById("replay-range").value = cri.toString();

        // Go back to the beginning
        this.scrubHistory(tsIndexArr[cri]);

        var self = this;
        var startDelay = settings.replay.delay;
        this.replayTimer = setInterval(function replayInterval() {

            cri++;
            // Defining start state
            var startStateIndex = tsIndexArr[cri];
            var stopStateIndex;

            // Defining end state for the replay
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

            // Restores all states in the replay range
            for (let i = startStateIndex; i <= stopStateIndex; i++) {
                self.restoreState(self.historyLog[i]);

                // Resets interval timer to new value if chosen interval is changed mid-replay
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

            // Clear interval timer and mark replay as stopped when at end of replay range
            if (tsIndexArr.length - 1 == cri) {
                clearInterval(self.replayTimer);
                setReplayRunning(false);
            }
        }, settings.replay.delay * 1000)
    }
}

// #endregion
// #region INIT AND SETUP 
// ============================================================================================
// ====================================== INIT AND SETUP ======================================

// An event listener for when the window is loaded, this hides the loading spinner and calls start up functions
window.addEventListener("DOMContentLoaded", () => {
    getData();
    addAlertOnUnload();
    document.getElementById("loadingSpinner").style.display = "none";
});

// Global statemachine init, moved from onSetup
stateMachine = new StateMachine(data, lines);

/**
 * @description Very first function that is called when the window is loaded.
 *  This will perform initial setup and then call the drawing functions to generate the first frame on the screen.
 */
function getData() {
    container = document.getElementById("container");
    DiagramResponse = fetchDiagram();

    //Add event listeners 
    document.getElementById("diagram-toolbar").addEventListener("mousedown", mdown);
    document.getElementById("diagram-toolbar").addEventListener("mouseup", tup);
    document.getElementById("container").addEventListener("mousedown", mdown);
    document.getElementById("container").addEventListener("mouseup", mup);
    document.getElementById("container").addEventListener("mousemove", mmoving);
    document.getElementById("container").addEventListener("wheel", mwheel);
    document.getElementById("options-pane").addEventListener("mousedown", mdown);

    //Mobile FAB-buttons
    document.getElementById("fab-check").addEventListener("click", toggleErrorCheck);
    document.getElementById("fab-localSaveAs").addEventListener("click", showSavePopout);
    document.getElementById("fab-localSave").addEventListener("click", quickSaveDiagram);
    document.getElementById("fab-load").addEventListener("click", showModal);

    //Main mobile FAB-button
    document.getElementById("diagram-fab").addEventListener("click", () =>{
        document.querySelectorAll('.fab-inner').forEach(button => {
            button.style.display = button.style.display === 'flex' ? 'none' : 'flex';
          });
    });

    /*Mobile side navbar buttons
    Getting functions used in a separate file, to they can be used in the side navBar 
    async function loadDiagram() {
        const { uploadFile, reset } = await import('./templates/diagram_dugga.js');
        document.getElementById("mb-saveDuggaButton").addEventListener("click", () => {
            uploadFile();
            showReceiptPopup();
        });
        document.getElementById("mb-resetDuggaButton").addEventListener("click", reset);
   
    loadDiagram(); 

    */

    document.getElementById("mb-saveDuggaButton").addEventListener("click", () => {
        uploadFile();
        showReceiptPopup();
    });
    document.getElementById("mb-resetDuggaButton").addEventListener("click", reset);

    document.getElementById("mb-darkModeButton").addEventListener("click", burgerToggleDarkmode);
    document.getElementById("mb-loadDuggaButton").addEventListener("click", showLoadDuggaPopup);
    document.getElementById("mb-Home").addEventListener("click", () => { //had to be in a function or it
        window.location.assign('/DuggaSys/courseed.php');
    });
    document.getElementById("mb-loginButton").addEventListener("click", showLoginPopup);

     

    

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
    saveDiagramBeforeUnload();
    setupTouchAsMouseSupport();

    // Setup and show only the first element of each PlacementType, hide the others in dropdown
    // SHOULD BE CHANGED LATER
    togglePlacementType(0, 0);
    togglePlacementType(1, 1);
    togglePlacementType(9, 9);
    togglePlacementType(12, 12);
}

// #endregion
// #region EVENTS
// ============================================================================================
// ========================================== EVENTS ==========================================


// #region Window Events
// --------------------------------------- Window Events --------------------------------

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

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});


// Adds an EventListener to the document, that listens for keys being pressed
// NOTE: If adding additional keyboard shortcuts, keep in mind that if the action taken happens instantaneously and is only meant to happen once per press, only call upon the function in the other EventListener below
document.addEventListener('keydown', function (e) {
    // Sets variables for each special key (Ctrl, Alt, etc.) to true if they are being pressed down
    if (isKeybindValid(e, keybinds.LEFT_CONTROL) && !ctrlPressed) ctrlPressed = true;
    if (isKeybindValid(e, keybinds.ALT) && !altPressed) altPressed = true;
    if (isKeybindValid(e, keybinds.META) && !ctrlPressed) ctrlPressed = true;

    // Exits out of the replay mode if the escape button is pressed when replay mode is active
    if (isKeybindValid(e, keybinds.ESCAPE) && !escPressed && settings.replay.active) {
        toggleReplay();
        setReplayRunning(false);
        clearInterval(stateMachine.replayTimer);
    }

    // Special functionality for if the enter button is pressed when writing something in an input field
    if (isKeybindValid(e, keybinds.ENTER) && /INPUT|SELECT/.test(document.activeElement.nodeName.toUpperCase())) {
        if (document.getElementById("lineLabel")) {
            changeLineProperties();
        } else if (document.activeElement.id == "saveDiagramAs") {
            saveDiagramAs(getCurrentFileName());
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
    // Functionality for each available keyboard shortcut in the diagram. Check constants.js to see all keybinds.
    // "e.preventDefault() prevents the browser from taking action upon a keyboard shortcut being pressed." 
    // This ensures that no keyboard shortcuts for the diagram end up clashing with commonplace browser shortcuts.
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

    // Moving object with arrow keys
    if (isKeybindValid(e, keybinds.MOVING_OBJECT_UP)) {
        e.preventDefault();
        if (settings.grid.snapToGrid) {
            setPos(context, 0, settings.grid.gridSize / 2);
        } else {
            setPos(context, 0, 1);
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_DOWN)) {
        e.preventDefault();
        if (settings.grid.snapToGrid) {
            setPos(context, 0, -settings.grid.gridSize / 2);
        } else {
            setPos(context, 0, -1);
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_LEFT)) {
        e.preventDefault();
        if (settings.grid.snapToGrid) {
            setPos(context, settings.grid.gridSize / 2, 0);
        } else {
            setPos(context, 1, 0);
        }
    }

    if (isKeybindValid(e, keybinds.MOVING_OBJECT_RIGHT)) {
        e.preventDefault();
        if (settings.grid.snapToGrid) {
            setPos(context, -settings.grid.gridSize / 2, 0);
        } else {
            setPos(context, -1, 0);
        }
    }

    // Saving and loading diagrams
    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM)) {
        e.preventDefault();
    }
    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM_AS)) {
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
    historyHandler.inputCounter = (historyHandler.inputCounter + 1) % 1024;
});


// Adds an EventListener to the document that listens for keys being released. 
// Only call upon functions here if the press is only meant to trigger the action once AND the action is instantaneous
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
        // Reverts input name if not saved and closes the options panel if ESC is pressed during element renaming
        if (document.activeElement.id == 'elementProperty_name' && isKeybindValid(e, keybinds.ESCAPE)) {
            if (context.length == 1) {
                document.activeElement.value = context[0].name;
                document.activeElement.blur();
                toggleOptionsPane();
            }
        }
        return;
    }

    // Undo/Redo
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

    // Mouse Modes
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

    // Note
    if (isKeybindValid(e, keybinds.NOTE_ENTITY)) {
        setElementPlacementType(elementTypes.note);
        setMouseMode(mouseModes.PLACING_ELEMENT);
    }

    // Actions which are taken if the keyboard shortcut has been pressed and released
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
    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM)) quickSaveDiagram();
    if (isKeybindValid(e, keybinds.SAVE_DIAGRAM_AS)) showSavePopout();
    if (isKeybindValid(e, keybinds.RESET_DIAGRAM)) resetDiagramAlert();
    if (isKeybindValid(e, keybinds.TOGGLE_TEST_CASE)) toggleTestCase();
    if (isKeybindValid(e, keybinds.TOGGLE_ERROR_CHECK)) toggleErrorCheck();

    if (isKeybindValid(e, keybinds.COPY)) {
        // Remove the preivous copy-paste data from localstorage
        if (localStorage.key('copiedElements')) localStorage.removeItem('copiedElements');
        if (localStorage.key('copiedLines')) localStorage.removeItem('copiedLines');

        if (context.length) {
            // Filter - keeps only the lines that are connectet to and from selected elements
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

// Listener for resizing the window
window.addEventListener("resize", updateRulers);

window.onfocus = function () {
    altPressed = false;
    ctrlPressed = false;
};

// Listener for the mouse leaving the browser window
document.addEventListener("mouseleave", function (event) {
    if (event.toElement == null && event.relatedTarget == null) {
        pointerState = pointerStates.DEFAULT;
    }

    if ((event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) || event.clientY <= 0 || event.clientX <= 0) {
        mouseMode_onMouseUp();
    }
});

// Listener for the mouse leaving the bounds of any element, including the browser window
document.addEventListener("mouseout", function (event) {
    if ((event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) || event.clientY <= 0 || event.clientX <= 0) {
        mouseMode_onMouseUp();
    }
});

// #region Touch Events
// --------------------------------------- Touch Events ---------------------------------------

/**
 * @description Event function triggered when touch is registered on top of the container and converts it to a mouseEvent.
 * @param {TouchEvent} touchEvent The original touch event to convert to mouse event.
 * @param {string} [type="mousedown"] This is the mouse event type to simulate.
 * @returns {MouseEvent} A synthetic MouseEvent object that mimics the touch event.
 */

function convertTouchToMouse(touchEvent, type = "mousedown") {
    // Get the first changed touch point
    const touch = touchEvent.changedTouches[0];

    // Create a synthetic mouse event using the touch coordinates
    const mouseEvent = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        clientX: touch.clientX,
        clientY: touch.clientY,
    });

    // Prevents scrolling in browser when panning the canvas
    touchEvent.preventDefault();

    // Returns the synthesized mouse event
    return mouseEvent;
}

// Variables to track pinch-zooming state
let initialPinchDistance = null;
let lastPinchZoomTime = 0;

// Constants to control pinch-zoom sensitivity
const pinchZoomThreshold = 5; // Minimum px difference to trigger zoom
const pinchZoomCooldown = 100; // Minimum ms between pinch zooms

// Sets up touch support that simulates mouse events
function setupTouchAsMouseSupport() {
    const container = document.getElementById("container");

    // Handle touchstart: either simulates mousedown or prepare for pinch-zoom
    container.addEventListener("touchstart", function (event) {
        if (event.touches.length === 1) {
            // Single touch, simulates a mouse down event
            const mouseEvent = convertTouchToMouse(event, "mousedown");
            container.dispatchEvent(mouseEvent);
        } else if (event.touches.length === 2) {
            // Two fingers, start measuring pinch distance
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            initialPinchDistance = Math.hypot(dx, dy);
        }
    }, { passive: false });

    // Handle touchmove: either simulate mousemove or process pinch-zoom
    container.addEventListener("touchmove", function (event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            // Singel touch, simulate mouse move event
            const mouseEvent = convertTouchToMouse(event, "mousemove");
            container.dispatchEvent(mouseEvent);
        } else if (event.touches.length === 2 && initialPinchDistance !== null) {
            // Two fingers, handle pinch-zoom
            handlePinchZoom(event);
        }
    }, { passive: false });

    // Handle touchend: simulate mouseup and reset pinch state
    container.addEventListener("touchend", function (event) {
        if (event.touches.length === 0) {
            // No touches left, simulate mouse up event
            const mouseEvent = convertTouchToMouse(event, "mouseup");
            container.dispatchEvent(mouseEvent);
            initialPinchDistance = null;
        }
    }, { passive: false });
}

/**
 * @description Handles pinch-zoom gesture detection and triggers zoom-in or zoom-out actions.
 * @param {TouchEvent} event The current touch event containing two active touch points.
 */

function handlePinchZoom(event) {
    // Calculate the current distance between two fingers
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const newDistance = Math.hypot(dx, dy);

    // Save the current time to check if enough time has passed to trigger a new pinch-zoom
    const now = Date.now();

    // Check if distance change is bigger than threshold and if enough time has passed since last zoom event
    if (Math.abs(newDistance - initialPinchDistance) > pinchZoomThreshold && now - lastPinchZoomTime > pinchZoomCooldown) {
        // Calculate the midpoint between two fingers
        const zoomCenter = {
            clientX: (event.touches[0].clientX + event.touches[1].clientX) / 2,
            clientY: (event.touches[0].clientY + event.touches[1].clientY) / 2
        };

        // Zoom in if new distance is larger than initial, otherwise zoom out
        if (newDistance > initialPinchDistance) {
            zoomin(zoomCenter);
        } else {
            zoomout(zoomCenter);
        }

        // Update the last zoom time and reference distance
        lastPinchZoomTime = now;
        initialPinchDistance = newDistance;
    }
}

// #region Mouse Events
// --------------------------------------- Mouse Events ---------------------------------------

/**
 * @description Called on mouse up if no pointer state has blocked the input in the mup()-function.
 * @param {MouseEvent} event Triggered mouse event.
 * @see mup() For event triggering mouse down.
 */
function mouseMode_onMouseUp(event) {
    if (!hasPressedDelete) {
        // Handling which action to take depending on what mouseMode was active on mouseUp
        switch (mouseMode) {
            case mouseModes.PLACING_ELEMENT:
                clearContext();
                clearContextLine();
                if (ghostElement && event.button == 0) {
                    addObjectToData(ghostElement, false);
                    stateMachine.save(ghostElement.id, StateChange.ChangeTypes.ELEMENT_CREATED);
                    makeGhost();
                    showdata();
                }
                break;
            case mouseModes.EDGE_CREATION:
                if (context.length > 1) {
                    // TODO: Change the static variable to make it possible to create different lines
                    addLine(context[0], context[1], "Normal");
                    clearContext();
                    // Bust the ghosts
                    ghostElement = null;
                    ghostLine = null;
                    showdata();
                    updatepos();
                } else if (context.length === 1) {
                    if (event.target.id != "container") {
                        // Checks if a ghostline already exists and if so sets the relation recursively
                        if (ghostLine != null) {
                            // Create a line from the element to itself
                            addLine(context[0], context[0], "Normal", true);
                            clearContext();
                            // Bust the ghosts
                            ghostElement = null;
                            ghostLine = null;
                            showdata();
                            updatepos();
                        }
                        else {
                            elementTypeSelected = elementTypes.Ghost;
                            makeGhost();
                            // Create ghost line
                            ghostLine = { id: makeRandomID(), fromID: context[0].id, toID: ghostElement.id, kind: "Normal", ghostLine: true };
                        }
                    } else if (ghostElement !== null) {
                        clearContext();
                        ghostElement = null;
                        ghostLine = null;
                        showdata();
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
            case mouseModes.POINTER: // Do nothing
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

                // Letting the system know that an object is being moved
                movingObject = true;

                // Moving object
                deltaX = startX - event.clientX;
                deltaY = startY - event.clientY;

                // Check coordinates of moveable element and if they are within snap threshold
                const moveableElementPos = screenToDiagramCoordinates(event.clientX, event.clientY);
                const snapId = visualSnapToLifeline(moveableElementPos);

                // Visualize the context snapping to lifeline (only a visual indication)
                if (snapId && context[0]?.kind === elementTypesNames.sequenceActivation) {
                    const lLine = data.find(el => el.id === snapId);
                    context[0].x = lLine.x + lLine.width / 2 - context[0].width / 2;
                    startX = event.clientX;
                    deltaX = 0;
                }
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
            if (elementData.kind == elementTypesNames.UMLInitialState || elementData.kind == elementTypesNames.UMLFinalState || elementData.kind == elementTypesNames.IERelation) {
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

                // Special resizing for IERelation elements, width needs to be double the height
                // Modifying height felt better during usage than modifying width
                if (elementData.kind == elementTypesNames.IERelation) {
                    deltaY = (startNode.downLeft) ? -(delta * 0.5) : delta * 0.5;
                } else {
                    deltaY = (startNode.downLeft) ? -delta : delta;
                }
            }

            let xChange, yChange, widthChange, heightChange;
            if (elementData.kind == elementTypesNames.sequenceActor || elementData.kind == elementTypesNames.sequenceObject) { // Special resize for sequenceActor and sequenceObject
                const maxRatio = 0.8;
                if ((startNode.left || startNode.upLeft || startNode.downLeft) && (startWidth + (deltaX / zoomfact)) > minWidth) { // Leftmost nodes while larger than minimum width
                    let tmpW = elementData.width;
                    let tmpX = elementData.x;
                    let movementY = elementData.width <= maxRatio * startHeight ? 0 : -(deltaX / zoomfact + startWidth - maxRatio * startHeight) / maxRatio;
                    let xChange = movementPosChange(elementData, startX, deltaX, true);
                    let widthChange = movementWidthChange(elementData, tmpW, tmpX, false);
                    let heightChange = movementHeightChange(elementData, startHeight, movementY, false);

                } else if (startNode.right && (startWidth - (deltaX / zoomfact)) > minWidth) { // Right node while larger than minimum width
                    var movementY = elementData.width <= maxRatio * startHeight ? 0 : -(-deltaX / zoomfact + startWidth - maxRatio * startHeight) / maxRatio;
                    let widthChange = movementWidthChange(elementData, startWidth, deltaX, true);
                    let heightChange = movementHeightChange(elementData, startHeight, movementY, false);

                } else if ((startNode.up || startNode.upLeft || startNode.upRight) && (startHeight + (deltaY / zoomfact)) > startWidth / maxRatio) { // Top nodes while within ratios
                    // Fetch original height and deduct the new height, giving us the total change
                    let tmpH = elementData.height;
                    let tmpY = elementData.y;
                    let yChange = movementPosChange(elementData, startY, deltaY, false);
                    const heightChange = movementHeightChange(elementData, tmpH, tmpY, true);

                } else if ((startNode.down || startNode.downLeft || startNode.downRight) && (startHeight - (deltaY / zoomfact)) > startWidth / maxRatio) { // Bottom nodes while within ratios
                    const heightChange = movementHeightChange(elementData, startHeight, deltaY, false);
                }

            } else { // Normal resize for the other elements
                // Functionality Left/Right resize
                if ((startNode.left || startNode.upLeft || startNode.downLeft) && (startWidth + (deltaX / zoomfact)) > minWidth) { // Leftmost nodes while above minWidth
                    let tmpW = elementData.width;
                    let tmpX = elementData.x;
                    xChange = movementPosChange(elementData, startX, deltaX, true);
                    widthChange = movementWidthChange(elementData, tmpW, tmpX, false);
                } else if ((startNode.right || startNode.upRight || startNode.downRight) && (startWidth - (deltaX / zoomfact)) > minWidth) { // Rightmost nodes while above minWidth
                    widthChange = movementWidthChange(elementData, startWidth, deltaX, true);
                }

                // Functionality Up/Down resize
                if ((startNode.down || startNode.downLeft || startNode.downRight) && (startHeight - (deltaY / zoomfact)) > minHeight) { // Bottom nodes while above minheight
                    heightChange = movementHeightChange(elementData, startHeight, deltaY, false);
                } else if ((startNode.up || startNode.upLeft || startNode.upRight) && (startHeight + (deltaY / zoomfact)) > minHeight) { // Top nodes while above minHeight
                    // Fetch original height and deduct the new height, giving us the total change
                    let tmpH = elementData.height;
                    let tmpY = elementData.y;
                    yChange = movementPosChange(elementData, startY, deltaY, false);
                    heightChange = movementHeightChange(elementData, tmpH, tmpY, true);
                }
            }

            // Store the changes in the history
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

/**
 * @description Calculates the change in position of an element being moved.
 * @param {data} element The element to move.
 * @param {pos} start Initial position of the element before moving.
 * @param {pos} delta The amount the element has been moved.
 * @param {boolean} isX Determines if the object is moving horizontally or not.
 * @returns Amount moved in the diagram, modified by zoom level.
 */
function movementPosChange(element, start, delta, isX) {
    // Mouse position is used causing the line to "jump" to the mous pos
    // The magic numbers are used to center the node middle with the mouse pointer
    property = isX ? 'x' : 'y';
    element[property] = isX ? originalX - delta / zoomfact : originalY - delta / zoomfact;
    // Deduct the new position, giving us the total change
    return - delta / zoomfact;
}

/**
 * @description Calculates new width of an element during resizing.
 * @param {data} element Element that is being resized.
 * @param {pos} start Initial x-position.
 * @param {pos} delta The change in position.
 * @param {boolean} isR Determines if the width is being changed to the right. If false, it changes it to the left.
 * @returns New width of element.
 */
function movementWidthChange(element, start, delta, isR) {
    element.width = (isR) ? start - delta / zoomfact : start + delta - element.x;
    return element.width;
}

/**
 * @description Calculates new height of an element during resizing.
 * @param {data} element Element that is being resized.
 * @param {pos} start Initial y-position.
 * @param {pos} delta The change in position.
 * @param {boolean} isUp Determines if the height is being changed upwards. If false, it changes it downwards.
 * @returns New height of element.
 */
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

// #endregion
// #region ELEM. MANIPULATION
// ======================================================================================
// ================================ ELEMENT MANIPULATION ================================

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
                // Only the ID:s should be sent to save()
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

    // Removes from the two arrays that keep track of the attributes connections 
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
    // Getting old/current state of element
    const element = context[0];
    const oldRelation = element.state;

    //Get new state of element from dropdown menu in options pane, save change if the new state is different from the old one
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
    // Getting the fieldset and its child elements
    const propSet = document.getElementById("propertyFieldset");
    const element = context[0];
    const children = propSet.children;
    const propsChanged = {};

    // Iterates through all children of the property element
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const inputTag = child.id;
        if (inputTag == "elementProperty_name") { // Special handling if the child is the input for the name of the element
            let value = child.value;
            element.name = value;
            propsChanged.name = value;
            continue;
        }
        const addToLine = (name, symbol) => { // Function that handles other property elements, like "Property_stereotype" or "Property_functions"
            if (inputTag == `elementProperty_${name}`) {

                // Splits the input on each new line, adding each line to an array
                let lines = child.value.trim().split("\n");
                for (let j = 0; j < lines.length; j++) { // Adds the symbol of the property type to the beginning of each line
                    if (lines[j] && lines[j].trim()) {
                        if (Array.from(lines[j])[0] != symbol) {
                            lines[j] = symbol + lines[j];
                        }
                    }
                }
                // Adds the array of lines with the symbols to the element and the list of changed properties
                element[name] = lines;
                propsChanged[name] = lines;
            }
        };
        // TODO: This should use elementTypeNames.note. It doesnt follow naming standard
        if (element.kind == elementTypesNames.SDEntity || element.kind == 'note') { // Special call upon the addToLine function without defined symbol for SD elements and notes
            addToLine("attributes", "");
            continue;
        }
        //Calling addToLine for each possible type of property besides name
        addToLine("primaryKey", "*");
        addToLine("attributes", "-");
        addToLine("stereotype", "");
        addToLine("functions", "+");
    }
    // Saves the changes and updates relevant graphics
    stateMachine.save(element.id, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    showdata();
    updatepos();
}

/**
 * @description Places a copy of all elements into the data array centered around the current mouse position.
 * @param {Array<Object>} elements List of all elements to paste into the data array.
 */
function pasteClipboard(elements, elementsLines) {
    // If elements list is empty, display error and return null
    if (elements.length == 0) {
        displayMessage("error", "You do not have any copied elements");
        return;
    }


    // Calculate the coordinate for the top-left pos (x1, y1), and the coordinate for the bottom-right (x2, y2)
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
        // Make a new ID and save it in an object
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

        // Check for overlap before adding
        addObjectToData(elementObj, false); // Add to data
    });

    // Create the new lines but don't save them to the stateMachine
    // TODO: Using addLine removes labels and arrows. Find way to save lines with all attributes.
    connectedLines.forEach(line => {
        newLines.push(
            addLine(data[findIndex(data, line.fromID)], data[findIndex(data, line.toID)], line.kind, false, false, line.cardinality)
        );
    });

    // Save the copied elements to the stateMachine
    stateMachine.save([newElements.map(e => e.id), newLines.map(e => e.id)], StateChange.ChangeTypes.ELEMENT_AND_LINE_CREATED);
    displayMessage(messageTypes.SUCCESS, `You have successfully pasted ${elements.length} elements and ${connectedLines.length} lines!`);
    clearContext(); // Deselect old selected elements
    clearContextLine();
    context = newElements; // Set context to the pasted elements
    contextLine = newLines; // Set contextline to the pasted lines
    showdata();
}

// #endregion
// #region REPLAY
// ======================================================================================
// ======================================= REPLAY =======================================

/**
 * @description Change the state in replay-mode with the slider.
 * @param {Number} sliderValue The value of the slider.
 */
function changeReplayState(sliderValue) {
    const timestampKeys = Object.keys(settings.replay.timestamps);

    // If the last timestamp is selected, go to the last state in the diagram
    if (timestampKeys.length - 1 == sliderValue) {
        stateMachine.scrubHistory(stateMachine.historyLog.length - 1);
    } else stateMachine.scrubHistory(timestampKeys[sliderValue + 1] - 1);
}

/**
 * @description Toggles stepForward in history.
 * @NOTE USED IN PHP
 */
function toggleStepForward() {
    stateMachine.stepForward();
}

/**
 * @description Toggles stepBackwards in history.
 * @NOTE USED IN PHP
 */
function toggleStepBack() {
    stateMachine.stepBack();
}

/**
 * @description Toggles the replay-mode, shows replay-panel, hides unused elements.
 */
function toggleReplay() {
    // If there is no history => Display error and return
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
        settings.replay.timestamps = { 0: 0 }; // Clear the array with all timestamps

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

        // Set mouseMode to Pointer
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

    // Change the settings-boolean for replay active
    settings.replay.active = !settings.replay.active;
}

/** @description Gives the exit button its intended functionality to exit out of replay-mode. */
function exitReplayMode() {
    toggleReplay();
    setReplayRunning(false);
    clearInterval(stateMachine.replayTimer);
}

/**
 * @description Sets the replay-delay value.
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
 * @description Changes the play/pause button and locks/unlocks the sliders in replay-mode.
 * @param {boolean} state The state if the replay-mode is running.
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

// #endregion
// #region GUI
// ======================================================================================
// ======================================== GUI =========================================

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
 * @NOTE USED IN PHP
 */
function setElementPlacementType(type = elementTypes.EREntity) {
    elementTypeSelected = type;
}

/**
 * @description Variable to hold current subtoolbar.
 * @NOTE USED LOCALLY
 */
let currentlyOpenSubmenu = null;

/**
 * @description Function to open a subtoolbar when hovering over a button
 * @NOTE USED IN PHP
 */
function hoverPlacementButton(index) {
    // First, hide the old submenu if a new button is hovered
    if (currentlyOpenSubmenu !== null && currentlyOpenSubmenu !== index) {
        hidePlacementType();
    }

    let submenu = document.getElementById(`togglePlacementTypeBox${index}`);
    if (submenu) {
        submenu.classList.add("activeTogglePlacementTypeBox");
        currentlyOpenSubmenu = index;
    } else {
        currentlyOpenSubmenu = null;
    }
}

/**
 * @description Function to hide submenu.
 * @NOTE USED IN PHP
 */
function hidePlacementType() {
    if (currentlyOpenSubmenu !== null) {
        let submenu = document.getElementById(`togglePlacementTypeBox${currentlyOpenSubmenu}`);
        if (submenu) {
            submenu.classList.remove("activeTogglePlacementTypeBox"); // Hide submenu
        }
        currentlyOpenSubmenu = null;
    }
}

// Modified original function to work with hovering and also handle pressing if needed
function holdPlacementButtonDown(num) {
    mousePressed = true;
}

/**
 * @description Resets the mouse press.
 * @NOTE USED IN PHP
 */
function holdPlacementButtonUp(num) {
    mousePressed = false;
}

/**
 * @description Generates keybind tooltips for all keybinds that are available for the diagram.
 * @see keybinds All available keybinds currently configured.
 */
function generateToolTips() {
    const toolButtons = document.getElementsByClassName("key_tooltip");

    for (let index = 0; index < toolButtons.length; index++) {
        const element = toolButtons[index];
        const id = element.id.split("-")[1];
        if (Object.getOwnPropertyNames(keybinds).includes(id)) {
            let str = "Keybinding: ";

            // Manually adding special keys to the tooltip (keys that aren't single letters or numbers)
            if (keybinds[id].ctrl) str += "CTRL + ";

            if (keybinds[id].shift) str += "SHIFT + ";

            if (keybinds[id].alt) str += "ALT + ";

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

//#endregion
//#region LOAD AND EXPORTS
// ======================================================================================
// ================================== LOAD AND EXPORTS ==================================

/**
 * @description Create and download a file.
 * @param {String} filename The name of the file that get generated.
 * @param {*} dataObj The text content of the file.
 */
function downloadFile(filename, dataObj) {
    // Create an "a"-element
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataObj)));
    element.setAttribute('download', filename + ".json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/**
 * @description Prepares data for file creation, retrieves history and initialState.
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
 * @description Stores the current diagram as JSON in localstorage.
 * @param {string} key The name/key of the diagram.
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

        // Sets the latestChange diagram first, if it is not already set
        if (!localStorage.getItem("diagrams")) {
            let s = `{"latestChange": ${JSON.stringify(objToSave)}}`;
            localStorage.setItem("diagrams", s);
        }
        // Gets the string thats contains all the local diagram saves and updates an existing entry or creates a new entry based on the value of 'key'
        let local = localStorage.getItem("diagrams");
        local = (local[0] == "{") ? local : `{${local}}`;

        let localDiagrams = JSON.parse(local);
        objToSave.timestamp = new Date().getTime();
        localDiagrams[key] = objToSave;
        localStorage.setItem("diagrams", JSON.stringify(localDiagrams));
        stateMachine.numberOfChanges = 0; // Reset the number of changes to 0, so that the user can save again without having to make a change first
        displayMessage(messageTypes.SUCCESS, "Diagram saved! (File saved to: " + key + ")");
        
    }
}

// Mostly the same as storeDiagramInLocalStorage
// Uppdates the latestChange to always be in the latest state
function updateLatestChange() {
    if (stateMachine.currentHistoryIndex === -1) {
        return;
    }
    stateMachine.removeFutureStates();

    const objToSave = {
        historyLog: stateMachine.historyLog,
        initialState: stateMachine.initialState
    };
    const jsonData = localStorage.getItem("diagrams") || "{}";
    const diagrams = JSON.parse(jsonData);
    diagrams.latestChange = objToSave;
    localStorage.setItem("diagrams", JSON.stringify(diagrams));
}

/**
 * @description Prepares data for file creation, retrieves data and lines, also filter unnecessary values.
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
            // Return if they key is ignored
            if (keysToIgnore.includes(objKey)) return;

            // Adding object data to the exported file ONLY if the data differs from default values
            if (defaults[obj.kind][objKey] != obj[objKey]) {
                filteredObj[objKey] = obj[objKey];
            }
        });
        objToSave.data.push(filteredObj); // Pushing the filtered data to the objToSave structure
    });

    keysToIgnore = ["dx", "dy", "ctype"];
    lines.forEach(obj => {
        const filteredObj = {};
        Object.keys(obj).forEach(objKey => {
            // Return if the key is ignored
            if (keysToIgnore.includes(objKey)) return;

            // Adding line data to the exported file ONLY if the data differs from default values
            if (defaultLine[objKey] != obj[objKey]) {
                filteredObj[objKey] = obj[objKey];
            }
        });
        objToSave.lines.push(filteredObj); // Pushing filtered data to the structure
    });


    // Download the file
    downloadFile("diagram", objToSave);
}

/**
 * @description Load one of the stored JSON files.
 * @param path the path to the JSON file on the server that you want to load from, for example, JSON/IEDiagramMockup.json.
 */
function loadMockupDiagram(path) {
    // "resetDiagram()" calls this method with "EMPTYDiagram" as parameter

    // The path is not set yet if we do it from the dropdown as the function is called without a parameter
    if (!path) path = document.getElementById("diagramTypeDropdown").value;
    // Make sure path isn't null first
    if (path != null) {
        // Via fetch API, request the JSON file 
        fetch(path)
            .then((response) => {
                // Throw an error if the request is not ok
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                // Fetch the response as JSON
                return response.json();
            })
            // After response.json() has succeded, load the diagram from this JSON file
            .then((json) => loadDiagram(json, false))
            // Catch any error
            .catch((err) => console.error(`Fetch problem: ${err.message}`));
    }
}

/**
 * @description Gets the content of a specified file.
 * @param {File} files The file to retrieve content from.
 * @return The file content.
 */
function getFileContent(files) {
    // Creates a new FileReader that returns the file contents if successful, returns an error if unsuccessful
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
 * @description Load the content of a file to the diagram-data. This will remove previous data.
 */
async function loadDiagram(file = null, shouldDisplayMessage = true) {
    let temp;
    if (!file) {
        const fileInput = document.getElementById("importDiagramFile");

        // Return if input file isn't a JSON-file
        if (getExtension(fileInput.value) != "json") {
            if (shouldDisplayMessage) displayMessage(messageTypes.ERROR, "Sorry, you can't load that type of file. Only JSON-files are allowed");
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


 /**
  * @description Function that displays the window for loading save files. Handles showing the window as well as retrieving all available save-files.
  */
function showModal() {
    const modal = document.querySelector('.loadModal');
    const overlay = document.querySelector('.loadModalOverlay');
    const container = document.querySelector('#loadContainer');
    let diagramKeys;
    let localDiagrams;

    let local = localStorage.getItem("diagrams");


    // Parse saved diagrams from localstorage and sort them so autosave always remains at top and all other saves are ordered by most recent timestamp to appear closest to top
    if (local) {
        local = (local[0] == "{") ? local : `{${local}}`;
        localDiagrams = JSON.parse(local);
        diagramKeys = Object.keys(localDiagrams).sort((a, b) => {
            if (a === "AutoSave") return -1;
            if (b === "AutoSave") return 1;
            return localDiagrams[b].timestamp - localDiagrams[a].timestamp;
        });
    }

    // Remove all elements
    while (container.firstElementChild) {
        container.firstElementChild.remove();
    }

    // If no items to load in were found
    if (!diagramKeys || diagramKeys.length === 0) {
        const p = document.createElement('p');
        const pText = document.createTextNode('No saves could be found');
        p.appendChild(pText);
        container.appendChild(p);
    } else {
        // Loop through the saved diagrams
        for (let i = 0; i < diagramKeys.length; i++) {
            let wrapper = document.createElement('div');
            const btn = document.createElement('button');
            const btnText = document.createTextNode(diagramKeys[i]);

            btn.setAttribute("onclick", `loadDiagramFromLocalStorage('${diagramKeys[i]}');closeModal();`);
            btn.appendChild(btnText);
            wrapper.appendChild(btn);
            wrapper.style.display = "flex";
            btn.style.width = '100%';

            if (btnText.textContent !== 'latestChange') { // Only show delete button if not latestChange
                let delBtn = document.createElement('button');
                delBtn.classList.add('deleteLocalDiagram');
                delBtn.setAttribute("onclick", `removeLocalDiagram('${diagramKeys[i]}');showModal();`);
                delBtn.appendChild(document.createTextNode('Delete'));
                wrapper.appendChild(delBtn);
            }
            container.appendChild(wrapper);
        }

        // Update label count, exclude latestChange from count
        const filteredKeys = diagramKeys.filter(key => key !== 'latestChange'); // Exclude 'latestChange'
        document.getElementById('loadCounter').innerHTML = filteredKeys.length; // Set the label count
    }

    modal.classList.remove('hiddenLoad');
    overlay.classList.remove('hiddenLoad');
}

/**
 * @description Closes the load-save window.
 */
function closeModal() {
    const modal = document.querySelector('.loadModal');
    const overlay = document.querySelector('.loadModalOverlay');

    modal.classList.add('hiddenLoad');
    overlay.classList.add('hiddenLoad');
}


/**
 * @description Dynamic Confirmation popup, can be used for any confirmation popup.
 * @param {string} headerText The text to display in the header of the popup.
 * @param {string} messageText The text to display in the body of the popup.
 * @returns {Promise} A promise that resolves when the user clicks either "yes" or "no".
 * @see loadDiagramFromLocalStorage
 **/
function loadConfirmPopup(headerText, messageText) {

    if (stateMachine.numberOfChanges <= 0) { // Early exit if no changes
      return Promise.resolve();    
    }
    // Promise to force popup to finish before code continues
    let promise = new Promise(resolve => {
      $("#confirmationPopup").css("display", "flex");
      $("#confirmPopupHeader").text(headerText);
      $("#confrimPopupText").text(messageText);
      $("#confirmYes, #confirmNo, #closeWindow").click(function() {
          $("#confirmationPopup").hide();
          resolve(this.id === "confirmYes"); // Resolves if button had ID "confirmYes"
        });
    })
    return promise; 
  }
  

/**
 * @description Check whether there is a diagram saved in localstorage and load it.
 * @param {string} key The name/key of the diagram to load.
 */
function loadDiagramFromLocalStorage(key) { 
    const popupHeader = "You have unsaved changes!";
    const popupMessage = "Do you want to save them before loading a new diagram?";

    // Check if there are unsaved changes and show confirmation popup
    // If there are no changes, load the diagram directly
    loadConfirmPopup(popupHeader, popupMessage).then(userClickedYes => {
        stateMachine.numberOfChanges = 0;
        if (userClickedYes) quickSaveDiagram(); // Only true if user pressed yes

        // This is inside the promise, so it will wait for the user to click before executing
        if (localStorage.getItem("diagrams")) {
            let diagramFromLocalStorage = localStorage.getItem("diagrams");
            diagramFromLocalStorage = (diagramFromLocalStorage[0] == "{") ? diagramFromLocalStorage : `{${diagramFromLocalStorage}}`;
            let obj = JSON.parse(diagramFromLocalStorage);
            if (obj[key] === undefined) {
                console.error("Undefined key")
            } else {
                activeFile = key;
                loadDiagramFromString(obj[key]);

                // The name of the loaded file is shown on screen for the user. It only appears if there is a file selected
                const div = document.getElementById("diagramFileName");
                const span = document.getElementById("openedFileName");
                if (div && span) {
                    span.textContent = key;
                    div.style.display = "inline-block";
                }
            }
        } else {
            // Failed to load content
            console.error("No content to load")
        }
        disableIfDataEmpty();
     });
}

/**
 * @description Saves the current diagram if the user leaves the page.
 */
function saveDiagramBeforeUnload() {
    if (data.length) {
        window.addEventListener("beforeunload", (e) => {
            storeDiagramInLocalStorage("latestChange");
        })
    }
}
/**
 * @description Disables the toolbar save-buttons if there are no entries in the history log.
 */
function disableIfDataEmpty() {
    if (stateMachine.currentHistoryIndex === -1 || data.length === 0) {
        document.getElementById('localSaveField').classList.add('disabledIcon');
        document.getElementById('localSaveAsField').classList.add('disabledIcon');
    } else {
        document.getElementById('localSaveField').classList.remove('disabledIcon');
        document.getElementById('localSaveAsField').classList.remove('disabledIcon');
    }
}

/**
 * @description Displays the save-as popout window.
 */
function showSavePopout() {
    if (stateMachine.currentHistoryIndex === -1 || data.length === 0) {
        displayMessage(messageTypes.ERROR, "You don't have anything to save!");
    } else {
        $("#savePopoutContainer").css("display", "flex");
        document.getElementById("saveDiagramAs").focus();
    }
}

/**
 * @description Closes the save-as popout window.
 */
function hideSavePopout() {
    $("#savePopoutContainer").css("display", "none");
}

/**
 * @description Displays the override existing save file window.
 */
function showOverridePopout() {
    $("#overrideContainer").css("display", "flex");
}

/**
 * @description Closes the override existing save file window.
 */
function closeOverridePopout() {
    $("#overrideContainer").css("display", "none");
}

// Variable for checking if there's a file that has been saved to already. Used for quicksaving
let activeFile = null;

/**
 * @description Retrieves name of the file to save to from the users input. Also saves the name to the active file for use in quicksaving.
 * @returns The input file name.
 */
function getCurrentFileName() {
    let fileName = document.getElementById("saveDiagramAs");
    activeFile = fileName.value;
    return fileName.value;
}

/**
 * @description Quicksaves to the current file if there is one. Otherwise prompts to input a name for the designated file.
 */
function quickSaveDiagram() {
    if (activeFile == null) { // Shows save-as popout if there is no current active file
        showSavePopout();
        stateMachine.numberOfChanges = 0;
    } else {
        storeDiagramInLocalStorage(activeFile);
    }
}

/**
 * @description Saves the current diagram to a specified file.
 * @param {*} input Name of the file to save the diagram to.
 */
function saveDiagramAs(input) {

    // Code for getting date and time. Not used anymore but kept in in case it should be needed elsewhere.
    /*
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1) < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1; // Note: January is month 0
    const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const hours = currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours();
    const minutes = currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();
    const seconds = currentDate.getSeconds() < 10 ? `0${currentDate.getSeconds()}` : currentDate.getSeconds();
    const formattedDate = year + "-" + month + "-" + day + " ";
    const formattedTime = hours + ":" + minutes + ":" + seconds;
    */

    let names = [];
    let localDiagrams;

    // Get saved diagrams from localStorage
    let local = localStorage.getItem("diagrams");
    if (local != null) {
        local = (local[0] == "{") ? local : `{${local}}`;
        try {
            localDiagrams = JSON.parse(local);
            names = Object.keys(localDiagrams);
        } catch (error) {
            names = [];
        }
    }

    // Check if diagram name is unique
    for (let i = 0; i < names.length; i++) {
        if (names[i] == input) {
            hideSavePopout();
            showOverridePopout();
            return;
        }
    }

    storeDiagramInLocalStorage(input);
}

/**
 * @description Loads diagram from a specified save-file.
 * @param {*} temp Name of save-file to load diagram from.
 * @param {boolean} shouldDisplayMessage Boolean that decides whether to display success/error message after loading. Defaults to true.
 */
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

/**
 * @description Function that deletes a specified save-file.
 * @param {*} item Name of save file to delete.
 */
function removeLocalDiagram(item) {
    let local = localStorage.getItem("diagrams");
    local = (local[0] == "{") ? local : `{${local}}`;
    let localDiagrams = JSON.parse(local);

    if (item !== 'latestChange') {
        delete localDiagrams[item];
        // Resets activeFile to null if the item deleted was the file currently saved to
        if (item == activeFile) {
            activeFile = null;
        }
        localStorage.setItem("diagrams", JSON.stringify(localDiagrams));
        showModal(); // Refresh the modal after deletion
    } else {
        displayMessage(messageTypes.ERROR, "Error, unable to delete 'latestChange'"); // Prevent deleting latestChange
    }

    // After deletion, update the counter again, excluding 'latestChange'
    let updatedLocal = localStorage.getItem("diagrams");
    if (updatedLocal) {
        updatedLocal = (updatedLocal[0] == "{") ? updatedLocal : `{${updatedLocal}}`;
        let updatedDiagrams = JSON.parse(updatedLocal);
        const updatedKeys = Object.keys(updatedDiagrams).filter(key => key !== 'latestChange');
        document.getElementById('loadCounter').innerHTML = updatedKeys.length; // Update the counter
    }
}

/**
 * @description Alert function to give user a warning/choice before reseting diagram data.
 * @NOTE USED IN PHP
 */
function resetDiagramAlert() {
    let refreshConfirm = confirm("Are you sure you want to reset to default state? All changes made to diagram will be lost");
    if (refreshConfirm) {
        resetDiagram();
    }
}

/**
 * @description Clears the diagram.
 */
function resetDiagram() {
    loadMockupDiagram("JSON/EMPTYDiagramMockup.json");
}

// #endregion
// #region MOBILE
// ======================================================================================
// ======================================= MOBILE =======================================


// EventListener to check if browser is sized for mobile screens, and adjusts ruler accordingly.
window.addEventListener("resize", () => {
    const ruler = document.getElementById("rulerOverlay");
    if (!settings.ruler.isRulerActive) return;

    if (window.innerWidth > 414) {
        ruler.style.left = "50px";
        ruler.style.top = "0px";
    }
    else {
        ruler.style.left = "0px";
        ruler.style.top = "0px";
    }
});

/** 
 * Improvement suggestion: Instead of attaching event listeners to each individual element, 
 * delegate the event by attaching a single event-listener to the parent (e.g., #mb-diagram-toolbar). 
 * Use e.target.tagName or e.target.classList to determine if a relevant child was clicked, 
 * and handle the action accordingly.
 */

// Select all toolbar boxes from the mobile toolbar
const elementToolbarBoxs = document.querySelectorAll(".mb-toolbar-main:not(.non-element)");

elementToolbarBoxs.forEach(elementBox=>{
    elementBox.addEventListener("click", handleToolbarClick);
});


// Select all toolbar boxes inside the sub menu
const subMenuToolbarBoxs = document.querySelectorAll(".mb-sub-menu .mb-toolbar-box");

subMenuToolbarBoxs.forEach(subMenuBox=>{
    subMenuBox.addEventListener("click", changeActiveElement);
});

//#endregion =====================================================================================
