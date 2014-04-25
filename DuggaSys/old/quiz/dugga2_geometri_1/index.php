<?php 
header("X-UA-Compatible: IE=edge,chrome=1");
$courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
$courseOccasion="HT-13 LP4";
$duggaNr=5;
$ajaxPath="../../quizAjax/";
if(isset($_GET['answerString'])) $answerString=$_GET['answerString'];
if(isset($_GET['courseOccasion'])) $courseOccasion=$_GET['courseOccasion'];

include "../dugga_checklogin.php";

if ($accountname=checklogin($errorMsg, $courseName, $courseOccasion, $duggaNr)): 
?>
<html>
	<head>
		<meta charset="UTF-8"/>	
		<style>
			p, a, h1, h2, h3, h4, h5, table, td, th, label, caption{font-family:Helvetica, Arial, sans-serif;}
		</style>
		<script type="text/javascript" src="../js/jquery-1.8.0.min.js"></script>
		<script lang='Javascript'>
					var account="<?php echo $accountname ?>";		
					var duggaNr="<?php echo $duggaNr ?>";		
					var courseName="<?php echo $courseName ?>";		
					var courseOccasion="<?php echo $courseOccasion ?>";	
					var quizObjectsIDs=new Array();
					var quizGoal="";
					var startString="<?php if(isset($answerString)) echo $answerString ?>";
					
					$(document).ready(function() {
						fetchQuiz();
						fetchQuizObject("quizG");
					});
					
					function fetchQuiz(){
						$.post("<?php echo $ajaxPath?>getQuiz.php", 
							   {loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr }, 
								fetchQuizCallBack,
								"json"
						);
					}
					
					function fetchQuizCallBack(data){
						if (typeof data.Error != 'undefined') {
							$("#result").html("<p>"+data.Error+"</p>");
							if(typeof data.answerHash != 'undefined'){
								$("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
							}
						} else {
							$("#quizInstructions").append(data.quizData);
							quizObjectsIDs=data.quizObjectIDs.split(" ");
							//fetchQuizObject(quizObjectsIDs[0]);
						}
					}
					
					function checkAnswer(submitstr){
						$.post("<?php echo $ajaxPath?>answerQuiz.php", 
							{loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, quizAnswer: submitstr}, 
							checkAnswerCallBack,
							"json"
						);
					}
								
					function fetchQuizObject(objectName){
						$.post("<?php echo $ajaxPath?>getQuizObject.php", 
							   {objectID: objectName, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, loginName: account}, 
								fetchQuizObjectCallBack,
								"json"
						);
					}

					function fetchQuizObjectCallBack(data){
						if (typeof data.Error != 'undefined') {
							$("#result").append("<br/><h3>Error:"+data.Error+"</h3>");
						} else {
							quizGoal=data.objectData;
							if(startString!="") populateOperationsList();
							init();
						}
					}
		</script>
	
		<script type="text/javascript" src="dugga.js"></script>	
	
	

	</head>
	<body onload="//setupcanvas();//init();">
	<div>
			

				<canvas id='a' width='600' height='600' style='border:2px solid black;float:left; cursor:none;'>
				</canvas>

				<div style="border:2px solid black;background-color:#fed;width:300;float:left;margin-left:10px;">
					
					<div id="infobox" style="padding:4px;">
					<div id="quizInstructions"></div>
					<!--Change values in form to update curve and information box.<br>-->
					
					<form>
					
					 
					<select id="function" name="function" >

							<option value="L 100 100 200 360">Linje</option>
							<option value="Q 200 300 140 260 400 200">Kvadratisk kurva</option>
							<option value="C 160 220 440 120 220 440 360 500">Kubisk kurva</option>
							<!--<option value="S 60 80 120 240 300 260">Circle Segment</option>-->

					</select>			
					<button type="button" onclick="newbutton();">LÄGG TILL</button>
					
					<br>Operations:<br> 
					<select style="width:150px;" size="10" id="operations" name="operations">
					</select>			
					
					<br>
					<button type="button" onclick="moveupbutton();">FLYTTA UPP</button>
					<button type="button" onclick="movedownbutton();">FLYTTA NER</button>
					<button type="button" onclick="deletebutton();">TA BORT</button>
					<button type="button" onclick="submbutton();">SKICKA SVAR</button>
					<br>
					
					</form>		
					<div id="result"></div>
					</div>
					
					</div>
				</div>
	
	<script lang='Javascript'>
	/*
 
 		First point immovible
 		-----
 		Delete operation
 		Move Up
 		Move Down
 		Move Control Points
 
	*/	
		function populateOperationsList()
		{

			var startOperations=startString.split(',');
			
			var functionList=document.getElementById("function");
			
			var opList=document.getElementById("operations");
			console.log(startOperations);

			for(var i=0;i<startOperations.length;i++){
				var text="";
				for(var j=0;j<functionList.options.length;j++){
					if(startOperations[i].substring(0,1)==functionList.options[j].value.substring(0,1)) text=functionList.options[j].innerHTML;
				}
				
				opList.innerHTML+="<option value='"+startOperations[i]+"'>"+text+"</option>";
			}
		}
		
		function newbutton()
		{
				var funclist;
				var oplist;
				
				funclist=document.getElementById('function');
				oplist=document.getElementById('operations');
				
				oplist.innerHTML+="<option value='"+funclist.options[funclist.selectedIndex].value+"'>"+funclist.options[funclist.selectedIndex].text+"</option>";
				
				// If first assign first coordinate to startx and starty
				if(oplist.length==1){
						setpoint(oplist.length-1,1,startx,starty);
						coord=makepoint(startx,starty);
						setpoint(oplist.length-1,2,coord.x,coord.y);
				}else{
						// If any other set first coordinate to last coordinate of last item
						coord=getpoint(oplist.length-2,-1);
						setpoint(oplist.length-1,1,coord.x,coord.y);
						coord=makepoint(coord.x,coord.y);
						setpoint(oplist.length-1,2,coord.x,coord.y);
				}
				// For rest of control points
				if(funclist.selectedIndex==1||funclist.selectedIndex==2||funclist.selectedIndex==3){
						coord=makepoint(coord.x,coord.y);
						setpoint(oplist.length-1,3,coord.x,coord.y);
				}						
				if(funclist.selectedIndex==2){
						coord=makepoint(coord.x,coord.y);
						setpoint(oplist.length-1,4,coord.x,coord.y);
				}						

		}
		
		function deletebutton()
		{
				var elSel = document.getElementById('operations');
  			var i=0;
  			for (i=elSel.length-1;i>=0;i--) {
    				if (elSel.options[i].selected) {
      				elSel.remove(i);
    				}
  			}
		}
		
		function moveupbutton()
		{
				var elSel = document.getElementById('operations');
				var ind=elSel.selectedIndex;
				var val;
				var tex;

				if(elSel.selectedIndex>0){
						
						val=elSel.options[ind].value;
						tex=elSel.options[ind].text;

						elSel.options[ind].value=elSel.options[ind-1].value;
						elSel.options[ind].text=elSel.options[ind-1].text;
						
						elSel.options[ind-1].value=val;
						tex=elSel.options[ind-1].text=tex;
							
						elSel.selectedIndex--;				
				}
		}

		function movedownbutton()
		{
				var elSel = document.getElementById('operations');
				var ind=elSel.selectedIndex;
				var val;
				var tex;

				if(elSel.selectedIndex<elSel.length-1){
						
						val=elSel.options[ind].value;
						tex=elSel.options[ind].text;

						elSel.options[ind].value=elSel.options[ind+1].value;
						elSel.options[ind].text=elSel.options[ind+1].text;
						
						elSel.options[ind+1].value=val;
						tex=elSel.options[ind+1].text=tex;
							
						elSel.selectedIndex++;				
				}
				
		}

		function handler_mouseup(ev)
		{
				clickstate=0;
				cpsel=-1;
				cpno=0;
		}
		
		function handler_mousedown(ev)
		{
				clickstate=1;
		}
		
		function handler_mousemove(cx, cy) 
		{

				if(clickstate==1){
						mx=cx;
						my=cy;
				}		
				
				
				gridx=Math.round((cx-(gridsize/2.0))/gridsize)*gridsize;
				gridy=Math.round((cy-(gridsize/2.0))/gridsize)*gridsize;				
		}


		// Fix scrolling on touch devices
		var ScrollFix = function(elem) {
		    // Variables to track inputs
		    var startY, startTopScroll;
		
		    elem = elem || document.querySelector(elem);
		
		    // If there is no element, then do nothing  
		    if(!elem)
		        return;
		
		    // Handle the start of interactions
		    elem.addEventListener('touchstart', function(event){
		        startY = event.touches[0].pageY;
		        startTopScroll = elem.scrollTop;
		
		        if(startTopScroll <= 0)
		            elem.scrollTop = 1;
		
		        if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
		            elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		    }, false);
		};

		function dashedline(sx,sy,ex,ey,dashlen,linewidth,col)
		{
			
			var dx=ex-sx;
			var dy=ey-sy;
							
			len=Math.sqrt((dx*dx)+(dy*dy));
			notimes=Math.round(len/dashlen);
			
			dx=dx/notimes;
			dy=dy/notimes;
			
			context.lineWidth = linewidth;
			context.strokeStyle=col;

			context.beginPath();

			var xk,yk;
			xk=sx;
			yk=sy;
			xh=dx/2.0;
			yh=dy/2.0;
			for(var i=0;i<notimes;i++){

					context.moveTo(xk,yk);				
					context.lineTo(xk+xh,yk+yh);
				
					xk+=dx;
					yk+=dy;
			}
							
			context.stroke();
				
		}
								
		function point(col,x,y)
		{
				context.strokeStyle="#000";
				context.lineWidth = 1;
			
				context.fillStyle=col;
				context.fillRect(x-4,y-4,8,8);		
				context.strokeRect(x-4,y-4,8,8);						
		}
		
		function highlight(px,py)
		{
				context.strokeStyle="#aaa";
				context.lineWidth = 1;
			
				context.strokeRect(px-8,py-8,16,16);						
				
		}
		
		// Arcto only works if both x1 and y2 are on circle border
		function arcto(x0,y0,x1,y1,x2,y2)
		{

				var r = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
				var x = x0-r;
				var y = y0-r;
				var startAngle = (180/Math.PI*Math.atan2(y1-y0, x1-x0));
				var endAngle = (180/Math.PI*Math.atan2(y2-y0, x2-x0));
				
				context.arc(x0, y0, r, 0, Math.PI*2.0, 1.0);

		}

		// Draws 90 degree arc
		function arcdeg(x1,y1,x2,y2,x3,y3,isG)
		{
					

					// First quadrant positive positive			
					if(!isG){
					dashedline(x1,y1,x2,y2,8,1.0,"#999");
					dashedline(x3,y3,x2,y2,8,1.0,"#999");					

					point(pointColor,x1,y1);
					point(pointColor,x2,y2);
					point(pointColor,x3,y3);
					}					
					k=(y3-y1)/(x3-x1);					
										
					yk=y1+((x2-x1)*k);
					
					rx=x3-x1;
					ry=y3-y1;
					if(!isG)
						point(pointColor,x2,yk);

					context.strokeStyle = lineColor;
					context.lineWidth   = 1.0;					
					context.beginPath();					
					context.moveTo(x1,y1);
					for(i=0;i<48;i++){
							if(y3>=y1){
									if(yk>=y2){
											context.lineTo(x1+(Math.sin(((Math.PI/96.0)*-i)+(Math.PI*1.0))*rx),y3+(Math.cos(((Math.PI/96.0)*-i)+(Math.PI*1.0))*ry));
									}else{
											context.lineTo(x3+(Math.sin(((Math.PI/96.0)*i)+(Math.PI*1.5))*rx),y1+(Math.cos(((Math.PI/96.0)*i)+(Math.PI*1.5))*ry));
									}
							}else{
									if(yk<=y2){
											context.lineTo(x1+(Math.sin(((Math.PI/96.0)*-i)+(Math.PI*1.0))*rx),y3+(Math.cos(((Math.PI/96.0)*-i)+(Math.PI*1.0))*ry));
									}else{
											context.lineTo(x3+(Math.sin(((Math.PI/96.0)*i)+(Math.PI*1.5))*rx),y1+(Math.cos(((Math.PI/96.0)*i)+(Math.PI*1.5))*ry));
									}							
							}
					}
					context.stroke();

		}
		
		// Get point of operation
		function getpoint(opno,cpno)
		{
				var xc=-1;
				var yc=-1;

				// Get operations
				var elSel = document.getElementById('operations');
 
				// Bounds checking of operation, if outside bounds do nothing. 
				if(opno>=0&&opno<elSel.length){
						currop=elSel.options[opno].value;
						var operation=currop.split(" ");
			  		
			  		if(cpno==-1){
								xc=parseInt(operation[operation.length-2]);
								yc=parseInt(operation[operation.length-1]);			  		
			  		}else if(cpno>=1&&((cpno*2)+2)<operation.length){
								xc=parseInt(operation[(cpno*2)+1]);
								yc=parseInt(operation[(cpno*2)+2]);					
			  		}
				}

		  	// Return both coordinates as an object!
		  	return {
		        x : xc,
		        y : yc
		    };					

		}
		
		// Set point of operation 
		function setpoint(opno,cpno,xval,yval)
		{
				// Get operations
				var elSel = document.getElementById('operations');
 
				// Bounds checking of operation, if outside bounds do nothing. 
				if(opno>=0&&opno<elSel.length){
						
						currop=elSel.options[opno].value;
						var operation=currop.split(" ");
												
						// We want to update last control point
						if(cpno==-1){
								operation[operation.length-2]=xval;
								operation[operation.length-1]=yval;
						}												
						// Any later control point
						if(cpno>0){
								operation[((cpno-1)*2)+1]=xval;
								operation[((cpno-1)*2)+2]=yval;					
						}

						currop=operation.join(" ");	
						elSel.options[opno].value=currop;
						
						context.strokeStyle = '#ddd';
						context.fillStyle='#000';
						context.font = "bold 16px Arial";
						
				}
		}
		
		function makepoint(x,y)
		{
				var xc=x+(Math.floor((Math.random()*6)-3.0)*gridsize);
				var yc=y+(Math.floor((Math.random()*6)-3.0)*gridsize);
				
				if(xc<gridsize) xc=gridsize;
				if(yc<gridsize) yc=gridsize;
	
				if(xc>acanvas.width-gridsize) xc=acanvas.width-gridsize;
				if(yc>acanvas.height-gridsize) yc=acanvas.height-gridsize;
				
				if(xc==x&&yc==y){
						xc+=gridsize;
						yc+=gridsize;
				
				}
	
		  	// Return both coordinates as an object!
		  	return {
		        x : xc,
		        y : yc
		    };
		}		
		
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
		
		function drawOperations(oplist, isG){
			
				
				if(isG){
					pointColor="#bfbfbf";
					dashedLineColor="#ccc";
					lineColor="#aaa";
				} else {
					pointColor="#f52";
					dashedLineColor="#aaa";
					lineColor="#49f";
				}
			
				// This is our operations loop

				//var originalop;
				var elSel = document.getElementById('operations');
				var i=oplist.length-1;
  			
  			while(i>=0){

						currop=oplist[i];

						// Start of operation loop
						var operation=currop.split(" ");
						opcode=operation[0];

						context.strokeStyle = lineColor;

						
						// Get coordinates depending on opcode
						if(opcode=="L"||opcode=="Q"||opcode=="C"||opcode=="S"){
								p1x=parseInt(operation[1]);
								p1y=parseInt(operation[2]);
						}
						if(opcode=="L"||opcode=="Q"||opcode=="C"||opcode=="S"){
								p2x=parseInt(operation[3]);
								p2y=parseInt(operation[4]);
						}
						if(opcode=="Q"||opcode=="C"||opcode=="S"){
								p3x=parseInt(operation[5]);
								p3y=parseInt(operation[6]);
						}
						if(opcode=="C"){
								p4x=parseInt(operation[7]);
								p4y=parseInt(operation[8]);
						}
						
						// Draw operation
						
						if(opcode=="L"){
								context.beginPath();
								context.moveTo(p1x,p1y);
								context.lineTo(p2x,p2y);
								context.stroke();			
								if(!isG){
									point(pointColor,p1x,p1y);
									point(pointColor,p2x,p2y);
								}
		
						}else if(opcode=="Q"){
								context.beginPath();
								context.moveTo(p1x,p1y);
								context.quadraticCurveTo(p2x,p2y,p3x,p3y);
								context.stroke();			
								if(!isG){
									dashedline(p1x,p1y,p2x,p2y,8,1.0,"#aaa");
									dashedline(p2x,p2y,p3x,p3y,8,1.0,"#aaa");												
							
									point(pointColor,p1x,p1y);
									point(pointColor,p2x,p2y);
									point(pointColor,p3x,p3y);
								}
						}else if(opcode=="C"){
								context.beginPath();
								context.moveTo(p1x,p1y);
								context.bezierCurveTo(p2x,p2y,p3x,p3y,p4x,p4y);
								context.stroke();			
								if(!isG){
								dashedline(p1x,p1y,p2x,p2y,8,1.0,"#aaa");
								dashedline(p2x,p2y,p3x,p3y,8,1.0,"#aaa");						
								dashedline(p3x,p3y,p4x,p4y,8,1.0,"#aaa");												
								point(pointColor,p1x,p1y);
								point(pointColor,p2x,p2y);
								point(pointColor,p3x,p3y);
								point(pointColor,p4x,p4y);
								}
						}else if(opcode=="S"){
								arcdeg(p1x,p1y,p2x,p2y,p3x,p3y,isG);
						}
		
						if(!isG){
						// Highlight and detect click store selected operation and control point
						if(cpsel==-1){
								
								if(gridx==p1x&&gridy==p1y&&!(p1x==startx&&p1y==starty)){
										// First point either is first point which is unmovable or also moves the last point of previous operation
										point("#ff8",p1x,p1y);
										highlight(p1x,p1y);
										cpno=1;
										if(clickstate==1) cpsel=i;
								}
								if(gridx==p2x&&gridy==p2y){
										// Second point is control point in all but line
										point("#ff8",p2x,p2y);										
										highlight(p2x,p2y);
										cpno=2;
										if(clickstate==1) cpsel=i;
								}
								if(opcode=="Q"||opcode=="C"||opcode=="S"){
										if(gridx==p3x&&gridy==p3y){
												// Second point is control point in all but line
												point("#ff8",p3x,p3y);										
												highlight(p3x,p3y);
												cpno=3;
												if(clickstate==1) cpsel=i;
										}
								}
								if(opcode=="C"){
										if(gridx==p4x&&gridy==p4y){
												// Second point is control point in all but line
												point("#ff8",p4x,p4y);										
												highlight(p4x,p4y);
												cpno=4;
												if(clickstate==1) cpsel=i;
										}
								}
						}
								
						// We have selected a control point and we want to move it
						if(cpsel>=0&&i==cpsel&&cpno>0&&clickstate==1){

								var operation=currop.split(" ");
								if(cpno==1){															
										operation[1]=gridx;
										operation[2]=gridy;
								}else if(cpno==2){
										operation[3]=gridx;
										operation[4]=gridy;						
								}else if(cpno==3){
										operation[5]=gridx;
										operation[6]=gridy;						
								}else if(cpno==4){
										operation[7]=gridx;
										operation[8]=gridy;						
								}
								currop=operation.join(" ");	

								elSel.options[i].value=currop;
								
								// First point move last point of previous
								if(cpno==1) setpoint(i-1,-1,gridx,gridy);
								// If Last point move first point of next
								if((opcode=="L"&&cpno==2)||(opcode=="Q"&&cpno==3)||(opcode=="S"&&cpno==3)||(opcode=="C"&&cpno==4)) setpoint(i+1,1,gridx,gridy);


						}
						}


						i--;
						
  			}
		}
		
		function makeString(){
			var s="";
			var elSel = document.getElementById('operations');
				oplist=new Array();
				for(var i=0;i<elSel.length;i++){
					s+=elSel.options[i].value;
					if(i!=elSel.length-1) s+=",";
				}
			return s;
		}
		
		var mx=100,my=100,clickstate=0;
		
		var quizGoalOps;
		var	acanvas;
		var	context;
		var	gridsize=30;
		var	gridx,gridy=0;
		
		var startx,starty,endx,endy=0;
		var cpno=0;					// cpno is the number of the selected control point
		var cpsel=-1;
		
		var quizGoalOps=new Array();
		
		//Define colors
		var pointColor="#f52";
			dashedLineColor="#aaa";
			lineColor="#49f";
				
		function init(){
			//var quizGoal="L 40 60 200 120,Q 200 120 100 260 340 100,L 340 100 340 240,C 340 240 240 240 300 420 160 360,S 160 360 160 440 260 460,L 260 460 400 560";     
			quizGoalOps=quizGoal.split(",");
			
			var mx=100,my=100,clickstate=0;
			startx=quizGoalOps[0].split(" ")[1];
			starty=quizGoalOps[0].split(" ")[2];
			endx=quizGoalOps[quizGoalOps.length-1].split(" ")[quizGoalOps[quizGoalOps.length-1].split(" ").length-2];
			endy=quizGoalOps[quizGoalOps.length-1].split(" ")[quizGoalOps[quizGoalOps.length-1].split(" ").length-1];
			setupcanvas();

		}
		
	
		function foo()
		{
				context.clearRect(0,0,600,600);
				
				// Draw grid lines				
				context.strokeStyle = '#ddd';
				context.lineWidth   = 0.5;
				context.beginPath();
				for(i=0;i<600;i+=gridsize){
						context.moveTo(i,0);
						context.lineTo(i,600);
						context.moveTo(0,i);
						context.lineTo(600,i);
				}
				context.stroke();			
				
				// Draw Crosshair
				context.beginPath();
				context.strokeStyle = '#444';
				context.lineWidth   = 1.0;
				context.moveTo(gridx-gridsize,gridy);
				context.lineTo(gridx+gridsize,gridy);
				context.moveTo(gridx,gridy-gridsize);
				context.lineTo(gridx,gridy+gridsize);
				context.stroke();											

				// Mark start and end points
				point("#ff5",startx,starty);
				point("#5f2",endx,endy);
				
				// This is our operations loop
				drawOperations(quizGoalOps, true);

				var elSel = document.getElementById('operations');

				oplist=new Array();
				for(var i=0;i<elSel.length;i++){
					oplist.push(elSel.options[i].value);
				}
				
				
				drawOperations(oplist, false);
						

				setTimeout("foo();",100);
				
	  }
	  
		function submbutton()
		{
			checkAnswer(makeString());
		}
		
		function checkAnswerCallBack(data){
			if (typeof data.Error != 'undefined') {
				$("#result").css("background-color","#ffcccc");
				$("#result").html("<p>"+data.Error+"</p>");
				if(typeof data.answerHash != 'undefined'){
					$("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
				}
			} else {
				if(data.isCorrect=="false"){
					$("#result").css("background-color","#ffcccc");
					$("#result").html("Du har tyvärr svarat fel");
				} else {
					$("#result").css("background-color","#ccffcc");
					$("#result").html("Du har svarat rätt");
					$("#result").append("<br />Din svarskod:"+data.hashedAnswer);
					$("#result").append("<br />Spara alltid din svarskod!");
					
					if(data.Success=="false"){
						$("#result").append("<br />Ett problem har uppstått, ditt svar har inte sparats. Det är mycket viktigt att du sparar din svarskod och kontaktar kursansvarige omgående.");
					} 
				}
				
			}
		}			
	
	</script>
	
	</body>
</html>

<?php 

else:
    include "../dugga_loginwindow.php";
endif;

?>

