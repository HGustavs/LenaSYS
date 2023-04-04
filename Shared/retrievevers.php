<?php
include_once ("../Shared/database.php");
pdoConnect();

$cid = $_POST['cid'];

$versids = array();

if (isset($cid)) {
	foreach ($pdo->query('SELECT * FROM vers WHERE cid="'.$cid.'" ORDER BY vers ASC') AS $vers) {
		$versid = $vers['vers'];
		$versids[] = array("versid" => $versid);
	}
}
echo json_encode(["versids"=>$versids]);

?>