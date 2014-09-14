var querystring=parseGet();
var retdata;

AJAXService("get",{},"SECTION");

//----------------------------------------
// Commands:
//----------------------------------------

function selectItem(lid,entryname,kind,evisible,elink,moment)
{
		
		// Display Select Marker
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#I"+lid).css("border","2px dashed #FC5");
		$("#I"+lid).css("box-shadow","1px 1px 3px #000 inset");
		
		// Set Moments
		str="";
		if (retdata['entries'].length > 0) {		
			
			// Account for null
			if(moment=="") str+="<option selected='selected' value='null'>&lt;None&gt;</option>"
			else str+="<option value='null'>&lt;None&gt;</option>";
			
			// Account for rest of moments!
			for(var i=0;i<retdata['entries'].length;i++){
					var item=retdata['entries'][i];
					if(item['kind']==4){
							if(parseInt(moment)==parseInt(item['lid'])) str+="<option selected='selected' value='"+item['lid']+"'>"+item['entryname']+"</option>";
							else str+="<option value='"+item['lid']+"'>"+item['entryname']+"</option>";
					}
			}		
		}
		$("#moment").html(str);

		// Set Name		
		$("#sectionname").val(entryname);


		// Set Lid	
		$("#lid").val(lid);

		// Set Kind
		str="";
		if(kind==0) str+="<option selected='selected' value='0'>Header</option>"
		else str+="<option value='0'>Header</option>";
		if(kind==1) str+="<option selected='selected' value='1'>Section</option>"
		else str+="<option value='1'>Section</option>";
		if(kind==2) str+="<option selected='selected' value='2'>Code</option>"
		else str+="<option value='2'>Code</option>";
		if(kind==3) str+="<option selected='selected' value='3'>Test</option>"
		else str+="<option value='3'>Test</option>";
		if(kind==4) str+="<option selected='selected' value='4'>Moment</option>"
		else str+="<option value='4'>Moment</option>";
		if(kind==5) str+="<option selected='selected' value='5'>Link</option>"
		else str+="<option value='5'>Link</option>";
		$("#type").html(str);
						
		// Set Visibiliy
		str="";
		if(evisible==0) str+="<option selected='selected' value='0'>Hidden</option>"
		else str+="<option value='0'>Hidden</option>";
		if(evisible==1) str+="<option selected='selected' value='1'>Public</option>"
		else str+="<option value='1'>Public</option>";
		$("#visib").html(str);

		// Set Link
		$("#link").val(elink);
		
		// Graying of Link
		if(kind<2){
				$("#link").css("opacity","0.3");		
				$("#linklabel").css("opacity","0.3");	
				$("#link").prop('disabled', true);					
				$("#createbutton").css('visibility', 'hidden');					
		}else{
				$("#link").css("opacity","1.0");		
				$("#linklabel").css("opacity","1.0");				
				$("#link").prop('disabled', false);					

				if(elink==""){
						$("#createbutton").css('visibility', 'visible');					
				}else{
						$("#createbutton").css('visibility', 'hidden');					
				}
		}
		
		// Show dialog
		$("#editSection").css("display","block");
		
}

function deleteItem()
{
		lid=$("#lid").val();
		AJAXService("DEL",{lid:lid},"SECTION");
}

function updateItem()
{
		lid=$("#lid").val();
		kind=$("#type").val();
		link=$("#link").val();
		sectionname=$("#sectionname").val();
		visibility=$("#visib").val();
		moment=$("#moment").val();

		AJAXService("UPDATE",{lid:lid,kind:kind,link:link,sectname:sectionname,visibility:visibility,moment:moment},"SECTION");

		$("#editSection").css("display","none");
}

// Create New Dugga/Example

function createLink()
{
		alert("CREATE!");
}
		
function newItem()
{
		lid=$("#lid").val();
		AJAXService("NEW",{lid:lid},"SECTION");
}

