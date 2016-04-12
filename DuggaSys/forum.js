
$(document).ready(function(){



getComments();
getThread();


})


/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();




function replyUI()
{
	getThread();
}


//----------------------------------------
// Commands:
//----------------------------------------

function getThread()
{
	var threadId = 1;
  AJAXService("GETTHREAD",{threadId:threadId},"GETTHREAD");
}



function getComments()
{
  // TEST VARIABLE 
  var threadId = 1;

  AJAXService("GETCOMMENTS",{threadId:threadId},"GETCOMMENTS");
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
			str += 	array["thread"]["dateCreated"].substring(0, 16);
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
			"<div class=\"commentDetails\"><span id=\"commentUser\">" + value["userID"]  +   "</span></div>" +
			"<div class=\"commentContent\"> <p>" +  value["text"]  + "</p></div>" + 
			"<div class=\"commentFooter\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Reply\" onclick=\"replyUI();\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Edit\" onclick=\"editUI();\">" +
				"<input class=\"submit-button\" type=\"button\" value=\"Delete\" onclick=\"deleteComment();\">" +
			"</div>" +
			"<div class=\"commentDate\">" + value["dateCreated"] + "</div></div";

		// Appends the comment
		$("#threadComments").append(threadCommentStr);


	});

}
