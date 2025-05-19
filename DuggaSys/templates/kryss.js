/*
THIS IS A QUIZTEMPLATE
DO NOT CHANGE THE QUIZ MAIN FUNCTION NAME AND PARAMETER, IT SHOULD ALWAYS BE THE SAME.
quiz(parameters)

In the documentation tag below, you can give a description of how to use the template parameters. 
This description will be visible on the interface for adding or change a quiz.

/********************************************************************************

   Documentation 

*********************************************************************************
This template separates each question between : and then separates each parameter between : within the question,
Example seed
---------------------
	Param:  {question*Who is the best soccer player: A*Zlatan: B *Hysen: C*Robin: D*Aslan}
	Answer: A
-------------==============######## Documentation End ###########==============-------------
*/
var idunique = 0;
var variant = "UNK";
var prevAnswer;

function quiz(parameters) {
	if(parameters != undefined) {
	//console.log("pram:" + parameters);
		parameters = parameters.replace(/NONE!/g, '');
		parameters = parameters.replace(/{/g, '');
		var qeustionsplit = parameters.split("}");
		var answerValue;
		var answerID;
		var app ="";
		app+="<div class='quiz-header'><h1>Quiz</h1></div>";
		for(var iy = 0;iy < qeustionsplit.length - 1;iy++){
			idunique++;
			var inputSplit = qeustionsplit[iy].split(":");
			//app += idunique+" -----------------------------------------------------";
			for(var i = 0;i < inputSplit.length;i++){
				
				var splited = inputSplit[i].split('"');
				answerID= splited[0].trim();
				answerValue = splited[1];
				answerID = answerID.replace(/^\s+|\s+$/g, '') ;
				
				if((answerID == "question")||(answerID == "NONE!question")) {
					app += "<div class='quiz-question'>";
					app += "<h3>";
					app += "<div class='quiz-question-number'>" + idunique +"</div>" + answerValue;
					app += "</h3>";
					app += "</div>";
				}
				else {
					app += "<div class='quiz-answer'>";
					app += "<input type='radio' name='answers"+idunique+"' value='"+answerValue+"' id='"+answerID+"'>" +answerValue+"</input>";
					app += "<br>";
					app += "</div>";
				}
			}
		}
		
		document.getElementById("output").innerHTML = app;
	} else {
		historyBack();
		setTimeout(function(){
			dangerBox('Problem loading quiz', 'This quiz has no parameters in order to show it.</br>Contact quiz author or admin.');
		}, 500);
	}
}

//----------------------------------------------------------------------------------
// Setup - writes out the questions
//----------------------------------------------------------------------------------

function setup() {
		AJAXService("GETPARAM",{ },"PDUGGA");
}
//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data) {	
	variant = data['variant'];
	if(querystring['highscoremode'] == 1) {
		Timer.startTimer();
	} else if (querystring['highscoremode'] == 2) {
		ClickCounter.initialize();
	}

	//console.log(data['param']);
	var output ="";
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['param']!="UNK"){
		quiz(data['param']);
		//Add onclick event 
		if(querystring['highscoremode'] == 2 ||querystring['highscoremode'] == 1) {
			document.querySelectorAll("input[type='radio']").forEach(function (radio) {
				radio.addEventListener("click", function () {
					ClickCounter.onClick();
				});
			});
		}
	}		
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"],data["duggaTitle"]);

	// Get answer from previously saved dugga
	if (data.answer != "UNK") {
		// Get the id from answer string
		var str = data.answer;
		var res = str.split(" ");
		var answer = res[res.length - 1];
		answer = answer.slice(0, answer.length - 1);
		setChecked(answer);
	}
}


//----------------------------------------------------------------------------------
// setChecked: sets an element by id property to "checked"
//----------------------------------------------------------------------------------
function setChecked(id) {
	var element = document.getElementById(id).checked = true;
}

