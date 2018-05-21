/*
----- THIS FILE HANDLES THE FIGURES AND -----
----- PATHS USED BY THE DIAGRAM FUNCTIONS -----
*/
//--------------------------------------------------------------------
// path - stores a number of segments
//--------------------------------------------------------------------

function Path() {
    this.kind = 1;                  // Path kind
    this.segments = Array();        // Segments
    this.intarr = Array();          // Intersection list (one list per segment)
    this.tmplist = Array();         // Temporary list for testing of intersections
    this.auxlist = Array();         // Auxillary temp list for testing of intersections
    this.fillColor = "#fff";        // Fill color (default is white)
    this.strokeColor = "#000";      // Stroke color (default is black)
    this.Opacity = 1;               // Opacity (default is 100%)
    this.linewidth = 2;             // Line Width (stroke width - default is 2 pixels)
    this.isorganized = true;        // This is true if segments are organized e.g. can be filled using a single command since segments follow a path 1,2-2,5-5,9 etc
    this.targeted = true;                    // An organized path can contain several sub-path, each of which must be organized

    //--------------------------------------------------------------------
    // Performs a delta-move on all points in a path
    //--------------------------------------------------------------------
    this.move = function(movex, movey) {
        for (var i = 0; i < this.segments.length; i++) {
            points[this.segments[i].pa].x += movex;
            points[this.segments[i].pa].y += movey;
        }
        this.calculateBoundingBox();
    }

    //--------------------------------------------------------------------
    // Adds a segment to a path
    //--------------------------------------------------------------------
    this.addsegment = function(kind, p1, p2, p3, p4, p5, p6, p7, p8) {
        if (kind == 1) {
            // Only push segment if it does not already exist
            if (!this.existsline(p1, p2, this.segments)) {
                this.segments.push({kind:1, pa:p1, pb:p2});
            }
        } else {
            alert("Unknown segment type: " + kind);
        }
        this.calculateBoundingBox();
    }

    //--------------------------------------------------------------------
    // Calculates a boundary box for the figure.
    // Saves min and max values of X and Y.
    // This is to faster check for clicks inside of the figure.
    //--------------------------------------------------------------------
    this.calculateBoundingBox = function() {
        var minX = points[this.segments[0].pa].x;
        var maxX = minX;
        var minY = points[this.segments[0].pa].y;
        var maxY = minY;
        for (var i = 1; i < this.segments.length; i++) {
            var tempX = points[this.segments[i].pa].x;
            var tempY = points[this.segments[i].pa].y;
            if (tempX < minX) {
                minX = tempX;
            } else if (tempX > maxX) {
                maxX = tempX;
            }
            if (tempY < minY) {
                minY = tempY;
            } else if (tempY > maxY) {
                maxY = tempY;
            }
        }
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    //--------------------------------------------------------------------
    // Draws filled path to screen (or svg when that functionality is added)
    //--------------------------------------------------------------------
    this.draw = function (fillstate, strokestate) {
        if (this.isorganized == false) {
            alert("Only organized paths can be filled!");
        }
        if (this.segments.length > 0) {
            // Assign stroke style, color, transparency etc
            ctx.strokeStyle = this.targeted ? "#F82" : this.strokeColor;
            ctx.fillStyle = this.fillColor;
            ctx.globalAlpha = this.Opacity;
            ctx.lineWidth = this.linewidth;

            ctx.beginPath();
            var pseg = this.segments[0];
            ctx.moveTo(points[pseg.pa].x, points[pseg.pa].y);
            for (var i = 0; i < this.segments.length; i++) {
                var seg = this.segments[i];
                // If we start over on another sub-path, we must start with a moveto
                if (seg.pa != pseg.pb) {
                    ctx.moveTo(points[seg.pa].x, points[seg.pa].y);
                }
                // Draw current line
                ctx.lineTo(points[seg.pb].x, points[seg.pb].y);
                // Remember previous segment
                pseg = seg;
            }
            // Make either stroke or fill or both -- stroke always after fill
            if (fillstate) {
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 6;
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.fill();
                ctx.restore();
            }
            if (strokestate) {
                ctx.stroke();
            }
            // Reset opacity so that following draw operations are unaffected
            ctx.globalAlpha = 1.0;
        }
    }

    //--------------------------------------------------------------------
    // Returns true if coordinate xk, yk falls inside the bounding box of the symbol
    //--------------------------------------------------------------------
    this.isClicked = function(xCoordinate, yCoordinate) {
        var intersections = 0;
        if (xCoordinate > this.minX && xCoordinate < this.maxX && yCoordinate > this.minY && yCoordinate < this.maxY) {
            for (var j = 0; j < this.segments.length; j++) {
                var pointA = points[this.segments[j].pa];
                var pointB = points[this.segments[j].pb];
                if ((pointA.x <= xCoordinate && pointB.x >= xCoordinate) || (pointA.x >= xCoordinate && pointB.x <= xCoordinate)) {
                    var deltaX = pointB.x - pointA.x;
                    var deltaY = pointB.y - pointA.y;
                    var k = deltaY / deltaX;
                    if (pointB.x < pointA.x) {
                        var tempPoint = pointA;
                        pointA = pointB;
                        pointB = pointA;
                    }
                    var x = xCoordinate - pointA.x;
                    var y = (k * x) + pointA.y;
                    if (y < yCoordinate) {
                        intersections++;
                    }
                }
            }
            return intersections % 2;
        }
        return false;
    }

    this.checkForHover = function (mx, my) {
        return this.isClicked(mx, my);
    }

    //--------------------------------------------------------------------
    // Recursively splits a line at intersection points from top to bottom until there is no line left
    //--------------------------------------------------------------------
    this.recursetest = function(p1,p2) {
        var yk = 5000;
        var endres = null;
        for (var i = 0; i < this.segments.length; i++) {
            var item = this.segments[i];
            var result = this.intersection(p1, p2, item.pa, item.pb);
            if (result.state == true && result.y < yk) {
                yk = result.y;
                endres = result;
            }
        }
        if (yk != 5000) {
            // Create new point (if it does not already exist)
            pointno = points.length
            points.push({x:endres.x, y:endres.y});
            // Depending on direction of p1 and p2
            if (points[p2].y < points[p1].y) {
                this.tmplist.push({kind:1, pa:pointno, pb:p2});
                this.recursetest(pointno, p1);
            } else {
                this.tmplist.push({kind:1, pa:pointno, pb:p1});
                this.recursetest(pointno, p2);
            }
        } else {
            this.tmplist.push({kind:1, pa:p1, pb:p2});
        }
    }

    //--------------------------------------------------------------------
    // Line to line intersection
    // Does not detect intersections on end points (we do not want end points to be part of intersection set)
    //--------------------------------------------------------------------
    this.intersection = function(p1, p2, p3, p4) {
        var x1 = points[p1].x;
        var y1 = points[p1].y;
        var x2 = points[p2].x;
        var y2 = points[p2].y;
        var x3 = points[p3].x;
        var y3 = points[p3].y;
        var x4 = points[p4].x;
        var y4 = points[p4].y;
        // Basic fix for straight lines
        if (x1 == x2) {
            x2 += 0.01;
        }
        if (y1 == y2) {
            y2 += 0.01;
        }
        if (x3 == x4) {
            x4 += 0.01;
        }
        if (y3 == y4) {
            y4 += 0.01;
        }
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
            return {state:false, x:0, y:0};
        } else {
            if (x1 >= x2) {
                if (!(x2 < x && x < x1)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(x1 < x && x < x2)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (y1 >= y2) {
                if (!(y2 < y && y < y1)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(y1 < y && y < y2)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (x3 >= x4) {
                if (!(x4 < x && x < x3)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(x3 < x && x < x4)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (y3 >= y4) {
                if (!(y4 < y && y < y3)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(y3 < y && y < y4)) {
                    return {state:false, x:0, y:0};
                }
            }
        }
        return {state:true, x:x, y:y};
    }

    //--------------------------------------------------------------------
    // Checks if a line already exists but in the reverse direction
    // Only checks lines, not bezier curves
    //--------------------------------------------------------------------
    this.existsline = function (p1, p2, segmentset) {
        if (p1 == p2) {
            return true;
        }
        for (var i = 0; i < segmentset.length; i++) {
            var segment = segmentset[i];
            if ((segment.pa == p1 && segment.pb == p2) ||
                (segment.pa == p2 && segment.pb == p1)) {
                return true;
            }
        }
        return false;
    }

    //--------------------------------------------------------------------
    // Line to line intersection
    // Does not detect intersections on end points (we do not want end points to be part of intersection set)
    //--------------------------------------------------------------------
    this.boolOp = function(otherpath) {
        // Clear temporary lists used for merging paths
        this.tmplist = [];
        this.auxlist = [];
        otherpath.tmplist = [];
        otherpath.auxlist = [];
        // Recurse local segment set and check for crossing lines
        for (var i = 0; i < otherpath.segments.length; i++) {
            this.recursetest(otherpath.segments[i].pa, otherpath.segments[i].pb);
        }
        // Check if each segment is inside the joining set
        for (var i = 0; i < this.tmplist.length; i++) {
            var item = this.tmplist[i];
            // Check if center of line is inside or outside
            var p1 = points[item.pa];
            var p2 = points[item.pb];
            var xk = (p1.x + p2.x) * 0.5;
            var yk = (p1.y + p2.y) * 0.5;
            if (this.isClicked(xk, yk, otherpath)) {
                if (!this.existsline(item.pa, item.pb, this.auxlist)) {
                    this.auxlist.push(item);
                }
            }
        }
        // Recurse into joining segment set and check for crossing lines
        for (var i = 0; i < this.segments.length; i++) {
            var item = this.segments[i];
            otherpath.recursetest(item.pa, item.pb);
        }
        // Check if each segment is inside the local set
        for (var i = 0; i < otherpath.tmplist.length; i++) {
            var item = otherpath.tmplist[i];
            // Check if center of line is inside or outside
            var p1 = points[item.pa];
            var p2 = points[item.pb];
            var xk = (p1.x + p2.x) * 0.5;
            var yk = (p1.y + p2.y) * 0.5;
            if (otherpath.inside(xk, yk, this)) {
                if (!this.existsline(item.pa, item.pb, this.auxlist)) {
                    this.auxlist.push(item);
                }
            }
        }
        alert(this.auxlist.length);
        this.drawsegments(this.auxlist);
    }

    //--------------------------------------------------------------------
    // Debug drawing of a segment set (for example for drawing tmplist, auxlist etc)
    //--------------------------------------------------------------------
    this.drawsegments = function (segmentlist, color) {
        // Draw aux set
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = "#46f";
        for (var i = 0; i < segmentlist.length; i++) {
            var line = segmentlist[i];
            // If line is a straight line
            if (line.kind == 1) {
                ctx.beginPath();
                ctx.moveTo(points[line.pa].x, points[line.pa].y);
                ctx.lineTo(points[line.pb].x, points[line.pb].y);
                ctx.stroke();
            }
        }
    }

    this.erase = function() {
        for (i = 0; i < this.segments.length; i++) {
            points[this.segments[i].pa] = waldoPoint;
            points[this.segments[i].pb] = waldoPoint;
        }
    }
}

function drawSegment(pathA, p1, p2) {
    pathA.addsegment(1, p1, p2);
    return pathA;
}

var figurePath = new Path();
var isFirstPoint = true;
var startPosition;
var numberOfPointsInFigure = 0;

function createFigure() {
    startMouseCoordinateX = currentMouseCoordinateX;
    startMouseCoordinateY = currentMouseCoordinateY;
    if (figureType == "Free") {
        figureFreeDraw();
    } else if (figureType == "Square") {
        figureSquare();
    }
}

//--------------------------------------------------------------------
// Free draw, the user have to click for every point to draw on the canvas.
//--------------------------------------------------------------------
function figureFreeDraw() {
    p1 = null;
    if (isFirstPoint) {
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        startPosition = p2;
        isFirstPoint = false;
    } else {
        // Read and set the values for p1 and p2
        p1 = p2;
        if (activePoint != null) {
            p2 = activePoint;
        } else {
            p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        }
        // Check if the new point is the starting point
        var closestPoint = points.closestPoint(points[p2].x, points[p2].y, p2);
        if(closestPoint.index == startPosition && closestPoint.distance < 20){
            // Delete all previous rendered lines
            for (var i = 0; i < numberOfPointsInFigure; i++) {
                diagram.pop();
            }
            // Render the figure
            points.splice(p2, 1);
            p2 = startPosition;
            figurePath.addsegment(1, p1, p2);
            md = 0; // To prevent selectbox spawn when clicking out of freedraw mode
            diagram.push(figurePath);
            selected_objects.push(figurePath);
            lastSelectedObject = diagram.length - 1;
            cleanUp();
        } else {
            // Temporary store the new line and then render it
            var tempPath = new Path;
            tempPath.addsegment(1, p1, p2);
            diagram.push(tempPath);
            // Save the new line to the figure
            figurePath.addsegment(1, p1, p2);
            numberOfPointsInFigure++;
        }
    }
}

//--------------------------------------------------------------------
// Draws a square between p1 and p2.
//--------------------------------------------------------------------
function figureSquare() {
    if (isFirstPoint) {
        p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        isFirstPoint = false;
    } else {
        p3 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        p2 = points.addPoint(points[p1].x, points[p3].y, false);
        p4 = points.addPoint(points[p3].x, points[p1].y, false);
        figurePath.addsegment(1, p1, p2);
        figurePath.addsegment(1, p2, p3);
        figurePath.addsegment(1, p3, p4);
        figurePath.addsegment(1, p4, p1);
        diagram.push(figurePath);
        cleanUp();
    }
}

//--------------------------------------------------------------------
// Resets all varables to ther default start value.
//--------------------------------------------------------------------
function cleanUp() {
    figurePath = new Path;
    startPosition = null;
    isFirstPoint = true;
    numberOfPointsInFigure = 0;
    p2 = null;
}

function openInitialDialog() {
    lastSelectedObject = diagram.length -1;
    diagram[lastSelectedObject].targeted = true;
    openAppearanceDialogMenu();
}
