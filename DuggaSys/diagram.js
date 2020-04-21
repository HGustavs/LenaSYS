/************************************************************

    THIS FILE HANDLES THE MAIN FUNCTIONS OF THE DIAGRAM

************************************************************/
/***********************************************
    CANVAS FUNCTIONS NEEDS TO USE THE MAPPING
    FUNCTIONS: pixelsToCanvas() OR
    canvasToPixels() AS THE CANVAS IS STATIC
    AND THE OBJECTS ARE RENDERED ACCORDING TO
    THE CANVAS TOPLEFT'S OFFSET FROM ORIGO
************************************************/

var querystring = parseGet();
var retdata;

AJAXService("get", {}, "DIAGRAM");
/*
-----------------------=====================##################=====================-----------------------
                                        Layout (curve drawing tools)
-----------------------=====================##################=====================-----------------------
    Path - A collection of segments
        fill color
        line color
        a number of segments
    Segment - A collection of curves connecting points
    Point - A 2d coordinate
*/

/************************************************************

    Globals

************************************************************/

//--------------------------------------------------------------------
// diagram - Stores a global list of diagram objects
//           A diagram object could for instance be a path, or a symbol
//--------------------------------------------------------------------

var diagram = [];

var settings = {
    serialNumbers: {
        Attribute: 0,
        Entity: 0,
        Relation: 0,
        UML: 0,
        Text: 0,
    },

    properties: {
        fillColor: '#ffffff',                         // Change background colors on entities.
        strokeColor: '#000000',                       // Change standard line color.
        fontColor: '#000000',                         // Change the color of the font.
        font: 'Arial',                                // Set the standard font.
        lineWidth: '2',                               // LineWidth preset is 2.
        textSize: '14',                               // 14 pixels text size is default.
        sizeOftext: 'Tiny',                           // Used to set size of text.
        textAlign: 'center',                          // Used to change alignment of free text.
        key_type: 'Normal',                           // Defult key type for a class.
        isComment: false	                          // Used to se if text are comments and if they should be hidden.
    },
};

var globalObjectID = 0;

const kind = {
    path: 1,
    symbol: 2
};

var currentMode = {
    er: "ER",
    uml: "UML",
    dev: "Dev"
};

const symbolKind = {
    uml: 1,
    erAttribute: 2,
    erEntity: 3,
    line: 4,
    erRelation: 5,
    text: 6,
    umlLine: 7
};

const mouseState = {
    empty: 0,                       // empty
    noPointAvailable: 1,            // mouse is pressed down and no point is close show selection box
    insidePoint: 2,                 // mouse is pressed down and at a point in selected object
    insideMovableObject: 3,         // mouse pressed down inside a movable object
    boxSelectOrCreateMode: 4        // Box select or Create mode
};

var gridSize = 16;                  // Distance between lines in grid
var tolerance = 8;                  // Size of tolerance area around the point
var ctx;                            // Canvas context
var canvas;                         // Canvas Element
var sel;                            // Selection state
var currentMouseCoordinateX = 0;
var currentMouseCoordinateY = 0;
var startMouseCoordinateX = 0;      // X coordinate for mouse to get diff from current when moving
var startMouseCoordinateY = 0;      // Y coordinate for mouse to get diff from current when moving
var cameraPosX = parseInt(localStorage.getItem("cameraPosX") || 0); //Fetches last camera X position recorded, uses 0 if non recorded
var cameraPosY = parseInt(localStorage.getItem("cameraPosY") || 0); //Fetches last camera Y position recorded, uses 0 if non recorded
var origoOffsetX = cameraPosX         // Canvas x topleft offset from origo
var origoOffsetY = cameraPosY          // Canvas y topleft offset from origo
var boundingRect;                   // Canvas offset in browser
var canvasLeftClick = false;            // Canvas left click state
var canvasRightClick = false;           // Canvas right click state
var lastZoomValue = localStorage.getItem("zoomValue") || 1.00;      //Records last zoomvalue, 1.00 if none has been recorded
var zoomValue = lastZoomValue;
var md = mouseState.empty;          // Mouse state, Mode to determine action on canvas
var hoveredObject = false;
var markedObject = false;
var lineStartObj = -1;
var movobj = -1;                    // Moving object ID
var lastSelectedObject = -1;        // The last selected object
var uimode = "normal";              // User interface mode e.g. normal or create class currently
var figureType = null;              // Specification of uimode, when Create Figure is set to the active mode this is set to one of the forms a figure can be drawn in.
var consoleInt = 0;
var waldoPoint = "";
var moveValue = 0;                  // Used to deside if the canvas should translate or not
var activePoint = null;             // This point indicates what point is being hovered by the user
var p1 = null;                      // When creating a new figure, these two variables are used ...
var p2 = null;                      // to keep track of points created with mousedownevt and mouseupevt
var p3 = null;                      // Middlepoint/centerPoint
var snapToGrid = false;             // Will the clients actions snap to grid
var toggleA4 = false;               // toggle if a4 outline is drawn
var toggleA4Holes = false;          // toggle if a4 holes are drawn
var switchSideA4Holes = "left";     // switching the sides of the A4-holes
var A4Orientation = "portrait";     // If virtual A4 is portrait or landscape
var singleA4 = false;               // Toggle between single/repeated A4
var enableShortcuts = true;         // Used to toggle on/off keyboard shortcuts
var targetMode = "ER";              // Default targetMode
var crossStrokeStyle1 = "#f64";     // set the color for the crosses.
var crossFillStyle = "#d51";
var crossStrokeStyle2 = "#d51";
var modeSwitchDialogActive = false; // if the mode switch dialog is currently active
var distanceMovedX = 0;             // the distance moved since last use of resetViewToOrigin()
var distanceMovedY = 0;
var minEntityX = 100;               //the minimum size for an Entity are set by the values seen below.
var minEntityY = 50;
var hashUpdateTimer = 5000;         // set timer varibale for hash and saving
var currentHash = 0;
var lastDiagramEdit = localStorage.getItem('lastEdit');          // the last date the diagram was change in milisecounds.
var refreshTimer = setRefreshTime();              //  set how often the diagram should be refreshed.
var refresh_lock = false;           // used to set if the digram should stop refreshing or not.
var moved = false;                  //used to check if object has moved
var attributeTemplate = {           // Defines entity/attribute/relations predefined sizes
  width: 7 * gridSize,
  height: 4 * gridSize
};
var entityTemplate = {
  width: 7 * gridSize,
  height: 4 * gridSize
};
var relationTemplate = {
  width: 7 * gridSize,
  height: 4 * gridSize
};
var classTemplate = {
  width: 7 * gridSize,
  height: 7 * gridSize
};
var minimumDivisor = 4;                 // Is used when dividing templates for minimum selection before activating dragging mode values
var a = [], b = [], c = [];
var selected_objects = [];              // Is used to store multiple selected objects
var globalappearanceMenuOpen = false;   // True if global appearance menu is open 
var diagramNumber = 0;                  // Is used for localStorage so that undo and redo works.
var diagramCode = "";                   // Is used to stringfy the diagram-array
var appearanceMenuOpen = false;         // True if appearance menu is open
var classAppearanceOpen = false;        // True if appearance menu is open for type class
var textAppearanceOpen = false;         // True if appearance menu is open for type text
var symbolStartKind;                    // Is used to store which kind of object you start on
var symbolEndKind;                      // Is used to store which kind of object you end on
var cloneTempArray = [];                // Is used to store all selected objects when ctrl+c is pressed
var spacebarKeyPressed = false;         // True when entering MoveAround mode by pressing spacebar.
var toolbarState = currentMode.er;      // Set default toolbar state to ER.
var hideComment = false;				//Used to se if the comment marked text should be hidden(true) or shown(false)

// Default keyboard keys
const defaultBackspaceKey = 8;
const defaultEnterKey = 13;
const defaultShiftKey = 16;
const defaultCtrlKey = 17;
const defaultAltKey = 18;
const defaultEscapeKey = 27;
const defaultSpacebarKey = 32;
const defaultLeftArrow = 37;
const defaultUpArrow = 38;
const defaultRightArrow = 39;
const defaultDownArrow = 40;
const defaultDeleteKey = 46;
const defaultKey0 = 48;
const defaultKey1 = 49;
const defaultKey2 = 50;
const defaultKey4 = 52;
const defaultAKey = 65;
const defaultCKey = 67;
const defaultDKey = 68;
const defaultEKey = 69;
const defaultFKey = 70;
const defaultLKey = 76;
const defaultMKey = 77;
const defaultNKey = 78;
const defaultOKey = 79;
const defaultRKey = 82;
const defaultTKey = 84;
const defaultVKey = 86;
const defaultZKey = 90;
const defaultYKey = 89;
const defaultXKey = 88;
const defaultWindowsKey = 91;
const defaultNum1 = 97;
const defaultNum2 = 98;
const defaultLessThanKey = 226;
//Keybinding variables                       
isBindingKey = false;                        // Is used when binding keys
keyBeingBound = null;

// Keyboard keys
var keyMap = { //rebindable keys format is (keyName, default-value)
    backspaceKey : defaultBackspaceKey,
    enterKey : defaultEnterKey,
    shiftKey : defaultShiftKey,
    ctrlKey : defaultCtrlKey,
    altKey : defaultAltKey,
    escapeKey : defaultEscapeKey,
    spacebarKey : defaultSpacebarKey,
    leftArrow : defaultLeftArrow,
    upArrow : defaultUpArrow,
    rightArrow : defaultRightArrow,
    downArrow : defaultDownArrow,
    deleteKey : defaultDeleteKey,
    key0 : defaultKey0,
    key1 : defaultKey1,
    key2 : defaultKey2,
    key4 : defaultKey4,
    aKey : defaultAKey,
    cKey : defaultCKey,
    dKey : defaultDKey,
    eKey : defaultEKey,
    fKey : defaultFKey,
    lKey : defaultLKey,
    mKey : defaultMKey,
    nKey : defaultNKey,
    oKey : defaultOKey,
    rKey : defaultRKey,
    tKey : defaultTKey,
    vKey : defaultVKey,
    zKey : defaultZKey,
    yKey : defaultYKey,
    xKey : defaultXKey,
    windowsKey : defaultWindowsKey,
    num1 : defaultNum1,
    num2 : defaultNum2,
    lessThanKey : defaultLessThanKey,
}

// Map keycodes to key names
const keyCodes = {
    0: 'That key has no keycode',
    3: 'break',
    8: 'backspace / delete',
    9: 'tab',
    12: 'clear',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause/break',
    20: 'caps lock',
    21: 'hangul',
    25: 'hanja',
    27: 'escape',
    28: 'conversion',
    29: 'non-conversion',
    32: 'spacebar',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left arrow',
    38: 'up arrow',
    39: 'right arrow',
    40: 'down arrow',
    41: 'select',
    42: 'print',
    43: 'execute',
    44: 'Print Screen',
    45: 'insert',
    46: 'delete',
    47: 'help',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'semicolon (firefox), equals',
    60: '<',
    61: 'equals (firefox)',
    63: 'ß',
    64: '@ (firefox)',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows Key / Left ⌘ / Chromebook Search key',
    92: 'right window key',
    93: 'Windows Menu / Right ⌘',
    95: 'sleep',
    96: 'numpad 0',
    97: 'numpad 1',
    98: 'numpad 2',
    99: 'numpad 3',
    100: 'numpad 4',
    101: 'numpad 5',
    102: 'numpad 6',
    103: 'numpad 7',
    104: 'numpad 8',
    105: 'numpad 9',
    106: 'multiply',
    107: 'add',
    108: 'numpad period (firefox)',
    109: 'subtract',
    110: 'decimal point',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    131: 'f20',
    132: 'f21',
    133: 'f22',
    134: 'f23',
    135: 'f24',
    136: 'f25',
    137: 'f26',
    138: 'f27',
    139: 'f28',
    140: 'f29',
    141: 'f30',
    142: 'f31',
    143: 'f32',
    144: 'num lock',
    145: 'scroll lock',
    151: 'airplane mode',
    160: '^',
    161: '!',
    162: '؛ (arabic semicolon)',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'page backward',
    167: 'page forward',
    168: 'refresh',
    169: 'closing paren (AZERTY)',
    170: '*',
    171: '~ + * key',
    172: 'home key',
    173: 'minus (firefox), mute/unmute',
    174: 'decrease volume level',
    175: 'increase volume level',
    176: 'next',
    177: 'previous',
    178: 'stop',
    179: 'play/pause',
    180: 'e-mail',
    181: 'mute/unmute (firefox)',
    182: 'decrease volume level (firefox)',
    183: 'increase volume level (firefox)',
    186: 'semi-colon / ñ',
    187: 'equal sign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forward slash / ç',
    192: 'grave accent / ñ / æ / ö',
    193: '?, / or °',
    194: 'numpad period (chrome)',
    219: 'open bracket',
    220: 'back slash',
    221: 'close bracket / å',
    222: 'single quote / ø / ä',
    223: '`',
    224: 'left or right ⌘ key (firefox)',
    225: 'altgr',
    226: 'left back slash',
    230: 'GNOME Compose Key',
    231: 'ç',
    233: 'XF86Forward',
    234: 'XF86Back',
    235: 'non-conversion',
    240: 'alphanumeric',
    242: 'hiragana/katakana',
    243: 'half-width/full-width',
    244: 'kanji',
    251: 'unlock trackpad (Chrome/Edge)',
    255: 'toggle touchpad',
  };

// Mouse clicks
const leftMouseClick = 0;
const scrollClick = 1;
const rightMouseClick = 2;

// This block of the code is used to handel keyboard input;
window.addEventListener("keydown", this.keyDownHandler);

// Checking if on mobile browser. 
const isMobile = /Mobi/.test(window.navigator.userAgent);

var ctrlIsClicked = false;
var shiftIsClicked = false;
var altIsClicked = false;

// This event checks if the user leaves the diagram.php
window.addEventListener('blur', resetButtonsPressed);

//Functions to call after document body loads
function init() {
    initializeCanvas(); 
    canvasSize(); 
    loadDiagram(); 
    setModeOnRefresh(); 
    initAppearanceForm();
    updateGraphics(); 
}

//--------------------------------------------------------------
// DIAGRAM EXAMPLE DATA SECTION
//--------------------------------------------------------------

var erEntityA;

function generateExampleCode() {
    // Declare three paths
    var pathA = new Path;
    var pathB = new Path;
    var pathC = new Path;
    // Add segments to paths
    pathA.addsegment(1, 0, 1);
    pathA.addsegment(1, 1, 3);
    pathA.addsegment(1, 3, 2);
    pathA.addsegment(1, 2, 0);
    pathA.addsegment(1, 6, 7);
    pathA.addsegment(1, 7, 8);
    pathA.addsegment(1, 8, 9);
    pathA.addsegment(1, 9, 6);
    pathB.addsegment(1, 18, 17);
    pathB.addsegment(1, 17, 4);
    pathB.addsegment(1, 4, 5);
    pathB.addsegment(1, 5, 18);
    pathC.addsegment(1, 10, 11);
    pathC.addsegment(1, 11, 13);
    pathC.addsegment(1, 13, 12);
    pathC.addsegment(1, 12, 10);

    // Create a UML Class and add three attributes, two operations and a name
    classA = new Symbol(1);
    classA.name = "Person";
    classA.attributes.push({text:"+ height:Integer"});
    classA.attributes.push({text:"# at:Large"});
    classA.attributes.push({text:"- megalomania:Real"});
    classA.operations.push({text:"+ hold(name:String)"});
    classA.operations.push({text:"- makemore()"});
    classA.topLeft = 14;
    classA.bottomRight = 15;
    classA.middleDivider = 16;
    erAttributeA = new Symbol(2);
    erAttributeA.name = "SSN";
    erAttributeA.topLeft = 19;
    erAttributeA.bottomRight = 20;
    erAttributeA.centerPoint = 21;
    erAttributeB = new Symbol(2);
    erAttributeB.name = "Name";
    erAttributeB.topLeft = 22;
    erAttributeB.bottomRight = 23;
    erAttributeB.centerPoint = 24;
    erAttributeC = new Symbol(2);
    erAttributeC.name = "Smell";
    erAttributeC.topLeft = 30;
    erAttributeC.bottomRight = 31;
    erAttributeC.centerPoint = 32;
    erAttributeD = new Symbol(2);
    erAttributeD.name = "Stink";
    erAttributeD.topLeft = 33;
    erAttributeD.bottomRight = 34;
    erAttributeD.centerPoint = 35;
    erAttributeE = new Symbol(2);
    erAttributeE.name = "Verisimilitude";
    erAttributeE.topLeft = 36;
    erAttributeE.bottomRight = 37;
    erAttributeE.centerPoint = 38;
    erEntityA = new Symbol(3);
    erEntityA.name = "Person";
    erEntityA.topLeft = 25;
    erEntityA.bottomRight = 26;
    erEntityA.centerPoint = 27;
    erattributeRelA = new Symbol(4);
    erattributeRelA.topLeft = 28;
    erattributeRelA.bottomRight = 24;
    erattributeRelB = new Symbol(4);
    erattributeRelB.topLeft = 29;
    erattributeRelB.bottomRight = 21;

    // We connect the connector point to the middle point of the attribute in this case
    erattributeRelC = new Symbol(4);
    erattributeRelC.topLeft = 39;
    erattributeRelC.bottomRight = 32;
    erattributeRelD = new Symbol(4);
    erattributeRelD.topLeft = 40;
    erattributeRelD.bottomRight = 35;
    erattributeRelE = new Symbol(4);
    erattributeRelE.topLeft = 41;
    erattributeRelE.bottomRight = 38;
    erEntityA.connectorRight.push({from:28, to:24});
    erEntityA.connectorRight.push({from:29, to:21});
    erEntityA.connectorLeft.push({from:40, to:35});
    erEntityA.connectorLeft.push({from:39, to:32});
    erEntityA.connectorTop.push({from:41, to:38});

    // Add all elements to diagram
    diagram.push(erattributeRelA);
    diagram.push(erattributeRelB);
    diagram.push(erattributeRelC);
    diagram.push(pathA);
    diagram.push(pathB);
    diagram.push(pathC);
    diagram.push(classA);
    diagram.push(erAttributeA);
    diagram.push(erAttributeB);
    diagram.push(erAttributeC);
    diagram.push(erAttributeD);
    diagram.push(erAttributeE);
    diagram.push(erEntityA);
    diagram.push(erattributeRelD);
    diagram.push(erattributeRelE);
}

//--------------------------------------------------------------------
// This function check if focus on diagram was lost
// Put your action here if you want focus lost as trigger
//--------------------------------------------------------------------

function resetButtonsPressed() {
    ctrlIsClicked = false;
    shiftIsClicked = false;
}

//--------------------------------------------------------------------
// This function unpresses all the classList buttons
// Used between mode switches to ensure right objects in right mode
//--------------------------------------------------------------------

function resetToolButtonsPressed() {
    const elementsToReset = document.querySelectorAll(".pressed:not(#moveButton)");
    elementsToReset.forEach(element => {
        element.classList.remove("pressed");
        element.classList.add("unpressed");
    });

    if(uimode !== "MoveAround") {
        uimode = 'normal';
    }
}

//--------------------------------------------------------------------
// This handles all the key binds for diagram
//--------------------------------------------------------------------

