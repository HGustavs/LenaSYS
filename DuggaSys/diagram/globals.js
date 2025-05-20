//#region OBJECT_ARRAYS

/**
 * @description Array of all elements.
 * @type {Object[]}
 */
var data = [];

/**
 * @description Array of all lines.
 * @type {Object[]}
 */
var lines = [];

/**
 * @description Array of all elements with an error. Used in functions from ./errorHandling.js
 * @type {Object[]}
 */
var errorData = [];

/**
 * @description Array of currently selected elements.
 * @type {Object[]}
 */
var context = [];

/**
 * @description Array of elements selected before a new box selection is initated.
 * @type {Object[]}
 */
var previousContext = [];


/**
 * @description Array of currently selected lines.
 * @type {Object[]}
 */
var contextLine = [];


/**
 * @description Array of lines selected before a new box selection is initated.
 * @type {Object[]}
 */
var previousContextLine = [];

/**
 * @description Array of line Labels.
 * @type {Object[]}
 */
var lineLabelList = [];

//#region HTML

/**
 * @description The html div that contains all elements.
 * @see cwidth
 * @see cheight
 * @see containerStyle
 */
var container;

/**
 * @description Size of the container. This should equal the entire size of the browser window minus the toolbar.
 * @see container
 */
var cwidth, cheight;

/**
 * @description The CSS style for the container. This is used when setting the mouse cursor icon.
 * @see container
 */
var containerStyle;

//#endregion
//#endregion
//#region OBJECT

/**
 * @description Faded element that follows the cursor when placing elements. Element is placed in data array AFTER a mouseclick.
 * @see makeGhost
 * @type {?Element}
 */
var ghostElement = null;

/**
 * @description Line that follows the cursor when one of two targets for a line has been selected.
 * @type {?Object}
 */
var ghostLine = null;

/**
 * @description Stores the id and actual height of an element as the element.height propery doesnt consider resizing to fit text.
 * @see drawElement
 * @type {{id: number, height: number}[]}
 */
var UMLHeight = [], IEHeight = [], SDHeight = [], NOTEHeight = [];


/**
 * @description Global variable that checks if the browser window is sized for mobile screens (414px and less).
 * @type {boolean}
 */
var isMobile = false;

//#endregion
//#region MOUSE

/**
 * @description Postition of the mouse cursor. Updates on move.
 * @type {Point}
 */
var lastMousePos = new Point(0, 0);

/**
 * @description If a mouse button is currently held down. Used to identify a long press which can open a submenu.
 * @see holdPlacementButtonDown
 * @see holdPlacementButtonUp
 * @type {boolean}
 */
var mousePressed;

/**
 * @description If a mouse button is currently held down. Used to change the cursor style.
 * @type {boolean}
 */
var mouseButtonDown = false;

/**
 * @description Keeps track of the cursor position from when a mousebutton is first pressed down.
 * @type {number}
 */
var startX, startY;

/**
 * @description Current input mode for the mouse cursor.
 * @type {number}
 */
var mouseMode = mouseModes.POINTER;

/**
 * @description The current state of the pointer. Used to determine what was clicked.
 * @see pointerStates
 * @type {number}
 */
var pointerState = pointerStates.DEFAULT;

/**
 * @description If currently moving an element
 * @type {boolean}
 */
var movingObject = false;

/**
 * @description If moving multiple elements
 * @type {boolean}
 */
var movingContainer = false;

/**
 * @description If the mouse is hovering an element.
 * @see mouseEnter
 * @see mouseLeave
 * @type {boolean}
 */
var mouseOverElement = false;

/**
 * @description If the mouse is hovering a line.
 * @see determineLineSelect
 * @type {boolean}
 */
var mouseOverLine = false;

/**
 * @description If line creation is in progress and line still follows cursor.
 * @see drawLine
 * @type {boolean}
 */
var isCurrentlyDrawing = true;

//#region DOUBLE_CLICK

