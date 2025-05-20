
/**
 * @description Constructs a string containing the svg line-elements of the inputted line object in parameter.
 * @param {Object} line The line object that is drawn.
 * @param {boolean} targetGhost Is the targeted line a ghost line
 */

function drawLine(line, targetGhost = false) {

    let lineStr = ""; // only the lines, polylines, arrows etc
    let labelStr = ""; // labels and label backgrounds
    let fromElemMouseY;
    let toElemMouseY;

    // Element line is drawn from/to
    let felem = data[findIndex(data, line.fromID)];
    if (!line.fromY) {
        line.fromY = lastMousePos.y;
    }
    fromElemMouseY = line.fromY;

    let telem;
    if (targetGhost) {
        telem = ghostElement;
        toElemMouseY = lastMousePos.y;
        isCurrentlyDrawing = true;
    } else {
        telem = data[findIndex(data, line.toID)];
        isCurrentlyDrawing = false;

        // Cache toY only if not already set
        if (!line.toY) {
            line.toY = lastMousePos.y;
        }
        toElemMouseY = line.toY;
    }

    if (!felem || !telem) return { lineStr: "", labelStr: "" };
    line.type = (telem.type == entityType.note) ? telem.type : felem.type;
    let strokeDash = (line.kind == lineKind.DASHED || line.type == entityType.note) ? "10" : "0";
    let lineColor = isDarkTheme() ? color.WHITE : color.BLACK;
    let isSelected = contextLine.includes(line);
    if (isSelected) lineColor = color.SELECTED;
    let fx, fy, tx, ty, offset;

    // Sets the to-coordinates to the same as the from-coordinates after getting line attributes
    // if the line is recursive
    if (line.recursive) {
        [fx, fy, tx, ty, offset] = getLineAttributes(line, felem, felem, line.ctype, fromElemMouseY, toElemMouseY);
        //Setting start position for the recursive line, to originate from the top.
        fx = felem.cx;
        fy = felem.y1;
        offset.x1 = 0;
        offset.y1 = 0;
        tx = fx;
        ty = fy;
    } else {
        [fx, fy, tx, ty, offset] = getLineAttributes(line, felem, telem, line.ctype, fromElemMouseY, toElemMouseY);
    }

    // Follows the cursor while drawing the line
    if (isCurrentlyDrawing) {
        tx = event.clientX;
        ty = event.clientY;
    }


    const lineSpacing = 30 * zoomfact; //Controlls spacing between lines

    //Checks if a line have gotten any properties from the checkAdjacentLines function 
    //fromOffsetIncrease, fromNumberOfLInes, toOffsetIncrease and toNumberOfLines
    //Different offset for the side they go to and come from
    if ("fromOffsetIndex" in line && "fromNumberOfLines" in line) {
        const fromOffsetIncrease = (line.fromOffsetIndex - (line.fromNumberOfLines - 1) / 2) * lineSpacing;
        if (line.ctype === lineDirection.UP || line.ctype === lineDirection.DOWN) {
            offset.x1 += fromOffsetIncrease;
        } else if (line.ctype === lineDirection.LEFT || line.ctype === lineDirection.RIGHT) {
            offset.y1 += fromOffsetIncrease;
        }
    }
    if ("toOffsetIndex" in line && "toNumberOfLines" in line) {
        const toOffsetIncrease = (line.toOffsetIndex - (line.toNumberOfLines - 1) / 2) * lineSpacing;
        if (line.ctype === lineDirection.UP || line.ctype === lineDirection.DOWN) {
            offset.x2 += toOffsetIncrease;
        } else if (line.ctype === lineDirection.LEFT || line.ctype === lineDirection.RIGHT) {
            offset.y2 += toOffsetIncrease;
        }
    }

    if (targetGhost && line.type == entityType.SD) line.endIcon = SDLineIcons.ARROW;
    if (line.type == entityType.ER) {
        [fx, fy, tx, ty, offset] = getLineAttributes(line, felem, telem, line.ctype, fromElemMouseY, toElemMouseY);
        if (line.kind == lineKind.NORMAL) {
            lineStr += `<line 
                        id='${line.id}' 
                        x1='${fx + offset.x1}' y1='${fy + offset.y1}' 
                        x2='${tx + offset.x2}' y2='${ty + offset.y2}' 
                        stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'
                    />`;
        } else if (line.kind == lineKind.DOUBLE) {
            let dy = -(tx - fx);
            let dx = ty - fy;
            let len = Math.sqrt((dx * dx) + (dy * dy));
            dy /= len;
            dx /= len;

            const double = (a, b) => {
                return `<line 
                id='${line.id}-${b}' 
                x1='${fx + a * dx * strokewidth * 1.5 + offset.x1}' 
                y1='${fy + a * dy * strokewidth * 1.5 + offset.y1}' 
                x2='${tx + a * dx * strokewidth * 1.5 + offset.x2}' 
                y2='${ty + a * dy * strokewidth * 1.5 + offset.y2}' 
                stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'
                
                />`;
            };
            lineStr += double(1, 1);
            lineStr += double(-1, 2);
        }
    } else if ((line.type == entityType.SD && line.innerType != SDLineType.SEGMENT)) {
        if (line.recursive) {
            lineStr += drawRecursive(offset, line, lineColor, strokewidth, strokeDash, felem);

        } else if ((fy > ty) && (line.ctype == lineDirection.UP)) {
            //UMLFinalState seems to always end up as telem after line has been drawn even if drawn line originated from it
            if (telem.kind === elementTypesNames.UMLFinalState) {
                offset.y2 = -4 + 3 / zoomfact;
                offset.x2 = 0;
                //Special offset for SD entity telem, since it can be both felem and telem. UMLInitialState can only be felem and doesn't utilize x2 or y2
            } else if (telem.kind === elementTypesNames.SDEntity) {
                offset.y2 = -15;
            } else { offset.y2 = 0; } //Aligning line with mouse coordinate before telem has been set
            offset.y1 = 15;
            fy -= 15*zoomfact;
            ty += 15*zoomfact;

        } else if ((fy < ty) && (line.ctype == lineDirection.DOWN)) {
            if (telem.kind === elementTypesNames.UMLFinalState) {
                offset.y2 = 3;
                offset.x2 = 0;
            } else if (telem.kind === elementTypesNames.SDEntity) {
                offset.y2 = 15;
            } else { offset.y2 = 0; }
            offset.y1 = -15;
            fy += 15*zoomfact;
            ty -= 15*zoomfact;


        } else if ((fx > tx) && (line.ctype == lineDirection.LEFT)) {
            if (telem.kind === elementTypesNames.UMLFinalState) {
                offset.x2 = 1 / zoomfact;
                offset.y2 = 0;
            } else if (telem.kind === elementTypesNames.SDEntity) {
                offset.x2 = -15;
            } else { offset.x2 = 0; }
            offset.x1 = 15;
            fx -= 15*zoomfact;
            tx += 15*zoomfact;


        } else if ((fx < tx) && (line.ctype == lineDirection.RIGHT)) {
            if (telem.kind === elementTypesNames.UMLFinalState) {
                offset.x2 = 1 / zoomfact;
                offset.y2 = 0;
            } else if (telem.kind === elementTypesNames.SDEntity) {
                offset.x2 = 15;
            } else { offset.x2 = 0; }
            offset.x1 = -15;
            fx += 15*zoomfact;
            tx -= 15*zoomfact;
        }
        lineStr += `<line 
                    id='${line.id}' 
                    x1='${fx + offset.x1 * zoomfact}' 
                    y1='${fy + offset.y1 * zoomfact}' 
                    x2='${tx + offset.x2 * zoomfact}' 
                    y2='${ty + offset.y2 * zoomfact}' 
                    fill='none' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}' stroke-dasharray='${strokeDash}'
                />`;
    } else { // UML, IE or SD
        if (line.recursive) {
            lineStr += drawRecursive(offset, line, lineColor, strokewidth, strokeDash, felem);
        }
        else {
            lineStr += drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash);
        }

    }

    //Drawing Arrow and other line icons for UML abnd IE lines
    if (line.recursive) {
        //Arrow/icon location dependant on element length, so its always in the top right corner of the element.
        const length = 40 * zoomfact;
        const elementLength = felem.x2 - felem.x1;
        let startX = felem.x1 + elementLength - length;
        let startY = felem.y1;
        
        //Same values for UML and IE as they use the same icons, just different element values.
        if(line.type !== entityType.SD || line.type !== entityType.SE){
            line.ctype = lineDirection.UP;  //So arrows point down
            lineStr += drawLineIcon(line.startIcon, line.ctype, startX, startY, lineColor, line);
            lineStr += drawLineIcon(line.endIcon, line.ctype, (startX + length), startY, lineColor, line);
        }
    }else {
        lineStr += drawLineIcon(line.startIcon, line.ctype, fx + offset.x1, fy + offset.y1, lineColor, line);
        lineStr += drawLineIcon(line.endIcon, line.ctype.split('').reverse().join(''), tx + offset.x2, ty + offset.y2, lineColor, line);
    }
    // Always allow arrowheads to render if icon is ARROW
    // If the line is SEGMENTED (has 90-degree bends), draw a fixed arrowhead with iconPoly.
    // Otherwise, draw a rotated arrowhead using drawArrowPoint based on the line direction.
    if (line.type == entityType.SD || line.type == entityType.SE) {
        let to = new Point(tx + offset.x2 * zoomfact, ty + offset.y2 * zoomfact);
        let from = new Point(fx + offset.x1 * zoomfact, fy + offset.y1 * zoomfact);

        let {length, elementLength, startX, startY} = recursiveParam(felem);
        startX += offset.x1 * zoomfact;
        startY += offset.y1 * zoomfact; 

    //Draws the Segmented version for arrow and not straight line
    if(line.recursive){

        if(line.startIcon === SDLineIcons.ARROW){
            lineStr += iconPoly(SD_ARROW[line.ctype], startX, startY, lineColor, color.BLACK);
        }
        if(line.endIcon === SDLineIcons.ARROW){
            lineStr += iconPoly(SD_ARROW[line.ctype], startX + length, startY +(10 * zoomfact), lineColor, color.BLACK);
        }
        

    }else{
        // Handle start arrow
        if (line.startIcon === SDLineIcons.ARROW) {
            let felem, telem;
            felem = data[findIndex(data, line.fromID)];
            telem = data[findIndex(data, line.toID)];
            const arrowStartPos = calculateArrowPosition(fx, fy, tx, ty, "start", line.innerType);
            lineStr += iconPoly(SD_ARROW["RL"], arrowStartPos.x, arrowStartPos.y, lineColor, color.BLACK,findRotation(felem,telem,line.ctype));
        }

        // Handle end arrow
        if (line.endIcon === SDLineIcons.ARROW) {
            let felem, telem;
            felem = data[findIndex(data, line.fromID)];
            telem = data[findIndex(data, line.toID)];
            const arrowEndPos = calculateArrowPosition(fx, fy, tx, ty, "end", line.innerType);
            lineStr += iconPoly(SD_ARROW["LR"], arrowEndPos.x, arrowEndPos.y, lineColor, color.BLACK,findRotation(felem,telem,line.ctype));
        }
    }    
        
    }

    // Draws the cardinality labels for the line for UML
    if (felem.type != entityType.ER || telem.type != entityType.ER) {
        if (line.startLabel && line.startLabel != '') {
            const fxCardinality = fx + offset.x1;
            const fyCardinality = fy + offset.y1;
            labelStr += drawLineLabel(line, line.startLabel, lineColor, 'startLabel', fxCardinality, fyCardinality, true, felem);
        }
        if (line.endLabel && line.endLabel != '') {
            const txCardinality = tx + offset.x1;
            const tyCardinality = ty + offset.y2;
            labelStr += drawLineLabel(line, line.endLabel, lineColor, 'endLabel', txCardinality, tyCardinality, false, felem);
        }
    } else {
        if (line.cardinality) {
            labelStr += drawLineCardinality(line, lineColor, fx, fy, tx, ty, felem, telem);
        }
    }

    if (isSelected) {
        labelStr += `<rect 
                    x='${((fx + tx) / 2) - (2 * zoomfact)}' 
                    y='${((fy + ty) / 2) - (2 * zoomfact)}' 
                    width='${4 * zoomfact}' 
                    height='${4 * zoomfact}' 
                    style='fill:${lineColor}' stroke='${lineColor}' stroke-width="3"
                />`;
    }
    if (line.label && line.type !== entityType.IE) {
        //Get width of label's text through canvas
        const height = Math.round(zoomfact * textheight);
        const canvas = document.getElementById('canvasOverlay');
        const canvasContext = canvas.getContext('2d');
        canvasContext.font = `${height}px ${canvasContext.font.split('px')[1]}`;
        const labelValue = line.label.replaceAll('<', "&#60;").replaceAll('>', "&#62;");
        const textWidth = canvasContext.measureText(line.label).width;
        const label = {
            id: line.id + "Label",
            labelLineID: line.id,
            centerX: (tx + offset.x2 + fx + offset.x1) / 2,
            centerY: (ty + offset.y2 + fy + offset.y1) / 2,
            width: textWidth + zoomfact * 4,
            height: textheight * zoomfact + zoomfact * 3,
            labelMovedX: 0,
            labelMovedY: 0,
            lowY: Math.min(ty + offset.y2, fy + offset.y1),
            highY: Math.max(ty + offset.y2, fy + offset.y1),
            lowX: Math.min(tx + offset.x2, fx + offset.x1),
            highX: Math.max(tx + offset.x2, fx + offset.x1),
            percentOfLine: 0,
            displacementX: 0,
            displacementY: 0,
            fromX: fx + offset.x1,
            toX: tx + offset.x2,
            fromY: fy + offset.y1,
            toY: ty + offset.y2,
            lineGroup: 0,
            labelMoved: false
        };
        let rememberTargetLabelID = (targetLabel) ? targetLabel.id : undefined;
        if (lineLabelList[findIndex(lineLabelList, label.id)]) {
            label.labelMovedX = lineLabelList[findIndex(lineLabelList, label.id)].labelMovedX;
            label.labelMovedY = lineLabelList[findIndex(lineLabelList, label.id)].labelMovedY;
            label.labelGroup = lineLabelList[findIndex(lineLabelList, label.id)].labelGroup;
            label.labelMoved = lineLabelList[findIndex(lineLabelList, label.id)].labelMoved;
            calculateProcentualDistance(label);
            if (label.labelGroup == 0) {
                label.displacementX = 0;
                label.displacementY = 0;
            } else if (label.labelGroup == 1) {
                label.displacementX = calculateLabelDisplacement(label).storeX * zoomfact;
                label.displacementY = calculateLabelDisplacement(label).storeY * zoomfact;
            } else if (label.labelGroup == 2) {
                label.displacementX = -calculateLabelDisplacement(label).storeX * zoomfact;
                label.displacementY = -calculateLabelDisplacement(label).storeY * zoomfact;
            }
            lineLabelList[findIndex(lineLabelList, label.id)] = label;
        } else {
            lineLabelList.push(label);
        }
        if (rememberTargetLabelID) {
            targetLabel = lineLabelList[findIndex(lineLabelList, rememberTargetLabelID)];
        }
        // Label positioning for recursive lines
        const labelPosY = (ty + fy) / 2 - ((textheight / 2) * zoomfact + 4 * zoomfact);
        const labelPositionY = labelPosY - zoomfact;

        // Label positioning for regual (non-recursive) lines
        const labelCenterX = label.centerX - (2 * zoomfact);
        const labelCenterY = label.centerY;

        // Centers the background rectangle around the text
        const rectPosX = labelCenterX - textWidth / 2 - zoomfact * 2;
        const rectPosY = labelCenterY - (textheight * zoomfact + zoomfact * 3) / 2;

        //Add label with styling based on selection.

        if (line.recursive) {
            //Calculatin the lable possition based on element size, so it follows when resized.

            let length = 20 * zoomfact;
            let lift   = 80 * zoomfact;
                    
                    // Calculations only for SE
            if (line.type === entityType.SE) {
                length = 70 * zoomfact; 
                lift = 20 * zoomfact;   
            }

            let {lineLength, elementLength, startX, startY } = recursiveParam(felem);
            startY -= lift;
            startX += length;

            labelStr += `<rect
                        class='text cardinalityLabel'
                        id='${line.id + 'Label'}'
                        x='${((startX)) - textWidth / 2}'
                        y='${((startY)) - ((textheight / 4))}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact}'
                    />`;
            labelStr += `<text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        x='${((startX))}'
                        y='${((startY)) + ((textheight / 4))}'
                        style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;'>
                        ${labelValue}
                    </text>`;
        } else {
            // For non-recursive lines
            labelStr += `<rect
                        class='text cardinalityLabel'
                        id='${line.id + 'Label'}'
                        x='${rectPosX}'
                        y='${rectPosY}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact + zoomfact * 3}'
                    />`;
            labelStr += ` <text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        style='font-size:${Math.round(zoomfact * textheight)}px;'
                        x='${labelCenterX}'
                        y='${labelCenterY}'>
                        ${labelValue}
                    </text>`;
        }
    }
    return { lineStr, labelStr };
}
/** 
 * @description Calculates the arrowhead position at the start or end of a line, adjusting for target size if needed.
 * @param {integer} fx X-coordinate from the first element
 * @param {integer} fy Y-coordinate from the first element
 * @param {integer} tx X-coordinate from the target element
 * @param {integer} ty Y-coordinate from the target element
 * @param {string} position If it is the start or end position
 * @param {string} lineType At the moment no idea
 * @returns {number[]} Returns the coordinates for the icons position
 */
