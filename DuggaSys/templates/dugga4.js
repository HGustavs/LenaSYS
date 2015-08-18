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

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	running = true;
	canvas = document.getElementById('a');
	if (canvas) {
		context = canvas.getContext("2d");
		tickInterval = setInterval("tick();", 50);

		AJAXService("GETPARAM", { }, "PDUGGA");
	}
}

function returnedDugga(data) 
{	
	dataV = data;
	
	if (data['debug'] != "NONE!")
		alert(data['debug']);

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		if (canvas) {
			showDuggaInfoPopup();
			var studentPreviousAnswer = "";

			retdata = jQuery.parseJSON(data['param']);
			variant = retdata["variant"];

			if (data["answer"] != null) {
				var previous = data['answer'].split(',');
				previous.shift();
				previous.pop();
				// Clear operations
				document.getElementById('operations').innerHTML = "";

				var str = "";

				var cstr = "";
				// Add previous handed in dugga
				for (var i = 0; i < previous.length; i++) {
					cstr = previous[i];
					if (cstr == "D1" || cstr == "0") {

						str += '<option value="D1">Draw R</option>';

					} else if (cstr == "D2" || cstr == "1") {
						str += '<option value="D2">Draw G</option>';

					} else if (cstr == "D3" || cstr == "2") {
						str += '<option value="D3">Draw B</option>';

					} else if (cstr == "T1" || cstr == "3") {
						str += '<option value="T1">Translate 1</option>';

					} else if (cstr == "T2" || cstr == "4") {
						str += '<option value="T2">Translate 2</option>';

					} else if (cstr == "T3" || cstr == "5") {
						str += '<option value="T3">Translate 3</option>';

					} else if (cstr == "T4" || cstr == "6") {
						str += '<option value="T4">Translate 4</option>';

					} else if (cstr == "T5" || cstr == "7") {
						str += '<option value="T5">Translate 5</option>';

					} else if (cstr == "T6" || cstr == "8") {
						str += '<option value="T6">Translate 6</option>';

					} else if (cstr == "T7" || cstr == "9") {
						str += '<option value="T7">Translate 7</option>';

					} else if (cstr == "T8" || cstr == "10") {
						str += '<option value="T8">Translate 8</option>';

					} else if (cstr == "R0" || cstr == "11") {
						str += '<option value="R0">Rotate +3</option>';

					} else if (cstr == "R1" || cstr == "12") {
						str += '<option value="R1">Rotate +2</option>';

					} else if (cstr == "R2" || cstr == "13") {
						str += '<option value="R2">Rotate +1</option>';

					} else if (cstr == "R3" || cstr == "14") {
						str += '<option value="R3">Rotate +0.3</option>';

					} else if (cstr == "R4" || cstr == "15") {
						str += '<option value="R4">Rotate +0.2</option>';

					} else if (cstr == "R5" || cstr == "16") {
						str += '<option value="R5">Rotate -0.2</option>';

					} else if (cstr == "R6" || cstr == "17") {
						str += '<option value="R6">Rotate -0.3</option>';

					} else if (cstr == "R7" || cstr == "18") {
						str += '<option value="R7">Rotate -1</option>';

					} else if (cstr == "R8" || cstr == "19") {
						str += '<option value="R8">Rotate -2</option>';

					} else if (cstr == "R9" || cstr == "20") {
						str += '<option value="R9">Rotate -3</option>';

					} else if (cstr == "S0" || cstr == "21") {
						str += '<option value="S0">Scale 0.2</option>';

					} else if (cstr == "S1" || cstr == "22") {
						str += '<option value="S1">Scale 0.3</option>';

					} else if (cstr == "S2" || cstr == "23") {
						str += '<option value="S2">Scale 0.5</option>';

					} else if (cstr == "S3" || cstr == "24") {
						str += '<option value="S3">Scale 1.0</option>';

					} else if (cstr == "S4" || cstr == "25") {
						str += '<option value="S4">Scale 1.25</option>';
					} else if (cstr == "PUSH" || cstr == "26") {
						str += '<option value="PUSH">Push (remember state)</option>';
					} else if (cstr == "POP" || cstr == "27") {
						str += '<option value="POP">Pop (jump back)</option>';
					}
				}
				document.getElementById('operations').innerHTML = str;
			}

			foo();
		}
	}
}

