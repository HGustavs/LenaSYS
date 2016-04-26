
/********************************************************************************
	 Globals
*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;
var rProbe = null;
var needMarking=0;
var passedMarking=0;

var amountPassed = [];
var savedAmount = [];
var count = 0;

AJAXService("GET", { cid : querystring['cid'] }, "RESULT");

$(function() 
{
	$("#release").datepicker({ dateFormat : "yy-mm-dd" });
	$("#deadline").datepicker({ dateFormat : "yy-mm-dd" });
});

//----------------------------------------
// Commands:
//----------------------------------------

function gradeDugga(e, gradesys, cid, vers, moment, uid, mark, ukind){
		console.log(e);
		
		closeWindows();
	
		var pressed = e.target.className;
	
		if (pressed === "Uc"){
				changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "Gc") {
				changeGrade(2, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "GVc"){// Seems to work.
				changeGrade(3, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "U") {
				changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "3c") {
				changeGrade(4, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "4c") {
				changeGrade(5, gradesys, cid, vers, moment, uid, mark, ukind);
		} else if (pressed === "5c") {
				changeGrade(6, gradesys, cid, vers, moment, uid, mark, ukind);
		}
		else if (event.ctrlKey && pressed === "VGh") {
				changeGrade(3, gradesys, cid, vers, moment, uid, mark, ukind);
				AJAXService("CHFAILS",{ cid : cid, moment : moment,vers : vers, luid : uid}, "RESULT");
		}
		else {
			//alert("This grading is not OK!");
		}
	
}

function makeImg(gradesys, cid, vers, moment, uid, mark, ukind,gfx,cls){
	return "<img style=\"width:24px;height:24px\" src=\""+gfx+"\" id=\"grade-"+moment+"-"+uid+"\" class=\""+cls+"\" onclick=\"gradeDugga(event,"+gradesys+","+cid+","+vers+","+moment+","+uid+","+mark+",'"+ukind+"');\" title='Grade this'/>";
}


function makeSelect(gradesys, cid, vers, moment, uid, mark, ukind) 
{	
		var str = "";

		// Irrespective of marking system we allways print - and U
		if (mark === null || mark === 0){
				str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uc.svg","Uc");			
		} else if (mark === 1) {
				str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/U.svg","U");			
		} else {
				str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uh.svg","Uh");			
		}
	
		// Gradesystem: 1== UGVG 2== UG 3== U345
		if (gradesys === 1) {
			if (mark === 2){
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.svg","G");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGh.svg","VGh");			
			} else if (mark === 3) {
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gh.svg","Gh");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VG.svg","VG");			
			} else {
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.svg","Gc");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGc.svg","GVc");			
			}
		} else if (gradesys === 2) {
				if (mark === 2){
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.svg","G");			
				} else {
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.svg","Gc");			
				}
		} else if (gradesys === 3){
			if (mark === 4){
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/3.svg","3");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/4h.svg","4h");
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/5h.svg","5h");
			} else if (mark === 5) {
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/3h.svg","3h");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/4.svg","4");
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/5h.svg","5h");
			} else if (mark === 6){
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/3h.svg","3h");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/4h.svg","4h");
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/5.svg","5");
			} else {
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/3c.svg","3c");			
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/4c.svg","4c");
					str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/5c.svg","5c");
			}
		} else {
			//alert("Unknown Grade System: "+gradesys);
		}
	
		return str;
}

function hoverResult(cid, vers, moment, firstname, lastname, uid, submitted, marked) 
{
		$("#Nameof").html(firstname + " " + lastname + " - Submitted: " + submitted + " Marked: " + marked);
		
		// Start counting pixels
		msx = -1;
		msy = -1;

		AJAXService("DUGGA", { cid : cid, vers : vers, moment : moment, luid : uid }, "RESULT");
}

function clickResult(cid, vers, moment, firstname, lastname, uid, submitted, marked, foundgrade, gradeSystem, lid) 
{
		$("#Nameof").html(firstname + " " + lastname + " - Submitted: " + submitted + " Marked: " + marked);
		console.log("course: "+ cid, " vers: " + vers + " moment: " + moment + " uid: " + uid);
		console.log("gs "+gradeSystem+ " cid: " + querystring['cid'] + " cvers: " + querystring['coursevers']);
		var menu = "<div class='' style='width:100px;display:block;'>";
		menu +=	"<div class='loginBoxheader'>";
		menu += "<h3>Grade</h3>";
		menu += "</div>";
		menu += "<table>";
		menu += "<tr><td>";
		if (foundgrade === null && submitted === null) {
			menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "I");
		}else if (foundgrade !== null){
			menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "U");													
		}else {
			menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "U");
		}
		menu += "</td></tr>";
		menu += "</table>";
		menu += "</div> <!-- Menu Dialog END -->";
		document.getElementById('markMenuPlaceholder').innerHTML=menu;
		AJAXService("DUGGA", { cid : cid, vers : vers, moment : moment, luid : uid, coursevers : querystring['coursevers'] }, "RESULT");
}

function changeGrade(newMark, gradesys, cid, vers, moment, uid, mark, ukind) 
{
		AJAXService("CHGR", { cid : cid, vers : vers, moment : moment, luid : uid, mark : newMark, ukind : ukind }, "RESULT");
}
//call to unlock a dugga
function unlockDugga(cid, moment, vers, uid){
	AJAXService("CHFAILS",{ cid : cid, moment : moment,vers : vers, luid : uid}, "RESULT");
}

/*function moveDist(e) 
{
		mmx = e.clientX;
		mmy = e.clientY;
	
		if (msx == -1 && msy == -1) {
			msx = mmx;
			msy = mmy;
		} else {
			// Count pixels and act accordingly
			if ((Math.abs(mmx - msx) + Math.abs(mmy - msy)) > 16) {
				$("#resultpopover").css("display", "none");
				closeFacit();
				document.getElementById('MarkCont').innerHTML="";
			}
		}
}*/

