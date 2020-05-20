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
var colorArray = ["#000000","#496e63","#64B5F6","#81C784","#e6e6e6","#E57373","#FFF176","#FFB74D","#BA68C8","#366922"]  // Array holds colors, used for diffrent layer coloring
var valueArray = ["Layer Zero","Layer One", "Layer Two", "Layer Three", "Layer Four", "Layer Five", "Layer Six", "Layer Seven", "Layer Eight", "Layer Nine", "Layer Ten"] // Array used to store InnerHTML of each layer
var writeToLayer = getcorrectlayer();   // Function returns last active layer from localStorage, if there is no layer in localstorage Layer one is returned
var showLayer = ["Layer_1"];        // Array used to show active view layers.
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
var canvasTouchClick = false;       // Canvas touch state
var lastZoomValue = localStorage.getItem("zoomValue") || 1.00;      //Records last zoomvalue, 1.00 if none has been recorded
var zoomValue = lastZoomValue;
var md = mouseState.empty;          // Mouse state, Mode to determine action on canvas
var hoveredObject;
var markedObject = false;
var lineStartObj = -1;
var fullscreen = false;             // Used to toggle fullscreen 
var toolbarDisplayed = false;       // Show/hide toolbar in fullscreen
var isRulersActive = false;         //Show/hide rulers
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
var togglePaper = false;               // toggle if Paper outline is drawn
var togglePaperHoles = false;          // toggle if paper holes are drawn
var switchSidePaperHoles = "left";     // switching the sides of the paper-holes
var paperOrientation = "portrait";     // If virtual paper is portrait or landscape
var paperWidth;
var paperHeight;
var singlePaper = false;               // Toggle between single/repeated paper
var togglePageNumber = false;			//Toggle to show the pagenumbers
var paperSize = 4;					//toggle pappersize for canvas devider.
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
var connectLooseLineObj = {         //Contains values for use when connecting loose lines to objects
    lineIsSelected: false,
    selectedLine: null,
    looseLineP1: null,
    looseLineP2: null
};


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
const defaultF11Key = 122;
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
    f11Key :  defaultF11Key,
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
    loadKeyBinds(); 
    setModeOnRefresh(); 
    refreshVirtualPaper();
    setPaperSizeOnRefresh();
    setIsRulersActiveOnRefresh();
    setHideCommentOnRefresh();
    initAppearanceForm();
    setPaperSize(event, paperSize);
    updateGraphics(); 
}

//------------------------------------------
// Generates example diagram of passed file.
//------------------------------------------

function generateExampleCode(url) {
    $.get(url, data => LoadImport(data));
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
// deleteFreedrawObject: Checks if a point of a selected freedraw object
//                       or entire object should be removed
//--------------------------------------------------------------------
function deleteFreedrawObject() {
    let pointId = points.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY).index;
    let point = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
    
    if (typeof point.attachedSymbol != "undefined") {
        // A freedraw object needs to be selected
        if (point.attachedSymbol.figureType == "Free" && point.attachedSymbol.targeted) {
            // If a point isn't hovered, delete object
            if (point.distance > 10 / zoomValue){
                eraseObject(point.attachedSymbol);
                return;
            }
            // Freedraw objects need at least 3 points
            if (point.attachedSymbol.segments.length <= 3) {
                return;
            }
            // Remove hovered point
            else {
                removeFreedrawPoint(point.attachedSymbol, pointId);
                SaveState(); 
            }
        }
    }
}

