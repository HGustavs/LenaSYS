/********************************************************************************

   Globals

*********************************************************************************/

var retdata;
var tokens = [];            // Array to hold the tokens.
var dmd=0;
var isdropped=false;
var genSettingsTabMenuValue = "wordlist";
var codeSettingsTabMenuValue = "implines";				

/********************************************************************************

   UI Hookups

*********************************************************************************/

function highlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
					
					$(this).addClass("imphi");	
					//	$(".impword").addClass("temphighlightclass");
					//	highlightimp(this.id);
				}
			});	
}

function dehighlightKeyword(kw)
{
			$(".impword").each(function(){
				if(this.innerHTML==kw){
					$(this).removeClass("imphi");	
					//	dehighlightimp(this.id);
				}
			});	
}

// Callback for highlighting back/forward menu item. NOT IN USE FOR NOW.
function highlightMenu(keywid)
{
		$("#"+keywid).addClass("menuhi");
}

// Callback for highlighting back/forward menu item. NOT IN USE FOR NOW
function dehighlightMenu(keywid)
{		
		$("#"+keywid).removeClass("menuhi");					
}


// Callback for highlighting important keyword
function highlightimp(keywid)
{  /* THIS FUCNTION IS NOT USED AT THE MOMENT. YOU CAN FIND THIS FUCNTIONALITY IN highlightKeyword() */
	//	$("#"+keywid).addClass("imphi");					
}

// Callback for highlighting important keyword
function dehighlightimp(keywid)
{		 /* THIS FUCNTION IS NOT USED AT THE MOMENT. YOU CAN FIND THIS FUCNTIONALITY IN dehighlightKeyword() */
	//	$("#"+keywid).removeClass("imphi");					
}

/* THIS FUNCTION IS REPLACED BY styleHeader()*/
function Bold()
{
		document.execCommand('Bold',false,'');
}



function styleHeader()
{
	if (window.getSelection) {  // all browsers, except IE before version 9
		var range = window.getSelection().toString();
            
     }
	else {
		if (document.selection.createRange) { // Internet Explorer
       		var range = document.selection.createRange().toString();
		}
	}
	document.execCommand("insertHTML", false, "<h1>"+range+"</h1>");
}



/* style codeexample in desc.box */
function styleCode(wordlist)
{	
        if (window.getSelection) {  // all browsers, except IE before version 9
            var range = window.getSelection().toString();
        }
        else {
            if (document.selection.createRange) { // Internet Explorer
                var range = document.selection.createRange().toString();
            }
        }

    	range = renderdesccode(range,wordlist);
   		document.execCommand("insertHTML", false, "<span class='codestyle "+wordlist+"'>"+range+"</span>");
}


//Used in stylebutton for codeexample-description-box. Removes all styling.
function styleReset()
{
	// get selected text
    if (document.selection) //for IE
       var container = document.selection.createRange().parentElement();
    else {
        var select = window.getSelection();
        if (select.rangeCount > 0)
          var container = select.getRangeAt(0).startContainer.parentNode;
	}

	// reset style on heading.
	if($(container).is("h1")){
		 $(container).contents().unwrap();
	}else{	
		// reset style on all other elements
		document.execCommand('removeformat', false, "");
	}

}



function insertImage(img)
{

/* This solution makes it possible to insert an image in description which are code styled... */
    document.execCommand("insertHTML", false, "<div><img src='"+img+"'></div");

    /*.. this does not. */
//    document.execCommand('insertImage', false, img);
}




document.addEventListener("drop", function(e) {
    // cancel drop
    e.preventDefault();
});
document.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();
    // get text representation of clipboard
    var text = e.clipboardData.getData("text/plain");
    // insert text manually
    document.execCommand("insertText", false, text);
});

function replaceAll(find, replace, str)
{
    return str.replace(new RegExp(find, 'g'), replace);
}



function editedDescription()
{
		// What is allowed here?
}

