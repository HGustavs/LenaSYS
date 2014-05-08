/********************************************************************************

   Globals

*********************************************************************************/

var retdata;
var tokens = [];            // Array to hold the tokens.
var dmd=0;
var isdropped=false;
var tabmenuvalue = "wordlist";				

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

// Callback for highlighting back/forward menu item
function highlightMenu(keywid)
{
		$("#"+keywid).addClass("menuhi");
}

// Callback for highlighting back/forward menu item
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

/* THIS FUNCTION IS REPLACED BY stylecode()*/
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
	
	/* This solution sets heading on the whole row*/
//    document.execCommand('formatBlock', false, "H1");
}



/* style codeexample in desc.box */
function styleCode()
{
        if (window.getSelection) {  // all browsers, except IE before version 9
            var range = window.getSelection().toString();
            
        }
        else {
            if (document.selection.createRange) { // Internet Explorer
                var range = document.selection.createRange().toString();

            }
        }
        
    	 range = renderdesccode(range);
    //    document.execCommand("insertHTML",false,rendercode2(range,"docucontent"));
		document.execCommand("insertHTML", false, "<span class='codestyle'>"+range+"</span>");
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
	var editable=document.getElementById('docucontent');
	var desc=editable.innerHTML;
					AJAXService2("editDescription", desc);
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
				
function Code()
{
		switchDrop("codedrop");
}

function Images()
{
    switchDrop("imgdrop");
}

function generalSettings()
{
		switchDrop("docudrop");
}
function Up()
{						
		location="../DuggaSys/Sectioned.php?courseid="+courseID+"&vers="+version;
}				

function gotoPosition(poz)
{
		location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+poz;
}

function SkipB()
{		
		if(issetDrop("backwdrop")&&isdropped==false){
			position=parseInt(position)-1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
		}else if(issetDrop("backwdrop")&&isdropped==true){
				isdropped=false;
		}else{
				position=parseInt(position)-1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
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
				position=parseInt(position)+1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
		}
		else if(issetDrop("forwdrop")&&isdropped==true){
				isdropped=false;
		}else{
				position=parseInt(position)+1;
				location="EditorV30.php?courseid="+courseID+"&sectionid="+sectionID+"&version="+version+"&position="+position;
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
		$.ajax({url: "editorService.php", type: "POST", data: "coursename="+courseID+"&version="+version+"&sectionid="+sectionID+"&position="+position+"&opt=List", dataType: "json", success: returned});											
		
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

function chosenFile(filename)
{
		var filename=encodeURIComponent(filename);
		AJAXService("selectFile","&filename="+filename);
}

function chosenWordlist()
{
		var wordlist=encodeURIComponent(document.getElementById('wordlistselect').value);
		AJAXService("selectWordlist","&wordlist="+wordlist);
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

function addImpline()
{
		from=document.getElementById('implistfrom');
		to=document.getElementById('implistto');
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
				AJAXService("addImpLine","&from="+fromValue+"&to="+toValue);
		}
		// Error message if from>to
		else{
			to.style.backgroundColor="#E42217"; 
			from.style.backgroundColor="#E42217";
			errormsg.innerHTML = "Error. Use ascending order.";
		}
}

function delImpline()
{
		from=parseInt(document.getElementById('implistfrom').value);
		to=parseInt(document.getElementById('implistto').value);
		AJAXService("delImpLine","&from="+from+"&to="+to);
}

function addWordlistWord()
{ 
	var label = $( "#wordslabel" ).val();
	
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
	    wordlist=encodeURIComponent(retdata['chosenwordlist']);		
		encodedWord=encodeURIComponent(word.value);

		AJAXService("addWordlistWord","&wordlist="+wordlist+"&word="+encodedWord+"&label="+label);
}

function delWordlistWord()
{
		word=encodeURIComponent(document.getElementById('wordlisttextbox').value);
		wordlist=encodeURIComponent(retdata['chosenwordlist']);
		AJAXService("delWordlistWord","&wordlist="+wordlist+"&word="+word);
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
		AJAXService("newWordlist","&wordlist="+wordlistEncoded);
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
		if(lines.length=2){
				document.getElementById('implistfrom').value=lines[0];
				document.getElementById('implistto').value=lines[1];
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

function returned(data)
{
		retdata=data;
				//----------------------------------------------------
		// Populate interface with returned data (all relevant data is returned)
		//----------------------------------------------------

		// Make before dropdown
		str="<div class='dropdownback dropdownbackStyle'>Skip Backward</div>";
		for(i=0;i<data['before'].length;i++){
				str+="<span id='F"+data['before'][i][1]+"' onmouseover='highlightMenu(\"F"+data['before'][i][1]+"\");' onmouseout='dehighlightMenu(\"F"+data['before'][i][1]+"\");' onclick='gotoPosition(\""+data['before'][i][1]+"\")' class='dropdownitem dropdownitemStyle'>"+data['before'][i][0]+"</span>";
		}
		var before=document.getElementById('backwdrop');
		before.innerHTML=str;
		
		// If we have no items before the current item - hide before button and dropdown
		var before=document.getElementsByClassName('beforebutton');
		if(data['before'].length==0){
			for(var i=0; i<before.length; i++){
				before[i].childNodes[0].style.opacity="0.2";
				before[i].onclick="";
			}
		}else{
			for(var i=0; i<before.length; i++){
				before[i].style.opacity="1";	
		//		before[i].onclick ="SkipF();";													
			}	
		}
		

		// If we have no items before the current item - hide before button and dropdown
		var after=document.getElementsByClassName('afterbutton');
		if(data['after'].length==0){
			for(var i=0; i<after.length; i++){
				after[i].childNodes[0].style.opacity="0.2";
				after[i].onclick="";
			}
		}
		
		
	
			var url = getPlaylinkURL();
			var playbutton=document.getElementsByClassName('playbutton');
			checkPlaylinkURL(url,
				function(status) { 
					if(status){ 
						for(var i=0; i<playbutton.length; i++){
							playbutton[i].childNodes[0].style.opacity="1";
							playbutton[i].onclick=function(){Play();};
						}			
					}else{
						for(var i=0; i<playbutton.length; i++){
							playbutton[i].childNodes[0].style.opacity="0.2";
							playbutton[i].onclick=function(){};
						}
					}
				}
			);
	
		
		// Playbutton Either Hidden or Shown depending on if there is any play link or not
	/*	var playbutton=document.getElementsByClassName('playbutton');
		if(data['playlink']==""){
			for(var i=0; i<playbutton.length; i++){
				playbutton[i].childNodes[0].style.opacity="0.2";
				playbutton[i].onclick=function(){};
			}
		}else{
			for(var i=0; i<playbutton.length; i++){
				playbutton[i].childNodes[0].style.opacity="1";
				playbutton[i].onclick=function(){Play();};
			}									
		}
	*/	
		// Make after dropdown
		str="<div class='dropdownback dropdownbackStyle'>Skip Forward</div>";
		for(i=0;i<data['after'].length;i++){
				str+="<span id='F"+data['after'][i][1]+"' onmouseover='highlightMenu(\"F"+data['after'][i][1]+"\");' onmouseout='dehighlightMenu(\"F"+data['after'][i][1]+"\");' onclick='gotoPosition(\""+data['after'][i][1]+"\")' class='dropdownitem dropdownitemStyle'>"+data['after'][i][0]+"</span>";
		}
		var after=document.getElementById('forwdrop');
		after.innerHTML=str;

		// Fill Description
		var docuwindow=document.getElementById("docucontent");
		
		// replacing span&nsbp; so it is perceived as a tagname for codestyle
	
	/* START code for first function made START */
	//	var desc = data['desc'];
	//	desc = replaceAll("<span&nbsp;","<span ",data['desc']);
	//	desc = replaceAll('"&nbsp;','" ', desc);
	//	desc = replaceAll('&nbsp;"',' "', desc);
	//	docuwindow.innerHTML = desc;
	/* 	STOP */	
	
		var desc = data['desc'];
		desc = replaceAll("<span&nbsp;","<span ",desc);
		desc =  replaceAll("<img&nbsp;","<img ",desc);
		
		docuwindow.innerHTML = desc;
		
		//  Fill description with code using tokenizer.
		var cs = docuwindow.getElementsByClassName("codestyle");
		for(var i=0; i<cs.length; i++){
			desc = desc.replace(cs[i].innerHTML,renderdesccode(replaceAll("&nbsp;", " ",replaceAll("<br>","\n",cs[i].innerHTML))));
		}
		docuwindow.innerHTML = desc;
		
		
		// Fill Code Viewer with Code using Tokenizer
		rendercode(data['code'],"infobox");

		// Fill Section Name and Example Name
		var examplenme=document.getElementById('exampleName');
		examplenme.innerHTML=data['examplename'];
		var examplesect=document.getElementById("exampleSection");
		examplesect.innerHTML=data['sectionname'];
		
		
		if(sessionkind=="w"){
				// Fill file requester with file names
				str="";
				for(i=0;i<data['directory'].length;i++){
						if(data['directory'][i]==data['filename']){
								str+="<span class='dropdownitem dropdownitemStyle menuch' id='DDI"+i+"' onmouseover='highlightMenu(\"DDI"+i+"\");' onmouseout='dehighlightMenu(\"DDI"+i+"\");'>"+data['directory'][i]+"</span>";						
						}else{
								str+="<span class='dropdownitem dropdownitemStyle' id='DDI"+i+"' onclick='chosenFile(\""+data['directory'][i]+"\");' onmouseover='highlightMenu(\"DDI"+i+"\");' onmouseout='dehighlightMenu(\"DDI"+i+"\");'>"+data['directory'][i]+"</span>";														
						}
				}
				var filereq=document.getElementById('codedrop');
				if(filereq!=null) filereq.innerHTML=str;


            // Fill imagelist
            str="";
            for(i=0;i<data['images'].length;i++){

                    //str+="<span class='dropdownitem' id='DDII"+i+"' onclick='insertImage(\""+data['images'][i]+"\");' onmouseover='highlightMenu(\"DDII"+i+"\");' onmouseout='dehighlightMenu(\"DDII"+i+"\");'>"+data['images'][i]+"</span>";
                str+="<img id='DDII"+i+"' onclick='insertImage(\"imgupload/"+data['images'][i]+"\");' title=\""+data['images'][i]+"\" src=\"imgupload/"+data['images'][i]+"\"></img>";

            }

            var filereq=document.getElementById('imgdrop');
            if(filereq!=null) filereq.innerHTML=str;






		}
		
		//----------------------------------------------------
		// Fill wordlist part of document dialog
		//----------------------------------------------------

		if(sessionkind=="w"){
			
			// Check what tab in general settings menu should be displayed, otherwise the same tabmenu will be displayed after every update.
			if(tabmenuvalue == "wordlist"){
				displayWordlist();
			}else if(tabmenuvalue == "playlink"){
				displayPlaylink();	
			}else if(tabmenuvalue == "templates"){
				displayTemplates();
			}					
		}
}
function displayPlaylink(){
	tabmenuvalue = "playlink";
	str="<ul id='settingsTabMenu' class='settingsTabMenuStyle'>";
		str+="<li onclick='displayWordlist();'>Wordlist</li>";
		str+="<li class='activeSetMenuLink'>Playlink</li>";
		str+="<li onclick='displayTemplates();'>Templates</li>";
	str+="</ul>";
				
	str+="<br/><br/>Play Link: <input type='text' size='32' id='playlink' onblur='changedPlayLink();' value='"+retdata['playlink']+"' />";
	str+="<span id='playlinkErrorMsg' class='playlinkErrorMsgStyle'></span>";
	docurec=document.getElementById('docudrop');
	docurec.innerHTML=str;
}
function displayTemplates()
{
	tabmenuvalue = "templates";
	str="<ul id='settingsTabMenu' class='settingsTabMenuStyle'>";
		str+="<li onclick='displayWordlist();'>Wordlist</li>";
		str+="<li onclick='displayPlaylink()'>Playlink</li>";
		str+="<li class='activeSetMenuLink'>Templates</li>";
	str+="</ul>";
	str+="<h1>Pick a template for your example!</h1>";
	str+="<div class='templateicon' onmouseup='wigglepick(this);'  onclick='changeCSS(\""+'css/template1.css'+"\", 0);'><img class='templatethumbicon wiggle' src='new icons/template1_butt.svg' /></div>";
	str+="<div class='templateicon' onmouseup='wigglepick(this);' onclick='changeCSS(\""+'css/template2.css'+"\", 0);'><img class='templatethumbicon wiggle' src='new icons/template2_butt.svg' /></div>";
	str+="<div class='templateicon' onmouseup='wigglepick(this);' onclick='addTemplatebox(\""+'temp3'+"\");changeCSS(\""+'css/template3.css'+"\", 0);'><img class='templatethumbicon wiggle' src='new icons/template3_butt.svg' /></div>";
	str+="<div class='templateicon' onmouseup='wigglepick(this);' onclick='addTemplatebox(\""+'temp3'+"\");changeCSS(\""+'css/template4.css'+"\", 0);'><img class='templatethumbicon wiggle' src='new icons/template4_butt.svg' /></div>";
	str+="<div class='templateicon' onmouseup='wigglepick(this);' onclick='addTemplatebox(\""+'temp3,temp4'+"\");changeCSS(\""+'css/template5.css'+"\", 0);'><img class='templatethumbicon wiggle' src='new icons/template5_butt.svg' /></div>";

		
	docurec=document.getElementById('docudrop');
	docurec.innerHTML=str;
}
function displayWordlist(){
	tabmenuvalue = "wordlist";
	str="<ul id='settingsTabMenu' class='settingsTabMenuStyle'>";
		str+="<li class='activeSetMenuLink'>Wordlist</li>";
		str+="<li onclick='displayPlaylink();'>Playlink</li>";
		str+="<li onclick='displayTemplates();'>Templates</li>";
	str+="</ul>";
	

	str+="<br/>Selected Wordlist: <br/><select id='wordlistselect' onchange='chosenWordlist();' >";
				for(i=0;i<retdata['wordlists'].length;i++){
						if(retdata['wordlists'][i]==retdata['chosenwordlist']){
								str+="<option selected='selected'>"+retdata['wordlists'][i]+"</option>";										
						}else{
								str+="<option>"+retdata['wordlists'][i]+"</option>";										
						}
				}
				str+="</select><br/>Wordlist: "+retdata['chosenwordlist']+"<br/><select size='8' style='width:200px;'>";
				for(i=0;i<retdata['wordlist'].length;i++){
						if(retdata['wordlist'][i][0]==retdata['chosenwordlist']){
								str+="<option onclick='selectWordlistWord(\""+retdata['wordlist'][i][1]+"\");'>"+retdata['wordlist'][i][1]+"</option>";										
						}
				}
				str+="</select><br/>";
				str+="<div id='wordlistError' class='errormsg'></div>";
				str+="<input type='text' size='24' id='wordlisttextbox' maxlength='60' />";
				str+="<select id='wordslabel'>";
					str+="<option value='A'>Markup level 1??</option>";
					str+="<option value='B'>Markup level 2??</option>";
					str+="<option value='C'>Markup level 3??</option>";
					str+="<option value='D'>Markup level 4??</option>";
				str+="</select>";
				str+="<input type='button' value='add' onclick='addWordlistWord();' />";
				str+="<input type='button' value='del' onclick='delWordlistWord();' />";
				str+="<input type='button' value='new' onclick='newWordlist();'' />";
				
				//----------------------------------------------------
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
		
				//----------------------------------------------------
				// Fill important line list part of document dialog
				//----------------------------------------------------
				str+="<br/><br/>Important lines: <br/><select size='4'>"; 
				for(i=0;i<retdata['improws'].length;i++){
						str+="<option onclick='selectImpLines(\""+retdata['improws'][i]+"\");'>"+retdata['improws'][i][0]+"-"+retdata['improws'][i][1]+"</option>";										
				}
				str+="</select><br/>"
				str+="<div id='impLinesError' class='errormsg'></div>";
				str+="<input type='text' size='4' id='implistfrom' />-<input type='text' size='4' id='implistto' />";
				str+="<input type='button' value='add' onclick='addImpline();' />";
				str+="<input type='button' value='del' onclick='delImpline();' />";
				
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
		
				var fditable=document.getElementById('docucontent');
				fditable.addEventListener("blur", function(){editedDescription();}, true);
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
            }

            if (c==q) break;

            if (c=='\\'){
                i += 1;
                if (i >= length) {
                		error('Unterminated String: ',str,row);		                		
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
                    }
                    c = parseInt(this.substr(i + 1, 4), 16);
                    if (!isFinite(c) || c < 0) {
		                		error('Unterminated String: ',str,row);		                		
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
        maketoken('string',str,from,i,row);
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

//----------------------------------------------------------------------------------
// Renders a set of tokens from a string into a code viewer div
// Requires tokens created by a cockford-type tokenizer
//----------------------------------------------------------------------------------

function rendercode(codestring,destinationdiv)
{
		tokens = [];
		
		important = [];
		for(var i=0;i<retdata.impwords.length;i++){
				important.push(retdata.impwords[i]);		
		}

		keywords=[];
		for(var i=0;i<retdata.wordlist.length;i++){
				if(retdata.wordlist[i][0]==retdata.chosenwordlist){
					temp=[retdata.wordlist[i][1],retdata.wordlist[i][2]];
						keywords.push(temp);
				}
		}			
		
		improws=[];
		for(var i=0;i<retdata.improws.length;i++){
				improws.push(retdata.improws[i]);
		}
		tokenize(codestring,"<>+-&","=>&:");
				
		// Iterate over token objects and print kind of each token and token type in window 
		printout=document.getElementById(destinationdiv);
		str="";
		cont="";

		lineno=0;
		str+="<div class='normtext'>";
		
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
						cont+="<span class='string'>\""+tokenvalue+"\"</span>";
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
								pid="PA"+pcount;
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
								pid="CBR"+cbcount;
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
						lineno++;

						// Make line number										
						if(lineno<10){
								num="<span class='no'>"+lineno+"&nbsp;&nbsp;&nbsp;</span>";
						}else if(lineno>=10 && lineno<100){
								num="<span class='no'>"+lineno+"&nbsp;&nbsp;</span>";
						}else{
								num="<span class='no'>"+lineno+"&nbsp;</span>";
						}
						
						if(improws.length==0){
								str+="<div class='normtext'>";
						}else{
								for(var kp=0;kp<improws.length;kp++){
										if(lineno>=parseInt(improws[kp][0])&&lineno<=parseInt(improws[kp][1])){
												str+="<div class='impo'>";
												break;
										}else{
												str+="<div class='normtext'>";
										}						
								}
						}	
						str+=num+cont;
						cont="";
						str+="</div>";	
					}					
				}
		}
		str+="</div>";	
		printout.innerHTML=str;
		linenumbers();
}
function renderdesccode(codestring){
	tokens = [];

	important = [];
	for(var i=0;i<retdata.impwords.length;i++){
		important.push(retdata.impwords[i]);	
	}
	keywords=[];
	for(var i=0;i<retdata.wordlist.length;i++){
		if(retdata.wordlist[i][0]==retdata.chosenwordlist){
			temp=[retdata.wordlist[i][1],retdata.wordlist[i][2]];
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
							cont+="<span class='string'>\""+tokenvalue+"\"</span>";
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
		$( ".no" ).css("display","none");	
	}
}
function fadelinenumbers()
{
	if ( $( ".no" ).is( ":hidden" ) ) {
		$( ".no" ).fadeIn( "slow" );
		$( "#numberbutton img" ).attr('src', 'new icons/numbers_button.svg');
		localStorage.setItem("linenumbers", "true");					  
	}else{
		$( ".no" ).fadeOut("slow");
		$( "#numberbutton img" ).attr('src', 'new icons/noNumbers_button.svg');
		localStorage.setItem("linenumbers", "false");
	 }
}
function addTemplatebox(id)
{	
	var temps = id.split(",");
	
	
	var content = document.getElementById("div2");
	
	for(i=0; i<temps.length; i++){
		if(document.getElementById(temps[i])){
			continue;
		}
		var div = document.createElement("div");
		content.appendChild(div);
		div.id = temps[i];
		div.className = temps[i]+"Style";
		div.setAttribute("contenteditable", "true");
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

// function showhotdogmenu()
// {
// 
	// var hotdogdrop = document.getElementById("hotdogdrop");
	// if($(hotdogdrop).is(':hidden')){
		// hotdogdrop.style.display = "block";
	// }
	// else{
		// hotdogdrop.style.display = "none";	
	// }
// }

$(function() {
	$('#hidesettings').click(function() {
		$('.docudrop').slideToggle("fast");
		$('.codedrop').hide();
		$('#hotdogdrop').hide();
		$('.themedrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		return false;
	});
	$(document).click(function() {
    	$('.docudrop').slideUp('fast');
	});
	$(".docudrop").click(function(event) {
   		event.stopPropagation();
	});
});

$(function() {
	$('#hidecode').click(function() {
		$('.codedrop').slideToggle("fast");
		$('.docudrop').hide();
		$('#hotdogdrop').hide();
		$('.themedrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		return false;
	});
	$(document).click(function() {
    	$('.codedrop').slideUp('fast');
	});
	$(".codedrop").click(function(event) {
   		event.stopPropagation();
	});
});

$(function() {
	$('#hidehotdog').click(function() {
		$('#hotdogdrop').slideToggle("fast");
		$('.docudrop').hide();
		$('.codedrop').hide();
		$('.themedrop').hide();
		$('.backwdrop').hide();
		$('.forwdrop').hide();
		return false;
	});
	$(document).click(function() {
    	$('#hotdogdrop').slideUp('fast');
	});
	$("#hotdogdrop").click(function(event) {
   		event.stopPropagation();
	});
});

$(function() {
	$('#hidetheme').click(function() {
		$('.themedrop').slideToggle("fast");
		$('.docudrop').hide();
		$('.codedrop').hide();
		$('#hotdogdrop').hide();
		return false;
	});
	$(document).click(function() {
    	$('.themedrop').slideUp('fast');
	});
	$(".themedrop").click(function(event) {
   		event.stopPropagation();
	});
});

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
	str+="<div class='themeicon' onclick='selectTheme(\""+'colorblind'+"\");'> <img src='new icons/theme_button.svg' /><span>Colorblind<span/></div>";
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
	if(storedTheme != "" && storedTheme != null){
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
			alert("no theme");
		}
	}
}
