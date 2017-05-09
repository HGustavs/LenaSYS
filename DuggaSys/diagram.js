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

var crossl = 4.0;                   // Size of point cross
var tolerance = 8;                  // Size of tolerance area around the point
var ctx;                            // Canvas context
var acanvas;                        // Canvas Element
var sel;                            // Selection state
var cx = 0, cy = 0;                 // Current Mouse coordinate x and y
var sx = 0, sy = 0;                 // Start Mouse coordinate x and y
var zv = 1.00;                      // The value of the zoom
var mox = 0, moy = 0;               // Old mouse x and y
var md = 0;                         // Mouse state
var hovobj = -1;
var lineStartObj = -1;
var movobj = -1;                    // Moving object ID
var selobj = -1;                    // The last selected object
var uimode = "normal";              // User interface mode e.g. normal or create class currently
var figureMode = null;              // Specification of uimode, when Create Figure is set to the active mode this is set to one of the forms a figure can be drawn in.
var widthWindow;                    // The width on the users screen is saved is in this var.
var heightWindow;                   // The height on the users screen is saved is in this var.
var consoleInt = 0;
var startX = 0, startY = 0;         // Current X- and Y-coordinant from which the canvas start from
var waldoPoint = "";
var activePoint = null;             //This point indicates what point is being hovered by the user
var p1 = null;                      // When creating a new figure, these two variables are used ...
var p2 = null;                      // to keep track of points created with mousedownevt and mouseupevt
var p3 = null;                      // Middlepoint/centerpoint
var snapToGrid = true;              // Will the clients actions snap to grid
var crossStrokeStyle1 = "#f64";     // set the color for the crosses.
var crossfillStyle = "#d51";
var crossStrokeStyle2 = "#d51";
var minEntityX = 100;               //the minimum size for an Enitny are set by the values seen below.
var minEntityY = 50;
var hash_timer = 5000;              // set timer varibale for hash and saving
var current_hash = 0;
var attributeTemplate = {           // Defines entity/attribute/relations predefined sizes
  width: 7 * gridSize,
  height: 4 * gridSize
};
var entityTemplate = {
  width: 6 * gridSize,
  height: 3 * gridSize
};
var relationTemplate = {
  width: 8 * gridSize,
  height: 4 * gridSize
};
var classTemplate = {
  width: 6 * gridSize,
  height: 7 * gridSize
};
var a = [], b = [], c = [];
var mousedownX = 0, mousedownY = 0;    // Is used to save the exact coordinants when pressing mousedown while in the "Move Around"-mode
var mousemoveX = 0, mousemoveY = 0;    // Is used to save the exact coordinants when moving aorund while in the "Move Around"-mode
var mouseDiffX = 0, mouseDiffY = 0;    // Saves to diff between mousedown and mousemove to know how much to translate the diagram
var xPos = 0;
var yPos = 0;

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
    // Path A -- Segment 1 (0, 1, 2, 3)
    {x:20, y:200, selected:0}, {x:60, y:200, selected:0}, {x:100, y:40, selected:0}, {x:140, y:40, selected:0},
    // Path B -- Segment 1 (4, 5 and 17, 18)
    {x:180, y:200, selected:0}, {x:220, y:200, selected:0},
    // Path A -- Segment 2 (6, 7, 8, 9)
    {x:300, y:250, selected:0}, {x:320, y:250, selected:0}, {x:320, y:270, selected:0}, {x:300, y:270, selected:0},
    // Path C -- Segment 1 (10, 11, 12, 13)
    {x:70, y:130, selected:0}, {x:70, y:145, selected:0}, {x:170, y:130, selected:0}, {x:170, y:145, selected:0},
    // Class A -- TopLeft BottomRight MiddleDivider 14, 15, 16
    {x:310, y:60, selected:0}, {x:400, y:160, selected:0}, {x:355, y:115, selected:0},
    // Path B -- Segment 1 (4, 5 and 17, 18)
    {x:100, y:40, selected:0}, {x:140, y:40, selected:0},
    // ER Attribute A -- TopLeft BottomRight MiddlePointConnector 19, 20, 21
    {x:300, y:200, selected:0}, {x:400, y:250, selected:0}, {x:350, y:225, selected:0},
    // ER Attribute B -- TopLeft BottomRight MiddlePointConnector 22, 23, 24
    {x:300, y:275, selected:0}, {x:400, y:325, selected:0}, {x:350, y:300, selected:0},
    // ER Entity A -- TopLeft BottomRight MiddlePointConnector 25, 26, 27
    {x:150, y:275, selected:0}, {x:250, y:325, selected:0}, {x:200, y:300, selected:0},
    // ER Entity Connector Right Points -- 28, 29
    {x:225, y:290, selected:1}, {x:225, y:310, selected:1},
    // ER Attribute C -- TopLeft BottomRight MiddlePointConnector 30, 31, 32
    {x:15, y:275, selected:0}, {x:115, y:325, selected:0}, {x:65, y:300, selected:0},
    // ER Attribute D -- TopLeft BottomRight MiddlePointConnector 33, 34, 35
    {x:15, y:350, selected:0}, {x:115, y:400, selected:0}, {x:65, y:375, selected:0},
    // ER Attribute E -- TopLeft BottomRight MiddlePointConnector 36, 37, 38
    {x:15, y:200, selected:0}, {x:115, y:250, selected:0}, {x:65, y:225, selected:0},
    // ER Entity Connector Left Points -- 39, 40, 41
    {x:150, y:225, selected:0}, {x:150, y:235, selected:0}, {x:150, y:245, selected:0}
];

//--------------------------------------------------------------------
// addpoint
// Creates a new point and returns index of that point
//--------------------------------------------------------------------
points.addpoint = function (xk, yk, selval)
{
    var newpnt = {x:xk, y:yk, selected:selval};
    var pos = this.length;
    this.push(newpnt);
    return pos;
}

