
var qObjectID="TEST1";
//var quizNR=1;

 $(document).ready(function() {
	//quizNR=$("#quizNR").val();
	//console.log("changed:"+$("#quizNR").val());
	//$("#quizNR").change(function(e){quizNR=$("#quizNR").val();console.log("changed:"+$("#quizNR").val());});
	$("#button1").click(fetchQuiz);
	$("#button2").click(function(e){qObjectID="TEST1";fetchQuizObject(e);});
	$("#button3").click(function(e){qObjectID="TEST2";fetchQuizObject(e);});
	$("#button4").click(function(e){qObjectID="TEST3";fetchQuizObject(e);});
	$("#button5").click(function(e){qObjectID="TEST4";fetchQuizObject(e);});
	$("#button6").click(function(e){qObjectID="TEST5";fetchQuizObject(e);});
	$("#button7").click(function(e){qObjectID="TEST6";fetchQuizObject(e);});
	$("#getRegistrations").click(function(e){getRegistrations(e);});
	$("#checkRegistration").click(function(e){checkRegistration(e);});
	$("#answerButton").click(function(e){checkAnswer(e);});
});

//answerQuiz.php
//////Parameters: loginName, password, courseName, courseOccasion, quizNr, qVarNr, quizAnswer
function checkAnswer(e){
	console.log("answerQuiz post");
	var loginName="a02leifo";
		password="56edf750f3bb2053b3c1c44429b3ce82";
		courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
		courseOccasion="HT-12 LP1";
		quizNr=$("#quizNR").val();
		qVarNr=$("#qVarNr").val();
		
	if($("#loginName").val()!="") loginName=$("#loginName").val();
	if($("#password").val()!="") loginName=$("#password").val();
	
	$.post("answerQuiz.php", 
	       {loginName: loginName, password: password, courseName: courseName, courseOccasion: courseOccasion, quizNr: quizNr, qVarNr: qVarNr, quizAnswer: $("#quizAnswer").val() }, 
			callBackcheckAnswer,
			"json"
	);
}

function callBackcheckAnswer(data){
	console.log("callBackcheckAnswer:");
	console.log(data);
	$("#result").append("<h3>answer data:"+data+"</h3>");
}

function getRegistrations(e){
	console.log("getStudentCourseRegistrations post");
	var loginName="a02leifo";
	var password="56edf750f3bb2053b3c1c44429b3ce82";
	if($("#loginName").val()!="") loginName=$("#loginName").val();
	if($("#password").val()!="") loginName=$("#password").val();
	
	$.post("getStudentCourseRegistrations.php", 
	       {loginName: loginName, password: password}, 
			callBackCourseRegistrations,
			"json"
	);
}

function checkRegistration(e){
	//checkStudentCourseOccasion.php
	console.log("checkStudentCourseOccasion post");
	////Parameters: loginName, password, courseName, semester (e.g. HT), year (e.g. 12), period (e.g. 1,2,3,4 or 5)
	var loginName="a02leifo";
		password="56edf750f3bb2053b3c1c44429b3ce82";
		courseName="DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)";
		semester="HT";
		year="12";
		period="1";
	$.post("checkStudentCourseOccasion.php", 
	       {loginName: loginName, password: password, courseName: courseName, semester: semester, year:year, period:period}, 
			callBackCheckRegistration,
			"json"
	);
}

function callBackCheckRegistration(data){
	console.log("callBackCheckRegistration:");
	console.log(data);
	$("#result").append("<h3>Is registered for selected course occasion:"+data.loginSuccess+"</h3>");
}

function callBackCourseRegistrations(data){
	if(data.loginSuccess=="true"){
		$("#result").append(data.loginSuccess);
		$("#result").append("<h3>Course registrations</h3><ul>");
		for(var i=0;i<data.courseRegistrations.length;i++){
				$("#result").append("<li>"+data.courseRegistrations[i].courseName+" "+data.courseRegistrations[i].courseOccasion+"</li>");
		}
		$("#result").append("</ul>");
	} else {
		$("#result").append("<h3>Login failed</h3>");
	}
}

//login, password, courseName, courseOccasion, quizNr
function fetchQuiz(e){
	console.log("post fetchQuiz "+$("#quizNR").val());
	$.post("getQuiz.php", 
	       {login: "a02leifo", password: "56edf750f3bb2053b3c1c44429b3ce82", courseName: "DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)", courseOccasion: "HT-12 LP1", quizNr: $("#quizNR").val() }, 
			callBackTest,
			"json"
	);
}

function callBackTest(data){
	console.log(data);
	if (typeof data.Error != 'undefined') {
		$("#result").append("<br/><h3>Error:"+data.Error+"</h3>");
	} else {
		$("#result").append("<br/>Dugga nr:"+data.quizNr);
		$("#result").append("<br/>Variant nr:"+data.qVarNr);
		$("#result").append("<br/>Kursnamn:"+data.quizCourseName);
		$("#result").append("<br/>Lista över dugga-objekt:"+data.quizObjectIDs);
		$("#result").append("<br/>Data:"+data.quizData);
	}
}

//////Parameters: (POST) objectID, quizNr, qVarNr, courseName, courseOccasion, login, password
function fetchQuizObject(e){
	console.log("post fetchQuizObject");
	$.post("getQuizObject.php", 
	       {objectID: qObjectID, courseName: "DA133G Webbutveckling - datorgrafik G1N, 7,5hp (IKI)", courseOccasion: "HT-12 LP1", quizNr: $("#quizNR").val(), qVarNr: "1", login: "a02leifo", password: "56edf750f3bb2053b3c1c44429b3ce82" }, 
			callBackObjectTest,
			"json"
	);
}

function callBackObjectTest(data){
	if (typeof data.Error != 'undefined') {
		$("#result").append("<br/><h3>Error:"+data.Error+"</h3>");
	} else {
		$("#result").append(data.objectData);
	}
}