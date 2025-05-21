/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 Example seed - simple
	 Param: {*variant*:*40 13 7 20 0*}
	 Answer: Variant
	 Example seed - complex
	 Param: {*variant*:*26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0*}
	 Answer: Variant 
-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------
var score = -1;
var running;
var retdata = null;
var canvas = null;

var sf = 2.0;
var speed = 0.025;
var v = 0;
var pushcount = 0;
var elapsedTime = 0;

var dataV;
var operationList = [];
var operationsMap = {"D1":"Draw R","D2":"Draw G","D3":"Draw B","T1":"Translate 1","T2":"Translate 2","T3":"Translate 3","T4":"Translate 4","T5":"Translate 5","T6":"Translate 6","T7":"Translate 7","T8":"Translate 8","R0":"Rotate +3","R1":"Rotate +2","R2":"Rotate +1","R3":"Rotate +0.3","R4":"Rotate +0.2","R5":"Rotate -0.2","R6":"Rotate -0.3","R7":"Rotate -1","R8":"Rotate -2","R9":"Rotate -3","S0":"Scale 0.2","S1":"Scale 0.3","S2":"Scale 0.5","S3":"Scale 1.0","S4":"Scale 1.25","PUSH":"Push (remember state)","POP":"Pop (jump back)", "1":"Draw R","2":"Draw G","3":"Draw B","4":"Translate 1","5":"Translate 2","6":"Translate 3","7":"Translate 4","8":"Translate 5","9":"Translate 6","10":"Translate 7","11":"Translate 8","12":"Rotate +3","13":"Rotate +2","14":"Rotate +1","15":"Rotate +0.3","16":"Rotate +0.2","17":"Rotate -0.2","18":"Rotate -0.3","19":"Rotate -1","20":"Rotate -2","21":"Rotate -3","22":"Scale 0.2","23":"Scale 0.3","24":"Scale 0.5","25":"Scale 1.0","26":"Scale 1.25","27":"Push (remember state)","28":"Pop (jump back)"};

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	running = true;
	canvas = document.getElementById('a');
	if (canvas) {
		context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);

		AJAXService("GETPARAM", { }, "PDUGGA");
	}
	// canvas.addEventListener('click', function() { 
	// 		if (running) {
	// 				running = false;
	// 		} else {
	// 				running = true;
	// 				foo();
	// 		}
	
	// }, false);
}
function toggleAnimation()
{
	if (running) {
		renderId = requestAnimationFrame(foo);
	} else {
		cancelAnimationFrame(renderId);
	}
}

function returnedDugga(data) 
{	
	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if(data['opt']=="SAVDU"){
		showReceiptPopup();
	}

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		var removeBtnDisable = document.getElementsByClassName("submit-button");;
		for (i = 0; i > removeBtnDisable.length; i++){
			removeBtnDisable[i].classList.remove("btn-disable")
		}
		
		if (canvas) {
			//showDuggaInfoPopup();
			var studentPreviousAnswer = "";

			retdata = jQuery.parseJSON(data['param']);
			variant = retdata["variant"];

			if (data["answer"] !== null && data["answer"] !== "UNK") {
					var previous = data['answer'].split(',');
					previous.shift();
					previous.pop();

					// Clear Op list
					document.getElementById("operationList").innerHTML="";
					// Add previous handed in dugga
					for (var i = 0; i < previous.length; i++) {
							if (previous[i] !== ""){

								var newTableBody = document.createElement("tr");
								newTableBody.id = ("v" + i);
								newTableBody.innerHTML = '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
								newTableBody.innerHTML += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+operationsMap[previous[i]]+'</span><span id="opCode_'+i+'" style="display:none">'+previous[i]+'</span></td>';
								newTableBody.innerHTML += '<td><button onclick="moveOperationUp(this);refreshOpNum();">&uarr;</button></td>';
								newTableBody.innerHTML += '<td><button onclick="moveOperationDown(this);refreshOpNum();">&darr;</button></td>';
								newTableBody.innerHTML += '<td><button onclick="removeOperations(this);refreshOpNum();">X</button></td>';
									
								document.getElementById("operationList").append(newTableBody);			
							}
					}
			}

			if (running) {
				renderId = requestAnimationFrame(foo);
			} else {
				cancelAnimationFrame(renderId);
			}
		}
	}
	// Teacher feedback
	if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
			// No feedback
	} else {
			var fb = "<table class='list' style=''><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
			var feedbackArr = data["feedback"].split("||");
			for (var k=feedbackArr.length-1;k>=0;k--){
        var fb_tmp = feedbackArr[k].split("%%");
				fb+="<tr><td style='vertical-align:top;width:40px;'>"+fb_tmp[0].slice(0,10)+"</td><td>"+fb_tmp[1]+"</td></tr>";
			} 		
			fb += "</tbody></table>";
			document.getElementById('feedbackTable').innerHTML = fb;		
			document.getElementById('feedback').style.display = "block";
			document.getElementById("showFeedbackButton").style.display = "block";
	}
	
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);

	var removeBtnDisable = document.getElementsByClassName("submit-button");;
	for (i = 0; i > removeBtnDisable.length; i++){
		removeBtnDisable[i].classList.remove("btn-disable")
	}
}

