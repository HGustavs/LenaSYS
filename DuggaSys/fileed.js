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
		$("#overlay").css("display","none");
}

function deleteFile(fileid,filename){
		if(confirm("Do you really want to delete the file/link: "+filename)){
				AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
		}
}

//----------------------------------------
// makeSortable(table) <- Makes a table sortable and also allows the table to collapse when
// 						user double clicks on table head.
//----------------------------------------
function makeSortable(table) {
	var DELAY = 200;
	var clicks = 0;
	var timer = null;
	var th = table.tHead, i;
	th && (th = th.rows[0]) && (th = th.cells);
	if (th) i = th.length;
	else return; // if no `<thead>` then do nothing
	while (--i >= 0) (function (i) {
		var dir = 1;
		th[i].addEventListener('click', function (e) {
			clicks++;
			if(clicks === 1) {
				timer = setTimeout(function () {
					sortTable(table, i, (dir = 1 - dir));
					clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);
                $(this).closest('table').find('tbody').fadeToggle();
                $('.arrowRight', this).slideToggle();
                $('.arrowComp', this).slideToggle();  //perform double-click action
                clicks = 0;             //after action performed, reset counter
            }
        });
        th[i].addEventListener('dblclick', function (e) {
            e.preventDefault();
        })
    }(i));
}

//----------------------------------------
// makeAllSortable(parent) <- Makes all tables within given scope sortable.
//----------------------------------------
function makeAllSortable(parent) {
	parent = parent || document.body;
	var t = parent.getElementsByTagName('table'), i = t.length;
	while (--i >= 0) makeSortable(t[i]);
}

//----------------------------------------
// sortTable(table, col, reverse) <- Sorts table based on given column and whether or not to
//									reverse the sorting.
//----------------------------------------
function sortTable(table, col, reverse) {
    var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
		return reverse // `-1 *` if want opposite order
		 * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                    .localeCompare(b.cells[col].textContent.trim())
            );
    });
    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}

$(document).on('click','.last',function(e) {
     e.stopPropagation();
  });


