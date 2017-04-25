var querystring=parseGet();
var retdata;

AJAXService("get",{},"DIAGRAM");

/*

-----------------------=====================##################=====================-----------------------
		Layout (curve drawing tools)
-----------------------=====================##################=====================-----------------------

		Path - A collection of segments
				fill color
				line color
				a number of segments
	 Segment - A collection of curves connecting points
	 Point - A 2d coordinate

*/

// Global settings
var gridSize = 16;

var crossl=4.0;				// Size of point cross
var tolerance = 8;		// Size of tolerance area around the point
var ctx;							// Canvas context
var acanvas;					// Canvas Element
var sel;							// Selection state
var cx,cy=0;					// Current Mouse coordinate x and y
var sx,sy=0;					// Start Mouse coordinate x and y
var zv = 1.00;				// The value of the zoom
var mox,moy=0;				// Old mouse x and y
var md=0;							// Mouse state
var hovobj=-1;
var lineStartObj = -1;
var movobj=-1;				// Moving object ID
var selobj = -1;			// The last selected object
var uimode="normal";		// User interface mode e.g. normal or create class currently
var figureMode = null;		// Specification of uimode, when Create Figure is set to the active mode this is set to one of the forms a figure can be drawn in.
var widthWindow;			// The width on the users screen is saved is in this var.
var heightWindow;			// The height on the users screen is saved is in this var.
var consoleInt = 0;
var startX=0; var startY=0;			// Current X- and Y-coordinant from which the canvas start from
var waldoPoint = {x:-10,y:-10,selected:false};
var activePoint = null; //This point indicates what point is being hovered by the user
var p1=null,					// When creating a new figure, these two variables are used ...
 		p2=null;					// to keep track of points created with mousedownevt and mouseupevt
var snapToGrid = true; // Will the clients actions snap to grid
// set the color for the crosses.
var crossStrokeStyle1 = "#f64";
var crossfillStyle = "#d51";
var crossStrokeStyle2 = "#d51";

//the minimum size for an Enitny are set by the values seen below.
var minEntityX = 100;
var minEntityY = 50;

var attributeTemplate = { // Defines entity/attribute/relations predefined sizes
  width: 7*gridSize,
  height: 4*gridSize
};
var entityTemplate = {
  width: 6*gridSize,
  height: 3*gridSize
};
var relationTemplate = {
  width: 8*gridSize,
  height: 4*gridSize
};
var classTemplate = {
  width: 6*gridSize,
  height: 7*gridSize
};


var a,b,c;
a = [];
b = [];
c = [];

var mousedownX = 0; var mousedownY = 0;	// Is used to save the exact coordinants when pressing mousedown while in the "Move Around"-mode
var mousemoveX = 0; var mousemoveY = 0; // Is used to save the exact coordinants when moving aorund while in the "Move Around"-mode
var mouseDiffX = 0; var mouseDiffY = 0; // Saves to diff between mousedown and mousemove to know how much to translate the diagram

var xPos = 0;
var yPos = 0;

//this block of the code is used to handel keyboard input;
window.addEventListener("keydown",this.keyDownHandler, false);

function keyDownHandler(e){
	var key = e.keyCode;

	//Delete selected objects when del key is pressed down.
	if(key == 46){
		eraseSelectedObject();
	}
}

//--------------------------------------------------------------------
// points - stores a global list of points
// A point can not be physically deleted but marked as deleted in order to reuse
// the sequence number again. e.g. point[5] will remain point[5] until it is deleted
//--------------------------------------------------------------------

var points=[
						// Path A -- Segment 1 (0,1,2,3)
						{x:20,y:200,selected:0},{x:60,y:200,selected:0},{x:100,y:40,selected:0},{x:140,y:40,selected:0},
						// Path B -- Segment 1 (4,5 and 17,18)
						{x:180,y:200,selected:0},{x:220,y:200,selected:0},
						// Path A -- Segment 2 (6,7,8,9)
						{x:300,y:250,selected:0},{x:320,y:250,selected:0},{x:320,y:270,selected:0},{x:300,y:270,selected:0},
            // Path C -- Segment 1 (10,11,12,13)
            {x:70,y:130,selected:0},{x:70,y:145,selected:0},{x:170,y:130,selected:0},{x:170,y:145,selected:0},
            // Class A -- TopLeft BottomRight MiddleDivider 14,15,16
            {x:310,y:60,selected:0},{x:400,y:160,selected:0},{x:355,y:115,selected:0},
						// Path B -- Segment 1 (4,5 and 17,18)
            {x:100,y:40,selected:0},{x:140,y:40,selected:0},
						// ER Attribute A -- TopLeft BottomRight MiddlePointConnector 19,20,21
            {x:300,y:200,selected:0},{x:400,y:250,selected:0},{x:350,y:225,selected:0},
						// ER Attribute B -- TopLeft BottomRight MiddlePointConnector 22,23,24
            {x:300,y:275,selected:0},{x:400,y:325,selected:0},{x:350,y:300,selected:0},
						// ER Entity A -- TopLeft BottomRight MiddlePointConnector 25,26,27
            {x:150,y:275,selected:0},{x:250,y:325,selected:0},{x:200,y:300,selected:0},
						// ER Entity Connector Right Points -- 28,29
            {x:225,y:290,selected:1},
            {x:225,y:310,selected:1},

						// ER Attribute C -- TopLeft BottomRight MiddlePointConnector 30,31,32
					  {x:15,y:275,selected:0},{x:115,y:325,selected:0},{x:65,y:300,selected:0},
						// ER Attribute D -- TopLeft BottomRight MiddlePointConnector 33,34,35
						{x:15,y:350,selected:0},{x:115,y:400,selected:0},{x:65,y:375,selected:0},
						// ER Attribute E -- TopLeft BottomRight MiddlePointConnector 36,37,38
            {x:15,y:200,selected:0},{x:115,y:250,selected:0},{x:65,y:225,selected:0},

						// ER Entity Connector Left Points -- 39,40,41
					  {x:150,y:225,selected:0},
					  {x:150,y:235,selected:0},
					  {x:150,y:245,selected:0},

           ];

//--------------------------------------------------------------------
// addpoint
// Creates a new point and returns index of that point
//--------------------------------------------------------------------

points.addpoint = function (xk,yk,selval)
{
		var newpnt={x:xk,y:yk,selected:selval};
		var pos=this.length;
		this.push(newpnt);
		return pos;
}

//--------------------------------------------------------------------
// drawpoints
// Draws each of the points as a cross
//--------------------------------------------------------------------

points.drawpoints = function ()
{
		// Mark points
		ctx.strokeStyle= crossStrokeStyle1;
		ctx.lineWidth=2;
		for(var i=0;i<this.length;i++){
				var point=this[i];

				if(point.selected==0){
						ctx.beginPath();
						ctx.moveTo(point.x-crossl,point.y-crossl);
						ctx.lineTo(point.x+crossl,point.y+crossl);
						ctx.moveTo(point.x+crossl,point.y-crossl);
						ctx.lineTo(point.x-crossl,point.y+crossl);
						ctx.stroke();
				}else{
						ctx.save();
						ctx.fillStyle= crossfillStyle;
						ctx.strokeStyle= crossStrokeStyle2;
						ctx.fillRect(point.x-crossl,point.y-crossl,crossl*2,crossl*2);
						ctx.strokeRect(point.x-crossl,point.y-crossl,crossl*2,crossl*2);
						ctx.restore();
				}

		}
		ctx.lineWidth=1;
}

//--------------------------------------------------------------------
// distancepoint
// Returns the distance to closest point and the index of that point
//--------------------------------------------------------------------

points.distance = function(xk,yk)
{
		var dist=50000000;
		var ind=-1;
		for(i=0;i<this.length;i++){
				var dx=xk-this[i].x;
				var dy=yk-this[i].y;

				var dd=(dx*dx)+dy*dy;
				if(dd<dist){
						dist=dd;
						ind=i;
				}
		}

		return {dist:Math.sqrt(dist),ind:ind};
}

points.distanceBetweenPoints = function( x1, y1, x2, y2, axis) {

	xs = x2 - x1;
    ys = y2 - y1;

    if(axis==true) {
        return xs;
    }
    else {
    	return ys;
	}
}



