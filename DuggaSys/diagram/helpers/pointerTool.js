// Pointer logic for touch/mouse interaction

/**
 * starts pointer interaction
 */
function pointerTool_Start(mouseX, mouseY) {
    startX = mouseX;
    startY = mouseY;
    deltaX = 0;
    deltaY = 0;

    if (AudioContext.length > 0) {
        const elId = context [0]?.id;
        if (!elId) {
            return;
        }

        const el = document.querySelector(`[id="${CSS.escape(elId)}"]`);

        if (el) {
            const rect = el.getBoundingClientRect();

            // Using the screen-coordinates for a more reliable hit-test
            if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                pointerState = pointerStates.CLICKED_ELEMENT;
                targetElement = context[0];
                return;
            }
        }
    }

    // If clicking outside an element; treat as container-drag
    pointerState = pointerStates.CLICKED_CONTAINER;
    sscrollx = scrollX;
    sscrolly = scrollY;
}

/**
 * Ends pointer interaction
 */
function pointerTool_End() {
    pointerState = pointerStates.DEFAULT;
    targetElement = null;
    deltaX = 0;
    deltaY = 0;

    updatepos();
}

/**
 * Updates position continuously while pointer is active
 */
function pointerTool_Update(currentX, currentY) {
    const dx = currentX -startX;
    const dy = currentY - startY;

    if (pointerState === pointerStates.CLICKED_ELEMENT && context.length > 0) {
        movingObject = true;

        context.forEach(el => {
            el.x += dx / zoomfact;
            el.y += dy / zoomfact;

            // Convert to screen position for live drag-visuals
            const screenPos = diagramToScreenCoordinates(el.x, el.y);
            const domEl = document.getElementById(el.id);
            if (domEl) {
                domEl.style.left = `${screenPos.x}px`;
                domEl.style.top = `${screenPos.y}px`;
            }
        });

        startX = currentX;
        startY = currentY;
    }
}

/**
 * Converting the diagram-coordinates to screen-coordinates
 */
function diagramToScreenCoordinates(diagramX, diagramY) {
    return {
        x:Math.round((diagramX - scrollx) * zoomfact),
        y: Math.round((diagramY - scrolly) * zoomfact)
    };
}