/**
 * @description Last time a mouse button was pressed. Used to determine double clicking.
 * @type {number}
 */
var dblPreviousTime = new Date().getTime();

/**
 * @description Double click happens if mouse clicks are within this interval. Measured in miliseconds(ms).
 * @type {number}
 */
var dblClickInterval = 350;

/**
 * @description If a double click was performed.
 * @type {boolean}
 */
var wasDblClicked = false;

//#endregion
//#region SELECTION

/**
 *
 * @description Last clicked object from the global array data. Consumed on use.
 * @see data
 * @type {?Object}
 */
var lastClickedElement = null;

/**
 * @description Last line(s) clicked.
 * @see determineLineSelect
 * @type {?}
 */
var determinedLines = null;

/**
 * @description If mouse has moved from its position between mouse press and release.
 * @see calculateDeltaExeeded
 * @see maxDeltaBeforeExeeded
 * @type {boolean}
 */
var deltaExceeded = false;

/**
 * @description Clicked element. Reset on mouse up event.
 * @type {?Object}
 */
var targetElement = null;

/**
 * @description Clicked label.
 * @type {?Object}
 */
var targetLabel = null;

/**
 * @description The type of the currently selected element.
 * @see elementTypes
 * @type {number}
 */
var elementTypeSelected = elementTypes.EREntity;

/**
 * @description The distance the currently selected element has moved on the X and Y axis.
 * @type {x: number, y: number}
 */
var targetDelta;

//#endregion
//#region BOX_SELECT

/**
 * @description Keeps track of the distance moved since the start of a box select.
 * @type {number}
 */
var deltaX = 0, deltaY = 0;

/**
 * @description Coordinate of the current selection. Used for mouse events when multiple objects are selected.
 * @type {number}
 */
var selectionBoxLowX, selectionBoxHighX, selectionBoxLowY, selectionBoxHighY;

/**
 * @description If currently using the box selection tool and holding down the mouse button.
 * @see boxSelect_End
 * @see boxSelect_Start
 * @type {boolean}
 */
var boxSelectionInUse = false;

//#endregion
//#endregion
//#region RESIZE

/**
 * @description The original position/size of an element before it is resized. Used to restore element if resize is invalid.
 * @type {number}
 */
var originalX = 0, originalY = 0, originalWidth = 0, originalHeight = 0;

/**
 * @description If the element being resized is overlapping another element.
 * @see entityIsOverlapping
 * @type {boolean}
 */
var resizeOverlapping = false;

/**
 * @description Saves the original size of an element when clicking a node. Used during element resizing with mouse cursor.
 * @type {number}
 */
var startWidth, startHeight;

/**
 * @description Used to tell which of the eight nodes is clicked. Used during resizing of an element.
 * @type {{left: boolean, downLeft: boolean, upLeft: boolean, downRight: boolean, right: boolean, up: boolean, down: boolean, upRight: boolean}}
 */
const startNode = {
    left: false,
    right: false,
    up: false,
    down: false,
    upLeft: false,
    upRight: false,
    downLeft: false,
    downRight: false,
};

//#endregion
//#region ZOOM

/**
 * @description Used to set zoomfact to a preset value. Calculated when centering the camera.
 * @see zoomfact
 * @see determineZoomfact
 * @type {number}
 */
var desiredZoomfact = 1.0;

/**
 * @description The current zoom level.
 * @type {number}
 */
var zoomfact = 1.0;

/**
 * @description Position of the camera in the diagram
 * @type {number}
 */
var scrollx = 100, scrolly = 100;

/**
 * @description Saved position of camera at start of move. Used to update camera when moving it with the mouse.
 * @see scrollx
 * @see scrolly
 * @type {number}
 */
var sscrollx, sscrolly;

/**
 * @description Position to zoom towards/from. Differes between buttons and mouse wheel.
 * @type {Point}
 */
var zoomOrigo = new Point(0, 0); // Zoom center coordinates relative to origo

