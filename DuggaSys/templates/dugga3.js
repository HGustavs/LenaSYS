/********************************************************************************

 Mouse coordinate and canvas globals

 Handles both Touch and Mouse/Keyboard input at the same time

 *********************************************************************************/

// Mouse coordinate globals
var gridx, gridy;
var clickstate = 0;
var movestate = 0;

var canvas;
var context;
var debug = 0;
var objectCounter = 0;
var selectedObjId = "";
var selectedPoint = 0;

var retdata = null;

function setup() {
	canvas = document.getElementById('a');
	if (canvas){
		context = canvas.getContext("2d");
		
		setupClickHandling();
	
		AJAXService("GETPARAM", { }, "PDUGGA");
	
		setTimeout("render();", 50);
	}
}

function returnedDugga(data) {
	if (data['debug'] != "NONE!")
		alert(data['debug']);

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		if (canvas){
			showDuggaInfoPopup();
			var studentPreviousAnswer = "";
			retdata = jQuery.parseJSON(data['param'].replace(/&quot;/g, '"'));
			if (data["answer"] != null) {
				var previous = data['answer'].split(',');
				previous.shift();
				previous.pop();
				studentPreviousAnswer = previous.join();
				// Clear operations
				while (document.getElementById('operations').options.length > 0) {
					document.getElementById('operations').remove(0);
				}
			}
	
			init(retdata["linje"], studentPreviousAnswer);
		}
	}
}
function showFacit(param, uanswer, danswer)
{
		canvas = document.getElementById('a');
				context = canvas.getContext("2d");
			var studentPreviousAnswer = "";
			var p = jQuery.parseJSON(param.replace(/&quot;/g, '"'));
			if (uanswer != null) {
				var previous = uanswer.split(',');
				previous.shift();
				previous.pop();
				studentPreviousAnswer = previous.join();
				// Clear operations
				while (document.getElementById('operations').options.length > 0) {
					document.getElementById('operations').remove(0);
				}
			}
	setTimeout("render();", 50);	
			init(p["linje"], studentPreviousAnswer);		

			
}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------
/********************************************************************************

 Canvas Setup and Click Handling Code

 Handles both Touch and Mouse/Keyboard input at the same time and executes
 handler callbacks.
 Also declares canvas globals

 *********************************************************************************/

function setupClickHandling() {
	// Mouse and Keyboard Events
	canvas.addEventListener('mousemove', ev_mousemove, false);
	canvas.addEventListener('mouseup', ev_mouseup, false);
	canvas.addEventListener('mousedown', ev_mousedown, false);

	// Touch Events
	canvas.addEventListener('touchstart', ev_touchstart, false);
	canvas.addEventListener('touchend', ev_touchend, false);
	canvas.addEventListener('touchmove', ev_touchmove, false);
}

// Keyboard/Mouse Mouse Up Handler
function ev_mouseup(ev) {
	handler_mouseup(ev);
}

// Keyboard/Mouse Mouse Down Handler
function ev_mousedown(ev) {
	handler_mousedown(ev);
}

// Keyboard/Mouse Mouse Move Handler
function ev_mousemove(ev) {
	var cx, cy = 0;
	//coord=findPos(canvas);
	coord = getMousePos(ev);

	// Get the mouse position relative to the canvas element.
	if (ev.layerX || ev.layerX == 0) {// Firefox
		cx = ev.layerX;
		cy = ev.layerY;

	} else if (ev.offsetX || ev.offsetX == 0) {// Opera
		cx = ev.offsetX;
		cy = ev.offsetY;
	}

	if (debug) {// Firefox
		document.getElementById('debug').innerHTML = "<p>cx: " + cx + "</p><p> cy: " + cy + "</p>";
	}

	handler_mousemove(cx, cy);
}

// Touch start event
function ev_touchstart(event) {
	event.preventDefault();
	var numtouch = event.touches.length;

	targetEvent = event.touches.item(0);

	var cx = targetEvent.pageX;
	var cy = targetEvent.pageY;

	gridx = cx;
	gridy = cy;

	handler_mousedown(event);

}

// Touch end event
function ev_touchend(event) {
	event.preventDefault();
	var numtouch = event.touches.length;

	handler_mouseup();
};

// Touch move event
function ev_touchmove(event) {
	event.preventDefault();
	var numtouch = event.touches.length;

	targetEvent = event.touches.item(0);

	var cx = targetEvent.pageX;
	var cy = targetEvent.pageY;

	handler_mousemove((cx / sf), (cy / sf));
};
// Recursive Pos of div in document - should work in most browsers

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : (evt.clientX - rect.left),
		y : (evt.clientY - rect.top)
	};
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
		console.log("OL " + obj.offsetLeft);
		while ( obj = obj.offsetParent) {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		}
	}
	return {
		x : curleft,
		y : curtop
	};
}

