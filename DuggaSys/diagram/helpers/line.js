/**
 * @description Add an line between two elements. Also checks if the line is connected between right elements and is not exceed the allowed amount.
 * @param {Object} fromElement Element that the line is from.
 * @param {Object} toElement Element that the line is to.
 * @param {String} kind The kind of line that should be added.
 * @param {boolean} stateMachineShouldSave Should this line be added to the stateMachine.
 */
function addLine(fromElement, toElement, kind, stateMachineShouldSave = true, successMessage = true, cardinal) {
    let result;

    if (lineAlwaysFrom.includes(toElement.kind) ||
        lineAlwaysTo.includes(fromElement.kind)
    ) {
        [toElement, fromElement] = [fromElement, toElement];
    }
    //If line is comming to ERRelation from weak entity it adds double line, else it will be single
    if (toElement.kind == elementTypesNames.ERRelation) {
        if (fromElement.state == entityState.WEAK) {
            kind = lineKind.DOUBLE;
        }
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
            offset: 0
        };

        // If the newline is sharing from or to with an existing line and going in same direction add offset to the new line
        for (let line of lines) {
            if (line.fromID === newLine.fromID || line.toID === newLine.toID || 
                line.fromID === newLine.toID || line.toID === newLine.fromID) {
                let lineDirection;
                let diffrenceX = fromElement.x - toElement.x;
                let diffrenceY = fromElement.y - toElement.y;
                if (Math.abs(diffrenceX) > Math.abs(diffrenceY)) {
                    lineDirection = diffrenceX > 0 ? 'LR' : 'RL';
                } else {
                    lineDirection = diffrenceY > 0 ? 'TB' : 'BT';
                }
                
                // check that both are going in the same direction
                if(line.ctype == lineDirection){
                    newLine.offset++;
                }
            }
        }
        
        // If the new line has an entity FROM or TO, add a cardinality ONLY if it's passed as a parameter.
        if (isLineConnectedTo(newLine, elementTypesNames.EREntity)) {
            if (cardinal) newLine.cardinality = cardinal;
        }
        preProcessLine(newLine);
        addObjectToLines(newLine, stateMachineShouldSave);
        if (successMessage) displayMessage(messageTypes.SUCCESS, `Created new line between: ${fromElement.name} and ${toElement.name}`);
        result = newLine;
    } else {
        displayMessage(messageTypes.ERROR, `Maximum amount of lines between: ${fromElement.name} and ${toElement.name}`);
    }
    return result;
}

function checkConnectionErrors(to, from) {
    if (from.id == to.id &&
        (to.kind != elementTypesNames.SDEntity && to.kind != elementTypesNames.UMLEntity && to.kind != elementTypesNames.IEEntity)
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
    return '';
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
