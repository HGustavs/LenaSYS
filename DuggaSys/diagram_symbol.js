//--------------------------------------------------------------------
// Symbol - stores a diagram symbol
//--------------------------------------------------------------------

function Symbol(kind) {
  this.kind=2;                  // Diagram object kind is always 2 for symbols
  this.targeted = false;
  this.symbolkind=kind;         // Symbol kind (1 UML diagram symbol 2 ER Attribute)

  this.operations=[];           // Operations array
  this.attributes=[];           // Attributes array

  this.textsize=14;             // 14 pixels text size is default
  var textscale = 10;
  this.name="New Class";    // Default name is new class
  this.key_type = "none" //Defult key tyoe for a class.
  this.sizeOftext = "none" //used to set size of text.

  this.topLeft;                 // Top Left Point
  this.bottomRight;             // Bottom Right Point
  this.middleDivider;           // Middle divider Point

  this.centerpoint;             // Centerpoint

  // Connector arrays - for connecting and sorting relationships between diagram objects
  this.connectorTop=[];
  this.connectorBottom=[];
  this.connectorLeft=[];
  this.connectorRight=[];


  //--------------------------------------------------------------------
  // getquadrant
  // Returns the quadrant for a x,y coordinate in relation to bounding box and box center
  // Quadrant Layout:
  //       0|1     Top = 0     Right = 1
  //      -----    Bottom = 2  Left = 3
  //       3|2
  //--------------------------------------------------------------------

  this.getquadrant = function (xk,yk)
  {
    // Read cardinal points
    var x1=points[this.topLeft].x;
    var y1=points[this.topLeft].y;
    var x2=points[this.bottomRight].x;
    var y2=points[this.bottomRight].y;
    var vx=points[this.centerpoint].x;
    var vy=points[this.centerpoint].y;

    // Compute deltas and k
    var dx=x1-vx;
    var dy=y1-vy;
    var k=dy/dx;

    if(xk>vx){
      if(yk>vy){
        // Bottom right quadrant
        var byk=vy+(k*(xk-vx));
        if(yk>byk) return 2;
        return 1;
      }else{
        // Top right quadrant
        var byk=vy-(k*(xk-vx));
        if(yk>byk) return 1;
        return 0;
      }
    }else{
      if(yk>vy){
        // Bottom left quadrant
        var byk=vy-(k*(xk-vx));
        if(yk>byk) return 2;
        return 3;
      }else{
        // Top left quadrant
        var byk=(k*(xk-vx))+vy;
        if(yk>byk) return 3;
        return 0;
      }
    }
    return -1;
  }

  //--------------------------------------------------------------------
  // quadrants
  // Iterates over all relation ends and checks if any need to change quadrants
  //--------------------------------------------------------------------

  this.quadrants = function ()
  {
    // Fix right connector box (1)
    var i=0;
    while(i<this.connectorRight.length){
      var xk=points[this.connectorRight[i].to].x;
      var yk=points[this.connectorRight[i].to].y;
      var bb=this.getquadrant(xk,yk);
      if(bb==3){
        conn=this.connectorRight.splice(i,1);
        this.connectorLeft.push(conn[0]);
      }else if(bb==0){
        conn=this.connectorRight.splice(i,1);
        this.connectorTop.push(conn[0]);
      }else if(bb==2){
        conn=this.connectorRight.splice(i,1);
        this.connectorBottom.push(conn[0]);
      }else{
        i++;
      }
    }

    // Fix left connector box (3)
    var i=0;
    while(i<this.connectorLeft.length){
      var xk=points[this.connectorLeft[i].to].x;
      var yk=points[this.connectorLeft[i].to].y;
      var bb=this.getquadrant(xk,yk);
      if(bb==1){
        conn=this.connectorLeft.splice(i,1);
        this.connectorRight.push(conn[0]);
      }else if(bb==0){
        conn=this.connectorLeft.splice(i,1);
        this.connectorTop.push(conn[0]);
      }else if(bb==2){
        conn=this.connectorLeft.splice(i,1);
        this.connectorBottom.push(conn[0]);
      }else{
        i++;
      }
    }

    // Fix top connector box (0)
    var i=0;
    while(i<this.connectorTop.length){
      var xk=points[this.connectorTop[i].to].x;
      var yk=points[this.connectorTop[i].to].y;
      var bb=this.getquadrant(xk,yk);
      if(bb==1){
        conn=this.connectorTop.splice(i,1);
        this.connectorRight.push(conn[0]);
      }else if(bb==3){
        conn=this.connectorTop.splice(i,1);
        this.connectorLeft.push(conn[0]);
      }else if(bb==2){
        conn=this.connectorTop.splice(i,1);
        this.connectorBottom.push(conn[0]);
      }else{
        i++;
      }
    }

        // Fix bottom connector box (2)
        var i=0;
        while(i<this.connectorBottom.length){
          var xk=points[this.connectorBottom[i].to].x;
          var yk=points[this.connectorBottom[i].to].y;
          var bb=this.getquadrant(xk,yk);
          if(bb==1){
            conn=this.connectorBottom.splice(i,1);
            this.connectorRight.push(conn[0]);
          }else if(bb==3){
            conn=this.connectorBottom.splice(i,1);
            this.connectorLeft.push(conn[0]);
          }else if(bb==0){
            conn=this.connectorBottom.splice(i,1);
            this.connectorTop.push(conn[0]);
          }else{
            i++;
          }
        }
      }

  //--------------------------------------------------------------------
  // adjust
  // Moves midpoint or other fixed point to geometric center of object again
  // Restricts resizing for classes
  //--------------------------------------------------------------------

  this.adjust = function ()
  {
    var x1=points[this.topLeft].x;
    var y1=points[this.topLeft].y;
    var hw=(points[this.bottomRight].x-x1)*0.5;
    var hh=(points[this.bottomRight].y-y1)*0.5;
    if(this.symbolkind==2||this.symbolkind==3){
      points[this.centerpoint].x=x1+hw;
      points[this.centerpoint].y=y1+hh;
    }else if(this.symbolkind==1){
      // Place middle divider point in middle between x1 and y1
      points[this.middleDivider].x=x1+hw;
      // If middle divider is below y2 set y2 to middle divider
      if(points[this.middleDivider].y>points[this.bottomRight].y) points[this.bottomRight].y=points[this.middleDivider].y;
      // If bottom right is below 0 set bottom right to top left
      if(hw<0) points[this.bottomRight].x=points[this.topLeft].x+150;
      // If top left is below middle divider set top left to middle divider
      if(points[this.topLeft].y>points[this.middleDivider].y) points[this.topLeft].y=points[this.middleDivider].y;
    }
  }


  //--------------------------------------------------------------------
  // sortConnector
  // Sorts the connector
  //--------------------------------------------------------------------

  this.sortConnector = function (connector,direction,start,end,otherside)
  {
    var pointcnt=connector.length+1;
    var delta=(end-start)/pointcnt;

    if(direction==1){
      // Vertical connector
      connector.sort(function(a, b) {
        var y1=points[a.to].y;
        var y2=points[b.to].y;
        return y1-y2;
      });
      var ycc=start;
      for(var i=0;i<connector.length;i++){
        ycc+=delta;
        points[connector[i].from].y=ycc;
        points[connector[i].from].x=otherside;
      }
    }else{
      connector.sort(function(a, b) {
        var x1=points[a.to].x;
        var x2=points[b.to].x;
        return x1-x2;
      });
      var ycc=start;
      for(var i=0;i<connector.length;i++){
        ycc+=delta;
        points[connector[i].from].y=otherside;
        points[connector[i].from].x=ycc;
      }
    }
    //        consloe.log(pointcnt);
  }

    //--------------------------------------------------------------------
    // sortAllConnectors
    // Sorts all connectors
    //--------------------------------------------------------------------

    this.sortAllConnectors = function ()
    {
      var x1=points[this.topLeft].x;
      var y1=points[this.topLeft].y;
      var x2=points[this.bottomRight].x;
      var y2=points[this.bottomRight].y;

      this.sortConnector(this.connectorRight,1,y1,y2,x2);
      this.sortConnector(this.connectorLeft,1,y1,y2,x1);
      this.sortConnector(this.connectorTop,2,x1,x2,y1);
      this.sortConnector(this.connectorBottom,2,x1,x2,y2);

    }
      //--------------------------------------------------------------------
      // sortAllConnectors
      // Sorts all connectors
      //--------------------------------------------------------------------

      this.sortAllConnectors = function ()
      {
        var x1=points[this.topLeft].x;
        var y1=points[this.topLeft].y;
        var x2=points[this.bottomRight].x;
        var y2=points[this.bottomRight].y;

        this.sortConnector(this.connectorRight,1,y1,y2,x2);
        this.sortConnector(this.connectorLeft,1,y1,y2,x1);
        this.sortConnector(this.connectorTop,2,x1,x2,y1);
        this.sortConnector(this.connectorBottom,2,x1,x2,y2);

      }

    //--------------------------------------------------------------------
    // move
    // Returns true if xk,yk is inside the bounding box of the symbol
    //--------------------------------------------------------------------

    this.inside = function (xk,yk)
    {
      var x1=points[this.topLeft].x;
      var y1=points[this.topLeft].y;
      var x2=points[this.bottomRight].x;
      var y2=points[this.bottomRight].y;

      if(xk>x1&&xk<x2&&yk>y1&&yk<y2){
        return true;
      }else{
        return false;
      }
    }

    //--------------------------------------------------------------------
    // linedist
    // Returns line distance to segment object e.g. line objects (currently only relationship markers)
    //--------------------------------------------------------------------

    this.linedist = function (xk,yk)
    {
      if(this.symbolkind==4){
        var x1=points[this.topLeft].x;
        var y1=points[this.topLeft].y;
        var x2=points[this.bottomRight].x;
        var y2=points[this.bottomRight].y;

        var px = x2-x1;
        var py = y2-y1;
        var len = px*px + py*py;
        var u = ((xk - x1) * px + (yk - y1) * py) / len;

        if(u > 1){
          u = 1;
        }else if(u < 0){
          u = 0;
        }

        var x = x1 + u * px;
        var y = y1 + u * py;
        px = x - xk;
        py = y - yk;

        dst = px*px + py*py;

        return dst;

      }else{
        return -1;
      }

    }

    //--------------------------------------------------------------------
    // move
    // Updates all points referenced by symbol
    //--------------------------------------------------------------------

    this.move = function (movex,movey)
    {
      points[this.topLeft].x+=movex;
      points[this.topLeft].y+=movey;
      points[this.bottomRight].x+=movex;
      points[this.bottomRight].y+=movey;
      if(this.symbolkind==1){
        points[this.middleDivider].x+=movex;
        points[this.middleDivider].y+=movey;
      }else if(this.symbolkind==2){
        points[this.centerpoint].x+=movex;
        points[this.centerpoint].y+=movey;
      }
    }

    //--------------------------------------------------------------------
    // delete
    // attempts to erase object completely from canvas
    //--------------------------------------------------------------------
    this.erase = function (){
      this.movePoints();
      this.deleteLines();
      //emptyConnectors();
    }

    //--------------------------------------------------------------------
    // movePoints
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.movePoints = function (){
      points[this.topLeft] = waldoPoint;
      points[this.bottomRight] = waldoPoint;
      points[this.centerpoint] = waldoPoint;
      points[this.middleDivider] = waldoPoint;
    }

    //--------------------------------------------------------------------
    // movePoints
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.deleteLines = function(){
      // Adds the different connectors into an array to reduce the amount of code
      var connectors = [this.connectorTop, this.connectorRight,  this.connectorBottom,  this.connectorLeft];

      for(i = 0; i < diagram.length; i++){
        var hasDeleted = false;
        var line = diagram[i];

        //Line
        if(line.symbolkind == 4){
          if(this.symbolkind == 2){
            //Deletes lines connected to object's centerpoint
            //Line always have topLeft and bottomRight if symbolkind == 4, because that means it's a line object
            if(line.topLeft == this.centerpoint || line.bottomRight == this.centerpoint) {
              diagram.delete(line);
              hasDeleted = true;
            }
          }

          else if(this.symbolkind == 3){
            hasDeleted = false;
            //Deletes lines connected to connectors top, right, bottom and left.
            for(var j = 0; j < connectors.length; j++){
              for (var k = 0; k < connectors[j].length; k++) {
                if (line.topLeft == connectors[j][k].from || line.bottomRight == connectors[j][k].from ||  line.topLeft == connectors[j][k].to || line.bottomRight == connectors[j][k].to) {
                  diagram.delete(line);

                  hasDeleted = true;;
                  break;
                }
              }
              if(hasDeleted){
                break;
              }
            }
          }
        }
        if(hasDeleted){
          i=-1;
        }
      }
    }

    //--------------------------------------------------------------------
    // draw
    // Redraws graphics
    //--------------------------------------------------------------------

    this.draw = function ()
    {

		if(this.sizeOftext == 'Tiny')
		{
			textsize = 14;
		}
		else if(this.sizeOftext == 'Small')
		{
			textsize = 20;
		}

		else if(this.sizeOftext == 'Medium')
		{
			textsize = 30;
		}

		else if(this.sizeOftext == 'Large')
		{
			textsize = 50;
		}
    else if(this.attributeType == 'Drive')
    {
    ctx.setLineDash([5, 4]);
    console.log("TEST");
    }
    else
    {
    textsize = 14;
    ctx.setLineDash([5, 0]);
    }


      var x1=points[this.topLeft].x;
      var y1=points[this.topLeft].y;

      var x2=points[this.bottomRight].x;
      var y2=points[this.bottomRight].y;



      if(this.symbolkind==1){
        var midy=points[this.middleDivider].y;

        ctx.font="bold "+parseInt(textsize)+"px Arial";

        // Clear Class Box
        ctx.fillStyle="#fff";
        ctx.fillRect(x1,y1,x2-x1,y2-y1);
        ctx.fillStyle="#246";

        if(this.targeted){
          ctx.strokeStyle="#F82";
        }else{
          ctx.strokeStyle="#253";
        }

        // Write Class Name
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
		ctx.fillStyle="#F0F";
		ctx.fillText(this.name,x1+((x2-x1)*0.5),y1+(0.85*this.textsize));


		if(this.key_type == 'Primary key'){
			var linelenght = ctx.measureText(this.name).width;
			ctx.beginPath(1);
			ctx.moveTo(x1+((x2-x1)*0.5), y1+(0.85*this.textsize));
			ctx.lineTo(x1+((x2-x1)*0.5), y1+(0.85*this.textsize));
			ctx.lineTo(x1+((x2-x1)*0.5)+linelenght, y1+(0.85*this.textsize)+10);
			ctx.strokeStyle = "#000";
			ctx.stroke();
		}

		// ctx.measureText(txt).width
		// beginpath - moveto - lineto
		// För att göra streckad linje rita med
		// ctx.setLineDash(segments);

        // Change Alignment and Font
        ctx.textAlign="start";
        ctx.textBaseline = "top";
        ctx.font=parseInt(this.textsize)+"px Arial";

        // Clipping of text and drawing of attributes
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1,y1+(this.textsize*1.5));

        ctx.lineTo(x2,y1+(this.textsize*1.5));
        ctx.lineTo(x2,midy);
        ctx.lineTo(x1,midy);
        ctx.lineTo(x1,y1+(this.textsize*1.5));
        ctx.clip();
        for(var i=0;i<this.attributes.length;i++){
          ctx.fillText(this.attributes[i].visibility+" "+this.attributes[i].text,x1+(this.textsize*0.3),y1+(this.textsize*1.7)+(this.textsize*i));
        }
        ctx.restore();

        // Clipping of text and drawing of methods
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1,midy);
        ctx.lineTo(x2,midy);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x1,midy);
        ctx.clip();
        ctx.textAlign="start";
        ctx.textBaseline = "top";
        for(var i=0;i<this.operations.length;i++){
          ctx.fillText(this.operations[i].visibility+" "+this.operations[i].text,x1+(this.textsize*0.3),midy+(this.textsize*0.2)+(this.textsize*i));
        }
        ctx.restore();

        // Box

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x1,y1);

        // Top Divider
        ctx.moveTo(x1,y1+(this.textsize*1.5));
        ctx.lineTo(x2,y1+(this.textsize*1.5));

        // Middie Divider
        ctx.moveTo(x1,midy);
        ctx.lineTo(x2,midy);

        ctx.stroke();
      }else if(this.symbolkind==2){

		//scale the text
		ctx.font="bold "+parseInt(textsize)+"px "+this.font;
        // Write Attribute Name
        ctx.textAlign="center";
        ctx.textBaseline = "middle";

        drawOval(x1,y1,x2,y2);
        ctx.fillStyle="#dfe";
        ctx.fill();
        if(this.targeted){
          ctx.strokeStyle="#F82";
          ctx.setLineDash([5, 0]);
        }else{
          ctx.strokeStyle="#253";
        }
        ctx.stroke();

        ctx.fillStyle="#253";
        ctx.fillStyle=this.fontColor;
        ctx.fillText(this.name,x1+((x2-x1)*0.5),(y1+((y2-y1)*0.5)));

		if(this.key_type == 'Primary key')
		{
			var linelenght = ctx.measureText(this.name).width;
			ctx.beginPath(1);
			ctx.moveTo(x1+((x2-x1)*0.5), (y1+((y2-y1)*0.5))+10);
			ctx.lineTo(x1+((x2-x1)*0.5)-(linelenght*0.5), (y1+((y2-y1)*0.5))+10);
			ctx.lineTo(x1+((x2-x1)*0.5)+(linelenght*0.5), (y1+((y2-y1)*0.5))+10);
			ctx.strokeStyle = "#000";
			ctx.stroke();
		}

      }else if(this.symbolkind==3){

		//scale the text
    ctx.font="bold "+parseInt(textsize)+"px "+this.font;
        // Write Attribute Name
        ctx.textAlign="center";
        ctx.textBaseline = "middle";

        ctx.beginPath();
        if (this.type == "weak") {
          ctx.moveTo(x1 - 5, y1 - 5);
          ctx.lineTo(x2 + 5, y1 - 5);
          ctx.lineTo(x2 + 5, y2 + 5);
          ctx.lineTo(x1 - 5, y2 + 5);
          ctx.lineTo(x1 - 5, y1 - 5);
        }
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x1,y2);
        ctx.lineTo(x1,y1);

        ctx.fillStyle="#dfe";
        ctx.fill();
        if(this.targeted){
          ctx.strokeStyle="#F82";
        }else{
          ctx.strokeStyle="#253";
        }
        ctx.stroke();

        ctx.fillStyle="#253";
        ctx.fillStyle=this.fontColor;
        ctx.fillText(this.name,x1+((x2-x1)*0.5),(y1+((y2-y1)*0.5)));

      }else if(this.symbolkind==4){
        // ER Attribute relationship is a single line
        if(this.sel || this.targeted){
          ctx.strokeStyle="#F82";
        }else{
          ctx.strokeStyle="#000";
        }
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();

        ctx.strokeStyle="#000";
    }
  }
}
