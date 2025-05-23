<?php
header('Content-Type: application/json');

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";


pdoConnect();
session_start();

$opt = getOP('opt');
$cid = getOP('courseid');
$coursevers = getOP('coursevers');
$fid = getOP('fid');
$kind = getOP('kind');
$log_uuid = getOP('log_uuid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";

$entries = array();
$files = array();
$lfiles = array();
$gfiles = array();
$access = False;
$studentTeacher = false;

$hasAccess = hasAccess($userid, $cid, 'r');

// Fetches information from the filelink table in the database, binds column result into vars and loops through each fetched result, building a new cell for each index.
if (checklogin() && $hasAccess) {
    $query = $pdo->prepare("SELECT * FROM fileLink WHERE kind=2 OR (cid=:cid AND vers is null) OR (cid=:cid AND vers=:vers) ORDER BY kind,filename;");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':vers', $coursevers);

    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error reading files " . $error[2];
    }

    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        //takes result from query and stores it in local vars
        $filekind = $row['kind'];
        $filename = $row['filename'];
        $path = $row['path'];
        $splitname = explode(".", $filename);
        $extension = $splitname[count($splitname) - 1];
        $splitname = array_slice($splitname, 0, count($splitname) - 1);
        $shortfilename = implode(".", $splitname);

        // filters out files the user shouldn't have access to.
        switch ($filekind) {
            case 1:
                $filePath = "UNK";
                $filekindname = "Link";
                $extension = "-";
                $shortfilename = $filename;
                break;
            case 2:
                // Global
                $filePath = "../courses/global/" . $filename;
                $filekindname = "Global";
                break;
            case 3:
                // Course Local
                if ($path == null)
                    $filePath = "../courses/" . $cid . "/" . $filename;
                else
                    $filePath = "../courses/" . $cid . "/Github/" . $path;

                $filekindname = "Course local";
                break;
            case 4:
                // Version Local
                $filePath = "../courses/" . $cid . "/" . $coursevers . "/" . $filename;
                $filekindname = "Version local";
                break;
            default:
                $filePath = "UNK";
                $filekindname = "UNK";
                break;
        }

        // edit/delete rows feature disabled by default, is re-enabled if super user/admin.      
        $showTrashcan = false;
        $showEditor = false;

        if (isSuperUser($userid)) {
            $showEditor = true;
        } else if ($hasAccess && $filekind != 2) {
            $showEditor = true;
        }

        if (isSuperUser($userid)) {
            $showTrashcan = true;
        } else if (hasAccess($userid, $cid, 'w') && $filekind != 2) {
            $showTrashcan = true;
        }

        $entry = array(
            'filename' => json_encode(['filename' => $row['filename'], 'shortfilename' => $shortfilename, "kind" => $filekindname, 'extension' => $extension, 'filePath' => $filePath]),
            'extension' => $extension,
            'kind' => $filekind,
            'filesize' => json_encode(['size' => $row['filesize'], 'kind' => $filekindname]),
            'type' => $path,
            'uploaddate' => $row['uploaddate'],
            'editor' => json_encode(['filePath' => $filePath, 'kind' => $filekind, 'filename' => $filename, 'extension' => $extension, 'showeditor' => $showEditor]),
            'trashcan' => json_encode(['fileid' => $row['fileid'], 'filename' => $row['filename'], 'filekind' => $filekind, 'showtrashcan' => $showTrashcan, 'filePath' => $filePath]),
        );

        array_push($entries, $entry);
    }

    // Start traversing the filesystem from LenaSYS root
    chdir("../../../");
    $currcvd = getcwd();
    $dir = $currcvd . "/templates/";

    if (file_exists($dir)) {
        $files = scandir($dir);
        foreach ($files as $value) {
            if (!is_dir($currcvd . "/templates/" . $value)) {
                array_push($gfiles, $value);
            }
        }
    }

    $dir = $currcvd . "/courses/" . $cid . "/";
    if (file_exists($dir)) {
        $gtiles = scandir($dir);
        foreach ($gtiles as $value) {
            if (!is_dir($currcvd . "/courses/" . $cid . "/" . $value)) {
                array_push($lfiles, $value);
            }
        }
    }

    $access = True;
}

$superuser = isSuperUser($userid);
$supervisor = hasAccess($userid, $cid, 'sv');
$waccess = hasAccess($userid, $cid, 'w');

$array = array(
    'entries' => $entries,
    'debug' => $debug,
    'gfiles' => $gfiles,
    'lfiles' => $lfiles,
    'access' => $access,
    'studentteacher' => $studentTeacher,
    'superuser' => $superuser,
    'waccess' => $waccess,
    'supervisor' => $supervisor,
);

$info = "opt: " . $opt . " cid: " . $cid . " coursevers: " . $coursevers . " fid: " . $fid . " filename: " . $filename . " kind: " . $kind;
logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "retrieveFileedService_ms.php", $userid, $info);

echo json_encode($array);

