/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind=0;
var querystring = parseGet();

//----------------------------------------
// Commands:
//----------------------------------------


$( document ).ready(function() {

  initThread();


	  // Hover handler for certain shortcurts

	  $("body").on({
	    mouseenter: function(e) {
	    	e.stopPropagation();
	      	$(this).children("div.editorSubMenu").slideDown(200);
	    },
	    mouseleave: function(e) {
	    	e.stopPropagation();
	      	$(this).children("div.editorSubMenu").slideUp(200).clearQueue();
	    },
	}, ".editorDropdown");



	// what happens when you click on one of the markdown shortcus

	$(".markdownShortcut").on("click",function(event){

		var markdownType = $(this).attr("markdown-data");

		var markdownText,
			thisDescription = $(this).parents(".editorDescrOptions").siblings(".editorDescrWrapper").children(".editorDescr"),
			emptyDescription = true;


		if(!thisDescription.val().trim())
		{
			emptyDescription = false;
		}


		// Temporary markdown implementation, should (probably) be updated in the markown.js file later on.

		switch (markdownType) {
		    case "heading1":
		        markdownText = (emptyDescription ? "\n" : "") + "# text" ;
		        break;
		    case "heading2":
		        markdownText = (emptyDescription ? "\n" : "") + "## text" ;
		        break;
		    case "heading3":
		        markdownText = (emptyDescription ? "\n" : "") + "### text" ;
		        break;
		    case "bold":
		        markdownText = " ***text***" ;
		        break;
		    case "italic":
		        markdownText = " **text**" ;
		        break;
		     case "link":
		        markdownText = " !!!http://www.google.com, the text to be shown as a link!!!" ;
		        break;
		    case "horizontalLine":
		        markdownText = (emptyDescription ? "\n" : "") + "---" ;
		        break;
		}
		



		thisDescription.val(thisDescription.val() + markdownText);

	});


});





$(document).on('click','.replyCommentButton', function(event) {
		event.preventDefault();
		var target = "#" + this.getAttribute('data-target');
		$('html, body').animate({
			scrollTop: $('#makeCommentInputWrapper').offset().top -110
		}, 1000);
});

function initThread()
{
	console.log(querystring);
	if (querystring["threadId"])
	{
		$("#createThreadWrapper").hide();

		getThread();
		$(".editorDescr").on("keyup", checkComment);
	}
	else {
		createThreadUI();
	}
}

function getThread()
{
	AJAXService("GETTHREAD",{threadId:querystring["threadId"]},"GETTHREAD");
	getComments();
}

function lockThread()
{
	AJAXService("LOCKTHREAD",{threadId:querystring["threadId"]},"LOCKTHREAD");
}

function deleteThread()
{
	$('#threadDeleteConfirm').css('display','inline-block');
}

function confirmDeleteThread()
{
	AJAXService("DELETETHREAD",{threadId:querystring["threadId"]},"DELETETHREAD");
}

// Vad ska hända när man deletar en tråd???
function deleteThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		window.location.replace("courseed.php");
	}
}

function getComments()
{
  AJAXService("GETCOMMENTS",{threadId:querystring["threadId"]},"GETCOMMENTS");
}

function createThread()
{
	var cid = $("#createThreadCourseList").val();
	var topic = $("#threadTopicInput").val();
	var description = $(".editorDescr").first().val();
	var accessList = new Array();
	if ($('input:radio[name=threadAccessRadio]:checked').val()==="public") {
		accessList = false;
	}else {
		$.each($(".threadUsersCheckbox"), function() {
			if ($(this).is(':checked')) {
				accessList.push($(this).val());
			}
		});
	}

	var lockedStatus = $("input:radio[name=threadAllowCommentsRadio]:checked").val();

	console.log(accessList);
	AJAXService("CREATETHREAD",{cid:cid,topic:topic,description:description, accessList:accessList,lockedStatus:lockedStatus},"CREATETHREAD");
}

