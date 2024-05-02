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
        if (selectionRect.overlap(Rect.FromElement(element))) {
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
function getLinesInsideCoordinateBox(rect) {
    var allLines = document.getElementById("svgbacklayer").children;
    var tempLines = [];
    var bLayerLineIDs = [];
    for (let i = 0; i < allLines.length; i++) {
        if (lineIsInsideRect(rect, allLines[i])) {
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
 * @param {Rect} rect returned from the getRectFromPoints() function
 * @param {Object} line following the format of the lines contained within the children of svgbacklayer
 * @returns {Boolean} Returns true if the line is within the coordinate box, else false
 */
function lineIsInsideRect(rect, line) {
    let l1 = screenToDiagramCoordinates(
        line.getAttribute("x1"),
        line.getAttribute("y1")
    );
    let l2 = screenToDiagramCoordinates(
        line.getAttribute("x2"),
        line.getAttribute("y2")
    );
    let midPoint = new Point((l1.x + l2.x) / 2, (l1.y + l2.y) / 2);
    return rect.x <= midPoint.x && rect.y <= midPoint.y &&
            rect.x2 >= midPoint.x && rect.y2 >= midPoint.y;
}

function boxSelect_Update(mouseX, mouseY) {
    if (boxSelectionInUse) {
        // Update relative position form the starting position
        deltaX = mouseX - startX;
        deltaY = mouseY - startY;

        calculateDeltaExceeded();

        // Select all objects inside the box
        let rect = Rect.FromPoints(
            screenToDiagramCoordinates(startX, startY),
            screenToDiagramCoordinates(startX + deltaX, startY + deltaY),
        );
        let topLeft = new Point(0, 0);
        let botRight = new Point(0, 0);
        topLeft.x = (rect.x < rect.x2) ? rect.x : rect.x2;
        botRight.x = (rect.x < rect.x2) ? rect.x2 : rect.x;
        topLeft.y = (rect.y < rect.y2) ? rect.y : rect.y2;
        botRight.y = (rect.y < rect.y2) ? rect.y2 : rect.y;

        let box = Rect.FromPoints(topLeft, botRight);
        let markedEntities = getElementsInsideCoordinateBox(box);
        let markedLines = getLinesInsideCoordinateBox(box);

        if (ctrlPressed) {
            // Remove entity from markedEntities if it was already marked.
            markedEntities = markedEntities.filter(entity => !previousContext.includes(entity));
            markedLines = markedLines.filter(line => !previousContextLine.includes(line));
            clearContext();
            context = context.concat(markedEntities).concat(previousContext);
            clearContextLine();
            contextLine = contextLine.concat(markedLines).concat(previousContextLine);
        } else if (altPressed) {
            // Remove entity from previous context if the element is marked
            previousContext = previousContext.filter(entity => !markedEntities.includes(entity));
            previousContextLine = previousContextLine.filter(line => !markedLines.includes(line));
            context = previousContext;
            clearContextLine();
            contextLine = previousContextLine;
        } else {
            context = markedEntities;
            contextLine = markedLines;
        }
    }
}
