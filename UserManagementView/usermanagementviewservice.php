
<?php

//---------------------------------------------------------------------------------------------------------------
// UserMangagementService - Displays User Course Status or Study Program Status
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();

//$pnr = getOP('Toddler');
$studyprogram = getOP('Toddler');


if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
}else{
		$userid="UNK";		
} 

$hr="";
if(isSuperUser($userid)){
		$ha=true;
}else{
		$ha=false;
}

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------



$data = array();

$pnr = "111111-1111";
$uid = "1"; 


if ($pnr != null) {
	array_push($data, array($studyprogram));

//SQL query to print out username,
$sql = "SELECT user.firstname,user.lastname,user.ssn,user.username,course.coursecode,course.coursename FROM user INNER JOIN user_course INNER JOIN course WHERE user_course.uid='".$uid."' and user.uid='".$uid."' and course.cid = user_course.cid ;";
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$sth = $pdo->prepare($sql);
$sth->execute();
$res = $sth->fetchAll();
array_push($data, $res);

/*
$sql2 = "SELECT * FROM user WHERE ssn = '".$pnr."';";
$sth2 = $pdo->prepare($sql2);
$sth2->execute();
$res2 = $sth2->fetchAll();
array_push($data, $res2);
*/

/*
$sql3 = "SELECT course.coursename FROM course INNER JOIN programcourse WHERE course.cid = '".$cid."' and programcourse.cid = '".$cid."';";
$sth3 = $pdo->prepare($sql3);
$sth3->execute();
$res3 = $sth3->fetchAll();
array_push($data, $res3);
*/
/*
$sql5 = "SELECT course.coursename FROM course INNER JOIN programcourse WHERE course.cid = '".$cid."' and programcourse.cid = '".$cid."';";
$sth5 = $pdo->prepare($sql5);
$sth5->execute();
$res5 = $sth5->fetchAll();
array_push($data, $res5);
*/




} else if ($studyprogram != null) {
	
array_push($data, array($studyprogram));
	//$sql = "SELECT * FROM studentresultat WHERE pnr='".$pnr."';";
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$sth = $pdo->prepare($sql);
	$sth->execute();
	$res = $sth->fetchAll();
	array_push($data, $res);

}

$array = array(
	"data" => $data,
	"debug" => $debug,
	'writeaccess' => $ha,
	'readaccess' => $hr,
);

header('Content-type: application/json');

echo json_encode($data); 


 //Datastrukturen för en student (JSON) skall ha följande format:
 /*

 	namn: "Svensson Sven",
 	pnr : "791230-1153",
 	kull: "h12",
 	resultat : [
 		kurs { 
 				kursid : "DV123G",
 				resultat: "5.0"  			
 		},
 		kurs { etc }
 	]
 
*/

/* Datastrukturen för en kull (JSON) skall ha följande format:
 * 
 
	{ "kull":
		{"kullid" : "h12"},
		"ar" : [ { 
			"period" : "LP4",
			"period_start" : "2014-09-01",
			"peroid_slut"  : "2014-11-01",
			"kurser" : [
				"kursid" : "DV123G",
				"kursansvarig" : "Marcus Brohede",
				"examinator" : "Anders Dahlbom",
				"poang" : "7.5",
				"kurshemsida" : "",
				"sciosida" : "",
				"forkunskapskrav" : [
					kursid : ""]
			] }
		]
	} 
 
 */
?>
