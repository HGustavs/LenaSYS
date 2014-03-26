
var quizData = {};

function fetchQuiz(){
    $.post(ajaxPath + "getQuiz.php",
        {loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr },
        fetchQuizCallBack,
        "json"
    );
}

function fetchQuizCallBack(data){
    if (typeof data.Error != 'undefined') {
        $("#result").html("<p>"+data.Error+"</p>");
        if(typeof data.answerHash != 'undefined'){
            $("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
        }
    } else {
        $("#quizInstructions").append(data.quizData);
//        quizObjectsIDs=data.quizObjectIDs.split(" ");
//        if(data.storedAnswer!=null && startString=="") startString=data.storedAnswer;
        fetchQuizObject("goal"); // Get template background image for this quiz variant.
    }
}

function fetchQuizObject(objectName){
    $.post(ajaxPath + "getQuizObject.php",
        {objectID: objectName, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, loginName: account, adminQuizVariant: adminQuizVariant },
        fetchQuizObjectCallBack,
        "json"
    );
}

var objectData;
function fetchQuizObjectCallBack(data){
    console.log("Got object data")
    objectData = data;
    if (typeof data.Error != 'undefined') {
        $("#result").append("<br/><h3>Error:"+data.Error+"</h3>");
    } else {
        goal = data.objectData;
        createGoalObject(data.objectData);
    }
}

function checkAnswer(submitstr){
    $.post(ajaxPath+"answerQuiz.php",
        {loginName: account, courseName: courseName, courseOccasion: courseOccasion, quizNr: duggaNr, quizAnswer: submitstr},
        checkAnswerCallBack,
        "json"
    );
}

function checkAnswerCallBack(data){
    if (typeof data.Error != 'undefined') {
        $("#result").css("background-color","#ffcccc");
        $("#result").html("<p>"+data.Error+"</p>");
        if(typeof data.answerHash != 'undefined'){
            $("#result").append("<p>Svarskod: "+data.answerHash.substr(0,8)+"</p>");
        }
    } else {
        /*if(data.isCorrect=="false"){
         $("#result").css("background-color","#ffcccc");
         $("#result").html("Du har tyvärr svarat fel");
         } else {
         $("#result").css("background-color","#ccffcc");
         $("#result").html("Du har svarat rätt");
         $("#result").append("<br />Din svarskod:"+data.hashedAnswer);
         $("#result").append("<br />Spara alltid din svarskod!");
         */
        if(data.Success=="false"){
            $("#result").css("background-color","#ffcccc");
            $("#result").append("<br />Ett problem har uppstått, ditt svar har inte sparats. Det är mycket viktigt att du sparar din svarskod och kontaktar kursansvarige omgående.");
            $("#result").append("<br />Din svarskod:"+data.hashedAnswer);
        } else {
            $("#result").css("background-color","#ccffcc");
            $("#result").html("Your answer has been stored.");
            $("#result").append("<br />Answer receipt:"+data.hashedAnswer);
            $("#result").append("<br />");
        }
        //}

    }
}

