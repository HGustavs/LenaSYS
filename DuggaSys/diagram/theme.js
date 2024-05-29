/**
 * @description Updates CSS properties for all diagram elements based on their data attributes.
 * Manages positioning, appearance, and highlighting for entities, relationships, and notes.
 * Ensures visual consistency and responsiveness to user interaction, adjusting elements
 * dynamically based on their coordinates, zoom level, and scroll position.
 */
function updateCSSForAllElements() {
    function updateElementDivCSS(elementData, divObject, useDelta = false) {
        let eRect = divObject.getBoundingClientRect();
        let left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx / zoomfact));
        let top = Math.round(((elementData.y - zoomOrigo.y) * zoomfact)) + (scrolly / zoomfact);

        if (useDelta) {
            left -= deltaX;
            top -= deltaY;
        }

        if (settings.grid.snapToGrid && useDelta) {
            if (element.kind == elementTypesNames.EREntity) {
                // The element coordinates with snap point
                let objX = Math.round((elementData.x + elementData.width / 2 - (deltaX * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);
                let objY = Math.round((elementData.y + elementData.height / 2 - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            } else if (element.kind != elementTypesNames.EREntity) {
                // The element coordinates with snap point
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

    // Update positions of all data elements based on the zoom level and view space coordinate
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
            var disjointLine1Color;
            var disjointLine2Color;
            if (data[i].isLocked) useDelta = false;
            updateElementDivCSS(element, elementDiv, useDelta);

            // Edge creation does not highlight selected elements
            if (mouseMode != mouseModes.EDGE_CREATION) {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne()) {
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
                        if (markedOverOne()) {
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
                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];

                        if (markedOverOne()) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontContrast();
                        }
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    if (markedOverOne()) {
                        fillColor.style.fill = color.LIGHT_PURPLE;
                        fontColor.style.fill = color.WHITE;
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
                        fillColor.style.fill = `${element.fill}`;
                        fontContrast();
                        if (element.state == "weakKey") {
                            if (element.fill == color.BLACK) {
                                weakKeyUnderline.style.stroke = color.WHITE;
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
                    if (markedOverOne()) {
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
    // Also update ghost if there is one
    if (ghostElement) {
        var ghostDiv = document.getElementById(ghostElement.id);

        if (ghostDiv) {
            updateElementDivCSS(ghostElement, ghostDiv)
        }
    }
    /**
     * @description check if the fill color is black or pink, if so the font color is set to white
     */
    function fontContrast() {
        fontColor.style.fill = element.fill == color.BLACK || element.fill == color.PINK ? color.WHITE : color.BLACK;
    }

    /**
     * @description Determines if the context meets specific length conditions.
     */
    function markedOverOne() {
        return inContext && context.length > 1 || inContext && context.length > 0 && contextLine.length > 0;
    }

    toggleBorderOfElements();
}

/**
 * @description toggles the border of all elements to white or gray; depending on current theme and fill.
 */
function toggleBorderOfElements() {
    //get all elements with the class text. This inludes the text in the elements but also the non text svg that surrounds the text and just has a stroke.
    //For the future, these svg elements should probably be given a class of their own and then this function should be updated.
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
        //if the theme isnt darkmode and the fill isn't gray, make the stroke gray.
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
