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

/*

//Last in mousedown in digram_mouse
} else {
        md = 4; // Box select or Create mode.
        //When we are creating a freedraw figure we dont want to update the startposition. The startposition is set inside createFigure()
        //This is to enable the user to hold down the mousebutton or just clicking out points
        if(uimode != "CreateFigure"){
            startMouseCoordinateX = currentMouseCoordinateX;
            startMouseCoordinateY = currentMouseCoordinateY;
        }
        for (var i = 0; i < selected_objects.length; i++) {
            selected_objects[i].targeted = false;
        }
        selected_objects = [];
    }
    if(uimode == "CreateFigure" && figureType == "Square"){
        createFigure();
    }

//In mouse up in digram_mouse
    if (uimode == "CreateFigure" && md == 4) {
        createFigure();
    }
*/



/*



function mousemoveevt(ev, t) {


    if (snapToGrid) {
        if (diagram[i].kind == 1) {
            var firstPoint = points[diagram[i].segments[0].pa];
        } else {
            var firstPoint = points[diagram[i].topLeft];
        }
        var tlx = (Math.round(firstPoint.x / gridSize) * gridSize);
        var tly = (Math.round(firstPoint.y / gridSize) * gridSize);
        var deltatlx = firstPoint.x - tlx;
        var deltatly = firstPoint.y - tly;

        currentMouseCoordinateX = Math.round(currentMouseCoordinateX / gridSize) * gridSize;
        currentMouseCoordinateY = Math.round(currentMouseCoordinateY / gridSize) * gridSize;
        currentMouseCoordinateX -= deltatlx;
        currentMouseCoordinateY -= deltatly;
    }

*/
