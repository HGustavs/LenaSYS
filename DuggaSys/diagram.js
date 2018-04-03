/*
----- THIS FILE HANDLES THE REST OF THE DIAGRAM -----
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
var arityBuffer = gridSize / 2;
var crossSize = 4.0;                // Size of point cross
var tolerance = 8;                  // Size of tolerance area around the point
var canvasContext;                  // Canvas context
var canvas;                         // Canvas Element
var sel;                            // Selection state
var currentMouseCoordinateX = 0;
var currentMouseCoordinateY = 0;
var startMouseCoordinateX = 0;
var startMouseCoordinateY = 0;
var oldMouseCoordinateX = 0;
var oldMouseCoordinateY = 0;
var zoomValue = 1.00;
var md = 0;                         // Mouse state
var hovobj = -1;
var lineStartObj = -1;
var movobj = -1;                    // Moving object ID
var lastSelectedObject = -1;        // The last selected object
var uimode = "normal";              // User interface mode e.g. normal or create class currently
var figureType = null;              // Specification of uimode, when Create Figure is set to the active mode this is set to one of the forms a figure can be drawn in.
var widthWindow;                    // The width on the users screen is saved is in this var.
var heightWindow;                   // The height on the users screen is saved is in this var.
var consoleInt = 0;
var startX = 0, startY = 0;         // Current X- and Y-coordinant from which the canvas start from
var waldoPoint = "";
var moveValue = 0;                  // Used to deside if the canvas should translate or not
var activePoint = null;             // This point indicates what point is being hovered by the user
var p1 = null;                      // When creating a new figure, these two variables are used ...
var p2 = null;                      // to keep track of points created with mousedownevt and mouseupevt
var p3 = null;                      // Middlepoint/centerPoint
var snapToGrid = true;              // Will the clients actions snap to grid
var crossStrokeStyle1 = "#f64";     // set the color for the crosses.
var crossFillStyle = "#d51";
var crossStrokeStyle2 = "#d51";
var minEntityX = 100;               //the minimum size for an Enitny are set by the values seen below.
var minEntityY = 50;
var hashUpdateTimer = 5000;              // set timer varibale for hash and saving
var currentHash = 0;
var lastDiagramEdit = localStorage.getItem('lastEdit');          // the last date the diagram was change in milisecounds.
var refreshTimer = setRefreshTime();              //  set how often the diagram should be refreshed.
var refresh_lock = false;               // used to set if the digram should stop refreshing or not.
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
var mousedownX = 0, mousedownY = 0;     // Is used to save the exact coordinants when pressing mousedown while in the "Move Around"-mode
var mousemoveX = 0, mousemoveY = 0;     // Is used to save the exact coordinants when moving aorund while in the "Move Around"-mode
var mouseDiffX = 0, mouseDiffY = 0;     // Saves to diff between mousedown and mousemove to know how much to translate the diagram
var xPos = 0;
var yPos = 0;
var globalAppearanceValue = 0;          // Is used to see if the button was pressed or not. This is used in diagram_dialog.js
var diagramNumber = 0;                  // Is used for localStorage so that undo and redo works.
var diagramNumberUndo = 0;              // Is used for localStorage and undo
var diagramNumberRedo = 0;              // Is used for localStorage and redo
var diagramCode = "";                   // Is used to stringfy the diagram-array

//this block of the code is used to handel keyboard input;
window.addEventListener("keydown", this.keyDownHandler, false);

function keyDownHandler(e){
    var key = e.keyCode;
    //Delete selected objects when del key is pressed down.
    if(key == 46){
        eraseSelectedObject();
    }
}

//--------------------------------------------------------------------
// points - stores a global list of points
// A point can not be physically deleted but marked as deleted in order to reuse
// the sequence number again. e.g. point[5] will remain point[5] until it is deleted
//--------------------------------------------------------------------
var points = [
    /*
    // Points for example code.
    // Path A -- Segment 1 (0, 1, 2, 3)
    {x:20, y:200, isSelected:0}, {x:60, y:200, isSelected:0}, {x:100, y:40, isSelected:0}, {x:140, y:40, isSelected:0},
    // Path B -- Segment 1 (4, 5 and 17, 18)
    {x:180, y:200, isSelected:0}, {x:220, y:200, isSelected:0},
    // Path A -- Segment 2 (6, 7, 8, 9)
    {x:300, y:250, isSelected:0}, {x:320, y:250, isSelected:0}, {x:320, y:270, isSelected:0}, {x:300, y:270, isSelected:0},
    // Path C -- Segment 1 (10, 11, 12, 13)
    {x:70, y:130, isSelected:0}, {x:70, y:145, isSelected:0}, {x:170, y:130, isSelected:0}, {x:170, y:145, isSelected:0},
    // Class A -- TopLeft BottomRight MiddleDivider 14, 15, 16
    {x:310, y:60, isSelected:0}, {x:400, y:160, isSelected:0}, {x:355, y:115, isSelected:0},
    // Path B -- Segment 1 (4, 5 and 17, 18)
    {x:100, y:40, isSelected:0}, {x:140, y:40, isSelected:0},
    // ER Attribute A -- TopLeft BottomRight MiddlePointConnector 19, 20, 21
    {x:300, y:200, isSelected:0}, {x:400, y:250, isSelected:0}, {x:350, y:225, isSelected:0},
    // ER Attribute B -- TopLeft BottomRight MiddlePointConnector 22, 23, 24
    {x:300, y:275, isSelected:0}, {x:400, y:325, isSelected:0}, {x:350, y:300, isSelected:0},
    // ER Entity A -- TopLeft BottomRight MiddlePointConnector 25, 26, 27
    {x:150, y:275, isSelected:0}, {x:250, y:325, isSelected:0}, {x:200, y:300, isSelected:0},
    // ER Entity Connector Right Points -- 28, 29
    {x:225, y:290, isSelected:1}, {x:225, y:310, isSelected:1},
    // ER Attribute C -- TopLeft BottomRight MiddlePointConnector 30, 31, 32
    {x:15, y:275, isSelected:0}, {x:115, y:325, isSelected:0}, {x:65, y:300, isSelected:0},
    // ER Attribute D -- TopLeft BottomRight MiddlePointConnector 33, 34, 35
    {x:15, y:350, isSelected:0}, {x:115, y:400, isSelected:0}, {x:65, y:375, isSelected:0},
    // ER Attribute E -- TopLeft BottomRight MiddlePointConnector 36, 37, 38
    {x:15, y:200, isSelected:0}, {x:115, y:250, isSelected:0}, {x:65, y:225, isSelected:0},
    // ER Entity Connector Left Points -- 39, 40, 41
    {x:150, y:225, isSelected:0}, {x:150, y:235, isSelected:0}, {x:150, y:245, isSelected:0}
    */
];

