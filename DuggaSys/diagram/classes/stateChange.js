/**
 * Represents a state change in the application.
 */
class StateChange {
    /**
    * @description Types of state changes with associated metadata.
    * @enum {Object}
    * @property {number} flag - A number represented in binary, allowing several flags to be merged using bitwise operators.
    * @property {boolean} isSoft - Indicates if the change is considered a hard or soft change. Hard changes will not try to merge with previous changes.
    * @property {boolean} canAppendTo - Indicates if a soft change is allowed to merge into this change.
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
       ELEMENT_AND_LINE_DELETED: {flag: 2 | 64, isSoft: false, canAppendTo: false},
       ELEMENT_AND_LINE_CREATED: {flag: 1 | 32, isSoft: false, canAppendTo: false},
   };

       /**
    * Creates an instance of StateChange.
    * @param {string} id - The identifier for the state change.
    * @param {Object} values - The values associated with the state change.
    * @param {number} [timestamp] - The timestamp of the state change.
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
