var querystring = parseGet();
var subheading=0;
var allData;
var momtmp=new Array;
var availablegroups=new Array;
var moments=new Array;
var versions;
var courselist;
var students=new Array;
var tablecontent=new Array;
var typechanged=false;
var duggaArray = [[]];
function setup(){
	
	var filt = "";
	filt+="<td id='select' class='navButt'><span class='dropdown-container' onmouseover='hoverFunnel();'>";
	filt+="<img class='navButt' src='../Shared/icons/tratt_white.svg'>";
	filt+="<div id='dropdownc' class='dropdown-list-container'>";
	filt+="</div>";
	filt+="</span></td>";
  
	filt+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hoverFilter();'>";
	filt+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
	filt+="<div id='dropdownFilter' class='dropdown-list-container'>";
	filt+="<p>Test</p>";
	filt+="</div>";
	filt+="</span></td>";
	$("#menuHook").before(filt);
		
	AJAXService("GET", { cid : querystring['cid'],vers : querystring['coursevers'] }, "GROUP");
}

function checkedAll() {
  // Current state
  var duggaElements = document.getElementsByName("selectdugga");
  var selectToggle = document.getElementById('selectdugga');

  // Are there any elements checked?
  var anyChecked = false;

  for (var i =0; i < duggaElements.length; i++) {
    if(duggaElements[i].checked) {
      anyChecked = true;
      break;
    }
  }

  // Yes, there is at lease one element checked, so default is clear
  if(anyChecked) {
    selectToggle.checked = false;
    for (var i =0; i < duggaElements.length; i++) {
      duggaElements[i].checked = false;    
    }
  } else { // There are no element(s) checked, so set all
    selectToggle.checked = true;
    for (var i =0; i < duggaElements.length; i++) {
      duggaElements[i].checked = true;    
    }
  }
}

function toggleAll() {
  // Current state
  var duggaElements = document.getElementsByName("selectdugga");
  var selectToggle = document.getElementById('selectdugga');

  // Are there any elements checked?
  var anyChecked = false;

  for (var i =0; i < duggaElements.length; i++) {
    if(duggaElements[i].checked) {
      anyChecked = true;
      break;
    }
  }

  selectToggle.checked = anyChecked;
}

function hoverFunnel()
{
	toggleAll(); // Check toggle all if there are any elements checked
    $('#dropdowns').css('display','none');
  	$('#dropdownc').css('display','block');
}

function leaveFunnel()
{
	$('#dropdownc').css('display','none');   
	
	// Update columns only now
	var str="";
	$(".headercheck").each(function(){
			str+=$(this).attr("id")+"**"+$(this).is(':checked')+"**";
	});
  
  showTeachers=$('#showteachers').is(":checked");
  	old=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
  	localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees",str);

  onlyPending=$('#pending').is(":checked");
    var opend=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-pending");
    localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-pending", onlyPending);

	if(str!=old || onlyPending==opend) process();
  
}

function checkMomentParts(pos, id) {
	for (var i = 0; i < duggaArray[pos].length; i++) {
		var setThis = document.getElementById(duggaArray[pos][i]);
		setThis.checked = document.getElementById(id).checked;
	}
}

function hoverFilter()
{
	$('#dropdownc').css('display','none');
  	$('#dropdownFilter').css('display','block');
}

function leaveFilter()
{
	$('#dropdownFilter').css('display','none'); 
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
}