//--------------------------------------------------------------------
// addPoint - Creates a new point with inserted parameters and
// returns index of that point
//--------------------------------------------------------------------
points.addPoint = function(xCoordinate, yCoordinate, isSelected) {
    this.push({x:xCoordinate, y:yCoordinate, isSelected:isSelected});
    return this.length - 1;
}

//--------------------------------------------------------------------
// drawPoints - Draws each of the points as a cross
//--------------------------------------------------------------------
points.drawPoints = function() {
    canvasContext.strokeStyle = crossStrokeStyle1;
    canvasContext.lineWidth = 2;
    for (var i = 0; i < this.length; i++) {
        var point = this[i];
        if (!point.isSelected) {
            canvasContext.beginPath();
            canvasContext.moveTo(point.x - crossSize, point.y - crossSize);
            canvasContext.lineTo(point.x + crossSize, point.y + crossSize);
            canvasContext.moveTo(point.x + crossSize, point.y - crossSize);
            canvasContext.lineTo(point.x - crossSize, point.y + crossSize);
            canvasContext.stroke();
        } else {
            canvasContext.save();
            canvasContext.fillStyle = crossFillStyle;
            canvasContext.strokeStyle = crossStrokeStyle2;
            canvasContext.fillRect(point.x - crossSize, point.y - crossSize, crossSize * 2, crossSize * 2);
            canvasContext.strokeRect(point.x - crossSize, point.y - crossSize, crossSize * 2, crossSize * 2);
            canvasContext.restore();
        }
    }
}

