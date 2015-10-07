/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 NB! This dugga requires a png-file corresponding to the specific colors, e.g., color_red.png
	 Param: {*color*:*red*,*colorname*:*Röd*}
	 Answer: Variant

-------------==============######## Documentation End ###########==============-------------
*/

//----------------------------------------------------------------------------------
// Globals
//----------------------------------------------------------------------------------

var dw,dpos,dwid,dhei,bw,lpos,popclass;
var hc=null;

//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
	// Add eventhandler for click to all
	// buttons that have the class 'hexo'
	$('.hexo').click(function(){
		hexClick(this.id);
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
			console.log(ClickCounter.score);
		}
		ClickCounter.showClicker();
	}
	
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['param']=="UNK"){
			alert("UNKNOWN DUGGA!");
	}else{
		retdata=jQuery.parseJSON(data['param']);
		$("#fargnamn").html(retdata['colorname']);
		$("#fargen").attr("src", "templates/color_"+retdata['color']+".png");
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
}

//----------------------------------------------------------------------------------
// saveClick: Save the dugga and get a receipt
//----------------------------------------------------------------------------------

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
	
	bitstr+=" "+$("#H0").html();
	bitstr+=" "+$("#H1").html();
	bitstr+=" "+$("#H2").html();
	bitstr+=" "+$("#H3").html();
	bitstr+=" "+$("#H4").html();
	bitstr+=" "+$("#H5").html();
	
	bitstr+=" "+window.screen.width;
	bitstr+=" "+window.screen.height;
	
	bitstr+=" "+$(window).width();
	bitstr+=" "+$(window).height();
	
	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");
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
}

function showFacit(param, uanswer, danswer, userStats)
{
	document.getElementById('duggaTime').innerHTML=userStats[0];
	document.getElementById('duggaTotalTime').innerHTML=userStats[1];
	document.getElementById('duggaClicks').innerHTML=userStats[2];
	document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
	$("#duggaStats").css("display","block");
	
	var p = jQuery.parseJSON(param.replace(/\*/g, '"'));
		
	$("#fargnamn").html(p['colorname']);
	$("#fargen").attr("src", "templates/color_"+p['color']+".png");
	
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
	
	$('.fouter').css("background","#"+previous[4]+previous[5]+previous[6]+previous[7]+previous[8]+previous[8]);
		
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

	dw=$(window).width();
	dpos=$("#"+divid).position();
	dwid=$("#"+divid).width();
	dhei=$("#"+divid).height();
	bw=Math.round(dwid)*2.0;
	if(bw<128) bw=128;
	
	lpos=dpos.left;
	
	popclass="arrow-top";
	if((lpos+bw)>dw){
			popclass="arrow-topr";
			lpos=lpos-bw+dwid;
	}
	 
	var hh=(dhei*2);
	if(hh<160) hh=160;
	hh+="px";
	
	$("#pop").css({top: (dpos.top+dhei+10), left:lpos, width:bw,height:hh,display:"block"})
	$("#pop").removeClass("arrow-topr");
	$("#pop").removeClass("arrow-top");
	$("#pop").addClass(popclass);
	
	hc=divid;
}

//----------------------------------------------------------------------------------
// hexClick: Set the actual selected HEX-value
//----------------------------------------------------------------------------------

function setval(sval)
{
	if(hc!=null){
		$("#"+hc).html(sval);		
	}
	$("#pop").css({display:"none"})
}

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------
function toggleInstructions()
{
    $(".instructions-content").slideToggle("slow");
}
