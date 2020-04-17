/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 Example seed
	 Param: {"instructions":"Move and resize the box with id greger until it matches the required format.","query":"Make the greger-box 100px x 100px and with a 25px left side margin and 50px bottom padding",[]}
	 Answer: 
-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------
var score = -1;
var running;
var retdata = null;
var canvas = null;

var sf = 2.0;
var speed = 0.1;
var v = 0;
var pushcount = 0;
var elapsedTime = 0;
var tickInterval;

var dataV;

var ctx;
var mx=0,my=0;
var ox=0,oy=0;
var clickmode=0;
var clickstate=0;
var currobj=-1;

var rulerPaddingX=25;
var rulerPaddingY=25;

// Click Tolerance in Pixels
var tolerance=8;
var boxsize=5;

var boxes=new Array();

// Coordinate Limits
var minX=25;
var maxX=525;
var minY=25;
var maxY=625;

// Canvas size
canvasWidth = 625;
canvasHeight = 625;

var evalstr = "";
var facit=false; // When true - dashed lines is always visable

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	running = true;
	canvas = document.getElementById("myCanvas");

	if (canvas && canvas.getContext) {
		canvas.addEventListener('mousemove', mouseMove, false);
		canvas.addEventListener('mousedown', mouseDown, false);
		canvas.addEventListener('mouseup', mouseUp, false);
		ctx = canvas.getContext('2d');
		ctx.font = "18px Arial";

		tickInterval = setInterval("tick();", 50);

		AJAXService("GETPARAM", { }, "PDUGGA");
	}

}

function returnedDugga(data) 
{	
	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		if (canvas) {
			retdata = jQuery.parseJSON(data['param']);

			boxes.length = 0; // Clear array.
			evalstr = retdata["code"];
			document.getElementById("duggaInstructions").innerHTML = retdata["instructions"];
			var tmpstr = retdata["query"];
			tmpstr += "<BR><BR><div style='background-color:#FFF;'><code><pre style='font-family:hack;font-size:12px'>";
			for (var l = 0;l<retdata["css"].length;l++){
				if (retdata["css"][l].substr(0,1) === "#") {
					if (l!==0){
						tmpstr += "}<BR>" + retdata["css"][l] + "<BR>";
					} else {
						tmpstr += retdata["css"][l] + "<BR>";	
					}
					
				} else {
					tmpstr += "   " + retdata["css"][l] + ";<BR>";
				}
			}
			tmpstr += "}</pre></code></div>";
			document.getElementById("duggaQuery").innerHTML = tmpstr;

			//showDuggaInfoPopup();
			var studentPreviousAnswer = "";

			if (data["answer"] == null || data["answer"] !== "UNK") {
				var tmpstr = data["answer"].substr(data["answer"].indexOf("["));
				tmpstr = tmpstr.substr(0, tmpstr.lastIndexOf("]")+1);
				tmpstr = tmpstr.replace(/&quot;/g, "\"");
				var userboxes = jQuery.parseJSON(tmpstr);
				for (var b=0; b<userboxes.length; b++) {
					var box = userboxes[b];
					boxes.push(new movableBox(box.scx1,box.scy1,box.scx2,box.scy2,box.scx3,box.scy3,box.scx4,box.scy4,box.texto,box.kind,box.colr,box.clip,box.txtcolr,box.txtx,box.txty));
				}
			} else {
				for (var b=0; b<retdata["boxes"].length; b++) {
					var box = retdata["boxes"][b];
					boxes.push(new movableBox(box.scx1,box.scy1,box.scx2,box.scy2,box.scx3,box.scy3,box.scx4,box.scy4,box.texto,box.kind,box.colr,box.clip,box.txtcolr,box.txtx,box.txty));
				}
			}

			drawGraphics();
		}
	}
	// Teacher feedback
	if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
			// No feedback
	} else {
		var fb = "<table class='list feedback-list'><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
		var feedbackArr = data["feedback"].split("||");
		for (var k=feedbackArr.length-1;k>=0;k--){
			var fb_tmp = feedbackArr[k].split("%%");
			fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
			$("#showFeedbackButton").css("display","block");
		} 		
		fb += "</tbody></table>";
			document.getElementById('feedbackTable').innerHTML = fb;		
			document.getElementById('feedbackBox').style.display = "block";
	}
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
}

