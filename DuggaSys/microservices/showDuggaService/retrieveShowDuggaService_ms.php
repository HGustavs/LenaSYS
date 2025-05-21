<?php

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

pdoConnect();
session_start();

$data = recieveMicroservicePOST([
    'moment',
    'courseid',
    'hash',
    'hashpwd',
    'coursevers',
    'duggaid',
    'opt',
    'group',
    'score',
    'highscoremode',
    'grade',
    'submitted',
    'duggainfo',
    'marked',
    'userfeedback',
    'feedbackquestion',
    'savedvariant',
    'ishashindb',
    'variantsize',
    'variantvalue',
    'password',
    'hashvariant',
    'isFileSubmitted',
    'variants',
    'active',
    'debug',
]);


$moment = $data['moment'] ?? null;
$courseid= $data['courseid'] ?? null;
$hash = $data['hash'] ?? null;
$hashpwd = $data['hashpwd'] ?? null;
$coursevers = $data['coursevers'] ?? null;
$duggaid = $data['duggaid'] ?? null;
$opt = $data['opt'] ?? null;
$group = $data['group'] ?? null;
$score = $data['score'] ?? null;
$highscoremode = $data['highscoremode'] ?? null;
$grade = $data['grade'] ?? null;
$submitted = $data['submitted'] ?? null;
$duggainfo = $data['duggainfo'] ?? [];
$marked = $data['marked'] ?? false;
$userfeedback = $data['userfeedback'] ?? '';
$feedbackquestion = $data['feedbackquestion'] ?? '';
$savedvariant = $data['savedvariant'] ?? 'UNK';
$ishashindb = $data['ishashindb'] ?? false;
$variantsize = $data['variantsize'] ?? 'UNK';
$variantvalue = $data['variantvalue'] ?? 'UNK';
$password = $data['password'] ?? ($data['hashpwd'] ?? null);
$hashvariant = $data['hashvariant'] ?? 'UNK';
$isFileSubmitted = $data['isFileSubmitted']  ?? false;
$variants = $data['variants'] ?? [];
$active = $data['active'] ?? 0;
$debug = $data['debug'] ?? 'NONE!';


	if(checklogin()){
		if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
			$loginname=$_SESSION['loginname'];
			$lastname=$_SESSION['lastname'];
			$firstname=$_SESSION['firstname'];
		}else{
			$userid="guest";		
		} 	
	}
	
	if(isSuperUser($userid)){
		$isTeacher=1;
	}else{
		$isTeacher=0;
	}

	unset($variant);
	unset($answer);
	unset($variantanswer);
	unset($param);
	if (isSuperUser($userid)){
		if($hash!="UNK"){
			$postData = [
    			'hash'      => $hash,
    			'moment'    => $moment,
    			'courseid'  => $courseid,
    			'hashpwd'   => $hashpwd,
    			'coursevers'=> $coursevers,
    			'duggaid'   => $duggaid,
    			'opt'       => $opt,
    			'group'     => $group,
    			'score'     => $score
    		];
			$response = callMicroservicePOST("showDuggaService/processDuggaFile_ms.php", $postData, true);
			
			$data = json_decode($response, true);
			$variant = $data['variant'];
			$answer = $data['answer'];
			$variantanswer = $data['variantanswer'];
			$param = $data['param'];
			$newcourseid = $data['newcourseid'];
			$newcoursevers = $data['newcoursevers'];
			$newduggaid = $data['newduggaid'];
			
			$sql="SELECT entryname FROM listentries WHERE lid=:moment";
			$query = $pdo->prepare($sql);
			$query->bindParam(':moment', $moment);
			$query->execute();
			foreach($query->fetchAll() as $row){
				$duggatitle=$row['entryname'];
			}

			if(isset($variant)){
				$_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
				$_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
				$_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
				$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";
				retrieveProcessDuggaFiles($courseid, $coursevers, $duggaid, $duggainfo, $moment);
			}else{
				$debug="[Superuser] Could not load dugga! no userAnswer entries with moment: $moment \nline 338 showDuggaservice.php";
				$variant="UNK";
				$answer="UNK";
				$variantanswer="UNK";
				$param=html_entity_decode('{}');
			}
		} else {
			$debug="[Superuser] Could not load dugga! Incorrect hash/password! $hash";
			$variant="UNK";
			$answer="UNK";
			$variantanswer="UNK";
			$param=html_entity_decode('{}');
		}
	}else{
		if(getOP('hash')!="UNK" && getOP('password')!="UNK"){
			$sql="SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash AND password=:hashpwd";
			$query = $pdo->prepare($sql);
			$query->bindParam(':hash', $hash);
			$query->bindParam(':hashpwd', $hashpwd);
			$query->execute();
			foreach($query->fetchAll() as $row){
				$variant=$row['vid'];
				$answer=$row['useranswer'];
				$variantanswer="UNK";
				$param=html_entity_decode($row['param']);
				$newcourseid=$row['cid'];
				$newcoursevers=$row['vers'];
				$newduggaid=$row['quiz'];
			}
			if(isset($variant)){
				$_SESSION["submission-$courseid-$newcoursevers-$newduggaid"]=$hash;
				$_SESSION["submission-password-$courseid-$newcoursevers-$newduggaid"]=$hashpwd;
				$_SESSION["submission-variant-$courseid-$newcoursevers-$newduggaid"]=$variant;
				$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "https") . "://$_SERVER[HTTP_HOST]/sh/?s=$hash";

				retrieveProcessDuggaFiles($courseid, $coursevers, $duggaid, $duggainfo, $moment);
			}else{
				$debug="[Guest] Could not load dugga! Incorrect hash/password submitted! $hash/$hashpwd";
				$variant="UNK";
				$answer="UNK";
				$variantanswer="UNK";
				$param=html_entity_decode('{}');
			}
		}else{
			if(	(isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
				isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
				isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]))){
		
				$tmphash=$_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
				$tmphashpwd=$_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
				$tmpvariant=$_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"];

				$sql="SELECT quiz.*, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd LEFT JOIN (select cid,link,entryname from listentries) as l ON l.cid=l.cid AND l.link=quiz.id WHERE quiz.id=:did AND vid=:variant AND l.cid=:cid LIMIT 1;";
				$query = $pdo->prepare($sql);
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':did', $duggaid);
				$query->bindParam(':variant', $tmpvariant);
				$query->bindParam(':hash', $tmphash);
				$query->bindParam(':hashpwd', $tmphashpwd);	
				$query->execute();
				foreach($query->fetchAll() as $row){
					$duggatitle=$row['dugga_title'];
					$variant=$row['vid'];
					$answer=$row['useranswer'];
					$variantanswer="UNK";
					$param=html_entity_decode($row['param']);
				}
				if(isset($param)){
					retrieveProcessDuggaFiles($courseid, $coursevers, $duggaid, $duggainfo, $moment);
				}else{
					$debug="[Guest] Missing hash/password/variant! Not found in db.";
					$variant="UNK";
					$answer="UNK";
					$variantanswer="UNK";
					$param=html_entity_decode('{}');
					unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
					unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
					unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
				}
			}else if (isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"]) && 
					isset($_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"]) && 
					isset($_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"])){
				
					$tmphash=$_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
					$tmphashpwd=$_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
					$tmpvariant=$_POST["submission-variant-$courseid-$coursevers-$duggaid-$moment"];

					$sql="SELECT quiz.*, variant.variantanswer, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd LEFT JOIN (select cid,link,entryname from listentries) as l ON l.cid=l.cid AND l.link=quiz.id WHERE quiz.id=:did AND vid=:variant AND l.cid=:cid LIMIT 1;";
					$query = $pdo->prepare($sql);
					$query->bindParam(':cid', $courseid);
					$query->bindParam(':did', $duggaid);
					$query->bindParam(':variant', $tmpvariant);
					$query->bindParam(':hash', $tmphash);
					$query->bindParam(':hashpwd', $tmphashpwd);	
					$query->execute();
					foreach($query->fetchAll() as $row){
						$duggatitle=$row['dugga_title'];
						$variant=$row['vid'];
						$answer=$row['useranswer'];
						$variantanswer=html_entity_decode($row['variantanswer']);
						$param=html_entity_decode($row['param']);
					}
			
					if(isset($param)){
						retrieveProcessDuggaFiles($courseid, $coursevers, $duggaid, $duggainfo, $moment);
					}else{
						$debug="[Guest] Missing hash/password/variant! Not found in db.";
						$variant="UNK";
						$answer="UNK";
						$variantanswer="UNK";
						$param=html_entity_decode('{}');
						unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
						unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
						unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);	
					}
			}
			else{
				$debug="[Guest] Missing hash/password/variant!";
				$variant="UNK";
				$answer="UNK";
				$variantanswer="UNK";
				$param=html_entity_decode('{}');
				unset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]);
				unset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]);
				unset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"]);
			}
		}
	}		