function keyDownHandler(e) {
    var key = e.keyCode;
    if(isBindingKey){
        keyMap[keyBeingBound] = e.which;
        drawKeyMap(keyMap, $("#shortcuts-wrap").get(0));
        isBindingKey = false;
        keyBeingBound = null;
        return;
    }
    if(key == keyMap.escapeKey && appearanceMenuOpen) {
        toggleApperanceElement();
    } else if(key == keyMap.enterKey && appearanceMenuOpen && !classAppearanceOpen && !textAppearanceOpen) {
        submitAppearanceForm();
    }
    if (appearanceMenuOpen) return;
    if ((key == keyMap.deleteKey || key == keyMap.backspaceKey)) {
        eraseSelectedObject(event);
        SaveState();
    }  
    //Check if enter is pressed when "focused" on an item in the dropdown menu
    if(key == keyMap.enterKey) {
        const onclickElements = document.activeElement.querySelectorAll("[onclick]");
        onclickElements.forEach(element => {
        element.click();
        });
    }
    if(enableShortcuts){ // Only enter if keyboard shortcuts are enabled
        if (key == keyMap.spacebarKey) {
            // This if-else statement is used to make sure mouse clicks can not exit the MoveAround mode.
            if (!spacebarKeyPressed) {
                spacebarKeyPressed = true;
            } else {
                spacebarKeyPressed = false;
            }
            //Use space for movearound
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }
            if (uimode != "MoveAround") {
                activateMovearound();
            } else {
                deactivateMovearound();
            }
            updateGraphics();
        } else if((key == keyMap.upArrow || key == keyMap.downArrow || key == keyMap.leftArrow || key == keyMap.rightArrow) && !shiftIsClicked) {
            arrowKeyPressed(key);
            if (uimode == "MoveAround") {
                moveCanvasView(key);
            }
        } else if(key == keyMap.ctrlKey || key == keyMap.windowsKey) {
            ctrlIsClicked = true;
        } else if (key == keyMap.shiftKey) {
            shiftIsClicked = true;
        } else if(key == keyMap.altKey) {
            altIsClicked = true;
        } else if(ctrlIsClicked && key == keyMap.cKey) {
            //Ctrl + c
            fillCloneArray();
        } else if (ctrlIsClicked && key == keyMap.vKey ) {
            //Ctrl + v
            var temp = [];
            for (var i = 0; i < cloneTempArray.length; i++) {
                //Display cloned objects except lines
                if (cloneTempArray[i].symbolkind != symbolKind.line
                    && cloneTempArray[i].symbolkind != symbolKind.umlLine) {
                    const cloneIndex = copySymbol(cloneTempArray[i]) - 1;
                    temp.push(diagram[cloneIndex]);
                }
            }
            cloneTempArray = temp;
            selected_objects = temp;
            updateGraphics();
            SaveState();
        }
        else if (key == keyMap.zKey && ctrlIsClicked) undoDiagram(event);
        else if (key == keyMap.yKey && ctrlIsClicked) redoDiagram(event);
        else if (key == keyMap.aKey && ctrlIsClicked) {
            e.preventDefault();
            for (var i = 0; i < diagram.length; i++) {
                selected_objects.push(diagram[i]);
                diagram[i].targeted = true;
            }
            updateGraphics();
        } else if(key == keyMap.ctrlKey || key == keyMap.windowsKey) {
            ctrlIsClicked = true;
        } else if (key == keyMap.enterKey) {
            if (modeSwitchDialogActive) {
                // if the cancel button is focused then trigger that
                if (document.activeElement.id == "modeSwitchButtonCancel") {
                    modeSwitchConfirmed(false);
                } else {
                modeSwitchConfirmed(true);
                }
            }
        } else if (key == keyMap.escapeKey) {
            cancelFreeDraw();
            deselectObjects();


            if (modeSwitchDialogActive) modeSwitchConfirmed(false);
        } else if ((key == keyMap.key1 || key == keyMap.num1) && shiftIsClicked){
            moveToFront(event);
        } else if ((key == keyMap.key2 || key == keyMap.num2) && shiftIsClicked){
            moveToBack(event);
        } else if (shiftIsClicked && key == keyMap.lKey) {
        document.getElementById("linebutton").click();
        } else if (shiftIsClicked && key == keyMap.aKey && targetMode == "ER") {
        document.getElementById("attributebutton").click();
        } else if (shiftIsClicked && key == keyMap.eKey && targetMode == "ER") {
        document.getElementById("entitybutton").click();
        } else if (shiftIsClicked && key == keyMap.rKey && targetMode == "ER") {
        document.getElementById("relationbutton").click();
        } else if (shiftIsClicked && key == keyMap.cKey && targetMode == "UML") {
        document.getElementById("classbutton").click();
        } else if (shiftIsClicked && key == keyMap.tKey) {
        document.getElementById("drawtextbutton").click();
        } else if (shiftIsClicked && key == keyMap.fKey) {
        document.getElementById("drawfreebutton").click();
        } else if (shiftIsClicked && key == keyMap.dKey) {
        developerMode(event);
        } else if (shiftIsClicked && key == keyMap.mKey  && !modeSwitchDialogActive) {
                toggleMode();
        } else if (shiftIsClicked && key == keyMap.xKey) {
            lockSelected(event);
        } else if (shiftIsClicked && key == keyMap.oKey) {
            resetViewToOrigin(event);
        } else if (shiftIsClicked && key == keyMap.key4) {
            toggleVirtualA4(event);
        } else if (shiftIsClicked && key == keyMap.upArrow) {
            align(event, 'top');
        } else if (shiftIsClicked && key == keyMap.rightArrow) {
            align(event, 'right');
        } else if (shiftIsClicked && key == keyMap.downArrow) {
            align(event, 'bottom');
        } else if (shiftIsClicked && key == keyMap.leftArrow) {
            align(event, 'left');
        }
    }
}

//----------------------------------------------------
// Map actual coordinates to canvas offset from origo
//----------------------------------------------------

function pixelsToCanvas(pixelX = 0, pixelY = 0) {
    return {
        x: pixelX * zoomValue + origoOffsetX,
        y: pixelY * zoomValue + origoOffsetY
    }
}

//----------------------------------------------------
// Map canvas offset from origo to actual coordinates
//----------------------------------------------------

function canvasToPixels(pixelX = 0, pixelY = 0) {
    return {
        x: (pixelX - origoOffsetX) / zoomValue,
        y: (pixelY - origoOffsetY) / zoomValue
    }
}

//-----------------------------------------
// Move selected objects to front of canvas
//-----------------------------------------

function moveToFront(event) {
    event.stopPropagation();
    let front = [];
    let back = [];
    let diagramLength = diagram.length;
    for(let i = 0; i < diagramLength; i++){
        if(selected_objects.indexOf(diagram[0]) !== -1){
            front.push(diagram[0]);
        }
        else {
            back.push(diagram[0]);
        }
        diagram.splice(0, 1);
    }
    for(let i = 0; i < back.length; i++){
        diagram.push(back[i]);
    }
    for(let i = 0; i < front.length; i++){
        diagram.push(front[i]);
    }
    updateGraphics();
}

//-----------------------------------------
// Move selected objects to back of canvas
//-----------------------------------------

function moveToBack(event) {
    event.stopPropagation();
    let front = [];
    let back = [];
    let diagramLength = diagram.length;
    for(let i = 0; i < diagramLength; i++) {
        if(selected_objects.indexOf(diagram[0]) !== -1) {
            back.push(diagram[0]);
        } else {
            front.push(diagram[0]);
        }
        diagram.splice(0, 1);
    }
    for(let i = 0; i < back.length; i++){
        diagram.push(back[i]);
    }
    for(let i = 0; i < front.length; i++){
        diagram.push(front[i]);
    }
    updateGraphics();
}

//---------------------------------------------------------------------------------------------------------
// cancelFreeDraw: removes all the lines, points and crosses that has been drawn when in the free draw mode
//---------------------------------------------------------------------------------------------------------

function cancelFreeDraw() {
    if(uimode == "CreateFigure" && figureType == "Free" && md == mouseState.boxSelectOrCreateMode) {
        for (var i = 0; i < numberOfPointsInFigure; i++) {;
            points.pop();
            diagram.pop();
        }
        points.pop();
        cleanUp();
        md = mouseState.empty;      //Prevents the dashed line box, when drawing a square, to appear immediately
        updateGraphics();
    }

}

//----------------------------------------------------------------------
// fillCloneArray: used for copy and paste functionality in the keyDownHandlerFunction
//----------------------------------------------------------------------

function fillCloneArray() {
    cloneTempArray = [];
    for(var i = 0; i < selected_objects.length; i++) {
        cloneTempArray.push(selected_objects[i]);
    }
}

//--------------------------------------------------------------------
// Keeps track of if the CTRL or CMD key is active or not
//--------------------------------------------------------------------

window.onkeyup = function(event) {
    if(event.which == keyMap.ctrlKey || event.which == keyMap.windowsKey) {
        ctrlIsClicked = false;
    } else if(event.which == keyMap.shiftKey || event.which == keyMap.shiftKey){
        shiftIsClicked = false;
    }
}

//----------------------------------------------------------------------------------
// arrowKeyPressed: Handler for when pressing arrow keys when an object is selected
//----------------------------------------------------------------------------------

function arrowKeyPressed(key) {
    var xNew = 0, yNew = 0;

    //Check if snap to grid is on
    if(snapToGrid) {
        if(key == keyMap.leftArrow) {
            xNew = -1;
        }else if(key == keyMap.upArrow) {
            yNew = -1;
        }else if(key == keyMap.rightArrow) {
            xNew = 1;
        }else if(key == keyMap.downArrow) {
            yNew = 1;
        }
        for(var i = 0; i < selected_objects.length; i++) {
            // Coordinates for the top left corner of the object
            var hoveredObjectStartTopLeftX = points[selected_objects[i].topLeft].x;
            var hoveredObjectStartTopLeftY = points[selected_objects[i].topLeft].y;
            // Coordinates for the point to snap to
            var hoveredObjectSnapTopLeftX = Math.round((hoveredObjectStartTopLeftX / gridSize) + xNew) * gridSize;
            var hoveredObjectSnapTopLeftY = Math.round((hoveredObjectStartTopLeftY / gridSize) + yNew) * gridSize;
            // Move object in grid
            selected_objects[i].move(hoveredObjectSnapTopLeftX - hoveredObjectStartTopLeftX, hoveredObjectSnapTopLeftY - hoveredObjectStartTopLeftY);
        }
    } else {
        if(key == keyMap.leftArrow) {
            xNew = -5;
        }else if(key == keyMap.upArrow) {
            yNew = -5;
        }else if(key == keyMap.rightArrow) {
            xNew = 5;
        }else if(key == keyMap.downArrow) {
            yNew = 5;
        }
        for(var i = 0; i < selected_objects.length; i++) {
            selected_objects[i].move(xNew, yNew);
        }
    }   
    updateGraphics();
}

//-----------------------------------------------------------------------------------
// arrowKeyPressed: Handler for when pressing arrow keys when space has been pressed
//-----------------------------------------------------------------------------------
function moveCanvasView(key) {
  if(uimode = "MoveAround") {
    if(key == keyMap.leftArrow) {
      origoOffsetX += 10;
    }else if(key == keyMap.upArrow) {
      origoOffsetY += 10;
    }else if(key == keyMap.rightArrow) {
      origoOffsetX += -10;
    }else if(key == keyMap.downArrow) {
      origoOffsetY += -10;
    }
    updateGraphics();
    localStorage.setItem("cameraPosX", origoOffsetX);
    localStorage.setItem("cameraPosY", origoOffsetY);
  }
}

//-------------------------------------------------------------------------------------
// points - stores a global list of points
//          A point can not be physically deleted but marked as deleted in order to reuse
//          the sequence number again. e.g. point[5] will remain point[5] until it is deleted
//-------------------------------------------------------------------------------------

var points = [];

//--------------------------------------------------------------------
// addPoint: Creates a new point with inserted parameters and
//           returns index of that point
//--------------------------------------------------------------------

points.addPoint = function(xCoordinate, yCoordinate, isSelected) {
    //If we have an unused index we use it first
    for(var i = 0; i < points.length; i++) {
        if(points[i] == "") {
            points[i] = {x:xCoordinate, y:yCoordinate, isSelected:isSelected};
            return i;
        }
    }
    this.push({x:xCoordinate, y:yCoordinate, isSelected:isSelected});
    return this.length - 1;
}

//----------------------------------------------------------------------
// copySymbol: Clone an object
//----------------------------------------------------------------------
function copySymbol(symbol) {
    var clone = new Symbol(symbol.symbolkind);
    // copying the symbol attributes
    clone.properties = jQuery.extend(true, {}, symbol.properties);
    clone.lineDirection = jQuery.extend(true, {}, symbol.lineDirection);
    clone.minWidth = jQuery.extend(true, {}, symbol.minWidth);
    clone.minHeight = jQuery.extend(true, {}, symbol.minHeight);
    clone.isOval = jQuery.extend(true, {}, symbol.isOval);
    clone.isAttribute = jQuery.extend(true, {}, symbol.isAttribute);
    clone.isRelation = jQuery.extend(true, {}, symbol.isRelation);
    clone.pointsAtSamePosition = jQuery.extend(true, {}, symbol.pointsAtSamePosition);
    clone.operations = jQuery.extend(true, {}, symbol.operations);
    clone.attributes = jQuery.extend(true, {}, symbol.operations);
    clone.cardinality = jQuery.extend(true, {}, symbol.cardinality);

    if (symbol.isLocked) {
        clone.isLocked = jQuery.extend(true, {}, symbol.isLocked);
        clone.isLockHovered = jQuery.extend(true, {}, symbol.isLockHovered);
    }

    var topLeftClone = jQuery.extend(true, {}, points[symbol.topLeft]);
    topLeftClone.x += 10;
    topLeftClone.y += 10;

    var bottomRightClone = jQuery.extend(true, {}, points[symbol.bottomRight]);
    bottomRightClone.x += 10;
    bottomRightClone.y += 10;

    var centerPointClone = jQuery.extend(true, {}, points[symbol.centerPoint]);
    centerPointClone.x += 10;
    centerPointClone.y += 10;

    if (symbol.symbolkind == symbolKind.uml) {
        var middleDividerClone = jQuery.extend(true, {}, points[symbol.middleDivider]);
        middleDividerClone.x += 10;
        middleDividerClone.y += 10;
    }

    if(symbol.symbolkind == symbolKind.uml) {
        clone.name = symbol.name;
    }else if(symbol.symbolkind == symbolKind.erAttribute) {
        clone.name = symbol.name;
    }else if(symbol.symbolkind == symbolKind.erEntity) {
        clone.name = symbol.name;
    }else if(symbol.symbolkind == symbolKind.line) {
        clone.name = symbol.name;
    }else if(symbol.symbolkind == symbolKind.text) {
        clone.name = symbol.name;
        clone.textLines.push({text:clone.name});
    } else{
        clone.name = symbol.name;
    }

    clone.topLeft = points.push(topLeftClone) - 1;
    clone.bottomRight = points.push(bottomRightClone) - 1;

    if(clone.symbolkind != symbolKind.uml) {
        clone.centerPoint = points.push(centerPointClone) - 1;
    }else {
        clone.middleDivider = points.push(middleDividerClone) - 1;
        clone.centerPoint = clone.middleDivider;
    }

    clone.targeted = true;
    symbol.targeted = false;
    diagram.push(clone);

    return diagram.length;
}

//--------------------------------------------------------------------
// drawCross: Draws a cross at point position
//--------------------------------------------------------------------
function drawCross(point) {
    let crossSize = 4 * zoomValue;
    ctx.beginPath();
    ctx.moveTo(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y - crossSize);
    ctx.lineTo(pixelsToCanvas(point.x).x + crossSize, pixelsToCanvas(0, point.y).y + crossSize);
    ctx.moveTo(pixelsToCanvas(point.x).x + crossSize, pixelsToCanvas(0, point.y).y - crossSize);
    ctx.lineTo(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y + crossSize);
    ctx.stroke();
}

//--------------------------------------------------------------------
// drawPoints: Draws each of the points as a cross
//--------------------------------------------------------------------
points.drawPoints = function() {
    let crossSize = 4 * zoomValue;
    ctx.strokeStyle = crossStrokeStyle1;
    ctx.lineWidth = 2 * zoomValue;
    for (var i = 0; i < this.length; i++) {
        var point = this[i];
        if (!point.isSelected) {
            drawCross(point);
        } else {
            ctx.save();
            ctx.fillStyle = crossFillStyle;
            ctx.strokeStyle = crossStrokeStyle2;
            ctx.fillRect(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y - crossSize, crossSize * 2, crossSize * 2);
            ctx.strokeRect(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y - crossSize, crossSize * 2, crossSize * 2);
            ctx.restore();
        }
    }
}

//--------------------------------------------------------------------
// closestPoint: Returns the distance and index of the point closest
//               to the coordinates passed as parameters.
//--------------------------------------------------------------------

points.closestPoint = function(xCoordinate, yCoordinate, pointIndex) {
    var distance = 50000000;
    var index = -1;
    for (var i = 0; i < this.length; i++) {
        if(i == pointIndex) continue;
        var deltaX = xCoordinate - this[i].x;
        var deltaY = yCoordinate - this[i].y;
        var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
        if (hypotenuseElevatedBy2 < distance) {
            distance = hypotenuseElevatedBy2;
            index = i;
        }
    }
    return {distance:Math.sqrt(distance), index:index};
}

//--------------------------------------------------------------------
// clearAllSelects: Clears all selects from the array "points"
//--------------------------------------------------------------------

points.clearAllSelects = function() {
    for (var i = 0; i < this.length; i++) {
        this[i].isSelected = 0;
    }
}

diagram.closestPoint = function(mx, my) {
    var distance = 50000000;
    var point;
    let attachedSymbol;
    this.filter(symbol => symbol.kind != kind.path && symbol.symbolkind != symbolKind.text).forEach(symbol => {
        [points[symbol.topLeft], points[symbol.bottomRight], {x:points[symbol.topLeft], y:points[symbol.bottomRight], fake:true}, {x:points[symbol.bottomRight], y:points[symbol.topLeft], fake:true}].forEach(corner => {
            var deltaX = corner.fake ? mx - corner.x.x : mx - corner.x;
            var deltaY = corner.fake ? my - corner.y.y : my - corner.y;
            var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
            if (hypotenuseElevatedBy2 < distance) {
                distance = hypotenuseElevatedBy2;
                point = corner;
                attachedSymbol = symbol;
            }
        });
    });

    this.filter(symbol => symbol.kind == kind.path).forEach(path => {
        path.segments.forEach(seg => {
            var deltaX = mx - points[seg.pb].x;
            var deltaY = my - points[seg.pb].y;
            var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
            if (hypotenuseElevatedBy2 < distance) {
                distance = hypotenuseElevatedBy2;
                point = points[seg.pb];
                attachedSymbol = path;
            }
        });
    });
    return {distance:Math.sqrt(distance), point:point, attachedSymbol: attachedSymbol};
}

//--------------------------------------------------------------------
// draw: Executes draw method in all diagram objects
//--------------------------------------------------------------------

diagram.draw = function() {
    this.adjustPoints();
    for(var i = 0; i < this.length; i++) {
        if (this[i].kind == kind.path) {
            this[i].draw(1, 1);
        }
    }
    //Draws all lines first so that they appear behind the object instead
    for(var i = 0; i < this.length; i++) {
        if(this[i].symbolkind == symbolKind.line || this[i].symbolkind == symbolKind.umlLine) {
            this[i].draw();
        }
    }
    for (var i = 0; i < this.length; i++) {
        if(this[i].kind == kind.symbol && this[i].symbolkind != symbolKind.line && this[i].symbolkind != symbolKind.umlLine) {
            this[i].draw();
        }
    }
}

//--------------------------------------------------------------------
// adjustPoints: Adjusts all the fixed midpoints or other points of
//               interest to the actual geometric midpoint of the symbol
//--------------------------------------------------------------------

diagram.adjustPoints = function() {
    for (var i = 0 ; i < this.length; i++) {
        this[i].adjust();
    }
}

//--------------------------------------------------------------------
// deleteObject: Deletes passed object from diagram
//--------------------------------------------------------------------

