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

function testerror(jqXHR, textStatus, errorThrown)
{
	console.log("textStatus:" + textStatus);
  console.log('jqXHR.responseText: ' + jqXHR.responseText);
	console.log('errorThrown: ' + errorThrown.stack);
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedThread(thread)
{
	console.log(thread);
	//$('#threadTopic').html(thread[0]['topic']);
}

function makeComment()
{
	var threadId = 1;
	var userID = 1;
	var text = "hehe";
	AJAXService("MAKECOMMENT",{threadId:threadId,userID:userID,text:text},"MAKECOMMENT");
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