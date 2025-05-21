
<?php
//---------------------------------------------------------------------------------------------------------------
// processDuggafile_ms.php - Retreive all submissions Uses service selectFromTableSubmission to get information it requires from submission.
//---------------------------------------------------------------------------------------------------------------

// All services to include
date_default_timezone_set("Europe/Stockholm");
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database
pdoConnect();

// Uses curlService.php to verify the receiving data
$data = recieveMicroservicePOST(['courseid', 'coursevers', 'duggaid', 'duggainfo', 'moment']);
$courseid = $data['courseid'];
$coursevers = $data['coursevers'];
$duggaid = $data['duggaid'];
$duggainfo = $data['duggainfo'];
$moment = $data['moment'];

$files = array();

if (
	isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"]) &&
	isset($_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"]) &&
	isset($_SESSION["submission-variant-$courseid-$coursevers-$duggaid-$moment"])
) {

	$tmphash = $_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];

	$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash ORDER BY subid,fieldnme,updtime asc;");
	$query->bindParam(':hash', $tmphash);
	$query->execute();
	$rows = $query->fetchAll();

	//if the hash didn't work and the user is a superuser then retrive all submissions
	if (isSuperUser($_SESSION['uid']) && $rows == NULL) {
		$query = $pdo->prepare("SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE segment=:moment ORDER BY subid,fieldnme,updtime asc;");
		$query->bindParam(':moment', $moment);
		$query->execute();
		$rows = $query->fetchAll();
	}
	// Store current day in string
	$today = date("Y-m-d H:i:s");

	foreach ($rows as $row) {
		$content = "UNK";
		$feedback = "UNK";
		$zipdir = "";
		$zip = new ZipArchive;


		$ziptemp = $row['filepath'] . $row['filename'] . $row['seq'] . "." . $row['extension'];

		if (!file_exists($ziptemp)) {
			$isFileSubmitted = false;
			$zipdir = "UNK";
		} else {
			$isFileSubmitted = true;
			if ($zip->open($ziptemp) == TRUE) {
				for ($i = 0; $i < $zip->numFiles; $i++) {
					$zipdir .= $zip->getNameIndex($i) . '<br />';
				}
			}
		}

		$fedbname = $row['filepath'] . $row['filename'] . $row['seq'] . "_FB.txt";
		if (!file_exists($fedbname)) {
			$feedback = "UNK";
		} else {
			if ($today > $duggainfo['qrelease']  || is_null($duggainfo['qrelease'])) {
				$feedback = file_get_contents($fedbname);
			}
		}

		if ($row['kind'] == "3") {
			// Read file contents
			$movname = $row['filepath'] . "/" . $row['filename'] . $row['seq'] . "." . $row['extension'];

			if (!file_exists($movname)) {
				$content = "UNK!";
			} else {
				$content = file_get_contents($movname);
			}
		} else if ($row['kind'] == "2") {
			// File content is an URL
			$movname = $row['filepath'] . "/" . $row['filename'] . $row['seq'];

			if (!file_exists($movname)) {
				$content = "UNK URL!";
			} else {
				$content = file_get_contents($movname);
			}
		} else {
			$content = "Not a text-submit or URL";
		}

		$entry = array(
			'subid' => $row['subid'],
			'vers' => $row['vers'],
			'did' => $row['did'],
			'fieldnme' => $row['fieldnme'],
			'filename' => $row['filename'],
			'filepath' => $row['filepath'],
			'extension' => $row['extension'],
			'mime' => $row['mime'],
			'updtime' => $row['updtime'],
			'kind' => $row['kind'],
			'seq' => $row['seq'],
			'segment' => $row['segment'],
			'content' => $content,
			'feedback' => $feedback,
			'username' => $tmphash,
			'zipdir' => $zipdir
		);
		// If the filednme key isn't set, create it now
		if (!isset($files[$row['segment']])) $files[$row['segment']] = array();

		array_push($files[$row['segment']], $entry);
	}
}
if (sizeof($files) === 0) {
	$files = (object)array();
} // Force data type to be object
echo json_encode([$files]);