function reset()
{
	// console.log(JSON.stringify(boxes));
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");

	boxes.length = 0; // Clear array.
	for (var b=0; b<retdata["boxes"].length; b++) {
		var box = retdata["boxes"][b];
		boxes.push(new movableBox(box.scx1,box.scy1,box.scx2,box.scy2,box.scx3,box.scy3,box.scx4,box.scy4,box.texto,box.kind,box.colr,box.clip,box.txtcolr,box.txtx,box.txty));
	}

	Timer.stopTimer();
	Timer.score=0;
	Timer.startTimer();
	ClickCounter.initialize();

}

function saveClick() 
{
	Timer.stopTimer();

	timeUsed = Timer.score;
	stepsUsed = ClickCounter.score;

	score = 0;

	if (querystring['highscoremode'] == 1) {	
		score = Timer.score;
	} else if (querystring['highscoremode'] == 2) {
		score = ClickCounter.score;
	}

	// Loop through all bits
	bitstr = JSON.stringify(boxes);
	bitstr += ",T " + elapsedTime;

	bitstr += " " + window.screen.width;
	bitstr += " " + window.screen.height;

	bitstr += " " + $(window).width();
	bitstr += " " + $(window).height();

	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		$("#duggaStats").css("display","block");
		$("#duggaStats").draggable({ handle:'.loginBoxheader'});
	}
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext('2d');
	ctx.font = "18px Arial";
	facit = true;

	
	if (canvas) {
		retdata = jQuery.parseJSON(param);

			boxes.length = 0; // Clear array.
			evalstr = retdata["code"];
			document.getElementById("duggaInstructions").innerHTML = retdata["instructions"];
			var tmpstr = retdata["query"];
			tmpstr += "<BR><BR><div style='background-color:#FFF;'><code><pre style='font-family:hack;font-size:12px'>";
			for (var l = 0;l<retdata["css"].length;l++){
				if (retdata["css"][l].substr(0,1) === "#") {
					if (l!==0){
						tmpstr += "}<BR>" + retdata["css"][l] + "<BR>";
					} else {
						tmpstr += retdata["css"][l] + "<BR>";	
					}
					
				} else {
					tmpstr += "   " + retdata["css"][l] + ";<BR>";
				}
			}
			tmpstr += "}</pre></code></div>";
			document.getElementById("duggaQuery").innerHTML = tmpstr;

			//showDuggaInfoPopup();
			var studentPreviousAnswer = "";

			if (uanswer == null || uanswer !== "UNK") {
				var tmpstr = uanswer.substr(uanswer.indexOf("["));
				tmpstr = tmpstr.substr(0, tmpstr.lastIndexOf("]")+1);
				tmpstr = tmpstr.replace(/&quot;/g, "\"");
				var userboxes = jQuery.parseJSON(tmpstr);
				for (var b=0; b<userboxes.length; b++) {
					var box = userboxes[b];
					boxes.push(new movableBox(box.scx1,box.scy1,box.scx2,box.scy2,box.scx3,box.scy3,box.scx4,box.scy4,box.texto,box.kind,box.colr,box.clip,box.txtcolr,box.txtx,box.txty));
				}
			} else {
				for (var b=0; b<retdata["boxes"].length; b++) {
					var box = retdata["boxes"][b];
					boxes.push(new movableBox(box.scx1,box.scy1,box.scx2,box.scy2,box.scx3,box.scy3,box.scx4,box.scy4,box.texto,box.kind,box.colr,box.clip,box.txtcolr,box.txtx,box.txty));
				}
			}

			drawGraphics();
		}
		// Teacher feedback
		var fb = "<textarea id='newFeedback'></textarea><div class='feedback-info'>* grade to save feedback.</div><table class='list feedback-list'><caption>Previous feedback</caption><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
		if (feedback !== undefined && feedback !== "UNK" && feedback !== ""){
			var feedbackArr = feedback.split("||");
			for (var k=feedbackArr.length-1;k>=0;k--){
				var fb_tmp = feedbackArr[k].split("%%");
				fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
			} 		
		}
		fb += "</tbody></table>";
		if (feedback !== undefined){
				document.getElementById('teacherFeedbackTable').innerHTML = fb;
		}
	}

	function closeFacit() 
	{
		clearInterval(tickInterval);
		running = false;
	}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------
