<?php
addBackLink(array("courseName"=>$_POST['courseName'], "quizNr"=>$_POST['quizNr'],"listQuizzesLink"=>"", "listQuizzesSubmit"=>""));
echo "<h2>Add or edit variants of quiz ".$_POST['quizNr']." in ".$_POST['courseName']."</h2>";
echo "<form name='addEditVariantToQuizForm' action='.' method='post'>";

echo "<label for='newQVarNr'>Variant nr:</label>";
echo "<input type='text' name='newQVarNr' ";
if(isset($_POST['qVarNr'])) echo "value='".$_POST['qVarNr']."'";
echo " />";

echo "<label for='correctAnswer'>Correct answer:</label>";
echo "<input type='text' name='correctAnswer' ";
if(isset($_POST['correctAnswer'])) echo "value='".$_POST['correctAnswer']."'";
echo " />";

if(isset($_POST['qVarNr'])) echo "<input type='hidden' name='qVarNr' value='".$_POST['qVarNr']."' />";
echo "<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />";
echo "<input type='hidden' name='courseName' value='".$_POST['courseName']."' />";
echo "<input type='hidden' name='listVariantsForSelectedQuiz' />";
echo "<input type='hidden' name='listQuizzesLink' />";
echo "<input type='submit' name='editVariantOfQuizFormSubmit' value='Save changes' />";
echo "<input type='submit' name='addVariantToQuizFormSubmit' value='Add as new' />";
echo "</form>";

//echo "<h2>Variants of quiz nr ".$_POST['quizNr']." for ".$_POST['courseName']."</h2>";
echo "<table class='dataTable'>";
		echo "<caption>Quiz nr ".$_POST['quizNr']." for ".$_POST['courseName']." variants</caption>";
		if(count($quizVariants)>0){
			foreach($quizVariants[0] as $columnName=>$data){
				echo "<th>".$columnName."</th>";
			}
			echo "</tr>";
			foreach($quizVariants as $row){
				echo "<tr>";
				foreach($row as $key=>$data){
					if($key!="quizURI")	echo "<td>".$data."</td>";
					//echo "<td>".$data."</td>";
				}
				echo "<td>
						<form name='testVariantOfQuizForm' action='quiz/quizLoader.php' method='post'  target='_blank' >
							<label>With answer:<input type='checkbox' name='withAnswer' id='withAnswer' /></label>
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
							<input type='hidden' name='answerString' value='".$row['correctAnswer']."' />
							<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
							<input type='hidden' name='quizURI' value='".$row['quizURI']."' />
							<input type='submit' name='testVariantToQuizFormSubmit' value='Test' />
						</form>
					  </td>";
				echo "<td>
						<form name='editVariantOfQuizForm' action='.' method='post'>
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
							<input type='hidden' name='correctAnswer' value='".$row['correctAnswer']."' />
							<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
							<input type='hidden' name='listVariantsForSelectedQuiz' />
							<input type='hidden' name='listQuizzesLink' />
							<input type='submit' name='editVariantToQuizFormSubmit' value='Edit' />
						</form>
					  </td>";
				echo "<td>
						<form name='deleteVariantOfQuizForm' action='.' method='post'>
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
							<input type='hidden' name='correctAnswer' value='".$row['correctAnswer']."' />
							<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
							<input type='hidden' name='listVariantsForSelectedQuiz' />
							<input type='hidden' name='listQuizzesLink' />
							<input type='submit' name='deleteVariantOfQuizSubmit' value='Delete' class='confirm' />
						</form>
					  </td>";
				echo "<td>
						<form name='viewObjectsForVariantForm' action='.' method='post'>
							<input type='hidden' name='courseName' value='".$_POST['courseName']."' />
							<input type='hidden' name='quizNr' value='".$_POST['quizNr']."' />
							<input type='hidden' name='qVarNr' value='".$row['qVarNr']."' />
							<input type='hidden' name='listVariantsForSelectedQuiz' />
							<input type='hidden' name='listQuizzesLink' />
							<input type='hidden' name='listVariantObjects' />
							<input type='submit' name='viewObjectsForVariantSubmit' value='Data objects' />
						</form>
					  </td>";
				echo "</tr>";
			}
		} else {
			echo "<tr><td>No variants found for this quiz.</td></tr>";
		}
echo "</table>";
?>