//----------------------------------------------------------------------------------
// changeCSS: Changes the CSS and remembers the index of the CSS.
//            This allows us to set and remove whole CSS files
//----------------------------------------------------------------------------------
var renderId; // Used to store active rendering function
var benchmarkData = performance.timing; // Will be updated after onload event

var status = 0;
var showing = 1;
var score;
var timeUsed;
var stepsUsed;
var inParams = "UNK";
var MAX_SUBMIT_LENGTH = 5000;
var querystring=parseGet();
var pressTimer;

$(function () {  // Used to set the position of the FAB above the cookie message
	if(localStorage.getItem("cookieMessage")!="off"){
		$(".fixed-action-button").css("bottom", "64px");
	}
})

//----------------------------------------------------------------------------------
// get all the indexes where a substring (needle) is found in a string (haystack)
// adapted from https://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-element-in-array
//----------------------------------------------------------------------------------
function getAllIndexes(haystack, needle) {
	var indexes = [];
	if(haystack===null||needle===null||needle==="") return indexes;
	var i = haystack.indexOf(needle);
	while (i !== -1) {
		indexes.push(i);
		i = haystack.indexOf(needle, ++i);
	}
	return indexes;
}

//Set the localstorage item securitynotifaction to on or off
function setSecurityNotifaction(param){
    localStorage.setItem("securitynotification", param);
}

function resetLoginStatus(){
  status = 1;
  showing = 0;
  toggleloginnewpass();
}

function toggleloginnewpass(){
	resetFields();

  //Shows the New password-box (username input)
	if(status == 0){
		$("#newpassword").css("display", "block");
		$("#loginBox").css("display", "flex");
    $("#login").hide();
		$("#showsecurityquestion").css("display", "none");
		$("#resetcomplete").css("display", "none");
		status= 1;
		showing= 0;
    //Shows the Login-box
	}else if(status == 1){
		$("#newpassword").css("display", "none");
		$("#login").css("display", "block");
		$("#showsecurityquestion").css("display", "none");
		$("#resetcomplete").css("display", "none");
		status= 0;
		showing= 1;
    //Shows the Sequrity question-box (answer for question input)
	}else if(status == 2){
		$("#newpassword").css("display", "none");
		$("#loginBox").css("display", "flex");
		$("#showsecurityquestion").css("display", "block");
		$("#resetcomplete").css("display", "none");
		status= 1;
		showing= 2;
	}
  //Shows the Reset complete-box
	else if(status == 3){
		$("#newpassword").css("display", "none");
		$("#loginBox").css("display", "flex");
		$("#showsecurityquestion").css("display", "none");
		$("#resetcomplete").css("display", "block");
		status= 1;
		showing= 3;
	}
}

// This function only resets login and forgot password fields
function resetFields(){
	$("#login #username").val("");
	$("#login #password").val("");
	//Since we need the username from this box during the answer part we cant clear it directly afterwards
	if (status!=2){
		$("#newpassword #username").val("");
	}
	$("#showsecurityquestion #answer").val("");

  //Changes the background color back to white
	$("#loginBox #username").css("background-color", "rgb(255, 255, 255)");
	$("#loginBox #password").css("background-color", "rgb(255, 255, 255)");
	$("#newpassword #username").css("background-color", "rgb(255, 255, 255)");
	$("#showsecurityquestion #answer").css("background-color", "rgb(255, 255, 255)");

  //Hides error messages
  displayAlertText("#login #message", "");
  displayAlertText("#newpassword #message2", "");
  displayAlertText("#showsecurityquestion #message3", "");
}

//----------------------------------------------------------------------------------
// datediff: Number of days between two dates
//----------------------------------------------------------------------------------

function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    return Math.round((second-first)/(1000*60*60*24));
}

//----------------------------------------------------------------------------------
// scrollToBottom: scrolls the page to the bottom
//----------------------------------------------------------------------------------

