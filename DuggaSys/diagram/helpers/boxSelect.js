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

function boxSelect_End() {
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = false;
}

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