function enterCell(thisObj)
{
		rProbe=$(thisObj).css('background-color');
		if(rProbe!="transparent"){
				if(rProbe=="rgb(248, 232, 248)"){
						cliffton="rgb(208,192,208)";
				}else if(rProbe=="rgb(221, 255, 238)"){
						cliffton="rgb(181,215,168)";		
				}else if(rProbe=="rgb(255, 255, 221)"){
						cliffton="rgb(215,215,181)";		
				}else if(rProbe=="rgb(255, 238, 221)"){
						cliffton="rgb(215,198,181)";		
				}else if(rProbe=="rgb(255, 255, 255)"){
						cliffton="rgb(215,215,215)";
				}else if(rProbe=="rgb(255, 170, 170)"){
						cliffton="rgb(229,153,153)";	
				}else{
						cliffton="#FFF";
				}
		
				$(thisObj).css('background-color',cliffton);
		}
}

function leaveCell(thisObj)
{
		if(rProbe!==null&&rProbe!=="transparent") $(thisObj).css('backgroundColor',rProbe);		
}


//----------------------------------------
// Sort results
//----------------------------------------
function orderResults(moments)
{
	var arr = [];
	var currentMomentIndex=0;
	arr[currentMomentIndex] = [];
	var currentMoment=null;
	for(var i=0; i < moments.length;i++){
		if(moments[i].kind === 3 && moments[i].moment === null){
			// Standalone dugga
			arr[currentMomentIndex] = moments[i];
			currentMomentIndex++;
			alert("Added standalone");
		} else if (moments[i].kind === 4 && moments[i].moment !== null){
			if (currentMoment === null){
				// Moment : first or same as previous
				arr[currentMomentIndex].push(moments[i]);
				currentMoment = moments[i].moment;
			} else if (currentMoment === moments[i].moment) {
				arr[currentMomentIndex].push(moments[i]);
			}else {
				// Moment : new
				currentMomentIndex++;
				currentMoment = moments[i].moment;
				arr[currentMomentIndex] = [];
				arr[currentMomentIndex].push(moments[i]);
			}
		} else if (moments[i].kind === 3 && moments[i].moment !== null){
				arr[currentMomentIndex].push(moments[i]);
		}
	}
	return arr;
}

