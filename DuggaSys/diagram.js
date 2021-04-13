
//------------------------------------=======############==========----------------------------------------
//                           Defaults, mouse variables and zoom variables
//------------------------------------=======############==========----------------------------------------

// Data and html building variables
var service = [];
var str = "";
var defs = "";

// Interaction variables - unknown if all are needed
var deltaX = 0, deltaY = 0, startX, startY;
var startTop, startLeft;
var sscrollx, sscrolly;
var cwidth, cheight;
var hasRecursion = false;
var startWidth;
var startNodeRight = false;

// Zoom variables
var zoomfact = 1.0;
var scrollx = 100;
var scrolly = 100;

// Constants
const elementwidth = 200;
const elementheight = 50;
const textheight = 18;
const strokewidth = 1.5;
const baseline = 10;
const avgcharwidth = 6;
const colors = ["white", "Gold", "#ffccdc", "yellow", "CornflowerBlue"];
const multioffs = 3;
// Zoom values for offsetting the mouse cursor positioning
const zoom1_25 = 0.36;
const zoom1_5 = 0.555;
const zoom2 = 0.75;
const zoom4 = 0.9375;
const zoom0_75 = -0.775;
const zoom0_5 = -3;
const zoom0_25 = -15.01;
const zoom0_125 = -64;

// Arrow drawing stuff - diagram elements and diagram lines
var lines = [];
var elements = [];

// Currently clicked object list
var context = [];
var deltaExceeded = false;
const maxDeltaBeforeExceeded = 2;

// Currently hold down buttons
var ctrlPressed = false;
var altPressed = false;
var escPressed = false;

// Box selection variables
var boxSelectionInUse = false;
var propFieldState = false;

// What kind of input mode that user is uing the cursor for.
const mouseModes = {
    POINTER: 0,
    BOX_SELECTION: 1,
    PLACING_ELEMENT: 2,
    EDGE_CREATION: 3,
};
var mouseMode = mouseModes.POINTER;

// All different element types that can be placed by the user.
const elementTypes = {
    NO_SELECTED: 0,
    ENTITY: 1,
    RELATION: 2,
    ATTRIBUTE: 3,
};
var elementTypeSelected = elementTypes.ENTITY;

const pointerStates = {
    DEFAULT: 0,
    CLICKED_CONTAINER: 1,
    CLICKED_ELEMENT: 2,
    CLICKED_NODE: 3,
};
var pointerState = pointerStates.DEFAULT;

var movingObject = false;
var movingContainer = false;

//-------------------------------------------------------------------------------------------------
// makeRandomID - Random hex number
//-------------------------------------------------------------------------------------------------

