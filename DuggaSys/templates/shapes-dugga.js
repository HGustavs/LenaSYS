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
var score = -1;
var retdata=null;
var hc=null;
var ctx;
var dta;
var bitarray=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var facitarray=[];


//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
	window.onresize = function(event) {
	    redrawgfx();
	};
	var canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

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
			console.log(ClickCounter.score);
		}
		ClickCounter.showClicker();
	}
	
	running=true;
	
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['param']=="UNK"){
		alert("UNKNOWN DUGGA!");
	}else{		
		dta=jQuery.parseJSON(data['param']);
		if (data['answer'] !== "UNK") {
			var previousAnswer = data['answer'].split(' ');
			bitarray=previousAnswer[3].split(',');
			for (var i=0;i<bitarray.length;i++) bitarray[i]=parseInt(bitarray[i]); 
		}
		document.getElementById('helptxt').innerHTML=dta[0].Text;
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
	}
	$("#submitButtonTable").appendTo("#content");
	$("#lockedDuggaInfo").prependTo("#content");
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
	if (running) {
		renderId = requestAnimationFrame(redrawgfx);
	} else {
		cancelAnimationFrame(renderId);
	}
	
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
	} else {
		score = 0;
	}
		
		// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
		saveDuggaResult(bitarray);
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");
	Timer.stopTimer();
	Timer.score=0;
	Timer.startTimer();
	ClickCounter.initialize();

	bitarray=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	facitarray = bitarray;
	redrawgfx();

}

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		$("#duggaStats").css("display","block");
		$("#duggaStats").draggable({ handle:'.loginBoxheader',axis: "y"});
	}
	var canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	dta = jQuery.parseJSON(param);
  document.getElementById('helptxt').innerHTML=dta[0].Text;
	if (uanswer !== "UNK") {
		var previousAnswer = uanswer.split(' ');
		bitarray=previousAnswer[3].split(',');
		for (var i=0;i<bitarray.length;i++) bitarray[i]=parseInt(bitarray[i]); 
	}
	if (danswer !== "UNK") {
		facitarray=danswer.split(',');
		for (var i=0;i<facitarray.length;i++) facitarray[i]=parseInt(facitarray[i]); 
	}

	redrawgfx();
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

function flipbit(bitno)
{
	if (typeof ClickCounter != 'undefined') ClickCounter.onClick();
	
	//bitno++;
	if(bitarray[bitno]==0){
		bitarray[bitno]=1;
	}else{
		bitarray[bitno]=0;        		
	}
	redrawgfx();
}

function fitToContainer() 
{
	// Make it visually fill the positioned parent
	
	divw = $("#content").width();
	if (divw < window.innerHeight) {
		ctx.width = divw;
		ctx.height = divw;
	} else {
		ctx.width = window.innerHeight - 270;
		ctx.height = ctx.width;
	}
	
}
	
//----------------------------------------------------------------------------------
// redraw shape
//----------------------------------------------------------------------------------
function redrawgfx()
{
	fitToContainer();
	if (facitarray.length<1) facitarray = bitarray;
	
	str="";
	for(var j=1;j<dta.length;j++){      			
		//ctx.beginPath();
		var fig=dta[j];
		for(var i=0;i<fig.length;i++){
			var item=fig[i];
			if(item.kind==0){
        /*
				if(j>1){
					if(bitarray[j]==0&&facitarray[j]==0){
						str+='" fill="white" ';
					}else if(bitarray[j]==1&&facitarray[j]==1){
						str+='" fill="lightgreen" ';		      									
					}else if(bitarray[j]==0&&facitarray[j]==1){
						str+='" fill="lightcoral" ';	      									
					}else if(bitarray[j]==1&&facitarray[j]==0){
						str+='" fill="red" ';						
					}
					str+=' stroke="blue" stroke-width="1.5px" />';
				} 
        */
				str+='<path onclick="flipbit('+j+');" d="';
				//ctx.moveTo(item.x1,item.y1);
				str+="M "+item.x1+" "+item.y1;
			}else if(item.kind==1){
				//ctx.lineTo(item.x1,item.y1);
				str+="L "+item.x1+" "+item.y1;
			}else if(item.kind==2){
				//ctx.quadraticCurveTo(item.x1,item.y1,item.x2,item.y2);
				str+="Q "+item.x1+" "+item.y1+" "+item.x2+" "+item.y2;
			}else if(item.kind==3){
				//ctx.bezierCurveTo(item.x1,item.y1,item.x2,item.y2,item.x3,item.y3);
				str+="C "+item.x1+" "+item.y1+" "+item.x2+" "+item.y2+" "+item.x3+" "+item.y3;
			}else if(item.kind==4){
				str+="<text id='"+item.txt+"handle' x='"+item.x1+"' y='"+item.y1+"' fill='black' font-family='Verdana' font-size='32px' fill='blue' >"+item.txt+"</text>";
			} else if (item.kind==5){
        str+=item.str;
      }
		}

		//ctx.stroke();

		if(item.kind!=4 && item.kind!=5){
			if(bitarray[j]==0&&facitarray[j]==0){
				str+='" fill="white" ';
			}else if(bitarray[j]==1&&facitarray[j]==1){
				str+='" fill="lightgreen" ';		      									
			}else if(bitarray[j]==0&&facitarray[j]==1){
				str+='" fill="lightcoral" ';	      									
			}else if(bitarray[j]==1&&facitarray[j]==0){
				str+='" fill="red" ';						
			}
			str+=' stroke="blue" stroke-width="1.5px" />';
		}

	}
  
	document.getElementById('foo').innerHTML=str;   
	document.getElementById('foo').setAttribute("height", ctx.height+"px");
	document.getElementById('foo').setAttribute("width", ctx.width+"px");
  
  // Add mouse over effect to highlight base shapes used in boolean operation dugga
  sels = document.getElementsByClassName('shape-legend');
  for(i=0; i<sels.length; i++) {
    sels[i].addEventListener('mouseover', function(e){e.target.setAttribute("opacity",1)}, false);
    sels[i].addEventListener('mouseout', function(e){e.target.setAttribute("opacity",0)}, false);
  }
  
  
}


//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------
function toggleInstructions()
{
	$(".instructions-content").slideToggle("slow");
}
