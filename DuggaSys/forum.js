/********************************************************************************

   Globals

*********************************************************************************/

var sessionkind=0;
var querystring = parseGet();

//----------------------------------------
// Commands:
//----------------------------------------

function initThread()
{
	console.log(querystring);
	AJAXService("GETUSER","UNK","GETUSER");
	
	threadAccess();

	getComments();
	getThread();
}

function threadAccess()
{


}

function getThread()
{
	AJAXService("GETTHREAD",{threadId:querystring["threadId"]},"GETTHREAD");
}

function getComments()
{
  AJAXService("GETCOMMENTS",{threadId:querystring["threadId"]},"GETCOMMENTS");
}

function makeComment()
{
	var threadId = 1;
	var userID = 1;
	var text = "hehe";
	AJAXService("MAKECOMMENT",{threadId:threadId,userID:userID,text:text},"MAKECOMMENT");
}


function testerror(jqXHR, textStatus, errorThrown)
{
	console.log("textStatus:" + textStatus);
  console.log('jqXHR.responseText: ' + jqXHR.responseText);
	console.log('errorThrown: ' + errorThrown.stack);
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedThread(array)
{

	console.log(array);
	$(".threadTopic").html(array["thread"]["topic"]);
	$("#threadDescr").html(array["thread"]["description"]);
	var str = "<span id='threadDate'>";
			str += 	array["thread"]["datecreated"].substring(0, 16);
			str += "</span> by <span id='threadCreator'>a97marbr</span>";
	$("#threadDetails").html(str);
}


function returnedComments(array)
{





	// Adds the comment header with the amount of comments.
	var commentLength = array["comments"].length;
	var threadCommentsHeaderStr = "<div id=\"threadCommentsHeader\"> Comments ("  +  commentLength  + ") </div>"

	$("#threadComments").append(threadCommentsHeaderStr);





	// Iterates through all the comments
	$.each(array["comments"], function(index, value){

		var threadCommentStr =
		"<div class=\"threadComment\">" +
			"<div class=\"commentDetails\"><span id=\"commentUser\">" + value["uid"]  +   "</span></div>" +
			"<div class=\"commentContent\"> <p>" +  value["text"]  + "</p></div>" +
			"<div class=\"commentFooter\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Reply\" onclick=\"replyUI();\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Edit\" onclick=\"editUI();\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Delete\" onclick=\"deleteComment();\">" +
			"</div>" +
			"<div class=\"commentDate\">" + value["datecreated"] + "</div></div";

		// Appends the comment
		$("#threadComments").append(threadCommentStr);


	});


}

function showComment(comment)
{
	console.log("asd");
	console.log(comment);
}

function error(xhr, status, error)
{
	console.log("ERROOR");
	console.log(error);
	console.log(status);
	console.log(xhr);
}