//--------------------------------------------------------------------
// clearsel
// Clears all selects from the array "points"
//--------------------------------------------------------------------

points.clearsel = function()
{
		for(i=0;i<this.length;i++){
				this[i].selected=0;
		}
}

//--------------------------------------------------------------------
// diagram - stores a global list of diagram objects
// A diagram object could for instance be a path, or a symbol
//--------------------------------------------------------------------

var diagram=[];

//--------------------------------------------------------------------
// draw - executes draw methond in all diagram objects
//--------------------------------------------------------------------
diagram.draw = function () {
	// On every draw of diagram adjust the midpoint if there is one to adjust
	this.adjust();
	// Render figures
	for(i = 0; i < this.length; i++) {
		if(this[i].kind == 1) {
			this[i].draw(1, 1);
		}
	}
	for(i = 0; i < this.length; i++) {
		if(this[i].symbolkind == 4) {
			this[i].draw();
		}
	}
	for(i = 0; i < this.length; i++) {
		if(this[i].kind == 2 && !(this[i].symbolkind == 4)) {
			this[i].draw();
		}
	}
}

//--------------------------------------------------------------------
// adjust - adjusts all the fixed midpoints or other points of interest to the actual geometric midpoint of the symbol
//--------------------------------------------------------------------

diagram.adjust = function ()
{
		for(i=0;i<this.length;i++){
				item=this[i];

				// Diagram item
				if(item.kind==2){
						item.adjust();
				}

		}

}
//--------------------------------------------------------------------
// delete - deletes sent object from diagram
//--------------------------------------------------------------------

diagram.delete = function (object)
{
	for(i=0;i<this.length;i++){
		if(this[i]==object){
    		this.splice(i,1);
  	}
	}
}

//--------------------------------------------------------------------
// inside - executes inside methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.insides = function (ex,ey,sx,sy)
{
	//ensure that an entity cannot scale below the minimum size
	for(i=0;i<this.length;i++){
		if(!(this[i].kind == 1)){
			if(points[this[i].topLeft].x > points[this[i].bottomRight].x || points[this[i].topLeft].x >points[this[i].bottomRight].x -minEntityX){
				points[this[i].topLeft].x = points[this[i].bottomRight].x -minEntityX;
			}
			if(points[this[i].topLeft].y > points[this[i].bottomRight].y ||points[this[i].topLeft].y > points[this[i].bottomRight].y -minEntityY){
					points[this[i].topLeft].y = points[this[i].bottomRight].y -minEntityY;
			}

		}
	}

	for(i=0;i<this.length;i++){
		if (sx > ex){
			var tempa = ex;
			ex = sx;
			sx = tempa;
		}
		if (sy > ey){
			var tempb = ey;
			ey=sy;
			sy=tempb;
		}
		if(!(this[i].kind == 1)){

		var tx = points[this[i].topLeft].x;
		var ty = points[this[i].topLeft].y;
		var bx = points[this[i].bottomRight].x;
		var by = points[this[i].bottomRight].y;


		if(sx < tx && ex > tx && sy < ty && ey > ty && sx < bx && ex > bx && sy < by && ey > by){
			this[i].targeted = true;
			// return i;
		} else {
			this[i].targeted = false;
			}
		}
	}

	return -1;
}

diagram.inside = function (xk,yk)
{
		for(i=0;i<this.length;i++){
				item=this[i];
				if(item.kind==2){
						var insided=item.inside(xk,yk);
						if(insided==true) return i;
				}

		}

		return -1;
}


//--------------------------------------------------------------------
// inside - executes linedist methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------

diagram.linedist = function (xk,yk)
{
		for(i=0;i<this.length;i++){
				item=this[i];

				if(item.kind==2){
						var insided=item.linedist(xk,yk);
						if(insided!=-1&&insided<15){
								item.sel=true;
						}else{
								item.sel=false;
						}
				}

		}

		return -1;
}
//--------------------------------------------------------------------
// eraseObjectLines - removes all the lines connected to an object
//--------------------------------------------------------------------
diagram.eraseObjectLines = function(object, private_lines){
  for(j = 0; j < private_lines.length; j++){
    console.log(private_lines[j].to);
    if(private_lines[j].topLeft != object.centerpoint){
      points[private_lines[j].topLeft] = waldoPoint;
    }
    else if(private_lines[j].bottomRight != object.centerpoint){
      points[private_lines[j].bottomRight] = waldoPoint;
    }

    diagram.delete(private_lines[j]);
  }
}
//--------------------------------------------------------------------
// inside - executes linedist methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.getLineObjects = function (){
  var lines = new Array();
  for(i = 0; i < this.length; i++){
    if(diagram[i].symbolkind == 4){
      lines.push(diagram[i]);
    }
  }
  return lines;
}

//--------------------------------------------------------------------
// path - stores a number of segments
//--------------------------------------------------------------------

