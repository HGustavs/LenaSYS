/**
 * @description Add an line between two elements. Also checks if the line is connected between right elements and is not exceed the allowed amount.
 * @param {Object} fromElement Element that the line is from.
 * @param {Object} toElement Element that the line is to.
 * @param {String} kind The kind of line that should be added.
 * @param {boolean} stateMachineShouldSave Should this line be added to the stateMachine.
 */
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true, successMessage = true, cardinal) {
    // All lines should go from EREntity, instead of to, to simplify offset between multiple lines.
    if (toElement.kind == "EREntity"){
        var tempElement = toElement;
        toElement = fromElement;
        fromElement = tempElement;
    }
    //If line is comming to ERRelation from weak entity it adds double line, else it will be single
    if (toElement.kind == "ERRelation") {
        if (fromElement.state == "weak") {
            var tempElement = toElement;
            toElement = fromElement;
            fromElement = tempElement;
            kind = "Double";
        } else {
            var tempElement = toElement;
            toElement = fromElement;
            fromElement = tempElement;
        }
    }
    // Prevent a line to be drawn between two ER entity.
    if (fromElement.kind == elementTypesNames.EREntity && toElement.kind == elementTypesNames.EREntity) {
        displayMessage(messageTypes.ERROR, `Not possible to draw a line between: ${fromElement.name}- and ${toElement.name}-element`);
        return;
    }

    // Prevent a line to be drawn between elements of different types except the note type
    if (fromElement.type != toElement.type && fromElement.type !== 'NOTE' && toElement.type !== 'NOTE') {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines between: ${fromElement.type}- and ${toElement.type}-elements`);
        return;
    }
    //checks if a line is drawn to UMLInitialState.
    if (toElement.kind == elementTypesNames.UMLInitialState) {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines to: ${toElement.kind}`);
        return;
    } else if (fromElement.kind == elementTypesNames.UMLFinalState) {
        displayMessage(messageTypes.ERROR, `Not possible to draw lines from: ${fromElement.kind}`);
        return;
    }

    // Helps to decide later on, after passing the tests after this loop and the next two loops if the value should be added
    var exists = false;
    for (let i = 0; i < allAttrToEntityRelations.length; i++) {
        if (toElement.id == allAttrToEntityRelations[i]) {
            exists = true;
            break;
        }
        if (fromElement.id == allAttrToEntityRelations[i]) {
            exists = true;
            break;
        }
    }

    // Adding elements to the array that carries attributes connected to attributes without being directly connected to an entity or relation
    for (let i = 0; i < allAttrToEntityRelations.length; i++) {
        if (fromElement.kind === elementTypesNames.ERAttr && toElement.kind === elementTypesNames.ERAttr && fromElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = toElement.id;
            attrViaAttrCounter++;
            break;
        } else if (fromElement.kind === elementTypesNames.ERAttr && toElement.kind === elementTypesNames.ERAttr && toElement.id == allAttrToEntityRelations[i]) {
            attrViaAttrToEnt[attrViaAttrCounter] = fromElement.id;
            attrViaAttrCounter++;
            break;
        }
    }

    // Adding attributes to the array that only carries attributes directly connected to entities or relations
    if (!exists) {
        if (toElement.kind == elementTypesNames.ERRelation) {
            allAttrToEntityRelations[countUsedAttributes] = fromElement.id;
            countUsedAttributes++;
        } else {
            allAttrToEntityRelations[countUsedAttributes] = toElement.id;
            countUsedAttributes++;
        }
    }

    // Filter the existing lines and gets the number of existing lines
    var numOfExistingLines = lines.filter(function (line) {
        return (fromElement.id === line.fromID &&
            toElement.id === line.toID ||
            fromElement.id === line.toID &&
            toElement.id === line.fromID)
    }).length;


    // Define a boolean for special case that relation and entity can have 2 lines
    var specialCase = (fromElement.kind === elementTypesNames.ERRelation &&
        toElement.kind === elementTypesNames.EREntity ||
        fromElement.kind === elementTypesNames.EREntity &&
        toElement.kind === elementTypesNames.ERRelation
    );

    // Check rules for Recursive relations
    if (fromElement.kind === elementTypesNames.ERRelation && fromElement.kind == "Normal" || toElement.kind === elementTypesNames.ERRelation && toElement.kind == "Normal") {
        var relationID;
        if (fromElement.kind === elementTypesNames.ERRelation) relationID = fromElement.id;
        else relationID = toElement.id;

        var linesFromRelation = lines.filter(line => {
            return line.fromID == relationID || line.toID == relationID
        });

        var connElemsIds = [];
        linesFromRelation.forEach(line => {
            if (line.fromID == relationID) connElemsIds.push(line.toID);
            else connElemsIds.push(line.fromID);
        });
        var hasRecursive = (connElemsIds.length == 2 && connElemsIds[0] == connElemsIds[1]);
        var hasOtherLines = (numOfExistingLines == 1 && connElemsIds.length >= 2);
        for (let i = 0; i < allAttrToEntityRelations.length; i++) {
            if (allAttrToEntityRelations[i] == fromElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            } else if (allAttrToEntityRelations[i] == toElement.id) {
                allAttrToEntityRelations.splice(i, 1);
                countUsedAttributes--;
                break;
            }
        }
        if (hasRecursive || hasOtherLines) {
            displayMessage(messageTypes.ERROR, "Sorry, that is not possible");
            return;
        }
    }
    // If there is no existing lines or is a special case
    if (numOfExistingLines === 0 || (specialCase && numOfExistingLines <= 1)) {
        var newLine = {
            id: makeRandomID(),
            fromID: fromElement.id,
            toID: toElement.id,
            kind: kind
        };

        // If the new line has an entity FROM or TO, add a cardinality ONLY if it's passed as a parameter.
        if (isLineConnectedTo(newLine, elementTypesNames.EREntity) != null) {
            if (cardinal != undefined) {
                newLine.cardinality = cardinal;
            }
        }
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if (successMessage) displayMessage(messageTypes.SUCCESS, `Created new line between: ${fromElement.name} and ${toElement.name}`);
        return newLine;
    } else {
        displayMessage(messageTypes.ERROR, `Maximum amount of lines between: ${fromElement.name} and ${toElement.name}`);
    }
}

/**
 * @description Allows the line to be processed and edited just before it is created
 * @param {object} line Line to process
 */
function preProcessLine(line) {
    var felem, telem;

    felem = data[findIndex(data, line.fromID)];
    telem = data[findIndex(data, line.toID)];

    //Sets the endIcon of the to-be-created line, if it an State entity
    if ((felem.type === entityType.SD) && (telem.type === entityType.SD)) {
        if (line.kind === 'Recursive') {
            line.endIcon = '';
        } else {
            line.endIcon = 'ARROW';
        }
        line.innerType = SDLineType.STRAIGHT;
    }
}
