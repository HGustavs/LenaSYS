/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 Example seed - simple
	 Param: {"variant":"40 13 7 20 0"}
	 Answer: Variant
	 Example seed - complex
	 Param: {"variant":"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0"}
	 Answer: Variant 
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

		tickInterval = setInterval("tick();", 50);

		AJAXService("GETPARAM", { }, "PDUGGA");
	}
	canvas.addEventListener('click', function() { 
			if (running) {
					running = false;
					cancelAnimationFrame(renderId);
			} else {
					running = true;
					renderId = requestAnimationFrame(foo);
			}
	
	}, false);
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
		if (canvas) {
			//showDuggaInfoPopup();
			var studentPreviousAnswer = "";

			retdata = JSON.parse(data['param']);
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
									var newTableBody = "<tr id='v" + i +"'>";
									newTableBody += '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
									newTableBody += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+operationsMap[previous[i]]+'</span><span id="opCode_'+i+'" style="display:none">'+previous[i]+'</span></td>';
									//Arrow up
									newTableBody += '<td><button onclick="if(this.closest(\'tr\').previousElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\'), this.closest(\'tr\').previousElementSibling);refreshOpNum();">&uarr;</button></td>';
									//Arrow down
									newTableBody += '<td><button onclick="if(this.closest(\'tr\').nextElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\').nextElementSibling, this.closest(\'tr\'));refreshOpNum();">&darr;</button></td>';
									//Remove
									newTableBody += '<td><button onclick="this.closest(\'tr\').remove();refreshOpNum();">X</button></td>';			
									newTableBody += "</tr>";
										
									document.getElementById("operationList").insertAdjacentHTML('beforeend', newTableBody);						
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
			var fb = "<table class='list feedback-list'><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
			var feedbackArr = data["feedback"].split("||");
			for (var k=feedbackArr.length-1;k>=0;k--){
				var fb_tmp = feedbackArr[k].split("%%");
				fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
			} 		
			fb += "</tbody></table>";
			document.getElementById('feedbackTable').innerHTML = fb;		
			document.getElementById('feedbackBox').style.display = "block";
			document.getElementById("showFeedbackButton").style.display="block";
	}
	document.getElementById("content").append(document.getElementById("submitButtonTable"));
	if(document.getElementById("lockedDuggaInfo"))
		document.getElementById("content").append(document.getElementById("lockedDuggaInfo"));
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);
}

function reset()
{
	if(confirm("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.")){
		Timer.stopTimer();
		Timer.score=0;
		Timer.startTimer();
		ClickCounter.initialize();
		document.getElementById("operationList").innerHTML="";	
    } else {
        
    } 

}

