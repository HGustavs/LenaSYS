//#region ================================ HELPER FUNCTIONS ====================================

/**
 * @description Creates a new rectangle from upper left point and lower right point.
 * @param {Point} topLeft
 * @param {Point} bottomRight
 * @returns {Object} Returns an object representing a rectangle with position and size.
 */
function getRectFromPoints(topLeft, bottomRight) {
    return {
        x: topLeft.x,
        y: topLeft.y,
        width: bottomRight.x - topLeft.x,
        height: bottomRight.y - topLeft.y,
    };
}

/**
 * @description Checks if the second rectangle is within the first rectangle.
 * @param {*} left First rectangle
 * @param {*} right Second rectangle
 * @returns {Boolean} true if the right rectangle is within the left rectangle.
 */
function rectsIntersect(left, right) {
    return (
        ((left.x + left.width) >= ((right.x) + (right.width * 0.75))) &&
        ((left.y + left.height) > (right.y + right.height * 0.75)) &&
        (left.x < right.x + 0.25 * right.width) && (left.y < right.y + 0.25 * right.height)
    );
}

function isKeybindValid(e, keybind) {
    return e.key.toLowerCase() == keybind.key.toLowerCase() && (e.ctrlKey == keybind.ctrl || keybind.ctrl == ctrlPressed);
}

/**
 * @description Converst a position in screen pixels into coordinates of the array.
 * @param {Number} mouseX Pixel position in the x-axis.
 * @param {Number} mouseY Pixel position in the y-axis.
 * @returns {Point} Point containing the calculated coordinates.
 */
function screenToDiagramCoordinates(mouseX, mouseY) {
    // I guess this should be something that could be calculated with an expression but after 2 days we still cannot figure it out.
    let zoom = cursorOffset.get(zoomfact) ?? 0;

    return new Point(
        Math.round(mouseX / zoomfact - scrollx + zoom * scrollx + 2 + zoomOrigo.x), // the 2 makes mouse hover over container
        Math.round(mouseY / zoomfact - scrolly + zoom * scrolly + zoomOrigo.y)
    );
}

/**
 * @description Test weither an enum object contains a certain property value.
 * @param {*} value The value that the enumObject is tested for.
 * @param {Object} enumObject The enum object containing all possible values.
 * @returns {Boolean} Returns TRUE if an enum contains the tested value
 */
function enumContainsPropertyValue(value, enumObject) {
    for (const property in enumObject) {
        // If any cursor mode matches the passed argument
        const cm = enumObject[property];
        if (cm == value) {
            return true;
        }
    }
    return false;
}

/**
 * @description Creates a new rectangle from an element.
 * @param {Object} element Element with a x,y,width and height propery.
 * @returns
 */
function getRectFromElement(element) {
    // Corrects returned y position due to problems with resizing vertically
    for (let i = 0; i < preResizeHeight.length; i++) {
        if (element.id == preResizeHeight[i].id) {
            let resizedY = element.y;
            if (preResizeHeight[i].height < element.height) {
                resizedY += (element.height - preResizeHeight[i].height) / 2
            }
            // Corrects returned y position due to problems with SE types

            let elementY = resizedY;
            if (element.type == entityType.SE) {
                elementY += preResizeHeight[i].height / 3;
            }

            return {
                x: element.x,
                y: elementY,
                width: element.width,
                height: element.height
            };
        }
    }

    // Corrects returned y position due to problems with resizing vertically
    let elementY = element.y;
    if (element.type == entityType.SE) {
        elementY += element.height / 3;
    }
    return {
        x: element.x,
        y: elementY,
        width: element.width,
        height: element.height,
    };
}

/**
 * Searches an array for the specified item and returns its stored index in the array if found.
 * @param {Array} arr Array to search.
 * @param {*} id Item to determine index for.
 * @returns {Number} Index for the searched item OR -1 for a miss.
 */
function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}
function isLineConnectedTo(line, kind) {
    let result = null;
    switch (kind) {
        case data[findIndex(data, line.fromID)].kind:
            result = -1;
            break;
        case data[findIndex(data, line.toID)].kind:
            result = 1;
            break;
    }
    return result;
}

/**
 * @description Gets the extension of an filename
 * @param {String} filename The name of the file
 * @return The extension
 */
function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function entityIsOverlapping(id, x, y) {
    let isOverlapping = false;
    const foundIndex = findIndex(data, id);

    if (foundIndex < 0) return isOverlapping;

    const element = data[foundIndex];
    let eHeight = element.height;
    let arr = [UMLHeight, IEHeight, SDHeight, NOTEHeight];

    arr.forEach(entityHeights => {
        entityHeights.forEach(entity => {
            if (element.id == entity.id) eHeight = entity.height
        });
    })

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) continue;
        if (context.includes(data[i])) break;
        if (data[i].kind == elementTypesNames.UMLSuperState || element.kind == elementTypesNames.UMLSuperState ||
            data[i].kind == elementTypesNames.sequenceActor || element.kind == elementTypesNames.sequenceActor ||
            data[i].kind == elementTypesNames.sequenceObject || element.kind == elementTypesNames.sequenceObject ||
            data[i].kind == elementTypesNames.sequenceLoopOrAlt || element.kind == elementTypesNames.sequenceLoopOrAlt
        ) {
            break;
        }

        const x2 = data[i].x + data[i].width;
        let y2 = data[i].y + data[i].height;

        arr.forEach(entityHeights => {
            entityHeights.forEach(entity => {
                if (data[i].id == entity.id) y2 = data[i].y + entity.height;
            });
        });

        if (x < x2 &&
            x + element.width > data[i].x &&
            y < y2 &&
            y + eHeight > data[i].y
        ) {
            isOverlapping = true;
            break;
        }
    }
    return isOverlapping;
}
/**
 * @description Appends all property values onto the valuesPassed object. Logic for each specific property is different, some overwrite and some replaces.
 * @param {StateChange} target StateChange to edit
 * @param {StateChange} changes Another state change that will have its values copied over to this state change. Flags will also be merged.
 */
function appendValuesFrom(target, changes) {
    var propertys = Object.getOwnPropertyNames(changes);
    // For every value in change
    propertys.forEach(key => {

        /**
         * If the key is not blacklisted, set to the new value
         */
        if (key != "id") target[key] = changes[key]; // Ignore this keys.
    });
    return target;
}
//#endregion =====================================================================================
