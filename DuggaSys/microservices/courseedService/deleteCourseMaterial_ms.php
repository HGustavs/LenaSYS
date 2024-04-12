<?php
// This micro service deletes all courses and course material where visibility is 3 

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once ("../../../Shared/sessions.php");

// Connect to database and start session
pdoConnect();
session_start();

//Delete course matterial from courses that have been marked as deleted.
$deleted = 3;

//partresult
$query = $pdo->prepare("DELETE partresult FROM course,partresult WHERE course.visibility=:deleted AND partresult.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//Subparts
$query = $pdo->prepare("DELETE subparts FROM course,subparts WHERE course.visibility=:deleted AND subparts.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//improw
$query = $pdo->prepare("DELETE improw FROM improw,box,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid = box.exampleid AND box.boxid = improw.boxid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses\n".$error[2];
} 


//box
$query = $pdo->prepare("DELETE box FROM box,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid=box.exampleid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses\n".$error[2];
} 

//impwordlist
$query = $pdo->prepare("DELETE impwordlist FROM impwordlist,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid=impwordlist.exampleid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses\n".$error[2];
} 

//codeexample
$query = $pdo->prepare("DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//user_participant
$query = $pdo->prepare("DELETE user_participant FROM user_participant,course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid AND listentries.lid = user_participant.lid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses\n".$error[2];
} 

//useranswer
$query = $pdo->prepare("DELETE useranswer FROM course,useranswer WHERE course.visibility=:deleted AND useranswer.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//listentries
$query = $pdo->prepare("DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//timesheet
$query = $pdo->prepare("DELETE timesheet FROM course,timesheet WHERE course.visibility=:deleted AND timesheet.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//variant
$query = $pdo->prepare("DELETE variant FROM variant,course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid AND quiz.id = variant.quizID;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error reading courses\n".$error[2];
}

//quiz
$query = $pdo->prepare("DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//vers
$query = $pdo->prepare("DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//filelink
$query = $pdo->prepare("DELETE filelink FROM course,filelink WHERE course.visibility=:deleted AND filelink.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//programcourse
$query = $pdo->prepare("DELETE programcourse FROM course,programcourse WHERE course.visibility=:deleted AND programcourse.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//user_course
$query = $pdo->prepare("DELETE user_course FROM course,user_course WHERE course.visibility=:deleted AND user_course.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}


//course_req
$query = $pdo->prepare("DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

$query = $pdo->prepare("DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.req_cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//coursekeys
$query = $pdo->prepare("DELETE coursekeys FROM course,coursekeys WHERE course.visibility=:deleted AND coursekeys.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

//Delete Courses that have been marked as deleted.
$query = $pdo->prepare("DELETE course FROM course WHERE visibility=:deleted;");
$query->bindParam(':deleted', $deleted);
if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error reading courses\n" . $error[2];
}

?>