//--------------------------------------------------------------------
// drawpoints
// Draws each of the points as a cross
//--------------------------------------------------------------------
points.drawpoints = function ()
{
    // Mark points
    ctx.strokeStyle = crossStrokeStyle1;
    ctx.lineWidth = 2;
    for (var i = 0; i < this.length; i++) {
        var point = this[i];
        if (point.selected == 0) {
            ctx.beginPath();
            ctx.moveTo(point.x - crossl, point.y - crossl);
            ctx.lineTo(point.x + crossl, point.y + crossl);
            ctx.moveTo(point.x + crossl, point.y - crossl);
            ctx.lineTo(point.x - crossl, point.y + crossl);
            ctx.stroke();
        } else {
            ctx.save();
            ctx.fillStyle = crossfillStyle;
            ctx.strokeStyle = crossStrokeStyle2;
            ctx.fillRect(point.x - crossl, point.y - crossl, crossl * 2, crossl * 2);
            ctx.strokeRect(point.x - crossl, point.y - crossl, crossl * 2, crossl * 2);
            ctx.restore();
        }
    }
}

//--------------------------------------------------------------------
// distancepoint
// Returns the distance to closest point and the index of that point
//--------------------------------------------------------------------
points.distance = function(xk, yk) {
    var dist = 50000000;
    var ind = -1;
    for (var i = 0; i < this.length; i++) {
        var dx = xk - this[i].x;
        var dy = yk - this[i].y;
        var dd = (dx * dx) + dy * dy;
        if (dd < dist) {
            dist = dd;
            ind = i;
        }
    }
    return {dist:Math.sqrt(dist), ind:ind};
}

points.distanceBetweenPoints = function(x1, y1, x2, y2, axis) {
    xs = x2 - x1;
    ys = y2 - y1;
    if (axis == true) {
        return xs;
    } else {
        return ys;
    }
}

//--------------------------------------------------------------------
// clearsel
// Clears all selects from the array "points"
//--------------------------------------------------------------------
points.clearsel = function() {
    for (var i = 0; i < this.length; i++) {
        this[i].selected = 0;
    }
}

//--------------------------------------------------------------------
// diagram - stores a global list of diagram objects
// A diagram object could for instance be a path, or a symbol
//--------------------------------------------------------------------
var diagram = [];

//--------------------------------------------------------------------
// draw - executes draw methond in all diagram objects
//--------------------------------------------------------------------
diagram.draw = function () {
    // On every draw of diagram adjust the midpoint if there is one to adjust
    this.adjust();
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
// adjust - adjusts all the fixed midpoints or other points of interest to the actual geometric midpoint of the symbol
//--------------------------------------------------------------------
diagram.adjust = function () {
    for (var i = 0 ; i < this.length; i++) {
        if (this[i].kind == 2) {
            this[i].adjust();
        }
    }
}

//--------------------------------------------------------------------
// delete - deletes sent object from diagram
//--------------------------------------------------------------------
diagram.delete = function (object) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == object) {
            this.splice(i, 1);
        }
    }
}

//--------------------------------------------------------------------
// inside - executes inside methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.insides = function (ex, ey, sx, sy) {
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
        if (this[i].kind != 1) {
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
                this[i].targeted = true;
                // return i;
            } else {
                this[i].targeted = false;
            }
        }
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
            if (pointsSelected >= tempPoints.length) {
                this[i].targeted = true;
            } else {
                this[i].targeted = false;
            }
        }
    }
    return -1;
}

//--------------------------------------------------------------------
// inside - executes inside methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.inside = function (xk, yk) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].kind == 2) {
            if (this[i].inside(xk, yk) == true) {
                return i;
            }
        }
    }
    return -1;
}

//--------------------------------------------------------------------
// inside - executes linedist methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.linedist = function (xk, yk) {
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (item.kind == 2) {
            var insided = item.linedist(xk, yk);
            if (insided != -1 && insided < 15) {
                item.sel = true;
            } else {
                item.sel = false;
            }
        }
    }
    return -1;
}

//--------------------------------------------------------------------
// eraseObjectLines - removes all the lines connected to an object
//--------------------------------------------------------------------
diagram.eraseObjectLines = function(object, privateLines) {
    for (var i = 0; i < privateLines.length; i++) {
        var eraseLeft = false;
        var eraseRight = false;

        for(var j = 0; j < diagram.length;j++){
            if(points[diagram[j].centerpoint] == points[privateLines[i].topLeft] || points[diagram[j].middleDivider] == points[privateLines[i].topLeft]){
                eraseLeft = true;
            }
            if(points[diagram[j].centerpoint] == points[privateLines[i].bottomRight] || points[diagram[j].middleDivider] == points[privateLines[i].bottomRight]){
                eraseRight = true;
            }
        }

        if(!eraseLeft) {
            movePoint(points[privateLines[i].topLeft]);
        }
        if(!eraseRight) {
            movePoint(points[privateLines[i].bottomRight]);
        }
        diagram.delete(privateLines[i]);
    }
}

//--------------------------------------------------------------------
// inside - executes linedist methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.getLineObjects = function () {
    var lines = new Array();
    for (var i = 0; i < this.length; i++) {
        if (diagram[i].symbolkind == 4) {
            lines.push(diagram[i]);
        }
    }
    return lines;
}

//--------------------------------------------------------------------
// updateLineRelations - updates a line's relation depending on what object it is connected to
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

function initcanvas() {
    //hashes the current diagram, and then compare if it have been change to see if it needs to be saved.
    setInterval(hashcurrent, hash_timer);
    setInterval(hashfunction, hash_timer + 500);
    widthWindow = (window.innerWidth - 20);
    heightWindow = (window.innerHeight - 220);
    document.getElementById("canvasDiv").innerHTML = "<canvas id='myCanvas' style='border:1px solid #000000;' width='" + (widthWindow * zv) + "' height='" + (heightWindow * zv) + "' onmousemove='mousemoveevt(event,this);' onmousedown='mousedownevt(event);' onmouseup='mouseupevt(event);'></canvas>";
    document.getElementById("valuesCanvas").innerHTML = "<p>Zoom: " + Math.round((zv * 100)) + "% | Coordinates: X=" + startX + " & Y=" + startY + "</p>";
    var canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        acanvas = document.getElementById("myCanvas");
    }
    getUploads();
    makegfx();
    updategfx();
    document.getElementById("moveButton").addEventListener('click', movemode, false);
    document.getElementById("zoomInButton").addEventListener('click', zoomInMode, false);
    document.getElementById("zoomOutButton").addEventListener('click', zoomOutMode, false);
    canvas.addEventListener('dblclick', doubleclick, false);
}