function process()
{			
		// Read dropdown from local storage
		clist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
		if (clist){	
				clist=clist.split("**"); 
		} 

		// Create temporary list that complies with dropdown
		momtmp=new Array;
		var momname = "tore";
		for(var l=0;l<moments.length;l++){
				if (moments[l].kind===4){
						momname = moments[l].entryname;
				}
				moments[l].momname = momname;		
		}
		
		// Create temporary list that complies with dropdown
		momtmp=new Array;
		for(var l=0;l<moments.length;l++){
				if (clist !== null ){
						index=clist.indexOf("hdr"+moments[l].lid+"check");
						if(clist[index+1]=="true"){
								momtmp.push(moments[l]);
						}
				} else {
						/* default to show every moment/dugga */
						momtmp.push(moments[l]);
				}
		}

		// Get groups
		for(i=0;i<availablegroups.length;i++){
			var uid=availablegroups[i].uid;
		}
		
			// Update dropdown list
		var dstr="";

    	dstr+="<div class='checkbox-dugga checkmoment' style='border-bottom:1px solid #888'><input type='checkbox' class='headercheck' name='selectduggatoggle' id='selectdugga' onclick='checkedAll();'><label class='headerlabel'>Select all/Unselect all</label></div>";

    	var activeMoment = 0;
    	for(var j=0;j<moments.length;j++){

				var lid=moments[j].lid;
				var name=moments[j].entryname;
				dstr+="<div class='checkbox-dugga";				
				if (moments[j].visible == 0) {dstr +=" checkhidden";}
				
				if (moments[j].kind == 4) {dstr +=" checkmoment";}
				
				dstr+="'><input name='selectdugga' type='checkbox' class='headercheck' id='hdr"+lid+"check'";
            	if (moments[j].kind == 4) {
                    duggaArray.push( [] );
                    var idAddString = "hdr"+lid+"check";
                	dstr+=" onclick='checkMomentParts(" + activeMoment + ", \"" + idAddString + "\"); toggleAll();'";
                    activeMoment++;
                }

				if (clist){
						index=clist.indexOf("hdr"+lid+"check");
						if(index>-1){
								if(clist[index+1]=="true"){
										dstr+=" checked ";
								}
						}										
				}	else {
						/* default to check every visible dugga/moment */
						if (moments[j].visible != 0) dstr+=" checked ";
				}			
				dstr+=">";
				dstr+= "<label class='headerlabel' id='hdr"+lid;
				dstr+="' for='hdr"+lid+"check' ";
				dstr+=">"+name+"</label></div>";
		}
		dstr+="<div style='display:flex;justify-content:flex-end;border-top:1px solid #888'><button onclick='leaveFunnel()'>Filter</button></div>";
 
	document.getElementById("dropdownc").innerHTML=dstr;
	var dstr="";

	// Sorting
    dstr+="<div class='checkbox-dugga'><label class='headerlabel' for='sortdir1'>Sort students by:</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(0)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Username</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(1)' value='0' id='sortcol0_1'><label class='headerlabel' for='sortcol0_1' >Firstname</label></div>";
	dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(2)' value='0' id='sortcol0_2'><label class='headerlabel' for='sortcol0_2' >Lastname</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(3)' value='0' id='sortcol0_3'><label class='headerlabel' for='sortcol0_3' >SSN</label></div>";		
	dstr+="<div style='display:flex;justify-content:flex-end;'><button onclick='leaveFilter()'>Sort</button></div>"
	document.getElementById("dropdownFilter").innerHTML=dstr;
}

