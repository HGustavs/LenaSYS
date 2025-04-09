/**
 * @description Draws the selection box and delete button based on the current context and mouse mode.
 * @returns {string} The SVG string representing the selection box and delete button.
 */
function drawSelectionBox() {
    let str = '';
    const margin = 5;
    deleteBtnX = 0;
    deleteBtnY = 0;
    deleteBtnSize = 20 * zoomfact;

    // Get the min and max values of a property in an array of objects
    const minProperty = (arr, property) => arr.reduce((prev, current) => (prev[property] < current[property]) ? prev : current)[property];
    const maxProperty = (arr, property) => arr.reduce((prev, current) => (prev[property] > current[property]) ? prev : current)[property];

    // Draw the selection box and delete button based on the current context and mouse mode
    if (((context.length || contextLine.length) && mouseMode != mouseModes.EDGE_CREATION)) {
        let selectionBox;
        const tempLines = [];

        // Get the selection box based on the current context
        if (context.length) {
            selectionBox = Rect.FromPoints(
                new Point(minProperty(context, 'x1') - margin, minProperty(context, 'y1') - margin),
                new Point(maxProperty(context, 'x2') + margin, maxProperty(context, 'y2') + margin),
            );
        }

        // Get the selection box based on the current contextLine
        if (contextLine.length) {
            for (let i = 0; i < contextLine.length; i++) {
                // If the line is a double line, get the bounding boxes of both lines
                if (contextLine[i] && contextLine[i].kind) {
                    if (contextLine[i].kind === lineKind.DOUBLE) {
                        tempLines.push(document.getElementById(contextLine[i].id + "-1").getBoundingClientRect());
                        tempLines.push(document.getElementById(contextLine[i].id + "-2").getBoundingClientRect());
                    } else {
                        tempLines.push(document.getElementById(contextLine[i].id).getBoundingClientRect());
                    }
                }
            }
            
            // Get the selection box based on the bounding boxes of the lines
            let lineSelectionBox = Rect.FromPoints(
                new Point(minProperty(tempLines, 'left') - margin, minProperty(tempLines, 'top') - margin),
                new Point(maxProperty(tempLines, 'right') + margin, maxProperty(tempLines, 'bottom') + margin),
            );

            // If there is already a selection box based on the current context, expand it to include the selection box based on the current contextLine
            if (context.length) {
                selectionBox.x = Math.min(selectionBox.x, lineSelectionBox.x);
                selectionBox.y = Math.min(selectionBox.y, lineSelectionBox.y);
                selectionBox.width = Math.max(selectionBox.width, lineSelectionBox.width);
                selectionBox.height = Math.max(selectionBox.height, lineSelectionBox.height);
            } else {
                selectionBox = lineSelectionBox;
            }
        }

        // Draw the selection box and delete button
        selectionBoxLowX = selectionBox.left;
        selectionBoxHighX = selectionBox.right;
        selectionBoxLowY = selectionBox.top;
        selectionBoxHighY = selectionBox.bottom;
        str += `<rect width='${selectionBox.width}' height='${selectionBox.height}' x= '${selectionBox.x}' y='${selectionBox.y}' style="fill:transparent; stroke-width:1.5; stroke:${color.SELECTED};" />`;

        const topRight = selectionBox.topRight;
        deleteBtnX = topRight.x;
        deleteBtnY = topRight.y - deleteBtnSize;
        str += `<line x1='${deleteBtnX}' y1='${deleteBtnY}' x2='${deleteBtnX + deleteBtnSize}' y2='${deleteBtnY + deleteBtnSize}' class= "BlackthemeColor"/>`;
        str += `<line x1='${deleteBtnX}' y1='${deleteBtnY + deleteBtnSize}' x2='${deleteBtnX + deleteBtnSize}' y2='${deleteBtnY}' class= "BlackthemeColor"/>`;
    }
    return str;
}
