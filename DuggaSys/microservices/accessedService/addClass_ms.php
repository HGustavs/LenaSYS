<?
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../shared_microservices/getUid_ms.php";

date_default_timezone_set("Europe/Stockholm");

// Connect to database and start session
pdoConnect();
session_start();

// Global variables
$opt = getOP('opt');
$cid = getOP('courseid');
$newclass = getOP('newclass');
$userid = getUid();

// Permission checks
if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
    $hasAccess = true;
} else {
    $hasAccess = false;
}

if (not(checklogin() && $hasAccess))
    return;

if (strcmp($opt, "ADDCLASS") == 0) {
    $newClassData = json_decode(htmlspecialchars_decode($newclass));

    foreach ($newClassData as $newClass) {
        $class = $newClass[0];
        $responsible = $newClass[1];
        $classname = $newClass[2];
        $regcode = $newClass[3];
        $classcode = $newClass[4];
        $hp = $newClass[5];
        $tempo = $newClass[6];
        $hpProgress = $newClass[7];
    }

    $querystring = "INSERT INTO class (class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) VALUES(:class, :responsible, :classname, :regcode, :classcode, :hp, :tempo, :hpProgress);";
    $stmt = $pdo->prepare($querystring);
    $stmt->bindParam(':class', $class);
    $stmt->bindParam(':responsible', $responsible);
    $stmt->bindParam(':classname', $classname);
    $stmt->bindParam(':regcode', $regcode);
    $stmt->bindParam(':classcode', $classcode);
    $stmt->bindParam(':hp', $hp);
    $stmt->bindParam(':tempo', $tempo);
    $stmt->bindParam(':hpProgress', $hpProgress);

    if (!$stmt->execute()) {
        $debug = "Not able to create the specified class.";
    }

    echo json_encode($debug);
}