function drawtable(){
	// Init the table string. 
	str="";
	
	
	str+="<div class='titles' style='padding-bottom:10px;'>";
	str+="<h1 style='flex:10;text-align:center;'>Groups</h1>";
	str+="<input style='float:none;flex:1;max-width:85px;' class='submit-button' type='button' value='New Group' onclick='selectGroup();'/>";
	str+="</div>";

	// Create the table headers. 
	str+="<table class='markinglist' id='markinglist'>";
	str+="<thead>";
	str+="<tr class='markinglist-header'>";
	
	str+="<th id='header' class='grouprow' style='width:40px'><span>#<span></th>";

	str+="<th id=tableheader"+(subheading)+" class='grouped-header' onclick='toggleSortDir(0);' style='width:140px;'>Studenter</th>";


	// Itererate the headings, that are dependent on the cid and coursevers. 
	if(moments){
		for(var i = 0; i < moments.length; i++) {

			str+="<th id=tableheader"+(i+1)+" title ='Listentry id "+moments[i].lid+"' class='grouped-header' colspan='1' style='min-width:140px;padding: 0px 8px 0px 8px;' onclick='toggleSortDir("+(i+1)+");'>"+moments[i].entryname+"</th>";	

		}
	}
	str+="</thead>";
	str += "<tbody>";
	var row=0;
	for(var i = 0; i < tablecontent.length; i++) { // Iterate table content, beginning with the row number and user data. 
		row++;
		// Apply class to every other row for easier browsing using ternary operator
		str+="<tr class='"+ (row % 2 == 1 ? 'hi' : 'lo') + "'>";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		str+="<td style='padding-left:3px;' title="+tablecontent[i].uid+"><div class='dugga-result-div'>"+tablecontent[i].firstname+" "+tablecontent[i].lastname+"</div>";
		str+="<div class='dugga-result-div'>"+tablecontent[i].ssn+"</div>";
		str+="<div class='dugga-result-div'>"+tablecontent[i].username+"</div></td>";
		for(var lid in tablecontent[i].lidstogroup) { // Iterate the data per list entry column
			str+="<td style='padding-left:5px;'>";
			var oldUgid = tablecontent[i].lidstogroup[lid] != false ? "_"+tablecontent[i].lidstogroup[lid] : "";
			str+="<div class='groupStar'>*</div><select id="+tablecontent[i].uid+"_"+lid+oldUgid+" class='test' onchange=changegroup(this)>";
			str+="<option value='-1'>Pick a group</option>"; // Create the first option for each select
			for(var level2lid in availablegroups) {
				// Iterate the groups in each lid, example: 
				/*
				"availablegroups": {
					"2001": { // Lid to iterate
						"1": "Festargruppen" // Available groups with ugid as key, name as value
					},
					"2013": {
						"2": "Coola gurppen"
					}
				}
				*/
				if(level2lid == lid) { // If the group belongs to the current column, lid, iterate all the available groups and create options for them
					for(var ugid in availablegroups[level2lid]) {
						// Iterate one level below like: 
						/*
						"2001":
							"1": "Festargruppen" // Available groups with ugid as key, name as value
						},
						*/
						var selected = tablecontent[i].lidstogroup[lid] == ugid ? " selected" : ""; // Create the selected attribute if applicable
						str+="<option value="+ugid+selected+">"+availablegroups[level2lid][ugid]+"</option>";
					}
				}
			}
			str+="</select><div class='groupStar'>*</div>";
			str+="</td>";
		}
		str+="</tr>";
	}
	str += "</tbody>";
	str+="</table>";
	
	document.getElementById("content").innerHTML=str;
}

function selectGroup()
{
	var inp = "";
	for(i=0; i<moments.length; i++){
		inp+="<option value='i'>"+moments[i].entryname+"</option>";
	}
	document.getElementById("selectMoment").innerHTML=inp;
	
	//Display pop-up
	$("#groupSection").css("display","block");
	$("#overlay").css("display","block");
}

function createGroup()
{
	name=$("#name").val(); 
	if(name){
		AJAXService("NEWGROUP",{name:name},"GROUP"); 
		$("#groupSection").css("display","none");
		$("#groupNameError").css("display","none");
		$("#overlay").css("display","none");
		$("#name").val('');
		window.location.reload();	
	}
	else{
		$("#groupNameError").css("display","block");
	}
}

function returnedGroup(data)
{
	var headings = data.headings;
	moments=data.moments;
	tablecontent = data.tablecontent;
	availablegroups = data.availablegroups; // The available groups to put users in
	
	
	/* availablegroups=data.availablegroups;
	moments=data.moments;
	versions=data.versions;
	results=data.results;*/
	
	// Read dropdown from local storage (??)
	courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
	if (courselist){	
		courselist=courselist.split("**"); 
	} 
	var str="";
	//Show table 
	drawtable();
	
	$(document).ready(function () {
		$("#filter").mouseleave(function () {
				leaveFilter();
		});
	});
	$(document).ready(function () {
						$("#dropdownc").mouseleave(function () {
								leaveFunnel();
						});
		});
	
	allData = data; // used by dugga.js (for what??)
	process();
	
	
		
}

/**
 * @WIP
 * Function to make a AJAXRequest to update the group of a student. 
 * Is called when a dropdown menu is changed.
 * @param changedElement - the DOM object of the changed element. 
 */
function changegroup(changedElement) {
	var elementId = changedElement.id; // contains uid_lid_oldUgid (oldUgid if applicable)
	var value = changedElement.value; // the new ugid (the value of the selected option)
	
	var arr = elementId.split("_");
	var uid = arr[0];
	var lid = arr[1];
	var oldUgid = arr[2];
	
	// Create JSON object that is to be sent to the AJAXRequest
	data = {
		'uid':uid,
		'lid':lid,
		'newUgid':value,
		'oldUgid':oldUgid
	};
	
	// This AJAXService will map uid to ugid in user_usergroup
	AJAXService("UPDATEGROUP", data, "GROUP");
}

