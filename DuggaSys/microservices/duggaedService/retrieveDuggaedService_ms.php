<?php
//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------
    date_default_timezone_set("Europe/Stockholm");
    include_once "../../../Shared/basic.php";
    include_once "../../../Shared/sessions.php";
    include_once "../curlService.php";

    // Connect to database and start session
    pdoConnect();
    session_start();

    $data = recieveMicroservicePOST(['debug', 'userid', 'cid', 'coursevers', 'log_uuid']);
    $debug = $data['debug'];
    $userid = $data['userid'];
    $cid = $data['cid'];
    $coursevers = $data['coursevers'];
    $log_uuid = $data['log_uuid'];

    $opt = getOP('opt');
    $qid = getOP('qid');
    $vid = getOP('vid');
    $param = getOP('parameter');
    $answer = getOP('variantanswer');
    $disabled = getOP('disabled');
    $name = getOP('nme');

    $info = "opt: " . $opt . " cid: " . $cid . " qid: " . $qid . " vid: " . $vid . " param: " . $param . " answer: " . $answer . " disabled: " . $disabled . " uid: " . $userid . " name: " . $name;
    logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "retrieveDuggaedService_ms.php", $userid, $info);

    // Initialize arrays
    $entries = array();
    $files = array();
    $duggaPages = array();

    // Retrieve course info
    $query = $pdo->prepare("SELECT coursename,coursecode,cid FROM course WHERE cid=:cid LIMIT 1");
    $query->bindParam(':cid', $cid);

    $coursename = "Course not Found!";
    $coursecode = "Coursecode not found!";

    if ($query->execute()) {
        foreach ($query->fetchAll() as $row) {
            $coursename = $row['coursename'];
            $coursecode = $row['coursecode'];
        }
    } else {
        $error = $query->errorInfo();
        $debug = "Error reading entries" . $error[2];
    }

    $writeaccess = false;
    if (checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st'))) {
        $writeaccess = true;

        // Retrieve quiz data
        $query = $pdo->prepare("SELECT id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, relativedeadline, modified, creator, vers, qstart, jsondeadline, `group` FROM quiz WHERE cid=:cid AND vers=:coursevers ORDER BY id;");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':coursevers', $coursevers);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error updating entries" . $error[2];
        }

        foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {

            // Retrieve variants for each quiz
            $queryz = $pdo->prepare("SELECT vid,quizID,param,variantanswer,modified,disabled FROM variant WHERE quizID=:qid ORDER BY vid;");
            $queryz->bindParam(':qid', $row['id']);

            if (!$queryz->execute()) {
                $error = $queryz->errorInfo();
                $debug = "Error updating entries" . $error[2];
            }

            $mass = array();
            foreach ($queryz->fetchAll(PDO::FETCH_ASSOC) as $rowz) {

                $entryz = array(
                    "vid" => $rowz["vid"],
                    "param" => html_entity_decode($rowz["param"]),
                    "notes" => html_entity_decode($rowz["param"]),
                    "variantanswer" => html_entity_decode($rowz["variantanswer"]),
                    "modified" => $rowz["modified"],
                    "disabled" => $rowz["disabled"],
                    "arrowVariant" => $rowz["vid"],
                    "cogwheelVariant" => $rowz["vid"],
                    "trashcanVariant" => $rowz["vid"]
                );
                array_push($mass, $entryz);
            }

            // Construct entry for each quiz
            $entry = array(
                'variants' => $mass,
                'did' => $row['id'],
                'vers' => $row['vers'],
                'cid' => $row['cid'],
                'qname' => html_entity_decode($row['qname']),
                'autograde' => $row['autograde'],
                'gradesystem' => $row['gradesystem'],
                'quizFile' => $row['quizFile'],
                'qstart' => $row['qstart'],
                'deadline' => $row['deadline'],
                'qrelease' => $row['qrelease'],
                'modified' => $row['modified'],
                'arrow' => $row['id'],
                'cogwheel' => $row['id'],
                'jsondeadline' => html_entity_decode($row['jsondeadline']),
                'trashcan' => $row['id'],
                'group' => $row['group'],
                'relativedeadline' => $row['relativedeadline'],
                'creator' => $row['creator']
            );

            array_push($entries, $entry);
        }

        // Retrieve duggas templates
        $dir = '../../templates';
        $giles = scandir($dir);
        foreach ($giles as $value) {
            if (endsWith($value, ".html")) {
                array_push($files, substr($value, 0, strlen($value) - 5));
                $duggaPages[substr($value, 0, strlen($value) - 5)] = file_get_contents($dir . "/" . $value);
            }
        }
    }

    // Construct final array
    $array = array(
        'entries' => $entries,
        'debug' => $debug,
        'writeaccess' => $writeaccess,
        'files' => $files,
        'duggaPages' => $duggaPages,
        'coursecode' => $coursecode,
        'coursename' => $coursename,
    );

    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "retrieveDuggaedService_ms.php", $userid, $info);

    header('Content-Type: application/json');
    echo json_encode($array);
