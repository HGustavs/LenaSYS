/**
 * @description Represents a change stored in the StateMachine. StateChange contains a list of StateChange.ChangeTypes in the local property stateChanges, that in turn contains a flag to describe each change. The getFlags() can be used to get the sum of all these stateChanges.
 */
class StateChange {
    /**
     * @description ChangeType containing all information about a certain change. Several instances of ChangeType can exist inside a StateChange.
     * @member flag A number represented in 2nd base. This allows several flags to be merged through bit operators.
     * @member isSoft Boolean deciding if this change is considered a hard/soft change. Hard changes will not try to merge with previous change.
     * @member canAppendTo Boolean deciding if a soft change is allowd to merge into this change.
     */
    static ChangeTypes = {
        ELEMENT_CREATED: {flag: 1, isSoft: false, canAppendTo: true},
        ELEMENT_DELETED: {flag: 2, isSoft: false, canAppendTo: false},
        ELEMENT_MOVED: {flag: 4, isSoft: true, canAppendTo: true},
        ELEMENT_RESIZED: {flag: 8, isSoft: true, canAppendTo: true},
        ELEMENT_ATTRIBUTE_CHANGED: {flag: 16, isSoft: true, canAppendTo: true},
        LINE_CREATED: {flag: 32, isSoft: false, canAppendTo: true},
        LINE_DELETED: {flag: 64, isSoft: false, canAppendTo: false},

        // Combined flags
        ELEMENT_MOVED_AND_RESIZED: {flag: 4 | 8, isSoft: true, canAppendTo: true},
        ELEMENT_AND_LINE_DELETED: {flag: 2 | 64, isSoft: false, canAppendTo: false},
        ELEMENT_AND_LINE_CREATED: {flag: 1 | 32, isSoft: false, canAppendTo: false},
    };

    /**
     * @description Creates a new StateChange instance.
     * @param {ChangeTypes} changeType What kind of change this is, see {StateChange.ChangeTypes} for available values.
     * @param {Array<String>} id_list Array of all elements affected by this state change. This is used for merging changes on the same elements.
     * @param {Object} passed_values Map of all values that this change contains. Each property represents a change.
     */
    constructor(id, values, timestamp) {
        if (id) this.id = id;

        if (values) {
            var keys = Object.keys(values);

            // If "values" is an array of objects, store all objects in the "state.created" array.
            if (keys[0] == '0') {
                this.created = values;
            } else {
                keys.forEach(key => {
                    this[key] = values[key];
                });
            }
        }

        if (timestamp) this.time = timestamp;
        else this.time = new Date().getTime();
    }
}
