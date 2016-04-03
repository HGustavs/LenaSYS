/********************************************************************************

   Documentation 

*********************************************************************************

Example seed
---------------------
	 Example seed
	 Param: {"type":"pdf","filelink":"instructions.pdf", "submissions":[{"fieldname":"Inl1Document","type":"pdf"},{"fieldname":"Inl2Document","type":"zip", "instruction":"Zip your project folder and submit the file here."},{"fieldname":"Inl3Document","type":"multi", "instruction":"Upload all of your graphics, i.e., all the generated png and svg files."}]}
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
		}else if(duggaParams["type"]==="link"){
			document.getElementById("snus").innerHTML="<iframe src='"+duggaParams["filelink"]+"' width='100%' height='1000px' type='application/pdf'></iframe>"; 
		}else {
			// UNK 
		}

		duggaFiles = data['files'];
		
	  console.log(duggaFiles);
	

		if (duggaFiles.length > 0){

		} else {
			// No files uploaded.
		}

		createFileUploadArea(duggaParams["submissions"]);
		for (var k=0; k < duggaParams["submissions"].length; k++){
			findfilevers(data["files"], duggaParams["submissions"][k].fieldname,duggaParams["submissions"][k].type);
    		if (duggaParams['uploadInstruction'] !== null){
				document.getElementById(duggaParams["submissions"][k].fieldname+"Instruction").innerHTML=duggaParams["submissions"][k].instruction;
			}

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

		if(type=="link"){
				form +="<input name='link' type='text' size='40' maxlength='256' />";
				form +="<input type='hidden' name='kind' value='2' />";
		}else if(type=="text"){
				form +="<textarea rows='20' name='inputtext'  id='inputtext' style='-webkit-box-sizing: border-box; -moz-box-sizing: border-box;	box-sizing: border-box;	width: 100%;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;' >Fumho</textarea>";
				form +="<input type='hidden' name='kind' value='3' />";
		}else{
				form +="<input name='uploadedfile[]' type='file' multiple='multiple' />";
				form +="<input type='hidden' name='kind' value='1' />";
		}
		
		form +="<input type='submit' name='okGo' value='Upload'>";
		form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
		form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
		form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
		form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
		form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
		form +="<input type='hidden' name='field' value='"+fieldname+"' />";
		form +="</form>";
		
		if (type === "pdf"){
			str += "<div style='border:1px solid #614875; margin: 5px auto;'>";
			str += "<div class='loginBoxheader'>";
			str += "<h3>Pdf Submission and Preview</h3>";
			str += "</div>";
			str += "<div style='padding:5px;'>";
			str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
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
			str += "</div>";
			str += "</div>"
		} else if (type === "link"){
			str += "<div style='border:1px solid #614875; margin: 5px auto;'>";
			str += "<div class='loginBoxheader'>";
			str += "<h3>Link Submission and Preview</h3>";
			str += "</div>";
			str += "<div style='padding:5px;'>";
			str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
			str +="<div id='"+fieldname+"Prev' style='background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'>&lt;HTML Link Preview&gt;</div>";
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"File' style='margin:4px;' >No Link Uploaded</span>";
			str += "</td>";
			str += "<td>";
			str += "<span id='"+fieldname+"Date' style='margin:4px;' ></span>";
			str += "</td>";
			str += "</tr>";
			str += "</table>";
			str += "</div>"
			str += "</div>"			
		} else if (type === "zip") {
			str += "<div style='border:1px solid #614875'; margin: 5px auto;>";
			str += "<div class='loginBoxheader'>";
			str += "<h3>Zip / Rar file Upload</h3>";
			str += "</div>";
			str += "<div style='padding:5px;'>";
			str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
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
			str += "</div>"
			str += "</div>"
		} else if (type === "multi"){
			str += "<div style='border:1px solid #614875; margin: 5px auto;'>";
			str += "<div class='loginBoxheader'>";
			str += "<h3>Multiple file Upload</h3>";
			str += "</div>";
			str += "<div style='padding:5px;'>";
			str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
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
			str += "</div>"
			str += "</div>"
		} else if (type === "text"){
			str += "<div style='border:1px solid #614875; margin: 5px auto;'>";
			str += "<div class='loginBoxheader'>";
			str += "<h3>Text Submission</h3>";
			str += "</div>";
			str += "<div style='padding:5px;'>";
			str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
			str +="<table style='width:100%;'>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
			str += "</td>";
			str += "</tr>";
			str += "</table>";
			str += "</div>"
			str += "</div>"			
		}

	}
	document.getElementById("tomten").innerHTML=str;	
}