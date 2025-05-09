/**
 * @description Empties the context array of all selected elements.
 */
function clearContext() {
    if (context) {
        context = [];
        generateContextProperties();
    }
}

/**
 * @description Empties the context array of all selected lines.
 */
function clearContextLine() {
    if (contextLine) {
        contextLine = [];
        generateContextProperties();
    }
}

/**
 * @description Puts all available elements of the data array into the context array.
 */
function selectAll() {
    context = data;
    contextLine = lines;
    generateContextProperties();
    showdata();
}

