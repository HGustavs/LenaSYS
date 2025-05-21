/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	Param:  {"tal":"2"}
	Answer: {"danswer":"00000010 0 2"}

-------------==============######## Documentation End ###########==============-------------
*/


//----------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------

var retdata=null;
var hc=null;
var score = -1;
var activehex;
//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
		document.querySelectorAll('.bit').forEach(function(bitNode) {
			bitNode.addEventListener('click', function() {
				bitClick(this.id);
			});
		});

		document.querySelectorAll('.hexo').forEach(function(hexoNode){
			hexoNode.addEventListener('click', function(){
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
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['opt']=="SAVDU"){
		document.getElementById('submission-receipt').innerHTML =`${data['duggaTitle']}\n\nDirect link (to be submitted in canvas)\n
			${data['link']}\n\nHash\n
			${data['hash']}\n\nHash password\n
			${data['hashpwd']}`
		;
		showReceiptPopup();
	}

	Timer.startTimer();
	ClickCounter.initialize();
	if(querystring['highscoremode'] == 1) {
		if(data['score'] > 0){
			Timer.score = data['score'];
		}
		Timer.showTimer();
	} else if (querystring['highscoremode'] == 2) {
		if(data['score'] > 0){
			ClickCounter.score = data['score'];
			//console.log(ClickCounter.score);
		}
		ClickCounter.showClicker();
	}
	if(data['param']=="UNK"){
			alert("UNKNOWN DUGGA!");
	}else{		
		retdata=jQuery.parseJSON(data['param']);
		document.getElementById('talet').innerHTML=retdata['tal'];
		// Add our previous answer
		if(data['answer'] != null && data['answer'] != "UNK"){
			resetBitstring();
			var previous = data['answer'].split(' ');
			if (previous.length >= 4){
				var bitstring = previous[3];
				var hexvalue1 = previous[4];
				var hexvalue2 = previous[5]; 
			}			
			// NB: LSB is now on the highest string index
			for (var i=bitstring.length;i>=0;i--){
				if (bitstring[i]==1){
					bitClick("B"+(7-i));
					//console.log("B"+(7-i)+":"+bitstring[i]);
				}				
			}
			document.getElementById('H0').innerHTML=hexvalue1;
			document.getElementById('H1').innerHTML=hexvalue2;
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
			document.getElementById('showFeedbackButton').style.display='none';
	}
	document.querySelector("#content").appendChild(document.querySelector("#submitButtonTable"));
	document.querySelector("#content").appendChild(document.querySelector("#lockedDuggaInfo"));

	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);
}

//--------------------================############================--------------------
//                                  Master Functions
//--------------------================############================--------------------


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

	// Loop through all bits
	bitstr="";
	document.querySelectorAll(".bit").forEach(function(bitEl){
		bitstr=bitstr+bitEl.innerHTML;
	});

	bitstr+=" "+document.getElementById("H0").innerHTML;
	bitstr+=" "+document.getElementById("H1").innerHTML;

	bitstr+=" "+screen.width;
	bitstr+=" "+screen.height;

	bitstr+=" "+window.innerWidth;
	bitstr+=" "+window.innerHeight;
	
	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function reset()
{
	if(confirm("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.")){
		Timer.stopTimer();
		Timer.score=0;
		Timer.startTimer();
		ClickCounter.initialize();

		resetBitstring();
		document.getElementById('H0').innerHTML="0";
		document.getElementById('H1').innerHTML="0";
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
		document.getElementById('duggaStats').style.display="block";
	}
	var p = jQuery.parseJSON(param);
	var daJSON = jQuery.parseJSON(danswer);
	
	var da = daJSON['danswer'];
	var danswer = da.split(' ');
	
	document.getElementById('talet').innerHTML=p['tal'];
	
	// Add student answer
	if (uanswer === "UNK"){
		// For preview mode
		uanswer = "dummy dummy dummy 00000000 0 0";
	}
	var previous = uanswer.split(' ');
	if (previous.length >= 4){
		var bitstring = previous[3];
		var hexvalue1 = previous[4];
		var hexvalue2 = previous[5]; 
	}			
	resetBitstring();
	
	// NB: LSB is now on the highest string index
	for (var i=bitstring.length;i>=0;i--){
		if (bitstring[i]==1){
			bitClick("B"+(7-i));
		}				
	}
	
	// NB: LSB is now on the highest string index
	for (var i=danswer[0].length;i>0;i--){

		if (danswer[0][i-1]==1){
			// Set border around correct bits
			document.getElementById("B"+(8-i)).style.border = "4px dotted black";
		}								 

		if(danswer[0][i-1] == document.getElementById('B' +(8-i)).innerHTML){
			document.getElementById('B'+(8-i)).style.background="green";
			document.getElementById('B'+(8-i)).innerHTML+= " == " + danswer[0][i-1];
			
		} else {
			document.getElementById('B'+(8-i)).style.background="red";
			document.getElementById('B'+(8-i)).innerHTML+= " != " + danswer[0][i-1];					
		}
	}
	
	if (hexvalue1 == danswer[1]) {
		document.getElementById('H0').style.background = "green";
		document.getElementById('H0').innerHTML=hexvalue1 + " == "+danswer[1];
	} else {
		document.getElementById('H0').style.background = "red";
		document.getElementById('H0').innerHTML=hexvalue1 + " != "+danswer[1];			
	}
	if (hexvalue2 == danswer[2]) {
		document.getElementById('H1').style.background = "green";
		document.getElementById('H1').innerHTML=hexvalue2 + " == "+danswer[2];
	} else {
		document.getElementById('H1').style.background = "red";
		document.getElementById('H1').innerHTML=hexvalue2 + " != "+danswer[2];			
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

function closeFacit(){

}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------

function bitClick(divid)
{
	if (typeof ClickCounter != 'undefined') ClickCounter.onClick();
	if(document.getElementById(divid).innerHTML){
		document.getElementById(divid).innerHTML = "0";
		document.getElementById(divid).classList.remove("ett");
		document.getElementById(divid).classList.add("noll");
	}else{
		document.getElementById(divid).innerHTML = "1";
		document.getElementById(divid).classList.add("ett");
		document.getElementById(divid).classList.remove("noll");
	}
	document.querySelector(".submit-button").classList.remove("btn-disable");
}

function hexClick(divid){
	if (typeof ClickCounter != 'undefined') ClickCounter.onClick();

	dw=window.innerWidth;
	var element=document.getElementById(divid);
	var dpos=element.getBoundingClientRect();
	dwid=document.getElementById(divid).Width;
	dhei=document.getElementById(divid).Height;

	bw=Math.round(dwid)*1.10;
	if(bw<180) bw=180;	// Ensure minimum width of the HEX-box
	
	lpos=dpos.left;
	
	popclass="arrow-top";
	if((lpos+bw)>dw){
		popclass="arrow-topr";
		lpos=lpos-bw+dwid;
	}
	 
	var hh=(dhei*2);
	if(hh<160) hh=160;
	hh+="px";
	
//Style on dropdown
	document.getElementById("pop").style.top=(dpos.dhei+10) + "px";
	document.getElementById("pop").style.left=lpos + "px";
	document.getElementById("pop").style.width=bw + "px";
	document.getElementById("pop").styleheight=hh + "px";
	document.getElementById("pop").classList.remove("arrow-topr");
	document.getElementById("pop").classList.remove("arrow-top");
	document.getElementById("pop").classList.add(popclass);

	hc=divid;
	document.querySelector(".submit-button").classList.remove("btn-disable");
}

function setval(sval)
{
	if(hc!=null){	
		document.getElementById(hc).innerHTML=sval;	
	}
	document.getElementById('pop').style.display="none";
}

//functionality for opening and closing hexcode input boxes
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

function resetBitstring(){
	for (var i=0;i<8;i++){
		document.getElementById("B"+i).innerHTML="0";
		document.getElementById("B"+i).className="bit noll";		
	}
}

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------
function toggleInstructions(){
	const toggleInstruct = document.querySelector(".instructions-content");	
	toggleInstruct.classList.toggle("hidden");
}

function toggleFeedback(){
	const toggleFeed = document.querySelector(".feedback.content");
	toggleFeed.classList.toggle("hidden");
}