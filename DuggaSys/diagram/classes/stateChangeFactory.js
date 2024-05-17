/**
 * @class
 * @classdesc Constructs state changes with appropriate values set for each situation.
 * This factory will also map passed argument into correct properties in the valuesPassed object.
 */
class StateChangeFactory {
    /**
     * @description Keeps the appropriate values for when elements are created.
     * @param {Element} element The new element that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementCreated(element) {
        const values = {kind: element.kind};

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(element).filter(key => {
            if (key === 'x' || key === 'y') return true;
            return (Object.keys(defaults[element.kind])
                .filter(value => defaults[element.kind][value] === element[key]).length === 0);
        });

        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = element[key];
        });
        return new StateChange(element.id, values, null);
    }

    /**
     * @description Keeps the appropriate values for when elements are deleted.
     * @param {Element[]} elements The elements that has been/are going to be deleted.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsDeleted(elements) {
        return new StateChange(elements.map(e => e.id), null, null);
    }

    /**
     * @description Keeps the appropriate values for when elements are moved.
     * @param {string[]} elementIDs List of IDs for all elements that were moved.
     * @param {number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @returns {StateChange[]} A new instance of the StateChange class.
     */
    static ElementsMoved(elementIDs, moveX, moveY) {
        const changesArr = [];
        const timeStamp = new Date().getTime();

        if (moveX == 0 && moveY == 0) return;

        // loops since multiple elements can be moved at once
        elementIDs.forEach(id => {
            const values = {};
            var obj = data[findIndex(data, id)];

            if (!obj) return;
            if (moveX) values.x = obj.x;
            if (moveY) values.y = obj.y;
            changesArr.push(new StateChange(obj.id, values, timeStamp))
        });

        return changesArr;
    }

    /**
     * @description Keeps the appropriate values for when elements are resized.
     * @param {string[]} elementIDs List of IDs for all elements that were resized (and moved).
     * @param {number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @param {number} changeW How much the width has changed by.
     * @param {number} changeH How much the height has changed by.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementResized(elementIDs, moveX, moveY, changeW, changeH) {
        const values = {
            x: moveX,
            y: moveY,
            width: changeW,
            height: changeH
        };
        return new StateChange(elementIDs, values);
    }

    /**
     * @description Keeps the appropriate values for when an elements attributes have changed.
     * @param {string[]} elementID ID for element that has been changed.
     * @param {Object} changeList Object containing changed attributes for the element. Each property represents each attribute changed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementAttributesChanged(elementID, changeList) {
        return new StateChange(elementID, changeList, null);
    }

    /**
     * @description Keeps the appropriate values for when a line is added.
     * @param {Object} line New line that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LineAdded(line) {
        const values = {};
        // Get the keys of the values that is unique from default
        const uniqueKeysArr = Object.keys(line).filter(key => {
            return (Object.keys(defaultLine).filter(value => defaultLine[value] == line[key]).length == 0);
        });
        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = line[key];
        });
        return new StateChange(line.id, values, null);
    }

    /**
     * @description Keeps the appropriate values for when a line is deleted.
     * @param {Object[]} lines List of all lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LinesDeleted(lines) {
        const lineIDs = [];
        // For every object in the lines array, add them to lineIDs
        for (let index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }
        return new StateChange(lineIDs, null, null);
    }

    /**
     * @description Keeps the appropriate values for when elements and lines are deleted
     * @param {Element[]} elements All elements that have been / are going to be removed.
     * @param {Object[]} lines All lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesDeleted(elements, lines) {
        const allIDs = [];
        // Add all element IDs to the id-list
        elements.forEach(element => {
            allIDs.push(element.id)
        });
        // Add all line IDs to the id-list
        lines.forEach(line => {
            allIDs.push(line.id)
        });
        return new StateChange(allIDs, null, null);
    }

    /**
     * @description Keeps the appropriate values for when elements and lines are created
     * @param {Element[]} elements All elements that have been created.
     * @param {Object[]} lines All lines that have been created.
     * @returns {StateChange[]} A new instance of the StateChange class.
     */
    static ElementsAndLinesCreated(elements, lines) {
        const changesArr = [];
        const timeStamp = new Date().getTime();

        // Filter out defaults from each element and add them to allObj
        elements.forEach(elem => {
            const values = {kind: elem.kind};

            const uniqueKeysArr = Object.keys(elem).filter(key => {
                if (key === 'x' || key === 'y') return true;
                return (Object.keys(defaults[elem.kind]).filter(value => {
                    return defaults[elem.kind][value] == elem[key];
                }).length == 0);
            });

            uniqueKeysArr.forEach(key => {
                values[key] = elem[key];
            });
            changesArr.push(new StateChange(elem.id, values, timeStamp));
        });

        // Filter out defaults from each line and add them to allObj
        lines.forEach(line => {
            const values = {};

            const uniqueKeysArr = Object.keys(line).filter(key => {
                return (Object.keys(defaultLine).filter(value => {
                    return defaultLine[value] == line[key];
                }).length == 0);
            });
            uniqueKeysArr.forEach(key => {
                values[key] = line[key];
            });
            changesArr.push(new StateChange(line.id, values, timeStamp));
        });
        return changesArr;
    }
}