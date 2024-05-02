/**
 * @description Centers the camera between the highest and lowest x and y values of all elements
 */
function centerCamera() {
    // Stops execution if there are no elements to center the camera around.
    if (data.length == 0) {
        displayMessage(messageTypes.ERROR, "Error: There are no elements to center to!");
        return;
    }
    // Centering needs to happen twice for it to work, temp solution
    for (let i = 0; i < 2; i++) {
        zoomfact = 1;

        var minX = Math.min.apply(null, data.map(i => i.x))
        var maxX = Math.max.apply(null, data.map(i => i.x + i.width))
        var minY = Math.min.apply(null, data.map(i => i.y))
        var maxY = Math.max.apply(null, data.map(i => i.y + i.height))
        determineZoomfact(maxX, maxY, minX, minY);

        // Center of screen in pixels
        var centerScreen = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        // Center of diagram in coordinates
        var centerDiagram = {
            x: minX + ((maxX - minX) / 2),
            y: minY + ((maxY - minY) / 2)
        };

        // Move camera to center of diagram
        scrollx = centerDiagram.x * zoomfact;
        scrolly = centerDiagram.y * zoomfact;

        var middleCoordinate = screenToDiagramCoordinates(centerScreen.x, centerScreen.y);
        document.getElementById("zoom-message").innerHTML = zoomfact + "x";

        scrollx = middleCoordinate.x;
        scrolly = middleCoordinate.y;

        // Update screen
        showdata();
        updatepos();
        updateGridPos();
        updateGridSize();
        drawRulerBars(scrollx, scrolly);
        updateA4Pos();
        updateA4Size();
        zoomCenter(centerDiagram);
    }
    displayMessage(messageTypes.SUCCESS, `Centered the camera.`);
}