function saveClick() 
{
	if (querystring['highscoremode'] == 1) {	
		Timer.stopTimer();
		score = Timer.score;
	} else if (querystring['highscoremode'] == 2) {
		score = ClickCounter.score;
	}

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

function showFacit(param, uanswer, danswer) 
{
	/* reset */
	sf = 2.0;
	speed = 0.1;
	v = 0;
	pushcount = 0;
	elapsedTime = 0;

	running = true;
	canvas = document.getElementById('a');
	context = canvas.getContext("2d");
	tickInterval = setInterval("tick();", 50);
	var studentPreviousAnswer = "";
	if (uanswer != null) {
		var studentPreviousAnswer = "";

		retdata = jQuery.parseJSON(param.replace(/\*/g, '"'));
		variant = retdata["variant"];

		if (uanswer != null) {
			var previous = uanswer.split(',');
			previous.shift();
			previous.pop();
			// Clear operations
			document.getElementById('operations').innerHTML = "";

			var str = "";

			var cstr = "";
			// Add previous handed in dugga
			for (var i = 0; i < previous.length; i++) {
				cstr = previous[i];
				if (cstr == "D1" || cstr == "0") {

					str += '<option value="D1">Draw R</option>';

				} else if (cstr == "D2" || cstr == "1") {
					str += '<option value="D2">Draw G</option>';

				} else if (cstr == "D3" || cstr == "2") {
					str += '<option value="D3">Draw B</option>';

				} else if (cstr == "T1" || cstr == "3") {
					str += '<option value="T1">Translate 1</option>';

				} else if (cstr == "T2" || cstr == "4") {
					str += '<option value="T2">Translate 2</option>';

				} else if (cstr == "T3" || cstr == "5") {
					str += '<option value="T3">Translate 3</option>';

				} else if (cstr == "T4" || cstr == "6") {
					str += '<option value="T4">Translate 4</option>';

				} else if (cstr == "T5" || cstr == "7") {
					str += '<option value="T5">Translate 5</option>';

				} else if (cstr == "T6" || cstr == "8") {
					str += '<option value="T6">Translate 6</option>';

				} else if (cstr == "T7" || cstr == "9") {
					str += '<option value="T7">Translate 7</option>';

				} else if (cstr == "T8" || cstr == "10") {
					str += '<option value="T8">Translate 8</option>';

				} else if (cstr == "R0" || cstr == "11") {
					str += '<option value="R0">Rotate +3</option>';

				} else if (cstr == "R1" || cstr == "12") {
					str += '<option value="R1">Rotate +2</option>';

				} else if (cstr == "R2" || cstr == "13") {
					str += '<option value="R2">Rotate +1</option>';

				} else if (cstr == "R3" || cstr == "14") {
					str += '<option value="R3">Rotate +0.3</option>';

				} else if (cstr == "R4" || cstr == "15") {
					str += '<option value="R4">Rotate +0.2</option>';

				} else if (cstr == "R5" || cstr == "16") {
					str += '<option value="R5">Rotate -0.2</option>';

				} else if (cstr == "R6" || cstr == "17") {
					str += '<option value="R6">Rotate -0.3</option>';

				} else if (cstr == "R7" || cstr == "18") {
					str += '<option value="R7">Rotate -1</option>';

				} else if (cstr == "R8" || cstr == "19") {
					str += '<option value="R8">Rotate -2</option>';

				} else if (cstr == "R9" || cstr == "20") {
					str += '<option value="R9">Rotate -3</option>';

				} else if (cstr == "S0" || cstr == "21") {
					str += '<option value="S0">Scale 0.2</option>';

				} else if (cstr == "S1" || cstr == "22") {
					str += '<option value="S1">Scale 0.3</option>';

				} else if (cstr == "S2" || cstr == "23") {
					str += '<option value="S2">Scale 0.5</option>';

				} else if (cstr == "S3" || cstr == "24") {
					str += '<option value="S3">Scale 1.0</option>';

				} else if (cstr == "S4" || cstr == "25") {
					str += '<option value="S4">Scale 1.25</option>';
				} else if (cstr == "PUSH" || cstr == "26") {
					str += '<option value="PUSH">Push (remember state)</option>';
				} else if (cstr == "POP" || cstr == "27") {
					str += '<option value="POP">Pop (jump back)</option>';
				}
			}
			document.getElementById('operations').innerHTML = str;
		}

		foo();

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

function newbutton() 
{
	if (querystring['highscoremode'] == 2) {
		ClickCounter.onClick();
	}
	var texto = $("#operations").html();

	var valv = $("#function").val();
	var newtext = $('#function > option:selected').text();
	texto += "<option value='" + valv + "'>" + newtext + "</option>";
	$("#operations").html(texto);
}

function moveupbutton() 
{
	if (querystring['highscoremode'] == 2) {
		ClickCounter.onClick();
	}

	$('#operations>option:selected').prev().each(function() {
		$(this).next().after("<option value='" + $(this).val() + "'>" + $(this).html() + "</option>");
		$(this).remove();
	});
}

function movedownbutton() 
{
	if (querystring['highscoremode'] == 2) {
		ClickCounter.onClick();
	}

	$('#operations>option:selected').next().each(function() {
		$(this).prev().before("<option value='" + $(this).val() + "'>" + $(this).html() + "</option>");
		$(this).remove();
	});
}

function deletebutton() 
{
	if (querystring['highscoremode'] == 2) {
		ClickCounter.onClick();
	}

	$('#operations> option:selected').each(function() {
		$(this).remove();
	});
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

	$("#operations > option").each(function() {
		drawCommand(this.value);
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
		setTimeout("foo();", 50);
	}

}

//----------------------------------------------------------------------------------
// High score function, gets called from hideDuggainfoPopup function in dugga.js
// dataV = global variable with the data set in returnedDugga
//----------------------------------------------------------------------------------

function startDuggaHighScore(){
	if(querystring['highscoremode'] == 1) {
		Timer.startTimer();
		if(dataV['score'] > 0){
			Timer.score = dataV['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		ClickCounter.initialize();
		if(dataV['score'] > 0){
			ClickCounter.score = dataV['score'];
			console.log(ClickCounter.score);
		}
		ClickCounter.showClicker();
	}
}
