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

    
}
