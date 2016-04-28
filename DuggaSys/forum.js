/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind=0;
var querystring = parseGet();

//----------------------------------------
// Commands:
//----------------------------------------

$(document).on('click','#replycommentbutton', function(event) {
		event.preventDefault();
		var target = "#" + this.getAttribute('data-target');
		$('html, body').animate({
			scrollTop: $('.makeCommentInputWrapper').offset().top -110
		}, 1500);
});

function initThread()
{
	console.log(querystring);
	if (querystring["threadId"])
	{
		$("#createThreadWrapper").hide();

		getThread();
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
	var courseId = $("#createThreadCourseList").val();
	var topic = $("#threadTopicInput").val();
	var description = $("#createThreadDescr").val();
	AJAXService("CREATETHREAD",{courseId:courseId,topic:topic,description:description},"CREATETHREAD");
}

function makeComment(commentid)
{
	var commentcontent="";
	$(document).ready(function() {
    var $myDiv = $('.repliedcomment');
		if ( $myDiv.length){
			commentcontent=$(".repliedcomment").html();
		}
	});
	var text = commentcontent + $(".commentInput").val() + "\r\n";
	if(text.length > 0)
	{
		AJAXService("MAKECOMMENT",{threadId:querystring["threadId"],text:text,commentid:commentid},"MAKECOMMENT");
	}
	else
	{

	}
	$('.makeCommentInputWrapper').html("<textarea class=\"commentInput\" name=\"commentInput\" placeholder=\"Leave a comment\" onkeyup=\"checkComment()\"></textarea>"+
  	"<input class=\"submit-button commentSubmitButton\" type=\"button\" value=\"Submit\" onclick=\"makeComment()\">");
}

function checkComment()
{
	var text = $(".commentInput").val();

	if(text.length > 0)
	{
		$(".commentSubmitButton").css("background-color", "#614875");
	}
	else
	{
		$(".commentSubmitButton").css("background-color", "buttonface");
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

	
	var topic = "<input type='text' name='topic' id='editTopic' style='margin:0px;height:25px;opacity:0.8;'>";

	$(".threadTopic").html(topic);
	document.getElementById("editTopic").value = array[3];

	var description = "<textarea id='editDescription' name='description' style='float:left;width:100%;height:auto;min-height:200px;'></textarea>";
	$("#threadDescr").html(description);
	document.getElementById("editDescription").value = array[6];

	var button = "<input class='new-item-button' id='submitEditedThread' type='button' value='Submit changes' onclick='submitEditThread()' style='width:auto;float:left;margin-top:30px;'>";
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
	console.log(data);
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

		if($('div.opEditThread').length){
			var arr = $.map(data['thread'], function(el) { return el });
			//console.log(arr);
			var button = "<input class='new-item-button' id='editThreadButton'type='button' value='Edit' onclick='editThread(\""+arr+"\");'>";
			$(".opEditThread").html(button);
		}

		$(".threadTopic").html(data["thread"]["topic"]);
		$("#threadDescr").html(parseMarkdown(data["thread"]["description"]));
		var str = "Created <span id='threadDate'>";
		str += 	data["thread"]["datecreated"].substring(0, 10);
	
		str += "</span> by <span id='threadCreator'>"+getUsername(data['thread']['uid'])+"</span>";
		if(!(data["thread"]["datecreated"]===data["thread"]["lastedited"])){
			str += "<br/>Edited <span id='threadEditedDate'>"+data["thread"]["lastedited"];
		}
		$("#threadDetails").html(str);

		if(data['thread']['locked']==1){
			var poo = "<p style='margin-left:20px;'>This thread has been locked and can no longer be commented on.</p>";
			$(".threadMakeComment").html(poo);
		}else{
			if($('div.threadMakeComment').length){
				var str = "<div class='threadMakeComment'>";
				str+= "<div class='makeCommentHeader'>";
				str += "Comment";
				str+= "</div>";
				str += "<div class='makeCommentInputWrapper'>";
				str += "<textarea class='commentInput' name='commentInput' placeholder='Leave a comment' onkeyup='checkComment()'></textarea>";
				str += "<input class='submit-button commentSubmitButton' type='button' value='Submit' onclick='makeComment();'>";
				str += "</div>";
				str += "</div>";
				$(".threadMakeComment").html(str);
			}
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
			
			if(!value['replyid']){
				//console.log(value['replyid']);
				console.log('hej alla glada laxar');
				text = text.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>");
			}else{
				text = "Citat:<br/><div class=\"replycommentbox\"><p style=\"padding: 5px; margin: 0;\">" + text.replace(/\r\n/g, "</p>").replace(/\n/g, "</div><p class=\" \" style=\"display: block; padding: 0px; margin: 15px 0px 0px 0px;\">") + "</p>";
			}
			threadCommentStr +=
			"<div class=\"threadComment\">" +
				"<div class=\"commentDetails\"><span id=\"commentUser\">" + value["username"]  +   "</span></div>" +
				"<div class=\"commentContent\"><div class=\"commentContentText\">" +  text  +"</div></div>" +
				"<div class=\"commentFooter\">" +
						getCommentOptions(index, value['uid'], data['threadAccess'], data['uid'], data['comments'][index]['commentid']) +
				"</div>" +

				"<div class=\"commentDate\">" + (value["datecreated"]).substring(0,10) + "</div>" + 
			"</div>";
		});

		threadCommentStr += "</div>";

		// Appends the comments
		$("#threadComments").html(threadCommentStr);
	}
}