function reset()
{
	if(confirm("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.")){
		Timer.stopTimer();
		Timer.score=0;
		Timer.startTimer();
		ClickCounter.initialize();
    } else {
        
    } 

}

function saveClick() 
{
	Timer.stopTimer();

	timeUsed = Timer.score;
	stepsUsed = ClickCounter.score;

	if (querystring['highscoremode'] == 1) {	
		score = Timer.score;
	} else if (querystring['highscoremode'] == 2) {
		score = ClickCounter.score;
	}

	// Loop through all operations
	bitstr = ",";
	
	document.querySelectorAll("[id*=opCode_]").forEach(function (e){
		bitstr+=e.innerHTML + ",";
	});
	bitstr += "T " + elapsedTime;

	bitstr += " " + window.screen.width;
	bitstr += " " + window.screen.height;

	bitstr += " " + window.innerWidth;
	bitstr += " " + window.innerHeight;

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
		document.getElementById("duggaStats").style.display = "block";
	}
	
	if (renderId != undefined){
			cancelAnimationFrame(renderId);
			renderId=undefined;
	}

	running = true;
	canvas = document.getElementById('a');
	context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.addEventListener('click', function() { 
      if (running) {
          running = false;
      } else {
          running = true;
          foo();
      }
  
  }, false);

  var studentPreviousAnswer = "";

	retdata = jQuery.parseJSON(param);
	variant = retdata["variant"];

	if (uanswer !== null || uanswer !== "UNK") {
		var previous = uanswer.split(',');
		previous.shift();
		previous.pop();

		// Add previous handed in dugga
		// Clear Op list
		document.getElementById("operationList").innerHTML="";
		// Add previous handed in dugga
		for (var i = 0; i < previous.length; i++) {
				if (previous[i] !== ""){

					var newTableBody = document.createElement("tr");
					newTableBody.id = ("v" + i);
					newTableBody.innerHTML = '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
					newTableBody.innerHTML += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+operationsMap[previous[i]]+'</span><span id="opCode_'+i+'" style="display:none">'+previous[i]+'</span></td>';
					newTableBody.innerHTML += '<td><button onclick="moveOperationUp(this);refreshOpNum();">&uarr;</button></td>';
					newTableBody.innerHTML += '<td><button onclick="moveOperationDown(this);refreshOpNum();">&darr;</button></td>';
					newTableBody.innerHTML += '<td><button onclick="removeOperations(this);refreshOpNum();">X</button></td>';
						
					document.getElementById("operationList").append(newTableBody);						
			}
		}
	}

  foo();
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
	running = false;
  cancelAnimationFrame(renderId);
}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------
//------------==========########### CONTROLLER FUNCTIONS ###########==========------------