//----------------------------------------
// Render Result Table Header
//----------------------------------------
function renderResultTableHeader(data)
{
		var str = "<thead>"
		str += "<tr><th id='needMarking' style='text-align:right;'></th>";
		for (var i = 0; i < data.length; i++) {
				if ((data[i][0].kind === 3 && data[i][0].moment === null) || (data[i][0].kind === 4)) {
					str += "<th style='border-left:2px solid white;'>";
					str += data[i][0].entryname;
					str += "</th>";
				}
		}
		str += "</tr></thead>";
		return str;
}

//----------------------------------------
// Render the total amount of succeeded
//----------------------------------------

function renderResultTableFooter()
{
		var str = ""
		str += "<tr><th id='hasMarking' style='text-align:center;'></th>";
		for (var i = 0; i < amountPassed.length; i++) {
					str += "<th style='border-left:2px solid white;'>";
					str += amountPassed[i];
					str += "</th>";
		}
		str += "</tr>";
		return str;
}

//----------------------------------------
// Render Moment
//----------------------------------------
function renderMoment(data, userResults, userId, fname, lname, locked)
{
	var str = "";
	// Each of the section entries (i.e. moments)
	for ( var j = 0; j < data.length; j++) {
			count=j;
			amountPassed[count]=0;
			str += "<td style='padding:0px;'>";
			
			// There are results to display.
			str += "<table width='100%' class='markinginnertable' >";
			str += "<tr>";
	
			if (data[j][0].kind === 3 && data[j][0] === null){
					//str += renderStandaloneDugga(data[j][0], userResults);
	
			} else if (data[j][0].kind === 4 && data[j][0] !== null) {

						str += renderMomentChild(data[j][0], userResults, userId, fname, lname, 1,locked);
						str += "</tr><tr>";
				for (var k = 1; k < data[j].length; k++){
					//only show moments that are visible in the sectionlist
					if(data[j][k]['visible'] === 1)
						str += renderMomentChild(data[j][k], userResults, userId, fname, lname, 0, locked);
						//console.log(data[j][k]);
				}			
			} else {
					alert("Malformed data!");
			}
			str += "</tr>";
			str += "</table>";
			str += "</td>";

			savedAmount[count]+=amountPassed[count];
			amountPassed[count]=savedAmount[count];
	}
	return str;

}

//----------------------------------------
// Render Standalone Dugga
//----------------------------------------
function renderStandaloneDugga(data, userResults)
{
	var foundgrade = null;
	var useranswer = null;
	var submitted = null;
	var marked = null;
	var variant = null;
	var studres = result[userId];

	if (studres !== null) {
		for (var l = 0; l < studres.length; l++) {
			var resultitem = studres[l];
			if (resultitem['moment'] === data.lid) {
				// There is a result to print
				foundgrade = resultitem['grade'];
				useranswer = resultitem['useranswer'];
				submitted = resultitem['submitted'];
				marked = resultitem['marked'];
				variant = resultitem['variant'];
				
				if(submitted!==null) {
					var t = submitted.split(/[- :]/);
					submitted=new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				}
				if(marked!==null) {
					var tt = marked.split(/[- :]/);
					marked=new Date(tt[0], tt[1]-1, tt[2], tt[3], tt[4], tt[5]);
				}
			}
		}
	}

	
	/*
	zstr = "";
	
	
	if (foundgrade === null && useranswer === null && submitted === null) {
		zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], null, "I");
	} else if (foundgrade !== null) {
		zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], foundgrade, "U");								
	}
	else {
		zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], null, "U");	
	}
	
	// Fist ... if no result is found i.e. No Fist
	if(useranswer!==null){
			zstr += "<img id='korf' style='padding-left:8px;margin-top:4px;' src='../Shared/icons/FistV.svg' onmouseover='hoverResult(\"" + querystring['cid'] + "\",\"" + querystring['coursevers'] + "\",\"" + moment['lid'] + "\",\"" + user['uid'] + "\",\"" + user['firstname'] + "\",\"" + user['lastname'] + "\");' />";
	}

	// If no submission,  white. 
	// If submitted and not marked or resubmitted U, yellow. 
	// If G or better, green. 
	// If U, pink. 
	// If visited but not saved, lilac
	if(foundgrade===1){
			yomama="background-color:#fed";							
	}else if(foundgrade>1){
			yomama="background-color:#dfe";							
	}else if(variant!==null&&useranswer===null){
			yomama="background-color:#F8E8F8";														
	}else if((useranswer!==null&&foundgrade===null)||(foundgrade!==null&&submitted>marked)){
			yomama="background-color:#ffd";		
			needMarking++;					
	}else{
			yomama="background-color:#fff";														
	}
	
	// Standalone Dugga -- we just need to make a dugga entry with the correct marking system.
	str += "<td style='"+yomama+"'>&nbsp;</td></tr><tr  style='border-top:2px solid #dbd0d8;' >";

	str += "<td style='"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>"+zstr;

	str += "</td>";
	*/	
}


