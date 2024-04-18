<?php
date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include ('../shared_microservices/getUid_ms.php');
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$exampleId=getOP('exampleid');
$boxId=getOP('boxid');
$opt=getOP('opt');

getUid();

$query1 = $pdo->prepare("DELETE FROM box WHERE exampleid=:exampleid;");
$query1->bindValue(':exampleid', $exampleId);				

$query2 = $pdo->prepare("DELETE FROM improw WHERE exampleid=:exampleid;");
$query2->bindValue(':exampleid', $exampleId);				

$query3 = $pdo->prepare("DELETE FROM impwordlist WHERE exampleid=:exampleid;");
$query3->bindValue(':exampleid', $exampleId);				

$query4 = $pdo->prepare("DELETE FROM codeexample WHERE exampleid=:exampleid;");
$query4->bindValue(':exampleid', $exampleId);

$query5 = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid;");
$lid = getOP('lid');
$query5->bindValue(':lid', $lid);

if(!$query1->execute()) {
        $error = $query1->errorInfo();
        echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
        return;
}
if(!$query2->execute()) {
    $error = $query2->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if(!$query3->execute()) {
    $error = $query3->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if(!$query4->execute()) {
    $error = $query4->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
if(!$query5->execute()) {
    $error = $query5->errorInfo();
    echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
    return;
}
echo (json_encode(array('deleted' => true, 'debug' => $debug)));
return;
?>