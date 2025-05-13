/**
 * @description Represents a change stored in the StateMachine. StateChange contains a list of StateChange.ChangeTypes in the local property stateChanges, that in turn contains a flag to describe each change. The getFlags() can be used to get the sum of all these stateChanges.
 */
class StateChange {
    /**
     * @description ChangeType containing all information about a certain change. Several instances of ChangeType can exist inside a StateChange.
     * @member flag A number represented in 2nd base. This allows several flags to be merged through bit operators.
     */
    static ChangeTypes = {
        ELEMENT_CREATED: 1,
        ELEMENT_DELETED: 2,
        ELEMENT_MOVED: 4,
        ELEMENT_RESIZED: 8,
        ELEMENT_ATTRIBUTE_CHANGED: 16,
        LINE_ATTRIBUTE_CHANGED: 32,
        LINE_CREATED: 64,
        LINE_DELETED: 128,

        // Combined flags
        ELEMENT_AND_LINE_DELETED: 2 | 128,
        ELEMENT_AND_LINE_CREATED: 1 | 64,
    };

    /**
     * @description Keeps the appropriate values for when elements are created.
     * @param {Element} element The new element that has been created.
     * @returns {object} A new object with the needed values.
     */
    static ElementCreated(id) {
        const element = data.find((e) => e.id == id);
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
        return values;
    }

   /**
     * @description Keeps the appropriate values for when a line is added.
     * @param {Object} id ID of the newly created line.
     * @returns {object} A new object with the needed values.
     */
    static LineAdded(id) {
        const line = lines.find(line => line.id == id);
        const values = {};

        // Get the keys of the values that are unique from the default
        const uniqueKeysArr = Object.keys(line).filter(key => {
            return defaultLine[key] !== line[key];
        });

        // Store those unique values in the result
        uniqueKeysArr.forEach(key => {
            values[key] = line[key];
        });

        // Optionally include offset(s) related to this line
        const fromId = line.from;
        const toId = line.to;
        if (offsetMap.has(fromId)) {
            const fromOffsets = offsetMap.get(fromId);
            for (let [key, val] of fromOffsets.entries()) {
                if (key.includes(`${fromId}->${toId}`)) {
                    if (!values.offsets) values.offsets = {};
                    values.offsets[fromId] = values.offsets[fromId] || {};
                    values.offsets[fromId][key] = val;
                }
            }
        }
        if (offsetMap.has(toId)) {
            const toOffsets = offsetMap.get(toId);
            for (let [key, val] of toOffsets.entries()) {
                if (key.includes(`${toId}<-${fromId}`)) {
                    if (!values.offsets) values.offsets = {};
                    values.offsets[toId] = values.offsets[toId] || {};
                    values.offsets[toId][key] = val;
                }
            }
        }

        return values;
    }

    /**
     * @description Keeps the appropriate values for when elements and lines are created
     * @param {string[]} elements All elements that have been created.
     * @param {string[]} lines All lines that have been created.
     * @returns {object} A new object with the needed values.
     */
    static ElementsAndLinesCreated(elementIDs, lineIDs) {
        const changesArr = [];

        // Filter out defaults from each element and add them to allObj
        elementIDs.forEach(id => {
            const elem = Element.FindElementById(id);
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
            changesArr.push({id: elem.id, ...values});
        });

        // Filter out defaults from each line and add them to allObj
        lineIDs.forEach(id => {
            const values = {};
            const line = lines.find(l => l.id == id);
            const uniqueKeysArr = Object.keys(line).filter(key => {
                return (Object.keys(defaultLine).filter(value => {
                    return defaultLine[value] == line[key];
                }).length == 0);
            });
            uniqueKeysArr.forEach(key => {
                values[key] = line[key];
            });
            changesArr.push({id: line.id, ...values});
        });
        return changesArr;
    }    

    /**
     * @description Checks if any of the selected elements are locked
     * @returns {object} A new object with the needed values.
     */
    static ElementsAreLocked() {
        const lockedElements = [];
        for (const element of context) {
            lockedElements.push({
                id: element.id,
                isLocked: element.isLocked
            });
        }
        return lockedElements;
    }

    /**
     * @description Get's all the properties for the selected line
     * @returns {object} A new object with the needed values.
     */
    static GetLineProperties() {
        const line = contextLine[0];
        const changes = {};
        const connectedToInitialOrFinal = isConnectedToInitialOrFinalState(line);

        // saves kind of line (normal, dashed, double, etc)
        for (let radio of document.querySelectorAll('#propertyFieldset input[type=radio]')) {
            if (radio && radio.checked) {
                changes.kind = radio.value;
            }
        }

        // saves cardinalities for ER attributes
        const cardinalityER = document.getElementById('propertyCardinality');
        if (cardinalityER) {
            changes.cardinality = cardinalityER.value;
        }

        // saves the label
        const label = document.getElementById('lineLabel');    
        if (label) {
            changes.label = label.value;
        }

        // adds the rest of the attributes for the specific entity
        if (line.type == entityType.UML) {
            changes.startLabel = document.getElementById("lineStartLabel").value;
            changes.endLabel = document.getElementById("lineEndLabel").value;
            changes.startIcon = document.getElementById("lineStartIcon").value;
            changes.endIcon = document.getElementById("lineEndIcon").value;
        }
        if (line.type == entityType.SD) {
            if (!connectedToInitialOrFinal) {
                changes.innerType = document.getElementById("lineType").value;
                changes.startIcon = document.getElementById("lineStartIcon").value;
                changes.endIcon = document.getElementById("lineEndIcon").value;
            } else {
                changes.innerType = document.getElementById("lineType").value;
            }
        }
        if ((line.type == entityType.SE) || (line.type == entityType.IE)) {
            changes.startIcon = document.getElementById("lineStartIcon").value;
            changes.endIcon = document.getElementById("lineEndIcon").value;
        }        

        return changes;
    }

    /**
     * @description Checks wether an ER entity is normal or weak.
     * @returns The state of element, either old or new.
     */
    static ChangeElementState() {
        const element = context[0];
        const oldRelation = element.state;
        const newRelation = document.getElementById("propertySelect")?.value || undefined;
        if (newRelation && oldRelation != newRelation) {
            if (element.type == entityType.ER || element.type == entityType.UML || element.type == entityType.IE) {
                if (element.kind != elementTypesNames.UMLEntity) {
                    let property = document.getElementById("propertySelect").value;
                    element.state = property;
                    return element.state;
                }
            }
        }
        return element.state;
    }


    /**
     * @description Get properties for a sequence condition.
     * @returns {object} A new object with the needed values.
     */
    static GetSequenceAlternatives() {
        return {
            alternatives: context[0].alternatives,
            altOrLoop: context.altOrLoop
        };
    }
}
