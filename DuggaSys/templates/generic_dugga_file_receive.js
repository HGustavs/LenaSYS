/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 Example seed
	 Param: {"type":"pdf","filelink":"instructions.pdf", "submissions":[{"fieldname":"Inl1Document","type":"pdf"},{"fieldname":"Inl2Document","type":"zip"},{"fieldname":"Inl3Document","type":"multi"}]}
	 Answer: 
-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------
var inParams = "UNK";
var elapsedTime = 0;

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
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
		duggaParams = jQuery.parseJSON(data['param']);
		
		if(duggaParams["type"]==="pdf"){
				document.getElementById("snus").innerHTML="<embed src=showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+" width='100%' height='1000px' type='application/pdf'>";
		}else if(duggaParams["type"]==="md"){
				document.getElementById("snus").innerHTML="";
		}else if (duggaParams["type"]==="html"){
				// Can we do this?
		}

		duggaFiles = data['files'];

		if (duggaFiles.length > 0){

		} else {
			// No files uploaded.
		}

		createFileUploadArea(duggaParams["submissions"]);

		for (var k=0; k < duggaParams["submissions"].length; k++){
			findfilevers(data["files"], duggaParams["submissions"][k].fieldname,duggaParams["submissions"][k].type);
		}

		if (data["answer"] == null || data["answer"] !== "UNK") {

			// We have previous answer

		}


	}
}

function reset()
{
	alert("This will remove everything and reset timers and step counters. Giving you a new chance at the highscore.");


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

	var bitstr = "Submitted";

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


	$("#content").css({"position":"relative","top":"50px"});

	dataV = data;
	
	if (data['debug'] != "NONE!") { alert(data['debug']); }

	if (data['param'] == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		duggaParams = jQuery.parseJSON(param);

		if(duggaParams["type"]==="pdf"){
				document.getElementById("snus").innerHTML="<embed src=showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+" width='100%' height='1000px' type='application/pdf'>";
		}else if(duggaParams["type"]==="md"){
				// Can we do this?
		}else if (duggaParams["type"]==="html"){
				// Can we do this?
		}	

		duggaFiles = data['files'];

		if (duggaFiles.length > 0){

		} else {
		}

		findfilevers(data["files"], "Inl1Document","pdf");
		findfilevers(data["files"], "Inl2Document","zip");
		findfilevers(data["files"], "Inl3Document","multi");

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

function createFileUploadArea(fileuploadfileds){
	var str ="";
	for (var l = 0; l < fileuploadfileds.length; l++){

		var type = fileuploadfileds[l].type;
		var fieldname = fileuploadfileds[l].fieldname;

		var form = "";
		form +="<form enctype='multipart/form-data' method='post' action='filereceive_dugga.php' >";
		form +="<input name='uploadedfile[]' type='file' multiple='multiple' />";
		form +="<input type='submit' name='okGo' value='Upload'>";
		form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
		form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
		form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
		form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
		form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
		form +="<input type='hidden' name='field' value='"+fieldname+"' />";
		form +="<input type='hidden' name='kind' value='1' />";
		form +="</form>";
		
		if (type === "pdf"){
			str +="Pdf Preview:<br/>"; 
			str +="<div id='"+fieldname+"Prev' style='background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'>&lt;PDF Preview&gt;</div>";
			str +="Pdf Upload:<br/>"; 
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"File' style='margin:4px;' >No file uploaded</span>";
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"Date' style='margin:4px;' ></span>";
			str += "</td>";
			str += "</tr>";
			str += "</table>";
		} else if (type === "zip") {
			str +="Zip / Rar file upload:<br/>"; 
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"File' style='margin:4px;' >No file uploaded</span>";
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"Date' style='margin:4px;' ></span>";
			str += "</td>";
			str += "</tr>";
			str += "</table>";
		} else if (type === "multi"){
			str +="<div id='"+fieldname+"Prev' style='background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'>&lt;Multilist preview&gt;</div>";
			str +="Multiple File Upload:<br/>"; 
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"File' style='margin:4px;' ></span>";
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"Date' style='margin:4px;' ></span>";
			str += "</td>";
			str += "</tr>";
			str += "</table>";
		}

	}
	document.getElementById("tomten").innerHTML=str;	
}