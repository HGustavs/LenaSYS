//----------------------------------------------------------------------------------
// changeCSS: Changes the CSS and remembers the index of the CSS.
//            This allows us to set and remove whole CSS files
//----------------------------------------------------------------------------------
var status = 0;
var score;
var timeUsed;
var stepsUsed;
function toggleloginnewpass(){

	if(status == 0){
		$("#newpassword").css("display", "block");
		$("#login").css("display", "none");
		status++;
	}else if(status == 1){
		$("#newpassword").css("display", "none");
		$("#login").css("display", "block");
		status= 0;
	}

}

function closeWindows(){

	$(".loginBox").css("display", "none");
	$("#overlay").css("display","none");
	$("#login #username").val("");
	$("#login #password").val("");
	
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
		str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890![]#/()=+-_:;.,*";

		var valu="";
		for(i=0;i<9;i++){
				valu+=str.substr(Math.round(Math.random()*78),1);
		}

		return valu;
}

//----------------------------------------------------------------------------------
// isNumber: 		returns true: the variable only contains numbers
//					returns false: the variable is not purely numeric
//                Is called by editImpRows in codeviewer.js
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
		citstr+= "##!!##" + timeUsed;
		citstr+= "##!!##" + stepsUsed;		
		citstr+= "##!!##" + score;
		hexstr="";
		for(i=0;i<citstr.length;i++){
				hexstr+=citstr.charCodeAt(i).toString(16)+" ";
		}
		
		AJAXService("SAVDU",{answer:citstr},"PDUGGA");

		//alert("Kvitto - Duggasvar\n\n"+"\""+hexstr+"\"\n\nTeckensträngen ovan är ditt kvitto på att duggan har lämnats in.\n\nSpara kvittot på ett säkert ställe.");
		document.getElementById('receipt').value = hexstr;
		document.getElementById('receiptInfo').innerHTML = "<p>\n\nTeckensträngen är ditt kvitto på att duggan har lämnats in. Spara kvittot på en säker plats.\n\n</p>";
		showReceiptPopup();
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

function changeURL(thisurl)
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
		window.location.href = surl+"/EditorV50.php?exampleid="+exampleno+"&courseid="+querystring['courseid']+"&cvers="+querystring['cvers'];
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

//				str=str.replace(/\{/g, '&#123;');
//				str=str.replace(/\}/g, '&#125;');
		}
   	return str;
}

//----------------------------------------------------------------------------------
// AJAX Service: Generic AJAX Calling Function with Prepared Parameters
//----------------------------------------------------------------------------------

function AJAXService(opt,apara,kind)	
{
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
//					var s = apara[key].match(/[a-zA-ZäöåÄÖÅ0-9@=#!{}():|"\/\&\?\. \_ \, \- \: \* \[ \] \s]*/gi);
			
					// Concat the generated regex result to a string again.
//					apara[key] = s.join("");
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
	}else if(kind=="RESULTLIST"){
			$.ajax({
				url: "resultlistedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedResults
			});
	}else if(kind=="CODEVIEW"){
			$.ajax({
				url: "editorService.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returned
			});
	}else if(kind=="BOXCONTENT"){
		$.ajax({
			url: "editorService.php",
			type: "POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returned
		});
	}else if(kind=="UMVSTUDENT") {
			$.ajax({
				url: "usermanagementviewservice.php",
				type:"POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: renderStudentView
			});
	}else if(kind=="UMVTEACHER") {
			$.ajax({
				url: "usermanagementviewservice.php",
				type:"POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: renderTeacherView
			});
	}
}

//Will handle enter key pressed when loginbox is showing
function loginEventHandler(event){
	if(event.keyCode == "0x0D"){
		processLogin();
	}
}


