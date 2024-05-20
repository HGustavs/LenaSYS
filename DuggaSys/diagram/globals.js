// Data and html building variables
var service = [];
var str = "";
var container;

// Interaction variables - unknown if all are needed
var deltaX = 0, deltaY = 0, startX, startY;
var sscrollx, sscrolly;
var cwidth, cheight;
var deleteBtnX = 0, deleteBtnY = 0;
var deleteBtnSize = 0;
var canPressDeleteBtn = false;
var startWidth;
var startHeight;
var startNodeLeft = false;
var startNodeRight = false;
var startNodeDown = false;
var startNodeUp = false;
var startNodeUpRight = false;
var startNodeUpLeft = false;
var startNodeDownRight = false;
var startNodeDownLeft = false;
var containerStyle;
var lastMousePos = new Point(0, 0);
var dblPreviousTime = new Date().getTime(); // Used when determining if an element was doubleclicked.
var dblClickInterval = 350; // 350 ms = if less than 350 ms between clicks -> Doubleclick was performed.
var wasDblClicked = false;
var targetDelta;
var mousePressed;
var erTableToggle = false; //Used only in toggleErTable() and generateContextProperties().
var testCaseToggle = false;
var selectionBoxLowX;
var selectionBoxHighX;
var selectionBoxLowY;
var selectionBoxHighY;
var lastClickedElement = null;

var hasPressedDelete = false;
var mouseOverElement = false;
var mouseOverLine = false;

// Variable for drawing a line
var isCurrentlyDrawing = true;

// Variables for resizing
var originalWidth = 0;
var originalHeight = 0;
var originalX = 0;
var originalY = 0;
var resizeOverlapping = false;

// Zoom variables
var desiredZoomfact = 1.0;
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;
var zoomOrigo = new Point(0, 0); // Zoom center coordinates relative to origo
var zoomAllowed = true; // To slow down zoom on touchpad.
var lastZoomPos = new Point(0, 0); // placeholder for the previous zoom position relative to the screen (Screen position for previous zoom)
var lastMousePosCoords = new Point(0, 0); // placeholder for the previous mouse coordinates relative to the diagram (Coordinates for the previous zoom)
// We found out that the relation between 0.125 -> 4 and 0.36->-64 looks like an X^2 equation.
// Zoom values for offsetting the mouse cursor positioning

var errorActive = false;

// Arrow drawing stuff - diagram elements, diagram lines and labels
var lineLabelList = [];

// Currently clicked object list
var context = [];
var previousContext = [];
var contextLine = []; // Contains the currently selected line(s).
var previousContextLine = [];
var determinedLines = null; // Last calculated line(s) clicked.
var deltaExceeded = false;
const maxDeltaBeforeExceeded = 2;
var targetElement = null;
var targetElementDiv;
var targetLabel = null;

// Currently hold down buttons
var ctrlPressed = false;
var altPressed = false;
var escPressed = false;

// Box selection variables
var boxSelectionInUse = false;
var propFieldState = false;

// What kind of input mode that user is uing the cursor for.
var mouseMode = mouseModes.POINTER;
var mouseButtonDown = false;
var previousMouseMode;

// All different element types that can be placed by the user.
var elementTypeSelected = ELEMENT_TYPES.EREntity;
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;

//setting the base values for the allowed diagramtypes
var diagramType = {ER: false, UML: false, IE: false, SD: false, SE: false, NOTE: false};

//Grid Settings
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

// Demo data - read / write from service later on
var cid = "";
var cvers = "";

var data = []; // List of all elements in diagram
var lines = []; // List of all lines in diagram
var errorData = []; // List of all elements with an error in diagram
var UMLHeight = []; // List with UML Entities' real height
var IEHeight = []; // List with IE Entities' real height
var SDHeight = []; // List with SD Entities' real height
let hasResized = false; // checks if an element has been resized
var preResizeHeight = []; // List with elements' and their starting height for box selection due to problems with resizing height
var NOTEHeight = [];// List with NOTE Entities' real height

// Ghost element is used for placing new elements. DO NOT PLACE GHOST ELEMENTS IN DATA ARRAY UNTILL IT IS PRESSED!
var ghostElement = null;
var ghostLine = null;

// variables for resizing
const historyHandler = {
    hasUpdated: false,
    inputCounter: 0
}
