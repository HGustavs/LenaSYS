/**
 * @fileoverview
 * Contains JavaScript functions for managing UI features in the diagram application.
 */

/**
 * @description Toggles the display of the diagram dropdown menu and updates the button style.
 * Shows or hides the dropdown and loading elements, and changes the button 
 * appearance based on the dropdown's visibility.
 */
function toggleDiagramDropdown() {
    const dropdown = document.getElementById("diagramTypeDropdown");
    const load = document.getElementById("diagramLoad");
    const btn = document.getElementById("diagramDropDownToggle");

    if (window.getComputedStyle(dropdown).display === "none") {
        load.style.display = "block";
        dropdown.style.display = "block";
    } else {
        load.style.display = "none";
        dropdown.style.display = "none";
    }

    document.getElementById("diagramDropDownToggle").classList.toggle("active");

    if (window.getComputedStyle(dropdown).display === "none") {
        btn.style.backgroundColor = "transparent";
        btn.style.border = `3px solid ${color.PURPLE}`;
        btn.style.color = color.PURPLE;
        btn.style.fontWeight = "bold";
    } else {
        btn.style.backgroundColor = color.PURPLE;
        btn.style.color = color.WHITE;
        btn.style.fontWeight = "normal";
        btn.style.border = `3px solid ${color.PURPLE}`;
    }
}

/**
 * @description Toggles the display of the SVG grid and updates the button style. 
 * Shows or hides the grid element and changes the button appearance 
 * to indicate whether the grid is active or not.
 */
function toggleGrid() {
    const grid = document.getElementById("svggrid");
    const gridButton = document.getElementById("gridToggle");

    // Toggle active class on button
    document.getElementById("gridToggle").classList.toggle("active");

    // Toggle active grid + color change of button to clarify if button is pressed or not
    if (grid.style.display == "block") {
        grid.style.display = "none";
        gridButton.style.backgroundColor = "transparent";
        gridButton.style.border = `3px solid ${color.PURPLE}`;
        gridButton.style.color = color.PURPLE;
        gridButton.style.fontWeight = "bold";
    } else {
        grid.style.display = "block";
        gridButton.style.backgroundColor = color.PURPLE;
        gridButton.style.color = color.WHITE;
        gridButton.style.fontWeight = "normal";
        gridButton.style.border = `3px solid ${color.PURPLE}`;
    }
}

/**
 * @description Toggles the visibility of the keybind list.
 * Shows or hides the element with the ID "markdownKeybinds" based on its current display style.
 */