function scrollToBottom() {
	var scrollingElement = (document.scrollingElement || document.body)
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

//----------------------------------------------------------------------------------
// getHiddenElements: Get all element ids from local storage (who's children should be hidden).
//----------------------------------------------------------------------------------

function getHiddenElements() {
	menuState.hiddenElements = JSON.parse(localStorage.getItem('hiddenElements'));
	if (menuState.hiddenElements === null) {
		menuState.hiddenElements = [];
	}
}

//----------------------------------------------------------------------------------
// getArrowElements: Get all arrow image ids from local storage that should be toggled.
//----------------------------------------------------------------------------------

function getArrowElements() {
	menuState.arrowIcons = JSON.parse(localStorage.getItem('arrowIcons'));
	if (menuState.arrowIcons === null) {
		menuState.arrowIcons = [];
	}
}

//----------------------------------------------------------------------------------
// findAncestor: Finds the nearest parent element of "element" that contains the class "className".
//----------------------------------------------------------------------------------

function findAncestor(element, className) {
	if (element != undefined || element != null) {
		while ((element = element.parentElement) && !element.classList.contains(className));
		return element;
	}
}

//----------------------------------------------------------------------------------
// addOrRemoveFromArray: Toggle string in array. Add string to array if it does not exist in the array. Remove string from array if it exist in the array. */
//----------------------------------------------------------------------------------

function addOrRemoveFromArray(elementID, array) {
	var exists = false;
	for (var i = 0; i < array.length; i++) {
		if (elementID == array[i]) {
			exists = true;
			array.splice(i, 1);
			break;
		}
	}
	if (!exists) {
		array.push(elementID);
	}
}

//----------------------------------------------------------------------------------
// makeoptions: Prepares a dropdown list with highlighting of previously selected item
//----------------------------------------------------------------------------------

function makeoptions(option,optionlist,valuelist)
{
		var str="";
		for(var i=0;i<optionlist.length;i++){
				str+="<option ";
				if(valuelist==null){
						if(i==option){
								str+="selected='selected' ";
						}
						str+="value='"+i+"'>"+optionlist[i]+"</option>";
				}else{
						if(valuelist[i]==option){
								str+="selected='selected' ";
						}
						str+="value='"+valuelist[i]+"'>"+optionlist[i]+"</option>";
				}
		}
		return str;
}

//----------------------------------------------------------------------------------
// makeoptionsItem: Prepares a dropdown list specifically for items such as code examples / dugga etc
//----------------------------------------------------------------------------------

function makeoptionsItem(option,optionlist,optionstring,valuestring)
{
	var str="";
	for(var i=0;i<optionlist.length;i++){
		str+="<option ";
		if(optionlist[i][valuestring]==option){
			str+="selected='selected' ";
		}
		str+="value='"+optionlist[i][valuestring]+"'>"+optionlist[i][optionstring]+"</option>";
	}
	return str;
}

//----------------------------------------------------------------------------------
// makedivItem: Prepares a dropdown list specifically for items such as code examples / dugga etc
//----------------------------------------------------------------------------------

function makedivItem(option,optionlist,optionstring,valuestring)
{
		var str="";
		str +="<div class='access-dropdown-content'>"
			str+="<div data-value='"+null+"' onclick='changeOptDiv(event)'";
			if (option === "") {
				str+=" class = 'access-dropdown-selected'";
			}
			str+=">"+"None"+"</div>";
			for(var i=0;i<optionlist.length;i++){
				/* Check if a class & version is set or not.
				If it has, it will be styled by id = 'access-dropdown-selected'.
				"If" sets an id so it could be styled and print out all options. "Else" prints out all options.*/
                if(option == optionlist[i][optionstring]){
                    str+="<div class = 'access-dropdown-selected' data-value='"+optionlist[i][valuestring]+"' onclick='changeOptDivStudent(event,\""+optionlist[i][valuestring]+"\")'>";
                    str+=""+optionlist[i][optionstring]+"</div>";
                }else{
                    str+="<div data-value='"+optionlist[i][valuestring]+"' onclick='changeOptDivStudent(event,\""+optionlist[i][valuestring]+"\")' >";
                    str+=""+optionlist[i][optionstring]+"</div>";
                }
			}
		str +="</div>"
		return str;
}

function makedivItemWithValue(option,optionlist,optionstring,valuestring)
{
		var str="";
		str +="<div class='access-dropdown-content'>"
			str+="<div data-value='"+null+"' onclick='changeOptDivStudent(event,\""+-1+"\")'";
			if (option === "") {
				str+=" class = 'access-dropdown-selected'";
			}
			str+=">"+"None"+"</div>";
			for(var i=0;i<optionlist.length;i++){
				/* Check if a examiner is set or not.
				If it has, it will be styled by id = 'access-dropdown-selected'.
				"If" sets an id so it could be styled and print out all options. "Else" prints out all options.*/
                if(option == optionlist[i][optionstring]){
                    str+="<div class = 'access-dropdown-selected' data-value='"+optionlist[i][valuestring]+"' onclick='changeOptDivStudent(event,\""+optionlist[i][valuestring]+"\")'>";
                    str+=""+optionlist[i][optionstring]+"</div>";
                }else{
                    str+="<div data-value='"+optionlist[i][valuestring]+"' onclick='changeOptDivStudent(event,\""+optionlist[i][valuestring]+"\")' >";
                    str+=""+optionlist[i][optionstring]+"</div>";
                }
            }
		str +="</div>"
		return str;
}

function makeDivItemStudent(option,optionlist,valuelist)
{
		var str="";
		var stringArray = ["W","R","ST"];
		str +="<div class='access-dropdown-content'>"
		for(var i=0;i<optionlist.length;i++){
			str+="<div data-value='"+stringArray[i]+"' onclick='changeOptDivStudent(event,\""+stringArray[i]+"\")'";
			if(option == valuelist[i]){
				str+=" class = 'access-dropdown-selected'>"+optionlist[i]+"</div>";
			}else{
				str+=">"+optionlist[i]+"</div>";
			}
		}
		str +="</div>"
		return str;
}

//----------------------------------------------------------------------------------
// makeparams: Help function for hassle free preparation of a clickable param list
//----------------------------------------------------------------------------------

function makeparams(paramarray)
{
		var str="";
		for(var i=0;i<paramarray.length;i++){
				if(i>0) str+=",";
				str+="\""+paramarray[i]+"\"";
		}
		return str;
}

//----------------------------------------------------------------------------------
// makeanchor: Help function for hassle free preparation of an anchor link with parameters
//----------------------------------------------------------------------------------

function makeanchor(anchorhref,anchorclass,anchorstyle,title,isblank,paramobj)
{
		var str="<a class='"+anchorclass+"' style='"+anchorstyle+"' href='"+anchorhref;
		var i=0;
		for (var property in paramobj) {
  			if(i>0){ str+="&" } else { str+="?" };
				str+=property+"="+paramobj[property];
				i++;
		}
		str+="' title='"+title+"' ";
		if(isblank) str+="target='_blank' ";
	  str+=">"+title+"</a>";

		return str;
}

//----------------------------------------------------------------------------------
// navigatePage: Local function for converting static page navigation to dynamic
//----------------------------------------------------------------------------------
function navigatePage(clicked_id, pagename)
{
		changeURL(clicked_id, pagename+"?cid=" + querystring['courseid'] + "&coursevers="+ querystring['coursevers']);
}

//----------------------------------------------------------------------------------
// getDateFormat: Function for making PHP compatible date from javascript date
//----------------------------------------------------------------------------------

function getDateFormat(date, operation = ""){
	if(operation == "hourMinuteSecond"){
		return date.getFullYear() + "-"
			+ ('0' + (date.getMonth()+1)).slice(-2) + '-'
			+ ('0' + date.getDate()).slice(-2)
			+ "T" + date.getHours() + ":" + date.getMinutes() + ":"
			+ date.getSeconds();
	}else if(operation == "dateMonth"){
		return ('0' + date.getDate()).slice(-2) + '-'
			+ ('0' + (date.getMonth()+1)).slice(-2);

	}
	return date.getFullYear() + "-"
			+ ('0' + (date.getMonth()+1)).slice(-2) + '-'
			+ ('0' + date.getDate()).slice(-2)
}

//----------------------------------------------------------------------------------
// weeksBetween: Function for computing number of calendar weeks between dates
//----------------------------------------------------------------------------------

function weeksBetween(firstDate, secondDate){
	var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
	var diff = Math.abs(firstDate - secondDate);
	return Math.round(diff / ONE_WEEK);
}

//----------------------------------------------------------------------------------
// weeksBetween: Function for computing week number for date
//----------------------------------------------------------------------------------

function getWeek(tdate)
{
		var date = new Date(tdate.getTime());
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
		var week1 = new Date(date.getFullYear(), 0, 4);
		return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6 ) % 7) / 7);
}

//----------------------------------------------------------------------------------
// makeTextArray: Return array position X in text value array
//----------------------------------------------------------------------------------

function makeTextArray(intval,valarr)
{
		return valarr[intval];
}

//----------------------------------------------------------------------------------
// removeYearFromDate: Removes the year from the date
//----------------------------------------------------------------------------------

function removeYearFromDate(date){
	var remadeDate = new Date(date);
	return getDateFormat(remadeDate, "dateMonth").replace("-" ,"/");
}

//----------------------------------------------------------------------------------
// cookie that after 1 hour and 45 minutes will let the user know (through another function)
// that there is 15 minutes left of session.
//----------------------------------------------------------------------------------

function setExpireCookie(){
    if(localStorage.getItem("securityquestion") == "set") {
				var expireDate = new Date();
				// A test date so you dont have to actually wait 1 hour and 45 minutes.
				// Don't forget to change the one below (setExpireCookieLogOut()) too.
				//expireDate.setMinutes(expireDate.getMinutes() + 1);	// For testing
				expireDate.setMinutes(expireDate.getMinutes() + 105);	// For actual use
        document.cookie = "sessionEndTime=expireC; expires=" + expireDate.toUTCString() + "; path=/";
    }
}

//----------------------------------------------------------------------------------
// a cookie that will end the session after 2 hours
//----------------------------------------------------------------------------------

function setExpireCookieLogOut() {
    if (localStorage.getItem("securityquestion") == "set") {
				var expireDate = new Date();
				//expireDate.setMinutes(expireDate.getMinutes() + 2);	// For testing
				expireDate.setMinutes(expireDate.getMinutes() + 120);	// For actual use
        document.cookie = "sessionEndTimeLogOut=expireC; expires=" + expireDate.toUTCString() + "; path=/";
    }
}