//------------==========########### CONTROLLER FUNCTIONS ###########==========------------

function tick() 
{
	v += speed;
	elapsedTime++;

}

//----------------------------------------------------------------------------------
// High score function, gets called from hideDuggainfoPopup function in dugga.js
// dataV = global variable with the data set in returnedDugga
//----------------------------------------------------------------------------------

function startDuggaHighScore(){
	Timer.startTimer();
	ClickCounter.initialize();

	if(querystring['highscoremode'] == 1) {
		if(dataV['score'] > 0){
			Timer.score = dataV['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		if(dataV['score'] > 0){
			ClickCounter.score = dataV['score'];
		}
		ClickCounter.showClicker();
	} else {
		score = 0;
	}
}			
			// Scaleable / Movable Box
			function movableBox(scx1,scy1,scx2,scy2,scx3,scy3,scx4,scy4,texto,kind,colr,clip,txtcolr,txtx,txty) {

				this.scx1=scx1;
				this.scy1=scy1;
				this.scx2=scx2;
				this.scy2=scy2;
				this.scx3=scx3;
				this.scy3=scy3;
				this.scx4=scx4;
				this.scy4=scy4;
				this.texto=texto;
				this.kind=kind;
				this.colr=colr;
				this.clip=clip;
				this.txtcolr=txtcolr;
				this.txtx=txtx;
				this.txty=txty;
				this.txtw=ctx.measureText(texto).width;
				this.txth=19;

				this.clicktest=function()
				{
					var clickmode=0;
					if(kind==1){

						if(clickregionX(this.scx1,this.scy1,this.scy2)){
							clickmode=1;
						}else if(clickregionX(this.scx2,this.scy1,this.scy2)){
							clickmode=2;
						}else if(clickregionY(this.scx1,this.scy1,this.scx2)){
							clickmode=3;
						}else if(clickregionY(this.scx1,this.scy2,this.scx2)){
							clickmode=4;
						}else if(clickregionX(this.scx3,this.scy3,this.scy4)){
							clickmode=5;
						}else if(clickregionX(this.scx4,this.scy3,this.scy4)){
							clickmode=6;
						}else if(clickregionY(this.scx3,this.scy3,this.scx4)){
							clickmode=7;
						}else if(clickregionY(this.scx3,this.scy4,this.scx4)){
							clickmode=8;
						}else if(clickregionXY(this.scx1,this.scy1,this.scx2,this.scy2)){
							clickmode=9;
						}
						if(clickregionXY(this.scx3+this.txtx,this.scy3+this.txty-this.txth,this.scx3+this.txtx+this.txtw,this.scy3+this.txty)){
							clickmode=10;
						} 

					}
					return clickmode;
				}

				this.moveLeft=function(mx)
				{
					if(mx<this.scx4&&mx>minX&&mx<maxX){
						this.scx1=mx;
						if(this.scx3<this.scx1) this.scx3=this.scx1;							
					}
				}

				this.moveRight=function(mx)
				{
					if(mx>this.scx3&&mx>minX&&mx<maxX){
						this.scx2=mx;
						if(this.scx4>this.scx2) this.scx4=this.scx2;
					}
				}

				this.moveTop=function(my)
				{
					if(my<this.scy4&&my>minY&&mx<maxY){
						this.scy1=my;
						if(this.scy3<this.scy1) this.scy3=this.scy1;
					}
				}

				this.moveBottom=function(my)
				{
					if(my>this.scy3&&my>minY&&my<maxY){
						this.scy2=my;
						if(this.scy4>this.scy2) this.scy4=this.scy2;
					}
				}

				this.moveInnerLeft=function(mx)
				{
					if(mx<this.scx4&&mx>minX&&mx<maxX){
						this.scx3=mx;
						if(this.scx3<this.scx1) this.scx1=this.scx3;
					}
				}

				this.moveInnerRight=function(mx)
				{
					if(mx>this.scx3&&mx>minX&&mx<maxX){
						this.scx4=mx;
						if(this.scx4>this.scx2) this.scx2=this.scx4;
					}
				}

				this.moveInnerTop=function(my)
				{
					if(my<this.scy4&&my>minY&&my<maxY){
						this.scy3=my;
						if(this.scy3<this.scy1) this.scy1=this.scy3;
					}
				}

				this.moveInnerBottom=function(my)
				{
					if(my>this.scy3&&my>minY&&my<maxY){
						this.scy4=my;
						if(this.scy4>this.scy2) this.scy2=this.scy4;
					}
				}	

				this.moveBox=function(dx,dy)
				{

							//if((this.scx1+dx)>minX&&(this.scx4+dx)<maxX&&(this.scy1+dy)>minY&&(this.scy4+dy)<maxY){
								if(true){
									this.scx1+=dx;
									this.scx2+=dx;
									this.scx3+=dx;
									this.scx4+=dx;
									this.scy1+=dy;
									this.scy2+=dy;
									this.scy3+=dy;
									this.scy4+=dy;
								}
							}

							this.moveText=function(dx,dy)
							{
								this.txtx+=dx;
								this.txty+=dy;
							}


							this.drawBox=function(no)
							{
								if(kind==1){

									if(no==currobj){
										scalebox(this.scx1,this.scy1,this.scx2,this.scy2,this.scx3,this.scy3,this.scx4,this.scy4,"#000","#656",10,this.texto,true,this.colr,this.clip,this.txtcolr,this.txtx,this.txty);			

										ctx.globalAlpha=0.5;
										ctx.lineWidth=2;
										ctx.strokeStyle="#5b5";
										ctx.beginPath();
										ctx.moveTo(0,this.scy1);
										ctx.lineTo(25,this.scy1);
										ctx.moveTo(0,this.scy2);
										ctx.lineTo(25,this.scy2);
										ctx.moveTo(this.scx1,0);
										ctx.lineTo(this.scx1,25);
										ctx.moveTo(this.scx2,0);
										ctx.lineTo(this.scx2,25);
										ctx.stroke();
										ctx.strokeStyle="#b5b";
										ctx.beginPath();
										ctx.moveTo(0,this.scy3);
										ctx.lineTo(25,this.scy3);
										ctx.moveTo(0,this.scy4);
										ctx.lineTo(25,this.scy4);
										ctx.moveTo(this.scx3,0);
										ctx.lineTo(this.scx3,25);
										ctx.moveTo(this.scx4,0);
										ctx.lineTo(this.scx4,25);
										ctx.stroke();
										ctx.globalAlpha=1.0;

									}else{
										if (facit){
											scalebox(this.scx1,this.scy1,this.scx2,this.scy2,this.scx3,this.scy3,this.scx4,this.scy4,"#000","#656",10,this.texto,true,this.colr,this.clip,this.txtcolr,this.txtx,this.txty);			
										} else {
											scalebox(this.scx1,this.scy1,this.scx2,this.scy2,this.scx3,this.scy3,this.scx4,this.scy4,"#000","#656",10,this.texto,false,this.colr,this.clip,this.txtcolr,this.txtx,this.txty);			
										}


									}
								}else{									
									shadedBox(this.scx1,this.scy1,this.scx2,this.scy2,texto,8,10,6,this.colr,this.txtcolr);	 					
								}
							}				
						}   

			//This function is called by the onmousemove event for the canvas element
			function mouseMove(event){
						//Find the position of the canvas element
						var pos=findPos(event); //event.target is the canvas
						
						ox=mx;
						oy=my;
						mx=pos.x;
						my=pos.y;
						
						var canvas = document.getElementById("myCanvas");

						if(clickmode==1||clickmode==2||clickmode==5||clickmode==6){
							canvas.style.cursor="ew-resize";						
						}else if(clickmode==3||clickmode==4||clickmode==7||clickmode==8){
							canvas.style.cursor="ns-resize";												
						}else if(clickmode==9||clickmode==10){
							canvas.style.cursor="grab";																		
						}else{
							canvas.style.cursor="default";																								
						}

						if(clickstate==0){
							clickmode=0;
							currobj=-1;
							for(i=0;i<boxes.length;i++){
								var tst=boxes[i].clicktest();
								if(tst!=0){
									currobj=i;
									clickmode=tst;
								}
							}
						}else{
							var dx=mx-ox;
							var dy=my-oy;

							if(currobj>=0){
								if(clickmode==1){
									boxes[currobj].moveLeft(mx);
								}else if(clickmode==2){
									boxes[currobj].moveRight(mx);
								}else if(clickmode==3){
									boxes[currobj].moveTop(my);
								}else if(clickmode==4){
									boxes[currobj].moveBottom(my);
								}else if(clickmode==5){
									boxes[currobj].moveInnerLeft(mx);											
								}else if(clickmode==6){
									boxes[currobj].moveInnerRight(mx);											
								}else if(clickmode==7){
									boxes[currobj].moveInnerTop(my);											
								}else if(clickmode==8){
									boxes[currobj].moveInnerBottom(my);											
								}else if(clickmode==9){
									boxes[currobj].moveBox(dx,dy);											
								}else if(clickmode==10){
									boxes[currobj].moveText(dx,dy);											
								}
								
							}
						}
						
						// Connecting Boxes.
						boxes[0].moveRight(boxes[1].scx1);						
					}

			//This function is called when a mouse button is pressed down on the canvas element
			function mouseDown(event){
						//Find the position of the canvas element
						var pos=findPos(event); //event.target is the canvas
						mx=pos.x;
						my=pos.y;
						clickstate=1;
						
					}       

			//This function is called when a mouse button is released from the canvas element
			function mouseUp(event){
						//Find the position of the canvas element
						var pos=findPos(event); //event.target is the canvas
						mx=pos.x;
						my=pos.y;
						
						clickmode=0;
						clickstate=0;

						var canvas = document.getElementById("myCanvas");
						canvas.style.cursor="default";
					}


					function drawGraphics()
					{

						eval(evalstr);

	// Background
	ctx.fillStyle="#fff";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);

	// Ruler
	drawRuler(0,575,0,4,7,rulerPaddingX,rulerPaddingY);
	
	// Movable Boxes
	for(i=0;i<boxes.length;i++){
		boxes[i].drawBox(i);
	}
	
	/*
	ctx.beginPath();
	ctx.moveTo(mx-10,my-10);
	ctx.lineTo(mx+10,my+10);
	ctx.moveTo(mx+10,my-10);
	ctx.lineTo(mx-10,my+10);
	ctx.stroke();	  			
	*/
	setTimeout(function(){drawGraphics()}, 30);
}


