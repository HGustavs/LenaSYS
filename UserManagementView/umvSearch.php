<?php

	date_default_timezone_set("Europe/Stockholm");


	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	pdoConnect();
	session_start();

	$pnr = getOP('ssn');
	$wichQuery = getOP('query');
	$class = getOP('classID');
	$usernameSearch = getOP('usernameSearch');
	$debug = "DEFAULT";
	
	$retrievedData = array();

	//Query for snn
	$searchPnrQuery = "SELECT ssn,uid,username FROM user WHERE ssn LIKE '%{$pnr}%' AND superuser IS NULL AND class = '{$class}' ORDER BY ssn DESC";
	//Query for username
	$searchUsernameQuery = "SELECT uid,username,ssn FROM user WHERE username LIKE '%{$usernameSearch}%' AND superuser IS NULL AND class = '{$class}' ORDER BY username DESC";

	//Case 1 searching for snn
	if($wichQuery == 1){
			$query = $pdo->prepare($searchPnrQuery);

			$PnrSearchRes = array();
		
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			
			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
					array_push(
						$PnrSearchRes,
						array(
							'uid' => $row['uid'],
							'username' => $row['username'],
							'ssn' => $row['ssn']
						)
					);
				}

				$retrievedData 	= array(
					'user'	=> $PnrSearchRes,
					'debug' => $debug
				);
			}
	//Case 2 searching for username 
	}if($wichQuery==2){

			$query = $pdo->prepare($searchUsernameQuery);

			$PnrSearchRes = array();
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 

			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
					array_push(
						$PnrSearchRes,
						array(
							'uid' => $row['uid'],
							'ssn' => $row['ssn'],
							'username' => $row['username']
						)
					);
				}

				$retrievedData 	= array(
					'user'	=> $PnrSearchRes,
					'debug' => $debug
				);
			}


	}
	echo json_encode($retrievedData);

?>