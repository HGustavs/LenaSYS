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

    // Defina a boolean for sequence activation case for sequence diagrams where multiple lines are allowed
    var isSD = (
        fromElement.kind === elementTypesNames.sequenceActivation &&
        toElement.kind === elementTypesNames.sequenceActivation
    );

    // If there is no existing lines or is a special case or is a sequence activation case
    if (numOfExistingLines === 0 || (specialCase && numOfExistingLines === 1) || isSD) {
        let newLine = {
            id: makeRandomID(),
            isSD: false,
            otherLinesCount: 0,
            offsetX: 0,
            offsetY: 0,
            fromID: fromElement.id,
            toID: toElement.id,
            kind: kind
        };

        // If the line is connected to sequence activations you need to allow multiple lines, set isSD case to true
        if (isSD) {
            var linesBetween = lines.filter(function (line) {
                return (fromElement.id === line.fromID &&
                    toElement.id === line.toID ||
                    fromElement.id === line.toID &&
                    toElement.id === line.fromID)
            });

            if (linesBetween.length > 0) {
                x1 = fromElement.x1;
                y1 = fromElement.y1;
                x2 = toElement.x1;
                y2 = toElement.y1;
                newLine.otherLinesCount = linesBetween.length;

                // Calculate differences in x and y coordinates
                var dx = Math.abs(x2 - x1);
                var dy = Math.abs(y2 - y1);
                // Check if the elements are more horizontally, vertically, or diagonally aligned
                if (dx > dy && (Math.abs(dx-dy) > 150)) {
                    // Horizontally aligned, adjust offsetX
                    newLine.offsetY = (x2 > x1) ? (linesBetween.length *10) : -(linesBetween.length *10);
                    newLine.offsetX = 0;
                } else if (dx < dy && (Math.abs(dy-dx) > 150)) {
                    // Vertically aligned, adjust offsetY
                    newLine.offsetY = 0;
                    newLine.offsetX = (y2 > y1) ? (linesBetween.length *10) : -(linesBetween.length *10);
                } else {
                    // Diagonally aligned, adjust both offsetX and offsetY
                    newLine.offsetX = (x2 < x1) ? (linesBetween.length *10) : -(linesBetween.length *10);
                    newLine.offsetY = (y2 > y1) ? (linesBetween.length *10) : -(linesBetween.length *10);
                }
            }


            newLine.isSD = true;
        }

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

/**
 * @description Calculates the correct offset for x and y coordinates for the line to be drawn between two sequence activations.
 * @param {Line} line The line that should be corrected.
 */
function calculateLineOffset(line) {
    // Get the from and to elements
    var fromElement = data[findIndex(data, line.fromID)];
    var toElement = data[findIndex(data, line.toID)];

    if (line.otherLinesCount > 0) {
        x1 = fromElement.x1;
        y1 = fromElement.y1;
        x2 = toElement.x1;
        y2 = toElement.y1;

        // Calculate differences in x and y coordinates
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        // Check if the elements are more horizontally, vertically, or diagonally aligned
        if (dx > dy && (Math.abs(dx-dy) > 150)) {
            // Horizontally aligned, adjust offsetX
            line.offsetY = (x2 > x1) ? (line.otherLinesCount * 20) : -(line.otherLinesCount * 20); // Adjust offsetX based on direction
            line.offsetX = 0; // No vertical offset
        } else if (dx < dy && (Math.abs(dy-dx) > 150)) {
            // Vertically aligned, adjust offsetY
            line.offsetY = 0; // No horizontal offset
            line.offsetX = (y2 > y1) ? (line.otherLinesCount * 20) : -(line.otherLinesCount * 20); // Adjust offsetY based on direction
        } else {
            // Diagonally aligned, adjust both offsetX and offsetY
            line.offsetX = (x2 < x1) ? (line.otherLinesCount * 20) : -(line.otherLinesCount * 20); // Adjust offsetX based on direction
            line.offsetY = (y2 > y1) ? (line.otherLinesCount * 20) : -(line.otherLinesCount * 20); // Adjust offsetY based on direction
        }
        console.log("offsetX: " + line.offsetX + " offsetY: " + line.offsetY);
    }
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
