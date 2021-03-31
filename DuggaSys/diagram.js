
//------------------------------------=======############==========----------------------------------------
//                           Defaults, mouse variables and zoom variables  
//------------------------------------=======############==========----------------------------------------

// Data and html building variables
var service =[];
var str="";
var defs="";

// Interaction variables - unknown if all are needed
var mb,startX,startY;
var startTop,startLeft;
var sscrollx,sscrolly;
var cwidth,cheight;
var hasRecursion=false;

// Zoom variables
var zoomfact=1.0;
var scrollx=100;
var scrolly=100;

// Constants
const elementwidth=200;
const elementheight=50;
const textheight=18;
const strokewidth=1.5;
const baseline=10;
const avgcharwidth=6;
const colors = ["white","Gold","pink","yellow","CornflowerBlue"];
const multioffs=3;

// Arrow drawing stuff - diagram elements and diagram lines
var lines=[];
var elements=[];

// Currently clicked object list
var context=[];

//-------------------------------------------------------------------------------------------------
// makeRandomID - Random hex number
//-------------------------------------------------------------------------------------------------

function makeRandomID()
{
		var str="";
		var characters       = 'ABCDEF0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < 6; i++ ) {
				str += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return str;
}

// Example entities and attributes

var PersonID=makeRandomID();
var IDID=makeRandomID();
var NameID=makeRandomID();
var SizeID=makeRandomID();
var HasID=makeRandomID();
var CarID=makeRandomID();
var FNID=makeRandomID();
var LNID=makeRandomID();
var LoanID=makeRandomID();
var RefID=makeRandomID();

// Save default to model - updating defaults sets property to all of model
var defaults={
    defaultERtentity:{kind:"EREntity",fill:"White",Stroke:"Black",width:200,height:50},
    defaultERrelation:{kind:"ERRelation",fill:"White",Stroke:"Black",width:60,height:60},
    defaultERattr:{kind:"ERAttr",fill:"White",Stroke:"Black",width:90,height:45}
}

// Demo data - read / write from service later on
var data=[
    {name:"Person",x:100,y:100,width:200,height:50,kind:"EREntity",id:PersonID},
    {name:"Loan",x:140,y:250,width:200,height:50,kind:"EREntity",id:LoanID, isWeak:true},    
    {name:"Car",x:500,y:140,width:200,height:50,kind:"EREntity",id:CarID},	
    {name:"Owns",x:420,y:60,width:60,height:60,kind:"ERRelation",id:HasID},
    {name:"Refer",x:460,y:260,width:60,height:60,kind:"ERRelation",id:RefID,isWeak:true},
    {name:"ID",x:30,y:30,width:90,height:40,kind:"ERAttr",id:IDID,isComputed:true},
    {name:"Name",x:170,y:50,width:90,height:45,kind:"ERAttr",id:NameID},
    {name:"Size",x:560,y:40,width:90,height:45,kind:"ERAttr",id:SizeID,isMultiple:true},
    {name:"F Name",x:120,y:-20,width:90,height:45,kind:"ERAttr",id:FNID},
    {name:"L Name",x:230,y:-20,width:90,height:45,kind:"ERAttr",id:LNID}
];

var lines=[
    {id:makeRandomID(),fromID:PersonID,toID:IDID,kind:"Normal"},
    {id:makeRandomID(),fromID:PersonID,toID:NameID,kind:"Normal"},
    {id:makeRandomID(),fromID:CarID,toID:SizeID,kind:"Normal"},

    {id:makeRandomID(),fromID:PersonID,toID:HasID,kind:"Normal"},
    {id:makeRandomID(),fromID:HasID,toID:CarID,kind:"Double"},    
    {id:makeRandomID(),fromID:NameID,toID:FNID,kind:"Normal"},
    {id:makeRandomID(),fromID:NameID,toID:LNID,kind:"Normal"},
    
    {id:makeRandomID(),fromID:LoanID,toID:RefID,kind:"Normal"},
    {id:makeRandomID(),fromID:CarID,toID:RefID,kind:"Normal"},
];

//------------------------------------=======############==========----------------------------------------
//                                           Mouse events
//------------------------------------=======############==========----------------------------------------

function mdown(event)
{
		// React to mouse down on container
		if(event.target.id=="container"){
				mb=1;		
				sscrollx=scrollx;
				sscrolly=scrolly;
				startX=event.clientX;
				startY=event.clientY;
		}else{

		}
}

