/**
 * @description Generates fields for all properties of the currently selected element/line in the context.
 * These fields can be used to modify the selected element/line.
 */
function generateContextProperties() {
    let str = '';
    const element = context[0];
    const line = contextLine[0];

    if ((context.length > 0 || contextLine.length > 0) && (erTableToggle || testCaseToggle)) {
        erTableToggle = false;
        testCaseToggle = false;
    }

    let propSet = document.getElementById("propertyFieldset");
    let menuSet = document.getElementsByClassName('options-section');

    propSet.innerHTML = ""; 

    str += "<legend>Properties</legend>";
    if (context.length == 0 && contextLine.length == 0 && !erTableToggle && !testCaseToggle) {
        showProperties(false, propSet, menuSet);
    } else if ((context.length == 0 && contextLine.length == 0) && (erTableToggle || testCaseToggle)) {// No element or line selected, but either erTableToggle or testCaseToggle is active.
        showProperties(true, propSet, menuSet);
    }
    // display ER-table instead of properties
    if (erTableToggle) {
        str += `<div id="ERTable">${generateErTableString()}</div>`;
        propSet.innerHTML = str;
        return
    }
    // display SD info instead of properties
    if (testCaseToggle) {
        str += `<div id="ERTable">${generateStateDiagramInfo()}</div>`;
        propSet.innerHTML = str;
        return;
    }
    //One element selected, no lines
    if (context.length == 1 && contextLine.length == 0) {
        showProperties(true, propSet, menuSet);
        str += drawElementProperties(element);
    }
    // Creates radio buttons and drop-down menu for changing the kind attribute on the selected line.
    if (context.length == 0 && contextLine.length == 1) {
        showProperties(true, propSet, menuSet);
        str += drawLineProperties(line);
    }
    //If more than one element is selected
    if (context.length > 1) {
        showProperties(true, propSet, menuSet);
        str += colorSelection(element);
    }
    if (context.length > 0) {
        showProperties(true, propSet, menuSet);
        let locked = context.some(e => e.isLocked);
        str += saveButton('toggleEntityLocked();', 'lockbtn', locked ? "Unlock" : "Lock");
    }
    propSet.innerHTML = str;
    var inputs = propSet.querySelectorAll('input, textarea');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function() {
            saveProperties();
        });
    }
    multipleColorsTest();
}

/**
 * @description Makes it show or hide the properties with class names.
 * @param {boolean} show Shows the properties if it's true, or hide if it's false.
 * @param {Object} propSet Add or remove class name from the object.
 * @param {Array} menuSet Change all class name to show or hide.
 */
function showProperties(show, propSet, menuSet) {
    let a = (show) ? 'options-fieldset-show' : 'options-fieldset-hidden';
    let b = (!show) ? 'options-fieldset-show' : 'options-fieldset-hidden';
    propSet.classList.add(a);
    propSet.classList.remove(b);
    for (let i = 0; i < menuSet.length; i++) {
        menuSet[i].classList.add(b);
        menuSet[i].classList.remove(a);
    }
}

/**
 * @description Escapes the html which removes problematic characters and replaces them with string-character.
 * @param {String} str String to be escaped.
 * @returns Returns a html-free string.
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
/**
 * @description Makes a textarea or text input for editing the propertys of an element
 * @param {String} name Name for the header for the textarea/input.
 * @param {String} property What type of property the textarea/input is.
 * @param {Object} element What element the textarea/input is for.
 * @return Returns the div that is the header and the textarea/input for the specific element.
 */
function textarea(name, property, element) {
    const safeText = escapeHtml(textboxFormatString(element[property]));
    const safeName = escapeHtml(element[property]);
    let shownProperty = element[property];

    if (shownProperty === null){
        shownProperty = "";
    }
    if (property == "stereotype"){
        return `<div style='color:${color.WHITE};'>${name}</div>
            <input 
                id='elementProperty_${property}' 
                maxlength='10'
                value='${shownProperty}'
            >${safeName}</input>`;
    }
    else{
        return `<div style='color:${color.WHITE};'>${name}</div>
            <textarea 
                id='elementProperty_${property}' 
                rows='4' style='width:98%;resize:none;'
            >${textboxFormatString(safeText)}</textarea>`;
    }
    
}

/**
 * @description Makes a text input to be able to change the name of the element.
 * @param {Object} element What element the input is for.
 * @return Returns the div that is the header and the text input.
 */
function nameInput(element) {
    const safeName = escapeHtml(element.name);
    return `<div style='color:${color.WHITE};'>Name</div>
            <input 
                id='elementProperty_name' 
                type='text' 
                value='${safeName}'
                maxlength='1000'
            >`;
}

/**
 * @description Makes a button that calls on a function.
 * @param {*} functions What the function should be called.
 * @param {String} id What ID the input should have.
 * @param {String} value What value the input should have
 * @return Returns the button input.
 */