function resort()
{
	// Read sorting config from localStorage to get the right order in table	
	var sortdir=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
	if (sortdir === null || sortdir === undefined){dir=1;}
	$("#sortdir"+sortdir).prop("checked", true);
	var columno=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
	if (columno === null || columno === undefined ){columno=0;}
	var colkind=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1");
	if (colkind == null || colkind == undefined){colkind=0;}
	
	if (tablecontent.length > 0) {
		if(columno < tablecontent.length){
			// Each if case checks what to sort after and then sorts appropiatle depending on ASC or DESC
			if(columno==0){
				if(colkind==0){	
					tablecontent.sort(function compare(a,b){ 
						if(a.username>b.username){
							return sortdir;
						}else if(a.username<b.username){
								return -sortdir;
						}else{
							return 0;
						}
					});
				}
				else if(colkind==1){	
					tablecontent.sort(function compare(a,b){ 
						if(a.firstname>b.firstname){
							return sortdir;
						}else if(a.firstname<b.firstname){
								return -sortdir;
						}else{
							return 0;
						}
					});
				}
				else if(colkind==2){	
					tablecontent.sort(function compare(a,b){ 
						if(a.lastname>b.lastname){
							return sortdir;
						}else if(a.lastname<b.lastname){
								return -sortdir;
						}else{
							return 0;
						}
					});
				}
				else if(colkind==3){	
					tablecontent.sort(function compare(a,b){ 
						if(a.ssn>b.ssn){
							return sortdir;
						}else if(a.ssn<b.ssn){
								return -sortdir;
						}else{
							return 0;
						}
					});
				}
			}else{
				// other columns sort by
				// 0. no group/groups
				if(columno > 0){
					tablecontent.sort(function compare(a,b){
						if(a.lidstogroup[moments[columno-1].lid]!=false && b.lidstogroup[moments[columno-1].lid]==false ){
								return -sortdir;
						} else if(a.lidstogroup[moments[columno-1].lid]==false  && b.lidstogroup[moments[columno-1].lid]!=false ){
								return sortdir;
						}else{	
							if(a.lidstogroup[moments[columno-1].lid]>b.lidstogroup[moments[columno-1].lid]){		  				
									return sortdir;
							}else if(a.lidstogroup[moments[columno-1].lid]<b.lidstogroup[moments[columno-1].lid]){
									return -sortdir;
							}else{
									return 0;
							}
						}
					});								
				}
			}					 
		}
	}
		
	drawtable();
	//Highlights the header that has been clicked and shows ASC or DESC icon
	for(var m=0;m<=columno;m++){
		$("#tableheader"+columno).removeClass("result-header-inverse");
	}	
	if(columno == 0){
		$("#tableheader0").addClass("result-header-inverse"); 
	}else{
		$("#tableheader"+columno).addClass("result-header-inverse"); 
	}
    if (sortdir<0){
		if(columno == 0){
			$("#tableheader"+columno).empty();
			$("#tableheader"+columno).append("Studenter");
			$("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
		}else{
			$("#tableheader"+columno).empty();
			$("#tableheader"+columno).append(moments[columno-1].entryname);
			$("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
		}
    }else{
		if(columno == 0){
			$("#tableheader"+columno).empty();
			$("#tableheader"+columno).append("Studenter");
			$("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>");
		}else{		
			 $("#tableheader"+columno).empty();
			 $("#tableheader"+columno).append(moments[columno-1].entryname);
			 $("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>"); 
		}  
	}
}

// If col and current col are equal we flip sort order 
function toggleSortDir(col){
    var dir = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
    var ocol=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
  	if (col != ocol){
		$("input[name='sortcol']:checked").prop({"checked":false});
        $("input[name='sorttype']:checked").prop({"checked":false});
        if (col == 0){
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1",1);
        }else{
            $("#sortcol"+col).prop({"checked":true});          
            $("#sorttype0").prop({"checked":true});                      
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", 0);          
        }
        dir=-1;
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol", col);          
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);                
    }else{
		dir=dir*-1;
		$("input[name='sortdir']:checked").val(dir);
		localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);
    }
    resort();  
}

