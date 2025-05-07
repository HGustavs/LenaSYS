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
    const elements = [];
    data.forEach(element => {
        // Box collision test
        if (selectionRect.partialOverlap(Rect.FromElement(element))) {
            elements.push(element);
        }
    });
    return elements;
}

/**
 * @description Checks whether the lines in the diagram is within the coordinate box
 * @param {Rect} rect returned from the getRectFromPoints() function
 * @returns {Array<Object>} containing all of the lines that are currently within the coordinate box
 */
function getLinesInsideCoordinateBox(rect) {
    const lineIDs = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] && lines[i].kind) {
            if (lines[i].kind === lineKind.DOUBLE) {
                lineIDs.push(line[i].id + "-1");
                lineIDs.push(line[i].id + "-2");
            } else {
                lineIDs.push(lines[i].id);
            }
        }
    }
    let overlapping = lineIDs.filter(l => {
        let other = document.getElementById(l);
        return lineIsInsideRect(rect, other);
    });
    return overlapping.map(id => lines.find(l => l.id == id))
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
    return rect.left <= midPoint.x && rect.top <= midPoint.y &&
        rect.right >= midPoint.x && rect.bottom >= midPoint.y;
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
        let markedEntities = getElementsInsideCoordinateBox(rect);
        let markedLines = getLinesInsideCoordinateBox(rect);

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
