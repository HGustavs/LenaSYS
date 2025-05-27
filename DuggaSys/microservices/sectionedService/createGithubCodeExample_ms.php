<?php

include_once "../sharedMicroservices/getUid_ms.php";
include_once "../sharedMicroservices/createNewListEntry_ms.php";
include_once "../curlService.php";
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$kind = getOP('kind');
$link = getOP('link');
$gradesys = getOP('gradesys');
$highscoremode = getOP('highscoremode');
$pos = getOP('pos');
$lid = getOP('lid');
$log_uuid = getOP('log_uuid');
$sectionname = getOP('sectionname'); //Not used but needed since post sends them along
$templateNumber = getOP('templateNumber'); //Not used but needed since post sends them along
$exampleid = getOP('exampleid'); // Not used but needed since post sends them along
$debug = "NONE!";

pdoConnect();
session_start();

//Start of old IF
if (strcmp($opt, "CREGITEX") === 0) {
    AqcuireCourse();
}

function AqcuireCourse()
{
    global $pdo, $courseid, $coursevers, $lid;
    /** @var \PDO $pdo */
    $query = $pdo->prepare("SELECT cid,githubDir,vers FROM listentries WHERE lid=:lid;");
    $query->bindParam(":lid", $lid);
    $query->execute();
    $e = $query->fetchAll();
    //Get cid
    $courseid = $e[0]['cid'];
    //Get dir from the listentrie that was clicked
    $githubDir = $e[0]['githubDir'];
    $dirPath = "../../../courses/" . $courseid . "/Github/" . $githubDir;
    //Get the version of the course from where the button was pressed
    $coursevers = $e[0]['vers'];

    $allFiles = array();
    $files = scandir($dirPath);
    foreach ($files as $file) {
        if (is_file($dirPath . "/" . $file)) {
            $temp = array();
            foreach ($files as $file2) {
                $n1 = explode(".", $file);
                $n2 = explode(".", $file2);
                if (is_file($dirPath . "/" . $file2) && $n1[0] == $n2[0]) {
                    array_push($temp, $file2);
                }
            }
            array_push($allFiles, $temp);
        }
        GetCourseVers($allFiles);
    }
}

