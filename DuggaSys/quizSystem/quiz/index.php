<?php
if(isset($_POST['listVariantObjects'])){
	
	//Used to update the list of dataobjects stored for each quiz variant
	function updateDataObjectList($quizNr, $qVarNr, $courseName, $pdo){
		$queryString = "SELECT QuizVariantObject.id
						FROM QuizVariantObject
						WHERE QuizVariantObject.quizNr=:QNR
							AND QuizVariantObject.qVarNr=:QVNR
							AND QuizVariantObject.quizCourseName=:CNAME;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':QVNR', $qVarNr);
		$stmt->bindParam(':QNR', $quizNr);
		$stmt->bindParam(':CNAME', $courseName);
		$stmt->execute();
		$quizVariantIds=$stmt->fetchAll(PDO::FETCH_ASSOC);
		$dataObjectsString="";
		foreach($quizVariantIds as $objectId){
			$dataObjectsString.=$objectId['id']." ";
		}
		$dataObjectsString=trim($dataObjectsString);
		$updateString = "UPDATE QuizVariant 
						 SET QuizVariant.quizObjectIDs=:OBJECTIDS
						 WHERE QuizVariant.qVarNr=:QVNR
							AND QuizVariant.quizNr=:QNR 
							AND QuizVariant.quizCourseName=:CNAME;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':OBJECTIDS', $dataObjectsString);
		$updateStmt->bindParam(':QNR', $quizNr);
		$updateStmt->bindParam(':QVNR', $qVarNr);
		$updateStmt->bindParam(':CNAME', $courseName);
		$updateStmt->execute();
		/*
		if($updateStmt->execute()){
			$userMsg.=" Object ID list for quiz ".$quizNr." variant ".$qVarNr." successfully updated"; 
		} else {
			$errorMsg.="ERROR: Object ID list for quiz ".$quizNr." variant ".$qVarNr." FAILED to update"; 
		}*/
		$updateStmt->closeCursor();
	}
	
	//updateDataObject
	if(isset($_POST['updateDataObject'])){
		$updateString = "UPDATE QuizVariantObject 
						 SET QuizVariantObject.id=:NEWID, QuizVariantObject.objectData=:OBJECTDATA
						 WHERE QuizVariantObject.id=:ID
							AND QuizVariantObject.qVarNr=:QVNR
							AND QuizVariantObject.quizNr=:QNR 
							AND QuizVariantObject.quizCourseName=:CNAME;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':ID', $_POST['objectId']);
		$updateStmt->bindParam(':NEWID', $_POST['newObjectId']);
		$objectData=htmlentities($_POST['objectData'], ENT_QUOTES, "UTF-8");
		$updateStmt->bindParam(':OBJECTDATA', $objectData);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		$updateStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		if($updateStmt->execute()){
			$userMsg.="Object successfully updated"; 
			$updatedObjectId=$_POST['newObjectId'];
			$objectUpdateMsg="Saved";
		} else {
			$errorMsg.="ERROR: Object update failed";
			$updatedObjectId=$_POST['newObjectId'];
			$objectUpdateMsg="Failed";
		}
		$updateStmt->closeCursor();
		updateDataObjectList($_POST['quizNr'], $_POST['qVarNr'], $_POST['courseName'], $pdo);
	}
	
	//deleteDataObject
	if(isset($_POST['deleteDataObject'])){
		// $deleteQuery = "DELETE FROM QuizVariantObject 
		                // WHERE QuizVariantObject.id=:ID
							// AND QuizVariantObject.qVarNr=:QVNR 
							// AND QuizVariantObject.quizNr=:QNR 
							// AND QuizVariantObject.quizCourseName=:CNAME";
		// $deleteStmt = $pdo->prepare($deleteQuery);
		// $deleteStmt->bindParam(':ID', $_POST['objectId']);
		// $deleteStmt->bindParam(':QNR', $_POST['quizNr']);
		// $deleteStmt->bindParam(':CNAME', $_POST['courseName']);
		// $deleteStmt->bindParam(':QVNR', $_POST['qVarNr']);
		// if($deleteStmt->execute()){
			// $userMsg.="Object ID ".$_POST['objectId']." successfully deleted"; 
		// } else {
			// $errorMsg.="ERROR: Object ID ".$_POST['objectId']." NOT deleted"; 
		// }
		// updateDataObjectList($_POST['quizNr'], $_POST['qVarNr'], $_POST['courseName'], $pdo);
		$errorMsg.="ERROR: Object ID ".$_POST['objectId']." NOT deleted - FUNCTION DISABLED"; 
	}
	
	//addDataObject
	if(isset($_POST['addDataObject'])){
		$insertString = "INSERT INTO QuizVariantObject(id, qVarNr, quizNr, quizCourseName, objectData) VALUES(:ID,:QVNR,:QNR,:CNAME,:OBJECTDATA);";
		$insertStmt = $pdo->prepare($insertString);
		$insertStmt->bindParam(':ID', $_POST['newObjectId']);
		$insertStmt->bindParam(':QNR', $_POST['quizNr']);
		$insertStmt->bindParam(':CNAME', $_POST['courseName']);
		$insertStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$objectData=htmlsafe($_POST['objectData']);
		$insertStmt->bindParam(':OBJECTDATA', $objectData);
		if($insertStmt->execute()){
			$userMsg.="Object ID ".$_POST['newObjectId']." successfully added"; 
		} else {
			$errorMsg.="ERROR: Object ID ".$_POST['newObjectId']." NOT added"; 
		}
		updateDataObjectList($_POST['quizNr'], $_POST['qVarNr'], $_POST['courseName'], $pdo);
	}
	
	//Fetch all data objects in selected quiz variant
	$queryString = "SELECT * 
					FROM QuizVariantObject
					WHERE  QuizVariantObject.qVarNr=:QVNR 
						AND QuizVariantObject.quizNr=:QNR
						AND quizCourseName=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':QVNR', $_POST['qVarNr']);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$quizVariantObjects=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	//Fetch data for the selected variant
	$queryString = "SELECT * 
					FROM QuizVariant
					WHERE quizNr=:QNR
						AND qVarNr=:QVNR
						AND quizCourseName=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':QVNR', $_POST['qVarNr']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$quizVariant=$stmt->fetch(PDO::FETCH_ASSOC);
	
	$content="quiz/listDataObjects.html.php";
} else if(isset($_POST['editSelectedQuiz']) || isset($_POST['addQuizSubmit'])){ //If user selected add or edit quiz
		
	if(isset($_POST['editSelectedQuiz'])){
		$queryString = "SELECT Quiz.nr, Quiz.courseName, Quiz.opening, Quiz.closing, Quiz.quizData, Quiz.autoCorrected, Quiz.allowMultipleReplies, Quiz.quizURI
						FROM Quiz 
						WHERE nr=:QNR AND courseName=:CNAME";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':QNR', $_POST['quizNr']);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->execute();
		$quiz=$stmt->fetch(PDO::FETCH_ASSOC);
	}
	$content="quiz/addEditQuiz.html.php";
		
} else if(isset($_POST['listVariantsForSelectedQuiz'])){

	//Add new variant of quiz
	if(isset($_POST['addVariantToQuizFormSubmit'])){
		$insertString = "INSERT INTO QuizVariant(qVarNr, quizNr, quizCourseName, correctAnswer) VALUES(:QVNR, :QNR,:CNAME,:CANSWER);";
		$insertStmt = $pdo->prepare($insertString);
		$insertStmt->bindParam(':QNR', $_POST['quizNr']);
		$insertStmt->bindParam(':CNAME', $_POST['courseName']);
		$insertStmt->bindParam(':QVNR', $_POST['newQVarNr']);
		$insertStmt->bindParam(':CANSWER', $_POST['correctAnswer']);
		if($insertStmt->execute()){
			$userMsg.="Variant nr: ".$_POST['newQVarNr']." for quiz nr: ".$_POST['quizNr']." successfully added"; 
			$_POST['qVarNr']=$_POST['newQVarNr']+1;
		} else {
			$errorMsg.="ERROR: Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." NOT added"; 
		}
	}
	
	//Apply changes to variant of quiz
	if(isset($_POST['editVariantOfQuizFormSubmit'])){
		$updateString = "UPDATE QuizVariant 
						 SET QuizVariant.qVarNr=:NEWQVNR, QuizVariant.correctAnswer=:CANSWER
						 WHERE QuizVariant.qVarNr=:QVNR
							AND QuizVariant.quizNr=:QNR 
							AND QuizVariant.quizCourseName=:CNAME;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':NEWQVNR', $_POST['newQVarNr']);
		$updateStmt->bindParam(':CANSWER', $_POST['correctAnswer']);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		$updateStmt->bindParam(':QVNR', $_POST['qVarNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		if($updateStmt->execute()){
			$userMsg.="Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." successfully updated"; 
			$_POST['qVarNr']=$_POST['newQVarNr'];
		} else {
			$errorMsg.="ERROR: Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." NOT updated"; 
		}
		$updateStmt->closeCursor();
	} 
	
	//deleteVariantOfQuizSubmit
	//Delete variant of quiz (and all quiz-assignments to students)
	if(isset($_POST['deleteVariantOfQuizSubmit'])){
		// $deleteQuery = "DELETE FROM QuizVariant 
		                // WHERE QuizVariant.qVarNr=:QVNR 
							// AND QuizVariant.quizNr=:QNR 
							// AND QuizVariant.quizCourseName=:CNAME";
		// $deleteStmt = $pdo->prepare($deleteQuery);
		// $deleteStmt->bindParam(':QNR', $_POST['quizNr']);
		// $deleteStmt->bindParam(':CNAME', $_POST['courseName']);
		// $deleteStmt->bindParam(':QVNR', $_POST['qVarNr']);
		// if($deleteStmt->execute()){
			// $userMsg.="Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." successfully deleted"; 
		// } else {
			// $errorMsg.="ERROR: Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." NOT deleted"; 
		// }
		 $errorMsg.="ERROR: Variant nr: ".$_POST['qVarNr']." for quiz nr: ".$_POST['quizNr']." NOT deleted - FUNCTION DISABLED"; 
	}
	
	//Fetch all variants of selected quiz
	$queryString = "SELECT QuizVariant.qVarNr, QuizVariant.quizNr, QuizVariant.quizCourseName, QuizVariant.correctAnswer, QuizVariant.quizObjectIDs, Quiz.quizURI 
	                FROM QuizVariant, Quiz
					WHERE Quiz.nr=QuizVariant.quizNr 
						AND QuizVariant.quizNr=:QNR
						AND quizCourseName=:CNAME;";
	$stmt = $pdo->prepare($queryString);
	$stmt->bindParam(':QNR', $_POST['quizNr']);
	$stmt->bindParam(':CNAME', $_POST['courseName']);
	$stmt->execute();
	$quizVariants=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$content="quiz/editVariants.html.php";

} else { //Else display course selection
		
	//Delete quiz from course (and all variants of the quiz and all quiz-assignments to students)
	if(isset($_POST['deleteSelectedQuiz'])){
		// $deleteQuery = "DELETE FROM Quiz 
		                // WHERE Quiz.nr=:QNR 
							// AND Quiz.courseName=:CNAME";
		// $deleteStmt = $pdo->prepare($deleteQuery);
		// $deleteStmt->bindParam(':QNR', $_POST['quizNr']);
		// $deleteStmt->bindParam(':CNAME', $_POST['courseName']);
		
		// if($deleteStmt->execute()){
			// $userMsg.="Quiz nr: ".$_POST['quizNr']." successfully deleted from ".$_POST['courseName']; 
		// } else {
			// $errorMsg.="ERROR: Could not delete Quiz nr: ".$_POST['quizNr']." from ".$_POST['courseName']; 
		// }
		$errorMsg.="ERROR: Could not delete Quiz nr: ".$_POST['quizNr']." from ".$_POST['courseName']." - FUNCTION DISABLED";
	}
	
	//Make submitted changes to quiz
	if(isset($_POST['submitChangesToQuizSubmit'])){
		$updateString = "UPDATE Quiz 
						 SET Quiz.nr=:NEWQNR, Quiz.opening=:OPEN, Quiz.closing=:CLOSE, Quiz.quizData=:QDATA, Quiz.autoCorrected=:AUTO, Quiz.allowMultipleReplies=:MULTIPLE, Quiz.quizURI=:QURI 
						 WHERE Quiz.nr=:QNR AND Quiz.courseName=:CNAME;";
		$updateStmt = $pdo->prepare($updateString);
		$updateStmt->bindParam(':OPEN', $_POST['quizOpeningDateTime']);
		$updateStmt->bindParam(':CLOSE', $_POST['quizClosingDateTime']);
		if($_POST['quizAutoCorrected']!="")
			$autoCorrected=1;
		else
			$autoCorrected=0;
		$updateStmt->bindParam(':AUTO', $autoCorrected);
		if($_POST['allowMultipleReplies']!="")
			$allowMultipleReplies=1;
		else
			$allowMultipleReplies=0;
		$updateStmt->bindParam(':MULTIPLE', $allowMultipleReplies);
		$quizData=htmlsafe($_POST['quizData']);
		$updateStmt->bindParam(':QDATA', $quizData);
		$updateStmt->bindParam(':QNR', $_POST['quizNr']);
		if($_POST['allowMultipleReplies']!="")
			$allowMultipleReplies=1;
		else
			$allowMultipleReplies=0;
		$updateStmt->bindParam(':MULTIPLE', $allowMultipleReplies);
		$updateStmt->bindParam(':QURI', $_POST['quizURI']);
		$updateStmt->bindParam(':NEWQNR', $_POST['newQuizNr']);
		$updateStmt->bindParam(':CNAME', $_POST['courseName']);
		if($updateStmt->execute()){
			$userMsg.="Quiz nr: ".$_POST['quizNr']." for ".$_POST['courseName']." successfully updated"; 
		} else {
			$errorMsg.="ERROR: Quiz nr: ".$_POST['quizNr']." for ".$_POST['courseName']." NOT updated"; 
		}
	} 
	
	//Add new quiz to course
	if(isset($_POST['addQuizToCourseSubmit'])){
		$insertString = "INSERT INTO Quiz(nr, courseName, opening, closing, autoCorrected, allowMultipleReplies, quizURI, quizData)
						 VALUES(:QNR,:CNAME,:OPEN,:CLOSE,:AUTO,:MULTIPLE,:QURI,:QDATA);";
		$insertStmt = $pdo->prepare($insertString);
		$insertStmt->bindParam(':QNR', $_POST['newQuizNr']);
		$insertStmt->bindParam(':CNAME', $_POST['courseName']);
		$insertStmt->bindParam(':OPEN', $_POST['quizOpeningDateTime']);
		$insertStmt->bindParam(':CLOSE', $_POST['quizClosingDateTime']);
		if($_POST['quizAutoCorrected']!="")
			$autoCorrected=1;
		else
			$autoCorrected=0;
		$insertStmt->bindParam(':AUTO', $autoCorrected);
		if($_POST['allowMultipleReplies']!="")
			$allowMultipleReplies=1;
		else
			$allowMultipleReplies=0;
		$insertStmt->bindParam(':MULTIPLE', $allowMultipleReplies);
		$insertStmt->bindParam(':QURI', $_POST['quizURI']);
		$quizData=htmlsafe($_POST['quizData']);
		$insertStmt->bindParam(':QDATA', $quizData);
		if($insertStmt->execute()){
			$userMsg.="Quiz for ".$_POST['courseName']." successfully added"; 
		} else {
			$errorMsg.="ERROR: Quiz for ".$_POST['courseName']." NOT added"; 
		}
	}
	
	//Fetch all quizzes for selected course
	if(isset($_POST['listQuizzesSubmit'])){
		$queryString = "SELECT Quiz.nr, Quiz.courseName, Quiz.opening, Quiz.closing, Quiz.autoCorrected, Quiz.allowMultipleReplies, Quiz.quizURI
		                FROM Quiz
						WHERE Quiz.courseName=:CNAME;";
		$stmt = $pdo->prepare($queryString);
		$stmt->bindParam(':CNAME', $_POST['courseName']);
		$stmt->execute();
		$quizList=$stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	//Fetch all courses from Course-table to populate dropdown-list
	$queryString = "SELECT * FROM Course";
	$stmt = $pdo->prepare($queryString);
	$stmt->execute();
	$courseList=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$content="quiz/listQuizzes.html.php";
}
?>