function Path() {
		this.kind=1;							// Path kind

		this.segments=Array();		// Segments
		this.sel;									// Selected object info
		this.intarr=Array();			// Intersection list (one list per segment)

		this.tmplist=Array();			// Temporary list for testing of intersections
		this.auxlist=Array();			// Auxillary temp list for testing of intersections

		this.fillColor="#48B";		// Fill color (default is blueish)
		this.strokeColor="#246";	// Stroke color (default is dark blue)
		this.Opacity=0.5;					// Opacity (default is 50%)
		this.linewidth=3;					// Line Width (stroke width - default is 3 pixels)

		this.isorganized=true;			// This is true if segments are organized e.g. can be filled using a single command since segments follow a path 1,2-2,5-5,9 etc
																// An organized path can contain several sub-path, each of which must be organized

		//--------------------------------------------------------------------
		// move
		// Performs a delta-move on all points in a path
		//--------------------------------------------------------------------

    this.move = function(movex,movey)
    {
						// Mar all segment points as unmoved
						for(var i=0;i<this.segments.length;i++){
								var seg=this.segments[i];
								points[seg.pa].moved=false;
								points[seg.pb].moved=false;
						}

						// Move segments that have not previously been moved
						for(var i=0;i<this.segments.length;i++){
								var seg=this.segments[i];

								if(points[seg.pa].moved==false){
										points[seg.pa].x+=movex;
										points[seg.pa].y+=movey;
										points[seg.pa].moved=true;
								}
								if(points[seg.pb].moved==false){
										points[seg.pb].x+=movex;
										points[seg.pb].y+=movey;
										points[seg.pb].moved=true;
								}

						}
    }

		//--------------------------------------------------------------------
		// addsegment
		// Adds a segment to a path
		//--------------------------------------------------------------------

    this.addsegment = function(kind, p1, p2, p3, p4, p5, p6, p7, p8)
    {
    		// Line segment (only kind of segment at the moment)
    		if(kind==1){
    				// Only push segment if it does not already exist
    				if(!this.existsline(p1,p2,this.segments)){
    						this.segments.push({kind:1,pa:p1,pb:p2});
    				}
    		}else{
    				alert("Unknown segment type: "+kind);
    		}
    }

		//--------------------------------------------------------------------
		// addsegment
		// Draws filled path to screen (or svg when that functionality is added)
		//--------------------------------------------------------------------

    this.draw = function (fillstate, strokestate)
    {
				if(this.isorganized==false) alert("Only organized paths can be filled!");
				if(this.segments.length>0){

						// Assign stroke style, color, transparency etc
						ctx.strokeStyle=this.strokeColor;
						ctx.fillStyle=this.fillColor;
						ctx.globalAlpha=this.Opacity;
						ctx.lineWidth=this.linewidth;
						ctx.beginPath();

						var pseg=this.segments[0];
						ctx.moveTo(points[pseg.pa].x,points[pseg.pa].y);

						for(var i=0;i<this.segments.length;i++){
								var seg=this.segments[i];

								// If we start over on another sub-path, we must start with a moveto
								if(seg.pa!=pseg.pb){
										ctx.moveTo(points[seg.pa].x,points[seg.pa].y);
								}

								// Draw current line

								ctx.lineTo(points[seg.pb].x, points[seg.pb].y);

								// Remember previous segment
								pseg=seg;
						}

						// Make either stroke or fill or both -- stroke always after fill
						if(fillstate) ctx.fill();
						if(strokestate) ctx.stroke();

						// Reset opacity so that following draw operations are unaffected
						ctx.globalAlpha=1.0;
				}

    }

		//--------------------------------------------------------------------
		// inside
		// Returns true if coordinate xk,yk falls inside the bounding box of the symbol
		//--------------------------------------------------------------------

    this.inside = function (xk,yk)
		{
						// Count Crossing linear segments
						var crosses=0;

						// Check against segment list
						for(var i=0;i<this.segments.length;i++){
								var item=this.segments[i];

								var pax=points[item.pa].x;
								var pbx=points[item.pb].x;
								var pay=points[item.pa].y;
								var pby=points[item.pb].y;

								var dx=pbx-pax;
								var dy=pby-pay;
								var dd=dx/dy;

								// Returning working cross even if line goes top to bottom
								if(pby<pay){
										if (yk>pby&&yk<pay&&((((yk-pay)*dd)+pax)<xk)){
												crosses++;
										}
								}else{
										if (yk>pay&&yk<pby&&((((yk-pay)*dd)+pax)<xk)){
												crosses++;
										}
								}

						}

						// Add one to reverse truth value e.g. 0 if 1 etc
						return (crosses+1)%2;
		}


		//--------------------------------------------------------------------
		// recursetest
		// Recursively splits a line at intersection points from top to bottom until there is no line left
		//--------------------------------------------------------------------

		this.recursetest = function(p1,p2)
		{
				var yk=5000;
				var endres=null;
				for(var i=0;i<this.segments.length;i++){
						bitem=this.segments[i];
						var result=this.intersection(p1,p2,bitem.pa,bitem.pb);
						if(result.state==true&&result.y<yk){
								yk=result.y;
								endres=result;
						}
				}
				if(yk!=5000){
						// Create new point (if it does not already exist)
						pointno=points.length
						points.push({x:endres.x,y:endres.y});

						// Depending on direction of p1 and p2
						if(points[p2].y<points[p1].y){
								this.tmplist.push({kind:1,pa:pointno,pb:p2});
								this.recursetest(pointno,p1);
						}else{
								this.tmplist.push({kind:1,pa:pointno,pb:p1});
								this.recursetest(pointno,p2);
						}
				}else{
						this.tmplist.push({kind:1,pa:p1,pb:p2});
				}
		}

		//--------------------------------------------------------------------
		// intersection
		// Line to line intersection
		// Does not detect intersections on end points (we do not want end points to be part of intersection set)
		//--------------------------------------------------------------------

		this.intersection = function(p1,p2,p3,p4) {

				var x1=points[p1].x;
				var y1=points[p1].y;

				var x2=points[p2].x;
				var y2=points[p2].y;

				var x3=points[p3].x;
				var y3=points[p3].y;

				var x4=points[p4].x;
				var y4=points[p4].y;

				// Basic fix for straight lines
				if(x1==x2) x2+=0.01;
				if(y1==y2) y2+=0.01;
				if(x3==x4) x4+=0.01;
				if(y3==y4) y4+=0.01;

		    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
		    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

		    if (isNaN(x)||isNaN(y)) {
		        return {state:false,x:0,y:0};
		    } else {
		        if (x1>=x2) {
		            if (!(x2<x&&x<x1)) return {state:false,x:0,y:0};
		        } else {
		            if (!(x1<x&&x<x2)) return {state:false,x:0,y:0};
		        }
		        if (y1>=y2) {
		            if (!(y2<y&&y<y1)) return {state:false,x:0,y:0};
		        } else {
		            if (!(y1<y&&y<y2)) return {state:false,x:0,y:0};
		        }
		        if (x3>=x4) {
		            if (!(x4<x&&x<x3)) return {state:false,x:0,y:0};
		        } else {
		            if (!(x3<x&&x<x4)) return {state:false,x:0,y:0};
		        }
		        if (y3>=y4) {
		            if (!(y4<y&&y<y3)) return {state:false,x:0,y:0};
		        } else {
		            if (!(y3<y&&y<y4)) return {state:false,x:0,y:0};
		        }
		    }
		    return {state:true,x:x,y:y};
		}

		//--------------------------------------------------------------------
		// existsline
		// Checks if a line already exists but in the reverse direction
		// Only checks lines, not bezier curves
		//--------------------------------------------------------------------

		this.existsline = function (p1,p2,segmentset)
		{
				if(p1==p2) return true;
				for(var i=0;i<segmentset.length;i++){
						var segment=segmentset[i];
						if((segment.pa==p1&&segment.pb==p2)||(segment.pa==p2&&segment.pb==p1)) return true;
				}
				return false;
		}

		//--------------------------------------------------------------------
		// recursetest
		// Line to line intersection
		// Does not detect intersections on end points (we do not want end points to be part of intersection set)
		//--------------------------------------------------------------------

		this.boolOp = function (otherpath)
		{
				// Clear temporary lists used for merging paths
				this.tmplist=[];
				this.auxlist=[];
				otherpath.tmplist=[];
				otherpath.auxlist=[];

				// Recurse local segment set and check for crossing lines
				for(var i=0;i<otherpath.segments.length;i++){
						var item=otherpath.segments[i];
						this.recursetest(item.pa,item.pb);
				}

				// Check if each segment is inside the joining set
				for(var i=0;i<this.tmplist.length;i++){
						var item=this.tmplist[i];

						// Check if center of line is inside or outside
						var p1=points[item.pa];
						var p2=points[item.pb];
						var xk=(p1.x+p2.x)*0.5;
						var yk=(p1.y+p2.y)*0.5;

						if(this.inside(xk,yk,otherpath)){
    						if(!this.existsline(item.pa,item.pb,this.auxlist)){
										this.auxlist.push(item);
								}
						}
				}

				// Recurse into joining segment set and check for crossing lines
				for(var i=0;i<this.segments.length;i++){
						var item=this.segments[i];
						otherpath.recursetest(item.pa,item.pb);
				}

				// Check if each segment is inside the local set
				for(var i=0;i<otherpath.tmplist.length;i++){
						var item=otherpath.tmplist[i];

						// Check if center of line is inside or outside
						var p1=points[item.pa];
						var p2=points[item.pb];
						var xk=(p1.x+p2.x)*0.5;
						var yk=(p1.y+p2.y)*0.5;

						if(otherpath.inside(xk,yk,this)){
    						if(!this.existsline(item.pa,item.pb,this.auxlist)){
										this.auxlist.push(item);
								}
						}
				}

				alert(this.auxlist.length);

				this.drawsegments(this.auxlist);
		}

		//--------------------------------------------------------------------
		// drawsegments
		// Debug drawing of a segment set (for example for drawing tmplist, auxlist etc)
		//--------------------------------------------------------------------

		this.drawsegments = function (segmentlist, color)
		{
				// Draw aux set
				ctx.lineWidth=1;
				ctx.strokeStyle="#46f";
				for(var i=0;i<segmentlist.length;i++){
						var line=segmentlist[i];

						// If line is a straight line
						if(line.kind==1){
								ctx.beginPath();
								ctx.moveTo(points[line.pa].x,points[line.pa].y);
								ctx.lineTo(points[line.pb].x,points[line.pb].y);
								ctx.stroke();
						}

				}
		}

    this.erase = function(){
      for(i = 0; i < this.segments.length; i++){
          points[this.segments[i].pa] = waldoPoint;
          points[this.segments[i].pb] = waldoPoint;
        }
    }
}

function initcanvas()
{
    widthWindow = (window.innerWidth-20);
	heightWindow = (window.innerHeight-220);
	document.getElementById("canvasDiv").innerHTML="<canvas id='myCanvas' style='border:1px solid #000000;' width='"+(widthWindow*zv)+"' height='"+(heightWindow*zv)+"' onmousemove='mousemoveevt(event,this);' onmousedown='mousedownevt(event);' onmouseup='mouseupevt(event);'></canvas>";
	document.getElementById("valuesCanvas").innerHTML="<p>Zoom: "+Math.round((zv*100))+"% | Coordinates: X="+startX+" & Y="+startY+"</p>"
	var canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
				acanvas=document.getElementById("myCanvas");
		}
		getUploads();
		makegfx();

	updategfx();

	document.getElementById("moveButton").addEventListener('click', movemode, false);
	document.getElementById("zoomInButton").addEventListener('click', zoomInMode, false);
	document.getElementById("zoomOutButton").addEventListener('click', zoomOutMode, false);
	canvas.addEventListener('dblclick', doubleclick, false);

}
// Function to enable and disable the grid, functionality is related to cx and cy

