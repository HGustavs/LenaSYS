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


//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup()
{
	inParams = parseGet();
	AJAXService("GETPARAM", { }, "PDUGGA");
	createFileUploadArea();
}

function newRow() {
	var tsTableBody = document.getElementById("tsTableBody");
	var tblRows = tsTableBody.childNodes;
	var lastRowIdx = parseInt(tblRows[tblRows.length - 1].attributes[0].value);
	var idx = lastRowIdx += 1;

	/* Must use appendChild here to preserve user input
	   when adding a new row */

	var row = document.createElement("tr");
	var cell = document.createElement("td");
	var input = document.createElement("input");
	var select = document.createElement("select");
	var option = document.createElement("option");

	row.setAttribute("data-idx", idx);

	input.setAttribute("type", "date");
	input.setAttribute("name", "tsDate_"+idx);
	cell.setAttribute("style", "padding: 5px 10px 5px 10px");
	cell.appendChild(input);
	row.appendChild(cell);

	cell = document.createElement("td");
	select.setAttribute("name", "tsType_"+idx);
	option.setAttribute("value", "issue");
	option.innerHTML = "Issue";
	select.appendChild(option);
	option = document.createElement("option");
	option.setAttribute("value", "pullrequest");
	option.innerHTML = "Pull request";
	select.appendChild(option);
	cell.setAttribute("style", "padding: 5px 10px 5px 10px");
	cell.appendChild(select);
	row.appendChild(cell);

	cell = document.createElement("td");
	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "tsRef_"+idx);
	input.setAttribute("style", "width: 50px");
	cell.setAttribute("style", "padding: 5px 10px 5px 10px");
	cell.appendChild(input);
	row.appendChild(cell);

	cell = document.createElement("td");
	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("name", "tsComment_"+idx);
	input.setAttribute("style", "width: 500px");
	cell.setAttribute("style", "padding: 5px 10px 5px 10px");
	cell.appendChild(input);
	row.appendChild(cell);

	cell = document.createElement("td");
	cell.innerHTML = "X";
	cell.setAttribute("style", "background: #ff3f4c; cursor: pointer");
	row.appendChild(cell);
	cell.addEventListener('click', function () {
		tsTableBody.removeChild(row);
	});
	tsTableBody.appendChild(row);
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

function createFileUploadArea(){
	var str ="";
	var form = "";

	form +="<form enctype='multipart/form-data' method='post' action='filereceive_dugga.php'>";
	form +="<table class='tsTable'><thead>";
	form +="<th>Datum</th><th>Issue/Pull Request</th>";
	form +="<th>Nummer</th><th>Kommentar</th></thead>";	
	form +="<tbody id='tsTableBody'><tr data-idx=0>";
	form +="<td><input required type='date' name='tsDate_0' /></td>";
	form +="<td><select required name='tsType_0'>";
	form +="<option value='issue'>Issue</option><option value='pullrequest'>Pull request</option>";
	form +="</select></td>";
	form +="<td><input type='number' required name='tsRef_0' style='width: 55px' /></td>";
	form +="<td><input type='text' required name='tsComment_0' style='width: 500px' /></td>";
	form +="</tr></tbody>";
	form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
	form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
	form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
	form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
	form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
	form +="<input type='hidden' name='field' value='timesheet' />";
	form +="<input type='hidden' name='kind' value='3' />";
	form +="<tfoot><td colspan='4'>";
	form +="<span class='newRowButton' onclick='newRow()'>Lägg till rad</span>";
	form +="</td></tfoot></table>";
	form +="<input type='submit' value='Upload' /></form>";

	str += "<div style='border:1px solid #614875; margin: 5px auto; margin-bottom:10px;'>";
	str += "<div style='height:20px;background-color:#614875;padding:9px;color:#FFF;'>";
	str += "</div>";
	str += "<div>";
	str += form;
	str += "</div>";
	str += "</div>";
	str +="<div id='timesheetPrev' style='height:100px;overflow:scroll;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'><span style='font-style:italic;M'>Submission History</span></div>";
	str += "</div>";


	document.getElementById("tomten").innerHTML=str;
}
