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
var response;
//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
	//Iterates through all bit buttons and adds eventlisteners
	document.querySelectorAll('.bit').forEach(bit => {
		bit.addEventListener("click", function(){
			bitClick(bit.id);
		});
	});

	////Iterates through all hexa buttons (dropdowns) and adds eventlisteners
	document.querySelectorAll('.hexo').forEach(hexa => {
		hexa.addEventListener("click", function(){
			hexClick(hexa.id);
		});
	})

	AJAXService("GETPARAM",{ },"PDUGGA");
}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data)
{	
	response=data;
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['opt']=="SAVDU"){
		//document.getElementById('submission-receipt').innerHTML=`${data['duggaTitle']}\n\nDirect link (to be submitted in canvas)\n${data['link']}\n\nHash\n${data['hash']}\n\nHash password\n${data['hashpwd']}`);
		//showReceiptPopup();
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
			console.log("data", data)
			console.log("parameteras", data['param'])
			retdata=JSON.parse(data['param']);
			document.getElementById("talet").innerHTML=retdata['tal'];
			// Add our previous answer
			console.log(data['answer']);
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
				if(response.danswer!="UNK"){
					showFacit(response.param, response.answer, response.danswer, null, null, null, null)
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
		if(document.getElementById("lockedDuggaInfo")){
			document.getElementById("content")
			.insertBefore(document.getElementById("lockedDuggaInfo"), document.getElementById("content"));
		}
		displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);
}

//--------------------================############================--------------------
//                                  Master Functions
//--------------------================############================--------------------


function saveClick()
{
	//document.getElementById('submission-receipt').innerHTML=`${response['duggaTitle']}\n\nDirect link (to be submitted in canvas)\n${response['link']}\n\nHash\n${response['hash']}\n\nHash password\n${response['hashpwd']}`);
	showReceiptPopup();
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
	document.querySelectorAll(".bit").forEach(function(bit){
		bitstr=bitstr+bit.innerHTML;
	});
	
	bitstr+=" "+document.getElementById("H0").innerHTML;
	bitstr+=" "+document.getElementById("H1").innerHTML;
	
	bitstr+=" "+screen.width;
	bitstr+=" "+screen.height;
	
	bitstr+=" "+window.width;
	bitstr+=" "+window.height;
	
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
		document.getElementById("duggaStats").style.display="block";
	}
	var p = jQuery.parseJSON(param);
	var daJSON = jQuery.parseJSON(danswer);
	
	var da = daJSON['danswer'];
	var danswer = da.split(' ');
	
	document.getElementById("talet").innerHTML=p['tal'];
	
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

		if (danswer[0][i-1] == document.getElementById("B"+(8-i)).innerHTML){
			document.getElementById("B"+(8-i)).style.background="green";
			document.getElementById('B'+(8-i)).innerHTML+= " == " + danswer[0][i-1];
			
		} else {
			document.getElementById("B"+(8-i)).style.background="red";
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

	var div = document.getElementById(divid);

	//Changes bit buttons from 1 to 0 and vice versa
	if(div.innerHTML==="1"){
			div.innerHTML="0";
			div.classList.remove("ett");
			div.classList.add("noll");
	}else{
			div.innerHTML="1";
			div.classList.add("ett");
			div.classList.remove("noll");
	}
	document.querySelector(".submit-button").classList.remove("btn-disable");
}

function hexClick(divid)
{
	if (typeof ClickCounter != 'undefined') ClickCounter.onClick();

	//Get position of clicked button
	dw=window.innerWidth;
	var element=document.getElementById(divid);
	var dpos=element.getBoundingClientRect();

	dwid=document.getElementById(divid).Width;
	dhei=document.getElementById(divid).Height;
	bw=Math.round(dwid)*1.10;
	if(bw<200) bw=200;	// Ensure minimum width of the HEX-box
	
	lpos=dpos.left;
	
	popclass="arrow-top";
	if((lpos+bw)>dw){
			popclass="arrow-topr";
			lpos=lpos-bw+dwid;
	}
	 
	var hh=(dhei*2);
	if(hh<200) hh=200;
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
		document.getElementById("pop").style.display="none";
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
function toggleInstructions()
{
	if(document.querySelector(".instructions-content").style.display==="block"){
		document.querySelector(".instructions-content").style.display="none";
	}
	else{
		document.querySelector(".instructions-content").style.display="block"
	}
}

function toggleFeedback()
{
	if(document.querySelector(".feedback-content").style.display==="block"){
		document.querySelector(".feedback-content").style.display="none";
	}
	else{
		document.querySelector(".feedback-content").style.display="block"
	}
}
