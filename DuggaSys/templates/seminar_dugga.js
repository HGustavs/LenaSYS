//
var inParams = "UNK";
var elapsedTime = 0;

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	inParams = parseGet();
	makeForm("Inl1Document","pdf");
	makeForm("Inl1ZipDocument","zip");
//	makeForm("Inl3Document","multi");

	AJAXService("GETPARAM", { }, "PDUGGA");
}

function returnedDugga(data) 
{	

	document.getElementById("content").style.position = "relative";
	document.getElementById("content").style.top = "50px";
	
	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		duggaParams = JSON.parse(data['param']);
		duggaFiles = data['files'];

		if (duggaFiles.length > 0){

		} else {
			// No files uploaded.
		}

		findfilevers(data["files"], "Inl1Document","pdf");
		findfilevers(data["files"], "Inl1ZipDocument","zip");
//		findfilevers(data["files"], "Inl3Document","multi");

		if (data["answer"] == null || data["answer"] !== "UNK") {

			// We have previous answer

		}


	}
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

function saveClick() 
{
	Timer.stopTimer();

	timeUsed = Timer.score;
	stepsUsed = ClickCounter.score;

	score = 0;

	var bitstr = "Submitted";

	bitstr += ",T " + elapsedTime;

	bitstr += " " + window.screen.width;
	bitstr += " " + window.screen.height;

	bitstr += " " + $(window).width();
	bitstr += " " + $(window).height();

	// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
	saveDuggaResult(bitstr);
}

function showFacit(param, uanswer, danswer, userStats, files, moment)
{
	if (userStats != null){	
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];
		document.getElementById("duggaStats").style.display = "block";
	}

	document.getElementById("content").style.position = "relative";
	document.getElementById("content").style.top = "50px";

	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		duggaParams = JSON.parse(param);
		duggaFiles = data['files'];

		if (duggaFiles.length > 0){

		} else {
			alert("No files uploaded");
		}

		findfilevers(data["files"], "Inl1Document","pdf");
		findfilevers(data["files"], "Inl1ZipDocument","zip");
//		findfilevers(data["files"], "Inl3Document","multi");

		if (data["answer"] == null || data["answer"] !== "UNK") {

			// We have previous answer

		}


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

function registerForSeminar()
{
	var uname = document.getElementById('input_uname').value;	// Get username from input
	if(uname == ""){	// Invalid username - more restrictions may be necessary
		//alert("Please enter a valid username");	// alert() doesn't seem to work for some reason
		confirm("Please enter a valid username");
	} else {	// Register user
		if(confirm("Register " + uname + " for seminar?")){
			document.getElementById('input_prompt').style.display = 'none'; // Hide input to avoid duplicate entries

			/*
				To-do:
				* Enter username into database?
				* Register entire group?
				* Save pdf file to group?
			*/

			document.getElementById("confirm_text").innerHTML = uname + " registered successfully!";	// Provide confirmation to user
		}
	}
}