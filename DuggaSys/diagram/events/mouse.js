/**
 * @description Event function triggered when the mousewheel reader has a value of grater or less than 0.
 * @param {WheelEvent} event - The mouse wheel event object.
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

/**
 * @description Event function triggered when any mouse button is pressed down on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mdown(event) {
    mouseButtonDown = true;

    context.forEach(el => {
       el.offsetX = event.clientX - el.x;
       el.offsetY = event.clientY - el.y;
   })

    //If anything but an element was clicked, toggle options panel.
    if (event.target.id == "container" && optionsToggled && !userLock) {
        console.log(event.target.id);
        optionsToggled = false;
        hideOptionsPane();
    }

    // Mouse pressed over delete button for multiple elements
    if (event.button == 0) {
        if (context.length > 0 || contextLine.length > 0) {
            canPressDeleteBtn = true;
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
    if (!hasPressedDelete && !settings.replay.active) {
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
                            pointerTool_Start(event.clientX, event.clientY);
                        } else {
                            pointerState = pointerStates.CLICKED_CONTAINER;
                            containerStyle.cursor = "grabbing";
                            if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                                wasDblClicked = true;
                            }
                        }
                        break;
                    } else {
                        pointerState = pointerStates.CLICKED_CONTAINER;
                        containerStyle.cursor = "grabbing";

                        // Only react to mouse pointer double click
                        if (event.pointerType === "mouse") {
                            if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                                wasDblClicked = true;
                                toggleOptionsPane();
                            }
                        }
                        

                    }

                    break;
                case mouseModes.BOX_SELECTION:
                    // If pressed down in selection box
                    if (context.length > 0) {
                        startX = event.clientX;
                        startY = event.clientY;
                        if (startX > selectionBoxLowX && startX < selectionBoxHighX && startY > selectionBoxLowY && startY < selectionBoxHighY) {
                            pointerState = pointerStates.CLICKED_ELEMENT;
                            targetElement = context[0];
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
            const element = data[findIndex(data, context[0].id)];

            // Save the original properties
            originalWidth = element.width;
            originalHeight = element.height;
            originalX = element.x;
            originalY = element.y;

            startWidth = data[findIndex(data, context[0].id)].width;
            startHeight = data[findIndex(data, context[0].id)].height;

            startNode.left = event.target.classList.contains("ml");
            startNode.right = event.target.classList.contains("mr");
            startNode.down = event.target.classList.contains("md");
            startNode.up = event.target.classList.contains("mu");
            startNode.upRight = event.target.classList.contains("tr");
            startNode.upLeft = event.target.classList.contains("tl");
            startNode.downRight = event.target.classList.contains("br");
            startNode.downLeft = event.target.classList.contains("bl");

            startX = event.clientX;
            startY = event.clientY;
        }
    }

    if (!event.target.parentElement.classList.contains("placementTypeBoxIcons")) {
        hidePlacementType();
    }

    dblPreviousTime = new Date().getTime();
    wasDblClicked = false;
    historyHandler.inputCounter = (historyHandler.inputCounter+1)%1024;
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of any element.
 * @param {MouseEvent} event Triggered mouse event.
 */
function ddown(event) {
    
    //If element was clicked, open options panel.
    if (!optionsToggled && !userLock) {
        optionsToggled = true;
        showOptionsPane();
    }
    
    // Mouse pressed over delete button for a single line over a element
    if (event.button == 0 && (contextLine.length > 0 || context.length > 0)) {
        canPressDeleteBtn = true;
        hasPressedDelete = checkDeleteBtn();
    }

    // Used when determining time between clicks.
    if ((new Date().getTime() - dblPreviousTime) < dblClickInterval && event.button == 0) {
        wasDblClicked = true; // General purpose bool. True when doubleclick was performed.

        const element = data[findIndex(data, event.currentTarget.id)];
        if (element != null && context.length == 1 && context.includes(element) && contextLine.length == 0) {
            event.preventDefault(); // Needed in order for focus() to work properly
            const input = document.getElementById("elementProperty_name");
            if (input !== null) {
                input.focus();
                input.setSelectionRange(0, input.value.length); // Select the whole text.
            }
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

                if (!altPressed && pointerState !== pointerStates.CLICKED_NODE) {
                    pointerState = pointerStates.CLICKED_ELEMENT;
                    targetElement = event.currentTarget;
                    canPressDeleteBtn = true;
                }
            // TODO: Should this be missing a break?
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
 * @description Event function triggered when any mouse button is released on top of the container. Logic is handled depending on the current pointer state.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates 
 */
function mup(event) {
    if (!mouseOverLine && !mouseOverElement) {
        setContainerStyles(mouseMode);
    }
    mouseButtonDown = false;
    targetElement = null;
    //let id = event.target.id;
    deltaX = startX - event.clientX;
    deltaY = startY - event.clientY;
    
    // makes sure that the id isn't in an array if a line is selected
    while (determinedLines && Array.isArray(determinedLines.id)) {
        determinedLines.id = determinedLines.id[0];
    }
    
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
            if (!deltaExceeded && mouseMode != mouseModes.EDGE_CREATION) {
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
                // If there are elements selected in the context
            if (context.length > 0) {
                setPos(context, deltaX, deltaY);
                // Loop through each selected element
                context.forEach(el => {

                // Only check for Activation elements to snap
                if (el.kind !== elementTypesNames.sequenceActivation) return;

                // Find the nearest lifeline to the element's center position
                const nearestLifelineId = findNearestLifeline(
                el.x + el.width / 2, // X-center of the element
                el.y + el.height / 2 // Y-center of the element
            );

        // If a nearby lifeline is found, snap the element to it
        if (nearestLifelineId) {
            snapElementToLifeline(el, nearestLifelineId);
        }
    });
}

                
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
    updatepos();
    drawRulerBars(scrollx, scrolly);

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;

    disableIfDataEmpty();
}

/**
 * @description Event function triggered when any mouse button is released on top of the toolbar.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates
 */
function tup() {
    mouseButtonDown = false;
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
    if (optionsToggled && !userLock) {
        optionsToggled = false;
        hideOptionsPane();
    }
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
 * @description Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.
 * @returns {boolean} Returns true if the delete button is pressed and canPressDeleteBtn is true, otherwise returns false.
 */
function checkDeleteBtn() {
    if (lastMousePos.x > deleteBtnX && lastMousePos.x < (deleteBtnX + deleteBtnSize) &&
        lastMousePos.y > deleteBtnY && lastMousePos.y < (deleteBtnY + deleteBtnSize)
    ) {
        if (canPressDeleteBtn) {
            // Checks number of selected elements/objects and removes them
            if (context.length > 0) {
                removeElements(context);
            }
            // Checks number of selected lines and removes them
            if (contextLine.length > 0) {
                removeLines(contextLine);
            }
            updateSelection(null);
            canPressDeleteBtn = false;
            return true;
        }
    }
    return false;
}

/**
 *  @description change cursor style if mouse position is over a selection box or the deletebutton.
 *  @param {number} mouseX - The x-coordinate of the mouse position.
 *  @param {number} mouseY - The y-coordinate of the mouse position.
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