function makeComment(commentid)
{
	var commentcontent = "";
	$(document).ready(function() {
    var $myDiv = $('.repliedcomment');
		if ( $myDiv.length){
			commentcontent = $(".repliedcomment").html();
		}
	});
	var editorDescr = $("#makeCommentInputWrapper").find(".editorDescr");
	var editorPreview = $("#makeCommentInputWrapper").find(".editorPreviewText");
	var text = commentcontent + $(editorDescr).val();
	if(text)
	{
		AJAXService("MAKECOMMENT",{threadId:querystring["threadId"],text:text,commentid:commentid},"MAKECOMMENT");
	}
	else
	{

	}
	$(editorDescr).val("");
	$(editorPreview).html(" ");

	$("#commentSubmitButton").attr("onclick", "makeComment()");
}

function checkComment()
{
	var editorDescrElem = $("#makeCommentInputWrapper").find(".editorDescr");
	var text = $(editorDescrElem).val();

	if(text.length > 0)
	{
		$("#commentSubmitButton").css("background-color", "#614875");
	}
	else
	{
		$("#commentSubmitButton").css("background-color", "buttonface");
	}
}

function deleteComment(commentid)
{

	AJAXService("DELETECOMMENT",{commentid:commentid},"DELETECOMMENT");
}

function getCourses()
{
	AJAXService("GETCOURSES",{},"GETCOURSES");
}

function getClasses(cid)
{
	AJAXService("GETCLASSES",{cid:cid},"GETCLASSES");
}

function getUsers(programclass)
{
	AJAXService("GETUSERS",{class:programclass},"GETUSERS");
}

function editThread(data)
{
	var array = data.split(',');
	//console.log(array);

	var topic = "<input type='text' name='topic' id='threadTopicInput'>";
	$(".threadTopic").html(topic);

	$("#threadTopicInput").val(array[3]);

	$("#threadDescr").load("forumEditor.php");
	document.getElementById("editDescription").value = array[6];

	var button = "<input class='new-item-button' id='submitEditedThread' type='button' value='Submit changes' onclick='submitEditThread()' style='width:120px;float:left;margin-top:30px;'>";
	button += "<input class='new-item-button' type='button' value='Cancel' onclick='getThread()' style='float:left;margin-top:30px;margin-left:10px;'>";
	$("#threadDescr").append(button);
}

function submitEditThread()
{
	if($("#editTopic").val().length<1){
		//Better error message pls
		console.log("Topic and/or description can NOT be empty!");
	}else if($("#editDescription").val().length<1){
		console.log("Topic and/or description can NOT be empty!");
	}else{
		var topic = $("#editTopic").val();
		var description = $("#editDescription").val();
		console.log(topic+description);

		AJAXService("EDITTHREAD",{threadId:querystring["threadId"],topic:topic,description:description},"EDITTHREAD");

	}
}

//----------------------------------------
// Renderer
//----------------------------------------

function accessDenied(data)
{
	var str = "<div class='err'>";
			str +=	"<span style='font-weight:bold'>";
			str +=		"Access denied! ";
			str	+=	"</span>";
			str +=	data["accessDenied"];
			str +="</div>";
	$("#content").html(str);
}

