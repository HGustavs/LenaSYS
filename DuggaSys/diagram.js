/*
----- THIS FILE HANDLES THE MAIN FUNCTIONS OF THE DIAGRAM -----
*/

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

// Global settings
var gridSize = 16;
var crossSize = 4.0;                // Size of point cross
var tolerance = 8;                  // Size of tolerance area around the point
var ctx;                            // Canvas context
var canvas;                         // Canvas Element
var sel;                            // Selection state
var currentMouseCoordinateX = 0;
var currentMouseCoordinateY = 0;
var startMouseCoordinateX = 0;
var startMouseCoordinateY = 0;
var oldMouseCoordinateX = 0;
var oldMouseCoordinateY = 0;
var canvasMouseX = 0;               // Variable for the mouse coordinate X in the canvas on the diagram page.
var canvasMouseY = 0;               // Variable for the mouse coordinate Y in the canvas on the diagram page.
var zoomValue = 1.00;
var md = 0;                         // Mouse state
var globalMouseState = 0;           // Global mouse state (not only for canvas)
var hovobj = -1;
var lineStartObj = -1;
var movobj = -1;                    // Moving object ID
var lastSelectedObject = -1;        // The last selected object
var uimode = "normal";              // User interface mode e.g. normal or create class currently
var figureType = null;              // Specification of uimode, when Create Figure is set to the active mode this is set to one of the forms a figure can be drawn in.
var widthWindow;                    // The width on the users screen is saved is in this var.
var heightWindow;                   // The height on the users screen is saved is in this var.
var consoleInt = 0;
var sx = 0, sy = 0;                 // Current X- and Y-coordinant from which the canvas start from
var waldoPoint = "";
var moveValue = 0;                  // Used to deside if the canvas should translate or not
var activePoint = null;             // This point indicates what point is being hovered by the user
var p1 = null;                      // When creating a new figure, these two variables are used ...
var p2 = null;                      // to keep track of points created with mousedownevt and mouseupevt
var p3 = null;                      // Middlepoint/centerPoint
var snapToGrid = false;             // Will the clients actions snap to grid
var toggleA4 = false;               // toggle if a4 outline is drawn
var toggleA4Holes = false;          // toggle if a4 holes are drawn
var crossStrokeStyle1 = "#f64";     // set the color for the crosses.
var crossFillStyle = "#d51";
var crossStrokeStyle2 = "#d51";
var minEntityX = 100;               //the minimum size for an Enitny are set by the values seen below.
var minEntityY = 50;
var hashUpdateTimer = 5000;         // set timer varibale for hash and saving
var currentHash = 0;
var lastDiagramEdit = localStorage.getItem('lastEdit');          // the last date the diagram was change in milisecounds.
var refreshTimer = setRefreshTime();              //  set how often the diagram should be refreshed.
var refresh_lock = false;           // used to set if the digram should stop refreshing or not.
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
var a = [], b = [], c = [];
var selected_objects = [];              // Is used to store multiple selected objects
var mousedownX = 0, mousedownY = 0;     // Is used to save the exact coordinants when pressing mousedown while in the "Move Around"-mode
var mousemoveX = 0, mousemoveY = 0;     // Is used to save the exact coordinants when moving aorund while in the "Move Around"-mode
var mouseDiffX = 0, mouseDiffY = 0;     // Saves to diff between mousedown and mousemove to know how much to translate the diagram
var xPos = 0;
var yPos = 0;
var globalAppearanceValue = 0;          // Is used to see if the button was pressed or not
var diagramNumber = 0;                  // Is used for localStorage so that undo and redo works.
var diagramNumberHistory = 0;           // Is used for undo and redo
var diagramCode = "";                   // Is used to stringfy the diagram-array
var appearanceMenuOpen = false;         // True if appearance menu is open
var classAppearanceOpen = false;

var symbolStartKind;                    // Is used to store which kind of object you start on
var symbolEndKind;                      // Is used to store which kind of object you end on

var cloneTempArray = [];                // Is used to store all selected objects when ctrl+c is pressed

const deleteKey = 46;
const backspaceKey = 8;
const spacebarKey = 32;
const upArrow = 37;
const downArrow = 38;
const leftArrow = 39;
const rightArrow = 40;
const ctrlKey = 17;
const windowsKey = 91;
const cKey = 67;
const vKey = 86;
const zKey = 90;
const yKey = 89;
const aKey = 65;
const escapeKey = 27;



//this block of the code is used to handel keyboard input;
window.addEventListener("keydown", this.keyDownHandler);

var ctrlIsClicked = false;

// -------------------------------------------------------------
// DIAGRAM EXAMPLE DATA SECTION
// -------------------------------------------------------------
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
// diagram - Stores a global list of diagram objects
// A diagram object could for instance be a path, or a symbol
//--------------------------------------------------------------------
var diagram = [];

function keyDownHandler(e){
    var key = e.keyCode;
    if(appearanceMenuOpen) return;
    if((key == deleteKey || key == backspaceKey)){
        eraseSelectedObject();
        SaveState();
    } else if(key == spacebarKey){
        //Use space for movearound
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
        if(uimode != "MoveAround"){
            activateMovearound();
        } else{
            deactivateMovearound();
        }
        updateGraphics();
    } else if(key == upArrow || key == downArrow || key == leftArrow || key == rightArrow){//arrow keys
        arrowKeyPressed(key);
    } else if(key == ctrlKey || key == windowsKey){
        ctrlIsClicked = true;
    } else if(ctrlIsClicked && key == cKey){
        //Ctrl + c
        fillCloneArray();
    } else if(ctrlIsClicked && key == vKey ){
        //Ctrl + v
        var temp = [];
        for(var i = 0; i < cloneTempArray.length; i++){
            //Display cloned objects except lines
            if(cloneTempArray[i].symbolkind != 4){
                const cloneIndex = copySymbol(cloneTempArray[i]) - 1;
                temp.push(diagram[cloneIndex]);
            }
        }
        cloneTempArray = temp;
        selected_objects = temp;
        updateGraphics();
        SaveState();
    }
    else if (key == zKey && ctrlIsClicked) undoDiagram();
    else if (key == yKey && ctrlIsClicked) redoDiagram();
    else if (key == aKey && ctrlIsClicked) {
        e.preventDefault();
        for(var i = 0; i < diagram.length; i++){
            selected_objects.push(diagram[i]);
            diagram[i].targeted = true;
        }
        updateGraphics();
    }
    else if(key == ctrlKey || key == windowsKey) {
        ctrlIsClicked = true;
    }
    else if(key == 27){
        cancelFreeDraw();
    }
}
// removes all the lines that has been drawn when in the free draw mode
function cancelFreeDraw(){
    if(uimode == "CreateFigure" && figureType == "Free" && md == 4){
        for (var i = 0; i < numberOfPointsInFigure; i++) {
            diagram.pop();
        }
        cleanUp();
        md = 0;             //Prevents the dashed line box, when drawing a square, to appear immediately
        updateGraphics();
      }
}
// used for copy and paste functionality in the keyDownHandlerFunction
function fillCloneArray(){
    cloneTempArray = [];
    for(var i = 0; i < selected_objects.length; i++){
        cloneTempArray.push(selected_objects[i]);
    }
}

//--------------------------------------------------------------------
// Keeps track of if the CTRL or CMD key is active or not
//--------------------------------------------------------------------

//Not used yet
window.onkeyup = function(event) {
    if(event.which == ctrlKey || event.which == windowsKey) {
        ctrlIsClicked = false;
    }
}

//Handler for when pressing arrow keys when space has been pressed
function arrowKeyPressed(key){
    var xNew = 0, yNew = 0;

    if(key == leftArrow){//left
        xNew = -5;
    }else if(key == upArrow){//up
        yNew = -5;
    }else if(key == rightArrow){//right
        xNew = 5;
    }else if(key == downArrow){//down
        yNew = 5;
    }
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].move(xNew, yNew);
    }
    updateGraphics();
}

//--------------------------------------------------------------------
// points - stores a global list of points
// A point can not be physically deleted but marked as deleted in order to reuse
// the sequence number again. e.g. point[5] will remain point[5] until it is deleted
//--------------------------------------------------------------------
var points = [];

//--------------------------------------------------------------------
// addPoint - Creates a new point with inserted parameters and
// returns index of that point
//--------------------------------------------------------------------
points.addPoint = function(xCoordinate, yCoordinate, isSelected) {
    //If we have an unused index we use it first
    for(var i = 0; i < points.length; i++){
        if(points[i] == ""){
            points[i] = {x:xCoordinate, y:yCoordinate, isSelected:isSelected};
            return i;
        }
    }

    this.push({x:xCoordinate, y:yCoordinate, isSelected:isSelected});
    return this.length - 1;
}

//Clone an object
function copySymbol(symbol){
    var clone = Object.assign(new Symbol(), symbol);
    var topLeftClone = Object.assign({}, points[symbol.topLeft]);
    topLeftClone.x += 10;
    topLeftClone.y += 10;
    var bottomRightClone = Object.assign({}, points[symbol.bottomRight]);
    bottomRightClone.x += 10;
    bottomRightClone.y += 10;
    var centerPointClone = Object.assign({}, points[symbol.centerPoint]);
    centerPointClone.x += 10;
    centerPointClone.y += 10;
    var middleDividerClone = Object.assign({}, points[symbol.middleDivider]);
    middleDividerClone.x += 10;
    middleDividerClone.y += 10;

    if(symbol.symbolkind == 1){
        clone.name = "New" + diagram.length;
    }else if(symbol.symbolkind == 2){
        clone.name = "Attr" + diagram.length;
    }else if(symbol.symbolkind == 3){
        clone.name = "Entity" + diagram.length;
    }else if(symbol.symbolkind == 4){
        clone.name = "Line" + diagram.length;
    }else{
        clone.name = "Relation" + diagram.length;
    }
    clone.topLeft = points.push(topLeftClone) - 1;
    clone.bottomRight = points.push(bottomRightClone) - 1;
    if(clone.symbolkind != 1){
        clone.centerPoint = points.push(centerPointClone) - 1;
    }
    else{
        clone.middleDivider = points.push(middleDividerClone) - 1;
        clone.centerPoint = clone.middleDivider;
    }
    clone.targeted = true;
    symbol.targeted = false;

    diagram.push(clone);

    return diagram.length;

}

//--------------------------------------------------------------------
// drawPoints - Draws each of the points as a cross
//--------------------------------------------------------------------
points.drawPoints = function() {
    ctx.strokeStyle = crossStrokeStyle1;
    ctx.lineWidth = 2;
    for (var i = 0; i < this.length; i++) {
        var point = this[i];
        if (!point.isSelected) {
            ctx.beginPath();
            ctx.moveTo(point.x - crossSize, point.y - crossSize);
            ctx.lineTo(point.x + crossSize, point.y + crossSize);
            ctx.moveTo(point.x + crossSize, point.y - crossSize);
            ctx.lineTo(point.x - crossSize, point.y + crossSize);
            ctx.stroke();
        } else {
            ctx.save();
            ctx.fillStyle = crossFillStyle;
            ctx.strokeStyle = crossStrokeStyle2;
            ctx.fillRect(point.x - crossSize, point.y - crossSize, crossSize * 2, crossSize * 2);
            ctx.strokeRect(point.x - crossSize, point.y - crossSize, crossSize * 2, crossSize * 2);
            ctx.restore();
        }
    }
}


