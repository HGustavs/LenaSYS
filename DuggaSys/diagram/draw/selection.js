/**
 * @description Draw the box around the selected elements.
 * @return The populated string with the selection box rect.
 */
function drawSelectionBox() {
    let points;
    let str = '';
    deleteBtnX = 0;
    deleteBtnY = 0;
    deleteBtnSize = 0;

    if (((context.length != 0 || contextLine.length != 0) && mouseMode != mouseModes.EDGE_CREATION) ||
        (mouseMode == mouseModes.EDGE_CREATION && context.length == 0 && contextLine.length != 0)
    ) {
        let lowX, highX, lineLowX, lineHighX, x1, x2, lowY, highY, lineLowY, lineHighY, y1, y2;
        if (context.length != 0) {
            lowX = context[0].x1;
            highX = context[0].x2;
            lowY = context[0].y1;
            highY = context[0].y2;
            for (let i = 0; i < context.length; i++) {
                x1 = context[i].x1;
                x2 = context[i].x2;
                y1 = context[i].y1;
                y2 = context[i].y2;
                if (x1 < lowX) lowX = x1;
                if (x2 > highX) highX = x2;
                if (y1 < lowY) lowY = y1;
                if (y2 > highY) highY = y2;
            }
        }

        const tempLines = [];
        if (contextLine.length > 0) {
            for (let i = 0; i < contextLine.length; i++) {
                if (contextLine[i] && contextLine[i].kind) {
                    if (contextLine[i].kind === lineKind.DOUBLE) {
                        tempLines.push(document.getElementById(contextLine[i].id + "-1"));
                        tempLines.push(document.getElementById(contextLine[i].id + "-2"));
                    } else {
                        tempLines.push(document.getElementById(contextLine[i].id));
                    }
                }
            }
            let tempX1, tempX2, tempY1, tempY2;
            let hasPoints = tempLines[0].getAttribute('points'); // Polyline
            if (hasPoints) {
                points = hasPoints.split(' ');
                // Find highest and lowest x and y coordinates of the first element in lines
                tempX1 = points[0].split(',')[0];
                tempX2 = points[3].split(',')[0];
                tempY1 = points[0].split(',')[1];
                tempY2 = points[3].split(',')[1];
            } else {
                // Find highest and lowest x and y coordinates of the first element in lines
                tempX1 = tempLines[0].getAttribute("x1");
                tempX2 = tempLines[0].getAttribute("x2");
                tempY1 = tempLines[0].getAttribute("y1");
                tempY2 = tempLines[0].getAttribute("y2");
            }
            lineLowX = Math.min(tempX1, tempX2);
            lineHighX = Math.max(tempX1, tempX2);
            lineLowY = Math.min(tempY1, tempY2);
            lineHighY = Math.max(tempY1, tempY2);

            // Loop through all selected lines and find highest and lowest x and y coordinates
            for (let i = 0; i < tempLines.length; i++) {
                hasPoints = tempLines[i].getAttribute('points'); // Polyline
                if (hasPoints) {
                    points = hasPoints.split(' ');
                    // Find highest and lowest x and y coordinates of the first element in lines
                    tempX1 = points[0].split(',')[0];
                    tempX2 = points[3].split(',')[0];
                    tempY1 = points[0].split(',')[1];
                    tempY2 = points[3].split(',')[1];
                } else {
                    // Find highest and lowest x and y coordinates of the first element in lines
                    tempX1 = tempLines[i].getAttribute("x1");
                    tempX2 = tempLines[i].getAttribute("x2");
                    tempY1 = tempLines[i].getAttribute("y1");
                    tempY2 = tempLines[i].getAttribute("y2");
                }
                x1 = Math.min(tempX1, tempX2);
                x2 = Math.max(tempX1, tempX2);
                y1 = Math.min(tempY1, tempY2);
                y2 = Math.max(tempY1, tempY2);
                if (x1 < lineLowX) lineLowX = x1;
                if (x2 > lineHighX) lineHighX = x2;
                if (y1 < lineLowY) lineLowY = y1;
                if (y2 > lineHighY) lineHighY = y2;
            }
            // Compare between elements and lines to find lowest and highest x and y coordinates
            lowX = (lowX < lineLowX) ? lowX : lineLowX;
            highX = (highX > lineHighX) ? highX : lineHighX;
            lowY = (lowY < lineLowY) ? lowY : lineLowY;
            highY = (highY > lineHighY) ? highY : lineHighY;
        }
        // Global variables used to determine if mouse was clicked within selection box
        selectionBoxLowX = lowX - 5;
        selectionBoxHighX = highX + 5;
        selectionBoxLowY = lowY - 5;
        selectionBoxHighY = highY + 5;

        // Selection container of selected elements
        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}' style="fill:transparent; stroke-width:1.5; stroke:${color.SELECTED};" />`;

        //Determine size and position of delete button
        if (highX - lowX + 10 > highY - lowY + 10) {
            deleteBtnSize = (highY - lowY + 10) / 3;
        } else {
            deleteBtnSize = (highX - lowX + 10) / 3;
        }

        if (deleteBtnSize > 20) {
            deleteBtnSize = 20;
        } else if (deleteBtnSize < 15) {
            deleteBtnSize = 15;
        }

        // Button possition
        deleteBtnX = lowX - 5 + highX - lowX + 10 - (deleteBtnSize / 2);
        deleteBtnY = lowY - 5 - (deleteBtnSize / 2);

        //Delete button visual representation
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + deleteBtnSize - 2}' class= "BlackthemeColor"/>`;
        str += `<line x1='${deleteBtnX + 2}' y1='${deleteBtnY + deleteBtnSize - 2}' x2='${deleteBtnX + deleteBtnSize - 2}' y2='${deleteBtnY + 2}' class= "BlackthemeColor"/>`;
    }
    return str;
}
