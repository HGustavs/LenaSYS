
//
// THIS IS A QUIZTAMPLATE
// DO NOT CHANGE THE QUIZ MAIN FUNCTION NAME AND PARAMETERS, IT SHOULD ALWAYS BE THE SAME.
// quiz(parameters, question)
//
function quiz(parameters) { 
	console.log("pram:" + parameters);
	var inputSplit = parameters.split(",");
	var answerValue;
	var answerID;
	var app;

	for(var i = 0;i < inputSplit.length;i++){
	    var splited = inputSplit[i].split("=");
		answerValue = splited[1];
		answerID= splited[0];
		if(answerID == "question") {
			var app = "<h2>";
			app += answerValue + "<br>";
			app += "</h2>";
		}
		else {
			app += "<input type='radio' name='answers' value='"+answerValue+"' id='"+answerID+"' onchange='displayCheckedBoxes();'>"+answerValue+"</input>";
			app += "<br>";
		}
	}
	app += "<span id='displayAnswers'></span>";
	app += "<br>";
	app += "<button class='submit' onClick='checkAnswer();'>Submit</button>";

	$("#output").html(app);
}

function getCheckedBoxes(){
	// $.map() loopar igenom objekt (checkboxes i vårt fall) och gör funktioner utav de. Nu returnerar vi värdet(value) på varje checkbox som är i-bockad.
	var answers = $.map($('input:radio[name=answers]:checked'), function(checked, i) {
		return checked.value;
	});
	return answers; // returnerar de värden på de checkboxes som är i-bockade.

}
function checkAnswer(){
	var answers = getCheckedBoxes();
	var quiz_id = getUrlVars().quizid;
	alert(answers);
	if(quiz_id != "undefined"){
		$.ajax({
			url: './ajax/checkanswers_ajax.php',
			type: "POST",
			data: {
				answers: answers,
				quiz_id: quiz_id
			},
			success: function (returned) {
				if(returned == "true"){
				   alert("rätt svar");
				}else {
				   alert("fel svar");
				}
			},
			error: function(){
				dangerBox('Problems removing students', 'Could not remove the students from the course. Make sure you selected at least one student.');
			},
		});
	}

}
// Visar upp de svaren som är i-bockade
function displayCheckedBoxes() {
    var answers = getCheckedBoxes();
    $('#displayAnswers').text('You choose answer: ' + answers);	
}