function saveButton(functions, id = '', value = 'Save') {
    return `<br><br>
            <input id='${id}'
                type='submit' value='${value}' class='saveButton' 
                onclick="${functions}"
            >`;
}

/**
 * @description Makes a dropdown selection for a property on an element.
 * @param {String} name The header for the dropdown.
 * @param {String} def The default value for the dropdown.
 * @param {Object} object What types of value the element have.
 * @param {Object} element What type of element the dropdown is for.
 * @return Returns a div that is the header for the dropdown and a dropdown menu.
 */
function dropdown(name, def, object, element) {
    let options = '';
    let current = element.state ?? def;
    Object.values(object).forEach(value => {
        let s = (current == value) ? `selected ="selected"` : '';
        options += `<option ${s} value='${value}'>${value}</option>`;
    });
    return `<div style='color:${color.WHITE};'>${name}</div>
            <select id="propertySelect">${options}</select>`;
}

/**
 * @description Allows for changeing the color of an element
 * @param {Object} element Which element that is going to change color.
 * @return Returns the menu to change color.
 */
function colorSelection(element) {
    return `<div style="color:${color.WHITE};">Color</div> 
            <button 
                id="colorMenuButton1" 
                class="colorMenuButton" 
                onclick="toggleColorMenu('colorMenuButton1')" 
                style="background-color:${element.fill};"
            >
                <span id="BGColorMenu" class="colorMenu"></span>
            </button>`;
}

/**
 * @description Creating the editable fields for the selected element.
 * @param {Object} element What element the properties is associated with.
 * @return Returns the editable fields for the element.
 */
function drawElementProperties(element) {
    let str = '';
    //TODO in the future, this can be implemented as part of saveProperties.
    switch (element.kind) {
        case elementTypesNames.EREntity:
            str += nameInput(element);
            str += dropdown('Variant', 'normal', entityState, element);
            break;
        case elementTypesNames.UMLEntity:
            str += textarea('Stereotype', 'stereotype', element);
            str += nameInput(element);
            str += textarea('Attributes', 'attributes', element);
            str += textarea('Functions', 'functions', element);
            break;
        case elementTypesNames.IEEntity:
            str += nameInput(element);
            str += textarea('Primary Key', 'primaryKey', element);
            str += textarea('Attributes', 'attributes', element);
            break;
        case elementTypesNames.SDEntity:
            str += nameInput(element);
            str += textarea('Attributes', 'attributes', element);
            break;
        case elementTypesNames.UMLSuperState:
            str += nameInput(element); // this removed maxlength='${20 * zoomfact}' for name
            break;
        case elementTypesNames.ERRelation:
            str += nameInput(element);
            str += dropdown('Variant', 'normal', relationState, element);
            break;
        case elementTypesNames.ERAttr:
            str += nameInput(element);
            str += dropdown('Variant', 'normal', attrState, element);
            break;
        case elementTypesNames.UMLRelation:
            str += nameInput(element);
            str += dropdown('Inheritance', 'disjoint', inheritanceState, element);
            break;
        case elementTypesNames.IERelation:
            str += nameInput(element);
            str += dropdown('Inheritance', 'disjoint', inheritanceStateIE, element);
            break;
        case elementTypesNames.sequenceActor:
            str += nameInput(element);
            break;
        case elementTypesNames.sequenceObject:
            str += nameInput(element);
            break;
        case elementTypesNames.sequenceLoopOrAlt:
            str += `<div>Each line is a alternative. Single alternative is a loop.
                            <textarea 
                                id='inputAlternatives' 
                                rows='4' style='width:98%;resize:none;'
                            >${textboxFormatString(element.alternatives)}</textarea>
                        </div>`;
            break;
        case 'note': // This should follow elementTypesNames naming convension
            str += textarea('Attributes', 'attributes', element);
            break;
    }
    if (element.kind != elementTypesNames.UMLRelation &&
        element.kind != elementTypesNames.IERelation
    ) {
        str += colorSelection(element);
    }
    str += saveButton('setSequenceAlternatives();changeState();saveProperties();generateContextProperties();');
    return str;
}

/**
 * @description Creates the options for selecting cardinalitie icons for a dropdown (Not the dropdown itself)
 * @param {Object} icon What type of icon the line is having, for example a ARROW at one end.
 * @param {Object} object What types of value the element have.
 * @return Returns a dropdown menu.
 */
function option(object, icon) {
    let result = '';
    Object.values(object).forEach(i => {
        let selected = (i == icon) ? 'selected' : '';
        result += `<option value='${i}' ${selected}>${i}</option>`;
    });
    return result;
}

/**
 * @description Creates radio inputs for selecting which type of line the user wants the line to be.
 * @param {Object} line The line between two elements.
 * @param {Array} arr An array for the different options.
 * @return Returns a header for the radio menu and returns the radio menu with the different options.
 */