function calculateArrowPosition(fx, fy, tx, ty, position, lineType, targetWidth = 0, targetHeight = 0) {
    const dx = tx - fx;
    const dy = ty - fy;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    const offsetX = (targetWidth / 2) * (dx / length);
    const offsetY = (targetHeight / 2) * (dy / length);

    if (position === "start") {
        return { x: fx, y: fy };
    } else if (position === "end") {
        return { x: tx - offsetX, y: ty - offsetY };
    }
}

function findRotation(felem,telem,ctype){
    let angleRad;
    switch(ctype){
        case "RL":
            angleRad = Math.atan2((telem.y - (felem.height/2)) - (felem.y - (felem.height/2)), telem.x - felem.x - felem.width); // in radians     
            break;
        case "LR":
            angleRad = Math.atan2((telem.y - (felem.height/2)) - (felem.y - (felem.height/2)), telem.x + telem.width - felem.x); // in radians
            break;
        case "TB":
            angleRad = Math.atan2(telem.y - felem.y-felem.height, (telem.x - (felem.width/2)) - (felem.x - (felem.width/2))); // in radians     
            break;
        case "BT":
            angleRad = Math.atan2(telem.y-telem.height - felem.y, (telem.x - (felem.width/2)) - (felem.x - (felem.width/2))); // in radians
            break;
        default: 
            angleRad = 0;
            break;
    }
    return angleRad * (180 / Math.PI);   // convert to degrees
}

