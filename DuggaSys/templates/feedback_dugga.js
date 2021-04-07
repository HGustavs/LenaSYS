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
		$("#submitButtonTable").hide();
		if(duggaParams["type"]==="pdf"){
				document.getElementById("snus").innerHTML="<embed src='showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"' width='100%' height='800px;' type='application/pdf'>";
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
			document.getElementById("snus").innerHTML="<iframe src='"+filename+"' width='100%' height='800px' type='application/pdf'></iframe>"; 
		}else {
			// UNK 
		}

		var linkeddugga=duggaParams["linkeddugga"];
		for (var duggas in data["files"]) {
		    // skip loop if the property is from prototype
		    if (!data["files"].hasOwnProperty(duggas)) continue;
		
				if (duggas == parseInt(linkeddugga)){
					
					for (var i=0;i<data["files"][duggas].length;i++){
						//alert(data["files"][duggas][i]);
						var obj = data["files"][duggas][i];
						if (obj["fieldnme"]==duggaParams["reportField"]){
							//alert(obj["filepath"]+obj["filename"]+obj["seq"]+"."+obj["extension"]);
							var filepath=obj["filepath"];
							var filename=obj["filename"];
							var fileseq=obj["seq"];
							var fileext=obj["extension"];
							$("#linkedreport").html("<embed src=\""+filepath+filename+fileseq+"."+fileext+"\" width=\"100%\" height=\"100%\" type=\"application/pdf\" style=\"min-height:800px;\"/>" );
							$("#feedback-header").html("Feedback on "+filename+" submitted: "+ obj["updtime"]);
							$("#report-header").html(filename+" submitted: "+ obj["updtime"]);
						}
					}					
				}
		}


    /*
    for (){
			if (duggaParams["reportField"]===)
    $("#linkedreport").html(<embed src="'+filepath+filename+fileseq+'.'+fileext+'" width="100%" height="100%" type="application/pdf" /> ) 
    }
		*/
		//alert(linkeddugga);

		var duggaFiles = data["files"][inParams["moment"]];

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

		if (data["answer"] == null || data["answer"] !== "UNK") {

			// We have previous answer

		}
		// Teacher feedback
		if (data["feedback"] == null || data["feedback"] === "" || data["feedback"] === "UNK") {
				// No feedback
		} else {
      	var feedbackArr = data["feedback"].split("||");
        var fb="";
        if (feedbackArr.length > 1){
            fb="<table style='width:100%;border:1px solid #000;table-layout:fixed'><caption>Previous feedback</caption><thead><tr><th></th></tr></thead><tbody>";
    				for (var k=feedbackArr.length-1;k>=0;k--){
      					var fb_tmp = feedbackArr[k].split("%%");
      					if (k==feedbackArr.length-1){						
      						fb="<pre style='width:98%;padding:2px;white-space:pre-wrap'>"+fb_tmp[1]+"</pre>"+fb;
      					} else {
      						fb+="<tr><td><pre style='margin-left:6px;white-space:pre-wrap;color:rgba(0,0,0,0.5)'>"+fb_tmp[1]+"</pre></td></tr>";						
      					}
    				} 
    				fb += "</tbody></table>";          
        } else if (feedbackArr.length == 1){
            var fb_tmp = feedbackArr[0].split("%%");
            fb="<pre style='width:98%;padding:2px;white-space:pre-wrap'>"+fb_tmp[1]+"</pre>"
        }
				document.getElementById('tomten').innerHTML = fb;
				$("#showFeedbackButton").css("display","block");					
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

function showFacit(param, uanswer, danswer, userStats, files, moment, feedback)
{
	if (userStats != null && userStats!==undefined && userStats !== ""){
      if (userStats[1] != 0 && userStats[3] != 0){
          document.getElementById('duggaTime').innerHTML=userStats[0];
      		document.getElementById('duggaTotalTime').innerHTML=userStats[1];
      		document.getElementById('duggaClicks').innerHTML=userStats[2];
      		document.getElementById('duggaTotalClicks').innerHTML=userStats[3];	
      		$("#duggaStats").css("display","block");	      
      }
	}

	inParams = parseGet();

	if (param == "UNK") {
		alert("UNKNOWN DUGGA!");
	} else {
		duggaParams = jQuery.parseJSON(param);
		if(duggaParams["type"]==="pdf"){
				document.getElementById("snus").innerHTML="<embed src='showdoc.php?cid="+inParams["cid"]+"&fname="+duggaParams["filelink"]+"' width='100%' height='800px' type='application/pdf'>";
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
			document.getElementById("snus").innerHTML="<iframe src='"+filename+"' width='100%' min-height='800px' type='application/pdf'></iframe>"; 
		}else {
			// UNK 
		}
		$("#snus").parent().find(".instructions-content").slideToggle("slow");

		var duggaFiles = [];
		if (moment != null) {
			duggaFiles = files[moment];
		} 
		var linkeddugga=duggaParams["linkeddugga"];
		for (var duggas in files) {
		    // skip loop if the property is from prototype
		    if (!files.hasOwnProperty(duggas)) continue;
		
				if (duggas == parseInt(linkeddugga)){
					
					for (var i=0;i<files[duggas].length;i++){
						var obj = files[duggas][i];
						if (obj["fieldnme"]==duggaParams["reportField"]){
							//alert(obj["filepath"]+obj["filename"]+obj["seq"]+"."+obj["extension"]);
							var filepath=obj["filepath"];
							var filename=obj["filename"];
							var fileseq=obj["seq"];
							var fileext=obj["extension"];
							$("#linkedreport").html("<embed src=\""+filepath+filename+fileseq+"."+fileext+"\" width=\"100%\" height=\"800px\" type=\"application/pdf\" />" );
							$("#feedback-header").html("Feedback on "+filename+" submitted: "+ obj["updtime"]);
							$("#report-header").html(filename+" submitted: "+ obj["updtime"]);
						}
					}					
				}
		}
/*
		createFileUploadArea(duggaParams["submissions"]);
		for (var k=0; k < duggaParams["submissions"].length; k++){
			findfilevers(duggaFiles, duggaParams["submissions"][k].fieldname,duggaParams["submissions"][k].type, 1);
    		if (duggaParams['uploadInstruction'] !== null){
				document.getElementById(duggaParams["submissions"][k].fieldname+"Instruction").innerHTML=duggaParams["submissions"][k].instruction;
			}

		}
*/
		// ----------------========#############========----------------
		// This is in show facit marking view NOT official running version!
		// ----------------========#############========----------------
/*
		for (var version=0; version < duggaFiles.length;version++){				
				if (duggaFiles[version].kind == "3"){
					if (document.getElementById(duggaFiles[version].fieldnme+"Text") != null){
					 		document.getElementById(duggaFiles[version].fieldnme+"Text").innerHTML=duggaFiles[version].content;					
					}
				}
		}			
*/
		// Bring up the feedback tools
		document.getElementById('markMenuPlaceholder').style.display = "block";
//		document.getElementById('markSaveButton').style.display = "block";
// Teacher feedback

var fb = "<textarea id='newFeedback'></textarea><div class='feedback-info'>* grade to save feedback.</div><table class='list feedback-list'><caption>Previous feedback</caption><thead><tr><th>Date</th><th>Feedback</th></tr></thead><tbody>";
if (feedback !== undefined && feedback !== "UNK" && feedback !== ""){
	var feedbackArr = feedback.split("||");
	for (var k=feedbackArr.length-1;k>=0;k--){
		var fb_tmp = feedbackArr[k].split("%%");
		fb+="<tr><td style='border-right:2px dotted #aaa;padding-right:6px'>"+fb_tmp[0]+"</td><td><pre style='white-space:pre-wrap;'>"+fb_tmp[1]+"</pre></td></tr>";
	} 		
}
fb += "</tbody></table>";
if (document.getElementById('tomten')){
		document.getElementById('tomten').innerHTML = fb;
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
