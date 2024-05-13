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
 * @description Retrieves lines from svgbacklayer. If none is found return empty array
 */
function getLinesFromBackLayer() {
    return Array.from(document.getElementById("svgbacklayer").children);
}

/**
 * @description Performs a circle detection algorithm on a certain point in pixels to decide if any line was clicked.
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
 * @description Triggers when the mouse hoovers over an sequence lifeline.
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
 */
function snapSAToLifeline(targetId) {
    const lifeline = document.getElementById(targetId);
    if (lifeline) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].kind === "sequenceActor" && data[i].id === targetId || data[i].kind === "sequenceObject" && data[i].id === targetId) {
                const element = data[i];
                ghostElement.x = element.x + (element.width / 2) - (ghostElement.width / 2);
                updatepos();
            }
        }
    }
}

function getGroupHeight(targetId , element) {
    //     // SVG string
    //     const parser = new DOMParser();
    // const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    // const svg = svgDoc.documentElement;
    
    // Get the object by its ID
    //const objectById = getElementById(element.id);
    console.log(element.id);
    // Check if the object exists
    if (objectById) {
        // Object found, you can now manipulate it
        console.log("Object found:", objectById);
    } else {
        // Object not found
        console.log("Object not found.");
    }
    
        // Get the <g> element
        const gElement = svg.querySelector('g');
    
        // Get the bounding box of the <g> element
        const bbox = gElement.getBBox();
    
        // Retrieve the height of the <g> element
        const gHeight = bbox.height;
    
        console.log("Height of <g> element:", gHeight);
    }