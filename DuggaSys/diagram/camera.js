/**
 * @description Centers the camera between the highest and lowest x and y values of all elements
 */
function centerCamera() {
    let centerToOrigo = false;
    let offsetX = 0;
    let offsetY = 0;

    // Stops execution if there are no elements to center the camera around.
    if (data.length == 0) {
        centerToOrigo = true;
        offsetX = 98;
        offsetY = 100;
    }
    // Centering needs to happen twice for it to work, temp solution
    for (let i = 0; i < 2; i++) {
        zoomfact = 1;

        // Center of screen in pixels
        const centerScreen = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        if(centerToOrigo == false){
            const minX = Math.min.apply(null, data.map(i => i.x));
            const maxX = Math.max.apply(null, data.map(i => i.x + i.width));
            const minY = Math.min.apply(null, data.map(i => i.y));
            const maxY = Math.max.apply(null, data.map(i => i.y + i.height));
            determineZoomfact(maxX, maxY, minX, minY);

            // Center of diagram in coordinates
            var centerDiagram = {
                x: minX + ((maxX - minX) / 2),
                y: minY + ((maxY - minY) / 2)
            };

            // Move camera to center of diagram
            scrollx = centerDiagram.x * zoomfact;
            scrolly = centerDiagram.y * zoomfact;
        } else {
            // Move camera to start position
            scrollx = centerScreen.x * zoomfact;
            scrolly = centerScreen.y * zoomfact;
        }

        const middleCoordinate = screenToDiagramCoordinates(centerScreen.x, centerScreen.y);
        document.getElementById("zoom-message").innerHTML = zoomfact + "x";

        scrollx = middleCoordinate.x + offsetX;
        scrolly = middleCoordinate.y + offsetY;

        // Update screen
        showdata();
        updatepos();
        updateGridPos();
        updateGridSize();
        drawRulerBars(scrollx, scrolly);
        updateA4Pos();
        updateA4Size();
        if(centerToOrigo == false){
            zoomCenter(centerDiagram);
        }
    }
    displayMessage(messageTypes.SUCCESS, `Centered the camera.`);
}
