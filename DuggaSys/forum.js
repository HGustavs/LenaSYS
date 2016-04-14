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
	AJAXService("ACCESSCHECK",{threadId:querystring["threadId"]},"THREADACCESSCHECK");
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

function accessCheck(array)
{
	if (array["threadAccess"]){
		getComments();
		getThread();

		if (array["threadAccess"] === "public"){
			$('.threadMakeComment').hide();
		}else if (array["threadAccess"] === "super"){
			var str = "<input class='new-item-button' id='deleteThreadButton' type='button' value='Delete'>";
			str += "<input class='new-item-button' id='lockThreadButton'type='button' value='Lock'>";

			$("#threadOptions").html(str);
		}else if (array["threadAccess"] === "op")
		{
			var str = "<input class='new-item-button' id='deleteThreadButton' type='button' value='Delete'>";
			str += "<input class='new-item-button' id='lockThreadButton'type='button' value='Lock'>";
			str += "<input class='new-item-button' id='editThreadButton'type='button' value='Edit'>";

			$("#threadOptions").html(str);
		}
	}else {
		var str = "<div class='err'>";
				str +=	"<span style='font-weight:bold'>You do not have access to this thread!</span>";
				str +=	" You are either not logged in or the thread creator has not given you access.";
				str +="</div>";
		$("#content").html(str);
	}
}

function returnedThread(array)
{
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
