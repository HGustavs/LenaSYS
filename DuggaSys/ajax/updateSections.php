<?php 
session_start(); 

include_once(dirname(__file__)."/../../Shared/sessions.php");
include_once(dirname(__file__)."/../../Shared/courses.php");

if (checklogin()) {
	if (isSuperUser($_SESSION["uid"]) || hasAccess($_SESSION["uid"], $_POST["courseid"], 'w')) {
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();
		$success = true;
		$stmt = $pdo -> prepare('UPDATE `listentries` SET `entryname` = :2, `kind` = :3, `visible` = :4, `link` = :5, `code_id` = :6 WHERE `lid` = :1');
		$stmt -> bindParam(':1', $_POST["sectionid"]);
		$stmt -> bindParam(':2', $_POST["sectionname"]);
		$stmt -> bindParam(':3', $_POST["type"]);
		$stmt -> bindParam(':4', $_POST["visibility"]);
		
		$link = $_POST["link"];
		$code_id = NULL;
		if (strlen($link) <= 0) {
			$query = $pdo -> prepare('SELECT `cid` FROM `listentries` WHERE `lid` = :1');
			$query -> bindParam(':1', $_POST["sectionid"]);
			if (!$query->execute()) {
				$success = FALSE;
			}
			$query = $query->fetch(PDO::FETCH_NUM);
			$courseid = $query[0];
			if ($_POST["type"] == 2) {
				$query = $pdo->prepare("INSERT INTO codeexample (cid, examplename, wordlist, runlink,uid) VALUES(:cid, :name, 'JS', '<none>',:uid)");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':name', $_POST["sectionname"]);
				$query->bindParam(':uid', $_SESSION['uid']);
				if(!$query->execute()) {
					// TODO: Remove these debug prints
					print_r($query->errorInfo());
				} else {
					// Get example id
					$eidq = $pdo->query("SELECT LAST_INSERT_ID() as code_id");
					$eidq->execute();
					$eid = $eidq->fetch(PDO::FETCH_NUM);
					$code_id = $eid[0];
					$link = "../CodeViewer/EditorV30.php?exampleid=".$code_id."&courseid=".$courseid;

					// Create file list
					$sinto = $pdo->prepare("INSERT INTO filelist(exampleid, filename, uid) SELECT exampleid,'<none>',uid FROM codeexample WHERE exampleid=:eid");
					$sinto->bindParam(':eid', $eid[0]);
					if(!$sinto->execute()) {
						// TODO: Remove these debug prints
						print_r($sinto->errorInfo());
					}
				}
			} else if ($_POST["type"] == 3) {
				$query = $pdo->prepare("INSERT INTO quiz (courseID, name) VALUES(:cid, :name)");
				$query->bindParam(':cid', $courseid);
				$query->bindParam(':name', $_POST["sectionname"]);
				if(!$query->execute()) {
					// TODO: Remove these debug prints
					print_r($query->errorInfo());
				} else {
					// Get example id
					$eidq = $pdo->query("SELECT LAST_INSERT_ID() as quiz_id");
					$eidq->execute();
					$eid = $eidq->fetch(PDO::FETCH_NUM);
					$quiz_id = $eid[0];
					$link = "quiz/menu?quizid=".$quiz_id."&courseid=".$courseid;
				}
			}
		} else {
			if ($_POST["type"] == 2) {
				$split = explode('=', $link);
				$split = explode('&', $split[1]);
				$code_id = intval($split[0]);
			}
		}
		$stmt -> bindParam(':5', $link);
		$stmt -> bindParam(':6', $code_id);
		
		if (!$stmt -> execute()) {
			$success = FALSE;
		}

		echo json_encode($link);
	} else {
		echo json_encode("No write access");
	}
} else {
	echo json_encode("No access");
}

?>