function toggleKeybindList() {
    const element = document.getElementById("markdownKeybinds");
    if (element.style.display == "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

/**
 * @description Toggles the ER-table for the diagram in the "Options side-bar" on/off.
 */
function toggleErTable() {
    // Remove all "active" classes in nav bar
    const navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }
    // Add the diagramActive to current diagramIcon
    document.getElementById("erTableToggle").classList.add("active");

    if (erTableToggle == false) {
        erTableToggle = true;
        testCaseToggle = false;
    } else if (erTableToggle == true) {
        erTableToggle = false;
    }
    //if the options pane is hidden, show it.
    if (document.getElementById("options-pane").className == "hide-options-pane") {
        toggleOptionsPane();
        erTableToggle = true;
        testCaseToggle = false;
    }
    generateContextProperties();
}

/**
 * @description Toggles the testcases for the diagram in the "Options side-bar" on/off.
 */
function toggleTestCase() {
    // Remove all "active" classes in nav bar
    const navButtons = document.getElementsByClassName("toolbarMode");
    for (let i = 0; i < navButtons.length; i++) {
        if (navButtons[i].classList.contains("active")) navButtons[i].classList.remove("active");
    }
    // Add the diagramActive to current diagramIcon
    document.getElementById("testCaseToggle").classList.add("active");

    if (testCaseToggle == false) {
        testCaseToggle = true;
        erTableToggle = false;
    } else if (testCaseToggle == true) {
        testCaseToggle = false;
    }
    if (document.getElementById("options-pane").className == "hide-options-pane") {
        toggleOptionsPane();
        testCaseToggle = true;
        erTableToggle = false;
    }
    generateContextProperties();
}

/**
 * @description Toggles the A4 template ON/OFF.
 */
function toggleA4Template() {
    const template = document.getElementById("a4Template");
    const a4Rect = document.getElementById("a4Rect");
    const vRect = document.getElementById("vRect");

    // Toggle active class on button
    document.getElementById("a4TemplateToggle").classList.toggle("active");

    if (template.style.display == "block") {
        template.style.display = "none";
        vRect.style.display = "none";
        a4Rect.style.display = "none";
        document.getElementById("a4OptionsDropdownContainer").style.display = "none";
        
        document.getElementById("a4TemplateToggle").style.backgroundColor = "transparent";
        document.getElementById("a4TemplateToggle").style.color = color.PURPLE;
        document.getElementById("a4TemplateToggle").style.fontWeight = "bold";
    } else {
        template.style.display = "block";
        document.getElementById("a4OptionsDropdownContainer").style.display = "block";
        
        document.getElementById("a4TemplateToggle").style.backgroundColor = color.PURPLE;
        document.getElementById("a4TemplateToggle").style.color = color.WHITE;
        document.getElementById("a4TemplateToggle").style.fontWeight = "normal";
    }
    document.getElementById("a4TemplateToggle").style.border = `3px solid ${color.PURPLE}`;
}

function toggleA4Dropdown() {
    const dropdown = document.getElementById("a4OptionsDropdown");
    const load = document.getElementById("a4Load");
    const btn = document.getElementById("a4TemplateToggle");

    if (window.getComputedStyle(dropdown).display === "none") {
        load.style.display = "block";
        dropdown.style.display = "block";
    } else {
        load.style.display = "none";
        dropdown.style.display = "none";
    }

    document.getElementById("a4TemplateToggle").classList.toggle("active");

    if (window.getComputedStyle(dropdown).display === "none") {
        btn.style.backgroundColor = "transparent";
        btn.style.border = `3px solid ${color.PURPLE}`;
        btn.style.color = color.PURPLE;
        btn.style.fontWeight = "bold";
    } else {
        btn.style.backgroundColor = color.PURPLE;
        btn.style.color = color.WHITE;
        btn.style.fontWeight = "normal";
        btn.style.border = `3px solid ${color.PURPLE}`;
    }
}

function setA4SizeFactor(e) {
    //store 1 + increased procent amount
    settings.grid.a4SizeFactor = parseInt(e.target.value) / 100;
    updateA4Size();
}

/**
 * @description Toggles the visibility of the A4 vertical rectangle and hides the horizontal rectangle.
 */
function toggleA4Vertical() {
    const vRect = document.getElementById("vRect");
    const a4Rect = document.getElementById("a4Rect");

    vRect.style.display = "none";  // Hide horizontal
    a4Rect.style.display = "block";  // Show vertical
}

/**
 * @description Toggles the visibility of the A4 horizontal rectangle and hides the vertical rectangle.
 */
function toggleA4Horizontal() {
    const vRect = document.getElementById("vRect");
    const a4Rect = document.getElementById("a4Rect");

    a4Rect.style.display = "none";  // Hide vertical
    vRect.style.display = "block";  // Show horizontal
}

/**
 * @description Applies the selected A4 option: vertical or horizontal
 */
function applyA4Option() {
    const selectedOption = document.getElementById("a4OptionsDropdown").value;

    if (selectedOption === "vertical") {
        toggleA4Vertical();
    } else if (selectedOption === "horizontal") {
        toggleA4Horizontal();
    }
}

/**
 * @description Toggles weither the snap-to-grid logic should be active or not. The GUI button will also be flipped.
 */
function toggleSnapToGrid() {
    // Toggle active class on button
    document.getElementById("rulerSnapToGrid").classList.toggle("active");

    // Toggle the boolean
    settings.grid.snapToGrid = !settings.grid.snapToGrid;

    // Color change of button to clarify if button is pressed or not
    if (settings.grid.snapToGrid) {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = color.PURPLE;
        document.getElementById("rulerSnapToGrid").style.color = color.WHITE;
        document.getElementById("rulerSnapToGrid").style.fontWeight = "normal";
        document.getElementById("rulerSnapToGrid").style.border = `3px solid ${color.PURPLE}`;
    } else {
        document.getElementById("rulerSnapToGrid").style.backgroundColor = "transparent";
        document.getElementById("rulerSnapToGrid").style.border = `3px solid ${color.PURPLE}`;
        document.getElementById("rulerSnapToGrid").style.color = color.PURPLE;
        document.getElementById("rulerSnapToGrid").style.fontWeight = "bold";
    }
}

/**
 * @description Toggles weither the ruler is visible or not for the end user.
 */
function toggleRuler() {
    const ruler = document.getElementById("rulerOverlay");
    const rulerToggleButton = document.getElementById("rulerToggle");

    // Toggle active class on button
    document.getElementById("rulerToggle").classList.toggle("active");

    // Toggle active ruler + color change of button to clarify if button is pressed or not
    if (settings.ruler.isRulerActive) {
        // ruler.style.left = "-100px";
        // ruler.style.top = "-100px";
        ruler.style.display = 'none';
        rulerToggleButton.style.backgroundColor = "transparent";
        rulerToggleButton.style.border = `3px solid ${color.PURPLE}`;
        rulerToggleButton.style.color = color.PURPLE;
        rulerToggleButton.style.fontWeight = "bold";
    } else {
        ruler.style.display = 'block';

        if (window.innerWidth > 414) {
            ruler.style.left = "50px";
            ruler.style.top = "0px";
        }
        else {
            ruler.style.left = "0px";
            ruler.style.top = "0px";
        }

        rulerToggleButton.style.backgroundColor = color.PURPLE;
        rulerToggleButton.style.color = color.WHITE;
        rulerToggleButton.style.fontWeight = "normal";
        rulerToggleButton.style.border = `3px solid ${color.PURPLE}`;
    }
    settings.ruler.isRulerActive = !settings.ruler.isRulerActive;
    drawRulerBars(scrollx, scrolly);
}

/**
 * @description Toggles the visibility and active state of a placement type box based on the provided number.
 * @param {number} num - The number identifying the placement type box.
 */
function togglePlacementTypeBox(num) {
    if (!document.getElementById("togglePlacementTypeButton" + num).classList.contains("activeTogglePlacementTypeButton")) {
        for (let index = 0; index < document.getElementsByClassName("togglePlacementTypeButton").length; index++) {
            if (document.getElementsByClassName("togglePlacementTypeButton")[index].classList.contains("activeTogglePlacementTypeButton")) {
                document.getElementsByClassName("togglePlacementTypeButton")[index].classList.remove("activeTogglePlacementTypeButton");
            }
            if (document.getElementsByClassName("togglePlacementTypeBox")[index].classList.contains("activeTogglePlacementTypeBox")) {
                document.getElementsByClassName("togglePlacementTypeBox")[index].classList.remove("activeTogglePlacementTypeBox");
            }
        }
        document.getElementById("togglePlacementTypeButton" + num).classList.add("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox" + num).classList.add("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement" + num).children.item(1).classList.remove("toolTipText");
        document.getElementById("elementPlacement" + num).children.item(1).classList.add("hiddenToolTiptext");
    } else {
        document.getElementById("elementPlacement" + num).children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement" + num).children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton" + num).classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox" + num).classList.remove("activeTogglePlacementTypeBox");
    }
}

