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

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup()
{
	running = true;
	tickInterval = setInterval("tick();", 50);

	AJAXService("GETPARAM", { }, "PDUGGA");

}

function returnedDugga(data)
{

	$("#content").css({"position":"relative"});

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
			var userCode = data["answer"].slice(data["answer"].indexOf("###HTMLSTART###")+15,data["answer"].indexOf("###HTMLEND###"));
			userCode =  reverseHtmlEntities(userCode);

			var userUrl = data["answer"].slice(data["answer"].indexOf("###URLSTART###")+14,data["answer"].indexOf("###URLEND###"));
			userUrl =  reverseHtmlEntities(userUrl);

			document.getElementById("content-window").value = userCode;
			document.getElementById("url-input").value = userUrl;

			processpreview();
			refreshdUrl();
		}

		var max = 0;
		$('.dugga-col').each(function() {
		    max = Math.max($(this).height(), max);
		}).height(max);

	}
	// Teacher feedback
	if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
			document.getElementById('feedbackBox').style.display = "none";
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
			$("#showFeedbackButton").css("display","block");
	}
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
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

	if (document.getElementById("content-window").value.length > MAX_SUBMIT_LENGTH){
		alert("Din kod är för lång. Svaret går att göra mindre. Inget har sparats.");
		return;
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

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		$("#duggaStats").css("display","block");
	}
	document.getElementById('feedbackBox').style.display = "none";
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
	document.getElementById("target-text").innerHTML = retdata["target-text"];

	if (uanswer !== null || uanswer !== "UNK") {
			/*
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
			*/
			var userCode = uanswer.slice(uanswer.indexOf("###HTMLSTART###")+15,uanswer.indexOf("###HTMLEND###"));
			userCode =  reverseHtmlEntities(userCode);

			var userUrl = uanswer.slice(uanswer.indexOf("###URLSTART###")+14,uanswer.indexOf("###URLEND###"));
			userUrl =  reverseHtmlEntities(userUrl);
      if(window.location.protocol === "https:"){
          userUrl=userUrl.replace("http://", "https://");
      }else{
          userUrl=userUrl.replace("https://", "http://");
      }

			var markWindowHeight = $("#MarkCont").height();

			$("#MarkCont").css({"overflow":"hidden"});

			document.getElementById("input-col").style.height = (markWindowHeight-55)+"px";
			document.getElementById("content-window").value = userCode;
			document.getElementById("content-window").style.fontSize = "12px";
			document.getElementById("url-input").value = userUrl;
			document.getElementById("url-button").href = userUrl;
			document.getElementById("url-button").style.display = "inline-block";
			document.getElementById("target-col").style.display = "none";
			document.getElementById("validation-col").style.display = "table-cell";
			document.getElementById("preview-col").style.height = (markWindowHeight-55)+"px";

			document.getElementById("code-preview-label").style.display = "none";
			document.getElementById("code-preview-window-wrapper").style.display = "none";
			var iframeX = $("#preview-col").width();
			var iframeY = $("#preview-col").height();

			document.getElementById("url-preview-label").innerHTML = '<div id="url-preview-label" style=""><h2 class="loginBoxheader" style="padding:5px; padding-bottom:10px; margin-top:0; color:#FFF;overflow:hidden; text-align:center;">Förhandsgranskning av publicerad kod</h2></div>';
			document.getElementById("url-preview-window").innerHTML= '<iframe style="pointer-events: none; width: '+800+'px; height:'+768+'px; border: 1px solid black; overflow:scroll; transform:scale('+iframeX/800+'); transform-origin:0 0; box-sizing:border-box;" src="'+userUrl+'"></iframe>';

			document.getElementById("validation-col").style.height = (markWindowHeight-55)+"px";


			document.getElementById("url-validation-window").innerHTML = '<iframe style="pointer-events: none;width: 400px; height:1200px; border: 1px solid black; overflow:hidden; transform:scale(1); transform-origin:0 0; box-sizing:border-box;" src="https://html5.validator.nu/?doc='+ encodeURIComponent(userUrl)+'"></iframe>';



			$( "#MarkCont" ).append( '<img id="facit-target-window-img" class="facitPreview" src="'+document.getElementById("target-window-img").src+'" onmouseenter="togglePopover();" onclick="togglePreview();"/>' );


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
	if (document.getElementById('teacherFeedbackTable')){
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

function refreshdUrl()
{
    var newUrl = document.getElementById("url-input").value+'?name='+(new Date).getTime();
    if(window.location.protocol === "https:"){
        newUrl=newUrl.replace("http://", "https://");
    }else{
        newUrl=newUrl.replace("https://", "http://");
    }

		document.getElementById("url-preview-window").innerHTML = '<iframe style="box-sizing:border-box;min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" id="preview-url-window" src="'+newUrl+'"></iframe>'
}


function processpreview()
{
		content=document.getElementById("content-window").value;
		content=encodeURIComponent(content);

		document.getElementById("code-preview-window").src="preview.php?prev="+content;
}

function togglePreview (){
	$("#facit-target-window-img").removeClass("facitPopover").addClass("facitPreview");}

function togglePopover (){
	$("#facit-target-window-img").removeClass("facitPreview").addClass("facitPopover");
}

function toggleFeedback()
{
    $(".feedback-content").slideToggle("slow");
}