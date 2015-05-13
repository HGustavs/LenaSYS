<?php
require '../Shared/database.php';
pdoConnect();
/*
-----------			---------------
-----------  UPDATE  --------------
-----------			---------------
*/
if ($_GET["action"] == "update"){
	$seqID = $_POST['seqid'];
	$courseID = $_POST['courseid'];
	$list = $_POST['list'];
	$output = array();
	$list = parse_str($list, $output);
	
	foreach($output as $items => $item){
		$last = end($item);
		$count = 1;
		foreach($item as $example){
			if($example == $item[0]){
				$query = $pdo->prepare("UPDATE codeexample SET beforeid=$example, afterid=$item[$count] WHERE exampleid=$example");
				$query->execute();
				$count++;
			} else if($example == $last) {
				$count--;
				$query = $pdo->prepare("UPDATE codeexample SET beforeid=$item[$count], afterid=$example WHERE exampleid=$example");
				$query->execute();
			} else {
				$before = $count-1;
				$query = $pdo->prepare("UPDATE codeexample SET beforeid=$item[$before], afterid=$item[$count] WHERE exampleid=$example");
				$query->execute();
				$count++;
			}
		}
	}
	$saveString = implode(',', $output['item']);
	$query = $pdo->prepare("UPDATE sequence SET `exampleseq`= '$saveString' WHERE seqid=$seqID and cid=$courseID");
	$query->execute();
}
/*
-----------			---------------
-----------   NEW  ----------------
-----------			---------------
*/ 
elseif ($_GET["action"] == "new"){
	$courseID = $_POST['courseid'];
	$query = $pdo->prepare("SELECT seqid FROM sequence WHERE cid=$courseID ORDER BY seqid DESC LIMIT 0,1");
	$query->execute();
	$row = $query->fetch(PDO::FETCH_ASSOC);
	$sequence = $row["seqid"];
	$sequence++;
	echo $sequence;
	$query = $pdo->prepare("INSERT INTO sequence (seqid, cid) VALUES ($sequence, $courseID)");
	$query->execute();
}  
/*
-----------			---------------
-----------  DELETE  --------------
-----------			---------------
*/
elseif ($_GET["action"] == "delete"){
	$seqID = $_POST['seqid'];
	$courseID = $_POST['courseid'];
	$query = $pdo->prepare("DELETE FROM sequence WHERE seqid=$seqID and cid=$courseID");
	$query->execute();

	$query = $pdo->prepare("SELECT seqid FROM sequence WHERE cid=$courseID ORDER BY seqid DESC LIMIT 0,1");
	$query->execute();
	$row = $query->fetch(PDO::FETCH_ASSOC);
	$sequence = $row["seqid"];
	echo $sequence;
} 
else {
	echo "FORBIDDEN AREA";
}
?>