// Function to enable and disable the grid, functionality is related to cx and cy
function enableGrid(element) {
    if (snapToGrid == false) {
        snapToGrid = true;
    } else {
        snapToGrid = false;
    }
}

// Function for the zoom in and zoom out in the canvas element
function zoomInMode(e) {
    uimode = "Zoom";
    var canvas = document.getElementById("myCanvas");
    canvas.removeEventListener('click', zoomOutClick, false);
    canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
    var zoomInClass = document.getElementById("zoomInButton").className;
    var zoomInButton = document.getElementById("zoomInButton");
    document.getElementById("zoomOutButton").className = "unpressed";
    document.getElementById("moveButton").className = "unpressed";
    if (zoomInClass == "unpressed") {
        canvas.removeEventListener('dblclick', doubleclick, false);
        zoomInButton.className = "pressed";
        canvas.style.cursor = "zoom-in";
        canvas.addEventListener("click", zoomInClick, false);
    } else {
        zoomInButton.className = "unpressed";
        canvas.addEventListener("dblclick", doubleclick, false);
        canvas.removeEventListener("click", zoomInClick, false);
        canvas.style.cursor = "default";
    }
}

function zoomOutMode(e) {
    uimode = "Zoom";
    var canvas = document.getElementById("myCanvas");
    canvas.removeEventListener('click', zoomInClick, false);
    canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
    var zoomOutClass = document.getElementById("zoomOutButton").className;
    var zoomOutButton = document.getElementById("zoomOutButton");
    document.getElementById("zoomInButton").className = "unpressed";
    document.getElementById("moveButton").className = "unpressed";
    if (zoomOutClass == "unpressed") {
        canvas.removeEventListener('dblclick', doubleclick, false);
        zoomOutButton.className = "pressed";
        canvas.style.cursor = "zoom-out";
        canvas.addEventListener("click", zoomOutClick, false);
    } else {
        zoomOutButton.className = "unpressed";
        canvas.addEventListener("dblclick", doubleclick, false);
        canvas.removeEventListener("click", zoomOutClick, false);
        canvas.style.cursor = "default";
    }
}

function zoomInClick() {
    var oldZV = zv;
    zv += 0.1;
    reWrite();
    // To be able to use the 10% increase och decrease, we need to use this calcuation.
    var inScale = ((1 / oldZV) * zv);
    ctx.scale(inScale, inScale);
    updategfx();
}

function zoomOutClick() {
    var oldZV = zv;
    zv -= 0.1;
    reWrite();
    // To be able to use the 10% increase och decrease, we need to use this calcuation.
    var outScale = ((1 / oldZV) * zv);
    ctx.scale(outScale, outScale);
    updategfx();
}

