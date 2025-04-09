/**
 * @description Construct an string containing all the elements for an data-object.
 * @param {Object} element The object that should be drawn.
 * @param {boolean} ghosted Is the element an ghost element.
 * @return Returns an string containing the elements that should be drawn.
 */
function drawElement(element, ghosted = false) {
    let divContent, style, cssClass;
    let texth = Math.round(zoomfact * textheight);
    let linew = Math.round(strokewidth * zoomfact);
    let boxw = Math.round(element.width * zoomfact);
    let boxh = Math.round(element.height * zoomfact); // Only used for extra whitespace from resize
    let zLevel = 2;
    let mouseEnter = '';

    canvas = document.getElementById('canvasOverlay');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let canvasContext = canvas.getContext('2d');
    // Caclulate font width using some canvas magic
    canvasContext.font = `${texth}px ${canvasContext.font.split('px')[1]}`;
    let textWidth = canvasContext.measureText(element.name).width;

    if (errorActive) {
        // Checking for errors regarding ER Entities
        checkElementError(element);
        // Checks if element is involved with an error and outlines them in red
        for (let i = 0; i < errorData.length; i++) {
            if (element.id == errorData[i].id) element.stroke = 'red';
        }
    }
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
            style = `left:0; top:0; width:auto; height:auto; z-index:${(element.name == "Inheritance") ? 2 : 1};`;
            break;
        case elementTypesNames.UMLInitialState:
            let initVec = `
                <g transform="matrix(1.14286,0,0,1.14286,-6.85714,-2.28571)" >
                    <circle cx="16.5" cy="12.5" r="10.5" />
                </g>`;
            divContent = drawElementState(element, initVec);
            cssClass = 'uml-state';
            style = `width:${boxw}px; height:${boxh}px; z-index:1;`;
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
            style = `width:${boxw}px; height:${boxh}px; z-index:1;`;
            break;
        case elementTypesNames.UMLSuperState:
            divContent = drawElementSuperState(element, textWidth, boxw, boxh, linew);
            cssClass = 'uml-Super';
            zLevel = 1;
            break;
        case elementTypesNames.sequenceActor:
            divContent = drawElementSequenceActor(element, textWidth, boxw, boxh, linew, texth);
            mouseEnter = 'mouseEnterSeq(event);';
            zLevel = 1;
            break;
        case elementTypesNames.sequenceObject:
            divContent = drawElementSequenceObject(element, boxw, boxh, linew);
            mouseEnter = 'mouseEnterSeq(event);';
            zLevel = 1;
            break;
        case elementTypesNames.sequenceActivation:
            divContent = drawElementSequenceActivation(element, boxw, boxh, linew);
            break;
        case elementTypesNames.sequenceLoopOrAlt:
            let height = boxh + (element.alternatives.length ?? 0) * zoomfact * 125;
            divContent = drawElementSequenceLoopOrAlt(element, boxw, height, linew, texth);
            zLevel = 0;
            break;
        case 'note': // TODO: Find why this doesnt follow elementTypesNames naming convention
            divContent = drawElementNote(element, boxw, boxh, linew, texth);
            cssClass = 'uml-element';
            break;
    }
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

function splitLengthyLine(s, max) {
    if (s.length <= max) return s;
    return [s.substring(0, max)].concat(splitLengthyLine(s.substring(max), max));
}

function splitFull(e, max) {
    return e.map(line => splitLengthyLine(line, max)).flat()
}

function updateElementHeight(arr, element, height) {
    // Removes the previouse value in IEHeight for the element
    for (let i = 0; i < arr.length; i++) {
        if (element.id == arr[i].id) arr.splice(i, 1);
    }
    // Calculate and store the IEEntity's real height
    arr.push({
        id: element.id,
        height: height
    });
}

function drawDiv(c, style, s) {
    return `<div class='${c}' style='${style}'> ${s} </div>`;
}

function drawSvg(w, h, s, extra = '') {
    return `<svg width='${w}' height='${h}' ${extra}> ${s} </svg>`;
}

function drawRect(w, h, l, e, extra = `fill='${e.fill}'`) {
    return `<rect 
                class='text' x='${l}' y='${l}' 
                width='${w - l * 2}' height='${h - l * 2}' 
                stroke-width='${l}' stroke='${e.stroke}' 
                ${extra} 
            />`;
}

function drawText(x, y, a, t, extra = '') {
    return `<text
                class='text' x='${x}' y='${y}' 
                dominant-baseline='auto' text-anchor='${a}' ${extra}
            > ${t} </text>`;
}

function drawElementEREntity(element, boxw, boxh, linew, texth) {
    const l = linew * 3;
    
    //check if element height and minHeight is 0, if so set both to 50
    if (element.height == 0 && element.minHeight == 0) {
        element.minHeight = 50;
        element.height = element.minHeight;
        // update boxh to 50
        boxh = 50;
    }

    let weak = '';
    if (element.state == "weak") {
        weak = `<rect
                    x='${l}' 
                    y='${l}' 
                    width='${boxw - l * 2}' 
                    height='${boxh - l * 2}'
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}' 
                />`;
    }
    let rect = drawRect(boxw, boxh, linew, element);
    let text = drawText(boxw / 2, boxh / 2 + texth / 3, 'middle', element.name);
    return drawSvg(boxw, boxh, rect + weak + text);
}

function drawElementUMLEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;

    const aText = splitFull(element.attributes, maxCharactersPerLine);
    const fText = splitFull(element.functions, maxCharactersPerLine);

    let aHeight = texth * (aText.length + 1) * lineHeight;
    let fHeight = texth * (fText.length + 1) * lineHeight;
    let totalHeight = aHeight + fHeight - linew * 2 + texth * 2;
    updateElementHeight(UMLHeight, element, totalHeight + boxh);

    // Header
    let height = texth * 2;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headRect + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);

    // Content, Attributes
    const textBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh / 2;
        let text = "";
        for (let i = 0; i < s.length; i++) {
            text += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', s[i]);
        }
        let rect = drawRect(boxw, height, linew, element);
        let contentSvg = drawSvg(boxw, height, rect + text);
        let style = (css == 'uml-footer') ? `height:${height}px` : `height:${height - linew * 2}px`;
        return drawDiv(css, style, contentSvg);
    };

    str += textBox(aText, 'uml-content');
    str += textBox(fText, 'uml-footer');
    return str;
}

function drawElementIEEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;
    const text = splitFull(element.attributes, maxCharactersPerLine);
    const primaryKeys = element.primaryKey;
    // Adds each string from the primaryKey property first in the text array.
    const newPrimaryKeys = splitFull(primaryKeys, maxCharactersPerLine - 3);
    if (primaryKeys) text.unshift(...newPrimaryKeys);

    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight = tHeight - linew * 2 + texth * 2;
    updateElementHeight(IEHeight, element, totalHeight + boxh);

    let height = texth * 2;
    let headRect = drawRect(boxw, height, linew, element);
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headRect + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px`, headSvg);


    // Content, Attributes
    const textBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh;
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

function drawElementSDEntity(element, boxw, boxh, linew, texth) {
    let str = "";
    let cornerRadius = Math.round(20 * zoomfact); //determines the corner radius for the SD states.
    const maxCharactersPerLine = Math.floor(boxw / texth * 1.75);
    const lineHeight = 1.5;

    const text = splitFull(element.attributes, maxCharactersPerLine);

    let tHeight = texth * (text.length + 1) * lineHeight;
    let totalHeight = tHeight - linew * 2 + texth * 2;
    updateElementHeight(SDHeight, element, totalHeight + boxh);

    let height = texth * 2;
    let headPath = `
        <path 
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
            fill='${element.fill}'
        />`;
    let headText = drawText(boxw / 2, texth * lineHeight, 'middle', element.name);
    let headSvg = drawSvg(boxw, height, headPath + headText);
    str += drawDiv('uml-header', `width: ${boxw}; height: ${height - linew * 2}px;`, headSvg);

    const drawBox = (s, css) => {
        let height = texth * (s.length + 1) * lineHeight + boxh;
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
                fill='${element.fill}'
            />`;
        let contentSvg = drawSvg(boxw, height, path + text);
        let style = `height:${height}px`;
        return drawDiv(css, style, contentSvg);
    };

    str += drawBox(text, 'uml-content');
    return str;
}

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

function drawElementERAttr(element, textWidth, boxw, boxh, linew, texth) {
    let content = '';
    let hboxw = boxw / 2;
    let hboxh = boxh / 2;
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
    content += `<text 
                    x='${boxw / 2}' y='${hboxh}' ${extra} 
                    dominant-baseline='middle' text-anchor='middle'
                > ${element.name} </text>`;
    return drawSvg(boxw, boxh, content);
}

function drawElementUMLRelation(element, boxw, boxh, linew) {
    let fill = (element.state == 'overlapping') ? 'black' : 'white';
    let poly = `
        <polygon 
            points='${linew},${boxh - linew} ${boxw / 2},${linew} ${boxw - linew},${boxh - linew}' 
            style='fill:${fill}; stroke:black; stroke-width:${linew};'
        />`;
    return drawSvg(boxw, boxh, poly);
}

function drawElementIERelation(element, boxw, boxh, linew) {
    let content = "";
    content += ` <path d="M 0 ${boxw / 2}
                       A ${boxw / 2} ${boxw / 2} 0 0 1 ${boxw} ${boxw / 2}
                       L 0 ${boxw / 2}
                       Z" 
                    fill="white"
                    stroke="black"
                    stroke-width="${linew}"
                    style="position: absolute; left: ${1000}px; top: ${1000}px;"
                 />`;
    if (element.state != inheritanceStateIE.OVERLAPPING) {
        content += `<line x1="${boxw / 1.6}" y1="${boxw / 2.9}" x2="${boxw / 2.6}" y2="${boxw / 12.7}" stroke='black' />
                    <line x1="${boxw / 2.6}" y1="${boxw / 2.87}" x2="${boxw / 1.6}" y2="${boxw / 12.7}" stroke='black' />`;
    }
    return drawSvg(boxw, boxh, content, `style='margin: ${linew}px; stroke-width:${linew}; overflow: visible;'`);
}

