
//
// THIS IS A QUIZTAMPLATE
// DO NOT CHANGE THE QUIZ MAIN FUNCTION NAME AND PARAMETERS, IT SHOULD ALWAYS BE THE SAME.
// quiz(parameters, question)
//
function quiz(parameters, question) { 
	console.log("pram:" + parameters);
	var inputSplit = parameters.split(",");
	var answerValue;
	var answerID;
	var app = "<h2>";
	app += question + "<br>";
	app += "</h2>";

	for(var i = 0;i < inputSplit.length;i++){
	    var splited = inputSplit[i].split("=");
		answerValue = splited[1];
		answerID= splited[0];
		app += "<input type='checkbox' value='"+answerValue+"' id='"+answerID+"' onchange='displayCheckedBoxes();'>"+answerValue+"</input>";
		app += "<br>";
	}
	app += "<span id='displayAnswers'></span>";
	app += "<br>";
	app += "<button class='submit' onclick=''>Submit</button>";

	$("#output").html(app);
}

function getCheckedBoxes(){
	// $.map() loopar igenom objekt (checkboxes i vårt fall) och gör funktioner utav de. Nu returnerar vi värdet(value) på varje checkbox som är i-bockad.
	var answers = $.map($('input:checkbox:checked'), function(checked, i) {
		return checked.value;
	});
	return answers; // returnerar de värden på de checkboxes som är i-bockade.

}
// Visar upp de svaren som är i-bockade
function displayCheckedBoxes() {
    var answers = getCheckedBoxes();
    $('#displayAnswers').text('You choose answer(s): ' + answers);	
}