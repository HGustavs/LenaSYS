/*
----- THIS FILE HAS THE FUNCTIONS FOR THE ARRAY -----
----- DIAGRAM AND HOW IT SHOULD BE USED BY THE SYSTEM -----
*/

//--------------------------------------------------------------------
// Symbol - stores a diagram symbol
//--------------------------------------------------------------------
function Symbol(kind) {
    this.kind = 2;                  // Diagram object kind is always 2 for symbols
    this.targeted = false;
    this.symbolkind = kind;         // Symbol kind (1 UML diagram symbol 2 ER Attribute 3 ER Entity 4 Lines 5 ER Relation)
    this.operations = [];           // Operations array
    this.attributes = [];           // Attributes array
    this.textLines = [];                 // Free text array
    this.textsize = 14;             // 14 pixels text size is default
    this.symbolColor = '#ffffff';   // change background colors on entities
    this.strokeColor = '#000000';   // change standard line color
    this.font = "Arial";             // set the standard font
    this.lineWidth = 2;
    this.fontColor = '#000000';
    this.name = "New Class";        // Default name is new class
    this.key_type = "normal";       // Defult key tyoe for a class.
    this.sizeOftext = "Tiny";       // Used to set size of text.
    this.textAlign = "center";      // Used to change alignment of free text
    this.topLeft;                   // Top Left Point
    this.bottomRight;               // Bottom Right Point
    this.middleDivider;             // Middle divider Point
    this.centerPoint;               // centerPoint
    this.shadowBlur = 10;           // Shadowblur for all objects
    this.shadowOffsetX = 3;         // The horizontal distance of the shadow for the object.
    this.shadowOffsetY = 6;         // The vertical distance of the shadow for the object.
    this.shadowColor = "rgba(0, 0, 0, 0.3)"; // The shadow color
    this.cardinality = [
      {"value": null, "isCorrectSide": null, "symbolKind":null}
    ];
    this.minWidth;
    this.minHeight;
    this.locked = false;
    // Connector arrays - for connecting and sorting relationships between diagram objects
    this.connectorTop = [];
    this.connectorBottom = [];
    this.connectorLeft = [];
    this.connectorRight = [];

    //--------------------------------------------------------------------
    // Returns the quadrant for a x,y coordinate in relation to bounding box and box center
    // Quadrant Layout:
    //       0|1     Top = 0     Right = 1
    //      -----    Bottom = 2  Left = 3
    //       3|2
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
    // Iterates over all relation ends and checks if any need to change quadrants
    //--------------------------------------------------------------------
    this.quadrants = function () {
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
        return changed;
    }

    //--------------------------------------------------------------------
    // Moves midpoint or other fixed point to geometric center of object again
    // Restricts resizing for classes
    //--------------------------------------------------------------------
    this.adjust = function () {
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;
        var hw = (points[this.bottomRight].x - x1) * 0.5;
        var hh = (points[this.bottomRight].y - y1) * 0.5;
        if (this.symbolkind == 2 || this.symbolkind == 3) {
            if(points[this.bottomRight].x - points[this.topLeft].x < entityTemplate.width){
                points[this.bottomRight].x = points[this.topLeft].x + entityTemplate.width;
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < entityTemplate.height){
                points[this.bottomRight].y = points[this.topLeft].y + entityTemplate.height;
            }
            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;
        } else if (this.symbolkind == 1) {
            // Place middle divider point in middle between x1 and y1
            points[this.middleDivider].x = x1 + hw;
            points[this.topLeft].y = y1;

            var attrHeight, opHeight;
            if(this.attributes.length > 0){
                //Height of text + padding
                attrHeight = (this.attributes.length*14)+35;
            }
            if(this.operations.length > 0){
                opHeight = (this.operations.length*14)+15;
            }
            this.minHeight = attrHeight + opHeight;

            //Finding the longest string
            var longestStr = this.name;
            for(var i = 0; i < this.operations.length; i++){
                if(this.operations[i].text.length > longestStr.length)
                    longestStr = this.operations[i].text;
            }
            for(var i = 0; i < this.attributes.length; i++){
                if(this.attributes[i].text.length > longestStr.length)
                    longestStr = this.attributes[i].text;
            }
            ctx.font = "14px Arial";
            this.minWidth = ctx.measureText(longestStr).width + 15;

            if(points[this.middleDivider].y + opHeight > points[this.bottomRight].y){
                points[this.middleDivider].y = points[this.bottomRight].y - opHeight;
                points[this.bottomRight].y = points[this.middleDivider].y + opHeight;
            }
            if(points[this.topLeft].y + attrHeight > points[this.middleDivider].y){
                points[this.middleDivider].y = points[this.topLeft].y + attrHeight;
                points[this.topLeft].y = points[this.middleDivider].y - attrHeight;
            }
            if(points[this.bottomRight].y-points[this.topLeft].y < this.minHeight){
                points[this.bottomRight].y = points[this.middleDivider].y + opHeight;
            }
            if(points[this.bottomRight].x-points[this.topLeft].x < this.minWidth){
                points[this.bottomRight].x = points[this.topLeft].x + this.minWidth;
            }
        } else if (this.symbolkind == 5){
            if(points[this.bottomRight].x - points[this.topLeft].x < relationTemplate.width/2){
                points[this.bottomRight].x = points[this.topLeft].x + relationTemplate.width/2;
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < relationTemplate.height/2){
                points[this.bottomRight].y = points[this.topLeft].y + relationTemplate.height/2;
            }
            points[this.bottomRight].y = points[this.topLeft].y + (points[this.bottomRight].x - points[this.topLeft].x) * relationTemplate.height/relationTemplate.width;
            points[this.centerPoint].x = x1 + (points[this.bottomRight].x-points[this.topLeft].x)/2;
            points[this.centerPoint].y = y1 + (points[this.bottomRight].y-points[this.topLeft].y)/2
            // Static size of relation. Makes resizing of relation impossible.
            /*points[this.topLeft].x = points[this.centerPoint].x-relationTemplate.width/2;
            points[this.topLeft].y = points[this.centerPoint].y-relationTemplate.height/2;
            points[this.bottomRight].x = points[this.centerPoint].x+relationTemplate.width/2;
            points[this.bottomRight].y = points[this.centerPoint].y+relationTemplate.height/2;*/
        } else if (this.symbolkind == 6){
            var fontsize = this.getFontsize();
            ctx.font = "bold " + fontsize + "px " + this.font;

            var longestStr = "";
            for (var i = 0; i < this.textLines.length; i++) {
                if (this.textLines[i].text.length > longestStr.length) {
                    longestStr = this.textLines[i].text;
                }
            }

            var length = ctx.measureText(longestStr).width + 20;
            var height = (this.textLines.length * fontsize) + fontsize;

            points[this.bottomRight].x = points[this.topLeft].x + length;
            points[this.bottomRight].y = points[this.topLeft].y + height;

            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;
        }
    }

    //--------------------------------------------------------------------
    // Sorts the connector
    //--------------------------------------------------------------------
    this.sortConnector = function (connector, direction, start, end, otherside) {
        if(this.symbolkind != 5){
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
            if(this.symbolkind != 5) {
                var ycc = start;
            } else {
                var ycc = start + delta;
            }

            for (var i = 0; i < connector.length; i++) {
                if(this.symbolkind != 5){
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
            if(this.symbolkind != 5) {
                var ycc = start;
            } else {
                var ycc = start + delta;
            }
            for (var i = 0; i < connector.length; i++) {
                if(this.symbolkind != 5) {
                    ycc += delta;
                }

                points[connector[i].from].y = otherside ;
                points[connector[i].from].x = ycc;
            }
        }
    }

    //--------------------------------------------------------------------
    // Sorts all connectors
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

    //return true if connector contains a certain point
    this.hasConnector = function(point) {
        for (var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point){
                return true;
            }
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            if(this.connectorRight[i].to == point || this.connectorRight[i].from == point){
                return true;
            }
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            if(this.connectorBottom[i].to == point || this.connectorBottom[i].from == point){
                return true;
            }
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            if(this.connectorLeft[i].to == point || this.connectorLeft[i].from == point){
                return true;
            }
        }
    }

    this.connectorCountFromSymbol = function(symbol) {
        var count = 0;
        var tmp = this.connectorTop.concat(this.connectorBottom, this.connectorLeft, this.connectorRight);

        if ((this.symbolkind == 3 && symbol.symbolkind == 5) || this.symbolkind == 5 && symbol.symbolkind == 3) {
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

    this.hasConnectorFromPoint = function(point) {
        for (var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].from == point){
                return true;
            }
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            if(this.connectorRight[i].from == point){
                return true;
            }
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            if(this.connectorBottom[i].from == point){
                return true;
            }
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            if(this.connectorLeft[i].from == point){
                return true;
            }
        }
    }


    //--------------------------------------------------------------------
    // Returns true if xk,yk is inside the bounding box of the symbol
    //--------------------------------------------------------------------
    this.isClicked = function(mx, my) {
        return this.checkForHover(mx, my);
    }

    //--------------------------------------------------------------------
    // Returns line distance to segment object e.g. line objects (currently only relationship markers)
    //--------------------------------------------------------------------
    this.checkForHover = function (mx, my) {
        if(this.symbolkind == 4){
            return this.linehover(mx, my);
        }else if(this.symbolkind == 3){
            return this.entityhover(mx, my);
        }else{
            return this.entityhover(mx, my);
        }
    }

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

    this.entityhover = function(mx, my, c){
        if(!c){
             c = this.corners();
        }
        //we have correct points in the four corners of a square.
        if(mx > c.tl.x && mx < c.tr.x){
            if(my > c.tl.y && my < c.bl.y){
                return true;
            }
        }
        return false;
    }

    //init four points, the four corners based on the two cornerpoints in the symbol.
    this.corners = function(){
        var p1 = points[this.topLeft];
        var p2 = points[this.bottomRight];
        if(p1.x < p2.x){
            if(p1.y < p2.y){
                //we are in the topleft
                tl = {x:p1.x, y:p1.y};
                br = {x:p2.x, y:p2.y};
                tr = {x:br.x, y:tl.y};
                bl = {x:tl.x, y:br.y};
            }else{
                //we are in the bottomleft
                tr = {x:p2.x, y:p2.y};
                bl = {x:p1.x, y:p1.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }
        }else{
            if(p1.y < p2.y){
                //we are in the topright
                tr = {x:p1.x, y:p1.y};
                bl = {x:p2.x, y:p2.y};
                tl = {x:bl.x, y:tr.y};
                br = {x:tr.x, y:bl.y};
            }else{
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
    // Updates all points referenced by symbol
    //--------------------------------------------------------------------
    this.move = function (movex, movey) {
        if(this.locked) return;
        if(this.symbolkind != 4){
            points[this.topLeft].x += movex;
            points[this.topLeft].y += movey;
            points[this.bottomRight].x += movex;
            points[this.bottomRight].y += movey;
            if (this.symbolkind == 1) {
                points[this.middleDivider].x += movex;
                points[this.middleDivider].y += movey;
            } else if (this.symbolkind == 2 || this.symbolkind == 5 || this.symbolkind == 3 || this.symbolkind == 6) {
                points[this.centerPoint].x += movex;
                points[this.centerPoint].y += movey;
            } /*else if (this.symbolkind == 3) {
                for (var i = 0; i < this.arity.length; i++) {
                    for (var j = 0; j < this.arity[i].length; j++) {
                        this.arity[i][j].x += movex;
                        this.arity[i][j].y += movey;
                    }
                }
            }*/
        }
    }



    //--------------------------------------------------------------------
    // erase/delete
    // attempts to erase object completely from canvas
    //--------------------------------------------------------------------
    this.erase = function () {
        this.movePoints();
        this.emptyConnectors();
    }

    //--------------------------------------------------------------------
    // Empties every connector of the object
    //--------------------------------------------------------------------
    this.emptyConnectors = function () {
        for (var i = 0; i < this.connectorTop.length; i++) {
            //points[this.connectorTop[i].to] = "";
            points[this.connectorTop[i].from] = "";
            this.connectorTop.splice(i, 1);
            i--;
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            //points[this.connectorRight[i].to] = "";
            points[this.connectorRight[i].from] = "";
            this.connectorRight.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            //points[this.connectorBottom[i].to] = "";
            points[this.connectorBottom[i].from] = "";
            this.connectorBottom.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            //points[this.connectorLeft[i].to] = "";
            points[this.connectorLeft[i].from] = "";
            this.connectorLeft.splice(i, 1);
            i--;
        }
    }

    //--------------------------------------------------------------------
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.movePoints = function () {
        if (this.symbolkind == 4) return;
        points[this.topLeft] = waldoPoint;
        points[this.bottomRight] = waldoPoint;
        points[this.centerPoint] = waldoPoint;
        points[this.middleDivider] = waldoPoint;
    }
    //--------------------------------------------------------------------
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.removePointFromConnector = function(point) {
        var broken = false;
        for(var i = 0; i < this.connectorTop.length; i++){
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point){
                this.connectorTop.splice(i,1);
                broken = true;
                break;
            }
        }
        if(!broken){
            for(var i = 0; i < this.connectorBottom.length; i++){
                if(this.connectorBottom[i].to == point || this.connectorBottom[i].from == point){
                    this.connectorBottom.splice(i,1);
                    broken = true;
                    break;
                }
            }
            for(var i = 0; i < this.connectorRight.length; i++){
                if(this.connectorRight[i].to == point || this.connectorRight[i].from == point){
                    this.connectorRight.splice(i,1);
                    broken = true;
                    break;
                }
            }
            for(var i = 0; i < this.connectorLeft.length; i++){
                if(this.connectorLeft[i].to == point || this.connectorLeft[i].from == point){
                    this.connectorLeft.splice(i,1);
                    broken = true;
                    break;
                }
            }
        }
    }
    this.getPoints = function() {
        var privatePoints = [];
        if(this.symbolkind==3){
            for (var i = 0; i < this.connectorTop.length; i++) {
                if(this.getquadrant(this.connectorTop[i].to.x,this.connectorTop[i].to.y) != -1){
                    privatePoints.push(this.connectorTop[i].to);
                }
                if(this.getquadrant(this.connectorTop[i].from.x,this.connectorTop[i].from.y) != -1){
                    privatePoints.push(this.connectorTop[i].from);
                }
            }
            for (var i = 0; i < this.connectorRight.length; i++) {
                if(this.getquadrant(this.connectorRight[i].to.x,this.connectorRight[i].to.y) != -1){
                    privatePoints.push(this.connectorRight[i].to);
                }
                if(this.getquadrant(this.connectorRight[i].from.x,this.connectorRight[i].from.y) != -1){
                    privatePoints.push(this.connectorRight[i].from);
                }
            }
            for (var i = 0; i < this.connectorBottom.length; i++) {
                if(this.getquadrant(this.connectorBottom[i].to.x,this.connectorBottom[i].to.y) != -1){
                    privatePoints.push(this.connectorBottom[i].to);
                }
                if(this.getquadrant(this.connectorBottom[i].from.x,this.connectorBottom[i].from.y) != -1){
                    privatePoints.push(this.connectorBottom[i].from);
                }
            }
            for (var i = 0; i < this.connectorLeft.length; i++) {
                if(this.getquadrant(this.connectorLeft[i].to.x,this.connectorLeft[i].to.y) != -1){
                    privatePoints.push(this.connectorLeft[i].to);
                }
                if(this.getquadrant(this.connectorLeft[i].from.x,this.connectorLeft[i].from.y) != -1){
                    privatePoints.push(this.connectorLeft[i].from);
                }
            }
        }
        privatePoints.push(this.topLeft);
        privatePoints.push(this.bottomRight);
        privatePoints.push(this.middleDivider);
        privatePoints.push(this.centerPoint);
        return privatePoints;
    }

    //--------------------------------------------------------------------
    // Returns all the lines connected to the object
    //--------------------------------------------------------------------
    this.getLines = function() {
        var privatePoints = this.getPoints();
        var lines = diagram.getLineObjects();
        var objectLines = [];
        for (var i = 0; i < lines.length; i++) {
            //Connected to connectors top, right, bottom and left; topLeft, bottomRight, centerPoint or middleDivider.
            for (var j = 0; j < privatePoints.length; j++) {
                if (lines[i].topLeft == privatePoints[j] || lines[i].bottomRight == privatePoints[j]) {
                    if(objectLines.indexOf(lines[i])==-1){
                        objectLines.push(lines[i]);
                        break;
                    }
                }
            }
        }
        return objectLines;
    }

    //--------------------------------------------------------------------
    // Redraws graphics
    //--------------------------------------------------------------------
    //     beginpath - moveto - lineto
    //
    //     För att göra streckad linje rita med
    //     ctx.setLineDash(segments);
    //--------------------------------------------------------------------
    this.draw = function () {
        ctx.lineWidth = this.lineWidth * 2;
        textsize = this.getFontsize();
        ctx.strokeStyle = (this.targeted || this.isHovered) ? "#F82" : this.strokeColor;

        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + parseInt(textsize) + "px " + this.font;

        if(this.symbolkind == 1){
            this.drawUML(x1, y1, x2, y2);
        }
        else if(this.symbolkind == 2){
            this.drawERAttribute(x1, y1, x2, y2);
        }
        else if(this.symbolkind == 3){
            this.drawEntity(x1, y1, x2, y2);
        }
        else if(this.symbolkind == 4){
            this.drawLine(x1, y1, x2, y2);
        }
        else if(this.symbolkind == 5){
            this.drawRelation(x1, y1, x2, y2);
        } else if (this.symbolkind == 6){
            this.drawText(x1, y1, x2, y2);
        }

        ctx.restore();
        ctx.setLineDash([]);


        //Highlighting points when targeted, makes it easier to resize
        if(this.targeted && this.symbolkind != 6){
            ctx.beginPath();
            ctx.arc(x1,y1,5,0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2,y2,5,0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();
            if(this.symbolkind != 4){
                ctx.beginPath();
                ctx.arc(x1,y2,5,0,2*Math.PI,false);
                ctx.fillStyle = '#F82';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x2,y1,5,0,2*Math.PI,false);
                ctx.fillStyle = '#F82';
                ctx.fill();
            }
        }


    }
    this.drawUML = function(x1, y1, x2, y2)
    {
        var midy = points[this.middleDivider].y;
        ctx.font = "bold " + parseInt(textsize) + "px Arial";

        // Clear Class Box
        ctx.fillStyle = "#fff";
        ctx.lineWidth = this.lineWidth;
        // Box
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        this.makeShadow();
        ctx.closePath();
        // Top Divider
        ctx.moveTo(x1, y1 + (this.textsize * 1.5));
        ctx.lineTo(x2, y1 + (this.textsize * 1.5));
        // Middie Divider
        ctx.moveTo(x1, midy);
        ctx.lineTo(x2, midy);
        ctx.stroke();
        ctx.clip();

        ctx.fillStyle = this.fontColor;
        // Write Class Name
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if(ctx.measureText(this.name).width >= (x2-x1) - 2){
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 2 , y1 + (0.85 * this.textsize));
        }else{
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
        }
        if (this.key_type == 'Primary key') {
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + linelength, y1 + (0.85 * this.textsize) + 10);
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }
        // Change Alignment and Font
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.font = parseInt(this.textsize) + "px Arial";

        for (var i = 0; i < this.attributes.length; i++) {
            ctx.fillText(this.attributes[i].text, x1 + (this.textsize * 0.3), y1 + (this.textsize * 1.7) + (this.textsize * i));
        }

        for (var i = 0; i < this.operations.length; i++) {
            ctx.fillText(this.operations[i].text, x1 + (this.textsize * 0.3), midy + (this.textsize * 0.2) + (this.textsize * i));
        }
    }

    this.drawERAttribute = function(x1, y1, x2, y2){
        ctx.fillStyle = this.symbolColor;
        //This is a temporary solution to the black symbol problem
        // Drawing a multivalue attribute
        if (this.key_type == 'Multivalue') {
            drawOval(x1 - 7, y1 - 7, x2 + 7, y2 + 7);
            ctx.stroke();
            this.makeShadow();
            drawOval(x1, y1, x2, y2);
        // Drawing a normal attribute
        } else {
            drawOval(x1, y1, x2, y2);

            ctx.fill();
            this.makeShadow();
        }
        ctx.clip();

        //drawing an derived attribute
        if (this.key_type == 'Drive') {
            ctx.setLineDash([5, 4]);
        }
        else if (this.key_type == 'Primary key' || this.key_type == 'Partial key') {
            ctx.stroke();
            this.key_type == 'Partial key' ? ctx.setLineDash([5, 4]) : ctx.setLineDash([]);
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5) - (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.strokeStyle = this.strokeColor;

        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = this.fontColor;
        if(ctx.measureText(this.name).width > (x2-x1) - 4){
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 4 , (y1 + ((y2 - y1) * 0.5)));
        }else{
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
    }

    this.drawEntity = function(x1, y1, x2, y2){
        ctx.fillStyle = this.symbolColor;
        ctx.beginPath();
        if (this.key_type == "Weak") {
            ctx.moveTo(x1 - 5, y1 - 5);
            ctx.lineTo(x2 + 5, y1 - 5);
            ctx.lineTo(x2 + 5, y2 + 5);
            ctx.lineTo(x1 - 5, y2 + 5);
            ctx.lineTo(x1 - 5, y1 - 5);
            ctx.stroke();
            ctx.lineWidth = this.lineWidth;
        }

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        this.makeShadow();
        ctx.clip();
        ctx.stroke();

        ctx.fillStyle = this.fontColor;

        if(ctx.measureText(this.name).width >= (x2-x1) - 5){
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 3 , (y1 + ((y2 - y1) * 0.5)));
        }else{
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
        ctx.font = parseInt(textsize) + "px " + this.font;
    }

    this.drawLine = function(x1, y1, x2, y2){
        //Checks if there is cardinality set on this object
        if(this.cardinality[0].value != "" && this.cardinality[0].value != null){
            //Updates x and y position
            ctx.fillStyle = '#000';
            if(this.cardinality[0].symbolKind == 1){
                var valX = x1 > x2 ? x1-15 : x1+15;
                var valY = y1 > y2 ? y1-15 : y1+15;
                var valY2 = y2 > y1 ? y2-15 : y2+15;
                var valX2 = x2 > x1 ? x2-15 : x2+15;
                ctx.fillText(this.cardinality[0].value, valX, valY);
                ctx.fillText(this.cardinality[0].valueUML, valX2, valY2);
            }
            else if(this.cardinality[0].isCorrectSide){
                this.cardinality[0].x = x1 > x2 ? x1-10 : x1+10;
                this.cardinality[0].y = y1 > y2 ? y1-10 : y1+10;
                ctx.fillText(this.cardinality[0].value, this.cardinality[0].x, this.cardinality[0].y);
            }
            else {
                this.cardinality[0].x = x2 > x1 ? x2-10 : x2+10;
                this.cardinality[0].y = y2 > y1 ? y2-10 : y2+10;
                ctx.fillText(this.cardinality[0].value, this.cardinality[0].x, this.cardinality[0].y);
            }
        }


        ctx.lineWidth = this.lineWidth;
        if (this.key_type == "Forced") {
            //Draw a thick black line
            ctx.lineWidth = this.lineWidth*3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            //Draw a white line in the middle to simulate space (2 line illusion);
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = "#fff";
        }
        else if (this.key_type == "Derived") {
            ctx.lineWidth = this.lineWidth * 2;
            ctx.setLineDash([5, 4]);
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    this.drawRelation = function(x1, y1, x2, y2){
        var midx = points[this.centerPoint].x;
        var midy = points[this.centerPoint].y;
        ctx.beginPath();
        if (this.key_type == 'Weak') {
            ctx.lineWidth = this.lineWidth;
            ctx.moveTo(midx, y1 + 5);
            ctx.lineTo(x2 - 9, midy + 0);
            ctx.lineTo(midx + 0, y2 - 5);
            ctx.lineTo(x1 + 9, midy + 0);
            ctx.lineTo(midx + 0, y1 + 5);
        }
        ctx.moveTo(midx, y1);
        ctx.lineTo(x2, midy);
        ctx.lineTo(midx, y2);
        ctx.lineTo(x1, midy);
        ctx.lineTo(midx, y1);

        ctx.fillStyle = this.symbolColor;
        this.makeShadow();
        ctx.fill();
        ctx.closePath();
        ctx.clip();

        ctx.stroke();
        ctx.fillStyle = this.fontColor;
        if(ctx.measureText(this.name).width >= (x2-x1) - 12){
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 10 , (y1 + ((y2 - y1) * 0.5)));
        }else{
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
    }
    this.drawText = function(x1, y1, x2, y2) {
        var midx = x1 + ((x2-x1)/2);
        var midy = y1 + ((y2-y1)/2);
        ctx.beginPath();
        if (this.targeted || this.isHovered) {
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.strokeColor = "F82";
            ctx.rect(x1, y1, x2-x1, y2-y1);
            ctx.stroke();
        }
        this.textsize = this.getFontsize();

        ctx.fillStyle = this.fontColor;
        ctx.textAlign = this.textAlign;

        for (var i = 0; i < this.textLines.length; i++) {
            ctx.fillText(this.textLines[i].text, this.getTextX(x1, midx, x2), y1 + (this.textsize * 1.7) / 2 + (this.textsize * i));
        }
    }

    this.symbolToSVG = function(symbolID) {
		var str = ""; // SVG string
		// Get points
		var x1 = points[this.topLeft].x;
		var y1 = points[this.topLeft].y;
		var x2 = points[this.bottomRight].x;
		var y2 = points[this.bottomRight].y;
		// Set font
		var fontsize = this.getFontsize();
		var font = "bold " + parseInt(fontsize) + "px " + this.font;
		ctx.font = font; // Set canvas font in order for measureText to work
		// Style and positions
		var svgObj = "", svgStyle = "", svgPos = "";
		var lineDash = "5, 4"; // Use this for dashed line
		var strokeWidth = this.lineWidth;

		// Create SVG string
		str += "<g>";
		if (this.symbolkind == 1) {
			var midy = points[this.middleDivider].y;
            font = "bold " + parseInt(fontsize) + "px Arial";
            ctx.font = font;

            // Box
            svgPos = x1+","+y1+" "+x2+","+y1+" "+x2+","+y2+" "+x1+","+y2;
            svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.strokeColor+";stroke-width:"+strokeWidth+";";
            svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
            str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;

            svgStyle = "stroke:"+this.strokeColor+";stroke-width:"+strokeWidth+";";
            // Top Divider
            str += "<line x1='"+x1+"' y1='"+(y1+(fontsize*1.5))+"' x2='"+x2+"' y2='"+(y1+(fontsize*1.5))+"' style='"+svgStyle+"' />";
            // Middle Divider
            str += "<line x1='"+x1+"' y1='"+midy+"' x2='"+x2+"' y2='"+midy+"' style='"+svgStyle+"' />";

            // Name
            svgStyle = "fill:"+this.fontColor+";font:"+font+";";
            var nameLength = ctx.measureText(this.name).width;
            if(nameLength >= (x2-x1) - 2){
                svgPos = "x='"+(x1+2)+"' y='"+(y1+(0.85*this.textsize))+"' text-anchor='middle' dominant-baseline='central'";
            }else{
                svgPos = "x='"+(x1+((x2 - x1)*0.5))+"' y='"+(y1+(0.85*fontsize))+"' text-anchor='middle' dominant-baseline='central'";
            }
            str += "<text "+svgPos+" style='"+svgStyle+"'>"+this.name+"</text>";

            if (this.key_type == "Primary key") {
                svgPos = (x1+((x2-x1)*0.5))+","+(y1+(0.85*fontsize))+" "+(x1+((x2-x1)*0.5))+","+(y1+(0.85*fontsize))+" ";
                svgPos += (x1+((x2-x1)*0.5)+nameLength)+","+(y1+(0.85*fontsize)+10);
                str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
            }

            font = parseInt(fontsize) + "px Arial";
            svgStyle = "fill:"+this.fontColor+";font:"+font+";";
            for (var i = 0; i < this.attributes.length; i++) {
                svgPos = "x='"+(x1+(fontsize*0.3))+"' y='"+(y1+(fontsize*1.7)+(fontsize*i))+"'";
                str += "<text "+svgPos+" style='"+svgStyle+"' text-anchor='start' dominant-baseline='hanging'>"+this.attributes[i].text+"</text>";
            }

            for (var i = 0; i < this.operations.length; i++) {
                svgPos = "x='"+(x1+(fontsize*0.3))+"' y='"+(midy+(fontsize*0.2)+(fontsize*i))+"'";
                str += "<text "+svgPos+" style='"+svgStyle+"' text-anchor='start' dominant-baseline='hanging'>"+this.operations[i].text+"</text>";
            }
		} else if (this.symbolkind == 2) {
            svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
            // Outer oval for multivalued attributes
            if (this.key_type == "Multivalue") {
                str += this.ovalToSVG(x1-7, y1-7, x2+7, y2+7, svgStyle);
            }
            // Oval
            if (this.key_type == "Drive") {
                str += this.ovalToSVG(x1, y1, x2, y2, svgStyle, lineDash);
            } else {
                str += this.ovalToSVG(x1, y1, x2, y2, svgStyle, "");
            }

            // Key
            var linelength = ctx.measureText(this.name).width;
            var tmpX = (x1+((x2-x1)/2));
            var tmpY = ((y1+(y2-y1)/2)+10);
            if (this.key_type == "Primary key") {
                str += "<line x1='"+(tmpX-(linelength/2))+"' y1='"+tmpY+"' x2='"+(tmpX+(linelength/2))+"' y2='"+tmpY+"' style='"+svgStyle+"' />";
            } else if (this.key_type == "Partial key") {
                str += "<line x1='"+(tmpX-(linelength/2))+"' y1='"+tmpY+"' x2='"+(tmpX+(linelength/2))+"' y2='"+tmpY+"' style='"+svgStyle+"' stroke-dasharray='"+lineDash+"' />";
            }
            // Text
            svgStyle = "fill:"+this.fontColor+"; font:"+font+";";
            if (linelength > (x2-x1) - 4) {
				svgPos = "x='"+(x1+4)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			} else {
				svgPos = "x='"+(x1 + ((x2 - x1) * 0.5))+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
            str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == 3) {
			svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
			// Add extra box if weak entity
			if (this.key_type == "Weak") {
				svgPos = (x1-5)+","+(y1-5)+" "+(x2+5)+","+(y1-5)+" "+(x2+5)+","+(y2+5)+" "+(x1-5)+","+(y2+5);
				str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			}
			// Create Entity box
			svgPos = x1+","+y1+" "+x2+","+y1+" "+x2+","+y2+" "+x1+","+y2;
			svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;
			// Text
			svgStyle = "fill:"+this.fontColor+"; font:"+font+";";
			if (ctx.measureText(this.name).width > (x2-x1) - 5) {
				svgPos = "x='"+(x1+3)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			} else {
				svgPos = "x='"+(x1 + ((x2 - x1) * 0.5))+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
			str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == 4) {
			// Cardinality
			if (this.cardinality[0].value != "" && this.cardinality[0].value != null) {
				svgPos = "x='"+this.cardinality[0].x+"' y='"+this.cardinality[0].y+"' text-anchor='middle' dominant-baseline='central'";
				svgStyle = "fill:#000; font:"+font+";";
				str += "<text "+svgPos+" style='"+svgStyle+"'>"+this.cardinality[0].value+"</text>";
			}
			svgPos = "x1='"+x1+"' y1='"+y1+"' x2='"+x2+"' y2='"+y2+"'";
			if (this.key_type == "Forced") {
				// Thick line that will be divided into two lines using thin line
				strokeWidth = this.lineWidth * 3;
				svgStyle = "stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";

				// Thin line used to divide thick line into two lines
				strokeWidth = this.lineWidth;
				svgStyle = "stroke:#fff; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			} else if (this.key_type == "Derived") {
				strokeWidth = this.lineWidth * 2;
				svgStyle = "stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' stroke-dasharray='"+lineDash+"' />";
			} else {
				svgStyle = "stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			}
		} else if (this.symbolkind == 5) {
			var midx = points[this.centerPoint].x;
			var midy = points[this.centerPoint].y;
			// Relation
			svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
			svgPos = midx+","+y1+" "+x2+","+midy+" "+midx+","+y2+" "+x1+","+midy+" "+midx+","+y1;
			svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;
			// Weak relation
			if (this.key_type == "Weak") {
				svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.strokeColor+"; stroke-width:"+strokeWidth+";";
				svgPos = midx+","+(y1+5)+" "+(x2-9)+","+midy+" "+midx+","+(y2-5)+" "+(x1+9)+","+midy+" "+midx+","+(y1+5);
				str += "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			}
			// Text
			svgStyle = "fill:"+this.fontColor+";font:"+font+";";
			if(ctx.measureText(this.name).width >= (x2-x1) - 12){
				svgPos = "x='"+(x1+10)+"' y='"+(y1 + ((y2 - y1) * 0.5))+"' text-anchor='start' dominant-baseline='central'";
			}else{
				svgPos = "x='"+(x1+((x2-x1)*0.5))+"' y='"+(y1+((y2-y1)*0.5))+"' text-anchor='middle' dominant-baseline='central'";
			}
			str += "<text "+svgPos+" style='"+svgStyle+"' clip-path='url(#"+this.name+symbolID+")'>"+this.name+"</text>";
		} else if (this.symbolkind == 6) {
            var midx = points[this.centerPoint].x;
            svgStyle = "fill:"+this.fontColor+";font:"+font+";";
            var textAlignment = this.textAlign;
            if (this.textAlign == "center") textAlignment = "middle";
            for (var i = 0; i < this.textLines.length; i++) {
                svgPos = "x='"+this.getTextX(x1, midx, x2)+"' y='"+(y1+(fontsize*1.7)/2+(fontsize*i))+"' text-anchor='"+textAlignment+"' dominant-baseline='central'";
                str += "<text "+svgPos+" style='"+svgStyle+"' >"+this.textLines[i].text+"</text>";
            }
        }
		str += "</g>";
		return str;
	}

    this.getTextX = function(x1, midX, x2) {
        var textX = 0;
        if (this.textAlign == "start") textX = x1 + 10;
        else if (this.textAlign == "end") textX = x2 - 10;
        else textX = midX;
        return textX;
    }

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

	this.getFontsize = function() {
		var fontsize = 14;
		if (this.sizeOftext == 'Small') {
			fontsize = 20;
		} else if (this.sizeOftext == 'Medium') {
			fontsize = 30;
		} else if (this.sizeOftext == 'Large') {
			fontsize = 50;
		}
		return fontsize;
	}

    this.makeShadow = function(){
        ctx.save();
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.shadowOffsetX;
        ctx.shadowOffsetY = this.shadowOffsetY;
        ctx.shadowColor = this.shadowColor;
        ctx.fill();
        ctx.restore();
    }
}

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

function pointToLineDistance(P1, P2, x, y){
    var numerator, denominator;
    numerator = Math.abs((P2.y-P1.y)*x - (P2.x - P1.x)*y + P2.x * P1.y - P2.y*P1.x);
    denominator = Math.sqrt((P2.y - P1.y)*(P2.y - P1.y) + (P2.x - P1.x)*(P2.x - P1.x));
    return numerator/denominator;
}
