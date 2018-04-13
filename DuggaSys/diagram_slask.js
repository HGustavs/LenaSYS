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
/*
//Was in mousemoveevt in digram_mouse
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
    }
else if(uimode == "CreateFigure" && figureType == "Square"){
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
        }

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
Function that wasent used in diagram.js
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
*/

/* Functions from diagram_symbol - Arity
    this.updateArityPosition = function() {
        for (var i = 0; i < this.arity.length; i++) {
            for (var j = 0; j < this.connectorTop.length; j++) {
                if (this.connectorTop[j].from == this.arity[i][0].connectionPoint) {
                    this.setArityToTop(i);
                }
            }
            for (var j = 0; j < this.connectorBottom.length; j++) {
                if (this.connectorBottom[j].from == this.arity[i][0].connectionPoint) {
                    this.setArityToBottom(i);
                }
            }
            for (var j = 0; j < this.connectorRight.length; j++) {
                if (this.connectorRight[j].from == this.arity[i][0].connectionPoint) {
                    this.setArityToRight(i);
                }
            }
            for (var j = 0; j < this.connectorLeft.length; j++) {
                if (this.connectorLeft[j].from == this.arity[i][0].connectionPoint) {
                    this.setArityToLeft(i);
                }
            }
        }
    }

    this.setArityToTop = function(index) {
        var arity0 = this.arity[index][0];
        var arity1 = this.arity[index][1];
        var point = points[arity0.connectionPoint];
        arity0.x = point.x - arityBuffer;
        arity0.y = point.y - arityBuffer;
        arity0.align = "end";
        arity0.baseLine = "bottom";
        arity1.x = point.x + arityBuffer;
        arity1.y = point.y - arityBuffer;
        arity1.align = "start";
        arity1.baseLine = "bottom";
    }

    this.setArityToBottom = function(index) {
        var arity0 = this.arity[index][0];
        var arity1 = this.arity[index][1];
        var point = points[arity0.connectionPoint];
        arity0.x = point.x - arityBuffer;
        arity0.y = point.y + arityBuffer;
        arity0.align = "end";
        arity0.baseLine = "top";
        arity1.x = point.x + arityBuffer;
        arity1.y = point.y + arityBuffer;
        arity1.align = "start";
        arity1.baseLine = "top";
    }

    this.setArityToRight = function(index) {
        var arity0 = this.arity[index][0];
        var arity1 = this.arity[index][1];
        var point = points[arity0.connectionPoint];
        arity0.x = point.x + arityBuffer;
        arity0.y = point.y - arityBuffer;
        arity0.align = "start";
        arity0.baseLine = "bottom";
        arity1.x = point.x + arityBuffer;
        arity1.y = point.y + arityBuffer;
        arity1.align = "start";
        arity1.baseLine = "top";
    }

    this.setArityToLeft = function(index) {
        var arity0 = this.arity[index][0];
        var arity1 = this.arity[index][1];
        var point = points[arity0.connectionPoint];
        arity0.x = point.x - arityBuffer;
        arity0.y = point.y - arityBuffer;
        arity0.align = "end";
        arity0.baseLine = "bottom";
        arity1.x = point.x - arityBuffer;
        arity1.y = point.y + arityBuffer;
        arity1.align = "end";
        arity1.baseLine = "top";
    }
*/
