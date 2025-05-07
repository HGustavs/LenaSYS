/**
 * @description Increases the current zoom level if not already at maximum. This will magnify all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom towards the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event. - Optional
 */
function zoomin(scrollEvent = undefined) {
    let delta;
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent) {
        if (zoomfact < 4) {
            const midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

            delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
                x: midScreen.x - zoomOrigo.x,
                y: midScreen.y - zoomOrigo.y
            };

            //Update scroll x/y to center screen on new zoomOrigo
            scrollx /= zoomfact;
            scrolly /= zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx *= zoomfact;
            scrolly *= zoomfact;

            zoomOrigo.x = midScreen.x;
            zoomOrigo.y = midScreen.y;
        }
    } else if (zoomfact < 4.0) { // ELSE zoom towards mouseCoordinates
        const mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

        if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
            delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
                x: mouseCoordinates.x - zoomOrigo.x,
                y: mouseCoordinates.y - zoomOrigo.y
            };
            //Update scroll variables with delta in order to move the screen to the new zoom position
            scrollx /= zoomfact;
            scrolly /= zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx *= zoomfact;
            scrolly *= zoomfact;

            //Set new zoomOrigo to the current mouse coordinates
            zoomOrigo.x = mouseCoordinates.x;
            zoomOrigo.y = mouseCoordinates.y;
            lastMousePosCoords = mouseCoordinates;

            //Save current mouse position (Position on the SCREEN, not coordinates in the diagram)
            lastZoomPos.x = scrollEvent.clientX;
            lastZoomPos.y = scrollEvent.clientY;
        } else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.
            zoomOrigo.x = lastMousePosCoords.x;
            zoomOrigo.y = lastMousePosCoords.y;
        }
    }
    //Update scroll variables to match the new zoomfact
    scrollx /= zoomfact;
    scrolly /= zoomfact;

    switch (zoomfact) {
        case 0.25:
            zoomfact = 0.5;
            break;
        case 0.5:
            zoomfact = 0.75;
            break;
        case 0.75:
            zoomfact = 1.0;
            break;
        case 1.0:
            zoomfact = 1.25;
            break;
        case 1.25:
            zoomfact = 1.5;
            break;
        case 1.5:
            zoomfact = 2.0;
            break;
        case 2.0:
            zoomfact = 4.0;
    }
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx *= zoomfact;
    scrolly *= zoomfact;

    document.querySelectorAll('#pad_lock').forEach(padLock => {
        padLock.style.bottom = `${-5 * zoomfact}px`;
        padLock.style.left = `${3 * zoomfact}px`;
    });

    updateGridSize();
    updateA4Size();
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Decreases the current zoom level if not already at minimum. This will shrink all elements and move the camera appropriatly. If a scrollLevent argument is present, this will be used top zoom away from the cursor position.
 * @param {MouseEvent} scrollEvent The current mouse event. - Optional
 */
function zoomout(scrollEvent = undefined) {
    let delta;
    // If mousewheel is not used, we zoom towards origo (0, 0)
    if (!scrollEvent) {
        if (zoomfact > 0.25) {
            const midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

            delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
                x: midScreen.x - zoomOrigo.x,
                y: midScreen.y - zoomOrigo.y
            };

            //Update scroll x/y to center screen on new zoomOrigo
            scrollx /= zoomfact;
            scrolly /= zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx *= zoomfact;
            scrolly *= zoomfact;

            zoomOrigo.x = midScreen.x;
            zoomOrigo.y = midScreen.y;
        }
    } else if (zoomfact > 0.25) { // ELSE zoom towards mouseCoordinates
        const mouseCoordinates = screenToDiagramCoordinates(scrollEvent.clientX, scrollEvent.clientY);

        if (scrollEvent.clientX != lastZoomPos.x || scrollEvent.clientY != lastZoomPos.y) { //IF mouse has moved since last zoom, then zoom towards new position
            delta = { // Calculate the difference between the current mouse coordinates and the previous zoom coordinates (Origo)
                x: mouseCoordinates.x - zoomOrigo.x,
                y: mouseCoordinates.y - zoomOrigo.y
            };

            //Update scroll variables with delta in order to move the screen to the new zoom position
            scrollx /= zoomfact;
            scrolly /= zoomfact;
            scrollx += delta.x * zoomfact;
            scrolly += delta.y * zoomfact;
            scrollx *= zoomfact;
            scrolly *= zoomfact;

            //Set new zoomOrigo to the current mouse coordinatest
            zoomOrigo.x = mouseCoordinates.x;
            zoomOrigo.y = mouseCoordinates.y;
            lastMousePosCoords = mouseCoordinates;

            //Save current mouse position (Position on the SCREEN, not coordinates in the diagram)
            lastZoomPos.x = scrollEvent.clientX;
            lastZoomPos.y = scrollEvent.clientY;
        } else if (scrollEvent.clientX == lastZoomPos.x && scrollEvent.clientY == lastZoomPos.y) { //ELSE IF mouse has not moved, zoom towards same position as before.
            zoomOrigo.x = lastMousePosCoords.x;
            zoomOrigo.y = lastMousePosCoords.y;
        }
    }
    //Update scroll variables to match the new zoomfact
    scrollx /= zoomfact;
    scrolly /= zoomfact;

    switch (zoomfact) {
        case 0.5:
            zoomfact = 0.25;
            break;
        case 0.75:
            zoomfact = 0.5;
            break;
        case 1.0:
            zoomfact = 0.75;
            break;
        case 1.25:
            zoomfact = 1.0;
            break;
        case 1.5:
            zoomfact = 1.25;
            break;
        case 2.0:
            zoomfact = 1.5;
            break;
        case 4.0:
            zoomfact = 2.0;
    }
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx *= zoomfact;
    scrolly *= zoomfact;

    document.querySelectorAll('#pad_lock').forEach(padLock => {
        padLock.style.bottom = `${-5 * zoomfact}px`;
        padLock.style.left = `${3 * zoomfact}px`;
    });

    updateGridSize();
    updateA4Size();
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Decreases or increases the zoomfactor to its original value zoomfactor = 1.0.
 */