function getUploads() {
    document.getElementById('buttonid').addEventListener('click', openDialog);
    function openDialog() {
        document.getElementById('fileid').click();
    }
    document.getElementById('fileid').addEventListener('change', submitFile);
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
function canvassize() {
    widthWindow = (window.innerWidth - 20);
    heightWindow = (window.innerHeight - 244);
    document.getElementById("myCanvas").setAttribute("width", widthWindow);
    document.getElementById("myCanvas").setAttribute("height", heightWindow);
    ctx.clearRect(startX, startY, widthWindow, heightWindow);
    ctx.translate(startX, startY);
    ctx.scale(1, 1);
    ctx.scale(zv, zv);
}

// Listen if the window is the resized
window.addEventListener('resize', canvassize);
var erEntityA;

function updategfx() {
    ctx.clearRect(startX, startY, widthWindow, heightWindow);
    drawGrid();
    // Here we explicitly sort connectors... we need to do this dynamically e.g. diagram.sortconnectors
    erEntityA.sortAllConnectors();
    // Redraw diagram
    diagram.draw();
    // Draw all points as crosses
    points.drawpoints();
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
    if (sel.dist <= tolerance) {
        activePoint = sel.ind;
    } else {
        activePoint = null;
    }
}

function mousemoveevt(ev, t) {
    xPos = ev.clientX;
    yPos = ev.clientY;
    mox = cx;
    moy = cy;
    hovobj = diagram.inside(cx, cy);
    if (ev.pageX || ev.pageY == 0) { // Chrome
        cx = (ev.pageX - acanvas.offsetLeft) * (1 / zv);
        cy = (ev.pageY - acanvas.offsetTop) * (1 / zv);
    } else if (ev.layerX || ev.layerX == 0) { // Firefox
        cx = (ev.layerX - acanvas.offsetLeft) * (1 / zv);
        cy = (ev.layerY - acanvas.offsetTop) * (1 / zv);
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        cx = (ev.offsetX - acanvas.offsetLeft) * (1 / zv);
        cy = (ev.offsetY - acanvas.offsetTop) * (1 / zv);
    }
    cx += startX;
    cy += startY;
    if (md == 1 || md == 2 || md == 0 && uimode != " ") {
        if (snapToGrid) {
            cx = Math.round(cx / gridSize) * gridSize;
            cy = Math.round(cy / gridSize) * gridSize;
        }
    }
    if (md == 0) {
        // Select a new point only if mouse is not already moving a point or selection box
        sel = points.distance(cx, cy);
        // If mouse is not pressed highlight closest point
        points.clearsel();
        movobj = diagram.inside(cx, cy);
        updateActivePoint();
    } else if (md == 1) {
        // If mouse is pressed down and no point is close show selection box
    } else if (md == 2) {
        // If mouse is pressed down and at a point in selected object - move that point
        if (diagram[selobj].targeted == true) {
            if (diagram[selobj].bottomRight == sel.ind && diagram[selobj].symbolkind != 5) {
                points[diagram[selobj].bottomRight].x = cx;
                points[diagram[selobj].bottomRight].y = cy;
            } else if (diagram[selobj].topLeft == sel.ind && diagram[selobj].symbolkind != 5) {
                points[diagram[selobj].topLeft].x = cx;
                points[diagram[selobj].topLeft].y = cy;
            }
        }
    } else if (md == 3) {
        // If mouse is pressed down inside a movable object - move that object
        if (movobj != -1) {
            for (var i = 0; i < diagram.length; i++) {
                if (diagram[i].targeted == true) {
                    if (snapToGrid) {
                        cx = Math.round(cx / gridSize) * gridSize;
                        cy = Math.round(cy / gridSize) * gridSize;
                    }
                    diagram[i].move(cx - mox, cy - moy);
                }
            }
        }
    }
    diagram.linedist(cx, cy);
    updategfx();
    // Update quadrants -- This for-loop needs to be moved to a diragram method, just like updategfx or even inside updategfx
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].symbolkind == 3) {
            diagram[i].quadrants();
        }
    }
    // Draw select or create dotted box
    if (md == 4) {
        ctx.setLineDash([3, 3]);
        ctx.beginPath(1);
        ctx.moveTo(sx, sy);
        ctx.lineTo(cx, sy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(sx, cy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = "#d51";
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath(1);
        if (ghostingcrosses == true){
            crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
            crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
            crossfillStyle = "rgba(255, 102, 68, 0.0)";
        }
    }
}

function mousedownevt(ev) {
    if (uimode == "CreateLine") {
        md = 4;            // Box select or Create mode.
        sx = cx;
        sy = cy;
        sel = points.distance(cx, cy);
        if (hovobj == -1) {
            p1 = points.addpoint(cx, cy, false);
        } else {
            lineStartObj = hovobj;
            if (diagram[lineStartObj].symbolkind == 2) {
                p1 = diagram[lineStartObj].centerpoint;
            } else if (diagram[lineStartObj].symbolkind == 5) {
                p1 = diagram[lineStartObj].middleDivider;
            } else {
                p1 = points.addpoint(cx, cy, false);
            }
            //p1=diagram[hovobj].centerpoint;
        }
    } else if (uimode != "CreateFigure" && sel.dist < tolerance) {
        md = 2;
    } else if (movobj != -1) {
        md = 3;
        selobj = diagram.inside(cx, cy);
        if (diagram[selobj].targeted == false) {
            for (var i = 0; i < diagram.length; i++) {
                diagram[i].targeted = false;
            }
            diagram[selobj].targeted = true;
        }
    } else {
        md = 4;            // Box select or Create mode.
        sx = cx;
        sy = cy;
    }
}

function doubleclick(ev) {
    var posistionX = (startX + xPos);
    var posistionY = (startY + yPos);
    if (diagram[selobj].targeted == true) {
        openAppearanceDialogMenu();
        document.getElementById('nametext').value = diagram[selobj].name;
        document.getElementById('fontColor').value = diagram[selobj].fontColor;
        document.getElementById('font').value = diagram[selobj].font;
        document.getElementById('TextSize').value = diagram[selobj].sizeOftext;
        if (document.getElementById('entityType') != null) {
            document.getElementById('entityType').value = diagram[selobj].entityType;
        }
        if (document.getElementById('attributeType') != null) {
            document.getElementById('attributeType').value = diagram[selobj].attributeType;
        }
    }
}
function resize() {
    if (uimode == "CreateClass" && md == 4) {
        if (cx >= sx && (cx - sx) < classTemplate.width) {
            cx = sx + classTemplate.width;
        } else if (cx < sx && (sx - cx) < classTemplate.width) {
            cx = sx - classTemplate.width;
        }
        if (cy >= sy && (cy - sy) < classTemplate.width) {
            cy = sy + classTemplate.height;
        } else if (cy < sy && (sy - cy) < classTemplate.height) {
            cy = sy - classTemplate.height;
        }
    } else if (uimode == "CreateERAttr" && md == 4) {
        if (cx >= sx && (cx - sx) < attributeTemplate.width) {
            cx = sx + attributeTemplate.width;
        } else if (cx < sx && (sx - cx) < attributeTemplate.width) {
            cx = sx - attributeTemplate.width;
        }
        if (cy >= sy && (cy - sy) < attributeTemplate.width) {
            cy = sy + attributeTemplate.height;
        } else if (cy < sy && (sy - cy) < attributeTemplate.height) {
            cy = sy - attributeTemplate.height;
        }
    } else if (uimode == "CreateEREntity" && md == 4) {
        if (cx >= sx && (cx - sx) < entityTemplate.width) {
            cx = sx + entityTemplate.width;
        } else if (cx < sx && (sx - cx) < entityTemplate.width) {
            cx = sx - entityTemplate.width;
        }
        if (cy >= sy && (cy - sy) < entityTemplate.width) {
            cy = sy + entityTemplate.height;
        } else if (cy < sy && (sy - cy) < entityTemplate.height) {
            cy = sy - entityTemplate.height;
        }
    } else if (uimode == "CreateERRelation" && md == 4) {
        if (cx >= sx && (cx - sx) < relationTemplate.width) {
            cx = sx + relationTemplate.width;
        } else if (cx < sx && (sx - cx) < relationTemplate.width) {
            cx = sx - relationTemplate.width;
        }
        if (cy >= sy && (cy - sy) < relationTemplate.width) {
            cy = sy + relationTemplate.height;
        } else if (cy < sy && (sy - cy) < relationTemplate.height) {
            cy = sy - relationTemplate.height;
        }
    }
}
function mouseupevt(ev) {
    if (snapToGrid) {
        cx = Math.round(cx / gridSize) * gridSize;
        cy = Math.round(cy / gridSize) * gridSize;
    }
    // Code for creating a new class
    if (md == 4 && (uimode == "CreateClass" || uimode == "CreateERAttr" || uimode == "CreateEREntity" || uimode == "CreateERRelation")) {
        resize();

        // Add required points
        p1 = points.addpoint(sx, sy, false);
        p2 = points.addpoint(cx, cy, false);


        p3 = points.addpoint((sx + cx) * 0.5, (sy + cy) * 0.5, false);
    }
    if (uimode == "CreateLine" && md == 4) {
        sel = points.distance(cx, cy);
        if (hovobj == -1) {
            // End line on empty
            p2 = points.addpoint(cx, cy, false);
            if (lineStartObj == -1) {
                // Start line on empty
                // Just draw a normal line
            } else {
                // Start line on object
                diagram[lineStartObj].connectorTop.push({from:p1, to:p2});
                lineStartObj = -1;
            }
        } else {
            // End line on object
            if (diagram[hovobj].symbolkind == 2) {
                p2 = diagram[hovobj].centerpoint;
            } else if (diagram[hovobj].symbolkind == 5) {
                p2 = diagram[hovobj].middleDivider;
            } else {
                p2 = points.addpoint(cx, cy, false);
            }
            if (lineStartObj == -1) {
                // Start line on empty
                diagram[hovobj].connectorTop.push({from:p2, to:p1});
            } else {
                // Start line on object
                diagram[lineStartObj].connectorTop.push({from:p1, to:p2});
                diagram[hovobj].connectorTop.push({from:p2, to:p1});
            }
        }
    }
    createFigure();
    if (uimode == "CreateClass" && md == 4) {
        classB = new Symbol(1);
        classB.name = "New" + diagram.length;
        classB.operations.push({visibility:"-", text:"makemore()"});
        classB.attributes.push({visibility:"+", text:"height:Integer"});
        classB.topLeft = p1;
        classB.bottomRight = p2;

        classB.middleDivider = p3;
        diagram.push(classB);
    } else if (uimode == "CreateERAttr" && md == 4) {
        erAttributeA = new Symbol(2);
        erAttributeA.name = "Attr" + diagram.length;
        erAttributeA.topLeft = p1;
        erAttributeA.bottomRight = p2;

        erAttributeA.centerpoint = p3;
        erAttributeA.attributeType = "";
        erAttributeA.fontColor = "#253";
        erAttributeA.font = "Arial";
        diagram.push(erAttributeA);
        //selecting the newly created attribute and open the dialogmenu.
        selobj = diagram.length -1;
        diagram[selobj].targeted = true;
        openAppearanceDialogMenu();
    } else if (uimode == "CreateEREntity" && md == 4) {
        erEnityA = new Symbol(3);
        erEnityA.name = "Entity" + diagram.length;
        erEnityA.topLeft = p1;
        erEnityA.bottomRight = p2;
        erEnityA.centerpoint = p3;

        erEnityA.entityType = "";
        erEnityA.fontColor = "#253";
        erEnityA.font = "Arial";
        diagram.push(erEnityA);
        //selecting the newly created enitity and open the dialogmenu.
        selobj = diagram.length -1;
        diagram[selobj].targeted = true;
        openAppearanceDialogMenu();
    } else if (uimode == "CreateLine" && md == 4) {
        /* Code for making a line */
        erLineA = new Symbol(4);
        erLineA.name = "Line" + diagram.length;
        erLineA.topLeft = p1;
        erLineA.bottomRight = p2;
        erLineA.centerpoint = p3;
        diagram.push(erLineA);
    } else if (uimode == "CreateERRelation" && md == 4) {
        erRelationA = new Symbol(5);
        erRelationA.name = "Relation" + diagram.length;
        erRelationA.topLeft = p1;
        erRelationA.bottomRight = p2;
        erRelationA.middleDivider = p3;

        diagram.push(erRelationA);
        //selecting the newly created relation and open the dialog menu.
        selobj = diagram.length -1;
        diagram[selobj].targeted = true;
        openAppearanceDialogMenu();
    } else if (md == 4 && !(uimode == "CreateFigure") &&
               !(uimode == "CreateLine") && !(uimode == "CreateEREntity") &&
               !(uimode == "CreateERAttr" ) && !(uimode == "CreateClass" ) &&
               !(uimode == "MoveAround" ) && !(uimode == "CreateERRelation")) {
        diagram.insides(cx, cy, sx, sy);
    }
    document.addEventListener("click", clickOutsideDialogMenu);
    hashfunction();
    updategfx();
    diagram.updateLineRelations();
    // Clear mouse state
    md = 0;
    if (uimode != "CreateFigure") {
        uimode = "normal";
    }
}
function movePoint(point){
  point=waldoPoint;
}
function getConnectedLines(object) {
    // Adds the different connectors into an array to reduce the amount of code
    var private_points = object.getPoints();
    var lines = diagram.getLineObjects();
    var object_lines = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        //Lines connected to object's centerpoint
        //Line always have topLeft and bottomRight if symbolkind == 4, because that means it's a line object
        if (line.topLeft == object.centerpoint || line.bottomRight == object.centerpoint) {
            object_lines.push(line);
        }
        //Connected to connectors top, right, bottom and left.
        for (var j = 0; j < private_points.length; j++) {
            if (line.topLeft == private_points[j] || line.bottomRight == private_points[j]) {
                object_lines.push(line);
            }
        }
    }
    return object_lines;
}