//----------------------------------------------------------------------------------
function closeWindows(){
	var index_highest = 0;
	var e;

	//More effective to have a class for the div you want to search and pass that to your selector
	$("*").each(function() {
		//Always use a radix when using parseInt
		var index_current = parseInt($(this).css("zIndex"), 10);
		if(index_current > index_highest && this.style.display == "block"||index_current > index_highest && this.style.display == "flex") {
			index_highest = index_current;
			e=this;
			var tempString = e.outerHTML;
			if(tempString.includes('<div class="previewWindow"')){
				e.style.display="none";
			}
		}
	});

	if (index_highest > 0 && e.id !== "FABStatic"){
		/* Overlay is only present for loginbox which has z-index of 9000,
		so if we closed such a window, hide the overlay and clear any values as well. */
		var tempString2 = e.outerHTML;
		if(!tempString2.includes('<div id="TopMenuStatic"')) {
			e.style.display= "none";
		}
		if (index_highest < 10000) {
			status=1;
			//toggleloginnewpass();
			//$("#overlay").css("display","none");
			resetFields();
		}
	}

	$(document).keyup(function(e) {
		if (e.which == 27){
			resetLoginStatus();
		}
	});

	window.removeEventListener("keypress", loginEventHandler, false);
}

function changeCSS(cssFile, index)
{
		var cssLinkIndex = index;
		var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);
		var newlink = document.createElement("link");
		newlink.setAttribute("rel", "stylesheet");
		newlink.setAttribute("type", "text/css");
		newlink.setAttribute("href", cssFile);

		document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

//----------------------------------------------------------------------------------
// loadJS: Using Jquery Dynamically Load external JS.
//          Does not load again if previously loaded same file
//----------------------------------------------------------------------------------

var JSFiles=[];

function loadJS(src) {
		if(JSFiles[src]!="Loaded"){
		   var jsLink = $("<script type='text/javascript' src='"+src+"'>");
		   $("head").append(jsLink);
		   JSFiles[src]="Loaded";
		}else{
				// Do nothing if already loaded
		}
};

//----------------------------------------------------------------------------------
// loadCSS: Using Jquery Dynamically Load external CSS
//----------------------------------------------------------------------------------

function loadCSS(href) {
		var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
		$("head").append(cssLink);
};

//----------------------------------------------------------------------------------
// randomstring: Generates a random password string
//----------------------------------------------------------------------------------


function randomstring()
{
		str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";

		var valu="";
		for(i=0;i<9;i++){
				valu+=str.charAt(Math.floor(Math.random()*str.length));
		}

		return valu;
}

//----------------------------------------------------------------------------------
// isNumber:    returns true: the variable only contains numbers
//              returns false: the variable is not purely numeric
//        Is called by editImpRows in codeviewer.js
//----------------------------------------------------------------------------------

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

//----------------------------------------------------------------------------------
// saveDuggaResult: Saves the result of a dugga
//----------------------------------------------------------------------------------
function saveDuggaResult(citstr)
{
	var readonly;
	$.ajax({
		url: "courseedservice.php",
		dataType: "json"
	}).done(response => {
		readonly=response.readonly;
		//Read-only is active
		if(readonly == 1)
		{
			console.log("Read-only is active, duggas cannot be submitted at this time");
		}
		//Read-only is not active
		else
		{
			citstr=querystring['moment']+" "+citstr;
			citstr=querystring['coursevers']+" "+citstr;
			citstr=querystring['cid']+" "+citstr;
			citstr+= "##!!##" + timeUsed;
			citstr+= "##!!##" + stepsUsed;
			citstr+= "##!!##" + score;
			hexstr="";
			for(i=0;i<citstr.length;i++){
					hexstr+=citstr.charCodeAt(i).toString(16)+" ";
			}

			AJAXService("SAVDU",{answer:citstr},"PDUGGA");

			document.getElementById('receipt').value = hexstr;

			var dateTime = new Date(); // Get the current date and time

			var comment = querystring['comment']; //Get the comment

			var deadline = querystring['deadline']; //Get deadlinedate from URL


			Number.prototype.padLeft = function(base,chr){
				var  len = (String(base || 10).length - String(this).length)+1;
				return len > 0? new Array(len).join(chr || '0')+this : this;
			}

			dateTimeFormat = [dateTime.getFullYear(),(dateTime.getMonth()+1).padLeft(),dateTime.getDate().padLeft()].join('-') +' ' +[dateTime.getHours().padLeft(),dateTime.getMinutes().padLeft(),dateTime.getSeconds().padLeft()].join(':');

			if(deadline > dateTimeFormat){	//Check if deadline has past

				document.getElementById('receiptInfo').innerHTML = "<p>Teckensträngen är ditt kvitto på att duggan har lämnats in. Spara kvittot på en säker plats.\n\n</p>";

			}
			else{ //Check if deadline has past

				if(comment == "UNK" || comment == "undefined" || comment == "null"){
					document.getElementById('receiptInfo').innerHTML = "<p style='margin:15px 5px;'>Teckensträngen är ditt kvitto på att duggan har lämnats in. Spara kvittot på en säker plats.</p><img style='width:40px;float:left;margin-right:10px;' title='Warning' src='../Shared/icons/warningTriangle.svg'/><p>OBS! Denna inlämning har gjorts efter att deadline har passerat. Läraren kommer att rätta duggan vid nästa ordinarie rättningstillfälle ELLER i mån av tid.</p>";
				}
				else{
					document.getElementById('receiptInfo').innerHTML = "<p>Teckensträngen är ditt kvitto på att duggan har lämnats in. Spara kvittot på en säker plats.</p><img style='width:40px;float:left;margin-right:10px;' title='Warning' src='../Shared/icons/warningTriangle.svg'/><p>"+comment+"</p>";
				}

			}
      duggaFeedbackCheck();
			showReceiptPopup();
		}
	});
}

//----------------------------------------------------------------------------------
// savequizResult: Saves the result of a quiz
//----------------------------------------------------------------------------------

function savequizResult(citstr)
{
	citstr=querystring['moment']+" "+citstr;
	citstr=querystring['coursevers']+" "+citstr;
	citstr=querystring['cid']+" "+citstr;
	AJAXService("SAVDU",{answer:citstr},"PDUGGA");
	alert('inlämnat');
}


//----------------------------------------------------------------------------------
// changeURL: Patch-in for changeURL from project 2014 code
//----------------------------------------------------------------------------------

function changeURL(clicked_id, thisurl)
{
	var link = document.getElementById(clicked_id);
	link.href=thisurl;
}

//----------------------------------------------------------------------------------------
// changeCourseVersURL: Separet function for changing course version, taken from changeURL
//----------------------------------------------------------------------------------------

function changeCourseVersURL(thisurl)
{
  window.location.href = thisurl;
}


//----------------------------------------------------------------------------------
// navigateExample: Upscale variant of changeURL - navigate to certain Example
//----------------------------------------------------------------------------------

function navigateExample(exampleno)
{
		surl=window.location.href;
		surl=surl.substring(0,surl.lastIndexOf("/"));
		window.location.href = surl+"/codeviewer.php?exampleid="+exampleno+"&courseid="+querystring['courseid']+"&cvers="+querystring['cvers'];
}

//----------------------------------------------------------------------------------
// navigateTo: Upscale variant of changeURL
//----------------------------------------------------------------------------------

function navigateTo(prefix,file)
{
		surl=window.location.href;
		surl=surl.substring(0,surl.lastIndexOf("/"));
		window.location.href = surl+prefix+file;
}


//----------------------------------------------------------------------------------
// parseGet: reads the parameters from the get url and places content in an array
//----------------------------------------------------------------------------------

