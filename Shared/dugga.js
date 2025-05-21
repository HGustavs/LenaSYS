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
var hash="UNK";
var pwd="UNK";
var duggaTitle;
var iconFlag = false;
var ishashindb;
var blockhashgen = false;
var ishashinurl;
var itemvalue;
var groupTokenValue = 1;
var passwordReload = false; // Bool turns true when reloading in combination with logging in to dugga
var isGroupDugga = false; // Set to false if you hate the popup
var tempclicks = 0;
var clicks = 0;
var locallystoredhash;
var isFileSubmitted;
var isTeacher;
var localStorageItemKey = "duggaData_" + querystring["did"];


// Variant related


var loadVariantFlag = false;	// Flag to decide if the 'Next variant' button should be visable or not.
var nbrOfVariants;
var latestVariantSet;
var varArr;
var variantsArr;
var variantValue;
if(localStorage.getItem(localStorageItemKey)){
	variantValue = JSON.parse(localStorage.getItem(localStorageItemKey)).variant.vid;
}

/*navburger*/
function navBurgerChange(operation = 'click') {
  var x = document.getElementById("navBurgerBox");

  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

//function to change darkmode from burger menu
function burgerToggleDarkmode(operation = 'click') {
  const storedTheme = localStorage.getItem('themeBlack');
  if (storedTheme) {
    themeStylesheet.href = storedTheme;
  }
  const themeToggle = document.getElementById('theme-toggle');
  // if it's light -> go dark
  if (themeStylesheet.href.includes('blackTheme')) {
    themeStylesheet.href = "../Shared/css/style.css";
    localStorage.setItem('themeBlack', themeStylesheet.href)
    backgroundColorTheme = "#121212";
  }
  else if (!themeStylesheet.href.includes('blackTheme')) {
    // if it's dark -> go light
    themeStylesheet.href = "../Shared/css/blackTheme.css";
    localStorage.setItem('themeBlack', themeStylesheet.href)
    backgroundColorTheme = "#fff";
  }
}

document.getElementById(function (){ // Used to set the position of the FAB above the cookie message
	if(localStorage.getItem("cookieMessage")!="off")
		document.getElementById(".fixed-action-button").style.bottom="64px";
})

// Enables save and reset button after activity on assignments (save and reset always available for students on submitted assignments)
function canSaveController() {
	
	var content=document.getElementById("content-window");
	var contentUrl=document.getElementById("url-input");
	if(content != null || contentUrl != null)
	{
		content=document.getElementById("content-window").value;
		contentUrl=document.getElementById("url-input").value;
	}

	var hasClicked = (clicks > 0)? true : false;
	if((isFileSubmitted || hasClicked || content || contentUrl || ishashinurl) && !isTeacher){
		  var elems = document.querySelectorAll(".btn-disable");
		
		  for (var e of elems){
			e.classList.remove("btn-disable");
		}
	}   
}

function sendGroupAjax(val) {
	// val = 1: new user, val = 0: exit
	groupTokenValue = val;
	AJAXService("UPDATEAU", {}, "GROUPTOKEN");
}

function saveTimesAccessed(){
	AJAXService("ACCDUGGA", {}, "ACCESSEDDUGGA");
}

		// Loads a dugga from hash and redirects to index.php that then continues to redirect to the specified dugga
function loadDugga(){
	var hash = document.getElementById('hash').value;
	/*when adding `${hash}` it redirects to validateHash.php whereas if it was just raw 
	hash it wouldn't validate anything*/
	window.location.href = createUrl(`${hash}`);
}

function loadDuggaType(){
	// hideLoadDuggaPopup();
	hash = document.getElementById('hash').value;
	// hashpwd = document.getElementById('hashpwd').value;
	// AJAXService("LOADDUGGA",{}, "INPUTCHECK");
	//console.log(`https://dugga.iit.his.se/sh/?s=${hash}`)
	window.location.href = `https://dugga.iit.his.se/sh/?s=${hash}`;
	//https://dugga.iit.his.se/sh/?s=9b4ea96a
}

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

function getHash(){
	return hash;
}

function setHash(h){
	// Check if hash is unknown
	if(h == "UNK"){
		hash = generateHash();
		pwd = randomPassword();
	
		ishashinurl = false;	//Hash is not referenced in the url -> Not a resubmission.
	}else{
		hash = h;
		ishashinurl = true;		//Hash is referenced in the url -> A resubmission, this dugga already have a hash in the database.
	}
}

function setPassword(p){
	pwd = p;
}

//Set the localstorage item securitynotifaction to on or off
function setSecurityNotifaction(param){
    localStorage.setItem("ls-security-notification", param);
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
		document.querySelector("#newpassword").style.display="block";
		document.querySelector("#formBox").style.display="flex";
    	document.querySelector("#login").style.display = "none";
		document.querySelector("#showsecurityquestion").style.display="none";
		document.querySelector("#resetcomplete").style.display="none";
		status= 1;
		showing= 0;
    //Shows the Login-box
	}else if(status == 1){
		document.querySelector("#newpassword").style.display="none";
		document.querySelector("#login").style.display="block";
		document.querySelector("#showsecurityquestion").style.display="none";
		document.querySelector("#resetcomplete").style.display="none";
		status= 0;
		showing= 1;
    //Shows the Sequrity question-box (answer for question input)
	}else if(status == 2){
		document.querySelector("#newpassword").style.display="none";
		document.querySelector("#formBox").style.display="flex";
		document.querySelector("#showsecurityquestion").style.display="block";
		document.querySelector("#resetcomplete").style.display="none";
		status= 1;
		showing= 2;
	}
  //Shows the Reset complete-box
	else if(status == 3){
		document.querySelector("#newpassword").style.display="none";
		document.querySelector("#formBox").style.display="flex";
		document.querySelector("#showsecurityquestion").style.display="none";
		document.querySelector("#resetcomplete").style.display="block";
		status= 1;
		showing= 3;
	}
}

