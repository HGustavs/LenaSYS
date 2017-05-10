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
function setup(){
	
	var filt = "";
	filt+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hoverFilter();'>";
	filt+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
	filt+="<div id='dropdownFilter' class='dropdown-list-container'>";
	filt+="<p>Test</p>";
	filt+="</div>";
	filt+="</span></td>";
	$("#menuHook").before(filt);
		
	AJAXService("GET", { cid : querystring['cid'],vers : querystring['coursevers'] }, "GROUP");
}

function hoverFilter()
{
  	$('#dropdownFilter').css('display','block');
}

function leaveFilter()
{
	$('#dropdownFilter').css('display','none'); 
}

function selectGroup()
{
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
		var dstr="";

	// Sorting
    dstr+="<div class='checkbox-dugga'><label class='headerlabel' for='sortdir1'>Sort students by:</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(0)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Username</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(1)' value='0' id='sortcol0_0'><label class='headerlabel' for='sortcol0_0' >Firstname</label></div>";
	dstr+="<div class='checkbox-dugga' ><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(2)' value='0' id='sortcol0_1'><label class='headerlabel' for='sortcol0_1' >Lastname</label></div>";
	dstr+="<div class='checkbox-dugga'><input name='sortcol' type='radio' class='sortradio' onclick='sorttype(3)' value='0' id='sortcol0_2'><label class='headerlabel' for='sortcol0_2' >SSN</label></div>";		
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
	str+="<th id=tableheader0' class='grouped-header' onclick='toggleSortDir(0);' style='width:140px;'>Studenter</th>";

	// Read dropdown from local storage (??)
	courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
	if (courselist){	
		courselist=courselist.split("**"); 
	} 
	
	// Itererate the headings, that are dependent on the cid and coursevers. 
	if(moments){
		for(var i = 0; i < moments.length; i++) {
			str+="<th id=tableheader"+(i+1)+" title ='Listentry id "+moments[i].lid+"' class='grouped-header' colspan='1' style='min-width:140px;padding: 0px 8px 0px 8px;' onclick='toggleSortDir("+(i+1)+");'>"+moments[i].entryname+"</th>";	
		}
	}
	str+="</thead>";
	// Iterate the tablecontent. 
	str += "<tbody>";
	var row=0;
	for(var i = 0; i < tablecontent.length; i++) { // create table rows. 
		row++;
		str+="<tr";
		if(row%2==1){
			str+=" class='hi' ";
		}else{
			str+=" class='lo' ";
		}
		str+=">";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		str+="<td style='padding-left:3px;'><div class='dugga-result-div'>"+tablecontent[i].firstname+" "+tablecontent[i].lastname+"</div>";
		str+="<div class='dugga-result-div'>"+tablecontent[i].ssn+"</div>";
		str+="<div class='dugga-result-div'>"+tablecontent[i].username+"</div></td>";
		for(var lid in tablecontent[i].lidstogroup) { // Table cells
			// uid_lid to identify the cell. The ugid is supplied in the option. Is the cid a necessity? 
			str+="<td style='padding-left:5px;'>";
			str+="<div class='groupStar'>*</div><select id="+tablecontent[i].uid+"_"+lid+" class='test' onchange=changegroup()>";
			str+="<option value='-1'>Pick a group</option>";
			for(var ugid in availablegroups) {
				var selected = tablecontent[i].lidstogroup[lid] == ugid ? " selected" : "";
				str+="<option value="+ugid+selected+">"+availablegroups[ugid]+"</option>";
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
	var elementId = changedElement.id; // contains uid_lid
	var value = changedElement.value; // the new ugid
	
	var arr = elementId.split("_");
	var uid = arr[0];
	var lid = arr[1];
	
	// Create JSON object that is to be sent to the AJAXRequest
	data = {
		'uid':uid,
		'lid':lid,
		'ugid':value
	};
	
	// Placeholder
	// 				 "UPDATE", data, "GROUP" ?
	// AJAXRequest(<action>, <data>, <domain>);
	
	// Must make a query in AJAXRequest to insert mappings: 
	// uid to ugid in user_usergroup
	// ugid to lid in usergroup_listentries
	
	// Debugger, needed for now
	console.log('You have tried to change a group');
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
				if(colkind==1){	
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
	for(var m=0;m<columno;m++){
		$("#tableheader"+columno).removeClass("result-header-inverse");
	}
	$("#tableheader"+columno).addClass("result-header-inverse"); 
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
        if (col == 0){
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1",1);
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

