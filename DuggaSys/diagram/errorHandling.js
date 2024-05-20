
/**
 * @description Error checking for ER entity
 * @param {Object} element Element to be checked for errors.
 */
function checkEREntityErrors(element) {
    let keyQuantity, primaryCount, strongEntity, weakrelation;
    let fElement, fElement0, fElement1, tElement, tElement0, tElement1, line, line0, line1;

    // Checks for entities with the same name
    for (let i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id) {
            errorData.push(element);
        }
    }

    // Checks for entity connected to another entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
    }
    if (element.state == "weak") {
        keyQuantity = 0;
        strongEntity = 0;
        weakrelation = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (tElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (fElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if weak entity is related to a strong entity or a weak entity with a relation
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && tElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && fElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }

            // Counting weak relations
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && tElement.state == "weak") {
                weakrelation += 1;
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && fElement.state == "weak") {
                weakrelation += 1;
            }
        }
        // Checks if element has one relation to a strong entity
        if (strongEntity != 1) {
            errorData.push(element);
        }

        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checks if entity has any lines
            if (fElement.id == element.id || tElement.id == element.id) {
                //Checking for wrong quantity of keys
                if (keyQuantity < 1 || keyQuantity > 1) {
                    errorData.push(element);
                }
            }
            // Checks if entity has a weak relation
            if (weakrelation < 1) {
                errorData.push(element);
            }
        }
    } else {
        keyQuantity = 0;
        primaryCount = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong key type
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (tElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (fElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (tElement.state == "primary") {
                    primaryCount += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (fElement.state == "primary") {
                    primaryCount += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

        }

        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checks if entity has any lines
            if (fElement.id == element.id || tElement.id == element.id) {
                //Checking for wrong quantity of keys
                if (keyQuantity < 1) {
                    errorData.push(element);
                }
                if (primaryCount > 1) {
                    errorData.push(element);
                }
            }
        }
    }
}

/**
 * @description Error checking for ER relation
 * @param {Object} element Element to be checked for errors.
 */
function checkERRelationErrors(element) {
    let lineQuantity, line, fElement, tElement;

    // Checks for relation connected to another relation
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    // Checks for connection to attribute with more than 2 connections
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
    }

    // Checking for reletions with same name but different properties
    for (let i = 0; i < data.length; i++) {
        if (element.name == data[i].name && element.id != data[i].id && data[i].kind == ELEMENT_TYPES_NAMES.ER_RELATION) {

            // Checking if relations have same line types
            var linesChecked = [];
            for (let k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line0;
                var fElement0;
                var tElement0;

                if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (noLineFound) {
                        errorData.push(element);
                    }
                }
                if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                    var noLineFound = true;
                    if (line.kind == "Normal") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Normal" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (line.kind == "Double") {
                        if (line.cardinality == "ONE") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "ONE") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                        if (line.cardinality == "MANY") {
                            for (let j = 0; j < lines.length; j++) {
                                line0 = lines[j];
                                fElement0 = data[findIndex(data, line0.fromID)];
                                tElement0 = data[findIndex(data, line0.toID)];

                                var lineChecked = false;
                                for (let l = 0; l < linesChecked.length; l++) {
                                    if (line0.id == linesChecked[l].id) lineChecked = true;
                                }

                                if (!lineChecked) {
                                    if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                    if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && line0.kind == "Double" && line0.cardinality == "MANY") {
                                        linesChecked.push(line0);
                                        noLineFound = false;
                                    } else {
                                        noLineFound = true;
                                    }
                                }
                                if (!noLineFound) break;
                            }
                        }
                    }
                    if (noLineFound) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if reletions have the same attributes
            for (let k = 0; k < lines.length; k++) {
                line = lines[k];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                var line1;
                var fElement1;
                var tElement1;
                var line2;
                var fElement2;
                var tElement2;

                if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (let j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.state == tElement.state && tElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.state == tElement.state && fElement0.name == tElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == tElement.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (fElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (!noLineFound) break;
                    }
                    if (noLineFound && !attrFound) {
                        errorData.push(element);
                    }
                    if (!attrLineFound) {
                        errorData.push(element);
                    }
                }
                if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    var noLineFound = true;
                    var attrFound = false;
                    var attrLineFound = false;
                    for (let j = 0; j < lines.length; j++) {
                        line0 = lines[j];
                        fElement0 = data[findIndex(data, line0.fromID)];
                        tElement0 = data[findIndex(data, line0.toID)];

                        if (fElement0.id == data[i].id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.state == fElement.state && tElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == tElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == tElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (tElement0.id == data[i].id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.state == fElement.state && fElement0.name == fElement.name) {
                            noLineFound = false;
                            attrFound = true;
                            attrLineFound = true;

                            for (let l = 0; l < lines.length; l++) {
                                line1 = lines[l];
                                fElement1 = data[findIndex(data, line1.fromID)];
                                tElement1 = data[findIndex(data, line1.toID)];

                                if (fElement1.id == fElement.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement0.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement0.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }

                                if (fElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == tElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                                if (tElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                                    attrLineFound = false;

                                    for (let m = 0; m < lines.length; m++) {
                                        line2 = lines[m];
                                        fElement2 = data[findIndex(data, line2.fromID)];
                                        tElement2 = data[findIndex(data, line2.toID)];

                                        if (fElement2.id == fElement.id && tElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                        if (tElement2.id == fElement.id && fElement2.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement2.name == fElement1.name) {
                                            attrLineFound = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            noLineFound = true;
                        }
                        if (!noLineFound) break;
                    }
                    if (noLineFound && !attrFound) {
                        errorData.push(element);
                    }
                    if (!attrLineFound) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if relations have the same amount of attributes
            var elementAttrCount = 0;
            var dataAttrCount = 0;
            for (let j = 0; j < lines.length; j++) {
                line = lines[j];
                fElement = data[findIndex(data, line.fromID)];
                tElement = data[findIndex(data, line.toID)];

                if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    elementAttrCount += 1;
                }
                if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    elementAttrCount += 1;
                }

                if (fElement.id == data[i].id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    dataAttrCount += 1;
                }
                if (tElement.id == data[i].id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    dataAttrCount += 1;
                }
            }
            if (elementAttrCount != dataAttrCount) {
                errorData.push(element);
            }
        }
    }

    // Checking for attribute with same name on relation
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
    }

    if (element.state == "weak") {
        lineQuantity = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Checking for wrong line type to a relation
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            var line0;
            var fElement0;
            var tElement0;

            // Checking for more than one Normal line to a weak relation
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                }
            }

            // Checking for more than one double line to a weak relation
            if (fElement.id == element.id && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && line0.kind == "Double" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && line0.kind == "Double" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && line0.kind == "Double" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && line0.kind == "Double" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Counting connected lines
            if ((tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) || (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY)) {
                lineQuantity += 1;
            }
        }
    } else {
        lineQuantity = 0;
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];
            fElement = data[findIndex(data, line.fromID)];
            tElement = data[findIndex(data, line.toID)];

            // Counting connected lines
            if ((tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) || (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY)) {
                lineQuantity += 1;
            }
        }
    }
    //Checking for wrong quantity of lines
    if (lineQuantity == 1 || lineQuantity > 2) {
        errorData.push(element);
    }
}

