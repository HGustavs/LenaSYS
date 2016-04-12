
$(document).ready(function() {
	getThread();
})

/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();


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