function enableGrid(element){
  if(snapToGrid == false){
    snapToGrid = true;
  }
  else{
    snapToGrid = false;
  }
}

// Function for the zoom in and zoom out in the canvas element

function zoomInMode(e){
	uimode="Zoom";
	var canvas = document.getElementById("myCanvas");
	canvas.removeEventListener('click', zoomOutClick, false);
	canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
	var zoomInClass = document.getElementById("zoomInButton").className;
	var zoomInButton = document.getElementById("zoomInButton");
	document.getElementById("zoomOutButton").className="unpressed";
	document.getElementById("moveButton").className="unpressed";
	if(zoomInClass == "unpressed"){
		canvas.removeEventListener('dblclick', doubleclick, false);
		zoomInButton.className="pressed";
		canvas.style.cursor="zoom-in";
		canvas.addEventListener("click", zoomInClick, false);
	}else{
		zoomInButton.className="unpressed";
		canvas.addEventListener("dblclick", doubleclick, false);
		canvas.removeEventListener("click", zoomInClick, false);
		canvas.style.cursor="default";
	}
}

function zoomOutMode(e){
	uimode="Zoom";
	var canvas = document.getElementById("myCanvas");
	canvas.removeEventListener('click', zoomInClick, false);
	canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
	var zoomOutClass = document.getElementById("zoomOutButton").className;
	var zoomOutButton = document.getElementById("zoomOutButton");
	document.getElementById("zoomInButton").className="unpressed";
	document.getElementById("moveButton").className="unpressed";
	if(zoomOutClass == "unpressed"){
		canvas.removeEventListener('dblclick', doubleclick, false);
		zoomOutButton.className="pressed";
		canvas.style.cursor="zoom-out";
		canvas.addEventListener("click", zoomOutClick, false);
	}else{
		zoomOutButton.className="unpressed";
		canvas.addEventListener("dblclick", doubleclick, false);
		canvas.removeEventListener("click", zoomOutClick, false);
		canvas.style.cursor="default";
	}
}

function zoomInClick(){
	zv+=0.1;
	reWrite();
	ctx.scale(1.1,1.1);
}

function zoomOutClick(){
	zv-=0.1;
	reWrite();
	ctx.scale(0.9,0.9);
}
function getUploads() {
    document.getElementById('buttonid').addEventListener('click', openDialog);
    function openDialog() {
        document.getElementById('fileid').click();
    }

    document.getElementById('fileid').addEventListener('change', submitFile);
    function submitFile() {

        var reader = new FileReader();
        var file = document.getElementById('fileid').files[0];
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            a = evt.currentTarget.result;
			LoadFile();
        }



        // LoadFile();
    }
}
// Function that is used for the resize
// Making the page more responsive

function canvassize()
{
	widthWindow = (window.innerWidth-20);
	heightWindow = (window.innerHeight-244);
	document.getElementById("myCanvas").setAttribute("width", widthWindow);
	document.getElementById("myCanvas").setAttribute("height", heightWindow);
	ctx.clearRect(startX,startY,widthWindow,heightWindow);
	ctx.translate(startX,startY);
	ctx.scale(1,1);
	ctx.scale(zv,zv);
}

// Listen if the window is the resized

window.addEventListener('resize', canvassize);

var erEntityA;

// Demo data for testing purposes.


function updategfx()
{
		ctx.clearRect(startX,startY,widthWindow,heightWindow);
    drawGrid();
		// Here we explicitly sort connectors... we need to do this dynamically e.g. diagram.sortconnectors
		erEntityA.sortAllConnectors();

		// Redraw diagram
		diagram.draw();

// Make a bool operation between PathA and PathB
//		pathA.boolOp(pathC);

		// Draw all points as crosses
		points.drawpoints();

		// Draw all symbols


}

// Recursive Pos of div in document - should work in most browsers
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return {
				x:curleft,
				y:curtop
		}
}
function updateActivePoint(){
  if(sel.dist <= tolerance){
    activePoint = sel.ind;
  }
  else{
    activePoint = null;
  }
}
function mousemoveevt(ev, t){
		xPos = ev.clientX;
		yPos = ev.clientY;
		mox=cx;
		moy=cy;
	    hovobj = diagram.inside(cx,cy);
		if (ev.pageX || ev.pageY == 0){ // Chrome
      cx=ev.pageX-acanvas.offsetLeft;
			cy=ev.pageY-acanvas.offsetTop;
		} else if (ev.layerX||ev.layerX==0) { // Firefox
			cx=ev.layerX-acanvas.offsetLeft;
			cy=ev.layerY-acanvas.offsetTop;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			cx=ev.offsetX-acanvas.offsetLeft;
			cy=ev.offsetY-acanvas.offsetTop;
		}
    if(md==1 || md==2 || md==0 && uimode != " "){
      if(snapToGrid){
        cx=Math.round(cx/gridSize)*gridSize
        cy=Math.round(cy/gridSize)*gridSize;
      }
    }
		if(md==0){
				// Select a new point only if mouse is not already moving a point or selection box
				sel=points.distance(cx,cy);

				// If mouse is not pressed highlight closest point
				points.clearsel();

				movobj=diagram.inside(cx,cy);

        updateActivePoint();

		}else if(md==1){
				// If mouse is pressed down and no point is close show selection box
		}else if(md==2){
            // If mouse is pressed down and at a point in selected object - move that point
            // Changes relations size as mirrored.
            if (diagram[selobj].bottomRight == sel.ind && diagram[selobj].symbolkind==5) {
                points[diagram[selobj].bottomRight].x = cx;
                points[diagram[selobj].bottomRight].y = cy;
            	points[diagram[selobj].topLeft].x = points[diagram[selobj].middleDivider].x - points.distanceBetweenPoints(points[diagram[selobj].middleDivider].x, points[diagram[selobj].middleDivider].y, points[sel.ind].x, points[sel.ind].y, true);
                points[diagram[selobj].topLeft].y = points[diagram[selobj].middleDivider].y - points.distanceBetweenPoints(points[diagram[selobj].middleDivider].x, points[diagram[selobj].middleDivider].y, points[sel.ind].x, points[sel.ind].y, false);
			}
            else if (diagram[selobj].topLeft == sel.ind && diagram[selobj].symbolkind==5) {
                points[diagram[selobj].topLeft].x = cx;
                points[diagram[selobj].topLeft].y = cy;
                points[diagram[selobj].bottomRight].x = points[diagram[selobj].middleDivider].x + points.distanceBetweenPoints(points[sel.ind].x, points[sel.ind].y, points[diagram[selobj].middleDivider].x, points[diagram[selobj].middleDivider].y, true);
                points[diagram[selobj].bottomRight].y = points[diagram[selobj].middleDivider].y + points.distanceBetweenPoints(points[sel.ind].x, points[sel.ind].y, points[diagram[selobj].middleDivider].x, points[diagram[selobj].middleDivider].y, false);
            }
            else {
                points[sel.ind].x = cx;
                points[sel.ind].y = cy;
            }
        }
		else if(md==3){
				// If mouse is pressed down inside a movable object - move that object
				if(movobj!=-1){
					for (var i=0;i<diagram.length;i++){
						if(diagram[i].targeted == true){
              if(snapToGrid){
                cx=Math.round(cx/gridSize)*gridSize
                cy=Math.round(cy/gridSize)*gridSize;
              }
              diagram[i].move(cx-mox,cy-moy);
						}
					}
				}
		}
		diagram.linedist(cx,cy);

		cx+=startX;
		cy+=startY;

		updategfx();

		// Update quadrants -- This for-loop needs to be moved to a diragram method, just like updategfx or even inside updategfx
		for(i=0;i<diagram.length;i++){
				item=diagram[i];
				// Diagram item
				if(item.symbolkind==3){
						item.quadrants();
				}

		}

		// Draw select or create dotted box
		if(md==4){
				ctx.setLineDash([3, 3]);
				ctx.beginPath(1);
				ctx.moveTo(sx,sy);
				ctx.lineTo(cx,sy);
				ctx.lineTo(cx,cy);
				ctx.lineTo(sx,cy);
				ctx.lineTo(sx,sy);
				ctx.strokeStyle = "#d51";
				ctx.stroke();
            	ctx.setLineDash([]);
            	ctx.closePath(1);
            	if(ghostingcrosses == true){
                    crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
                    crossfillStyle = "rgba(255, 102, 68, 0.0)";
                    crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
				}


		}
}