function parseGet(){
    var tmp = [];
    var result=[];
		sstr=location.search;
    digs=sstr.substr(1).split("&");
		for(var i=0;i<digs.length;i++){
				tmp=digs[i].split("=");
				result [tmp[0]] = decodeURIComponent(tmp[1]);
		}
    return result;
}

//----------------------------------------------------------------------------------
// htmlEntities: removes some non ASCII characters and replaces them with corresponding hmtl codes
//----------------------------------------------------------------------------------

function htmlEntities(str) {
	if (typeof str === "string"){
		befstr=str;
		if(str!=undefined && str != null){
			str=str.replace(/\&/g, '&amp;');
			str=str.replace(/\</g, '&lt;');
			str=str.replace(/\>/g, '&gt;');
			str=str.replace(/\ö/g, '&ouml;');
			str=str.replace(/\Ö/g, '&Ouml;');
			str=str.replace(/\ä/g, '&auml;');
			str=str.replace(/\Ä/g, '&Auml;');
			str=str.replace(/\å/g, '&aring;');
			str=str.replace(/\Å/g, '&Aring;');
			str=str.replace(/\"/g, '&quot;');
			str=str.replace(/\//g, '&#47;');
			str=str.replace(/\\/g, '&#92;');
			str=str.replace(/\?/g, '&#63;');
		}
	}
   	return str;
}

//----------------------------------------------------------------------------------
// AJAX Service: Generic AJAX Calling Function with Prepared Parameters
//----------------------------------------------------------------------------------

function AJAXService(opt,apara,kind)
{
	var tex = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i=0; i<15; i++){
      tex += possible.charAt(Math.floor(Math.random() * possible.length));
  }
	apara.log_uuid = tex;
	
  var para="";
	for (var key in apara) {
		var old = apara[key];
		if (typeof(apara[key]) != "undefined" && apara[key] != "" && apara[key] != null) {
			// Handles all the individual elements in an array and adds the array as such: &key=val1,val2,val3
			// This handles the important words that are sent from the codeviewer
			if (apara[key].constructor === Array && key != "addedRows" && key != "removedRows") {
					var array = [];
					for (var i = 0; i < apara[key].length; i++) {
							array.push(encodeURIComponent(htmlEntities(apara[key][i])));
					}
					para+="&"+key+"="+array;
			}else if (key == "addedRows" || key == "removedRows") {
					// Handles all the individual elements in an array and adds the array as such: &key=[val1,val2,val3][val1,val2,val3]
					// This case is specifically for adding/removing important rows in the codeviewer

					para+="&"+key+"=";
					var array = [];
					for (var i = 0; i < apara[key].length; i++) {
							var string = "[";
							var row = [];
							for (var j = 0; j < apara[key][i].length; j++) {
									row.push(apara[key][i][j]);
							}
							string += row + "]";
							array.push(string);
					}
					para += array;
			}else{
					// Concat the generated regex result to a string again.
					// apara[key] = s.join("");
					apara[key] = old;

					// Informs the user that his input contained illegal characters that were removed after parsing.
					if(old != apara[key]) {
						alert("Illegal characters removed in " + key);
					}
					para+="&"+key+"="+encodeURIComponent(htmlEntities(apara[key]));
			}
		}
		if(apara[key] == "") {
				// Informs the user that his input contained nothing.
				console.log("Your input contained nothing in " + key);
		}
	}

	if(kind=="COURSE"){
			$.ajax({
				url: "courseedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedCourse
			});
	}else if(kind=="VARIANTPDUGGA"){
		$.ajax({
			url: "showDuggaservice.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedanswersDugga
		});
	}else if(kind=="DUGGA"){
		$.ajax({
			url: "duggaedservice.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedDugga
		});
	}else if(kind=="BDUGGA"){
			$.ajax({
				url: "duggaedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedBlankDugga
			});
	}else if(kind=="DUGGAHIGHSCORE"){
			$.ajax({
				url: "highscoreservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedHighscore
			});
	}else if(kind=="FILE"){
			$.ajax({
				url: "fileedservice.php",
				type: "POST",
				data: "coursevers="+querystring['coursevers']+"&opt="+opt+para,
				dataType: "json",
				success: returnedFile
			})
	}else if(kind=="ACCESS"){
			$.ajax({
				url: "accessedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedAccess
			});
	}else if(kind=="SECTION"){
    $.ajax({
      url: "sectionedservice.php",
      type: "POST",
      data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&comment="+querystring['comments']+"&opt="+opt+para,
      dataType: "json",
      success: returnedSection
    });
  }else if(kind=="GRP"){
    $.ajax({
      url: "sectionedservice.php",
      type: "POST",
      data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&comment="+querystring['comments']+"&opt="+opt+para,
      dataType: "json",
      success: returnedGroups
    });
  }else if(kind=="CONTRIBUTION"){
			$.ajax({
				url: "contributionservice.php",
				type: "POST",
				data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
				dataType: "json",
				success: returnedSection
			});
	}else if(kind=="DIAGRAM"){
			$.ajax({
				url: "diagramservice.php",
				type: "POST",
				data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
				dataType: "json",
				success: returnedSection
			});
	}else if(kind=="PDUGGA"){
			$.ajax({
				url: "showDuggaservice.php",
				type: "POST",
				data: "courseid="+querystring['cid']+"&did="+querystring['did']+"&coursevers="+querystring['coursevers']+"&moment="+querystring['moment']+"&segment="+querystring['segment']+"&opt="+opt+para,
				dataType: "json",
				success: returnedDugga
			});
	}else if(kind=="RESULT"){
			$.ajax({
				url: "resultedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedResults
			});
	}else if(kind=="GEXPORT"){
		$.ajax({
			url: "resultedservice.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedExportedGrades
		});
}else if(kind=="GROUP"){
			$.ajax({
				url: "groupedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedGroup
			});
	}else if(kind=="CODEVIEW"){
			$.ajax({
				url: "codeviewerService.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returned,
				error: returnedError
			});
	}else if(kind=="BOXCONTENT"){
		$.ajax({
			url: "codeviewerService.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returned
		});
	}else if(kind=="BOXTITLE"){
		$.ajax({
			url: "codeviewerService.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedTitle
		});
	// }else if(kind=="STATS") {
	// 	$.ajax({
	// 		url: "stats.php",
	// 		type:"POST",
	// 		data: "opt="+opt+para,
	// 		dataType: "json",
	// 		success: returnedAnalysis
	// 	});
	} else if(kind=="GETQUIZ") {
		$.ajax({
			url: "duggaedservice.php",
			type:"POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedQuiz
		});
	} else if(kind=="DUGGAFEEDBACK") {
		$.ajax({
			url: "showDuggaservice.php",
			type:"POST",
			data:"courseid="+querystring['cid']+"&moment="+querystring['moment']+"&opt="+opt+para,
			dataType: "json",
			success: returnedFeed
		});
	} else if(kind=="SENDDUGGAFEEDBACK") {
		$.ajax({
			url: "showDuggaservice.php",
			type:"POST",
			data:"courseid="+querystring['cid']+"&moment="+querystring['moment']+"&opt="+opt+para,
			dataType: "json",
			success: returnedSubmitFeedback
		});
	} else if(kind=="USERFB") {
		$.ajax({
			url: "sectionedservice.php",
			type:"POST",
			data:"courseid="+querystring['cid']+"&opt="+opt+para,
			dataType: "json",
			success: returnedUserFeedback
		});
	}
}

//Will handle enter key pressed when loginbox is showing
function loginEventHandler(event){
	if(event.keyCode == "0x0D"){
		if(showing == 1){
			processLogin();
		}else if(showing == 0){
			processResetPasswordCheckUsername();
		}else if(showing == 2){
			processResetPasswordCheckSecurityAnswer();
		}
	}
}

function addSecurityQuestionProfile(username) {
	$.ajax({
		type:"POST",
		url: "../Shared/resetpw.php",
		data: {
			username: username,
			opt: "GETQUESTION"
		},
		success:function(data) {
			var result = JSON.parse(data);
			if(result['getname'] == "success") {
				$("#challengeQuestion").html(result['securityquestion']);
			}else{
				if(typeof result.reason != "undefined") {
					$("#changeChallengeQuestion #securityQuestionError").html("<div class='alert danger'>" + result.reason + "</div>");
				} else {
					$("#changeChallengeQuestion #securityQuestionError").html("<div class='alert danger'>" + result['getname']  + "</div>");
				}
				$("#changeChallengeQuestion #challengeQuestion").css("background-color", "rgba(255, 0, 6, 0.2)");
				$("#changeChallengeQuestion #securityQuestionError").css("color", "rgba(255, 0, 6, 0.8)");
			}
		}
	});
}

// Checks if the page is using https
function checkHTTPS() {
	return (location.protocol == 'https:');
}

function processResetPasswordCheckUsername() {
	//Gets the security question from the database
	var username = $("#usernamereset").val();

	$.ajax({
		type:"POST",
		url: "../Shared/resetpw.php",
		data: {
			username: username,
			opt: "GETQUESTION"
		},
		success:function(data) {
			var result = JSON.parse(data);
				//It is worth to note that getname should probably be named status/error since thats basically what it is
			if(result['getname'] == "success") {
				$("#showsecurityquestion #displaysecurityquestion").html(result['securityquestion']);
				status = 2;
				toggleloginnewpass();
			}else if(result['getname'] == "limit"){
        displayAlertText("#newpassword #message2", "You have exceeded the maximum <br /> amount of tries within 5 min");
      }else{
				if(typeof result.reason != "undefined") {
          displayAlertText("#newpassword #message2", result.reason);
				} else {
          displayAlertText("#newpassword #message2", result['getname']);
				}
				$("#newpassword #username").css("background-color", "rgba(255, 0, 6, 0.2)");
			}
		}
	});
}

function processResetPasswordCheckSecurityAnswer() {
  //Checking so the sequrity question answer is correct and notefying a teacher that a user needs its password changed
  var username = $("#usernamereset").val();
  var securityquestionanswer = $("#answer").val();
  $.ajax({
    type:"POST",
    url: "../Shared/resetpw.php",
    data: {
      username: username,
      opt: "REQUESTCHANGE"
    },
    success:function(data){
      var result = JSON.parse(data);
      if(result['requestchange'] == "success"){
        status = 3;
        toggleloginnewpass();
      }else if(result['requestchange'] == "limit"){
        displayAlertText("#showsecurityquestion #message3", "You have exceeded the maximum <br /> amount of tries within 5 min");
      }else if(result['requestchange'] == "wrong"){
        displayAlertText("#showsecurityquestion #message3", "Wrong answer");
      }else{
        $("#showsecurityquestion #answer").css("background-color", "rgba(255, 0, 0, 0.2)");
        displayAlertText("#showsecurityquestion #message3", "Something went wrong");
      }
    }
  });
}

function processLogin() {
    var username = $("#login #username").val();
    var saveuserlogin = $("#login #saveuserlogin").val();
    var password = $("#login #password").val();
    if (saveuserlogin==1){
			saveuserlogin = 'on';
    }else{
			saveuserlogin = 'off';
    }

    $.ajax({
      type:"POST",
      url: "../Shared/loginlogout.php",
      data: {
        username: username,
        saveuserlogin: saveuserlogin,
        password: password,
        opt: "LOGIN"
      },
      success:function(data) {  		  
		var result = JSON.parse(data);
        if(result['login'] == "success") {
			document.cookie = "cookie_guest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //Removes guest cookie at login

			hideLoginPopup();

          	// was commented out before which resulted in the session to never end
			if(result['securityquestion'] != null) {
				localStorage.setItem("securityquestion", "set");
			} else {
				setSecurityNotifaction("on");
			}

           	setExpireCookie();
          	setExpireCookieLogOut();

          	reloadPage();
		}
		else if(result['login'] == "limit"){
        	displayAlertText("#login #message", "Too many failed attempts, <br /> try again later");
		}
		else{
        	if(typeof result.reason != "undefined") {
            	displayAlertText("#login #message", result.reason);
		  	} 
			else {
        		displayAlertText("#login #message", "Wrong username or password");
			}

			$("input#username").addClass("loginFail");
			$("input#password").addClass("loginFail");
			setTimeout(function(){
			$("input#username").removeClass("loginFail");
			$("input#password").removeClass("loginFail");
			displayAlertText("#login #message", "Try again");
					}, 2000);
          //closeWindows();
		}
		

      },
      error:function() {
        console.log("error");
      }
    });
}


function displayAlertText(selector, text){
  $(selector).html("<div style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>"+text+"</div>");
}

function processLogout() {
	$.ajax({
		type:"POST",
		url: "../Shared/loginlogout.php",
		success:function(data) {
            localStorage.removeItem("securityquestion");
            localStorage.removeItem("securitynotification");
            location.replace("../DuggaSys/courseed.php");
		},
		error:function() {
			console.log("error");
		}
	});
	document.cookie = "MOTD=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear MOTD cookies
}

function showLoginPopup()
{
	$("#loginBox").css("display","flex");
	/*$("#overlay").css("display","block");*/
	$("#username").focus();

	// Reset input box color
	$("input#username").css("background-color", "rgba(255, 255, 255, 1)");
	$("input#password").css("background-color", "rgba(255, 255, 255, 1)");

	// Reset warning, if applicable
  displayAlertText("#login #message", "");

	window.addEventListener("keypress", loginEventHandler, false);
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		/*$("#overlay").css("display","none");*/

		window.removeEventListener("keypress", loginEventHandler, false);
}

//----------------------------------------------------------------------------------
// setupLoginLogoutButton: Set button to login or logout functionality when navheader loads
//----------------------------------------------------------------------------------

function setupLoginLogoutButton(isLoggedIn){

	if(isLoggedIn == "true"){
		$("#loginbutton").off("click");
		$("#loginbutton").click(function(){
			$("#logoutBox").show();
			$("#logoutBox").css('display', 'block');
			$(".buttonLogoutCancelBox").click(function(){
				$("#logoutBox").hide();
			});


		});
		sessionExpireMessage();
		sessionExpireLogOut();
	}

	else{
		$("#loginbutton").off("click");
		$("#loginbutton").click(function(){showLoginPopup();});
	}
}

function showReceiptPopup()
{
	$("#receiptBox").css("display","flex");
	//$("#overlay").css("display","block");
}

function hideReceiptPopup()
{
	$("#receiptBox").css("display","none");
	//$("#overlay").css("display","none");
}

function hideFeedbackPopup(){
	$("#feedbackBox").css("display","none");
}

function showFeedbackPopup(){
	$("#feedbackBox").css("display","block");
}

function hideDuggaStatsPopup()
{
	$("#duggaStats").css("display", "none");
	//$("#overlay").css("display", "none");
}

function checkScroll(obj) {
	if(obj.clientHeight < obj.scrollHeight) {
		obj.style.height = (parseInt(obj.style.height)+1) + 'em';
	}
}

//function showEmailPopup()
//{
//	var receiptcemail ="";
//	document.getElementById("emailPopup").style.display = "block";
//	receiptcemail = localStorage.getItem("receiptcemail"); //fetches localstorage item
//	document.getElementById('email').value = receiptcemail;
//}

//function hideEmailPopup()
//{
//	$("#emailPopup").css("display","none");
//}

//----------------------------------------------------------------------------------
// Send dugga receipt to users email, save email in localstorage.
//----------------------------------------------------------------------------------
function sendReceiptEmail(){
	var receipt = document.getElementById('receipt').value;
	var email = $("#email").val();
		if (email != ""){
			localStorage.setItem("receiptcemail", email); //save value of input into a localStorage variable
			window.location="mailto:"+email+"?Subject=LENASys%20Dugga%20Receipt&body=This%20is%20your%20receipt%20:%20"+receipt+"%0A%0A/LENASys Administrators";
			hideReceiptPopup();
	}
}

function showSecurityPopup()
{
   $("#securitynotification").css("display","flex");
   //$("#overlay").css("display","block");
}

function showDuggaInfoPopup()
{

	if ($("#receiptBox").css("display")!= "flex"){
		$("#duggaInfoBox").css("display","flex");
		//$("#overlay").css("display","block");
	}
}

function hideDuggaInfoPopup()
{
	$("#duggaInfoBox").css("display","none");
	//$("#overlay").css("display","none");
	if(startDuggaHighScore){
		startDuggaHighScore();
	}
}
//----------------------------------------------------------------------------------
// Simple page reload function
//----------------------------------------------------------------------------------
function reloadPage(){
   location.reload();
}
//----------------------------------------------------------------------------------
// Refresh function, refreshes the current session by resetting the php session cookie
//----------------------------------------------------------------------------------
function refreshUserSession(){
	$.ajax({
					type: "POST",
					url: "../Shared/loginlogout.php",
					data:{opt:'REFRESH'},
		 });
     setExpireCookie()
     setExpireCookieLogOut()
     sessionExpireMessage()
     sessionExpireLogOut()
}

//----------------------------------------------------------------------------------
// Timeout function, gives a prompt if the session is about to expire, which is 45 minutes
//----------------------------------------------------------------------------------
function sessionExpireMessage() {

	if(document.cookie.indexOf('sessionEndTime=expireC') > -1){
		var intervalId = setInterval(function() {
		checkIfExpired();
		}, 2000);
	}

	function checkIfExpired() {

			if (document.cookie.indexOf('sessionEndTime=expireC') == -1){
				$(".expiremessagebox").css("display","block");
				clearInterval(intervalId);
			}

		}
	}

//----------------------------------------------------------------------------------
// Gives an alert when user is timed out, 1 hour(when the session ends)
// check every 5 seconds
//----------------------------------------------------------------------------------
function sessionExpireLogOut() {

	if(document.cookie.indexOf('sessionEndTimeLogOut=expireC') > -1){
		var intervalId = setInterval(function() {
			checkIfExpired();
		}, 2000);
	}

	function checkIfExpired() {

			if (document.cookie.indexOf('sessionEndTimeLogOut=expireC') == -1){
				$(".expiremessagebox").css("display","none");
				$(".endsessionmessagebox").css("display","block");
				processLogout();
				clearInterval(intervalId);
			}

	}
}

//----------------------------------------------------------------------------------
// A function that handles the onmouseover/onmouseout events on the loginbutton-td, changing the icon-image on hover.
//----------------------------------------------------------------------------------
function loginButtonHover(status) {
	if(status == "online"){
		document.getElementById("loginbutton").addEventListener("mouseover", function() {
			document.getElementById("loginbuttonIcon").src="../Shared/icons/logout_button.svg";
		}, false);
		document.getElementById("loginbutton").addEventListener("mouseout", function() {
			document.getElementById("loginbuttonIcon").src="../Shared/icons/Man.svg";
		}, false);
	}
	if(status == "offline"){
		document.getElementById("loginbutton").addEventListener("mouseover", function() {
			document.getElementById("loginbuttonIcon").src="../Shared/icons/login_button.svg";
		}, false);
		document.getElementById("loginbutton").addEventListener("mouseout", function() {
			document.getElementById("loginbuttonIcon").src="../Shared/icons/Man.svg";
		}, false);
	}
}

//----------------------------------------------------------------------------------
// A function for redirecting the user to there UserManagementView
//----------------------------------------------------------------------------------
function redirectToUMV()
{
	window.location.replace("../UserManagementView/redirector.php");
}

//Function to get a cookie from a cookie key(name)
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    	}
	return "";
}

