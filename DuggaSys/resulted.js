
/********************************************************************************
   Globals
*********************************************************************************/
var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;
var rProbe = null;
var subheading=0;
var allData;
var allowedRegradeTime = 24*60*60*1000;
//var benchmarkData = performance.timing; // Will be updated after onload event
//var ajaxStart;
//var tim;
var searchterm = "";
var studentInfo = new Array;
var students=new Array;
var momtmp=new Array;
var sortcolumn=1;
var clickedindex;
var typechanged=false;
var teacher;
var entries;
var moments;
var results;
var versions;
var timeZero=new Date(0);
var duggaArray = [[]];
var filterList;
var tableName = "resultTable";
var tableCellName = "resultTableCell";

function setup(){
  //Benchmarking function
  //benchmarkData = performance.timing;

  /*    Add filter menu   */
  var filt ="";
  filt+="<td id='select' class='navButt'><span class='dropdown-container' onmouseover='hoverc();'>";
  filt+="<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
  filt+="<div id='dropdownc' class='dropdown-list-container' style='z-index: 1'>";
  filt+="<div id='columnfilter'></div>"
  filt+="<div id='customfilter'></div>"
  filt+="</div>";
  filt+="</span></td>";

  filt+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hovers();'>";
  filt+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
  filt+="<div id='dropdowns' class='dropdown-list-container'>";
  filt+="</div>";
  filt+="</span></td>";
  $("#menuHook").before(filt);

  window.onscroll = function() {magicHeading()};

  AJAXService("GET", { cid : querystring['cid'],vers : querystring['coursevers'] }, "RESULT");
}


function resort(){

}

function toggleSortDir(col){

}

