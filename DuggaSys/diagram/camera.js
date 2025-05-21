/**
 * @description Centers the camera between the highest and lowest x and y values of all elements or if no element the camera moves to start position
 */
function centerCamera() {
    let emptyDiagram = true;
    let offsetX = 0;
    let offsetY = 0;

    // If there is no element then the camera moves to start position (X = 100 and Y = 100).
    if (data.length == 0) {
        emptyDiagram = false;
        // offsetX is 98 because if not, X is going to be at 2 and it have to be at 100.
        offsetX = 98;
        // offsetY is 100 because if not, Y is going to be at 0 and it have to be at 100.
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

        if (emptyDiagram == true){
            elementHeights = []; // Special array for height of elements since not all elements have a default height assigned to them

            // Get smallest/largest x-value in the diagram (leftmost point and rightmost point), as well as smallest y-value
            const minX = Math.min.apply(null, data.map(i => i.x));
            const maxX = Math.max.apply(null, data.map(i => i.x + i.width)); // Get rightmost point by taking the largest sum of x-position + element width
            const minY = Math.min.apply(null, data.map(i => i.y));

            // Look through each element in the diagram and retrieve the sum of y-position and element height for all of them
            data.forEach(element => {
                if (element.kind == elementTypesNames.UMLEntity){ // UML Entities don't have a default height assigned to them, meaning that it needs to be retrieved from the UMLHeight array instead
                    let temp = UMLHeight.find(item => item.id === element.id);
                    elementHeights.push(element.y + temp.height);

                } else if (element.kind == elementTypesNames.SDEntity) { // Same for SD Entities, but from SDHeight instead 
                    let temp = SDHeight.find(item => item.id === element.id);
                    elementHeights.push(element.y + temp.height);

                } else { // Other elements get the height directly from the element
                    elementHeights.push(element.y + element.height);
                }
            });

            const maxY = Math.max.apply(null, elementHeights); // Get largest y-value from the predefined array

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
        if(emptyDiagram == true){
            zoomCenter(centerDiagram);
        }
    }
    displayMessage(messageTypes.SUCCESS, `Centered the camera.`);
}