/**
 * @description Calculate so that an ER relation can be recursive
 * @param {number} ax X-coordinate from one element
 * @param {number} ay Y-coordinate from one element
 * @param {number} bx X-coordinate from the other element
 * @param {number} by Y-coordinate from the other element
 * @param {Element} elem Element to change
 * @param {bool} isFirst Meaning, if it's the first line
 * @param {object} line The line being drawn
 * @returns {number[]} Returns the new coordinates
 */
function recursiveERCalc(ax, ay, bx, by, elem, isFirst, line) {
    if (line.ctype == lineDirection.UP || line.ctype == lineDirection.DOWN) {
        ay = elem.cy;
        ax = isFirst ? elem.x1 : elem.x2;
    } else if (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) {
        ax = elem.cx;
        ay = isFirst ? elem.y1 : elem.y2;
    }
    if (isFirst) {
        elem.recursivePos = 0;
        elem.recursivePos.x = bx;
        elem.recursivePos.y = by;
    } else {
        bx = elem.recursivePos.x;
        by = elem.recursivePos.y;
    }
    return [ax, ay, bx, by, elem];
}

/**
 * @description Check and calculate the offset for recursive ER relations.
 * @param {Element} felem Element the line is being dragged from.
 * @param {Element} telem Element the line is being dragged to.
 * @param {object} line The line being dragged.
 * @returns {number[]} Returns the new coordinates
 */
function recursiveERRelation(felem, telem, line, fromElemMouseY, toElemMouseY) {
    const connections = felem.neighbours[telem.id].length;
    let fx = felem.cx, fy = felem.cy, tx = telem.cx, ty = telem.cy;
    if (connections != 2) return [fx, fy, tx, ty];
    const isFirst = felem.neighbours[telem.id][0].id === line.id;
    const fromRelation = felem.kind === elementTypesNames.ERRelation;
    if (fromRelation) {
        [fx, fy, tx, ty, felem] = recursiveERCalc(fx, fy, tx, ty, felem, isFirst, line);
    } else {
        [tx, ty, fx, fy, telem] = recursiveERCalc(tx, ty, fx, fy, telem, isFirst, line);
    }
    return [fx, fy, tx ?? telem.cx, ty ?? telem.cy];
}

function getLineAttributes(line, f, t, ctype, fromElemMouseY, toElemMouseY) {
    let px = -1; // Don't touch

    let fWidth = f.width;
    let tWidth = t.width;
    let fHeight = f.height;
    let tHeight = t.height;

    const offset = { x1: 0, x2: 0, y1: 0, y2: 0 };
    let fx, fy, tx, ty;

    // General settings for line attributes
    switch (ctype) {
        case lineDirection.UP:
            offset.y1 = px;
            offset.y2 = -px * 2;
            fx = f.cx;
            fy = f.y1;
            tx = t.cx;
            ty = t.y2;
            break;

        case lineDirection.DOWN:
            offset.y1 = -px * 2;
            offset.y2 = px;
            fx = f.cx;
            fy = f.y2;
            tx = t.cx;
            ty = t.y1;
            break;

        case lineDirection.LEFT:
            offset.x1 = -px;
            offset.x2 = px * 2;
            fx = f.x1;
            fy = f.cy;
            tx = t.x2;
            ty = t.cy;
            break;

        case lineDirection.RIGHT:
            offset.x1 = px;
            offset.x2 = -px * 2;
            fx = f.x2;
            fy = f.cy;
            tx = t.x1;
            ty = t.cy;
            break;
    }

    // Special case if line is connected to or from IERelation
    if (f.kind === elementTypesNames.IERelation || t.kind === elementTypesNames.IERelation) {

        tWidth = t.width * 0.3 * zoomfact;
        tHeight = t.height * 0 * zoomfact;
        fWidth *= zoomfact;
        fHeight *= zoomfact;
        
        const fx1 = f.cx - fWidth / 2;
        const fx2 = f.cx + fWidth / 2;
        const tx1 = t.cx - tWidth / 2;
        const tx2 = t.cx + tWidth / 2;
        const fy1 = f.cy - fHeight / 2;
        const fy2 = f.cy + fHeight / 2;
        const ty1 = t.cy - tHeight / 2;
        const ty2 = t.cy + tHeight / 2;

        switch (ctype) {
            case lineDirection.UP:
                fy = fy1;
                ty = ty2;
                break;

            case lineDirection.DOWN:
                fy = fy2;
                ty = ty1;
                break;

            case lineDirection.LEFT:
                fx = fx1;
                tx = tx2;
                break;

            case lineDirection.RIGHT:
                fx = fx2;
                tx = tx1;
                break;
        } 
    } 
    
    // Special case if line is connected to or from a ER realation
    if (f.kind === elementTypesNames.ERRelation || t.kind === elementTypesNames.ERRelation ||
        f.kind === elementTypesNames.EREntity || t.kind === elementTypesNames.EREntity) {
        const shrink = 8 * zoomfact; 

        if (ctype === lineDirection.LEFT || ctype === lineDirection.RIGHT) {
            offset.x1 += (ctype === lineDirection.LEFT ? shrink : -shrink);
            offset.x2 += (ctype === lineDirection.LEFT ? -shrink : shrink);
        } else {
            offset.y1 += (ctype === lineDirection.UP ? shrink : -shrink);
            offset.y2 += (ctype === lineDirection.UP ? -shrink : shrink);
        }
    }
    
    // Special case to handle sequence activation lines
    if (f.kind === elementTypesNames.sequenceActivation) {
        const fromKey = `from:${line.id}`;
        const toKey = `to:${line.id}`;
    
        if (!hasOffset(offsetMap, f.id, fromKey)) {
            setOffset(offsetMap, f.id, fromKey, (fromElemMouseY ?? lastMousePos.y) - f.cy);
        }

        if (!hasOffset(offsetMap, t.id, toKey)) {
            setOffset(offsetMap, t.id, toKey, (toElemMouseY ?? lastMousePos.y) - t.cy);
        }

        fy = f.cy + getOffset(offsetMap, f.id, fromKey) * zoomfact;
        ty = t.cy + getOffset(offsetMap, t.id, toKey) * zoomfact;
    }

    return [fx, fy, tx, ty, offset];
}



