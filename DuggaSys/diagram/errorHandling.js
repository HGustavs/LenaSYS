
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

        if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
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

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
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
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
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
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
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
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "weakKey") {
                    keyQuantity += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            // Checking if weak entity is related to a strong entity or a weak entity with a relation
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && tElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.EREntity && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.EREntity && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && fElement.state == "weak" && line.kind == "Double") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.EREntity && (tElement0.state != "weak" || line0.kind == "Normal") && tElement0.id != element.id) {
                        strongEntity += 1;
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.EREntity && (fElement0.state != "weak" || line0.kind == "Normal") && fElement0.id != element.id) {
                        strongEntity += 1;
                    }
                }
            }

            // Counting weak relations
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && tElement.state == "weak") {
                weakrelation += 1;
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && fElement.state == "weak") {
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
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }

            // Counting quantity of keys
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (tElement.state == "primary") {
                    primaryCount += 1;
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    keyQuantity += 1;
                }
                if (fElement.state == "primary") {
                    primaryCount += 1;
                }
            }

            // Checking for attributes with same name
            if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
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

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation) {
            errorData.push(element);
        }
    }

    // Checks if connected attribute is connected with another relation or entity
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
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

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
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
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
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
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
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

    // Checking for attribute with same name on relation
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        fElement = data[findIndex(data, line.fromID)];
        tElement = data[findIndex(data, line.toID)];

        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
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
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity && tElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(element);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity && fElement.state == "weak" && line.kind == "Normal") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != fElement.id) {
                        errorData.push(element);
                    }
                }
            }

            var line0;
            var fElement0;
            var tElement0;

            // Checking for more than one Normal line to a weak relation
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity && tElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != tElement.id) {
                        errorData.push(fElement);
                    }
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity && fElement.state != "weak") {
                for (let j = 0; j < lines.length; j++) {
                    line0 = lines[j];
                    fElement0 = data[findIndex(data, line0.fromID)];
                    tElement0 = data[findIndex(data, line0.toID)];

                    if (fElement0.id == element.id && tElement0.kind == elementTypesNames.EREntity && tElement0.state != "weak" && tElement0.id != fElement.id) {
                        errorData.push(tElement);
                    }
                    if (tElement0.id == element.id && fElement0.kind == elementTypesNames.EREntity && fElement0.state != "weak" && fElement0.id != fElement.id) {
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
            if ((tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) || (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity)) {
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
            if ((tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) || (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity)) {
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
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    if (fElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    if (tElement.state != "normal") {
                        errorData.push(element);
                    }
                }
            }
        }

        // Checking for 2nd line attribute connected with a 3rd attribute
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == elementTypesNames.ERAttr && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Checking for 3rd line attribute connected with a 2nd attribute
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != fElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && tElement.kind == elementTypesNames.ERAttr && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && tElement0.kind == elementTypesNames.ERAttr && tElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && fElement0.kind == elementTypesNames.ERAttr && fElement0.id != tElement.id) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Attribute connected to more than one relation or entity
        if (fElement.id == element.id && (tElement.kind == elementTypesNames.EREntity || tElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation) && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation) && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }

        // 2nd line attribute connected to another relation or entity
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == tElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && (tElement0.kind == elementTypesNames.EREntity || tElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == fElement.id && (fElement0.kind == elementTypesNames.EREntity || fElement0.kind == elementTypesNames.ERRelation)) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == element.id && (tElement1.kind == elementTypesNames.EREntity || tElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                        if (tElement1.id == element.id && (fElement1.kind == elementTypesNames.EREntity || fElement1.kind == elementTypesNames.ERRelation)) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        // Check for 1st line attribute connected in a 3 line attribute chain
        if (fElement.id == element.id && (tElement.kind == elementTypesNames.EREntity || tElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }
        if (tElement.id == element.id && (fElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.ERRelation)) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == element.id && tElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == tElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == tElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != fElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
                if (tElement0.id == element.id && fElement0.kind == elementTypesNames.ERAttr) {
                    for (let k = 0; k < lines.length; k++) {
                        line1 = lines[k];
                        fElement1 = data[findIndex(data, line1.fromID)];
                        tElement1 = data[findIndex(data, line1.toID)];

                        if (fElement1.id == fElement0.id && tElement1.kind == elementTypesNames.ERAttr && tElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                        if (tElement1.id == fElement0.id && fElement1.kind == elementTypesNames.ERAttr && fElement1.id != tElement0.id) {
                            errorData.push(element);
                        }
                    }
                }
            }
        }

        // Checking for wrong key type
        if ((tElement.kind == elementTypesNames.EREntity || fElement.kind == elementTypesNames.EREntity) && (tElement.state == "weak" || fElement.state == "weak")) {
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
                if (fElement.state == "candidate" || fElement.state == "primary") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
                if (tElement.state == "candidate" || tElement.state == "primary") {
                    errorData.push(tElement);
                }
            }
        } else {
            if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
                if (fElement.state == "weakKey") {
                    errorData.push(fElement);
                }
            }
            if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
                if (tElement.state == "weakKey") {
                    errorData.push(tElement);
                }
            }
        }

        // Checking for attributes on the same relation with the same name
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == tElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == fElement.name && tElement0.id != fElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == tElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == fElement.name && fElement0.id != fElement.id) {
                    errorData.push(element);
                }
            }
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation) {
            for (let j = 0; j < lines.length; j++) {
                line0 = lines[j];
                fElement0 = data[findIndex(data, line0.fromID)];
                tElement0 = data[findIndex(data, line0.toID)];

                if (fElement0.id == fElement.id && tElement0.kind == elementTypesNames.ERAttr && tElement0.name == tElement.name && tElement0.id != tElement.id) {
                    errorData.push(element);
                }
                if (tElement0.id == fElement.id && fElement0.kind == elementTypesNames.ERAttr && fElement0.name == tElement.name && fElement0.id != tElement.id) {
                    errorData.push(element);
                }
            }
        }

        // Checking for key attributes on relation
        if (fElement.id == element.id && tElement.kind == elementTypesNames.ERRelation && (fElement.state == "primary" || fElement.state == "candidate" || fElement.state == "weakKey")) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERRelation && (tElement.state == "primary" || tElement.state == "candidate" || tElement.state == "weakKey")) {
            errorData.push(element);
        }

        // Checking for attributes connected with the same name
        if (fElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }
        if (tElement.id == element.id && fElement.kind == elementTypesNames.ERAttr && tElement.kind == elementTypesNames.ERAttr && fElement.name == tElement.name) {
            errorData.push(element);
        }

        // Checking for attributes on the same entity
        if (fElement.id == element.id && tElement.kind == elementTypesNames.EREntity) {
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
        if (tElement.id == element.id && fElement.kind == elementTypesNames.EREntity) {
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
        if ((fElement.kind == elementTypesNames.EREntity && tElement.kind == elementTypesNames.ERRelation) || (tElement.kind == elementTypesNames.EREntity && fElement.kind == elementTypesNames.ERRelation)) {
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
    if (element.kind == elementTypesNames.EREntity) checkEREntityErrors(element);
    if (element.kind == elementTypesNames.ERRelation) checkERRelationErrors(element);
    if (element.kind == elementTypesNames.ERAttr) checkERAttributeErrors(element);

    // Check lines
    checkLineErrors(lines);
}