function closeSelect()
{
		$(".item").css("border","none");
		$(".item").css("box-shadow","none");
		$("#editSection").css("display","none");
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedSection(data)
{
		retdata=data;
				
		// Fill section list with information
		str="";

		if(data['writeaccess']) {
			str+="<div style='float:right;'>";
			str+="<input class='submit-button' type='button' value='New' onclick='newItem();'/>";
			str+="<input class='submit-button' type='button' value='Results' onclick='changeURL(\"resulted.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="<input class='submit-button' type='button' value='Tests' onclick='changeURL(\"duggaed.php?cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"\")'/>";
			str+="</div>";
		}
		
		// Course Name
		str+="<div class='course'>"+data.coursename+" "+data.coursevers+"</div>";

		str+="<div id='Sectionlistc' >";
  
		// For now we only have two kinds of sections
		if (data['entries'].length > 0) {
			var kk=0;
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];

				// If visible or we are a teacher/superuser
				if (parseInt(item['visible']) === 1 || data['writeaccess']) {
								
						if(parseInt(item['kind']) === 0 ){
								// Styling for header row
								str+="<span class='header item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 1 ){
								//Styling for section row
								str+="<span class='section item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 2 ){
								// Styling for example row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						} else if(parseInt(item['kind']) === 3 ){
								// Styling for quiz row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						} else if(parseInt(item['kind']) === 4 ){
								// Styling for moment row
								str+="<span class='moment item' id='I"+item['lid']+"' ";
								kk=0;
						} else if(parseInt(item['kind']) === 5 ){
								// Styling for link row
								str+="<span";
								if(kk%2==0){
										str+=" class='example item hi' id='I"+item['lid']+"' ";
								}else{
										str+=" class='example item lo' id='I"+item['lid']+"' ";
								}
								kk++;
						}

						if(kk==1){
								if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5; box-shadow: 0px 3px 2px #aaa inset; border-radius:8px; margin-left:4px;' "
								else str+="style='box-shadow: 0px 3px 2px #aaa inset;' ";				
						}else{
								if (parseInt(item['visible']) === 0) str+=" style='opacity: 0.5; border-radius:8px; margin-left:4px;' ";
						}
			
						str+=">";
						
						if (parseInt(item['kind']) < 2||parseInt(item['kind']) == 4) {
							str+="<span style='padding-left:5px;'>"+item['entryname']+"</span>";
						} else if (parseInt(item['kind']) == 2 || parseInt(item['kind']) > 4) {
							str+="<span><a style='margin-left:15px;' href="+item['link']+">"+item['entryname']+"</a></span>";
						} else {
							str+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\""+item['link']+"\")'>"+item['entryname']+"</a>";
						}	

						if(data['writeaccess']) str+="<img id='dorf' style='float:right;margin-right:8px' src='css/svg/Cogwheel.svg' onclick='selectItem(\""+item['lid']+"\",\""+item['entryname']+"\",\""+item['kind']+"\",\""+item['visible']+"\",\""+item['link']+"\",\""+item['moment']+"\");' />";
											
						str+="</span>";
				}
			}	
		} else {
				// No items were returned! 
				
				str+="<div class='bigg'>";
				str+="<span>There is currently no content in this course</span>";
				str+="</div>";
		}
			
		str+="</div>";

		var slist=document.getElementById('Sectionlist');
		slist.innerHTML=str;

		if(data['writeaccess']) {				
			// Enable sorting always if we are superuser as we refresh list on update 
			$("#Sectionlistc").sortable({
					helper: 'clone',
	      	update:  function (event, ui) {
	            str="";
	            $("#Sectionlist").find(".item").each(function(i) { 
	  						if(i>0) str+=",";
	  						ido=$(this).attr('id');
	  						str+=i+"XX"+ido.substr(1);
							});
							
							AJAXService("REORDER",{order:str},"SECTION");
	        		
	        		return false;
	        }										
			});
	
		}
		
	  if(data['debug']!="NONE!") alert(data['debug']);

}
