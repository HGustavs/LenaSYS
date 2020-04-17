<?php
    /********************************************************************************

        diagramservice.php, reads github activity data for a user (Including number of
        issues created, comments posted, lines of code modified) for every week and
        returns it in a JSON object

    ********************************************************************************/
    date_default_timezone_set("Europe/Stockholm");
    // Include basic application services!
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";
    // Connect to database and start session
    pdoConnect();
    session_start();
    if (isset($_SESSION['uid'])) {
        $userid = $_SESSION['uid'];
        $loginname = $_SESSION['loginname'];
        $lastname = $_SESSION['lastname'];
        $firstname = $_SESSION['firstname'];
    } else {
        $userid = 1;
        $loginname = "UNK";
        $lastname = "UNK";
        $firstname = "UNK";
    }

    

    $log_db = new PDO('sqlite:../../GHdataD.db');
    $gituser = $loginname;
    $startweek = strtotime('2015-03-29');                                   // First monday in january
    $currentweek = $startweek;
    $currentweekend = strtotime("+1 week", $currentweek);
    $weekno = 1;
    $weeks = array();
    $debug = "NONE!";
    do {
        // Number of issues created by user during the interval
        $issues = array();
        $query = $log_db -> prepare('SELECT * FROM issue WHERE author=:gituser AND issuetime>:issuefrom AND issuetime<:issueto;');
        $query -> bindParam(':gituser', $gituser);
        $query -> bindParam(':issuefrom', date('Y-m-d', $currentweek));
        $query -> bindParam(':issueto', date('Y-m-d', $currentweekend));
        $query -> execute();
        $rows = $query -> fetchAll();
        foreach ($rows as $row) {
            $issue = array('issueno' => $row['issueno'], 'title' => $row['title']);
            array_push($issues, $issue);
        }
        // Event count of the various kinds of events during interval
        $events = array();
        $query = $log_db -> prepare("SELECT kind,count(kind) as cnt FROM event WHERE event.author=:gituser AND eventtime>:eventfrom AND eventtime<:eventto AND (kind='Assigned' OR kind='Closed' OR kind='Commit' OR kind = 'Reopened') GROUP BY kind");
        $query -> bindParam(':gituser', $gituser);
        $query -> bindParam(':eventfrom', date('Y-m-d', $currentweek));
        $query -> bindParam(':eventto', date('Y-m-d', $currentweekend));
        $query -> execute();
        $rows = $query -> fetchAll();
        foreach ($rows as $row) {
            $event = array('kind' => $row['kind'], 'cnt' => $row['cnt']);
            array_push($events, $event);
        }
        // Number of comments posted by the user during the interval
        $comments = array();
        $query = $log_db -> prepare('SELECT * FROM comment WHERE author=:gituser AND commenttime>:commentfrom AND commenttime<:commentto');
        $query -> bindParam(':commentfrom', date('Y-m-d', $currentweek));
        $query -> bindParam(':commentto', date('Y-m-d', $currentweekend));
        $query -> bindParam(':gituser', $gituser);
        $query -> execute();
        $rows = $query -> fetchAll();
        foreach ($rows as $row) {
            $comment = array('issueno' => $row['issueno'], 'content' => $row['content']);
            array_push($comments, $comment);
        }
        // Number of lines changed in each file during interval
        $files  = array();
        $query = $log_db -> prepare('SELECT sum(rowcnt) as rowk, * FROM Bfile,Blame where Blame.fileid=Bfile.id and blameuser=:gituser and blamedate>:blamefrom and blamedate<:blameto GROUP BY filename');
        $query -> bindParam(':blamefrom', date('Y-m-d', $currentweek));
        $query -> bindParam(':blameto', date('Y-m-d', $currentweekend));
        $query -> bindParam(':gituser', $gituser);
        $query -> execute();
        $rows = $query -> fetchAll();
        foreach ($rows as $row) {
            $file = array('path' => $row['path'], 'filename' => $row['filename'], 'lines' => $row['rowk']);
            array_push($files, $file);
        }
        $week = array(
            'weekno' => $weekno,
            'weekstart' => date('Y-m-d', $currentweek),
            'weekend' => date('Y-m-d', $currentweekend),
            'events' => $events,
            'issues' => $issues,
            'comments' => $comments,
            'files' => $files
        );
        array_push($weeks, $week);
        $currentweek = $currentweekend;
        $currentweekend = strtotime("+1 week", $currentweek);
        $weekno++;
    } while ($weekno < 11);
    $array = array('debug' => $debug, 'weeks' => $weeks);
    echo json_encode($array);
?>
