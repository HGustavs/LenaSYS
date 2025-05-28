/**
 * @description Construct a string containing all the elements for a data-object.
 * @param {Object} element The object that is going to be drawn.
 * @param {boolean} ghosted Is the element a ghost element.
 * @returns Returns a string containing the elements that should be drawn.
 */
function drawElement(element, ghosted = false) {
    // The size is scaled up or down depending on how far in or out is zoomed
    let divContent, style, cssClass;
    let texth = Math.round(zoomfact * textheight);   // Font size (px)
    let linew = Math.round(strokewidth * zoomfact);  // Stroke width
    let boxw = Math.round(element.width * zoomfact); // Scaled width
    let boxh = element.height ? 

    Math.round(element.height * zoomfact) : 0; // Only used for extra whitespace from resize
    let zLevel = element.z ?? 2; /*Ensures that elements without a defined z-index get a default value (2)*/
    let mouseEnter = '';

    //Measure the name’s pixel width
    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let canvasContext = canvas.getContext('2d');
    // Caclulate font width using some canvas magic
    canvasContext.font = `${texth}px ${canvasContext.font.split('px')[1]}`;
    let textWidth = canvasContext.measureText(element.name).width;

    //Highlight elements involved in validation errors
    if (errorActive) {
        checkElementError(element);  // Gather error
        for (let i = 0; i < errorData.length; i++) {
            if (element.id == errorData[i].id) element.stroke = 'red';
        }
    }

    //Delegate drawing to the correct helper
    switch (element.kind) {
        case elementTypesNames.EREntity:
            divContent = drawElementEREntity(element, boxw, boxh, linew, texth);
            break;
        case elementTypesNames.UMLEntity:
            divContent = drawElementUMLEntity(element, boxw, boxh, linew, texth);
            cssClass = 'uml-element';
            break;
        case elementTypesNames.IEEntity:
            divContent = drawElementIEEntity(element, boxw, boxh, linew, texth);
            cssClass = 'uml-element';
            break;
        case elementTypesNames.SDEntity:
            divContent = drawElementSDEntity(element, boxw, boxh, linew, texth);
            cssClass = 'uml-element';
            break;
        case elementTypesNames.ERRelation:
            divContent = drawElementERRelation(element, boxw, boxh, linew);
            break;
        case elementTypesNames.SelfCall:
            divContent = drawElementSelfCall(element, boxw, boxh, linew);
            break;
        case elementTypesNames.ERAttr:
            divContent = drawElementERAttr(element, textWidth, boxw, boxh, linew, texth);
            break;
        case elementTypesNames.UMLRelation:
            divContent = drawElementUMLRelation(element, boxw, boxh, linew);
            cssClass = 'uml-element';
            break;
        case elementTypesNames.IERelation:
            divContent = drawElementIERelation(element, boxw, boxh, linew);
            cssClass = 'ie-element';
            // Inheritance relations sit behind other IE elements
            style = element.name == "Inheritance" ?
             `left:0; top:0; width:${boxw}px; height:${boxh}px; z-index:${zLevel};`:
             `left:0; top:0; width:${boxw}px; height:${boxh}px; z-index:${zLevel};`;
            break;

            //UML state‑diagram nodes
        case elementTypesNames.UMLInitialState:
            let initVec = `
                <g transform="matrix(1.14286,0,0,1.14286,-6.85714,-2.28571)" >
                    <circle cx="16.5" cy="12.5" r="10.5" />
                </g>`;
            divContent = drawElementState(element, initVec);
            cssClass = 'uml-state';
            style = `width:${boxw}px; height:${boxh}px; z-index:${zLevel};`;
            break;
        case elementTypesNames.UMLFinalState:
            let finalVec = `
                <g>
                    <path 
                        d=" M 12,-0
                            C 18.623,-0 24,5.377 24,12
                            C 24,18.623 18.623,24 12,24
                            C 5.377,24 -0,18.623 -0,12
                            C -0,5.377 5.377,-0 12,-0 Z
                            M 12,2C17.519,2 22,6.481 22,12
                            C 22,17.519 17.519,22 12,22
                            C 6.481,22 2,17.519 2,12
                            C 2,6.481 6.481,2 12,2 Z"
                    />
                    <circle 
                        transform="matrix(1.06667,0,0,1.06667,-3.46667,-3.46667)" 
                        cx="14.5" cy="14.5" r="5.5"
                    />
                </g>`;
            divContent = drawElementState(element, finalVec);
            cssClass = 'uml-state';
            style = `width:${boxw}px; height:${boxh}px; z-index:${zLevel};`;
            break;
        case elementTypesNames.UMLSuperState:
            divContent = drawElementSuperState(element, textWidth, boxw, boxh, linew);
            cssClass = 'uml-Super';
            break;

            //UML sequence‑diagram widgets
        case elementTypesNames.sequenceActor:
            divContent = drawElementSequenceActor(element, textWidth, boxw, boxh, linew, texth);
            mouseEnter = 'mouseEnterSeq(event);';
            break;
        case elementTypesNames.sequenceObject:
            divContent = drawElementSequenceObject(element, boxw, boxh, linew);
            mouseEnter = 'mouseEnterSeq(event);';
            break;
        case elementTypesNames.sequenceActivation:
            divContent = drawElementSequenceActivation(element, boxw, boxh, linew);
            break;
        case elementTypesNames.sequenceLoopOrAlt:
            // Expand for each alternative block rendered below the header
            let height = boxh + (element.alternatives.length ?? 0) * zoomfact * 125;
            divContent = drawElementSequenceLoopOrAlt(element, boxw, height, linew, texth);
            break;

        //Legacy sticky note
        case 'note': 
            divContent = drawElementNote(element, boxw, boxh, linew, texth);
            cssClass = 'uml-element';
            break;
    }

    // Conditional pad-lock icon
    let lock = '';
    if (element.isLocked) {
        lock = `<img 
                     id='pad_lock' 
                     width='${zoomfact * 20}' 
                     height='${zoomfact * 25}' 
                     src='../Shared/icons/pad_lock.svg'
                     alt='Padlock' 
                 />`;
    }

    // Compose final wrapper div
    style = style ?? `left:0; top:0; width:auto; height:auto; font-size:${texth}px; z-index:${zLevel};`;
    let ghostPreview = ghostLine ? 0 : 0.4;
    let ghostStr = (ghosted) ? ` pointer-events:none; opacity:${ghostPreview};` : '';
    return `<div 
                id='${element.id}' 
                class='element ${cssClass}' 
                onmousedown='ddown(event);' 
                onmouseenter='mouseEnter();${mouseEnter}' 
                onmouseleave='mouseLeave();' 
                style='${style}${ghostStr}' 
            >${divContent}${lock}</div>`;
}