diagram.deleteObject = function(object) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == object) {
            this.splice(i, 1);
        }
    }
    if(diagram.length == 0){
        resetSerialNumbers();
        removeLocalStorage();
    }
}

//--------------------------------------------------------------------
// targetItemsInsideSelectionBox: Targets all items inside the
//                                selection box (dragged by the user)
//--------------------------------------------------------------------

diagram.targetItemsInsideSelectionBox = function (ex, ey, sx, sy, hover) {
    //ensure that an entity cannot scale below the minimum size
    if (sx > ex) {
        var tempEndX = ex;
        ex = sx;
        sx = tempEndX;
    }
    if (sy > ey) {
        var tempEndY = ey;
        ey = sy;
        sy = tempEndY;
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == kind.path) {
            var tempPoints = [];
            for (var j = 0; j < this[i].segments.length; j++) {
                tempPoints.push({x:points[this[i].segments[j].pa].x, y:points[this[i].segments[j].pa].y});
            }
            var pointsSelected = 0;
            for (var j = 0; j < tempPoints.length; j++) {
                if (tempPoints[j].x < ex && tempPoints[j].x > sx &&
                    tempPoints[j].y < ey && tempPoints[j].y > sy) {
                    pointsSelected++;
                }
            }
            if (!hover) {
                if (pointsSelected >= tempPoints.length) {
                    selected_objects.push(this[i]);
                    this[i].targeted = true;
                    setTargetedForSymbolGroup(this[i], true);
                }
            } else {
                if (pointsSelected >= tempPoints.length) {
                    this[i].isHovered = true;
                } else {
                    this[i].isHovered = false;
                }
            }
        } else {
            var index = selected_objects.indexOf(this[i]);
            var tempTopLeftX = points[this[i].topLeft].x;
            var tempTopLeftY = points[this[i].topLeft].y;
            var tempBottomRightX = points[this[i].bottomRight].x;
            var tempBottomRightY = points[this[i].bottomRight].y;
            if (sx < tempTopLeftX && ex > tempTopLeftX &&
                sy < tempTopLeftY && ey > tempTopLeftY &&
                sx < tempBottomRightX && ex > tempBottomRightX &&
                sy < tempBottomRightY && ey > tempBottomRightY) {
                if (ctrlIsClicked && !hover) {
                    if (index >= 0) {
                        this[i].targeted = false;
                        selected_objects.splice(index, 1);
                        setTargetedForSymbolGroup(this[i], false);
                    } else if (!hover) {
                        this[i].targeted = true;
                        selected_objects.push(this[i]);
                        setTargetedForSymbolGroup(this[i], true);
                    }
                } else {
                    if (index < 0 && !hover) {
                        this[i].targeted = true;
                        selected_objects.push(this[i]);
                        setTargetedForSymbolGroup(this[i], true);
                    } else if (hover) {
                        this[i].isHovered = true;
                    }
                }
            } else if (!ctrlIsClicked) {
                if (!hover) this[i].targeted = false;
                if (index >= 0) {
                    setTargetedForSymbolGroup(selected_objects[0], true);
                    break;
                }
            }
        }
    }
}

//--------------------------------------------------------------------
// itemClicked: Returns the index of the first clicked item
//--------------------------------------------------------------------

diagram.itemClicked = function() {
    if(uimode == "MoveAround") return -1;
    var obj = this.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY);
    if (typeof obj !== 'undefined' && obj != -1) return this.indexOf(obj);
    else return -1;
}

//--------------------------------------------------------------------
// checkForHover: Executes isHovered method in all diagram objects
//                (currently only of kind==2 && symbolkind == 4 (aka. lines))
//--------------------------------------------------------------------
diagram.checkForHover = function(posX, posY) {
    for (var i = 0; i < this.length; i++) {
        this[i].isHovered = false;
    }
    var hoveredObjects = this.filter(symbol => symbol.checkForHover(posX, posY));
    hoveredObject = hoveredObjects[hoveredObjects.length - 1];
    if (hoveredObjects.length <= 0) return -1;
    hoveredObjects.sort(function(a, b) {
        if(a.kind == kind.path && b.kind == kind.symbol) return -1;
        else if(a.kind != kind.path && b.kind == kind.path) return 1;
        else if (a.symbolkind != symbolKind.line && b.symbolkind != symbolKind.line) return 0;
        else if (a.symbolkind == symbolKind.line && b.symbolkind != symbolKind.line) return -1;
        else if (a.symbolkind != symbolKind.line && b.symbolkind == symbolKind.line) return 1;
        else return 0;
    });
    if (hoveredObjects.length && hoveredObjects[hoveredObjects.length - 1].kind != kind.path) {
        //We only want to set it to true when md is not in selectionbox mode
        if(!(uimode == "MoveAround")) {
            if (md != mouseState.insideMovableObject || uimode != "normal" || hoveredObjects[hoveredObjects.length - 1].isLocked) {
                hoveredObjects[hoveredObjects.length - 1].isHovered = true;
            } else {
                hoveredObjects[hoveredObjects.length - 1].isHovered = false;
            }
        }
    }
    // check hover for free draw objects
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.path) {
            if (diagram[i].checkForHover(posX, posY) && uimode != "MoveAround") {
                diagram[i].isHovered = true;
            } else {
                diagram[i].isHovered = false;
            }
        }
    }
    return hoveredObjects[hoveredObjects.length - 1];
}

//--------------------------------------------------------------------
// eraseLines: removes all the lines connected to an object
//--------------------------------------------------------------------

diagram.eraseLines = function(privateLines) {
    for (var i = 0; i < privateLines.length; i++) {
        var eraseLeft = false;
        var eraseRight = false;
        for (var j = 0; j < diagram.length;j++) {
            if (points[diagram[j].centerPoint] == points[privateLines[i].topLeft] ||
                points[diagram[j].middleDivider] == points[privateLines[i].topLeft]) {
                eraseLeft = true;
            }
            if (points[diagram[j].centerPoint] == points[privateLines[i].bottomRight] ||
                points[diagram[j].middleDivider] == points[privateLines[i].bottomRight]) {
                eraseRight = true;
            }
        }
        var connected_objects = connectedObjects(privateLines[i]);
        if(!eraseLeft) {
            for(var j = 0; j < connected_objects.length; j++) {
                connected_objects[j].removePointFromConnector(privateLines[i].topLeft);
            }
            points[privateLines[i].topLeft] = waldoPoint;
        }
        if(!eraseRight) {
            for(var j = 0; j < connected_objects.length; j++) {
                connected_objects[j].removePointFromConnector(privateLines[i].bottomRight);
            }
            points[privateLines[i].bottomRight] = waldoPoint;
        }
        diagram.deleteObject(privateLines[i]);
    }
}

//--------------------------------------------------------------------
// getEntityObjects: Returns a list of all entities
//--------------------------------------------------------------------

diagram.getEntityObjects = function() {
    var entities = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == symbolKind.erEntity) {
            entities.push(diagram[i]);
        }
    }
    return entities;
}

//--------------------------------------------------------------------
// getLineObjects: Returns a list of all lines
//--------------------------------------------------------------------

diagram.getLineObjects = function() {
    var lines = [];
    for (var i = 0; i < this.length; i++) {
        if (diagram[i].symbolkind == symbolKind.line) {
            lines.push(diagram[i]);
        }
    }
    return lines;
}

//--------------------------------------------------------------------
// getRelationObjects: Returns a list of all relations
//--------------------------------------------------------------------

diagram.getRelationObjects = function() {
    var relations = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == symbolKind.erRelation) {
            relations.push(diagram[i]);
        }
    }
    return relations;
}

//--------------------------------------------------------------------
// updateLineRelations: Updates a line's relation depending on
//                      what object it is connected to
//--------------------------------------------------------------------

diagram.updateLineRelations = function() {
    var privateLines = this.getLineObjects();
    for (var i = 0; i < privateLines.length; i++) {
        privateLines[i].type = "idek";
        var connected_objects = connectedObjects(privateLines[i]);
        if (connected_objects.length >= 2) {
            for (var j = 0; j < connected_objects.length; j++) {
                if (connected_objects[j].type == "weak") {
                    privateLines[i].type = "weak";
                }
            }
        }
    }
}

//--------------------------------------------------------------------
// sortConnectors: Sort all connectors related to entity.
//--------------------------------------------------------------------

diagram.sortConnectors = function() {
    for (var i = 0; i < diagram.length; i++) {
        // Keep recursive lines on the same side of objects, this keeps the ends of recursive lines
        // right next to each other which helps when having several recursive lines on the same object
        if (diagram[i].isRecursiveLine) {
            points[diagram[i].topLeft].x = points[diagram[i].bottomRight].x;
            points[diagram[i].topLeft].y = points[diagram[i].bottomRight].y;
        }
    }
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == symbolKind.erEntity || diagram[i].symbolkind == symbolKind.erRelation || diagram[i].symbolkind == symbolKind.uml) {
            diagram[i].sortAllConnectors();
        }
    }
}

//--------------------------------------------------------------------
// updateQuadrants: Updates all lines connected to an entity.
//--------------------------------------------------------------------

diagram.updateQuadrants = function() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == symbolKind.erEntity || diagram[i].symbolkind == symbolKind.erRelation || diagram[i].symbolkind == symbolKind.uml) {
            if(diagram[i].quadrants(diagram[i].symbolkind)) /*break*/;
        }
    }
}

diagram.getZoomValue = function(){
    return zoomValue;
}

//--------------------------------------------------------------------
// Initialization of canvas when the page is loaded
//--------------------------------------------------------------------

function initializeCanvas() {
    //hashes the current diagram, and then compare if it have been change to see if it needs to be saved.
    setInterval(refreshFunction, refreshTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashFunction, hashUpdateTimer + 500);

    const diagramContainer = document.getElementById("diagramCanvasContainer");
    const moveButton = document.getElementById("moveButton");
    const zoomTextElement = document.getElementById("zoomV");
    const zoomRange = document.getElementById("ZoomSelect");


    canvas = document.getElementById("diagramCanvas");
    if(canvas.getContext) {
        ctx = canvas.getContext("2d");
    }

    zoomTextElement.innerHTML = `<p><b>Zoom:</b> ${Math.round(zoomValue * 100)}%</p>`;
    zoomRange.value = zoomValue;

    moveButton.addEventListener('click', movemode, false);
    diagramContainer.addEventListener("contextmenu", e => e.preventDefault());
    canvas.addEventListener("mousemove", mousemoveevt, false);
    canvas.addEventListener("mousedown", mousedownevt, false);
    canvas.addEventListener("mouseup", mouseupevt, false);
    canvas.addEventListener('dblclick', doubleclick, false);
    canvas.addEventListener('touchmove', mousemoveevt, false);
    canvas.addEventListener('touchstart', mousedownevt, false);
    canvas.addEventListener('touchend', mouseupevt, false);
    canvas.addEventListener('wheel', scrollZoom, false);
  
    drawKeyMap(keyMap, $("#shortcuts-wrap").get(0));

    var dropDowns = document.getElementsByClassName("drop-down-label");
    var i;
    for (i = 0; i < dropDowns.length; i++) {
        dropDowns[i].addEventListener("mouseover", clearActiveDropdownElement);
    }
}

//--------------------------------------------------------------------
// Clears the active element when hovering dropdown menus
//--------------------------------------------------------------------

function clearActiveDropdownElement(){
    if (document.activeElement.className.match("menu-drop-down") || 
    document.activeElement.className.match("drop-down-item")) {
        document.activeElement.blur();
    }

}

//--------------------------------------------------------------------
// Deselects all objects
//--------------------------------------------------------------------

function deselectObjects() {
    for(let i = 0; i < diagram.length; i++) {
        diagram[i].targeted = false;
        diagram[i].isHovered = false;
    }
}

//-----------------------------------------------------------------------------------
// toggleGrid: Function to enable and disable the grid
//             functionality is related to currentMouseCoordinateX and currentMouseCoordinateY
//-----------------------------------------------------------------------------------

function toggleGrid(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked

    if (snapToGrid == false) {
        snapToGrid = true;
    } else {
        snapToGrid = false;
    }
    setCheckbox($(".drop-down-option:contains('Snap to grid')"), snapToGrid);
}

//-----------------------------------------------------------------------
// Toggles the virtual A4 On or Off
//-----------------------------------------------------------------------

