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
    const parts = filename.split('.');
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
    });

    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) continue;
        if (context.includes(data[i])) break;

        // No element can be placed over another of the same kind
        if (data[i].kind !== element.kind) {
            // Sequence life-lines can be placed on activations
            if ((data[i].kind === "SEQUENCE_ACTOR" || data[i].kind === "SEQUENCE_OBJECTect") && element.kind === "SEQUENCE_ACTIVATION") continue;

            // All sequence elements can be placed over loops, alternatives and activations and vice versa
            else if (data[i].type === "SE" && (element.kind === "SEQUENCE_LOOP_OR_ALT" || element.kind === "SEQUENCE_ACTIVATION")) continue;
            else if (element.type === "SE" && (data[i].kind === "SEQUENCE_LOOP_OR_ALT" || data[i].kind === "SEQUENCE_ACTIVATION")) continue;

            // Superstates can be placed on state-diagram elements and vice versa
            else if (!backgroundElement.includes(element.kind) &&
                (data[i].kind === ELEMENT_TYPES_NAMESNames.UML_SUPER_STATE ||
                data[i].kind === ELEMENT_TYPES_NAMESNames.SEQUENCE_LOOP_OR_ALT)
            ) continue;
            else if (!backgroundElement.includes(data[i].kind) &&
                (element.kind === ELEMENT_TYPES_NAMESNames.UML_SUPER_STATE ||
                element.kind === ELEMENT_TYPES_NAMESNames.SEQUENCE_LOOP_OR_ALT)
            ) continue;
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
    const properties = Object.getOwnPropertyNames(changes);
    // For every value in change
    properties.forEach(key => {

        /**
         * If the key is not blacklisted, set to the new value
         */
        if (key != "id") target[key] = changes[key]; // Ignore this keys.
    });
    return target;
}

/**
 * @description checks the current CSS file the item diagramTheme currently holds in localStorage to determine if the current theme is darkmode or not.
 * @return a boolean value depending on if it is darktheme or not.
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
 * Generates a new hexadecimal ID that is not already stored to identify things.
 * @returns {String} Hexadecimal number represented as a string.
 * @see randomidArray For an array of all generated IDs by this function.
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
 * @description compare if 2 objects contain the same values. Allows for certain keys to be ignored
 * @param {object} obj1 first object
 * @param {object} obj2 second object
 * @param {string[]} ignore array of keys to ingore
 * @returns {boolean}
 */
function sameObjects(obj1, obj2, ignore = []) {    
    // remove the values in the "ignore" array
    for (let item of ignore) {
        if (obj1[item]) delete obj1[item];
        if (obj2[item]) delete obj2[item];
    }    

    // JSON.stringify() is needed to compare the values
    return JSON.stringify(obj1) == JSON.stringify(obj2);
}