/**
 * @description Draw the label for the line.
 * @param {Object} line The line object for the label to be drawn.
 * @param {object} label How long the label's text is.
 * @param {Object} lineColor The color for the label.
 * @param {String} labelStr The id for the label.
 * @param {Number} x The X coodinates on the line for draw the label.
 * @param {Number} y The Y coodinates on the line for draw the label.
 * @param {boolean} isStart Where the start and end label should be.
 * @param {Object} felem The element object that is drawn, for recursive.
 * @returns Returns the label for the line
 */
function drawLineLabel(line, label, lineColor, labelStr, x, y, isStart, felem) {
    const offsetOnLine = 20 * zoomfact;
    let canvas = document.getElementById('canvasOverlay');
    let canvasContext = canvas.getContext('2d');
    let textWidth = canvasContext.measureText(label).width;


    if(line.recursive){
        //Calculatin the cardinality possition based on element size, so it follows when resized.
        const lift   = 55 * zoomfact; 
        const {length, elementLength, startX, startY } = recursiveParam(felem);
        x = startX
        y = startY - lift;

        if(labelStr == "startLabel"){
            x -= 10;
            y -= 0;
        }else if(labelStr == "endLabel"){
            x += length +10;
            y -= 0;
        } 
    }else {
        if (line.ctype == lineDirection.UP) {
            x -= offsetOnLine / 2;
            y += (isStart) ? -offsetOnLine : offsetOnLine;
        } else if (line.ctype == lineDirection.DOWN) {
            x -= offsetOnLine / 2;
            y += (isStart) ? offsetOnLine : -offsetOnLine;
        } else if (line.ctype == lineDirection.LEFT) {
            x += (isStart) ? -offsetOnLine : offsetOnLine;
            y -= offsetOnLine / 2;
        } else if (line.ctype == lineDirection.RIGHT) {
            x += (isStart) ? offsetOnLine : -offsetOnLine;
            y -= offsetOnLine / 2;
        }
    }

    return `<rect 
                class='text cardinalityLabel' 
                id='${line.id + labelStr}' 
                x='${x - textWidth / 2}' 
                y='${y - (textheight * zoomfact + zoomfact * 3) / 2}' 
                width='${textWidth + 2}' 
                height='${(textheight - 4) * zoomfact + zoomfact * 3}'/> 
            <text 
                class='text cardinalityLabelText' 
                dominant-baseline='middle' 
                text-anchor='middle' 
                style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)};' 
                x='${x}' 
                y='${y}'
            > ${label} </text>`;
}

/**
 * @description Draw a recursive line for the elements.
 * @param {Number} offset It's a offset for the coodinate when draw a recursive line. 
 * @param {Object} line The line object that is drawn.
 * @param {Object} lineColor Where the start and end label should be.  
 * @param {Number} strokewidth The width of the line.
 * @param {Number} strokeDash A number for patterns of dashes and gaps.
 * @param {Object} felem The element object that is drawn.
 * @returns Returns the different lines for the recursive line and the Array on the line.
 */
function drawRecursive(offset, line, lineColor, strokewidth, strokeDash, felem) {
    let str = '';
    let points= "";

    //Draw the recursive line top right of the element.
    //Using the elemtns length to dynamicly change when re-sized.
    const lineHeight = 60 * zoomfact; 
    const lift   = 55 * zoomfact; 
    const SEconst = 15 * zoomfact;
    const arrowSize = 20 * zoomfact;

    let {length, elementLength, startX, startY} = recursiveParam(felem);
    
    const lineLength = length;
    startX += offset.x1 * zoomfact;
    startY += offset.y1 - lift;

    if(line.type === entityType.IE) {
        points =
            `${startX},${startY + lineHeight } ` +
            `${startX},${startY} ` +
            `${startX + lineLength},${startY} ` +
            `${startX + lineLength},${startY+lineHeight }`;
    }else if(line.type === entityType.SD){
        points =
            `${startX},${startY + lineHeight} ` +
            `${startX},${startY} ` +
            `${startX + lineLength},${startY} ` +
            `${startX + lineLength},${startY + lineHeight + 15}`;
    }else if(line.type === entityType.SE){
        points =
            `${startX - SEconst + lift},${startY + lineHeight } ` +
            `${startX - SEconst + lift + lineHeight},${startY + lineHeight } ` +
            `${startX - SEconst + lift + lineHeight},${startY + lineLength + lineHeight } ` +
            `${startX - SEconst + lift},${startY + lineLength + lineHeight }`;
        
        const endX = startX - SEconst + lift;
        const endY = startY + lineLength + lineHeight;

        str += `
                <polygon
                  points="
                  ${endX},${endY} 
                  ${endX + arrowSize},${endY - arrowSize/2} 
                  ${endX + arrowSize},${endY + arrowSize/2}
                  "
                  fill="${lineColor}"
                />
          `;
    }else {
        points =
            `${startX},${startY + lineHeight  } ` +
            `${startX},${startY} ` +
            `${startX + lineLength},${startY} ` +
            `${startX + lineLength},${startY+lineHeight  }`;
    }
    str += `
            <polyline
              id="${line.id}"
              points="${points}"
              fill="none"
              stroke="${lineColor}"
              stroke-width="${strokewidth * zoomfact}"
              stroke-dasharray="${strokeDash}"
            />
          `;
    return str;
}


/** Localization the basic parameters for the recursive lines.    
 * @param {Object} felem the element the arrows originates from.
 */

function recursiveParam(felem){
    const length = 40 * zoomfact;
    const elementLength = felem.x2 - felem.x1;
    const startX = felem.x1 + elementLength -length;
    const startY = felem.y1;

    return {length, elementLength, startX, startY};
}