function fitToContainer() 
{
	// Make it visually fill the positioned parent
	var divw = document.getElementById("content").width;
	if (divw > 500){ divw -= 248; }
	if (divw < window.innerHeight) {
		canvas.width = divw;
		canvas.height = divw;
	} else {
		canvas.width = window.innerHeight - 100;
		canvas.height = canvas.width;
	}
	
	sf = canvas.width / 200;
}

function sundial(radius, angle, scale) 
{

	cosv = Math.cos(angle);
	sinv = Math.sin(angle);

	yaddx = scale * cosv;
	yaddy = scale * sinv;

	xaddx = -scale * sinv;
	xaddy = scale * cosv;

	xk = cosv * radius;
	yk = sinv * radius;

	context.bezierCurveTo((-1.5 * xaddx) + (yaddx * 1.5) + xk, (-1.5 * xaddy) + (yaddy * 1.5) + yk, xaddx + (yaddx * 2.0) + xk, xaddy + (yaddy * 2.0) + yk, xaddx + (yaddx * 3.0) + xk, xaddy + (yaddy * 3.0) + yk);
	context.bezierCurveTo(xaddx + yaddx + xk, xaddy + yaddy + yk, (1.5 * xaddx) + yaddx + xk, (1.5 * xaddy) + yaddy + yk, (3.0 * xaddx) + xk, (3.0 * xaddy) + yk);
}

function drawsun(size) 
{
	context.fillStyle = "#fe9";
	context.strokeStyle = "#d82";
	context.lineWidth = 1.5;

	context.beginPath();
	context.moveTo(size, 0);
	for ( i = 0.0; i < 360.0; i += 22.5) {
		angle = (i / 360.0) * 2 * Math.PI;
		sundial(size, angle, 1.5 * sf);
	}
	context.stroke();
	context.fill();
}

function drawBall(cx, cy, radie, innerradie, ballradie, col1, inangle, inangleadd) 
{

	angleadd = (inangleadd / 360.0) * 2 * Math.PI;

	context.fillStyle = col1;

	for ( i = 0; i < 360; i += inangle) {

		angle = (i / 360.0) * 2 * Math.PI;
		angle2 = angle + angleadd;
		angle3 = angle + (angleadd * 2.0);
		angle4 = angle - angleadd;

		cosv = Math.cos(angle);
		sinv = Math.sin(angle);

		cosv2 = Math.cos(angle2);
		sinv2 = Math.sin(angle2);

		cosv4 = Math.cos(angle4);
		sinv4 = Math.sin(angle4);

		context.beginPath();

		context.moveTo(cx, cy);
		context.quadraticCurveTo(cx + (cosv * innerradie), cy + (sinv * innerradie), cx + (cosv2 * radie), cy + (sinv2 * radie));
		context.arc(cx, cy, radie, angle2, angle, 1.0);
		context.quadraticCurveTo(cx + (cosv4 * innerradie), cy + (sinv4 * innerradie), cx, cy);

		context.fill();

	}

	context.beginPath();
	context.arc(cx, cy, radie, 0, Math.PI * 2.0, 1.0);
	context.stroke();

}

function drawDashcirc(cx, cy, radie, col, inangle, inangle2) 
{
	context.lineWidth = 2.5;
	context.strokeStyle = col;
	context.beginPath();
	for ( i = 0; i < 360; i += inangle) {
		angle = (i / 360.0) * 2 * Math.PI;
		angle2 = ((inangle2 / 360.0) * 2 * Math.PI) + angle;

		context.moveTo(cx + (Math.cos(angle) * radie), cy + (Math.sin(angle) * radie));
		context.lineTo(cx + (Math.cos(angle2) * radie), cy + (Math.sin(angle2) * radie));
	}
	context.stroke();
}