function createLink()
{
		$("#uploadbuttonname").html("<input class='submit-button' type='submit' value='Upload URL' /></td>");
		$("#editFile").css("display","block");
		$("#filey").css("display","none");
		$("#linky").css("display","block");
		$("#selecty").css("display","none");
		$("#overlay").css("display","block");
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
		$("#overlay").css("display","block");
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
		str5="";
		str1+="<table class='list' style='margin-bottom:8px;' >";
		str1+="<thead style='cursor:pointer;'>";
		str1+="<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>" +
		"<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" + 
		"<th style='min-width:180px;' >Link URL</th>" +
		"<th style='min-width:180px;' >Upload date & time</th>" +
		"<th class='last'><input class='submit-button fileed-button' type='button' value='Add Link' onclick='createLink();'/></th></tr>";
		//str1+="<tr><th class='first' style='width:64px;'>ID</th><th style='width:30px' ></th></tr>";
		str1+="</thead><tbody id='links_body'>"

		if (data['entries'].length > 0) {
			for(i=0;i<data['entries'].length;i++){
					var item=data['entries'][i];
					if(parseInt(item['kind'])==1){
							str1+="<tr class='fumo'>";
							str1+="<td>"+item['fileid']+"</td>";
							str1+="<td>"+"<a href="+item['filename']+" target="+"_blank"+">"+item['filename']+"</a>"+"</td>";
							str1+="<td>" + item['uploaddate'] + "</td>";
							str1+="<td style='padding:4px;'>";
							str1+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
							str1+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
							str1+="</td>";
							str1+="</tr>";
					}
			}
			str1+="</tbody></table>";
			str5+="<table class='list' style='margin-bottom:8px;' >";
			str5+="<thead style='cursor:pointer;'>";
			str5+="<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>"+
			"<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" +
            "<th style='min-width:180px;' >Files</th>" +
            "<th style='min-width:130px;' >File extension</th>" +
            "<th style='min-width:180px;' >Upload date & time</th>" +
            "<th style='min-width:130px;' >File size</th>" +
			"<th>File Kind</th>" +
            "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile(\"GFILE\");'/></th></tr>";
			str5+="</thead><tbody id='allcontent_body'>";

            for(i=0;i<data['entries'].length;i++){
                var item=data['entries'][i];
                if(parseInt(item['kind'])!=1){
                    str5+="<tr class='fumo'>";
                    str5+="<td>"+item['fileid']+"</td>";
                    str5+="<td>";
                    // str2+=item['filename']
                    str5+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+getFileInformation(item['filename'], false)+"</a>";
                    str5+="</td>";
                    str5+="<td>" + getFileInformation(item['filename'], true) + "</td>";
                    str5+="<td>" + item['uploaddate'] + "</td>";
                    str5+="<td>" + formatBytes(item['filesize'],0 ) + "</td>";
                    str5+="<td>" + convertfilekind(item['kind']) + "</td>";
                    str5+="<td style='padding:4px;'>";
                    str5+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
                    str5+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
                    str5+="</td>";
                    str5+="</tr>";

                }
            }
            str5+="</tbody></table>";
			str2+="<table class='list' style='margin-bottom:8px;' >";
      str2+="<thead style='cursor:pointer;'>";      
      str2+="<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>" +
      "<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" + 
      "<th style='min-width:180px;' >Global File</th>" +
	  "<th style='min-width:130px;' >File extension</th>" +
      "<th style='min-width:180px;' >Upload date & time</th>" +
      "<th style='min-width:130px;' >File size</th>" +
      "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile(\"GFILE\");'/></th></tr>";
			str2+="</thead><tbody id='global_body'>"
			
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==2){
					str2+="<tr class='fumo'>";
					str2+="<td>"+item['fileid']+"</td>";
					str2+="<td>";
					// str2+=item['filename']
					str2+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+getFileInformation(item['filename'], false)+"</a>";
					str2+="</td>";
					str2+="<td>" + getFileInformation(item['filename'], true) + "</td>";
					str2+="<td>" + item['uploaddate'] + "</td>";
					str2+="<td>" + formatBytes(item['filesize'],0 ) + "</td>";
					str2+="<td style='padding:4px;'>";
					str2+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str2+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
					str2+="</td>";
					str2+="</tr>";

				}
			}
			str2+="</tbody></table>";
			str3+="<table class='list' style='margin-bottom:8px;' >";
      
      str3+="<thead style='cursor:pointer;'>";
      //str3+="<tr onclick='toggleTableVisibility(\"course\");'><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID<span></div></th><th>Course File</th>" +
	
      str3+="<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>" +
      "<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" +
      "<th style='min-width:180px;' >Course File</th>" +
	  "<th style='min-width:130px;' >File extension</th>" +
      "<th style='min-width:180px;' >Upload date & time</th>" +
      "<th style='min-width:130px;' >File size</th>" +
      "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile(\"MFILE\");'/></th></tr>";
      
			str3+="<thead><tbody id='course_body'>";
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==3){
					str3+="<tr class='fumo'>";
					str3+="<td>"+item['fileid']+"</td>";
					str3+="<td>";
					// str3+="<td>"+item['filename']+"</td>";
					str3+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+getFileInformation(item['filename'], false)+"</a>";
					str3+="</td>";
					str3+="<td>" + getFileInformation(item['filename'], true) + "</td>";
					str3+="<td>" + item['uploaddate'] + "</td>";
					str3+="<td>" + formatBytes(item['filesize'],0 ) + "</td>";
					str3+="<td style='padding:4px;'>";
					str3+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
					str3+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
					str3+="</td>";
					str3+="</tr>";
				}
			}
			str3+="</tbody></table>";
			str4+="<table class='list' style='margin-bottom:8px;' >";

		  str4+="<thead style='cursor:pointer;'>" + 
		  "<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>" +
		  "<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" +
    //  str4+="<tr onclick='toggleTableVisibility(\"local\");'><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><img id='local_icon' src='../Shared/icons/desc_complement.svg'/><span>ID<span></div></th><th>Course Local File</th>" +
		  "<th style='min-width:180px;' >Course Local File</th>" +
		  "<th style='min-width:130px;' >File extension</th>" +
      	"<th style='min-width:180px;' >Upload date & time</th>" +
        "<th style='min-width:130px;' >File size</th>" +
        "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile(\"LFILE\");'/></th></tr>";
      
			str4+="<thead><tbody id='local_body'>"
			for(i=0;i<data['entries'].length;i++){
				var item=data['entries'][i];
				if(parseInt(item['kind'])==4){
					str4+="<tr class='fumo'>";
					str4+="<td>"+item['fileid']+"</td>";
					str4+="<td>";
					// str4+="<td>"+item['filename']+"</td>";
					str4+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+getFileInformation(item['filename'], false)+"</a>";
					str4+="</td>";
					str4+="<td>" + getFileInformation(item['filename'], true) + "</td>";
					str4+="<td>" + item['uploaddate'] + "</td>";
					str4+="<td>" + formatBytes(item['filesize'],0) + "</td>";
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
		var allcontent=document.getElementById("allcontent");
		allcontent.innerHTML=str5;
		}else{

		}
	//if there was an error in the php file while fetching, an alert goes off here
	//-------------------------------------------------------------------------------------
	if(data['debug']!="NONE!") alert(data['debug']);
	makeAllSortable();
}