//--------------------------------------------------------------------
// closestPoint - Returns the distance and index of the point closest
// to the cotargetItemsInsideSelectionBoxordinates passed as parameters.
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
// clearAllSelects - Clears all selects from the array "points"
//--------------------------------------------------------------------
points.clearAllSelects = function() {
    for (var i = 0; i < this.length; i++) {
        this[i].isSelected = 0;
    }
}

//--------------------------------------------------------------------
// draw - Executes draw methond in all diagram objects
//--------------------------------------------------------------------
diagram.closestPoint = function(mx, my){
    var distance = 50000000;
    var point;
    this.filter(symbol => symbol.kind != 1 && symbol.symbolkind != 6).forEach(symbol => {
        [points[symbol.topLeft], points[symbol.bottomRight], {x:points[symbol.topLeft], y:points[symbol.bottomRight], fake:true}, {x:points[symbol.bottomRight], y:points[symbol.topLeft], fake:true}].forEach(corner => {
            var deltaX = corner.fake ? mx - corner.x.x : mx - corner.x;
            var deltaY = corner.fake ? my - corner.y.y : my - corner.y;
            var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
            if (hypotenuseElevatedBy2 < distance) {
                distance = hypotenuseElevatedBy2;
                point = corner;
            }
        });
    });

    this.filter(symbol => symbol.kind == 1).forEach(path => {
        path.segments.forEach(seg => {
            var deltaX = mx - points[seg.pb].x;
            var deltaY = my - points[seg.pb].y;
            var hypotenuseElevatedBy2 = (deltaX * deltaX) + (deltaY * deltaY);
            if (hypotenuseElevatedBy2 < distance) {
                distance = hypotenuseElevatedBy2;
                point = points[seg.pb];
            }
        });
    });

    return {distance:Math.sqrt(distance), point:point};
}

diagram.draw = function() {
    this.adjustPoints();
    for(var i = 0; i < this.length; i++){
        if (this[i].kind == 1) {
            this[i].draw(1, 1);
        }
    }
    //Draws all lines first so that they appear behind the object instead
    for(var i = 0; i < this.length; i++){
        if(this[i].symbolkind == 4){
            this[i].draw();
        }
    }
    for (var i = 0; i < this.length; i++) {
        if(this[i].kind == 2 && this[i].symbolkind != 4){
            this[i].draw();
        }
    }

}

//--------------------------------------------------------------------
// adjustPoints - Adjusts all the fixed midpoints or other points of
// interest to the actual geometric midpoint of the symbol
//--------------------------------------------------------------------
diagram.adjustPoints = function() {
    for (var i = 0 ; i < this.length; i++) {
        this[i].adjust();
    }
}

//--------------------------------------------------------------------
// deleteObject - Deletes passed object from diagram
//--------------------------------------------------------------------
diagram.deleteObject = function(object) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == object) {
            this.splice(i, 1);
        }
    }
}

//--------------------------------------------------------------------
// targetItemsInsideSelectionBox - Targets all items inside the
// selection box (dragged by the user)
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
        if (this[i].kind == 1) {
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
            if(!hover){
                if (pointsSelected >= tempPoints.length) {
                    selected_objects.push(this[i]);
                    this[i].targeted = true;
                } else {
                    this[i].targeted = false;
                }
            }else{
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
            if (tempTopLeftX > tempBottomRightX || tempTopLeftX > tempBottomRightX - minEntityX) {
                tempTopLeftX = tempBottomRightX - minEntityX;
            }
            if (tempTopLeftY > tempBottomRightY || tempTopLeftY > tempBottomRightY - minEntityY) {
                tempTopLeftY = tempBottomRightY - minEntityY;
            }
            if (sx < tempTopLeftX && ex > tempTopLeftX &&
                sy < tempTopLeftY && ey > tempTopLeftY &&
                sx < tempBottomRightX && ex > tempBottomRightX &&
                sy < tempBottomRightY && ey > tempBottomRightY) {
                if (ctrlIsClicked && !hover) {
                    if (index >= 0) {
                        this[i].targeted = false;
                        selected_objects.splice(index, 1);
                    } else if(!hover){
                        this[i].targeted = true;
                        selected_objects.push(this[i]);
                    }
                } else {
                    if (index < 0 && !hover) {
                        this[i].targeted = true;
                        selected_objects.push(this[i]);
                    } else if(hover){
                        this[i].isHovered = true;
                    }
                }
            } else if(!ctrlIsClicked) {
                if(!hover) this[i].targeted = false;
                if (index >= 0) selected_objects.splice(index, 1);
            }
        }
    }
}

//--------------------------------------------------------------------
// itemClicked - Returns the index of the first clicked item
//--------------------------------------------------------------------
diagram.itemClicked = function() {
    if(uimode == "MoveAround") return -1;
    var obj = this.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY);
    if (typeof obj !== 'undefined' && obj != -1) return this.indexOf(obj);
    else return -1;
}

//--------------------------------------------------------------------
// isHovered - Executes isHovered methond in all diagram objects
// (currently only of kind==2 && symbolkind == 4 (aka. lines))
//--------------------------------------------------------------------
diagram.checkForHover = function(posX, posY) {
    for (var i = 0; i < this.length; i++) {
        this[i].isHovered = false;
    }
    var hoveredObjects = this.filter(symbol => symbol.checkForHover(posX, posY));
    if (hoveredObjects.length <= 0) return -1;
    hoveredObjects.sort(function(a, b) {
        if(a.kind == 1 && b.kind == 2) return -1;
        else if(a.kind != 1 && b.kind == 1) return 1;
        else if (a.symbolkind != 4 && b.symbolkind != 4) return 0;
        else if (a.symbolkind == 4 && b.symbolkind != 4) return -1;
        else if (a.symbolkind != 4 && b.symbolkind == 4) return 1;
        else return 0;
    });
    if (hoveredObjects.length && hoveredObjects[hoveredObjects.length - 1].kind != 1) {
        //We only want to set it to true when md is not in selectionbox mode
        hoveredObjects[hoveredObjects.length - 1].isHovered = md != 4 || uimode != "normal";
    }
    return hoveredObjects[hoveredObjects.length - 1];
}

//--------------------------------------------------------------------
// eraseLines - removes all the lines connected to an object
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
            for(var j = 0; j < connected_objects.length; j++){
                connected_objects[j].removePointFromConnector(privateLines[i].topLeft);
            }
            points[privateLines[i].topLeft] = waldoPoint;
        }
        if(!eraseRight) {
            for(var j = 0; j < connected_objects.length; j++){
                connected_objects[j].removePointFromConnector(privateLines[i].bottomRight);
            }
            points[privateLines[i].bottomRight] = waldoPoint;
        }
        diagram.deleteObject(privateLines[i]);
    }
}

//--------------------------------------------------------------------
// getEntityObjects - Returns a list of all entities
//--------------------------------------------------------------------
diagram.getEntityObjects = function() {
    var entities = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3) {
            entities.push(diagram[i]);
        }
    }
    return entities;
}

//--------------------------------------------------------------------
// getLineObjects - Returns a list of all lines
//--------------------------------------------------------------------
diagram.getLineObjects = function() {
    var lines = [];
    for (var i = 0; i < this.length; i++) {
        if (diagram[i].symbolkind == 4) {
            lines.push(diagram[i]);
        }
    }
    return lines;
}

//--------------------------------------------------------------------
// getRelationObjects - Returns a list of all relations
//--------------------------------------------------------------------
diagram.getRelationObjects = function() {
    var relations = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 5) {
            relations.push(diagram[i]);
        }
    }
    return relations;
}

//--------------------------------------------------------------------
// updateLineRelations - Updates a line's relation depending on
// what object it is connected to
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
// Sort all connectors related to entity.
//--------------------------------------------------------------------
diagram.sortConnectors = function() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5 || diagram[i].symbolkind == 1) {
            diagram[i].sortAllConnectors();
        }
    }
}

//--------------------------------------------------------------------
// Updates all lines connected to an entity.
//--------------------------------------------------------------------
diagram.updateQuadrants = function() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5 || diagram[i].symbolkind == 1) {
            if(diagram[i].quadrants()) break;
        }
    }
}

function initializeCanvas() {
    //hashes the current diagram, and then compare if it have been change to see if it needs to be saved.
    setInterval(refreshFunction, refreshTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashCurrent, hashUpdateTimer);
    setInterval(hashFunction, hashUpdateTimer + 500);
    setInterval(function() {Save()}, 10000);
    widthWindow = (window.innerWidth - 20);
    heightWindow = (window.innerHeight - 80);
    document.getElementById("canvasDiv").innerHTML = "<canvas id='myCanvas' style='border:1px solid #000000;' width='" + (widthWindow * zoomValue) + "' height='" + (heightWindow * zoomValue) + "' onmousemove='mousemoveevt(event,this);' onmousedown='mousedownevt(event);' onmouseup='mouseupevt(event);'></canvas>";
    document.getElementById("valuesCanvas").innerHTML = "<p><b>Zoom:</b> " + Math.round((zoomValue * 100)) + "%   |   <b>Coordinates:</b> X=" + sx + " & Y=" + sy + "</p>";
    canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
    }
    document.getElementById("moveButton").addEventListener('click', movemode, false);
    document.getElementById("moveButton").style.visibility = 'hidden';
    updateGraphics();
    canvas.addEventListener('dblclick', doubleclick, false);
    canvas.addEventListener('touchmove', mousemoveevt, false);
    canvas.addEventListener('touchstart', mousedownevt, false);
    canvas.addEventListener('touchend', mouseupevt, false);
    $("#ZoomSelect").click(function() {
        $(this).parent().find(".ikonPil").toggleClass("ikonPilRotation");
    });
}

//-----------------------------------------------------------------------------------
// Function to enable and disable the grid
// functionality is related to currentMouseCoordinateX and currentMouseCoordinateY
//-----------------------------------------------------------------------------------
function toggleGrid() {
    if (snapToGrid == false) {
        snapToGrid = true;
    } else {
        snapToGrid = false;
    }
    setCheckbox($("a:contains('Snap to grid')"), snapToGrid);
}

function toggleVirtualA4(){
    if (toggleA4){
        toggleA4 = false;
        updateGraphics();
    } else{
        toggleA4 = true;
        updateGraphics();
    }
}