/**
 * @description Error checking for ER attribute
 * @param {Object} element Element to be checked for errors.
 */
function checkERAttributeErrors(element) {
    let line, line0, line1;
    let fElement, fElement0, fElement1;
    let tElement, tElement0, tElement1;
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        // Checking for non-normal attributes on a attribute
        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }

        // Checking for 2nd line attribute connected with a 3rd attribute
        if (fElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Checking for 3rd line attribute connected with a 2nd attribute
        if (fElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Attribute connected to more than one relation or entity
        if (fElement.id == element.id && (tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }

        // 2nd line attribute connected to another relation or entity
        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement0.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement1.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Check for 1st line attribute connected in a 3 line attribute chain
        if (fElement.id == element.id && (tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Checking for wrong key type
        if ((tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY || fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) && (tElement.state == "weak" || fElement.state == "weak")) {
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(tElement);
                }
            }
        } else {
            if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                if (fElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
                if (tElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }
        }

        // Checking for attributes on the same relation with the same name
        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && fElement0.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }

        // Checking for key attributes on relation
        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && (fElement.state == "primary" || fElement.state == "candidate" || fElement.state == "weakKey")) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION && (tElement.state == "primary" || tElement.state == "candidate" || tElement.state == "weakKey")) {
            errorData.push(element);
        }

        // Checking for attributes connected with the same name
        if (fElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ERAttr && tElement.kind == ELEMENT_TYPES_NAMES.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }

        // Checking for attributes on the same entity
        if (fElement.id == element.id && tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
            var currentAttr = fElement;
            var currentEntity = tElement;
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                // Checking for attributes on the same entity with same name
                if (fElement0.id == currentEntity.id && tElement0.name == currentAttr.name && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && fElement0.name == currentAttr.name && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }

                // Checking for more than one key attributes on the same entity
                if (fElement0.id == currentEntity.id && ((currentAttr.state == "primary" && tElement0.state == "primary") || (currentAttr.state == "weakKey" && tElement0.state == "weakKey")) && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && ((currentAttr.state == "primary" && fElement0.state == "primary") || (currentAttr.state == "weakKey" && fElement0.state == "weakKey")) && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) {
            var currentAttr = tElement;
            var currentEntity = fElement;
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                // Checking for attributes on the same entity with same name
                if (fElement0.id == currentEntity.id && tElement0.name == currentAttr.name && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && fElement0.name == currentAttr.name && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }

                // Checking for more than one key attributes on the same entity (except candidate key)
                if (fElement0.id == currentEntity.id && ((currentAttr.state == "primary" && tElement0.state == "primary") || (currentAttr.state == "weakKey" && tElement0.state == "weakKey")) && tElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(tElement0);
                }
                if (tElement0.id == currentEntity.id && ((currentAttr.state == "primary" && fElement0.state == "primary") || (currentAttr.state == "weakKey" && fElement0.state == "weakKey")) && fElement0.id != currentAttr.id) {
                    errorData.push(currentAttr);
                    errorData.push(fElement0);
                }
            }
        }
    }
}

/**
 * @description Error checking for lines
 * @param {Object} element Element to be checked for errors.
 */
function checkLineErrors(lines) {
    let line;
    // Error checking for lines
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        const fElement = data[findIndex(data, line.fromID)];
        const tElement = data[findIndex(data, line.toID)];

        //Checking for cardinality
        if ((fElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && tElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION) || (tElement.kind == ELEMENT_TYPES_NAMES.ER_ENTITY && fElement.kind == ELEMENT_TYPES_NAMES.ER_RELATION)) {
            if (line.cardinality != "ONE" && line.cardinality != "MANY") {
                errorData.push(fElement);
                errorData.push(tElement);
            }
        }
    }
}

/**
 * @description Checks for errors and adds the element affected by the errors to a error list.
 * @param {Object} element Element to be checked for errors.
 */
function checkElementError(element) {
    if (element.kind == ELEMENT_TYPES_NAMES.ER_ENTITY) checkEREntityErrors(element);
    if (element.kind == ELEMENT_TYPES_NAMES.ER_RELATION) checkERRelationErrors(element);
    if (element.kind == ELEMENT_TYPES_NAMES.ERAttr) checkERAttributeErrors(element);

    // Check lines
    checkLineErrors(lines);
}
