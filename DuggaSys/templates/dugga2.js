/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 NB! This dugga requires a png-file corresponding to the specific colors, e.g., color_red.png
	 Param: {"color":"red","colorname":"Röd"}
	 Answer: Variant

-------------==============######## Documentation End ###########==============-------------
*/

//----------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------

var dw,dpos,dwid,dhei,bw,lpos,popclass;
var hc=null;
var score = -1;
var activehex;

//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
	// Add eventhandler for click to all
	// buttons that have the class 'hexo'
	const hexoButtons = document.querySelectorAll('.hexo');
	hexoButtons.forEach(button => {
		button.addEventListener('click', function () {
			hexClick(this.id);
		});
	});

	AJAXService("GETPARAM",{ },"PDUGGA");
}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data)
{
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
		}
		ClickCounter.showClicker();
	}
	
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['opt']=="SAVDU"){
		showReceiptPopup();
	}
	
	if(data['param']=="UNK"){
			alert("UNKNOWN DUGGA!");
	}else{
		retdata=jQuery.parseJSON(data['param']);
		document.getElementById("fargnamn").innerHTML = retdata['colorname'];
		document.getElementById("fargen").setAttribute("src", "templates/color_" + retdata['color'] + ".png");
		// Add our previous answer
		if (data['answer'] != null){
			var previous = data['answer'].split(' ');
			if (previous.length >= 9){
				document.getElementById('H0').innerHTML=previous[4];
				document.getElementById('H1').innerHTML=previous[5];
				document.getElementById('H2').innerHTML=previous[6];
				document.getElementById('H3').innerHTML=previous[7];
				document.getElementById('H4').innerHTML=previous[8];
				document.getElementById('H5').innerHTML=previous[9];
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
			document.getElementById('showFeedbackButton').style.display = "block";
	}
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);
}

//----------------------------------------------------------------------------------
// saveClick: Save the dugga and get a receipt
//----------------------------------------------------------------------------------

function saveClick()
{
	$.ajax({									//Ajax call to see if the new hash have a match with any hash in the database.
		url: "showDuggaservice.php",
		type: "POST",
		data: "&hash="+hash, 					//This ajax call is only to refresh the userAnswer database query.
		dataType: "json",
		success: function(data) {
			ishashindb = data['ishashindb'];	//Ajax call return - ishashindb == true: not unique hash, ishashindb == false: unique hash.
			if(ishashindb==true && blockhashgen ==true || ishashindb==true && blockhashgen ==false && ishashinurl==true || ishashindb==true && locallystoredhash != "null"){				//If the hash already exist in database.
				if (confirm("You already have a saved version!")) {
	Timer.stopTimer();
	timeUsed = Timer.score;
	stepsUsed = ClickCounter.score;

	if (querystring['highscoremode'] == 1) {	
		score = Timer.score;
	} else if (querystring['highscoremode'] == 2) {
		score = ClickCounter.score;
	}

	// Loop through all bits
	bitstr="";
	
	bitstr += " " + document.getElementById("H0").innerHTML;
	bitstr += " " + document.getElementById("H1").innerHTML;
	bitstr += " " + document.getElementById("H2").innerHTML;
	bitstr += " " + document.getElementById("H3").innerHTML;
	bitstr += " " + document.getElementById("H4").innerHTML;
	bitstr += " " + document.getElementById("H5").innerHTML;
	
	bitstr+=" "+window.screen.width;
	bitstr+=" "+window.screen.height;
	
	bitstr += " " + window.innerWidth;
	bitstr += " " + window.innerHeight;
	
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

	// Loop through all bits
	bitstr="";
	
	bitstr += " " + document.getElementById("H0").innerHTML;
	bitstr += " " + document.getElementById("H1").innerHTML;
	bitstr += " " + document.getElementById("H2").innerHTML;
	bitstr += " " + document.getElementById("H3").innerHTML;
	bitstr += " " + document.getElementById("H4").innerHTML;
	bitstr += " " + document.getElementById("H5").innerHTML;
	
	bitstr+=" "+window.screen.width;
	bitstr+=" "+window.screen.height;
	
	bitstr += " " + window.innerWidth;
	bitstr += " " + window.innerHeight;
	
	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
			}
		}
	});
}

function reset()
{
	if(confirm("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.")){
		Timer.stopTimer();
		Timer.score=0;
		Timer.startTimer();
		ClickCounter.initialize();

		document.getElementById('H0').innerHTML="0";
		document.getElementById('H1').innerHTML="0";
		document.getElementById('H2').innerHTML="0";
		document.getElementById('H3').innerHTML="0";
		document.getElementById('H4').innerHTML="0";
		document.getElementById('H5').innerHTML="0";
	} else {
		
	}
}

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		document.getElementById('duggaStats').style.display = "block";
	}
	document.getElementById('feedbackBox').style.display = "none";

	var p = jQuery.parseJSON(param.replace(/\*/g, '"'));
	document.getElementById('fargnamn').innerHTML = p['colorname'];
	document.getElementById('fargen').setAttribute("src", "templates/color_" + p['color'] + ".png");
	
	// Add our previous answer
	if (uanswer != null){
		var previous = uanswer.split(' ');
		if (previous.length >= 9){
			document.getElementById('H0').innerHTML=previous[4];
			document.getElementById('H1').innerHTML=previous[5];
			document.getElementById('H2').innerHTML=previous[6];
			document.getElementById('H3').innerHTML=previous[7];
			document.getElementById('H4').innerHTML=previous[8];
			document.getElementById('H5').innerHTML=previous[9];
		}
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
	
if (previous.length >= 9) {
		const color = "#" + previous[4] + previous[5] + previous[6] + previous[7] + previous[8] + previous[8];
		const fouterElems = document.getElementsByClassName('fouter');
		for (let i = 0; i < fouterElems.length; i++) {
			fouterElems[i].style.background = color;
		}
	}		
}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------