function saveClick() {
	$.ajax({									//Ajax call to see if the new hash have a match with any hash in the database.
		url: "showDuggaservice.php",
		type: "POST",
		data: "&hash=" + hash, 					//This ajax call is only to refresh the userAnswer database query.
		dataType: "json",
		success: function (data) {
			ishashindb = data['ishashindb'];	//Ajax call return - ishashindb == true: not unique hash, ishashindb == false: unique hash.
			if (ishashindb == true && blockhashgen == true || ishashindb == true && blockhashgen == false && ishashinurl == true || ishashindb == true && locallystoredhash != "null") {				//If the hash already exist in database.
				if (confirm("You already have a saved version!")) {
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

					document.querySelectorAll("*[id*=opCode_]").forEach(function (code) {
						bitstr += code.innerHTML + ",";
					});
					bitstr += "T " + elapsedTime;

					bitstr += " " + window.screen.width;
					bitstr += " " + window.screen.height;

					bitstr += " " + window.width;
					bitstr += " " + window.height;

					// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
					saveDuggaResult(bitstr);
				}
			} else {
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

				document.querySelectorAll("*[id*=opCode_]").forEach(function (code) {
					bitstr += code.innerHTML + ",";
				});
				bitstr += "T " + elapsedTime;

				bitstr += " " + window.screen.width;
				bitstr += " " + window.screen.height;

				bitstr += " " + window.width;
				bitstr += " " + window.height;

				// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
				saveDuggaResult(bitstr);
			}
		}
	});
}
function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		document.getElementById("duggaStats").style.display="block";
	}
	/* reset */
	sf = 2.0;
	speed = 0.1;
	v = 0;
	pushcount = 0;
	elapsedTime = 0;
	if (tickInterval != undefined){
			clearInterval(tickInterval);
	}
	
	if (renderId != undefined){
			cancelAnimationFrame(renderId);
			renderId=undefined;
	}

	running = true;
	canvas = document.getElementById('a');
	context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	tickInterval = setInterval("tick();", 50);
	var studentPreviousAnswer = "";

	retdata = JSON.parse(param);
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
				var newTableBody = "<tr id='v" + i +"'>";
				newTableBody += '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
				newTableBody += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+operationsMap[previous[i]]+'</span><span id="opCode_'+i+'" style="display:none">'+previous[i]+'</span></td>';
				//Arrow up
				newTableBody += '<td><button onclick="if(this.closest(\'tr\').previousElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\'), this.closest(\'tr\').previousElementSibling);refreshOpNum();">&uarr;</button></td>';
				//Arrow down
				newTableBody += '<td><button onclick="if(this.closest(\'tr\').nextElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\').nextElementSibling, this.closest(\'tr\'));refreshOpNum();">&darr;</button></td>';
				//Remove
				newTableBody += '<td><button onclick="this.closest(\'tr\').remove();refreshOpNum();">X</button></td>';
				newTableBody += "</tr>";
							
				document.getElementById("operationList").insertAdjacentHTML('beforeend', newTableBody);
			}
		}
	}

	if (running) {
			renderId = requestAnimationFrame(foo);
	} else {
			cancelAnimationFrame(renderId);
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

function fitToContainer() 
{
	// Make it visually fill the positioned parent
	divw = document.getElementById("content").offsetWidth;
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
	//Select & unselect operations
		if (e.closest("tr").classList.contains("selectedOp")){
				e.closest("tr").classList.remove("selectedOp");
				document.getElementById("addOpButton").value = "Add Op.";
				const list = document.getElementById("operationList").querySelectorAll("tr:nth-child(odd)");
				list.forEach(function(sel){
					sel.style.backgroundColor="#dad8db";
				})
		} else {
				e.closest("tr").classList.add("selectedOp");
				document.getElementById("addOpButton").value = "Change Op.";
				// Unselect any previous selected row
				document.getElementById("operationList").querySelectorAll("tr").forEach(function (sel){
						if (sel.id !== e.closest("tr").id && sel.classList.contains("selectedOp")){
							sel.classList.remove("selectedOp");
						}
				});
		}
}

function newbutton() 
{
	//Check if operation should be added or modified
	ClickCounter.onClick();
	var changed = false;
	var select = document.getElementById('function');
	var selectOp = select.options[select.options.selectedIndex];
	var newOp = selectOp.text;
	var newOpCode = document.getElementById("function").value;
	var rowOp = document.getElementById("operationList").querySelectorAll("tr");
	rowOp.forEach(function(sel){
		if(sel.classList.contains("selectedOp")){
			changed = true;
			document.querySelectorAll(".selectedOp").forEach(function(sel){
				sel.querySelector("*[id^=op_]").innerHTML=newOp;
				sel.querySelector("*[id^=opCode_]").innerHTML=newOpCode;
				toggleSelectOperation(sel);
			});
		}
	});

	if(!document.getElementById("operationList").classList.contains("selectedOp") && changed === false) {
		var i = 0;
		document.getElementById('operationList').querySelectorAll('tr').forEach(function (op){
			var tmp = op.id.replace("v","");
			if (tmp > i) i=tmp;
		});
		i++;
		var newTableBody = "<tr id='v" + i +"'>";
		newTableBody += '<td style="font-size:11px; text-align: center;" id="opNum'+i+'">'+(i+1)+'</td>';
		newTableBody += '<td><span style="width:100%; padding:0; margin:0; box-sizing: border-box;" id="op_'+i+'" onclick="toggleSelectOperation(this);">'+newOp+'</span><span id="opCode_'+i+'" style="display:none">'+newOpCode+'</span></td>';
		//Arrow up
		newTableBody += '<td><button onclick="if(this.closest(\'tr\').previousElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\'), this.closest(\'tr\').previousElementSibling);refreshOpNum();">&uarr;</button></td>';
		//Arrow down
		newTableBody += '<td><button onclick="if(this.closest(\'tr\').nextElementSibling) this.closest(\'tr\').parentNode.insertBefore(this.closest(\'tr\').nextElementSibling, this.closest(\'tr\'));refreshOpNum();">&darr;</button></td>';
		//Remove
		newTableBody += '<td><button onclick="this.closest(\'tr\').remove();refreshOpNum();">X</button></td>';			
		newTableBody += "</tr>";
			
		document.getElementById("operationList").insertAdjacentHTML('beforeend', newTableBody);
		refreshOpNum();
	}
	changed = false;
}

function refreshOpNum(){
	var idx = 1;
	document.querySelectorAll("*[id^=opNum]").forEach(function (op){
			op.innerHTML = idx++;
	});

	//Odd elements in list
	const odd = document.getElementById("operationList").querySelectorAll("tr:nth-child(odd)");
	odd.forEach(element => {
		element.classList.add("OperationListTableOdd");
		element.classList.remove("OperationListTableEven");
	});

	//Even elements in list
	const even = document.getElementById("operationList").querySelectorAll("tr:nth-child(even)");
	even.forEach(element => {
		element.classList.add("OperationListTableEven");
		element.classList.remove("OperationListTableOdd");
	});

	//Change text on button if selected element is removed
	const opList = document.getElementById("operationList");
	const config = {childList : true, subtree : false};
	const observer = new MutationObserver(function(nodes){
		nodes.forEach(function(removal){
			removal.removedNodes.forEach(element => {
				if(element.classList.contains("selectedOp") && element.nodeType === 1){
					if(opList.querySelectorAll(".selectedOp").length === 0){
						document.getElementById("addOpButton").value = "Add Op.";
					}
				}
			});
		});
	});
	observer.observe(opList, config);
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

function tick() 
{
	v += speed;
	elapsedTime++;

}

function foo() 
{
	fitToContainer();
	//acanvas.width = acanvas.width;

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

	document.querySelectorAll("*[id*=opCode_]").forEach(function (code){
			drawCommand(code.innerHTML);
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

function toggleFeedback()
{
	if(document.querySelector(".feedback-content").style.display==="block")
    	document.querySelector(".feedback-content").style.display="none";
	else{
		document.querySelector(".feedback-content").style.display="block";
	}
}