function drawVirtualA4(){
    if(!toggleA4){
        return;
    }
    // the correct according to 96dpi size, of a4 milimeters to pixels 
    const pixelsPerMillimeter = 3.781;
    const a4Width = 210 * pixelsPerMillimeter;
    const a4Height = 297 * pixelsPerMillimeter;
    // size of a4 hole, from specification ISO 838 and the swedish "triohålning"
    const holeOffsetX = 12 * pixelsPerMillimeter;
    const holeRadius = 3 * pixelsPerMillimeter;
    ctx.save();
    ctx.strokeStyle = "black"
    ctx.setLineDash([10]);
    ctx.translate(0, 0);
    ctx.strokeRect(0,0, a4Width, a4Height);

    if(toggleA4Holes){
        //Upper 2 holes
        drawCircle(holeOffsetX, (a4Height / 2) - (34+21) * pixelsPerMillimeter, holeRadius);
        drawCircle(holeOffsetX, (a4Height / 2) - 34 * pixelsPerMillimeter, holeRadius);
        //Latter two holes
        drawCircle(holeOffsetX, (a4Height / 2) + (34+21) * pixelsPerMillimeter, holeRadius);
        drawCircle(holeOffsetX, (a4Height / 2) + 34 * pixelsPerMillimeter, holeRadius);
    }    
    ctx.restore();
}

function drawCircle(cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0,0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function toggleVirtualA4Holes(){
    if (toggleA4Holes){
        toggleA4Holes = false;
        updateGraphics();
    } else{
        toggleA4Holes = true;
        updateGraphics();
    }
}

function toggleVirtualA4(){
    if (toggleA4){
        toggleA4 = false;
        updateGraphics();
    } else{
        toggleA4 = true;
        updateGraphics();
    }
}

function drawVirtualA4(){
    if(!toggleA4){
        return;
    }
    // the correct according to 96dpi size, of a4 milimeters to pixels
    const pixelsPerMillimeter = 3.781;
    const a4Width = 210 * pixelsPerMillimeter;
    const a4Height = 297 * pixelsPerMillimeter;
    // size of a4 hole, from specification ISO 838 and the swedish "triohålning"
    const holeOffsetX = 12 * pixelsPerMillimeter;
    const holeRadius = 3 * pixelsPerMillimeter;
    ctx.save();
    ctx.strokeStyle = "black"
    ctx.setLineDash([10]);
    ctx.translate(0, 0);
    ctx.strokeRect(0,0, a4Width, a4Height);

    if(toggleA4Holes){
        //Upper 2 holes
        drawCircle(holeOffsetX, (a4Height / 2) - (34+21) * pixelsPerMillimeter, holeRadius);
        drawCircle(holeOffsetX, (a4Height / 2) - 34 * pixelsPerMillimeter, holeRadius);
        //Latter two holes
        drawCircle(holeOffsetX, (a4Height / 2) + (34+21) * pixelsPerMillimeter, holeRadius);
        drawCircle(holeOffsetX, (a4Height / 2) + 34 * pixelsPerMillimeter, holeRadius);
    }
    ctx.restore();
}

function drawCircle(cx, cy, radius) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0,0, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

function toggleVirtualA4Holes(){
    if (toggleA4Holes){
        toggleA4Holes = false;
        updateGraphics();
    } else{
        toggleA4Holes = true;
        updateGraphics();
    }
}

// Opens the dialog menu for import
function openImportDialog() {
    $("#import").css("display", "flex");
}

// Closes the dialog menu for import.
function closeImportDialog() {
    $("#import").css("display", "none");
}

// Import file
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

// Function that is used for the resize
// Making the page more responsive
function canvasSize() {
    widthWindow = (window.innerWidth - 20);
    heightWindow = (window.innerHeight - 144);
    canvas.setAttribute("width", widthWindow);
    canvas.setAttribute("height", heightWindow);
    ctx.clearRect(sx, sy, widthWindow, heightWindow);
    ctx.translate(sx, sy);
    ctx.scale(1, 1);
    ctx.scale(zoomValue, zoomValue);
}

// Listen if the window is the resized
window.addEventListener('resize', canvasSize);

// used to redraw each object on the screen
function updateGraphics() {
    ctx.clearRect(sx, sy, (widthWindow / zoomValue), (heightWindow / zoomValue));
    if (moveValue == 1) {
        ctx.translate((-mouseDiffX), (-mouseDiffY));
        moveValue = 0;
    }
    diagram.updateQuadrants();
    drawGrid();
    diagram.sortConnectors();
    diagram.draw();
    points.drawPoints();
    drawVirtualA4();
}

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

function eraseObject(object) {
    canvas.style.cursor = "default";
    var objectsToDelete = [];
    if (object.kind == 2) {
        //None lines
        if(object.symbolkind != 4){
            var lines = diagram.filter(symbol => symbol.symbolkind == 4);
            objectsToDelete = lines.filter(
                line => line.topLeft == object.middleDivider
                        || line.topLeft == object.centerPoint
                        || line.bottomRight == object.middleDivider
                        || line.bottomRight == object.centerPoint
                        || (object.hasConnectorFromPoint(line.topLeft) && (object.symbolkind == 3 || object.symbolkind == 5))
                        || (object.hasConnectorFromPoint(line.bottomRight) && (object.symbolkind == 3 || object.symbolkind == 5))
            );
        //lines
        }else{
            diagram.filter(
                symbol => symbol.symbolkind == 3 || symbol.symbolkind == 5)
                    .filter(symbol =>   symbol.hasConnector(object.topLeft)
                                     && symbol.hasConnector(object.bottomRight))
                    .forEach(symbol => {
                        symbol.removePointFromConnector(object.topLeft);
                        symbol.removePointFromConnector(object.bottomRight);
                    });

            var attributesAndRelations = diagram.filter(symbol => symbol.symbolkind == 2 || symbol.symbolkind == 5);
            //Check if the line has a common point with a centerpoint of attributes or relations.
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
    } else if (object.kind == 1) {
        object.erase();
    }
    diagram.deleteObject(object);
    objectsToDelete.forEach(eraseObject);
    updateGraphics();
}

//-------------------------------------------------------------------------//
// Create function that changes the id "loginBoxTitle" to "Delete Object".
//-------------------------------------------------------------------------//

function changeLoginBoxTitleDelete() {
    document.getElementById("loginBoxTitle").innerHTML = "Delete Object";
}

//-------------------------------------------------------------------------//
// Create function that changes the id "loginBoxTitle" to "Appearance".
//-------------------------------------------------------------------------//

function changeLoginBoxTitleAppearance() {
    document.getElementById("loginBoxTitle").innerHTML = "Appearance";
}

function eraseSelectedObject() {
    canvas.style.cursor = "default";
    //Issue: Need to remove the crosses
    if(selected_objects.length == 0){
        showMenu().innerHTML = "No item selected<type='text'>";
        changeLoginBoxTitleDelete();
        $(".loginBox").draggable();
    }
    for(var i = 0; i < selected_objects.length; i++){
        eraseObject(selected_objects[i]);
    }
    selected_objects = [];
    lastSelectedObject = -1;
    updateGraphics();
}

function setMode(mode){ //"CreateClass" yet to be implemented in .php
    canvas.style.cursor = "default";
    uimode = mode;
    if(mode == 'Square' || mode == 'Free' || mode == 'Text') {
      uimode = "CreateFigure";
      if(figureType == "Free"){
          cancelFreeDraw();
      }
      figureType = mode;
    }
}

$(document).ready(function(){
    $("#linebutton, #attributebutton, #entitybutton, #relationbutton, #squarebutton, #drawfreebutton, #classbutton, #drawtextbutton").click(function(){
        canvas.removeEventListener('mousedown', getMousePos, false);
        canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
        canvas.removeEventListener('mouseup', mouseupcanvas, false);
        $("#moveButton").removeClass("pressed").addClass("unpressed");
        $("#moveButton").css("visibility", "hidden");
        if ($(this).hasClass("pressed")){
            $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
            uimode = "normal";
        } else {
            $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
            $(this).removeClass("unpressed").addClass("pressed");
        }
    });
});

function setTextSizeEntity() {
    diagram[lastSelectedObject].properties['sizeOftext'] = document.getElementById('TextSize').value;
}

function setType() {
    var elementVal = document.getElementById('object_type').value;

    diagram[lastSelectedObject].properties['key_type'] = elementVal;
    updateGraphics();
}

function connectedObjects(line) {
    var privateObjects = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind != 4) {
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

// crosses are only visible in developermode
function cross(xCoordinate, yCoordinate) {
    ctx.strokeStyle = "#4f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xCoordinate - crossSize, yCoordinate - crossSize);
    ctx.lineTo(xCoordinate + crossSize, yCoordinate + crossSize);
    ctx.moveTo(xCoordinate + crossSize, yCoordinate - crossSize);
    ctx.lineTo(xCoordinate - crossSize, yCoordinate + crossSize);
    ctx.stroke();
}

function drawGrid() {
    ctx.lineWidth = 1;
    var quadrantX;
    var quadrantY;

    if (sx < 0) quadrantX = sx;
    else quadrantX = -sx;

    if (sy < 0) quadrantY = sy;
    else quadrantY = -sy;

    for (var i = 0 + quadrantX; i < quadrantX + (widthWindow / zoomValue); i++) {
        if (i % 5 == 0) ctx.strokeStyle = "rgb(208, 208, 220)"; //This is a "thick" line
        else ctx.strokeStyle = "rgb(238, 238, 250)";
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0 + sy);
        ctx.lineTo(i * gridSize, (heightWindow / zoomValue) + sy);
        ctx.stroke();
        ctx.closePath();
    }
    for (var i = 0 + quadrantY; i < quadrantY + (heightWindow / zoomValue); i++) {
        if (i % 5 == 0) ctx.strokeStyle = "rgb(208, 208, 220)"; //This is a "thick" line
        else ctx.strokeStyle = "rgb(238, 238, 250)";
        ctx.beginPath();
        ctx.moveTo(0 + sx, i * gridSize);
        ctx.lineTo((widthWindow / zoomValue) + sx, i * gridSize);
        ctx.stroke();
        ctx.closePath();
    }
}

// draws the whole background gridlayout
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

//remove all elements in the diagram array. it hides the points by placing them beyond the users view.
function clearCanvas() {
    while (diagram.length > 0) {
        diagram[diagram.length - 1].erase();
        diagram.pop();
    }
    for (var i = 0; i < points.length;) {
        points.pop();
    }
    updateGraphics();
    SaveState();
}

// the purpose is not very clear
var consloe = {};
consloe.log = function(gobBluth) {
    document.getElementById("consloe").innerHTML = ((JSON.stringify(gobBluth) + "<br>") + document.getElementById("consloe").innerHTML);
}



//debugMode this function show and hides crosses and the consol.
var ghostingCrosses = false; // used to repressent a switch for whenever the debugMode is enabled or not.
function debugMode() {
    if(ghostingCrosses) {
        crossStrokeStyle1 = "#f64";
        crossFillStyle = "#d51";
        crossStrokeStyle2 = "#d51";
        ghostingCrosses = false;
    } else {
        crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
        crossFillStyle = "rgba(255, 102, 68, 0.0)";
        crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
        ghostingCrosses = true;
    }
    updateGraphics();
    setCheckbox($("a:contains('Developer mode')"), !ghostingCrosses);
}

/******************************************************************************************
calculate the hash. does this by converting all objects to strings from diagram.
then do some sort of calculation. used to save the diagram. it also save the local diagram
*******************************************************************************************/
function hashFunction() {
    var diagramToString = "";
    var hash = 0;
    for (var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i])
    }
    if (diagram.length != 0) {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;         // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
        if (currentHash != hexHash) {
            localStorage.setItem('localhash', hexHash);
            for (var i = 0; i < diagram.length; i++) {
                c[i] = diagram[i].constructor.name;
                c[i] = c[i].replace(/"/g,"");
            }
            a = JSON.stringify({diagram:diagram, points:points, diagramNames:c});
            localStorage.setItem('localdiagram', a);
            return hexHash;
        }
    }
}

//--------------------------------------------------------------------------------
//This function is used to hash the current diagram, but not storing it locally,
//so we can compare the current hash with the hash after we have made some changes
// to see if it need to be saved.
//--------------------------------------------------------------------------------
function hashCurrent() {
    var hash = 0;
    var diagramToString = "";
    for (var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i])
    }
    for (var i = 0; i < diagramToString.length; i++) {
        var char = diagramToString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;         // Convert to 32bit integer
    }
    currentHash = hash.toString(16);
}

