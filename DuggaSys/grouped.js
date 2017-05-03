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
function Groupbutton(){
	alert("test");
}

function selectGroup(name)
{
	// Set Name		
	$("#groupname").val(name);
	$("sectionnamewrapper").html("<input type='text' class='form-control textinput' id='sectionname' value='"+name+"' style='width:448px;'/>");
	
	//Display pop-up
	$("#groupSection").css("display","block");
	$("#overlay").css("display","block");
}

function createGroup()
{
	alert("Group should be created");
	$("#groupSection").css("display","none");
	$("#overlay").css("display","none");
}

function returnedGroup(data)
{
	
	var headings = data.headings;
	var tablecontent = data.tablecontent;
	/* entries=data.entries;
	moments=data.moments;
	versions=data.versions;
	results=data.results;*/
	
	allData = data; // used by dugga.js (for what??)
			
	// Init the table string. 
	str="";
	
	str+="<table class='navheader'><tr class='trsize'>";
	str+="<td ><input style='display: inline-block; margin-right:2px; width:112px;' type='button' value='New Group' class='submit-button' onclick='selectGroup();'/>";
	str+="</tr></table>";
	

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
	for(var i = 0; i < headings.length; i++) {
		str+="<th id="+headings[i].lid+" title ='Listentry id "+headings[i].lid+"' class='result-header'>"+headings[i].entryname+"</th>";	
	}
	
	str+="</thead>";
	// Iterate the tablecontent. 
	str += "<tbody>";
	var row=0;

	for(var i = 0; i < tablecontent.length; i++) { // create table rows. 
		row++;
		str+="<tr>";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		str+="<td title="+tablecontent[i].uid+">"+tablecontent[i].username+"</td>"; // Iterates all content, but i dont want to write out ugid, cid and lid ...
		for(var lid in tablecontent[i].lidstogroup) {
			if(lid != null) {
				str+="<td>"+tablecontent[i].lidstogroup[lid]+"</td>";
			}
		}
		str+="</tr>";
	}
	str += "</tbody>";
	str+="</table>";
	document.getElementById("content").innerHTML=str;
		
}

// Placeholder function for making AJAX request to assign a group to a lid. 
function togglelid() {
	console.log('You have tried to toggle a lid');
}