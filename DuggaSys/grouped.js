var querystring = parseGet();
var subheading=0;
var allData;
var momtmp=new Array;
var entries;
var moments;
var versions;
var courselist;

function setup(){  	
	AJAXService("GET", { cid : querystring['cid'],vers : querystring['coursevers'] }, "GROUP");
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

function returnedGroup(data)
{
	// console.log(data);
	var headings = data.headings;
	var tablecontent = data.tablecontent;
	var availablegroups = data.availablegroups; // The available groups to put users in
	
	/* entries=data.entries;
	moments=data.moments;
	versions=data.versions;
	results=data.results;*/
	
	allData = data; // used by dugga.js (for what??)
			
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
	str+="<th id='subheading' class='result-header' style='width:140px;'>Studenter</th>";

	// Read dropdown from local storage (??)
	courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
	if (courselist){	
		courselist=courselist.split("**"); 
	} 
	
	// Itererate the headings, that are dependent on the cid and coursevers. 
	if(headings){
		for(var i = 0; i < headings.length; i++) {
			str+="<th id="+headings[i].lid+" title ='Listentry id "+headings[i].lid+"' class='result-header' colspan='1' style='min-width:140px;padding: 0px 8px 0px 8px;'>"+headings[i].entryname+"</th>";	
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