function Save()
{	
	// remove all formatting before saving
	$('.codestyle span').contents().unwrap();
	
	var updates = 0;
	// Get all description boxes and save their contents.
	for(i=0;i<retdata['template'][0][2];i++){
		if(retdata['box'][i][1].toUpperCase() == "DOCUMENT"){
			updates++;
			var editable=document.getElementById("box"+retdata['box'][i][0]);
			var desc=editable.innerHTML;
			AJAXService2("editDescription", desc, retdata['box'][i][0]);
		}
	}
	if(updates==0){
		warningBox("Warning!", "There's no description to save.");
	}

}
function successBox(title, text, delay, confirm, data) {
	if(title == undefined || 0 === title.length) { title = "Success!" }
	if(text == undefined || 0 === text.length) { text = "You won..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "success");
}
function warningBox(title, text, delay, confirm, data) {
	if(title == undefined) { title = "Warning!" }
	if(text == undefined || 0 === text.length) { text = "Can be dangerous..." }
	if(delay == undefined || 0 === delay.length) { delay = 0 }
	createRemoveAlert(title, text, delay, confirm, data, "warning");
}
function createRemoveAlert(title, text, delay, confirm, data, type) {
	var result = false;
	if(delay == undefined) { delay = 0 }
	var output = '<div class="alert slide-down '+type+'">';
			output += '<span class="alertCancel">x</span>';
		output += '<strong>'+title+'</strong>';
		output += '<p>'+text+'</p>';

		if(typeof confirm == 'function') {
			output += '<input type="button" id="alertSubmit" class="btn btn-login btn-next" value="Submit">';	
			output += '<input type="button" class="btn btn-forgot btn-cancel alertCancel" value="Cancel">';	
		}
	output += '</div>';
	if($(".alert").length == 0) {
		$("#feedbacksection").prepend(output);
		var elemHeight = $('.alert').height();
		
		$('.alert').css({ display: "block", height: "0px" });
		$(".alert").animate({height: elemHeight}, 300);
	}
	$.when(this).done(setTimeout(function() {
		$('html').click(function(event) {
		 	$(".alert").animate({height: 0}, 300,"linear",function() {
				$(this).remove();
			});
			$("html").unbind('click');
		});
	},- 1000));
}

function highlightop(otherop,thisop)
{
		$("#"+otherop).addClass("hi");					
		$("#"+thisop).addClass("hi");					
}

function dehighlightop(otherop,thisop)
{
		$("#"+otherop).removeClass("hi");					
		$("#"+thisop).removeClass("hi");					
}
				
function Up()
{		
		location="../DuggaSys/#sectioned?courseid="+courseid;
}				

function gotoPosition(exampleid)
{
		location="EditorV30.php?courseid="+courseid+"&exampleid="+exampleid;
}

function SkipB()
{		
		if(issetDrop("backwdrop")&&isdropped==false){
			var prevexampleid=parseInt(retdata['before'].reverse()[0][1]);
			location="EditorV30.php?courseid="+courseid+"&exampleid="+prevexampleid;
		}else if(issetDrop("backwdrop")&&isdropped==true){
				isdropped=false;
		}else{
			// get previous example in the hierarchy
			var prevexampleid=parseInt(retdata['before'].reverse()[0][1]);
			location="EditorV30.php?courseid="+courseid+"&exampleid="+prevexampleid;
		}
}

function SkipBTimeout()
{
		if(dmd==1){	
			switchDrop("backwdrop");
			isdropped=true;
		}	
}

function SkipBDown()
{		
		setTimeout(function(){SkipBTimeout();}, 1000);							
		dmd=1;
}

function SkipBUp()
{
		dmd=0;
}

function SkipF()
{
		if(issetDrop("forwdrop")&&isdropped==false){
			var nextexampleid=parseInt(retdata['after'][0][1]);
			location="EditorV30.php?courseid="+courseid+"&exampleid="+nextexampleid;
		}
		else if(issetDrop("forwdrop")&&isdropped==true){
				isdropped=false;
		}else{
			// get next example in the hierarchy
			var nextexampleid=parseInt(retdata['after'][0][1]);
			location="EditorV30.php?courseid="+courseid+"&exampleid="+nextexampleid;
		}
}
$(document).click(function (e)
{
		if(e.target.parentElement.getAttribute('id')){
			if(e.target.parentElement.getAttribute('id').toString() == "beforebutton"){
				//nothing should happend
			}else if(e.target.parentElement.getAttribute('id').toString() == "afterbutton"){
				//nothing should happend
			}
			else{
				hideDrop("backwdrop");
				hideDrop("forwdrop");
			}
		}
		else if(e.target.getAttribute('id')){
			if(e.target.getAttribute('id').toString() == "before"){
				//nothing should happend
			}
			else if(e.target.getAttribute('id').toString() == "afterbutton"){
				//nothing should happend
			}
			else{
				hideDrop("backwdrop");
				hideDrop("forwdrop");
			}
		}else{
			hideDrop("backwdrop");
			hideDrop("forwdrop");
		}	
});

function SkipFTimeout()
{
		if(dmd==1){
			switchDrop("forwdrop");
			isdropped=true;
		}
}


function SkipFDown()
{		
		setTimeout(function(){SkipFTimeout();}, 1000);							
		dmd=1;
}

function SkipFUp()
{
		dmd=0;
}

function setup()
{
	$.ajax({url: "editorService.php", type: "POST", data: "exampleid="+exampleid+"&opt=List", dataType: "json", success: returned});											
			
	if(sessionkind=="w"){
		setupEditable();					
	}
	setTheme();
	
}


function Play()
{ 
	var url = getPlaylinkURL();		
	window.open(url);
}

function Plus()
{
		var filename=encodeURIComponent(filename);
		AJAXService("createNewExample","");						
}

function chosenFile(filename,boxid)
{
		var filename=encodeURIComponent(filename);
		AJAXService("selectFile","&filename="+filename+"&boxid="+boxid);
}

function chosenWordlist(boxid)
{
		var wordlist=encodeURIComponent(document.getElementById('wordlistselect'+boxid).value);
		AJAXService("selectWordlist","&wordlistid="+wordlist+"&boxid="+boxid);
}

function addImpword()
{	
	word=document.getElementById('impwordtextbox');
		// check if UTF encoded
		for(var i=0; i<word.value.length; i++) {
			if(word.value.indexOf(' ') >=0){
				document.getElementById('impwordlistError').innerHTML = "Error. One word at a time.";
				word.style.backgroundColor="#E33D3D";
	          	return;
			}
	        if(word.value.charCodeAt(i) > 127){
				document.getElementById('impwordlistError').innerHTML = "Error. Not UTF-encoded.";
				word.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }
	    
		wordEncoded = encodeURIComponent(word.value);
		AJAXService("addImpWord","&word="+wordEncoded);
}

function delImpword()
{
		word=encodeURIComponent(document.getElementById('impwordtextbox').value);
		AJAXService("delImpWord","&word="+word);
}

function addImpline(boxid)
{
		from=document.getElementById(boxid+"from");
		to=document.getElementById(boxid+"to");
		errormsg = document.getElementById('impLinesError');
		
		// reset the color of input boxes
		to.style.backgroundColor="#FFFFFF";
		from.style.backgroundColor="#FFFFFF";  
		
		// make integers of the input
		fromValue = parseInt(from.value)
		toValue = parseInt(to.value)
		
		// error messages if NaN
		if((isNaN(fromValue))||(isNaN(toValue))){
			if(isNaN(fromValue)){
				from.style.backgroundColor="#E33D3D"; 
			}if(isNaN(toValue)){
				to.style.backgroundColor="#E33D3D"; 
			}
			errormsg.innerHTML = "Error. Not a number.";
			return;
		}
		// add important lines
		if(fromValue<=toValue){
				AJAXService("addImpLine","&boxid="+boxid+"&from="+fromValue+"&to="+toValue);
		}
		// Error message if from>to
		else{
			to.style.backgroundColor="#E42217"; 
			from.style.backgroundColor="#E42217";
			errormsg.innerHTML = "Error. Use ascending order.";
		}
}

function delImpline(boxid)
{
		from=parseInt(document.getElementById(boxid+"from").value);
		to=parseInt(document.getElementById(boxid+"to").value);
		AJAXService("delImpLine","&boxid="+boxid+"&from="+from+"&to="+to);
}

function addWordlistWord(chosenwordlist)
{ 
	var label = $( "#wordslabel").val();
	
		word=document.getElementById('wordlisttextbox');
		// check if UTF encoded
		for(var i=0; i<word.value.length; i++) {
			if(word.value.indexOf(' ') >=0){
				document.getElementById('wordlistError').innerHTML = "Error. One word at a time.";
				word.style.backgroundColor="#E33D3D";
	          	return;
			}
	        if(word.value.charCodeAt(i) > 127){
				document.getElementById('wordlistError').innerHTML = "Error. Not UTF-encoded.";
				word.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }   
		encodedWord=encodeURIComponent(word.value);

		AJAXService("addWordlistWord","&wordlist="+chosenwordlist+"&word="+encodedWord+"&label="+label);
}

function delWordlistWord(chosenwordlist)
{
		word=encodeURIComponent(document.getElementById('wordlisttextbox').value);
		AJAXService("delWordlistWord","&wordlist="+chosenwordlist+"&word="+word);
}

function newWordlist()
{		
		wordlist=document.getElementById('wordlisttextbox');

		// check if UTF encoded
		for(var i=0; i<wordlist.value.length; i++) {
	        if(wordlist.value.charCodeAt(i) > 127){
				document.getElementById('wordlistError').innerHTML = "Error. Not UTF-encoded.";
				wordlist.style.backgroundColor="#E33D3D";
	          	return;
	        }
	    }
		wordlistEncoded = encodeURIComponent(wordlist.value);
		AJAXService("newWordlist","&wordlistname="+wordlistEncoded);
}
function delWordlist(wordlist){
{}
		AJAXService("delWordlist","&wordlistid="+wordlist);
}
				
function selectWordlistWord(word)
{
		document.getElementById('wordlisttextbox').value=word;
}

function selectImpWord(word)
{
		document.getElementById('impwordtextbox').value=word;
}

function selectImpLines(word)
{		
		lines=word.split(",");
		if(lines.length=3){
				document.getElementById(lines[0]+'from').value=lines[1];
				document.getElementById(lines[0]+'to').value=lines[2];
		}
}

// Function to return the fully url-playlink that is inserted
function getPlaylinkURL()
{
	var currentUrl = window.location.pathname.split('/');
	var directories = "";
	
	if(document.getElementById('playlink') != null){
		var link = document.getElementById('playlink').value;
	}else{
		var link = retdata['playlink'];
	}
	// Get the names of the current directories in url
	for(i=1; i<currentUrl.length-1; i++){
		directories += currentUrl[i]+"/";
	}
	return "http://"+location.hostname+":"+location.port+"/"+directories+link;	
}
// set playlink into database
function setPlayLinkURL()
{
	encodedplaylink=encodeURIComponent(document.getElementById('playlink').value);	
	AJAXService("editPlaylink","&playlink="+encodedplaylink);
}

// function to check the if the url of playlink exists
function checkPlaylinkURL(url, callback)
{
	if(document.getElementById('playlink')){
		var playlink = document.getElementById('playlink').value;
	}
	else{
		var playlink = retdata['playlink'];
	}
	if(playlink==""){
		callback(false);
		return;
	}
		
	// code for IE7+, Firefox, Chrome, Opera, Safari
	if (window.XMLHttpRequest){
		var xmlhttp=new XMLHttpRequest();
	 }
	 else{ // code for IE6, IE5
	 	var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.open('GET', url, true);  			
	xmlhttp.send(null);	

	xmlhttp.onreadystatechange = function() {
		// readyState 4 = the url has been fully loaded. status 404 = url doesn't exists.
	    if (xmlhttp.readyState==4) {
	    	if(xmlhttp.status == "404"){
	    		if (typeof callback == "function"){
	    			callback(false);
	    		}
	    	}else{
	    		if (typeof callback == "function"){
	    			callback(true);
	    		}
	    	} 
	    }
	}	
}
// If playlink is changed this method will be called.
function changedPlayLink()
{
	var url = getPlaylinkURL();

/* A callback function has to be used here because it takes some times to load the url 
  		when checking for errors. */
	checkPlaylinkURL(url,
		function(status) {
			if(status){
				var playbutton=document.getElementsByClassName('playbutton');
				for(var i=0; i<playbutton.length; i++){
					playbutton[i].childNodes[0].style.opacity="1";
					playbutton[i].onclick=function(){Play();};
				}
				setPlayLinkURL();
				var span = document.getElementById("playlinkErrorMsg");
				span.style.display = "none";
			}else{
				var playbutton=document.getElementsByClassName('playbutton');
				for(var i=0; i<playbutton.length; i++){
					playbutton[i].childNodes[0].style.opacity="0.2";
					playbutton[i].onclick=function(){};
				}
				var span = document.getElementById("playlinkErrorMsg");
				span.innerHTML = "Error. This link is invalid.";
				span.style.display = "block";
			}
  		}
	);		
}


/********************************************************************************

   UI Rendering Code

*********************************************************************************/

/*	
function sendOut(kind, sectid)
{
			// Either move section or example one step up / down / delete or 
			if(kind=='UP'){
					if(pos==-1){
							AJAXServiceSection("sectionUp","&sectid="+sectid);		
					}else{
							AJAXServiceSection("exampleUp","&sectid="+sectid);
					}
			}else if(kind=='DO'){
					if(pos==-1){
							AJAXServiceSection("sectionDown","&sectid="+sectid);		
					}else{
							AJAXServiceSection("exampleDown","&sectid="+sectid);
					}
			}else if(kind=='PL'){
					if(pos==-1){
							AJAXServiceSection("exampleNewSection","&sectid="+sectid);
					}else{
							AJAXServiceSection("exampleNew","&sectid="+sectid);
					}
			}else if(kind=='PP'){
					location="EditorV30.php?courseid="+courseID+"&sectionid="+sectid+"&version="+vers+"&position="+pos;						
			}else if(kind=='MI'){
					if(pos==-1){
							AJAXServiceSection("sectionDel","&sectid="+sectid);					
					}else{
							AJAXServiceSection("exampleDel","&sectid="+sectid);					
					}
			}
			
			return false;
}
*/			

function displayPlaylink(){
	genSettingsTabMenuValue = "playlink";
	str="<ul class='settingsTabMenu settingsTabMenuStyle'>";
		str+="<li onclick='displayWordlist();'>Wordlist</li>";
		str+="<li class='activeSetMenuLink'>General</li>";
		str+="<li onclick='displayTemplates();'>Templates</li>";
	str+="</ul>";
				
	str+="<br/>Insert local url-adress on the row below:<br/>Play Link: <input type='text' size='32' id='playlink' onblur='changedPlayLink();' value='"+retdata['playlink']+"' />";
	str+="<span id='playlinkErrorMsg' class='playlinkErrorMsgStyle'></span>";
	str+="<br/><br/>Check box to open the example for public:";
	var test = retdata['public'][0];
			//alert(test);
			if(test == 0){
				str+="<input type='checkbox' id='checkbox' onChange='changedSecurity();'/>"
				//alert("not checked");
		//		var cb =  document.getElementById('checkbox');
		//		alert(cb.checked);
			}else if ( test == 1){
				str+="<input type='checkbox' checked id='checkbox' onChange='changedSecurity();'/>"
				//alert("checked");
		//		var cb =  document.getElementById('checkbox');
		//		alert(cb.checked);
				//cb.checked="checked";
			}
//	str+="<input type='checkbox' id='checkbox' onChange='changedSecurity();'/>"
	docurec=document.getElementById('docudrop');
	docurec.innerHTML=str;
}
function displayTemplates()
{
	genSettingsTabMenuValue = "templates";
	str="<ul class='settingsTabMenu settingsTabMenuStyle'>";
		str+="<li onclick='displayWordlist();'>Wordlist</li>";
		str+="<li onclick='displayPlaylink()'>General</li>";
		str+="<li class='activeSetMenuLink'>Templates</li>";
	str+="</ul>";
	str+="<h1>Pick a template for your example!</h1>";
	str+="<div class='templateicon' onclick='changetemplate(\""+'1'+"\");'><img class='templatethumbicon wiggle' src='new icons/template1_butt.svg' /></div>";
	str+="<div class='templateicon' onclick='changetemplate(\""+'2'+"\");'><img class='templatethumbicon wiggle' src='new icons/template2_butt.svg' /></div>";
	str+="<div class='templateicon' onclick='changetemplate(\""+'3'+"\");'><img class='templatethumbicon wiggle' src='new icons/template3_butt.svg' /></div>";
	str+="<div class='templateicon' onclick='changetemplate(\""+'4'+"\");'><img class='templatethumbicon wiggle' src='new icons/template4_butt.svg' /></div>";
	str+="<div class='templateicon' onclick='changetemplate(\""+'5'+"\");'><img class='templatethumbicon wiggle' src='new icons/template5_butt.svg' /></div>";

		
	docurec=document.getElementById('docudrop');
	docurec.innerHTML=str;
}
function displayWordlist(){
	genSettingsTabMenuValue = "wordlist";
	str="<ul class='settingsTabMenu settingsTabMenuStyle'>";
		str+="<li class='activeSetMenuLink'>Wordlist</li>";
		str+="<li onclick='displayPlaylink();'>General</li>";
		str+="<li onclick='displayTemplates();'>Templates</li>";
	str+="</ul>";
	

	// str+="<br/>Selected Wordlist: <br/><select id='wordlistselect' onchange='chosenWordlist();' >";
				// for(i=0;i<retdata['wordlists'].length;i++){
						// if(retdata['wordlists'][i]==retdata['chosenwordlist']){
								// str+="<option selected='selected'>"+retdata['wordlists'][i]+"</option>";										
						// }else{
								// str+="<option>"+retdata['wordlists'][i]+"</option>";										
						// }
				// }
				// str+="</select><br/>Wordlist: "+retdata['chosenwordlist']+"<br/><select size='8' style='width:200px;'>";
				// for(i=0;i<retdata['wordlist'].length;i++){
						// if(retdata['wordlist'][i][0]==retdata['chosenwordlist']){
								// str+="<option onclick='selectWordlistWord(\""+retdata['wordlist'][i][1]+"\");'>"+retdata['wordlist'][i][1]+"</option>";										
						// }
				// }
				// str+="</select><br/>";
				// str+="<div id='wordlistError' class='errormsg'></div>";
				// str+="<input type='text' size='24' id='wordlisttextbox' maxlength='60' />";
				// str+="<select id='wordslabel'>";
					// str+="<option value='A'>Markup level 1??</option>";
					// str+="<option value='B'>Markup level 2??</option>";
					// str+="<option value='C'>Markup level 3??</option>";
					// str+="<option value='D'>Markup level 4??</option>";
				// str+="</select>";
				// str+="<input type='button' value='add' onclick='addWordlistWord();' />";
				// str+="<input type='button' value='del' onclick='delWordlistWord();' />";
				// str+="<input type='button' value='new' onclick='newWordlist();'' />";
				
	
			//	var chosenwordlist = getChosenwordlist(boxid);
		
			// Get the wordlist that are selected form the user, else get the first wordlist as default
				if(document.getElementById('wordlistselect')){
					var chosenwordlist=encodeURIComponent(document.getElementById('wordlistselect').value);
				}
				else{
					var chosenwordlist = retdata['wordlists'][0][0];
				}
				
				
				str+="<br/>Select wordlist to edit: <br/><select id='wordlistselect'  onchange='displayWordlist();'  >";	
				for(i=0;i<retdata['wordlists'].length;i++){
					if(retdata['wordlists'][i][0] == chosenwordlist){
						str+="<option selected='selected'  value='"+retdata['wordlists'][i][0]+"'>"+retdata['wordlists'][i][1]+"</option>";		
						var chosenwordlistname = retdata['wordlists'][i][1];
					}else{
						str+="<option value='"+retdata['wordlists'][i][0]+"'>"+retdata['wordlists'][i][1]+"</option>";										
					}
				}
				str+="</select>";
				str+="<input type='button' value='Create wordlist' onclick='newWordlist();' />";
				str+="<input type='button' value='Delete wordlist' onclick='delWordlist("+chosenwordlist+");' />";
				
				
				
				str+="<br/>Wordlist: "+chosenwordlistname+"<br/><select size='8' style='width:200px;'>";
				for(i=0;i<retdata['words'].length;i++){
					if(retdata['words'][i][0]==chosenwordlist){
						str+="<option onclick='selectWordlistWord(\""+retdata['words'][i][1]+"\");'>"+retdata['words'][i][1]+"</option>";										
					}
				}
				str+="</select>";
				

				str+"<br/>";
				str+="<div id='wordlistError' class='errormsg'></div>";
				str+="<input type='text' size='24' id='wordlisttextbox' maxlength='60' />";
				str+="<select id='wordslabel'>";
					str+="<option value='A'>Label 1</option>";
					str+="<option value='B'>Label 2</option>";
					str+="<option value='C'>Label 3</option>";
					str+="<option value='D'>Label 4</option>";
				str+="</select>";
				str+="<input type='button' value='Add' onclick='addWordlistWord("+chosenwordlist+");' />";
				str+="<input type='button' value='Del' onclick='delWordlistWord("+chosenwordlist+");' />";
				
				
				// //----------------------------------------------------
				// Fill important word list	part of document dialog
				//----------------------------------------------------
				str+="</select><br/><br/>Important Word List: <br/><select size='8' style='width:200px;'>";
				for(i=0;i<retdata['impwords'].length;i++){
						str+="<option onclick='selectImpWord(\""+retdata['impwords'][i]+"\");'>"+retdata['impwords'][i]+"</option>";										
				}
				str+="</select><br/>";
				str+="<div id='impwordlistError' class='errormsg'></div>";
				str+="<input type='text' size='24' id='impwordtextbox' maxlength='60' />";
				str+="<input type='button' value='add' onclick='addImpword();' />";
				str+="<input type='button' value='del' onclick='delImpword();'/>";													
		

				var docurec=document.getElementById('docudrop');
				docurec.innerHTML=str;
}

/********************************************************************************

   HTML freeform editing code

*********************************************************************************/

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//----------------------------------------------------------------------------------

function hideDrop(dname)
{
		var dropd=document.getElementById(dname);
		if(dropd!=null) dropd.style.display="none";							
}

//----------------------------------------------------------------------------------
// Switches Dropdown List to Visible
//----------------------------------------------------------------------------------

function switchDrop(dname)
{
		var dropd=document.getElementById(dname); 
		if(dropd.style.display=="block"){
			$( dropd ).slideUp("fast");
			//	dropd.style.display="none";							
		}else{
				hideDrop("forwdrop");
				hideDrop("backwdrop");
				hideDrop("docudrop");
				hideDrop("codedrop");
				$('#hotdogdrop').hide();
			
			$( dropd ).slideDown("fast");
			dropd.style.display="block";
		} 
}

//----------------------------------------------------------------------------------
// Reads value from Dropdown List
//----------------------------------------------------------------------------------

function issetDrop(dname)
{
		var dropd=document.getElementById(dname);
		if(dropd.style.display=="block"){
				return true;
		}else{
				return false;
		}
}

//----------------------------------------------------------------------------------
// Connects blur event to a functon for each editable element
//----------------------------------------------------------------------------------

function setupEditable()
{	
		if(sessionkind=="w"){
				var editable=document.getElementById('exampleName');
				editable.addEventListener("blur", function(){editedExamplename();}, true);
		/*
				var fditable=document.getElementById('docucontent');
				fditable.addEventListener("blur", function(){editedDescription();}, true);
		*/
		}
}
function editedExamplename()
{
		var editable=document.getElementById('exampleName');
		var examplename=dehtmlify(editable.innerHTML,true,60);
		editable.innerHTML=examplename;
		AJAXService("editExampleName","&examplename="+examplename);
}
//----------------------------------------------------------------------------------
// Removes most html tags from a string!
//----------------------------------------------------------------------------------

function dehtmlify(mainstr,ignorebr,maxlength)
{
		
		mod=0;
		outstr="";
		
		if(maxlength==0||mainstr.length<maxlength){
				ln=mainstr.length;
		}else{
				ln=maxlength;
		}
		tagstr="";
		
		for(i=0;i<ln;i++){
				currchr=mainstr.charAt(i);
				if(currchr=="<"){
						mod=1;
						tagstr="";
				}else if(mod==1&&currchr==" "){
						mod=2;
				}else if(currchr==">"){
						mod=0;
						if(tagstr=="br"||tagstr=="b"||tagstr=="strong"){
								if(tagstr=="br"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}else if(tagstr=="br/"||tagstr=="b/"||tagstr=="strong/"){
								if(tagstr=="br/"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}else if(tagstr=="/br"||tagstr=="/b"||tagstr=="/strong"){
								if(tagstr=="/br"&&ignorebr==true){
										// Ignore BR tag 
								}else{
										outstr+="<"+tagstr+">";
								}
						}
				}else{
						if(mod==0){
								outstr+=currchr;
						}else if(mod==1){
								tagstr+=currchr;
						}else if(mod==2){
								if(currchr=="/") tagstr+=currchr;
						}
				}
		}
		return outstr;
}

/********************************************************************************

   Tokenizer

*********************************************************************************/

// Token class and storage definition									
function token (kind,val,fromchar,tochar,row) {
this.kind = kind;
this.val = val;
this.from = fromchar;
this.to = tochar;
this.row = row;
}

//----------------------------------------------------------
// Store token in tokens array
// Creates a new token object using the constructor
//----------------------------------------------------------						

function maketoken(kind,val,from,to,rowno)
{
	newtoken=new token(kind,val,from,to,rowno);
	tokens.push(newtoken);
}

//----------------------------------------------------------
// Writes error from tokenizer
//----------------------------------------------------------						

function error(str,val,row)
{
	alert("Tokenizer Error: "+str+val+" at row "+row);
}

//----------------------------------------------------------
// Tokenize function 
// Tokenizer partly based on ideas from the very clever tokenizer written by Douglas Cockford
// The tokenizer is passed a string, and a string of prefix and suffix terminators
//----------------------------------------------------------						

function tokenize(instring,inprefix,insuffix)
{
// replace HTML-entities
instring = replaceAll("&lt;","<",instring);
instring = replaceAll("&gt;",">",instring);
instring = replaceAll("&amp;","&",instring);

var from;                   	// index of the start of the token.
var i = 0;                  	// index of the current character.
var length=instring.length;		// length of the string

var c;                      	// current character.
var n;                      	// current numerical value
var q;                      	// current quote character
var str;                    	// current string value.
var row=1;										// current row value

c = instring.charAt(i);
while (c) {		// c == first character in each word
		from = i;
		if (c <= ' '){																					// White space and carriage return
			  if((c=='\n')||(c=='\r')||(c =='')){
						maketoken('newline',"",i,i,row);
						str="";
            row++;
				}else{
        		str=c;
				}
				
        i++;
    		while(true){
		        c=instring.charAt(i);
						if(c>' '||!c) break;
    				if((c=='\n')||(c=='\r')||(c =='')){
                //str += c;
								maketoken('whitespace',str,from,i,row);				                
								maketoken('newline',"",i,i,row);
                str="";
								// White space Row (so we get one white space token for each new row) also increase row number
    						row++;
    				}else{
            		str += c;
    				}
            i++;
				}
				if(str!="") maketoken('whitespace',str,from,i,row);
		}else if((c >='a'&&c<='z')||(c>='A'&&c<='Z')){					// Names i.e. Text
    		str = c;      				
    		i++;
    		while(true){
        		c = instring.charAt(i);
        		if ((c >='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='_'){
            		str += c;
            		i++;
        		}else{
            		break;
        		}
    		} 
    		maketoken('name',str,from,i,row);
    }else if(c >= '0' && c <= '9'){			// Number token
        str = c;
        i++;
    		while(true){
		        c = instring.charAt(i);
            if (c < '0' || c > '9') break;
            i++;
            str+=c;
        }
        if(c=='.'){
            i++;
            str+=c;
            for(;;){
    		        c=instring.charAt(i);
                if (c < '0' || c > '9') break;
                i++;
                str+=c;
            }
        }
        if (c=='e'||c=='E') {
            i++;
            str+=c;
		        c=instring.charAt(i);
            if(c=='-'||c=='+'){
                i+=1;
                str+=c;
    		        c=instring.charAt(i);
            }
            if (c < '0' || c > '9') error('Bad Exponent in Number: ',str,row);
            do {
                i++;
                str+=c;
    		        c=instring.charAt(i);
            }while(c>='0'&&c<='9');
        }
        if (c>='a'&&c<='z'){
            str += c;
            i += 1;
            error('Bad Number: ',str,row);
        }
        n=+str;
        if(isFinite(n)){
						maketoken('number',n,from,i,row);		            		
        }else{
            error('Bad Number: ',str,row);
        }
    }else if(c=='\''||c=='"'){	   // String .. handles c style breaking codes. Ex: "elem" or "text"
        str='';
        q=c;
        i++;
    		while(true){
		        c=instring.charAt(i);
            if (c<' '){
        				if((c=='\n')||(c=='\r')||(c == '')) row++; 	// Add row if this white space is a row terminator				 																						
            		error('Unterminated String: ',str,row);		
            		break;                		
            }

            if (c==q) break;

            if (c=='\\'){
                i += 1;
                if (i >= length) {
                		error('Unterminated String: ',str,row);		
                		break;                		
                }
    		        c=instring.charAt(i);
                
                if(c=='b'){ c='\b'; break; }
                if(c=='f'){ c='\f'; break; }
                if(c=='n'){ c='\n'; break; }
                if(c=='r'){ c='\r'; break; }
                if(c=='t'){ c='\t'; break; }
                if(c=='u'){
                    if (i >= length) {
		             	error('Unterminated String: ',str,row);		
		             	break;                		
                    }
                    c = parseInt(this.substr(i + 1, 4), 16);
                    if (!isFinite(c) || c < 0) {
		                		error('Unterminated String: ',str,row);		
		                		break;                		
                    }
                    c = String.fromCharCode(c);
                    i+=4;
                    break;		                    
                }
            }
            str += c;
            i++;
        }
        i++;
        maketoken('string',c+str+c,from,i,row);
        c=instring.charAt(i);

    }else if (c=='/'&&instring.charAt(i+1)=='/'){	// Comment of // type ... does not cover block comments
        i++;
        str=c; 
    		while(true){
		        c=instring.charAt(i);
            if (c=='\n'||c=='\r'||c=='') {
                row++;
                break;
            }else{
                str+=c;                
            }
            i++;
        }	
				maketoken('rowcomment',str,from,i,row);
				/* This does not have to be hear because a newline creates in coderender function 
				maketoken('newline',"",i,i,row); */													                
    }else if (c=='/'&&instring.charAt(i+1)=='*'){		// Block comment of /* type
        i++;
    		str=c; 
    		while(true){
		        c=instring.charAt(i); 
            if ((c=='*'&&instring.charAt(i+1)=='/')||(i==length)) {
                str+="*/"
                i+=2;
  		        c=instring.charAt(i); 
                break;
            }	
            if (c=='\n'||c=='\r'||c=='') { 
            	// don't make blockcomment or newline if str is empty
            	if(str != ""){
            		maketoken('blockcomment',str,from,i,row);
					maketoken('newline',"",i,i,row);
            		row++;
                	str="";
            	}
            }else{ 
                str+=c;                
            }
            i++;
        }	
      	  	maketoken('blockcomment',str,from,i,row);
		}else if(inprefix.indexOf(c) >= 0) {											// Multi-character Operators
    		str = c;
    		i++;
    		while(true){
		        c=instring.charAt(i); 
        		if (i >= length || insuffix.indexOf(c) < 0) {
            		break;
        		}
        		str += c; 
        		i++;
    		} 
    		maketoken('operator',str,from,i,row);
		} else {																									// Single-character Operators
    		i++;  
    		maketoken('operator',c,from,i,row);
    		c = instring.charAt(i);
		}
	}
}
// function to get chosen wordlist for a specific box
function getChosenwordlist(boxid){
	var chosenwordlist = "";
	// get chosen wordlist for this box
	for(var i=0;i<retdata['box'].length;i++){
		if(retdata['box'][i][0] == boxid){
			chosenwordlist = retdata['box'][i][4];
		}
	}
	return chosenwordlist;
}
//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//----------------------------------------------------------------------------------

function rendercode(codestring,boxid)
{
    var destinationdiv = "box" + boxid;
	tokens = [];
	
	important = [];
	for(var i=0;i<retdata.impwords.length;i++){
		important.push(retdata.impwords[i]);		
	}
	
	var chosenwordlist = getChosenwordlist(boxid);
	keywords=[];
	for(var i=0;i<retdata['words'].length;i++){
		if(retdata['words'][i][0]==chosenwordlist){
			temp=[retdata['words'][i][1],retdata['words'][i][2]];
			keywords.push(temp);
		}
	}			

	improws=[];
	for(var i=0;i<retdata.improws.length;i++){
        if ((retdata['improws'][i][0]) == boxid){
       		improws.push(retdata.improws[i]);
		}
	}
	tokenize(codestring,"<>+-&","=>&:");
			
	// Iterate over token objects and print kind of each token and token type in window 
	printout=document.getElementById(destinationdiv);
	str="";
	cont="";

	lineno=0;
	
	str+="<div class='normtextwrapper'>";
	
	
	pcount=0;
	parenthesis=new Array();
	bcount=0;
	bracket=new Array();
	cbcount=0;
	cbracket=new Array();

	pid="";
	
	var iwcounter=0;
	
	for(i=0;i<tokens.length;i++){
			
		tokenvalue=String(tokens[i].val);
			
		// Make white space characters
		tokenvalue=tokenvalue.replace(/ /g, '&nbsp;');
		tokenvalue=tokenvalue.replace(/\\t/g, '&nbsp;&nbsp;');
			
		if(tokens[i].kind=="rowcomment"){
			cont+="<span class='comment'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="blockcomment"){
			cont+="<span class='comment'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="string"){
			cont+="<span class='string'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="number"){
			cont+="<span class='number'>"+tokenvalue+"</span>";
		}else if(tokens[i].kind=="name"){
			var foundkey=0;
					
			for(var ind in keywords){
				word=keywords[ind][0];
				label=keywords[ind][1]
				if(word==tokenvalue){
					foundkey=1;
					break;		
				}
			}								
					
			for(var ind in important){
				word=important[ind];
				if(word==tokenvalue){
					foundkey=2;
					break;		
				}
			}
					
			if(foundkey==1){
				cont+="<span class='keyword"+label+"'>"+tokenvalue+"</span>";														
			}else if(foundkey==2){
				iwcounter++;
							
				highlightKeyword("scrollTop")
							
				cont+="<span id='IW"+iwcounter+"' class='impword' onmouseover='highlightKeyword(\""+tokenvalue+"\")' onmouseout='dehighlightKeyword(\""+tokenvalue+"\")'>"+tokenvalue+"</span>";														
			}else{
				cont+=tokenvalue;
			}
					
		}else if(tokens[i].kind=="operator"){
			if(tokenvalue=="("){
				pid="PA"+pcount+boxid; 
				pcount++;
				parenthesis.push(pid);
				cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
			}else if(tokenvalue==")"){
				pid=parenthesis.pop();
				cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
			}else if(tokenvalue=="["){
				pid="BR"+bcount;
				bcount++;
				bracket.push(pid);
				cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
			}else if(tokenvalue=="]"){
				pid=bracket.pop();
				cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
			}else if(tokenvalue=="{"){
				pid="CBR"+cbcount+boxid;
					cbcount++;
					cbracket.push(pid);
					cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
				}else if(tokenvalue=="}"){
					pid=cbracket.pop();
					cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
				}else{
					cont+="<span class='oper'>"+tokenvalue+"</span>";										
				}
		}else{
			cont+=tokenvalue;
		}
				// tokens.length-1 so the last line will be printed out
		if(tokens[i].kind=="newline" || i==tokens.length-1){  
			// Prevent empty lines to be printed out
			if(cont != ""){
				
				// count how many linenumbers that'll be needed
				lineno++;

			// Print out normal rows if no important exists
				if(improws.length==0){
					str+="<div class='normtext'>"+cont+"</div>";
				}else{	
					// Print out important lines
					for(var kp=0;kp<improws.length;kp++){
						if(lineno>=parseInt(improws[kp][1])&&lineno<=parseInt(improws[kp][2])){
							str+="<div class='impo'>"+cont+"</div>";
							break;
						}else{
							if(kp == (improws.length-1)){
								str+="<div class='normtext'>"+cont+"</div>";
							}
						}						
					}
				}	
				cont="";
			}	
		}
	}
	str+="</div>";
		
		// Print out rendered code and border with numbers
	printout.innerHTML = createCodeborder(lineno,improws) + str;
		
	linenumbers();
}

// function to create a border with line numbers
function createCodeborder(lineno,improws){
	var str="<div class='codeborder'>";
	var x= 0;
	
	for(var i=1; i<=lineno; i++){
		// Print out normal numbers
		if(improws.length ==0){
			str+="<div class='no'>"+(i)+"</div>";	
		}else{
			// Print out numbers for an important row
			for(var kp=0;kp<improws.length;kp++){
				if(i>=parseInt(improws[kp][1])&&i<=parseInt(improws[kp][2])){
					str+="<div class='impono'>"+(i)+"</div>";	
					break;	
					
				}else{
					if(kp==(improws.length-1)){
						str+="<div class='no'>"+(i)+"</div>";					
					}
				}			
			}
		}
	}
	
	str+="</div>";
	return str;
}

function renderdesccode(codestring,wordlist){
	tokens = [];

	important = [];
	for(var i=0;i<retdata.impwords.length;i++){
		important.push(retdata.impwords[i]);	
	}
	
	

	keywords=[];
	for(var i=0;i<retdata['words'].length;i++){
		if(retdata['words'][i][0]==wordlist){
			temp=[retdata['words'][i][1],retdata['words'][i][2]];
			keywords.push(temp);
		}
	}

	
	tokenize(codestring,"<>+-&","=>&:");
	
		str="";
		cont="";

		str+="<span class='normtext'>";
		
		pcount=0;
		parenthesis=new Array();
		bcount=0;
		bracket=new Array();
		cbcount=0;
		cbracket=new Array();

		pid="";
		
		var iwcounter=0;

		for(i=0;i<tokens.length;i++){
				
				tokenvalue=String(tokens[i].val);

				// Make white space characters
				tokenvalue=tokenvalue.replace(/ /g, '&nbsp;');
			
				if(tokens[i].kind=="rowcomment"){ 
						cont+="<span class='comment'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="blockcomment"){ 
							cont+="<span class='comment'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="string"){ 
							cont+="<span class='string'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="number"){
						cont+="<span class='number'>"+tokenvalue+"</span>";
				}else if(tokens[i].kind=="name"){
						var foundkey=0;
						
						for(var ind in keywords){
							word=keywords[ind][0];
							label=keywords[ind][1]
							if(word==tokenvalue){
									foundkey=1;
									break;		
							}
						}								
						for(var ind in important){
								word=important[ind];
								if(word==tokenvalue){
										foundkey=2;
										break;		
								}
						}
						if(foundkey==1){
								cont+="<span class='keyword"+label+"'>"+tokenvalue+"</span>";														
						}else if(foundkey==2){
								iwcounter++;
								
								highlightKeyword("scrollTop")
								
								cont+="<span id='IW"+iwcounter+"' class='impword' onmouseover='highlightKeyword(\""+tokenvalue+"\")' onmouseout='dehighlightKeyword(\""+tokenvalue+"\")'>"+tokenvalue+"</span>";														
						}else{
								cont+=tokenvalue;
						}
						
				}else if(tokens[i].kind=="operator"){
						
						cont+="<span class='oper'>"+tokenvalue+"</span>";	
					
					/* OUTCOMMENT BECAUSE THIS WILL BE DIFFICULT TO FIX FOR MORE THAN 1 DESCRIPTION BOX 
						if(tokenvalue=="("){
								pid="PA2"+pcount;
								pcount++;
								parenthesis.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue==")"){
								pid=parenthesis.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else if(tokenvalue=="["){
								pid="BR2"+bcount;
								bcount++;
								bracket.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue=="]"){
								pid=bracket.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else if(tokenvalue=="{"){
								pid="CBR2"+cbcount;
								cbcount++;
								cbracket.push(pid);
								cont+="<span id='"+pid+"' class='oper' onmouseover='highlightop(\"P"+pid+"\",\""+pid+"\");' onmouseout='dehighlightop(\"P"+pid+"\",\""+pid+"\");'>"+tokenvalue+"</span>";												
						}else if(tokenvalue=="}"){
								pid=cbracket.pop();
								cont+="<span id='P"+pid+"' class='oper' onmouseover='highlightop(\""+pid+"\",\"P"+pid+"\");' onmouseout='dehighlightop(\""+pid+"\",\"P"+pid+"\");'>"+tokenvalue+"</span>";																						
						}else{	
								cont+="<span class='oper'>"+tokenvalue+"</span>";		
						}
					*/	
				}else{
						cont+=tokenvalue;
				}
				
				if(tokens[i].kind=="newline"){
					
					str+=cont+"<br>";
					cont="";
				} // no breakrow on last row in description.
				if(i==tokens.length-1){
					str+=cont;
				}
		}
		str+="</span>";
		return str;
	
}

function linenumbers()
{	
	if(localStorage.getItem("linenumbers") == "false"){	
		$( "#numberbutton img" ).attr('src', 'new icons/noNumbers_button.svg'); 
		$( "#numberbuttonMobile img" ).attr('src', 'new icons/hotdogTabButton2.svg');
		$( ".codeborder" ).css("display","none");	
	}
}
function fadelinenumbers()
{
	if ( $( ".codeborder" ).is( ":hidden" ) ) {
		$( ".codeborder" ).fadeIn( "slow" );
		$( "#numberbuttonMobile img" ).attr('src', 'new icons/hotdogTabButton.svg');
		$( "#numberbutton img" ).attr('src', 'new icons/numbers_button.svg');
		localStorage.setItem("linenumbers", "true");					  
	}else{
		$( ".codeborder" ).fadeOut("slow");
		$( "#numberbuttonMobile img" ).attr('src', 'new icons/hotdogTabButton2.svg');
		$( "#numberbutton img" ).attr('src', 'new icons/noNumbers_button.svg');
		localStorage.setItem("linenumbers", "false");
	 }
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





/* HIDE/SHOW DROP MENUS --> START*/

/* Open general settings */
$(function() {
	$("#hidesettings").click(function(event){
		$('.docudrop').slideToggle("fast");
		$('#themedrop').hide();
		$('#hotdogdrop').hide();
		$('.codedrop').hide();
		$('.imgdrop').hide();
		$('#themedrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		return false;
	}); // Hide docudrop if clicking outside
	$(document).click(function(event) {
		$('#docudrop').slideUp('fast');
	});// Prevent hide event if user is clicking on docudrop.
	$(".docudrop").click(function(event) {
   		event.stopPropagation();
	});
	
});

/* Open themes */
$(function() {
	$("#hidetheme").click(function(event){
		$('#themedrop').slideToggle("fast");
		$('#hotdogdrop').hide();
		$('.docudrop').hide();
		$('.codedrop').hide();
		$('.imgdrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		return false;
	});	// Stop themedrop to hide if clicking on it.
	$(document).click(function(event) {
		if(event.target.id ==  'themedrop'){
			event.stopPropagation();
		}else if(($(event.target).parents('#themedrop').size() >0)){
			event.stopPropagation();
		}else{
			$('#themedrop').slideUp('fast');
		}
	});
});

/* OPEN/HIDE hotdog menu */
$(function() {
	$('#hidehotdog').click(function() {
		$('#hotdogdrop').slideToggle("fast");
		$('.docudrop').hide();
		$('.codedrop').hide();
		$('.themedrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		$('.imgdrop').hide();
		return false;
	}); /* Prevent hotdog menu to hide while clicking on it */
	$(document).click(function(event) {
		if($(event.target).parents('#hotdogdrop').size() >0){
			event.stopPropagation();
		}else{
			$('#hotdogdrop').slideUp('fast');
		}
	});
});


$(function() {
	$(document).click(function(event) {
		if(event.target.id ==  'themedrop'){
			event.stopPropagation();
		}else if(($(event.target).parents('#themedrop').size() >0)){
			event.stopPropagation();
		}else{
			$('#themedrop').slideUp('fast');
		}
	});
});


// Stop themedrop to hide if clicking on it,clicking on contenteditable element or clicking on imgdropbutton.
$(function() {
	$(document).click(function(event) {
		if(event.target.id ==  'imgdrop'){
			event.stopPropagation();
		}else if(($(event.target).parents('#imgdrop').size() >0)){
			event.stopPropagation();
		}else if(($(event.target).parents('.imgdropbutton').size() >0)){
			event.stopPropagation();
		
		}else if($(event.target).attr("contenteditable") || $(event.target).parents().attr("contenteditable")){
			event.stopPropagation();
		 }else{
			$('#imgdrop').slideUp('fast');
		}
	});
});



$(function() { /* Prevent codedrops to hide while clicking on it  */
	$(document).click(function(event) {
		if($(event.target).is('.codedrop')){
			event.stopPropagation();
		}else if(($(event.target).parents('.codedrop').size() >0)){
			event.stopPropagation();
		}else if(($(event.target).parents('.codedropbutton').size() >0)){
			event.stopPropagation();
		}else if(($(event.target).parents('.settingsTabMenu').size() >0)){
			event.stopPropagation();
		}else{
			$('.codedrop').slideUp('fast');
		}
	});
});

/* HIDE/SHOW DROP MENUS --> STOP*/




function Theme()
{
		displayThemes();		
}

function displayThemes()
{
	str="";
	str+="<h2>Choose a theme!</h2>";
	str+="<div class='themeicon' onclick='selectTheme(\""+'black'+"\");'>  <img src='new icons/theme_black.svg' /><span>Black<span/></div>";
	str+="<div class='themeicon' onclick='selectTheme(\""+'white'+"\");'>  <img src='new icons/theme_white.svg' /><span>White<span/></div>";
	str+="<div class='themeicon' onclick='selectTheme(\""+'colorblind'+"\");'> <img src='new icons/theme_blind.svg' /><span>Colorblind<span/></div>";
	docurec=document.getElementById('themedrop');
	docurec.innerHTML=str;
}

function selectTheme(color)
{
	localStorage.setItem("storedTheme", color);
	setTheme();
	hideDrop("themedrop");
}

function setTheme()
{
	var storedTheme = localStorage.getItem("storedTheme");
	if(storedTheme != "" || storedTheme != null){
		var colorTheme = storedTheme;

		if(colorTheme === "black"){
			//make things black
			changeCSS("css/blackTheme.css", 2);
			//alert("black");
			
		}
		
		else if(colorTheme === "white"){
			//make things white
			changeCSS("css/whiteTheme.css", 2);
			//alert("white");
			
		}
		
		else if(colorTheme === "colorblind"){
			//colors that makes it easier for colorblind
			changeCSS("css/colorblind.css", 2);
			//alert(colorTheme);
		}
		else{
			//theme doesnt exist, make default
			selectTheme("black");
		}
	}
}



function disableResponsive(command)
{

    if(command != "" || command != null){

        if(command === "no"){
            //enable responsive css - Not currently used
            changeCSS("css/responsive.css", 3);

        }

        else if(command === "yes"){
            //disable responsive css
            changeCSS("css/blank.css", 3);


        }

        else{
            alert("Error");
        }
    }
}


function changedSecurity(){
	var cb = document.getElementById('checkbox');
	var option = 0;
	if(cb.checked){
		option = 1;
	}
	
	AJAXService("updateSecurity","&public="+ option);
}

function mobileTheme(id){
	if ($(".mobilethemebutton").is(":hidden")){
		  $(".mobilethemebutton").css("display","table-cell");

	}
	else{
		  $(".mobilethemebutton").css("display","none");
	}
}

//Set the editing properties for mobile and desktop version
function setEditing(){
	var	hotdog = document.getElementById("hidehotdog");
	var	isDesktop = $(hotdog).is(":hidden");
	if(isDesktop){
		 $("*[contenteditable]").attr("contenteditable","true"); 
		 $(".tooltip").css("display", "block");
	}else{ 
		$("*[contenteditable]").attr("contenteditable","false"); 
		$(".tooltip").css("display", "none");
	}
}

// * Menutext * //
$(window).resize(function(){	
	var width = $(window).width();
	var fontsize = $(window).width()*0.018;
	if(fontsize <= 16){
		fontsize = 16;
	}else if(fontsize >= 24){
		fontsize = 24;
	}
	$('.menutext').css('fontSize', fontsize);
})

//Retrive height for buliding menu.
$(window).load(function() {
	var windowHeight = $(window).height();
	textHeight= windowHeight-50;
	$("#table-scroll").css("height", textHeight);
});

$(window).resize(function() {
	var windowHeight = $(window).height();
	textHeight= windowHeight-50;
	$("#table-scroll").css("height", textHeight);
	
	
	// Keep right margin to boxes when user switch from mobile version to desktop version
	if($(".buttomenu2").height() == null){
		var boxmenuheight = 0;
	}else{
		var boxmenuheight= $(".buttomenu2").height();
	}
	$(".box").css("margin-top", boxmenuheight);
	
	
	
	
});

//Set the editing properties for mobile and desktop version
$(window).resize(function() {
	setEditing();
	
	// Hide tooltip in mobile version
	if($(window).width() <= 1100){
		$(".tooltip").css("display", "none");
	}else{
		$(".tooltip").css("display", "block");
	}
});