function toggleVirtualA4(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    if (toggleA4) {
        // A4 is disabled
        toggleA4 = false;

        $("#a4-holes-item").addClass("drop-down-item drop-down-item-disabled");
        $("#a4-orientation-item").addClass("drop-down-item drop-down-item-disabled");
        $("#a4-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
        $("#a4-single-item").addClass("drop-down-item drop-down-item-disabled");
        hideA4State();
        updateGraphics();
    } else {
        toggleA4 = true;
        $("#a4-holes-item").removeClass("drop-down-item drop-down-item-disabled");
        $("#a4-orientation-item").removeClass("drop-down-item drop-down-item-disabled");
        $("#a4-single-item").removeClass("drop-down-item drop-down-item-disabled");
        if (toggleA4Holes) {
            $("#a4-holes-item-right").removeClass("drop-down-item drop-down-item-disabled");
        } else {
            $("#a4-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
        }
        showA4State();
        updateGraphics();
    }

    setCheckbox($(".drop-down-option:contains('Display Virtual A4')"), toggleA4);
}

//--------------------------------------------------------------------
// Draws virtual A4 on canvas
//--------------------------------------------------------------------

function drawVirtualA4() {
    if(!toggleA4) {
        return;
    }
    // Origo
    let zeroX = pixelsToCanvas().x;
    let zeroY = pixelsToCanvas().y;

    // the correct according to 96dpi size, of a4 milimeters to pixels
    const pixelsPerMillimeter = 3.781 * zoomValue;
    const a4Width = 210 * pixelsPerMillimeter;
    const a4Height = 297 * pixelsPerMillimeter;
    // size of a4 hole, from specification ISO 838 and the swedish "triohålning"
    const leftHoleOffsetX = 12 * pixelsPerMillimeter;
    const rightHoleOffsetX = 198 * pixelsPerMillimeter;
    const holeRadius = 3 * pixelsPerMillimeter;
    
    // Number of A4 sheets to draw out
    var a4Rows;
    var a4Columns;

    if(!singleA4){
        if (A4Orientation == "portrait") {
            a4Rows = 6;
            a4Columns = 12;
        } else if(A4Orientation == "landscape") {
            a4Rows = 10;
            a4Columns = 8;
        }
    } else {
        a4Rows = 1;
        a4Columns = 1;
    }

    ctx.save();
    ctx.strokeStyle = "black"
    ctx.setLineDash([10 * (pixelsPerMillimeter / 3)]);
    
    if(A4Orientation == "portrait") {           // Draw A4 sheets in portrait mode
        for (var i = 0; i < a4Rows; i++) {
            for (var j = 0; j < a4Columns; j++) {
                ctx.strokeRect(zeroX + a4Width * j, zeroY + a4Height * i, a4Width, a4Height);               // Bottom right
                if(!singleA4){
                    ctx.strokeRect(zeroX - a4Width * (j+1), zeroY + a4Height * i, a4Width, a4Height);       // Bottom left
                    ctx.strokeRect(zeroX + a4Width * j, zeroY - a4Height * (i+1), a4Width, a4Height);       // Top right
                    ctx.strokeRect(zeroX - a4Width * (j+1), zeroY - a4Height * (i+1), a4Width, a4Height);   // Top left
                }
            }
        }
    } else if(A4Orientation == "landscape") {   // Draw A4 sheets in landscape mode
        for (var i = 0; i < a4Rows; i++) {
            for (var j = 0; j < a4Columns; j++) {
                ctx.strokeRect(zeroX + a4Height * j, zeroY + a4Width * i, a4Height, a4Width);               // Bottom right
                if(!singleA4){
                    ctx.strokeRect(zeroX - a4Height * (j+1), zeroY + a4Width * i, a4Height, a4Width);       // Bottom left
                    ctx.strokeRect(zeroX + a4Height * j, zeroY - a4Width * (i+1), a4Height, a4Width);       // Top right
                    ctx.strokeRect(zeroX - a4Height * (j+1), zeroY - a4Width * (i+1), a4Height, a4Width);   // Top left
                }
            }
        }
    }

    // Draw A4 holes
    if(toggleA4Holes) {
        if(A4Orientation == "portrait") {
            if (switchSideA4Holes == "left") {
                // The Holes on the left side.
                for (var i = 0; i < a4Rows; i++) {
                    for (var j = 0; j < a4Columns; j++) {
                        // Bottom right quadrant
                        drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        if(!singleA4){
                            // Bottom left quadrant
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            // Top left quadrant
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            // Top right quadrant
                            drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(leftHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                        }
                    }
                }
            } else {
                // The holes on the right side.
                for (var i = 0; i < a4Rows; i++) {
                    for (var j = 0; j < a4Columns; j++) {
                        // Bottom right quadrant
                        drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                        if(!singleA4){
                            // Bottom left quadrant
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY + a4Height * i, holeRadius);
                            // Top left quadrant
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX - a4Width * (j+1), ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            // Top right quadrant
                            drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                            drawCircle(rightHoleOffsetX + zeroX + a4Width * j, ((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroY - a4Height * (i+1), holeRadius);
                        }
                    }
                }
            }
        }
        else if(A4Orientation == "landscape") {
            if (switchSideA4Holes == "left") {
                // The holes on the upper side.
                for (var i = 0; i < a4Rows; i++) {
                    for (var j = 0; j < a4Columns; j++) {
                        // Bottom right
                        drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        if(!singleA4){
                            // Bottom left
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            // Top left
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            // Top right
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX + a4Height * j, leftHoleOffsetX + zeroY - a4Width * (i+1), holeRadius); 
                        }                   
                    }
                }
            }else {
                // The holes on the bottom side.
                for (var i = 0; i < a4Rows; i++) {
                    for (var j = 0; j < a4Columns; j++) {
                        // Bottom right
                        drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                        if(!singleA4){
                            // Bottom left
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY + a4Width * i, holeRadius);
                            // Top left
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX - a4Height * (j+1), rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            // Top right
                            drawCircle(((a4Height / 2) - (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) - 34 * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + (34+21) * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                            drawCircle(((a4Height / 2) + 34 * pixelsPerMillimeter) + zeroX + a4Height * j, rightHoleOffsetX + zeroY - a4Width * (i+1), holeRadius);
                        }
                    }
                }
            }
        }
    }
    ctx.restore();
}

//------------------------------------------------------------------
// Draws a crosshair in the middle of canvas while in developer mode
//------------------------------------------------------------------

function drawCrosshair(){
    let crosshairLength = 12;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(centerX - crosshairLength, centerY);
    ctx.lineTo(centerX + crosshairLength, centerY);
    ctx.moveTo(centerX, centerY - crosshairLength);
    ctx.lineTo(centerX, centerY + crosshairLength);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}


//--------------------------------------------------------
// Can be used for debugging to mark a spot on the canvas
//--------------------------------------------------------

function drawDebugCircle(cx, cy, radius, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

//-------------------
// Draws circle
//-------------------

function drawCircle(cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0,0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

//-----------------------------------------------------
// Enables and shows the children menus for virtual A4
//-----------------------------------------------------

function showA4State() {
    // Sets icons based on the state of the A4
    setCheckbox($(".drop-down-option:contains('Toggle A4 Holes')"), toggleA4Holes=false);
    setOrientationIcon($(".drop-down-option:contains('Toggle A4 Orientation')"), true);
    switchSideA4Holes = "left";
    setCheckbox($(".drop-down-option:contains('A4 Holes Right')"), switchSideA4Holes == "right");

    // Show A4 options
    $("#a4-orientation-item").removeClass("drop-down-item drop-down-item-disabled");
    $("#a4-holes-item").removeClass("drop-down-item drop-down-item-disabled");
    $("#a4-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
}

//-----------------------------------------------------
// Disables and hides the children menus for virtual A4
//-----------------------------------------------------

function hideA4State() {
    // Reset the variables after disable the A4
    toggleA4Holes = false;
    switchSideA4Holes = "left";

    // Hides icons when toggling off the A4
    setOrientationIcon($(".drop-down-option:contains('Toggle A4 Orientation')"), false);
    setCheckbox($(".drop-down-option:contains('Toggle A4 Holes')"), toggleA4Holes);
    setCheckbox($(".drop-down-option:contains('A4 Holes Right')"), switchSideA4Holes == "right");
    setCheckbox($(".drop-down-option:contains('Display Virtual A4')"), toggleA4);

    // Grey out disabled options
    $("#a4-orientation-item").addClass("drop-down-item drop-down-item-disabled");
    $("#a4-holes-item").addClass("drop-down-item drop-down-item-disabled");
    $("#a4-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
}

//---------------------------------
// Toggles holes on the virtual A4
//---------------------------------

function toggleVirtualA4Holes(event) {
    event.stopPropagation();
    // Toggle a4 holes to the A4-paper.
    if (toggleA4 && toggleA4Holes) {
        toggleA4Holes = false;
        setCheckbox($(".drop-down-option:contains('Toggle A4 Holes')"), toggleA4Holes);
        $("#a4-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Display Virtual A4')"), toggleA4);

        switchSideA4Holes = "left"; // Disable the 'A4 Holes Right' option
        setCheckbox($(".drop-down-option:contains('A4 Holes Right')"), switchSideA4Holes == "right");
        updateGraphics();
    } else if (toggleA4) {
        toggleA4Holes = true;
        setCheckbox($(".drop-down-option:contains('Toggle A4 Holes')"), toggleA4Holes);
        $("#a4-holes-item-right").removeClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Display Virtual A4')"), toggleA4);
        updateGraphics();
    }
}

//-------------------------------------------------------------
// Moves the holes on virtual A to the opposite side of the A4
//-------------------------------------------------------------

function toggleVirtualA4HolesRight(event) {
    event.stopPropagation();
    // Switch a4 holes from left to right of the A4-paper.
    if (switchSideA4Holes == "right" && toggleA4) {
        switchSideA4Holes = "left";
        setCheckbox($(".drop-down-option:contains('A4 Holes Right')"), switchSideA4Holes == "right");
        updateGraphics();
    } else if (toggleA4 && toggleA4Holes) {
        switchSideA4Holes = "right";
        setCheckbox($(".drop-down-option:contains('A4 Holes Right')"), switchSideA4Holes == "right");
        updateGraphics();
    }
}

//---------------------------------------------------------------
// Changes orientation of the virtual A4 (Landscape or portrait)
//---------------------------------------------------------------

function toggleA4Orientation(event) {
    event.stopPropagation();
    if (A4Orientation == "portrait" && toggleA4) {
        A4Orientation = "landscape";
        setOrientationIcon($(".drop-down-option:contains('Toggle A4 Orientation')"), true);
    } else if (A4Orientation == "landscape" && toggleA4) {
        A4Orientation = "portrait";
        setOrientationIcon($(".drop-down-option:contains('Toggle A4 Orientation')"), true);
    }
    updateGraphics();
}

//---------------------------------------------------------------
// Changes between single and repeated virtual A4 view
//---------------------------------------------------------------

function togglesingleA4(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    // Switch between single and repeated
    if (singleA4) {
        singleA4 = false;
        setCheckbox($(".drop-down-option:contains('Single A4')"), singleA4);
    } else {
        singleA4 = true;
        setCheckbox($(".drop-down-option:contains('Single A4')"), singleA4);
    }
    updateGraphics();
}


//---------------------------------------------------------------
// Changes between Showing and hiding the texts marked as comments
//---------------------------------------------------------------

function toggleComments(event) {
    event.stopPropagation();  // This line stops the collapse of the menu when it's clicked
    if (hideComment) {
		hideComment = false;
      	setCheckbox($(".drop-down-option:contains('Hide Comments')"), hideComment);
    } else {
		hideComment = true;
      	setCheckbox($(".drop-down-option:contains('Hide Comments')"), hideComment);
    }
    updateGraphics();
}

//----------------------------------------------------------------------------------------------------------------------------
// When one or many items are selected/not selected, enable/disable all options related to having one or many objects selected
//----------------------------------------------------------------------------------------------------------------------------


function enableSelectedItemOptions() {
    const idsOverZero = ["change-appearance-item", "move-selected-front-item", "move-selected-back-item", "lock-selected-item", "delete-object-item", "group-objects-item", "ungroup-objects-item"];
    const idsOverOne = ["align-top-item", "align-right-item", "align-bottom-item", "align-left-item", "horizontal-c-item", "vertical-c-item", "distribute-horizontal-item", "distribute-vertical-item"];
    //Jquery can select multiple by example $("#element1, element2, element3") This way prevents repetition.
    if (selected_objects.length > 0) {
        $("#" + idsOverZero.join(",#")).removeClass("drop-down-item drop-down-item-disabled");
    } else {
        $("#" + idsOverZero.join(",#")).addClass("drop-down-item drop-down-item-disabled");
    }
    if (selected_objects.length > 1){
        $("#" + idsOverOne.join(",#")).removeClass("drop-down-item drop-down-item-disabled");
    } else {
        $("#" + idsOverOne.join(",#")).addClass("drop-down-item drop-down-item-disabled");
    }
}

//----------------------------------------------------
// drawKeyList: Draws the list in the target element
//----------------------------------------------------

function drawKeyMap(map, target) {
    let html = "";
    Object.keys(map).forEach(function(key) {
        html += `
        <div class="shortcuts-button-wrap">
            <button for="importFile" id="importLabel" class="custom-file-upload shortcut-keys-name">${key}</button>
            <div for="importFile" class="submit-button custom-file-upload shortcut-keys" onclick="bindKey('${key}')">${keyCodes[map[key]]}</div>
        </div>`
    });
    target.innerHTML = html;
}

//----------------------------------------------------
// openShortcutsDialog: Opens the dialog menu for shortcuts editor
//----------------------------------------------------

function bindKey(key) {
    isBindingKey = true;
    keyBeingBound = key;
}

//----------------------------------------------------
// openShortcutsDialog: Opens the dialog menu for shortcuts editor
//----------------------------------------------------

function openShortcutsDialog() {
    $("#edit-shortcuts").css("display", "flex");
}

//------------------------------------------------------
// closeShortcutsDialog: Closes the dialog menu for the shortcuts editor
//------------------------------------------------------

function closeShortcutsDialog() {
    $("#edit-shortcuts").css("display", "none");
}

//----------------------------------------------------
// openImportDialog: Opens the dialog menu for import
//----------------------------------------------------

function openImportDialog() {
    $("#import").css("display", "flex");
}

//------------------------------------------------------
// closeImportDialog: Closes the dialog menu for import.
//------------------------------------------------------

function closeImportDialog() {
    $("#import").css("display", "none");
}

//---------------------------------------
// importFile: Import file
//---------------------------------------

function importFile() {
    var file = document.getElementById("importFile").files[0];
    if (!file) return;
    var extension = file.name.split(".").pop().toLowerCase();
    if (extension != "txt") {
        $("#importError").show();
        return;
    }
    $("#importError").hide();
    closeImportDialog();

    var reader = new FileReader();
    reader.onload = function(e) {
        var fileContent = e.target.result;
        LoadImport(fileContent);
    };
    reader.readAsText(file, "UTF-8");
}

//-------------------------------------------------------
// Change name of label to filename when importing file
//-------------------------------------------------------

$(document).ready(function(){
        $('.import-file-button').change(function(e){
            var fileName = e.target.files[0].name;
          $('#importLabel').text(fileName);
        });
    });

//---------------------------------------------------
// canvasSize: Function that is used for the resize
//             Making the page more responsive
//---------------------------------------------------

function canvasSize() {
    const diagramContainer = document.getElementById("diagramCanvasContainer");
    canvas.width = diagramContainer.offsetWidth
    canvas.height = diagramContainer.offsetHeight;
    boundingRect = canvas.getBoundingClientRect();
    updateGraphics();
}

// Listen if the window is the resized
window.addEventListener('resize', canvasSize);

//----------------------------------------------------------
// updateGraphics: used to redraw each object on the screen
//----------------------------------------------------------

function updateGraphics() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    diagram.updateQuadrants();
    drawGrid();
    drawOrigoLine();
    if(developerModeActive) {
        drawOrigo();
        drawCrosshair();
    }
    diagram.sortConnectors();
    diagram.updateQuadrants();
    diagram.draw();
    points.drawPoints();
    drawVirtualA4();
}

//---------------------------------------------------------------------------------
// resetViewToOrigin: moves the view to origo based on movement done in the canvas
//---------------------------------------------------------------------------------

function resetViewToOrigin(event){
    event.stopPropagation();
    origoOffsetX = 0;
    origoOffsetY = 0;
    updateGraphics();
    SaveState();
}

//---------------------------------------------------------------------------------
// resetViewToOrigin: moves the view to origo based on movement done in the canvas
//---------------------------------------------------------------------------------

function disableShortcuts(event){
    event.stopPropagation();
    if (enableShortcuts) {
        setCheckbox($(".drop-down-option:contains('Disable keyboard shortcuts')"), enableShortcuts);
        enableShortcuts = false;
    } else {
        setCheckbox($(".drop-down-option:contains('Disable keyboard shortcuts')"), enableShortcuts);
        enableShortcuts = true;
    }
    updateGraphics();
}

//-------------------------------------------
// Returns lines connected to the object
//--------------------------------------------

function getConnectedLines(object) {
    var privatePoints = object.getPoints();
    var lines = diagram.getLineObjects();
    var objectLines = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        //Lines connected to object's centerPoint
        //Line always have topLeft and bottomRight if symbolkind == 4, because that means it's a line object
        if (line.topLeft == object.centerPoint || line.bottomRight == object.centerPoint) {
            objectLines.push(line);
        }
        //Connected to connectors top, right, bottom and left.
        for (var j = 0; j < privatePoints.length; j++) {
            if (line.topLeft == privatePoints[j] || line.bottomRight == privatePoints[j]) {
                objectLines.push(line);
            }
        }
    }
    return objectLines;
}

//---------------------------------
// Erases the object from diagram
//---------------------------------

function eraseObject(object) {
    var objectsToDelete = [];
    if (object.kind == kind.symbol) {
        // None lines
        if(object.symbolkind != symbolKind.line && object.symbolkind != symbolKind.umlLine) {
            var lines = diagram.filter(symbol => symbol.symbolkind == symbolKind.line);
            var umlLines = diagram.filter(symbol => symbol.symbolkind == symbolKind.umlLine);
            if(object.symbolkind != symbolKind.uml) {
            objectsToDelete = lines.filter(
                line => line.topLeft == object.middleDivider
                || line.topLeft == object.centerPoint
                || line.bottomRight == object.middleDivider
                || line.bottomRight == object.centerPoint
                || (object.hasConnectorFromPoint(line.topLeft) && (object.symbolkind == symbolKind.erEntity || object.symbolkind == symbolKind.erRelation))
                || (object.hasConnectorFromPoint(line.bottomRight) && (object.symbolkind == symbolKind.erEntity || object.symbolkind == symbolKind.erRelation))
            );  
            } else if (object.symbolkind == symbolKind.uml) {
            objectsToDelete = umlLines.filter(
                umlLine => umlLine.topLeft == object.middleDivider
                || (object.hasConnectorFromPoint(umlLine.topLeft) && (object.symbolkind == symbolKind.uml))
                || (object.hasConnectorFromPoint(umlLine.bottomRight) && (object.symbolkind == symbolKind.uml))
            );
            }
        // lines
        } else {
            diagram.filter(
                symbol => symbol.symbolkind == symbolKind.erEntity || symbol.symbolkind == symbolKind.erRelation || symbol.symbolkind == symbolKind.uml)
                    .filter(symbol =>   symbol.hasConnector(object.topLeft)
                                     && symbol.hasConnector(object.bottomRight))
                    .forEach(symbol => {
                        symbol.removePointFromConnector(object.topLeft);
                        symbol.removePointFromConnector(object.bottomRight);
                    });

            var attributesAndRelations = diagram.filter(symbol => symbol.symbolkind == symbolKind.erAttribute || symbol.symbolkind == symbolKind.erRelation || symbol.symbolkind == symbolKind.uml);
            // Check if the line has a common point with a centerpoint of attributes or relations.
            var removeTopleft = attributesAndRelations
                        .filter(symbol => symbol.centerPoint == object.topLeft
                                       || symbol.middleDivider == object.topLeft
                               ).length == 0;
            var removeBottomright = attributesAndRelations
                        .filter(symbol => symbol.centerPoint == object.bottomRight
                                        || symbol.middleDivider == object.bottomRight
                               ).length == 0;
            if(removeTopleft) points[object.topLeft] = "";
            if(removeBottomright) points[object.bottomRight] = "";
        }
        object.erase();
        diagram.eraseLines(object, object.getLines());
    } else if (object.kind == kind.path) {
        object.erase();
    }
    diagram.deleteObject(object);
    objectsToDelete.forEach(eraseObject);
    updateGraphics();
}

//---------------------------------------------------
// Calls the erase function for all selected objects
// Ends up with erasing all selected objects
//---------------------------------------------------

function eraseSelectedObject(event) {
    event.stopPropagation();
    for(var i = 0; i < selected_objects.length; i++) {
        eraseObject(selected_objects[i]);
    }
    selected_objects = [];
    lastSelectedObject = -1;
    updateGraphics();
}

//------------------------------------------------------
// Sets the uimode variable depending on choice of tool
//------------------------------------------------------

function setMode(mode) {
    cancelFreeDraw();
    uimode = mode;
    if(mode == 'Free' || mode == 'Text') {
      uimode = "CreateFigure";
      figureType = mode;
    }
}

$(document).ready(function() {
    $("#linebutton, #attributebutton, #entitybutton, #relationbutton, #drawfreebutton, #classbutton, #drawtextbutton").click(function() {
        $("#moveButton").removeClass("pressed").addClass("unpressed");
        $("#moveButton").css("visibility", "hidden");
        if ($(this).hasClass("pressed")) {
            $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
            uimode = "normal";
        } else {
            $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
            $(this).removeClass("unpressed").addClass("pressed");
        }
    });
});

//--------------------------------------------------
// Returns connected that are connected to the line
//--------------------------------------------------

function connectedObjects(line) {
    var privateObjects = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.symbol && diagram[i].symbolkind != symbolKind.line) {
            var objectPoints = diagram[i].getPoints();
            for (var j = 0; j < objectPoints.length; j++) {
                if (objectPoints[j] == line.topLeft || objectPoints[j] == line.bottomRight) {
                    privateObjects.push(diagram[i]);
                }
                if (privateObjects.length >= 2) {
                    break;
                }
            }
            if (privateObjects.length >= 2) {
                break;
            }
        }
    }
    return privateObjects;
}

//-----------------------------------
// Draws the gridlines of the canvas
//-----------------------------------

function drawGrid() {
    var zoomGridSize = gridSize * zoomValue;
    var counter = 0;

    for(var i = 0; i < Math.max(canvas.width, canvas.height) / zoomGridSize + Math.max(Math.abs(origoOffsetX), Math.abs(origoOffsetY)); i++){
        setLineColor(counter);
        counter++;

        // Positive vertical lines
        drawGridLine(origoOffsetX + zoomGridSize * i, 0, origoOffsetX + zoomGridSize * i, canvas.height);

        // Negative vertical lines
        drawGridLine(origoOffsetX - zoomGridSize * i, 0, origoOffsetX - zoomGridSize * i, canvas.height);

        // Positive horizontal lines
        drawGridLine(0, origoOffsetY + zoomGridSize * i, canvas.width, origoOffsetY + zoomGridSize * i);

        // Negative horizontal lines
        drawGridLine(0, origoOffsetY - zoomGridSize * i, canvas.width, origoOffsetY - zoomGridSize * i);
    }
}

//-------------------------------------------------------------------------------------
// Sets the color depending on whether the gridline should be darker or brighter grey
//-------------------------------------------------------------------------------------

function setLineColor(counter){
    if(counter % 5 == 0){
        ctx.strokeStyle = "rgb(208, 208, 220)";
    } else {
        ctx.strokeStyle = "rgb(238, 238, 250)";
    }
}

//---------------------------------
// Draws origo when in developer mode
//---------------------------------

function drawOrigo() {
    const radius = 10;
    const colors = ['#0fbcf9','transparent','#0fbcf9','transparent'];

    ctx.save();
    ctx.lineWidth = 1 * zoomValue;
    ctx.strokeStyle = "#0fbcf9";

    for(let i=0;i<4;i++) {
        // Draw 1/4 of the circle then change color
        let startAngle=i*Math.PI/2;
        let endAngle=startAngle+Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(pixelsToCanvas().x, pixelsToCanvas().y);
        ctx.arc(pixelsToCanvas().x, pixelsToCanvas().y, radius,startAngle,endAngle);
        ctx.closePath();
        ctx.fillStyle=colors[i];
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

//----------------------
// Draws out origo line
//----------------------

function drawOrigoLine() {
    ctx.lineWidth = 1 * zoomValue;
    ctx.strokeStyle = "#0fbcf9";
    drawGridLine(origoOffsetX, 0, origoOffsetX, canvas.height);
    drawGridLine(0, origoOffsetY, canvas.width, origoOffsetY);
}

//---------------------
// Draws out grid line
//---------------------

function drawGridLine(startX, startY, endX, endY) {
    ctx.lineWidth = 1 * zoomValue;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.closePath();
}

//-------------------------------------------
// gridToSVG: draws the whole background gridlayout
//-------------------------------------------

function gridToSVG(width, height) {
    var str = "", stroke = "";
    for (var i = 0; i < width; i++) {
        if (i % 5 == 0) stroke = "rgb(208, 208, 220)"; //This is a "thick" line
        else stroke = "rgb(238, 238, 250)";
        str += "<line x1='"+(i*gridSize)+"' y1='0' x2='"+(i*gridSize)+"' y2='"+height+"' style='stroke:"+stroke+";stroke-width:1;' />";
    }
    for (var i = 0; i < height; i++) {
        if (i % 5 == 0) stroke = "rgb(208, 208, 220)"; //This is a "thick" line
        else stroke = "rgb(238, 238, 250)";
        str += "<line x1='0' y1='"+(i*gridSize)+"' x2='"+width+"' y2='"+(i*gridSize)+"' style='stroke:"+stroke+";stroke-width:1;' />";
    }
    return str;
}

//------------------------------------------------------------------------------
// clearCanvas: remove all elements in the diagram array.
//              it hides the points by placing them beyond the users view.
//------------------------------------------------------------------------------

function clearCanvas() {
    while (diagram.length > 0) {
        diagram[diagram.length - 1].erase();
        diagram.pop();
    }
    for (var i = 0; i < points.length;) {
        points.pop();
    }
    resetSerialNumbers();
    updateGraphics();
    SaveState();
}

//--------------------------------------------------------------------------
// Used when canvas is cleared to avoid unnecessarily high serial numbers
//--------------------------------------------------------------------------

function resetSerialNumbers(){
    settings.serialNumbers = {
        Attribute: 0,
        Entity: 0,
        Relation: 0,
        UML: 0,
        Text: 0,
    }
}

// the purpose is not very clear
var consloe = {};
consloe.log = function(gobBluth) {
    document.getElementById("consloe").innerHTML = ((JSON.stringify(gobBluth) + "<br>") + document.getElementById("consloe").innerHTML);
}

//------------------------------------------------------------------------------
// developerMode:
// this function show and hides developer options.
//------------------------------------------------------------------------------

var previousToolbarState = currentMode.er;
var developerModeActive = true;                // used to repressent a switch for whenever the developerMode is enabled or not.
function developerMode(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    resetToolButtonsPressed();
    developerModeActive = !developerModeActive;
    // save the previous toolbarstate so that we can return to it
    if (developerModeActive) previousToolbarState = toolbarState;
    toolbarState = currentMode.dev;
    if (developerModeActive) {
        showCrosses();
        drawOrigo();                                                                    // Draw origo on canvas
        switchToolbarDev(event);                                                             // ---||---
        document.getElementById('toolbarTypeText').innerHTML = 'DEV: All';             // Change the text to DEV.
        $("#displayAllTools").removeClass("drop-down-item drop-down-item-disabled");    // Remove disable of displayAllTools id.
        setCheckbox($(".drop-down-option:contains('ER')"), crossER=false);              // Turn off crossER.
        setCheckbox($(".drop-down-option:contains('UML')"), crossUML=false);            // Turn off crossUML.
        setCheckbox($(".drop-down-option:contains('Display All Tools')"),
            crossDEV=true);                                                             // Turn on crossDEV.
        setCheckbox($(".drop-down-option:contains('Developer mode')"), true);
    } else {
        // switch to the saved toolbarstate
        if (previousToolbarState == currentMode.er) switchToolbarER();
        else if (previousToolbarState == currentMode.uml) switchToolbarUML();
        $("#displayAllTools").addClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Developer mode')"), false);
        hideCrosses();
    }
    reWrite();
    updateGraphics();
}

function setModeOnRefresh() {
    const tempToolbarState = localStorage.getItem("toolbarState");
    if(tempToolbarState !== null) {
        toolbarState = tempToolbarState;
    } else {
        toolbarState = currentMode.er;
    }

    developerModeActive = false;

    if(toolbarState == currentMode.er) {
        switchToolbarER();
        hideCrosses();
    } else if(toolbarState == currentMode.uml) {
        switchToolbarUML();
        hideCrosses();
    } else if(toolbarState == currentMode.dev) {
        developerModeActive = true;
        showCrosses();
        switchToolbarDev(event);
        setCheckbox($(".drop-down-option:contains('Developer mode')"), developerModeActive);
        $("#displayAllTools").removeClass("drop-down-item drop-down-item-disabled");
    } else {
        switchToolbarER();
        hideCrosses();
    }
}

//--------------------------------------
// Shows crosses when in developer mode
//--------------------------------------

function showCrosses() {
    crossStrokeStyle1 = "#f64";
    crossFillStyle = "#d51";
    crossStrokeStyle2 = "#d51";
}

//-----------------------------------------
// Hide crosses when not in developer mode
//-----------------------------------------

function hideCrosses() {
    crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
    crossFillStyle = "rgba(255, 102, 68, 0.0)";
    crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
}

//------------------------------------------------------------------------------
// modeSwitchConfirmed:
// This function calls the switch methods if the change is accepted, called
// when clicking the dialog.
//------------------------------------------------------------------------------

function modeSwitchConfirmed(confirmed) {
    modeSwitchDialogActive = false;
    $("#modeSwitchDialog").hide();
    if(confirmed){
        resetToolButtonsPressed();
        if (targetMode == 'ER') {
            switchToolbarER();
        } else if (targetMode == 'UML') {
            switchToolbarUML();
        }
    }
}

//-----------------------------------
// Switches between modes ER and UML
//-----------------------------------

function toggleMode() {
    if(toolbarState == "ER" && !developerModeActive){
        switchToolbarTo("UML");
    } else if (toolbarState == "UML" && !developerModeActive) {
        switchToolbarTo("ER");
    } else {
        if(toolbarState == "ER") {
            switchToolbarTo("UML");
        } else {
            switchToolbarTo("ER");
        }
    }
}

//------------------------------------------------------------------------------
// switchToolbarTo:
// This function switch opens a dialog for confirmation and sets which mode
// to change to.
//------------------------------------------------------------------------------

function switchToolbarTo(target) {
    if (toolbarState == target) {
      return;
    }
    targetMode = target;
    modeSwitchDialogActive = true;
    //only ask for confirmation when developer mode is off
    if (developerModeActive) {
        modeSwitchConfirmed(true);
    } else {
        $("#modeSwitchDialog").css("display", "flex");
        var toolbarTypeText = document.getElementById('toolbarTypeText').innerHTML;
        document.getElementById("modeSwitchTarget").innerHTML = "Change mode from " + toolbarTypeText + " to " + targetMode;
    }
}

//------------------------------------------------------------------------------
// SwitchToolbarER:
// This function handles everything that need to happen when the toolbar
// changes to ER. It changes toolbar and turn on/off crosses on the menu.
//------------------------------------------------------------------------------

var crossER = false;
function switchToolbarER() {
    toolbarState = currentMode.er;                                                  // Change the toolbar to ER.
    switchToolbar('ER');
    if (developerModeActive) {
        document.getElementById('toolbarTypeText').innerHTML = 'DEV: ER';
    } else {
        document.getElementById('toolbarTypeText').innerHTML = 'Mode: ER';              // Change the text to ER.
    }
    setCheckbox($(".drop-down-option:contains('ER')"), crossER=true);               // Turn on crossER.
    setCheckbox($(".drop-down-option:contains('UML')"), crossUML=false);            // Turn off crossUML.
    setCheckbox($(".drop-down-option:contains('Display All Tools')"),
        crossDEV=false);                                                            // Turn off crossDEV.
}

//------------------------------------------------------------------------------
// SwitchToolbarUML:
// This function handles everything that need to happen when the toolbar
// changes to UML. It changes toolbar and turn on/off crosses on the menu.
//------------------------------------------------------------------------------

var crossUML = false;
function switchToolbarUML() {
    toolbarState = currentMode.uml;                                                 // Change the toolbar to UML.
    switchToolbar('UML');
    if (developerModeActive) {
        document.getElementById('toolbarTypeText').innerHTML = 'DEV: UML';
    } else {
        document.getElementById('toolbarTypeText').innerHTML = 'Mode: UML';              // Change the text to UML.
    }                                                           // ---||---
    setCheckbox($(".drop-down-option:contains('UML')"), crossUML=true);             // Turn on crossUML.
    setCheckbox($(".drop-down-option:contains('ER')"), crossER=false);              // Turn off crossER.
    setCheckbox($(".drop-down-option:contains('Display All Tools')"),
    crossDEV=false);                                                            // Turn off crossUML.
}

//------------------------------------------------------------------------------
// SwitchToolbarDev:
// This function handles everything that need to happen when the toolbar
// changes to Dev. It changes toolbar and turn on/off crosses on the menu.
//------------------------------------------------------------------------------

var crossDEV = false;
function switchToolbarDev(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    if(!developerModeActive){
        return;
    }
    toolbarState = currentMode.dev;                                                 // Change the toolbar to DEV.
    switchToolbar('Dev');                                                           // ---||---
    document.getElementById('toolbarTypeText').innerHTML = 'DEV: All';             // Change the text to UML.
    setCheckbox($(".drop-down-option:contains('Display All Tools')"),
        crossDEV=true);                                                             // Turn on crossDEV.
    setCheckbox($(".drop-down-option:contains('UML')"), crossUML=false);            // Turn off crossUML.
    setCheckbox($(".drop-down-option:contains('ER')"), crossER=false);              // Turn off crossER.
}

//----------------------------------------------------------------------
// removeLocalStorage: this function is running when you click the button clear diagram
//----------------------------------------------------------------------

function removeLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem("localdiagram");
    }
}

//----------------------------------------------------------------------------------------------------------------
// This function allows us to choose how many decimals (precision argument) that a value will be rounded down to.
//----------------------------------------------------------------------------------------------------------------

function decimalPrecision(value, precision) {
  var multipler = Math.pow(10, precision || 0);
  return Math.round(value * multipler) / multipler;
}

//--------------------------------------------------------------------------------------------
// reWrite: Function that rewrites the values of zoom and x+y that's under the canvas element
//--------------------------------------------------------------------------------------------

function reWrite() {
    const coordinatesElement = document.getElementById("valuesCanvas");
    const zoomTextElement = document.getElementById("zoomV");

    if (developerModeActive) {
        let coordinatesText = `<p><b>Mouse:</b> (${decimalPrecision(currentMouseCoordinateX, 0).toFixed(0)}, ${decimalPrecision(currentMouseCoordinateY, 0).toFixed(0)})</p>`;
        if (hoveredObject && hoveredObject.symbolkind != symbolKind.umlLine && hoveredObject.symbolkind != symbolKind.line && hoveredObject.figureType != "Free") {
            coordinatesText += `<p><b>Object center:</b> (${Math.round(points[hoveredObject.centerPoint].x)}, ${Math.round(points[hoveredObject.centerPoint].y)})</p>`;
        }
        coordinatesElement.innerHTML = `${coordinatesText}</p>`;
        if (!isMobile){
            coordinatesElement.style.display = "block";
        }
    } else {
        coordinatesElement.style.display = "none";
    }

    zoomTextElement.innerHTML = `<p><b>Zoom:</b> ${Math.round(zoomValue * 100)}%</p>`;
    enableSelectedItemOptions();
}

//----------------------------------------
// Renderer
//----------------------------------------

var momentexists = 0;
var resave = false;
function returnedSection(data) {
    retdata = data;
    if (data['debug'] != "NONE!") {
        alert(data['debug']);
    }
}

//--------------------------------------------------------------------
// refreshFunction: Handles refresh, makes sure that the diagram after the refresh
//                  is equal to the diagram before refresh
//--------------------------------------------------------------------

function refreshFunction() {
    console.log("refreshFunction running");
    refreshTimer = setRefreshTime();
    if (refresh_lock == false) {
        console.log("refresh diagram");
        loadDiagram();
    }
}

//--------------------
// Gets current date
//--------------------

function getCurrentDate() {
    console.log("getCurrentDate running");
    return new Date().getTime();
}

//-------------------
// Sets refresh time
//-------------------

function setRefreshTime() {
    var time = 5000;
    lastDiagramEdit = localStorage.getItem('lastEdit');
    if (typeof lastDiagramEdit !== "undefined") {
        var timeDifference = getCurrentDate() - lastDiagramEdit;
        refresh_lock = timeDifference > 604800000 ? true : false;
        time = timeDifference <= 259200000 ? 5000 : 300000;
    }
    return time;
}

//----------------------------------
// Adds a group to selected objects
//----------------------------------

function addGroupToSelected(event) {
    event.stopPropagation();

    if (selected_objects.length < 1) return;
    var tempList = [];

    // find all symbols/freedraw objects that is going to be in the group
    for (var i = 0; i < selected_objects.length; i++) {
        // do not group lines
        if(selected_objects[i].kind == kind.symbol &&
            (selected_objects[i].symbolkind == symbolKind.line || selected_objects[i].symbolkind == symbolKind.umlLine)) {
            continue;
        } else {
            tempList.push(selected_objects[i]);
        }
    }
    // remove the current group the objects have
    for (var i = 0; i < tempList.length; i++ ) {
        tempList[i].group = 0;
    }
    // check what group numbers already exist
    var currentGroups = [];
    for (var i = 0; i < diagram.length; i++) {
        // don't check lines
        if (diagram[i].kind == kind.symbol && (diagram[i].symbolkind == symbolKind.line || diagram[i].symbolkind == symbolKind.umlLine)) {
        } else {
            if (diagram[i].group != 0) {
                currentGroups.push(diagram[i].group);
            }
        }
    }
    // assign nextGroupNumber to a group number that doesn't exist already, max 1000 groups
    var nextGroupNumber = 1;
    for (var i = 0; i < 1000; i++) {
        var numberAvailable = true;
        for (var j = 0; j < currentGroups.length; j++) {
            if (nextGroupNumber == currentGroups[j]) {
                numberAvailable = false;
                nextGroupNumber++;
                break;
            }
        }
        if (numberAvailable) break;
    }
    // assign the group number to the selected objects
    for (var i = 0; i < tempList.length; i++) {
        tempList[i].group = nextGroupNumber;
    }
    SaveState();
    updateGraphics();
}

//-----------------------------------------
// removes the group from selected objects
//-----------------------------------------

function removeGroupFromSelected(event) {
    event.stopPropagation();
    for (var i = 0; i < selected_objects.length; i++) {
        // do not do anything with lines
        if (selected_objects[i].kind == kind.symbol &&
            (selected_objects[i].symbolkind == symbolKind.line || selected_objects[i].symbolkind == symbolKind.umlLine)) {
            continue;
        }
        selected_objects[i].group = 0;
    }
    SaveState();
    updateGraphics();
}
//------------------------------------------------------------------------------
// all symbols with the same group as symbol is set to targeted (true or false)
//------------------------------------------------------------------------------

function setTargetedForSymbolGroup(symbol, targeted) {
    for (var i = 0; i < diagram.length; i++) {
        if (symbol.group != 0 && diagram[i] != symbol && diagram[i].group == symbol.group) {
            if (targeted) {
                selected_objects.push(diagram[i]);
            } else {
                var index = selected_objects.indexOf(diagram[i]);
                if (index > -1) {
                    selected_objects.splice(index, 1);
                }
            }
            diagram[i].targeted = targeted;
        }
    }
}

//----------------------------------------------------------------------
// lockSelected: the selected objects are locked
//----------------------------------------------------------------------

function lockSelected(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    for(var i = 0; i < selected_objects.length; i++) {
        if(selected_objects[i].kind == kind.symbol) {
            // Lines should not be possible to lock
            if(selected_objects[i].symbolkind == symbolKind.line || selected_objects[i].symbolkind == symbolKind.umlLine){
                continue;
            }
        }
        selected_objects[i].isLocked = !selected_objects[i].isLocked;

        if(selected_objects[i].isLocked) {
            drawLock(selected_objects[i]);
        }
        else {
            updateGraphics();
        }
    }
    SaveState();
}

function align(event, mode) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked

    if(mode == 'top') {
       alignTop(selected_objects);
    } else if(mode == 'left') {
       alignLeft(selected_objects);
    } else if(mode == 'bottom') {
       alignBottom(selected_objects);
    } else if(mode == 'right') {
       alignRight(selected_objects);
    } else if(mode == 'verticalCenter') {
       alignVerticalCenter(selected_objects);
    } else if(mode == 'horizontalCenter') {
       alignHorizontalCenter(selected_objects);
    }
    updateGraphics();
    hashFunction();
    if(moved == true){
        SaveState();
    }
}

//---------------------------------------------------------------------
// These functions moves the objects either left, right, top or bottom
//---------------------------------------------------------------------

function alignLeft(selected_objects) {
    var lowest_x = 99999;
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if(points[selected_objects[i].topLeft].x < lowest_x) {
            lowest_x = points[selected_objects[i].topLeft].x;
        }
    }
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].x;
        if(selected_objects[i].kind==2){
            selected_objects[i].move(lowest_x-points[selected_objects[i].topLeft].x, 0);
        }
        if(oldPosition != points[selected_objects[i].topLeft].x){
            moved = true;
        }
    }
}