//--------------------------------------------------------------------
// closestPoint - Returns the distance and index of the point closest
// to the coordinates passed as parameters.
//--------------------------------------------------------------------
points.closestPoint = function(xCoordinate, yCoordinate) {
    var distance = 50000000;
    var index = -1;
    for (var i = 0; i < this.length; i++) {
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
// diagram - Stores a global list of diagram objects
// A diagram object could for instance be a path, or a symbol
//--------------------------------------------------------------------
var diagram = [];

//--------------------------------------------------------------------
// draw - Executes draw methond in all diagram objects
//--------------------------------------------------------------------
diagram.draw = function() {
    this.adjustPoints();
    // Render figures
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == 1) {
            this[i].draw(1, 1);
        }
    }
    // Render Lines
    for (var i = 0; i < this.length; i++) {
        if (this[i].symbolkind == 4) {
            this[i].draw();
        }
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == 2 && !(this[i].symbolkind == 4)) {
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
        if (this[i].kind == 2) {
            this[i].adjust();
        }
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
diagram.targetItemsInsideSelectionBox = function (endX, endY, startX, startY) {
    //ensure that an entity cannot scale below the minimum size
    if (startX > endX) {
        var tempEndX = endX;
        endX = startX;
        startX = tempEndX;
    }
    if (startY > endY) {
        var tempEndY = endY;
        endY = startY;
        startY = tempEndY;
    }
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == 1) {
            var tempPoints = [];
            for (var j = 0; j < this[i].segments.length; j++) {
                tempPoints.push({x:points[this[i].segments[j].pa].x, y:points[this[i].segments[j].pa].y});
            }
            var pointsSelected = 0;
            for (var j = 0; j < tempPoints.length; j++) {
                if (tempPoints[j].x < endX && tempPoints[j].x > startX &&
                    tempPoints[j].y < endY && tempPoints[j].y > startY) {
                    pointsSelected++;
                }
            }
            if (pointsSelected >= tempPoints.length) {
                this[i].targeted = true;
            } else {
                this[i].targeted = false;
            }
        } else {
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
            if (startX < tempTopLeftX && endX > tempTopLeftX &&
                startY < tempTopLeftY && endY > tempTopLeftY &&
                startX < tempBottomRightX && endX > tempBottomRightX &&
                startY < tempBottomRightY && endY > tempBottomRightY) {
                this[i].targeted = true;
            } else {
                this[i].targeted = false;
            }
        }
    }
}

//--------------------------------------------------------------------
// itemClicked - Returns the index of the first clicked item
//--------------------------------------------------------------------
diagram.itemClicked = function() {
    for (var i = 0; i < this.length; i++) {
        if (this[i].isClicked(currentMouseCoordinateX, currentMouseCoordinateY)) {
            return i;
        }
    }
    return -1;
}