// This function only resets login and forgot password fields
function resetFields(){
	document.querySelectorAll("#login #username").value="";
	document.querySelectorAll("#login #password").value="";
	//Since we need the username from this box during the answer part we cant clear it directly afterwards
	if (status!=2){
		document.querySelectorAll("#newpassword #username").value="";
	}
	document.querySelectorAll("#showsecurityquestion #answer").value="";

  //Changes the background color back to white
	//document.getElementByID("#formBox #username").body.style.backgroundColor="rgb(255, 255, 255)";
	//document.getElementById("#formBox #password").body.style.backgroundColor="rgb(255, 255, 255)";
	//document.getElementById("#newpassword #username").body.style.backgroundColor="rgb(255, 255, 255)";
	//document.getElementById("#showsecurityquestion #answer").body.style.backgroundColor="rgb(255, 255, 255)";

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
	if(option=="AddEmptyField"){
		str += "<option  selected='selected' value=''>Nothing selected</option>";
	}
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
    if(localStorage.getItem("ls-security-question") == "set") {
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
    if (localStorage.getItem("ls-security-question") == "set") {
				var expireDate = new Date();
				//expireDate.setMinutes(expireDate.getMinutes() + 2);	// For testing
				expireDate.setMinutes(expireDate.getMinutes() + 120);	// For actual use
        document.cookie = "sessionEndTimeLogOut=expireC; expires=" + expireDate.toUTCString() + "; path=/";
    }
}

// Changes the variant in local storage to the next in available variants array
function changeVariant(intvalue) {
	var test = JSON.parse(localStorage.getItem(localStorageItemKey));
	test.variant = variantsArr[intvalue];
	localStorage.setItem(localStorageItemKey, JSON.stringify(test))
	location.reload(); 	//Reloads the site to show correct new variant.
}

//Selects next variant available and calls 'changeVariant' method.
function selectNextVariant(){
 	if(nbrOfVariants != undefined){	//If variants are available for this dugga.
		var nextVariant = (latestVariantSet) % nbrOfVariants;
		changeVariant(nextVariant);
	} 
}

function closeWindows(){
	var index_highest = 0;
	var e;

	//More effective to have a class for the div you want to search and pass that to your selector
	document.querySelectorAll("*").forEach(function(e1) {
		//Always use a radix when using parseInt
		var index_current = parseInt(window.getComputedStyle(e1).zIndex, 10);
		if(index_current > index_highest && e1.style.display == "block"||index_current > index_highest && e1.style.display == "flex") {
			index_highest = index_current;
			e=e1;
			var tempString = e.outerHTML;
			if(tempString.includes('<div class="previewWindow"')){
				e.style.display="none";
			}
		}
	});

	if (index_highest > 0 && e.id !== "FABStatic"){
		/* Overlay is only present for formBox which has z-index of 9000,
		so if we closed such a window, hide the overlay and clear any values as well. */
		var tempString2 = e.outerHTML;
		if(!tempString2.includes('<div id="TopMenuStatic"')) {
			e.style.display= "none";
			//if the window is one of these ids also enable tab functionality again
			var searchForId=['editSection', 'editCourseVersion', 'newCourseVersion'];
			for (var i = 0; i < searchForId.length; i++) {
				if(e==document.getElementById(searchForId[i])) {
					toggleTab(false);
				}
			}
			
		}
		if (index_highest < 10000) {
			status=1;
			//toggleloginnewpass();
			document.querySelector("#overlay").style.display="none";
			resetFields();
		}
	}

	document.addEventListener("keyup", function(e) {
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
// loadJS: Using JS Dynamically Load external JS.
//          Does not load again if previously loaded same file
//			Previously used JQuery but has been changed to JS.
//----------------------------------------------------------------------------------

var JSFiles=[];

function loadJS(src) {
		if(JSFiles[src]!="Loaded"){
		   var jsLink = document.getElementById("<script type='text/javascript' src='"+src+"'>");
		   document.getElementById("head").append(jsLink);
		   JSFiles[src]="Loaded";
		}else{
				// Do nothing if already loaded
		}
};

//----------------------------------------------------------------------------------
// loadCSS: Using JS Dynamically Load external CSS.
//			Previously used JQuery, changed to JS.
//----------------------------------------------------------------------------------

function loadCSS(href) {
		var cssLink = document.getElementById("<link rel='stylesheet' type='text/css' href='"+href+"'>");
		document.getElementById("head").append(cssLink);
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
// randomstring: Generates a random password string with 7 characters
//----------------------------------------------------------------------------------

function randomPassword()
{
		str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";

		var valu="";
		for(i=0;i<7;i++){
				valu+=str.charAt(Math.floor(Math.random()*str.length));
		}
		
		return valu;
}

//----------------------------------------------------------------------------------
// createUrl: creates url that contains the hash
//----------------------------------------------------------------------------------

function createUrl(hash) {
	
	// Gets the protocol (http: or https:), the hostname (localhost, project.webug.his.se) and the filepath as an array that is split with slashes.
    var pathProtocol = window.location.protocol;
    var pathHostName = window.location.hostname;
    var pathArray = window.location.pathname.split('/');

	// Pops the last two elements in the filepath array, these will be "showdugga.php" and "DuggaSys".
    pathArray.pop();
    pathArray.pop();

	// Create the URL
    var url = pathProtocol + "//" + pathHostName;
    for(var i = 0; i < pathArray.length; i++){
        url += pathArray[i];
        url += "/";
    }
    url += "sh/?s=" + hash;

    return url;
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
	citstr=querystring['moment']+" "+citstr;
	citstr=querystring['coursevers']+" "+citstr;
	citstr=querystring['cid']+" "+citstr;
	// citstr+= "##!!##" + timeUsed;
	// citstr+= "##!!##" + stepsUsed;
	//citstr+= "##!!##" + score;
	//variantValue = JSON.parse(localStorage.getItem(localStorageItemKey)).variant.vid;
	AJAXService("SAVDU",{answer:citstr},"PDUGGA");

	//blockhashgen = true; //Block-Hash-Generation: No new hash should be generated if 'Save' is clicked more than once per dugga session.
	// var url = createUrl(hash); //Create URL
	// console.log("pwd = "+pwd);
	// if(pwd == undefined || pwd.includes("undef")) pwd = randomPassword();
	// document.getElementById('url').innerHTML = url;
	// document.getElementById('pwd').innerHTML = pwd;
	// updateLocalStorageItem();


	// var scores = JSON.parse(localStorage.getItem("ls-highscore-dg"+querystring['did']) || '[]');
	// scores.push(score);
	// localStorage.setItem("ls-highscore-dg"+querystring['did'], JSON.stringify(scores));
	// var readonly;
	// $.ajax({
	// 	url: "courseedservice.php",
	// 	dataType: "json"
	// }).done(response => {
	// 	readonly=response.readonly;
	// 	//Read-only is active
	// 	if(readonly == 1)
	// 	{
	// 		console.log("Read-only is active, duggas cannot be submitted at this time");
	// 	}
	// 	//Read-only is not active
	// 	else
	// 	{
	// 		citstr=querystring['moment']+" "+citstr;
	// 		citstr=querystring['coursevers']+" "+citstr;
	// 		citstr=querystring['cid']+" "+citstr;
	// 		citstr+= "##!!##" + timeUsed;
	// 		citstr+= "##!!##" + stepsUsed;
	// 		//citstr+= "##!!##" + score;
	// 		variantValue = JSON.parse(localStorage.getItem(localStorageItemKey)).variant.vid;
	// 		AJAXService("SAVDU",{answer:citstr},"PDUGGA");

	// 		var dateTime = new Date(); 				//Get the current date and time
	// 		var comment = querystring['comment']; 	//Get the comment. 'comment' will be null by default. A not-null/not-undefined value of comment will appear only if deadline has been passed.
	// 		var deadline = querystring['deadline']; //Get deadlinedate from URL
			
	// 		Number.prototype.padLeft = function(base,chr){
	// 			var  len = (String(base || 10).length - String(this).length)+1;
	// 			return len > 0? new Array(len).join(chr || '0')+this : this;
	// 		}
			
	// 		dateTimeFormat = [dateTime.getFullYear(),(dateTime.getMonth()+1).padLeft(),dateTime.getDate().padLeft()].join('-') +' ' +[dateTime.getHours().padLeft(),dateTime.getMinutes().padLeft(),dateTime.getSeconds().padLeft()].join(':');
	// 		console.log("deadline: " + deadline + " > dateTimeFormat: " + dateTimeFormat);
			
	// 		if(deadline > dateTimeFormat){	
	// 			//Deadline has not been passed.
	// 			document.getElementById('receiptInfo').innerHTML = "<p>Hash and password can be used to return to the dugga in the future. Make sure to store it on a secure place.\n\n</p><p>Successfully submitted before deadline.</p>";
	// 		}
	// 		else{ 
	// 			//Deadline has passed.
	// 			if(comment == "UNK" || comment == undefined || comment == "null"){
	// 				document.getElementById('receiptInfo').innerHTML = "<p style='margin:15px 5px;'>Hash and password can be used to return to the dugga in the future. Make sure to store it on a secure place.</p><img style='width:40px;float:left;margin-right:10px;' title='Warning' src='../Shared/icons/warningTriangle.svg'/><p>OBS! This assignment has passed its deadline. The teacher will grade this assignment during the next ordinary grading occation OR when time allows.</p>";
	// 			}
	// 			else{
	// 				document.getElementById('receiptInfo').innerHTML = "<p>Hash and password can be used to return to the dugga in the future. Make sure to store it on a secure place.</p><img style='width:40px;float:left;margin-right:10px;' title='Warning' src='../Shared/icons/warningTriangle.svg'/><p>"+comment+"</p>";
	// 			}

	// 		}
    //   		duggaFeedbackCheck();
	// 		showReceiptPopup();
	// 	}
	// });
}



//----------------------------------------------------------------------------------
// generateHash: Generates a hash
//----------------------------------------------------------------------------------
function generateHash() {
    var randNum = getRandomNumber();
	var hash = convertDecimalToBase64(randNum);
    return hash;
}

//----------------------------------------------------------------------------------
//Generates a random number that can represent every possible hash combination (6-8 characters)
//----------------------------------------------------------------------------------
function getRandomNumber() {
	return Math.floor(Math.random() * 281473902968831) + 1073741824;
}

//----------------------------------------------------------------------------------
// convertDecimalToBase64: takes decimal number and converts to base64 "youtube style"
//----------------------------------------------------------------------------------
function convertDecimalToBase64(value) {
	if (typeof(value) === 'number') {
		return convertDecimalToBase64.getChars(value, '');
	}
  
	if (typeof(value) === 'string') {
		if (value === '') { return NaN; }
		return value.split('').reverse().reduce(function(prev, cur, i) {
			return prev + convertDecimalToBase64.chars.indexOf(cur) * Math.pow(64, i);
	  	}, 0);
	}
}
  
convertDecimalToBase64.chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"; //URL friendly dictionary. 64 characters making this a "base" of 64. 
//Note: This hashing algorithm can't be decoded. However, if decoding the hash was necessary it would still only reveal the randomly generated number (randNum).
convertDecimalToBase64.getChars = function(num, res) {	
	var mod = num % 64,
		remaining = Math.floor(num / 64),
		chars = convertDecimalToBase64.chars.charAt(mod) + res;  
	if (remaining <= 0) { return chars; }
	return convertDecimalToBase64.getChars(remaining, chars);
};

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
// beforeunload: Detect when student exits dugga
//----------------------------------------------------------------------------------

window.addEventListener('beforeunload', function (e) {
	if(getUrlParam("did") != null){
		groupTokenValue = -1;

		if (!passwordReload && isGroupDugga) {
			e.returnValue = '';
			sendGroupAjax(-1);
		}
	}
	
});

//Check if score is above threshhold
function duggaChange() {
	
	if(clicks > ClickCounter.score){
		ClickCounter.score = clicks;
	}else{
		clicks = ClickCounter.score;
	}
	canSaveController();
	if(clicks>=tempclicks){
		tempclicks=clicks;
		return true;
	}else{
		return false;
	}
	
}

function getUrlParam(param){
	var url_string = window.location.href;
	var url = new URL(url_string);
	return url.searchParams.get(param);
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

  var allApara = {}; // To contain all apara

  var para="";
	for (var key in apara) {
		allApara[key] = apara[key]; // Add apara to array
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
				
				/*	Commented out due to statement below will always be false due to used variables being set to the same directly above
					if(old != apara[key]) {
						alert("Illegal characters removed in " + key);
					}
				*/
					para+="&"+key+"="+encodeURIComponent(htmlEntities(apara[key]));
			}
		}
		if(apara[key] == "") {
				// Informs the user that his input contained nothing.
				// console.log("Your input contained nothing in " + key);
		}
	}

	if(kind=="COURSE"){
		//for testing of the microservice, delete the if/else and uncomment the original ajax call below before merge
		switch (opt) {
			case "NEW":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/createNewCourse_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					success: returnedCourse
				});
				break;
			case "NEWVRS":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/createCourseVersion_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					async: false, // Doesn't have time to finish with async before redirect
					success: returnedCourse
				});
				break;
			case "UPDATEVRS":
				$.ajax({
					url: "../DuggaSys/microservices/courseedService/updateCourseVersion_ms.php",
					//url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					async: false, // Doesn't have time to finish with async before redirect
					success: returnedCourse
				});
				break;
			case "CPYVRS":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/copyCourseVersion_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					async: false, // Doesn't have time to finish with async before redirect
					success: returnedCourse
				});
				break;
			case "UPDATE":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/updateCourse_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					success: returnedCourse
				});
				break;
			case "SETTINGS":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/createMOTD_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					success: returnedCourse
				});
				break;
			case "SPECIALUPDATE":
				$.ajax({
					//url: "../DuggaSys/microservices/courseedService/specialUpdate_ms.php",
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					success: returnedCourse
				});
				break;
			default:
				$.ajax({
					url: "courseedservice.php",
					type: "POST",
					data: "opt=" + opt + para,
					dataType: "json",
					success: returnedCourse
				});
		}
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
				//url: "../DuggaSys/microservices/highscoreService/highscoreservice_ms.php",
				url: "highscoreservice.php",
				type: "POST",
				data: "opt="+opt+para+"&hash="+hash,
				dataType: "json",
				success: returnedHighscore
			});
	}else if(kind=="FILE"){
		let serviceURL = "fileedservice.php";
		
		switch (opt) {
			case "GET":
				serviceURL = "fileedservice.php"; // CHANGE WHEN WORKING
				// serviceURL= "../DuggaSys/microservices/fileedService/getFileedService_ms.php";
				break;
			case "SAVEFILE":
				serviceURL= "../DuggaSys/microservices/fileedService/updateFileLink_ms.php";
				break;
			case "DELFILE":
				serviceURL= "../DuggaSys/microservices/fileedService/deleteFileLink_ms.php";
				break;
			default:
				serviceURL= "fileedservice.php";
				break;
		}

		$.ajax({
			url: serviceURL,
			type: "POST",
			data: "cid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
			dataType: "json",
			success: returnedFile
		});
	}else if(kind=="ACCESS"){
			$.ajax({
				url: "accessedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedAccess
			});
	}if(kind=="SECTION" || kind=="GRP"){
		let serviceURL = "sectionedservice.php"
		switch (opt) {
			case "DELETE":
				serviceURL= "../DuggaSys/microservices/sectionedService/removeListEntries_ms.php";
				break;
			case "DEL":
				serviceURL= "../DuggaSys/microservices/sectionedService/deleteListEntries_ms.php";
				break;
			case "NEW":
				serviceURL= "../DuggaSys/microservices/sectionedService/createListEntry_ms.php";
				break;
			case "REORDER":
				serviceURL= "../DuggaSys/microservices/sectionedService/updateListEntryOrder_ms.php";
				break;
			case "UPDATE":
				serviceURL= "../DuggaSys/microservices/sectionedService/updateListEntries_ms.php";
				break;
			case "UPDATETABS":
				serviceURL= "../DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php";
				break;
			case "UPDATEDEADLINE":
				serviceURL= "sectionedservice.php"; // Change when working
				// serviceURL= "../DuggaSys/microservices/sectionedService/updateQuizDeadline_ms.php";
				break;
			case "SETVISIBILITY":
				serviceURL= "../DuggaSys/microservices/sectionedService/updateVisibleListEntries_ms.php";
				break;
			case "REFGIT":
				serviceURL= "sectionedservice.php"; //change when MS is created
				break;
			case "CREGITEX":
				serviceURL= "../DuggaSys/microservices/sectionedService/createGithubCodeExample_ms.php";
				break;
			case "GRP":
				serviceURL= "../DuggaSys/microservices/sectionedService/readCourseGroupsAndMembers_ms.php";
				break;
			case "CHGVERS":
				serviceURL= "../DuggaSys/microservices/sectionedService/updateActiveCourseVersion_sectioned_ms.php";
				break;
			case "get":	
				serviceURL= "sectionedservice.php"; // Change when working
				// serviceURL= "../DuggaSys/microservices/sectionedService/getListEntries_ms.php";
				break;
			default:
				serviceURL= "sectionedservice.php";
		}
		apara.coursename = querystring['coursename'];
		apara.courseid = querystring['courseid'];
		apara.coursevers = querystring['coursevers'];
		apara.comment = querystring['comments'];
		apara.opt = opt;
		if (kind == "SECTION") {
			apara.hash = hash;
		}
		$.ajax({
			url: serviceURL,
			type: "POST",
			data:apara,
			dataType: "json", 
			success: kind=="SECTION" ? returnedSection : returnedGroups
		})
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
		let service_url = "../DuggaSys/microservices/showDuggaService/getShowDugga_ms.php";
		switch (opt) {
			case "SAVDU":
				service_url = "../DuggaSys/microservices/showDuggaService/saveDugga_ms.php";
				break;
			case "UPDATEAU":
				service_url = "../DuggaSys/microservices/showDuggaService/updateActiveUsers_ms.php";
				break;
			default:
				break;
		}
		$.ajax({
			url: service_url,
			type: "POST",
			data: "courseid="+querystring['cid']+"&did="+querystring['did']+"&coursevers="+querystring['coursevers']+"&moment="+querystring['moment']+"&segment="+querystring['segment']+"&hash="+hash+"&password="+pwd+"&opt="+opt+para+"&variant="+variantValue,
			datatype: "json",
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
	}else if(kind=="GROUP"){
			$.ajax({
				url: "groupedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedGroup
			});
	}else if(kind=="CODEVIEW"){
		switch (opt){
			case "EDITEXAMPLE":
				$.ajax({
					url: "codeviewerService.php",
					//url: "../DuggaSys/microservices/codeviewerService/editCodeExample_ms.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returned,
					error: returnedError
				});
				break;
			case "DELEXAMPLE":
				$.ajax({
					url: "codeviewerService.php",
					//url : "../DuggaSys/microservices/codeviewerService/deleteCodeExample_ms.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returned,
					error: returnedError
				});
				break;
			default:
				$.ajax({
					url: "codeviewerService.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returned,
					error: returnedError
				});
		}
	}else if(kind=="BOXCONTENT"){
		switch (opt){
			case "EDITCONTENT":
				$.ajax({
					url: "codeviewerService.php",
					//url : "../DuggaSys/microservices/codeviewerService/editContentOfExample_ms.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returned
				});
				break;
			default:
				$.ajax({
					url: "codeviewerService.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returned
				});
			}
	}else if(kind=="BOXTITLE"){
		switch (opt){
			case "EDITTITLE":
				$.ajax({
					url: "codeviewerService.php",
					//url: "../DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returnedTitle
				});
				break;
			default:
				$.ajax({
					url: "codeviewerService.php",
					type: "POST",
					data: "opt="+opt+para,
					dataType: "json",
					success: returnedTitle
				});
		}
	
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
			url: "../DuggaSys/microservices/sectionedService/readUserDuggaFeedback_ms.php",
			type:"POST",
			data:"courseid="+querystring['cid']+"&opt="+opt+para,
			dataType: "json",
			success: returnedUserFeedback
		});
		
	} else if(kind=="GROUPTOKEN") {
		$.ajax({
			url: "showDuggaservice.php",
			type:"POST",
			data:"AUtoken="+groupTokenValue+"&hash="+hash+"&opt="+opt+para,
			dataType: "json"
		});		
	} else if(kind=="ACCESSEDDUGGA") {
		$.ajax({
			url: "showDuggaservice.php",
			type:"POST",
			data: "hash="+hash+"&opt="+opt+para,
			dataType: "json"
		});
	} else if(kind=="CONT_LOGINBOX_SERVICE") {
		$.ajax({
			url: "contribution_loginbox_service.php",
			type:"POST",
			data: "&opt="+opt+para,
			dataType: "json",
			success: CONT_LOGINBOX_SERVICE_RETURN
		});
	} else if(kind=="CONT_ACCOUNT_STATUS"){
		$.ajax({
			url: "contributionservice.php",
			type:"POST",
			data: "&opt="+opt+para,
			dataType: "json",
			success: placeSideBarInfo,
			error: showError
		});
	}
	else if(kind=="INPUTCHECK") {
		alert(JSON.stringify(querystring));
		$.ajax({
			url: "showDuggaservice.php",
			type: "POST",
			data: "hash="+hash+"&password="+hashpwd+"&opt="+opt+para,
			dataType: "json",
			success: function(data) {
				console.log(data);
				alert(data['debug']);
				if(data['debug']!="NONE!"){
					alert(data['debug']);
				}else{
					returnedDugga(data);
				}				
			}
			// success: function(data) {
			// 	// Will redirect you if you are using correct hash for correct dugga
			// 	var phpData = data;
			// 	console.log(data);
			// 	if(phpData["duggaTitle"] == duggaTitle) {
			// 		window.location.href = "../sh/?a="+hash;
			// 	}
			// 	else if(data['ishashindb']){
					
			// 		confirm("The corresponding hash does not match the dugga type!\nYou entered a hash for dugga: " + phpData["duggaTitle"] + " when on dugga: " + duggaTitle); 
			
			// 	}else{
			// 		confirm("The hash "+hash+" does not exist in the database"); 
			// 	}
			// }
		});
	}

	// Logging to JSON
	var date = new Date();
	var nowDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	var nowTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	var dateTime = nowDate+' '+nowTime;


	// Create JS Object with all data
	const loggingData = new Object();
	loggingData.opt = opt;
	loggingData.apara = allApara;
	loggingData.kind = kind;
	loggingData.apara_type = typeof(apara[0]);
	loggingData.dateTime = dateTime

	const logginDataJSON = JSON.stringify(loggingData);

	// Sends log data as JSON to logging.php
	fetch('../Shared/logging.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: logginDataJSON
	})

	localStorage.setItem("loggingData", logginDataJSON);

	// console.log(logginDataJSON);
}