function alignTop(selected_objects) {
    var lowest_y = 99999;
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if(points[selected_objects[i].topLeft].y < lowest_y) {
            lowest_y = points[selected_objects[i].topLeft].y;
        }
    }
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].y;
        if(selected_objects[i].kind==2){
            selected_objects[i].move(0, lowest_y-points[selected_objects[i].topLeft].y);
        }
        if(oldPosition != points[selected_objects[i].topLeft].y){
            moved = true;
        }
    }
}

function alignRight(selected_objects) {
    var highest_x = 0;
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if(points[selected_objects[i].bottomRight].x > highest_x) {
            highest_x = points[selected_objects[i].bottomRight].x;
        }
    }
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].x;
        if(selected_objects[i].kind==2){
            selected_objects[i].move(highest_x-points[selected_objects[i].bottomRight].x, 0);
        }
        if(oldPosition != points[selected_objects[i].topLeft].x){
            moved = true;
        }
    }
}

function alignBottom(selected_objects) {
    var highest_y = 0;
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if(points[selected_objects[i].bottomRight].y > highest_y) {
            highest_y = points[selected_objects[i].bottomRight].y;
        }
    }
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].y;
        if(selected_objects[i].kind==2){
            selected_objects[i].move(0, highest_y-points[selected_objects[i].bottomRight].y);
        }
        if(oldPosition != points[selected_objects[i].topLeft].y){
            moved = true;
        }
    }
}

//--------------------------------------------------------------------
// These functions move the objects either horizontal or vertical
//--------------------------------------------------------------------

function alignVerticalCenter(selected_objects) {
    var highest_x = 0, lowest_x = 99999, selected_center_x = 0;
    var temporary_objects = [];
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if(points[selected_objects[i].topLeft].x > highest_x) {
            highest_x = points[selected_objects[i].bottomRight].x;
        }
        if(points[selected_objects[i].bottomRight].x < lowest_x) {
            lowest_x = points[selected_objects[i].topLeft].x;
        }
    }
    selected_center_x = (highest_x-lowest_x)/2;
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].x;
        if(selected_objects[i].kind==2){
            var object_width = (points[selected_objects[i].topLeft].x - points[selected_objects[i].bottomRight].x);
            selected_objects[i].move((-points[selected_objects[i].topLeft].x) + (lowest_x+selected_center_x) + object_width/2, 0);
        }
        if(oldPosition != points[selected_objects[i].topLeft].x){
            moved = true;
        }
    }
}

function alignHorizontalCenter(selected_objects) {
    var highest_y = 0, lowest_y = 99999, selected_center_y = 0;
    var temporary_objects = [];
    moved = false;
    for(var i = 0; i < selected_objects.length; i++) {
        temporary_objects.push(selected_objects[i]);
        if(points[selected_objects[i].bottomRight].y > highest_y) {
            highest_y = points[selected_objects[i].bottomRight].y;
        }
        if(points[selected_objects[i].topLeft].y < lowest_y) {
            lowest_y = points[selected_objects[i].topLeft].y;
        }
    }
    selected_center_y = (highest_y-lowest_y)/2;
    for(var i = 0; i < selected_objects.length; i++) {
        var oldPosition = points[selected_objects[i].topLeft].y;
        if(selected_objects[i].kind==2){
            var object_height = (points[selected_objects[i].bottomRight].y - points[selected_objects[i].topLeft].y);
            selected_objects[i].move(0, -((points[selected_objects[i].topLeft].y - (lowest_y+selected_center_y))+object_height/2));
        }
        if(oldPosition != points[selected_objects[i].topLeft].y){
            moved = true;
        }
    }
}

// -------------------------------------------------------------------------------------
// removeDuplicatesInList: Objects in selected_objects get duplicated for some reason.
//                         This function returns a list without the duplicated objects.
// -------------------------------------------------------------------------------------

function removeDuplicatesInList(selected_objects) {
    let temporary_objects = [];
    for(let i = 0; i < selected_objects.length; i++) {
        if(temporary_objects.indexOf(selected_objects[i]) == -1) {
            temporary_objects.push(selected_objects[i]);
        }
    }
    return temporary_objects;
}

function removeLineObjectsFromList(selected_objects) {
    let temporary_objects = [];
    for(let i = 0; i < selected_objects.length; i++) {
        if(selected_objects[i].symbolkind != symbolKind.line) {
            temporary_objects.push(selected_objects[i]);
        }
    }
    return temporary_objects;
}

function sortObjects(selected_objects, mode) {
  //Sorts objects by X or Y position
  var position = [];

      for(var i = 0; i < selected_objects.length; i++) {
        if(mode=='vertically') position.push(points[selected_objects[i].topLeft].y);
        else if(mode=='horizontally') position.push(points[selected_objects[i].topLeft].x);
      }
      position.sort(function(a,b) { return a - b });

      var private_objects = selected_objects.splice([]);
      var swap = null;

      for(var i = 0; i < private_objects.length; i++) {
        swap = private_objects[i];
          for(var j = 0; j < position.length; j++) {
            if(i==j) continue;
              if((mode=='vertically' && points[private_objects[i].topLeft].y == position[j])
              || (mode=='horizontally' && points[private_objects[i].topLeft].x == position[j])) {
                  private_objects[i] = private_objects[j];
                  private_objects[j] = swap;
              }
            }
        }
  return private_objects;
}

