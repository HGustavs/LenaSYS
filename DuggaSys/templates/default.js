function loadQuestion(alternativ, question){

	var inputSplit = alternativ.split(",");
	var answerValue;
	var answerAlt;

	var app = "<h2>";
	app += question + "<br>";
	app += "</h2>";

	for(var i = 0;i < inputSplit.length;i++){
	  
		answerValue = inputSplit[i].charAt(inputSplit[i].length-1); // tar sista karaktären i strängen (a=2, answerValue = 2)
		answerAlt = inputSplit[i].charAt(0); // tar första karaktären
		app += "<input type='checkbox' value='"+answerValue+"' id='"+answerAlt+"' onchange='displayCheckedBoxes();'>"+answerValue+"</input>";
		app += "<br>";
	}

	app += "<span id='displayAnswers'></span>";
	app += "<br>";
	app += "<section class='bottom'><button class='submit' onclick='checkAnswer();'>Submit</button></section>";

    document.getElementById("content").insertAdjacentHTML("beforeend", app);

}

function getCheckedBoxes() {
    var checked = document.querySelectorAll('input[type="checkbox"]:checked');   
	return Array.from(checked, el => +el.value); // gör om string till tal
}

function displayCheckedBoxes() {
    var answers = getCheckedBoxes();
    document.getElementById("displayAnswers").textContent = "You choose answer(s): " + answers;
}