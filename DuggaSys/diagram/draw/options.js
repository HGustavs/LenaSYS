/**
 * @description Generates fields for all properties of the currently selected element/line in the context.
 * These fields can be used to modify the selected element/line.
 */
function generateContextProperties() {
    let str = '';
    const element = context[0];
    const line = contextLine[0];
    let propSet = document.getElementById("propertyFieldset");
    let menuSet = document.getElementsByClassName('options-section');

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
        str += saveButton('toggleEntityLocked();', `id='lockbtn'`, locked ? "Unlock" : "Lock");
    }
    propSet.innerHTML = str;
    multipleColorsTest();
}
const showProperties = (show, propSet, menuSet) => {
    let a = (show) ? 'options-fieldset-show' : 'options-fieldset-hidden';
    let b = (!show) ? 'options-fieldset-show' : 'options-fieldset-hidden';
    propSet.classList.add(a);
    propSet.classList.remove(b);
    for (let i = 0; i < menuSet.length; i++) {
        menuSet[i].classList.add(b);
        menuSet[i].classList.remove(a);
    }
}

const textarea = (name, property, element) => {
    return `<div style='color:white'>${name}</div>
            <textarea 
                id='elementProperty_${property}' 
                rows='4' style='width:98%;resize:none;'
            >${textboxFormatString(element[property])}</textarea>`;
}

const nameInput = (element) => {
    return `<div style='color:white'>Name</div>
            <input 
                id='elementProperty_name' 
                type='text' 
                value='${element.name}' 
                onfocus='propFieldSelected(true)' 
                onblur='propFieldSelected(false)'
            >`;
}

const saveButton = (functions, id='', value='Save') => {
    return `<br><br>
            <input id='${id}'
                type='submit' value='${value}' class='saveButton' 
                onclick="${functions}"
            >`;
}
const dropdown = (name, def, object, element) => {
    let options = '';
    let current = element.state ?? def;
    Object.values(object).forEach(value => {
        let s = (current == value) ? `selected ="selected"` : '';
        options += `<option ${s} value='${value}'>${value}</option>`;
    });
    return `<div style='color:white'>${name}</div>
            <select id="propertySelect">${options}</select>`;
}
const colorSelection = (element) => {
    return `<div style="white">Color</div> 
            <button 
                id="colorMenuButton1" 
                class="colorMenuButton" 
                onclick="toggleColorMenu('colorMenuButton1')" 
                style="background-color:${element.fill}"
            >
                <span id="BGColorMenu" class="colorMenu"></span>
            </button>`;
}