function drawArrowcirc(cx, cy, radie, col, inangle, inangle2, inangle3, direction) 
{
	context.fillStyle = col;

	context.beginPath();

	angle = ((inangle3 / 360.0) * 2 * Math.PI);
	if (direction == "R") {
		angle2 = ((inangle2 / 360.0) * 2 * Math.PI) + angle;
	} else {
		angle2 = angle - ((inangle2 / 360.0) * 2 * Math.PI);
	}

	ca = Math.cos(angle);
	sa = Math.sin(angle);

	ca2 = Math.cos(angle2);
	sa2 = Math.sin(angle2);

	context.moveTo(cx + (ca * (radie + (radie * 0.1))), cy + (sa * (radie + (radie * 0.1))));
	context.lineTo(cx + (ca * (radie - (radie * 0.1))), cy + (sa * (radie - (radie * 0.1))));
	context.lineTo(cx + (ca2 * radie), cy + (sa2 * radie));

	context.lineTo(cx + (ca * (radie + (radie * 0.1))), cy + (sa * (radie + (radie * 0.1))));

	context.fill();
}

function drawArrowDashcirc(cx, cy, radie, col, inangle, inangle2, inangle3, arrowsize, direction) 
{
	drawArrowcirc(cx, cy, radie, col, inangle, inangle2, inangle3, arrowsize, direction);
	drawDashcirc(cx, cy, radie, col, inangle, inangle2);
}

function drawCross(cx, cy, col, size) 
{
	context.strikestyle = col;
	context.lineWidth = 2;
	context.strokeStyle = col;
	context.beginPath();
	context.moveTo(cx - size, cy - size);
	context.lineTo(cx + size, cy + size);
	context.moveTo(cx + size, cy - size);
	context.lineTo(cx - size, cy + size);
	context.stroke();
}

function toggleSelectOperation(e){
	var allOperations = document.getElementById("operationList").querySelectorAll("tr");
	if (e.closest("tr").classList.contains("selectedOp")){
		// Unselect the selected row
		e.closest("tr").classList.remove("selectedOp");
		document.getElementById("addOpButton").value = "Add Op.";
	} else {
		// Unselect any previous selected row
		for (i = 0; i < allOperations.length; i++){
			if (allOperations[i].className == "OperationListTableOdd selectedOp" || allOperations[i].className == "OperationListTableEven selectedOp" || allOperations[i].className == "selectedOp OperationListTableOdd" || allOperations[i].className == "selectedOp OperationListTableEven"){
				allOperations[i].classList.remove("selectedOp");
			}
		}
		// select the selected row
		e.closest("tr").classList.add("selectedOp");
		document.getElementById("addOpButton").value = "Change Op.";		
	}		
}

function newbutton() 
{
	ClickCounter.onClick();
	var newOp = document.querySelector("#function > optgroup > option:checked").textContent;
	var newOpCode = document.getElementById("function").value;

	var update = 0;
	var allOperations = document.getElementById("operationList").querySelectorAll("tr");

	for (i = 0; i < allOperations.length; i++){
		
		if (allOperations[i].className == "OperationListTableOdd selectedOp" || allOperations[i].className == "OperationListTableEven selectedOp" || allOperations[i].className == "selectedOp OperationListTableOdd" || allOperations[i].className == "selectedOp OperationListTableEven"){
			update = 1;
		}
	}

	if(update == 1){	//switches a element
		var selectOP = document.getElementsByClassName("selectedOp")
		for (i = 0; i < selectOP.length; i++){

			selectOP[i].querySelector("[id^=op_]").innerHTML = newOp;
			selectOP[i].querySelector("[id^=opCode_]").innerHTML = newOpCode;
			toggleSelectOperation(selectOP[i]);
		}
	} else {	//creates new element
		var x = 0;
		for (i = 0; i < allOperations.length; i++){
			var tmp = allOperations[i].id.replace("v","");
			if (tmp > x) x=tmp;
			x++;
		}
				
		var newTableBody = document.createElement("tr");
		newTableBody.id = ("v" + x);
		newTableBody.innerHTML = '<td style="font-size:11px; text-align: center;" id="opNum'+x+'">'+(x+1)+'</td>';
		newTableBody.innerHTML += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+x+'" onclick="toggleSelectOperation(this);">'+newOp+'</span><span id="opCode_'+x+'" style="display:none">'+newOpCode+'</span></td>';
		newTableBody.innerHTML += '<td><button onclick="moveOperationUp(this);refreshOpNum();">&uarr;</button></td>';
		newTableBody.innerHTML += '<td><button onclick="moveOperationDown(this);refreshOpNum();">&darr;</button></td>';
		newTableBody.innerHTML += '<td><button onclick="removeOperations(this);refreshOpNum();">X</button></td>';
			
		document.getElementById("operationList").append(newTableBody);
		refreshOpNum();
	}

}
// removes a operations
function removeOperations(e){
	e.closest("tr").remove();
}

