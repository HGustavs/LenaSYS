function boxSelect_Draw() {
    let str = '';
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && (pointerState == pointerStates.DEFAULT || pointerState == pointerStates.CLICKED_LINE)) {
        // Positions to draw lines in-between
        /*
            Each [nx] depicts one node in the selection triangle.
            We draw a line between each corner and its neighbours.

            [n1]----------[n2]
            |              |
            |              |
            |              |
            |              |
            [n3]----------[n4]
        */

        // Calculate each node position
        var boxCoords = getBoxSelectionPoints();
        var nodeStart = boxCoords.n1;
        var nodeX = boxCoords.n2
        var nodeY = boxCoords.n3;
        var nodeXY = boxCoords.n4;
        var strokeWidth = 2;

        // Draw lines between all neighbours
        str += `<line class='boxSelectionLines' x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke-width='${strokeWidth}' />`;
        str += `<line class='boxSelectionLines' x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke-width='${strokeWidth}' />`;
        str += `<line class='boxSelectionLines' x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke-width='${strokeWidth}' />`;
        str += `<line class='boxSelectionLines' x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke-width='${strokeWidth}' />`;
    }
    return str;
}
