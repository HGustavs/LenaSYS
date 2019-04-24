
/************************************************
    
    THIS FILE HANDLES THE OBJECTS AND
    PATHS USED BY THE DIAGRAM FUNCTIONS
    
************************************************/

//--------------------------------------------------------------------
// Symbol - stores a diagram symbol
// Function Symbol() handles the CREATE-functions in the diagram.
//--------------------------------------------------------------------
function Symbol(symbolkind) {
    this.kind = 2;                  // Diagram object kind is always 2 for symbols
    this.name = "New Class";        // New Class default name in new class
    this.targeted = false;
    this.symbolkind = symbolkind;   // Symbol kind (1 UML diagram symbol 2 ER Attribute 3 ER Entity 4 Lines 5 ER Relation)
    this.operations = [];           // Operations array
    this.attributes = [];           // Attributes array
    this.textLines = [];            // Free text array
    this.textsize = 14;             // 14 pixels text size is default
    this.symbolColor = '#ffffff';   // change background colors on entities
    this.strokeColor = '#000000';   // change standard line color
    this.font = "Arial";            // set the standard font
    this.lineWidth = 2;
    this.fontColor = '#000000';
    this.name = "New Class";        // Default name is new class
    this.key_type = "normal";       // Defult key type for a class.
    this.sizeOftext = "Tiny";       // Used to set size of text.
    this.textAlign = "center";      // Used to change alignment of free text
    this.topLeft;                   // Top Left Point
    this.bottomRight;               // Bottom Right Point
    this.middleDivider;             // Middle divider Point
    this.centerPoint;               // centerPoint
    this.cardinality = [
      {"value": null, "isCorrectSide": null, "symbolKind": null, "axis": null, "parentBox": null}
    ];
    this.minWidth;
    this.minHeight;
    this.locked = false;
    // Connector arrays - for connecting and sorting relationships between diagram objects
    this.connectorTop = [];
    this.connectorBottom = [];
    this.connectorLeft = [];
    this.connectorRight = [];

    // Properties array that stores different kind of objects. Refer to the properties with "properties['symbolColor']"
    this.properties = {
        'symbolColor': '#ffffff',                       // Change background colors on entities.
        'strokeColor': '#000000',                       // Change standard line color.
        'fontColor': '#000000',                         // Change the color of the font.
        'font': 'Arial',                                // Set the standard font.
        'lineWidth': '2',                               // LineWidth preset is 2.
        'textSize': '14',                               // 14 pixels text size is default.
        'sizeOftext': 'Tiny',                           // Used to set size of text.
        'textAlign': 'center',                          // Used to change alignment of free text.
        'shadowColor': 'rgba(0, 0, 0, 0.3',             // The shadow color.
        'shadowBlur': '10',                             // Shadowblur for all objects.
        'shadowOffsetX': '3',                           // The horizontal distance of the shadow for the object.
        'shadowOffsetY': '6',                           // The vertical distance of the shadow for the object.
        'key_type': 'normal'                            // Defult key type for a class.
    };

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
        if (this.symbolkind == 2 || this.symbolkind == 3) {
            if(points[this.bottomRight].x - points[this.topLeft].x < entityTemplate.width) {
                points[this.bottomRight].x = points[this.topLeft].x + entityTemplate.width;
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < entityTemplate.height) {
                points[this.bottomRight].y = points[this.topLeft].y + entityTemplate.height;
            }
            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;
        } else if (this.symbolkind == 1) {
            // Place middle divider point in middle between x1 and y1
            points[this.middleDivider].x = x1 + hw;
            points[this.topLeft].y = y1;

            var attrHeight, opHeight;
            if(this.attributes.length > 0) {
                //Height of text + padding
                attrHeight = (this.attributes.length*14)+35;
            }
            if(this.operations.length > 0) {
                opHeight = (this.operations.length*14)+15;
            }
            this.minHeight = attrHeight + opHeight;

            //Finding the longest string
            var longestStr = this.name;
            for(var i = 0; i < this.operations.length; i++) {
                if(this.operations[i].text.length > longestStr.length)
                    longestStr = this.operations[i].text;
            }
            for(var i = 0; i < this.attributes.length; i++) {
                if(this.attributes[i].text.length > longestStr.length)
                    longestStr = this.attributes[i].text;
            }
            ctx.font = "14px Arial";
            this.minWidth = ctx.measureText(longestStr).width + 15;

            if(points[this.middleDivider].y + opHeight > points[this.bottomRight].y) {
                points[this.middleDivider].y = points[this.bottomRight].y - opHeight;
                points[this.bottomRight].y = points[this.middleDivider].y + opHeight;
            }
            if(points[this.topLeft].y + attrHeight > points[this.middleDivider].y) {
                points[this.middleDivider].y = points[this.topLeft].y + attrHeight;
                points[this.topLeft].y = points[this.middleDivider].y - attrHeight;
            }
            if(points[this.bottomRight].y-points[this.topLeft].y < this.minHeight) {
                points[this.bottomRight].y = points[this.middleDivider].y + opHeight;
            }
            if(points[this.bottomRight].x-points[this.topLeft].x < this.minWidth) {
                points[this.bottomRight].x = points[this.topLeft].x + this.minWidth;
            }
        } else if (this.symbolkind == 5) {
            if(points[this.bottomRight].x - points[this.topLeft].x < relationTemplate.width/2) {
                points[this.bottomRight].x = points[this.topLeft].x + relationTemplate.width/2;
            }
            if(points[this.bottomRight].y - points[this.topLeft].y < relationTemplate.height/2) {
                points[this.bottomRight].y = points[this.topLeft].y + relationTemplate.height/2;
            }
            points[this.bottomRight].y = points[this.topLeft].y + (points[this.bottomRight].x - points[this.topLeft].x) * relationTemplate.height/relationTemplate.width;
            points[this.centerPoint].x = x1 + (points[this.bottomRight].x-points[this.topLeft].x)/2;
            points[this.centerPoint].y = y1 + (points[this.bottomRight].y-points[this.topLeft].y)/2
            
        } else if (this.symbolkind == 6) {
            var fontsize = this.getFontsize();
            ctx.font = "bold " + fontsize + "px " + this.properties['font'];

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
    // sortConnector: Sorts the connector
    //--------------------------------------------------------------------
    this.sortConnector = function (connector, direction, start, end, otherside) {
        if(this.symbolkind != 5) {
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
                if(this.symbolkind != 5) {
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

    // return true if connector contains a certain point
    this.hasConnector = function(point) {
        for (var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point) {
                return true;
            }
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            if(this.connectorRight[i].to == point || this.connectorRight[i].from == point) {
                return true;
            }
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            if(this.connectorBottom[i].to == point || this.connectorBottom[i].from == point) {
                return true;
            }
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            if(this.connectorLeft[i].to == point || this.connectorLeft[i].from == point) {
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
            if(this.connectorTop[i].from == point) {
                return true;
            }
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            if(this.connectorRight[i].from == point) {
                return true;
            }
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            if(this.connectorBottom[i].from == point) {
                return true;
            }
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            if(this.connectorLeft[i].from == point) {
                return true;
            }
        }
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
        if(this.symbolkind == 4) {
            return this.linehover(mx, my);
        }else if(this.symbolkind == 3) {
            return this.entityhover(mx, my);
        }else {
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

    this.entityhover = function(mx, my, c) {
        if(!c) {
             c = this.corners();
        }
        // We have correct points in the four corners of a square.
        if(mx > c.tl.x && mx < c.tr.x) {
            if(my > c.tl.y && my < c.bl.y) {
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
        }else {
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
        if(this.locked) return;
        if(this.symbolkind != 4) {
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
        if (this.symbolkind == 4) return;
        points[this.topLeft] = waldoPoint;
        points[this.bottomRight] = waldoPoint;
        points[this.centerPoint] = waldoPoint;
        points[this.middleDivider] = waldoPoint;
    }

    this.removePointFromConnector = function(point) {
        var broken = false;
        for(var i = 0; i < this.connectorTop.length; i++) {
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point) {
                this.connectorTop.splice(i,1);
                broken = true;
                break;
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
        var privatePoints = [];
        if(this.symbolkind==3) {
            for (var i = 0; i < this.connectorTop.length; i++) {
                if(this.getquadrant(this.connectorTop[i].to.x,this.connectorTop[i].to.y) != -1) {
                    privatePoints.push(this.connectorTop[i].to);
                }
                if(this.getquadrant(this.connectorTop[i].from.x,this.connectorTop[i].from.y) != -1) {
                    privatePoints.push(this.connectorTop[i].from);
                }
            }
            for (var i = 0; i < this.connectorRight.length; i++) {
                if(this.getquadrant(this.connectorRight[i].to.x,this.connectorRight[i].to.y) != -1) {
                    privatePoints.push(this.connectorRight[i].to);
                }
                if(this.getquadrant(this.connectorRight[i].from.x,this.connectorRight[i].from.y) != -1) {
                    privatePoints.push(this.connectorRight[i].from);
                }
            }
            for (var i = 0; i < this.connectorBottom.length; i++) {
                if(this.getquadrant(this.connectorBottom[i].to.x,this.connectorBottom[i].to.y) != -1) {
                    privatePoints.push(this.connectorBottom[i].to);
                }
                if(this.getquadrant(this.connectorBottom[i].from.x,this.connectorBottom[i].from.y) != -1) {
                    privatePoints.push(this.connectorBottom[i].from);
                }
            }
            for (var i = 0; i < this.connectorLeft.length; i++) {
                if(this.getquadrant(this.connectorLeft[i].to.x,this.connectorLeft[i].to.y) != -1) {
                    privatePoints.push(this.connectorLeft[i].to);
                }
                if(this.getquadrant(this.connectorLeft[i].from.x,this.connectorLeft[i].from.y) != -1) {
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
    // getLines: Returns all the lines connected to the object
    //--------------------------------------------------------------------
    this.getLines = function() {
        var privatePoints = this.getPoints();
        var lines = diagram.getLineObjects();
        var objectLines = [];
        for (var i = 0; i < lines.length; i++) {
            //Connected to connectors top, right, bottom and left; topLeft, bottomRight, centerPoint or middleDivider.
            for (var j = 0; j < privatePoints.length; j++) {
                if (lines[i].topLeft == privatePoints[j] || lines[i].bottomRight == privatePoints[j]) {
                    if(objectLines.indexOf(lines[i])==-1) {
                        objectLines.push(lines[i]);
                        break;
                    }
                }
            }
        }
        return objectLines;
    }

    //--------------------------------------------------------------------
    // draw: Redraws graphics
    //--------------------------------------------------------------------
    //       beginpath - moveto - lineto
    //      
    //       To make a dashed line, draw with:
    //       ctx.setLineDash(segments);
    //--------------------------------------------------------------------
      
    this.draw = function () {
        ctx.lineWidth = this.properties['lineWidth'] * 2;
        this.properties['textSize'] = this.getFontsize();
        ctx.strokeStyle = (this.targeted || this.isHovered) ? "#F82" : this.properties['strokeColor'];

        var x1 = points[this.topLeft].x + origoOffsetX;
        var y1 = points[this.topLeft].y + origoOffsetY;
        var x2 = points[this.bottomRight].x + origoOffsetX;
        var y2 = points[this.bottomRight].y + origoOffsetY;

        if(this.locked) {
            this.drawLock();

            if(this.isHovered) {
                this.drawLockedTooltip();
            }
        }

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold " + parseInt(this.properties['textSize']) + "px " + this.properties['font'];

        // 1 = UML
        if(this.symbolkind == 1) {
            this.drawUML(x1, y1, x2, y2);
        }
        // 2 = ER attribute
        else if(this.symbolkind == 2) {
            this.drawERAttribute(x1, y1, x2, y2);
        }
        // 3 = entity
        else if(this.symbolkind == 3) {
            this.drawEntity(x1, y1, x2, y2);
        }
        // 4 = line
        else if(this.symbolkind == 4) {
            this.drawLine(x1, y1, x2, y2);
        }
        // 5 = ER relation
        else if(this.symbolkind == 5) {
            this.drawRelation(x1, y1, x2, y2);
        }
        // 6 = Text 
        else if (this.symbolkind == 6) {
            this.drawText(x1, y1, x2, y2);
        }

        ctx.restore();
        ctx.setLineDash([]);

        //Highlighting points when targeted, makes it easier to resize
        if(this.targeted && this.symbolkind != 6) {
            ctx.beginPath();
            ctx.arc(x1,y1,5,0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2,y2,5,0,2*Math.PI,false);
            ctx.fillStyle = '#F82';
            ctx.fill();
            if(this.symbolkind != 4) {
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

    //---------------------------------------------------------
    // Functions used to draw objects
    //---------------------------------------------------------

    this.drawUML = function(x1, y1, x2, y2)
    {
        var midy = pixelsToCanvas(0, points[this.middleDivider].y).y;
        ctx.font = "bold " + parseInt(this.properties['textSize']) + "px Arial";

        // Clear Class Box
        ctx.fillStyle = "#fff";
        ctx.lineWidth = this.properties['lineWidth'];
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
        ctx.moveTo(x1, y1 + (this.properties['textSize'] * 1.5));
        ctx.lineTo(x2, y1 + (this.properties['textSize'] * 1.5));
        // Middie Divider
        ctx.moveTo(x1, midy);
        ctx.lineTo(x2, midy);
        ctx.stroke();
        ctx.clip();

        ctx.fillStyle = this.properties['fontColor'];
        // Write Class Name
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
        ctx.fillStyle = this.properties['symbolColor'];
        // Drawing a multivalue attribute
        if (this.properties['key_type'] == 'Multivalue') {
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
        if (this.properties['key_type'] == 'Drive') {

            ctx.setLineDash([5, 4]);
        }
        else if (this.properties['key_type'] == 'Primary key' || this.properties['key_type'] == 'Partial key') {
            ctx.stroke();
            this.properties['key_type'] == 'Partial key' ? ctx.setLineDash([5, 4]) : ctx.setLineDash([]);
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5) - (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.strokeStyle = this.properties['strokeColor'];

        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = this.properties['fontColor'];
        if(ctx.measureText(this.name).width > (x2-x1) - 4) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 4 , (y1 + ((y2 - y1) * 0.5)));
        }else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
    }

    this.drawEntity = function(x1, y1, x2, y2) {
        ctx.fillStyle = this.properties['symbolColor'];
        ctx.beginPath();
        if (this.properties['key_type'] == "Weak") {
            ctx.moveTo(x1 - 5, y1 - 5);
            ctx.lineTo(x2 + 5, y1 - 5);
            ctx.lineTo(x2 + 5, y2 + 5);
            ctx.lineTo(x1 - 5, y2 + 5);
            ctx.lineTo(x1 - 5, y1 - 5);
            ctx.stroke();
            ctx.lineWidth = this.properties['lineWidth'];
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

        ctx.fillStyle = this.properties['fontColor'];

        if(ctx.measureText(this.name).width >= (x2-x1) - 5) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 3 , (y1 + ((y2 - y1) * 0.5)));
        }else {
            ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        }
        ctx.font = parseInt(this.properties['textSize']) + "px " + this.properties['font'];
    }

    this.drawLine = function(x1, y1, x2, y2) {
        console.log("DRAWLINE");
        //Checks if there is cardinality set on this object
        if(this.cardinality[0].value != "" && this.cardinality[0].value != null) {
            //Updates x and y position
            ctx.fillStyle = '#000';
            if(this.cardinality[0].symbolKind == 1) {
                var valX = x1 > x2 ? x1-15 : x1+15;
                var valY = y1 > y2 ? y1-15 : y1+15;
                var valY2 = y2 > y1 ? y2-15 : y2+15;
                var valX2 = x2 > x1 ? x2-15 : x2+15;
                ctx.fillText(this.cardinality[0].value, valX, valY);
                ctx.fillText(this.cardinality[0].valueUML, valX2, valY2);
            }
            else if(this.cardinality[0].isCorrectSide) {
                this.moveCardinality(x1, y1, x2, y2, "CorrectSide");
                ctx.fillText(this.cardinality[0].value, this.cardinality[0].x, this.cardinality[0].y);
            }
            else {
                this.moveCardinality(x1, y1, x2, y2, "IncorrectSide");
                ctx.fillText(this.cardinality[0].value, this.cardinality[0].x, this.cardinality[0].y);
            }
        }


        ctx.lineWidth = this.properties['lineWidth'];
        if (this.properties['key_type'] == "Forced") {
            //Draw a thick black line
            ctx.lineWidth = this.properties['lineWidth']*3;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            //Draw a white line in the middle to simulate space (2 line illusion);
            ctx.lineWidth = this.properties['lineWidth'];
            ctx.strokeStyle = "#fff";
        }
        else if (this.properties['key_type'] == "Derived") {
            ctx.lineWidth = this.properties['lineWidth'] * 2;
            ctx.setLineDash([5, 4]);
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    //---------------------------------------------------------------
    // moveCardinality: Moves the value of the cardinality to avoid overlap with line
    //---------------------------------------------------------------
    this.moveCardinality = function(x1, y1, x2, y2, side) {
        let boxCorners = this.corners();
        let dtlx, dlty, dbrx, dbry;			// Corners for diagram objects and line

        const cardinality = this.cardinality[0];

        // Correct corner e.g. top left, top right, bottom left or bottom right
        let correctCorner = getCorrectCorner(cardinality,
    										boxCorners.tl.x,
    										boxCorners.tl.y,
    										boxCorners.br.x,
    										boxCorners.br.y);

        // Find which box the cardinality number is connected to
        for(var i = 0; i < diagram.length; i++) {
            dtlx = diagram[i].corners().tl.x;
            dtly = diagram[i].corners().tl.y;
            dbrx = diagram[i].corners().br.x;
            dbry = diagram[i].corners().br.y;

            if(correctCorner.x == dtlx || correctCorner.x == dbrx || correctCorner.y == dtly || correctCorner.y == dbry) {
                cardinality.parentBox = diagram[i];
                break;
            }
        }

	    // Decide whether x1 and y1 is relevant or x2 and y2
	    if(side == "CorrectSide") {
		    if(cardinality.parentBox != null) {
		        var correctBox = getCorners(points[cardinality.parentBox.topLeft], points[cardinality.parentBox.bottomRight]);
		        // Determine on which side of the box the cardinality should be placed
		        if(correctBox.tl.x < x1 && correctBox.br.x > x1) {
		            cardinality.axis = "X";
		        }
		        if(correctBox.tl.y < y1 && correctBox.br.y > y1) {
		            cardinality.axis = "Y";
		        }
		    }

		    // Move the value from the line
		    cardinality.x = x1 > x2 ? x1-10 : x1+10;
		    cardinality.y = y1 > y2 ? y1-10 : y1+10;

		    // Change side of the line to avoid overlap
		    if(cardinality.axis == "X") {
		        cardinality.x = x1 > x2 ? x1+10 : x1-10;
		    }
		    else if(cardinality.axis == "Y") {   
		        cardinality.y = y1 > y2 ? y1+10 : y1-10;                    
		    }
	    }
	    else if(side == "IncorrectSide") {
		    if(cardinality.parentBox != null) {
		        var correctBox = getCorners(points[this.cardinality[0].parentBox.topLeft], points[this.cardinality[0].parentBox.bottomRight]);
		        // Determine on which side of the box the cardinality should be placed
		        if(correctBox.tl.x < x2 && correctBox.br.x > x2) {
		            cardinality.axis = "X";
		        }
		        if(correctBox.tl.y < y2 && correctBox.br.y > y2) {
		            cardinality.axis = "Y";
		        }
		    }

		    // Move the value from the line
		    cardinality.x = x2 > x1 ? x2-10 : x2+10;
		    cardinality.y = y2 > y1 ? y2-10 : y2+10;

		    // Change side of the line to avoid overlap
		    if(cardinality.axis == "X") {
		        cardinality.x = x2 > x1 ? x2+10 : x2-10;
		    }
		    else if(cardinality.axis == "Y") {   
		        cardinality.y = y2 > y1 ? y2+10 : y2-10;                    
		    }
	    }
    }

    this.drawRelation = function(x1, y1, x2, y2) {
        var midx = pixelsToCanvas(points[this.centerPoint].x).x;
        var midy = pixelsToCanvas(0, points[this.centerPoint].y).y;
        ctx.beginPath();
        if (this.properties['key_type'] == 'Weak') {
            ctx.lineWidth = this.properties['lineWidth'];
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

        ctx.fillStyle = this.properties['symbolColor'];
        this.makeShadow();
        ctx.fill();
        ctx.closePath();
        ctx.clip();

        ctx.stroke();
        ctx.fillStyle = this.properties['fontColor'];
        if(ctx.measureText(this.name).width >= (x2-x1) - 12) {
            ctx.textAlign = "start";
            ctx.fillText(this.name, x1 + 10 , (y1 + ((y2 - y1) * 0.5)));
        }else {
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
        this.properties['textSize'] = this.getFontsize();

        ctx.fillStyle = this.properties['fontColor'];
        ctx.textAlign = this.textAlign;

        for (var i = 0; i < this.textLines.length; i++) {
            ctx.fillText(this.textLines[i].text, this.getTextX(x1, midx, x2), y1 + (this.properties['textSize'] * 1.7) / 2 + (this.properties['textSize'] * i));
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
		var font = "bold " + parseInt(fontsize) + "px " + this.properties['font'];
		ctx.font = font; // Set canvas font in order for measureText to work
		// Style and positions
		var svgObj = "", svgStyle = "", svgPos = "";
		var lineDash = "5, 4"; // Use this for dashed line
		var strokeWidth = this.properties['lineWidth'];

		// Create SVG string
		str += "<g>";
		if (this.symbolkind == 1) {
			var midy = points[this.middleDivider].y;
            font = "bold " + parseInt(fontsize) + "px Arial";
            ctx.font = font;

            // Box
            svgPos = x1+","+y1+" "+x2+","+y1+" "+x2+","+y2+" "+x1+","+y2;
            svgStyle = "fill:"+this.properties['symbolColor']+"; stroke:"+this.properties['strokeColor']+";stroke-width:"+strokeWidth+";";
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
		} else if (this.symbolkind == 2) {
            svgStyle = "fill:"+this.properties['symbolColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
            // Outer oval for multivalued attributes
            if (this.properties['key_type'] == "Multivalue") {
                str += this.ovalToSVG(x1-7, y1-7, x2+7, y2+7, svgStyle);
            }
            // Oval
            if (this.properties['key_type'] == "Drive") {
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
		} else if (this.symbolkind == 3) {
			svgStyle = "fill:"+this.properties['symbolColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
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
		} else if (this.symbolkind == 4) {
			// Cardinality
			if (this.cardinality[0].value != "" && this.cardinality[0].value != null) {
				svgPos = "x='"+this.cardinality[0].x+"' y='"+this.cardinality[0].y+"' text-anchor='middle' dominant-baseline='central'";
				svgStyle = "fill:#000; font:"+font+";";
				str += "<text "+svgPos+" style='"+svgStyle+"'>"+this.cardinality[0].value+"</text>";
			}
			svgPos = "x1='"+x1+"' y1='"+y1+"' x2='"+x2+"' y2='"+y2+"'";
			if (this.properties['key_type'] == "Forced") {
				// Thick line that will be divided into two lines using thin line
				strokeWidth = this.properties['lineWidth'] * 3;
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";

				// Thin line used to divide thick line into two lines
				strokeWidth = this.properties['lineWidth'];
				svgStyle = "stroke:#fff; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			} else if (this.properties['key_type'] == "Derived") {
				strokeWidth = this.properties['lineWidth'] * 2;
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' stroke-dasharray='"+lineDash+"' />";
			} else {
				svgStyle = "stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
				str += "<line "+svgPos+" style='"+svgStyle+"' />";
			}
		} else if (this.symbolkind == 5) {
			var midx = points[this.centerPoint].x;
			var midy = points[this.centerPoint].y;
			// Relation
			svgStyle = "fill:"+this.properties['symbolColor']+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
			svgPos = midx+","+y1+" "+x2+","+midy+" "+midx+","+y2+" "+x1+","+midy+" "+midx+","+y1;
			svgObj = "<polygon points='"+svgPos+"' style='"+svgStyle+"' />";
			str += "<clipPath id='"+this.name+symbolID+"'>"+svgObj+"</clipPath>"+svgObj;
			// Weak relation

			if (this.properties['key_type'] == "Weak") {
				svgStyle = "fill:"+this.symbolColor+"; stroke:"+this.properties['strokeColor']+"; stroke-width:"+strokeWidth+";";
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
		} else if (this.symbolkind == 6) {
            var midx = points[this.centerPoint].x;
            svgStyle = "fill:"+this.properties['fontColor']+";font:"+font+";";
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
		if (this.properties['sizeOftext'] == 'Small') {
			fontsize = 20;
		} else if (this.properties['sizeOftext'] == 'Medium') {
			fontsize = 30;
		} else if (this.properties['sizeOftext'] == 'Large') {
			fontsize = 50;
		}
		return fontsize;
	}

    this.makeShadow = function() {
        ctx.save();
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowOffsetX = this.properties['shadowOffsetX'];
        ctx.shadowOffsetY = this.properties['shadowOffsetY'];
        ctx.shadowColor = this.shadowColor;
        ctx.fill();
        ctx.restore();
    }

    this.getLockPosition = function() {
        let y1 = points[this.topLeft].y;
        let x2 = points[this.bottomRight].x;
        let y2 = points[this.bottomRight].y;

        let offset = 10;

        return {
                x: x2 + offset,
                y: y2 - (y2-y1)/2
            };
    }

    this.drawLock = function() {
        let position = this.getLockPosition();

        ctx.save();

        ctx.translate(position.x, position.y);
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 1;
        //Draws the upper part of the lock
        ctx.beginPath();
        ctx.arc(5, 0, 4, 1 * Math.PI, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        //Draws the lock body
        ctx.fillRect(0,0, 10, 10);

        ctx.restore();
    }

    this.drawLockedTooltip = function() {
        ctx.save();

        let position = this.getLockPosition();
        let offset = 25;

        ctx.translate(position.x, position.y + offset);
        //Draw tooltip background, -12 to accommodate that rectangles and text is drawn differently in canvas
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, -12, 125, 16);

        //Draws text, uses fillStyle to override default hover change.
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText("Entity position is locked", 0, 0);

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
    this.kind = 1;                  // Path kind
    this.segments = Array();        // Segments
    this.intarr = Array();          // Intersection list (one list per segment)
    this.tmplist = Array();         // Temporary list for testing of intersections
    this.auxlist = Array();         // Auxillary temp list for testing of intersections
    this.fillColor = '#ffffff';     // Fill color (default is white)
    this.opacity = 1;               // Opacity value for figures
    this.isorganized = true;        // This is true if segments are organized e.g. can be filled using a single command since segments follow a path 1,2-2,5-5,9 etc
    this.targeted = true;           // An organized path can contain several sub-path, each of which must be organized
    this.figureType = "Square";
    this.properties = {
        'strokeColor': '#000000',   // Stroke color (default is black)
        'lineWidth': '2'            // Line Width (stroke width - default is 2 pixels)
    };

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
        if(this.figureType == "Square") {
            if(!sel) return;
            for(var i = 0; i < this.segments.length; i++) {
                var seg = this.segments[i];
                if(points[seg.pa] == sel.point) {
                    if(i == 0) {
                        points[seg.pb].x = sel.point.x;
                        points[seg.pb+1].y = sel.point.y;
                    }
                    else if(i == 1) {
                        points[seg.pb-1].x = sel.point.x;
                        points[seg.pb].y = sel.point.y;
                    }
                    else if(i == 2) {
                        points[seg.pb].x = sel.point.x;
                        points[seg.pb-1].y = sel.point.y;
                    }
                    else if(i == 3) {
                        points[seg.pb+1].x = sel.point.x;
                        points[seg.pb].y = sel.point.y;
                    }
                    break;
                }
            }
        }
    }

    //--------------------------------------------------------------------
    // addsegment: Adds a segment to a path
    //--------------------------------------------------------------------
    this.addsegment = function(kind, p1, p2, p3, p4, p5, p6, p7, p8) {
        if (kind == 1) {
            // Only push segment if it does not already exist
            if (!this.existsline(p1, p2, this.segments)) {
                this.segments.push({kind:1, pa:p1, pb:p2});
            }
        } else {
            alert("Unknown segment type: " + kind);
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
            // Assign stroke style, color, transparency etc
            var shouldFill = true;

            if(this.fillColor == "noFill") {
              shouldFill = false;
            }

            ctx.strokeStyle = this.targeted ? "#F82" : this.properties['strokeColor'];
            ctx.fillStyle = this.fillColor;
            ctx.globalAlpha = this.opacity;
            ctx.lineWidth = this.properties['lineWidth'];

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
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 6;
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
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

    this.checkForHover = function (mx, my) {
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
                this.tmplist.push({kind:1, pa:pointno, pb:p2});
                this.recursetest(pointno, p1);
            } else {
                this.tmplist.push({kind:1, pa:pointno, pb:p1});
                this.recursetest(pointno, p2);
            }
        } else {
            this.tmplist.push({kind:1, pa:p1, pb:p2});
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
        ctx.lineWidth = this.properties['lineWidth'];
        ctx.strokeStyle = "#46f";
        for (var i = 0; i < segmentlist.length; i++) {
            var line = segmentlist[i];
            // If line is a straight line
            if (line.kind == 1) {
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

    this.figureToSVG = function() {
        var str = "";
        if (this.isorganized && this.segments.length > 0) {
            str += "<g>";
            var svgStyle = "fill:"+this.fillColor+";fill-opacity:"+this.opacity+";stroke:"+this.properties['strokeColor']+";stroke-width:"+this.properties['lineWidth']+";";
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
}

function drawSegment(pathA, p1, p2) {
    pathA.addsegment(1, p1, p2);
    return pathA;
}

var figurePath = new Path();
var isFirstPoint = true;
var startPosition;
var numberOfPointsInFigure = 0;

function createFigure() {
    startMouseCoordinateX = currentMouseCoordinateX;
    startMouseCoordinateY = currentMouseCoordinateY;
    if (figureType == "Free") {
        figureFreeDraw();
    } else if (figureType == "Square") {
        figureSquare();
    }
}

//--------------------------------------------------------------------
// figureFreeDraw: Free draw, the user have to click for every point to draw on the canvas.
//--------------------------------------------------------------------
function figureFreeDraw() {
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
            md = 0; // To prevent selectbox spawn when clicking out of freedraw mode
            diagram.push(figurePath);
            figurePath.figureType = "Free";
            selected_objects.push(figurePath);
            lastSelectedObject = diagram.length - 1;
            cleanUp();
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

function mouseDown() { 
    globalMouseState = 1;
}

function mouseUp() {
    globalMouseState = 0;
}

function toggleFirstPoint(){
    if(globalMouseState == 0){
        isFirstPoint = false;
    }
    else {
        isFirstPoint = true;
    }
}

//--------------------------------------------------------------------
// figureSquare: Draws a square between p1 and p2.
//--------------------------------------------------------------------
function figureSquare() {
    if (isFirstPoint) {
        p1 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        toggleFirstPoint();
    } else {
        p3 = points.addPoint(currentMouseCoordinateX, currentMouseCoordinateY, false);
        p2 = points.addPoint(points[p1].x, points[p3].y, false);
        p4 = points.addPoint(points[p3].x, points[p1].y, false);
        figurePath.addsegment(1, p1, p2);
        figurePath.addsegment(1, p2, p3);
        figurePath.addsegment(1, p3, p4);
        figurePath.addsegment(1, p4, p1);
        diagram.push(figurePath);
        selected_objects.push(figurePath);
        lastSelectedObject = diagram.length - 1;
        cleanUp();
    }
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

function openInitialDialog() {
    lastSelectedObject = diagram.length -1;
    diagram[lastSelectedObject].targeted = true;
    openAppearanceDialogMenu();
}
