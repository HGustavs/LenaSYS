/*
----- THIS FILE HANDLES ALL MOUSEEVENTS IN THE DIAGRAM -----
*/


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
    if (sel.distance <= tolerance) {
        activePoint = sel.point;
    } else {
        activePoint = null;
    }
}

function pointDistance(point1, point2) {
    var width = (point1.x > point2.x)? point1.x - point2.x: point2.x - point1.x;
    var height = (point1.y > point2.y)? point1.y - point2.y: point2.y - point1.y;

    return [width, height];
}

function mousemoveevt(ev, t) {
    xPos = ev.clientX;
    yPos = ev.clientY;
    oldMouseCoordinateX = currentMouseCoordinateX;
    oldMouseCoordinateY = currentMouseCoordinateY;
    hovobj = diagram.itemClicked();
    if (ev.pageX || ev.pageY == 0) { // Chrome
        currentMouseCoordinateX = (((ev.pageX - canvas.offsetLeft) * (1 / zoomValue)) + (sx * (1 / zoomValue)));
        currentMouseCoordinateY = (((ev.pageY - canvas.offsetTop) * (1 / zoomValue)) + (sy * (1 / zoomValue)));
    } else if (ev.layerX || ev.layerX == 0) { // Firefox
        currentMouseCoordinateX = (((ev.layerX - canvas.offsetLeft) * (1 / zoomValue)) + (sx * (1 / zoomValue)));
        currentMouseCoordinateY = (((ev.layerY - canvas.offsetTop) * (1 / zoomValue)) + (sy * (1 / zoomValue)));
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
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
            /*if (diagram[i].middleDivider == sel.index || diagram[i].centerPoint == sel.index) {
                md = 3;
                handleSelect();
                return;
            }*/
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
    // Symbol (1 UML diagram symbol 2 ER Attribute 3 ER Entity 4 Lines 5 ER Relation)
    if (uimode == "CreateClass" && md == 4) {
        classB = new Symbol(1);
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
        erAttributeA = new Symbol(2);
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
        erEnityA = new Symbol(3);
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
            erLineA = new Symbol(4);
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
            //diagram.createAritySymbols(diagram[lastSelectedObject]);
        }

    } else if (uimode == "CreateERRelation" && md == 4) {
        erRelationA = new Symbol(5);
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
        //console.log("Error:\nFollowing error is prompted because the element has not successfully been loaded\ninto the document before trying to find it by ID. These dialogs are loaded into\nthe diagram dynamically as of Issue #3733");
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
