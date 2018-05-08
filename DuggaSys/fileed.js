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
    		counter:"",
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
	$(".previewWindow").css("display","none");
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
	var list = celldata.split('.');
	var link = celldata.split('://');
	var str="";

	if (col == "counter") {
		return "<div class='counterBox'>" + ++fileLink.rowIndex + "</div>";
	} if (col == "trashcan") {
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
			return "<div id='openFile' onclick='changeURL(\"showdoc.php?cid="+querystring['cid']+"&coursevers="+querystring['coursevers']+"&fname="+celldata+"\")'>" + listStr + "</div>";
		}
	} else if (col == "filesize") {
        var obj = JSON.parse(celldata);
        if(obj.kind == "Link") {
            return "-";
        }
        return formatBytes(obj.size, 0);
    } else if (col == "extension") {
        if(link[0] == "https" || link[0] == "http"){
            return "<div> - </div>";
        }
	    return "<div>" + list[list.length - 1] + "</div>";
	} else if (col == "editor") {
		var obj = JSON.parse(celldata);
		list = obj.filename.split('.');
		link = obj.filename.split('://');
		if(link[0] == "https" || link[0] == "http"){
			str = "";
		} else if (list[list.length-1] == "md" || list[list.length-1] == "txt"){
			str = "<div class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ";
            str += "onclick='loadPreview(\"" + obj.filePath + "\", \"" + obj.filename + "\", " + obj.kind + ")'></div>";
		} else if (list[list.length-1] == "js" || list[list.length-1] == "html" || list[list.length-1] == "css" || list[list.length-1] == "php"){
            str = "<div class='iconBox'><img id='dorf' class='markdownIcon' src='../Shared/icons/markdownPen.svg' ";
            str += "onclick='loadFile(\"" + obj.filePath + "\")'></div>";
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
                case "extension":
                    columnToSearch = "extension";
                    break;
                case "kind":
                    columnToSearch = "kind";
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
    return formatBytes(parseInt(obj.size), 0).toUpperCase().indexOf(searchName.toUpperCase()) != -1
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
	let col = sortableTable.currentTable.getSortcolumn();
	var tempA = a;
	var tempB = b;
	if (col == "File name") {
		tempA = tempA.toUpperCase();
		tempB = tempB.toUpperCase();
	} else if (col == "Extension") {
        var linkA = tempA.split("://");
        var linkB = tempB.split("://");
		tempA = tempA.split('.');
		tempB = tempB.split('.');
		if(linkA[0] == "https" || linkA[0] == "http"){
			tempA = "-";
		} else {
            tempA = tempA[tempA.length-1];
		}
        if(linkB[0] == "https" || linkB[0] == "http"){
            tempB = "-";
        } else {
            tempB = tempB[tempB.length-1];
        }
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
		$('.fab-btn-list').delay(100).fadeOut(0);
	} else {
		$('.fab-btn-list').fadeIn(0);
		$('.fab-btn-sm').toggleClass('scale-out');
	}
}

$(document).mouseup(function(e) {
	// The "Add Course Local File" popup should appear on
	// a "fast click" if the fab list isn't visible
	if (!$('.fab-btn-list').is(':visible')) {
		if (e.target.id == "fabBtn" || e.target.id == "fabBtnImg") {
			clearTimeout(pressTimer);
			showFilePopUp('MFILE');
	    }
	    return false;
    }
	// Click outside the FAB list
    if ($('.fab-btn-list').is(':visible') && !$('.fixed-action-button').is(e.target)// if the target of the click isn't the container...
        && $('.fixed-action-button').has(e.target).length === 0) {// ... nor a descendant of the container
		if (!$('.fab-btn-sm').hasClass('scale-out')) {
			$('.fab-btn-sm').toggleClass('scale-out');
			$('.fab-btn-list').delay(100).fadeOut(0);
		}
	} else if ($('.fab-btn-list').is(':visible') && $('.fixed-action-button').is(e.target)) {
		if (!$('.fab-btn-sm').hasClass('scale-out')) {
			$('.fab-btn-sm').toggleClass('scale-out');
			$('.fab-btn-list').fadeOut(0);
		}
	}
}).mousedown(function(e) {
	// If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
		fabListIsVisible = false;
	} else {
		fabListIsVisible = true;
	}
	if (fabListIsVisible) {
		if (e.target.id == "fabBtn" || e.target.id == "fabBtnImg") {
			pressTimer = window.setTimeout(function() {
				toggleFabButton();
			}, 500);
		}
	} else {
		toggleFabButton();
		if (e.target.id == "gFabBtn" || e.target.id == "gFabBtnImg") {
	    	showFilePopUp('GFILE');
	    } else if (e.target.id == "lFabBtn" || e.target.id == "lFabBtnImg") {
	    	showFilePopUp('LFILE');
	    } else if (e.target.id == "mFabBtn" || e.target.id == "mFabBtnImg") {
	    	showFilePopUp('MFILE');
	    } else if (e.target.id == "linkFabBtn" || e.target.id == "linkFabBtnImg") {
	    	showLinkPopUp();
	    }
	}
}).on("touchstart", function(e){
    
    if ($('.fab-btn-list').is(':visible')) {
		fabListIsVisible = false;
	} else {
		fabListIsVisible = true;
	}
	if (fabListIsVisible) {
		if (e.target.id == "fabBtn" || e.target.id == "fabBtnImg") {
			fabTimer = window.setTimeout(function() {
				toggleFabButton();
			}, 500);
		}
	} else {
		toggleFabButton();
		if (e.target.id == "gFabBtn" || e.target.id == "gFabBtnImg") {
	    	showFilePopUp('GFILE');
	    } else if (e.target.id == "lFabBtn" || e.target.id == "lFabBtnImg") {
	    	showFilePopUp('LFILE');
	    } else if (e.target.id == "mFabBtn" || e.target.id == "mFabBtnImg") {
	    	showFilePopUp('MFILE');
	    } else if (e.target.id == "linkFabBtn" || e.target.id == "linkFabBtnImg") {
	    	showLinkPopUp();
	    }
	}
}).on("touchend", function(e){
    if(fabTimer){
        clearTimeout(fabTimer);
    }
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

function loadFile(fileUrl) {
    $(".editFileWindow").show();
    $(".editFileWindowContainer").css("display", "block");
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
    $(".editFileWindow").hide();
    $(".editFileWindowContainer").css("display", "none");
}

function saveMarkdown() {
    $("#cID").val(querystring['cid']);
    $("#courseVers").val(querystring['coursevers']);
}

