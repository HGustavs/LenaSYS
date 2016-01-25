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
		document.getElementById("target-text").innerHTML = retdata["target-text"];


		if (data["answer"] == null || data["answer"] !== "UNK") {
			var userCode = data["answer"].substr(data["answer"].indexOf("###HTMLSTART###")+15,data["answer"].indexOf("###HTMLEND###")-28);
			userCode =  reverseHtmlEntities(userCode);
			var userUrl = data["answer"].substr(data["answer"].indexOf("###URLSTART###"),data["answer"].indexOf("###URLEND###"));
			var res = userUrl.split(",");
			userUrl = res[0]; 
			userUrl = userUrl.replace("###URLSTART###", "");
			userUrl = userUrl.replace("###URLEND###", "");
			userUrl =  reverseHtmlEntities(userUrl);
			document.getElementById("content-window").value = userCode;
			document.getElementById("url-input").value = userUrl;

			changedTxt();
			refreshdUrl();
		}


	}
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");

	document.getElementById("content-window").value = "";
	document.getElementById("url-input").value = "";

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


	bitstr = htmlEntities("###HTMLSTART###"+document.getElementById("content-window").value+"###HTMLEND###");
	bitstr += htmlEntities("###URLSTART###"+document.getElementById("url-input").value+"###URLEND###");

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
	$("#duggaStats").css("display","none");

	/* reset */
	sf = 2.0;
	speed = 0.1;
	v = 0;
	pushcount = 0;
	elapsedTime = 0;

	running = true;
	tickInterval = setInterval("tick();", 50);
	var studentPreviousAnswer = "";

	retdata = jQuery.parseJSON(param);

	document.getElementById("target-window-img").src = "showdoc.php?fname="+retdata["target"];

	if (uanswer !== null || uanswer !== "UNK") {
		
			var userCode = uanswer.substr(uanswer.indexOf("###HTMLSTART###"),uanswer.indexOf("###HTMLEND###"));
			userCode = userCode.replace("###HTMLSTART###", "");
			userCode = userCode.replace("###HTMLEND###", "");

			userCode =  reverseHtmlEntities(userCode);
			var userUrl = uanswer.substr(uanswer.indexOf("###URLSTART###"),uanswer.indexOf("###URLEND###"));
			var res = userUrl.split(",");
			userUrl = res[0]; 
			userUrl = userUrl.replace("###URLSTART###", "");
			userUrl = userUrl.replace("###URLEND###", "");
			userUrl =  reverseHtmlEntities(userUrl);

			document.getElementById("content-window").value = userCode;
			$("#code-preview-label").css("display","none");
			$("#preview-code-window").css("display","none");
			document.getElementById("url-preview-window").innerHTML = '<iframe style="min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" src="'+userUrl+'"></iframe>'
			
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
function reverseHtmlEntities(str) {
													
		befstr=str;
		if(str!=undefined && str != null){
				str=str.replace(/\&amp\;/g, '&');
				str=str.replace(/\&lt\;/g, '<');
				str=str.replace(/\&gt\;/g, '>');
				str=str.replace(/\&ouml\;/g, 'ö');
				str=str.replace(/\&Ouml\;/g, 'Ö');
				str=str.replace(/\&auml\;/g, 'ä');
				str=str.replace(/\&Auml\;/g, 'Ä');
				str=str.replace(/\&aring\;/g, 'å');
				str=str.replace(/\&Aring\;/g, 'Å');
				str=str.replace(/\&quot\;/g, '"');
				str=str.replace(/\&#47\;/g, '/');
				str=str.replace(/\&#92\;/g, '\\');
				str=str.replace(/\&#63\;/g, '?');
				str=str.replace(/\\n/g, '\n');

//				str=str.replace(/\{/g, '&#123;');
//				str=str.replace(/\}/g, '&#125;');
		}
   	return str;
}

function changedTxt()
{
		document.getElementById("preview-code-window").innerHTML=document.getElementById("content-window").value;
}

function refreshdUrl()
{
		document.getElementById("url-preview-window").innerHTML = '<iframe style="min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" id="preview-url-window" src="'+document.getElementById("url-input").value+'"></iframe>'
}


function processpreview()
{
		content=document.getElementById("content-window").value;
		content=encodeURIComponent(content);
		
		document.getElementById("preview-code-window").src="preview.php?prev="+content;
}