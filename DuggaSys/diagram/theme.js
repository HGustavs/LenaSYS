/**
 * @description Updates the CSS position and visual styling of all diagram elements based on the
 * zoom, scroll position, user interaction and the current mode
 *Also handles snapping to grid and theme-specific styling updates. 
 * This function is essential mostly for keeping the UI consistent after user interaction or rendering changes.
 */
 
function updateCSSForAllElements() {

    /**
     * @description
     * Adjusts a single element's position based on coordinate, zoom, scroll, and snapping.
     * @param {Object} elementData - Data model of the element
     * @param {HTMLElement} divObject - Corresponding DOM object
     * @param {boolean} useDelta - Whether to apply delta offset from drag operations
     */
    function updateElementDivCSS(elementData, divObject, useDelta = false) {
        let eRect = divObject.getBoundingClientRect(); // eRect is not being used so this could probably be removed unless it will serve a purpose in future update of code
        let left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx / zoomfact));
        let top = Math.round(((elementData.y - zoomOrigo.y) * zoomfact)) + (scrolly / zoomfact);

        if (useDelta) {
            left -= deltaX;
            top -= deltaY;
        }

        const includedElementTypes = Object.values(elementTypesNames);

        // Logic for snap to grid
        if (settings.grid.snapToGrid && useDelta) {
            if (includedElementTypes.includes(element.kind)){
                // The element coordinates with snap point
                let objX = Math.round((elementData.x + elementData.width / 2 - (deltaX * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);
                let objY = Math.round((elementData.y + elementData.height / 2 - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top  = Math.round(((objY - zoomOrigo.y) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            } else if (element.kind != elementTypesNames.EREntity) {
                // The element coordinates with snap point, similiar logic for non-ER entities
                let objX = Math.round((elementData.x + elementData.width / 2 - (deltaX * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);
                let objY = Math.round((elementData.y + elementData.height / 2 - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            }
        }
        divObject.style.left = left + "px";
        divObject.style.top = top + "px";
    }

    // Loops through all elements and updates their screen positions and visual styles
    for (let i = 0; i < data.length; i++) {
        var element = data[i];
        // Element DIV (dom-object)
        var elementDiv = document.getElementById(element.id);
        if (elementDiv != null) {
            // If the element was clicked and our mouse movement is not null
            var inContext = deltaX != null && findIndex(context, element.id) != -1;
            var useDelta = (inContext && movingObject);
            var fillColor;
            var fontColor;
            var weakKeyUnderline;
            // These two variables are declared but arent used, can be removed if wont serve a purpose in future update of code
            var disjointLine1Color;
            var disjointLine2Color;

            //Element won't update its position relative to the cursor if useDelta is false. 
            if (data[i].isLocked || pointerState == pointerStates.CLICKED_CONTAINER || boxSelectionInUse) useDelta = false;
            updateElementDivCSS(element, elementDiv, useDelta);

            // Apply visual highlights and colors if not in Edge creation mode
            if (mouseMode != mouseModes.EDGE_CREATION) {
                // Update UMLEntity, i.e visual updates based on entity kind and selection state
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (contextLengthCheck()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (contextLengthCheck()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (contextLengthCheck()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update Elements with double borders, used for weak entities or mulitple instances
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];

                        if (contextLengthCheck()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                    // Update normal elements, and relations i.e default case
                } else { 
                    if (element.kind == elementTypesNames.sequenceObject) {
                        fillColor = elementDiv.querySelector("g > rect"); // Accessing the rectangle element
                    }
                    else if (element.kind == elementTypesNames.sequenceActor) {
                        fillColor = elementDiv.querySelector("g > circle"); // Accessing the circular "head" element
                    }
                    else if (element.kind == elementTypesNames.sequenceLoopOrAlt || element.kind == elementTypesNames.UMLSuperState) {
                        fillColor = elementDiv.querySelector("#loopLabel"); // Accessing the top left rectangle
                    }
                    else {
                        fillColor = elementDiv.children[0].children[0]; // Accessing the whatever needs to be accessed
                    }
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.querySelector("line");
                    if (contextLengthCheck()) {
                        fillColor.style.fill = color.LIGHT_PURPLE;
                        fontColor.style.fill = color.WHITE;
                        
                        // If the weakKey attribute is selected, update underline color
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        }
                        
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                            weakKeyUnderline.style.stroke = color.BLACK;
                        }
                    } else {
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if (element.state == "weakKey") {
                            if (element.fill == color.BLACK || element.fill == color.PINK || element.fill == color.BLUE) { // If the weakKey attribute is set to the color black, pink or blue, update underline color
                                weakKeyUnderline.style.stroke = color.WHITE;
                            } else {
                                weakKeyUnderline.style.stroke = color.BLACK;
                            }
                        }
                    }
                }
            } else {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    if (contextLengthCheck()) {
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        }
                        // If UMLRelation is not marked.
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                        }
                    } else {
                        fillColor.style.fill = element.fill;
                        fontContrast();
                    }
                }
            }
        }
    }
    //  If a ghost element exists, ensure its position is updated too
    if (ghostElement) {
        var ghostDiv = document.getElementById(ghostElement.id);

        if (ghostDiv) {
            updateElementDivCSS(ghostElement, ghostDiv)
        }
    }

    /**
     * @description Determines whether to use white or black text based on background fill color for contrast
     * Only applies to black or pink elements 
     */

    function fontContrast() {
        // Set text to white if background is black or pink, else black
        if (element.fill == color.BLACK || element.fill == color.PINK || element.fill == color.BLUE) {
            fontColor.style.fill = color.WHITE;
        } else {
            fontColor.style.fill = color.BLACK;
        }
    }
    /**
     * @description Checks if multiple elements or lines are selected/highlighted
     * Used to determine whether to apply multi-select highlight visuals
     */
    function contextLengthCheck() {
        
        return inContext && context.length > 0 || inContext && context.length > 0 && contextLine.length > 0;
    }
    toggleBorderOfElements();
}

/**
 * @description
 * Toggles the border color of all visual text elements and their stroke outlines depending on
 * current theme settings. Ensures visibility and contrast in both dark and light themes.
 *
 * Note that it effects both actual text and surrounding SVG elements that share the 'text' class.
 * Ideally, non-text SVGs should be assigned a separate class in future updates.
 */
function toggleBorderOfElements() {
    
  // Get all elements that have the class 'text'
    let allTexts = document.getElementsByClassName('text');
    if (localStorage.getItem('diagramTheme') != null) {
        //in localStorage, diagramTheme holds a URL to the CSS file currently used. Like, style.css or blackTheme.css
        let cssUrl = localStorage.getItem('diagramTheme');
        //this turns, for example, '.../Shared/css/style.css' into just 'style.css'
        cssUrl = cssUrl.split("/").pop();

        if (cssUrl == 'blackTheme.css') {
            //iterate through all the elements that have the class 'text'.
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                //assign their current stroke color to a variable.
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                //if the element has a stroke which has the color #383737 and its fill isn't white: set it to white.
                //this is because we dont want to affect the strokes that are null or other colors and have a contrasting border.
                if (strokeColor == color.GREY && fillColor != color.WHITE) {
                    strokeColor = color.WHITE;
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
        // If using light theme, reset any white stroke back to grey unless the fill is already grey
        else {
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                if (strokeColor == color.WHITE && fillColor != color.GREY) {
                    strokeColor = color.GREY;
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
    }
}