function ddown(event)
{
		startX=event.clientX;
		startY=event.clientY;
		mb=8;
	
		updateSelection(data[findIndex(data,event.currentTarget.id)],null,null);
	
}

function mup(event)
{
		deltaX=startX-event.clientX;
		deltaY=startY-event.clientY;
		
		mb=0;
}

function mmoving(event)
{
		// Click started in container
		if(mb==1){
				// Compute new scroll position
				deltaX=startX-event.clientX;
				deltaY=startY-event.clientY;
				scrollx=sscrollx-Math.round(deltaX*zoomfact);
				scrolly=sscrolly-Math.round(deltaY*zoomfact);
			
				// Update scroll position
				updatepos(null,null);
		}else if(mb==8){
				// Moving object
				deltaX=startX-event.clientX;
				deltaY=startY-event.clientY;
			
				// We update position of connected objects
				updatepos(deltaX,deltaY);

		}
}

function fab_action()
{
    if(document.getElementById("options-pane").className=="show-options-pane"){
				document.getElementById('optmarker').innerHTML="&#9660;Options";
        document.getElementById("options-pane").className="hide-options-pane";
    }else{
				document.getElementById('optmarker').innerHTML="&#x1f4a9;Options";
				document.getElementById("options-pane").className="show-options-pane";
    }    
}

//------------------------------------=======############==========----------------------------------------
//                                           Zoom handling
//------------------------------------=======############==========----------------------------------------

//-------------------------------------------------------------------------------------------------
// zoomin/out - functions for updating the zoom factor and scroll positions
//-------------------------------------------------------------------------------------------------

function zoomin()
{
		scrollx=scrollx/zoomfact;
		scrolly=scrolly/zoomfact;
	
		if(zoomfact==0.125) zoomfact=0.25
		else if(zoomfact==0.25) zoomfact=0.5
		else if(zoomfact==0.5) zoomfact=0.75
		else if(zoomfact==0.75) zoomfact=1.0
		else if(zoomfact==1.0) zoomfact=1.25
		else if(zoomfact==1.25) zoomfact=1.5
		else if(zoomfact==1.5) zoomfact=2.0
		else if(zoomfact==2.0) zoomfact=4.0;

		scrollx=scrollx*zoomfact;
		scrolly=scrolly*zoomfact;
	
		// Update scroll position - missing code for determining that center of screen should remain at nevw zoom factor
		showdata();
}

function zoomout()
{
		scrollx=scrollx/zoomfact;
		scrolly=scrolly/zoomfact;
	
		if(zoomfact==0.25) zoomfact=0.125
		else if(zoomfact==0.5) zoomfact=0.25
		else if(zoomfact==0.75) zoomfact=0.5
		else if(zoomfact==1.0) zoomfact=0.75
		else if(zoomfact==1.25) zoomfact=1.0
		else if(zoomfact==1.5) zoomfact=1.25
		else if(zoomfact==2.0) zoomfact=1.5
		else if(zoomfact==4.0) zoomfact=2.0;

		scrollx=scrollx*zoomfact;
		scrolly=scrolly*zoomfact;

		// Update scroll position - missing code for determining that center of screen should remain at new zoom factor
		showdata();
}

//-------------------------------------------------------------------------------------------------
// findIndex - Returns index of object with certain ID
//-------------------------------------------------------------------------------------------------

function findIndex(arr,id)
{
		for(var i=0;i<arr.length;i++){
				if(arr[i].id==id) return i;
		}
		return -1;
}

//-------------------------------------------------------------------------------------------------
// Showdata iterates over all diagram elements
//-------------------------------------------------------------------------------------------------

