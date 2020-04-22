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
	    		if (duggaParams["submissions"][k].instruction && duggaParams["submissions"][k].fieldname){
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

		if (duggaFiles && duggaFiles.length > 0){
			for (var l=0; l<data["files"].length; l++){
				if (data["files"][l].kind == "3"){
					if (document.getElementById(data["files"][l].fieldnme+"Text") != null) document.getElementById(data["files"][l].fieldnme+"Text").value=data["files"][l].content;
				}
			}
		} else {
			// No files uploaded.
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
				form +="<textarea rows='15' name='inputtext'  id='"+fieldname+"Text' style='-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;	width: 80%;background:#f8f8ff;padding:10px;margin-bottom:10px;border: 2px solid #e8e6e6;' placeholder='Enter your text and upload.' onkeyup='disableSave();'></textarea><br>";
				form +="<input type='hidden' name='kind' value='3' />";
		}else if(type=="pdf"){
        // special type for pdf to have accept = .pdf
				form +="<input name='uploadedfile[]' type='file' id='inputfile" + l + "' class='inputfile' accept='.pdf' multiple='multiple' onchange='this.form.submit();'/>";
        form +="<label for='inputfile" + l + "'><img src='../Shared/icons/file-upload-icon.png' width='15px' height='15px' style='padding-left:5px; padding-right: 5px;'/> Choose files&#160;&#160;</label>&#160;&#160;";
				form +="<input type='hidden' name='kind' value='1' />";
		} else if(type == "zip"){
      // special type for zip to have accept = .zip and .rar
      form +="<input name='uploadedfile[]' type='file' id='inputfile" + l + "' class='inputfile' accept='.zip,.rar' multiple='multiple' onchange='this.form.submit();'/>";
      form +="<label for='inputfile" + l + "'><img src='../Shared/icons/file-upload-icon.png' width='15px' height='15px' style='padding-left:5px; padding-right: 5px;'/> Choose files&#160;&#160;</label>&#160;&#160;";
      form +="<input type='hidden' name='kind' value='1' />";
    } else {
      form +="<input name='uploadedfile[]' type='file' id='inputfile" + l + "' class='inputfile' multiple='multiple' onchange='this.form.submit();'/>";
      form +="<label for='inputfile" + l + "'><img src='../Shared/icons/file-upload-icon.png' width='15px' height='15px' style='padding-left:5px; padding-right: 5px;'/> Choose files&#160;&#160;</label>&#160;&#160;";
      form +="<input type='hidden' name='kind' value='1' />";
    }

		form +="<input type='submit' name='okGo' id='okGo" + l + "' class='inputfile' value='Upload'>";
        form +="<label for='okGo" + l + "' style='padding-left:20px; padding-right:20px'>Upload</label>";
		form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
		form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
		form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
		form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
		form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";

		form +="<input type='hidden' name='field' value='"+fieldname+"' />";
		form +="</form>";

		//---------------------------------------------------------------------------------------------------
		// Error  <-- If the file uploaded has the wrong file extension, display an error message
		//---------------------------------------------------------------------------------------------------
		var error = "";
		error +="<div id='fileerror" + l + "' class='err err-extension'>";
		error +="<span>Bummer!</span>";
		error +=" The extension "+inParams["extension"]+" is not allowed!</div>";

		str += "<div style='border:1px solid #614875; margin: 5px auto; margin-bottom:10px;'>";
		str += "<div style='height:20px;background-color:#614875;padding:9px;color:#FFF;'>";
		if (type === "pdf"){
			str += "<h4>Pdf Submission and Preview</h4>";
		} else if (type === "link"){
			str += "<h4>Link Submission and Preview</h4>";
		} else if (type === "zip") {
			str += "<h4>Zip / Rar file Upload</h4>";
		} else if (type === "multi"){
			str += "<h4>Multiple file Upload</h4>";
		} else if (type === "text"){
			str += "<h4>Text Submission</h4>";
			str += "</div>";
            str +="<div id='"+fieldname+"Prev' style='min-height:100px;background:#f8f8ff;padding:10px;border-top:2px 2px solid #d3d3d3;border-bottom:2px 2px solid #d3d3d3;'><span style='font-style:italic;M'>Submission History</span></div>";
			str += "<div style='padding:10px;'>";
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
		str += "<div>";
		if (type !== "text"){
            str +="<div id='"+fieldname+"Prev' style='min-height:100px;background:#f8f8ff;padding:10px;border-top:2px 2px solid #d3d3d3;border-bottom:2px 2px solid #d3d3d3;'><span style='font-stile:italic;'>Submission History</span></div>";
            str +="<div style='padding:10px;'>";
            str +="<h4>Instructions</h4>";
            str +="<div id='"+fieldname+"Instruction' style='font-style: italic;padding:0px;'></div>"
            str +="<br />";
			str +="<h4>New submission</h4>";
			str +="<table>";
			str +="<tr>";
			str +="<td id='"+fieldname+"'>";
			str += form;
		}
		str += "</td>";
//      Until I can figure out what these do, except mess with the design, I'll have them commented, for the sake of the design
//		str += "<td>";
//		str += "<span id='"+fieldname+"File' style='margin:4px;' ></span>";
//		str += "</td>";
//		str += "<td>";
//		str += "<span id='"+fieldname+"Date' style='margin:4px;' ></span>";
//		str += "</td>";
//		str += "</tr>";
		str += "</table>";

		if (inParams["extension"] != null && fieldname === inParams["fieldtype"]) {	// Print out an error if the file extension is wrong. Null means the file extension is allowed.
			str += error;
		}

        str += "</div>";
		str += "</div>";
		str += "</div>";

	}
	document.getElementById("tomten").innerHTML=str;
}
