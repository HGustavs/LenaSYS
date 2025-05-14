<?php
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

// Include basic application services! Include more if needed
date_default_timezone_set("Europe/Stockholm");
include_once "../../../Shared/sessions.php";

pdoConnect();
session_start();

$data = recieveMicroservicePOST(['did', 'lid']);
$duggaid = $data['did'];
$variant = $data['lid'];
$debug = "";

//------------------------------------------------------------------------------------------------
// Retrieve Information			
//------------------------------------------------------------------------------------------------

// The query specified below selects only scores associated with users that have returned a dugga with a passing grade
$query = $pdo->prepare("SELECT username, score FROM userAnswer, user where userAnswer.grade > 1 AND userAnswer.quiz = :did AND userAnswer.moment = :lid ORDER BY score ASC LIMIT 10;");
$query->bindParam(':did', $duggaid);
$query->bindParam(':lid', $variant);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error fetching entries" . $error[2];
}

$rows = array();

foreach ($query->fetchAll() as $row) {
    array_push(
        $rows,
        array(
            'username' => $row['username'],
            'score' => $row['score']
        )
    );
}

$user = array();

if (checklogin()) {
    $nrOfRows = count($rows);
    for ($i = 0; $i < $nrOfRows; $i++) {
        if ($rows[$i]["username"] === $_SESSION["loginname"]) {
            $user[] = $i;
            break;
        }
    }

    if (count($user) === 0) {
        // This must be tested
        $query = $pdo->prepare("SELECT username, score FROM userAnswer, user where userAnswer.quiz = :did AND userAnswer.moment = :lid LIMIT 1;");
        $query->bindParam(':did', $duggaid);
        $query->bindParam(':lid', $variant);

        if (!$query->execute()) {
            $error = $query->errorInfo();
            $debug = "Error fetching entries" . $error[2];
        }

        foreach ($query->fetchAll() as $row) {
            $user = array(
                "username" => $row["username"],
                "score" => $row["score"]
            );
        }
    }
}

$array = array(
    "debug" => $debug,
    "highscores" => $rows,
    "user" => $user
);

// logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "highscoreservice.php",$userid,$info);

header("Content-Type: application/json");
echo json_encode($array);

?>