function process()
{
	// Create temporary list that complies with dropdown
	momtmp=new Array;
	var momname = "Moment unavailable";
	for(var l=0;l<moments.length;l++){
		if (moments[l].kind===4){
			momname = moments[l].entryname;
		}
		moments[l].momname = momname;
	}

	// Create temporary list that complies with dropdown
  momtmp=new Array;
  for(var l=0;l<moments.length;l++){
    momtmp.push(moments[l]);
  }

	// Reconstitute table
	students=new Array;
	for(i=0;i<entries.length;i++){

		var uid=entries[i].uid;

		// Loop through all teacher names and store the appropriate name in a variable
		for(j=0; j<teacher.length;j++){
			var tuid=teacher[j].tuid;
			if(uid==tuid){
				var setTeacher = teacher[j].teacher;
			}
		}
		if(setTeacher !== null){
			// Place spaces in the string when a lowercase is followed by a uppercase
			setTeacher = setTeacher.replace(/([a-z])([A-Z])/g, '$1 $2');
		}

		// All results of this student
    var res=results[uid];
		var restmp=new Array;

		if (typeof res != 'undefined'){
			// Pre-filter result list for a student for lightning-fast access
			for(var k=0;k<res.length;k++){
				restmp[res[k].dugga]=res[k];
			}
		}
		var student=new Array;
		// Creates a string that displays the first <td> (the one that shows the studentname etc) and places it into an array
		student.push({grade:("<div class='dugga-result-div'>"+entries[i].firstname+" "+entries[i].lastname+"</div><div class='dugga-result-div'>"+entries[i].username+" / "+entries[i].class+"</div><div class='dugga-result-div'>"+entries[i].ssn+"</div><div class='dugga-result-div'>"+setTeacher+"</div>"),firstname:entries[i].firstname,lastname:entries[i].lastname,ssn:entries[i].ssn,class:entries[i].class,access:entries[i].access,setTeacher,username:entries[i].username});
		// Now we have a sparse array with results for each moment for current student... thus no need to loop through it
		for(var j=0;j<momtmp.length;j++){
      if(momtmp[j].kind==4){
          momtmp[j].link=-1;
          momtmp[j].qvariant=-1;
      }
      // If it is a feedback quiz -- we have special handling.
			if(momtmp[j].quizfile=="feedback_dugga"){
        var momentresult=restmp[momtmp[j].lid];
				// If moment result does not exist... either make "empty" student result or push mark
				if(typeof momentresult!='undefined'){
					student.push({ishere:true,grade:momentresult.grade,marked:new Date((momentresult.markedts*1000)),submitted:new Date((momentresult.submittedts*1000)),kind:momtmp[j].kind,lid:momtmp[j].lid,uid:uid,needMarking:momentresult.needMarking,gradeSystem:momtmp[j].gradesystem,vers:momentresult.vers,userAnswer:momentresult.useranswer,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, quizfile:momtmp[j].quizfile, timesGraded:momentresult.timesGraded, gradeExpire:momentresult.gradeExpire,firstname:entries[i].firstname,lastname:entries[i].lastname, deadline:new Date(momtmp[j].deadlinets),});
				}else{
					student.push({ishere:true,kind:momtmp[j].kind,grade:"",lid:momtmp[j].lid,uid:uid,needMarking:false,marked:new Date(0),submitted:new Date(0),grade:-1,vers:querystring['coursevers'],gradeSystem:momtmp[j].gradesystem,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, userAnswer:"UNK", quizfile:momtmp[j].quizfile, gradeExpire:null,firstname:entries[i].firstname,lastname:entries[i].lastname, deadline:new Date(momtmp[j].deadline),});
				}
			}else{
        var momentresult=restmp[momtmp[j].lid];
				// If moment result does not exist... either make "empty" student result or push mark
				if(typeof momentresult!='undefined'){
          student.push({
            ishere:true,
            grade:momentresult.grade,
            marked:new Date((momentresult.markedts*1000)),
            submitted:new Date((momentresult.submittedts*1000)),
            kind:momtmp[j].kind,
            lid:momtmp[j].lid,
            uid:uid,
            needMarking:momentresult.needMarking,
            gradeSystem:momtmp[j].gradesystem,
            vers:momentresult.vers,
            userAnswer:momentresult.useranswer,
            quizId:momtmp[j].link,
            qvariant:momtmp[j].qvariant,
            quizfile:momtmp[j].quizfile,
            timesGraded:momentresult.timesGraded,
            gradeExpire:momentresult.gradeExpire,
            firstname:entries[i].firstname,
            lastname:entries[i].lastname,
            deadline:new Date((momtmp[j].deadlinets*1000)),});
				}else{
          student.push({
            ishere:false,
            kind:momtmp[j].kind,
            grade:"UNK",
            lid:momtmp[j].lid,
            uid:uid,
            needMarking:false,
            gradeSystem:momtmp[j].gradesystem,
            vers:momtmp[j].vers,
            userAnswer:"UNK",
            marked:new Date(0),
            submitted:new Date(0),
            grade:null,
            quizId:momtmp[j].link,
            qvariant:momtmp[j].qvariant,
            quizfile:momtmp[j].quizfile,
            timesGraded:0,
            gradeExpire:"UNK",
            firstname:entries[i].firstname,
            lastname:entries[i].lastname,
            deadline:new Date(momtmp[j].deadline),});
				}
			}
    }
		students.push(student);
	}
	// Update filter list from local storage.
	filterList = JSON.parse(localStorage.getItem("resultTable_filter_"+querystring['cid']+"-"+querystring['coursevers']));
	if (filterList == null){
		filterList = {};
	}

	// Add custom filters to the filter menu.
  var dstr="";
	dstr+=makeCustomFilter("showTeachers", "Show Teachers");
	dstr+=makeCustomFilter("onlyPending", "Only pending");
	dstr+=makeCustomFilter("minimode", "Mini mode");

	dstr+="<div style='display:flex;justify-content:flex-end;border-top:1px solid #888'><button onclick='leavec()'>Filter</button></div>";

	document.getElementById("customfilter").innerHTML=dstr;
	var dstr="";

	// Sorting
	dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888'><input type='radio' class='headercheck' name='sortdir' value='1' id='sortdir1'><label class='headerlabel' for='sortdir1'>Sort ascending</label><input name='sortdir' onclick='toggleSortDir(0)' type='radio' class='headercheck' value='-1' id='sortdir0'><label class='headerlabel' for='sortdir0'>Sort descending</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(0)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Firstname</label></div>";
	dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(1)' value='0' id='sortcol0_1'><label class='headerlabel' for='sortcol0_1' >Lastname</label></div>";
	dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888;' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(2)' value='0' id='sortcol0_2'><label class='headerlabel' for='sortcol0_2' >SSN</label></div>";
	dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(3)' value='0' id='sortcol0_3'><label class='headerlabel' for='sortcol0_3' >Class</label></div>";
	dstr+="<div class='checkbox-dugga' style='border-bottom:1px solid #888;' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(4)' value='0' id='sortcol0_4'><label class='headerlabel' for='sortcol0_4' >Teacher</label></div>";

	dstr+="<table><tr><td>";
	for(var j=0;j<momtmp.length;j++){
		var lid=moments[j].lid;
		var name=momtmp[j].entryname;
		var truncatedname=name;
		if(truncatedname.length>12){
			truncatedname=momtmp[j].entryname.slice(0, 3)+"..."+momtmp[j].entryname.slice(momtmp[j].entryname.length-8);
		}


		dstr+="<div class='checkbox-dugga checknarrow ";
		if (moments[j].visible == 0){
			dstr+="checkbox-dugga-hidden'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(-1)' id='sortcol"+(j+1)+"' value='"+(j+1)+"'><label class='headerlabel' title='"+name+"' for='sortcol"+(j+1)+"' >"+truncatedname+"</label></div>";
		}else{
			dstr+="'><input name='sortcol' type='radio' class='sortradio' id='sortcol"+(j+1)+"' onclick='sorttype(-1)' value='"+(j+1)+"'><label class='headerlabel' title='"+name+"' for='sortcol"+(j+1)+"' >"+truncatedname+"</label></div>";
		}
	}
	dstr+="</td><td style='vertical-align:top;'>";
	dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(0)' id='sorttype0' value='0'><label class='headerlabel' for='sorttype0' >FIFO</label></div>";
	dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(1)' id='sorttype1' value='1'><label class='headerlabel' for='sorttype1' >Grade</label></div>";
	dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(2)' id='sorttype2' value='2'><label class='headerlabel' for='sorttype2' >Submitted</label></div>";
	dstr+="<div class='checkbox-dugga checknarrow' ><input name='sorttype' type='radio' class='sortradio' onclick='sorttype(3)' id='sorttype3' value='3'><label class='headerlabel' for='sorttype3' >Marked</label></div>";
	dstr+="</td></tr></table>";
	dstr+="<div style='display:flex;justify-content:flex-end;border-top:1px solid #888'><button onclick='leaves()'>Sort</button></div>"
	document.getElementById("dropdowns").innerHTML=dstr;

	resort();
}