// Generate all courses at appropriate zoom level
function showdata() {
		var container=document.getElementById("container");
		var containerbox=container.getBoundingClientRect();	
    
		// Compute bounds of 
		cwidth=containerbox.width;
		cheight=containerbox.height;
	
		canvas=document.getElementById('canvasOverlay');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;	
		ctx = canvas.getContext('2d');	
			
		var str="";
		var courses=[];
		
		// Iterate over programs
		for(var i=0;i<data.length;i++){
				var element=data[i];
			
				// Compute size variables
				var linew=Math.round(strokewidth*zoomfact);
				var boxw=Math.round(element.width*zoomfact);
				var boxh=Math.round(element.height*zoomfact);
				var texth=Math.round(zoomfact*textheight);
				var hboxw=Math.round(element.width*zoomfact*0.5);
				var hboxh=Math.round(element.height*zoomfact*0.5);
			
				str+=`
				<div id='${element.id}'	class='element' onmousedown='ddown(event);' style='
						left:0px;
						top:0px;
						width:${boxw}px;
						height:${boxh}px;
						font-size:${texth}px; 
				'>`;
				str+=`<svg width='${boxw}' height='${boxh}' >`;
				if(element.kind=="EREntity"){
						str+=`<rect x='${linew}' y='${linew}' width='${boxw-(linew*2)}' height='${boxh-(linew*2)}' 
                   stroke-width='${linew}' stroke='black' fill='pink' />
                   <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text> 
                   `;
            
				}else if(element.kind=="ERAttr"){
            var dash="";
            if(element.isComputed == true){
                dash="stroke-dasharray='4 4'";
            }
            var multi="";
            if(element.isMultiple == true){
                multi=`
                    <path d="M${linew*multioffs},${hboxh} 
                    Q${linew*multioffs},${linew*multioffs} ${hboxw},${linew*multioffs} 
                    Q${boxw-(linew*multioffs)},${linew*multioffs} ${boxw-(linew*multioffs)},${hboxh} 
                    Q${boxw-(linew*multioffs)},${boxh-(linew*multioffs)} ${hboxw},${boxh-(linew*multioffs)} 
                    Q${linew*multioffs},${boxh-(linew*multioffs)} ${linew*multioffs},${hboxh}" 
                    stroke='black' fill='pink' stroke-width='${linew}' />`;
            }
						str+=`<path d="M${linew},${hboxh} 
                           Q${linew},${linew} ${hboxw},${linew} 
                           Q${boxw-linew},${linew} ${boxw-linew},${hboxh} 
                           Q${boxw-linew},${boxh-linew} ${hboxw},${boxh-linew} 
                           Q${linew},${boxh-linew} ${linew},${hboxh}" 
                    stroke='black' fill='pink' ${dash} stroke-width='${linew}' />
                    
                    ${multi}

                    <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text> 
                    `;
				}else if(element.kind=="ERRelation"){
            var weak="";
            if(element.isWeak == true){
                weak=`<polygon points="${linew*multioffs*1.5},${hboxh} ${hboxw},${linew*multioffs*1.5} ${boxw-(linew*multioffs*1.5)},${hboxh} ${hboxw},${boxh-(linew*multioffs*1.5)}"  
                stroke-width='${linew}' stroke='black' fill='pink'/>
                `;
            }
            str+=`<polygon points="${linew},${hboxh} ${hboxw},${linew} ${boxw-linew},${hboxh} ${hboxw},${boxh-linew}"  
                   stroke-width='${linew}' stroke='black' fill='pink'/>
                   ${weak}
                   <text x='${hboxw}' y='${hboxh}' dominant-baseline='middle' text-anchor='middle'>${element.name}</text> 
                   `;

        }
				str+="</svg>"
				str+="</div>";

		}

		container.innerHTML=str;
		updatepos(null,null);
	
}

//-------------------------------------------------------------------------------------------------
// updateselection - Update context according to selection parameters or clicked element
//-------------------------------------------------------------------------------------------------

function updateSelection(ctxelement,x,y)
{
		// Clear list of selected elements
		context=[];
		
		if(ctxelement!=null){
				// if we pass a context object e.g. we clicked in object
				context.push(ctxelement);
		}else if(typeof x != "undefined" && typeof y != "undefined"){
				// Or if x and y are both defined
		}
}


//-------------------------------------------------------------------------------------------------
// updatepos - Update positions of all elements based on the zoom level and view space coordinate
//-------------------------------------------------------------------------------------------------

function updatepos(deltaX,deltaY)
{
		for(var i=0;i<data.length;i++){
				
				var element=data[i];
				var elementbox=document.getElementById(element.id);
						
				if(elementbox!=null){
						if(deltaX!=null&&findIndex(context,element.id)!=-1){
								elementbox.style.left=(Math.round((element.x*zoomfact)+(scrollx*(1.0/zoomfact)))-deltaX)+"px";
								elementbox.style.top=(Math.round((element.y*zoomfact)+(scrolly*(1.0/zoomfact)))-deltaY)+"px";
						}else{
								elementbox.style.left=Math.round((element.x*zoomfact)+(scrollx*(1.0/zoomfact)))+"px";
								elementbox.style.top=Math.round((element.y*zoomfact)+(scrolly*(1.0/zoomfact)))+"px";
						}
				}
		}
		redrawArrows();
}

