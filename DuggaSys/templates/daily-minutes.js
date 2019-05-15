/********************************************************************************

   Documentation

*********************************************************************************

Use daily-minutes as template when creating the dugga in the test editor. 
Add custom instructions via the variant parameters. Example parameters:
{"type":"html","filelink":"daily-minutes-instructions.html","submissions":
[{"type":"timesheet","fieldname":"timesheet","instruction":"Fyll i din aktivitet i projektet"}]}

Data is saved to the timesheet table in the database, and to DuggaSys/submissions/cid/vers/duggaid/user/.

-------------==============######## Documentation End ###########==============-------------
*/

//------------==========########### GLOBALS ###########==========------------


//------------==========########### STANDARD MANDATORY FUNCTIONS ###########==========------------

function setup()
{
	inParams = parseGet();
	window.addEventListener('resize', () => {
		var windowWidth = $(window).innerWidth();
		if(windowWidth > 850){
			createFileUploadArea(duggaParams["submissions"]);		
		} 
		if(windowWidth <= 850){
			createSmallerViewportForm(duggaParams["submissions"]);		
		}
	})
	AJAXService("GETPARAM", { }, "PDUGGA");
}

function newRow() {
	var tsTableBody = document.getElementById("tsTableBody");
	var tblRows = tsTableBody.childNodes;
	var lastRow = tblRows[tblRows.length - 1];
	var lastRowID = lastRow.attributes[1].value;
	var splitID = lastRowID.split("_");
	var lastRowIdx = parseInt(splitID[1]) + 1;
	var inputRows = document.getElementsByClassName("tsInputRow");
	var str = "";

	for (var i = 0; i < inputRows.length; i++) {
		var row = tblRows[i];
		var rowID = row.attributes[1].value;
		var splitID = rowID.split("_");
		var idx = parseInt(splitID[1]);

		str += "<tr class='tsInputRow' id=tsTableRow_"+idx+"><td>";
		var inputValue = document.getElementById("tsDate_"+idx).value;
		str += "<input id='tsDate_"+idx+"' required type='date' name='tsDate_"+idx+"' value='"+inputValue+"' /></td>";
		inputValue = document.getElementById("tsType_"+idx).value;
		str += "<td><select id='tsType_"+idx+"' required name='tsType_"+idx+"'>";
		if (inputValue === "issue") {
			str += generateTimeSheetOptions(inParams["cid"], inParams["moment"], 0);
		} else {
			str += generateTimeSheetOptions(inParams["cid"], inParams["moment"], 1);
		}
		str += "</select></td>";
		inputValue = document.getElementById("tsRef_"+idx).value;
		str += "<td><input id='tsRef_"+idx+"' required type='number' name='tsRef_"+idx+"' style='width: 55px' value='"+inputValue+"' /></td>";
		inputValue = document.getElementById("tsComment_"+idx).value;
		str += "<td><input id='tsComment_"+idx+"' class='tsCommentColumn' required type='text' name='tsComment_"+idx+"' style='width: 90%' value='"+inputValue+"' /></td>";
		if (idx > 0) {
			str += "<td class='tsTableDeleteCell' onclick='deleteRow("+idx+")'><img src='../Shared/icons/Trashcan.svg'></td>";
		}
	}
	str += "<tr class='tsInputRow' id=tsTableRow_"+lastRowIdx+"><td>";
	str += "<input id='tsDate_"+lastRowIdx+"' required type='date' name='tsDate_"+lastRowIdx+"' /></td>";
	str += "<td><select id='tsType_"+lastRowIdx+"' required name='tsType_"+lastRowIdx+"'>";
	str += generateTimeSheetOptions(inParams["cid"], inParams["moment"], 0);
	str += "</select></td>";
	str += "<td><input id='tsRef_"+lastRowIdx+"' required type='number' name='tsRef_"+lastRowIdx+"' style='width: 55px' /></td>";
	str += "<td><input id='tsComment_"+lastRowIdx+"' class='tsCommentColumn' required type='text' name='tsComment_"+lastRowIdx+"' style='width: 90%' /></td>";
	str += "<td class='tsTableDeleteCell' onclick='deleteRow("+lastRowIdx+")'><img src='../Shared/icons/Trashcan.svg'></td>";

	tsTableBody.innerHTML = str;
}