// retrive an old diagram if it exist.
function loadDiagram() {
    var checkLocalStorage = localStorage.getItem('localdiagram');
    //loacal storage and hash
    if (checkLocalStorage != "" && checkLocalStorage != null) {
        var localDiagram = JSON.parse(localStorage.getItem('localdiagram'));
    }
    var localHexHash = localStorage.getItem('localhash');
    var diagramToString = "";
    var hash = 0;
    for(var i = 0; i < diagram.length; i++) {
        diagramToString += JSON.stringify(diagram[i]);
    }
    if (diagram.length != 0) {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;         // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
    }
    if (typeof localHexHash !== "undefined" && typeof localDiagram !== "undefined") {
        if (localHexHash != hexHash) {
            b = JSON.parse(JSON.stringify(localDiagram));
            for (var i = 0; i < b.diagram.length; i++) {
                if (b.diagramNames[i] == "Symbol") {
                    b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
                } else if (b.diagramNames[i] == "Path") {
                    b.diagram[i] = Object.assign(new Path, b.diagram[i]);
                }
            }
            diagram.length = b.diagram.length;
            for (var i = 0; i < b.diagram.length; i++) {
                diagram[i] = b.diagram[i];
            }
            // Points fix
            for (var i = 0; i < b.points.length; i++) {
                b.points[i] = Object.assign(new Path, b.points[i]);
            }
            points.length = b.points.length;
            for (var i = 0; i < b.points.length; i++) {
                points[i] = b.points[i];
            }
            updateGraphics();
        }
    }

    SaveState();
}

// this function is running when you click the button clear diagram
function removeLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem("localdiagram");
    }
}

// Function that rewrites the values of zoom and x+y that's under the canvas element
function reWrite() {
    document.getElementById("valuesCanvas").innerHTML = "<p><b>Zoom:</b> "
     + Math.round((zoomValue * 100)) + "%" + "   |   <b>Coordinates:</b> "
     + "X=" + canvasMouseX
     + " & Y=" + canvasMouseY + "</p>";
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
// Handles refresh, makes sure that the diagram after the refresh
// is equal to the diagram before refresh
//--------------------------------------------------------------------
function refreshFunction() {
    console.log("refreshFunction running");
    refreshTimer = setRefreshTime();
    if (refresh_lock == false) {
        console.log("refresh diagram");
        loadDiagram();
    }
}

function getCurrentDate() {
    console.log("getCurrentDate running");
    return new Date().getTime();
}

function setRefreshTime() {
  var time = 5000;
  lastDiagramEdit = localStorage.getItem('lastEdit');
  if (typeof lastDiagramEdit !== "undefined"){
    var timeDifference = getCurrentDate() - lastDiagramEdit;
    refresh_lock = timeDifference > 604800000 ? true : false;
    time = timeDifference <= 259200000 ? 5000 : 300000;
  }
  return time;
}

// the selected objects are locked
function lockSelected(){
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].locked = !selected_objects[i].locked;
        
        if(selected_objects[i].locked){
            selected_objects[i].drawLock();
        }
        else {
            updateGraphics();
        }
    }
}

function align(mode){
    for(var i = 0; i < diagram.length; i++){
        if(diagram[i].targeted == true && selected_objects.indexOf(diagram[i]) > -1){
            selected_objects.push(diagram[i]);
        }
    }
    if(mode == 'top'){
       alignTop(selected_objects);
    }
    else if(mode == 'left'){
       alignLeft(selected_objects);
    }
    else if(mode == 'bottom'){
       alignBottom(selected_objects);
    }
    else if(mode == 'right'){
       alignRight(selected_objects);
    }
    else if(mode == 'verticalCenter'){
       alignVerticalCenter(selected_objects);
    }
    else if(mode == 'horizontalCenter'){
       alignHorizontalCenter(selected_objects);
    }

    updateGraphics();
    hashFunction();
}

//---------------------------------------------------------------------
// these functions moves the objects either left, right, top or bottom
//---------------------------------------------------------------------
function alignLeft(selected_objects){
    var lowest_x = 99999;
    for(var i = 0; i < selected_objects.length; i++){
        if(points[selected_objects[i].topLeft].x < lowest_x){
            lowest_x = points[selected_objects[i].topLeft].x;
        }
    }
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].move(lowest_x-points[selected_objects[i].topLeft].x, 0);
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].y - points[b.centerPoint].y});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].y < points[temporary_objects[i-1].bottomRight].y + 30){
            var difference = points[temporary_objects[i].topLeft].y - points[temporary_objects[i-1].bottomRight].y - 30;
            temporary_objects[i].move(0, -difference);
        }
    }
}

function alignTop(selected_objects){
    var lowest_y = 99999;
    for(var i = 0; i < selected_objects.length; i++){
        if(points[selected_objects[i].topLeft].y < lowest_y){
            lowest_y = points[selected_objects[i].topLeft].y;
        }
    }
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].move(0, lowest_y-points[selected_objects[i].topLeft].y);
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].x - points[b.centerPoint].x});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].x < points[temporary_objects[i-1].bottomRight].x + 30){
            var difference = points[temporary_objects[i].topLeft].x - points[temporary_objects[i-1].bottomRight].x - 30;
            temporary_objects[i].move(-difference, 0);
        }
    }
}

function alignRight(selected_objects){
    var highest_x = 0;
    for(var i = 0; i < selected_objects.length; i++){
        if(points[selected_objects[i].bottomRight].x > highest_x){
            highest_x = points[selected_objects[i].bottomRight].x;
        }
    }
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].move(highest_x-points[selected_objects[i].bottomRight].x, 0);
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].y - points[b.centerPoint].y});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].y < points[temporary_objects[i-1].bottomRight].y + 30){
            var difference = points[temporary_objects[i].topLeft].y - points[temporary_objects[i-1].bottomRight].y - 30;
            temporary_objects[i].move(0, -difference);
        }
    }
}

function alignBottom(selected_objects){
    var highest_y = 0;
    for(var i = 0; i < selected_objects.length; i++){
        if(points[selected_objects[i].bottomRight].y > highest_y){
            highest_y = points[selected_objects[i].bottomRight].y;
        }
    }
    for(var i = 0; i < selected_objects.length; i++){
        selected_objects[i].move(0, highest_y-points[selected_objects[i].bottomRight].y);
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].x - points[b.centerPoint].x});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].x < points[temporary_objects[i-1].bottomRight].x + 30){
            var difference = points[temporary_objects[i].topLeft].x - points[temporary_objects[i-1].bottomRight].x - 30;
            temporary_objects[i].move(-difference, 0);
        }
    }
}

//--------------------------------------------------------------------
// these functions move the objects either horizontal or vertical
//--------------------------------------------------------------------
function alignVerticalCenter(selected_objects){
    var highest_x = 0, lowest_x = 99999, selected_center_x = 0;
    var temporary_objects = [];
    for(var i = 0; i < selected_objects.length; i++){
        if(points[selected_objects[i].topLeft].x > highest_x){
            highest_x = points[selected_objects[i].bottomRight].x;
        }
        if(points[selected_objects[i].bottomRight].x < lowest_x){
            lowest_x = points[selected_objects[i].topLeft].x;
        }
    }
    selected_center_x = (highest_x-lowest_x)/2;
    for(var i = 0; i < selected_objects.length; i++){
        var object_width = (points[selected_objects[i].topLeft].x - points[selected_objects[i].bottomRight].x);
        selected_objects[i].move((-points[selected_objects[i].topLeft].x) + (lowest_x+selected_center_x) + object_width/2, 0);
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].y - points[b.centerPoint].y});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].y < points[temporary_objects[i-1].bottomRight].y + 30){
            var difference = points[temporary_objects[i].topLeft].y - points[temporary_objects[i-1].bottomRight].y - 30;
            temporary_objects[i].move(0, -difference);
        }
    }
}
function alignHorizontalCenter(selected_objects){
    var highest_y = 0, lowest_y = 99999, selected_center_y = 0;
    var temporary_objects = [];
    for(var i = 0; i < selected_objects.length; i++){
        temporary_objects.push(selected_objects[i]);
        if(points[selected_objects[i].bottomRight].y > highest_y){
            highest_y = points[selected_objects[i].bottomRight].y;
        }
        if(points[selected_objects[i].topLeft].y < lowest_y){
            lowest_y = points[selected_objects[i].topLeft].y;
        }
    }
    selected_center_y = (highest_y-lowest_y)/2;
    for(var i = 0; i < selected_objects.length; i++){
        var object_height = (points[selected_objects[i].bottomRight].y - points[selected_objects[i].topLeft].y);
        selected_objects[i].move(0, -((points[selected_objects[i].topLeft].y - (lowest_y+selected_center_y))+object_height/2));
    }

    // Added spacing when there are objects that overlap eachother.
    temporary_objects = removeDuplicatesInList(selected_objects);
    temporary_objects = temporary_objects.sort(function(a, b){return points[a.centerPoint].x - points[b.centerPoint].x});
    for(var i = 1; i < temporary_objects.length; i++){
        if(points[temporary_objects[i].topLeft].x < points[temporary_objects[i-1].bottomRight].x + 30){
            var difference = points[temporary_objects[i].topLeft].x - points[temporary_objects[i-1].bottomRight].x - 30;
            temporary_objects[i].move(-difference, 0);
        }
    }
}
// ----------------------------------------------------------------------------
// Objects in selected_objects get duplicated for some reason.
// This function returns a list without the duplicated objects.
// ----------------------------------------------------------------------------

function removeDuplicatesInList(selected_objects){
    var temporary_objects = [];
    for(var i = 0; i < selected_objects.length; i++){
        if(temporary_objects.indexOf(selected_objects[i]) == -1){
            temporary_objects.push(selected_objects[i]);
        }
    }
    return temporary_objects;
}