//--------------------------------------------------------------------
// isHovered - Executes isHovered methond in all diagram objects
// (currently only of kind==2 && symbolkind == 4 (aka. lines))
//--------------------------------------------------------------------
diagram.checkForHover = function(xCoordinate, yCoordinate) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == 2 && this[i].symbolkind == 4) {
            this[i].isHovered = this[i].checkForHover(xCoordinate, yCoordinate);
        }
    }
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
// Creates an arity symbol for the line specified.
// An arity symbol includes a line of text on both sides of the line.
//--------------------------------------------------------------------
diagram.createAritySymbols = function(line) {
    var relations = diagram.getRelationObjects();
    var entities = diagram.getEntityObjects();
    for (var i = 0; i < relations.length; i++) {
        for (var j = 0; j < entities.length; j++) {
            for (var k = 0; k < relations[i].connectorTop.length; k++) {
                var relationsFrom = relations[i].connectorTop[k].from;
                var relationsTo = relations[i].connectorTop[k].to;
                for (var l = 0; l < entities[j].connectorTop.length; l++) {
                    if (relationsTo == entities[j].connectorTop[l].from &&
                        relationsFrom == entities[j].connectorTop[l].to) {
                        if ((relationsTo == line.topLeft &&
                            relationsFrom == line.bottomRight) ||
                            (relationsTo == line.bottomRight &&
                            relationsFrom == line.topLeft)) {
                            var point = points[relationsTo];
                            entities[j].arity.push([
                                {text:"1", x:point.x - arityBuffer, y:point.y - arityBuffer, connectionPoint:relationsTo, align:"end", baseLine:"bottom"},
                                {text:"-", x:point.x + arityBuffer, y:point.y - arityBuffer, connectionPoint:relationsTo, align:"start", baseLine:"bottom"}
                            ]);
                            return;
                        }
                    }
                }
                for (var l = 0; l < entities[j].connectorBottom.length; l++) {
                    if (relationsTo == entities[j].connectorBottom[l].from &&
                        relationsFrom == entities[j].connectorBottom[l].to) {
                        if ((relationsTo == line.topLeft &&
                            relationsFrom == line.bottomRight) ||
                            (relationsTo == line.bottomRight &&
                            relationsFrom == line.topLeft)) {
                            var point = points[relationsTo];
                            entities[j].arity.push([
                                {text:"1", x:point.x - arityBuffer, y:point.y + arityBuffer, connectionPoint:relationsTo, align:"end", baseLine:"top"},
                                {text:"-", x:point.x + arityBuffer, y:point.y + arityBuffer, connectionPoint:relationsTo, align:"start", baseLine:"top"}
                            ]);
                            return;
                        }
                    }
                }
                for (var l = 0; l < entities[j].connectorRight.length; l++) {
                    if (relationsTo == entities[j].connectorRight[l].from &&
                        relationsFrom == entities[j].connectorRight[l].to) {
                        if ((relationsTo == line.topLeft &&
                            relationsFrom == line.bottomRight) ||
                            (relationsTo == line.bottomRight &&
                            relationsFrom == line.topLeft)) {
                            var point = points[relationsTo];
                            entities[j].arity.push([
                                {text:"1", x:point.x + arityBuffer, y:point.y - arityBuffer, connectionPoint:relationsTo, align:"start", baseLine:"bottom"},
                                {text:"-", x:point.x + arityBuffer, y:point.y + arityBuffer, connectionPoint:relationsTo, align:"start", baseLine:"top"}
                            ]);
                            return;
                        }
                    }
                }
                for (var l = 0; l < entities[j].connectorLeft.length; l++) {
                    if (relationsTo == entities[j].connectorLeft[l].from &&
                        relationsFrom == entities[j].connectorLeft[l].to) {
                        if ((relationsTo == line.topLeft &&
                            relationsFrom == line.bottomRight) ||
                            (relationsTo == line.bottomRight &&
                            relationsFrom == line.topLeft)) {
                            var point = points[relationsTo];
                            entities[j].arity.push([
                                {text:"1", x:point.x - arityBuffer, y:point.y - arityBuffer, connectionPoint:relationsTo, align:"end", baseLine:"bottom"},
                                {text:"-", x:point.x - arityBuffer, y:point.y + arityBuffer, connectionPoint:relationsTo, align:"end", baseLine:"top"}
                            ]);
                            return;
                        }
                    }
                }
            }
        }
    }
}

diagram.updateArity = function() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3 && diagram[i].arity.length > 0) {
            diagram[i].updateArityPosition();
        }
    }
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
        if (diagram[i].symbolkind == 3) {
            diagram[i].sortAllConnectors();
        }
    }
}

//--------------------------------------------------------------------
// Updates all lines connected to an entity.
//--------------------------------------------------------------------
diagram.updateQuadrants = function() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3) {
            diagram[i].quadrants();
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
    document.getElementById("valuesCanvas").innerHTML = "<p><b>Zoom:</b> " + Math.round((zoomValue * 100)) + "%   |   <b>Coordinates:</b> X=" + startX + " & Y=" + startY + "</p>";
    canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        canvasContext = canvas.getContext("2d");
    }
    getUploads();
    // generateExampleCode();
    updateGraphics();
    document.getElementById("moveButton").addEventListener('click', movemode, false);
    canvas.addEventListener('dblclick', doubleclick, false);
    canvas.addEventListener('touchmove', mousemoveevt, false);
    canvas.addEventListener('touchstart', mousedownevt, false);
    canvas.addEventListener('touchend', mouseupevt, false);
    //canvas.addEventListener('mouseup', saveLocalStorage, false);
    $("#ZoomSelect").click(function() {
        $(this).parent().find(".ikonPil").toggleClass("ikonPilRotation");
    });
}

// Function to enable and disable the grid, functionality is related to currentMouseCoordinateX and currentMouseCoordinateY
function toggleGrid() {
    if (snapToGrid == false) {
        snapToGrid = true;
    } else {
        snapToGrid = false;
    }
}

