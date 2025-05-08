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

//----------------------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------------------

function setup()
{
		AJAXService("GETPARAM",{ },"PDUGGA");
}

//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data)
{
	dataV = data;
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
	
	  if(data['debug']!="NONE!") alert(data['debug']);

		if(data['param']=="UNK"){
				alert("UNKNOWN DUGGA!");
		}else{		
			retdata=jQuery.parseJSON(data['param']);
			data=null;
			$.ajax({
				method: "GET",
				url: "showdoc.php",
				data: { cid: retdata.cid, coursevers: retdata.coursevers, fname: retdata.fname }
			})
			.done(function( msg ) {
				document.getElementById('instructions').innerHTML = msg;
			});
		}		
		displayDuggaStatus(dataV["answer"],dataV["grade"],dataV["submitted"],dataV["marked"],dataV["duggaTitle"]);
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
    } else {
        
    } 

}

function showFacit(param, uanswer, danswer, userStats, files, moment)
{
	if (userStats != null){

	}
	var p = jQuery.parseJSON(param);
	var daJSON = jQuery.parseJSON(danswer);
	
}

function closeFacit(){

}

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------