function makeRandomID()
{
    var str = "";
    var characters = 'ABCDEF0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++)
    {
        str += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return str;
}

// Example entities and attributes
var PersonID = makeRandomID();
var IDID = makeRandomID();
var NameID = makeRandomID();
var SizeID = makeRandomID();
var HasID = makeRandomID();
var CarID = makeRandomID();
var FNID = makeRandomID();
var LNID = makeRandomID();
var LoanID = makeRandomID();
var RefID = makeRandomID();

// Save default to model - updating defaults sets property to all of model
var defaults = {
    defaultERtentity: { kind: "EREntity", fill: "White", Stroke: "Black", width: 200, height: 50 },
    defaultERrelation: { kind: "ERRelation", fill: "White", Stroke: "Black", width: 60, height: 60 },
    defaultERattr: { kind: "ERAttr", fill: "White", Stroke: "Black", width: 90, height: 45 }
}

// Demo data - read / write from service later on
var data = [
    { name: "Person", x: 100, y: 100, width: 200, height: 50, kind: "EREntity", id: PersonID },
    { name: "Loan", x: 140, y: 250, width: 200, height: 50, kind: "EREntity", id: LoanID, isWeak: true },
    { name: "Car", x: 500, y: 140, width: 200, height: 50, kind: "EREntity", id: CarID },
    { name: "Owns", x: 420, y: 60, width: 60, height: 60, kind: "ERRelation", id: HasID },
    { name: "Refer", x: 460, y: 260, width: 60, height: 60, kind: "ERRelation", id: RefID, isWeak: true },
    { name: "ID", x: 30, y: 30, width: 90, height: 40, kind: "ERAttr", id: IDID, isComputed: true },
    { name: "Name", x: 170, y: 50, width: 90, height: 45, kind: "ERAttr", id: NameID },
    { name: "Size", x: 560, y: 40, width: 90, height: 45, kind: "ERAttr", id: SizeID, isMultiple: true },
    { name: "F Name", x: 120, y: -20, width: 90, height: 45, kind: "ERAttr", id: FNID },
    { name: "L Name", x: 230, y: -20, width: 90, height: 45, kind: "ERAttr", id: LNID },
];

var lines = [
    { id: makeRandomID(), fromID: PersonID, toID: IDID, kind: "Normal" },
    { id: makeRandomID(), fromID: PersonID, toID: NameID, kind: "Normal" },
    { id: makeRandomID(), fromID: CarID, toID: SizeID, kind: "Normal" },

    { id: makeRandomID(), fromID: PersonID, toID: HasID, kind: "Normal" },
    { id: makeRandomID(), fromID: HasID, toID: CarID, kind: "Double" },
    { id: makeRandomID(), fromID: NameID, toID: FNID, kind: "Normal" },
    { id: makeRandomID(), fromID: NameID, toID: LNID, kind: "Normal" },

    { id: makeRandomID(), fromID: LoanID, toID: RefID, kind: "Normal" },
    { id: makeRandomID(), fromID: CarID, toID: RefID, kind: "Normal" },
];

//------------------------------------=======############==========----------------------------------------
//                                        Key event listeners
//------------------------------------=======############==========----------------------------------------
document.addEventListener('keydown', function (e)
{
    if (e.key == "Control" && ctrlPressed !== true) ctrlPressed = true;
    if (e.key == "Alt" && altPressed !== true) altPressed = true;
    if (e.key == "Delete" && context.length > 0)  removeElements(context);
    if (e.key == "Meta" && ctrlPressed != true) ctrlPressed = true;
    if (e.key == "-" && ctrlPressed) zoomin(); // Works but interferes with browser zoom
    if (e.key == "+" && ctrlPressed) zoomout(); // Works but interferes with browser zoom
    if (e.key == "Escape" && escPressed != true){
        escPressed = true;
        context = [];
        if (movingContainer){
            scrollx = sscrollx;
            scrolly = sscrolly;
        }
        pointerState = pointerStates.DEFAULT;
        showdata();
    }
    if (e.key == "Backspace" && context.length > 0 && !propFieldState) removeElements(context);
});

document.addEventListener('keyup', function (e)
{
    if (e.key == "Control") ctrlPressed = false;
    if (e.key == "Alt") altPressed = false;
    if (e.key == "Meta") ctrlPressed = false;
    if (e.key == "Escape"){
        escPressed = false;
    }
    if (e.key == "b") setMouseMode(mouseModes.BOX_SELECTION);
    if (e.key == "m") setMouseMode(mouseModes.POINTER);
    if (e.key == "d") setMouseMode(mouseModes.EDGE_CREATION);

    if (e.key == "e"){
        setMouseMode(mouseModes.PLACING_ELEMENT); 
        setElementPlacementType(0);
    }
    if (e.key == "r"){
        setMouseMode(mouseModes.PLACING_ELEMENT); 
        setElementPlacementType(1);
    }
    if (e.key == "a"){
        setMouseMode(mouseModes.PLACING_ELEMENT); 
        setElementPlacementType(2);
    }
});

//------------------------------------=======############==========----------------------------------------
//                              Coordinate-Screen Position Conversion
//------------------------------------=======############==========----------------------------------------

function screenToDiagramCoordinates(mouseX, mouseY)
{
    // I guess this should be something that could be calculated with an expression but after 2 days we still cannot figure it out.
    // These are the constant values that the expression should spit out anyway. If you add more zoom levels please do not come to us.
    // We're tired.

    // We found out that the relation between 0.125 -> 4 and 0.36->-64 looks like an X^2 equation.
    var zoomX = 0;

    // ZOOM IN
    if (zoomfact == 1.25) zoomX = zoom1_25;
    if (zoomfact == 1.5) zoomX = zoom1_5;
    if (zoomfact == 2) zoomX = zoom2;
    if (zoomfact == 4) zoomX = zoom4;

    // ZOOM OUT
    if (zoomfact == 0.75) zoomX = zoom0_75;
    if (zoomfact == 0.5) zoomX = zoom0_5;
    if (zoomfact == 0.25) zoomX = zoom0_25;
    if (zoomfact == 0.125) zoomX = zoom0_125;

    return {
        x: Math.round(
            ((mouseX - 0) / zoomfact - scrollx) + zoomX * scrollx + 2 // the 2 makes mouse hover over container
        ),
        y: Math.round(
            ((mouseY - 86) / zoomfact - scrolly) + zoomX * scrolly
        ),
    };
}

// TODO : This is still the old version, needs update
function diagramToScreenPosition(coordX, coordY)
{
    return {
        x: Math.round((coordX + scrollx) / zoomfact + 0),
        y: Math.round((coordY + scrolly) / zoomfact + 86),
    };
}

//------------------------------------=======############==========----------------------------------------
//                                           Mouse events
//------------------------------------=======############==========----------------------------------------
function mwheel(event){
    if(event.deltaY < 0)
    {
        zoomin();
    }
    else
    {
        zoomout();
    }
}

function mdown(event)
{
    // React to mouse down on container
    if (event.target.id == "container")
    {
        switch (mouseMode)
        {
            case mouseModes.POINTER:
                pointerState = pointerStates.CLICKED_CONTAINER;
                sscrollx = scrollx;
                sscrolly = scrolly;
                startX = event.clientX;
                startY = event.clientY;
                break;
            
            case mouseModes.BOX_SELECTION:
                boxSelect_Start(event.clientX, event.clientY);
                break;

            default:
                break;
        }
        
    }
    else if(event.target.classList.contains("node")){
        pointerState = pointerStates.CLICKED_NODE;
        startWidth = data[findIndex(data, context[0].id)].width;

        startNodeRight = !event.target.classList.contains("mr");

        startX = event.clientX;
        startY = event.clientY;
    }
}

function ddown(event)
{
    switch (mouseMode) {
        case mouseModes.POINTER:
        case mouseModes.BOX_SELECTION:
        case mouseModes.PLACING_ELEMENT:
        case mouseModes.EDGE_CREATION:
            startX = event.clientX;
            startY = event.clientY;
            pointerState = pointerStates.CLICKED_ELEMENT;

            var element = data[findIndex(data, event.currentTarget.id)];
            if (element != null && !context.includes(element) || !ctrlPressed)
            {
                updateSelection(element, null, null);
            }
            break;
    
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in ddown()!`);
            break;
    }
}

function mouseMode_onMouseUp(event)
{
    console.log("mouseup");
    switch (mouseMode) {
        case mouseModes.PLACING_ELEMENT:
            var mp = screenToDiagramCoordinates(event.clientX, event.clientY);
            var entityType = constructElementOfType(elementTypeSelected);

            data.push({
                name: entityType.name,
                x: mp.x - (entityType.data.width * 0.5),
                y: mp.y - (entityType.data.height * 0.5),
                width: entityType.data.width,
                height: entityType.data.height,
                kind: entityType.data.kind,
                id: makeRandomID()
            });
            showdata()
            break;

        case mouseModes.EDGE_CREATION:
            console.log(context.length, mouseMode);
            if (context.length > 1)
            {
                console.log("CREATE EDGE");
                lines.push({ 
                    id: makeRandomID(), 
                    fromID: context[0].id, 
                    toID: context[1].id, 
                    kind: "Normal" 
                });
                context = [];
                updatepos(0,0);
            }

            break;

        case mouseModes.BOX_SELECTION:
            boxSelect_End();
            break;

        case mouseModes.POINTER: // do nothing
            break;
    
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mouseMode_onMouseUp()!`);
            break;
    }
}