function radio(line, arr) {
    let result = "";
        result = `<h3 style="margin-bottom: 0; margin-top: 5px;">Kinds</h3>`;
        arr.forEach(lineKind => {
            let checked = (line.kind == lineKind) ? 'checked' : '';
            result += `<input type="radio" id="lineRadio${lineKind}" name="lineKind" value='${lineKind}' ${checked} onchange='changeLineProperties();'>
                    <label for='lineRadio${lineKind}'>${lineKind}</label>
                    <br>`
        });    
    return result;
}

/**
 * @description Creates a dropdown menu.
 * @param {String} id What id the menu should have.
 * @param {*} options The different options the dropdown menu should have.
 * @param {boolean} inclNone True if one of the options should have value "None".
 * @param {boolean} inclChange True if the function "changeLineProperties" should be called.
 * @return Returns a dropdown menu with the options as selectable items.
 */
function select(id, options, inclNone = true, inclChange = true) {
    let none = (inclNone) ? `<option value=''>None</option>` : '';
    let change = (inclChange) ? `onChange="changeLineProperties();"` : '';
    return `<select id='${id}' ${change}>
                ${none}
                ${options}
            </select>`;
}

/**
 * @description Creates a text input with a placeholder and a pre determined value if there is one
 * @param {String} id What id the input should have.
 * @param {String} placeholder The placeholder if nothing is writen on the input.
 * @param {Object} value What the value should be for the text input. (Optional)
 * @return Returns a text input.
 */
function lineLabel(id, placeholder, value) {
    return `<input id="${id}" maxlength="50" type="text" placeholder="${placeholder}" value="${value ?? ''}"/>`;
}

/**
 * @description Creates a string of all the diffrent elements nesesary to edit the line
 * @param {object} line The line that the properties are for.
 * @return Returns the different property options.
 */
function drawLineProperties(line) {
    let str = '';
    const connectedToInitialOrFinal = isConnectedToInitialOrFinalState(line);

    switch (line.type) {
        case entityType.ER:
            str += radio(line, [lineKind.NORMAL, lineKind.DOUBLE]);
            str += `<label style="display: block;">Cardinality:`;
            let optER;
            Object.keys(lineCardinalitys).forEach(cardinality => {
                let selected = (line.cardinality == cardinality) ? 'selected' : '';
                optER += `<option value='${cardinality}' ${selected}>${lineCardinalitys[cardinality]}</option>`;
            });
            str += select('propertyCardinality', optER, true, false);
            str += `</label>`;
            break;
        case entityType.UML:
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += includeLabel(line);
            str += cardinalityLabels(line);
            str += iconSelection([UMLLineIcons, IELineIcons], line);
            break;
        case entityType.IE:
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += iconSelection([UMLLineIcons, IELineIcons], line);
            break;
        case entityType.SD:
            if (!connectedToInitialOrFinal) {
                let optSD = option(SDLineType, line.innerType);
                str += includeLabel(line);
                str += iconSelection([SDLineIcons], line);
                str += `<label style="display: block;">Line Type:</label>`;
                str += select('lineType', optSD, false);
            } else {
                let optSD = option(SDLineType, line.innerType);
                str += includeLabel(line);
                str += `<label style="display: block;">Line Type:</label>`;
                str += select('lineType', optSD, false);
            }
            break;
        case entityType.SE:


            if (line.kind === lineKind.RECURSIVE){
                str += includeSELabel(line);
                str += `<h3 style="margin-bottom: 0; margin-top: 5px;">Label</h3>`;
                break;
            }

            str += includeSELabel(line);
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += iconSelection([SELineIcons], line);
            str += `<h3 style="margin-bottom: 0; margin-top: 5px;">Label</h3>`;
            break;
    }
    str += saveButton('changeLineProperties();');
    return str;
}

/**
 * @description Makes the options of icons to represent the cardinalites on lines
 * @param {Array} arr All the different options for the selection menu.
 * @param {object} line The line that will have the icons
 * @return Returns a label and the different selections for the line.
 */
function iconSelection(arr, line) {
    let sOptions = '';
    let eOptions = '';
    arr.forEach(object => {
        sOptions += option(object, line.startIcon)
    });
    arr.forEach(object => {
        eOptions += option(object, line.endIcon)
    });
    return `<label style="display: block;">Icons:</label>`
        + select('lineStartIcon', sOptions)
        + select('lineEndIcon', eOptions);
}

/**
 * @description Add a label for the line that is a "<<include>>".
 * @param {object} line The line that have the "<<include>>" button as properties.
 * @return Returns a header, div-tag and a button that add a label on line.
 */
function includeLabel(line) {
    return `<h3 style="margin-bottom: 0; margin-top: 5px;">Label</h3>
                    <div>
                        <button 
                            id="includeButton" type="button" 
                            onclick="setLineLabel(); changeLineProperties();"
                        >&#60&#60include&#62&#62</button>
                    </div>`
        + lineLabel('lineLabel', 'Label', line.label);
}

/**
 * @description Be able to add a label on the line that is between sequence elements.
 * @param {object} line The line between the sequence elements.
 * @return Returns a header with a text input from the function "lineLabel".
 */