/**
 * @description Draw the cardinalities label for the line.
 * @param {Object} line The line object for the cardinality to be drawn to.
 * @param {Object} lineColor Where the start and end label should be.
 * @param {Number} fx The felem x coordinate.
 * @param {Number} fy The felem y coordinate.
 * @param {Number} tx The telem x coordinate.
 * @param {Number} ty The telem y coordinate.
 * @param {Object} f It's for the object felem and it's stands for "from element".
 * @param {Object} t It's for the object telem and it's stands for "to element".
 * @returns Returns the cardinality label for the line.
 */

function drawLineCardinality(line, lineColor, fx, fy, tx, ty, f, t) {
    let posX, posY;
    // Used to tweak the cardinality position when the line gets very short.
    const tweakOffset = 0.30;
    const offsetOnLine = 20 * zoomfact;

    let distance = Math.sqrt(Math.pow((tx - fx), 2) + Math.pow((ty - fy), 2));
    let offset = Math.round(zoomfact * textheight / 2);
    let canvas = document.getElementById('canvasOverlay');
    let canvasContext = canvas.getContext('2d');
    let textWidth = canvasContext.measureText(line.cardinality).width / 4;
    if (offsetOnLine > distance * 0.5) {
        posX = tx + (offsetOnLine * (fx - tx) / distance) * tweakOffset;
        posY = ty + (offsetOnLine * (fy - ty) / distance) * tweakOffset;
    } else {
        // Set position on line for the given offset
        posX = tx + (offsetOnLine * (fx - tx) / distance);
        posY = ty + (offsetOnLine * (fy - ty) / distance);
    }
    if (isLineConnectedTo(line, elementTypesNames.EREntity) == -1) {
        if (line.ctype == lineDirection.UP) {
            if (f.top.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.DOWN) {
            if (f.bottom.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.RIGHT) {
            if (f.right.indexOf(line.id) == 0) posY -= offset;
            else if (f.right.indexOf(line.id) == f.right.length - 1) posY += offset;
        } else if (line.ctype == lineDirection.LEFT) {
            if (f.left.indexOf(line.id) == 0) posY -= offset;
            else if (f.left.indexOf(line.id) == f.left.length - 1) posY += offset;
        }
    } else {
        if (line.ctype == lineDirection.UP) {
            if (t.bottom.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.DOWN) {
            if (t.top.indexOf(line.id) == 0) posX -= offset;
            else posX += offset;
        } else if (line.ctype == lineDirection.RIGHT) {
            if (t.left.indexOf(line.id) == 0) posY -= offset;
            else if (t.left.indexOf(line.id) == f.left.length - 1) posY += offset;
        } else if (line.ctype == lineDirection.LEFT) {
            if (t.right.indexOf(line.id) == 0) posY -= offset;
            else if (t.right.indexOf(line.id) == f.right.length - 1) posY += offset;
        }
    }
    return `<rect 
                class='text cardinalityLabel' 
                id='${line.id + "Cardinality"}' 
                x='${posX - (textWidth) / 2}' 
                y='${posY - (textheight * zoomfact + zoomfact * 3) / 2}' 
                width='${textWidth + 2}' 
                height='${(textheight - 4) * zoomfact + zoomfact * 3}'
            /> 
            <text 
                class='text cardinalityLabelText' 
                dominant-baseline='middle' 
                text-anchor='middle' 
                style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)};' 
                x='${posX}' 
                y='${posY}'
            > ${lineCardinalitys[line.cardinality]} </text>`;
}

/**
 * @description Draw the line segmented.
 * @param {Number} fx The felem x coordinate.
 * @param {Number} fy The felem y coordinate.
 * @param {Number} tx The telem x coordinate.
 * @param {Number} ty The telem y coordinate.
 * @param {Object} offset Offset for the X and Y coordinate.
 * @param {Object} line The line object that is drawn.
 * @param {Object} lineColor Where the start and end label should be.
 * @param {Number} strokeDash A number for patterns of dashes and gaps.
 * @returns Returns the line as segmented.
 */
function drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash) {
    let dy = (line.ctype == lineDirection.UP || line.ctype == lineDirection.DOWN) ? (((fy + offset.y1) - (ty + offset.y2)) / 2) : 0;
    let dx = (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) ? (((fx + offset.x1) - (tx + offset.x2)) / 2) : 0;
    return `<polyline 
                id='${line.id}' 
                points='${fx + offset.x1},${fy + offset.y1} ${fx + offset.x1 - dx},${fy + offset.y1 - dy} ${tx + offset.x2 + dx},${ty + offset.y2 + dy} ${tx + offset.x2},${ty + offset.y2}' 
                fill='none' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}' stroke-dasharray='${strokeDash}' 
            />`;

}
function drawRecursiveLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash) {
    let dy = (line.ctype == lineDirection.UP || line.ctype == lineDirection.DOWN) ? (((fy + offset.y1) - (ty + offset.y2)) / 2) : 0;
    let dx = (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) ? (((fx + offset.x1) - (tx + offset.x2)) / 2) : 0;
    return `<polyline id="${line.id}"
    points='${fx + offset.x1},${fy + offset.y1} ${fx + offset.x1 - dx},${fy + offset.y1 - dy} ${tx + offset.x2 + dx},${ty + offset.y2 + dy} ${tx + offset.x2},${ty + offset.y2}' 
                points="${fx + offset.x1},${fy + offset.y1} 
                        ${fx + offset.x1 + 40},${fy + offset.y1} 
                        ${fx + offset.x1 + 40},${fy + offset.y1 + 40} 
                        ${fx + offset.x1},${fy + offset.y1 + 40}"
                fill="none" 
                stroke="${lineColor}" stroke-width="${strokewidth * zoomfact}" stroke-dasharray="${strokeDash}" 
            />`;

}

/**
 * @description Draw the line icon.
 * @param {Object} icon The different start or end icon for the line.
 * @param {Object} ctype Is a object for change type on the line.
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Object} lineColor Where the start and end label should be.
 * @param {Object} line The line object that is drawn.
 * @returns Returns the icons for the line.
 */
function drawLineIcon(icon, ctype, x, y, lineColor, line) {
    let str = "";
    switch (icon) {
        case IELineIcons.ZERO_ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            break;
        case IELineIcons.FORCED_ONE:
            str += iconLine(ONE_LINE[ctype], x, y, lineColor);
            str += iconLine(TWO_LINE[ctype], x, y, lineColor);
            break;
        case IELineIcons.WEAK:
            str += iconPoly(WEAK_TRIANGLE[ctype], x, y, lineColor, color.WHITE);
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            break;
        case IELineIcons.ZERO_MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            str += iconCircle(CIRCLE[ctype], x, y, lineColor);
            break;
        case IELineIcons.ONE_MANY:
            str += iconPoly(MANY[ctype], x, y, lineColor, 'none');
            str += iconLine(TWO_LINE[ctype], x, y, lineColor);
            break;
        case UMLLineIcons.ARROW:
            str += iconPoly(ARROW[ctype], x, y, lineColor, 'none');
            break;
        case UMLLineIcons.TRIANGLE:
            str += iconPoly(TRIANGLE[ctype], x, y, lineColor, color.WHITE);
            break;
        case UMLLineIcons.BLACK_TRIANGLE:
            str += iconPoly(TRIANGLE[ctype], x, y, lineColor, color.BLACK);
            break;
        case UMLLineIcons.WHITEDIAMOND:
            str += iconPoly(DIAMOND[ctype], x, y, lineColor, color.WHITE);
            break;
        case UMLLineIcons.BLACKDIAMOND:
            str += iconPoly(DIAMOND[ctype], x, y, lineColor, color.BLACK);
            break


    }
    return str;
}

/**
 * @description Draw a icon that is a line.
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Object} lineColor Where the start and end label should be.
 * @returns Returns the icons for the line.
 */
function iconLine([a, b, c, d], x, y, lineColor) {
    return `<line 
                x1='${x + a * zoomfact}' 
                y1='${y + b * zoomfact}' 
                x2='${x + c * zoomfact}' 
                y2='${y + d * zoomfact}' 
                stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

/**
 * @description Draw a icon that is a circle.
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Object} lineColor Where the start and end label should be.
 * @returns Returns the icons for the circle.
 */
function iconCircle([a, b, c], x, y, lineColor,) {
    return `<circle 
                cx='${x + a * zoomfact}' 
                cy='${y + b * zoomfact}' 
                r='${c * zoomfact}' 
                fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

/**
 * @description Draw a icon that is a polyline.
 * @param {Array} arr Is a array for the icons lenght
 * @param {Number} x The x coordinate.
 * @param {Number} y The y coordinate.
 * @param {Object} lineColor Where the start and end label should be.
 * @param {Object} fill Its the color to fill the icons.
 * @returns Returns the icons for the polyline.
 */
function iconPoly(arr, x, y, lineColor, fill, rotation = 0) {
    let s = "";
    for (let i = 0; i < arr.length; i++) {
        const [a, b] = arr[i];
        s += `${x + a * zoomfact} ${y + b * zoomfact} `;
    }
    return `<polyline 
                points='${s}' 
                fill='${fill}' stroke='${lineColor}' stroke-width='${strokewidth}' transform='rotate(${rotation}, ${x},${y})'
            />`;
}

/**
 * @description Calculates the coordinates of the point representing the base of the arrow, the point is @param size distance away and on the line between @param from and @param to .
 * @param {Point} from The coordinates/Point where the line between two elements start.
 * @param {Point} to The coordinates/Point where the line between two elements end.
 * @param {number} size The size(height) of the arrow that is to be drawn.
 * @returns The coordinates/Point where the arrow base is placed on the line.
 */
function calculateArrowBase(from, to, size) {
    /*
        Since we know that the arrow is to be created on the line, we need a Point that is a set distance away from the element that is still on the line.
        The set distance is the size, as it will be the height of the arrow.
        Given two points we can find the distance of the line between them by calculating the hypotenuse.
        Since we know the hypotenuse of the "small" triangle and all the lengths of the "large" triangle, we can calculate the cordinates of the "small" triangle since the triangles are "similar".
        We start by calculating a ratio on the hypotenuse by taking the "small" hypotenuse divided by the "large" hypotenuse.
        Then we apply this ratio on the other sides of the large triangle to get the distance in x and in y for the small triangle
        Then we add these values to the end point to get the actual coordinates for the arrow base.
    */
    let ratio = size / Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
    let x = to.x + (from.x - to.x) * ratio;
    let y = to.y + (from.y - to.y) * ratio;
    return new Point(x, y);
}

/**
 * @description* Rotates a point around another point (the base) by 45 degrees.
 * This is mainly used to create the angled corners of an arrowhead.
 * 
 * @param {Point} base - The pivot point which is usually the base of the arrow.
 * @param {Point} point - The point to rotate around the base which is usually the tip of arrow
 * @param {boolean} clockwise - If true, it rotates the point 45° clockwise; otherwise, counter-clockwise.
 * @returns {Point} A new point that has been rotated around the base.
 */
function rotateArrowPoint(base, point, clockwise) {
    const angle = Math.PI / 4; // 45 degrees in radians
    const direction = clockwise ? 1 : -1; // Decides rotation direction

    // Calculate how far the point is from the base
    const dx = point.x - base.x;
    const dy = point.y - base.y;

    // Rotate the point around the base
    return {
        x: base.x + (dx * Math.cos(direction * angle) - dy * Math.sin(direction * angle)),
        y: base.y + (dx * Math.sin(direction * angle) + dy * Math.cos(direction * angle))
    };
}

/**
 * @description Draw the arraow head for the line.
 * @param {Point} base The start x and y coordinate.
 * @param {Point} point The different point for the arrow head.
 * @param {Object} lineColor Where the start and end label should be.
 * @param {Object} strokeWidth The line width for the arrow head.
 * @returns Returns a polygon for the arrow head.
 */
function drawArrowPoint(base, point, lineColor, strokeWidth) {

    const size = 10 * zoomfact; // arrow size
    const angle = Math.atan2(point.y - base.y, point.x - base.x);

    const p1 = point;
    const p2 = {
        x: point.x - size * Math.cos(angle - Math.PI / 6),
        y: point.y - size * Math.sin(angle - Math.PI / 6)
    };
    const p3 = {
        x: point.x - size * Math.cos(angle + Math.PI / 6),
        y: point.y - size * Math.sin(angle + Math.PI / 6)
    };

    return `
        <polygon points='${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}'
            stroke='${lineColor}' fill='${lineColor}' stroke-width='${strokeWidth}' />
    `;
}




/**
 * @description Removes all existing lines and draw them again
 * @returns String containing all the new lines-elements
 */
function redrawArrows() {
    let linesStr = "";
    let labelsStr = "";
    // Clear all lines and update with dom object dimensions
    for (let i = 0; i < data.length; i++) {
        clearLinesForElement(data[i]);
    }
    for (let i = 0; i < lines.length; i++) {
        determineLine(lines[i]);
    }
    // Determine lines before sorting associations
    if (ghostLine && ghostElement) {
        clearLinesForElement(ghostElement);
        determineLine(ghostLine, true);
    }
    // Sort all association ends that number above 0 according to direction of line
    for (let i = 0; i < data.length; i++) {
        sortElementAssociations(data[i]);
    }
    //Going through all elements and checking for adjacent lines
    for (let i = 0; i < data.length; i++) {
        if (data[i].kind === elementTypesNames.sequenceActivation) continue;
        checkAdjacentLines(data[i]);
    }
    // Draw each line using sorted line ends when applicable
    for (let i = 0; i < lines.length; i++) {
        const { lineStr, labelStr } = drawLine(lines[i]);
        linesStr += lineStr;
        labelsStr += labelStr;
    }
    if (ghostLine && ghostElement) {
        const { lineStr, labelStr } = drawLine(ghostLine, true);
        linesStr += lineStr;
        labelsStr += labelStr;
    }
    // Remove all neighbour maps from elements
    for (let i = 0; i < data.length; i++) {
        delete data[i].neighbours;
    }
    return linesStr + labelsStr;
}

/**
 * @description Clears the line list on all sides of an element.
 * @param {Object} element Element to empty all sides of.
 */
function clearLinesForElement(element) {
    element.left = [];
    element.right = [];
    element.top = [];
    element.bottom = [];
    element.neighbours = {};
    // Get data from dom elements
    const domelement = document.getElementById(element.id);
    const domelementpos = domelement.getBoundingClientRect();
    element.x1 = domelementpos.left;
    element.y1 = domelementpos.top;
    element.x2 = domelementpos.left + domelementpos.width - 2;
    element.y2 = domelementpos.top + domelementpos.height - 2;
    element.cx = element.x1 + (domelementpos.width * 0.5);
    element.cy = element.y1 + (domelementpos.height * 0.5);
}

/**
 * @description Checks overlapping and what side of the elements that the line is connected to.
 * @param {Object} line Line that should be checked.
 * @param {boolean} targetGhost Is the line an ghostLine
 */
function determineLine(line, targetGhost = false) {
    let felem, telem;
    felem = data[findIndex(data, line.fromID)];
    if (!felem) return;
    // Telem should be our ghost if argument targetGhost is true. Otherwise look through data array.
    telem = targetGhost ? ghostElement : data[findIndex(data, line.toID)];
    line.dx = felem.cx - telem.cx;
    line.dy = felem.cy - telem.cy;
    // Figure out overlap - if Y overlap we use sides else use top/bottom
    let overlapY = true;
    if (felem.y1 > telem.y2 || felem.y2 < telem.y1) overlapY = false;
    let overlapX = true;
    if (felem.x1 > telem.x2 || felem.x2 < telem.x1) overlapX = false;
    let majorX = true;
    if (Math.abs(line.dy) > Math.abs(line.dx)) majorX = false;
    // Determine connection type (top to bottom / left to right or reverse - (no top to side possible)
    if (overlapY || ((majorX) && (!overlapX))) {
        if (line.dx > 0) line.ctype = lineDirection.LEFT;
        else line.ctype = lineDirection.RIGHT;
    } else {
        if (line.dy > 0) line.ctype = lineDirection.UP;
        else line.ctype = lineDirection.DOWN;
    }
    // Add accordingly to association end
    if (line.ctype == lineDirection.LEFT) {
        felem.left.push(line.id);
        telem.right.push(line.id);
    } else if (line.ctype == lineDirection.RIGHT) {
        felem.right.push(line.id);
        telem.left.push(line.id);
    } else if (line.ctype == lineDirection.UP) {
        felem.top.push(line.id);
        telem.bottom.push(line.id);
    } else if (line.ctype == lineDirection.DOWN) {
        felem.bottom.push(line.id);
        telem.top.push(line.id);
    }
    if (felem.neighbours[telem.id] == undefined) {
        felem.neighbours[telem.id] = [line];
    } else {
        felem.neighbours[telem.id].push(line);
    }
}

/**
 * @description Sort the associations for each side of an element.
 * @param {Object} element Element to sort.
 */
function sortElementAssociations(element) {
    // Only sort if size of list is >= 2
    if (element.top.length > 1) element.top.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.top, element.id, 2)
    });
    if (element.bottom.length > 1) element.bottom.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.bottom, element.id, 3)
    });
    if (element.left.length > 1) element.left.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.left, element.id, 0)
    });
    if (element.right.length > 1) element.right.sort(function (currentElementID, compareElementID) {
        return sortvectors(currentElementID, compareElementID, element.right, element.id, 1)
    });
}

