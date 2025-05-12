/**
 * @description Calculates if any line is present on x/y position in pixels on mouse click.
 * @param {Number} mouseX
 * @param {Number} mouseY
 */
function determineLineSelect(mouseX, mouseY) {
    let currentLineSegment;
    const allLines = getLinesFromBackLayer();
    const bLayerLineIDs = [];

    // Current mouse XY
    const cMouse_XY = {
        x: mouseX,
        y: mouseY
    };
    let currentline = {};
    let lineData = {};
    let lineCoeffs = {};
    let highestX, lowestX, highestY, lowestY;
    let lineWasHit = false;
    let labelWasHit = false;

    // Position and radius of the circle hitbox that is used when
    const circleHitBox = {
        pos_x: cMouse_XY.x, // Mouse pos X.
        pos_y: cMouse_XY.y, // Mouse pos Y.
        radius: 10 // This will determine the error margin, "how far away from the line we can click and still select it". Higer val = higher margin.
    };

    for (let i = 0; i < allLines.length; i++) {
        // Copy the IDs.
        bLayerLineIDs[i] = allLines[i].id;

        // Make sure that "double lines" have the same id.
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-1/gi, '');
        bLayerLineIDs[i] = bLayerLineIDs[i].replace(/-2/gi, '');

        const hasPoints = allLines[i].getAttribute('points'); // If line has attribute point (polyline)

        if (hasPoints) {
            const points = hasPoints.split(' '); // Split points attribute in pairs
            // Get the points in polyline
            for (let j = 0; j < points.length - 1; j++) {
                currentLineSegment = {
                    x1: Number(points[j].split(',')[0]),
                    x2: Number(points[j + 1].split(',')[0]),
                    y1: Number(points[j].split(',')[1]),
                    y2: Number(points[j + 1].split(',')[1])
                };
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
                };
                lineCoeffs = {
                    a: (currentLineSegment.y1 - currentLineSegment.y2),
                    b: (currentLineSegment.x2 - currentLineSegment.x1),
                    c: ((currentLineSegment.x1 - currentLineSegment.x2) * currentLineSegment.y1 + (currentLineSegment.y2 - currentLineSegment.y1) * currentLineSegment.x1)
                };
                lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);

                if (lineWasHit && !labelWasHit) {
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
        };
        // Coefficients of the general equation of the current line.
        lineCoeffs = {
            a: (currentline.y1 - currentline.y2),
            b: (currentline.x2 - currentline.x1),
            c: ((currentline.x1 - currentline.x2) * currentline.y1 + (currentline.y2 - currentline.y1) * currentline.x1)
        };
        if (document.getElementById(bLayerLineIDs[i] + "Label")) {
            const centerPoint = {
                x: lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].centerX + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].labelMovedX + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].displacementX,
                y: lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].centerY + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].labelMovedY + lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].displacementY
            };
            const labelWidth = lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].width;
            const labelHeight = lineLabelList[findIndex(lineLabelList, bLayerLineIDs[i] + "Label")].height;
            labelWasHit = didClickLabel(centerPoint, labelWidth, labelHeight, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius);
        }

        // Determines if a line was clicked
        lineWasHit = didClickLine(lineCoeffs.a, lineCoeffs.b, lineCoeffs.c, circleHitBox.pos_x, circleHitBox.pos_y, circleHitBox.radius, lineData);
        // --- Used when debugging ---
        // Creates a circle with the same position and radius as the hitbox of the circle being sampled with.
        // document.getElementById("svgoverlay").innerHTML += '<circle cx="'+ circleHitBox.pos_x + '" cy="'+ circleHitBox.pos_y+ '" r="' + circleHitBox.radius + '" stroke='${color.BLACK}' stroke-width="3" fill="red" /> '
        // ---------------------------
        if (lineWasHit && !labelWasHit) {
            // Return the current line that registered as a "hit".
            return lines.filter(function (line) {
                return line.id == bLayerLineIDs[i];
            })[0];
        } else if (labelWasHit) {
            return lineLabelList.filter(function (label) {
                return label.id == bLayerLineIDs[i] + "Label";
            })[0];
        }
    }
    return null;
}