//----------------------------------------
// Render Moment child
//----------------------------------------
function renderMomentChild(dugga, userResults, userId, fname, lname, moment, locked)
{
		var str = "";
		var foundgrade = null;
		var useranswer = null;
		var submitted = null;
		var marked = null;
		var variant = null;
		var lock = false;

		if (userResults !== undefined) {
				for (var l = 0; l < userResults.length; l++) {
						
						var resultitem = userResults[l];
						if (resultitem.moment === dugga.lid) {
								// There is a result to print
								foundgrade = resultitem.grade;
								useranswer = resultitem.useranswer;
								submitted = resultitem.submitted;
								marked = resultitem.marked;
								variant = resultitem.variant;

								//If lock is not null loop through them and see if there is a match
								if (locked !== null) {
									for (var i = 0; i < locked.length; i++) {
										//if a match, set lock to true
										if (locked[i]['uid'] == userId && resultitem.moment == locked[i]['moment']) {
											lock = true;
										}
									}
								}
								
								if(submitted!==null) {
									var t = submitted.split(/[- :]/);
									submitted=new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
								}
								if(marked!==null) {
									var tt = marked.split(/[- :]/);
									marked=new Date(tt[0], tt[1]-1, tt[2], tt[3], tt[4], tt[5]);
								}
						}
				}
		}

		
		var zttr="";
		if (moment){
			zttr += '<div style="display:inline-block;min-width:95px">'
		} else {
			zttr += '<div style="min-width:95px">'		
		}

		// If no result is found i.e. No Fist
		if (foundgrade === null && useranswer === null && submitted === null) {
			zttr += makeSelect(dugga.gradesystem, querystring['cid'], querystring['coursevers'], dugga.lid, userId, null, "I");
		}else if (foundgrade !== null){
			zttr += makeSelect(dugga.gradesystem, querystring['cid'], querystring['coursevers'], dugga['lid'], userId, foundgrade, "U");													
		}else {
			zttr += makeSelect(dugga['gradesystem'], querystring['cid'], querystring['coursevers'], dugga['lid'], userId, null, "U");
		}
		if(useranswer!==null){

			zttr += "<img id='korf' style='width:24px;height:24px;float:right;margin-right:8px;' src='../Shared/icons/FistV.svg' onclick='clickResult(\"" + querystring['cid'] + "\",\"" + querystring['coursevers'] + "\",\"" + dugga.lid + "\",\"" + fname + "\",\"" + lname + "\",\"" + userId + "\",\"" + submitted + "\",\"" + marked + "\",\"" + foundgrade + "\",\"" + dugga.gradesystem + "\",\"" + dugga["lid"] + "\");' />";

		}
		if(lock == true){
			zttr += "<img id='korf' style='width:24px;height:24px;float:right;margin-right:8px;' src='../Shared/icons/duggaLock.svg' title='Unlock " + dugga['entryname'] + "' onclick='unlockDugga(\"" + querystring['cid'] + "\",\"" + dugga.lid + "\",\"" + querystring['coursevers'] + "\",\"" + userId + "\");' />";
		}

		zttr += '</div>'
		// If no submission - white. If submitted and not marked or resubmitted U - yellow. If G or better, green. If U, pink. visited but not saved lilac
		if(foundgrade===1 && submitted<marked){
				yomama="background-color:#faa";							
		}else if(foundgrade>1){
				yomama="background-color:#dfe";
				passedMarking++;
				amountPassed[count]++;							
		}else if(variant!==null&&useranswer===null){
				yomama="background-color:#F8E8F8";															
		}else if((useranswer!==null&&foundgrade===null)||(foundgrade===1&&submitted>marked)||(useranswer!==null&&foundgrade===0)){
				yomama="background-color:#ffd";							
				needMarking++;
		}else{
				yomama="background-color:#fff";														
		}
		if (moment){
			str += "<td style='border-left:2px solid #dbd0d8;"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);' colspan='0'>";
		} else {
			str += "<td style='border-left:2px solid #dbd0d8;"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>";
		}
		str += "<div style=\"display:inline-block; overflow:hidden;\">"+dugga['entryname'] + "</div> ";
		str +=zttr;
		str += "</td>";
		return str;
}