function mup(event)
{
    deltaX = startX - event.clientX;
    deltaY = startY - event.clientY;

    switch (pointerState) {
        case pointerStates.DEFAULT: mouseMode_onMouseUp(event);
            break;

        case pointerStates.CLICKED_CONTAINER:
            if (event.target.id == "container")
            {
                movingContainer = false;

                if (!deltaExceeded)
                {
                    if (mouseMode == mouseModes.EDGE_CREATION)
                    {
                        context = [];
                    }
                    else if (mouseMode == mouseModes.POINTER)
                    {
                        updateSelection(null, undefined, undefined);
                    }
                }
            }
            break;

        case pointerStates.CLICKED_ELEMENT:

            movingObject = false;
            // Special cases:
            if (mouseMode == mouseModes.EDGE_CREATION)
            {
                mouseMode_onMouseUp(event);
            }
            // Normal mode
            else 
            {
                if (context.length > 0)
                {
                    context.forEach(item => // Move all selected items
                    {
                        eventElementId = event.target.parentElement.parentElement.id;
                        setPos(item.id, deltaX, deltaY);
                    });
                }
            }
            break;
        case pointerStates.CLICKED_NODE:
            break;
    
        default: console.error(`State ${mouseMode} missing implementation at switch-case in mup()!`);
            break;
    }

    // Update all element positions on the screen
    deltaX = 0;
    deltaY = 0;
    updatepos(0, 0);
    drawRulerBars();

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
}

function mouseMode_onMouseMove(event)
{
     switch (mouseMode) {
        case mouseModes.PLACING_ELEMENT:
        case mouseModes.EDGE_CREATION:
        case mouseModes.POINTER: // do nothing
            break;

        case mouseModes.BOX_SELECTION:
            boxSelect_Update(event.clientX, event.clientY);
            updatepos(0, 0);
            break;
            
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mouseMode_onMouseMove()!`);
            break;
    }
}

function mmoving(event)
{
    switch (pointerState) {
        case pointerStates.CLICKED_CONTAINER:
            // Compute new scroll position
            movingContainer = true;
            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;
            scrollx = sscrollx - Math.round(deltaX * zoomfact);
            scrolly = sscrolly - Math.round(deltaY * zoomfact);

            // Update scroll position
            updatepos(null, null);

            // Remember that mouse has moved out of starting bounds
            if ((deltaX >= maxDeltaBeforeExceeded || deltaX <= -maxDeltaBeforeExceeded) || (deltaY >= maxDeltaBeforeExceeded || deltaY <= -maxDeltaBeforeExceeded))
            {
                deltaExceeded = true;
            }
            break;

        case pointerStates.CLICKED_ELEMENT:
            // Moving object
            movingObject = true;
            deltaX = startX - event.clientX;
            deltaY = startY - event.clientY;

            // We update position of connected objects
            updatepos(deltaX, deltaY);

            // Remember that mouse has moved out of starting bounds
            if ((deltaX >= maxDeltaBeforeExceeded || deltaX <= -maxDeltaBeforeExceeded) || (deltaY >= maxDeltaBeforeExceeded || deltaY <= -maxDeltaBeforeExceeded))
            {
                deltaExceeded = true;
            }
            break;

        case pointerStates.CLICKED_NODE:
            deltaX = startX - event.clientX;
            var index = findIndex(data, context[0].id);
            var element = document.getElementById(context[0].id);

            const minWidth = 20; // Declare the minimal with of an object

            if (startNodeRight && (startWidth - (deltaX / zoomfact)) > minWidth){
                data[index].width = (startWidth - (deltaX / zoomfact));
            } else if (!startNodeRight && (startWidth + (deltaX / zoomfact)) > minWidth){
                data[index].x = screenToDiagramCoordinates((startX - deltaX), 0).x;
                data[index].width = (startWidth + (deltaX / zoomfact));
            }

            element.remove();
            document.getElementById("container").innerHTML += drawElement(data[index]);
            updatepos(null, null);
            break;

        default:
            mouseMode_onMouseMove(event);
            break;
    }

    //Sets the rules to current position on screen.
    setRulerPosition(event.clientX, event.clientY);
}

function fab_action()
{
    if (document.getElementById("options-pane").className == "show-options-pane")
    {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        document.getElementById("options-pane").className = "hide-options-pane";
    } else
    {
        document.getElementById('optmarker').innerHTML = "&#x1f4a9;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}

//------------------------------------=======############==========----------------------------------------
//                                         Helper functions
//------------------------------------=======############==========----------------------------------------

// Returns TRUE if an enum contains the tested value
function enumContainsPropertyValue(value, enumObject) 
{
    for (const property in enumObject)
    {
        // If any cursor mode matches the passed argument
        const cm = enumObject[property];
        if (cm == value)
        {
            return true;
        }
    }
    return false;
}

function getPoint (x,y)
{
    return {
        x: x,
        y: y
    };
}

function getRectFromPoints(p1, p2)
{
    return {
        x: p1.x,
        y: p1.y,
        width: p2.x - p1.x,
        height: p2.y - p1.y,
    };
}

function getRectFromElement (element)
{
    return {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
    };
}

function rectsIntersect (left, right)
{
    // If the two rects touch each other, returns true otherwise false.
    //return ((left.X + left.Width >= right.X) &&
    //        (left.X <= right.X + right.Width) &&
    //        (left.Y + left.Height >= right.Y) &&
    //        (left.Y <= right.Y + right.Height));

    return (
        (left.x + left.width >= right.x) && 
        (left.x <= right.x + right.width) &&
        (left.y + left.height >= right.y) &&
        (left.y <= right.y + right.height)
    );
}

//------------------------------------=======############==========----------------------------------------
//                                           Mouse Modes
//------------------------------------=======############==========----------------------------------------

function setMouseMode(mode)
{   
    if (enumContainsPropertyValue(mode, mouseModes))
    {
        // Enable all buttons but the current mode one
        var children = document.getElementById('cursorModeFieldset').children;
        for (var index = 0; index < children.length; index++)
        {
            const child = children[index];

            // If child is a button
            if (child.tagName == "INPUT")
            {
                // Disable if current mode button, enable otherwise.
                child.disabled = child.className.toUpperCase().includes(mode) ? true : false;
            }
        }
    }
    else
    {
        // Not implemented exception
        console.error("Invalid mode passed to setMouseMode method. Missing implementation?");
        return;
    }

    // Mode-specific activation/deactivation
    onMouseModeDisabled(mouseMode);
    mouseMode = mode;
    onMouseModeEnabled(mouseMode);
}

function onMouseModeEnabled(mode)
{
    switch (mouseMode) {
        case mouseModes.POINTER:
        case mouseModes.PLACING_ELEMENT:
        case mouseModes.EDGE_CREATION:  
        case mouseModes.BOX_SELECTION:
            break;

        default: console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeEnabled()!`);
            break;
    }
}