function eraseObject(object) {
    document.getElementById("myCanvas").style.cursor = "default";
    if(object.kind==2){
      var private_lines = object.getLines();
      object.erase();
      diagram.eraseObjectLines(object, private_lines);
    }
    else if(object.kind==1){
      object.erase();
    }

    diagram.delete(object);
    updategfx();
}

function eraseSelectedObject() {
    document.getElementById("myCanvas").style.cursor = "default";
    //Issue: Need to remove the crosses
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].targeted == true) {
            diagram[i].targeted = false;
            eraseObject(diagram[i]);
            i = -1;
            //To avoid removing the same index twice, selobj is reset
            selobj = -1;
        }
    }
    updategfx();
}

function classmode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateClass";
}

function attrmode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateERAttr";
}

function entitymode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateEREntity";
}

function linemode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateLine";
}

function figuremode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateFigure";
    var selectBox = document.getElementById("selectFigure");
    figureMode = selectBox.options[selectBox.selectedIndex].value;
}

function relationmode() {
    document.getElementById("myCanvas").style.cursor = "default";
    uimode = "CreateERRelation";
}

/**
 * Resets the select box to its default value (Create Figure)
 */
function resetSelectionCreateFigure() {
    document.getElementById("selectFigure").selectedIndex = 0;
}

/**
 * Opens the dialog menu for appearance.
 */
function openAppearanceDialogMenu() {
    document.getElementById("myCanvas").style.cursor = "default";
    $("#appearance").show();
    $("#appearance").width("auto");
    dimDialogMenu(true);
    hashcurrent();
    dialogForm();
}

