<?php
addBackLink(array("courseName"=>$_POST['courseName'], "quizNr"=>$_POST['quizNr'],"qVarNr"=>$_POST['qVarNr'],"listQuizzesLink"=>"","listVariantsForSelectedQuiz"=>""));
echo "<h2>All data objects for quiz ".$_POST['quizNr']." variant ".$_POST['qVarNr']." for ".$_POST['courseName']."</h2>";
//$quizVariant
echo "<table class='dataTable'>";
echo "<caption>Quiz nr ".$_POST['quizNr']." Variant nr ".$_POST['qVarNr']." for ".$_POST['courseName']."</caption>";
//if(count($quizVariant)>0){
	foreach($quizVariant as $columnName=>$data){
		echo "<th>".$columnName."</th>";
	}
	echo "</tr>";
	echo "<tr>";
	foreach($quizVariant as $data){
		echo "<td>".$data."</td>";
	}
	echo "</tr>";
//}
echo "</table>";
echo "<table class='dataObjectTable'>";
		echo "<caption>Quiz nr ".$_POST['quizNr']." for ".$_POST['courseName']." variants</caption>";
		if(count($quizVariantObjects)>0){
			echo "<tr>";
		
			foreach($quizVariantObjects as $object){
		echo "<tr><td>";		
				echo "<form name='editDataObjectToVariantForm".$object['id']."' action='.' method='post' >";
				echo "<input type='hidden' name='scrolly' id='scrolly' value='0' />";
				echo "<label>Object ID:<br />";
				echo "<input type='text' name='newObjectId' value='".$object['id']."' /></label>";
				echo "<label>Object data:<br />";
				echo "<textarea name='objectData' rows='10' cols='60'>".$object['objectData']."</textarea></label>";
				echo "	<input type='hidden' name='courseName' value='".$object['quizCourseName']."' />
						<input type='hidden' name='objectId' value='".$object['id']."' />	
						<input type='hidden' name='quizNr' value='".$object['quizNr']."' />	
						<input type='hidden' name='qVarNr' value='".$object['qVarNr']."' />
						<input type='hidden' name='listVariantObjects' />
						<input type='hidden' name='listQuizzesLink' />
						
						<input type='submit' name='updateDataObject' value='Save' />";
				echo "<input type='submit' name='deleteDataObject' value='Delete' class='confirm' /> ";
				if(isset($updatedObjectId) && $updatedObjectId==$object['id']) echo "<br /><p style='float:right'>".$objectUpdateMsg."</p>";
				echo "</form>";
			}
		echo "</td></tr>";
		} else {
			echo "<tr><td>Quiz varaiant has no data objects</td></tr>";
		}
		echo "</table>";
echo "<table class='dataObjectTable'>";
		echo "<caption>Add new quiz variant to quiz ".$_POST['quizNr']." for ".$_POST['courseName']."</caption>";		
		echo "<tr><td>";
			echo "<form name='addDataObjectToVariantForm' action='.' method='post'>";
			echo "<input type='hidden' name='scrolly' id='scrolly' value='0' />";
			echo "<label>Object ID:<br />";
			echo "<input type='text' name='newObjectId' /></label>";
			echo "<label>Object data:<br />";			
			echo "<textarea name='objectData' rows='10' cols='60'></textarea></label>";
			echo "<input type='hidden' name='courseName' value='".$_POST['courseName']."' />";
			echo "	<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />";
			echo "	<input type='hidden' name='qVarNr' value='".$_POST['qVarNr']."' />";
			echo "	<input type='hidden' name='listVariantObjects' />";
			echo "	<input type='hidden' name='listQuizzesLink' />";
			echo "	<input type='submit' name='addDataObject' value='Save' />";
			echo "</form>";
		echo "</td></tr>";
	echo "</table>";
?>