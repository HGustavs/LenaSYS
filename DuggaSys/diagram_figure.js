/**
 * Created by b15matki on 2017-03-30.
 * lbl
 */

function drawSegment(pathA,p1, p2) {
    pathA.addsegment(1,p1,p2);
    return pathA;

}

var figurePath = new Path;
var isFirstPoint = true;
var startPosition;

function createFigure() {
	if(uimode == "CreateFigure" && md == 4) {
		p1 = null;
		if(!isFirstPoint) {
			p1 = p2;
			if(activePoint != null) {
				p2 = activePoint;
				uimode = null;
				isFirstPoint = true;
			} else {
				p2 = points.addpoint(cx, cy, false);
			}
			figurePath.addsegment(1, p1, p2);
			diagram.pop();
			diagram.push(figurePath);
		} else {
			p2 = points.addpoint(cx, cy, false);
			isFirstPoint = false;
		}
	}
}