<?php
///In development...

$content = "search/search.html.php";
$pagetitle.=" - Sökresultat";

// function getColNames($tableName, $pdo) {
    // $columns = array();
    // foreach ($pdo->query("SHOW COLUMNS FROM " . $tableName . ";") as $columnInfo) {
        // array_push($columns, $columnInfo['Field']);
    // }
    // return $columns;
// }

function searchTable($tableToSearch, $searchString, $pdo) {
    $columns = getColNames($tableToSearch, $pdo);
    $searchWords = explode(" ", $searchString);
    $counter = 0;
    $querystring = "SELECT * FROM " . $tableToSearch . " WHERE ";
    foreach ($columns as $colName) {
        $querystring.="(";
        foreach ($searchWords as $word) {
            $querystring.=" " . $colName . " LIKE :SSTRING" . $counter . " OR";
            $counter++;
        }
        $querystring = substr($querystring, 0, strlen($querystring) - 2);
        $querystring.=") OR ";
    }
    $querystring = substr($querystring, 0, strlen($querystring) - 3);
    $querystring.=";";
    $stmt = $pdo->prepare($querystring);

    $j = 0;
    for ($i = 0; $i <= $counter - 1; $i++) {

        $sstring = "%" . $searchWords[$j] . "%";
        $stmt->bindValue(':SSTRING' . $i, $sstring);
        $j++;
        if ($j >= sizeof($searchWords)) {
            $j = 0;
        }
    }

    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $result;
}

function displaySearchResult($tableData, $tableCaption, $identifyingColumns, $hiddenFields, $searchString=null) {
    if (isset($searchString)) {
        $searchWords = explode(" ", $searchString);
        $replaceWords = array();
        foreach ($searchWords as $sWord) {
            array_push($replaceWords,"~".$sWord."^");
        }
    }

	$idString="";
	foreach($identifyingColumns as $id){
		$idString.=$id;
	}
	
    echo "<table class='dataTable'>";
    echo "<thead>";
    echo "<caption>" . $tableCaption . "</caption>";
    if (sizeof($tableData) > 0) {
        echo "<tr class='headerRow'>";
        foreach($studentList[0] as $columnName=>$data){
				echo "<th>".$columnName."</th>";
		}
		// foreach ($columnNames as $colName) {
            // echo "<th>" . $colName . "</th>";
        // }
        echo "</tr>";
        echo "</thead>";
        foreach ($tableData as $row) {
            echo "<tr class='dataRow'>";
            echo "<form name='" . $tableCaption . $idString . "' action='.' method='post' >";
            foreach($identifyingColumns as $name){
				echo "<input type='hidden' name='".$name."' value='" . $row[$name] . "' />";
			}
			foreach($hiddenFields as $name=>$value){
				echo "<input type='hidden' name='".$name."' value='" . $value . "' />";
			}
            foreach ($row as $value) {
                echo "<td onclick='document[\"" . $tableCaption . $idString . "\"].submit();return false;'>"; // . htmlsafe($value) . "</td>";
                if (isset($searchWords)) {
                   $value=str_replace($searchWords, $replaceWords, htmlsafe($value));
                   $value=str_replace("~","<strong>",$value);
                   echo str_replace("^","</strong>",$value);
                } else {
                    output($value);
                }
                echo "</td>";
            }
            echo "</form>";
            echo "</tr>";
        }
    } else {
        echo "</thead>";
        echo "<tr>";
        echo "<td>";
        echo "No matches for the search string";
        echo "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

if (!empty($_POST['searchString'])) {

    // $queryString="SHOW TABLES;";
	// $stmt = $pdo->prepare($queryString);
	// $stmt->execute();
    // $tableNames = $stmt->fetchAll(PDO::FETCH_ASSOC);
	// $resultsArray=array();
	// foreach($tableNames as $table){
		// foreach($table as $tableName){
			// $result = searchTable($tableName, $_POST['searchString'], $pdo);
			// array_push($resultsArray,array($tableName=>$result));
		// }
	// }
	
	$AssignedQuizzesResult = searchTable("AssignedQuizzes", $_POST['searchString'], $pdo);
	
	// $aliensResult = searchTable("AllaAliens", $_POST['searchString'], $pdo);
    // $incidentsResult = searchTable("incident", $_POST['searchString'], $pdo);
    // $shipsResult = searchTable("skepp", $_POST['searchString'], $pdo);
    // $speciesResult = searchTable("AllaRaser", $_POST['searchString'], $pdo);
    // $weaponsResult = searchTable("vapen", $_POST['searchString'], $pdo);

    // if (isset($_SESSION['userType']) && $_SESSION['userType'] == "admin") {
        // $usersResult = searchTable("anvandare", $_POST['searchString'], $pdo);
    // }
} else {
    $errorMsg = "No search string entered";
}
?>