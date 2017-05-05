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
		console.log(moments);
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

		// Reconstitute table
		
		for(i=0;i<availablegroups.length;i++){

			var uid=availablegroups[i].uid;

		// Loop through all teacher names and store the appropriate name in a variable
		for(j=0; j<teacher.length;j++){
				var tuid=teacher[j].tuid;
		if(uid==tuid){
			var setTeacher = teacher[j].teacher;
			}
		}
		if(setTeacher !== null){
				// Place spaces in the string when a lowercase is followed by a uppercase
				setTeacher = setTeacher.replace(/([a-z])([A-Z])/g, '$1 $2');
			}
										
					// All results of this student
					var res=results[uid];
					var restmp=new Array;
					
					if (typeof res != 'undefined'){
							// Pre-filter result list for a student for lightning-fast access
							for(var k=0;k<res.length;k++){
									restmp[res[k].dugga]=res[k];
							}
					}
					var student=new Array;
					// Creates a string that displays the first <td> (the one that shows the studentname etc) and places it into an array
					student.push({grade:("<div class='dugga-result-div'>"+availablegroups[i].username+" "+availablegroups[i].lastname+"</div><div class='dugga-result-div'>"+availablegroups[i].username+" / "+availablegroups[i].class+"</div><div class='dugga-result-div'>"+availablegroups[i].ssn+"</div><div class='dugga-result-div'>"+setTeacher+"</div>"),username:availablegroups[i].username,lastname:availablegroups[i].lastname,ssn:availablegroups[i].ssn,class:availablegroups[i].class,access:availablegroups[i].access,setTeacher});
					// Now we have a sparse array with results for each moment for current student... thus no need to loop through it
					for(var j=0;j<momtmp.length;j++){
							// If it is a feedback quiz -- we have special handling.
							if(momtmp[j].quizfile=="feedback_dugga"){
									var momentresult=restmp[momtmp[j].lid];		
									// If moment result does not exist... either make "empty" student result or push mark
									if(typeof momentresult!='undefined'){							
											student.push({ishere:true,grade:momentresult.grade,marked:new Date((momentresult.marked*1000)),submitted:new Date((momentresult.submitted*1000)),kind:momtmp[j].kind,lid:momtmp[j].lid,uid:uid,needMarking:momentresult.needMarking,gradeSystem:momtmp[j].gradesystem,vers:momentresult.vers,userAnswer:momentresult.useranswer,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, quizfile:momtmp[j].quizfile});
									}else{
											student.push({ishere:true,kind:momtmp[j].kind,grade:"",lid:momtmp[j].lid,uid:uid,needMarking:false,marked:new Date(0),submitted:new Date(0),grade:-1,vers:querystring['coursevers'],gradeSystem:momtmp[j].gradesystem,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, userAnswer:"UNK", quizfile:momtmp[j].quizfile});							
									}							
							}else{
									var momentresult=restmp[momtmp[j].lid];
									// If moment result does not exist... either make "empty" student result or push mark
									if(typeof momentresult!='undefined'){							
											student.push({ishere:true,grade:momentresult.grade,marked:new Date((momentresult.marked*1000)),submitted:new Date((momentresult.submitted*1000)),kind:momtmp[j].kind,lid:momtmp[j].lid,uid:uid,needMarking:momentresult.needMarking,gradeSystem:momtmp[j].gradesystem,vers:momentresult.vers,userAnswer:momentresult.useranswer,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant,quizfile:momtmp[j].quizfile});
									}else{
											student.push({ishere:false,kind:momtmp[j].kind,grade:"",lid:momtmp[j].lid,uid:uid,needMarking:false,marked:new Date(0),submitted:new Date(0),grade:-1,quizId:momtmp[j].link, qvariant:momtmp[j].qvariant, quizfile:momtmp[j].quizfile});							
									}		
							}
					}
					students.push(student);
		}			
		
    
	
	
		//console.log(performance.now()-tim);
}

