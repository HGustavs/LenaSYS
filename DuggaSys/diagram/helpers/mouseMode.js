/**
 * @description Changes the current mouse mode using argument enum value.
 * @param {mouseModes} mode What mouse mode to change into.
 * @see mouseModes For all available enum values.
 */
function setMouseMode(mode) {
    if (enumContainsPropertyValue(mode, mouseModes)) {
        // Mode-specific activation/deactivation
        onMouseModeDisabled();
        mouseMode = mode;
        setContainerStyles(mode);
        onMouseModeEnabled();
    } else {
        // Not implemented exception
        console.error("Invalid mode passed to setMouseMode method. Missing implementation?");
    }
    if (mouseMode == mouseModes.POINTER) {
        elementTypeSelected = null;
    }
}

/**
 * @description Changes the current visual cursor style for the user.
 * @param {Number} cursorMode containerStyle value. This will be translated into appropriate container style.
 */
function setContainerStyles(cursorMode = mouseModes.POINTER) {
    containerStyle = document.getElementById("container").style;

    switch (cursorMode) {
        case mouseModes.POINTER:
            containerStyle.cursor = "grab";
            break;
        case mouseModes.BOX_SELECTION:
            containerStyle.cursor = "crosshair";
            break;
        case mouseModes.PLACING_ELEMENT:
            containerStyle.cursor = "default";
            break;
        case mouseModes.EDGE_CREATION:
            containerStyle.cursor = "default";
            break;
        default:
            break;
    }
}

/**
 * @description Function triggered just AFTER the current mouse mode is changed.
 */
function onMouseModeEnabled() {
    // Add the diagramActive to current diagramIcon
    if (mouseMode === mouseModes.PLACING_ELEMENT) {
        document.getElementById("elementPlacement" + elementTypeSelected).classList.add("active");
    } else {
        document.getElementById("mouseMode" + mouseMode).classList.add("active");
    }

    switch (mouseMode) {
        case mouseModes.POINTER:
            break;
        case mouseModes.PLACING_ELEMENT:
            clearContext();
            clearContextLine();
            makeGhost();
            break;
        case mouseModes.EDGE_CREATION:
            clearContext();
            clearContextLine();
            updatepos();
            break;
        case mouseModes.BOX_SELECTION:
            break;
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeEnabled()!`);
            break;
    }
}

/**
 * @description Function triggered just BEFORE the current mouse mode is changed.
 */
function onMouseModeDisabled() {
    // Remove all "active" classes in nav bar
    const navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }

    switch (mouseMode) {
        case mouseModes.POINTER:
            break;
        case mouseModes.EDGE_CREATION:
            ghostLine = null; // continues into mouseMode.PLACING_ELEMENT
        // NO BREAK
        case mouseModes.PLACING_ELEMENT:
            ghostElement = null;
            showdata();
            break;
        case mouseModes.BOX_SELECTION:
            break;
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeDisabled()!`);
            break;
    }
}

/**
 * @description Cycles to the next item in a submenu when the same keybind is pressed again.
 * @param {Array} subMenu What sub menu array to get elementType from
 */
function subMenuCycling(subMenu, type) {
    // Cycle through sub menu items
    if (mouseMode == mouseModes.PLACING_ELEMENT && subMenu.includes(elementTypeSelected)) {
        for (let i = 0; i < subMenu.length; i++) {
            if (elementTypeSelected == subMenu[i]) {
                togglePlacementType(subMenu[(i + 1) % subMenu.length], type);
                setElementPlacementType(subMenu[(i + 1) % subMenu.length]);
                setMouseMode(mouseModes.PLACING_ELEMENT);
                break;
            }
        }
        return true;
    }
    return false;
}

/**
 * @description Called on mouse moving if no pointer state has blocked the event in mmoving()-function.
 */
function mouseMode_onMouseMove(event) {
    mouseOverLine = determineLineSelect(event.clientX, event.clientY);
    // Change cursor style if mouse pointer is over a line.
    if (mouseOverLine && !mouseButtonDown) {
        containerStyle.cursor = "pointer";
    } else if (!mouseOverElement) {
        setContainerStyles(mouseMode);
    }
    switch (mouseMode) {
        case mouseModes.EDGE_CREATION:
            mouseOverSelection(event.clientX, event.clientY); // This case defaults to mouseModes.PLACING_ELEMENT, however the effect this method provides is currently only for EDGE_CREATION
        case mouseModes.PLACING_ELEMENT:
            if (ghostElement) {
                setGhostPosition(event.clientX, event.clientY);
                showdata();
                updatepos();
            }
            break;
        case mouseModes.POINTER:
            mouseOverSelection(event.clientX, event.clientY);
            break;
        case mouseModes.BOX_SELECTION:
            boxSelect_Update(event.clientX, event.clientY);
            updatepos();
            mouseOverSelection(event.clientX, event.clientY);
            break;
        default:
            break;
    }
}
