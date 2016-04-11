/********************************************************************************

   Globals

*********************************************************************************/
var sessionkind=0;
var querystring=parseGet();

//----------------------------------------
// Commands:
//----------------------------------------

function deleteVariant()
{
	var vid=$("#vid").val();
	if(confirm("Do you really want to delete this Variant?")) AJAXService("DELVARI",{cid:querystring['cid'],vid:vid},"DUGGA");
	$("#editVariant").css("display","none");
}

//----------------------------------------
// Renderer
//----------------------------------------

function getVariantPreview(duggaVariantParam, duggaVariantAnswer, template){
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
