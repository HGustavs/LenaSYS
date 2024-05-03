/**
 * @description Draw and updates the rulers, depending on the window size and current position in the diagram.
 */
function drawRulerBars(X, Y) {
    //Get elements
    if (!settings.ruler.isRulerActive) return;

    let svgX = document.getElementById("ruler-x-svg");
    let svgY = document.getElementById("ruler-y-svg");
    //Settings - Ruler

    let pxlength = (pixellength.offsetWidth / 1000) * window.devicePixelRatio;
    const lineRatio1 = 1;
    const lineRatio2 = 10;
    const lineRatio3 = 100;

    let barY = "";
    let barX = "";
    let cordY = 0;
    let cordX = 0;
    settings.ruler.ZF = 100 * zoomfact;
    let pannedY = (Y - settings.ruler.ZF) / zoomfact;
    let pannedX = (X - settings.ruler.ZF) / zoomfact;
    settings.ruler.zoomX = Math.round(((0 - zoomOrigo.x) * zoomfact));
    settings.ruler.zoomY = Math.round(((0 - zoomOrigo.y) * zoomfact));

    let verticalText
    if (zoomfact < 0.5) {
        verticalText = "writing-mode='vertical-lr'";
    } else {
        verticalText = " ";
    }

    //Calculate the visible range based on viewports dimenstions, current position and zoomfactor
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;

    let visibleRangeY = [
        pannedY * -1,
        pannedY * -1 + viewportHeight
    ];
    let visibleRangeX = [
        pannedX * -1 ,
        pannedX * -1 + viewportWidth
    ];


    //Draw the Y-axis ruler positive side.
    let lineNumber = (lineRatio3 - 1);
    for (let i = 100 + settings.ruler.zoomY; i <= pannedY - pannedY * 2 + cheight; i += lineRatio1 * zoomfact * pxlength) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (i > visibleRangeY[0] && i < visibleRangeY[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barY += `<line class='ruler-line' x1='0px' y1='${pannedY + i}' x2='40px' y2='${pannedY + i}'/>`;
                barY += `<text class='ruler-text' x='10' y='${pannedY + i + 10}' style='font-size: 10px'>${cordY}</text>`;
                cordY = cordY + 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if (zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) {
                    barY += `<text class='ruler-text' x='20' y='${pannedY + i + 10}' style='font-size: 8px'>${cordY - 10 + lineNumber / 10}</text>`;
                    barY += `<line class='ruler-line' x1='20px' y1='${pannedY + i}' x2='40px' y2='${pannedY + i}'/>`;
                } else {
                    barY += `<line class='ruler-line' x1='25px' y1='${pannedY + i}' x2='40px' y2='${pannedY + i}'/>`;
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barY += `<line class='ruler-line' x1='32px' y1='${pannedY + i}' x2='40px' y2='${pannedY + i}'/>`;
                } else {
                    barY += `<line class='ruler-line' x1='35px' y1='${pannedY + i}' x2='40px' y2='${pannedY + i}' />`;
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordY = cordY + 10
            }
        }
    }
    //Draw the Y-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordY = -10;
    for (let i = -100 - settings.ruler.zoomY; i <= pannedY; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (-i > visibleRangeY[0] && -i < visibleRangeY[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barY += `<line class='ruler-line' x1='0px' y1='${pannedY - i}' x2='40px' y2='${pannedY - i}' />`;
                barY += `<text class='ruler-text' x='10' y='${pannedY - i + 10}' style='font-size: 10px'>${cordY}</text>`;
                cordY = cordY - 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if ((zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) && (cordY + 10 - lineNumber / 10) != 0) {
                    barY += `<text class='ruler-text' x='20' y='${pannedY - i + 10}' style='font-size: 8px'>${cordY + 10 - lineNumber / 10}</text>`;
                    barY += `<line class='ruler-line' x1='20px' y1='${pannedY - i}' x2='40px' y2='${pannedY - i}' />`;
                } else {
                    barY += `<line class='ruler-line' x1='25px' y1='${pannedY - i}' x2='40px' y2='${pannedY - i}' />`;
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barY += `<line class='ruler-line' x1='32px' y1='${pannedY - i}' x2='40px' y2='${pannedY - i}'/>`;
                } else {
                    barY += `<line class='ruler-line' x1='35px' y1='${pannedY - i}' x2='40px' y2='${pannedY - i}'/>`;
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordY = cordY - 10;
            }
        }
    }
    svgY.style.boxShadow = "3px 45px 6px #5c5a5a";
    svgY.innerHTML = barY; //Print the generated ruler, for Y-axis

    //Draw the X-axis ruler positive side.
    lineNumber = (lineRatio3 - 1);
    for (let i = 50 + settings.ruler.zoomX; i <= pannedX - (pannedX * 2) + cwidth; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (i > visibleRangeX[0] && i < visibleRangeX[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barX += `<line class='ruler-line' x1='${i + pannedX}' y1='0' x2='${i + pannedX}' y2='40px'/>`;
                barX += `<text class='ruler-text' x='${i + 5 + pannedX}'${verticalText}' y='15' style='font-size: 10px'>${cordX}</text>`;
                cordX = cordX + 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if (zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) {
                    barX += `<text class='ruler-text' x='${i + 5 + pannedX}'${verticalText}' y='25' style='font-size: 8px'>${cordX - 10 + lineNumber / 10}</text>`;
                    barX += `<line class='ruler-line' x1='${i + pannedX}' y1='20' x2='${i + pannedX}' y2='40px'/>`;
                } else {
                    barX += `<line class='ruler-line' x1='${i + pannedX}' y1='25' x2='${i + pannedX}' y2='40px'/>`;
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barX += `<line class='ruler-line' x1='${i + pannedX}' y1='32' x2='${i + pannedX}' y2='40px'/>`;
                } else {
                    barX += `<line class='ruler-line' x1='${i + pannedX}' y1='35' x2='${i + pannedX}' y2='40px'/>`;
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordX = cordX+10
            }
        }
    }
    //Draw the X-axis ruler negative side.
    lineNumber = (lineRatio3 - 101);
    cordX = -10;
    for (let i = -50 - settings.ruler.zoomX; i <= pannedX; i += (lineRatio1 * zoomfact * pxlength)) {
        lineNumber++;
        //Check wether the line that will be drawn is within the visible range
        if (-i > visibleRangeX[0] && -i < visibleRangeX[1]) {
            //Check if a full line should be drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                barX += `<line class='ruler-line' x1='${pannedX - i}' y1='0' x2='${pannedX - i}' y2='40px'/>`;
                barX += `<text class='ruler-text' x='${pannedX - i + 5}' ${verticalText} y='15' style='font-size: 10px'>${cordX}</text>`;
                cordX = cordX - 10;
            } else if (zoomfact >= 0.25 && lineNumber % lineRatio2 == 0) {
                //centi
                if ((zoomfact > 0.5 || (lineNumber / 10) % 5 == 0) && (cordX + 10 - lineNumber / 10) != 0) {
                    barX += `<text class='ruler-text' x='${pannedX - i + 5}' ${verticalText} y='25' style='font-size: 8px'>${cordX + 10 - lineNumber / 10}</text>`;
                    barX += `<line class='ruler-line' x1='${pannedX - i}' y1='20' x2='${pannedX - i}' y2='40px'/>`;
                } else {
                    barX += `<line class='ruler-line' x1='${pannedX - i}' y1='25' x2='${pannedX - i}' y2='40px'/>`;
                }
            } else if (zoomfact > 0.75) {
                //milli
                if ((lineNumber) % 5 == 0) {
                    barX += `<line class='ruler-line' x1='${pannedX - i}' y1='32' x2='${pannedX - i}' y2='40px'/>`;
                } else {
                    barX += `<line class='ruler-line' x1='${pannedX - i}' y1='35' x2='${pannedX - i}' y2='40px'/>`;
                }
            }
        } else {
            // keep track of the line number so that correct length of the deci, centi and milli lines are drawn
            if (lineNumber === lineRatio3) {
                lineNumber = 0;
                cordX = cordX - 10;
            }
        }
    }
    svgX.style.boxShadow = "3px 3px 6px #5c5a5a";
    svgX.innerHTML = barX;//Print the generated ruler, for X-axis
}