function zoomreset() {
    const midScreen = screenToDiagramCoordinates((window.innerWidth / 2), (window.innerHeight / 2));

    let delta = { // Calculate the difference between last zoomOrigo and current midScreen coordinates.
        x: midScreen.x - zoomOrigo.x,
        y: midScreen.y - zoomOrigo.y
    };

    //Update scroll x/y to center screen on new zoomOrigo
    scrollx /= zoomfact;
    scrolly /= zoomfact;
    scrollx += delta.x * zoomfact;
    scrolly += delta.y * zoomfact;
    scrollx *= zoomfact;
    scrolly *= zoomfact;

    zoomOrigo.x = midScreen.x;
    zoomOrigo.y = midScreen.y;

    scrollx /= zoomfact;
    scrolly /= zoomfact;

    zoomfact = 1.0;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx *= zoomfact;
    scrolly *= zoomfact;

    //update the grid when reseting zoom
    updateGridSize();

    // Update scroll position
    showdata();

    //update the rulerbars when reseting zoomfact
    drawRulerBars(scrollx, scrolly);
}


/**
 * @description Zooms the diagram to the specified center point.
 * @param {Object} centerDiagram - The center point of the diagram to zoom to.
 */
function zoomCenter(centerDiagram) {
    zoomOrigo.x = centerDiagram.x;
    zoomOrigo.y = centerDiagram.y;

    scrollx /= zoomfact;
    scrolly /= zoomfact;

    zoomfact = desiredZoomfact;
    document.getElementById("zoom-message").innerHTML = zoomfact + "x";

    scrollx *= zoomfact;
    scrolly *= zoomfact;

    updateGridSize();
    updateA4Size();

    // Update scroll position - missing code for determining that center of screen should remain at new zoom factor
    showdata();
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Determines the desired zoom factor based on the maximum and minimum values of the x and y coordinates.
 * @param {number} maxX - The maximum value of the x coordinate.
 * @param {number} maxY - The maximum value of the y coordinate.
 * @param {number} minX - The minimum value of the x coordinate.
 * @param {number} minY - The minimum value of the y coordinate.
 */
function determineZoomfact(maxX, maxY, minX, minY) {
    // Resolution of the screen
    const screenResolution = {
        x: window.innerWidth,
        y: window.innerHeight
    };
    // Checks if elements are within the window for the smalest zoomfact
    desiredZoomfact = 0.25;
    if (maxX - minX < ((screenResolution.x * 1.25 * 1.5) - 150) && maxY - minY < ((screenResolution.y * 1.25 * 1.5) - 100)) desiredZoomfact = 0.5;
    if (maxX - minX < ((screenResolution.x * 1.25) - 150) && maxY - minY < ((screenResolution.y * 1.25) - 100)) desiredZoomfact = 0.75;
    if (maxX - minX < (screenResolution.x - 150) && maxY - minY < screenResolution.y - 100) desiredZoomfact = 1.0;
    if (maxX - minX < ((screenResolution.x * 0.75) - 150) && maxY - minY < ((screenResolution.y * 0.75) - 100)) desiredZoomfact = 1.25;
    if (maxX - minX < ((screenResolution.x * 0.64) - 150) && maxY - minY < ((screenResolution.y * 0.64) - 100)) desiredZoomfact = 1.5;
    if (maxX - minX < ((screenResolution.x * 0.5) - 150) && maxY - minY < ((screenResolution.y * 0.5) - 100)) desiredZoomfact = 2.0;
    if (maxX - minX < ((screenResolution.x * 0.25) - 150) && maxY - minY < ((screenResolution.y * 0.25) - 100)) desiredZoomfact = 4.0;
}