function mousedownevt(ev)
{
    if(uimode=="CreateLine"){
      md=4;			// Box select or Create mode.
      sx=cx;
      sy=cy;
      sel=points.distance(cx,cy);

      if(hovobj==-1){
        p1=points.addpoint(cx,cy,false);
      }
      else{
        lineStartObj = hovobj;

        if(diagram[lineStartObj].symbolkind==2){
          p1=diagram[lineStartObj].centerpoint;
        }else if(diagram[lineStartObj].symbolkind==5){
          p1=diagram[lineStartObj].middleDivider;
		} else{
          p1=points.addpoint(cx,cy,false);
        }
        //p1=diagram[hovobj].centerpoint;
      }

    }
		else if(uimode!="CreateFigure"&&sel.dist<tolerance){
				md=2;
		}else if(movobj!=-1){
				md=3;

        //Last moved object
			//if(selobj != -1){
          //		diagram[selobj].targeted = false;
       		// }
			selobj=diagram.inside(cx,cy);
			//;

				if (diagram[selobj].targeted == false){
					for (var i=0;i<diagram.length;i++){
						diagram[i].targeted=false;
				}
					diagram[selobj].targeted = true

			}


		}else{
				md=4;			// Box select or Create mode.
				sx=cx;
				sy=cy;
		}

}


function doubleclick(ev)
{
	var posistionX = (startX+xPos);
	var posistionY = (startY+yPos);
	console.log(posistionX+" | "+posistionY);
	if(diagram[selobj].targeted == true){
        openAppearanceDialogMenu();
        document.getElementById('nametext').value = diagram[selobj].name;
		document.getElementById('fontColor').value = diagram[selobj].fontColor;
		document.getElementById('font').value = diagram[selobj].font;
	    document.getElementById('attributeType').value = diagram[selobj].attributeType;
	    document.getElementById('TextSize').value = diagram[selobj].sizeOftext;
  }
}

function mouseupevt(ev){

	// Code for creating a new class
    if(snapToGrid){
      cx=Math.round(cx/gridSize)*gridSize
      cy=Math.round(cy/gridSize)*gridSize;
    }
		if(md==4&&(uimode=="CreateClass"||uimode=="CreateERAttr"||uimode=="CreateEREntity"||uimode=="CreateERRelation")){
				// Add required points
				p1=points.addpoint(sx,sy,false);
        p2=points.addpoint(cx,cy,false);
        var swap = null;
        /*if(p1.x > p2.x){
          swap = p1.x;
          p1.x = p2.x;
          p2.x = swap;
        }
        if(p1.y > p2.y){
          swap = p1.y;
          p1.y = p2.y;
          p2.y = swap;
        }*/
				var p3=points.addpoint((cx+sx)*0.5,(cy+sy)*0.5,false);
		}
		if(uimode=="CreateLine"&&md==4){
      sel=points.distance(cx,cy);

      if(hovobj==-1){
        // End line on empty
        p2=points.addpoint(cx,cy,false);

        if(lineStartObj == -1){
          // Start line on empty
          // Just draw a normal line
        }
        else{
          // Start line on object
          diagram[lineStartObj].connectorTop.push({from:p1,to:p2});
          lineStartObj = -1;
        }
      }
      else{
        // End line on object
        if(diagram[hovobj].symbolkind == 2){
          p2=diagram[hovobj].centerpoint;
        }else if(diagram[hovobj].symbolkind == 5){
            p2=diagram[hovobj].middleDivider;
	  	}else{
          p2=points.addpoint(cx,cy,false);
        }

        if(lineStartObj==-1){
          // Start line on empty
          diagram[hovobj].connectorTop.push({from:p2,to:p1});
        }
        else{
          // Start line on object
          diagram[lineStartObj].connectorTop.push({from:p1,to:p2});
          diagram[hovobj].connectorTop.push({from:p2,to:p1});
        }
      }
		}

		createFigure();

		if(uimode=="CreateClass"&&md==4){
				classB = new Symbol(1);
				classB.name="New"+diagram.length;

				classB.operations.push({visibility:"-",text:"makemore()"});
				classB.attributes.push({visibility:"+",text:"height:Integer"});

				classB.topLeft=p1;
				classB.bottomRight=p2;

        if(points[classB.bottomRight].x >= points[classB.topLeft].x && (points[classB.bottomRight].x - points[classB.topLeft].x) < classTemplate.width){
          points[classB.bottomRight].x = points[classB.topLeft].x + classTemplate.width;
        }
        else if(points[classB.bottomRight].x < points[classB.topLeft].x && (points[classB.topLeft].x - points[classB.bottomRight].x) < classTemplate.width){

          points[classB.bottomRight].x = points[classB.topLeft].x - classTemplate.width;
        }

        if(points[classB.bottomRight].y >= points[classB.topLeft].y && (points[classB.bottomRight].y - points[classB.topLeft].y) < classTemplate.width){
          points[classB.bottomRight].y = points[classB.topLeft].y + classTemplate.height;
        }
        else if(points[classB.bottomRight].y < points[classB.topLeft].y && (points[classB.topLeft].y - points[classB.bottomRight].y) < classTemplate.height){
          points[classB.bottomRight].y = points[classB.topLeft].y - classTemplate.height;
        }
        classB.middleDivider=p3;
        console.log("banan:"+points[classB.middleDivider].y);
        points[classB.middleDivider].x = ((classB.bottomRight.x+classB.topLeft.x)*0.5);
        points[classB.middleDivider].y = ((classB.bottomRight.y+classB.topLeft.y)*0.5);
				diagram.push(classB);
		}else if(uimode=="CreateERAttr"&&md==4){
				erAttributeA = new Symbol(2);
				erAttributeA.name="Attr"+diagram.length;
        erAttributeA.topLeft=p1;
				erAttributeA.bottomRight=p2;


        if(points[erAttributeA.bottomRight].x >= points[erAttributeA.topLeft].x && (points[erAttributeA.bottomRight].x - points[erAttributeA.topLeft].x) < attributeTemplate.width){
          points[erAttributeA.bottomRight].x = points[erAttributeA.topLeft].x + attributeTemplate.width;
        }
        else if(points[erAttributeA.bottomRight].x < points[erAttributeA.topLeft].x && (points[erAttributeA.topLeft].x - points[erAttributeA.bottomRight].x) < attributeTemplate.width){

          points[erAttributeA.bottomRight].x = points[erAttributeA.topLeft].x - attributeTemplate.width;
        }

        if(points[erAttributeA.bottomRight].y >= points[erAttributeA.topLeft].y && (points[erAttributeA.bottomRight].y - points[erAttributeA.topLeft].y) < attributeTemplate.width){
          points[erAttributeA.bottomRight].y = points[erAttributeA.topLeft].y + attributeTemplate.height;
        }
        else if(points[erAttributeA.bottomRight].y < points[erAttributeA.topLeft].y && (points[erAttributeA.topLeft].y - points[erAttributeA.bottomRight].y) < attributeTemplate.height){
          points[erAttributeA.bottomRight].y = points[erAttributeA.topLeft].y - attributeTemplate.height;
        }

				erAttributeA.centerpoint=p3;
				erAttributeA.attributeType="";
				erAttributeA.fontColor="#253";
				erAttributeA.font="Arial";
				diagram.push(erAttributeA);

				//selecting the newly created attribute and open the dialogmenu.
				selobj = diagram.length -1;
				diagram[selobj].targeted = true;
				openAppearanceDialogMenu();

		}else if(uimode=="CreateEREntity"&&md==4){
            	erEnityA = new Symbol(3);
            	erEnityA.name="Entity"+diagram.length;
            	erEnityA.topLeft=p1;
            	erEnityA.bottomRight=p2;
            	erEnityA.centerpoint=p3;

              if(points[erEnityA.bottomRight].x >= points[erEnityA.topLeft].x && (points[erEnityA.bottomRight].x - points[erEnityA.topLeft].x) < entityTemplate.width){
                points[erEnityA.bottomRight].x = points[erEnityA.topLeft].x + entityTemplate.width;
              }
              else if(points[erEnityA.bottomRight].x < points[erEnityA.topLeft].x && (points[erEnityA.topLeft].x - points[erEnityA.bottomRight].x) < entityTemplate.width){

                points[erEnityA.bottomRight].x = points[erEnityA.topLeft].x - entityTemplate.width;
              }

              if(points[erEnityA.bottomRight].y >= points[erEnityA.topLeft].y && (points[erEnityA.bottomRight].y - points[erEnityA.topLeft].y) < entityTemplate.width){
                points[erEnityA.bottomRight].y = points[erEnityA.topLeft].y + entityTemplate.height;
              }
              else if(points[erEnityA.bottomRight].y < points[erEnityA.topLeft].y && (points[erEnityA.topLeft].y - points[erEnityA.bottomRight].y) < entityTemplate.height){
                points[erEnityA.bottomRight].y = points[erEnityA.topLeft].y - entityTemplate.height;
              }

              erEnityA.entityType="";
				      erEnityA.fontColor="#253";
				      erEnityA.font="Arial";

            	diagram.push(erEnityA);

				//selecting the newly created enitity and open the dialogmenu.
				selobj = diagram.length -1;
				diagram[selobj].targeted = true;
				openAppearanceDialogMenu();
		}else if(uimode=="CreateLine"&&md==4){
			/* Code for making a line */
    		erLineA = new Symbol(4);
    		erLineA.name="Line"+diagram.length;
    		erLineA.topLeft=p1;
    		erLineA.bottomRight=p2;
    		erLineA.centerpoint=p3;

            diagram.push(erLineA);
        }
        else if(uimode=="CreateERRelation"&&md==4){
            erRelationA = new Symbol(5);

            erRelationA.name="Relation"+diagram.length;
            erRelationA.topLeft=p1;
            erRelationA.bottomRight=p2;
            erRelationA.middleDivider=p3;

            if(points[erRelationA.bottomRight].x >= points[erRelationA.topLeft].x && (points[erRelationA.bottomRight].x - points[erRelationA.topLeft].x) < relationTemplate.width){
              points[erRelationA.bottomRight].x = points[erRelationA.topLeft].x + relationTemplate.width;
            }
            else if(points[erRelationA.bottomRight].x < points[erRelationA.topLeft].x && (points[erRelationA.topLeft].x - points[erRelationA.bottomRight].x) < relationTemplate.width){

              points[erRelationA.bottomRight].x = points[erRelationA.topLeft].x - relationTemplate.width;
            }

            if(points[erRelationA.bottomRight].y >= points[erRelationA.topLeft].y && (points[erRelationA.bottomRight].y - points[erRelationA.topLeft].y) < relationTemplate.width){
              points[erRelationA.bottomRight].y = points[erRelationA.topLeft].y + relationTemplate.height;
            }
            else if(points[erRelationA.bottomRight].y < points[erRelationA.topLeft].y && (points[erRelationA.topLeft].y - points[erRelationA.bottomRight].y) < relationTemplate.height){
              points[erRelationA.bottomRight].y = points[erRelationA.topLeft].y - relationTemplate.height;
            }

            diagram.push(erRelationA);

            //selecting the newly created relation and open the dialog menu.
            selobj = diagram.length -1;
            diagram[selobj].targeted = true;
            openAppearanceDialogMenu();
        }else if (md == 4 && !(uimode == "CreateFigure") && !(uimode == "CreateLine") && !(uimode == "CreateEREntity") && !(uimode == "CreateERAttr" ) && !(uimode == "CreateClass" ) && !(uimode == "MoveAround" ) && !(uimode=="CreateERRelation")) {
			diagram.insides(cx, cy, sx, sy);
        }

    document.addEventListener("click", clickOutsideDialogMenu);
    updategfx();

    // Clear mouse state
    md = 0;
    if (uimode != "CreateFigure") {
        uimode = " ";
    }

}


