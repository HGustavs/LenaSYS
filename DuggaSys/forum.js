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
	$('#threadTopic').html(thread[0]['topic']);
}