// gets rid of the old position classes before moving
function removeOperationsPosition(e){
	if (e.closest("tr").className == "OperationListTableOdd" || e.className == "OperationListTableOdd selectedOp" || e.className == "selectedOp OperationListTableOdd"){
		e.classList.remove("OperationListTableOdd");
	}
	else if (e.closest("tr").className == "OperationListTableEven" || e.className == "OperationListTableEven selectedOp" || e.className == "selectedOp OperationListTableEven"){
		e.classList.remove("OperationListTableEven");
	}
}

// moves a operations down
function moveOperationDown(e){
	var nextOperation = e.closest("tr").nextSibling;
	if (nextOperation != null){
		nextOperation.after(e.closest("tr"));
	}
}

// moves a operations up
function moveOperationUp(e){
	var previousOperation = e.closest("tr").previousSibling;
	if (previousOperation != null){
		e.closest("tr").after(previousOperation);
	}
}

// refreses the operations positions
function refreshOpNum(){
	var idx = 1;
	document.querySelectorAll("[id^=opNum]").forEach(function (e){
		e.innerHTML = idx++;
	});
	var allOperations = document.getElementById("operationList").querySelectorAll("tr");
	for (i = 0; i < allOperations.length; i++){
		removeOperationsPosition(allOperations[i]);
		if (i+1 & 1 == 1){
			allOperations[i].classList.add("OperationListTableOdd");
		}
		else{
			allOperations[i].classList.add("OperationListTableEven");
		}	
	}
}