function getFileInformation(name, getExt) {
	var str = name.split(".");
	var extension = str[str.length - 1];
	var filename = str.splice(0, str.length - 1).join("");
	if(getExt === true) {
		return extension;
	}
	else {
		return filename;
	}
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals + 1 || 3,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function setupSort(){ 
	/*		Add filter menu		 */
	var filt ="";	
	filt+="<td id='filter' class='navButt'><span class='dropdown-container' onmouseover='hovers();' onmouseleave='leaves();'>";
	filt+="<img class='navButt' src='../Shared/icons/sort_white.svg'>";
	filt+="<div id='dropdowns' class='dropdown-list-container'>";
	filt+="<div class='checkbox-dugga'><form>"+ 
	"<input type='radio' name='sort' value='0' onclick='sorttype(0)' class='headercheck' id='FNASC'><label class='headerlabel' for='FNASC'>File Name ASC</label><br />"+
	"<input type='radio' name='sort' value='1' onclick='sorttype(1)' class='headercheck' id='FNDESC'><label class='headerlabel' for='FNDESC'>File Name DESC</label><br />"+
    "<input type='radio' name='sort' value='2' onclick='sorttype(2)' class='headercheck' id='FE'><label class='headerlabel' for='FE'>File Extension</label><br />"+
    "<input type='radio' name='sort' value='3' onclick='sorttype(3)' class='headercheck' id='Upld'><label class='headerlabel' for='Upld'>Upload Date</label><br />"+  
    "<input type='radio' name='sort' value='4' onclick='sorttype(4)' class='headercheck' id='FS'><label class='headerlabel' for='FS'>File Size</label><br />"+
    "<input type='radio' name='sort' value='5' onclick='sorttype(5)' class='headercheck' id='FK'><label class='headerlabel' for='FK'>File Kind</label><br />"+ 
    "</form></div>";
	filt+="</div>";
	filt+="</span></td>";
	$("#menuHook").before(filt); //menuHook is set between buttons and navName
}

function hovers(){
  	$('#dropdowns').css('display','block');
}

function leaves(){
	$('#dropdowns').css('display','none'); 
}

//Switch Content between one table and separate tables;

function switchcontent() {
	var allcont = $("#allcontent");
	if(allcont.css('display') != 'none'){
        $("button.switchContent").first().html('Switch to One table');
	}
	else{
        $("button.switchContent").first().html('Switch to Multiple tables');
    }
		$("#allglobalfiles").toggle("hide");
		$("#allcoursefiles").toggle("hide");
    	$("#alllocalfiles").toggle("hide");
    allcont.toggle("show");
}

function convertfilekind(kind){
	var retString = "";
	switch(kind){
		case "1":
			retString = "Link";
			break;
		case "2":
			retString = "Global";
			break;
		case "3":
			retString = "Course Local";
			break;
		case "4":
			retString = "Local";
			break;
		default:
			retString = "Not recognized";
			break;
	}
	return retString;
}

function searchcontent(){
	var searchstr = new RegExp($('#searchinput').val(), 'i');
	var searchdata = [];
    for(i=0;i<filez['entries'].length;i++){
        var item=filez['entries'][i];
        if(searchstr.test(item['filename'])){
			searchdata.push(item);
		}
		else if(searchstr.test(item['fileid'])){
            searchdata.push(item);
		}
		else if(searchstr.test(item['uploaddate'])){
			searchdata.push(item);
		}
		else if(searchstr.test(item['filesize'])){
			searchdata.push(item);
		}
	}
	str="";
	str+="<table class='list' style='margin-bottom:8px;' >";
	str+="<thead style='cursor:pointer;'>";
	str+="<tr><th style='width:30px;'><div style='display:flex;justify-content:flex-start;align-items:center;' /><span>ID</span>"+
	"<img src='../Shared/icons/desc_complement.svg' class='arrowComp'><img src='../Shared/icons/right_complement.svg' class='arrowRight' style='display:none;'></div></th>" +
    "<th>Search Results</th>" +
    "<th>File extension</th>" +
    "<th>Upload date & time</th>" +
    "<th>File size</th>" +
    "<th>File Kind</th>" +
    "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='createFile(\"GFILE\");'/></th></tr>";
	str+="</thead><tbody id='searchresults_body'>";
	for(i=0;i<searchdata.length;i++){
		item = searchdata[i];
        str+="<tr class='fumo'>";
        str+="<td>"+item['fileid']+"</td>";
        str+="<td>";
        // str2+=item['filename']
        str+="<a style='cursor:pointer;margin-left:15px;' onClick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+item['filename']+"\");' >"+getFileInformation(item['filename'], false)+"</a>";
        str+="</td>";
        str+="<td>" + getFileInformation(item['filename'], true) + "</td>";
        str+="<td>" + item['uploaddate'] + "</td>";
        str+="<td>" + formatBytes(item['filesize'],0 ) + "</td>";
        str+="<td>" + convertfilekind(item['kind']) + "</td>";
        str+="<td style='padding:4px;'>";
        str+="<img id='dorf' style='float:right;margin-right:4px;' src='../Shared/icons/Trashcan.svg' ";
        str+=" onclick='deleteFile(\""+item['fileid']+"\",\""+item['filename']+"\");' >";
        str+="</td>";
        str+="</tr>";
	}
	str+="</tbody></table>";
    var searchresults=document.getElementById("searchresults");
    searchresults.innerHTML=str;
    if(searchstr != "/(?:)/i") {
        $("#allglobalfiles").hide();
        $("#allcoursefiles").hide();
        $("#alllocalfiles").hide();
        $("#alllinks").hide();
        $("#allcontent").hide();
        $("#searchresults").show();
    }
    else{
        $("#allglobalfiles").show();
        $("#allcoursefiles").show();
        $("#alllocalfiles").show();
        $("#allcontent").hide();
        $("#alllinks").show();
        $("#searchresults").hide();
	}
	//filters in search table 
	var $rows = $('#searchresults_body tr');
	$('#searchinput').keyup(function() {
	    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
	    
	    $rows.show().filter(function() {
	        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
	        return !~text.indexOf(val);
	    }).hide();
	});
}  

//excuted onclick button for switching to "one" table - functionality that filters in table 
function keyUpSearch() {
	var $rows2 = $('#allcontent_body tr');
	$('#searchinput').keyup(function() {
	    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
	    
	    $rows2.show().filter(function() {
	        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
	        return !~text.indexOf(val);
	    }).hide();
	});
}


function searchKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('searchbutton').click();
        return false;
    }
    return true;
}

