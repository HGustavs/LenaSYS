<?php 
session_start(); 
include_once(dirname(__file__)."/../../Shared/sessions.php");
if (checklogin()) {

	if (hasAccess($_SESSION["uid"], $_POST["cid"], "w")) {
		
		include_once(dirname(__file__)."/../../../coursesyspw.php");
		include_once(dirname(__file__)."/../../Shared/database.php");
		pdoConnect();

		$stmt = $pdo -> prepare('SELECT count(id) as count FROM quiz WHERE cid=:cid AND id=:qid');
		$stmt -> bindParam(':qid', $_POST["qid"]);
		$stmt -> bindParam(':cid', $_POST["cid"]);
		$stmt -> execute();	
		$data = $stmt->fetch();

		if ($data[0]>0) {
			$varCheck = "";
			if ($_POST["action"]=="edit") {
	
				if (isset($_POST["quizname"]) && $_POST["quizname"] !="") {
					$quizname = $_POST["quizname"];
				} else {
					$varCheck .= "quizname/";
				}
				if (isset($_POST["gradesys"]) && $_POST["gradesys"] !="") {
					$gradesys = $_POST["gradesys"];
				} else {
					$varCheck .= "gradesys/";
				}
	
				if ($varCheck=="") {
					
					if (isset($_POST["answer"]) && $_POST["answer"] !="") {
						$answer = $_POST["answer"];
					} else {
						$answer = "";
					}
					if (isset($_POST["parameter"]) && $_POST["parameter"] !="") {
						$parameter = $_POST["parameter"];
					} else {
						$parameter = "";
					}
					if (isset($_POST["quizfile"]) && $_POST["quizfile"] !="") {
						$dir    = '../templates';
						$files = scandir($dir);
						
						if (in_array($_POST["quizfile"].".js", $files)) {
							$quizfile = $_POST["quizfile"];
							//echo json_encode("file does not exist");
						} else {
							$quizfile = "default.js";
						}
						
					} else {
						$answer = "";
					}
					$autograde = "0";
					if (isset($_POST["autograde"]) && $_POST["autograde"] =="true") {
						$autograde = "1";
					} elseif (isset($_POST["autograde"]) && $_POST["autograde"] =="false") {
						$autograde = "0";
					}

					if (isset($_POST["activateonsubmit"]) && $_POST["activateonsubmit"] =="true") {
						date_default_timezone_set('Europe/Stockholm');
 						$now= date('Y-m-d H:i:s');
						$releasedate = $now;
					} else {
						if (isset($_POST["releasedate"]) && $_POST["releasedate"] !="") {
							$releasedate = $_POST["releasedate"];
						} else {
							$releasedate = "0000-00-00 00:00:00";
						}
					}
					if (isset($_POST["deadline"]) && $_POST["deadline"] !="") {
						date_default_timezone_set("Europe/Stockholm");
						if (strtotime($_POST["deadline"])<strtotime($releasedate)) {
							$deadline = false;
						} else {
							$deadline = $_POST["deadline"];
						};
						
					} else {
						$deadline = "0000-00-00 00:00:00";
					}
					
					if ($deadline!=false) {
						$stmt = $pdo -> prepare('UPDATE `quiz` SET 
							`autograde`=:2,
							`gradesystem`=:3,
							`answer`=:4,
							`name`=:5,
							`parameter`=:9,
							`quizFile`=:8,
							`release`=:6,
							`deadline`=:7 
							WHERE id=:qid');
						$stmt -> bindParam(':qid', $_POST["qid"], PDO::PARAM_INT);
						$stmt -> bindParam(':2', $autograde);
						$stmt -> bindParam(':3', $gradesys);
						$stmt -> bindParam(':4', $answer);
						$stmt -> bindParam(':5', $quizname);
						$stmt -> bindParam(':6', $releasedate);
						$stmt -> bindParam(':7', $deadline);
						$stmt -> bindParam(':8', $quizfile);
						$stmt -> bindParam(':9', $parameter);
						
						if ($stmt -> execute()) {
							echo json_encode("success");
						} else {
							//print_r($releasedate);
							print_r($stmt -> errorInfo());						
						}
					} else {
						echo json_encode("false_deadline");
					}
				} else {
					echo json_encode($varCheck);
				}

			} elseif($_POST["action"]=="create") {
	
				$stmt = $pdo -> prepare('INSERT INTO `quiz`(`cid`) VALUES (:cid)');
				$stmt -> bindParam(':cid', $_POST["cid"]);
				
				if ($stmt -> execute()) {
					$id = $pdo->lastInsertId();
	
					$stmt = $pdo -> prepare('SELECT `id`, `cid`, `autograde`, `gradesystem`, `answer`, `name`, `release`, `deadline` FROM quiz WHERE id=:1');
					$stmt -> bindParam(':1', $id);
					$stmt -> execute();	
					$data = $stmt->fetch();
	
					echo json_encode($data);
	
				} else {
					//print_r($releasedate);
					print_r($stmt -> errorInfo());						
				}
			} else {
				echo json_encode("no action submitted");
			}
			if ($varCheck!="") {
	
				//echo json_encode($varCheck);	
			} else {
				//echo json_encode("all data present");		
			}
			
			
		} else {
			echo json_encode("no write access on quiz");
		}
	} else {

	}
} else {
	echo json_encode("no access");
}

?>