//----------------------------------------
// Renderer
//----------------------------------------
function returnedResults(data) 
{
		var str = "";
		var zstr = "";
		var ttr = "";
		var zttr = "";
		needMarking=0;
		passedMarking=0;
		var amountPassed = [];
		var x = 0;
		var y = 0;
		//get user locks
		var locked = data['locked'];

		if (data['dugganame'] !== "") {
				$.getScript(data['dugganame'], function() {
					$("#MarkCont").html(data['duggapage']);
		
					//alert(data['duggaparam']+"\n"+data['useranswer'] + "\n" + data['duggaanswer']);
					//console.log(data['duggastats']);
					showFacit(data['duggaparam'],data['useranswer'],data['duggaanswer'], data['duggastats'], data['files']);
				});
				$("#resultpopover").css("display", "block");
				//alert(data['duggaanswer']);
		} else {
	
				results = data['results'];
 				m = orderResults(data['moments']);
 				//Creating the drop down list so you can filter different versions
				str += "<span>Filter course version: </span>";
 				str += "<select id='selectDisplayVersion'>";
 				//For each item in versions we print out an option. The IF indicates the current course version.
 				$.each(data['versions'], function(i,e){
 					if(e.cid == querystring['cid'] && e.vers == querystring['coursevers'])
 						str += "<option value='"+querystring['coursevers']+"' selected >"+querystring['coursevers']+"</option>";
 					else if(e.cid == querystring['cid'])
 						str += "<option value='"+e.vers+"'>"+e.vers+"</option>";
 				});
 				str += "</select>";
				str += "<table class='markinglist'>";
				str += renderResultTableHeader(m);
				// Sets every entry of savedAmount to 0, so it can interact properly with amountPassed in renderMoment.
				for ( k = 0; k < m.length; k++) {
					savedAmount[k]=0;
				}

				if (data['entries'].length > 0) {
						for ( i = 0; i < data['entries'].length; i++) {
								var user = data['entries'][i];
								str += "<tr class='fumo'>";

								// One row for each student
								str += "<td>";
								str += user['firstname'] + "<br/>" + user['lastname'] + "<br/>" + user['username'] + "<br/>" + user['ssn'];
								str += "</td>";
								str += renderMoment(m, results[user['uid']], user['uid'], user['firstname'], user['lastname'], locked);
								str += "<td>";
								str += "Total passed: " + passedMarking;
								str += "</td>";
								passedMarking=0;
								str += "</tr>";
						}
				}
				str += renderResultTableFooter();

				//wait with setting the html value until the document has loaded, this avoids the frequent blank screen
				$(function(){
					var slist = document.getElementById("content");
					slist.innerHTML = str;
					document.getElementById("needMarking").innerHTML = "Students: " + data['entries'].length + "<BR />Unmarked : " + needMarking;
					document.getElementById("hasMarking").innerHTML = "Passed grades:";	
				});
				
		}
		if (data['debug'] !== "NONE!") alert(data['debug']);
}
