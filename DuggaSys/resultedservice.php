<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

$coursevers=getOP('vers');
$opt = getOP('opt');
$cid = getOP('cid');
$tableInfo = array();
$duggaFilterOptions = array();
//$returnArray = array();


logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "resultedservice.php",$userid,$info);

// Get hash
$query = $pdo->prepare("SELECT hash, password, grade, submitted, moment FROM userAnswer WHERE cid=:cid AND vers=:vers");
$query->bindParam(':cid', $cid);
$query->bindParam(':vers', $coursevers);

if(!$query->execute()) {
    $error=$query->errorInfo();
}

$query2 = $pdo->prepare("SELECT entryname, kind, lid, moment FROM listentries WHERE cid=:cid AND vers=:vers AND (kind=3)");
$query2->bindParam(':cid', $cid);
$query2->bindParam(':vers', $coursevers);
$query2->execute();
$duggaFilterOptions = $query2->fetchAll();
$duggaName = "UNK";
$subCourse = "UNK";

foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
	
	foreach($duggaFilterOptions as $row2){

		if($row2['kind'] == 4){
			$subCourse = $row2['entryname'];
		}

		if($row2['kind'] == 3 && $row2['lid'] == $row['moment']){
			$duggaName = $row2['entryname'];
			break;
		}
	}


    $tableSubmissionInfo = array(
        'duggaName' => $duggaName,
        'hash' => $row['hash'],
        'password' => $row['password'],
        'grade' => $row['grade'],
        'submitted' => $row['submitted'],
		'subCourse' => $subCourse,
		'link' => "UNK"
    );

    array_push($tableInfo, $tableSubmissionInfo);
}

$returnArray = array(
	'tableInfo' => $tableInfo,
	'duggaFilterOptions' => $duggaFilterOptions
);

echo json_encode($returnArray);

logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "resultedservice.php",$userid,$info);