function getCommentOptions (index, commentuid, threadAccess, uid, commentid){
	var threadOptions;
	if (threadAccess !== "public"){
		threadOptions = "<input id='replycommentbutton' class='submit-button' type='button' value='Reply' onclick='replyUI("+commentid+");'>";

		if (uid === commentuid){
			threadOptions += "<input class=\"submit-button\" type=\"button\" value=\"Edit\" onclick=\"editUI();\">";
		}
		if (threadAccess === "op" || threadAccess === "super" || uid === commentuid){
			threadOptions += "<input class=\"submit-button\" type=\"button\" value=\"Delete\" onclick=\"deleteComment("+commentid+");\">";
		}
	}
	return threadOptions;
}
function createThreadSuccess(data)
{
	if (data["accessDenied"]){
		accessDenied(array);
	}else {
		var url = "thread.php?threadId=" + data['thread']['threadid'];
		$(location).attr("href", url);
	}
}
function replyUI(commentid)
{
	AJAXService("REPLYCOMMENT",{commentid:commentid},"REPLYCOMMENT");
}

function replyComment(array)
{
	//"<div class=\"repliedcomment\">"+value["text"]+"</div>"+"
	if (array["accessDenied"]){
		accessDenied(array);
	}else {
		
		$.each(array["comments"], function(index, value){
			
			var text=value["text"];
			if(value["replyid"]){
				text = text.replace(/\n/, "<br/>");
				text=text.replace(/[^.]*(<br\ ?\/?>)/, "");
			}
			
			$('.makeCommentInputWrapper').html("<textarea class=\"commentInput\" name=\"commentInput\" placeholder=\"Leave a comment\" onkeyup=\"checkComment()\">"+text+"</textarea>"+
  			"<input class=\"submit-button commentSubmitButton\" type=\"button\" value=\"Submit\" onclick=\"makeComment("+value["commentid"]+")\">");
		});
	}
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
		getThread();
	}
}

function unlockThread()
{
	AJAXService("UNLOCKTHREAD",{threadId:querystring["threadId"]},"UNLOCKTHREAD");
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

function writeText()
{
	$("#threadPreviewButton").removeClass("threadActiveButton");
	$("#threadWriteButton").addClass("threadActiveButton");
	$("#previewText").hide();
	$("#createThreadDescr").show();
}

function previewText()
{
	$("#threadWriteButton").removeClass("threadActiveButton");
	$("#threadPreviewButton").addClass("threadActiveButton");
	$("#createThreadDescr").hide();

	// Parse preview text...

	$("#previewText").show();
}

function returnedCourses(data) {
	var str;
	$.each(data['courses'], function() {
		str += "<option value='" + this[
			"cid"
		] + "'>" + this["coursecode"] + " - " + this["coursename"] + "</option>";
	});
	$("#createThreadCourseList").html(str);
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
	var str = "<option value='all'>All</option>";
	$.each(data['users'], function() {
		str += "<option value='" + this[
			"uid"
		] + "'>" + this["username"] + "</option>";
	});
	$("#createThreadUserList").html(str);
}

function error(xhr, status, error)
{
	console.log("ERROOR");
	console.log(error);
	console.log(status);
	console.log(xhr);
}