function dialogForm() {
    var form = document.getElementById("f01");
    form.innerHTML = "No item selected<type='text'>";
    if (diagram[selobj].symbolkind == 1) {
        form.innerHTML =
            "Class name: </br>" +
            "<input id='nametext' type='text'></br>" +
            "<button type='submit' class='submit-button' onclick='changeName(form); hashfunction();' style='float: none; display: block; margin: 10px auto;'>Ok</button>";
    }
    if (diagram[selobj].symbolkind == 2) {
        form.innerHTML =
            "Attribute name:</br>" +
            "<input id='nametext' type='text'></br>" +
            "Attribute type: </br>" +
            "<select id ='attributeType'>" +
                "<option value='Primary key'>Primary key</option>" +
                "<option value='Normal'>Normal</option>" +
                "<option value='Multivalue'>Multivalue</option>" +
                "<option value='Composite' selected>Composite</option>" +
                "<option value='Drive' selected>Derive</option>" +
            "</select></br>" +
            "Font family:<br>" +
            "<select id ='font'>" +
                "<option value='arial' selected>Arial</option>" +
                "<option value='Courier New'>Courier New</option>" +
                "<option value='Impact'>Impact</option>" +
                "<option value='Calibri'>Calibri</option>" +
            "</select><br>" +
            "Font color:<br>" +
            "<select id ='fontColor'>" +
                "<option value='black' selected>Black</option>" +
                "<option value='blue'>Blue</option>" +
                "<option value='Green'>Green</option>" +
                "<option value='grey'>Grey</option>" +
                "<option value='red'>Red</option>" +
                "<option value='yellow'>Yellow</option>" +
            "</select><br>" +
            "Text size:<br>" +
            "<select id ='TextSize'>" +
                "<option value='Tiny'>Tiny</option>" +
                "<option value='Small'>Small</option>" +
                "<option value='Medium'>Medium</option>" +
                "<option value='Large'>Large</option>" +
            "</select><br>" +
            "<button type='submit' class='submit-button' onclick='changeNameAttr(form); setType(form); hashfunction(); updategfx();' style='float: none; display: block; margin: 10px auto;'>OK</button>";
    }
    if (diagram[selobj].symbolkind == 3) {
        form.innerHTML =
            "Entity name: </br>" +
            "<input id='nametext' type='text'></br>" +
            "Entity type: </br>" +
            "<select id ='entityType'>" +
                "<option value='weak'>weak</option>" +
                "<option value='strong' selected>strong</option>" +
            "</select></br>" +
            "Font family:<br>" +
            "<select id ='font'>" +
                "<option value='arial' selected>Arial</option>" +
                "<option value='Courier New'>Courier New</option>" +
                "<option value='Impact'>Impact</option>" +
                "<option value='Calibri'>Calibri</option>" +
            "</select><br>" +
            "Font color:<br>" +
            "<select id ='fontColor'>" +
                "<option value='black' selected>Black</option>" +
                "<option value='blue'>Blue</option>" +
                "<option value='Green'>Green</option>" +
                "<option value='grey'>Grey</option>" +
                "<option value='red'>Red</option>" +
                "<option value='yellow'>Yellow</option>" +
            "</select><br>" +
            "Text size:<br>" +
            "<select id ='TextSize'>" +
                "<option value='Tiny' selected>Tiny</option>" +
                "<option value='Small'>Small</option>" +
                "<option value='Medium'>Medium</option>" +
                "<option value='Large'>Large</option>" +
            "</select><br>" +
            "<button type='submit' class='submit-button' onclick='changeNameEntity(form); setEntityType(form); hashfunction(); updategfx();' style='float: none; display: block; margin: 10px auto;'>OK</button>";
    }
    if (diagram[selobj].symbolkind == 5) {
        form.innerHTML =
            "Relation name:</br>" +
            "<input id='nametext' type='text'></br>" +
            "Font family:<br>" +
            "<select id ='font'>" +
                "<option value='arial' selected>Arial</option>" +
                "<option value='Courier New'>Courier New</option>" +
                "<option value='Impact'>Impact</option>" +
                "<option value='Calibri'>Calibri</option>" +
            "</select><br>" +
            "Font color:<br>" +
            "<select id ='fontColor'>" +
                "<option value='black' selected>Black</option>" +
                "<option value='blue'>Blue</option>" +
                "<option value='Green'>Green</option>" +
                "<option value='grey'>Grey</option>" +
                "<option value='red'>Red</option>" +
                "<option value='yellow'>Yellow</option>" +
            "</select><br>" +
            "Text size:<br>" +
            "<select id ='TextSize'>" +
                "<option value='Tiny'>Tiny</option>" +
                "<option value='Small'>Small</option>" +
                "<option value='Medium'>Medium</option>" +
                "<option value='Large'>Large</option>" +
            "</select><br>" +
            "<button type='submit' class='submit-button' onclick='changeNameRelation(form); setType(form); hashfunction(); updategfx();' style='float: none; display: block; margin: 10px auto;'>OK</button>";
    }
}

//setTextSize(): used to change the size of the text. unifinish can's get it to work.
function setTextSizeEntity(form) {
    diagram[selobj].sizeOftext = document.getElementById('TextSize').value;

    /*
    Hämtar specifik entitet/attribut/detpersonenharklickat på.
    [ovannämndklick].font=text_size+"px";
    */
}

function changeNameAttr(form) {
    dimDialogMenu(false);
    diagram[selobj].name = document.getElementById('nametext').value;
    diagram[selobj].fontColor = document.getElementById('fontColor').value;
    diagram[selobj].font = document.getElementById('font').value;
    diagram[selobj].sizeOftext = document.getElementById('TextSize').value;
    diagram[selobj].attributeType = document.getElementById('attributeType').value;
    updategfx();
    $("#appearance").hide();
}

function changeNameEntity(form) {
    dimDialogMenu(false);
    diagram[selobj].name = document.getElementById('nametext').value;
    diagram[selobj].fontColor = document.getElementById('fontColor').value;
    diagram[selobj].font = document.getElementById('font').value;
    diagram[selobj].sizeOftext = document.getElementById('TextSize').value;
    diagram[selobj].entityType = document.getElementById('entityType').value;
    updategfx();
    $("#appearance").hide();
}

