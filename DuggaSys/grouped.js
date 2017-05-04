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
	
	str+="<th id='header' class='grouprow' ><span>#<span></th>";
	str+="<th colspan='1' id='subheading' class='result-header'>";
	str+="Studenter";
	str+="</th>";

	// Read dropdown from local storage (??)
	courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
	if (courselist){	
		courselist=courselist.split("**"); 
	} 
	
	// Itererate the headings, that are dependent on the cid and coursevers. 
	if(headings){
		for(var i = 0; i < headings.length; i++) {
			str+="<th id="+headings[i].lid+" title ='Listentry id "+headings[i].lid+"' class='result-header'>"+headings[i].entryname+"</th>";	
		}
	}
	
	str+="</thead>";
	// Iterate the tablecontent. 
	str += "<tbody>";
	var row=0;

	for(var i = 0; i < tablecontent.length; i++) { // create table rows. 
		row++;
		str+="<tr>";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		str+="<td title='"+tablecontent[i].firstname+" "+tablecontent[i].lastname+" "+tablecontent[i].ssn+"'>"+tablecontent[i].username+"</td>"; // Iterates all content, but i dont want to write out ugid, cid and lid ...
		for(var lid in tablecontent[i].lidstogroup) { // Table cells
			// uid_lid to identify the cell. The ugid is supplied in the option. Is the cid a necessity? 
			str+="<td>";
			str+="<select id="+tablecontent[i].uid+"_"+lid+" onchange=changegroup()>";
			str+="<option value='-1'>Pick a group</option>";
			for(var j = 0; j < availablegroups.length; j++) {
				var selected = tablecontent[i].lidstogroup[lid] == availablegroups[j] ? " selected" : null;
				str+="<option value="+availablegroups[j]+selected+">Group "+availablegroups[j]+"</option>";
			}
			str+="</select>";
			str+="</td>";
		}
		str+="</tr>";
	}
	str += "</tbody>";
	str+="</table>";
	document.getElementById("content").innerHTML=str;
		
}

// Placeholder function for making AJAX request to assign a group to a lid. 
function changegroup() {
	console.log('You have tried to change a group');
}