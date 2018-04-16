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
var inParams = "UNK";;
var MAX_SUBMIT_LENGTH = 5000;
var querystring=parseGet();

//Show or hide security notification based on localstorage variables
/*
$( document ).ready(function() {
    if (localStorage.getItem("securityquestion") === null && localStorage.getItem("securitynotification") == "on"){
        showSecurityPopup();
    }
});
*/

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
	$("#login #message").html("<div class='alert danger'></div>");
	$("#newpassword #message2").html("<div class='alert danger'></div>");
	$("#showsecurityquestion #message3").html("<div class='alert danger'></div>");
}

//----------------------------------------------------------------------------------
// Sets cookie that expires when there's 30 min left of session
//----------------------------------------------------------------------------------

function setExpireCookie(){
    if(localStorage.getItem("securityquestion") === "set") {
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (1 * 2 * 8100000));////8100000, denotes time in milliseconds

        document.cookie = "sessionEndTime=expireC; expires=" + expireDate.toGMTString() + "; path=/";
    }
}

//----------------------------------------------------------------------------------
// Sets a cookie that expires at the same time as the user is logged out (when the session ends)
//----------------------------------------------------------------------------------
function setExpireCookieLogOut() {
    if (localStorage.getItem("securityquestion") === "set") {
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (1 * 2 * 9000000));
        document.cookie = "sessionEndTimeLogOut=expireC; expires=" + expireDate.toGMTString() + "; path=/";
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
	    }
	});

	if (index_highest > 0){
			e.style.display = "none";
			/* Overlay is only present for loginbox which has z-index of 9000,
         so if we closed such a window, hide the overlay and clear any values as well. */
			if (index_highest < 10000) {
					status=1;
					//toggleloginnewpass();
					//$("#overlay").css("display","none");
					resetFields();
			}
	}
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
				data: "courseid="+querystring['courseid']+"&coursename="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&comment="+querystring['comments']+"&opt="+opt+para,
				dataType: "json",
				success: returnedSection
			});
    }else if(kind=="SWIMLANE"){
  			$.ajax({
  				url: "swimlaneservice.php",
  				type: "POST",
  				data: "courseid="+querystring['courseid']+"&coursevers="+querystring['coursevers']+"&opt="+opt+para,
  				dataType: "json",
  				success: returnedSwimlane
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
				success: returned
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
	}else if(kind=="STATS") {
		$.ajax({
			url: "stats.php",
			type:"POST",
			data: "opt="+opt+para,
			dataType: "json",
			success: returnedAnalysis
		});
	}
}

//Will handle enter key pressed when loginbox is showing
function loginEventHandler(event){
	if(event.keyCode == "0x0D"){
		if(showing == 1){
			processLogin();
		}else if(showing == 0){
			resetPasswordBarrier();
		}else if(showing == 2){
			enterSecurityQuestionBarrier();
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

function resetPasswordBarrier() {
	var username = $("#usernamereset").val();

	$.ajax({
		type:"POST",
		url: "../DuggaSys/accessedservice.php",
		data: {
			username: username,
			opt: "REQNEWPWD"
		},
		success:function(data) {
			var result = JSON.parse(data);
			result = result.queryResult;
			processResetPasswordCheckUsername(result);
		}
	});
}

function processResetPasswordCheckUsername(result) {
	if(result <= 5) {
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
			}else{
				if(typeof result.reason != "undefined") {
					$("#newpassword #message2").html("<div class='alert danger'>" + result.reason + "</div>");
				} else {
					$("#newpassword #message2").html("<div class='alert danger' style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>" + result['getname']  + "</div>");
				}
				$("#newpassword #username").css("background-color", "rgba(255, 0, 6, 0.2)");
			}
		}
	});
	}else {
		$("#newpassword #message2").html("<div class='alert danger' style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>" + "You have exceeded the maximum <br> amount of tries within 5 min" + "</div>");
		$("#newpassword #username").css("background-color", "rgba(255, 0, 6, 0.2)");
	}
}

function enterSecurityQuestionBarrier(){
  var username = $("#usernamereset").val();

	$.ajax({
		type:"POST",
		url: "../DuggaSys/accessedservice.php",
		data: {
      username: username,
			opt: "CHECKSECURITYANSWER"
		},
		success:function(data) {
			var result = JSON.parse(data);
			result = result.queryResult;
			processResetPasswordCheckSecurityAnswer(result);
		}
	});
}

function processResetPasswordCheckSecurityAnswer(result) {
  if (result <= 5){
    //Checking so the sequrity question answer is correct and notefying a teacher that a user needs its password changed
    var username = $("#usernamereset").val();
    var securityquestionanswer = $("#answer").val();

    $.ajax({
        type:"POST",
        url: "../Shared/resetpw.php",
        data: {
          username: username,
          securityquestionanswer: securityquestionanswer,
          opt: "CHECKANSWER"
        },
        success:function(data) {
          var result = JSON.parse(data);
          if(result['checkanswer'] == "success") {
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
                }else{
                  $("#showsecurityquestion #answer").css("background-color", "rgba(255, 0, 0, 0.2)");
                  $("#showsecurityquestion #message3").html("<div class='alert danger'>Something went wrong</div>");
                }
              }
            });
          }else{
            if(typeof result.reason != "undefined") {
              $("#showsecurityquestion #message3").html("<div class='alert danger'>" + result.reason + "</div>");
            } else {
              //update database here.
              $("#showsecurityquestion #message3").html("<div class='alert danger' style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>Wrong answer</div>");
            }
            $("#showsecurityquestion #answer").css("background-color", "rgba(255, 0, 6, 0.2)");
        }
      }
    });
  } else {
    $("#showsecurityquestion #message3").html("<div class='alert danger' style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>You have exceeded the maximum <br> amount of tries within 5 min</div>");
  }
}

