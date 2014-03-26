<?php
/// In development...

if (!empty($_POST['searchString'])) {
    // echo "<h2>Serach results: " . htmlsafe($_POST['searchString']) . "</h2>";
    // foreach($resultsArray as $resultData){
		// foreach($resultData as $tableName=>$result){
			// displayTable($result, $tableName, "alienRow", "alienID", "pnr_idkod", getColNames("Student", $pdo), $_POST['searchString']);
		// }
	// }
	displaySearchResult($AssignedQuizzesResult, "AssignedQuizzesResult", new array("ssn", "qVarNr", "quizNr", "quizCourseName", "courseOccasion"), new array("checkQuizzesLink"=>"", "checkQuizzesLink"=>""), $searchString=null) {
	// displayTable($aliensResult, "S&ouml;kresultat f&ouml;r utomjordingar", "alienRow", "alienID", "pnr_idkod", getColNames("AllaAliens", $pdo), $_POST['searchString']);
    // displayTable($incidentsResult, "S&ouml;kresultat f&ouml;r incidenter", "incidentRow", "incidentID", "namn", getColNames("incident", $pdo), $_POST['searchString']);
    // displayTable($shipsResult, "S&ouml;kresultat f&ouml;r rymdskepp", "shipRow", "shipID", "id", getColNames("skepp", $pdo), $_POST['searchString']);
    // displayTable($speciesResult, "S&ouml;kresultat f&ouml;r raser", "speciesRow", "speciesID", "namn", getColNames("AllaRaser", $pdo), $_POST['searchString']);
    // displayTable($weaponsResult, "S&ouml;kresultat f&ouml;r vapen", "weaponsRow", "weaponsID", "idnr", getColNames("vapen", $pdo), $_POST['searchString']);
    // if (isset($usersResult))
        // displayTable($usersResult, "S&ouml;kresultat f&ouml;r anv&auml;ndare", "userRow", "userID", "anvnamn", getColNames("anvandare", $pdo), $_POST['searchString']);
}
?>