function sortObjects(selected_objects, mode){
  //Sorts objects by X or Y position
  var position = [];

      for(var i = 0; i < selected_objects.length; i++){
        if(mode=='vertically') position.push(points[selected_objects[i].topLeft].y);
        else if(mode=='horizontally') position.push(points[selected_objects[i].topLeft].x);
      }
      position.sort(function(a,b) { return a - b });

      var private_objects = selected_objects.splice([]);
      var swap = null;

      for(var i = 0; i < private_objects.length; i++){
        swap = private_objects[i];
          for(var j = 0; j < position.length; j++){
            if(i==j) continue;
              if((mode=='vertically' && points[private_objects[i].topLeft].y == position[j])
              || (mode=='horizontally' && points[private_objects[i].topLeft].x == position[j])){
                  private_objects[i] = private_objects[j];
                  private_objects[j] = swap;
              }
            }
        }

  return private_objects;
}

// unclear what the purpose is of distribute, does not seem to work at all
function distribute(axis){
    var spacing = 32;
    var selected_objects = [];

    for(var i = 0; i < diagram.length; i++){
        if(diagram[i].targeted == true  && selected_objects.indexOf(diagram[i]) > -1){
            selected_objects.push(diagram[i]);
        }
    }

    if(axis=='vertically'){
        distributeVertically(selected_objects, spacing);
    }else if(axis=='horizontally'){
        distributeHorizontally(selected_objects, spacing);
    }
        // There is a posibility for more types
    updateGraphics();
    hashFunction();
}

function distributeVertically(selected_objects, spacing){
    selected_objects = sortObjects(selected_objects, 'vertically');

    for(var i = 1; i < selected_objects.length; i++){
        var object_height = (points[selected_objects[i].bottomRight].y - points[selected_objects[i].topLeft].y);

        var newy = ((points[selected_objects[i-1].topLeft].y)-(points[selected_objects[i].topLeft].y));
        selected_objects[i].move(0, newy+object_height+spacing);
    }
}

function distributeHorizontally(selected_objects, spacing){
    selected_objects = sortObjects(selected_objects, 'horizontally');

    for(var i = 1; i < selected_objects.length; i++){
        var object_width = (points[selected_objects[i].bottomRight].x - points[selected_objects[i].topLeft].x);

        var newx = ((points[selected_objects[i-1].topLeft].x)-(points[selected_objects[i].topLeft].x));
        selected_objects[i].move(newx+object_width+spacing, 0);
    }
}

// removes the last object that was drawn
function undoDiagram() {
    if (diagramNumberHistory > 1) diagramNumberHistory--;
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumberHistory);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}

// restores the last object that was removed
function redoDiagram() {
    if (diagramNumberHistory < diagramNumber) diagramNumberHistory++;
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumberHistory);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}

// not clear where this method is used
function diagramToSVG() {
    var str = "";
    // Convert figures to SVG first so they appear behind other objects
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 1) str += diagram[i].figureToSVG();
    }
    // Convert lines to SVG second so they appear behind other symbols but above figures
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind == 4) str += diagram[i].symbolToSVG(i);
    }
    // Convert other objects to SVG
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind != 4) str += diagram[i].symbolToSVG(i);
    }
    return str;
}

//------------------------------------------------------------------------------
// functions which are used to change the global appearance of each object
// that has been drawn on the screen
//------------------------------------------------------------------------------

// changes the thickness of the lines between objects, and the lines surrounding each object
function globalLineThickness() {
    for (var i = 0; i < diagram.length; i++) {
        diagram[i].properties['lineWidth'] = document.getElementById('line-thickness').value;
    }
}

//change the font on all entities to the same font.
function globalFont() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 1 || diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].properties['font'] = document.getElementById('font').value;
        }
    }
}
//change the font color on all entities to the same color.
function globalFontColor() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].properties['fontColor'] = document.getElementById('fontColor').value;
        }
    }
}

//change the text size on all entities to the same size.
function globalTextSize() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].properties['sizeOftext'] = document.getElementById('TextSize').value;
        }
    }
}

//change the fillcolor on all entities to the same size.
function globalFillColor() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].properties['symbolColor'] = document.getElementById('FillColor').value;
        } else { diagram[i].fillColor = document.getElementById('FillColor').value;}
    }
}

//change the strokecolor on all entities to the same size.
function globalStrokeColor() {
    for (var i = 0; i < diagram.length; i++) {
            diagram[i].properties['strokeColor'] = document.getElementById('StrokeColor').value;
    }
}

function undoDiagram() {
    if (diagramNumberHistory > 1) diagramNumberHistory--;
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumberHistory);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}
function redoDiagram() {
    if (diagramNumberHistory < diagramNumber) diagramNumberHistory++;
    var tmpDiagram = localStorage.getItem("diagram" + diagramNumberHistory);
    if (tmpDiagram != null) LoadImport(tmpDiagram);
}
function diagramToSVG() {
    var str = "";
    // Convert figures to SVG first so they appear behind other objects
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 1) str += diagram[i].figureToSVG();
    }
    // Convert lines to SVG second so they appear behind other symbols but above figures
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind == 4) str += diagram[i].symbolToSVG(i);
    }
    // Convert other objects to SVG
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind != 4) str += diagram[i].symbolToSVG(i);
    }
    return str;
}
// Check or uncheck the checkbox contained in 'element'
// This function adds a checkbox element if there is none
function setCheckbox(element, check) {
    if ($(element).children(".material-icons").length == 0) {
        $(element).append("<i class=\"material-icons\" style=\"float: right; padding-right: 8px; font-size: 18px;\">check</i>");
    }

    if (check) {
        $(element).children(".material-icons").show();
    }else {
        $(element).children(".material-icons").hide();
    }
}

// ----------------------------------------------------------------------------
// Diagram toolbox
// ----------------------------------------------------------------------------

var toolbarState;

function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    toolbarState = (localStorage.getItem("toolbarState") != null) ? localStorage.getItem("toolbarState") : 0;
    switchToolbar();
    element.style.display = "inline-block";
}

function toggleToolbarMinimize(){
    if($("#minimizeArrow").hasClass("toolbarMaximized")){
        $(".application-toolbar").slideUp("fast");
        $("#minimizeArrow").removeClass("toolbarMaximized").addClass("toolbarMinimized");
    }else{
        $(".application-toolbar").slideDown("fast");
        $("#minimizeArrow").removeClass("toolbarMinimized").addClass("toolbarMaximized");
    }
}

function toggleToolbarLayout(){
    if($("#diagram-toolbar").height()>$("#diagram-toolbar").width()){
        $(".application-toolbar").css({"display": "flex", "flex-direction": "column"});
        $(".toolbarArrows").css({"width": "1.7em"});
        $("#diagram-toolbar").css({"width":"auto"});
        $("#toolbar-switcher").css({"width": "1.7em", "width": "","justify-content":"center", "margin": "0 30%", "padding": "0"});
        $(".label").css({"padding": "0 0 0 15px"});
        $(".toolsContainer").css({"display": "flex"});
    }else{
        $(".application-toolbar").css({"display": "", "flex-wrap": ""});
        $(".toolbarArrows").css({"width": "20%"});
        $("#diagram-toolbar").css({"width":""});
        $("#toolbar-switcher").css({"width": "auto","justify-content":"", "margin": "0", "padding": ""});
        $(".label").css({"padding": "0 4px"});
        $(".toolsContainer").css({"display": ""});
    }
}

//function for switching the toolbar state (All, ER, UML)
function switchToolbar(direction){
  var text = ["All", "ER", "UML", "Free"];
  if(direction == 'left'){
    toolbarState--;
    if(toolbarState < 0){
      toolbarState = 3;
    }
  }else if(direction == 'right'){
    toolbarState++;
    if(toolbarState > 3){
      toolbarState = 0;
    }
  }
  document.getElementById('toolbarTypeText').innerHTML = text[toolbarState];
  localStorage.setItem("toolbarState", toolbarState);
  //hides irrelevant buttons, and shows relevant buttons
  if(toolbarState == 1){
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
  }else if( toolbarState == 2){
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
    $("#classbutton").show();
  }else if(toolbarState == 3){
    $(".toolbar-drawer").hide();
    $("#drawerDraw").show();
    $("#drawerUndo").show();
    $(".tlabel").hide();
    $("#labelDraw").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#squarebutton").show();
    $("#drawfreebutton").show();
  }
  else{
    $(".toolbar-drawer").show();
    $(".label").show();
    $(".buttonsStyle").show();
  }

  document.getElementById('toolbar-switcher').value = toolbarState;
}


$( function() {
    $( "#diagram-toolbar" ).draggable();
} );

var toolbarState;

const toolbarER = 1;
const toolbarUML = 2;
const toolbarFree = 3;

function initToolbox(){
    var element = document.getElementById('diagram-toolbar');
    var myCanvas = document.getElementById('myCanvas');
    var bound = myCanvas.getBoundingClientRect();
    element.style.top = (bound.top+"px");
    toolbarState = (localStorage.getItem("toolbarState") != null) ? localStorage.getItem("toolbarState") : 0;
    switchToolbar();
    element.style.display = "inline-block";
    //element.style.height = (bound.bottom-bound.top-200+"px");
    //element.style.height = (400+"px");
}

function toggleToolbarMinimize(){
    if($("#minimizeArrow").hasClass("toolbarMaximized")){
        $(".application-toolbar").slideUp("fast");
        $("#minimizeArrow").removeClass("toolbarMaximized").addClass("toolbarMinimized");
    }else{
        $(".application-toolbar").slideDown("fast");
        $("#minimizeArrow").removeClass("toolbarMinimized").addClass("toolbarMaximized");
    }
}

function toggleToolbarLayout(){
    if($("#diagram-toolbar").height()>$("#diagram-toolbar").width()){
        $(".application-toolbar").css({"display": "flex", "flex-direction": "column"});
        $(".toolbarArrows").css({"width": "1.7em"});
        $("#diagram-toolbar").css({"width":"auto"});
        $("#toolbar-switcher").css({"width": "1.7em", "width": "","justify-content":"center", "margin": "0 30%", "padding": "0"});
        $(".label").css({"padding": "0 0 0 15px"});
        $(".toolsContainer").css({"display": "flex"});
    }else{
        $(".application-toolbar").css({"display": "", "flex-wrap": ""});
        $(".toolbarArrows").css({"width": "20%"});
        $("#diagram-toolbar").css({"width":""});
        $("#toolbar-switcher").css({"width": "auto","justify-content":"", "margin": "0", "padding": ""});
        $(".label").css({"padding": "0 4px"});
        $(".toolsContainer").css({"display": ""});
    }
}

//function for switching the toolbar state (All, ER, UML), not sure what the numbers 0 an 3 mean
function switchToolbar(direction){
  var text = ["All", "ER", "UML", "Free"];
  if(direction == 'left'){
    toolbarState--;
    if(toolbarState < 0){
      toolbarState = 3;
    }
  }else if(direction == 'right'){
    toolbarState++;
    if(toolbarState > 3){
      toolbarState = 0;
    }
  }
  document.getElementById('toolbarTypeText').innerHTML = text[toolbarState];
  localStorage.setItem("toolbarState", toolbarState);
  //hides irrelevant buttons, and shows relevant buttons
  if(toolbarState == toolbarER){
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
  }else if( toolbarState == toolbarUML){
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
    $("#classbutton").show();
  }else if(toolbarState == toolbarFree){
    $(".toolbar-drawer").hide();
    $("#drawerDraw").show();
    $("#drawerUndo").show();
    $(".tlabel").hide();
    $("#labelDraw").show();
    $("#labelUndo").show();
    $(".buttonsStyle").hide();
    $("#squarebutton").show();
    $("#drawfreebutton").show();
  }
  else{ // shows all alternatives in the toolbar
    $(".toolbar-drawer").show();
    $(".label").show();
    $(".buttonsStyle").show();
  }

  document.getElementById('toolbar-switcher').value = toolbarState;
}