function onMouseModeDisabled(mode)
{
    switch (mouseMode) {
        case mouseModes.POINTER:
        case mouseModes.PLACING_ELEMENT:
        case mouseModes.EDGE_CREATION:
        case mouseModes.BOX_SELECTION:
            break;
    
        default: console.error(`State ${mouseMode} missing implementation at switch-case in onMouseModeDisabled()!`);
            break;
    }
}

function setElementPlacementType(type = 0)
{
    elementTypeSelected = type;
}

function constructElementOfType(type)
{
    var elementTemplates = [
        {data: defaults.defaultERtentity, name: "Entity"},
        {data: defaults.defaultERrelation, name: "Relation"},
        {data: defaults.defaultERattr, name: "Attribute"}
    ]

    if (enumContainsPropertyValue(type, elementTypes))
    {
        return elementTemplates[type];
    }
}

//------------------------------------=======############==========----------------------------------------
//                                       Box Select functions
//------------------------------------=======############==========----------------------------------------

// Returns all elements touching the coordinate box
function getElementsInsideCoordinateBox(selectionRect)
{
    var elements = [];
    data.forEach(element => {

        // Box collision test
        if (rectsIntersect(selectionRect, getRectFromElement(element)))
        {
            elements.push(element);
        }
    });
    return elements;
}

function getBoxSelectionPoints()
{
    return {
        n1: getPoint(startX, startY),
        n2: getPoint(startX + deltaX, startY),
        n3: getPoint(startX, startY + deltaY),
        n4: getPoint(startX + deltaX, startY + deltaY),
    };
}

function getBoxSelectionCoordinates()
{
    return {
        n1: screenToDiagramCoordinates(startX, startY),
        n2: screenToDiagramCoordinates(startX + deltaX, startY),
        n3: screenToDiagramCoordinates(startX, startY + deltaY),
        n4: screenToDiagramCoordinates(startX + deltaX, startY + deltaY),
    };
}

// User has initiated a box selection
function boxSelect_Start(mouseX, mouseY)
{
    // Set starting position
    startX = mouseX;
    startY = mouseY;
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = true;
}

function boxSelect_Update(mouseX, mouseY)
{
    if (boxSelectionInUse)
    {
        // Update relative position form the starting position
        deltaX = mouseX - startX;
        deltaY = mouseY - startY;

        // Select all objects inside the box
        var coords = getBoxSelectionCoordinates();
            
        // Calculate top-left and bottom-right coordinates
        var topLeft = getPoint(0, 0), bottomRight = getPoint(0, 0);

        if (coords.n1.x < coords.n4.x) // left/right
        {
            topLeft.x = coords.n1.x;
            bottomRight.x = coords.n4.x;
        }
        else 
        {
            topLeft.x = coords.n4.x;
            bottomRight.x = coords.n1.x;
        }

        if (coords.n1.y < coords.n4.y) // top/bottom
        {
            topLeft.y = coords.n1.y;
            bottomRight.y = coords.n4.y;
        }
        else
        {
            topLeft.y = coords.n4.y;
            bottomRight.y = coords.n1.y;
        }

        var rect = getRectFromPoints(topLeft, bottomRight);
        context = getElementsInsideCoordinateBox(rect);
    }
}

function boxSelect_End()
{
    deltaX = 0;
    deltaY = 0;
    boxSelectionInUse = false;
}

function boxSelect_Draw(str)
{
    if (boxSelectionInUse && mouseMode == mouseModes.BOX_SELECTION && pointerState == pointerStates.DEFAULT)
    {
        // Positions to draw lines in-between
        /*
            Each [nx] depicts one node in the selection triangle.
            We draw a line between each corner and its neighbours.

            [n1]----------[n2]
            |              |
            |              |
            |              |
            |              |
            [n3]----------[n4]
        */

        // Calculate each node position
        var boxCoords = getBoxSelectionPoints();
        var nodeStart = boxCoords.n1;
        var nodeX = boxCoords.n2
        var nodeY = boxCoords.n3;
        var nodeXY = boxCoords.n4;

        // Draw lines between all neighbours
        // TODO : NO MAGIC NUMBERS!
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${2}' />`;
        str += `<line x1='${nodeStart.x}' y1='${nodeStart.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${2}' />`;

        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeX.x}' y2='${nodeX.y}' stroke='#000' stroke-width='${2}' />`;
        str += `<line x1='${nodeXY.x}' y1='${nodeXY.y}' x2='${nodeY.x}' y2='${nodeY.y}' stroke='#000' stroke-width='${2}' />`;
    }
    
    return str;
}