function returnedThread(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else {
		if($('div.threadDeleteAndEdit').length){
			var buttons = "<input class='new-item-button' id='deleteThreadButton' type='button' value='Delete' onclick='deleteThread()'>";
			if(data['thread']['locked']==1){
				buttons += "<input class='new-item-button' id='lockThreadButton'type='button' value='Unlock' onclick='unlockThread()'>";
			}else{
				buttons += "<input class='new-item-button' id='lockThreadButton'type='button' value='Lock' onclick='lockThread()'>";
			}
			$(".threadDeleteAndEdit").html(buttons);
		}

		if(data['threadAccess']==="op" || data['threadAccess']==="super"){
			var arr = $.map(data['thread'], function(el) { return el });
			//console.log(arr);
			var button = "<input class='new-item-button' id='editThreadButton'type='button' value='Edit' onclick='editThread(\""+arr+"\");'>";
			$(".opEditThread").html(button);
		}

		$(".threadTopic").html(data["thread"]["topic"]);
		$("#threadDescr").html(parseMarkdown(data["thread"]["description"]));
		var str = "";
		if(!(data["thread"]["datecreated"]===data["thread"]["lastedited"])){
			str +=
			"<span id='threadEditedDetail'>" +
				"Edited <span id='threadEditedDate'>"+data["thread"]["lastedited"].substring(0, 16) +
				"</span>" +
			"</span>";
		}

		str +=
		"<span id='threadCreatedDetail'>" +
			"Created <span id='threadDate'>" +
			data["thread"]["datecreated"].substring(0, 16) +
			"</span> by <span id='threadCreator'>"+getUsername(data['thread']['uid']) +
			"</span>" +
		"</span>";

		$("#threadDetails").html(str);

		if(data['thread']['locked'] === "1"){
			//var str = "<p style='margin-left:20px;'>This thread has been locked and can not be commented on.</p>";
			//$(".threadMakeComment").html(str);
			var str = "<span style='padding-right:30px;'><i class='fa fa-lock fa-lg fa-spin' style='color:#ff4d4d' aria-hidden='true'></i></span>";
			$(".threadLockedIcon").html(str);
			$("#threadMakeComment").slideUp();
		}else{
			$("#threadMakeComment").slideDown();
		}
	}
}

function getUsername(threadUID)
{
	AJAXService("GETTHREADCREATOR",{threadId:querystring["threadId"],threadUID:threadUID},"GETTHREADCREATOR");
}

function showThreadCreator(data)
{
	//console.log(data);
	var str = data['courses'][0]['username'];
	$("#threadCreator").html(str);
}

function returnedComments(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else {


		// Adds the comment header with the amount of comments.
		var commentLength = data["comments"].length;
		var threadCommentStr = "<div id='threadCommentsHeader'>Comments ("  +  commentLength  + ")</div>";

		threadCommentStr += "<div class=\"allComments\">";

		// Iterates through all the comments
		$.each(data["comments"], function(index, value){

			var text= parseMarkdown(value['text']);

			threadCommentStr +=
			"<div class=\"threadComment\">" +
				"<div class=\"commentDetails\"><span class=\"commentUser\">" + value["username"]  +   "</span> - <span class='commentCreated'>" + (value["datecreated"]).substring(0,16) + "</span></div>" +
				"<div class=\"commentContent\"><div class=\"commentContentText descbox\">" +  text  +"</div></div>" +
				"<div class=\"commentFooter\">" +
						getCommentOptions(index, value['uid'], data['threadAccess'], data['uid'], data['comments'][index]['commentid']) +
				"</div>" +
			"</div>";
		});

		threadCommentStr += "</div>";

		// Appends the comments
		$("#threadComments").html(threadCommentStr);
	}
}

function getCommentOptions (index, commentuid, threadAccess, uid, commentid){
	var threadOptions = "";
	if (threadAccess !== "public"){
		threadOptions = "<a href='#' onclick='getCommentReply(event,"+commentid+");return false;' class='commentAction replyCommentButton'>Reply</a>";

		if (uid === commentuid || threadAccess === "super"){
			threadOptions += "<a href='#' onclick='editUI();return false;' class='commentAction'>Edit</a>";
		}
		if (threadAccess === "op" || threadAccess === "super" || uid === commentuid){
			threadOptions += "<a href='#' onclick='deleteComment("+commentid+");return false;' class='commentAction'>Delete</a>";
		}
	}
	return threadOptions;
}
function createThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else {
		var url = "thread.php?threadId=" + data['thread']['threadid'];
		$(location).attr("href", url);
	}
}

function getCommentReply(event, commentid)
{
	var target = event.target;
	var text = $(target).parent().prev().children().first().clone().children().remove().end().text();
	text = text.replace(/(\r\n|\n|\r)/g,"");
	text = "^ " + text + " ^" + "\r\n";
	console.log(text);
	$("#threadMakeComment").find('.editorDescr').first().val(text);
	$("#commentSubmitButton").attr("onclick", "makeComment("+commentid+")");
}