function getUploads() {
    var fileID = document.getElementById('fileid');
    document.getElementById('buttonid').addEventListener('click', openDialog);
    function openDialog() {
        fileID.click();
    }
    fileID.addEventListener('change', submitFile);
    function submitFile() {
        var reader = new FileReader();
        var file = document.getElementById('fileid').files[0];
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            a = evt.currentTarget.result;
            LoadFile();
        }
    }
}

// Function that is used for the resize
// Making the page more responsive
function canvasSize() {
    widthWindow = (window.innerWidth - 20);
    heightWindow = (window.innerHeight - 144);
    canvas.setAttribute("width", widthWindow);
    canvas.setAttribute("height", heightWindow);
    canvasContext.clearRect(startX, startY, widthWindow, heightWindow);
    canvasContext.translate(startX, startY);
    canvasContext.scale(1, 1);
    canvasContext.scale(zoomValue, zoomValue);
}

// Listen if the window is the resized
window.addEventListener('resize', canvasSize);

function updateGraphics() {
    canvasContext.clearRect(startX, startY, (widthWindow / zoomValue), (heightWindow / zoomValue));
    if (moveValue == 1) {
        canvasContext.translate((-mouseDiffX), (-mouseDiffY));
        moveValue = 0;
    }
    diagram.updateQuadrants();
    diagram.updateArity();
    drawGrid();
    diagram.sortConnectors();
    diagram.draw();
    points.drawPoints();
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
    if (object.kind == 2) {
        object.erase();
        diagram.eraseLines(object, object.getLines());
    } else if (object.kind == 1) {
        object.erase();
    }
    diagram.deleteObject(object);
    updateGraphics();
}

function eraseSelectedObject() {
    canvas.style.cursor = "default";
    //Issue: Need to remove the crosses
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].targeted == true) {
            diagram[i].targeted = false;
            eraseObject(diagram[i]);
            i = -1;
            //To avoid removing the same index twice, lastSelectedObject is reset
            lastSelectedObject = -1;
        }
    }
    updateGraphics();
}

function classMode() {
    canvas.style.cursor = "default";
    uimode = "CreateClass";
}

function attrMode() {
    canvas.style.cursor = "default";
    uimode = "CreateERAttr";
}

function entityMode() {
    canvas.style.cursor = "default";
    uimode = "CreateEREntity";
}

function lineMode() {
    canvas.style.cursor = "default";
    uimode = "CreateLine";
}

function figureMode(mode) {
    canvas.style.cursor = "default";
    uimode = "CreateFigure";
    figureType = mode;
}

function relationMode() {
    canvas.style.cursor = "default";
    uimode = "CreateERRelation";
}