/**
 * @description toggles which entity placement type is selected for the different types of diagrams.
 * @param {Number} num the number connected to the element selected.
 * @param {Number} type the type of element selected. (which pop-out we are referring to)
 */
function togglePlacementType(num, type) {
    if (type == 0) {
        document.getElementById("elementPlacement0").classList.add("hiddenPlacementType");// ER entity start
        document.getElementById("elementPlacement0").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement0").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton0").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox0").classList.remove("activeTogglePlacementTypeBox");// ER entity end
        document.getElementById("elementPlacement4").classList.add("hiddenPlacementType");// UML entity start
        document.getElementById("elementPlacement4").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement4").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton4").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox4").classList.remove("activeTogglePlacementTypeBox");// UML entity end
        document.getElementById("elementPlacement6").classList.add("hiddenPlacementType");// IE entity start
        document.getElementById("elementPlacement6").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement6").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton6").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox6").classList.remove("activeTogglePlacementTypeBox");// IE entity end
        document.getElementById("elementPlacement8").classList.add("hiddenPlacementType");// SD state start
        document.getElementById("elementPlacement8").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement8").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton8").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox8").classList.remove("activeTogglePlacementTypeBox");// SD state end
    } else if (type == 1) {
        document.getElementById("elementPlacement1").classList.add("hiddenPlacementType");// ER relation start
        document.getElementById("elementPlacement1").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement1").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton1").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox1").classList.remove("activeTogglePlacementTypeBox");// ER relation end
        document.getElementById("elementPlacement5").classList.add("hiddenPlacementType"); // UML inheritance start
        document.getElementById("elementPlacement5").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement5").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton5").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox5").classList.remove("activeTogglePlacementTypeBox");// UML inheritance end
        document.getElementById("elementPlacement7").classList.add("hiddenPlacementType"); //IE inheritance start
        document.getElementById("elementPlacement7").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement7").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton7").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox7").classList.remove("activeTogglePlacementTypeBox"); // IE inheritance end
        document.getElementById("elementPlacement2").classList.add("hiddenPlacementType"); // ER ATTR START
        document.getElementById("elementPlacement2").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement2").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton2").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox2").classList.remove("activeTogglePlacementTypeBox"); // ER ATTR END
    } else if (type == 9) {
        document.getElementById("elementPlacement9").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement9").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement9").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton9").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox9").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement10").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement10").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement10").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton10").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox10").classList.remove("activeTogglePlacementTypeBox");
        document.getElementById("elementPlacement11").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement11").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement11").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton11").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox11").classList.remove("activeTogglePlacementTypeBox");
    } else if (type == 12) {
        // Sequence lifeline (actor)
        document.getElementById("elementPlacement12").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement12").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement12").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton12").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox12").classList.remove("activeTogglePlacementTypeBox");
        // Sequence activation
        document.getElementById("elementPlacement13").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement13").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement13").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton13").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox13").classList.remove("activeTogglePlacementTypeBox");
        // Sequence condition/loop object
        document.getElementById("elementPlacement14").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement14").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement14").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton14").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox14").classList.remove("activeTogglePlacementTypeBox");
        // Sequence lifeline (object)
        document.getElementById("elementPlacement16").classList.add("hiddenPlacementType");
        document.getElementById("elementPlacement16").children.item(1).classList.add("toolTipText");
        document.getElementById("elementPlacement16").children.item(1).classList.remove("hiddenToolTiptext");
        document.getElementById("togglePlacementTypeButton16").classList.remove("activeTogglePlacementTypeButton");
        document.getElementById("togglePlacementTypeBox16").classList.remove("activeTogglePlacementTypeBox");

    }
    // Unhide the currently selected placement type
    document.getElementById("elementPlacement" + num).classList.remove("hiddenPlacementType");
}

