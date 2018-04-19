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

function closeAddFile()
{
		$("#addFile").css("display","none");
		//$("#overlay").css("display","none");
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
                $(this).closest('table').find('tbody').fadeToggle(500,'linear'); //perform double-click action
                if($(this).closest('tr').find('.arrowRight').css('display') == 'none'){
    	            $(this).closest('tr').find('.arrowRight').delay(200).slideToggle(300,'linear');
    	            $(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
				} else if ($(this).closest('tr').find('.arrowComp').css('display') == 'none'){
					$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear');
    	            $(this).closest('tr').find('.arrowComp').delay(200).slideToggle(300,'linear');
				} else {
					$(this).closest('tr').find('.arrowRight').slideToggle(300,'linear'); 
					$(this).closest('tr').find('.arrowComp').slideToggle(300,'linear');
				}
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

//when pressed
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

function showLinkPopUp() {
	$("#uploadbuttonname").html("<input class='submit-button' type='submit' value='Upload URL' />");
	$("#addFile").css("display","flex");
	$(".filePopUp").css("display","none");
	$(".linkPopUp").css("display","block");
	$("#selecty").css("display","none");
	$("#kind").val("LINK");
	$("#cid").val(querystring['cid']);
	$("#coursevers").val(querystring['coursevers']);
}
//----------------------------------------
// showFilePopup(kind) <- gets the files that exists and puts them as options under a select tag.
//		       ,options can be used to overwrite existing files later on
//----------------------------------------
function showFilePopUp() {
  $("#uploadbuttonname").html("<input id='file-submit-button' class='submit-button' type='submit' value='Upload file' onclick='setFileKind();uploadFile(fileKind);' />");
	$("#selecty").css("display","block");
	$("#addFile").css("display","flex");
	$(".filePopUp").css("display","block");
	$(".linkPopUp").css("display","none");
}

var fileKind = "";
function setFileKind() {
	fileKind = document.querySelector('input[name=\"fileRB\"]:checked').value;
}

function uploadFile(kind) {
	if (kind == "MFILE") {
		var str = "<option>NONE</option>";
		for (i = 0; i < filez['lfiles'].length; i++) {
			var item = filez['lfiles'][i];
			if (item != ".." && item != ".") str += "<option>" + item + "</option>";
		}
		$("#selectedfile").html(str);
	} else if (kind == "GFILE") {
		var str = "<option>NONE</option>";
		for (i = 0; i < filez['gfiles'].length; i++) {
			var item = filez['gfiles'][i];
			if (item != ".." && item != ".") str += "<option>" + item + "</option>";
		}
		$("#selectedfile").html(str);			
	} else if (kind == "LFILE" || kind == "LINK") {
		$("#selecty").css("display","none");				
	}
  
	$("#kind").val(kind);
	$("#cid").val(querystring['cid']);
	$("#coursevers").val(querystring['coursevers']);
}

function validateForm()
{	
	var result;

	//Validation for links
	if($(".linkPopUp").css('display') == 'block'){
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
		$("#loginBox").css("display","flex");
		//$("#overlay").css("display","block");
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		//$("#overlay").css("display","none");
}

//--------------------------------------------------------------------------
// renderCell
// ---------------
//  Callback function that renders a specific cell in the table
//--------------------------------------------------------------------------

function renderCell(col,celldata,cellid) {
	var list=celldata.split('.');
	var link = celldata.split('://');
	if (col == "trashcan"){
		obj=JSON.parse(celldata);
	    str="<div class='iconBox'><img id='dorf' class='trashcanIcon' src='../Shared/icons/Trashcan.svg' ";
		str+=" onclick='deleteFile(\""+obj.fileid+"\",\""+obj.filename+"\");' ></div>";
		return str;
	} else if (col == "filename") {
		if(link[0] == "https" || link[0] == "http"){
			return "<a href='" + celldata + "' target='_blank'>" + celldata + "</a>";
		}else{
			return "<div>" + list[0] + "</div>";
		}
	} else if (col == "extension") {
	    return "<div>" + list[1] + "</div>";
	} else if (col == "editor") {
		if(link[0] == "https" || link[0] == "http"){
			str="";
		}else{
				var tempStr = celldata;
				str="<div class='iconBox' onclick='console.log(tempStr)'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ></div>";

		}
		//return str;
	}
	return celldata;
}

//--------------------------------------------------------------------------
// rowFilter
// ---------------
//  Callback function that filters rows in the table
//--------------------------------------------------------------------------
var searchterm = "";
function rowFilter(row) {
	for (key in row) {
		if (row[key] != null) {
			if (row[key].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
		}
	}
	return false;
}

var fileLink;
//----------------------------------------
// Renderer <- ran after the ajax call(ajax is started after initialation of this file) is successful
//----------------------------------------
function returnedFile(data)
{
	filez = data;

    var tabledata = {
    	tblhead:{
    		fileid:"File ID",
    		filename:"File name",
    		extension:"Extension",
    		filesize:"Size",
    		uploaddate:"Upload date",
    		trashcan:"Delete",
    		editor:"Editor"
    	},
    	tblbody: data['entries'],
    	tblfoot:[]
    }

    fileLink = new SortableTable(
		tabledata,
		"fileLink",
		null,
		"",
        renderCell,
        null,
        null,
        rowFilter,
        [],
        [],				
        "",
        null,
        null,
		null,
		null,
		null,
        null,
		true
	);

	fileLink.renderTable();

	if(data['debug']!="NONE!") alert(data['debug']);
	makeAllSortable();
}

window.onresize = function() {
	fileLink.magicHeader();
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

	if(kind=="1"){
        retString = "Link";
	}else if(kind=="2"){
        retString = "Global";
	}else if(kind=="3"){
        retString = "Course Local";
	}else if(kind=="4"){
        retString = "Local";
	}else{
        retString = "Not recognized";
	}

	return retString;
}

//********************************SEARCH FUNCTIONALITY FOR THE OLD VERSION****************************************
/*
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
    "<th class='last'><input class='submit-button fileed-button' type='button' value='Add File' onclick='showFilePopup
   (\"GFILE\");'/></th></tr>";
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
	    $rows.filter(":visible:odd").css('background','#ccc');
	    $rows.filter(":visible:even").css('background','#eae8eb');
	});
} 

//excuted onclick button for switching to "one" table - functionality that filters in table 
function keyUpSearch() {
	var $searchedRows = $('#fileLink tr');
	$('#searchinput').keyup(function() {
	    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
	    
	    $searchedRows.show().filter(function() {
	        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
	        return !~text.indexOf(val);
	    }).hide();
	    $searchedRows.filter(":visible:odd").css('background','#ccc');
	    $searchedRows.filter(":visible:even").css('background','#eae8eb');
	});
}  */

function deleteFile(fileid,filename){
	if (confirm("Do you really want to delete the file/link: "+filename)){
		AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
	}

	/*Reloads window when deleteFile has been called*/
	window.location.reload(true);
}