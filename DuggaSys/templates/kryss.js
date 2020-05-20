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
function quiz(parameters) {
	if(parameters != undefined) {
		console.log("pram:" + parameters);
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

		app += "<button class='submit' style='margin:15px;' onclick='checkQuizAnswer();'>Check answers</button>";
		
		$("#output").html(app);
	}
	else {
		historyBack();
		setTimeout(function(){
			dangerBox('Problem loading quiz', 'This quiz has no parameters in order to show it.</br>Contact quiz author or admin.');
		}, 500);
	}

	
}

//----------------------------------------------------------------------------------
// Setup - writes out the questions
//----------------------------------------------------------------------------------

function setup()
{
		AJAXService("GETPARAM",{ },"PDUGGA");
}
//----------------------------------------------------------------------------------
// returnedDugga: callback from ajax call in setup, data is json
//----------------------------------------------------------------------------------

function returnedDugga(data)
{	
	variant = data['variant'];
	if(querystring['highscoremode'] == 1) {
		Timer.startTimer();
	} else if (querystring['highscoremode'] == 2) {
		ClickCounter.initialize();
	}

	console.log(data['param']);
	var output ="";
	if(data['debug']!="NONE!") alert(data['debug']);

	if(data['param']!="UNK"){
		quiz(data['param']);
		//Add onclick event 
		if(querystring['highscoremode'] == 2) {
			$("input:radio").click(function(){
				ClickCounter.onClick();
			});
		}
	}		
	displayDuggaStatus(data["answer"],data["grade"],data["submitted"],data["marked"]);
}
//----------------------------------------------------------------------------------
// getCheckedBoxes: checks if all questions are answered and alerts each of them
//----------------------------------------------------------------------------------
function getCheckedBoxes(){

		var answers = $.map($("input:radio[name='answers"+idunique+"']:checked"), function(checked, i) {
			return checked.value;
		});
		return answers; // returnerar de värden på de checkboxes som är i-bockade.

	}
	function checkQuizAnswer(){
		for(var t = 1;t <= idunique; t++){
			alert("question "+t+ ": "+$("input[type='radio'][name='answers"+t+"']:checked").attr('id'));
		}
	}

function saveClick()
{
var answer ="";
	for(var t = 1;t <= idunique; t++){
	answer+= ($("input[type='radio'][name='answers"+t+"']:checked").attr('id')) + ",";
	}
idunique = 0;
		// Duggastr includes only the local information, duggasys adds the dugga number and the rest of the information.
		savequizResult(answer, variant);
}

//----------------------------------------------------------------------------------
// Shows the facit in page resulted.php
//----------------------------------------------------------------------------------
var allanswers = "";
var theanswers ="";
function showFacit(param, uanswer, danswer)
{
	AJAXService("GETVARIANTANSWER",{ setanswer:uanswer},"VARIANTPDUGGA");
	var splited = uanswer.split(" ");
	allanswers =  splited[4];
}

function returnedanswersDugga(data){
theanswers= data['param'];
var checkifcorrect ="Answered: ";


var theanswerSplit = theanswers.split(",");
var answeredSplit = allanswers.split(",");

	for(var i = 0;i < answeredSplit.length;i++){
		if(theanswerSplit[i] == answeredSplit[i]){
	
			checkifcorrect += "<span style ='color:green'>"+answeredSplit[i] + ' </span>';
		}else{
			checkifcorrect +=  "<span style ='color:red'>"+answeredSplit[i] + ' </span>';
		}
	}

	var yoloswag = "Answered: " + theanswers;
$("#output").html(checkifcorrect+"</br>"+yoloswag);
}
function closeFacit(){

}

//----------------------------------------------------------------------------------
// show/hide dugga instructions
//----------------------------------------------------------------------------------
function toggleInstructions()
{
    $(".instructions-content").slideToggle("slow");
}