function findPos(event) {
	var curleft = curtop = 0;
	var obj=event.target;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
		return {x:event.pageX-curleft, y:event.pageY-curtop} //Returns the position of the element as an object
	}

// Dugga.js
function clickregionX(x1,y1,y2,clickm){
	return ((mx>(x1-tolerance))&&(mx<(x1+tolerance))&&(my>(y1-tolerance))&&(my<(y2+tolerance)));
}

// Dugga.js
function clickregionY(x1,y1,x2,clickm){
	return ((my>(y1-tolerance))&&(my<(y1+tolerance))&&(mx>(x1-tolerance))&&(mx<(x2+tolerance)));		
}

// Dugga.js
function clickregionXY(x1,y1,x2,y2,clickm){
	return ((my>(y1-tolerance))&&(my<(y2+tolerance))&&(mx>(x1-tolerance))&&(mx<(x2+tolerance)));
}

// Dugga.js
function shadedBox(x1,y1,x2,y2,texto,ow,oh,lw,colr,txtcolr)
{
	ctx.font = "16px Arial";

	var tcx=x1+(0.5*(x2-x1));
	var tcy=y1+(0.5*(y2-y1));
	var tw=ctx.measureText(texto).width*0.5;

	if(x1>(tcx-tw-ow)) x1=(tcx-tw-ow);
	if(x2<(tcx+tw+ow)) x2=(tcx+tw+ow);					
	if(y1>(tcy-oh)) y1=(tcy-oh);
	if(y2<(tcy+oh)) y2=(tcy+oh);					

		// Rectangle
		ctx.globalAlpha=0.5;
		ctx.fillStyle=colr;
		
		ctx.beginPath();		
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y1);
		ctx.lineTo(x2,y2);					
		ctx.lineTo(x1,y2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();		
		
		ctx.moveTo(x1,y1);
		ctx.lineTo(tcx-tw-ow,y1);
		ctx.lineTo(tcx-tw-ow,y2);					
		ctx.lineTo(x1,y2);
		ctx.closePath();					

		ctx.moveTo(tcx+tw+ow,y1);
		ctx.lineTo(x2,y1);
		ctx.lineTo(x2,y2);					
		ctx.lineTo(tcx+tw+ow,y2);
		ctx.closePath();					

		ctx.moveTo(tcx-tw-ow,y1);
		ctx.lineTo(tcx+tw+ow,y1);
		ctx.lineTo(tcx+tw+ow,tcy-oh);					
		ctx.lineTo(tcx-tw-ow,tcy-oh);
		ctx.closePath();					

		ctx.moveTo(tcx-tw-ow,tcy+oh);
		ctx.lineTo(tcx+tw+ow,tcy+oh);
		ctx.lineTo(tcx+tw+ow,y2);					
		ctx.lineTo(tcx-tw-ow,y2);
		ctx.closePath();	
		
		ctx.save();
		
		ctx.clip();

		for(var i=x1-(y2-y1);i<x2;i+=lw){
			ctx.beginPath();		
			ctx.moveTo(i,y1);
			ctx.lineTo((y2-y1)+i,y2);
			ctx.stroke();
		}
		
		ctx.restore();

		ctx.fillStyle=txtcolr;				
		ctx.textAlign = 'center';
		ctx.fillText(texto,tcx,tcy+6);
		
		ctx.globalAlpha=1.0;					
	}

