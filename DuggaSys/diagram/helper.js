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

