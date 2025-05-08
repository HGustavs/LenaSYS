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