// Dugga.js
function markRect(x1,y1,c1,c2)
{
		// Rectangle
		var grd=ctx.createLinearGradient(x1-boxsize,0,x1+boxsize,0);
		grd.addColorStop(0,c1);
		grd.addColorStop(1,c2);
		
		ctx.fillStyle=grd;
		ctx.beginPath();		
		ctx.moveTo(x1-boxsize,y1-boxsize);
		ctx.lineTo(x1+boxsize,y1-boxsize);
		ctx.lineTo(x1+boxsize,y1+boxsize);					
		ctx.lineTo(x1-boxsize,y1+boxsize);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();										
	}

	function drawDashedLine(sx,sy,ex,ey,dashlen)
	{

		var dx=ex-sx;
		var dy=ey-sy;

		len=Math.sqrt((dx*dx)+(dy*dy));
		notimes=Math.round(len/dashlen);

		dx=dx/notimes;
		dy=dy/notimes;

		var xk,yk;
		xk=sx;
		yk=sy;
		xh=dx/2.0;
		yh=dy/2.0;
		for(var i=0;i<notimes;i++){

			ctx.moveTo(xk,yk);				
			ctx.lineTo(xk+xh,yk+yh);

			xk+=dx;
			yk+=dy;
		}

	}

	function scalebox(x1,y1,x2,y2,x3,y3,x4,y4,c1,c2,radius,texto,state,colr,clipmode,txtcolr,txtX,txtY)
	{
		cx1=x1+((x2-x1)*0.5);
		cy1=y1+((y2-y1)*0.5);
		cx3=x3+((x4-x3)*0.5);
		cy3=y3+((y4-y3)*0.5);

		// Rounded Rectangle
		ctx.globalAlpha=0.5;
		ctx.fillStyle=colr;
		ctx.beginPath();
		ctx.moveTo(x4-radius,y3)
		ctx.quadraticCurveTo(x4,y3,x4,y3+radius);
		ctx.lineTo(x4,y4-radius);
		ctx.quadraticCurveTo(x4,y4,x4-radius,y4);
		ctx.lineTo(x3+radius,y4);
		ctx.quadraticCurveTo(x3,y4,x3,y4-radius);
		ctx.lineTo(x3,y3+radius);
		ctx.quadraticCurveTo(x3,y3,x3+radius,y3);
		ctx.closePath();
		ctx.fill();	
		ctx.globalAlpha=1.0;								
		
		if(texto!=""){
			ctx.save();

			ctx.font = "18px Arial";
			ctx.textAlign = 'left';
			ctx.fillStyle = txtcolr;
			ctx.fillText(texto,x3+txtX,y3+txtY);			

			if(state){
				ctx.beginPath();
				var txtw=ctx.measureText(texto).width;
				drawDashedLine(x3+txtX-4,y3+txtY+8,x3+txtX+txtw+4,y3+txtY+8,4);				
				drawDashedLine(x3+txtX-4,y3-20+txtY,x3+txtX+txtw+4,y3-20+txtY,4);				
				drawDashedLine(x3+txtX-4,y3-20+txtY,x3+txtX-4,y3+txtY+8,4);				
				drawDashedLine(x3+txtX+txtw+4,y3-20+txtY,x3+txtX+txtw+4,y3+txtY+8,4);				
				ctx.stroke();

				ctx.globalAlpha=0.10;
				ctx.lineWidth=2;
				ctx.strokeStyle="#888";
				ctx.fillRect(0,y3-20+txtY,25,28);
				ctx.fillRect(x3+txtX-4,0,txtw+8,25);

				ctx.globalAlpha=0.5;
				ctx.globalAlpha=1.0;

			}

			ctx.restore();
		}

		if(state){

				// Rectangle 1
				ctx.strokeStyle=c1;
				ctx.beginPath();		
				drawDashedLine(x1,y1,x1,y2,4);
				drawDashedLine(x2,y1,x2,y2,4);
				drawDashedLine(x1,y1,x2,y1,4);
				drawDashedLine(x1,y2,x2,y2,4);
				ctx.stroke();	

				markRect(x1,cy1,"#2d4","#172");
				markRect(x2,cy1,"#2d4","#172");
				markRect(cx1,y1,"#2d4","#172");
				markRect(cx1,y2,"#2d4","#172");

				markRect(x3,cy3,"#e36","#914");
				markRect(x4,cy3,"#e36","#914");
				markRect(cx3,y3,"#e36","#914");
				markRect(cx3,y4,"#e36","#914");
			}		
		}
