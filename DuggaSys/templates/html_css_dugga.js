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
	//update preview window when text change in content-window
	$('#content-window').bind('input propertychange', function() {
  	 	processpreview();
	});
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

			processpreview();
			refreshdUrl();
		}

		var max = 0;    
		$('.dugga-col').each(function() {
		    max = Math.max($(this).height(), max);
		}).height(max);

	}
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");

	document.getElementById("content-window").value = "";
	document.getElementById("url-input").value = "";

	Timer.reset();
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

	retdata = jQuery.parseJSON(decodeURIComponent(param));

	document.getElementById("target-window-img").src = "showdoc.php?fname="+retdata["target"];
	document.getElementById("target-text").innerHTML = retdata["target-text"];

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

			var markWindowHeight = $("#MarkCont").height();
			
			$("#MarkCont").css({"overflow":"hidden"});

			document.getElementById("input-col").style.height = (markWindowHeight-55)+"px";
			document.getElementById("content-window").value = userCode;
			document.getElementById("content-window").style.fontSize = "12px";
			document.getElementById("url-input").value = userUrl;
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



			$( "#MarkCont" ).append( '<img id="facit-target-window-img" style="width:200px; height:200px;overflow:hidden; position:absolute; bottom:50px;right:11px;border:1px solid black;" src="'+document.getElementById("target-window-img").src+'" />' );


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
	if(querystring['highscoremode'] == 1) {
		Timer.startTimer();
		if(data['score'] > 0){
			Timer.score = data['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		ClickCounter.initialize();
		if(data['score'] > 0){
			ClickCounter.score = data['score'];
			console.log(ClickCounter.score);
		}
		ClickCounter.showClicker();
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
		document.getElementById("url-preview-window").innerHTML = '<iframe style="box-sizing:border-box;min-height:400px;min-width:400px;width:100%;height:100%;overflow:scroll;" id="preview-url-window" src="'+document.getElementById("url-input").value+'?name='+(new Date).getTime()+'"></iframe>'
}


function processpreview()
{
		content=document.getElementById("content-window").value;
		content=encodeURIComponent(content);
		
		document.getElementById("code-preview-window").src="preview.php?prev="+content;
}