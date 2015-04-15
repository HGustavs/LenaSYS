//----------------------------------------------------------------------------------
// changeCSS: Changes the CSS and remembers the index of the CSS.
//            This allows us to set and remove whole CSS files
//----------------------------------------------------------------------------------
var status = 0;
function toggleloginnewpass(){

	if(status == 0){
		$("#newpassword").css("display", "block");
		$("#login").css("display", "none");
		status++;
	}
	else if(status == 1){
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
// saveDuggaResult: Saves the result of a dugga
//----------------------------------------------------------------------------------

function saveDuggaResult(citstr)
{
		citstr=querystring['moment']+" "+citstr;
		citstr=querystring['coursevers']+" "+citstr;
		citstr=querystring['cid']+" "+citstr;

		hexstr="";
		for(i=0;i<citstr.length;i++){
				hexstr+=citstr.charCodeAt(i).toString(16)+" ";
		}
		
		AJAXService("SAVDU",{answer:citstr},"PDUGGA");

		//alert("Kvitto - Duggasvar\n\n"+"\""+hexstr+"\"\n\nTeckensträngen ovan är ditt kvitto på att duggan har lämnats in.\n\nSpara kvittot på ett säkert ställe.");
		document.getElementById('kvittotext').value = "\n\""+hexstr+"\"\n\nTeckensträngen ovan är ditt kvitto på att duggan har lämnats in.\n\nSpara kvittot på ett säkert ställe.";
		showReceiptPopup();
}

function readDugga()
{
		AJAXService("GETPARAM",{},"PDUGGA");
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
		// Skips any undefined values
		if (typeof(apara[key]) != 'undefined') {
			// Handles all the individual elements in an array and adds the array as such: &key=val1,val2,val3
			if (apara[key].constructor === Array) {
				var array = [];
				for (var i = 0; i < apara[key].length; i++) {
					array.push(encodeURIComponent(htmlEntities(apara[key][i])));
				}
				para+="&"+key+"="+array;
			}
			else {
				para+="&"+key+"="+encodeURIComponent(htmlEntities(apara[key]));
			}
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
	}else if(kind=="DUGGA"){
			$.ajax({
				url: "duggaedservice.php",
				type: "POST",
				data: "opt="+opt+para,
				dataType: "json",
				success: returnedDugga
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
				data: "courseid="+querystring['cid']+"&did="+querystring['did']+"&coursevers="+querystring['coursevers']+"&moment="+querystring['moment']+"&opt="+opt+para,
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
	}
}

function processLogin(kind) {

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
					
					$("#loginbutton").click(function(){processLogout();});

					if(kind=="COURSE") AJAXService("GET",{},"COURSE")
					else if(kind=="ACCESS") AJAXService("GET",{cid:querystring['cid']},"ACCESS")
					else if(kind=="RESULT") AJAXService("GET",{cid:querystring['cid']},"RESULT")
					else if(kind=="DUGGA") AJAXService("GET",{cid:querystring['cid']},"DUGGA")
					else if(kind=="FILE") AJAXService("GET",{cid:querystring['cid']},"FILE")
					else if(kind=="SECTION") AJAXService("get",{},"SECTION")
					else if(kind=="LINK"||kind=="PDUGGA"||kind=="CODV"){
							location.reload(); 		
					}				
				}else{
					alert("Failed to log in.");
					if(typeof result.reason != "undefined") {
						$("#login #message").html("<div class='alert danger'>" + result.reason + "</div>");
					} else {
						$("#login #message").html("<div class='alert danger'>Wrong username or password!</div>");
					}
					$("input#username").css("background-color", "#ff7c6a");
					$("input#password").css("background-color", "#ff7c6a");
				}
			},
			error:function() {
				console.log("error");
			}
		});
}

function processLogout(kind) {
	$.ajax({
		type:"POST",
		url: "../Shared/loginlogout.php",
		success:function(data) {
			$("#userName").html("Guest");

			$("#loginbutton").addClass("loggedout");
			$("#loginbutton").removeClass("loggedin");

			$("#loginbutton").click(function(){showLoginPopup();});

			if(kind=="COURSE") AJAXService("GET",{},"COURSE")
			else if(kind=="ACCESS") AJAXService("GET",{cid:querystring['cid']},"ACCESS")
			else if(kind=="RESULT") AJAXService("GET",{cid:querystring['cid']},"RESULT")
			else if(kind=="DUGGA") AJAXService("GET",{cid:querystring['cid']},"DUGGA")
			else if(kind=="FILE") AJAXService("GET",{cid:querystring['cid']},"FILE")
			else if(kind=="SECTION") AJAXService("get",{},"SECTION")
			else if(kind=="LINK"||kind=="PDUGGA"||kind=="CODV"){
					location.reload(); 		
			}
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
}

function hideLoginPopup()
{
		$("#loginBox").css("display","none");
		$("#overlay").css("display","none");
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
