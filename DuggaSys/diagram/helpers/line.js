/**
 * @description Add an line between two elements. Also checks if the line is connected between right elements and is not exceed the allowed amount.
 * @param {Object} fromElement Element that the line is from.
 * @param {Object} toElement Element that the line is to.
 * @param {String} kind The kind of line that should be added.
 * @param {boolean} stateMachineShouldSave Should this line be added to the stateMachine.
 */
function addLine(fromElement, toElement, kind, isRecursive = false, stateMachineShouldSave = true, successMessage = true, cardinal) {
    let result;

    if (lineAlwaysFrom.includes(toElement.kind) ||
        lineAlwaysTo.includes(fromElement.kind)
    ) {
        [toElement, fromElement] = [fromElement, toElement];
    }
    let errorMessage = checkConnectionErrors(fromElement, toElement);
    if (errorMessage) {
        displayMessage(messageTypes.ERROR, errorMessage);
        return;
    }
    // Filter the existing lines and gets the number of existing lines
    let numOfExistingLines = lines.filter(function (line) {
        return (
            fromElement.id === line.fromID &&
            toElement.id === line.toID ||
            fromElement.id === line.toID &&
            toElement.id === line.fromID)
    }).length;

    // Define a boolean for special case that relation and entity can have 2 lines
    let specialCase = (
        fromElement.kind === elementTypesNames.ERRelation &&
        toElement.kind === elementTypesNames.EREntity ||
        fromElement.kind === elementTypesNames.EREntity &&
        toElement.kind === elementTypesNames.ERRelation
    );
    // If there is no existing lines or is a special case
    if (numOfExistingLines === 0 || (specialCase && numOfExistingLines === 1)) {
        let newLine = {
            id: makeRandomID(),
            fromID: fromElement.id,
            toID: toElement.id,
            kind: kind,
            recursive: isRecursive  
        };

        // If the new line has an entity FROM or TO, add a cardinality ONLY if it's passed as a parameter.
        if (isLineConnectedTo(newLine, elementTypesNames.EREntity)) {
            if (cardinal) newLine.cardinality = cardinal;
        }
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if (successMessage) displayMessage(messageTypes.SUCCESS, `Created new line between: ${fromElement.name} and ${toElement.name}`);
        result = newLine;

    //separe statement when more than 2 lines are created
    //Mostly the same from above but with a check for 3 lines
    } 
    
    else if(fromElement.kind === elementTypesNames.sequenceActivation || (numOfExistingLines < 3 || (specialCase && numOfExistingLines < 4))){
        let newLine = {
            id: makeRandomID(),
            fromID: fromElement.id,
            toID: toElement.id,
            kind: kind,
            recursive: isRecursive  
        };
        // If the new line has an entity FROM or TO, add a cardinality ONLY if it's passed as a parameter.
        if (isLineConnectedTo(newLine, elementTypesNames.EREntity)) {
            if (cardinal) newLine.cardinality = cardinal;
        }
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if (successMessage) displayMessage(messageTypes.SUCCESS, `Created aditional lines between ${fromElement.name} and ${toElement.name}`);
        result = newLine;
    } else {
        displayMessage(messageTypes.ERROR, `Maximum amount of lines between! ${fromElement.name} and ${toElement.name}`);
    }
    return result;
}
function checkConnectionErrors(to, from) {
    if (from.id == to.id &&
        (to.kind != elementTypesNames.SDEntity && to.kind != elementTypesNames.UMLEntity && to.kind != elementTypesNames.IEEntity && to.kind != "sequenceActivation")
    ) {
        return `Not possible to draw a line between: ${from.name} and ${to.name}, they are the same element`;
    }
    if (sameTypeError(from, to, sameConnectionForbidden)) {
        return `Not possible to draw a line between: ${from.name}- and ${to.name}-element`;
    }
    if (diffrerentTypeError(from, to)) {
        return `Not possible to draw lines between: ${from.type}- and ${to.type}-elements`;
    }
    if (limitEREntitiesToAttriutes(from, to)) {
        return `ER attributes can only be attached to max 1 entity`;
    }
    if (sequenceTypeError(from, to)) {
        return `Lines in sequence diagram can only be drawn between sequence activations`;
    }
    // Uses to as from elements since the implementation of activation lines is done this way
    if (sequenceDrawError(to)) {
        return `Drawn line is out of bounds`;
    }
    return '';
}


// Checks that the lines are within bounds between two sequence activation elements
function sequenceDrawError(from) {
    
    if (from.kind === elementTypesNames.sequenceActivation) {
        const mouseY = screenToDiagramCoordinates(lastMousePos.x, lastMousePos.y).y;
        const elementTop = from.y;
        const elementBottom = from.y + from.height;
        return elementTop > mouseY|| elementBottom < mouseY;
    }
    return false;
}

function sequenceTypeError(from,to){
    if((from.kind == elementTypesNames.sequenceObject || from.kind == elementTypesNames.sequenceActor) || (to.kind == elementTypesNames.sequenceObject || to.kind == elementTypesNames.sequenceActor)){
        return true;
    }
}
function sameTypeError(from, to, arr) {
    let result = false;
    arr.forEach((type) => {
        if (from.kind == type && to.kind == type) {
            result = true;
        }
    });
    return result;
}

function diffrerentTypeError(from, to) {
    return from.type != to.type && from.type !== 'NOTE' && to.type !== 'NOTE';
}

/**
 * @description Allows the line to be processed and edited just before it is created
 * @param {object} line Line to process
 */
function preProcessLine(line) {
    let felem, telem;

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

/**
 * @description Checks that an ER attribute only have 1 entity attached
 * @param {object} from element line is from
 * @param {object} to element line is to
 * @returns {bool}
 */
const limitEREntitiesToAttriutes = (from, to) => {
    if (from.kind != elementTypesNames.ERAttr && to.kind != elementTypesNames.ERAttr) return false;
    const element = (from.kind == elementTypesNames.ERAttr) ? from : to;
    let connectedLines = 0;
    for (let line of lines) {
        if (line.fromID == element.id || line.toID == element.id) {
            connectedLines++;
        }
    }
    return connectedLines > 0;
};
