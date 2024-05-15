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
        var lowX, highX, lowY, highY;
        // Calculate the bounding coordinates
        // Initially set to very large/small values
        lowX = lowY = Number.POSITIVE_INFINITY;
        highX = highY = Number.NEGATIVE_INFINITY;

        // Loop through all elements and lines to calculate the bounding box
        context.forEach(item => {
            lowX = Math.min(lowX, item.x1);
            highX = Math.max(highX, item.x2);
            lowY = Math.min(lowY, item.y1);
            highY = Math.max(highY, item.y2);
        });
        contextLine.forEach(line => {
            var points = document.getElementById(line.id).getAttribute('points').split(' ');
            points.forEach(point => {
                var [x, y] = point.split(',').map(Number);
                lowX = Math.min(lowX, x);
                highX = Math.max(highX, x);
                lowY = Math.min(lowY, y);
                highY = Math.max(highY, y);
            });
        });

        // Apply a margin around the selection box
        var margin = 5;
        lowX -= margin;
        highX += margin;
        lowY -= margin;
        highY += margin;

        // Draw the selection box
        str += `<rect width='${highX - lowX}' height='${highY - lowY}' x='${lowX}' y='${lowY}' style="fill:transparent; stroke-width:1.5; stroke:${color.SELECTED};" />`;

        // Calculate delete button size by size and zoomfact
        deleteBtnSize = Math.min(40, Math.max(15, ((highY - lowY) / 5 * zoomfact)));

        // Place the delete button outside the top-right corner of the selection box
        deleteBtnX = highX; 
        deleteBtnY = lowY - deleteBtnSize;  

        // Draw delete button lines
        str += `<line x1='${deleteBtnX}' y1='${deleteBtnY}' x2='${deleteBtnX + deleteBtnSize}' y2='${deleteBtnY + deleteBtnSize}' style="stroke:black; stroke-width:3"/>`;
        str += `<line x1='${deleteBtnX}' y1='${deleteBtnY + deleteBtnSize}' x2='${deleteBtnX + deleteBtnSize}' y2='${deleteBtnY}' style="stroke:black; stroke-width:3"/>`;
    }
    return str;
}
