<?php 

// Connect to a MySQL database using PHP PDO
$dsn      = 'mysql:host=127.0.0.1;dbname=resultdb;';
$login    = 'root';
$password = '1qaz2wsx';
$options  = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'");
//$pdo = new PDO($dsn, $login, $password, $options);
try {
  $pdo = new PDO($dsn, $login, $password, $options);
}
catch(Exception $e) {
  throw $e; // For debug purpose, shows all connection details
  //throw new PDOException('Could not connect to database, hiding connection details.'); // Hide connection details.
}

$pnr = isset($_GET['pnr']) && !empty($_GET['pnr']) ? $_GET['pnr'] : null;
$studyprogram = isset($_GET['studyprogram'])&& !empty($_GET['studyprogram']) ? $_GET['studyprogram'] : null;

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
 