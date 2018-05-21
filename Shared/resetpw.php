<?php

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

include_once "../../coursesyspw.php";

$opt=getOP('opt');

if($opt=="GETQUESTION"){
	$username=getOP('username');
	$securityquestion=getOP('securityquestion');
  
  // Request barrier
  $maxRequestTries = 5;
  $log_db = new PDO('sqlite:../../log/loglena4.db');
  $IP = getIP();
  $timeInterval = 5; // in minutes

  $query = $GLOBALS['log_db']->prepare("SELECT COUNT(*) FROM userLogEntries
    WHERE eventType = 12
    AND remoteAddress = :IP
    AND timestamp > DATETIME(DATETIME('NOW'), :timeInterval)");
  $query->bindParam(':IP', $IP);
  $query->bindValue(':timeInterval', '-' . $timeInterval . ' minute');

  if(!$query->execute()) {
    $error=$query->errorInfo();
    $debug="Error counting rows".$error[2];
  } else {
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $queryResult = $result['COUNT(*)'];
  }

	pdoConnect(); // Makes sure it actually connects to a database

	// Default values
	$res = array("getname" => "failed");
	$res = array("securityquestion" => "undefined");
  if($queryResult < $maxRequestTries){
    if(getQuestion($username)){
		$res["getname"] = "success";
		$res["username"] = $username;
		$res["securityquestion"] = $_SESSION["securityquestion"];
    }else{
      $res["getname"] = $_SESSION["getname"];
      logUserEvent($username,EventTypes::RequestNewPW,"");
    }
  }else{
    $res["getname"] = "limit";
  }
	
	
	echo json_encode($res);

}else if($opt=="CHECKANSWER"){	
	$username=getOP('username');
	$securityquestionanswer=getOP('securityquestionanswer');

	pdoConnect(); // Makse sure it actually connects to a database

	// Default values
	$res = array("checkanswer" => "failed");

	if(checkAnswer($username, $securityquestionanswer)){
		$res["checkanswer"] = "success";
		$res["username"] = $username;
	}else{
		$res["checkanswer"] = "failure";
	}
	
	echo json_encode($res);

}else if($opt=="REQUESTCHANGE"){
	$username=getOP('username');

	pdoConnect(); // Makes sure it actually connects to a database

	// Default values
	$res = array("requestchange" => "failed");

	if(requestChange($username)){
		$res["requestchange"] = "success";
		$res["username"] = $username;
	}else{
		$res["requestchange"] = "failure";
	}

	echo json_encode($res);
}
	
?>