function linetest(x1,y1,x2,y2, x3,y3,x4,y4)
{
    // Display line test locations using svg lines
    // str+=`<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#44f' stroke-width='2' />`;
    // str+=`<line x1='${x3}' y1='${y3}' x2='${x4}' y2='${y4}' stroke='#44f' stroke-width='2' />`    

    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return {x:x,y:y};
}

//-------------------------------------------------------------------------------------------------
// sortvectors - Uses steering vectors as a sorting criteria for lines
//-------------------------------------------------------------------------------------------------

function sortvectors(a,b,ends,elementid,axis)
{
    // Get dx dy centered on association end e.g. invert vector if necessary
    var lineA=lines[findIndex(lines,a)];
    var lineB=lines[findIndex(lines,b)];
    var parent=data[findIndex(data,elementid)];

    // Retrieve opposite element - assume element center (for now)
    if(lineA.fromID==elementid){
        toElementA=data[findIndex(data,lineA.toID)];
    }else{
        toElementA=data[findIndex(data,lineA.fromID)];
    }
    if(lineB.fromID==elementid){
        toElementB=data[findIndex(data,lineB.toID)];
    }else{
        toElementB=data[findIndex(data,lineB.fromID)];
    }

    // If lines cross swap otherwise keep as is
    if(axis==0||axis==1){
          // Left side
          ay=parent.y1+(((parent.y2-parent.y1)/(ends.length+1))*(ends.indexOf(a)+1));
          by=parent.y1+(((parent.y2-parent.y1)/(ends.length+1))*(ends.indexOf(b)+1));
          if(axis==0) parentx=parent.x1
          else parentx=parent.x2;

          if(linetest(toElementA.cx,toElementA.cy,parentx,ay,toElementB.cx,toElementB.cy,parentx,by)===false) return -1
    }else if(axis==2||axis==3){
          // Top / Bottom side
          ax=parent.x1+(((parent.x2-parent.x1)/(ends.length+1))*(ends.indexOf(a)+1));
          bx=parent.x1+(((parent.x2-parent.x1)/(ends.length+1))*(ends.indexOf(b)+1));
          if(axis==2) parenty=parent.y1
          else parenty=parent.y2;

          if(linetest(toElementA.cx,toElementA.cy,ax,parenty,toElementB.cx,toElementB.cy,bx,parenty)===false) return -1
    }

    return 1;
}

//-------------------------------------------------------------------------------------------------
// redrawArrows - Redraws arrows based on rprogram and rcourse variables
//-------------------------------------------------------------------------------------------------

