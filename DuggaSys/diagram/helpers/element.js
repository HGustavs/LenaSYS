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
 * @description Generates a a new ghost element that is used for visual feedback to the end user when creating new elements and/or lines. Setting ghostElement to null will remove the ghost element.
 * @see ghostElement
 */
function makeGhost() {
    ghostElement = Element.Default(elementTypeSelected);
    setGhostPosition(lastMousePos.x, lastMousePos.y);
    showdata();
}

function setGhostPosition(x, y) {
    const lastMousePosition = screenToDiagramCoordinates(x, y);
    if (settings.grid.snapToGrid && mouseMode != mouseModes.EDGE_CREATION) {
        ghostElement.x = Math.round(lastMousePosition.x / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.width / 2);
        ghostElement.y = Math.round(lastMousePosition.y / settings.grid.gridSize) * settings.grid.gridSize - (ghostElement.height / 2);
    } else {
        ghostElement.x = lastMousePosition.x - (ghostElement.width / 2);
        ghostElement.y = lastMousePosition.y - (ghostElement.height / 2);
    }
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
    const idList = [];
    let overlappingObject = null;

    // Check for overlaps
    elements.forEach(elem => {
        let newX = elem.x - deltaX / zoomfact;
        let newY = elem.y - deltaY / zoomfact;
        if (settings.grid.snapToGrid && !ctrlPressed) {
            // Calculate nearest snap point
            newX = Math.round((elem.x + elem.width / 2 - x / zoomfact) / (settings.grid.gridSize / 2)) * settings.grid.gridSize / 2;
            newY = Math.round((elem.y + elem.height / 2 - y / zoomfact) / (settings.grid.gridSize / 2)) * settings.grid.gridSize / 2;
            // Set the new snap point to center of element
            newX -= elem.width / 2;
            newY -= elem.height / 2;
        }
        if (entityIsOverlapping(elem.id, newX, newY)) {
            overlappingObject = elem;
        }
    });

    if (overlappingObject) {
        // If overlap is detected, move the overlapping object back by one step
        const previousX = overlappingObject.x;
        const previousY = overlappingObject.y;

        // Move the object back one step
        overlappingObject.x -= x / zoomfact;
        overlappingObject.y -= y / zoomfact;

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
            if (obj.isLocked) {
                return;
            }

            if (settings.grid.snapToGrid && !ctrlPressed) {
                const entityKinds = [
                    elementTypesNames.EREntity,
                    elementTypesNames.UMLEntity,
                    elementTypesNames.IEEntity,
                    elementTypesNames.SDEntity
                ];
                if (entityKinds.includes(obj.kind)) {
                    const candidateX = obj.x - (x / zoomfact);
                    obj.x = Math.round(candidateX / (settings.grid.gridSize/2)) * (settings.grid.gridSize/2);
                } else {
                    obj.x = Math.round((obj.x + obj.width / 2 - x / zoomfact) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2) - obj.width / 2;
                }
                obj.y = Math.round((obj.y + obj.height / 2 - y / zoomfact) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2) - obj.height / 2;
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

        if (idList.length) {
            stateMachine.save(idList, StateChange.ChangeTypes.ELEMENT_MOVED);
        }
    }

    // Update positions
    updatepos();
}