function changeNameRelation() {
    dimDialogMenu(false);
    diagram[selobj].name = document.getElementById('nametext').value;
    diagram[selobj].fontColor = document.getElementById('fontColor').value;
    diagram[selobj].font = document.getElementById('font').value;
    diagram[selobj].sizeOftext = document.getElementById('TextSize').value;
    diagram[selobj].entityType = document.getElementById('entityType').value;
    updategfx();
    $("#appearance").hide();
}

function setEntityType(form) {
    var selectBox = document.getElementById("entityType");
    diagram[selobj].type = selectBox.options[selectBox.selectedIndex].value;
    updategfx();
}

function setType(form) {
    if (document.getElementById('attributeType').value == 'Primary key') {
        diagram[selobj].key_type = 'Primary key';
    } else if (document.getElementById('attributeType').value == 'Normal') {
        diagram[selobj].key_type = 'Normal';
    } else if (document.getElementById('attributeType').value == 'Multivalue') {
        diagram[selobj].key_type = 'Multivalue';
    } else if (document.getElementById('attributeType').value == 'Drive') {
        diagram[selobj].key_type = 'Drive';
    }
    updategfx();
}

/**
 * Closes the dialog menu for appearance.
 */
function closeAppearanceDialogMenu() {
    $("#appearance").hide();
    dimDialogMenu(false);
    document.removeEventListener("click", clickOutsideDialogMenu);
}

/**
 * Closes the dialog menu when click is done outside box.
 */
function clickOutsideDialogMenu(ev) {
    $(document).mousedown(function (ev) {
        var container = $("#appearance");
        if (!container.is(ev.target) && container.has(ev.target).length === 0) {
            container.hide();
            dimDialogMenu(false);
            document.removeEventListener("click", clickOutsideDialogMenu);
        }
    });
}

function dimDialogMenu(dim) {
    if (dim == true) {
        $("#appearance").css("display", "block");
        $("#overlay").css("display", "block");
    } else {
        $("#appearance").css("display", "none");
        $("#overlay").css("display", "none");
    }
}

function Consolemode(action) {
    if(action == 1) {
        document.getElementById('Hide Console').style.display = "none";
        document.getElementById('Show Console').style.display = "block";
        document.getElementById('Show Console').style = "position: fixed; right: 0; bottom: 0px;";
        document.getElementById('valuesCanvas').style.bottom = "0";
        heightWindow = (window.innerHeight - 120);
        document.getElementById("myCanvas").setAttribute("height", heightWindow);
        $("#consloe").hide();
        updategfx();
    }
    if(action == 2) {
        document.getElementById('Hide Console').style.display = "block";
        document.getElementById('Show Console').style.display = "none";
        document.getElementById('Hide Console').style = "position: fixed; right: 0; bottom: 133px;";
        heightWindow = (window.innerHeight - 244);
        document.getElementById("myCanvas").setAttribute("height", heightWindow);
        document.getElementById('valuesCanvas').style.bottom = "130px";
        $("#consloe").show();
        updategfx();
    }
}

function connectedObjects(line) {
    var private_objects = [];
    for (var i = 0; i < diagram.length; i++) {
        if (diagram[i].kind == 2 && diagram[i].symbolkind != 4) {
            var object_points = diagram[i].getPoints();
            for (var j = 0; j < object_points.length; j++) {
                if (object_points[j] == line.topLeft || object_points[j] == line.bottomRight) {
                    private_objects.push(diagram[i]);
                }
                if (private_objects.length >= 2) {
                    break;
                }
            }
            if (private_objects.length >= 2) {
                break;
            }
        }
    }
    return private_objects;
}

function cross(xk, yk) {
    ctx.strokeStyle = "#4f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xk - crossl, yk - crossl);
    ctx.lineTo(xk + crossl, yk + crossl);
    ctx.moveTo(xk + crossl, yk - crossl);
    ctx.lineTo(xk - crossl, yk + crossl);
    ctx.stroke();
}