/**
 * @description Validates the text length against the max variable.
 * @param {String} s A string when typing in the different element.
 * @param {Number} max A max number.
 * @returns Returns the string s if s is smaller or equals to max.
 * @returns Returns a string that adds one string to a another string.
 */
// Chop the string into pieces up to `max` characters long.
function splitLengthyLine(s, max) {
    if (s.length <= max) return s;
    return [s.substring(0, max)].concat(splitLengthyLine(s.substring(max), max));
}

/**
 * @description Converts the text to an array for the element.
 * @param {Object} e An object that contains the text that is written in the element.
 * @param {Number} max A max number.
 * @returns Returns the object that contains all the text.
 */
// Apply `splitLengthyLine` to each line in an array and flatten the result.
function splitFull(e, max) {
    return e.map(line => splitLengthyLine(line, max)).flat()
}

/**
 * @description Updating the height of the element.
 * @param {Array} arr An array for the entities height.
 * @param {Object} element The object that change the height.
 * @param {Number} height The height of the entity.
 */
// Track the rendered height of an element in `arr`, replacing any old entry.
function updateElementHeight(arr, element, height) {
    // Removes the previouse value in IEHeight for the element
    for (let i = 0; i < arr.length; i++) {
        if (element.id == arr[i].id) arr.splice(i, 1);
    }
    // Calculate and store the IEEntity's real height
    arr.push({ id: element.id, height: height });
}

/**
 * @description Draw a div for the element.
 * @param {String} c The name for the class.
 * @param {String} style The css style for the entity.
 * @param {Object} s Object containing the content to be placed inside the div tag.
 * @returns Returns a string containing a div for the element that is drawn.
 */
function drawDiv(c, style, s) {
    return `<div class='${c}' style='${style}'> ${s} </div>`;
}

/**
 * @description Draw a svg for the element.
 * @param {Number} w Width of the svg.
 * @param {Number} h Height of the svg.
 * @param {Object} s Object containing the content to be placed inside the svg tag.
 * @param {String} extra Extra attributes to be added for the svg tag.
 * @returns Returns a string containing a svg for the element that is drawn.
 */
