<?php


//parseNames.php
	//Do parsing
	$studentList=trim($_POST['studentList']);
	$toBeReplaced=array("\t","\x0B","\0"); 
	$studentList=str_replace($toBeReplaced," ",$studentList); //Convert all types of white space into spaces
	$lines=explode("\n", $studentList); //Separate parsing data into lines based on new line char
	$students=array();
	$counter=0;
	foreach($lines as $line){ //Parse each line into a student
		
		//echo "<br /> ".$line." <br />";
		$words=explode(" ", $line);    //Separate the line into parts based on spaces
		$ssn=$words[0];                //First word is the SSN
		//Add names:
		$name=$words[1];
		$i=2;
		while(substr($name, -1)!=","){ //Find ,-sign to determine how many names there are
			$name.=" ".$words[$i];
			$i++;
			echo $name."<br>";
		}
		$name.=" ".$words[$i]; //First name
		$atPos=stripos($words[count($words)-1],"@");       //Find the position of the @-sign to determine where the login name ends in the last word (that holds the e-mail address)
		$login=substr($words[count($words)-1],0,$atPos) ;  //Parse login name
		$students[$counter]['ssn']=$ssn;
		$students[$counter]['name']=$name;
		$students[$counter]['login']=$login;
		$students[$counter]['passw']=generatePassword(8);
		$counter++;
	}
	
	//Insert students i Student-table and add them to the StudentCourseRegistration-table for the selected course occasion
		$succeeded=0;
			$failed=0;
	for($i=0;$i<count($students);$i++){
		$selectQuery="SELECT * FROM Student WHERE ssn=:SSN OR loginName=:LOGIN;";
		$select_stmt = $pdo->prepare($selectQuery);
		$select_stmt->bindParam(':SSN', $students[$i]['ssn']);
		$select_stmt->bindParam(':LOGIN', $students[$i]['login']);
		$select_stmt->execute();
		if($select_stmt->rowCount()>0){
			$failed++;
			$students[$i]['passw']="HAS PASSWORD";
		} else {					
			$insertQuery="INSERT INTO Student(ssn,name,loginName,passw) VALUES(:SSN,:NAME,:LOGIN,:PASSWORD);"; 
			$insert_stmt = $pdo->prepare($insertQuery);
			$insert_stmt->bindParam(':SSN', $students[$i]['ssn']);
			$insert_stmt->bindParam(':NAME', $students[$i]['name']);
			$insert_stmt->bindParam(':LOGIN', $students[$i]['login']);
			$insert_stmt->bindParam(':PASSWORD', md5($students[$i]['passw']));
			
			if($insert_stmt->execute()){
				$succeeded++;
			} 
		}
		
		$insertQuery="INSERT IGNORE INTO StudentCourseRegistration(studentSsn,courseName,courseOccasion) VALUES(:SSN,:CNAME,:COCCASION);";
		$insert_stmt = $pdo->prepare($insertQuery);
		$insert_stmt->bindParam(':SSN', $students[$i]['ssn']);
        $insert_stmt->bindParam(':CNAME', $_POST['course']);
        $occation=$_POST['semester']."-".$_POST['year']." LP".$_POST['period'];
		$insert_stmt->bindParam(':COCCASION', $occation);
		$insert_stmt->execute();
	}
	
	
	//Display result
	$content="registerStudents/parsingResult.html.php";
?>