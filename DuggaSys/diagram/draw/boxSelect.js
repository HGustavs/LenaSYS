function boxSelect_Draw() {
    let str = '';
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && (pointerState == pointerStates.DEFAULT || pointerState == pointerStates.CLICKED_LINE)) {
        let isPositiveX = startX < startX + deltaX;
        let isPositiveY = startY < startY + deltaY;
        let x = (isPositiveX) ? startX : startX + deltaX;
        let dx = (isPositiveX) ? deltaX : -deltaX;
        let y = (isPositiveY) ? startY : startY + deltaY;
        let dy = (isPositiveY) ? deltaY : -deltaY;
        str += `<rect 
                    class='boxSelectionLines'
                    x='${x}' y='${y}' 
                    width='${dx}' height='${dy}'
                    style="fill:transparent;stroke-width:2;"
                />`;
    }
    return str;
}