function newSubmission(){
	if(confirm("Do you want to start a new submission?")){
		var curUrl = window.location.href;
		var newUrl = `${curUrl}&newDugga=true`;
		location.replace(newUrl);
		//reloadPage();
	}
}

function handleHash(){
	$.ajax({									//Ajax call to see if the hash have a match with any hash in the database.
		url: "showDuggaservice.php",
		type: "POST",
		data: "&hash="+hash, 					//This ajax call is only to refresh the userAnswer database query.
		dataType: "json",
		success: function(data) {
			ishashindb = data['ishashindb'];	//Ajax call return - ishashindb == true: not unique hash, ishashindb == false: unique hash.
			//console.log("Hash="+hash+". isHashInDB="+ishashindb + ". ClickedSave=" +blockhashgen + ". isHashInURL="+ishashinurl + " lsHash= " + locallystoredhash);	//For debugging!

			//If the hash already exist in database AND the save button hasn't been pressed yet AND this isn't a resubmission AND we have not generated this dugga before => 1 : 5 000 000 000 chance...
			if(ishashindb==true && blockhashgen == false && ishashinurl == false && !locallystoredhash){	
				clearLocalStorageItem(localStorageItemKey);		//Locally stored hash is 'null' again.
				reloadPage();					//New hash will be generated.
			}
		}
	});
}

