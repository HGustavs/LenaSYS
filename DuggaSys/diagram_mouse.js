/*
----- THIS FILE HANDLES ALL MOUSEEVENTS IN THE DIAGRAM -----
*/

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
    if(zv>=2.0){
        alert("You can't zoom in more!");
    }else{
        var oldZV = zv;
        zv += 0.1;
        reWrite();
        // To be able to use the 10% increase och decrease, we need to use this calcuation.
        var inScale = ((1 / oldZV) * zv);
        ctx.scale(inScale, inScale);
        updategfx();
    }
}

function zoomOutClick() {
    if(zv<0.6){
        alert("You can't zoom out more!");
    }else{
        var oldZV = zv;
        zv -= 0.1;
        reWrite();
        // To be able to use the 10% increase och decrease, we need to use this calcuation.
        var outScale = ((1 / oldZV) * zv);
        ctx.scale(outScale, outScale);
        updategfx();
        drawGrid();
    }
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

function pointDistance(point1, point2) {
    var width = (point1.x > point2.x)? point1.x - point2.x: point2.x - point1.x;
    var height = (point1.y > point2.y)? point1.y - point2.y: point2.y - point1.y;

    return [width, height];
}

function mousemoveevt(ev, t) {
    xPos = ev.clientX;
    yPos = ev.clientY;
    mox = cx;
    moy = cy;
    hovobj = diagram.inside();
    if (ev.pageX || ev.pageY == 0) { // Chrome
        cx = (((ev.pageX - acanvas.offsetLeft) * (1/zv)) + (startX*(1/zv)));
        cy = (((ev.pageY - acanvas.offsetTop) * (1/zv)) + (startY*(1/zv)));
    } else if (ev.layerX || ev.layerX == 0) { // Firefox
        cx = (((ev.layerX - acanvas.offsetLeft) * (1/zv)) + (startX*(1/zv)));
        cy = (((ev.layerY - acanvas.offsetTop) * (1/zv)) + (startY*(1/zv)));
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        cx = (((ev.offsetX - acanvas.offsetLeft) * (1/zv)) + (startX*(1/zv)));
        cy = (((ev.offsetY - acanvas.offsetTop) * (1/zv)) + (startY*(1/zv)));
    }
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
        movobj = diagram.inside();
        updateActivePoint();
    } else if (md == 1) {
        // If mouse is pressed down and no point is close show selection box
    } else if (md == 2) {
        // If mouse is pressed down and at a point in selected object - move that point
        if (diagram[selobj].targeted == true) {
            if (diagram[selobj].kind == 1) {
                for (var i = 0; i < diagram[selobj].segments.length; i++) {
                    if (diagram[selobj].segments[i].pa == sel.ind) {
                        points[diagram[selobj].segments[i].pa].x = cx;
                        points[diagram[selobj].segments[i].pa].y = cy;
                    }
                }
            } else {
                if (diagram[selobj].bottomRight == sel.ind && diagram[selobj].symbolkind != 5) {
                    points[diagram[selobj].bottomRight].x = cx;
                    points[diagram[selobj].bottomRight].y = cy;
                } else if (diagram[selobj].topLeft == sel.ind && diagram[selobj].symbolkind != 5) {
                    points[diagram[selobj].topLeft].x = cx;
                    points[diagram[selobj].topLeft].y = cy;
                }
            }
        }
    } else if (md == 3) {
        // If mouse is pressed down inside a movable object - move that object
        if (movobj != -1) {
            for (var i = 0; i < diagram.length; i++) {
                if (diagram[i].targeted == true) {
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
                        cx = Math.round(cx / gridSize) * gridSize;
                        cy = Math.round(cy / gridSize) * gridSize;
                        cx -= deltatlx;
                        cy -= deltatly;
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
        if (uimode == "CreateEREntity"){
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
            if (ghostingcrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossfillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateERRelation"){
            var midx = sx+((cx-sx)/2);
            var midy = sy+((cy-sy)/2);
            ctx.setLineDash([3, 3]);
            ctx.beginPath(1);
            ctx.moveTo(midx, sy);
            ctx.lineTo(cx, midy);
            ctx.lineTo(midx, cy);
            ctx.lineTo(sx, midy);
            ctx.lineTo(midx, sy);
            ctx.strokeStyle = "#d51";
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.closePath(1);
            if (ghostingcrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossfillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateERAttr"){
            drawOval(sx, sy, cx, cy);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = "#d51";
            ctx.stroke();
            if (ghostingcrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossfillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else if(uimode == "CreateLine") {
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(cx, cy);
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = "#d51";
            ctx.stroke();
            if (ghostingcrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossfillStyle = "rgba(255, 102, 68, 0.0)";
            }
        } else {
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
            if (ghostingcrosses == true) {
                crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
                crossfillStyle = "rgba(255, 102, 68, 0.0)";
            }
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
    if (selobj >= 0) {
        diagram[selobj].targeted = true;
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
        erAttributeA.object_type = "";
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

        erEnityA.object_type = "";
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

        erLineA.object_type = "";
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

function doubleclick(ev) {
    var posistionX = (startX + xPos);
    var posistionY = (startY + yPos);
    if (selobj != -1 && diagram[selobj].targeted == true) {
        openAppearanceDialogMenu();
        console.log("Error:\nFollowing error is prompted because the element has not successfully been loaded\ninto the document before trying to find it by ID. These dialogs are loaded into\nthe diagram dynamically as of Issue #3733");
        document.getElementById('nametext').value = diagram[selobj].name;
        document.getElementById('fontColor').value = diagram[selobj].fontColor;
        document.getElementById('font').value = diagram[selobj].font;
        document.getElementById('TextSize').value = diagram[selobj].sizeOftext;
        if (document.getElementById('object_type') != null) {
            document.getElementById('object_type').value = diagram[selobj].object_type;
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
        if(cx > sx) {
            cx = sx + relationTemplate.width;
        } else{
            sx=cx;
            cx = sx+relationTemplate.width;
        }
        if(cy > sy) {
            cy = sy + relationTemplate.height;
        } else{
            sy=cy;
            cy = sy+relationTemplate.height;
        }
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
    moveValue = 1;
    updategfx();
    reWrite();
}

function mouseupcanvas(e) {
    document.getElementById("myCanvas").removeEventListener('mousemove', mousemoveposcanvas, false);
}
