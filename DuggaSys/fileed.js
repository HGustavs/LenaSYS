var sessionkind=0;
var querystring=parseGet();
var filez;

AJAXService("GET",{cid:querystring['cid']},"FILE");

$(function() {
  $( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
    $( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
});

//----------------------------------------
// Commands:
//----------------------------------------

function closeEditFile()
{
		$("#editFile").css("display","none");
}

function deleteFile(fileid,filename){
		if(confirm("Do you really want to delete the file/link: "+filename)){
				AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
		}
}

function createLink()
{
		$("#editFile").css("display","block");
		$("#filey").css("display","none");
		$("#linky").css("display","block");
		$("#selecty").css("display","none");

		$("#kind").val("LINK");
		$("#cid").val(querystring['cid']);
		$("#coursevers").val(querystring['coursevers']);
		
				
}

function createFile(kind)
{
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
// Renderer
//----------------------------------------
function returnedFile(data)
{
		filez = data;
		console.log(data);
		// Fill section list with information
		str="";

//		if (data['entries'].length > 0) {

				// 1=Link 2=Global 3=Course Global 4=Local

				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add Link' onclick='createLink();'/>";
				str+="</div>";
				
				str+="<table class='list' style='margin-bottom:8px;' >";

				str+="<tr><th class='first' style='width:64px;'>ID</th><th>Link URL</th><th style='width:30px' class='last'></th></tr>";

				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==1){
								str+="<tr class='fumo'>";
		
								str+="<td>"+item['fileid']+"</td>";
								str+="<td>"+item['filename']+"</td>";
								str+="<td style='padding:4px;'>";
										str+="<img id='dorf' style='float:right;margin-right:4px;' src='css/svg/Trashcan.svg' ";
										str+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str+="</td>";
								str+="</tr>";

						}
				}

				str+="</table>";

				//------------------------------------------------------------------------------------------------------------------------

				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add File' onclick='createFile(\"GFILE\");'/>";
				str+="</div>";
				
				str+="<table class='list' style='margin-bottom:8px;' >";

				str+="<tr><th class='first' style='width:64px;'>ID</th><th>Global File</th><th style='width:30px' class='last'></th></tr>";

				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==2){
								str+="<tr class='fumo'>";
		
								str+="<td>"+item['fileid']+"</td>";
								str+="<td>"+item['filename']+"</td>";
								str+="<td style='padding:4px;'>";
										str+="<img id='dorf' style='float:right;margin-right:4px;' src='css/svg/Trashcan.svg' ";
										str+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str+="</td>";
								str+="</tr>";

						}
				}

				str+="</table>";

				//------------------------------------------------------------------------------------------------------------------------
				
				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add File' onclick='createFile(\"MFILE\");'/>";
				str+="</div>";
				
				str+="<table class='list'>";

				str+="<tr><th class='first' style='width:64px;'>ID</th><th>Course Local File</th><th style='width:30px' class='last'></th></tr>";

				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==3){
								str+="<tr class='fumo'>";
		
								str+="<td>"+item['fileid']+"</td>";
								str+="<td>"+item['filename']+"</td>";
								str+="<td style='padding:4px;'>";
										str+="<img id='dorf' style='float:right;margin-right:4px;' src='css/svg/Trashcan.svg' ";
										str+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str+="</td>";
								str+="</tr>";
						}
				}
				
				str+="</table>";

				//------------------------------------------------------------------------------------------------------------------------

				str+="<div style='float:right;'>";
				str+="<input class='submit-button' type='button' value='Add File' onclick='createFile(\"LFILE\");'/>";
				str+="</div>";
				
				str+="<table class='list'>";

				str+="<tr><th class='first' style='width:64px;'>ID</th><th>Local File</th><th style='width:30px' class='last'></th></tr>";

				for(i=0;i<data['entries'].length;i++){
						var item=data['entries'][i];
						if(parseInt(item['kind'])==4){
								str+="<tr class='fumo'>";
		
								str+="<td>"+item['fileid']+"</td>";
								str+="<td>"+item['filename']+"</td>";
								str+="<td style='padding:4px;'>";
										str+="<img id='dorf' style='float:right;margin-right:4px;' src='css/svg/Trashcan.svg' ";
										str+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
								str+="</td>";
								str+="</tr>";
						}
				}
				
				str+="</table>";
		//}

		var slist=document.getElementById("content");
		slist.innerHTML=str;

	  if(data['debug']!="NONE!") alert(data['debug']);

}

