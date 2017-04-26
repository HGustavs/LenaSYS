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

function returnedGroup(data)
{
	console.log(data);
	var headings = data.headings;
	var tableContent = data.tableContent;
	/* entries=data.entries;
	moments=data.moments;
	versions=data.versions;
	results=data.results;*/
	
	allData = data; // used by dugga.js (for what??)
			
	// Init the table string. 
	str="";

	// Create the table headers. 
	str+="<table class='markinglist' id='markinglist'>";
	str+="<thead>";
	str+="<tr class='markinglist-header'>";
	
	str += "<th id='header' class='grouprow' ><span>#<span></th>";
	str+="<th colspan='1' id='subheading' class='result-header'>";
	str+="Studenter";
	str+="</th>";

	str+="<th colspan='1' id='subheading' class='result-header'>";
	str+="Grupper";
	str+="</th>";

	
	//drawtable();	
	// Read dropdown from local storage
	courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
	if (courselist){	
		courselist=courselist.split("**"); 
	} 
	
	// Itererate the headings, that are dependent on the cid and coursevers. 
	for(var i = 0; i < headings.length; i++) {
		str+="<th class='result-header'>"+headings[i].entryname+"</th>";	
	}
	
	
	
	/* str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Grupper'>Grupper</div></th>"	
	str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Uppgifter'>Uppgifter</div></th>"	
	str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Aktiv'>Aktiv i kursen</div></th>"	
/*	for(var l=0;l<moments.length;l++){
		if(moments[l].name){
			str+="</tr><tr class='markinglist-header'>";
			str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].username+"'>"+moments[l].username+"</div></th>";	
			
			str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].name+"'>"+moments[l].name+"</div></th>";	
			str+="</tr>";
			

		}
	} */
	str+="</thead>";
	// Iterate the tableContent. 
	str += "<tbody>";
	var row=0;
	for(var i = 0; i < tableContent.length; i++) { // create table rows. 
		row++;
		str+="<tr>";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		for(var j = 1; j < tableContent[i].length; j++) {
			str+="<td>"+tableContent[i][j]+"</td>";
		}
		str+="</tr>";
	}
	str += "</tbody>";
	str+="</table>";
	document.getElementById("content").innerHTML=str;
		
}