$( function() {
    $( "#diagram-toolbar" ).draggable();
} );

// ----------------------------------
// DIAGRAM MOUSE SECTION
// ----------------------------------

// Function for the zoom in and zoom out in the canvas element
function zoomInMode() {
    var oldZoom = zoomValue;
    zoomValue = document.getElementById("ZoomSelect").value;
    var newScale = (zoomValue/oldZoom);
    ctx.scale(newScale,newScale);
    reWrite();
    updateGraphics();
}

// Recursive Pos of div in document - should work in most browsers
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
    if (sel.distance <= tolerance) { // sel.distance = the distance of the mouse from each corner point of the object
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

function mousemoveevt(ev, t) {
    // Get canvasMouse coordinates for both X & Y.
    canvasMouseX = (ev.clientX - canvas.offsetLeft) * (1 / zoomValue);
    canvasMouseY = -(ev.clientY - canvas.offsetTop) * (1 / zoomValue);
    // Call reWrite() to update the canvasMouseX & canvasMouseY on the page.
    reWrite();
    xPos = ev.clientX;
    yPos = ev.clientY;
    oldMouseCoordinateX = currentMouseCoordinateX;
    oldMouseCoordinateY = currentMouseCoordinateY;
    hovobj = diagram.itemClicked();
    if (ev.pageX || ev.pageY == 0) { // Chrome. Tracking mouse movement
        currentMouseCoordinateX = (((ev.pageX - canvas.offsetLeft) * (1 / zoomValue)) + (sx * (1 / zoomValue)));
        currentMouseCoordinateY = (((ev.pageY - canvas.offsetTop) * (1 / zoomValue)) + (sy * (1 / zoomValue)));
    } else if (ev.layerX || ev.layerX == 0) { // Firefox. Tracking mouse movement
        currentMouseCoordinateX = (((ev.layerX - canvas.offsetLeft) * (1 / zoomValue)) + (sx * (1 / zoomValue)));
        currentMouseCoordinateY = (((ev.layerY - canvas.offsetTop) * (1 / zoomValue)) + (sy * (1 / zoomValue)));
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera. Tracking mouse movement
        currentMouseCoordinateX = (((ev.offsetX - canvas.offsetLeft) * (1 / zoomValue)) + (sx * (1 / zoomValue)));
        currentMouseCoordinateY = (((ev.offsetY - canvas.offsetTop) * (1 / zoomValue)) + (sy * (1 / zoomValue)));
    }
    if (md == 0) {
        // Select a new point only if mouse is not already moving a point or selection box
        sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
        // If mouse is not pressed highlight closest point
        points.clearAllSelects();
        movobj = diagram.itemClicked();
    } else if (md == 1) {
        // If mouse is pressed down and no point is close show selection box
    } else if (md == 2) {
        if(!sel.point.fake){
            sel.point.x = currentMouseCoordinateX;
            sel.point.y = currentMouseCoordinateY;
            //If we changed a point of a path object,
            //  we need to recalculate the bounding-box so that it will remain clickable.
            if(diagram[lastSelectedObject].kind == 1){
                diagram[lastSelectedObject].calculateBoundingBox();
            }
        } else {
            sel.point.x.x = currentMouseCoordinateX;
            sel.point.y.y = currentMouseCoordinateY;
        }
        // If mouse is pressed down and at a point in selected object - move that point
    } else if (md == 3) {
        // If mouse is pressed down inside a movable object - move that object
        if (movobj != -1 ) {
            uimode = "Moved";
            $(".buttonsStyle").removeClass("pressed").addClass("unpressed");
            for (var i = 0; i < diagram.length; i++) {
                if (diagram[i].targeted == true && !diagram[movobj].locked) {
                    if(snapToGrid){
                        currentMouseCoordinateX = Math.round(currentMouseCoordinateX / gridSize) * gridSize;
                        currentMouseCoordinateY = Math.round(currentMouseCoordinateY / gridSize) * gridSize;
                    }

                    diagram[i].move(currentMouseCoordinateX - oldMouseCoordinateX, currentMouseCoordinateY - oldMouseCoordinateY);
                }
            }
        }
    }
    if (md == 4 && uimode == "normal") {
        diagram.targetItemsInsideSelectionBox(currentMouseCoordinateX, currentMouseCoordinateY, startMouseCoordinateX, startMouseCoordinateY, true);
    } else {
        diagram.checkForHover(currentMouseCoordinateX, currentMouseCoordinateY);
    }
    updateGraphics();
    // Draw select or create dotted box
    if (md == 4) {
        if (figureType == "Free" && uimode == "CreateFigure"){
            if(p2 != null && !(isFirstPoint)) {
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(startMouseCoordinateX, startMouseCoordinateY);
                ctx.lineTo(currentMouseCoordinateX, currentMouseCoordinateY);
                ctx.strokeStyle = "#000";
                ctx.stroke();
                ctx.setLineDash([]);
                if (ghostingCrosses == true) {
                    crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                    crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                    crossFillStyle = "rgba(255, 102, 68, 0.0)";
                }
            }
        }else if(uimode == "CreateFigure" && figureType == "Square"){
            ctx.setLineDash([3, 3]);
            ctx.beginPath(1);
            ctx.moveTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.strokeStyle = "#d51";
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath(1);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        }else if (uimode == "CreateEREntity"){
            ctx.setLineDash([3, 3]);
            ctx.beginPath(1);
            ctx.moveTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath(1);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateERRelation"){
            ctx.setLineDash([3, 3]);
            var midx = startMouseCoordinateX+((currentMouseCoordinateX-startMouseCoordinateX)/2);
            var midy = startMouseCoordinateY+((currentMouseCoordinateY-startMouseCoordinateY)/2);
            ctx.beginPath(1);
            ctx.moveTo(midx, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, midy);
            ctx.lineTo(midx, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, midy);
            ctx.lineTo(midx, startMouseCoordinateY);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath(1);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateERAttr"){
            ctx.setLineDash([3, 3]);
            drawOval(startMouseCoordinateX, startMouseCoordinateY, currentMouseCoordinateX, currentMouseCoordinateY);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.setLineDash([]);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateLine") {
            // Path settings for preview line
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, currentMouseCoordinateY);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.setLineDash([]);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else {
            ctx.setLineDash([3, 3]);
            ctx.beginPath(1);
            ctx.moveTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, startMouseCoordinateY);
            ctx.lineTo(currentMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, currentMouseCoordinateY);
            ctx.lineTo(startMouseCoordinateX, startMouseCoordinateY);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath(1);
            if (ghostingCrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossFillStyle = "rgba(255, 102, 68, 0.0)";
            }
        }
    }
}

function mousedownevt(ev) {

    if(uimode == "Moved" && md != 4){
        uimode = "normal";
        md = 0;
    }

    if (uimode == "CreateLine") {

        md = 4;            // Box select or Create mode.
        startMouseCoordinateX = currentMouseCoordinateX;
        startMouseCoordinateY = currentMouseCoordinateY;
        //If you start on canvas or not
        if (hovobj == -1) {
            md = 0;
        } else {
            sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            //Store which object you are hovering over in lineStartObj
            lineStartObj = hovobj;

            //Get which kind of symbol mousedownevt execute on
            symbolStartKind = diagram[lineStartObj].symbolkind;

        }

    } else if (sel.distance < tolerance) {
        for (var i = 0; i < diagram.length; i++) {
            
        }
        md = 2;
    } else if (movobj != -1) {
        md = 3;
        handleSelect();
    } else {
        md = 4; // Box select or Create mode.
        if(uimode != "CreateFigure"){
            startMouseCoordinateX = currentMouseCoordinateX;
            startMouseCoordinateY = currentMouseCoordinateY;
        }
        if(uimode != "MoveAround" && !ctrlIsClicked){
            for (var i = 0; i < selected_objects.length; i++) {
                selected_objects[i].targeted = false;
            }
            lastSelectedObject = -1;
            selected_objects = [];
        }
        if(uimode == "CreateFigure" && figureType == "Square"){
            createFigure();
        }
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
            if(selected_objects.indexOf(last) < 0){
                selected_objects.push(last);
                last.targeted = true;
            }
            for (var i = 0; i < selected_objects.length; i++) {
                if (selected_objects[i].targeted == false) {
                    if(selected_objects.indexOf(last) < 0){
                        selected_objects.push(last);
                    }
                    selected_objects[i].targeted = true;
                }
            }
        } else {
            selected_objects = [];
            selected_objects.push(last);
            last.targeted = true;
        }
    } else if(uimode != "MoveAround"){
        if(ctrlIsClicked){
            var index = selected_objects.indexOf(last);
            if(index > -1){
                selected_objects.splice(index, 1);
            }
            last.targeted = false;
            //when deselecting object, set lastSelectedObject to index of last object in selected_objects
            lastSelectedObject = diagram.indexOf(selected_objects[selected_objects.length-1]);
        }
    }
}