function drawSvg(w, h, s, extra = '') {
    return `<svg width='${w}' height='${h}' ${extra}> ${s} </svg>`;
}

/**
 * @description Draw a rectangle for the element.
 * @param {Number} w Width of the rectangle.
 * @param {Number} h Height of the rectangle.
 * @param {Number} l It's the stroke width for the line.
 * @param {Object} e It's the element's stroke color.
 * @param {String} extra Extra attributes to be added to the rectangle tag.
 * @returns Returns a string containing a svg rectangle for the element that is drawn.
 */
function drawRect(w, h, l, e, extra = e.fill ? `fill='${e.fill}'` : `fill=#ffffff`) {
    return `<rect 
                class='text' x='${l}' y='${l}' 
                width='${w - l * 2}' height='${h - l * 2}' 
                stroke-width='${l}' stroke='${e.stroke}' 
                ${extra} 
            />`;
}

/**
 * @description Escapes the html which removes problematic characters and replaces them with string-character.
 * @param {String} str String to be escaped.
 * @returns Returns a html-free string.
 */
// Replace special HTML characters with safe entities.
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
/**
 * @description Draw the text for the element.
 * @param {Number} x The X coordinate for the drawn text.
 * @param {Number} y The Y coordinate for the drawn text.
 * @param {String} a To align the string.
 * @param {String} t The string content for the text.
 * @param {String} extra Extra attributes to be added to the text tag.
 * @returns Returns a string containing a svg text for the element that is drawn.
 */
// Create an SVG `<text>` element string with escaped content.
function drawText(x, y, a, t, extra = '') {
    const safeText = escapeHtml(t);
    return `<text
                class='text' x='${x}' y='${y}' 
                dominant-baseline='auto' text-anchor='${a}' ${extra}
            > ${safeText} </text>`;
}

/**
 * @description Draw a ER entity.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns a SVG for the ER entity that is going to be drawn.
 */
function drawElementEREntity(element, boxw, boxh, linew, texth) {
    const l = linew * 3;
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.5);
    const lineHeight = 1.5;
    
    //Check if element height and minHeight is 0, if so set both to 50
    if (element.height == 0 && element.minHeight == 0) {
        element.minHeight = 50;
        element.height = element.minHeight;
        // update boxh to 50
        boxh = 50;
    }

    // Split string into an array of lines based on max characters per line
    function splitFull(str, maxCharsPerLine) {
        const result = [];
        for (let i = 0; i < str.length; i += maxCharsPerLine) {
            result.push(str.substring(i, i + maxCharsPerLine));
        }
        return result;
    }

    const nameLines = splitFull(element.name, maxCharactersPerLine);
    const textHeight = texth * nameLines.length * lineHeight;
    const contentHeight = Math.max(boxh, textHeight + linew * 4);

    let weak = '';
    if (element.state == "weak") {
        weak = `<rect
                    x='${l}' 
                    y='${l}' 
                    width='${boxw - l * 2}' 
                    height='${contentHeight - l * 2}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                />`;
    }
    let rect = drawRect(boxw, contentHeight, linew, element);
    // Center each line vertically
    let text = "";
    for (let i = 0; i < nameLines.length; i++) {
        const y = (contentHeight / 2) - (nameLines.length / 2 - i - 0.5) * texth * lineHeight;
        text += drawText(boxw / 2, y, 'middle', nameLines[i]);
    }
    return drawSvg(boxw, contentHeight, rect + weak + text);
}

/**
 * @description Draw a UML entity.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns the different parts of the UML entity.
 */