function makeCustomFilter(filtername, labeltext){
	str="<div class='checkbox-dugga checkmoment'>";
	str+= "<input type='checkbox' id='"+filtername+"' onclick='toggleFilter(\""+filtername+"\")'";
	if (filterList[filtername] == null) {filterList[filtername] = false;}
	if (filterList[filtername]) {str+=" checked";}
	str+="><label class='headerlabel' for='"+filtername+"'>"+labeltext+"</label></div>";
	return str;
}

function toggleFilter(filter){
	if (filterList[filter] == false) {
		filterList[filter] = true;
	} else {
		filterList[filter] = false;
	}
	localStorage.setItem("resultTable_filter_"+querystring['cid']+"-"+querystring['coursevers'], JSON.stringify(filterList));
	myTable.renderTable();
}

function hoverc()
{
    $('#dropdowns').css('display','none');
    $('#dropdownc').css('display','block');
}

function leavec()
{
  $('#dropdownc').css('display','none');
}

function checkMomentParts(pos, id) {
  for (var i = 0; i < duggaArray[pos].length; i++) {
    var setThis = document.getElementById(duggaArray[pos][i]);
    setThis.checked = document.getElementById(id).checked;
  }
}

function hovers()
{
    $('#dropdownc').css('display','none');
    $('#dropdowns').css('display','block');
}

function leaves()
{
  $('#dropdowns').css('display','none');
  var col=0;
  var dir=1;

  var ocol=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
  var odir=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");


  $("input[name='sortcol']:checked").each(function() {col=this.value;});
  $("input[name='sortdir']:checked").each(function() {dir=this.value;});

  localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol", col);
  localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);


  if (!(ocol==col && odir==dir) || typechanged) {
    typechanged=false;
    resort();
  }
  magicHeading();
}

function sorttype(t){
    var c=$("input[name='sortcol']:checked").val();
    if (c == 0){
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1", t);
        $("input[name='sorttype']").prop("checked", false);
    } else {
        if (t == -1){
            t = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", t);
            $("#sorttype"+t).prop("checked", true);
        } else {
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", t);
            $("#sorttype"+t).prop("checked", true);
        }
    }
    typechanged=true;
    magicHeading();
}

function magicHeading(){
}

$(function()
{
  $("#release").datepicker({ dateFormat : "yy-mm-dd" });
  $("#deadline").datepicker({ dateFormat : "yy-mm-dd" });
});

//----------------------------------------
// Commands:
//----------------------------------------

