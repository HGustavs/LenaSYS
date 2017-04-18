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

var crossl=4.0;				// Size of point cross
var tolerance = 8;		// Size of tolerance area around the point
var ctx;							// Canvas context
var acanvas;					// Canvas Element
var sel;							// Selection state
var cx,cy=0;					// Current Mouse coordinate x and y
var sx,sy=0;					// Start Mouse coordinate x and y
var mox,moy=0;				// Old mouse x and y
var md=0;							// Mouse state
var hovobj=-1;
var lineStartObj = -1;
var movobj=-1;				// Moving object ID
var selobj = -1;			// The last selected object
var uimode="normal";		// User interface mode e.g. normal or create class currently
var widthWindow;			// The width on the users screen is saved is in this var.
var heightWindow;			// The height on the users screen is saved is in this var.
var consoleInt = 0;
var canFigure = false; // When figure mode is enabled for the session, this needs to be set to true and p1 to null.
var startX=0; var startY=0;			// Current X- and Y-coordinant from which the canvas start from
var waldoPoint = {x:-10,y:-10,selected:false};
var activePoint = null; //This point indicates what point is being hovered by the user
var p1=null,					// When creating a new figure, these two variables are used ...
 		p2=null;					// to keep track of points created with mousedownevt and mouseupevt

// set the color for the crosses.
var crossStrokeStyle1 = "#f64";
var crossfillStyle = "#d51";
var crossStrokeStyle2 = "#d51";

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

