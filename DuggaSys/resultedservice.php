<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid=1;
	$loginname="UNK";
	$lastname="UNK";
	$firstname="UNK";
}


$courseid = getOP('courseid');
$opt = getOP('opt');
$cid = getOP('cid');
$tableInfo = array();
$duggaFilterOptions = array();
//$returnArray = array();


logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "resultedservice.php",$userid,$info);

// Get hash
$query = $pdo->prepare("SELECT hash, password, grade, submitted, moment FROM userAnswer WHERE userAnswer.cid=:cid");
$query->bindParam(':cid', $cid);

if(!$query->execute()) {
    $error=$query->errorInfo();
}

$query2 = $pdo->prepare("SELECT entryname, kind, lid, moment FROM listentries WHERE cid=:cid AND (kind=3 OR kind=4)");
$query2->bindParam(':cid', $cid);
$query2->execute();
$duggaFilterOptions = $query2->fetchAll();
$duggaName = "UNK";
$subCourse = "UNK";
//error_log($duggaFilterOptions[0]['moment']);

foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
	
	for($i=0; $i<sizeof($duggaFilterOptions); $i++){

		if($duggaFilterOptions[$i]['kind'] == 3 && $duggaFilterOptions[$i]['lid'] == $row['moment']){
			$duggaName = $duggaFilterOptions[$i]['entryname'];
			$j = $i;
			/*while($duggaFilterOptions[$j]['kind'] != 4){
				$j = $j-1;
			}*/
			$subCourse = $duggaFilterOptions[$j]['entryname'];
		}
	}



   foreach($duggaFilterOptions as $row2){
	//error_log($row2['moment']);
	error_log($row['moment']);

		if($row2['kind'] == 3 && $row2['lid'] == $row['moment']){
			$duggaName = $row2['entryname'];


		}else if($row2['lid'] == $row['moment']){
			error_log($row2['entryname']);
			$subCourse = $row2['entryname'];
		}
   }

    $tableSubmissionInfo = array(
        'duggaName' => $duggaName,
        'hash' => $row['hash'],
        'password' => $row['password'],
        'grade' => $row['grade'],
        'submitted' => $row['submitted'],
		'subCourse' => $subCourse
    );

    array_push($tableInfo, $tableSubmissionInfo);
}

$returnArray = array(
	'tableInfo' => $tableInfo,
	'duggaFilterOptions' => $duggaFilterOptions
);

echo json_encode($returnArray);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);

//$query = $pdo->prepare("SELECT listentries.entryname, course.coursename FROM listentries,course WHERE listentries.lid = :lid and listentries.cid = course.cid");