function fab_action()
{
    if (document.getElementById("options-pane").className == "show-options-pane")
    {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        document.getElementById("options-pane").className = "hide-options-pane";
    } else
    {
        document.getElementById('optmarker').innerHTML = "&#x1f4a9;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}

//------------------------------------=======############==========----------------------------------------
//                                           Zoom handling
//------------------------------------=======############==========----------------------------------------

//-------------------------------------------------------------------------------------------------
// zoomin/out - functions for updating the zoom factor and scroll positions
//-------------------------------------------------------------------------------------------------

function zoomin()
{
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    if (zoomfact == 0.125) zoomfact = 0.25
    else if (zoomfact == 0.25) zoomfact = 0.5
    else if (zoomfact == 0.5) zoomfact = 0.75
    else if (zoomfact == 0.75) zoomfact = 1.0
    else if (zoomfact == 1.0) zoomfact = 1.25
    else if (zoomfact == 1.25) zoomfact = 1.5
    else if (zoomfact == 1.5) zoomfact = 2.0
    else if (zoomfact == 2.0) zoomfact = 4.0;

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    // Update scroll position - missing code for determining that center of screen should remain at nevw zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars();
}

function zoomout()
{
    scrollx = scrollx / zoomfact;
    scrolly = scrolly / zoomfact;

    if (zoomfact == 0.25) zoomfact = 0.125
    else if (zoomfact == 0.5) zoomfact = 0.25
    else if (zoomfact == 0.75) zoomfact = 0.5
    else if (zoomfact == 1.0) zoomfact = 0.75
    else if (zoomfact == 1.25) zoomfact = 1.0
    else if (zoomfact == 1.5) zoomfact = 1.25
    else if (zoomfact == 2.0) zoomfact = 1.5
    else if (zoomfact == 4.0) zoomfact = 2.0;

    scrollx = scrollx * zoomfact;
    scrolly = scrolly * zoomfact;

    // Update scroll position - missing code for determining that center of screen should remain at new zoom factor
    showdata();

    // Draw new rules to match the new zoomfact
    drawRulerBars();
}

//-------------------------------------------------------------------------------------------------
// findIndex - Returns index of object with certain ID
//-------------------------------------------------------------------------------------------------

function findIndex(arr, id)
{
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i].id == id) return i;
    }
    return -1;
}

//-------------------------------------------------------------------------------------------------
// Finds and sets an element's position
//-------------------------------------------------------------------------------------------------
function setPos(id, x, y)
{
    foundId = findIndex(data, id);
    if (foundId != -1)
    {
        data[foundId].x -= (x / zoomfact);
        data[foundId].y -= (y / zoomfact);
    }
}

//-------------------------------------------------------------------------------------------------
// Showdata iterates over all diagram elements
//-------------------------------------------------------------------------------------------------

// Generate all courses at appropriate zoom level
function showdata()
{
    var container = document.getElementById("container");
    var containerbox = container.getBoundingClientRect();

    // Compute bounds of
    cwidth = containerbox.width;
    cheight = containerbox.height;

    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    var str = "";
    var courses = [];

    // Iterate over programs
    for (var i = 0; i < data.length; i++)
    {
        str += drawElement(data[i])
    }

    container.innerHTML = str;
    updatepos(null, null);

}

function drawElement(element){
    var str = "";
    // Compute size variables
    var linew = Math.round(strokewidth * zoomfact);
    var boxw = Math.round(element.width * zoomfact);
    var boxh = Math.round(element.height * zoomfact);
    var texth = Math.round(zoomfact * textheight);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var hboxh = Math.round(element.height * zoomfact * 0.5);

    str += `
				<div id='${element.id}'	class='element' onmousedown='ddown(event);' style='
						left:0px;
						top:0px;
						width:${boxw}px;
						height:${boxh}px;
						font-size:${texth}px;
				'>`;
    str += `<svg width='${boxw}' height='${boxh}' >`;
    if (element.kind == "EREntity")
    {

        str += `<rect x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}' 
                   stroke-width='${linew}' stroke='black' fill='#ffccdc' />
                   <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text> 

                   `;

    } else if (element.kind == "ERAttr")
    {
        var dash = "";
        if (element.isComputed == true)
        {
            dash = "stroke-dasharray='4 4'";
        }
        var multi = "";
        if (element.isMultiple == true)
        {
            multi = `
                    <path d="M${linew * multioffs},${hboxh} 
                    Q${linew * multioffs},${linew * multioffs} ${hboxw},${linew * multioffs} 
                    Q${boxw - (linew * multioffs)},${linew * multioffs} ${boxw - (linew * multioffs)},${hboxh} 
                    Q${boxw - (linew * multioffs)},${boxh - (linew * multioffs)} ${hboxw},${boxh - (linew * multioffs)} 
                    Q${linew * multioffs},${boxh - (linew * multioffs)} ${linew * multioffs},${hboxh}" 
                    stroke='black' fill='#ffccdc' stroke-width='${linew}' />`;
        }

        str += `<path d="M${linew},${hboxh} 
                           Q${linew},${linew} ${hboxw},${linew} 
                           Q${boxw - linew},${linew} ${boxw - linew},${hboxh} 
                           Q${boxw - linew},${boxh - linew} ${hboxw},${boxh - linew} 
                           Q${linew},${boxh - linew} ${linew},${hboxh}" 
                    stroke='black' fill='#ffccdc' ${dash} stroke-width='${linew}' />
                    
                    ${multi}

                    <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text>
                    `;
    } else if (element.kind == "ERRelation")
    {
        var weak = "";
        if (element.isWeak == true)
        {

            weak = `<polygon points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                stroke-width='${linew}' stroke='black' fill='#ffccdc'/>
                `;
        }
        str += `<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                   stroke-width='${linew}' stroke='black' fill='#ffccdc'/>
                   ${weak}
                   <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text>
                   `;

    }
    str += "</svg>"
    str += "</div>";
    return str;
}


//-------------------------------------------------------------------------------------------------
// updateselection - Update context according to selection parameters or clicked element
//-------------------------------------------------------------------------------------------------

function updateSelection(ctxelement, x, y)
{
    // If CTRL is pressed and an element is selected
    if (ctrlPressed && ctxelement != null)
    {
        // The element is not already selected
        if (!context.includes(ctxelement))
        {
            context.push(ctxelement);
        }
        // The element is already selected
    } else if (altPressed && ctxelement != null)
    {
        if (context.includes(ctxelement))
        {
            context = context.filter(function (element)
            {
                return element !== ctxelement;
            });
        }
    }
    // If CTRL is not pressed and a element has been selected.
    else if (ctxelement != null)
    {
        // Element not already in context
        if (!context.includes(ctxelement) && context.length < 1)
        {
            context.push(ctxelement);
        } else
        {
            if (mouseMode != mouseModes.EDGE_CREATION)
            {
                context = [];
            }
            context.push(ctxelement);
        }
    } else if (!altPressed && !ctrlPressed)
    {
        context = [];
    }
}

