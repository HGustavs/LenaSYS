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

//----------------------------------------
// Renderer
//----------------------------------------

function returnedThread(comments)
{
	console.log(comments);
}

function testerror(jqXHR, textStatus, errorThrown)
{
	console.log("textStatus:" + textStatus);
  console.log('jqXHR.responseText: ' + jqXHR.responseText);
	console.log('errorThrown: ' + errorThrown.stack);




}

function getVariantPreview(duggaVariantParam, duggaVariantAnswer, template)
{
	$("#MarkCont").html(duggaPages[template]);

	$.getScript("templates/"+template+".js")
	  .done(function( script, textStatus ) {

		showFacit(duggaVariantParam,"UNK",duggaVariantAnswer,[0,0,0,0]);

	  })
	  .fail(function( jqxhr, settings, exception ) {
	  	console.log(jqxhr);
	  	console.log(settings);
	  	console.log(exception);
	  	eval(script);
	  	showFacit(duggaVariantParam,"UNK",duggaVariantAnswer);
	});

	$("#resultpopover").css("display", "block");

}
