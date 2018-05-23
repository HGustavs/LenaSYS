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
var pressTimer;
var fabListIsVisible = true;
var fabTimer;

AJAXService("GET",{cid:querystring['cid']},"FILE");

window.onresize = function() {
	fileLink.renderTable();
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
    };

    fileLink = new SortableTable(
		tabledata,
		"fileLink",
		null,
		"",
        renderCell,
        renderSortOptions,
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
		true,
		true
	);


	fileLink.renderTable();
	if(querystring['confirmation'] != undefined) {
        $(".confirmationWindow").css("display", "block");
        document.getElementById('editedFile').innerHTML = querystring['confirmation'] + " has been successfully saved!";
	}
	if(!data['access']) {
        document.getElementById("fabButton").style.display = "none";
	}

	if(data['debug']!="NONE!") alert(data['debug']);
}

function showLinkPopUp() {
	$("#uploadbuttonname").html("<input class='submit-button fileed-submit-button' type='submit' value='Upload URL' />");
	$("#addFile").css("display","flex");
	$(".fileHeadline").css("display","none");
	$(".filePopUp").css("display","none");
	$(".linkPopUp").css("display","block");
	$("#selecty").css("display","none");
	$("#kind").val("LINK");
	$("#cid").val(querystring['cid']);
	$("#coursevers").val(querystring['coursevers']);
}