//----------------------------------------------------------------------------------
// getCheckedBoxes: checks if all questions are answered and alerts each of them
//----------------------------------------------------------------------------------
function getCheckedBoxes() {
	const answers = Array.from(document.querySelectorAll(`input[type='radio'][name='answers${idunique}']:checked`)).map(checked => checked.value);
	return answers; // returnerar de värden på de checkboxes som är i-bockade.

}

function reset() {
	Timer.stopTimer();
	Timer.score=0;
	Timer.startTimer();
	ClickCounter.initialize();

	var answers = document.getElementsByName("answers"+idunique);
	for(i = 0; i < answers.length; i++){
		answers[i].checked = false;
	}
}

function saveClick() {
	$.ajax({									//Ajax call to see if the new hash have a match with any hash in the database.
		url: "showDuggaservice.php",
		type: "POST",
		data: "&hash="+hash, 					//This ajax call is only to refresh the userAnswer database query.
		dataType: "json",
		success: function(data) {
			ishashindb = data['ishashindb'];	//Ajax call return - ishashindb == true: not unique hash, ishashindb == false: unique hash.
			if(ishashindb==true && blockhashgen ==true || ishashindb==true && blockhashgen ==false && ishashinurl==true || ishashindb==true && locallystoredhash != "null"){				//If the hash already exist in database.
				if (confirm("You already have a saved version!")) {
					Timer.stopTimer();

					timeUsed = Timer.score;
					stepsUsed = ClickCounter.score;

					if (querystring['highscoremode'] == 1) {	
						score = Timer.score;
					} else if (querystring['highscoremode'] == 2) {
						score = ClickCounter.score;
					}

					var answer ="";
					for(var t = 1;t <= idunique; t++){
						answer+= ($("input[type='radio'][name='answers"+t+"']:checked").attr('id')) + ",";
					}
		
					idunique = 0;
					// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
					answer = variant + " " + answer;
					saveDuggaResult(answer);
				}
			} else {                            //If it's the first time we save with this hash
				Timer.stopTimer();

				timeUsed = Timer.score;
				stepsUsed = ClickCounter.score;

				if (querystring['highscoremode'] == 1) {	
					score = Timer.score;
				} else if (querystring['highscoremode'] == 2) {
					score = ClickCounter.score;
				}

				var answer ="";
				for(var t = 1;t <= idunique; t++){
					answer+= ($("input[type='radio'][name='answers"+t+"']:checked").attr('id')) + ",";
				}
				idunique = 0;
				// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
				answer = variant + " " + answer;
				saveDuggaResult(answer);
			}
		}
	});
}

//----------------------------------------------------------------------------------
// Shows the facit in page resulted.php
//----------------------------------------------------------------------------------
var allanswers = "";
var theanswers ="";
function showFacit(param, uanswer, danswer) {
	quiz(param);
	AJAXService("GETVARIANTANSWER",{ setanswer:uanswer},"VARIANTPDUGGA");
	var splited = uanswer.split(" ");
	allanswers =  splited[4];
}

function returnedanswersDugga(data) {
	theanswers= data['param'];
	var checkifcorrect ="Answered: ";

	var theanswerSplit = theanswers.split(" ");
	var answeredSplit = allanswers.split(",");

	for(var i = 0;i < answeredSplit.length;i++){
		if(theanswerSplit[i] == answeredSplit[i]){
	
			checkifcorrect += "<span style ='color:green'>"+answeredSplit[i] + ' </span>';
		}else{
			checkifcorrect +=  "<span style ='color:red'>"+answeredSplit[i] + ' </span>';
		}
	}

	var yoloswag = "Answered: " + theanswers;
	document.getElementById("output").innerHTML += checkifcorrect + "</br>" + yoloswag;
}

function closeFacit() {

}

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------
function toggleInstructions() {
	const element = document.querySelector(".instructions-content");

	if (getComputedStyle(element).display === "none") {
		element.style.display = "block";
	} else {
		element.style.display = "none";
	}

}