function mouseupevt(ev) {
    if (uimode == "CreateFigure" && md == 4) {
        if(figureType == "Text"){
            createText(currentMouseCoordinateX, currentMouseCoordinateY);
        }
        createFigure();
        if(figureType == "Free") return;
    }
    // Code for creating a new class
    if (md == 4 && (uimode == "CreateClass" || uimode == "CreateERAttr" || uimode == "CreateEREntity" || uimode == "CreateERRelation")) {
        resize();

        // Add required points
        p1 = points.addPoint(startMouseCoordinateX, startMouseCoordinateY, false);
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        p3 = points.addPoint((startMouseCoordinateX + currentMouseCoordinateX) * 0.5, (startMouseCoordinateY + currentMouseCoordinateY) * 0.5, false);
    }
    var saveState = md == 4 && uimode != "normal";
    if(movobj > -1) {
        if(diagram[movobj].symbolkind != 4 && uimode == "Moved") saveState = true;
    }
    if (uimode == "CreateLine" && md == 4) {
        saveState = false;
        //Check if you release on canvas or try to draw a line from entity to entity
         if (hovobj == -1 || diagram[lineStartObj].symbolkind == 3 && diagram[hovobj].symbolkind == 3) {
            md = 0;
         }else{
              //Get which kind of symbol mouseupevt execute on
             symbolEndKind = diagram[hovobj].symbolkind;

             sel = diagram.closestPoint(currentMouseCoordinateX, currentMouseCoordinateY);
            //Check if you not start on a line and not end on a line, if then, set point1 and point2
            //okToMakeLine is a flag for this
            var okToMakeLine = true;
            if(symbolStartKind != 4 && symbolEndKind != 4){
                var createNewPoint = false;
                if (diagram[lineStartObj].symbolkind == 2) {
                    p1 = diagram[lineStartObj].centerPoint;
                } else {
                    createNewPoint = true;
                }

                //Code for making sure enitities not connect to the same attribute multiple times
                if(symbolEndKind == 3 && symbolStartKind == 2){
                    if(diagram[hovobj].connectorCountFromSymbol(diagram[lineStartObj]) > 0){
                        okToMakeLine= false;
                    }
                } else if(symbolEndKind == 2 && symbolStartKind == 3){
                    if(diagram[lineStartObj].connectorCountFromSymbol(diagram[hovobj]) > 0){
                        okToMakeLine= false;
                    }
                } else if(symbolEndKind == 3 && symbolStartKind == 5) {
                    if(diagram[hovobj].connectorCountFromSymbol(diagram[lineStartObj]) >= 2) okToMakeLine = false;
                } else if(symbolEndKind == 5 && symbolStartKind == 3) {
                    if(diagram[lineStartObj].connectorCountFromSymbol(diagram[hovobj]) >= 2) okToMakeLine = false;
                } else if(symbolEndKind == 5 && symbolStartKind == 5){
                    okToMakeLine = false;
                } else if((symbolEndKind == 1 && symbolStartKind != 1) || (symbolEndKind != 1 && symbolStartKind == 1)){
                    okToMakeLine = false;
                }
                if(diagram[lineStartObj] == diagram[hovobj]) okToMakeLine = false;
                if(okToMakeLine){
                    saveState = true;
                    if(createNewPoint) p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    if (diagram[hovobj].symbolkind == 2) {
                        p2 = diagram[hovobj].centerPoint;
                    } else{
                        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
                    }
                    diagram[lineStartObj].connectorTop.push({from:p1, to:p2});
                    diagram[hovobj].connectorTop.push({from:p2, to:p1});
                }
            }
        }
    }

    // Code for creating symbols when mouse is released
    // Symbol (1 UML diagram symbol 2 ER Attribute 3 ER Entity 4 Lines 5 ER Relation)
    if (uimode == "CreateClass" && md == 4) {
        classB = new Symbol(1); // UML
        classB.name = "New" + diagram.length;
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
    } else if (uimode == "CreateERAttr" && md == 4) {
        erAttributeA = new Symbol(2); // ER attributes
        erAttributeA.name = "Attr" + diagram.length;
        erAttributeA.topLeft = p1;
        erAttributeA.bottomRight = p2;
        erAttributeA.centerPoint = p3;
        erAttributeA.object_type = "";
        erAttributeA.fontColor = "#000";
        erAttributeA.font = "Arial";
        diagram.push(erAttributeA);
        //selecting the newly created attribute and open the dialogmenu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
    } else if (uimode == "CreateEREntity" && md == 4) {
        erEnityA = new Symbol(3); // ER entity
        erEnityA.name = "Entity" + diagram.length;
        erEnityA.topLeft = p1;
        erEnityA.bottomRight = p2;
        erEnityA.centerPoint = p3;
        erEnityA.arity = [];
        erEnityA.object_type = "";
        erEnityA.fontColor = "#000";
        erEnityA.font = "Arial";
        diagram.push(erEnityA);
        //selecting the newly created enitity and open the dialogmenu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
    } else if (uimode == "CreateLine" && md == 4){
        //Code for making a line, if start and end object are different, except attributes
        if((symbolStartKind != symbolEndKind || (symbolStartKind == 2 && symbolEndKind == 2) || symbolStartKind == 1 && symbolEndKind == 1) && (symbolStartKind != 4 && symbolEndKind != 4) && okToMakeLine){
            erLineA = new Symbol(4); // Lines
            erLineA.name = "Line" + diagram.length
            erLineA.topLeft = p1;
            erLineA.object_type = "";
            erLineA.bottomRight = p2;
            erLineA.centerPoint = p3;
            diagram.push(erLineA);
            //selecting the newly created enitity and open the dialogmenu.
            lastSelectedObject = diagram.length -1;
            diagram[lastSelectedObject].targeted = true;
            selected_objects.push(diagram[lastSelectedObject]);
            createCardinality();
            updateGraphics();
        }
    } else if (uimode == "CreateERRelation" && md == 4) {
        erRelationA = new Symbol(5); // ER Relation
        erRelationA.name = "Relation" + diagram.length;
        erRelationA.topLeft = p1;
        erRelationA.bottomRight = p2;
        erRelationA.centerPoint = p3;

        diagram.push(erRelationA);
        //selecting the newly created relation and open the dialog menu.
        lastSelectedObject = diagram.length -1;
        diagram[lastSelectedObject].targeted = true;
        selected_objects.push(diagram[lastSelectedObject]);
    } else if (md == 4 && uimode == "normal") {
        diagram.targetItemsInsideSelectionBox(currentMouseCoordinateX, currentMouseCoordinateY, startMouseCoordinateX, startMouseCoordinateY);
    }
    else if(uimode != "Moved" && !ctrlIsClicked && md != 4) {
        //Unselects every object.
        for(var i = 0; i < diagram.length; i++){
            diagram[i].targeted = false;
        }
        //Sets the clicked object as targeted
        selected_objects = [];
        if (lastSelectedObject >= 0) {
            selected_objects.push(diagram[lastSelectedObject]);
            //You have to target an object when you start to draw
            if(md != 0) diagram[lastSelectedObject].targeted = true;
        }
    }
    hashFunction();
    updateGraphics();
    diagram.updateLineRelations();
    // Clear mouse state
    md = 0;
    if(saveState) SaveState();

}

function doubleclick(ev) {
    var posistionX = (sx + xPos);
    var posistionY = (sy + yPos);

    var posX = currentMouseCoordinateX;
    var posY = currentMouseCoordinateY;

    if (lastSelectedObject != -1 && diagram[lastSelectedObject].targeted == true) {
        openAppearanceDialogMenu();
    } else {
        createText(posX, posY);
    }
}