function drawGrid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(238, 238, 250)";
    ctx.setLineDash([5, 0]);

    var quadrantx;
    var quadranty;
    if(startX < 0){
        quadrantx = startX;
    }else{
        quadrantx = -startX;
    }
    if(startY < 0){
        quadranty = startY;
    }else{
        quadranty = -startY;
    }

    for (var i = 0 + quadrantx; i < quadrantx + widthWindow; i++) {
        if (i % 5 == 0) {
            i++;
        }
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0 + startY);
        ctx.lineTo(i * gridSize, heightWindow + startY);
        ctx.stroke();
        ctx.closePath();
    }
    for (var i = 0 + quadranty; i < quadranty + heightWindow; i++) {
        if (i % 5 == 0) {
            i++;
        }
        ctx.beginPath();
        ctx.moveTo(0 + startX, i * gridSize);
        ctx.lineTo(widthWindow + startX, i * gridSize);
        ctx.stroke();
        ctx.closePath();
    }
    //Draws the thick lines
    ctx.strokeStyle = "rgb(208, 208, 220)";
    for (var i = 0 + quadrantx; i < quadrantx + widthWindow; i++) {
        if (i % 5 == 0) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0 + startY);
            ctx.lineTo(i * gridSize, heightWindow + startY);
            ctx.stroke();
            ctx.closePath();
        }
    }
    for (var i = 0 + quadranty; i < quadranty + heightWindow; i++) {
        if (i % 5 == 0) {
            ctx.beginPath();
            ctx.moveTo(0 + startX, i * gridSize);
            ctx.lineTo(widthWindow + startX, i * gridSize);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function drawOval(x1, y1, x2, y2) {
        xm = x1 + ((x2 - x1) * 0.5),        // x-middle
        ym = y1 + ((y2 - y1) * 0.5);        // y-middle
        ctx.beginPath();
        ctx.moveTo(x1, ym);
        ctx.quadraticCurveTo(x1, y1, xm, y1);
        ctx.quadraticCurveTo(x2, y1, x2, ym);
        ctx.quadraticCurveTo(x2, y2, xm, y2);
        ctx.quadraticCurveTo(x1, y2, x1, ym);
}

//remove all elements in the diagram array. it hides the points by placing them beyond the users view.
function clearCanvas() {
    while (diagram.length > 0) {
        diagram[diagram.length - 1].erase();
        diagram.pop();
    }
    for(var i = 0; i < points.length; i++){
        points[i]="";
    }
    updategfx();
}

var consloe = {};
consloe.log = function(gobBluth) {
    document.getElementById("consloe").innerHTML = ((JSON.stringify(gobBluth) + "<br>") + document.getElementById("consloe").innerHTML);
}

//debugMode this function show and hides crosses and the consol.
var ghostingcrosses = false; // used to repressent a switch for whenever the debugMode is enabled or not.
function debugMode() {
    if(ghostingcrosses == true) {
        crossStrokeStyle1 = "#f64";
        crossfillStyle = "#d51";
        crossStrokeStyle2 = "#d51";
        ghostingcrosses = false
        Consolemode(2)
    } else {
        crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
        crossfillStyle = "rgba(255, 102, 68, 0.0)";
        crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
        ghostingcrosses = true
        Consolemode(1)
    }
}

//---------------------------------------
// MOVING AROUND IN THE CANVAS
//---------------------------------------
function movemode(e, t) {
    uimode = "MoveAround";
    var canvas = document.getElementById("myCanvas");
    var button = document.getElementById("moveButton").className;
    var buttonStyle = document.getElementById("moveButton");
    canvas.removeEventListener("click", zoomOutClick, false);
    canvas.removeEventListener("click", zoomInClick, false);
    canvas.removeEventListener("dblclick", doubleclick, false);
    document.getElementById("zoomInButton").className = "unpressed";
    document.getElementById("zoomOutButton").className = "unpressed";
    if (button == "unpressed") {
        buttonStyle.className = "pressed";
        canvas.style.cursor = "all-scroll";
        canvas.addEventListener('mousedown', getMousePos, false);
        canvas.addEventListener('mouseup', mouseupcanvas, false);
    } else {
        canvas.addEventListener('dblclick', doubleclick, false);
        buttonStyle.className = "unpressed";
        mousedownX = 0; mousedownY = 0;
        mousemoveX = 0; mousemoveY = 0;
        mouseDiffX = 0; mouseDiffY = 0;
        var canvas = document.getElementById("myCanvas");
        canvas.style.cursor = "default";
        canvas.removeEventListener('mousedown', getMousePos, false);
        canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
        canvas.removeEventListener('mouseup', mouseupcanvas, false);
        mousemoveevt(e, t);
    }
}

function getMousePos(e) {
    var canvas = document.getElementById("myCanvas");
    mousedownX = e.clientX;
    mousedownY = e.clientY;
    canvas.addEventListener('mousemove', mousemoveposcanvas, false);
}

function mousemoveposcanvas(e) {
    mousemoveX = e.clientX;
    mousemoveY = e.clientY;
    var canvas = document.getElementById("myCanvas");
    mouseDiffX = (mousedownX - mousemoveX);
    mouseDiffY = (mousedownY - mousemoveY);
    startX += mouseDiffX;
    startY += mouseDiffY;
    mousedownX = mousemoveX;
    mousedownY = mousemoveY;
    ctx.clearRect(0, 0, widthWindow, heightWindow);
    ctx.translate((-mouseDiffX), (-mouseDiffY));
    erEntityA.sortAllConnectors();
    diagram.draw();
    points.drawpoints();
    reWrite();
}

function mouseupcanvas(e) {
    document.getElementById("myCanvas").removeEventListener('mousemove', mousemoveposcanvas, false);
}

//calculate the hash. does this by converting all objects to strings from diagram. then do some sort of calculation. used to save the diagram. it also save the local diagram
function hashfunction() {
    window.location.hash = diagram;
    var diagramToString = "";
    var hash = 0;
    for (var i = 0; i < diagram.length; i++) {
        diagramToString = diagramToString + JSON.stringify(diagram[i])
    }
    if (diagram.length == 0) {
    } else {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
        if (current_hash != hexHash) {
            localStorage.setItem('localhash', hexHash);
            for (i = 0; i < diagram.length; i++) {
                c[i] = diagram[i].constructor.name;
                c[i] = c[i].replace(/"/g,"");
            }
            var obj = {diagram:diagram, points:points, diagram_names:c};
            a = JSON.stringify(obj);
            localStorage.setItem('localdiagram', a);
            return hexHash;
        } else {
        }
    }
}

//This function is used to hash the current diagram, but not storing it locally, so we can compare the current hash with the hash after we have made some changes
// to see if it need to be saved.
function hashcurrent() {
    var hash = 0;
    var diagramToString = "";
    for (var i = 0; i < diagram.length; i++) {
        diagramToString = diagramToString + JSON.stringify(diagram[i])
    }
    for (var i = 0; i < diagramToString.length; i++) {
        var char = diagramToString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    current_hash = hash.toString(16);
}

// retrive an old diagram if it exist.
function loadDiagram() {
    var checkLocalStorage = localStorage.getItem('localdiagram');
    //loacal storage and hash
    if (checkLocalStorage == "" || checkLocalStorage == null) {
    } else {
        var localDiagram = JSON.parse(localStorage.getItem('localdiagram'));
    }
    var localhexHash = localStorage.getItem('localhash');
    var diagramToString = "";
    var hash = 0;
    for(var i = 0; i < diagram.length; i++) {
        diagramToString = diagramToString + JSON.stringify(diagram[i]);
    }
    if (diagram.length == 0) {
    } else {
        for (var i = 0; i < diagramToString.length; i++) {
            var char = diagramToString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        var hexHash = hash.toString(16);
    }
    if (typeof localhexHash !== "undefined" && typeof localDiagram !== "undefined") {
        if (localhexHash != hexHash) {
            var dia = JSON.parse(JSON.stringify(localDiagram));
            b = dia;
            for (var i = 0; i < b.diagram.length; i++) {
                if (b.diagram_names[i] == "Symbol") {
                    b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
                } else if (b.diagram_names[i] == "Path") {
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
            //Redrawn old state.
            updategfx();
        } else {
        }
    } else {
    }
}

//remove localstorage
function removeLocal() {
    localStorage.setItem('localdiagram', "");
}

// Function that rewrites the values of zoom and x+y that's under the canvas element
function reWrite() {
    document.getElementById("valuesCanvas").innerHTML = "<p>Zoom: " + Math.round((zv * 100)) + "% | Coordinates: X=" + startX + " & Y=" + startY + "</p>";
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