function returnedGroup(data)
{
	// console.log(data);
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
	// Itererate the headings, that are dependent on the cid and coursevers. 
	
	
	allData = data; // used by dugga.js (for what??)
	process();
	
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
	str+="<th colspan='1' id='tableheader0' class='result-header' onclick='toggleSortDir(0);'>";
	str+="Studenter";
	str+="</th>";

	if(moments){
		for(var i = 0; i < moments.length; i++) {
			str+="<th id=tableheader"+moments[i].lid+" title ='Listentry id "+moments[i].lid+"' class='result-header' onclick=toggleSortDir("+(i+1)+");>"+moments[i].entryname+"</th>";	
		}
	}
	console.log("skapa egen funktion för studenter en för for-loop+ och en för for-loop-");
	str+="</thead>";
	// Iterate the tablecontent. 
	str += "<tbody>";
	var row=0;
	for(var i = 0; i < tablecontent.length; i++) { // create table rows. 
		row++;
		str+="<tr>";
		str+="<td id='row"+row+"' class='grouprow'><div>"+row+"</div></td>";
		str+="<td title='"+tablecontent[i].username+" "+tablecontent[i].lastname+" "+tablecontent[i].ssn+"'>"+tablecontent[i].username+"</td>"; // Iterates all content, but i dont want to write out ugid, cid and lid ...
		for(var lid in tablecontent[i].lidstogroup) { // Table cells
			// uid_lid to identify the cell. The ugid is supplied in the option. Is the cid a necessity? 
			str+="<td>";
			str+="<select id="+tablecontent[i].uid+"_"+lid+" onchange=changegroup(this)>";
			str+="<option value='-1'>Pick a group</option>";
			for(var ugid in availablegroups) {
				var selected = tablecontent[i].lidstogroup[lid] == ugid ? " selected" : "";
				str+="<option value="+ugid+selected+">"+availablegroups[ugid]+"</option>";
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
<<<<<<< Updated upstream
=======
function resort()
{
		// Read sorting config from localStorage	
		var sortdir=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
		if (sortdir === null || sortdir === undefined){dir=1;}
		$("#sortdir"+sortdir).prop("checked", true);
		var columno=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
		if (columno === null || columno === undefined ){columno=0;}
		var colkind=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1");
		if (colkind == null || colkind == undefined){colkind=0;}
		var colkind2=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2");
		if (colkind2 == null || colkind2 == undefined){colkind2=0;}			
		
		if (tablecontent.length > 0) {
			console.log(tablecontent[0]);
			console.log(columno);
				if(columno < tablecontent[0].length){
			
						if (columno == 0) {				
								$("#sortcol0_"+colkind).prop("checked", true);
						} else {
								$("#sortcol"+columno).prop("checked", true);
								$("#sorttype"+colkind2).prop("checked", true);								
						}
						// Each if case checks what to sort after and then sorts appropiatle depending on ASC or DESC
						if(columno==0){
							if(colkind==0){
								tablecontent.sort(function compare(a,b){                        
										if(a[0].username>b[0].username){
											return sortdir;
										}else if(a[0].username<b[0].username){
												return -sortdir;
										}else{
											return 0;
										}
									});
							}
						}else{
							// other columns sort by
							// 0. no group
							// 1. groups
						
							if (colkind2===null){colkind2=0;}
							sortcolumn=columno;
							if(colkind2==0){
										
							} else if(colkind2==1){
								students.sort(function compare(a,b){
									if(a[sortcolumn].grade!=-1 && b[sortcolumn].grade == -1){
											return -sortdir;
									} else if(a[sortcolumn].grade==-1 && b[sortcolumn].grade != -1){
											return sortdir;
									} else{	
											if(a[sortcolumn].grade>b[sortcolumn].grade){		  				
													return sortdir;
											}else if(a[sortcolumn].grade<b[sortcolumn].grade){
													return -sortdir;
											}else{
													return 0;
											}
									}
							});				
							} else if(colkind2==2){
							students.sort(function compare(a,b){ 										
									if(a[sortcolumn].submitted>b[sortcolumn].submitted){
											return sortdir;
									}else if(a[sortcolumn].submitted<b[sortcolumn].submitted){
											return -sortdir;									
									}else{
											return 0;
									}
							});				
						}
						}					 
				}
		}
		console.log(columno);
	 //returnedGroup(students);
	 $("#tableheader"+columno).addClass("result-header-inverse");
   if (sortdir<0){
     $("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
     $("#tableheader"+columno+"magic").append("<img id='sortdiricon' src='../Shared/icons/asc_primary.svg'/>");
   } else {
     $("#tableheader"+columno).append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>"); 
     $("#tableheader"+columno+"magic").append("<img id='sortdiricon' src='../Shared/icons/desc_primary.svg'/>");    
   }
}



// If col and current col are equal we flip sort order otherwise we
// change to selected column and always start with desc FIFO order for col 1->
// col 0 get special treatment and is by default sorted on lastname.
function toggleSortDir(col){
    var dir = localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir");
    var ocol=localStorage.getItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol");
    
  	if (col != ocol){
        $("input[name='sortcol']:checked").prop({"checked":false});
        $("input[name='sorttype']:checked").prop({"checked":false});
        if (col == 0){
            $("#sorttype0_1").prop({"checked":true});   
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort1",1);
        } else {
            $("#sortcol"+col).prop({"checked":true});          
            $("#sorttype0").prop({"checked":true});                      
            localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sort2", 0);          
        }
        dir=-1;
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortcol", col);          
        localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);                
    }	else {
		//$("input[name='sortdir']:checked").each(function() {dir=this.value;});
		dir=dir*-1;
		$("input[name='sortdir']:checked").val(dir);
		localStorage.setItem("lena_"+querystring['cid']+"-"+querystring['coursevers']+"-sortdir", dir);
    }
    resort();  
}
>>>>>>> Stashed changes
