/**
 * @description If the current keyboard event matches a keybind. Ctrl, Alt, Shift and Meta sensistive.
 * @param {KeyboardEvent} e
 * @param {{key:string, ctrl:boolean}} keybind
 * @returns {boolean}
 */

function isKeybindValid(e, keybind) {
    const keyMatches = e.key.toLowerCase() === keybind.key.toLowerCase();
    const ctrlMatches = e.ctrlKey === !!keybind.ctrl;
    const altMatches = e.altKey === !!keybind.alt;
    const metaMatches = e.metaKey === !!keybind.meta;
    const shiftMatches = e.shiftKey === !!keybind.shift;

    return keyMatches && ctrlMatches && altMatches && metaMatches && shiftMatches;
}

/**
 * @description Converts position in pixels on the screen into coordinates in the diagram.
 * @param {Number} mouseX Screen position in the x-axis.
 * @param {Number} mouseY Screen position in the y-axis.
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
 * @description Searches an array for the specified item and returns its stored index in the array if found.
 * @param {*[]} arr Array to search.
 * @param {string} id Item to determine index for.
 * @returns {number} Index for the searched item OR -1 for a miss.
 */
function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) return i;
    }
    return -1;
}

/**
 * @description If line is connected to an element of the provided kind.
 * @param {Object} line
 * @param {string} kind
 * @returns {null}
 */
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
 * @description Gets the extension of an filename.
 * @param {string} filename The name of the file
 * @return {string}
 */
function getExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
}

/**
 * @description If the element with the provided id (if moved to X,Y position) is overlapping any other object in the data array.
 * @see data
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function entityIsOverlapping(id, x, y, ignoreIds = []) {
    let isOverlapping = false;
    const foundIndex = findIndex(data, id);

    if (foundIndex < 0) return isOverlapping;

    const element = data[foundIndex];
    let eHeight = element.height;
    let arr = [UMLHeight, IEHeight, SDHeight, NOTEHeight];

    arr.forEach(entityHeights => {
        entityHeights.forEach(entity => {
            if (element.id == entity.id) eHeight = entity.height;
        });
    });

    for (let i = 0; i < data.length; i++) {
        const other = data[i];
        if (other.id === id || ignoreIds.includes(other.id)) continue;

        // No element can be placed over another of the same kind
        if (other.kind !== element.kind) {
            if ((other.kind === "sequenceActor" || other.kind === "sequenceObject") &&
            element.kind === "sequenceActivation") {
        
                const bodyX = other.x;
                const bodyWidth = other.width;
                const bodyY = other.y;
                const bodyHeight = getTopHeight(other);
            
                // Block placeing on the actor/objects body
                if (
                    x + element.width > bodyX &&
                    x < bodyX + bodyWidth &&
                    y + element.height > bodyY &&
                    y < bodyY + bodyHeight
                ) return true;
            
                continue;
            }

            // All sequence elements can be placed over loops, alternatives and activations and vice versa
            else if (other.type === "SE" && (element.kind === "sequenceLoopOrAlt" || element.kind === "sequenceActivation")) continue;
            else if (element.type === "SE" && (other.kind === "sequenceLoopOrAlt" || other.kind === "sequenceActivation")) continue;

            // Superstates can be placed on state-diagram elements and vice versa
            else if (!backgroundElement.includes(element.kind) &&
                (other.kind === elementTypesNames.UMLSuperState ||
                    other.kind === elementTypesNames.sequenceLoopOrAlt)
            ) continue;
            else if (!backgroundElement.includes(other.kind) &&
                (element.kind === elementTypesNames.UMLSuperState ||
                    element.kind === elementTypesNames.sequenceLoopOrAlt)
            ) continue;
        }

        const x2 = other.x + other.width;
        let y2 = other.y + other.y2 - other.y1;

        arr.forEach(entityHeights => {
            entityHeights.forEach(entity => {
                if (other.id == entity.id) y2 = other.y + entity.height;
            });
        });

        if (element.kind === "ERRelation" || element.kind === "UMLRelation") {
            // Use default rectangle collision detection
            if (x < x2 &&
                x + element.width > other.x &&
                y < y2 &&
                y + eHeight > other.y) {
                isOverlapping = true;
                break;
            }
        }


        // Default collision detection where overlapping is derived from height and width of element in a rectangle shape
        // Some elements doesnt have a height so the second parameter gets the height manually
        if ((x < x2 &&
            x + element.width > other.x &&
            y < y2 &&
            y + eHeight > other.y
        )||(
            x < x2 &&
            x + element.width > other.x &&
            y < y2 &&
            y + element.y2 - element.y1 > other.y
        )) {
            isOverlapping = true;
        }

    }
    
    return isOverlapping;
}

/**
 * @description Gets first non array item from nested array.
 * @param {string | any[]} array id or nested array of IDs.
 * @returns {any[]} All the IDs.
 */
function getItemsFromNestedArrays(array) {
    return array.flat(Infinity);
}

/**
 * @description checks the current CSS file the item diagramTheme currently holds in localStorage to determine if the current theme is darkmode or not.
 * @return {boolean}
 */
function isDarkTheme() {
    if (localStorage.getItem('diagramTheme')) {
        //in localStorage, diagramTheme holds a URL to the CSS file currently used. Like, style.css or blackTheme.css
        let cssUrl = localStorage.getItem('diagramTheme');
        //this turns, for example, '.../Shared/css/style.css' into just 'style.css'
        cssUrl = cssUrl.split("/").pop();

        return cssUrl === 'blackTheme.css'
    }
}

/**
 * @description Generates a new hexadecimal ID that is not already stored to identify things.
 * @returns {string} Hexadecimal number represented as a string.
 * @see randomidArray
 */
function makeRandomID() {
    let str = "";
    const characters = 'ABCDEF0123456789';
    const charactersLength = characters.length;
    while (true) {
        for (let i = 0; i < 6; i++) {
            //document.querySelector can't find ID's if they begin with a number
            if (i == 0) str += characters.charAt(Math.floor(Math.random() * (charactersLength - 10)));
            else str += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        if (!settings.misc.randomidArray) { //always add first id
            settings.misc.randomidArray.push(str);
            return str;
        } else {
            //if check is true the id already exists
            if (settings.misc.randomidArray.includes(str)) {
                str = "";
            } else {
                settings.misc.randomidArray.push(str);
                return str;
            }
        }
    }
}

/**
 * @description If mouse has moved more than maxDeltaBeforeExeeded in any direction.
 * @see maxDeltaBeforeExceeded
 */
function calculateDeltaExceeded() {
    // Remember that mouse has moved out of starting bounds
    if ((deltaX >= maxDeltaBeforeExceeded ||
        deltaX <= -maxDeltaBeforeExceeded) ||
        (deltaY >= maxDeltaBeforeExceeded ||
            deltaY <= -maxDeltaBeforeExceeded)
    ) {
        deltaExceeded = true;
    }
}

/**
 * @description Compare if 2 objects contain the same values. Allows for certain keys to be ignored.
 * @param {object} obj1 First object.
 * @param {object} obj2 Second object.
 * @param {string[]} ignore Array of keys to ignore.
 * @returns {boolean}
 */
function sameObjects(obj1, obj2, ignore = []) {
    // Removes the reference to the sent in objects just in case the sending function didn't do it
    obj1 = { ...obj1 };
    obj2 = { ...obj2 };
    // Remove the values in the "ignore" array
    for (let item of ignore) {
        if (obj1[item]) delete obj1[item];
        if (obj2[item]) delete obj2[item];
    }

    // JSON.stringify() is needed to compare the values
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}