// EventListner for when ESC is pressed do a closeWindows()
$(window).load(function() {
	//There is an issue with using this code, it generates errors that stop execution
      $(window).keyup(function(event){
      	if(event.keyCode == 27) {
					if (window.location.href.indexOf('sectioned') !== -1) {
						closeSelect();
					} else {
						closeWindows();
					}          
        }
      });
});

/*

// Never make dialogs draggable - ruins everything!
$(window).load(function() {
	$('.loginBox').draggable({ handle:'.loginBoxheader'});
	$('.loginBox').draggable({ containment: "window"});	//contains the draggable box within window-boundaries
});

*/

//----------------------------------------------------------------------------------
// Help function to allow moving of elements from on index to another in array
// Usage: [0,4,9].move(1,2) will give new array [0,9,4]
//----------------------------------------------------------------------------------
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

// Latest version of any file in a field - unsure about naming of the function
function findfilevers(filez,cfield,ctype,displaystate,group)
{
		// Iterate over elements in files array
		var foundfile=null;
		var oldfile="";
		var mobileMediaQuery = window.matchMedia("(max-width: 800px)");
		var mediumMediaQuery = window.matchMedia("(min-width: 801px) and (max-width: 1200px)");
		var tab="<table class='previewTable'>";

		if (group) {
      if (mobileMediaQuery.matches) {
        tab+="<thead><tr><th>User</th><th>Filename</th><th>Upload date</th><th colspan=2>Teacher feedback</th></tr></thead>";
      } else {
			  tab+="<thead><tr><th></th><th>User</th><th>Filename</th><th>Upload date</th><th colspan=2>Teacher feedback</th></tr></thead>";
      }
    } else {
      if (mobileMediaQuery.matches) {
			tab+="<thead><tr><th>Filename</th><th>Upload date</th><th colspan=2>Teacher feedback</th></tr></thead>";
		  } else {
			tab+="<thead><tr><th></th><th>Filename</th><th>Upload date</th><th colspan=2>Teacher feedback</th></tr></thead>";
		  }
    }

		tab +="<tbody>";
		if (typeof filez !== "undefined"){
			for (var i=filez.length-1;i>=0;i--){
					if(cfield==filez[i].fieldnme){
							var filelink=filez[i].filepath+filez[i].filename+filez[i].seq+"."+filez[i].extension;
							tab+="<tr'>"



							if (!mobileMediaQuery.matches) {
								tab+="<td>";
								// Button for making / viewing feedback - note - only button for given feedback to students.
								if (ctype == "link"){
										tab+="<a href='"+filez[i].content+"' ><img title='Download' src='../Shared/icons/file_download.svg' /></a>";
								} else {
										tab+="<a href='"+filelink+"' ><img title='Download' src='../Shared/icons/file_download.svg' /></a>";
								}

								// if type is pdf, add an extenral_open icon to open in new tab next to download icon.
								if (ctype == "pdf") {
									tab +="\t<tab><a href='"+filelink+"' target='_blank'><img title='Open in new tab' src='../Shared/icons/external_link_open.svg' /></a></tab>";
								}
								tab+="</td>";
							}

              if (group) {
								tab+="<td>"+filez[i].username+"</td>";
							}
							tab+="<td>";
              if (ctype == "link"){
								tab+="<span style='cursor: pointer;text-decoration:underline;'  onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);'>";
								if (mediumMediaQuery.matches) {
									tab+=filez[i].content.substring(0,32)+"&#8230;</span>";
								} else if (mobileMediaQuery.matches) {
									tab+=filez[i].content.substring(0,8)+"&#8230;</span>";
								} else {
									tab+=filez[i].content+"</span>";
								}
							}else if(ctype == "zip" || ctype == "rar"){
								tab+="<span style='cursor: pointer;text-decoration:underline;'>";
								tab += "<a href="+filez[i].filepath+filez[i].filename+filez[i].seq+'.'+filez[i].extension+">";
								if (mediumMediaQuery.matches) {
									tab+=filez[i].filename.substring(0,32)+"&#8230;"+filez[i].extension+"</a></span>";
								} else if (mobileMediaQuery.matches) {
									tab+=filez[i].filename.substring(0,8)+"&#8230;"+filez[i].extension+"</a></span>";
								} else {
									tab+=filez[i].filename+"."+filez[i].extension+"</a></span>";
								}
							} else {
								tab+="<span onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);' style='cursor: pointer;text-decoration:underline;'>";
								if (mediumMediaQuery.matches) {
									tab+=filez[i].filename.substring(0,32)+"&#8230;"+filez[i].extension+"</span>";
								} else if (mobileMediaQuery.matches) {
									tab+=filez[i].filename.substring(0,8)+"&#8230;"+filez[i].extension+"</span>";
								} else {
									tab+=filez[i].filename+"."+filez[i].extension+"</span>";
								}

							}
							tab+="</td><td>";
							if (mobileMediaQuery.matches) {
								var mobileDate = filez[i].updtime.substring(2,);
								tab+=mobileDate+"</td>";
							} else {
								tab+=filez[i].updtime;+"</td>";
							}

							tab+="<td>";
							if (!mobileMediaQuery.matches) {
								// Button for making / viewing feedback - note - only button for given feedback to students.
								if(filez[i].feedback!=="UNK"||displaystate){
										tab+="<button onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",1);'>Feedback</button>";
								}
							}
							tab+="</td>";

							tab+="<td>";
							if(filez[i].feedback!=="UNK"){
								if (mobileMediaQuery.matches || mediumMediaQuery.matches) {
									tab+="<span style='text-decoration: underline' onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",1);'>"+filez[i].feedback.substring(0,8)+"&#8230;</span>";
								} else {
									tab+=filez[i].feedback.substring(0,64)+"&#8230;";
								}
							}else{
								tab+="&nbsp;"
							}
							tab+="</td>";
							tab+="</tr>";
					}
			}
		}
		tab+="</tbody>"
		tab+="</table>"

		document.getElementById(cfield+"Prev").innerHTML=tab;
}

