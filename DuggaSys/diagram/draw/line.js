/**
 * @description Constructs a string containing the svg line-elements of the inputted line object in parameter.
 * @param {Object} line The line object that is drawn.
 * @param {boolean} targetGhost Is the targeted line a ghost line
 */
 function drawLine(line, targetGhost = false) {
    let str = "";
    // Element line is drawn from/to
    let felem = data[findIndex(data, line.fromID)];
    let telem;
    if (targetGhost) {
        telem = ghostElement;
        isCurrentlyDrawing = true;
    } else {
        telem = data[findIndex(data, line.toID)];
        isCurrentlyDrawing = false;
    }
    if (!felem || !telem) return;
    line.type = (telem.type == entityType.note) ? telem.type : felem.type;
    let strokeDash = (line.kind == lineKind.DASHED || line.type == entityType.note) ? "10" : "0";
    let lineColor = isDarkTheme() ? color.WHITE : color.BLACK;
    let isSelected = contextLine.includes(line);
    if (isSelected) lineColor = color.SELECTED;
    let fx, fy, tx, ty, offset;
    [fx, fy, tx, ty, offset] = getLineAttrubutes(felem, telem, line.ctype);
    // Follows the cursor while drawing the line
    if (isCurrentlyDrawing){
        tx = event.clientX;
        ty = event.clientY;
    }
    if (targetGhost && line.type == entityType.SD) line.endIcon = SDLineIcons.ARROW;
    if (line.type == entityType.ER) {
        [fx, fy, tx, ty] = recursiveERRelation(felem, telem, line);
        if (line.kind == lineKind.NORMAL) {
            str += `<line 
                        id='${line.id}' 
                        x1='${fx + offset.x1}' y1='${fy + offset.y1}' 
                        x2='${tx + offset.x2}' y2='${ty + offset.y2}' 
                        stroke='${lineColor}' stroke-width='${strokewidth}'
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
                stroke='${lineColor}' stroke-width='${strokewidth}'
                />`;
            };
            str += double(1, 1);
            str += double(-1, 2);
        }
    } else if ((line.type == entityType.SD && line.innerType != SDLineType.SEGMENT)) {
        if (line.kind == lineKind.RECURSIVE) {
            str += drawRecursive(fx, fy, offset, line, lineColor);
        } else if ((fy > ty) && (line.ctype == lineDirection.UP)) {
            offset.y1 = 1;
            offset.y2 = -7 + 3 / zoomfact;
        } else if ((fy < ty) && (line.ctype == lineDirection.DOWN)) {
            offset.y1 = -7 + 3 / zoomfact;
            offset.y2 = 1;
        }
        str += `<line 
                    id='${line.id}' 
                    x1='${fx + offset.x1 * zoomfact}' 
                    y1='${fy + offset.y1 * zoomfact}' 
                    x2='${tx + offset.x2 * zoomfact}' 
                    y2='${ty + offset.y2 * zoomfact}' 
                    fill='none' stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}'
                />`;
    } else { // UML, IE or SD
        if (line.kind == lineKind.RECURSIVE) {
            str += drawRecursive(fx, fy, offset, line, lineColor);
        }
        str += drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash);
    }
    str += drawLineIcon(line.startIcon, line.ctype, fx, fy, lineColor, line);
    str += drawLineIcon(line.endIcon, line.ctype.split('').reverse().join(''), tx, ty, lineColor, line);
    if ((line.type == entityType.SD && line.innerType != SDLineType.SEGMENT) || (line.type == entityType.SE && line.innerType != SELineType.SEGMENT)) {
        let to = new Point(tx + offset.x2 * zoomfact, ty + offset.y2 * zoomfact);
        let from = new Point(fx + offset.x1 * zoomfact, fy + offset.y1 * zoomfact);
        if (line.startIcon == SDLineIcons.ARROW) {
            str += drawArrowPoint(calculateArrowBase(to, from, 25 * zoomfact), from, fx, fy, lineColor, line, line.ctype);

        }
        if (line.endIcon == SDLineIcons.ARROW) {
            str += drawArrowPoint(calculateArrowBase(from, to, 25 * zoomfact), to, tx, ty, lineColor, line, line.ctype.split('').reverse().join(''));
        }
    }
    if (felem.type != entityType.ER || telem.type != entityType.ER) {
        if (line.startLabel && line.startLabel != '') {
            str += drawLineLabel(line, line.startLabel, lineColor, 'startLabel', fx, fy, true);
        }
        if (line.endLabel && line.endLabel != '') {
            str += drawLineLabel(line, line.endLabel, lineColor, 'endLabel', tx, ty, false);
        }
    } else {
        if (line.cardinality) {
            str += drawLineCardinality(line, lineColor, fx, fy, tx, ty, felem, telem);
        }
    }
    if (isSelected) {
        str += `<rect 
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
        const labelValue = line.label.replaceAll('<', "&#60").replaceAll('>', "&#62");
        const textWidth = canvasContext.measureText(line.label).width;
        const label = {
            id: line.id + "Label",
            labelLineID: line.id,
            centerX: (tx + fx) / 2,
            centerY: (ty + fy) / 2,
            width: textWidth + zoomfact * 4,
            height: textheight * zoomfact + zoomfact * 3,
            labelMovedX: 0,
            labelMovedY: 0,
            lowY: Math.min(ty, fy),
            highY: Math.max(ty, fy),
            lowX: Math.min(tx, fx),
            highX: Math.max(ty, fy),
            percentOfLine: 0,
            displacementX: 0,
            displacementY: 0,
            fromX: fx,
            toX: tx,
            fromY: fy,
            toY: ty,
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
        // Label position for recursive edges
        const labelPosX = (tx + fx) / 2 - ((textWidth) + zoomfact * 8) / 2;
        const labelPosY = (ty + fy) / 2 - ((textheight / 2) * zoomfact + 4 * zoomfact);
        const labelPositionX = labelPosX + zoomfact;
        const labelPositionY = labelPosY - zoomfact;
        //Add label with styling based on selection.
        if (line.kind === lineKind.RECURSIVE) {
            str += `<rect
                        class='text cardinalityLabel'
                        id='${line.id + 'Label'}'
                        x='${((fx + length + (30 * zoomfact))) - textWidth / 2}'
                        y='${(labelPositionY - 70 * zoomfact) - ((textheight / 4) * zoomfact)}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact}'
                    />`;
            str += `<text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        x='${(fx + length + (30 * zoomfact))}'
                        y='${(labelPositionY - 70 * zoomfact) + ((textheight / 4) * zoomfact)}'
                        style='fill:${lineColor}; font-size:${Math.round(zoomfact * textheight)}px;'>
                        ${labelValue}
                    </text>`;
        } else {
            str += `<rect
                        class='text cardinalityLabel'
                        id=${line.id + 'Label'}
                        x='${labelPositionX}'
                        y='${labelPositionY}'
                        width='${(textWidth + zoomfact * 4)}'
                        height='${textheight * zoomfact + zoomfact * 3}'
                    />`;
            str += ` <text
                        class='cardinalityLabelText'
                        dominant-baseline='middle'
                        text-anchor='middle'
                        style='font-size:${Math.round(zoomfact * textheight)}px;'
                        x='${label.centerX - (2 * zoomfact)}'
                        y='${label.centerY - (2 * zoomfact)}'>
                        ${labelValue}
                    </text>`;
        }
    }
    return str;
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
        ax = isFirst? elem.x1 : elem.x2;
    } else if (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) {
        ax = elem.cx;
        ay = isFirst? elem.y1 : elem.y2;
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
function recursiveERRelation(felem, telem, line) {
    const connections = felem.neighbours[telem.id].length;
    let fx = felem.cx, fy = felem.cy, tx = telem.cx, ty = telem.cy;
    if (connections != 2) return [fx, fy, tx, ty];
    const isFirst = felem.neighbours[telem.id][0].id === line.id;
    const fromRelation = felem.kind === elementTypesNames.ERRelation;
    if (fromRelation) {
        [fx, fy, tx, ty, felem] = recursiveERCalc(fx, fy, tx, ty, felem, isFirst, line);
    } else {
        [tx, ty, fx, fy, telem] = recursiveERCalc(tx, ty, fx, fy, telem, isFiest, line);
    }
    return [fx, fy, tx ?? telem.cx, ty ?? telem.cy];
}

function getLineAttrubutes(f, t, ctype) {
    let result;
    let px = 3;
    let offset = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
    };
    switch (ctype) {
        case lineDirection.UP:
            offset.y1 = px;
            offset.y2 = -px * 2;
            result = [f.cx, f.y1, t.cx, t.y2, offset];
            break;
        case lineDirection.DOWN:
            offset.y1 = -px * 2;
            offset.y2 = px;
            result = [f.cx, f.y2, t.cx, t.y1, offset];
            break;
        case lineDirection.LEFT:
            offset.x1 = px;
            offset.x2 = 0;
            result = [f.x1, f.cy, t.x2, t.cy, offset];
            break;
        case lineDirection.RIGHT:
            offset.x1 = 0;
            offset.x2 = px;
            result = [f.x2, f.cy, t.x1, t.cy, offset];
    }
    return result;
}

function drawLineLabel(line, label, lineColor, labelStr, x, y, isStart) {
    const offsetOnLine = 20 * zoomfact;
    let canvas = document.getElementById('canvasOverlay');
    let canvasContext = canvas.getContext('2d');
    let textWidth = canvasContext.measureText(label).width;

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

function drawRecursive(fx, fy, offset, line, lineColor) {
    let str = '';
    const length = 40 * zoomfact;
    const startX = fx;
    const startY = fy + 20 * zoomfact;
    const endX = fx;
    const cornerX = fx + length;
    const cornerY = fy;

    str += `<line id='${line.id}' x1='${startX + offset.x1 - 17 * zoomfact}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${cornerY + offset.y1}'/>`;
    str += `<line id='${line.id}' x1='${startX + offset.x1}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${startY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
    str += `<line id='${line.id}' x1='${cornerX + offset.x1}' y1='${startY + offset.y1}' x2='${cornerX + offset.x1}' y2='${cornerY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
    str += `<line id='${line.id}' x1='${cornerX + offset.x1}' y1='${cornerY + offset.y1}' x2='${endX + offset.x1}' y2='${cornerY + offset.y1}' stroke='${lineColor}' stroke-width='${strokewidth * zoomfact}'/>`;
    str += iconPoly(SD_ARROW[lineDirection.RIGHT], fx, startY, lineColor, color.BLACK);
    return str;
}

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

function drawLineSegmented(fx, fy, tx, ty, offset, line, lineColor, strokeDash) {
    let dy = (line.ctype == lineDirection.UP || line.ctype == lineDirection.DOWN) ? (((fy + offset.y1) - (ty + offset.y2)) / 2) : 0;
    let dx = (line.ctype == lineDirection.LEFT || line.ctype == lineDirection.RIGHT) ? (((fx + offset.x1) - (tx + offset.x2)) / 2) : 0;
    return `<polyline 
                id='${line.id}' 
                points='${fx + offset.x1},${fy + offset.y1} ${fx + offset.x1 - dx},${fy + offset.y1 - dy} ${tx + offset.x2 + dx},${ty + offset.y2 + dy} ${tx + offset.x2},${ty + offset.y2}' 
                fill='none' stroke='${lineColor}' stroke-width='${strokewidth}' stroke-dasharray='${strokeDash}' 
            />`;

}

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
            break;
        case SDLineIcons.ARROW:
            if (line.innerType == SDLineType.SEGMENT) {
                // class should be diagram-umlicon-darkmode-sd and not diagram-umlicon-darkmode?
                str += iconPoly(SD_ARROW[ctype], x, y, lineColor, color.BLACK);
            } else if (line.type == entityType.SE) {
                str += iconPoly(SD_ARROW[ctype], x, y, lineColor, color.BLACK);
            }
            break;
    }
    return str;
}

function iconLine([a, b, c, d], x, y, lineColor) {
    return `<line 
                x1='${x + a * zoomfact}' 
                y1='${y + b * zoomfact}' 
                x2='${x + c * zoomfact}' 
                y2='${y + d * zoomfact}' 
                stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

function iconCircle([a, b, c], x, y, lineColor,) {
    return `<circle 
                cx='${x + a * zoomfact}' 
                cy='${y + b * zoomfact}' 
                r='${c * zoomfact}' 
                fill='white' stroke='${lineColor}' stroke-width='${strokewidth}'
            />`;
}

function iconPoly(arr, x, y, lineColor, fill) {
    let s = "";
    for (let i = 0; i < arr.length; i++) {
        const [a, b] = arr[i];
        s += `${x + a * zoomfact} ${y + b * zoomfact}, `;
    }
    return `<polyline 
                points='${s}' 
                fill='${fill}' stroke='${lineColor}' stroke-width='${strokewidth}'
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
    let x = to.x + (from.x - to.x ) * ratio;
    let y = to.y + (from.y - to.y ) * ratio;
    return new Point(x, y);
}

/**
 * @description Calculates the coordiates of the point representing one of the arrows corners
 * @param {Point} base The coordinates/Point where the arrow base is placed on the line, this Point is the pivot that the corners are "rotated" around.
 * @param {Point} to The coordinates/Point where the line between @param base and the element end
 * @param {boolean} clockwise Should the rotation be clockwise (true) or counter-clockwise (false).
 */
 function rotateArrowPoint(base, point, clockwise) {
    const angle = Math.PI / 4; 
    const direction = clockwise ? 1 : -1;
    const dx = point.x - base.x ;
    const dy = point.y - base.y ;
        return {
            x: base.x + (dx * Math.cos(direction * angle) - dy * Math.sin(direction * angle)),
            y: base.y + (dx * Math.sin(direction * angle) + dy * Math.cos(direction * angle))
        };
     }
     

function drawArrowPoint(base, point, lineColor, strokeWidth) {
    let right = rotateArrowPoint(point, base, true);
    let left = rotateArrowPoint(point, base, false);
        return `
        <polygon points='${point.x},${point.y} ${left.x},${left.y} ${right.x},${right.y}'
                 stroke='${lineColor}' fill='BLACK' stroke-width='${strokeWidth}'/>
        `;
}


/**
 * @description Removes all existing lines and draw them again
 * @return String containing all the new lines-elements
 */
function redrawArrows() {
    let str = '';
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
    // Draw each line using sorted line ends when applicable
    for (let i = 0; i < lines.length; i++) {
        str += drawLine(lines[i]);
    }
    if (ghostLine && ghostElement) {
        str += drawLine(ghostLine, true);
    }
    // Remove all neighbour maps from elements
    for (let i = 0; i < data.length; i++) {
        delete data[i].neighbours;
    }
    return str;
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
 * @description calculates how the label should be displacesed
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