function gradeDugga(e, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire){
		closeWindows();

		var uidGrab = uid;
		var momentGrab = moment;
		var currentTime = new Date();
		var currentTimeGetTime = currentTime.getTime();

    if ($(e.target ).hasClass("Uc")){
        changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if (($(e.target ).hasClass("G"))  || ($(e.target ).hasClass("VG")) || ($(e.target ).hasClass("U"))){
        changeGrade(0, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire);
    } else if ($(e.target ).hasClass("Gc")) {
        changeGrade(2, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid, gradeExpire);
    } else if ($(e.target ).hasClass("VGc")){
        changeGrade(3, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if ($(e.target ).hasClass("U")) {
        changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
    } else if ($(e.target ).hasClass("Uh")){
        for(var a=0;a<students.length;a++){
            var student = students[a];

            for(var j=0;j<student.length;j++){
			    var studentObject = student[j];

				//Lid and uid is used to make sure that only the dugga that is intended to change grade change grade
				if(studentObject.lid === momentGrab && studentObject.uid === uidGrab){ // && studentObject.gradeExpire!=null

					var newGradeExpire = new Date(studentObject.gradeExpire);

					// This variable adds 24h to the current time
	                var newDateObj = new Date(newGradeExpire.getTime() + allowedRegradeTime);
                    var newGradeExpirePlusOneDay = newDateObj.getTime();

					// Compare the gradeExpire value to the current time, if no grade is set, we can always set it no matter the last change
					if(newGradeExpirePlusOneDay > currentTimeGetTime){
						//The user must press the ctrl-key to activate if-statement
						if(event.ctrlKey || event.metaKey){
							changeGrade(1, gradesys, cid, vers, moment, uid, mark, ukind, qversion, qid);
						}else{
							alert("You must press down the ctrl-key or cmd-key to change from grade G to U.");
						}
					} else {
						alert("You can no longer change the grade to U as 24 hours has passed since grade G was set.");
					}
				}
            }
        }
   }
    else {
      //alert("This grading is not OK!");
    }
}

function makeImg(gradesys, cid, vers, moment, uid, mark, ukind,gfx,cls,qvariant,qid){
    return "<img src=\""+gfx+"\" id=\"grade-"+moment+"-"+uid+"\" class=\""+cls+"\" onclick=\"gradeDugga(event,"+gradesys+","+cid+",'"+vers+"',"+moment+","+uid+","+mark+",'"+ukind+"',"+qvariant+","+qid+");\"  />";
}

function makeSelect(gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid)
{
    var str = "";

    // Irrespective of marking system we allways print - and U
    if (mark === null || mark === 0 || mark === -1){
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uc.png","Uc", qvariant, qid);
    } else if (mark === 1) {
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/U.png","U", qvariant, qid);
    } else {
        str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Uh.png","Uh", qvariant, qid);
    }

    // Gradesystem: 1== UGVG 2== UG 3== U345
    if (gradesys === 1) {
      if (mark === 2){
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.png","G", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGh.png","VGh", qvariant, qid);
      } else if (mark === 3) {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gh.png","Gh", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VG.png","VG", qvariant, qid);
      } else {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.png","Gc", qvariant, qid);
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/VGc.png","VGc", qvariant, qid);
      }
    } else if (gradesys === 2) {
        if (mark === 2){
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/G.png","G", qvariant, qid);
        } else {
          str += makeImg(gradesys, cid, vers, moment, uid, mark, ukind,"../Shared/icons/Gc.png","Gc", qvariant, qid);
        }
    } else if (gradesys === 3){
      /*
      if (mark === 4){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\" value = \"4\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\">3</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\" value = \"4\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-3\">3</label>";
      }
      if (mark === 5){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\" value = \"5\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\">4</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\" value = \"5\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-4\">4</label>";
      }
      if (mark === 6){
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\" value = \"6\" checked = \"checked\" onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\">5</label>";
      }
      else{
        str += "<input class=\"gradeInput\" type = \"radio\" name = \"grade-"+moment+"-"+ukind+"-"+uid+"\" id = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\" value = \"6\"  onclick='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'> <label for = \"grade-"+moment+"-"+ukind+"-"+uid+"-5\">5</label>";
      }
      */
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

function clickResult(cid, vers, moment, firstname, lastname, uid, submitted, marked, foundgrade, gradeSystem, lid, qvariant, qid)
{
	$("#Nameof").html(firstname + " " + lastname + " - Submitted: " + submitted + " Marked: " + marked);
	var menu = "<div class='' style='width:100px;display:block;'>";
	menu += "<div class='loginBoxheader'>";
	menu += "<h3>Grade</h3>";
	menu += "</div>";
	menu += "<table>";
  menu += "<tr><td>";
	if ((foundgrade === null && submitted === null )) {
		menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "I", parseInt(qvariant), parseInt(qid));
	}else if (foundgrade == -1){
		menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "IFeedback", parseInt(qvariant), parseInt(qid));
	}else if (foundgrade !== null){
		menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), parseInt(foundgrade), "U", parseInt(qvariant), parseInt(qid));
	}else {
		menu += makeSelect(parseInt(gradeSystem), querystring['cid'], querystring['coursevers'], parseInt(lid), parseInt(uid), null, "U", parseInt(qvariant), parseInt(qid));
	}
	menu += "</td></tr>";
	menu += "</table>";
	menu += "</div> <!-- Menu Dialog END -->";
	document.getElementById('markMenuPlaceholder').innerHTML=menu;
	AJAXService("DUGGA", { cid : cid, vers : vers, moment : moment, luid : uid, coursevers : vers }, "RESULT");
}

function changeGrade(newMark, gradesys, cid, vers, moment, uid, mark, ukind, qvariant, qid, gradeExpire)
{
    var newFeedback = "UNK";
    if (document.getElementById('newFeedback') !== null){
        newFeedback = document.getElementById('newFeedback').value;
    }
    AJAXService("CHGR", { cid : cid, vers : vers, moment : moment, luid : uid, mark : newMark, ukind : ukind, newFeedback : newFeedback, qvariant : qvariant, quizId : qid, gradeExpire : gradeExpire }, "RESULT");
}