$array = array(
		"debug" => $debug,
		"param" => $param,
		"answer" => $answer,
		"danswer" => $variantanswer,
		"score" => $score,
		"highscoremode" => $highscoremode,
		"grade" => $grade,
		"submitted" => $submitted,
		"marked" => $marked,
		"deadline" => $duggainfo['deadline'],
		"release" => $duggainfo['qrelease'],
		"files" => $files,
		"userfeedback" => $userfeedback,
		"feedbackquestion" => $feedbackquestion,
		"variant" => $savedvariant,
		"ishashindb" => $ishashindb,
		"variantsize" => $variantsize,
		"variantvalue" => $variantvalue,
		"password" => $password,
		"hashvariant" => $hashvariant,
		"isFileSubmitted" => $isFileSubmitted,
		"isTeacher" => $isTeacher, // isTeacher is true for both teachers and superusers
		"variants" => $variants,
		"duggaTitle" => $duggatitle,
		"hash" => $hash,
		"hashpwd" => $hashpwd,
		"opt" => $opt,
		"link" => $link,
		"activeusers" => $active,

	);
	if (strcmp($opt, "GRPDUGGA")==0) $array["group"] = $group;

	echo json_encode($array);

function retrieveProcessDuggaFiles($courseid, $coursevers, $duggaid, $duggainfo, $moment){
	$postData = [
        'courseid' => $courseid,
        'coursevers' => $coursevers,
		'duggaid' => $duggaid,
        'duggainfo' => $duggainfo,
		'moment' => $moment
    ];
	
	$response = callMicroservicePOST("showDuggaService/processDuggaFile_ms.php", $postData, true);
}


?>