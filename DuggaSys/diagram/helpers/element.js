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
 * @description Sets ghostElement and ghostLine to null.
 */
function clearGhosts() {
    ghostElement = null;
    ghostLine = null;
}

/**
 * @description Change the coordinates of data-elements
 * @param {Array<Object>} elements Array of elements that will be moved
 * @param {Number} x Coordinates along the x-axis to move
 * @param {Number} y Coordinates along the y-axis to move
 */
function setPos(elements, x, y) {
    var idList = [];
    var overlappingObject = null;

    // Check for overlaps
    elements.forEach(elem => {
        if (entityIsOverlapping(elem.id, elem.x - deltaX / zoomfact, elem.y - deltaY / zoomfact)) {
            overlappingObject = elem;
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
        elements.forEach(obj => {
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