function drawElementProperties(element) {
    let str = '';
    // Type dropdown
    if (element.canChangeTo && element.kind != elementTypesNames.ERAttr) {
        let single = `<option selected="selected" value='${element.type}'>${element.type}</option>`;
        let options = (elementHasLines(element)) ? single : option(element.canChangeTo, element.type);
        str += `<div style='color:white'>Type</div>`
        str += select('typeSelect', options, false, false);
    }
    //TODO in the future, this can be implemented as part of saveProperties.
    switch (element.kind) {
        case elementTypesNames.EREntity:
            str += nameInput(element);
            str += dropdown('Variant', 'normal', entityState, element);
            break;
        case elementTypesNames.UMLEntity:
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

const option = (object, icon) => {
    let result = '';
    Object.values(object).forEach(i => {
        let selected = (i == icon) ? 'selected' : '';
        result += `<option value='${i}' ${selected}>${i}</option>`;
    });
    return result;
}

const radio = (line, arr) => {
    let result = `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
    arr.forEach(lineKind => {
        let checked = (line.kind == lineKind) ? 'checked' : '';
        result += `<input type="radio" id="lineRadio${lineKind}" name="lineKind" value='${lineKind}' ${checked} onchange='changeLineProperties();'>
                   <label for='lineRadio${lineKind}'>${lineKind}</label>
                   <br>`
    });    
    return result;
}

const select = (id, options, inclNone=true, inclChange=true) => {
    let none = (inclNone) ? `<option value=''>None</option>` : '';
    let change = (inclChange) ? `onChange="changeLineProperties();"` : '';
    return `<select id='${id}' ${change}>
                ${none}
                ${options}
            </select>`;
}

const lineLabel = (id, placeholder, value) => {
    return `<input id="${id}" maxlength="50" type="text" placeholder="${placeholder}" value="${value ?? ''}"/>`;
}

function drawLineProperties(line) {
    let str = '';
    switch (line.type) {
        case entityType.ER:
            str += radio(line, [lineKind.NORMAL, lineKind.DOUBLE]);
            str += `<label style="display: block">Cardinality:`;
            let optER;
            Object.keys(lineCardinalitys).forEach(cardinality => {
                let selected =  (line.cardinality == cardinality) ? 'selected' : '';
                optER += `<option value='${cardinality}' ${selected}>${lineCardinalitys[cardinality]}</option>`;
            });
            str += select('propertyCardinality', optER, true, false);
            str += `</label>`;
            str += includeLabel(line)
            break;
        case entityType.UML:
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += includeLabel(line);
            str += cardinalityLabels(line);
            str += iconSelection([UMLLineIcons, IELineIcons], line);
            break;
        case entityType.IE:
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += `<span id="lineLabel" ${line.label} /span>`; // Needed for cardinality, unsure why
            str += cardinalityLabels(line);
            str += iconSelection([UMLLineIcons, IELineIcons], line);
            break;
        case entityType.SD:
            let optSD = option(SDLineType, line.innerType);
            str += includeLabel(line)
            str += iconSelection([SDLineIcons], line);
            str += `<label style="display: block">Line Type:</label>`;
            str += select('lineType', optSD, false);
            break;
        case entityType.SE:  
            str += includeSELabel(line)
            str += radio(line, [lineKind.NORMAL, lineKind.DASHED]);
            str += iconSelection([SELineIcons], line);
            str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
            break;
    }
    str += saveButton('changeLineProperties();');
    return str;
}

const iconSelection = (arr, line) => {
    let sOptions = '';
    let eOptions = '';
    arr.forEach(object => {
        sOptions += option(object, line.startIcon)
    });
    arr.forEach(object => {
        eOptions += option(object, line.endIcon)
    });
    return `<label style="display: block">Icons:</label>`
        + select('lineStartIcon', sOptions)
        + select('lineEndIcon', eOptions);
}

const includeLabel = (line) => {
    return `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>
                    <div>
                        <button 
                            id="includeButton" type="button" 
                            onclick="setLineLabel(); changeLineProperties();"
                        >&#60&#60include&#62&#62</button>
                    </div>`
        + lineLabel('lineLabel', 'Label', line.label);
}

const includeSELabel = (line) => {
    return '<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>'
        + lineLabel('lineLabel', 'Label', line.label);
}

const cardinalityLabels = (line) => {
    return `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`
        + lineLabel('lineStartLabel', 'Start cardinality', line.startLabel)
        + lineLabel('lineEndLabel', 'End cardinality', line.endLabel);
}

/**
 * @description function for include button to the options panel,writes out << Include >>
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
    var content = '';
    for (let i = 0; i < arr.length; i++) {
        content += arr[i] + '\n';
    }
    return content;
}
/**
 * @description Generates the string which holds the ER table for the current ER-model/ER-diagram.
 * @returns Current ER table in the form of a string.
 */
function generateErTableString() {
    //TODO: When functionality is complete, try to minimize the overall space complexity, aka try to extract
    //only useful information from entities, attributes and relations.

    var entityList = [];    //All EREntities currently in the diagram
    var attrList = [];      //All ERAttributes currently in the diagram
    var relationList = [];  //All ERRelations currently in the diagram
    var stringList = [];    //List of strings where each string holds the relevant data for each entity

    /**
     * @description Multidimensional array containing data of each entity and their attribute. Index[0] is always the element
     * @structure ERAttributeData[i] = [entityObject, attributeObject1, ..., attributeObjectN]
     */
    var ERAttributeData = [];
    /**
     * @description Multidimensional array containing foreign keys for every entity. The owning entity is the entity where the foreign keys are added
     * @structure   ERForeignData[i] = [owningEntityObject, [otherEntityObject, foreignAttributeObject1, ..., foreignAttributeObjectN]]
     */
    var ERForeignData = [];
    /**
     * @description Multidimensional array containing relation and the connected entities. Also stores the cardinality and kind for connected entity
     * @structure   ERRelationData[i] = [relationObject, [entityObject, lineCardinality, lineKind], [otherEREntityObject, otherLineCardinality, otherLineKind]]
     */
    var ERRelationData = [];

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
        var currentRelationList = [];
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
        var currentRow = [entityList[i]];
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
        var currentEntityAttrList = [];
        var idList = [];
        for (let j = 0; j < lineList.length; j++) {
            for (let h = 0; h < attrList.length; h++) {
                if (attrList[h].id == lineList[j].fromID || attrList[h].id == lineList[j].toID) {
                    currentEntityAttrList.push(attrList[h]);
                    currentRow.push(attrList[h]);
                    idList.push(attrList[h].id);
                }
            }
        }
        var parentAttribeList = []; //list of parent attributes

        for (let j = 0; j < currentEntityAttrList.length; j++) {
            //For each attribute connected to the current entity, identify if other attributes are connected to themselves.
            var attrLineList = [];
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
                        var hits = 0;
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
    var strongEntityList = formatERStrongEntities(ERAttributeData);
    var weakEntityList = formatERWeakEntities(ERAttributeData);

    // Iterate over every strong entity
    for (let i = 0; i < strongEntityList.length; i++) {
        var visitedList = []; // A list which contains entities that has been vistited in this codeblock
        var queue = []; // Queue for each entity's relation
        queue.push(strongEntityList[i][0]); // Push in the current entity
        // Loop while queue isn't empty
        while (queue.length > 0) {
            var current = queue.shift(); // Get current entity by removing first entity in queue
            // For current entity, iterate through every relation
            for (let j = 0; j < ERRelationData.length; j++) {
                // Check if relation is valid, (relation, entity1, entity2)
                if (ERRelationData[j].length >= 3) {
                    if (ERRelationData[j][0].state == 'weak') {
                        var visited = false;    // Boolean representing if the current entity has already been visited
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
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
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
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
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
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
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
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
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
    var tempWeakList = [];
    // Update the weak entity list to accomodate the new list of weak keys
    for (let i = 0; i < weakEntityList.length; i++) {
        var row = []; // New formatted weak entity row
        row.push(weakEntityList[i][0]); // Push in weak entity, as usual, [0] is entity
        row.push([]); // Push in empty list to contain the keys
        // In the weak entity's key list, iterate and check if current is an array
        for (let j = 0; j < weakEntityList[i][1].length; j++) {
            if (Array.isArray(weakEntityList[i][1][j])) {
                var strongWeakKEy = []; // List that will have the the entities and strong/weak keys required
                var current = weakEntityList[i][1][j]; // Select the first list for the current entity
                var queue = []; // Queue for search
                queue.push(current); // Insert current to queue
                // Loop until the queue is empty and at the same time, keep going deeper until the last list has been checked
                while (queue.length > 0) {
                    var temp = queue.shift(); // Remove from queue and store in temp
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

    var allEntityList = strongEntityList.concat(weakEntityList); // Add the two list together

    //Iterate through all relations
    for (let i = 0; i < ERRelationData.length; i++) {
        if (ERRelationData[i].length >= 3) {
            var foreign = []; // Array with entities foreign keys
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
                var row = [];
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
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'normal') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            var existPrimary = false; // Determine if a primary key exist
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
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
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
    for (let i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
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
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
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
            var currentString = '';
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
                var multipleString = `<p>${allEntityList[i][j].name}( <span style='text-decoration:underline black solid 2px'>`;
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
    var stri = "";
    for (let i = 0; i < stringList.length; i++) {
        stri += new String(stringList[i] + "\n\n");
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
    let re = new RegExp("\\[.+\\]");
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
            if (connections[i][LABEL] == undefined) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}"</p>`;
            } else if (re.test(connections[i][LABEL])) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with guard "${connections[i][LABEL]}"</p>`;
            } else {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with label "${connections[i][LABEL]}"</p>`;
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
 * @param ERDATA A list of all entities and it's attributes
 * @returns A formated list of all strong/normal entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERStrongEntities(ERData) {
    var temp = []; // The formated list of strong/normal entities
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'normal') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (primary, candidate and weakKey)
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
 * @param ERDATA A list of all entities and it's attributes
 * @returns A formated list of all weak entities and their attributes. Keys for every entity are stored in [entityRow][1].
 */
function formatERWeakEntities(ERData) {
    var temp = []; // The formated list of weak entities
    // Iterating through all entities
    for (let i = 0; i < ERData.length; i++) {
        if (ERData[i][0].state == 'weak') {
            var row = []; // The formated row
            row.push(ERData[i][0]); // Pushing in the current entity in row so it it's always position zero
            var keys = []; // The key attributes (weakKey, primary and candidate)
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
 * @description Event function triggered whenever a property field is pressed in the options panel. This will appropriatly update the current propFieldState variable.
 * @param {Boolean} isSelected Boolean value representing if the selection was ACTIVATED or DEACTIVATED.
 * @see propFieldState For seeing if any fieldset is currently selected.
 */
function propFieldSelected(isSelected) {
    propFieldState = isSelected;
}

/**
 * @description Tests if there are varying fill and/or stroke colors in the selected elements
 */
function multipleColorsTest() {
    if (context.length > 1) {
        var fill = context[0].fill;
        var varyingFills = false;
        for (let i = 0; i < context.length; i++) {
            // Checks if there are varying fill colors, but not if varying colors have already been detected
            if (fill != context[i].fill && !varyingFills) {
                var button = document.getElementById("colorMenuButton1");
                button.style.backgroundColor = "rgba(128, 128, 128, 0.8)";
                var textNode = document.createTextNode("Multiple Color Values");
                button.insertBefore(textNode, button.firstChild);
                varyingFills = true;
            }
        }
    }
}

/**
 * Applies new changes to line attributes in the data array of lines.
 */
function changeLineProperties() {
    const line = contextLine[0];
    const changes = {};

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
    if ((line.type == entityType.UML) || (line.type == entityType.IE)) {
        changes.startLabel = document.getElementById("lineStartLabel").value;
        changes.endLabel = document.getElementById("lineEndLabel").value;
        changes.startIcon = document.getElementById("lineStartIcon").value;
        changes.endIcon = document.getElementById("lineEndIcon").value;
    }
    if (line.type == entityType.SD) {
        changes.innerType = document.getElementById("lineType").value;
        changes.startIcon = document.getElementById("lineStartIcon").value;
        changes.endIcon = document.getElementById("lineEndIcon").value;
    }
    if (line.type == entityType.SE) {
        changes.startIcon = document.getElementById("lineStartIcon").value;
        changes.endIcon = document.getElementById("lineEndIcon").value;
    }

    // updates the line
    for (const [key, value] of Object.entries(changes)) {
        line[key] = value;
    }
    
    // save all the changes
    stateMachine.save(StateChangeFactory.ElementAttributesChanged(line.id, changes), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);

    showdata();
}

/*function changeLineProperties() {
    let label = document.getElementById("lineLabel");
    let startLabel = document.getElementById("lineStartLabel");
    let endLabel = document.getElementById("lineEndLabel");
    let startIcon = document.getElementById("lineStartIcon");
    let endIcon = document.getElementById("lineEndIcon");
    let lineType = document.getElementById("lineType");
    let cardinality = document.getElementById('propertyCardinality');
    let line = contextLine[0];

    let radio = [
        document.getElementById("lineRadioNormal"),
        document.getElementById("lineRadioDouble"),
        document.getElementById("lineRadioDashed"),
        document.getElementById("lineRadioRecursive"),
    ];
    radio.forEach(r => {
        if (r && r.checked && line.kind != r.value) {
            line.kind = r.value;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(line.id, {kind: r.value}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
            displayMessage(messageTypes.SUCCESS, 'Successfully saved');
        }
    });

    if (cardinality) {
        if (cardinality.value == "") {
            delete line.cardinality;
            stateMachine.save(StateChangeFactory.ElementAttributesChanged(contextLine[0].id, {cardinality: undefined}), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
        } else {
            changeAttribute(line, 'cardinality', cardinality, {cardinality: cardinality.value});
        }
    }
    if (label) {
        changeAttribute(line, 'label', label, {label: label.value});
    }

    if ((line.type == entityType.UML) || (line.type == entityType.IE)) {
        changeAttribute(line, 'startLabel', startLabel, {startLabel: startLabel.value});
        changeAttribute(line, 'endLabel', endLabel, {endLabel: endLabel.value});
        changeAttribute(line, 'startIcon', startIcon, {startIcon: startIcon.value});
        changeAttribute(line, 'endIcon', endIcon, {endIcon: endIcon.value});
    }
    if (line.type == entityType.SD) {
        changeAttribute(line, 'innerType', lineType, {innerType: lineType.value});
        changeAttribute(line, 'startIcon', startIcon, {startIcon: startIcon.value});
        changeAttribute(line, 'endIcon', endIcon, {endIcon: endIcon.value});
    }
    if (line.type == entityType.SE) {
        changeAttribute(line, 'startIcon', startIcon, {startIcon: startIcon.value});
        changeAttribute(line, 'endIcon', endIcon, {endIcon: endIcon.value});
    }
    showdata();
}

const changeAttribute = (line, attribute, updated, list) => {
    if (line[attribute] != updated.value) {
        line[attribute] = updated.value;
        stateMachine.save(StateChangeFactory.ElementAttributesChanged(line.id, list), StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    }
}*/
