import { isDarkTheme, checkElementError } from "./diagram.js";
/**
 * @description Construct an string containing all the elements for an data-object.
 * @param {Object} element The object that should be drawn.
 * @param {boolean} ghosted Is the element an ghost element.
 * @return Returns an string containing the elements that should be drawn.
 */
function drawElement(element, ghosted = false)
{
    let ghostPreview = ghostLine ? 0 : 0.4;
    var str = "";

    // Compute size variables
    var linew = Math.round(strokewidth * zoomfact);
    var boxw = Math.round(element.width * zoomfact);
    var boxh = Math.round(element.height * zoomfact);
    var texth = Math.round(zoomfact * textheight);
    var hboxw = Math.round(element.width * zoomfact * 0.5);
    var hboxh = Math.round(element.height * zoomfact * 0.5);
    var cornerRadius = Math.round((element.height/2) * zoomfact); //determines the corner radius for the SD states.
    var sequenceCornerRadius = Math.round((element.width/15) * zoomfact); //determines the corner radius for sequence objects.
    var elemAttri = 3;//element.attributes.length;          //<-- UML functionality This is hardcoded will be calcualted in issue regarding options panel
                                //This value represents the amount of attributes, hopefully this will be calculated through
                                //an array in the UML document that contains the element's attributes.
    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext = canvas.getContext('2d');
    
    //since toggleBorderOfElements checks the fill color to make sure we dont end up with white stroke on white fill, which is bad for IE and UML etc,
    //we have to have another variable for those strokes that are irrlevant of the elements fill, like sequence actor or state superstate.
    var nonFilledElementPartStrokeColor;
    if (isDarkTheme()) nonFilledElementPartStrokeColor = '#FFFFFF';
    else nonFilledElementPartStrokeColor = '#383737';

    // Caclulate font width using some canvas magic
    var font = canvasContext.font;
    font = `${texth}px ${font.split('px')[1]}`;
    canvasContext.font = font;
    var textWidth = canvasContext.measureText(element.name).width;
    
    // If calculated size is larger than element width
    const margin = 10 * zoomfact;
    var tooBig = (textWidth >= (boxw - (margin * 2)));
    var xAnchor = tooBig ? margin : hboxw;
    var vAlignment = tooBig ? "left" : "middle";

    if (errorActive) {
        // Checking for errors regarding ER Entities
        checkElementError(element);

        // Checks if element is involved with an error and outlines them in red
        for (var i = 0; i < errorData.length; i++) {
            if (element.id == errorData[i].id) element.stroke = 'red';
        }
    }

    //=============================================== <-- UML functionality
    //Check if the element is a UML entity
    if (element.kind == "UMLEntity") { 
        const maxCharactersPerLine = Math.floor((boxw / texth)*1.75);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        const funcText = element.functions.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;
        elemFunc = funcText.length;

        // Removes the previouse value in UMLHeight for the element
        for (var i = 0; i < UMLHeight.length; i++) {
            if (element.id == UMLHeight[i].id) {
                UMLHeight.splice(i, 1);
            }
        }

        // Calculate and store the UMLEntity's real height
        var UMLEntityHeight = {
            id : element.id,
            height : ((boxh + (boxh/2 + (boxh * elemAttri/2)) + (boxh/2 + (boxh * elemFunc/2))) / zoomfact)
        }
        UMLHeight.push(UMLEntityHeight);
        
        //div to encapuslate UML element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.5))}px; width:${boxw}px;font-size:${texth}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //div to encapuslate UML header
        str += `<div class='uml-header' style='width: ${boxw}; height: ${boxh};'>`; 
        //svg for UML header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
        <text class='text' x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for UML header
        str += `</svg>`;
        //end of div for UML header
        str += `</div>`;
        
        //div to encapuslate UML content
        str += `<div class='uml-content' style='margin-top: -0.5em;'>`;
        //Draw UML-content if there exist at least one attribute
        if (elemAttri != 0) {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemAttri/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemAttri/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text class='text' x='0.5em' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw UML-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for UML content
        str += `</div>`;

        //Draw UML-footer if there exist at least one function
        if (elemFunc != 0) {
            //div for UML footer
            str += `<div class='uml-footer' style='margin-top: -0.5em; height: ${boxh/2 + (boxh * elemFunc/2)}px;'>`;
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemFunc/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemFunc/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemFunc; i++) {
                str += `<text class='text' x='0.5em' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${funcText[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw UML-footer if there are no functions
        } else {
            //div for UML footer
            str += `<div class='uml-footer' style='margin-top: -0.5em; height: ${boxh / 2 + (boxh / 2)}px;'>`;
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for UML footer
        str += `</div>`;

    }
    else if (element.kind == 'UMLInitialState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        const theme = document.getElementById("themeBlack");
        str += `<div id="${element.id}" 
                     class="element uml-state"
                     style="margin-top:${((boxh / 2.5))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}" 
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                        <svg width="100%" height="100%" 
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg" 
                             xml:space="preserve"
                             style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                            <g  transform="matrix(1.14286,0,0,1.14286,-6.85714,-2.28571)">
                                <circle cx="16.5" cy="12.5" r="10.5"/>
                            </g>
                        </svg>
                </div>`;
                if(element.fill == `${"#000000"}` && theme.href.includes('blackTheme')){
                    element.fill = `${"#FFFFFF"}`;
                }else if(element.fill == `${"#FFFFFF"}` && theme.href.includes('style')) {
                    element.fill = `${"#000000"}`;
                }

    }
    else if (element.kind == 'UMLFinalState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        const theme = document.getElementById("themeBlack");
        str += `<div id="${element.id}" 
                     class="element uml-state"
                     style="margin-top:${((boxh / 2.5))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}"
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                        <svg width="100%" height="100%"
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg"
                             xml:space="preserve"
                             style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                            <g>
                                <path d="M12,-0C18.623,-0 24,5.377 24,12C24,18.623 18.623,24 12,24C5.377,24 -0,18.623 -0,12C-0,5.377 5.377,-0 12,-0ZM12,2C17.519,2 22,6.481 22,12C22,17.519 17.519,22 12,22C6.481,22 2,17.519 2,12C2,6.481 6.481,2 12,2Z"/>
                                <circle transform="matrix(1.06667,0,0,1.06667,-3.46667,-3.46667)" cx="14.5" cy="14.5" r="5.5"/>
                            </g>
                        </svg>
                </div>`;
                if(element.fill == `${"#000000"}` && theme.href.includes('blackTheme')){
                    element.fill = `${"#FFFFFF"}`;
                }else if(element.fill == `${"#FFFFFF"}` && theme.href.includes('style')) {
                    element.fill = `${"#000000"}`;
                }

    }
    else if (element.kind == 'UMLSuperState') {
        const ghostAttr = (ghosted) ? `pointer-events: none; opacity: ${ghostPreview};` : "";
        str += `<div id="${element.id}" 
                    class="element uml-Super"
                    style="margin-top:${((boxh * 0.025))}px;width:${boxw}px;height:${boxh}px;${ghostAttr}"
                     onmousedown='ddown(event);' 
                     onmouseenter='mouseEnter();' 
                     onmouseleave='mouseLeave();'>
                    <svg width="100%" height="100%">
                    <rect width="${boxw}px" height="${boxh}px" fill="none" fill-opacity="0" stroke='${nonFilledElementPartStrokeColor}' stroke-width='${linew}' rx="20"/>
                    <rect width="${boxw/2}px" height="${80 * zoomfact}px" fill='${element.fill}' fill-opacity="1" stroke='${element.stroke}' stroke-width='${linew}' />
                        <text x='${80 * zoomfact}px' y='${40 * zoomfact}px' dominant-baseline='middle' text-anchor='${vAlignment}' font-size="${20 * zoomfact}px">${element.name}</text>
                    </svg>
                </div>`;

    }

    // Check if element is SDEntity
    else if (element.kind == "SDEntity") {

        const maxCharactersPerLine = Math.floor(boxw / texth);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;

        // Removes the previouse value in SDHeight for the element
        for (var i = 0; i < SDHeight.length; i++) {
            if (element.id == SDHeight[i].id) {
                SDHeight.splice(i, 1);
            }
        }

        // Calculate and store the SDEntity's real height
        var SDEntityHeight = {
            id: element.id,
            height: ((boxh + (boxh / 2 + (boxh * elemAttri / 2))) / zoomfact)
        }
        SDHeight.push(SDEntityHeight);

        //div to encapuslate SD element
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.15))}px; width:${boxw}px;font-size:${texth}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //div to encapuslate SD header
        str += `<div style='width: ${boxw}; height: ${boxh};'>`;
        //svg for SD header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<path class="text" 
            d="M${linew+cornerRadius},${(linew)}
                h${(boxw - (linew * 2))-(cornerRadius*2)}
                a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius}
                v${((boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius)}
                h${(boxw - (linew * 2))*-1}
                v${((boxh / 2 + (boxh / 2) - (linew * 2))-(cornerRadius))*-1}
                a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${(cornerRadius)*-1}
                z
            "
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill}'
        />
        
        <text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for SD header
        str += `</svg>`;
        //end of div for SD header
        str += `</div>`;

        //div to encapuslate SD content
        str += `<div style='margin-top: ${-8 * zoomfact}px;'>`;
        //Draw SD-content if there exist at least one attribute
        if (elemAttri != 0) {
           /* find me let sdOption = document.getElementById("SDOption");
            console.log(sdOption); */
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh * elemAttri / 2)}'>`;
            str += `<path class="text"
                d="M${linew},${(linew)}
                    h${(boxw - (linew * 2))}
                    v${(boxh / 2 + (boxh * elemAttri / 2) - (linew * 2))-cornerRadius}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius*-1)},${cornerRadius}
                    h${(boxw - (linew * 2)-(cornerRadius*2))*-1}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius)*-1},${(cornerRadius)*-1}
                    v${((boxh / 2 + (boxh * elemAttri / 2) - (linew * 2))-cornerRadius)*-1}
                    z
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text x='${xAnchor}' y='${hboxh + boxh * i / 2}' dominant-baseline='middle' text-anchor='${vAlignment}'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
            // Draw SD-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<path class="text"
                d="M${linew},${(linew)}
                    h${(boxw - (linew * 2))}
                    v${(boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius*-1)},${cornerRadius}
                    h${(boxw - (linew * 2)-(cornerRadius*2))*-1}
                    a${cornerRadius},${cornerRadius} 0 0 1 ${(cornerRadius)*-1},${(cornerRadius)*-1}
                    v${((boxh / 2 + (boxh / 2) - (linew * 2))-cornerRadius)*-1}
                    z
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;
            str += `<text x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'></text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for SD content
        str += `</div>`;
    }

    //Check if element is UMLRelation
    else if (element.kind == 'UMLRelation') {
        //div to encapuslate UML element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave();'
        style='left:0px; top:0px; width:${boxw}px;height:${boxh}px; margin-top:${((boxh /3))}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

        //svg for inheritance symbol
        str += `<svg width='${boxw}' height='${boxh}'>`;

        //Overlapping UML-inheritance
        if (element.state == 'overlapping') {
            str += `<polygon points='${linew},${boxh-linew} ${boxw/2},${linew} ${boxw-linew},${boxh-linew}' 
            style='fill:black;stroke:black;stroke-width:${linew};'/>`;
        }
        //Disjoint UML-inheritance
        else {
            str += `<polygon points='${linew},${boxh-linew} ${boxw/2},${linew} ${boxw-linew},${boxh-linew}' 
            style='fill:white;stroke:black;stroke-width:${linew};'/>`;
        }
        //end of svg
        str += `</svg>`;
    }

    //=============================================== <-- IE functionality
    //Check if the element is a IE entity
    else if (element.kind == "IEEntity") { 
        const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);

        const splitLengthyLine = (str, max) => {
            if (str.length <= max) return str;
            else {
                return [str.substring(0, max)].concat(splitLengthyLine(str.substring(max), max));
            }
        }

        const text = element.attributes.map(line => {
            return splitLengthyLine(line, maxCharactersPerLine);
        }).flat();

        elemAttri = text.length;

        // Removes the previouse value in IEHeight for the element
        for (var i = 0; i < IEHeight.length; i++) {
            if (element.id == IEHeight[i].id) {
                IEHeight.splice(i, 1);
            }
        }

        // Calculate and store the IEEntity's real height
        var IEEntityHeight = {
            id: element.id,
            height: ((boxh + (boxh / 2 + (boxh * elemAttri / 2))) / zoomfact)
        }
        IEHeight.push(IEEntityHeight);

        //div to encapuslate IE element
        str += `<div id='${element.id}'	class='element uml-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;margin-top:${((boxh * -0.15))}px; width:${boxw}px;font-size:${texth}px;`;

        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;

         //div to encapuslate IE header
        str += `<div class='uml-header' style='width: ${boxw}; height: ${boxh};'>`; 
        //svg for IE header, background and text
        str += `<svg width='${boxw}' height='${boxh}'>`;
        str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
        stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
        <text class='text' x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
        //end of svg for IE header
        str += `</svg>`;
        //end of div for IE header
        str += `</div>`;
        
        //div to encapuslate IE content
        str += `<div class='uml-content' style='margin-top: ${-8 * zoomfact}px;'>`;
        //Draw IE-content if there exist at least one attribute
        if (elemAttri != 0) {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh/2 + (boxh * elemAttri/2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh/2 + (boxh * elemAttri/2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            for (var i = 0; i < elemAttri; i++) {
                str += `<text class='text' x='5' y='${hboxh + boxh * i/2}' dominant-baseline='middle' text-anchor='right'>${text[i]}</text>`;
            }
            //end of svg for background
            str += `</svg>`;
        // Draw IE-content if there are no attributes.
        } else {
            //svg for background
            str += `<svg width='${boxw}' height='${boxh / 2 + (boxh / 2)}'>`;
            str += `<rect class='text' x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh / 2 + (boxh / 2) - (linew * 2)}'
            stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />`;
            str += `<text class='text' x='5' y='${hboxh + boxh / 2}' dominant-baseline='middle' text-anchor='right'> </text>`;
            //end of svg for background
            str += `</svg>`;
        }
        //end of div for IE content
        str += `</div>`;
    }
    
    //IE inheritance
    else if (element.kind == 'IERelation') {
        //div to encapuslate IE element
        str += `<div id='${element.id}'	class='element ie-element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave();'
        style='left:0px; top:0px; margin-top:${((boxh/1.5))}px; width:${boxw}px;height:${boxh/2}px;`;
       
        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
      
        //svg for inheritance symbol
        str += `<svg width='${boxw}' height='${boxh/2}' style='transform:rotate(180deg);   stroke-width:${linew};'>`;

        // Overlapping IE-inheritance
        
        if (element.state == 'overlapping') {
                str+= `<circle cx="${(boxw/2)}" cy="0" r="${(boxw/2.08)}" fill="white"; stroke="black";'/> 
                <line x1="0" y1="${boxw/50}" x2="${boxw}" y2="${boxw/50}" stroke="black"; />`
        }
        // Disjoint IE-inheritance
        else {
            str+= `<circle cx="${(boxw/2)}" cy="0" r="${(boxw/2.08)}" fill="white"; stroke="black";'/>
                <line x1="0" y1="${boxw/50}" x2="${boxw}" y2="${boxw/50}" stroke="black"; />
                <line x1="${boxw/1.6}" y1="${boxw/2.9}" x2="${boxw/2.6}" y2="${boxw/12.7}" stroke="black" />
                <line x1="${boxw/2.6}" y1="${boxw/2.87}" x2="${boxw/1.6}" y2="${boxw/12.7}" stroke="black" />`
        }
        //end of svg
        str += `</svg>`;
        
    }
    
    //=============================================== <-- End of IE functionality
    //=============================================== <-- Start Sequnece functionality
    //sequence actor and its life line and also the object since they can be switched via options pane.
    else if (element.kind == 'sequenceActorAndObject') {
        //div to encapsulate sequence lifeline.
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;width:${boxw}px;height:${boxh}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}'>`;
        //svg for the life line
        str += `<path class="text" 
        d="M${(boxw/2)+linew},${(boxw/4)+linew}
        V${boxh}
        "
        stroke-width='${linew}'
        stroke='${element.stroke}'
        stroke-dasharray='${linew*3},${linew*3}'
        fill='transparent'
        />`;
        //actor or object is determined via the buttons in the context menu. the default is actor.
        if (element.actorOrObject == "actor") {
            //svg for actor.
            str += `<g>`
            str += `<circle cx="${(boxw/2)+linew}" cy="${(boxw/8)+linew}" r="${boxw/8}px" fill='${element.fill}' stroke='${element.stroke}' stroke-width='${linew}'/>`;
            str += `<path class="text"
                d="M${(boxw/2)+linew},${(boxw/4)+linew}
                    v${boxw/6}
                    m-${(boxw/4)},0
                    h${boxw/2}
                    m-${(boxw/4)},0
                    v${boxw/3}
                    l${boxw/4},${boxw/4}
                    m${(boxw/4)*-1},${(boxw/4)*-1}
                    l${(boxw/4)*-1},${boxw/4}
                "
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='transparent'
            />`;
            str += `<text class='text' x='${xAnchor}' y='${boxw}' dominant-baseline='middle' text-anchor='${vAlignment}' fill='${nonFilledElementPartStrokeColor}'>${element.name}</text>`;
            str += `</g>`;
        }
        else if (element.actorOrObject == "object") {
            //svg for object.
            str += `<g>`;
            str += `<rect class='text'
                x='${linew}'
                y='${linew}'
                width='${boxw - (linew * 2)}'
                height='${(boxw/2) - linew}'
                rx='${sequenceCornerRadius}'
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}' 
            />`;
            str += `<text class='text' x='${xAnchor}' y='${((boxw/2) - linew)/2}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>`;
            str += `</g>`;   
        }
        str += `</svg>`;  
    }
    // Sequence activation 
    else if (element.kind == 'sequenceActivation') {
        //div to encapsulate sequence lifeline.
        str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' 
        style='left:0px; top:0px;width:${boxw}px;height:${boxh}px;`;

        if (context.includes(element)) {
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `pointer-events: none; opacity: ${ghostPreview};`;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}'>`;
        //svg for the activation rect
        str += `<rect rx="12" style="height: 100%; width: 100%; fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />`;
        str += `</svg>`;  
    }
    //=============================================== <-- End of Sequnece functionality
    //=============================================== <-- Start ER functionality
    //ER element
    else {
        // Create div & svg element
        if (element.kind == "EREntity") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        else if (element.kind == "ERAttr") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        else if (element.kind == "ERRelation") {
            str += `<div id='${element.id}'	class='element' onmousedown='ddown(event);' onmouseenter='mouseEnter();' onmouseleave='mouseLeave()';' style='
                            left:0px;
                            top:0px;
                            margin-top:${((boxh / 2.75))}px;;
                            width:${boxw}px;
                            height:${boxh}px;
                            font-size:${texth}px;`;
        }
        if(context.includes(element)){
            str += `z-index: 1;`;
        }
        if (ghosted) {
            str += `
                pointer-events: none;
                opacity: ${ghostPreview};
            `;
        }
        str += `'>`;
        str += `<svg width='${boxw}' height='${boxh}' >`;
        // Create svg 
        if (element.kind == "EREntity") {

            var weak = "";

            if(element.state == "weak") {
                weak = `<rect x='${linew * multioffs }' y='${linew * multioffs }' width='${boxw- (linew * multioffs * 2)}' height='${boxh - (linew * multioffs * 2)}'
                stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' /> 
                `;         
            }
            
            str += `<rect  class="text" x='${linew}' y='${linew}' width='${boxw - (linew * 2)}' height='${boxh - (linew * 2)}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' />
                    ${weak}
                    <text  class="text" x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text> 
                    `;
        }
        else if (element.kind == "ERAttr") {
            var dash = "";
            var multi = "";

            if (element.state == "computed") {
                dash = "stroke-dasharray='4 4'";
            }
        
            if (element.state == "multiple") {
                multi = `
                        <path d="M${linew * multioffs},${hboxh} 
                        Q${linew * multioffs},${linew * multioffs} ${hboxw},${linew * multioffs} 
                        Q${boxw - (linew * multioffs)},${linew * multioffs} ${boxw - (linew * multioffs)},${hboxh} 
                        Q${boxw - (linew * multioffs)},${boxh - (linew * multioffs)} ${hboxw},${boxh - (linew * multioffs)} 
                        Q${linew * multioffs},${boxh - (linew * multioffs)} ${linew * multioffs},${hboxh}" 
                        stroke='${element.stroke}' fill='${element.fill}' stroke-width='${linew}' />`;
            }    

            str += `<path d="M${linew},${hboxh} 
                            Q${linew},${linew} ${hboxw},${linew} 
                            Q${boxw - linew},${linew} ${boxw - linew},${hboxh} 
                            Q${boxw - linew},${boxh - linew} ${hboxw},${boxh - linew} 
                            Q${linew},${boxh - linew} ${linew},${hboxh}" 
                        stroke='${element.stroke}' fill='${element.fill}' ${dash} stroke-width='${linew}' class="text" />
                        
                        ${multi}
                        <text x='${xAnchor}' y='${hboxh}' `;
            
            if(element.state == "candidate" || element.state == 'primary') {
                str += `class='underline'`;
            }             
            str += `dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name}</text>
            `;
                
            if(element.state == "weakKey") {
                // Calculates how far to the left X starts
                var diff = xAnchor - textWidth / 2;
                diff = diff < 0 ? 0 - diff + 10 : 0;
                str += `<line x1="${xAnchor - textWidth / 2 + diff}" y1="${hboxh + texth * 0.5 + 1}" x2="${xAnchor + textWidth / 2 + diff}" y2="${hboxh + texth * 0.5 + 1}" stroke="${element.stroke}" stroke-dasharray="${5*zoomfact}" stroke-width="${linew}"/>`;
            }
            
        }
        else if (element.kind == "ERRelation") {         

            var numOfLetters = element.name.length;
            if (tooBig) {
                var tempName = "";
                var maxTextWidth = boxw - margin;

                if (element.state == "weak") maxTextWidth -= (linew * multioffs) * 2;

                for (var i = 0; i < element.name.length; i++){
                    tempName += element.name[i];
                    if (canvasContext.measureText(tempName).width > maxTextWidth){
                        numOfLetters = tempName.length - 1;
                        break;
                    }
                }
            }

            var weak = "";
            if (element.state == "weak") {
                weak = `<polygon points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' class="text"/>
                    `;
                xAnchor += linew * multioffs;
            }
            str += `<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' class="text"/>
                    ${weak}`;
            str += `<text x='${xAnchor}' y='${hboxh}' dominant-baseline='middle' text-anchor='${vAlignment}'>${element.name.slice(0, numOfLetters)}</text>`;

        }
        str += "</svg>";
    }
    //=============================================== <-- End ER functionality
    if (element.isLocked) {
        str += `<img id="pad_lock" width='${zoomfact *20}' height='${zoomfact *25}' src="../Shared/icons/pad_lock.svg"/>`;     
    }
    str += "</div>";
    return str;
}

export {drawElement};