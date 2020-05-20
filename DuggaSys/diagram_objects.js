
/************************************************

    THIS FILE HANDLES THE OBJECTS AND
    PATHS USED BY THE DIAGRAM FUNCTIONS

************************************************/

//--------------------------------------------------------------------
// Symbol - stores a diagram symbol
// Function Symbol() handles the CREATE-functions in the diagram.
//--------------------------------------------------------------------
function Symbol(kindOfSymbol) {
    this.kind = kind.symbol;
    this.name = "New Class";
    this.id = globalObjectID++;
    this.targeted = false;
    this.symbolkind = kindOfSymbol;     // Symbol kind (1 UML class, 2 ER Attribute, 3 ER Entity, 4 Lines, 5 ER Relation, 6 Text, 7 UML line)
    this.topLeft = null;                // Top left point index
    this.bottomRight = null;            // Bottom right point index
    this.group = 0;                     // What group this symbol belongs to
    this.isLocked = false;
    this.isLayerLocked = false;
    this.isLockHovered = false;         // Checks if the lock itself is hovered on the symbol
    this.pointsAtSamePosition = false;
    this.isHovered = false;
    this.manualLine = false;    //Used to check if user has manually selected a side for line
    this.manualSide = "Automatic";     //What side line user has manually selected (automatic if none has been chosen)
    
    // Connector arrays - for connecting and sorting relationships between diagram objects
    // They are not used for line, UML line and text objects but still created to prevent errors with other functions
    this.connectorTop = [];
    this.connectorBottom = [];
    this.connectorLeft = [];
    this.connectorRight = [];

    //-----------------------------------------------------------------------------------------------
    // isAnyOfSymbolKinds: Returns true if this symbol is any of the symbolKinds in the passed array.
    //                     Also possible to pass a single symbolKind without an array.
    //-----------------------------------------------------------------------------------------------

    this.isAnyOfSymbolKinds = function(types = []) {
        if(!Array.isArray(types) && Number.isInteger(types)) {
            return this.symbolkind === types;
        }
        return types.some(type => this.symbolkind === type);
    }

    if(!this.isAnyOfSymbolKinds([symbolKind.line, symbolKind.umlLine])) {
        this.centerPoint = null; // Center point index, not used for line and UML line
    }

    switch(this.symbolkind) {
        case symbolKind.uml:
            this.operations = [];
            this.attributes = [];
            this.middleDivider = null;
            this.UMLCustomResize = false;
            this.minWidth = null;
            this.minHeight = null;
            break;
        case symbolKind.line:
            this.cardinality = {value: "", parentPointIndexes: null};
            this.isCardinalityPossible = false;
            break;
        case symbolKind.text:
            this.textLines = [];
            break;
        case symbolKind.umlLine:
            this.cardinality = {value: "", valueUML: ""};
            this.lineDirection = "First";
            this.isRecursiveLine = false;
            this.recursiveLineExtent = 40;  // Distance out from the entity that recursive lines go
            break;
        default:
            break;
    }

    // Variables for UML line breakpoints
    var breakpointStartX = 0;     // X Coordinate for start breakpoint
    var breakpointStartY = 0;     // Y Coordinate for start breakpoint
    var breakpointEndX = 0;       // X Coordinate for end breakpoint
    var breakpointEndY = 0;       // Y Coordinate for end breakpoint
    var middleBreakPointX = 0;    // X Coordinate for mid point between line start and end
    var middleBreakPointY = 0;    // Y Coordinate for mid point between line start and end
    var startLineDirection = "";  // Which side of the class the line starts from
    var endLineDirection = "";    // Which side of the class the line ends in

    // Properties array that stores different kind of objects. Refer to the properties with "properties['fillColor']"
    this.properties = {
        'fillColor': settings.properties.fillColor,    // Change background colors on entities.
        'strokeColor': settings.properties.strokeColor,    // Change standard line color.
        'fontColor': settings.properties.fontColor,        // Change the color of the font.
        'font': settings.properties.font,                  // Set the standard font.
        'lineWidth': settings.properties.lineWidth,        // LineWidth preset is 2.
        'textSize': settings.properties.textSize,          // 14 pixels text size is default.
        'sizeOftext': settings.properties.sizeOftext,      // Used to set size of text.
        'textAlign': settings.properties.textAlign,        // Used to change alignment of free text.
		'key_type': settings.properties.key_type,          // Defult key type for a class.
        'isComment': settings.properties.isComment,        // Used to se if text are comments and if they should be hidden.
        'setLayer': settings.properties.isLayer = writeToLayer            // Used to place Element in a layer
    };

    //--------------------------------------------------------------------
    // setID: Assigns a global id to a symbol
    //--------------------------------------------------------------------
    this.setID = function(id) {
        this.id = id;
        if (globalObjectID <= id) {
            globalObjectID = id + 1;
        }
    }

    //--------------------------------------------------------------------
    // getquadrant: Returns the quadrant for a x,y coordinate in relation to bounding box and box center
    //              Quadrant Layout:
    //                    0|1     Top = 0     Right = 1
    //                   -----    Bottom = 2  Left = 3
    //                    3|2
    //--------------------------------------------------------------------
    this.getquadrant = function (xk, yk) {
        // Read cardinal points
        var c = this.corners();
        var x1 = c.tl.x;
        var y1 = c.tl.y;
        var x2 = c.br.x;
        var y2 = c.br.y;
        var vx = points[this.centerPoint].x;
        var vy = points[this.centerPoint].y;
        // Compute deltas and k
        var dx = x1 - vx;
        var dy = y1 - vy;
        var k = dy / dx;
        if (xk > vx) {
            if (yk > vy) {
                // Bottom right quadrant
                var byk = vy + (k * (xk - vx));
                if (yk > byk) {
                    return 2;
                }
                return 1;
            } else {
                // Top right quadrant
                var byk = vy - (k * (xk - vx));
                if (yk > byk) {
                    return 1;
                }
                return 0;
            }
        } else {
            if (yk > vy) {
                // Bottom left quadrant
                var byk = vy - (k * (xk - vx));
                if (yk > byk) {
                    return 2;
                }
                return 3;
            } else {
                // Top left quadrant
                var byk = (k * (xk - vx)) + vy;
                if (yk > byk) {
                    return 3;
                }
                return 0;
            }
        }
        return -1;
    }

    //--------------------------------------------------------------------
    // quadrants: Iterates over all relation ends and checks if any need to change quadrants
    //--------------------------------------------------------------------
    this.quadrants = function (kind) {
        // Fix right connector box (1)
        var changed = false;
        var i = 0;
        while (i < this.connectorRight.length) {
            var xk = points[this.connectorRight[i].to].x;
            var yk = points[this.connectorRight[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 3) {
                changed = true;
                conn = this.connectorRight.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 0) {
                changed = true;
                conn = this.connectorRight.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else if (bb == 2) {
                changed = true;
                conn = this.connectorRight.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix left connector box (3)
        var i = 0;
        while (i < this.connectorLeft.length) {
            var xk = points[this.connectorLeft[i].to].x;
            var yk = points[this.connectorLeft[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                changed = true;
                conn = this.connectorLeft.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 0) {
                changed = true;
                conn = this.connectorLeft.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else if (bb == 2) {
                changed = true;
                conn = this.connectorLeft.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix top connector box (0)
        var i = 0;
        while (i < this.connectorTop.length) {
            var xk = points[this.connectorTop[i].to].x;
            var yk = points[this.connectorTop[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                changed = true;
                conn = this.connectorTop.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 3) {
                changed = true;
                conn = this.connectorTop.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 2) {
                changed = true;
                conn = this.connectorTop.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix bottom connector box (2)
        var i = 0;
        while (i < this.connectorBottom.length) {
            var xk = points[this.connectorBottom[i].to].x;
            var yk = points[this.connectorBottom[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                changed = true;
                conn = this.connectorBottom.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 3) {
                changed = true;
                conn = this.connectorBottom.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 0) {
                changed = true;
                conn = this.connectorBottom.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fixes lines when thes same entity connects to a relation twice     
        if (kind == symbolKind.erRelation){
            if (this.connectorTop.length == 2){
                changed = true;
                conn = this.connectorTop.splice(0, 2);
                this.connectorLeft.push(conn[1]);
                this.connectorRight.push(conn[0]);
            }
            else if (this.connectorBottom.length == 2){
                changed = true;
                conn = this.connectorBottom.splice(0, 2);
                this.connectorLeft.push(conn[1]);
                this.connectorRight.push(conn[0]);
            }            
            else if (this.connectorLeft.length == 2){
                changed = true;
                conn = this.connectorLeft.splice(0, 2);
                this.connectorTop.push(conn[1]);
                this.connectorBottom.push(conn[0]);
            }
            else if (this.connectorRight.length == 2){
                changed = true;
                conn = this.connectorRight.splice(0, 2);
                this.connectorTop.push(conn[0]);
                this.connectorBottom.push(conn[1]);
            }
        }

        return changed;
    }

    this.setQuadrant = function (kind, quadrant) {
        var connector = 0;
        kind.manualLine = true; 
        //Find correct connector to manipulate
        if(kind.connectorRight.length > 0){
            for(i = 0 ; kind.connectorRight.length > i ; i++){
                if((kind.connectorRight[i].from == this.bottomRight && kind.connectorRight[i].to == this.topLeft) 
                || (kind.connectorRight[i].from == this.topLeft && kind.connectorRight[i].to == this.bottomRight)){
                    connector = i;
                    var xk = points[kind.connectorRight[connector].to].x;
                    var yk = points[kind.connectorRight[connector].to].y;
                    var bb = kind.getquadrant(xk, yk);
                }
            }
        }
        else if(kind.connectorLeft.length > 0){
            for(i = 0 ; kind.connectorLeft.length > i ; i++){
                if((kind.connectorLeft[i].from == this.bottomRight && kind.connectorLeft[i].to == this.topLeft) 
                || (kind.connectorLeft[i].from == this.topLeft && kind.connectorLeft[i].to == this.bottomRight)){
                    connector = i;
                    var xk = points[kind.connectorLeft[connector].to].x;
                    var yk = points[kind.connectorLeft[connector].to].y;
                    var bb = kind.getquadrant(xk, yk);
                }
            }
        }
        else if(kind.connectorTop.length > 0){
            for(i = 0 ; kind.connectorTop.length > i ; i++){
                if((kind.connectorTop[i].from == this.bottomRight && kind.connectorTop[i].to == this.topLeft) 
                || (kind.connectorTop[i].from == this.topLeft && kind.connectorTop[i].to == this.bottomRight)){
                    connector = i;
                    var xk = points[kind.connectorTop[connector].to].x;
                    var yk = points[kind.connectorTop[connector].to].y;
                    var bb = kind.getquadrant(xk, yk);
                }
            }
        }
        else if(kind.connectorBottom.length > 0){
            for(i = 0 ; kind.connectorBottom.length > i ; i++){
                if((kind.connectorBottom[i].from == this.bottomRight && kind.connectorBottom[i].to == this.topLeft) 
                || (kind.connectorBottom[i].from == this.topLeft && kind.connectorBottom[i].to == this.bottomRight)){
                    connector = i;
                    var xk = points[kind.connectorBottom[connector].to].x;
                    var yk = points[kind.connectorBottom[connector].to].y;
                    var bb = kind.getquadrant(xk, yk);
                    console.log(bb);
                }
            }
        }

        //Manually set quadrant if we know line-side is manually set
        if(kind.manualSide == "Top"){
            bb = 0;
        } else if(kind.manualSide == "Right"){
            bb = 1;
        } else if(kind.manualSide == "Bottom"){
            bb = 2;
        } else if(kind.manualSide == "Right"){
            bb = 3;
        }

        //Swap connector to appropriate side
        if(quadrant=="Top"){
            kind.manualSide = "Top";
            if(bb == 1){
                conn = kind.connectorRight.splice(connector, 1);
                kind.connectorTop.push(conn[0]);
            } else if(bb == 2){
                conn = kind.connectorBottom.splice(connector, 1);
                kind.connectorTop.push(conn[0]);
            } else if(bb == 3){
                conn = kind.connectorLeft.splice(connector, 1);
                kind.connectorTop.push(conn[0]);
            }
        } else if(quadrant=="Right"){
            kind.manualSide = "Right";
            if(bb == 0){
                conn = kind.connectorTop.splice(connector, 1);
                kind.connectorRight.push(conn[0]);
            } else if(bb == 2){
                conn = kind.connectorBottom.splice(connector, 1);
                kind.connectorRight.push(conn[0]);
            } else if(bb == 3){
                conn = kind.connectorLeft.splice(connector, 1);
                kind.connectorRight.push(conn[0]);
            }
        } else if(quadrant=="Bottom"){
            kind.manualSide = "Bottom";
            if(bb == 0){
                conn = kind.connectorTop.splice(connector, 1);
                kind.connectorBottom.push(conn[0]);
            } else if(bb == 1){
                conn = kind.connectorRight.splice(connector, 1);
                kind.connectorBottom.push(conn[0]);
            } else if(bb == 3){
                conn = kind.connectorLeft.splice(connector, 1);
                kind.connectorBottom.push(conn[0]);
            } 
        } else if(quadrant=="Left"){
            kind.manualSide = "Left";
            if(bb == 0){
                conn = kind.connectorTop.splice(connector, 1);
                kind.connectorLeft.push(conn[0]);
            } else if(bb == 1){
                conn = kind.connectorRight.splice(connector, 1);
                kind.connectorLeft.push(conn[0]);
            } else if(bb == 2){
                conn = kind.connectorBottom.splice(connector, 1);
                kind.connectorLeft.push(conn[0]);
            } 
        }         
    }

    //--------------------------------------------------------------------
    // adjust: Moves midpoint or other fixed point to geometric center of object again
    //         Restricts resizing for classes
    //--------------------------------------------------------------------
    this.adjust = function () {
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;
        var hw = (points[this.bottomRight].x - x1) * 0.5;
        var hh = (points[this.bottomRight].y - y1) * 0.5;
        var textHeight;
        if (this.isAnyOfSymbolKinds([symbolKind.erAttribute, symbolKind.erEntity])) {
            if(points[this.bottomRight].x - points[this.topLeft].x < entityTemplate.width) {
                // If the width is less than the minimum, push out the
                // point that the user is dragging
                if(sel&&sel.point&&(points[this.topLeft] === sel.point // Checks if topLeft is clicked
                        || points[this.topLeft] === sel.point.x)) { // Checks if bottomLeft is clicked
                    points[this.topLeft].x = x1 = points[this.bottomRight].x - entityTemplate.width;
                }else {
                    points[this.bottomRight].x = x2 = points[this.topLeft].x + entityTemplate.width;
                }
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < entityTemplate.height) {
                // If the height is less than the minimum, push out the
                // point that the user is dragging
                if(sel&&sel.point&&(points[this.topLeft]===sel.point || // Checks if topLeft is clicked
                        points[this.topLeft] === sel.point.y)) { // Checks if topRight is clicked
                    points[this.topLeft].y = y1 = points[this.bottomRight].y - entityTemplate.height;
                }else {
                    points[this.bottomRight].y = y2 = points[this.topLeft].y + entityTemplate.height;
                }
            }
            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;

            //only when object is created: changes position of points so that object is created from center point instead of topleft
            if(this.pointsAtSamePosition) {
                //change all 3 points 0,5 * template width/height to the left/up to move object to mouse position
                for (var i = this.topLeft; i <= this.centerPoint; i++) {
                    //entity and attribute template is the same size so either should work fine
                    points[i].x -= entityTemplate.width * 0.5;
                    points[i].y -= entityTemplate.height * 0.5;
                }
                this.pointsAtSamePosition = false;
            }
        } else if (this.symbolkind == symbolKind.uml) {
            // Place middle divider point in middle between x1 and y1
            points[this.middleDivider].x = x1 + hw;
            points[this.topLeft].y = y1;
            var attrHeight, opHeight;
            if(this.attributes.length > 0) {
                //Height of text + padding on attributes textfield
                if(this.properties['sizeOftext'] == 'Tiny'){
                    textHeight = 14;
                    attrHeight = (this.attributes.length*textHeight) + 30;
                }
                else if (this.properties['sizeOftext'] == 'Small'){
                    textHeight = 20;
                    attrHeight = (this.attributes.length*textHeight) + 45;
                }
                else if (this.properties['sizeOftext'] == 'Medium'){
                    textHeight = 30;
                    attrHeight = (this.attributes.length*textHeight) + 60;
                }
                else if (this.properties['sizeOftext'] == 'Large'){
                    textHeight = 50;
                    attrHeight = (this.attributes.length*textHeight) + 100;
                } 
            }
            if(this.operations.length > 0) {
                //Height of text + padding on operations textfield
                if(this.properties['sizeOftext'] == 'Tiny' || this.properties['sizeOftext'] == 'Small'){
                    textHeight = 14;
                }
                else if (this.properties['sizeOftext'] == 'Small'){
                    textHeight = 20;
                }
                else if (this.properties['sizeOftext'] == 'Medium'){
                    textHeight = 30;
                }
                else if (this.properties['sizeOftext'] == 'Large'){
                    textHeight = 50;
                }
                opHeight = (this.operations.length*textHeight) +25; 
            }
            this.minHeight = attrHeight + opHeight;
            
            //Finding the longest and widest string
            var longestStr = "";
            let widestStr = "";
            let widestValue = 0;
            //Check if any attribute is the longest and widest
            for (var i = 0; i < this.attributes.length; i++) {
                let tempWidth = this.attributes[i].text;
                tempWidth = ctx.measureText(tempWidth).width;
                if (tempWidth > widestValue) {
                    widestStr = this.attributes[i].text;
                    widestValue = ctx.measureText(widestStr).width;
                }
                if (this.attributes[i].text.length > longestStr.length) {
                    longestStr = this.attributes[i].text;
                }
            }
            //check if any operation is the longest and widest
            for (var i = 0; i < this.operations.length; i++) {
                let tempWidth = this.operations[i].text;
                tempWidth = ctx.measureText(tempWidth).width;
                if (tempWidth > widestValue) {
                    widestStr = this.operations[i].text;
                    widestValue = ctx.measureText(widestStr).width;
                }
                if (this.operations[i].text.length > longestStr.length) {
                    longestStr = this.operations[i].text;
                }
            }
            //check if name is the longest
            if(this.name.length > longestStr.length){
                longestStr = this.name;
            }
            //check if name is the widest
            let tempWidth = this.name;
            tempWidth = ctx.measureText(tempWidth).width;
            if (tempWidth > widestValue) {
                widestStr = this.name;
                widestValue = ctx.measureText(widestStr).width;
            }
            if(!this.UMLCustomResize) {
                for(var i = 0; i < this.operations.length; i++) {
                    if(this.operations[i].text.length > longestStr.length)
                        longestStr = this.operations[i].text;
                }
                for(var i = 0; i < this.attributes.length; i++) {
                    if(this.attributes[i].text.length > longestStr.length)
                        longestStr = this.attributes[i].text;
                }
            }
            //Determine size of UML text
            let umlTextSize;
            switch (this.properties['sizeOftext']) {
                case 'Tiny':
                    umlTextSize = 14;
                    break;
                case 'Small':
                    umlTextSize = 20;
                    break;
                case 'Medium':
                    umlTextSize = 30;
                    break;
              case 'Large':
                    umlTextSize = 50;
            }
            ctx.font = umlTextSize + "px Arial";
            this.minWidth = ctx.measureText(widestStr).width + umlTextSize;
            // console.log(this.minWidth);
            if(points[this.bottomRight].y-points[this.topLeft].y < this.minHeight) {
                // If the height is less than the minimum, push out the
                // point that the user is dragging
                if (sel&&sel.point&&(points[this.topLeft] === sel.point // Checks if topLeft is clicked
                        || points[this.topLeft] === sel.point.y)) { // Checks if topRight is clicked
                    points[this.topLeft].y = points[this.bottomRight].y - this.minHeight;
                    this.UMLCustomResize = true; //If the user resizes, the symbol is custom
                }else {
                    points[this.bottomRight].y = points[this.topLeft].y + this.minHeight;
                }
            }
            if(points[this.bottomRight].x-points[this.topLeft].x < this.minWidth) {
                // If the width is less than the minimum, push out the
                // point that the user is dragging
                if (sel&&sel.point&&(points[this.topLeft] === sel.point // Checks if topLeft is clicked
                        || points[this.topLeft] === sel.point.x)) { // Checks if topRight is clicked
                    points[this.topLeft].x = points[this.bottomRight].x - this.minWidth;
                    this.UMLCustomResize = true; //If the user resizes, the symbol is custom
                }else {
                    points[this.bottomRight].x = points[this.topLeft].x + this.minWidth;                
                }
            }
            if(points[this.middleDivider].y + opHeight > points[this.bottomRight].y) {
                points[this.middleDivider].y = points[this.bottomRight].y - opHeight;
            }
            if(points[this.topLeft].y + attrHeight > points[this.middleDivider].y) {
                points[this.middleDivider].y = points[this.topLeft].y + attrHeight;
            }
            //only when object is created: changes position of points so that object is positioned from center point instead of topleft
            if(this.pointsAtSamePosition) {
                //change all 3 points 0,5 * min width/height to the left/up to move object to mouse position
                for (var i = this.topLeft; i <= this.centerPoint; i++) {
                    points[i].x -= this.minWidth * 0.5;
                    points[i].y -= this.minHeight * 0.5;
                }
                this.pointsAtSamePosition = false;
            }
        } else if (this.symbolkind == symbolKind.erRelation) {
            if(points[this.bottomRight].x - points[this.topLeft].x < relationTemplate.width/2) {
                // If the width is less than the minimum, push out the
                // point that the user is dragging
                if(sel&&sel.point&&(points[this.topLeft] === sel.point
                        || points[this.topLeft] === sel.point.x)) {
                    points[this.topLeft].x = x1 = points[this.bottomRight].x - relationTemplate.width/2;
                }else {
                    points[this.bottomRight].x = points[this.topLeft].x + relationTemplate.width/2;
                }
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < relationTemplate.height/2) {
                // If the height is less than the minimum, push out the
                // point that the user is dragging
                if(sel&&sel.point&&(points[this.topLeft] === sel.point
                        || points[this.topLeft] === sel.point.y)) {
                    points[this.topLeft].y = y1 = points[this.bottomRight].y - relationTemplate.height/2;
                }else {
                    points[this.bottomRight].y = points[this.topLeft].y + relationTemplate.height/2;
                }
            }
            // Make the relation keep it's shape by aligning the topLeft and bottomRight diagonally
            // Move either the topLeft or the bottomRight depending on which one
            // the user is dragging
            if(sel&&sel.point&&(points[this.topLeft] === sel.point
                    || points[this.topLeft] === sel.point.y)) {
                points[this.topLeft].y = y1 = points[this.bottomRight].y - (points[this.bottomRight].x - points[this.topLeft].x) * relationTemplate.height/relationTemplate.width;
            }else {
                points[this.bottomRight].y = points[this.topLeft].y + (points[this.bottomRight].x - points[this.topLeft].x) * relationTemplate.height/relationTemplate.width;
            }
            points[this.centerPoint].x = x1 + (points[this.bottomRight].x-points[this.topLeft].x)/2;
            points[this.centerPoint].y = y1 + (points[this.bottomRight].y-points[this.topLeft].y)/2

            //only when object is created: changes position of points so that object is positioned from center point instead of topleft
            if(this.pointsAtSamePosition) {
                //change all 3 points 0,5 * template width/height to the left/up to move object to mouse position
                for (var i = this.topLeft; i <= this.centerPoint; i++) {
                    points[i].x -= relationTemplate.width * 0.5;
                    points[i].y -= relationTemplate.height * 0.5;
                }
                this.pointsAtSamePosition = false;
            }
        } else if (this.symbolkind == symbolKind.text) {
            var fontsize = this.getFontsize();
            ctx.font = "bold " + fontsize + "px " + this.properties['font'];

            var longestStr = "";
            for (var i = 0; i < this.textLines.length; i++) {
                if (this.textLines[i].text.length > longestStr.length) {
                    longestStr = this.textLines[i].text;
                }
            }
            var length = (ctx.measureText(longestStr).width / zoomValue) + 20;
            var height = ((this.textLines.length * fontsize) + fontsize ) / zoomValue ;

            points[this.bottomRight].x = points[this.topLeft].x + length;
            points[this.bottomRight].y = points[this.topLeft].y + height;

            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;
        }
    }
    //--------------------------------------------------------------------
    // resizeUMLToMinimum: Resizes an UML Symbol to the minimum Width and Height values
    //--------------------------------------------------------------------

    this.resizeUMLToMinimum = function() {

        points[this.bottomRight].y = points[this.topLeft].y + this.minHeight;
        points[this.bottomRight].x = points[this.topLeft].x + this.minWidth;

    }


    this.resizeUMLToMinHeight = function() {
        
        points[this.bottomRight].y = points[this.topLeft].y + this.minHeight;

    }

    //--------------------------------------------------------------------
    // sortConnector: Sorts the connector
    //--------------------------------------------------------------------
    this.sortConnector = function (connector, direction, start, end, otherside) {
        if(this.symbolkind != symbolKind.erRelation) {
            var delta = (end - start) / (connector.length + 1);
        } else {
            var delta = (end - start) / 2;
        }

        if (direction == 1) {
            // Vertical connector
            connector.sort(function(a, b) {
                var y1 = points[a.to].y;
                var y2 = points[b.to].y;
                return y1 - y2;
            });
            if(this.symbolkind != symbolKind.erRelation) {
                var ycc = start;
            } else {
                var ycc = start + delta;
            }

            for (var i = 0; i < connector.length; i++) {
                if(this.symbolkind != symbolKind.erRelation) {
                    ycc += delta;
                }
                points[connector[i].from].y = ycc;
                points[connector[i].from].x = otherside;
            }
        } else {
            connector.sort(function(a, b) {
                var x1 = points[a.to].x;
                var x2 = points[b.to].x;
                return x1 - x2;
            });
            if(this.symbolkind != symbolKind.erRelation) {
                var ycc = start;
            } else {
                var ycc = start + delta;
            }
            for (var i = 0; i < connector.length; i++) {
                if(this.symbolkind != symbolKind.erRelation) {
                    ycc += delta;
                }

                points[connector[i].from].y = otherside ;
                points[connector[i].from].x = ycc;
            }
        }
    }

    //--------------------------------------------------------------------
    // sortAllConnectors: Sorts all connectors
    //--------------------------------------------------------------------
    this.sortAllConnectors = function () {
        var c = this.corners();
        var x1 = c.tl.x;
        var y1 = c.tl.y;
        var x2 = c.br.x;
        var y2 = c.br.y;
        this.sortConnector(this.connectorRight, 1, y1, y2, x2);
        this.sortConnector(this.connectorLeft, 1, y1, y2, x1);
        this.sortConnector(this.connectorTop, 2, x1, x2, y1);
        this.sortConnector(this.connectorBottom, 2, x1, x2, y2);
    }

    //-------------------------------------------------------------------
    // hasConnectorPoint: Returns true if any connector contains passed point.
    //-------------------------------------------------------------------
    this.hasConnectorPoint = function(point) {
        return [this.connectorTop, this.connectorRight, this.connectorBottom, this.connectorLeft].some(connector => {
            return connector.some(coordinate => coordinate.to === point || coordinate.from === point);
        });
    }

    //--------------------------------------------------------------------
    // connectorCountFromSymbol: returns the amount of connectors for this symbol
    //--------------------------------------------------------------------
    this.connectorCountFromSymbol = function(symbol) {
        var count = 0;
        var tmp = this.connectorTop.concat(this.connectorBottom, this.connectorLeft, this.connectorRight);

        if ((this.symbolkind == symbolKind.erEntity && symbol.symbolkind == symbolKind.erRelation) || this.symbolkind == symbolKind.erRelation && symbol.symbolkind == symbolKind.erEntity) {
            var symbolTmp = symbol.connectorTop.concat(symbol.connectorBottom, symbol.connectorLeft, symbol.connectorRight);
            for (var i = 0; i < symbolTmp.length; i++) {
                for (var j = 0; j < tmp.length; j++) {
                    if (symbolTmp[i].to == tmp[j].from) count++;
                }
            }
        } else {
            tmp = tmp.filter(c => c.to == symbol.topLeft || c.to == symbol.bottomRight || c.to == symbol.centerPoint || c.to == symbol.middleDivider ||
                c.from == symbol.topLeft || c.from == symbol.bottomRight || c.from == symbol.centerPoint || c.from == symbol.middleDivider);
            count = tmp.length;
        }

        return count;
    }

    //---------------------------------------------------------------------------------
    // hasConnectorFromPoint: Returns true if this symbol has a connector from the point.
    //---------------------------------------------------------------------------------
    this.hasConnectorFromPoint = function(point) {
        return [this.connectorTop, this.connectorRight, this.connectorBottom, this.connectorLeft].some(connector => {
            return connector.some(coordinate => coordinate.from === point);
        });
    }

    //--------------------------------------------------------------------
    // Gets the connectors name from given point
    //--------------------------------------------------------------------
    this.getConnectorNameFromPoint = function(point) {
        for (var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].from == point) {
                return "connectorTop";
            }
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            if(this.connectorRight[i].from == point) {
                return "connectorRight";
            }
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            if(this.connectorBottom[i].from == point) {
                return "connectorBottom";
            }
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            if(this.connectorLeft[i].from == point) {
                return "connectorLeft";
            }
        }
    }

    //------------------------------------------------------------------------------------------------
    // getConnectedFrom: Returns the line points connected from this symbol only (not to other symbols).
    //------------------------------------------------------------------------------------------------
    this.getConnectedFrom = function() {
        return [this.connectorTop, this.connectorRight, this.connectorBottom, this.connectorLeft].reduce((result, connector) => {
            connector.forEach(coordinate => result.push(coordinate.from));
            return result;
        }, []);
    }

    //-----------------------------------------------------------------------
    // getConnectedTo: Returns the line points connected to the other symbol.
    //-----------------------------------------------------------------------
    this.getConnectedTo = function() {
        return [this.connectorTop, this.connectorRight, this.connectorBottom, this.connectorLeft].reduce((result, connector) => {
            connector.forEach(coordinate => result.push(coordinate.to));
            return result;
        }, []);
    }

    //--------------------------------------------------------------------
    // isClicked: Returns true if xk,yk is inside the bounding box of the symbol
    //--------------------------------------------------------------------
    this.isClicked = function(mx, my) {
        return this.checkForHover(mx, my);
    }

    //--------------------------------------------------------------------
    // checkForHover: Returns line distance to segment object e.g. line objects (currently only relationship markers)
    //--------------------------------------------------------------------
    this.checkForHover = function (mx, my) {
        setIsLockHovered(this, mx, my);
        if (this.symbolkind == symbolKind.line) {
            return this.linehover(mx, my);
        } else if(this.symbolkind == symbolKind.erEntity) {
            return this.entityhover(mx, my);
        } else if (this.symbolkind == symbolKind.umlLine) {
            return this.UMLLineHover(mx,my);
        } else {
            return this.entityhover(mx, my);
        }
    }

    //--------------------------------------------------------------------
    // linehover: returns if this line is hovered
    //--------------------------------------------------------------------
    this.linehover = function (mx, my) {
        var tolerance = 5;
        var c = this.corners();
        c.tl.y -= tolerance;
        c.tr.y -= tolerance;
        c.tl.x -= tolerance;
        c.tr.x += tolerance;
        c.bl.x -= tolerance;
        c.bl.y += tolerance;
        c.br.x += tolerance;
        c.br.y += tolerance;

        if (!this.entityhover(mx, my, c)) {
            return false;
        }

        return pointToLineDistance(points[this.topLeft], points[this.bottomRight], mx, my) < 11;
    }

    //--------------------------------------------------------------------
    // UMLLinehover: returns true if this UML line is hovered
    //--------------------------------------------------------------------
    this.UMLLineHover = function (mx, my){

        var c = this.corners();

        //X and Y coordinates for both vectors used for the Lines
        var x1 = Math.trunc(points[this.topLeft].x);
        var y1 = Math.trunc(points[this.topLeft].y);
        
        var x2 = Math.trunc(points[this.bottomRight].x);
        var y2 = Math.trunc(points[this.bottomRight].y);


       // Variables for UML line breakpoints 
       var middleBreakPointX = 0;    // X Coordinate for mid point between line start and end
       var middleBreakPointY = 0;    // Y Coordinate for mid point between line start and end
       var startLineDirection = "";  // Which side of the class the line starts from
       var endLineDirection = "";    // Which side of the class the line ends in
        
        // Calculating the mid point between start and end
        if (x2 > x1) {
            middleBreakPointX = x1 + Math.abs(x2 - x1) / 2;
        } else if (x1 > x2) {
            middleBreakPointX = x2 + Math.abs(x1 - x2) / 2;
        } else {
            middleBreakPointX = x1;
        }

        if (y2 > y1) {
            middleBreakPointY = y1 + Math.abs(y2 - y1) / 2;
        } else if (y1 > y2) {
            middleBreakPointY = y2 + Math.abs(y1 - y2) / 2;
        } else {
            middleBreakPointY = y1;
        }

        // Check all symbols in diagram and see if anyone matches current line's points coordinate
        for (var i = 0; i < diagram.length; i++) {            
            if (diagram[i].symbolkind == symbolKind.uml) { // filter UML class

                var currentSymbol = diagram[i].corners();                

                // Check if line's start point matches any class diagram
                if (x1 >= (Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x) - 1 - getOrigoOffsetX()) / diagram.getZoomValue() &&
                    x1 <= (Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x) + 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                    y1 > Math.trunc(pixelsToCanvas(0, currentSymbol.tl.y).y - getOrigoOffsetY()) / diagram.getZoomValue()&&
                    y1 < Math.trunc(pixelsToCanvas(0, currentSymbol.bl.y).y - getOrigoOffsetY()) / diagram.getZoomValue()) {

                    startLineDirection = "left";

                } else if ( x1 >= (Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x) - 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x1 <= (Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x) + 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            y1 > Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            y1 < Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y - getOrigoOffsetY()) / diagram.getZoomValue()) {

                    startLineDirection = "right";

                } else if ( y1 >= (Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y) - 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            y1 <= (Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y) + 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            x1 > Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x1 < Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x - getOrigoOffsetX()) / diagram.getZoomValue()) {

                    startLineDirection = "up";

                } else if ( y1 >= (Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y) - 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            y1 <= (Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y) + 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            x1 > Math.trunc(pixelsToCanvas(currentSymbol.bl.x).x - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x1 < Math.trunc(pixelsToCanvas(currentSymbol.br.x).x - getOrigoOffsetX()) / diagram.getZoomValue()) {

                    startLineDirection = "down";

                }


                
                // Check if line's end point matches any class diagram
                if (x2 >= (Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x) - 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                    x2 <= (Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x) + 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                    y2 > Math.trunc(pixelsToCanvas(0, currentSymbol.tl.y).y - getOrigoOffsetY()) / diagram.getZoomValue()&&
                    y2 < Math.trunc(pixelsToCanvas(0, currentSymbol.bl.y).y - getOrigoOffsetY()) / diagram.getZoomValue()) {

                    endLineDirection = "left";

                } else if ( x2 >= (Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x) - 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x2 <= (Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x) + 1 - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            y2 > Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            y2 < Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y - getOrigoOffsetY()) / diagram.getZoomValue()) {

                    endLineDirection = "right";

                } else if ( y2 >= (Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y) - 1 - getOrigoOffsetY()) / diagram.getZoomValue() &&
                            y2 <= (Math.trunc(pixelsToCanvas(0, currentSymbol.tr.y).y) + 1 - getOrigoOffsetY()) / diagram.getZoomValue() &&
                            x2 > Math.trunc(pixelsToCanvas(currentSymbol.tl.x).x - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x2 < Math.trunc(pixelsToCanvas(currentSymbol.tr.x).x - getOrigoOffsetX()) / diagram.getZoomValue()) {

                    endLineDirection = "up";

                } else if ( y2 >= (Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y) - 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            y2 <= (Math.trunc(pixelsToCanvas(0, currentSymbol.br.y).y) + 1 - getOrigoOffsetY()) / diagram.getZoomValue()&&
                            x2 > Math.trunc(pixelsToCanvas(currentSymbol.bl.x).x - getOrigoOffsetX()) / diagram.getZoomValue()&&
                            x2 < Math.trunc(pixelsToCanvas(currentSymbol.br.x).x - getOrigoOffsetX()) / diagram.getZoomValue()) {

                    endLineDirection = "down";

                }

            }
        }

        //Tolerance
        var tol = 5;

        //Check if the mouse is hovering the line to its corresponding case
        if( startLineDirection == "right" && endLineDirection == "left") {
            if(y1 < y2) {
                if( x1 < mx && mx < x2 && y1 - tol < my && my < y2 + tol) {
                    if( y1 + tol < my && my < y2 + tol && x1 < mx && mx < middleBreakPointX - tol) { } else {
                        if(y1 - tol < my && my < y2 - tol && middleBreakPointX + tol < mx && mx < x2 ) { } else {
                            return true;
                        }
                    }
                }
            } else {
                if( x1 < mx && mx < x2 && y1 + tol > my && my > y2 - tol) {
                    if(y1 - tol > my && my > y2 - tol && x1 < mx && mx < middleBreakPointX - tol) { } else {
                        if(y2 + tol < my && my < y1 + tol && middleBreakPointX + tol < mx && mx < x2) { } else {
                            return true;
                        }
                    }
                }
            }
        } else if (startLineDirection == "left" && endLineDirection == "right") {
            if(y2 < y1) {
                if( x2 < mx && mx < x1 && y2 - tol < my && my < y1 + tol) {
                    if( y2 + tol < my && my < y1 + tol && x2 < mx && mx < middleBreakPointX - tol) { } else {
                        if(y2 - tol < my && my < y1 - tol && middleBreakPointX + tol < mx && mx < x1 ) { } else {
                            return true;
                        }
                    }
                }
            } else {
                if( x2 < mx && mx < x1 && y2 + tol > my && my > y1 - tol) {
                    if(y2 - tol > my && my > y1 - tol && x2 < mx && mx < middleBreakPointX - tol) { } else {
                        if(y1 + tol < my && my < y2 + tol && middleBreakPointX + tol < mx && mx < x1) { } else {
                            return true;
                        }
                    }
                }
            }
        } else if (startLineDirection == "down" && endLineDirection == "up") {
            if(x1 < x2) {
                if(x1 - tol < mx && mx < x2 + tol && y1 < my && my < y2) {
                    if(x1 + tol < mx && mx < x2 + tol && y1 < my && my < middleBreakPointY - tol) { } else {
                        if(x1 - tol < mx && mx < x2 - tol && middleBreakPointY + tol < my && my < y2) { } else {
                            return true;
                        }
                    }
                }
            } else {
                if(x1 + tol > mx && mx > x2 - tol && y1 < my && my < y2) {
                    if(x1 - tol > mx && mx > x2 - tol && y1 < my && my < middleBreakPointY - tol) { } else {
                        if(x1 + tol > mx && mx > x2 + tol && middleBreakPointY + tol < my && my < y2) { } else {
                            return true;
                        }
                    }
                }
            }
        } else if (startLineDirection == "up" && endLineDirection == "down") {
            if(x1 < x2) {
                if(x1 - tol < mx && mx < x2 + tol && y2 < my && my < y1) {
                    if(x1 - tol < mx && mx < x2 - tol && y2 < my && my < middleBreakPointY - tol) { } else {
                        if(x1 + tol < mx && mx < x2 + tol && middleBreakPointY + tol < my && my < y1) { } else {
                            return true;
                        }
                    }
                }
            } else {
                if(x2 - tol < mx && mx < x1 + tol && y2 < my && my < y1) {
                    if(x2 + tol < mx && mx < x1 + tol && y2 < my && my < middleBreakPointY - tol) { } else {
                        if(x2 - tol < mx && mx < x1 - tol && middleBreakPointY + tol < my && my < y1) { } else {
                            return true;
                        }
                    }
                }
            }
        } else if (startLineDirection == "up" && endLineDirection == "left") {
            if( x1 - tol < mx && mx < x2 && y2 - tol < my && my < y1) {
                if( x1 + tol < mx && mx < x2 && y2 + tol < my && my < y1) { } else {
                    return true;
                }
            }
        } else if (startLineDirection == "up" && endLineDirection == "right") {
            if( x2 < mx && mx < x1 + tol && y2 - tol < my && my < y1) {
                if( x2 < mx && mx < x1 - tol && y2 + tol < my && my < y1) { } else {
                    return true;
                }
            }
        } else if (startLineDirection == "left" && endLineDirection == "up") {
            if( x2 - tol < mx && mx < x1 && y1 - tol < my && my < y2) {
                if( x2 + tol < mx && mx < x1 && y1 + tol < my && my < y2) { } else {
                    return true;
                }
            }
        } else if (startLineDirection == "right" && endLineDirection == "up") {
            if( x1 < mx && mx < x2 + tol && y1 - tol < my && my < y2) {
                if( x1 < mx && mx < x2 - tol && y1 + tol < my && my < y2) { } else {
                    return true;
                }
            }
        }
        
        //handles recursive lines
        if(this.isRecursiveLine){
            return this.entityhover(mx, my);
        }

        //If nothing applies, return false
        return false;
    }

    //--------------------------------------------------------------------
    // entityhover: returns if this entity, attribute or relation is hovered
    //--------------------------------------------------------------------
    this.entityhover = function(mx, my, c) {
        if (!c) {
            c = this.corners();
        }
        // Handle recursive lines
        if (this.isLineType() && this.isRecursiveLine) {
            if (c.tl.x == c.br.x) {
                if (this.recursiveLineExtent > 0) {
                    c.tr.x += this.recursiveLineExtent;
                    c.br.x += this.recursiveLineExtent;
                }else {
                    c.tl.x += this.recursiveLineExtent;
                    c.bl.x += this.recursiveLineExtent;
                }
            }else if (c.tl.y == c.br.y) {
                if (this.recursiveLineExtent > 0) {
                    c.bl.y += this.recursiveLineExtent;
                    c.br.y += this.recursiveLineExtent;
                }else {
                    c.tl.y += this.recursiveLineExtent;
                    c.tr.y += this.recursiveLineExtent;
                }
            }
        }
        // We have correct points in the four corners of a square.
        if (mx > c.tl.x && mx < c.tr.x) {
            if (my > c.tl.y && my < c.bl.y) {
                return true;
            }
        }
        return false;
    }

    //-------------------------------------------------------------------------------
    // corners: init four points, the four corners based on the two cornerpoints in the symbol.
    //-------------------------------------------------------------------------------
    this.corners = function() {
        var p1 = points[this.topLeft];
        var p2 = points[this.bottomRight];
        if(p1.x < p2.x) {
            if(p1.y < p2.y) {
                // We are in the topleft
                tl = {x:p1.x, y:p1.y};
                br = {x:p2.x, y:p2.y};
                tr = {x:br.x, y:tl.y};
                bl = {x:tl.x, y:br.y};
            }else {
                // We are in the bottomleft
                tr = {x:p2.x, y:p2.y};
                bl = {x:p1.x, y:p1.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }
        } else {
            if(p1.y < p2.y) {
                // We are in the topright
                tr = {x:p1.x, y:p1.y};
                bl = {x:p2.x, y:p2.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }else {
                // We are in the bottomright
                br = {x:p1.x, y:p1.y};
                tl = {x:p2.x, y:p2.y};
                bl = {x:tl.x, y:br.y};
                tr = {x:br.x, y:tl.y};
            }
        }
        return {
            tl: tl,
            tr: tr,
            br: br,
            bl: bl
        };
    }

    //-------------------------------------------------------------------------------
    // getCorners: init four points, the four corners based on the two cornerpoints in the symbol.
    //-------------------------------------------------------------------------------
    function getCorners(p1, p2) {
    	if(p1.x < p2.x) {
            if(p1.y < p2.y) {
                //we are in the topleft
                tl = {x:p1.x, y:p1.y};
                br = {x:p2.x, y:p2.y};
                tr = {x:br.x, y:tl.y};
                bl = {x:tl.x, y:br.y};
            }else {
                //we are in the bottomleft
                tr = {x:p2.x, y:p2.y};
                bl = {x:p1.x, y:p1.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }
        }else {
            if(p1.y < p2.y) {
                //we are in the topright
                tr = {x:p1.x, y:p1.y};
                bl = {x:p2.x, y:p2.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }else {
                //we are in the bottomright
                br = {x:p1.x, y:p1.y};
                tl = {x:p2.x, y:p2.y};
                bl = {x:tl.x, y:br.y};
                tr = {x:br.x, y:tl.y};
            }
        }
        return {
            tl: tl,
            tr: tr,
            br: br,
            bl: bl
        };
    }

    //--------------------------------------------------------------------
    // move: Updates all points referenced by symbol
    //--------------------------------------------------------------------
    this.move = function (movex, movey) {
        if(this.properties["isComment"] && hideComment) return; //Don't move hidden comments
        if (this.isLocked) return;
        if (this.symbolkind != symbolKind.line) {
            points[this.topLeft].x += movex;
            points[this.topLeft].y += movey;
            points[this.bottomRight].x += movex;
            points[this.bottomRight].y += movey;
            if (this.symbolkind == symbolKind.uml) {
                points[this.middleDivider].x += movex;
                points[this.middleDivider].y += movey;
            } else if (this.isAnyOfSymbolKinds([symbolKind.erAttribute, symbolKind.erRelation, symbolKind.erEntity, symbolKind.text])) {
                points[this.centerPoint].x += movex;
                points[this.centerPoint].y += movey;
            }
        }
    }

    //--------------------------------------------------------------------
    // erase: attempts to erase object completely from canvas
    //--------------------------------------------------------------------
    this.erase = function () {
        this.movePoints();
        this.emptyConnectors();
    }

    //--------------------------------------------------------------------
    // emptyConnectors: Empties every connector of the object
    //--------------------------------------------------------------------
    this.emptyConnectors = function () {
        for (var i = 0; i < this.connectorTop.length; i++) {
            points[this.connectorTop[i].from] = "";
            this.connectorTop.splice(i, 1);
            i--;
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            points[this.connectorRight[i].from] = "";
            this.connectorRight.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            points[this.connectorBottom[i].from] = "";
            this.connectorBottom.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            points[this.connectorLeft[i].from] = "";
            this.connectorLeft.splice(i, 1);
            i--;
        }
    }

    //--------------------------------------------------------------------
    // movePoints: Moves all relevant points, within the object, off the canvas.
    //             IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.movePoints = function () {
        if(this.isLineType()) return;
        points[this.topLeft] = waldoPoint;
        points[this.bottomRight] = waldoPoint;
        points[this.centerPoint] = waldoPoint;
        if(this.symbolkind === symbolKind.uml) {
            points[this.middleDivider] = waldoPoint;
        }
    }

    //--------------------------------------------------------------------
    // removePointFromConnector: Removes a point from this symbols connector
    //                           Used when lines are removed from an object
    //--------------------------------------------------------------------
    this.removePointFromConnector = function(point, line) {
        var broken = false;
        for(var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point) {
                //Extra check for attributes since many lines can share the same value (due to how lines many lines can connect to the same attributes centerpoint)
                if(this.symbolkind == symbolKind.erAttribute){
                    if((this.connectorTop[i].to == line.bottomRight && this.connectorTop[i].from == line.topLeft) || (this.connectorTop[i].from == line.bottomRight && this.connectorTop[i].to == line.topLeft)){
                        this.connectorTop.splice(i,1);
                        broken = true;
                        break;
                    }
                }
                else{
                    this.connectorTop.splice(i,1);
                    broken = true;
                    break; 
                }
            }
        }
        if(!broken) {
            for(var i = 0; i < this.connectorBottom.length; i++) {
                if(this.connectorBottom[i].to == point || this.connectorBottom[i].from == point) {
                    this.connectorBottom.splice(i,1);
                    broken = true;
                    break;
                }
            }
            for(var i = 0; i < this.connectorRight.length; i++) {
                if(this.connectorRight[i].to == point || this.connectorRight[i].from == point) {
                    this.connectorRight.splice(i,1);
                    broken = true;
                    break;
                }
            }
            for(var i = 0; i < this.connectorLeft.length; i++) {
                if(this.connectorLeft[i].to == point || this.connectorLeft[i].from == point) {
                    this.connectorLeft.splice(i,1);
                    broken = true;
                    break;
                }
            }
        }
    }

    //-----------------------------------------------------------------------
    // getPoints: Adds each corner point to an array and returns the array
    //-----------------------------------------------------------------------

    this.getPoints = function() {
        return [this.topLeft, this.bottomRight, this.middleDivider, this.centerPoint].reduce((result, pointIndex) => {
            if(typeof pointIndex !== "undefined" && pointIndex !== null) {
                result.push(pointIndex);
            }
            return result;
        }, []);
    }

    //-------------------------------------------------------------------------------------
    // getConnectedLinePoints: Adds all connected line points to an array and returns the array.
    //-------------------------------------------------------------------------------------

    this.getConnectedLinePoints = function() {
        const points = [this.connectorTop, this.connectorRight, this.connectorBottom, this.connectorLeft].reduce((set, connector) => {
            connector.forEach(coordinate => {
                set.add(coordinate.to);
                set.add(coordinate.from);
            });
            return set;
        }, new Set());
        return [...points];
    }

    //-----------------------------------------------------------------------
    // isLineType: Checks if this is a line (ER or UML)
    //-----------------------------------------------------------------------
    this.isLineType = function() {
        return this.symbolkind === symbolKind.line ||
                this.symbolkind === symbolKind.umlLine;
    }

    //----------------------------------------------------------------
    // getConnectedObjects: Returns an array with the objects that a specific line is connected to,
    //                      function is used on line objects
    //----------------------------------------------------------------
    this.getConnectedObjects = function () {
        const types = [symbolKind.erAttribute, symbolKind.erEntity, symbolKind.erRelation, symbolKind.uml];
        const objects = diagram.getObjectsByTypes(types);

        return objects.reduce((result, object) => {
            const connectedLines = object.getConnectedLines();
            connectedLines.forEach(line => {
                if(Object.is(this, line)) {
                    result.push(object);
                }
            });
            return result;
        }, []);
    }

    //------------------------------------------------------------------
    // getConnectedLines: Returns all the lines connected to the object.
    //------------------------------------------------------------------
    this.getConnectedLines = function() {
        const points = this.getConnectedFrom();
        const lines = diagram.getObjectsByTypes([symbolKind.line, symbolKind.umlLine]);

        const connectedLines = lines.reduce((set, line) => {
            points.forEach(point => {
                if(line.topLeft === point || line.bottomRight === point) {
                    set.add(line);
                }
            });
            return set;
        }, new Set());

        return [...connectedLines];
    }

    //--------------------------------------------------------------------
    // draw: Redraws graphics, invokes the relevant draw method depending on symbolkind
    //--------------------------------------------------------------------
    //       beginpath - moveto - lineto
    //
    //       To make a dashed line, draw with:
    //       ctx.setLineDash(segments);
    //--------------------------------------------------------------------
    this.draw = function () {
        if(showLayer.indexOf(this.properties.setLayer) == -1){
            this.isLayerLocked = true;
            return;
        }
        this.isLayerLocked = false;
        ctx.lineWidth = this.properties['lineWidth'] * 2 * diagram.getZoomValue();
        this.properties['textSize'] = this.getFontsize();
        ctx.strokeStyle = (this.targeted || this.isHovered) ? "#F82" : this.properties['strokeColor'];

        var x1 = pixelsToCanvas(points[this.topLeft].x).x;
        var y1 = pixelsToCanvas(0, points[this.topLeft].y).y;
        var x2 = pixelsToCanvas(points[this.bottomRight].x).x;
        var y2 = pixelsToCanvas(0, points[this.bottomRight].y).y;

        if (this.isLocked) {
            drawLock(this);
            if (this.isHovered || this.isLockHovered) {
                drawLockedTooltip(this);
            }
        }
        if (this.group != 0){
            drawGroup(this);
        }

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + parseInt(this.properties['textSize']) + "px " + this.properties['font'];

        if (this.symbolkind == symbolKind.uml) {
            this.drawUML(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.erAttribute) {
            this.drawERAttribute(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.erEntity) {
            this.drawEntity(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.line) {
            this.drawLine(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.erRelation) {
            this.drawRelation(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.text) {
            this.drawText(x1, y1, x2, y2);
        }

        else if (this.symbolkind == symbolKind.umlLine) {
            this.drawUMLLine(x1, y1, x2, y2);
        }

        ctx.restore();
        ctx.setLineDash([]);

        //Highlighting points when targeted, makes it easier to resize
        if (this.targeted && this.symbolkind != symbolKind.text) {
            ctx.beginPath();
            ctx.arc(x1,y1,5 * diagram.getZoomValue(),0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2,y2,5 * diagram.getZoomValue(),0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();
            if (this.symbolkind != symbolKind.line && this.symbolkind != symbolKind.umlLine) {
                ctx.beginPath();
                ctx.arc(x1,y2,5 * diagram.getZoomValue(),0,2*Math.PI,false);
                ctx.fillStyle = '#F82';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x2,y1,5 * diagram.getZoomValue(),0,2*Math.PI,false);
                ctx.fillStyle = '#F82';
                ctx.fill();
                //Draw highlighted point to UML-class middledivider
                if(this.symbolkind == symbolKind.uml){
                    var midy = pixelsToCanvas(0, points[this.middleDivider].y).y;
                    var midx = pixelsToCanvas(points[this.middleDivider].x, 0).x;
                    ctx.beginPath();
                    ctx.arc(midx, midy ,5 * diagram.getZoomValue(),0,2*Math.PI,false);
                    ctx.fillStyle = '#F82';
                    ctx.fill();
                }
            }
        }
    }

    //---------------------------------------------------------
    // Functions used to draw objects
    //---------------------------------------------------------

    //---------------------------------------------------------------
    // drawUML: Draws an uml symbol
    //---------------------------------------------------------------
    this.drawUML = function(x1, y1, x2, y2) {
        var midy = pixelsToCanvas(0, points[this.middleDivider].y).y;
        this.properties['strokeColor'] = '#000000';
        this.properties['fontColor'] = '#000000';
        this.properties['lineWidth'] = 2;
        ctx.font = "bold " + parseInt(this.properties['textSize']) + "px Arial";

        // Clear Class Box
        ctx.fillStyle = '#ffffff';
		ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();
		
		// Set border to redish if crossing line
		if(!checkSamePage(x1,y1,x2,y2)){
			ctx.strokeStyle = '#DC143C';
		}else{
			ctx.strokeStyle = this.properties['strokeColor'];
		}

        // Box
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        // Top Divider
        ctx.moveTo(x1, y1 + (this.properties['textSize'] * 1.5));
        ctx.lineTo(x2, y1 + (this.properties['textSize'] * 1.5));
        // Middie Divider
        ctx.moveTo(x1, midy);
        ctx.lineTo(x2, midy);
        ctx.fill();
        ctx.stroke();
		ctx.clip();
		
		// Write Class Name
        if(!checkSamePage(x1,y1,x2,y2)){
			ctx.fillStyle = '#DC143C';
		}else{
			ctx.fillStyle = this.properties['fontColor'];
		}
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if(ctx.measureText(this.name).width >= (x2-x1) - 2) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 2 , y1 + (0.85 * this.properties['textSize']));
        }else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.properties['textSize']));
        }
        if (this.properties['key_type'] == 'Primary key') {
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.properties['textSize']));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.properties['textSize']));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + linelength, y1 + (0.85 * this.properties['textSize']) + 10);
            ctx.strokeStyle = this.properties['strokeColor'];
            ctx.stroke();
        }
        // Change Alignment and Font
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.font = parseInt(this.properties['textSize']) + "px Arial";

        for (var i = 0; i < this.attributes.length; i++) {
            ctx.fillText(this.attributes[i].text, x1 + (this.properties['textSize'] * 0.3), y1 + (this.properties['textSize'] * 1.7) + (this.properties['textSize'] * i));
        }

        for (var i = 0; i < this.operations.length; i++) {
            ctx.fillText(this.operations[i].text, x1 + (this.properties['textSize'] * 0.3), midy + (this.properties['textSize'] * 0.2) + (this.properties['textSize'] * i));
        }
    }

    this.drawERAttribute = function(x1, y1, x2, y2) {
		//if on two or more pages turn redish
        if(!checkSamePage(x1,y1,x2,y2)){
			ctx.strokeStyle = '#DC143C';
		}else{
			ctx.strokeStyle = this.properties['strokeColor'];
		}

        ctx.fillStyle = this.properties['fillColor'];
        // Drawing a multivalue attribute
        if (this.properties['key_type'] == 'Multivalue') {
            drawOval(x1 - 7 * diagram.getZoomValue(), y1 - 7 * diagram.getZoomValue(), x2 + 7 * diagram.getZoomValue(), y2 + 7 * diagram.getZoomValue());
            ctx.stroke();
            drawOval(x1, y1, x2, y2);
            // Makes sure that the stroke color can not be white
            if (this.properties['strokeColor'] == '#ffffff') {
                this.properties['strokeColor'] = '#000000';
            }
            // Make sure that the font color is always able to be seen.
            // Symbol and Font color should therefore not be the same
            if (this.properties['fontColor'] == this.properties['fillColor']) {
                if (this.properties['fillColor'] == '#000000') {
                    this.properties['fontColor'] = '#ffffff';
                } else {
                    this.properties['fontColor'] = '#000000';
                }
            }
        // Drawing a normal attribute
        } else {
            drawOval(x1, y1, x2, y2);
            ctx.fill();
            // Make sure that the font color is always able to be seen.
            // Symbol and Font color should therefore not be the same
            if (this.properties['fontColor'] == this.properties['fillColor']) {
                if (this.properties['fillColor'] == '#000000') {
                    this.properties['fontColor'] = '#ffffff';
                } else {
                    this.properties['fontColor'] = '#000000';
                }
            }
        }
        ctx.clip();

        //drawing an derived attribute
        if (this.properties['key_type'] == 'Derive') {

            ctx.setLineDash([5, 4]);
        }
        else if (this.properties['key_type'] == 'Primary key' || this.properties['key_type'] == 'Partial key') {
            ctx.stroke();
            this.properties['key_type'] == 'Partial key' ? ctx.setLineDash([5, 4]) : ctx.setLineDash([]);
            var linelength = ctx.measureText(this.name).width;
            var linePosY = 0;
            switch (this.properties['sizeOftext']) {
                case 'Tiny':
                    linePosY = 10;
                     break;
                case 'Small':
                    linePosY = 12;
                    break;
                case 'Medium':
                    linePosY = 15;
                    break;
                case 'Large':
                    linePosY = 22; 
            }
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5) - (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + linePosY * zoomValue);
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + linePosY * zoomValue);
            ctx.strokeStyle = this.properties['strokeColor'];

        }
        ctx.fill();
        ctx.stroke();
		ctx.setLineDash([]);
		//if not on one page draw in redish
        if(!checkSamePage(x1,y1,x2,y2)){
			ctx.fillStyle = '#DC143C';
		}else{
			ctx.fillStyle = this.properties['fontColor'];
		}

        if(ctx.measureText(this.name).width > (x2-x1) - 4) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 4 , (y1 + ((y2 - y1) * 0.5)));
        } else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
    }

    // This function is used in the drawEntity function and is run when ER entities are not in a weak state.
    function removeForcedAttributeFromLinesIfEntityIsNotWeak(x1, y1, x2, y2) {
        var relationMidPoints = [];

        // Map input coordinates to canvas origo offset
        x1 = canvasToPixels(x1).x;
        x2 = canvasToPixels(x2).x;
        y1 = canvasToPixels(0, y1).y;
        y2 = canvasToPixels(0, y2).y;

        // Need to find the connected entities in order to change lines between relations and entities to normal.
        for(let i = 0; i < diagram.length; i++) {
            if (diagram[i] != this && diagram[i].kind == kind.symbol) {
                // Getting each (top) coordinate of the object
                dtlx = diagram[i].corners().tl.x;
                dtly = diagram[i].corners().tl.y;
                dtrx = diagram[i].corners().tr.x;
                dtry = diagram[i].corners().tr.y;
                // Getting each (bottom) coordinate of the object
                dbrx = diagram[i].corners().br.x;
                dbry = diagram[i].corners().br.y;
                dblx = diagram[i].corners().bl.x;
                dbly = diagram[i].corners().bl.y;

                // Stores the midpoints for each corner of the relation in an array
                if (diagram[i].isAnyOfSymbolKinds(symbolKind.erRelation)) {
                    var relationMiddleX = ((dtrx - dtlx) / 2)+ dtlx;
                    var relationMiddleY = ((dbly - dtly) / 2) + dtly;
                    relationMidPoints.push(relationMiddleX, relationMiddleY);
                }
                // Setting the line types to normal if they are forced and the connected entity is strong.
                if (diagram[i].isAnyOfSymbolKinds(symbolKind.line) && diagram[i].properties['key_type'] != 'Normal') {

                    // Looping through the midpoints for relation entities.
                    for (let j = 0; j < relationMidPoints.length; j++) {
                        // checking if the line is connected to any of the midpoints.
                        if (dtlx == relationMidPoints[j] || dtrx == relationMidPoints[j] || dtly == relationMidPoints[j] || dbly == relationMidPoints[j]) {
                            // Making sure that only the correct lines are set to normal
                            if (x1 == dtrx || x2 == dtlx && dtly < y1 && dbly > y2) {
                                diagram[i].properties['key_type'] = 'Normal';
                            } else if (x2 == dtlx || x1 == dtrx && dtry < y1 && dbry > y2) {
                                diagram[i].properties['key_type'] = 'Normal';
                            }  else if (y2 == dtly || y2 == dtry && dtlx < x1 && dtrx > x2) {
                                diagram[i].properties['key_type'] = 'Normal';
                            } else if (y1 == dbly || y1 == dbry && dblx < x1 && dbrx > x2) {
                                diagram[i].properties['key_type'] = 'Normal';
                            }
                        }
                    }
                }
            }
        }
    }

    // This function is run when an entity is set to weak. Sets the lines to be forced if possible.
    function setLinesConnectedToRelationsToForced(x1, y1, x2, y2) {
        var relationMidPoints = [];
        var relationMidYPoints = [];
        var relationMidXPoints = [];
        var attributeMidPoint = [];

        // Map input coordinates to canvas origo offset
        x1 = canvasToPixels(x1).x;
        x2 = canvasToPixels(x2).x;
        y1 = canvasToPixels(0, y1).y;
        y2 = canvasToPixels(0, y2).y;

        // Need to find the connected entities in order to change lines between relations and entities to forced.
        for(let i = 0; i < diagram.length; i++) {
            if (diagram[i] != this && diagram[i].kind == kind.symbol) {
                // Getting each (top) coordinate of the object
                dtlx = diagram[i].corners().tl.x;
                dtly = diagram[i].corners().tl.y;
                dtrx = diagram[i].corners().tr.x;
                dtry = diagram[i].corners().tr.y;
                // Getting each (bottom) coordinate of the object
                dbrx = diagram[i].corners().br.x;
                dbry = diagram[i].corners().br.y;
                dblx = diagram[i].corners().bl.x;
                dbly = diagram[i].corners().bl.y;

                // Stores the midpoints for the relations in an array.
                if (diagram[i].isAnyOfSymbolKinds(symbolKind.erRelation)) {
                    var relationMiddleX = ((dtrx - dtlx) / 2) + dtlx;
                    var relationMiddleY = ((dbly - dtly) / 2) + dtly;
                    relationMidPoints.push(relationMiddleX, relationMiddleY);
                    relationMidXPoints.push(relationMiddleX, dtly, dbly);
                    relationMidYPoints.push(relationMiddleY, dtlx, dtrx);
                }

                // Stores the midpoints for the attributes in an array
                if (diagram[i].isAnyOfSymbolKinds(symbolKind.erAttribute)) {
                    var attributeMiddleX = ((dtrx - dtlx) / 2) + dtlx;
                    var attributeMiddleY = ((dbly - dtly) / 2) + dtly;
                    attributeMidPoint.push(attributeMiddleX, attributeMiddleY);
                }

                // Setting the line types to forced if they are normal and the connected entity is weak.
                if (diagram[i].isAnyOfSymbolKinds(symbolKind.line) && diagram[i].properties['key_type'] != 'Forced') {
                    // Looping through the midpoints (top and bot) for relations.
                    for (let j = 0; j < relationMidXPoints.length; j++) {
                        for (let c = 0; c < relationMidXPoints.length; c++) {
                            // Checking if the line X coordinate is the same as the relations middle X coordinate
                            if (dtlx == relationMidXPoints[j] || dtrx == relationMidXPoints[j]) {
                                // Checking if the line Y coordinate is the same as the coordinate for the relation middle top Y or bottom Y
                                if (dtly == relationMidXPoints[c] || dbly == relationMidXPoints[c]) {
                                    // Going through the array even if empty since it otherwise requires that an attribute is connected to the entity in all cases

                                    for (let y = 0; y <= attributeMidPoint.length; y++) {
                                        for (let k = 0; k <= attributeMidPoint.length; k++) {
                                            // Making sure that lines between relations and attributes aren't set to forced.
                                            if ((dtlx == attributeMidPoint[y] || dtrx == attributeMidPoint[y]) || (dtly == attributeMidPoint[k] || dbly == attributeMidPoint[k])) {
                                                diagram[i].properties['key_type'] = 'Normal';
                                            } else {
                                                // Checking the current object coordinates against the line coordinates.
                                                if (x1 == dtrx || x2 == dtlx && dtly < y1 && dbly > y2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (x2 == dtlx || x1 == dtrx && dtry < y1 && dbry > y2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (y2 == dtly || y2 == dtry && dtlx < x1 && dtrx > x2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (y1 == dbly || y1 == dbry && dblx < x1 && dbrx > x2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // Looping through the midpoints (left and right) for relations.
                    for (let j = 0; j < relationMidYPoints.length; j++) {
                        for (let c = 0; c < relationMidYPoints.length; c++) {
                            // checking if the line Y coordinate is the same as the relations middle Y coordinate.
                            if (dtly == relationMidYPoints[j] || dbly == relationMidYPoints[j]) {
                                if (dtlx == relationMidYPoints[c] || dtrx == relationMidYPoints[c]) {
                                    // Going through the array even if empty since it otherwise requires that an attribute is connected to the entity in all cases
                                    for (let y = 0; y <= attributeMidPoint.length; y++) {
                                        for (let k = 0; k <= attributeMidPoint.length; k++) {
                                            // Making sure that lines between relations and attributes aren't set to forced.
                                            if ((dtlx == attributeMidPoint[y] || dtrx == attributeMidPoint[y]) || (dtly == attributeMidPoint[k] || dbly == attributeMidPoint[k])) {
                                                diagram[i].properties['key_type'] = 'Normal';
                                            } else {
                                                // Checking the current object coordinates against the line coordinates.
                                                if (x1 == dtrx || x2 == dtlx && dtly < y1 && dbly > y2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (x2 == dtlx || x1 == dtrx && dtry < y1 && dbry > y2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (y2 == dtly || y2 == dtry && dtlx < x1 && dtrx > x2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                } else if (y1 == dbly || y1 == dbry && dblx < x1 && dbrx > x2) {
                                                    diagram[i].properties['key_type'] = 'Forced';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Used inside drawEntity when this.properties['key_type'] is set to Weak.
    this.drawWeakEntity = function(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1 - 5 * diagram.getZoomValue(), y1 - 5 * diagram.getZoomValue());
        ctx.lineTo(x2 + 5 * diagram.getZoomValue(), y1 - 5 * diagram.getZoomValue());
        ctx.lineTo(x2 + 5 * diagram.getZoomValue(), y2 + 5 * diagram.getZoomValue());
        ctx.lineTo(x1 - 5 * diagram.getZoomValue(), y2 + 5 * diagram.getZoomValue());
        ctx.lineTo(x1 - 5 * diagram.getZoomValue(), y1 - 5 * diagram.getZoomValue());
        ctx.closePath();
        ctx.lineWidth = (this.properties['lineWidth'] * 1.5) * diagram.getZoomValue();
        ctx.stroke();

        // Makes sure that the stroke color can not be white
        if (this.properties['strokeColor'] == '#ffffff') {
            this.properties['strokeColor'] = '#000000';
        }
        
        
    }

    this.drawEntity = function(x1, y1, x2, y2) {
		ctx.fillStyle = this.properties['fillColor'];
		
        if (this.properties['key_type'] == "Weak") {
            this.drawWeakEntity(x1, y1, x2, y2);
            setLinesConnectedToRelationsToForced(x1, y1, x2, y2);
        } else {
            removeForcedAttributeFromLinesIfEntityIsNotWeak(x1, y1, x2, y2);
		}

		if(!checkSamePage(x1,y1,x2,y2)){
			ctx.strokeStyle = '#DC143C';
		}else{
			ctx.strokeStyle = this.properties['strokeColor'];
		}

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
		ctx.closePath();	
		ctx.fill();

		// Make sure that the font color is always able to be seen.
        // Symbol and Font color should therefore not be the same
        if (this.properties['fontColor'] == this.properties['fillColor']) {
            if (this.properties['fillColor'] == '#000000') {
                this.properties['fontColor'] = '#ffffff';
            } else {
                this.properties['fontColor'] = '#000000';
            }
		}

        ctx.clip();
        ctx.stroke();
		if(!checkSamePage(x1,y1,x2,y2)){
			ctx.fillStyle = '#DC143C';
		}else{
			ctx.fillStyle = this.properties['fontColor'];
		}

        if(ctx.measureText(this.name).width >= (x2-x1) - 5) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 3 , (y1 + ((y2 - y1) * 0.5)));
        }else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
        ctx.font = parseInt(this.properties['textSize']) + "px " + this.properties['font'];
    }

    //---------------------------------------------------------------
    // drawLine: Draws line between er objects
    //---------------------------------------------------------------
    this.drawLine = function(x1, y1, x2, y2) {
        //Checks if there is cardinality set on this object
        if(this.isCardinalityPossible && this.cardinality.value != "" && this.cardinality.value != null) {
            //Updates x and y position
            ctx.fillStyle = '#000';
            const coordinates = this.moveCardinality(x1, y1, x2, y2);
            ctx.fillText(this.cardinality.value, coordinates.x, coordinates.y);
        }

        ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();
        ctx.lineCap = "square";
        if (this.properties['key_type'] == "Forced") {
            //Draw a thick black line
            ctx.lineWidth = this.properties['lineWidth'] * 3 * diagram.getZoomValue();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            //Draw a white line in the middle to simulate space (2 line illusion);
            ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();
            ctx.strokeStyle = "#fff";
        }
        else if (this.properties['key_type'] == "Derived") {
            ctx.lineCap = "butt";
            ctx.lineWidth = this.properties['lineWidth'] * 1.5 * diagram.getZoomValue();
            ctx.setLineDash([5, 4]);
        }
        //Manually set which side of object line should be at
        var connectedObjects = this.getConnectedObjects();
        if(event.target.id == "linePlacementObject1"){
            if(this.properties['key_type'] == "Automatic1"){
                connectedObjects[0].manualLine = false;
                connectedObjects[0].manualSide = "Automatic";
            }
            else if (this.properties['key_type'] == "Top1") {
                this.setQuadrant(connectedObjects[0], "Top");
            }
            else if(this.properties['key_type'] == "Right1"){
                this.setQuadrant(connectedObjects[0], "Right");
            }
            else if(this.properties['key_type'] == "Bottom1"){
                this.setQuadrant(connectedObjects[0], "Bottom");
            }
            else if(this.properties['key_type'] == "Left1"){
                this.setQuadrant(connectedObjects[0], "Left"); 
            }
        }
        else if(event.target.id == "linePlacementObject2"){
            if(this.properties['key_type'] == "Automatic2"){
                connectedObjects[1].manualLine = false;
                connectedObjects[1].manualSide = "Automatic";
            }
            else if (this.properties['key_type'] == "Top2") {
                this.setQuadrant(connectedObjects[1], "Top");
            }
            else if(this.properties['key_type'] == "Right2"){
                this.setQuadrant(connectedObjects[1], "Right");
            }
            else if(this.properties['key_type'] == "Bottom2"){
                this.setQuadrant(connectedObjects[1], "Bottom");
            }
            else if(this.properties['key_type'] == "Left2"){
                this.setQuadrant(connectedObjects[1], "Left");
            }
        }

        checkLineIntersection(x1,y1,x2,y2);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    //---------------------------------------------------------------
    // drawUMLLine: Draws uml line between uml objects
    //---------------------------------------------------------------
    this.drawUMLLine = function(x1, y1, x2, y2) {
        this.properties['strokeColor'] = '#000000';
        this.properties['lineWidth'] = 2;

        //Checks if there is cardinality set on either first or second side of line
        if((this.cardinality.value != "" && this.cardinality.value != null) || (this.cardinality.valueUML != "" && this.cardinality.valueUML != null)) {
            ctx.fillStyle = '#000';
            let valX = x1 > x2 ? x1-20 * diagram.getZoomValue() : x1+20 * diagram.getZoomValue();
            let valY = y1 > y2 ? y1-15 * diagram.getZoomValue() : y1+15 * diagram.getZoomValue();
            let valY2 = y2 > y1 ? y2-15 * diagram.getZoomValue() : y2+15 * diagram.getZoomValue();
            let valX2 = x2 > x1 ? x2-20 * diagram.getZoomValue() : x2+20 * diagram.getZoomValue();
            if (this.isRecursiveLine) {
                const dir = this.recursiveLineExtent / Math.abs(this.recursiveLineExtent) * diagram.getZoomValue();
                if (x1 == x2) {
                    valX = valX2 = x1 + 20 * dir;
                    valY = y1 - 13 * diagram.getZoomValue();
                    valY2 = y2 - 13 * diagram.getZoomValue();
                }else {
                    valY = valY2 = y1 + 20 * dir;
                    valX = x1 - 17 * diagram.getZoomValue();
                    valX2 = x2 - 17 * diagram.getZoomValue();
                }
            }
            //Only draw the text for the set cardinality side
            if(this.cardinality.value != "" && this.cardinality.value != null) {
                ctx.fillText(this.cardinality.value, valX, valY);
            }
            if(this.cardinality.valueUML != "" && this.cardinality.valueUML != null) {
                ctx.fillText(this.cardinality.valueUML, valX2, valY2);
            }
        }

        ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();

        // Set as dotted lines depending on value
        if (this.properties['key_type'] == "Implementation" || this.properties['key_type'] == "Dependency") {
            ctx.setLineDash([8*zoomValue, 8*zoomValue]);
        }

        // Calculating the mid point between start and end
        if (x2 > x1) {
            middleBreakPointX = x1 + Math.abs(x2 - x1) / 2;
        } else if (x1 > x2) {
            middleBreakPointX = x2 + Math.abs(x1 - x2) / 2;
        } else {
            middleBreakPointX = x1;
        }

        if (y2 > y1) {
            middleBreakPointY = y1 + Math.abs(y2 - y1) / 2;
        } else if (y1 > y2) {
            middleBreakPointY = y2 + Math.abs(y1 - y2) / 2;
        } else {
            middleBreakPointY = y1;
        }

        // Start line
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Check all symbols in diagram and see if anyone matches current line's points coordinate
        for (var i = 0; i < diagram.length; i++) {
            if (diagram[i].symbolkind == symbolKind.uml) { // filter UML class
                var currentSymbol = diagram[i].corners();
                // Check if line's start point matches any class diagram
                if (x1 == pixelsToCanvas(currentSymbol.tl.x).x) {
                    startLineDirection = "left";
                    breakpointStartX = x1 - 30;
                    breakpointStartY = y1;
                } else if (x1 == pixelsToCanvas(currentSymbol.br.x).x) {
                    startLineDirection = "right";
                    breakpointStartX = x1 + 30;
                    breakpointStartY = y1;
                } else if (y1 == pixelsToCanvas(0, currentSymbol.tl.y).y) {
                    startLineDirection = "up"
                    breakpointStartY = y1 - 30;
                    breakpointStartX = x1;
                } else if (y1 == pixelsToCanvas(0, currentSymbol.br.y).y) {
                    startLineDirection = "down"
                    breakpointStartY = y1 + 30;
                    breakpointStartX = x1;
                }

                // Check if line's end point matches any class diagram
                if (x2 == pixelsToCanvas(currentSymbol.tl.x).x) {
                    endLineDirection = "left";
                    breakpointEndX = x2 - 30;
                    breakpointEndY = y2;
                } else if (x2 == pixelsToCanvas(currentSymbol.br.x).x) {
                    endLineDirection = "right";
                    breakpointEndX = x2 + 30;
                    breakpointEndY = y2;
                } else if (y2 == pixelsToCanvas(0, currentSymbol.tl.y).y) {
                    endLineDirection = "up"
                    breakpointEndY = y2 - 30;
                    breakpointEndX = x2;
                } else if (y2 == pixelsToCanvas(0, currentSymbol.br.y).y) {
                    endLineDirection = "down"
                    breakpointEndY = y2 + 30;
                    breakpointEndX = x2;
                }

                // If start and end points are too close to each other, set breakpoints to same as start and end points
                if((Math.abs(x1 - x2) < 60) || (Math.abs(y1 - y2) < 60)) {
                    breakpointStartX = x1;
                    breakpointStartY = y1;
                    breakpointEndX = x2;
                    breakpointEndY = y2;
                }
            }
        }

        // Draw to start breakpoint based on direction
        if (startLineDirection == "left") {
            ctx.lineTo(breakpointStartX, y1);
        } else if (startLineDirection == "right") {
            ctx.lineTo(breakpointStartX, y1);
        } else if (startLineDirection == "up") {
            ctx.lineTo(x1, breakpointStartY);
        } else if (startLineDirection == "down") {
            ctx.lineTo(x1, breakpointStartY);
        }

        // Check if this is a recursive line (connects to a single object twice)
        let connObjects = this.getConnectedObjects();
        if (connObjects.length == 1) {
            if (x1 == x2) { // Make sure the line is drawn "out" of the symbol
                if (startLineDirection === "right") this.recursiveLineExtent = Math.abs(this.recursiveLineExtent);
                else this.recursiveLineExtent = -Math.abs(this.recursiveLineExtent);
                middleBreakPointX += this.recursiveLineExtent * zoomValue;
            }else if (y1 == y2) {
                if (startLineDirection === "down") this.recursiveLineExtent = Math.abs(this.recursiveLineExtent);
                else this.recursiveLineExtent = -Math.abs(this.recursiveLineExtent);
                middleBreakPointY += this.recursiveLineExtent * zoomValue;
            }
        }

        if((startLineDirection === "up" || startLineDirection === "down") && (endLineDirection === "up" || endLineDirection === "down")) {
            ctx.lineTo(breakpointStartX, middleBreakPointY);
            ctx.lineTo(middleBreakPointX, middleBreakPointY); // Mid point
            ctx.lineTo(breakpointEndX, middleBreakPointY);
        } else if((startLineDirection === "left" || startLineDirection === "right") && (endLineDirection === "left" || endLineDirection === "right")) {
            ctx.lineTo(middleBreakPointX, breakpointStartY);
            ctx.lineTo(middleBreakPointX, middleBreakPointY); // Mid point
            ctx.lineTo(middleBreakPointX, breakpointEndY);
        }  else if((startLineDirection === "up" || startLineDirection === "down") && (endLineDirection === "left" || endLineDirection === "right")) {
            ctx.lineTo(breakpointStartX, breakpointEndY);
        }  else if((startLineDirection === "right" || startLineDirection === "left") && (endLineDirection === "up" || endLineDirection === "down")) {
            ctx.lineTo(breakpointEndX, breakpointStartY);
        }

        // Draw to end breakpoint based on direction
        if (endLineDirection == "left") {
            ctx.lineTo(breakpointEndX, y2);
        } else if (endLineDirection == "right") {
            ctx.lineTo(breakpointEndX, y2);
        } else if (endLineDirection == "up") {
            ctx.lineTo(x2, breakpointEndY);
        } else if (endLineDirection == "down") {
            ctx.lineTo(x2, breakpointEndY);
        }
        ctx.lineTo(x2, y2);
        ctx.stroke();

        this.drawUmlRelationLines(x1,y1,x2,y2, startLineDirection, endLineDirection);
    }

    //---------------------------------------------------------------
    // drawUmlRelationLineFigures: Draw arrow or diamond shape
    // depending on linetype at one of the connected uml objects
    //---------------------------------------------------------------
    this.drawUmlRelationLines = function(x1, y1, x2, y2, startLineDirection, endLineDirection) {
        // set start position to the right object line start
        var linePositions = { x:x1, y:y1 };
        if (this.lineDirection == "Second") {
            linePositions = { x:x2, y:y2 };
        }
        ctx.setLineDash([0]);

        var type;

        // arrow filled
        if (this.properties['key_type'] == "Inheritance" || this.properties['key_type'] == "Implementation") {
            type = "triangle";
        }
        // arrow hollow
        else if (this.properties['key_type'] == "Association" || this.properties['key_type'] == "Dependency") {
            type = "hollow";
        }
        // diamond shape
        else if (this.properties['key_type'] == "Aggregation" || this.properties['key_type'] == "Composition") {
            type = "diamond"
            //reverse line positions if diamond type
            if (this.lineDirection == "First") {
                linePositions = { x:x2, y:y2 };
            } else {
                linePositions = { x:x1, y:y1 };
            }
        }
        //line dimensions
        var xChange = 6;
        var yChange = 10;

        // base coordinates of triangle on the object it is closest to, reverse for diamond type
        if ((type != "diamond" && this.lineDirection == "First") || (type == "diamond" && this.lineDirection == "Second")) {
            // changes coordinates depending on position of line
            if (startLineDirection == "down") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, xChange, yChange, true, type);
            } else if (startLineDirection == "left") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, -yChange, -xChange, false, type);
            } else if (startLineDirection == "right") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, yChange, xChange, false, type);
            } else if (startLineDirection == "up") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, -xChange, -yChange, true, type);
            }
        }
        else if ((type != "diamond" && this.lineDirection == "Second") || (type == "diamond" && this.lineDirection == "First")) {
            if (endLineDirection == "down"){
                this.drawUmlLineRelation(linePositions.x, linePositions.y, xChange, yChange, true, type);
            } else if (endLineDirection == "left") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, -yChange, -xChange, false, type);
            } else if (endLineDirection == "right") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, yChange, xChange, false, type);
            } else if (endLineDirection == "up") {
                this.drawUmlLineRelation(linePositions.x, linePositions.y, -xChange, -yChange, true, type);
            }
        }
    }

    //---------------------------------------------------------------
    // drawUmlLineRelation: Decide which shape to draw
    //---------------------------------------------------------------
    this.drawUmlLineRelation = function(x, y, xC, yC, vertical, type) {
        xC *= zoomValue;
        yC *= zoomValue;
        if(type == "diamond"){
            this.drawDiamond(x, y, xC, yC, vertical);
        }
        else if(type == "triangle") {
            this.drawTriangle(x, y, xC, yC, vertical, true);
        }
        else if (type == "hollow") {
            this.drawTriangle(x, y, xC, yC, vertical, false);
        }
    }

    //---------------------------------------------------------------
    // drawDiamond: Draws a diamond shape at the line end
    //              Used for uml relation lines
    //---------------------------------------------------------------
    this.drawDiamond = function(x, y, xC, yC, vertical){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + xC, y + yC);
        if (vertical) {
            ctx.lineTo(x, y + yC * 2);
            ctx.lineTo(x - xC, y + yC);
        } else {
            ctx.lineTo(x + xC * 2, y);
            ctx.lineTo(x + xC, y - yC);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "white";
        if (this.properties['key_type'] == "Composition") {
            ctx.fillStyle = "black";
        }
        ctx.fill();
    }

    //---------------------------------------------------------------
    // drawTriangle: Draws triangle shape at line start
    //               Used for uml relation lines
    //---------------------------------------------------------------
    this.drawTriangle = function(x, y, xC, yC, vertical, normal) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + xC, y + yC);
        if(!normal) {
            ctx.moveTo(x, y);
        }
        if (vertical) {
            ctx.lineTo(x - xC, y + yC);
        } else {
            ctx.lineTo(x + xC, y - yC);
        }
        ctx.closePath();
        ctx.stroke();
        if (normal){
            ctx.fillStyle = "white";
            ctx.fill();
        }
    }

    //---------------------------------------------------------------
    // moveCardinality: Moves the value of the cardinality to avoid overlap with line
    //---------------------------------------------------------------
    this.moveCardinality = function(x1, y1, x2, y2) {       
        const targetobject = getCorners(points[this.cardinality.parentPointIndexes.topLeft], points[this.cardinality.parentPointIndexes.bottomRight]);
        const line = getCorners(points[this.topLeft], points[this.bottomRight]);
        const coordinates = {x: x2, y: y2};

        if(targetobject.bl.x == line.br.x && targetobject.tl.x == line.tr.x) {
            coordinates.x = x2-15 * diagram.getZoomValue();
            coordinates.y = y2 > y1 ? y2+15 * diagram.getZoomValue() : y2-15 * diagram.getZoomValue();
        } else if(targetobject.tl.y == line.br.y && targetobject.tr.y == line.bl.y) {
            coordinates.x = x2 > x1 ? x2+15 * diagram.getZoomValue() : x2-15 * diagram.getZoomValue();
            coordinates.y = y2-15 * diagram.getZoomValue();
        } else if(targetobject.br.x == line.bl.x && targetobject.tr.x == line.tl.x) {
            coordinates.x = x2+15 * diagram.getZoomValue();
            coordinates.y = y2 > y1 ? y2+15 * diagram.getZoomValue() : y2-15 * diagram.getZoomValue();
        } else if(targetobject.bl.y == line.tr.y && targetobject.br.y == line.tl.y) {
            coordinates.x = x2 > x1 ? x2+15 * diagram.getZoomValue() : x2-15 * diagram.getZoomValue();
            coordinates.y = y2+15 * diagram.getZoomValue();
        }
        
        return coordinates;
    }

    //---------------------------------------------------------------
    // drawWeakRelation: Draws additional visuals for a weak relation
    //                   Used in drawRelation
    //---------------------------------------------------------------
    this.drawWeakRelation = function(x1, y1, x2, y2) {
      var midx = pixelsToCanvas(points[this.centerPoint].x).x;
      var midy = pixelsToCanvas(0, points[this.centerPoint].y).y;
      ctx.beginPath();
      ctx.moveTo(midx, y1 - 5 * diagram.getZoomValue());
      ctx.lineTo(x2 + 9 * diagram.getZoomValue(), midy + 0);
      ctx.lineTo(midx + 0, y2 + 5 * diagram.getZoomValue());
      ctx.lineTo(x1 - 9 * diagram.getZoomValue(), midy + 0);
      ctx.lineTo(midx + 0, y1 - 5 * diagram.getZoomValue());
      ctx.closePath();
      ctx.lineWidth = (this.properties['lineWidth'] * 1.5) * diagram.getZoomValue();
      ctx.stroke();

      // Makes sure that the stroke color can not be white
      if (this.properties['strokeColor'] == '#ffffff') {
          this.properties['strokeColor'] = '#000000';
      }
      // Make sure that the font color is always able to be seen.
      //Symbol and Font color should therefore not be the same
      if (this.properties['fontColor'] == this.properties['fillColor']) {
          if (this.properties['fillColor'] == '#000000') {
              this.properties['fontColor'] = '#ffffff';
          } else {
              this.properties['fontColor'] = '#000000';
          }
      }
    }

    this.drawRelation = function(x1, y1, x2, y2, midx, midy) {
        var midx = pixelsToCanvas(points[this.centerPoint].x).x;
        var midy = pixelsToCanvas(0, points[this.centerPoint].y).y;
		
		// Set border to redish if crossing line
		if(!checkSamePage(x1,y1,x2,y2)){
			ctx.strokeStyle = '#DC143C';
		}else{
			ctx.strokeStyle = this.properties['strokeColor'];
		}

        if (this.properties['key_type'] == 'Weak') {
          this.drawWeakRelation(x1, y1, x2, y2, midx, midy);
        }

        ctx.beginPath();
        ctx.fillStyle = this.properties['fillColor'];
        ctx.moveTo(midx, y1);
        ctx.lineTo(x2, midy);
        ctx.lineTo(midx, y2);
        ctx.lineTo(x1, midy);
        ctx.lineTo(midx, y1);
        ctx.closePath();
        ctx.fill();
        // Make sure that the font color is always able to be seen.
        // Symbol and Font color should therefore not be the same
        if (this.properties['fontColor'] == this.properties['fillColor']) {
            if (this.properties['fillColor'] == '#000000') {
                this.properties['fontColor'] = '#ffffff';
            } else {
                this.properties['fontColor'] = '#000000';
            }
        }
        ctx.clip();
		ctx.stroke();
		
		// Set text to redish if crossing line
		if(!checkSamePage(x1,y1,x2,y2)){
			ctx.fillStyle = '#DC143C';
		}else{
			ctx.fillStyle = this.properties['fontColor'];
		}

        if(ctx.measureText(this.name).width >= (x2-x1) - 12) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 10 , (y1 + ((y2 - y1) * 0.5)));
        }else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
    }

    this.drawText = function(x1, y1, x2, y2) {
		if(hideComment == false || this.properties['isComment'] == false){
			var midx = x1 + ((x2-x1)/2);
			var midy = y1 + ((y2-y1)/2);
			ctx.beginPath();
			//draw text outline
			if (this.targeted || this.isHovered) {
				ctx.lineWidth = 2 * diagram.getZoomValue();
				ctx.strokeColor = "F82";
				//linedash only when hovered and not targeted
				if (this.isHovered && !this.targeted) {
					ctx.setLineDash([5, 4]);
				}
				ctx.rect(x1, y1, x2-x1, y2-y1);
				ctx.stroke();
			}
			// Set text to redish if crossing line
			if(!checkSamePage(x1,y1,x2,y2)){
				ctx.fillStyle = '#DC143C';
				ctx.strokeStyle = '#DC143C';
			}else{
				ctx.fillStyle = this.properties['fontColor'];
				ctx.strokeStyle = this.properties['strokeColor'];
			}

			//add permanent outline for comments
			if (this.properties['isComment'] == true && !this.isHovered && !this.targeted){
				ctx.lineWidth = 1 * diagram.getZoomValue();
				ctx.setLineDash([5, 4]);
				ctx.rect(x1, y1, x2-x1, y2-y1);
				ctx.stroke();
			}
			

			ctx.textAlign = this.properties['textAlign'];
			for (var i = 0; i < this.textLines.length; i++) {
				ctx.fillText(this.textLines[i].text, this.getTextX(x1, midx, x2), y1 + (this.properties['textSize'] * 1.99) / 2 + (this.properties['textSize'] * i));
			}
		}
    }

    //--------------------------------------------------------------------
    // symbolToSVG: Converts a symbol to svg
    //              Used when exporting to svg
    //--------------------------------------------------------------------
    this.symbolToSVG = function(symbolID) {
		var str = ""; // SVG string
		// Get points
		var x1 = points[this.topLeft].x;
		var y1 = points[this.topLeft].y;
		var x2 = points[this.bottomRight].x;
		var y2 = points[this.bottomRight].y;
		// Set font
		var fontsize = this.getFontsize();
		var font = "bold " + parseInt(fontsize) + "px " + this.properties['font'];
		ctx.font = font; // Set canvas font in order for measureText to work
		// Style and positions
		var svgObj = "", svgStyle = "", svgPos = "";
		var lineDash = "5, 4"; // Use this for dashed line
		var strokeWidth = this.properties['lineWidth'] * diagram.getZoomValue();

		// Create SVG string
		str += "<g>";
		if (this.symbolkind == symbolKind.uml) {
			var midy = points[this.middleDivider].y;
            font = "bold " + parseInt(fontsize) + "px Arial";
            ctx.font = font;

            // Box
            svgPos = x1+","+y1+" "+x2+","+y1+" "+x2+","+y2+" "+x1+","+y2;
            svgStyle = "fill:"+this.properties['fillColor']+"; stroke:"+this.properties['strokeColor']+";stroke-width:"+strokeWidth+";";
            svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
            str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;

            svgStyle = "stroke:"+this.properties['strokeColor']+";stroke-width:"+strokeWidth+";";
            // Top Divider
            str += "<line x1='"+x1+"' y1='"+(y1+(fontsize*1.5))+"' x2='"+x2+"' y2='"+(y1+(fontsize*1.5))+"' style='"+svgStyle+"' />";
            // Middle Divider
            str += "<line x1='"+x1+"' y1='"+midy+"' x2='"+x2+"' y2='"+midy+"' style='"+svgStyle+"' />";

            // Name
            svgStyle = "fill:"+this.properties['fontColor']+";font:"+font+";";
            var nameLength = ctx.measureText(this.name).width;
            if(nameLength >= (x2-x1) - 2) {
                svgPos = "x='"+(x1+2)+"' y='"+(y1+(0.85*this.properties['textSize']))+"' text-anchor='middle' dominant-baseline='central'";
            }else {
                svgPos = "x='"+(x1+((x2 - x1)*0.5))+"' y='"+(y1+(0.85*fontsize))+"' text-anchor='middle' dominant-baseline='central'";
            }
            str += "<text "+svgPos+" style='"+svgStyle+"'>"+this.name+"</text>";

            if (this.properties['key_type'] == "Primary key") {
                svgPos = (x1+((x2-x1)*0.5))+","+(y1+(0.85*fontsize))+" "+(x1+((x2-x1)*0.5))+","+(y1+(0.85*fontsize))+" ";
                svgPos += (x1+((x2-x1)*0.5)+nameLength)+","+(y1+(0.85*fontsize)+10);
                str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
            }

            font = parseInt(fontsize) + "px Arial";
            svgStyle = "fill:"+this.properties['fontColor']+";font:"+font+";";
            for (var i = 0; i < this.attributes.length; i++) {
                svgPos = "x='"+(x1+(fontsize*0.3))+"' y='"+(y1+(fontsize*1.7)+(fontsize*i))+"'";
                str += "<text "+svgPos+" style='"+svgStyle+"' text-anchor='start' dominant-baseline='hanging'>"+this.attributes[i].text+"</text>";
            }

            for (var i = 0; i < this.operations.length; i++) {
                svgPos = "x='"+(x1+(fontsize*0.3))+"' y='"+(midy+(fontsize*0.2)+(fontsize*i))+"'";
                str += "<text "+svgPos+" style='"+svgStyle+"' text-anchor='start' dominant-baseline='hanging'>"+this.operations[i].text+"</text>";
            }
		} else if (this.symbolkind == symbolKind.erAttribute) {
            svgStyle = "fill:"+this.properties['fillColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
            // Outer oval for multivalued attributes
            if (this.properties['key_type'] == "Multivalue") {
                str += this.ovalToSVG(x1-7, y1-7, x2+7, y2+7, svgStyle);
            }
            // Oval
            if (this.properties['key_type'] == "Derive") {
                str += this.ovalToSVG(x1, y1, x2, y2, svgStyle, lineDash);
            } else {
                str += this.ovalToSVG(x1, y1, x2, y2, svgStyle, "");
            }

            // Key
            var linelength = ctx.measureText(this.name).width;
            var tmpX = (x1+((x2-x1)/2));
            var tmpY = ((y1+(y2-y1)/2)+10);
            if (this.properties['key_type'] == "Primary key") {
                str += "<line x1='"+(tmpX-(linelength/2))+"' y1='"+tmpY+"' x2='"+(tmpX+(linelength/2))+"' y2='"+tmpY+"' style='"+svgStyle+"' />";
            } else if (this.properties['key_type'] == "Partial key") {
                str += "<line x1='"+(tmpX-(linelength/2))+"' y1='"+tmpY+"' x2='"+(tmpX+(linelength/2))+"' y2='"+tmpY+"' style='"+svgStyle+"' stroke-dasharray='"+lineDash+"' />";
            }
            // Text
            svgStyle = "fill:"+this.properties['fontColor']+"; font:"+font+";";
            if (linelength > (x2-x1) - 4) {
				svgPos = "x='"+(x1+4)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			} else {
				svgPos = "x='"+(x1 + ((x2 - x1) * 0.5))+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
            str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == symbolKind.erEntity) {
			svgStyle = "fill:"+this.properties['fillColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
			// Add extra box if weak entity
			if (this.properties['key_type'] == "Weak") {
				svgPos = (x1-5)+","+(y1-5)+" "+(x2+5)+","+(y1-5)+" "+(x2+5)+","+(y2+5)+" "+(x1-5)+","+(y2+5);
				str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			}
			// Create Entity box
			svgPos = x1+","+y1+" "+x2+","+y1+" "+x2+","+y2+" "+x1+","+y2;
			svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;
			// Text
			svgStyle = "fill:"+this.properties['fontColor']+"; font:"+font+";";
			if (ctx.measureText(this.name).width > (x2-x1) - 5) {
				svgPos = "x='"+(x1+3)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			} else {
				svgPos = "x='"+(x1 + ((x2 - x1) * 0.5))+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
			str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == symbolKind.line) {
			// Cardinality
			if (this.cardinality.value != "" && this.cardinality.value != null) {
				svgPos = "x='"+this.cardinality.x+"' y='"+this.cardinality.y+"' text-anchor='middle' dominant-baseline='central'";
				svgStyle = "fill:#000; font:"+font+";";
				str += "<text "+svgPos+" style='"+svgStyle+"'>"+this.cardinality.value+"</text>";
			}
			svgPos = "x1='"+x1+"' y1='"+y1+"' x2='"+x2+"' y2='"+y2+"'";
			if (this.properties['key_type'] == "Forced") {
				// Thick line that will be divided into two lines using thin line
				strokeWidth = this.properties['lineWidth'] * 3 * diagram.getZoomValue();
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
				// Thin line used to divide thick line into two lines
				strokeWidth = this.properties['lineWidth'] * diagram.getZoomValue();
				svgStyle = "stroke:#fff; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			} else if (this.properties['key_type'] == "Derived") {
				strokeWidth = this.properties['lineWidth'] * 2 * diagram.getZoomValue();
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' stroke-dasharray='"+lineDash+"' />";
			} else {
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			}
        } else if (this.symbolkind == symbolKind.umlLine) {
            // Cardinality
            if (this.cardinality.value != "" && this.cardinality.value != null) {
                svgPosUmlLine  = "x='"+this.cardinality.x+"' y='"+this.cardinality.y+"' text-anchor='middle' dominant-baseline='central'";
                svgStyle = "fill:#000; font:"+font+";";
                str += "<text "+svgPosUmlLine+" style='"+svgStyle+"'>"+this.cardinality.value+"</text>";
            }
            //Draw correct line with breakpoints
            svgPosUmlLine = "points='"+x1+','+y1+' ';
            if (startLineDirection == "left") {
                svgPosUmlLine += breakpointStartX+','+y1+' ';
            } else if (startLineDirection == "right") {
                svgPosUmlLine += breakpointStartX+','+y1+' ';
            } else if (startLineDirection == "up") {
                svgPosUmlLine += x1+','+breakpointStartY+' ';
            } else if (startLineDirection == "down") {
                svgPosUmlLine += x1+','+breakpointEndY+' ';
            }
            if((startLineDirection === "up" || startLineDirection === "down") && (endLineDirection === "up" || endLineDirection === "down")) {
                svgPosUmlLine += breakpointStartX+','+breakpointEndY+' ';
                svgPosUmlLine += x2+','+breakpointEndY+' ';
                svgPosUmlLine += x2+','+y2+' ';
            } else if((startLineDirection === "left" || startLineDirection === "right") && (endLineDirection === "left" || endLineDirection === "right")) {
                svgPosUmlLine += middleBreakPointX+','+breakpointStartY+' ';
                svgPosUmlLine += middleBreakPointX+','+middleBreakPointY+' ';
                svgPosUmlLine += middleBreakPointX+','+breakpointEndY+' ';
            } else if((startLineDirection === "up" || startLineDirection === "down") && (endLineDirection === "left" || endLineDirection === "right")) {
                svgPosUmlLine += breakpointStartX+','+breakpointEndY+' ';
            } else if((startLineDirection === "right" || startLineDirection === "left") && (endLineDirection === "up" || endLineDirection === "down")) {
                svgPosUmlLine += breakpointEndX+','+breakpointStartY+' ';
            }

            if (endLineDirection == "left") {
                svgPosUmlLine += breakpointEndX+','+y2+' ';
            } else if (endLineDirection == "right") {
                svgPosUmlLine += breakpointEndX+','+y2+' ';
            } else if (endLineDirection == "up") {
                svgPosUmlLine += x2+','+breakpointEndY+' ';
            } else if (endLineDirection == "down") {
                svgPosUmlLine += x2+','+breakpointEndY+' ';
            }
            svgPosUmlLine += x2+','+y2+"'";

            //Handling recursive lines
            if(this.isRecursiveLine == true){
                if(startLineDirection=="up"){
                    svgPosUmlLine = "points='"+x1+','+y1+' ';
                    svgPosUmlLine += x1+','+(y1-40)+' ';
                    svgPosUmlLine += x2+','+(y1-40)+' ';
                    svgPosUmlLine += x2+','+y2+"'";
                }
                else if(startLineDirection=="down"){
                    svgPosUmlLine = "points='"+x1+','+y1+' ';
                    svgPosUmlLine += x1+','+(y1+40)+' ';
                    svgPosUmlLine += x2+','+(y1+40)+' ';
                    svgPosUmlLine += x2+','+y2+"'";
                }
            }

            if (this.properties['key_type'] == "Forced") {
                // Thick line that will be divided into two lines using thin line
                strokeWidth = this.properties['lineWidth'] * 3 * diagram.getZoomValue();
                svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
                str += "<polyline "+svgPosUmlLine+" fill='none' style='"+svgStyle+"' />";
                // Thin line used to divide thick line into two lines
                strokeWidth = this.properties['lineWidth'] * diagram.getZoomValue();
                svgStyle = "stroke:#fff; stroke-width:"+strokeWidth+";";
                str += "<polyline "+svgPosUmlLine+" fill='none' style='"+svgStyle+"' />";
            } else if (this.properties['key_type'] == "Derived") {
                strokeWidth = this.properties['lineWidth'] * 2 * diagram.getZoomValue();
                svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
                str += "<polyline "+svgPosUmlLine+" style='"+svgStyle+"' fill='none' stroke-dasharray='"+lineDash+"' />";
            } else {
                svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
                str += "<polyline "+svgPosUmlLine+" fill='none' style='"+svgStyle+"' />";
            }
        } else if (this.symbolkind == symbolKind.erRelation) {
			var midx = points[this.centerPoint].x;
			var midy = points[this.centerPoint].y;
			// Relation
			svgStyle = "fill:"+this.properties['fillColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
			svgPos = midx+","+y1+" "+x2+","+midy+" "+midx+","+y2+" "+x1+","+midy+" "+midx+","+y1;
			svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;
			// Weak relation

			if (this.properties['key_type'] == "Weak") {
				svgStyle = "fill:"+this.properties['fillColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				svgPos = midx+","+(y1+5)+" "+(x2-9)+","+midy+" "+midx+","+(y2-5)+" "+(x1+9)+","+midy+" "+midx+","+(y1+5);
				str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			}
			// Text
			svgStyle = "fill:"+this.properties['fontColor']+";font:"+font+";";
			if(ctx.measureText(this.name).width >= (x2-x1) - 12) {
				svgPos = "x='"+(x1+10)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			}else {
				svgPos = "x='"+(x1+((x2-x1)*0.5))+"' y='"+(y1+((y2-y1)*0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
			str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == symbolKind.text) {
            var midx = points[this.centerPoint].x;
            svgStyle = "fill:"+this.properties['fontColor']+";font:"+font+";";
            var textAlignment = this.properties['textAlign'];
            if (this.properties['textAlign'] == "center") textAlignment = "middle";
            for (var i = 0; i < this.textLines.length; i++) {
                svgPos = "x='"+this.getTextX(x1, midx, x2)+"' y='"+(y1+(fontsize*1.7)/2+(fontsize*i))+"' text-anchor='"+textAlignment+"' dominant-baseline='central'";
                str += "<text "+svgPos+" style='"+svgStyle+"' >"+this.textLines[i].text+"</text>";
            }
        }
        str += "</g>";
        return str;
    }

    //---------------------------------------------------------
    // getTextX: Returns the x position of where the text should be drawn
    //           Used in drawText
    //---------------------------------------------------------
    this.getTextX = function(x1, midX, x2) {
        var textX = 0;
        if (this.properties['textAlign'] == "start") textX = x1;
        else if (this.properties['textAlign'] == "end") textX = x2;
        else textX = midX;
        return textX;
    }

    //---------------------------------------------------------
    // ovalToSVG: Used in symbolToSVG for converting an oval to svg
    //---------------------------------------------------------
    this.ovalToSVG = function(x1, y1, x2, y2, style, lineDash) {
        var middleX = x1 + ((x2 - x1) * 0.5);
        var middleY = y1 + ((y2 - y1) * 0.5);
        var tmpStr = "";
        var d = "M"+x1+","+middleY+" Q"+x1+","+y1+" "+middleX+","+y1+" ";
        d += "L"+middleX+","+y1+" Q"+x2+","+y1+" "+x2+","+middleY+" ";
        d += "L"+x2+","+middleY+" Q"+x2+","+y2+" "+middleX+","+y2+" ";
        d += "L"+middleX+","+y2+" Q"+x1+","+y2+" "+x1+","+middleY;
        tmpStr += "<path d='"+d+"' style='"+style+"' stroke-dasharray='"+lineDash+"' />";
        return tmpStr;
    }

    //---------------------------------------------------------
    // getFontsize: Returns the fontsize for this symbol depending on the properties
    //---------------------------------------------------------
	this.getFontsize = function() {
		var fontsize = 14 * diagram.getZoomValue();
		if (this.properties['sizeOftext'] == 'Small') {
			fontsize = 20 * diagram.getZoomValue();
		} else if (this.properties['sizeOftext'] == 'Medium') {
			fontsize = 30 * diagram.getZoomValue();
		} else if (this.properties['sizeOftext'] == 'Large') {
			fontsize = 50 * diagram.getZoomValue();
		}
		return fontsize;
    }

    //---------------------------------------------------------
    // getLockPosition: Returns the position of the lock for this object
    //---------------------------------------------------------
    this.getLockPosition = function() {
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;

        var xOffset = 10;

        return {
            x: pixelsToCanvas(x2 + xOffset).x,
            y: pixelsToCanvas(0, (y2 - (y2-y1)/2)).y};
    }


}
//--------------------------------------------------------------
//checkLineIntersection: checks if any two lines does intersect
//--------------------------------------------------------------
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY) {
    var	lines = diagram.getObjectsByType(symbolKind.line);
	var results = [];
	for (var i = 0; i < lines.length; i++) {
		var	line2StartX = pixelsToCanvas(points[lines[i].topLeft].x).x;
		var	line2StartY = pixelsToCanvas(0, points[lines[i].topLeft].y).y;
		var	line2EndX =	pixelsToCanvas(points[lines[i].bottomRight].x).x;
		var	line2EndY =	pixelsToCanvas(0, points[lines[i].bottomRight].y).y;
		
		if(!(line1StartX	==	line2StartX	&&	line1StartY	==	line2StartY	&&	line1EndX	==	line2EndX	&&	line1EndY	==	line2EndY	)){
		// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
			var denominator, a, b, numerator1, numerator2, result = {
				x: null,
				y: null,
				onLine1: false,
				onLine2: false
			};
			
			denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
			if (denominator == 0) {
				return result;
			}
			a = line1StartY - line2StartY;
			b = line1StartX - line2StartX;
			numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
			numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
			a = numerator1 / denominator;
			b = numerator2 / denominator;

			// if we cast these lines infinitely in both directions, they intersect here:
			result.x = line1StartX + (a * (line1EndX - line1StartX));
			result.y = line1StartY + (a * (line1EndY - line1StartY));

			// if line1 is a segment and line2 is infinite, they intersect if:
			if (a > 0 && a < 1) {
				result.onLine1 = true;
			}
			// if line2 is a segment and line1 is infinite, they intersect if:
			if (b > 0 && b < 1) {
				result.onLine2 = true;
			}
			// if line1 and line2 are segments, they intersect if both of the above are true
			if(result.onLine1 == true	&&	result.onLine2	==	true){
				var m1 = (line1EndY - line1StartY) / (line1EndX-line1StartX);
				var m2 = (line2EndY - line2StartY) / (line2EndX-line2StartX);
				drawLineJump(result.x,result.y, m1, m2);
			}
		}
	}
}

//------------------------------------------------
//The function responceble to draw the line jump
//-----------------------------------------------
function drawLineJump(positionX, positionY, mOfLine1, mOfLine2){
	var angelOfIntersection = Math.atan((mOfLine1 - mOfLine2)/(1+mOfLine1*mOfLine2));
	if(angelOfIntersection > 0){
		ctx.beginPath();
		ctx.arc(positionX,positionY,5,angelOfIntersection+(0.5*Math.PI),angelOfIntersection+(1.5*Math.PI));
		ctx.closePath();
		ctx.stroke();
 }
}

//---------------------------------------------------------------------
//Check if both corners of an object are inside the same page
//----------------------------------------------------------------------
function checkSamePage(x1,y1,x2,y2){

	x1 = canvasToPixels(x1).x;
    x2 = canvasToPixels(x2).x;
    y1 = canvasToPixels(0, y1).y;
	y2 = canvasToPixels(0, y2).y;
	//If y1 and y2 are diffrent minus plus return false
	if(x1< 0 && x2 > 0 || x2 < 0 && x1 > 0){
		return false;
	}else if (y1< 0 && y2 > 0 || y2 < 0 && y1 > 0){
		return false;
	}
	if(paperOrientation == "portrait"){
		x1 = ~~((x1/paperWidth)*zoomValue);
		y1 = ~~((y1/paperHeight)*zoomValue);
		x2 = ~~((x2/paperWidth)*zoomValue);
		y2 = ~~((y2/paperHeight)*zoomValue);
		
	}else{
		x1 = ~~((x1/paperHeight)*zoomValue);
		y1 = ~~((y1/paperWidth)*zoomValue);
		x2 = ~~((x2/paperHeight)*zoomValue);
		y2 = ~~((y2/paperWidth)*zoomValue);
	}

	if(x1==x2 && y1 == y2){
		return true;
	}else {
		return false
	}
}
//----------------------------------------------------------------------
// drawLock: This function draws out the actual lock for the specified symbol
//----------------------------------------------------------------------
function drawLock(symbol) {
    var position = symbol.getLockPosition();
    ctx.save();
    ctx.fillStyle = "orange";
    ctx.strokeStyle = "orange";
    ctx.lineWidth = diagram.getZoomValue();
    // A slight x offset to get the correct position
    var xOffset = 5;
    // Draws the upper part of the lock
    ctx.beginPath();
    ctx.arc(position.x + (xOffset * diagram.getZoomValue()), position.y, 4 * diagram.getZoomValue(), 1 * Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    // Draws the lock body
    ctx.fillRect(position.x, position.y, 10 * diagram.getZoomValue(), 10 * diagram.getZoomValue());
    ctx.restore();
}

//----------------------------------------------------------------------
// drawLockedTooltip: Draws out a tooltip that tells the user the object is locked.
//----------------------------------------------------------------------
function drawLockedTooltip(symbol) {
    ctx.save();
    var position = symbol.getLockPosition();
    // Offset used to achive the correct y position since fillRect and fillText are drawn differently
    var yOffset = 13;
    // Different size when hovering the lock itself and the entity, for displaying different amount of text
    var ySize = symbol.isLockHovered ? 34 : 16;
    var xSize = 85;
    // Draw tooltip background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(position.x, position.y + yOffset * diagram.getZoomValue(), xSize * diagram.getZoomValue(), ySize * diagram.getZoomValue());
    // Draws text, uses fillStyle to override default hover change.
    yOffset += 12;
    ctx.fillStyle = "black";
    ctx.font = 12 * diagram.getZoomValue()+ "px Arial";
    ctx.fillText("Object is locked", position.x, position.y + yOffset * diagram.getZoomValue());
    // Draw additional text when hovering the lock itself
    if (symbol.isLockHovered) {
        ctx.fillStyle = "red";
        yOffset += 16;
        ctx.fillText("Click to unlock", position.x, position.y + yOffset * diagram.getZoomValue());
    }
    ctx.restore();
}

//--------------------------------------------------------------------
// setIsLockHovered: Checks if the lock itself is hovered on specified symbol using mousecordinates (mx, my).
//--------------------------------------------------------------------
function setIsLockHovered(symbol, mx, my) {
    var position = symbol.getLockPosition();
    // offset so that we start at top left of lock
    position.y -= 5;
    //change mouseposition to scale with zoom and movement
    mx = pixelsToCanvas(mx).x;
    my = pixelsToCanvas(0, my).y;
    // 10 is the width of the lock and 15 is the height including the arc
    if (mx > position.x && mx < position.x + 10 && my > position.y && my < position.y + 15 && uimode != "MoveAround") {
        symbol.isLockHovered = true;
    } else {
        symbol.isLockHovered = false;
    }
}

//--------------------------------------------------------------------
// drawGroup: Draws which group the symbol belongs to
//--------------------------------------------------------------------
function drawGroup(symbol) {
    var position = symbol.getLockPosition();
    ctx.save();
    // Offset used to achive the correct y position since fillRect and fillText are drawn differently
    var yOffset = -25;
    // Different size when hovering the lock itself and the entity, for displaying different amount of text
    var ySize = 16;
    var xSize = symbol.group < 10 ? 45 : 50;
    // Draw tooltip background
    ctx.fillStyle = "white"; //ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(position.x, position.y + yOffset * diagram.getZoomValue(), xSize * diagram.getZoomValue(), ySize * diagram.getZoomValue());
    // Draws text, uses fillStyle to override default hover change.
    yOffset += 12;
    ctx.fillStyle = "black";
    ctx.font = 12 * diagram.getZoomValue()+ "px Arial";
    ctx.fillText("Group:" + symbol.group, position.x, position.y + yOffset * diagram.getZoomValue());
    // Draw additional text when hovering the lock itself
    ctx.restore();
}

//--------------------------------------------------------------------
// drawOval: Draws an oval, is used for drawing erattributes
//--------------------------------------------------------------------
this.drawOval = function (x1, y1, x2, y2) {
    var middleX = x1 + ((x2 - x1) * 0.5);
    var middleY = y1 + ((y2 - y1) * 0.5);

    ctx.beginPath();
    ctx.moveTo(x1, middleY);
    ctx.quadraticCurveTo(x1, y1, middleX, y1);
    ctx.quadraticCurveTo(x2, y1, x2, middleY);
    ctx.quadraticCurveTo(x2, y2, middleX, y2);
    ctx.quadraticCurveTo(x1, y2, x1, middleY);
}

//--------------------------------------------------------------------
// pointToLineDistance: used for determining if a line is hovered
//--------------------------------------------------------------------
function pointToLineDistance(P1, P2, x, y) {
    var numerator, denominator;
    numerator = Math.abs((P2.y-P1.y)*x - (P2.x - P1.x)*y + P2.x * P1.y - P2.y*P1.x);
    denominator = Math.sqrt((P2.y - P1.y)*(P2.y - P1.y) + (P2.x - P1.x)*(P2.x - P1.x));
    return numerator/denominator;
}

//----------------------------------------------------------------------
// getCorrectCorner: Helper function for getting correct corner of a line with cardinality
//----------------------------------------------------------------------
function getCorrectCorner(cardinality, ltlx, ltly, lbrx, lbry) {
		let cornerX, cornerY;

		// Top left corner
        if(Math.abs(cardinality.x - ltlx) + Math.abs(cardinality.y - ltly) == 20) {
            cornerX = ltlx;
            cornerY = ltly;
        }
        // Top right corner
        else if(Math.abs(cardinality.x - lbrx) + Math.abs(cardinality.y - ltly) == 20) {
            cornerX = lbrx;
            cornerY = ltly;
        }
        // Bottom left corner
        else if(Math.abs(cardinality.x - ltlx) + Math.abs(cardinality.y - lbry) == 20) {
            cornerX = ltlx;
            cornerY = lbry;
        }
        // Bottom right corner
        else if(Math.abs(cardinality.x - lbrx) + Math.abs(cardinality.y - lbry) == 20) {
            cornerX = lbrx;
            cornerY = lbry;
        }

        return {
        	x: cornerX,
        	y: cornerY
        }
}

//--------------------------------------------------------------------
// Path - stores a number of segments, handles e.g the two DRAW-functions in the diagram.
//--------------------------------------------------------------------
function Path() {
    this.kind = kind.path;          // Path kind
    this.segments = Array();        // Segments
    this.intarr = Array();          // Intersection list (one list per segment)
    this.tmplist = Array();         // Temporary list for testing of intersections
    this.auxlist = Array();         // Auxillary temp list for testing of intersections
    this.fillColor = '#ffffff';     // Fill color (default is white)
    this.opacity = 1;               // Opacity value for figures
    this.isorganized = true;        // This is true if segments are organized e.g. can be filled using a single command since segments follow a path 1,2-2,5-5,9 etc
    this.targeted = true;           // An organized path can contain several sub-path, each of which must be organized
    this.group = 0;
    this.isLocked = false;          // If the free draw object is locked
    this.isLockHovered = false;     // Checks if the lock itself is hovered on the free draw object
    this.isHovered = false;         // If the free draw object is hovered
    this.figureType = "Free";
    this.topLeft = 1;
    this.bottomRight = 2;
    this.properties = {
        'strokeColor': '#000000',   // Stroke color (default is black)
        'lineWidth': '2'            // Line Width (stroke width - default is 2 pixels)
    };
    this.minX = null;
    this.maxX = null;
    this.minY = null;
    this.maxY = null;
    this.id = null;

    //--------------------------------------------------------------------
    // setID: Assigns a global id to a symbol
    //--------------------------------------------------------------------
    this.setID = function(id) {
        this.id = id;
        if (globalObjectID <= id) {
            globalObjectID = id + 1;
        }
    }

    //---------------------------------------------------------
    // getLockPosition: Returns the position of the lock for this object, from the right most point of the object
    //---------------------------------------------------------
    this.getLockPosition = function() {
        var RightMostPoint;
        //First point of the free-draw figure
        RightMostPoint = points[this.segments[0].pa];
        for (var i = 1; i < this.segments.length; i++) {
            //Saves the right most point of the free-draw figure.
            if (points[this.segments[i].pa].x > RightMostPoint.x) {
                RightMostPoint = points[this.segments[i].pa];
            }
        }
        return {
            x: pixelsToCanvas(RightMostPoint.x + 10).x,
            y: pixelsToCanvas(0,RightMostPoint.y).y
        };
    }
    //---------------------------------------------------------
    // corners:
    //---------------------------------------------------------
    this.corners = function() {
        var point = false, tr = false, bl = false;
        var tl = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };
        var br = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };

        for(var i = 0; i < this.segments.length; i++){
            point = points[this.segments[i].pa];
            if(point.x < tl.x) {
                tl.x = point.x;
            }
            if(point.y < tl.y) {
                tl.y = point.y;
            }
            if(point.x > br.x) {
                br.x = point.x;
            }
            if(point.y > br.y) {
                br.y = point.y;
            }
        }

        tr = tl;
        bl = br;
        tr.x = br.x;
        bl.x = tl.x;

        return {
            tl: tl,
            tr: tr,
            bl: bl,
            br: br,
        };
    }

    //--------------------------------------------------------------------
    // move: Performs a delta-move on all points in a path
    //--------------------------------------------------------------------
    this.move = function(movex, movey) {
        for (var i = 0; i < this.segments.length; i++) {
            points[this.segments[i].pa].x += movex;
            points[this.segments[i].pa].y += movey;
        }
        this.calculateBoundingBox();
    }

    //--------------------------------------------------------------------
    // adjust: Is used to adjust the points of each symbol when moved
    //--------------------------------------------------------------------
    this.adjust = function() {
        // Needed to prevent undefined exception
    }

    //--------------------------------------------------------------------
    // addsegment: Adds a segment to a path
    //--------------------------------------------------------------------
    this.addsegment = function(objectKind, p1, p2, p3, p4, p5, p6, p7, p8) {
        if (objectKind == kind.path) {
            // Only push segment if it does not already exist
            if (!this.existsline(p1, p2, this.segments)) {
                this.segments.push({kind:kind.path, pa:p1, pb:p2});
            }
        } else {
            alert("Unknown segment type: " + objectKind);
        }
        this.calculateBoundingBox();
    }

    //--------------------------------------------------------------------
    // calculateBoundingBox: Calculates a boundary box for the figure.
    //                       Saves min and max values of X and Y.
    //                       This is to faster check for clicks inside of the figure.
    //--------------------------------------------------------------------
    this.calculateBoundingBox = function() {
        var minX = points[this.segments[0].pa].x;
        var maxX = minX;
        var minY = points[this.segments[0].pa].y;
        var maxY = minY;
        for (var i = 1; i < this.segments.length; i++) {
            var tempX = points[this.segments[i].pa].x;
            var tempY = points[this.segments[i].pa].y;
            if (tempX < minX) {
                minX = tempX;
            } else if (tempX > maxX) {
                maxX = tempX;
            }
            if (tempY < minY) {
                minY = tempY;
            } else if (tempY > maxY) {
                maxY = tempY;
            }
        }
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    //--------------------------------------------------------------------
    // draw: Draws filled path to screen (or svg when that functionality is added)
    //--------------------------------------------------------------------
    this.draw = function (fillstate, strokestate) {
        if (this.isorganized == false) {
            alert("Only organized paths can be filled!");
        }
        if (this.segments.length > 0) {
            if (this.isLocked) {
                drawLock(this);
                if (this.isHovered || this.isLockHovered) {
                    drawLockedTooltip(this);
                }
            }
            if (this.group != 0){
                drawGroup(this);
            }

            // Assign stroke style, color, transparency etc
            var shouldFill = true;

            if(this.fillColor == "noFill") {
              shouldFill = false;
            }

            ctx.strokeStyle = this.targeted ? "#F82" : this.properties['strokeColor'];
            ctx.fillStyle = this.fillColor;
            ctx.globalAlpha = this.opacity;
            ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();
            ctx.beginPath();
            var pseg = this.segments[0];
            ctx.moveTo(pixelsToCanvas(points[pseg.pa].x).x, pixelsToCanvas(0, points[pseg.pa].y).y);
            for (var i = 0; i < this.segments.length; i++) {
                var seg = this.segments[i];
                // If we start over on another sub-path, we must start with a moveto
                if (seg.pa != pseg.pb) {
                    ctx.moveTo(pixelsToCanvas(points[seg.pa].x).x, pixelsToCanvas(0, points[seg.pa].y).y);
                }
                // Draw current line
                ctx.lineTo(pixelsToCanvas(points[seg.pb].x).x, pixelsToCanvas(0, points[seg.pb].y).y);
                // Remember previous segment
                pseg = seg;
            }
            // Make either stroke or fill or both -- stroke always after fill
            if (fillstate) {
                ctx.save();
                if(shouldFill) ctx.fill();
                ctx.restore();
            }
            // Reset opacity so that following draw operations are unaffected
            ctx.globalAlpha = 1.0;

            if (strokestate) {
                ctx.stroke();
            }

            for(var i = 0; i < this.segments.length; i++) {
                var seg = points[this.segments[i].pa];
                var segb = points[this.segments[i].pb];
                if(this.targeted) {
                    ctx.beginPath();
                    ctx.arc(pixelsToCanvas(seg.x).x, pixelsToCanvas(0, seg.y).y, 5,0,2*Math.PI,false);
                    ctx.fillStyle = '#F82';
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(pixelsToCanvas(segb.x).x, pixelsToCanvas(0, segb.y).y, 5,0,2*Math.PI,false);
                    ctx.fillStyle = '#F82';
                    ctx.fill();
                }
            }
        }
    }

    //--------------------------------------------------------------------
    // isClicked: Returns true if coordinate xk, yk falls inside the bounding box of the symbol
    //--------------------------------------------------------------------
    this.isClicked = function(xCoordinate, yCoordinate) {
        var intersections = 0;
        if (xCoordinate > this.minX && xCoordinate < this.maxX && yCoordinate > this.minY && yCoordinate < this.maxY) {
            for (var j = 0; j < this.segments.length; j++) {
                var pointA = points[this.segments[j].pa];
                var pointB = points[this.segments[j].pb];
                if ((pointA.x <= xCoordinate && pointB.x >= xCoordinate) || (pointA.x >= xCoordinate && pointB.x <= xCoordinate)) {
                    var deltaX = pointB.x - pointA.x;
                    var deltaY = pointB.y - pointA.y;
                    var k = deltaY / deltaX;
                    if (pointB.x < pointA.x) {
                        var tempPoint = pointA;
                        pointA = pointB;
                        pointB = pointA;
                    }
                    var x = xCoordinate - pointA.x;
                    var y = (k * x) + pointA.y;
                    if (y < yCoordinate) {
                        intersections++;
                    }
                }
            }
            return intersections % 2;
        }
        return false;
    }

    //--------------------------------------------------------------------
    // checkForHover: Returns if the free draw object is clicked
    //--------------------------------------------------------------------
    this.checkForHover = function (mx, my) {
        setIsLockHovered(this, mx, my);
        return this.isClicked(mx, my);
    }

    //--------------------------------------------------------------------
    // recursetest: Recursively splits a line at intersection points from top to bottom until there is no line left
    //--------------------------------------------------------------------
    this.recursetest = function(p1,p2) {
        var yk = 5000;
        var endres = null;
        for (var i = 0; i < this.segments.length; i++) {
            var item = this.segments[i];
            var result = this.intersection(p1, p2, item.pa, item.pb);
            if (result.state == true && result.y < yk) {
                yk = result.y;
                endres = result;
            }
        }
        if (yk != 5000) {
            // Create new point (if it does not already exist)
            pointno = points.length
            points.push({x:endres.x, y:endres.y});
            // Depending on direction of p1 and p2
            if (points[p2].y < points[p1].y) {
                this.tmplist.push({kind:kind.path, pa:pointno, pb:p2});
                this.recursetest(pointno, p1);
            } else {
                this.tmplist.push({kind:kind.path, pa:pointno, pb:p1});
                this.recursetest(pointno, p2);
            }
        } else {
            this.tmplist.push({kind:kind.path, pa:p1, pb:p2});
        }
    }

    //--------------------------------------------------------------------
    // intersection: Line to line intersection
    //               Does not detect intersections on end points (we do not want end points to be part of intersection set)
    //--------------------------------------------------------------------
    this.intersection = function(p1, p2, p3, p4) {
        var x1 = points[p1].x;
        var y1 = points[p1].y;
        var x2 = points[p2].x;
        var y2 = points[p2].y;
        var x3 = points[p3].x;
        var y3 = points[p3].y;
        var x4 = points[p4].x;
        var y4 = points[p4].y;
        // Basic fix for straight lines
        if (x1 == x2) {
            x2 += 0.01;
        }
        if (y1 == y2) {
            y2 += 0.01;
        }
        if (x3 == x4) {
            x4 += 0.01;
        }
        if (y3 == y4) {
            y4 += 0.01;
        }
        var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (isNaN(x) || isNaN(y)) {
            return {state:false, x:0, y:0};
        } else {
            if (x1 >= x2) {
                if (!(x2 < x && x < x1)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(x1 < x && x < x2)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (y1 >= y2) {
                if (!(y2 < y && y < y1)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(y1 < y && y < y2)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (x3 >= x4) {
                if (!(x4 < x && x < x3)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(x3 < x && x < x4)) {
                    return {state:false, x:0, y:0};
                }
            }
            if (y3 >= y4) {
                if (!(y4 < y && y < y3)) {
                    return {state:false, x:0, y:0};
                }
            } else {
                if (!(y3 < y && y < y4)) {
                    return {state:false, x:0, y:0};
                }
            }
        }
        return {state:true, x:x, y:y};
    }

    //--------------------------------------------------------------------
    // existsline: Checks if a line already exists but in the reverse direction
    //             Only checks lines, not bezier curves
    //--------------------------------------------------------------------
    this.existsline = function (p1, p2, segmentset) {
        if (p1 == p2) {
            return true;
        }
        for (var i = 0; i < segmentset.length; i++) {
            var segment = segmentset[i];
            if ((segment.pa == p1 && segment.pb == p2) ||
                (segment.pa == p2 && segment.pb == p1)) {
                return true;
            }
        }
        return false;
    }

    //--------------------------------------------------------------------
    // boolOp: Line to line intersection
    //         Does not detect intersections on end points (we do not want end points to be part of intersection set)
    //--------------------------------------------------------------------
    this.boolOp = function(otherpath) {
        // Clear temporary lists used for merging paths
        this.tmplist = [];
        this.auxlist = [];
        otherpath.tmplist = [];
        otherpath.auxlist = [];
        // Recurse local segment set and check for crossing lines
        for (var i = 0; i < otherpath.segments.length; i++) {
            this.recursetest(otherpath.segments[i].pa, otherpath.segments[i].pb);
        }
        // Check if each segment is inside the joining set
        for (var i = 0; i < this.tmplist.length; i++) {
            var item = this.tmplist[i];
            // Check if center of line is inside or outside
            var p1 = points[item.pa];
            var p2 = points[item.pb];
            var xk = (p1.x + p2.x) * 0.5;
            var yk = (p1.y + p2.y) * 0.5;
            if (this.isClicked(xk, yk, otherpath)) {
                if (!this.existsline(item.pa, item.pb, this.auxlist)) {
                    this.auxlist.push(item);
                }
            }
        }
        // Recurse into joining segment set and check for crossing lines
        for (var i = 0; i < this.segments.length; i++) {
            var item = this.segments[i];
            otherpath.recursetest(item.pa, item.pb);
        }
        // Check if each segment is inside the local set
        for (var i = 0; i < otherpath.tmplist.length; i++) {
            var item = otherpath.tmplist[i];
            // Check if center of line is inside or outside
            var p1 = points[item.pa];
            var p2 = points[item.pb];
            var xk = (p1.x + p2.x) * 0.5;
            var yk = (p1.y + p2.y) * 0.5;
            if (otherpath.inside(xk, yk, this)) {
                if (!this.existsline(item.pa, item.pb, this.auxlist)) {
                    this.auxlist.push(item);
                }
            }
        }
        alert(this.auxlist.length);
        this.drawsegments(this.auxlist);
    }

    //--------------------------------------------------------------------
    // drawsegments: Debug drawing of a segment set (for example for drawing tmplist, auxlist etc)
    //--------------------------------------------------------------------
    this.drawsegments = function (segmentlist, color) {
        // Draw aux set
        ctx.lineWidth = this.properties['lineWidth'] * diagram.getZoomValue();
        ctx.strokeStyle = "#46f";
        for (var i = 0; i < segmentlist.length; i++) {
            var line = segmentlist[i];
            // If line is a straight line
            if (line.kind == kind.path) {
                ctx.beginPath();
                ctx.moveTo(points[line.pa].x, points[line.pa].y);
                ctx.lineTo(points[line.pb].x, points[line.pb].y);
                ctx.stroke();
            }
        }
    }

    // Attempts to erase the selected objects completely from the canvas
    this.erase = function() {
        for (i = 0; i < this.segments.length; i++) {
            points[this.segments[i].pa] = waldoPoint;
            points[this.segments[i].pb] = waldoPoint;
        }
    }

    // converts the free draw symbol to svg
    this.figureToSVG = function() {
        var str = "";
        if (this.isorganized && this.segments.length > 0) {
            str += "<g>";
            var svgStyle = "fill:"+this.fillColor+";fill-opacity:"+this.opacity+";stroke:"+this.properties['strokeColor']+";stroke-width:"+this.properties['lineWidth'] * diagram.getZoomValue()+";";
            var pseg = this.segments[0];
            svgPos = "M"+points[pseg.pa].x+","+points[pseg.pa].y;
            for (var i = 0; i < this.segments.length; i++) {
                var seg = this.segments[i];
                // Start at sub-path
                if (seg.pa != pseg.pb) {
                    svgPos = "M"+points[seg.pa].x+","+points[seg.pa].y;
                }
                svgPos += " L"+points[seg.pb].x+","+points[seg.pb].y;
                str += "<path d='"+svgPos+"' style='"+svgStyle+"' />";
                // Remember previous segment
                pseg = seg;
            }
            str += "</g>";
        }
        return str;
    }
    
    //--------------------------------------------------
    // getPoints: Returns all unique points in the path.
    //--------------------------------------------------

    this.getPoints = function() {
        const points = this.segments.reduce((set, segment) => {
            set.add(segment.pa); 
            set.add(segment.pb); 
            return set;
        }, new Set());

        return [...points];
    }
}

var figurePath = new Path();
var isFirstPoint = true;
var startPosition;
var numberOfPointsInFigure = 0;

//--------------------------------------------------------------------
// figureFreeDraw: Free draw, the user have to click for every point to draw on the canvas.
//                 Is used whenever a new point/segment is added to the figure
//--------------------------------------------------------------------
function figureFreeDraw() {
    startMouseCoordinateX = currentMouseCoordinateX;
    startMouseCoordinateY = currentMouseCoordinateY;
    p1 = null;
    if (isFirstPoint) {
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        startPosition = p2;
        isFirstPoint = false;
    } else {

        // Read and set the values for p1 and p2
        p1 = p2;
        if (activePoint != null) {
            p2 = activePoint;
        } else {
            p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        }
        // Check if the new point is the starting point
        var closestPoint = points.closestPoint(points[p2].x, points[p2].y, p2);
        if(closestPoint.index == startPosition && closestPoint.distance < 20) {
            // Delete all previous rendered lines
            for (var i = 0; i < numberOfPointsInFigure; i++) {
                diagram.pop();
            }
            // Render the figure
            points.splice(p2, 1);
            p2 = startPosition;
            figurePath.addsegment(1, p1, p2);
            md = mouseState.empty; // To prevent selectbox spawn when clicking out of freedraw mode
            diagram.push(figurePath);

            figurePath.figureType = "Free";
            selected_objects.push(figurePath);
            lastSelectedObject = diagram.length - 1;
            figurePath.properties['lineWidth'] = getLineThickness();
            figurePath.fillColor = getFillColor();
            figurePath.properties['strokeColor'] = getStrokeColor();
            cleanUp();
            SaveState();
        } else {
            // Temporary store the new line and then render it
            var tempPath = new Path;
            tempPath.addsegment(1, p1, p2);
            diagram.push(tempPath);
            // Save the new line to the figure
            figurePath.addsegment(1, p1, p2);
            numberOfPointsInFigure++;
        }
    }

}

//--------------------------------------------------------------------
// endFreeDraw: Automatically connects the figures last point to the first and finishes the object
//              Is used when ending the free draw object by right clicking
//--------------------------------------------------------------------
function endFreeDraw(){
    if(numberOfPointsInFigure < 2){
        // Flash function where second argument is success or danger
        flash("Please draw more lines!", "danger");
        return console.log('Draw more lines');
    }
    // Read and set the values for p1 and p2
    p1 = p2;
    if (activePoint != null) {
        p2 = activePoint;
    } else {
        p2 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
    }

    // Delete all previous rendered lines
    for (var i = 0; i < numberOfPointsInFigure; i++) {
        diagram.pop();
    }
    // Render the figure
    points.splice(p2, 1);
    p2 = startPosition;
    figurePath.addsegment(1, p1, p2);
    md = mouseState.empty; // To prevent selectbox spawn when clicking out of freedraw mode
    diagram.push(figurePath);
    figurePath.figureType = "Free";
    figurePath.properties['lineWidth'] = getLineThickness();
    selected_objects.push(figurePath);
    lastSelectedObject = diagram.length - 1;

    cleanUp();
    SaveState();
}

//--------------------------------------------------------------------
// cleanUp: Resets all varables to ther default start value.
//--------------------------------------------------------------------
function cleanUp() {
    figurePath = new Path;
    startPosition = null;
    isFirstPoint = true;
    numberOfPointsInFigure = 0;
    p2 = null;
}

//--------------------------------------------------------------------
// Flash function for error handeling to the view
//--------------------------------------------------------------------
function flash(message, state) {
    document.getElementById("errorMSG").innerHTML=message;
    var message = document.getElementById('errorMSG').style;
    message.opacity = 1;
    message.display="inline-block";
    if(state == "danger"){
        document.getElementById("errorMSG").style.color="darkred";
        document.getElementById("errorMSG").style.backgroundColor="#ff9999";
    }
    else if(state == "success"){
        document.getElementById("errorMSG").style.color="darkgreen";
        document.getElementById("errorMSG").style.backgroundColor="#99ff99";
    }
    else{
        document.getElementById("errorMSG").style.color="black";
    }

    (function fade(){(message.opacity-=.01)<0?message.display="none":setTimeout(fade,40)})();
}