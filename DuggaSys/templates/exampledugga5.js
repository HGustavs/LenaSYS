
function loadQuestion(alternativ, question) {

	var inputSplit = alternativ.split(",");
	var answerValue;
	var answerAlt;

	var app = "<h2>";
	app += question + "<br>";
	app += "</h2>";

	for (var i = 0; i < inputSplit.length; i++) {

		answerValue = inputSplit[i].charAt(inputSplit[i].length - 1); // tar sista karaktären i strängen (a=2, answerValue = 2)
		answerAlt = inputSplit[i].charAt(0); // tar första karaktären
		app += "<input type='checkbox' value='" + answerValue + "' id='" + answerAlt + "' onchange='displayCheckedBoxes();'>" + answerValue + "</input>";
		app += "<br>";
	}

	app += "<span id='displayAnswers'></span>";
	app += "<br>";
	app += "<section class='bottom'><button class='submit' onclick='checkAnswer();'>Submit</button></section>";

	document.getElementById("content").appendChild(app);
}

function getCheckedBoxes() {
	// Loopar igenom objekt (checkboxes i vårt fall) och gör funktioner utav de. Nu returnerar vi värdet(value) på varje checkbox som är i-bockad.
	var answers = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checked => +checked.value);

	return answers; // returnerar de värden på de checkboxes som är i-bockade.
}
// Visar upp de svaren som är i-bockade
function displayCheckedBoxes() {
	var answers = getCheckedBoxes();
	document.getElementById('displayAnswers').textContent = 'You chose answer(s): ' + answers;
}