function moveDist(e)
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
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function displayPreview(filepath, filename, fileseq, filetype, fileext, fileindex, displaystate)
{
    clickedindex=fileindex;
    document.getElementById("responseArea").outerHTML='<textarea id="responseArea" style="width: 100%;height:100%;-webkit-box-sizing: border-box; -moz-box-sizing: border-box;box-sizing: border-box;">'+allData["files"][allData["duggaentry"]][clickedindex].feedback+'</textarea>'

    if(displaystate){
        document.getElementById("markMenuPlaceholderz").style.display="block";
    }else{
        document.getElementById("markMenuPlaceholderz").style.display="none";
    }

    var str ="";
    if (filetype === "text") {
        str+="<textarea style='width: 100%;height: 100%;box-sizing: border-box;'>"+allData["files"][allData["duggaentry"]][fileindex].content+"</textarea>";
    } else if (filetype === "link"){
        var filename=allData["files"][allData["duggaentry"]][fileindex].content;
        if(window.location.protocol === "https:"){
            filename=filename.replace("http://", "https://");
        }else{
            filename=filename.replace("https://", "http://");
        }
        str += '<iframe src="'+filename+'" width="100%" height="100%" />';
    } else {
        if (fileext === "pdf"){
            str += '<embed src="'+filepath+filename+fileseq+'.'+fileext+'" width="100%" height="100%" type="application/pdf" />';
        } else if (fileext === "zip" || fileext === "rar"){
            str += '<a href="'+filepath+filename+fileseq+'.'+fileext+'"/>'+filename+'.'+fileext+'</a>';
        } else if (fileext === "txt"){
            str+="<pre style='width: 100%;height: 100%;box-sizing: border-box;'>"+allData["files"][allData["duggaentry"]][fileindex].content+"</pre>";
        }
    }
    document.getElementById("popPrev").innerHTML=str;

    $("#previewpopover").css("display", "block");
}

//----------------------------------------
// Adds Canned Response to Response Dialog
//----------------------------------------

function addCanned()
{
    document.getElementById("responseArea").innerHTML+=document.getElementById("cannedResponse").value;
}

//----------------------------------------
// Sort results
//----------------------------------------