function GetCourseVers($allFiles)
{
    global $pdo, $courseid, $coursevers, $pos;
    foreach ($allFiles as $groupedFiles) {
        //get the correct examplename
        $explodeFiles = explode('.', $groupedFiles[0]);
        $exampleName = $explodeFiles[0];
        //count if there is already a codeexample or if we should create a new one on the current coursevers where the button was pressed.
        /** @var \PDO $pdo */
        $query1 = $pdo->prepare("SELECT COUNT(*) AS count FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
        $query1->bindParam(":cid", $courseid);
        $query1->bindParam(":examplename", $exampleName);
        $query1->bindParam(":vers", $coursevers);
        $query1->execute();
        $result = $query1->fetch(PDO::FETCH_OBJ);
        $counted = $result->count;

        //if no codeexample exist create a new one
        if ($counted == 0) {
            //Get the last position in the listenries to add new course at the bottom
            $query = $pdo->prepare("SELECT pos FROM listentries WHERE cid=:cid ORDER BY pos DESC;");
            $query->bindParam(":cid", $courseid);
            $query->execute();
            $e = $query->fetchAll();
            $pos = $e[0]['pos'] + 1; //Gets the last filled position+1 to put the new codexample at

            //select the files that has should be in the codeexample
            $fileCount = count($groupedFiles);

            if ($fileCount > 0 && $fileCount < 6) {
                NoCodeExampleFilesExist($exampleName, $groupedFiles);
            } else {
                NoCodeExampleNoFiles($exampleName);
            }
        }
    }
}

function NoCodeExampleFilesExist($exampleName, $groupedFiles)
{
    global $pdo, $courseid, $coursevers, $kind, $link,
        $gradesys, $highscoremode, $pos, $log_uuid, $exampleid;

    //Count the number of files in the codeexample
    $fileCount = count($groupedFiles);
    //Start create the codeexample
    //Select the correct template, only template for 1 up to 5 files exist
    switch ($fileCount) {
        case 1:
            $templateNumber = 10;
            break;
        case 2:
            $templateNumber = 1;
            break;
        case 3:
            $templateNumber = 3;
            break;
        case 4:
            $templateNumber = 5;
            break;
        case 5:
            $templateNumber = 9;
            break;
    }
    $examplename = $exampleName;
    $sectionname = $exampleName;

    //create codeexample

    //set url for createNewCodeExample.php path
    header("Content-Type: application/json");
    $baseURL = "https://" . $_SERVER['HTTP_HOST'];
    $url = $baseURL . "/LenaSYS/DuggaSys/microservices/sharedMicroservices/createNewCodeExample_ms.php";

    $dataToSend = [
        'exampleid' => $exampleid,
        'courseid' => $courseid,
        'coursevers' => $coursevers,
        'sectname' => $sectionname,
        'link' => $link,
        'log_uuid' => $log_uuid,
        'templatenumber' => $templateNumber
    ];

    $response = callMicroservicePOST($url,  $dataToSend, true);
    $link = json_decode($response, true);

    //select the latest codeexample created to link boxes to this codeexample
    /** @var \PDO $pdo */
    $query = $pdo->prepare("SELECT MAX(exampleid) as LatestExID FROM codeexample;");
    $query->execute();
    $result = $query->fetch(PDO::FETCH_OBJ);
    $exampleid = $result->LatestExID;

    //Add each file to a box and add that box to the codeexample and set the box to its correct content.
    for ($i = 0; $i < count($groupedFiles); $i++) {
        $filename = $groupedFiles[$i];
        $parts = explode('.', $filename);
        $filetype = "CODE";
        $wlid = 0;
        switch ($parts[1]) {
            case "js":
                $filetype = "CODE";
                $wlid = 1;
                break;
            case "php":
                $filetype = "CODE";
                $wlid = 2;
                break;
            case "html":
                $filetype = "CODE";
                $wlid = 3;
                break;
            case "txt":
                $filetype = "DOCUMENT";
                $wlid = 4;
                break;
            case "md":
                $filetype = "DOCUMENT";
                $wlid = 4;
                break;
            case "java":
                $filetype = "CODE";
                $wlid = 5;
                break;
            case "sr":
                $filetype = "CODE";
                $wlid = 6;
                break;
            case "sql":
                $filetype = "CODE";
                $wlid = 7;
                break;
            default:
                $filetype = "DOCUMENT";
                $wlid = 4;
                break;
        }

        $boxid = $i + 1;
        $fontsize = 9;
        $setting = "[viktig=1]";
        $boxtitle = substr($filename, 0, 20);
        $query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
        $query->bindParam(":boxid", $boxid);
        $query->bindParam(":exampleid", $exampleid);
        $query->bindParam(":boxtitle", $boxtitle);
        $query->bindParam(":boxcontent", $filetype);
        $query->bindParam(":filename", $filename);
        $query->bindParam(":settings", $setting);
        $query->bindParam(":wordlistid", $wlid);
        $query->bindParam(":fontsize", $fontsize);
        $query->execute();
    }
    $link = "UNK";
    $kind = 2;
    $visible = 1;
    $userid = 1;
    $comment = null;
    $gradesys = null;
    $highscoremode = 0;
    $tabs = 0;
    $groupkind = null;

    //add the codeexample to listentries
    $createListData = [
        $pdo,
        $courseid,
        $coursevers,
        $userid,
        $examplename,
        $link,
        $kind,
        $comment,
        $visible,
        $highscoremode,
        $pos,
        $gradesys,
        $tabs,
        $groupkind,
        null
    ];

    callMicroservicePOST("sharedMicroservices/createNewListEntry_ms.php", $createListData, false);
}

function NoCodeExampleNoFiles($exampleName)
{
    global $pdo, $courseid, $coursevers;
    //Check for update
    //TODO: Implement update for already existing code-examples.
    /** @var \PDO $pdo */
    $query1 = $pdo->prepare("SELECT exampleid AS eid FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
    $query1->bindParam(":cid", $courseid);
    $query1->bindParam(":examplename", $exampleName);
    $query1->bindParam(":vers", $coursevers);
    $query1->execute();
    $result = $query1->fetch(PDO::FETCH_OBJ);
    $eid = $result->eid;

    $query1 = $pdo->prepare("SELECT COUNT(*) AS boxCount FROM box WHERE exampleid=:eid;");
    $query1->bindParam(":eid", $eid);
    $query1->execute();
    $result = $query1->fetch(PDO::FETCH_OBJ);
    $boxCount = $result->boxCount;

    $likePattern = $exampleName . '.%';
    $pdolite = new PDO('sqlite:../../../../githubMetadata/metadata2.db');
    $query = $pdolite->prepare("SELECT * FROM gitFiles WHERE cid = :cid AND fileName LIKE :fileName;");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':fileName', $likePattern);
    $query->execute();
    $rows = $query->fetchAll();
    $exampleCount = count($rows);

    //Check if to be hidden
    if ($exampleCount == 0) {
        $visible = 0;
        $query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE cid=:cid AND vers=:cvs AND entryname=:entryname;");
        $query->bindParam(":cid", $courseid);
        $query->bindParam(":cvs", $coursevers);
        $query->bindParam(":entryname", $exampleName);
        $query->bindParam(":visible", $visible);
        $query->execute();

        //Check if remove box
    } else if ($boxCount > $exampleCount) {
        $query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;");
        $query->bindParam(':eid', $eid);
        $query->execute();
        $boxRows = $query->fetchAll();

        foreach ($boxRows as $bRow) {
            $boxName = $bRow['filename'];
            $exist = false;
            foreach ($rows as $row) {
                $fileName = $row['fileName'];
                if (strcmp($boxName, $fileName) == 0) {
                    $exist = true;
                }
            }
            if ($exist == false) {
                $query = $pdo->prepare("SELECT boxid AS bid FROM box WHERE exampleid = :eid AND filename=:boxName;");
                $query->bindParam(':eid', $eid);
                $query->bindParam(':boxName', $boxName);
                $query->execute();
                $result = $query->fetch(PDO::FETCH_OBJ);
                $bid = $result->bid;

                $query = $pdo->prepare("DELETE FROM box WHERE exampleid = :eid AND filename=:boxName;");
                $query->bindParam(':eid', $eid);
                $query->bindParam(':boxName', $boxName);
                $query->execute();

                for ($i = $bid; $i < $boxCount; $i++) {
                    $oldBoxID = $i + 1;
                    $query = $pdo->prepare("UPDATE box SET boxid=:newBoxID WHERE exampleid = :eid AND boxid=:oldBoxID;");
                    $query->bindParam(':newBoxID', $i);
                    $query->bindParam(':eid', $eid);
                    $query->bindParam(':oldBoxID', $oldBoxID);
                    $query->execute();
                }
                $boxCount--;
            }
        }
        switch ($exampleCount) {
            case 1:
                $templateNumber = 10;
                break;
            case 2:
                $templateNumber = 1;
                break;
            case 3:
                $templateNumber = 3;
                break;
            case 4:
                $templateNumber = 5;
                break;
            case 5:
                $templateNumber = 9;
                break;
        }
        $query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
        $query->bindParam(":templateid", $templateNumber);
        $query->bindParam(":eid", $eid);
        $query->execute();

        //Check if adding box
    } else if ($boxCount < $exampleCount) {

        $query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;");
        $query->bindParam(':eid', $eid);
        $query->execute();
        $boxRows = $query->fetchAll();

        foreach ($rows as $row) {
            $fileName = $row['fileName'];
            $exist = false;
            foreach ($boxRows as $bRow) {
                $boxName = $bRow['filename'];
                if (strcmp($boxName, $fileName) == 0) {
                    $exist = true;
                }
            }
            if ($exist == false) {
                $parts = explode('.', $fileName);
                $filetype = "CODE";
                $wlid = 0;
                switch ($parts[1]) {
                    case "js":
                        $filetype = "CODE";
                        $wlid = 1;
                        break;
                    case "php":
                        $filetype = "CODE";
                        $wlid = 2;
                        break;
                    case "html":
                        $filetype = "CODE";
                        $wlid = 3;
                        break;
                    case "txt":
                        $filetype = "DOCUMENT";
                        $wlid = 4;
                        break;
                    case "md":
                        $filetype = "DOCUMENT";
                        $wlid = 4;
                        break;
                    case "java":
                        $filetype = "CODE";
                        $wlid = 5;
                        break;
                    case "sr":
                        $filetype = "CODE";
                        $wlid = 6;
                        break;
                    case "sql":
                        $filetype = "CODE";
                        $wlid = 7;
                        break;
                    default:
                        $filetype = "DOCUMENT";
                        $wlid = 4;
                        break;
                }

                $query = $pdo->prepare("SELECT MAX(boxid) FROM box WHERE exampleid = :eid;");
                $query->bindParam(':eid', $eid);
                $query->execute();
                $boxid = $query->fetchColumn();

                $boxid = $boxid + 1;
                $fontsize = 9;
                $setting = "[viktig=1]";
                $boxtitle = substr($fileName, 0, 20);

                $query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
                $query->bindParam(":boxid", $boxid);
                $query->bindParam(":exampleid", $eid);
                $query->bindParam(":boxtitle", $boxtitle);
                $query->bindParam(":boxcontent", $filetype);
                $query->bindParam(":filename", $fileName);
                $query->bindParam(":settings", $setting);
                $query->bindParam(":wordlistid", $wlid);
                $query->bindParam(":fontsize", $fontsize);
                $query->execute();
            }
        }

        switch ($exampleCount) {
            case 1:
                $templateNumber = 10;
                break;
            case 2:
                $templateNumber = 1;
                break;
            case 3:
                $templateNumber = 3;
                break;
            case 4:
                $templateNumber = 5;
                break;
            case 5:
                $templateNumber = 9;
                break;
        }
        $query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
        $query->bindParam(":templateid", $templateNumber);
        $query->bindParam(":eid", $eid);
        $query->execute();
    }
}

$postData = [
    'debug' => $debug,
    'opt' => $opt,
    'uid' => $userid,
    'cid' => $courseid,
    'vers' => $coursevers,
    'log_uuid' => $log_uuid
];

header("Content-Type: application/json");
$data = callMicroservicePOST("sectionedService/retrieveSectionedService_ms.php", $postData, true );
echo $data;