/**
 * @description Constructs state changes with appropriate values set for each situation.
 * This factory will also map passed argument into correct properties in the valuesPassed object.
 */
class StateChangeFactory {
    /**
     * @param {Object} element The new element that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementCreated(element) {
        var values = {kind: element.kind};

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(element).filter(key => {
            if (key === 'x' || key === 'y') return true;
            return (Object.keys(defaults[element.kind]).filter(value => {
                return defaults[element.kind][value] === element[key];
            }).length === 0);
        });

        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = element[key];
        });
        return new StateChange(element.id, values);
    }

    /**
     * @param {Array<Object>} elements The elements that has been/are going to be deleted.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsDeleted(elements) {
        var ids = [];

        // For every object in the array, get id and add it to the array ids
        elements.forEach(element => {
            ids.push(element.id);
        });

        return new StateChange(ids);
    }

    /**
     * @param {Array<String>} elementIDs List of IDs for all elements that were moved.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @returns {Array<StateChange>} A new instance of the StateChange class.
     */
    static ElementsMoved(elementIDs, moveX, moveY) {
        var changesArr = [];
        var timeStamp = new Date().getTime();

        if (moveX == 0 && moveY == 0) return;

        elementIDs.forEach(id => {
            var values = {};
            var obj = data[findIndex(data, id)];

            if (obj === undefined) return;
            if (moveX != 0) values.x = obj.x;
            if (moveY != 0) values.y = obj.y;
            changesArr.push(new StateChange(obj.id, values, timeStamp))
        });

        return changesArr;
    }

    /**
     * @param {Array<String>} elementIDs List of IDs for all elements that were resized.
     * @param {Number} changeX Amount of coordinates along the x-axis the elements have resized.
     * @param {Number} changeY Amount of coordinates along the y-axis the elements have resized.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementResized(elementIDs, changeX, changeY) {
        var values = {
            width: changeX,
            height: changeY
        };

        return new StateChange(elementIDs, values);
    }

    /**
     * @param {List<String>} elementIDs List of IDs for all elements that were moved and resized.
     * @param {Number} moveX Amount of coordinates along the x-axis the elements have moved.
     * @param {Number} moveY Amount of coordinates along the y-axis the elements have moved.
     * @param {Number} changeX Amount of coordinates along the x-axis the elements have resized.
     * @param {Number} changeY Amount of coordinates along the y-axis the elements have resized.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementMovedAndResized(elementIDs, moveX, moveY, changeX, changeY) {
        var values = {
            x: moveX,
            y: moveY,
            width: changeX,
            height: changeY
        };
        return new StateChange(elementIDs, values);
    }

    /**
     * @param {Array<String>} elementID ID for element that has been changed.
     * @param {Object} changeList Object containing changed attributes for the element. Each property represents each attribute changed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementAttributesChanged(elementID, changeList) {
        var values = {};
        // For every attribut in changeList, add it to values
        Object.keys(changeList).forEach(key => {
            values[key] = changeList[key];
        });
        return new StateChange(elementID, values);
    }

    /**
     * @param {Object} line New line that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LineAdded(line) {
        var values = {};

        // Get the keys of the values that is unique from default
        var uniqueKeysArr = Object.keys(line).filter(key => {
            return (Object.keys(defaultLine).filter(value => {
                return defaultLine[value] == line[key];
            }).length == 0);
        });

        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = line[key];
        });

        return new StateChange(line.id, values);
    }

    /**
     * @param {Array<object>} lines List of all lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LinesRemoved(lines) {
        var lineIDs = [];

        // For every object in the lines array, add them to lineIDs
        for (let index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }

        return new StateChange(lineIDs);
    }

    /**
     * @param {Array<object>} elements All elements that have been / are going to be removed.
     * @param {Array<object>} lines All lines that have been / are going to be removed.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static ElementsAndLinesDeleted(elements, lines) {
        var allIDs = [];

        // Add all element IDs to the id-list
        elements.forEach(element => {
            allIDs.push(element.id)
        });

        // Add all line IDs to the id-list
        lines.forEach(line => {
            allIDs.push(line.id)
        });

        return new StateChange(allIDs);
    }

    /**
     * @param {Array<object>} elements All elements that have been created.
     * @param {Array<object>} lines All lines that have been created.
     * @returns {Array<StateChange>} A new instance of the StateChange class.
     */
    static ElementsAndLinesCreated(elements, lines) {
        var changesArr = [];
        var timeStamp = new Date().getTime();

        // Filter out defaults from each element and add them to allObj
        elements.forEach(elem => {
            var values = {kind: elem.kind};

            var uniqueKeysArr = Object.keys(elem).filter(key => {
                if (key === 'x' || key === 'y') return true;
                return (Object.keys(defaults[elem.kind]).filter(value => {
                    return defaults[elem.kind][value] == elem[key];
                }).length == 0);
            });

            uniqueKeysArr.forEach(key => values[key] = elem[key]);
            changesArr.push(new StateChange(elem.id, values, timeStamp));
        });

        // Filter out defaults from each line and add them to allObj
        lines.forEach(line => {
            var values = {};

            var uniqueKeysArr = Object.keys(line).filter(key => {
                return (Object.keys(defaultLine).filter(value => {
                    return defaultLine[value] == line[key];
                }).length == 0);
            });

            uniqueKeysArr.forEach(key => values[key] = line[key]);
            changesArr.push(new StateChange(line.id, values, timeStamp));
        });

        return changesArr;
    }
}
