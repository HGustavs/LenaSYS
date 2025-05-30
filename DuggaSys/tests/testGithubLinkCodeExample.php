<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/LenaSYS/Shared/basic.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/LenaSYS/Shared/sessions.php';
pdoConnect();

// Setting up the titles
$testExampleName = 'GitHub Link Test';
$testSectionName = 'Test Section';
$expectedGitHubURL = 'https://github.com/LenaSYS/Webbprogrammering-Examples/blob/master/Examples%20Html/HTML%20CSS%20Background.html';
$cid = 1885;

// Inserts to table
$insert = $pdo->prepare("INSERT INTO codeexample (cid, examplename, sectionname, runlink, cversion, uid, templateid) 
                         VALUES (:cid, :examplename, :sectionname, :runlink, 99999, 1, 1)");
$insert->bindParam(':cid', $cid);
$insert->bindParam(':examplename', $testExampleName);
$insert->bindParam(':sectionname', $testSectionName);
$insert->bindParam(':runlink', $expectedGitHubURL);
$insert->execute(); 

// Retrieve it 
$select = $pdo->prepare("SELECT runlink FROM codeexample WHERE examplename = :examplename");
$select->bindParam(':examplename', $testExampleName);
$select->execute();
$result = $select->fetch(PDO::FETCH_ASSOC);

// Output result
if ($result && $result['runlink'] === $expectedGitHubURL) {
    echo " Test passed: GitHub link saved correctly.\n";
} else {
    echo " Test failed: GitHub link not saved correctly.\n";
}

// Cleanup/Deleting
$delete = $pdo->prepare("DELETE FROM codeexample WHERE examplename = :examplename");
$delete->bindParam(':examplename', $testExampleName);
$delete->execute();
?>