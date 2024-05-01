// User has initiated a box selection
function boxSelect_Start(mouseX, mouseY) {
    // Store previous context
    previousContext = context;
    previousContextLine = contextLine;
    // Set starting position
    startX = mouseX;
    startY = mouseY;
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = true;
}

function boxSelect_End() {
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = false;
}

