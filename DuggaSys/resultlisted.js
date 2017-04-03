/********************************************************************************

   Documentation <-- Top of file contains documentation e.g. call order and in some cases list of important bugs and/or version history

*********************************************************************************

Execution Order
---------------------
 #1 returnedResults() is first function to be called through AJAX

-------------==============######## Documentation End ###########==============-------------

*/

/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind = 0;
var querystring = parseGet();
var filez;
var mmx = 0, mmy = 0;
var msx = 0, msy = 0;

AJAXService("GET", {cid : querystring['cid']}, "RESULTLIST");

$(function() 
{
	$("#release").datepicker({dateFormat : "yy-mm-dd"});
	$("#deadline").datepicker({dateFormat : "yy-mm-dd"});
});


//----------------------------------------
// Padstring (adds a size to the string, if 2 characters used, you can specify how large it is (includes white spaces))
//----------------------------------------

function padstring(str, padno, kind) // Right Padding
{
	if (kind === 1) {
		if (str.length > padno) {
			newstr = str.substring(0, padno);
		} else {
			newstr = str;
			padcnt = padno - str.length;
			for (var io = 0; io < padcnt; io++) {
				newstr += "&nbsp;";
			}
		}
//		newstr += "&#9474;";
	}
	return newstr;
}
//----------------------------------------
// return from AJAX -  	One row for each student and Print as follows:
//	                1. Start with ssn row. Add Padding for each of the other columns. 2. Write Name. Write values for each of the columns 3. Write Study Program. Add Padding for each of the other columns.
//			SSn Padded to 24, Name Padded to 24   --- Results. Perhaps if overflow add more rows? Study Program Padded to 24
//----------------------------------------
function returnedResults(data) 
{
	str = "";
	var sidanr = 0;

	if (data['dugganame'] != "") {
		$("#MarkCont").html(data['duggapage']);
		$("#resultpopover").css("display", "block");
	} else {
	//------------------------------------------------------
	//make list pages for each "moment" within a course
	//------------------------------------------------------
	if (data['moments'].length > 0) {
		for ( u = 0; u < data['moments'].length; u++) {
			var segment = data['moments'][u];
			if(segment['kind'] == 4) {
				sidanr++; //another page increasement
				results = data['results'];

				var listnr ="";
				var listresponsible ="";
				var responsibledate ="";
				var provdatum="";
				var listid="";
				
				for ( ut = 0; ut < data['list'].length; ut++) {
				var listitem = data['list'][ut];
					if(listitem['listeriesid'] == segment['lid']) {
						listnr = listitem['listnr'];
						listresponsible = listitem['responsible'];
						responsibledate = listitem['responsibledate'];
						provdatum = listitem['provdatum'];
						listid = listitem['listid'];
					}
				}
				str+="<div class='listbar' style='margin-top:6px'><input class='new-item-button' type='button' value='Edit List' onclick='displayeditlist("+listid+");'/></div>";
				str += "</br></br></br><pre class='Trow'>";
				str += "H&ouml;gskolan i Sk&ouml;vde                        RS01 Resultat p&aring; prov\n";
				str += "Institutionen f&ouml;r informationsteknologi R&auml;ttningsprotokoll: Inl&auml;ggning, betyg p&aring; prov\n";
				str += listresponsible + "</div>  "+responsibledate+"                            Sida  "+sidanr+"\n";
				str += "&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;\n";
				str += data['versions'][0]['coursecode']+"     7.5     "+data['versions'][0]['coursename']+" G1N\n";
				str += "1003       2.5    "+segment['entryname']+" \n";
				if(listitem['listnr'] == ""){
					str += "List nr       <span style='color:Red'>Not set</span>\n\n";
				}else{
					str += "List nr       "+listnr+"\n\n";	
				}
				
				str += "Provdatum   "+provdatum+"\n\n";
				str += "Lärare                       ........................................................\n\n";
				str += "Medrättande lärare           ........................................................\n\n";
				str += "</pre>";

				str += "<pre class='Trow'>";
				str += "                          Anm      A     B    C    1    2    3    4    5    6    7    8  &#9474;\n";
				str += "</pre>";

				if (data['entries'].length > 0) {
					for ( i = 0; i < data['entries'].length; i++) {
						var user = data['entries'][i];
				
						str += "<pre class='Trow'>";
						str += "&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9532;";
						str += "\n";
						str += user['ssn']+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9474;"+padstring("",8,1)+padstring("",5,1)+padstring("",5,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+padstring("",4,1)+"<br/>";
						str += padstring(user['firstname'] + " " + user['lastname'], 23, 1) + "&#9474;";
						
						//--------------------------------------------
						// Each of the section entries (i.e. moments)
						//--------------------------------------------

						studres = results[user['uid']]; 	// We have data if there is a set of result elements for this student in this course... otherwise null

						//--------------------------------------------
						// Each of the section entries (i.e. moments), and the grades of the 'moments' for all students under this course-moment
						//--------------------------------------------
						var foundres = null;
						str += padstring("", 8, 1);
						if (studres != null) {
						
							for (var l = 0; l < studres.length; l++) {
								var resultitem = studres[l];
							
								if (resultitem['moment'] == segment['lid']) { //if the students 'moment' for the result is the same as the course-listerie we're under of kind 4 (moment)
				
									var gradeletter ="";
									if(resultitem['grade'] == 1){
									gradeletter = "U";
									}
									else if(resultitem['grade'] == 2){
									gradeletter = "G";
									}
									else if(resultitem['grade'] == 3){
									gradeletter = "VG";
									}
									else if(resultitem['grade'] == 4){
									gradeletter = '3';
									}
									else if(resultitem['grade'] == 5){
									gradeletter = '4';
									}
									else if(resultitem['grade'] == 6){
									gradeletter = '5';
									}
									str += padstring(gradeletter, 4, 1);
								}
							}
						}
						str += padstring("", 5, 1);
						str += padstring("", 5, 1);
						str += padstring("", 4, 1);
						//--------------------------------------------
						// Each of the section entries (i.e. moments), and the grades of the 'moments' for all students under this course-listerie  we're under of kind 3 (tests)
						//--------------------------------------------
						for ( j = 0; j < data['moments'].length; j++) {
							var moment = data['moments'][j];
								if ((moment['kind'] === 3)) {
									if (studres != null) {
								
										for (var l = 0; l < studres.length; l++) {
											var resultitem = studres[l];
											if (resultitem['moment'] == moment['lid'] && (moment['moment'] == segment['lid']) ) {
												var gradeletter ="";
												if(resultitem['grade'] == 1){
												gradeletter = "U";
												}
												else if(resultitem['grade'] == 2){
												gradeletter = "G";
												}
												else if(resultitem['grade'] == 3){
												gradeletter = "VG";
												}
												else if(resultitem['grade'] == 4){
												gradeletter = '3';
												}
												else if(resultitem['grade'] == 5){
												gradeletter = '4';
												}
												else if(resultitem['grade'] == 6){
												gradeletter = '5';
												}
												str += padstring(gradeletter, 5, 1);
											}
										}
									}
								}
						}
						str += "\n"+padstring(user['studyProgram'],16,1)+ padstring(user['class'],7,1)+"&#9474;<br/>";
						str += "</pre>";
					}
				}
				str += "</br></br></br></br>";
				var slist = document.getElementById("content");
				slist.innerHTML = str;
			}
		}
	}
		//else end
	}

	if (data['debug'] != "NONE!")
		alert(data['debug']);

}

function displayeditlist(listid){

$("#savelistid").val(listid);
$("#editlist").css("display","block");
}
function updatelist(){
var listid = $("#savelistid").val();
var dateissue = $("#dateissue").val();
var listnumber = $("#listnumber").val();
var examdate = $("#examdate").val();
var listissuer = $("#listissuer").val();

AJAXService("UPDATELIST",{cid : querystring['cid'],listid:listid,dateissue:dateissue,listissuer:listissuer,listnumber:listnumber,examdate:examdate},"RESULTLIST");

}
