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
		
		str+="<th id='header' class='rowno' ><span>#<span></th>"
		
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
					
					if (moments[l].kind===4){
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
			
			var row=0;
			for(var l=0;l<moments.length;l++){
				if(moments[l].name){
					row++;
					str+="</tr><tr class='markinglist-header'>";
					str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>"
					str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].username+"'>"+moments[l].username+"</div></th>";	
					
					str+="<th class='result-header dugga-result-subheader' id='header"+(l+1)+"'><div class='dugga-result-subheader-div' title='"+moments[l].name+"'>"+moments[l].name+"</div></th>";	
					str+="</tr>";
					
		
				}
			}
			str+="</thead></table>";
			document.getElementById("content").innerHTML=str;
		
}