$(document).ready(function(){
    $("#linebutton, #attributebutton, #entitybutton, #relationbutton, #squarebutton, #drawfreebutton").click(function(){
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
    diagram[lastSelectedObject].sizeOftext = document.getElementById('TextSize').value;
}

function setType() {
    if (document.getElementById('object_type').value == 'Primary key') {
        diagram[lastSelectedObject].key_type = 'Primary key';
    } else if (document.getElementById('object_type').value == 'Normal') {
        diagram[lastSelectedObject].key_type = 'Normal';
    } else if (document.getElementById('object_type').value == 'Multivalue') {
        diagram[lastSelectedObject].key_type = 'Multivalue';
    } else if (document.getElementById('object_type').value == 'Drive') {
        diagram[lastSelectedObject].key_type = 'Drive';
    }
    updateGraphics();
}

/*
 * Closes the dialog menu for appearance.
 */
function closeAppearanceDialogMenu() {
    $("#appearance").hide();
    dimDialogMenu(false);
    document.removeEventListener("click", clickOutsideDialogMenu);
}

/*
 * Closes the dialog menu when click is done outside box.
 */
function clickOutsideDialogMenu(event) {
    $(document).mousedown(function (event) {
        var container = $("#appearance");
        if (!container.is(event.target) && container.has(event.target).length === 0) {
            container.hide();
            dimDialogMenu(false);
            document.removeEventListener("click", clickOutsideDialogMenu);
        }
    });
}

function dimDialogMenu(dim) {
    if (dim) {
        $("#appearance").css("display", "flex");
        //$("#overlay").css("display", "block");
    } else {
        $("#appearance").css("display", "none");
        //$("#overlay").css("display", "none");
    }
}

/*
THIS FUNCTION IS NOT USED RIGHT NOW! MIGHT BE USED AT A LATER STAGE

function Consolemode(action) {
    if(action == 1) {
        document.getElementById('Hide Console').style.display = "none";
        document.getElementById('Show Console').style.display = "block";
        document.getElementById('Show Console').style = "position: fixed; right: 0; bottom: 0px;";
        document.getElementById('valuesCanvas').style.bottom = "0";
        heightWindow = (window.innerHeight - 120);
        canvas.setAttribute("height", heightWindow);
        $("#consloe").hide();
        updateGraphics();
    }
    if(action == 2) {
        document.getElementById('Hide Console').style.display = "block";
        document.getElementById('Show Console').style.display = "none";
        document.getElementById('Hide Console').style = "position: fixed; right: 0; bottom: 133px;";
        heightWindow = (window.innerHeight - 244);
        canvas.setAttribute("height", heightWindow);
        document.getElementById('valuesCanvas').style.bottom = "130px";
        $("#consloe").show();
        updateGraphics();
    }
}
*/

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

function cross(xCoordinate, yCoordinate) {
    canvasContext.strokeStyle = "#4f6";
    canvasContext.lineWidth = 3;
    canvasContext.beginPath();
    canvasContext.moveTo(xCoordinate - crossSize, yCoordinate - crossSize);
    canvasContext.lineTo(xCoordinate + crossSize, yCoordinate + crossSize);
    canvasContext.moveTo(xCoordinate + crossSize, yCoordinate - crossSize);
    canvasContext.lineTo(xCoordinate - crossSize, yCoordinate + crossSize);
    canvasContext.stroke();
}

function drawGrid() {
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = "rgb(238, 238, 250)";
    var quadrantX;
    var quadrantY;
    if (startX < 0) {
        quadrantX = startX;
    } else {
        quadrantX = -startX;
    }
    if (startY < 0) {
        quadrantY = startY;
    } else {
        quadrantY = -startY;
    }
    for (var i = 0 + quadrantX; i < quadrantX + widthWindow; i++) {
        if (i % 5 == 0) {
            i++;
        }
        canvasContext.beginPath();
        canvasContext.moveTo(i * gridSize, 0 + startY);
        canvasContext.lineTo(i * gridSize, (heightWindow / zoomValue) + startY);
        canvasContext.stroke();
        canvasContext.closePath();
    }
    for (var i = 0 + quadrantY; i < quadrantY + (heightWindow / zoomValue); i++) {
        if (i % 5 == 0) {
            i++;
        }
        canvasContext.beginPath();
        canvasContext.moveTo(0 + startX, i * gridSize);
        canvasContext.lineTo((widthWindow / zoomValue) + startX, i * gridSize);
        canvasContext.stroke();
        canvasContext.closePath();
    }
    //Draws the thick lines
    canvasContext.strokeStyle = "rgb(208, 208, 220)";
    for (var i = 0 + quadrantX; i < quadrantX + (widthWindow / zoomValue); i++) {
        if (i % 5 == 0) {
            canvasContext.beginPath();
            canvasContext.moveTo(i * gridSize, 0 + startY);
            canvasContext.lineTo(i * gridSize, (heightWindow / zoomValue) + startY);
            canvasContext.stroke();
            canvasContext.closePath();
        }
    }
    for (var i = 0 + quadrantY; i < quadrantY + (heightWindow / zoomValue); i++) {
        if (i % 5 == 0) {
            canvasContext.beginPath();
            canvasContext.moveTo(0 + startX, i * gridSize);
            canvasContext.lineTo((widthWindow / zoomValue) + startX, i * gridSize);
            canvasContext.stroke();
            canvasContext.closePath();
        }
    }
}

//remove all elements in the diagram array. it hides the points by placing them beyond the users view.
function clearCanvas() {
    while (diagram.length > 0) {
        diagram[diagram.length - 1].erase();
        diagram.pop();
    }
    for (var i = 0; i < points.length; i++) {
        points[i]="";
    }
    updateGraphics();
}

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
        updateGraphics();
    } else {
        crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
        crossFillStyle = "rgba(255, 102, 68, 0.0)";
        crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
        ghostingCrosses = true;
        updateGraphics();
    }
}

//calculate the hash. does this by converting all objects to strings from diagram. then do some sort of calculation. used to save the diagram. it also save the local diagram
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

//This function is used to hash the current diagram, but not storing it locally, so we can compare the current hash with the hash after we have made some changes
// to see if it need to be saved.
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
}