diagram.draw = function ()
{
		// On every draw of diagram adjust the midpoint if there is one to adjust
		this.adjust();
	for(i=0;i<this.length;i++){
		item=this[i];

		// Path item
		if(item.symbolkind==4) {
			item.draw();
		}


	}
		for(i=0;i<this.length;i++){
				item=this[i];

				// Path item
				if(item.kind==1){
					item.draw(1,1);
				}else if(item.kind==2 && !(item.symbolkind == 4)){
					item.draw();
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
// inside - executes inside methond in all diagram objects (currently of kind==2)
//--------------------------------------------------------------------
diagram.insides = function (ex,ey,sx,sy)
{
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
		/*console.log(sx + " target x ");
		console.log(sy + " target y ");
		console.log(sx + " start point x");
		console.log(sy + " start point y ");
		console.log(ex + " end point x ");
		console.log(ey + " end point x ");*/
		if(sx < tx && ex > tx && sy < ty && ey > ty && sx < bx && ex > bx && sy < by && ey > by){

			console.log("4");
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
}

function initcanvas()
{
    widthWindow = (window.innerWidth-20);
	heightWindow = (window.innerHeight-220);
	document.getElementById("content").innerHTML=
		"<button onclick='classmode();'>Create Class</button>" +
		"<button onclick='attrmode();'>Create Attribute</button>" +
		"<button onclick='linemode();'>Create Line</button>" +
		"<button onclick='entitymode();'>Create Entity</button>" +
		"<button onclick='figuremode();'>Create Figure</button>" +
		"<button onclick='openAppearanceDialogMenu();'>Change Apperance</button>" +
		"<button onclick='debugMode();'>Debug</button>" +
		"<button onclick='deleteSelectedObject();'>Delete Object</button>" +
		"<button onclick='deleteAllObjects();'>Delete All</button>" +
		"<button onclick='movemode(event);' style='float: right;'>Start Moving</button>" +
		"<button onclick='stopmovemode();' style='float: right;'>Stop Moving</button><br>" +
		"<canvas id='myCanvas' style='border:1px solid #000000;' width='"+widthWindow+"' height='"+heightWindow+"' onmousemove='mousemoveevt(event,this);' onmousedown='mousedownevt(event);' onmouseup='mouseupevt(event);' ondblclick='doubleclick(event)';></canvas>" +
		"<div id='consloe' style='position:fixed;left:0px;right:0px;bottom:0px;height:133px;background:#dfe;border:1px solid #284;z-index:5000;overflow:scroll;color:#4A6;font-family:lucida console;font-size:13px;'>Application console</div>"+
		"<input id='Hide Console' style='position:fixed; right:0; bottom:133px;' type='button' value='Hide Console' onclick='Consolemode(1);' />" +
		"<input id='Show Console' style='display:none;position:fixed; right:0; bottom:133px;' type='button' value='Show Console' onclick='Consolemode(2);' />";
	var canvas = document.getElementById("myCanvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
				acanvas=document.getElementById("myCanvas");
		}

		makegfx();

		updategfx();

}

// Function that is used for the resize
// Making the page more responsive

function canvassize()
{
	widthWindow = (window.innerWidth-20);
	heightWindow = (window.innerHeight-244);
	document.getElementById("myCanvas").setAttribute("width", widthWindow);
	document.getElementById("myCanvas").setAttribute("height", heightWindow);
}

// Listen if the window is the resized

window.addEventListener('resize', canvassize);

var erEntityA;

// Demo data for testing purposes.


function updategfx()
{
		ctx.clearRect(startX,startY,widthWindow,heightWindow);

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
    console.log("New active point");
  }
  else{
    activePoint = null;
  }
}
function mousemoveevt(ev, t){
		mox=cx;
		moy=cy;
    hovobj = diagram.inside(cx,cy);
    console.log(hovobj);
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
				// If mouse is pressed down and a point is selected - move that point
				points[sel.ind].x=cx;
				points[sel.ind].y=cy;
		}else if(md==3){
				// If mouse is pressed down inside a movable object - move that object
				if(movobj!=-1){
					for (var i=0;i<diagram.length;i++){
						if(diagram[i].targeted == true){
						diagram[i].move(cx-mox,cy-moy);
						}
					}
				}
		}
		diagram.linedist(cx,cy);


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
				ctx.beginPath();
				ctx.moveTo(sx,sy);
				ctx.lineTo(cx,sy);
				ctx.lineTo(cx,cy);
				ctx.lineTo(sx,cy);
				ctx.lineTo(sx,sy);
				ctx.stroke();
				ctx.setLineDash([]);
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
        }
        else{
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
	if(diagram[selobj].inside(cx,cy)){
        openAppearanceDialogMenu();
  }
}

function mouseupevt(ev){

	// Code for creating a new class

		if(md==4&&(uimode=="CreateClass"||uimode=="CreateERAttr"||uimode=="CreateEREntity")){
				// Add required points
				p1=points.addpoint(sx,sy,false);
				p2=points.addpoint(cx,cy,false);
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
          console.log("Symbolkind"+diagram[lineStartObj].symbolkind);
          diagram[lineStartObj].connectorTop.push({from:p1,to:p2});
          lineStartObj = -1;
        }
      }
      else{
        // End line on object
        if(diagram[hovobj].symbolkind == 2){
          p2=diagram[hovobj].centerpoint;
        }else{
          p2=points.addpoint(cx,cy,false);
        }

        if(lineStartObj==-1){
          // Start line on empty
          diagram[hovobj].connectorTop.push({from:p2,to:p1});
        }
        else{
          // Start line on object
          console.log("Symbolkind"+diagram[lineStartObj].symbolkind);
          console.log("Symbolkind"+diagram[hovobj].symbolkind);
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
				classB.middleDivider=p3;

				diagram.push(classB);
		}else if(uimode=="CreateERAttr"&&md==4){
				erAttributeA = new Symbol(2);
				erAttributeA.name="Attr"+diagram.length;
				erAttributeA.topLeft=p1;
				erAttributeA.bottomRight=p2;
				erAttributeA.centerpoint=p3;

				diagram.push(erAttributeA);
		}else if(uimode=="CreateEREntity"&&md==4){
            	erEnityA = new Symbol(3);
            	erEnityA.name="Entity"+diagram.length;
            	erEnityA.topLeft=p1;
            	erEnityA.bottomRight=p2;
            	erEnityA.centerpoint=p3;

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
    } else if(md == 4 && !(uimode=="CreateFigure") && !(uimode=="CreateLine") && !(uimode=="CreateEREntity") && !(uimode=="CreateERAttr" ) &&!(uimode=="CreateClass" ) &&!(uimode=="MoveAround" ) ){
			console.log("box drawn");
			diagram.insides(cx,cy,sx,sy);
		}




    	updategfx();

    	// Clear mouse state
    	md=0;
    	if(uimode!="CreateFigure"){
    		uimode=" ";
        }

}
function deleteObject(index){
  var canvas = document.getElementById("myCanvas");
  canvas.style.cursor="default";
      points[diagram[index].topLeft] = waldoPoint;
      points[diagram[index].bottomRight] = waldoPoint;
      points[diagram[index].centerpoint] = waldoPoint;
      points[diagram[index].middleDivider] = waldoPoint;
    for(i = 0; i < diagram.length; i++){
        if(!(diagram[i].symbolkind == 1)){
            var temp = true;
            for (var j = 0; j < (diagram[index].connectorRight.length ); j++) {
                if (temp == true) {
                    if (diagram[i].symbolkind == 4 &&
                        (diagram[i].topLeft == diagram[index].connectorRight[j].from ||
                        diagram[i].bottomRight == diagram[index].connectorRight[j].from) ||
                        (diagram[i].topLeft == diagram[index].connectorRight[j].to ||
                        diagram[i].bottomRight == diagram[index].connectorRight[j].to)) {
                        diagram.splice(i, 1);
                        if (index > i) {
                            index--;
                        }
                        i--;
                        temp = false;
                        j = diagram[index].connectorRight.length;
                    }
                }
            }
            for (var j = 0; j < (diagram[index].connectorLeft.length ); j++) {
                if (temp == true) {
                    if (diagram[i].symbolkind == 4 &&
                        (diagram[i].topLeft == diagram[index].connectorLeft[j].from ||
                        diagram[i].bottomRight == diagram[index].connectorLeft[j].from) ||
                        (diagram[i].topLeft == diagram[index].connectorLeft[j].to ||
                        diagram[i].bottomRight == diagram[index].connectorLeft[j].to)) {
                        diagram.splice(i, 1);
                        if (index > i) {
                            index--;
                        }
                        i--;
                        temp = false;
                        j = diagram[index].connectorLeft.length;
                    }
                }
            }
            for (var j = 0; j < (diagram[index].connectorBottom.length ); j++) {
                if (temp == true) {
                    if (diagram[i].symbolkind == 4 &&
                        (diagram[i].topLeft == diagram[index].connectorBottom[j].from ||
                        diagram[i].bottomRight == diagram[index].connectorBottom[j].from) ||
                        (diagram[i].topLeft == diagram[index].connectorBottom[j].to ||
                        diagram[i].bottomRight == diagram[index].connectorBottom[j].to)) {
                        diagram.splice(i, 1);
                        if (index > i) {
                            index--;
                        }
                        i--;
                        temp = false;
                        j = diagram[index].connectorBottom.length;
                    }
                }
            }
            for (var j = 0; j < (diagram[index].connectorTop.length ); j++) {
                if (temp == true) {
                    if (diagram[i].symbolkind == 4 &&
                        (diagram[i].topLeft == diagram[index].connectorTop[j].from ||
                        diagram[i].bottomRight == diagram[index].connectorTop[j].from)||
                        (diagram[i].topLeft == diagram[index].connectorTop[j].to ||
                        diagram[i].bottomRight == diagram[index].connectorTop[j].to)) {
                        diagram.splice(i, 1);
                        if (index > i) {
                            index--;
                        }
                        i--;
                        temp = false;
                        j = diagram[index].connectorTop.length;
                    }
                }
            }
        }
        if (temp == true){
            if(diagram[i].symbolkind == 4 &&
                (diagram[i].topLeft == diagram[index].centerpoint ||
                diagram[i].bottomRight == diagram[index].centerpoint)) {
                if (index > i) {
                    index--;
                }
                diagram.splice(i, 1);
                i--;
            }
        }
    }
    diagram.splice(index, 1);
    updategfx();
    return index;

}
function deleteSelectedObject(){
		var canvas = document.getElementById("myCanvas");
		canvas.style.cursor="default";
		//Issue: Need to remove the crosses
		for (var i = 0; i < diagram.length;i++){
			if(diagram[i].targeted == true){
		//diagram[i].targeted = false;
		     i = deleteObject(i)-1;

		//To avoid removing the same index twice, selobj is reset
		selobj = -1;
			}
		}
	//}
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
		canvas.style.cursor="default";
    	uimode="CreateFigure";
}

/**
 * Opens the dialog menu for appearance.
 */
function openAppearanceDialogMenu() {
	var canvas = document.getElementById("myCanvas");
	canvas.style.cursor="default";
    $("#appearance").show();
    $("#appearance").width("auto");
    dialogForm();
}

function dialogForm() {
    var form = document.getElementById("f01");
    form.innerHTML= "No item selected<type='text'>";

    if(diagram[selobj].symbolkind==1){
        form.innerHTML = "Class name: <input id='text' type='text'></br>" +
            "<button type='submit' onclick='changeName(form)'>Ok</button>" +
            "<button type='button' onclick='closeAppearanceDialogMenu()'>Cancel</button>";
    }
    if(diagram[selobj].symbolkind==2){
        form.innerHTML = "Attribute name: <input id='text' type='text'></br>" +
            "<button type='submit' onclick='changeName(form)'>Ok</button>" +
            "<button type='button' onclick='closeAppearanceDialogMenu()'>Cancel</button>";
    }
    if(diagram[selobj].symbolkind==3){
        form.innerHTML = "Entity name: <input id='text' type='text'></br>" +
            "<button type='submit' onclick='changeName(form)'>Ok</button>" +
            "<button type='button' onclick='closeAppearanceDialogMenu()'>Cancel</button>" +
			      "<input type='checkbox' name='Entity' value='weak' >Weak entity<br>" +
			      "<input type='checkbox' name='Entity' value='strong' >Strong entity<br>" +
			      "<select id ='entityType'><option value='weak'>weak</option><option value='strong' selected>strong</option></select>";

    }
}

function changeName(form){
	diagram[selobj].name=document.getElementById('text').value;

    updategfx();
}

/**
 * Closes the dialog menu for appearance.
 */
function closeAppearanceDialogMenu() {
	$("#appearance").hide();
}


function Consolemode(action){

	if(action == 1) {
		document.getElementById('Hide Console').style.display = "none";
		document.getElementById('Show Console').style.display = "block";
		document.getElementById('Show Console').style="position:fixed; right:0; bottom:0px;";
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
function deleteAllObjects()
{
  console.log("Deleting");

  for(i = diagram.length; i >= 0;i--){
    deleteObject(i);
  }
	console.log("deleting done!");
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
var mousedownX = 0; var mousedownY = 0;
var mouseupX = 0; var mouseupY = 0;
var mouseDiffX = 0; var mouseDiffY = 0;
var newCanvasX = 0; var newCanvasY = 0;

function movemode(e)
{
	uimode="MoveAround";
	var canvas = document.getElementById("myCanvas");
	canvas.style.cursor="all-scroll";
	canvas.addEventListener('mousedown', mousedownposcanvas, false);
	canvas.addEventListener('mouseup', mouseupposcanvas, false);
}
function mousedownposcanvas(e){
	mousedownX = e.pageX;
	mousedownY = e.pageY;
}
function mouseupposcanvas(e){
	mouseupX = e.pageX;
	mouseupY = e.pageY;
	movecanvas();
}
function movecanvas(){
	var canvas = document.getElementById("myCanvas");
	mouseDiffX = (mousedownX - mouseupX);
	mouseDiffY = (mousedownY - mouseupY);
	newCanvasX = (mouseDiffX+newCanvasX);
	newCanvasY = (mouseDiffY+newCanvasY);

	ctx.clearRect(startX,startX,widthWindow,heightWindow);
	ctx.translate(newCanvasX,newCanvasY);
	// Here we explicitly sort connectors... we need to do this dynamically e.g. diagram.sortconnectors
	erEntityA.sortAllConnectors();
	// Redraw diagram
	diagram.draw();
	// Draw all points as crosses
	points.drawpoints();
	mousedownX = 0; mousedownY = 0;
	mouseupX = 0; mouseupY = 0;
	canvas.removeEventListener('mousedown', mousedownposcanvas, false);
	canvas.removeEventListener('mouseup', mouseupposcanvas, false);
	canvas.style.cursor="default";
}
function stopmovemode(){
	var canvas = document.getElementById("myCanvas");
	canvas.style.cursor="default";
	canvas.removeEventListener('mousedown', mousedownposcanvas, false);
	canvas.removeEventListener('mouseup', mouseupposcanvas, false);
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