/**
 * @description Gets a element as parameter and analyses each of its side for multiple lines adjacent
 *  The line will then get properties dependant on their direction
 *  These properties are used in drawLine do give them a offset. 
 * @param {Object} element diagram entity 
 */
function checkAdjacentLines(element) {

    try {
        ['top', 'bottom', 'right', 'left'].forEach(side => {
            const linesOfTargetSide = element[side];

            //Dont want to effect recusive lines, so they are sorted out of the offset calculation.
            const filteredLines = linesOfTargetSide.filter(lineID => {
                const lineIdIndex = findIndex(lines, lineID);
                if (lineIdIndex === -1) { // Check if the line exists in the lines array.
                    return false;
                }
                    const lineObject = lines[lineIdIndex];
                if (lineObject.ghostLine || lineObject.targetGhost) { //To keep ghostlines active
                    return lineObject.kind === lineKind.NORMAL;
                }
                    return lineObject.kind !== lineKind.RECURSIVE;
            });

            if (filteredLines.length > 1) {
                filteredLines.forEach((lineID, index) => {
                    const lineIndex = findIndex(lines, lineID);
                    if (lineIndex === -1) {
                        return;
                    }
                    const lineObject = lines[lineIndex];

                    //Different offset dependant on if the line is going to or coming from a element.
                    //This file is triggered multiple times, as such both if and else if will get done fast.
                    if (lineObject.fromID === element.id) {
                        lineObject.fromOffsetIndex = index;
                        lineObject.fromNumberOfLines = filteredLines.length;

                    } else if (lineObject.toID === element.id) {
                        lineObject.toOffsetIndex = index;
                        lineObject.toNumberOfLines = filteredLines.length;
                    }
                });
                //Reverts the offset if lines are removed
            } else if (filteredLines.length == 1) {
                const lineIdIndex = findIndex(lines, filteredLines[0]);
                const lineObject = lines[lineIdIndex];

                if (lineObject.fromID === element.id) {
                    lineObject.fromOffsetIndex = 0
                    lineObject.fromNumberOfLines = 1
                } else if (lineObject.toID === element.id) {
                    lineObject.toOffsetIndex = 0
                    lineObject.toNumberOfLines = 1;
                }

            }
        });
    } catch (error) {
        console.error("Error in sortElementAssociations, Multi-line sorting:", error);
    }
}


