/********************************************************************************
   Documentation 
*********************************************************************************

This file displays the result of each student with access under this course, the teacher can grade students
in this page.

Execution order: 
#1 returnedFile() is first function to be called this then invokes returned() callback through AJAX
#2 the other funtions are executed and used as eventlisteners, e.g waiting for the user to do something before they are started
-------------==============######## Documentation End ###########==============-------------
*/

/********************************************************************************

   Globals <-- Next are globals - properly declared with var

*********************************************************************************/

var sessionkind=0;
var querystring=parseGet();
var filez;

AJAXService("GET",{cid:querystring['cid']},"FILE");

$(function(){$( "#release" ).datepicker({dateFormat: "yy-mm-dd"});$( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});});

function closeEditFile()
{
		$("#editFile").css("display","none");
}

function deleteFile(fileid,filename){
		if(confirm("Do you really want to delete the file/link: "+filename)){
				AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
		}
}

function toggleTableVisibility(tbody) {
		if (document.getElementById(tbody).style.display == "none"){
				document.getElementById(tbody).style.display = "table-row-group";
		} else {
				document.getElementById(tbody).style.display = "none";
		}
}

function createLink()
{
		$("#uploadbuttonname").html("<input class='submit-button' type='submit' value='Upload URL' /></td>");
		$("#editFile").css("display","block");
		$("#filey").css("display","none");
		$("#linky").css("display","block");
		$("#selecty").css("display","none");
		$("#kind").val("LINK");
		$("#cid").val(querystring['cid']);
		$("#coursevers").val(querystring['coursevers']);
		
}
//----------------------------------------
// createFile(kind) <- gets the files that exists and puts them as options under a select tag.
//		       ,options can be used to overwrite existing files later on
//----------------------------------------
function createFile(kind)
{
		$("#uploadbuttonname").html("<input class='submit-button' type='submit' value='Upload File' /></td>");
		if(kind=="MFILE"){
				var str="<option>NONE</option>";
				for(i=0;i<filez['lfiles'].length;i++){
						var item=filez['lfiles'][i];
						if(item!=".."&&item!=".") str+="<option>"+item+"</option>";
				}
				$("#selectedfile").html(str);
				$("#selecty").css("display","block");				
		}else if(kind=="GFILE"){
				var str="<option>NONE</option>";
				for(i=0;i<filez['gfiles'].length;i++){
						var item=filez['gfiles'][i];
						if(item!=".."&&item!=".") str+="<option>"+item+"</option>";
				}
				$("#selectedfile").html(str);		
				$("#selecty").css("display","block");				
		}else if(kind=="LFILE"||kind=="LINK"){
				$("#selecty").css("display","none");				
		}

		$("#editFile").css("display","block");
		$("#filey").css("display","block");
		$("#linky").css("display","none");
		if(kind!="LFILE") $("#selecty").css("display","block");
		$("#kind").val(kind);
		$("#cid").val(querystring['cid']);
		$("#coursevers").val(querystring['coursevers']);
}

function validateForm()
{	
	var result;

	//Validation for links
	if($("#linky").css('display') == 'block'){
			//Check if the link starts with http:// or https://
			if(document.getElementById('uploadedlink').value.substr(0,7).toLowerCase() == "http://"){
				result = true;
			}else if(document.getElementById('uploadedlink').value.substr(0,8).toLowerCase() == "https://"){
					result = true;
			}else{
					$("#errormessage").css("display","block");
					$("#errormessage").html("<div class='alert danger'>Link has to start with \"http://\" or \"https://\" </div>");
					$("#uploadedlink").css("background-color", "rgba(255, 0, 6, 0.2)");
					result = false;
			}
	}else{
		result = true;
	} 

	return result;
}


function showLoginPopup()
{
		$("#loginBox").css("display","block");
		$("#overlay").css("display","block");
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
}

