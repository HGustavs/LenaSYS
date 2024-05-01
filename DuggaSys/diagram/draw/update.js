/**
 * @description Remove all elements with the class "node"
 */
function removeNodes() {
    var nodes = document.getElementsByClassName("node");
    while (nodes.length > 0) {
        nodes[0].remove();
    }
}

/**
 * @description Updates the elements translations and redraw lines.
 * @param {number || null} deltaX The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the X-axis.
 * @param {number || null} deltaY The amount of pixels on the screen the mouse has been moved since the mouse was pressed down in the Y-axis.
 */
function updatepos() {
    updateCSSForAllElements();
    document.getElementById("svgbacklayer").innerHTML = redrawArrows();
    document.getElementById("svgoverlay").innerHTML = (mouseButtonDown) ? boxSelect_Draw() : drawSelectionBox();
    removeNodes();
    if (context.length === 1 &&
        mouseMode == mouseModes.POINTER &&
        context[0].kind != elementTypesNames.UMLRelation &&
        context[0].kind != elementTypesNames.IERelation
    ) {
        addNodes(context[0]);
    }
}

/**
 * @description Used to update ruler bars on window resize.
 */
function updateRulers() {
    updateContainerBounds();
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Updates the variables for the size of the container-element.
 */
function updateContainerBounds() {
    let containerbox = container.getBoundingClientRect();
    cwidth = containerbox.width;
    cheight = containerbox.height;
}

/**
 * @description sets the alternatives attribute for sequenceLoopOrAlt to whatever is in the input box inputAlternatives. one index in the array per line.
 */
//TODO This should be implemeted into saveProperties but as of this moment I could not becuase of a bug that was outside the scope of my issue.
function setSequenceAlternatives() {
    //for each element in context, check if it has the property alternatives
    for (let i = 0; i < context.length; i++) {
        if (context[i].alternatives != null) {
            //Create an array from string where newline seperates elements
            let alternatives = document.getElementById("inputAlternatives").value.split('\n');
            let formatArr = [];
            for (let i = 0; i < alternatives.length; i++) {
                if (!(alternatives[i] == '\n' || alternatives[i] == '' || alternatives[i] == ' ')) {
                    formatArr.push(alternatives[i]);
                }
            }
            //Update the alternatives array
            alternatives = formatArr;
            context[0].alternatives = alternatives;

            stateMachine.save(
                StateChangeFactory.ElementAttributesChanged(context[0].id, {'alternatives': alternatives}),
                StateChangeFactory.ElementAttributesChanged(context[0].id, {'altOrLoop': context[0].altOrLoop}),
                StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED
            );
        }
    }
    showdata();
}

/**
 * @description Sets every elements stroke to black.
 * @param {Object} elements List of all elements.
 */
function errorReset(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].stroke = strokeColors;
    }
}

/**
 * @description Redraw all elements and lines
 */
function showdata() {
    var str = "";
    updateContainerBounds();
    errorData = [];
    errorReset(data);
    for (let i = 0; i < data.length; i++) {
        if (str.includes(data[i].toString())) {
            let tempString = drawElement(data[i]);
            str.replace(tempString, "");
        }
        let tempString = drawElement(data[i]);
        str += tempString;
    }
    if (ghostElement) {
        str += drawElement(ghostElement, true);
    }
    container.innerHTML = str;
    updatepos(null, null);
}

/**
 * @description Updates what line(s) are selected.
 * @param {Object} line Line that has been selected.
 */
function updateSelectedLine(line) {
    if (line && ctrlPressed) {
        if (!contextLine.includes(line)) {
            contextLine.push(line);
        } else {
            contextLine = contextLine.filter((l) => l !== line);
        }
    } else if (line && altPressed) {
        if (contextLine.includes(line)) {
            contextLine = contextLine.filter((l) => l !== line);
        }
    } else if (line) {
        context = [];
        if (!contextLine.includes(line) && contextLine.length < 1) {
            contextLine.push(line);
        } else {
            contextLine = [];
            contextLine.push(line);
        }
    } else if (!altPressed && !ctrlPressed) {
        contextLine = [];
    }
    generateContextProperties();
}

/**
 * @description Updates the current selection of elements depending on what buttons are down. Context array may have the new element added or removed from the context array, have the context array replaced with only the new element or simply have the array emptied.
 * @param {Object || null} element Element that has was clicked or null. A null value will DESELECT all elements, emptying the entire context array.
 */
function updateSelection(element) {
    if (ctrlPressed && element) {
        if (!context.includes(element)) {
            context.push(element);
            showdata();
            context = [];
        } else {
            context = context.filter((e) => e !== element);
        }
    } else if (altPressed && element) {
        if (context.includes(element)) {
            context = context.filter((e) => e !== element);
        }
    }
    else if (element) {
        contextLine = [];
        if (!context.includes(element) && context.length < 1) {
            context.push(element);
        } else {
            if (mouseMode != mouseModes.EDGE_CREATION) {
                context = [];
            }
            context.push(element);
        }
    } else if (!altPressed && !ctrlPressed) {
        context = [];
    }
    generateContextProperties();
}