/*

 First point immovible
 -----
 Delete operation
 Move Up
 Move Down
 Move Control Points

 */
function populateOperationsList() {

	var startOperations = startString.split(',');

	var functionList = document.getElementById("function");

	var opList = document.getElementById("operations");
	console.log(startOperations);

	for (var i = 0; i < startOperations.length; i++) {
		var text = "";
		for (var j = 0; j < functionList.options.length; j++) {
			if (startOperations[i].substring(0, 1) == functionList.options[j].value.substring(0, 1))
				text = functionList.options[j].innerHTML;
		}

		opList.innerHTML += "<option value='" + startOperations[i] + "'>" + text + "</option>";
	}
}

function saveClick() {
	// Loop through all bits
	bitstr = ",";
	var opList = document.getElementById("operations");

	for (var i = 0; i < document.getElementById('operations').length; i++) {
		bitstr += opList[i].value;
		if (i < document.getElementById('operations').length - 1)
			bitstr += ",";
	}

	bitstr += ",T " + elapsedTime;

	bitstr += " " + window.screen.width;
	bitstr += " " + window.screen.height;

	bitstr += " " + $(window).width();
	bitstr += " " + $(window).height();

	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function newOp(operation, operationText) {
	var oplist;

	oplist = document.getElementById('operations');
	oplist.innerHTML += "<option id='op" + (objectCounter++) + "' value='" + operation + "'>" + operationText + "</option>";

}

function deletebutton() {
	var elSel = document.getElementById('operations');
	var i = 0;
	for ( i = elSel.length - 1; i >= 0; i--) {
		if (elSel.options[i].selected) {
			elSel.remove(i);
		}
	}
}

function moveupbutton() {
	var elSel = document.getElementById('operations');
	var ind = elSel.selectedIndex;
	var val;
	var tex;

	if (elSel.selectedIndex > 0) {

		val = elSel.options[ind].value;
		tex = elSel.options[ind].text;

		elSel.options[ind].value = elSel.options[ind - 1].value;
		elSel.options[ind].text = elSel.options[ind - 1].text;

		elSel.options[ind - 1].value = val;
		tex = elSel.options[ind - 1].text = tex;

		elSel.selectedIndex--;
	}
}

function movedownbutton() {
	var elSel = document.getElementById('operations');
	var ind = elSel.selectedIndex;
	var val;
	var tex;

	if (elSel.selectedIndex < elSel.length - 1) {

		val = elSel.options[ind].value;
		tex = elSel.options[ind].text;

		elSel.options[ind].value = elSel.options[ind + 1].value;
		elSel.options[ind].text = elSel.options[ind + 1].text;

		elSel.options[ind + 1].value = val;
		tex = elSel.options[ind + 1].text = tex;

		elSel.selectedIndex++;
	}

}

function handler_mouseup(ev) {
	var op = document.getElementById(selectedObjId).value.split(' ');
	op[selectedPoint * 2 - 1] = gridx;
	op[selectedPoint * 2] = gridy;

	document.getElementById(selectedObjId).value = op.join(' ');
	selectedPoint = 0;
	selectedObjId = "";
	clickstate = 0;
}

function handler_mousedown(ev) {
	clickstate = 1;
	// Figure out if we clicked in an object
	$("#operations > option").each(function() {
		var opArr = this.value.split(" ");
		for (var i = 1; i < opArr.length; i += 2) {
			if (opArr[i] == gridx && opArr[i + 1] == gridy) {
				selectedObjId = this.id;
				selectedPoint = Math.round(i / 2);
			}

		}
	});
}

function handler_mousemove(cx, cy) {

	gridx = Math.round(((cx / sf) - (gridsize / 2.0)) / gridsize) * gridsize;
	gridy = Math.round(((cy / sf) - (gridsize / 2.0)) / gridsize) * gridsize;

	if (clickstate == 1) {
		movestate = 1;
		mx = gridx;
		my = gridy;
	}

}

function dashedline(sx, sy, ex, ey, dashlen, linewidth, col) {

	var dx = ex - sx;
	var dy = ey - sy;

	len = Math.sqrt((dx * dx) + (dy * dy));
	notimes = Math.round(len / dashlen);

	dx = dx / notimes;
	dy = dy / notimes;

	context.lineWidth = linewidth;
	context.strokeStyle = col;

	context.beginPath();

	var xk, yk;
	xk = sx;
	yk = sy;
	xh = dx / 2.0;
	yh = dy / 2.0;
	for (var i = 0; i < notimes; i++) {

		context.moveTo(xk, yk);
		context.lineTo(xk + xh, yk + yh);

		xk += dx;
		yk += dy;
	}

	context.stroke();

}

function drawCross(gX, gY, lcolor) {
	context.strokeStyle = lcolor;
	context.lineWidth = 1.5;

	context.beginPath();
	context.moveTo((gX - (gridsize / 3)) * sf, (gY + (gridsize / 3)) * sf);
	context.lineTo((gX + (gridsize / 3)) * sf, (gY - (gridsize / 3)) * sf);
	context.moveTo((gX + (gridsize / 3)) * sf, (gY + (gridsize / 3)) * sf);
	context.lineTo((gX - (gridsize / 3)) * sf, (gY - (gridsize / 3)) * sf);
	context.stroke();
}

function makeString() {
	var s = "";
	var elSel = document.getElementById('operations');
	oplist = new Array();
	for (var i = 0; i < elSel.length; i++) {
		s += elSel.options[i].value;
		if (i != elSel.length - 1)
			s += ",";
	}
	return s;
}

var mx = 100, my = 100, clickstate = 0;
var gridsize = 5;
var goal;

//Define colors
var pointColor = "#f52";
dashedLineColor = "#F8F";
//			lineColor = "#49f";
var targetLineColor = "#aaa";
var studentLineColor = "#49f";

function drawSPoint(x, y, lcolor, fcolor) {
	context.strokeStyle = lcolor;
	context.lineWidth = 1.5;

	context.fillStyle = fcolor;
	context.fillRect((x - 1) * sf, (y - 1) * sf, 2 * sf, 2 * sf);
	context.strokeRect((x - 1) * sf, (y - 1) * sf, 2 * sf, 2 * sf);
}

function drawSLine(x1, y1, x2, y2, lcolor, guideLines) {
	context.strokeStyle = lcolor;
	context.lineWidth = 1.5;
	context.beginPath();
	context.moveTo(x1 * sf, y1 * sf);
	context.lineTo(x2 * sf, y2 * sf);
	context.stroke();
	if (guideLines) {
		drawSPoint(x2, y2, "#FF0", "#880");
	} else {
		drawCross(x2, y2, "#F40");
	}
}

function drawSQuadratic(x1, y1, x2, y2, x3, y3, lcolor, guideLines) {
	context.strokeStyle = lcolor;
	context.lineWidth = 1.5;
	context.beginPath();
	context.moveTo(x1 * sf, y1 * sf);
	context.quadraticCurveTo(x2 * sf, y2 * sf, x3 * sf, y3 * sf);
	context.stroke();
	if (guideLines) {
		dashedline(x1 * sf, y1 * sf, x2 * sf, y2 * sf, 10, 1, dashedLineColor);
		dashedline(x3 * sf, y3 * sf, x2 * sf, y2 * sf, 10, 1, dashedLineColor);

		drawSPoint(x2, y2, "#FF0", "#880");
		drawSPoint(x3, y3, "#FF0", "#880");
	} else {
		drawCross(x3, y3, "#F40");
	}
}

function drawSCubic(x1, y1, x2, y2, x3, y3, x4, y4, lcolor, guideLines) {
	context.strokeStyle = lcolor;
	context.lineWidth = 1.5;
	context.beginPath();
	context.moveTo(x1 * sf, y1 * sf);
	context.bezierCurveTo(x2 * sf, y2 * sf, x3 * sf, y3 * sf, x4 * sf, y4 * sf);
	context.stroke();

	if (guideLines) {
		dashedline(x1 * sf, y1 * sf, x2 * sf, y2 * sf, 10, 1, "#F8F");
		dashedline(x3 * sf, y3 * sf, x4 * sf, y4 * sf, 10, 1, "#F8F");

		drawSPoint(x2, y2, "#FF0", "#880");
		drawSPoint(x3, y3, "#FF0", "#880");
		drawSPoint(x4, y4, "#FF0", "#880");
	} else {
		drawCross(x4, y4, "#F40");
	}
}

function init(quizGoal, studentPreviousAnswer) {

	goal = quizGoal.split(",");
	startx = parseInt(goal.shift());
	starty = parseInt(goal.shift());

	var oplist = document.getElementById('operations');

	if (studentPreviousAnswer != "") {
		var studentOp = studentPreviousAnswer.split(",");
		for (var i = 0; i < studentOp.length; i++) {
			var opArr = studentOp[i].split(" ");
			if (opArr[0] == "L") {
				oplist.innerHTML += "<option id='op" + (objectCounter++) + "' value='" + studentOp[i] + "'>Linje</option>";

			} else if (opArr[0] == "Q") {
				oplist.innerHTML += "<option id='op" + (objectCounter++) + "' value='" + studentOp[i] + "'>Kvadratisk kurva</option>";

			} else if (opArr[0] == "C") {
				oplist.innerHTML += "<option id='op" + (objectCounter++) + "' value='" + studentOp[i] + "'>Kubisk kurva</option>";
				sx = parseInt(opArr[5]);
				sy = parseInt(opArr[6]);

			} else {
				alert("Unkown operation - don't know how to draw!\n" + opArr);
			}
		}
	}

}

function fitToContainer() {
	// Make it visually fill the positioned parent
	divw = $("#content").width();
	if (divw > 500)
		divw -= 248;
	if (divw < window.innerHeight) {
		canvas.width = divw;
		canvas.height = divw;
	} else {
		canvas.width = window.innerHeight - 100;
		canvas.height = canvas.width;
	}

	sf = canvas.width / 100;
}

var startx = 10;
var starty = 30;
var elapsedTime = 0;
var previousSync = 0;

function drawOp(sx, sy, opArr, lineColor, guideLines) {

	if (opArr[0] == "L" || opArr[0] == "81") {
		drawSLine(sx, sy, parseInt(opArr[1]), parseInt(opArr[2]), lineColor, guideLines);

	} else if (opArr[0] == "Q" || opArr[0] == "63") {
		drawSQuadratic(sx, sy, parseInt(opArr[1]), parseInt(opArr[2]), parseInt(opArr[3]), parseInt(opArr[4]), lineColor, guideLines);

	} else if (opArr[0] == "C" || opArr[0] == "19") {
		drawSCubic(sx, sy, parseInt(opArr[1]), parseInt(opArr[2]), parseInt(opArr[3]), parseInt(opArr[4]), parseInt(opArr[5]), parseInt(opArr[6]), lineColor, guideLines);
		sx = parseInt(opArr[5]);
		sy = parseInt(opArr[6]);

	} else {
		alert("Unkown operation - don't know how to draw!\n" + opArr);
	}

}

function drawPath() {
	var sx = startx;
	var sy = starty;

	// draw target figure
	for (var i = 0; i < goal.length; i++) {
		var op = goal[i].split(' ');
		drawOp(sx, sy, op, targetLineColor, false);
		sx = parseInt(op[op.length - 2]);
		sy = parseInt(op[op.length - 1]);
	}

	drawSPoint(startx, starty, "#000", "#F40");
	drawSPoint(sx, sy, "#000", "#04F");
	sx = startx;
	sy = starty;

	// Draw students objects
	$("#operations > option").each(function() {
		var opArr = this.value.split(" ");
		if (this.id == selectedObjId) {
			opArr[selectedPoint * 2 - 1] = gridx;
			opArr[selectedPoint * 2] = gridy;
		}
		drawOp(sx, sy, opArr, studentLineColor, true);

		sx = parseInt(opArr[opArr.length - 2]);
		sy = parseInt(opArr[opArr.length - 1]);
	});

}

function render() {

	fitToContainer();

	context.clearRect(0, 0, 100 * sf, 100 * sf);
	elapsedTime++;

	if (debug) {
		context.font = "20px Georgia";
		context.fillText("Elapsed time: " + elapsedTime, 10, 50);
		document.getElementById('debugCanvas').innerHTML = "<p>canvas height: " + canvas.height + " canvas width: " + canvas.width + "</p><p>window height: " + window.innerHeight + " window width: " + window.innerWidth + "</p><p>canvas style height: " + canvas.style.height + " canvas style width: " + canvas.style.width + "</p><p>gridx: " + gridx + "gridy: " + gridy + "</p>";
	}

	// Draw grid lines
	context.strokeStyle = '#ddd';
	context.lineWidth = 0.5;
	context.beginPath();
	var j = 0;
	for ( i = 0; i < 100; i += gridsize) {
		context.moveTo(i * sf, 0);
		context.lineTo(i * sf, 100 * sf);
		context.moveTo(0, i * sf);
		context.lineTo(100 * sf, i * sf);
	}
	context.stroke();

	drawPath();
	$("#operations > option").each(function() {
		var opArr = this.value.split(" ");
		for (var i = 1; i < opArr.length; i += 2) {
			if (opArr[i] == gridx && opArr[i + 1] == gridy) {
				drawSPoint(gridx, gridy, "#000", "#08F");
			}

		}
	});
	// Draw Crosshair
	context.beginPath();
	context.strokeStyle = '#444';
	context.lineWidth = 1.0;
	context.moveTo((gridx - gridsize) * sf, gridy * sf);
	context.lineTo((gridx + gridsize) * sf, gridy * sf);
	context.moveTo(gridx * sf, (gridy - gridsize) * sf);
	context.lineTo(gridx * sf, (gridy + gridsize) * sf);
	context.stroke();

	setTimeout("render();", 100);

}