function processLogin() {

		var username = $("#login #username").val();
		var saveuserlogin = $("#login #saveuserlogin").val();
		var password = $("#login #password").val();
		
		$.ajax({
			type:"POST",
			url: "../Shared/loginlogout.php",
			data: {
				username: username,
				saveuserlogin: saveuserlogin == 1 ? 'on' : 'off',
				password: password,
				opt: "LOGIN"
			},
			success:function(data) {
				var result = JSON.parse(data);
				if(result['login'] == "success") {
					$("#userName").html(result['username']);
					$("#loginbutton").removeClass("loggedout");
					$("#loginbutton").addClass("loggedin");

					hideLoginPopup();
					
					$("#login #username").val("");
					$("#login #password").val("");		
					
					$("#loginbutton").off("click");
					console.log("Removed show login bind");
					$("#loginbutton").click(function(){processLogout();});

					location.reload();				
				}else{
					console.log("Failed to log in.");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger'>Wrong username or password!</div>");
					}
					$("input#username").css("background-color", "rgba(255, 0, 6, 0.2)");
					$("input#password").css("background-color", "rgba(255, 0, 6, 0.2)");
				}
					
			},
			error:function() {
				console.log("error");
			}
		});
}

function processLogout() {
	$.ajax({
		type:"POST",
		url: "../Shared/loginlogout.php",
		success:function(data) {
			var urlDivided = window.location.href.split("/");
			urlDivided.pop();
			urlDivided.pop();
			var newURL = urlDivided.join('/') + "/DuggaSys/courseed.php";
			window.location.replace(newURL);			
		},
		error:function() {
			console.log("error");
		}
	});
}

function showLoginPopup()
{
	$("#loginBox").css("display","block");
	$("#overlay").css("display","block");
	$("#username").focus();
		
	// Reset input box color
	$("input#username").css("background-color", "rgba(255, 255, 255, 1)");
	$("input#password").css("background-color", "rgba(255, 255, 255, 1)");
	
	// Reset warning, if applicable
	$("#login #message").html("<div class='alert danger'></div>");
	
	window.addEventListener("keypress", loginEventHandler, false);
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
		
		window.removeEventListener("keypress", loginEventHandler, false);
}

//----------------------------------------------------------------------------------
// setupLoginLogoutButton: Set button to login or logout functionality when navheader loads
//----------------------------------------------------------------------------------

function setupLoginLogoutButton(isLoggedIn){

	if(isLoggedIn == "true"){
		$("#loginbutton").off("click");
		$("#loginbutton").click(function(){processLogout();});	
	}
	else{
		console.log("Setting button to show login prompt");
		$("#loginbutton").off("click");
		$("#loginbutton").click(function(){showLoginPopup();});		
	}
}

function showReceiptPopup()
{
	$("#receiptBox").css("display","block");
	$("#overlay").css("display","block");
}

function hideReceiptPopup()
{
	$("#receiptBox").css("display","none");
	$("#overlay").css("display","none");
}


function showEmailPopup()
{
	var receiptcemail ="";
	$("#emailPopup").css("display","block");
	$("#overlay").css("display","block");
	receiptcemail = localStorage.getItem("receiptcemail"); //fetches localstorage item 
	document.getElementById('email').value = receiptcemail;
}

function hideEmailPopup()
{
	$("#emailPopup").css("display","none");
	$("#overlay").css("display","none");
}

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

function showDuggaInfoPopup()
{

	if ($("#receiptBox").css("display")!= "block"){
		$("#duggaInfoBox").css("display","block");
		$("#overlay").css("display","block");
	}
}

function hideDuggaInfoPopup()
{
	$("#duggaInfoBox").css("display","none");
	$("#overlay").css("display","none");
	if(startDuggaHighScore){
		startDuggaHighScore();
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

$(window).load(function() {
	//There is an issue with using this code, it generates errors that stop execution
      $(window).keyup(function(event){
      	if(event.keyCode == 27) closeWindows();
      });
});

$(window).load(function() {
	$('.loginBox').draggable({ handle:'.loginBoxheader'});
	$('.loginBox').draggable({ containment: "window"});	//contains the draggable box within window-boundaries
	//There is an issue with using this code, it generates errors that stop execution
	$(window).keyup(function(event){
		if(event.keyCode == 27) closeWindows();
	});
});

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
