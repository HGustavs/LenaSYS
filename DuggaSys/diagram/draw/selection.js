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

    const minProperty = (arr, property) => arr.reduce((prev, current) => (prev[property] < current[property]) ? prev : current)[property];
    const maxProperty = (arr, property) => arr.reduce((prev, current) => (prev[property] > current[property]) ? prev : current)[property];

    if (((context.length || contextLine.length) && mouseMode != mouseModes.EDGE_CREATION)) {
        let selectionBox;
        const tempLines = [];

        if (context.length) {
            selectionBox = Rect.FromPoints(
                new Point(minProperty(context, 'x1') - margin, minProperty(context, 'y1') - margin),
                new Point(maxProperty(context, 'x2') + margin, maxProperty(context, 'y2') + margin),
            );
        }
        if (contextLine.length) {
            for (let i = 0; i < contextLine.length; i++) {
                if (contextLine[i] && contextLine[i].kind) {
                    if (contextLine[i].kind === lineKind.DOUBLE) {
                        tempLines.push(document.getElementById(contextLine[i].id + "-1").getBoundingClientRect());
                        tempLines.push(document.getElementById(contextLine[i].id + "-2").getBoundingClientRect());
                    } else {
                        tempLines.push(document.getElementById(contextLine[i].id).getBoundingClientRect());
                    }
                }
            }
            let lineSelectionBox = Rect.FromPoints(
                new Point(minProperty(tempLines, 'left') - margin, minProperty(tempLines, 'top') - margin),
                new Point(maxProperty(tempLines, 'right') + margin, maxProperty(tempLines, 'bottom') + margin),
            );
            if (context.length) {
                selectionBox.x = Math.min(selectionBox.x, lineSelectionBox.x);
                selectionBox.y = Math.min(selectionBox.y, lineSelectionBox.y);
                selectionBox.width = Math.max(selectionBox.width, lineSelectionBox.width);
                selectionBox.height = Math.max(selectionBox.height, lineSelectionBox.height);
            } else {
                selectionBox = lineSelectionBox;
            }
        }
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