//----------------------------------------------------------------------
// Distributes the entities with even spacing either
//            vertically or horizontally
//----------------------------------------------------------------------

function distribute(event, axis) {
    let spacing = 30;
    moved = false;
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked

    if(axis=='vertically') {
      // Added spacing when there are objects that overlap eachother.
      temporary_objects = removeDuplicatesInList(selected_objects);
      temporary_objects = removeLineObjectsFromList(temporary_objects);
      temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].y - points[b.centerPoint].y});
      for(var i = 1; i < temporary_objects.length; i++) {
          if(points[temporary_objects[i].topLeft].y < points[temporary_objects[i-1].bottomRight].y + spacing) {
              var oldPosition = points[selected_objects[i].topLeft].y;
              var difference = points[temporary_objects[i].topLeft].y - points[temporary_objects[i-1].bottomRight].y - spacing;
              temporary_objects[i].move(0, -difference);
            if(oldPosition != points[selected_objects[i].topLeft].y){
                moved = true;
            }
          }
      }
    } else if(axis=='horizontally') {
      // Added spacing when there are objects that overlap eachother.
      temporary_objects = removeDuplicatesInList(selected_objects);
      temporary_objects = removeLineObjectsFromList(temporary_objects);
      temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].x - points[b.centerPoint].x});
      for(var i = 1; i < temporary_objects.length; i++) {
           if(points[temporary_objects[i].topLeft].x < points[temporary_objects[i-1].bottomRight].x + spacing) {
             var oldPosition = points[selected_objects[i].topLeft].x;
             var difference = points[temporary_objects[i].topLeft].x - points[temporary_objects[i-1].bottomRight].x - spacing;
             temporary_objects[i].move(-difference, 0);
             if(oldPosition != points[selected_objects[i].topLeft].x){
                moved = true;
             }
          }
       }
    }
    // There is a posibility for more types
    updateGraphics();
    hashFunction();
    if(moved == true){
        SaveState();
    }
}

//----------------------------------------------------------------------
// undoDiagram: removes the last object that was drawn
//----------------------------------------------------------------------

function undoDiagram(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    if (diagramNumber > 0) diagramNumber--;
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumber);
    localStorage.setItem("diagramNumber", diagramNumber);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}

//----------------------------------------------------------------------
// redoDiagram: restores the last object that was removed
//----------------------------------------------------------------------

function redoDiagram(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    diagramNumber = localStorage.getItem("diagramNumber");
    diagramNumber++;
    if(!localStorage.getItem("diagram" + diagramNumber)){
        diagramNumber--;
    }
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumber);
    localStorage.setItem("diagramNumber", diagramNumber);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}

//----------------------------------------------------------------------
// diagramToSVG: Used when exporting the diagram to svg
//----------------------------------------------------------------------
function diagramToSVG() {
    var str = "";
    // Convert figures to SVG first so they appear behind other objects
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.path) str += diagram[i].figureToSVG();
    }
    // Convert lines to SVG second so they appear behind other symbols but above figures
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.symbol && diagram[i].symbolkind == symbolKind.line) str += diagram[i].symbolToSVG(i);
    }
    // Convert other objects to SVG
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.symbol && diagram[i].symbolkind != symbolKind.line) str += diagram[i].symbolToSVG(i);
    }
    return str;
}

function diagramToSVG() {
    var str = "";
    // Convert figures to SVG first so they appear behind other objects
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.path) str += diagram[i].figureToSVG();
    }
    // Convert lines to SVG second so they appear behind other symbols but above figures
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.symbol && diagram[i].symbolkind == symbolKind.line) str += diagram[i].symbolToSVG(i);
    }
    // Convert other objects to SVG
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == kind.symbol && diagram[i].symbolkind != symbolKind.line) str += diagram[i].symbolToSVG(i);
    }
    return str;
}

//----------------------------------------------------------------------
// setCheckbox: Check or uncheck the checkbox contained in 'element'
//              This function adds a checkbox element if there is none
//
// IMPORTANT: This function only updates the checkbox graphically, it
// does not change the value of the underlying variable. When calling
// this function it should be called along with an explicit assignment like:
//         checkboxVar = true;
//         setCheckbox(checkboxElement, checkboxVar);
// Or like:
//         setCheckbox(checkboxElement, checkboxVar = true);
// NOT like:
//         setCheckbox(checkboxElement, true); // checkboxVar is unchanged
// The last example results in unchanged behaviour in the diagram but with
// the checkbox icon appearing as if it is active.
//----------------------------------------------------------------------

function setCheckbox(element, check) {
    // Add checkbox element if it doesn't exist
    if ($(element).children(".material-icons").length == 0) {
        $(element).append("<i class=\"material-icons\" style=\"float: right; padding-right: 8px; font-size: 18px;\">check</i>");
    }

    if (check) {
        $(element).children(".material-icons").show();
    } else {
        $(element).children(".material-icons").hide();
    }
}

//--------------------------------------------------------
// Used for toggling orientation icon
// Both for showing / hiding and also for changning image
//--------------------------------------------------------

function setOrientationIcon(element, check) {
    // Init icon element
    if ($(element).children(".material-icons").length == 0) {
        $(element).append("<i class=\"material-icons\" style=\"float: right; padding-right: 8px; font-size: 18px;\">crop_portrait</i>");
    }

    // Set icon either to portrait or landscape
    if(toggleA4){
        if(A4Orientation == "landscape"){
            $(element).children(".material-icons")[0].innerHTML = "crop_16_9";
        }
        else if(A4Orientation == "portrait"){
            $(element).children(".material-icons")[0].innerHTML = "crop_portrait";
        }
    }

    // Toggle visibility
    if (check) {
        $(element).children(".material-icons").show();
    } else {
        $(element).children(".material-icons").hide();
    }
}

// ----------------------------------------------------------------------------
// DIAGRAM TOOLBOX SECTION
// ----------------------------------------------------------------------------

const toolbarER = currentMode.er;
const toolbarUML = currentMode.uml;
const toolbarDeveloperMode = currentMode.dev;

//----------------------------------------------------------------------
// switchToolbar: function for switching the toolbar state (All, ER, UML),
//                not sure what the numbers 0 an 3 mean
//----------------------------------------------------------------------

function switchToolbar(mode) {
  if(mode == currentMode.er) {
      toolbarState = toolbarER;
  } else if(mode == currentMode.uml) {
      toolbarState = toolbarUML;
  } else if(mode == currentMode.dev) {
      toolbarState = toolbarDeveloperMode;
  }

  document.getElementById('toolbarTypeText').innerHTML = "Mode: ER";

  localStorage.setItem("toolbarState", toolbarState);
  //hides irrelevant buttons, and shows relevant buttons
  if(toolbarState == toolbarER) {
    $(".toolbar-drawer").hide();
    $("#drawerTools").show();
    $("#drawerCreate").show();
    $("#drawerUndo").show();
    $(".tlabel").hide();
    $("#labelCreate").show();
    $("#labelTools").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#attributebutton").show();
    $("#entitybutton").show();
    $("#relationbutton").show();
    $("#drawerDraw").show();
    $("#labelDraw").show();
    $("#drawfreebutton").show();
    $("#drawtextbutton").show();
  }
  else if (toolbarState == toolbarUML) {
    $(".toolbar-drawer").hide();
    $("#drawerTools").show();
    $("#drawerCreate").show();
    $("#drawerDraw").show();
    $("#drawerUndo").show();
    $(".tlabel").hide();
    $("#labelCreate").show();
    $("#labelTools").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#linebutton").show();
    $("#classbutton").show();
    $("#drawtextbutton").show();
  } else if(toolbarState == toolbarDeveloperMode) {
    $(".toolbar-drawer").show();
    $("#drawerTools").show();
    $("#drawerCreate").show();
    $("#drawerUndo").show();
    $(".tlabel").show();
    $("#labelCreate").show();
    $("#labelTools").show();
    $("#labelUndo").show();
    $(".buttonsStyle").show();
    $("#linebutton").show();
    $("#attributebutton").show();
    $("#entitybutton").show();
    $("#relationbutton").show();
    $("#drawerDraw").show();
    $("#labelDraw").show();
    $("#drawfreebutton").show();
    $("#drawtextbutton").show();
  }
  document.getElementById('toolbar-switcher').value = toolbarState;
}

// ----------------------------------
// DIAGRAM MOUSE SECTION
// ----------------------------------

//-------------------------------------------------------------------------
// zoomInMode: Function for the zoom in and zoom out in the canvas element
//             Zooms with pointer in focus when scrolling or center if
//             zoomba is used
//-------------------------------------------------------------------------

function zoomInMode(event) {
    // Save coordinates before changing zoom value
    let currentMouseX = pixelsToCanvas(currentMouseCoordinateX).x;
    let currentMouseY = pixelsToCanvas(0, currentMouseCoordinateY).y;

    let centerX = (canvas.width / 2 - origoOffsetX) / zoomValue;
    let centerY = (canvas.height / 2 - origoOffsetY) / zoomValue;

    let oldZoom = zoomValue;
    zoomValue = document.getElementById("ZoomSelect").value;
    localStorage.setItem("zoomValue", zoomValue);
    localStorage.setItem("cameraPosX", origoOffsetX);
    localStorage.setItem("cameraPosY", origoOffsetY);
    let zoomDifference = 1 + (zoomValue - oldZoom);

    // Move to mouse
    if(event.type == "wheel"){
        // Move canvas with difference between old mouse coordinates and new
        origoOffsetX += currentMouseX - pixelsToCanvas(currentMouseCoordinateX).x;
        origoOffsetY += currentMouseY - pixelsToCanvas(0, currentMouseCoordinateY).y;
    }
    // Move to center
    else {
        // Move canvas with difference between old canvas center coordinates and new
        origoOffsetX -= centerX * zoomDifference - centerX;
        origoOffsetY -= centerY * zoomDifference - centerY;
    }

    reWrite();
    updateGraphics();
}

function changeZoom(zoomValue, event) {
    var value = parseFloat(document.getElementById("ZoomSelect").value);
    value = value + parseFloat(zoomValue);
    document.getElementById("ZoomSelect").value = value;
    zoomInMode(event);
}

//-----------------------
// Canvas zoom on scroll
//-----------------------

function scrollZoom(event) {
    // deltaY is different for different browsers so 
    // wheelZoom might need to be changed in the future
    var wheelZoom = 99;
    var mousePadZoom = 5;

    if(event.mozInputSource){
        wheelZoom = 2;
        mousePadZoom = 0;
    }

    if(event.deltaY > wheelZoom){
        changeZoom(-0.1, event);
    } else if (event.deltaY < -wheelZoom) {
        changeZoom(0.1, event);
    } else if(event.deltaY > mousePadZoom) {
        changeZoom(-0.01, event);
    } else if (event.deltaY < -mousePadZoom) {
        changeZoom(0.01, event);
    }
}

//-------------------------------------------------------------------------
// findPos: Recursive Pos of div in document - should work in most browsers
//-------------------------------------------------------------------------

function findPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return {x:curleft, y:curtop};
}

function updateActivePoint() {
    if (sel.distance <= tolerance / zoomValue) { // sel.distance = the distance of the mouse from each corner point of the object
        activePoint = sel.point;
    } else {
        activePoint = null;
    }
}

function pointDistance(point1, point2) {
    //condition ? value-if-true : value-if-false
    var width = (point1.x > point2.x)? point1.x - point2.x: point2.x - point1.x;
    var height = (point1.y > point2.y)? point1.y - point2.y: point2.y - point1.y;

    return [width, height];
}
//---------------------------------------------------
// Check if the value causes the objects size to be <= the objects minimum size
// Used when moving a point and locking proportions
//---------------------------------------------------

function minSizeCheck(value, object, type) {
    var umlMax = object.minWidth;
    var entityMax = entityTemplate.width;
    var relationMax =relationTemplate.width;

    if (type == "y") {
        umlMax = object.minHeight;
        entityMax = entityTemplate.height
        relationMax = relationTemplate.height;
    }

    if ((value <= umlMax && object.symbolkind == symbolKind.uml)
    || (value <= entityMax && (object.symbolkind == symbolKind.erAttribute || object.symbolkind == symbolKind.erEntity))
    || (value <= relationMax && object.symbolkind == symbolKind.erRelation)) {
        // the value is inside or at the minimum size
        return true;
    } else {
        return false;
    }
}

//---------------------------------------------------
// Is called each time the mouse moves on the canvas
//---------------------------------------------------