//----------------------------------------
// Renderer <- ran after the ajax call(ajax is started after initialation of this file) is successful
//----------------------------------------
function returnedFile(data)
{
		filez = data;
		//strings filled with content that will later be html code in certain parts of the page
		//----------------------------------------
		str1=""; 
		str2="";
		str3="";
		str4="";
		str1+="<table class='list' style='margin-bottom:8px;' >";
		str1+="<thead>";
		str1+="<tr><th><input class='submit-button' type='button' value='v' onclick='toggleTableVisibility(\"linksBody\");'/></th><th colspan='2'><input class='submit-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>";
		str1+="<tr><th class='first' style='width:64px;'>ID</th><th>Link URL</th><th style='width:30px' class='last'></th></tr>";
		str1+="<thead><tbody id='linksBody'>"

		if (data['entries'].length > 0) {
			for(i=0;i<data['entries'].length;i++){
					var item=data['entries'][i];
					if(parseInt(item['kind'])==1){
							str1+="<tr class='fumo'>";
							str1+="<td>"+item['fileid']+"</td>";
							str1+="<td>"+"<a href="+item['filename']+" target="+"_blank"+">"+item['filename']+"</a>"+"</td>";
							str1+="<td style='padding:4px;'>";
							str1+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
							str1+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
							str1+="</td>";
							str1+="</tr>";
					}
			}
			str1+="</tbody></table>";
			str2+="<table class='list' style='margin-bottom:8px;' >";
			str2+="<tr><th><input class='submit-button' type='button' value='v' onclick='toggleTableVisibility(\"globalBody\");'/></th><th colspan='2'><input class='submit-button' type='button' value='Add File' onclick='createFile(\"GFILE\");'/></th></tr>"
			str2+="<tr><th class='first' style='width:64px;'>ID</th><th>Global File</th><th style='width:30px' class='last'></th></tr>";
			str2+="<thead><tbody id='globalBody'>"
			
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==2){
					str2+="<tr class='fumo'>";
					str2+="<td>"+item['fileid']+"</td>";
					str2+="<td>";
					// str2+=item['filename']
					str2+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+item['filename']+"</a>";
					str2+="</td>";
					str2+="<td style='padding:4px;'>";
					str2+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str2+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
					str2+="</td>";
					str2+="</tr>";

				}
			}
			str2+="</tbody></table>";
			str3+="<table class='list' style='margin-bottom:8px;' >";
			str3+="<thead>";
			str3+="<tr><th><input class='submit-button' type='button' value='v' onclick='toggleTableVisibility(\"courseBody\");'/></th><th colspan='2'><input class='submit-button' type='button' value='Add File' onclick='createFile(\"MFILE\");'/></th></tr>";
			str3+="<tr><th class='first' style='width:64px;'>ID</th><th>Course Local File</th><th style='width:30px' class='last'></th></tr>";
			str3+="<thead><tbody id='courseBody'>";
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==3){
					str3+="<tr class='fumo'>";
					str3+="<td>"+item['fileid']+"</td>";
					str3+="<td>";
					// str3+="<td>"+item['filename']+"</td>";
					str3+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+item['filename']+"</a>";
					str3+="</td>";
					str3+="<td style='padding:4px;'>";
					str3+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str3+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
					str3+="</td>";
					str3+="</tr>";
				}
			}
			str3+="</tbody></table>";
			str4+="<table class='list' style='margin-bottom:8px;' >";
			str4+="<thead>";
			str4+="<tr><th><input class='submit-button' type='button' value='v' onclick='toggleTableVisibility(\"localBody\");'/></th><th colspan='2'><input class='submit-button' type='button' value='Add File' onclick='createFile(\"LFILE\");'/></th></tr>";
			str4+="<tr><th class='first' style='width:64px;'>ID</th><th>Local File</th><th style='width:30px' class='last'></th></tr>";
			str4+="<thead><tbody id='localBody'>"
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==4){
					str4+="<tr class='fumo'>";
					str4+="<td>"+item['fileid']+"</td>";
					str4+="<td>";
					// str4+="<td>"+item['filename']+"</td>";
					str4+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+item['filename']+"</a>";
					str4+="</td>";
					str4+="<td style='padding:4px;'>";
					str4+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str4+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
					str4+="</td>";
					str4+="</tr>";
				}
			}
		str4+="</tbody></table>";
				
		// overwrite the tables with the data fetched from mysql into the divs on the html page
		//-------------------------------------------------------------------------------------
		var alllinks=document.getElementById("alllinks");
		alllinks.innerHTML=str1;
		var allglobalfiles=document.getElementById("allglobalfiles");
		allglobalfiles.innerHTML=str2;
		var allcoursefiles=document.getElementById("allcoursefiles");
		allcoursefiles.innerHTML=str3;
		var alllocalfiles=document.getElementById("alllocalfiles");
		alllocalfiles.innerHTML=str4;
		}else{

		}
	//if there was an error in the php file while fetching, an alert goes off here
	//-------------------------------------------------------------------------------------
	if(data['debug']!="NONE!") alert(data['debug']);
}