//-------------------------------------------------------------------------------------------------
// updatepos - Update positions of all elements based on the zoom level and view space coordinate
//-------------------------------------------------------------------------------------------------

function updatepos(deltaX, deltaY)
{
    exportElementDataToCSS();

    generateContextProperties();

    // Update svg backlayer -- place everyhing to draw OVER elements here
    var str = "";
    str = redrawArrows(str);
    document.getElementById("svgbacklayer").innerHTML=str;

    // Update svg overlay -- place everyhing to draw OVER elements here
    str = "";
    str = boxSelect_Draw(str);

    document.getElementById("svgoverlay").innerHTML=str;

    // Updates nodes for resizing
    removeNodes();
    if (context.length === 1 && mouseMode == mouseModes.POINTER) addNodes(context[0]);

    str = drawSelectionBox(str);
    document.getElementById("svgoverlay").innerHTML = str;

}

function drawSelectionBox(str)
{
    if (context.length != 0) {
        var lowX = context[0].x1;
        var highX = context[0].x2;
        var x1;
        var x2;
        var lowY = context[0].y1;
        var highY = context[0].y2;
        var y1;
        var y2;
        for (var i = 0; i < context.length; i++) {
            x1 = context[i].x1;
            x2 = context[i].x2;
            y1 = context[i].y1;
            y2 = context[i].y2;
            if (x1 < lowX) lowX = x1;
            if (x2 > highX) highX = x2;
            if (y1 < lowY) lowY = y1;
            if (y2 > highY) highY = y2;
        }

        str += `<rect width='${highX - lowX + 10}' height='${highY - lowY + 10}' x= '${lowX - 5}' y='${lowY - 5}'; style="fill:transparent;stroke-width:2;stroke:rgb(75,75,75);stroke-dasharray:10 5;" />`;
    }

    return str;
}

function saveProperties() 
{
    const propSet = document.getElementById("propertyFieldset");
    const element = context[0];
    const children = propSet.children;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const propName = child.id.split(`_`)[1];
        switch (propName) {
            case "name":
                const value = child.value.trim();
                if (value && value.length > 0) {
                    element.name = value;
                }

                break;
        
            default:
                break;
        }
    }
    showdata();
    updatepos(0,0);
}

function propFieldSelected(isSelected)
{
    propFieldState = isSelected;
}

function generateContextProperties()
{
    var propSet = document.getElementById("propertyFieldset");
    var str = "<legend>Properties</legend>";

    //more than one element selected

    if (context.length == 1)
    {
        var element = context[0];
        
        //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111 
        for (const property in element) {
            switch (property.toLowerCase()) {
                case "name":
                    str += `<input id="elementProperty_${property}" type="text" value="${element[property]}" onfocus="propFieldSelected(true)" onblur="propFieldSelected(false)"> `;
                    break;
            
                default:
                    break;
            }
        }
        str+=`<br><br><input type="submit" value="Save" onclick="saveProperties()">`;

    }
    else if (context.length > 1)
    {
        str += "<p>Pick only ONE element!</p>";
    }


    propSet.innerHTML = str;

}

function exportElementDataToCSS()
{
    // Update positions of all elements based on the zoom level and view space coordinate
    for (var i = 0; i < data.length; i++)
    {
        // Element data from the array
        var element = data[i];

        // Element DIV (dom-object)
        var elementDiv = document.getElementById(element.id);

        // Only perform update on valid elements
        if (elementDiv != null)
        {
            // If the element was clicked and our mouse movement is not null
            var inContext = deltaX != null && findIndex(context, element.id) != -1;
            var notBoxSelection = mouseMode != mouseModes.BOX_SELECTION;
            var clickedElement = pointerState == pointerStates.CLICKED_ELEMENT;
            var clickedNode = pointerState == pointerStates.CLICKED_NODE;
            var clickedContainer = pointerState == pointerStates.CLICKED_CONTAINER;

            // Handle positioning
            if (inContext && !clickedContainer && (notBoxSelection || clickedElement) && !clickedNode)
            {
                // Re-calculate drawing position for our selected element, then apply the mouse movement
                elementDiv.style.left = (Math.round((element.x * zoomfact) + (scrollx * (1.0 / zoomfact))) - deltaX) + "px";
                elementDiv.style.top = (Math.round((element.y * zoomfact) + (scrolly * (1.0 / zoomfact))) - deltaY) + "px";
            }
            else
            {
                // Re-calculate drawing position for other elements if there's a change in zoom level
                elementDiv.style.left = Math.round((element.x * zoomfact) + (scrollx * (1.0 / zoomfact))) + "px";
                elementDiv.style.top = Math.round((element.y * zoomfact) + (scrolly * (1.0 / zoomfact))) + "px";
            }

            // Handle colouring
            elementDiv.children[0].children[0].style.fill = inContext ? "#ff66b3" : "#ffccdc";
        }
    }
}

function linetest(x1, y1, x2, y2, x3, y3, x4, y4)
{
    // Display line test locations using svg lines
    // str+=`<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#44f' stroke-width='2' />`;
    // str+=`<line x1='${x3}' y1='${y3}' x2='${x4}' y2='${y4}' stroke='#44f' stroke-width='2' />`

    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y))
    {
        return false;
    } else
    {
        if (x1 >= x2)
        {
            if (!(x2 <= x && x <= x1)) return false;
        } else
        {
            if (!(x1 <= x && x <= x2)) return false;
        }
        if (y1 >= y2)
        {
            if (!(y2 <= y && y <= y1)) return false;
        } else
        {
            if (!(y1 <= y && y <= y2)) return false;
        }
        if (x3 >= x4)
        {
            if (!(x4 <= x && x <= x3)) return false;
        } else
        {
            if (!(x3 <= x && x <= x4)) return false;
        }
        if (y3 >= y4)
        {
            if (!(y4 <= y && y <= y3)) return false;
        } else
        {
            if (!(y3 <= y && y <= y4)) return false;
        }
    }
    return { x: x, y: y };
}

