var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;
var rProbe = null;

AJAXService("GET", {
	cid : querystring['cid']
}, "RESULT");

$(function() {
	$("#release").datepicker({
		dateFormat : "yy-mm-dd"
	});
	$("#deadline").datepicker({
		dateFormat : "yy-mm-dd"
	});
});

//----------------------------------------
// Commands:
//----------------------------------------

function makeSelect(gradesys, cid, vers, moment, uid, mark, ukind) {
	var str = "";
	str += "<select onchange='changeGrade(this,\"" + gradesys + "\",\"" + cid + "\",\"" + vers + "\",\"" + moment + "\",\"" + uid + "\",\"" + mark + "\",\"" + ukind + "\");'>";

	// Irrespective of marking system we allways print - and U
	if (mark == null || mark == 0)
		str += "<option selected='selected' value='0'>-</option>";
	else
		str += "<option value='0'>-</option>";
	if (mark == 1)
		str += "<option selected='selected' value='1'>U</option>";
	else
		str += "<option value='1'>U</option>";

	// Gradesystem: 1== UGVG 2== UG 3== U345
	if (gradesys == 1) {
		if (mark == 2)
			str += "<option selected='selected' value='2'>G</option>";
		else
			str += "<option value='2'>G</option>";
		if (mark == 3)
			str += "<option selected='selected' value='3'>VG</option>";
		else
			str += "<option value='3'>VG</option>";
	} else if (gradesys == 2) {
		if (mark == 2)
			str += "<option selected='selected' value='2'>G</option>";
		else
			str += "<option value='2'>G</option>";
	} else if (gradesys == 3) {
		if (mark == 4)
			str += "<option selected='selected' value='4'>3</option>";
		else
			str += "<option value='4'>3</option>";
		if (mark == 5)
			str += "<option selected='selected' value='5'>4</option>";
		else
			str += "<option value='5'>4</option>";
		if (mark == 6)
			str += "<option selected='selected' value='6'>5</option>";
		else
			str += "<option value='6'>5</option>";
	} else {
		//alert("Unknown Grade System: "+gradesys);
	}

	str += "</select>";
	return str;
}

function hoverResult(cid, vers, moment, uid, firstname, lastname) {
	$("#Nameof").html(firstname + " " + lastname);

	// Start counting pixels
	msx = -1;
	msy = -1;

	AJAXService("DUGGA", {
		cid : cid,
		vers : vers,
		moment : moment,
		luid : uid
	}, "RESULT");
}

function changeGrade(elem, gradesys, cid, vers, moment, uid, mark, ukind) {
	mark = elem.value;
	AJAXService("CHGR", {
		cid : cid,
		vers : vers,
		moment : moment,
		luid : uid,
		mark : mark,
		ukind : ukind
	}, "RESULT");
}

function moveDist(e) {
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

function enterCell(thisObj)
{
		rProbe=$(thisObj).css('backgroundColor');
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
				}else{
						cliffton="#FFF";
				}
		
				$(thisObj).css('backgroundColor',cliffton);
		}
}

function leaveCell(thisObj)
{
		if(rProbe!=null&&rProbe!="transparent") $(thisObj).css('backgroundColor',rProbe);		
}


//----------------------------------------
// Renderer
//----------------------------------------