function makeCommentSuccess()
{
	getComments();
}

function deleteCommentSuccess(data)
{

	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		getComments();
	}
}

function lockThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(data);
	}else{
		var str = "<span style='padding-right:30px;'><i class='fa fa-lock fa-lg fa-spin' style='color:#ff4d4d' aria-hidden='true'></i></span>";
		$(".threadLockedIcon").html(str);
		getThread();
	}
}

function unlockThread()
{
	AJAXService("UNLOCKTHREAD",{threadId:querystring["threadId"]},"UNLOCKTHREAD");
}

function unlockThreadSuccess()
{
	$('.threadLockedIcon').html('');
	getThread();
}

function editThreadPoo()
{
	AJAXService("EDITTHREAD",{threadId:querystring["threadId"]},"EDITTHREAD");
}

function createThreadUI()
{
	$("#threadHeader").hide();
	$(".threadMakeComment").hide();
	$("#threadComments").hide();
	$("#createThreadWrapper").show();

	getCourses();
}

function createThreadPublicUI()
{
	$("#createThreadPrivateWrapper").slideUp();
}

function createThreadPrivateUI()
{
	updateClassList();

	$("#createThreadPrivateWrapper").slideDown();
}

function updateClassList()
{
	var cid = $("#createThreadCourseList").val();
	getClasses(cid);
}

function updateUsersList()
{
	var programclass = $("#createThreadClassList").val();
	getUsers(programclass);
}



function returnedCourses(data) {
	var str;
	$.each(data['courses'], function() {
		str += "<option value='" + this[
			"cid"
		] + "'>" + this["coursecode"] + " - " + this["coursename"] + "</option>";
	});
	$("#createThreadCourseList").html(str);

	updateClassList();
}

function returnedClasses(data) {
	var str = "";
	$.each(data['classes'], function() {
		str += "<option value='" + this[
			"class"
		] + "'>" + this["class"] + "</option>";
	});
	$("#createThreadClassList").html(str);

	updateUsersList();
}

function returnedUsers(data) {
	var str = "<input id='threadCheckboxAll' class='threadUsersCheckbox' type='checkbox' value='all'><label class='threadCheckboxLabel' for='threadCheckboxAll'>All</label>";
	$.each(data['users'], function() {
		str += "<input id='threadCheckbox" + this['uid'] + "' class='threadUsersCheckbox' type='checkbox' value='" + this["uid"] +
		"'>" +
		"<label class='threadCheckboxLabel' for='threadCheckbox" + this["uid"] + "'>" + this["username"] + "</label>";
	});
	$("#createThreadUsersWrapper").html(str);
}

function error(xhr, status, error)
{
	console.log("ERROOR");
	console.log(error);
	console.log(status);
	console.log(xhr);
}



// Forum Editor Functions



function writeText(event)
{
	var button = event.target;
	$(button).parent().find(".editorPreviewButton").first().removeClass("editorActiveButton");
	$(button).addClass("editorActiveButton");
	$(button).parent().parent().find(".editorPreviewText").first().hide();
	$(button).parent().parent().find(".editorDescr").first().show();

	// hides the markdown shortcuts
	$(event.target).siblings(".markdownShortcutWrapper").show();
}

function previewText(event)
{
	var button = event.target;
	var writeButton = $(button).parent().find(".editorWriteButton").first();
	var editorDescr = $(button).parent().parent().find(".editorDescr").first();
	var editorPreview = $(button).parent().parent().find(".editorPreviewText").first();

	$(writeButton).removeClass("editorActiveButton");
	$(button).addClass("editorActiveButton");

	// shows the markdown shortcuts
	$(event.target).siblings(".markdownShortcutWrapper").hide();

	

	// Parses text to preview
	var parseText = parseMarkdown($(editorDescr).val());
	

	if(!parseText)
	{
		$(editorPreview).html("Nothing to preview!");
	}
	else
	{
		$(editorPreview).html(parseText);
	}

	$(editorDescr).hide();
	$(editorPreview).show();
}