function localStorageHandler(ajaxdata) {
	var localStorageItem = localStorage.getItem(localStorageItemKey);
	variantsArr = ajaxdata.variants;

	//Checks if the dugga id is within scope (Not bigger than the largest dugga variant)
	if (parseInt(querystring['did']) <= ajaxdata.variantsize) {
		// Check if variant exists in local storage
		if (localStorageItem == null) {
			localStorage.setItem(localStorageItemKey, createDuggaLocalStorageData(ajaxdata.variant, ajaxdata.variants));
		} 
		else {
			// Remove item if expired
			if (isDuggaExpiredCheck(localStorageItem)){
				console.log(localStorageItem);
				clearLocalStorageItem(localStorageItemKey);
				reloadPage();
			}
				
		}
		variantValue = JSON.parse(localStorage.getItem(localStorageItemKey)).variant.vid;
	}
}

function createDuggaLocalStorageData(ajaxVid, ajaxVariantArr) {
	console.log(ajaxVid);
	console.log(ajaxVariantArr);
 	var data = {
		variant: getVariant(ajaxVid,ajaxVariantArr),
		expireTime: createExpireTime()
	};

	return JSON.stringify(data);
	

}

function getVariant(ajaxVid, ajaxVariantArr){
	for (var variant of ajaxVariantArr){	
		if(variant.vid == ajaxVid){
			return variant;
		}
	}

}


function createExpireTime() {

	var expireInDays = 90;
	var expireDate = new Date();
	expireDate.setDate(expireDate.getDate() + expireInDays);

	return expireDate;
}

function isDuggaExpiredCheck(localStorageItem) {
	// Compare stored date with current date
	var parsed = JSON.parse(localStorageItem)
	var expireDate = new Date(parsed.expireTime)
	var curDate = new Date();

	return curDate >= expireDate;
}

function enableTeacherVariantChange(data) {
	//Set value to nbrOfVariants, this is needed so a teacher can locally change variant.
	latestVariantSet = JSON.parse(localStorage.getItem(localStorageItemKey)).variant.vid;
	varArr = [];		
	data['variants'].forEach(element => varArr.push(element.vid));
	nbrOfVariants = varArr.length;
	if(nbrOfVariants == 1) {
		//document.getElementById("nextVariantBtn").style.display="none";
	}
}

function clearLocalStorageItem(key) {
	localStorage.removeItem(key);
}

//Will handle enter key pressed when formBox is showing
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
				document.getElementById("#challengeQuestion").innerHTML=result['ls-security-question'];
			}else{
				if(typeof result.reason != "undefined") {
					document.querySelectorAll("#changeChallengeQuestion #securityQuestionError").forEach(function(){
						innerHTML="<div class='alert danger'>" + result.reason + "</div>"
					});
				} else {
					document.querySelectorAll("#changeChallengeQuestion #securityQuestionError").forEach(function(){
						innerHTML="<div class='alert danger'>" + result['getname']  + "</div>"
					});
				}
				document.querySelectorAll("#changeChallengeQuestion #challengeQuestion").forEach(function(){
					style.backgroundColor="rgba(255, 0, 6, 0.2)"
				});
				document.querySelectorAll("#changeChallengeQuestion #securityQuestionError").forEach(function(){
					style.color="rgba(255, 0, 6, 0.8)"
				});
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
	var username = document.querySelector("#usernamereset").value;

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
				document.querySelectorAll("#showsecurityquestion #displaysecurityquestion").innerHTML=result['ls-security-question'];
				status = 2;
				toggleloginnewpass();
			}else if(result['getname'] == "limit"){
        displayAlertText("#newpassword #message2", "You have exceeded the maximum <br /> amount of tries within 5 min");
      }
	 	else if(result['getname'] == "pending"){
			displayAlertText("#newpassword #message2", "Not yet confirmed");
		 }
		 else if(result['getname'] == "revoked"){
			displayAlertText("#newpassword #message2", "Permission revoked");
		 } else{
				if(typeof result.reason != "undefined") {
          displayAlertText("#newpassword #message2", result.reason);
				} else {
          displayAlertText("#newpassword #message2", result['getname']);
				}
				document.querySelectorAll("#newpassword #username").forEach(function(){
					document.style.backgroundColor="rgba(255, 0, 6, 0.2)";
				});
		}
		}
	});
}