/**
 * @description Retrieves lines from svgbacklayer. If no lines are found then an empty array is returned.
 * @returns {Array} Array of lines (objects) from the back layer of the SVG canvas
 */
function getLinesFromBackLayer() {
    return Array.from(document.getElementById("svgbacklayer").children);
}

/**
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if any line was clicked.
 * @param {number} a - The coefficient of x in the line equation.
 * @param {number} b - The coefficient of y in the line equation.
 * @param {number} c - The constant term in the line equation.
 * @param {number} circle_x - The x-coordinate of the circle center.
 * @param {number} circle_y - The y-coordinate of the circle center.
 * @param {number} circle_radius - The radius of the circle.
 * @param {object} line_data - Additional data about the line.
 *      @param {number} line_data.hX - The x-coordinate of the higher end of the line.
 *      @param {number} line_data.lX - The x-coordinate of the lower end of the line.
 *      @param {number} line_data.hY - The y-coordinate of the higher end of the line.
 *      @param {number} line_data.lY - The y-coordinate of the lower end of the line.
 * @returns {boolean} - True if the line intersects with the circle, false otherwise.
 */
function didClickLine(a, b, c, circle_x, circle_y, circle_radius, line_data) {
    // Distance between line and circle center.
    const distance = (Math.abs(a * circle_x + b * circle_y + c)) / Math.sqrt(a * a + b * b);
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
 * @param {Object} c - The coordinates of the label.
 * @param {number} lw - The width of the label.
 * @param {number} lh - The height of the label.
 * @param {number} circle_x - The x-coordinate of the circle.
 * @param {number} circle_y - The y-coordinate of the circle.
 * @param {number} circle_radius - The radius of the circle.
 * @returns {boolean} - True if the label was clicked within the margin of error, false otherwise.
 */
function didClickLabel(c, lw, lh, circle_x, circle_y, circle_radius) {
    // Adding and subtracting with the circle radius to allow for bigger margin of error when clicking.
    // Check if we are clicking withing the span.
    return circle_x < c.x + lw / 2 + circle_radius &&
        circle_x > c.x - lw / 2 - circle_radius &&
        circle_y < c.y + lh / 2 + circle_radius &&
        circle_y > c.y - lh / 2 - circle_radius;
}

/**
 * @description Triggers when the mouse hovers over an sequence lifeline.
 * @param {Event} event - The mouse enter event object.
 */
function mouseEnterSeq(event) {
    if (elementTypeSelected === elementTypes.sequenceActivation) {
        const target = event.target;
        const targetId = target.id;
        snapSAToLifeline(targetId);
    }
}

/**
 * @description Snaps the sequenceActivation to a lifeline (currently only works for ghosts)
/**
 * Snaps a given element to the center of a lifeline and adjusts its Y-position if necessary.
 * Checks if the lifeline has ended, or not started, and if that is the case the sequenceActivation does not snap to the Y-position of the lifeline
 * @param {Object} element - The element to snap (a placed object).
 * @param {string} targetId - The ID of the lifeline to snap to.
 */
function snapElementToLifeline(element, targetId) {
    const lifeline = document.getElementById(targetId);
    if (!lifeline) return; // Exit if the DOM element doesn't exist

    // Search for the lifeline data in the main data array
    for (let i = 0; i < data.length; i++) {
        const ll = data[i];
        if ((ll.kind === "sequenceActor" || ll.kind === "sequenceObject") && ll.id === targetId) {
            // Snap the element horizontally to the center of the lifeline
            element.x = ll.x + (ll.width / 2) - (element.width / 2);
            updatepos(); // Refresh position on screen
            break;
        }
    }

    if (!ll) return;

    // Element won't snap to the lifeline if it is outside the lifeline's range
    const topY = ll.y + getTopHeight(ll);
    const botY = ll.y + ll.height;
    if (element.y < topY || element.y > botY) return;

    // Snap the element horizontally to the center of the lifeline
    element.x = ll.x + (ll.width / 2) - (element.width / 2);
    updatepos(); // Refresh position on screen
}

// For mmoving sequenceActivation element to get a visually indicated snap to lifeline
// threshold value is changeable within the parameter
function visualSnapToLifeline(pos, threshold = 50) {

    // Check that there exists a sequenceActor or sequenceObject to snap to
    for (const ll of data) {
        if (ll.kind !== elementTypesNames.sequenceActor &&
            ll.kind !== elementTypesNames.sequenceObject) continue;

        // Get coordinates for sequenceActor/sequenceObject and compare to position of moving object
        const topY = ll.y + getTopHeight(ll);
        const botY = ll.y + ll.height;
        const centerX = ll.x + ll.width / 2;
        const dx = Math.abs(centerX - pos.x);

        // Check if within snap threshold and boundaries of the lifeline
        if (dx < threshold && pos.y >= topY && pos.y <= botY) {
            return ll.id;
        }
    }
    return null;
}
  

/**
 * Snaps the ghostElement (hover preview) to the center of a lifeline and adjusts its Y-position.
 * @param {string} targetId - The ID of the lifeline to snap to.
 */
function snapSAToLifeline(targetId) {
    const lifeline = document.getElementById(targetId);
    if (!lifeline) return; // Exit if no such DOM element

    const lifelineData = data.find(el => el.id === targetId);
    if (!lifelineData) return; // Exit if no such object in data array

    // Snap ghost X to the center of the lifeline
    const centerX = lifelineData.x + lifelineData.width / 2;
    ghostElement.x = centerX - ghostElement.width / 2;

    // Adjust ghost Y if it's above the allowed minimum
     const extra = lifelineData.kind === "sequenceActor" ? 70 : 0;
     const minY  = lifelineData.y + getTopHeight(lifelineData) + extra;
    if (ghostElement.y < minY) {
        ghostElement.y = minY;
    }

    updatepos(); // Update preview position
}

/**
 * Creates a new element and places it at the specified position.
 * If it's close to a lifeline, it will snap to it.
 * @param {number} x - X coordinate to place the element.
 * @param {number} y - Y coordinate to place the element.
 */
function placeElementAt(x, y) {
    const newElement = Element.Default(elementTypeSelected);
    newElement.x = x;
    newElement.y = y;

    // Check if it's near a lifeline and snap to it
    const lifelineId = findNearestLifeline(x, y);
    if (lifelineId) {
        snapElementToLifeline(newElement, lifelineId);
    }

    data.push(newElement); // Add the new element to the diagram
    draw(); // Redraw the canvas or SVG
}

/**
 * Finds the nearest lifeline (within a horizontal threshold) to a given position.
 * @param {number} x - X position to compare with lifelines.
 * @param {number} y - Y position (unused but could be used later).
 * @returns {string|null} - The ID of the closest lifeline, or null if none are within threshold.
 */
function findNearestLifeline(x, y) {
    let minDistance = Infinity;
    let closestId = null;

    data.forEach(el => {
        if (el.kind === "sequenceActor" || el.kind === "sequenceObject") {
            const centerX = el.x + el.width / 2;
            const topY = el.y + getTopHeight(el);
            const botY = el.y + el.height;
            const dx = Math.abs(centerX - x);

            // Only snaps to the lifeline if within the lifeline's range
            if (dx < 50 && dx < minDistance && y >= topY && y <= botY) { 
                minDistance = dx;
                closestId = el.id;
            }
        }
    });

    return closestId;
}




/**
 * @description Gets the height of the top object of sequence actor and sequence object
 * @param {Object} element - The element for which to calculate the top height.
 * @returns {number} The calculated top height of the element.
 */
function getTopHeight(element) {
    const boxw = Math.round(element.width * zoomfact);

    if (element.kind === "sequenceActor") {
        return (boxw * 0.50) / zoomfact;      // 55 %
    }

    // 52 %
    return (boxw * 0.52) / zoomfact;
}