function includeSELabel(line) {
    return '<h3 style="margin-bottom: 0; margin-top: 5px;">Label</h3>'
        + lineLabel('lineLabel', 'Label', line.label);
}

/**
 * @description Creates two editable labels for a lines cardinalities.
 * @param {object} line A line that have an start and end cardinality as properties.
 * @return Returns a header and the text input for adding cardinalities to the line.
 */
function cardinalityLabels(line) {
    return `<h3 style="margin-bottom: 0; margin-top: 5px;">Cardinalities</h3>`
        + lineLabel('lineStartLabel', 'Start cardinality', line.startLabel)
        + lineLabel('lineEndLabel', 'End cardinality', line.endLabel);
}

/**
 * @description Sets the value of an element with the id "lineLabel" to "<<include>>"
 */
function setLineLabel() {
    document.getElementById("lineLabel").value = "<<include>>";
}

/**
 * @description Toggles the option menu being open or closed.
 */
function toggleOptionsPane() {
    if (document.getElementById("options-pane").className == "show-options-pane") {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        if (document.getElementById("BGColorMenu") != null) {
            document.getElementById("BGColorMenu").style.visibility = "hidden";
        }
        document.getElementById("options-pane").className = "hide-options-pane";
    } else {
        document.getElementById('optmarker').innerHTML = "&#9650;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}

/**
 * @description Function used to format the attribute and function textareas in UML- and IE-entities. Every entry is written on new row.
 * @param {*} arr Input array with all elements that should be seperated by newlines
 * @returns Formated string containing all the elements in arr
 */
function textboxFormatString(arr) {
    let content = '';
    
    //Its an array when the textbox have more then one line
    if (!Array.isArray(arr)) {
        return arr;  
    }

    for(let i = 0; i < arr.length; i++) {
        content += arr[i] + '\n';   
    }

    return content;
}

/**
 * @description Function used to check if a given line is connected to an initial state or a final state.
 * @param {Object} line The line object that needs to be checked.
 * @returns {Boolean} Returns true if the line is connected to an initial state or a final state, otherwise false.
 */
function isConnectedToInitialOrFinalState(line) {
    const initialStateIds = data.filter(element => element.kind === elementTypesNames.UMLInitialState).map(element => element.id);
    const finalStateIds = data.filter(element => element.kind === elementTypesNames.UMLFinalState).map(element => element.id);
    return initialStateIds.includes(line.fromID) || initialStateIds.includes(line.toID) ||
        finalStateIds.includes(line.fromID) || finalStateIds.includes(line.toID);
}

/**
 * @description Generates the string which holds the ER table for the current ER-model/ER-diagram.
 * @returns Current ER table in the form of a string.
 */
function generateErTableString() {
    let lastList;
    let currentString;
    let row;
    let tempList;
//TODO: When functionality is complete, try to minimize the overall space complexity, aka try to extract
    let current;
// A list which contains entities that has been vistited in this codeblock
    let queue;
//only useful information from entities, attributes and relations.

    const entityList = [];    //All EREntities currently in the diagram
    const attrList = [];      //All ERAttributes currently in the diagram
    const relationList = [];  //All ERRelations currently in the diagram
    const stringList = [];    //List of strings where each string holds the relevant data for each entity

    /**
     * @description Multidimensional array containing data of each entity and their attribute. Index[0] is always the element
     * @structure ERAttributeData[i] = [entityObject, attributeObject1, ..., attributeObjectN]
     */
    const ERAttributeData = [];
    /**
     * @description Multidimensional array containing foreign keys for every entity. The owning entity is the entity where the foreign keys are added
     * @structure   ERForeignData[i] = [owningEntityObject, [otherEntityObject, foreignAttributeObject1, ..., foreignAttributeObjectN]]
     */
    const ERForeignData = [];
    /**
     * @description Multidimensional array containing relation and the connected entities. Also stores the cardinality and kind for connected entity
     * @structure   ERRelationData[i] = [relationObject, [entityObject, lineCardinality, lineKind], [otherEREntityObject, otherLineCardinality, otherLineKind]]
     */
    const ERRelationData = [];

    // Sort the data[] elements into entity-, attr- and relationList
    for (let i = 0; i < data.length; i++) {

        if (data[i].kind == elementTypesNames.EREntity) {
            entityList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERAttr) {
            attrList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERRelation) {
            relationList.push(data[i]);
        }
    }
    //For each relation in relationList
    for (let i = 0; i < relationList.length; i++) {
        //List containing relation-element and connected entities
        const currentRelationList = [];
        currentRelationList.push(relationList[i]);
        //Sort all lines that are connected to the current relation into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            //Get connected line from element
            if (relationList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (relationList[i].id == lines[j].toID) { //Get connected line to element
                lineList.push(lines[j]);
            }
        }

        //Identify every connected entity to relations
        for (let j = 0; j < lineList.length; j++) {
            for (let k = 0; k < entityList.length; k++) {
                if (entityList[k].id == lineList[j].fromID || entityList[k].id == lineList[j].toID) {
                    //Push in entity, line cardinality and kind
                    currentRelationList.push([entityList[k], lineList[j].cardinality, lineList[j].kind]);
                }
            }
        }
        //Push in relation for entity, line cardinality and kind.
        ERRelationData.push(currentRelationList);
    }
    //For each entity in entityList
    for (let i = 0; i < entityList.length; i++) {
        const currentRow = [entityList[i]];
        //Sort all lines that are connected to the current entity into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            if (entityList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (entityList[i].id == lines[j].toID) {
                lineList.push(lines[j]);
            }
        }
        // Identify all attributes that are connected to the current entity by using lineList[] and store them in currentEntityAttrList. Save their ID's in idList.
        const currentEntityAttrList = [];
        const idList = [];
        for (let j = 0; j < lineList.length; j++) {
            for (let h = 0; h < attrList.length; h++) {
                if (attrList[h].id == lineList[j].fromID || attrList[h].id == lineList[j].toID) {
                    currentEntityAttrList.push(attrList[h]);
                    currentRow.push(attrList[h]);
                    idList.push(attrList[h].id);
                }
            }
        }
        const parentAttribeList = []; //list of parent attributes

        for (let j = 0; j < currentEntityAttrList.length; j++) {
            //For each attribute connected to the current entity, identify if other attributes are connected to themselves.
            const attrLineList = [];
            for (let h = 0; h < lines.length; h++) {
                //If there is a line to/from the attribute that ISN'T connected to the current entity, save it in attrLineList[].
                if ((currentEntityAttrList[j].id == lines[h].toID ||
                        currentEntityAttrList[j].id == lines[h].fromID) &&
                    (lines[h].toID != entityList[i].id && lines[h].fromID != entityList[i].id)
                ) {
                    attrLineList.push(lines[h]);
                }
            }

            //Compare each line in attrLineList to each attribute.
            for (let h = 0; h < attrLineList.length; h++) {
                for (let k = 0; k < attrList.length; k++) {
                    //If ID matches the current attribute AND another attribute, try pushing the other attribute to currentEntityAttrList[]
                    if (((attrLineList[h].fromID == attrList[k].id) && (attrLineList[h].toID == currentEntityAttrList[j].id)) || ((attrLineList[h].toID == attrList[k].id) && (attrLineList[h].fromID == currentEntityAttrList[j].id))) {
                        //Iterate over saved IDs
                        let hits = 0;
                        for (let p = 0; p < idList.length; p++) {
                            //If the ID of the attribute already exists, then increase hits and break the loop.
                            if (idList[p] == attrList[k].id) {
                                hits++;
                                break;
                            }
                        }
                        //If no hits, then push the attribute to currentEntityAttrList[] (so it will also be checked for additional attributes in future iterations) and save the ID.
                        if (hits == 0) {
                            // looking if the parent attribute is in the parentAttributeList
                            if (findIndex(parentAttribeList, currentEntityAttrList[j].id) == -1) {
                                parentAttribeList.push(currentEntityAttrList[j]);
                                currentEntityAttrList[j].newKeyName = "";
                            }
                            if (currentEntityAttrList[j].newKeyName == "") {
                                currentEntityAttrList[j].newKeyName += attrList[k].name;
                            } else {
                                currentEntityAttrList[j].newKeyName += " " + attrList[k].name;
                            }
                            if (currentEntityAttrList[j].state != 'primary' &&
                                currentEntityAttrList[j].state != 'candidate'
                            ) {
                                currentRow.push(attrList[k]);
                            }
                            currentEntityAttrList.push(attrList[k]);
                            idList.push(attrList[k].id);
                        }
                    }
                }
            }
        }
        //Push list with entity at index 0 followed by its attributes
        ERAttributeData.push(currentRow);
    }
    const strongEntityList = formatERStrongEntities(ERAttributeData);
    let weakEntityList = formatERWeakEntities(ERAttributeData);

    // Iterate over every strong entity
    for (let i = 0; i < strongEntityList.length; i++) {
        const visitedList = [];
        queue = []; // Queue for each entity's relation
        queue.push(strongEntityList[i][0]); // Push in the current entity
        // Loop while queue isn't empty
        while (queue.length > 0) {
            current = queue.shift(); // Get current entity by removing first entity in queue
            // For current entity, iterate through every relation
            for (let j = 0; j < ERRelationData.length; j++) {
                // Check if relation is valid, (relation, entity1, entity2)
                if (ERRelationData[j].length >= 3) {
                    if (ERRelationData[j][0].state == 'weak') {
                        let visited = false;    // Boolean representing if the current entity has already been visited
                        for (let v = 0; v < visitedList.length; v++) {
                            if (current.id == visitedList[v].id) {
                                visited = true;
                                break;
                            }
                        }
                        // If current entity is not visited
                        if (!visited) {
                            // Check if current is strong / normal
                            if (current.state == 'normal') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    // Iterate through key list
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                }
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][1][0]); // Push in entity to queue
                                }
                            }
                            //Check if current is weak
                            else if (current.state == 'weak') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[l][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]) // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                    }
                                }
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][1][0].id == visitedList[v].id) {//|| ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[i][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]); // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][1][0]); // Push in entity queue
                                    }
                                }
                            }
                        }
                    }
                }
            }
            visitedList.push(current);
        }
    }
    const tempWeakList = [];
    // Update the weak entity list to accomodate the new list of weak keys
    for (let i = 0; i < weakEntityList.length; i++) {
        row = []; // New formatted weak entity row
        row.push(weakEntityList[i][0]); // Push in weak entity, as usual, [0] is entity
        row.push([]); // Push in empty list to contain the keys
        // In the weak entity's key list, iterate and check if current is an array
        for (let j = 0; j < weakEntityList[i][1].length; j++) {
            if (Array.isArray(weakEntityList[i][1][j])) {
                const strongWeakKEy = []; // List that will have the the entities and strong/weak keys required
                current = weakEntityList[i][1][j]; // Select the first list for the current entity
                queue = []; // Queue for search
                queue.push(current); // Insert current to queue
                // Loop until the queue is empty and at the same time, keep going deeper until the last list has been checked
                while (queue.length > 0) {
                    const temp = queue.shift(); // Remove from queue and store in temp
                    // Check if algorithm should go deeper, if the last element is an array, go deeper
                    if ((temp[temp.length - 1].length > 0)) {
                        //Iterate through the list, push every attribute
                        for (let k = 0; k < temp.length - 1; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                        queue.push(temp[temp.length - 1]); // Push in list into queue
                    } else {
                        //Iterate through the list, push every attribute
                        for (let k = 0; k < temp.length; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                    }
                }
                row[1].push(strongWeakKEy); // Push in the created strong key
            }
            // If current element is not a list, push
            else {
                row[1].push(weakEntityList[i][1][j]); // Push in key
            }
        }
        //Iterate through the entity's list and push in normal and multivalued attributes
        for (let j = 0; j < weakEntityList[i].length; j++) {
            // If not array, check if normal or multivalued
            if (!Array.isArray(weakEntityList[i][j])) {
                if (weakEntityList[i][j].state == 'normal') {
                    row.push(weakEntityList[i][j]);
                } else if (weakEntityList[i][j].state == 'multiple') {
                    row.push(weakEntityList[i][j]);
                }
            }
        }
        tempWeakList.push(row);
    }
    weakEntityList = tempWeakList; // Update the values in the weakEntity list

    const allEntityList = strongEntityList.concat(weakEntityList); // Add the two list together

    //Iterate through all relations
    for (let i = 0; i < ERRelationData.length; i++) {
        if (ERRelationData[i].length >= 3) {
            const foreign = []; // Array with entities foreign keys
            // Case 1, two strong entities in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { //MANY to ONE relation, key from the ONE is foreign for MANY, case 1
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push(ERRelationData[i][1][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 2, two weak entities in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { // ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { // MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') { // MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 3, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 4, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
        }
    }
    // Iterate and add each entity's foreign attribute to the correct place
    for (let i = 0; i < ERForeignData.length; i++) {
        // Iterate throught all entities
        for (let j = 0; j < allEntityList.length; j++) {
            // Check if correct entity were found
            if (ERForeignData[i][0].id == allEntityList[j][0].id) {
                row = [];
                // Push in every foreign attribute
                for (let k = 1; k < ERForeignData[i].length; k++) {
                    row.push(ERForeignData[i][k]); // Push in entity
                }
                allEntityList[j].push(row); // Push in list
            }
        }
    }
    // Actual creating the string. Step one, strong / normal entities
    for (let i = 0; i < allEntityList.length; i++) {
        currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'normal') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            let existPrimary = false; // Determine if a primary key exist
            // ITerate and determine if primary keys are present
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (allEntityList[i][1][j].state == 'primary') {
                    existPrimary = true;
                    break;
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                // Print only primary keys if at least one is present
                if (existPrimary) {
                    if (allEntityList[i][1][j].state == 'primary') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
                //Print only candidate keys if no primary keys are present
                if (!existPrimary) {
                    if (allEntityList[i][1][j].state == 'candidate') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            if (allEntityList[i][j].newKeyName == undefined) {
                                currentString += `${allEntityList[i][j].name}, `;
                            }
                        }
                    }
                }
                lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        // Makes sure only entities with attributes are affected.
                        if(allEntityList[i][lastList][k].length > 0){
                            currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                            // Iterate through all the lists with foreign keys
                            for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                                // If element is array, aka strong key for weak entity
                                if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                    for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                        currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                    }
                                } else {
                                    currentString += `${allEntityList[i][lastList][k][l].name}`;
                                }
                            }
                            currentString += `</span>, `;
                        }
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    for (let i = 0; i < allEntityList.length; i++) {
        currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'weak') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (!Array.isArray(allEntityList[i][1][j])) {
                    // Print only weakKeys
                    if (allEntityList[i][1][j].state == 'weakKey') {
                        currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                    }
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (Array.isArray(allEntityList[i][1][j])) {
                    currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
                    for (let k = 0; k < allEntityList[i][1][j].length; k++) {
                        currentString += `${allEntityList[i][1][j][k].name}`;
                    }
                    currentString += `</span>, `;
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
                lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList]) && lastList != 1) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            } else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    // Iterate through ERForeignData to find many to many relation
    for (let i = 0; i < ERForeignData.length; i++) {
        // If relation is exist in ERForeignData
        if (ERForeignData[i][0].kind == elementTypesNames.ERRelation) {
            currentString = '';
            currentString += `<p>${ERForeignData[i][0].name} (`; // Push in relation's name
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add left side of relation
            for (let j = 0; j < ERForeignData[i][1].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][1][j])) {
                    for (let l = 0; l < ERForeignData[i][1][j].length; l++) {
                        currentString += `${ERForeignData[i][1][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][1][j].name}`;
                }
            }
            currentString += `</span>, `;
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add right side of relation
            for (let j = 0; j < ERForeignData[i][2].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][2][j])) {
                    for (let l = 0; l < ERForeignData[i][2][j].length; l++) {
                        currentString += `${ERForeignData[i][2][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][2][j].name}`;
                }
            }
            currentString += `</span>`;
            currentString += `)</p>`;
            stringList.push(currentString)
        }
    }
    // Adding multi-valued attributes to the string
    for (let i = 0; i < allEntityList.length; i++) {
        for (let j = 2; j < allEntityList[i].length; j++) {
            // Write out multi attributes
            if (allEntityList[i][j].state == 'multiple') {
                // add the multiple attribute as relation
                let multipleString = `<p>${allEntityList[i][j].name}( <span style='text-decoration:underline black solid 2px;'>`;
                // add keys from the entity the multiple attribute belongs to
                for (let k = 0; k < allEntityList[i][1].length; k++) {
                    // add the entity the key comes from in the begining of the string
                    multipleString += `${allEntityList[i][0].name}`;
                    // If element is array, aka strong key for weak entity
                    if (Array.isArray(allEntityList[i][1][k])) {
                        for (let l = 0; l < allEntityList[i][1][k].length; l++) {
                            multipleString += `${allEntityList[i][1][k][l].name}`;
                        }
                    } else {
                        multipleString += `${allEntityList[i][1][k].name}`;
                    }
                    multipleString += `, `;
                }
                // add the multiple attribute in the relation
                multipleString += `${allEntityList[i][j].name}`;
                multipleString += `</span>)</p>`;
                stringList.push(multipleString);
            }
        }
    }
    //Add each string element in stringList[] into a single string.
    let stri = "";
    for (let i = 0; i < stringList.length; i++) {
        stri += String(stringList[i] + "\n\n");
    }
    //if its empty, show a message instead.
    if (stri == "") {
        stri = "The feature you are trying to use is linked to ER tables and it appears you do not have any ER elements placed. Please place an ER element and try again."
    }
    return stri;
}