function drawCommand(cstr) 
{
	if (cstr == "D1" || cstr == "0") {
		drawBall(0, 0, 15 * sf, 10 * sf, 5 * sf, "#F84", 45.0, 22.5);
	} else if (cstr == "D2" || cstr == "1") {
		drawBall(0, 0, 15 * sf, 10 * sf, 5 * sf, "#8F4", 45.0, 22.5);
	} else if (cstr == "D3" || cstr == "2") {
		drawBall(0, 0, 15 * sf, 10 * sf, 5 * sf, "#48F", 45.0, 22.5);
	} else if (cstr == "T1" || cstr == "3") {
		context.translate(10 * sf, 0);
	} else if (cstr == "T2" || cstr == "4") {
		context.translate(20 * sf, 0);
	} else if (cstr == "T3" || cstr == "5") {
		context.translate(30 * sf, 0);
	} else if (cstr == "T4" || cstr == "6") {
		context.translate(40 * sf, 0);
	} else if (cstr == "T5" || cstr == "7") {
		context.translate(50 * sf, 0);
	} else if (cstr == "T6" || cstr == "8") {
		context.translate(60 * sf, 0);
	} else if (cstr == "T7" || cstr == "9") {
		context.translate(70 * sf, 0);
	} else if (cstr == "T8" || cstr == "10") {
		context.translate(80 * sf, 0);
	} else if (cstr == "R0" || cstr == "11") {
		context.rotate(v * 3);
	} else if (cstr == "R1" || cstr == "12") {
		context.rotate(v * 2);
	} else if (cstr == "R2" || cstr == "13") {
		context.rotate(v * 1);
	} else if (cstr == "R3" || cstr == "14") {
		context.rotate(v * 0.3);
	} else if (cstr == "R4" || cstr == "15") {
		context.rotate(v * 0.2);
	} else if (cstr == "R5" || cstr == "16") {
		context.rotate(v * -0.2);
	} else if (cstr == "R6" || cstr == "17") {
		context.rotate(v * -0.3);
	} else if (cstr == "R7" || cstr == "18") {
		context.rotate(v * -1);
	} else if (cstr == "R8" || cstr == "19") {
		context.rotate(v * -2);
	} else if (cstr == "R9" || cstr == "20") {
		context.rotate(v * -3);
	} else if (cstr == "S0" || cstr == "21") {
		context.scale(0.2, 0.2);
	} else if (cstr == "S1" || cstr == "22") {
		context.scale(0.3, 0.3);
	} else if (cstr == "S2" || cstr == "23") {
		context.scale(0.5, 0.5);
	} else if (cstr == "S3" || cstr == "24") {
		context.scale(1.0, 1.0);
	} else if (cstr == "S4" || cstr == "25") {
		context.scale(1.25, 1.25);
	} else if (cstr == "PUSH" || cstr == "26") {
		context.save();
		pushcount++;
	} else if (cstr == "POP" || cstr == "27") {
		if (pushcount > 0) {
			context.restore();
		}
	} else if (cstr == "28") {
		drawArrowDashcirc(0, 0, 10 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "29") {
		drawArrowDashcirc(0, 0, 20 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "30") {
		drawArrowDashcirc(0, 0, 30 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "31") {
		drawArrowDashcirc(0, 0, 40 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "32") {
		drawArrowDashcirc(0, 0, 50 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "33") {
		drawArrowDashcirc(0, 0, 60 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "34") {
		drawArrowDashcirc(0, 0, 70 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "35") {
		drawArrowDashcirc(0, 0, 80 * sf, "#888", 11.25, 5.625, 45.0, "L");
	} else if (cstr == "36") {
		drawArrowDashcirc(0, 0, 10 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "37") {
		drawArrowDashcirc(0, 0, 20 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "38") {
		drawArrowDashcirc(0, 0, 30 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "39") {
		drawArrowDashcirc(0, 0, 40 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "40") {
		drawArrowDashcirc(0, 0, 50 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "41") {
		drawArrowDashcirc(0, 0, 60 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "42") {
		drawArrowDashcirc(0, 0, 70 * sf, "#888", 11.25, 5.625, 45.0, "R");
	} else if (cstr == "43") {
		drawArrowDashcirc(0, 0, 80 * sf, "#888", 11.25, 5.625, 45.0, "R");

	}
}

function foo() 
{
	fitToContainer();
	//acanvas.width = acanvas.width;

  if (running){
    v += speed;
    elapsedTime++;  
  }

	context.translate(100 * sf, 100 * sf);
	context.save();

	context.globalAlpha = 0.3;

	variantset = variant.split(" ");

	pushcount = 0;

	for (var i = 0; i < variantset.length; i++) {
		drawCommand(variantset[i]);
	}

	for ( i = 0; i < pushcount; i++) {
		context.restore();
	}

	context.restore();
	context.save();

	pushcount = 0;

	context.globalAlpha = 1.0;

	document.querySelectorAll("[id*=opCode_]").forEach(function (e){
		drawCommand(e.innerHTML);
	});

	drawCross(0, 0, "#f64", 8);

	for ( i = 0; i < pushcount; i++) {
		context.restore();
	}

	context.restore();
	context.globalAlpha = 0.5;
	context.rotate(-v * 0.6);
	drawsun(10 * sf);

	if (running) {
			renderId = requestAnimationFrame(foo);
	} else {
			cancelAnimationFrame(renderId);
	}

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
	}
}