function makeForm(cfield, ctype){
	if (inParams !== "UNK") {
		var form = "";
		form +="<form enctype='multipart/form-data' method='post' action='filereceive_dugga.php' >";
		form +="<input name='uploadedfile[]' type='file' multiple='multiple' />";
		form +="<input type='submit' name='okGo' value='Upload'>";
		form +="<input type='hidden' name='moment' value='"+inParams["moment"]+"' />";
		form +="<input type='hidden' name='cid' value='"+inParams["cid"]+"' />";
		form +="<input type='hidden' name='coursevers' value='"+inParams["coursevers"]+"' />";
		form +="<input type='hidden' name='did' value='"+inParams["did"]+"' />";
		form +="<input type='hidden' name='segment' value='"+inParams["segment"]+"' />";
		form +="<input type='hidden' name='field' value='"+cfield+"' />";
		form +="<input type='hidden' name='kind' value='1' />";
		form +="</form>";

		document.getElementById(cfield).innerHTML=form;
	}
}

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------

function toggleInstructions(element)
{
	$(element).parent().find(".instructions-content").slideToggle("slow");
}

function disableSave(){
	document.getElementById("saveDuggaButton").disabled = true;
}

//----------------------------------------------------------------------------------
// show/hide submission and feedback
//----------------------------------------------------------------------------------