/**
 * @description Hides all active placement type boxes.
 */
function hidePlacementType() {
    let i = 0;

    while (true) {
        if (document.getElementById("togglePlacementTypeBox" + i)) {
            document.getElementById("togglePlacementTypeBox" + i).classList.remove("activeTogglePlacementTypeBox");
        } else if (!document.getElementById("togglePlacementTypeBox" + i) && !document.getElementById("togglePlacementTypeButton" + (i + 1))) {
            break;
        }
        i++;
    }
}

/**
 * @description Toggles the darkmode for svgbacklayer ON/OFF.
 */
function toggleDarkmode() {
    const stylesheet = document.getElementById("themeBlack");
    const storedTheme = localStorage.getItem('diagramTheme');
    const btn = document.getElementById("darkmodeToggle");

    if (storedTheme) stylesheet.href = storedTheme;

    if (stylesheet.href.includes('blackTheme')) {
        // if it's dark -> go light
        stylesheet.href = "../Shared/css/style.css";
        localStorage.setItem('diagramTheme', stylesheet.href)
    } else if (stylesheet.href.includes('style')) {
        // if it's light -> go dark
        stylesheet.href = "../Shared/css/blackTheme.css";
        localStorage.setItem('diagramTheme', stylesheet.href)
    }
    if (stylesheet.href.includes('blackTheme')) {
        btn.style.backgroundColor = color.PURPLE;
        btn.style.color = color.WHITE;
        btn.style.fontWeight = "normal";
        btn.style.border = `3px solid ${color.PURPLE}`;
    } else {
        btn.style.backgroundColor = "transparent";
        btn.style.border = `3px solid ${color.PURPLE}`;
        btn.style.color = color.PURPLE;
        btn.style.fontWeight = "bold";
    }
    showdata();
    toggleBorderOfElements();
}

/**
 * @description Opens the color menu for selecting element color
 * @param {String} buttonID containing the ID of the button that was pressed
 */
