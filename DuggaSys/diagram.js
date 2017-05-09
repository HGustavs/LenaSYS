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
var lastDiagramedit = localStorage.getItem('last_edit');          // the last date the diagram was change in milisecounds.
var refresh_timer = setRefreshTime();              //  set how often the diagram should be refreshed.
var refresh_lock = false;               // used to set if the digram should stop refreshing or not.
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
// eraseLines - removes all the lines connected to an object
//--------------------------------------------------------------------
diagram.eraseLines = function(object, privateLines) {
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

//--------------------------------------------------------------------
// Sort all connectors related to entity.
//--------------------------------------------------------------------
diagram.sortConnectors = function() {
    for (var i = 0; i < diagram.length; i++){
        if (diagram[i].symbolkind == 3){
            diagram[i].sortAllConnectors();
        }
    }
}

function initcanvas() {
    //hashes the current diagram, and then compare if it have been change to see if it needs to be saved.
    setInterval(refreshFunction, refresh_timer);
    setInterval(hashcurrent, hash_timer);
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
    canvas.addEventListener('touchmove', mousemoveevt, false);
    canvas.addEventListener('touchstart', mousedownevt, false);
    canvas.addEventListener('touchend', mouseupevt, false);
}

// Function to enable and disable the grid, functionality is related to cx and cy
function enableGrid(element) {
    if (snapToGrid == false) {
        snapToGrid = true;
    } else {
        snapToGrid = false;
    }
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
    // Sort alla connectors
    diagram.sortConnectors();
    // Redraw diagram
    diagram.draw();
    // Draw all points as crosses
    points.drawpoints();
}

function movePoint(point){
    point="";
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

      diagram.eraseLines(object, private_lines);
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
            "Relation type: </br>" +
            "<select id ='relationType'>" +
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
    diagram[selobj].relationType = document.getElementById('relationType').value;
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
    var quadrantx = (startX < 0)? startX: -startX;
    var quadranty = (startY < 0)? startY: -startY;
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

//calculate the hash. does this by converting all objects to strings from diagram. then do some sort of calculation. used to save the diagram. it also save the local diagram
function hashfunction() {
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
    for (var i = 0; i < localStorage.length; i++){
        localStorage.removeItem("localdiagram");
    }
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

//--------------------------------------------------------------------
// Refresh
//--------------------------------------------------------------------
function refreshFunction(){
    console.log("refreshFunction running");
    refresh_timer = setRefreshTime();
    if(refresh_lock == false){
        console.log("refresh diagram");
        loadDiagram();
    } else{
        //do nothing
    }
}

function getCurrentDate(){
    console.log("getCurrentDate running");
    var current_date = new Date();
    var date_in_milisec = current_date.getTime();
    return date_in_milisec;
}

function setRefreshTime(){
    console.log("setRefreshTime running");
    var currentDiagramchange = getCurrentDate();
    var time = 5000;
    lastDiagramedit = localStorage.getItem('last_edit');
    if(typeof lastDiagramedit !== "undefined"){
        var timediffrence = currentDiagramchange - lastDiagramedit;
        if(timediffrence<= 10800000 && timediffrence <= 259200000){
            refresh_lock = false;
            console.log("setRefreshTime seting time to" + time + " " + timediffrence);
            return time;
        } else if(timediffrence >= 259200000 && timediffrence <= 604800000){
            refresh_lock = false;
            time = 300000;
            console.log("setRefreshTime seting time to" + time+ " " + timediffrence);
            return time;
        } else if(timediffrence > 604800000){
            refresh_lock = true;
            time = 300000;
            console.log("setRefreshTime seting time to" + time + " will only update on refresh."+ " " + timediffrence);
            return time;
        } else{
            return time;
        }
    } else{
        return time;
    }
}

//open a menu to change the font on all entities.
function fontMenu() {
    document.getElementById("myCanvas").style.cursor = "default";
    $("#appearance").show();
    $("#appearance").width("auto");
    var form = document.getElementById("f01");
    form.innerHTML = "Font family:<br>" +
    "<select id ='font'>" +
    "<option value='arial' selected>Arial</option>" +
    "<option value='Courier New'>Courier New</option>" +
    "<option value='Impact'>Impact</option>" +
    "<option value='Calibri'>Calibri</option>" +
    "</select><br>" +
    "<button type='submit' class='submit-button' onclick='globalFont(); hashfunction(); updategfx();' style='float: none; display: block; margin: 10px auto;'>OK</button>";
}

//change the font on all entities to the same font. 
function globalFont(){
    for(var i = 0; i < diagram.length; i++){
        if(diagram[i].kind == 2 && diagram[i].symbolkind == 2 || diagram[i].symbolkind == 3 || diagram[i].symbolkind == 1 || diagram[i].symbolkind == 5){
            diagram[i].font = document.getElementById('font').value;
        }
    }
}