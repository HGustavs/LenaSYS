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
		entries=data.entries;
		moments=data.moments;
		versions=data.versions;
		results=data.results;
		
		allData = data; // used by dugga.js
				
		
		str="";

		// Redraw main result table    

		str+="<table class='markinglist' id='markinglist'>";
		str+="<thead>";
		str+="<tr class='markinglist-header'>";
		
		str+="<th colspan='1' id='subheading' class='result-header'>";
		str+="Studenter";
		str+="</th>";

		str+="<th colspan='1' id='subheading' class='result-header'>";
		str+="Grupper";
		str+="</th>";

		var colsp=1;
		var colpos=1;
		//drawtable();	
		// Read dropdown from local storage
		courselist=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-checkees");
		if (courselist){	
				courselist=courselist.split("**"); 
		} 
		
			// Get momentname
			momtmp=new Array;
			var momname = "tore";
			for(var l=0;l<moments.length;l++){
					
						colsp++;
					
					if (moments[l].kind===3){
							momname = moments[l].entryname;
							str+="<th  class='result-header' colspan='"+(colsp)+"'>"+momname+"</th>";	
							colpos=l;
							colsp=-1;
					}
					/* else{
						var groupname = moments[l].name;
 						
						str+="<td class='result-header dugga-result-subheader' colspan='"+(colsp)+"'>"+groupname+"</td>"
						str+="</tr>"
					} */ 
															
			}
			
			
			
			/* str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Grupper'>Grupper</div></th>"	
			str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Uppgifter'>Uppgifter</div></th>"	
			str+="</th><th colspan='1' class='result-header dugga-result-subheader' id='header0'><div class='dugga-result-subheader-div' title='Aktiv'>Aktiv i kursen</div></th>"	
		*/	for(var l=0;l<moments.length;l++){
				if(moments[l].name){
					str+="</tr><tr class='markinglist-header'>";
					str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].username+"'>"+moments[l].username+"</div></th>";	
					
					str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].name+"'>"+moments[l].name+"</div></th>";	
					str+="</tr>";
					
		
				}
			}
			str+="</thead></table>";
			document.getElementById("content").innerHTML=str;
		
}