function createText(posX, posY) {
    var text = new Symbol(6);
    text.name = "New Text" + diagram.length;
    text.textLines.push({text:text.name});

    var length  = ctx.measureText(text.name).width + 20;
    var fontsize = text.getFontsize();
    var height = fontsize + 20;

    text.fontColor = "#000000";
    text.font = "Arial";
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

// This is used when making the objects bigger or smaller
function resize() {
    if ((uimode == "CreateClass" || uimode == "CreateERAttr" || uimode == "CreateEREntity" || uimode == "CreateERRelation") && md == 4) {
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
        if(uimode == "CreateERRelation" && (currentMouseCoordinateX - startMouseCoordinateX < relationTemplate.width || currentMouseCoordinateY - startMouseCoordinateY < relationTemplate.height)){
            currentMouseCoordinateX = startMouseCoordinateX + relationTemplate.width;
            currentMouseCoordinateY = startMouseCoordinateY + relationTemplate.height;
        }
    }
}

//---------------------------------------
// MOVING AROUND IN THE CANVAS
//---------------------------------------
function movemode(e, t) {
    uimode = "MoveAround";
	$(".buttonsStyle").removeClass("pressed").addClass("unpressed");
    var button = document.getElementById("moveButton").className;
    var buttonStyle = document.getElementById("moveButton");
    canvas.removeEventListener("dblclick", doubleclick, false);
    if (button == "unpressed") {
        buttonStyle.style.visibility = 'visible';
		buttonStyle.className = "pressed";
        canvas.style.cursor = "all-scroll";
        canvas.addEventListener('mousedown', getMousePos, false);
        canvas.addEventListener('mouseup', mouseupcanvas, false);
    } else {
        buttonStyle.style.visibility = 'hidden';
		buttonStyle.className = "unpressed";
        canvas.addEventListener('dblclick', doubleclick, false);
        mousedownX = 0; mousedownY = 0;
        mousemoveX = 0; mousemoveY = 0;
        mouseDiffX = 0; mouseDiffY = 0;
        canvas.style.cursor = "default";
        canvas.removeEventListener('mousedown', getMousePos, false);
        canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
        canvas.removeEventListener('mouseup', mouseupcanvas, false);
        uimode = "normal";
    }
}

function activateMovearound(){
   movemode();
}

function deactivateMovearound(){
    movemode();
}

function getMousePos(e) {
    mousedownX = e.clientX;
    mousedownY = e.clientY;
    canvas.addEventListener('mousemove', mousemoveposcanvas, false);
}

function mousemoveposcanvas(e) {
    mousemoveX = e.clientX;
    mousemoveY = e.clientY;
    mouseDiffX = (mousedownX - mousemoveX);
    mouseDiffY = (mousedownY - mousemoveY);
    sx += mouseDiffX;
    sy += mouseDiffY;
    mousedownX = mousemoveX;
    mousedownY = mousemoveY;
    moveValue = 1;
    drawGrid();
    updateGraphics();
    reWrite();
}

function mouseupcanvas(e) {
    canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
}


//--------------------------------------------------------------------
// Basic functionality
// The building blocks for creating the menu
//--------------------------------------------------------------------
function showMenu(){
    canvas.style.cursor = "default";
    $("#appearance").show();
    $("#appearance").width("auto");
    dimDialogMenu(true);
    hashCurrent();
    return document.getElementById("f01");
}

function openAppearanceDialogMenu() {
    /*
     * Opens the dialog menu for appearance.
     */
    
    $(".loginBox").draggable();
    var form = showMenu();
    appearanceMenuOpen = true;
    objectAppearanceMenu(form);
}
function closeAppearanceDialogMenu() {
    /*
     * Closes the dialog menu for appearance.
     */
     //if the X
     if(globalAppearanceValue == 1){
       var tmpDiagram = localStorage.getItem("diagram" + diagramNumberHistory);
       if (tmpDiagram != null) LoadImport(tmpDiagram);
     }
     $(".loginBox").draggable('destroy');
    appearanceMenuOpen = false;
    classAppearanceOpen = false;
    textAppearanceOpen = false;
    globalAppearanceValue = 0;
    hashFunction();
    $("#appearance").hide();
    dimDialogMenu(false);
    document.removeEventListener("click", clickOutsideDialogMenu);
}

function clickOutsideDialogMenu(ev) {
    /*
     * Closes the dialog menu when click is done outside box.
     */
    $(document).mousedown(function (ev) {
        var container = $("#appearance");
        if (!container.is(ev.target) && container.has(ev.target).length === 0) {
            globalAppearanceValue = 0;
            closeAppearanceDialogMenu();
        }
    });
}

function clickEnterOnDialogMenu(ev) {
    /*
     * Closes the dialog menu when the enter button is pressed.
     */
    $(document).keypress(function (ev) {
        var container = $("#appearance");
        if (ev.which == 13 && appearanceMenuOpen && !classAppearanceOpen && !textAppearanceOpen) {
            globalAppearanceValue = 0;
            closeAppearanceDialogMenu();
            // Is called in the separate appearance php-files at the buttons.
            // Called here since an enter press doesn't relate to any element
            changeObjectAppearance();
        }
    });
}

function dimDialogMenu(dim) {
    if (dim == true) {
        $("#appearance").css("display", "flex");
    } else {
        $("#appearance").css("display", "none");
    }
}

// Loads the menu which is used to change apperance of ER and free draw objects.
function loadFormIntoElement(element, dir){
  //Ajax
  var file = new XMLHttpRequest();
  file.open('GET', dir);
  file.onreadystatechange = function(){

    if(file.readyState === 4){
      element.innerHTML = file.responseText;
      if(globalAppearanceValue == 0 && diagram[lastSelectedObject].kind == 2){
        document.getElementById('nametext').value = diagram[lastSelectedObject].name;
        setSelectedOption('object_type', diagram[lastSelectedObject].properties['key_type']);
        setSelectedOption('symbolColor', diagram[lastSelectedObject].properties['symbolColor']);
        setSelectedOption('font', diagram[lastSelectedObject].properties['font']);
        setSelectedOption('fontColor', diagram[lastSelectedObject].properties['fontColor']);
        setSelectedOption('TextSize', diagram[lastSelectedObject].properties['sizeOftext']);
        setSelectedOption('LineColor', diagram[lastSelectedObject].properties['strokeColor']);
      }else if(globalAppearanceValue == 0 && diagram[lastSelectedObject].kind == 1){
        setSelectedOption('figureFillColor', diagram[lastSelectedObject].fillColor);
        document.getElementById('figureOpacity').value = (diagram[lastSelectedObject].opacity * 100);
        setSelectedOption('LineColor', diagram[lastSelectedObject].strokeColor);
      }
    }
  }
  file.send();
}

// Loads the menu to change cardinality
function loadLineForm(element, dir){
    //Ajax
    var file = new XMLHttpRequest();
    file.open('GET', dir);
    file.onreadystatechange = function(){
        if(file.readyState === 4){
            element.innerHTML = file.responseText;
            if(globalAppearanceValue == 0){
                var cardinalityVal = diagram[lastSelectedObject].cardinality[0].value
                var cardinalityValUML = diagram[lastSelectedObject].cardinality[0].valueUML;
                var tempCardinality = cardinalityVal == "" || cardinalityVal == null ? "None" : cardinalityVal;
                var tempCardinalityUML = cardinalityValUML == "" || cardinalityValUML == null ? "None" : cardinalityValUML;

                setSelectedOption('object_type', diagram[lastSelectedObject].properties['key_type']);
                setSelectedOption('cardinality', tempCardinality);
                if(cardinalityValUML) setSelectedOption('cardinalityUml', tempCardinalityUML);
            }
        }
    }
    file.send();
}

//Loads the appearance menu for UML-class
function loadUMLForm(element, dir){
  var file = new XMLHttpRequest();
  file.open('GET', dir);
  file.onreadystatechange = function(){
    if(file.readyState === 4){
      element.innerHTML = file.responseText;
      if(globalAppearanceValue == 0){
        var attributesText = "";
        var operationsText = "";
        var attributesTextArea = document.getElementById('UMLAttributes');
        var operationsTextArea = document.getElementById('UMLOperations');
        for(var i = 0; i < diagram[lastSelectedObject].attributes.length;i++){
          attributesText += diagram[lastSelectedObject].attributes[i].text;
          if(i < diagram[lastSelectedObject].attributes.length - 1) attributesText += "\n";
        }
        for(var i = 0; i < diagram[lastSelectedObject].operations.length;i++){
          operationsText += diagram[lastSelectedObject].operations[i].text
          if(i < diagram[lastSelectedObject].operations.length - 1) operationsText += "\n";
        }

        document.getElementById('nametext').value = diagram[lastSelectedObject].name;
        attributesTextArea.value = attributesText;
        operationsTextArea.value = operationsText;
      }
    }
  }
  file.send();
}
//Loads the appearance menu for text
function loadTextForm(element, dir){
  var file = new XMLHttpRequest();
  file.open('GET', dir);
  file.onreadystatechange = function(){
    if(file.readyState === 4){
      element.innerHTML = file.responseText;
      if(globalAppearanceValue == 0){
        var text = "";
        var textarea = document.getElementById('freeText');
        for (var i = 0; i < diagram[lastSelectedObject].textLines.length; i++) {
            text += diagram[lastSelectedObject].textLines[i].text;
            if (i < diagram[lastSelectedObject].textLines.length - 1) text += "\n";
        }
        textarea.value = text;
        setSelectedOption('font', diagram[lastSelectedObject].properties['font']);
        setSelectedOption('fontColor', diagram[lastSelectedObject].properties['fontColor']);
        setSelectedOption('textAlign', diagram[lastSelectedObject].properties['textAlign']);
        setSelectedOption('TextSize', diagram[lastSelectedObject].properties['sizeOftext']);
      }
    }
  }
  file.send();
}

// used to implement the changes to apperances that has been made
function setSelectedOption(type, value){
  if(type != null){
    for(var i = 0; i < document.getElementById(type).options.length; i++){
      if(value == document.getElementById(type).options[i].value){
        document.getElementById(type).value = value;
        document.getElementById(type).options[i].selected = "true";
        break;
      }else{
        document.getElementById(type).options[i].selected = "false";
      }
    }
  }
}

//--------------------------------------------------------------------
// Functionality
// Different types of dialog windows
//--------------------------------------------------------------------

function globalAppearanceMenu(){
    globalAppearanceValue = 1;
    //open a menu to change appearance on all entities.
    $(".loginBox").draggable();
    var form = showMenu();
    //AJAX
    loadFormIntoElement(form,'diagram_forms.php?form=globalType');
}

function objectAppearanceMenu(form) {
    /*
    * EDITS A SINGLE OBJECT WITHIN THE DIAGRAM
    */

    form.innerHTML = "No item selected<type='text'>";
    //if no item has been selected
    if(!diagram[lastSelectedObject]){ return;}
    // UML selected
    if (diagram[lastSelectedObject].symbolkind == 1) {
        classAppearanceOpen = true;
        loadUMLForm(form, 'diagram_forms.php?form=classType');
    }
    // ER attributes selected
    else if (diagram[lastSelectedObject].symbolkind == 2) {
        loadFormIntoElement(form, 'diagram_forms.php?form=attributeType');
    }
    // ER entity selected
    else if (diagram[lastSelectedObject].symbolkind == 3) {
        loadFormIntoElement(form, 'diagram_forms.php?form=entityType');
    }
    // Lines selected
    else if (diagram[lastSelectedObject].symbolkind == 4) {
        loadLineForm(form, 'diagram_forms.php?form=lineType&cardinality=' + diagram[lastSelectedObject].cardinality[0].symbolKind);
    }
    // ER relation selected
    else if (diagram[lastSelectedObject].symbolkind == 5) {
        loadFormIntoElement(form, 'diagram_forms.php?form=relationType');
    }
    // Text selected
    else if (diagram[lastSelectedObject].symbolkind == 6) {
        textAppearanceOpen = true;
        loadTextForm(form, 'diagram_forms.php?form=textType');
    }
    // Fill color of the object
    else if (diagram[lastSelectedObject].kind == 1) {
        loadFormIntoElement(form, 'diagram_forms.php?form=figureType');
    }
}
function changeObjectAppearance(object_type){
    /*
    * USES DIALOG TO CHANGE OBJECT APPEARANCE
    */
    if(diagram[lastSelectedObject].symbolkind == 1){//UML-class appearance
      diagram[lastSelectedObject].name = document.getElementById('nametext').value;
      var attributeLines = $('#UMLAttributes').val().split('\n');
      var operationLines = $('#UMLOperations').val().split('\n');
      diagram[lastSelectedObject].attributes = [];
      diagram[lastSelectedObject].operations = [];

      //Inserts text for attributes and operations
      for(var i = 0;i < attributeLines.length;i++){
        diagram[lastSelectedObject].attributes.push({text:attributeLines[i]});
      }
      for(var i = 0; i < operationLines.length; i++){
        diagram[lastSelectedObject].operations.push({text:operationLines[i]});
      }

    } else if (diagram[lastSelectedObject].symbolkind == 4) {
        diagram[lastSelectedObject].properties['key_type'] = document.getElementById('object_type').value;
    } else if (diagram[lastSelectedObject].kind == 1){
        diagram[lastSelectedObject].fillColor = document.getElementById('figureFillColor').value;
        diagram[lastSelectedObject].opacity = document.getElementById('figureOpacity').value / 100;
        diagram[lastSelectedObject].strokeColor = document.getElementById('LineColor').value;
    } else if (diagram[lastSelectedObject].symbolkind == 6) {
        diagram[lastSelectedObject].textLines = [];
        var textArray = $('#freeText').val().split('\n');
        for(var i = 0; i < textArray.length; i++){
          diagram[lastSelectedObject].textLines.push({text:textArray[i]});
        }
        diagram[lastSelectedObject].properties['fontColor'] = document.getElementById('fontColor').value;
        diagram[lastSelectedObject].properties['font'] = document.getElementById('font').value;
        diagram[lastSelectedObject].properties['textAlign'] = document.getElementById('textAlign').value;
        diagram[lastSelectedObject].properties['sizeOftext'] = document.getElementById('TextSize').value;
    } else {
        diagram[lastSelectedObject].properties['symbolColor'] = document.getElementById('symbolColor').value;
        diagram[lastSelectedObject].name = document.getElementById('nametext').value;
        diagram[lastSelectedObject].properties['fontColor'] = document.getElementById('fontColor').value;
        diagram[lastSelectedObject].properties['font'] = document.getElementById('font').value;
        diagram[lastSelectedObject].properties['sizeOftext'] = document.getElementById('TextSize').value;
        diagram[lastSelectedObject].properties['key_type'] = document.getElementById('object_type').value;
        diagram[lastSelectedObject].properties['strokeColor'] = document.getElementById('LineColor').value;
    }
    updateGraphics();
}

function createCardinality(){
    //Setting cardinality on new line
    if(diagram[lineStartObj].symbolkind == 5 && diagram[hovobj].symbolkind == 3){
        diagram[diagram.length-1].cardinality[0] = ({"value": "", "isCorrectSide": false});
    }
    else if(diagram[lineStartObj].symbolkind == 3 && diagram[hovobj].symbolkind == 5) {
        diagram[diagram.length-1].cardinality[0] = ({"value": "", "isCorrectSide": true});
    }
    else if(diagram[lineStartObj].symbolkind == 1 && diagram[hovobj].symbolkind == 1){
        diagram[diagram.length-1].cardinality[0] = ({"value": "", "symbolKind": 1})
    }
}
function changeCardinality(isUML){
    var val = document.getElementById('cardinality').value;
    var valUML;
    if(isUML){
        valUML = document.getElementById('cardinalityUml').value;
    }

    //Setting existing cardinality value on line
    if(val == "None") val = "";
    if(valUML == "None") valUML = "";
    if(diagram[lastSelectedObject].cardinality[0].value != null){
        if(diagram[lastSelectedObject].cardinality[0].symbolKind != 1){
            diagram[lastSelectedObject].cardinality[0].value = val;
        } else{
            diagram[lastSelectedObject].cardinality[0].valueUML = valUML;
            diagram[lastSelectedObject].cardinality[0].value = val;
        }
    }
}