function processResetPasswordCheckSecurityAnswer() {
  //Checking so the sequrity question answer is correct and notefying a teacher that a user needs its password changed
  var username = document.querySelector("#usernamereset").value;
  var securityquestionanswer = document.querySelector("#answer").value;
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

      }else if(result['requestchange'] == "pending"){
		displayAlertText("#showsecurityquestion #message3",  "Not yet confirmed");
	  }
	  else if(result['requestchange'] == "revoked"){
		displayAlertText("#showsecurityquestion #message3",  "Permission revoked");
	  }

	  else if(result['requestchange'] == "wrong"){
        displayAlertText("#showsecurityquestion #message3", "Wrong answer");
      }else{
        document.querySelectorAll("#showsecurityquestion #answer").forEach(function(){
			style.backgroundColor="rgba(255, 0, 0, 0.2)"
		});
        displayAlertText("#showsecurityquestion #message3", "Something went wrong");
      }
    }
  });
}

function processLogin() {
    var user = document.querySelector("#login #username");
	var username = user ? user.value : null;

    var saveuser = document.querySelector("#login #saveuserlogin");
	var saveuserlogin = saveuser ? saveuser.value : null;

    var pw = document.querySelector("#login #password");
	var password = pw ? pw.value : null;
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
			if(result['ls-security-question'] != null) {
				localStorage.setItem("ls-security-question", "set");
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
			loginFail();
        	if(typeof result.reason != "undefined") {
            	displayAlertText("#login #message", result.reason);
		  	} 
			else {
        		displayAlertText("#login #message", "Wrong username or password");
			}
			setTimeout(function(){
				displayAlertText("#login #message", "Try again");
			}, 2000);
          	//closeWindows();
		}
      },
	  error: function(data) {
        console.log("Login error status: "+data.status);
		// status 200 = successful request
        if(data.status != 200){
			loginFail();
        } 
      }
    });
}

// Method is called when a login attempt fails. 
//Displays an error text and makes login inputs flash red
function loginFail(){
	displayAlertText("#login #message", "Wrong username or password");
	document.querySelector("input#username").classList.add("loginFail");
	document.querySelector("input#password").classList.add("loginFail");
	setTimeout(function(){
		document.querySelector("input#username").classList.remove("loginFail");
		document.querySelector("input#password").classList.remove("loginFail");
	}, 2000);
}

function displayAlertText(selector, text){
	document.querySelector(selector).innerHTML="<div style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>"+text+"</div>";
}

function processLogout() {
	$.ajax({
		type:"POST",
		url: "../Shared/loginlogout.php",
		success:function(data) {
			localStorage.removeItem("ls-security-question");
			localStorage.removeItem("securitynotification");
			if(window.location.pathname == "/LenaSYS/DuggaSys/profile.php"){
				window.location.href = "courseed.php";
			}
			else{
				reloadPage();
			}
		},
		error:function() {
			console.log("error");
		}
	});
	// Generate a logout token for the current instance
	localStorage.setItem('logout-event', 'logout' + Math.random());
	
	document.cookie = "MOTD=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear MOTD cookies
}

function showLoginPopup()
{
	document.querySelector("#formBox").style.display="flex";
	/*document.querySelector("#overlay").style.display="block";*/
	document.querySelector("#username").focus();

	// Reset input box color
	//document.querySelector("input#username").style.backgroundColor="rgba(255, 255, 255, 1)";
	//document.querySelector("input#password").style.backgroundColor="rgba(255, 255, 255, 1)";

	// Reset warning, if applicable
  displayAlertText("#login #message", "");

	window.addEventListener("keypress", loginEventHandler, false);
}

function hideLoginPopup()
{
		document.querySelector("#formBox").style.display="none";
		/*document.querySelector("#overlay").style.display="none";*/

		window.removeEventListener("keypress", loginEventHandler, false);
}

function showLogoutPopup()
{
	/*
	document.querySelector("#logoutBox").show();
	document.querySelector("#logoutBox").style.display="block";
	document.querySelector(".buttonLogoutCancelBox").onClick = function(){
		document.querySelector("#logoutBox").style.display="none";
	};
	*/
}
//----------------------------------------------------------------------------------
// setupLoginLogoutButton: Set button to login or logout functionality when navheader loads
//----------------------------------------------------------------------------------

function setupLoginLogoutButton(isLoggedIn){

	if(isLoggedIn == "true"){
		document.removeEventListener("#loginbutton", "click", false);
		document.addEventListener("#loginbutton").onClick=function(){
			document.getElementById("#logoutBox").style.display="block";
			document.querySelector(".buttonLogoutCancelBox").onClick(function(){
				document.getElementById("#logoutBox").style.display="none";
			});
		};
		sessionExpireMessage();
		sessionExpireLogOut();
	}

	else{
		document.removeEventListener("#loginbutton", "click", false);
		document.getElementById("#loginbutton").click=function(){showLoginPopup();};
	}
}

function toggleLoadVariant(setbool){	//setbool has a value of True or False. This decides if the Next variant button should be visable or not.
	loadVariantFlag = setbool;
	console.log("Value: " + setbool);
}

function showLoadDuggaPopup()
{
	document.querySelector("#loadDuggaBox").style.display="flex";
	localStorage.setItem("ls-redirect-last-url", document.URL);
}

function hideLoadDuggaPopup()
{
	document.querySelector("#loadDuggaBox").style.display="none";
}

function updateReceiptText(title, URL, hash, hashPW)
{
	//data['duggaTitle] & createUrl(data['hash']) & data['hash'] & data['hashpwd'] are often used as params
	var textBox = document.getElementById('submission-receipt');  
    textBox.innerHTML=(`${title}</br></br>Direct link (to be submitted in canvas): </br>` + 
	`<a href=${URL}'> ${URL}` + 
	`</a> </br></br> Hash: </br> ${hash}</br></br>Hash password:</br>${hashPW}`);
}

function showReceiptPopup()
{
	document.getElementById("receiptBox").style.display="flex";
	//document.getElementById("#overlay").style.display="block";
}

function hideReceiptPopup()
{
	document.getElementById("receiptBox").style.display="none";
	//document.getElementById("#overlay").style.display="none";
}

function hideFeedbackPopup(){
	document.getElementById("feedbackBox").style.display="none";
}

function showFeedbackPopup(){
	document.getElementById("feedbackBox").style.display="block";
}

function hideDuggaStatsPopup()
{
	document.getElementById("duggaStats").style.display="none";
	//document.getElementById("#overlay").style.display="none";
}

function checkScroll(obj) {
	if(obj.clientHeight < obj.scrollHeight) {
		obj.style.height = (parseInt(obj.style.height)+1) + 'em';
	}
}

//----------------------------------------------------------------------------------
// copySubmissionReceiptToClipboard: Copy the hash to user clipboard
//----------------------------------------------------------------------------------
function copySubmissionReceiptToClipboard() {
	const tempTextArea = document.createElement('textarea');
	tempTextArea.id = 'temp_element';
	tempTextArea.style.height = 0;

	document.body.appendChild(tempTextArea);

	tempTextArea.value = document.getElementById('submission-receipt').innerText;

	const selector = document.querySelector('#temp_element');
	selector.select();
	document.execCommand('copy');

	document.body.removeChild(tempTextArea);

}

//----------------------------------------------------------------------------------
// copyhashtoCB: Copy the hash to user clipboard
//----------------------------------------------------------------------------------
function copyHashtoCB() {
	var temp = document.createElement("input");
    document.getElementById("body").appendChild(temp);
    temp.value = hash;
    document.execCommand("copy");
	temp.remove();
}

//----------------------------------------------------------------------------------
// copyURLtoCB: Copy the url to user clipboard
//----------------------------------------------------------------------------------
function copyUrltoCB() {
	var copyUrl = document.createElement("input");
	document.getElementById("body").appendChild(copyUrl);
	copyUrl.value = document.getElementById('#url').textContent;
	document.execCommand("copy");
	copyUrl.remove();
}

//----------------------------------------------------------------------------------
// getParameters: extract the value of any parameter in the URL
//----------------------------------------------------------------------------------
function getParameters(parameterName){
	let parameters = new URLSearchParams(window.location.search);
	return parameters.get(parameterName);
}

function exitHashBox(){
    document.getElementById("#hashBox").style.display="none";
	window.location.href = "../DuggaSys/sectioned.php?courseid=" + getParameters("courseid") + "&coursename=" +
	 getParameters("coursename") + "&coursevers=" + getParameters("coursevers"); //redirect to the course page
	 
  //window.location.href = localStorage.getItem("ls-redirect-last-url"); //Takes us to previous visited dugga
}

