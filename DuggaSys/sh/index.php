<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../../Shared/basic.php";
include_once "../../Shared/sessions.php";

$course = getOPG("c");
$assignment = getOPG("a");

pdoConnect();
session_start();

/*
/DuggaSys/showdoc.php?cid=4&coursevers=82452&fname=minimikrav_m1a.md"

SELECT filename FROM filelink WHERE filename LIKE '%$assignment%';
SELECT cid, coursename, activeversion, coursecode FROM course WHERE '%course%' LIKE cid OR coursename OR activeversion OR coursecode;
*/


function courseQuery($course){
global $pdo;
$c = '"%' . $course . '%"';
$sql = "SELECT cid, coursename, activeversion, coursecode 
 FROM course 
 WHERE cid LIKE " . $c . " OR coursename LIKE " . $c . 
 " OR activeversion LIKE " . $c . 
 " OR coursecode LIKE " . $c . "
 AND visibility=1";
$array = array();

foreach ($pdo->query($sql) as $row) {
	$array['cid'] = $row['cid'];
	$array['coursename'] = $row['coursename'];
	$array['coursecode'] = $row['coursecode'];
	$array['courseservers'] = $row['activeversion'];
}
return $array;

}

function assignmentQuery($assignment){
global $pdo;
$a = '"%' . $assignment . '%"';
$sql = "SELECT filename, cid FROM filelink WHERE filename LIKE " . $a;
$array = array();

foreach ($pdo->query($sql) as $row) {
	$array['filename'] = $row['filename'];
	$array['cid'] = $row['cid'];
}
return $array;
}

function queryToUrl($course, $assignment){
global $pdo;
if($course != NULL)
	$c = courseQuery($course);
else echo "No such course";

if($assignment != NULL){
	$a = assignmentQuery($assignment);
	$url = "/LenasSYS/DuggaSys/showdoc.php?cid=" . $a['cid'] ."&coursevers=" . $c['courseservers'] ."&fname=" . $a['filename'];
}
else $url = "/LenaSYS/DuggaSys/sectioned.php?courseid=" . $c['cid'] ."&coursename=" . $c['coursename'] . "&coursevers=" .  $c['courseservers'];

return $url; 
}

header("Location: ". queryToUrl($course, $assignment));
exit();

$pdo = null;
?>