function displayPreview(filepath, filename, fileseq, filetype, fileext, fileindex, displaystate)
{
		clickedindex=fileindex;
		var str ="";

		if(displaystate){
				document.getElementById("markMenuPlaceholderz").style.display="block";
		}else{
				document.getElementById("markMenuPlaceholderz").style.display="none";
		}

		if (filetype === "text") {
				str+="<textarea style='width: 100%;height: 100%;box-sizing: border-box;'>"+dataV["files"][inParams["moment"]][fileindex].content+"</textarea>";
		} else if (filetype === "link"){
				var filename=dataV["files"][inParams["moment"]][fileindex].content;
				if(window.location.protocol === "https:"){
						filename=filename.replace("http://", "https://");
				}else{
						filename=filename.replace("https://", "http://");
				}
				str += '<iframe allowtransparency="true" style="background: #FFFFFF;" src="'+filename+'" width="100%" height="100%" />';
		} else {
		 		if (fileext === "pdf"){
						str += '<embed src="'+filepath+filename+fileseq+'.'+fileext+'" width="100%" height="100%" type="application/pdf" />';
		 		} else if (fileext === "zip" || fileext === "rar"){
		 				str += '<a href="'+filepath+filename+fileseq+'.'+fileext+'"/>'+filename+'.'+fileext+'</a>';
		 		} else if (fileext === "txt"){
		 				str+="<pre style='width: 100%;height: 100%;box-sizing: border-box;'>"+dataV["files"][inParams["moment"]][fileindex].content+"</pre>";
		 		}
		}
		document.getElementById("popPrev").innerHTML=str;
		if (dataV["files"][inParams["moment"]][clickedindex].feedback !== "UNK"){
				document.getElementById("responseArea").innerHTML = dataV["files"][inParams["moment"]][clickedindex].feedback;
		} else {
				document.getElementById("responseArea").innerHTML = "No feedback given.";
		}

		$("#previewpopover").css("display", "flex");
}

