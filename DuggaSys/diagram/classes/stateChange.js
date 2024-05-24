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
     * @description Creates a new StateChange instance.
     * @param {Array<String>} id Array of all elements affected by this state change. This is used for merging changes on the same elements.
     * @param {Object} values Map of all values that this change contains. Each property represents a change.
     * @param {number | null} timestamp Time when this change took place.
     */
    constructor(id, values, timestamp) {
        this.id = id;
        this.time = timestamp ?? new Date().getTime();

        if (values) {
            let keys = Object.keys(values);
            // If "values" is an array of objects, store all objects in the "state.created" array.
            if (keys[0] == '0') {
                this.created = values;
            } else {
                keys.forEach(key => {
                    this[key] = values[key];
                });
            }
        }
    }

    /**
     * @description Keeps the appropriate values for when elements are created.
     * @param {Element} element The new element that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
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
     * @param {Object} line New line that has been created.
     * @returns {StateChange} A new instance of the StateChange class.
     */
    static LineAdded(id) {
        const line = lines.find(line => line.id == id);
        const values = {};
        // Get the keys of the values that is unique from default
        const uniqueKeysArr = Object.keys(line).filter(key => {
            return (Object.keys(defaultLine).filter(value => defaultLine[value] == line[key]).length == 0);
        });
        // For every unique value set it into the change
        uniqueKeysArr.forEach(key => {
            values[key] = line[key];
        });
        return values;
    }

    /**
     * @description Keeps the appropriate values for when a line is deleted.
     * @param {string[]} lines List of all lines that have been / are going to be removed.
     * @returns {string[]} ID's of deleted lines.
     */
    static LinesDeleted(ids) {

        const lineIDs = [];
        // For every object in the lines array, add them to lineIDs
        for (let index = 0; index < lines.length; index++) {
            lineIDs.push(lines[index].id);
        }
        return lineIDs;
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
        return allIDs;
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

    static saveProperties(id) {
        const propSet = document.getElementById("propertyFieldset");
        const element = context[0];
        const children = propSet.children;
        const propsChanged = {};

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const inputTag = child.id;
            if (inputTag == "elementProperty_name") {
                let value = child.value;
                element.name = value;
                propsChanged.name = value;
                continue;
            }
            const addToLine = (name, symbol) => {
                if (inputTag == `elementProperty_${name}`) {
                    let lines = child.value.trim().split("\n");
                    for (let j = 0; j < lines.length; j++) {
                        if (lines[j] && lines[j].trim()) {
                            if (Array.from(lines[j])[0] != symbol) {
                                lines[j] = symbol + lines[j];
                            }
                        }
                    }
                    element[name] = lines;
                    propsChanged[name] = lines;
                }
            };
            // TODO: This should use elementTypeNames.note. It doesnt follow naming standard
            if (element.kind == elementTypesNames.SDEntity || element.kind == 'note') {
                addToLine("attributes", "");
                continue;
            }
            addToLine("primaryKey", "*");
            addToLine("attributes", "-");
            addToLine("functions", "+");
        }
    }

    static ElementIsLocked() {
        const lockedElements = [];
        for (const element in context) {
            lockedElements.push({
                id: element.id,
                isLocked: element.isLocked
            });
        }
        return lockedElements;
    }

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

        console.log(changes)
        return changes;
    }

    static ChangeElementState() {
        const element = context[0];
        const oldRelation = element.state;
        const newRelation = document.getElementById("propertySelect")?.value;
        if (!newRelation || oldRelation == newRelation) return;
        if (element.type != entityType.ER || element.type != entityType.UML || element.type != entityType.IE) return;
        if (element.kind != elementTypesNames.UMLEntity && element.kind != elementTypesNames.IERelation) {
            let property = document.getElementById("propertySelect").value;
            element.state = property;                                        
        }
        return property;
    }
}