/**
 * @description calculates how the label should be displacesed.
 * @param {Object} labelObject It's the label for the line.
 * @returns Returns the distance of the label and the line.
 */
function calculateLabelDisplacement(labelObject) {
    let baseLine, angle;
    const diffrenceX = labelObject.highX - labelObject.lowX;
    const diffrenceY = labelObject.highY - labelObject.lowY;
    const entireLinelenght = Math.abs(Math.sqrt(diffrenceX * diffrenceX + diffrenceY * diffrenceY));
    let displacementConstant = labelObject.height;
    const distanceToOuterlines = {};
    // define the baseline used to calculate the angle
    if ((labelObject.fromX - labelObject.toX) > 0) {
        if ((labelObject.fromY - labelObject.toY) > 0) { // up left
            baseLine = labelObject.fromY - labelObject.toY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (((90 - angle) / 5) - displacementConstant) * 2.2;
            distanceToOuterlines.storeY = (displacementConstant - (angle / 5)) * 1.2;
        } else if ((labelObject.fromY - labelObject.toY) < 0) { // down left
            baseLine = labelObject.toY - labelObject.fromY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle + 90) / 5)) * 2.2;
            distanceToOuterlines.storeY = (displacementConstant + (angle / 5)) * 1.2;
        }
    } else if ((labelObject.fromX - labelObject.toX) < 0) {
        if ((labelObject.fromY - labelObject.toY) > 0) { // up right
            baseLine = labelObject.toY - labelObject.fromY;
            angle = (Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (((90 - angle) / 5) - displacementConstant) * 2.2;
            distanceToOuterlines.storeY = ((angle / 5) - displacementConstant) * 1.2;
        } else if ((labelObject.fromY - labelObject.toY) < 0) { // down right
            baseLine = labelObject.fromY - labelObject.toY;
            angle = -(Math.acos(Math.cos(baseLine / entireLinelenght)) * 90);
            distanceToOuterlines.storeX = (displacementConstant - ((angle + 90) / 5)) * 2.2;
            distanceToOuterlines.storeY = (-displacementConstant - (angle / 5)) * 1.2;
        }
    }
    return distanceToOuterlines;
}

/**
 * @description Calculate a procentual distance of how the label should be displacesed.
 * @param {Object} objectLabel It's the label for the line.
 */