// This function Draws the UML class/entity box (header, attributes, 
// methods, stereotype) with automatic line-wrapping.
function drawElementUMLEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;

    // Split attributes and functions into lines that fit in the box
    const aText = splitFull(element.attributes, maxCharactersPerLine);
    const fText = splitFull(element.functions, maxCharactersPerLine);

    // Calculate total height and update diagram metadata
    let aHeight = texth * (aText.length + 1) * lineHeight;
    let fHeight = texth * (fText.length + 1) * lineHeight;
    let totalHeight = aHeight + fHeight - linew * 2 + texth * 2;
    updateElementHeight(UMLHeight, element, totalHeight + boxh);

    // Header
    const headerLines = splitFull([element.name], maxCharactersPerLine);
    let height = texth * (headerLines.length + 1) * lineHeight;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = "";
    let headStereotype = "";
    let headSvg = "";

    // Conditionally display stereotype above name if one is set
    if (element.stereotype != "" && element.stereotype != null) {
        // Shrinks the stereotype text but only if its long (over 20 chars)
        //so it fits within the element width without overflowing/cutting off
        let fullStereotype = `«${element.stereotype}»`;
        if (fullStereotype.length > 20) {
            headStereotype = `<text 
        x="${boxw / 2}" 
        y="${texth * 0.8 * lineHeight}" 
        text-anchor="middle"
        lengthAdjust="spacingAndGlyphs" 
        textLength="${boxw - 10}"
    >${fullStereotype}</text>`;
        } else {
            headStereotype = drawText(boxw / 2, texth * 0.8 * lineHeight, 'middle', fullStereotype);
        }
        for (let i = 0; i < headerLines.length; i++) {
            const y = texth * (i + 1.5) * lineHeight;
            headText += drawText(boxw / 2, y, 'middle', headerLines[i]);
        }
        headSvg = drawSvg(boxw, height, headRect + headText + headStereotype);
    }   
    else {
        height = texth * (headerLines.length + 0.5) * lineHeight;
        for (let i = 0; i < headerLines.length; i++) {
            const y = texth * (i + 1) * lineHeight;
            headText += drawText(boxw / 2, y, 'middle', headerLines[i]);
        }
        headSvg = drawSvg(boxw, height, headRect + headText);
    }
    
    
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);

    // Content, Attributes
    const textBox = (s, css) => {
        let height = (texth * s.length * lineHeight) + boxh / 2 + texth;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let rect = drawRect(boxw, height, linew, element);
        let contentSvg = drawSvg(boxw, height, rect + text);
        let style = (css == 'uml-footer') ? `height:${height}px` : `height:${height - linew * 2}px`;
        return drawDiv(css, style, contentSvg);
    };

    // Render attributes and functions
    str += textBox(aText, 'uml-content');
    str += textBox(fText, 'uml-footer');
    return str;
}

/**
 * @description Draw a IE entity.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns the different parts of the IE entity.
 */
function drawElementIEEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;
    const text = splitFull(element.attributes, maxCharactersPerLine);
    const primaryKeys = element.primaryKey;
    // Adds each string from the primaryKey property first in the text array.
    const newPrimaryKeys = splitFull(primaryKeys, maxCharactersPerLine - 3);
    if (primaryKeys) text.unshift(...newPrimaryKeys);

    // Calculate height and register with diagram context
    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight = tHeight - linew * 2 + texth * 2;
    updateElementHeight(IEHeight, element, totalHeight + boxh);

    const headerLines = splitFull([element.name], maxCharactersPerLine);
    let height = texth * (headerLines.length + 0.5) * lineHeight;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = "";
    for (let i = 0; i < headerLines.length; i++) {
        const y = texth * (i + 1) * lineHeight;
        headText += drawText(boxw / 2, y, 'middle', headerLines[i]);
    }
    let headSvg = drawSvg(boxw, height, headRect + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);

    // Content, Attributes
    const textBox = (s, css) => {
        let height = (texth * s.length * lineHeight) + boxh + texth;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            if (i < newPrimaryKeys.length) {
                // Writes the text.
                text += drawText('0.5em',
                    texth * (i + 1) * lineHeight, 'start', s[i],
                    'style="text-decoration-line:underline; padding-right:30px:!important"');
            } else {
                text += drawText('0.5em',
                    texth * (i + 1) * lineHeight,
                    'start', s[i]);
            }
        }
        let rect = drawRect(boxw, height, linew, element);
        let contentSvg = drawSvg(boxw, height, rect + text);
        let style = `height:${height}px`;
        return drawDiv(css, style, contentSvg);
    };

    str += textBox(text, 'uml-content');
    return str;
}

/**
 * @description Draw a SD entity.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns the different parts of the SD entity.
 */
function drawElementSDEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    let cornerRadius = Math.round(20 * zoomfact); //determines the corner radius for the SD states.
    const maxCharactersPerLine = Math.floor(boxw / texth * 1.75);
    const lineHeight = 1.5;

    const text = splitFull(element.attributes, maxCharactersPerLine);

     // Split attributes and calculate box height
    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight = tHeight - linew * 2 + texth * 2;
    updateElementHeight(SDHeight, element, totalHeight + boxh);

    // Header 
    let headerLines = splitFull([element.name], maxCharactersPerLine);
    let height = texth * (headerLines.length + 0.5) * lineHeight;
    let headPath = `
        <path 
        class="text"
            d="M ${linew + cornerRadius},${linew}
                h ${boxw - linew * 2 - cornerRadius * 2}
                a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius}
                v ${height - linew * 2 - cornerRadius}
                h ${(boxw - linew * 2) * -1}
                v ${(height - linew * 2 - cornerRadius) * -1}
                a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius * -1}
                z"
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill ? element.fill : "#ffffff"}'
        />`;
    let headText = "";
    for (let i = 0; i < headerLines.length; i++) {
        const y = texth * (i + 1) * lineHeight;
        headText += drawText(boxw / 2, y, 'middle', headerLines[i]);
    }
    let headSvg = drawSvg(boxw, height, headPath + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px;`, headSvg);

    // Attributes box with lower rounded corners
    const drawBox = (s, css) => {
        let height = (texth * s.length * lineHeight) + boxh + texth;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let path = `
            <path 
                class="text"
                d="M ${linew},${(linew)}
                    h ${boxw - linew * 2}
                    v ${height - linew * 2 - cornerRadius}
                    a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius * -1},${cornerRadius}
                    h ${(boxw - linew * 2 - cornerRadius * 2) * -1}
                    a ${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius * -1},${cornerRadius * -1}
                    v ${(height - linew * 2 - cornerRadius) * -1}
                    z"
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill ? element.fill : "#ffffff"}'
            />`;
        let contentSvg = drawSvg(boxw, height, path + text);
        let style = `height:${height}px`;
        return drawDiv(css, style, contentSvg);
    };

    str += drawBox(text, 'uml-content');
    return str;
}

/**
 * @description Draw a ER relation.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the ER relation that is going to be drawn.
 */
function drawElementERRelation(element, boxw, boxh, linew) {
    let content, weak;
    let hboxw = boxw / 2;
    let hboxh = boxh / 2;
    const multioffs = 3;
    
    if (element.state == "weak") {
        weak = `<polygon 
                    points="${linew * multioffs * 1.5},${hboxh} ${hboxw},${linew * multioffs * 1.5} ${boxw - (linew * multioffs * 1.5)},${hboxh} ${hboxw},${boxh - (linew * multioffs * 1.5)}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                    class="text"
                /> `;
    }
    content = `<polygon 
                    points="${linew},${hboxh} ${hboxw},${linew} ${boxw - linew},${hboxh} ${hboxw},${boxh - linew}"  
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                    class="text"
                />
                ${weak}
                <text 
                    x='50%' y='50%' 
                    dominant-baseline='middle' 
                    text-anchor='middle'
                > ${element.name.slice(0, element.name.length)} </text>`;
    return drawSvg(boxw, boxh, content);
}

/**
 * @description Draw a ER attribute.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} textWidth The text width for the element.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns a SVG for the ER attribute that is going to be drawn.
 */
function drawElementERAttr(element, textWidth, boxw, boxh, linew, texth) {
    let content = '';
    let hboxw = boxw / 2;
    let hboxh = boxh / 2;
    // Helper to draw the main oval path, with optional dash or extra attrs
    const drawPath = (l, extra = '') => {
        return `<path 
                    d="M${l},${hboxh} 
                        Q${l},${l} ${hboxw},${l} 
                        Q${boxw - l},${l} ${boxw - l},${hboxh} 
                        Q${boxw - l},${boxh - l} ${hboxw},${boxh - l} 
                        Q${l},${boxh - l} ${l},${hboxh}" 
                    stroke='${element.stroke}' fill='${element.fill}' ${extra} stroke-width='${linew}' 
                    class="text" 
                />`;
    };

    if (element.state) {
        let dash = (element.state == "computed") ? "stroke-dasharray='4 4'" : '';
        content += drawPath(linew, dash);
    }
    let extra = '';
    // Additional decorations for multi-valued or weak-key
    switch (element.state) {
        case "multiple":
            content += drawPath(linew * 3);
            break;
        case "weakKey":
            content += `<line 
                            x1="${(boxw - textWidth) / 2}" 
                            y1="${hboxh + texth / 2 + 1}" 
                            x2="${(boxw + textWidth) / 2}" 
                            y2="${hboxh + texth / 2 + 1}" 
                            stroke="${element.stroke}" stroke-dasharray="${5 * zoomfact}" stroke-width="${linew}"
                        />`;
            break;
        case "primary":
        case "candidate":
            extra = `class='underline'`;
            break;
    }

        const maxTextWidth = boxw - 10; // leave some margin
        let displayName = element.name;
        let estimatedTextWidth = displayName.length * 8;

        let x;
        let textAnchor;

        if (estimatedTextWidth <= maxTextWidth) {
            // Text fits – center it
            x = boxw / 2;
            textAnchor = "middle";
        } else {
            // Text is too long – show first part of text
            x = 4;
            textAnchor = "start";
        }

     // Default text label centered
        content += `<text 
        x='${x}' 
        y='${hboxh}' ${extra}
        dominant-baseline='middle' 
        text-anchor='${textAnchor}'
        >${displayName}</text>`;
    
    return drawSvg(boxw, boxh, content);
}

/**
 * @description Draw a UML relation.
 * @param {Object} element The object that is goig to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the UML relation that is going to be drawn.
 */
function drawElementUMLRelation(element, boxw, boxh, linew) {
    // Fill black when overlapping, otherwise white
    let fill = (element.state == 'overlapping') ? 'black' : 'white';
    let strokeColor = (fill === 'black') ? 'white' : 'black';
    let poly = `
        <polygon 
            points='${linew},${boxh - linew} ${boxw / 2},${linew} ${boxw - linew},${boxh - linew}' 
            style='fill:${fill}; stroke:${strokeColor}; stroke-width:${linew};'
        />`;
    return drawSvg(boxw, boxh, poly);
}

//In progress 
function drawElementSelfCall(element, boxw, boxh, linew) {
  const strokeColor = "black";
  const fillColor   = "none";
    console.log("hello from draw")
  // Determine square size so it fits with a linew-wide margin
  const size = Math.min(boxw, boxh) - 2 * linew;
  // Center it
  const x = (boxw  - size) / 2;
  const y = (boxh  - size) / 2;

  const square = `
    <rect 
      class="selfcall"
      x="${x}" y="${y}" 
      width="${size}" height="${size}" 
      style="fill:${fillColor}; stroke:${strokeColor}; stroke-width:${linew};" 
    />
  `;

  return drawSvg(boxw, boxh, square);
}

/**
 * @description Draw a IE relation.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the IE relation that is going to be drawn.
 */
function drawElementIERelation(element, boxw, boxh, linew) {
    let content = "";
    content += `<circle cx="${boxw / 2}" cy="0" r="${boxw / 2.08}" fill='white' stroke='black' /> 
                <line x1="${boxw / 2}" y1="${linew / 2}" x2="${(boxw / 2) + (boxw / 2.08)}" y2="${linew / 2}" stroke='black' />
                <line x1="${(boxw / 2) + 1}" y1="${linew / 2}" x2="${(boxw / 2) - (boxw / 2.08) + 1}" y2="${linew / 2}" stroke='black' />`;

    // Add inheritance arrows if not overlapping
    if (element.state != inheritanceStateIE.OVERLAPPING) {
        content += `<line x1="${boxw / 1.6}" y1="${boxw / 2.9}" x2="${boxw / 2.6}" y2="${boxw / 12.7}" stroke='black' />
                    <line x1="${boxw / 2.6}" y1="${boxw / 2.87}" x2="${boxw / 1.6}" y2="${boxw / 12.7}" stroke='black' />`;
    }
    return drawSvg(boxw, boxh, content, `style='transform:rotate(180deg); stroke-width:${linew}; display: block;'`);
}

/**
 * @description Draw a the different UML state.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the UML state that is going to be drawn.
 */
function drawElementState(element, vectorGraphic) {
    const theme = document.getElementById("themeBlack");
    // Invert fill if theme background differs
    if (element.fill == color.BLACK && theme.href.includes('blackTheme')) {
        element.fill = color.WHITE;
    } else if (element.fill == color.WHITE && theme.href.includes('style')) {
        element.fill = color.BLACK;
    }
    return `<svg 
                width="100%" height="100%" 
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg" 
                xml:space="preserve"
                style="fill:${element.fill};fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
            > ${vectorGraphic} </svg>`;
}

/**
 * @description Draw a UML super state.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} textWidth The text width for the element.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the UML super state that is going to be drawn.
 */
function drawElementSuperState(element, textWidth, boxw, boxh, linew) {
    // Limit name length and append ellipsis if too long
    const MAX_TEXT_LENGTH = 30;
    element.stroke = (isDarkTheme()) ? color.WHITE : color.BLACK;

    let displayText = element.name.length > MAX_TEXT_LENGTH ? element.name.substring(0, MAX_TEXT_LENGTH) + '...' : element.name;

    // Header width, text width and padding, but no wider than boxw - 10px
    let rectTwoWidth = Math.min(textWidth + 80 * zoomfact, boxw - 10);

    let rectOne = drawRect(boxw, boxh, linew, element, `fill='none' fill-opacity='0' rx='5'`);
    let rectTwo = drawRect(rectTwoWidth, 50 * zoomfact, linew, element, `fill='${element.fill}' fill-opacity="1" id="cornerLabel"`);
    // State name text inside header
    let text = drawText(20 * zoomfact, 30 * zoomfact, 'start', displayText, `font-size='${20 * zoomfact}px'`);
    
    return drawSvg(boxw, boxh, rectOne + rectTwo + text);
}

/**
 * @description Draw a sequence actor.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} textWidth The text width for the element.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns a SVG for the sequence actor that is going to be drawn.
 */
function drawElementSequenceActor(element, textWidth, boxw, boxh, linew, texth) {
    // Dashed lifeline path, head circle and body stick-figure
    let content;
    content = `<path 
                    class="text" 
                    d="M${boxw / 2},${boxw / 4 + linew} V${boxh}"
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    stroke-dasharray='${linew * 3},${linew * 3}'
                    fill='transparent'
                />
                <g>
                    <circle 
                        cx="${(boxw / 2) }" 
                        cy="${(boxw / 8) + linew}" 
                        r="${boxw / 8}px" 
                        fill='${element.fill}' stroke='${element.stroke}' stroke-width='${linew}'
                    /> 
                    <path 
                        class="text"
                        d="M${(boxw / 2)},${(boxw / 4) + linew}
                            v${boxw / 6}
                            m${-boxw / 4},0
                            h${boxw / 2}
                            m${-boxw / 4},0
                            v${boxw / 4}
                            l${boxw / 4},${boxw / 4}
                            m${-boxw / 4},${-boxw / 4}
                            l${-boxw / 4},${boxw / 4}"
                        stroke-width='${linew}'
                        stroke='${element.stroke}'
                        fill='transparent'
                    />
                    <rect 
                        class='text'
                        x='${(boxw - textWidth) / 2}'
                        y='${boxw + linew * 2}'
                        width='${textWidth}'
                        height='${texth - linew}'
                        stroke='none'
                        fill='${element.fill}'
                    />
                    <text 
                        class='nameLabel' 
                        x='${boxw / 2}' 
                        y='${boxw + texth / 2 + linew * 2}' 
                        dominant-baseline='middle' 
                        text-anchor='middle'
                    >${element.name}</text>
                </g>`;
    return drawSvg(boxw, boxh, content);
}

/**
 * @description Draw a sequence object.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the sequence object that is going to be drawn.
 */

function drawElementSequenceObject(element, boxw, boxh, linew) {
    let str = "";
    let content;
    // Dashed vertical lifeline and Object box with rounded corners
    const sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.

    content = `<path 
                    class="text" 
                    d="M ${boxw / 2},${boxw / 4 + linew}
                        V ${boxh}"
                    stroke-width='${linew}'
                    stroke='${element.stroke}'
                    stroke-dasharray='${linew * 3},${linew * 3}'
                    fill='transparent'
                /> 
                <g>
                    <rect 
                        class='text'
                        x='${linew}'
                        y='${linew}'
                        width='${boxw - linew * 2}'
                        height='${(boxw / 2) - linew}'
                        rx='${sequenceCornerRadius}'
                        stroke-width='${linew}'
                        stroke='${element.stroke}'
                        fill='${element.fill}' 
                    />
                    <text 
                        class='text' 
                        x='${boxw / 2}' 
                        y='${(boxw / 2 - linew) / 2}' 
                        dominant-baseline='middle' 
                        text-anchor='middle'
                    > ${element.name} </text>
                </g>`;
    str += drawSvg(boxw, boxh, content);
    return str;
}

/**
 * @description Draw a sequence activation.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the sequence activation that is going to be drawn.
 */
function drawElementSequenceActivation(element, boxw, boxh, linew) {
    let content;
    const sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.

    // Single rounded rectangle representing the activation
    content = `<rect 
                    x='${linew}' y='${linew}' 
                    width='${boxw - linew * 2}' height='${boxh - linew * 2}' 
                    rx='${sequenceCornerRadius * 3}' 
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}'
                />`;
    return drawSvg(boxw, boxh, content);
}

/**
 * @description Draw a sequence loop or alt.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @returns Returns a SVG for the sequence loop or alt that is going to be drawn.
 */
function drawElementSequenceLoopOrAlt(element, boxw, boxh, linew, texth) {
    
    // Determine label color based on theme
    let fontColor = (isDarkTheme()) ? color.WHITE : color.GREY;
    element.altOrLoop = (element.alternatives.length > 1) ? "Alt" : "Loop";

    // Outer frame
    let content = `
        <rect 
            class='text'
            x='${linew}'
            y='${linew}'
            width='${boxw - linew * 2}'
            height='${boxh - linew * 2}'
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='none'
            rx='${7 * zoomfact}'
            fill-opacity="0"
        />`;
    // If it has alternatives, iterate and draw them out one by one, evenly spaced out.
    if (element.alternatives.length) {
        for (let i = 1; i < element.alternatives.length; i++) {
            content += `<path class="text"
                            d="M ${boxw - linew},${(boxh / element.alternatives.length) * i}
                                H ${linew} "
                            stroke-width='${linew}'
                            stroke='${element.stroke}'
                            stroke-dasharray='${linew * 3},${linew * 3}'
                            fill='transparent'
                        />`;
            content += drawText(linew * 2,
                (boxh / element.alternatives.length) * i + texth / 1.5 + linew * 2,
                'auto', element.alternatives[i], `fill='${fontColor}'`
            );
        }
    }
    // SVG for the small label in top left corner
    content += `<path 
                id="cornerLabel"
                d="M ${(7 * zoomfact) + linew},${linew}
                    h ${100 * zoomfact}
                    v ${25 * zoomfact}
                    l ${-12.5 * zoomfact},${12.5 * zoomfact}
                    H ${linew}
                    V ${linew + (7 * zoomfact)}
                    a ${7 * zoomfact},${7 * zoomfact} 0 0 1 ${7 * zoomfact},${(7 * zoomfact) * -1}
                    z" 
                stroke-width='${linew}'
                stroke='${element.stroke}'
                fill='${element.fill}'
            />`;

    // Draw the header text (“Alt” or “Loop”)
    let textOne = drawText(50 * zoomfact + linew, 18.75 * zoomfact + linew, 'middle', element.altOrLoop);
    let textTwo = drawText(linew * 2, 37.5 * zoomfact + linew * 3 + texth / 1.5, 'auto', element.alternatives[0] ?? '', `fill=${fontColor}`);
    return drawSvg(boxw, boxh, content + textOne + textTwo);
}

/**
 * @description Draw a note.
 * @param {Object} element The object that is going to be drawn.
 * @param {Number} boxw Width of the element.
 * @param {Number} boxh Height of the element.
 * @param {Number} linew The line width of the element.
 * @param {Number} texth The text height for the element.
 * @returns Returns a SVG for the note that is going to be drawn.
 */
function drawElementNote(element, boxw, boxh, linew, texth) {
    const padding = 10; // Padding in pixels
    const lineHeight = 1.5;
    const availableTextWidth = boxw - padding * 2;

    // Approximate number of characters per line based on font size
    const avgCharWidth = texth * 0.48; // average char width in px
    const maxCharactersPerLine = Math.floor(availableTextWidth / avgCharWidth);

    const text = splitFull(element.attributes, maxCharactersPerLine);

    // Ensure at least four text lines
    const textLineCount = Math.max(4, text.length);
    const totalHeight = boxh + texth * textLineCount * lineHeight;

    const maxWidth = boxw - linew * 2;
    const maxHeight = totalHeight - linew * 2;

    // Track this element’s height
    updateElementHeight(NOTEHeight, element, totalHeight);
    element.stroke = (element.fill == color.BLACK) ? color.WHITE : color.BLACK;

    // Note shape with folded top right corner
    let content = `
        <path class="text"
            d=" M ${maxWidth - (23 * zoomfact)},${linew}
                h -${maxWidth - (23 * zoomfact)}
                v ${maxHeight}
                h ${maxWidth}
                v -${maxHeight - (23 * zoomfact)}
                l -${23.5 * zoomfact}, -${23 * zoomfact}
                h 1
                h -1
                v ${23 * zoomfact}
                h ${22 * zoomfact}
                z"
            stroke-width='${linew}'
            stroke='${element.stroke}'
            fill='${element.fill}'
        />`;
    // Draw each line of text with padding from the left
    for (let i = 0; i < text.length; i++) {
        const x = padding;
        const y = texth * (i + 1) * lineHeight;
        content += drawText(x, y, 'start', text[i]);
    }
    return drawSvg(boxw, totalHeight, content);
}