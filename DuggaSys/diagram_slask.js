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