function processLogin() {
    /*

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

    */
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
          hideLoginPopup();
          /*
                    if(result['securityquestion'] != null) {
                        localStorage.setItem("securityquestion", "set");
                    } else {
                        setSecurityNotifaction("on");
                    }
            */
					setExpireCookie();
					setExpireCookieLogOut();

					// Fake a second login, this will reload the page and enable chrome and firefox to save username and password
					//$("#loginForm").submit();
          reloadPage();
				}else{
          alert("Login failed!");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger' style='color: rgb(199, 80, 80); margin-top: 10px; text-align: center;'>Wrong username or password! </div>");

					}


					$("#login #username").css("background-color", "rgba(255, 0, 6, 0.2)");
					$("input#password").css("background-color", "rgba(255, 0, 6, 0.2)");
          closeWindows();
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
            localStorage.removeItem("securityquestion");
            localStorage.removeItem("securitynotification");
			location.reload();
		},
		error:function() {
			console.log("error");
		}
	});
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
	$("#login #message").html("<div class='alert danger'></div>");

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
		$("#loginbutton").click(function(){processLogout();});
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

function showEmailPopup()
{
	var receiptcemail ="";
	$("#emailPopup").css("display","flex");
	//$("#overlay").css("display","block");
	receiptcemail = localStorage.getItem("receiptcemail"); //fetches localstorage item
	document.getElementById('email').value = receiptcemail;
}

function hideEmailPopup()
{
	$("#emailPopup").css("display","none");
	//$("#overlay").css("display","none");
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
					success:function(html) {
						alert(html);
					}

		 });
     setExpireCookie()
     setExpireCookieLogOut()
     sessionExpireMessage()
     sessionExpireLogOut()
}

//----------------------------------------------------------------------------------
// Timeout function, gives a prompt if the session is about to expire
//----------------------------------------------------------------------------------
function sessionExpireMessage() {

	if(document.cookie.indexOf('sessionEndTime=expireC') > -1){
		var intervalId = setInterval(function() {
		//console.log("testEMessage");
		checkIfExpired();
		}, 2000);
	}

	function checkIfExpired() {

			if (document.cookie.indexOf('sessionEndTime=expireC') == -1){
				// alert('Session is about to expire in 30 minutes');
				$(".expiremessagebox").css("display","block");

				clearInterval(intervalId);
			}

		}
	}

//----------------------------------------------------------------------------------
// Gives an alert when user is timed out (when the session ends)
//----------------------------------------------------------------------------------
function sessionExpireLogOut() {

	if(document.cookie.indexOf('sessionEndTimeLogOut=expireC') > -1){
		var intervalId = setInterval(function() {
			//console.log("testTimeout");
			checkIfExpired();
		}, 2000);
	}

	function checkIfExpired() {

			if (document.cookie.indexOf('sessionEndTimeLogOut=expireC') == -1){
			//alert('Your session has expired');
			// When reloaded the log in icon should change from green to red
			$(".endsessionmessagebox").css("display","block");
			//processLogout();
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
          closeWindows();
          closeSelect();
          showSaveButton();
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
function findfilevers(filez,cfield,ctype,displaystate)
{
		// Iterate over elements in files array
		var foundfile=null;
		var oldfile="";
		var tab="<table class='previewTable'>";
		tab+="<thead><tr><th>Preview</th><th>Filename</th><th>Upload date</th><th colspan=2>Teacher feedback</th></tr></thead>"
		tab +="<tbody>";
		if (typeof filez !== "undefined"){
			for (var i=filez.length-1;i>=0;i--){
					if(cfield==filez[i].fieldnme){
							var filelink=filez[i].filepath+filez[i].filename+filez[i].seq+"."+filez[i].extension;
							tab+="<tr'>"

							tab+="<td>";
							// Button for making / viewing feedback - note - only button for given feedback to students.
							if (ctype == "link"){
									tab+="<a href='"+filez[i].content+"' ><button>P</button></a>";
							} else {
									tab+="<a href='"+filelink+"' ><button>P</button></a>";
							}
							tab+="</td>";
							tab+="<td>";
                            if (ctype == "link"){
                                    tab+="<span style='cursor: pointer;text-decoration:underline;'  onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);'>"+filez[i].content+"</span>";
							} else {
                                    tab+="<span onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",0);' style='cursor: pointer;text-decoration:underline;'>"+filez[i].filename+"."+filez[i].extension+"</span>";
							}
							tab+="</td><td>";
							tab+=filez[i].updtime;+"</td>";

							tab+="<td>";
							// Button for making / viewing feedback - note - only button for given feedback to students.
							if(filez[i].feedback!=="UNK"||displaystate){
									tab+="<button onclick='displayPreview(\""+filez[i].filepath+"\",\""+filez[i].filename+"\",\""+filez[i].seq+"\",\""+ctype+"\",\""+filez[i].extension+"\","+i+",1);'>Feedback</button>";
							}
							tab+="</td>";

							tab+="<td>";
							if(filez[i].feedback!=="UNK"){
									tab+=filez[i].feedback.substring(0,64)+"&#8230;";
							}else{
									tab+="&nbsp;";
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
