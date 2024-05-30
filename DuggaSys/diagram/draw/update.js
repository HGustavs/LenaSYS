/**
 * @description This function Remove all elements with the class name node.
 * This function selects elements by class name and removes each one in a loop until none are left.
 */
function removeNodes() {
    const nodes = document.getElementsByClassName("node");
    while (nodes.length > 0) {
        nodes[0].remove();
    }
}

/**
 * @description 
 * This function Updates the diagram's visuals and interactions based on the mouse state and selected elements.
 * Handles the redrawing of arrows and selection boxes, removes redundant nodes, and conditionally adds nodes based on the context.
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
 * @description This function Updates the variables for the size of the container element.
 * Gets the size and position of the container and updates the width and height variables.
 */
function updateContainerBounds() {
    let containerbox = container.getBoundingClientRect();
    cwidth = containerbox.width;
    cheight = containerbox.height;
}

/**
 * @description This function Sets the alternatives attribute for elements in the context array to the values in the input box inputAlternatives.
 * Each line in the input box becomes an element in the alternatives array.
 * USED IN PHP
 */
//TODO This should be implemeted into saveProperties but as of this moment I could not becuase of a bug that was outside the scope of my issue.
function setSequenceAlternatives() {
    //for each element in context, check if it has the property alternatives
    for (let i = 0; i < context.length; i++) {
        if (!context[i].alternatives) continue;

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
        stateMachine.save(context[0].id, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    }
    showdata();
}

/**
 @description Resets the stroke color of each element in the provided list 
 to the default value specified in 'strokeColors'
 * @param {Object} elements List of all elements.
 */
function errorReset(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].stroke = strokeColors;
    }
}

/**
 * @description This function Redraws all elements and lines on the container.
 * Updates container size, resets element styles, and draws elements.
 */
function showdata() {
    let str = "";
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
    updatepos();
}

/**
 * @description This function Updates the `contextLine` list based on user selections and key presses.
 * Handles various scenarios based on whether the Ctrl or Alt key is pressed, as well as when a specific line is selected.
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
    } else if (element) {
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

/**
 * @description Sets the position of the ruler indicators based on absolute coordinates.
 * @param {Number} x Absolute x-position in pixels from the left of the inner window.
 * @param {Number} y Absolute y-position in pixels from the top of the inner window.
 */
function setRulerPosition(x, y) {
    //40 is the size of the actual ruler and 51 is the toolbar on the left side
    if (x >= 40 + 51) document.getElementById("ruler-x").style.left = x - 51 + "px";
    if (y >= 40) document.getElementById("ruler-y").style.top = y + "px";
}

/**
 * Updates the grid size based on the current zoom level. This function recalculates the grid dimensions
 * and adjusts the grid lines accordingly, ensuring that the grid size is appropriate for the current zoom.
 * It also updates the stroke widths for the grid's origin lines.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
function updateGridSize() {
    //Do not remore, for later us to make gridsize in 1cm.
    const pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    settings.grid.gridSize = 10 * pxlength;

    let bLayer = document.getElementById("grid");
    bLayer.setAttribute("width", settings.grid.gridSize * zoomfact + "px");
    bLayer.setAttribute("height", settings.grid.gridSize * zoomfact + "px");

    bLayer.children[0].setAttribute('d', `M ${settings.grid.gridSize * zoomfact} 0 L 0 0 0 ${settings.grid.gridSize * zoomfact}`);

    // Set width of origo line on the x axis
    bLayer = document.getElementById("origoX");
    bLayer.style.strokeWidth = settings.grid.origoWidth * zoomfact;

    // Set width of origo line on the y axis
    bLayer = document.getElementById("origoY");
    bLayer.style.strokeWidth = settings.grid.origoWidth * zoomfact;

    updateGridPos();
}

/**
 * @description This function calculates and updates the new positioning of the background grid and origin lines based on the current
 * zoom level and scroll position. This function adjusts the x and y coordinates of the grid
 */
function updateGridPos() {
    const gridOffsetX = Math.round(((0 - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
    const gridOffsetY = Math.round(((0 - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));
    let bLayer = document.getElementById("grid");
    bLayer.setAttribute('x', gridOffsetX.toString());
    bLayer.setAttribute('y', gridOffsetY.toString());

    // origo x axis line position
    bLayer = document.getElementById("origoX");
    bLayer.setAttribute('y1', gridOffsetY.toString());
    bLayer.setAttribute('y2', gridOffsetY.toString());

    // origo y axis line position
    bLayer = document.getElementById("origoY");
    bLayer.setAttribute('x1', gridOffsetX.toString());
    bLayer.setAttribute('x2', gridOffsetX.toString());
}

/**
 * @description Updates the grid size and its positioning based on the current zoom level and scroll position.
 * @see Adjusts the grid dimensions and recalculates its position to ensure it is displayed correctly according to the zoom origin and scroll offsets.
 * @see zoomin Function where the zoom level increases.
 * @see zoomout Function where the zoom level decreases.
 */
function updateA4Size() {
    const rect = document.getElementById("a4Rect");
    const vRect = document.getElementById("vRect");
    const pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    const a4Width = 210 * pxlength;   // Width for A4 paper in portrait mode
    const a4Height = 297 * pxlength;  // Height for A4 paper in portrait mode

    // Set dimensions for vertical orientation (a4Rect)
    rect.setAttribute("width", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");
    rect.setAttribute("height", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");

    // Set dimensions for horizontal orientation (vRect)
    vRect.setAttribute("width", a4Height * zoomfact * settings.grid.a4SizeFactor + "px");
    vRect.setAttribute("height", a4Width * zoomfact * settings.grid.a4SizeFactor + "px");

    updateA4Pos();
}

/**
 * @description Updates the dimensions and positioning of the A4 template representation based on the current zoom level.
 * Adjusts the A4 template size and position, ensuring it matches the zoom and scroll settings.
 */
function updateA4Pos() {
    const OffsetX = Math.round(-zoomOrigo.x * zoomfact + (scrollx * (1.0 / zoomfact)));
    const OffsetY = Math.round(-zoomOrigo.y * zoomfact + (scrolly * (1.0 / zoomfact)));
    const rect = document.getElementById("a4Rect");
    const vRect = document.getElementById("vRect");
    const text = document.getElementById("a4Text");

    vRect.setAttribute('x', OffsetX.toString());
    vRect.setAttribute('y', OffsetY.toString());

    rect.setAttribute('x', OffsetX.toString());
    rect.setAttribute('y', OffsetY.toString());

    text.setAttribute('x', (OffsetX + (780 * zoomfact)).toString());
    text.setAttribute('y', (OffsetY - 5).toString());
}