function toggleColorMenu(buttonID) {
    const button = document.getElementById(buttonID);
    let menu;
    let width = 0;

    // If the color menu's inner html is empty
    if (button.children[0].innerHTML == "") {
        menu = button.children[0];
        menu.style.visibility = "visible";
        if (menu.id === "BGColorMenu") {
            // Create svg circles for each element in the "colors" array
            for (let i = 0; i < MENU_COLORS.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="BGColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${MENU_COLORS[i]}" onclick="setElementColors('BGColorCircle${i}')" stroke='${color.BLACK}' stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        } else {
            // Create svg circles for each element in the "strokeColors" array
            for (let i = 0; i < strokeColors.length; i++) {
                menu.innerHTML += `<svg class="colorCircle" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle id="strokeColorCircle${i}" class="colorCircle" cx="25" cy="25" r="20" fill="${strokeColors[i]}" onclick="setElementColors('strokeColorCircle${i}')" stroke='${color.BLACK}' stroke-width="2"/>
            </svg>`;
                width += 50;
            }
        }
        // Menu position relative to button
        menu.style.maxHeight = "600px";
    } else {    // if the color menu's inner html is not empty, remove the content
        menu = button.children[0];
        menu.innerHTML = "";
        menu.style.visibility = "hidden";
        showdata();
    }
}

/**
 * @description Sets the fill and/or stroke color of all elements in context
 * @param {String} clickedCircleID containing the ID of the svg circle that was pressed
 */
function setElementColors(clickedCircleID) {
    let color;
    let index;
    const id = clickedCircleID;
    const menu = document.getElementById(clickedCircleID).parentElement.parentElement;
    const elementIDs = [];

    // If fill button was pressed
    if (menu.id == "BGColorMenu") {
        index = id.replace("BGColorCircle", "") * 1;
        color = MENU_COLORS[index];
        for (let i = 0; i < context.length; i++) {
            context[i].fill = color;
            elementIDs.push(context[i].id)
        }
        stateMachine.save(elementIDs, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else if (menu.id == "StrokeColorMenu") {  // If stroke button was pressed
        index = id.replace("strokeColorCircle", "") * 1;
        color = strokeColors[index];
        for (let i = 0; i < context.length; i++) {
            context[i].stroke = color;
            elementIDs[i] = context[i].id;
        }
        stateMachine.save(elementIDs, StateChange.ChangeTypes.ELEMENT_ATTRIBUTE_CHANGED);
    } else {
        console.error(`${menu.id} is not a valid ID`);
    }
    generateContextProperties();
    showdata();
    toggleColorMenu(menu.parentElement.id); // toggle color menu off when a color is selected
}

/**
 * @description turns the error checking functionality on/off
 */
function toggleErrorCheck() {
    // Inverts the errorActive variable to true or false
    errorActive = !errorActive;
    if (errorActive) {
        document.getElementById("errorCheckToggle").classList.add("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is on.');
    } else {
        document.getElementById("errorCheckToggle").classList.remove("active");
        displayMessage(messageTypes.SUCCESS, 'Error Check tool is off.');
    }
    showdata();
}

/**
 * @description Function that toggles the visibility of the error check button in the diagram toolbar depending on input.
 * @param {boolean} show Boolean which defines visibility. "true" enables it, and "false" disables it.
 */
//Previously named "hideErrorCheck", functionality is the same - but showing the check while "hideErrorCheck(true)" was a bit confusing and misleading.
function showErrorCheck(show) {
    if (show) {
        document.getElementById("errorCheckField").style.display = "flex";
    } else {
        document.getElementById("errorCheckField").style.display = "none";
    }
}
/**
 * @description Toggles the visibility of the diagram toolbar 
 */

function toggleToolbar() {
    let toggleBtn = document.querySelector(".icon-wrapper");
    let toolbar = document.getElementById("mb-diagram-toolbar");
    let chevronIcon = document.querySelector(".toggle-chevron");

    let ChevronActive = toggleBtn.classList.toggle("toolbar-active");
    let toolbarActive = toolbar.classList.toggle("active");

    /*
    * Determines wether to rotate the chevron icon if the toolbar and * toggleBtn is in a active state
    */
    if (ChevronActive && toolbarActive) {
        chevronIcon.style.transform = `rotate(180deg)`;
        toolbar.setAttribute("aria-hidden", "false")
    }
    else {
        chevronIcon.style.transform = `rotate(0deg)`;
        toolbar.setAttribute("aria-hidden", "true")
    }
}

/**
 * @description Function that toggles the active state of the toolbar modes and opening sub menus if they exist.
 * @param {*} e event-object that is used for finding the current elements next element sibling
 */
function handleToolbarClick(e){
    e.stopPropagation(); //Stops event bubbling
    const clickedElement = e.currentTarget;
    let nextSibling = clickedElement.nextElementSibling;
    let activeElement = document.querySelector(".mb-toolbar-main.active");
    let dropIcon = clickedElement.parentNode.querySelector(".mb-dropdown-icon i");

    //Does not close sub menus if the clicked element is a sub menu element
    if(clickedElement.closest(".mb-sub-menu")) return;

    //Does not change the active state of the if the clicked element already is the active element in the toolbar
    if(!clickedElement || clickedElement===activeElement) return;

    //acts a falsy check which means if the activeElement exists then it executes the if-statement
    if(activeElement){
        activeElement.classList.remove("active");
    }
    clickedElement.classList.add("active");

    //Closes every sub menu except the one that is being opened (nextSibling)
    document.querySelectorAll(".mb-sub-menu.show").forEach(subMenu=>{
        if(subMenu!==nextSibling){
            subMenu.setAttribute("aria-hidden", "true"); //For screen readers, basically says that the sub menu is closed/hidden
            subMenu.classList.remove("show");
            let dropIcon = subMenu.parentNode.querySelector(".mb-dropdown-icon i");
            if(dropIcon) dropIcon.classList.remove("rotation");
        }
    });

    if(dropIcon) dropIcon.classList.add("rotation");

    //Only opens a sub menu if the sibling of clicked element exist and is a sub menu
    if(nextSibling && nextSibling.classList.contains("mb-sub-menu")){
        nextSibling.classList.add("show");
        nextSibling.setAttribute("aria-hidden", "false");
        activeSubMenuElement(e.currentTarget);
    }
}

/**
 * @description Function that marks which element that is being active in the sub menu
 * @param {*} element event-object that contains information about the clicked element
 */
function activeSubMenuElement(element){
    let dropdownItems = document.querySelectorAll(".mb-sub-menu .mb-toolbar-box");
    let elementType = element.dataset.elementtype;

    /*Loops through all the sub menu elements, and checks if the active element and the sub menu have the same elementtype (e.g. ER-E === ER-E). */
    dropdownItems.forEach(item=>{
        item.classList.remove("active");
        let itemType = item.dataset.elementtype;
        if(itemType===elementType){
            item.classList.add("active");
        }
    });
}

/**
 * @description Function that changes which element that is active after choosing a sub menu element
 * @param {*} e event-object that contains information about the clicked element
 */
function changeActiveElement(e){
    //Finds the closest parent to the clicked element 
    //Used to only update the active element in the same parent
    let dropdownList = e.currentTarget.closest(".has-dropdown");
    if(!dropdownList) return;

    //Always chooses the first element of the parent, which is always the active element
    let firstActiveElement = dropdownList.querySelector(".mb-toolbar-box");
    if(!firstActiveElement) return;

    // Finds the image inside the firstActiveElement
    let activeImage = firstActiveElement.querySelector(".active-image");
    if(!activeImage) return;

    //Fetches all the information necessary from the clicked sub menu element in the form of datasets
    let imageSrc = e.currentTarget.dataset.imagesrc;
    let placementType = e.currentTarget.dataset.placementtype;
    let elementType = e.currentTarget.dataset.elementtype;
    let elementMode = e.currentTarget.dataset.mode;
    
    //Switches the active elements datasets with the sub menus datasets
    activeImage.src = imageSrc;
    firstActiveElement.dataset.mode = elementMode;
    firstActiveElement.dataset.elementtype = elementType;
    firstActiveElement.dataset.placementtype = placementType;
    firstActiveElement.dataset.imagesrc = imageSrc;
    activeSubMenuElement(e.currentTarget);
}

/**
 * @description Function that lets the user know that the item was clicked but is not being focused. 
 * @param {*} el it references to the element that was clicked
 */
function nonElementToggle(el){
    el.classList.add("active");

    //Removes the class after 1500ms/1.5s
    setTimeout(()=>{
        el.classList.remove("active");
    }, 1500);
}