function hideHashBox(){
    document.getElementById("#hashBox").style.display="none";
}

function checkHashPassword() {
	var loginHash;
	var url = window.location.href;
	if(ishashinurl) {
		loginHash = hash;
	}
	else {
		loginHash = document.getElementById('hashfield').value;
		url += `&hash=${loginHash}`;
		console.log(`hash: ${loginHash}`)
	}
	var password = document.getElementById('passwordfield').value;
	
	$.ajax({
        url: "../Shared/hashpasswordauth.php",
        data: {password:password, hash:loginHash},
        type: "POST",
        success: function(data){
        	var d = JSON.parse(data);
			var auth = d.auth
            if(auth){
        		console.log('Success!');
        		hideHashBox();
				passwordReload = true;
				sendGroupAjax(1);

				location.replace(url);
				//reloadPage();
        	}else{
        		document.getElementById('#passwordtext').textContent='Wrong password, try again!';
        		document.getElementById('#passwordtext').style.color='red';
				console.log('Fail!');
        	}
		}
	});
}

function showSecurityPopup()
{
   document.getElementById("#securitynotification").style.display="flex";
   //document.getElementById("#overlay").style.display="block";
}

function showDuggaInfoPopup()
{

	if (document.getElementById("#receiptBox").style.display!="flex"){
		document.getElementById("#duggaInfoBox").style.display="flex";
		//document.getElementById("#overlay").style.display="block";
	}
}

function hideDuggaInfoPopup()
{
	document.getElementById("#duggaInfoBox").style.display="none";
	//document.getElementById("#overlay").style.display="none";
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
				document.querySelector(".expiremessagebox").style.display="block";
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
				document.querySelector(".expiremessagebox").style.display="none";
				document.querySelector(".endsessionmessagebox").style.display="block";
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
window.addEventListener("load", function() {
	//There is an issue with using this code, it generates errors that stop execution
      window.addEventListener("keyup", function(event){
      	if(event.keyCode == 27) {
					if (window.location.href.indexOf('sectioned') !== -1) {
						closeSelect();
					} else {
						closeWindows();
					}          
        }
      });
});

// Close the "logout" window by pressing the ESC button
document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' && document.querySelector(".logoutBox")) {
	  document.getElementById("logoutBox").style.display="none";
	}
})

// Never make dialogs draggable - ruins everything!

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