function calculateProcentualDistance(objectLabel) {
    // Math to calculate procentuall distance from/to centerpoint
    const diffrenceX = objectLabel.highX - objectLabel.lowX;
    const diffrenceY = objectLabel.highY - objectLabel.lowY;
    if (objectLabel.labelMovedX > objectLabel.highX - objectLabel.lowX) {
        objectLabel.labelMovedX = objectLabel.highX - objectLabel.lowX;
    } else if (objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX) {
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    if (objectLabel.labelMovedY > objectLabel.highY - objectLabel.lowY) {
        objectLabel.labelMovedY = objectLabel.highY - objectLabel.lowY;
    } else if (objectLabel.labelMovedX < objectLabel.lowX - objectLabel.highX) {
        objectLabel.labelMovedX = objectLabel.lowX - objectLabel.highX
    }
    const distanceToX1 = objectLabel.centerX + objectLabel.labelMovedX - objectLabel.fromX;
    const distanceToY1 = objectLabel.centerY + objectLabel.labelMovedY - objectLabel.fromY;
    const lenghtToNewPos = Math.abs(Math.sqrt(distanceToX1 * distanceToX1 + distanceToY1 * distanceToY1));
    const entireLinelenght = Math.abs(Math.sqrt(diffrenceX * diffrenceX + diffrenceY * diffrenceY));
    objectLabel.percentOfLine = lenghtToNewPos / entireLinelenght;
    // Making sure the procent is less than 0.5 to be able to use them from the centerpoint of the line as well as ensuring the direction is correct
    if (objectLabel.percentOfLine < 0.5) {
        objectLabel.percentOfLine = 1 - objectLabel.percentOfLine;
        objectLabel.percentOfLine -= 0.5;
    } else if (objectLabel.percentOfLine > 0.5) {
        objectLabel.percentOfLine = -(objectLabel.percentOfLine - 0.5);
    }
    if (!objectLabel.labelMoved) {
        objectLabel.percentOfLine = 0;
    }
    //changing the direction depending on how the line is drawn
    if (objectLabel.fromX < objectLabel.centerX) { //left to right
        objectLabel.labelMovedX = -objectLabel.percentOfLine * diffrenceX;
    } else if (objectLabel.fromX > objectLabel.centerX) {//right to left
        objectLabel.labelMovedX = objectLabel.percentOfLine * diffrenceX;
    }

    if (objectLabel.fromY < objectLabel.centerY) { //down to up
        objectLabel.labelMovedY = -objectLabel.percentOfLine * diffrenceY;
    } else if (objectLabel.fromY > objectLabel.centerY) { //up to down
        objectLabel.labelMovedY = objectLabel.percentOfLine * diffrenceY;
    }
}

/**
 * @description Updates the Label position on the line.
 * @param {number} newPosX The position the mouse is at in the X-axis.
 * @param {number} newPosY The position the mouse is at in the Y-axis.
 */
function updateLabelPos(newPosX, newPosY) {
    targetLabel.labelMoved = true;
    if (newPosX + targetLabel.width < targetLabel.highX && newPosX - targetLabel.width > targetLabel.lowX) {
        targetLabel.labelMovedX = (newPosX - targetLabel.centerX);
    } else if (newPosX - targetLabel.width < targetLabel.lowX) {
        targetLabel.labelMovedX = (targetLabel.lowX + targetLabel.width - (targetLabel.centerX));
    } else if (newPosX + targetLabel.width > targetLabel.highX) {
        targetLabel.labelMovedX = (targetLabel.highX - targetLabel.width - (targetLabel.centerX));
    }
    if (newPosY + targetLabel.height < targetLabel.highY && newPosY - targetLabel.height > targetLabel.lowY) {
        targetLabel.labelMovedY = (newPosY - (targetLabel.centerY));
    } else if (newPosY - targetLabel.height < targetLabel.lowY) {
        targetLabel.labelMovedY = (targetLabel.lowY + targetLabel.height - (targetLabel.centerY));
    } else if (newPosY + targetLabel.height > targetLabel.highY) {
        targetLabel.labelMovedY = (targetLabel.highY - targetLabel.height - (targetLabel.centerY));
    }
    calculateProcentualDistance(targetLabel);
    calculateLabelDisplacement(targetLabel);
    displaceFromLine(newPosX, newPosY);
}

/**
 * @description Sorts all lines connected to an element on each side.
 * @param {String} currentElementID Hexadecimal id for the element at current test index for sorting.
 * @param {String} compareElementID Hexadecimal id for the element were comparing to.
 * @param {Array<Object>} ends Array of all lines connected on this side.
 * @param {String} elementid Hexadecimal id for element to perform sorting on.
 * @param {Number} axis
 * @returns {Number} 1 or -1 depending in the resulting calculation.
 */
function sortvectors(currentElementID, compareElementID, ends, elementid, axis) {
    let ax, ay, bx, by, toElementA, toElementB, sortval, parentx, parenty;
    // Get dx dy centered on association end e.g. invert vector if necessary
    const currentElementLine = (ghostLine && currentElementID === ghostLine.id) ? ghostLine : lines[findIndex(lines, currentElementID)];
    const compareElementLine = (ghostLine && compareElementID === ghostLine.id) ? ghostLine : lines[findIndex(lines, compareElementID)];
    const parent = data[findIndex(data, elementid)];
    sortval = (navigator.userAgent.indexOf("Chrome") !== -1) ? 1 : -1;
    // Retrieve opposite element - assume element center (for now)
    if (currentElementLine.fromID == elementid) {
        toElementA = (currentElementLine == ghostLine) ? ghostElement : data[findIndex(data, currentElementLine.toID)];
    } else {
        toElementA = data[findIndex(data, currentElementLine.fromID)];
    }
    if (compareElementLine.fromID == elementid) {
        toElementB = (compareElementLine == ghostLine) ? ghostElement : data[findIndex(data, compareElementLine.toID)];
    } else {
        toElementB = data[findIndex(data, compareElementLine.fromID)];
    }

    if (toElementA.id === toElementB.id) {
        return 0;
    }
    // If lines cross swap otherwise keep as is
    if (axis == 0 || axis == 1) {
        // Left side
        ay = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(currentElementID) + 1));
        by = parent.y1 + (((parent.y2 - parent.y1) / (ends.length + 1)) * (ends.indexOf(compareElementID) + 1));
        parentx = (axis == 0) ? parent.x1 : parent.x2;
        let test = linetest(toElementA.cx, toElementA.cy, parentx, ay, toElementB.cx, toElementB.cy, parentx, by);
        if (!test) return sortval;
    } else if (axis == 2 || axis == 3) {
        // Top / Bottom side
        ax = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(currentElementID) + 1));
        bx = parent.x1 + (((parent.x2 - parent.x1) / (ends.length + 1)) * (ends.indexOf(compareElementID) + 1));
        parenty = (axis == 2) ? parent.y1 : parent.y2;
        let test = linetest(toElementA.cx, toElementA.cy, ax, parenty, toElementB.cx, toElementB.cy, bx, parenty);
        if (!test) return sortval;
    }
    return -sortval;
}

/**
 * @description Checks if the lines intersect and if the possible intersection point is within edges
 * @param {Number} x1 Position 1
 * @param {Number} y1 Position 1
 * @param {Number} x2 Position 2
 * @param {Number} y2 Position 2
 * @param {Number} x3 Position 3
 * @param {Number} y3 Position 3
 * @param {Number} x4 Position 4
 * @param {Number} y4 Position 4
 * @returns False if the lines don't intersect or if the intersection points are within edges, otherwise True.
 */
function linetest(x1, y1, x2, y2, x3, y3, x4, y4) {
    const determinant = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    // Values are NaN if the lines don't intersect and prepares values for checking if the possible intersection point is within edges
    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / determinant;
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / determinant;
    //Check if lines don't intersect
    if (isNaN(x) || isNaN(y)) return false;
    //Check if intersection point is within edges
    if (x1 >= x2) {
        if (!(x2 <= x && x <= x1)) return false;
    } else {
        if (!(x1 <= x && x <= x2)) return false;
    }
    if (y1 >= y2) {
        if (!(y2 <= y && y <= y1)) return false;
    } else {
        if (!(y1 <= y && y <= y2)) return false;
    }
    if (x3 >= x4) {
        if (!(x4 <= x && x <= x3)) return false;
    } else {
        if (!(x3 <= x && x <= x4)) return false;
    }
    if (y3 >= y4) {
        if (!(y4 <= y && y <= y3)) return false;
    } else {
        if (!(y3 <= y && y <= y4)) return false;
    }
    return true;
}

/**
 * @description checks if the label should be detached.
 * @param {Number} newX The position the mouse is at in the X-axis.
 * @param {Number} newY The position the mouse is at in the Y-axis.
 */
function displaceFromLine(newX, newY) {
    //calculates which side of the line the point is.
    const y1 = targetLabel.fromY, y2 = targetLabel.toY, x1 = targetLabel.fromX, x2 = targetLabel.toX;
    const distance = ((newX - x1) * (y2 - y1)) - ((newY - y1) * (x2 - x1));
    //deciding which side of the line the label should be
    if (distance > 6000) {
        targetLabel.labelGroup = 1;
    } else if (distance < -6000) {
        targetLabel.labelGroup = 2;
    } else {
        targetLabel.labelGroup = 0;
    }
}