// Dugga.js
function drawRuler(sx,ex,sy,ws,wl,skip,padding)
{

	// Start with yellow color
	ctx.strokeStyle="#FF0";	
	ctx.fillStyle="#FF0";
	ctx.globalAlpha=0.3;

	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineTo(0,padding);
	ctx.lineTo(ex+padding,padding);
	ctx.lineTo(ex+padding,0);
	ctx.lineTo(0,0);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(0,padding);
	ctx.lineTo(padding,padding);
	ctx.lineTo(padding,ex+padding);
	ctx.lineTo(0, ex+padding);
	ctx.lineTo(0,padding);
	ctx.fill();

	ctx.stroke();


	ctx.font = "10px Arial";
	ctx.globalAlpha=1.0;

	// Ruler
	ctx.strokeStyle="#000";	
	ctx.fillStyle="#000";
	ctx.textAlign = 'center';
	for(var i = 0;i<ex;i+=skip){
		if(i%100==0){
			ctx.lineWidth=2;

			ctx.beginPath();
			ctx.moveTo(padding+i,sy);
			ctx.lineTo(padding+i,sy+wl);
			ctx.moveTo(sx,padding+i);
			ctx.lineTo(sx+wl,padding+i);
			ctx.stroke();

			ctx.fillText(i,padding+i,18);
			ctx.fillText(i,16,padding+i+3);

		}else{
			ctx.lineWidth=1.0;
			ctx.beginPath();
			ctx.moveTo(padding+i,sy);
			ctx.lineTo(padding+i,sy+ws);
			ctx.moveTo(sy,padding+i);
			ctx.lineTo(sy+ws,padding+i);
			ctx.stroke();

			ctx.fillText(i,padding+i,12);
			ctx.fillText(i,12,padding+i+3);
		}
	}

}