function displayDownloadIcon(){
    iconFlag = true;
}


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
			tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
		} else if(ctype == "zip" || ctype == "rar"){
			tab+="<thead><tr><th>Filename</th><th>Ziparchive</th><th>Upload date</th></tr></thead>";
		} else {
			tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
		}
  // Currently only displays Filename and upload date. Teacher feedback will be re-integrated through canvas later.
  	// if(iconFlag){
	// 	if (group) {
	// 		if (mobileMediaQuery.matches) {
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	} else if(ctype == "zip" || ctype == "rar"){
	// 		if(mobileMediaQuery.matches){
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Ziparchive</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Ziparchive</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	} else {
	// 		if (mobileMediaQuery.matches) {
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 			tab+="<thead><tr><th>Download</th><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	}
	// } else {
	// 	if (group) {
	// 		if (mobileMediaQuery.matches) {
	// 		tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 				tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	} else if(ctype == "zip" || ctype == "rar"){
	// 		if(mobileMediaQuery.matches){
	// 			tab+="<thead><tr><th>Filename</th><th>Ziparchive</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 			tab+="<thead><tr><th>Filename</th><th>Ziparchive</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	} else {
	// 		if (mobileMediaQuery.matches) {
	// 			tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		} else {
	// 			tab+="<thead><tr><th>Filename</th><th>Upload date</th></tr></thead>";
	// 		}
	// 	}
	// }

		tab +="<tbody>";
		if (typeof filez !== "undefined"){
			for (var i=filez.length-1;i>=0;i--){
					if(cfield==filez[i].fieldnme){
							var filelink=filez[i].filepath+filez[i].filename+filez[i].seq+"."+filez[i].extension;
							tab+="<tr>"

							// // Button for making / viewing feedback - note - only button for given feedback to students.
							// if(iconFlag){
							// 	if (ctype == "link"){
							// 		tab+="<td>";
							// 		tab+="<a href='"+filez[i].content+"' ><img alt='download icon' title='Download' src='../Shared/icons/file_download.svg' /></a>";
							// 		tab+="</td>";
							// 	} else {								
							// 		tab+="<td>";
							// 		tab+="<a href='"+filelink+"' ><img alt='download icon' title='Download' src='../Shared/icons/file_download.svg' /></a>";										
							// 		// if type is pdf, add an extenral_open icon to open in new tab next to download icon.
							// 		if (ctype == "pdf") {
							// 			tab +="\t<tab><a href='"+filelink+"' target='_blank'><img alt='open in new tab icon' title='Open in new tab' src='../Shared/icons/external_link_open.svg' /></a></tab>";
							// 			tab+="</td>";
							// 		}
							// 		else{
							// 			tab+="</td>";
							// 		}
							// 	}
							// }
              				if (group) {
								tab+="<td>"+filez[i].username+"</td>";
							}
							tab+="<td>";
              				if (ctype == "link"){							
								//tab+="<span style='cursor: pointer;text-decoration:underline;'  onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);'>";
								tab+="<a target='_blank' href='"+filez[i].content+"'>";
								tab+=filez[i].content+"</a>";
								// if (mediumMediaQuery.matches) {
								// 	tab+=filez[i].content+"</span>";
								// } else if (mobileMediaQuery.matches) {
								// 	tab+=filez[i].content+"</span>";
								// } else {
								// 	tab+=filez[i].content+"</span>";
								// }
							}else if(ctype == "zip" || ctype == "rar"){ 
								console.log("teacherstatus", isTeacher);
								if(isTeacher){
									//tab+="<span onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);' style='cursor: pointer;text-decoration:underline;'>";
									tab+=`<span><a href="showdoc.php?sub=${filez[i].subid}">`;
								}
								else{
									tab+="<span>";
								}
								tab+=filez[i].filename+"."+filez[i].extension;+"</a>";
								tab+="<td>"+filez[i].zipdir+"</td></span>";

								// if (mediumMediaQuery.matches) {
								// 	tab+=filez[i].filename+filez[i].extension;
								// 	tab+="<td>"+filez[i].zipdir+"</td></span>";
								// } else if (mobileMediaQuery.matches) {
								// 	tab+=filez[i].filename+filez[i].extension;
								// 	tab+="<td>"+filez[i].zipdir+"</td></span>";
								// } else {
								// 	tab+=filez[i].filename+"."+filez[i].extension;
								// 	tab+="<td>"+filez[i].zipdir+"</td></span>";
								// }
							} else {
								console.log("teacherstatus", isTeacher);
								if(isTeacher){
									//tab+="<span onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);' style='cursor: pointer;text-decoration:underline;'>";
									tab+=`<span><a href="showdoc.php?sub=${filez[i].subid}">`;
								}
								else{
									tab+="<span>";
								}
								tab+=filez[i].filename+"."+filez[i].extension+"</span>";
								// if (mediumMediaQuery.matches) {
								// 	tab+=filez[i].filename+filez[i].extension+"</span>";
								// } else if (mobileMediaQuery.matches) {
								// 	tab+=filez[i].filename+filez[i].extension+"</span>";
								// } else {
								// 	tab+=filez[i].filename+"."+filez[i].extension+"</span>";
								// }
							}
							tab+="</td><td>";
							if (mobileMediaQuery.matches) {
								var mobileDate = filez[i].updtime.substring(2,);
								tab+=mobileDate+"</td>";
							} else {
								tab+=filez[i].updtime;+"</td>";
							}
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
	if(element!=undefined){
		if(element.parentElement.querySelector(".instructions-content").style.display=="none")
			element.parentElement.querySelector(".instructions-content").style.display="block"
		else
			element.parentElement.querySelector(".instructions-content").style.display="none"
	}
}

function toggleFeedback(element)
{
	if(element!=undefined){
		if(element.parentElement.querySelector(".feedback-content").style.display=="none")
			element.parentElement.querySelector(".feedback-content").style.display="block";
		else
			element.parentElement.querySelector(".feedback-content").style.display="none";
	}
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
						//str += '<embed src="'+filepath+filename+fileseq+'.'+fileext+'" width="100%" height="100%" type="application/pdf" />';
		 		} else if (fileext === "zip" || fileext === "rar"){
		 				//str += '<a href="'+filepath+filename+fileseq+'.'+fileext+'"/>'+filename+'.'+fileext+'</a>';
		 		} else if (fileext === "txt"){
		 				str+="<pre style='width: 100%;height: 100%;box-sizing: border-box;'>"+dataV["files"][inParams["moment"]][fileindex].content+"</pre>";
		 		}
		}
		document.getElementById("popPrev").innerHTML=str;


}

function displayDuggaStatus(answer,grade,submitted,marked,duggaTitle){
		var str="<div style='display:flex;justify-content:center;align-items:center;'><div id='duggaTitleSibling' class='LightBox'>";
		// Get proper dates
		if(submitted!=="UNK") {
			var t = submitted.split(/[- :]/);
			submitted=new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
		}
		if(marked!=="UNK") {
			var tt = marked.split(/[- :]/);
			marked=new Date(tt[0], tt[1]-1, tt[2], tt[3], tt[4], tt[5]);
		}

		if(duggaTitle == undefined || duggaTitle == "UNK" || duggaTitle == "null" || duggaTitle == ""){	
			duggaTitle = "Untitled dugga";
		}
  
		str+="<div class='' style='margin:4px;'></div></div>";

		if(loadVariantFlag && variantsArr.length > 1){	//If the 'Next variant' button is set to be visable (Teachers only). 
			str+="<div id='nextVariantBtn' ><input class='submit-button large-button' style='width:auto;' type='button' value='"+duggaTitle+" V:"+variantValue+"' onclick='selectNextVariant();' /></div>"; 
		}
		else{	//If the 'Next variant' button is set to not be visable (Students).
			str+="<div>"+duggaTitle+"</div>";
		}

		str+="</div>";
		document.getElementById("#duggaStatus").remove();
		document.querySelectorAll("<td id='duggaStatus' align='center'>"+str+"</td>").after("#menuHook");
		document.getElementById("#menuHook").style.display="none";
		// Adds dugga title next to the text "Instructions"
		document.querySelector('h3:contains("Instructions")').innerHTML=duggaTitle + " - Instructions";
}


function FABMouseOver(e) {
	if (e.target.id === "fabBtn") {
		var e1=document.querySelectorAll('.fab-btn-sm');
		var eL=document.querySelector('.fab-btn-list');

		e1.forEach(element => {
			if(element.classList.contains('scale-out')){
				eL.style.display="block";
				element.classList.toggle('scale-out');
			}
		});
	} else if (e.target.id === "addElement") {
		var e2=document.querySelectorAll('.fab-btn-sm2');
		var eL2=document.querySelector('.fab-btn-list2');

		e2.forEach(element2 => {
			if(element2.classList.contains('scale-out')){
				eL2.style.display="block";
				element2.classList.toggle('scale-out');
			}
		});
		
		document.querySelector('#addElement').classList.add('spin');

		
		setTimeout(function() {
			document.querySelector('#addElement').classList.remove('spin');
		}, 1000); 
	}
}

//----------------------------------------------------------------------------------
// FABMouseOut: FAB Mouse Out
//----------------------------------------------------------------------------------
function FABMouseOut(e) {
	if (document.querySelector('.fab-btn-sm') && !document.querySelector('.fab-btn-sm').classList.contains('scale-out') &&
	!e.relatedTarget.closest(".fixed-action-button") && !e.relatedTarget.classList.contains("fixed-action-button")) {
		document.querySelector('.fab-btn-sm').classList.toggle('scale-out');
		document.querySelector('.fab-btn-list').style.display="none";
	}
	else if (document.querySelector('.fab-btn-sm2') && !document.querySelector('.fab-btn-sm2').classList.contains('scale-out') &&
	!e.relatedTarget.closest(".fixed-action-button2") && !e.relatedTarget.classList.contains("fixed-action-button2")) {
		document.querySelector('.fab-btn-sm2').classList.toggle('scale-out');
		document.querySelector('.fab-btn-list2').style.display="none";
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
	if (document.querySelector('.fab-btn-list').checkVisibility()==true) {
		if (document.querySelector('.fab-btn-list').checkVisibility()==true && document.getElementById('fabBtn') === e.target) FABToggle();
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
	if ((e.target.id=="fabBtn") && !document.querySelector('.fab-btn-list').checkVisibility()==true) {
		clearTimeout(pressTimer);
		createQuickItem();
	}else if (document.querySelector('.fab-btn-list').checkVisibility()==true && (e.target.id!="fabBtn")) {
		FABToggle();
	}
}

//----------------------------------------------------------------------------------
// FABToggle : FAB Mouse Toggle / Touch Toggle
//
// Toggles action bubbles when pressing the FAB button
//----------------------------------------------------------------------------------
function FABToggle() {
	var e1=document.querySelectorAll('.fab-btn-sm');
	var eL=document.querySelector('.fab-btn-list');

	e1.forEach(element => {
		if (!element.classList.contains('scale-out')) {
				element.classList.toggle('scale-out');
				eL.style.display="none";
		} else {
				eL.style.display="block";
				element.classList.toggle('scale-out');
		}
	});
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
	document.querySelector("#motdNav").style.display="inline-block";
	document.querySelector("#servermsgcontainer").style.display="none";
	sessionStorage.setItem('show','false');
}

function hideCookieMessage() {
		document.querySelector("#cookiemsg").style.display="none";
		document.querySelector("#cookiemsg").style.opacity="1";
}

function showServerMessage(){
	document.querySelector("#motdNav").style.display="none";
	document.querySelector("#servermsgcontainer").style.display="inline-block";
	sessionStorage.setItem('show','true');
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
		document.getElementById("#feedbackbox").style.display="block";
		document.getElementById("#feedbackquestion").innerHTML=data['feedbackquestion'];
	} 
}
//----------------------------------------------------------------------------------
//sends userinput feedback
//----------------------------------------------------------------------------------
function sendFeedback(entryname){
	if (document.querySelector("input[name='rating']:checked").value) {
		document.getElementById('#submitstatus').style.display="none";
		var param = {};
  		param.courseid = querystring['courseid'];
  		param.moment = querystring['moment'];
		param.score = document.querySelector("input[name='rating']:checked").value;
		param.entryname = entryname;  
		if(document.getElementById("#contactable:checked").value){
			param.contactable = 1;
		}else{
			param.contactable = 0;
		}
		AJAXService("SENDFDBCK",param,"SENDDUGGAFEEDBACK");
	}else {
		document.getElementById('#submitstatus').style.display({'color':'var(--color-red)',"display": "inline-block"}).textarea("Select a rating before saving it.");
	}
}

function returnedSubmitFeedback(){
	document.getElementById('#submitstatus').style.display({'color':'var(--color-green)',"display": "inline-block"}).textarea("Feedback saved");
}

function setDuggaTitle(title) {
	duggaTitle = title;
}

function updateLoginPopup() {
	var hashElement = document.getElementById("hash");
	if (ishashinurl){
		hashElement.innerHTML = hash;
	}
	else if(localStorage.getItem(localStorageItemKey)) {
		var localstorageHash = JSON.parse(localStorage.getItem(localStorageItemKey)).hash;
		if(localstorageHash != null){
			hashElement.innerHTML=localstorageHash;
		}

	}
}

function updateLocalStorageItem() {
	if (localStorage.getItem(localStorageItemKey)){
		var item = JSON.parse(localStorage.getItem(localStorageItemKey));
		item.hash = hash;
		item.expireTime = createExpireTime();
		localStorage.setItem(localStorageItemKey, JSON.stringify(item));
	}
}

//---------------------------------------------------------------------------------------------------------------
// Timer - Used in dugga's to count the amount of time spent on a dugga
//---------------------------------------------------------------------------------------------------------------

var Timer = {	
	// Determines if the timer should update ui
	update: 0,

	// Declare the timer variable, will be accessible from this object in a dugga
	timer: undefined,
	
	// Counts the amount of time spent on a dugga
	score: 0,
	
	// Called at the start of a dugga to initialize the object
	startTimer: function(){
		var self = this;
		
		// Sets the update interval of the timer, calls animate timer on increment
		this.timer = setInterval( function(){self.incrementTimer(); self.animateTimer();}, 1000 );
		
		// Call animate timer to initialize ui at 00:00:00
		this.animateTimer();
	},
	// Reset the timer.
	reset: function(){
		this.score = 0;

		// Call animate timer to initialize ui at 00:00:00
		this.animateTimer();
	},
	
	// Stops the timer from counting, called at the end of a dugga
	stopTimer: function(){
		var self = this;
		clearInterval(self.timer);
		
		// Quick fix
		this.update = 1;
	},
	
	// Increments the time counter by one
	incrementTimer: function(){
		this.score++;
	},
	
	//Show timer
	showTimer: function(){
		this.animateTimer();
	},
	
	// Updates the user interface
	animateTimer: function(){
		// Calculate hours, minutes and seconds based on timespent
		var hours = Math.floor(this.score / 3600);
		var minutes = Math.floor(this.score / 60) % 60;
		var seconds = this.score % 60;

		// Create a nice looking clock thing with the information we have
		var str = "<p>";
		str += hours + ":";
		
		if(minutes < 10){
			str += 0;
		}

		str += minutes + ":";
		if(seconds < 10){
			str += 0;
		}
		str += seconds;

		// Push new value to ui thing
		if(this.update == 0) {
			document.getElementById('scoreElement').innerHTML = str;
		}
	}
}	

//---------------------------------------------------------------------------------------------------------------
// Click counter - Used by highscore system implementations in dugga's to count the number of button clicks
//---------------------------------------------------------------------------------------------------------------
var ClickCounter = {
	// Used to count clicks
	score: 0,
	
	// Initializes the noClicks variable, called at the start of a dugga
	initialize: function() {
		this.score = 0;
		this.animateClicks();	
	},
	
	// Called whenever a dugga should count a mouse click, e.g., when a user presses a button
	onClick: function() {
		// Increments the click counter by one
		this.score++;
		// Calls animate clicks to directly update the click counter user interface 
		this.animateClicks();
		duggaChange();
	},
	
	//show clicker
	showClicker: function(){
		this.animateClicks();
	},
	
	// Updates the click counter user interface in a dugga, uses the same 
	animateClicks: function() {
		var cc = document.getElementById('scoreElement');
		var clicks = document.getElementById('groupAssignment');
		if (cc){
			// Apply some web magic to change the ui counter
			var str = `<p id="clicks">`;
			str += this.score;
			cc.innerHTML = str;
			clicks.innerHTML = str;


		}
	}
}

//if changes has been done a promt is made to ask user if they want to discard them.
function addAlertOnUnload(){

	window.onbeforeunload = function() {
		if(ClickCounter.score > 0){
			try {
				//add things here to run showing the popup for alerting someone that they got unsaved changes.
				//for example storing stuff to localstorage.
			}catch(e){}
			return "Changes will be discarded by leaving page.";
		}
	}
}


// -----------------------  Edit dugga instructions start -------------------

//read instructions as string
function ReadOriginalInstructions(doc){
	var strDoc = "";
	for (var i = 0; i< doc.length;i++){
		console.log(i);	
		strDoc =strDoc + doc[i].textContent;
	}
	strDoc = strDoc.trim();
	return strDoc;

}

//ignore changes and close window
function ignoreEditDugga(popupForm){
	window.close();
}

//save info from new input and close window
function saveEditDugga(popupForm){
	var changed = popupForm.changedinfo.value;
	var doc = window.opener.document.getElementsByClassName("instructions-content") 
	doc[0].textContent = changed;
	window.close();
}

function autoUpdateText(popupForm){
	var newInfo = popupForm.changedinfo.value;
	console.log(newInfo);
	
}

//create popup for editing dugga
function createPopup(strDoc){
	var win = window.open("","","popup,width=700, height=500");
	win.onbeforeunload = function() {return "Changes will be discarded by leaving page.";}
	win.document.write(`
	<script src="../Shared/dugga.js"></script>
	<script src="../Shared/js/jquery-1.11.0.min.js"></script>
	<script src="../Shared/js/jquery-ui-1.10.4.min.js"></script>
	<form name='changeDugga' action=''>
		<textarea rows=30 cols=80 id='changedinfo'>
			`+strDoc+`
		</textarea><br>
		<input type='submit' value='save changes' onclick='saveEditDugga(this.form)'></input>
		<input type='button' value='cancel changes' onclick='ignoreEditDugga()'></input>
	</form>`);
	win.document.getElementById('changedinfo').onchange = popupForm(this.form);
	return win;
}

//read and edit instructions on dugga.
function editDuggaInstruction(){	
	
	//var doc = document.getElementsByClassName("instructions-content");
	var strDoc = ReadOriginalInstructions(document.getElementsByClassName("instructions-content"));
	var poppy = createPopup(strDoc);

}

// ----------------------------- Edit dugga instructions end ------------------------

//Code that makes it possible to navigate using tab and enter to click elements
document.addEventListener('keydown', function(e) {
	if(e.key === 'Enter'){
		var box = e.target;
		var allSort = document.getElementById("all-files-sort");
		var globalSort = document.getElementById("global-files-sort");
		var courseLocalSort = document.getElementById("course-local-sort");
		var versionLocalSort = document.getElementById("version-local-sort");
		var linksSort = document.getElementById("links-sort");
		var dummySort = document.getElementById("dummyEmptyFile-sort");	
		if (box[0].classList.contains("home-nav")){
			box.parents('td').click();
		}
		else if (box[0].classList.contains("theme-toggle-nav")){
			box.parents('td').click();
		}
		else if (box[0].classList.contains("loginbutton-nav")){
			box.parents('td').click();
		}
		else if(box.parents('div').attr('id') =="FABStatic"){
			box.mouseover();
		}
		else if(box[0].classList.contains("fab-btn-sm")){
			box.click();	
		}
		else if(box.parents('div').attr('id') =="FABStatic2"){
			box.mouseover();
		}
		else if(box[0].classList.contains("fab-btn-list2")){
			box.click();	
		}
		else if (box[0].classList.contains("messagedialog-nav")){
			box.parents('td').click();
		}
		else if (box[0].classList.contains("announcement-nav")){
			sessionStorage.removeItem("closeUpdateForm");
			document.getElementById("#announcementBoxOverlay").toggle;
			if(document.getElementById("#announcementForm").is(":hidden")){
				document.getElementById("#announcementForm").show();
			}
		}
		else if (box[0].classList.contains("editVers")){
			showEditVersion();
		}
		else if (box[0].classList.contains("newVers")){
			showCreateVersion();
		}
		else if (box[0].classList.contains("showDuggaFiltTab")){
			showAvailableDuggaFilter();
		}
		else if (box[0].classList.contains("showColumnFiltTab")){
			showAvailableColumnFilter();
		}
		else if (box[0].classList.contains("searchTab")){
			searchByFilter();
		}
		else if (box[0].classList.contains("allFilesSortTab")){
			filterFilesByKind('All');
			allSort.checked= true;
		}
		else if (box[0].classList.contains("globalSortTab")){
			filterFilesByKind('Global');
			globalSort.checked= true;
		}
		else if (box[0].classList.contains("courselocalSortTab")){
			filterFilesByKind('CourseLocal');
			courseLocalSort.checked= true;
		}
		else if (box[0].classList.contains("versionLocalSortTab")){
			filterFilesByKind('Local');
			versionLocalSort.checked = true;
		}
		else if (box[0].classList.contains("linkSortTab")){
			filterFilesByKind('Link');
			linksSort.checked = true;
		}
		else if (box[0].classList.contains("dummyFileSortTab")){
			filterFilesByKind('DummyFiles');
			dummySort.checked = true;
		}
		else if (box[0].classList.contains("fabBtnEditfile") || (box[0].classList.contains("fabBtnEditDugga"))){
			createQuickItem();
		}
		else if (box[0].classList.contains("newTabCanvasLink")){
			openCanvasLink(box[0]);
		}
		else if (box[0].classList.contains("showCanvasLinkBoxTab")){
			showCanvasLinkBox("open", box[0]);
		}
		else if (box[0].classList.contains("traschcanDelItemTab")){
			box[0].click();
		}
		else if (box[0].classList.contains("markdownIconTab")){
			renderVariant(clickedElement);
			showVariantEditor();
		}
		else if (box[0].classList.contains("trashcanTab")){
			box[0].click();
		}
		else if (box[0].classList.contains("showeditorTab")){
			loadPreview(box[0]);
		}
		else if (box[0].classList.contains("traschcanDelDugga")){
			box[0].click();
			
		}
		else if (box[0].classList.contains("settingIcon")){
			selectDugga(object);
			
		}
		else if (box[0].classList.contains("markdownIconeditFile")){
			box[0].click();
			
		}
		else if (box[0].classList.contains("settingIconTab")){
			setTimeout(function(){
				box[0].click();
			  },200);
			
        }
		else if(box[0].classList.contains("checkboxIconTab")){
			box[0].click();
		}
		else if(box[0].classList.contains("sortableHeading")){
			box[0].click();
		}
		else if(box[0].classList.contains("whiteIcon")){
			box[0].click();
		}
		else if(box[0].classList.contains("courseSettingIcon")){
			box[0].click();
		}
	}
});
