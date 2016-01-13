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

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	running = true;
	tickInterval = setInterval("tick();", 50);

	AJAXService("GETPARAM", { }, "PDUGGA");

}

function returnedDugga(data) 
{	
	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		retdata = jQuery.parseJSON(data['param']);
		document.getElementById("duggaInstructions").innerHTML = retdata["instructions"];
		showDuggaInfoPopup();
		document.getElementById("target-window-img").src = "showdoc.php?fname="+retdata["target"];

		if (data["answer"] == null || data["answer"] !== "UNK") {
			var tmpstr = data["answer"].substr(data["answer"].indexOf("["));
			tmpstr = tmpstr.substr(0, tmpstr.lastIndexOf("]")+1);
			tmpstr = tmpstr.replace(/&quot;/g, "\"");
			var previousAnswer = jQuery.parseJSON(tmpstr);
			console.log(previousAnswer);
			previousAnswer[0] = previousAnswer[0].replace(/\!\!lt\!\!/g,"<");
			previousAnswer[0] = previousAnswer[0].replace(/\!\!gt\!\!/g,">");
			previousAnswer[0] = previousAnswer[0].replace(/\!\!semi\!\!/g,";");			
			previousAnswer[0] = previousAnswer[0].replace(/\&\#47\;/g,"/");			
			previousAnswer[0] = previousAnswer[0].replace(/\&\#63\;/g,"?");
			document.getElementById("content-window").value = previousAnswer[0];
			previousAnswer[1] = previousAnswer[1].replace(/\&\#47\;/g,"/");
			previousAnswer[1] = previousAnswer[1].replace(/\&\#63\;/g,"?");
			document.getElementById("url-input").value = previousAnswer[1];
			changedTxt();
			refreshdUrl()
		}


	}
}

function reset()
{
	console.log(JSON.stringify(boxes));
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
	var tmp = [document.getElementById("content-window").value, document.getElementById("url-input").value];

	tmp[0] = tmp[0].replace(/\</g,"!!lt!!");
	tmp[0] = tmp[0].replace(/\>/g,"!!gt!!");
	tmp[0] = tmp[0].replace(/\;/g,"!!semi!!");

	bitstr = JSON.stringify(tmp);
	bitstr += ",T " + elapsedTime;

	bitstr += " " + window.screen.width;
	bitstr += " " + window.screen.height;

	bitstr += " " + $(window).width();
	bitstr += " " + $(window).height();

	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function showFacit(param, uanswer, danswer, userStats)
{
	document.getElementById('duggaTime').innerHTML=userStats[0];
	document.getElementById('duggaTotalTime').innerHTML=userStats[1];
	document.getElementById('duggaClicks').innerHTML=userStats[2];
	document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
	$("#duggaStats").css("display","block");

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

	retdata = jQuery.parseJSON(param);
	variant = retdata["variant"];

	if (uanswer !== null || uanswer !== "UNK") {
		var previous = uanswer.split(',');
		previous.shift();
		previous.pop();

		// Add previous handed in dugga
		operationList = [];
		for (var i = 0; i < previous.length; i++) {
			if (previous[i] !== ""){
				operationList.push([operationsMap[previous[i]], previous[i]]);						
			}
		}
		renderOperationList();
	}

	foo();
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
function changedTxt()
{
		document.getElementById("preview-code-window").innerHTML=document.getElementById("content-window").value;
}

function refreshdUrl()
{
		document.getElementById("url-preview-window").innerHTML = '<iframe style="min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" id="preview-url-window" src="'+document.getElementById("url-input").value+'"></iframe>'
}