function returnedResults(data) {
	var str = "";
	var zstr = "";
	var ttr = "";
	var zttr = "";

	if (data['dugganame'] != "") {
		$.getScript(data['dugganame'], function() {
		$("#MarkCont").html(data['duggapage']);

//		alert(data['duggaparam']+"\n"+data['useranswer'] + "\n" + data['duggaanswer']);
		showFacit(data['duggaparam'],data['useranswer'],data['duggaanswer']);

	});

		$("#resultpopover").css("display", "block");
		//alert(data['duggaanswer']);
	} else {

		results = data['results'];

		str += "<table class='list'>";

		str += "<tr><th></th>";

		for ( j = 0; j < data['moments'].length; j++) {
			var jtem = data['moments'][j];
			if ((jtem['kind'] == 3 && jtem['moment'] == null) || (jtem['kind'] == 4)) {
				// Td-s for each variant or non-connected dugga.
				str += "<th style='border-left:2px solid white;'>";
				str += jtem['entryname'];
				str += "</th>";
			}
		}

		str += "</tr>";
		console.log(data);
		if (data['entries'].length > 0) {
			for ( i = 0; i < data['entries'].length; i++) {
				var user = data['entries'][i];

				str += "<tr class='fumo'>";

				// One row for each student
				str += "<td>";
				str += user['firstname'] + " " + user['lastname'] + "<br/>" + user['ssn'];
				str += "</td>";

				// Each of the section entries (i.e. moments)
				for ( j = 0; j < data['moments'].length; j++) {
					var moment = data['moments'][j];

					if ((moment['kind'] == 3 && moment['moment'] == null) || (moment['kind'] == 4)) {

						str += "<td style='padding:0px;'>";

						// We have data if there is a set of result elements for this student in this course... otherwise null
						studres = results[user['uid']];
						
						// There are results to display.
						str += "<table width='100%' class='innertable' >";
						str += "<tr>";

						//----------------------------------------------------------------------------------------------------------- Start Standalone
						// kind == 3 means dugga, moment == null means no parent dugga i.e. standalone
						if (moment['kind'] == 3 && moment['moment'] == null) {
							
							// We are now processing the moment entry in the moment object
							var foundgrade = null;
							var useranswer = null;
							var submitted = null;
							var marked = null;
							var variant = null;
							if (studres != null) {
								for (var l = 0; l < studres.length; l++) {
									var resultitem = studres[l];
									if (resultitem['moment'] == moment['lid']) {
										// There is a result to print
										foundgrade = resultitem['grade'];
										useranswer = resultitem['useranswer'];
										submitted = resultitem['submitted'];
										marked = resultitem['marked'];
										variant = resultitem['variant'];
										
										if(submitted!=null) submitted=new Date(submitted);
										if(marked!=null) marked=new Date(marked);
									}
								}
							}

							zstr = "";

							// If no result is found i.e. No Fist
							if (foundgrade == null && useranswer == null && submitted == null) {
								zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], null, "I");
							} else if (foundgrade != null) {
								zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], foundgrade, "U");								
							}
							else {
								zstr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], null, "U");	
							}
							
							// Fist
							if(useranswer!=null){
									zstr += "<img id='korf' style='padding-left:8px;margin-top:4px;' src='../Shared/icons/FistV.svg' onmouseover='hoverResult(\"" + querystring['cid'] + "\",\"" + querystring['coursevers'] + "\",\"" + moment['lid'] + "\",\"" + user['uid'] + "\",\"" + user['firstname'] + "\",\"" + user['lastname'] + "\");' />";
							}

							// If no submission - white. If submitted and not marked or resubmitted U - yellow. If G or better, green. If U, pink. visited but not saved lilac
							if((useranswer!=null&&foundgrade==null)||(foundgrade!=null&&submitted>marked)){
									yomama="background-color:#ffd";							
							}else if(foundgrade==1){
									yomama="background-color:#fed";							
							}else if(foundgrade>1){
									yomama="background-color:#dfe";							
							}else if(variant!=null&&useranswer==null){
									yomama="background-color:#F8E8F8";														
							}else{
									yomama="background-color:#fff";														
							}
							
							// Standalone Dugga -- we just need to make a dugga entry with the correct marking system.
							str += "<td style='"+yomama+"'>&nbsp;</td></tr><tr  style='border-top:2px solid #dbd0d8;' >";

							str += "<td style='"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>"+zstr;

							str += "</td>";
						}
						//------------------------------------------------------------------------------------------------------------- End Standalone
						

						//----------------------------------------------------------------------------------------------------------- Start Moment
						if (moment['kind'] == 4) {
							// Moment - which may or may not have quizes

							ttr = "";
							duggacnt = 0;
							for (var k = 0; k < data['moments'].length; k++) {
								var dugga = data['moments'][k];

								//--------------------------------------------------------------------------------------------------------- Start Dugga
								// If the id of current item is same as moment of a dugga
								if ((dugga['moment'] == moment['lid']) && (dugga['kind'] == 3)) {

									duggacnt++;

									// We now have number of listentry, student data, course information etc, are there any results?
									var foundgrade = null;
									var useranswer = null;
									var submitted = null;
									var marked = null;
									if (studres != null) {
										for (var l = 0; l < studres.length; l++) {
											var resultitem = studres[l];
											if (resultitem['moment'] == dugga['lid']) {
												// There is a result to print
												foundgrade = resultitem['grade'];
												useranswer = resultitem['useranswer'];
												submitted = resultitem['submitted'];
												marked = resultitem['marked'];
												variant = resultitem['variant'];

												if(submitted!=null) submitted=new Date(submitted);
												if(marked!=null) marked=new Date(marked);
											}
										}
									}

									zttr="";
									// If no result is found i.e. No Fist
									if (foundgrade == null && useranswer == null && submitted == null) {
										zttr += makeSelect(dugga['gradesystem'], querystring['cid'], querystring['coursevers'], dugga['lid'], user['uid'], null, "I");
									}else if (foundgrade != null){
										zttr += makeSelect(dugga['gradesystem'], querystring['cid'], querystring['coursevers'], dugga['lid'], user['uid'], foundgrade, "U");													
									}else {
										zttr += makeSelect(dugga['gradesystem'], querystring['cid'], querystring['coursevers'], dugga['lid'], user['uid'], null, "U");
									}
									if(useranswer!=null){
											zttr += "<img id='korf' style='padding-left:8px;margin-top:4px;' src='../Shared/icons/FistV.svg' onmouseover='hoverResult(\"" + querystring['cid'] + "\",\"" + querystring['coursevers'] + "\",\"" + dugga['lid'] + "\",\"" + user['uid'] + "\",\"" + user['firstname'] + "\",\"" + user['lastname'] + "\");' />";
									}

									// If no submission - white. If submitted and not marked or resubmitted U - yellow. If G or better, green. If U, pink. visited but not saved lilac
									if((useranswer!=null&&foundgrade==null)||(foundgrade!=null&&submitted>marked)){
											yomama="background-color:#ffd";							
									}else if(foundgrade==1){
											yomama="background-color:#fed";							
									}else if(foundgrade>1){
											yomama="background-color:#dfe";							
									}else if(variant!=null&&useranswer==null){
											yomama="background-color:#F8E8F8";														
									}else{
											yomama="background-color:#fff";														
									}

									if (duggacnt > 0){
										ttr += "<td style='border-left:2px solid #dbd0d8;"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>";
										ttr += dugga['entryname'] + " ";
								
									}else{
										ttr += "<td style='"+yomama+"' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>";
									}

									ttr+=zttr;

									ttr += "</td>";

								//--------------------------------------------------------------------------------------------------------- End Dugga
								
								} else if ((dugga['moment'] == moment['lid']) && (dugga['kind'] == 4)) {
									// Moment in moment
								}
							}

							zttr="";

							// We are now processing the moment entry in the moment object
							var foundgrade = null;
							if (studres != null) {
								for (var l = 0; l < studres.length; l++) {
									var resultitem = studres[l];
									if (resultitem['moment'] == moment['lid']) {
										// There is a result to print
										foundgrade = resultitem['grade'];

										// gradesys cid vers moment uid mark
										zttr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], resultitem['grade'], "U");
									}
								}
							}
							if (foundgrade == null) {
								zttr += makeSelect(moment['gradesystem'], querystring['cid'], querystring['coursevers'], moment['lid'], user['uid'], null, "I");
							}

							if(foundgrade==1){
									yomama="background-color:#fed";							
							}else if(foundgrade>1){
									yomama="background-color:#dfe";							
							}else{
									yomama="background-color:#fff";														
							}
							
							if (duggacnt == 0) {
								ttr += "<td style='"+yomama+"'>&nbsp;</td>";
								str += "<td style='"+yomama+"' colspan='1' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>";
							} else {
								str += "<td style='"+yomama+"' colspan='" + duggacnt + "' onmouseover='enterCell(this);' onmouseout='leaveCell(this);'>";
							}
							
							str+= moment['entryname'] +" " +zttr;

							str += "</td></tr><tr style='border-top:2px solid #dbd0d8;'>";
							str += ttr;
						}
						//----------------------------------------------------------------------------------------------------------- End Moment

						str += "</tr>";
						str += "</table>";

						str += "</td>";
					}
				}
				str += "</tr>";
			}
		}

		var slist = document.getElementById("content");
		slist.innerHTML = str;
	}

	if (data['debug'] != "NONE!")
		alert(data['debug']);

}