function mousemoveevt(ev) {

    // Get canvasMouse coordinates for both X & Y.
    currentMouseCoordinateX = canvasToPixels(ev.clientX - boundingRect.left).x;
    currentMouseCoordinateY = canvasToPixels(0, ev.clientY - boundingRect.top).y;

    // deltas are used to determine the range of which the mouse is allowed to move when pressed.
    deltaX = 2;
    deltaY = 2;
    if (typeof InitPageX !== 'undefined' && typeof InitPageY !== 'undefined') {
        // The movement needs to be larger than the deltas in order to enter the MoveAround mode.
        diffX = ev.pageX - InitPageX;
        diffY = ev.pageY - InitPageY;
        if (
            (diffX > deltaX) || (diffX < -deltaX)
            ||
            (diffY > deltaY) || (diffY < -deltaY)
        ) {
            // Entering MoveAround mode
            if (uimode != "MoveAround") {
                activateMovearound();
            }
            updateGraphics();
        }
    }

    if((canvasLeftClick || canvasRightClick) && uimode == "MoveAround") {
        // Drag canvas
        origoOffsetX += (currentMouseCoordinateX - startMouseCoordinateX) * zoomValue;
        origoOffsetY += (currentMouseCoordinateY - startMouseCoordinateY) * zoomValue;
        startMouseCoordinateX = canvasToPixels(ev.clientX - boundingRect.left).x;
        startMouseCoordinateY = canvasToPixels(0, ev.clientY - boundingRect.top).y;
        localStorage.setItem("cameraPosX", origoOffsetX);
        localStorage.setItem("cameraPosY", origoOffsetY);
    }
    reWrite();
    updateGraphics();

    if(!canvasRightClick) {
        if (md == mouseState.empty) {
            // Select a new point only if mouse is not already moving a point or selection box
            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            if (sel.distance < tolerance / zoomValue) {
                // check so that the point we're hovering over belongs to an object that's selected
                var pointBelongsToObject = false;
                for (var i = 0; i < selected_objects.length; i++) {
                    if (sel.attachedSymbol == selected_objects[i]) {
                        pointBelongsToObject = true;
                    }
                }
                // when in movearound mode or if the point doesn't belong to a selected object then don't display different pointer when hovering points
                if (uimode != "MoveAround" && pointBelongsToObject) {
                    //Change cursor if you are hovering over a point and its not a line
                    if(sel.attachedSymbol.symbolkind == symbolKind.line || sel.attachedSymbol.symbolkind == symbolKind.umlLine || sel.attachedSymbol.isLocked) {
                        //The point belongs to a umlLine or Line
                        canvas.style.cursor = "default";
                    } else {
                        // Should not change when drawing a line.
                        if (uimode != "CreateLine") {
                            canvas.style.cursor = "url('../Shared/icons/hand_move.cur'), auto";
                        }
                    }
                }
            } else {
                if (uimode == "MoveAround") {
                    canvas.style.cursor = "all-scroll";
                } else if (uimode == "CreateLine") {
                    //When CreateLine-button is selected the cursor is "pointer".
                    canvas.style.cursor = "pointer";
                    //If objects are hovered while button is selected, the cursor remains the same (pointer).
                } else if (hoveredObject && !hoveredObject.isLocked) {
                    if (hoveredObject.symbolkind == symbolKind.line || hoveredObject.symbolkind == symbolKind.umlLine) {
                        canvas.style.cursor = "pointer";
                    } else {
                        canvas.style.cursor = "all-scroll";
                    }
                } else {
                    canvas.style.cursor = "default";
                    // set cursor to pointer if a lock is hovered
                    for (var i = 0; i < diagram.length; i++) {
                        if (diagram[i].isLockHovered) {
                            canvas.style.cursor = "pointer";
                        }
                    }
                }
            }
            // If mouse is not pressed highlight closest point
            points.clearAllSelects();
            movobj = diagram.itemClicked();
        } else if (md == mouseState.noPointAvailable) {
            // If mouse is pressed down and no point is close show selection box
        } else if (md == mouseState.insidePoint) {
            // check so that the point were trying to move is attached to a targeted symbol and If the selected object is locked, you can't resize the object
            if (!sel.attachedSymbol.targeted || sel.attachedSymbol.isLocked ) {
                return;
            }
            // If mouse is pressed down and at a point in selected object - move that point
            // this is for the topLeft and bottomRight points
            if(!sel.point.fake) {
                // for locking proportions of object when resizing it
                if(shiftIsClicked) {
                    var object;
                    // the movement change we wan't to make
                    var change = ((currentMouseCoordinateX - sel.point.x) + (currentMouseCoordinateY - sel.point.y)) / 2;
                    // find the object that has the point we want to move
                    for (var i = 0; i < diagram.length; i++) {
                        if (points[diagram[i].bottomRight] == sel.point || points[diagram[i].topLeft] == sel.point) {
                            object = diagram[i];
                            // the objects current width and height
                            var xDiff = points[object.bottomRight].x - points[object.topLeft].x;
                            var yDiff = points[object.bottomRight].y - points[object.topLeft].y;
                            // For making sure the proportions stay the same when the object is at it's minimum size on one of the axes
                            // so that it doesn't keep resizing one of the axes independently of the other

                            // if x size is equal to the objects min width
                            if (minSizeCheck(xDiff, object, "x")) {
                                var xDiffNew;
                                // set the new size depending on which point we're moving
                                if (points[object.bottomRight] == sel.point) {
                                    xDiffNew = (sel.point.x + change) - points[object.topLeft].x;
                                } else if (points[object.topLeft] == sel.point) {
                                    xDiffNew = points[object.bottomRight].x - (sel.point.x + change);
                                }
                                // set change to 0 if the new size isn't bigger than the minimum size
                                if (minSizeCheck(xDiffNew, object, "x")) {
                                    change = 0;
                                }
                            }
                            // if y size is equal to the objects min height, same as above but for y coordinates
                            if (minSizeCheck(yDiff, object, "y")) {
                                var yDiffNew;
                                if (points[object.bottomRight] == sel.point) {
                                    yDiffNew = (sel.point.y + change) - points[object.topLeft].y;
                                } else if (points[object.topLeft] == sel.point) {
                                    yDiffNew = points[object.bottomRight].y - (sel.point.y + change);
                                }
                                if (minSizeCheck(yDiffNew, object, "y")) {
                                    change = 0;
                                }
                            }
                        }
                    }
                    // apply resize
                    sel.point.x += change;
                    sel.point.y += change;
                } else {
                    // normal resize
                    sel.point.x = currentMouseCoordinateX;
                    sel.point.y = currentMouseCoordinateY;
                }
                // If we changed a point of a path object,
                // we need to recalculate the bounding-box so that it will remain clickable.
                // First we need to check if lastSelectedObject exists
                if(diagram[lastSelectedObject] && diagram[lastSelectedObject].kind == kind.path) {
                    diagram[lastSelectedObject].calculateBoundingBox();
                }

                // If recursive line, move both points at the same time to make sure
                // they end up next to each other
                var selObj = diagram[lastSelectedObject];
                if (selObj && selObj.isRecursiveLine) {
                    var otherPoint = points[selObj.topLeft] == sel.point ? points[selObj.bottomRight] : points[selObj.topLeft];
                    otherPoint.x = sel.point.x;
                    otherPoint.y = sel.point.y;
                }
            // this is for the other two points that doesn't really exist: bottomLeft and topRight
            } else {
                sel.point.x.x = currentMouseCoordinateX;
                sel.point.y.y = currentMouseCoordinateY;
            }
            updateGraphics();
            // If mouse is pressed down and at a point in selected object - move that point
        } else if (md == mouseState.insideMovableObject) {
            // If mouse is pressed down inside a movable object - move that object
            if (movobj != -1 ) {
                uimode = "Moved";
                $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
                for (var i = 0; i < diagram.length; i++) {
                    if (diagram[i].targeted == true && !diagram[movobj].isLocked && !diagram[i].isLocked) {
                        if(snapToGrid) {
                            // Set mouse start so it's snaped to grid.
                            startMouseCoordinateX = Math.round(startMouseCoordinateX / gridSize) * gridSize;
                            startMouseCoordinateY = Math.round(startMouseCoordinateY / gridSize) * gridSize;
                            // Coordinates for the top left corner of the object
                            var hoveredObjectStartTopLeftX = points[hoveredObject.topLeft].x;
                            var hoveredObjectStartTopLeftY = points[hoveredObject.topLeft].y;
                            // Coordinates for the point to snap to
                            var hoveredObjectSnapTopLeftX = Math.round(points[hoveredObject.topLeft].x / gridSize) * gridSize;
                            var hoveredObjectSnapTopLeftY = Math.round(points[hoveredObject.topLeft].y / gridSize) * gridSize;
                            // Snap the object that is being moved. Rest of the objects are untouched
                            diagram[movobj].move(hoveredObjectSnapTopLeftX - hoveredObjectStartTopLeftX, hoveredObjectSnapTopLeftY - hoveredObjectStartTopLeftY);
                            // Move the objects dependable on the grid size
                            currentMouseCoordinateX = Math.round(currentMouseCoordinateX / gridSize) * gridSize;
                            currentMouseCoordinateY = Math.round(currentMouseCoordinateY / gridSize) * gridSize;
                        }

                        diagram[i].move(currentMouseCoordinateX - startMouseCoordinateX, currentMouseCoordinateY - startMouseCoordinateY);

                        // Keep recursive lines together
                        for (var j = 0; j < diagram.length; j++) {
                            if (diagram[j].isRecursiveLine) {
                                points[diagram[j].topLeft].x = points[diagram[j].bottomRight].x;
                                points[diagram[j].topLeft].y = points[diagram[j].bottomRight].y;
                            }
                        }
                    }
                }
                startMouseCoordinateX = currentMouseCoordinateX;
                startMouseCoordinateY = currentMouseCoordinateY;
            }
        }
        if (md == mouseState.boxSelectOrCreateMode && uimode == "normal") {
            diagram.targetItemsInsideSelectionBox(currentMouseCoordinateX, currentMouseCoordinateY, startMouseCoordinateX, startMouseCoordinateY, true);
        } else {
            diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY);
        }
        updateGraphics();
        // Draw select or create dotted box
        if (md == mouseState.boxSelectOrCreateMode && uimode != "MoveAround") {
            if (figureType == "Free" && uimode == "CreateFigure") {
                if(p2 != null && !(isFirstPoint)) {
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.setLineDash([]);
                    if (!developerModeActive) {
                        hideCrosses();
                    }
                }
            } else if (uimode == "CreateEREntity") {
                if(entityTemplate.width / minimumDivisor < Math.abs(startMouseCoordinateX - currentMouseCoordinateX) 
                && entityTemplate.height / minimumDivisor < Math.abs(startMouseCoordinateY - currentMouseCoordinateY))
                {
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.closePath();
                    if (!developerModeActive) {
                        hideCrosses();
                    }
                }
            } else if(uimode == "CreateERRelation") {
                if(relationTemplate.width / minimumDivisor < Math.abs(startMouseCoordinateX - currentMouseCoordinateX) 
                && relationTemplate.height / minimumDivisor < Math.abs(startMouseCoordinateY - currentMouseCoordinateY))
                {
                    ctx.setLineDash([3, 3]);
                    var midx = pixelsToCanvas(startMouseCoordinateX).x+((pixelsToCanvas(currentMouseCoordinateX).x-pixelsToCanvas(startMouseCoordinateX).x)/2);
                    var midy = pixelsToCanvas(0, startMouseCoordinateY).y+((pixelsToCanvas(0, currentMouseCoordinateY).y-pixelsToCanvas(0, startMouseCoordinateY).y)/2);
                    ctx.beginPath();
                    ctx.moveTo(midx, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, midy);
                    ctx.lineTo(midx, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, midy);
                    ctx.lineTo(midx, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.closePath();
                    if (!developerModeActive) {
                        hideCrosses();
                    }
                }
            } else if(uimode == "CreateERAttr") {
                if(attributeTemplate.width / minimumDivisor < Math.abs(startMouseCoordinateX - currentMouseCoordinateX) 
                && attributeTemplate.height / minimumDivisor < Math.abs(startMouseCoordinateY - currentMouseCoordinateY))
                {
                    ctx.setLineDash([3, 3]);
                    drawOval(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y, pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.setLineDash([]);
                    if (!developerModeActive) {
                        hideCrosses();
                    }
                }
            } else if(uimode == "CreateLine") {
                // Path settings for preview line
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.setLineDash([]);
                if (!developerModeActive) {
                    hideCrosses();
                }
            } else if(uimode == "CreateUMLLine") {
                // Path settings for preview line
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.setLineDash([]);
                if (!developerModeActive) {
                    hideCrosses();
                }
              } else if(uimode == "CreateClass") {
                if(classTemplate.width / minimumDivisor < Math.abs(startMouseCoordinateX - currentMouseCoordinateX) 
                && classTemplate.height / minimumDivisor < Math.abs(startMouseCoordinateY - currentMouseCoordinateY))
                {
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
                    ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.closePath();
                    if (!developerModeActive) {
                        hideCrosses();
                    }
                }
            } else if(figureType != "Text" || uimode == "normal") {
              ctx.setLineDash([3, 3]);
              ctx.beginPath();
              ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
              ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
              ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
              ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
              ctx.lineTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
              ctx.strokeStyle = "#000";
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.closePath();
              if (!developerModeActive) {
                  hideCrosses();
              }
            }
        }
    }
}

//----------------------------------------------------------
// Is called when left mouse button is clicked on the canvas
//----------------------------------------------------------

function mousedownevt(ev) {
    mousemoveevt(event);    // Trigger the move event function to update mouse coordinates and avoid creating objects in objects
    if(ev.button == leftMouseClick){
        canvasLeftClick = true;
    } else if(ev.button == rightMouseClick) {
        canvasRightClick = true;
        if (typeof InitPageX == 'undefined' && typeof InitPageY == 'undefined') {
            InitPageX = ev.pageX;
            InitPageY = ev.pageY;
        }
    }

    currentMouseCoordinateX = canvasToPixels(ev.clientX - boundingRect.left).x;
    currentMouseCoordinateY = canvasToPixels(0, ev.clientY - boundingRect.top).y;
    startMouseCoordinateX = currentMouseCoordinateX;
    startMouseCoordinateY = currentMouseCoordinateY;

    if(uimode == "Moved" && md != mouseState.boxSelectOrCreateMode) {
        uimode = "normal";
        md = mouseState.empty;
    }

    if (uimode == "CreateLine" || uimode == "CreateUMLLine") {
        markedObject = diagram.indexOf(diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY));

        md = mouseState.boxSelectOrCreateMode;  // Box select or Create mode.
        //If you start on canvas or not
        if (markedObject == -1) {
            md = mouseState.empty;
        } else {
            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            //Store which object you are hovering over in lineStartObj
            lineStartObj = markedObject;

            //Get which kind of symbol mousedownevt execute on
            symbolStartKind = diagram[lineStartObj].symbolkind;
        }
    } else if (sel.distance < tolerance / zoomValue) {
        md = mouseState.insidePoint;
    } else if (movobj != -1) {
        md = mouseState.insideMovableObject;
        handleSelect();
    } else {
        md = mouseState.boxSelectOrCreateMode; // Box select or Create mode.
        if(ev.button == rightMouseClick && uimode == "CreateFigure"){
            endFreeDraw();
        }
        if (uimode != "MoveAround" && !ctrlIsClicked) {
            for (var i = 0; i < selected_objects.length; i++) {
                selected_objects[i].targeted = false;
            }
            lastSelectedObject = -1;
            selected_objects = [];
        }
        startMouseCoordinateX = currentMouseCoordinateX;
        startMouseCoordinateY = currentMouseCoordinateY;
    }
}

function handleSelect() {
    lastSelectedObject = diagram.itemClicked(currentMouseCoordinateX, currentMouseCoordinateY);
    var last = diagram[lastSelectedObject];

    if (last.targeted == false && uimode != "MoveAround") {
        for (var i = 0; i < diagram.length; i++) {
            diagram[i].targeted = false;
        }
        // Will add multiple selected diagram objects if the
        // CTRL/CMD key is currently active
        if (ctrlIsClicked) {
            if(selected_objects.indexOf(last) < 0) {
                selected_objects.push(last);
                last.targeted = true;
                setTargetedForSymbolGroup(last, true);
            }
            for (var i = 0; i < selected_objects.length; i++) {
                if (selected_objects[i].targeted == false) {
                    if(selected_objects.indexOf(last) < 0) {
                        selected_objects.push(last);
                    }
                    selected_objects[i].targeted = true;
                }
            }
        } else {
            selected_objects = [];
            selected_objects.push(last);
            last.targeted = true;
            setTargetedForSymbolGroup(last, true);
        }
    } else if(uimode != "MoveAround") {
        if(ctrlIsClicked) {
            var index = selected_objects.indexOf(last);
            if(index > -1) {
                selected_objects.splice(index, 1);
            }
            last.targeted = false;
            setTargetedForSymbolGroup(last, false);
            //when deselecting object, set lastSelectedObject to index of last object in selected_objects
            lastSelectedObject = diagram.indexOf(selected_objects[selected_objects.length-1]);
        }
    }
}

function mouseupevt(ev) {
    markedObject = diagram.indexOf(diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY));

    if(ev.button == leftMouseClick){
        canvasLeftClick = false;
    } else if (ev.button == rightMouseClick) {
        canvasRightClick = false;
    }

    delete InitPageX;
    delete InitPageY;
    // Making sure the MoveAround was not initialized by the spacebar.
    if (uimode == "MoveAround" && !keyMap.spacebarKeyPressed) {
        deactivateMovearound();
        updateGraphics();
    }

    //for checking the position of errelation before resize() overwrites values
    var p1BeforeResize;
    var p2BeforeResize;

    if (uimode == "CreateFigure" && md == mouseState.boxSelectOrCreateMode) {
        if(figureType == "Text") {
            createText(currentMouseCoordinateX, currentMouseCoordinateY);
        }

        if(figureType == "Free") {
            figureFreeDraw();
            return;
        }
    }
    // Code for creating a new class
    if (md == mouseState.boxSelectOrCreateMode && (uimode == "CreateClass" || uimode == "CreateERAttr" || uimode == "CreateEREntity" || uimode == "CreateERRelation")) {
        p1BeforeResize = {x:startMouseCoordinateX, y:startMouseCoordinateY};
        p2BeforeResize = {x:currentMouseCoordinateX, y:currentMouseCoordinateY};

        resize();

        // Add required points
        p1 = points.addPoint(startMouseCoordinateX, startMouseCoordinateY, false);
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        p3 = points.addPoint((startMouseCoordinateX + currentMouseCoordinateX) * 0.5, (startMouseCoordinateY + currentMouseCoordinateY) * 0.5, false);
    }
    var saveState = md == mouseState.boxSelectOrCreateMode && uimode != "normal";
    if (movobj > -1) {
        if (diagram[movobj].symbolkind != symbolKind.line && uimode == "Moved") saveState = true;
    }
    if (symbolStartKind != symbolKind.uml && uimode == "CreateLine" && md == mouseState.boxSelectOrCreateMode) {
        saveState = false;
        //Check if you release on canvas or try to draw a line from entity to entity
        if (markedObject == -1 || diagram[lineStartObj].symbolkind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erEntity) {
            md = mouseState.empty;
        }else {
            //Get which kind of symbol mouseupevt execute on
            symbolEndKind = diagram[markedObject].symbolkind;

            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            //Check if you not start on a line and not end on a line or so that a line isn't connected to a text object,
            // if then, set point1 and point2
            //okToMakeLine is a flag for this
            var okToMakeLine = true;
            if (symbolStartKind != symbolKind.line && symbolEndKind != symbolKind.line &&
                symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text) {
                var createNewPoint = false;
                if (diagram[lineStartObj].symbolkind == symbolKind.erAttribute) {
                    p1 = diagram[lineStartObj].centerPoint;
                }else {
                    createNewPoint = true;
                }
                //Code for making sure enitities not connect to the same attribute multiple times
                if (symbolEndKind == symbolKind.erEntity && symbolStartKind == symbolKind.erAttribute) {
                    if (diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 0) {
                        okToMakeLine= false;
                    }
                }else if (symbolEndKind == symbolKind.erAttribute && symbolStartKind == symbolKind.erEntity) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0) {
                        okToMakeLine= false;
                    }
                }else if (symbolEndKind == symbolKind.erEntity && symbolStartKind == symbolKind.erRelation) {
                    if (diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) >= 2) okToMakeLine = false;
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erEntity) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) >= 2) okToMakeLine = false;
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erAttribute) {
                    if (diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 0) okToMakeLine = false;
                }else if (symbolEndKind == symbolKind.erAttribute && symbolStartKind == symbolKind.erRelation) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0) okToMakeLine = false;
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erRelation) {
                    okToMakeLine = false;
                }else if ((symbolEndKind == symbolKind.uml && symbolStartKind != symbolKind.uml) || (symbolEndKind != symbolKind.uml && symbolStartKind == symbolKind.uml)) {
                    okToMakeLine = false;
                }
                if(diagram[lineStartObj] == diagram[markedObject]) okToMakeLine = false;

                if (okToMakeLine) {
                    saveState = true;
                    if (createNewPoint) p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    if (diagram[markedObject].symbolkind == symbolKind.erAttribute) {
                        p2 = diagram[markedObject].centerPoint;
                    }else {
                        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    }
                    diagram[lineStartObj].connectorTop.push({from:p1, to:p2});
                    diagram[markedObject].connectorTop.push({from:p2, to:p1});
                }
            }
        }
    }
    if (symbolStartKind == symbolKind.uml && uimode == "CreateLine" && md == mouseState.boxSelectOrCreateMode) {
        saveState = false;
        uimode = "CreateUMLLine";
        //Check if you release on canvas or try to draw a line from entity to entity
        if (markedObject == -1 || diagram[lineStartObj].symbolkind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erEntity) {
            md = mouseState.empty;
            uimode = "CreateLine";
        }else {
            //Get which kind of symbol mouseupevt execute on
            symbolEndKind = diagram[markedObject].symbolkind;

            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);

            //Check if you not start on a line and not end on a line or so that a line isn't connected to a text object,
            // if then, set point1 and point2
            //okToMakeLine is a flag for this
            var okToMakeLine = true;

            if (symbolEndKind != symbolKind.umlLine && symbolEndKind != symbolKind.text) {
                var createNewPoint = false;
                if (diagram[lineStartObj].symbolkind == symbolKind.erAttribute) {
                    p1 = diagram[lineStartObj].centerPoint;
                }else {
                    createNewPoint = true;
                }

                if (symbolEndKind != symbolKind.uml) {
                    okToMakeLine = false;
                }
                if (okToMakeLine) {
                    saveState = true;
                    if (createNewPoint) p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    if (diagram[markedObject].symbolkind == symbolKind.erAttribute) {
                        p2 = diagram[markedObject].centerPoint;
                    }else {
                        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    }
                    diagram[lineStartObj].connectorTop.push({from:p1, to:p2});
                    diagram[markedObject].connectorTop.push({from:p2, to:p1});
                }
            }
        }
    }