function removeLocalStorage() {
    for (var i = 0; i < localStorage.length; i++) {
        localStorage.removeItem("localdiagram");
    }
}

// Function that rewrites the values of zoom and x+y that's under the canvas element
function reWrite() {
    document.getElementById("valuesCanvas").innerHTML = "<p><b>Zoom:</b> " + Math.round((zoomValue * 100)) + "%   |   <b>Coordinates:</b> X=" + startX + " & Y=" + startY + "</p>";
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
// Refresh
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
    console.log("setRefreshTime running");
    var time = 5000;
    lastDiagramEdit = localStorage.getItem('lastEdit');
    if (typeof lastDiagramEdit !== "undefined") {
        var timeDiffrence = getCurrentDate() - lastDiagramEdit;
        if (timeDiffrence <= 10800000 && timeDiffrence <= 259200000) {
            refresh_lock = false;
            console.log("setRefreshTime seting time to" + time + " " + timeDiffrence);
            return time;
        } else if (timeDiffrence >= 259200000 && timeDiffrence <= 604800000) {
            refresh_lock = false;
            time = 300000;
            console.log("setRefreshTime seting time to" + time+ " " + timeDiffrence);
            return time;
        } else if (timeDiffrence > 604800000) {
            refresh_lock = true;
            time = 300000;
            console.log("setRefreshTime seting time to" + time + " will only update on refresh."+ " " + timeDiffrence);
            return time;
        } else {
            return time;
        }
    } else {
        return time;
    }
}
function align(mode){
    var selected_objects = [];

    for(var i = 0; i < diagram.length; i++){
        if(diagram[i].targeted == true){
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
}
function alignVerticalCenter(selected_objects){
    var highest_y = 0, lowest_y = 99999, selected_center_y = 0;
    for(var i = 0; i < selected_objects.length; i++){
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
}
function alignHorizontalCenter(selected_objects){
    var highest_x = 0, lowest_x = 99999, selected_center_x = 0;
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
}
function bubbleSort(values, rising){
    //Setting rising to true will sort low - high
    var swap = null;
    if(rising){
        for(var i = 0; i < values.length; i++){
            for(var j = 0; j < values.length; j++){
                if(values[i] < values[j] && i != j){
                    swap = values[i];
                    values[i] = values[j];
                    values[j] = swap;
                }
            }
        }
    }else{
        for(var i = 0; i < values.length; i++){
            for(var j = 0; j < values.length; j++){
                if(values[i] > values[j] && i != j){
                    swap = values[i];
                    values[i] = values[j];
                    values[i] = swap;
                }
            }
        }
    }
    return values;
}
function sortObjects(selected_objects, mode, rising){
    //Sorts objects by X or Y position
    var position = [];
    if(mode=='vertically'){
        for(var i = 0; i < selected_objects.length; i++){
            position.push(points[selected_objects[i].topLeft].y);
        }
        position = bubbleSort(position, rising);

        var private_objects = selected_objects.splice([]);
        var swap = null;
        for(var i = 0; i < private_objects.length; i++){
            for(var j = 0; j < position.length; j++){
                if(points[private_objects[i].topLeft].y == position[j] && i != j){
                    swap = private_objects[i];
                    private_objects[i] = private_objects[j];
                    private_objects[j] = swap;
                }
            }
        }
    }else if(mode=='horizontally'){
        for(var i = 0; i < selected_objects.length; i++){
            position.push(points[selected_objects[i].topLeft].x);
        }
        position = bubbleSort(position, rising);

        var private_objects = selected_objects.splice([]);
        var swap = null;
        for(var i = 0; i < private_objects.length; i++){
            for(var j = 0; j < position.length; j++){
                if(points[private_objects[i].topLeft].x == position[j] && i != j){
                    swap = private_objects[i];
                    private_objects[i] = private_objects[j];
                    private_objects[j] = swap;
                }
            }
        }
    }

    return private_objects;
}
function distribute(axis){
    var spacing = 32;
    var selected_objects = [];

    for(var i = 0; i < diagram.length; i++){
        if(diagram[i].targeted == true){
            selected_objects.push(diagram[i]);
        }
    }

    if(axis=='vertically'){
        distributeVertically(selected_objects, spacing);
    }else if(axis=='horizontally'){
        distributeHorizontally(selected_objects, spacing);
    }
    /*
        There is a posibility for more types
    */
    updateGraphics();
    hashFunction();
}
function distributeVertically(selected_objects, spacing){
    selected_objects = sortObjects(selected_objects, 'vertically', true);

    for(var i = 1; i < selected_objects.length; i++){
        var object_height = (points[selected_objects[i].bottomRight].y - points[selected_objects[i].topLeft].y);

        var newy = ((points[selected_objects[i-1].topLeft].y)-(points[selected_objects[i].topLeft].y));
        selected_objects[i].move(0, newy+object_height+spacing);
    }
}
function distributeHorizontally(selected_objects, spacing){
    selected_objects = sortObjects(selected_objects, 'horizontally', true);

    for(var i = 1; i < selected_objects.length; i++){
        var object_width = (points[selected_objects[i].bottomRight].x - points[selected_objects[i].topLeft].x);

        var newx = ((points[selected_objects[i-1].topLeft].x)-(points[selected_objects[i].topLeft].x));
        selected_objects[i].move(newx+object_width+spacing, 0);
    }
}

//Do we really need 5 functions that more or less do the same thing
function globalLineThickness() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2) {
            diagram[i].lineWidth = document.getElementById('line-thickness').value;
        }
    }
}
//change the font on all entities to the same font.
function globalFont() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 1 || diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].font = document.getElementById('font').value;
        }
    }
}
//change the font color on all entities to the same color.
function globalFontColor() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].fontColor = document.getElementById('fontColor').value;
        }
    }
}

