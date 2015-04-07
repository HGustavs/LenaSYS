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

$pnr = getOP('pnr');
$studyprogram = getOP('studyprogram');


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
//$pnr ="920824-0599";
//$sql = "SELECT KursID,resultat FROM student_resultat WHERE pnr='".$pnr."';";
//$sql = "SELECT name, pnr, kull, kurs.kurskod, kursnamn, poang, termin, resultat, avbrott FROM student_resultat inner join student on studentresultat.usrid = student.usrid inner join kurs ON studentresultat.kursid = kurstillf.kurskod where pnr ='".$pnr."';";

// select name, studentresultat.pnr, kull, kurs.kurskod, kursnamn, poang, termin, resultat, studentresultat.avbrott from studentresultat inner join kurstillf on studentresultat.anmkod=kurstillf.anmkod inner join student on studentresultat.pnr = student.pnr inner join kurs on studentresultat.kurskod = kurs.kurskod;
//$sql = "select name, studentresultat.pnr, kull, kurs.kurskod, kursnamn, poang, termin, resultat, studentresultat.avbrott from studentresultat inner join kurstillf on studentresultat.anmkod=kurstillf.anmkod inner join student on studentresultat.pnr = student.pnr inner join kurs on studentresultat.kurskod = kurs.kurskod where studentresultat.pnr ='".$pnr."';";
if ($pnr != null) {
	array_push($data, array("student"));
$sql = "select namn, studentresultat.pnr, kull, kurs.kurskod, kursnamn, poang, termin, resultat, studentresultat.avbrott from studentresultat inner join student on studentresultat.pnr = student.pnr inner join kurs on studentresultat.kurskod = kurs.kurskod where studentresultat.pnr ='".$pnr."';";
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$sth = $pdo->prepare($sql);
$sth->execute();
$res = $sth->fetchAll();
array_push($data, $res);


$sql2 = "SELECT kursid, krav from forkunskap;";
$sth2 = $pdo->prepare($sql2);
$sth2->execute();
$res2 = $sth2->fetchAll();
array_push($data, $res2);

} else if ($studyprogram != null) {
	
array_push($data, array("studyprogram"));
	$sql = "select kurskod, kursnamn, period, termin from programkurs where kull='".$studyprogram."' order by termin,period;";
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


/* Datastrukturen för en student (JSON) skall ha följande format:
 
 	namn: "Svensson, Sven",
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
 