//-------------------------------------------------------------------------------------------------
// sortvectors - Uses steering vectors as a sorting criteria for lines
//-------------------------------------------------------------------------------------------------

function sortvectors(a, b, ends, elementid, axis)
{
    // Get dx dy centered on association end e.g. invert vector if necessary
    var lineA = lines[findIndex(lines, a)];
    var lineB = lines[findIndex(lines, b)];
    var parent = data[findIndex(data, elementid)];

    // Retrieve opposite element - assume element center (for now)
    if (lineA.fromID == elementid)
    {
        toElementA = data[findIndex(data, lineA.toID)];
    } else
    {
        toElementA = data[findIndex(data, lineA.fromID)];
    }
    if (lineB.fromID == elementid)
    {
        toElementB = data[findIndex(data, lineB.toID)];
    } else
    {
        toElementB = data[findIndex(data, lineB.fromID)];
    }

    // If lines cross swap otherwise keep as is
    if (axis == 0 || axis == 1)
    {
        // Left side
        ay = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        by = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 0) parentx = parent.x1
        else parentx = parent.x2;

        if (linetest(toElementA.cx, toElementA.cy, parentx, ay, toElementB.cx, toElementB.cy, parentx, by) === false) return -1
    } else if (axis == 2 || axis == 3)
    {
        // Top / Bottom side
        ax = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(a) + 1));
        bx = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(b) + 1));
        if (axis == 2) parenty = parent.y1
        else parenty = parent.y2;

        if (linetest(toElementA.cx, toElementA.cy, ax, parenty, toElementB.cx, toElementB.cy, bx, parenty) === false) return -1
    }

    return 1;
}

//-------------------------------------------------------------------------------------------------
// redrawArrows - Redraws arrows based on rprogram and rcourse variables
//-------------------------------------------------------------------------------------------------

function redrawArrows(str)
{
    // Clear all lines and update with dom object dimensions
    for (var i = 0; i < data.length; i++)
    {
        var element = data[i];
        element.left = [];
        element.right = [];
        element.top = [];
        element.bottom = [];

        // Get data from dom elements
        var domelement = document.getElementById(element.id);
        var domelementpos = domelement.getBoundingClientRect();
        element.x1 = domelementpos.left;
        element.y1 = domelementpos.top;
        element.x2 = domelementpos.left + domelementpos.width - 2;
        element.y2 = domelementpos.top + domelementpos.height - 2;
        element.cx = element.x1 + (domelementpos.width * 0.5);
        element.cy = element.y1 + (domelementpos.height * 0.5);
    }

    // Make list of all connectors?
    connectors = [];

    for (var i = 0; i < lines.length; i++)
    {
        var currentline = lines[i];
        var felem, telem, dx, dy;

        felem = data[findIndex(data, currentline.fromID)];
        telem = data[findIndex(data, currentline.toID)];
        currentline.dx = felem.cx - telem.cx;
        currentline.dy = felem.cy - telem.cy;

        // Figure out overlap - if Y overlap we use sides else use top/bottom
        var overlapY = true;
        if (felem.y1 > telem.y2 || felem.y2 < telem.y1) overlapY = false;
        var overlapX = true;
        if (felem.x1 > telem.x2 || felem.x2 < telem.x1) overlapX = false;
        var majorX = true;
        if (Math.abs(currentline.dy) > Math.abs(currentline.dx)) majorX = false;

        // Determine connection type (top to bottom / left to right or reverse - (no top to side possible)
        var ctype = 0;
        if (overlapY || ((majorX) && (!overlapX)))
        {
            if (currentline.dx > 0) currentline.ctype = "LR"
            else currentline.ctype = "RL";
        } else
        {
            if (currentline.dy > 0) currentline.ctype = "TB";
            else currentline.ctype = "BT";
        }

        // Add accordingly to association end
        if (currentline.ctype == "LR")
        {
            if (felem.kind == "EREntity") felem.left.push(currentline.id);
            if (telem.kind == "EREntity") telem.right.push(currentline.id);
        } else if (currentline.ctype == "RL")
        {
            if (felem.kind == "EREntity") felem.right.push(currentline.id);
            if (telem.kind == "EREntity") telem.left.push(currentline.id);
        } else if (currentline.ctype == "TB")
        {
            if (felem.kind == "EREntity") felem.top.push(currentline.id);
            if (telem.kind == "EREntity") telem.bottom.push(currentline.id);
        } else if (currentline.ctype == "BT")
        {
            if (felem.kind == "EREntity") felem.bottom.push(currentline.id);
            if (telem.kind == "EREntity") telem.top.push(currentline.id);
        }
    }

    // Sort all association ends that number above 0 according to direction of line
    for (var i = 0; i < data.length; i++)
    {
        var element = data[i];

        // Only sort if size of list is >= 2
        if (element.top.length > 1) element.top.sort(function (a, b) { return sortvectors(a, b, element.top, element.id, 2) });
        if (element.bottom.length > 1) element.bottom.sort(function (a, b) { return sortvectors(a, b, element.bottom, element.id, 3) });
        if (element.left.length > 1) element.left.sort(function (a, b) { return sortvectors(a, b, element.left, element.id, 0) });
        if (element.right.length > 1) element.right.sort(function (a, b) { return sortvectors(a, b, element.right, element.id, 1) });
    }

    // Draw each line using sorted line ends when applicable
    for (var i = 0; i < lines.length; i++)
    {
        var currentline = lines[i];
        var felem, telem, dx, dy;

        felem = data[findIndex(data, currentline.fromID)];
        telem = data[findIndex(data, currentline.toID)];

        // Draw each line - compute end coordinate from position in list compared to list count
        fx = felem.cx;
        fy = felem.cy;
        tx = telem.cx;
        ty = telem.cy;

        // Collect coordinates
        if (currentline.ctype == "BT")
        {
            fy = felem.y2;
            if (felem.kind == "EREntity") fx = felem.x1 + (((felem.x2 - felem.x1) / (felem.bottom.length + 1)) * (felem.bottom.indexOf(currentline.id) + 1));
            ty = telem.y1;
        } else if (currentline.ctype == "TB")
        {
            fy = felem.y1;
            if (felem.kind == "EREntity") fx = felem.x1 + (((felem.x2 - felem.x1) / (felem.top.length + 1)) * (felem.top.indexOf(currentline.id) + 1));
            ty = telem.y2;
        } else if (currentline.ctype == "RL")
        {
            fx = felem.x2;
            if (felem.kind == "EREntity") fy = felem.y1 + (((felem.y2 - felem.y1) / (felem.right.length + 1)) * (felem.right.indexOf(currentline.id) + 1));
            tx = telem.x1;
        } else if (currentline.ctype == "LR")
        {
            fx = felem.x1;
            if (felem.kind == "EREntity") fy = felem.y1 + (((felem.y2 - felem.y1) / (felem.left.length + 1)) * (felem.left.indexOf(currentline.id) + 1));
            tx = telem.x2;
        }

        if (currentline.kind == "Normal")
        {
            str += `<line x1='${fx}' y1='${fy}' x2='${tx}' y2='${ty}' stroke='#f44' stroke-width='${strokewidth}' />`;
        } else if (currentline.kind == "Double")
        {
            // We mirror the line vector
            dy = -(tx - fx);
            dx = ty - fy;
            var len = Math.sqrt((dx * dx) + (dy * dy));
            dy = dy / len;
            dx = dx / len;
            var cstmOffSet = 1.4;
            str += `<line x1='${fx + (dx * strokewidth * 1.2) - cstmOffSet}' y1='${fy + (dy * strokewidth * 1.2) - cstmOffSet}' x2='${tx + (dx * strokewidth * 1.8) + cstmOffSet}' y2='${ty + (dy * strokewidth * 1.8) + cstmOffSet}' stroke='#f44' stroke-width='${strokewidth}' />`;
            str += `<line x1='${fx - (dx * strokewidth * 1.8) - cstmOffSet}' y1='${fy - (dy * strokewidth * 1.8) - cstmOffSet}' x2='${tx - (dx * strokewidth * 1.2) + cstmOffSet}' y2='${ty - (dy * strokewidth * 1.2) + cstmOffSet}' stroke='#f44' stroke-width='${strokewidth}' />`;
        }

    }

    
    return str;
}