//change the text size on all entities to the same size.
function globalTextSize() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].sizeOftext = document.getElementById('TextSize').value;
        }
    }
}

//change the fillcolor on all entities to the same size.
function globalFillColor() {
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && (diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 5)) {
            diagram[i].symbolColor = document.getElementById('FillColor').value;
        } else { diagram[i].fillColor = document.getElementById('FillColor').value;}
    }
}


//change the strokecolor on all entities to the same size.
function globalStrokeColor() {
    for (var i = 0; i < diagram.length; i++) {
            diagram[i].strokeColor = document.getElementById('StrokeColor').value;
    }
}

/*

THIS FUNCTION SAVES EVERYTHING CORRECTLY. THE PROBLEM IS THAT IT DOES'T
REWRITE THE DIAGRAM AS IT SHOULD. IF THAT GETS FIXED, THE REDO AND UNDO
SHOULD WORK!

function diagramLocalStorage(){
    var diagramNumberStorage = localStorage.getItem("diagramNumber");
    diagramNumberStorage++;
    for(var i = 0; i < diagramNumberStorage; i++){
        localStorage.removeItem("diagram"+i);
    }
    diagramCode = localStorage.getItem("localdiagram");
    localStorage.setItem("diagram"+diagramNumber, diagramCode);
}

function saveLocalStorage(e){
    var oldDiagram = localStorage.getItem("diagram"+diagramNumber);
    diagramCode = localStorage.getItem("localdiagram");
    diagramNumber++;
    diagramNumberUndo = diagramNumber;
    diagramNumberRedo = diagramNumber;
    localStorage.setItem("diagramNumber", diagramNumber);
    localStorage.setItem("diagram"+diagramNumber, diagramCode);
}

function undoDiagram(){
    diagramNumberUndo--;
    if (diagramNumberUndo > 0) {
        var diagramUndo = localStorage.getItem("diagram"+diagramNumberUndo);
        localStorage.setItem("localdiagram", diagramUndo);
        loadDiagram();
    }
}

function redoDiagram(){
    var a = [], b = [], c = [];
    diagramNumberRedo++;
    if (diagramNumberRedo<diagramNumber) {
        var diagramRedo = localStorage.getItem("diagram"+diagramNumberRedo);
        localStorage.setItem("localdiagram", diagramUndo);
        loadDiagram();
    }
}

*/