//--------------------------------------------------------------------
// removeFreedrawPoint: Removes a point from a freedraw object and
//                      Reorganizes the segments
//--------------------------------------------------------------------
function removeFreedrawPoint(symbol , pointId) {
    let newSegment = {kind:kind.path, pa:-1, pb:-1};
    let toRemove = [];
    // Finds the segments where the point is used
    for (let i = 0; symbol.segments.length > i; i++) {
        if (symbol.segments[i].pa == pointId) {
            newSegment.pb = symbol.segments[i].pb;
            toRemove.push(i);
        }
        if (symbol.segments[i].pb == pointId) {
            newSegment.pa = symbol.segments[i].pa;
            toRemove.push(i);
        }
    }
    // Removes the segments to and from the point to remove
    symbol.segments.splice(toRemove[1], 1);
    symbol.segments.splice(toRemove[0], 1);
    // Adds new segment between the points that were connected to removed point
    symbol.segments.splice(toRemove[0], 0, newSegment);
    symbol.targeted = false;
    // Hide removed point in center
    points[pointId].x = 0;
    points[pointId].y = 0;
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
    } else if(key == keyMap.enterKey && appearanceMenuOpen) {
        if(document.activeElement.nodeName !== "TEXTAREA") {
            submitAppearanceForm();
        }
    } else if(key == keyMap.escapeKey && fullscreen) {
        toggleFullscreen();
    }
    if (appearanceMenuOpen) return;
    if ((key == keyMap.deleteKey || key == keyMap.backspaceKey)) {
        deleteFreedrawObject();
        eraseSelectedObject(event);
    }  
    //Check if enter is pressed when "focused" on an item in the dropdown menu
    if(key == keyMap.enterKey) {
        const allowedClasses = ["drop-down-item"];
        const isAllowed = allowedClasses.some(className => document.activeElement.classList.contains(className));
        if(isAllowed) {
            const onclickElement = document.activeElement.querySelector("[onclick]");
            onclickElement.click();
        }
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
            if(cloneTempArray.length !== 0) {
                SaveState();
                let temp = [];
                for(const object of cloneTempArray) {
                    if(object.kind === kind.path) {
                        temp.push(copyPath(object));
                    } else {
                        temp.push(copySymbol(object));
                    }
                }
                setConnectedLines(temp);
                cloneTempArray = temp;
                selected_objects = temp;
                updateGraphics();
                SaveState();
            }
        }
        else if (key == keyMap.zKey && ctrlIsClicked) undoDiagram(event);
        else if (key == keyMap.yKey && ctrlIsClicked) redoDiagram(event);
        else if (key == keyMap.aKey && ctrlIsClicked) {
            e.preventDefault();
            selected_objects = [];
            for (var i = 0; i < diagram.length; i++) {
                selected_objects.push(diagram[i]);
                diagram[i].targeted = true;
            }
            createRulerLinesObjectPoints();
            updateGraphics();
        } else if(key == keyMap.ctrlKey || key == keyMap.windowsKey) {
            ctrlIsClicked = true;
        } else if (key == keyMap.enterKey) {
            if (modeSwitchDialogActive) {
                // if the cancel button is focused then trigger that
                if (document.activeElement.id == "modeSwitchButtonCancel") {
                    closeModeSwitchDialog();
                } else {
                    switchMode();
                }
            }
        } else if (key == keyMap.escapeKey) {
            cancelFreeDraw();
            deselectObjects();
            if (modeSwitchDialogActive) closeModeSwitchDialog();
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
        } else if (!shiftIsClicked && key == keyMap.tKey && fullscreen){
            toggleToolbar();
        } else if (shiftIsClicked && key == keyMap.fKey) {
        document.getElementById("drawfreebutton").click();
        } else if (shiftIsClicked && key == keyMap.dKey) {
        developerMode(event);
        } else if (shiftIsClicked && key == keyMap.mKey  && !modeSwitchDialogActive) {
            if(toolbarState == currentMode.uml || toolbarState == currentMode.dev) {
                switchToolbarTo(currentMode.er);
            } else if (toolbarState == currentMode.er) {
                switchToolbarTo(currentMode.uml);
            }
        } else if (shiftIsClicked && key == keyMap.xKey) {
            lockSelected(event);
        } else if (shiftIsClicked && key == keyMap.oKey) {
            resetViewToOrigin(event);
        } else if (shiftIsClicked && key == keyMap.key4) {
            toggleVirtualPaper(event);
        } else if (shiftIsClicked && key == keyMap.f11Key) {
            toggleFullscreen();
        }
        else if (shiftIsClicked && key == keyMap.upArrow) {
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

function setConnectedLines(temp) {
    var connected = [];

    for (var y = 0; y < cloneTempArray.length; y++) {
        for (var x = 0; x < cloneTempArray.length; x++) {
            if(cloneTempArray[x].kind !== kind.path && cloneTempArray[y].kind !== kind.path) {
                if(x != y && cloneTempArray[y].getConnectedFrom().includes(cloneTempArray[x].bottomRight)) {
                    var location = cloneTempArray[y].getConnectorNameFromPoint(cloneTempArray[x].bottomRight);
                    connected.push({from:y, to:x, loc: location, lineloc: "bottomRight", lineloc2: "topLeft"});
                } else if(x != y && cloneTempArray[y].getConnectedFrom().includes(cloneTempArray[x].topLeft)) {
                    var location = cloneTempArray[y].getConnectorNameFromPoint(cloneTempArray[x].topLeft);
                    connected.push({from:y, to:x, loc: location, lineloc: "topLeft", lineloc2: "bottomRight"});   
                }
            }
        }
    }

    for(var j = 0 ; j < connected.length ; j++){
        if(temp[connected[j].from].symbolkind == symbolKind.erAttribute){
            temp[connected[j].to][connected[j].lineloc] = temp[connected[j].from].centerPoint;
        }
    }

    for(var j = 0 ; j < connected.length ; j++){
        var lineEnd1 =  temp[connected[j].to][connected[j].lineloc];
        var lineEnd2 = temp[connected[j].to][connected[j].lineloc2];
        temp[connected[j].from][connected[j].loc].push({from: lineEnd1, to: lineEnd2});
        //Fixes recursive UML-lines
        if(temp[connected[j].to].isRecursiveLine == true){
            temp[connected[j].from][connected[j].loc].push({from: lineEnd2, to: lineEnd1});
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
// copySymbol: Clone a symbol object
//----------------------------------------------------------------------
function copySymbol(symbol) {
    const clone = Object.assign(new Symbol(symbol.symbolkind), JSON.parse(JSON.stringify(symbol)));
    clone.connectorTop = [];
    clone.connectorRight = [];
    clone.connectorBottom = [];
    clone.connectorLeft = [];

    const pointIndexes = {
        topLeft: {
            old: symbol.topLeft,
        }, 
        bottomRight: {
            old: symbol.bottomRight
        }, 
        centerPoint: {
            old: symbol.centerPoint
        },
        middleDivider: {
            old: symbol.middleDivider
        }
    };

    for(const key in pointIndexes) {
        if(typeof pointIndexes[key].old !== "undefined") {

            //Get the key that contains a new point whose old point was the same as the current iterations old point
            //This is used to prevent new points from being created if multiple properties point to the same point
            const keyContainsDuplicateOldPoint = Object.keys(pointIndexes).find(key2 => {
                return (
                    key !== key2 &&
                    pointIndexes[key].old === pointIndexes[key2].old &&
                    typeof pointIndexes[key2].new !== "undefined"
                );
            });

            let newPointIndex = 0;
            if(typeof keyContainsDuplicateOldPoint === "undefined") {
                //Special case for ER lines connected to attributes
                //The second point of an er line connected to an attribute is the attribute's centerPoint
                //This code finds connected attributes that will be copied and prevents the second point from being duplicated if the attribute will also be copied
                //If the attribute will not be copied the point should be created
                if(symbol.symbolkind === symbolKind.line) {
                    const connectedAttribute = symbol.getConnectedObjects().find(object => object.symbolkind === symbolKind.erAttribute);
                    const connectedAttributes = symbol.getConnectedObjects().filter(object => object.symbolkind === symbolKind.erAttribute);
                    if(typeof connectedAttribute !== "undefined") {
                        const isAttributeSelected = cloneTempArray.some(object => Object.is(connectedAttribute, object));
                        //If one of the connected objects is a attribute, create no second point
                        if(isAttributeSelected && connectedAttribute.connectorTop.find(object => object.from === symbol[key])) {
                            newPointIndex = null;
                        }
                        //If both connected objects are attributes, create no points
                        else if(connectedAttributes.length > 1 && symbol.getConnectedObjects()[0].symbolkind == symbolKind.erAttribute && symbol.getConnectedObjects()[1].symbolkind == symbolKind.erAttribute){
                            //Both attributes must be selected
                            if(selected_objects.includes(connectedAttributes[0]) && selected_objects.includes(connectedAttributes[1])){
                                newPointIndex = null;
                            }
                        }
                    }
                }
                if(newPointIndex !== null) {
                    const point = points[pointIndexes[key].old];
                    newPointIndex = points.addPoint(point.x + 50, point.y + 50, point.isSelected);
                }
            } else {
                newPointIndex = pointIndexes[keyContainsDuplicateOldPoint].new;
            }
            clone[key] = newPointIndex
            pointIndexes[key].new = newPointIndex;
        }
    }

    symbol.targeted = false;
    clone.targeted = true;
    clone.setID(globalObjectID - 1);

    diagram.push(clone);

    return clone;
}

//----------------------------------------------------------------------
// copyPath: Clone a path object
//----------------------------------------------------------------------
function copyPath(path) {
    const clone = Object.assign(new Path, JSON.parse(JSON.stringify(path)));

    const oldPointIndexes = clone.getPoints();

    const pointIndexes = oldPointIndexes.reduce((result, pointIndex) => {
        const point = points[pointIndex];
        const newPointIndex = points.addPoint(point.x + 50, point.y + 50, point.isSelected);

        result.push({
            old: pointIndex,
            new: newPointIndex
        });

        return result
    }, []);

    for(const segment of clone.segments) {
        for(const pointIndex of pointIndexes) {
            if(segment.pa === pointIndex.old) {
                segment.pa = pointIndex.new;
            }
            if(segment.pb === pointIndex.old) {
                segment.pb = pointIndex.new;
            }
        }
    }

    clone.targeted = true;
    path.targeted = false;

    clone.calculateBoundingBox();

    diagram.push(clone);

    return clone;
}

//--------------------------------------------------------------------
// markLastMouseCoordinates: Draws a cross at last mousecoordinates
//--------------------------------------------------------------------
function markLastMouseCoordinates() {
    let crossSize = 4 * zoomValue;
    ctx.save();
    ctx.strokeStyle = "#f64";
    ctx.lineWidth = 2 * zoomValue;
    ctx.beginPath();
    ctx.moveTo(pixelsToCanvas(currentMouseCoordinateX).x - crossSize, pixelsToCanvas(0,currentMouseCoordinateY).y - crossSize);
    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x + crossSize, pixelsToCanvas(0,currentMouseCoordinateY).y + crossSize);
    ctx.moveTo(pixelsToCanvas(currentMouseCoordinateX).x + crossSize, pixelsToCanvas(0,currentMouseCoordinateY).y - crossSize);
    ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x - crossSize, pixelsToCanvas(0,currentMouseCoordinateY).y + crossSize);
    ctx.stroke();
    ctx.restore();
}

//--------------------------------------------------------------------
// drawCross: Draws a cross at point position
//--------------------------------------------------------------------
function drawCross(point) {
    let checkForLayer = false;
    let crossSize = 4 * zoomValue;
    for(let i = 0; i < diagram.length; i++){
        if(diagram[i].isLayerLocked == false && diagram[i].symbolkind != 4 && diagram[i].symbolkind != 7){
            if(Math.round(point.x) == Math.round(points[diagram[i].topLeft].x)){
                checkForLayer = true
            }
            else if (Math.round(point.x) == Math.round(points[diagram[i].centerPoint].x)){
                checkForLayer = true
            }
            
            else if (Math.round(point.x) == Math.round(points[diagram[i].bottomRight].x)){
                checkForLayer = true
            }
        }
    }
    if(checkForLayer == true){
        ctx.beginPath();
        ctx.moveTo(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y - crossSize);
        ctx.lineTo(pixelsToCanvas(point.x).x + crossSize, pixelsToCanvas(0, point.y).y + crossSize);
        ctx.moveTo(pixelsToCanvas(point.x).x + crossSize, pixelsToCanvas(0, point.y).y - crossSize);
        ctx.lineTo(pixelsToCanvas(point.x).x - crossSize, pixelsToCanvas(0, point.y).y + crossSize);
        ctx.stroke();
    }
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
        if (!point.isSelected && !point=="") {
            drawCross(point);
        } else if(!point==""){
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

    //Used for moving UML middledivider
    this.filter(symbol => symbol.symbolkind == symbolKind.uml).forEach(symbol => {
            var deltaX = mx - points[symbol.middleDivider].x;
            var deltaY = my - points[symbol.middleDivider].y;
            var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
            if (hypotenuseElevatedBy2 < distance) {
                distance = hypotenuseElevatedBy2;
                point = points[symbol.middleDivider];
                attachedSymbol = symbol;
            }
        
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

//-----------------------------------------------------------------------------------------------------
// getObjectsByType: Returns an array of all diagram objects with the passed symbolKind. (0 for paths).
//-----------------------------------------------------------------------------------------------------

diagram.getObjectsByType = function(type = 0) {
    return diagram.filter(object => (object.symbolkind || 0) === type);
}

//-------------------------------------------------------------------------------------------------------------------
// getObjectsByTypes: Returns an array of all diagram objects included in passed array of symbolKinds. (0 for paths).
//-------------------------------------------------------------------------------------------------------------------

diagram.getObjectsByTypes = function(types = []) {
    return diagram.filter(object => types.includes(object.symbolkind || 0));
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
    // check localStorage for active layers
    if(localStorage.getItem('layerItems') != null){
        loadLayer(localStorage.getItem('layerItems'));
    }
    //hashes the current diagram, and then compare if it have been change to see if it needs to be saved.
    setInterval(refreshFunction, refreshTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashFunction, hashUpdateTimer + 500);

    const diagramContainer = document.getElementById("diagram-canvas-container");
    const moveButton = document.getElementById("moveButton");
    const zoomTextElement = document.getElementById("zoomV");
    const zoomRange = document.getElementById("ZoomSelect");


    canvas = document.getElementById("diagram-canvas");
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
    canvas.addEventListener('touchmove', touchMoveEvent, false);
    canvas.addEventListener('touchstart', touchStartEvent, false);
    canvas.addEventListener('touchend', touchEndEvent, false);
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
    document.activeElement.className.match("drop-down-item") ||
    document.activeElement.className.match("drop-down-label")) {
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
// Toggles the virtual paper On or Off
//-----------------------------------------------------------------------

function toggleVirtualPaper(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    if (togglePaper) {
        // Paper is disabled
        togglePaper = false;

        $("#Paper-holes-item").addClass("drop-down-item drop-down-item-disabled");
        $("#Paper-orientation-item").addClass("drop-down-item drop-down-item-disabled");
        $("#Paper-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
		$("#Paper-single-item").addClass("drop-down-item drop-down-item-disabled");
		$("#Paper-pagenumber-item").addClass("drop-down-item drop-down-item-disabled");
        hidePaperState();
        updateGraphics();
    } else {
        togglePaper = true;
        $("#Paper-holes-item").removeClass("drop-down-item drop-down-item-disabled");
        $("#Paper-orientation-item").removeClass("drop-down-item drop-down-item-disabled");
		$("#Paper-single-item").removeClass("drop-down-item drop-down-item-disabled");
		$("#Paper-pagenumber-item").removeClass("drop-down-item drop-down-item-disabled");
        if (togglePaperHoles) {
            $("#Paper-holes-item-right").removeClass("drop-down-item drop-down-item-disabled");
        } else {
            $("#Paper-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
        }
        showPaperState();
        updateGraphics();
    }
    localStorage.setItem("virtualPaper", togglePaper);
    setCheckbox($(".drop-down-option:contains('Display Virtual Paper')"), togglePaper);
}

function refreshVirtualPaper() {
    var tempPaperState = localStorage.getItem("virtualPaper");
    if (tempPaperState != null) {
        togglePaper = tempPaperState;
        if (togglePaper == 'true') {
            togglePaper = false;
            toggleVirtualPaper(event);
        } else {
            togglePaper = true;
            toggleVirtualPaper(event);
        }
    }
}

//--------------------------------------------------------------------
// Draws virtual Paper on canvas
//--------------------------------------------------------------------

function drawVirtualPaper() {
	
    // Origo
    let zeroX = pixelsToCanvas().x;
    let zeroY = pixelsToCanvas().y;

    // the correct according to 96dpi size, of Paper milimeters to pixels
	const pixelsPerMillimeter = 3.781 * zoomValue;
	let papersizes = [
		[841,1189],
		[594,841],
		[420,594],
		[297,420],
		[210,297],
		[148,210],
		[105,148]
	];
    paperWidth = papersizes[paperSize][0] * pixelsPerMillimeter;
    paperHeight = papersizes[paperSize][1] * pixelsPerMillimeter;
    // size of Paper hole, from specification ISO 838 and the swedish "triohålning"
    const leftHoleOffsetX = 12 * pixelsPerMillimeter;
    const rightHoleOffsetX = (papersizes[paperSize][0] - 12) * pixelsPerMillimeter;
    const holeRadius = 3 * pixelsPerMillimeter;
    
    // Number of paper sheets to draw out
    var paperRows;
    var paperColumns;
	if(!togglePaper) {
		return
	}
    if(!singlePaper){
        if (paperOrientation == "portrait") {
            paperRows = 6;
            paperColumns = 12;
        } else if(paperOrientation == "landscape") {
          paperRows = 10;
          paperColumns = 8;
        }
    } else {
      	paperRows = 1;
		paperColumns = 1;
    }

	ctx.save();
	
    ctx.strokeStyle = "black"
    ctx.setLineDash([10 * (pixelsPerMillimeter / 3)]);
	let sizePageNr = 3.1737*pixelsPerMillimeter; // now about 12 px
	ctx.fontColor = "black";
	ctx.font=`${sizePageNr}px Arial`;
	let pages = 1; 
	if(paperOrientation == "portrait") {// Draw Paper sheets in portrait mode
		if(singlePaper){
			ctx.strokeRect(zeroX, zeroY, paperWidth, paperHeight);
			if(togglePageNumber){
				ctx.fillText("Page 1",  zeroX + (paperWidth - 30 * pixelsPerMillimeter),zeroY + (paperHeight - 5 * pixelsPerMillimeter) ); // if only one paper are pressent ther will only be that nr one page
			}
		}else{
			for (let i = 0; i < paperRows; i++) {
				for (let j = 0; j < paperColumns; j++) {
					ctx.strokeRect(zeroX - paperWidth * (j+1), zeroY - paperHeight * (i+1), paperWidth, paperHeight);   // Top left from origin	
					ctx.strokeRect(zeroX + paperWidth * j, zeroY - paperHeight * (i+1), paperWidth, paperHeight);       // Top right from origin
					ctx.strokeRect(zeroX - paperWidth * (j+1), zeroY + paperHeight * i, paperWidth, paperHeight);       // Bottom left from origin
					ctx.strokeRect(zeroX + paperWidth * j, zeroY + paperHeight * i, paperWidth, paperHeight);               // Bottom right from origin	
				}	
			}	
			if(togglePageNumber){//This goes row by row from the top to the bottom of the canvas and checks for objects on the pages so the top left most object will be on page 1 and bottom right most object will be on the higest number page.
				for (var i = 0; i < paperRows; i++) {
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX - paperWidth * (paperColumns - j), zeroY - paperHeight * (paperRows - i), zeroX - paperWidth *(paperColumns - j-1), zeroY - paperHeight *(paperRows - i-1))){
							ctx.fillText("Page " + pages, zeroX - 30 * pixelsPerMillimeter - paperWidth * (paperColumns - j-1),zeroY + (paperHeight - 5 * pixelsPerMillimeter) -  paperHeight * (paperRows - i)); //pagenumbers for the top left
							pages++;
						}
					}
					for (var j = 0; j < paperColumns; j++) {
					//"Page " +( (paperColumns - j ) + (paperRows - i -1)*dubbleColumns)
						if(objectInArea(zeroX + paperWidth * j, zeroY - paperHeight * (paperRows - i), zeroX + paperWidth * (j+1), zeroY - paperHeight * (paperRows -i-1))){
							ctx.fillText("Page " + pages,zeroX + (paperWidth - 30 * pixelsPerMillimeter) + paperWidth * j,zeroY + (paperHeight - 5 * pixelsPerMillimeter) -  paperHeight * (paperRows - i)); //pagenumbers for the top right
							pages++;
						}
					}
				}
				for (var i = 0; i < paperRows; i++) {
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX - paperWidth * (paperColumns -j), zeroY + paperHeight * i, zeroX - paperWidth * (paperColumns - j-1), zeroY + paperHeight * (i+1))){
							ctx.fillText("Page " + pages, zeroX -  30 * pixelsPerMillimeter - paperWidth * (paperColumns -j-1),zeroY + (paperHeight - 5 * pixelsPerMillimeter) +  paperHeight * i); //pagenumbers for the bottom left
							pages++;
						}
					}	
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX + paperWidth * j, zeroY + paperHeight * i, zeroX + paperWidth * (j+1), zeroY + paperHeight * (i+1))){
							ctx.fillText("Page " + pages,  zeroX + (paperWidth - 30 * pixelsPerMillimeter) + paperWidth * j,zeroY + (paperHeight - 5 * pixelsPerMillimeter) +  paperHeight * i); //pagenumbers for the bottom right
							pages++;
						}
					}
				}		
			}	
		}
	} else if(paperOrientation == "landscape") {   // Draw Paper sheets in landscape mode
		if(singlePaper){
			ctx.strokeRect(zeroX, zeroY, paperHeight, paperWidth);               // Bottom right
			ctx.fillText("Page 1" , zeroX + (paperHeight - 30 * pixelsPerMillimeter), zeroY + (paperWidth - 5 * pixelsPerMillimeter));
		}else{
			for (var i = 0; i < paperRows; i++) {
				for (var j = 0; j < paperColumns; j++) {
					ctx.strokeRect(zeroX - paperHeight * (j+1), zeroY - paperWidth * (i+1), paperHeight, paperWidth);   // Top left from origin
					ctx.strokeRect(zeroX + paperHeight * j, zeroY - paperWidth * (i+1), paperHeight, paperWidth);       // Top right from origin
					ctx.strokeRect(zeroX - paperHeight * (j+1), zeroY + paperWidth * i, paperHeight, paperWidth);       // Bottom left from origin
					ctx.strokeRect(zeroX + paperHeight * j, zeroY + paperWidth * i, paperHeight, paperWidth);               // Bottom right from origin
				}
			}
			if(togglePageNumber){//This goes row by row from the top to the bottom of the canvas and checks for objects on the pages so the top left most object will be on page 1 and bottom right most object will be on the higest number page.
				for (var i = 0; i < paperRows; i++) {
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX - paperHeight * (paperColumns - j), zeroY - paperWidth * (paperRows - i), zeroX - paperHeight *(paperColumns - j-1), zeroY - paperWidth *(paperRows - i-1))){
							ctx.fillText("Page " + pages, zeroX - 30 * pixelsPerMillimeter - paperHeight * (paperColumns - j-1),zeroY + (paperWidth - 5 * pixelsPerMillimeter) -  paperWidth * (paperRows - i)); //pagenumbers for the top left
							pages++;
						}
					}
					for (var j = 0; j < paperColumns; j++) {
					//"Page " +( (paperColumns - j ) + (paperRows - i -1)*dubbleColumns)
						if(objectInArea(zeroX + paperHeight * j, zeroY - paperWidth * (paperRows - i), zeroX + paperHeight * (j+1), zeroY - paperWidth * (paperRows -i-1))){
							ctx.fillText("Page " + pages,zeroX + (paperHeight - 30 * pixelsPerMillimeter) + paperHeight * j,zeroY + (paperWidth - 5 * pixelsPerMillimeter) -  paperWidth * (paperRows - i)); //pagenumbers for the top right
							pages++;
						}
					}
				}
				for (var i = 0; i < paperRows; i++) {
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX - paperHeight * (paperColumns -j), zeroY + paperWidth * i, zeroX - paperHeight * (paperColumns - j-1), zeroY + paperWidth * (i+1))){
							ctx.fillText("Page " + pages, zeroX -  30 * pixelsPerMillimeter - paperHeight * (paperColumns -j-1),zeroY + (paperWidth - 5 * pixelsPerMillimeter) +  paperWidth * i); //pagenumbers for the bottom left
							pages++;
						}
					}	
					for (var j = 0; j < paperColumns; j++) {
						if(objectInArea(zeroX + paperHeight * j, zeroY + paperWidth * i, zeroX + paperHeight * (j+1), zeroY + paperWidth * (i+1))){
							ctx.fillText("Page " + pages,  zeroX + (paperHeight - 30 * pixelsPerMillimeter) + paperHeight * j,zeroY + (paperWidth - 5 * pixelsPerMillimeter) +  paperWidth * i); //pagenumbers for the bottom right
							pages++;
						}
					}
				}		
			}
		}  
    }

    // Draw Paper holes
    if(togglePaperHoles) {
        if(paperOrientation == "portrait") {
            if (switchSidePaperHoles == "left") {// The Holes on the left side.
				if(singlePaper){
					drawCircle(leftHoleOffsetX + zeroX, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(leftHoleOffsetX + zeroX, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(leftHoleOffsetX + zeroX, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(leftHoleOffsetX + zeroX, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY, holeRadius);
				}else{
					for (var i = 0; i < paperRows; i++) {
						for (var j = 0; j < paperColumns; j++) {
							// Bottom right quadrant
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							// Bottom left quadrant
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							// Top left quadrant
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							// Top right quadrant
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(leftHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							
						}
					}
				}
            } else {// The holes on the right side.
				if(singlePaper){
					drawCircle(rightHoleOffsetX + zeroX, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(rightHoleOffsetX + zeroX, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(rightHoleOffsetX + zeroX, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY, holeRadius);
					drawCircle(rightHoleOffsetX + zeroX, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY, holeRadius);
				}else{
					for (var i = 0; i < paperRows; i++) {
						for (var j = 0; j < paperColumns; j++) {
							// Bottom right quadrant
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							// Bottom left quadrant
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY + paperHeight * i, holeRadius);
							// Top left quadrant
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX - paperWidth * (j+1), ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							// Top right quadrant
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
							drawCircle(rightHoleOffsetX + zeroX + paperWidth * j, ((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroY - paperHeight * (i+1), holeRadius);
						}
					}
				}
            }
        } else if(paperOrientation == "landscape") {
            if (switchSidePaperHoles == "left") {// The holes on the upper side.
                if(singlePaper){
					drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX, leftHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX, leftHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX, leftHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX, leftHoleOffsetX + zeroY, holeRadius);
				}else{
					for (var i = 0; i < paperRows; i++) {
						for (var j = 0; j < paperColumns; j++) {
							// Bottom right
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							// Bottom left
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							// Top left
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							// Top right
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, leftHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius); 				
						}
					}
                }
            }else { // The holes on the bottom side.
                if(singlePaper){
					drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX, rightHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX, rightHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX, rightHoleOffsetX + zeroY, holeRadius);
					drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX, rightHoleOffsetX + zeroY, holeRadius);
				} else {
					for (var i = 0; i < paperRows; i++) {
						for (var j = 0; j < paperColumns; j++) {
							// Bottom right
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
						
							// Bottom left
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY + paperWidth * i, holeRadius);
							// Top left
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX - paperHeight * (j+1), rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							// Top right
							drawCircle(((paperHeight / 2) - (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) - 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + (34+21) * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							drawCircle(((paperHeight / 2) + 34 * pixelsPerMillimeter) + zeroX + paperHeight * j, rightHoleOffsetX + zeroY - paperWidth * (i+1), holeRadius);
							
						}
					}
				}
            }
        }
	}
	
    ctx.restore();
}
//------------------------------------------------------------------
//Checks if an object are in the specified area
//------------------------------------------------------------------
function objectInArea(x1, y1, x2, y2){
	for(i = 0; i < diagram.length; i++){
			let pointcenter = {
				x: 0,
				y: 0,
			}
			let pointTopLeft = pixelsToCanvas(points[diagram[i].topLeft].x, points[diagram[i].topLeft].y);
			let pointBottomRigth = pixelsToCanvas(points[diagram[i].bottomRight].x, points[diagram[i].bottomRight].y);

			pointcenter.x = (pointTopLeft.x + pointBottomRigth.x) / 2;
			pointcenter.y = (pointTopLeft.y + pointBottomRigth.y) / 2;
			if(x1 < pointcenter.x && pointcenter.x < x2 && y1 < pointcenter.y && pointcenter.y < y2) return true
		
	}	
	return false;
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
// Enables and shows the children menus for virtual Paper
//-----------------------------------------------------

function showPaperState() {
    // Sets icons based on the state of the Paper
    setCheckbox($(".drop-down-option:contains('Toggle Paper Holes')"), togglePaperHoles=false);
    setOrientationIcon($(".drop-down-option:contains('Toggle Paper Orientation')"), true);
    switchSidePaperHoles = "left";
    setCheckbox($(".drop-down-option:contains('Paper Holes Right')"), switchSidePaperHoles == "right");

    // Show Paper options
    $("#Paper-orientation-item").removeClass("drop-down-item drop-down-item-disabled");
    $("#Paper-holes-item").removeClass("drop-down-item drop-down-item-disabled");
    $("#Paper-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
}

//-----------------------------------------------------
// Disables and hides the children menus for virtual Paper
//-----------------------------------------------------

function hidePaperState() {
    // Reset the variables after disable the Paper
    togglePaperHoles = false;
	switchSidePaperHoles = "left";
	togglePageNumber = false;

    // Hides icons when toggling off the Paper
    setOrientationIcon($(".drop-down-option:contains('Toggle Paper Orientation')"), false);
    setCheckbox($(".drop-down-option:contains('Toggle Paper Holes')"), togglePaperHoles);
    setCheckbox($(".drop-down-option:contains('Paper Holes Right')"), switchSidePaperHoles == "right");
	setCheckbox($(".drop-down-option:contains('Display Virtual Paper')"), togglePaper);
	setCheckbox($(".drop-down-option:contains('Toggle Pagenumbers')"), togglePageNumber);

    // Grey out disabled options
    $("#Paper-orientation-item").addClass("drop-down-item drop-down-item-disabled");
    $("#Paper-holes-item").addClass("drop-down-item drop-down-item-disabled");
    $("#Paper-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
}

//---------------------------------
// Toggles holes on the virtual Paper
//---------------------------------

function toggleVirtualPaperHoles(event) {
    event.stopPropagation();
    // Toggle Paper holes to the Paper-paper.
    if (togglePaper && togglePaperHoles) {
        togglePaperHoles = false;
        setCheckbox($(".drop-down-option:contains('Toggle Paper Holes')"), togglePaperHoles);
        $("#Paper-holes-item-right").addClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Display Virtual Paper')"), togglePaper);

        switchSidePaperHoles = "left"; // Disable the 'Paper Holes Right' option
        setCheckbox($(".drop-down-option:contains('Paper Holes Right')"), switchSidePaperHoles == "right");
        updateGraphics();
    } else if (togglePaper) {
        togglePaperHoles = true;
        setCheckbox($(".drop-down-option:contains('Toggle Paper Holes')"), togglePaperHoles);
        $("#Paper-holes-item-right").removeClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Display Virtual Paper')"), togglePaper);
        updateGraphics();
    }
}

//-------------------------------------------------------------
// Moves the holes on virtual A to the opposite side of the Paper
//-------------------------------------------------------------

function toggleVirtualPaperHolesRight(event) {
    event.stopPropagation();
    // Switch Paper holes from left to right of the Paper-paper.
    if (switchSidePaperHoles == "right" && togglePaper) {
        switchSidePaperHoles = "left";
        setCheckbox($(".drop-down-option:contains('Paper Holes Right')"), switchSidePaperHoles == "right");
        updateGraphics();
    } else if (togglePaper && togglePaperHoles) {
        switchSidePaperHoles = "right";
        setCheckbox($(".drop-down-option:contains('Paper Holes Right')"), switchSidePaperHoles == "right");
        updateGraphics();
    }
}

//-------------------------------------------------------------
// Toggle if pagenumber are visable or not 
//-------------------------------------------------------------

function togglePagenumbers(event) {
    event.stopPropagation();
    
    if (togglePageNumber && togglePaper) {
        togglePageNumber = false;
        setCheckbox($(".drop-down-option:contains('Toggle Pagenumbers')"), togglePageNumber);
        updateGraphics();
    } else if (togglePageNumber === false && togglePaper) {
        togglePageNumber = true;
        setCheckbox($(".drop-down-option:contains('Toggle Pagenumbers')"), togglePageNumber);
        updateGraphics();
    }
}

//---------------------------------------------------------------
// Changes orientation of the virtual Paper (Landscape or portrait)
//---------------------------------------------------------------

function togglePaperOrientation(event) {
    event.stopPropagation();
    if (paperOrientation == "portrait" && togglePaper) {
        paperOrientation = "landscape";
        setOrientationIcon($(".drop-down-option:contains('Toggle Paper Orientation')"), true);
    } else if (paperOrientation == "landscape" && togglePaper) {
        paperOrientation = "portrait";
        setOrientationIcon($(".drop-down-option:contains('Toggle Paper Orientation')"), true);
    }
    updateGraphics();
}

//---------------------------------------------------------------
// Changes between single and repeated virtual Paper view
//---------------------------------------------------------------

function togglesinglePaper(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    // Switch between single and repeated
    if (singlePaper) {
        singlePaper = false;
        setCheckbox($(".drop-down-option:contains('Single Paper')"), singlePaper);
    } else {
        singlePaper = true;
        setCheckbox($(".drop-down-option:contains('Single Paper')"), singlePaper);
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
    localStorage.setItem("hideComment", hideComment);
}

//---------------------------------------------------------------
// Stores if the comments are hidden or not in localStorage
//---------------------------------------------------------------

function setHideCommentOnRefresh() {
    const tempHideComment = localStorage.getItem("hideComment");
    if (tempHideComment != null) {
        if (tempHideComment == 'true') {
            hideComment = false;
        } else {
            hideComment = true;
        }
    toggleComments(event);
  }
}
//--------------------------------------------
//Sets the size of the paper on the canvas
//--------------------------------------------

function setPaperSize(event, size){
	
	event.stopPropagation();
	let selectedPaper = [
		false, 
		false,
		false,
		false,
		false,
		false,
		false,
		false
	]
	selectedPaper[size] = true;
	for (i = 0; i < 7; i++){
        let name = 'A' + i;
        setCheckbox($(`.drop-down-option:contains('Paper size...') + .side-drop-down .drop-down-option:contains(${name})`), selectedPaper[i]);
	}
	paperSize = size; 
	localStorage.setItem("paperSize", paperSize);
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
    saveKeyBinds();
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
    var diagramContainer = document.getElementById("diagram-canvas-container");
    canvas.width = diagramContainer.offsetWidth;
    canvas.height = diagramContainer.offsetHeight;
    boundingRect = canvas.getBoundingClientRect();
    createRulers();
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
    if(developerModeActive) drawOrigo();

    // Mark the last freedraw point on mobiles
    if (uimode == "CreateFigure" && figureType == "Free" && isMobile) {
        markLastMouseCoordinates(); 
    }
    diagram.sortConnectors();
    diagram.updateQuadrants();
    diagram.draw();
    points.drawPoints();
    drawVirtualPaper();
    if(developerModeActive) drawCrosshair();
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
//---------------------------------------------------------------------------------
// resetShortcuts: resets the keybinds to the initial values
//---------------------------------------------------------------------------------

function resetShortcuts(event){
    event.stopPropagation();
    //Reset binds to default keycodes
    keyMap.backspaceKey = defaultBackspaceKey,
    keyMap.enterKey = defaultEnterKey,
    keyMap.shiftKey = defaultShiftKey,
    keyMap.ctrlKey = defaultCtrlKey,
    keyMap.altKey = defaultAltKey,
    keyMap.escapeKey = defaultEscapeKey,
    keyMap.spacebarKey = defaultSpacebarKey,
    keyMap.leftArrow = defaultLeftArrow,
    keyMap.upArrow = defaultUpArrow,
    keyMap.rightArrow = defaultRightArrow,
    keyMap.downArrow = defaultDownArrow,
    keyMap.deleteKey = defaultDeleteKey,
    keyMap.key0 = defaultKey0,
    keyMap.key1 = defaultKey1,
    keyMap.key2 = defaultKey2,
    keyMap.key4 = defaultKey4,
    keyMap.aKey = defaultAKey,
    keyMap.cKey = defaultCKey,
    keyMap.dKey = defaultDKey,
    keyMap.eKey = defaultEKey,
    keyMap.fKey = defaultFKey,
    keyMap.lKey = defaultLKey,
    keyMap.mKey = defaultMKey,
    keyMap.nKey = defaultNKey,
    keyMap.oKey = defaultOKey,
    keyMap.rKey = defaultRKey,
    keyMap.tKey = defaultTKey,
    keyMap.vKey = defaultVKey,
    keyMap.zKey = defaultZKey,
    keyMap.yKey = defaultYKey,
    keyMap.xKey = defaultXKey,
    keyMap.windowsKey = defaultWindowsKey,
    keyMap.num1 = defaultNum1,
    keyMap.num2 = defaultNum2,
    keyMap.lessThanKey = defaultLessThanKey,
    keyMap.f11Key = defaultF11Key,
    //redraw the keyMap to the html element
    drawKeyMap(keyMap, $("#shortcuts-wrap").get(0) );
    updateGraphics();
}

//-------------------------------------------------------------------------------------------------------
// eraseLine: Erases passed line from diagram. Makes sure line points are no longer in object connectors.
//-------------------------------------------------------------------------------------------------------

function eraseLine(line) {
    const connectedObjects = line.getConnectedObjects();

    connectedObjects.forEach(symbol => {
        if(symbol.symbolkind == symbolKind.erAttribute){
            symbol.removePointFromConnector(symbol.centerPoint, line);
        } else{
            symbol.removePointFromConnector(line.topLeft);
            symbol.removePointFromConnector(line.bottomRight);
        }
    });

    // Check if the line has a common point with a center point of attributes or relations.
    const removeTopLeft = !connectedObjects.some(symbol => symbol.centerPoint === line.topLeft || symbol.middleDivider === line.topLeft);
    const removeBottomRight = !connectedObjects.some(symbol => symbol.centerPoint === line.bottomRight || symbol.middleDivider === line.bottomRight);

    if(removeTopLeft) points[line.topLeft] = "";
    if(removeBottomRight) points[line.bottomRight] = "";

    diagram.deleteObject(line);
}

//------------------------------------------------
// eraseObject: Erases passed object from diagram.
//------------------------------------------------

function eraseObject(object) {
    if (object.kind === kind.symbol) {
        if(object.isLineType()) {
            eraseLine(object);
        } else {
            object.getConnectedLines().forEach(eraseObject);
        }
    }
    object.erase();
    diagram.deleteObject(object);
    updateGraphics();
}

//---------------------------------------------------
// Calls the erase function for all selected objects
// Ends up with erasing all selected objects
//---------------------------------------------------

function eraseSelectedObject(event) {
    event.stopPropagation();
    var objectDeleted = false;
    for(var i = 0; i < selected_objects.length; i++) {
        if (selected_objects[i].figureType != "Free" || 
        (selected_objects[i].figureType == "Free" && selected_objects.length > 1)) {
            eraseObject(selected_objects[i]);
            objectDeleted = true;
        }
        if (selected_objects.length <= 1 && selected_objects[0].figureType == "Free") {
            deleteFreedrawObject();
            objectDeleted = true;
        }
    }
    if(objectDeleted){
        SaveState();
    }
    selected_objects = [];
    lastSelectedObject = -1;
    createRulerLinesObjectPoints();
    updateGraphics();
}

//------------------------------------------------------
// Sets the uimode variable depending on choice of tool
//------------------------------------------------------

function setMode(mode) {
    cancelFreeDraw();
    uimode = mode;
    figureType = null;
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
            $(".diagram-tools-button-big").removeClass("pressed").addClass("unpressed");
            uimode = "normal";
        } else {
            $(".diagram-tools-button-big").removeClass("pressed").addClass("unpressed");
            $(this).removeClass("unpressed").addClass("pressed");
        }
    });
});

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

//------------------------------------------------------------------------------
// developerMode: Toggles in and out from developer mode
//------------------------------------------------------------------------------

var previousToolbarState = currentMode.er;
var developerModeActive = false;                 // used to repressent a switch for whenever the developerMode is enabled or not.
function developerMode(event) {
    event.stopPropagation();                    // This line stops the collapse of the menu when it's clicked
    developerModeActive = !developerModeActive;
    resetToolButtonsPressed();
    
    if (developerModeActive == true) {
        targetMode = currentMode.dev;
        // Enable developer features (crosses/origo)
        showCrosses();
        drawOrigo();
    } else {
        // Revert to previous state and hide developer features
        toolbarState = previousToolbarState;
        hideCrosses();
    }

    reWrite();
    updateGraphics();
}

//------------------------------------------------------------------------------
// setModeOnRefresh: Sets toolbar mode when refreshing page. 
// If none is saved in localstorage, default is ER
//------------------------------------------------------------------------------

function setModeOnRefresh() {
    const tempToolbarState = localStorage.getItem("toolbarState");
    const tempDevmodeState = localStorage.getItem("developerState");
    
    if(tempToolbarState != null) {
        targetMode = tempToolbarState;
        
    } else {
        targetMode = currentMode.er;
    }

    developerModeActive = (tempDevmodeState == "true"); // Converts from string to boolean
    switchMode();
}

function setPaperSizeOnRefresh() {
	const tempPaperSize = localStorage.getItem("paperSize");
	if(tempPaperSize != null){
        paperSize = tempPaperSize;
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
        let activeLayer = '<b> Layer: </b>' +getCorrectValueArray();
        if (typeof hoveredObject !== "undefined" && hoveredObject.symbolkind != symbolKind.umlLine && hoveredObject.symbolkind != symbolKind.line && hoveredObject.figureType != "Free") {
            coordinatesText += `<p><b>Object center:</b> (${Math.round(points[hoveredObject.centerPoint].x)}, ${Math.round(points[hoveredObject.centerPoint].y)})</p>`;
        }
        coordinatesElement.innerHTML = `${coordinatesText}${activeLayer}</p>`;
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
    if (diagramNumber > 0) {
        diagramNumber--;
    }
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumber);
    localStorage.setItem("diagramNumber", diagramNumber);
    console.log(tmpDiagram);
    if (tmpDiagram != null) LoadImport(tmpDiagram);

    selected_objects = diagram.filter(object => object.targeted);
    cloneTempArray = [];
    hoveredObject = undefined;
    createRulerLinesObjectPoints();
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

    selected_objects = diagram.filter(object => object.targeted);
    cloneTempArray = [];
    hoveredObject = undefined;
    createRulerLinesObjectPoints();
}

//----------------------------------------------------------------------
// diagramToSVG: Used when exporting the diagram to svg
//----------------------------------------------------------------------
function diagramToSVG() {
    origoOffsetX = 0;
    origoOffsetY = 0;
    zoomValue = 1.00;
    updateGraphics();
    SaveState();
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
    if(togglePaper){
        if(paperOrientation == "landscape"){
            $(element).children(".material-icons")[0].innerHTML = "crop_16_9";
        }
        else if(paperOrientation == "portrait"){
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

//----------------------------------------------------------------------
// switchMode: called when pressing "Accept" button after mode switch, and as trigger when jumping in/out from developer mode
//----------------------------------------------------------------------

function switchMode(devMode) {
    // Close popup that appears when switching between UML/ER (when dev is off)
    closeModeSwitchDialog();
    
    // Toggle in/out from dev mode or switch to selected mode
    if(devMode == true) {
        developerMode(event);
    } else {
        toolbarState = targetMode;
        if(!developerModeActive) hideCrosses();
    }

    // Save current settings in case page is refreshed
    localStorage.setItem("toolbarState", toolbarState);
    localStorage.setItem("developerState", developerModeActive);

    // Used to restore to previous mode after exiting developer mode
    if(toolbarState != currentMode.dev) {
        previousToolbarState = toolbarState;
    }

    // Toggle menus + toolbar
    switchToolbar();
    editToolbarMenus();
    reWrite();
    updateGraphics();
}

//----------------------------------------------------------------------
// switchToolbar: switches what tools are displayed in the left toolbar (Dev, ER, UML)
//----------------------------------------------------------------------

function switchToolbar() {  
    // Hide/show relevant toolbar buttons depending on what mode is selected
    if(toolbarState == currentMode.dev || toolbarState == currentMode.er) {
        $("#attributebutton").show();
        $("#entitybutton").show();
        $("#relationbutton").show();
        $("#drawfreebutton").show();
        $("#classbutton").hide();
        if(toolbarState != currentMode.er) {
            $("#classbutton").show();
        }
    }
    else if(toolbarState == currentMode.uml) {
        $("#classbutton").show();
        $("#attributebutton").hide();
        $("#entitybutton").hide();
        $("#relationbutton").hide();
        $("#drawfreebutton").hide();
    }
    document.getElementById('diagram-toolbar-switcher').innerHTML = 'Mode: '+ toolbarState;
}

//-------------------------------------------------------------------------
// editToolbarMenus: Edit checkboxes in menus depending on what mode is active
//-------------------------------------------------------------------------

function editToolbarMenus(){
    setCheckbox($(".drop-down-option:contains('ER mode')"), toolbarState == currentMode.er);
    setCheckbox($(".drop-down-option:contains('UML mode')"), toolbarState == currentMode.uml);
    setCheckbox($(".drop-down-option:contains('Developer mode')"), (toolbarState == currentMode.dev) || developerModeActive == true);
    setCheckbox($(".drop-down-option:contains('Display All Tools')"), (toolbarState == currentMode.dev));
    if(developerModeActive == true){
        $("#displayAllTools").removeClass("drop-down-item drop-down-item-disabled");
    } else {
        $("#displayAllTools").addClass("drop-down-item drop-down-item-disabled");
        setCheckbox($(".drop-down-option:contains('Display All Tools')"), false);
    }
}

//------------------------------------------------------------------------------
// switchToolbarTo: This function switch opens a dialog for confirming mode switch
//------------------------------------------------------------------------------

function switchToolbarTo(target) {
    if (toolbarState == target) {
      return;
    }
    targetMode = target;
    modeSwitchDialogActive = true;
    //only ask for confirmation when developer mode is off
    if (developerModeActive) {
        switchMode();
    } else {
        $("#modeSwitchDialog").css("display", "flex");
        document.getElementById("modeSwitchTarget").innerHTML = "Change mode from " + toolbarState + " to " + targetMode;
    }
}

//------------------------------------------------------------------------------
// SwitchToolbarDev: Called when pressing "Display all tools". Sets targeted mode to developer and calls to switch
//------------------------------------------------------------------------------

function switchToolbarDev(event) {
    event.stopPropagation();
    if(!developerModeActive){
        return;
    }
    targetMode = currentMode.dev;
    switchMode();
}

//-------------------------------------------------------------------------
// closeModeSitchDialog: Closes popup that appears when switching modes
//-------------------------------------------------------------------------

function closeModeSwitchDialog(){
    modeSwitchDialogActive = false;
    $("#modeSwitchDialog").hide();
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
    createRulers();
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

//-----------------------
// Enter/exit fullscreen
//-----------------------

function toggleFullscreen(){
    var header = document.querySelector("header");
    var diagramHeader = document.getElementById("diagram-header");
    var diagramContainer = document.getElementById("diagram-container")

    if(!fullscreen){
        diagramHeader.classList.add("fullscreen");
        diagramContainer.classList.add("fullscreen");
        header.style.display = "none";
        $("#fullscreenDialog").css("display", "flex");
    } else {
        diagramHeader.classList.remove("fullscreen", "toolbar");
        diagramContainer.classList.remove("fullscreen", "toolbar");
        header.style.display = "inline-block";
        toolbarDisplayed = false;
    }
    fullscreen = !fullscreen;
    setCheckbox($(".drop-down-option:contains('Fullscreen')"), fullscreen);
    canvasSize();        
}

//-----------------------
// Close popup when entering fullscreen
//-----------------------

function closeFullscreenDialog(){
    $("#fullscreenDialog").hide();
}

//-----------------------
// Toggle Toolbar for fullscreen
//-----------------------

function toggleToolbar(){
    var diagramHeader = document.getElementById("diagram-header");
    var diagramContainer = document.getElementById("diagram-container");

    if(!toolbarDisplayed){
        diagramHeader.classList.add("toolbar");
        diagramContainer.classList.add("toolbar");
        toolbarDisplayed = true;
    } else {
        diagramHeader.classList.remove("toolbar");
        diagramContainer.classList.remove("toolbar");
        toolbarDisplayed = false;
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
    // Returns out of funtion if on mobile device
    // This is beacause touch events also trigger mouse events
    if (isMobile) {
        return;
    }
    // Get canvasMouse coordinates for both X & Y.
    currentMouseCoordinateX = canvasToPixels(ev.clientX - boundingRect.left).x;
    currentMouseCoordinateY = canvasToPixels(0, ev.clientY - boundingRect.top).y;

    //Update the moving mouse line positions for x-axis and y-axis rulers when rulers are active
    if(isRulersActive) {
        setRulerMouseLinesPosition(ev.offsetX, ev.offsetY);
    }

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
        createRulers();
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
                } else if (hoveredObject && !hoveredObject.isLocked && !hoveredObject.isLayerLocked) {
                    if (hoveredObject.symbolkind == symbolKind.line || hoveredObject.symbolkind == symbolKind.umlLine) {
                        canvas.style.cursor = "pointer";
                        //If hovering a hidden comment, don't change cursor
                    } else if (hoveredObject.properties["isComment"] && hideComment) {
                        canvas.style.cursor = "default";
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
                    //console.log(sel.point.x);
                    var yDiff = points[sel.attachedSymbol.bottomRight].y - points[sel.attachedSymbol.topLeft].y;
                    var xDiff = points[sel.attachedSymbol.bottomRight].x - points[sel.attachedSymbol.topLeft].x;
                    var change = ((currentMouseCoordinateX - sel.point.x) + (currentMouseCoordinateY - sel.point.y)) / 2;
                    //Don't move points if box is minumum size
                    if(minSizeCheck(xDiff, sel.attachedSymbol, "x") == false || (change < 5 && change >-5)){
                        sel.point.x = currentMouseCoordinateX;
                    }
                    if(minSizeCheck(yDiff, sel.attachedSymbol, "y") == false || (change < 5 && change >-5)){
                        sel.point.y = currentMouseCoordinateY;
                    }
                    //Handles loose lines
                    if(sel.attachedSymbol.symbolkind == symbolKind.line){
                        connectLooseLineObj.lineIsSelected = true;
                        connectLooseLineObj.selectedLine = sel.attachedSymbol;
                        if(sel.point.y == points[sel.attachedSymbol.bottomRight].y && sel.point.x == points[sel.attachedSymbol.bottomRight].x){
                            connectLooseLineObj.looseLineP1 = sel.attachedSymbol.topLeft;
                            connectLooseLineObj.looseLineP2 = sel.attachedSymbol.bottomRight;
                        }
                        else if(sel.point.y == points[sel.attachedSymbol.topLeft].y && sel.point.x == points[sel.attachedSymbol.topLeft].x){
                            connectLooseLineObj.looseLineP1 = sel.attachedSymbol.bottomRight;
                            connectLooseLineObj.looseLineP2 = sel.attachedSymbol.topLeft;
                        }
                        else{
                            connectLooseLineObj.lineIsSelected = false;
                            connectLooseLineObj.selectedLine = null;
                            connectLooseLineObj.looseLineP1 = null;
                            connectLooseLineObj.looseLineP2 = null;
                        }
                    }
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
                var yDiff = points[sel.attachedSymbol.bottomRight].y - points[sel.attachedSymbol.topLeft].y;
                var xDiff = points[sel.attachedSymbol.bottomRight].x - points[sel.attachedSymbol.topLeft].x;
                var change = ((currentMouseCoordinateX - sel.point.x.x) - (currentMouseCoordinateY - sel.point.y.y)) / 2;
                //Don't move points if box is minumum size
                if(minSizeCheck(xDiff, sel.attachedSymbol, "x") == false || (change < 5 && change >-5)){
                    sel.point.x.x = currentMouseCoordinateX;
                }
                if(minSizeCheck(yDiff, sel.attachedSymbol, "y") == false || (change < 5 && change >-5)){
                    sel.point.y.y = currentMouseCoordinateY;
                }
            }
            updateGraphics();
            // If mouse is pressed down and at a point in selected object - move that point
        } else if (md == mouseState.insideMovableObject) {
            // If mouse is pressed down inside a movable object - move that object
            if (movobj != -1 ) {
                uimode = "Moved";
                $(".diagram-tools-button-big").removeClass("pressed").addClass("unpressed");
                for (var i = 0; i < diagram.length; i++) {
                    if (diagram[i].targeted == true && !diagram[movobj].isLocked && !diagram[i].isLocked && !diagram[i].isLayerLocked) {
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
    createRulerLinesObjectPoints();
}

//----------------------------------------------------------
// Is called when left mouse button is clicked on the canvas
//----------------------------------------------------------

function mousedownevt(ev) {
    // Returns out of funtion if on mobile device
    // This is beacause touch events also trigger mouse events
    if (isMobile){
        return;
    }
    
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
            //Select when in CreateLine mode
            if (uimode == "CreateLine"){
              handleSelect();
            }
        }
    } else if (sel.distance < tolerance / zoomValue) {
        md = mouseState.insidePoint;
    } else if (movobj != -1) {
        md = mouseState.insideMovableObject;
        handleSelect();
    } else {
        md = mouseState.boxSelectOrCreateMode; // Box select or Create mode.
        if (uimode != "MoveAround" && !ctrlIsClicked) {
            for (var i = 0; i < selected_objects.length; i++) {
                selected_objects[i].targeted = false;
            }
            lastSelectedObject = -1;
            selected_objects = [];
            createRulerLinesObjectPoints();
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
    createRulerLinesObjectPoints();
}

function mouseupevt(ev) {
    // Returns out of funtion if on mobile device
    // This is beacause touch events also trigger mouse events
    if (isMobile) {
        return;
    }
    markedObject = diagram.indexOf(diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY));

    // Check if there's difference in mouse start position and end position.
    let mouseDifference;
    if (startMouseCoordinateX != currentMouseCoordinateX || startMouseCoordinateY != currentMouseCoordinateY) {
        mouseDifference = true;
    } else {
        mouseDifference = false;
    }
  
    if(ev.button == leftMouseClick){
        canvasLeftClick = false;
    } else if (ev.button == rightMouseClick) {
        canvasRightClick = false;
    } else if (ev.type == "touchend") {
        canvasTouchClick = false;
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
            if(ev.button == rightMouseClick && uimode != "normal"){
                endFreeDraw();
            }
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
    // Selecting objects in Create Line mode returns false saveState
    if (uimode == "CreateLine" && !mouseDifference) saveState = false;
    if (symbolStartKind != symbolKind.uml && uimode == "CreateLine" && md == mouseState.boxSelectOrCreateMode && mouseDifference) {
        saveState = false;
        //Check if you release on canvas or try to draw a line from entity to entity
        if (markedObject == -1 || diagram[lineStartObj].symbolkind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erEntity) {
            if(diagram[lineStartObj] == diagram[markedObject]){
                flash("Can not draw line between the same object", "danger");
            }
            else if(markedObject != -1 && diagram[lineStartObj].symbolkind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erEntity){
                flash("Can not draw line between two ER-entities", "danger");
            }
            md = mouseState.empty;
        }else {
            //Get which kind of symbol mouseupevt execute on
            symbolEndKind = diagram[markedObject].symbolkind;

            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            //Check if you not start on a line and not end on a line or so that a line isn't connected to a text object,
            // if then, set point1 and point2
            //okToMakeLine is a flag for this
            var okToMakeLine = true;
            if (symbolStartKind != symbolKind.line && symbolEndKind != symbolKind.line) {
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
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                }else if (symbolEndKind == symbolKind.erAttribute && symbolStartKind == symbolKind.erEntity) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0) {
                        okToMakeLine= false;
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                }else if (symbolEndKind == symbolKind.erEntity && symbolStartKind == symbolKind.erRelation) {
                    if (diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) >= 2){
                        okToMakeLine = false;
                        flash("A max of two lines can be drawn between these objects", "danger");
                    }
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erEntity) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) >= 2){
                        okToMakeLine = false;
                        flash("A max of two lines can be drawn between these objects", "danger");
                    } 
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erAttribute) {
                    if (diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 0){
                        okToMakeLine = false;
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                }else if (symbolEndKind == symbolKind.erAttribute && symbolStartKind == symbolKind.erRelation) {
                    if (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0){
                        okToMakeLine = false;
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                }else if (symbolEndKind == symbolKind.erRelation && symbolStartKind == symbolKind.erRelation) {
                    okToMakeLine = false;
                    flash("Can not draw line between two ER-relations", "danger");
                }else if ((symbolEndKind == symbolKind.uml && symbolStartKind != symbolKind.uml) || (symbolEndKind != symbolKind.uml && symbolStartKind == symbolKind.uml)) {
                    okToMakeLine = false;
                    flash("Can not draw line between ER- and UML-objects", "danger");
                } else if(symbolEndKind == symbolKind.erAttribute && symbolStartKind == symbolKind.erAttribute){
                    if ((diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 0) || (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0)){
                        okToMakeLine = false;
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                } 

                if(diagram[lineStartObj] == diagram[markedObject]){
                    okToMakeLine = false;
                    flash("Can not draw line between the same object", "danger");
                }

                if(diagram[lineStartObj].kind == 1 || diagram[markedObject].kind == 1){
                    okToMakeLine = false;
                    flash("Can not draw line to/from a freedraw object", "danger");
                }
              
                if(symbolEndKind == symbolKind.text || symbolStartKind == symbolKind.text) {
                    okToMakeLine = false;
                    flash("Can not draw line to/from a text object", "danger");
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
  
    if (symbolStartKind == symbolKind.uml && uimode == "CreateLine" && md == mouseState.boxSelectOrCreateMode && mouseDifference) {
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
                    flash("Can not draw line between UML- and ER-objects", "danger");
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
    } else if (uimode == "CreateLine") {
        //Code for making a line, if start and end object are different, except attributes and if no object is text
        if((symbolStartKind != symbolEndKind || (symbolStartKind == symbolKind.erAttribute && symbolEndKind == symbolKind.erAttribute)
        || symbolStartKind == symbolKind.uml && symbolEndKind == symbolKind.uml) && (symbolStartKind != symbolKind.line && symbolEndKind != symbolKind.line)
        && (symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text) && okToMakeLine  && md == mouseState.boxSelectOrCreateMode) {
            erLineA = new Symbol(symbolKind.line); // Lines
            erLineA.name = "Line" + diagram.length;
            erLineA.isCardinalityPossible = !([diagram[lineStartObj], hoveredObject].some(symbol => symbol.symbolkind === symbolKind.erAttribute)); //No connected objects are attributes
            erLineA.topLeft = p1;
            erLineA.bottomRight = p2;

            if(erLineA.isCardinalityPossible) {
                erLineA.cardinality.parentPointIndexes = {
                    topLeft: hoveredObject.topLeft,
                    bottomRight: hoveredObject.bottomRight
                };

                //Reverse points when the hoveredObject is a relation object to have consistent cardinality on entity side
                if(hoveredObject.symbolkind === symbolKind.erRelation) {
                    erLineA.topLeft = p2;
                    erLineA.bottomRight = p1;
                    erLineA.cardinality.parentPointIndexes.topLeft = diagram[lineStartObj].topLeft;
                    erLineA.cardinality.parentPointIndexes.bottomRight = diagram[lineStartObj].bottomRight;
                }
            }
            //always put lines at the bottom since they always render at the bottom, that seems to be the most logical thing to do
            diagram.unshift(erLineA);
            //selecting the newly created enitity and open the dialogmenu.
            diagram[lastSelectedObject].targeted = false;
            lastSelectedObject = 0;
            erLineA.targeted = true;
            selected_objects.push(erLineA);

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
        if((symbolStartKind == symbolKind.uml && symbolEndKind == symbolKind.uml) && (symbolStartKind != symbolKind.umlLine && symbolEndKind != symbolKind.umlLine)
        && (symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text)) {
            umlLineA = new Symbol(symbolKind.umlLine); //UML Lines
            umlLineA.name = "Line" + diagram.length;
            umlLineA.topLeft = p1;
            umlLineA.bottomRight = p2;
            umlLineA.targeted = true;
            umlLineA.isRecursiveLine = lineStartObj == markedObject;
            if (umlLineA.isRecursiveLine) {
                points[umlLineA.topLeft].x = points[umlLineA.bottomRight].x;
                points[umlLineA.topLeft].y = points[umlLineA.bottomRight].y;
            }
            diagram.push(umlLineA);
            lastSelectedObject = diagram.length - 1;
            selected_objects.push(umlLineA);
            updateGraphics();
        }
        uimode = "CreateLine";
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
    //Connects loose line to object when released while insidee a compatible object
    if(connectLooseLineObj.lineIsSelected){
        markedObject = diagram.indexOf(diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY));
        if(markedObject != null){
            var connectedObj = connectLooseLineObj.selectedLine.getConnectedObjects();
            //Used if line if loose on both sides
            if(connectedObj.length == 0){
                saveState = true;
                var p1 = connectLooseLineObj.looseLineP1;
                var p2 = connectLooseLineObj.looseLineP2;
                //handles attributes centerpoint
                if (diagram[markedObject].symbolkind == symbolKind.erAttribute) {
                    p2 = diagram[markedObject].centerPoint;
                    if(sel.point.y == points[sel.attachedSymbol.bottomRight].y && sel.point.x == points[sel.attachedSymbol.bottomRight].x){
                        points[sel.attachedSymbol.bottomRight] = p2;
                        connectLooseLineObj.selectedLine.bottomRight = p2;
                    }
                    else if(sel.point.y == points[sel.attachedSymbol.topLeft].y && sel.point.x == points[sel.attachedSymbol.topLeft].x){
                        points[sel.attachedSymbol.topLeft] = p2;
                        connectLooseLineObj.selectedLine.topLeft = p2;
                    }
                }
                diagram[markedObject].connectorTop.push({from:p2, to:p1});
            }
            //Used if line is only loose on one side
            else if(connectedObj.length == 1){
                if(canConnectLine(connectedObj[0], diagram[markedObject])){
                    saveState = true;
                    var p1 = connectLooseLineObj.looseLineP1;
                    var p2 = connectLooseLineObj.looseLineP2;
                    
                    if (diagram[markedObject].symbolkind == symbolKind.erAttribute) {
                        p2 = diagram[markedObject].centerPoint;
                        if(sel.point.y == points[sel.attachedSymbol.bottomRight].y && sel.point.x == points[sel.attachedSymbol.bottomRight].x){
                            points[sel.attachedSymbol.bottomRight] = p2;
                            connectLooseLineObj.selectedLine.bottomRight = p2;
                            var connectorName = connectedObj[0].getConnectorNameFromPoint(p1);
                            for(var i = 0 ; i < connectedObj[0][connectorName].length ; i++){
                                if(connectedObj[0][connectorName][i].from == p1){
                                    connectedObj[0][connectorName][i].to = p2;
                                    break;
                                }
                            }
                        }
                        else if(sel.point.y == points[sel.attachedSymbol.topLeft].y && sel.point.x == points[sel.attachedSymbol.topLeft].x){
                            points[sel.attachedSymbol.topLeft] = p2;
                            connectLooseLineObj.selectedLine.topLeft = p2;
                            var connectorName = connectedObj[0].getConnectorNameFromPoint(p1);
                            for(var i = 0 ; i < connectedObj[0][connectorName].length ; i++){
                                if(connectedObj[0][connectorName][i].from == p1){
                                    connectedObj[0][connectorName][i].to = p2;
                                    break;
                                }
                            }
                        }
                    }
                    diagram[markedObject].connectorTop.push({from:p2, to:p1});
                }
            }
        }
        connectLooseLineObj.lineIsSelected = false;
        connectLooseLineObj.looseLineP1 = null;
        connectLooseLineObj.looseLineP2 = null;
        connectLooseLineObj.selectedLine = null;
    }
    
    hashFunction();
    updateGraphics();
    // Clear mouse state
    md = mouseState.empty;
    if(saveState) SaveState();
}

//---------------------------------------------------
// Is called each time a touch is started
//---------------------------------------------------

function touchStartEvent(event) {
    if (typeof InitPageX == 'undefined' && typeof InitPageY == 'undefined') {
        InitPageX = event.changedTouches[0].pageX;
        InitPageY = event.changedTouches[0].pageY;            
    }

    currentMouseCoordinateX = canvasToPixels(event.changedTouches[0].clientX - boundingRect.left).x;
    currentMouseCoordinateY = canvasToPixels(0, event.changedTouches[0].clientY - boundingRect.top).y;
    startMouseCoordinateX = currentMouseCoordinateX;
    startMouseCoordinateY = currentMouseCoordinateY;

    // Returns what object was pressed, -1 if none
    movobj = diagram.itemClicked();
    sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);

    
    // If a point was clicked 
    if (sel.distance < tolerance / zoomValue) {
        md = mouseState.insidePoint;
    }
    // If an object is clicked
    else if (movobj != -1 && uimode != "CreateLine") {
        md = mouseState.insideMovableObject;
        handleSelect();
    } 
    // If create line tool is selected
    else if(movobj != -1 && uimode == "CreateLine") {
        md = mouseState.boxSelectOrCreateMode;
        lineStartObj = movobj;
        symbolStartKind = diagram[lineStartObj].symbolkind;
    } else {
        md = mouseState.boxSelectOrCreateMode;
        for (var i = 0; i < selected_objects.length; i++) {
            selected_objects[i].targeted = false;
        }
        lastSelectedObject = -1;
        selected_objects = [];
        createRulerLinesObjectPoints();
        startMouseCoordinateX = currentMouseCoordinateX;
        startMouseCoordinateY = currentMouseCoordinateY;
    }
}

//---------------------------------------------------
// Is called each time a touch is moved (a touchstroke)
//---------------------------------------------------

function touchMoveEvent(event) {
    currentMouseCoordinateX = canvasToPixels(event.changedTouches[0].clientX - boundingRect.left).x;
    currentMouseCoordinateY = canvasToPixels(0, event.changedTouches[0].clientY - boundingRect.top).y

    // Minimum distance required to move
    deltaX = 2;
    deltaY = 2;

    if (typeof InitPageX !== 'undefined' && typeof InitPageY !== 'undefined') {
        diffX = event.changedTouches[0].pageX - InitPageX;
        diffY = event.changedTouches[0].pageY - InitPageY;

        // Activate move around if touch moved far enough
        if ((diffX > deltaX) || (diffX < -deltaX)
        || (diffY > deltaY) || (diffY < -deltaY)) {
            if (uimode != 'MoveAround' && md != mouseState.insideMovableObject 
            && md != mouseState.insidePoint && uimode != "CreateLine") {
                activateMovearound();
            }
            updateGraphics();
        }
    }

    // Moves canvas
    if (uimode == 'MoveAround') {
        origoOffsetX += (currentMouseCoordinateX - startMouseCoordinateX) * zoomValue;
        origoOffsetY += (currentMouseCoordinateY - startMouseCoordinateY) * zoomValue;
       
        startMouseCoordinateX = canvasToPixels(event.changedTouches[0].clientX - boundingRect.left).x;
        startMouseCoordinateY = canvasToPixels(0, event.changedTouches[0].clientY - boundingRect.top).y;
        
        localStorage.setItem("cameraPosX", origoOffsetX);
        localStorage.setItem("cameraPosY", origoOffsetY);
        
        createRulers();
    }

    // Moves an object
    if (md == mouseState.insideMovableObject) {
        if (movobj != -1) {
            uimode = "Moved";
            $(".diagram-tools-button-big").removeClass("pressed").addClass("unpressed");
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
    // Resizes an object
    if (md == mouseState.insidePoint) {
        resizeElement(sel);
    }
    // Draw preview line
    if (uimode == "CreateLine" && movobj != -1) {
        // Path settings for preview line
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pixelsToCanvas(startMouseCoordinateX).x, pixelsToCanvas(0, startMouseCoordinateY).y);
        ctx.lineTo(pixelsToCanvas(currentMouseCoordinateX).x, pixelsToCanvas(0, currentMouseCoordinateY).y);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.setLineDash([]);
    }
    createRulerLinesObjectPoints();
    reWrite();
    updateGraphics();
}

// Takes the closest selected point and resizes the object
function resizeElement(selected) { 
    // Needs to have a symbol selected to resize, and it cant be locked
    if (!selected.attachedSymbol.targeted || selected.attachedSymbol.isLocked) {
        return;
    }
    // For top left and 
    if (!selected.point.fake) {
        var yDiff = points[selected.attachedSymbol.bottomRight].y - points[selected.attachedSymbol.topLeft].y;
        var xDiff = points[selected.attachedSymbol.bottomRight].x - points[selected.attachedSymbol.topLeft].x;
        var change = ((currentMouseCoordinateX - selected.point.x) + (currentMouseCoordinateY - selected.point.y)) / 2;
        // Can't resize below minimum threshold
        if(minSizeCheck(xDiff, selected.attachedSymbol, "x") == false || 5 > change > -5){
            selected.point.x = currentMouseCoordinateX;
        }
        if(minSizeCheck(yDiff, selected.attachedSymbol, "y") == false || 5 > change > -5){
            selected.point.y = currentMouseCoordinateY;
        }
    }
    // For top right and bottom left 
    else {
        var yDiff = points[selected.attachedSymbol.bottomRight].y - points[selected.attachedSymbol.topLeft].y;
        var xDiff = points[selected.attachedSymbol.bottomRight].x - points[selected.attachedSymbol.topLeft].x;
        var change = ((currentMouseCoordinateX - selected.point.x.x) - (currentMouseCoordinateY - selected.point.y.y)) / 2;
        // Can't resize below minimum threshold
        if(minSizeCheck(xDiff, selected.attachedSymbol, "x") == false || 5 > change > -5){
            selected.point.x.x = currentMouseCoordinateX;
        }
        if(minSizeCheck(yDiff, selected.attachedSymbol, "y") == false || 5 > change > -5){
            selected.point.y.y = currentMouseCoordinateY;
        }
    }
    diagram.draw();
}

//---------------------------------------------------
// Is called each time a touch is ended
//---------------------------------------------------

function touchEndEvent(event) {
    markedObject = diagram.indexOf(diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY));

    delete InitPageX;
    delete InitPageY;  

    if (uimode == "MoveAround"){
        deactivateMovearound();
        updateGraphics();
    }
    if (uimode == "CreateFigure" && md == mouseState.boxSelectOrCreateMode) {
        if (figureType == "Free") {
            figureFreeDraw();
            updateGraphics();
            return;
        }
        else if (figureType == "Text") {
            createText(currentMouseCoordinateX, currentMouseCoordinateY);
        }
    }

    var p1BeforeResize;
    var p2BeforeResize;
    if (md == mouseState.boxSelectOrCreateMode && (uimode == "CreateClass" || uimode == "CreateERAttr" 
    || uimode == "CreateEREntity" || uimode == "CreateERRelation")) {
        p1BeforeResize = {x:startMouseCoordinateX, y:startMouseCoordinateY};
        p2BeforeResize = {x:currentMouseCoordinateX, y:currentMouseCoordinateY};
        resize();
        // Add required points
        p1 = points.addPoint(startMouseCoordinateX, startMouseCoordinateY, false);
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        p3 = points.addPoint((startMouseCoordinateX + currentMouseCoordinateX) * 0.5, (startMouseCoordinateY + currentMouseCoordinateY) * 0.5, false);
        // Creates symbol if uimode is set
        createSymbol(p1BeforeResize, p2BeforeResize);
    }
    var saveState = md == mouseState.boxSelectOrCreateMode && uimode != "normal";

    if(uimode == "MoveAround" && md === mouseState.boxSelectOrCreateMode) {
        saveState = false;
    }
    // Create lines between er objects
    if (symbolStartKind != symbolKind.uml && uimode == "CreateLine") {
        saveState = false;
        if (markedObject != -1 && !(symbolStartKind == symbolKind.erEntity && diagram[markedObject].symbolkind == symbolKind.erEntity)
        && !(symbolStartKind == symbolKind.erRelation && diagram[markedObject].symbolkind == symbolKind.erRelation)
        && symbolStartKind != symbolKind.line && symbolEndKind != symbolKind.line 
        && symbolStartKind != symbolKind.text && symbolEndKind != symbolKind.text) {
            var okToMakeLine = true;
            symbolEndKind = diagram[markedObject].symbolkind;

            // Can't be more than two lines between an entity and a relation
            if ((symbolStartKind == symbolKind.erEntity && symbolEndKind == symbolKind.erRelation)
            || (symbolStartKind == symbolKind.erRelation && symbolEndKind == symbolKind.erEntity)) {
                if ((diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 1)
                || (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 1)) {
                    okToMakeLine = false;
                }
            }
            // Must be two different objects
            else if (diagram[markedObject] == diagram[lineStartObj]) {
                okToMakeLine = false;
            }
            // Can't be from er to uml
            else if (symbolEndKind == symbolKind.uml) {
                okToMakeLine = false;
            }
            // Can't be more than one line if not relation to entity
            else {
                if ((symbolStartKind != symbolKind.erRelation && symbolEndKind != symbolKind.erRelation)
                || symbolStartKind == symbolKind.erAttribute || symbolEndKind == symbolKind.erAttribute) {
                    if ((diagram[markedObject].connectorCountFromSymbol(diagram[lineStartObj]) > 0)
                    || (diagram[lineStartObj].connectorCountFromSymbol(diagram[markedObject]) > 0)) {
                        okToMakeLine = false
                    }
                }
            }
            if (okToMakeLine) {
                addLine(diagram[lineStartObj], diagram[markedObject]);
                createSymbol();
                saveState = true;
            }
        }
    }
    else if (symbolStartKind == symbolKind.uml && uimode == "CreateLine") {
        saveState = false;
        uimode = "CreateUMLLine";

        if (markedObject != -1 && diagram[markedObject].symbolkind == symbolKind.uml) {
            symbolEndKind = diagram[markedObject].symbolkind;
            addLine(diagram[lineStartObj], diagram[markedObject]);
            createSymbol();
            saveState = true;
        }
        else {
            uimode = "CreateLine";
        }
    }
    if (md == mouseState.insidePoint){
        saveState = true;
    }
    hashFunction();
    updateGraphics();
    md = mouseState.empty;
    if(saveState) SaveState();
}

function addLine(startObject, endObject) {
    
    // If er attribute add it's centerpoint
    if (startObject.symbolkind == symbolKind.erAttribute) {
        p1 = startObject.centerPoint;
    }
    else {
        p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
    }
    // If er attribute add it's centerpoint
    if (endObject.symbolkind == symbolKind.erAttribute) {
        p2 = endObject.centerPoint;
    }
    else {
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
    }
    startObject.connectorTop.push({from:p1, to:p2});
    endObject.connectorTop.push({from:p2, to:p1});
}

// Creates a symbol based on current uimode
function createSymbol(p1BeforeResize, p2BeforeResize){
    switch(uimode){
        case "CreateClass":
            var classB = new Symbol(symbolKind.uml);
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
            if (diagramObject && attributeTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
            && attributeTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
                diagramObject.pointsAtSamePosition = true;
            }
            break;
        case "CreateERAttr":
            erAttributeA = new Symbol(symbolKind.erAttribute);
            erAttributeA.name = "Attr " + settings.serialNumbers.Attribute;
            erAttributeA.topLeft = p1;
            erAttributeA.bottomRight = p2;
            erAttributeA.centerPoint = p3;
            diagram.push(erAttributeA);
            lastSelectedObject = diagram.length -1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            diagramObject = diagram[lastSelectedObject];
            settings.serialNumbers.Attribute++;
            if (diagramObject && attributeTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
            && attributeTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
                diagramObject.pointsAtSamePosition = true;
            }
            break;
        case "CreateEREntity":
            erEnityA = new Symbol(symbolKind.erEntity);
            erEnityA.name = "Entity " + settings.serialNumbers.Entity;
            erEnityA.topLeft = p1;
            erEnityA.bottomRight = p2;
            erEnityA.centerPoint = p3;
            diagram.push(erEnityA);
            lastSelectedObject = diagram.length -1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            diagramObject = diagram[lastSelectedObject];
            settings.serialNumbers.Entity++;
            if (diagramObject && entityTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
            && entityTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
                diagramObject.pointsAtSamePosition = true;
            }
            break;
        case "CreateLine":
            if (lineStartObj != -1 && markedObject != -1) {
                erLineA = new Symbol(symbolKind.line);
                erLineA.name = "Line" + diagram.length;
                erLineA.topLeft = p1;
                erLineA.bottomRight = p2;
                diagram.unshift(erLineA);
                lastSelectedObject = diagram.length -1;
                diagram[lastSelectedObject].targeted = true;
                selected_objects.push(diagram[lastSelectedObject]);
                updateGraphics();
            }
            break;
        case "CreateUMLLine":
            umlLineA = new Symbol(symbolKind.umlLine);
            umlLineA.name = "Line" + diagram.length;
            umlLineA.topLeft = p1;
            umlLineA.bottomRight = p2;
            umlLineA.isRecursiveLine = lineStartObj == markedObject;
            if (umlLineA.isRecursiveLine) {
                points[umlLineA.topLeft].x = points[umlLineA.bottomRight].x;
                points[umlLineA.topLeft].y = points[umlLineA.bottomRight].y;
            }
            diagram.push(umlLineA);
            lastSelectedObject = diagram.length - 1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            updateGraphics();
            break;
        case "CreateERRelation":
            erRelationA = new Symbol(symbolKind.erRelation);
            erRelationA.name = "Relation " + settings.serialNumbers.Relation;
            erRelationA.topLeft = p1;
            erRelationA.bottomRight = p2;
            erRelationA.centerPoint = p3;
            diagram.push(erRelationA);
            lastSelectedObject = diagram.length -1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            diagramObject = diagram[lastSelectedObject];
            settings.serialNumbers.Relation++;
            if (diagramObject && relationTemplate.width / minimumDivisor > Math.abs(p1BeforeResize.x - p2BeforeResize.x) 
            && relationTemplate.height / minimumDivisor > Math.abs(p1BeforeResize.y - p2BeforeResize.y)) {
                diagramObject.pointsAtSamePosition = true;
            }
            break;
        default:
    }
}

function doubleclick() {
    // Add point to freedraw object if clicked on line
    if (lastSelectedObject != -1 && diagram[lastSelectedObject].targeted == true 
    && diagram[lastSelectedObject].figureType == "Free") {
        let clickedSegmentId = clickedOnLine(diagram[lastSelectedObject]);
        if (clickedSegmentId != -1) {
            let freedrawObject = diagram[lastSelectedObject];
            let newPoint = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
            let clickedSegment = freedrawObject.segments[clickedSegmentId];
            
            freedrawObject.segments.splice(clickedSegmentId, 1);
            freedrawObject.segments.splice(clickedSegmentId, 0, {kind:kind.path, pa:clickedSegment.pa, pb:newPoint});
            freedrawObject.segments.splice(clickedSegmentId+1, 0, {kind:kind.path, pa:newPoint, pb:clickedSegment.pb});
        }
        else {
            loadAppearanceForm(); 
        }
    }
    //Don't load appearance form if clicked object is a hidden comment
    else if (lastSelectedObject != -1 && diagram[lastSelectedObject].targeted == true 
    && !(diagram[lastSelectedObject].properties["isComment"] && hideComment)) {
        loadAppearanceForm();
    }
}

//--------------------------------------------------------------------
// clickedOnLine: Checks if a line of an object is clicked, returns segment index
//--------------------------------------------------------------------
function clickedOnLine(clickedObject) {
    let clickedLine = -1;
    
    for (let i = 0; i < clickedObject.segments.length; i++) {
        if (pointOnLine(currentMouseCoordinateX, currentMouseCoordinateY, clickedObject.segments[i])) {
            clickedLine = i;
        }
    }
    return clickedLine;
}

//--------------------------------------------------------------------
// pointOnLine: Checks if a point is positioned on a segment
//--------------------------------------------------------------------
function pointOnLine(pointX, pointY, segment) {
    let pointBetween = {x:pointX, y:pointY};
    let pointA = {x:points[segment.pa].x, y:points[segment.pa].y};
    let pointB = {x:points[segment.pb].x, y:points[segment.pb].y};

    if (distance(pointA, pointBetween) + distance(pointB, pointBetween) 
    <= distance(pointA, pointB) + 0.6) {
        return true;
    }
}

//--------------------------------------------------------------------
// distance: Returns distance between two points 
//--------------------------------------------------------------------
function distance(point1, point2) {     
    return Math.sqrt((Math.pow((point1.x - point2.x),2) + Math.pow((point1.y - point2.y),2)));
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
	$(".diagram-tools-button-big").removeClass("pressed").addClass("unpressed");
    var button = document.getElementById("moveButton").className;
    var buttonStyle = document.getElementById("moveButton");
    canvas.removeEventListener("dblclick", doubleclick, false);
    if (button == "unpressed") {
        if (uimode == "CreateFigure" && numberOfPointsInFigure > 0) {
            cancelFreeDraw();
        }
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

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// toggleApperanceElement: Sets display status of appearance menu by the passed boolean value. If global appearance menu was closed, recent diagram is loaded from localStorage to revert changes if not submitted and only closed (by 'X' or click outside of form).
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

const symbolTypeMap = {
    "-1": "Global",
    "0": "Path",
    "1": "UML",
    "2": "Attribute",
    "3": "Entity",
    "4": "ER line",
    "5": "Relation",
    "6": "Text",
    "7": "UML line"
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// createCollapsible: Creates a collapsible element containing the form-groups passed. Types is an array used to concatenate the title from. Index is used to to open the first created collapsible.
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function createCollapsible(formGroups, types, index) {
    const collapsibleElement = document.createElement("div");
    const objectTypesElement = document.createElement("div");
    const iconContainer = document.createElement("div");
    const icon = document.createElement("div");
    const title = document.createElement("div");
    const formGroupContainer = document.createElement("div");

    collapsibleElement.appendChild(objectTypesElement);
    collapsibleElement.appendChild(formGroupContainer);
    objectTypesElement.appendChild(iconContainer);
    objectTypesElement.appendChild(title);
    iconContainer.appendChild(icon);

    collapsibleElement.classList.add("collapsible");
    objectTypesElement.classList.add("object-types");
    iconContainer.classList.add("square");
    formGroupContainer.classList.add("form-groups");

    //The first collapsible should be opened by default, possible others should be closed
    if(index !== 0) {
        collapsibleElement.classList.add("closed");
    }

    iconContainer.addEventListener("click", () => collapsibleElement.classList.toggle("closed"));

    //Set collapsible title to the object names the collapsible should represent. Seperate by comma (no comma for last)
    types.forEach((type, i) => {
        title.innerText += symbolTypeMap[type];
        if(i !== types.length - 1) title.innerText += ", ";
    });

    formGroups.forEach(group => formGroupContainer.appendChild(group));

    document.getElementById("appearanceForm").appendChild(collapsibleElement);
}

//----------------------------------------------------------------------------------------------------------------------------------------------------
// loadGlobalAppearanceForm: Shows the appearance menu and shows all form groups having type -1 (global). Sets selected values for all inputs/selects.
//----------------------------------------------------------------------------------------------------------------------------------------------------

function loadGlobalAppearanceForm() {
    showFormGroups([-1]);
    globalappearanceMenuOpen = true;
    toggleApperanceElement(true);
    document.getElementById("lineThicknessGlobal").value = settings.properties.lineWidth;
    setGlobalSelections();
}

const separators = {
    input: "~",
    option: "~",
    textarea: "~\n"
};

let appearanceObjects = [];

//---------------------------------------------------------------------------------------------------------------------------------------------------------------
// loadAppearanceForm: Shows the appearance menu and shows all form groups related to the selected objects. Sets values for all input elements/selects/textareas.
//---------------------------------------------------------------------------------------------------------------------------------------------------------------

function loadAppearanceForm() {
    appearanceObjects = [];

    //Should not load form if there are no unlocked objects.
    //Do not care about locked objects in appearance form.
    for(const object of selected_objects) {
        if(!object.isLocked) {
            appearanceObjects.push(object);
        }
    }
    if(appearanceObjects.length < 1) return;

    const indexes = getSelectedObjectsMaxIndexes(appearanceObjects);

    //Get all unique types of selected objects
    const types = Object.keys(indexes).map(Number);

    setNameIndexes(indexes, types);
    
    showFormGroups(types);
    toggleApperanceElement(true);
    
    const freeTextElement = document.getElementById("freeText");
    const umlOperationsElement = document.getElementById("umlOperations");
    const umlAttributesElement = document.getElementById("umlAttributes");
    let erCardinalityVisible = false;

    appearanceObjects.forEach(object => {
        setNameElement(object, indexes.name);

        if(object.symbolkind === symbolKind.line) {
            if(!erCardinalityVisible) {
                if(setErCardinalityElementDisplayStatus(object, erCardinalityVisible)) {
                    erCardinalityVisible = true;
                }
            }
            document.getElementById("typeLine").focus();
        } else if(object.symbolkind === symbolKind.umlLine) {
            setLineDirectionElementUML(object, indexes[symbolKind.umlLine]);
            document.getElementById("typeLineUML").focus();
        } else if(object.symbolkind === symbolKind.text) {
            indexes[symbolKind.text].current++;
            setTextareaElement(freeTextElement, object.textLines, indexes[symbolKind.text]);
            freeTextElement.focus();
        } else if(object.symbolkind === symbolKind.uml) {
            indexes[symbolKind.uml].current++;
            setTextareaElement(umlOperationsElement, object.operations, indexes[symbolKind.uml]);
            setTextareaElement(umlAttributesElement, object.attributes, indexes[symbolKind.uml]);
        } else if(object.kind === kind.path) {
            document.getElementById("figureOpacity").value = object.opacity * 100;
            document.getElementById("fillColor").focus();
        }
        setSelections(object);
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
// getSelectedObjectsMaxIndexes: Creates an object containing maximum and current index for each type of object passed as an array to the function.
//-------------------------------------------------------------------------------------------------------------------------------------------------

function getSelectedObjectsMaxIndexes(objects) {
    //Stores current index and maximum index for each type of selected object
    //Current index will be used for separation, to only create comma when max is more than current
    const indexes = {};

    //Reduce the selected objects array to a Map with key symbolKind and value the number of times that symbolKind occurs
    //Iterate through the map and put the correct values in the indexes object
    objects.reduce((result, object) => {
        result.set(object.symbolkind || 0, (result.get(object.symbolkind || 0) || 0) + 1);
        return result;
    }, new Map()).forEach((value, key) => {
        if(typeof indexes[key] === "undefined") {
            indexes[key] = {
                current: 0,
                max: 0
            };
        }
        indexes[key].max += value;
    });

    return indexes;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setNameIndexes: Adds the name property into the passed indexes object. Max index for name is calculated based on all types max indexes that should have the name input.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setNameIndexes(indexes, types) {
    //The max index for the name input should be based on all object types that have the name input
    indexes.name = {
        current: 0,
        max: types.reduce((result, type) => {
            if(type === symbolKind.uml || type === symbolKind.erAttribute || type === symbolKind.erEntity || type === symbolKind.erRelation) {
                result += indexes[type].max;
            }
            return result;
        }, 0)
    };
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setNameElement: Sets the value of the name input element based on passed objects and uses passed index to create a separator between object names if not last object.
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setNameElement(object, index) {
    const nameElement = document.getElementById("name");
    if(object.symbolkind === symbolKind.uml || object.symbolkind === symbolKind.erAttribute || object.symbolkind === symbolKind.erEntity || object.symbolkind === symbolKind.erRelation) {
        index.current++;
        nameElement.value += object.name;
        if(index.max > index.current) {
            nameElement.value += `${separators.input} `;
        }
        nameElement.dataset.originalvalue = nameElement.value;
        nameElement.focus();
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setLineDirectionElementUML: Runs for UML line objects. Appends the name of connected object names to correct option in the lineDirection select. Takes recursive lines into consideration.
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setLineDirectionElementUML(object, index) {
    //Get objects connected to uml-line and sets name in appearance menu(used for Line direction)
    const connectedObjectsArray = object.getConnectedObjects();
    const options = document.getElementById("lineDirection").options;

    index.current++;
    options[0].innerHTML += connectedObjectsArray[0].name;

    //Selection to check if relation is to the same entity. If so: both are named from object 0
    if(typeof connectedObjectsArray[1] == "undefined"){
        options[1].innerHTML +=  connectedObjectsArray[0].name;
    } else {
        options[1].innerHTML += connectedObjectsArray[1].name;
    }
    if(index.max > index.current) {
        options[0].innerHTML += `${separators.option} `;
        options[1].innerHTML += `${separators.option} `;
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setTextareaElement: Sets the value of a textarea element based on property array and uses passed index to create a separator between different object text if not last object.
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setTextareaElement(element, property, index) {
    element.value += getTextareaText(property);
    if(index.max > index.current) {
        element.value += separators.textarea;
    }
    element.dataset.originalvalue = element.value;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setErCardinalityElementDisplayStatus: Checks if passed er line object can have cardinality.Displays the cardinality element and returns true if possible and hides it and returns false if not.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setErCardinalityElementDisplayStatus(object) {
    if(object.isCardinalityPossible) {
        document.getElementById("cardinalityER").parentNode.style.display = "block";
        return true;
    } else {
        document.getElementById("cardinalityER").parentNode.style.display = "none";
        return false;
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// showFormGroups: Resets the form to the state before previous creation to remove old collapsibles. Shows all form groups having the type in the passed array and groups them into new collapsibles.
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function showFormGroups(typesToShow) {
    const form = document.getElementById("appearanceForm");

    //Replace appearance form with original to keep structure after collapsible addition changes it
    form.parentNode.replaceChild(originalAppearanceForm, form);

    const allformGroups = document.querySelectorAll("#appearanceForm .form-group");
    const formGroupsToShow = getGroupsByTypes(typesToShow);

    allformGroups.forEach(group => group.style.display = "none");
    formGroupsToShow.forEach(group => group.style.display = "block");

    const collapsibleStructure = getCollapsibleStructure(formGroupsToShow, typesToShow);

    initAppearanceForm();
    collapsibleStructure.forEach((object, i) => createCollapsible(object.groups, object.types, i));

    //Always put submit-button in the end of the form
    document.getElementById("appearanceForm").appendChild(document.getElementById("appearanceButtonContainer"));
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// getCollapsibleStructure: Generates an array of objects where each object represents a collapsible. Each object have information about which form-groups should be in the collapsible and which object types will be affected by the collapsible's content.
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getCollapsibleStructure(formGroups, typesToShow) {
    return formGroups.reduce((result, group) => {
        const groupTypes = group.dataset.types.split(",");
        const types = groupTypes.filter(type => typesToShow.includes(parseInt(type)));
        const duplicateTypesIndex = result.findIndex(item => sameMembers(item.types, types));
        if(duplicateTypesIndex === -1) {
            result.push({
                groups: [group],
                types: types
            });
        } else {
            result[duplicateTypesIndex].groups.push(group);
        }
        return result;
    }, []);
}

//-----------------------------------------------------------------------------------------------------------------------
// containsAll: Checks if array2 contains every single item in array1. Returns true if this is the case, otherwise false.
//-----------------------------------------------------------------------------------------------------------------------

function containsAll(array1, array2) {
    return array1.every(item => array2.includes(item));
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
// sameMembers: Checks if array1 and array2 has the exact same members (not necessarily same position of items). Returns true if this is the case, otherwise false.
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

function sameMembers(array1, array2) {
    return containsAll(array1, array2) && containsAll(array2, array1);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// getTextareaText: Parsing an array of objects where each object contains a text property, adding a new line after each text object excpet the last row and returns textarea content in plain text.
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// getTextareaArray: Converts passed textarea plain text into an array of objects each with a text property. The plain text is splitted by possible separators and the correct part is selected by passed index.
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function getTextareaArray(element, index) {
    const objectText = element.value.split(separators.textarea);
    const indexTextLines = objectText[index].split("\n");
    return indexTextLines.map(text => ({"text": text}));
}

//------------------------------------------------------------------------------------------------------------------------------------------------
// setGlobalSelections: Used when the global appearance menu is opened to select the correct options in selects based on stored global properties.
//------------------------------------------------------------------------------------------------------------------------------------------------

function setGlobalSelections() {
    const groups = getGroupsByTypes([-1]);
    groups.forEach(group => {
        const select = group.querySelector("select");
        if(select !== null) {
            const access = select.dataset.access.split(".");
            setSelectedOption(select, settings[access[0]][access[1]]);
        }
    });
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setGlobalProperties: Used when the global appearance menu is submitted to set the global properties to the newly selected properties. Also updates each existing object in the diagram to the new properties.
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setGlobalProperties() {
    const groups = getGroupsByTypes([-1]);
    groups.forEach(group => {
        const element = group.querySelector("select, input:not([type='submit'])");
        if(element !== null) {
            const access = element.dataset.access.split(".");
            settings[access[0]][access[1]] = element.value;
            diagram.forEach(object => object[access[0]][access[1]] = element.value);
        }
    });
    updateGraphics();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setSelections: Used for each selected object when the normal appearance menu is opened to select the correct options in selects based on the properties in the passed object.
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setSelections(object) {
    const groups = getGroupsByTypes([object.symbolkind || 0]);

    groups.forEach(group => {
        const elements = group.querySelectorAll("select, input[type='checkbox']");
        elements.forEach(element => {
            const access = element.dataset.access.split(".");
            if(element.tagName === 'SELECT') {
                let value = "";
                if(access.length === 1) {
					value = object[access[0]];
                } else if(access.length === 2) {
                    value = object[access[0]][access[1]];
                }
                setSelectedOption(element, value);
            } else {
                if(element.id == "commentCheck") {
                    element.checked = object[access[0]][access[1]];
                }
            }
        });
    });
}


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// setSelectedObjectsProperties: Used when a input/select/textarea is changed in the normal appearance form, to update all selected objects according to the new properties.
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function setSelectedObjectsProperties(element) {
    const types = element.parentNode.dataset.types.split(",");
    let textareaIndex = 0;
    let nameIndex = 0;

    //Using global array populated with objects when form is loaded to prevent selected objects that are locked
    appearanceObjects.forEach(object => {
        if((types.includes((object.symbolkind || 0).toString()))) {
            const access = element.dataset.access.split(".");
            if(element.nodeName === "TEXTAREA") {
                if(isNumberOfSeparatorsEqual(element, separators.textarea)) {
                    object[access[0]] = getTextareaArray(element, textareaIndex);
                }
                textareaIndex++;
            } else if(element.type === "range") {
                object[access[0]] = element.value / 100;
            } else if(access[0] === "cardinality") {
                object[access[0]][access[1]] = element.value;
                if(element.value === "None") {
                    object[access[0]][access[1]] = "";
                }
            } else if(element.id == "commentCheck") {
                object[access[0]][access[1]] = element.checked;
            } else if(element.id === "name") {
                if(isNumberOfSeparatorsEqual(element, separators.input)) {
                    object[access[0]] = element.value.split(separators.input)[nameIndex].trim();
                }
                nameIndex++;
            } else if(access.length === 1) {
                object[access[0]] = element.value;
            } else if(access.length === 2) {
                object[access[0]][access[1]] = element.value;
            }
        }
    });

    //Special case after change of name element to change UML line direction according to names in name element
    if(element.id === "name") {
        const umlLineExists = appearanceObjects.some(object => object.symbolkind === symbolKind.umlLine);
        if(umlLineExists) {
            const indexes = getSelectedObjectsMaxIndexes(appearanceObjects);
            const lineDirectionElement = document.getElementById("lineDirection");
            [...lineDirectionElement.options].forEach(option => option.text = "");
            appearanceObjects.forEach(object => {
                if(object.symbolkind === symbolKind.umlLine) {
                    setLineDirectionElementUML(object, indexes[symbolKind.umlLine]);
                }
            });
        }
    }

    updateGraphics();
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// isNumberOfSeparatorsEqual: Takes the passed element's current value and compares it to the element's original value based on separator occurances. Sets original value to the current value if number of separators are equal (return true), otherwise sets current value to original value (return false).
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function isNumberOfSeparatorsEqual(element, separator) {
    const numberOfSeparators = (element.value.match(new RegExp(separator, "g")) || []).length;
    const originalNumberOfSeparators = (element.dataset.originalvalue.match(new RegExp(separator, "g")) || []).length;
    if(numberOfSeparators === originalNumberOfSeparators) {
        element.dataset.originalvalue = element.value;
        return true;
    } else {
        element.value = element.dataset.originalvalue;
        return false;
    }
}

//Stores which element the mouse was pressed down on while in the appearance menu.
let appearanceMouseDownElement = null;

//Stores a copy of the appearance form HTML-element with its childnodes
let originalAppearanceForm = null;

//-------------------------------------------------------------------------------
// initAppearanceForm: Sets correct eventlisteners to the existing form elements.
//-------------------------------------------------------------------------------

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
                element.addEventListener("input", () => setSelectedObjectsProperties(element));
            } else if(element.tagName === "SELECT") {
                element.addEventListener("change", () => setSelectedObjectsProperties(element));
            }
        });
    });

    const submitButton = document.querySelector("#appearanceButtonContainer .submit-button");
    submitButton.addEventListener("click", submitAppearanceForm);

    const appearanceContainer = document.getElementById("appearance");
    appearanceContainer.addEventListener("mousedown", e => appearanceMouseDownElement = e.target);
    appearanceContainer.addEventListener("mouseup", e => {
        if(appearanceMouseDownElement === appearanceContainer && e.target === appearanceContainer) {
            toggleApperanceElement();
        }
    });

    originalAppearanceForm = document.getElementById("appearanceForm").cloneNode(true);
}

//------------------------------------------------------------------------------------------------------------------------
// getGroupsByTypes: Returns all form-groups that has a type included in the passed array in its data-attribute for types.
//------------------------------------------------------------------------------------------------------------------------

function getGroupsByTypes(typesToShow) {
    const formGroups = document.querySelectorAll("#appearanceForm .form-group");
    return [...formGroups].filter(group => {
        const types = group.dataset.types.split(",");
        return typesToShow.some(type => types.includes(type.toString()));
    });
}

//----------------------------------------------------------------------------------------
// submitAppearanceForm: Submits appearance form, saving state and closes appearance menu.
//----------------------------------------------------------------------------------------
function submitAppearanceForm() {
    if(globalappearanceMenuOpen) {
        setGlobalProperties();
    }
    SaveState();
    toggleApperanceElement();
}
//----------------------------------------------------------------------------------------
// createlayer: Used for createing a layer menu span as well store unique layer ID.
//----------------------------------------------------------------------------------------
function createLayer(){
    const parentNode = document.getElementById("viewLayer");
    const spans = parentNode.getElementsByTagName('span');
    const newDiv = document.createElement("div");
    const newSpan = document.createElement("span");
    const activeLayer = document.getElementById("layerActive");
    let id =0; // used to allocate a layer ID to each layer
    let layerArray = [];
    //Forloop returns current amount of layers
    for(let i = 0; i < spans.length; i++){
        layerArray.push(spans[i]);
        id++;
    }
    id++;
    //If there is ten or less layers, create a layer
    if(id <= 10){
        newDiv.className = "drop-down-item";
        newDiv.setAttribute("tabindex", "0");
        parentNode.appendChild(newDiv);

        newSpan.className = "notActive drop-down-option drop-down-option-hover";
        newSpan.id ="Layer_" +id;
        newSpan.innerHTML = valueArray[id];
        newSpan.setAttribute("onclick", "toggleBackgroundLayer(this)");
        newDiv.appendChild(newSpan);
        localStorage.setItem('layerItems', id);
    }
    let activeDropdown = parentNode.cloneNode(true)     //copy view layer and paste it to active layer.
    activeLayer.innerHTML ="";
    activeLayer.appendChild(activeDropdown);
    fixWriteToLayer();                                  // Fixes issues related to pasting viewing layer to active layer
    addLayersToApperence(id);                           // adds layer to apperance menu
}
//----------------------------------------------------------------------------------------
// loadLayer: Uses LocalStorage to load layers and acitve layers from LocalStorage
// localStorageID -> number of created layers from previoues sessions
//----------------------------------------------------------------------------------------
function loadLayer(localStorageID){
    const parentNode = document.getElementById("viewLayer");
    const spans = parentNode.getElementsByTagName('span');
    const activeLayer = document.getElementById("layerActive");
    addLayersToApperence(localStorageID)
    let layerArray = [];

    for(let i = 2; i <= localStorageID; i++){
        const newDiv = document.createElement("div");
        const newSpan = document.createElement("span");
        layerArray.push(spans[i]);

        newDiv.className = "drop-down-item";
        newDiv.setAttribute("tabindex", "0");
        parentNode.appendChild(newDiv);

        newSpan.className = "notActive drop-down-option drop-down-option-hover";
        newSpan.id = "Layer_"+i;
        newSpan.innerHTML = valueArray[i];
        newSpan.setAttribute("onclick", "toggleBackgroundLayer(this)");
        newDiv.appendChild(newSpan);
        getActiveViewlayers = JSON.parse(localStorage.getItem("activeLayers") || 0);
        if (getActiveViewlayers != 0){                  // If newSpan id is same as what stored as a active layer in localStorage, activate this span
            if(getActiveViewlayers.indexOf(newSpan.id) !== -1){
                newSpan.classList.add("isActive");
                newSpan.classList.remove("notActive");
                showLayer.push(newSpan.id);
            } 
        }
    }
    let activeDropdown = parentNode.cloneNode(true)     // Copy view layer and paste it to active layer.
    activeLayer.innerHTML ="";
    activeLayer.appendChild(activeDropdown);
    fixWriteToLayer();                                  // Fixes issues related to pasting viewing layer to active layer
}
//----------------------------------------------------------------------------------------
// toggleBackgroundLayer: Uses to indicate for uses which view layers are activated.
// Object -> Span clickt on
// changelayer -> only true when executed from function setLayer
//----------------------------------------------------------------------------------------
function toggleBackgroundLayer (object, changeLayer){
    if (changeLayer == true){                           // Checks if active layer is already active, prevents the user from never have a active write to layer
        if (object.classList.contains("notActive")){
            object.classList.remove("notActive");
            object.classList.add("isActive");
            showLayer.push(object.id);
        }
        return
    }
    if(object.classList.contains("notActive")){
        object.classList.remove("notActive");
        object.classList.remove("drop-down-option-hover");
        object.classList.add("isActive");
        activeLocalStorage()
        showLayer.push(object.id);
    }
    else {
        object.classList.remove("isActive");
        object.classList.add("notActive");
        object.classList.add("drop-down-option-hover");
        activeLocalStorage();
        const index = showLayer.indexOf(object.id);
        showLayer.splice(index, 1);
    }
    updateGraphics();
}
//----------------------------------------------------------------------------------------
// activeLocalStorage: Use for storeing layers in localStorage
//----------------------------------------------------------------------------------------
function activeLocalStorage(){
    const parentNode = document.getElementById("viewLayer");
    const spans = parentNode.getElementsByTagName('span');
    let storageArrayID = [];

    for(let i = 0; i < spans.length; i++){
        if(spans[i].classList.contains("isActive")){
            storageArrayID.push(spans[i].id);
        }
    }
    let sendingToStorage = JSON.stringify(storageArrayID);
    localStorage.setItem("activeLayers", sendingToStorage);
}
//----------------------------------------------------------------------------------------
// fixWriteToLayer: Use for fixing issue related to copy viewing layer
//----------------------------------------------------------------------------------------
function fixWriteToLayer(){

    const update = document.getElementById("layerActive");
    const spans = update.getElementsByTagName('span')
    const active = localStorage.getItem("writeToActiveLayers");

    for(let i = 0; i < spans.length; i++){                      // re-draws layerActive
        spans[i].id = spans[i].id+"_Active";
        spans[i].setAttribute("onclick", "toggleActiveBackgroundLayer(this)");
        if (spans[i].id == active) {
            spans[i].className = "isActive drop-down-option drop-down-option-hover";
        }
        else if (active == null){
            spans[0].className = "isActive drop-down-option drop-down-option-hover";
        }
        else {
            spans[i].className = "notActive drop-down-option drop-down-option-hover";
        }
    }
}
//----------------------------------------------------------------------------------------
// toggleActiveBackgroundLayer: Use then toggleing layerActive elements.
// object -> layer being activated
//----------------------------------------------------------------------------------------
function toggleActiveBackgroundLayer(object) {
    const checkActive = document.getElementById("layerActive");
    const spans = checkActive.getElementsByTagName('span')
    
    for (let i = 0 ; i < spans.length; i++){
        if(spans[i].classList.contains("isActive")){
            spans[i].classList.remove("isActive");
            spans[i].classList.add("notActive");
            spans[i].classList.add("drop-down-option-hover");
        }

        if(object.id == spans[i].id){
            object.classList.remove("notActive");
            object.classList.add("isActive");
            object.classList.remove("drop-down-option-hover");
            localStorage.setItem("writeToActiveLayers", object.id);
            setlayer(object);
            reWrite();
            activeLocalStorage();
        }
    }
    updateGraphics();
}
//--------------------------------------------------------------------------------------------------
// toggleActiveBackgroundLayer: Use then toggleing layerActive elements. sets layer being drawn to
// object -> layer selected
//--------------------------------------------------------------------------------------------------
function setlayer(object){
    let fixID = object.id.replace('_Active','');
    const toggleview = document.getElementById(fixID);
    toggleBackgroundLayer(toggleview, true)
    writeToLayer = fixID;                                   // Sets value to draw elements to
    let fixColor = fixID.replace('Layer_','');

    settings.properties.strokeColor = colorArray[fixColor-1]; // Sets object border-color depending on layer
}
//----------------------------------------------------------------------------------------
// addLayersToApperence: Use to update apperance menu.
// localStorageID -> Total amount of layers
//----------------------------------------------------------------------------------------
function addLayersToApperence(localStorageID){
    const select = document.getElementById("objectLayer");
    select.innerHTML = "";

    for(let i = 1; i <= localStorageID; i++) {
        const option = document.createElement("option");
        option.text = `Layer ${i}`;
        option.value = `Layer_${i}`;
        select.add(option);
    }
    initAppearanceForm()
}
//----------------------------------------------------------------------------------------
// getcorrectlayer: gets layer in localStorage if it exist else return layer_1
//----------------------------------------------------------------------------------------
function getcorrectlayer(){
    if(localStorage.getItem('writeToActiveLayers') != null){
        const getLayer = localStorage.getItem("writeToActiveLayers")
        let fixID = getLayer.replace('_Active','');
        return fixID;
    }
    return "Layer_1";
}
//----------------------------------------------------------------------------------------
// deleteLayerView: Deletes selected elements in view layers drop-down menu
//----------------------------------------------------------------------------------------
function deleteLayerView(){

    let parentNode = document.getElementById("viewLayer");
    let spans = parentNode.getElementsByTagName('span');
    let deleteArray = []

    //Loops through Diagram and adds any object that exist with a layer that are targeted for deletion 
    for(let i = 0;i < diagram.length;i++){
        if(showLayer.indexOf(diagram[i].properties.setLayer) !== -1){
            deleteArray.push(diagram[i]);
        }
    }
    // Deletes all object with deleteArray
    for(let i = 0; i < deleteArray.length;i++){
        diagram.deleteObject(deleteArray[i]);
    }
    // deletes elements from drop-down menus
    for(let i = 0; i < showLayer.length; i++){
        let deleteLayer = document.getElementById(showLayer[i]).parentNode;
        deleteLayer.parentNode.removeChild(deleteLayer);
        deleteLayer = document.getElementById(showLayer[i]+"_Active").parentNode;
        deleteLayer.parentNode.removeChild(deleteLayer);
    }
    showLayer = [];
    fixviewLayer();
    fixActiveLayer()
    SaveState()
    if(spans.length < 1){
        createLayer();
        toggleActiveBackgroundLayer(document.getElementById("Layer_1_Active"));
        setlayer(spans[0]);
    }
}
//----------------------------------------------------------------------------------------
// deleteLayerView: Deletes selected elements in layerActive drop-down menu
//----------------------------------------------------------------------------------------
function deleteLayerActive(){
    const parentNode = document.getElementById("layerActive");
    const spans = parentNode.getElementsByTagName('span');
    let saveIndex;                                  // used for deleteing corresponding layer in view layer drop-down
    let deleteArray = []
    if(spans.length > 1){
        for(let i = 0; i < spans.length;i++){
            if(spans[i].classList.contains("isActive")){
                let deleteLayer = spans[i].parentNode;
                saveIndex = spans[i].id.replace('_Active','');
                deleteLayer.parentNode.removeChild(deleteLayer);
            }
        }
        for(let i = 0;i < diagram.length;i++){
            if(saveIndex.indexOf(diagram[i].properties.setLayer) !== -1){
                deleteArray.push(diagram[i]);
            }
        }
        for(let i = 0; i < deleteArray.length;i++){
            diagram.deleteObject(deleteArray[i]);
        }
        const elem = document.getElementById(saveIndex);
        elem.parentNode.removeChild(elem);
        fixviewLayer();
        fixActiveLayer()
        SaveState()
        setlayer(spans[0]);
        toggleActiveBackgroundLayer(spans[0])
    }

}
//----------------------------------------------------------------------------------------
// fixviewLayer: Corrects viewlayer after layers been deleted.
//----------------------------------------------------------------------------------------
function fixviewLayer(){
    const parentNode = document.getElementById("viewLayer");
    const spans = parentNode.getElementsByTagName('span');

    localStorage.setItem('layerItems', spans.length);
    for(let i = 1; i <= spans.length;i++){
        let correctSpan = spans[i-1];
        correctSpan.innerHTML = valueArray[i];
        for(let j = 0; j < diagram.length;j++){
            if(diagram[j].properties.setLayer == spans[i-1].id){
                diagram[j].properties.setLayer = "Layer_"+ i;
            }
        }
        correctSpan.id = "Layer_" + i;
    }
}
//----------------------------------------------------------------------------------------
// fixviewLayer: Corrects layeractive after layers been deleted.
//----------------------------------------------------------------------------------------
function fixActiveLayer(){
    const parentNode = document.getElementById("layerActive");
    const spans = parentNode.getElementsByTagName('span');
    let checkforActive = false;

    localStorage.setItem('layerItems', spans.length);
    for(let i = 1; i <= spans.length;i++){
        let correctSpan = spans[i-1];
        correctSpan.innerHTML = valueArray[i];
        for(let j = 0; j < diagram.length;j++){
            if(diagram[j].properties.setLayer == spans[i-1].id){
                diagram[j].properties.setLayer = "Layer_"+ i;
            }
        }
        correctSpan.id = "Layer_" + i +"_Active";
    }
}
//----------------------------------------------------------------------------------------
// getCorrectValueArray: returns active layer to developers tools.
//----------------------------------------------------------------------------------------
function getCorrectValueArray(){
    const parentNode = document.getElementById("layerActive");
    const spans = parentNode.getElementsByTagName('span');
    const updateToolbar = document.getElementById("activeLayerinToolbar"); // element in developers toolbar
    for(let i = 0; i <spans.length;i++){
        if(spans[i].classList.contains("isActive")){
            return spans[i].innerHTML;
        }
    }
}
//----------------------------------------------------------------------------------------
// fixExampleLayer: Sorts diagram to correct layer after example diagram has been imported.
//----------------------------------------------------------------------------------------
function fixExampleLayer(){
    for(let i = 0; i <diagram.length;i++){
        diagram[i].properties.setLayer = writeToLayer;
    }
    updateGraphics();
    //SaveState(); // This save breaks the undo functionality right now
}
//A check if line should connect to a object when loose line is released inside a object
function canConnectLine(startObj, endObj){
    var okToMakeLine = false;
    if (startObj.symbolkind != symbolKind.line && symbolEndKind != symbolKind.line && startObj.symbolkind != symbolKind.text && symbolEndKind != symbolKind.text) {
            symbolEndKind = endObj.symbolkind;
            okToMakeLine = true;
            // Can't be more than two lines between an entity and a relation
            if ((startObj.symbolkind == symbolKind.erEntity && symbolEndKind == symbolKind.erRelation)
            || (startObj.symbolkind == symbolKind.erRelation && symbolEndKind == symbolKind.erEntity)) {
                if ((endObj.connectorCountFromSymbol(startObj) > 1)
                || (startObj.connectorCountFromSymbol(endObj) > 1)) {
                    okToMakeLine = false;
                    flash("A max of two lines can be drawn between these objects", "danger");
                }
            }
            //Can't draw line between two entities
            if(startObj.symbolkind == symbolKind.erEntity && endObj.symbolkind == symbolKind.erEntity){
                okToMakeLine = false;
                flash("Can not draw line between two ER-entities", "danger");
            }
            //Can't draw line between two relationships
            if(startObj.symbolkind == symbolKind.erRelation && endObj.symbolkind == symbolKind.erRelation){
                okToMakeLine = false;
                flash("Can not draw line between two ER-relations", "danger");
            }

            if(endObj.symbolkind == symbolKind.uml){
                okToMakeLine = false;
                flash("Can not draw ER-line to UML-objects", "danger");
            }
       
            // Can't be more than one line if not relation to entity
            else {
                if ((startObj.symbolkind != symbolKind.erRelation && symbolEndKind != symbolKind.erRelation)
                || startObj.symbolkind == symbolKind.erAttribute || symbolEndKind == symbolKind.erAttribute) {
                    if ((endObj.connectorCountFromSymbol(startObj) > 0)
                    || (startObj.connectorCountFromSymbol(endObj) > 0)) {
                        okToMakeLine = false
                        flash("Can not draw multiple lines between these objects", "danger");
                    }
                }
            }
        }
        else if(endObj == startObj){
            okToMakeLine = false;
            flash("Can not draw line between the same object", "danger");
        }

    return okToMakeLine;
}

//--------------------------------------------------------------------------------------
// createRulers: Creates rulers for x and y axis.
//-----------------------------------------------

function createRulers() {
    if(!isRulersActive) return;
    createRuler(document.querySelector("#ruler-x .ruler-lines"), canvas.width, origoOffsetX, "marginLeft");
    createRuler(document.querySelector("#ruler-y .ruler-lines"), canvas.height, origoOffsetY, "marginTop");
    createRulerLinesObjectPoints();
}

//------------------------------------------------------------------------------
// setRulerMouseLinesPosition: Move rulers mouse position lines to passed value.
//------------------------------------------------------------------------------

function setRulerMouseLinesPosition(x, y) {
    document.querySelector("#ruler-x .ruler-extra-lines .mouse-line").style.left = `${x}px`;
    document.querySelector("#ruler-y .ruler-extra-lines .mouse-line").style.top = `${y}px`;
}

//--------------------------------------------------------------------------------------
// createRuler: Fills the passed ruller container with lines according to passed length.
//--------------------------------------------------------------------------------------

function createRuler(element, length, origoOffset, marginProperty) {
    const from = Math.round(-origoOffset);
    const to = Math.round(length - origoOffset);

    const steps = {};
    steps.mini = 5;
    steps.small = steps.mini * 2;
    steps.big = Math.round((steps.mini * steps.small) * zoomValue);
    
    if(zoomValue <= 0.7 && zoomValue >= 0.5) {
        steps.big *= 2;
    } else if(zoomValue <= 0.4 && zoomValue >= 0.3) {
        steps.big *= 4;
    } else if(zoomValue <= 0.2) {
        steps.big *= 8;
    }

    element.innerHTML = "";

    for(let i = from; i < to; i++) {
        if(i % steps.big === 0 || i % steps.small === 0 || i % steps.mini === 0) {
            const line = document.createElement("div");
            line.classList.add("ruler-line");
            line.style[marginProperty] = `${steps.mini - 1}px`;
            if(i % steps.big === 0) {
                line.classList.add("big");
                line.innerText = Math.round(i / zoomValue);
            } else if(i % steps.small === 0) {
                line.classList.add("small");
            } else if(i % steps.mini === 0) {
                line.classList.add("mini");
            }
            element.appendChild(line);
        }
    }
}

//-------------------------------------------------------------------------------------
// createRulerLinesObjectPoints: Creates lines on ruler for all selected object points.
//-------------------------------------------------------------------------------------

function createRulerLinesObjectPoints() {
    //Remove all current point liens
    document.querySelectorAll(".point-line").forEach(element => element.remove());

    if(!isRulersActive || selected_objects.length < 1) return;

    const rulerExtraLinesX = document.querySelector("#ruler-x .ruler-extra-lines");
    const rulerExtraLinesY = document.querySelector("#ruler-y .ruler-extra-lines");

    //Get an array of points used by all selected objects
    const selectedPoints = getSelectedObjectsPoints();

    selectedPoints.forEach(point => {
        const canvasCoordinate = pixelsToCanvas(point.x, point.y);
        const lineX = document.createElement("div");
        const lineY = document.createElement("div");

        lineX.classList.add("point-line");
        lineY.classList.add("point-line");

        lineX.style.left = `${canvasCoordinate.x}px`;
        lineY.style.top = `${canvasCoordinate.y}px`;

        rulerExtraLinesX.appendChild(lineX);
        rulerExtraLinesY.appendChild(lineY);
    });
}

//------------------------------------------------------------------------------------
// getSelectedObjectsPoints: Returns unique points for all currently selected objects.
//------------------------------------------------------------------------------------

function getSelectedObjectsPoints() {
    const selectedPoints = selected_objects.reduce((set, object) => {
        object.getPoints().forEach(pointIndex => set.add(points[pointIndex]));
        return set;
    }, new Set());

    return [...selectedPoints];
}

//------------------------------------------------------------------------------------------------
// toggleRulers: Hides rulers if isRulersActive is true and shows them if isRulersActive is false.
//------------------------------------------------------------------------------------------------

function toggleRulers() {
    const diagramContent = document.getElementById("diagram-content");
    const rulers = document.querySelectorAll(".ruler");
    if(isRulersActive) {
        diagramContent.classList.remove("rulers-active");
        rulers.forEach(ruler => ruler.classList.add("hidden"));
    } else {
        diagramContent.classList.add("rulers-active");
        rulers.forEach(ruler => ruler.classList.remove("hidden"));
    }
    isRulersActive = !isRulersActive;
    setCheckbox($(".drop-down-option:contains('Rulers')"), isRulersActive);
    localStorage.setItem("isRulersActive", isRulersActive);
    canvasSize();
}

//------------------------------------------------------------------------------------------------------------------------
// setIsRulersActiveOnRefresh: Gets the isActiveRulers value from localStorage to decide if rulers should be shown or not.
//------------------------------------------------------------------------------------------------------------------------

function setIsRulersActiveOnRefresh() {
    const tempIsRulerActive = localStorage.getItem("isRulersActive");
    if(tempIsRulerActive !== null) {
        isRulersActive = !(tempIsRulerActive === "true");
        toggleRulers();
    }
}

function getOrigoOffsetX() {
    return origoOffsetX;
}

function getOrigoOffsetY() {
    return origoOffsetY;
}