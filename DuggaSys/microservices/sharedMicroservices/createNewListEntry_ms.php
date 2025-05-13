<?php
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

pdoConnect();
session_start();


global $pdo;
$requiredKeys = [
	'cid',
	'cvs',
	'usrid',
	'entryname',
	'link',
	'kind',
	'comment',
	'visible',
	'highscore',
	'pos',
	'gradesys',
	'tabs',
	'groupkind'
];

$postdata = recieveMicroservicePOST($requiredKeys);

//Change position of elements one increment up to make space for insertion.
$query = $pdo->prepare("UPDATE listentries SET pos = pos+1 WHERE cid = :cid and vers = :cvs and pos >= :pos");
$query->bindParam(":cid", $postdata['cid']);
$query->bindParam(":cvs", $postdata['cvs']);
$query->bindParam(":pos", $postdata['pos']);
$query->execute();

$query = $pdo->prepare("INSERT INTO listentries (cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind) 
    VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, :visible, :usrid, :comment, :gradesys, :highscoremode, :groupkind)");
$query->bindParam(':cid', $postdata['cid']);
$query->bindParam(':cvs', $postdata['cvs']);
$query->bindParam(':usrid', $postdata['usrid']);
$query->bindParam(':entryname', $postdata['entryname']);
$query->bindParam(':link', $postdata['link']);
$query->bindParam(':kind', $postdata['kind']);
$query->bindParam(':comment', $postdata['comment']);
$query->bindParam(':visible', $postdata['visible']);
$query->bindParam(':highscoremode', $postdata['highscoremode']);
$query->bindParam(':pos', $postdata['pos']);

if ($kind == 4) {
	$query->bindParam(':gradesys', $postdata['gradesys']);
} else {
	$query->bindParam(':gradesys', $postdata['tabs']);
}

if ($grptype != "UNK") {
	$query->bindParam(':groupkind', $postdata['groupkind']);
} else {
	$query->bindValue(':groupkind', null, PDO::PARAM_STR);
	// Microservice retrieveUsername
	$baseURL = "https://" . $_SERVER['HTTP_HOST'];
	$url = $baseURL . "/LenaSYS/duggaSys/microservices/sharedMicroservices/retrieveUsername_ms.php";

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($ch);
	curl_close($ch);

	$data = json_decode($response, true);
	$username = $data['username'] ?? 'unknown';

	logUserEvent($userid, $username, EventTypes::SectionItems, $entryname);
}

$debug = "NONE!";
if (!$query->execute()) {
	$error = $query->errorInfo();
	$debug = "Error updating entries" . $error[2];
}
echo json_encode($debug);