function saveResponse()
{
    respo=document.getElementById("responseArea").value;

    var filename=allData["files"][allData["duggaentry"]][clickedindex].filename+allData["files"][allData["duggaentry"]][clickedindex].seq;

    AJAXService("RESP", { cid : querystring['cid'],vers : querystring['coursevers'],resptext:respo, respfile:filename, duggaid: allData["duggaid"],luid : allData["duggauser"],moment : allData["duggaentry"], luid : allData["duggauser"] }, "RESULT");
    document.getElementById("responseArea").innerHTML = "";
    $("#previewpopover").css("display", "none");
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedResults(data)
{
  if (data['debug'] !== "NONE!") alert(data['debug']);
  if (data.gradeupdated === true){
    // Update the the local array studentInfo when grade is updated.
    for (var student in studentInfo){
      var studentObject = studentInfo[student]["lid:" + data.duggaid];
      if (studentObject != null && studentObject.uid === parseInt(data.duggauser) && studentObject.lid === parseInt(data.duggaid)) {
        studentObject.grade = parseInt(data.results);
        studentObject.timesGraded = parseInt(data.timesgraded);
        studentObject.gradeExpire = data.duggaexpire;
        if (data.results > 0) {
        	studentObject.needMarking = false;
        } else {
        	studentObject.needMarking = true;
        }
        break;
      }
    }
    myTable.renderTable();
  } else {

    entries=data.entries;
    moments=data.moments;
    versions=data.versions;
    results=data.results;
    teacher=data.teachers;
    courseteachers=data.courseteachers;

    let ladmoments="";
    for(let i=0;i<moments.length;i++){
        let dugga=moments[i];
        if(dugga.kind===4){
            ladmoments+="<option value='"+dugga.entryname+"'>"+dugga.entryname+"</option>";
        }
    }
    document.getElementById("ladselect").innerHTML=ladmoments;
    document.getElementById("laddate").valueAsDate=new Date();

    //tim=performance.now();

    subheading=0;

    $(document).ready(function () {
            $("#dropdownc").mouseleave(function () {
                leavec();
            });
    });
    $(document).ready(function () {
            $("#dropdowns").mouseleave(function () {
                leaves();
            });
    });

    allData = data; // used by dugga.js

    if (data['dugganame'] !== "") {
        // Display student submission
        $.getScript(data['dugganame'], function() {
          $("#MarkCont").html(data['duggapage']);
          showFacit(data['duggaparam'],data['useranswer'],data['duggaanswer'], data['duggastats'], data['files'],data['moment'],data['duggafeedback']);
        });
        $("#resultpopover").css("display", "block");
    } else {
        // Process and render filtered data
      process();
  		createSortableTable(data);
    }
  }
}

var myTable;
//----------------------------------------
// Renderer
//----------------------------------------

function buildDynamicHeaders() {
  var tblhead = {"FnameLnameSSN":"Fname/Lname/SSN"};
  moments.forEach(function(entry) {
  	tblhead["lid:"+entry['lid']] = entry['entryname'];
  });
  return tblhead;
}

function buildColumnOrder() {
		var colOrder=["FnameLnameSSN"];
		moments.forEach(function(entry) {
				colOrder.push("lid:"+entry['lid']);
		});
		return colOrder;
}

function buildStudentInfo() {
  var i = 0;
	students.forEach(function(entry) {
		var row = {"FnameLnameSSN":entry[0]};
		if(entry.length > 1) {
			for(var j = 1; j < entry.length; j++) {
				row["lid:"+entry[j]['lid']] = entry[j];
			}
		}
		studentInfo[i++] = row;
	});
	return studentInfo;
}

function createSortableTable(data){
		var tblhead = buildDynamicHeaders();
		studentInfo = buildStudentInfo();


		var tabledata = {
			tblhead,
			tblbody: studentInfo,
			tblfoot:[]
		}
		var colOrder=buildColumnOrder();
		myTable = new SortableTable({
				data:tabledata,
				tableElementId:tableName,
				filterElementId:"columnfilter",
				renderCellCallback:renderCell,
				exportCellCallback:exportCell,
				exportColumnHeadingCallback:exportColumnHeading,
				renderSortOptionsCallback:renderSortOptions,
				renderColumnFilterCallback:renderColumnFilter,
				rowFilterCallback:rowFilter,
				columnOrder:colOrder,
				hasRowHighlight:true,
				hasMagicHeadings:true,
				hasCounterColumn:true
		});

		myTable.renderTable();

		if(data['debug']!="NONE!") alert(data['debug']);
}

function renderCell(col,celldata,cellid) {
	// Render minimode
	if (filterList["minimode"]) {
		// First column (Fname/Lname/SSN)
		if (col == "FnameLnameSSN"){
			str = "<div class='resultTableCell resultTableMini'>";
				str += "<div class='resultTableText'>";
					str += celldata.firstname + " " + celldata.lastname;
				str += "</div>";
			str += "</div>";
			return str;
		} else {
			// color based on pass,fail,pending,assigned,unassigned
      str = "<div class='resultTableCell resultTableMini ";
				if(celldata.kind==4) { str += "dugga-moment "; }
				if (celldata.grade > 1) {str += "dugga-pass";}
				else if (celldata.submittedts <= celldata.deadlinets) {str += "dugga-pending";}
				else if (celldata.kind != 4 && celldata.submittedts > celldata.deadlinets) {str += "dugga-pending-late-submission";}
				else if (celldata.grade === 1) {str += "dugga-fail";}
				else if (celldata.grade === 0 || isNaN(celldata.grade)) {str += "dugga-assigned";}
				else {str += "dugga-unassigned";}
			str += "'>";
			str += "</div>";
			return str;
		}
	}

	// Render normal mode
	// First column (Fname/Lname/SSN)
	if (col == "FnameLnameSSN"){
		str = "<div class='resultTableCell resultTableNormal'>";
			str += "<div class='resultTableText'>";
				str += "<div style='font-weight:bold'>"+celldata.firstname+" "+celldata.lastname+"</div>";
				str += "<div>"+celldata.username+" / "+celldata.class+"</div>";
				str += "<div>"+celldata.ssn+"</div>";
				//str += "<div style='font-style:italic;text-align:right;'>"+celldata.setTeacher+"</div>";
		//	str += "</div>";
		str += "</div>";
		return str;

	} else {
		// color based on pass,fail,pending,assigned,unassigned
    str = "<div style='height:70px;' class='resultTableCell ";
    if(celldata.kind==4) { str += "dugga-moment "; }
    if (celldata.grade > 1) {str += "dugga-pass";}
    else if (celldata.needMarking == true && celldata.submitted <= celldata.deadline) {str += "dugga-pending";}
    else if (celldata.kind != 4 && celldata.needMarking == true && celldata.submitted > celldata.deadline) {str += "dugga-pending-late-submission";}
    else if (celldata.grade === 1) {str += "dugga-fail";}
    else if (celldata.grade === 0 || isNaN(celldata.grade)) {str += "dugga-assigned";}
    else {str += "dugga-unassigned";}
		str += "'>";

		// Creation of grading buttons
		if(celldata.ishere===true||celldata.kind==4){
			  str += "<div class='gradeContainer resultTableText'>";
				if (celldata.grade === null ) {
					str += makeSelect(celldata.gradeSystem, querystring['cid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'I', celldata.qvariant, celldata.quizId);
				} else if (celldata.grade === -1 ) {
					str += makeSelect(celldata.gradeSystem, querystring['cid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'IFeedback', celldata.qvariant, celldata.quizId);
				} else {
					str += makeSelect(celldata.gradeSystem, querystring['cid'], celldata.vers, celldata.lid, celldata.uid, celldata.grade, 'U', celldata.qvariant, celldata.quizId);
				}
				str += "<img id='korf' class='fist";
					if(celldata.userAnswer===null && !(celldata.quizfile=="feedback_dugga")){ // Always shows fist. Should be re-evaluated
						str += " grading-hidden";
					}
					str +="' src='../Shared/icons/FistV.png' onclick='clickResult(\"" + querystring['cid'] + "\",\"" + celldata.vers + "\",\"" + celldata.lid + "\",\"" + celldata.firstname + "\",\"" + celldata.lastname + "\",\"" + celldata.uid + "\",\"" + celldata.submitted + "\",\"" + celldata.marked + "\",\"" + celldata.grade + "\",\"" + celldata.gradeSystem + "\",\"" + celldata.lid + "\",\"" + celldata.qvariant + "\",\"" + celldata.quizId + "\");'";
				str += "/>";
        // Print times graded
  			str += "<span class='text-center resultTableText'>";
  				if(celldata.ishere===true && celldata.timesGraded!==0){
  					str += "Times Graded: " + celldata.timesGraded;
  				}
  			str += "</span>";
        //
			str += "</div>";

			// Print submitted time and change color to red if passed deadline
			str += "<div class='text-center resultTableText'";
				for (var p = 0; p < moments.length; p++){
					if (moments[p].link == celldata.quizId){
						if (Date.parse(moments[p].deadline) < Date.parse(celldata.submitted)){
							str += " style='color:red;'";
						}
						break;
					}
				}
				str += ">";
				if (celldata.submitted.getTime() !== timeZero.getTime()){
					str += celldata.submitted.toLocaleDateString()+ " " + celldata.submitted.toLocaleTimeString();
				}
			str += "</div>";

		}
		str += "</div>";
		return str;
	}
	return celldata;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	// Custom filters that remove rows before an actual search
	if (!filterList["showTeachers"] && row["FnameLnameSSN"]["access"].toUpperCase().indexOf("W") != -1) return false;
	if (filterList["onlyPending"]) {
		var rowPending = false;
		for (var colname in row){
			if (colname != "FnameLnameSSN" && row[colname]["needMarking"] == true) { rowPending = true; break; }
		}
		if (!rowPending) { return false; }
	}

	for (colname in row) {
		if(colname == "FnameLnameSSN") {
			var name = "";
			if (row[colname]["firstname"] != null) {
				name += row[colname]["firstname"] + " ";
			}
			if (row[colname]["lastname"] != null) {
				name += row[colname]["lastname"];
			}
			if (name.toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;

			if (row[colname]["ssn"] != null) {
				if (row[colname]["ssn"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
			}
			if (row[colname]["username"] != null) {
				if (row[colname]["username"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
			}
			if (row[colname]["class"] != null) {
				if (row[colname]["class"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
			}
			if (row[colname]["setTeacher"] != null) {
				if (row[colname]["setTeacher"].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
			}
		}
	}
	return false;
}

function renderSortOptions(col,status,colname) {
		str = "";
		if (status ==- 1) {
				if(col=="FnameLnameSSN"){
						let colnameArr=colname.split("/");
						str+="<div style='white-space:nowrap;cursor:pointer'>"
						str+="<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
						str+="<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>/";
						str+="<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
				}else{
						str+="<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
				}
				str+="</div>"
			}else{
				if(col=="FnameLnameSSN"){
						let colnameArr=colname.split("/");
						if (status == 0 || status == 1) {
								str+="<div style='white-space:nowrap;cursor:pointer'>"
								if(status==0){
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colnameArr[0] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
								}else{
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
							}
							str+="</div>"
						} else if(status == 2 || status == 3) {
								str+="<div style='white-space:nowrap;cursor:pointer'>"
								if(status==2){
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",3)'>" + colnameArr[1] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
								}else{
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "</span>";
								}
								str+="</div>"
						}else {
								str+="<div style='white-space:nowrap;cursor:pointer'>"
								if(status==4){
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",5)'>" + colnameArr[2] + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
								}else{
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colnameArr[0] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",2)'>" + colnameArr[1] + "</span>/";
										str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",4)'>" + colnameArr[2] + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
								}
								str+="</div>"
						}
				}else{
            if(status==0) {
                str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'><span style='display:inline-block;background-color:#ffffdd;width:16px;height:16px;border-radius:8px;'>P</span>"+colname+"</span>";
            }else if(status==1){
                str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",2)'><span style='display:inline-block;background-color:#B5D7A8;width:16px;height:16px;border-radius:8px;'>U</span>"+colname+"</span>";
            }else if(status==2){
                str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",3)'><span style='display:inline-block;background-color:#d79b9b;width:16px;height:16px;border-radius:8px;'>G</span>"+colname+"</span>";
            }else if(status==3){
                str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",4)'><span style='display:inline-block;background-color:#d0c0d0;width:16px;height:16px;border-radius:8px;'>VG</span>"+colname+"</span>";
            }else{
                str += "<span class='sortableHeading' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'><span style='display:inline-block;background-color:#eae8eb;width:16px;height:16px;border-radius:8px;'>-</span>"+colname+"</span>";
            }
        }
		}
		return str;
}

//--------------------------------------------------------------------------
// compare
// ---------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------
function compare(a,b) {
		var col = sortableTable.currentTable.getSortcolumn();
		let kind = sortableTable.currentTable.getSortkind();
		var tempA;
		var tempB;

    if (a==null||b==null||typeof(a)==="undefined"||typeof(b)==="undefined") return false;

		if((typeof a == "undefined")||(typeof b == "undefined")) console.log("sort fail: ",a,b,col,kind)

		if(typeof a == "undefined") return 1;
		if(typeof b == "undefined") return -1;

		if (col == "FnameLnameSSN") {
				if(kind==0||kind==1){
						tempA=a['firstname'].toUpperCase();
						tempB=b['firstname'].toUpperCase();
				}else if(kind==2||kind==3){
						tempA=a['lastname'].toUpperCase();
						tempB=b['lastname'].toUpperCase();
				}else{
						tempA=a['ssn'].toUpperCase();
						tempB=b['ssn'].toUpperCase();
				}

				if (tempA > tempB) {
						return 1;
				} else if (tempA < tempB) {
						return -1;
				} else {
						return 0;
				}
		} else {
        let atmp=conv(a,kind);
        let btmp=conv(b,kind);

        if(atmp==btmp && a.submitted>b.submitted)atmp+=10;
        if(atmp==btmp && b.submitted>a.submitted)btmp+=10;
        return btmp-atmp;
		}
}

function conv(item,kind){
    var tmp=7;
    if(typeof(item)!=="undefined"){
        if(item.grade===null )tmp=7; // N/A i.e. not opened
        if(item.grade===0)tmp=1; // Pending
        if(item.grade===0 && item.userAnswer===null)tmp=7; // Not submitted anything
        if(item.grade==1)tmp=6; // U
        if(item.grade==1 && item.submitted>item.marked)tmp=1; // Pending
        if(item.grade>=2 && item.grade<=3)tmp=2; // Pass / G / VG
    }
    if(tmp<kind)tmp+=8;

    return tmp*100;
}

function renderColumnFilter(col,status,colname) {
		str = "";
		if (colname == "FnameLnameSSN") return str;
		if (status) {
			str = "<div class='checkbox-dugga'>";
			str += "<input type='checkbox' checked onclick='myTable.toggleColumn(\"" + col + "\",\"" + status + "\")'><label class='headerlabel'>" + colname + "</label>";
			str += "</div>"
		} else {
			str = "<div class='checkbox-dugga'>";
			str += "<input type='checkbox' onclick='myTable.toggleColumn(\"" + col + "\",\"" + status + "\")'><label class='headerlabel'>" + colname + "</label>";
			str += "</div>"
		}
		return str;
}

function exportCell(format,cell,colname) {
  str="";
  if(format==="csv"){
      if(colname=="FnameLnameSSN"){
          if(cell.ssn.length>11){
            str=cell.ssn+";";
          }else{
            str="19"+cell.ssn+";";
          }
          str+=cell.firstname+" "+cell.lastname;
          str=str.replace(/\&aring\;/g,"å");
          str=str.replace(/\&Aring\;/g,"Å");
          str=str.replace(/\&auml\;/g,"ä");
          str=str.replace(/\&Auml\;/g,"Ä");
          str=str.replace(/\&ouml\;/g,"ö");
          str=str.replace(/\&Ouml\;/g,"Ö");
      }else{
          if(cell===null){
              str="-";
          }else{
            if(cell.grade===null){
                str="-";
            }else{
                if(cell.gradeSystem===1||cell.gradeSystem===2){
                  if(cell.grade===1){
                      str="U";
                  }else if(cell.grade===2){
                      str="G";
                  }else if(cell.grade===3){
                      str="VG";
                  }else{
                      str="-";
                  }
              }else{
                    str="UNK";
                }
            }
          }
      }
  }else{
      console.log("Export format: "+format+" not supported!");
  }
  return str;
}

function exportColumnHeading(format,heading,colname) {
  str="";
  if(format==="csv"){
      if(colname=="FnameLnameSSN"){
          str="Personnummer;Namn";
      }else{
          heading=heading.replace(/\&aring\;/g,"å");
          heading=heading.replace(/\&Aring\;/g,"Å");
          heading=heading.replace(/\&auml\;/g,"ä");
          heading=heading.replace(/\&Auml\;/g,"Ä");
          heading=heading.replace(/\&ouml\;/g,"ö");
          heading=heading.replace(/\&Ouml\;/g,"Ö");
//          if(document.getElementById("ladselect").value==heading)heading="Betyg";
//          str=heading.replace(",",".");
          str=heading;
      }
  }else{
      console.log("Export format: "+format+" not supported!");
  }
  return str;
}

function ladexport()
{
    let expo="";
    expo+=document.getElementById("ladselect").value+"\n";
    expo+=document.getElementById("ladgradescale").value+"\n";
    expo+=document.getElementById("laddate").value+"\n";
    expo+=myTable.export("csv",";");

    //alert(expo);
    document.getElementById("resultlistheader").innerHTML="Results for: "+document.getElementById("ladselect").value;
    document.getElementById("resultlistarea").value=expo;
    document.getElementById("resultlistpopover").style.display="flex";

}

function closeLadexport()
{
    document.getElementById("resultlistarea").value="";
    document.getElementById("resultlistpopover").style.display="none";
}
