<?php

	date_default_timezone_set("Europe/Stockholm");


	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	pdoConnect();
	session_start();

	$pnr = getOP('ssn');
	$usernameSearch = getOP('usernameSearch');
	$wichQuery = getOP('query');

	//Query for snn
	$searchPnrQuery = "SELECT ssn,uid FROM user WHERE ssn LIKE '%{$pnr}%' ORDER BY ssn DESC";
	//Query for username
	$searchUsernameQuery = "SELECT uid,username FROM user WHERE username LIKE '%{$usernameSearch}%' ORDER BY username DESC";

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
							'ssn' => $row['ssn']
						)
					);
				}

				$retrievedData 	= array(
					'user'	=> $PnrSearchRes,
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
							'username' => $row['username']
						)
					);
				}

				$retrievedData 	= array(
					'user'	=> $PnrSearchRes,
				);
			}


	}
	echo json_encode($retrievedData);