function redrawArrows()
{
    str="";

		// Clear all lines and update with dom object dimensions
		for(var i=0;i<data.length;i++){
				var element=data[i];
				element.left=[];
				element.right=[];
				element.top=[];
				element.bottom=[];

        // Get data from dom elements
        var domelement=document.getElementById(element.id);
        var domelementpos=domelement.getBoundingClientRect();
        element.x1=domelementpos.left;
        element.y1=domelementpos.top;
        element.x2=domelementpos.left+domelementpos.width;
        element.y2=domelementpos.top+domelementpos.height;
        element.cx=element.x1+(domelementpos.width*0.5);
        element.cy=element.y1+(domelementpos.height*0.5);
		}
		
		// Make list of all connectors?
		connectors=[];

    for(var i=0;i<lines.length;i++){
        var currentline=lines[i];
        var felem,telem,dx,dy;
        
        felem=data[findIndex(data,currentline.fromID)];
        telem=data[findIndex(data,currentline.toID)];
        currentline.dx=felem.cx-telem.cx;
        currentline.dy=felem.cy-telem.cy;

        // Figure out overlap - if Y overlap we use sides else use top/bottom
        var overlapY=true;
        if(felem.y1>telem.y2||felem.y2<telem.y1) overlapY=false;
        var overlapX=true;
        if(felem.x1>telem.x2||felem.x2<telem.x1) overlapX=false;        
        var majorX=true;
        if(Math.abs(currentline.dy)>Math.abs(currentline.dx)) majorX=false;

        // Determine connection type (top to bottom / left to right or reverse - (no top to side possible)
        var ctype=0;
        if(overlapY||((majorX)&&(!overlapX))){
            if(currentline.dx>0) currentline.ctype="LR"
            else currentline.ctype="RL"; 
        }else{
            if(currentline.dy>0) currentline.ctype="TB";
            else currentline.ctype="BT"; 
        }

        // Add accordingly to association end
        if(currentline.ctype=="LR"){
            if(felem.kind=="EREntity") felem.left.push(currentline.id);
            if(telem.kind=="EREntity") telem.right.push(currentline.id);
        }else if(currentline.ctype=="RL"){
          if(felem.kind=="EREntity") felem.right.push(currentline.id);
          if(telem.kind=="EREntity") telem.left.push(currentline.id);
        }else if(currentline.ctype=="TB"){
          if(felem.kind=="EREntity") felem.top.push(currentline.id);
          if(telem.kind=="EREntity") telem.bottom.push(currentline.id);
        }else if(currentline.ctype=="BT"){
          if(felem.kind=="EREntity") felem.bottom.push(currentline.id);
          if(telem.kind=="EREntity") telem.top.push(currentline.id);
        }
    }

    // Sort all association ends that number above 0 according to direction of line
		for(var i=0;i<data.length;i++){
      var element=data[i];

      // Only sort if size of list is >= 2
      if(element.top.length>1) element.top.sort(function(a, b){return sortvectors(a,b,element.top,element.id,2)});
      if(element.bottom.length>1) element.bottom.sort(function(a, b){return sortvectors(a,b,element.bottom,element.id,3)});
      if(element.left.length>1) element.left.sort(function(a, b){return sortvectors(a,b,element.left,element.id,0)});
      if(element.right.length>1) element.right.sort(function(a, b){return sortvectors(a,b,element.right,element.id,1)});
    }    

    // Draw each line using sorted line ends when applicable
    for(var i=0;i<lines.length;i++){
        var currentline=lines[i];
        var felem,telem,dx,dy;
        
        felem=data[findIndex(data,currentline.fromID)];
        telem=data[findIndex(data,currentline.toID)];

        // Draw each line - compute end coordinate from position in list compared to list count
        fx=felem.cx;
        fy=felem.cy;
        tx=telem.cx;
        ty=telem.cy;

        // Collect coordinates
        if(currentline.ctype=="BT"){
            fy=felem.y2;
            if(felem.kind=="EREntity") fx=felem.x1+(((felem.x2-felem.x1)/(felem.bottom.length+1))*(felem.bottom.indexOf(currentline.id)+1));
            ty=telem.y1;
          }else if(currentline.ctype=="TB"){
            fy=felem.y1;
            if(felem.kind=="EREntity") fx=felem.x1+(((felem.x2-felem.x1)/(felem.top.length+1))*(felem.top.indexOf(currentline.id)+1));
            ty=telem.y2;
        }else if(currentline.ctype=="RL"){
            fx=felem.x2;
            if(felem.kind=="EREntity") fy=felem.y1+(((felem.y2-felem.y1)/(felem.right.length+1))*(felem.right.indexOf(currentline.id)+1));
            tx=telem.x1;
        }else if(currentline.ctype=="LR"){
            fx=felem.x1;
            if(felem.kind=="EREntity") fy=felem.y1+(((felem.y2-felem.y1)/(felem.left.length+1))*(felem.left.indexOf(currentline.id)+1));
            tx=telem.x2;
          }

        if(currentline.kind=="Normal"){
            str+=`<line x1='${fx}' y1='${fy}' x2='${tx}' y2='${ty}' stroke='#f44' stroke-width='${strokewidth}' />`;
        }else if(currentline.kind=="Double"){
            // We mirror the line vector
            dy=-(tx-fx);
            dx=ty-fy;
            var len=Math.sqrt((dx*dx)+(dy*dy));
            dy=dy/len;
            dx=dx/len;
            str+=`<line x1='${fx+(dx*strokewidth*1.5)}' y1='${fy+(dy*strokewidth*1.5)}' x2='${tx+(dx*strokewidth*1.5)}' y2='${ty+(dy*strokewidth*1.5)}' stroke='#f44' stroke-width='${strokewidth}' />`;
            str+=`<line x1='${fx-(dx*strokewidth*1.5)}' y1='${fy-(dy*strokewidth*1.5)}' x2='${tx-(dx*strokewidth*1.5)}' y2='${ty-(dy*strokewidth*1.5)}' stroke='#f44' stroke-width='${strokewidth}' />`;
        }
         
    }

    document.getElementById("svgoverlay").innerHTML=str;
}

//------------------------------------=======############==========----------------------------------------
//                                    Default data display stuff
//------------------------------------=======############==========----------------------------------------

function getData() {
		showdata();
}

function data_returned(ret) {
    if (typeof ret.data !== "undefined") {
        service=ret;
        showdata();			
		} else {
        alert("Error receiveing data!");
    }
}