function movePoint(point){
  point = waldoPoint;
}
function getConnectedLines(object){
  // Adds the different connectors into an array to reduce the amount of code
  var private_points = object.getPoints();
  var lines = diagram.getLineObjects();
  var object_lines = [];
  for(i = 0; i < lines.length; i++){
    var line = lines[i];

    //Line
    //Lines connected to object's centerpoint
    //Line always have topLeft and bottomRight if symbolkind == 4, because that means it's a line object
    if(line.topLeft == object.centerpoint || line.bottomRight == object.centerpoint) {
      object_lines.push(line);
    }

    //Connected to connectors top, right, bottom and left.
    for(var j = 0; j < private_points.length; j++){
      if (line.topLeft == private_points[j] || line.bottomRight == private_points[j]) {
        object_lines.push(line);
      }
    }
  }
  return object_lines;
}
function eraseObject(object){
  var canvas = document.getElementById("myCanvas");
  canvas.style.cursor="default";

  var private_lines = object.getLines();

  object.erase();

  diagram.eraseObjectLines(object,private_lines)

  diagram.delete(object);
  updategfx();
}
function eraseSelectedObject(){
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		//Issue: Need to remove the crosses
		for (var i = 0; i < diagram.length;i++){
      var object = diagram[i];
			if(object.targeted == true){
		    object.targeted = false;
		    eraseObject(object);
        i = 0;
		//To avoid removing the same index twice, selobj is reset
		selobj = -1;
			}
		}
    updategfx();
}
function classmode()
{
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		uimode="CreateClass";
}

function attrmode()
{
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		uimode="CreateERAttr";
}

function entitymode()
{
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
  		uimode="CreateEREntity";
}

function linemode()
{
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		uimode="CreateLine";
}

function figuremode()
{
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor = "default";
    	uimode = "CreateFigure";
    	var selectBox = document.getElementById("selectFigure");
    	figureMode = selectBox.options[selectBox.selectedIndex].value;
}

function relationmode()
{
    	var canvas = document.getElementById("myCanvas");
    	canvas.style.cursor="default";
    	uimode="CreateERRelation";
}

/**
 * Resets the select box to its default value (Create Figure)
 */
function resetSelectionCreateFigure() {
	document.getElementById("selectFigure").selectedIndex = 0;
}

/**
 * Opens the dialog menu for appearance.
 */
function openAppearanceDialogMenu() {
	var canvas = document.getElementById("myCanvas");
	canvas.style.cursor="default";
    $("#appearance").show();
    $("#appearance").width("auto");
    dimDialogMenu(true);
    dialogForm();
}

