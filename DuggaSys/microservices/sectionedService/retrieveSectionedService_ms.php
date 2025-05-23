<?php

// Include basic application services
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------
    date_default_timezone_set("Europe/Stockholm");
    pdoConnect();
    session_start();

    $data = recieveMicroservicePOST(['debug', 'opt', 'uid', 'cid', 'vers', 'log_uuid']);
    $debug = $data['debug'];
    $opt = $data['opt'];
    $userid = $data['uid'];
    $courseid = $data['cid'];
    $coursevers = $data['vers'];
    $log_uuid = $data['log_uuid'];
    
    $today = date("Y-m-d H:i:s");
    $hasread = hasAccess($userid, $courseid, 'r');
    $studentTeacher = hasAccess($userid, $courseid, 'st');
    $haswrite = hasAccess($userid, $courseid, 'w');
    $isSuperUserVar = isSuperUser($userid);

    $query = $pdo->prepare("SELECT visibility FROM course WHERE cid=:cid");
    $query->bindParam(':cid', $courseid);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading visibility " . $error[2];
    }

    $cvisibility = false;
    if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        if ($isSuperUserVar || $row['visibility'] == 1 || ($row['visibility'] == 2 && ($hasread || $haswrite)) || ($row['visibility'] == 0 && ($haswrite == true || $studentTeacher == true)))
            $cvisibility = true;
    }

    $ha = (checklogin() && ($haswrite || $isSuperUserVar));

    // Retrieve quiz entries including release and deadlines
    $duggor = array();
    $releases = array();

    $query = $pdo->prepare("SELECT id,qname,qrelease,deadline,relativedeadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':vers', $coursevers);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading entries" . $error[2];
    }

    // Create "duggor" array to store information about quizes and create "releases" to perform checks

    foreach ($query->fetchAll() as $row) {
        $releases[$row['id']] = array(
            'release' => $row['qrelease'],
            'deadline' => $row['deadline'],
            'relativedeadline' => $row['relativedeadline']
        );
        array_push(
            $duggor,
            array(
                'id' => $row['id'],
                'qname' => $row['qname'],
                'release' => $row['qrelease'],
                'deadline' => $row['deadline'],
                'relativedeadline' => $row['relativedeadline']
            )
        );
    }

    $query = $pdo->prepare("SELECT `groups` FROM user_course WHERE uid=:uid AND cid=:cid;");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':uid', $userid);
    $result = $query->execute();

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading results" . $error[2];
    }

    foreach ($query->fetchAll() as $row) {
        if (is_null($row['groups'])) {
            $grpmembershp = "UNK";
        } else {
            $grpmembershp = $row['groups'];
        }

        //$grpmembershp=trim($row['groups']);
        //$grpmembershp=explode(" ", $grpmembershp);
    }

    $resulties = array();
    $query = $pdo->prepare("SELECT moment,quiz,grade,DATE_FORMAT(submitted, '%Y-%m-%dT%H:%i:%s') AS submitted,DATE_FORMAT(marked, '%Y-%m-%dT%H:%i:%s') AS marked,useranswer FROM userAnswer WHERE uid=:uid AND cid=:cid AND vers=:vers;");
    $query->bindParam(':cid', $courseid);
    $query->bindParam(':vers', $coursevers);
    $query->bindParam(':uid', $userid);
    $result = $query->execute();

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading results" . $error[2];
    }

    $today_dt = new DateTime($today);
    foreach ($query->fetchAll() as $row) {
        $resulty = $row['grade'];
        $markedy = $row['marked'];

        // Remove grade and feedback if a release date is set and has not occured
        if (isset($releases[$row['quiz']])) {
            if (!is_null($releases[$row['quiz']]['release'])) {
                $release_dt = new DateTime($releases[$row['quiz']]['release']);
                if ($release_dt > $today_dt) {
                    $resulty = -1;
                    $markedy = null;
                }
            }
        }
        array_push(
            $resulties,
            array(
                'moment' => $row['moment'],
                'grade' => $resulty,
                'submitted' => $row['submitted'],
                'marked' => $markedy,
                'useranswer' => $row['useranswer']
            )
        );
    }

    $entries = array();

    if ($cvisibility) {
        $query = $pdo->prepare("SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,relativedeadline,qrelease,comments, qstart, jsondeadline, groupKind, 
            ts, tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id 
            WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos");
        $query->bindParam(':cid', $courseid);
        $query->bindParam(':coursevers', $coursevers);
        $result = $query->execute();

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading entries" . $error[2];
        }

        foreach ($query->fetchAll() as $row) {
            if ($isSuperUserVar || $row['visible'] == 1 || ($row['visible'] == 2 && ($hasread || $haswrite)) || ($row['visible'] == 0 && ($haswrite == true || $studentTeacher == true))) {
                array_push(
                    $entries,
                    array(
                        'entryname' => $row['entryname'],
                        'lid' => $row['lid'],
                        'pos' => $row['pos'],
                        'kind' => $row['kind'],
                        'moment' => $row['moment'],
                        'link' => $row['link'],
                        'visible' => $row['visible'],
                        'highscoremode' => $row['highscoremode'],
                        'gradesys' => $row['gradesystem'],
                        'code_id' => $row['code_id'],
                        'deadline' => $row['deadline'],
                        'relativedeadline' => $row['relativedeadline'],
                        'qrelease' => $row['qrelease'],
                        'comments' => $row['comments'],
                        'qstart' => $row['qstart'],
                        'grptype' => $row['groupKind'],
                        'tabs' => $row['tabs'],
                        'feedbackenabled' => $row['feedbackenabled'],
                        'feedbackquestion' => $row['feedbackquestion'],
                        'ts' => $row['ts'],
                    )
                );
            }
        }
    }

    $query = $pdo->prepare("SELECT coursename, coursecode FROM course WHERE cid=:cid LIMIT 1");
    $query->bindParam(':cid', $courseid);

    $coursename = "UNK";
    $coursecode = "UNK";

    if ($query->execute()) {
        foreach ($query->fetchAll() as $row) {
            $coursename = $row['coursename'];
            $coursecode = $row['coursecode'];
        }
    } else {
        $error = $query->errorInfo();
        $debug = "Error reading entries" . $error[2];
    }

    $links = array();

    // Retrieve Course Versions from microservice 'readCourseVersions_ms.php'
    $versions = callMicroserviceGET("sectionedService/readCourseVersions_ms.php");

    $codeexamples = array();

    if ($ha || $studentTeacher) {
        $query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename");
        $query->bindParam(':cid', $courseid);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading entries" . $error[2];
        }

        foreach ($query->fetchAll() as $row) {
            array_push(
                $links,
                array(
                    'fileid' => $row['fileid'],
                    'filename' => $row['filename']
                )
            );
        }

        // Reading entries in file database
        $query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE (cid=:cid AND kind>1) or isGlobal='1' ORDER BY kind,filename");
        $query->bindParam(':cid', $courseid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading entries" . $error[2];
        }
        $oldkind = -1;
        foreach ($query->fetchAll() as $row) {
            if ($row['kind'] != $oldkind) {
                array_push($links, array('fileid' => -1, 'filename' => "---===######===---"));
            }
            $oldkind = $row['kind'];
            array_push($links, array('fileid' => $row['fileid'], 'filename' => $row['filename']));
        }

        $codeexamples = array();

        // New Example
        array_push($codeexamples, array('exampleid' => "-1", 'cid' => '', 'examplename' => '', 'sectionname' => 'New Example', 'runlink' => "", 'cversion' => ""));
        $query = $pdo->prepare("SELECT exampleid, cid, examplename, sectionname, runlink, cversion FROM codeexample WHERE cid=:cid ORDER BY examplename;");
        $query->bindParam(':cid', $courseid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading code examples" . $error[2];
        } else {
            foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
                array_push(
                    $codeexamples,
                    array(
                        'exampleid' => $row['exampleid'],
                        'cid' => $row['cid'],
                        'examplename' => $row['examplename'],
                        'sectionname' => $row['sectionname'],
                        'runlink' => $row['runlink'],
                        'cversion' => $row['cversion']
                    )
                );
            }
        }

        $query = $pdo->prepare("select count(*) as unmarked from userAnswer where cid=:cid and ((grade = 1 and submitted > marked) OR (submitted is not null and useranswer is not null and grade is null));");
        $query->bindParam(':cid', $courseid);
        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading number of unmarked duggas" . $error[2];
        } else {
            foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $unmarked = $row["unmarked"];
            }
        }

        $queryo = $pdo->prepare("SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;");
        $queryo->bindParam(':cid', $courseid);
        $queryo->bindParam(':vers', $coursevers);
        if (!$queryo->execute()) {
            $error = $queryo->errorInfo();
            $debug = "Error reading start/stopdate" . $error[2];
        } else {
            foreach ($queryo->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $startdate = $row["startdate"];
                $enddate = $row["enddate"];
            }
        }
    } else {
        $query = $pdo->prepare("SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename");
        $query->bindParam(':cid', $courseid);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error reading entries" . $error[2];
        }

        $queryo = $pdo->prepare("SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;");
        $queryo->bindParam(':cid', $courseid);
        $queryo->bindParam(':vers', $coursevers);
        if (!$queryo->execute()) {
            $error = $queryo->errorInfo();
            $debug = "Error reading start/stopdate" . $error[2];
        } else {
            foreach ($queryo->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $startdate = $row["startdate"];
                $enddate = $row["enddate"];
            }
        }
    }

    $userfeedback = array();
    $groups = array();
    $grplst = array();
    $feedbackquestion = array();
    $avgfeedbackscore = array();
    $array = array(
        "entries" => $entries,
        "debug" => $debug,
        "writeaccess" => $ha,
        "studentteacher" => $studentTeacher,
        "readaccess" => $cvisibility,
        "coursename" => $coursename,
        "coursevers" => $coursevers,
        "coursecode" => $coursecode,
        "courseid" => $courseid,
        "links" => $links,
        "duggor" => $duggor,
        "results" => $resulties,
        "versions" => $versions,
        "codeexamples" => $codeexamples,
        "unmarked" => $unmarked,
        "startdate" => $startdate,
        "enddate" => $enddate,
        "groups" => $groups,
        "grpmembershp" => $grpmembershp,
        "grplst" => $grplst,
        "userfeedback" => $userfeedback,
        "feedbackquestion" => $feedbackquestion,
        "avgfeedbackscore" => $avgfeedbackscore
    );

    $info = "opt: " . $opt . " courseid: " . $courseid . " coursevers: " . $coursevers . " coursename: " . $coursename;
    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "retrieveSectionedService_ms.php", $userid, $info);
    header('Content-Type: application/json');
    echo json_encode($array);