function drawElementState(element, vectorGraphic) {
    const theme = document.getElementById("themeBlack");
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

function drawElementSuperState(element, textWidth, boxw, boxh, linew) {
    element.stroke = (isDarkTheme()) ? color.WHITE : color.BLACK;

    let rectOne = drawRect(boxw, boxh, linew, element, `fill='none' fill-opacity='0' rx='20'`);
    let rectTwo = drawRect(textWidth + 40 * zoomfact, 50 * zoomfact, linew, element, `fill='${element.fill}' fill-opacity="1"`);
    let text = drawText(20 * zoomfact, 30 * zoomfact, 'start', element.name, `font-size='${20 * zoomfact}px'`);
    return drawSvg(boxw, boxh, rectOne + rectTwo + text);
}

function drawElementSequenceActor(element, textWidth, boxw, boxh, linew, texth) {
    let content;
    content = `<path 
                    class="text" 
                    d="M${boxw / 2},${boxw / 4 + linew} V${boxh}"
                    stroke-width='${linew}'
                    stroke='gray'
                    stroke-dasharray='${linew * 3},${linew * 3}'
                    fill='transparent'
                />
                <g>
                    <circle 
                        cx="${(boxw / 2) }" 
                        cy="${(boxw / 8) + linew}" 
                        r="${boxw / 8}px" 
                        fill='${element.fill}' stroke='gray' stroke-width='${linew}'
                    />
                    <path 
                        class="text"
                        d="M${(boxw / 2)},${(boxw / 4) + linew}
                            v${boxw / 6}
                            m${-boxw / 4},0
                            h${boxw / 2}
                            m${-boxw / 4},0
                            v${boxw / 3}
                            l${boxw / 4},${boxw / 4}
                            m${-boxw / 4},${-boxw / 4}
                            l${-boxw / 4},${boxw / 4}"
                        stroke-width='${linew}'
                        stroke='gray'
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
                        class='text' 
                        x='${boxw / 2}' 
                        y='${boxw + texth / 2 + linew * 2}' 
                        dominant-baseline='middle' 
                        text-anchor='middle'
                    > ${element.name} </text>
                </g>`;
    return drawSvg(boxw, boxh, content);
}

function drawElementSequenceObject(element, boxw, boxh, linew) {
    let str = "";
    let content;
    const sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.

    content = `<path 
                    class="text" 
                    d="M ${boxw / 2},${boxw / 4 + linew}
                        V ${boxh}"
                    stroke-width='${linew}'
                    stroke='gray'
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
                        stroke='gray'
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

function drawElementSequenceActivation(element, boxw, boxh, linew) {
    let content;
    const sequenceCornerRadius = Math.round((element.width / 15) * zoomfact); //determines the corner radius for sequence objects.

    content = `<rect 
                    x='${linew}' y='${linew}' 
                    width='${boxw - linew * 2}' height='${boxh - linew * 2}' 
                    rx='${sequenceCornerRadius * 3}' 
                    stroke-width='${linew}' stroke='${element.stroke}' fill='${element.fill}'
                />`;
    return drawSvg(boxw, boxh, content);
}

function drawElementSequenceLoopOrAlt(element, boxw, boxh, linew, texth) {
    let fontColor = (isDarkTheme()) ? color.WHITE : color.GREY;
    element.altOrLoop = (element.alternatives.length > 1) ? "Alt" : "Loop";

    let content = `
        <rect 
            class='text'
            x='${linew}'
            y='${linew}'
            width='${boxw - linew * 2}'
            height='${boxh - linew * 2}'
            stroke-width='${linew}'
            stroke='gray'
            fill='none'
            rx='${7 * zoomfact}'
            fill-opacity="0"
        />`;
    //if it has alternatives, iterate and draw them out one by one, evenly spaced out.
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
    //svg for the small label in top left corner
    content += `<path 
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
    let textOne = drawText(50 * zoomfact + linew, 18.75 * zoomfact + linew, 'middle', element.altOrLoop);
    let textTwo = drawText(linew * 2, 37.5 * zoomfact + linew * 3 + texth / 1.5, 'auto', element.alternatives[0] ?? '', `fill=${fontColor}`);
    return drawSvg(boxw, boxh, content + textOne + textTwo);
}

function drawElementNote(element, boxw, boxh, linew, texth) {
    const maxCharactersPerLine = Math.floor((boxw / texth) * 1.75);
    const lineHeight = 1.5;
    const text = splitFull(element.attributes, maxCharactersPerLine);
    let length = (text.length > 4) ? text.length : 4;
    let totalHeight = boxh + texth * length;
    const maxWidth = (boxw - linew * 2);
    const maxHeight = (boxh + (texth * length) - linew * 2)
    updateElementHeight(NOTEHeight, element, totalHeight);
    element.stroke = (element.fill == color.BLACK) ? color.WHITE : color.BLACK;

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
    for (let i = 0; i < text.length; i++) {
        content += drawText('0.5em', texth * (i + 1) * lineHeight, 'start', text[i]);
    }
    return drawSvg(boxw, boxh + texth * length, content);
}

