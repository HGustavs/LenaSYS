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

var sessionkind = 0;
var querystring = parseGet();
var filez, fileLink;
var fileKind = "";
var searchterm = "";

AJAXService("GET",{cid:querystring['cid']},"FILE");

window.onresize = function() {
	fileLink.magicHeader();
} 

$(document).on('click','.last',function(e) {
    e.stopPropagation();
});

$(function() {
	$( "#release" ).datepicker({dateFormat: "yy-mm-dd"});
	$( "#deadline" ).datepicker({dateFormat: "yy-mm-dd"});
});

//-------------------------------------------------------------
// Renderer <- Ran after the ajax call (ajax is started after
//			   initialation of this file) is successful
//-------------------------------------------------------------
function returnedFile(data) {
	filez = data;

    var tabledata = {
    	tblhead:{
    		fileid:"File ID",
    		filename:"File name",
    		extension:"Extension",
    		kind:"Kind",
    		filesize:"Size",
    		uploaddate:"Upload date",
    		editor:"",
    		trashcan:""
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
	fileLink.makeAllSortable();

	if(data['debug']!="NONE!") alert(data['debug']);
}

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

function showFilePopUp() {
    $("#uploadbuttonname").html("<input id='file-submit-button' class='submit-button' type='submit' " +
    	"value='Upload file' onclick='setFileKind();uploadFile(fileKind);' />");
	$("#selecty").css("display","block");
	$("#addFile").css("display","flex");
	$(".filePopUp").css("display","block");
	$(".linkPopUp").css("display","none");
}

//---------------------------------------------------
// setFileKind <- Sets the file kind based on which
// 				  radio button the user has pressed
//---------------------------------------------------
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

function closeAddFile() {
	$("#addFile").css("display","none");
}

//------------------------------------------------------------------
// validateForm <- Validates the file that is going to be uploaded
//------------------------------------------------------------------
function validateForm() {	
	var result;
	//Validation for links
	if ($(".linkPopUp").css('display') == 'block') {
		//Check if the link starts with http:// or https://
		if (document.getElementById('uploadedlink').value.substr(0,7).toLowerCase() == "http://") {
			result = true;
		} else if (document.getElementById('uploadedlink').value.substr(0,8).toLowerCase() == "https://") {
			result = true;
		} else {
			$("#errormessage").css("display","block");
			$("#errormessage").html("<div class='alert danger'>Link has to start with \"http://\" or \"https://\" </div>");
			$("#uploadedlink").css("background-color", "rgba(255, 0, 6, 0.2)");
			result = false;
		}
	} else {
		result = true;
	} 
	return result;
}

function showLoginPopup() {
	$("#loginBox").css("display","flex");
}

function hideLoginPopup() {
	$("#loginBox").css("display","none");
}

//----------------------------------------------------------------------------
// renderCell <- Callback function that renders a specific cell in the table
//----------------------------------------------------------------------------

function renderCell(col,celldata,cellid) {
	var list = celldata.split('.');
	var link = celldata.split('://');
	if (col == "trashcan") {
		obj = JSON.parse(celldata);
	    str = "<div class='iconBox'><img id='dorf' class='trashcanIcon' src='../Shared/icons/Trashcan.svg' ";
		str += " onclick='deleteFile(\"" + obj.fileid + "\",\"" + obj.filename + "\");' ></div>";
		return str;
	} else if (col == "filename") {
		if (link[0] == "https" || link[0] == "http") {
			return "<a href='" + celldata + "' target='_blank'>" + celldata + "</a>";
		} else {
			// Goes through the previously split parts of the file name
			// and adds dots to keep the actual file name correct
			var listStr = "";
			for (var i = 0; i < list.length - 1; i++) {
				listStr += list[i];
				if (i != list.length - 2) {
					listStr += ".";
				}
			}
			return "<div>" + listStr + "</div>";
		}
	} else if (col == "filesize") {
		celldata = formatBytes(celldata, 0);
	} else if (col == "extension") {
	    return "<div>" + list[list.length - 1] + "</div>";
	} else if (col == "editor") {
		if(link[0] == "https" || link[0] == "http"){
			str = "";
		} else {
			str = "<div class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ";
            str += " onclick='loadPreview(\"" + celldata + "\")'></div>";
		}
		return str;
	} else if (col == "kind") {
		return convertFileKind(celldata);
	}
	return celldata;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	for (key in row) {
		if (row[key] != null) {
			if (row[key].toUpperCase().indexOf(searchterm.toUpperCase()) != -1) return true;
		}
	}
	return false;
}

function formatBytes(bytes,decimals) {
   if (bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals + 1 || 3,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function convertFileKind(kind){
	var retString = "";
	if (kind == "1") {
        retString = "Link";
	} else if (kind == "2") {
        retString = "Global";
	} else if (kind == "3") {
        retString = "Course local";
	} else if (kind == "4") {
        retString = "Local";
	} else {
        retString = "Not recognized";
	}
	return retString;
}

function deleteFile(fileid,filename) {
	if (confirm("Do you really want to delete the file/link: " + filename)) {
		AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
	}
	/*Reloads window when deleteFile has been called*/
	window.location.reload(true);
}