/**
 * @description Generates the string that contains the current State Diagram info.
 * @returns Connected State Diagram in the form of a string.
 */
function generateStateDiagramInfo() {
    const ENTITY = 0, SEEN = 1, LABEL = 2;
    const stateInitial = [];
    const stateFinal = [];
    const stateSuper = [];
    const stateElements = [];
    const stateLines = [];
    const queue = [];
    let output = "";
    let re = new RegExp("\\[.+]");
    // Picks out the lines of type "State Diagram" and place it in its local array.
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].type == entityType.SD) {
            stateLines.push(lines[i]);
        }
    }

    // Picks out the entities related to State Diagrams and place them in their local arrays.
    for (let i = 0; i < data.length; i++) {
        if (data[i].kind == elementTypesNames.SDEntity) {
            stateElements.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLInitialState) {
            stateInitial.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLFinalState) {
            stateFinal.push([data[i], true]);
        } else if (data[i].kind == elementTypesNames.UMLSuperState) {
            stateSuper.push([data[i], false]);
        }
    }

    // Initialises the BFS by adding the Initial states to the queue.
    for (let i = 0; i < stateInitial.length; i++) {
        stateInitial[i][SEEN] = true;
        queue.push(stateInitial[i]);
    }

    // Loop through all entities that are connected.
    while (queue.length > 0) {
        let head = queue.shift();
        const connections = [];
        // Finds all entities connected to the current "head" and adds line labels to a list.
        for (let i = 0; i < stateLines.length; i++) {
            if (stateLines[i].fromID == head[ENTITY].id) {
                for (let j = 0; j < stateElements.length; j++) {
                    if (stateLines[i].toID == stateElements[j][ENTITY].id) {
                        stateElements[j][LABEL] = stateLines[i].label;
                        connections.push(stateElements[j]);
                    }
                }
                for (let j = 0; j < stateFinal.length; j++) {
                    if (stateLines[i].toID == stateFinal[j][ENTITY].id) {
                        stateFinal[j][LABEL] = stateLines[i].label;
                        connections.push(stateFinal[j]);
                    }
                }
                for (let j = 0; j < stateSuper.length; j++) {
                    if (stateLines[i].toID == stateSuper[j][ENTITY].id) {
                        stateSuper[j][LABEL] = stateLines[i].label;
                        connections.push(stateSuper[j]);
                    }
                }
            }
        }
        // Add any connected entity to the output string, and if it has not been "seen" it is added to the queue.
        for (let i = 0; i < connections.length; i++) {
            if (connections[i][LABEL] == undefined || connections[i][LABEL].trim() === "") {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}"</p>`;
            } else if (re.test(connections[i][LABEL])) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with guard "${connections[i][LABEL]}"</p>`;
            } else {
                output += `<p>"${escapeHtml(head[ENTITY].name)}" goes to "${escapeHtml(connections[i][ENTITY].name)}" with label "${escapeHtml(connections[i][LABEL])}"</p>`;
            }
            if (connections[i][SEEN] === false) {
                connections[i][SEEN] = true;
                queue.push(connections[i]);
            }
        }
    }
    // Adds additional information in the view.
    output += `<p>Initial States: ${stateInitial.length}</p>`;
    output += `<p>Final States: ${stateFinal.length}</p>`;
    output += `<p>Super States: ${stateSuper.length}</p>`;
    output += `<p>SD States: ${stateElements.length}</p>`;
    output += `<p>Lines: ${stateLines.length}</p>`;

    //if no state diagram exists, return a message to the user instead.
    if ((stateLines.length == 0) && (stateElements.length == 0) && (stateInitial.length == 0) && (stateFinal.length == 0) && (stateSuper.length == 0)) {
        output = "The feature you are trying to use is linked to state diagrams and it appears you do not have any state elements placed. Please place a state element and try again."
    }
    return output;
}

/**
 * @description Formats a list of strong/normal entities and their attributes.
 * @param {Array} ERDATA A list of all entities and their attributes
 * @returns A formated list of all strong/normal entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERStrongEntities(ERData) {
    const temp = []; // The formated list of strong/normal entities
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'normal') {
            const row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it is always position zero
            const keys = []; // The key attributes (primary, candidate and weakKey)
            // Pushing in weak keys last to ensure that the first key in a strong/normal entity isn't weak
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }
            }
            // Pushing in remaining multivalued attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'multiple') {
                    row.push(ERData[i][j]);
                }
            }
            temp.push(row); // Pushing the formated row to the temp list
        }
    }
    return temp;
}

/**
 * @description Formats a list of weak entities and their attributes.
 * @param {Array} ERDATA A list of all entities and it's attributes
 * @returns A formated list of all weak entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERWeakEntities(ERData) {
    const temp = []; // The formated list of weak entities
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'weak') {
            const row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            const keys = []; // The key attributes (weakKey, primary and candidate)
            // Pushing in weak keys first to ensure that the first key in a weak entity is weak
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'weakKey') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'primary') {
                    keys.push(ERData[i][j]);
                }
            }
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'candidate') {
                    keys.push(ERData[i][j]);
                }
            }
            row.push(keys); // Pushing all keys from the entity
            // Pushing in remaining attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'normal') {
                    row.push(ERData[i][j]);
                }
            }
            // Pushing in remaining multivalued attributes
            for (let j = 1; j < ERData[i].length; j++) {
                if (ERData[i][j].state == 'multiple') {
                    row.push(ERData[i][j]);
                }
            }
            temp.push(row); // Pushing the formated row to the temp list
        }
    }
    return temp;
}


/**
 * @description Tests if there are varying fill and/or stroke colors in the selected elements
 */
function multipleColorsTest() {
    if (context.length > 1) {
        const fill = context[0].fill;
        let varyingFills = false;
        for (let i = 0; i < context.length; i++) {
            // Checks if there are varying fill colors, but not if varying colors have already been detected
            if (fill != context[i].fill && !varyingFills) {
                const button = document.getElementById("colorMenuButton1");
                button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                const textNode = document.createTextNode("Multiple Color Values");
                button.insertBefore(textNode, button.firstChild);
                varyingFills = true;
            }
        }
    }
}

/**
 * @description Applies new changes to line attributes in the data array of lines.
 */
function changeLineProperties() {        
    // updates the line
    for (const [key, value] of Object.entries(StateChange.GetLineProperties())) {
        contextLine[0][key] = value;
    }
    // save all the changes
    stateMachine.save(contextLine[0].id, StateChange.ChangeTypes.LINE_ATTRIBUTE_CHANGED);
    showdata();
}