function showFilePopUp(fileKind) {
    $("#uploadbuttonname").html("<input class='submit-button fileed-submit-button' type='submit' " +
    	"value='Upload file' onclick='uploadFile(\"" + fileKind + "\");'/>");
    $(".fileHeadline").css("display","none");
    $(".filePopUp").css("display","block");
	$("#selecty").css("display","block");
	$("#addFile").css("display","flex");
	$(".linkPopUp").css("display","none");

    if (fileKind == "MFILE") {
    	$("#mFileHeadline").css("display","block");
    } else if (fileKind == "LFILE") {
		$("#lFileHeadline").css("display","block");
    } else if (fileKind == "GFILE") {
		$("#gFileHeadline").css("display","block");
    }
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

function closePreview() {
	/*$(".previewWindow").css("display","none");
    $(".previewWindowContainer").css("display", "none");*/
    $(".previewWindow").hide();
    $(".previewWindowContainer").css("display", "none");
}

function closeEditFile() {
    $(".editFileWindow").css("display","none");
    $(".editFileWindowContainer").css("display", "none");
}

function closeConfirmation() {
    $(".confirmationWindow").css("display", "none");
    window.location.replace('fileed.php?cid='+ querystring['cid'] + '&coursevers=' + querystring['coursevers']);
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

//----------------------------------------------------------------------------
// renderCell <- Callback function that renders a specific cell in the table
//----------------------------------------------------------------------------
function renderCell(col,celldata,cellid) {
	var str="";

	if (col == "trashcan") {
		obj = JSON.parse(celldata);
	    str = "<span class='iconBox'><img id='dorf' class='trashcanIcon' src='../Shared/icons/Trashcan.svg' ";
		str += " onclick='deleteFile(\"" + obj.fileid + "\",\"" + obj.filename + "\");' ></span>";
		return str;
	} else if (col == "filename") {
		obj = JSON.parse(celldata);
		if (obj.kind == "Link") {
			return "<a class='nowrap-filename' href='" + obj.filename + "' target='_blank'>" + obj.filename + "</a>";
		} else {

			return "<span class='nowrap-filename' id='openFile' onclick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+obj.filename+"\")'>" + obj.shortfilename + "</span>";
		}
	} else if (col == "filesize") {
        var obj = JSON.parse(celldata);
        if(obj.kind == "Link") {
            return "<span>-</span>";
        }
        return "<span>" + formatBytes(obj.size, 0) + "</span>";
    } else if (col == "extension") {
	    return "<span>" + celldata + "</span>";
	} else if (col == "editor") {
		var obj = JSON.parse(celldata);
		str = "";
		if (obj.extension == "md" || obj.extension == "txt"){
			str = "<span class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ";
            str += "onclick='loadPreview(\"" + obj.filePath + "\", \"" + obj.filename + "\", " + obj.kind + ")'></span>";
		} else if (obj.extension == "js" || obj.extension == "html" || obj.extension == "css" || obj.extension == "php"){
            str = "<span class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ";
            str += "onclick='loadFile(\"" + obj.filePath + "\", \"" + obj.filename + "\", " + obj.kind + ")'></span>";
        }
		return str;
	}
	return celldata;
}

//----------------------------------------------------------------
// rowFilter <- Callback function that filters rows in the table
//----------------------------------------------------------------
function rowFilter(row) {
	var regex = new RegExp('(.*)::(.*)');
	// Split the searchterm at each &&
    var splitSearch = searchterm.split("&&");

    var tempSearchTerm;
    var columnToSearch;

    // Loop through each searchterms. If there is a match set "match" to true.
    // If "match" is false at the end of an iteration return false since there wasn't a match.
    for(var i = 0; i < splitSearch.length; i++){
        tempSearchTerm = splitSearch[i].trim().match(regex);
        var match = false;
        if(tempSearchTerm != null && tempSearchTerm.length > 1) {
            columnToSearch = tempSearchTerm[1].toLowerCase();
            tempSearchTerm = tempSearchTerm[2];
            switch (columnToSearch) {
                case "file name":
                    columnToSearch = "filename";
                    break;
                case "size":
                    columnToSearch = "filesize";
                    break;
                case "upload date":
                    columnToSearch = "uploaddate";
                    break;
                default:
                    break;
            }
            if(columnToSearch == "filesize"){
                if(fileSizeSearch(row, columnToSearch, tempSearchTerm)) match = true;
            } else if(columnToSearch == "filename"){
            	if(fileNameSearch(row, columnToSearch, tempSearchTerm)) match = true;
			} else {
                if(row[columnToSearch].toUpperCase().indexOf(tempSearchTerm.toUpperCase()) != -1) match = true;
            }
        } else {
            tempSearchTerm = splitSearch[i].trim();
            for (var key in row) {
                if (row[key] != null) {
                    // Special search criteria for Size column
                    if(key == "filesize"){
                        if(fileSizeSearch(row, key, tempSearchTerm) &&
                            !(key == "counter" || key == "editor" || key == "trashcan")) match = true;
                    } else if(key == "filename") {
                        if(fileNameSearch(row, key, tempSearchTerm) &&
                            !(key == "counter" || key == "editor" || key == "trashcan")) match = true;
					} else {
                        if (row[key].toUpperCase().indexOf(tempSearchTerm.toUpperCase()) != -1 &&
                            !(key == "counter" || key == "editor" || key == "trashcan")) match = true;
                    }
                }
            }

        }
        if(!match) return false;
    }
    return true;
}

function fileSizeSearch(row, colName, searchName){
	var obj = JSON.parse(row[colName]);
    var tempString="-";
    if(obj.kind!="Link"){
        tempString = formatBytes(parseInt(obj.size), 0);
    }
    return tempString.toUpperCase().indexOf(searchName.toUpperCase()) != -1;
}
function fileNameSearch(row, colName, searchName) {
    var obj = JSON.parse(row[colName]);
    return obj.shortfilename.toUpperCase().indexOf(searchName.toUpperCase()) != -1;
}

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderSortOptions(col,status) {
	str = "";

	if (status ==- 1) {
		str += "<span class='sortableHeading' onclick='fileLink.toggleSortStatus(\"" + col + "\",0)'>" + col + "</span>";
	} else if (status == 0) {
		str += "<span class='sortableHeading' onclick='fileLink.toggleSortStatus(\"" + col + "\",1)'>" + col + "<img class='sortingArrow' src='../Shared/icons/desc_white.svg'/></span>";
	} else {
		str += "<span class='sortableHeading' onclick='fileLink.toggleSortStatus(\"" + col + "\",0)'>" + col + "<img class='sortingArrow' src='../Shared/icons/asc_white.svg'/></span>";
	}
	return str;
}

//--------------------------------------------------------------------------
// compare
// ---------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------
function compare(a,b) {
	var col = sortableTable.currentTable.getSortcolumn();
	var tempA = a;
	var tempB = b;
	if (col == "File name") {
		tempA = JSON.parse(tempA);
		tempB = JSON.parse(tempB);
		tempA = tempA.shortfilename.toUpperCase();
		tempB = tempB.shortfilename.toUpperCase();
	} else if (col == "Size") {
		tempA = JSON.parse(tempA);
		tempB = JSON.parse(tempB);
		if(tempA.kind != "Link"){
            tempA = parseInt(tempA.size);
		} else {
			tempA = -1;
		}
		if(tempB.kind != "Link") {
            tempB = parseInt(tempB.size);
		} else {
			tempB = -1;
		}
	}

	if (tempA > tempB) {
		return 1;
	} else if (tempA < tempB) {
		return -1;
	} else {
		return 0;
	}
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

// Toggles action bubbles when pressing the FAB button
function toggleFabButton() {
	if (!$('.fab-btn-sm').hasClass('scale-out')) {
		$('.fab-btn-sm').toggleClass('scale-out');
		$('.fab-btn-list').delay(250).fadeOut(0);
	} else {
		$('.fab-btn-list').fadeIn(0);
		$('.fab-btn-sm').toggleClass('scale-out');
	}
}

$(document).mousedown(function(e) {
	// If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
		if (e.target.id == "gFabBtn" || e.target.id == "gFabBtnImg") {
	    	showFilePopUp('GFILE');
	    } else if (e.target.id == "lFabBtn" || e.target.id == "lFabBtnImg") {
	    	showFilePopUp('LFILE');
	    } else if (e.target.id == "mFabBtn" || e.target.id == "mFabBtnImg") {
	    	showFilePopUp('MFILE');
	    } else if (e.target.id == "linkFabBtn" || e.target.id == "linkFabBtnImg") {
	    	showLinkPopUp();
	    }
        else if ($('.fab-btn-list').is(':visible') && $('#fabBtn').is(e.target)) {
			toggleFabButton();
    }
	} else {
        if (e.target.id == "fabBtn") {
			pressTimer = window.setTimeout(function() {
				toggleFabButton();
			}, 500);
		}
	}
}).mouseup(function(e) {
	// The "Add Course Local File" popup should appear on
	// a "fast click" if the fab list isn't visible
	if ((e.target.id=="fabBtn") && !$('.fab-btn-list').is(':visible')) {
			clearTimeout(pressTimer);
			showFilePopUp('MFILE');

    }// Click outside the FAB list
    else if ($('.fab-btn-list').is(':visible') && (e.target.id!="fabBtn")) { // if the target of the click isn't the container...
        toggleFabButton();
	}
}).on("touchstart", function(e){
    // If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
        //toggleFabButton();

	} else {
        if (e.target.id == "fabBtn") {
			pressTimer = window.setTimeout(function() {
				toggleFabButton();

			}, 500);
            return false;
		}
	}
}).on("touchend", function(e){
    //abrupts and clears the timer for touchstart when the user lets go of the fab
    // The "Add Course Local File" popup should appear on
	// a "fast click" if the fab list isn't visible
	if ((e.target.id=="fabBtn") && !$('.fab-btn-list').is(':visible')) {
			clearTimeout(pressTimer);
			showFilePopUp('MFILE');
           return false;
    }// Click outside the FAB list


});



function deleteFile(fileid,filename) {
	if (confirm("Do you really want to delete the file/link: " + filename)) {
		AJAXService("DELFILE",{fid:fileid,cid:querystring['cid']},"FILE");
	}
	/*Reloads window when deleteFile has been called*/
	window.location.reload(true);
}

/*****************************************************************
 * --------------------------------------------------------------*
 * loadFile(), editFile(), cancelEditFile() and closeEditFile()  *
 * makes it possible to open and edit or modify an existing 	 *
 * file (js, css, html and php). Doesn't include markdown!		 *
 * --------------------------------------------------------------*
 *****************************************************************/

function loadFile(fileUrl, fileNamez, fileKind) {
    $("#fileName").val(fileNamez);
    $("#fileKind").val(fileKind);
    $(".previewWindow").show();
    $(".previewWindowContainer").css("display", "block");
    $(".markdownPart").hide();
    $(".editFilePart").show();

    //$(".editFileWindowContainer").css("display", "block");
    var fileContent = getFIleContents(fileUrl);
	var fileName = fileUrl.split("/").pop().split(".")[0];
    document.getElementById("filecont").value = fileContent;
	$(".fileName").html(fileName);
    editFile(fileContent);
}

function editFile(str){
        if(str.length == 0){
            document.getElementById("filecont").innerHTML = " ";
            return;
        }
        else {
            document.getElementById("filecont").innerHTML=str;
        };

}
function cancelEditFile() {
    // $(".editFileWindow").hide();
    $(".editFileWindowContainer").css("display", "none");
}

function saveMarkdown() {
    $("#cID").val(querystring['cid']);
    $("#courseVers").val(querystring['coursevers']);
    $("#textField").val("markdowntext");
}

function saveTextToFile() {
    $("#cID").val(querystring['cid']);
    $("#courseVers").val(querystring['coursevers']);
    $("#textField").val("filetext");
}

function validatePreviewForm(){
	if(document.getElementById("cID").value == "Toddler"){
		return false;
	}
	return true;
}
function setfileCarotPosition(){
	this.txtarea = document.getElementById("filecont");
	this.start = txtarea.selectionStart;
	this.end = txtarea.selectionEnd;
	this.sel = txtarea.value.substring(start,end);
	var finText = txtarea.value.substring(0,start) + '\t' + sel + txtarea.value.substring(end);
	txtarea.value = finText;
	txtarea.focus();
	txtarea.selectionEnd=end+2;
	editFile(txtarea.value);

}
$(document).ready(function(){
	$("#filecont").keydown(function(e) {
		if (e.keyCode == 9){
			e.preventDefault();
			setfileCarotPosition();
		}
	});
});
