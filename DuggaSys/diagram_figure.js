function drawSegment(pathA,p1, p2) {
    pathA.addsegment(1,p1,p2);
    return pathA;
}

var figurePath = new Path;
var isFirstPoint = true;
var startPosition;
var numberOfPointsInFigure = 0;

function createFigure() {
	if(uimode == "CreateFigure" && md == 4) {
		if(figureMode == "Free") {
			figureFreeDraw();
		} else if(figureMode == "Square") {
			figureSquare();
		}
	}
}

/**
 * Free draw, the user have to click for
 * every point to draw on the canvas.
 */
function figureFreeDraw() {
	p1 = null;
	if(isFirstPoint) {
		p2 = points.addpoint(cx, cy, false);
		startPosition = p2;
		isFirstPoint = false;
	} else {
		// Read and set the values for p1 and p2
		p1 = p2;
		if(activePoint != null) {
			p2 = activePoint;
		} else {
			p2 = points.addpoint(cx, cy, false);
		}
		// Check if the new point is the starting point
		if (points[startPosition].x == points[p2].x &&
			points[startPosition].y == points[p2].y) {
			// Delete all previous rendered lines
			for (var i = 0; i < numberOfPointsInFigure; i++) {
				diagram.pop();
			}
			// Render the figure
			figurePath.addsegment(1, p1, p2);
			diagram.push(figurePath);
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

/**
 * Draws a square between p1 and p2.
 */
function figureSquare() {
	if(isFirstPoint) {
		p1 = points.addpoint(cx, cy, false);
		isFirstPoint = false;
	} else {
		p3 = points.addpoint(cx, cy, false);
		p2 = points.addpoint(points[p1].x, points[p3].y, false);
		p4 = points.addpoint(points[p3].x, points[p1].y, false);
		figurePath.addsegment(1, p1, p2);
		figurePath.addsegment(1, p2, p3);
		figurePath.addsegment(1, p3, p4);
		figurePath.addsegment(1, p4, p1);
		diagram.push(figurePath);
		cleanUp();
	}
}

/**
 * Resets all varables to ther default start value.
 */
function cleanUp() {
	figurePath = new Path;
	startPosition = null;
	uimode = null;
	figureMode = null;
	isFirstPoint = true;
	numberOfPointsInFigure = 0;
	resetSelectionCreateFigure();
}