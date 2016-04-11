/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;


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
  AJAXService("GETCOMMENTS",{threadId:threadId},"GETCOMMENTS");
}

//----------------------------------------
// Renderer
//----------------------------------------

function returnedComments(comments)
{
	console.log(comments);
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