function displayDuggaStatus(answer,grade,submitted,marked){
		var str="<div style='display:flex;justify-content:center;align-items:center;'><div class='LightBox'>";
		// Get proper dates
		if(submitted!=="UNK") {
			var t = submitted.split(/[- :]/);
			submitted=new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
		}
		if(marked!=="UNK") {
			var tt = marked.split(/[- :]/);
			marked=new Date(tt[0], tt[1]-1, tt[2], tt[3], tt[4], tt[5]);
		}

		if (answer == "UNK" && (grade == "UNK" || grade <= 1)){
				str+="<div class='StopLight WhiteLight' style='margin:4px;'></div></div><div>Dugga not yet submitted!</div>";
		} else if (submitted != "UNK" && answer != "UNK" && marked == "UNK" || ( submitted !== "UNK" && marked !== "UNK" && (submitted.getTime() > marked.getTime()))) {
				str+="<div class='StopLight YellowLight' style='margin:4px;'></div></div><div>Dugga submitted."+submitted+"</div>";
		} else if (grade != "UNK" && grade <= 1 && (submitted.getTime() < marked.getTime()) ) {
				str+="<div class='StopLight RedLight' style='margin:4px;'></div></div><div>Dugga marked as fail: "+marked+"</div>";
		} else if (grade > 1) {
				str+="<div class='StopLight GreenLight' style='margin:4px;'></div></div><div>Dugga marked as pass: "+marked+"</div>";
		}

		str+="</div>";
		$("#duggaStatus").remove();
		$("<td id='duggaStatus' align='center'>"+str+"</td>").insertAfter("#menuHook");
}

function FABMouseOver(e) {
	if (e.target.id === "fabBtn") {
		if ($('.fab-btn-sm').hasClass('scale-out')) {
			$('.fab-btn-list').fadeIn(0);
			$('.fab-btn-sm').toggleClass('scale-out');
		}
	}
	else if (e.target.id === "addElement") {
		if ($('.fab-btn-sm2').hasClass('scale-out')) {
			$('.fab-btn-list2').fadeIn(0);
			$('.fab-btn-sm2').toggleClass('scale-out');
		}
	}
}

//----------------------------------------------------------------------------------
// FABMouseOut: FAB Mouse Out
//----------------------------------------------------------------------------------
function FABMouseOut(e) {
	if (!$('.fab-btn-sm').hasClass('scale-out') && $(e.relatedTarget).parents(".fixed-action-button").length === 0 && !$(e.relatedTarget).hasClass("fixed-action-button")) {
		$('.fab-btn-sm').toggleClass('scale-out');
		$('.fab-btn-list').delay(100).fadeOut(0);
	}
	else if (!$('.fab-btn-sm2').hasClass('scale-out') && $(e.relatedTarget).parents(".fixed-action-button2").length === 0 && !$(e.relatedTarget).hasClass("fixed-action-button2")) {
		$('.fab-btn-sm2').toggleClass('scale-out');
		$('.fab-btn-list2').delay(100).fadeOut(0);
	}
}

//----------------------------------------------------------------------------------
// FABDown : FAB Mouse Down
//----------------------------------------------------------------------------------
function FABDown(e)
{
	//Unused at the moment but might be useful in the future to handle pressing down with mouse on FAB
}

//----------------------------------------------------------------------------------
// FABUp : FAB Mouse Up
//----------------------------------------------------------------------------------
function FABUp(e)
{
	if ((e.target.id=="fabBtn")) {
		createQuickItem();
	}
}

//----------------------------------------------------------------------------------
// TouchFABDown : FAB Touch Down
//----------------------------------------------------------------------------------
function TouchFABDown(e)
{
	// If the fab list is visible, there should be no timeout to toggle the list
	if ($('.fab-btn-list').is(':visible')) {
		if ($('.fab-btn-list').is(':visible') && $('#fabBtn').is(e.target)) FABToggle();
	} else {
		if (e.target.id == "fabBtn") {
			pressTimer = window.setTimeout(function() { FABToggle(); }, 200);
		}
	}
}

//----------------------------------------------------------------------------------
// TouchFABUp : FAB Touch Up
//----------------------------------------------------------------------------------
function TouchFABUp(e)
{
	// A quick item should be created on a "fast click" if the fab list isn't visible / Click outside the FAB list / if the target of the click isn't the container...
	if ((e.target.id=="fabBtn") && !$('.fab-btn-list').is(':visible')) {
		clearTimeout(pressTimer);
		createQuickItem();
	}else if ($('.fab-btn-list').is(':visible') && (e.target.id!="fabBtn")) {
		FABToggle();
	}
}

//----------------------------------------------------------------------------------
// FABToggle : FAB Mouse Toggle / Touch Toggle
//
// Toggles action bubbles when pressing the FAB button
//----------------------------------------------------------------------------------
function FABToggle() {
		if (!$('.fab-btn-sm').hasClass('scale-out')) {
				$('.fab-btn-sm').toggleClass('scale-out');
				$('.fab-btn-list').delay(100).fadeOut(0);
		} else {
				$('.fab-btn-list').fadeIn(0);
				$('.fab-btn-sm').toggleClass('scale-out');
		}
}

function generateTimeSheetOptions(course, moment, selected) {
	// Different courses / moments have the ability to generate different options for the type field

	// Only one timesheet is available right now
	if (selected === 0) {
		return "<option value='issue' selected>Issue</option><option value='pullrequest'>Pull request</option>";
	} else {
		return "<option value='issue'>Issue</option><option value='pullrequest' selected>Pull request</option>";
	}

}

//----------------------------------------------------------------------------------
// hideServerMessage/hideCookieMessage : Hide MOTD/cookie messages
//
// Functions for animating and hiding MOTD and cookie messages
//----------------------------------------------------------------------------------

function hideServerMessage() {
	var $containerHeight = $("#servermsgcontainer");
	$containerHeight.animate({ 
		opacity: 0, 
		top: -$containerHeight.outerHeight() 
	}, 200, "easeInOutSine", () => {
		$containerHeight.css(opacity, 1);
	});
}

function hideCookieMessage() {
	$("#cookiemsg").animate({ opacity: 0, bottom: -70 }, 200, "easeInOutSine");
	$(".fixed-action-button").animate({ bottom: 24 }, 200, "easeInOutSine");
	setTimeout(function () {
		$("#cookiemsg").css("display", "none");
		$("#cookiemsg").css("opacity", "1");
	}, 200);
}

//----------------------------------------------------------------------------------
// hideServerMessage/hideCookieMessage : Hide MOTD/cookie messages
//
// Functions for animating and hiding MOTD and cookie messages
//----------------------------------------------------------------------------------


//----------------------------------------------------------------------------------
//sends Course and Dugga ID to see whether feedback should be enabled in receiptbox
//----------------------------------------------------------------------------------
function duggaFeedbackCheck(){
	var citstr=querystring['moment'];
	citstr=querystring['cid']+" "+citstr;
	AJAXService("CHECKFDBCK",{answer:citstr},"DUGGAFEEDBACK");
}

function returnedFeed(data) {
	if (data['userfeedback']== 1 ){
		$("#feedbackbox").css("display","inline-block");
		$("#feedbackquestion").html(data['feedbackquestion']);
	} 
}
//----------------------------------------------------------------------------------
//sends userinput feedback
//----------------------------------------------------------------------------------
function sendFeedback(entryname){
	if ($("input[name='rating']:checked").val()) {
		$('#submitstatus').css("display", "none");
		var param = {};
  		param.courseid = querystring['courseid'];
  		param.moment = querystring['moment'];
		param.score = $("input[name='rating']:checked").val();
		param.entryname = entryname;  
		if($("#contactable:checked").val()){
			param.contactable = 1;
		}else{
			param.contactable = 0;
		}
		AJAXService("SENDFDBCK",param,"SENDDUGGAFEEDBACK");
	}else {
		$('#submitstatus').css({'color':'var(--color-red)',"display": "inline-block"}).text("Select a rating before saving it.");
	}
}

function returnedSubmitFeedback(){
	$('#submitstatus').css({'color':'var(--color-green)',"display": "inline-block"}).text("Feedback saved");
}