//----------------------------------------------------------------------------------
// hexClick: Display HEX-values to select
//----------------------------------------------------------------------------------

function hexClick(divid)
{
	ClickCounter.onClick();

	const dw = window.innerWidth;

	const elem = document.getElementById(divid);
	const dpos = elem.getBoundingClientRect(); 
	const dwid = elem.offsetWidth;
	const dhei = elem.offsetHeight;
	bw=Math.round(dwid*1.50);
	if(bw<180) bw=180;	
	
	lpos=dpos.left;
	popclass="arrow-top";

	if((lpos+bw)>dw){
			popclass="arrow-topr";
			lpos=lpos-bw+dwid;
	}
	 
	var hh=(dhei*2);
	if(hh<160) hh=160;
	hh+="px";
	
	const pop = document.getElementById("pop");

	pop.style.display =  "block";
	
	const topOffset = elem.offsetTop + elem.offsetHeight -50;

	pop.style.top = topOffset + "px";
	pop.style.left = lpos + "px";
	pop.style.width = bw + "px";
	pop.style.height = hh;

	pop.classList.remove("arrow-topr");
	pop.classList.remove("arrow-top");
	pop.classList.add(popclass);

	
	hc=divid;
}

//----------------------------------------------------------------------------------
// hexClick: Set the actual selected HEX-value
//----------------------------------------------------------------------------------

function setval(sval)
{
	if(hc!=null){
		const target = document.getElementById(hc);
		if (target) {
			target.innerHTML = sval;
		}	
	}

	const pop = document.getElementById("pop");
	if (pop) {
		pop.style.display = "none";
	}}


//----------------------------------------------------------------------------------
// //functionality for opening and closing hexcode input boxes
//----------------------------------------------------------------------------------

document.addEventListener('click', function(e){
	var pop = document.getElementById('pop');
	if(e.target.classList.contains("hexo")){ 
		if(pop.style.display === "block" && e.target === activehex){
			pop.style.display = "none";
		}else{
			pop.style.display = "block";
		}
		activehex = e.target;
	}else{
		activehex = undefined;
		pop.style.display = "none";
	}
});

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------