/**
 * @description Used to restrict amount of zoom over time. Trackpad scrolling would zoom in very fast on default.
 * @see mwheel
 * @type {boolean}
 */
var zoomAllowed = true;

/**
 * @description Last position where a zoom event took place, relative to screen.
 * @type {Point}
 */
var lastZoomPos = new Point(0, 0);

/**
 * @description Last position where a zoom event took place, relative to diagram.
 * @type {Point}
 */
var lastMousePosCoords = new Point(0, 0);
// We found out that the relation between 0.125 -> 4 and 0.36->-64 looks like an X^2 equation.
// Zoom values for offsetting the mouse cursor positioning

//#endregion
//#region OPTIONS

/**
 * @description Flag indicating how options panel was opened.
 * @see toggleOptionsPane
 * @type {boolean}
 */
let userToggled = false;

/**
 * @description If the ER table should be shown over the the options pane.
 * @see toggleErTable
 * @see generateContextProperties
 * @type {boolean}
 */
var erTableToggle = false;

/**
 * @description If the test cases should be shown over the the options pane.
 * @see toggleTestCase
 * @see generateContextProperties
 * @type {boolean}
 */
var testCaseToggle = false;

/**
 * @description If error checking is enabled.
 * @see toggleErrorCheck
 * @type {boolean}
 */
var errorActive = false;

//#endregion
//#region DELETE

/**
 * @description Position of "X" in the upper right corner of selected element(s).
 * @type {number}
 */
let deleteBtnX = 0, deleteBtnY = 0;

/**
 * @description Size of "X" in the upper right corner of selected element(s).
 * @type {number}
 */
var deleteBtnSize = 0;

/**
 * @description Used to restrict deletion to currently selected objects.
 * @type {boolean}
 */
var canPressDeleteBtn = false;

/**
 * @description If the "X" in the upper right corner of selected element(s) has been clicked.
 * @see checkDeleteBtn
 * @type {boolean}
 */
var hasPressedDelete = false;

//#endregion
//#region KEY

/**
 * @description Used to determine if a button is held down.
 * @type {boolean}
 */
var ctrlPressed = false, altPressed = false, escPressed = false;

//#endregion

/**
 * @type {{grid: {a4SizeFactor: number, gridSize: number, origoWidth: number, snapToGrid: boolean}, ruler: {ZF: number, zoomY: number, zoomX: number, isRulerActive: boolean}, replay: {delay: number, timestamps: {}, active: boolean}, zoomPower: number, misc: {errorMsgMap: {}, randomidArray: *[]}}}
 */
var settings = {
    ruler: {
        ZF: 100 * zoomfact,
        zoomX: Math.round(((0 - zoomOrigo.x) * zoomfact) + (1.0 / zoomfact)),
        zoomY: Math.round(((0 - zoomOrigo.y) * zoomfact) + (1.0 / zoomfact)),
        isRulerActive: true,
    },
    grid: {
        gridSize: 80,
        origoWidth: 2,
        snapToGrid: false,
        a4SizeFactor: 1,
    },
    misc: {
        randomidArray: [], // array for checking randomID
        errorMsgMap: {},
    },
    zoomPower: 1 / 3,
    replay: {
        active: false,
        delay: 1,
        timestamps: {}
    }
};

/**
 * @description Used to see if still on the same resize, history will be overwritten so only the final size is saved. Mouse or keypress will reset counter.
 * @type {{inputCounter: number, hasUpdated: boolean}}
 */
const historyHandler = {
    inputCounter: 0
};

//#region EXTERNAL

// Data and html building variables
var str = "";
// Demo data - read / write from service later on
var cid = "";
var cvers = "";

/**
 * @description Settings to determine what tools should be shown on the toolbar. Used for duggor.
 * @see showDiagramTypes
 * @type {{SD: boolean, SE: boolean, UML: boolean, NOTE: boolean, IE: boolean, ER: boolean}}
 */
var diagramType = { ER: false, UML: false, IE: false, SD: false, SE: false, NOTE: false };
//#endregion
