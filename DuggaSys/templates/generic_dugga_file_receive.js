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
var score = -1;
var elapsedTime = 0;

//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup() 
{
	inParams = parseGet();

	AJAXService("GETPARAM", { }, "PDUGGA");
}

function returnedDugga(data) 
{	
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
			var filename=duggaParams["filelink"];
			if(window.location.protocol === "https:"){
					filename=filename.replace("http://", "https://");
			}else{
					filename=filename.replace("https://", "http://");				
			}
			document.getElementById("snus").innerHTML="<iframe src='"+filename+"' width='100%' height='1000px' type='application/pdf'></iframe>"; 
		}else {
			// UNK 
		}

		var duggaFiles = data["files"][inParams["moment"]];
		if($("#submitButtonTable").length != 0) {
			createFileUploadArea(duggaParams["submissions"]);
			for (var k=0; k < duggaParams["submissions"].length; k++){
				findfilevers(duggaFiles, duggaParams["submissions"][k].fieldname,duggaParams["submissions"][k].type, 0);
	    		if (duggaParams['uploadInstruction'] !== null){
					document.getElementById(duggaParams["submissions"][k].fieldname+"Instruction").innerHTML=duggaParams["submissions"][k].instruction;
				}
	
			}
			if (typeof duggaFiles !== "undefined"){
				for (var version=0; version < duggaFiles.length;version++){				
					if (duggaFiles[version].kind == "3"){
						if (document.getElementById(duggaFiles[version].fieldnme+"Text") != null){
						 		document.getElementById(duggaFiles[version].fieldnme+"Text").innerHTML=duggaFiles[version].content;					
						}
					}
				}							
			}
		} else {
			var msg = "<div class='loginTransparent' id='lockedDuggaInfo' style='margin-bottom:5px;'>";
			msg+="<img src='../Shared/icons/duggaLock.svg'>";
			if (document.getElementById("loginbutton").className==="loggedin"){
				msg+="<p>Not registered to the course!<br>You can view the assignment but you need to be registered to the course to save your dugga result.</p>";				
			} else {
				msg+="<p>Not logged in!<br>You can view the assignment but you need to be logged in and registered to the course to save your dugga result.</p>";
				
			}
			msg+="</div>";
			
			document.getElementById("tomten").innerHTML=msg;
		}

		if (data["answer"] == null || data["answer"] !== "UNK") {

			// We have previous answer

		}


	}
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
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

function showFacit(param, uanswer, danswer, userStats, files, moment)
{
	if (userStats != null){
		document.getElementById('duggaTime').innerHTML=userStats[0];
		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
		document.getElementById('duggaClicks').innerHTML=userStats[2];
		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];		
		$("#duggaStats").css("display","block");
		$("#duggaStats").draggable({ handle:'.loginBoxheader'});
	}

	inParams = parseGet();

	if (param == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		duggaParams = jQuery.parseJSON(param);

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
			var filename=duggaParams["filelink"];
			if(window.location.protocol === "https:"){
					filename=filename.replace("http://", "https://");
			}else{
					filename=filename.replace("https://", "http://");				
			}
			document.getElementById("snus").innerHTML="<iframe src='"+filename+"' width='100%' height='1000px' type='application/pdf'></iframe>"; 
		}else {
			// UNK 
		}

		$("#snus").parent().find(".instructions-content").slideToggle("slow");

		var duggaFiles = [];
		if (moment != null) {
			duggaFiles = files[moment];
		} 

		createFileUploadArea(duggaParams["submissions"]);
		for (var k=0; k < duggaParams["submissions"].length; k++){
			findfilevers(duggaFiles, duggaParams["submissions"][k].fieldname,duggaParams["submissions"][k].type, 1);
    		if (duggaParams['uploadInstruction'] !== null){
				document.getElementById(duggaParams["submissions"][k].fieldname+"Instruction").innerHTML=duggaParams["submissions"][k].instruction;
			}

		}

		// ----------------========#############========----------------
		// This is in show facit marking view NOT official running version!
		// ----------------========#############========----------------

		for (var version=0; version < duggaFiles.length;version++){				
				if (duggaFiles[version].kind == "3"){
					if (document.getElementById(duggaFiles[version].fieldnme+"Text") != null){
					 		document.getElementById(duggaFiles[version].fieldnme+"Text").innerHTML=duggaFiles[version].content;					
					}
				}
		}			

		// Bring up the feedback tools
		document.getElementById('markMenuPlaceholder').style.display = "block";
//		document.getElementById('markSaveButton').style.display = "block";
	
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
				form +="<textarea rows='20' name='inputtext'  id='"+fieldname+"Text' style='-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;	width: 100%;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;' placeholder='Enter your text and upload.' onkeyup='disableSave();'></textarea>";
				form +="<input type='hidden' name='kind' value='3' />";
		}else{
				form +="<input name='uploadedfile[]' type='file' multiple='multiple' onchange='this.form.submit();'/>";
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
		
		str += "<div style='border:1px solid #614875; margin: 5px auto;'>";
		str += "<div class='loginBoxheader'>";
		if (type === "pdf"){
			str += "<h3>Pdf Submission and Preview</h3>";
		} else if (type === "link"){
			str += "<h3>Link Submission and Preview</h3>";
		} else if (type === "zip") {
			str += "<h3>Zip / Rar file Upload</h3>";
		} else if (type === "multi"){
			str += "<h3>Multiple file Upload</h3>";
		} else if (type === "text"){
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
		str += "</div>";
		str += "<div style='padding:5px;'>";
		str +="<div id='"+fieldname+"Instruction' style='font-style: italic;'></div>"
		str +="<div id='"+fieldname+"Prev' style='height:100px;overflow:scroll;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'>&lt;Submission history&gt;</div>";
		if (type !== "text"){	
			str +="New submission:<br/>"; 
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
		}
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

	}
	document.getElementById("tomten").innerHTML=str;	
}
