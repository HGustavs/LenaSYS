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
	inParams = parseGet();

	AJAXService("GETPARAM", { }, "PDUGGA");

}

function returnedDugga(data) 
{	

	$("#content").css({"position":"relative","top":"50px"});

	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		retdata = jQuery.parseJSON(data['param']);
		duggaParams = retdata;
		//document.getElementById("duggaInstructions").innerHTML = retdata["instructions"];
		//showDuggaInfoPopup();
		if(duggaParams["type"]==="pdf"){
				document.getElementById("snus").innerHTML="<embed src='showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"' width='100%' height='1000px' type='application/pdf'>";
		}else if(duggaParams["type"]==="md" || duggaParams["type"]==="html"){
			$.ajax({url: "showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"&headers=none", success: function(result){
        		$("#snus").html(result);
        		// Placeholder code
				var pl = duggaParams.placeholders;
				if (pl !== undefined) {
					for (var m=0;m<pl.length;m++){
						for (placeholderId in pl[m]) {
							if (document.getElementById("placeholder-"+placeholderId) !== null){
								for (placeholderDataKey in pl[m][placeholderId]) {
									if (pl[m][placeholderId][placeholderDataKey] !== ""){
										document.getElementById("placeholder-"+placeholderId).innerHTML='<a href="'+pl[m][placeholderId][placeholderDataKey]+'" target="_blank">'+placeholderDataKey+'</a>';
									} else {
										document.getElementById("placeholder-"+placeholderId).innerHTML=placeholderDataKey;
									}
								}
							}
						}
					}					
				}
    		}});
		}

		//document.getElementById("target-window-img").src = "showdoc.php?fname="+retdata["target"];
		//document.getElementById("target-text").innerHTML = retdata["target-text"];


		if (data["answer"] == null || data["answer"] !== "UNK") {
			var userCode = data["answer"].substr(data["answer"].indexOf("###HTMLSTART###")+15,data["answer"].indexOf("###HTMLEND###")-28);
			userCode =  reverseHtmlEntities(userCode);

			document.getElementById("content-window").value = userCode;

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
			// No feedback
	} else {
			var fb = "<table><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
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

	/* reset */
	sf = 2.0;
	speed = 0.1;
	v = 0;
	pushcount = 0;
	elapsedTime = 0;

	running = true;
	tickInterval = setInterval("tick();", 50);
	var studentPreviousAnswer = "";
	inParams = parseGet();
	retdata = jQuery.parseJSON(decodeURIComponent(param));
	duggaParams = retdata;
	if(duggaParams["type"]==="pdf"){
			document.getElementById("snus").innerHTML="<embed src='showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"' width='100%' height='1000px' type='application/pdf'>";
	}else if(duggaParams["type"]==="md" || duggaParams["type"]==="html"){
		$.ajax({url: "showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"&headers=none", success: function(result){
    		$("#snus").html(result);
    		// Placeholder code
			var pl = duggaParams.placeholders;
			if (pl !== undefined) {
				for (var m=0;m<pl.length;m++){
					for (placeholderId in pl[m]) {
						if (document.getElementById("placeholder-"+placeholderId) !== null){
							for (placeholderDataKey in pl[m][placeholderId]) {
								if (pl[m][placeholderId][placeholderDataKey] !== ""){
									document.getElementById("placeholder-"+placeholderId).innerHTML='<a href="'+pl[m][placeholderId][placeholderDataKey]+'" target="_blank">'+placeholderDataKey+'</a>';
								} else {
									document.getElementById("placeholder-"+placeholderId).innerHTML=placeholderDataKey;
								}
							}
						}
					}
				}					
			}
		}});
	}

	if (uanswer !== null || uanswer !== "UNK") {
		
			var userCode = uanswer.substr(uanswer.indexOf("###HTMLSTART###"),uanswer.indexOf("###HTMLEND###"));
			userCode = userCode.replace("###HTMLSTART###", "");
			userCode = userCode.replace("###HTMLEND###", "");

			userCode =  reverseHtmlEntities(userCode);

			var markWindowHeight = $("#MarkCont").height();
			
			$("#MarkCont").css({"overflow":"hidden"});

			document.getElementById("input-col").style.height = (markWindowHeight-55)+"px";
			document.getElementById("content-window").value = userCode;
			document.getElementById("content-window").style.fontSize = "12px";
			document.getElementById("target-col").style.display = "block";
			document.getElementById("validation-col").style.display = "none";
			document.getElementById("preview-col").style.height = (markWindowHeight-55)+"px";

			document.getElementById("code-preview-label").style.display = "none";
			document.getElementById("code-preview-window-wrapper").style.display = "none";
			var iframeX = $("#preview-col").width();
			var iframeY = $("#preview-col").height();

			document.getElementById("validation-col").style.height = (markWindowHeight-55)+"px";

	}
	// Teacher feedback
	var fb = "<table><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
	if (feedback !== undefined){
		var feedbackArr = feedback.split("||");
		for (var k=feedbackArr.length-1;k>=0;k--){
			var fb_tmp = feedbackArr[k].split("%%");
			fb+="<tr><td>"+fb_tmp[0]+"</td><td>"+fb_tmp[1]+"</td></tr>";
		} 		
	}
	fb += "</tbody></table><br><textarea id='newFeedback'></textarea>";
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
		//document.getElementById("url-preview-window").innerHTML = '<iframe style="box-sizing:border-box;min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" id="preview-url-window" src="'+document.getElementById("url-input").value+'?name='+(new Date).getTime()+'"></iframe>'
}


function processpreview()
{
		content=document.getElementById("content-window").value;
		content=encodeURIComponent(content);
		
		document.getElementById("code-preview-window").src="preview.php?prev="+content;
}

function toggleFeedback()
{
    $(".feedback-content").slideToggle("slow");
}