<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../sharedMicroservices/getUid_ms.php";
include_once "../curlService.php";


// Connect to database and start session
pdoConnect();
session_start();

$coursevers=getOP('vers');
$opt = getOP('opt');
$cid = getOP('cid');
$tableInfo = array();
$duggaFilterOptions = array();
$duggaName = "UNK";
$subCourse = "UNK";
$userid = getUid();

if(isSuperUser($userid) || hasAccess($userid, $cid, 'w')){
	// Get data to display in table rows
	$query = $pdo->prepare("SELECT hash, password, submitted, timesSubmitted, timesAccessed, moment,last_Time_techer_visited FROM userAnswer WHERE cid=:cid AND vers=:vers");

	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $coursevers);

	if(!$query->execute()) {
    	$error=$query->errorInfo();
	}

	// Get filter options
	$query2 = $pdo->prepare("SELECT entryname, kind, lid, moment FROM listentries WHERE cid=:cid AND vers=:vers AND (kind=3)");
	$query2->bindParam(':cid', $cid);
	$query2->bindParam(':vers', $coursevers);
	$query2->execute();
	if(!$query2->execute()) {
    	$error=$query2->errorInfo();
    }else{
	    $duggaFilterOptions = $query2->fetchAll();
    }

	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
	
		foreach($duggaFilterOptions as $row2){

			/* if($row2['kind'] == 4){ // Code to add subcourse to tableInfo from duggaFilterOptions array
				$subCourse = $row2['entryname'];
			} */

			if($row2['kind'] == 3 && $row2['lid'] == $row['moment']){ // Get the "proper" name from listentries
				$duggaName = $row2['entryname'];
				break;
			}
		}

    	$tableSubmissionInfo = array(
        	'duggaName' => $duggaName,
        	'hash' => $row['hash'],
        	'password' => $row['password'],
        	'teacher_visited' => $row['last_Time_techer_visited'],
        	'submitted' => $row['submitted'],
			'timesSubmitted' => $row['timesSubmitted'],
			'timesAccessed' => $row['timesAccessed'],
			'subCourse' => $subCourse,
			'link' => "UNK"
    	);

    	array_push($tableInfo, $tableSubmissionInfo);
	}
	/*
    // Set up POST call to retrieveResultedService_ms.php
    header("Content-Type: application/json");
    $baseURL = "http://" . $_SERVER['HTTP_HOST'];  // use http when testing locally
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/resultedService/retrieveResultedService_ms.php";

    $ch = curl_init($url);

    // cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'tableInfo' => json_encode($tableInfo),
        'duggaFilterOptions' => json_encode($duggaFilterOptions)
    ]));

    // Execute and get response
    $response = curl_exec($ch);
    curl_close($ch);
	*/
	//Use curlService to make HTTP POST call
	 $postData = [
    'tableInfo' => json_encode($tableInfo),
    'duggaFilterOptions' => json_encode($duggaFilterOptions)
 	];
	$response = callMicroservicePOST("resultedService/retrieveResultedService_ms.php", $postData, true );
	$data = json_decode($response, true);

    // Send the data to frontend
    echo $data;
}