function addNodes(element) {

    var elementDiv = document.getElementById(element.id)
    var nodes = "";

    nodes += "<span class='node mr'></span>";
    nodes += "<span class='node ml'></span>";

    elementDiv.innerHTML += nodes;

}
function removeNodes(element) {
    // Get all elements with the class: "node"
    var nodes = document.getElementsByClassName("node");

    // For every node remove it
    while(nodes.length > 0){
        nodes[0].remove();
    }
    return str;
}
//-------------------------------------------------------------------------------------------------
// Change the position of rulerPointers
//-------------------------------------------------------------------------------------------------
function setRulerPosition(x, y) {
    document.getElementById("ruler-x").style.left = x - 1 + "px";
    document.getElementById("ruler-y").style.top = y - 125 + "px";
}

//-------------------------------------------------------------------------------------------------
// Draws the rulers
//-------------------------------------------------------------------------------------------------
function drawRulerBars(){
    //Get elements
    svgX = document.getElementById("ruler-x-svg");
    svgY = document.getElementById("ruler-y-svg");
    //Settings - Ruler
    const lineRatio = 10;
    const fullLineRatio = 10;
    var barY, barX = "";
    const color = "black";

    //Draw the Y-axis ruler.
    var lineNumber = (fullLineRatio - 1);
    for (i = 40;i <= cheight; i += lineRatio){
        lineNumber++;

        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio){
            var cordY = screenToDiagramCoordinates(0,86 + i).y;
            lineNumber = 0;
            barY += "<line x1='0px' y1='"+(i)+"' x2='40px' y2='"+i+"' stroke='"+color+"' />";
            barY += "<text x='2' y='"+(i+10)+"' style='font-size: 10px'>"+cordY+"</text>";
        }
        else barY += "<line x1='25px' y1='"+i+"' x2='40px' y2='"+i+"' stroke='"+color+"' />";
    }

    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis

    //Draw the X-axis ruler.
    lineNumber = (fullLineRatio - 1);
    for (i = 40;i <= cwidth; i += lineRatio){
        lineNumber++;

        //Check if a full line should be drawn
        if (lineNumber === fullLineRatio) {
            var cordX = screenToDiagramCoordinates(i, 0).x;
            lineNumber = 0;
            barX += "<line x1='" +i+"' y1='0' x2='" + i + "' y2='40px' stroke='" + color + "' />";
            barX += "<text x='"+(i+5)+"' y='15' style='font-size: 10px'>"+cordX+"</text>";
        }
        else barX += "<line x1='" +i+"' y1='25' x2='" +i+"' y2='40px' stroke='" + color + "' />";

    }
    svgX.innerHTML = barX;//Print the generated ruler, for X-axis
}

//Function to remove elemets and lines
function removeElements(elementArray){
    for(var i = 0; i < elementArray.length; i++){
        //Remove element
        data=data.filter(function(element) {
            return element != elementArray[i];
        });
        //Remove lines
        lines= lines.filter(function(line){
            return line.fromID != elementArray[i].id && line.toID != elementArray[i].id;
        });
    }
    context = [];
    redrawArrows();
    showdata();
}

//------------------------------------=======############==========----------------------------------------
//                                    Default data display stuff
//------------------------------------=======############==========----------------------------------------

function getData()
{
    showdata();
    drawRulerBars();
}

function data_returned(ret)
{
    if (typeof ret.data !== "undefined")
    {
        service = ret;
        showdata();
    } else
    {
        alert("Error receiveing data!");
    }
}
