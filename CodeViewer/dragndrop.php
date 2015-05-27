<?php
include_once("../Shared/basic.php");
?>
<html>
<head>
	<script src="dragndrop.js"></script>
</head>
<body>
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
				echo "<table style='width: 100%'>";
				echo "<tr>";
				echo "<td style='width: 70%'>";
				echo "<p class='noSequence'>There is currently no sequences in the database, please create a new sequence by clicking on the \"New sequence\" button!</p>";
				echo "</td>";
				echo "<td style='text-align: right; width: 30%'>";
				echo "<button class='newSequence'>New sequence</button>";
				echo "</td>";
				echo "<tr>";
				echo "</table>";
			} else {
				echo "<table style='width: 100%'>";
				echo "<tr>";
				echo "<td>";
				echo "Select Sequence:";
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
				echo "</td>";
				echo "<td style='text-align: right'>";
				echo "<button class='newSequence'>New sequence</button>";
				echo "<button class='deleteSequence'>Delete sequence</button>";
				echo "</td>";
				echo "</tr>";
				echo "<tr>";
				echo "</table>";
				
				
				$query = $pdo->prepare("SELECT exampleseq from sequence where seqid=$seqID and cid=$courseID");
				$query->execute();
				$data = array();
				$exampleExist = array();
				while($row = $query->fetch(PDO::FETCH_ASSOC)){
					$data[] = $row;
				}
				$data = explode(',',$data[0]['exampleseq']);
				echo "<table style='width: 100%'>";
				echo "<tr>";
				echo "<td id='sortListBox'>";
				echo "<fieldset style='padding: 5px;'>";
				echo "<legend>Sequence examples</legend>";
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

				echo "</fieldset>";
				echo "</td>";
				
				echo "<td style='width: 30px; text-align: center;'>";
				echo "<img id='exchangeButton' src='../Shared/icons/exchangeButton.svg'>";
				echo "</td>";
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
				echo "<td id='exampleListBox'>";
				echo "<fieldset style='padding: 5px;'>";
				echo "<legend>Unused examples</legend>";
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
				echo "</fieldset>";
				echo "</table>";
				echo "<table style='width: 100%'>";
				echo "</td>";
				echo "</tr>";
				echo "<tr>";
				echo "<td id='status'></td>";
				echo "<td style='text-align: right'>";
				echo "<button class='updateSequence'>Save sequence</button>";
				echo "</td>";
				echo "</tr>";
				echo "</table>";
				
				
			}	
		?>
</body>
</html>
