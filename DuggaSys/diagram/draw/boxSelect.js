/**
 * @description Generates html for the selection box when using the box selection tool.
 * @returns {string} html for the selection box.
 */
function boxSelect_Draw() {
    let str = '';
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && (pointerState == pointerStates.DEFAULT || pointerState == pointerStates.CLICKED_LINE)) {
        let rect = new Rect(startX, startY, deltaX, deltaY);
        str += `<rect 
                    class='boxSelectionLines'
                    x='${rect.left}' y='${rect.top}' 
                    width='${rect.right - rect.left}' height='${rect.bottom - rect.top}'
                    style="fill:transparent;stroke-width:2;"
                />`;
    }
    return str;
}
