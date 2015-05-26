<?php
include_once("../Shared/basic.php");
?>
<html>
<head>
	<script src="dragndrop.js"></script>
</head>
<body>
	<div id="wrap">
		<?php
			require '../Shared/database.php';
			pdoConnect();
			$courseID = getOPG('courseid');
			echo "<script> var courseID = $courseID;</script>";
			if(getOPG('seqid') === "UNK"){
				$query = $pdo->prepare("SELECT seqid FROM sequence WHERE cid=$courseID ORDER BY seqid DESC LIMIT 0,1");
				$query->execute();
				$row = $query->fetch(PDO::FETCH_ASSOC);
				$seqID = $row["seqid"];
				} else {
					$seqID = getOPG('seqid');
			}		
			
			$query = $query = $pdo->prepare("SELECT seqid from sequence where cid=$courseID");
			$query->execute();
			$data = array();
			while($row = $query->fetch(PDO::FETCH_ASSOC)){
				$data[] = $row;
			}
			if(sizeof($data) == 0){
				echo "<button class='newSequence'>New sequence</button>";
				echo "<p class='noSequence'>There is currently no sequences in the database, please create a new sequence by clicking on the \"New sequence\" button!</p>";
			} else {
				echo "<div id='seqSelectBox'>";
				echo "Select Sequence: ";
				echo "<br>";
				echo "<select id='sequenceSelector'>";
				echo "<option value='$seqID'>Current: $seqID</option>";

				foreach($data as $key => $value){
					foreach($value as $val){
						if($val != $seqID){
							echo "<option value='$val'>$val</option>";
						}
					}
				}
				echo "</select>";	
				echo "<button class='newSequence'>New sequence</button>";
				echo "<button class='deleteSequence'>Delete sequence</button>";
				echo "</div>";
				
				
				$query = $pdo->prepare("SELECT exampleseq from sequence where seqid=$seqID and cid=$courseID");
				$query->execute();
				$data = array();
				$exampleExist = array();
				while($row = $query->fetch(PDO::FETCH_ASSOC)){
					$data[] = $row;
				}
				$data = explode(',',$data[0]['exampleseq']);
				echo "<div id='sortListBox'>";
				echo "<span>Sequence examples</span>";
				echo "<div id='sortList' class='dragAndDrop'>";
				foreach($data as $key => $value){
					$query = $pdo->prepare("SELECT examplename from codeexample where exampleid=$value");
					$query->execute();
					$examplename = $query->fetchColumn();
					array_push($exampleExist, $value);
					if($value){
						echo "<div id='item_$value'>- $examplename</div>";
					} else {
						echo "<div class='empty'>No items.</div>";
					}
				}
				echo "</div>";
				echo "</div>";
				
				echo "<img id='exchangeButton' src='../Shared/icons/exchangeButton.svg'>";
				
				$query = $pdo->prepare("SELECT exampleid,sectionname,examplename from codeexample where cid=$courseID");
				$query->execute();
				$data = array();
				while($row = $query->fetch(PDO::FETCH_ASSOC)){
					$data[$row['exampleid']] = array($row['exampleid'], $row['sectionname'], $row['examplename'],);
				}
				
				$query = $pdo->prepare("SELECT exampleseq from sequence where cid=$courseID");
				$query->execute();
				$exampleData = array();
				while($row = $query->fetch(PDO::FETCH_ASSOC)){
					$exampleData[] = $row;
				}
				$i = 0;
				$ex = array();
				foreach($exampleData as $exampleSeq => $value){
					array_push($ex, explode(',',$exampleData[$i]['exampleseq']));
					$i++;
				}
				$examp = array();
				foreach($ex as $e){
					foreach($e as $ee){
						array_push($examp, $ee);
					}
				}
				$count = 0;
				echo "<div id='exampleListBox'>";
				echo "<span>Unused examples</span>";
				echo "<div id='exampleList' class='dragAndDrop'>";
				foreach($data as $example){
					
					if(!in_array($example[0], $examp)){
						echo "<div id='item_$example[0]'>- $example[1]: $example[2]</div>";
						$count++;
					}	
				}
				if($count == 0){
					echo "<div class='empty'>No examples.</div>";
				}
				echo "</div>";
				echo "</div>";
				
				echo "<span id='status'></span>";
				echo "<button class='updateSequence'>Save sequence</button>";
			}	
		?>

	</div>
</body>
</html>