function dialogForm() {
    var form = document.getElementById("f01");
    form.innerHTML= "No item selected<type='text'>";

    if(diagram[selobj].symbolkind==1){
        form.innerHTML = "Class name: </br>" +
          "<input id='nametext' type='text'></br>" +
          "<button type='submit'  class='submit-button' onclick='changeName(form)' style='float:none;display:block;margin:10px auto'>Ok</button>";
    }
    if(diagram[selobj].symbolkind==2){
        form.innerHTML = "Attribute name:</br>" +
          "<input id='nametext' type='text'></br>" +
          "Attribute type: </br>" +
          "<select id ='attributeType'><option value='Primary key'>Primary key</option><option value='Normal'>Normal</option><option value='Multivalue'>Multivalue</option><option value='Composite' selected>Composite</option><option value='Drive' selected>Derive</option></select></br>" +
       		"Font family:<br>" +
          "<select id ='font'><option value='arial' selected>Arial</option><option value='Courier New'>Courier New</option><option value='Impact'>Impact</option><option value='Calibri'>Calibri</option></select><br>" +
      		"Font color:<br>" +
      		"<select id ='fontColor'><option value='black' selected>Black</option><option value='blue'>Blue</option><option value='Green'>Green</option><option value='grey'>Grey</option><option value='red'>Red</option><option value='yellow'>Yellow</option></select><br>" +
          "Text size:<br>" +
      		"<select id ='TextSize'><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option></select><br>" +
      		"<button type='submit'  class='submit-button' onclick='changeNameAttr(form); setType(form); updategfx();' style='float:none;display:block;margin:10px auto'>OK</button>";
    }
    if(diagram[selobj].symbolkind==3){
        form.innerHTML = "Entity name: </br>" +
        	"<input id='nametext' type='text'></br>" +
          "Entity type: </br>" +
      		"<select id ='entityType'><option value='weak'>weak</option><option value='strong' selected>strong</option></select></br>" +
      		"Font family:<br>" +
          "<select id ='font'><option value='arial' selected>Arial</option><option value='Courier New'>Courier New</option><option value='Impact'>Impact</option><option value='Calibri'>Calibri</option></select><br>" +
      		"Font color:<br>" +
      	  "<select id ='fontColor'><option value='black' selected>Black</option><option value='blue'>Blue</option><option value='Green'>Green</option><option value='grey'>Grey</option><option value='red'>Red</option><option value='yellow'>Yellow</option></select><br>" +
          "Text size:<br>" +
      		"<select id ='TextSize'><option value='Tiny' selected>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option></select><br>" +
          "<button type='submit'  class='submit-button' onclick='changeNameEntity(form); setEntityType(form); updategfx();' style='float:none;display:block;margin:10px auto'>OK</button>";
    }
    if(diagram[selobj].symbolkind==5){
        form.innerHTML = "Relation name:</br>" +
            "<input id='nametext' type='text'></br>" +
            "Font family:<br>" +
            "<select id ='font'><option value='arial' selected>Arial</option><option value='Courier New'>Courier New</option><option value='Impact'>Impact</option><option value='Calibri'>Calibri</option></select><br>" +
            "Font color:<br>" +
            "<select id ='fontColor'><option value='black' selected>Black</option><option value='blue'>Blue</option><option value='Green'>Green</option><option value='grey'>Grey</option><option value='red'>Red</option><option value='yellow'>Yellow</option></select><br>" +
            "Text size:<br>" +
            "<select id ='TextSize'><option value='Tiny'>Tiny</option><option value='Small'>Small</option><option value='Medium'>Medium</option><option value='Large'>Large</option></select><br>" +
            "<button type='submit'  class='submit-button' onclick='changeNameRelation(form); setType(form); updategfx();' style='float:none;display:block;margin:10px auto'>OK</button>";
    }
}

//setTextSize(): used to change the size of the text. unifinish can's get it to work.
function setTextSizeEntity(form){
	var scaletype = document.getElementById('TextSize').value;
	diagram[selobj].sizeOftext = scaletype;

	/*
		Hämtar specifik entitet/attribut/detpersonenharklickat på.
		[ovannämndklick].font=text_size+"px";
	*/
}


function changeNameAttr(form){

    dimDialogMenu(false);

    diagram[selobj].name=document.getElementById('nametext').value;
    diagram[selobj].fontColor=document.getElementById('fontColor').value;
    diagram[selobj].font=document.getElementById('font').value;
    diagram[selobj].sizeOftext=document.getElementById('TextSize').value;
    diagram[selobj].attributeType=document.getElementById('attributeType').value;


    updategfx();
    $("#appearance").hide();

}
function changeNameEntity(form){

    dimDialogMenu(false);

    diagram[selobj].name=document.getElementById('nametext').value;
    diagram[selobj].fontColor=document.getElementById('fontColor').value;
    diagram[selobj].font=document.getElementById('font').value;
    diagram[selobj].sizeOftext=document.getElementById('TextSize').value;
    diagram[selobj].entityType=document.getElementById('entityType').value;
    updategfx();
    $("#appearance").hide();

}

function  changeNameRelation() {
    dimDialogMenu(false);

    diagram[selobj].name=document.getElementById('nametext').value;
    diagram[selobj].fontColor=document.getElementById('fontColor').value;
    diagram[selobj].font=document.getElementById('font').value;
    diagram[selobj].sizeOftext=document.getElementById('TextSize').value;
    diagram[selobj].entityType=document.getElementById('entityType').value;
    updategfx();
    $("#appearance").hide();
}

function setEntityType(form) {
	var selectBox = document.getElementById("entityType");
	diagram[selobj].type = selectBox.options[selectBox.selectedIndex].value;
  updategfx();
}

function setType(form){

	if(document.getElementById('attributeType').value == 'Primary key')
	{
		diagram[selobj].key_type = 'Primary key';
	}

	else if(document.getElementById('attributeType').value == 'Normal')
	{
		diagram[selobj].key_type = 'Normal';
	}

		else if(document.getElementById('attributeType').value == 'Multivalue')
	{
		diagram[selobj].key_type = 'Multivalue';
	}
  else if(document.getElementById('attributeType').value == 'Drive')
{
  diagram[selobj].key_type = 'Drive';
}
	 updategfx();
}

/**
 * Closes the dialog menu for appearance.
 */
function closeAppearanceDialogMenu() {
	$("#appearance").hide();
    dimDialogMenu(false);
    document.removeEventListener("click", clickOutsideDialogMenu);
}

/**
 * Closes the dialog menu when click is done outside box.
 */
function clickOutsideDialogMenu(ev) {
    $(document).mousedown(function (ev) {
        var container = $("#appearance");
        if (!container.is(ev.target)
            && container.has(ev.target).length === 0) {
            container.hide();
            dimDialogMenu(false);
            document.removeEventListener("click", clickOutsideDialogMenu);
        }

    });
}

function dimDialogMenu(dim) {
    if(dim==true) {
        $("#appearance").css("display", "block");
        $("#overlay").css("display", "block");
    }
    else {
        $("#appearance").css("display", "none");
        $("#overlay").css("display", "none");
    }
}

function Consolemode(action){

	if(action == 1) {
		document.getElementById('Hide Console').style.display = "none";
		document.getElementById('Show Console').style.display = "block";
		document.getElementById('Show Console').style="position:fixed; right:0; bottom:0px;";
		document.getElementById('valuesCanvas').style.bottom = "0";
		heightWindow = (window.innerHeight-120);
		document.getElementById("myCanvas").setAttribute("height", heightWindow);
		$("#consloe").hide();
		updategfx();
	}
	if(action == 2) {
		document.getElementById('Hide Console').style.display = "block";
		document.getElementById('Show Console').style.display = "none";
		document.getElementById('Hide Console').style="position:fixed; right:0; bottom:133px;";
		heightWindow = (window.innerHeight-244);
		document.getElementById("myCanvas").setAttribute("height", heightWindow);
		document.getElementById('valuesCanvas').style.bottom = "130px";
		$("#consloe").show();
		updategfx();
	}
}
function cross(xk,yk)
{
				ctx.strokeStyle="#4f6";
				ctx.lineWidth=3;
				ctx.beginPath();
				ctx.moveTo(xk-crossl,yk-crossl);
				ctx.lineTo(xk+crossl,yk+crossl);
				ctx.moveTo(xk+crossl,yk-crossl);
				ctx.lineTo(xk-crossl,yk+crossl);
				ctx.stroke();
}

