/*
THIS IS A QUIZTAMPLATE
DO NOT CHANGE THE QUIZ MAIN FUNCTION NAME AND PARAMETER, IT SHOULD ALWAYS BE THE SAME.
quiz(parameters)

In the description tags below, you can give a description of how to use the template parameters. 
This description will be visible on the interface for adding or change a quiz.

[DESCRIPTION] 
	This template separates each parameter between commas.
	You write "question = quiz question" in order to present a text that describes the question.
	You write answer = description to create possible answers for the quiz. 
	Answer is the value that becomes the student's answers while the description is what appears on the screen.
	
	An example of the correct parameters can look like this: 
	"question = Who is Sweden's best soccer player?, A = Zlatan, B = Hysen, C = Robin, D = Aslan"
	if A = Zlatan is the correct answers so shall also the value of A be written as the correct answer in the answer field.
[/DESCRIPTION]
*/
function quiz(parameters) {
	if(parameters != undefined) {
		console.log("pram:" + parameters);
		var inputSplit = parameters.split(",");
		var answerValue;
		var answerID;
		var app;

		for(var i = 0;i < inputSplit.length;i++){
		    var splited = inputSplit[i].split("=");
			answerValue = splited[1].trim();
			answerID= splited[0].trim();
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
		app += "<button class='submit' onclick='checkQuizAnswer();'>Submit</button>";

		$("#output").html(app);
	}
	else {
		historyBack();
		setTimeout(function(){
			dangerBox('Problem loading quiz', 'This quiz has no parameters in order to show it.</br>Contact quiz author or admin.');
		}, 500);
	}

	
}
function getCheckedBoxes(){
		// $.map() loopar igenom objekt (checkboxes i vårt fall) och gör funktioner utav de. Nu returnerar vi värdet(value) på varje checkbox som är i-bockad.
		var answers = $.map($('input:radio[name=answers]:checked'), function(checked, i) {
			return checked.value;
		});
		return answers; // returnerar de värden på de checkboxes som är i-bockade.

	}
	function checkQuizAnswer(){
		var answers = $('input:radio[name=answers]:checked').attr('id');
		var quiz_id = getUrlVars().quizid;
		if(quiz_id != "undefined"){
			$.ajax({
				url: './ajax/checkanswers_ajax.php',
				type: "POST",
				data: {
					answers: answers,
					quiz_id: quiz_id
				},
				success: function (returned) {
					changeURL("myresults");	
				},
				error: function(){
					dangerBox('Problem submitting test', 'Something went wrong while trying to submit the test');
				},
			});
		}
	}
// Visar upp de svaren som är i-bockade
function displayCheckedBoxes() {
    var answers = $('input:radio[name=answers]:checked').val();
    $('#displayAnswers').text('You choose answer: ' + answers);	
}