//---------------------------------------------------------------------------------------------------
// Code for creating symbols when mouse is released
// Symbol (1 UML diagram symbol 2 ER Attribute 3 ER Entity 4 Lines 5 ER Relation 6 Text 7 UML Lines)
//---------------------------------------------------------------------------------------------------

    var diagramObject;

    if (uimode == "CreateClass" && md == mouseState.boxSelectOrCreateMode) {
        var classB = new Symbol(symbolKind.uml); // UML
        classB.name = "New " + settings.serialNumbers.UML;
        classB.operations.push({text:"- makemore()"});
        classB.attributes.push({text:"+ height:Integer"});
        classB.topLeft = p1;
        classB.bottomRight = p2;
        classB.middleDivider = p3;
        classB.centerPoint = p3;
        diagram.push(classB);
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
        diagramObject = diagram[lastSelectedObject];
        settings.serialNumbers.UML++;
        //only count it as draggin when above a certain threshold
        if (diagramObject 
        && classTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
        && classTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
            diagramObject.pointsAtSamePosition = true;
        }
    } else if (uimode == "CreateERAttr" && md == mouseState.boxSelectOrCreateMode) {
        erAttributeA = new Symbol(symbolKind.erAttribute); // ER attributes
        erAttributeA.name = "Attr " + settings.serialNumbers.Attribute;
        erAttributeA.topLeft = p1;
        erAttributeA.bottomRight = p2;
        erAttributeA.centerPoint = p3;
        erAttributeA.object_type = "";
        diagram.push(erAttributeA);
        //selecting the newly created attribute and open the dialogmenu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
        diagramObject = diagram[lastSelectedObject];
        settings.serialNumbers.Attribute++;
        //only count it as draggin when above a certain threshold
        if (diagramObject 
        && attributeTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
        && attributeTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
            diagramObject.pointsAtSamePosition = true;
        }
    } else if (uimode == "CreateEREntity" && md == mouseState.boxSelectOrCreateMode) {
        erEnityA = new Symbol(symbolKind.erEntity); // ER entity
        erEnityA.name = "Entity " + settings.serialNumbers.Entity;
        erEnityA.topLeft = p1;
        erEnityA.bottomRight = p2;
        erEnityA.centerPoint = p3;
        erEnityA.arity = [];
        erEnityA.object_type = "";
        diagram.push(erEnityA);
        //selecting the newly created enitity and open the dialogmenu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
        diagramObject = diagram[lastSelectedObject];
        settings.serialNumbers.Entity++;
        //only count it as draggin when above a certain threshold
        if (diagramObject 
        && entityTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
        && entityTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y))
        {
            diagramObject.pointsAtSamePosition = true;
        }
    } else if (uimode == "CreateLine" && md == mouseState.boxSelectOrCreateMode) {
        //Code for making a line, if start and end object are different, except attributes and if no object is text
        if((symbolStartKind != symbolEndKind || (symbolStartKind == symbolKind.erAttribute && symbolEndKind == symbolKind.erAttribute)
        || symbolStartKind == symbolKind.uml && symbolEndKind == symbolKind.uml) && (symbolStartKind != symbolKind.line && symbolEndKind != symbolKind.line)
        && (symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text) && okToMakeLine) {
            erLineA = new Symbol(symbolKind.line); // Lines
            erLineA.name = "Line" + diagram.length;
            erLineA.topLeft = p1;
            erLineA.object_type = "";
            erLineA.bottomRight = p2;
            erLineA.centerPoint = p3;
            //always put lines at the bottom since they always render at the bottom, that seems to be the most logical thing to do
            diagram.unshift(erLineA);
            //selecting the newly created enitity and open the dialogmenu.
            diagram[lastSelectedObject].targeted = false;
            lastSelectedObject = 0;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);

            createCardinality();
            updateGraphics();
        }
    } else if (uimode == "CreateERRelation" && md == mouseState.boxSelectOrCreateMode) {
        erRelationA = new Symbol(symbolKind.erRelation); // ER Relation
        erRelationA.name = "Relation " + settings.serialNumbers.Relation;
        erRelationA.topLeft = p1;
        erRelationA.bottomRight = p2;
        erRelationA.centerPoint = p3;
        diagram.push(erRelationA);
        //selecting the newly created relation and open the dialog menu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
        diagramObject = diagram[lastSelectedObject];
        settings.serialNumbers.Relation++;
        //only count it as draggin when above a certain threshold
        if (diagramObject 
        && relationTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
        && relationTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y))
        {
            diagramObject.pointsAtSamePosition = true;
        }
    } else if (md == mouseState.boxSelectOrCreateMode && uimode == "normal") {
        diagram.targetItemsInsideSelectionBox(currentMouseCoordinateX, currentMouseCoordinateY, startMouseCoordinateX, startMouseCoordinateY);
        // clicking on a lock removes it
        if (currentMouseCoordinateX == startMouseCoordinateX && currentMouseCoordinateY == startMouseCoordinateY) {
            for (var i = 0; i < diagram.length; i++) {
                if (diagram[i].isLocked) {
                    setIsLockHovered(diagram[i], currentMouseCoordinateX, currentMouseCoordinateY);
                    if (diagram[i].isLockHovered) {
                        diagram[i].isLocked = false;
                        // remove locks for objects in the same group
                        if (diagram[i].group != 0) {
                            for (var j = 0; j < diagram.length; j++) {
                                if (diagram[i].group == diagram[j].group) {
                                    diagram[j].isLocked = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else if(uimode != "Moved" && !ctrlIsClicked && md != mouseState.boxSelectOrCreateMode) {
        //Unselects every object.
        for(var i = 0; i < diagram.length; i++) {
            diagram[i].targeted = false;
        }
        //Sets the clicked object as targeted
        selected_objects = [];
        if (lastSelectedObject >= 0) {
            selected_objects.push(diagram[lastSelectedObject]);
            //You have to target an object when you start to draw
            if(md != mouseState.empty) diagram[lastSelectedObject].targeted = true;
            setTargetedForSymbolGroup(diagram[lastSelectedObject], true);
        }
    } else if (uimode == "CreateUMLLine" && md == mouseState.boxSelectOrCreateMode) {
        // Code for making a line, if start and end object are different, except attributes and if no object is text
        if((symbolStartKind != symbolEndKind || (symbolStartKind == symbolKind.erAttribute && symbolEndKind == symbolKind.erAttribute)
        || symbolStartKind == symbolKind.uml && symbolEndKind == symbolKind.uml) && (symbolStartKind != symbolKind.umlLine && symbolEndKind != symbolKind.umlLine)
        && (symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text) && okToMakeLine) {
            umlLineA = new Symbol(symbolKind.umlLine); //UML Lines
            umlLineA.name = "Line" + diagram.length;
            umlLineA.topLeft = p1;
            umlLineA.object_type = "";
            umlLineA.bottomRight = p2;
            umlLineA.centerPoint = p3;
            umlLineA.isRecursiveLine = lineStartObj == markedObject;
            if (umlLineA.isRecursiveLine) {
                points[umlLineA.topLeft].x = points[umlLineA.bottomRight].x;
                points[umlLineA.topLeft].y = points[umlLineA.bottomRight].y;
            }
            diagram.push(umlLineA);
            //selecting the newly created enitity and open the dialogmenu.
            lastSelectedObject = diagram.length - 1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            uimode = "CreateLine";
            createCardinality();
            updateGraphics();
        }
    }

    //when symbol is er relation then don't assign variables since it's already done earlier when creating points
    if (diagramObject && diagramObject.symbolkind != symbolKind.erRelation) {
        p1BeforeResize.x = points[diagramObject.topLeft].x;
        p1BeforeResize.y = points[diagramObject.topLeft].y;
        p2BeforeResize.x = points[diagramObject.bottomRight].x;
        p2BeforeResize.y = points[diagramObject.bottomRight].y;
    }

    //If the object is created by just clicking and not dragging then set variable so that points
    //are moved to mouse position inside the adjust function
    if (diagramObject && p1BeforeResize.x == p2BeforeResize.x && p1BeforeResize.y == p2BeforeResize.y) {
        diagramObject.pointsAtSamePosition = true;
    }

    if(uimode == "MoveAround" && md === mouseState.boxSelectOrCreateMode) {
        saveState = false;
    }

    hashFunction();
    updateGraphics();
    diagram.updateLineRelations();
    // Clear mouse state
    md = mouseState.empty;
    if(saveState) SaveState();
}

function doubleclick() {
    if (lastSelectedObject != -1 && diagram[lastSelectedObject].targeted == true) {
        loadAppearanceForm();
    }
}

function createText(posX, posY) {
    var text = new Symbol(symbolKind.text);
    text.name = "Text " + settings.serialNumbers.Text;
    settings.serialNumbers.Text++;
    text.textLines.push({text:text.name});

    var length  = ctx.measureText(text.name).width + 20;
    var fontsize = text.getFontsize();
    var height = fontsize + 20;

    ctx.font = "bold " + fontsize + "px " + text.font;

    p1 = points.addPoint(posX - (length/2), posY - (height/2), false);
    p2 = points.addPoint(posX + (length/2), posY + (height/2), false);
    p3 = points.addPoint(posX, posY, false);

    text.topLeft = p1;
    text.bottomRight = p2;
    text.centerPoint = p3;

    diagram.push(text);
    lastSelectedObject = diagram.length -1;
    diagram[lastSelectedObject].targeted = true;
    selected_objects.push(diagram[lastSelectedObject]);
    updateGraphics();
}

//----------------------------------------------------------------------
// resize: This is used when making the objects bigger or smaller
//----------------------------------------------------------------------

function resize() {
    if ((uimode == "CreateClass" || uimode == "CreateERAttr" || uimode == "CreateEREntity" || uimode == "CreateERRelation") && md == mouseState.boxSelectOrCreateMode) {
        if (currentMouseCoordinateX < startMouseCoordinateX) {
            var tempX = currentMouseCoordinateX;
            currentMouseCoordinateX = startMouseCoordinateX;
            startMouseCoordinateX = tempX;

        }
        if (currentMouseCoordinateY < startMouseCoordinateY) {
            var tempY = currentMouseCoordinateY;
            currentMouseCoordinateY = startMouseCoordinateY;
            startMouseCoordinateY = tempY;
        }
        if(uimode == "CreateERRelation" && (currentMouseCoordinateX - startMouseCoordinateX < relationTemplate.width
            || currentMouseCoordinateY - startMouseCoordinateY < relationTemplate.height)) {
            currentMouseCoordinateX = startMouseCoordinateX + relationTemplate.width;
            currentMouseCoordinateY = startMouseCoordinateY + relationTemplate.height;
        }
    }
}

//---------------------------------------
// MOVING AROUND IN THE CANVAS
//---------------------------------------

function movemode(e, t) {
	$(".buttonsStyle").removeClass("pressed").addClass("unpressed");
    var button = document.getElementById("moveButton").className;
    var buttonStyle = document.getElementById("moveButton");
    canvas.removeEventListener("dblclick", doubleclick, false);
    if (button == "unpressed") {
        buttonStyle.style.visibility = 'visible';
		buttonStyle.className = "pressed";
        canvas.style.cursor = "all-scroll";
        uimode = "MoveAround";
    } else {
        buttonStyle.style.visibility = 'hidden';
		buttonStyle.className = "unpressed";
        canvas.addEventListener('dblclick', doubleclick, false);
        canvas.style.cursor = "default";
        uimode = "normal";
    }
}

function activateMovearound() {
    movemode();
}

function deactivateMovearound() {
    movemode();
}

//----------------------------------------------------------------------
// toggleCameraView: Enter camera view by clicking option in menu.
//----------------------------------------------------------------------

function toggleCameraView(){
    event.stopPropagation();
    if (spacebarKeyPressed) {
        spacebarKeyPressed = false;
        
    } else {
        spacebarKeyPressed = true;
    }
    updateGraphics();
    activateMovearound();
}

function toggleApperanceElement(show = false) {
    const appearanceElement = document.getElementById("appearance");
    if(show) {
        appearanceElement.style.display = "flex";
        appearanceMenuOpen = true;
        $(".loginBox").draggable();
    } else {
        appearanceElement.style.display = "none";

        if(globalappearanceMenuOpen) {
            const diagram = localStorage.getItem("diagram" + diagramNumber);
            if (diagram != null) LoadImport(diagram);
        }

        appearanceMenuOpen = false;
        classAppearanceOpen = false;
        textAppearanceOpen = false;
        globalappearanceMenuOpen = false;
        if($(".loginBox").data("ui-draggable")) {
            $(".loginBox").draggable("destroy");
        }
        hashFunction();
    }
}

//----------------------------------------------------------------------
// The following functions are used to get Global Appearance changes
//----------------------------------------------------------------------

// Return the line thickness of one of the current objects in the diagram
function getLineThickness() {
    return settings.properties.lineWidth;
}

// Returns the font color of the objects in the diagram
function getFontColor() {
    return settings.properties.fontColor;
}

// Returns the font of the objects in the diagram
function getFont() {
    return settings.properties.font;
}

// Returns the stroke color of the objects in the diagram
function getStrokeColor() {
    return settings.properties.strokeColor;
}

// Returns the fill color of the objects in the diagram
function getFillColor() {
    return settings.properties.fillColor;
}

// Returns the text size of the objects in the diagram
function getTextSize() {
    return settings.properties.sizeOftext;
}


//----------------------------------------------------------------------
// setSelectedOption: used to select an option in passed select by passed value
//----------------------------------------------------------------------

function setSelectedOption(select, value) {
    if(select !== null) {
        for(const option of select.options) {
            if(value === option.value) {
                select.value = value;
                option.selected = true;
                break;
            } else {
                option.selected = false;
            }
        }
    }
}

//---------------------------------
// Creates cardinality at the line
//---------------------------------

function createCardinality() {
    //Setting cardinality on new line
    if(diagram[lineStartObj].symbolkind == symbolKind.erRelation && diagram[markedObject].symbolkind == symbolKind.erEntity) {
        diagram[diagram.length-1].cardinality = ({"value": "", "isCorrectSide": false});
    }
    else if(diagram[lineStartObj].symbolkind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erRelation) {
        diagram[diagram.length-1].cardinality = ({"value": "", "isCorrectSide": true});
    }
    else if(diagram[lineStartObj].symbolkind == symbolKind.uml && diagram[markedObject].symbolkind == symbolKind.uml) {
        diagram[diagram.length-1].cardinality = ({"value": "", "symbolKind": 1})
    }
}

function loadGlobalAppearanceForm() {
    showFormGroups(-1);
    globalappearanceMenuOpen = true;
    toggleApperanceElement(true);
    document.getElementById("lineThicknessGlobal").value = settings.properties.lineWidth;
    setGlobalSelections();
}

function loadAppearanceForm() {
    //Should not load a form if no symbol was selected or any selected symbol is locked
    if(selected_objects.length < 1) return;
    for(let i = 0; i < selected_objects.length; i++){
        if(selected_objects[i].isLocked) return;
    }

    //Get type of previously selected symbol according to symbolKind object
    const object = selected_objects[selected_objects.length - 1];
    let type = object.symbolkind;

    //Get objects connected to uml-line and sets name in appearance menu(used for Line direction)
    var connectedObjectsArray = object.getConnectedObjects();
    if(object.symbolkind == 7){
        document.getElementById('First').innerHTML = connectedObjectsArray[0].name;
        //Selection to check if relation is to the same entity. If so: both are named from object 0
        if(typeof connectedObjectsArray[1] == "undefined"){
            document.getElementById('Second').innerHTML =  connectedObjectsArray[0].name;
        }
        else{
            document.getElementById('Second').innerHTML = connectedObjectsArray[1].name;
        }
    }

    //Undefined would mean the symbol is actually a path not having symbolKind, 0 is used as default for paths
    if(typeof type === "undefined") type = 0;

    showFormGroups(type);

    const typeElement = document.getElementById("type");
    const nameElement = document.getElementById("name");

    switch(type) {
        case symbolKind.erAttribute:
            typeElement.innerHTML = makeoptions("Normal", ["Primary key", "Partial key", "Normal", "Multivalue", "Derive"], ["Primary key", "Partial key", "Normal", "Multivalue", "Derive"]);
            nameElement.value = object.name;
            break;
        case symbolKind.erEntity:
        case symbolKind.erRelation:
            typeElement.innerHTML = makeoptions("Normal", ["Weak", "Strong"], ["Weak", "Normal"]);
            nameElement.value = object.name;
            break;
        case symbolKind.line:
            const connections = object.getConnectedObjects();
            const entities = connections.filter(symbol => symbol.symbolkind === symbolKind.erEntity);
            const relations = connections.filter(symbol => symbol.symbolkind === symbolKind.erRelation);
            typeElement.innerHTML = makeoptions("Normal", ["Normal", "Forced", "Derived"], ["Normal", "Forced", "Derived"]);
            if(entities.length > 0 && relations.length > 0) {
                document.getElementById("cardinality").innerHTML = makeoptions("", ["None", "1", "N", "M"], ["None", "1", "N", "M"]);
                document.getElementById("cardinalityUML").style.display = "none";
            } else {
                document.getElementById("cardinality").parentNode.style.display = "none";
            }
            break;
        case symbolKind.umlLine:
            const lineTypes = ["Normal", "Association", "Inheritance", "Implementation", "Dependency", "Aggregation", "Composition"];
            const cardinalities = ["None", "0..1", "1..1", "0..*", "1..*"];
            typeElement.innerHTML = makeoptions("Normal", lineTypes, lineTypes);
            document.getElementById("cardinalityUML").style.display = "block";
            document.getElementById("cardinality").innerHTML = makeoptions("None", cardinalities, cardinalities);
            document.getElementById("cardinalityUML").innerHTML = makeoptions("None", cardinalities, cardinalities);
        case symbolKind.text:
            document.getElementById("freeText").value = getTextareaText(object.textLines);
            textAppearanceOpen = true;
            break;
        case symbolKind.uml:
            nameElement.value = object.name;
            document.getElementById("umlAttributes").value = getTextareaText(object.attributes);
            document.getElementById("umlOperations").value = getTextareaText(object.operations);
            classAppearanceOpen = true;
            break;
        case 0:
            document.getElementById("figureOpacity").value = object.opacity * 100;
            break;
    }
    setSelections(object);
    toggleApperanceElement(true);
}

function showFormGroups(type) {
    const allformGroups = document.querySelectorAll("#appearanceForm .form-group");
    const formGroupsToShow = getGroupsByType(type);
    allformGroups.forEach(group => group.style.display = "none");
    formGroupsToShow.forEach(group => group.style.display = "block");
}

function getTextareaText(array) {
    let text = "";
    for (let i = 0; i < array.length; i++) {
        text += array[i].text;
        if (i < array.length - 1) {
            text += "\n";
        }
    }
    return text;
}

function setTextareaText(element, array) {
    const textLines = element.value.split('\n');
    array = [];
    textLines.forEach(text => array.push({"text": text}));
    return array;
}

function setGlobalSelections() {
    const groups = getGroupsByType(-1);
    groups.forEach(group => {
        const select = group.querySelector("select");
        if(select !== null) {
            const access = select.dataset.access.split(".");
            setSelectedOption(select, settings[access[0]][access[1]]);
        }
    });
}

function setGlobalProperties() {
    const groups = getGroupsByType(-1);
    for(let i = 0; i < diagram.length; i++) {
        const object = diagram[i];
        groups.forEach(group => {
            const element = group.querySelector("select, input:not([type='submit'])");
            if(element !== null) {
                const access = element.dataset.access.split(".");
                object[access[0]][access[1]] = element.value;
                settings[access[0]][access[1]] = element.value;
            }
        });
    }
    updateGraphics();
}

function setSelections(object) {
    let groups = [];
    if(object.kind === kind.symbol) {
        groups = getGroupsByType(object.symbolkind);
    } else if(object.kind === kind.path) {
        groups = getGroupsByType(0);
    }

    groups.forEach(group => {
        const elements = group.querySelectorAll("select, input[type='checkbox']");
        elements.forEach(element => {

        	const access = element.dataset.access.split(".");
			let value = "";
			if(element.tagName === 'SELECT'){
				if(access[0] === "cardinality") {
					if(element.style.display !== "none") {
						value = object[access[0]][access[1]];
					}
				} else if(access.length === 1) {
					value = object[access[0]];
				} else if(access.length === 2) {
					value = object[access[0]][access[1]];
				}
				setSelectedOption(element, value);
			}else{
				if (element.id == "commentCheck"){
					element.checked = object[access[0]][access[1]];
				}
			}

        });
    });
}


function setObjectProperties() {
    for(const object of selected_objects) {
        let groups = [];
        if(object.kind === kind.symbol) {
            groups = getGroupsByType(object.symbolkind);
        } else if(object.kind === kind.path) {
            groups = getGroupsByType(0);
        }
        groups.forEach(group => {
            const elements = group.querySelectorAll("input:not([type='submit']), select, textarea");
            elements.forEach(element => {
				let access = element.dataset.access.split(".");
                if(element.nodeName === "TEXTAREA") {
                    object[access[0]] = setTextareaText(element, object[access[0]]);
                } else if(element.type === "range") {
                    object[access[0]] = element.value / 100;
                } else if(access[0] === "cardinality") {
                    if(element.style.display !== "none") {
                        if(element.value === "None") element.value = "";
                        object[access[0]][access[1]] = element.value;
					}
				}else if(element.id == "commentCheck"){
					object[access[0]][access[1]] = element.checked;
				}else if(access.length === 1) {

                    object[access[0]] = element.value;
                } else if(access.length === 2) {
                    object[access[0]][access[1]] = element.value;
                }
            });
        });        
    }
    updateGraphics();
}

function initAppearanceForm() {
    const formGroups = document.querySelectorAll("#appearanceForm .form-group");
    formGroups.forEach(group => {
        const elements = group.querySelectorAll("input, select, textarea");
        elements.forEach(element => {
            if(element.id.includes("Global")) {
                if(element.tagName === "SELECT") {
                    element.addEventListener("change", setGlobalProperties);
                } else if(element.tagName === "INPUT") {
                    element.addEventListener("input", setGlobalProperties);
                }
            } else if(element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                if(element.type === "submit") {
                    element.addEventListener("click", submitAppearanceForm);
                } else {
                    element.addEventListener("input", setObjectProperties);
                }
            } else if(element.tagName === "SELECT") {
                element.addEventListener("change", setObjectProperties);
            }
        });
    });

    const appearanceContainer = document.getElementById("appearance");
    appearanceContainer.addEventListener("click", clickOutsideAppearanceForm);
}

function getGroupsByType(type) {
    const formGroups = document.querySelectorAll("#appearanceForm .form-group");
    return [...formGroups].filter(group => {
        const types = group.dataset.types.split(",");
        return types.includes(type.toString());
    });
}


//Shoud simulate button click or enter click in appearance menu to save and close
function submitAppearanceForm() {
    if(typeof diagram[lastSelectedObject] !== 'undefined'){
        diagram[lastSelectedObject].resizeUMLToMinHeight();
    }
    if(globalappearanceMenuOpen) {
        setGlobalProperties();
    } else {
        setObjectProperties();
    }
    SaveState();
    toggleApperanceElement();
}

function clickOutsideAppearanceForm(e) {
    const formContainer = document.querySelector(".loginBox");

    //Close appearance if the clicked element is not a child/grand-child of formContanier
    if(!formContainer.contains(e.target)) {
        toggleApperanceElement();
    }
}