function drawGrid(){
  ctx.lineWidth=1;
  ctx.strokeStyle="rgb(238,238,250)";
  ctx.setLineDash([5, 0]);
  var quadrantx = (startX < 0)? startX: -startX,
    quadranty = (startY < 0)? startY: -startY;
  console.log(quadrantx+" : "+widthWindow+ "; "+(quadrantx+widthWindow));
  for(i = 0+quadrantx; i < quadrantx+widthWindow; i++){
    if(i%5==0){
      i++;
    }
    ctx.beginPath();
    ctx.moveTo(i*gridSize,0+startY);
    ctx.lineTo(i*gridSize,heightWindow+startY);
    ctx.stroke();
    ctx.closePath();
  }
  for(i = 0+quadranty; i < quadranty+heightWindow; i++){
    if(i%5==0){
      i++;
    }
    ctx.beginPath();
    ctx.moveTo(0+startX, i*gridSize);
    ctx.lineTo(widthWindow+startX, i*gridSize);
    ctx.stroke();
    ctx.closePath();
  }

  //Draws the thick lines
  ctx.strokeStyle="rgb(208,208,220)";
  for(i = 0+quadrantx; i < quadrantx+widthWindow; i++){
    if(i%5==0){
      ctx.beginPath();
      ctx.moveTo(i*gridSize,0+startY);
      ctx.lineTo(i*gridSize,heightWindow+startY);
      ctx.stroke();
      ctx.closePath();
    }
  }
  for(i = 0+quadranty; i < quadranty+heightWindow; i++){
    if(i%5==0){
      ctx.beginPath();
      ctx.moveTo(0+startX, i*gridSize);
      ctx.lineTo(widthWindow+startX, i*gridSize);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
function drawOval(x1, y1, x2, y2) {
		xm = x1+((x2-x1)*0.5),       // x-middle
		ym = y1+((y2-y1)*0.5);       // y-middle

		ctx.beginPath();
		ctx.moveTo(x1, ym);
		ctx.quadraticCurveTo(x1,y1,xm,y1);
		ctx.quadraticCurveTo(x2,y1,x2,ym);
		ctx.quadraticCurveTo(x2,y2,xm,y2);
		ctx.quadraticCurveTo(x1,y2,x1,ym);
}

//remove all elements in the diagram array. it hides the points by placing them beyond the users view.
function clearCanvas()
{

  while(diagram.length > 0){
    diagram[diagram.length-1].erase();
    diagram.pop();
  }
  updategfx();
}

var consloe={};
consloe.log=function(gobBluth)
{
		document.getElementById("consloe").innerHTML=((JSON.stringify(gobBluth)+"<br>")+document.getElementById("consloe").innerHTML);
}

//debugMode this function show and hides crosses and the consol.
var ghostingcrosses = false; // used to repressent a switch for whenever the debugMode is enabled or not.
function debugMode()
{
	if(ghostingcrosses == true){
		crossStrokeStyle1 = "#f64";
		crossfillStyle = "#d51";
		crossStrokeStyle2 = "#d51";
		ghostingcrosses = false
		Consolemode(2)
		}

		else{
			crossStrokeStyle1 = "rgba(255, 102, 68, 0.0)";
			crossfillStyle = "rgba(255, 102, 68, 0.0)";
			crossStrokeStyle2 = "rgba(255, 102, 68, 0.0)";
			ghostingcrosses = true
			Consolemode(1)
		}

}

//---------------------------------------
// MOVING AROUND IN THE CANVAS
//---------------------------------------

function movemode(e, t)
{
	uimode="MoveAround";
	var canvas = document.getElementById("myCanvas");
	var button = document.getElementById("moveButton").className;
	var buttonStyle = document.getElementById("moveButton");
	canvas.removeEventListener("click", zoomOutClick, false);
	canvas.removeEventListener("click", zoomInClick, false);
	canvas.removeEventListener("dblclick", doubleclick, false);
	document.getElementById("zoomInButton").className="unpressed";
	document.getElementById("zoomOutButton").className="unpressed";
	if(button == "unpressed"){
		buttonStyle.className="pressed";
		canvas.style.cursor="all-scroll";
		canvas.addEventListener('mousedown', getMousePos, false);
		canvas.addEventListener('mouseup', mouseupcanvas, false);
	}else{
		canvas.addEventListener('dblclick', doubleclick, false);
		buttonStyle.className="unpressed";
		mousedownX = 0; mousedownY = 0;
		mousemoveX = 0; mousemoveY = 0;
		mouseDiffX = 0; mouseDiffY = 0;
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		canvas.removeEventListener('mousedown', getMousePos, false);
		canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
		canvas.removeEventListener('mouseup', mouseupcanvas, false);
		mousemoveevt(e,t);
	}
}
function getMousePos(e){
	var canvas = document.getElementById("myCanvas");
	mousedownX = e.clientX;
	mousedownY = e.clientY;
	canvas.addEventListener('mousemove', mousemoveposcanvas, false);
}
function mousemoveposcanvas(e){
	mousemoveX = e.clientX;
	mousemoveY = e.clientY;
	var canvas = document.getElementById("myCanvas");
	mouseDiffX = (mousedownX - mousemoveX);
	mouseDiffY = (mousedownY - mousemoveY);
	startX += mouseDiffX;
	startY += mouseDiffY;
	mousedownX = mousemoveX;
	mousedownY = mousemoveY;
	ctx.clearRect(0,0,widthWindow,heightWindow);
	ctx.translate((-mouseDiffX),(-mouseDiffY));
	erEntityA.sortAllConnectors();
	diagram.draw();
	points.drawpoints();
	reWrite();
}
function mouseupcanvas(e){
	var canvas = document.getElementById("myCanvas");
	canvas.removeEventListener('mousemove', mousemoveposcanvas, false);
}



function downloadMode(el){
    var canvas = document.getElementById("content");
    var selectBox = document.getElementById("download");
    download = selectBox.options[selectBox.selectedIndex].value;

    if(download.toString() == "getImage"){
        console.log("b");
        getImage();
    }
    if(download == "Save"){
        Save();
    }
    if(download == "Load"){
        Load();
    } if(download == "Export"){
		SaveFile(el);
	}
}

function getImage(){

    window.open( document.getElementById("myCanvas").toDataURL("image/png"), 'Image');
}

var ac = [];
function Save() {
    for (i = 0; i < diagram.length; i++){
        c[i] = diagram[i].constructor.name;
        c[i] = c[i].replace(/"/g,"");
    }

	var obj = {
		diagram: diagram,
		points: points,
		diagram_names: c
	};
	 a = JSON.stringify(obj);
    console.log("State is saved");

}
function SaveFile(el){
		Save();
        var data = "text/json;charset=utf-8," + encodeURIComponent(a);
        el.setAttribute("class",'icon-download');
        el.setAttribute("href", "data:" + data);
        el.setAttribute("download", "diagram.txt");
        updategfx();
}
function LoadFile(){
    var pp = JSON.parse(a);
    b = pp;
	//diagram fix
    for (i = 0; i < b.diagram.length; i++) {
        if (b.diagram_names[i] == "Symbol") {
            b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
        } else if (b.diagram_names[i] == "Path") {
            b.diagram[i] = Object.assign(new Path, b.diagram[i]);
        }
    }
    diagram.length = b.diagram.length;
    for (i = 0; i < b.diagram.length;i++) {
        diagram[i] = b.diagram[i];
    }

    // Points fix
    for (i = 0; i < b.points.length; i++) {
        b.points[i] = Object.assign(new Path, b.points[i]);
    }
    points.length = b.points.length;
    for (i = 0; i< b.points.length; i++ ){
        points[i] = b.points[i];
    }
    console.log("State is loaded");
    //Redrawn old state.
    updategfx();
}

function Load() {
    // Implement a JSON.parse() that will unmarshall a b c, so we can add
    // them to their respecive array so it can redraw the desired canvas.

	var dia = JSON.parse(a);
	b= dia;
	for (i = 0; i < b.diagram.length; i++) {
		if (b.diagram_names[i] == "Symbol") {
			b.diagram[i] = Object.assign(new Symbol, b.diagram[i]);
		} else if (b.diagram_names[i] == "Path") {
			b.diagram[i] = Object.assign(new Path, b.diagram[i]);
		}
	}
	diagram.length = b.diagram.length;
	for (i = 0; i < b.diagram.length;i++) {
		diagram[i] = b.diagram[i];
	}

	// Points fix
	for (i = 0; i < b.points.length; i++) {
		b.points[i] = Object.assign(new Path, b.points[i]);
	}
	points.length = b.points.length;
	for (i = 0; i< b.points.length; i++ ){
		points[i] = b.points[i];
	}
    console.log("State is loaded");
    //Redrawn old state.
    updategfx();
}

//calculate the hash. does this by converting all objects to strings from diagram. then do some sort of calculation. used to save the diagram.
function hashfunction()
{
    window.location.hash=diagram;
	var diagramToString = "";
	var hash = 0;
	for(var i = 0; i < diagram.length; i++){
		diagramToString = diagramToString + JSON.stringify(diagram[i])
	}

    if (diagram.length == 0){console.log(hash);}
	else{
		for (i = 0; i < diagramToString.length; i++) {
        char = diagramToString.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
		}
		var hexHash = hash.toString(16);
		console.log(hash.toString(16));
	}
}

// Function that rewrites the values of zoom and x+y that's under the canvas element

function reWrite(){
	var valuesCanvas = document.getElementById("valuesCanvas");
	valuesCanvas.innerHTML="<p>Zoom: "+Math.round((zv*100))+"% | Coordinates: X="+startX+" & Y="+startY+"</p>"
}

//----------------------------------------
// Renderer
//----------------------------------------

var momentexists=0;
var resave = false;
function returnedSection(data)
{
	retdata=data;
  if(data['debug']!="NONE!") alert(data['debug']);

}