function deleteRow(row) {
	var tsTableBody = document.getElementById("tsTableBody");
	var row = document.getElementById("tsTableRow_"+row);
	tsTableBody.removeChild(row);
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

		var windowWidth = $(window).innerWidth();
		var duggaFiles = data["files"][inParams["moment"]];
		if($("#submitButtonTable").length != 0) {
			if(windowWidth > 850){
				createFileUploadArea(duggaParams["submissions"]);		
			} 
			if(windowWidth <= 850){
				createSmallerViewportForm(duggaParams["submissions"]);		
			}
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

//--------------------================############================--------------------
//                                  Local Functions
//--------------------================############================--------------------

function createFileUploadArea(params){
	var str ="";
	var form = "";
	var fieldname = "timesheet";
	if (params) {
		fieldname = params[0].fieldname;
	}

	form +="<form enctype='multipart/form-data' method='post' action='filereceive_dugga.php'>";
	form +="<table class='tsTable'><thead>";
	form +="<th>Date</th><th>Type</th>";
	form +="<th>Reference</th><th>Comment</th></thead>";	
	form +="<tbody id='tsTableBody'><tr class='tsInputRow' id='tsTableRow_0'>";
	form +="<td><input id='tsDate_0' required type='date' name='tsDate_0' /></td>";
	form +="<td><select id='tsType_0' required name='tsType_0'>";
	form += generateTimeSheetOptions(inParams["cid"], inParams["moment"], 0);
	form +="</select></td>";
	form +="<td><input id='tsRef_0' type='number' required name='tsRef_0' style='width: 55px' /></td>";
	form +="<td class='tsCommentColumn'><input id='tsComment_0' type='text' required name='tsComment_0' style='width: 90%' /></td>";
	form +="</tr></tbody>";
	form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
	form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
	form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
	form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
	form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
	form +="<input type='hidden' name='field' value='"+fieldname+"' />";
	form +="<input type='hidden' name='kind' value='3' />";
	form +="<tfoot><td colspan='4'>";
	form +="<span class='newRowButton' onclick='newRow()'>Add row</span>";
	form +="</td></tfoot></table>";
	form +="<input id='tsSubmit' type='submit' value='Upload' /></form>";
	str += "<div style='border:1px solid #614875; margin: 5px auto; margin-bottom:10px;'>";
	str += "<div id='"+fieldname+"Instruction' style='height:20px;background-color:#614875;padding:9px;color:#FFF;'>";
	str += "</div>";
	str += "<div>";
	str += form;
	str += "</div>";
	str += "</div>";
	str +="<div id='"+fieldname+"Prev' style='height:100px;overflow:scroll;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'><span style='font-style:italic;M'>Submission History</span></div>";
	str += "</div>";

	document.getElementById("tomten").innerHTML=str;
}

function createSmallerViewportForm(params){
	var str ="";
	var form = "";
	var fieldname = "timesheet";
	if (params) {
		fieldname = params[0].fieldname;
	}

	form +="<form enctype='multipart/form-data' method='post' action='filereceive_dugga.php'>";
	form +="<div id='smallerViewportForm'>";
	form +="<table class='tsTable'>";
	form +="<tbody id='tsTableBody'><tr class='tsInputRow' id='tsTableRow_0'>";
	form +="<div id='smallerViewportLabel'><label>Date</label></div>";
	form +="<div id='datePicker'><input class='tsSmallInput' required type='date' name='tsDate_0' /></div>";
	form +="<div id='smallerViewportLabel'><label>Type</label></div>";
	form +="<div id='type'><select class='tsSmallInput' id='smallerViewportSelect' required name='tsType_0'>";
	form += generateTimeSheetOptions(inParams["cid"], inParams["moment"], 0);
	form +="</select></div>";
	form +="<div id='smallerViewportLabel'><label>Reference</label></div>";
	form +="<div id='reference'><input class='tsSmallInput' type='number' required name='tsRef_0'/></div>";
	form +="<div id='smallerViewportLabel'><label>Comment</label></div>";
	form +="<div id='comment'><input class='tsSmallInput' type='text' required name='tsComment_0'/>";
	form +="</tr></tbody>";
	form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
	form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
	form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
	form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
	form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
	form +="<input type='hidden' name='field' value='"+fieldname+"' />";
	form +="<input type='hidden' name='kind' value='3' />";
	form +="<tfoot><td colspan='4'>";
	form +="</td></tfoot></table>";
	form += "</div>";
	form +="<input id='smallerViewportUploadButton' type='submit' value='Upload' /></form>";
	str += "<div style='border:1px solid #614875; margin: 5px auto; margin-bottom:10px;'>";
	str += "<div id='"+fieldname+"Instruction' style='height:20px;background-color:#614875;padding:9px;color:#FFF;'>";
	str += "</div>";
	str += "<div>";
	str += form;
	str += "</div>";
	str += "</div>";
	str +="<div id='"+fieldname+"Prev' style='height:100px;overflow:scroll;background:#f8f8ff;border-radius:8px;box-shadow: 2px 2px 4px #888 inset;padding:4px;'><span style='font-style:italic;M'>Submission History</span></div>";
	str += "</div>";

	document.getElementById("tomten").innerHTML=str;
}